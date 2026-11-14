// Раскраски по работам Алины (docs/coloring.md). node tools/coloring/make.js [id…] (без аргументов — все)
// tools/coloring/data.json → контуры (tools/coloring/lines.py, кэш tools/coloring/_lines/) →
//   лист A4 PDF: открытые — site/images/coloring/<id>.pdf, «для своих» (vip) — site/members/coloring/<id>.pdf (worker пускает только вошедших);
//   обложка 16:11 (слева цвет, справа контур) site/images/coloring/<id>.jpg; пин 1000×1500 site/images/pins/pin-NNN.jpg;
//   site/assets/coloring.json (раздел «Раскраски» на /learn/, v2.js) и tools/coloring/pins.json (тексты для Notion).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..'), DATA = require('./data.json');
const FIRST_PIN = 476; // следующий свободный № в Notion «Pinterest pins» (docs/palettes.md)
const SITE = 'https://www.pigeonpolly.com';
const link = id => `${SITE}/learn/?c=${id}&utm_source=pinterest&utm_campaign=coloring`;
const IMG = p => path.join(ROOT, 'site/images', p), CACHE = path.join(__dirname, '_lines');
const furl = p => 'file://' + p;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const im = (...a) => execFileSync('convert', a.flat(), { stdio: ['ignore', 'pipe', 'inherit'] }).toString();
const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap">';
const BG = ['#EEF1F3', '#F4EFE6', '#EEF2EC', '#F3ECEF', '#EAEFF4'], ACC = ['#9E1B22', '#22405F', '#2F6B4F', '#8A3B6B', '#B5651D'];
const INK = '#1C2430', MUT = '#5D6670';

