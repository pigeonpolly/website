// Каталог вещей для сервера: PPBirds.GIFTS после birds.js и room.js → site/assets/catalog.json (сервер берёт оттуда «🎲 Сюрприз» — случайную вещь категории).
// Запускает build.py: node tools/catalog.js <корень сайта>
const fs = require('fs'), path = require('path');
const root = process.argv[2];
const stubEl = () => ({ style: { setProperty() {} }, classList: { add() {}, toggle() {} }, appendChild() {}, addEventListener() {}, getContext: () => new Proxy({}, { get: () => () => ({ data: [] }) }) });
global.window = {}; global.document = { documentElement: { lang: 'en' }, createElement: stubEl, querySelector: () => null, addEventListener() {} };
global.matchMedia = () => ({ matches: false });
for (const f of ['birds.js', 'room.js', 'garden-items.js']) new Function(fs.readFileSync(path.join(root, 'site/assets', f), 'utf8'))();
const B = window.PPBirds;
const real = B.GIFT_KINDS.map(k => k[0]).filter(k => k !== 'any'); // any — сами «Сюрпризы», в сумку не попадают
const out = { kinds: real, items: Object.fromEntries(real.map(k => [k, B.GIFTS[k]])), legend: [...B.LEGEND].filter(x => !x.startsWith('any|')) };
// ---------- ценность вещей (базовая цена в пуговках при обычном запасе ~10 шт.) ----------
// ориентир: птичка, которая рисует каждый день, получает ~400 🔘 в месяц (вход 3, рисунок 10, комментарии, бейджи)
const R = window.PPRoom, r5 = n => Math.max(5, Math.round(n / 5) * 5);
const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 1000; return h / 1000; }; // небольшой разброс, чтобы не всё по одной цене
const SPECIAL_HATS = ['wizard', 'witch', 'pumpkin', 'santa', 'antlers', 'wreath', 'pirate', 'chef', 'graduation', 'headset', 'leafcrown', 'strawhat', 'heartband', 'beanie', 'cowboy', 'tiara', 'frog', 'viking', 'kittyears', 'bunnyears', 'propeller', 'sunflowers', 'pancakehat'];
const GEMS = ['crystal', 'ring', 'pearl', 'ruby', 'sapphire', 'key', 'sword', 'wand', 'star', 'coin'];
const FOOD = ['coffee', 'croissant', 'pizza', 'cherry', 'lollipop', 'candycane', 'icecream', 'cheese', 'mushroom', 'minipumpkin', 'spoon', 'donut', 'cookie', 'apple', 'carrot', 'cupcake', 'bubbletea', 'pancake', 'syrup'];
const animated = d => d && typeof d.d === 'function' && /\bt\b/.test(String(d.d).split('=>')[0]); // рисунок зависит от времени — шевелится
function value(kind, v) {
  const key = kind + '|' + v, leg = B.LEGEND.has(key), base = v.split(':')[0];
  if (leg) return ['furn', 'deco', 'wall', 'floor', 'view', 'curtain', 'garden'].includes(kind) ? 600 : 500;
  switch (kind) {
    case 'hat': return SPECIAL_HATS.includes(base) ? 45 : 30;
    case 'shoes': return 30;
    case 'scarf': return 25;
    case 'item': return GEMS.includes(base) ? 35 : FOOD.includes(base) ? 15 : 20;
    case 'bg': return v.startsWith('#') ? 20 : 50;
    case 'frame': return v === 'dotted' ? 30 : /^[a-z]+$/.test(v) && ['web', 'candycorn', 'bats', 'autumnwreath', 'mushrooms', 'flowers', 'canestripe', 'lights', 'pixel', 'catears', 'bubbles', 'sunrays', 'clouds', 'jewels'].includes(v) ? 60 : 45;
    case 'anim': return ['sparkle', 'heart', 'disco'].includes(v) ? 100 : 80;
    case 'wall': return 70; case 'floor': return 60; case 'curtain': return v === 'rainbow' ? 70 : 45;
    case 'garden': return (window.PPGardenItems.ITEMS[v] || {}).p || 30; // вещи для огорода (garden-items.js)
    case 'view': return ['night', 'sea', 'snow', 'space', 'aurora'].includes(v) ? 120 : 85;
  }
  const d = R && R.defOf(kind, v); if (!d) return 30;
  if (d.box) return 30 + Math.round(d.w / 2); // коробки (этап 11 Г)
  if (d.wall) return 30 + Math.round(d.w / 4) + (animated(d) ? 10 : 0); // полки на стену: доска — недорого
  const area = (d.w || 10) * (d.h || 10);
  let p = kind === 'deco' ? (area < 40 ? 15 : area < 150 ? 25 : 45) : (area < 60 ? 20 : area < 150 ? 35 : area < 300 ? 55 : area < 500 ? 75 : 95);
  if (animated(d)) p += kind === 'deco' ? 10 : 15; // мигает, светится, шевелится
  if (d.glow) p += 10;
  if (d.top != null && kind === 'furn' && area >= 150) p += 5; // на неё можно ставить и прыгать
  return p;
}
out.prices = {};
for (const k of real) for (const v of B.GIFTS[k]) out.prices[k + '|' + v] = r5(value(k, v) * (0.9 + hash(k + v) * 0.2));
// «🎲 Сюрприз» категории — чуть дороже средней вещи (выпадает то, чего нет); любой — 60; легендарный — 650
for (const k of real) { const ps = B.GIFTS[k].filter(v => !B.LEGEND.has(k + '|' + v)).map(v => out.prices[k + '|' + v]).sort((a, b) => a - b); out.prices[k + '|?'] = r5((ps[Math.floor(ps.length / 2)] || 30) * 1.2); }
out.prices['any|?'] = 60; out.prices['any|legend'] = 650;
fs.writeFileSync(path.join(root, 'site/assets/catalog.json'), JSON.stringify(out));
console.log(Object.entries(out.items).map(([k, v]) => k + ':' + v.length).join(' '), 'legend', out.legend.length);
// праздники Воббленда (docs/wobbleland.md «Праздничные письма»): дата, город, название, описание и подарок на 3 языках → site/assets/wl-holidays.json (worker/wl-holidays.js)
const WL = JSON.parse(fs.readFileSync(path.join(root, 'content/wobbleland.json'), 'utf8')), MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const wlTr = ['ru', 'lv'].map(l => { try { return JSON.parse(fs.readFileSync(path.join(root, `content/i18n/wobbleland.${l}.json`), 'utf8')); } catch (e) { return {}; } });
const wl = [];
for (const c of WL.cities) c.holidays.forEach((h, i) => {
  if (!h.gift) return;
  const [m, d] = h.date.split(' '), tr = wlTr.map(t => ((t[c.key] || {}).holidays || [])[i] || {}), [k, v] = h.gift.split('|');
  wl.push({ md: String(MON.indexOf(m.slice(0, 3)) + 1).padStart(2, '0') + '-' + String(+d).padStart(2, '0'), city: c.key, i,
    town: [c.name, ...wlTr.map(t => (t[c.key] || {}).name || c.name)], title: [h.title, ...tr.map(t => t.title || h.title)], desc: [h.desc, ...tr.map(t => t.desc || h.desc)],
    gift: h.gift, giftName: [0, 1, 2].map(L => B.giftName(k, v, L)) });
});
fs.writeFileSync(path.join(root, 'site/assets/wl-holidays.json'), JSON.stringify(wl.sort((a, b) => a.md < b.md ? -1 : 1), null, 0));
