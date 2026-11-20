// Пины №1085–1278 (SET=17, Алина 21.11.2026: ещё 100–300 пинов по заходящим темам + 50 тизеров адвента). Движок — tools/pins/pins17.js.
// /draw/ убрана (docs/retired.md), поэтому всё ведёт на настоящие страницы:
//   темы → /prompts/ (настоящие списки декабря и января, tools/pins/pins17-months.json — снимок /api/challenge/month 21.11),
//   палитры → /palettes/#details-… (новая серия «Палитры деталей», content/palette-details.json), акварель по шагам → /learn/,
//   бинго → /prompts/, отличия → /games/, адвент → /advent/ (что внутри окон — не говорим).
// Тема — v2 сайта (TH в pins17.js), значок v3 — под фон и акцент пина (LOGO в pins17.js).
const SITE = 'https://www.pigeonpolly.com';
const U = (p, n, c = 'top27') => { const [a, h] = p.split('#'); return `${SITE}${a}?utm_source=pinterest&utm_campaign=${c}&utm_content=pin-${n}${h ? '#' + h : ''}`; };
const A = k => /\//.test(k) ? k : /^\d{4}-(pigeon|polly)/.test(k) ? `bird/${k}.jpg` : /^\d{4}-/.test(k) ? `snail/${k}.jpg` : /^sketchbook-/.test(k) ? `sketchbook/${k}.jpg` : /^halloween-/.test(k) ? `halloween/${k}.jpg` : `photos2/${k}.jpg`;
const M = require('./pins17-months.json');
const PALS = Object.fromEntries(require('../../content/palettes.json').map(p => [p.key, p]));
const DET = require('../../content/palette-details.json');
// подписи тем для пинов: те же темы, что на сайте, только по-человечески (без чужих торговых марок)
const NICE = { 'The Magic Puppy': 'a magic puppy', 'Any dish': 'any dish you love', 'The warm socks.': 'warm socks', 'Ginger, a man': 'a gingerbread man', 'Crown at the Door': 'a wreath on the door',
  'letter from Hogwarts': 'a letter from a wizard school', 'Hogsmeade village': 'a snowy wizard village', 'All rooms in Hogwarts': 'every room of a wizard castle', 'from the holiday episode of my favorite series': 'a scene from your favourite holiday episode',
  'Cat and Tree': 'a cat and a Christmas tree', 'Broom': 'a broom', 'Cauldron and potions': 'a cauldron and potions', 'deer': 'a deer', 'snowman': 'a snowman', 'cocoa': 'cocoa', 'gifts': 'gifts', 'patchwork quilt': 'a patchwork quilt',
  'chocolate chip cookie': 'a chocolate chip cookie', 'mulled wine': 'mulled wine', 'snow globe': 'a snow globe', 'bird in a scarf': 'a bird in a scarf', 'hidden gifts': 'hidden gifts', 'Northern lights (Aurora Borealis)': 'northern lights' };
const nice = s => NICE[s] || s.charAt(0).toLowerCase() + s.slice(1).replace(/\.$/, '');
const day = (m, d) => { const x = M[m].find(o => o.d === d); return { ...x, s: nice(x.s) }; };
const MN = { '2026-12': 'December', '2027-01': 'January' };
const out = []; let n = 1085;
const push = o => { out.push({ n, ...o }); n++; };

// ——— 1) темы: настоящие списки /prompts/ ———
// plist: месяц, 6 дней видно, остальное — подарками
const PL = [
  ['2026-12', '31 cozy <em>December</em> drawing prompts', '2025-pigeon-polly-celebrates-new-year', '50% 35%', 'night', [1, 2, 3, 4, 5, 6]],
  ['2026-12', 'A tiny drawing <em>every day</em> of December', 'sketchbook-18', '50% 45%', 'paper', [2, 6, 14, 16, 20, 21]],
  ['2026-12', 'December sketchbook <em>challenge</em>', 'cat_lights', '50% 30%', 'dark', [3, 5, 16, 20, 23, 27]],
  ['2026-12', '31 <em>wintery</em> things to draw', 'winter_field', '50% 50%', 'cream', [5, 14, 20, 22, 23, 28]],
  ['2026-12', 'Draw your way <em>to Christmas</em>', '2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year', '30% 45%', 'night', [1, 4, 6, 16, 22, 26]],
  ['2026-12', '10-minute <em>December</em> sketches', 'caffeine_cup', '50% 40%', 'clay', [2, 6, 9, 14, 21, 29]],
  ['2026-12', 'Cozy <em>advent</em> of drawing prompts', '2024-mr-chew-celebrates-new-year', '50% 40%', 'blush', [1, 3, 17, 20, 22, 30]],
  ['2026-12', 'December prompts for <em>slow evenings</em>', 'lanterns', '50% 40%', 'sage', [4, 14, 19, 21, 23, 27]],
  ['2027-01', '<em>January</em> drawing prompts 2027', '2023-pigeon-polly-celebrates-new-year', '50% 40%', 'night', [1, 2, 6, 11, 12, 13]],
  ['2027-01', 'A quiet <em>January</em> sketchbook', 'winter_field', '50% 60%', 'paper', [13, 14, 15, 16, 18, 19]],
  ['2027-01', 'Start 2027 with a <em>daily sketch</em>', 'sketchbook-5', '50% 50%', 'clay', [1, 2, 11, 14, 19, 20]],
  ['2027-01', 'Snowy <em>January</em> things to draw', '2026-pigeon-polly-seven-years-later', '60% 30%', 'wash', [6, 11, 12, 13, 16, 29]],
];
for (const [m, t, art, pos, th, ds] of PL) {
  const items = ds.map(d => day(m, d)), y = m.slice(0, 4);
  push({ tpl: 'plist', th, t, kick: `${MN[m].toLowerCase()} ${y} · drawing prompts`, art: A(art), pos, items, rest: 31 - ds.length, season: 'Зима',
    title: `${t.replace(/<\/?em>/g, '')} — free ${MN[m]} ${y} drawing challenge`.replace(/^./, c => c.toUpperCase()),
    desc: `A small drawing prompt for every day of ${MN[m]}: ${items.slice(0, 3).map(x => x.s).join(', ')}… Each one has a twist and a 5–15 minute timer. Here are six — the full list of 31 is free on pigeonpolly.com, and you can save it as one image.`,
    alt: `A list of ${MN[m]} drawing prompts with six open days and the rest wrapped as little gifts, under an illustration by Pigeon Polly.`,
    link: U('/prompts/', n), topics: `${MN[m]} drawing prompts, Drawing challenge ${y}, Winter sketchbook ideas, Daily drawing prompts` });
}
// pday: один день крупно (тема + поворот + время + совет)
const PD = [
  ['2026-12', 1, '2025-sometimes-mr-chew-wants-to-be-retired', 'paper'], ['2026-12', 2, 'checker_coffee', 'clay'], ['2026-12', 3, 'cat_lights', 'dark'],
  ['2026-12', 4, '2022-pigeon-polly-celebrates-new-year-first-time-in-the-bed', 'blush'], ['2026-12', 5, 'winter_field', 'cream'], ['2026-12', 6, 'cookies', 'dark'],
  ['2026-12', 14, 'caffeine_cup', 'clay'], ['2026-12', 15, '2023-pigeon-polly-celebrates-new-year', 'night'], ['2026-12', 16, '2026-pigeon-polly-seven-years-later', 'wash'],
  ['2026-12', 19, 'sketchbook-18', 'paper'], ['2026-12', 20, '2025-pigeon-polly-celebrates-new-year', 'night'], ['2026-12', 22, 'lanterns', 'sage'],
  ['2027-01', 2, 'checker_coffee', 'cream'], ['2027-01', 11, 'winter_field', 'night'], ['2027-01', 13, 'sketchbook-15', 'sage'],
  ['2027-01', 15, 'sketchbook-5', 'dark'], ['2027-01', 19, 'sketchbook-17', 'clay'], ['2027-01', 29, '2023-pigeon-polly-thinking-about-relocation-to-mars', 'night'],
];
for (const [m, d, art, th] of PD) {
  const x = day(m, d), y = m.slice(0, 4);
  push({ tpl: 'pday', th, art: A(art), x, date: `${MN[m]} ${d}`, season: 'Зима',
    title: (t => t.length > 100 ? `Drawing prompt for ${MN[m]} ${d}: ${x.s}` : t)(`Drawing prompt for ${MN[m]} ${d}: ${x.s} (${x.tw})`),
    desc: `Today’s drawing prompt: ${x.s} — ${x.tw}. Set a timer for ${x.t} minutes. Tip: ${x.tip} A new prompt every day of ${MN[m]} on pigeonpolly.com.`,
    alt: `A drawing prompt card “${x.s}, ${x.tw}, ${x.t} minutes” with an illustration by Pigeon Polly.`,
    link: U('/prompts/', n), topics: `Daily drawing prompt, ${MN[m]} drawing ideas, Sketchbook prompts, Drawing challenge ${y}` });
}
// pweek: неделя целиком
const PW = [['2026-12', [1, 2, 3, 4, 5, 6], 'the first week', '2024-mr-chew-celebrates-new-year', 'paper'], ['2026-12', [15, 16, 17, 19, 20, 21], 'the third week', '2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year', 'night'],
  ['2026-12', [22, 23, 26, 27, 28, 29], 'the last week', 'lanterns', 'clay'], ['2026-12', [8, 9, 10, 11, 14, 16], 'a magical week', '2024-mr-chew-dnd-edition', 'dark'],
  ['2027-01', [11, 12, 13, 14, 15, 16], 'a snowy week', 'winter_field', 'cream'], ['2027-01', [18, 19, 20, 22, 24, 27], 'a cozy week', 'sketchbook-5', 'blush']];
