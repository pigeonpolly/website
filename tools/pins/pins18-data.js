// Пины №1731–1780 (SET=18, Алина 28.11.2026: «создай 50 новых пинов»; скилл pin-sets). Движок — tools/pins/pins18.js.
// Правила 28.11: арт не обрезать (рамка по пропорциям арта), палитры только 6 или 8 цветов, без конкретных дат.
// 1731–1750 открытые списки тем (/prompts/), 1751–1762 палитры 12 новых деталей (/palettes/#details-…),
// 1763–1766 палитра-челлендж, 1767–1770 бинго (/prompts/), 1771–1772 отличия (/games/), 1773–1780 — новый формат (выбирает Алина).
// Пины «акварель за 4 шага» Алина запретила 28.11 (docs/retired.md) — их тут нет.
const SITE = 'https://www.pigeonpolly.com';
const U = (p, n, c = 'top28') => { const [a, h] = p.split('#'); return `${SITE}${a}?utm_source=pinterest&utm_campaign=${c}&utm_content=pin-${n}${h ? '#' + h : ''}`; };
const A = k => /\//.test(k) ? k : /^\d{4}-(pigeon|polly)/.test(k) ? `bird/${k}.jpg` : /^\d{4}-/.test(k) ? `snail/${k}.jpg` : /^sketchbook-/.test(k) ? `sketchbook/${k}.jpg` : /^halloween-/.test(k) ? `halloween/${k}.jpg` : `photos2/${k}.jpg`;
const PALS = Object.fromEntries(require('../../content/palettes.json').map(p => [p.key, p]));
const DET = require('../../content/palette-details.json');
const P8 = (() => { try { return require('./p17/pal8.json'); } catch (e) { return {}; } })();
const out = []; let n = 1731;
const push = o => { out.push({ n, ...o }); n++; };

