// Пины-палитры как p01–p59 (тёмный низ, арт сверху, 6 плашек с HEX) для палитр, у которых ещё не было пина.
// №336–346, utm_campaign=promote, в Notion «Pinterest pins 3.0» с актуальностью PROMOTE.
// node tools/pins/pins7.js [номер…] → site/images/pins/pin-NNN.jpg (1000×1500) и tools/pins/pins7.json.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const UTM = '?utm_source=pinterest&utm_campaign=promote';
const PAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const SER = {
  bird: 'from my Pigeon Polly series, about a little pigeon who lives through all the same small dramas we do',
  snail: 'from my Mr. Chew series, about a slow, cozy snail who dresses up for every occasion',
  sketchbook: 'a page from my sketchbook',
  halloween: 'from my Halloween series of pumpkin-headed portraits',
};

// n, ключ, позиция арта, настроение для описания, темы
const PINS = [
  [336, '2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year', '50% 40%', 'Champagne gold and fir green against a deep midnight wall: a cozy New Year’s Eve palette.', 'New Year color palette, Christmas color palette, Cozy winter colors, HEX codes, Holiday illustration'],
  [337, '2024-pigeon-polly-bath-relax', '50% 50%', 'Calm bathroom blues with soft foam and a touch of plum, for slow evenings and self-care art.', 'Blue color palette, Calm colors, Self care aesthetic, HEX codes, Cozy illustration'],
  [338, '2022-pigeon-polly-started-own-small-business', '50% 35%', 'Sunny van yellow, summer sky blue and waffle-cone browns: pure summer holiday energy.', 'Summer color palette, Bright color palette, Yellow and blue, HEX codes, Ice cream art'],
  [339, '2022-pigeon-polly-summer-lover', '50% 40%', 'Sea breeze blues, warm sand and a sun-hat orange: a breezy beach palette.', 'Beach color palette, Summer colors, Coastal palette, HEX codes, Vacation illustration'],
  [340, '2019-pigeon-polly-writing-diploma', '50% 45%', 'Desk-lamp amber, raspberry deadline red and midnight panic: a warm, dark-academia study palette.', 'Dark academia palette, Warm color palette, Study aesthetic, HEX codes, Watercolor palette'],
  [341, '2025-mr-chew-opened-pumpkin-spice-latte-season', '50% 50%', 'Pumpkin orange, burnt cinnamon and a denim-blue scarf: the coziest autumn palette.', 'Autumn color palette, Fall colors, Pumpkin spice, HEX codes, Cozy fall art'],
  [342, '2024-mr-chew-dnd-edition', '50% 50%', 'Potion green, D20 orange and dungeon dark: a fantasy tabletop palette for your next campaign art.', 'Fantasy color palette, DnD art, Green color palette, HEX codes, Witchy aesthetic'],
  [343, '2024-mr-chew-gardening-edition', '50% 55%', 'Clay pot, terracotta, potting soil and olive leaf: an earthy, calm garden palette.', 'Earthy color palette, Terracotta palette, Garden aesthetic, HEX codes, Neutral colors'],
  [344, 'sketchbook-15', '50% 50%', 'Cloudberry gold on lichen and rainy forest greys: a moody Nordic nature palette.', 'Nordic color palette, Moody colors, Nature palette, HEX codes, Watercolor botanical'],
  [345, 'sketchbook-17', '50% 45%', 'Glowing persimmon orange against a teal tablecloth: a bold, juicy complementary palette.', 'Orange and teal, Complementary colors, Fruit painting, HEX codes, Watercolor palette'],
  [346, 'halloween-lady', '50% 22%', 'Candle wax, gilded frame and ghostly teal: an elegant, vintage Halloween palette.', 'Halloween color palette, Vintage colors, Victorian aesthetic, HEX codes, Spooky art'],
].map(([n, key, pos, mood, topics]) => {
  const p = PAL.find(x => x.key === key); if (!p) throw new Error('no palette ' + key);
  const t = p.title.en, list = p.colors.map(c => `${c.en} ${c.hex}`).join(', ');
  const tt = t.replace(/(^|\s)\S/g, s => s.toUpperCase()).replace(/’S\b/, '’s').replace(/ (At|For|And|Of|In|The|A) /g, m => m.toLowerCase());
  return { n, key, pos, p,
    pt: `${tt} Color Palette with HEX Codes | Pigeon Polly`,
    desc: `Six colors from my ${p.gallery === 'sketchbook' ? 'sketch' : 'illustration'} “${t}”, ${SER[p.gallery]}: ${list}. ${mood} Click any color on my site to copy its HEX.`,
    alt: `A color palette of six swatches (${p.colors.map(c => c.en).join(', ')}) with HEX codes under the illustration “${t}” by Pigeon Polly.`,
    link: `${SITE}/palettes/${UTM}#${key}`, topics };
});

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:#2A1B1E;color:#F6ECDF;font-family:Karla,sans-serif;position:relative}
.ptop{position:absolute;left:0;right:0;top:0;height:780px}
.ptop img{width:100%;height:100%;object-fit:cover;display:block}
.ptop:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(42,27,30,0) 52%,rgba(42,27,30,.75) 80%,#2A1B1E)}
.pl{position:absolute;left:70px;right:70px;top:680px}
.ptag{font:700 26px Karla;letter-spacing:.24em;color:#E0A13A}
h1{font:600 80px/1.02 Fraunces;letter-spacing:-.03em;margin-top:12px}
h1.s{font-size:68px}
.sw{display:grid;grid-template-columns:repeat(3,1fr);gap:30px 22px;margin-top:40px}
.sw .c div{height:118px;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.sw b{display:block;font:700 26px Karla;margin-top:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sw span{display:block;font:500 21px Karla;color:#BFAEA6;letter-spacing:.06em;margin-top:6px}
.foot{position:absolute;left:70px;right:70px;bottom:52px;display:flex;align-items:baseline}
.foot i{font:italic 400 30px Fraunces;color:#BFAEA6}
.foot b{margin-left:auto;font:700 30px Karla}
.num{position:absolute;right:16px;bottom:10px;font:700 20px Karla;color:#6E5A5C}
`;

(async () => {
  const want = process.argv.slice(2).map(Number);
  const list = want.length ? PINS.filter(p => want.includes(p.n)) : PINS;
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  for (const o of list) {
    const art = 'file://' + path.join(ROOT, 'site', o.p.img);
    const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&display=swap"><style>${CSS}</style></head><body>
<div class="ptop"><img src="${art}" style="object-position:${o.pos}"></div>
<div class="pl"><div class="ptag">COLOR PALETTE</div><h1 class="${o.p.title.en.length > 18 ? 's' : ''}">${esc(o.p.title.en)}</h1>
<div class="sw">${o.p.colors.map(c => `<div class="c"><div style="background:${c.hex}"></div><b>${esc(c.en)}</b><span>${c.hex}</span></div>`).join('')}</div></div>
<div class="foot"><i>art by Pigeon Polly</i><b>pigeonpolly.com</b></div><div class="num">${o.n}</div></body></html>`;
    const f = path.join(__dirname, 'out7.html'); fs.writeFileSync(f, html);
    await page.goto('file://' + f, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const bot = await page.evaluate(() => document.querySelector('.sw').getBoundingClientRect().bottom);
    if (bot > 1400) console.log('⚠ pin', o.n, 'swatches bottom', Math.round(bot));
    await page.screenshot({ path: path.join(ROOT, 'site/images/pins', `pin-${o.n}.jpg`), type: 'jpeg', quality: 88 });
    console.log('pin', o.n, o.p.title.en);
  }
  fs.unlinkSync(path.join(__dirname, 'out7.html'));
  await b.close();
  const meta = PINS.map(o => ({ n: o.n, key: o.key, title: o.pt, desc: o.desc, alt: o.alt, link: o.link, topics: o.topics, media: `${SITE}/images/pins/pin-${o.n}.jpg` }));
  fs.writeFileSync(path.join(__dirname, 'pins7.json'), JSON.stringify(meta, null, 1));
})();