for (const [m, ds, what, art, th] of PW) {
  const items = ds.map(d => day(m, d)), y = m.slice(0, 4);
  push({ tpl: 'pweek', th, t: `${MN[m]} prompts: <em>${what}</em>`, art: A(art), items, m: MN[m], season: 'Зима',
    title: `${MN[m]} drawing prompts: ${what} — 6 days with twists & timers`,
    desc: `Six days from my ${MN[m]} prompt list: ${items.map(x => x.s).join(', ')}. Each comes with a twist and a timer. The whole month is free on pigeonpolly.com.`,
    alt: `Six drawing prompts for ${MN[m]} with twists and timers next to an illustration by Pigeon Polly.`,
    link: U('/prompts/', n), topics: `${MN[m]} drawing prompts, Weekly drawing challenge, Sketchbook ideas, Drawing prompts ${y}` });
}
// ptw: «нарисуй что угодно по-новому» — повороты из списков; ptip: советы
const TW = [...new Set(M['2026-12'].map(x => x.tw).filter(Boolean))], TP = [...new Set(M['2026-12'].map(x => x.tip).filter(Boolean))];
push({ tpl: 'ptw', th: 'paper', t: 'Draw anything <em>10 new ways</em>', art: A('sketchbook-21'), items: TW.slice(0, 10), season: 'Круглый год',
  title: 'Draw Anything 10 New Ways — Sketchbook Twists for Art Block', desc: `Stuck drawing the same way? Pick any object and add a twist: ${TW.slice(0, 4).join(', ')}… Every prompt on my monthly list comes with one of these. Free on pigeonpolly.com.`,
  alt: 'A list of ten drawing twists like “seen from above” and “one continuous line” next to a sketch by Pigeon Polly.', link: U('/prompts/', n), topics: 'Art block ideas, Drawing exercises, Sketchbook ideas, Drawing prompts' });
push({ tpl: 'ptw', th: 'night', t: 'Bored of your sketches? <em>Try a twist</em>', art: A('cat_lights'), items: TW.slice(10, 20), season: 'Круглый год',
  title: '10 Drawing Twists to Make Any Sketch Fun Again', desc: `Draw the same thing, but ${TW.slice(10, 13).join(', ')}… Ten twists that wake up a tired sketchbook. A new list of prompts with twists every month on pigeonpolly.com.`,
  alt: 'Ten playful drawing twists on a dark card with a cat illustration by Pigeon Polly.', link: U('/prompts/', n), topics: 'Drawing exercises, Creative drawing ideas, Art block, Sketchbook prompts' });
push({ tpl: 'ptip', th: 'sage', t: 'Tiny rules for a <em>daily sketch habit</em>', art: A('sketchbook-11'), items: TP.slice(0, 8), season: 'Круглый год',
  title: '8 Tiny Rules for a Daily Sketching Habit (That Actually Stick)', desc: `${TP.slice(0, 2).join(' ')} Eight small rules from my daily prompt lists. A new list every month on pigeonpolly.com.`,
  alt: 'Eight short tips for a daily sketching habit next to a sketchbook page by Pigeon Polly.', link: U('/prompts/', n), topics: 'Drawing habit, Sketchbook tips, Daily drawing, Art motivation' });
push({ tpl: 'ptip', th: 'clay', t: 'When drawing feels <em>scary</em>, read this', art: A('2026-pigeon-polly-accidentaly-drinked-brush-watercolor-water'), items: TP.slice(8, 16), season: 'Круглый год',
  title: 'Afraid of Ruining the Page? 8 Gentle Drawing Tips', desc: `${TP.slice(8, 10).join(' ')} Gentle tips for anyone scared of a blank page — from my monthly prompt lists on pigeonpolly.com.`,
  alt: 'Eight gentle tips against fear of the blank page next to a painting of a pigeon by Pigeon Polly.', link: U('/prompts/', n), topics: 'Art anxiety, Drawing tips for beginners, Sketchbook fear, Art motivation' });