// ——— 1) открытые списки тем: всё видно (как залетевшие), 30 штук ———
const OL = [
  ['30 <em>houseplants</em> to draw', 'plant lover drawing challenge', 'plants_tin', 'sage', 'Круглый год', 'Houseplant drawing ideas, Plant illustration, Botanical sketchbook',
    'a monstera', 'a snake plant', 'a pothos vine', 'a fiddle leaf fig', 'a tiny cactus', 'an aloe', 'a peace lily', 'string of pearls', 'a fern', 'a jade plant', 'a rubber plant', 'a calathea', 'an orchid', 'a spider plant', 'a bonsai',
    'a succulent bowl', 'a herb pot', 'a hanging basket', 'a terrarium', 'an air plant', 'a little palm', 'a begonia', 'a cutting in a jar', 'a watering can', 'a brand-new leaf', 'a repotting mess', 'a plant on a shelf', 'a plant by a lamp', 'a sad plant', 'your oldest plant'],
  ['30 <em>penguins</em> doing cozy things', 'winter drawing challenge', '2025-pigeon-polly-celebrates-new-year', 'night', 'Зима', 'Cute penguin drawing, Winter animal drawing, Cozy character ideas',
    'knitting a scarf', 'ice skating', 'sipping cocoa', 'in a bobble hat', 'building a snowman', 'reading in bed', 'baking cookies', 'on a sled', 'at a bus stop', 'wrapping a gift', 'playing piano', 'painting', 'in a bubble bath', 'belly sliding',
    'with a lantern', 'posting a letter', 'eating soup', 'in pajamas', 'trimming a tree', 'with an umbrella', 'in a café', 'on a train', 'taking a selfie', 'doing yoga', 'in a sauna', 'with a cat', 'stargazing', 'making a wish', 'asleep on a book', 'waving hello'],
  ['30 things in a <em>sewing basket</em>', '30-day drawing challenge', 'turtles', 'blush', 'Круглый год', 'Sewing drawing ideas, Craft still life, Cozy object drawing',
    'a pincushion', 'a spool of thread', 'a thimble', 'golden scissors', 'a tape measure', 'a button jar', 'a needle case', 'a lace ribbon', 'a zip', 'a patch', 'a pattern paper', 'a chalk piece', 'a bobbin', 'a seam ripper', 'safety pins',
    'a darning egg', 'an old sewing tin', 'a velvet scrap', 'an embroidery hoop', 'a felt heart', 'a tiny pin', 'a ball of wool', 'a sock to mend', 'a crochet hook', 'snaps & hooks', 'a name label', 'a half-done hem', 'a fabric stack', 'a sewing machine', 'a cat on the fabric'],
  ['30 <em>teapots</em> to draw', 'tea lover drawing challenge', 'sketchbook-7', 'cream', 'Круглый год', 'Teapot drawing ideas, Tea illustration, Kitchen still life',
    'a round teapot', 'a tall teapot', 'a tiny teapot', 'a chipped teapot', 'a glass teapot', 'a cast iron pot', 'a striped teapot', 'a floral teapot', 'a cat teapot', 'a house teapot', 'a mushroom teapot', 'a teapot in a cosy', 'a samovar',
    'a teapot with steam', 'a teapot & cup', 'a teapot upside down', 'a broken spout', 'a teapot plant pot', 'a teapot on a stove', 'a gold teapot', 'a polka-dot pot', 'a teapot with legs', 'a snail teapot', 'a teapot lamp', 'a teapot in snow',
    'a teapot portrait', 'a teapot family', 'a teapot shop', 'a teapot hat', 'your own teapot'],
  ['30 <em>foxes</em> in the snow', 'winter drawing challenge', 'winter_field', 'clay', 'Зима', 'Fox drawing ideas, Winter animal drawing, Woodland illustration',
    'a sleeping fox', 'a fox in a scarf', 'a fox jumping', 'fox paw prints', 'a fox with a lantern', 'a fox & a rabbit', 'a fox family', 'a fox at a window', 'a fox in a burrow', 'a fox catching snow', 'a curled-up tail', 'a fox on a fence',
    'a fox with a gift', 'a fox reading', 'a fox & a crow', 'a fox in boots', 'a fox by a fire', 'a fox at dusk', 'a fox with berries', 'a fox in a hat', 'a fox skating', 'a fox mailman', 'a fox on a sled', 'a fox howling', 'a fox in moonlight',
    'a fox in a teacup', 'a fox baker', 'a fox knitting', 'a fox at the market', 'a fox saying hi'],
  ['30 <em>kitchen tools</em> with faces', '30-day drawing challenge', 'breakfast_kitchen', 'paper', 'Круглый год', 'Funny object characters, Kitchen drawing ideas, Cute doodles',
    'a grumpy whisk', 'a sleepy kettle', 'a brave spatula', 'a shy egg cup', 'a toaster in love', 'a nervous grater', 'a proud rolling pin', 'a lazy ladle', 'a wise old pan', 'a bored colander', 'a sneaky peeler', 'a dancing spoon',
    'a jar that knows', 'a sad sieve', 'a happy mixer', 'a tiny timer', 'a salt & pepper duo', 'a nutcracker', 'a garlic press', 'a cheeky corkscrew', 'a soup pot boss', 'a teaspoon baby', 'an oven mitt hug', 'a cutting board',
    'a pepper mill', 'a can opener', 'a measuring cup', 'a fork in a hurry', 'a muffin tin', 'a fridge magnet'],
  ['30 things on a <em>winter train</em> ride', 'travel sketchbook challenge', 'train_inking_cat', 'night', 'Зима', 'Train drawing ideas, Travel sketchbook, Winter journey drawing',
    'a frosty window', 'a ticket', 'a thermos', 'snowy fields', 'a sleeping stranger', 'a station clock', 'a suitcase', 'a sandwich', 'a book on knees', 'a conductor hat', 'a woolly hat', 'a dog in a carrier', 'a tunnel',
    'a lit village', 'a cup of tea', 'a map', 'your boots', 'a luggage rack', 'a station bench', 'a snowy platform', 'a knitting granny', 'a window seat', 'the next stop sign', 'headphones', 'a tangerine', 'fog on glass',
    'a forest blur', 'a moonlit lake', 'a bridge', 'arriving home'],
  ['30 <em>sleepy animals</em> to draw', 'cozy drawing challenge', '2024-pigeon-polly-bath-relax', 'blush', 'Круглый год', 'Cute animal drawing, Sleepy animals, Cozy character ideas',
    'a curled-up cat', 'a dog on a rug', 'a dozing owl', 'a hedgehog ball', 'a bear in a cave', 'a sloth', 'a napping duck', 'a dormouse in a cup', 'a koala', 'a fox in a ring', 'a bunny pile', 'a panda', 'a seal on a rock',
    'a pigeon in a scarf', 'a snail in its shell', 'a sleepy horse', 'a goat in hay', 'a bat upside down', 'an otter float', 'a hamster bed', 'a penguin huddle', 'a lazy lion', 'a deer in moss', 'a cat in a box', 'a frog on a leaf',
    'a mouse in a sock', 'a dog & a cat', 'a squirrel nest', 'a turtle in a hat', 'a sleepy you'],
  ['30 <em>boots & shoes</em> to draw', '30-day drawing challenge', 'sketchbook-9', 'cream', 'Круглый год', 'Shoe drawing ideas, Fashion sketch, Object drawing practice',
    'muddy wellies', 'snow boots', 'ballet flats', 'old sneakers', 'fluffy slippers', 'cowboy boots', 'hiking boots', 'red heels', 'sandals', 'clogs', 'ice skates', 'tap shoes', 'baby booties', 'loafers', 'rain boots',
    'felt valenki', 'platform shoes', 'a lost shoe', 'shoes by a door', 'a shoe with laces', 'a shoe as a house', 'a cat in a boot', 'a shoe box', 'worn-out soles', 'a shoe repair shop', 'mismatched socks', 'mary janes',
    'running shoes', 'a boot planter', 'your favourite pair'],
  ['30 <em>tiny worlds</em> in a jar', 'imagination drawing challenge', 'sketchbook-8', 'wash', 'Круглый год', 'Whimsical drawing ideas, Imagination prompts, Tiny world illustration',
    'a forest', 'a stormy sea', 'a snowy village', 'a moon', 'a lighthouse', 'a city at night', 'a desert', 'a fish tank', 'a mushroom town', 'a cloud', 'a garden', 'a volcano', 'a tiny café', 'a beach', 'a castle',
    'a rainbow', 'a starry sky', 'a cat asleep', 'a train line', 'an island', 'a library', 'a waterfall', 'a pumpkin patch', 'a pond', 'a hot air balloon', 'northern lights', 'a bakery', 'a snail house', 'a planet', 'your bedroom'],
  ['30 <em>soups & bowls</em> to draw', 'cozy food drawing challenge', 'cookies', 'clay', 'Зима', 'Food drawing ideas, Cozy food illustration, Winter food sketch',
    'tomato soup', 'pumpkin soup', 'chicken noodle', 'ramen', 'borscht', 'pea soup', 'onion soup', 'miso soup', 'mushroom soup', 'lentil soup', 'a pho bowl', 'a stew pot', 'porridge', 'a fruit bowl', 'a salad bowl',
    'a rice bowl', 'cereal & milk', 'a dumpling bowl', 'chili', 'a bread bowl', 'soup & toast', 'a soup ladle', 'a steaming pot', 'a chipped bowl', 'a bowl with a cat', 'a soup for one', 'a soup for ten', 'a picnic thermos',
    'a spilled bowl', 'grandma’s soup'],
  ['30 <em>trams, buses & little trains</em>', 'urban sketching challenge', 'old_house', 'sage', 'Круглый год', 'Urban sketching ideas, Vehicle drawing, Travel sketchbook',
    'an old tram', 'a red bus', 'a trolleybus', 'a steam train', 'a cable car', 'a night bus', 'a school bus', 'a double-decker', 'a funicular', 'a toy train', 'a tram stop', 'a bus in snow', 'a mail van', 'a ferry',
    'a taxi', 'a bike with a basket', 'a scooter', 'a camper van', 'an ice cream van', 'a mountain train', 'a tram in rain', 'a bus driver', 'a ticket machine', 'a train bridge', 'a station café', 'a sleeper car',
    'a dining car', 'a little engine', 'a bus window view', 'your daily ride'],
  ['30 <em>hands</em> holding things', 'drawing practice challenge', 'lake_inhand', 'paper', 'Круглый год', 'Hand drawing practice, How to draw hands, Figure drawing ideas',
    'a cup', 'a pencil', 'a brush', 'a phone', 'a flower', 'a key', 'a letter', 'an apple', 'a book', 'a ticket', 'a teaspoon', 'a feather', 'a coin', 'an umbrella', 'a leaf', 'a candle', 'a shell', 'a ring', 'a sparkler',
    'a snowball', 'a paper boat', 'a tiny bird', 'a balloon string', 'chopsticks', 'a camera', 'a mitten', 'a paw', 'another hand', 'a heart', 'nothing at all'],
  ['30 things at a <em>ski lodge</em>', 'winter drawing challenge', 'sketchbook-1', 'night', 'Зима', 'Winter drawing ideas, Ski lodge aesthetic, Cozy winter prompts',
    'skis by the door', 'a fireplace', 'wool socks drying', 'a hot chocolate', 'goggles', 'a cable car', 'a log pile', 'a snowy balcony', 'a fondue pot', 'a board game', 'ski boots', 'a lodge sign', 'a moose head mug',
    'a plaid blanket', 'a bowl of stew', 'frosted pines', 'a sled', 'mittens on a heater', 'a mountain view', 'a cozy armchair', 'a snowboarder', 'a lift ticket', 'a sauna', 'an apple strudel', 'a snow cannon', 'a St Bernard',
    'a snowy hat', 'a sunrise peak', 'tired legs', 'a postcard home'],
  ['30 things in a <em>winter garden</em>', 'winter drawing challenge', 'frozen_pond', 'cream', 'Зима', 'Winter garden drawing, Nature sketchbook, Winter nature ideas',
    'a frozen birdbath', 'rose hips', 'a robin', 'a snowy bench', 'a bare apple tree', 'holly', 'a bird feeder', 'a greenhouse', 'a frosted cabbage', 'a sleeping hedgehog', 'a garden gnome', 'a snowy wheelbarrow', 'icicles',
    'a red berry bush', 'a pine cone', 'a robin’s footprints', 'a watering can', 'snowdrops', 'a wooden gate', 'a scarecrow', 'a compost heap', 'a bird box', 'a frosty spider web', 'a seed packet', 'a lantern', 'a snow-topped fence',
    'a sparrow gang', 'a garden shed', 'a stone path', 'a cat footprint'],
  ['30 <em>bears</em> doing cozy things', 'cozy drawing challenge', '2026-pigeon-polly-keeps-busy-living', 'clay', 'Зима', 'Cute bear drawing, Cozy animal ideas, Character drawing prompts',
    'a bear baking bread', 'a bear in a sweater', 'a bear reading', 'a bear with honey', 'a bear knitting', 'a bear at a picnic', 'a bear napping', 'a bear in a bath', 'a bear gardening', 'a bear painting', 'a bear on a bike',
    'a bear with tea', 'a bear in a hammock', 'a bear camping', 'a bear fishing', 'a bear with a kite', 'a bear dancing', 'a bear writing letters', 'a bear at a bakery', 'a bear on a swing', 'a bear in pajamas', 'a bear hugging',
    'a bear with a lamp', 'a bear and a bird', 'a bear in snow', 'a bear in a canoe', 'a bear chef', 'a bear librarian', 'a bear yawning', 'a bear family'],
  ['30 <em>windows</em> to draw', 'sketchbook challenge', 'doors_framed', 'wash', 'Круглый год', 'Window drawing ideas, Architecture sketch, Urban sketching prompts',
    'a round window', 'a shop window', 'a frosty window', 'an attic window', 'a stained glass', 'a window with a cat', 'a rainy window', 'a lit window', 'a window box', 'a tram window', 'a church window', 'an open shutter',
    'a cracked window', 'a bay window', 'a castle slit', 'a porthole', 'a bakery window', 'a window at dusk', 'a window with lights', 'a laundry window', 'a skylight', 'a café window', 'a window plant', 'a curtain blowing',
    'a window seat', 'a fogged window', 'a balcony door', 'a train window', 'a dollhouse window', 'your window now'],
  ['30 <em>owls</em> to draw', 'bird drawing challenge', 'night_pleinair', 'night', 'Круглый год', 'Owl drawing ideas, Bird illustration, Night drawing prompts',
    'a snowy owl', 'a barn owl', 'a tiny owlet', 'a grumpy owl', 'an owl reading', 'an owl in a hat', 'an owl at night', 'an owl on a branch', 'an owl in a tree hole', 'an owl with glasses', 'an owl teacher', 'an owl in flight',
    'an owl mailman', 'an owl family', 'an owl and moon', 'an owl in a scarf', 'an owl with tea', 'an owl detective', 'a sleepy owl', 'an owl in snow', 'an owl in a lamp', 'an owl in a cup', 'an owl on a sign',
    'an owl with a candle', 'an owl astronomer', 'an owl and a mouse', 'an owl in autumn', 'an owl hooting', 'an owl stamp', 'a paper owl'],
  ['30 things in a <em>post office</em>', 'snail mail drawing challenge', '2023-mr-chew-take-away-coffee', 'blush', 'Круглый год', 'Snail mail ideas, Stamp drawing, Postal aesthetic',
    'a stamp', 'an envelope', 'a red mailbox', 'a parcel', 'a postmark', 'a postcard', 'a letter scale', 'string & tape', 'a pen pal photo', 'a mail bag', 'a postman’s cap', 'a sorting rack', 'a counter bell', 'a queue',
    'a pen on a chain', 'airmail stripes', 'a fragile sticker', 'a pigeon courier', 'a snail courier', 'a parcel cat', 'a big box', 'a tiny box', 'a lost letter', 'a love letter', 'a postal bike', 'a mail van', 'a P.O. box',
    'a stamp album', 'a wax seal', 'a letter home'],
  ['30 things to draw for a <em>fresh start</em>', 'new year drawing challenge', 'yoga', 'sage', 'Зима', 'New year drawing ideas, Fresh start, Sketchbook prompts',
    'a blank page', 'a new pencil', 'an open door', 'a sunrise', 'a clean desk', 'a sprouting seed', 'a new notebook', 'a to-do list', 'a packed bag', 'running shoes', 'a glass of water', 'an alarm clock', 'a calendar page',
    'a path in snow', 'a key', 'a window opening', 'a fresh loaf', 'a paper plane', 'a lighthouse', 'a bird leaving', 'a tidy shelf', 'a yoga mat', 'a mountain', 'a first step', 'a new haircut', 'a ticket', 'a jar of coins',
    'a wish on paper', 'a sunrise coffee', 'you, this year'],
];
for (const [t, kick, art, th, season, topics, ...items] of OL) {
  const tt = t.replace(/<\/?em>/g, ''), T = tt.replace(/^./, c => c.toUpperCase());
  push({ tpl: 'popen', th, t, kick, art: A(art), items, season,
    title: `${T} — ${items.length}-Day Drawing Challenge (Free List)`,
    desc: `${items.length} small things to draw, one a day: ${items.slice(0, 5).join(', ')}… Save this list, grab any sketchbook and draw ten minutes a day. A new prompt list every month on pigeonpolly.com.`,
    alt: `A ${items.length}-day drawing prompt list “${tt}” in a grid of numbered cards with an illustration by Pigeon Polly.`,
    link: U('/prompts/', n), topics: topics + ', Drawing challenge, Sketchbook prompts' });
}

