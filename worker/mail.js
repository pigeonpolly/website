// Письма с сайта по согласию (docs/bird.md «Письма»): три вида — games (уведомления из игр), feat (новые фишки), news (новости от Полли).
// Согласие: окно при первом входе (news.js askMail) → POST /api/mail/prefs; «Не сейчас» — /api/mail/later, спросит снова через 30 дней.
// Пока птичка не согласилась, писем нет. В каждом письме — «Отписаться» в один клик (/api/mail/off, ссылка с HMAC) и заголовок List-Unsubscribe.
// Рассылка из кабинета (✉️ Письма, site/assets/mail-admin.js): письмо на 3 языках → mail_out, отправка порциями: сразу и раз в час (mailCron),
// не больше MAIL_DAY_MAX в сутки вместе с письмами об адвенте и праздниках Воббленда (worker/wl-holidays.js — только при mail_games = 1) (Resend бесплатно: 100 в сутки).
import { mailOn, sendMail } from './auth.js';

export const MAIL_CATS = ['games', 'feat', 'news'];
export const MAIL_TABLES = [
  // письмо-рассылка: L — JSON {en: {s, t}, ru: …, lv: …}; status: send — идёт, done — всем отправлено, stop — остановлено
  'CREATE TABLE IF NOT EXISTS mail_out (id INTEGER PRIMARY KEY AUTOINCREMENT, cat TEXT NOT NULL, L TEXT NOT NULL, status TEXT NOT NULL, total INTEGER DEFAULT 0, sent INTEGER DEFAULT 0, created_at INTEGER)',
  'CREATE TABLE IF NOT EXISTS mail_sent (out_id INTEGER NOT NULL, user_id INTEGER NOT NULL, at INTEGER, PRIMARY KEY (out_id, user_id))',
];
// mail_games/feat/news — 1 = согласие; mail_asked — когда ответили в окне; mail_later — когда нажали «Не сейчас»; mail_lang — язык писем
export const MAIL_ALTER = ['ALTER TABLE users ADD COLUMN mail_games INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN mail_feat INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN mail_news INTEGER DEFAULT 0',
  'ALTER TABLE users ADD COLUMN mail_asked INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN mail_later INTEGER DEFAULT 0', "ALTER TABLE users ADD COLUMN mail_lang TEXT DEFAULT ''"];
export const MAIL_DAY_MAX = 90, MAIL_BATCH = 30;
const LATER = 30 * 86400, SITE = 'https://www.pigeonpolly.com', REPLY = 'lina.otkinska@gmail.com'; // ответы на письма — Алине
const now = () => Math.floor(Date.now() / 1000);
const langOf = l => ['ru', 'lv'].includes(l) ? l : 'en';
const pre = L => L === 'en' ? '' : '/' + L;

// спросить в окне: письма включены, есть почта и ник, ещё не отвечали, «Не сейчас» — больше 30 дней назад
export const mailAsk = (env, u) => !!(u && mailOn(env) && u.email && u.nick && !u.banned && !u.mail_asked && (!u.mail_later || now() - u.mail_later > LATER));
export const mailPrefs = u => ({ games: !!u.mail_games, feat: !!u.mail_feat, news: !!u.mail_news });

async function secret(env, h) {
  let s = await h.getMeta('mail_secret');
  if (!s) { s = [...crypto.getRandomValues(new Uint8Array(24))].map(x => x.toString(16).padStart(2, '0')).join(''); await h.setMeta('mail_secret', s); }
  return s;
}
async function token(env, h, uid) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(await secret(env, h)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('off:' + uid));
  return [...new Uint8Array(sig)].slice(0, 12).map(x => x.toString(16).padStart(2, '0')).join('');
}
const offUrl = async (env, h, uid) => `${SITE}/api/mail/off?u=${uid}&k=${await token(env, h, uid)}`;

const CAT = {
  games: ['game notifications', 'уведомления из игр', 'paziņojumi no spēlēm'],
  feat: ['new things on the site', 'новые фишки на сайте', 'jaunumi vietnē'],
  news: ['news from Polly', 'новости от Полли', 'ziņas no Pollijas'],
};
const FOOT = {
  en: (c, set, off) => `—\nYou get this because you turned on “${c}” on pigeonpolly.com.\nChoose what we send: ${set}\nUnsubscribe from all: ${off}`,
  ru: (c, set, off) => `—\nЭто письмо пришло, потому что на pigeonpolly.com включены «${c}».\nВыбрать, что присылать: ${set}\nОтписаться от всех писем: ${off}`,
  lv: (c, set, off) => `—\nŠī vēstule atnāca, jo pigeonpolly.com ir ieslēgti «${c}».\nIzvēlēties, ko sūtīt: ${set}\nAtrakstīties no visām vēstulēm: ${off}`,
};
const LI = { en: 0, ru: 1, lv: 2 };