// ——— 1б) открытые списки тем на месяц (Алина 21.11: как залетевшие «31 cozy winter things» — всё видно, чтобы сохраняли) ———
const OL = [
  ['31 things to draw <em>inside a snow globe</em>', 'december drawing challenge', '2025-pigeon-polly-celebrates-new-year', 'night', 'Зима', 'Snow globe drawing ideas, Christmas drawing prompts, December drawing challenge',
    'a tiny house', 'a fox', 'a skating pond', 'a lighthouse', 'a gingerbread man', 'a sleeping cat', 'a tram', 'a pine forest', 'a snail', 'a teacup', 'a mushroom', 'a tiny café', 'a bird on a branch', 'a moon', 'a castle', 'a whale', 'a bookshop', 'a carousel', 'a cactus', 'a deer', 'a church', 'a train', 'a teapot', 'a bakery', 'a garden', 'a polar bear', 'a rubber duck', 'a city skyline', 'a cottage', 'a frog', 'you'],
  ['30 <em>Christmas cookies</em> to draw', '30-day drawing challenge', 'cookies', 'dark', 'Зима', 'Christmas cookie drawing, Cute food drawing, Holiday drawing prompts',
    'a gingerbread man', 'a star cookie', 'a candy cane cookie', 'a linzer heart', 'a snowflake', 'a mitten cookie', 'a sugar tree', 'a crinkle cookie', 'a thumbprint', 'a reindeer', 'a stocking cookie', 'a snowman', 'a pretzel', 'a macaron', 'a cookie jar', 'a rolling pin', 'a cookie tin', 'a broken cookie', 'a shortbread', 'a gingerbread house', 'a bell cookie', 'an angel', 'a cookie cutter', 'icing bag', 'a plate for Santa', 'a cookie with milk', 'sprinkles', 'a cookie box', 'a burnt one', 'your favourite'],
  ['31 <em>Nordic hygge</em> things to draw', 'winter drawing challenge', 'sketchbook-5', 'cream', 'Зима', 'Hygge drawing ideas, Scandinavian winter, Cozy drawing prompts',
    'a wool blanket', 'a candle', 'a cinnamon bun', 'a sauna hat', 'knitted socks', 'a fika table', 'a pine branch', 'a lantern', 'a reindeer skin', 'a cabin', 'a wood stove', 'a mug of glögg', 'a mug of cocoa', 'a sheepskin rug', 'a birch tree', 'a straw goat', 'rye bread', 'a sled', 'a snowy window', 'lingonberries', 'a teapot', 'a book pile', 'an armchair', 'a ski hat', 'a woodpile', 'a dark morning', 'a candle bridge', 'fish soup', 'a snowy forest', 'northern lights', 'your hygge corner'],
  ['30 things in a <em>cozy cabin</em>', '30-day drawing challenge', 'old_house', 'clay', 'Зима', 'Cabin drawing ideas, Cozy cabin aesthetic, Winter drawing prompts',
    'a log wall', 'a fireplace', 'an axe', 'a kettle', 'a quilt', 'a rocking chair', 'snowshoes', 'a deer head lamp', 'a map', 'a lantern', 'a radio', 'boots by the door', 'a cast iron pan', 'a plaid shirt', 'a fishing rod', 'a jar of honey', 'a wood basket', 'a window with snow', 'a bunk bed', 'a deck of cards', 'a thermos', 'a pine cone', 'a guitar', 'an old clock', 'a bear rug', 'a hot water bottle', 'a book', 'a cat', 'a porch', 'smoke from the chimney'],
  ['30 <em>winter birds & critters</em> to draw', '30-day drawing challenge', '2026-pigeon-polly-seven-years-later', 'wash', 'Зима', 'Winter animals drawing, Bird drawing ideas, Cute animal prompts',
    'a robin', 'a bullfinch', 'a snowy owl', 'a blue tit', 'a cardinal', 'a pigeon in a scarf', 'a crow', 'a squirrel', 'a hare', 'a fox', 'a hedgehog asleep', 'a stoat', 'a deer', 'a moose', 'a polar bear', 'a penguin', 'a seal', 'an arctic fox', 'a lynx', 'a woodpecker', 'a waxwing', 'a magpie', 'a mouse', 'a sparrow', 'a swan', 'a duck on ice', 'a husky', 'a sleeping bear', 'a reindeer', 'a bird feeder'],
  ['31 <em>New Year’s Eve</em> things to draw', 'drawing challenge', '2023-pigeon-polly-celebrates-new-year', 'dark', 'Зима', 'New Year drawing ideas, Party drawing prompts, Holiday sketchbook',
    'a champagne glass', 'a clock at midnight', 'confetti', 'a party hat', 'a sparkler', 'fireworks', 'a disco ball', 'a balloon', 'a new calendar', 'a wish list', 'a cake', 'a candle', 'tangerines', 'a gift', 'a party dress', 'a bow tie', 'a toast', 'a cat hiding from fireworks', 'a playlist', 'a selfie', 'snow', 'a hug', 'a cork', 'a resolution', 'a city skyline', 'a mask', 'a cracker', 'glitter', 'a sleepy morning', 'leftovers', 'next year’s you'],
  ['30 things in a <em>Christmas stocking</em>', '30-day drawing challenge', '2024-mr-chew-celebrates-new-year', 'paper', 'Зима', 'Christmas drawing ideas, Stocking stuffers, Cute holiday prompts',
    'a tangerine', 'a candy cane', 'fuzzy socks', 'a lip balm', 'a tiny book', 'a toy car', 'a chocolate coin', 'a hair clip', 'a yo-yo', 'a bath bomb', 'a keychain', 'a puzzle', 'a mini notebook', 'a pencil', 'a sticker sheet', 'a snow globe', 'a whistle', 'a gingerbread', 'a rubber duck', 'a deck of cards', 'a candle', 'mittens', 'a hand cream', 'a marble', 'a bauble', 'a tea bag', 'a lottery ticket', 'a toothbrush', 'a coal lump', 'a love note'],
  ['30 <em>knitted things</em> to draw', '30-day drawing challenge', '2025-sometimes-mr-chew-wants-to-be-retired', 'blush', 'Зима', 'Knitting drawing ideas, Cozy knit aesthetic, Winter drawing prompts',
    'a scarf', 'a bobble hat', 'mittens', 'a sweater', 'socks', 'a tea cozy', 'a blanket', 'a yarn ball', 'knitting needles', 'a cardigan', 'a headband', 'leg warmers', 'a pot holder', 'a stuffed bunny', 'an egg cozy', 'a mug sweater', 'a dog sweater', 'a pom-pom', 'a cable knit', 'a basket of yarn', 'a balaclava', 'a pillow', 'baby booties', 'a vest', 'a shawl', 'a snood', 'a dropped stitch', 'a cat with yarn', 'a granny square', 'your favourite knit'],
  ['30 <em>hot drinks</em> to draw', '30-day drawing challenge', 'caffeine_cup', 'clay', 'Зима', 'Coffee drawing ideas, Hot drink art, Cozy drawing prompts',
    'a latte', 'cocoa with marshmallows', 'a matcha', 'mulled wine', 'a chai', 'an espresso', 'a cappuccino', 'a herbal tea', 'a hot toddy', 'a moka pot', 'a teapot', 'a pumpkin latte', 'a cinnamon stick', 'a thermos', 'a mug with steam', 'a French press', 'a teacup & saucer', 'a takeaway cup', 'a samovar', 'a lemon tea', 'a ginger tea', 'a coffee bean', 'a sugar bowl', 'a milk frother', 'a café menu', 'a turkish coffee', 'a cup of broth', 'an iced coffee in winter', 'a coffee stain', 'your morning cup'],
  ['30 <em>fairy tale</em> things to draw', '30-day drawing challenge', 'mushroom_house', 'sage', 'Круглый год', 'Fairy tale drawing ideas, Whimsical drawing prompts, Storybook art',
    'a glass slipper', 'a poison apple', 'a frog prince', 'a pumpkin carriage', 'a tower', 'a spinning wheel', 'a gingerbread house', 'a magic mirror', 'a red hood', 'a wolf', 'a golden goose', 'a bean stalk', 'a crown', 'a dragon', 'a sleeping princess', 'a mermaid', 'a fairy', 'a castle', 'a magic lamp', 'a witch’s hut', 'three bears', 'a pea under mattresses', 'a talking cat', 'a key', 'a wishing well', 'a breadcrumb trail', 'a seven-league boot', 'a giant', 'a troll bridge', 'once upon a time'],
  ['30 <em>tiny shops</em> to draw', '30-day drawing challenge', 'bookshop', 'night', 'Круглый год', 'Shop front drawing, Urban sketching ideas, Cozy drawing prompts',
    'a bakery', 'a flower shop', 'a bookshop', 'a cheese shop', 'a tea shop', 'a toy shop', 'a hat shop', 'a candy shop', 'a record store', 'a bike shop', 'a pharmacy', 'a fish market', 'a butcher', 'a stationery shop', 'a plant shop', 'a barber', 'a watchmaker', 'a yarn shop', 'an antique shop', 'a pet shop', 'a coffee kiosk', 'a newsstand', 'a shoe repair', 'a ramen bar', 'an ice cream parlour', 'a laundromat', 'a post office', 'a magic shop', 'a pawn shop', 'your dream shop'],
  ['30 things from a <em>train journey</em>', '30-day drawing challenge', '2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes', 'clay', 'Осень', 'Travel sketching ideas, Train drawing, Sketchbook prompts',
    'a ticket', 'a window seat', 'a station clock', 'a suitcase', 'a sleeping passenger', 'a coffee cup', 'a conductor', 'rails', 'a tunnel', 'a station café', 'a bench', 'a timetable', 'a map', 'a sandwich', 'a book', 'headphones', 'a dog in a bag', 'fields passing', 'a bridge', 'a sunset from the window', 'a dining car', 'a bunk', 'a platform', 'a signal light', 'a luggage rack', 'a postcard', 'a snack trolley', 'a foggy window', 'your reflection', 'arrival'],
  ['30 <em>dragons</em> doing cozy things', '30-day drawing challenge', '2024-mr-chew-dnd-edition', 'dark', 'Круглый год', 'Cute dragon drawing, Fantasy drawing prompts, Whimsical art ideas',
    'reading by the fire', 'knitting', 'baking bread', 'drinking tea', 'napping on gold', 'gardening', 'toasting marshmallows', 'in a bath', 'writing a letter', 'wearing a scarf', 'painting', 'doing yoga', 'with a cat', 'at a café', 'heating a house', 'hugging a teddy', 'playing chess', 'in pajamas', 'stargazing', 'in the rain', 'decorating a tree', 'making soup', 'playing guitar', 'collecting mugs', 'on a picnic', 'watching TV', 'building a snowman', 'drying laundry', 'in a library', 'saying goodnight'],
  ['30 <em>frogs</em> doing things', '30-day drawing challenge', 'park_pond', 'sage', 'Весна', 'Cute frog drawing, Funny animal prompts, Cottagecore drawing ideas',
    'with an umbrella', 'in a hat', 'reading', 'on a lily pad', 'with tea', 'playing violin', 'in a teacup', 'with a crown', 'riding a snail', 'in rain boots', 'eating cake', 'fishing', 'in a boat', 'on a mushroom', 'painting', 'in love', 'sleeping', 'in a scarf', 'jumping', 'with a lantern', 'knitting', 'on a bike', 'in a jar', 'singing', 'as a knight', 'gardening', 'with a balloon', 'at the beach', 'in pajamas', 'waving goodbye'],
  ['30 things in an <em>art studio</em>', '30-day drawing challenge', 'sketchbook-21', 'paper', 'Круглый год', 'Art supplies drawing, Artist studio, Sketchbook prompts',
    'a paint tube', 'a brush jar', 'an easel', 'a palette', 'a sketchbook', 'a pencil stub', 'an eraser', 'a water cup', 'a masking tape', 'a lamp', 'a paint rag', 'an apron', 'a canvas', 'a tin of pencils', 'a spray bottle', 'ink bottles', 'a palette knife', 'a bulldog clip', 'a plant', 'a coffee mug', 'a stool', 'a ruler', 'a sharpener', 'a postcard wall', 'a messy desk', 'a drying rack', 'a sponge', 'a mannequin', 'a paint swatch', 'your hand'],
  ['30 <em>breakfasts</em> to draw', '30-day drawing challenge', 'breakfast_us', 'blush', 'Круглый год', 'Breakfast drawing ideas, Food illustration, Cute food prompts',
    'pancakes', 'a fried egg', 'toast', 'a croissant', 'porridge', 'a waffle', 'a bagel', 'avocado toast', 'granola', 'a boiled egg', 'a smoothie', 'cereal', 'a muffin', 'french toast', 'a full English', 'a crepe', 'yogurt', 'a cinnamon bun', 'an omelette', 'a fruit bowl', 'a breakfast burrito', 'jam on bread', 'orange juice', 'a coffee', 'a donut', 'a scone', 'miso soup', 'shakshuka', 'leftover pizza', 'breakfast in bed'],
  ['30 things in <em>your bag</em>', '30-day drawing challenge', '2026-pigeon-polly-fancy-life', 'cream', 'Круглый год', 'Everyday objects drawing, What’s in my bag, Sketchbook prompts',
    'keys', 'a wallet', 'a phone', 'headphones', 'a lip balm', 'a receipt', 'a pen', 'sunglasses', 'a water bottle', 'a snack', 'a book', 'a hair tie', 'tissues', 'a charger', 'a mask', 'gum', 'a notebook', 'an umbrella', 'a bus ticket', 'hand cream', 'a coin', 'a tote bag', 'a tangerine', 'a mirror', 'a sketchbook', 'a candy wrapper', 'a plaster', 'a lighter', 'a mystery item', 'crumbs'],
  ['30 <em>sea creatures</em> to draw', '30-day drawing challenge', 'turtles', 'wash', 'Лето', 'Ocean animals drawing, Sea creature art, Drawing prompts',
    'a sea turtle', 'an octopus', 'a jellyfish', 'a seahorse', 'a whale', 'a crab', 'a starfish', 'a pufferfish', 'a clownfish', 'a dolphin', 'a shark', 'a squid', 'a lobster', 'a sea urchin', 'a manta ray', 'an anglerfish', 'a narwhal', 'an eel', 'a shrimp', 'a coral', 'a sea otter', 'a seal', 'a sea slug', 'a hermit crab', 'a sunfish', 'a walrus', 'a penguin', 'krill', 'a sea snail', 'a mermaid'],
  ['30 <em>animals in sweaters</em>', '30-day drawing challenge', 'redhair', 'clay', 'Осень', 'Cute animal drawing, Cozy drawing prompts, Character ideas',
    'a fox', 'a bear', 'a hedgehog', 'a rabbit', 'a raccoon', 'an owl', 'a sheep', 'a pig', 'a sloth', 'a hamster', 'a badger', 'a moose', 'a penguin', 'a giraffe', 'a mole', 'a squirrel', 'a cat', 'a dog', 'a goose', 'a cow', 'a frog', 'a snail', 'a mouse', 'a deer', 'a duck', 'an otter', 'a turtle', 'a pigeon', 'a wolf', 'a llama'],
  ['30 things from an <em>antique shop</em>', '30-day drawing challenge', 'postcard_world', 'paper', 'Круглый год', 'Vintage objects drawing, Antique aesthetic, Sketchbook prompts',
    'a pocket watch', 'a gramophone', 'a typewriter', 'a cameo', 'an old key', 'a candlestick', 'a porcelain doll', 'a globe', 'a compass', 'a perfume bottle', 'a tea set', 'a brass bell', 'a magnifying glass', 'a rotary phone', 'a hat box', 'an old camera', 'a jewelry box', 'an hourglass', 'a mirror', 'a sewing machine', 'a lantern', 'old postcards', 'a rocking horse', 'a fountain pen', 'a cuckoo clock', 'a tin toy', 'a vase', 'a chandelier', 'a trunk', 'a mystery box'],
  ['30 <em>musical instruments</em> to draw', '30-day drawing challenge', 'myth_read', 'night', 'Круглый год', 'Instrument drawing ideas, Music art, Drawing prompts',
    'a violin', 'a piano', 'a guitar', 'a trumpet', 'a harp', 'a drum', 'a ukulele', 'an accordion', 'a flute', 'a cello', 'a saxophone', 'a tambourine', 'a triangle', 'a banjo', 'a harmonica', 'a xylophone', 'bagpipes', 'a kazoo', 'a gramophone', 'a music box', 'a microphone', 'a bell', 'a recorder', 'maracas', 'a mandolin', 'a cassette', 'headphones', 'sheet music', 'a metronome', 'your favourite song'],
  ['30 things in a <em>toy box</em>', '30-day drawing challenge', 'blocks', 'wash', 'Круглый год', 'Toy drawing ideas, Nostalgic drawing prompts, Cute things to draw',
    'a teddy bear', 'a wooden train', 'a spinning top', 'a rubber duck', 'a doll', 'building blocks', 'a toy robot', 'a kite', 'a ball', 'a jack-in-the-box', 'a rocking horse', 'a yo-yo', 'marbles', 'a toy car', 'a puzzle', 'a tin soldier', 'a dinosaur', 'a slinky', 'a doll house', 'a hobby horse', 'a jump rope', 'crayons', 'a kaleidoscope', 'a puppet', 'a toy boat', 'a teddy picnic', 'a whistle', 'a magic wand', 'a broken toy', 'your favourite toy'],
  ['30 things from a <em>bakery</em>', '30-day drawing challenge', 'sketchbook-12', 'clay', 'Круглый год', 'Bakery drawing ideas, Bread illustration, Cute food prompts',
    'a baguette', 'a croissant', 'a sourdough loaf', 'a cinnamon roll', 'a pretzel', 'a donut', 'an eclair', 'a fruit tart', 'a bagel', 'a rye bread', 'a brioche', 'a muffin', 'a pain au chocolat', 'a cream puff', 'a strudel', 'a scone', 'a cheesecake', 'a bread basket', 'a baker’s hat', 'a rolling pin', 'flour sack', 'a cake stand', 'a paper bag', 'a cupcake', 'a pie', 'a focaccia', 'a challah', 'a gingerbread', 'a macaron box', 'the bakery window'],
  ['30 <em>ghosts</em> doing cozy things', '30-day drawing challenge', 'halloween-in-blue', 'dark', 'Осень', 'Cute ghost drawing, Spooky cute ideas, Halloween drawing prompts',
    'reading a book', 'drinking tea', 'baking', 'knitting', 'with a cat', 'in a blanket', 'watering plants', 'doing yoga', 'painting', 'eating pie', 'at a café', 'on a swing', 'with a lantern', 'in the rain', 'in a bubble bath', 'playing piano', 'hugging a pumpkin', 'making soup', 'on a bike', 'stargazing', 'in a sweater', 'writing letters', 'dancing', 'gardening', 'with a dog', 'at the beach', 'sleeping in', 'carving a pumpkin', 'on a picnic', 'saying boo'],
  ['30 things for a <em>summer picnic</em>', '30-day drawing challenge', 'myth_beach', 'wash', 'Лето', 'Picnic drawing ideas, Summer illustration, Cute drawing prompts',
    'a checkered blanket', 'a basket', 'strawberries', 'a lemonade', 'sandwiches', 'a watermelon', 'a thermos', 'a sun hat', 'a book', 'a frisbee', 'cherries', 'an ant', 'a jar of jam', 'a cheese board', 'sunglasses', 'a bee', 'a radio', 'a bike', 'cupcakes', 'a pie', 'grapes', 'a kite', 'wildflowers', 'a dog', 'a parasol', 'paper plates', 'a cooler', 'a croissant', 'sunscreen', 'a sunset'],
  ['30 <em>garden flowers</em> to draw', '30-day drawing challenge', 'impasto_flowers', 'blush', 'Весна', 'Flower drawing ideas, Botanical art, Spring drawing prompts',
    'a rose', 'a tulip', 'a peony', 'a daisy', 'a sunflower', 'a lavender', 'a poppy', 'a hydrangea', 'a lily', 'a dahlia', 'a cosmos', 'a foxglove', 'a sweet pea', 'a marigold', 'a cornflower', 'a pansy', 'a lilac', 'a snowdrop', 'a crocus', 'a daffodil', 'a forget-me-not', 'an iris', 'a carnation', 'a zinnia', 'a hollyhock', 'a lupin', 'a camellia', 'a clematis', 'a chamomile', 'a bouquet'],
  ['30 things from a <em>road trip</em>', '30-day drawing challenge', '2022-pigeon-polly-started-own-small-business', 'paper', 'Лето', 'Road trip drawing ideas, Travel sketchbook, Summer drawing prompts',
    'a camper van', 'a map', 'a gas station', 'a motel sign', 'a diner', 'snacks', 'sunglasses', 'a playlist', 'a cactus', 'a road sign', 'a tent', 'a cooler', 'a car window view', 'a postcard', 'a souvenir', 'a tire', 'a thermos', 'a hitchhiker', 'a lake', 'a bridge', 'a dog in the car', 'a picnic table', 'a sunset road', 'a coffee to go', 'a parking lot', 'a camera', 'a sleeping bag', 'a mountain', 'a flat tire', 'home again'],
  ['30 <em>hats</em> to draw', '30-day drawing challenge', 'poirot', 'cream', 'Круглый год', 'Hat drawing ideas, Fashion sketch, Drawing prompts',
    'a beret', 'a bowler hat', 'a top hat', 'a straw hat', 'a beanie', 'a bucket hat', 'a cowboy hat', 'a witch hat', 'a chef hat', 'a crown', 'a party hat', 'a fedora', 'a baseball cap', 'a sun hat', 'a pirate hat', 'a fez', 'a beret with a pin', 'a helmet', 'a sailor cap', 'a nightcap', 'a bonnet', 'a trapper hat', 'a flower crown', 'a graduation cap', 'a bobble hat', 'a turban', 'a fascinator', 'a hard hat', 'a tiny hat on a cat', 'your favourite hat'],
  ['30 <em>mugs</em> with personality', '30-day drawing challenge', 'checker_coffee', 'sage', 'Круглый год', 'Mug drawing ideas, Cute object characters, Drawing prompts',
    'a grumpy mug', 'a sleepy mug', 'a mug in love', 'a chipped mug', 'a giant mug', 'a tiny espresso cup', 'a mug with a scarf', 'a mug in the rain', 'a teacup princess', 'a travel mug', 'a cat mug', 'a mug with a plant', 'a mug full of pens', 'a broken handle', 'a mug at work', 'a holiday mug', 'a mug & a cookie', 'a mug on a walk', 'a stack of mugs', 'a mug sauna', 'a nervous mug', 'a proud mug', 'a mug in a hat', 'a mug’s birthday', 'a mug & a teapot', 'a lost mug', 'a vintage mug', 'a mug with steam', 'a dancing mug', 'your mug'],
  ['31 <em>winter evening</em> things to draw', 'january 2027 drawing challenge', 'winter_field', 'night', 'Зима', 'Winter drawing prompts, January drawing challenge, Cozy evening ideas',
    'a lit window', 'a street lamp', 'snow falling', 'a bus stop', 'a warm bath', 'a soup pot', 'a candle', 'a book', 'a blanket', 'slippers', 'a radiator', 'a cat on the sill', 'a puzzle', 'a hot water bottle', 'a teapot', 'a moon', 'frost on glass', 'a lamp', 'knitting', 'a movie night', 'popcorn', 'a fireplace', 'a sleepy dog', 'a candle jar', 'a board game', 'pajamas', 'a night sky', 'a chimney', 'an orange peel', 'a dark street', 'your evening'],
];
for (const [t, kick, art, th, season, topics, ...items] of OL) {
  const tt = t.replace(/<\/?em>/g, '');
  push({ tpl: 'popen', th, t, kick, art: A(art), items, season,
    title: `${tt.replace(/^./, c => c.toUpperCase())} — ${items.length}-Day Drawing Challenge (Free List)`,
    desc: `${items.length} small things to draw, one a day: ${items.slice(0, 5).join(', ')}… Save this list, grab any sketchbook and draw ten minutes a day. A new prompt list every month on pigeonpolly.com.`,
    alt: `A ${items.length}-day drawing prompt list “${tt}” in a grid of numbered cards with an illustration by Pigeon Polly.`,
    link: U('/prompts/', n), topics: topics + ', Drawing challenge, Sketchbook prompts' });
}

