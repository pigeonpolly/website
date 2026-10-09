// Сервер сайта: отдаёт статические файлы из site/ и обслуживает /api/* для «Стены рисунков»:
// вход через Google, ник, загрузка работы дня, серии, стена, топ, модерация, GDPR (экспорт и удаление).
// Данные — Cloudflare D1 (env.DB), картинки челленджа — R2 (env.MEDIA, папка challenge/), старые ещё и в KV (env.IMAGES), пока идёт перенос. Блог — worker/blog.js (картинки блога в R2, env.MEDIA).
import { blogApi, blogPage } from './blog.js';

// sha256 от e-mail администратора (сам адрес в коде не храним)
const ADMIN_HASHES = ['80ac2786b60d61a30d6691a3d40de5d784cdefc580717add788821a7bf900118'];
const SESSION_DAYS = 180;
const MAX_FULL = 2_500_000, MAX_THUMB = 400_000;
const GOLD_PICKS = 15; // 3 звезды «Выбора Полли» (каждые 5 раз — звезда) = золотой ник
const INACTIVE_DAYS = 90; // 3 месяца без загрузок и без входа — картинки можно удалить (уровень и бейджи остаются), но только при заполненном хранилище

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    if (/^\/(?:(?:ru|lv)\/)?blog\//.test(p) || p.startsWith('/media/') || p === '/sitemap-blog.xml') {
      if (!env.DB) return env.ASSETS.fetch(req);
      try { await ensureSchema(env); return await blogPage(req, env, url, helpers(env)); }
      catch (e) { console.error(e); return env.ASSETS.fetch(req); } // если база недоступна — статическая заглушка
    }
    if (!p.startsWith('/api/')) return sitePage(req, env, url);
    if (!env.DB || !env.IMAGES || !env.GOOGLE_CLIENT_ID) return json({ ready: false }, 503);
    try {
      await ensureSchema(env);
      if (p.startsWith('/api/blog/')) return await blogApi(req, env, url, helpers(env));
      return await route(req, env, url);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.code }, e.status);
      console.error(e);
      return json({ error: 'server' }, 500);
    }
  },
  // раз в час (cron в wrangler.jsonc): переносим порцию старых картинок из KV в R2 и, если хранилище почти полное, чистим картинки давно пропавших
  async scheduled(event, env, ctx) {
    if (!env.DB || !env.IMAGES) return;
    await ensureSchema(env);
    ctx.waitUntil((async () => { await migrateToR2(env); await cleanupInactive(env); })());
  },
};

// ---------- правки блоков сайта (режим «✏️ Править страницу» для админа) ----------
// страница берётся из статики, а блоки с правками (data-ppb) подменяются на лету; ?raw=1 — оригинал без правок (для редактора)
let blocksCache = { at: 0, rows: null };
async function siteBlocks(env) {
  if (blocksCache.rows && Date.now() - blocksCache.at < 20000) return blocksCache.rows;
  await ensureSchema(env);
  const rows = (await env.DB.prepare('SELECT id, lang, html, hidden, updated_at FROM site_blocks').all()).results;
  blocksCache = { at: Date.now(), rows };
  return rows;
}
async function sitePage(req, env, url) {
  if (req.method !== 'GET' || !env.DB || url.searchParams.has('raw')) return env.ASSETS.fetch(req);
  let rows;
  try { rows = await siteBlocks(env); } catch (e) { console.error(e); return env.ASSETS.fetch(req); }
  // страницу просим целиком (без «If-None-Match»): ответ браузеру зависит ещё и от правок,
  // поэтому метка версии (ETag) = метка файла + версия правок
  const h = new Headers(req.headers); h.delete('if-none-match'); h.delete('if-modified-since');
  const res = await env.ASSETS.fetch(new Request(req, { headers: h }));
  if (res.status !== 200 || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  const ver = rows.length + '.' + rows.reduce((m, r) => Math.max(m, r.updated_at || 0), 0);
  const etag = `W/"${(res.headers.get('etag') || '').replace(/^W\/|"/g, '')}-${ver}"`;
  if ((req.headers.get('if-none-match') || '') === etag) return new Response(null, { status: 304, headers: { etag, 'cache-control': 'no-cache' } });
  const out = new Response(res.body, res);
  out.headers.set('etag', etag); out.headers.delete('last-modified'); out.headers.set('cache-control', 'no-cache');
  const lang = (url.pathname.match(/^\/(ru|lv)\//) || [])[1] || 'en';
  const hidden = new Set(rows.filter(r => r.lang === '*' && r.hidden).map(r => r.id));
  const html = new Map(rows.filter(r => r.lang === lang && r.html != null).map(r => [r.id, r.html]));
  if (!hidden.size && !html.size) return out;
  return new HTMLRewriter().on('[data-ppb]', {
    element(el) {
      const id = el.getAttribute('data-ppb');
      if (hidden.has(id)) el.setAttribute('data-ppb-hidden', ''); // скрыт: админ видит его в режиме правки и может вернуть
      if (html.has(id)) { el.setInnerContent(html.get(id), { html: true }); el.setAttribute('data-ppb-edited', ''); }
    },
  }).transform(out);
}

// ---------- аватар: что надето из подарков (фон, обувь, головной убор, анимация, рамка) ----------
const GIFT_KINDS = ['bg', 'shoes', 'hat', 'anim', 'frame', 'item', 'scarf'];
const avatarOf = u => { try { const a = JSON.parse(u && u.avatar || '{}'); return a && typeof a === 'object' ? a : {}; } catch (e) { return {}; } };
const okItem = (kind, item) => GIFT_KINDS.includes(kind) && /^[#a-z0-9:-]{1,24}$/i.test(String(item || ''));

// общие функции для worker/blog.js
const helpers = env => ({ json, fail, cookie, currentUser, needUser, isAdmin, now, getMeta: k => getMeta(env, k), setMeta: (k, v) => setMeta(env, k, v) });

class HttpError extends Error { constructor(status, code) { super(code); this.status = status; this.code = code; } }
const fail = (status, code) => { throw new HttpError(status, code); };
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

// ---------- база ----------
let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, sub TEXT UNIQUE NOT NULL, email TEXT, nick TEXT UNIQUE COLLATE NOCASE,
      consent INTEGER DEFAULT 0, banned INTEGER DEFAULT 0, created_at INTEGER)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires INTEGER NOT NULL)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, day TEXT NOT NULL, theme TEXT, bw INTEGER DEFAULT 0,
      created_at INTEGER, hidden INTEGER DEFAULT 0, UNIQUE(user_id, day))`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS posts_created ON posts(created_at)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)`),
    // подписка «сообщите, когда выйдет книга»: только адрес, язык и текст согласия (GDPR); рассылает Алина вручную
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, topic TEXT NOT NULL DEFAULT 'books',
      lang TEXT, consent TEXT, created_at INTEGER, UNIQUE(email, topic))`),
    // правки блоков сайта из режима «✏️ Править страницу»: id = data-ppb блока, lang = en/ru/lv; hidden — скрыт на всех языках (lang = '*')
    // подарки-семечки для аватара: Алина выдаёт из кабинета; status: new — ещё не открыт, bag — в сумке (удалить нельзя)
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS gifts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, kind TEXT NOT NULL, item TEXT NOT NULL, note TEXT, status TEXT DEFAULT 'new', created_at INTEGER, opened_at INTEGER)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS site_blocks (id TEXT NOT NULL, lang TEXT NOT NULL, html TEXT, hidden INTEGER DEFAULT 0, page TEXT, updated_at INTEGER, PRIMARY KEY (id, lang))`),
  ]);
  // новые колонки для уже созданной базы: рекорд и бейджи, которые остаются после очистки картинок
  for (const sql of ["ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT ''", 'ALTER TABLE users ADD COLUMN best INTEGER DEFAULT 0', "ALTER TABLE users ADD COLUMN badges TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN months TEXT DEFAULT ''", 'ALTER TABLE posts ADD COLUMN tod INTEGER',
    'ALTER TABLE users ADD COLUMN picks INTEGER DEFAULT 0', 'ALTER TABLE posts ADD COLUMN picked INTEGER DEFAULT 0',
    "ALTER TABLE users ADD COLUMN mcount TEXT DEFAULT ''", 'ALTER TABLE posts ADD COLUMN bytes INTEGER', 'ALTER TABLE users ADD COLUMN last_seen INTEGER',
    // перенос картинок в R2: store = 'r2' — картинка уже в R2; kv = 1 — копия ещё лежит в KV
    'ALTER TABLE posts ADD COLUMN store TEXT', 'ALTER TABLE posts ADD COLUMN kv INTEGER DEFAULT 1']) {
    try { await env.DB.prepare(sql).run(); } catch (e) { /* колонка уже есть */ }
  }
  schemaReady = true;
}

