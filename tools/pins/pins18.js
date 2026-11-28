// Пины №1731–1780 (SET=18): копия движка pins17.js, но арт не обрезается (Алина 28.11): рамка по пропорциям арта.
// node tools/pins/pins18.js [номер…] → site/images/pins/pin-NNN.jpg + tools/pins/pins18.json. Заготовки: SET=18 python3 tools/pins/pins16_prep.py diff; python3 tools/pins/pins17_pal.py.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const PINS = require('./pins18-data.js');
const U = k => 'file://' + (/^p1[67]\//.test(k) ? path.join(__dirname, k) : path.join(ROOT, 'site', k.startsWith('images/') ? k : 'images/' + k));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// тема v2 + значок v3: кольцо значка подобрано к акценту пина (синий акцент → autumn, красный → winter, голубой → summer, мятный → spring, сливовый → purple)
const TH = {
  cream: { bg: '#F4F0EA', fg: '#2A211C', acc: '#22405F', acc2: '#93AFCC', mut: '#6C6058', card: '#FBF9F5', logo: 'color-autumn' },
  paper: { bg: '#FBF9F5', fg: '#2A211C', acc: '#22405F', acc2: '#93AFCC', mut: '#6C6058', card: '#F4F0EA', logo: 'color-autumn' },
  clay: { bg: '#F1E7DC', fg: '#2E2521', acc: '#9E1B22', acc2: '#C27A4E', mut: '#7A6658', card: '#FBF6F0', logo: 'color-winter' },
  dark: { bg: '#2E2521', fg: '#F1ECE4', acc: '#E9C46A', acc2: '#E2544A', mut: '#B9AEA4', card: '#3A302B', logo: 'color-winter' },
  night: { bg: '#1C2430', fg: '#F3EDE2', acc: '#93AFCC', acc2: '#E9C46A', mut: '#A3A8AC', card: '#26303A', logo: 'color-autumn' },
  sage: { bg: '#F1F4F0', fg: '#1F2A25', acc: '#BE2F3A', acc2: '#6F8A5E', mut: '#5E6A63', card: '#FAFBF9', logo: 'color-spring' },
  blush: { bg: '#F7EEE8', fg: '#2A2420', acc: '#6B4C8A', acc2: '#E85C64', mut: '#6D635B', card: '#FFFDFA', logo: 'color-purple' },
  wash: { bg: '#F7F4EE', fg: '#2A2420', acc: '#1F7FAE', acc2: '#7CC6E6', mut: '#6D635B', card: '#FFFDFA', logo: 'color-summer' },
  // адвент — цвета страницы /advent/: ночное небо, хвоя, вино, золото
  adv: { bg: '#16213A', fg: '#F6F0E4', acc: '#E9C46A', acc2: '#B3222C', mut: '#A9B2C4', card: '#22304F', logo: 'color-winter' },
  pine: { bg: '#14281F', fg: '#F6F0E4', acc: '#E9C46A', acc2: '#B3222C', mut: '#A8B8AC', card: '#1E3A2D', logo: 'color-winter' },
  wine: { bg: '#3A1418', fg: '#F6F0E4', acc: '#E9C46A', acc2: '#7FB49A', mut: '#C9AFAF', card: '#4C1D22', logo: 'color-autumn' },
};
const LOGO = v => U(`images/logo/v3/pigeon-polly-${v}-transparent-4000.png`);
const img = (k, W, H, pos = '50% 50%', fit = 'cover', st = '') => `<img src="${U(k)}" style="width:${W}px;height:${H}px;object-fit:${fit};object-position:${pos};display:block;${st}">`;
const fit = (ar, W, H) => ar > W / H ? [W, Math.round(W / ar)] : [Math.round(H * ar), H];
const head = (p, t, pill, size) => { const [w, h] = fit(p.ar, 520, 340); return `<div class="fr" style="position:absolute;left:44px;top:50px;width:${w}px;height:${h}px">${img(p.art, w, h)}</div>
    <div style="position:absolute;left:${44 + w + 34}px;right:44px;top:50px;height:${h}px;display:flex;flex-direction:column;justify-content:center"><span class="pill" style="align-self:flex-start">${esc(pill)}</span><h1 style="margin-top:16px;font-size:${size(w)}px">${p.t}</h1></div>`; };
const lum = c => parseInt(c.slice(1, 3), 16) * .3 + parseInt(c.slice(3, 5), 16) * .59 + parseInt(c.slice(5, 7), 16) * .11;
const ink = c => lum(c) > 150 ? '#2A211C' : '#fff';
const foot = (t, cta) => `<div class="ft"><img class="lg" src="${LOGO(t.logo)}"><div class="ad">pigeonpolly.com</div>${cta ? `<div class="cta">${esc(cta)} →</div>` : ''}</div>`;
const CSS = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.fg};font-family:Karla,sans-serif;position:relative}
h1{font:600 74px/1.02 Fraunces;letter-spacing:-.02em;color:${t.fg}}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.pill{display:inline-block;background:${t.fg};color:${t.bg};font:700 21px Karla;letter-spacing:.2em;text-transform:uppercase;padding:9px 20px;border-radius:40px}
.kick{font:700 22px Karla;letter-spacing:.24em;text-transform:uppercase;color:${t.acc}}
.ft{position:absolute;left:44px;right:44px;bottom:30px;height:110px;display:flex;align-items:center;gap:18px}
.ft .lg{width:104px;height:104px}
.ft .ad{font:600 30px Fraunces;color:${t.fg};letter-spacing:-.01em}
.ft .cta{margin-left:auto;background:${t.acc};color:${ink(t.acc)};font:700 25px Karla;padding:16px 24px;border-radius:40px;max-width:520px;text-align:center;line-height:1.15}
.fr{border-radius:10px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,${lum(t.bg) < 100 ? .5 : .18});background:#fff}
.hand{font:700 46px/1.05 Caveat;color:${t.acc}}
.blur{filter:blur(7px);opacity:.75}
.gift{position:relative;border-radius:10px;background:${t.acc2};overflow:hidden}
.gift:before{content:'';position:absolute;left:50%;top:0;bottom:0;width:12%;transform:translateX(-50%);background:${t.acc}}
.gift:after{content:'';position:absolute;top:50%;left:0;right:0;height:12%;transform:translateY(-50%);background:${t.acc}}
.gift b{position:absolute;left:8px;top:6px;z-index:2;font:600 22px Fraunces;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.4)}
.snow i{position:absolute;border-radius:50%;background:#fff}
/* окно адвента, как на /advent/: рама, иней, ставни, лента */
.aw{position:absolute;background:#F4EFE6;border-radius:50% 50% 14px 14px/34% 34% 14px 14px;padding:22px;box-shadow:0 30px 60px rgba(0,0,0,.45),0 0 0 8px #C9A227}
.aw .gl{position:relative;width:100%;height:100%;border-radius:50% 50% 6px 6px/34% 34% 6px 6px;overflow:hidden;background:radial-gradient(circle at 50% 30%,#6E86AA,#3B5073 70%)}
.aw .gl:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.08) 0 3px,transparent 3px 18px),radial-gradient(circle at 15% 85%,rgba(255,255,255,.55),transparent 30%),radial-gradient(circle at 85% 90%,rgba(255,255,255,.5),transparent 28%)}
.aw .bar{position:absolute;background:#F4EFE6;z-index:2}
.aw .rib{position:absolute;z-index:3;background:linear-gradient(90deg,#B3222C,#D63B44,#B3222C)}
.aw .num{position:absolute;left:50%;bottom:-46px;transform:translateX(-50%);z-index:4;background:#B3222C;color:#fff;font:600 54px/1 Fraunces;padding:12px 30px;border-radius:14px;box-shadow:0 0 0 5px #E9C46A}
`;
const snow = (k = 40, seed = 1) => { let s = seed * 9301 + 49297, r = () => ((s = (s * 9301 + 49297) % 233280) / 233280); return `<div class="snow" style="position:absolute;inset:0;pointer-events:none">${Array.from({ length: k }, () => { const z = 3 + r() * 7; return `<i style="left:${r() * 100}%;top:${r() * 100}%;width:${z}px;height:${z}px;opacity:${.25 + r() * .5}"></i>`; }).join('')}</div>`; };
const bow = (x, y, s = 1) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${120 * s}px;height:${80 * s}px;z-index:5" viewBox="0 0 120 80"><path d="M60 40 C30 0 0 10 10 40 C0 70 30 80 60 40Z" fill="#D63B44" stroke="#8E1820" stroke-width="3"/><path d="M60 40 C90 0 120 10 110 40 C120 70 90 80 60 40Z" fill="#D63B44" stroke="#8E1820" stroke-width="3"/><circle cx="60" cy="40" r="11" fill="#E9C46A"/></svg>`;
// большое окно адвента
const awin = (x, y, w, h, d, special) => `<div class="aw" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${special ? 'box-shadow:0 30px 60px rgba(0,0,0,.45),0 0 0 10px #E9C46A,0 0 60px 10px rgba(233,196,106,.55)' : ''}">
  <div class="gl"><div class="bar" style="left:calc(50% - 6px);top:0;bottom:0;width:12px"></div><div class="bar" style="top:52%;left:0;right:0;height:12px"></div>
  <div class="rib" style="left:calc(50% - 14px);top:0;bottom:0;width:28px"></div><div class="rib" style="top:calc(52% - 8px);left:0;right:0;height:28px"></div></div>
  ${bow(w / 2 - 70, h * .52 - 30, 1.2)}<div class="num">${d}</div></div>`;

const T = {
  plist: (p, t) => {
    const open = p.items, card = x => `<div style="background:${t.card};border-radius:12px;padding:14px 16px;box-shadow:inset 0 0 0 3px ${t.acc}"><b style="font:600 30px/1 Fraunces;color:${t.acc}">${x.d}</b>
      <div style="font:700 27px/1.1 Karla;margin-top:6px">${esc(x.s)}</div><div style="font:700 27px/1 Caveat;color:${t.mut};margin-top:6px">${esc(x.tw)} · ${x.t} min</div></div>`;
    const shut = Array.from({ length: 31 }, (_, i) => i + 1).filter(d => !open.some(x => x.d === d));
    return `<div style="position:absolute;left:0;top:0;width:1000px;height:400px">${img(p.art, 1000, 400, p.pos)}<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 40%,${t.bg})"></div></div>
    <div style="position:absolute;left:56px;right:56px;top:330px"><span class="pill">${esc(p.kick)}</span><h1 style="margin-top:18px;font-size:${p.t.length > 46 ? 60 : 68}px">${p.t}</h1></div>
    <div style="position:absolute;left:44px;right:44px;top:610px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px">${open.map(card).join('')}</div>
    <div style="position:absolute;left:44px;right:44px;top:990px;display:grid;grid-template-columns:repeat(9,1fr);gap:10px">${shut.slice(0, 27).map(d => `<div class="gift" style="height:80px"><b>${d}</b></div>`).join('')}</div>
    <div style="position:absolute;left:44px;right:44px;top:1290px;font:700 40px/1 Caveat;color:${t.acc};text-align:center">+ ${shut.length} more prompts are waiting on the site</div>
    ${foot(t, 'See all 31 prompts')}`;
  },
  pday: (p, t) => `<div style="position:absolute;left:0;top:0;width:1000px;height:940px">${img(p.art, 1000, 940)}<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 55%,${t.bg})"></div></div>
    <div style="position:absolute;left:56px;top:56px"><span class="pill" style="background:${t.bg};color:${t.fg};box-shadow:0 8px 20px rgba(0,0,0,.25)">${esc(p.date)} · draw this</span></div>
    <div style="position:absolute;left:56px;right:56px;top:880px">
      <div class="kick">today’s drawing prompt</div>
      <h1 style="margin-top:12px;font-size:${p.x.s.length > 26 ? 70 : 86}px">${esc(p.x.s)}</h1>
      <div style="display:flex;gap:14px;margin-top:22px;flex-wrap:wrap"><span style="background:${t.acc};color:${ink(t.acc)};font:700 26px Karla;padding:12px 20px;border-radius:30px">twist: ${esc(p.x.tw)}</span><span style="background:${t.card};font:700 26px Karla;padding:12px 20px;border-radius:30px">⏱ ${p.x.t} minutes</span></div>
      <div style="margin-top:30px;font:700 46px/1.12 Caveat;color:${t.mut};max-width:880px">“${esc(p.x.tip)}”</div></div>
    ${foot(t, 'A new prompt every day')}`,
  pweek: (p, t) => `<div class="fr" style="position:absolute;right:-40px;top:60px;width:470px;height:560px;transform:rotate(4deg)">${img(p.art, 470, 560)}</div>
    <div style="position:absolute;left:56px;width:470px;top:70px"><span class="pill">${esc(p.m)} · 6 days</span><h1 style="margin-top:20px;font-size:66px">${p.t}</h1></div>
    <div style="position:absolute;left:44px;right:44px;top:670px;display:grid;grid-template-columns:1fr;gap:12px">${p.items.map(x => `<div style="background:${t.card};border-radius:14px;padding:16px 18px;display:flex;gap:16px;align-items:flex-start">
      <b style="flex:none;width:70px;height:70px;border-radius:50%;background:${t.acc};color:${ink(t.acc)};font:600 34px/70px Fraunces;text-align:center">${x.d}</b>
      <div><div style="font:700 32px/1.1 Karla">${esc(x.s)}</div><div style="font:700 32px/1.05 Caveat;color:${t.mut};margin-top:4px">${esc(x.tw)} · ${x.t} min</div></div></div>`).join('')}</div>
    ${foot(t, 'Get the whole month')}`,
  ptw: (p, t) => `<div class="fr" style="position:absolute;left:56px;top:300px;width:330px;height:430px;transform:rotate(-3deg)">${img(p.art, 330, 430)}</div>
    <div style="position:absolute;left:56px;right:56px;top:56px"><span class="pill">art block? try this</span><h1 style="margin-top:18px;font-size:68px">${p.t}</h1></div>
    <div style="position:absolute;left:430px;right:50px;top:300px;display:flex;flex-direction:column;gap:22px">${p.items.map((x, i) => `<div style="display:flex;gap:14px;align-items:center"><b style="flex:none;width:52px;height:52px;border-radius:50%;border:3px solid ${t.acc};font:600 26px/46px Fraunces;text-align:center;color:${t.acc}">${i + 1}</b><span style="font:700 ${x.length > 34 ? 28 : 33}px/1.1 Karla">${esc(x)}</span></div>`).join('')}</div>
    <div style="position:absolute;left:56px;width:330px;top:770px;font:700 42px/1.1 Caveat;color:${t.acc};text-align:center">pick any object.<br>add one twist.<br>draw for 10 minutes.</div>
    ${foot(t, 'Get this month’s prompts')}`,
  ptip: (p, t) => `<div style="position:absolute;left:0;top:0;width:1000px;height:420px">${img(p.art, 1000, 420)}<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 40%,${t.bg})"></div></div>
    <div style="position:absolute;left:56px;right:56px;top:350px"><span class="pill">sketchbook notes</span><h1 style="margin-top:18px;font-size:64px">${p.t}</h1></div>
    <div style="position:absolute;left:56px;right:56px;top:600px;display:flex;flex-direction:column;gap:22px">${p.items.map(x => `<div style="display:flex;gap:16px;align-items:flex-start"><span style="flex:none;margin-top:14px;width:18px;height:18px;border-radius:50%;background:${t.acc}"></span><span style="font:700 ${x.length > 70 ? 30 : 34}px/1.18 Karla">${esc(x)}</span></div>`).join('')}</div>
    ${foot(t, 'A new prompt list every month')}`,
  // открытый список на месяц: видно всё (как залетевшие «31 cozy winter things to draw»)
  popen: (p, t) => {
    const h = fit(p.ar, 520, 340)[1], top = 50 + h + 40, N = p.items.length, rows = Math.ceil(N / 5), ch = Math.floor((1500 - top - 170 - (rows - 1) * 10) / rows);
    return `${head(p, t, p.kick, w => (912 - w) < 420 ? 46 : p.t.length > 40 ? 54 : 62)}
    <div style="position:absolute;left:44px;right:44px;top:${top}px;display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:${ch}px;gap:10px">
      ${p.items.map((q, i) => `<div style="background:${t.card};border-radius:10px;padding:9px 11px;overflow:hidden"><b style="display:block;font:600 30px/1 Fraunces;color:${t.acc}">${i + 1}</b><div style="font:700 ${q.length > 18 ? 24 : 27}px/1.12 Karla;margin-top:8px">${esc(q)}</div></div>`).join('')}</div>
    ${foot(t, 'A new list every month')}`;
  },
  // палитры деталей: 5 форматов, HEX видны
  pal6: (p, t) => { const [w, h] = fit(p.ar, 912, 640); return `<div style="position:absolute;left:44px;right:44px;top:44px;bottom:170px;display:flex;flex-direction:column;align-items:center">
    <div style="width:${w}px;height:${h}px;border-radius:18px;overflow:hidden;flex:none">${img(p.img, w, h)}</div>
    <div style="align-self:stretch;margin:30px 16px 0"><div class="kick">color palette · 6 colors</div><h1 style="margin-top:10px;font-size:${p.t.length > 30 ? 60 : 70}px">${p.t}</h1></div>
    <div style="align-self:stretch;flex:1;margin:24px 16px 0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:14px 22px">${p.cols.map(c => `<div style="display:flex;flex-direction:column"><div style="flex:1;min-height:40px;border-radius:12px;background:${c.hex};box-shadow:0 8px 18px rgba(0,0,0,.25)"></div><div style="font:700 23px Karla;margin-top:8px">${esc(c.en)}</div><div style="font:700 20px Karla;color:${t.mut};letter-spacing:.08em">${c.hex}</div></div>`).join('')}</div></div>
    ${foot(t, 'More palettes')}`; },
  pal5: (p, t) => `<div style="position:absolute;left:56px;right:56px;top:50px"><div class="kick">5-color palette</div><h1 style="margin-top:10px;font-size:${p.t.length > 30 ? 60 : 72}px">${p.t}</h1></div>
    <div style="position:absolute;left:44px;top:${p.t.length > 22 ? 300 : 230}px;width:470px;bottom:180px;border-radius:16px;overflow:hidden;box-shadow:0 20px 44px rgba(0,0,0,.18)">${img(p.img, 470, 1100)}</div>
    <div style="position:absolute;left:540px;right:44px;top:${p.t.length > 22 ? 300 : 230}px;bottom:180px;display:flex;flex-direction:column;gap:12px">${p.cols.map(c => `<div style="flex:1;border-radius:14px;background:${c.hex};display:flex;flex-direction:column;justify-content:flex-end;padding:16px 20px;color:${ink(c.hex)}"><b style="font:700 26px/1.1 Karla">${esc(c.en)}</b><span style="font:700 22px Karla;letter-spacing:.08em;opacity:.85">${c.hex}</span></div>`).join('')}</div>
    ${foot(t, 'More palettes')}`,
  pal4: (p, t) => `<div style="position:absolute;left:150px;top:60px;width:700px;height:760px;border-radius:350px 350px 18px 18px;overflow:hidden;box-shadow:0 20px 44px rgba(0,0,0,.2)">${img(p.img, 700, 760)}</div>
    <div style="position:absolute;left:56px;right:56px;top:860px;text-align:center"><div class="kick">four-color palette</div><h1 style="margin-top:10px;font-size:${p.t.length > 30 ? 60 : 72}px">${p.t}</h1></div>
    <div style="position:absolute;left:56px;right:56px;top:${p.t.length > 26 ? 1110 : 1060}px;display:flex;justify-content:space-between">${p.cols.map(c => `<div style="width:200px;text-align:center"><div style="width:150px;height:150px;margin:0 auto;border-radius:50%;background:${c.hex};box-shadow:0 10px 22px rgba(0,0,0,.22),inset 0 0 0 5px rgba(255,255,255,.35)"></div><div style="font:700 23px Karla;margin-top:10px">${esc(c.en)}</div><div style="font:700 20px Karla;color:${t.mut};letter-spacing:.08em">${c.hex}</div></div>`).join('')}</div>
    ${foot(t, 'More palettes')}`,
  pal3: (p, t) => `<div style="position:absolute;left:0;top:0;width:1000px;height:860px">${img(p.img, 1000, 860)}<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 60%,${t.bg})"></div></div>
    <div style="position:absolute;left:60px;right:60px;top:800px"><div class="kick">3 colors is all you need</div><h1 style="margin-top:10px;font-size:${p.t.length > 30 ? 62 : 76}px">${p.t}</h1></div>
    <div style="position:absolute;left:60px;right:60px;top:${p.t.length > 26 ? 1070 : 1010}px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">${p.cols.map(c => `<div style="height:${p.t.length > 26 ? 210 : 260}px;border-radius:16px;background:${c.hex};display:flex;flex-direction:column;justify-content:flex-end;padding:16px 18px;color:${ink(c.hex)};box-shadow:0 10px 24px rgba(0,0,0,.3)"><b style="font:700 26px/1.1 Karla">${esc(c.en)}</b><span style="font:700 22px Karla;letter-spacing:.08em;opacity:.85">${c.hex}</span></div>`).join('')}</div>
    ${foot(t, 'More palettes')}`,
  pal8: (p, t) => { const [w, h] = fit(p.ar, 520, 560); return `<div style="position:absolute;left:${56 + (520 - w) / 2}px;top:${70 + (560 - h) / 2}px;background:#fff;padding:18px 18px 70px;box-shadow:0 20px 40px rgba(0,0,0,.2);transform:rotate(-3deg)">${img(p.img, w, h)}<div style="position:absolute;left:0;right:0;bottom:16px;text-align:center;font:700 38px/1 Caveat;color:#2A211C">a detail of my painting</div></div>
    <div style="position:absolute;left:640px;right:50px;top:110px"><div class="kick">8-color palette</div><h1 style="margin-top:12px;font-size:${p.t.length > 22 ? 52 : 62}px">${p.t}</h1></div>
    <div style="position:absolute;left:44px;right:44px;top:800px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${p.cols.map(c => `<div style="background:#fff;border-radius:10px;padding:10px 10px 12px;box-shadow:0 8px 18px rgba(0,0,0,.12)"><div style="height:150px;border-radius:6px;background:${c.hex}"></div><div style="font:700 21px/1.1 Karla;color:#2A211C;margin-top:8px">${esc(c.en)}</div><div style="font:700 19px Karla;color:#6C6058;letter-spacing:.06em">${c.hex}</div></div>`).join('')}</div>
    ${foot(t, 'More palettes')}`; },
  // 4 шага — все видно
  palch: (p, t) => { const [w, h] = fit(p.ar, 400, 520); return `<div style="position:absolute;left:56px;right:56px;top:50px"><span class="pill">palette challenge</span><h1 style="margin-top:18px;font-size:64px">Paint 5 things with <em>only these colors</em></h1></div>
    <div class="fr" style="position:absolute;left:${56 + (400 - w) / 2}px;top:${330 + (520 - h) / 2}px;transform:rotate(-2deg)">${img(p.img, w, h)}</div>
    <div style="position:absolute;left:500px;right:56px;top:330px;display:flex;flex-direction:column;gap:12px">${p.cols.map(c => `<div style="height:76px;border-radius:12px;background:${c.hex};display:flex;align-items:center;padding:0 18px;font:700 24px Karla;color:${ink(c.hex)}">${esc(c.en)}</div>`).join('')}</div>
    <div style="position:absolute;left:56px;right:56px;top:910px"><div style="font:700 24px Karla;letter-spacing:.2em;text-transform:uppercase;color:${t.mut};margin-bottom:14px">${esc(p.t.replace(/<[^>]+>/g, '').split(':')[0])} · your list</div>
      ${p.items.map((q, i) => `<div style="display:flex;gap:16px;align-items:center;margin-bottom:12px"><b style="flex:none;width:46px;height:46px;border-radius:50%;border:3px solid ${t.acc};font:600 26px/40px Fraunces;text-align:center;color:${t.acc}">${i + 1}</b><span style="font:700 42px/1 Caveat">${esc(q)}</span></div>`).join('')}</div>
    ${foot(t, 'Get the HEX codes')}`; },
  bingo: (p, t) => {
    const cells = [...p.items.slice(0, 12), 'FREE', ...p.items.slice(12)], h = fit(p.ar, 520, 340)[1], top = 50 + h + 40, ch = Math.floor((1500 - top - 170 - 32) / 5);
    return `${head(p, t, 'draw it · cross it off', w => (912 - w) < 420 ? 50 : 60)}
    <div style="position:absolute;left:56px;right:56px;top:${top}px;display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:${ch}px;gap:8px">
      ${cells.map(q => `<div style="background:${q === 'FREE' ? t.acc : t.card};border-radius:10px;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;font:700 ${q === 'FREE' ? 38 : q.length > 12 ? 40 : 46}px/1 Caveat;color:${q === 'FREE' ? ink(t.acc) : t.fg}">${q === 'FREE' ? 'FREE:<br>draw Polly' : esc(q)}</div>`).join('')}</div>
    ${foot(t, 'Daily prompts')}`;
  },
  // отличия + ключ ответов вверх ногами
  diff: (p, t) => `<div style="position:absolute;left:56px;right:56px;top:36px;text-align:center"><span class="pill">brain break</span><h1 style="margin-top:12px;font-size:64px">Spot the <em>5 differences</em></h1></div>
    <div class="fr" style="position:absolute;left:${(1000 - p.dw) / 2}px;top:200px">${img(`p16/diff-${p.name}-a.jpg`, p.dw, p.dh)}</div>
    <div class="fr" style="position:absolute;left:${(1000 - p.dw) / 2}px;top:${216 + p.dh}px">${img(`p16/diff-${p.name}-b.jpg`, p.dw, p.dh)}</div>
    <div style="position:absolute;right:52px;top:${232 + 2 * p.dh}px;width:${p.dw * .24}px;transform:rotate(180deg);opacity:.85"><div style="position:relative">${img(`p16/diff-${p.name}-b.jpg`, p.dw * .24, p.dh * .24, '50% 50%', 'cover', 'border-radius:6px')}
      ${p.spots.map(([x, y, r]) => `<i style="position:absolute;left:${(x - r) * .24 * p.ks}px;top:${(y - r) * .24 * p.ks}px;width:${2 * r * .24 * p.ks}px;height:${2 * r * .24 * p.ks}px;border:3px solid #E2544A;border-radius:50%"></i>`).join('')}</div>
      <div style="font:700 22px Karla;color:${t.mut};text-align:center;margin-top:4px">answers</div></div>
    ${foot(t, 'More cozy games')}`,
  // ——— адвент ———
  astreet: (p, t) => `${snow(60, p.n)}<div style="position:absolute;right:70px;top:70px;width:110px;height:110px;border-radius:50%;box-shadow:-26px 10px 0 0 #F3E3B5"></div>
    <div style="position:absolute;left:56px;right:56px;top:120px;text-align:center"><div class="kick">${esc(p.kick)}</div><h1 style="margin-top:16px;font-size:${p.t.length > 36 ? 70 : 82}px">${p.t}</h1>
      <div style="font:700 44px/1.1 Caveat;color:${t.acc};margin-top:22px">${esc(p.sub)}</div></div>
    <div style="position:absolute;left:0;top:${p.t.length > 36 ? 600 : 560}px">${img('p17/adv-street.png', 1000, 620, '50% 100%', 'cover', '-webkit-mask-image:linear-gradient(transparent,#000 22%);mask-image:linear-gradient(transparent,#000 22%)')}</div>
    <div style="position:absolute;left:0;right:0;top:1170px;height:200px;background:linear-gradient(#EEF4FA,#DCE6F0);border-radius:50% 50% 0 0/30px 30px 0 0"></div>
    <div class="ft" style="background:${t.bg};border-radius:70px;padding:0 20px 0 6px;left:30px;right:30px;bottom:24px"><img class="lg" src="${LOGO(t.logo)}"><div class="ad">pigeonpolly.com</div><div class="cta">Open window 1 →</div></div>`,
  awin: (p, t) => `${snow(50, p.n)}<div style="position:absolute;left:56px;right:56px;top:70px;text-align:center"><div class="kick">${p.special ? '★ special window · ' : ''}advent calendar 2026</div><h1 style="margin-top:14px;font-size:${p.t.length > 40 ? 66 : 76}px">${p.t}</h1></div>
    ${awin(250, p.t.length > 40 ? 450 : 400, 500, 600, p.d, p.special)}
    <div style="position:absolute;left:56px;right:56px;top:1150px;text-align:center;font:700 46px/1.1 Caveat;color:${t.acc}">${esc(p.sub)}</div>
    ${foot(t, `Opens ${p.d} December`)}`,
  aart: (p, t) => `<div style="position:absolute;left:0;top:0;width:1000px;height:1000px">${img(p.art, 1000, 1000)}<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,0) 55%,${t.bg} 98%)"></div></div>
    <div style="position:absolute;left:56px;top:56px"><span class="pill" style="background:#B3222C;color:#fff">advent calendar · 1–31 dec</span></div>
    ${awin(780, 120, 150, 190, '?', true).replace('font:600 54px', 'font:600 34px').replace('bottom:-46px', 'bottom:-30px')}
    <div style="position:absolute;left:56px;right:56px;top:960px"><h1 style="font-size:${p.t.length > 40 ? 64 : 74}px">${p.t}</h1><div style="font:700 44px/1.1 Caveat;color:${t.acc};margin-top:18px">${esc(p.sub)}</div></div>
    ${foot(t, 'Save the date')}`,
  apeek: (p, t) => {
    const G = ['g1-1', 'g2-1', 'g3-1', 'g4-1', 'g5-01'];
    const w = (i, x, y, W, H) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${W}px;height:${H}px;background:#F4EFE6;padding:14px;border-radius:${W / 2}px ${W / 2}px 10px 10px;box-shadow:0 20px 40px rgba(0,0,0,.45)${i === 2 ? ',0 0 0 6px #E9C46A' : ''}">
      <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:${W / 2 - 14}px ${W / 2 - 14}px 4px 4px">${img(`p17/gifts/${G[(i + p.seed) % 5]}.jpg`, W - 28, H - 28, '50% 50%', 'cover', 'filter:blur(26px) saturate(1.3);transform:scale(1.4)')}
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 20% 90%,rgba(255,255,255,.7),transparent 35%),radial-gradient(circle at 85% 85%,rgba(255,255,255,.6),transparent 30%),repeating-linear-gradient(115deg,rgba(255,255,255,.12) 0 3px,transparent 3px 16px)"></div>
      <div style="position:absolute;left:calc(50% - 5px);top:0;bottom:0;width:10px;background:#F4EFE6"></div><div style="position:absolute;top:50%;left:0;right:0;height:10px;background:#F4EFE6"></div></div>
      <b style="position:absolute;left:50%;bottom:-24px;transform:translateX(-50%);background:#B3222C;color:#fff;font:600 30px/1 Fraunces;padding:8px 16px;border-radius:10px;box-shadow:0 0 0 3px #E9C46A">${[3, 8, 12, 15, 21, 27][(i + p.seed) % 6]}</b></div>`;
    return `${snow(50, p.n)}<div style="position:absolute;left:56px;right:56px;top:70px;text-align:center"><div class="kick">advent calendar · opens 1 december</div><h1 style="margin-top:14px;font-size:74px">${p.t}</h1></div>
    ${w(0, 70, 400, 260, 330)}${w(1, 370, 360, 260, 330)}${w(2, 670, 400, 260, 330)}${w(3, 200, 800, 260, 330)}${w(4, 540, 800, 260, 330)}
    <div style="position:absolute;left:56px;right:56px;top:1210px;text-align:center;font:700 44px/1.1 Caveat;color:${t.acc}">${esc(p.sub)}</div>
    ${foot(t, 'Open them in December')}`;
  },
  alist: (p, t) => `${snow(40, p.n)}<div style="position:absolute;left:56px;right:56px;top:70px"><div class="kick">pigeon polly advent calendar</div><h1 style="margin-top:14px;font-size:76px">${p.t}</h1></div>
    ${awin(700, 370, 220, 280, 1, false).replace('font:600 54px', 'font:600 40px')}
    <div style="position:absolute;left:56px;width:600px;top:380px;display:flex;flex-direction:column;gap:38px">${p.items.map(x => `<div style="display:flex;gap:18px;align-items:center"><span style="flex:none;width:60px;height:60px;border-radius:14px;background:${t.acc};color:${t.bg};font:700 38px/60px Karla;text-align:center">✓</span><span style="font:700 40px/1.1 Karla">${esc(x)}</span></div>`).join('')}</div>
    <div style="position:absolute;left:56px;right:56px;top:1150px;font:700 46px/1.1 Caveat;color:${t.acc}">what’s inside? you’ll see on the day ✨</div>
    ${foot(t, 'Starts 1 December')}`,
  acal: (p, t) => {
    const sp = [6, 12, 19, 24, 31];
    return `${p.th === 'paper' ? '' : snow(40, p.n)}<div style="position:absolute;left:56px;right:56px;top:60px;text-align:center"><div class="kick">december 2026 · one a day</div><h1 style="margin-top:14px;font-size:70px">${p.t}</h1></div>
    <div style="position:absolute;left:56px;right:56px;top:340px;display:grid;grid-template-columns:repeat(7,1fr);gap:12px">${['Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo'].map(d => `<div style="text-align:center;font:700 22px Karla;color:${t.mut};letter-spacing:.1em">${d}</div>`).join('')}
      ${Array.from({ length: 31 }, (_, i) => i + 1).map(d => `<div class="gift" style="height:112px;background:${sp.includes(d) ? '#E9C46A' : '#B3222C'}${sp.includes(d) ? ';box-shadow:0 0 18px rgba(233,196,106,.7)' : ''}"><b style="font-size:30px;color:${sp.includes(d) ? '#3A1418' : '#fff'};text-shadow:none">${d}</b></div>`).join('')}</div>
    <div style="position:absolute;left:56px;right:56px;top:1170px;text-align:center;font:700 44px/1.1 Caveat;color:${t.acc}">gold = special windows · all closed until their day</div>
    ${foot(t, 'Save the date')}`;
  },
};

const sz = k => execFileSync('python3', ['-c', `from PIL import Image;im=Image.open(${JSON.stringify(k)});print(*im.size)`]).toString().trim().split(' ').map(Number);

(async () => {
  const only = process.argv.slice(2).map(Number);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_pin18.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
  const out = [];
  for (const p of PINS) {
    const t = TH[p.th];
    out.push({ n: p.n, type: p.tpl, title: p.title, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics, season: p.season });
    if (only.length && !only.includes(p.n)) continue;
    { const k = p.art || p.img; if (k) { const [w, h] = sz(k.startsWith('/') ? k : path.join(ROOT, 'site', k.startsWith('images/') ? k : 'images/' + k)); p.ar = w / h; } }
    if (p.tpl === 'diff') {
      const [w, h] = sz(path.join(__dirname, 'p16', `diff-${p.name}-a.jpg`)); const s = Math.min(912 / w, 470 / h);
      p.dw = Math.round(w * s); p.dh = Math.round(h * s); p.ks = s; p.spots = JSON.parse(fs.readFileSync(path.join(__dirname, 'p16', `diff-${p.name}.json`)));
    }
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&family=Caveat:wght@700&display=swap"><style>${CSS(t)}</style></head><body>${T[p.tpl](p, t)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => { const ft = document.querySelector('.ft').getBoundingClientRect().top; return Math.max(...[...document.querySelectorAll('body > *:not(.ft):not(.snow)')].map(e => e.getBoundingClientRect().bottom)) - ft; });
    if (over > 4 && !['astreet'].includes(p.tpl)) console.log('⚠ pin', p.n, p.tpl, 'наезжает на подвал на', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 85 });
  }
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, 'pins18.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