// ——— 2) палитры 12 новых деталей: 6 или 8 цветов, HEX видны ———
const MOOD = { 'Зима': 'a cozy winter', 'Осень': 'a warm autumn', 'Весна': 'a fresh spring', 'Лето': 'a sunny summer', 'Круглый год': 'an everyday' };
const SEAS = { 'Зима': 'Winter', 'Осень': 'Autumn', 'Весна': 'Spring', 'Лето': 'Summer' };
const PK = [['details-cauldron-glow', 8], ['details-cereal-splash', 6], ['details-persimmon-pages', 8], ['details-pink-impasto', 6], ['details-cherry-cupcake', 8], ['details-toadstool-cottage', 6],
  ['details-bookshop-window', 8], ['details-jam-toast', 6], ['details-rusty-moka', 8], ['details-frosty-birches', 6], ['details-milk-and-cookies', 8], ['details-pumpkin-portrait', 6]];
PK.forEach(([key, k0], i) => {
  const d = DET.find(x => x.key === key), p = PALS[key], t = d.t[0];
  const k = k0 === 8 && P8[key] && P8[key].length === 8 ? 8 : 6, cols = k === 8 ? P8[key] : p.colors, word = k === 8 ? 'eight' : 'six';
  push({ tpl: k === 8 ? 'pal8' : 'pal6', th: k === 8 ? 'cream' : ['dark', 'night'][i % 2], t: t.replace(/(\S+)$/, '<em>$1</em>'), img: p.img, key, cols, k, season: d.s,
    title: `${t} — ${k}-Color Palette with HEX Codes | Pigeon Polly`,
    desc: `A ${word}-color palette from a detail of my painting: ${cols.map(c => `${c.en} ${c.hex}`).join(', ')}. ${MOOD[d.s].replace(/^./, c => c.toUpperCase())} mood. More palettes from my paintings — one click copies the HEX — on pigeonpolly.com.`,
    alt: `${word.replace(/^./, c => c.toUpperCase())}-color palette “${t}” with names and HEX codes next to a detail of a painting by Pigeon Polly.`,
    link: U(`/palettes/#${key}`, n), topics: `${t} color palette, ${k} color palette, Color palette from painting, HEX codes, ${SEAS[d.s] || 'Aesthetic'} color palette` });
});

