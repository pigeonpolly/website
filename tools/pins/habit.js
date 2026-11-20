// Трекер привычек 2027 (EN) — PDF A4 для печати, дизайн «Бумага» как у календарей /freebies/ (docs/freebies.md).
// Арты месяцев — те же, что в календарях (cal-data.js), цвета — из палитры арта (content/palettes.json).
// node tools/pins/habit.js → site/images/freebies/habit-tracker-2027.pdf (обложка, год по клеточкам, 12 месяцев, итоги года)
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const ART = require('./cal-data');
const YEAR = 2027;
const PALS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));
const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WL = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const COVER = { dir: 'bird', key: '2025-pigeon-polly-celebrates-new-year', pos: '50% 45%' };
const PIX = { dir: 'snail', key: '2023-mr-chew-take-away-coffee', pos: '50% 50%' }; // круглый год, не сезонный
const REVIEW = { dir: 'bird', key: '2023-pigeon-polly-thinking-about-relocation-to-mars', pos: '50% 50%' };

// цвета (как в cal.js): чернила и акцент, читаемые на белой бумаге
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const hex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const lum = h => { const [r, g, b] = rgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const sat = h => { const c = rgb(h), mx = Math.max(...c), mn = Math.min(...c); return mx ? (mx - mn) / mx : 0; };
const mix = (h, to, k) => hex(rgb(h).map((v, i) => v + (rgb(to)[i] - v) * k));
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const colors = a => {
  const pal = (PALS.find(p => p.key === a.key) || { colors: ['#2B1A51', '#534AB7', '#D85A30', '#EDAE3F', '#C9C1E6', '#F7F1E7'].map(hex => ({ hex })) }).colors.map(c => c.hex);
  const byL = [...pal].sort((x, y) => lum(x) - lum(y)), vivid = [...pal].sort((x, y) => sat(y) - sat(x));
  let acc = vivid.find(c => contrast(c, '#ffffff') > 3.2) || vivid[0]; while (contrast(acc, '#ffffff') < 3.2) acc = mix(acc, '#000000', .15);
  let ink = byL[0]; while (contrast(ink, '#ffffff') < 9) ink = mix(ink, '#000000', .2);
  return { pal, acc, ink };
};

// арт уменьшаем, чтобы PDF был лёгким
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'habit-'));
const img = a => { const o = path.join(TMP, a.key + '.jpg');
  if (!fs.existsSync(o)) execFileSync('convert', [path.join(ROOT, 'site/images', a.dir, a.key + '.jpg'), '-resize', '1400x>', '-quality', '84', '-strip', o]);
  return 'file://' + o; };
const edge = (y0, seed) => { const pts = ['0 0', '100% 0'];
  for (let i = 40; i >= 0; i--) { const x = i / 40, y = y0 + 9 * Math.sin(x * 9 + seed) + 4 * Math.sin(x * 23 + seed * 2) + 2 * Math.sin(x * 51 + seed);
    pts.push(`${(x * 100).toFixed(1)}% ${y.toFixed(0)}px`); } return `polygon(${pts.join(',')})`; };
// арт целиком, без обрезки (Алина 20.11: не резать головы): высота h, ширина — по пропорциям картинки
const ratio = a => { const [w, h] = execFileSync('identify', ['-format', '%w %h', path.join(ROOT, 'site/images', a.dir, a.key + '.jpg')]).toString().split(' ').map(Number); return w / h; };
const art = (a, h) => `<img src="${img(a)}" style="position:absolute;top:30px;left:50%;height:${h}px;width:${Math.round(h * ratio(a))}px;margin-left:${-Math.round(h * ratio(a) / 2)}px;border-radius:16px;display:block">`;
// обложка — на всю ширину, неровный край режет только низ (пол), не героев
const bleed = (a, seed) => { const h = Math.round(794 / ratio(a)); return `<div class="art" style="height:${h}px;clip-path:${edge(h - 12, seed)}"><img src="${img(a)}"></div>`; };
const mark = `<div class="mk"><i>pp</i>PIGEONPOLLY.COM</div>`;