// одно письмо одной птичке: текст на её языке (нет — английский) + подвал с отпиской
async function sendOne(env, h, u, cat, L) {
  const lang = langOf(u.mail_lang), m = (L[lang] && L[lang].s && L[lang].t) ? L[lang] : L.en, ml = m === L[lang] ? lang : 'en';
  const off = await offUrl(env, h, u.id);
  const text = `${m.t.trim()}\n\n${FOOT[ml](CAT[cat][LI[ml]], `${SITE}${pre(ml)}/bird/#mail`, off)}`;
  return sendMail(env, u.email, m.s.trim(), text, { reply_to: REPLY, headers: { 'List-Unsubscribe': `<${off}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } });
}

const dayKey = h => 'mail_n:' + h.rigaDay();
async function usedToday(h) { const d = h.rigaDay(); return (await Promise.all(['mail_n:', 'advent_mail_n:', 'wl_mail_n:'].map(k => h.getMeta(k + d)))).reduce((a, v) => a + (Number(v) || 0), 0); } // вместе с адвентом и праздниками Воббленда
async function spend(h, n) { if (n) await h.setMeta(dayKey(h), String((Number(await h.getMeta(dayKey(h))) || 0) + n)); }

// порция рассылки: самое старое незаконченное письмо, сколько позволяет суточный лимит
export async function mailCron(env, h) {
  if (!mailOn(env)) return;
  let left = Math.min(MAIL_BATCH, MAIL_DAY_MAX - await usedToday(h)), n = 0;
  while (left > 0) {
    const o = await env.DB.prepare("SELECT * FROM mail_out WHERE status = 'send' ORDER BY id LIMIT 1").first();
    if (!o || !MAIL_CATS.includes(o.cat)) break;
    const rows = (await env.DB.prepare(`SELECT u.id, u.email, u.mail_lang FROM users u LEFT JOIN mail_sent s ON s.out_id = ? AND s.user_id = u.id
      WHERE u.mail_${o.cat} = 1 AND u.email IS NOT NULL AND u.email != '' AND u.banned = 0 AND s.user_id IS NULL ORDER BY u.id LIMIT ?`).bind(o.id, left).all()).results;
    if (!rows.length) { await env.DB.prepare("UPDATE mail_out SET status = 'done' WHERE id = ?").bind(o.id).run(); continue; }
    const L = JSON.parse(o.L);
    let stop = false;
    for (const u of rows) {
      const r = await sendOne(env, h, u, o.cat, L);
      if (!r.ok) { stop = true; break; } // лимит Resend или ошибка — попробуем через час
      await env.DB.batch([
        env.DB.prepare('INSERT OR IGNORE INTO mail_sent (out_id, user_id, at) VALUES (?, ?, ?)').bind(o.id, u.id, now()),
        env.DB.prepare('UPDATE mail_out SET sent = sent + 1 WHERE id = ?').bind(o.id),
      ]);
      n++; left--;
    }
    if (stop) break;
  }
  await spend(h, n);
}

const PAGE = {
  en: ['Unsubscribed', 'Done: no more e-mails from pigeonpolly.com.', 'Changed your mind? Choose what we send in your profile', 'Open profile'],
  ru: ['Отписка', 'Готово: писем с pigeonpolly.com больше не будет.', 'Передумали? Выбрать, что присылать, можно в профиле', 'Открыть профиль'],
  lv: ['Atrakstīšanās', 'Gatavs: vēstules no pigeonpolly.com vairs nenāks.', 'Pārdomāji? Izvēlies, ko sūtīt, profilā', 'Atvērt profilu'],
};

// h: json, fail, needUser, isAdmin, rigaDay, getMeta, setMeta
export async function mailApi(req, env, url, h) {
  const p = url.pathname, m = req.method, body = () => req.json().catch(() => ({}));

  // «Отписаться» из письма: GET — страница «Готово», POST — один клик из почтовой программы (List-Unsubscribe-Post)
  if (p === '/api/mail/off') {
    const uid = Number(url.searchParams.get('u')) || 0, k = url.searchParams.get('k') || '';
    const ok = uid > 0 && k === await token(env, h, uid);
    let lang = 'en';
    if (ok) {
      const u = await env.DB.prepare('SELECT mail_lang FROM users WHERE id = ?').bind(uid).first();
      if (u) lang = langOf(u.mail_lang);
      await env.DB.prepare('UPDATE users SET mail_games = 0, mail_feat = 0, mail_news = 0, mail_asked = ? WHERE id = ?').bind(now(), uid).run();
    }
    if (m === 'POST') return new Response(ok ? 'ok' : 'bad link', { status: ok ? 200 : 400 });
    const T = PAGE[lang];
    return new Response(`<!doctype html><html lang="${lang}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${T[0]} · Pigeon Polly</title>
<body style="font:18px/1.5 system-ui,sans-serif;background:#fffdf6;color:#2a1d40;max-width:520px;margin:12vh auto;padding:0 16px;text-align:center"><p style="font-size:48px;margin:0">🐦</p>
<h1 style="font-size:24px">${ok ? T[1] : 'This link does not work. Please open your profile on pigeonpolly.com.'}</h1><p>${T[2]}: <a href="${SITE}${pre(lang)}/bird/#mail">${T[3]}</a></p></body></html>`, { status: ok ? 200 : 400, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (m === 'POST' && p === '/api/mail/prefs') { // {games, feat, news, lang} — из окна при первом входе и из профиля
    const u = await h.needUser(req, env), b = await body();
    if (!mailOn(env) || !u.email) h.fail(400, 'mail');
    await env.DB.prepare('UPDATE users SET mail_games = ?, mail_feat = ?, mail_news = ?, mail_lang = ?, mail_asked = ? WHERE id = ?')
      .bind(b.games ? 1 : 0, b.feat ? 1 : 0, b.news ? 1 : 0, langOf(b.lang), now(), u.id).run();
    return h.json({ ok: true });
  }
  if (m === 'POST' && p === '/api/mail/later') { // «Не сейчас»
    const u = await h.needUser(req, env);
    await env.DB.prepare('UPDATE users SET mail_later = ? WHERE id = ?').bind(now(), u.id).run();
    return h.json({ ok: true });
  }

  // ---------- кабинет → ✉️ Письма ----------
  if (!p.startsWith('/api/admin/mail')) return null;
  const a = await h.needUser(req, env); if (!(await h.isAdmin(a, env))) h.fail(403, 'admin');
  const clean = L => {
    const out = {};
    for (const l of ['en', 'ru', 'lv']) { const x = (L || {})[l] || {}; out[l] = { s: String(x.s || '').slice(0, 200), t: String(x.t || '').slice(0, 20000) }; }
    if (!out.en.s.trim() || !out.en.t.trim()) h.fail(400, 'en');
    return out;
  };
  if (m === 'GET' && p === '/api/admin/mail') {
    const st = await env.DB.prepare(`SELECT COUNT(*) AS email, SUM(mail_asked > 0) AS asked, SUM(mail_later > 0 AND mail_asked = 0) AS later,
      SUM(mail_games) AS games, SUM(mail_feat) AS feat, SUM(mail_news) AS news FROM users WHERE email IS NOT NULL AND email != '' AND banned = 0`).first();
    const letters = (await env.DB.prepare('SELECT id, cat, L, status, total, sent, created_at FROM mail_out ORDER BY id DESC LIMIT 30').all()).results
      .map(o => ({ ...o, subject: (JSON.parse(o.L).en || {}).s || '', L: undefined }));
    return h.json({ on: mailOn(env), me: a.email || '', stats: st, today: await usedToday(h), max: MAIL_DAY_MAX, letters });
  }
  if (m !== 'POST') return null;
  const b = await body();
  if (p === '/api/admin/mail/test') { // проверка: письмо себе на каждом заполненном языке
    if (!mailOn(env) || !a.email) h.fail(400, 'mail');
    if (!MAIL_CATS.includes(b.cat)) h.fail(400, 'cat');
    const L = clean(b.L); let n = 0;
    for (const l of ['en', 'ru', 'lv']) if (L[l].s.trim() && L[l].t.trim()) { const r = await sendOne(env, h, { id: a.id, email: a.email, mail_lang: l }, b.cat, L); if (r.ok) n++; }
    await spend(h, n);
    return h.json({ ok: n > 0, sent: n, to: a.email });
  }
  if (p === '/api/admin/mail/send') { // разослать всем, кто включил этот вид
    if (!mailOn(env)) h.fail(400, 'mail');
    if (!MAIL_CATS.includes(b.cat)) h.fail(400, 'cat');
    const L = clean(b.L);
    const total = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM users WHERE mail_${b.cat} = 1 AND email IS NOT NULL AND email != '' AND banned = 0`).first()).n;
    const r = await env.DB.prepare("INSERT INTO mail_out (cat, L, status, total, created_at) VALUES (?, ?, 'send', ?, ?)").bind(b.cat, JSON.stringify(L), total, now()).run();
    await mailCron(env, h); // первая порция — сразу
    return h.json({ ok: true, id: r.meta.last_row_id, total });
  }
  if (p === '/api/admin/mail/stop') {
    await env.DB.prepare("UPDATE mail_out SET status = 'stop' WHERE id = ? AND status = 'send'").bind(Number(b.id) || 0).run();
    return h.json({ ok: true });
  }
  return null;
}
