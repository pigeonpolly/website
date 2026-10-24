// Письма с сайта по согласию (docs/bird.md «Письма»): три вида — games (уведомления из игр), feat (новые фишки), news (новости от Полли).
// Согласие: окно при первом входе (news.js askMail) → POST /api/mail/prefs; «Не сейчас» — /api/mail/later, спросит снова через 30 дней.
// Пока птичка не согласилась, писем нет. В каждом письме — «Отписаться» в один клик (/api/mail/off, ссылка с HMAC) и заголовок List-Unsubscribe.
// Рассылка из кабинета (✉️ Письма, site/assets/mail-admin.js): письмо на 3 языках → mail_out, отправка порциями: сразу и раз в час (mailCron),
// не больше MAIL_DAY_MAX в сутки вместе с письмами об адвенте и праздниках Воббленда (worker/wl-holidays.js — только при mail_games = 1) (Resend бесплатно: 100 в сутки).
import { mailOn, sendMail } from './auth.js';
import { grown, CROPS } from './garden.js';

export const MAIL_CATS = ['games', 'feat', 'news'];
export const MAIL_TABLES = [
  // письмо-рассылка: L — JSON {en: {s, t}, ru: …, lv: …}; status: send — идёт, done — всем отправлено, stop — остановлено
  'CREATE TABLE IF NOT EXISTS mail_out (id INTEGER PRIMARY KEY AUTOINCREMENT, cat TEXT NOT NULL, L TEXT NOT NULL, status TEXT NOT NULL, total INTEGER DEFAULT 0, sent INTEGER DEFAULT 0, created_at INTEGER)',
  'CREATE TABLE IF NOT EXISTS mail_sent (out_id INTEGER NOT NULL, user_id INTEGER NOT NULL, at INTEGER, PRIMARY KEY (out_id, user_id))',
];
// mail_games/feat/news — 1 = согласие; mail_asked — когда ответили в окне; mail_later — когда нажали «Не сейчас»; mail_lang — язык писем
export const MAIL_ALTER = ['ALTER TABLE users ADD COLUMN mail_games INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN mail_feat INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN mail_news INTEGER DEFAULT 0',
  'ALTER TABLE users ADD COLUMN mail_asked INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN mail_later INTEGER DEFAULT 0', "ALTER TABLE users ADD COLUMN mail_lang TEXT DEFAULT ''",
  // уведомления из игр (mailGamesCron): mail_g_at — последнее такое письмо; garden — время письма об огороде; titos — номер дела, о котором писали; streak — день письма о серии
  "ALTER TABLE users ADD COLUMN mail_day TEXT DEFAULT ''", // день (по Риге) последнего письма: больше одного письма в день птичке нельзя (решение Алины) — mailFree/mailSent
  'ALTER TABLE users ADD COLUMN mail_g_at INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN mail_g_garden INTEGER DEFAULT 0', 'ALTER TABLE users ADD COLUMN mail_g_titos INTEGER DEFAULT 0', "ALTER TABLE users ADD COLUMN mail_g_streak TEXT DEFAULT ''"];
// числа уведомлений из игр — в «📜 Правилах» (кабинет → Все правила → ✉️ Уведомления из игр)
export const MAIL_RULES = { mailGamesOn: true, mailStreakMin: 3, mailStreakHour: 19, mailGardenDays: 3, mailTitosDays: 4 };
export const MAIL_RANGE = { mailStreakMin: [1, 365], mailStreakHour: [12, 22], mailGardenDays: [1, 30], mailTitosDays: [1, 60] };
export const MAIL_INT = ['mailStreakMin', 'mailStreakHour', 'mailGardenDays', 'mailTitosDays'];
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

