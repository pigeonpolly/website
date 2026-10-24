// Праздники Воббленда (docs/wobbleland.md «Праздничные письма»): в день праздника (по Риге) каждой птичке с ником — тематическая вещь-подарок
// в «конвертик» (gifts status 'new', note 'wl:…'), а у кого есть почта и письма не выключены — письмо-поздравление со ссылкой на /wobbleland/.
// Данные — site/assets/wl-holidays.json (tools/catalog.js из content/wobbleland.json, поле holidays[].gift). Письма — sendMail (worker/auth.js):
// пока нет секретов RESEND_KEY и MAIL_FROM, писем нет, подарки приходят всё равно.
import { mailOn, sendMail } from './auth.js';

export const WL_ALTER = ["ALTER TABLE users ADD COLUMN lang TEXT DEFAULT ''", 'ALTER TABLE users ADD COLUMN wl_mail_off INTEGER DEFAULT 0', "ALTER TABLE users ADD COLUMN wl_sent TEXT DEFAULT ''"]; // lang — язык писем (последняя страница сайта), wl_sent — дата праздника, о котором уже написали
const MAIL_DAYS = 3; // Resend бесплатно: 100 писем в сутки — не успели в день праздника, дописываем ещё 2 дня
const DAY_MAX = 90, HOUR_MAX = 30; // общий лимит с письмом адвента (advent_mail_n:<день>)
const SITE = 'https://www.pigeonpolly.com';

let cache = null;
async function holidays(env) {
  if (cache) return cache;
  const r = await env.ASSETS.fetch(new Request(SITE + '/assets/wl-holidays.json')).catch(() => null);
  cache = r && r.ok ? await r.json() : [];
  return cache;
}
const shift = (day, n) => new Date(Date.parse(day + 'T12:00:00Z') + n * 86400000).toISOString().slice(0, 10);
export const wlNote = x => 'wl:' + [...x.title, ...x.town].map(s => s.replace(/\|/g, '/')).join('|');
const langOf = l => ['ru', 'lv'].includes(l) ? l : 'en';
async function unsubToken(env, h, id) {
  let salt = await h.getMeta('mail_salt');
  if (!salt) { salt = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join(''); await h.setMeta('mail_salt', salt); }
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':wl:' + id));
  return [...new Uint8Array(d)].slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
}

// письмо: поздравление на языке птички (несколько праздников в один день — в одном письме)
function letter(list, L, nick, off) {
  const i = { en: 0, ru: 1, lv: 2 }[L], pre = L === 'en' ? '' : '/' + L, link = SITE + pre + '/wobbleland/';
  const one = list.length === 1, h = list[0];
  const subject = [`🎉 ${one ? h.title[0] + ' · ' + h.town[0] : 'Holidays in Wobbleland'} — a gift for your bird`,
    `🎉 ${one ? h.title[1] + ' · ' + h.town[1] : 'Праздники в Воббленде'} — подарок для птички`,
    `🎉 ${one ? h.title[2] + ' · ' + h.town[2] : 'Svētki Vobblendā'} — dāvana tavam putniņam`][i];
  const hi = [`Hi, ${nick}!`, `Привет, ${nick}!`, `Sveiki, ${nick}!`][i];
  const parts = list.map(x => [
    `Today ${x.town[0]} celebrates “${x.title[0]}”.\n${x.desc[0]}\n\nThe whole town sends your bird a holiday gift: ${x.giftName[0]}. It is waiting in the envelope 🔔 on the site.`,
    `Сегодня ${x.town[1]} празднует «${x.title[1]}».\n${x.desc[1]}\n\nВесь город шлёт птичке праздничный подарок: ${x.giftName[1]}. Он ждёт в конвертике 🔔 на сайте.`,
    `Šodien ${x.town[2]} svin “${x.title[2]}”.\n${x.desc[2]}\n\nVisa pilsēta sūta tavam putniņam svētku dāvanu: ${x.giftName[2]}. Tā gaida aploksnē 🔔 vietnē.`][i]);
  const end = [`Happy holiday! Take a walk around Wobbleland — the map, towns, holidays and recipes:\n${link}\n\nAlina, Pigeon Polly Art Lab\n\n—\nYou get this because your bird lives on pigeonpolly.com. No more holiday emails: ${off}\nor untick it in your profile.`,
    `С праздником! Загляни в Воббленд — карта, города, праздники и рецепты:\n${link}\n\nАлина, Pigeon Polly Art Lab\n\n—\nЭто письмо приходит, потому что на pigeonpolly.com живёт твоя птичка. Больше не присылать праздничные письма: ${off}\nили снять галочку в профиле.`,
    `Priecīgus svētkus! Ieskaties Vobblendā — karte, pilsētas, svētki un receptes:\n${link}\n\nAlīna, Pigeon Polly Art Lab\n\n—\nŠo vēstuli saņem, jo vietnē pigeonpolly.com dzīvo tavs putniņš. Vairs nesūtīt svētku vēstules: ${off}\nvai noņem atzīmi profilā.`][i];
  return [subject, [hi, ...parts, end].join('\n\n')];
}