// страница A4 = 794×1123 px
const CSS = `@page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Patrick Hand',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:794px;height:1123px;position:relative;overflow:hidden;background:#fff;page-break-after:always;color:var(--ink)}
.art{position:absolute;left:0;right:0;top:0}.art img{width:100%;height:100%;object-fit:cover;display:block}
h1{font:400 64px/1 'Caveat Brush';text-align:center}h2{font:400 30px/1 'Caveat Brush'}
.sub{text-align:center;font-size:20px;letter-spacing:.18em;text-transform:uppercase;opacity:.6}
.mk{position:absolute;right:40px;bottom:26px;display:flex;align-items:center;gap:8px;opacity:.5;font:700 11px Karla;letter-spacing:.22em}
.mk i{width:26px;height:26px;border-radius:50%;border:1px solid var(--ink);display:grid;place-items:center;font:italic 400 12px Fraunces;letter-spacing:0}
.box{border:1.5px solid color-mix(in srgb,var(--ink) 35%,#fff);border-radius:12px;padding:12px 16px}
.box h2{color:var(--acc);margin-bottom:6px}
.lines{background:repeating-linear-gradient(180deg,transparent 0 29px,color-mix(in srgb,var(--ink) 22%,#fff) 29px 30px)}`;

const cover = () => { const c = colors(COVER);
  return `<section class="pg" style="--ink:${c.ink};--acc:${c.acc}">${bleed(COVER, 3)}
<div style="position:absolute;left:0;right:0;top:575px;text-align:center"><div style="font:400 150px/1 'Caveat Brush';color:${c.acc}">${YEAR}</div>
<div style="font:400 64px/1.1 'Caveat Brush'">Habit Tracker</div><div class="sub" style="margin-top:14px">small steps · every day · all year</div></div>
<div class="box" style="position:absolute;left:110px;right:110px;top:880px;font-size:19px;line-height:1.5">
<h2>How to use it</h2>1. Pick up to 12 habits for the month and write them on the left.<br>2. Fill in a circle every day you keep a habit — colour it, tick it, doodle it.<br>3. Count your days on the right and celebrate the small wins.</div>
<div style="position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:16px;opacity:.6">Illustrations by Alina Otkinska · Pigeon Polly Art Lab</div></section>`; };

// год по клеточкам: одна привычка или настроение, 365 клеток
const pixels = () => { const c = colors(PIX), cell = 18;
  const rows = MON.map((m, i) => { const n = new Date(YEAR, i + 1, 0).getDate();
    return `<div class="pr"><b>${m.slice(0, 3)}</b>${[...Array(31)].map((_, d) => d < n ? `<i${[0, 6].includes(new Date(YEAR, i, d + 1).getDay()) ? ' class="we"' : ''}></i>` : '<i class="x"></i>').join('')}</div>`; }).join('');
  const key = c.pal.slice(0, 6).map(h => `<div style="display:flex;align-items:center;gap:10px;margin:4px 0"><span style="width:22px;height:22px;border-radius:5px;border:1.5px solid ${h}"></span><span style="flex:1;border-bottom:1px solid ${c.ink}40;height:20px"></span></div>`).join('');
  return `<section class="pg" style="--ink:${c.ink};--acc:${c.acc}">${art(PIX, 280)}
<h1 style="position:absolute;left:0;right:0;top:325px">${YEAR} in Little Squares</h1><div class="sub" style="position:absolute;left:0;right:0;top:392px">one habit or mood · one square a day</div>
<style>.pr{display:flex;align-items:center;gap:3px;margin-bottom:4px;height:${cell}px}.pr b{width:46px;font:400 18px/1 'Patrick Hand'}
.pr i{width:${cell}px;height:${cell}px;border:1.2px solid color-mix(in srgb,var(--ink) 45%,#fff);border-radius:4px}.pr i.we{background:color-mix(in srgb,var(--acc) 9%,#fff)}.pr i.x{border:none}
.dn{display:flex;gap:3px;margin-left:49px;margin-bottom:4px}.dn span{width:${cell}px;text-align:center;font-size:12px;opacity:.55}</style>
<div style="position:absolute;left:50px;top:440px"><div class="dn">${[...Array(31)].map((_, d) => `<span>${d + 1}</span>`).join('')}</div>${rows}</div>
<div class="box" style="position:absolute;left:50px;right:50px;top:760px;height:140px"><h2>Tracking:</h2><div class="lines" style="height:70px"></div></div>
<div class="box" style="position:absolute;left:50px;right:50px;top:910px;height:160px"><h2>Colour key</h2><div style="display:grid;grid-template-columns:1fr 1fr;column-gap:30px">${key}</div></div>
${mark}</section>`; };

