// Пины №945–1084 «Топ-форматы 2.0» — тизеры: пин показывает начало, всё целиком — на /draw/ (Алина 20.11: «пины не дают всё сразу, мотивируют зайти»).
// node tools/pins/pins16.js [номер…] → site/images/pins/pin-NNN.jpg, tools/pins/pins16.json (тексты для Notion),
//   site/assets/draw.json + site/images/draw/ (полные версии для страницы /draw/). Заготовки — python3 tools/pins/pins16_prep.py all.
// Тема — v2 сайта; значок v3 подобран к фону: кремовый/бумага → сине-коричневый «autumn» (акцент #22405F), тёмный и ночной → красный «winter»,
// мятный → «spring», голубой летний → «summer».
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const P16 = path.join(__dirname, 'p16');
const SET = process.env.SET || '16';  // новый набор: tools/pins/pins<SET>-data.js, тот же движок
const PINS = require(`./pins${SET}-data.js`);
const PAL = JSON.parse(fs.readFileSync(path.join(P16, 'palettes.json'), 'utf8'));
const U = k => 'file://' + (k.startsWith('p16/') ? path.join(__dirname, k) : path.join(ROOT, 'site/images', k));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const TH = {
  cream: { bg: '#F4F0EA', fg: '#2A211C', acc: '#22405F', acc2: '#93AFCC', mut: '#6C6058', card: '#FBF9F5', ctx: '#2A211C', logo: 'color-autumn' },
  paper: { bg: '#FBF9F5', fg: '#2A211C', acc: '#22405F', acc2: '#93AFCC', mut: '#6C6058', card: '#F4F0EA', ctx: '#2A211C', logo: 'color-autumn' },
  clay: { bg: '#F1E7DC', fg: '#2E2521', acc: '#22405F', acc2: '#C27A4E', mut: '#7A6658', card: '#FBF6F0', ctx: '#2E2521', logo: 'color-autumn' },
  dark: { bg: '#2E2521', fg: '#F1ECE4', acc: '#93AFCC', acc2: '#E2544A', mut: '#B9AEA4', card: '#3A302B', ctx: '#F1ECE4', logo: 'color-winter' },
  night: { bg: '#1C2430', fg: '#F3EDE2', acc: '#E2544A', acc2: '#93AFCC', mut: '#A3A8AC', card: '#26303A', ctx: '#F3EDE2', logo: 'color-winter' },
  sage: { bg: '#F1F4F0', fg: '#1F2A25', acc: '#BE2F3A', acc2: '#6F8A5E', mut: '#5E6A63', card: '#FAFBF9', ctx: '#1F2A25', logo: 'color-spring' },
  blush: { bg: '#F7EEE8', fg: '#2A2420', acc: '#1F7FAE', acc2: '#E85C64', mut: '#6D635B', card: '#FFFDFA', ctx: '#2A2420', logo: 'color-summer' },
  wash: { bg: '#F7F4EE', fg: '#2A2420', acc: '#1F7FAE', acc2: '#7CC6E6', mut: '#6D635B', card: '#FFFDFA', ctx: '#2A2420', logo: 'color-summer' },
};
const img = (k, W, H, pos = '50% 50%', fit = 'cover', st = '') => `<img src="${U(k)}" style="width:${W}px;height:${H}px;object-fit:${fit};object-position:${pos};display:block;${st}">`;
const lum = c => parseInt(c.slice(1, 3), 16) * .3 + parseInt(c.slice(3, 5), 16) * .59 + parseInt(c.slice(5, 7), 16) * .11;
// подвал: значок v3 + адрес + «что ждёт на сайте»
const foot = (t, cta) => `<div class="ft"><img class="lg" src="${U('p16/logo-' + t.logo + '.png')}"><div class="ad">pigeonpolly.com</div>${cta ? `<div class="cta">${esc(cta)} →</div>` : ''}</div>`;
const CSS = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
h1{font:600 74px/1.02 Fraunces;letter-spacing:-.02em;color:${t.fg}}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.pill{display:inline-block;background:${t.fg};color:${t.bg};font:700 21px Karla;letter-spacing:.2em;text-transform:uppercase;padding:9px 20px;border-radius:40px}
.ft{position:absolute;left:44px;right:44px;bottom:30px;height:110px;display:flex;align-items:center;gap:18px}
.ft .lg{width:104px;height:104px}
.ft .ad{font:600 30px Fraunces;color:${t.fg};letter-spacing:-.01em}
.ft .cta{margin-left:auto;background:${t.acc};color:${lum(t.acc) > 150 ? '#2A211C' : '#fff'};font:700 25px Karla;padding:16px 24px;border-radius:40px;max-width:520px;text-align:center;line-height:1.15}
.fr{border-radius:10px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,${t.bg < '#8' ? .5 : .18});background:#fff}
.hand{font:700 46px/1.05 Caveat;color:${t.acc}}
.blur{filter:blur(7px);opacity:.75;user-select:none}
.lock{position:absolute;display:flex;align-items:center;justify-content:center;text-align:center}
.lock span{background:${t.fg};color:${t.bg};font:700 30px/1.15 Karla;padding:18px 28px;border-radius:16px;box-shadow:0 14px 30px rgba(0,0,0,.25);transform:rotate(-2deg)}
.lock span b{display:block;font:700 46px/1 Caveat;color:${t.acc2};margin-bottom:6px}
`;

// заглушка для текста под замком: настоящие пункты, но размытые
const T = {
  // темы на N дней: первая неделя видна, остальное размыто
  prompts: (p, t) => {
    const N = p.items.length, cols = 5, rows = Math.ceil(N / cols), open = 7;
    const top = 610, ch = Math.floor((1500 - top - 170 - (rows - 1) * 10) / rows);
    return `<div style="position:absolute;left:0;top:0;width:1000px;height:420px">${img(p.art, 1000, 420, p.pos)}<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 45%,${t.bg})"></div></div>
    <div style="position:absolute;left:56px;right:56px;top:380px"><span class="pill">${esc(p.kick)}</span><h1 style="margin-top:22px;font-size:${p.fs || (p.t.length > 44 ? 62 : 70)}px">${p.t}</h1></div>
    <div style="position:absolute;left:44px;right:44px;top:${top}px;display:grid;grid-template-columns:repeat(${cols},1fr);grid-auto-rows:${ch}px;gap:10px">
      ${p.items.map((q, i) => `<div style="background:${t.card};border-radius:10px;padding:8px 10px;position:relative;overflow:hidden${i < open ? `;box-shadow:inset 0 0 0 3px ${t.acc}` : ''}"><b style="display:block;font:600 ${ch > 100 ? 28 : 24}px/1 Fraunces;color:${t.acc}">${i + 1}</b><div class="${i < open ? '' : 'blur'}" style="font:700 ${ch > 100 ? 25 : 23}px/1.08 Karla;color:${t.fg};margin-top:5px">${esc(q)}</div></div>`).join('')}</div>
    <div class="lock" style="left:0;right:0;top:${top + ch * 2.4 + 20}px;height:${ch * 2}px"><span><b>+${N - open} more days</b>the full printable list is on my site</span></div>
    ${foot(t, `Get all ${N} prompts`)}`;
  },
  // палитра по детали: HEX спрятаны
  pal: (p, t) => {
    const cols = PAL[p.n];
    return `<div style="position:absolute;left:0;top:0;width:1000px;height:760px">${img('p16/crop-' + p.n + '.jpg', 1000, 760)}<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 62%,${t.bg})"></div></div>
    <div style="position:absolute;left:60px;right:60px;top:700px"><div style="font:700 22px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc2}">color palette</div><h1 style="margin-top:10px;font-size:${p.t.length > 26 ? 66 : 76}px">${p.t}</h1></div>
    <div style="position:absolute;left:60px;right:60px;top:920px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px 22px">
      ${cols.map(c => `<div><div style="height:118px;border-radius:12px;background:${c.hex};box-shadow:0 8px 18px rgba(0,0,0,.25)"></div><div style="font:700 25px Karla;color:${t.fg};margin-top:10px">${esc(c.en)}</div><div style="font:700 21px Karla;color:${t.mut};letter-spacing:.08em">#<span class="blur" style="display:inline-block;filter:blur(5px)">${c.hex.slice(1)}</span></div></div>`).join('')}</div>
    ${foot(t, 'Copy the HEX codes')}`;
  },
  // 4 шага: 1–3 видны, 4 спрятан
  steps: (p, t) => {
    const cap = ['light pencil shapes', 'ink the main lines', 'first pale wash', 'darks & details'];
    const cell = (i, x, y) => `<div style="position:absolute;left:${x}px;top:${y}px;width:438px">
      <div class="fr" style="position:relative">${img(`p16/${p.name}-${i + 1}.jpg`, 438, 470, '50% 50%', 'cover', i === 3 ? 'filter:blur(16px) saturate(.8);transform:scale(1.1)' : '')}
      ${i === 3 ? `<div class="lock" style="inset:0"><span><b>step 4</b>the finished painting + my tips</span></div>` : ''}</div>
      <div style="display:flex;gap:14px;align-items:center;margin-top:12px"><b style="flex:none;width:52px;height:52px;border-radius:50%;background:${t.acc};color:#fff;font:600 30px/52px Fraunces;text-align:center">${i + 1}</b><span style="font:700 38px/1 Caveat;color:${t.fg}">${cap[i]}</span></div></div>`;
    return `<div style="position:absolute;left:56px;right:56px;top:46px"><span class="pill">step by step</span><h1 style="margin-top:18px;font-size:${p.what.length > 18 ? 60 : 68}px">How to paint <em>${esc(p.what)}</em></h1></div>
    ${cell(0, 44, 250)}${cell(1, 518, 250)}${cell(2, 44, 810)}${cell(3, 518, 810)}${foot(t, 'See step 4 on my site')}`;
  },
  // палитра-челлендж: 6 цветов + «нарисуй только ими» (видна 1 вещь из 5)
  palch: (p, t) => {
    const cols = PAL[p.n];
    return `<div style="position:absolute;left:56px;right:56px;top:50px"><span class="pill">palette challenge</span><h1 style="margin-top:18px;font-size:64px">Paint 5 things with <em>only these colors</em></h1></div>
    <div class="fr" style="position:absolute;left:56px;top:330px;transform:rotate(-2deg)">${img('p16/crop-' + p.n + '.jpg', 400, 520)}</div>
    <div style="position:absolute;left:500px;right:56px;top:330px;display:flex;flex-direction:column;gap:12px">${cols.map(c => `<div style="height:76px;border-radius:12px;background:${c.hex};display:flex;align-items:center;padding:0 18px;font:700 24px Karla;color:${lum(c.hex) > 150 ? '#2A211C' : '#fff'}">${esc(c.en)}</div>`).join('')}</div>
    <div style="position:absolute;left:56px;right:56px;top:910px">
      <div style="font:700 26px Karla;letter-spacing:.2em;text-transform:uppercase;color:${t.mut};margin-bottom:14px">${esc(p.t.replace(/<[^>]+>/g, '').split(':')[0])} · your list</div>
      ${p.items.map((q, i) => `<div style="display:flex;gap:16px;align-items:center;margin-bottom:12px"><b style="flex:none;width:46px;height:46px;border-radius:50%;border:3px solid ${t.acc};font:600 26px/40px Fraunces;text-align:center;color:${t.acc}">${i + 1}</b><span class="${i ? 'blur' : ''}" style="font:700 44px/1 Caveat;color:${t.fg}">${esc(q)}</span></div>`).join('')}</div>
    <div class="lock" style="left:430px;right:40px;top:1030px;height:200px"><span><b>+4 more</b>and the HEX codes</span></div>
    ${foot(t, 'Take the challenge')}`;
  },
  // бинго 5×5: видна первая строка и центр
  bingo: (p, t) => {
    const cells = [...p.items.slice(0, 12), 'FREE', ...p.items.slice(12)];
    return `<div style="position:absolute;left:0;top:0;width:1000px;height:330px">${img(p.art, 1000, 330)}<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 40%,${t.bg})"></div></div>
    <div style="position:absolute;left:56px;right:56px;top:280px"><span class="pill">draw it · cross it off</span><h1 style="margin-top:16px;font-size:68px">${p.t}</h1></div>
    <div style="position:absolute;left:56px;right:56px;top:500px;display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:158px;gap:8px">
      ${cells.map((q, i) => `<div style="background:${q === 'FREE' ? t.acc : t.card};border-radius:10px;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;font:700 ${q === 'FREE' ? 40 : 34}px/1 Caveat;color:${q === 'FREE' ? '#fff' : t.fg}"><span class="${i < 5 || q === 'FREE' ? '' : 'blur'}">${q === 'FREE' ? 'FREE: draw Polly' : esc(q)}</span></div>`).join('')}</div>
    <div class="lock" style="left:0;right:0;top:1000px;height:150px"><span><b>printable card</b>free on my site</span></div>
    ${foot(t, 'Print the full card')}`;
  },
  // найди 5 деталей
  ispy: (p, t) => {
    const W = 908, H = 700, R = 150;
    return `<div style="position:absolute;left:56px;right:56px;top:50px"><span class="pill">look closer</span><h1 style="margin-top:18px;font-size:70px">Can you find these <em>5 details?</em></h1></div>
    <div class="fr" style="position:absolute;left:46px;top:300px">${img(p.art, W, H)}</div>
    <div style="position:absolute;left:30px;right:30px;top:1050px;display:flex;justify-content:space-between">${p.pts.map(([x, y], i) => `<div style="width:${R + 26}px;text-align:center"><div style="width:${R + 26}px;height:${R + 26}px;border-radius:50%;border:6px solid ${t.acc};overflow:hidden;background:url('${U(p.art)}') no-repeat;background-size:${Math.round(p.iw)}px auto;background-position:${-Math.round(x * p.iw - (R + 14) / 2)}px ${-Math.round(y * p.ih - (R + 14) / 2)}px;box-shadow:0 8px 20px rgba(0,0,0,.2)"></div><b style="font:600 28px Fraunces;color:${t.acc}">${i + 1}</b></div>`).join('')}</div>
    ${foot(t, 'Answers on my site')}`;
  },
  // найди 5 отличий
  diff: (p, t) => `<div style="position:absolute;left:56px;right:56px;top:40px;text-align:center"><span class="pill">brain break</span><h1 style="margin-top:14px;font-size:66px">Spot the <em>5 differences</em></h1></div>
    <div class="fr" style="position:absolute;left:${(1000 - p.dw) / 2}px;top:210px">${img(`p16/diff-${p.name}-a.jpg`, p.dw, p.dh)}</div>
    <div class="fr" style="position:absolute;left:${(1000 - p.dw) / 2}px;top:${226 + p.dh}px">${img(`p16/diff-${p.name}-b.jpg`, p.dw, p.dh)}</div>
    ${foot(t, 'Check the answers')}`,
  // нарисуй в своём стиле: контур (низ тает) + оригинал полароидом
  dtiys: (p, t) => `<div style="position:absolute;left:56px;right:56px;top:46px"><span class="pill">draw this in your style</span><h1 style="margin-top:18px;font-size:${p.who.length > 24 ? 60 : 68}px">Redraw <em>${esc(p.who)}</em> your way</h1></div>
    <div style="position:absolute;left:44px;top:330px;width:912px;height:1000px;background:#fff;border-radius:10px;box-shadow:0 16px 36px rgba(0,0,0,.14);overflow:hidden">${img(`p16/${p.name}-line.png`, 912, 1000, '50% 50%', 'contain')}<div style="position:absolute;left:0;right:0;bottom:0;height:330px;background:linear-gradient(rgba(255,255,255,0),#fff 85%)"></div>
      <div class="lock" style="left:0;right:0;bottom:40px;height:120px"><span><b>printable line art</b>download it free</span></div></div>
    <div style="position:absolute;right:50px;top:250px;background:#fff;padding:14px 14px 0;box-shadow:0 18px 36px rgba(0,0,0,.25);transform:rotate(5deg)">${img(p.art, 250, 200)}<div style="font:700 30px/1 Caveat;color:#2A211C;text-align:center;padding:10px 0 14px">the original</div></div>
    ${foot(t, 'Get the line art')}`,
};

const sz = k => { const o = execFileSync('python3', ['-c', `from PIL import Image;im=Image.open(${JSON.stringify(k)});print(*im.size)`]).toString().trim().split(' ').map(Number); return o; };
const OUTI = path.join(ROOT, 'site/images/draw');
const save = (src, dst, max = 1000) => { if (!fs.existsSync(dst)) execFileSync('python3', ['-c', `from PIL import Image;im=Image.open(${JSON.stringify(src)});im=im.convert('RGB') if not ${JSON.stringify(dst)}.endswith('.png') else im;im.thumbnail((${max},${max}));im.save(${JSON.stringify(dst)},quality=82,optimize=True)`]); };

(async () => {
  const only = process.argv.slice(2).map(Number);
  fs.mkdirSync(OUTI, { recursive: true });
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_pin16.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
  const out = [], site = [];
  for (const p of PINS) {
    const t = TH[p.th];
    // полные версии для /draw/
    const id = 'p' + p.n, it = { id, n: p.n, k: p.tpl, t: p.t ? p.t.replace(/<[^>]+>/g, '') : p.what ? `How to paint ${p.what}` : p.who ? `Draw ${p.who} in your style` : p.tpl === 'ispy' ? `Look closer #${p.n - 1066}: find 5 details` : `Spot 5 differences #${p.n - 1072}`, season: p.season };
    if (p.tpl === 'prompts' || p.tpl === 'bingo') { save(path.join(ROOT, 'site/images', p.art), path.join(OUTI, `${id}.jpg`), 900); it.img = `/images/draw/${id}.jpg`; it.items = p.items; it.kick = p.kick; }
    if (p.tpl === 'pal' || p.tpl === 'palch') { save(path.join(P16, `crop-${p.n}.jpg`), path.join(OUTI, `${id}.jpg`), 900); it.img = `/images/draw/${id}.jpg`; it.cols = PAL[p.n].map(c => ({ hex: c.hex, n: [c.en, c.ru, c.lv] })); if (p.items) it.items = p.items; if (p.mood) it.mood = p.mood; }
    if (p.tpl === 'steps') { it.steps = [1, 2, 3, 4].map(i => { save(path.join(P16, `${p.name}-${i}.jpg`), path.join(OUTI, `${id}-${i}.jpg`), 900); return `/images/draw/${id}-${i}.jpg`; }); it.tip = p.tip; it.what = p.what; }
    if (p.tpl === 'ispy') { const [w0, h0] = sz(path.join(ROOT, 'site/images', p.art)); const k = Math.max(908 / w0, 700 / h0) * 1.7; p.iw = w0 * k; p.ih = h0 * k; save(path.join(ROOT, 'site/images', p.art), path.join(OUTI, `${id}.jpg`), 1200); it.img = `/images/draw/${id}.jpg`; it.pts = p.pts; }
    if (p.tpl === 'diff') { const [w, h] = sz(path.join(P16, `diff-${p.name}-a.jpg`)); const s = Math.min(912 / w, 560 / h); p.dw = Math.round(w * s); p.dh = Math.round(h * s);
      ['a', 'b'].forEach(x => save(path.join(P16, `diff-${p.name}-${x}.jpg`), path.join(OUTI, `${id}-${x}.jpg`), 1000)); it.ab = [`/images/draw/${id}-a.jpg`, `/images/draw/${id}-b.jpg`];
      it.spots = JSON.parse(fs.readFileSync(path.join(P16, `diff-${p.name}.json`))).map(([x, y, r]) => [x / w, y / h, r / w]); }
    if (p.tpl === 'dtiys') { save(path.join(P16, `${p.name}-line.png`), path.join(OUTI, `${id}-line.png`), 2000); save(path.join(ROOT, 'site/images', p.art), path.join(OUTI, `${id}.jpg`), 900); it.line = `/images/draw/${id}-line.png`; it.img = `/images/draw/${id}.jpg`; }
    it.pin = `/images/pins/pin-${p.n}.jpg`;
    site.push(it);
    out.push({ n: p.n, type: p.tpl, title: p.title, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics, season: p.season });
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap"><style>${CSS(t)}</style></head><body>${T[p.tpl](p, t)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => { const ft = document.querySelector('.ft').getBoundingClientRect().top; return Math.max(...[...document.querySelectorAll('body > *:not(.ft):not(.lock)')].map(e => e.getBoundingClientRect().bottom)) - ft; });
    if (over > 4) console.log('⚠ pin', p.n, 'наезжает на подвал на', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 85 });
  }
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, `pins${SET}.json`), JSON.stringify(out, null, 1));
  // /draw/ — общий список всех наборов: свои записи заменяем, чужие оставляем, порядок по номеру пина
  const DJ = path.join(ROOT, 'site/assets/draw.json'), old = fs.existsSync(DJ) ? JSON.parse(fs.readFileSync(DJ, 'utf8')) : [];
  const mine = new Set(site.map(x => x.id));
  fs.writeFileSync(DJ, JSON.stringify([...old.filter(x => !mine.has(x.id)), ...site].sort((a, b) => a.n - b.n)));
  await b.close();
})();