// раз в час из cron: подарки (один раз в день праздника) и письма порциями
export async function wlHolidayCron(env, h, force) {
  const day = force && force.day || h.rigaDay(), all = await holidays(env);
  const today = all.filter(x => x.md === day.slice(5));
  if (today.length && !(await h.getMeta('wl_gift:' + day))) {
    await h.setMeta('wl_gift:' + day, '1'); // сначала метка: при сбое лучше без подарка, чем подарок дважды
    const t = Math.floor(Date.now() / 1000);
    for (const x of today) {
      const [k, v] = x.gift.split('|');
      await env.DB.prepare("INSERT INTO gifts (user_id, kind, item, note, created_at) SELECT id, ?, ?, ?, ? FROM users WHERE banned = 0 AND nick IS NOT NULL AND nick != ''").bind(k, v, wlNote(x), t).run();
    }
  }
  if (!mailOn(env)) return;
  // письма: самый свежий праздник за последние MAIL_DAYS дней
  let key = null, list = [];
  for (let n = 0; n < MAIL_DAYS && !key; n++) { const d = shift(day, -n), l = all.filter(x => x.md === d.slice(5)); if (l.length && await h.getMeta('wl_gift:' + d)) { key = d; list = l; } }
  if (!key) return;
  const sent = Number(await h.getMeta('wl_mail_n:' + day)) || 0, adv = Number(await h.getMeta('advent_mail_n:' + day)) || 0;
  const lim = Math.max(0, Math.min(HOUR_MAX, DAY_MAX - sent - adv));
  if (!lim) return;
  const rows = (await env.DB.prepare("SELECT id, email, nick, lang FROM users WHERE email IS NOT NULL AND email != '' AND banned = 0 AND nick IS NOT NULL AND nick != '' AND COALESCE(wl_mail_off, 0) = 0 AND COALESCE(wl_sent, '') < ? ORDER BY id LIMIT ?").bind(key, lim).all()).results;
  let n = sent;
  for (const u of rows) {
    const L = langOf(u.lang), off = `${SITE}/api/wl-mail/off?u=${u.id}&t=${await unsubToken(env, h, u.id)}&l=${L}`;
    const [subj, text] = letter(list, L, u.nick, off);
    const r = await sendMail(env, u.email, subj, text);
    if (!r.ok) break; // лимит или ошибка — в следующий час
    await env.DB.prepare('UPDATE users SET wl_sent = ? WHERE id = ?').bind(key, u.id).run();
    n++;
  }
  if (n !== sent) await h.setMeta('wl_mail_n:' + day, String(n));
}

// /api/wl-mail/off — отписка по ссылке из письма; POST /api/wl-mail {on, lang} — галочка в профиле; язык писем — с каждой страницы (wlLang из whoami)
export async function wlMailApi(req, env, url, h) {
  const m = req.method, p = url.pathname;
  if (m === 'GET' && p === '/api/wl-mail/off') {
    const id = Number(url.searchParams.get('u')), L = langOf(url.searchParams.get('l')), i = { en: 0, ru: 1, lv: 2 }[L];
    const ok = id > 0 && url.searchParams.get('t') === await unsubToken(env, h, id);
    if (ok) await env.DB.prepare('UPDATE users SET wl_mail_off = 1 WHERE id = ?').bind(id).run();
    const msg = ok ? ['Done — no more Wobbleland holiday emails. Holiday gifts will still come to your bird.', 'Готово — праздничных писем Воббленда больше не будет. Подарки к праздникам птичка всё равно получит.', 'Gatavs — Vobblendas svētku vēstules vairs nenāks. Svētku dāvanas putniņš saņems tik un tā.'][i]
      : ['This link does not work. You can untick holiday emails in your profile.', 'Ссылка не подошла. Праздничные письма можно выключить в профиле.', 'Saite neder. Svētku vēstules var izslēgt profilā.'][i];
    return new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pigeon Polly</title><body style="font:18px/1.5 system-ui,sans-serif;max-width:32em;margin:3em auto;padding:0 16px;color:#2b2340;background:#fffdf8"><p>${msg}</p><p><a href="${SITE}${L === 'en' ? '' : '/' + L}/bird/">pigeonpolly.com</a></p>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  if (m === 'POST' && p === '/api/wl-mail') {
    const u = await h.needUser(req, env), b = await req.json().catch(() => ({}));
    await env.DB.prepare('UPDATE users SET wl_mail_off = ?, lang = ? WHERE id = ?').bind(b.on ? 0 : 1, langOf(b.lang), u.id).run();
    return h.json({ ok: true });
  }
  // кабинет: проверить праздник — подарки и письма за дату (md: 'MM-DD', год — текущий); повтор в тот же день подарков не дублирует
  if (m === 'POST' && p === '/api/admin/wl-holiday') {
    const u = await h.needUser(req, env); if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
    const b = await req.json().catch(() => ({})), md = String(b.md || '');
    if (!(await holidays(env)).some(x => x.md === md)) h.fail(400, 'day');
    await wlHolidayCron(env, h, { day: h.rigaDay().slice(0, 5) + md });
    return h.json({ ok: true, mail: mailOn(env) });
  }
  return null;
}
// язык писем — по странице, с которой спрашивают whoami (реферер /ru/…, /lv/…)
export function wlLang(req) {
  const r = req.headers.get('referer') || '';
  const m = /^https?:\/\/[^/]+\/(ru|lv)(\/|$)/.exec(r);
  return r ? (m ? m[1] : 'en') : null;
}
