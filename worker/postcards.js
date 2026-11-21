// 💌 Открытки /postcards/ (docs/postcards.md): вошедшая птичка выбирает открытку, пишет пару слов и отправляет на любую почту.
// Получателю — письмо с анимированной картинкой (site/images/postcards/<id>.gif) и кнопкой «Открыть открытку» (/postcards/?c=токен).
// Открытка видна получателю на сайте: по ссылке из письма (вошёл — открытка становится его, to_uid) и сама — в «Мои открытки»,
// если почта аккаунта совпадает и подтверждена (email_ok: Google или ссылка из письма). Новость в «конвертике» — вид postcard.
// Аноним: from_name = '' (кто отправил, знает только база: from_uid — на случай жалоб). Ссылки из текста вырезаются.
// Письма: свой суточный лимит pcMailDay (📜 Правила) и общий с остальными письмами (usedToday, meta pc_mail_n:<день>). Лимит кончился — отправка закрыта до полуночи по Риге
// (на странице — «Полли варит чернила» и обратный отсчёт); письмо не ушло по сбою — очередь, postcardCron раз в час.
// Получатель может отказаться от открыток с сайта — ссылка в подвале письма (postcard_block, хеш почты).
import { sendMail, mailOn } from './auth.js';
import { mailHtml } from './mail-html.js';
import { usedToday } from './mail.js';
import '../site/assets/postcard-designs.js';
const D = globalThis.PPPostcardDesigns;

export const POSTCARD_TABLES = [
  // mail: 'sent' | 'queue' | 'off' (писем нет) | 'fail' | 'block' (получатель отказался); seen — получатель видел на сайте (гаснет новость)
  `CREATE TABLE IF NOT EXISTS postcards (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT UNIQUE NOT NULL, design TEXT NOT NULL, greet TEXT, msg TEXT, from_uid INTEGER NOT NULL, from_name TEXT, to_name TEXT, to_email TEXT NOT NULL, to_uid INTEGER, lang TEXT, mail TEXT, seen INTEGER DEFAULT 0, created_at INTEGER NOT NULL)`,
  'CREATE INDEX IF NOT EXISTS postcards_from ON postcards (from_uid, created_at)',
  'CREATE INDEX IF NOT EXISTS postcards_to ON postcards (to_email)',
  'CREATE INDEX IF NOT EXISTS postcards_touid ON postcards (to_uid)',
  'CREATE TABLE IF NOT EXISTS postcard_block (hash TEXT PRIMARY KEY, at INTEGER)',
];
export const POSTCARD_RULES = { pcDay: 5, pcMailDay: 40 };
export const POSTCARD_RANGE = { pcDay: [1, 50], pcMailDay: [0, 90] };
export const POSTCARD_INT = ['pcDay', 'pcMailDay'];

const SITE = 'https://www.pigeonpolly.com', RESEND_MAX = 95; // Resend бесплатно — 100 писем в сутки, 5 — запас на письма о пароле
const now = () => Math.floor(Date.now() / 1000);
const langOf = l => ['ru', 'lv'].includes(l) ? l : 'en';
const LI = { en: 0, ru: 1, lv: 2 };
const pre = L => L === 'en' ? '' : '/' + L;
const normEmail = s => String(s || '').trim().toLowerCase().slice(0, 254);
const okEmail = e => /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/.test(e);
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
// имя: одна строка, без управляющих символов и угловых скобок
const cleanName = (s, n = 40) => String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
// текст: без ссылок (чтобы открытками не рассылали спам), не больше 4 абзацев, строка «—» не обрывает письмо (в mailHtml это подвал)
const URLISH = /(https?:\/\/|www\.)\S+|\b[\w-]+\.(com|net|org|ru|lv|io|ly|xyz|info|biz|top|site|online|shop|link|click)(\/\S*)?\b/gi;
const cleanMsg = s => String(s || '').replace(/\r/g, '').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '').replace(URLISH, '…')
  .split('\n').map(l => l.replace(/\s+$/, '')).map(l => /^\s*[—–-]+\s*$/.test(l) ? '' : l).join('\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 400);

async function secret(h) { // тот же секрет, что у отписки от писем (worker/mail.js)
  let s = await h.getMeta('mail_secret');
  if (!s) { s = hex(crypto.getRandomValues(new Uint8Array(24))); await h.setMeta('mail_secret', s); }
  return s;
}
async function sign(h, text) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(await secret(h)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text))).slice(0, 24);
}
const emailHash = async e => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('pc|' + normEmail(e))));
const blockUrl = async (h, email) => `${SITE}/api/postcards/block?e=${encodeURIComponent(normEmail(email))}&k=${await sign(h, 'pcblock:' + normEmail(email))}`;
const cardUrl = (L, token) => `${SITE}${pre(L)}/postcards/?c=${token}`;

