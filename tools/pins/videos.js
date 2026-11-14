// Видео-пины 9:16 (1080×1920, 30 к/с) — движок для tools/pins/videos-data.js (№379–428). Образец формата — №378 в pins9.js.
// node tools/pins/videos.js [номер…] → site/images/pins/pin-NNN.mp4 + pin-NNN.jpg (обложка) и tools/pins/videos.json (тексты для Notion).
// Кадры рисует Playwright (шрифты сайта), склеивает ffmpeg. Шаблоны: tour — камера по арту с записками; pal — арт и его палитра (content/palettes.json).
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const L = p => SITE + p.replace(/(#.*)?$/, '?utm_source=pinterest&utm_campaign=videos$1');
const F = p => path.join(ROOT, 'site/images', p);
const U = p => 'file://' + F(p);
const sh = c => execSync(c, { stdio: ['ignore', 'pipe', 'inherit'] }).toString();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const { V, FIRST } = require('./videos-data.js');
const PAL = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'))).map(p => [p.key, p]));
const W = 1080, H = 1920, FPS = 30, AH = 1500; // окно арта 1080×1500, ниже подвал с адресом
const C = { ink: '#1C2430', sheet: '#F8FAFB', dark: '#1B2632' };
const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap">';
const CSS = `*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${C.dark}}
#win{position:absolute;left:0;top:0;width:${W}px;height:${AH}px;overflow:hidden}#art{position:absolute;max-width:none;transform-origin:0 0}
.note{position:absolute;left:50%;max-width:980px;width:max-content;background:${C.sheet};padding:14px 34px;font:700 64px/1.05 Caveat;color:${C.ink};box-shadow:0 8px 22px rgba(0,0,0,.35);transform:translateX(-50%) rotate(-2deg);text-align:center}
.note.top{font:600 70px/1.04 Fraunces;padding:22px 40px;letter-spacing:-.02em}
#foot{position:absolute;left:0;right:0;top:${AH}px;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
#foot b{font:700 64px Caveat;color:#F1ECE4}#foot i{font:400 32px Karla;font-style:normal;color:#93AFCC}
.sw{position:absolute;width:470px;height:150px;display:flex;align-items:center;gap:22px;background:${C.sheet};padding:0 22px 0 0;box-shadow:0 6px 18px rgba(0,0,0,.35)}
.sw span{width:150px;height:150px;flex:none}.sw b{display:block;font:600 40px/1.1 Fraunces;color:${C.ink}}.sw i{display:block;font:400 30px Karla;font-style:normal;color:#5D6670;margin-top:6px}`;
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const clamp01 = x => Math.max(0, Math.min(1, x));
const fade = (t, a, b) => Math.min(1, (t - a) / .35, (b - t) / .35);

// Сценарий tour: ключевые кадры камеры и подписи по времени
function tourPlan(p) {
  const MOVE = 1.2, HOLD = 2.1, keys = [], caps = []; let t = 0;
  const full = { cx: .5, cy: .5, h: 1 };
  const stops = p.stops.map(([cx, cy, h, s]) => ({ cx, cy, h, s }));
  keys.push({ t: 0, ...full }); keys.push({ t: 2.2, ...full }); caps.push({ a: .2, b: 2.6, top: true, s: p.intro }); t = 2.2;
  for (const q of stops) { keys.push({ t: t + MOVE, ...q }); keys.push({ t: t + MOVE + HOLD, ...q }); caps.push({ a: t + MOVE + .2, b: t + MOVE + HOLD + .3, s: q.s }); t += MOVE + HOLD; }
  keys.push({ t: t + MOVE, ...full }); caps.push({ a: t + MOVE + .1, b: t + MOVE + 2.2, top: true, s: p.outro }); t += MOVE + 2.2;
  keys.push({ t, ...full });
  return { keys, caps, dur: t };
}
function cam(keys, t) {
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const A = keys[i], B = keys[i + 1], k = ease(clamp01((t - A.t) / (B.t - A.t || 1)));
  return { cx: A.cx + (B.cx - A.cx) * k, cy: A.cy + (B.cy - A.cy) * k, h: A.h + (B.h - A.h) * k };
}

async function render(page, p, n) {
  const art = p.tpl === 'pal' ? PAL[p.key].img.replace(/^images\//, '') : p.art;
  const [iw, ih] = sh(`identify -format "%w %h" "${F(art)}"`).split(' ').map(Number);
  const dir = path.join(__dirname, 'shots', '_frames'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const tmp = path.join(__dirname, 'shots', '_video.html');
  fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${CSS}</style></head><body>
    <div id="win"><img id="art" src="${U(art)}" style="width:${iw}px;height:${ih}px"></div><div id="caps"></div>
    <div id="foot"><b>pigeonpolly.com</b><i>Pigeon Polly · art by Alina Otkinska</i></div></body></html>`);
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  let frame, dur, cover;
  if (p.tpl === 'tour') {
    const plan = tourPlan(p); dur = plan.dur; cover = 2.2 + 1.2 + 1.2; // обложка — первая деталь с подписью
    frame = t => {
      const c = cam(plan.keys, t), s = AH / (c.h * ih), vw = W / s, vh = AH / s;
      const x = Math.max(0, Math.min(iw - vw, c.cx * iw - vw / 2)), y = Math.max(0, Math.min(ih - vh, c.cy * ih - vh / 2));
      const caps = plan.caps.map(q => { const o = fade(t, q.a, q.b); return o <= 0 ? '' :
        `<div class="note${q.top ? ' top' : ''}" style="opacity:${o};top:${q.top ? 120 : 1250}px;margin-top:${(1 - o) * 30}px">${esc(q.s)}</div>`; }).join('');
      return [`translate(${-x * s}px,${-y * s}px) scale(${s})`, caps];
    };
  } else {
    // pal: название сверху, арт под ним (до 620 px), медленно приближается; цвета выезжают по одному в 2 колонки
    const P = PAL[p.key], cols = P.colors.slice(0, 6), name = p.name || P.title.en;
    const s0 = Math.min(W / iw, 620 / ih), T0 = 2.4, STEP = .9; dur = T0 + cols.length * STEP + 3.2; cover = dur - 1;
    frame = t => {
      const k = 1 + .08 * clamp01(t / dur), s = s0 * k, x0 = (W - iw * s) / 2, y0 = 250 + (620 - ih * s) / 2;
      let html = `<div class="note top" style="top:40px;opacity:${clamp01(t / .4)};font-size:60px">${esc(name)}<br><span style="font:700 46px Caveat">color palette</span></div>`;
      cols.forEach((c, i) => { const a = T0 + i * STEP, o = clamp01((t - a) / .4); if (o <= 0) return;
        const X = i % 2 ? 560 : 50, Y = 900 + Math.floor(i / 2) * 190 + (1 - o) * 40;
        html += `<div class="sw" style="left:${X}px;top:${Y}px;opacity:${o}"><span style="background:${c.hex}"></span><div><b>${esc(c.en)}</b><i>${c.hex.toUpperCase()}</i></div></div>`; });
      return [`translate(${x0}px,${y0}px) scale(${s})`, html];
    };
  }
  const N = Math.round(dur * FPS);
  for (let f = 0; f < N; f++) {
    const t = f / FPS, [tr, caps] = frame(t);
    await page.evaluate(([tr, caps]) => { document.getElementById('art').style.transform = tr; document.getElementById('caps').innerHTML = caps; }, [tr, caps]);
    const fp = path.join(dir, `f${String(f).padStart(4, '0')}.jpg`);
    await page.screenshot({ path: fp, type: 'jpeg', quality: 90 });
    if (f === Math.round(cover * FPS)) fs.copyFileSync(fp, F(`pins/pin-${n}.jpg`));
  }
  fs.unlinkSync(tmp);
  sh(`ffmpeg -y -loglevel error -framerate ${FPS} -i "${dir}/f%04d.jpg" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart "${F(`pins/pin-${n}.mp4`)}"`);
  fs.rmSync(dir, { recursive: true, force: true });
  return dur;
}

(async () => {
  const only = process.argv.slice(2).map(Number);
  const out = V.map((p, i) => {
    const n = FIRST + i;
    if (p.tpl === 'pal') { const P = PAL[p.key], name = (p.name || P.title.en).split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '), names = P.colors.slice(0, 6).map(c => c.en);
      return { n, type: 'Видео', tpl: 'pal', title: `${name} Color Palette with HEX Codes | Pigeon Polly`, link: L(p.link),
        desc: `${names.slice(0, -1).join(', ')} and ${names.at(-1)} — a color palette from an illustration by Alina Otkinska. Every color with its HEX code.`,
        alt: p.alt, topics: p.topics }; }
    return { n, type: 'Видео', tpl: 'tour', title: p.title, desc: p.desc, alt: p.alt, link: L(p.link), topics: p.topics };
  });
  fs.writeFileSync(path.join(__dirname, 'videos.json'), JSON.stringify(out, null, 1));
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: W, height: H } });
  for (let i = 0; i < V.length; i++) {
    const n = FIRST + i; if (only.length && !only.includes(n)) continue;
    const d = await render(page, V[i], n); console.log(n, d.toFixed(1) + 's');
  }
  await b.close();
})();
