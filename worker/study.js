// Личный учебник «Full Stack Java · Angular» (/study/, docs/site.md «Учебник»): только для птички Mr.Pepe и Алины.
// Страница не лежит в site/ (там всё публично): её отдаёт worker из study-page.js (собирает tools/study_page.py из content/study/textbook.html).
// Галочки и лучшие результаты тестов — у каждого свои: GET /api/study → {state}, POST /api/study {state} (ключ галочки → 1, qzN → лучший % теста главы N).
import { STUDY_HTML } from './study-page.js';

export const STUDY_NICKS = ['mr.pepe'];
export const STUDY_TABLES = [
  'CREATE TABLE IF NOT EXISTS study_progress (user_id INTEGER PRIMARY KEY, state TEXT, updated_at INTEGER)',
];
const KEY = /^[a-z0-9-]{1,24}$/, MAX_KEYS = 500;

// h: isAdmin, adminIdentity
export async function studyOk(u, env, h) {
  if (!u || u.banned) return false;
  if (u.nick && STUDY_NICKS.includes(String(u.nick).toLowerCase())) return true;
  return !!(await h.isAdmin(u, env) || await h.adminIdentity(u, env));
}

const LOCKED = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Страница закрыта</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#2B1A51;color:#F3EFFA;font:17px/1.6 system-ui,sans-serif;padding:16px;text-align:center}a{color:#F0A987}</style></head>
<body><main><h1>Страница закрыта</h1><p>Это личная страница. Войдите на сайт под своим ником и откройте её снова.</p><p><a href="/">pigeonpolly.com</a></p></main></body></html>`;
const page = (html, status) => new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } });

// h: json, fail, currentUser, isAdmin, adminIdentity
export async function studyApi(req, env, url, h) {
  const p = url.pathname, m = req.method;
  const u = await h.currentUser(req, env);
  const ok = await studyOk(u, env, h);
  if (p !== '/api/study') return m === 'GET' ? page(ok ? STUDY_HTML : LOCKED, ok ? 200 : 403) : page(LOCKED, 405);
  if (!ok) h.fail(u ? 403 : 401, u ? 'forbidden' : 'login');
  if (m === 'GET') {
    const r = await env.DB.prepare('SELECT state FROM study_progress WHERE user_id = ?').bind(u.id).first();
    let state = {}; try { state = JSON.parse((r && r.state) || '{}') || {}; } catch (e) { state = {}; }
    return h.json({ state }, 200, { 'cache-control': 'no-store' });
  }
  if (m !== 'POST') return null;
  const b = await req.json().catch(() => ({}));
  const state = {};
  for (const k of Object.keys((b && typeof b.state === 'object' && b.state) || {}).slice(0, MAX_KEYS)) if (KEY.test(k) && b.state[k]) state[k] = /^qz\d+$/.test(k) ? Math.max(1, Math.min(100, Math.round(+b.state[k]) || 1)) : 1; // qzN — лучший % теста главы N
  await env.DB.prepare(`INSERT INTO study_progress (user_id, state, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at`).bind(u.id, JSON.stringify(state), Date.now()).run();
  return h.json({ ok: true });
}
