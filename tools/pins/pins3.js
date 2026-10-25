// Пины Pinterest по старой схеме (как 001–189: POV-карточка, мем, палитра, список) с одним артом.
// №242–251 — «(2026) Pigeon Polly is hiding something» (Полли-вампир: в зеркале нет отражения).
// node tools/pins/pins3.js [номер…] → site/images/pins/pin-NNN.jpg (1000×1500) и tools/pins/pins3.json (тексты для Notion).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const img = p => 'file://' + path.join(ROOT, 'site', p);
const SITE = 'https://www.pigeonpolly.com';
const UTM = '?utm_source=pinterest&utm_campaign=hiding';
const L = p => SITE + p + UTM;
const KEY = '2026-pigeon-polly-is-hiding-something';
const ART = img(`images/bird/${KEY}.jpg`);
const pal = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8')).find(p => p.key === KEY);

const TH = {
  cream: { bg: '#FBF3E4', ink: '#2B1A51', mut: '#5A4A7A', acc: '#534AB7', acc2: '#D85A30', bub: '#2B1A51', bubInk: '#FBF3E4' },
  blue:  { bg: '#E6EEF8', ink: '#1F2A4A', mut: '#5A6788', acc: '#534AB7', acc2: '#D85A30', bub: '#1F2A4A', bubInk: '#E6EEF8' },
  lilac: { bg: '#EEE8FA', ink: '#2B1A51', mut: '#5A4A7A', acc: '#534AB7', acc2: '#D85A30', bub: '#2B1A51', bubInk: '#EEE8FA' },
  night: { bg: '#1E1730', ink: '#F3EFFA', mut: '#C9C1E6', acc: '#EDAE3F', acc2: '#DB7A6C', bub: '#EDAE3F', bubInk: '#1E1730' },
  meme:  { bg: '#FFFFFF', ink: '#1A1A1A', mut: '#444', acc: '#534AB7', acc2: '#D85A30', bub: '#2B1A51', bubInk: '#fff' },
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
.photo{position:relative;background:#fff;padding:18px;box-shadow:0 18px 40px rgba(43,26,81,.18);margin-top:90px}
.photo img{display:block;width:100%}
.tape{position:absolute;left:38%;top:-26px;width:180px;height:52px;background:rgba(240,169,135,.75)}
.foot{position:absolute;left:70px;right:70px;bottom:62px;display:flex;align-items:center;gap:22px}
.av{width:150px;height:150px;border-radius:50%;background:#F4F0FA;box-shadow:0 8px 24px rgba(43,26,81,.18);display:grid;place-items:center;flex:none}
.av img{width:96px;height:96px;image-rendering:pixelated}
.av.sm{width:86px;height:86px}.av.sm img{width:56px;height:56px}
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
.sub em{font-style:normal;color:#F0A987}
/* палитра */
.ptop{position:absolute;left:0;right:0;top:0;height:640px}
.ptop img{width:100%;height:100%;object-fit:cover;display:block}
.ptop:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(30,23,48,0) 45%,${t.bg})}
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
.li{display:flex;gap:20px;align-items:baseline;padding:15px 0;border-bottom:2px dashed rgba(90,74,122,.3);font:500 31px/1.25 Karla}
.li .n{font:italic 400 34px Fraunces;color:${t.acc2};min-width:50px}
.li small{display:block;font:400 24px/1.3 Karla;color:${t.mut};margin-top:3px}
.two{display:grid;grid-template-columns:1fr 1fr;column-gap:40px}
.two .li{font-size:27px}
`;

const AV = img('images/wobbleland/ch-polly.png');
const foot = (o, t) => o.bubble
  ? `<div class="foot"><div class="av"><img src="${AV}"></div><div class="bub">${esc(o.bubble)}</div><div class="site">pigeonpolly.com${o.small ? `<small>${esc(o.small)}</small>` : ''}</div></div>`
  : `<div class="foot"><div class="av sm"><img src="${AV}"></div><div class="site" style="font-weight:500;color:${t.mut}">${o.small ? `<i style="font:italic 400 30px Fraunces">${esc(o.small)}</i>&nbsp;&nbsp;&nbsp;` : ''}<b style="color:${t.ink}">pigeonpolly.com</b></div></div>`;

const T = {
  // POV: заголовок, фото с лентой, подпись курсивом, птичка с репликой
  pov: o => `<div class="kick">${esc(o.kick)}</div><h1 class="${o.h || ''}">${rich(o.title)}</h1>
    <div class="photo" style="transform:rotate(${o.rot || -2}deg)"><div class="tape"></div><img src="${ART}" style="${o.imgCss || ''}"></div>
    <p class="cap">${esc(o.cap)}</p>`,
  // мем: белый верх, арт, субтитр
  meme: o => `<div class="mt">${o.top.map(esc).join('<br>')}</div><div class="mi"><img src="${ART}" style="object-position:${o.pos || 'center'};transform:scale(${o.zoom || 1});transform-origin:${o.pos || 'center'}"><div class="sub">${rich(o.sub)}</div></div>`,
  // палитра
  pal: o => `<div class="ptop"><img src="${ART}" style="object-position:${o.pos || '50% 50%'}"></div><div class="pl"><div class="ptag">COLOR PALETTE</div><h1>${esc(pal.title.en)}</h1>
    <div class="sw">${pal.colors.map(c => `<div class="c"><div style="background:${c.hex}"></div><b>${esc(c.en)}</b><span>${c.hex}</span></div>`).join('')}</div></div>`,
  // список под картинкой
  list: o => `${o.tagText ? `<div class="tag">${esc(o.tagText)}</div>` : `<div class="kick">${esc(o.kick)}</div>`}<h1 class="${o.h || 's'}">${rich(o.title)}</h1>
    <div class="art" style="height:${o.artH || 380}px"><img src="${ART}" style="object-position:${o.pos || 'center'}"></div>
    <div class="list${o.two ? ' two' : ''}">${o.items.map((s, i) => { const [a, b] = [].concat(s); return `<div class="li"><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}</span></div>`; }).join('')}</div>`,
};

const ALT = 'Watercolor of a pigeon in a pink bathrobe with a fluffy purple collar brushing her tiny fangs at an arched mirror by torchlight; the mirror shows towels, a cup and a spider, but no pigeon.';
const GAL = L('/art-portfolio/bird/');
const PINS = [
  { n: 242, type: 'Основной', theme: 'cream', tpl: 'pov', when: ['Октябрь', 'Осень'],
    kick: 'Look at the mirror. Then look again.', title: 'POV: your roommate has *no reflection*',
    cap: 'She says it’s just a really old mirror.', bubble: 'I’m a night person.', small: 'Pigeon Polly comics',
    link: GAL, pt: 'POV: Your Roommate Has No Reflection — Spooky Watercolor Pigeon Comic',
    desc: 'Polly the pigeon brushes her teeth at midnight by torchlight, and the mirror shows the towels, the cup and the spider, but not Polly. She says it’s just a really old mirror 🧛 A cozy-spooky watercolor from my Pigeon Polly series. The whole gallery of her life is on my site.',
    topics: 'Watercolor illustration, Halloween art, Spooky cute, Funny illustration, Vampire art' },

  { n: 243, type: 'Основной', theme: 'blue', tpl: 'list', when: ['Октябрь', 'Осень'], kick: 'Spot the clues', title: 'Polly is *hiding something*', artH: 560, pos: '50% 40%',
    items: [['No reflection in the mirror', 'towels: yes, cup: yes, pigeon: no'], ['Two tiny fangs', 'and very blue toothpaste'], ['A cape collar under the bathrobe'], ['A torch instead of a lamp'], ['A spider who knows everything']],
    small: 'Pigeon Polly gallery',
    link: GAL, pt: 'Spot the Clues: Polly the Pigeon Is Hiding Something (Halloween Watercolor)',
    desc: 'Five clues that Polly the pigeon is hiding something: no reflection in the mirror, two tiny fangs, a cape collar under the fluffy bathrobe, a torch instead of a lamp and a spider who has seen it all. Did you spot them all? A watercolor from my Pigeon Polly series.',
    topics: 'Halloween illustration, Spot the difference, Watercolor painting, Vampire, Cute spooky art' },

  { n: 244, type: 'Мем', theme: 'meme', tpl: 'meme', when: ['Круглый год'], top: ['Me: I have nothing to hide', 'The mirror:'], pos: '42% 30%', zoom: 1.45,
    sub: '“*…*”',
    link: GAL, pt: 'Me: I Have Nothing to Hide. The Mirror: — Funny Vampire Pigeon Meme',
    desc: 'When you say you have nothing to hide, but the mirror has other opinions. Polly the pigeon brushing her fangs at midnight, with no reflection at all 🧛 From my watercolor Pigeon Polly series.',
    topics: 'Funny memes, Vampire memes, Relatable memes, Watercolor art, Halloween humor' },

  { n: 245, type: 'Мем', theme: 'meme', tpl: 'meme', when: ['Круглый год'], top: ['Nobody:', 'Me at 3 a.m.:'], pos: '50% 50%',
    sub: '“the vibe is *gothic*”',
    link: GAL, pt: 'Nobody: Me Brushing My Teeth at 3 AM — Gothic Pigeon Meme',
    desc: 'Night routine of a true night owl, or rather a night pigeon: fluffy bathrobe, torchlight, a spider in the corner and very blue toothpaste. The vibe is gothic. A watercolor from my Pigeon Polly series.',
    topics: 'Night owl memes, Funny memes, Gothic aesthetic, Watercolor illustration, Relatable humor' },

  { n: 246, type: 'Мем', theme: 'meme', tpl: 'meme', when: ['Круглый год'], top: ['My skincare routine', 'after one late-night movie:'], pos: '66% 38%', zoom: 1.7,
    sub: '“step 1: *avoid mirrors*”',
    link: GAL, pt: 'My Skincare Routine After One Late-Night Movie — Funny Vampire Meme',
    desc: 'Step 1: avoid mirrors. Step 2: brush the fangs. Step 3: fluffy bathrobe, always. Polly the pigeon’s night routine in watercolor, from my Pigeon Polly series.',
    topics: 'Skincare memes, Funny memes, Vampire aesthetic, Self care humor, Watercolor art' },

  { n: 247, type: 'Палитра', theme: 'night', tpl: 'pal', when: ['Октябрь', 'Осень'], pos: '55% 45%', small: 'art by Pigeon Polly',
    link: SITE + '/palettes/' + UTM + '#' + KEY, pt: 'Something to Hide Color Palette with HEX Codes | Pigeon Polly',
    desc: `A moody Halloween color palette from my watercolor of Polly the pigeon at a candlelit mirror: ${pal.colors.map(c => `${c.en} ${c.hex}`).join(', ')}. Torchlight gold and bathrobe pink against storm-cloud greys. Save it for your next spooky illustration.`,
    alt: `A color palette of six swatches (${pal.colors.map(c => c.en).join(', ')}) under a dark watercolor of a pigeon in a pink bathrobe at a mirror by torchlight.`,
    topics: 'Color palette, Halloween color palette, Moody colors, HEX codes, Watercolor palette' },

  { n: 248, type: 'Основной', theme: 'lilac', tpl: 'list', when: ['Октябрь'], tagText: 'October sketchbook', title: 'Draw a monster with *a boring routine*', artH: 470, pos: '50% 45%', two: 1,
    items: ['a vampire brushing fangs', 'a ghost doing laundry', 'a witch at the dentist', 'a werewolf shaving', 'a mummy rewrapping', 'a zombie at yoga', 'a bat hanging laundry', 'a skeleton ironing', 'Frankenstein charging', 'a pumpkin in a face mask'],
    small: 'themes daily in the challenge',
    link: L('/challenge/'), pt: '10 Halloween Drawing Ideas: Monsters with Boring Everyday Routines',
    desc: 'Spooky but cozy October drawing ideas: a vampire brushing fangs, a ghost doing laundry, a witch at the dentist, a werewolf shaving and six more monsters doing ordinary chores. Perfect for your Halloween sketchbook. My daily drawing challenge gives you a new theme every day.',
    alt: 'A list of 10 Halloween drawing ideas under a watercolor of a pigeon vampire in a bathrobe brushing her teeth.',
    topics: 'Halloween drawing ideas, Drawing prompts, October sketchbook, Inktober ideas, Cute monsters' },

  { n: 249, type: 'Основной', theme: 'cream', tpl: 'pov', when: ['Круглый год'], h: 's', rot: 2,
    kick: 'Introverts will understand', title: 'Me at midnight: *finally,* my time', imgCss: 'height:520px;object-fit:cover;object-position:70% 50%',
    cap: 'Bathrobe on. Torch lit. Nobody can see me. Not even the mirror.', bubble: 'Do not disturb.',
    link: GAL, pt: 'Me at Midnight: Finally My Time — Cozy Introvert Watercolor Comic',
    desc: 'The house is quiet, the bathrobe is fluffy, the torch is lit and nobody can see you. Not even the mirror. Polly the pigeon living her best night-owl life, in watercolor from my Pigeon Polly series.',
    topics: 'Introvert humor, Night owl, Cozy illustration, Watercolor comic, Relatable art' },

  { n: 250, type: 'Основной', theme: 'blue', tpl: 'list', when: ['Октябрь', 'Осень'], tagText: 'Night routine', title: 'A very normal *bedtime routine*', artH: 530, pos: '60% 45%',
    items: ['Light the torch', 'Brush both fangs', 'Say hi to the spider', 'Check the mirror (still nothing)', 'Fluffy bathrobe on. Sleep till sunset.'],
    small: 'Pigeon Polly comics',
    link: GAL, pt: 'A Very Normal Bedtime Routine — Funny Halloween Vampire Pigeon',
    desc: 'Light the torch, brush both fangs, say hi to the spider, check the mirror (still nothing), fluffy bathrobe on, sleep till sunset. Polly the pigeon’s perfectly normal routine, in watercolor from my Pigeon Polly series.',
    topics: 'Halloween humor, Vampire, Bedtime routine, Watercolor illustration, Funny art' },

  { n: 251, type: 'Основной', theme: 'lilac', tpl: 'pov', when: ['Октябрь', 'Осень'], rot: -1.5,
    kick: 'Tell me without telling me', title: 'You’re a *vampire*',
    cap: 'Garlic? Sunlight? Mirrors? Never heard of them.', bubble: 'Totally normal pigeon.', small: 'Pigeon Polly gallery',
    link: GAL, pt: 'Tell Me You’re a Vampire Without Telling Me — Halloween Watercolor Pigeon',
    desc: 'Tell me you’re a vampire without telling me: a midnight toothbrush, a torch instead of a lamp, a cape collar under the bathrobe and no reflection in the mirror. Polly the pigeon is hiding something 🧛 Watercolor from my Pigeon Polly series.',
    topics: 'Halloween art, Vampire aesthetic, Funny illustration, Watercolor painting, Spooky cute' },
];
PINS.forEach(p => { p.alt = p.alt || ALT; });

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
  fs.writeFileSync(path.join(__dirname, 'pins3.json'), JSON.stringify(meta, null, 1));
})();
