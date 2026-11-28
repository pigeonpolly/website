// Пины №1773–1810 (Алина 28.11.2026): земляные цвета, новогодний ар-деко, цирк, строчка и арт, образ из цветов арта.
// node tools/pins/pins18b.js [номер…] → site/images/pins/pin-NNN.jpg + tools/pins/pins18b.json. Арт всегда целиком (рамка по пропорциям).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const PINS = require('./pins18b-data.js');
const F = k => 'file://' + path.join(ROOT, 'site', k.startsWith('images/') ? k : 'images/' + k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const LOGO = v => F(`images/logo/v3/pigeon-polly-${v}-transparent-4000.png`);
const fit = (ar, W, H) => ar > W / H ? [W, Math.round(W / ar)] : [Math.round(H * ar), H];
const img = (k, w, h, st = '') => `<img src="${F(k)}" style="width:${w}px;height:${h}px;display:block;object-fit:cover;${st}">`;
const lum = c => parseInt(c.slice(1, 3), 16) * .3 + parseInt(c.slice(3, 5), 16) * .59 + parseInt(c.slice(5, 7), 16) * .11;
const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Karla:wght@400;700&family=Caveat:wght@600;700&family=Poiret+One&family=Rye&family=DM+Mono:wght@400;500&display=swap';
const BASE = `*{box-sizing:border-box;margin:0;padding:0}html,body{width:1000px;height:1500px;overflow:hidden}body{position:relative;font-family:Karla}`;
const foot = (fg, logo, cta, ctaBg, ctaFg, font = "600 30px 'Cormorant Garamond'") => `<div style="position:absolute;left:50px;right:50px;bottom:34px;height:100px;display:flex;align-items:center;gap:16px">
  <img src="${LOGO(logo)}" style="width:96px;height:96px"><div style="font:${font};color:${fg};letter-spacing:.02em">pigeonpolly.com</div>
  ${cta ? `<div style="margin-left:auto;background:${ctaBg};color:${ctaFg};font:700 23px Karla;letter-spacing:.06em;padding:15px 24px;border-radius:40px">${esc(cta)} →</div>` : ''}</div>`;

// плоские силуэты вещей (свои простые фигуры, не чужие картинки): fill — цвет палитры
const SV = {
  dress: (c, s) => `<svg viewBox="0 0 200 300" width="${s * 200}" height="${s * 300}"><defs><linearGradient id="gd" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
    <path d="M72 12 L77 12 L100 72 L123 12 L128 12 L127 84 Q133 96 128 108 Q146 180 168 286 Q100 298 32 286 Q54 180 72 108 Q67 96 73 84 Z" fill="${c}"/><path d="M72 12 L77 12 L100 72 L123 12 L128 12 L127 84 Q133 96 128 108 Q146 180 168 286 Q100 298 32 286 Q54 180 72 108 Q67 96 73 84 Z" fill="url(#gd)" stroke="rgba(0,0,0,.28)" stroke-width="1.6"/>
    <path d="M73 96 Q100 104 127 96" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.4"/><path d="M90 140 Q86 210 70 282 M112 140 Q118 210 132 282" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="1.4"/></svg>`,
  coat: (c, s) => `<svg viewBox="0 0 240 310" width="${s * 240}" height="${s * 310}"><path d="M84 18 Q120 30 156 18 L196 52 Q214 120 232 206 L206 214 L184 118 L188 296 L52 296 L56 118 L34 214 L8 206 Q26 120 44 52 Z" fill="${c}" stroke="rgba(0,0,0,.3)" stroke-width="1.6"/>
    <path d="M84 18 L104 96 L120 132 L136 96 L156 18" fill="rgba(0,0,0,.14)" stroke="rgba(0,0,0,.3)" stroke-width="1.4"/><path d="M120 132 L120 296" stroke="rgba(0,0,0,.25)" stroke-width="1.4"/>
    <circle cx="128" cy="160" r="4" fill="rgba(0,0,0,.35)"/><circle cx="128" cy="200" r="4" fill="rgba(0,0,0,.35)"/><path d="M66 210 L100 210 M140 210 L174 210" stroke="rgba(0,0,0,.25)" stroke-width="1.4"/></svg>`,
  shoes: (c, s) => `<svg viewBox="0 0 200 130" width="${s * 200}" height="${s * 130}">${[0, 1].map(i => `<g transform="translate(${i * 34} ${i * 16})"><path d="M12 92 Q18 62 50 60 Q78 60 100 84 Q120 96 150 96 Q160 98 158 108 L60 108 Q52 108 50 100 L44 124 L36 124 L38 100 Q22 100 12 98 Z" fill="${c}" stroke="rgba(0,0,0,.32)" stroke-width="1.6"/><path d="M52 64 Q64 80 96 84" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/></g>`).join('')}</svg>`,
  bag: (c, s) => `<svg viewBox="0 0 200 120" width="${s * 200}" height="${s * 120}"><rect x="10" y="20" width="180" height="92" rx="14" fill="${c}" stroke="rgba(0,0,0,.3)" stroke-width="1.6"/><path d="M10 34 Q10 20 24 20 L176 20 Q190 20 190 34 L100 76 Z" fill="rgba(0,0,0,.12)" stroke="rgba(0,0,0,.3)" stroke-width="1.4"/><circle cx="100" cy="76" r="7" fill="#E7C76A" stroke="rgba(0,0,0,.3)"/></svg>`,
  earr: (c, s) => `<svg viewBox="0 0 120 120" width="${s * 120}" height="${s * 120}">${[22, 78].map(x => `<circle cx="${x}" cy="10" r="5" fill="#E7C76A"/><path d="M${x} 15 L${x} 40" stroke="#C9A227" stroke-width="2"/><path d="M${x} 40 Q${x + 16} 70 ${x} 96 Q${x - 16} 70 ${x} 40 Z" fill="${c}" stroke="rgba(0,0,0,.3)" stroke-width="1.4"/><circle cx="${x - 4}" cy="62" r="3" fill="rgba(255,255,255,.55)"/>`).join('')}</svg>`,
  scarf: (c, s) => `<svg viewBox="0 0 240 110" width="${s * 240}" height="${s * 110}"><path d="M8 40 Q60 6 120 36 Q180 66 232 30 L232 64 Q180 100 120 70 Q60 40 8 74 Z" fill="${c}" stroke="rgba(0,0,0,.28)" stroke-width="1.6"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${232} ${32 + i * 6} l8 2" stroke="${c}" stroke-width="3"/>`).join('')}<path d="M8 57 Q60 23 120 53 Q180 83 232 47" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2"/></svg>`,
};
const T = {
  // земляные цвета: бумага, паспарту, пробники краски
  earth: p => {
    const [w, h] = fit(p.ar, 760, 620);
    return `<style>body{background:#EDE4D6;color:#2B231D}</style>
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.5),transparent 60%),repeating-linear-gradient(0deg,rgba(0,0,0,.012) 0 2px,transparent 2px 5px)"></div>
    <div style="position:absolute;left:60px;right:60px;top:54px;display:flex;justify-content:space-between;align-items:baseline;font:500 18px 'DM Mono';letter-spacing:.26em;text-transform:uppercase;color:#8A6A4C"><span>earth tones</span><span>no. ${p.n - 1772}</span></div>
    <div style="position:absolute;left:${(1000 - w - 64) / 2}px;top:${110 + (620 - h) / 2}px;background:#FBF7F0;padding:32px;box-shadow:0 1px 0 rgba(0,0,0,.08),0 22px 40px rgba(60,40,20,.16)"><div style="outline:1px solid rgba(43,35,29,.35);outline-offset:6px">${img(p.img, w, h)}</div></div>
    <div style="position:absolute;left:60px;right:60px;top:830px;text-align:center"><h1 style="font:500 ${p.t.length > 20 ? 64 : 76}px/1 'Cormorant Garamond'"><i>${esc(p.t)}</i></h1>
      <div style="font:500 19px 'DM Mono';letter-spacing:.22em;color:#8A6A4C;margin-top:12px;text-transform:uppercase">clay · ochre · moss · terracotta</div></div>
    <div style="position:absolute;left:60px;right:60px;top:1010px;display:flex;gap:14px">${p.cols.map(c => `<div style="flex:1;background:#FBF7F0;padding:10px 10px 14px;box-shadow:0 10px 20px rgba(60,40,20,.12)"><div style="height:170px;background:${c.hex}"></div>
      <div style="font:600 22px/1.05 'Cormorant Garamond';margin-top:10px;min-height:46px">${esc(c.en)}</div><div style="font:500 15px 'DM Mono';color:#8A6A4C;letter-spacing:.04em">${c.hex}</div></div>`).join('')}</div>
    ${foot('#2B231D', 'color-autumn', 'More palettes', '#9A4A32', '#fff')}`;
  },
  // новогодний ар-деко: тёмный фон, золотые линии, веер
  deco: p => {
    const B = { navy: '#141B2E', onyx: '#121212', wine: '#2A1015' }[p.th], G = '#D4AF5A', [w, h] = fit(p.ar, 700, 560);
    const fan = (x, y, r) => `<svg style="position:absolute;left:${x - r}px;top:${y - r}px" width="${2 * r}" height="${r}" viewBox="0 0 ${2 * r} ${r}">${[1, .78, .56, .34].map(k => `<path d="M${r - r * k} ${r} A${r * k} ${r * k} 0 0 1 ${r + r * k} ${r}" fill="none" stroke="${G}" stroke-width="1.6"/>`).join('')}${Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (i + 1) / 10; return `<path d="M${r} ${r} L${r - Math.cos(a) * r} ${r - Math.sin(a) * r}" stroke="${G}" stroke-width="1.2"/>`; }).join('')}</svg>`;
    return `<style>body{background:${B};color:#F4ECD8}</style>
    <div style="position:absolute;inset:26px;border:2px solid ${G}"></div><div style="position:absolute;inset:38px;border:1px solid ${G}88"></div>
    ${fan(500, 150, 110)}
    <div style="position:absolute;left:0;right:0;top:170px;text-align:center"><div style="font:400 22px 'Poiret One';letter-spacing:.5em;color:${G}">NEW YEAR · PALETTE</div>
      <h1 style="font:400 ${p.t.length > 22 ? 54 : 66}px/1.05 'Poiret One';letter-spacing:.06em;margin:16px 70px 0;text-transform:uppercase">${esc(p.t)}</h1></div>
    <div style="position:absolute;left:${(1000 - w) / 2 - 14}px;top:${(p.t.length > 22 ? 400 : 340) + (560 - h) / 2}px;padding:12px;border:2px solid ${G}">${img(p.img, w, h)}</div>
    <div style="position:absolute;left:80px;right:80px;top:${p.t.length > 22 ? 1000 : 960}px;display:flex;gap:16px">${p.cols.map(c => `<div style="flex:1;text-align:center"><div style="height:${p.t.length > 22 ? 170 : 210}px;background:${c.hex};clip-path:polygon(0 100%,0 22%,20% 22%,20% 10%,40% 10%,40% 0,60% 0,60% 10%,80% 10%,80% 22%,100% 22%,100% 100%);box-shadow:inset 0 0 0 2px ${G}"></div>
      <div style="font:400 19px/1.1 'Poiret One';letter-spacing:.08em;margin-top:10px;min-height:42px">${esc(c.en)}</div><div style="font:500 14px 'DM Mono';color:${G};letter-spacing:.06em">${c.hex}</div></div>`).join('')}</div>
    ${foot('#F4ECD8', 'white-only', 'Get the palette', G, B, "400 28px 'Poiret One'")}`;
  },
  // цирк: старая афиша, полосатый шатёр, билетики
  circus: p => {
    const R = '#B8322A', C = '#F3E6CC', N = '#1F2A44', [w, h] = fit(p.ar, 400, 300);
    return `<style>body{background:${C};color:${N}}</style>
    <div style="position:absolute;left:0;right:0;top:0;height:70px;background:repeating-linear-gradient(90deg,${R} 0 50px,${C} 50px 100px)"></div>
    <svg style="position:absolute;left:0;top:70px" width="1000" height="30" viewBox="0 0 1000 30">${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 100} 0 Q${i * 100 + 25} 30 ${i * 100 + 50} 0 Z" fill="${R}"/><path d="M${i * 100 + 50} 0 Q${i * 100 + 75} 30 ${i * 100 + 100} 0 Z" fill="${C}" stroke="${R}" stroke-width="1"/>`).join('')}</svg>
    <div style="position:absolute;left:60px;top:140px;width:${w + 20}px;padding:10px;background:#fff;border:3px solid ${N};transform:rotate(-2deg)">${img(p.art, w, h)}</div>
    <div style="position:absolute;left:${w + 120}px;right:56px;top:140px;height:${h + 30}px;display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 20px Karla;letter-spacing:.3em;text-transform:uppercase;color:${R}">★ ${esc(p.kick)} ★</div>
      <h1 style="font:400 ${p.t.length > 32 ? 50 : 58}px/1.05 Rye;margin-top:12px;color:${N}">${p.t.replace(/<em>/g, `<span style="color:${R}">`).replace(/<\/em>/g, '</span>')}</h1></div>
    <div style="position:absolute;left:44px;right:44px;top:${200 + h}px;bottom:160px;display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(6,1fr);gap:9px">
      ${p.items.map((q, i) => `<div style="position:relative;background:${i % 2 ? '#FFF8EA' : '#F9E7C4'};border:2px dashed ${i % 3 === 0 ? R : N}66;border-radius:6px;padding:7px 10px;overflow:hidden">
        <div style="font:400 20px Rye;color:${R}">№${i + 1}</div><div style="font:700 ${q.length > 18 ? 21 : 24}px/1.1 Karla;margin-top:4px">${esc(q)}</div>
        <i style="position:absolute;left:-9px;top:50%;width:16px;height:16px;margin-top:-8px;border-radius:50%;background:${C}"></i><i style="position:absolute;right:-9px;top:50%;width:16px;height:16px;margin-top:-8px;border-radius:50%;background:${C}"></i></div>`).join('')}</div>
    ${foot(N, 'color-winter', 'A new list every month', R, '#fff', "400 26px Rye")}`;
  },
  // строчка и арт: поэтический принт
  poem: p => {
    const S = { ivory: ['#F7F3EC', '#2A2420', '#8C6F4E'], ink: ['#1B1D22', '#EFE8DC', '#C9A86A'], sage: ['#E9ECE4', '#26302A', '#6E7F62'] }[p.th], [w, h] = fit(p.ar, 800, 760), ft = Math.max(70, Math.round((1330 - (h + 70) - 260) / 2)), lt = ft + h + 70 + 60;
    return `<style>body{background:${S[0]};color:${S[1]}}</style>
    <div style="position:absolute;left:${(1000 - w - 70) / 2}px;top:${ft}px;padding:35px;background:${p.th === 'ink' ? '#26292F' : '#FFFFFF'};box-shadow:0 20px 50px rgba(0,0,0,${p.th === 'ink' ? .45 : .1})">${img(p.img || p.art, w, h)}</div>
    <div style="position:absolute;left:90px;right:90px;top:${lt}px;text-align:center">
      <div style="width:60px;height:1px;background:${S[2]};margin:0 auto 34px"></div>
      <div style="font:italic 400 ${p.line.length > 60 ? 52 : 58}px/1.22 'Cormorant Garamond'">${p.line}</div>
      <div style="font:500 17px 'DM Mono';letter-spacing:.3em;text-transform:uppercase;color:${S[2]};margin-top:34px">— from my sketchbook</div></div>
    ${foot(S[1], p.th === 'ink' ? 'white-only' : 'color-autumn', '', '', '')}`;
  },
  look: p => {
    const [w, h] = fit(p.ar, 390, 330), C = i => p.cols[i].hex, N = i => p.cols[i].en, m = p.map;
    const lab = (i, x, y, al = 'left') => `<div style="position:absolute;left:${x}px;top:${y}px;text-align:${al};width:220px;${al === 'right' ? 'margin-left:-220px' : ''}"><div style="font:700 34px/1 Caveat;color:#2A211C">${esc(N(i))}</div><div style="font:500 17px 'DM Mono';color:#7A6E64;letter-spacing:.06em;margin-top:3px">${C(i)}</div></div>`;
    return `<style>body{background:#F3EDE4;color:#2A211C}</style>
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 55%,#FBF8F2,#F3EDE4 60%)"></div>
    <div style="position:absolute;left:60px;right:60px;top:56px"><div style="font:500 19px 'DM Mono';letter-spacing:.28em;text-transform:uppercase;color:#8C6F4E">new year’s eve · look</div>
      <h1 style="font:500 76px/1 'Cormorant Garamond';margin-top:14px;letter-spacing:-.01em">Dress in the colors<br><i style="color:#8C3B3B">of a painting</i></h1></div>
    <div style="position:absolute;left:${60 + (390 - w) / 2}px;top:${300 + (330 - h) / 2}px;background:#fff;padding:14px 14px 54px;box-shadow:0 18px 40px rgba(0,0,0,.18);transform:rotate(-2.5deg)">${img(p.img, w, h)}
      <div style="position:absolute;left:0;right:0;bottom:12px;text-align:center;font:600 30px/1 Caveat;color:#2A211C">“${esc(p.t)}”</div></div>
    <div style="position:absolute;left:450px;top:262px;filter:drop-shadow(0 14px 18px rgba(0,0,0,.18))">${SV.coat(C(m.coat), 1.5)}</div>
    ${lab(m.coat, 805, 330)}
    <div style="position:absolute;left:150px;top:720px;filter:drop-shadow(0 14px 18px rgba(0,0,0,.18))">${SV.dress(C(m.dress), 1.6)}</div>
    ${lab(m.dress, 130, 1060, 'right')}
    <div style="position:absolute;left:560px;top:880px;filter:drop-shadow(0 10px 14px rgba(0,0,0,.16))">${SV.bag(C(m.bag), 1.2)}</div>
    ${lab(m.bag, 820, 900)}
    <div style="position:absolute;left:540px;top:1080px;filter:drop-shadow(0 10px 14px rgba(0,0,0,.16))">${SV.shoes(C(m.shoes), 1.35)}</div>
    ${lab(m.shoes, 830, 1110)}
    <div style="position:absolute;left:470px;top:735px;filter:drop-shadow(0 8px 12px rgba(0,0,0,.14))">${SV.scarf(C(m.scarf), 1.5)}</div>
    ${lab(m.scarf, 790, 662)}
    <div style="position:absolute;left:30px;top:800px">${SV.earr(C(m.earr), 1.15)}</div>
    <div style="position:absolute;left:60px;right:60px;top:1290px;display:flex;gap:10px">${p.cols.map(c => `<div style="flex:1;height:22px;border-radius:11px;background:${c.hex}"></div>`).join('')}</div>
    ${foot('#2A211C', 'color-winter', 'Get the palette', '#8C3B3B', '#fff')}`;
  },
};

const sz = k => execFileSync('python3', ['-c', `from PIL import Image;print(*Image.open(${JSON.stringify(k)}).size)`]).toString().trim().split(' ').map(Number);
(async () => {
  const only = process.argv.slice(2).map(Number);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_pin18b.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
  const out = [];
  for (const p of PINS) {
    out.push({ n: p.n, type: p.tpl, title: p.title, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics, season: p.season });
    if (only.length && !only.includes(p.n)) continue;
    if (!T[p.tpl]) continue;
    const k = p.img || p.art; if (k) { const [w, h] = sz(path.join(ROOT, 'site', k.startsWith('images/') ? k : 'images/' + k)); p.ar = w / h; }
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONTS}"><style>${BASE}</style></head><body>${T[p.tpl](p)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 86 });
  }
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(__dirname, 'pins18b.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