// ---------- уведомления из игр (вид games) ----------
// Раз в час (cron): только с согласием mail_games = 1 и если сегодня птичке ещё не было никакого письма (mail_day).
// 🔥 серия челленджа ≥ mailStreakMin дней сгорит сегодня (с mailStreakHour по Риге, сегодня ещё нет рисунка и не день свободы);
// 🥕/🌱 огород: созрел урожай или грядки сухие — если птичка не заходила больше суток, не чаще раза в mailGardenDays дней;
// 🕵️ Титос: следующее дело ждёт, а птичка не заходила mailTitosDays дней — один раз на каждое дело.
// h.streakRisk(uid) → {current, risk} (worker/index.js), h.rules() → RULES.
const ruN = (n, f) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : 2];
const GAME = {
  streak: (L, nick, n, link) => ({
    en: [`🔥 Your ${n}-day streak ends tonight`, `Hi, ${nick}!\n\nYou’ve drawn ${n} days in a row — and today’s theme is still waiting. Even a quick 10-minute sketch keeps the streak going.\n\n${link}\n\nPolly 🐦`],
    ru: [`🔥 Серия из ${n} ${ruN(n, ['дня', 'дней', 'дней'])} сгорит сегодня`, `Привет, ${nick}!\n\n${n} ${ruN(n, ['день', 'дня', 'дней'])} подряд с рисунком — а сегодняшняя тема ещё ждёт. Хватит даже быстрого скетча на 10 минут, чтобы серия не прервалась.\n\n${link}\n\nПолли 🐦`],
    lv: [`🔥 Tava ${n} dienu sērija beigsies šovakar`, `Sveiki, ${nick}!\n\nTu zīmē jau ${n} dienas pēc kārtas — un šodienas tēma vēl gaida. Pietiks pat ar ātru 10 minūšu skici, lai sērija nepārtrūktu.\n\n${link}\n\nPollija 🐦`],
  }[L]),
  ripe: (L, nick, link) => ({
    en: ['🥕 Your harvest is ready', `Hi, ${nick}!\n\nSomething has grown in your garden — come and pick it. The harvest sells for buttons 🔘.\n\n${link}\n\nPolly 🐦`],
    ru: ['🥕 Урожай созрел', `Привет, ${nick}!\n\nВ огороде что-то выросло — приходи собрать. Урожай можно продать за пуговки 🔘.\n\n${link}\n\nПолли 🐦`],
    lv: ['🥕 Raža ir gatava', `Sveiki, ${nick}!\n\nDārzā kaut kas ir izaudzis — nāc novākt. Ražu var pārdot par pogām 🔘.\n\n${link}\n\nPollija 🐦`],
  }[L]),
  dry: (L, nick, link) => ({
    en: ['🌱 Your garden is drying out', `Hi, ${nick}!\n\nThe beds in your garden are dry, and plants only grow in wet soil. One watering is enough for today.\n\n${link}\n\nPolly 🐦`],
    ru: ['🌱 Грядки сохнут', `Привет, ${nick}!\n\nГрядки в огороде высохли, а растения растут только во влажной земле. Одного полива на сегодня хватит.\n\n${link}\n\nПолли 🐦`],
    lv: ['🌱 Dobes izkalst', `Sveiki, ${nick}!\n\nDārza dobes ir izžuvušas, un augi aug tikai mitrā zemē. Šodienai pietiks ar vienu laistīšanu.\n\n${link}\n\nPollija 🐦`],
  }[L]),
  titos: (L, nick, n, title, link) => ({
    en: [`🕵️ Titos is waiting: case #${n}`, `Hi, ${nick}!\n\nDetective Titos can’t sleep: case #${n}${title ? ` “${title}”` : ''} is waiting on his desk. The coffee is hot ☕\n\n${link}\n\nPolly 🐦`],
    ru: [`🕵️ Титос ждёт: дело №${n}`, `Привет, ${nick}!\n\nДетективу Титосу не спится: на столе ждёт дело №${n}${title ? ` «${title}»` : ''}. Кофе уже горячий ☕\n\n${link}\n\nПолли 🐦`],
    lv: [`🕵️ Titoss gaida: lieta Nr. ${n}`, `Sveiki, ${nick}!\n\nDetektīvam Titosam nenāk miegs: uz galda gaida lieta Nr. ${n}${title ? ` “${title}”` : ''}. Kafija jau karsta ☕\n\n${link}\n\nPollija 🐦`],
  }[L]),
};
const pageUrl = (L, path, kind) => `${SITE}${pre(L)}${path}?utm_source=email&utm_campaign=game-${kind}`;
const parseJ = (s, d) => { try { return JSON.parse(s) || d; } catch (e) { return d; } };

