// Данные пинов №111–120: ведут на страницу Facebook Алины (Алина 28.11.2026: «10 пинов на мою страницу»). Генератор — scf2611f.js.
// На странице FB — сторителлинг-посты о картинах, Полли, Мистере Чу, скетчбуке, палитрах, процессе (docs/growth.md → Facebook EN). Тексты пинов — только это, без обещаний конкретного поста.
const path = require('path');
const PAL = require(path.resolve(__dirname, '../../content/palettes.json'));
const P = pre => { const q = PAL.find(x => x.key.startsWith(pre)); if (!q) throw new Error('нет палитры ' + pre); return { art: q.img.replace(/^images\//, ''), name: q.title.en, cols: q.colors.map(c => [c.hex, c.en]) }; };
const { TH, BOARDS } = require('./scf2611-data.js');
const LINK = 'https://www.facebook.com/profile.php?id=61596806348947';
const NO = 'Без привязки к празднику', NY = 'Новый год и Рождество', LS = 'Лайфстайл художника';
const FBX = 'On my Facebook page I share the stories behind my paintings, sketchbook pages, palettes and new work in progress. Come say hi.';
const bath = P('2024-pigeon-polly-bath-relax');

const cards = [
  // 111 — история за картиной (горизонтальный арт на всю ширину сверху)
  { th: 'cream', type: 'top', art: 'bird/2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes.jpg', kick: 'Pigeon Polly on Facebook', h: 'Every painting <em>has a story</em>',
    sub: 'A pigeon, a train window, a cup of coffee and one very long autumn. I write down what was behind each painting.',
    title: 'The Story Behind the Painting: Cozy Watercolor of a Pigeon with Coffee on a Train',
    desc: 'A cozy watercolor of Pigeon Polly with coffee and a train window in autumn. Every painting I make starts with a small real moment. ' + FBX,
    alt: 'Watercolor of a blue pigeon in an orange sweater in a train compartment with coffee, a jelly cake and suitcases, string lights above the window.',
    board: 'Artist Studio & Aesthetic', ru: 'FB: «У каждой картины есть история» (Полли, кофе и поезд)', ntype: LS, season: 'Осень', hol: NO },

  // 112 — мем: «на минутку» в телефон
  { th: 'paper', type: 'meme', art: 'bird/2026-pigeon-polly-keeps-busy-living.jpg', ah: 'fit', at: 330, top: 'Me opening Facebook “just for a minute”', fs: 80, sub: 'at least scroll to something nice',
    title: 'Relatable Artist Meme: Opening Your Phone “Just for a Minute” (Funny Watercolor Pigeon)',
    desc: 'Pigeon Polly in her bathroom with toast and a phone, very busy doing nothing. A watercolor meme for everyone who scrolls a little too long. ' + FBX,
    alt: 'Watercolor of a blue pigeon sitting on a toilet with toast and a phone in a cluttered bathroom with a washing machine.',
    board: 'Relatable Artist Memes', ru: 'FB: мем «Открыла Facebook на минутку» (Полли в ванной)', ntype: 'Мемы', season: 'Круглый год', hol: NO },

  // 113 — палитра 6 цветов «Bath time blues»
  { th: 'wash', type: 'pal', art: bath.art, ah: 'fit', kick: 'Watercolor palette · 6 colors', h: 'Bath time <em>blues</em>', cols: bath.cols,
    title: 'Cozy Blue Color Palette: Bathroom Tile, Bubble Foam and Late Night Ink (6 HEX Codes)',
    desc: 'Six calm blues and a plum taken from my watercolor of Pigeon Polly relaxing in a bubble bath. Save it for cozy, quiet illustrations. ' + FBX,
    alt: 'Watercolor of a pigeon in a bubble bath in a blue tiled bathroom above six color swatches with names and HEX codes.',
    board: 'Aesthetic Color Palettes', ru: 'FB: палитра «Bath time blues», 6 цветов', ntype: 'Палитры', season: 'Круглый год', hol: NO },

  // 114 — 6 артов Мистера Чу
  { th: 'sage', type: 'grid', kick: 'Meet Mr. Chew', h: 'A postal snail <em>with a busy life</em>', top: 250, ih: 312,
    imgs: [['snail/2023-mr-chew-australian-postal-snail-introduction.jpg', null, 'The postal snail'], ['snail/2023-mr-chew-coffee-passion.jpg', null, 'Coffee first'], ['snail/2023-mr-chew-take-away-coffee.jpg', null, 'Coffee to go'],
      ['snail/2024-mr-chew-gardening-edition.jpg', null, 'Gardening day'], ['snail/2023-mr-chew-halloween-edition.jpg', null, 'Halloween'], ['snail/2024-mr-chew-dnd-edition.jpg', null, 'Game night']],
    title: 'Cute Snail Illustrations: Mr. Chew the Postal Snail in Watercolor and Ink',
    desc: 'Mr. Chew is a snail who delivers mail, drinks too much coffee, gardens and dresses up for Halloween. Six of his watercolor adventures in one pin. ' + FBX,
    alt: 'Six watercolor and ink illustrations of a snail character with coffee, mail, a garden, a pumpkin and a game.',
    board: 'Comic Art & Illustration', ru: 'FB: Мистер Чу — 6 артов улитки', ntype: LS, season: 'Круглый год', hol: NO },

  // 115 — цитата (слоган страницы)
  { th: 'blush', type: 'quote', kick: 'A little reminder', q: 'Paint small, joyful things.', fs: 118, who: 'Pigeon Polly', art: 'snail/2024-mr-chew-gardening-edition.jpg', at: 560, ah: 'fit',
    title: 'Paint Small, Joyful Things: Creative Motivation Quote for Artists with a Watercolor Snail',
    desc: 'A small reminder for artists who feel stuck: you do not need a masterpiece today, just one small joyful thing. Illustrated with Mr. Chew the snail gardening. ' + FBX,
    alt: 'Quote Paint small, joyful things above a watercolor of a snail watering plants.',
    board: 'Creative Motivation Quotes', ru: 'FB: цитата «Paint small, joyful things» (Мистер Чу в саду)', ntype: 'Мемы', season: 'Круглый год', hol: NO },

  // 116 — набор в коробочке (лучший пост FB)
  { th: 'clay', type: 'top', art: 's/new-6744.jpg', kick: 'What’s in my bag', h: 'My whole watercolor kit <em>fits in a tiny tin</em>',
    sub: 'A few half pans, a water brush pen and a pocket sketchbook with stickers. It goes everywhere with me.',
    title: 'Tiny Watercolor Kit in a Tin: Travel Art Supplies for Sketching on the Go',
    desc: 'My travel watercolor set: half pans in a small metal tin, a water brush and a pocket sketchbook. Small enough for a coat pocket and a bus ride. ' + FBX,
    alt: 'Photo of a small metal tin with watercolor half pans, a water brush pen and a black pocket sketchbook with stickers on a wooden table.',
    board: 'Watercolor & Art Supplies', ru: 'FB: набор акварели в коробочке от мятных конфет', ntype: LS, season: 'Круглый год', hol: NO },

  // 117 — список: что на странице
  { th: 'pine', type: 'list', art: 'bird/2022-pigeon-polly-graphic-designer.jpg', ah: 'fit', top: 290, kick: 'Pigeon Polly on Facebook', h: 'What I share <em>on my page</em>',
    items: ['The story behind each painting', 'Sketchbook pages from the bus', 'Palettes pulled from my art', 'Work in progress, mess included', 'Pigeon Polly and Mr. Chew', 'Free printables I make'],
    title: 'Follow a Watercolor Artist: Painting Stories, Sketchbook Pages and Color Palettes',
    desc: 'What you will find on my Facebook page: stories behind my watercolors, sketchbook pages, palettes from my paintings, work in progress and my characters Pigeon Polly and Mr. Chew. Come say hi.',
    alt: 'Illustration of a colorful bird with a pencil and paint palette next to a list of what the artist shares on Facebook.',
    board: 'Artist Studio & Aesthetic', ru: 'FB: список «Что я выкладываю на странице»', ntype: LS, season: 'Круглый год', hol: NO },

  // 118 — уютный Новый год (текст сверху, арт снизу на всю ширину)
  { th: 'night', type: 'top', flip: true, art: 'bird/2025-pigeon-polly-celebrates-new-year.jpg', kick: 'Cozy winter evenings', h: 'New Year <em>in pajamas</em>',
    sub: 'Snacks in bed, a laptop, a blanket and absolutely no plans. My favourite kind of holiday, painted in watercolor.',
    title: 'Cozy New Year’s Eve at Home: Watercolor Pigeon in Bed with Snacks and a Laptop',
    desc: 'Pigeon Polly celebrates New Year the cozy way: in bed, with snacks, a laptop and a blanket. A watercolor for everyone who prefers a quiet night in. ' + FBX,
    alt: 'Watercolor of a blue pigeon with a pink sleep mask in bed with a cutting board of snacks and a laptop, a calendar showing the 31st on the wall.',
    board: 'Cozy Christmas Aesthetic', ru: 'FB: уютный Новый год Полли в пижаме', ntype: LS, season: 'Зима', hol: NY },

  // 119 — процесс: полу-раскрашенный город коз (вертикальное фото на весь фон)
  { th: 'dark', type: 'bg', art: 's/new-6457.jpg', kick: 'Work in progress', h: 'Half ink, <em>half watercolor</em>',
    sub: 'Every window has a goat. I paint them one evening at a time.',
    title: 'Ink and Watercolor Work in Progress: Snowy Town Full of Goats in the Windows',
    desc: 'A big ink drawing of a snowy town, half painted with watercolor: goats in every window, on roofs and balconies. ' + FBX,
    alt: 'Photo of an ink drawing of crowded houses with goats in the windows, the top half painted in brown and orange watercolor, the bottom still black and white.',
    board: 'Sketchbook Spread Ideas', ru: 'FB: процесс — город коз наполовину в цвете', ntype: LS, season: 'Зима', hol: NO },

  // 120 — мем: романтизирую автобус
  { th: 'wine', type: 'meme', art: 'bird/2026-pigeon-polly-fancy-life.jpg', ah: 'fit', at: 330, top: 'POV: romanticizing your bus commute', fs: 80, sub: 'with a sketchbook in your bag',
    title: 'POV Artist Meme: Romanticizing Your Bus Commute (Funny Watercolor of a Pigeon on a Bus)',
    desc: 'Pigeon Polly on a crowded bus with her coffee and a Fancy Life bag, surrounded by grumpy goats. A watercolor meme about making ordinary days a little nicer. ' + FBX,
    alt: 'Watercolor of a pigeon in an orange sweater with coffee on a crowded bus with goats and a cat reading a newspaper.',
    board: 'Relatable Artist Memes', ru: 'FB: мем «Романтизирую поездку в автобусе»', ntype: 'Мемы', season: 'Круглый год', hol: NO },
];

module.exports = { TH, BOARDS, cards, LINK, START: 111 };
