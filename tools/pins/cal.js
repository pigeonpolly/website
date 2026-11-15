// Пины-календари Pinterest: арт Алины сверху, сетка месяца снизу, цвета — из палитры арта, сайт — только маленьким знаком.
// node tools/pins/cal.js → site/images/pins/cal-<год>-<мм>.jpg (1000×1500)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const img = p => 'file://' + path.join(ROOT, 'site', p);
const PALS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));

// y, m (1–12), key — картинка из images/bird/, pos — кадрирование, c — какие цвета палитры брать (индексы: фон, текст, акцент)
const CALS = [
  { y: 2026, m: 12, key: '2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year', pos: '30% 50%', c: [5, 0, 1] },
];
const MON = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const html = k => {
  const pal = PALS.find(p => p.key === k.key).colors.map(c => c.hex);
  const [bg, ink, acc] = k.c.map(i => pal[i]);
  const first = (new Date(k.y, k.m - 1, 1).getDay() + 6) % 7, n = new Date(k.y, k.m, 0).getDate();
  const rows = Math.ceil((first + n) / 7);
  let cells = '';
  for (let i = 0; i < rows * 7; i++) {
    const d = i - first + 1, we = i % 7 > 4;
    cells += d >= 1 && d <= n ? `<div class="c${we ? ' we' : ''}"><b>${d}</b></div>` : '<div class="c e"></div>';
  }
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,400&family=Karla:wght@500;700&display=swap"><style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${bg};color:${ink};font-family:Karla,sans-serif;position:relative}
.art{position:absolute;left:0;right:0;top:0;height:800px}
.art img{width:100%;height:100%;object-fit:cover;object-position:${k.pos};display:block}
.art:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${bg}00 62%,${bg} 99%)}
.cal{position:absolute;left:70px;right:70px;top:735px}
.hd{display:flex;align-items:baseline;justify-content:center;gap:26px}
.hd h1{font:italic 400 104px/1 Fraunces;letter-spacing:-.02em}
.hd span{font:700 26px Karla;letter-spacing:.3em;color:${acc}}
.st{color:${acc};font-size:30px;transform:translateY(-14px)}
.wd{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-top:34px;text-align:center;font:700 19px Karla;letter-spacing:.2em;text-transform:uppercase;opacity:.75}
.g{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-top:14px}
.c{height:${rows > 5 ? 74 : 88}px;border-radius:6px;background:${ink}1F;border:1.5px solid ${ink}40;padding:8px 10px}
.c b{font:500 24px Fraunces}
.c.we b{color:${acc}}
.c.e{background:none;border-color:${ink}1A}
.mk{position:absolute;right:70px;bottom:44px;display:flex;align-items:center;gap:12px;opacity:.6;font:700 17px Karla;letter-spacing:.22em;color:${ink}}
.mk i{width:40px;height:40px;border-radius:50%;border:1.5px solid ${ink};display:grid;place-items:center;font:italic 400 18px Fraunces;letter-spacing:0}
</style></head><body>
<div class="art"><img src="${img('images/bird/' + k.key + '.jpg')}"></div>
<div class="cal">
 <div class="hd"><span class="st">✻</span><h1>${MON[k.m - 1]}</h1><span>${k.y}</span><span class="st">✻</span></div>
 <div class="wd">${DAYS.map(d => `<div>${d}</div>`).join('')}</div>
 <div class="g">${cells}</div>
</div>
<div class="mk"><i>pp</i>PIGEONPOLLY.COM</div>
</body></html>`;
};

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  const f = path.join(__dirname, 'cal-out.html');
  for (const k of CALS) {
    fs.writeFileSync(f, html(k));
    await page.goto('file://' + f, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(ROOT, 'site/images/pins', `cal-${k.y}-${String(k.m).padStart(2, '0')}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
    console.log(out);
  }
  fs.unlinkSync(f);
  await b.close();
})();