export async function mailGamesCron(env, h) {
  const R = h.rules();
  if (!mailOn(env) || !R.mailGamesOn) return;
  let left = Math.min(MAIL_BATCH, MAIL_DAY_MAX - await usedToday(h)), n = 0;
  if (left <= 0) return;
  const t = now(), day = new Date().toISOString().slice(0, 10), base = `u.mail_games = 1 AND u.email IS NOT NULL AND u.email != '' AND u.banned = 0 AND u.nick IS NOT NULL AND u.nick != '' AND COALESCE(u.mail_day, '') != '${h.rigaDay()}'`; // одно письмо в день — любое
  const send = async (u, T, set, ...args) => {
    const L = langOf(u.mail_lang), [subject, text] = T;
    const r = await sendOne(env, h, u, 'games', { [L]: { s: subject, t: text }, en: { s: subject, t: text } });
    if (!r.ok) return false;
    await env.DB.prepare(`UPDATE users SET mail_g_at = ?, mail_day = ?, ${set} WHERE id = ?`).bind(t, h.rigaDay(), ...args, u.id).run();
    n++; left--; return true;
  };
  const hour = Number(new Date().toLocaleString('en-GB', { timeZone: 'Europe/Riga', hour: '2-digit', hour12: false }));

  // 🔥 серия сгорит сегодня
  if (hour >= R.mailStreakHour && hour < 23) {
    const rows = (await env.DB.prepare(`SELECT u.id, u.email, u.nick, u.mail_lang FROM users u WHERE ${base} AND COALESCE(u.mail_g_streak, '') != ?
      AND EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id AND p.day >= ?) AND NOT EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id AND p.day >= ?) LIMIT 60`)
      .bind(day, new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10), day).all()).results;
    for (const u of rows) {
      if (left <= 0) break;
      const s = await h.streakRisk(u.id);
      if (!s.risk || s.current < R.mailStreakMin) continue;
      const L = langOf(u.mail_lang);
      if (!(await send(u, GAME.streak(L, u.nick, s.current, pageUrl(L, '/challenge/', 'streak')), 'mail_g_streak = ?', day))) return spend(h, n);
    }
  }
  // 🥕 / 🌱 огород
  if (left > 0) {
    const rows = (await env.DB.prepare(`SELECT u.id, u.email, u.nick, u.mail_lang, g.beds FROM users u JOIN garden g ON g.user_id = u.id WHERE ${base}
      AND COALESCE(u.last_seen, 0) < ? AND COALESCE(u.mail_g_garden, 0) < ? AND g.beds LIKE '%"p"%' LIMIT 100`).bind(t - 86400, t - R.mailGardenDays * 86400).all().catch(() => ({ results: [] }))).results;
    const ms = Date.now(), wet = (R.gardenWetH || 24) * 36e5;
    for (const u of rows) {
      if (left <= 0) break;
      const beds = parseJ(u.beds, []).filter(b => b && CROPS[b.p]);
      const ripe = beds.some(b => grown(b, ms, R.gardenWetH || 24) >= CROPS[b.p] * 864e5);
      const dry = beds.some(b => grown(b, ms, R.gardenWetH || 24) < CROPS[b.p] * 864e5 && (!b.w || ms - b.w > wet + 6 * 36e5));
      if (!ripe && !dry) continue;
      const L = langOf(u.mail_lang), link = pageUrl(L, '/garden/', ripe ? 'ripe' : 'dry');
      if (!(await send(u, ripe ? GAME.ripe(L, u.nick, link) : GAME.dry(L, u.nick, link), 'mail_g_garden = ?', t))) return spend(h, n);
    }
  }
  // 🕵️ Титос: следующее дело ждёт
  if (left > 0) {
    const rows = (await env.DB.prepare(`SELECT u.id, u.email, u.nick, u.mail_lang, t.level FROM users u JOIN titos t ON t.user_id = u.id WHERE ${base}
      AND t.level >= 2 AND t.level < (SELECT MAX(n) FROM titos_cases) AND COALESCE(u.mail_g_titos, 0) < t.level + 1 AND COALESCE(u.last_seen, 0) < ? LIMIT 60`)
      .bind(t - R.mailTitosDays * 86400).all().catch(() => ({ results: [] }))).results;
    for (const u of rows) {
      if (left <= 0) break;
      const c = u.level + 1, L = langOf(u.mail_lang);
      const row = await env.DB.prepare('SELECT data, tr FROM titos_cases WHERE n = ?').bind(c).first();
      const ti = row ? (parseJ(row.data, {}).title || {}) : {}, tr = row ? parseJ(row.tr, {}) : {};
      const title = ti[L] || (L === 'ru' ? '' : (tr[ti.ru] || {})[L]) || (L === 'ru' ? ti.ru : '') || '';
      if (!(await send(u, GAME.titos(L, u.nick, c, title, pageUrl(L, '/titos/', 'case')), 'mail_g_titos = ?', c))) return spend(h, n);
    }
  }
  await spend(h, n);
}

