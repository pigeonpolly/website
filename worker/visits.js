// Гости в комнате птички (21.11.2026, docs/bird.md «Гость в чужой комнате»): вошедшая птичка, открывшая чужую комнату,
// раз в 4 с отмечается (хозяин опрашивает раз в 2,5 с) (POST /api/room/visit) — хозяин и другие гости видят её в комнате и её действия
// (помахать, обняться, потанцевать, снежок, за стол, спеть, догонялки, подарок, вздремнуть, фото). Опрос — GET /api/room/visitors?id=<хозяин>&home=<комната дома>.
// Строка живёт, пока гость отмечается: старше VISIT_TTL — не показывается и удаляется. Ушёл — POST /api/room/leave.

export const VISIT_TABLES = [
  // owner_id — чья комната, user_id — гость; home — комната дома (living, kitchen…); at — последняя отметка (мс);
  // act — последнее действие, act_n — его номер (растёт — клиенты проигрывают действие один раз)
  'CREATE TABLE IF NOT EXISTS room_visits (owner_id INTEGER NOT NULL, user_id INTEGER NOT NULL, home TEXT DEFAULT \'living\', at INTEGER, act TEXT DEFAULT \'\', act_n INTEGER DEFAULT 0, PRIMARY KEY (owner_id, user_id))',
  'CREATE INDEX IF NOT EXISTS room_visits_at ON room_visits (owner_id, at)',
];
const VISIT_TTL = 20000; // мс без отметки — гость ушёл
const ACTS = ['wave', 'hug', 'dance', 'snow', 'feast', 'sing', 'tag', 'gift', 'nap', 'photo'];
const HOMES = ['living', 'kitchen', 'bedroom', 'crypt', 'bath', 'office'];
const parse = (s, d) => { try { return JSON.parse(s) || d; } catch (e) { return d; } };

async function list(env, owner, t) {
  const rows = (await env.DB.prepare(`SELECT v.user_id AS id, v.home, v.act, v.act_n, u.nick, u.avatar FROM room_visits v JOIN users u ON u.id = v.user_id
    WHERE v.owner_id = ? AND v.at > ? AND u.banned = 0 AND COALESCE(u.nick, '') != '' ORDER BY v.at DESC LIMIT 12`).bind(owner, t - VISIT_TTL).all()).results;
  return rows.map(r => ({ id: r.id, nick: r.nick, avatar: parse(r.avatar, {}), home: r.home || 'living', act: r.act || '', n: r.act_n || 0 }));
}

// h: json, fail, currentUser, needUser
export async function visitsApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h, t = Date.now();
  if (p === '/api/room/visitors' && m === 'GET') {
    const owner = +url.searchParams.get('id') || 0; if (!owner) fail(400, 'id');
    return json({ visitors: await list(env, owner, t), now: t }, 200, { 'cache-control': 'no-store' });
  }
  if (p === '/api/room/visit' && m === 'POST') {
    const u = await h.needUser(req, env), b = await req.json().catch(() => ({}));
    const owner = +b.id || 0, home = HOMES.includes(b.home) ? b.home : 'living', act = ACTS.includes(b.act) || /^use:\d{1,3}$/.test(String(b.act)) ? String(b.act) : ''; // use:N — гость пошёл к вещи N комнаты
    if (!owner || owner === u.id || !u.nick) fail(400, 'id');
    if (!(await env.DB.prepare('SELECT 1 FROM users WHERE id = ? AND banned = 0').bind(owner).first())) fail(404, 'owner');
    await env.DB.prepare(`INSERT INTO room_visits (owner_id, user_id, home, at, act, act_n) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(owner_id, user_id) DO UPDATE SET home = excluded.home, at = excluded.at, act = CASE WHEN ? != '' THEN ? ELSE room_visits.act END, act_n = room_visits.act_n + CASE WHEN ? != '' THEN 1 ELSE 0 END`)
      .bind(owner, u.id, home, t, act, act ? 1 : 0, act, act, act).run();
    if (Math.random() < .05) await env.DB.prepare('DELETE FROM room_visits WHERE at < ?').bind(t - 3600000).run(); // старые строки — иногда
    return json({ visitors: await list(env, owner, t), now: t });
  }
  if (p === '/api/room/leave' && m === 'POST') {
    const u = await h.currentUser(req, env); if (!u) return json({ ok: true });
    const b = await req.json().catch(() => ({}));
    await env.DB.prepare('DELETE FROM room_visits WHERE owner_id = ? AND user_id = ?').bind(+b.id || 0, u.id).run();
    return json({ ok: true });
  }
  return null;
}
