// Календари на месяц и заставки на телефон для раздела /freebies/ + пины Pinterest с ними (docs/freebies.md).
// 3 дизайна × неделя с понедельника (EU) и с воскресенья (US) × 12 месяцев; цвета — из палитры арта, сайт — только маленьким знаком.
// node tools/pins/cal.js [cal|wall|year|all] [месяц…]  (year — только календари на год)
//  → site/images/freebies/cal/<год>-<мм>-<mon|sun>-<дизайн>.jpg (1600×2400) + t/… (480×720)
//  → site/images/pins/pin-NNN.jpg (1000×1500), site/images/freebies/wall/<key>.jpg (1179×2556) + t/…
//  → site/assets/freebies.json (страница /freebies/), tools/pins/cal.json (тексты пинов для Notion)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const ART = require('./cal-data'), WALLS = ART.walls;
const YEAR = 2027, FIRST_PIN = 488;
const SITE = 'https://www.pigeonpolly.com', UTM = 'utm_source=pinterest&utm_campaign=calendar27';
const PALS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));
const OUT = path.join(ROOT, 'site/images/freebies');
const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WD = { mon: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], sun: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
const pad = n => String(n).padStart(2, '0');

// цвета
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const hex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const lum = h => { const [r, g, b] = rgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const sat = h => { const c = rgb(h), mx = Math.max(...c), mn = Math.min(...c); return mx ? (mx - mn) / mx : 0; };
const mix = (h, to, k) => hex(rgb(h).map((v, i) => v + (rgb(to)[i] - v) * k));
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const colors = a => {
  const pal = PALS.find(p => p.key === a.key).colors.map(c => c.hex);
  const byL = [...pal].sort((x, y) => lum(x) - lum(y));
  let dark = byL[0]; while (lum(dark) > .035) dark = mix(dark, '#000000', .2);
  let light = byL[byL.length - 1]; if (lum(light) < .55) light = mix(light, '#ffffff', .55);
  const vivid = [...pal].sort((x, y) => sat(y) * (lum(y) > .05 ? 1 : .3) - sat(x) * (lum(x) > .05 ? 1 : .3));
  // акцент на тёмном — яркий и светлый, на бумаге — яркий и достаточно тёмный
  let accD = vivid.find(c => contrast(c, dark) > 4) || mix(vivid[0], '#ffffff', .4);
  let accL = vivid.find(c => contrast(c, '#F7F1E7') > 3.2) || vivid[0]; while (contrast(accL, '#F7F1E7') < 3.2) accL = mix(accL, '#000000', .15);
  let inkL = byL[0]; while (contrast(inkL, '#F7F1E7') < 9) inkL = mix(inkL, '#000000', .2);
  return { pal, dark, light, accD, accL, inkL };
};

const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Karla:wght@500;700&family=Caveat+Brush&family=Patrick+Hand&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap">';
const BASE = `*{box-sizing:border-box;margin:0;padding:0}html,body{width:1000px;height:1500px;overflow:hidden}body{font-family:Karla,sans-serif;position:relative}`;
const grid = (y, m, wk) => {
  const off = wk === 'mon' ? 6 : 0, first = (new Date(y, m - 1, 1).getDay() + off) % 7, n = new Date(y, m, 0).getDate();
  const rows = Math.ceil((first + n) / 7), we = i => wk === 'mon' ? i % 7 > 4 : i % 7 === 0 || i % 7 === 6;
  const cells = [];
  for (let i = 0; i < rows * 7; i++) { const d = i - first + 1; cells.push(d >= 1 && d <= n ? { d, we: we(i) } : null); }
  return { rows, cells };
};
const mark = c => `<div class="mk"><i>pp</i>PIGEONPOLLY.COM</div>`;
const MK = (col, op = .6) => `.mk{position:absolute;right:70px;bottom:44px;display:flex;align-items:center;gap:12px;opacity:${op};font:700 17px Karla;letter-spacing:.22em;color:${col}}
.mk i{width:40px;height:40px;border-radius:50%;border:1.5px solid ${col};display:grid;place-items:center;font:italic 400 18px Fraunces;letter-spacing:0}`;
const src = a => 'file://' + path.join(ROOT, 'site/images', a.dir, a.key + '.jpg');

// 1 «Ночь»: арт сверху растворяется в тёмном фоне, клетки-окошки
const D1 = (a, wk, c) => {
  const g = grid(YEAR, a.m, wk), ink = c.light, bg = c.dark, acc = c.accD;
  return `<style>${BASE}body{background:${bg};color:${ink}}
.art{position:absolute;left:0;right:0;top:0;height:800px}.art img{width:100%;height:100%;object-fit:cover;object-position:${a.pos};display:block}
.art:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${bg}00 60%,${bg} 99%)}
.cal{position:absolute;left:70px;right:70px;top:${g.rows > 5 ? 715 : 735}px}
.hd{display:flex;align-items:baseline;justify-content:center;gap:26px}.hd h1{font:italic 400 104px/1 Fraunces;letter-spacing:-.02em}
.hd span{font:700 26px Karla;letter-spacing:.3em;color:${acc}}.st{font-size:30px;transform:translateY(-14px)}
.wd,.g{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}.wd{margin-top:34px;text-align:center;font:700 19px Karla;letter-spacing:.2em;text-transform:uppercase;opacity:.75}
.g{margin-top:14px}.c{height:${g.rows > 5 ? 82 : 92}px;border-radius:6px;background:${ink}1F;border:1.5px solid ${ink}40;padding:8px 10px}
.c b{font:500 24px Fraunces}.c.we b{color:${acc}}.c.e{background:none;border-color:${ink}1A}${MK(ink)}</style>
<div class="art"><img src="${src(a)}"></div><div class="cal"><div class="hd"><span class="st">✻</span><h1>${MON[a.m - 1]}</h1><span>${YEAR}</span><span class="st">✻</span></div>
<div class="wd">${WD[wk].map(d => `<div>${d}</div>`).join('')}</div><div class="g">${g.cells.map(x => x ? `<div class="c${x.we ? ' we' : ''}"><b>${x.d}</b></div>` : '<div class="c e"></div>').join('')}</div></div>${mark()}`;
};

// 2 «Бумага» (по примеру Алины): белый лист с зерном, арт сверху с неровным «рисованным» краем, месяц от руки, числа маленьким блоком
const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")`;
const edge = (y0, seed) => { const pts = ['0 0', '100% 0'];
  for (let i = 40; i >= 0; i--) { const x = i / 40, y = y0 + 16 * Math.sin(x * 9 + seed) + 7 * Math.sin(x * 23 + seed * 2) + 4 * Math.sin(x * 51 + seed);
    pts.push(`${(x * 100).toFixed(1)}% ${y.toFixed(0)}px`); } return `polygon(${pts.join(',')})`; };
const D2 = (a, wk, c) => {
  const g = grid(YEAR, a.m, wk), ink = c.inkL, acc = c.accL;
  return `<style>${BASE}body{background:#FBF9F4;color:${ink}}body:after{content:'';position:absolute;inset:0;background:${NOISE};opacity:.16;mix-blend-mode:multiply;pointer-events:none}
.art{position:absolute;left:0;right:0;top:0;height:${g.rows > 5 ? 860 : 900}px;clip-path:${edge(g.rows > 5 ? 830 : 870, a.m)}}
.art img{width:100%;height:100%;object-fit:cover;object-position:${a.pos};display:block}
h1{position:absolute;left:0;right:0;top:${g.rows > 5 ? 900 : 945}px;text-align:center;font:400 118px/1 'Caveat Brush';letter-spacing:.02em}
.cal{position:absolute;left:50%;transform:translateX(-50%);top:${g.rows > 5 ? 1040 : 1085}px;width:580px}
.wd,.g{display:grid;grid-template-columns:repeat(7,1fr);text-align:center}.wd{font:400 26px 'Patrick Hand';opacity:.55;margin-bottom:4px}
.g div{font:400 46px/1.3 'Patrick Hand'}.g .we{color:${acc}}${MK(ink, .5)}.mk{bottom:40px;right:44px}</style>
<div class="art"><img src="${src(a)}"></div><h1>${MON[a.m - 1]} ${YEAR}</h1>
<div class="cal"><div class="wd">${WD[wk].map(d => `<div>${d[0]}</div>`).join('')}</div><div class="g">${g.cells.map(x => x ? `<div${x.we ? ' class="we"' : ''}>${x.d}</div>` : '<div></div>').join('')}</div></div>${mark()}`;
};

// 3 «Арка»: пастельный фон из палитры, арт в арке, крупный гротеск, выходные — цветные кружки палитры
const D3 = (a, wk, c) => {
  const g = grid(YEAR, a.m, wk), mids = c.pal.filter(h => lum(h) > .04 && lum(h) < .5).sort((x, y) => sat(y) - sat(x));
  const bg = mix(mids[0] || c.pal[0], '#ffffff', .8), ink = c.inkL;
  const dots = c.pal.filter(h => contrast(h, bg) > 1.6); let k = 0;
  return `<style>${BASE}body{background:${bg};color:${ink}}
.ar{position:absolute;left:170px;right:170px;top:80px;height:${g.rows > 5 ? 640 : 680}px;border-radius:330px 330px 18px 18px;overflow:hidden;box-shadow:0 16px 40px ${ink}33}
.ar img{width:100%;height:100%;object-fit:cover;object-position:${a.pos};display:block}
.ol{position:absolute;left:150px;right:150px;top:60px;height:${g.rows > 5 ? 680 : 720}px;border-radius:350px 350px 26px 26px;border:2px solid ${ink}55}
.hd{position:absolute;left:0;right:0;top:${g.rows > 5 ? 775 : 815}px;text-align:center}
.hd h1{font:800 112px/1 'Bricolage Grotesque';letter-spacing:-.03em;text-transform:uppercase}.hd span{display:block;font:600 26px 'Bricolage Grotesque';letter-spacing:.5em;margin-top:6px;opacity:.7}
.cal{position:absolute;left:110px;right:110px;top:${g.rows > 5 ? 960 : 1000}px}
.wd,.g{display:grid;grid-template-columns:repeat(7,1fr);justify-items:center}.wd{font:700 22px 'Bricolage Grotesque';letter-spacing:.1em;opacity:.6;margin-bottom:8px}
.g{row-gap:6px}.g div{width:${g.rows > 5 ? 60 : 68}px;height:${g.rows > 5 ? 60 : 68}px;border-radius:50%;display:grid;place-items:center;font:600 31px 'Bricolage Grotesque'}
${MK(ink, .55)}.mk{bottom:36px}</style>
<div class="ol"></div><div class="ar"><img src="${src(a)}"></div><div class="hd"><h1>${MON[a.m - 1]}</h1><span>${YEAR}</span></div>
<div class="cal"><div class="wd">${WD[wk].map(d => `<div>${d.slice(0, 2).toUpperCase()}</div>`).join('')}</div><div class="g">${g.cells.map(x => {
    if (!x) return '<div></div>'; if (!x.we) return `<div>${x.d}</div>`;
    const h = dots[k++ % dots.length] || ink; return `<div style="background:${h};color:${lum(h) > .35 ? ink : '#fff'}">${x.d}</div>`; }).join('')}</div></div>${mark()}`;
};
const DESIGNS = [D1, D2, D3];

// календарь на весь год: тот же дизайн, сверху арт, ниже 12 месяцев сеткой 4×3
const YART = { m: 0, dir: 'bird', key: '2025-pigeon-polly-celebrates-new-year', pos: '50% 45%', season: 'Круглый год',
  scene: 'Polly the pigeon and friends celebrating a cozy New Year', tags: 'year at a glance, planner, new year',
  t: ['Polly’s New Year', 'Новый год Полли', 'Pollijas Jaunais gads'] };
const mini = (m, wk, cls) => { const g = grid(YEAR, m, wk);
  return `<div class="mm"><b>${MON[m - 1]}</b><div class="mw">${WD[wk].map(d => `<i>${d[0]}</i>`).join('')}</div><div class="mg">${g.cells.map(x => x ? `<i${x.we ? ' class="we"' : ''}>${x.d}</i>` : '<i></i>').join('')}</div></div>`; };
const months = wk => `<div class="yr">${[...Array(12)].map((_, i) => mini(i + 1, wk)).join('')}</div>`;
const YCSS = (top, mb, mi, gap = 26) => `.yr{position:absolute;left:60px;right:60px;top:${top}px;display:grid;grid-template-columns:repeat(4,1fr);gap:${gap}px 30px}
.mw,.mg{display:grid;grid-template-columns:repeat(7,1fr);text-align:center}.mm b{display:block;${mb};margin-bottom:6px}.mw i{font-style:normal;opacity:.55;${mi}}.mg i{font-style:normal;${mi};line-height:1.45}`;
const Y = [
  (a, wk, c) => { const ink = c.light, bg = c.dark, acc = c.accD;
    return `<style>${BASE}body{background:${bg};color:${ink}}.art{position:absolute;left:0;right:0;top:0;height:520px}.art img{width:100%;height:100%;object-fit:cover;object-position:${a.pos};display:block}
.art:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${bg}00 55%,${bg} 99%)}
h1{position:absolute;left:0;right:0;top:445px;text-align:center;font:italic 400 110px/1 Fraunces}h1 span{color:${acc};font-size:40px}
${YCSS(620, `font:italic 400 32px Fraunces;color:${acc};text-align:center`, 'font:500 17px Karla', 40)}.mg .we{color:${acc}}${MK(ink)}.mk{bottom:30px}</style>
<div class="art"><img src="${src(a)}"></div><h1><span>✻ </span>${YEAR}<span> ✻</span></h1>${months(wk)}${mark()}`; },
  (a, wk, c) => { const ink = c.inkL, acc = c.accL;
    return `<style>${BASE}body{background:#FBF9F4;color:${ink}}body:after{content:'';position:absolute;inset:0;background:${NOISE};opacity:.16;mix-blend-mode:multiply;pointer-events:none}
.art{position:absolute;left:0;right:0;top:0;height:500px;clip-path:${edge(475, 3)}}.art img{width:100%;height:100%;object-fit:cover;object-position:${a.pos};display:block}
h1{position:absolute;left:0;right:0;top:500px;text-align:center;font:400 96px/1 'Caveat Brush'}
${YCSS(625, `font:400 36px 'Caveat Brush';text-align:center`, "font:400 20px 'Patrick Hand'", 34)}.mg .we{color:${acc}}${MK(ink, .5)}.mk{bottom:28px;right:44px}</style>
<div class="art"><img src="${src(a)}"></div><h1>${YEAR}</h1>${months(wk)}${mark()}`; },
  (a, wk, c) => { const mids = c.pal.filter(h => lum(h) > .04 && lum(h) < .5).sort((x, y) => sat(y) - sat(x));
    const bg = mix(mids[0] || c.pal[0], '#ffffff', .8), ink = c.inkL, dots = c.pal.filter(h => contrast(h, bg) > 2);
    return `<style>${BASE}body{background:${bg};color:${ink}}
.ar{position:absolute;left:290px;right:290px;top:60px;height:420px;border-radius:220px 220px 14px 14px;overflow:hidden;box-shadow:0 14px 34px ${ink}33}.ar img{width:100%;height:100%;object-fit:cover;object-position:${a.pos};display:block}
.ol{position:absolute;left:274px;right:274px;top:44px;height:452px;border-radius:236px 236px 20px 20px;border:2px solid ${ink}55}
h1{position:absolute;left:0;right:0;top:505px;text-align:center;font:800 92px/1 'Bricolage Grotesque';letter-spacing:-.02em}
${YCSS(640, "font:800 20px 'Bricolage Grotesque';letter-spacing:.1em;text-transform:uppercase;text-align:center", "font:600 16px 'Bricolage Grotesque'", 40)}
${[...Array(12)].map((_, i) => `.mm:nth-child(${i + 1}) b,.mm:nth-child(${i + 1}) .we{color:${dots[i % dots.length] || ink}}`).join('')}${MK(ink, .55)}.mk{bottom:28px}</style>
<div class="ol"></div><div class="ar"><img src="${src(a)}"></div><h1>${YEAR}</h1>${months(wk)}${mark()}`; },
];

// заставка на телефон 393×852 (×3): сверху место под часы, арт в рамке, палитра точками
const WALL = (a, c) => `<style>*{box-sizing:border-box;margin:0;padding:0}html,body{width:393px;height:852px;overflow:hidden}
body{background:${c.dark};position:relative}
.art{position:absolute;inset:0}.art img{display:block;width:100%;height:100%;object-fit:cover;object-position:${a.wpos || a.pos}}
.lg{position:absolute;left:50%;bottom:22px;width:22px;height:22px;margin-left:-11px;opacity:.85;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}</style>
<div class="art"><img src="${src(a)}"></div><img class="lg" src="file://${path.join(ROOT, 'site/assets/logo-badge-white.png')}">`;

// тексты пинов
const WK = { mon: ['Monday Start', 'week starts on Monday (European style)'], sun: ['Sunday Start', 'week starts on Sunday (US style)'] };
const TITLE = [
  (mo, w) => `${mo} ${YEAR} Calendar Printable, ${WK[w][0]} | Cozy Illustrated Calendar`,
  (mo, w) => `Aesthetic ${mo} ${YEAR} Calendar (${WK[w][0]}) | Free Printable Art Calendar`,
  (mo, w) => `Free ${mo} ${YEAR} Calendar, ${WK[w][0]} | Cute Wallpaper & Printable`,
];
const STYLE = ['dark moody', 'hand-drawn paper', 'pastel arch'];
const pinText = (a, d, w, n) => {
  const mo = MON[a.m - 1], id = `${YEAR}-${pad(a.m)}-${w}`;
  return { n, type: 'Календарь', season: a.season, title: TITLE[d](mo, w),
    desc: `A free ${mo} ${YEAR} calendar with my illustration: ${a.scene}. ${STYLE[d][0].toUpperCase() + STYLE[d].slice(1)} design, ${WK[w][1]}. Download it free in high resolution to print or use as a desktop or phone background. More months, US and EU versions on my site.`,
    alt: `${mo} ${YEAR} monthly calendar, ${WK[w][0]}, in a ${STYLE[d]} style under an illustration of ${a.scene}.`,
    link: `${SITE}/freebies/?f=${id}&d=${d + 1}&${UTM}`, media: `${SITE}/images/pins/pin-${n}.jpg`,
    topics: `${mo} calendar ${YEAR}, Printable calendar, Aesthetic calendar, ${WK[w][0]} calendar, ${a.tags}` };
};

const YT = [w => `${YEAR} Yearly Calendar Printable, ${WK[w][0]} | Cozy Illustrated Year at a Glance`,
  w => `Aesthetic ${YEAR} Calendar, ${WK[w][0]} | Free Printable Year Planner`, w => `Free ${YEAR} Year at a Glance Calendar (${WK[w][0]}) | Cute Printable`];
const yearText = (d, w, n) => ({ n, type: 'Календарь', season: 'Круглый год', title: YT[d](w),
  desc: `A free ${YEAR} calendar, all twelve months on one page, with my illustration: ${YART.scene}. ${STYLE[d][0].toUpperCase() + STYLE[d].slice(1)} design, ${WK[w][1]}. Download it free in high resolution to print for your wall, desk or planner. Monthly calendars, US and EU versions on my site.`,
  alt: `${YEAR} yearly calendar with all twelve months, ${WK[w][0]}, in a ${STYLE[d]} style under an illustration of ${YART.scene}.`,
  link: `${SITE}/freebies/?f=${YEAR}-year-${w}&d=${d + 1}&${UTM}`, media: `${SITE}/images/pins/pin-${n}.jpg`,
  topics: `${YEAR} calendar, Yearly calendar printable, Year at a glance, ${WK[w][0]} calendar, Aesthetic planner` });

(async () => {
  const [mode = 'all', ...ms] = process.argv.slice(2), want = ms.map(Number);
  const list = mode === 'year' ? [] : ART.filter(a => !want.length || want.includes(a.m));
  ['cal', 'cal/t', 'wall', 'wall/t'].forEach(d => fs.mkdirSync(path.join(OUT, d), { recursive: true }));
  const b = await chromium.launch(), f = path.join(__dirname, 'cal-out.html');
  const shoot = async (page, html, out) => {
    fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8">${FONTS}</head><body>${html}</body></html>`);
    await page.goto('file://' + f, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
  };
  const mg = (i, o, w) => execFileSync('convert', [i, '-resize', w + 'x', '-quality', '86', '-strip', o]);
  if (mode !== 'wall') {
    const page = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1.6 });
    for (const a of list) { const c = colors(a);
      for (let d = 0; d < 3; d++) for (const w of ['mon', 'sun']) {
        const nm = `${YEAR}-${pad(a.m)}-${w}-${d + 1}.jpg`, full = path.join(OUT, 'cal', nm);
        await shoot(page, DESIGNS[d](a, w, c), full);
        mg(full, path.join(OUT, 'cal/t', nm), 480);
        const n = FIRST_PIN + (a.m - 1) * 6 + d * 2 + (w === 'sun' ? 1 : 0);
        mg(full, path.join(ROOT, 'site/images/pins', `pin-${n}.jpg`), 1000);
        console.log(nm, '→ pin', n);
      } }
    if (!want.length || mode === 'year') { const c = colors(YART);
      for (let d = 0; d < 3; d++) for (const w of ['mon', 'sun']) {
        const nm = `${YEAR}-year-${w}-${d + 1}.jpg`, full = path.join(OUT, 'cal', nm);
        await shoot(page, Y[d](YART, w, c), full); mg(full, path.join(OUT, 'cal/t', nm), 480);
        const n = FIRST_PIN + 72 + d * 2 + (w === 'sun' ? 1 : 0);
        mg(full, path.join(ROOT, 'site/images/pins', `pin-${n}.jpg`), 1000); console.log(nm, '→ pin', n);
      } }
    await page.close();
  }
  if (mode !== 'cal') {
    const page = await b.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3 });
    for (const a of (mode === 'wall' && !want.length ? WALLS : [])) { const full = path.join(OUT, 'wall', a.key + '.jpg');
      await shoot(page, WALL(a, colors(a)), full); mg(full, path.join(OUT, 'wall/t', a.key + '.jpg'), 300); console.log('wall', a.key); }
    await page.close();
  }
  if (fs.existsSync(f)) fs.unlinkSync(f); await b.close();
  // данные страницы и тексты пинов — всегда по всем месяцам
  const im = p => '/images/freebies/' + p;
  const data = {
    year: ['mon', 'sun'].map(w => ({ id: `${YEAR}-year-${w}`, y: YEAR, w, art: YART.t,
      d: [1, 2, 3].map(k => ({ full: im(`cal/${YEAR}-year-${w}-${k}.jpg`), th: im(`cal/t/${YEAR}-year-${w}-${k}.jpg`) })) })),
    cal: ART.flatMap(a => ['mon', 'sun'].map(w => ({ id: `${YEAR}-${pad(a.m)}-${w}`, y: YEAR, m: a.m, w, art: a.t,
      d: [1, 2, 3].map(k => ({ full: im(`cal/${YEAR}-${pad(a.m)}-${w}-${k}.jpg`), th: im(`cal/t/${YEAR}-${pad(a.m)}-${w}-${k}.jpg`) })) }))),
    wall: WALLS.map(a => ({ id: a.key, t: a.t, full: im(`wall/${a.key}.jpg`), th: im(`wall/t/${a.key}.jpg`) })),
  };
  fs.writeFileSync(path.join(ROOT, 'site/assets/freebies.json'), JSON.stringify(data));
  const pins = ART.flatMap(a => [0, 1, 2].flatMap(d => ['mon', 'sun'].map(w => pinText(a, d, w, FIRST_PIN + (a.m - 1) * 6 + d * 2 + (w === 'sun' ? 1 : 0)))));
  pins.push(...[0, 1, 2].flatMap(d => ['mon', 'sun'].map(w => yearText(d, w, FIRST_PIN + 72 + d * 2 + (w === 'sun' ? 1 : 0)))));
  fs.writeFileSync(path.join(__dirname, 'cal.json'), JSON.stringify(pins, null, 1));
})();
