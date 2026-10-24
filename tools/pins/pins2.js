// Пины Pinterest, вторая партия (№190+): полезные (списки, шаблоны, шпаргалки, палитры) и игры.
// node tools/pins/pins2.js [номер…] → site/images/pins/pin-NNN.jpg (1000×1500) и tools/pins/pins2.json (тексты для Notion).
// Кадры игр — tools/pins/shots/ (Playwright со статическим site/ и подставным /api, см. docs/palettes.md → Pinterest).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const img = p => 'file://' + path.join(ROOT, 'site', p);
const shot = n => 'file://' + path.join(__dirname, 'shots', n);
const UTM = '?utm_source=pinterest&utm_campaign=pins2';
const SITE = 'https://www.pigeonpolly.com';
const pal = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));
const P = key => pal.find(p => p.key === key);

// ---------- темы ----------
const TH = {
  autumn: { bg: '#2A1A16', ink: '#FBEFE3', mut: '#D8C2B0', acc: '#F2B24C', acc2: '#E9824A', line: 'rgba(251,239,227,.22)', card: '#3A2620' },
  winter: { bg: '#15233A', ink: '#F2F6FB', mut: '#BCD0E6', acc: '#F3D27A', acc2: '#9FD3FF', line: 'rgba(242,246,251,.22)', card: '#1F3150' },
  purple: { bg: '#2B1A51', ink: '#F3EFFA', mut: '#D9D3F2', acc: '#F0A987', acc2: '#E9A93B', line: 'rgba(243,239,250,.22)', card: '#3A2A66' },
  paper:  { bg: '#FBF6EC', ink: '#2B1A16', mut: '#6E5A4E', acc: '#D85A30', acc2: '#534AB7', line: 'rgba(43,26,22,.28)', card: '#FFFFFF' },
  dead:   { bg: '#16302F', ink: '#FBF2E4', mut: '#CFE0D8', acc: '#F2A93B', acc2: '#E46A4C', line: 'rgba(251,242,228,.22)', card: '#1F403E' },
  night:  { bg: '#171226', ink: '#F3EFFA', mut: '#C9C1E6', acc: '#F5C46B', acc2: '#9C8FD0', line: 'rgba(243,239,250,.2)', card: '#241C3A' },
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// *курсив* в заголовке → акцент
const rich = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

const CSS = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.ink};font-family:Karla,sans-serif;position:relative}
.pin{position:absolute;inset:0;padding:70px 70px 0;display:flex;flex-direction:column}
.tag{align-self:flex-start;background:${t.ink};color:${t.bg};font:700 22px Karla;letter-spacing:.2em;text-transform:uppercase;padding:13px 22px;border-radius:40px}
.kick{font:italic 400 36px Fraunces;color:${t.acc2}}
h1{font:600 84px/1.0 Fraunces;letter-spacing:-.02em;margin-top:26px}
h1.s{font-size:70px} h1.xs{font-size:60px}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.sub{font:500 30px/1.35 Karla;color:${t.mut};margin-top:20px}
.foot{position:absolute;left:70px;right:70px;bottom:52px;display:flex;align-items:center;justify-content:space-between}
.badge{width:118px;height:118px;border-radius:50%;border:5px solid ${t.ink};background:radial-gradient(circle at 50% 40%,#6c5b78,#2a1f33);display:grid;place-items:center;overflow:hidden}
.badge img{width:80px;height:80px;image-rendering:pixelated}
.cta{text-align:right}
.cta i{display:block;font:italic 400 34px Fraunces;color:${t.mut}}
.cta b{display:block;font:700 34px Karla;margin-top:4px}
.num{position:absolute;right:18px;bottom:10px;font:700 22px Karla;color:${t.mut};opacity:.45}
.art{border-radius:26px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.35)}
.art img{display:block;width:100%;height:100%;object-fit:cover}
.pix img{image-rendering:pixelated}
/* список */
.list{display:grid;grid-template-columns:1fr 1fr;column-gap:46px;margin-top:34px}
.list.one{grid-template-columns:1fr}
.li{display:flex;gap:18px;align-items:baseline;padding:15px 0;border-bottom:2px dashed ${t.line};font:500 29px/1.25 Karla}
.li .n{font:italic 400 36px Fraunces;color:${t.acc2};min-width:52px}
.tight .li{padding:9px 0;font-size:25px}.tight .li .n{font-size:30px;min-width:44px}
.li small{display:block;font:400 23px/1.3 Karla;color:${t.mut};margin-top:4px}
/* сетка дней */
.grid{display:grid;gap:10px;margin-top:30px}
.cell{background:${t.card};border-radius:14px;padding:10px 12px;min-height:92px;font:500 19px/1.2 Karla;color:${t.ink}}
.cell b{display:block;font:italic 400 28px Fraunces;color:${t.acc};margin-bottom:3px}
/* палитры */
.pals{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:34px}
.pc{background:${t.card};border-radius:22px;overflow:hidden}
.pc .ph{height:220px}.pc .ph img{width:100%;height:100%;object-fit:cover;display:block}
.pc h3{font:600 30px Fraunces;padding:16px 18px 10px}
.sw{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;padding:0 18px 18px}
.sw div{height:62px;border-radius:9px}
.sw span{display:block;font:700 13px Karla;letter-spacing:.02em;color:${t.mut};margin-top:6px;text-align:center}
/* игра */
.shot{margin-top:40px;border-radius:24px;overflow:hidden;border:5px solid ${t.acc};box-shadow:0 24px 60px rgba(0,0,0,.45)}
.shot img{display:block;width:100%}
.chips{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.chip{background:${t.card};border:2px solid ${t.line};border-radius:40px;padding:12px 22px;font:700 25px Karla}
.play{display:inline-block;background:${t.acc};color:${t.bg};font:700 30px Karla;padding:20px 38px;border-radius:50px;margin-top:30px;align-self:flex-start}
.desc{font:italic 400 34px/1.32 Fraunces;color:${t.mut};margin-top:26px}
/* бокс-шаблоны */
.boxes{display:grid;gap:18px;margin-top:34px}
.box{border:3px solid ${t.ink};border-radius:16px;position:relative;background:${t.card}}
.box span{position:absolute;left:14px;top:10px;font:700 20px Karla;letter-spacing:.12em;text-transform:uppercase;color:${t.acc}}
.box small{position:absolute;left:14px;bottom:10px;right:14px;font:italic 400 20px Fraunces;color:${t.mut}}
`;

const foot = (t, cta, n) => `<div class="foot"><div class="badge"><img src="${img('images/wobbleland/ch-polly.png')}"></div><div class="cta"><i>${esc(cta)}</i><b>pigeonpolly.com</b></div></div><div class="num">${n}</div>`;

// ---------- шаблоны ----------
const T = {
  // список; o.art — картинка сверху (высота o.artH)
  list(o) {
    const art = o.art ? `<div class="art${o.pix ? ' pix' : ''}" style="height:${o.artH || 360}px;margin:-70px -70px 34px;border-radius:0">${`<img src="${o.art}" style="object-position:${o.pos || 'center'}">`}</div>` : '';
    const items = o.items.map((s, i) => { const [a, b] = [].concat(s); return `<div class="li"><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}</span></div>`; }).join('');
    return `${art}<div class="tag">${esc(o.tag)}</div><h1 class="${o.h || ''}">${rich(o.title)}</h1>${o.sub ? `<p class="sub">${esc(o.sub)}</p>` : ''}<div class="list${o.one ? ' one' : ''}${o.tight ? ' tight' : ''}" style="${o.listCss || ''}">${items}</div>`;
  },
  // календарь подсказок
  grid(o) {
    const cells = o.items.map((s, i) => `<div class="cell"><b>${i + 1}</b>${esc(s)}</div>`).join('');
    const art = o.art ? `<div class="art" style="height:${o.artH || 250}px;margin:-70px -70px 30px;border-radius:0"><img src="${o.art}" style="object-position:${o.pos || 'center'}"></div>` : '';
    return `${art}<div class="tag">${esc(o.tag)}</div><h1 class="${o.h || 's'}">${rich(o.title)}</h1><div class="grid" style="grid-template-columns:repeat(${o.cols || 5},1fr)">${cells}</div>`;
  },
  // 4 палитры с картинками
  pals(o) {
    const cards = o.keys.map(k => { const p = P(k); return `<div class="pc"><div class="ph"><img src="${img(p.thumb)}" style="object-position:${(o.pos || {})[k] || 'center'}"></div><h3>${esc(p.title.en)}</h3><div class="sw">${p.colors.map(c => `<div style="background:${c.hex}"></div>`).join('')}${p.colors.map(c => `<span>${c.hex.slice(1)}</span>`).join('')}</div></div>`; }).join('');
    return `<div class="tag">${esc(o.tag)}</div><h1 class="${o.h || 's'}">${rich(o.title)}</h1><div class="pals">${cards}</div>`;
  },
  // игра: кадр, фишки, кнопка
  game(o) {
    const chips = (o.chips || []).map(c => `<span class="chip">${esc(c)}</span>`).join('');
    return `<div class="kick">${esc(o.kick)}</div><h1 class="${o.h || ''}" style="margin-top:12px">${rich(o.title)}</h1><div class="shot${o.pix ? ' pix' : ''}" style="${o.shotCss || ''}"><img src="${o.shot}" style="${o.imgCss || ''}"></div>${o.on ? `<p class="desc">${esc(o.on)}</p>` : ''}<div class="chips">${chips}</div>${o.play ? `<span class="play">${esc(o.play)}</span>` : ''}`;
  },
  // шаблон-страница с пустыми рамками
  boxes(o) {
    const b = o.items.map(s => { const [a, c] = [].concat(s); return `<div class="box" style="height:${o.boxH || 180}px"><span>${esc(a)}</span>${c ? `<small>${esc(c)}</small>` : ''}</div>`; }).join('');
    return `<div class="tag">${esc(o.tag)}</div><h1 class="${o.h || 's'}">${rich(o.title)}</h1>${o.sub ? `<p class="sub">${esc(o.sub)}</p>` : ''}<div class="boxes" style="grid-template-columns:repeat(${o.cols || 3},1fr)">${b}</div>`;
  },
  // произвольная середина
  free(o) { return `<div class="tag">${esc(o.tag)}</div><h1 class="${o.h || 's'}">${rich(o.title)}</h1>${o.sub ? `<p class="sub">${esc(o.sub)}</p>` : ''}${o.body}`; },
};

// ---------- особые середины ----------
// шпаргалка акварельных приёмов: плашки нарисованы CSS
const WC = [
  ['Wet-on-wet', 'Wet the paper first, drop in paint and let it bloom.', 'radial-gradient(circle at 35% 40%,rgba(83,74,183,.85),rgba(83,74,183,0) 55%),radial-gradient(circle at 65% 60%,rgba(216,90,48,.8),rgba(216,90,48,0) 50%)'],
  ['Wet-on-dry', 'Paint on dry paper for crisp, sharp edges.', 'radial-gradient(circle at 50% 50%,#3F8E9A 0 38%,transparent 39%)'],
  ['Graded wash', 'Add water with every stroke: dark to light.', 'linear-gradient(180deg,#1F4C7A,rgba(31,76,122,.05))'],
  ['Dry brush', 'Almost dry brush, quick strokes: texture of wood and grass.', 'repeating-linear-gradient(100deg,rgba(124,60,22,.9) 0 6px,transparent 6px 11px,rgba(124,60,22,.55) 11px 14px,transparent 14px 22px)'],
  ['Lifting', 'Dab wet paint with a tissue to get clouds and highlights.', 'radial-gradient(ellipse at 45% 45%,#FBF6EC 0 22%,transparent 34%),linear-gradient(#5B8DB8,#5B8DB8)'],
  ['Glazing', 'Let a layer dry, then add a thin one on top.', 'linear-gradient(90deg,transparent 0 18%,rgba(233,169,59,.75) 18% 62%,transparent 62%),linear-gradient(0deg,transparent 0 22%,rgba(83,74,183,.55) 22% 70%,transparent 70%)'],
  ['Salt', 'Sprinkle salt into a wet wash: tiny stars and snow.', 'radial-gradient(circle,#FBF6EC 0 2px,transparent 3px) 0 0/19px 17px,radial-gradient(circle,rgba(251,246,236,.8) 0 1.5px,transparent 2.5px) 8px 9px/23px 21px,linear-gradient(#2C5A6E,#2C5A6E)'],
  ['Splatter', 'Tap a loaded brush over your finger.', 'radial-gradient(circle,#D85A30 0 4px,transparent 5px) 4px 8px/37px 41px,radial-gradient(circle,#534AB7 0 3px,transparent 4px) 21px 3px/29px 33px,radial-gradient(circle,#E9A93B 0 2px,transparent 3px) 13px 23px/23px 19px'],
];
const wcBody = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px 34px;margin-top:36px">${WC.map(([n, d, bg]) => `<div style="display:flex;gap:20px;align-items:center"><div style="flex:none;width:150px;height:118px;border-radius:14px;background:${bg};background-color:#fff;border:2px solid rgba(43,26,22,.15)"></div><div><b style="font:600 30px Fraunces">${n}</b><p style="font:500 21px/1.3 Karla;color:#6E5A4E;margin-top:6px">${d}</p></div></div>`).join('')}</div>`;

// раскладки страницы скетчбука: прямоугольники-схемы
const R = (x, y, w, h, r = 6) => `<i style="position:absolute;left:${x}%;top:${y}%;width:${w}%;height:${h}%;border-radius:${r}px"></i>`;
const LAY = [
  ['One hero + 3 small', R(6, 8, 88, 52) + R(6, 66, 26, 26) + R(37, 66, 26, 26) + R(68, 66, 26, 26)],
  ['Thumbnail grid', [0, 1, 2].map(r => [0, 1, 2].map(c => R(6 + c * 30, 8 + r * 30, 27, 26)).join('')).join('')],
  ['Comic strip', R(6, 10, 88, 24) + R(6, 38, 88, 24) + R(6, 66, 88, 24)],
  ['Object + notes', R(10, 20, 46, 60, 200) + '<b style="position:absolute;left:62%;top:22%;width:30%;height:5%"></b><b style="position:absolute;left:62%;top:40%;width:26%;height:5%"></b><b style="position:absolute;left:62%;top:58%;width:30%;height:5%"></b>'],
  ['Scattered spots', R(8, 8, 30, 26, 200) + R(55, 14, 34, 28, 200) + R(22, 46, 26, 22, 200) + R(60, 56, 30, 30, 200) + R(8, 74, 24, 18, 200)],
  ['Frame in frame', R(6, 8, 88, 84) + '<i style="position:absolute;left:24%;top:26%;width:52%;height:48%;border-radius:6px;background:transparent!important;border:5px solid currentColor"></i>'],
  ['Panorama band', R(6, 34, 88, 32) + '<b style="position:absolute;left:6%;top:76%;width:60%;height:5%"></b>'],
  ['Diagonal flow', R(6, 6, 34, 28) + R(33, 36, 34, 28) + R(60, 66, 34, 28)],
  ['Circle vignette', R(18, 14, 64, 64, 400) + '<b style="position:absolute;left:30%;top:84%;width:40%;height:5%"></b>'],
];
const layBody = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:26px 30px;margin-top:40px">${LAY.map(([n, s], i) => `<div><div class="lay" style="position:relative;height:250px;background:#3A2A66;border-radius:14px;color:#F0A987">${s}</div><p style="font:700 23px Karla;margin-top:12px"><span style="font:italic 400 28px Fraunces;color:#E9A93B">${i + 1}</span> ${n}</p></div>`).join('')}</div>
<style>.lay i{background:#F0A987;opacity:.9}.lay b{background:#D9D3F2;border-radius:4px;opacity:.7}</style>`;

// праздники Воббленда (content/wobbleland.json), ноябрь — январь
const WL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/wobbleland.json'), 'utf8')).cities;
const wlHol = ['Golden Broth Week', 'Aged Day', 'Golden Melt Festival', 'Festival of Warm Ovens', 'Amber Night', 'Winter Brew Eve', 'New Year', 'Golden Grid Night'].map(t => { for (const c of WL) { const h = c.holidays.find(h => h.title === t); if (h) return { ...h, town: c.name }; } });
const short = s => s.split(';')[0].replace(/\.$/, '') + '.';
const wlBody = `<div style="margin-top:30px">${wlHol.map(h => `<div style="display:flex;gap:26px;padding:15px 0;border-bottom:2px dashed rgba(242,246,251,.22)"><div style="flex:none;width:118px;background:#F2F6FB;color:#15233A;border-radius:14px;text-align:center;padding:8px 0;align-self:flex-start"><div style="font:700 17px Karla;letter-spacing:.14em;color:#D85A30">${h.date.split(' ')[0].toUpperCase()}</div><div style="font:600 46px/1 Fraunces">${h.date.split(' ')[1]}</div></div><div><b style="font:600 31px Fraunces">${esc(h.title)}</b> <span style="font:500 21px Karla;color:#F3D27A">· ${esc(h.town)}</span><p style="font:500 22px/1.3 Karla;color:#BCD0E6;margin-top:5px">${esc(short(h.desc))}</p></div></div>`).join('')}</div>`;

// ингредиенты зельеварни (site/assets/potion-names.js, осень)
const ING = `amanita|🍄|Fly agaric;pumpkin|🎃|Pumpkin;web|🕸️|Spider web;bat|🦇|Bat wing;eye|👁️|Newt eye;mandrake|🌿|Mandrake root;moon|🌙|Moon dust;feather|🪶|Owl feather;bone|🦴|Old bone;candle|🕯️|Candle stub;garlic|🧄|Garlic;pepper|🌶️|Dragon pepper;frog|🐸|Frog spawn;clover|🍀|Four-leaf clover;star|⭐|Star dust;apple|🍎|Candy apple;candy|🍬|Sweetie;choco|🍫|Chocolate;milk|🥛|Warm milk;honey|🍯|Honey;cookie|🍪|Grandma’s cookie`.split(';').map(s => s.split('|'));
const ingBody = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:34px">${ING.map(([, e, n]) => `<div style="background:#241C3A;border:2px solid rgba(243,239,250,.15);border-radius:18px;padding:14px 10px;text-align:center"><div style="font-size:54px;line-height:1.1">${e}</div><div style="font:700 21px Karla;margin-top:6px">${esc(n)}</div></div>`).join('')}</div>`;

// палитра из фото — 3 шага
const nt = P('2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes');
const photoBody = `<div style="display:flex;gap:26px;margin-top:36px;align-items:stretch">
<div class="art" style="flex:1.25;height:560px;position:relative"><img src="${img(nt.thumb)}">${[[22, 30], [48, 62], [70, 22], [33, 78], [80, 70], [58, 40]].map(([x, y], i) => `<span style="position:absolute;left:${x}%;top:${y}%;width:44px;height:44px;margin:-22px;border-radius:50%;border:5px solid #fff;background:${nt.colors[i].hex};box-shadow:0 3px 10px rgba(0,0,0,.5)"></span>`).join('')}</div>
<div style="flex:1;display:flex;flex-direction:column;gap:12px">${nt.colors.map(c => `<div style="flex:1;border-radius:14px;background:${c.hex};display:flex;align-items:flex-end;padding:10px 14px;font:700 20px Karla;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.5)">${esc(c.en)} · ${c.hex}</div>`).join('')}</div></div>
<div class="list one" style="margin-top:22px">${['Pick any photo: your walk, your cat, your breakfast.', 'Move the 6 little droppers to the colours you love.', 'Download the palette card with names and HEX codes.'].map((s, i) => `<div class="li" style="padding:11px 0"><span class="n">${i + 1}</span><span>${s}</span></div>`).join('')}</div>`;

// Школа Полли (№219+): картинки урока 1 из книги Алины, кадры — tools/pins/shots/school-*.png
const sch = f => img('images/school/' + f);
const shapesBody = `<div style="background:#fff;border-radius:22px;padding:26px 30px;margin-top:34px;box-shadow:0 10px 30px rgba(43,26,22,.12)"><img src="${sch('l1-s1.png')}" style="width:100%;display:block"></div>
<div style="display:grid;grid-template-columns:1fr 40px 1fr;gap:16px;align-items:center;margin-top:26px">${[['l1-c1.png', 'l1-c2.png', 'a circle', 'a clock'], ['l1-c3.png', 'l1-c4.png', 'a lopsided circle', 'a frying pan']].map(([a, b, x, y]) => `<div style="background:#fff;border-radius:18px;height:300px;display:grid;place-items:center;box-shadow:0 10px 30px rgba(43,26,22,.12);position:relative"><img src="${sch(a)}" style="max-height:200px"><span style="position:absolute;bottom:14px;font:italic 400 26px Fraunces;color:#6E5A4E">${x}</span></div><div style="font:600 46px Fraunces;color:#D85A30;text-align:center">→</div><div style="background:#fff;border-radius:18px;height:300px;display:grid;place-items:center;box-shadow:0 10px 30px rgba(43,26,22,.12);position:relative"><img src="${sch(b)}" style="max-height:230px;max-width:90%"><span style="position:absolute;bottom:14px;font:italic 400 26px Fraunces;color:#D85A30">${y}</span></div>`).join('')}</div>`;
// лампа = трапеция + прямоугольник + овал (как в мини-игре урока 1), с подписями
const lampBody = `<div style="display:flex;gap:30px;align-items:center;margin-top:30px">
<svg viewBox="0 0 200 190" style="width:560px;flex:none;background:#fff;border-radius:22px;box-shadow:0 10px 30px rgba(43,26,22,.12)"><g fill="#F0A987" stroke="#D85A30" stroke-width="3"><polygon points="70,30 130,30 150,92 50,92"/></g><g fill="#C9C1E6" stroke="#534AB7" stroke-width="3"><rect x="93" y="92" width="14" height="70"/></g><g fill="#F5C46B" stroke="#B5791B" stroke-width="3"><ellipse cx="100" cy="168" rx="42" ry="11"/></g><path d="M118 92 q6 18 -2 30" fill="none" stroke="#2B1A51" stroke-width="2"/><circle cx="116" cy="123" r="3" fill="#2B1A51"/></svg>
<div style="display:flex;flex-direction:column;gap:26px">${[['#D85A30', 'Trapezoid', 'the shade: almost a triangle'], ['#534AB7', 'Rectangle', 'the stand'], ['#B5791B', 'Oval', 'the base, lying down']].map(([c, a, b]) => `<div><b style="display:block;font:600 40px Fraunces;color:${c}">${a}</b><span style="font:500 26px/1.3 Karla;color:#6E5A4E">${b}</span></div>`).join('')}</div></div>
<div class="list one" style="margin-top:40px">${['Look at an object and name its big shapes.', 'Draw only those shapes, lightly.', 'Then add two details: a cord, a switch, a shadow.'].map((s, i) => `<div class="li" style="padding:20px 0;font-size:32px"><span class="n">${i + 1}</span><span>${s}</span></div>`).join('')}</div>`;
// клиент из Воббленда: карточка Мистера Криспера + его заказ
const clientBody = `<div style="display:flex;gap:30px;margin-top:34px;align-items:flex-start"><div class="art" style="flex:none;width:430px;transform:rotate(-3deg)"><img src="${img('images/cards/classic/14.jpg')}"></div>
<div style="background:#FBEFE3;color:#2B1A16;border-radius:24px;padding:28px 30px;font:500 29px/1.35 Karla;position:relative">“Oh dear, oh dear! Things at the lost-and-found have no labels, and I can’t sleep. Draw me two of them in simple shapes, so I can label at least those boxes!”<b style="display:block;margin-top:16px;font:600 30px Fraunces;color:#D85A30">Mr. Crisper</b><span style="font:italic 400 24px Fraunces;color:#6E5A4E">lost-and-found, Wobbleland station</span></div></div>`;

// ---------- пины ----------
const L = (p) => SITE + p + UTM;
const LS = (p) => SITE + p + '?utm_source=pinterest&utm_campaign=school';
const PINS = [
  { n: 190, type: 'Полезный', theme: 'autumn', tpl: 'grid', art: img('images/bird/2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes-800.jpg'), artH: 270, pos: '50% 30%',
    tag: '30-day drawing challenge', title: 'Cozy *November* drawing prompts', cols: 5,
    items: ['a cup of tea going cold', 'wool socks', 'the last apple on a tree', 'fog over a street', 'a candle stub', 'your favourite mug', 'a bowl of soup', 'an umbrella drying', 'a pigeon on a wire', 'bare branches', 'a library book', 'knitted mittens', 'rain on a window', 'a jar of jam', 'mushrooms in a basket', 'a comfy armchair', 'a hot water bottle', 'street lamp at 4 p.m.', 'a crow with a treasure', 'pumpkin soup', 'a scarf on a chair', 'the view from your bed', 'a pile of leaves', 'cinnamon buns', 'a sleeping cat', 'a radiator', 'a moth by a lamp', 'a letter in an envelope', 'a stack of blankets', 'the first snowflake'],
    cta: 'A new theme every day', link: L('/challenge/'),
    pt: '30 Cozy November Drawing Prompts: Daily Sketchbook Challenge',
    desc: 'One tiny cozy thing to draw every day of November: tea going cold, wool socks, fog, soup, a sleeping cat and the very first snowflake. Save it for your sketchbook and draw along. A new daily theme with a 3-colour palette waits on my site.',
    alt: 'A calendar of 30 November drawing prompts under a watercolor of a pigeon drinking coffee on an autumn night train.',
    topics: 'Drawing prompts, November, Sketchbook ideas, Drawing challenge, Cozy aesthetic' },

  { n: 191, type: 'Полезный', theme: 'winter', tpl: 'grid', art: img('images/bird/2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year-800.jpg'), artH: 250, pos: '50% 40%',
    tag: 'December drawing challenge', title: '31 cozy *winter* things to draw', cols: 5, h: 'xs',
    items: ['an advent window', 'a gingerbread house', 'a frosty window', 'cocoa with marshmallows', 'a snow globe', 'a mitten lost in snow', 'a sleigh bell', 'a wrapped present', 'a fir twig', 'a snowman’s carrot nose', 'a string of lights', 'a candle in a jar', 'a tangerine', 'a knitted hat', 'a cookie cutter', 'an icicle', 'a bird at a feeder', 'a holiday card', 'a cozy sweater', 'a teapot', 'the longest night', 'a sled', 'a gift tag', 'a festive table', 'a pet in a bow', 'the leftovers', 'next year’s calendar', 'ice skates', 'a fireplace log', 'sparklers', 'the clock at midnight'],
    cta: 'Draw along every day', link: L('/challenge/'),
    pt: '31 Cozy Winter Drawing Prompts: December Drawing Challenge',
    desc: 'A December drawing challenge for your sketchbook: one cozy winter prompt a day, from an advent window and a snow globe to sparklers and the clock at midnight. Pin it now and start on December 1. Daily themes with colour palettes are on my site.',
    alt: 'A December calendar with 31 winter drawing prompts under a watercolor of a pigeon, a cat and a horse at a New Year table.',
    topics: 'Drawing prompts, December, Christmas drawing ideas, Winter sketchbook, Drawing challenge' },

  { n: 192, type: 'Полезный', theme: 'paper', tpl: 'boxes', cols: 3, boxH: 228,
    tag: 'Sketchbook page template', title: 'Draw your *year*: one tiny drawing a month',
    items: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    cta: 'Best on Dec 31, with cocoa', link: L('/challenge/'),
    pt: 'Draw Your Year: Year in Review Sketchbook Page Template',
    desc: 'A simple year-in-review page for your sketchbook: twelve boxes, one tiny drawing for every month. A trip, a new mug, the day it finally snowed. Save it for December 31 and fill it with a cup of cocoa. More gentle drawing ideas on my site.',
    alt: 'A printable sketchbook template with twelve empty boxes labeled January to December for drawing a year in review.',
    topics: 'Sketchbook ideas, Year in review, New Year, Journal ideas, Drawing template' },

  { n: 193, type: 'Полезный', theme: 'paper', tpl: 'boxes', cols: 2, boxH: 168,
    tag: 'Gratitude sketchbook page', title: 'Draw *10 small good things* this month',
    items: [['a smell', 'coffee? rain? oranges?'], ['a meal', 'the best bite of the month'], ['a person', 'or a pet, they count'], ['a sound', 'how would you draw it?'], ['a place', 'even a corner of a room'], ['an object', 'something you use every day'], ['kind words', 'write them, draw who said them'], ['a laugh', 'what made you laugh?'], ['something you made', 'a cake, a sketch, a fort'], ['outside your window', 'today, right now']],
    cta: 'Small things, drawn small', link: L('/challenge/'),
    pt: 'Gratitude Sketchbook Page: Draw 10 Small Good Things',
    desc: 'A gratitude page for your sketchbook or journal: ten little boxes for ten small good things this month. A smell, a meal, a sound, something you made. It takes ten minutes and makes the whole month look kinder. More cozy drawing prompts on my site.',
    alt: 'A printable gratitude journal template with ten boxes and drawing prompts like a smell, a meal and a sound.',
    topics: 'Gratitude journal, Sketchbook ideas, Journal prompts, Thanksgiving, Self care' },

  { n: 194, type: 'Полезный', theme: 'paper', tpl: 'free', body: wcBody, h: 's',
    tag: 'Watercolor cheat sheet', title: '8 watercolor *techniques* every beginner should try',
    cta: 'Try one in today’s challenge', link: L('/challenge/'),
    pt: 'Watercolor Techniques Cheat Sheet: 8 Effects for Beginners',
    desc: 'Wet-on-wet, wet-on-dry, graded wash, dry brush, lifting, glazing, salt and splatter: eight watercolor techniques on one page, each with a one-line tip. Save it next to your paints and try one a day. Daily drawing themes with 3-colour palettes on my site.',
    alt: 'A watercolor techniques cheat sheet with eight painted swatches: wet-on-wet, wet-on-dry, graded wash, dry brush, lifting, glazing, salt and splatter.',
    topics: 'Watercolor for beginners, Watercolor techniques, Painting tips, Art tutorials, Watercolor painting' },

  { n: 195, type: 'Полезный', theme: 'purple', tpl: 'free', body: layBody, h: 's',
    tag: 'Sketchbook layouts', title: '9 ways to fill a *sketchbook page*',
    cta: 'Stuck? Get a theme for today', link: L('/challenge/'),
    pt: '9 Sketchbook Page Layout Ideas for When the Page Feels Empty',
    desc: 'Blank page panic? Pick a layout first and draw second: one hero plus three small, a thumbnail grid, a comic strip, object with notes, scattered spots, a panorama band and more. Nine simple sketchbook layouts to save and reuse. Daily drawing themes on my site.',
    alt: 'Nine simple diagrams of sketchbook page layouts, such as a thumbnail grid, a comic strip, scattered spot illustrations and a circle vignette.',
    topics: 'Sketchbook ideas, Sketchbook layout, Art journal, Drawing tips, Sketchbook inspiration' },

  { n: 196, type: 'Полезный', theme: 'autumn', tpl: 'pals', keys: ['halloween-cup', 'halloween-in-blue', 'halloween-lady', '2024-halloween-edition'],
    tag: 'Color palettes · HEX', title: '4 vintage *Halloween* palettes from watercolors',
    cta: 'Copy the HEX codes', link: L('/palettes/'),
    pt: '4 Vintage Halloween Color Palettes with HEX Codes',
    desc: 'Halloween palettes that are not neon orange: haunted tea, the pumpkin butler, a Victorian pumpkin lady and a witch hat, each taken from my watercolor paintings, with HEX codes. Click any colour on my site to copy it.',
    alt: 'Four Halloween color palettes with HEX codes, each under a vintage watercolor painting of pumpkin-headed characters and a spooky teacup.',
    topics: 'Halloween color palette, Color palettes, Vintage Halloween, HEX codes, Color inspiration' },

  { n: 197, type: 'Полезный', theme: 'winter', tpl: 'pals', keys: ['2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year', '2025-pigeon-polly-celebrates-new-year', '2022-pigeon-polly-celebrates-new-year-first-time-in-the-bed', '2024-mr-chew-celebrates-new-year'],
    tag: 'Color palettes · HEX', title: '4 cozy *New Year* palettes for winter projects',
    cta: 'More palettes on my site', link: L('/palettes/'),
    pt: '4 Cozy New Year Color Palettes with HEX Codes',
    desc: 'Champagne, fir tree and cocoa; jelly pink and night train blue; plum jam and copper. Four cozy winter palettes from my New Year watercolors, with HEX codes for cards, wrapping paper and winter illustrations.',
    alt: 'Four New Year color palettes with HEX codes under cozy watercolor illustrations of a pigeon celebrating at home.',
    topics: 'Christmas color palette, Winter color palette, New Year, HEX codes, Cozy aesthetic' },

  { n: 198, type: 'Полезный', theme: 'autumn', tpl: 'pals', keys: ['2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes', '2025-mr-chew-opened-pumpkin-spice-latte-season', '2023-pigeon-polly-against-war', 'sketchbook-7'],
    tag: 'Color palettes · HEX', title: '4 warm *autumn* palettes to save for later',
    cta: 'Click a colour to copy it', link: L('/palettes/'),
    pt: '4 Warm Autumn Color Palettes with HEX Codes',
    desc: 'Beak gold and puffer jacket rust, pumpkin spice and denim scarf, marigold and coffee bean, cinnamon rooftops. Four autumn palettes from my watercolors and sketchbook, with HEX codes. All 70+ palettes are free on my site.',
    alt: 'Four autumn color palettes with HEX codes under watercolor illustrations of a pigeon on a train, a snail with a pumpkin latte and city rooftops.',
    topics: 'Autumn color palette, Fall colors, Color palettes, HEX codes, Color inspiration' },

  { n: 199, type: 'Полезный', theme: 'dead', tpl: 'list', art: img('images/bird/2022-pigeon-polly-celebrates-dia-de-muertos-800.jpg'), artH: 420, pos: '50% 35%',
    tag: 'Día de Muertos · Nov 1–2', title: '12 *Day of the Dead* drawing ideas', h: 's',
    items: ['marigolds (cempasúchil)', 'a papel picado banner', 'a sugar skull', 'pan de muerto', 'candles on an altar', 'a photo of someone you miss', 'their favourite food', 'a monarch butterfly', 'a dancing skeleton', 'a candlelit path', 'a hummingbird', 'your own ofrenda corner'],
    cta: 'Watercolor by Pigeon Polly', link: L('/art-portfolio/bird/'),
    pt: '12 Day of the Dead Drawing Ideas: Día de Muertos Sketchbook Prompts',
    desc: 'Twelve warm Día de Muertos drawing ideas for November 1–2: marigolds, papel picado, pan de muerto, candles, monarch butterflies and the favourite food of someone you miss. With my watercolor of Pigeon Polly celebrating the holiday.',
    alt: 'A list of 12 Day of the Dead drawing ideas under a watercolor of a pigeon with marigolds and candles.',
    topics: 'Day of the Dead, Dia de Muertos art, Drawing ideas, Sketchbook prompts, November' },

  { n: 200, type: 'Полезный', theme: 'winter', tpl: 'list', art: img('images/snail/2024-mr-chew-celebrates-new-year-800.jpg'), artH: 400, pos: '50% 40%',
    tag: 'Handmade holiday cards', title: '12 cute *Christmas card* ideas to draw', h: 's',
    items: ['a bird in a knitted hat', 'a snail carrying a tiny tree', 'a mug of cocoa with a face', 'a mailbox stuffed with letters', 'one bauble on a branch', 'a window with lights and a cat', 'a gingerbread house', 'a sled full of presents', 'a snowman in a long scarf', 'a tangerine peel spiral', 'a lantern in the snow', 'two mittens holding hands'],
    cta: 'Watercolor by Pigeon Polly', link: L('/art-portfolio/snail/'),
    pt: '12 Cute Christmas Card Ideas to Draw by Hand',
    desc: 'Want to draw your own holiday cards this year? Twelve cute and simple ideas: a bird in a knitted hat, a snail carrying a tiny tree, a cocoa mug with a face, a window with lights and a cat. With my watercolor of Mr. Chew the snail celebrating New Year.',
    alt: 'A list of 12 Christmas card drawing ideas under a watercolor of a snail celebrating New Year.',
    topics: 'Christmas card ideas, DIY Christmas cards, Christmas drawing, Watercolor Christmas, Holiday crafts' },

  { n: 201, type: 'Полезный', theme: 'autumn', tpl: 'list', tight: 1, art: img('images/snail/2023-mr-chew-delivery-800.jpg'), artH: 330, pos: '50% 40%', one: true,
    tag: 'Snail mail art', title: '10 ways to *decorate an envelope*', h: 's',
    items: [['draw your own stamp', 'a tiny portrait, a cake, your cat'], ['write the address on a ribbon banner', ''], ['a character peeking out of the flap', ''], ['a painted wax seal circle', ''], ['a doodled washi-tape border', ''], ['a tiny map on the back', 'from your house to theirs'], ['a watercolor sky behind the address', ''], ['“do not open until…” with a little clock', ''], ['a snail guarding the corner', 'it will get there. eventually.'], ['a sticker cut from your sketchbook', '']].map(([a, b]) => b ? [a, b] : a),
    listCss: 'margin-top:22px', cta: 'Mr. Chew delivers', link: L('/art-portfolio/snail/'),
    pt: '10 Snail Mail Art Ideas: How to Decorate an Envelope',
    desc: 'Snail mail season is here. Ten easy ways to decorate an envelope by hand: your own drawn stamp, a ribbon banner for the address, a character peeking out of the flap, a tiny map on the back. Illustrated by Mr. Chew, my Australian postal snail.',
    alt: 'A list of 10 envelope decorating ideas under a watercolor of a snail delivering mail with balloons.',
    topics: 'Snail mail ideas, Envelope art, Pen pal, Mail art, Christmas cards' },

  { n: 202, type: 'Полезный', theme: 'winter', tpl: 'list', tight: 1, art: img('images/sketchbook/sketchbook-7-800.jpg'), artH: 360, pos: '50% 50%', one: true,
    tag: 'Urban sketching in winter', title: '10 tips for sketching *in the cold*', h: 's',
    items: ['Sketch from a café window. It counts.', 'Fingerless gloves + a hand warmer in your pocket.', 'Take a small sketchbook: A6 fits in a coat.', 'Ink outside, paint at home with a hot drink.', 'Keep sketches to 10 minutes. Then move.', 'One building, not the whole street.', 'Leave the paper white for snow.', 'Photograph the light, sketch the shapes.', 'Trams and buses are moving studios.', 'Your cocoa going cold is your timer.'],
    listCss: 'margin-top:22px', cta: 'From my sketchbook', link: L('/challenge/'),
    pt: 'Urban Sketching in Winter: 10 Tips for Drawing in the Cold',
    desc: 'Love urban sketching but it is freezing outside? Ten practical tips for winter sketching: draw from café windows, ink outside and paint at home, keep sketches short and leave the paper white for snow. With an ink and watercolor rooftop sketch from my sketchbook.',
    alt: 'A list of 10 winter urban sketching tips under an ink and watercolor sketch of city rooftops and towers.',
    topics: 'Urban sketching, Sketching tips, Winter, Ink and watercolor, Sketchbook' },

  { n: 203, type: 'Полезный', theme: 'purple', tpl: 'list', art: img('images/snail/2023-mr-chew-australian-postal-snail-introduction-800.jpg'), artH: 380, pos: '50% 45%', one: true,
    tag: 'Character design', title: '6 questions that give a character *a personality*', h: 'xs',
    items: [['What is their job?', 'Mr. Chew is an Australian postal snail.'], ['What do they always drink?', 'Detective Titos: “Coffee is not a drink. It is a method of investigation.”'], ['What silly thing do they keep doing?', 'Polly drinks the brush water. Again.'], ['Where do they live?', 'On Wobbleland, an island of eleven odd towns.'], ['How do they celebrate?', 'Polly meets every New Year in bed.'], ['What do they want more than anything?', 'Sometimes Mr. Chew just wants to retire.']],
    listCss: 'margin-top:20px', cta: 'Meet them in Wobbleland', link: L('/wobbleland/'),
    pt: 'Character Design Tips: 6 Questions That Give Your Character a Personality',
    desc: 'A character is more than a cute design. Six questions I ask about my own characters, with real answers: Mr. Chew the Australian postal snail, Detective Titos and his coffee, Pigeon Polly who keeps drinking the brush water. Meet them all on Wobbleland, my illustrated island.',
    alt: 'A character design worksheet with six questions and examples, under a watercolor of a snail postman.',
    topics: 'Character design, Original characters, Character ideas, Illustration tips, Storytelling' },

  { n: 204, type: 'Полезный', theme: 'autumn', tpl: 'free', body: photoBody, h: 's',
    tag: 'Free tool', title: 'Turn any photo into a *color palette*',
    cta: 'Nothing is uploaded', link: L('/palettes/'),
    pt: 'Free Color Palette Generator from Your Photo (with Color Names and HEX)',
    desc: 'Make a colour palette from your own photo in seconds: pick a picture, move the six droppers to the colours you love and download a palette card with colour names and HEX codes. Free, in the browser, your photo is never uploaded.',
    alt: 'A watercolor painting with six colour droppers on it and a palette of six named colours with HEX codes next to it.',
    topics: 'Color palette generator, Color palettes, Design tools, HEX codes, Color inspiration' },

  { n: 205, type: 'Полезный', theme: 'paper', tpl: 'list', art: img('images/sketchbook/sketchbook-11-800.jpg'), artH: 380, pos: '50% 50%',
    tag: '5-minute warm-ups', title: '10 sketchbook *warm-ups* before you draw', h: 's',
    items: ['blind contour of your hand', '30-second sketch of a mug', 'one shape, ten times smaller', 'a one-line drawing', 'draw with your other hand', 'a page of tone circles', 'copy something upside down', 'a 3-value thumbnail', '5 desk objects, 1 min each', 'ink straight away, no pencil'],
    cta: 'Then try today’s theme', link: L('/challenge/'),
    pt: '10 Sketchbook Warm-Up Exercises: 5-Minute Drawing Practice',
    desc: 'Ten quick drawing warm-ups to loosen your hand before the real sketch: blind contour, one-line drawing, drawing with your other hand, three-value thumbnails and ink without pencil. Save it for days when the first line feels scary.',
    alt: 'A list of 10 drawing warm-up exercises under an ink and watercolor sketch of a French press coffee maker.',
    topics: 'Drawing exercises, Sketchbook ideas, Drawing practice, Art tips, Drawing for beginners' },

  { n: 206, type: 'Полезный', theme: 'purple', tpl: 'list', tight: 1, art: shot('wobble.png'), artH: 250, pos: '50% 45%',
    tag: 'Drawing prompts', title: '20 prompts from a *fairy-tale island*', h: 's',
    items: ['a lantern carved from a lemon', 'a pancake like a fallen leaf', 'a snail parade with ribbons', 'a cheese braid with a red bow', 'a squirrel baker', 'a whole town of whistling kettles', 'pie-shaped lanterns under pines', 'poems hung on leaves', 'noodle confetti', 'a seagull at the head of the table', 'stew in a pot with a clock lid', 'candles left for the bees', 'a coat of mismatched buttons', 'a winking contest', 'mittens warming by an oven', 'amber lamps on a winter street', 'a giant communal teapot', 'ink made from berries', 'the longest cheese pull', 'a very honest confession note'],
    cta: 'Explore Wobbleland', link: L('/wobbleland/'),
    pt: '20 Whimsical Drawing Prompts from a Fairy-Tale Island',
    desc: 'Twenty whimsical drawing prompts taken from the holidays of Wobbleland, my illustrated island: lemon lanterns, a snail parade with ribbons, a town of whistling kettles, poems hung on leaves. Explore the map and meet the residents on my site.',
    alt: 'A list of 20 whimsical drawing prompts under a hand-drawn pixel map of a fairy-tale island with eleven towns.',
    topics: 'Drawing prompts, Whimsical art, Fantasy map, Sketchbook ideas, Cozy fantasy' },

  { n: 207, type: 'Игра', theme: 'winter', tpl: 'free', body: wlBody, h: 'xs',
    tag: 'Wobbleland holiday calendar', title: '8 cozy *winter holidays* to borrow from a fairy-tale island',
    cta: 'Open the holiday calendar', link: L('/wobbleland/'),
    pt: '8 Cozy Winter Holidays from a Fairy-Tale Island (Party Ideas)',
    desc: 'Golden Broth Week, the Golden Melt Festival, the Festival of Warm Ovens, Amber Night and Winter Brew Eve: eight cozy winter holidays from Wobbleland, my illustrated island. Borrow one for a friends night. The full holiday calendar and map are on my site.',
    alt: 'A list of eight made-up winter holidays with dates from November to January, like Golden Broth Week and Winter Brew Eve.',
    topics: 'Cozy winter, Party ideas, Fantasy world, Hygge, Winter activities' },

  // ---------- игры ----------
  { n: 208, type: 'Игра', theme: 'night', tpl: 'game', shot: shot('potions-autumn.png'), pix: 1, shotCss: 'height:820px', imgCss: 'height:100%;object-fit:cover;object-position:50% 0',
    kick: 'A Halloween game in your browser', title: 'Brew *potions* in a haunted maze', h: 's',
    chips: ['🎃 collect ingredients', '👻 dodge ghosts', '🧪 guess the recipe'],
    cta: 'Free · no download', link: L('/potions/'),
    pt: 'Cozy Halloween Browser Game: Brew Potions in a Pixel Maze',
    desc: 'Walk a pixel maze with your bird, grab pumpkins, bat wings and moon dust, dodge ghosts and the fog curse, then throw three ingredients into the cauldron. Nobody knows the recipes: you discover them yourself. A cozy free Halloween game on my site.',
    alt: 'A pixel art maze game with a little bird, ghosts, a door and Halloween ingredients like a pumpkin, a bat wing and a candle.',
    topics: 'Cozy games, Halloween games, Pixel art game, Browser games, Witchy aesthetic' },

  { n: 209, type: 'Игра', theme: 'night', tpl: 'free', body: ingBody, h: 's',
    tag: 'Witch’s pantry', title: '21 *potion ingredients* for a cozy Halloween',
    cta: 'Find them in the maze', link: L('/potions/'),
    pt: '21 Cute Potion Ingredients for a Cozy Witch Halloween',
    desc: 'Fly agaric, spider web, newt eye, mandrake root, moon dust, a four-leaf clover and grandma’s cookie: 21 potion ingredients from my Halloween potion game. Use them as drawing prompts, party labels or play the game and brew them yourself.',
    alt: 'A grid of 21 Halloween potion ingredients with icons: fly agaric, pumpkin, spider web, bat wing, newt eye, moon dust, candy apple and more.',
    topics: 'Witchy aesthetic, Halloween ideas, Potion ingredients, Cozy witch, Halloween party' },

  { n: 210, type: 'Игра', theme: 'winter', tpl: 'game', shot: shot('potions-winter.png'), pix: 1, shotCss: 'height:820px', imgCss: 'height:100%;object-fit:cover;object-position:50% 0',
    kick: 'From December in the Potion Lab', title: 'Winter *potions*: snowflakes & sleigh bells', h: 'xs',
    chips: ['❄️ snowflake', '🔔 sleigh bell', '🧤 lost mitten', '☕ cocoa'],
    cta: 'Free · in your browser', link: L('/potions/'),
    pt: 'Cozy Winter Browser Game: Brew Snowflake Potions',
    desc: 'In winter the Potion Lab maze turns icy blue and the ingredients change: snowflakes, fir twigs, a lost mitten, a sleigh bell and cocoa with marshmallows. Collect them with your bird and discover new potions. A free cozy game on my site.',
    alt: 'A blue winter pixel maze with a little bird, ghosts and winter ingredients like a snowflake, a fir tree and a bell.',
    topics: 'Cozy games, Winter aesthetic, Pixel art game, Browser games, Christmas games' },

  { n: 211, type: 'Игра', theme: 'purple', tpl: 'game', shot: shot('pancakes.png'), pix: 1, shotCss: 'height:860px', imgCss: 'height:100%;object-fit:cover;object-position:50% 0',
    kick: 'Polly opened a pancake window', title: 'Flip *pancakes* for a whole island', h: 's',
    chips: ['🥞 pick the pan', '🍓 add toppings', '🐻 bear courier'],
    cta: 'Free · in your browser', link: L('/pancakes/'),
    pt: 'Cozy Cooking Browser Game: Polly’s Pancakes',
    desc: 'Every resident of Wobbleland wants their own pancake: the right pan shape, the perfect flip and exactly the toppings from the order. Some customers are in a hurry, some are picky, and a bear courier brings jam. A cozy free cooking game on my site.',
    alt: 'A pixel art cooking game: a big frying pan, a pigeon chef and a customer at the window ordering a golden heart pancake.',
    topics: 'Cozy games, Cooking games, Pixel art game, Browser games, Pancakes' },

  { n: 212, type: 'Игра', theme: 'purple', tpl: 'game', shot: shot('rain.png'), pix: 1, shotCss: 'height:820px', imgCss: 'height:100%;object-fit:cover;object-position:50% 20%',
    kick: 'A two-minute break game', title: 'Catch the *buttons*, dodge the ink', h: 's',
    chips: ['🔘 buttons', '⭐ golden ones', '💧 ink blots', '❤️ 3 hearts'],
    cta: 'Play with your own bird', link: L('/rain/'),
    pt: 'Cute Pixel Browser Game: Catch the Falling Buttons',
    desc: 'Buttons are falling from the sky. Run your little pixel bird left and right to catch them and dodge the ink blots. Every level is a bit faster. A tiny cozy game for a coffee break, free on my site; the buttons buy outfits for your bird.',
    alt: 'A pixel art game with a pigeon catching falling buttons under a blue sky and dodging a black ink blot.',
    topics: 'Cozy games, Pixel art, Browser games, Cute games, Coffee break' },

  { n: 213, type: 'Игра', theme: 'winter', tpl: 'game', shot: img('images/games/advent.png'), pix: 1, shotCss: 'height:760px;background:#2B1A51', imgCss: 'height:100%;object-fit:contain',
    kick: 'Opens December 1', title: 'An *advent calendar* with a gift for your bird', h: 's',
    chips: ['🎁 31 windows', '⭐ 5 special ones', '🐦 pixel gifts'],
    cta: 'Pin it, open it in December', link: L('/advent/'),
    pt: 'Free Online Advent Calendar with Cute Pixel Gifts',
    desc: 'From December 1 to 31, one little window a day: open it and a bird flies out with a gift for your pixel bird. Five windows are special and the last one hides something legendary. Missed a day? Catch up until January 23. Free on my site.',
    alt: 'A pixel art advent calendar house with little windows and a pigeon, on a purple background.',
    topics: 'Advent calendar, Christmas countdown, Cozy games, Pixel art, December' },

  { n: 214, type: 'Игра', theme: 'night', tpl: 'game', shot: shot('titos.png'), pix: 1,
    kick: 'A cozy detective office', title: 'Detective Titos needs *coffee* (and you)', h: 's',
    on: 'Find the clues, pin them to the board, question the suspects and name the culprit before the coffee pot runs dry.',
    chips: ['🔍 62 cases', '☕ one coffee pot', '📌 clue board'],
    cta: 'Free · in your browser', link: L('/titos/'),
    pt: 'Cozy Mystery Browser Game: Detective Titos',
    desc2: '',
    alt: 'A pixel art detective office at night with a clue board, filing cabinets and a slug detective in a tie.',
    topics: 'Cozy mystery, Detective games, Pixel art game, Browser games, Cozy games' },

  { n: 215, type: 'Игра', theme: 'purple', tpl: 'game', shot: shot('shift.png'), pix: 1,
    kick: 'A cozy focus timer', title: 'Study with *Polly*: a pixel office pomodoro', h: 's',
    on: 'Set the timer, pick a retro tune and Polly works next to you: typing, drinking coffee, watering the plant.',
    chips: ['⏱ 20 min – 1.5 h', '🎵 retro music', '🌧 rain on the window'],
    cta: 'Free focus timer', link: L('/shift/'),
    pt: 'Cozy Pixel Focus Timer: Study and Work with Polly',
    alt: 'A pixel art office with a pigeon at a computer, a water cooler, plants and a 40-minute focus timer.',
    topics: 'Study with me, Pomodoro timer, Productivity, Cozy aesthetic, Pixel art' },

  { n: 216, type: 'Игра', theme: 'autumn', tpl: 'game', shot: shot('office.png'), pix: 1,
    kick: 'October in Polly’s office', title: 'The report is *everywhere*. Help Polly find it', h: 'xs',
    on: 'Click anything in the room: everything has something to say. Find the scattered pages before the end of the day.',
    chips: ['🖱 click everything', '📄 find the pages', '🌙 day & evening'],
    cta: 'Free · in your browser', link: L('/polly-office/'),
    pt: 'Cozy Point-and-Click Game: Help Polly the Office Pigeon',
    alt: 'A pixel art office in October with a pigeon in a scarf holding a coffee, a calendar, bookshelves and a speech bubble.',
    topics: 'Point and click games, Cozy games, Pixel art, Office humor, Browser games' },

  { n: 217, type: 'Игра', theme: 'purple', tpl: 'game', shot: shot('wobble.png'), shotCss: 'height:760px', imgCss: 'height:100%;object-fit:cover',
    kick: 'An illustrated island', title: 'Explore *Wobbleland*: 11 slightly ridiculous towns', h: 'xs',
    on: 'Zoom into the map, open a town, read its motto, its holidays and recipes, and meet the residents at home.',
    chips: ['🗺 pixel map', '📖 recipe book', '📅 holiday calendar'],
    cta: 'Your feathered guide: Polly', link: L('/wobbleland/'),
    pt: 'Explore a Cozy Fantasy Map: Wobbleland, an Island of 11 Towns',
    alt: 'A detailed pixel art fantasy map of an island with eleven towns, crests, roads and a blue sea.',
    topics: 'Fantasy map, Cozy fantasy, Worldbuilding, Pixel art, Illustrated map' },

  { n: 218, type: 'Игра', theme: 'night', tpl: 'game', shot: shot('wl-tear.png'), shotCss: 'height:700px;background:#2B1A51;border-color:#F5C46B', imgCss: 'height:100%;object-fit:contain',
    kick: 'Wobbleland · October 31', title: '*Lantern Lemon Night*: Halloween with lemons', h: 's',
    on: 'In LemonVale lanterns are carved out of lemons, children knock on doors for lemon pastries and families tell spooky stories around the citrus lights.',
    chips: ['🍋 lemon lanterns', '👻 spooky stories'],
    cta: 'See all the holidays', link: L('/wobbleland/'),
    pt: 'Lantern Lemon Night: a Cozy Fairy-Tale Halloween Idea',
    alt: 'A tear-off calendar page for October 31 with the holiday Lantern Lemon Night and the crest of LemonVale.',
    topics: 'Halloween ideas, Cozy Halloween, Fantasy world, Worldbuilding, Autumn' },

  // ---------- Школа Полли ----------
  { n: 219, type: 'Игра', theme: 'purple', tpl: 'game', shot: shot('school-top.png'),
    kick: 'Free drawing lessons in your browser', title: '*Polly’s* Drawing School', h: 's',
    on: 'Pen, paper and twelve small lessons with a pixel pigeon teacher. Every lesson ends with a real client from Wobbleland.',
    chips: ['✏️ pen & paper', '📮 Polly checks your page', '🎓 pixel diploma'],
    cta: '12 lessons · free', link: LS('/polly-helps/'),
    pt: 'Learn to Draw for Beginners: Free Drawing Lessons at Polly’s School',
    desc: 'Grab any paper and a pen, a napkin works too. Polly the pixel pigeon teaches drawing in twelve small lessons: shapes, lines, texture, volume, shadows and more. Each lesson ends with a client from Wobbleland, you hand in a photo of your page and Polly sends a stamp or a note.',
    alt: 'A drawing school web page with a pixel pigeon teacher in a beret next to an easel with circles, squares and triangles, and a path of twelve lessons.',
    topics: 'Learn to draw, Drawing for beginners, Drawing lessons, Art education, Sketching' },

  { n: 220, type: 'Полезный', theme: 'paper', tpl: 'free', body: shapesBody, h: 's',
    tag: 'Drawing for beginners', title: 'Everything is made of *a few shapes*',
    sub: 'Shapes first, details later: that’s the whole trick.',
    cta: 'Lesson 1 with Polly', link: LS('/polly-helps/'),
    pt: 'Easy Drawing Trick for Beginners: Start Every Object with Simple Shapes',
    desc: 'Circle, square, triangle and two ovals, one standing and one lying: almost everything around you is built from them. A loop and two hands turn a circle into a clock, a handle and an egg turn a lopsided circle into a frying pan. Lesson 1 of Polly’s free drawing school.',
    alt: 'Hand-drawn basic shapes, a circle turning into a wall clock and a lopsided circle turning into a frying pan with a fried egg.',
    topics: 'Drawing for beginners, Drawing tutorial, Basic shapes, Sketching tips, Learn to draw' },

  { n: 221, type: 'Полезный', theme: 'paper', tpl: 'list', one: 1, art: sch('l1-s1.png'), artH: 292, h: 's',
    tag: '10-minute warm-up', title: 'A drawing warm-up for *total beginners*',
    items: [['Draw each shape five times', 'circle, square, triangle, a standing oval and a lying one'], ['Crooked ones count', 'a wobbly circle is still a circle, and much more alive'], ['Pick two things at home', 'a mug, a book, a lamp, a fruit, a bottle'], ['First only the big shapes', 'circle, rectangle, oval, drawn lightly'], ['Then a couple of details', 'a handle, a label, a shadow']],
    cta: 'Show your page to Polly', link: LS('/polly-helps/'),
    pt: 'Easy Drawing Warm-Up for Beginners: 5 Steps with Pen and Paper',
    desc: 'Ten minutes, any paper and a pen. Draw each basic shape five times, crooked ones count, then pick two things at home, a mug, a lamp or a fruit, and draw them shapes first, details later. From lesson 1 of Polly’s free drawing school, where you can hand in your page.',
    alt: 'A five-step drawing warm-up list for beginners under a row of hand-drawn circle, square, triangle and ovals.',
    topics: 'Drawing exercises, Drawing for beginners, Sketchbook ideas, Learn to draw, Art practice' },

  { n: 222, type: 'Игра', theme: 'purple', tpl: 'game', shot: shot('school-quiz.png'),
    kick: 'Lesson 1 · Shapes', title: 'A lopsided circle. *Guess* what it becomes', h: 'xs',
    on: 'Polly draws, you guess, and every word of hers stays in the lesson so you can go back to any picture.',
    chips: ['🌙 the moon?', '🍳 a frying pan?', '🔘 a button?'],
    cta: 'Find out at Polly’s school', link: LS('/polly-helps/'),
    pt: 'Fun Drawing Lesson for Beginners: Guess What the Circle Becomes',
    desc: 'The moon, a frying pan or a button? Polly the pixel pigeon turns simple circles into things right on her easel and asks you to guess. A playful first drawing lesson with a guessing game, a find-the-shapes game and a real task for your paper.',
    alt: 'A drawing lesson on a web page: a pixel pigeon by an easel with a lopsided circle and three answer buttons, the moon, a frying pan and a button.',
    topics: 'Drawing lessons, Drawing for kids, Learn to draw, Art games, Creative activities' },

  { n: 223, type: 'Полезный', theme: 'paper', tpl: 'free', body: lampBody, h: 's',
    tag: 'Drawing exercise', title: 'Find the *hidden shapes* in a lamp',
    cta: 'Play it in lesson 1', link: LS('/polly-helps/'),
    pt: 'How to Draw Any Object: Find the Hidden Shapes First',
    desc: 'A lamp is just a trapezoid, a rectangle and an oval. Look at any object, name its big shapes, draw only those, lightly, then add two details. A simple exercise that makes drawing from life feel much less scary. Try the find-the-shapes game in Polly’s free drawing school.',
    alt: 'A simple table lamp split into colored shapes: a trapezoid shade, a rectangle stand and an oval base, with three drawing steps.',
    topics: 'How to draw, Drawing for beginners, Observational drawing, Drawing exercises, Art tutorials' },

  { n: 224, type: 'Игра', theme: 'autumn', tpl: 'free', body: clientBody, h: 's',
    tag: 'Polly’s Drawing School', title: 'Your first drawing *client* is a mouse',
    sub: 'Every lesson ends with an order from a Wobbleland resident. Draw it on paper, hand in a photo, get a stamp from Polly.',
    cta: 'Take the order', link: LS('/polly-helps/'),
    pt: 'A Drawing Lesson with a Story: Draw for a Client from Wobbleland',
    desc: 'Mr. Crisper runs the lost-and-found at Wobbleland station, and nothing there has a label. Draw two things for him in simple shapes, take a photo of your page and hand it in to Polly. She sends back a stamp or a note on what to try again. Free, in your browser.',
    alt: 'A watercolor card of a mouse in glasses holding a box, next to his speech bubble asking for drawings of lost things.',
    topics: 'Drawing prompts, Drawing lessons, Watercolor illustration, Cozy games, Storytelling' },

  { n: 225, type: 'Полезный', theme: 'purple', tpl: 'list', h: 's', art: shot('school-top.png'), artH: 330, pos: '50% 0', listCss: 'margin-top:24px',
    tag: 'Learn to draw step by step', title: '12 lessons from *shapes* to *collage*',
    items: ['Shapes', 'Lines', 'Texture', 'Combinations', 'Volume', 'Shadows', 'Details', 'Cylinders', 'Ellipses', 'Pro secrets', 'Composition', 'Collage'],
    sub: 'One small lesson at a time, with pen and paper. After twelve stamps: a pixel diploma.',
    cta: 'Start with lesson 1', link: LS('/polly-helps/'),
    pt: 'Learn to Draw Step by Step: a 12-Lesson Path for Beginners',
    desc: 'A drawing path for beginners in twelve small steps: shapes, lines, texture, combinations, volume, shadows, details, cylinders, ellipses, pro secrets, composition and collage. Polly’s free drawing school follows it one lesson at a time, with exercises from my book Watercolor Sketches: Creative Guide.',
    alt: 'A numbered list of twelve drawing lessons from shapes and lines to composition and collage.',
    topics: 'Learn to draw, Drawing for beginners, Art curriculum, Sketching, Drawing practice' },
];
// у игр описание для Notion — desc (если в шаблоне desc показан на картинке, текст для Pinterest — отдельный)
const PIN_DESC = {
  214: 'Detective Titos has a pile of cases and one coffee pot. Find the clues, pin them to the board, question the suspects and name the culprit before the coffee runs out: without coffee, Titos falls asleep. A cozy pixel mystery game, free on my site.',
  215: 'A cozy focus timer for studying or working: set 20 minutes to 1.5 hours, pick a retro tune or rain on the window, and Polly the pigeon works next to you in her pixel office, typing, drinking coffee and watering the plant. Free on my site.',
  216: 'Polly got an urgent email from the Council and her report is scattered all over the office. Click anything in the pixel room, everything has something to say, and help her find the pages before the evening. A tiny cozy point-and-click game.',
  217: 'Wobbleland is my illustrated island of eleven slightly ridiculous towns. Zoom into the pixel map, open a town and read its motto, holidays and recipes, meet the residents at home. Polly the pigeon is your feathered guide.',
  218: 'On Wobbleland, Halloween is Lantern Lemon Night: lanterns carved from lemons, children knocking on doors for lemon pastries and spooky stories by citrus light. A cozy idea to borrow this October, from my illustrated island.',
};
PINS.forEach(p => { if (PIN_DESC[p.n]) p.pdesc = PIN_DESC[p.n]; else if (!p.pdesc) p.pdesc = p.desc; });

(async () => {
  const want = process.argv.slice(2).map(Number);
  const list = want.length ? PINS.filter(p => want.includes(p.n)) : PINS;
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  for (const p of list) {
    const t = TH[p.theme];
    const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&display=swap"><style>${CSS(t)}</style></head><body><div class="pin">${T[p.tpl](p)}</div>${foot(t, p.cta, String(p.n).padStart(3, '0'))}</body></html>`;
    const f = path.join(__dirname, 'out.html'); fs.writeFileSync(f, html);
    await page.goto('file://' + f, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // проверка: ничего не вылезает за низ (над подвалом)
    const over = await page.evaluate(() => { const pin = document.querySelector('.pin'); let m = 0; pin.querySelectorAll('*').forEach(e => { m = Math.max(m, e.getBoundingClientRect().bottom); }); return m; });
    if (over > 1340) console.log('⚠ pin', p.n, 'content bottom', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, 'site/images/pins', `pin-${p.n}.jpg`), type: 'jpeg', quality: 88 });
    console.log('pin', p.n);
  }
  fs.unlinkSync(path.join(__dirname, 'out.html'));
  await b.close();
  const meta = PINS.map(p => ({ n: p.n, type: p.type, title: p.pt, desc: p.pdesc, alt: p.alt, link: p.link, topics: p.topics, media: `${SITE}/images/pins/pin-${p.n}.jpg` }));
  fs.writeFileSync(path.join(__dirname, 'pins2.json'), JSON.stringify(meta, null, 1));
})();