// ——— 2) палитры деталей (серия details на /palettes/): 5 форматов — 6, 5, 4, 3 и 8 цветов, HEX видны (Алина 21.11) ———
const P8 = (() => { try { return require('./p17/pal8.json'); } catch (e) { return {}; } })();
const MOOD = { 'Зима': 'a cozy winter', 'Осень': 'a warm autumn', 'Весна': 'a fresh spring', 'Лето': 'a sunny summer', 'Круглый год': 'an everyday' };
const FMT = [['pal6', 6, 'dark'], ['pal5', 5, 'cream'], ['pal4', 4, 'paper'], ['pal3', 3, 'dark'], ['pal8', 8, 'cream']];
const SEAS = { 'Зима': 'Winter', 'Осень': 'Autumn', 'Весна': 'Spring', 'Лето': 'Summer' };
DET.forEach((d, i) => {
  const p = PALS[d.key], t = d.t[0];
  let [tpl, k, th] = FMT[i % 5];
  if (k === 8 && !(P8[d.key] && P8[d.key].length === 8)) [tpl, k, th] = FMT[0];
  const v = p.colors, cols = k === 8 ? P8[d.key] : k === 6 ? v : k === 5 ? [...v.slice(0, 3), v[3], v[5]] : k === 4 ? [v[0], v[1], v[2], v[3]] : v.slice(0, 3);
  const word = { 3: 'three', 4: 'four', 5: 'five', 6: 'six', 8: 'eight' }[k];
  push({ tpl, th: i % 10 >= 5 && th === 'dark' ? 'night' : th, t: t.replace(/(\S+)$/, '<em>$1</em>'), img: p.img, key: d.key, cols, k, season: d.s,
    title: `${t} — ${k}-Color Palette with HEX Codes | Pigeon Polly`,
    desc: `A ${word}-color palette from a detail of my painting: ${cols.map(c => `${c.en} ${c.hex}`).join(', ')}. ${MOOD[d.s].replace(/^./, c => c.toUpperCase())} mood. More palettes from my paintings — one click copies the HEX — on pigeonpolly.com.`,
    alt: `${word.replace(/^./, c => c.toUpperCase())}-color palette “${t}” with names and HEX codes next to a close-up detail of a painting by Pigeon Polly.`,
    link: U(`/palettes/#${d.key}`, n), topics: `${t} color palette, ${k} color palette, Color palette from painting, HEX codes, ${SEAS[d.s] || 'Aesthetic'} color palette` });
});

