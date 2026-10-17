// Вход с паролем (этап 12): регистрация, вход по почте или нику, смена и сброс пароля, «выйти на всех устройствах»,
// письма sendMail и общие воронки (funnel). Вход через Google — в worker/index.js (/api/login), здесь не трогается.
// Пароль: только PBKDF2-SHA256 с солью, 100 000 итераций (предел Workers), сравнение за постоянное время.
// Замок: 5 неверных попыток → пауза 15 минут на аккаунт и на IP (таблица login_fail, IP — только хеш).
import '../site/assets/pw-rules.js'; // PPPw.check — те же правила в браузере (account.js)
const PPPw = globalThis.PPPw;

export const AUTH_TABLES = [
  // k: 'u:<id>' — аккаунт, 'e:<хеш>' — неизвестная почта/ник, 'ip:<хеш>' — адрес, 'rg:'/'fg:' — регистрации и «Забыли пароль?» с адреса
  `CREATE TABLE IF NOT EXISTS login_fail (k TEXT PRIMARY KEY, n INTEGER NOT NULL, at INTEGER NOT NULL)`,
  // одноразовые ссылки «Забыли пароль?»: хранится только sha256 токена, срок — 1 час
  `CREATE TABLE IF NOT EXISTS pw_reset (hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires INTEGER NOT NULL, created_at INTEGER)`,
  // воронки: один шаг одного посетителя за сутки (vid — тот же хеш, что в visits); счёт — по дням
  `CREATE TABLE IF NOT EXISTS funnel (day TEXT NOT NULL, name TEXT NOT NULL, step TEXT NOT NULL, vid TEXT NOT NULL, PRIMARY KEY (day, name, step, vid))`,
];
// pw — 'p1$соль$хеш'; pw_temp = 1 — временный пароль из кабинета (при входе придумать новый); email_ok — почта подтверждена (Google или ссылка из письма)
export const AUTH_ALTER = ['ALTER TABLE users ADD COLUMN pw TEXT', 'ALTER TABLE users ADD COLUMN pw_temp INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN email_ok INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN privacy_at INTEGER'];

// воронки для «👥 Посетителей»: шаги по порядку; client — какие шаги может прислать браузер (остальные пишет сервер)
export const FUNNELS = {
  login: { name: 'Вход на сайт', steps: [['open', 'Открыли окно входа'], ['google', 'Вошли через Google'], ['password', 'Вошли с паролем'], ['register', 'Зарегистрировались с паролем']], client: ['open'] },
};

const ITER = 100000, LOCK_N = 5, LOCK_SEC = 900, RESET_SEC = 3600;
const now = () => Math.floor(Date.now() / 1000);
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const randomHex = n => hex(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async s => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
const normEmail = s => String(s || '').trim().toLowerCase().slice(0, 254);
const okEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const ipOf = req => req.headers.get('cf-connecting-ip') || 'local';

async function pbkdf2(pw, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: ITER }, key, 256));
}
export async function hashPw(pw) { const salt = randomHex(16); return `p1$${salt}$${await pbkdf2(pw, salt)}`; }
function same(a, b) { // за постоянное время
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
const DUMMY = 'p1$00000000000000000000000000000000$' + '0'.repeat(64);
async function checkPw(pw, stored) { // нет пароля — считаем всё равно, чтобы по времени ответа нельзя было понять, есть ли аккаунт
  const [v, salt, h] = String(stored || DUMMY).split('$');
  const got = await pbkdf2(String(pw || ''), salt || '');
  return v === 'p1' && !!stored && same(got, h || '');
}

// замок: n неверных подряд за 15 минут
async function lockedAny(env, keys) {
  const rows = (await env.DB.prepare(`SELECT n, at FROM login_fail WHERE k IN (${keys.map(() => '?').join(',')})`).bind(...keys).all()).results;
  return rows.some(r => r.n >= LOCK_N && r.at > now() - LOCK_SEC);
}
async function failAll(env, keys) {
  const t = now();
  await env.DB.batch(keys.map(k => env.DB.prepare('INSERT INTO login_fail (k, n, at) VALUES (?, 1, ?) ON CONFLICT(k) DO UPDATE SET n = CASE WHEN at < ? THEN 1 ELSE n + 1 END, at = ?').bind(k, t, t - LOCK_SEC, t)));
}

// ---------- письма ----------
// Сейчас писем нет — заглушка. Включаются секретами RESEND_KEY и MAIL_FROM (Resend, бесплатно 3000 в месяц / 100 в сутки).
// На локальной проверке DEV_MAIL=1 — письма «отправляются» в лог и в meta dev_last_mail.
export const mailOn = env => !!(env.RESEND_KEY && env.MAIL_FROM) || env.DEV_MAIL === '1';
export async function sendMail(env, to, subject, text) {
  if (env.RESEND_KEY && env.MAIL_FROM) {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: 'Bearer ' + env.RESEND_KEY, 'content-type': 'application/json' }, body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, text }) }).catch(() => null);
    if (!r || !r.ok) console.error('mail', r && r.status, r && await r.text().catch(() => ''));
    return { ok: !!(r && r.ok) };
  }
  console.log('sendMail (заглушка):', to, subject, text);
  if (env.DEV_MAIL === '1') await env.DB.prepare("INSERT INTO meta (key, value) VALUES ('dev_last_mail', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(JSON.stringify({ to, subject, text })).run();
  return { ok: env.DEV_MAIL === '1', off: true };
}

