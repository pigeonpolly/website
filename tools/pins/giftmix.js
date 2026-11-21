// Пины №1611–1670 (Алина 21.11.2026): 1611–1640 — «Отправить подарок» (/postcards/, utm_campaign=gifts),
// 1641–1670 — «Смешивание цветов» и пигменты (/color-mixing/, utm_campaign=mixing). Плюс картинки постов Facebook EN
// для смешивания: site/images/fb/mix-<N>.jpg (1080×1350). Данные — tools/pins/giftmix-data.js.
// Кадры открыток: python3 -m http.server 8799 --directory site & node tools/pins/giftmix_shots.js → tools/pins/gm/ (не в git).
// Рецепты считает тот же код, что на странице (site/assets/mixing.js, solve) — пин совпадает с сайтом.
// node tools/pins/giftmix.js [номер…] → site/images/pins/pin-NNN.jpg, site/images/fb/mix-*.jpg + tools/pins/giftmix.json (тексты для Notion).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const M = require('../../site/assets/mixing.js');
const PALS = Object.fromEntries(require('../../content/palettes.json').map(p => [p.key, p]));
const SRC = fs.readFileSync(path.join(ROOT, 'site/assets/mixing.js'), 'utf8');
const PINFO = eval('(' + SRC.slice(SRC.indexOf('const PINFO = {') + 14, SRC.indexOf('const PT = {')).trim().replace(/;$/, '') + ')');
const U = k => 'file://' + path.join(ROOT, k.startsWith('gm/') ? 'tools/pins/' + k : 'site/images/' + k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const plain = s => s.replace(/<\/?em>/g, '');
const A = k => { if (!PALS[k]) throw new Error('нет палитры ' + k); return PALS[k].img.replace('images/', ''); };
const col = (k, name) => { const c = PALS[k].colors.find(c => c.en === name); if (!c) throw new Error(`нет цвета ${name} в ${k}`); return c; };
const art = k => PALS[k].title.en;

// ——— пигменты: короткие имена для пинов ———
const PN = { lemon: 'Lemon yellow', hansa: 'Warm yellow', ochre: 'Yellow ochre', scarlet: 'Scarlet red', pyrrol: 'Pyrrole red', qrose: 'Quinacridone rose', qmag: 'Quinacridone magenta',
  aliz: 'Alizarin crimson', viol: 'Dioxazine violet', ultra: 'Ultramarine blue', phthalo: 'Phthalo blue', cerul: 'Cerulean blue', pgreen: 'Phthalo green', bsienna: 'Burnt sienna', bumber: 'Burnt umber', black: 'Black' };
const MED = { watercolor: 'watercolor', gouache: 'gouache', acrylic: 'acrylic' };
const frac = n => { const w = Math.floor(n), f = n - w, s = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[f] || ''; return (w ? w : '') + s || '0'; };
const amt = (n, water) => n === 0.25 ? (water ? 'just the tip of the brush' : 'a tiny dot') : `${frac(n)} ${water ? (n > 1 ? 'brushes' : 'brush') : (n > 1 ? 'peas' : 'pea')}`;
const solved = {};
function recipe(hex, medium, k = 0) {
  const key = hex + medium;
  if (!solved[key]) solved[key] = M.solve(hex, M.MEDIA[medium].on, !!M.MEDIA[medium].water);
  const r = solved[key].recipes[k]; if (!r) throw new Error('нет рецепта ' + key);
  const water = medium === 'watercolor', paint = r.items.reduce((a, it) => a + it[1], 0);
  const wb = water ? Math.max(0, Math.round(paint * (1 / Math.max(r.d, 0.03) - 1) * 2) / 2) : 0;
  const rows = r.items.map(it => ({ hex: it[0].m, name: PN[it[0].id], ci: it[0].ci, n: it[1], txt: amt(it[1], water) }));
  if (r.white) rows.push({ hex: '#F6F6F2', name: 'Titanium white', ci: 'PW6', n: r.white, txt: amt(r.white, false) });
  if (water) rows.push({ hex: null, name: 'Water', txt: wb >= 0.5 ? `about ${wb} ${wb > 1 ? 'brushes' : 'brush'}` : 'just wet the brush' });
  return { rows, hex: r.hex, e: r.e, water, short: rows.filter(x => x.hex).map(x => `${x.txt} ${x.name.toLowerCase()}`).join(' + ') + (water ? ` + ${wb >= 0.5 ? 'water' : 'a damp brush'}` : '') };
}
const mixLink = (medium, hex) => `/color-mixing/?m=${medium}&c=${hex.slice(1)}`;
const L = (p, n, camp, src = 'pinterest') => { const [a, h] = p.split('#'); const q = a.includes('?') ? '&' : '?'; return `${SITE}${a}${q}utm_source=${src}&utm_campaign=${camp}&utm_content=${src === 'pinterest' ? 'pin' : 'post'}-${n}${h ? '#' + h : ''}`; };

const CSSf = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${t.W || 1000}px;height:${t.H || 1500}px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
h1{font:600 74px/1.03 Fraunces;letter-spacing:-.02em}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.kick{font:700 22px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc}}
.hand{font:700 46px/1.05 Caveat;color:${t.acc}}
.ft{position:absolute;left:44px;right:44px;bottom:30px;height:110px;display:flex;align-items:center;gap:18px}
.ft .lg{width:104px;height:104px}
.ft .ad{font:600 30px Fraunces}
.ft .cta{margin-left:auto;background:${t.btn || t.acc};color:${t.btnFg || '#fff'};font:700 25px Karla;padding:16px 26px;border-radius:40px}
.fr{border-radius:14px;overflow:hidden;box-shadow:0 18px 40px rgba(30,20,10,.18);background:#fff}
.pc{background:#fff;padding:16px;border-radius:6px;box-shadow:0 22px 48px rgba(30,20,10,.25)}
.pc img{display:block;width:100%;border-radius:2px}
.sw{border-radius:50%;flex:none;box-shadow:inset 0 0 0 2px rgba(0,0,0,.08)}
`;
const foot = (cta, t) => `<div class="ft"><img class="lg" src="${U(`logo/v3/pigeon-polly-${t.logo}-transparent-4000.png`)}"><div class="ad">pigeonpolly.com</div><div class="cta">${esc(cta)} →</div></div>`;
const img = (k, W, H, pos = '50% 50%') => `<img src="${U(k)}" style="width:${W}px;height:${H}px;object-fit:cover;object-position:${pos};display:block">`;
const head = (kick, h, right = 56, top = 58, fs = 74) => `<div style="position:absolute;left:56px;top:${top}px;right:${right}px"><div class="kick">${kick}</div><h1 style="margin-top:18px;font-size:${fs}px">${h}</h1></div>`;
const PC = id => `gm/pc-${id}.png`;
const postcard = (id, w, rot = -2, extra = '') => `<div class="pc" style="width:${w}px;transform:rotate(${rot}deg);${extra}"><img src="${U(PC(id))}"></div>`;
const envelope = (w, c1, c2) => `<div style="position:relative;width:${w}px;height:${w * .62}px"><div style="position:absolute;inset:0;background:${c1};border-radius:10px;box-shadow:0 18px 40px rgba(30,20,10,.22)"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:100%;clip-path:polygon(0 0,50% 58%,100% 0,100% 100%,0 100%);background:${c2};border-radius:10px"></div>
  <div style="position:absolute;left:50%;top:52%;width:${w * .14}px;height:${w * .14}px;margin:-${w * .07}px;border-radius:50%;background:#B3262E;box-shadow:0 3px 8px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:#FCE7C8;font:700 ${w * .07}px Fraunces">P</div></div>`;

// ——— шаблоны «Отправить подарок» ———
const G = {
  pc(p, t, n) {
    return { tpl: 'Арт', html: () => `${head(p.kick || 'animated postcard · free', p.h)}
      <div style="position:absolute;left:0;right:0;top:${p.top || 400}px;display:flex;justify-content:center">${postcard(p.id, 860, p.rot ?? -2)}</div>
      <div class="hand" style="position:absolute;left:60px;right:60px;top:${(p.top || 400) + 650}px;text-align:center;font-size:58px">${esc(p.cap)}</div>
      <div style="position:absolute;left:0;right:0;top:${(p.top || 400) + 800}px;display:flex;justify-content:center;gap:14px">${['✦ it moves', '✉ by email', '♥ free', '🕵 or anonymous'].map(s => `<span style="background:${t.card};border-radius:30px;padding:10px 20px;font:700 23px Karla">${s}</span>`).join('')}</div>
      ${foot(p.cta || 'Send it free', t)}` };
  },
  grid(p, t, n) {
    const ids = p.ids, c = ids.length > 6 ? 3 : 2, w = c === 3 ? 270 : 420;
    return { tpl: 'Серия', html: () => `${head(p.kick || 'pick one · send it free', p.h)}
      <div style="position:absolute;left:50%;transform:translateX(-50%);top:${p.top || 380}px;display:grid;grid-template-columns:repeat(${c},${w}px);gap:${c === 3 ? 26 : 34}px">
      ${ids.map((id, i) => postcard(id, w, [-2, 1.5, -1, 2, -1.5, 1][i % 6], 'padding:8px')).join('')}</div>
      ${foot(p.cta || 'Send a postcard', t)}` };
  },
  steps(p, t, n) {
    const S = p.steps;
    return { tpl: 'Процесс', html: () => `${head(p.kick || 'how it works', p.h)}
      <div style="position:absolute;left:56px;right:56px;top:340px;display:flex;flex-direction:column;gap:34px">
      ${S.map((s, i) => `<div style="display:flex;gap:30px;align-items:center">
        <div style="flex:none;width:330px">${s.id ? postcard(s.id, 330, [-2, 2, -1][i], 'padding:8px') : `<div style="display:flex;justify-content:center">${envelope(300, t.env1 || '#E9D5B5', t.env2 || '#DCC29A')}</div>`}</div>
        <div><div style="font:600 80px/1 Fraunces;color:${t.acc}">${i + 1}</div><div style="font:600 40px/1.1 Fraunces;margin-top:8px">${esc(s.h)}</div><div style="font:500 27px/1.3 Karla;color:${t.mut};margin-top:10px">${esc(s.p)}</div></div></div>`).join('')}</div>
      ${foot(p.cta || 'Try it', t)}` };
  },
  list(p, t, n) {
    const items = p.items, two = items.length > 12, fs = two ? 27 : 33;
    return { tpl: 'Темы', html: () => `<div style="position:absolute;right:50px;top:60px">${postcard(p.id, 300, 4, 'padding:8px')}</div>
      <div style="position:absolute;left:56px;right:56px;top:58px;bottom:180px;display:flex;flex-direction:column">
      <div style="margin-right:340px"><div class="kick">${p.kick}</div><h1 style="margin-top:18px;font-size:${plain(p.h).length > 40 ? 60 : 68}px">${p.h}</h1></div>
      <div style="flex:1;margin-top:30px;display:grid;align-content:space-evenly;${two ? `grid-template-columns:1fr 1fr;grid-auto-flow:column;grid-template-rows:repeat(${Math.ceil(items.length / 2)},auto);column-gap:30px` : ''}">
      ${items.map((s, i) => `<div style="display:flex;gap:12px;align-items:baseline;font:500 ${fs}px/1.2 Karla"><b style="font:600 ${fs}px Fraunces;color:${t.acc};min-width:42px">${p.bullets ? '♥' : i + 1}</b><span>${esc(s)}</span></div>`).join('')}</div></div>
      ${foot(p.cta || 'Send a postcard', t)}` };
  },
  pov(p, t, n) {
    const im = p.id ? postcard(p.id, 880, -1.5) : `<div class="fr" style="transform:rotate(-1.5deg)">${img(A(p.key), 880, 640, p.pos)}</div>`;
    return { tpl: 'Мем', html: () => `${head(p.kick || 'pov', p.h, 56, 58, plain(p.h).length > 60 ? 62 : 70)}
      <div style="position:absolute;left:0;right:0;top:${p.top || 430}px;display:flex;justify-content:center">${im}</div>
      <div class="hand" style="position:absolute;left:56px;right:56px;top:${(p.top || 430) + (p.id ? 650 : 680)}px;text-align:center;font-size:54px">${esc(p.cap)}</div>
      ${foot(p.cta || 'Send a postcard', t)}` };
  },
  envelope(p, t, n) {
    return { tpl: 'Арт', html: () => `${head(p.kick || 'it arrives like this', p.h)}
      <div style="position:absolute;left:50%;top:${p.top || 460}px;transform:translateX(-50%)">
        <div style="position:absolute;left:90px;top:-150px">${postcard(p.id, 640, 5, 'padding:10px')}</div>
        <div style="position:relative">${envelope(820, t.env1 || '#E9D5B5', t.env2 || '#DCC29A')}</div></div>
      <div class="hand" style="position:absolute;left:56px;right:56px;top:${(p.top || 460) + 560}px;text-align:center;font-size:56px">${esc(p.cap)}</div>
      ${foot(p.cta || 'Send one', t)}` };
  },
  art(p, t, n) {
    return { tpl: 'Арт', html: () => `${head(p.kick, p.h)}
      <div class="fr" style="position:absolute;left:56px;right:56px;top:${p.top || 380}px">${img(A(p.key), 888, p.ih || 700, p.pos)}</div>
      <div class="hand" style="position:absolute;left:56px;right:56px;top:${(p.top || 380) + (p.ih || 700) + 40}px;text-align:center;font-size:54px">${esc(p.cap)}</div>
      ${foot(p.cta || 'Send a postcard', t)}` };
  },
};

// ——— блоки смешивания (общие для пинов и картинок Facebook) ———
const recipeRows = (R, fs = 30, sw = 64) => R.rows.map(r => `<div style="display:flex;gap:20px;align-items:center">
  ${r.hex ? `<div class="sw" style="width:${sw}px;height:${sw}px;background:${r.hex}"></div>` : `<div class="sw" style="width:${sw}px;height:${sw}px;background:radial-gradient(circle at 35% 35%,#E8F3FA,#A9CBE0)"></div>`}
  <div><div style="font:600 ${fs}px/1.1 Fraunces">${esc(r.txt)}</div><div style="font:500 ${fs * .72}px Karla;opacity:.7;margin-top:4px">${esc(r.name)}${r.ci ? ' · ' + r.ci : ''}</div></div></div>`).join('');
const compare = (want, got, w, h = 120) => `<div style="display:flex;width:${w}px;height:${h}px;border-radius:14px;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.12)">
  <div style="flex:1;background:${want};display:flex;align-items:flex-end;padding:12px 16px;font:700 20px Karla;color:${M.labOfHex(want)[0] > .62 ? '#2A2420' : '#fff'}">you want · ${want}</div>
  <div style="flex:1;background:${got};display:flex;align-items:flex-end;justify-content:flex-end;padding:12px 16px;font:700 20px Karla;color:${M.labOfHex(got)[0] > .62 ? '#2A2420' : '#fff'}">you get · ${got}</div></div>`;
const swatch = (id, w, h) => { const p = M.PIG.find(x => x.id === id); return `<div style="display:flex;width:${w}px;height:${h}px;border-radius:16px;overflow:hidden;box-shadow:0 12px 28px rgba(0,0,0,.15)"><div style="flex:1;background:${p.m}"></div><div style="flex:1;background:${p.t}"></div></div>`; };
const TR = { T: 'transparent', ST: 'semi-transparent', SO: 'semi-opaque', O: 'opaque' }, ST = ['washes off', 'stains a little', 'stains paper'], TS = [null, 'weak', 'medium strength', 'very strong'];
const chips = (id, t) => { const f = PINFO[id]; return [TR[f.tr], TS[f.ts], ST[f.st], f.gr ? 'granulates' : null, 'lightfast ' + f.lf].filter(Boolean).map(s => `<span style="display:inline-block;background:${t.card};border-radius:30px;padding:9px 18px;margin:0 10px 10px 0;font:700 22px Karla">${esc(s)}</span>`).join(''); };
const mixCell = (a, b, medium) => medium === 'watercolor' ? M.mixHex([[M.P[a], 1], [M.P[b], 1]], 0, 0.55, true) : M.mixHex([[M.P[a], 1], [M.P[b], 1]], 1, 1, false);

const X = {
  recipe(p, t, n) {
    const c = col(p.key, p.color), R = recipe(c.hex, p.m, p.k || 0);
    p._r = R; p._c = c;
    return { tpl: 'Процесс', link: mixLink(p.m, c.hex),
      html: () => `<div class="fr" style="position:absolute;left:0;right:0;top:0;border-radius:0">${img(A(p.key), 1000, 600, p.pos)}</div>
      <div style="position:absolute;left:56px;top:530px;width:150px;height:150px;border-radius:50%;background:${c.hex};box-shadow:0 0 0 10px ${t.bg},0 14px 30px rgba(0,0,0,.2)"></div>
      <div style="position:absolute;left:56px;right:56px;top:705px"><div class="kick">${MED[p.m]} · mixing recipe</div>
      <h1 style="margin-top:14px;font-size:66px">${p.h || `How to mix <em>${esc(c.en.toLowerCase())}</em>`}</h1></div>
      <div style="position:absolute;left:56px;right:56px;top:${plain(p.h || 'How to mix ' + c.en).length > 24 ? 950 : 880}px;display:flex;flex-direction:column;gap:20px">${recipeRows(R, 32, 66)}</div>
      <div style="position:absolute;left:56px;bottom:170px">${compare(c.hex, R.hex, 888)}</div>
      ${foot('Mix any colour', t)}` };
  },
  pigment(p, t, n) {
    const P = M.PIG.find(x => x.id === p.id), f = PINFO[p.id];
    return { tpl: 'Процесс', link: '/color-mixing/',
      html: () => `<div class="fr" style="position:absolute;right:56px;top:58px;transform:rotate(3deg)">${img(A(p.key), 300, 300, p.pos)}</div>
      ${head(`pigment · ${P.ci}`, p.h || esc(PN[p.id]), 400)}
      <div style="position:absolute;left:56px;top:400px">${swatch(p.id, 888, 260)}</div>
      <div style="position:absolute;left:56px;right:56px;top:672px;display:flex;justify-content:space-between;font:700 20px Karla;opacity:.65"><span>straight from the tube</span><span>mixed 1 : 3 with white</span></div>
      <div style="position:absolute;left:56px;right:56px;top:740px">${chips(p.id, t)}</div>
      <div style="position:absolute;left:56px;right:56px;top:${p.top || 900}px;font:500 36px/1.42 Karla">${esc(p.txt || f.d[0])}</div>
      ${foot('Meet all 16 pigments', t)}` };
  },
  chart(p, t, n) {
    const rows = p.rows, cols = p.cols, cw = Math.floor(700 / cols.length);
    return { tpl: 'Палитра', link: '/color-mixing/',
      html: () => `${head(`${MED[p.m]} · mixing chart`, p.h)}
      <div style="position:absolute;left:56px;top:${p.top || 360}px;display:grid;grid-template-columns:180px repeat(${cols.length},${cw}px);gap:10px;align-items:center">
        <div></div>${cols.map(b => `<div style="text-align:center"><div class="sw" style="width:${cw * .6}px;height:${cw * .6}px;margin:0 auto;background:${M.P[b].m}"></div><div style="font:700 19px/1.1 Karla;margin-top:8px">${esc(PN[b])}</div></div>`).join('')}
        ${rows.map(a => `<div style="display:flex;gap:10px;align-items:center"><div class="sw" style="width:56px;height:56px;background:${M.P[a].m}"></div><div style="font:700 19px/1.1 Karla">${esc(PN[a])}</div></div>${cols.map(b => `<div style="height:${Math.min(cw, 170)}px;border-radius:12px;background:${mixCell(a, b, p.m)}"></div>`).join('')}`).join('')}
      </div>
      <div class="hand" style="position:absolute;left:56px;right:56px;bottom:170px;text-align:center;font-size:48px">${esc(p.cap)}</div>
      ${foot('Try the mixer', t)}` };
  },
  ladder(p, t, n) {
    // одна пара красок, шаги пропорций: a:b от 4:0 до 0:4
    const [a, b] = p.pair, steps = [[4, 0], [3, 1], [2, 2], [1, 3], [0, 4]].map(([x, y]) => ({ x, y, hex: p.m === 'watercolor' ? M.mixHex([[M.P[a], x], [M.P[b], y]].filter(i => i[1]), 0, p.d || 0.45, true) : M.mixHex([[M.P[a], x], [M.P[b], y]].filter(i => i[1]), p.white || 0, 1, false) }));
    return { tpl: 'Палитра', link: '/color-mixing/',
      html: () => `<div class="fr" style="position:absolute;right:56px;top:58px;transform:rotate(3deg)">${img(A(p.key), 260, 260, p.pos)}</div>
      ${head(`${MED[p.m]} · two paints`, p.h, 350)}
      <div style="position:absolute;left:56px;right:56px;top:420px;display:flex;flex-direction:column;gap:16px">
      ${steps.map(s => `<div style="display:flex;align-items:center;gap:24px"><div style="width:600px;height:118px;border-radius:14px;background:${s.hex}"></div><div style="font:600 28px/1.15 Fraunces">${s.x} ${esc(PN[a].split(' ')[0].toLowerCase())}<br>${s.y} ${esc(PN[b].split(' ')[0].toLowerCase())}</div></div>`).join('')}</div>
      <div class="hand" style="position:absolute;left:56px;right:56px;bottom:165px;text-align:center;font-size:46px">${esc(p.cap)}</div>
      ${foot('Try the mixer', t)}` };
  },
  five(p, t, n) {
    const P = PALS[p.key], cs = P.colors.slice(0, 6).map(c => ({ c, R: recipe(c.hex, p.m) }));
    p._cs = cs;
    return { tpl: 'Палитра', link: `/palettes/#${p.key}`,
      html: () => `${head(`${MED[p.m]} · palette recipes`, p.h)}
      <div class="fr" style="position:absolute;left:56px;right:56px;top:330px">${img(A(p.key), 888, 400, p.pos)}</div>
      <div style="position:absolute;left:56px;right:56px;top:770px;display:flex;flex-direction:column;gap:14px">
      ${cs.map(({ c, R }) => `<div style="display:flex;gap:18px;align-items:center"><div class="sw" style="width:66px;height:66px;background:${c.hex}"></div><div style="flex:1"><div style="font:600 25px Fraunces">${esc(c.en)} <span style="font:700 19px Karla;opacity:.6">${c.hex}</span></div><div style="font:500 21px/1.2 Karla;opacity:.85">${esc(R.short)}</div></div></div>`).join('')}</div>
      ${foot('Mix your own', t)}` };
  },
  rule(p, t, n) {
    const L2 = (it, w) => M.mixHex(it.map(([id, x]) => [M.P[id], x]), w || 0, 1, false);
    const [A1, B1] = p.cmp;
    return { tpl: 'Процесс', link: '/color-mixing/',
      html: () => `${head('mixing rule', p.h)}
      <div class="fr" style="position:absolute;left:56px;right:56px;top:${p.top || 400}px">${img(A(p.key), 888, 420, p.pos)}</div>
      <div style="position:absolute;left:56px;right:56px;top:${(p.top || 400) + 460}px;display:grid;grid-template-columns:1fr 1fr;gap:26px">
      ${[A1, B1].map((s, i) => `<div><div style="height:180px;border-radius:14px;background:${L2(s.items, s.white)}"></div><div style="font:600 27px/1.15 Fraunces;margin-top:12px">${i ? '✓' : '✗'} ${esc(s.label)}</div></div>`).join('')}</div>
      ${foot('More rules', t)}` };
  },
};

