// Пины №476–487 «Книги»: две книги Алины на Amazon — «Ink Sketching: Creative Guide» и «Watercolor Sketches: Creative Guide».
// Стиль pins10 (коричневый фон, голубой Caveat). Картинки: страницы книги туши (site/images/ink/), обложки (e-books/),
// схемы уроков по акварельной книге (school/), акварельные скетчи Алины (photos2/).
// node tools/pins/pins11.js [номер…] → site/images/pins/pin-NNN.jpg + tools/pins/pins11.json (тексты для Notion).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const INK = 'https://a.co/d/0cJY0kk5', WC = 'https://a.co/d/009gymDC';  // как в content/ebooks.json
const U = k => 'file://' + path.join(ROOT, 'site/images', k);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const C = { bg: '#2E2521', blue: '#93AFCC', cream: '#F1ECE4', tan: '#C9A27A', mut: '#B9AEA4' };
const cov = (k, W, H, pos = '50% 50%', fit = 'cover', bg = '') => `<img src="${U(k)}" style="width:${W}px;height:${H}px;object-fit:${fit};object-position:${pos};display:block;${bg ? 'background:' + bg : ''}">`;
const url = extra => `<div class="url">${extra ? esc(extra) + ' · ' : ''}pigeonpolly.com</div>`;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${C.bg};color:${C.cream};font-family:Karla,sans-serif;position:relative}
.url{position:absolute;left:0;right:0;bottom:40px;text-align:center;font:700 36px Caveat;color:${C.mut}}
.kick{position:absolute;left:64px;font:700 46px Caveat;color:${C.blue};transform:rotate(-2deg)}
h1{font:600 84px/1 Fraunces;letter-spacing:-.02em;color:${C.cream}}
h1 em{font-style:italic;font-weight:400;color:${C.blue}}
.fr{border-radius:8px;overflow:hidden;box-shadow:0 26px 50px rgba(0,0,0,.45);background:#fff}
.hand{font:700 50px/1.1 Caveat;color:${C.blue}}
.tag{display:inline-block;background:${C.blue};color:${C.bg};font:700 24px Karla;letter-spacing:.2em;text-transform:uppercase;padding:10px 20px;border-radius:40px}
.lbl{position:absolute;background:${C.cream};color:${C.bg};font:700 34px Caveat;padding:2px 14px}
.li{font:700 46px/1.05 Caveat;color:${C.blue};padding-left:40px;position:relative;margin-bottom:16px}
.li:before{content:'';position:absolute;left:4px;top:18px;width:16px;height:16px;border-radius:50%;background:${C.tan}}
.li small{display:block;font:400 26px/1.25 Karla;color:${C.mut};margin-top:4px}
`;

const T = {
  // книга: обложка крупно, две страницы/скетча веером, подпись
  book: p => `<div style="position:absolute;left:62px;top:66px"><span class="tag">${esc(p.tag || 'my book')}</span></div>
    <h1 style="position:absolute;left:62px;right:56px;top:140px;font-size:${p.fs || 80}px">${p.t}</h1>
    ${p.pages.map((k, i) => `<div class="fr" style="position:absolute;left:${i ? 520 : 70}px;top:${i ? 520 : 470}px;transform:rotate(${i ? 5 : -6}deg)">${cov(k, 400, 470)}</div>`).join('')}
    <div class="fr" style="position:absolute;left:270px;top:${p.top || 450}px;transform:rotate(-1deg)">${cov(p.cover, 460, 641)}</div>
    <div class="hand" style="position:absolute;left:66px;right:60px;top:1150px;text-align:center">${esc(p.hand)}</div>
    ${url(p.foot || 'on Amazon')}`,
  // советы: картинка + список с пояснениями
  tips: p => `<div class="kick" style="top:58px">${esc(p.kick)}</div>
    <h1 style="position:absolute;left:62px;right:56px;top:122px;font-size:${p.fs || 76}px">${p.t}</h1>
    <div class="fr" style="position:absolute;left:62px;top:${p.top || 330}px;transform:rotate(-1deg)">${cov(p.art, 876, p.h || 400, p.pos, p.fit || 'cover', '#fff')}</div>
    <div style="position:absolute;left:62px;right:56px;top:${(p.top || 330) + (p.h || 400) + 56}px">${p.items.map(([a, b]) => `<div class="li">${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}</div>`).join('')}</div>
    ${url(p.foot || 'from my book')}`,
  // сетка 2×2 с подписями
  grid: p => `<div class="kick" style="top:58px">${esc(p.kick)}</div>
    <h1 style="position:absolute;left:62px;right:56px;top:122px;font-size:${p.fs || 76}px">${p.t}</h1>
    <div style="position:absolute;left:50px;right:50px;top:${p.top || 340}px;display:grid;grid-template-columns:1fr 1fr;gap:22px">
    ${p.items.map(q => `<div style="position:relative;border-radius:8px;overflow:hidden;background:#fff">${cov(q.art, 439, p.ch || 420, q.pos, q.fit || 'cover', '#fff')}<span class="lbl" style="left:10px;bottom:10px">${esc(q.say)}</span></div>`).join('')}</div>
    <div class="hand" style="position:absolute;left:66px;right:60px;top:${(p.top || 340) + 2 * (p.ch || 420) + 70}px;text-align:center">${esc(p.hand)}</div>
    ${url(p.foot || 'from my book')}`,
  // темы для рисования: две картинки + список в 2 колонки
  prompts: p => `<div class="kick" style="top:60px">${esc(p.kick)}</div>
    <h1 style="position:absolute;left:62px;right:50px;top:122px;font-size:80px;line-height:.98">${p.t}</h1>
    ${p.arts.map((k, i) => `<div class="fr" style="position:absolute;left:${62 + i * 440}px;top:${350 + i * 20}px;transform:rotate(${i ? 2 : -2}deg)">${cov(k, 416, 450)}</div>`).join('')}
    <div style="position:absolute;left:62px;right:50px;top:880px;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:84px;column-gap:30px">${p.items.map(q => `<div style="font:700 44px/1 Caveat;color:${C.blue};padding-left:40px;position:relative;white-space:nowrap;display:flex;align-items:center"><span style="position:absolute;left:4px;top:50%;margin-top:-8px;width:16px;height:16px;border-radius:50%;background:${C.tan}"></span>${esc(q)}</div>`).join('')}</div>
    ${url(p.foot || 'from my book')}`,
  // две книги рядом
  two: p => `<div class="kick" style="top:60px">${esc(p.kick)}</div>
    <h1 style="position:absolute;left:62px;right:56px;top:122px;font-size:78px">${p.t}</h1>
    <div class="fr" style="position:absolute;left:70px;top:430px;transform:rotate(-4deg)">${cov('e-books/ink-sketching.jpg', 410, 571)}</div>
    <div class="fr" style="position:absolute;left:520px;top:470px;transform:rotate(3deg)">${cov('e-books/watercolor-sketches.jpg', 410, 571)}</div>
    <div class="hand" style="position:absolute;left:66px;right:60px;top:1140px;text-align:center">${esc(p.hand)}</div>
    ${url()}`,
};

const BOOK = 'Topics: Ink drawing, Urban sketching, Sketchbook ideas, Art books, Drawing tutorial';
const PINS = [
  { n: 476, type: 'Курс', tpl: 'book', t: 'Ink sketching, <em>without the fear</em>', cover: 'e-books/ink-sketching.jpg', pages: ['ink/p79-142.jpg', 'ink/p77-137.jpg'], hand: 'lines, shadows, textures & happy ink blots',
    link: INK, title: 'Ink Sketching: Creative Guide — a Book for Fearless Sketchbook Pages',
    desc: 'My book about ink sketching: lines with character, hatching, light and shadow, textures, cups and chairs, plants, food, city streets and quick sketches of people and birds. Exercises on every page, and permission to make mistakes. Ink Sketching: Creative Guide, available on Amazon.',
    alt: 'The cover of the book Ink Sketching: Creative Guide between two ink drawings: a dancing skeleton and quick sketches of people on the street.',
    topics: BOOK },
  { n: 477, type: 'Курс', tpl: 'tips', kick: 'ink tips', t: '4 hatching secrets <em>nobody told me</em>', art: 'ink/p37-61.jpg', fit: 'contain', h: 540,
    items: [['Gaps = light', 'the space between strokes decides how bright it is'], ['Follow the form', 'curved strokes turn a flat circle into a ball'], ['Turn by 15–30°, not 90°', 'cross-hatching gets soft and velvety'], ['Scribbles, dots, dashes', 'leaves, fog and fur each have their own stroke']],
    link: INK, title: '4 Ink Hatching Secrets for Beginners (Pen and Ink Tips)',
    desc: 'Pen and ink hatching tips from my book: the gaps between strokes decide how bright an area is, strokes that follow the form make it round, cross-hatching works best when you turn by 15–30 degrees instead of 90, and every texture has its own stroke. More in Ink Sketching: Creative Guide.',
    alt: 'Ink drawings of striped and shaded balls from a sketching book and a list of four hatching tips.',
    topics: 'Topics: Pen and ink, Hatching techniques, Drawing tips, Ink drawing for beginners, Sketching tutorial' },
  { n: 478, type: 'Курс', tpl: 'tips', kick: 'for perfectionists', t: 'Made a mistake in ink? <em>Keep it.</em>', art: 'ink/p48-85.jpg', h: 560, pos: '50% 50%',
    items: [['Draw the right line next to it', 'two lines = a “searching” line, livelier than a perfect one'], ['A crooked jar has a story', 'imperfection is character'], ['Turn a blot into a shadow', 'or a stone, or just label it “blot” with an arrow'], ['A sketch is an impression', 'not a photo']],
    link: INK, title: 'Made a Mistake in Ink? Keep It — Sketching Advice for Perfectionists',
    desc: 'Ink can’t be erased, and that’s the best thing about it. Draw the right line next to the wrong one, let a crooked jar tell its story, turn a blot into a shadow. A sketch is an impression, not a photo. From my book Ink Sketching: Creative Guide.',
    alt: 'Ink and wash sketches of cups and pens in a sketchbook with tips about mistakes in ink drawing.',
    topics: 'Topics: Sketchbook tips, Ink drawing, Art mindset, Perfectionism, Drawing for beginners' },
  { n: 479, type: 'Курс', tpl: 'grid', kick: 'what’s in my ink kit', t: 'Ink tools <em>for sketching</em>', ch: 380, fs: 80,
    items: [{ art: 'ink/p24-19.jpg', say: 'black ink', fit: 'contain' }, { art: 'ink/p27-29.jpg', say: 'fountain pen', fit: 'contain' }, { art: 'ink/p28-31.jpg', say: 'brush pens', fit: 'contain' }, { art: 'ink/p32-47.jpg', say: 'glass dip pens', fit: 'contain' }],
    hand: 'what each one is good for — in my book',
    link: INK, title: 'Ink Sketching Supplies: Ink, Fountain Pen, Brush Pens, Glass Dip Pens',
    desc: 'The ink tools I sketch with: black drawing ink, a fountain pen, brush pens and glass dip pens. What each one is good for, which paper to choose and how to start is in my book Ink Sketching: Creative Guide.',
    alt: 'Four photos of ink sketching supplies: a bottle of black ink, a yellow fountain pen, brush pens and colorful glass dip pens.',
    topics: 'Topics: Art supplies, Ink pens, Fountain pen, Sketching tools, Pen and ink' },
  { n: 480, type: 'Курс', tpl: 'grid', kick: 'light & shadow', t: 'Soft light vs <em>hard light</em>', ch: 400,
    items: [{ art: 'ink/p42-69.jpg', say: 'soft', fit: 'contain' }, { art: 'ink/p42-71.jpg', say: 'hard', fit: 'contain' }, { art: 'ink/p44-77.jpg', say: 'some light', fit: 'contain' }, { art: 'ink/p46-81.jpg', say: 'shadow', fit: 'contain' }],
    hand: 'hard light: bold black & white. soft light: gentle dots',
    link: INK, title: 'Soft Light vs Hard Light — How to Draw Shadows in Ink',
    desc: 'Hard light (sun, spotlight) gives a sharp edge and bold black and white. Soft light (clouds) gives smooth halftones, gentle dots and shadows that never reach full black. Shadows are darkest where an object touches the table. More in my book Ink Sketching: Creative Guide.',
    alt: 'Ink drawings of spheres and cubes with soft and hard shadows, from an ink sketching book.',
    topics: 'Topics: Light and shadow, Shading techniques, Ink drawing, Drawing basics, Art tutorial' },
  { n: 481, type: 'Темы', tpl: 'prompts', kick: 'ink sketch ideas', t: '10 things to sketch <em>in ink</em>', arts: ['ink/p77-133.jpg', 'ink/p66-124.jpg'],
    items: ['forgotten shoes', 'people in line', 'kitchen table chaos', 'hands holding a thing', 'birds & street food', 'a transport window', 'what’s in your bag', 'a sleeping pet', 'light in a hallway', 'your breakfast'],
    link: INK, title: '10 Ink Sketch Ideas from Everyday Life (Sketchbook Prompts)',
    desc: 'Ten everyday things to sketch in ink: forgotten shoes, people in line, kitchen table chaos, hands holding an object, city birds and street food, the view from a bus window, what’s in your bag, a sleeping pet, light in a hallway and your breakfast. From the last chapter of my book Ink Sketching: Creative Guide.',
    alt: 'Two ink sketchbook pages with quick sketches of a park and of people, above a list of 10 ink sketch ideas.',
    topics: 'Topics: Sketchbook prompts, Drawing ideas, Ink sketching, Urban sketching, Daily drawing' },
  { n: 482, type: 'Курс', tpl: 'grid', kick: 'ink textures', t: 'How to draw <em>textures</em> in ink', ch: 400,
    items: [{ art: 'ink/p50-86.jpg', say: 'metal', fit: 'contain' }, { art: 'ink/p51-90.jpg', say: 'wood', fit: 'contain' }, { art: 'ink/p51-92.jpg', say: 'stone', fit: 'contain' }, { art: 'ink/p51-94.jpg', say: 'brick', fit: 'contain' }],
    hand: 'brick? just 2–3 bricks, never all of them',
    link: INK, title: 'How to Draw Textures in Ink: Metal, Wood, Stone, Brick',
    desc: 'Ink texture cheat sheet: metal is a mirror (black right next to white), wood grain flows around knots like water around a stone, stone gets dark cracks and light islands, and for a brick wall draw only 2–3 bricks near corners and shadows. From my book Ink Sketching: Creative Guide.',
    alt: 'Four ink drawings of textures: a riveted metal plate, wood grain, a stone wall and bricks.',
    topics: 'Topics: Drawing textures, Pen and ink, Ink drawing tutorial, Sketching tips, Art techniques' },
  { n: 483, type: 'Курс', tpl: 'book', t: 'Watercolor sketches <em>for slow evenings</em>', cover: 'e-books/watercolor-sketches.jpg', pages: ['photos2/espresso_palette.jpg', 'photos2/olives.jpg'], hand: 'small, joyful things, one page at a time',
    link: WC, title: 'Watercolor Sketches: Creative Guide — a Cozy Book for Beginners',
    desc: 'My little guide to watercolor sketching: shapes, lines, texture, volume, shadows, cylinders and ellipses, composition and collage. Sketch your cup, your breakfast, your kitchen. Watercolor Sketches: Creative Guide, available on Amazon.',
    alt: 'The cover of the book Watercolor Sketches: Creative Guide between two watercolor sketches: an espresso maker with a paint palette and green olives.',
    topics: 'Topics: Watercolor for beginners, Watercolor sketching, Sketchbook ideas, Art books, Cozy hobbies' },
  { n: 484, type: 'Курс', tpl: 'tips', kick: 'a watercolor secret', t: 'Every cup is <em>a cylinder</em>', art: 'school/l8-a.png', fit: 'contain', h: 540,
    items: [['Start with a box or a tube', 'what simple shape does it fit into?'], ['Ellipses have no corners', 'the top and the bottom are circles in perspective'], ['Add shadow, then details', 'handle, label, steam'], ['Then the color', 'light first, dark later']],
    link: WC, title: 'Every Cup Is a Cylinder — Easy Way to Sketch Cups and Mugs',
    desc: 'The easiest way to sketch a cup or a jar: start from a cylinder, draw round ellipses with no corners, add the shadow, then the details and color. One of the 12 lessons from my book Watercolor Sketches: Creative Guide.',
    alt: 'Step by step pencil sketches turning rectangles into cylinders and cups, with a list of tips for drawing cups.',
    topics: 'Topics: How to draw, Drawing cups, Watercolor for beginners, Sketching basics, Drawing tutorial' },
  { n: 485, type: 'Курс', tpl: 'tips', kick: '12 tiny lessons', t: 'Learn to sketch, <em>step by step</em>', art: 'photos2/tools_spread.jpg', h: 620, pos: '50% 50%',
    items: [['Shapes · Lines · Texture', ''], ['Combinations · Volume · Shadows', ''], ['Details · Cylinders · Ellipses', ''], ['Pro secrets · Composition · Collage', '12 lessons, one small habit']],
    link: WC, title: '12 Steps to Learn Watercolor Sketching (Beginner Plan)',
    desc: 'A gentle plan for learning to sketch: shapes, lines, texture, combinations, volume, shadows, details, cylinders, ellipses, pro secrets, composition and collage. Twelve small lessons from my book Watercolor Sketches: Creative Guide.',
    alt: 'A sketchbook with a watercolor of a green figurine next to a watercolor palette and brushes, above a list of 12 lessons.',
    topics: 'Topics: Learn to draw, Watercolor for beginners, Sketching plan, Art lessons, Drawing practice' },
  { n: 486, type: 'Курс', tpl: 'grid', kick: 'sketch your kitchen', t: 'Cozy things to paint <em>in watercolor</em>', ch: 420, fs: 72,
    items: [{ art: 'photos2/moka_rust.jpg', say: 'moka pot' }, { art: 'photos2/sardines.jpg', say: 'a tin of sardines' }, { art: 'photos2/olives.jpg', say: 'olives' }, { art: 'photos2/caffeine_cup.jpg', say: 'your coffee' }],
    hand: 'no still life needed — just open the fridge',
    link: WC, title: 'Cozy Watercolor Sketch Ideas: Paint Your Kitchen',
    desc: 'You don’t need a fancy still life: paint your moka pot, a tin of sardines, a bowl of olives, your morning coffee. Small kitchen things are the best watercolor practice. How to start is in my book Watercolor Sketches: Creative Guide.',
    alt: 'Four watercolor sketches of kitchen things: a moka pot, a tin of sardines, green olives and a coffee cup.',
    topics: 'Topics: Watercolor ideas, Food illustration, Sketchbook inspiration, Kitchen art, Watercolor painting' },
  { n: 487, type: 'Курс', tpl: 'two', kick: 'two little books', t: 'Ink or watercolor? <em>Why not both</em>', hand: 'for evenings with a sketchbook and a cup of tea',
    link: SITE + '/books/?utm_source=pinterest&utm_campaign=books', title: 'Two Cozy Sketching Books: Ink Sketching and Watercolor Sketches',
    desc: 'Two little creative guides by Pigeon Polly Art Lab: Ink Sketching, for lines, shadows and textures, and Watercolor Sketches, for shapes, color and cozy everyday things. Both on Amazon; the bookshelf with free coloring pages is on my site.',
    alt: 'Covers of two books side by side: Ink Sketching: Creative Guide and Watercolor Sketches: Creative Guide.',
    topics: 'Topics: Art books, Sketching books, Watercolor, Ink drawing, Gift for artists' },
];

(async () => {
  const only = process.argv.slice(2).map(Number);
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  const tmp = path.join(__dirname, 'shots', '_pin11.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true }); const out = [];
  for (const p of PINS) {
    out.push({ n: p.n, type: p.type, title: p.title, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics });
    if (only.length && !only.includes(p.n)) continue;
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap"><style>${CSS}</style></head><body>${T[p.tpl](p)}</body></html>`);
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => Math.max(...[...document.querySelectorAll('body *:not(.url)')].map(e => e.getBoundingClientRect().bottom)));
    if (over > 1420) console.log('⚠ pin', p.n, 'bottom', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, `site/images/pins/pin-${p.n}.jpg`), type: 'jpeg', quality: 88 });
  }
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp); fs.writeFileSync(path.join(__dirname, 'pins11.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
