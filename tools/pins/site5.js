// Пины №1671–1720 (Алина 22.11.2026): по 10 — Воббленд, открытки, тулы для художников, игры и вселенная, темы для рисования.
// Кадры: tools/pins/s5/ (node tools/pins/site5_shots.js), tools/pins/shots/ (старые кадры игр), tools/pins/gm/ (открытки, giftmix_shots.js).
// Нужен python3 -m http.server 8799 --directory site только для кадров. node tools/pins/site5.js [номер…] → site/images/pins/pin-NNN.jpg + tools/pins/site5.json.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const PALS = Object.fromEntries(require('../../content/palettes.json').map(p => [p.key, p]));
const WL = Object.fromEntries(require('../../content/wobbleland.json').cities.map(c => [c.key, c]));
const { TH } = require('./giftmix-data.js');
const D = require('./site5-data.js');

const file = k => /^(s5|shots|gm)\//.test(k) ? path.join(__dirname, k) : path.join(ROOT, 'site/images', k);
const U = k => 'file://' + file(k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const plain = s => s.replace(/<\/?em>/g, '');
const A = k => { if (!PALS[k]) throw new Error('нет палитры ' + k); return PALS[k].img.replace('images/', ''); };
const dims = k => { const b = fs.readFileSync(file(k)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const L = (p, n, camp) => { const [a, h] = p.split('#'); const q = a.includes('?') ? '&' : '?'; return `${SITE}${a}${q}utm_source=pinterest&utm_campaign=${camp}&utm_content=pin-${n}${h ? '#' + h : ''}`; };

const CSSf = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
h1{font:600 74px/1.03 Fraunces;letter-spacing:-.02em}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.kick{font:700 22px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc}}
.hand{font:700 50px/1.05 Caveat;color:${t.acc}}
.ft{position:absolute;left:44px;right:44px;bottom:30px;height:110px;display:flex;align-items:center;gap:18px}
.ft .lg{width:104px;height:104px}
.ft .ad{font:600 30px Fraunces}
.ft .cta{margin-left:auto;background:${t.btn || t.acc};color:${t.btnFg || '#fff'};font:700 25px Karla;padding:16px 26px;border-radius:40px}
.fr{border-radius:16px;overflow:hidden;box-shadow:0 18px 40px rgba(20,14,8,.22);background:#fff}
.px{image-rendering:pixelated}
.chip{display:inline-block;background:${t.card};border-radius:30px;padding:10px 20px;font:700 23px Karla;margin:0 8px 10px 0}
.pc{background:#fff;padding:14px;border-radius:6px;box-shadow:0 22px 48px rgba(30,20,10,.25)}
.pc img{display:block;width:100%;border-radius:2px}
.br{background:${t.card};border-radius:16px;overflow:hidden;box-shadow:0 18px 40px rgba(20,14,8,.25)}
.br .bar{height:38px;display:flex;align-items:center;gap:8px;padding:0 16px;background:rgba(0,0,0,.08)}
.br .bar i{width:12px;height:12px;border-radius:50%;background:rgba(0,0,0,.18);display:block}
.br .bar b{margin-left:14px;font:700 17px Karla;opacity:.6}
`;
const foot = (cta, t) => `<div class="ft"><img class="lg" src="${U(`logo/v3/pigeon-polly-${t.logo}-transparent-4000.png`)}"><div class="ad">pigeonpolly.com</div><div class="cta">${esc(cta)} →</div></div>`;
const head = (kick, h, fs = 74, top = 58) => `<div style="position:absolute;left:56px;top:${top}px;right:56px"><div class="kick">${kick}</div><h1 style="margin-top:18px;font-size:${fs}px">${h}</h1></div>`;
const hfs = h => { const n = plain(h).length; return n > 52 ? 60 : n > 38 ? 66 : 74; };
// вырез [x,y,w,h] из картинки в рамку bw×bh (cover по вырезу)
function crop(k, c, bw, bh, px) {
  const [W, H] = dims(k); const [x, y, w, h] = c || [0, 0, W, H];
  const s = Math.max(bw / w, bh / h), ox = x * s + (w * s - bw) / 2, oy = y * s + (h * s - bh) / 2;
  return `<div class="${px ? 'px' : ''}" style="width:${bw}px;height:${bh}px;background:url('${U(k)}') no-repeat;background-size:${W * s}px ${H * s}px;background-position:${-ox}px ${-oy}px;${px ? 'image-rendering:pixelated' : ''}"></div>`;
}
const img = (k, w, h, pos = '50% 50%', px) => `<img class="${px ? 'px' : ''}" src="${U(k)}" style="width:${w}px;height:${h}px;object-fit:cover;object-position:${pos};display:block">`;
const browser = (k, c, w, h, url) => `<div class="br" style="width:${w}px"><div class="bar"><i></i><i></i><i></i><b>pigeonpolly.com${esc(url || '')}</b></div>${crop(k, c, w, h - 38)}</div>`;
const postcard = (id, w, rot = -2, extra = '') => `<div class="pc" style="width:${w}px;transform:rotate(${rot}deg);${extra}"><img src="${U('gm/pc-' + id + '.png')}"></div>`;
const envelope = (w, c1, c2) => `<div style="position:relative;width:${w}px;height:${w * .62}px"><div style="position:absolute;inset:0;background:${c1};border-radius:10px;box-shadow:0 18px 40px rgba(30,20,10,.22)"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:100%;clip-path:polygon(0 0,50% 58%,100% 0,100% 100%,0 100%);background:${c2};border-radius:10px"></div>
  <div style="position:absolute;left:50%;top:52%;width:${w * .14}px;height:${w * .14}px;margin:-${w * .07}px;border-radius:50%;background:#B3262E;box-shadow:0 3px 8px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:#FCE7C8;font:700 ${w * .07}px Fraunces">P</div></div>`;
const chips = (a, top) => `<div style="position:absolute;left:56px;right:56px;top:${top}px;text-align:center">${a.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>`;
const cap = (s, top, fs = 54) => `<div class="hand" style="position:absolute;left:56px;right:56px;top:${top}px;text-align:center;font-size:${fs}px">${esc(s)}</div>`;

const T = {
  // большой кадр (скрин/пиксель/арт) + подпись + чипы
  shot(p, t) {
    const top = p.top || (hfs(p.h) < 74 ? 330 : 290), w = 888;
    const c = p.crop || (p.src ? [0, 0, ...dims(p.src)] : null);
    const room = 1190 - top - (p.cap ? 100 : 36) - (p.chips ? 0 : -40);
    const h = p.ih || (c ? Math.min(room, Math.round(w * c[3] / c[2]) + (p.browser ? 38 : 0)) : 720);
    const box = p.browser ? browser(p.src, p.crop, w, h, p.url) : `<div class="fr">${p.art ? img(A(p.art), w, h, p.pos) : crop(p.src, p.crop, w, h, p.px)}</div>`;
    return `${head(p.kick, p.h, hfs(p.h))}<div style="position:absolute;left:56px;top:${top}px">${box}</div>
      ${p.cap ? cap(p.cap, top + h + 26, p.capfs) : ''}${p.chips ? chips(p.chips, top + h + (p.cap ? 100 : 36)) : ''}${foot(p.cta, t)}`;
  },
  // телефонный кадр слева, список справа
  phone(p, t) {
    const [W, H] = dims(p.src); const w = 400, h = 820;
    return `${head(p.kick, p.h, hfs(p.h))}
      <div style="position:absolute;left:56px;top:${p.top || 330}px;width:${w + 24}px;padding:12px;border-radius:44px;background:#1d1a18;box-shadow:0 20px 44px rgba(0,0,0,.3)"><div style="border-radius:34px;overflow:hidden">${crop(p.src, p.crop || [0, 0, W, W * h / w], w, h)}</div></div>
      <div style="position:absolute;left:520px;right:56px;top:${(p.top || 330) + 20}px;display:flex;flex-direction:column;gap:26px">
      ${p.items.map(s => `<div style="font:500 30px/1.25 Karla"><b style="font:600 32px Fraunces;color:${t.acc}">✦ </b>${esc(s)}</div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  // сетка плиток: [{src|art|pc, crop, label, sub, px}]
  tiles(p, t) {
    const c = p.cols || 2, gap = 24, w = Math.floor((888 - gap * (c - 1)) / c), h = p.tileH || Math.round(w * .62), top = p.top || (hfs(p.h) < 74 ? 330 : 290);
    return `${head(p.kick, p.h, hfs(p.h))}
      <div style="position:absolute;left:56px;top:${top}px;display:grid;grid-template-columns:repeat(${c},${w}px);gap:${gap}px">
      ${p.items.map(it => `<div><div class="fr">${it.art ? img(A(it.art), w, h, it.pos) : it.pc ? `<img src="${U('gm/pc-' + it.pc + '.png')}" style="width:${w}px;height:${h}px;object-fit:cover;display:block">` : crop(it.src, it.crop, w, h, it.px)}</div>
        <div style="font:600 ${c > 2 ? 25 : 30}px/1.1 Fraunces;margin-top:12px">${esc(it.label)}</div>${it.sub ? `<div style="font:500 ${c > 2 ? 19 : 22}px/1.25 Karla;color:${t.mut};margin-top:4px">${esc(it.sub)}</div>` : ''}</div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  // список с маленькими пиксельными значками: [{ic, a, b}]
  rows(p, t) {
    const top = p.top || (hfs(p.h) < 74 ? 320 : 280), n = p.items.length, s = p.ic || 84;
    return `${head(p.kick, p.h, hfs(p.h))}
      <div style="position:absolute;left:56px;right:56px;top:${top}px;bottom:170px;display:flex;flex-direction:column;justify-content:space-evenly">
      ${p.items.map(it => `<div style="display:flex;gap:22px;align-items:center"><div style="flex:none;width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center;background:${t.card};border-radius:14px"><img class="px" src="${U(it.ic)}" style="max-width:${s - 14}px;max-height:${s - 14}px;width:${s - 14}px;object-fit:contain"></div>
        <div><div style="font:600 ${n > 9 ? 28 : 32}px/1.1 Fraunces">${esc(it.a)}</div><div style="font:500 ${n > 9 ? 21 : 24}px/1.25 Karla;color:${t.mut};margin-top:4px">${esc(it.b)}</div></div></div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  // открытый список тем + арт в углу
  list(p, t) {
    const items = p.items, two = items.length > 12, fs = two ? 27 : 33;
    return `<div class="fr" style="position:absolute;right:50px;top:60px;transform:rotate(3deg)">${img(A(p.art), 300, 300, p.pos)}</div>
      <div style="position:absolute;left:56px;right:380px;top:58px"><div class="kick">${p.kick}</div><h1 style="margin-top:18px;font-size:${plain(p.h).length > 34 ? 56 : 64}px">${p.h}</h1></div>
      <div style="position:absolute;left:56px;right:56px;top:410px;bottom:180px;display:flex;flex-direction:column">
      <div style="flex:1;display:grid;align-content:space-evenly;${two ? `grid-template-columns:1fr 1fr;grid-auto-flow:column;grid-template-rows:repeat(${Math.ceil(items.length / 2)},auto);column-gap:30px` : ''}">
      ${items.map((s, i) => `<div style="display:flex;gap:12px;align-items:baseline;font:500 ${fs}px/1.2 Karla"><b style="font:600 ${fs}px Fraunces;color:${t.acc};min-width:42px">${i + 1}</b><span>${esc(s)}</span></div>`).join('')}</div></div>
      ${foot(p.cta, t)}`;
  },
  // цитата + кадр
  quote(p, t) {
    return `<div style="position:absolute;left:56px;right:56px;top:70px"><div class="kick">${p.kick}</div>
      <div style="font:400 italic 54px/1.18 Fraunces;margin-top:26px">“${esc(p.q)}”</div><div class="hand" style="margin-top:18px;font-size:44px">— ${esc(p.who)}</div></div>
      <div class="fr" style="position:absolute;left:56px;top:${p.top || 640}px">${crop(p.src, p.crop, 888, p.ih || 620, p.px)}</div>${foot(p.cta, t)}`;
  },
  // палитра из арта (HEX видны)
  palette(p, t) {
    const P = PALS[p.art];
    return `${head(p.kick, p.h, hfs(p.h))}<div class="fr" style="position:absolute;left:56px;top:300px">${img(A(p.art), 888, 640, p.pos)}</div>
      <div style="position:absolute;left:56px;right:56px;top:970px;display:grid;grid-template-columns:repeat(6,1fr);gap:14px">
      ${P.colors.slice(0, 6).map(c => `<div><div style="height:150px;border-radius:14px;background:${c.hex};box-shadow:inset 0 0 0 2px rgba(0,0,0,.06)"></div><div style="font:600 19px/1.1 Fraunces;margin-top:10px">${esc(c.en)}</div><div style="font:700 17px Karla;color:${t.mut};margin-top:4px">${c.hex}</div></div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  // открытка крупно
  pc(p, t) {
    const top = p.top || 400;
    return `${head(p.kick, p.h, hfs(p.h))}<div style="position:absolute;left:0;right:0;top:${top}px;display:flex;justify-content:center">${postcard(p.id, 860, p.rot ?? -2)}</div>
      ${cap(p.cap, top + 650, 56)}${p.chips ? chips(p.chips, top + 780) : ''}${foot(p.cta, t)}`;
  },
  steps(p, t) {
    return `${head(p.kick, p.h, hfs(p.h))}
      <div style="position:absolute;left:56px;right:56px;top:${p.top || 330}px;display:flex;flex-direction:column;gap:34px">
      ${p.steps.map((s, i) => `<div style="display:flex;gap:30px;align-items:center">
        <div style="flex:none;width:330px">${s.id ? postcard(s.id, 330, [-2, 2, -1][i], 'padding:8px') : `<div style="display:flex;justify-content:center">${envelope(300, t.env1 || '#E9D5B5', t.env2 || '#DCC29A')}</div>`}</div>
        <div><div style="font:600 80px/1 Fraunces;color:${t.acc}">${i + 1}</div><div style="font:600 40px/1.1 Fraunces;margin-top:8px">${esc(s.h)}</div><div style="font:500 27px/1.3 Karla;color:${t.mut};margin-top:10px">${esc(s.p)}</div></div></div>`).join('')}</div>${foot(p.cta, t)}`;
  },
  envelope(p, t) {
    const top = p.top || 470;
    return `${head(p.kick, p.h, hfs(p.h))}<div style="position:absolute;left:50%;top:${top}px;transform:translateX(-50%)">
        <div style="position:absolute;left:90px;top:-150px">${postcard(p.id, 640, 5, 'padding:10px')}</div>
        <div style="position:relative">${envelope(820, t.env1 || '#E9D5B5', t.env2 || '#DCC29A')}</div></div>
      ${cap(p.cap, top + 560, 54)}${foot(p.cta, t)}`;
  },
  // два кадра: открытка туда, открытка обратно
  pair(p, t) {
    return `${head(p.kick, p.h, hfs(p.h))}
      <div style="position:absolute;left:70px;top:${p.top || 380}px">${postcard(p.a, 560, -4)}</div>
      <div class="hand" style="position:absolute;right:80px;top:${(p.top || 380) + 120}px;font-size:46px;width:300px;text-align:center">${esc(p.capA)}</div>
      <div style="position:absolute;right:70px;top:${(p.top || 380) + 420}px">${postcard(p.b, 560, 3)}</div>
      <div class="hand" style="position:absolute;left:80px;top:${(p.top || 380) + 560}px;font-size:46px;width:300px;text-align:center">${esc(p.capB)}</div>${foot(p.cta, t)}`;
  },
};

const PINS = [];
let n = 1671;
for (const [grp, camp, link, want] of [['wl', 'wobbleland', '/wobbleland/', 10], ['pc', 'postcards2', '/postcards/', 10], ['tools', 'tools', '/', 10], ['games', 'games', '/games/', 10], ['themes', 'themes', '/prompts/', 10]]) {
  const list = D[grp]; if (list.length !== want) throw new Error(`${grp}: ${list.length} вместо ${want}`);
  for (const p of list) {
    const t = TH[p.th || 'cream'];
    if (!T[p.type]) throw new Error('нет шаблона ' + p.type);
    if (!p.title || p.title.length > 100) throw new Error(`pin ${n}: заголовок ${p.title && p.title.length}`);
    PINS.push({ n, t, p, html: () => T[p.type](p, t), link: L(p.link || link, n, camp), title: p.title, desc: p.desc, alt: p.alt, topics: p.topics || D.TOP[grp], tpl: p.tpl, season: p.season || 'Круглый год', grp });
    n++;
  }
}
const dup = PINS.map(p => p.title).filter((x, i, a) => a.indexOf(x) !== i); if (dup.length) throw new Error('повтор заголовков: ' + dup);
const old = new Set(fs.readdirSync(__dirname).filter(f => f.endsWith('.json') && f !== 'site5.json').flatMap(f => (fs.readFileSync(path.join(__dirname, f), 'utf8').match(/"title": *"[^"]*"/g) || []).map(s => s.split('"')[3])));
const rep = PINS.filter(p => old.has(p.title)).map(p => p.n); if (rep.length) throw new Error('заголовок уже был: ' + rep);

(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_s5.html');
  const only = process.argv.slice(2).map(Number);
  const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap">';
  for (const p of PINS) {
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${CSSf(p.t)}</style></head><body>${p.html()}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => { const ft = document.querySelector('.ft').getBoundingClientRect().top; return Math.max(...[...document.querySelectorAll('body > *:not(.ft)')].map(e => e.getBoundingClientRect().bottom)) - ft; });
    if (over > 4) console.log('⚠ pin', p.n, 'наезжает на подвал на', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 85 });
  }
  fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, 'site5.json'), JSON.stringify(PINS.map(({ html, t, p, ...x }) => x), null, 1));
  await b.close();
})();