// ——— картинки постов Facebook EN (1080×1350) — смешивание ———
const FB = {
  recipe(p, t) {
    const c = col(p.key, p.color), R = recipe(c.hex, p.m, p.k || 0); p._r = R; p._c = c;
    return `<div style="position:absolute;left:0;right:0;top:0">${img(A(p.key), 1080, 600, p.pos)}</div>
      <div style="position:absolute;right:60px;top:530px;width:150px;height:150px;border-radius:50%;background:${c.hex};box-shadow:0 0 0 10px ${t.bg},0 14px 30px rgba(0,0,0,.2)"></div>
      <div style="position:absolute;left:60px;top:640px"><div class="kick">${MED[p.m]} · how to mix</div><div style="font:600 58px/1.05 Fraunces;margin-top:12px">${esc(c.en)} <span style="font:700 26px Karla;opacity:.6">${c.hex}</span></div></div>
      <div style="position:absolute;left:60px;right:60px;top:800px;display:flex;flex-direction:column;gap:16px">${recipeRows(R, 28, 58)}</div>
      <div style="position:absolute;left:60px;bottom:50px">${compare(c.hex, R.hex, 960, 90)}</div>`;
  },
  pigment(p, t) {
    const P = M.PIG.find(x => x.id === p.id);
    return `<div style="position:absolute;left:0;right:0;top:0">${img(A(p.key), 1080, 560, p.pos)}</div>
      <div style="position:absolute;left:60px;top:610px"><div class="kick">pigment · ${P.ci}</div><div style="font:600 62px/1.05 Fraunces;margin-top:12px">${esc(PN[p.id])}</div></div>
      <div style="position:absolute;left:60px;top:790px">${swatch(p.id, 960, 190)}</div>
      <div style="position:absolute;left:60px;right:60px;top:1010px;display:flex;justify-content:space-between;font:700 20px Karla;opacity:.65"><span>from the tube</span><span>1 : 3 with white</span></div>
      <div style="position:absolute;left:60px;right:60px;top:1070px">${chips(p.id, t)}</div>`;
  },
  chart(p, t) {
    const rows = p.rows, cols = p.cols, cw = Math.floor(760 / cols.length);
    return `<div style="position:absolute;left:60px;right:60px;top:60px"><div class="kick">${MED[p.m]} · mixing chart</div><div style="font:600 62px/1.05 Fraunces;margin-top:12px">${p.fbh}</div></div>
      <div style="position:absolute;left:60px;top:300px;display:grid;grid-template-columns:190px repeat(${cols.length},${cw}px);gap:10px;align-items:center">
        <div></div>${cols.map(b => `<div style="text-align:center"><div class="sw" style="width:60px;height:60px;margin:0 auto;background:${M.P[b].m}"></div><div style="font:700 19px/1.1 Karla;margin-top:8px">${esc(PN[b])}</div></div>`).join('')}
        ${rows.map(a => `<div style="display:flex;gap:10px;align-items:center"><div class="sw" style="width:56px;height:56px;background:${M.P[a].m}"></div><div style="font:700 19px/1.1 Karla">${esc(PN[a])}</div></div>${cols.map(b => `<div style="height:${Math.min(cw, 190)}px;border-radius:12px;background:${mixCell(a, b, p.m)}"></div>`).join('')}`).join('')}
      </div>
      <div style="position:absolute;right:60px;bottom:60px;font:600 30px Fraunces;opacity:.7">pigeonpolly.com</div>`;
  },
  five(p, t) {
    const cs = PALS[p.key].colors.slice(0, 6).map(c => ({ c, R: recipe(c.hex, p.m) }));
    return `<div style="position:absolute;left:0;right:0;top:0">${img(A(p.key), 1080, 560, p.pos)}</div>
      <div style="position:absolute;left:60px;top:600px"><div class="kick">${MED[p.m]} · every colour of this painting</div></div>
      <div style="position:absolute;left:60px;right:60px;top:660px;display:flex;flex-direction:column;gap:16px">
      ${cs.map(({ c, R }) => `<div style="display:flex;gap:18px;align-items:center"><div class="sw" style="width:70px;height:70px;background:${c.hex}"></div><div style="flex:1"><div style="font:600 27px Fraunces">${esc(c.en)} <span style="font:700 20px Karla;opacity:.6">${c.hex}</span></div><div style="font:500 22px/1.2 Karla;opacity:.85">${esc(R.short)}</div></div></div>`).join('')}</div>`;
  },
};