const month = a => { const c = colors(a), n = new Date(YEAR, a.m, 0).getDate(), H = 12;
  const we = d => [0, 6].includes(new Date(YEAR, a.m - 1, d).getDay());
  const days = [...Array(31)].map((_, i) => i + 1);
  const head = `<div class="hr hh"><b></b>${days.map(d => d <= n ? `<span class="${we(d) ? 'we' : ''}"><em>${WL[new Date(YEAR, a.m - 1, d).getDay()]}</em>${d}</span>` : '<span class="x"></span>').join('')}<u>total</u></div>`;
  const row = `<div class="hr"><b></b>${days.map(d => d <= n ? `<span class="${we(d) ? 'we' : ''}"><i></i></span>` : '<span class="x"></span>').join('')}<u></u></div>`;
  return `<section class="pg" style="--ink:${c.ink};--acc:${c.acc}">${art(a, 360)}
<h1 style="position:absolute;left:0;right:0;top:402px">${MON[a.m - 1]} ${YEAR}</h1><div class="sub" style="position:absolute;left:0;right:0;top:468px">habit tracker</div>
<style>.tb{position:absolute;left:36px;right:36px;top:500px}.hr{display:flex;align-items:stretch;height:30px;border-bottom:1px solid color-mix(in srgb,var(--ink) 18%,#fff)}
.hr b{width:150px;flex:none;border-right:1.5px solid color-mix(in srgb,var(--ink) 35%,#fff)}.hr span{width:17.4px;flex:none;display:grid;place-items:center}.hr span.we{background:color-mix(in srgb,var(--acc) 11%,#fff)}
.hr i{width:12px;height:12px;border-radius:50%;border:1.2px solid color-mix(in srgb,var(--ink) 50%,#fff)}.hr u{flex:1;text-decoration:none;border-left:1.5px solid color-mix(in srgb,var(--ink) 35%,#fff);text-align:center;font-size:13px;opacity:.6}
.hh{height:38px;border-bottom:1.5px solid color-mix(in srgb,var(--ink) 35%,#fff)}.hh span{font-size:12.5px;line-height:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}.hh em{font-style:normal;opacity:.5;font-size:11px}.hh span.we{color:var(--acc)}
.hh b{font:400 22px 'Caveat Brush';display:flex;align-items:center;color:var(--acc)}.hh u{display:flex;align-items:center;justify-content:center}</style>
<div class="tb">${head.replace('<b></b>', '<b>my habits</b>')}${row.repeat(H)}</div>
<div class="box" style="position:absolute;left:36px;top:918px;width:353px;height:150px"><h2>This month I want to…</h2><div class="lines" style="height:90px"></div></div>
<div class="box" style="position:absolute;right:36px;top:918px;width:353px;height:150px"><h2>Little wins</h2><div class="lines" style="height:90px"></div></div>
${mark}</section>`; };

const review = () => { const c = colors(REVIEW);
  const q = ['The habit I’m proudest of', 'What was harder than I thought', 'My favourite month and why', 'Habits I’m taking into 2028'];
  return `<section class="pg" style="--ink:${c.ink};--acc:${c.acc}">${art(REVIEW, 300)}
<h1 style="position:absolute;left:0;right:0;top:345px">My ${YEAR} in Review</h1><div class="sub" style="position:absolute;left:0;right:0;top:412px">look back · be kind · keep going</div>
<div style="position:absolute;left:40px;right:40px;top:450px;display:grid;grid-template-columns:1fr 1fr;gap:18px">${q.map(t => `<div class="box" style="height:300px"><h2>${t}</h2><div class="lines" style="height:235px"></div></div>`).join('')}</div>
${mark}</section>`; };

(async () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400&family=Karla:wght@700&family=Caveat+Brush&family=Patrick+Hand&display=swap"><style>${CSS}</style></head>
<body>${cover()}${pixels()}${ART.map(month).join('')}${review()}</body></html>`;
  const f = path.join(TMP, 'habit.html'); fs.writeFileSync(f, html);
  const b = await chromium.launch(), page = await b.newPage();
  await page.goto('file://' + f, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  const out = path.join(ROOT, 'site/images/freebies/habit-tracker-2027.pdf');
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  if (process.argv[2] === 'png') { await page.setViewportSize({ width: 794, height: 1123 });
    const secs = await page.$$('section'); for (const [i, s] of secs.entries()) await s.screenshot({ path: path.join(process.argv[3] || TMP, `p${i + 1}.png`) }); }
  await b.close(); fs.rmSync(TMP, { recursive: true, force: true });
  console.log(out, (fs.statSync(out).size / 1e6).toFixed(1) + ' MB');
})();
