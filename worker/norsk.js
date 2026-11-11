// Личный учебник норвежского (букмол) A1–C2 (/norsk/, docs/site.md «Учебник норвежского») — устроен как worker/english.js: открыт Алине (админ), ником из NORSK_NICKS и тем, кому Алина открыла доступ (norsk_access).
// Страница — из norsk-page.js (собирает tools/norsk_page.py из content/norsk/). Прогресс: GET/POST /api/norsk {state} (norsk_progress).
import { NORSK_HTML } from './norsk-page.js';
import { geminiKey } from './translate.js';

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
  if (p === '/api/norsk/tts') return tts(env, url, h);
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

// Озвучка Gemini TTS: GET /api/norsk/tts?t=текст → audio/wav. Готовый звук — в R2 (MEDIA, norsk-tts/<sha256>.wav), второй раз Gemini не зовём.
// Нет ключа / все модели заняты — 503, движок (content/norsk/engine.js say()) говорит голосом браузера.
const TTS_MODELS = ['gemini-2.5-flash-preview-tts', 'gemini-2.5-flash-tts', 'gemini-2.5-pro-preview-tts'];
const TTS_VOICE = 'Kore';
const AUDIO = { 'content-type': 'audio/wav', 'cache-control': 'private, max-age=31536000, immutable' };
function wav(pcm, rate = 24000) { // Gemini отдаёт голый PCM 16 бит моно — дописываем WAV-заголовок
  const b = new ArrayBuffer(44 + pcm.length), v = new DataView(b), str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + pcm.length, true); str(8, 'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, pcm.length, true);
  new Uint8Array(b, 44).set(pcm); return b;
}
async function tts(env, url, h) {
  const text = String(url.searchParams.get('t') || '').replace(/\s+/g, ' ').trim();
  if (!text || text.length > 500) h.fail(400, 'text');
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(TTS_VOICE + '|' + text)))].map(x => x.toString(16).padStart(2, '0')).join('');
  const r2 = 'norsk-tts/' + hash + '.wav';
  if (env.MEDIA) { const o = await env.MEDIA.get(r2).catch(() => null); if (o) return new Response(o.body, { headers: AUDIO }); }
  const key = await geminiKey(env);
  if (!key) h.fail(503, 'no_key');
  const body = JSON.stringify({ contents: [{ parts: [{ text: 'Read aloud in Norwegian Bokmål, clearly, at a natural pace for a language learner: ' + text }] }],
    generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICE } } } } });
  for (const model of TTS_MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' }, body, signal: AbortSignal.timeout(20000) });
      if (!r.ok) continue; // 404 (нет модели), 429, 503 — следующая
      const d = await r.json(), part = ((d.candidates || [])[0]?.content?.parts || []).find(x => x.inlineData && x.inlineData.data);
      if (!part) continue;
      const rate = +((part.inlineData.mimeType || '').match(/rate=(\d+)/) || [])[1] || 24000;
      const pcm = Uint8Array.from(atob(part.inlineData.data), c => c.charCodeAt(0));
      const out = wav(pcm, rate);
      if (env.MEDIA) await env.MEDIA.put(r2, out, { httpMetadata: { contentType: 'audio/wav' } }).catch(() => null);
      return new Response(out, { headers: AUDIO });
    } catch (e) { /* таймаут — следующая модель */ }
  }
  h.fail(503, 'tts');
}
