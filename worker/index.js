// Сервер сайта: отдаёт статические файлы из site/ и обслуживает /api/* для «Стены рисунков»:
// вход через Google, ник, загрузка работы дня, серии, стена, топ, модерация, GDPR (экспорт и удаление).
// Данные — Cloudflare D1 (env.DB), картинки — Cloudflare KV (env.IMAGES).

// sha256 от e-mail администратора (сам адрес в коде не храним)
const ADMIN_HASHES = ['80ac2786b60d61a30d6691a3d40de5d784cdefc580717add788821a7bf900118'];
const SESSION_DAYS = 180;
const MAX_FULL = 2_500_000, MAX_THUMB = 400_000;
const INACTIVE_DAYS = 30; // нет загрузок дольше — картинки удаляются (уровень и бейджи остаются)

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    if (!env.DB || !env.IMAGES || !env.GOOGLE_CLIENT_ID) return json({ ready: false }, 503);
    try {
      await ensureSchema(env);
      return await route(req, env, url);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.code }, e.status);
      console.error(e);
      return json({ error: 'server' }, 500);
    }
  },
  // раз в сутки (cron в wrangler.jsonc): чистим картинки тех, кто пропал больше чем на 30 дней
  async scheduled(event, env, ctx) {
    if (!env.DB || !env.IMAGES) return;
    await ensureSchema(env);
    ctx.waitUntil(cleanupInactive(env));
  },
};

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
  ]);
  // новые колонки для уже созданной базы: рекорд и бейджи, которые остаются после очистки картинок
  for (const sql of ['ALTER TABLE users ADD COLUMN best INTEGER DEFAULT 0', "ALTER TABLE users ADD COLUMN badges TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN months TEXT DEFAULT ''", 'ALTER TABLE posts ADD COLUMN tod INTEGER']) {
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
  return env.DB.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires > ?`)
    .bind(token, now()).first();
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
const mergedBadges = (u, posts) => [...new Set([...String(u.badges || '').split(',').filter(Boolean), ...badgesOf(posts, monthsOf(u))])];

async function cleanupInactive(env) {
  const cutoff = new Date((utcToday() - INACTIVE_DAYS) * 864e5).toISOString().slice(0, 10);
  const users = (await env.DB.prepare('SELECT u.* FROM users u JOIN posts p ON p.user_id = u.id GROUP BY u.id HAVING MAX(p.day) < ? LIMIT 200').bind(cutoff).all()).results;
  let deletes = 0;
  for (const u of users) {
    const posts = (await env.DB.prepare('SELECT id, day, bw, tod FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    if (deletes + posts.length * 2 > 900) break; // бесплатный лимит KV — 1000 удалений в сутки
    await env.DB.prepare('UPDATE users SET best = ?, badges = ? WHERE id = ?')
      .bind(mergedBest(u, posts.map(p => p.day)), mergedBadges(u, posts).join(','), u.id).run();
    for (const p of posts) { await env.IMAGES.delete('i/' + p.id); await env.IMAGES.delete('t/' + p.id); deletes += 2; }
    await env.DB.prepare('DELETE FROM posts WHERE user_id = ?').bind(u.id).run();
  }
  return { users: users.length, deletes };
}

// «Выбор Полли»: один текущий рисунок, его автор — носитель бейджа; прошлые носители получают 'pick_past'
const getMeta = async (env, k) => (await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(k).first())?.value ?? null;
const setMeta = (env, k, v) => env.DB.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(k, v).run();
async function addBadge(env, uid, badge) {
  const u = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(uid).first();
  if (!u) return;
  const set = new Set(String(u.badges || '').split(',').filter(Boolean)); set.add(badge);
  await env.DB.prepare('UPDATE users SET badges = ? WHERE id = ?').bind([...set].join(','), uid).run();
}

// ---------- маршруты ----------
async function route(req, env, url) {
  const p = url.pathname, m = req.method;
  if (m === 'POST' && p === '/api/dev/cleanup' && env.DEV_FAKE_LOGIN === '1') return json(await cleanupInactive(env));
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
    return json({ user: { nick: u.nick, consent: !!u.consent, banned: !!u.banned, admin: await isAdmin(u, env), current: st.current,
      best: mergedBest(u, rows.map(r => r.day)), keptBadges: kept, posts: rows } });
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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Math.abs(dayNum(day) - utcToday()) > 1) fail(400, 'day');
    if (!(full instanceof File) || !(thumb instanceof File)) fail(400, 'file');
    if (full.size > MAX_FULL || thumb.size > MAX_THUMB) fail(413, 'big');
    const fb = await full.arrayBuffer(), tb = await thumb.arrayBuffer();
    const isJpeg = b => { const a = new Uint8Array(b, 0, 3); return a[0] === 0xff && a[1] === 0xd8 && a[2] === 0xff; };
    if (!isJpeg(fb) || !isJpeg(tb)) fail(400, 'file');
    const old = await env.DB.prepare('SELECT id FROM posts WHERE user_id = ? AND day = ?').bind(u.id, day).first();
    const id = randomHex(12);
    await env.IMAGES.put('i/' + id, fb, { metadata: { type: 'image/jpeg' } });
    await env.IMAGES.put('t/' + id, tb, { metadata: { type: 'image/jpeg' } });
    if (old) {
      await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(old.id).run();
      await Promise.all([env.IMAGES.delete('i/' + old.id), env.IMAGES.delete('t/' + old.id)]);
    }
    const tod = Number(f.get('tod'));
    await env.DB.prepare('INSERT INTO posts (id, user_id, day, theme, bw, tod, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, u.id, day, String(f.get('theme') || '').slice(0, 120), f.get('bw') === '1' ? 1 : 0,
        Number.isInteger(tod) && tod >= 0 && tod < 1440 ? tod : null, now()).run();
    // бейджи и рекорд записываем сразу — их не отнимет ни очистка, ни пропуск
    const months = [...new Set([...monthsOf(u), day.slice(0, 7)])].sort().slice(-24);
    const all = (await env.DB.prepare('SELECT day, bw, tod FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    const uu = { ...u, months: months.join(',') };
    await env.DB.prepare('UPDATE users SET months = ?, best = ?, badges = ? WHERE id = ?')
      .bind(uu.months, mergedBest(u, all.map(p => p.day)), mergedBadges(uu, all).join(','), u.id).run();
    return json({ ok: true, id });
  }

  if (m === 'POST' && p === '/api/delete-post') {
    const u = await needUser(req, env);
    const { id } = await req.json().catch(() => ({}));
    const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(String(id)).first();
    if (!post || post.user_id !== u.id) fail(404, 'post');
    await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(post.id).run();
    await Promise.all([env.IMAGES.delete('i/' + post.id), env.IMAGES.delete('t/' + post.id)]);
    return json({ ok: true });
  }

  if (m === 'GET' && p === '/api/wall') {
    const before = Number(url.searchParams.get('before')) || 9e12;
    const rows = (await env.DB.prepare(`SELECT p.id, p.day, p.theme, p.bw, p.created_at, u.nick, u.id AS uid FROM posts p JOIN users u ON u.id = p.user_id
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
      const u = await env.DB.prepare('SELECT nick, best FROM users WHERE id = ?').bind(uid).first();
      const days = rows.map(r => r.day);
      top.push({ nick: u.nick, current: streaks(days).current, best: mergedBest(u, days) });
    }
    top.sort((a, b) => b.current - a.current || b.best - a.best);
    return json({ top: top.slice(0, 10) });
  }

  const img = p.match(/^\/api\/img\/([0-9a-f]{24})$/);
  if (m === 'GET' && img) {
    const v = await env.IMAGES.get((url.searchParams.get('t') ? 't/' : 'i/') + img[1], 'arrayBuffer');
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
    const posts = (await env.DB.prepare('SELECT id FROM posts WHERE user_id = ?').bind(u.id).all()).results;
    await Promise.all(posts.flatMap(x => [env.IMAGES.delete('i/' + x.id), env.IMAGES.delete('t/' + x.id)]));
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
    const { id } = await req.json().catch(() => ({}));
    const post = await env.DB.prepare('SELECT id, user_id FROM posts WHERE id = ?').bind(String(id)).first();
    if (!post) fail(404, 'post');
    const prev = Number(await getMeta(env, 'pick_user'));
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
