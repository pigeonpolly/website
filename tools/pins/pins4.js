// Пины Pinterest по старой схеме (POV, мем, палитра, список) — №252–261: новый дизайн 2.0, логотип-значок v3, видеоуроки и paint-along.
// Картинки — у каждого пина своя (`art`). node tools/pins/pins4.js [номер…] → site/images/pins/pin-NNN.jpg и tools/pins/pins4.json.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const img = p => 'file://' + path.join(ROOT, 'site', p);
const SITE = 'https://www.pigeonpolly.com';
const UTM = '?utm_source=pinterest&utm_campaign=paintalong';
const L = p => SITE + p + UTM;
const KEY = '2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes';
const SH = f => 'file://' + path.join(__dirname, 'shots', f);
const A = { train: img(`images/bird/${KEY}.jpg`), roofs: img('images/v2/hero-winter.jpg'), desk: img('images/v2/hero-spring.jpg'), beach: img('images/v2/hero-summer.jpg'),
  pepper: img('images/v2/lesson-pepper.jpg'), szmal: img('images/v2/lesson-szmal.jpg'), cat: img('images/v2/club-cat.jpg'), home: SH('v2-home.png'), phone: SH('v2-home-m.png'),
  ink: img('images/e-books/ink-sketching.jpg'), wc: img('images/e-books/watercolor-sketches.jpg') };
const pal = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8')).find(p => p.key === KEY);