const now = () => Math.floor(Date.now() / 1000);
const randomHex = n => [...crypto.getRandomValues(new Uint8Array(n))].map(b => b.toString(16).padStart(2, '0')).join('');
async function sha256(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------- сессия ----------
function cookie(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}
const sessionCookie = (token, maxAge) => `pp_s=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
async function currentUser(req, env) {
  const token = cookie(req, 'pp_s');
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const u = await env.DB.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires > ?`)
    .bind(token, now()).first();
  // «был недавно» для стаи на главной: обновляем не чаще раза в 10 минут
  if (u && (u.last_seen || 0) < now() - 600) await env.DB.prepare('UPDATE users SET last_seen = ? WHERE id = ?').bind(now(), u.id).run();
  return u;
}
async function needUser(req, env) {
  const u = await currentUser(req, env);
  if (!u) fail(401, 'login');
  if (u.banned) fail(403, 'banned');
  return u;
}
const isAdmin = async (u, env) => !!u && ((env.DEV_FAKE_LOGIN === '1' && u.sub === 'dev:admin') || (!!u.email && ADMIN_HASHES.includes(await sha256(u.email.toLowerCase()))));

// ---------- Google ID token ----------
let jwks = null, jwksAt = 0;
const b64url = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
async function verifyGoogle(token, env) {
  const [h, p, s] = String(token).split('.');
  if (!h || !p || !s) fail(400, 'token');
  const header = JSON.parse(new TextDecoder().decode(b64url(h)));
  const payload = JSON.parse(new TextDecoder().decode(b64url(p)));
  if (!jwks || Date.now() - jwksAt > 3600e3) {
    jwks = (await (await fetch('https://www.googleapis.com/oauth2/v3/certs')).json()).keys; jwksAt = Date.now();
  }
  const jwk = jwks.find(k => k.kid === header.kid);
  if (!jwk) fail(400, 'token');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(s), new TextEncoder().encode(h + '.' + p));
  if (!ok || payload.aud !== env.GOOGLE_CLIENT_ID || !['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)
    || payload.exp < now() || !payload.sub) fail(400, 'token');
  return { sub: 'g:' + payload.sub, email: payload.email_verified ? payload.email : null };
}

// ---------- серии ----------
const dayNum = d => Math.round(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) / 864e5);
const utcToday = () => Math.floor(Date.now() / 864e5);
function streaks(days) {
  const n = [...new Set(days.map(dayNum))].sort((a, b) => b - a);
  let best = 0, run = 0;
  for (let i = 0; i < n.length; i++) { run = i && n[i - 1] - n[i] === 1 ? run + 1 : 1; best = Math.max(best, run); }
  let current = 0;
  if (n.length && n[0] >= utcToday() - 1) { current = 1; while (current < n.length && n[current - 1] - n[current] === 1) current++; }
  return { current, best };
}

