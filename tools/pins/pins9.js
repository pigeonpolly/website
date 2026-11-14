// Новые форматы пинов (14.11.2026): №377 — бесплатная раскраска для печати, №378 — видео-пин 9:16 («камера по арту»).
// node tools/pins/pins9.js [coloring|pin|video]… (без аргументов — всё) →
//   site/images/coloring/pigeon-polly-christmas-lights.{pdf,png} (с 14.11 — в «Уроки → Раскраски», tools/coloring/data.json),
//   site/images/pins/pin-377.jpg, site/images/pins/pin-378.mp4 (+ pin-378.jpg — обложка видео), tools/pins/pins9.json (тексты для Notion).
// Контуры раскраски — из рисунка Алины site/images/photos/garland.jpg (порог по светлоте: чёрные линии остаются, заливка уходит).
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const L = p => SITE + p.replace(/(#.*)?$/, '?utm_source=pinterest&utm_campaign=newformats$1');
const F = p => path.join(ROOT, 'site/images', p);
const U = p => 'file://' + F(p);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const sh = c => execSync(c, { stdio: ['ignore', 'pipe', 'inherit'] }).toString();
const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap">';
const C = { bg: '#EEF1F3', ink: '#1C2430', mut: '#5D6670', acc: '#9E1B22', sheet: '#F8FAFB' };
const CN = 'coloring/pigeon-polly-christmas-lights';
const VART = 'bird/2025-pigeon-polly-celebrates-new-year.jpg';

const PINS = [
  { n: 377, type: 'Раскраска', title: 'Free Christmas Coloring Page: Pigeon Polly Tangled in Fairy Lights (Printable PDF)',
    desc: 'A free printable Christmas coloring page: a cute pigeon in a Santa hat, tangled in fairy lights, holding a paintbrush. A4 PDF, print at home and color with pencils, markers or watercolor.',
    alt: 'Black and white coloring page of a cartoon pigeon in a Santa hat wrapped in Christmas lights, next to the colored original illustration.',
    link: SITE + '/learn/?c=polly-christmas-lights&utm_source=pinterest&utm_campaign=newformats', topics: 'christmas coloring pages, free printable, coloring pages for adults, cute coloring page' },
  { n: 378, type: 'Видео', title: 'New Year’s Eve, But Make It Cozy — Pigeon Polly Makes Salad in Bed',
    desc: 'December 31st, a laptop, a cutting board on the blanket and the most important ingredient on the windowsill. A little look around Pigeon Polly’s New Year’s Eve.',
    alt: 'Short video panning over an illustration of a pigeon in a sleep mask cutting carrots in bed on December 31st, with a laptop and a jar of mayo nearby.',
    link: L('/art-portfolio/bird/'), topics: 'cozy new year, new years eve at home, funny illustration, cozy aesthetic' },
];

async function newPage(b, w, h) { const p = await b.newPage({ viewport: { width: w, height: h } }); return p; }
async function render(page, html, out, opt = {}) {
  const tmp = path.join(__dirname, 'shots', '_pin9.html');
  fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>*{box-sizing:border-box;margin:0;padding:0}${opt.css || ''}</style></head><body>${html}</body></html>`);
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  if (opt.pdf) await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  else await page.screenshot({ path: out, type: out.endsWith('.png') ? 'png' : 'jpeg', ...(out.endsWith('.png') ? {} : { quality: opt.q || 88 }) });
  fs.unlinkSync(tmp);
}

// --- 1. Раскраска: контуры → лист A4 (PDF + PNG) + обложка для полки
function lines() {
  const out = F('coloring/_lines.png');
  fs.mkdirSync(F('coloring'), { recursive: true });
  // светлота < 22 % — линия; увеличение ×2 до порога даёт гладкие края при печати; мелкие точки-пылинки убираются
  sh(`convert "${F('photos/garland.jpg')}" -colorspace HSL -channel B -separate +channel -filter Lanczos -resize 200% -threshold 22% -morphology Close Disk:1 -trim +repage "${out}"`);
  return out;
}
const sheet = (img, scale = 1) => `<div style="width:${794 * scale}px;height:${1123 * scale}px;background:#fff;position:relative;font-family:Karla">
  <div style="position:absolute;left:0;right:0;top:${56 * scale}px;text-align:center;font:600 ${34 * scale}px Fraunces;color:#222">Pigeon Polly in Christmas lights</div>
  <div style="position:absolute;left:0;right:0;top:${104 * scale}px;text-align:center;font:700 ${26 * scale}px Caveat;color:#555">a coloring page · color it any way you like</div>
  <img src="${img}" style="position:absolute;left:${60 * scale}px;top:${170 * scale}px;width:${674 * scale}px;height:${830 * scale}px;object-fit:contain">
  <div style="position:absolute;left:0;right:0;bottom:${40 * scale}px;text-align:center;font:400 ${15 * scale}px Karla;color:#777">© Alina Otkinska · Pigeon Polly Art Lab · pigeonpolly.com · free for personal use</div></div>`;

async function coloring(b) {
  const img = 'file://' + lines();
  let p = await newPage(b, 794, 1123);
  await render(p, sheet(img), F(CN + '.pdf'), { pdf: true, css: '@page{size:A4;margin:0}' }); await p.close();
  p = await newPage(b, 2480, 3508);
  await render(p, sheet(img, 2480 / 794), F(CN + '.png')); await p.close();
  fs.unlinkSync(F('coloring/_lines.png'));
}

// --- 2. Пин раскраски 1000×1500: лист раскраски + цветной оригинал «полароидом»
async function pin377(b) {
  const p = await newPage(b, 1000, 1500);
  await render(p, `<div style="position:absolute;left:60px;top:58px;font:700 46px Caveat;color:${C.acc};transform:rotate(-2deg)">free printable · A4 PDF</div>
    <h1 style="position:absolute;left:60px;right:60px;top:112px;font:600 76px/1.0 Fraunces;letter-spacing:-.02em;color:${C.ink}">Christmas coloring page</h1>
    <div style="position:absolute;left:56px;top:296px;transform:rotate(-2deg);box-shadow:0 2px 4px rgba(28,36,48,.12),0 26px 50px rgba(28,36,48,.22)">
      <img src="${U(CN + '.png')}" style="display:block;width:700px;height:990px"></div>
    <div style="position:absolute;right:40px;top:850px;background:#fff;padding:16px 16px 60px;transform:rotate(4deg);box-shadow:0 6px 18px rgba(28,36,48,.3)">
      <img src="${U('photos/garland.jpg')}" style="display:block;width:330px;height:330px;object-fit:cover">
      <span style="position:absolute;left:0;right:0;bottom:12px;text-align:center;font:700 38px Caveat;color:${C.ink}">the original</span></div>
    <div style="position:absolute;right:40px;top:420px;width:230px;font:700 46px/1.05 Caveat;color:${C.acc};transform:rotate(3deg)">print it, grab your pencils ↓</div>
    <div style="position:absolute;left:0;right:0;bottom:44px;text-align:center;font:700 34px Caveat;color:${C.mut}">pigeonpolly.com</div>`,
    F('pins/pin-377.jpg'), { css: `html,body{width:1000px;height:1500px;overflow:hidden}body{background:${C.bg};position:relative}` });
  await p.close();
}

// --- 3. Видео-пин 1080×1920, 30 к/с: камера ездит по арту, подписи-«записки» появляются по очереди
// Кадр камеры: cx, cy — центр (доли картинки), h — видимая высота (доля высоты картинки). Время — секунды.
const KEYS = [
  { t: 0, cx: .5, cy: .5, h: 1 }, { t: 1.6, cx: .5, cy: .5, h: 1 },
  { t: 3.0, cx: .1, cy: .2, h: .42 }, { t: 4.6, cx: .1, cy: .2, h: .42 },     // календарь «31»
  { t: 6.0, cx: .52, cy: .72, h: .5 }, { t: 7.8, cx: .52, cy: .72, h: .5 },   // доска, морковка, колбаса
  { t: 9.2, cx: .92, cy: .45, h: .55 }, { t: 11.0, cx: .92, cy: .45, h: .55 }, // ноутбук и майонез на окне
  { t: 12.4, cx: .5, cy: .5, h: 1 }, { t: 14.5, cx: .5, cy: .5, h: 1 },
];
const CAPS = [
  { a: 0.2, b: 2.6, top: true, s: 'New Year’s Eve,<br>but make it cozy' },
  { a: 3.2, b: 5.6, s: 'Dec 31: still in bed ✓' },
  { a: 6.2, b: 8.8, s: 'salad prep: from the blanket ✓' },
  { a: 9.4, b: 12.0, s: 'show on, mayo on standby ✓' },
  { a: 12.6, b: 14.5, top: true, s: 'Pigeon Polly’s<br>New Year’s Eve' },
];
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
function cam(t) {
  let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++;
  const A = KEYS[i], B = KEYS[i + 1], k = ease(Math.min(1, Math.max(0, (t - A.t) / (B.t - A.t))));
  return { cx: A.cx + (B.cx - A.cx) * k, cy: A.cy + (B.cy - A.cy) * k, h: A.h + (B.h - A.h) * k };
}
async function video(b) {
  const W = 1080, H = 1920, FPS = 30, DUR = 14.5, AH = 1500; // окно арта — 1080×1500, ниже подвал с адресом
  const [iw, ih] = sh(`identify -format "%w %h" "${F(VART)}"`).split(' ').map(Number);
  const dir = path.join(__dirname, 'shots', '_frames'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const p = await newPage(b, W, H);
  const tmp = path.join(__dirname, 'shots', '_pin9v.html');
  fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>*{box-sizing:border-box;margin:0;padding:0}
    html,body{width:${W}px;height:${H}px;overflow:hidden;background:#1B2632}
    #win{position:absolute;left:0;top:0;width:${W}px;height:${AH}px;overflow:hidden}#art{position:absolute;max-width:none;transform-origin:0 0}
    .note{position:absolute;left:50%;background:${C.sheet};padding:14px 34px;font:700 64px/1.05 Caveat;color:${C.ink};box-shadow:0 8px 22px rgba(0,0,0,.35);white-space:nowrap;transform:translateX(-50%) rotate(-2deg);text-align:center}
    .note.top{font:600 74px/1.02 Fraunces;padding:22px 40px;letter-spacing:-.02em}
    #foot{position:absolute;left:0;right:0;top:${AH}px;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
    #foot b{font:700 64px Caveat;color:#F1ECE4}#foot i{font:400 32px Karla;font-style:normal;color:#93AFCC}</style></head><body>
    <div id="win"><img id="art" src="${U(VART)}" style="width:${iw}px;height:${ih}px"></div><div id="caps"></div>
    <div id="foot"><b>pigeonpolly.com</b><i>Pigeon Polly · art by Alina Otkinska</i></div></body></html>`);
  await p.goto('file://' + tmp, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  const N = Math.round(DUR * FPS);
  for (let f = 0; f < N; f++) {
    const t = f / FPS, c = cam(t);
    const s = AH / (c.h * ih); const vw = W / s; // видимая ширина в пикселях картинки
    const x = Math.max(0, Math.min(iw - vw, c.cx * iw - vw / 2)), y = Math.max(0, Math.min(ih - AH / s, c.cy * ih - AH / s / 2));
    const caps = CAPS.map(q => { const o = Math.min(1, (t - q.a) / .35, (q.b - t) / .35); return o <= 0 ? '' :
      `<div class="note${q.top ? ' top' : ''}" style="opacity:${o};top:${q.top ? 120 : 1260}px;margin-top:${(1 - o) * 30}px">${q.s}</div>`; }).join('');
    // если картинка уже окна по ширине (h=1: 1500 px высоты → ширина 2210) — она шире 1080, пусто не бывает
    await p.evaluate(([tr, caps]) => { document.getElementById('art').style.transform = tr; document.getElementById('caps').innerHTML = caps; },
      [`translate(${-x * s}px,${-y * s}px) scale(${s})`, caps]);
    await p.screenshot({ path: path.join(dir, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
    if (f === Math.round(6.8 * FPS)) fs.copyFileSync(path.join(dir, `f${String(f).padStart(4, '0')}.jpg`), F('pins/pin-378.jpg'));
  }
  await p.close(); fs.unlinkSync(tmp);
  sh(`ffmpeg -y -loglevel error -framerate ${FPS} -i "${dir}/f%04d.jpg" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart "${F('pins/pin-378.mp4')}"`);
  fs.rmSync(dir, { recursive: true, force: true });
}

(async () => {
  const only = process.argv.slice(2), want = k => !only.length || only.includes(k);
  const b = await chromium.launch();
  if (want('coloring')) await coloring(b);
  if (want('pin')) await pin377(b);
  if (want('video')) await video(b);
  await b.close();
  fs.writeFileSync(path.join(__dirname, 'pins9.json'), JSON.stringify(PINS, null, 1));
})();