// ——— 3) акварель за 4 шага (все шаги видно; дальше — бесплатные уроки) ———
const ST = [
  ['an espresso cup', 'sketchbook-11', 'a polka-dot cup under an espresso machine', 'Круглый год', 'Keep white dots as bare paper'],
  ['a paint tube', 'sketchbook-19', 'a squeezed paint tube in a sketchbook', 'Круглый год', 'Metal shine: dark right next to white'],
  ['a mug of brushes', 'sketchbook-21', 'a pink mug full of brushes and paint tubes', 'Круглый год', 'One shadow under the mug grounds it'],
  ['cloudberries', 'sketchbook-15', 'cloudberries with golden leaves', 'Лето', 'Drop color into wet paper for the berries'],
  ['a sunny street corner', 'sketchbook-14', 'a coral wall and a gate on a sunny street', 'Лето', 'Paint the shadow in one cool stroke'],
  ['a tram street', 'sketchbook-20', 'an old street with a tram and a lighthouse', 'Осень', 'Leave the sky loose and pale'],
  ['a candlelit breakfast', 'sketchbook-5', 'a breakfast table with a candle and a croissant', 'Зима', 'Warm glow = yellow next to grey'],
  ['a New Year table', 'sketchbook-18', 'a festive table with champagne and a tree', 'Зима', 'Tiny gold dots last, with gouache'],
  ['a café counter', 'sketchbook-12', 'a café counter with cups and cakes', 'Осень', 'Group small objects into one shape first'],
  ['a cozy breakfast spread', 'sketchbook-13', 'a breakfast spread on a sketchbook spread', 'Круглый год', 'Plates are just ovals and shadows'],
  ['jungle leaves', 'sketchbook-16', 'a loose watercolor jungle', 'Лето', 'Dark leaves on top of light ones, not around them'],
  ['a market cart', 'sketchbook-6', 'a market cart with numbered boxes', 'Круглый год', 'Wheels: two ellipses and a dark gap'],
  ['a bat-wing teacup', 'halloween-cup', 'a teacup with a bat wing', 'Осень', 'Soft edges for the steam, sharp for the wing'],
  ['olives & cheese', 'olives', 'green olives and cheese on a plate', 'Лето', 'Each olive: one wash, one dark spot, one white dot'],
  ['nail polish & lipstick', 'nailpolish', 'a bottle of red nail polish and a lipstick', 'Круглый год', 'Splatter last, with a loaded brush'],
  ['a summer meadow', 'field_acrylic', 'a green meadow under a blue sky', 'Лето', 'Darker greens in front, bluer greens far away'],
  ['an apple creature', 'apple_creature', 'a funny creature with an apple head', 'Осень', 'Glaze the brown in two layers'],
  ['a vintage postcard', 'postcard_world', 'an old-style postcard with a street lamp', 'Круглый год', 'Coffee-colored wash makes paper look old'],
  ['a snail & a coffee pot', '2023-mr-chew-coffee-passion', 'a snail hugging a coffee pot', 'Круглый год', 'Glass = a few hard white lines'],
  ['a knitting snail', '2025-sometimes-mr-chew-wants-to-be-retired', 'a snail knitting with a croissant shell', 'Зима', 'Stripes follow the round shape'],
  ['a pumpkin snail', '2024-halloween-edition', 'a snail with a jack-o’-lantern shell', 'Осень', 'Orange glows next to deep blue-grey'],
  ['a snail with balloons', '2023-mr-chew-delivery', 'a snail flying with violet balloons', 'Весна', 'Leave a white curve on each balloon'],
  ['a Santa snail', '2024-mr-chew-celebrates-new-year', 'a snail with a sack of presents', 'Зима', 'Red sack: light red first, dark folds later'],
  ['a snail in love', '2024-mr-chew-celebrates-valentines-day', 'a snail with little hearts', 'Зима', 'Pink hearts last, they sit on top'],
  ['a unicorn snail', '2024-mr-chew-rainbow-candy-edition', 'a unicorn snail with a rainbow shell', 'Весна', 'Let rainbow colors bleed into each other'],
  ['a postal snail', '2023-mr-chew-australian-postal-snail-introduction', 'a snail carrying letters', 'Круглый год', 'Kraft paper: yellow ochre + a touch of grey'],
  ['a snail in fairy lights', '2023-mr-chew-be-careful-on-the-road', 'a snail wrapped in fairy lights', 'Зима', 'Lights = bright dot + soft yellow halo'],
  ['a pumpkin & a cat', '2023-mr-chew-halloween-edition', 'a pumpkin, a snail and a black cat', 'Осень', 'Inside of the pumpkin is the darkest dark'],
  ['a vampire pigeon', '2026-pigeon-polly-is-hiding-something', 'a pigeon in a pink gown at a mirror', 'Осень', 'Torch light: warm in the middle, cold at the edges'],
  ['a pigeon painting', '2026-pigeon-polly-accidentaly-drinked-brush-watercolor-water', 'a pigeon painting at a table', 'Круглый год', 'Background last, so the pigeon pops'],
];
const cap = s => s.replace(/(^|[\s-])[a-z]/g, x => x.toUpperCase()).replace(/ (A|An|With|Of|On|In|The|And)(?= )/g, m => m.toLowerCase()).replace(/^(A|An) /, m => m.toLowerCase());
for (const [what, art, alt, season, tip] of ST) {
  push({ tpl: 'steps', th: 'paper', what, art: A(art), name: art.replace(/[^a-z0-9]+/gi, '_').slice(0, 40), tip, season,
    title: `How to Paint ${cap(what)} in 4 Steps — Watercolor & Ink for Beginners`,
    desc: `My painting of ${alt}, broken into 4 easy steps: light pencil shapes, ink lines, a first pale wash, then darks and details. Tip: ${tip.toLowerCase()}. More free watercolor lessons on pigeonpolly.com.`,
    alt: `Four steps of painting ${alt}: pencil sketch, ink outline, first wash and the finished watercolor by Pigeon Polly.`,
    link: U('/learn/', n), topics: 'Watercolor step by step, Easy watercolor painting, Ink and watercolor, Watercolor for beginners' });
}

