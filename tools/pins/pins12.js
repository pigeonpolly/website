// Пины-палитры (копия pins7.js) для 50 новых палитр серии studio — фото работ из мастерской (photos2/), Алина 15.11.
// №576–625, utm_campaign=studio, Notion «Pinterest pins 3.0», Шаблон «Палитра», Актуальность — сезон из списка.
// node tools/pins/pins12.js [номер…] → site/images/pins/pin-NNN.jpg (1000×1500) и tools/pins/pins12.json.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const SITE = 'https://www.pigeonpolly.com';
const UTM = '?utm_source=pinterest&utm_campaign=studio';
const PAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/palettes.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const SER = {
  bird: 'from my Pigeon Polly series, about a little pigeon who lives through all the same small dramas we do',
  snail: 'from my Mr. Chew series, about a slow, cozy snail who dresses up for every occasion',
  sketchbook: 'a page from my sketchbook',
  halloween: 'from my Halloween series of pumpkin-headed portraits',
  studio: 'straight from my studio table',
};

// n, ключ, позиция арта, настроение для описания, темы, сезон для Notion
const PINS = [
  [576, 'studio-apple_creature', '50% 45%', 'An apple-headed critter in olive, copper and cocoa: a quirky, earthy palette for whimsical characters.', 'Earthy color palette, Olive green palette, Whimsical art, HEX codes, Watercolor creature', 'Осень'],
  [577, 'studio-bee_rider', '50% 40%', 'Lemon, tangerine and brick red on soft ivory: a sunny, playful palette for cute bug illustrations.', 'Yellow color palette, Cute illustration, Bug art, HEX codes, Playful colors', 'Лето'],
  [578, 'studio-beetle', '50% 45%', 'Polished terracotta and latte browns with ink black: a warm, natural-history palette.', 'Brown color palette, Vintage nature, Insect art, HEX codes, Earthy tones', 'Круглый год'],
  [579, 'studio-birdhouse', '50% 45%', 'Weathered clay wood, cherry blossoms and olive leaves: a gentle cottagecore palette.', 'Cottagecore palette, Spring colors, Birdhouse art, HEX codes, Soft earthy palette', 'Весна'],
  [580, 'studio-blocks', '50% 50%', 'Bright summer sky over grey city blocks: a crisp blue urban palette.', 'Blue color palette, Urban sketching, City colors, HEX codes, Sky blue palette', 'Круглый год'],
  [581, 'studio-bookshop', '50% 50%', 'Warm window light, cornflower glass and night-time charcoal: a cozy bookshop palette.', 'Bookish aesthetic, Cozy color palette, Night colors, HEX codes, Dark academia', 'Осень'],
  [582, 'studio-breakfast_cuba', '50% 50%', 'Ochre toast, coffee bark and steel-blue china: a warm breakfast-table palette.', 'Food illustration colors, Warm neutral palette, Breakfast art, HEX codes, Kitchen palette', 'Круглый год'],
  [583, 'studio-breakfast_us', '50% 50%', 'Golden pancakes, jelly pink and blueberry twilight: a sweet diner breakfast palette.', 'Breakfast color palette, Pastel and warm, Food art, HEX codes, Diner aesthetic', 'Круглый год'],
  [584, 'studio-burger', '50% 55%', 'Mustard, ketchup cherry and pickle green: a bold, juicy pop-art food palette.', 'Food color palette, Bold colors, Pop art palette, HEX codes, Burger painting', 'Лето'],
  [585, 'studio-cactus', '50% 50%', 'Lemon, poppy and swamp green straight from the paint box: a cheerful desert palette.', 'Cactus color palette, Bright watercolor, Desert colors, HEX codes, Paint box', 'Лето'],
  [586, 'studio-caffeine_cup', '50% 45%', 'Terracotta cup, brass foil and a denim-blue label: a cozy holiday latte palette.', 'Coffee color palette, Cozy winter colors, Holiday drinks, HEX codes, Warm palette', 'Зима'],
  [587, 'studio-cat_lights', '40% 50%', 'Fairy-light lemon and olive glow on storm-dark ink: a magical cozy-night palette.', 'Fairy lights aesthetic, Cozy night palette, Cat art, HEX codes, Dark and warm', 'Зима'],
  [588, 'studio-central_perk', '50% 50%', 'Tangerine sofa, tomato red and pistachio walls: a retro coffee-shop palette for friends-night art.', 'Retro color palette, Coffee shop aesthetic, 90s colors, HEX codes, Warm and bright', 'Круглый год'],
  [589, 'studio-cereal', '50% 50%', 'Tomato red, harbor blue and fruit-loop pastels: a punchy breakfast pop palette.', 'Red and blue palette, Pop art colors, Cereal painting, HEX codes, Bold palette', 'Круглый год'],
  [590, 'studio-chars', '50% 50%', 'Marigold, rust and berry on deep navy: a rich palette for designing bird characters.', 'Character design colors, Navy and gold, Bird art, HEX codes, Rich color palette', 'Круглый год'],
  [591, 'studio-checker_coffee', '50% 50%', 'Checkerboard ink, latte and ochre: a warm black-and-cream coffee palette.', 'Coffee aesthetic, Black and cream palette, Checkered pattern, HEX codes, Neutral colors', 'Осень'],
  [592, 'studio-cookies', '50% 60%', 'Cherry red, biscuit and milky linen on ink black: a classic milk-and-cookies palette.', 'Cookie color palette, Red and cream, Still life painting, HEX codes, Cozy food art', 'Зима'],
  [593, 'studio-cupcake', '50% 45%', 'Cherry tomato red, copper cake and deep teal: a bold complementary dessert palette.', 'Red and teal palette, Dessert painting, Complementary colors, HEX codes, Cupcake art', 'Круглый год'],
  [594, 'studio-desk_night', '50% 45%', 'Monitor glow, emerald and pigeon purple in a dark room: a cozy gamer-desk palette.', 'Cozy gaming aesthetic, Night desk, Dark color palette, HEX codes, Purple and green', 'Зима'],
  [595, 'studio-doors_framed', '50% 50%', 'Brass, burgundy and weathered bark: an old-town door palette with icy light.', 'Vintage color palette, Burgundy palette, Old town art, HEX codes, Architecture colors', 'Круглый год'],
  [596, 'studio-espresso_palette', '50% 55%', 'Tomato red, lemon and violet ink by a coffee machine: a bright studio-desk palette.', 'Bright color palette, Coffee art, Watercolor sketch, HEX codes, Studio desk', 'Круглый год'],
  [597, 'studio-field_acrylic', '50% 50%', 'Potion green meadows, cobalt sky and cinnamon earth: a fresh summer landscape palette.', 'Green color palette, Summer landscape, Acrylic painting, HEX codes, Nature colors', 'Лето'],
  [598, 'studio-finland', '50% 45%', 'Brick red, ochre beer foam and fjord slate: a cheeky Nordic travel palette.', 'Nordic color palette, Travel illustration, Scandinavian colors, HEX codes, Pigeon art', 'Круглый год'],
  [599, 'studio-fuji', '50% 40%', 'Copper easel wood, summer sky and snowy lichen: a calm mountain-view palette.', 'Mountain color palette, Japan aesthetic, Sky blue and copper, HEX codes, Landscape painting', 'Круглый год'],
  [600, 'studio-ikra', '50% 50%', 'Terracotta caviar, mustard lid and paper white: a fun, glossy food palette.', 'Food color palette, Orange palette, Fun food art, HEX codes, Watercolor food', 'Круглый год'],
  [601, 'studio-impasto_flowers', '50% 50%', 'Tomato, jelly pink and mossy green in thick paint: a romantic impasto flower palette.', 'Floral color palette, Pink palette, Impasto painting, HEX codes, Romantic colors', 'Весна'],
  [602, 'studio-karums_girl', '50% 40%', 'Tomato beads, pigeon purple scarf and blush cheeks: a warm folk-portrait palette.', 'Folk art colors, Purple and red palette, Portrait painting, HEX codes, Warm palette', 'Круглый год'],
  [603, 'studio-lanterns', '50% 50%', 'Poppy red lanterns and potion green on biscuit paper: a festive sketchbook palette.', 'Lantern color palette, Red and green, Sketchbook art, HEX codes, Festive colors', 'Круглый год'],
  [604, 'studio-mcd_still', '50% 50%', 'Poppy, marigold and brick on charcoal: a loud fast-food still life palette.', 'Red and yellow palette, Still life painting, Bold colors, HEX codes, Food art', 'Круглый год'],
  [605, 'studio-moka_rust', '50% 50%', 'Poppy and salmon splashes around rusty chestnut steel: a moody coffee-pot palette.', 'Coffee color palette, Rust colors, Moka pot art, HEX codes, Watercolor splash', 'Осень'],
  [606, 'studio-mushroom_house', '50% 45%', 'Toadstool cherry, candle glow and duck-egg rain: a fairytale cottage palette.', 'Fairytale color palette, Mushroom house, Cottagecore colors, HEX codes, Whimsical art', 'Осень'],
  [607, 'studio-myth_beach', '50% 55%', 'Tomato towel, ochre sand and steel-blue sea: a sunny beach-gossip palette.', 'Beach color palette, Summer colors, Funny pigeon art, HEX codes, Coastal palette', 'Лето'],
  [608, 'studio-myth_read', '50% 50%', 'Cherry, cobalt and marigold on duck egg: a bright book-lover palette.', 'Book lover palette, Primary colors, Reading aesthetic, HEX codes, Pigeon art', 'Круглый год'],
  [609, 'studio-myth_worm', '50% 50%', 'Coral, lemon and pigeon purple: a silly, sunny snack-time palette.', 'Purple and coral palette, Funny illustration, Bright colors, HEX codes, Pigeon art', 'Круглый год'],
  [610, 'studio-nailpolish', '50% 50%', 'Tomato red polish, salmon smudges and latte skin tones: a glam beauty palette.', 'Red color palette, Beauty aesthetic, Nail polish art, HEX codes, Glam colors', 'Круглый год'],
  [611, 'studio-oil_stilllife', '50% 45%', 'Ochre, brick and moss in classic oils: a warm kitchen still life palette.', 'Still life color palette, Earthy colors, Oil painting, HEX codes, Classic palette', 'Осень'],
  [612, 'studio-old_house', '50% 50%', 'Brick roof, ochre grass and lichen boards: a rustic, sun-faded countryside palette.', 'Rustic color palette, Countryside art, Earthy tones, HEX codes, Old house painting', 'Осень'],
  [613, 'studio-park_pond', '50% 50%', 'Brass light, tomato accents and orchid pinks by the water: a lively park palette.', 'Park color palette, Plein air painting, Warm and bright, HEX codes, Landscape colors', 'Лето'],
  [614, 'studio-pbj', '50% 50%', 'Cherry jam, terracotta peanut butter and a teal plate: a nostalgic lunchbox palette.', 'Food color palette, Retro colors, Peanut butter jelly, HEX codes, Teal and red', 'Круглый год'],
  [615, 'studio-plants_tin', '50% 50%', 'Brass tins, brick pots and violet ink: a cozy windowsill plant palette.', 'Plant color palette, Cozy home, Houseplant art, HEX codes, Watercolor sketch', 'Весна'],
  [616, 'studio-poirot', '50% 40%', 'Clay, mauve and coffee-bean browns: a soft, old-fashioned detective palette.', 'Vintage color palette, Mauve and brown, Portrait painting, HEX codes, Mystery aesthetic', 'Осень'],
  [617, 'studio-pumpkin_color', '50% 50%', 'Cobalt and cornflower purples with terracotta pumpkins: a dreamy autumn palette.', 'Purple and orange palette, Pumpkin art, Autumn colors, HEX codes, Halloween palette', 'Осень'],
  [618, 'studio-pumpkin_stop', '50% 50%', 'Terracotta pumpkins and olive night at the bus stop: a spooky-cozy autumn palette.', 'Halloween color palette, Pumpkin art, Dark autumn, HEX codes, Spooky cute', 'Осень'],
  [619, 'studio-redhair', '50% 40%', 'Brick red hair, biscuit skin and rainy grey: a moody portrait palette.', 'Red hair palette, Portrait colors, Moody palette, HEX codes, Watercolor portrait', 'Осень'],
  [620, 'studio-rembrandt', '50% 50%', 'Cobalt, brass and terracotta paint tubes: an artist-supply palette with classic warmth.', 'Artist palette, Blue and gold, Art supplies, HEX codes, Classic colors', 'Круглый год'],
  [621, 'studio-retro_tv', '50% 45%', 'Candle-glow lamp, cobalt screen and cherry red: a nostalgic retro-room palette.', 'Retro color palette, 90s nostalgia, Cozy room, HEX codes, Vintage TV', 'Круглый год'],
  [622, 'studio-rock_orange', '50% 50%', 'Poppy, persimmon and brick on ink black: a fiery, bold orange palette.', 'Orange color palette, Bold colors, Ink drawing, HEX codes, Fiery palette', 'Осень'],
  [623, 'studio-sardines', '50% 50%', 'Jelly pink tin, cinnamon and driftwood greys: a quirky retro-kitchen palette.', 'Pink color palette, Retro kitchen, Sardine art, HEX codes, Quirky food art', 'Круглый год'],
  [624, 'studio-snail_adam', '50% 50%', 'Cornflower, cobalt and moss with dusty rose: a dreamy, storybook palette.', 'Blue color palette, Storybook colors, Snail art, HEX codes, Dreamy palette', 'Весна'],
  [625, 'studio-yoga', '50% 50%', 'Cobalt sea, terracotta mat and denim shadows: a calm self-care palette.', 'Blue and terracotta, Self care aesthetic, Yoga art, HEX codes, Calm colors', 'Круглый год']
].map(([n, key, pos, mood, topics, season]) => {
  const p = PAL.find(x => x.key === key); if (!p) throw new Error('no palette ' + key);
  const t = p.title.en, list = p.colors.map(c => `${c.en} ${c.hex}`).join(', ');
  const tt = t.replace(/(^|\s)\S/g, s => s.toUpperCase()).replace(/’S\b/, '’s').replace(/ (At|For|And|Of|In|The|A|On|Over|With|To|By)(?= )/g, m => m.toLowerCase());
  return { n, key, pos, p, season,
    pt: `${tt} Color Palette with HEX Codes | Pigeon Polly`,
    desc: `Six colors from my ${p.gallery === 'sketchbook' ? 'sketch' : p.gallery === 'studio' ? 'artwork' : 'illustration'} “${t}”, ${SER[p.gallery]}: ${list}. ${mood} Click any color on my site to copy its HEX.`,
    alt: `A color palette of six swatches (${p.colors.map(c => c.en).join(', ')}) with HEX codes under the ${p.gallery === 'studio' ? 'artwork' : 'illustration'} “${t}” by Pigeon Polly.`,
    link: `${SITE}/palettes/${UTM}#${key}`, topics };
});

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1000px;height:1500px;overflow:hidden}
body{background:#2A1B1E;color:#F6ECDF;font-family:Karla,sans-serif;position:relative}
.ptop{position:absolute;left:0;right:0;top:0;height:780px}
.ptop img{width:100%;height:100%;object-fit:cover;display:block}
.ptop:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(42,27,30,0) 52%,rgba(42,27,30,.75) 80%,#2A1B1E)}
.pl{position:absolute;left:70px;right:70px;top:680px}
.ptag{font:700 26px Karla;letter-spacing:.24em;color:#E0A13A}
h1{font:600 80px/1.02 Fraunces;letter-spacing:-.03em;margin-top:12px}
h1.s{font-size:68px}
.sw{display:grid;grid-template-columns:repeat(3,1fr);gap:30px 22px;margin-top:40px}
.sw .c div{height:118px;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.sw b{display:block;font:700 26px Karla;margin-top:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sw span{display:block;font:500 21px Karla;color:#BFAEA6;letter-spacing:.06em;margin-top:6px}
.foot{position:absolute;left:70px;right:70px;bottom:52px;display:flex;align-items:baseline}
.foot i{font:italic 400 30px Fraunces;color:#BFAEA6}
.foot b{margin-left:auto;font:700 30px Karla}
.num{position:absolute;right:16px;bottom:10px;font:700 20px Karla;color:#6E5A5C}
`;

(async () => {
  const want = process.argv.slice(2).map(Number);
  const list = want.length ? PINS.filter(p => want.includes(p.n)) : PINS;
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  for (const o of list) {
    const art = 'file://' + path.join(ROOT, 'site', o.p.img);
    const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&family=Karla:wght@400;500;700&display=swap"><style>${CSS}</style></head><body>
<div class="ptop"><img src="${art}" style="object-position:${o.pos}"></div>
<div class="pl"><div class="ptag">COLOR PALETTE</div><h1 class="${o.p.title.en.length > 18 ? 's' : ''}">${esc(o.p.title.en)}</h1>
<div class="sw">${o.p.colors.map(c => `<div class="c"><div style="background:${c.hex}"></div><b>${esc(c.en)}</b><span>${c.hex}</span></div>`).join('')}</div></div>
<div class="foot"><i>art by Pigeon Polly</i><b>pigeonpolly.com</b></div><div class="num">${o.n}</div></body></html>`;
    const f = path.join(__dirname, 'out12.html'); fs.writeFileSync(f, html);
    await page.goto('file://' + f, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const bot = await page.evaluate(() => document.querySelector('.sw').getBoundingClientRect().bottom);
    if (bot > 1400) console.log('⚠ pin', o.n, 'swatches bottom', Math.round(bot));
    await page.screenshot({ path: path.join(ROOT, 'site/images/pins', `pin-${o.n}.jpg`), type: 'jpeg', quality: 88 });
    console.log('pin', o.n, o.p.title.en);
  }
  fs.unlinkSync(path.join(__dirname, 'out12.html'));
  await b.close();
  const meta = PINS.map(o => ({ n: o.n, key: o.key, season: o.season, title: o.pt, desc: o.desc, alt: o.alt, link: o.link, topics: o.topics, media: `${SITE}/images/pins/pin-${o.n}.jpg` }));
  fs.writeFileSync(path.join(__dirname, 'pins12.json'), JSON.stringify(meta, null, 1));
})();
