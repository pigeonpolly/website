// Оформление писем: из обычного текста письма — HTML в стиле сайта (sendMail в worker/auth.js добавляет его ко всем письмам сам).
// Текст остаётся как есть (запасной вид для почты без HTML). Правила разбора текста:
// абзацы — через пустую строку; ссылка одна на строке — кнопка-пилюля; «Подпись: ссылка» — подпись становится ссылкой;
// короткий последний абзац (Алина, Pigeon Polly Art Lab / Полли 🐦) — подпись; после строки «—» — мелкий подвал (отписка).
// Картинки — только с нашего сайта (логотип). Просмотр всех писем — tools/mail_preview.mjs.
const SITE = 'https://www.pigeonpolly.com';
const C = { bg: '#2B1A51', violet: '#534AB7', card: '#FFFFFF', soft: '#F4F0FA', ink: '#2B1A51', text: '#3A2D5C', muted: '#7A7096', peach: '#F0A987', orange: '#D85A30', star: '#E9A93B', dot: '#F5C4B3' };
const SERIF = "Fraunces, Georgia, 'Times New Roman', serif", SANS = "Karla, 'Helvetica Neue', Arial, sans-serif";

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
const button = (href, label) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 4px;"><tr><td style="border-radius:999px;background:${C.orange};">`
  + `<a href="${esc(href)}" style="display:inline-block;padding:12px 26px;font:700 16px/1.2 ${SANS};color:#FFFFFF;text-decoration:none;border-radius:999px;">${esc(label)} &rarr;</a></td></tr></table>`;

export function mailHtml(subject, text) {
  const L = langOf(subject + text);
  const raw = String(text).replace(/\r/g, '').trim();
  const cut = raw.search(/\n—\n|\n—$|^—\n/);
  const body = (cut < 0 ? raw : raw.slice(0, cut)).trim(), foot = cut < 0 ? '' : raw.slice(cut).replace(/^\n?—\n?/, '').trim();
  const paras = body.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  // подпись — короткий последний абзац в одну строку
  let sign = '';
  if (paras.length > 1 && !paras[paras.length - 1].includes('\n') && paras[paras.length - 1].length <= 48 && !/https?:\/\//.test(paras[paras.length - 1])) sign = paras.pop();
  const hi = paras.length > 1 && /^(hi|hello|привет|здравствуй|sveiki|čau)(?=[\s,!.]|$)/i.test(paras[0]) && paras[0].length <= 60 && !paras[0].includes('\n') ? paras.shift() : '';
  const P = `margin:0 0 16px;font:400 17px/1.6 ${SANS};color:${C.text};`;
  const html = paras.map(p => {
    let lines = [], btns = '';
    for (const s of p.split('\n')) {
      const u = s.trim().match(/^https?:\/\/\S+$/);
      if (u) btns += button(u[0], BTN[L]); else lines.push(line(s, C.violet));
    }
    return (lines.length ? `<p style="${P}">${lines.join('<br>')}</p>` : '') + (btns ? `<div style="margin:-6px 0 18px;">${btns}</div>` : '');
  }).join('');
  const pre = esc((paras[0] || '').replace(URL_RE, '').replace(/\s+/g, ' ').slice(0, 140));
  const footHtml = foot ? foot.split('\n').map(s => line(s.trim(), C.muted)).join('<br>') : '';
  const home = SITE + (L === 'en' ? '/' : '/' + L + '/');
  return `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(subject)}</title></head>`
    + `<body style="margin:0;padding:0;background:${C.soft};-webkit-text-size-adjust:100%;">`
    + `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.soft};">${pre}&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};"><tr><td align="center" style="padding:24px 12px 32px;">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">`
    // шапка: тёмная полоса с пиксельной Полли и названием
    + `<tr><td style="background:${C.bg};border-radius:22px 22px 0 0;padding:22px 28px;">`
    + `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>`
    + `<td style="vertical-align:middle;padding-right:14px;"><a href="${home}"><img src="${SITE}/images/logo/pixel-dark-128.png" width="52" height="52" alt="Pigeon Polly" style="display:block;border:0;border-radius:14px;"></a></td>`
    + `<td style="vertical-align:middle;"><a href="${home}" style="text-decoration:none;"><div style="font:600 22px/1.15 ${SERIF};color:#F6F4F3;">Pigeon Polly <span style="color:${C.peach};">Art Lab</span></div>`
    + `</a></td></tr></table></td></tr>`
    // полоска цвета сайта
    + `<tr><td style="height:5px;line-height:5px;font-size:0;background:${C.orange};background-image:linear-gradient(90deg,${C.orange},${C.peach},${C.star});">&nbsp;</td></tr>`
    // тело письма
    + `<tr><td style="background:${C.card};padding:30px 28px 14px;border-radius:0 0 22px 22px;">`
    + `<h1 style="margin:0 0 18px;font:600 25px/1.25 ${SERIF};color:${C.ink};">${esc(subject)}</h1>`
    + (hi ? `<p style="margin:0 0 14px;font:600 19px/1.4 ${SERIF};color:${C.ink};">${esc(hi)}</p>` : '')
    + html
    + (sign ? `<p style="margin:22px 0 16px;padding-top:16px;border-top:1px dashed ${C.dot};font:italic 400 17px/1.4 ${SERIF};color:${C.violet};">${esc(sign)}</p>` : '')
    + `</td></tr>`
    // подвал
    + `<tr><td style="padding:20px 28px 0;font:400 13px/1.55 ${SANS};color:${C.muted};text-align:center;">`
    + (footHtml ? `<p style="margin:0 0 12px;">${footHtml}</p>` : '')
    + `<p style="margin:0;"><a href="${home}" style="color:${C.violet};text-decoration:none;font-weight:700;">pigeonpolly.com</a> &middot; Riga</p>`
    + `</td></tr></table></td></tr></table></body></html>`;
}
