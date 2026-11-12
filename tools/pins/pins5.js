// Пины 2.0 «арт впереди» — №262–281, зима и ожидание Нового года (ноябрь/декабрь).
// 6 шаблонов: label (этикетка), detail (деталь), sketch (страницы скетчбука), comic (комикс из арта), series (серия), meme (мем в стиле v2).
// Цвета и шрифты — как у сайта v2 зимой (site/assets/v2.css: Fraunces/Karla/Caveat, --bg #EEF1F3, --acc #9E1B22).
// node tools/pins/pins5.js [номер…] → site/images/pins/pin-NNN.jpg и tools/pins/pins5.json (тексты для Notion «Pinterest pins 2.0»).
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const L = p => SITE + p + '?utm_source=pinterest&utm_campaign=winter26';
const F = p => path.join(ROOT, 'site/images', p);
const U = p => 'file://' + F(p);
const dims = {}; const dim = p => dims[p] || (dims[p] = execSync(`identify -format "%w %h" "${F(p)}"`).toString().split(' ').map(Number));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const C = { bg: '#EEF1F3', sheet: '#F8FAFB', ink: '#1C2430', mut: '#5D6670', line: '#D3DAE0', acc: '#9E1B22', dark: '#1B2632' };
const A = {
  ny26: 'bird/2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year.jpg',
  ny25: 'bird/2025-pigeon-polly-celebrates-new-year.jpg',
  ny23: 'bird/2023-pigeon-polly-celebrates-new-year.jpg',
  ny22: 'bird/2022-pigeon-polly-celebrates-new-year-first-time-in-the-bed.jpg',
  chew: 'snail/2024-mr-chew-celebrates-new-year.jpg',
  roofs: 'v2/hero-winter.jpg',
  sbNY: 'sketchbook/sketchbook-18.jpg', sbCandle: 'sketchbook/sketchbook-5.jpg', sbRead: 'sketchbook/sketchbook-9.jpg', sbPers: 'sketchbook/sketchbook-17.jpg',
};
// Кусок картинки: x, y — левый верхний угол (доли ширины/высоты), w — доля ширины; высота — по пропорции рамки.
const crop = (k, x, y, w, W, H, extra = '') => {
  const [iw, ih] = dim(A[k]); const s = W / (w * iw);
  return `<div class="crop" style="width:${W}px;height:${H}px;${extra}"><img src="${U(A[k])}" style="width:${iw * s}px;height:${ih * s}px;left:${-x * iw * s}px;top:${-y * ih * s}px"></div>`;
};
const full = (k, W, extra = '') => { const [iw, ih] = dim(A[k]); return `<img class="full" src="${U(A[k])}" style="width:${W}px;height:${W * ih / iw}px;${extra}">`; };
const site = (c = C.mut) => `<div class="url" style="color:${c}">pigeonpolly.com</div>`;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${C.bg};color:${C.ink};font-family:Karla,sans-serif;position:relative}
.crop{position:relative;overflow:hidden}.crop img{position:absolute;max-width:none}
.full{display:block}
.url{position:absolute;left:0;right:0;bottom:46px;text-align:center;font:700 34px Caveat}
.hand{font:700 52px/1.05 Caveat;color:${C.acc}}
h1{font:600 74px/1.02 Fraunces;letter-spacing:-.02em}
.shadow{box-shadow:0 2px 4px rgba(28,36,48,.12),0 26px 50px rgba(28,36,48,.22)}
/* этикетка */
.lbl{background:#fff;padding:28px 32px;font:400 25px/1.45 Karla;color:${C.mut};box-shadow:0 1px 3px rgba(0,0,0,.12)}
.lbl b{display:block;font:600 33px/1.15 Fraunces;color:${C.ink};margin-bottom:10px}
/* мем */
.mt{font:700 64px/1.12 Karla;letter-spacing:-.01em}
.note{position:absolute;background:${C.sheet};padding:12px 26px;font:700 44px/1.1 Caveat;color:${C.ink};box-shadow:0 6px 16px rgba(28,36,48,.25)}
.tape{position:absolute;width:120px;height:36px;background:rgba(158,27,34,.28);left:50%;top:-16px;margin-left:-60px;transform:rotate(-3deg)}
.cards{position:absolute;left:50px;right:50px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px 22px}
.card{position:relative;background:#fff;padding:30px 18px 22px;font:700 44px/1.05 Caveat;color:${C.ink};text-align:center;min-height:150px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(28,36,48,.14)}
/* комикс */
.panel{border:6px solid ${C.ink};position:relative;background:#fff}
.panel .say{position:absolute;left:16px;top:14px;background:#fff;border:4px solid ${C.ink};padding:4px 18px;font:700 44px Caveat}
`;

const T = {
  label: p => { const h = 860 * dim(A[p.art])[1] / dim(A[p.art])[0], top = Math.round((1500 - h - 300) / 2), lt = top + h + 50; return `${full(p.art, 860, 'position:absolute;left:70px;top:' + top + 'px;box-shadow:0 2px 4px rgba(28,36,48,.12),0 26px 50px rgba(28,36,48,.22)')}
    <div class="lbl" style="position:absolute;right:70px;top:${lt}px;width:440px"><b>${esc(p.t)}</b>${p.lines.map(esc).join('<br>')}</div>
    ${p.hand ? `<div class="hand" style="position:absolute;left:70px;top:${lt + 30}px;width:360px;transform:rotate(-4deg)">${esc(p.hand)}</div>` : ''}${site()}`; },
  detail: p => `<div style="position:absolute;inset:0">${crop(p.art, ...p.c, 1000, 1500)}</div>
    <div style="position:absolute;left:50px;bottom:120px;border:8px solid #fff" class="shadow">${full(p.art, 400)}<div style="position:absolute;border:4px solid #F2C14E;left:${p.c[0] * 400}px;top:${p.c[1] * 400 * dim(A[p.art])[1] / dim(A[p.art])[0]}px;width:${p.c[2] * 400}px;height:${p.c[2] * 400 * 1.5}px"></div></div>
    <div class="note" style="right:50px;bottom:150px;max-width:470px;transform:rotate(-2deg)">${esc(p.hand)}</div>${site('#fff')}`,
  sketch: p => `<div style="position:absolute;inset:0;background:#15191f"></div>
    ${crop(p.a, ...p.ac, 1000, 735, 'position:absolute;left:0;top:0')}${crop(p.b, ...p.bc, 1000, 735, 'position:absolute;left:0;top:765px')}
    <div class="note" style="left:50%;top:750px;transform:translate(-50%,-50%) rotate(-2deg);white-space:nowrap">${esc(p.hand)}</div>
    <div class="url" style="color:#fff;bottom:30px;text-shadow:0 1px 8px rgba(0,0,0,.6)">pigeonpolly.com</div>`,
  comic: p => `<div style="position:absolute;left:50px;right:50px;top:${p.t ? 170 : 50}px;display:grid;gap:22px">
    ${p.t ? '' : ''}${p.panels.map(q => `<div class="panel">${crop(q.art || p.art, ...q.c, 888, p.t ? 375 : 405)}<span class="say">${esc(q.say)}</span></div>`).join('')}</div>
    ${p.t ? `<h1 style="position:absolute;left:50px;right:50px;top:50px;font-size:56px">${esc(p.t)}</h1>` : ''}${site()}`,
  series: p => `<h1 style="position:absolute;left:60px;right:60px;top:70px;font-size:${p.fs || 70}px">${esc(p.t)}</h1>
    <div style="position:absolute;left:40px;right:40px;top:${p.gtop || 280}px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
    ${p.items.map(q => `<div style="position:relative">${crop(q.art, ...(q.c || [0, 0, 1]), 452, p.h || 500)}${q.y ? `<span class="note" style="left:12px;bottom:12px;padding:4px 16px;font-size:40px">${esc(q.y)}</span>` : ''}</div>`).join('')}</div>${site()}`,
  prompts: p => `<div style="position:absolute;inset:0;background:#2E2521"></div>
    <div style="position:absolute;left:64px;top:64px;font:700 46px Caveat;color:#93AFCC;transform:rotate(-2deg)">${esc(p.kick)}</div>
    <h1 style="position:absolute;left:62px;right:50px;top:124px;font-size:86px;line-height:.98;color:#F1ECE4">${esc(p.t)}<br><em style="font-style:italic;font-weight:400;color:#93AFCC">${esc(p.t2)}</em></h1>
    <div style="position:absolute;left:62px;top:345px;border:10px solid #F1ECE4;transform:rotate(-1.2deg);box-shadow:0 26px 50px rgba(0,0,0,.45)">${crop(p.art, ...p.c, 856, p.items.length > 6 ? 470 : 540)}</div>
    <div style="position:absolute;left:62px;right:50px;top:${p.items.length > 6 ? 870 : 960}px;display:grid;grid-template-columns:1fr 1fr;gap:${p.items.length > 6 ? 22 : 26}px 34px">${p.items.map(q => `<div style="font:700 ${p.items.length > 6 ? 54 : 56}px/1.02 Caveat;color:#93AFCC;padding-left:52px;position:relative"><span style="position:absolute;left:8px;top:.45em;width:18px;height:18px;border-radius:50%;background:#C9A27A"></span>${esc(q)}</div>`).join('')}</div>
    <div class="url" style="bottom:40px;color:#B9AEA4">${esc(p.foot)} · pigeonpolly.com</div>`,
  meme: p => `<div class="mt" style="position:absolute;left:60px;right:60px;top:80px">${esc(p.top)}</div>
    ${p.two ? p.two.map((q, i) => `<div class="shadow" style="position:absolute;left:60px;top:${240 + i * 560}px;border:10px solid #fff">${crop(q.art, ...q.c, 860, 480)}<span class="note" style="right:-20px;top:-26px;transform:rotate(${i ? 3 : -3}deg)">${esc(q.say)}</span></div>`).join('')
      : `<div class="shadow" style="position:absolute;left:60px;top:${p.itop || 380}px;border:12px solid #fff;transform:rotate(${p.rot || -1.5}deg)">${crop(p.art, ...p.c, 856, p.ih || 900)}</div>
      ${p.say ? `<div class="note" style="right:60px;bottom:150px;transform:rotate(2deg)">${esc(p.say)}</div>` : ''}`}${site()}`,
};

const BIRD = L('/art-portfolio/bird/'), CHEW = L('/art-portfolio/snail/'), SB = L('/art-portfolio/sketchbook/');
const PINS = [
  // — Этикетка —
  { n: 262, tpl: 'label', type: 'Этикетка', art: 'ny26', top: 260, ltop: 990, t: 'Pigeon Polly, Sam, Milka cat and Horse of the year celebrate New Year', lines: ['2026', 'Pigeon Polly series', 'Alina Otkinska'], hand: 'the horse was not invited', link: BIRD,
    title: 'Pigeon Polly’s New Year party, with Sam, Milka the cat and the Horse of the year', desc: 'A cozy New Year’s Eve illustration: Pigeon Polly with a glass of bubbly, a sparkling Christmas tree, Milka the cat, Sam and the Horse of the year laughing in the corner. More Pigeon Polly art in the gallery.',
    alt: 'Illustration of a blue pigeon in bed with a glass of champagne next to a decorated Christmas tree, a laughing horse, a cat and a white bird, with festive food on the blanket.', topics: 'New Year illustration, Christmas art, cozy illustration, pigeon art, holiday art' },
  { n: 263, tpl: 'label', type: 'Этикетка', art: 'chew', top: 230, ltop: 900, t: 'Mr.Chew celebrates New Year', lines: ['2024', 'Mr.Chew series', 'Alina Otkinska'], hand: 'jo-ho-ho, slowly', link: CHEW,
    title: 'Mr.Chew the snail celebrates New Year', desc: 'Mr.Chew the snail and his snowman friends carry a sack full of presents. A winter holiday illustration from the Mr.Chew series by Alina Otkinska.',
    alt: 'Illustration of a snail and two snowmen in Santa hats with a big red sack of presents and the words Happy new year, jo-ho-ho.', topics: 'snail illustration, New Year card, Christmas illustration, cute holiday art' },
  { n: 264, tpl: 'label', type: 'Этикетка', art: 'ny22', top: 230, ltop: 960, t: 'Pigeon Polly celebrates New Year first time in the bed', lines: ['2022', 'Pigeon Polly series', 'Alina Otkinska'], hand: 'best party of the year', link: BIRD,
    title: 'Pigeon Polly celebrates New Year in bed for the first time', desc: 'A Santa hat, a bowl of salad, tangerines and a warm blanket — Pigeon Polly’s quietest New Year’s Eve. Watercolor illustration from the Pigeon Polly series.',
    alt: 'Watercolor of a pigeon in a Santa hat sitting in bed with a bowl of salad and tangerines, with a garland and a curtained window.', topics: 'cozy New Year, watercolor illustration, introvert holidays, pigeon art' },
  // — Деталь —
  { n: 265, tpl: 'detail', type: 'Деталь', art: 'ny26', c: [0, 0.02, 0.36], hand: 'look who came to the party', link: BIRD,
    title: 'Look closer: who came to Pigeon Polly’s New Year party?', desc: 'A close-up from the 2026 New Year illustration — the Horse of the year is having the best time. See the whole painting in the Pigeon Polly gallery.',
    alt: 'Close-up of a laughing brown horse next to a Christmas tree with colorful lights; the full illustration of the New Year party is shown small in the corner.', topics: 'Year of the Horse 2026, Christmas tree art, illustration details' },
  { n: 266, tpl: 'detail', type: 'Деталь', art: 'ny25', c: [0.0, 0.0, 0.3], hand: 'the countdown is on', link: BIRD,
    title: 'Countdown to New Year with Pigeon Polly', desc: 'A detail from “Pigeon Polly celebrates New Year” (2025): the calendar already says 31. See the whole illustration in the gallery.',
    alt: 'Close-up of a wall calendar showing 31 in a cozy purple bedroom; the full illustration of a pigeon cooking in bed is shown small in the corner.', topics: 'New Year countdown, December 31, cozy illustration' },
  { n: 267, tpl: 'detail', type: 'Деталь', art: 'sbNY', c: [0.33, 0.0, 0.48], hand: 'one more page until 2026', link: SB,
    title: 'A New Year table in my sketchbook', desc: 'Close-up of a sketchbook page painted for New Year 2026: a 2026 sign, garlands and sparklers. Pages from my sketchbook are on the site.',
    alt: 'Close-up of a watercolor sketchbook page with a 2026 sign and a sparkler; the full spread with a festive table is shown small in the corner.', topics: 'sketchbook ideas, New Year sketchbook, watercolor sketch' },
  // — Скетчбук —
  { n: 268, tpl: 'sketch', type: 'Скетчбук', a: 'sbNY', ac: [0, 0.03, 1], b: 'sbCandle', bc: [0, 0.03, 1], hand: 'waiting for New Year, page by page', link: SB,
    title: 'Two sketchbook pages while waiting for New Year', desc: 'A festive New Year table and a quiet winter morning with coffee, a croissant and a candle — two real pages from my watercolor sketchbook.',
    alt: 'Photo of two open sketchbooks: one with a New Year table, champagne, tangerines and a 2026 sign; another with coffee, a croissant and a candle by a snowy window.', topics: 'sketchbook inspiration, winter sketchbook, watercolor journal, cozy art' },
  { n: 269, tpl: 'sketch', type: 'Скетчбук', a: 'sbRead', ac: [0, 0.05, 1], b: 'sbPers', bc: [0, 0.08, 1], hand: 'long winter evenings', link: SB,
    title: 'Winter evenings in my sketchbook', desc: 'Reading under a blanket and a page of persimmons — two real sketchbook pages for long winter evenings.',
    alt: 'Photo of two sketchbooks: a girl reading in a cozy room with books and garlands, and a bright blue page with orange persimmons.', topics: 'winter sketchbook, cozy drawing ideas, persimmon watercolor' },
  // — Комикс —
  { n: 270, tpl: 'comic', type: 'Комикс', t: 'Pigeon Polly, every New Year’s Eve', panels: [
      { art: 'ny23', c: [0.06, 0.2, 0.55], say: '2023' },
      { art: 'ny25', c: [0.06, 0.2, 0.55], say: '2025: same bed' },
      { art: 'ny26', c: [0.0, 0.08, 0.7], say: '2026: …a horse?' }], link: BIRD,
    title: 'Pigeon Polly, every New Year’s Eve', desc: 'Same bed, same pillow, new year: three New Year illustrations of Pigeon Polly, 2023–2026. All of them are in the gallery.',
    alt: 'Three comic panels cropped from Pigeon Polly New Year illustrations: a pigeon in bed in 2023, the same bed in 2025, then with a laughing horse and a Christmas tree.', topics: 'relatable New Year, introvert holidays, comic, pigeon art' },
  { n: 271, tpl: 'comic', type: 'Комикс', art: 'ny22', panels: [
      { c: [0.05, 0.0, 0.62], say: '1. hat on' },
      { c: [0.22, 0.4, 0.55], say: '2. salad' },
      { c: [0.45, 0.3, 0.55], say: '3. tangerines. party complete.' }], link: BIRD,
    title: 'How to throw a New Year party in bed', desc: 'Hat on, salad, tangerines — party complete. A three-step comic cut from “Pigeon Polly celebrates New Year first time in the bed”.',
    alt: 'Three comic panels from a watercolor: a pigeon in a Santa hat, a bowl of salad on a blanket, and tangerines on the bed.', topics: 'funny New Year, cozy party, watercolor comic' },
  { n: 272, tpl: 'comic', type: 'Комикс', art: 'chew', panels: [
      { c: [0.0, 0.08, 0.6], say: 'me: just one gift' },
      { c: [0.12, 0.45, 0.42], say: 'also me:' },
      { c: [0.55, 0.42, 0.42], say: 'jo-ho-ho' }], link: CHEW,
    title: 'Holiday shopping, as told by Mr.Chew', desc: 'Just one gift… and then a whole sack. A tiny comic cut from “Mr.Chew celebrates New Year”.',
    alt: 'Three comic panels from an illustration: a snail and snowmen in Santa hats, a huge red sack of presents, and handwritten jo-ho-ho.', topics: 'Christmas shopping, gift ideas humor, snail art' },
  // — Серия —
  { n: 273, tpl: 'series', type: 'Серия', t: 'Pigeon Polly’s New Year’s Eves', items: [
      { art: 'ny22', c: [0.1, 0, 0.75], y: '2022' }, { art: 'ny23', c: [0.2, 0, 0.6], y: '2023' },
      { art: 'ny25', c: [0.2, 0, 0.6], y: '2025' }, { art: 'ny26', c: [0.3, 0, 0.6], y: '2026' }], h: 520, link: BIRD,
    title: 'Pigeon Polly’s New Year’s Eves, 2022–2026', desc: 'Four years of New Year illustrations: which one is your New Year’s Eve? The whole Pigeon Polly series is in the gallery.',
    alt: 'Grid of four New Year illustrations of a pigeon in bed, labeled 2022, 2023, 2025 and 2026.', topics: 'New Year illustration, series, which one are you, cozy art' },
  { n: 274, tpl: 'series', type: 'Серия', t: 'Winter in my sketchbook', items: [
      { art: 'sbNY', c: [0.05, 0.05, 0.55] }, { art: 'sbCandle', c: [0.3, 0.1, 0.55] },
      { art: 'sbRead', c: [0.3, 0.1, 0.55] }, { art: 'sbPers', c: [0.2, 0.05, 0.55] }], h: 520, link: SB,
    title: 'Winter in my sketchbook: 4 cozy pages', desc: 'A New Year table, coffee by a snowy window, reading under a blanket and persimmons — four sketchbook pages to inspire your winter journal.',
    alt: 'Grid of four watercolor sketchbook pages: a festive table, a coffee cup and croissant, a girl reading, and persimmons.', topics: 'winter sketchbook ideas, watercolor journal, what to draw in winter' },
  // — Мемы —
  { n: 275, tpl: 'meme', type: 'Мем', top: 'me in November pretending I’m not already waiting for New Year', art: 'ny22', c: [0, 0, 0.75], ih: 820, itop: 420, say: 'it’s only November', link: BIRD,
    title: 'Me in November pretending I’m not waiting for New Year', desc: 'Santa hat already on. Pigeon Polly knows. Watercolor from the Pigeon Polly series.',
    alt: 'Meme: a watercolor pigeon in a Santa hat in bed, with the caption about waiting for New Year in November.', topics: 'November meme, Christmas mood, relatable meme' },
  { n: 276, tpl: 'meme', type: 'Мем', top: 'December:', two: [
      { art: 'ny26', c: [0.05, 0.05, 0.9], say: 'the plan' }, { art: 'ny23', c: [0.1, 0.05, 0.8], say: 'what actually happens' }], link: BIRD,
    title: 'December plans vs December reality', desc: 'The plan: a big party. What actually happens: bed, cake and a series. Both are Pigeon Polly.',
    alt: 'Meme with two illustrations: a busy New Year party with a Christmas tree and friends, and a pigeon alone in bed with cake and a laptop.', topics: 'December meme, introvert meme, plans vs reality' },
  { n: 277, tpl: 'meme', type: 'Мем', top: 'when someone says “it’s too early for Christmas music”', art: 'ny26', c: [0, 0, 0.42], ih: 860, itop: 400, link: BIRD,
    title: 'When someone says it’s too early for Christmas music', desc: 'The Horse of the year disagrees. A detail from Pigeon Polly’s 2026 New Year illustration.',
    alt: 'Meme: a laughing horse next to a sparkling Christmas tree.', topics: 'Christmas music meme, funny horse, holiday mood' },
  { n: 278, tpl: 'meme', type: 'Мем', top: 'the last week of December be like', art: 'ny25', c: [0.25, 0.1, 0.55], ih: 860, itop: 340, say: 'what day is it?', link: BIRD,
    title: 'The last week of December be like', desc: 'Cooking in bed, a series on, no idea what day it is. Pigeon Polly, 2025.',
    alt: 'Meme: a pigeon in a sleep mask cutting sausage in bed in front of a laptop.', topics: 'holiday meme, between Christmas and New Year, relatable' },
  { n: 279, tpl: 'meme', type: 'Мем', top: 'me carrying all my holiday plans into January', art: 'chew', c: [0, 0.1, 0.62], ih: 860, itop: 340, link: CHEW,
    title: 'Me carrying all my holiday plans into January', desc: 'Mr.Chew and his snowmen know the feeling. From “Mr.Chew celebrates New Year”.',
    alt: 'Meme: a snail and two snowmen in Santa hats with a giant red sack of presents.', topics: 'New Year resolutions meme, snail, holiday plans' },
  { n: 280, tpl: 'meme', type: 'Мем', top: 'winter mood: stay home, look at roofs, make tea', art: 'roofs', c: [0, 0, 1], ih: 640, itop: 470, say: 'this is the whole plan', link: L('/'),
    title: 'Winter mood: stay home, look at roofs, make tea', desc: 'A watercolor of old rooftops under a winter sky — the whole plan for the weekend.',
    alt: 'Meme: watercolor of old tiled rooftops and towers under a blue sky.', topics: 'winter mood, cozy weekend, rooftops watercolor' },
  { n: 281, tpl: 'meme', type: 'Мем', top: 'my New Year’s resolution: more pages like this', art: 'sbCandle', c: [0.05, 0.02, 0.9], ih: 700, itop: 400, link: SB,
    title: 'New Year’s resolution: more sketchbook pages like this', desc: 'Coffee, a croissant, a candle and snow outside — a real sketchbook page. Start your own winter sketchbook.',
    alt: 'Meme: photo of a sketchbook page with coffee, a croissant and a candle by a snowy window.', topics: 'New Year resolution, sketchbook habit, cozy art' },
  // — Темы для рисования —
  { n: 282, tpl: 'prompts', type: 'Темы', kick: 'November sketchbook', t: 'What to draw', t2: 'this November', art: 'roofs', c: [0, 0.25, 1], foot: 'a new theme every day',
    items: ['a mug of cocoa', 'a frosty window', 'tangerine peel', 'your warmest scarf', 'a candle', 'a tram stop at night', 'wool socks', 'a teapot', 'a snowy rooftop'], link: L('/challenge/'),
    title: 'What to draw this November: 9 cozy ideas', desc: 'Stuck? Nine small, cozy things to draw or paint this November — from a mug of cocoa to a snowy rooftop. Get a new drawing theme every day on the site.',
    alt: 'Nine handwritten paper notes with November drawing ideas under a watercolor of winter rooftops.', topics: 'November drawing ideas, drawing prompts, what to draw, sketchbook prompts' },
  { n: 283, tpl: 'prompts', type: 'Темы', kick: 'December sketchbook', t: 'What to draw', t2: 'in December', art: 'sbNY', c: [0, 0.12, 1], foot: 'a new theme every day',
    items: ['a garland', 'a bowl of tangerines', 'gift wrap', 'a tree ornament', 'the calendar page “31”', 'a sparkler', 'a festive salad', 'a pine cone', 'a snow globe'], link: L('/challenge/'),
    title: 'What to draw in December: 9 festive ideas', desc: 'Garlands, tangerines, sparklers and the calendar page that says 31 — nine December drawing ideas for your sketchbook. New theme every day on the site.',
    alt: 'Nine handwritten paper notes with December drawing ideas under a photo of a sketchbook page with a New Year table.', topics: 'December drawing ideas, Christmas drawing prompts, advent sketchbook' },
  { n: 284, tpl: 'prompts', type: 'Темы', kick: 'counting down to midnight', t: 'Draw your', t2: 'New Year’s Eve', art: 'ny22', c: [0.01, 0, 0.96], foot: 'join the drawing challenge',
    items: ['your New Year table', 'what you’ll wear', 'the view at midnight', 'the first person you’ll call', 'your 2026 in one object', 'your bed (like Polly)'], link: L('/challenge/'),
    title: 'Draw your New Year’s Eve: 6 drawing ideas', desc: 'Your table, your outfit, the view at midnight — six New Year’s Eve drawing ideas. Or celebrate in bed, like Pigeon Polly.',
    alt: 'Six handwritten paper notes with New Year’s Eve drawing ideas under a watercolor of a pigeon in a Santa hat in bed.', topics: 'New Year drawing ideas, drawing prompts, journal ideas' },
  { n: 285, tpl: 'prompts', type: 'Темы', kick: 'for your OC', t: 'Winter prompts', t2: 'for your character', art: 'chew', c: [0.08, 0, 0.82], foot: 'join the drawing challenge',
    items: ['wrapped in a blanket', 'building a snowman', 'waiting for a tram in the snow', 'ice skating, badly', 'carrying too many gifts', 'asleep before midnight'], link: L('/challenge/'),
    title: 'Winter drawing prompts for your character', desc: 'Six winter situations to draw your character in — from ice skating badly to falling asleep before midnight. Mr.Chew already carries too many gifts.',
    alt: 'Six handwritten paper notes with winter character drawing prompts under an illustration of a snail with a sack of presents.', topics: 'character drawing prompts, OC prompts, winter art challenge' },
];

(async () => {
  const only = process.argv.slice(2).map(Number);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_pin5.html'); const out = [];
  for (const p of PINS) {
    out.push({ n: p.n, type: p.type, title: p.title, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics });
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap"><style>${CSS}</style></head><body>${T[p.tpl](p)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 88 });
  }
  fs.unlinkSync(tmp); fs.writeFileSync(path.join(__dirname, 'pins5.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
