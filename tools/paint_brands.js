// Бренды красок для /color-mixing/ (docs/palettes.md, «Смешивание цветов → Бренды»).
// content/paint-brands-raw.json — составы с официальных сайтов (пигменты по Colour Index у каждой краски)
// → site/assets/paint-brands.json: у каждой краски цвет из тюбика (m) и разбел 1:3 (t), посчитанные смешением её пигментов.
// Запуск: node tools/paint_brands.js
const fs = require('fs'), path = require('path');
const M = require('../site/assets/mixing.js');
const ROOT = path.join(__dirname, '..');
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/paint-brands-raw.json'), 'utf8'));

// ── цвет: CIELAB (D50, как у измерений Daniel Smith) → sRGB с бережным сжатием насыщенности в охват экрана ──
const lin = v => v > 0.0031308 ? 1.055 * v ** (1 / 2.4) - 0.055 : 12.92 * v;
function oklabToRgb(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
}
function oklchHex(L, C, h) {
  for (let c = C; c >= 0; c -= 0.002) {
    const rgb = oklabToRgb(L, c * Math.cos(h * Math.PI / 180), c * Math.sin(h * Math.PI / 180));
    if (rgb.every(v => v >= -0.0005 && v <= 1.0005)) return '#' + rgb.map(v => Math.round(255 * Math.min(1, Math.max(0, lin(v)))).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  return '#808080';
}
function labD50toOklch(L, a, b) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200, f = t => t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787;
  let X = 0.96422 * f(fx), Y = f(fy), Z = 0.82521 * f(fz);
  // Bradford D50 → D65
  [X, Y, Z] = [0.9555766 * X - 0.0230393 * Y + 0.0631636 * Z, -0.0282895 * X + 1.0099416 * Y + 0.0210077 * Z, 0.0122982 * X - 0.0204830 * Y + 1.3299098 * Z];
  const l = Math.cbrt(0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z), m = Math.cbrt(0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z), s = Math.cbrt(0.0482003018 * X + 0.2643662691 * Y + 0.6338517070 * Z);
  const o = [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  return [o[0], Math.hypot(o[1], o[2]), (Math.atan2(o[2], o[1]) * 180 / Math.PI + 360) % 360];
}
// разбел (t) по образцу: из него тюбик (m) — темнее (у ярких жёлтых — чуть-чуть)
function fromSwatch(L, C, h) {
  const drop = L > 0.88 ? 0.07 : L > 0.8 ? 0.15 : 0.25;
  return { m: oklchHex(Math.max(0.12, L - drop), C * (L > 0.8 ? 1.05 : 0.95), h), t: oklchHex(L, C, h) };
}
const fromLab = lab => fromSwatch(...labD50toOklch(...lab));
const fromHex = hex => { const l = M.lch(M.labOfHex(hex)); return fromSwatch(l[0], l[1], l[2]); };

// ── библиотека пигментов: код (и вариант по названию краски) → m, t ──
// 1) 16 базовых пигментов страницы — ровно как в mixing.js (PIG), 2) измеренные образцы Daniel Smith (CIELAB с danielsmith.com),
// 3) остальные — приблизительный разбел по типичным выкраскам (HEX), помечены est.
const base = id => { const p = M.P[id]; return { m: p.m, t: p.t }; };
const DS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/paint-brands-raw.json'), 'utf8')).find(l => l.id === 'ds-extrafine').paints;
const dsLab = n => { const p = DS.find(x => x.n === n); if (!p || !p.lab) throw new Error('нет образца DS: ' + n); return fromLab(p.lab); };
const LIB = {
  // базовые
  PY3: base('lemon'), PY74: base('hansa'), PY97: base('hansa'), 'PY42:ochre': base('ochre'), 'PY43:ochre': base('ochre'),
  PR255: base('scarlet'), PR108: base('scarlet'), PR254: base('pyrrol'), 'PV19:rose': base('qrose'), 'PR122:magenta': base('qmag'),
  PR177: base('aliz'), PR83: base('aliz'), 'PR83:1': base('aliz'), PV23: base('viol'), PB29: base('ultra'), 'PB15:3': base('phthalo'), 'PB15:4': base('phthalo'),
  PB35: base('cerul'), 'PB36:cerulean': base('cerul'), PG7: base('pgreen'), 'PBr7:burnt-sienna': base('bsienna'), 'PBr7:burnt-umber': base('bumber'),
  PBk9: base('black'), PBk11: base('black'),
  // Daniel Smith, измерено
  PB15: dsLab('Phthalo Blue (Red Shade)'), 'PB15:1': dsLab('Phthalo Blue (Red Shade)'), 'PB15:6': dsLab('Phthalo Blue (Red Shade)'), 'PB15:manganese': dsLab('Manganese Blue Hue'),
  PB16: dsLab('Phthalo Blue Turquoise'), PB27: dsLab('Prussian Blue'), PB28: dsLab('Cobalt Blue'), 'PB36:turquoise': dsLab('Cobalt Turquoise'), PB60: dsLab('Indanthrone Blue'), PB82: dsLab('Mayan Dark Blue'),
  PBk10: dsLab('Graphite Gray'), PBk31: dsLab('Perylene Green'), PBk6: dsLab('Lamp Black'), PBr11: dsLab('Lunar Earth'), PBr24: dsLab('Chrome Titanate Yellow'), PBr25: dsLab('Permanent Brown'),
  PBr6: dsLab('Enviro-Friendly Brown Iron Oxide'), 'PBr7:raw-sienna': dsLab('Raw Sienna'), 'PBr7:raw-umber': dsLab('Raw Umber'), 'PBr7:vandyke': dsLab('Van Dyck Brown'),
  PG17: dsLab('Chromium Green Oxide'), PG18: dsLab('Viridian'), PG19: dsLab('Cobalt Green Pale'), PG26: dsLab('Cobalt Green Deep'), PG36: dsLab('Phthalo Green (Yellow Shade)'),
  PG50: dsLab('Cobalt Green'), 'PG50:teal': dsLab('Cobalt Teal Blue'),
  PO43: dsLab('Perinone Orange'), PO48: dsLab('Quinacridone Burnt Orange'), PO62: dsLab('Permanent Orange'), PO71: dsLab('Transparent Pyrrol Orange'), PO73: dsLab('Pyrrol Orange'),
  PR101: dsLab('Indian Red'), 'PR101:light': dsLab('English Red Ochre'), 'PR101:venetian': dsLab('Venetian Red'), 'PR101:transparent': dsLab('Transparent Red Oxide'), 'PR101:burnt-sienna': base('bsienna'),
  PR102: dsLab('Burnt Yellow Ochre'), 'PR122:pink': dsLab('Opera Pink'), PR149: dsLab('Perylene Scarlet'), PR168: dsLab('Anthraquinoid Scarlet'), PR170: dsLab('Permanent Red'),
  PR171: dsLab('Naphthamide Maroon'), PR175: dsLab('Deep Scarlet'), PR176: dsLab('Carmine'), PR178: dsLab('Perylene Red'), PR179: dsLab('Perylene Maroon'), PR188: dsLab('Organic Vermilion'),
  PR202: dsLab('Quinacridone Magenta'), PR206: dsLab('Quinacridone Burnt Scarlet'), PR209: dsLab('Quinacridone Coral'), PR233: dsLab("Potter's Pink"), PR264: dsLab('Pyrrol Crimson'),
  PR287: dsLab('Mayan Red'), PR290: dsLab('Earthy Light Red'),
  PV14: dsLab('Cobalt Violet Deep'), PV15: dsLab('Ultramarine Violet'), PV16: dsLab('Manganese Violet'), 'PV19:red': dsLab('Quinacridone Red'), 'PV19:violet': dsLab('Quinacridone Violet'),
  PV29: dsLab('Perylene Violet'), PV32: dsLab('Bordeaux'), PV42: dsLab('Quinacridone Pink'), PV49: dsLab('Cobalt Violet'), PV55: dsLab('Quinacridone Purple'), PV58: dsLab('Mayan Violet'),
  PY110: dsLab('Permanent Yellow Deep'), PY129: dsLab('Rich Green Gold'), PY138: dsLab('Quinophthalone Yellow'), PY139: dsLab('Isoindoline Yellow'), PY150: dsLab('Nickel Azo Yellow'),
  PY151: dsLab('Azo Yellow'), PY175: dsLab('Lemon Yellow'), PY184: dsLab('Bismuth Vanadate Yellow'), PY223: dsLab('Mayan Yellow'), PY40: dsLab('Aureolin (Cobalt Yellow)'),
  'PY42:mars': dsLab('Mars Yellow'), 'PY42:transparent': dsLab('Transparent Yellow Oxide'), 'PY43:raw-sienna': dsLab('Raw Sienna'), PY53: dsLab('Nickel Titanate Yellow'), PY65: dsLab('Hansa Yellow Deep'),
  'PW6:1': dsLab('Buff Titanium'),
  // приблизительно (est): типичные выкраски
  PY35: fromHex('#FBD94A'), PY37: fromHex('#F9B93A'), PY154: dsLab('Azo Yellow'), PY83: fromHex('#F3A83A'), PY159: fromHex('#F4DC5A'), PY1: fromHex('#F6DF4E'), PY6: fromHex('#F7D24A'),
  PY14: fromHex('#F6D24A'), PY119: fromHex('#E3A86A'), PY128: fromHex('#E9D85A'), PY153: fromHex('#E7A64A'), PY155: fromHex('#F4D44E'), PY216: fromHex('#F2D59A'),
  PO20: fromHex('#F58E4A'), PO13: fromHex('#F6964E'), PO34: fromHex('#F59A4E'), PO36: fromHex('#E9864E'), PO64: fromHex('#F07A4A'), PO67: fromHex('#F39A50'), PO72: fromHex('#F0864A'),
  PR9: fromHex('#E8686A'), PR12: fromHex('#B8485A'), PR19: dsLab('Quinacridone Red'), PR23: fromHex('#D5586A'), PR112: fromHex('#E35A56'), PR144: fromHex('#C8485A'), PR169: fromHex('#E26BA0'),
  PR173: fromHex('#D8667E'), PR187: fromHex('#C64C62'), PR207: fromHex('#D87A6A'), PR242: fromHex('#E8664E'), 'PR48:4': fromHex('#C8486A'), PR88: fromHex('#B65A86'), PR144x: null,
  PV1: fromHex('#C2569A'), PV2: fromHex('#C4588E'), PV3: fromHex('#8A5AA8'), PV37: fromHex('#7A5AA0'), PV47: fromHex('#9A7AB8'), PV62: fromHex('#8C7AA6'),
  PB1: fromHex('#4A6AB8'), PB66: fromHex('#4A5A8A'), PB74: fromHex('#3F6AB8'),
  PG8: fromHex('#5A8A5A'), PG23: fromHex('#8E9C80'),
  PBk7: dsLab('Lamp Black'), PBk8: fromHex('#4E4E52'), PBk1: fromHex('#4A4A4E'), PBk19: fromHex('#7A7A80'), PBk26: fromHex('#5A5450'),
  PBr8: fromHex('#8A7466'), PBr33: fromHex('#8E6A58'), PBr41: fromHex('#A07A5E'),
  PW6: { m: '#F6F6F2', t: '#F6F6F2', white: 1 }, PW4: { m: '#F7F7F5', t: '#F7F7F5', white: 1 }, PW5: { m: '#F5F5F2', t: '#F5F5F2', white: 1 }, PW7: { m: '#F4F4F2', t: '#F4F4F2', white: 1 },
};
delete LIB.PR144x;
const EST = new Set(['PY35', 'PY37', 'PY83', 'PY159', 'PY1', 'PY6', 'PY14', 'PY119', 'PY128', 'PY153', 'PY155', 'PY216', 'PO20', 'PO13', 'PO34', 'PO36', 'PO64', 'PO67', 'PO72', 'PR9', 'PR12', 'PR23', 'PR112', 'PR144', 'PR169', 'PR173', 'PR187', 'PR207', 'PR242', 'PR48:4', 'PR88', 'PV1', 'PV2', 'PV3', 'PV37', 'PV47', 'PV62', 'PB1', 'PB66', 'PB74', 'PG8', 'PG23', 'PBk8', 'PBk1', 'PBk19', 'PBk26', 'PBr8', 'PBr33', 'PBr41']);

// у некоторых кодов несколько разных пигментов (сиена/умбра, розовый/фиолетовый хинакридон) — уточняем по названию краски
function resolve(code, name) {
  const n = name.toLowerCase();
  const has = (...w) => w.some(x => n.includes(x));
  if (code === 'PBr7') return has('raw sienna', 'natural sienna', 'сиена натур', 'monte amiata', 'gold ochre') ? 'PBr7:raw-sienna' : has('raw umber', 'greenish umber', 'umber natural', 'natural umber') ? 'PBr7:raw-umber' : has('van dyck', 'vandyke', 'van dyke', 'sepia') ? 'PBr7:vandyke' : has('umber', 'умбра', 'brown') ? 'PBr7:burnt-umber' : 'PBr7:burnt-sienna';
  if (code === 'PR101') return has('burnt sienna', 'сиена') ? 'PR101:burnt-sienna' : has('transparent', 'oxide brown') ? 'PR101:transparent' : has('venetian', 'венециан') ? 'PR101:venetian' : has('light red', 'english red', 'red ochre', 'pompeii', 'terracotta') ? 'PR101:light' : 'PR101';
  if (code === 'PY42') return has('ochre', 'охра', 'naples') ? 'PY42:ochre' : has('transparent', 'raw sienna', 'sienna') ? 'PY42:transparent' : 'PY42:mars';
  if (code === 'PY43') return has('sienna', 'сиена') ? 'PY43:raw-sienna' : 'PY43:ochre';
  if (code === 'PV19') return has('violet', 'purple', 'magenta', 'фиолет', 'lilac', 'сирен') ? 'PV19:violet' : has('red', 'crimson', 'красн', 'carmine') ? 'PV19:red' : 'PV19:rose';
  if (code === 'PR122') return has('pink', 'opera', 'neon', 'роз', 'пион') ? 'PR122:pink' : 'PR122:magenta';
  if (code === 'PB15') return has('manganese', 'cerulean', 'sky', 'cyan', 'небес') ? 'PB15:manganese' : 'PB15';
  if (code === 'PB36') return has('turquoise', 'бирюз', 'турец') ? 'PB36:turquoise' : 'PB36:cerulean';
  if (code === 'PG50') return has('teal', 'turquoise', 'blue') ? 'PG50:teal' : 'PG50';
  return LIB[code] ? code : null;
}

const W = [1, 0.6, 0.4, 0.3, 0.25, 0.2];
let skipped = 0, approx = 0;
const out = { made: 'tools/paint_brands.js', lines: [] };
for (const L of raw) {
  const paints = [];
  for (const p of L.paints) {
    const keys = p.p.map(c => resolve(c, p.n + ' ' + (p.ru || '')));
    if (!p.p.length || keys.some(k => !k || !LIB[k])) { skipped++; continue; }
    // смесь пигментов краски: первый — главный (производители пишут его первым)
    const items = [], whites = keys.map((k, i) => LIB[k].white ? W[i] : 0).reduce((a, b) => a + b, 0);
    keys.forEach((k, i) => { if (!LIB[k].white) items.push([M.prep({ id: k, m: LIB[k].m, t: LIB[k].t }), W[i]]); });
    let m, t;
    if (!items.length) { m = t = LIB[keys[0]].m; }
    else if (items.length === 1 && !whites) { m = LIB[keys[0]].m; t = LIB[keys[0]].t; }
    else {
      const sum = items.reduce((a, x) => a + x[1], 0);
      m = M.mixHex(items, whites, 1, false); t = M.mixHex(items, whites + 3 * sum, 1, false);
    }
    if (p.lab && (items.length > 1 || whites)) { const f = fromLab(p.lab); m = f.m; t = f.t; } // смесь пигментов Daniel Smith: берём измеренный образец (точнее, чем угадывать пропорции)
    const est = keys.some(k => EST.has(k.split(':')[0]));
    if (est) approx++;
    paints.push([p.n, p.no || '', p.p.join(','), m, t, (p.op || '')[0] || '', est ? 1 : 0].concat(p.ru ? [p.ru] : []));
  }
  // «базовый набор» серии: по одной краске из одного пигмента на каждую роль (как базовый набор страницы)
  const ROLES = [[['PY3', 'PY175', 'PY138', 'PY184'], null], [['PY74', 'PY97', 'PY154', 'PY65', 'PY35', 'PY151'], null], [['PY42', 'PY43'], /ochre|охра/i],
    [['PR255', 'PR108', 'PR188', 'PR170', 'PR112', 'PR254'], null], [['PV19', 'PR122', 'PR202', 'PV42'], /rose|pink|magenta|роз|маджент/i], [['PB29'], null], [['PB15:3', 'PB15', 'PB15:1', 'PB15:6', 'PB15:4'], /phthalo|ftalo|blue|cyan|синя|голуб|helio|winsor/i],
    [['PG7', 'PG36'], null], [['PBr7', 'PR101'], /burnt sienna|сиена жж|sienna burnt/i], [['PBr7'], /burnt umber|умбра жж|umber burnt/i]].concat(L.medium === 'watercolor' ? [] : [[['PBk11', 'PBk9', 'PBk7', 'PBk6', 'PBk1'], null]]);
  const starter = [];
  for (const [codes, re] of ROLES) {
    let pick = -1;
    for (const c of codes) { pick = paints.findIndex((x, i) => x[2] === c && (!re || re.test(x[0] + ' ' + (x[7] || ''))) && !starter.includes(i)); if (pick >= 0) break; }
    if (pick >= 0) starter.push(pick);
  }
  out.lines.push({ id: L.id, brand: L.brand, name: L.name, medium: L.medium, src: L.src, starter, paints });
  console.log(L.id.padEnd(16), paints.length + '/' + L.paints.length);
}
fs.writeFileSync(path.join(ROOT, 'site/assets/paint-brands.json'), JSON.stringify(out));
console.log('пропущено (пигмент не в модели: перламутр, флуоресцент и т. п.):', skipped, '· приблизительных:', approx);
