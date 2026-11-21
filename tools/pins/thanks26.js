// Пины Thanksgiving №1411–1460 (Алина 21.11.2026: «пин на трендовую тему — Thanksgiving», скрин Pinterest «Discover what's resonating»:
// тёплый оранжевый/терракота/кремовый, застолье, рисованные надписи). Всё открыто, ведёт на настоящие страницы.
// node tools/pins/thanks26.js → site/images/pins/pin-NNN.jpg + tools/pins/thanks26.json (тексты для Notion).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const L = (p, n) => { const [a, h] = p.split('#'); return `${SITE}${a}?utm_source=pinterest&utm_campaign=thanks26&utm_content=pin-${n}${h ? '#' + h : ''}`; };
const U = k => 'file://' + path.join(ROOT, 'site/images', k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// тёплая тема в духе трендовых пинов; значок v3 «winter» — красно-рыжее кольцо к терракоте
const t = { bg: '#F6ECDF', fg: '#2E2521', acc: '#B4521E', acc2: '#E9A72B', mut: '#7A6658', card: '#FFFBF5', logo: 'color-winter' };
const PAL = require('../../content/palettes.json').find(p => p.key === '2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes');

const CSSf = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
h1{font:600 76px/1.02 Fraunces;letter-spacing:-.02em}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.kick{font:700 22px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc}}
.hand{font:700 46px/1.05 Caveat;color:${t.acc}}
.ft{position:absolute;left:44px;right:44px;bottom:30px;height:110px;display:flex;align-items:center;gap:18px}
.ft .lg{width:104px;height:104px}
.ft .ad{font:600 30px Fraunces}
.ft .cta{margin-left:auto;background:${t.btn || t.acc};color:${t.btnFg || '#fff'};font:700 25px Karla;padding:16px 26px;border-radius:40px}
.fr{border-radius:14px;overflow:hidden;box-shadow:0 18px 40px rgba(60,30,10,.18);background:#fff}
.leaf{position:absolute;font:700 60px Caveat;color:${t.acc2};opacity:.9}
`;
const foot = (cta, th = t) => `<div class="ft"><img class="lg" src="${U(`logo/v3/pigeon-polly-${th.logo}-transparent-4000.png`)}"><div class="ad">pigeonpolly.com</div><div class="cta">${esc(cta)} →</div></div>`;
const img = (k, W, H, pos = '50% 50%') => `<img src="${U(k)}" style="width:${W}px;height:${H}px;object-fit:cover;object-position:${pos};display:block">`;

const LIST = ['a pie with one slice gone', 'your table from above', 'a roast turkey (or a tofu one)', 'hands passing the gravy', 'a pile of autumn leaves',
  'a mug of apple cider', 'a basket of tiny pumpkins', 'a corn husk doll', 'your grandma’s recipe card', 'a cat stealing the stuffing',
  'cranberry sauce, can-shaped', 'a candle and two wine glasses', 'a cozy knitted sweater', 'mashed potatoes & butter', 'a pie crust lattice',
  'a “thankful” jar with notes', 'the leftovers sandwich', 'a fork, knife & napkin bow', 'an apple cut in half', 'a wreath of dried leaves',
  'the kids’ table', 'rain outside, warm inside', 'a sleepy guest on the sofa', 'a pumpkin spice latte', 'a dog waiting for crumbs',
  'a hand-lettered “thanks”', 'a harvest moon', 'a table set for one, cozy', 'friends toasting', 'one thing you’re grateful for'];
const THANK = ['my warm drink', 'someone I love', 'my cozy corner', 'today’s sky', 'my favourite dish', 'a small win', 'a good walk', 'something orange'];

const PINS = [
  { n: 1411, title: '30 Cozy Thanksgiving Things to Draw — Free Fall Drawing Prompts List',
    desc: 'Thanksgiving drawing ideas for your sketchbook: a pumpkin pie with one slice gone, your table from above, hands passing the gravy, a cat stealing the stuffing, a harvest moon… 30 cozy prompts, all on one pin — save it and draw one a day. More monthly prompt lists are free on pigeonpolly.com.',
    alt: 'A list of 30 cozy Thanksgiving things to draw on a warm cream background with a watercolour apple by Pigeon Polly.',
    link: L('/prompts/', 1411), topics: 'Thanksgiving drawing ideas, Fall drawing prompts, Sketchbook ideas, Cozy autumn art', tpl: 'Темы',
    html: () => `
    <div style="position:absolute;left:56px;top:58px;right:330px"><div class="kick">thanksgiving · drawing prompts</div>
      <h1 style="margin-top:18px">30 cozy <em>Thanksgiving</em> things to draw</h1></div>
    <div class="fr" style="position:absolute;right:56px;top:58px;transform:rotate(3deg)"><div style="width:250px;height:250px;overflow:hidden"><img src="${U('photos2/apple.jpg')}" style="width:455px;height:455px;margin:-113px 0 0 -106px;display:block"></div></div>
    <div style="position:absolute;left:56px;right:56px;top:410px;display:grid;grid-template-columns:1.05fr 1fr;grid-auto-flow:column;grid-template-rows:repeat(15,auto);column-gap:30px;row-gap:22px">
      ${LIST.map((s, i) => `<div style="display:flex;gap:12px;align-items:baseline;font:500 27px/1.2 Karla"><b style="font:600 27px Fraunces;color:${t.acc};min-width:38px">${i + 1}</b><span>${esc(s)}</span></div>`).join('')}</div>
    ${foot('More prompts')}` },
  { n: 1412, title: 'Thanksgiving Color Palette — Warm Fall HEX Codes from a Watercolour Illustration',
    desc: `A warm Thanksgiving colour palette taken from my watercolour of Pigeon Polly with tea on an autumn train: ${PAL.colors.map(c => `${c.en} ${c.hex}`).join(', ')}. Use it for fall illustrations, invitations or your sketchbook. All palettes with HEX codes are free on pigeonpolly.com.`,
    alt: 'Six warm autumn colours with names and HEX codes next to a watercolour of Pigeon Polly drinking tea on an autumn train.',
    link: L(`/palettes/#${PAL.key}`, 1412), topics: 'Thanksgiving color palette, Fall color palette, HEX color codes, Autumn colour inspiration', tpl: 'Палитра',
    html: () => `
    <div style="position:absolute;left:56px;top:58px;right:56px"><div class="kick">color palette · hex codes</div>
      <h1 style="margin-top:18px">A warm <em>Thanksgiving</em> palette</h1></div>
    <div class="fr" style="position:absolute;left:56px;right:56px;top:300px">${img(PAL.img.replace('images/', ''), 888, 520, '50% 55%')}</div>
    <div style="position:absolute;left:56px;right:56px;top:860px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      ${PAL.colors.map(c => `<div style="background:${t.card};border-radius:14px;overflow:hidden;box-shadow:0 6px 16px rgba(60,30,10,.1)"><div style="height:130px;background:${c.hex}"></div>
        <div style="padding:12px 16px"><div style="font:600 25px/1.1 Fraunces">${esc(c.en)}</div><div style="font:700 23px Karla;color:${t.mut};margin-top:4px;letter-spacing:.04em">${c.hex}</div></div></div>`).join('')}</div>
    ${foot('Get the palette')}` },
  { n: 1413, title: 'Thankful Sketchbook Page — 8 Tiny Gratitude Drawings for Thanksgiving',
    desc: 'A Thanksgiving sketchbook spread idea: draw 8 small things you’re thankful for — your warm drink, someone you love, your cozy corner, today’s sky, your favourite dish, a small win, a good walk and something orange. Five minutes each, no talent required. More drawing prompts on pigeonpolly.com.',
    alt: 'A sketchbook page layout with eight empty frames labelled with things to be thankful for, and a painting of milk and cookies by Pigeon Polly.',
    link: L('/prompts/', 1413), topics: 'Gratitude journal ideas, Thanksgiving sketchbook, Sketchbook layout ideas, Drawing prompts for adults', tpl: 'Темы',
    html: () => `
    <div style="position:absolute;left:56px;top:58px;right:56px"><div class="kick">thanksgiving · sketchbook page</div>
      <h1 style="margin-top:18px">Draw <em>8 tiny things</em> you’re thankful for</h1></div>
    <div style="position:absolute;left:56px;right:56px;top:370px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      ${THANK.slice(0, 4).map(s => `<div style="height:240px;border:3px dashed ${t.acc}55;border-radius:14px;background:${t.card};display:flex;align-items:flex-end;justify-content:center;padding:12px"><span class="hand" style="font-size:38px">${esc(s)}</span></div>`).join('')}
      <div class="fr" style="height:240px">${img('photos2/cookies.jpg', 280, 240, '40% 60%')}</div>
      ${THANK.slice(4).map(s => `<div style="height:240px;border:3px dashed ${t.acc}55;border-radius:14px;background:${t.card};display:flex;align-items:flex-end;justify-content:center;padding:12px"><span class="hand" style="font-size:38px">${esc(s)}</span></div>`).join('')}</div>
    <div style="position:absolute;left:56px;right:56px;top:1170px;text-align:center;font:600 30px Fraunces;color:${t.mut}">5 minutes each · pencil is enough</div>
    ${foot('More prompts')}` },
];
PINS.push(...require('./thanks26-more.js')({ esc, U, img, L, foot }));

(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_thanks.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
  const only = process.argv.slice(2).map(Number);
  for (const p of PINS) {
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap"><style>${CSSf(p.t || t)}</style></head><body>${p.html()}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => { const ft = document.querySelector('.ft').getBoundingClientRect().top; return Math.max(...[...document.querySelectorAll('body > *:not(.ft)')].map(e => e.getBoundingClientRect().bottom)) - ft; });
    if (over > 4) console.log('⚠ pin', p.n, 'наезжает на подвал на', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 85 });
  }
  fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, 'thanks26.json'), JSON.stringify(PINS.map(({ html, t, ...p }) => p), null, 1));
  await b.close();
})();