// день ЭКСТРА — та же формула, что в site/assets/challenge-theme.js
function rngFor(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  let a = h >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
}
const extraMemo = {};
function extraDay(y, m) {
  const key = y * 12 + m; if (extraMemo[key]) return extraMemo[key];
  const days = new Date(y, m + 1, 0).getDate(), rm = rngFor('extra-' + y + '-' + m);
  let v = 1 + Math.floor(rm() * days);
  if (key > 2026 * 12 + 9) { const prev = extraDay(m ? y : y - 1, m ? m - 1 : 11); while (v === prev) v = 1 + Math.floor(rm() * days); }
  return (extraMemo[key] = v);
}
function badgesOf(posts, months = []) {
  const got = new Set();
  for (const p of posts) {
    const y = +p.day.slice(0, 4), m = +p.day.slice(5, 7) - 1, d = +p.day.slice(8, 10);
    if (p.bw) got.add('bw');
    if (m === 0 && d === 23) got.add('bday');
    if (d === extraDay(y, m)) got.add('extra');
  }
  const sorted = [...posts].sort((a, b) => a.day < b.day ? -1 : 1);
  // «Через денёк»: 15 загрузок подряд, каждая ровно через день (≈ месяц)
  const n = [...new Set(sorted.map(p => dayNum(p.day)))];
  for (let i = 1, run = 1; i < n.length; i++) { run = n[i] - n[i - 1] === 2 ? run + 1 : 1; if (run >= 15) { got.add('alt'); break; } }
  // «Как по часам»: 10 загрузок подряд в пределах одного часа (по кругу суток)
  const tods = sorted.map(p => p.tod);
  for (let i = 0; i + 10 <= tods.length; i++) {
    const w = tods.slice(i, i + 10);
    if (w.some(t => t == null)) continue;
    const s = [...w].sort((a, b) => a - b);
    let gap = s[0] + 1440 - s[s.length - 1];
    for (let j = 1; j < s.length; j++) gap = Math.max(gap, s[j] - s[j - 1]);
    if (1440 - gap <= 60) { got.add('clock'); break; }
  }
  // «Каждый месяц»: работы в 3 календарных месяцах подряд
  const ms = [...new Set([...months, ...posts.map(p => p.day.slice(0, 7))])].map(k => +k.slice(0, 4) * 12 + +k.slice(5, 7) - 1).sort((a, b) => a - b);
  for (let i = 1, run = 1; i < ms.length; i++) { run = ms[i] - ms[i - 1] === 1 ? run + 1 : 1; if (run >= 3) { got.add('monthly'); break; } }
  return got;
}
// рекорд и бейджи пользователя: из его работ + сохранённое после прошлых очисток
const mergedBest = (u, days) => Math.max(u.best || 0, streaks(days).best);
const monthsOf = u => String(u.months || '').split(',').filter(Boolean);
// работ по месяцам: "2026-10:3,2026-11:2" — хранится в профиле, очистка картинок её не трогает
const VETERAN_MONTHS = 36, VETERAN_PER_MONTH = 2;
const mcountOf = u => Object.fromEntries(String(u.mcount || '').split(',').filter(Boolean).map(x => { const [k, n] = x.split(':'); return [k, +n || 0]; }));
function isVeteran(u) {
  const mc = mcountOf(u);
  const ok = Object.keys(mc).filter(k => mc[k] >= VETERAN_PER_MONTH).map(k => +k.slice(0, 4) * 12 + +k.slice(5, 7) - 1).sort((a, b) => a - b);
  for (let i = 1, run = ok.length ? 1 : 0; i <= ok.length; i++) { if (run >= VETERAN_MONTHS) return true; run = ok[i] - ok[i - 1] === 1 ? run + 1 : 1; }
  return false;
}
const mergedBadges = (u, posts) => [...new Set([...String(u.badges || '').split(',').filter(Boolean), ...badgesOf(posts, monthsOf(u)), ...(isVeteran(u) ? ['veteran'] : [])])];