const T = {
  subj: { en: f => f ? `🎁 ${f} sent you a postcard` : '🎁 A postcard for you from a secret friend', ru: f => f ? `🎁 ${f}: открытка для тебя` : '🎁 Открытка для тебя от тайного друга', lv: f => f ? `🎁 ${f} sūta tev kartīti` : '🎁 Kartīte tev no slepena drauga' },
  hi: { en: n => n ? `Hi, ${n}!` : 'Hi!', ru: n => n ? `Привет, ${n}!` : 'Привет!', lv: n => n ? `Sveiki, ${n}!` : 'Sveiki!' },
  who: {
    en: f => f ? `${f} picked a postcard for you on Pigeon Polly Art Lab` : 'Someone who prefers to stay a mystery picked a postcard for you on Pigeon Polly Art Lab',
    ru: f => f ? `${f} выбирает для тебя открытку в Pigeon Polly Art Lab` : 'Кто-то, кто хочет остаться загадкой, выбрал для тебя открытку в Pigeon Polly Art Lab',
    lv: f => f ? `${f} tev izvēlējās kartīti Pigeon Polly Art Lab` : 'Kāds, kurš vēlas palikt noslēpums, tev izvēlējās kartīti Pigeon Polly Art Lab',
  },
  words: { en: ' and wrote:', ru: ' и пишет:', lv: ' un raksta:' },
  open: { en: 'The postcard is animated — open it on the site. Sign in on pigeonpolly.com with this email, and it will stay in your collection.', ru: 'Открытка живая — открой её на сайте. Если войти на pigeonpolly.com с этой почтой, она останется в твоей коллекции.', lv: 'Kartīte ir dzīva — atver to vietnē. Ja ienāksi pigeonpolly.com ar šo e-pastu, tā paliks tavā kolekcijā.' },
  btn: { en: 'Open the postcard', ru: 'Открыть открытку', lv: 'Atvērt kartīti' },
  bye: { en: 'Polly 🐦', ru: 'Полли 🐦', lv: 'Pollijs 🐦' },
  foot: {
    en: u => `—\nA visitor of pigeonpolly.com sent this postcard to your address.\nDon’t want postcards from the site: ${u}`,
    ru: u => `—\nЭту открытку на твой адрес отправил посетитель pigeonpolly.com.\nНе присылать мне открытки: ${u}`,
    lv: u => `—\nŠo kartīti uz tavu adresi nosūtīja pigeonpolly.com apmeklētājs.\nNesūtīt man kartītes: ${u}`,
  },
};

