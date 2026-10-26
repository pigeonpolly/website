// Личный учебник английского A1–C2 (/english/, docs/site.md «Учебник английского»): открыт Алине (админ), ником из ENGLISH_NICKS и тем, кому Алина открыла доступ (english_access).
// Страница не лежит в site/ (там всё публично): её отдаёт worker из english-page.js (собирает tools/english_page.py из content/english/).
// Прогресс у каждого свой: GET /api/english → {state}, POST /api/english {state} — блоки, словарь, ачивки, черновики текстов (english_progress).
import { ENGLISH_HTML } from './english-page.js';

export const ENGLISH_NICKS = [];
export const ENGLISH_TABLES = [
  'CREATE TABLE IF NOT EXISTS english_progress (user_id INTEGER PRIMARY KEY, state TEXT, updated_at INTEGER)',
  'CREATE TABLE IF NOT EXISTS english_access (user_id INTEGER PRIMARY KEY, added_at INTEGER)', // кому Алина открыла учебник (панель «Доступ» на главной учебника)
];
const MAX = 400000, PARTS = ['d', 'w', 'v', 'a', 'days', 'c', 'last', 'k', 'm', 'x', 't', 'rv', 'pd', 'name', 'theme']; // MAX — символов JSON; PARTS — разделы состояния (content/english/engine.js)

// h: isAdmin, adminIdentity
export async function englishOk(u, env, h) {
  if (!u || u.banned) return false;
  if (u.nick && ENGLISH_NICKS.includes(String(u.nick).toLowerCase())) return true;
  if (await env.DB.prepare('SELECT 1 FROM english_access WHERE user_id = ?').bind(u.id).first().catch(() => null)) return true;
  return !!(await h.isAdmin(u, env) || await h.adminIdentity(u, env));
}

const LOCKED = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Страница закрыта</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fbfaff;color:#1f1832;font:17px/1.6 system-ui,sans-serif;padding:16px;text-align:center}a{color:#534ab7}</style></head>
<body><main><h1>Страница закрыта</h1><p>Это личная страница. Войдите на сайт под своим ником и откройте её снова.</p><p><a href="/">pigeonpolly.com</a></p></main></body></html>`;
const page = (html, status) => new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } });

// h: json, fail, currentUser, isAdmin, adminIdentity
export async function englishApi(req, env, url, h) {
  const p = url.pathname, m = req.method;
  const u = await h.currentUser(req, env);
  const ok = await englishOk(u, env, h);
  if (!p.startsWith('/api/english')) return m === 'GET' ? page(ok ? ENGLISH_HTML.replace("'/*UID*/'", JSON.stringify(String(u.id))) : LOCKED, ok ? 200 : 403) : page(LOCKED, 405); // id — ключ прогресса в браузере
  if (!ok) h.fail(u ? 403 : 401, u ? 'forbidden' : 'login');
  if (p === '/api/english/access') { // только админ: GET — список, POST {nick, on} — открыть / закрыть доступ птичке по нику
    if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
    if (m === 'POST') {
      const b = await req.json().catch(() => ({})), nick = String(b.nick || '').trim().replace(/^@/, '');
      const t = nick && await env.DB.prepare('SELECT id, nick FROM users WHERE lower(nick) = lower(?)').bind(nick).first();
      if (!t) h.fail(404, 'no_user');
      if (b.on === false) await env.DB.prepare('DELETE FROM english_access WHERE user_id = ?').bind(t.id).run();
      else await env.DB.prepare('INSERT OR IGNORE INTO english_access (user_id, added_at) VALUES (?, ?)').bind(t.id, Date.now()).run();
    }
    const r = await env.DB.prepare('SELECT u.nick, a.added_at FROM english_access a JOIN users u ON u.id = a.user_id ORDER BY a.added_at DESC').all();
    return h.json({ list: (r.results || []).map(x => ({ nick: x.nick, at: x.added_at })) }, 200, { 'cache-control': 'no-store' });
  }
  if (m === 'GET') {
    const r = await env.DB.prepare('SELECT state FROM english_progress WHERE user_id = ?').bind(u.id).first();
    let state = {}; try { state = JSON.parse((r && r.state) || '{}') || {}; } catch (e) { state = {}; }
    return h.json({ state }, 200, { 'cache-control': 'no-store' });
  }
  if (m !== 'POST') return null;
  const b = await req.json().catch(() => ({}));
  const src = (b && typeof b.state === 'object' && b.state) || {}, state = {};
  for (const k of PARTS) if (src[k] !== undefined) state[k] = src[k];
  const s = JSON.stringify(state);
  if (s.length > MAX) h.fail(413, 'too big');
  await env.DB.prepare(`INSERT INTO english_progress (user_id, state, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at`).bind(u.id, s, Date.now()).run();
  return h.json({ ok: true });
}