// ——— 4) палитра-челлендж (по палитрам деталей), бинго, отличия ———
const PCH = [['details-tree-lights', ['a gingerbread house', 'a sleeping fox', 'a wool hat', 'a teapot', 'a snowy roof']], ['details-pumpkin-soup', ['a mushroom', 'a lantern', 'a fox', 'a teacup', 'a crow']],
  ['details-monstera-tiles', ['a bathtub', 'a fish', 'a raincoat', 'a cactus', 'a teapot']], ['details-desert-sunset', ['a camel', 'a lemon', 'a sun hat', 'a cactus', 'a seashell']],
  ['details-polka-dot-cup', ['a ladybug', 'a strawberry', 'a sock', 'a mushroom', 'a gift box']], ['details-midnight-asphalt', ['a taxi', 'a street lamp', 'a cat', 'a cone', 'a moon']],
  ['details-paint-box-in-bloom', ['a tulip', 'a bird', 'a teacup', 'a kite', 'a bee']], ['details-champagne-tinsel', ['a bauble', 'a cake', 'a candle', 'a party hat', 'a clock']]];
for (const [key, items] of PCH) {
  const p = PALS[key];
  push({ tpl: 'palch', th: 'cream', t: `${p.title.en}: <em>palette challenge</em>`, img: p.img, cols: p.colors, items, season: DET.find(d => d.key === key).s,
    title: `Palette Challenge: Paint 5 Things with Only These 6 Colors (${p.title.en})`,
    desc: `A limited-palette challenge: paint ${items.slice(0, 4).join(', ')} and ${items[4]} using only these six colors from my painting. No other colors allowed! HEX codes on pigeonpolly.com.`,
    alt: `A palette challenge: six color swatches from a painting by Pigeon Polly and a list of five things to paint with them.`,
    link: U(`/palettes/#${key}`, n), topics: 'Color palette challenge, Limited palette, Watercolor practice, Art challenge, HEX codes' });
}
const BG = [
  ['Christmas market <em>bingo</em>', 'night', 'lanterns', ['a mulled wine cup', 'a gingerbread', 'a wooden stall', 'a garland', 'a candle', 'a carousel', 'a knitted hat', 'a pretzel', 'a star', 'a snowflake', 'an ornament', 'a hot chestnut', 'a reindeer', 'a choir', 'a mitten', 'a lantern', 'a cookie', 'a snow globe', 'a fir tree', 'a bell', 'a candy cane', 'a scarf', 'a toy train', 'a gift bag']],
  ['Snow day sketch <em>bingo</em>', 'cream', 'winter_field', ['a snowman', 'a sled', 'boot prints', 'a snow angel', 'a shovel', 'icicles', 'a frozen pond', 'a crow', 'a snowball', 'a fence', 'a bare tree', 'a mitten', 'cocoa', 'a lamp post', 'a dog', 'a bench', 'a window', 'a scarf', 'a bird feeder', 'a chimney', 'skates', 'a pine', 'a hat', 'footsteps']],
  ['Café sketching <em>bingo</em>', 'clay', 'sketchbook-12', ['a cup', 'a croissant', 'a menu', 'a spoon', 'a sugar pot', 'a waiter', 'a plant', 'a lamp', 'a cake', 'a laptop', 'a window', 'a chair', 'a teapot', 'a barista', 'a sign', 'a napkin', 'a muffin', 'a book', 'a hat', 'a bag', 'a dog', 'a phone', 'a jar', 'your hand']],
  ['New Year’s Eve <em>bingo</em>', 'dark', '2023-pigeon-polly-celebrates-new-year', ['champagne', 'a clock', 'confetti', 'a party hat', 'a sparkler', 'fireworks', 'a cake', 'a balloon', 'a calendar', 'a wish list', 'a candle', 'a disco ball', 'a toast', 'a mask', 'a gift', 'a playlist', 'tangerines', 'a selfie', 'a cat asleep', 'a firework box', 'glitter', 'a resolution', 'a hug', 'midnight']],
  ['Rainy day drawing <em>bingo</em>', 'wash', 'sketchbook-20', ['an umbrella', 'a puddle', 'raindrops', 'a raincoat', 'boots', 'a snail', 'a cloud', 'a tram', 'a wet dog', 'a window', 'a teacup', 'a rainbow', 'a frog', 'a bus stop', 'a duck', 'a worm', 'a candle', 'a book', 'a leaf', 'a lamp', 'a cat', 'a blanket', 'a mushroom', 'a paper boat']],
  ['Kitchen sketch <em>bingo</em>', 'blush', 'oil_stilllife', ['a kettle', 'a whisk', 'an egg', 'a jar', 'a lemon', 'a pan', 'a spoon', 'a toaster', 'a mug', 'a bread loaf', 'garlic', 'a teapot', 'a bowl', 'an apron', 'a recipe', 'a plant', 'a cookie', 'a fork', 'a tomato', 'a grater', 'a bottle', 'a towel', 'an oven mitt', 'a fridge magnet']],
  ['Winter walk <em>bingo</em>', 'sage', '2026-pigeon-polly-seven-years-later', ['a pine cone', 'a robin', 'a bench', 'a scarf', 'a dog', 'a birch', 'tracks', 'a red berry', 'a lamp', 'a gate', 'a squirrel', 'frost', 'a hat', 'a bridge', 'a crow', 'a mailbox', 'a fir', 'a church', 'smoke', 'a sled', 'a cat', 'a coffee', 'a fence', 'the sky']],
  ['Cozy evening <em>bingo</em>', 'night', '2026-pigeon-polly-keeps-busy-living', ['a blanket', 'a candle', 'a book', 'socks', 'a lamp', 'tea', 'a cat', 'a puzzle', 'a plant', 'slippers', 'a pillow', 'a TV', 'a cookie', 'a mug', 'a radio', 'a sweater', 'a window', 'popcorn', 'a game', 'a clock', 'a photo', 'a playlist', 'pajamas', 'a moon']],
];
for (const [t, th, art, items] of BG) {
  push({ tpl: 'bingo', th, t, art: A(art), items, season: /Rainy/.test(t) ? 'Осень' : /Café|Kitchen/.test(t) ? 'Круглый год' : 'Зима',
    title: `${t.replace(/<\/?em>/g, '')}: 24 Things to Draw (Sketchbook Game)`,
    desc: `Drawing bingo: draw a square, cross it off — ${items.slice(0, 3).join(', ')}… Get a line, then the whole card. Save this pin and play in your sketchbook. More daily prompts on pigeonpolly.com.`,
    alt: `A 5×5 drawing bingo card “${t.replace(/<\/?em>/g, '')}” with small drawing prompts and a free center square, illustration by Pigeon Polly.`,
    link: U('/prompts/', n), topics: 'Drawing bingo, Sketchbook game, Drawing prompts, Art challenge, Fun drawing ideas' });
}
for (const art of ['2023-pigeon-polly-celebrates-new-year', '2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes', '2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year', '2026-pigeon-polly-fancy-life',
  '2019-pigeon-polly-writing-diploma', '2026-pigeon-polly-seven-years-later', '2022-pigeon-polly-graphic-designer', '2024-mr-chew-steamphunk-edition']) {
  push({ tpl: 'diff', th: 'cream', art: A(art), name: art.slice(0, 40), season: /new-year|sam-milka/.test(art) ? 'Зима' : 'Круглый год',
    title: 'Spot the 5 Differences — Cozy Illustration Puzzle', desc: 'Two copies of my illustration, five sneaky differences. Can you find them all? The answer key is hidden upside down in the corner. More cozy games on pigeonpolly.com.',
    alt: 'Two copies of an illustration by Pigeon Polly, one above the other, with five differences to find and a small upside-down answer key.',
    link: U('/games/', n), topics: 'Spot the difference, Picture puzzle, Brain teaser, Cozy illustration, Fun puzzles' });
}