// одно письмо в день на птичку — для всех писем с сайта (рассылки, уведомления из игр, праздники Воббленда, адвент); кроме писем о пароле
export const mailFree = 'COALESCE(mail_day, \'\') != ?'; // в WHERE, привязать h.rigaDay()
export const mailSent = (env, h, uid) => env.DB.prepare('UPDATE users SET mail_day = ? WHERE id = ?').bind(h.rigaDay(), uid).run();

const dayKey = h => 'mail_n:' + h.rigaDay();
async function usedToday(h) { const d = h.rigaDay(); return (await Promise.all(['mail_n:', 'advent_mail_n:', 'wl_mail_n:'].map(k => h.getMeta(k + d)))).reduce((a, v) => a + (Number(v) || 0), 0); } // вместе с адвентом и праздниками Воббленда
async function spend(h, n) { if (n) await h.setMeta(dayKey(h), String((Number(await h.getMeta(dayKey(h))) || 0) + n)); }

// порция рассылки: самое старое незаконченное письмо, сколько позволяет суточный лимит
export async function mailCron(env, h) {
  if (!mailOn(env)) return;
  let left = Math.min(MAIL_BATCH, MAIL_DAY_MAX - await usedToday(h)), n = 0;
  const outs = (await env.DB.prepare("SELECT * FROM mail_out WHERE status = 'send' ORDER BY id").all()).results; // по порядку; ждущая до завтра не держит следующие
  for (const o of outs) {
    if (left <= 0) break;
    if (!MAIL_CATS.includes(o.cat)) continue;
    const rows = (await env.DB.prepare(`SELECT u.id, u.email, u.mail_lang FROM users u LEFT JOIN mail_sent s ON s.out_id = ? AND s.user_id = u.id
      WHERE u.mail_${o.cat} = 1 AND u.email IS NOT NULL AND u.email != '' AND u.banned = 0 AND s.user_id IS NULL AND COALESCE(u.mail_day, '') != ? ORDER BY u.id LIMIT ?`).bind(o.id, h.rigaDay(), left).all()).results;
    if (!rows.length) { // никого сегодня: либо всем отправлено, либо остальным сегодня уже было письмо — тогда завтра
      const rest = await env.DB.prepare(`SELECT 1 FROM users u LEFT JOIN mail_sent s ON s.out_id = ? AND s.user_id = u.id WHERE u.mail_${o.cat} = 1 AND u.email IS NOT NULL AND u.email != '' AND u.banned = 0 AND s.user_id IS NULL LIMIT 1`).bind(o.id).first();
      if (!rest) await env.DB.prepare("UPDATE mail_out SET status = 'done' WHERE id = ?").bind(o.id).run();
      continue;
    }
    const L = JSON.parse(o.L);
    let stop = false;
    for (const u of rows) {
      const r = await sendOne(env, h, u, o.cat, L);
      if (!r.ok) { stop = true; break; } // лимит Resend или ошибка — попробуем через час
      await env.DB.batch([
        env.DB.prepare('INSERT OR IGNORE INTO mail_sent (out_id, user_id, at) VALUES (?, ?, ?)').bind(o.id, u.id, now()),
        env.DB.prepare('UPDATE mail_out SET sent = sent + 1 WHERE id = ?').bind(o.id),
        env.DB.prepare('UPDATE users SET mail_day = ? WHERE id = ?').bind(h.rigaDay(), u.id),
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
