// Пины №1773–1810 (Алина 28.11.2026, по трендам Pinterest): каждая группа — своё оформление, арт целиком.
// 1773–1782 земляные цвета 2026 («пробники краски»), 1783–1792 новогодний ар-деко (Neo Deco), 1793–1797 цирк (списки тем),
// 1798–1807 строчка и арт («poet aesthetic», свои строчки Pigeon Polly).
// Палитры — те же, что на /palettes/ (content/palettes.json), ссылка на свою палитру. Движок — tools/pins/pins18b.js.
const SITE = 'https://www.pigeonpolly.com';
const U = (p, n, c = 'top28') => { const [a, h] = p.split('#'); return `${SITE}${a}?utm_source=pinterest&utm_campaign=${c}&utm_content=pin-${n}${h ? '#' + h : ''}`; };
const PALS = Object.fromEntries(require('../../content/palettes.json').map(p => [p.key, p]));
const SEAS = k => /new-year|sketchbook-18|tinsel|tree-lights|latte/.test(k) ? 'Зима' : /halloween|muertos|apple|old_house/.test(k) ? 'Осень' : 'Круглый год';
const out = []; let n = 1773;
const push = o => { out.push({ n, ...o }); n++; };

// ——— 1) земляные цвета 2026 ———
['studio-oil_stilllife', 'studio-old_house', 'studio-ikra', 'studio-apple_creature', 'halloween-cup', 'studio-caffeine_cup', 'studio-redhair', 'sketchbook-6', 'studio-bee_rider', 'sketchbook-21'].forEach(k => {
  const p = PALS[k], t = p.title.en;
  push({ tpl: 'earth', img: p.img, cols: p.colors, t, season: SEAS(k),
    title: `Earth Tones Palette: ${t} — Clay, Ochre & Moss Colors with HEX Codes`,
    desc: `Warm earthy colors from my painting “${t}”: ${p.colors.map(c => `${c.en} ${c.hex}`).join(', ')}. Clay red, ochre, moss and terracotta are the colors of 2026 — paint with them. All my palettes, one click copies the HEX, on pigeonpolly.com.`,
    alt: `Painting “${t}” by Pigeon Polly in a paper mat with six earthy paint chips and their HEX codes below.`,
    link: U(`/palettes/#${k}`, n), topics: 'Earth tones color palette, Earthy color palette, Terracotta and ochre, Color palette with HEX codes, 2026 color trends' });
});

// ——— 2) новогодний ар-деко ———
['2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year', '2025-pigeon-polly-celebrates-new-year', '2023-pigeon-polly-celebrates-new-year', '2022-pigeon-polly-celebrates-new-year-first-time-in-the-bed', 'details-champagne-tinsel',
  'details-tree-lights', '2019-pigeon-polly-writing-diploma', 'studio-desk_night', 'details-holiday-latte', 'studio-lanterns'].forEach((k, i) => {
  const p = PALS[k], t = p.title.en;
  push({ tpl: 'deco', th: ['navy', 'onyx', 'wine'][i % 3], img: p.img, cols: p.colors, t, season: 'Зима',
    title: `Art Deco New Year Palette: ${t} — 6 Colors with HEX Codes`,
    desc: `A glamorous New Year’s Eve palette from my painting “${t}”: ${p.colors.map(c => `${c.en} ${c.hex}`).join(', ')}. Gold lines, deep colors — Neo Deco mood for party invitations, cards and cozy illustrations. More palettes on pigeonpolly.com.`,
    alt: `Painting “${t}” by Pigeon Polly in a gold Art Deco frame with six color swatches and HEX codes.`,
    link: U(`/palettes/#${k}`, n), topics: 'Art Deco color palette, New Year color palette, Gold and navy palette, Party color scheme, HEX codes' });
});