// ——— 4) палитра-челлендж, бинго, отличия ———
const PCH = [['details-cauldron-glow', ['a frog', 'a lantern', 'a spell book', 'a mushroom', 'a black cat']], ['details-cherry-cupcake', ['a teapot', 'a whale', 'a red umbrella', 'a birthday cake', 'a sailboat']],
  ['details-persimmon-pages', ['a goldfish', 'a fox', 'a beach ball', 'a sunset', 'a teacup']], ['details-frosty-birches', ['a sleeping owl', 'a foggy lake', 'a cabin', 'a crow', 'a pine cone']]];
for (const [key, items] of PCH) {
  const p = PALS[key];
  push({ tpl: 'palch', th: 'cream', t: `${p.title.en}: <em>palette challenge</em>`, img: p.img, cols: p.colors, items, season: DET.find(d => d.key === key).s,
    title: `Palette Challenge: Paint 5 Things with Only These 6 Colors (${p.title.en})`,
    desc: `A limited-palette challenge: paint ${items.slice(0, 4).join(', ')} and ${items[4]} using only these six colors from my painting. No other colors allowed! HEX codes on pigeonpolly.com.`,
    alt: `A palette challenge: six color swatches from a painting by Pigeon Polly and a list of five things to paint with them.`,
    link: U(`/palettes/#${key}`, n), topics: 'Color palette challenge, Limited palette, Watercolor practice, Art challenge, HEX codes' });
}
const BG = [
  ['Holiday baking <em>bingo</em>', 'clay', 'cookies', 'Зима', ['a rolling pin', 'flour cloud', 'a gingerbread', 'a whisk', 'an egg', 'a cookie cutter', 'a mixing bowl', 'an oven mitt', 'a recipe card', 'sprinkles', 'a cooling rack', 'a burnt one',
    'a pie', 'a stollen', 'a cookie jar', 'a timer', 'an apron', 'cinnamon', 'a star cookie', 'a messy table', 'a taste test', 'a gift tin', 'a cat watching', 'a crumb']],
  ['Train ride sketch <em>bingo</em>', 'night', 'train_inking_cat', 'Круглый год', ['a window seat', 'a ticket', 'a suitcase', 'a sleepy face', 'a station clock', 'a tunnel', 'a coffee cup', 'a bridge', 'headphones', 'a book', 'a conductor', 'a cow',
    'a dog', 'a backpack', 'a map', 'a snack', 'a hand rail', 'a forest blur', 'a platform', 'a sign', 'a bike', 'a knitter', 'a phone', 'a hat']],
  ['Around the house <em>bingo</em>', 'cream', 'breakfast_kitchen', 'Круглый год', ['a door key', 'a kettle', 'a lamp', 'a plant', 'a sock', 'a towel', 'a chair', 'a toothbrush', 'a pillow', 'a mug', 'a remote', 'a book',
    'a clock', 'a shoe', 'a candle', 'a jar', 'a broom', 'a coat hook', 'a window', 'a bag', 'a fridge magnet', 'a spoon', 'a laundry pile', 'your bed']],
  ['Winter wardrobe <em>bingo</em>', 'sage', 'winter_field', 'Зима', ['a scarf', 'mittens', 'a bobble hat', 'snow boots', 'a puffer coat', 'earmuffs', 'wool socks', 'a cardigan', 'long johns', 'a beret', 'a turtleneck', 'gloves',
    'a raincoat', 'slippers', 'a fur hood', 'leg warmers', 'a knit vest', 'a balaclava', 'a pom-pom', 'a ski jacket', 'pajamas', 'a robe', 'a shawl', 'a coat hanger']],
];
for (const [t, th, art, season, items] of BG) {
  push({ tpl: 'bingo', th, t, art: A(art), items, season,
    title: `${t.replace(/<\/?em>/g, '')}: 24 Things to Draw (Sketchbook Game)`,
    desc: `Drawing bingo: draw a square, cross it off — ${items.slice(0, 3).join(', ')}… Get a line, then the whole card. Save this pin and play in your sketchbook. More daily prompts on pigeonpolly.com.`,
    alt: `A 5×5 drawing bingo card “${t.replace(/<\/?em>/g, '')}” with small drawing prompts and a free center square, illustration by Pigeon Polly.`,
    link: U('/prompts/', n), topics: 'Drawing bingo, Sketchbook game, Drawing prompts, Art challenge, Fun drawing ideas' });
}
for (const art of ['2025-mr-chew-travel-edition-can-you-find-polly', '2025-pigeon-polly-celebrates-new-year']) {
  push({ tpl: 'diff', th: 'cream', art: A(art), name: art.slice(0, 40), season: /new-year/.test(art) ? 'Зима' : 'Круглый год',
    title: /new-year/.test(art) ? 'Spot the 5 Differences: a Pigeon’s New Year Party — Cozy Picture Puzzle' : 'Spot the 5 Differences: a Snail’s Travel Trunk — Cozy Picture Puzzle', desc: 'Two copies of my illustration, five sneaky differences. Can you find them all? The answer key is hidden upside down in the corner. More cozy games on pigeonpolly.com.',
    alt: 'Two copies of an illustration by Pigeon Polly, one above the other, with five differences to find and a small upside-down answer key.',
    link: U('/games/', n), topics: 'Spot the difference, Picture puzzle, Brain teaser, Cozy illustration, Fun puzzles' });
}
module.exports = out;
