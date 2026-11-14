// Оформление писем: из обычного текста письма — HTML в стиле сайта (sendMail в worker/auth.js добавляет его ко всем письмам сам).
// Текст остаётся как есть (запасной вид для почты без HTML). Правила разбора текста:
// абзацы — через пустую строку; ссылка одна на строке — кнопка-пилюля; «Подпись: ссылка» — подпись становится ссылкой;
// короткий последний абзац (Алина, Pigeon Polly Art Lab / Полли 🐦) — подпись; после строки «—» — мелкий подвал (отписка).
// Вид — новый дизайн сайта (v2.css), цвет и картинка — по сезону. Картинки — только с нашего сайта (значок, site/images/mail/<сезон>.jpg — полоса из hero главной). Просмотр всех писем — tools/mail_preview.mjs.
const SITE = 'https://www.pigeonpolly.com';
// цвета — как в новом дизайне (site/assets/v2.css): бумага, тёмные чернила, акцент сезона
const C = { bg: '#F4F0EA', sheet: '#FBF9F5', ink: '#2A211C', mut: '#6C6058', line: '#DED5CA' };
const ACC = { winter: '#9E1B22', spring: '#BE2F3A', summer: '#1F7FAE', autumn: '#22405F' };
const SERIF = "Fraunces, Lora, Georgia, 'Times New Roman', serif", SANS = "Karla, 'Nunito Sans', 'Helvetica Neue', Arial, sans-serif", HAND = "Caveat, 'Segoe Print', 'Bradley Hand', cursive";
// сезон по дате, как на сайте (v2.js): дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень
const seasonOf = d => ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'][(d || new Date()).getUTCMonth()];
const KICK = { en: 'A letter from the Art Lab', ru: 'Письмо из Art Lab', lv: 'Vēstule no Art Lab' };
const ED = { winter: ['winter edition', 'зимний выпуск', 'ziemas izdevums'], spring: ['spring edition', 'весенний выпуск', 'pavasara izdevums'], summer: ['summer edition', 'летний выпуск', 'vasaras izdevums'], autumn: ['autumn edition', 'осенний выпуск', 'rudens izdevums'] };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const langOf = t => /[а-яё]/i.test(t) ? 'ru' : /[āēīūčšžņļķģ]/i.test(t) ? 'lv' : 'en';
const BTN = { en: 'Open on the site', ru: 'Открыть на сайте', lv: 'Atvērt vietnē' };
const URL_RE = /https?:\/\/[^\s<>"«»]+[^\s<>"«».,;:!?)\]]/g;
const short = u => u.replace(/^https?:\/\/(www\.)?/, '').replace(/[?#].*$/, '').replace(/\/$/, '');
const link = (href, label, color) => `<a href="${esc(href)}" style="color:${color};text-decoration:underline;">${esc(label)}</a>`;
// строка текста: ссылки внутри — короткими; «Подпись: ссылка» — ссылкой на подписи
function line(s, color) {
  const m = s.match(/^(.{2,80}?):\s*(https?:\/\/\S+)$/);
  if (m) return link(m[2], m[1], color);
  let out = '', i = 0;
  for (const x of s.matchAll(URL_RE)) { out += esc(s.slice(i, x.index)) + link(x[0], short(x[0]), color); i = x.index + x[0].length; }
  return out + esc(s.slice(i));
}
const button = (href, label, acc) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 4px;"><tr><td style="border-radius:999px;background:${acc};">`
  + `<a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font:700 15px/1.2 ${SANS};color:#FFFFFF;text-decoration:none;border-radius:999px;">${esc(label)} &rarr;</a></td></tr></table>`;

export function mailHtml(subject, text, date) {
  const L = langOf(subject + text), sea = seasonOf(date), acc = ACC[sea], li = { en: 0, ru: 1, lv: 2 }[L];
  const raw = String(text).replace(/\r/g, '').trim();
  const cut = raw.search(/\n—\n|\n—$|^—\n/);
  const body = (cut < 0 ? raw : raw.slice(0, cut)).trim(), foot = cut < 0 ? '' : raw.slice(cut).replace(/^\n?—\n?/, '').trim();
  const paras = body.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  // подпись — короткий последний абзац в одну строку
  let sign = '';
  if (paras.length > 1 && !paras[paras.length - 1].includes('\n') && paras[paras.length - 1].length <= 48 && !/https?:\/\//.test(paras[paras.length - 1])) sign = paras.pop();
  const hi = paras.length > 1 && /^(hi|hello|привет|здравствуй|sveiki|čau)(?=[\s,!.]|$)/i.test(paras[0]) && paras[0].length <= 60 && !paras[0].includes('\n') ? paras.shift() : '';
  const P = `margin:0 0 18px;font:400 17px/1.65 ${SANS};color:${C.ink};`;
  const html = paras.map(p => {
    let lines = [], btns = '';
    for (const s of p.split('\n')) {
      const u = s.trim().match(/^https?:\/\/\S+$/);
      if (u) btns += button(u[0], BTN[L], acc); else lines.push(line(s, acc));
    }
    return (lines.length ? `<p style="${P}">${lines.join('<br>')}</p>` : '') + (btns ? `<div style="margin:-4px 0 22px;">${btns}</div>` : '');
  }).join('');
  const pre = esc((paras[0] || '').replace(URL_RE, '').replace(/\s+/g, ' ').slice(0, 140));
  const footHtml = foot ? foot.split('\n').map(s => line(s.trim(), C.mut)).join('<br>') : '';
  const home = SITE + (L === 'en' ? '/' : '/' + L + '/');
  const cell = 'role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"';
  return `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(subject)}</title>`
    + `<link rel="stylesheet" href="${SITE}/assets/fraunces.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Karla:wght@400;700&family=Caveat:wght@700&display=swap"></head>`
    + `<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%;">`
    + `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg};">${pre}&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>`
    + `<table ${cell} style="background:${C.bg};"><tr><td align="center" style="padding:28px 14px 36px;">`
    + `<table ${cell} style="max-width:600px;">`
    // шапка как на сайте: круглый значок сезона + «Pigeon Polly Art Lab» (Art Lab — курсивом цветом сезона), тонкая линия
    + `<tr><td style="padding:0 4px 18px;border-bottom:1px solid ${C.line};"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>`
    + `<td style="vertical-align:middle;width:66px;"><a href="${home}"><img src="${SITE}/assets/logo-badge-${sea}.png" width="56" height="56" alt="Pigeon Polly" style="display:block;border:0;"></a></td>`
    + `<td style="vertical-align:middle;"><a href="${home}" style="text-decoration:none;font:400 22px/1.1 ${SERIF};color:${C.ink};white-space:nowrap;">Pigeon Polly <i style="font-weight:300;color:${acc};">Art Lab</i></a>`
    + `<div style="font:700 18px/1.1 ${HAND};color:${acc};padding-top:4px;">${ED[sea][li]}</div></td>`
    + `</tr></table></td></tr>`
    // лист письма
    + `<tr><td style="padding:22px 0 0;"><table ${cell} style="background:${C.sheet};border:1px solid ${C.line};border-radius:20px;"><tr><td style="padding:30px 30px 10px;">`
    + `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;"><tr><td style="border:1px solid ${C.line};border-radius:999px;padding:8px 16px;background:${C.bg};font:700 11px/1 ${SANS};letter-spacing:.2em;text-transform:uppercase;color:${C.ink};">`
    + `<span style="color:${acc};">&#9679;</span>&nbsp; ${KICK[L]}</td></tr></table>`
    + `<h1 style="margin:0 0 22px;font:400 30px/1.15 ${SERIF};letter-spacing:-.01em;color:${C.ink};">${esc(subject)}</h1>`
    + (hi ? `<p style="margin:0 0 14px;font:700 26px/1.2 ${HAND};color:${acc};">${esc(hi)}</p>` : '')
    + html
    + (sign ? `<p style="margin:8px 0 18px;padding-top:16px;border-top:1px solid ${C.line};font:700 24px/1.2 ${HAND};color:${acc};">${esc(sign)}</p>` : '')
    + `</td></tr>`
    // акварель сезона внизу листа — картинка с главной
    + `<tr><td style="padding:0;"><a href="${home}"><img src="${SITE}/images/mail/${sea}.jpg" width="600" alt="" style="display:block;width:100%;height:auto;border:0;border-radius:0 0 19px 19px;"></a></td></tr>`
    + `</table></td></tr>`
    // подвал
    + `<tr><td style="padding:22px 20px 0;font:400 13px/1.6 ${SANS};color:${C.mut};text-align:center;">`
    + (footHtml ? `<p style="margin:0 0 14px;">${footHtml}</p>` : '')
    + `<p style="margin:0;font:700 11px/1.6 ${SANS};letter-spacing:.2em;text-transform:uppercase;"><a href="${home}" style="color:${C.ink};text-decoration:none;">pigeonpolly.com</a> <span style="color:${acc};">&middot;</span> Riga</p>`
    + `</td></tr></table></td></tr></table></body></html>`;
}
