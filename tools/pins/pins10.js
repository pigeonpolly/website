// Пины №429–471 «Арт-лаборатория»: ведут на статьи блога, видеоуроки, курс туши, галереи; мокапы на стене, процесс, арт крупно.
// Фото — с Google Диска Алины 14.11 (site/images/photos2/, до 1200 px). Стиль — коричневый фон + голубой Caveat (лучше всего заходят).
// node tools/pins/pins10.js [номер…] → site/images/pins/pin-NNN.jpg + tools/pins/pins10.json (тексты для Notion).
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const L = p => SITE + p.replace(/(#.*)?$/, '?utm_source=pinterest&utm_campaign=artlab$1');
const U = k => 'file://' + path.join(ROOT, 'site/images/photos2', k + '.jpg');
const dim = k => execSync(`identify -format "%w %h" "${path.join(ROOT, 'site/images/photos2', k + '.jpg')}"`).toString().split(' ').map(Number);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const C = { bg: '#2E2521', blue: '#93AFCC', cream: '#F1ECE4', tan: '#C9A27A', mut: '#B9AEA4' };

// картинка «обложкой» в рамку W×H; pos — точка фокуса (CSS object-position)
const cov = (k, W, H, pos = '50% 50%', st = '') => `<img src="${U(k)}" style="width:${W}px;height:${H}px;object-fit:cover;object-position:${pos};display:block;${st}">`;
const url = (c = C.mut, extra = '') => `<div class="url" style="color:${c}">${extra ? esc(extra) + ' · ' : ''}pigeonpolly.com</div>`;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${C.bg};color:${C.cream};font-family:Karla,sans-serif;position:relative}
.url{position:absolute;left:0;right:0;bottom:40px;text-align:center;font:700 36px Caveat}
.kick{position:absolute;left:64px;font:700 46px Caveat;color:${C.blue};transform:rotate(-2deg)}
h1{font:600 84px/1 Fraunces;letter-spacing:-.02em;color:${C.cream}}
h1 em{font-style:italic;font-weight:400;color:${C.blue}}
.fr{border-radius:8px;overflow:hidden;box-shadow:0 26px 50px rgba(0,0,0,.45)}
.hand{font:700 50px/1.1 Caveat;color:${C.blue}}
.tag{display:inline-block;background:${C.blue};color:${C.bg};font:700 24px Karla;letter-spacing:.2em;text-transform:uppercase;padding:10px 20px;border-radius:40px}
.num{position:absolute;left:-18px;top:-22px;width:64px;height:64px;border-radius:50%;background:${C.blue};color:${C.bg};font:700 40px/64px Caveat;text-align:center}
.lbl{position:absolute;background:${C.cream};color:${C.bg};font:700 36px Caveat;padding:4px 16px}
.play{position:absolute;left:50%;top:50%;width:170px;height:170px;margin:-85px 0 0 -85px;border-radius:50%;background:rgba(46,37,33,.82);border:6px solid ${C.cream}}
.play:after{content:'';position:absolute;left:62px;top:44px;border:38px solid transparent;border-left:58px solid ${C.cream};border-right:0}
`;

const T = {
  // статья блога: метка, заголовок, большое фото, «о чём» голубым
  read: p => `<div class="kick" style="top:60px">on the blog ✎</div>
    <h1 style="position:absolute;left:62px;right:56px;top:126px;font-size:${p.fs || 80}px">${p.t}</h1>
    <div class="fr" style="position:absolute;left:62px;top:${p.top || 400}px;transform:rotate(-1deg)">${cov(p.art, 856, p.h || 720, p.pos)}</div>
    <div class="hand" style="position:absolute;left:66px;right:60px;top:${(p.top || 400) + (p.h || 720) + 70}px">${esc(p.hand)}</div>
    ${url(C.mut, 'read it on')}`,
  // арт во всей красе: почти на весь пин, белые поля, подпись внизу
  hero: p => { const [iw, ih] = dim(p.art), r = ih / iw;
    if (r >= 0.95 || p.fill) return `<div class="fr" style="position:absolute;left:50px;top:50px">${cov(p.art, 880, 1150, p.crop || '50% 50%')}</div>
    <div class="hand" style="position:absolute;left:60px;right:60px;top:1258px;font-size:58px">${esc(p.hand)}</div>
    <div style="position:absolute;left:62px;top:1335px;font:400 26px Karla;color:${C.mut};letter-spacing:.04em">${esc(p.sub)}</div>${url(C.mut)}`;
    const H = Math.round(880 * r), c = p.zoom || [0.3, 0.3, 0.4];
    return `<div class="fr" style="position:absolute;left:50px;top:60px">${cov(p.art, 880, H)}</div>
    <div class="kick" style="top:${H + 110}px;left:60px">look closer ↓</div>
    <div class="fr" style="position:absolute;left:50px;top:${H + 180}px;overflow:hidden;width:900px;height:${1230 - H - 180}px"><img src="${U(p.art)}" style="position:absolute;width:${880 / c[2]}px;left:${-c[0] * 880 / c[2]}px;top:${-c[1] * 880 * r / c[2]}px;max-width:none"></div>
    <div class="hand" style="position:absolute;left:60px;right:60px;top:1258px;font-size:58px">${esc(p.hand)}</div>
    <div style="position:absolute;left:62px;top:1335px;font:400 26px Karla;color:${C.mut};letter-spacing:.04em">${esc(p.sub)}</div>${url(C.mut)}`; },
  // процесс: 2–3 шага с номерами
  steps: p => { const n = p.items.length, H = n === 2 ? 470 : 300, G = 40;
    return `<div class="kick" style="top:58px">${esc(p.kick || 'from start to finish')}</div>
    <h1 style="position:absolute;left:62px;right:56px;top:120px;font-size:${p.fs || 78}px">${p.t}</h1>
    ${p.items.map((q, i) => `<div class="fr" style="position:absolute;left:${i % 2 ? 110 : 70}px;top:${p.top || 330 + i * (H + G + 20)}px;transform:rotate(${i % 2 ? 1 : -1}deg)">${cov(q.art, 800, H, q.pos)}
      <div class="num">${i + 1}</div><div class="lbl" style="right:-14px;bottom:-22px;transform:rotate(2deg)">${esc(q.say)}</div></div>`).join('')}
    ${url(C.mut)}`; },
  // видеоурок / курс: фото с ▶, метка
  video: p => `<div style="position:absolute;left:62px;top:66px"><span class="tag">${esc(p.tag || 'free video lesson')}</span></div>
    <h1 style="position:absolute;left:62px;right:56px;top:140px;font-size:${p.fs || 84}px">${p.t}</h1>
    <div class="fr" style="position:absolute;left:62px;top:${p.top || 420}px">${cov(p.art, 856, p.h || 700, p.pos)}${p.play === false ? '' : '<div class="play"></div>'}</div>
    <div class="hand" style="position:absolute;left:66px;right:60px;top:${(p.top || 420) + (p.h || 700) + 60}px">${esc(p.hand)}</div>
    ${url(C.mut, p.foot || 'watch on')}`,
  // сетка 2×2 или 2×3 на коричневом
  grid: p => { const n = p.items.length, rows = Math.ceil(n / 2), H = p.ch || (rows === 3 ? 300 : 420);
    return `<div class="kick" style="top:58px">${esc(p.kick)}</div>
    <h1 style="position:absolute;left:62px;right:56px;top:120px;font-size:${p.fs || 76}px">${p.t}</h1>
    <div style="position:absolute;left:50px;right:50px;top:${p.top || 340}px;display:grid;grid-template-columns:1fr 1fr;gap:22px">
    ${p.items.map(q => `<div style="position:relative;border-radius:8px;overflow:hidden">${cov(q.art, 434, H, q.pos)}${q.say ? `<span class="lbl" style="left:10px;bottom:10px;font-size:32px;padding:2px 12px">${esc(q.say)}</span>` : ''}</div>`).join('')}</div>
    ${url(C.mut)}`; },
  // темы для рисования (как любимые Алиной 282–285): фото + список голубым
  prompts: p => `<div class="kick" style="top:60px">${esc(p.kick)}</div>
    <h1 style="position:absolute;left:62px;right:50px;top:122px;font-size:84px;line-height:.98">${p.t}</h1>
    ${p.arts.map((k, i) => `<div style="position:absolute;left:${62 + i * 440}px;top:${350 + i * 20}px;border-radius:8px;overflow:hidden;transform:rotate(${i ? 2 : -2}deg);box-shadow:0 26px 50px rgba(0,0,0,.45)">${cov(k, 416, 450)}</div>`).join('')}
    <div style="position:absolute;left:62px;right:50px;top:880px;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:84px;column-gap:30px">${p.items.map(q => `<div style="font:700 48px/1 Caveat;color:${C.blue};padding-left:40px;position:relative;white-space:nowrap;display:flex;align-items:center"><span style="position:absolute;left:4px;top:50%;margin-top:-8px;width:16px;height:16px;border-radius:50%;background:${C.tan}"></span>${esc(q)}</div>`).join('')}</div>
    ${url(C.mut, p.foot)}`,
};

const PINS = require('./pins10-data.js')(L);

(async () => {
  const only = process.argv.slice(2).map(Number);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_pin10.html'); const out = [];
  for (const p of PINS) {
    out.push({ n: p.n, type: p.type, title: p.title, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics });
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap"><style>${CSS}</style></head><body>${T[p.tpl](p)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 88 });
  }
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp); fs.writeFileSync(path.join(__dirname, 'pins10.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