const D = require('./giftmix-data.js');
const PINS = [];
let n = 1611;
for (const p of D.gifts) { const t = D.TH[p.th || 'cream'], o = G[p.type](p, t, n); PINS.push({ n, t, ...o, link: L(p.link || '/postcards/', n, 'gifts'), p }); n++; }
if (n !== 1641) throw new Error('подарки: ожидалось 30, вышло ' + (n - 1611));
for (const p of D.mix) { const t = D.TH[p.th || 'paper'], o = X[p.type](p, t, n); PINS.push({ n, t, ...o, link: L(o.link, n, 'mixing'), p }); n++; }
if (n !== 1671) throw new Error('смешивание: ожидалось 30, вышло ' + (n - 1641));
for (const P of PINS) {
  const tx = D.text(P.p, P.n, { recipe, PINFO, PN, col, art, M });
  Object.assign(P, tx);
  if (!P.title || P.title.length > 100) throw new Error(`pin ${P.n}: заголовок ${P.title && P.title.length}`);
}
const dup = PINS.map(p => p.title).filter((x, i, a) => a.indexOf(x) !== i); if (dup.length) throw new Error('повтор заголовков: ' + dup);

(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_gm.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
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
  // картинки Facebook для постов о смешивании
  const fp = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const f of D.fbImages) {
    if (only.length) break;
    const t = { ...D.TH[f.th || 'paper'], W: 1080, H: 1350 };
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${CSSf(t)}</style></head><body>${FB[f.type](f, t)}</body></html>`);
    await fp.goto('file://' + tmp, { waitUntil: 'networkidle' }); await fp.evaluate(() => document.fonts.ready);
    await fp.screenshot({ path: path.join(ROOT, `site/images/fb/${f.file}.jpg`), type: 'jpeg', quality: 86 });
    f._r && (f.recipe = f._r.short);
  }
  fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, 'giftmix.json'), JSON.stringify({ pins: PINS.map(({ html, t, p, ...x }) => x), fb: D.fbImages.map(({ _r, _c, ...f }) => f) }, null, 1));
  await b.close();
})();
