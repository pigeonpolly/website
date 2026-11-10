// Личный учебник норвежского (букмол) A1–C2 (/norsk/, docs/site.md «Учебник норвежского») — устроен как worker/english.js: открыт Алине (админ), ником из NORSK_NICKS и тем, кому Алина открыла доступ (norsk_access).
// Страница — из norsk-page.js (собирает tools/norsk_page.py из content/norsk/). Прогресс: GET/POST /api/norsk {state} (norsk_progress).
import { NORSK_HTML } from './norsk-page.js';

export const NORSK_NICKS = [];
export const NORSK_TABLES = [
  'CREATE TABLE IF NOT EXISTS norsk_progress (user_id INTEGER PRIMARY KEY, state TEXT, updated_at INTEGER)',
  'CREATE TABLE IF NOT EXISTS norsk_access (user_id INTEGER PRIMARY KEY, added_at INTEGER)', // кому Алина открыла учебник норвежского (панель «Доступ» на главной учебника)
];
const MAX = 1500000, PARTS = ['d', 'w', 'v', 'a', 'days', 'c', 'last', 'k', 'm', 'x', 't', 'rv', 'pd', 'name', 'theme', 'n', 'ans']; // MAX — символов JSON; PARTS — разделы состояния (content/norsk/engine.js)

// h: isAdmin, adminIdentity
export async function norskOk(u, env, h) {
  if (!u || u.banned) return false;
  if (u.nick && NORSK_NICKS.includes(String(u.nick).toLowerCase())) return true;
  if (await env.DB.prepare('SELECT 1 FROM norsk_access WHERE user_id = ?').bind(u.id).first().catch(() => null)) return true;
  return !!(await h.isAdmin(u, env) || await h.adminIdentity(u, env));
}

const LOCKED = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Страница закрыта</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fbfaff;color:#1f1832;font:17px/1.6 system-ui,sans-serif;padding:16px;text-align:center}a{color:#534ab7}</style></head>
<body><main><h1>Страница закрыта</h1><p>Это личная страница. Войдите на сайт под своим ником и откройте её снова.</p><p><a href="/">pigeonpolly.com</a></p></main></body></html>`;
const page = (html, status) => new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } });

// h: json, fail, currentUser, isAdmin, adminIdentity
export async function norskApi(req, env, url, h) {
  const p = url.pathname, m = req.method;
  const u = await h.currentUser(req, env);
  const ok = await norskOk(u, env, h);
  if (!p.startsWith('/api/norsk')) return m === 'GET' ? page(ok ? NORSK_HTML.replace("'/*UID*/'", JSON.stringify(String(u.id))) : LOCKED, ok ? 200 : 403) : page(LOCKED, 405); // id — ключ прогресса в браузере
  if (!ok) h.fail(u ? 403 : 401, u ? 'forbidden' : 'login');
  if (p === '/api/norsk/access') { // только админ: GET — список, POST {nick, on} — открыть / закрыть доступ птичке по нику
    if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
    if (m === 'POST') {
      const b = await req.json().catch(() => ({})), nick = String(b.nick || '').trim().replace(/^@/, '');
      const t = nick && await env.DB.prepare('SELECT id, nick FROM users WHERE lower(nick) = lower(?)').bind(nick).first();
      if (!t) h.fail(404, 'no_user');
      if (b.on === false) await env.DB.prepare('DELETE FROM norsk_access WHERE user_id = ?').bind(t.id).run();
      else await env.DB.prepare('INSERT OR IGNORE INTO norsk_access (user_id, added_at) VALUES (?, ?)').bind(t.id, Date.now()).run();
    }
    const r = await env.DB.prepare('SELECT u.nick, a.added_at FROM norsk_access a JOIN users u ON u.id = a.user_id ORDER BY a.added_at DESC').all();
    return h.json({ list: (r.results || []).map(x => ({ nick: x.nick, at: x.added_at })) }, 200, { 'cache-control': 'no-store' });
  }
  if (m === 'GET') {
    const r = await env.DB.prepare('SELECT state FROM norsk_progress WHERE user_id = ?').bind(u.id).first();
    let state = {}; try { state = JSON.parse((r && r.state) || '{}') || {}; } catch (e) { state = {}; }
    return h.json({ state }, 200, { 'cache-control': 'no-store' });
  }
  if (m !== 'POST') return null;
  const b = await req.json().catch(() => ({}));
  const src = (b && typeof b.state === 'object' && b.state) || {}, state = {};
  for (const k of PARTS) if (src[k] !== undefined) state[k] = src[k];
  const s = JSON.stringify(state);
  if (s.length > MAX) h.fail(413, 'too big');
  await env.DB.prepare(`INSERT INTO norsk_progress (user_id, state, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at`).bind(u.id, s, Date.now()).run();
  return h.json({ ok: true });
}