function size(f) { const [w, h] = im(f, '-format', '%w %h', 'info:').split(' ').map(Number); return { w, h }; }
function lines(x) {
  fs.mkdirSync(CACHE, { recursive: true });
  const out = path.join(CACHE, x.id + '.png');
  if (!fs.existsSync(out)) execFileSync('python3', [path.join(__dirname, 'lines.py'), IMG(x.src), out, ...(x.args || [])], { stdio: 'inherit' });
  // поля: обрезать белое вокруг рисунка
  const trim = path.join(CACHE, x.id + '-t.png');
  if (!fs.existsSync(trim)) im(out, '-bordercolor', 'white', '-border', '2', '-fuzz', '5%', '-trim', '+repage', trim);
  return trim;
}
async function shot(page, html, w, h, out, pdf) {
  const tmp = path.join(__dirname, '_tmp.html');
  fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>*{box-sizing:border-box;margin:0;padding:0}html,body{width:${w}px;height:${h}px;overflow:hidden}body{position:relative;background:#fff}${pdf ? `@page{size:A4 ${w > h ? 'landscape' : 'portrait'};margin:0}` : ''}</style></head><body>${html}</body></html>`);
  await page.setViewportSize({ width: w, height: h });
  await page.goto(furl(tmp), { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  if (pdf) await page.pdf({ path: out, format: 'A4', landscape: w > h, printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  else await page.screenshot({ path: out, type: out.endsWith('.png') ? 'png' : 'jpeg', ...(out.endsWith('.png') ? {} : { quality: 88 }) });
  fs.unlinkSync(tmp);
}
// лист A4: 794×1123 (портрет) или 1123×794 (альбом) CSS-пикселей
const sheet = (x, img, land, k = 1) => { const W = Math.round((land ? 1123 : 794) * k), H = Math.round((land ? 794 : 1123) * k), m = 48 * k;
  return { W, H, html: `<div style="position:absolute;left:0;right:0;top:${34 * k}px;text-align:center;font:600 ${28 * k}px Fraunces;color:#222">${esc(x.en)}</div>
  <div style="position:absolute;left:0;right:0;top:${74 * k}px;text-align:center;font:700 ${21 * k}px Caveat;color:#555">a coloring page · color it any way you like</div>
  <img src="${furl(img)}" style="position:absolute;left:${m}px;right:${m}px;top:${112 * k}px;width:${W - 2 * m}px;height:${H - 112 * k - 58 * k}px;object-fit:contain">
  <div style="position:absolute;left:0;right:0;bottom:${22 * k}px;text-align:center;font:400 ${12 * k}px Karla;color:#777">© Alina Otkinska · Pigeon Polly Art Lab · pigeonpolly.com · free for personal use</div>` }; };

function cover(x, ln) { // весь контур на белом + цветной оригинал «карточкой» в углу
  const out = IMG(`coloring/${x.id}.jpg`);
  im(ln, '-colorspace', 'sRGB', '-type', 'TrueColor', '-resize', '760x510', '-background', 'white', '-gravity', 'center', '-extent', '800x550',
    '(', IMG(x.src), '-resize', '220x170^', '-gravity', 'center', '-extent', '220x170', '-bordercolor', 'white', '-border', '6', '-bordercolor', '#C9CED3', '-border', '1', ')',
    '-gravity', 'southeast', '-geometry', '+14+14', '-composite', '-type', 'TrueColor', '-quality', '86', out);
}

async function pin(page, x, n, i, sheetPng, land) {
  const bg = BG[i % BG.length], acc = ACC[i % ACC.length];
  const kick = x.vip ? 'free with sign-in · A4 PDF' : 'free printable · A4 PDF';
  const sw = land ? 860 : 640, sh = land ? Math.round(860 * 794 / 1123) : Math.round(640 * 1123 / 794);
  const top = 330, pol = land ? { w: 360, h: 300, top: top + sh + 40, right: 46 } : { w: 300, h: 300, top: 980, right: 34 };
  const html = `<div style="position:absolute;inset:0;background:${bg}"></div>
    <div style="position:absolute;left:60px;top:54px;font:700 44px Caveat;color:${acc};transform:rotate(-2deg)">${kick}</div>
    <h1 style="position:absolute;left:60px;right:60px;top:108px;font:600 ${x.en.length > 40 ? 52 : x.en.length > 28 ? 60 : 68}px/1.02 Fraunces;letter-spacing:-.02em;color:${INK}">${esc(x.en)} <span style="color:${acc}">coloring page</span></h1>
    <div style="position:absolute;left:${land ? 70 : 52}px;top:${top}px;transform:rotate(${land ? -1.5 : -2}deg);box-shadow:0 2px 4px rgba(28,36,48,.12),0 26px 50px rgba(28,36,48,.22)">
      <img src="${furl(sheetPng)}" style="display:block;width:${sw}px;height:${sh}px"></div>
    <div style="position:absolute;right:${pol.right}px;top:${pol.top}px;background:#fff;padding:14px 14px 54px;transform:rotate(4deg);box-shadow:0 6px 18px rgba(28,36,48,.3)">
      <img src="${furl(IMG(x.src))}" style="display:block;width:${pol.w}px;height:${pol.h}px;object-fit:cover">
      <span style="position:absolute;left:0;right:0;bottom:10px;text-align:center;font:700 34px Caveat;color:${INK}">the original</span></div>
    <div style="position:absolute;left:64px;${land ? `top:${top + sh + 70}px;width:440px` : 'top:470px;right:auto;left:auto;right:40px;width:250px'};font:700 46px/1.05 Caveat;color:${acc};transform:rotate(${land ? -2 : 3}deg)">${land ? 'print it, grab your pencils and give it your own colors' : 'print it, grab your pencils ↓'}</div>
    <div style="position:absolute;left:0;right:0;bottom:40px;text-align:center;font:700 34px Caveat;color:${MUT}">pigeonpolly.com</div>`;
  await shot(page, html, 1000, 1500, IMG(`pins/pin-${n}.jpg`));
}

const pinText = x => ({
  title: `${x.vip ? '' : 'Free '}${x.theme} Coloring Page: ${x.en} (${x.vip ? 'Free Printable PDF with Sign-In' : 'Printable PDF'})`.replace(/^(\w)/, c => c.toUpperCase()),
  desc: `${x.what} A4 PDF by artist Alina Otkinska (Pigeon Polly Art Lab): print at home and color with pencils, markers or watercolor.${x.vip ? ' Free sign-in on pigeonpolly.com opens the download.' : ''}`,
  alt: `Black and white coloring page: ${x.what.replace(/\.$/, '')}, next to the colored original illustration.`,
  topics: x.topics,
});

(async () => {
  const only = process.argv.slice(2);
  const b = await chromium.launch(), page = await b.newPage();
  fs.mkdirSync(IMG('coloring'), { recursive: true }); fs.mkdirSync(path.join(ROOT, 'site/members/coloring'), { recursive: true });
  const pins = []; let n = FIRST_PIN, i = 0;
  for (const x of DATA) {
    const num = x.pin || n++, idx = i++;
    if (only.length && !only.includes(x.id)) continue;
    const ln = lines(x); cover(x, ln);
    if (x.keep) { console.log('cover', x.id); continue; } // уже готовый лист (№377) — только обложка
    const { w, h } = size(ln), land = w > h * 1.05;
    const pdf = x.vip ? path.join(ROOT, `site/members/coloring/${x.id}.pdf`) : IMG(`coloring/${x.id}.pdf`);
    let s = sheet(x, ln, land); await shot(page, s.html, s.W, s.H, pdf, true);
    const png = path.join(CACHE, x.id + '-sheet.png');
    s = sheet(x, ln, land, 1.6); await shot(page, s.html, s.W, s.H, png);
    await pin(page, x, num, idx, png, land);
    pins.push({ n: num, id: x.id, type: 'Раскраска', season: x.season, vip: x.vip ? 1 : 0, link: link(x.id), ...pinText(x) });
    console.log(num, x.id, land ? 'land' : 'port', x.vip ? 'vip' : '');
  }
  await b.close();
  // список для сайта — всегда целиком из data.json
  fs.writeFileSync(path.join(ROOT, 'site/assets/coloring.json'), JSON.stringify(DATA.map(x => ({ id: x.id, vip: x.vip ? 1 : 0, t: { en: x.en, ru: x.ru, lv: x.lv },
    cover: `/images/coloring/${x.id}.jpg`, pdf: x.keep ? '/' + x.keep : x.vip ? `/members/coloring/${x.id}.pdf` : `/images/coloring/${x.id}.pdf` }))));
  if (!only.length) fs.writeFileSync(path.join(__dirname, 'pins.json'), JSON.stringify(pins, null, 1));
})();