async function mailCard(env, h, c) {
  const L = langOf(c.lang), d = D.byId(c.design) || D.DESIGNS[0], from = c.from_name || '';
  const link = cardUrl(L, c.token);
  const text = [T.hi[L](c.to_name), T.who[L](from) + (c.msg ? T.words[L] : '.'), c.msg ? `“${c.msg}”` : '', T.open[L], link, T.bye[L]].filter(Boolean).join('\n\n')
    + '\n\n' + T.foot[L](await blockUrl(h, c.to_email));
  const subject = T.subj[L](from);
  const html = mailHtml(subject, text, null, { img: `${SITE}/images/postcards/${d.id}.gif`, href: link, caption: c.greet || d.g[LI[L]], ink: d.ink, btn: T.btn[L] });
  return sendMail(env, c.to_email, subject, text, { html, headers: { 'List-Unsubscribe': `<${await blockUrl(h, c.to_email)}>` } });
}
// можно ли отправить письмо сейчас: свой лимит открыток и общий лимит писем за сутки
async function canMail(h) {
  const R = h.rules(), day = h.rigaDay();
  const n = Number(await h.getMeta('pc_mail_n:' + day)) || 0;
  return n < R.pcMailDay && (await usedToday(h)) < RESEND_MAX;
}
// сколько писем с открытками ещё можно отправить сегодня (на весь сайт) и сколько секунд до полуночи по Риге — новый день лимитов
async function leftToday(h) {
  const R = h.rules(), n = Number(await h.getMeta('pc_mail_n:' + h.rigaDay())) || 0;
  return Math.max(0, Math.min(R.pcMailDay - n, RESEND_MAX - await usedToday(h)));
}
const rigaReset = () => { const [H, M, S] = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Riga', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(':').map(Number); return 86400 - ((H % 24) * 3600 + M * 60 + S); };
async function spent(h) { const k = 'pc_mail_n:' + h.rigaDay(); await h.setMeta(k, String((Number(await h.getMeta(k)) || 0) + 1)); }
async function trySend(env, h, c) {
  if (!mailOn(env)) return 'off';
  if (!(await canMail(h))) return 'queue';
  const r = await mailCard(env, h, c);
  if (r.ok) await spent(h);
  return r.ok ? 'sent' : 'queue';
}

// очередь: открытки, которым не хватило лимита, — раз в час, сколько позволяет лимит
export async function postcardCron(env, h) {
  if (!mailOn(env)) return;
  const rows = (await env.DB.prepare("SELECT * FROM postcards WHERE mail = 'queue' AND created_at > ? ORDER BY id LIMIT 20").bind(now() - 14 * 86400).all()).results;
  for (const c of rows) {
    if (!(await canMail(h))) break;
    const st = await trySend(env, h, c);
    if (st !== 'sent') break;
    await env.DB.prepare("UPDATE postcards SET mail = 'sent' WHERE id = ?").bind(c.id).run();
  }
}

// открытки, которые видит птичка u: подписанные на неё (to_uid) и на её подтверждённую почту, ещё никем не забранные
const mineSql = "(to_uid = ?1 OR (to_uid IS NULL AND ?2 != '' AND to_email = ?2))";
const mineArgs = u => [u.id, u.email && u.email_ok ? normEmail(u.email) : ''];
export async function postcardNews(env, u) {
  const r = await env.DB.prepare(`SELECT COUNT(*) AS n, MAX(id) AS last FROM postcards WHERE seen = 0 AND from_uid != ?1 AND ${mineSql}`).bind(...mineArgs(u)).first();
  if (!r || !r.n) return null;
  const c = await env.DB.prepare('SELECT from_name, token FROM postcards WHERE id = ?').bind(r.last).first();
  return { n: r.n, from: c && c.from_name || '', t: c && c.token };
}

const pub = (c, me) => ({ t: c.token, design: c.design, greet: c.greet || '', msg: c.msg || '', from: c.from_name || '', to: c.to_name || '', lang: c.lang, at: c.created_at,
  ...(me ? { email: c.to_email, mail: c.mail } : {}) });
const PAGE = (L, title, body) => `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>`
  + `<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F4F0EA;font:17px/1.6 Karla,Arial,sans-serif;color:#2A211C}main{max-width:460px;margin:20px;padding:32px;background:#FBF9F5;border:1px solid #DED5CA;border-radius:20px;text-align:center}h1{font:400 28px/1.2 Georgia,serif;margin:0 0 14px}button,a.b{display:inline-block;margin-top:10px;padding:12px 22px;border:0;border-radius:999px;background:#22405F;color:#fff;font:700 15px Karla,Arial,sans-serif;text-decoration:none;cursor:pointer}</style></head><body><main>${body}</main></body></html>`;

// h: json, fail, currentUser, needUser, getMeta, setMeta, rigaDay, rules
export async function postcardsApi(req, env, url, h) {
  const p = url.pathname, m = req.method, db = env.DB;
  if (p === '/api/postcards/stats' && m === 'GET') {
    const r = await db.prepare('SELECT COUNT(*) AS n FROM postcards').first();
    const on = mailOn(env);
    return h.json({ n: r ? r.n : 0, mail: on, left: on ? await leftToday(h) : null, max: h.rules().pcMailDay, reset: rigaReset() }, 200, { 'cache-control': 'no-store' });
  }
  if (p === '/api/postcards/send' && m === 'POST') {
    const u = await h.needUser(req, env);
    if (!u.nick) h.fail(403, 'nick');
    const b = await req.json().catch(() => ({}));
    const d = D.byId(String(b.design || ''));
    if (!d) h.fail(400, 'design');
    const to = normEmail(b.to_email);
    if (!okEmail(to)) h.fail(400, 'email');
    const msg = cleanMsg(b.msg), greet = cleanName(String(b.greet || '').replace(URLISH, '…'), 60), toName = cleanName(b.to_name), fromName = b.anon ? '' : (cleanName(b.from_name) || u.nick), L = langOf(b.lang);
    const R = h.rules(), t = now();
    if (mailOn(env) && await leftToday(h) <= 0) h.fail(429, 'out'); // открытки на сегодня закончились — на странице обратный отсчёт до полуночи по Риге
    const mine = await db.prepare('SELECT COUNT(*) AS n, SUM(CASE WHEN to_email = ? THEN 1 ELSE 0 END) AS same FROM postcards WHERE from_uid = ? AND created_at > ?').bind(to, u.id, t - 86400).first();
    if (mine && mine.n >= R.pcDay) h.fail(429, 'day');
    if (mine && mine.same >= 2) h.fail(429, 'same');
    const blocked = await db.prepare('SELECT 1 FROM postcard_block WHERE hash = ?').bind(await emailHash(to)).first();
    const token = 'p' + hex(crypto.getRandomValues(new Uint8Array(12)));
    const row = { token, design: d.id, greet, msg, from_uid: u.id, from_name: fromName, to_name: toName, to_email: to, lang: L, created_at: t };
    const mail = blocked ? 'block' : await trySend(env, h, row);
    await db.prepare('INSERT INTO postcards (token, design, greet, msg, from_uid, from_name, to_name, to_email, lang, mail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(token, d.id, greet, msg, u.id, fromName, toName, to, L, mail, t).run();
    const n = await db.prepare('SELECT COUNT(*) AS n FROM postcards').first();
    return h.json({ ok: true, t: token, url: cardUrl(L, token), mail, n: n ? n.n : 0, today: mailOn(env) ? await leftToday(h) : null, reset: rigaReset(), left: Math.max(0, R.pcDay - (mine ? mine.n : 0) - 1) });
  }
  if (p === '/api/postcards/card' && m === 'GET') {
    const tok = String(url.searchParams.get('t') || '');
    if (!/^p[0-9a-f]{24}$/.test(tok)) h.fail(404, 'card');
    const c = await db.prepare('SELECT * FROM postcards WHERE token = ?').bind(tok).first();
    if (!c) h.fail(404, 'card');
    const u = await h.currentUser(req, env);
    let got = false;
    if (u && !u.banned && u.id !== c.from_uid) { // открыл по ссылке вошедший — открытка становится его (если ещё ничья)
      if (!c.to_uid) await db.prepare('UPDATE postcards SET to_uid = ?, seen = 1 WHERE id = ? AND to_uid IS NULL').bind(u.id, c.id).run();
      else if (c.to_uid === u.id && !c.seen) await db.prepare('UPDATE postcards SET seen = 1 WHERE id = ?').bind(c.id).run();
      got = !c.to_uid || c.to_uid === u.id;
    }
    return h.json({ card: pub(c), got, sent: !!(u && u.id === c.from_uid) });
  }
  if (p === '/api/postcards/inbox' && m === 'GET') {
    const u = await h.needUser(req, env);
    const got = (await db.prepare(`SELECT * FROM postcards WHERE from_uid != ?1 AND ${mineSql} ORDER BY id DESC LIMIT 100`).bind(...mineArgs(u)).all()).results;
    const sent = (await db.prepare('SELECT * FROM postcards WHERE from_uid = ? ORDER BY id DESC LIMIT 100').bind(u.id).all()).results;
    return h.json({ got: got.map(c => ({ ...pub(c), seen: !!c.seen })), sent: sent.map(c => pub(c, true)), left: Math.max(0, h.rules().pcDay - sent.filter(c => c.created_at > now() - 86400).length) });
  }
  if (p === '/api/postcards/seen' && m === 'POST') { // «Мои открытки» открыты: всё полученное — просмотрено, забираем в аккаунт
    const u = await h.needUser(req, env);
    const [a, b] = mineArgs(u);
    await db.prepare(`UPDATE postcards SET seen = 1, to_uid = ?1 WHERE from_uid != ?1 AND (to_uid = ?1 OR (to_uid IS NULL AND ?2 != '' AND to_email = ?2))`).bind(a, b).run();
    return h.json({ ok: true });
  }
  if (p === '/api/postcards/block') { // «Не присылать мне открытки» из письма: GET — страница с кнопкой (почтовые сканеры не нажмут), POST — отказ
    const e = normEmail(url.searchParams.get('e')), k = String(url.searchParams.get('k') || '');
    const ok = okEmail(e) && k === await sign(h, 'pcblock:' + e);
    const L = langOf((req.headers.get('accept-language') || '').slice(0, 2));
    const W = {
      en: ['No more postcards', 'Stop postcards from pigeonpolly.com to', 'Stop postcards', 'Done. Postcards from the site will no longer come to', 'The link is broken.'],
      ru: ['Без открыток', 'Больше не присылать открытки с pigeonpolly.com на', 'Не присылать', 'Готово. Открытки с сайта больше не будут приходить на', 'Ссылка не работает.'],
      lv: ['Bez kartītēm', 'Vairs nesūtīt kartītes no pigeonpolly.com uz', 'Nesūtīt', 'Gatavs. Kartītes no vietnes vairs nenāks uz', 'Saite nedarbojas.'],
    }[L];
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const html = body => new Response(PAGE(L, W[0], body), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
    if (!ok) return html(`<h1>${W[0]}</h1><p>${W[4]}</p>`);
    if (m === 'POST') {
      await db.prepare('INSERT OR IGNORE INTO postcard_block (hash, at) VALUES (?, ?)').bind(await emailHash(e), now()).run();
      return html(`<h1>${W[0]}</h1><p>${W[3]} <b>${esc(e)}</b>.</p><a class="b" href="${SITE}${pre(L)}/">pigeonpolly.com</a>`);
    }
    return html(`<h1>${W[0]}</h1><p>${W[1]} <b>${esc(e)}</b>?</p><form method="post"><button>${W[2]}</button></form>`);
  }
  return null;
}
