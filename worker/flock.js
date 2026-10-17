// «Все птички» (/flock/) и пёрышки комнат (этап 13 Б+В, docs/flock.md).
// API: GET /api/birds — список карточек птичек (sort, q, offset, bird — эта первой; random=1 — одна случайная);
// POST /api/feathers {nick} — пёрышки комнаты (гость отмечается, хозяин видит гостей и гасит новость feathers);
// POST /api/feather {nick} — оставить пёрышко (одно от птички в сутки в каждую комнату).
// Таблицы: room_guests (кто заходил в комнату, последний раз), feathers (пёрышки по дням); users.feathers — сколько всего.

export const FLOCK_TABLES = [
  `CREATE TABLE IF NOT EXISTS room_guests (owner_id INTEGER NOT NULL, guest_id INTEGER NOT NULL, first_at INTEGER, last_at INTEGER, PRIMARY KEY (owner_id, guest_id))`,
  `CREATE INDEX IF NOT EXISTS room_guests_last ON room_guests(owner_id, last_at)`,
  // seen — хозяин видел (новость feathers в конвертике гаснет)
  `CREATE TABLE IF NOT EXISTS feathers (owner_id INTEGER NOT NULL, from_id INTEGER NOT NULL, day TEXT NOT NULL, created_at INTEGER, seen INTEGER DEFAULT 0, PRIMARY KEY (owner_id, from_id, day))`,
];
// feather_day — когда хозяин последний раз видел сводку пёрышек (сводка в конвертике — не чаще раза в сутки)
export const FLOCK_ALTER = ['ALTER TABLE users ADD COLUMN feathers INTEGER DEFAULT 0', "ALTER TABLE users ADD COLUMN feather_day TEXT DEFAULT ''"];

const PER = 24;
const SORTS = {
  recent: 'COALESCE(u.last_seen, u.created_at) DESC, u.id DESC',
  new: 'u.created_at DESC, u.id DESC',
  feathers: 'COALESCE(u.feathers, 0) DESC, COALESCE(u.room_at, 0) DESC, u.id DESC',
  works: 'works DESC, COALESCE(u.last_seen, 0) DESC, u.id DESC',
};
const BIRD = "u.banned = 0 AND u.nick IS NOT NULL AND u.nick != ''";
const COLS = `u.id, u.nick, u.avatar, u.room, COALESCE(u.feathers, 0) AS feathers, (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id AND p.hidden = 0) AS works`;
const parseJ = (s, d) => { try { const v = JSON.parse(s); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } };
const now = () => Math.floor(Date.now() / 1000);