// ——— 5) адвент: 50 тизеров (что внутри — не говорим) ———
const ADV = '/advent/';
const AL = (o) => push({ season: 'Зима', link: U(ADV, n, 'advent26'), topics: 'Advent calendar 2026, Free advent calendar, Christmas countdown, Cozy December, Online advent calendar', ...o });
// улица 31 окошка (снимок страницы)
[['A street of <em>31 windows</em>', 'opens 1 December', 'Save this. Something waits behind every window.'],
 ['One window <em>a day</em> until New Year', '1–31 December', 'Tap today’s window — it’s free.'],
 ['Your December <em>advent street</em>', 'free online advent calendar', 'Every morning one more window lights up.'],
 ['Not chocolate. <em>Something better.</em>', 'advent calendar 2026', '31 windows. Zero spoilers.'],
 ['The coziest <em>advent calendar</em> online', 'pigeon polly · december', 'Little houses, frosted windows, a surprise every day.'],
 ['Psst… the <em>windows</em> are frosted', 'opens 1 december', 'You’ll see what’s inside on the day. Not before.'],
 ['31 days. <em>31 surprises.</em>', 'free · no app needed', 'Open one window a day on pigeonpolly.com.'],
 ['Missed a day? <em>It waits for you.</em>', 'advent calendar 2026', 'Most windows stay open for late birds.'],
].forEach(([t, kick, sub], i) => AL({ tpl: 'astreet', th: 'adv', t, kick, sub,
  title: `${t.replace(/<\/?em>/g, '')} — Free Advent Calendar 2026 | Pigeon Polly`,
  desc: `${sub} A free illustrated advent calendar: a little street of 31 frosted windows, one opens every day from 1 to 31 December. What’s inside? You’ll find out on the day. Save this pin so you don’t miss window 1.`,
  alt: 'An illustrated street of colorful little houses with 31 frosted, numbered windows — the Pigeon Polly advent calendar.' }));