// ---------- воронки ----------
export async function funnelStep(env, req, name, step, h) {
  const f = FUNNELS[name]; if (!f || !f.steps.some(s => s[0] === step)) return;
  let salt = await h.getMeta('visit_salt'); if (!salt) { salt = randomHex(16); await h.setMeta('visit_salt', salt); }
  const day = h.rigaDay();
  const vid = (await sha256(salt + day + ipOf(req) + (req.headers.get('user-agent') || ''))).slice(0, 16); // как в visits
  await env.DB.prepare('INSERT OR IGNORE INTO funnel (day, name, step, vid) VALUES (?, ?, ?, ?)').bind(day, name, step, vid).run().catch(e => console.error('funnel', e));
}

// Google-вход новым аккаунтом, а с этой почтой уже есть аккаунт с паролем → это он (одна почта = один аккаунт).
// Почта аккаунта с паролем не подтверждена (письма не было) → пароль стирается и все входы закрываются: вдруг почту занял чужой.
export async function googleLink(env, who) {
  if (!who.email) return null;
  const u = await env.DB.prepare("SELECT * FROM users WHERE lower(email) = ? AND sub LIKE 'pw:%' LIMIT 1").bind(normEmail(who.email)).first();
  if (!u) return null;
  await env.DB.batch([
    env.DB.prepare(`UPDATE users SET sub = ?, email = ?, email_ok = 1${u.email_ok ? '' : ', pw = NULL, pw_temp = 0'} WHERE id = ?`).bind(who.sub, who.email, u.id),
    ...(u.email_ok ? [] : [env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(u.id)]),
  ]);
  return env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(u.id).first();
}