// ——— 3) цирк: списки тем, оформление старой афиши ———
const CI = [
  ['30 <em>circus</em> things to draw', 'roll up · roll up', 'snail/2024-mr-chew-rainbow-candy-edition.jpg', ['a big top tent', 'a ringmaster', 'a tightrope', 'a juggler', 'a unicycle', 'a strongman', 'a trapeze', 'a ticket booth', 'a popcorn cart', 'a drum',
    'a striped ball', 'a top hat', 'a hoop', 'a magician', 'a rabbit in a hat', 'a cannon', 'a clown nose', 'a balloon seller', 'a carousel horse', 'a fortune teller', 'a stilt walker', 'a spotlight', 'a pennant flag', 'a circus wagon',
    'a lion tamer chair', 'a fire juggler', 'a tiny dog act', 'a tuba', 'a bow', 'the last bow']],
  ['30 <em>circus snacks</em> & sweets', 'sweet tooth edition', 'photos2/cupcake.jpg', ['popcorn', 'cotton candy', 'a candy apple', 'a pretzel', 'peanuts in a cone', 'a lollipop', 'a hot dog', 'lemonade', 'a churro', 'a waffle', 'fudge', 'a snow cone',
    'gummy bears', 'a caramel corn bag', 'a cupcake', 'a candy stall', 'a doughnut', 'a rock candy stick', 'a soda bottle', 'a popcorn box', 'a cookie', 'a chocolate bar', 'a mint tin', 'a toffee', 'a fruit cup', 'a sugar crown',
    'a striped straw', 'a sticky hand', 'a spilled popcorn', 'the last bite']],
  ['30 <em>tiny performers</em> to draw', 'character drawing challenge', 'snail/2024-mr-chew-steamphunk-edition.jpg', ['a snail on a tightrope', 'a juggling pigeon', 'a mouse acrobat', 'a frog magician', 'a cat on stilts', 'a duck ringmaster', 'a hedgehog clown',
    'a bear on a ball', 'a fox fire-eater', 'a rabbit illusionist', 'a goose drummer', 'a seal singer', 'an owl fortune teller', 'a crow strongman', 'a squirrel trapeze', 'a ladybug dancer', 'a pug in a ruff', 'a beetle unicycle',
    'a toad tuba player', 'a moth in sequins', 'a parrot announcer', 'a sheep in tights', 'a dog with hoops', 'a raccoon ticket seller', 'a bee on a swing', 'a turtle racer', 'a lamb balloon seller', 'a goat on a barrel',
    'a worm contortionist', 'a snail taking a bow']],
  ['30 <em>acrobat poses</em> to sketch', 'figure drawing challenge', 'photos2/dancer.jpg', ['a handstand', 'a back bend', 'a split leap', 'a cartwheel', 'a balance on one hand', 'a human pyramid', 'a trapeze swing', 'a hanging by knees', 'a tightrope step',
    'an arabesque', 'a forward roll', 'a lift', 'a hoop spin', 'a silk wrap', 'a bow', 'a jump with a ribbon', 'a pole climb', 'a catch mid-air', 'a seated balance', 'a tuck jump', 'a stretch backstage', 'a pose on a ball',
    'a juggling stance', 'a run-up', 'a landing', 'a mirror pair', 'a shoulder stand', 'a stilt walk', 'a final pose', 'a tired bow']],
  ['30 things in a <em>circus wagon</em>', 'cozy circus challenge', 'snail/2023-mr-chew-delivery.jpg', ['a painted door', 'a tiny stove', 'a trunk of costumes', 'a mirror with bulbs', 'a teapot', 'a bunk bed', 'a lantern', 'a ticket roll', 'a wooden wheel', 'a map of towns',
    'a sewing kit', 'a juggling club', 'a sleeping dog', 'a top hat on a hook', 'a postcard wall', 'a kettle', 'a rug', 'a tin of buttons', 'sequin shoes', 'a record player', 'a sugar jar', 'a window with lace', 'a drum in a corner',
    'a stack of posters', 'a curtain', 'a feather boa', 'a little plant', 'a calendar of shows', 'a dusty violin', 'a lamp at night']],
];
for (const [t, kick, art, items] of CI) {
  const tt = t.replace(/<\/?em>/g, '');
  push({ tpl: 'circus', t, kick, art, items, season: 'Круглый год',
    title: `${tt.replace(/^./, c => c.toUpperCase())} — 30-Day Drawing Challenge (Free List)`,
    desc: `${items.length} small things to draw, one a day: ${items.slice(0, 5).join(', ')}… A vintage circus mood for your sketchbook. Save the list and draw ten minutes a day. A new prompt list every month on pigeonpolly.com.`,
    alt: `A vintage circus poster style list “${tt}” with 30 drawing prompts as little tickets and an illustration by Pigeon Polly.`,
    link: U('/prompts/', n), topics: 'Circus drawing ideas, Vintage circus aesthetic, Drawing challenge, Sketchbook prompts, Whimsical art' });
}

// ——— 4) строчка и арт (свои строчки, никому не приписаны) ———
const PO = [
  ['bird/2022-pigeon-polly-celebrates-new-year-first-time-in-the-bed.jpg', 'Some evenings are only a teacup,<br>a blanket, and a little light.', 'Зима'],
  ['photos2/winter_field.jpg', 'The snow forgot to fall today,<br>so I painted it myself.', 'Зима'],
  ['photos2/cat_lights.jpg', 'We hung the lights for us,<br>the cat thinks they are for him.', 'Зима'],
  ['photos2/lanterns.jpg', 'I keep the warm colors<br>for the longest nights.', 'Зима'],
  ['bird/2026-pigeon-polly-keeps-busy-living.jpg', 'Nothing happened today.<br>I sketched it anyway.', 'Круглый год'],
  ['sketchbook/sketchbook-5.jpg', 'A small brush, a slow hour,<br>a softer me.', 'Зима'],
  ['photos2/night_pleinair.jpg', 'Paint the light first.<br>The shadows will find their way.', 'Круглый год'],
  ['photos2/desk_night.jpg', 'The kettle sang, the paper waited,<br>and I began.', 'Круглый год'],
  ['photos2/frozen_pond.jpg', 'Every unfinished page<br>is still breathing.', 'Круглый год'],
  ['photos2/impasto_flowers.jpg', 'I painted flowers in winter<br>to remember I can wait.', 'Зима'],
];
PO.forEach(([art, line, season], i) => {
  const plain = line.replace(/<br>/g, ' ');
  push({ tpl: 'poem', th: ['ivory', 'ink', 'sage'][i % 3], art, line, season,
    title: `“${plain}” — Cozy Art Quote by Pigeon Polly`.slice(0, 100),
    desc: `${plain} A small line from my sketchbook next to one of my paintings. Save it for slow evenings. Free drawing prompts and lessons on pigeonpolly.com.`,
    alt: `A painting by Pigeon Polly in a wide white mat with the handwritten-style line “${plain}”.`,
    link: U(i % 2 ? '/learn/' : '/prompts/', n), topics: 'Art quotes, Cozy aesthetic, Poetry aesthetic, Artist quotes, Sketchbook inspiration' });
});

module.exports = out;