// одно окно крупно
[[1, 'The first window opens <em>1 December</em>', 'Be there when it lights up.'], [6, 'Window 6 is <em>golden</em>', 'Golden windows are special. That’s all we can say.'],
 [12, 'What’s behind <em>window 12</em>?', 'A little surprise, on the 12th.'], [19, 'Window 19 has a <em>gold frame</em>', 'Round windows hide something extra.'],
 [24, 'Christmas Eve opens <em>the big door</em>', 'Window 24 opens only on the 24th. Don’t miss it.'], [31, 'The last window opens <em>on New Year’s Eve</em>', 'The 31st is the most special one. Only on the day.'],
 [3, 'Day 3: <em>still frosted</em>', 'No peeking — it opens on the 3rd.'], [9, 'Knock knock. <em>Window 9.</em>', 'Who’s there? Find out on 9 December.'],
 [14, 'Halfway to Christmas: <em>window 14</em>', 'A cozy surprise for a dark mid-December evening.'], [17, 'A ribbon on <em>window 17</em>', 'When the ribbon appears, it’s yours to open.'],
 [21, 'The longest night, <em>window 21</em>', 'Something warm behind the frost.'], [28, 'The quiet days: <em>window 28</em>', 'Between holidays, one more little gift.'],
].forEach(([d, t, sub], i) => AL({ tpl: 'awin', th: ['adv', 'pine', 'adv', 'wine'][i % 4], d, t, sub, special: [6, 12, 19, 24, 31].includes(d),
  title: `${t.replace(/<\/?em>/g, '')} — Advent Calendar Window ${d} | Pigeon Polly`,
  desc: `${sub} Window ${d} of my free illustrated advent calendar opens on ${d} December. What’s inside is a secret until then — save this pin and come back on the day.`,
  alt: `A big frosted window with a red ribbon and the number ${d} — window ${d} of the Pigeon Polly advent calendar, still closed.` }));
// арт Алины + тизер
[['2025-pigeon-polly-celebrates-new-year', 'Pigeon Polly hid <em>31 surprises</em>', 'Find one every day in December.', 'night'],
 ['winter_field', 'December is better <em>with a window a day</em>', 'A free advent calendar by Pigeon Polly.', 'night'],
 ['2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year', 'The whole gang is <em>wrapping something</em>', 'Opens 1 December. No spoilers.', 'night'],
 ['2022-pigeon-polly-celebrates-new-year-first-time-in-the-bed', 'Stay in bed. <em>Open a window.</em>', 'A cozy advent calendar you open from your phone.', 'dark'],
 ['2024-mr-chew-celebrates-new-year', 'Mr. Chew is <em>packing the advent</em>', 'He’s slow, but he’ll make it by 1 December.', 'paper'],
 ['cat_lights', 'Fairy lights on. <em>Window open.</em>', 'One little December ritual, 31 times.', 'night'],
 ['lanterns', 'Light a lantern, <em>open a window</em>', 'A free illustrated advent calendar.', 'adv'],
 ['sketchbook-18', 'Countdown to 2027, <em>one window at a time</em>', 'Something waits behind each one.', 'paper'],
 ['caffeine_cup', 'Coffee first. <em>Then today’s window.</em>', 'Your new December morning routine.', 'clay'],
 ['cookies', 'Better than the <em>chocolate</em> kind', 'An advent calendar for creative people.', 'dark'],
].forEach(([art, t, sub, th]) => AL({ tpl: 'aart', th, art: A(art), t, sub,
  title: `${t.replace(/<\/?em>/g, '')} — Pigeon Polly Advent Calendar 2026`,
  desc: `${sub} 31 frosted windows from 1 to 31 December; one opens each day on pigeonpolly.com. What’s inside? That’s the fun part. Save this pin for 1 December.`,
  alt: 'A cozy illustration by Pigeon Polly with a teaser for a free online advent calendar.' }));
// подглядывание сквозь иней
[['Can you guess <em>what’s inside?</em>', 'The frost hides everything. Until the day.'], ['No peeking <em>until December</em>', 'Even we can’t see through the frost.'],
 ['Something is <em>behind the frost</em>', 'Wipe the window on the day and see.'], ['Things you can <em>keep</em>', 'Some windows hold something to keep forever.'],
 ['Wrapped, frosted, <em>waiting</em>', '31 little windows, opening 1 December.'], ['Made by hand, <em>wrapped for you</em>', 'Everything inside is made by Pigeon Polly.'],
 ['A sneak peek? <em>Nope.</em>', 'Just colors through the ice. Come back on the day.'], ['Blurry now, <em>yours soon</em>', 'Open one window every day in December.'],
].forEach(([t, sub], i) => AL({ tpl: 'apeek', th: i % 2 ? 'pine' : 'adv', t, sub, seed: i,
  title: `${t.replace(/<\/?em>/g, '')} — Advent Calendar Teaser | Pigeon Polly`,
  desc: `${sub} My free advent calendar opens on 1 December: 31 windows, one a day, all made by hand. No spoilers here — save the pin and open the first window on the day.`,
  alt: 'Frosted windows with blurry colors behind them — a teaser for the Pigeon Polly advent calendar.' }));
// «что будет» — расплывчато
[['What to expect <em>this December</em>', ['31 frosted windows', 'one opens every day', 'little things to keep', 'gifts for your bird', '5 special windows', 'all free']],
 ['Why you’ll <em>love</em> this advent', ['it’s free', 'it’s handmade', 'it takes a minute a day', 'late? most windows wait', 'no app, just a browser', 'it’s cozy, promise']],
 ['Your new <em>December ritual</em>', ['make a cocoa', 'open today’s window', 'smile', 'save what you found', 'come back tomorrow', 'repeat ×31']],
 ['Advent calendar, <em>the rules</em>', ['one window a day', 'only from 1 December', 'no peeking early', '24 and 31: only on the day', 'others wait for you', 'collect all 31 for a badge']],
 ['5 reasons to <em>save this pin</em>', ['window 1 opens 1 December', 'it’s free', 'it’s different every day', 'it’s made by an artist', 'you deserve a little treat', '…and there are golden windows']],
 ['Things that are <em>NOT</em> inside', ['chocolate (sorry)', 'ads', 'homework', 'spam', 'stress', 'spoilers in this pin']],
].forEach(([t, items], i) => AL({ tpl: 'alist', th: ['adv', 'pine', 'wine'][i % 3], t, items,
  title: `${t.replace(/<\/?em>/g, '')} — Free Advent Calendar 2026 | Pigeon Polly`,
  desc: `${items.slice(0, 4).join(', ')}… My free illustrated advent calendar opens on 1 December on pigeonpolly.com. What exactly is inside stays a secret until each window opens.`,
  alt: 'A checklist teaser for the Pigeon Polly advent calendar on a dark festive card with a little illustrated window.' }));
// календарь-сетка: все 31 закрыты
[['Save the date: <em>1 December</em>', 'pine'], ['31 windows, <em>all still closed</em>', 'adv'], ['Mark your calendar: <em>advent opens</em>', 'paper'],
 ['Count down with <em>Pigeon Polly</em>', 'wine'], ['Which window <em>are you waiting for?</em>', 'adv'], ['Every square is <em>a surprise</em>', 'pine'],
].forEach(([t, th], i) => AL({ tpl: 'acal', th, t, seed: i,
  title: `${t.replace(/<\/?em>/g, '')} — Advent Calendar 2026 Countdown | Pigeon Polly`,
  desc: 'A grid of 31 wrapped windows, from 1 to 31 December. One opens each day on pigeonpolly.com — free, made by hand, and full of little surprises. Save this pin and come back on 1 December.',
  alt: 'A calendar grid of 31 wrapped advent windows with ribbons and five golden ones, Pigeon Polly advent calendar.' }));

module.exports = out;