// h: json, fail, currentUser, needUser, isAdmin, getMeta, setMeta, rigaDay, sessionCookie, sessionDays, bump
export async function authApi(req, env, url, h) {
  const p = url.pathname, m = req.method;
  const body = async () => req.json().catch(() => ({}));
  const ipKey = async pre => pre + (await sha256('ip|' + ipOf(req))).slice(0, 24);
  const login = async (uid, extra = {}) => {
    const token = randomHex(32), days = h.sessionDays;
    await env.DB.batch([
      env.DB.prepare('DELETE FROM sessions WHERE expires < ?').bind(now()),
      env.DB.prepare('INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)').bind(token, uid, now() + days * 86400),
    ]);
    return h.json({ ok: true, ...extra }, 200, { 'set-cookie': h.sessionCookie(token, days * 86400) });
  };
  const rule = (pw, u) => { const e = PPPw.check(pw, { email: u && u.email, nick: u && u.nick }); if (e) h.fail(400, 'pw_' + e); };

  if (m === 'POST' && p === '/api/pw/register') {
    const b = await body();
    if (b.website) return h.json({ ok: true }); // ловушка для ботов
    const email = normEmail(b.email);
    if (!okEmail(email)) h.fail(400, 'email');
    if (!b.consent) h.fail(400, 'consent');
    rule(b.password, { email });
    const rg = await ipKey('rg:');
    if (await lockedAny(env, [rg])) h.fail(429, 'locked');
    const had = await env.DB.prepare('SELECT sub FROM users WHERE lower(email) = ? ORDER BY id LIMIT 1').bind(email).first();
    if (had) h.fail(409, String(had.sub).startsWith('pw:') ? 'exists' : 'google'); // одна почта = один аккаунт
    await failAll(env, [rg]); // не больше 5 регистраций с адреса за 15 минут
    const sub = 'pw:' + randomHex(16);
    await env.DB.prepare('INSERT INTO users (sub, email, pw, privacy_at, created_at) VALUES (?, ?, ?, ?, ?)').bind(sub, email, await hashPw(String(b.password)), now(), now()).run();
    await h.bump('users_total', 'SELECT COUNT(*) AS n FROM users');
    const u = await env.DB.prepare('SELECT id FROM users WHERE sub = ?').bind(sub).first();
    await funnelStep(env, req, 'login', 'register', h);
    return login(u.id);
  }

  if (m === 'POST' && p === '/api/pw/login') {
    const b = await body();
    if (b.website) h.fail(403, 'wrong');
    const id = String(b.login || '').trim().replace(/^@/, '').slice(0, 254);
    const u = id ? await env.DB.prepare(id.includes('@') ? 'SELECT * FROM users WHERE lower(email) = ? ORDER BY pw IS NULL, id LIMIT 1' : 'SELECT * FROM users WHERE nick = ?').bind(id.includes('@') ? normEmail(id) : id).first() : null;
    const keys = [u ? 'u:' + u.id : 'e:' + (await sha256('id|' + id.toLowerCase())).slice(0, 24), await ipKey('ip:')];
    if (await lockedAny(env, keys)) return h.json({ error: 'locked', minutes: LOCK_SEC / 60 }, 429);
    const ok = await checkPw(b.password, u && u.pw);
    if (!ok) { await failAll(env, keys); await env.DB.prepare('DELETE FROM login_fail WHERE at < ?').bind(now() - 86400).run(); h.fail(403, 'wrong'); } // ошибка всегда одна
    await env.DB.prepare('DELETE FROM login_fail WHERE k = ?').bind(keys[0]).run();
    if (u.banned) h.fail(403, 'banned');
    await funnelStep(env, req, 'login', 'password', h);
    return login(u.id, { temp: u.pw_temp ? 1 : 0 });
  }

  // сменить / добавить пароль (из профиля), придумать новый вместо временного
  if (m === 'POST' && p === '/api/pw/change') {
    const u = await h.needUser(req, env), b = await body();
    if (u.pw && !u.pw_temp) {
      const keys = ['u:' + u.id, await ipKey('ip:')];
      if (await lockedAny(env, keys)) return h.json({ error: 'locked', minutes: LOCK_SEC / 60 }, 429);
      if (!(await checkPw(b.old, u.pw))) { await failAll(env, keys); h.fail(403, 'wrong'); }
    }
    rule(b.password, u);
    if (!u.email && !u.nick) h.fail(400, 'nick'); // войти потом будет не по чему
    await env.DB.batch([
      env.DB.prepare('UPDATE users SET pw = ?, pw_temp = 0 WHERE id = ?').bind(await hashPw(String(b.password)), u.id),
      env.DB.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').bind(u.id, u._tok), // другие устройства выходят
      env.DB.prepare('DELETE FROM login_fail WHERE k = ?').bind('u:' + u.id),
    ]);
    return h.json({ ok: true });
  }

  if (m === 'POST' && p === '/api/pw/logout-all') {
    const u = await h.needUser(req, env);
    await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(u.id).run();
    return h.json({ ok: true }, 200, { 'set-cookie': h.sessionCookie('', 0) });
  }

  // «Забыли пароль?»: есть письма — одноразовая ссылка на час; ответ всегда один и тот же
  if (m === 'POST' && p === '/api/pw/forgot') {
    const b = await body();
    if (!mailOn(env)) return h.json({ ok: false, mail: false });
    if (b.website) return h.json({ ok: true });
    const fg = await ipKey('fg:');
    if (await lockedAny(env, [fg])) return h.json({ error: 'locked', minutes: LOCK_SEC / 60 }, 429);
    await failAll(env, [fg]);
    const email = normEmail(b.email);
    const u = okEmail(email) ? await env.DB.prepare('SELECT id, email, banned FROM users WHERE lower(email) = ? ORDER BY pw IS NULL, id LIMIT 1').bind(email).first() : null;
    const recent = u && await env.DB.prepare('SELECT 1 FROM pw_reset WHERE user_id = ? AND created_at > ?').bind(u.id, now() - 120).first();
    if (u && !u.banned && !recent) {
      const token = randomHex(32), L = ['ru', 'lv'].includes(b.lang) ? b.lang : 'en';
      await env.DB.batch([
        env.DB.prepare('DELETE FROM pw_reset WHERE user_id = ? OR expires < ?').bind(u.id, now()),
        env.DB.prepare('INSERT INTO pw_reset (hash, user_id, expires, created_at) VALUES (?, ?, ?, ?)').bind(await sha256('rs|' + token), u.id, now() + RESET_SEC, now()),
      ]);
      const link = `${url.origin}${L === 'en' ? '' : '/' + L}/?pwreset=${token}`;
      const T = {
        en: ['Pigeon Polly: new password', `Hi!\n\nSomeone (hopefully you) asked to reset the password on pigeonpolly.com.\nOpen this link within 1 hour to choose a new password:\n\n${link}\n\nIf it wasn’t you, just ignore this email — your password stays the same.\n\nAlina, Pigeon Polly Art Lab`],
        ru: ['Pigeon Polly: новый пароль', `Привет!\n\nКто-то (надеюсь, ты) попросил сбросить пароль на pigeonpolly.com.\nОткрой ссылку в течение часа и придумай новый пароль:\n\n${link}\n\nЕсли это не ты — просто не обращай внимания, пароль останется прежним.\n\nАлина, Pigeon Polly Art Lab`],
        lv: ['Pigeon Polly: jauna parole', `Sveiki!\n\nKāds (cerams, tu) lūdza atjaunot paroli vietnē pigeonpolly.com.\nAtver saiti stundas laikā un izdomā jaunu paroli:\n\n${link}\n\nJa tas nebiji tu, vienkārši neņem vērā šo vēstuli — parole paliks tā pati.\n\nAlīna, Pigeon Polly Art Lab`],
      }[L];
      await sendMail(env, u.email, T[0], T[1]);
    }
    return h.json({ ok: true, mail: true });
  }
  if (m === 'POST' && p === '/api/pw/reset') {
    const b = await body();
    const tok = String(b.token || '');
    const r = /^[0-9a-f]{64}$/.test(tok) ? await env.DB.prepare('SELECT * FROM pw_reset WHERE hash = ? AND expires > ?').bind(await sha256('rs|' + tok), now()).first() : null;
    if (!r) h.fail(400, 'link');
    const u = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(r.user_id).first();
    if (!u || u.banned) h.fail(400, 'link');
    rule(b.password, u);
    await env.DB.batch([
      env.DB.prepare('UPDATE users SET pw = ?, pw_temp = 0, email_ok = 1 WHERE id = ?').bind(await hashPw(String(b.password)), u.id), // ссылка из письма = почта своя
      env.DB.prepare('DELETE FROM pw_reset WHERE user_id = ?').bind(u.id), // ссылка одноразовая
      env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(u.id),
      env.DB.prepare('DELETE FROM login_fail WHERE k = ?').bind('u:' + u.id),
    ]);
    return login(u.id);
  }

  if (m === 'POST' && p === '/api/funnel') {
    const b = await body(), f = FUNNELS[b.f];
    if (f && f.client.includes(b.s) && !/bot|crawl|spider|headless/i.test(req.headers.get('user-agent') || '')) await funnelStep(env, req, b.f, b.s, h);
    return new Response(null, { status: 204 });
  }

  // ---------- кабинет ----------
  if (p.startsWith('/api/admin/')) {
    if (m === 'POST' && p === '/api/admin/pw-reset') { // «🔑 Сбросить пароль»: временный пароль, при входе птичка придумывает новый
      const a = await h.needUser(req, env); if (!(await h.isAdmin(a, env))) h.fail(403, 'admin');
      const b = await body(), u = await env.DB.prepare('SELECT id, email, nick FROM users WHERE id = ?').bind(Number(b.uid)).first();
      if (!u) h.fail(404, 'user');
      if (!u.email && !u.nick) h.fail(400, 'nick');
      const abc = 'abcdefghjkmnpqrstuvwxyz23456789', raw = [...crypto.getRandomValues(new Uint8Array(12))].map(x => abc[x % abc.length]).join('');
      const temp = raw.match(/.{4}/g).join('-');
      await env.DB.batch([
        env.DB.prepare('UPDATE users SET pw = ?, pw_temp = 1 WHERE id = ?').bind(await hashPw(temp), u.id),
        env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(u.id),
        env.DB.prepare('DELETE FROM pw_reset WHERE user_id = ?').bind(u.id),
        env.DB.prepare('DELETE FROM login_fail WHERE k = ?').bind('u:' + u.id),
      ]);
      return h.json({ ok: true, password: temp, login: u.email || u.nick });
    }
    if (m === 'GET' && p === '/api/admin/funnels') { // таблица шагов по дням для любой воронки
      const a = await h.needUser(req, env); if (!(await h.isAdmin(a, env))) h.fail(403, 'admin');
      const days = Math.min(Math.max(Number(url.searchParams.get('days')) || 30, 1), 400);
      const from = new Date(Date.now() - (days - 1) * 86400000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' });
      const out = [];
      for (const [id, f] of Object.entries(FUNNELS)) {
        const rows = (await env.DB.prepare('SELECT day, step, COUNT(*) AS n FROM funnel WHERE name = ? AND day >= ? GROUP BY day, step ORDER BY day DESC').bind(id, from).all()).results;
        const byDay = {};
        for (const r of rows) (byDay[r.day] = byDay[r.day] || {})[r.step] = r.n;
        out.push({ id, name: f.name, steps: f.steps.map(([k, label]) => ({ k, label })), days: Object.entries(byDay).map(([day, n]) => ({ day, n })) });
      }
      return h.json({ from, days, funnels: out });
    }
  }
  return null;
}
