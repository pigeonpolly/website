// Пины Thanksgiving №1414–1460 (Алина 21.11.2026: «сделай в сумме 50 пинов»). Подключаются из tools/pins/thanks26.js.
// Всё открыто (списки видны целиком, HEX видны), арты только Алины, ссылки — на настоящие страницы: /prompts/, /palettes/#ключ.
const PALS = Object.fromEntries(require('../../content/palettes.json').map(p => [p.key, p]));

module.exports = ({ esc, U, img, L, foot }) => {
  const TH = {
    cream: { bg: '#F6ECDF', fg: '#2E2521', acc: '#B4521E', acc2: '#E9A72B', mut: '#7A6658', card: '#FFFBF5', logo: 'color-winter' },
    paper: { bg: '#FFFBF5', fg: '#2E2521', acc: '#8C3B1E', acc2: '#C98A2E', mut: '#7A6658', card: '#F6ECDF', logo: 'color-winter' },
    pumpkin: { bg: '#C9622B', fg: '#FFF6EA', acc: '#FFD9A8', acc2: '#7A2E12', mut: '#FBE3CC', card: '#D9763F', logo: 'color-winter', btn: '#3A1A0E', btnFg: '#FFF6EA' },
    cran: { bg: '#3E1A1F', fg: '#F8EEE2', acc: '#F0A35E', acc2: '#E9C46A', mut: '#CDB5AE', card: '#52252B', logo: 'color-autumn', btn: '#F0A35E', btnFg: '#3E1A1F' },
    olive: { bg: '#ECE8D6', fg: '#2B2A1E', acc: '#8A4A1C', acc2: '#7C7A33', mut: '#6B6650', card: '#FAF8EE', logo: 'color-winter' },
  };
  const out = []; let n = 1414;
  const add = (th, o) => { const t = TH[th], k = n++; out.push({ n: k, t, ...o(t, k) }); };
  const head = (kick, h, right = 56, top = 58) => `<div style="position:absolute;left:56px;top:${top}px;right:${right}px"><div class="kick">${kick}</div><h1 style="margin-top:18px">${h}</h1></div>`;
  const plain = s => s.replace(/<\/?em>/g, '');
  const A = k => PALS[k].img.replace('images/', '');

  // ——— 1) палитры: 16 тёплых артов, 4 формата по очереди ———
  const PAL = [
    ['sketchbook-17', 'Persimmon season', 'a sketchbook page of ripe persimmons', '50% 50%', 'cream'],
    ['2024-mr-chew-gardening-edition', 'Harvest garden', 'Mr Chew the snail in a garden shed with a potato harvest', '50% 55%', 'olive'],
    ['details-tangerine-quilt', 'Cozy table', 'a cozy table with bowls, a pie and tangerines', '50% 50%', 'cran'],
    ['studio-oil_stilllife', 'Harvest still life', 'an oil still life with bottles and fruit', '50% 40%', 'paper'],
    ['details-holiday-latte', 'Spiced latte', 'a spiced latte with whipped cream', '50% 40%', 'cream'],
    ['studio-old_house', 'Old farmhouse', 'an old farmhouse in dry autumn grass', '50% 50%', 'olive'],
    ['details-lilac-pumpkins', 'Lilac pumpkins', 'hand-lettered pumpkins in lilac watercolour', '50% 50%', 'paper'],
    ['studio-pbj', 'Toast & jam', 'toast with peanut butter and jam', '50% 50%', 'pumpkin'],
    ['details-cafe-counter', 'Café counter', 'a café counter with cups and an espresso machine', '50% 50%', 'cream'],
    ['details-train-window', 'Train window', 'an autumn landscape through a train window', '50% 50%', 'cran'],
    ['studio-moka_rust', 'Morning coffee', 'a moka pot in watercolour', '50% 50%', 'paper'],
    ['details-pumpkin-bus-stop', 'Pumpkin heads', 'pumpkin-headed people at a bus stop', '50% 50%', 'olive'],
    ['studio-apple_creature', 'Apple creature', 'a funny creature with an apple head', '50% 40%', 'cream'],
    ['details-checkerboard-espresso', 'Checkered espresso', 'espresso cups on a checkered cloth', '50% 50%', 'paper'],
    ['studio-cupcake', 'Cherry dessert', 'a cherry cupcake with whipped cream', '50% 50%', 'cran'],
    ['2025-mr-chew-opened-pumpkin-spice-latte-season', 'Pumpkin spice', 'Mr Chew the snail with a pumpkin and a pumpkin spice latte', '50% 50%', 'pumpkin'],
  ];
  const FMT = ['grid', 'strip', 'dots', 'three'];
  PAL.forEach(([key, name, what, pos, th], i) => add(th, (t, k) => {
    const p = PALS[key], fmt = FMT[i % 4], cs = fmt === 'three' ? p.colors.slice(0, 3) : p.colors;
    const sw = c => `<div style="font:600 25px/1.1 Fraunces">${esc(c.en)}</div><div style="font:700 23px Karla;color:${t.mut};margin-top:4px;letter-spacing:.04em">${c.hex}</div>`;
    const body = {
      grid: () => `${head('thanksgiving · color palette', `<em>${esc(name)}</em> palette`)}
        <div class="fr" style="position:absolute;left:56px;right:56px;top:300px">${img(A(key), 888, 520, pos)}</div>
        <div style="position:absolute;left:56px;right:56px;top:860px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
        ${cs.map(c => `<div style="background:${t.card};border-radius:14px;overflow:hidden"><div style="height:130px;background:${c.hex}"></div><div style="padding:12px 16px">${sw(c)}</div></div>`).join('')}</div>`,
      strip: () => `${head('thanksgiving · hex codes', `A <em>${esc(name.toLowerCase())}</em> Thanksgiving palette`)}
        <div class="fr" style="position:absolute;left:56px;top:330px">${img(A(key), 520, 830, pos)}</div>
        <div style="position:absolute;left:600px;right:56px;top:330px;display:flex;flex-direction:column;gap:14px">
        ${cs.map(c => `<div><div style="height:82px;border-radius:12px;background:${c.hex}"></div><div style="margin-top:6px">${sw(c)}</div></div>`).join('')}</div>`,
      dots: () => `${head('fall color palette', `Thanksgiving colors: <em>${esc(name.toLowerCase())}</em>`)}
        <div class="fr" style="position:absolute;left:56px;right:56px;top:330px">${img(A(key), 888, 560, pos)}</div>
        <div style="position:absolute;left:40px;right:40px;top:940px;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;text-align:center">
        ${cs.map(c => `<div><div style="width:132px;height:132px;margin:0 auto;border-radius:50%;background:${c.hex};box-shadow:0 0 0 5px ${t.card}"></div><div style="font:600 21px/1.1 Fraunces;margin-top:14px;min-height:46px">${esc(c.en)}</div><div style="font:700 19px Karla;color:${t.mut}">${c.hex}</div></div>`).join('')}</div>`,
      three: () => `${head('3-color palette · thanksgiving', `Just <em>three colors</em>: ${esc(name.toLowerCase())}`)}
        <div class="fr" style="position:absolute;left:56px;right:56px;top:330px">${img(A(key), 888, 500, pos)}</div>
        <div style="position:absolute;left:56px;right:56px;top:870px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
        ${cs.map(c => `<div><div style="height:200px;border-radius:14px;background:${c.hex}"></div><div style="margin-top:10px">${sw(c)}</div></div>`).join('')}</div>`,
    }[fmt]();
    const list = cs.map(c => `${c.en} ${c.hex}`).join(', ');
    return { tpl: 'Палитра', link: L(`/palettes/#${key}`, k),
      title: { grid: `${name} Thanksgiving Color Palette — 6 Warm HEX Codes from a Painting`, strip: `Thanksgiving Color Palette: ${name} — Fall HEX Codes for Artists`, dots: `Warm Fall Color Palette for Thanksgiving — ${name} (6 HEX codes)`, three: `3-Color Thanksgiving Palette: ${name} — Simple Fall Color Combo` }[fmt],
      desc: `A ${fmt === 'three' ? 'simple three-colour' : 'warm'} Thanksgiving palette from my painting of ${what}: ${list}. Use it for fall illustrations, cards, invitations or your sketchbook. The full palette with HEX codes is free on pigeonpolly.com.`,
      alt: `${cs.length} warm colours with names and HEX codes next to a painting by Pigeon Polly of ${what}.`,
      topics: 'Thanksgiving color palette, Fall color palette, HEX color codes, Color inspiration for artists',
      html: () => body + foot('Get the palette', t) };
  }));

  // ——— 2) открытые списки тем → /prompts/ ———
  const LISTS = [
    ['cream', 'thanksgiving · doodles', '25 tiny <em>Thanksgiving doodles</em>', 'studio-apple_creature', '50% 30%', ['a slice of pie', 'a tiny pumpkin', 'an acorn', 'a maple leaf', 'a gravy boat', 'a mug with steam', 'a corn cob', 'a little turkey', 'a pie lattice', 'a candle', 'a fork & knife', 'a cranberry bowl', 'a wheat stalk', 'a knitted hat', 'an apple', 'a cinnamon stick', 'a cozy sock', 'a dinner roll', 'a mushroom', 'a pine cone', 'a wine glass', 'a gratitude heart', 'a basket', 'a pear', 'a sleepy cat'],
      '25 Easy Thanksgiving Doodles — Tiny Fall Things to Draw in Your Sketchbook', 'Tiny Thanksgiving doodles for bullet journals and sketchbooks'],
    ['cran', 'friendsgiving · prompts', '20 <em>Friendsgiving</em> things to draw', 'details-tangerine-quilt', '50% 50%', ['everyone’s hands around the table', 'the friend who brings only wine', 'a potluck of mismatched dishes', 'paper plates, proudly', 'a board game after dinner', 'the group photo attempt', 'fairy lights on the balcony', 'someone’s first homemade pie', 'a toast with juice glasses', 'the playlist argument', 'coats piled on the bed', 'a cat judging the guests', 'the tiny apartment, full', 'leftovers in borrowed boxes', 'a candle in a jar', 'a pumpkin as a centrepiece', 'shoes by the door', 'a handwritten menu', 'laughing too loud', 'the last one to leave'],
      '20 Friendsgiving Drawing Prompts — Cozy Things to Draw with Friends', 'Friendsgiving drawing ideas'],
    ['paper', 'pies & desserts · prompts', '20 <em>pies & desserts</em> to draw this fall', 'studio-cupcake', '50% 40%', ['pumpkin pie with whipped cream', 'apple pie, lattice top', 'pecan pie from above', 'a cherry cupcake', 'a pie with one slice gone', 'cinnamon rolls on a tray', 'a crumbly apple crumble', 'a sweet potato pie', 'pie crust leaves', 'a cheesecake with berries', 'a stack of cookies', 'caramel apples', 'a slice on a vintage plate', 'a pie cooling on a window', 'a flour-covered rolling pin', 'whipped cream swirl', 'a cake stand under glass', 'a pie in a picnic basket', 'a tiny hand pie', 'crumbs on an empty plate'],
      '20 Pies and Desserts to Draw This Fall — Thanksgiving Food Drawing Ideas', 'Fall dessert drawing ideas'],
    ['olive', 'from above · table prompts', 'Draw your <em>Thanksgiving table</em>: 15 things on it', 'details-cafe-counter', '50% 50%', ['the big roast in the middle', 'a bowl of mashed potatoes', 'cranberry sauce', 'a basket of bread rolls', 'green beans', 'a gravy boat', 'two candles', 'everyone’s plates', 'forks, knives, napkins', 'a pumpkin centrepiece', 'wine and water glasses', 'a pie waiting on the side', 'salt and pepper', 'a stray autumn leaf', 'one hand reaching in'],
      'Draw Your Thanksgiving Table From Above — 15 Things to Include', 'Top-down table illustration ideas'],
    ['cream', 'fall kitchen · prompts', '20 cozy <em>fall kitchen</em> things to draw', 'studio-moka_rust', '50% 50%', ['a moka pot on the stove', 'a jar of cinnamon sticks', 'a soup pot steaming', 'an apron on a hook', 'a recipe card with stains', 'a bowl of apples', 'a wooden spoon', 'a teapot', 'a sack of potatoes', 'herbs drying upside down', 'a kitchen window at dusk', 'a flour jar', 'an oven mitt', 'a pie dish', 'jam jars in a row', 'a whisk', 'a kettle', 'a bread loaf', 'a cutting board with squash', 'a cat on the counter'],
      '20 Cozy Fall Kitchen Things to Draw — Autumn Sketchbook Prompts', 'Cozy kitchen sketchbook prompts'],
    ['paper', 'gratitude · sketchbook prompts', '20 <em>gratitude</em> prompts for your sketchbook', 'details-train-window', '50% 50%', ['a meal that made you happy', 'a place you feel safe', 'a voice you love', 'your favourite mug', 'a friend in one line', 'the view from your window', 'something you made', 'a kind message you got', 'a book that helped', 'your morning light', 'a smell of home', 'a walk you love', 'your art supplies', 'a song as a picture', 'a small win this year', 'your bed on a cold night', 'a pet (yours or a neighbour’s)', 'a teacher you remember', 'a city that shaped you', 'today, exactly as it is'],
      '20 Gratitude Prompts for Your Sketchbook — Thanksgiving Drawing Journal', 'Gratitude journal ideas'],
    ['cran', 'after dinner · lazy prompts', '15 <em>lazy</em> things to draw after Thanksgiving dinner', 'studio-cookies', '50% 50%', ['the empty plates', 'someone asleep on the sofa', 'your stretched-out belly button', 'the dog licking a plate', 'the dishes mountain', 'a cup of tea, finally', 'socks on the coffee table', 'the TV glow', 'the leftover pie (again)', 'a blanket pile', 'one candle still burning', 'the napkin you doodled on', 'your shoes kicked off', 'the window at night', 'a very full fridge'],
      '15 Lazy Things to Draw After Thanksgiving Dinner — Easy Cozy Sketch Ideas', 'Easy cozy sketch ideas'],
    ['olive', 'harvest · prompts', '20 <em>harvest</em> vegetables & fruit to draw', '2024-mr-chew-gardening-edition', '50% 55%', ['a butternut squash', 'a crooked carrot', 'potatoes with dirt', 'a pumpkin with a curly stem', 'a beetroot cut in half', 'a corn cob in its husk', 'a cabbage', 'a pear', 'a bunch of grapes', 'a persimmon', 'Brussels sprouts on the stalk', 'a red onion', 'a garlic bulb', 'an apple with a leaf', 'cranberries in a bowl', 'a sweet potato', 'a turnip', 'a basket of mushrooms', 'a quince', 'a leek'],
      '20 Harvest Vegetables and Fruit to Draw — Fall Still Life Ideas', 'Fall still life ideas'],
    ['pumpkin', 'beginner friendly', '20 <em>easy</em> Thanksgiving drawings for beginners', 'sketchbook-17', '50% 50%', ['a round pumpkin', 'a leaf from three lines', 'a mug of cocoa', 'a slice of pie (a triangle!)', 'an apple', 'a candle', 'a simple turkey from your hand', 'a corn cob of dots', 'a mushroom', 'a scarf', 'a bowl of soup', 'an acorn', 'a little house with smoke', 'a pear', 'a plate and fork', 'a jar of jam', 'a pine cone', 'a pumpkin stack', 'a teapot', 'a heart that says thanks'],
      '20 Easy Thanksgiving Drawings for Beginners — Simple Fall Doodle Ideas', 'Easy drawings for beginners'],
    ['cream', 'thanksgiving weekend', 'A 4-day <em>Thanksgiving weekend</em> sketch plan', 'details-holiday-latte', '50% 40%', ['Thu · the table before anyone eats', 'Thu · a guest’s hands', 'Thu · the pie, unfinished', 'Fri · your leftovers sandwich', 'Fri · a walk, one leaf', 'Fri · a coffee you didn’t need', 'Sat · the cozy corner', 'Sat · a window at dusk', 'Sat · your slippers', 'Sun · something you’re thankful for', 'Sun · the week ahead as a doodle', 'Sun · one quiet object'],
      'Thanksgiving Weekend Sketch Plan — 12 Drawing Prompts, Thursday to Sunday', 'Weekend sketchbook plan'],
    ['paper', 'hand-lettering · words', '20 <em>words</em> to hand-letter for Thanksgiving', 'details-lilac-pumpkins', '50% 50%', ['thankful', 'grateful', 'gather', 'harvest', 'cozy', 'blessed', 'feast', 'pie season', 'give thanks', 'family', 'friendsgiving', 'hello fall', 'warm hearts', 'thank you', 'together', 'pumpkin spice', 'leftovers', 'gobble', 'full', 'home'],
      '20 Words to Hand-Letter for Thanksgiving — Fall Lettering Practice Ideas', 'Hand lettering ideas'],
    ['cran', 'still life · setups', '10 Thanksgiving <em>still life</em> setups to paint', 'studio-oil_stilllife', '50% 40%', ['three apples and a knife', 'a pie with one slice out', 'a candle, a pear, a napkin', 'squash on a linen cloth', 'a teacup and a cookie', 'a wine glass and grapes', 'corn cobs in a jug', 'a bread loaf, crumbs and all', 'leaves on a white plate', 'a jam jar against the light'],
      '10 Thanksgiving Still Life Setups to Paint — Fall Painting Ideas', 'Fall still life painting ideas'],
    ['olive', 'funny prompts', 'Draw your family as <em>Thanksgiving food</em>', 'details-pumpkin-bus-stop', '50% 50%', ['the one who’s always warm: gravy', 'the sweet one: pie', 'the dramatic one: the turkey', 'the reliable one: bread rolls', 'the tiny one: a cranberry', 'the spicy one: pepper', 'the late one: cold mashed potatoes', 'the loud one: a corn cob popping', 'the calm one: a cup of tea', 'you: the leftover sandwich', 'the pet: a dropped crumb', 'the guest: a mystery casserole'],
      'Draw Your Family as Thanksgiving Food — Funny Drawing Prompt List', 'Funny drawing prompts'],
  ];
  for (const [th, kick, h, key, pos, items, title, topic] of LISTS) add(th, (t, k) => {
    const two = items.length > 12, fs = two ? 28 : 36, rows = Math.ceil(items.length / 2);
    return { tpl: 'Темы', link: L('/prompts/', k), title,
      desc: `${plain(h).replace(/^./, c => c.toUpperCase())}: ${items.slice(0, 4).join(', ')}… The whole list is on this pin — save it and draw one a day. More free monthly prompt lists on pigeonpolly.com.`,
      alt: `A list: ${plain(h)}, next to an illustration by Pigeon Polly.`,
      topics: `Thanksgiving drawing ideas, ${topic}, Sketchbook prompts, Fall drawing prompts`,
      html: () => `<div class="fr" style="position:absolute;right:56px;top:58px;transform:rotate(3deg)">${img(A(key), 250, 250, pos)}</div>
        <div style="position:absolute;left:56px;right:56px;top:58px;bottom:180px;display:flex;flex-direction:column">
        <div style="margin-right:290px"><div class="kick">${kick}</div><h1 style="margin-top:18px">${h}</h1></div>
        <div style="flex:1;margin-top:36px;display:grid;align-content:space-evenly;${two ? `grid-template-columns:1.05fr 1fr;grid-auto-flow:column;grid-template-rows:repeat(${rows},auto);column-gap:30px` : 'grid-template-columns:1fr'}">
        ${items.map((s, i) => `<div style="display:flex;gap:12px;align-items:baseline;font:500 ${fs}px/1.2 Karla"><b style="font:600 ${fs}px Fraunces;color:${t.acc};min-width:42px">${i + 1}</b><span>${esc(s)}</span></div>`).join('')}</div></div>
        ${foot('More prompts', t)}` };
  });

  // ——— 3) страницы скетчбука с рамками ———
  const FR = [
    ['paper', 'My Thanksgiving <em>in 6 frames</em>', 'thanksgiving · comic page', ['before guests', 'the kitchen chaos', 'the table', 'the first bite', 'the food coma', 'goodnight'], 'studio-pbj', 'My Thanksgiving in 6 Frames — Sketchbook Comic Page Idea', 'a six-frame comic page'],
    ['cream', '<em>Leftovers week</em>: 6 days, 6 sketches', 'after thanksgiving', ['Fri · the sandwich', 'Sat · soup', 'Sun · pie for breakfast', 'Mon · the lunchbox', 'Tue · the last roll', 'Wed · an empty fridge shelf'], 'studio-cookies', 'Leftovers Week Sketch Challenge — 6 Days, 6 Small Drawings', 'a six-frame leftovers challenge page'],
    ['olive', '6 people <em>I’m thankful for</em>', 'gratitude · portrait page', ['family', 'a friend', 'a neighbour', 'a teacher', 'someone online', 'me'], 'studio-apple_creature', '6 People I’m Thankful For — Quick Portrait Sketchbook Page', 'a page of six quick portraits'],
    ['cran', 'Draw one thing <em>from each room</em>', 'thanksgiving at home', ['the kitchen', 'the dining table', 'the hallway', 'the sofa', 'the window', 'your bed'], 'details-tangerine-quilt', 'Draw One Thing from Each Room — Cozy Thanksgiving Sketchbook Page', 'a page with one frame for each room'],
    ['pumpkin', '<em>Thankful jar</em>: 8 tiny drawings', 'gratitude · sketchbook page', ['a smell', 'a sound', 'a taste', 'a colour', 'a word', 'a place', 'a moment', 'a person'], 'sketchbook-17', 'Thankful Jar Sketchbook Page — 8 Tiny Gratitude Drawings', 'a page of eight small gratitude frames'],
  ];
  for (const [th, h, kick, labels, key, title, what] of FR) add(th, (t, k) => {
    const cols = labels.length === 8 ? 3 : 2, cells = [...labels], art = `<div class="fr" style="height:${cols === 3 ? 240 : 230}px">${img(A(key), cols === 3 ? 280 : 430, cols === 3 ? 240 : 230, '50% 50%')}</div>`;
    const box = s => `<div style="height:${cols === 3 ? 240 : 290}px;border:3px dashed ${t.fg}44;border-radius:14px;background:${t.card};display:flex;align-items:flex-end;justify-content:center;padding:12px"><span class="hand" style="font-size:38px;text-align:center">${esc(s)}</span></div>`;
    const grid = cols === 3 ? [...cells.slice(0, 4).map(box), art, ...cells.slice(4).map(box)] : [...cells.map(box)];
    return { tpl: 'Скетчбук', link: L('/prompts/', k), title,
      desc: `A Thanksgiving sketchbook page idea: ${labels.join(', ')}. Five minutes per frame, pencil is enough. More free drawing prompts on pigeonpolly.com.`,
      alt: `Sketchbook layout: ${what}, labelled ${labels.join(', ')}${cols === 3 ? ', with an illustration by Pigeon Polly' : ''}.`,
      topics: 'Thanksgiving sketchbook, Sketchbook layout ideas, Gratitude journal ideas, Drawing prompts for adults',
      html: () => `${head(kick, h, cols === 3 ? 56 : 330)}
        ${cols === 2 ? `<div class="fr" style="position:absolute;right:56px;top:58px;transform:rotate(3deg)">${img(A(key), 250, 250)}</div>` : ''}
        <div style="position:absolute;left:56px;right:56px;top:${cols === 3 ? 370 : 400}px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:18px">${grid.join('')}</div>
        ${foot('More prompts', t)}` };
  });

  // ——— 4) бинго ———
  const BG = [
    ['cream', 'Thanksgiving <em>drawing bingo</em>', ['pie', 'a leaf', 'a candle', 'a mug', 'gravy', 'a hand', 'corn', 'a fork', 'a cat', 'a pumpkin', 'an apple', 'a napkin', 'FREE: draw a smile', 'a scarf', 'a roll', 'a window', 'a basket', 'a glass', 'a plate', 'a sock', 'a squash', 'a guest', 'an acorn', 'jam', 'the moon'], 'Thanksgiving Drawing Bingo — 25 Squares to Fill This Holiday Week'],
    ['cran', '<em>Friendsgiving</em> sketch bingo', ['a toast', 'paper plates', 'a board game', 'a selfie', 'a casserole', 'fairy lights', 'a coat pile', 'a laugh', 'a candle jar', 'a playlist', 'a pet', 'a spill', 'FREE: draw your host', 'a hug', 'a pie', 'a hat', 'shoes', 'a dessert', 'a napkin doodle', 'a glass', 'a balcony', 'a late guest', 'a takeaway box', 'a phone', 'goodbye'], 'Friendsgiving Sketch Bingo — 25 Fun Things to Draw at the Party'],
    ['olive', '<em>Gratitude</em> bingo for your sketchbook', ['a meal', 'a friend', 'a book', 'a pet', 'your bed', 'the sky', 'a song', 'a tool', 'FREE: draw yourself', 'a place', 'a smell', 'a teacher', 'a plant', 'a mug', 'a walk', 'today'], 'Gratitude Drawing Bingo — 16 Things You’re Thankful For'],
  ];
  for (const [th, h, cells, title] of BG) add(th, (t, k) => {
    const c = Math.sqrt(cells.length), sz = c === 5 ? 168 : 212;
    return { tpl: 'Темы', link: L('/prompts/', k), title,
      desc: `Draw one small thing in every square: ${cells.filter(x => !/FREE/.test(x)).slice(0, 6).join(', ')}… Get a line — or fill the whole card by Sunday. More free drawing prompts on pigeonpolly.com.`,
      alt: `A ${c}×${c} drawing bingo card for Thanksgiving with a small thing to draw in each square.`,
      topics: 'Thanksgiving activities, Drawing bingo, Sketchbook prompts, Fall drawing ideas',
      html: () => `${head('thanksgiving · bingo', h)}
        <div style="position:absolute;left:50%;transform:translateX(-50%);top:340px;display:grid;grid-template-columns:repeat(${c},${sz}px);gap:10px">
        ${cells.map(s => /FREE/.test(s) ? `<div style="height:${sz}px;border-radius:12px;background:${t.btn || t.acc};color:${t.btnFg || '#fff'};display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;font:700 34px/1 Caveat">${esc(s)}</div>` : `<div style="height:${sz}px;border-radius:12px;background:${t.card};border:2px solid ${t.fg}22;display:flex;align-items:flex-end;justify-content:center;text-align:center;padding:10px;font:600 ${c === 5 ? 23 : 27}px/1.1 Fraunces">${esc(s)}</div>`).join('')}</div>
        ${foot('More prompts', t)}` };
  });

  // ——— 5) POV / мемы с артами ———
  const POV = [
    ['cream', 'POV: you brought your <em>sketchbook</em> to Thanksgiving dinner', 'studio-cookies', '50% 50%', '“wait, don’t eat it yet — I’m drawing”', 'POV: You Brought Your Sketchbook to Thanksgiving Dinner — Artist Humor', 'milk and cookies'],
    ['cran', 'Me drawing the pie <em>instead of eating it</em>', 'studio-cupcake', '50% 50%', 'it was cold by the time I finished. worth it.', 'Me Drawing the Pie Instead of Eating It — Thanksgiving Artist Meme', 'a cherry cupcake'],
    ['olive', 'Thanksgiving guests when they hear <em>you’re an artist</em>', 'details-pumpkin-bus-stop', '50% 50%', '“can you draw me?” × 14', 'Thanksgiving Guests When They Hear You’re an Artist — Funny Art Meme', 'pumpkin-headed people at a bus stop'],
    ['paper', 'What I’m thankful for: <em>art supplies</em>', 'studio-moka_rust', '50% 50%', '…and coffee. mostly coffee.', 'What Artists Are Thankful For — Art Supplies and Coffee (Funny Pin)', 'a moka pot'],
    ['pumpkin', 'POV: the apple refused to <em>pose for the still life</em>', 'studio-apple_creature', '50% 35%', 'fine. I’ll draw you as you are.', 'POV: Your Still Life Apple Has Opinions — Funny Fall Drawing Meme', 'a creature with an apple head'],
  ];
  for (const [th, h, key, pos, cap, title, what] of POV) add(th, (t, k) => ({ tpl: 'Мем', link: L('/prompts/', k), title,
    desc: `${plain(h)} — ${cap} If you draw your holidays instead of photographing them, you’re among friends. Free drawing prompts for every month on pigeonpolly.com.`,
    alt: `Meme: “${plain(h)}” over a painting by Pigeon Polly of ${what}, captioned: ${cap.replace(/[“”]/g, '')}`,
    topics: 'Artist memes, Thanksgiving humor, Art humor, Sketchbook life',
    html: () => `${head('artist life · thanksgiving', h)}
      <div class="fr" style="position:absolute;left:56px;right:56px;top:390px;transform:rotate(-1.5deg)">${img(A(key), 888, 640, pos)}</div>
      <div class="hand" style="position:absolute;left:56px;right:56px;top:1080px;text-align:center;font-size:56px">${esc(cap)}</div>
      ${foot('Draw along', t)}` }));

  // ——— 6) цитаты (свои фразы Pigeon Polly) ———
  const Q = [
    ['cran', 'Grateful, full, and <em>slightly covered in paint.</em>', 'details-holiday-latte', 'Grateful, Full and Slightly Covered in Paint — Thanksgiving Quote for Artists'],
    ['cream', 'Be thankful for <em>small, joyful things</em> — and paint them.', 'sketchbook-17', 'Be Thankful for Small, Joyful Things — Cozy Thanksgiving Art Quote'],
    ['olive', 'A sketchbook is a <em>gratitude journal</em> with pictures.', 'details-train-window', 'A Sketchbook Is a Gratitude Journal with Pictures — Artist Quote'],
    ['pumpkin', 'Pie first. <em>Perfection never.</em>', 'studio-cupcake', 'Pie First, Perfection Never — Funny Thanksgiving Quote for Creatives'],
    ['paper', 'Thank you, ugly sketches. <em>You taught me everything.</em>', 'studio-pbj', 'Thank You, Ugly Sketches — Motivational Thanksgiving Quote for Artists'],
  ];
  for (const [th, q, key, title] of Q) add(th, (t, k) => ({ tpl: 'Арт', link: L('/prompts/', k), title,
    desc: `“${plain(q)}” — a small Thanksgiving thought from Pigeon Polly Art Lab. Save it for a slow, cozy week. Free drawing prompts and lessons on pigeonpolly.com.`,
    alt: `Quote “${plain(q)}” under a painting by Pigeon Polly.`,
    topics: 'Thanksgiving quotes, Artist quotes, Gratitude quotes, Creative motivation',
    html: () => `<div class="fr" style="position:absolute;left:0;right:0;top:0;border-radius:0">${img(A(key), 1000, 760)}</div>
      <div style="position:absolute;left:70px;right:70px;top:840px"><div class="kick">thanksgiving · pigeon polly</div>
      <div style="font:600 90px/1.05 Fraunces;letter-spacing:-.02em;margin-top:24px">${q.replace('<em>', `<em style="font-style:italic;font-weight:400;color:${t.acc}">`)}</div></div>
      ${foot('Draw along', t)}` }));

  if (n !== 1461) throw new Error('ожидалось до №1460, вышло ' + (n - 1));
  return out;
};
