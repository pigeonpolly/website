// «Смена с Полли» (/shift/, этап 29, site/assets/shift.js, docs/rooms.md): таймер работы вместе с Полли.
// Засчитываются только доигранные до конца смены (не быстрее заявленного времени от старта); минуты копятся в users.shift_min.
// Каждый полный час (60 мин в сумме) — «повышение» (номер должности = ⌊минут / 60⌋, названия — в shift.js) и shiftBtn 🔘 (ref — номер часа, один раз).
// Одна смена на птичку: новый старт отменяет прежнюю. API: GET /api/shift, POST /api/shift/{start,done}.

export const SHIFT_TABLES = [
  // done: 0 — идёт, 1 — засчитана, 2 — отменена новым стартом
  'CREATE TABLE IF NOT EXISTS shift_runs (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, started INTEGER NOT NULL, min INTEGER NOT NULL, done INTEGER DEFAULT 0)',
];
export const SHIFT_ALTER = ['ALTER TABLE users ADD COLUMN shift_min INTEGER DEFAULT 0'];
export const SHIFT_RULES = { shiftOn: true, shiftBtn: 1 }; // давать пуговки за смены; 🔘 за каждый отработанный час
export const SHIFT_RANGE = { shiftBtn: [0, 100] };
export const SHIFT_INT = ['shiftBtn'];
export const SHIFT_MIN = 5, SHIFT_MAX = 180; // своё время — от 5 мин до 3 ч

// h: json, fail, currentUser, needUser, rules, award, randomHex
export async function shiftApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h, R = h.rules();
  const out = (total, extra) => json({ on: R.shiftOn, btn: R.shiftBtn, total, rank: Math.floor(total / 60), ...extra });
  if (m === 'GET' && p === '/api/shift') {
    const u = await h.currentUser(req, env);
    return out(u ? u.shift_min || 0 : 0, { me: !!(u && u.nick && !u.banned) });
  }
  if (m !== 'POST') return null;
  const u = await h.needUser(req, env);
  if (!u.nick || u.banned) fail(400, 'nick');
  const b = await req.json().catch(() => ({}));
  if (p === '/api/shift/start') {
    const min = Math.round(Number(b.min) || 0);
    if (min < SHIFT_MIN || min > SHIFT_MAX) fail(400, 'min');
    const id = h.randomHex(12);
    await env.DB.batch([
      env.DB.prepare('UPDATE shift_runs SET done = 2 WHERE user_id = ? AND done = 0').bind(u.id),
      env.DB.prepare('INSERT INTO shift_runs (id, user_id, started, min) VALUES (?, ?, ?, ?)').bind(id, u.id, Date.now(), min),
    ]);
    return json({ run: id });
  }
  if (p === '/api/shift/done') {
    const r = await env.DB.prepare('SELECT * FROM shift_runs WHERE id = ? AND user_id = ?').bind(String(b.run || ''), u.id).first();
    if (!r) fail(404, 'run');
    if (r.done !== 0) fail(409, 'done');
    if (Date.now() - r.started < r.min * 60000 - 15000) fail(429, 'early');
    const upd = await env.DB.prepare('UPDATE shift_runs SET done = 1 WHERE id = ? AND done = 0').bind(r.id).run();
    if (!upd.meta.changes) fail(409, 'done');
    await env.DB.prepare('UPDATE users SET shift_min = COALESCE(shift_min, 0) + ? WHERE id = ?').bind(r.min, u.id).run();
    const total = ((await env.DB.prepare('SELECT shift_min FROM users WHERE id = ?').bind(u.id).first()) || {}).shift_min || 0;
    const was = Math.floor((total - r.min) / 60), now = Math.floor(total / 60);
    let got = 0;
    if (R.shiftOn && R.shiftBtn > 0) for (let hr = was + 1; hr <= now; hr++) got += await h.award(u.id, 'shift', String(hr), R.shiftBtn);
    const left = ((await env.DB.prepare('SELECT buttons FROM users WHERE id = ?').bind(u.id).first()) || {}).buttons || 0;
    return out(total, { promoted: now - was, got, buttons: left });
  }
  return null;
}
