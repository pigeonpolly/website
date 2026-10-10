// Каталог вещей для сервера: PPBirds.GIFTS после birds.js и room.js → site/assets/catalog.json (сервер берёт оттуда «🎲 Сюрприз» — случайную вещь категории).
// Запускает build.py: node tools/catalog.js <корень сайта>
const fs = require('fs'), path = require('path');
const root = process.argv[2];
const stubEl = () => ({ style: { setProperty() {} }, classList: { add() {}, toggle() {} }, appendChild() {}, addEventListener() {}, getContext: () => new Proxy({}, { get: () => () => ({ data: [] }) }) });
global.window = {}; global.document = { documentElement: { lang: 'en' }, createElement: stubEl, querySelector: () => null, addEventListener() {} };
global.matchMedia = () => ({ matches: false });
for (const f of ['birds.js', 'room.js']) new Function(fs.readFileSync(path.join(root, 'site/assets', f), 'utf8'))();
const B = window.PPBirds;
const out = { kinds: B.GIFT_KINDS.map(k => k[0]), items: Object.fromEntries(B.GIFT_KINDS.map(k => [k[0], B.GIFTS[k[0]]])), legend: [...B.LEGEND] };
fs.writeFileSync(path.join(root, 'site/assets/catalog.json'), JSON.stringify(out));
console.log(Object.entries(out.items).map(([k, v]) => k + ':' + v.length).join(' '), 'legend', out.legend.length);
