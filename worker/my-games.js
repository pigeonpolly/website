// «★ Мои игры» на главной (вкладка в «Моём дне», docs/site.md): 3 закреплённые игры птички и сколько раз она заходила в каждую.
// Закрепа нет — главная берёт игры, в которые птичка заходит чаще всего (visits). Заход — POST /api/games/visit со страницы игры (site.js, раз за сессию).
// API: GET /api/games/mine → {pins, visits}; POST /api/games/mine {pins} (до 3); POST /api/games/visit {path}.

export const MY_GAMES_TABLES = [
  'CREATE TABLE IF NOT EXISTS my_games (user_id INTEGER PRIMARY KEY, pins TEXT, visits TEXT, updated_at INTEGER)',
];
// страницы игр (без /ru, /lv) — те же, что плитки «Игр» на главной
export const MY_GAMES = ['/rain/', '/potions/', '/pancakes/', '/titos/', '/shift/', '/polly-office/', '/wobbleland/', '/advent/'];
export const MY_PINS = 3;

const parse = (s, d) => { try { return JSON.parse(s) || d; } catch (e) { return d; } };

// h: json, fail, currentUser, needUser
export async function myGamesApi(req, env, url, h) {
  const p = url.pathname, m = req.method, { json, fail } = h;
  const rowOf = async uid => {
    const r = await env.DB.prepare('SELECT pins, visits FROM my_games WHERE user_id = ?').bind(uid).first();
    return { pins: parse(r && r.pins, []).filter(x => MY_GAMES.includes(x)), visits: parse(r && r.visits, {}) };
  };
  const save = (uid, d) => env.DB.prepare(`INSERT INTO my_games (user_id, pins, visits, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET pins = excluded.pins, visits = excluded.visits, updated_at = excluded.updated_at`)
    .bind(uid, JSON.stringify(d.pins), JSON.stringify(d.visits), Date.now()).run();
  if (m === 'GET' && p === '/api/games/mine') {
    const u = await h.currentUser(req, env);
    return json(u ? await rowOf(u.id) : { pins: [], visits: {} }, 200, { 'cache-control': 'no-store' });
  }
  if (m !== 'POST') return null;
  const u = await h.needUser(req, env);
  const b = await req.json().catch(() => ({}));
  const d = await rowOf(u.id);
  if (p === '/api/games/mine') {
    if (!Array.isArray(b.pins)) fail(400, 'pins');
    d.pins = [...new Set(b.pins.map(String))].filter(x => MY_GAMES.includes(x)).slice(0, MY_PINS);
    await save(u.id, d);
    return json({ pins: d.pins });
  }
  if (p === '/api/games/visit') {
    const x = String(b.path || '').replace(/^\/(ru|lv)(?=\/)/, '');
    if (!MY_GAMES.includes(x)) fail(400, 'path');
    d.visits[x] = (d.visits[x] || 0) + 1;
    await save(u.id, d);
    return json({ ok: true });
  }
  return null;
}