const TH = {
  cream: { bg: '#F4F0EA', ink: '#2A211C', mut: '#6C6058', acc: '#22405F', acc2: '#9E1B22', bub: '#2A211C', bubInk: '#F4F0EA' },
  blue:  { bg: '#EEF1F3', ink: '#1C2430', mut: '#5D6670', acc: '#22405F', acc2: '#9E1B22', bub: '#1C2430', bubInk: '#EEF1F3' },
  sand:  { bg: '#FBF9F5', ink: '#2A211C', mut: '#6C6058', acc: '#9E1B22', acc2: '#22405F', bub: '#2A211C', bubInk: '#FBF9F5' },
  night: { bg: '#2E2521', ink: '#ECEDEE', mut: '#A3A8AC', acc: '#93AFCC', acc2: '#E2544A', bub: '#93AFCC', bubInk: '#2E2521' },
  meme:  { bg: '#FFFFFF', ink: '#1A1A1A', mut: '#444', acc: '#22405F', acc2: '#9E1B22', bub: '#2A211C', bubInk: '#fff' },
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rich = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

const CSS = t => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:${t.bg};color:${t.ink};font-family:Karla,sans-serif;position:relative}
.pin{position:absolute;inset:0;padding:110px 70px 0;display:flex;flex-direction:column}
.kick{font:italic 400 34px Fraunces;color:${t.acc2}}
h1{font:600 92px/1.0 Fraunces;letter-spacing:-.03em;margin-top:18px}
h1.s{font-size:76px}
h1 em{font-style:italic;font-weight:400;color:${t.acc}}
.cap{font:italic 400 38px/1.3 Fraunces;color:${t.mut};margin-top:44px}
.photo{position:relative;background:#fff;padding:18px;box-shadow:0 18px 40px rgba(42,33,28,.18);margin-top:90px}
.photo img{display:block;width:100%}
.tape{position:absolute;left:38%;top:-26px;width:180px;height:52px;background:rgba(147,175,204,.7)}
.foot{position:absolute;left:70px;right:70px;bottom:62px;display:flex;align-items:center;gap:22px}
.av{width:150px;height:150px;border-radius:50%;background:#F4F0FA;box-shadow:0 8px 24px rgba(42,33,28,.18);display:grid;place-items:center;flex:none}
.av{background:none;box-shadow:none;width:170px;height:170px}.av img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 6px 14px rgba(42,33,28,.22))}
.av.sm{width:86px;height:86px}.av.sm{width:120px;height:120px}.av.sm img{width:100%;height:100%}
.bub{background:${t.bub};color:${t.bubInk};font:700 29px Karla;padding:16px 26px;border-radius:12px;position:relative}
.bub:before{content:'';position:absolute;left:-14px;top:50%;margin-top:-12px;border:12px solid transparent;border-right-color:${t.bub};border-left:0}
.site{margin-left:auto;text-align:right;font:700 31px Karla}
.site small{display:block;font:500 25px Karla;color:${t.mut}}
.num{position:absolute;right:20px;bottom:12px;font:700 22px Karla;color:${t.mut};opacity:.45}
/* мем */
.meme .pin{padding:60px 0 0}
.mt{font:700 66px/1.18 Karla;padding:0 60px;letter-spacing:-.01em}
.mi{position:relative;margin-top:34px;height:1040px;overflow:hidden}
.mi img{width:100%;height:100%;object-fit:cover;display:block}
.sub{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);background:rgba(20,16,30,.82);color:#fff;font:700 40px/1.25 Karla;text-align:center;padding:14px 34px;border-radius:12px;max-width:84%}
.sub em{font-style:normal;color:#93AFCC}
/* палитра */
.ptop{position:absolute;left:0;right:0;top:0;height:640px}
.ptop img{width:100%;height:100%;object-fit:cover;display:block}
.ptop:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(46,37,33,0) 45%,${t.bg})}
.pl{position:absolute;left:70px;right:70px;top:600px}
.ptag{font:700 26px Karla;letter-spacing:.24em;color:${t.acc}}
.pl h1{font-size:80px;margin-top:10px}
.sw{display:grid;grid-template-columns:repeat(3,1fr);gap:26px 22px;margin-top:44px}
.sw .c div{height:118px;border-radius:12px}
.sw b{display:block;font:700 28px Karla;margin-top:12px}.sw span{display:block;font:500 22px Karla;color:${t.mut};letter-spacing:.06em;margin-top:4px}
/* список */
.art{border-radius:20px;overflow:hidden;box-shadow:0 14px 34px rgba(31,42,74,.18);margin-top:40px}
.art img{display:block;width:100%;height:100%;object-fit:cover}
.tag{align-self:flex-start;background:${t.ink};color:${t.bg};font:700 21px Karla;letter-spacing:.2em;text-transform:uppercase;padding:11px 20px;border-radius:40px}
.list{margin-top:34px}
.li{display:flex;gap:20px;align-items:baseline;padding:15px 0;border-bottom:2px dashed rgba(108,96,88,.3);font:500 31px/1.25 Karla}
.li .n{font:italic 400 34px Fraunces;color:${t.acc2};min-width:50px}
.li small{display:block;font:400 24px/1.3 Karla;color:${t.mut};margin-top:3px}
.two{display:grid;grid-template-columns:1fr 1fr;column-gap:40px}
.two .li{font-size:27px}
`;

const AV = SH('logo-badge.png');
const foot = (o, t) => o.bubble
  ? `<div class="foot"><div class="av"><img src="${AV}"></div><div class="bub">${esc(o.bubble)}</div><div class="site">pigeonpolly.com${o.small ? `<small>${esc(o.small)}</small>` : ''}</div></div>`
  : `<div class="foot"><div class="av sm"><img src="${AV}"></div><div class="site" style="font-weight:500;color:${t.mut}">${o.small ? `<i style="font:italic 400 30px Fraunces">${esc(o.small)}</i>&nbsp;&nbsp;&nbsp;` : ''}<b style="color:${t.ink}">pigeonpolly.com</b></div></div>`;

const T = {
  // POV: заголовок, фото с лентой, подпись курсивом, птичка с репликой
  pov: o => `<div class="kick">${esc(o.kick)}</div><h1 class="${o.h || ''}">${rich(o.title)}</h1>
    <div class="photo" style="transform:rotate(${o.rot || -2}deg)"><div class="tape"></div><img src="${o.art}" style="${o.imgCss || ''}"></div>
    <p class="cap">${esc(o.cap)}</p>`,
  // мем: белый верх, арт, субтитр
  meme: o => `<div class="mt">${o.top.map(esc).join('<br>')}</div><div class="mi"><img src="${o.art}" style="object-position:${o.pos || 'center'};transform:scale(${o.zoom || 1});transform-origin:${o.pos || 'center'}"><div class="sub">${rich(o.sub)}</div></div>`,
  // палитра
  pal: o => `<div class="ptop"><img src="${o.art}" style="object-position:${o.pos || '50% 50%'}"></div><div class="pl"><div class="ptag">COLOR PALETTE</div><h1>${esc(pal.title.en)}</h1>
    <div class="sw">${pal.colors.map(c => `<div class="c"><div style="background:${c.hex}"></div><b>${esc(c.en)}</b><span>${c.hex}</span></div>`).join('')}</div></div>`,
  // список под картинкой
  list: o => `${o.tagText ? `<div class="tag">${esc(o.tagText)}</div>` : `<div class="kick">${esc(o.kick)}</div>`}<h1 class="${o.h || 's'}">${rich(o.title)}</h1>
    <div class="art" style="height:${o.artH || 380}px"><img src="${o.art}" style="object-position:${o.pos || 'center'}"></div>
    <div class="list${o.two ? ' two' : ''}">${o.items.map((s, i) => { const [a, b] = [].concat(s); return `<div class="li"><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}</span></div>`; }).join('')}</div>`,
};

const LEARN = L('/learn/'), HOME = L('/');
const PINS = [
  { n: 252, type: 'Основной', theme: 'cream', tpl: 'pov', when: ['Круглый год'], art: A.home, rot: -1.5, imgCss: 'height:560px;object-fit:cover;object-position:50% 0',
    kick: 'New season, new look', title: 'Polly’s studio got *a makeover*',
    cap: 'Free lessons, paint-alongs and books, all in one cozy place.', bubble: 'hi! let’s paint something small ✿',
    link: HOME, pt: 'Pigeon Polly Art Lab Got a Makeover — Free Watercolor Lessons & Paint-Alongs',
    desc: 'My little art corner has a new look: free watercolor and ink video lessons you can watch right on the site, paint-alongs, step-by-step books and a secret Lab with birds and games. Paint small, joyful things with me.',
    alt: 'Screenshot of the Pigeon Polly Art Lab homepage with the headline “Paint small, joyful things” above a watercolor of a pigeon drinking tea on a train.',
    topics: 'Watercolor for beginners, Art lessons online, Cozy art, Urban sketching, Watercolor tutorial' },

  { n: 253, type: 'Полезный', theme: 'blue', tpl: 'list', when: ['Круглый год'], art: A.pepper, artH: 390, tagText: 'Paint along · free', title: 'Watercolor lessons *you can watch right here*', h: 's',
    items: [['Pepper sketch', 'watercolor & ink, step by step'], ['Sketching on location: a café', 'urban sketching'], ['Watercolor review', 'VIP, free with Google sign-in'], ['No sign-up for free lessons', 'just press play'], ['Grab a brush and paint along']],
    small: 'free video lessons',
    link: LEARN, pt: 'Free Watercolor Video Lessons to Paint Along With — No Sign-Up',
    desc: 'Free watercolor and ink video lessons you can watch right on my site: a pepper sketch, sketching on location in a café and more. No sign-up for the free ones; sign in with Google for free and VIP lessons open too. Grab a brush and paint along.',
    alt: 'A list of free watercolor video lessons under a lesson cover showing a sketchbook with a red pepper painted in watercolor and the words “pepper sketching”.',
    topics: 'Watercolor tutorial, Free art lessons, Paint along, Watercolor for beginners, Ink and watercolor' },

  { n: 254, type: 'Мем', theme: 'meme', tpl: 'meme', when: ['Круглый год'], art: A.desk, top: ['Me: “just one tutorial”', 'Two hours later:'], pos: '50% 60%',
    sub: '“the whole desk is *paint*”',
    link: LEARN, pt: 'Me: I’ll Just Watch the Tutorial. Two Hours Later — Watercolor Artist Meme',
    desc: 'You open a watercolor tutorial “just to watch” and two hours later the whole desk is paint, the tea is cold and you are very happy. Free paint-along lessons on my site.',
    alt: 'A messy art desk from above: open watercolor palettes, brushes, a jungle painting in progress and a laptop showing a color chart.',
    topics: 'Artist memes, Watercolor memes, Art humor, Art desk, Relatable memes' },

  { n: 255, type: 'Мем', theme: 'meme', tpl: 'meme', when: ['Круглый год'], art: A.szmal, top: ['Me: I have enough paint', 'Also me, looking at these:'], pos: '30% 0%', zoom: 1.25,
    sub: '“I need *all* of them”',
    link: LEARN, pt: 'Me: I Have Enough Paint. Also Me — Funny Watercolor Swatches Meme',
    desc: 'Every watercolor artist knows this feeling: you have enough paint, until you see one more beautiful swatch chart. I review a watercolor set in one of my video lessons, free with sign-in on my site.',
    alt: 'A grid of bright watercolor swatches in orange, red, green, blue, yellow and grey.',
    topics: 'Watercolor memes, Art supplies, Artist humor, Watercolor swatches, Funny memes' },

  { n: 256, type: 'Мем', theme: 'meme', tpl: 'meme', when: ['Круглый год'], art: A.pepper, top: ['The tutorial: “now just add', 'a few small details”'], pos: '62% 50%', zoom: 1.7,
    sub: 'Me: *three hours later*',
    link: LEARN, pt: 'The Tutorial: “Now Just Add a Few Details” — Watercolor Artist Meme',
    desc: '“Now just add a few small details,” says the tutorial, and three hours later you are still painting tiny leaves. Paint the pepper sketch along with me in a free video lesson on my site.',
    alt: 'Close-up of a watercolor red pepper with green leaves on a purple background in a sketchbook.',
    topics: 'Art memes, Watercolor humor, Artist life, Painting tutorial, Relatable memes' },

  { n: 257, type: 'Палитра', theme: 'night', tpl: 'pal', when: ['Осень', 'Ноябрь'], art: A.train, pos: '50% 40%',
    link: SITE + '/palettes/' + UTM + '#' + KEY, pt: 'Night Train in October Color Palette with HEX Codes | Pigeon Polly',
    desc: `A cozy autumn color palette from my watercolor of Polly the pigeon drinking tea on a night train: ${pal.colors.map(c => `${c.en} ${c.hex}`).join(', ')}. Warm cocoa browns and pumpkin orange for your autumn sketchbook.`,
    alt: `A color palette of six swatches (${pal.colors.map(c => c.en).join(', ')}) under a watercolor of a pigeon in an orange puffer jacket drinking tea in a train compartment.`,
    topics: 'Color palette, Autumn color palette, Cozy colors, HEX codes, Watercolor palette' },

  { n: 258, type: 'Полезный', theme: 'sand', tpl: 'list', when: ['Зима'], art: A.roofs, artH: 510, pos: '50% 55%', tagText: 'Winter sketchbook', title: '10 small things to paint *this winter*', two: 1,
    items: ['a mug of cocoa', 'a red mitten', 'a tangerine', 'a snowy rooftop', 'a candle', 'a pinecone', 'a teapot', 'a knitted hat', 'a train ticket', 'a gingerbread cookie'],
    small: 'a new theme every day',
    link: L('/challenge/'), pt: '10 Small Things to Paint This Winter — Cozy Watercolor Drawing Ideas',
    desc: 'Cozy winter drawing ideas for your sketchbook: a mug of cocoa, a red mitten, a tangerine, a snowy rooftop, a candle, a pinecone and four more small things. Paint small, joyful things. My daily drawing challenge gives you a new theme every day.',
    alt: 'A list of 10 winter drawing ideas under a watercolor and ink painting of old city rooftops and towers under a blue sky.',
    topics: 'Winter drawing ideas, Drawing prompts, Sketchbook ideas, Watercolor ideas, Cozy art' },

  { n: 259, type: 'Основной', theme: 'blue', tpl: 'pov', when: ['Круглый год'], art: A.phone, h: 's', rot: 2, imgCss: 'height:560px;object-fit:cover;object-position:50% 0',
    kick: 'Small habit, big joy', title: 'POV: you *paint along* instead of scrolling',
    cap: 'Free video lessons, no sign-up. Just press play.', bubble: 'Press play ✿',
    link: LEARN, pt: 'POV: You Paint Along Instead of Scrolling — Free Watercolor Lessons',
    desc: 'Swap ten minutes of scrolling for ten minutes of painting. Free watercolor and ink video lessons play right on my site, no sign-up needed. Paint small, joyful things with me.',
    alt: 'A phone screenshot of the Pigeon Polly Art Lab site with the headline “Paint small, joyful things” and a button “Watch a free lesson”.',
    topics: 'Art habit, Watercolor for beginners, Free art lessons, Self care ideas, Paint along' },

  { n: 260, type: 'Полезный', theme: 'cream', tpl: 'list', when: ['Круглый год'], art: A.desk, artH: 320, pos: '50% 55%', kick: 'Beginner watercolor tips', title: 'How to *paint along* with a video lesson',
    items: [['Set up before you press play', 'water, paper, three or four colors'], ['Pause as often as you like'], ['Paint small', 'a sketchbook page is enough'], ['Copy first, change later'], ['Don’t fix wet paint', 'let it dry, then go on'], ['Sign and date it', 'you’ll love seeing your progress']],
    small: 'free paint-alongs',
    link: LEARN, pt: 'How to Paint Along with a Watercolor Video Lesson — 6 Beginner Tips',
    desc: 'Six simple tips for painting along with a video lesson: set up before you press play, pause as often as you like, paint small, copy first and change later, let wet paint dry, and sign and date your page. Try them with my free watercolor lessons.',
    alt: 'Six tips for painting along with a video lesson under a photo of an art desk with watercolor palettes, brushes and a laptop.',
    topics: 'Watercolor tips, Watercolor for beginners, Painting tips, Art lessons, Sketchbook habit' },

  { n: 261, type: 'Основной', theme: 'sand', tpl: 'pov', when: ['Круглый год'], art: A.ink, rot: -2, imgCss: 'height:560px;object-fit:cover;object-position:50% 0',
    kick: 'For “I can’t even draw a line” people', title: '*No talent* required',
    cap: 'Just the wish to draw. Clear steps and real sketchbook pages.', bubble: 'Start with one line.',
    link: L('/guides/'), pt: 'No Talent Required: Step-by-Step Ink Sketching Book for Beginners',
    desc: 'You don’t need talent, just the wish to draw. My step-by-step books have clear steps and real sketchbook pages, from the first line to a finished little painting. Ink sketching and watercolor guides on my site.',
    alt: 'The ink and watercolor cover art of the book “Ink Sketching: Creative Guide”, taped like a photo.',
    topics: 'Drawing for beginners, Ink sketching, Art books, Learn to draw, Sketchbook ideas' },
];

(async () => {
  const want = process.argv.slice(2).map(Number);
  const list = want.length ? PINS.filter(p => want.includes(p.n)) : PINS;
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  for (const p of list) {
    const t = TH[p.theme];
    const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&display=swap"><style>${CSS(t)}</style></head><body class="${p.tpl === 'meme' ? 'meme' : ''}"><div class="pin">${T[p.tpl](p)}</div>${foot(p, t)}<div class="num">${p.n}</div></body></html>`;
    const f = path.join(__dirname, 'out.html'); fs.writeFileSync(f, html);
    await page.goto('file://' + f, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const over = await page.evaluate(() => { let m = 0; document.querySelectorAll('.pin *').forEach(e => { m = Math.max(m, e.getBoundingClientRect().bottom); }); return m; });
    if (over > 1300) console.log('⚠ pin', p.n, 'content bottom', Math.round(over));
    await page.screenshot({ path: path.join(ROOT, 'site/images/pins', `pin-${p.n}.jpg`), type: 'jpeg', quality: 88 });
    console.log('pin', p.n);
  }
  fs.unlinkSync(path.join(__dirname, 'out.html'));
  await b.close();
  const meta = PINS.map(p => ({ n: p.n, type: p.type, when: p.when, title: p.pt, desc: p.desc, alt: p.alt, link: p.link, topics: p.topics, media: `${SITE}/images/pins/pin-${p.n}.jpg` }));
  fs.writeFileSync(path.join(__dirname, 'pins4.json'), JSON.stringify(meta, null, 1));
})();
