// Карточки-палитры для постов Facebook на латышском (Алина 16.11.2026: «реально палитры, а не словами»).
// Стиль — как пины-палитры pins12.js (тёмный фон, арт сверху, 6 цветов с HEX), но 1080×1350 (4:5 для ленты FB) и тексты LV.
// node tools/fb/fb_pal.js [ключ…] → site/images/fb/pal-<ключ>.jpg. Посты — Notion «Facebook posti LV», docs/growth.md.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const PAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ключ палитры → позиция арта
const KEYS = {
  '2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year': '50% 50%',
  '2024-mr-chew-celebrates-new-year': '50% 50%',
  'sketchbook-15': '50% 50%',
  'studio-lanterns': '50% 50%',
  'studio-impasto_flowers': '50% 50%',
  'studio-birdhouse': '50% 40%',
  '2024-mr-chew-gardening-edition': '50% 50%',
  '2022-pigeon-polly-summer-lover': '50% 50%',
  '2022-pigeon-polly-started-own-small-business': '50% 50%',
  'sketchbook-16': '50% 50%',
  '2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes': '50% 50%',
  '2025-mr-chew-opened-pumpkin-spice-latte-season': '50% 50%',
  '2024-pigeon-polly-bath-relax': '50% 50%',
  'sketchbook-7': '50% 50%',
  'studio-bookshop': '50% 45%',
};

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{background:#2A1B1E;color:#F6ECDF;font-family:Karla,sans-serif;position:relative}
.ptop{position:absolute;left:0;right:0;top:0;height:700px}
.ptop img{width:100%;height:100%;object-fit:cover;display:block}
.ptop:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(42,27,30,0) 55%,rgba(42,27,30,.75) 82%,#2A1B1E)}
.pl{position:absolute;left:70px;right:70px;top:615px}
.ptag{font:700 26px Karla;letter-spacing:.24em;color:#E0A13A}
h1{font:600 74px/1.06 Lora;letter-spacing:-.01em;margin-top:10px}
h1.s{font-size:62px}
.sw{display:grid;grid-template-columns:repeat(3,1fr);gap:26px 22px;margin-top:34px}
.sw .c div{height:108px;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.sw b{display:block;font:700 26px Karla;margin-top:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sw span{display:block;font:500 22px Karla;color:#BFAEA6;letter-spacing:.06em;margin-top:5px}
.foot{position:absolute;left:70px;right:70px;bottom:44px;display:flex;align-items:baseline}
.foot i{font:italic 400 30px Lora;color:#BFAEA6}
.foot b{margin-left:auto;font:700 30px Karla}
`;

(async () => {
  const want = process.argv.slice(2);
  const keys = want.length ? want : Object.keys(KEYS);
  fs.mkdirSync(path.join(ROOT, 'site/images/fb'), { recursive: true });
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const key of keys) {
    const p = PAL.find(x => x.key === key); if (!p) throw new Error('no palette ' + key);
    const art = 'file://' + path.join(ROOT, 'site', p.img), t = p.title.lv;
    const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;1,400&family=Karla:wght@400;500;700&display=block"><style>${CSS}</style></head><body>
<div class="ptop"><img src="${art}" style="object-position:${KEYS[key] || '50% 50%'}"></div>
<div class="pl"><div class="ptag">KRĀSU PALETE</div><h1 class="${t.length > 20 ? 's' : ''}">${esc(t)}</h1>
<div class="sw">${p.colors.map(c => `<div class="c"><div style="background:${c.hex}"></div><b>${esc(c.lv)}</b><span>${c.hex}</span></div>`).join('')}</div></div>
<div class="foot"><i>Pigeon Polly māksla</i><b>pigeonpolly.com</b></div></body></html>`;
    const f = path.join(__dirname, 'out-pal.html'); fs.writeFileSync(f, html);
    await page.goto('file://' + f, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const bot = await page.evaluate(() => document.querySelector('.sw').getBoundingClientRect().bottom);
    if (bot > 1270) console.log('⚠', key, 'swatches bottom', Math.round(bot));
    await page.screenshot({ path: path.join(ROOT, 'site/images/fb', `pal-${key}.jpg`), type: 'jpeg', quality: 88 });
    console.log('ok', key, t);
  }
  fs.unlinkSync(path.join(__dirname, 'out-pal.html'));
  await b.close();
})();
