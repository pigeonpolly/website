// Пины из фото Алины (Google Диск, 13.11) + приманки на бесплатные уроки — №347–376. Движок — копия pins6.js, данные — tools/pins/pins8-data.js.
// node tools/pins/pins8.js [номер…] → site/images/pins/pin-NNN.jpg и tools/pins/pins8.json (тексты для Notion «Pinterest pins 3.0»).
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const L = p => SITE + p + '?utm_source=pinterest&utm_campaign=photos';
const F = p => path.join(ROOT, 'site/images', p);
const U = p => 'file://' + F(p);
const dims = {}; const dim = p => dims[p] || (dims[p] = execSync(`identify -format "%w %h" "${F(p)}"`).toString().split(' ').map(Number));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const C = { bg: '#EEF1F3', sheet: '#F8FAFB', ink: '#1C2430', mut: '#5D6670', line: '#D3DAE0', acc: '#9E1B22', dark: '#1B2632' };
const D = require('./pins8-data.js'); const A = D.A;
// Кусок картинки: x, y — левый верхний угол (доли ширины/высоты), w — доля ширины; высота — по пропорции рамки.
const crop = (k, x, y, w, W, H, extra = '') => {
  const [iw, ih] = dim(A[k]); let s = W / (w * iw);
  if (ih * s * (1 - y) < H) { s = H / (ih * (1 - y)); if (ih * s < H) { s = H / ih; y = 0; } }
  x = Math.max(0, Math.min(x, 1 - W / (iw * s)));
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
    <div style="position:absolute;left:62px;right:50px;top:${p.items.length > 6 ? 880 : 965}px;display:grid;grid-template-columns:${p.items.length > 6 ? '1fr 1fr' : '1fr'};grid-auto-rows:${p.items.length > 6 ? 84 : 72}px;column-gap:30px">${p.items.map(q => `<div style="font:700 ${p.items.length > 6 ? 48 : 54}px/1 Caveat;color:#93AFCC;padding-left:40px;position:relative;white-space:nowrap;display:flex;align-items:center"><span style="position:absolute;left:4px;top:50%;margin-top:-8px;width:16px;height:16px;border-radius:50%;background:#C9A27A"></span>${esc(q)}</div>`).join('')}</div>
    <div class="url" style="bottom:40px;color:#B9AEA4">${esc(p.foot)} · pigeonpolly.com</div>`,
  meme: p => `<div class="mt" style="position:absolute;left:60px;right:60px;top:80px">${esc(p.top)}</div>
    ${p.two ? p.two.map((q, i) => `<div class="shadow" style="position:absolute;left:60px;top:${240 + i * 560}px;border:10px solid #fff">${crop(q.art, ...q.c, 860, 480)}<span class="note" style="right:-20px;top:-26px;transform:rotate(${i ? 3 : -3}deg)">${esc(q.say)}</span></div>`).join('')
      : `<div class="shadow" style="position:absolute;left:60px;top:${p.itop || 380}px;border:12px solid #fff;transform:rotate(${p.rot || -1.5}deg)">${crop(p.art, ...p.c, 856, p.ih || 900)}</div>
      ${p.say ? `<div class="note" style="right:60px;bottom:150px;transform:rotate(2deg)">${esc(p.say)}</div>` : ''}`}${site()}`,
};

const PINS = D.PINS(L);

(async () => {
  const only = process.argv.slice(2).map(Number);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_pin8.html'); const out = [];
  for (const p of PINS) {
    out.push({ n: p.n, type: p.type, title: p.title, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics });
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap"><style>${CSS}</style></head><body>${T[p.tpl](p)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 88 });
  }
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp); fs.writeFileSync(path.join(__dirname, 'pins8.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