// ---------- картинки работ: R2 (новые и перенесённые) или KV (старые, пока не перенесены) ----------
const r2Key = (kind, id) => `challenge/${kind}/${id}.jpg`; // kind: i — полная, t — превью
const R2_LIMIT = 10e9; // бесплатные 10 ГБ R2
async function imgPut(env, id, fb, tb) {
  if (env.MEDIA) {
    const meta = { httpMetadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' } };
    await Promise.all([env.MEDIA.put(r2Key('i', id), fb, meta), env.MEDIA.put(r2Key('t', id), tb, meta)]);
    return { store: 'r2', kv: 0 };
  }
  await env.IMAGES.put('i/' + id, fb, { metadata: { type: 'image/jpeg' } });
  await env.IMAGES.put('t/' + id, tb, { metadata: { type: 'image/jpeg' } });
  return { store: null, kv: 1 };
}
async function imgGet(env, kind, id) {
  if (env.MEDIA) { const o = await env.MEDIA.get(r2Key(kind, id)); if (o) return o.arrayBuffer(); }
  return env.IMAGES.get(kind + '/' + id, 'arrayBuffer'); // ещё не перенесена — из KV
}
// удалить картинки работы отовсюду, где они лежат; возвращает число удалений в KV (их бесплатно 1000 в сутки)
async function imgDelete(env, post) {
  const jobs = [];
  if (post.store === 'r2' && env.MEDIA) jobs.push(env.MEDIA.delete([r2Key('i', post.id), r2Key('t', post.id)]));
  if (post.kv !== 0) jobs.push(env.IMAGES.delete('i/' + post.id), env.IMAGES.delete('t/' + post.id));
  await Promise.all(jobs);
  return post.kv !== 0 ? 2 : 0;
}
// перенос старых работ из KV в R2 порциями: копируем, сверяем размер, отмечаем store = 'r2'. Копия в KV остаётся.
async function migrateToR2(env, batch = 100) {
  if (!env.MEDIA) return { moved: 0 };
  const rows = (await env.DB.prepare("SELECT id FROM posts WHERE store IS NULL ORDER BY created_at LIMIT ?").bind(batch).all()).results;
  let moved = 0, missing = 0, failed = 0;
  for (const { id } of rows) {
    try {
      const [a, b] = await Promise.all([env.IMAGES.get('i/' + id, 'arrayBuffer'), env.IMAGES.get('t/' + id, 'arrayBuffer')]);
      if (!a || !b) { missing++; await env.DB.prepare("UPDATE posts SET store = 'missing' WHERE id = ?").bind(id).run(); continue; } // в KV нет — нечего переносить
      const meta = { httpMetadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' } };
      const [x, y] = await Promise.all([env.MEDIA.put(r2Key('i', id), a, meta), env.MEDIA.put(r2Key('t', id), b, meta)]);
      if (!x || !y || x.size !== a.byteLength || y.size !== b.byteLength) { failed++; continue; } // не совпало — попробуем в следующий раз
      await env.DB.prepare("UPDATE posts SET store = 'r2' WHERE id = ?").bind(id).run();
      moved++;
    } catch (e) { failed++; }
  }
  return { moved, missing, failed };
}
async function migrationStatus(env) {
  const r = await env.DB.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN store = 'r2' THEN 1 ELSE 0 END) AS r2, SUM(CASE WHEN store = 'missing' THEN 1 ELSE 0 END) AS missing, SUM(CASE WHEN kv = 1 THEN 1 ELSE 0 END) AS kv FROM posts").first();
  return { total: r.total || 0, r2: r.r2 || 0, missing: r.missing || 0, kv: r.kv || 0 };
}
// занятость хранилища: KV (1 ГБ) — то, что ещё лежит в KV; R2 (10 ГБ) — перенесённое и новое; считаем по более заполненному
async function storageUsed(env) {
  const r = await env.DB.prepare("SELECT COALESCE(SUM(CASE WHEN kv = 1 THEN bytes ELSE 0 END), 0) AS kv, COALESCE(SUM(CASE WHEN store = 'r2' THEN bytes ELSE 0 END), 0) AS r2 FROM posts").first();
  return Math.max(r.kv / KV_LIMIT, r.r2 / R2_LIMIT);
}

// Очистка (решение Алины): удаляем, только когда картинки заняли ≥85% бесплатного KV (1 ГБ).
// Тогда удаляем работы тех, кто больше 3 месяцев ничего не загружал И не заходил на сайт, начиная с самых давно пропавших, пока не станет <80%.
const KV_LIMIT = 1e9, CLEAN_START = 0.85, CLEAN_STOP = 0.8;
async function cleanupInactive(env, limit = KV_LIMIT) {
  // вес работ, загруженных до появления учёта, считаем один раз
  const unknown = (await env.DB.prepare('SELECT id FROM posts WHERE bytes IS NULL LIMIT 200').all()).results;
  for (const p of unknown) {
    const [a, b] = await Promise.all([imgGet(env, 'i', p.id), imgGet(env, 't', p.id)]);
    await env.DB.prepare('UPDATE posts SET bytes = ? WHERE id = ?').bind((a?.byteLength || 0) + (b?.byteLength || 0), p.id).run();
  }
  // занято: в KV (лимит limit) и в R2 (в 10 раз больше); решает более заполненное
  const r = await env.DB.prepare("SELECT COALESCE(SUM(CASE WHEN kv = 1 THEN bytes ELSE 0 END), 0) AS kv, COALESCE(SUM(CASE WHEN store = 'r2' THEN bytes ELSE 0 END), 0) AS r2 FROM posts").first();
  let kvUsed = r.kv, r2Used = r.r2;
  const frac = () => Math.max(kvUsed / limit, r2Used / (limit * R2_LIMIT / KV_LIMIT));
  const report = { kv: kvUsed, r2: r2Used, limit, percent: Math.round(frac() * 1000) / 10, users: 0, deletes: 0 };
  if (frac() < CLEAN_START) return report;
  const cutoff = new Date((utcToday() - INACTIVE_DAYS) * 864e5).toISOString().slice(0, 10);
  const users = (await env.DB.prepare(`SELECT u.*, MAX(p.day) AS last FROM users u JOIN posts p ON p.user_id = u.id
    WHERE COALESCE(u.last_seen, 0) < ? GROUP BY u.id HAVING last < ? ORDER BY last ASC LIMIT 200`).bind(now() - INACTIVE_DAYS * 86400, cutoff).all()).results;
  for (const u of users) {
    if (frac() < CLEAN_STOP) break;
    if (await isAdmin(u, env)) continue; // работы Алины не удаляются, пока она сама их не удалит
    const posts = (await env.DB.prepare('SELECT id, day, bw, tod, bytes, store, kv FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    if (report.deletes + posts.filter(x => x.kv !== 0).length * 2 > 900) break; // бесплатный лимит KV — 1000 удалений в сутки
    await env.DB.prepare('UPDATE users SET best = ?, badges = ? WHERE id = ?')
      .bind(mergedBest(u, posts.map(p => p.day)), mergedBadges(u, posts).join(','), u.id).run();
    for (const p of posts) { report.deletes += await imgDelete(env, p); if (p.kv !== 0) kvUsed -= p.bytes || 0; if (p.store === 'r2') r2Used -= p.bytes || 0; }
    await env.DB.prepare('DELETE FROM posts WHERE user_id = ?').bind(u.id).run();
    report.users++;
  }
  report.percentAfter = Math.round(frac() * 1000) / 10;
  return report;
}

// «Выбор Полли»: один текущий рисунок, его автор — носитель бейджа; прошлые носители получают 'pick_past'
const getMeta = async (env, k) => (await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(k).first())?.value ?? null;
const setMeta = (env, k, v) => env.DB.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(k, v).run();
// счётчики «с момента создания сайта»: только растут (удаления их не уменьшают)
async function bump(env, key, countSql) {
  const cur = await getMeta(env, key);
  const base = cur === null ? (await env.DB.prepare(countSql).first()).n - 1 : Number(cur);
  await setMeta(env, key, String(base + 1));
}
async function addBadge(env, uid, badge) {
  const u = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(uid).first();
  if (!u) return;
  const set = new Set(String(u.badges || '').split(',').filter(Boolean)); set.add(badge);
  await env.DB.prepare('UPDATE users SET badges = ? WHERE id = ?').bind([...set].join(','), uid).run();
}

// ---------- маршруты ----------
async function route(req, env, url) {
  const p = url.pathname, m = req.method;
  if (m === 'POST' && p === '/api/dev/migrate' && env.DEV_FAKE_LOGIN === '1') return json({ ...(await migrateToR2(env, Number(url.searchParams.get('batch')) || 100)), status: await migrationStatus(env) });
  if (m === 'POST' && p === '/api/dev/cleanup' && env.DEV_FAKE_LOGIN === '1') return json(await cleanupInactive(env, Number(url.searchParams.get('limit')) || KV_LIMIT));
  // публичный профиль: ник, серия, рекорд, бейджи и работы на стене (e-mail не отдаём)
  if (m === 'GET' && p === '/api/profile') {
    const nick = String(url.searchParams.get('nick') || '').replace(/^@/, '');
    const u = await env.DB.prepare('SELECT * FROM users WHERE nick = ? AND banned = 0').bind(nick).first();
    if (!u) fail(404, 'user');
    const rows = (await env.DB.prepare('SELECT id, day, theme, bw, tod, hidden FROM posts WHERE user_id = ? ORDER BY day DESC').bind(u.id).all()).results;
    const pickUser = Number(await getMeta(env, 'pick_user'));
    const badges = mergedBadges(u, rows).filter(b => b !== 'pick_past' || pickUser !== u.id);
    if (pickUser === u.id) badges.push('pick');
    return json({ id: u.id, avatar: avatarOf(u), nick: u.nick, gold: (u.picks || 0) >= GOLD_PICKS, picks: u.picks || 0, current: streaks(rows.map(r => r.day)).current,
      best: mergedBest(u, rows.map(r => r.day)), badges, posts: rows.filter(r => !r.hidden).map(({ id, day, theme, bw }) => ({ id, day, theme, bw })) });
  }

  if (m === 'GET' && p === '/api/stats') {
    const works = await getMeta(env, 'works_total') ?? (await env.DB.prepare('SELECT COUNT(*) AS n FROM posts').first()).n;
    const users = await getMeta(env, 'users_total') ?? (await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first()).n;
    const birds = (await env.DB.prepare('SELECT COUNT(*) AS n FROM users WHERE banned = 0').first()).n; // как счётчик «Стаи»
    const posts = (await env.DB.prepare("SELECT COUNT(*) AS n FROM blog_posts WHERE status = 'published' AND COALESCE(published_at, 0) <= CAST(strftime('%s', 'now') AS INTEGER)").first().catch(() => ({ n: 0 }))).n;
    return json({ works: Number(works), users: Number(users), birds, posts }, 200, { 'cache-control': 'public, max-age=60' });
  }
  // «Стая» на главной: все, кто хоть раз входил; когда их много — те, кто заходил недавно (+ сам посетитель)
  if (m === 'GET' && p === '/api/flock') {
    const LIMIT = Math.min(60, Math.max(36, parseInt(url.searchParams.get('limit')) || 36)); // главная — 36, страница «Стая» — до 60
    const me = await currentUser(req, env);
    const total = (await env.DB.prepare('SELECT COUNT(*) AS n FROM users WHERE banned = 0').first()).n;
    let rows = (await env.DB.prepare(`SELECT id, nick, avatar FROM users WHERE banned = 0 ORDER BY COALESCE(last_seen, created_at) DESC LIMIT ?`).bind(LIMIT).all()).results;
    if (me && !me.banned && !rows.some(r => r.id === me.id)) rows = [{ id: me.id, nick: me.nick, avatar: me.avatar }, ...rows.slice(0, LIMIT - 1)];
    return json({ total, recent: total > LIMIT, birds: rows.map(r => ({ id: r.id, nick: r.nick || null, me: !!me && r.id === me.id, avatar: avatarOf(r) })) });
  }
  // «Найти птичку»: по нику (сначала точное совпадение, потом начало ника)
  // ---------- подписка на новость о книге ----------
  if (m === 'POST' && p === '/api/subscribe') {
    const b = await req.json().catch(() => ({}));
    if (b.website) return json({ ok: true }); // ловушка для ботов
    const email = String(b.email || '').trim().toLowerCase().slice(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail(400, 'email');
    if (!b.consent) fail(400, 'consent');
    const topic = ['books', 'news'].includes(b.topic) ? b.topic : 'books';
    await env.DB.prepare('INSERT OR IGNORE INTO subscribers (email, topic, lang, consent, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(email, topic, ['en', 'ru', 'lv'].includes(b.lang) ? b.lang : 'en', String(b.consentText || '').slice(0, 500), now()).run();
    return json({ ok: true });
  }
  if (m === 'POST' && p === '/api/unsubscribe') {
    const b = await req.json().catch(() => ({}));
    const email = String(b.email || '').trim().toLowerCase();
    await env.DB.prepare('DELETE FROM subscribers WHERE email = ?').bind(email).run();
    return json({ ok: true }); // одинаковый ответ, даже если адреса не было
  }
  // все птицы (аккаунты) для кабинета: ник, когда появились, когда заходили, сколько работ
  if (m === 'GET' && p === '/api/admin/users') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    return json({ users: (await env.DB.prepare(`SELECT u.id, u.nick, u.created_at, u.last_seen, u.banned, u.best, u.picks, u.avatar,
      (SELECT COUNT(*) FROM gifts g WHERE g.user_id = u.id) AS gifts,
      (SELECT COUNT(*) FROM posts w WHERE w.user_id = u.id) AS works FROM users u ORDER BY u.created_at DESC`).all()).results });
  }
  if (p === '/api/admin/blocks') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    if (m === 'POST') {
      const b = await req.json().catch(() => ({}));
      const id = String(b.id || ''), lang = String(b.lang || '');
      if (!/^[a-z0-9.-]{1,80}$/.test(id) || !['en', 'ru', 'lv', '*'].includes(lang)) fail(400, 'bad');
      if (lang === '*') {
        if (b.hidden) await env.DB.prepare('INSERT INTO site_blocks (id, lang, hidden, page, updated_at) VALUES (?, ?, 1, ?, ?) ON CONFLICT(id, lang) DO UPDATE SET hidden = 1, page = excluded.page, updated_at = excluded.updated_at').bind(id, '*', String(b.page || '').slice(0, 200), now()).run();
        else await env.DB.prepare("DELETE FROM site_blocks WHERE id = ? AND lang = '*'").bind(id).run();
      } else if (b.html == null) await env.DB.prepare('DELETE FROM site_blocks WHERE id = ? AND lang = ?').bind(id, lang).run(); // «вернуть как было»
      else {
        const html = String(b.html);
        if (html.length > 300000) fail(413, 'big');
        await env.DB.prepare('INSERT INTO site_blocks (id, lang, html, page, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id, lang) DO UPDATE SET html = excluded.html, page = excluded.page, updated_at = excluded.updated_at')
          .bind(id, lang, html, String(b.page || '').slice(0, 200), now()).run();
      }
      blocksCache = { at: 0, rows: null };
    }
    return json({ blocks: (await env.DB.prepare('SELECT id, lang, hidden, page, updated_at, html FROM site_blocks ORDER BY updated_at DESC').all()).results });
  }
  if (p === '/api/admin/subscribers') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    if (m === 'POST') { const b = await req.json().catch(() => ({})); await env.DB.prepare('DELETE FROM subscribers WHERE id = ?').bind(Number(b.id)).run(); }
    return json({ subscribers: (await env.DB.prepare('SELECT id, email, topic, lang, consent, created_at FROM subscribers ORDER BY created_at DESC').all()).results });
  }
  if (m === 'GET' && p === '/api/flock/find') {
    const q = String(url.searchParams.get('nick') || '').trim().replace(/^@/, '').slice(0, 40);
    if (q.length < 2) return json({ birds: [] });
    const exact = await env.DB.prepare('SELECT id, nick FROM users WHERE banned = 0 AND nick = ? COLLATE NOCASE').bind(q).first();
    const rows = exact ? [exact] : (await env.DB.prepare("SELECT id, nick FROM users WHERE banned = 0 AND nick LIKE ? ESCAPE '\\' ORDER BY COALESCE(last_seen, created_at) DESC LIMIT 5")
      .bind(q.replace(/[\\%_]/g, c => '\\' + c) + '%').all()).results;
    return json({ birds: rows.map(r => ({ id: r.id, nick: r.nick })) });
  }
  // шапка сайта: кто вошёл (для кнопки входа и птички-аватара)
  if (m === 'GET' && p === '/api/whoami') {
    const u = await currentUser(req, env);
    return json({ user: u && !u.banned ? { id: u.id, nick: u.nick || null, admin: await isAdmin(u, env), avatar: avatarOf(u) } : null, clientId: env.GOOGLE_CLIENT_ID, dev: env.DEV_FAKE_LOGIN === '1' });
  }
  if (m === 'GET' && p === '/api/config') return json({ ready: true, clientId: env.GOOGLE_CLIENT_ID, dev: env.DEV_FAKE_LOGIN === '1' });

  if (m === 'POST' && p === '/api/login') {
    const body = await req.json().catch(() => ({}));
    let who;
    if (env.DEV_FAKE_LOGIN === '1' && String(body.credential).startsWith('dev:')) {
      const name = String(body.credential).slice(4) || 'tester';
      who = { sub: 'dev:' + name, email: name + '@example.com' };
    } else who = await verifyGoogle(body.credential, env);
    let u = await env.DB.prepare('SELECT * FROM users WHERE sub = ?').bind(who.sub).first();
    if (!u) {
      await env.DB.prepare('INSERT INTO users (sub, email, created_at) VALUES (?, ?, ?)').bind(who.sub, who.email, now()).run();
      await bump(env, 'users_total', 'SELECT COUNT(*) AS n FROM users');
      u = await env.DB.prepare('SELECT * FROM users WHERE sub = ?').bind(who.sub).first();
    } else if (who.email && who.email !== u.email) {
      await env.DB.prepare('UPDATE users SET email = ? WHERE id = ?').bind(who.email, u.id).run();
    }
    if (u.banned) fail(403, 'banned');
    const token = randomHex(32);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM sessions WHERE expires < ?').bind(now()),
      env.DB.prepare('INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)').bind(token, u.id, now() + SESSION_DAYS * 86400),
    ]);
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie(token, SESSION_DAYS * 86400) });
  }

  if (m === 'POST' && p === '/api/logout') {
    const token = cookie(req, 'pp_s');
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
  }

  if (m === 'GET' && p === '/api/me') {
    const u = await currentUser(req, env);
    if (!u) return json({ user: null });
    const rows = (await env.DB.prepare('SELECT id, day, theme, bw, tod, hidden FROM posts WHERE user_id = ? ORDER BY day DESC').bind(u.id).all()).results;
    const st = streaks(rows.map(r => r.day));
    const pickUser = Number(await getMeta(env, 'pick_user'));
    const kept = mergedBadges(u, rows).filter(b => b !== 'pick_past' || pickUser !== u.id);
    if (pickUser === u.id) kept.push('pick');
    const admin = await isAdmin(u, env);
    const storage = admin ? Math.round(await storageUsed(env) * 1000) / 10 : undefined;
    const migration = admin && env.MEDIA ? await migrationStatus(env) : undefined;
    return json({ user: { storage, migration, picks: u.picks || 0, gold: (u.picks || 0) >= GOLD_PICKS, nick: u.nick, consent: !!u.consent, banned: !!u.banned, admin: await isAdmin(u, env), current: st.current,
      best: mergedBest(u, rows.map(r => r.day)), keptBadges: kept, posts: rows, id: u.id, avatar: avatarOf(u),
      gifts: (await env.DB.prepare('SELECT id, kind, item, note, status, created_at FROM gifts WHERE user_id = ? ORDER BY created_at DESC').bind(u.id).all()).results } });
  }

  // подарок: открыть и сразу надеть (use) или положить в сумку
  if (m === 'POST' && p === '/api/gift') {
    const u = await needUser(req, env);
    const b = await req.json().catch(() => ({}));
    const g = await env.DB.prepare('SELECT * FROM gifts WHERE id = ? AND user_id = ?').bind(Number(b.id), u.id).first();
    if (!g) fail(404, 'gift');
    await env.DB.prepare("UPDATE gifts SET status = 'bag', opened_at = COALESCE(opened_at, ?) WHERE id = ?").bind(now(), g.id).run();
    if (b.use) { const a = avatarOf(u); a[g.kind] = g.item; await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(JSON.stringify(a), u.id).run(); }
    return json({ ok: true });
  }
  // надеть вещь из сумки (только свою) или снять (item: null)
  if (m === 'POST' && p === '/api/avatar') {
    const u = await needUser(req, env);
    const b = await req.json().catch(() => ({}));
    if (!GIFT_KINDS.includes(b.kind)) fail(400, 'bad');
    const a = avatarOf(u);
    if (b.item == null) delete a[b.kind];
    else {
      const own = await env.DB.prepare("SELECT 1 FROM gifts WHERE user_id = ? AND kind = ? AND item = ? AND status = 'bag'").bind(u.id, b.kind, String(b.item)).first();
      if (!own) fail(403, 'notyours');
      a[b.kind] = String(b.item);
    }
    await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(JSON.stringify(a), u.id).run();
    return json({ ok: true, avatar: a });
  }
  // админ дарит семечко
  if (m === 'POST' && p === '/api/admin/gift') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const b = await req.json().catch(() => ({}));
    if (!okItem(b.kind, b.item)) fail(400, 'bad');
    const to = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(Number(b.uid)).first();
    if (!to) fail(404, 'user');
    await env.DB.prepare('INSERT INTO gifts (user_id, kind, item, note, created_at) VALUES (?, ?, ?, ?, ?)').bind(to.id, b.kind, String(b.item), String(b.note || '').slice(0, 200), now()).run();
    return json({ ok: true });
  }
  if (m === 'POST' && p === '/api/nick') {
    const u = await needUser(req, env);
    const { nick } = await req.json().catch(() => ({}));
    const n = String(nick || '').trim().replace(/^@/, '');
    if (!/^[\p{L}\p{N}_.-]{2,24}$/u.test(n)) fail(400, 'nick');
    const taken = await env.DB.prepare('SELECT id FROM users WHERE nick = ? AND id != ?').bind(n, u.id).first();
    if (taken) fail(409, 'taken');
    await env.DB.prepare('UPDATE users SET nick = ? WHERE id = ?').bind(n, u.id).run();
    return json({ ok: true, nick: n });
  }

  if (m === 'POST' && p === '/api/upload') {
    const u = await needUser(req, env);
    if (!u.nick) fail(400, 'nick');
    const f = await req.formData();
    const full = f.get('image'), thumb = f.get('thumb'), day = String(f.get('day') || '');
    if (f.get('consent') === 'yes' && !u.consent) await env.DB.prepare('UPDATE users SET consent = 1 WHERE id = ?').bind(u.id).run();
    else if (!u.consent) fail(400, 'consent');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || dayNum(day) < utcToday() - 3 || dayNum(day) > utcToday() + 1) fail(400, 'day'); // сегодня, вчера, позавчера (с запасом на часовые пояса)
    if (!(full instanceof File) || !(thumb instanceof File)) fail(400, 'file');
    if (full.size > MAX_FULL || thumb.size > MAX_THUMB) fail(413, 'big');
    const fb = await full.arrayBuffer(), tb = await thumb.arrayBuffer();
    const isJpeg = b => { const a = new Uint8Array(b, 0, 3); return a[0] === 0xff && a[1] === 0xd8 && a[2] === 0xff; };
    if (!isJpeg(fb) || !isJpeg(tb)) fail(400, 'file');
    const old = await env.DB.prepare('SELECT id, store, kv FROM posts WHERE user_id = ? AND day = ?').bind(u.id, day).first();
    const id = randomHex(12);
    const where = await imgPut(env, id, fb, tb);
    if (old) {
      await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(old.id).run();
      await imgDelete(env, old);
    }
    if (!old) await bump(env, 'works_total', 'SELECT COUNT(*) + 1 AS n FROM posts'); // замена работы дня не считается
    const tod = Number(f.get('tod'));
    await env.DB.prepare('INSERT INTO posts (id, user_id, day, theme, bw, tod, bytes, created_at, store, kv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, u.id, day, String(f.get('theme') || '').slice(0, 120), f.get('bw') === '1' ? 1 : 0,
        Number.isInteger(tod) && tod >= 0 && tod < 1440 ? tod : null, fb.byteLength + tb.byteLength, now(), where.store, where.kv).run();
    // бейджи и рекорд записываем сразу — их не отнимет ни очистка, ни пропуск
    const months = [...new Set([...monthsOf(u), day.slice(0, 7)])].sort().slice(-24);
    const mc = mcountOf(u);
    if (!old) mc[day.slice(0, 7)] = (mc[day.slice(0, 7)] || 0) + 1; // замена работы дня не считается
    const mcount = Object.keys(mc).sort().slice(-48).map(k => `${k}:${mc[k]}`).join(',');
    const all = (await env.DB.prepare('SELECT day, bw, tod FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    const uu = { ...u, months: months.join(','), mcount };
    await env.DB.prepare('UPDATE users SET months = ?, mcount = ?, best = ?, badges = ? WHERE id = ?')
      .bind(uu.months, mcount, mergedBest(u, all.map(p => p.day)), mergedBadges(uu, all).join(','), u.id).run();
    return json({ ok: true, id });
  }

  if (m === 'POST' && p === '/api/delete-post') {
    const u = await needUser(req, env);
    const { id } = await req.json().catch(() => ({}));
    const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(String(id)).first();
    if (!post || post.user_id !== u.id) fail(404, 'post');
    await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(post.id).run();
    await imgDelete(env, post);
    return json({ ok: true });
  }

  if (m === 'GET' && p === '/api/wall') {
    const before = Number(url.searchParams.get('before')) || 9e12;
    const rows = (await env.DB.prepare(`SELECT p.id, p.day, p.theme, p.bw, p.created_at, u.nick, u.id AS uid, (COALESCE(u.picks, 0) >= ${GOLD_PICKS}) AS gold FROM posts p JOIN users u ON u.id = p.user_id
      WHERE p.hidden = 0 AND u.banned = 0 AND u.nick IS NOT NULL AND p.created_at < ? ORDER BY p.created_at DESC LIMIT 24`).bind(before).all()).results;
    return json({ posts: rows, pick: await getMeta(env, 'pick_post') });
  }

  if (m === 'GET' && p === '/api/top') {
    const since = new Date((utcToday() - 1) * 864e5).toISOString().slice(0, 10);
    const active = (await env.DB.prepare(`SELECT DISTINCT p.user_id FROM posts p JOIN users u ON u.id = p.user_id
      WHERE p.day >= ? AND u.banned = 0 AND u.nick IS NOT NULL`).bind(since).all()).results.map(r => r.user_id);
    const top = [];
    for (const uid of active.slice(0, 500)) {
      const rows = (await env.DB.prepare('SELECT day FROM posts WHERE user_id = ?').bind(uid).all()).results;
      const u = await env.DB.prepare('SELECT nick, best, picks FROM users WHERE id = ?').bind(uid).first();
      const days = rows.map(r => r.day);
      top.push({ nick: u.nick, current: streaks(days).current, best: mergedBest(u, days), gold: (u.picks || 0) >= GOLD_PICKS });
    }
    top.sort((a, b) => b.current - a.current || b.best - a.best);
    const pickUser = Number(await getMeta(env, 'pick_user'));
    const pu = pickUser ? await env.DB.prepare('SELECT nick, picks FROM users WHERE id = ? AND banned = 0').bind(pickUser).first() : null;
    return json({ top: top.slice(0, 10), pick: pu?.nick || null, pickGold: (pu?.picks || 0) >= GOLD_PICKS });
  }

  const img = p.match(/^\/api\/img\/([0-9a-f]{24})$/);
  if (m === 'GET' && img) {
    const v = await imgGet(env, url.searchParams.get('t') ? 't' : 'i', img[1]);
    if (!v) return new Response('Not found', { status: 404 });
    return new Response(v, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' } });
  }

  // ---------- GDPR: экспорт и удаление ----------
  if (m === 'GET' && p === '/api/export') {
    const u = await needUser(req, env);
    const posts = (await env.DB.prepare('SELECT id, day, theme, bw, created_at, hidden FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    const data = {
      exported_at: new Date().toISOString(),
      account: { nick: u.nick, email: u.email, google_account_id: u.sub, consent_to_publish: !!u.consent, created_at: new Date(u.created_at * 1000).toISOString() },
      posts: posts.map(x => ({ ...x, image: `${url.origin}/api/img/${x.id}`, created_at: new Date(x.created_at * 1000).toISOString() })),
    };
    return new Response(JSON.stringify(data, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': 'attachment; filename="pigeonpolly-my-data.json"', 'cache-control': 'no-store' } });
  }

  if (m === 'POST' && p === '/api/delete-account') {
    const u = await currentUser(req, env);
    if (!u) fail(401, 'login');
    const posts = (await env.DB.prepare('SELECT id, store, kv FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    await Promise.all(posts.map(x => imgDelete(env, x)));
    await env.DB.batch([
      env.DB.prepare('DELETE FROM posts WHERE user_id = ?').bind(u.id),
      env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(u.id),
      env.DB.prepare('DELETE FROM users WHERE id = ?').bind(u.id),
    ]);
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
  }

  // ---------- модерация ----------
  if (m === 'POST' && p === '/api/admin/pick') {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const { id, undo } = await req.json().catch(() => ({}));
    const prev = Number(await getMeta(env, 'pick_user'));
    if (undo) { // снять «Выбор Полли»: у владельца бейдж становится чёрно-белым
      if (prev) await addBadge(env, prev, 'pick_past');
      await env.DB.prepare("DELETE FROM meta WHERE key IN ('pick_post', 'pick_user')").run();
      return json({ ok: true });
    }
    const post = await env.DB.prepare('SELECT id, user_id, picked FROM posts WHERE id = ?').bind(String(id)).first();
    if (!post) fail(404, 'post');
    if (!post.picked) await env.DB.batch([
      env.DB.prepare('UPDATE posts SET picked = 1 WHERE id = ?').bind(post.id),
      env.DB.prepare('UPDATE users SET picks = COALESCE(picks, 0) + 1 WHERE id = ?').bind(post.user_id),
    ]);
    if (prev && prev !== post.user_id) await addBadge(env, prev, 'pick_past');
    await setMeta(env, 'pick_post', post.id);
    await setMeta(env, 'pick_user', String(post.user_id));
    return json({ ok: true });
  }

  if (m === 'POST' && (p === '/api/admin/hide' || p === '/api/admin/ban')) {
    const u = await needUser(req, env);
    if (!(await isAdmin(u, env))) fail(403, 'admin');
    const { id, uid, undo } = await req.json().catch(() => ({}));
    if (p === '/api/admin/hide') await env.DB.prepare('UPDATE posts SET hidden = ? WHERE id = ?').bind(undo ? 0 : 1, String(id)).run();
    else {
      await env.DB.prepare('UPDATE users SET banned = ? WHERE id = ?').bind(undo ? 0 : 1, Number(uid)).run();
      if (!undo) await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(Number(uid)).run();
    }
    return json({ ok: true });
  }

  return json({ error: 'not_found' }, 404);
}