export async function flockApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;
  const body = () => req.json().catch(() => ({}));

  if (m === 'GET' && p === '/api/birds') {
    if (url.searchParams.get('names')) { // все ники — для подсказок «кому подарить» (сумка, зельеварня, «кто пригласил»)
      const r = (await env.DB.prepare(`SELECT u.id, u.nick FROM users u WHERE ${BIRD} ORDER BY u.created_at LIMIT 2000`).all()).results;
      return json({ birds: r }, 200, { 'cache-control': 'public, max-age=60' });
    }
    if (url.searchParams.get('random')) {
      const r = await env.DB.prepare(`SELECT nick FROM users u WHERE ${BIRD} ORDER BY RANDOM() LIMIT 1`).first();
      return json({ nick: r ? r.nick : null });
    }
    const sort = SORTS[url.searchParams.get('sort')] ? url.searchParams.get('sort') : 'recent';
    const off = Math.max(0, Math.floor(Number(url.searchParams.get('offset')) || 0));
    const q = String(url.searchParams.get('q') || '').trim().replace(/^@/, '').replace(/[%_\\]/g, '').slice(0, 40);
    const bird = String(url.searchParams.get('bird') || '').trim().replace(/^@/, '').slice(0, 40);
    const total = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM users u WHERE ${BIRD}`).first()).n;
    const where = BIRD + (q ? ' AND u.nick LIKE ?' : '') + (bird ? ' AND u.nick != ? COLLATE NOCASE' : '');
    const args = [...(q ? ['%' + q + '%'] : []), ...(bird ? [bird] : [])];
    const found = q ? (await env.DB.prepare(`SELECT COUNT(*) AS n FROM users u WHERE ${BIRD} AND u.nick LIKE ?`).bind('%' + q + '%').first()).n : total;
    let rows = (await env.DB.prepare(`SELECT ${COLS} FROM users u WHERE ${where} ORDER BY ${SORTS[sort]} LIMIT ? OFFSET ?`).bind(...args, PER + 1, off).all()).results;
    const more = rows.length > PER; rows = rows.slice(0, PER);
    // ссылка /flock/?bird=ник: эта птичка первой и подсвечена (только на первой странице)
    let first = null;
    if (bird && !off) first = await env.DB.prepare(`SELECT ${COLS} FROM users u WHERE ${BIRD} AND u.nick = ? COLLATE NOCASE`).bind(bird).first();
    if (first) rows = [first, ...rows];
    // серия — как в профиле (по дням работ)
    const ids = rows.map(r => r.id), days = {};
    if (ids.length) (await env.DB.prepare(`SELECT user_id, day, ai FROM posts WHERE user_id IN (${ids.map(() => '?').join(',')})`).bind(...ids).all()).results
      .forEach(r => (days[r.user_id] = days[r.user_id] || []).push(r));
    const birds = rows.map(r => {
      const room = parseJ(r.room, {});
      const home = !!((room.items || []).length || room.wall || room.floor || room.view || room.curtain);
      return { id: r.id, nick: r.nick, avatar: parseJ(r.avatar, {}), room: home ? room : null, works: r.works || 0, feathers: r.feathers || 0, streak: h.streakOf(days[r.id] || []), ...(r === first ? { hi: true } : {}) };
    });
    return json({ total, found, sort, birds, more, next: off + PER }, 200, { 'cache-control': 'public, max-age=60' });
  }

  if (m === 'POST' && p === '/api/feathers') {
    const b = await body(), me = await h.currentUser(req, env);
    const owner = await ownerOf(env, b.nick);
    if (!owner) fail(404, 'user');
    const mine = !!me && me.id === owner.id, can = !!me && !me.banned && !!me.nick;
    if (can && !mine) await env.DB.prepare('INSERT INTO room_guests (owner_id, guest_id, first_at, last_at) VALUES (?, ?, ?, ?) ON CONFLICT (owner_id, guest_id) DO UPDATE SET last_at = excluded.last_at')
      .bind(owner.id, me.id, now(), now()).run();
    if (mine) { // хозяин смотрит свою комнату — сводка в конвертике погасла до завтра
      await env.DB.prepare('UPDATE feathers SET seen = 1 WHERE owner_id = ? AND seen = 0').bind(owner.id).run();
      await env.DB.prepare('UPDATE users SET feather_day = ? WHERE id = ?').bind(h.rigaDay(), owner.id).run();
    }
    return json(await stateOf(env, owner, me, mine, h));
  }

  if (m === 'POST' && p === '/api/feather') {
    const me = await h.needUser(req, env);
    if (!me.nick) fail(400, 'nick');
    const owner = await ownerOf(env, (await body()).nick);
    if (!owner) fail(404, 'user');
    if (owner.id === me.id) fail(400, 'own');
    const r = await env.DB.prepare('INSERT OR IGNORE INTO feathers (owner_id, from_id, day, created_at) VALUES (?, ?, ?, ?)').bind(owner.id, me.id, h.rigaDay(), now()).run();
    if (!r.meta.changes) fail(409, 'today');
    await env.DB.batch([
      env.DB.prepare('UPDATE users SET feathers = COALESCE(feathers, 0) + 1 WHERE id = ?').bind(owner.id),
      env.DB.prepare('INSERT INTO room_guests (owner_id, guest_id, first_at, last_at) VALUES (?, ?, ?, ?) ON CONFLICT (owner_id, guest_id) DO UPDATE SET last_at = excluded.last_at').bind(owner.id, me.id, now(), now()),
    ]);
    const n = (owner.feathers || 0) + 1;
    if (n % 10 === 0) await h.flockEvent('feathers', owner, { n }); // «Комнате @ник оставили 10 пёрышек» (новости стаи, часть Г)
    return json({ ok: true, ...(await stateOf(env, { ...owner, feathers: n }, me, false, h)) });
  }
  return null;
}

const ownerOf = (env, nick) => {
  nick = String(nick || '').replace(/^@/, '').trim();
  return nick ? env.DB.prepare('SELECT id, nick, COALESCE(feathers, 0) AS feathers FROM users WHERE nick = ? AND banned = 0').bind(nick).first() : null;
};

// гость: сколько пёрышек и оставил ли сегодня; хозяин — ещё сколько было гостей, сколько из них оставили пёрышко и последние гости
async function stateOf(env, owner, me, mine, h) {
  const out = { feathers: owner.feathers || 0, mine };
  if (me && !mine) out.given = !!(await env.DB.prepare('SELECT 1 FROM feathers WHERE owner_id = ? AND from_id = ? AND day = ?').bind(owner.id, me.id, h.rigaDay()).first());
  if (mine) {
    out.guests = (await env.DB.prepare('SELECT COUNT(*) AS n FROM room_guests WHERE owner_id = ?').bind(owner.id).first()).n;
    out.givers = (await env.DB.prepare('SELECT COUNT(DISTINCT from_id) AS n FROM feathers WHERE owner_id = ?').bind(owner.id).first()).n;
    out.last = (await env.DB.prepare(`SELECT u.id, u.nick, g.last_at AS at, EXISTS (SELECT 1 FROM feathers f WHERE f.owner_id = g.owner_id AND f.from_id = g.guest_id) AS feather
      FROM room_guests g JOIN users u ON u.id = g.guest_id WHERE g.owner_id = ? AND u.banned = 0 AND u.nick IS NOT NULL ORDER BY g.last_at DESC LIMIT 8`).bind(owner.id).all()).results
      .map(r => ({ nick: r.nick, at: r.at, feather: !!r.feather }));
  }
  return out;
}

// новость feathers (NEWS_KINDS в worker/index.js): невиданные пёрышки одной сводкой; после просмотра — следующая не раньше завтрашнего дня
export async function featherNews(env, u, today) {
  if (u.feather_day === today) return null;
  const r = (await env.DB.prepare(`SELECT u.nick FROM feathers f JOIN users u ON u.id = f.from_id WHERE f.owner_id = ? AND f.seen = 0 ORDER BY f.created_at DESC LIMIT 50`).bind(u.id).all()).results;
  return r.length ? { n: r.length, from: [...new Set(r.map(x => x.nick).filter(Boolean))].slice(0, 3) } : null;
}
