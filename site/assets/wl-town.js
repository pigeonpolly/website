// Wobbleland: прогулка по городу (docs/wobbleland.md «Прогулка»). Клик по гербу на карте → пиксельная улица города,
// по ней гуляет птичка посетителя (birds.js; без входа — гостевая). Жители у своих дверей, главная достопримечательность,
// лавка с фирменными блюдами, доска праздников, указатели улиц, вокзал (поезд в другой город), зверушки и 5 находок
// в каждом городе (localStorage 'wl-found'). Всё рисуется кодом: фон — один раз на холст 1×, птичка — вдвое детальнее.
(() => {
  const D = window.WOBBLELAND;
  if (!D) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const C = D.cities, MP = D.map || { chars: [] };
  const T = {
    walk: ['🚶 Walk around town', '🚶 Прогуляться по городу', '🚶 Pastaigāties pa pilsētu'],
    about: ['📖 About', '📖 О городе', '📖 Par pilsētu'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    hello: [n => `Welcome to ${n}!`, n => `Добро пожаловать в ${n}!`, n => `Laipni lūdzam ${n}!`],
    howTo: ['Tap where to go (or use the arrow keys). Walk up to residents, the stall, the holiday board and the big sights — tap them or press Space.',
      'Нажимай, куда идти (или стрелки). Подходи к жителям, лавке, доске праздников и главной достопримечательности — нажми на них или пробел.',
      'Spied, kur iet (vai bultiņas). Pieej pie iedzīvotājiem, letes, svētku dēļa un galvenā apskates objekta — uzspied vai nospied atstarpi.'],
    hidden: [(n, w) => `Somewhere in town ${n} ${w} are hidden.`, (n, w) => `Где-то в городе спрятано ${n}: ${w}.`, (n, w) => `Kaut kur pilsētā paslēpti ${n}: ${w}.`],
    guest: ['Log in and your own bird will go for the walk.', 'Войди — и гулять будет твоя птичка.', 'Ielogojies — un pastaigāties dosies tavs putniņš.'],
    talk: ['Talk', 'Поговорить', 'Parunāt'], look: ['Look', 'Посмотреть', 'Apskatīt'],
    ring: ['Ring the bell', 'Позвонить в дверь', 'Piezvanīt pie durvīm'],
    lives: ['lives here', 'живёт здесь', 'dzīvo šeit'],
    stall: ['Market stall', 'Лавка', 'Tirgus lete'],
    stallHi: ['Fresh from the kitchen! What would you like to try?', 'Только что с кухни! Что попробуешь?', 'Tikko no virtuves! Ko nogaršosi?'],
    taste: ['Taste', 'Попробовать', 'Nogaršot'],
    yum: ['Yum! Your bird is very pleased.', 'Ням! Птичка очень довольна.', 'Mmm! Putniņš ir ļoti apmierināts.'],
    board: ['Holiday board', 'Доска праздников', 'Svētku dēlis'],
    noHol: ['No holidays here — the town is too busy reflecting.', 'Праздников нет — город слишком занят размышлениями.', 'Svētku nav — pilsēta ir pārāk aizņemta ar pārdomām.'],
    today: ['today!', 'сегодня!', 'šodien!'],
    inDays: [n => n === 1 ? 'tomorrow' : `in ${n} days`, n => n === 1 ? 'завтра' : `через ${n} дн.`, n => n === 1 ? 'rīt' : `pēc ${n} d.`],
    sign: ['Street sign', 'Указатель', 'Ielas zīme'],
    station: ['Station', 'Вокзал', 'Stacija'],
    where: ['Where to? The little red train goes everywhere.', 'Куда поедем? Красный паровозик ходит во все города.', 'Uz kurieni? Mazais sarkanais vilciņš brauc visur.'],
    map: ['🗺 Back to the map', '🗺 Обратно на карту', '🗺 Atpakaļ uz karti'],
    found: [(w, n, m) => `You found ${w}! ${n} of ${m}.`, (w, n, m) => `Нашлось: ${w}! ${n} из ${m}.`, (w, n, m) => `Atrasts: ${w}! ${n} no ${m}.`],
    allFound: ['That’s all of them. The town is impressed.', 'Это все! Город впечатлён.', 'Tas ir viss! Pilsēta ir pārsteigta.'],
    near: ['tap or Space', 'нажми или пробел', 'spied vai atstarpe'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tr = a => a[L] || a[0];

  // ---------- оформление городов ----------
  // sky — небо сверху/у горизонта, far — дальний план, walls/roofs — стены/крыши, roof — форма крыш, ground — мостовая,
  // crit — зверушка, pick — что спрятано, land — главная достопримечательность.
  const PICKS = {
    feather: [['seagull feathers', 'чаячьи перья', 'kaijas spalvas'], ['a seagull feather', 'чаячье перо', 'kaijas spalva']],
    leaf: [['golden maple leaves', 'золотые кленовые листья', 'zelta kļavu lapas'], ['a golden leaf', 'золотой листок', 'zelta lapa']],
    shell: [['tiny snail shells', 'крошечные ракушки улиток', 'sīki gliemežvāki'], ['a snail shell', 'ракушка улитки', 'gliemežvāks']],
    cone: [['pinecones', 'шишки', 'čiekuri'], ['a pinecone', 'шишка', 'čiekurs']],
    lemon: [['lost lemons', 'потерянные лимоны', 'pazaudēti citroni'], ['a lemon', 'лимон', 'citrons']],
    button: [['lost buttons', 'потерянные пуговицы', 'pazaudētas pogas'], ['a button — that means a new friend', 'пуговица — значит, будет новый друг', 'poga — tas nozīmē jaunu draugu']],
    noodle: [['lucky noodles', 'счастливые лапшинки', 'laimīgas nūdeles'], ['a lucky noodle', 'счастливая лапшинка', 'laimīga nūdele']],
    berry: [['runaway berries', 'сбежавшие ягоды', 'aizbēgušas ogas'], ['a berry', 'ягода', 'oga']],
    cheese: [['cheese crumbs', 'сырные крошки', 'siera drupačas'], ['a cheese crumb', 'сырная крошка', 'siera drupača']],
    sugar: [['sugar cubes', 'кусочки сахара', 'cukura gabaliņi'], ['a sugar cube', 'кусочек сахара', 'cukura gabaliņš']],
    page: [['lost confession pages', 'потерянные листы признаний', 'pazaudētas atzīšanās lapas'], ['a confession page', 'лист признания', 'atzīšanās lapa']],
  };
  const TH = {
    newwobbleton: { sky: ['#8FBDEB', '#E3F0FA'], far: 'sea', walls: ['#E9DCC4', '#D8C3A0', '#CFC2E2', '#F2E6D0', '#BFD3E6'], roofs: ['#4A5C8A', '#5B4A7A', '#3E6E8E', '#7A3E4A'], roof: 'gable', ground: ['#B9B2A6', '#A39C90', '#8E877C'], pave: 'cobble', crit: 'gull', pick: 'feather', land: 'clock' },
    maplewink: { sky: ['#F4B978', '#FCE6C2'], far: 'maples', walls: ['#F3DDB5', '#E8C795', '#E2B98A', '#F6E7CB'], roofs: ['#8E3B1F', '#A0522D', '#6B3A1E', '#B5652B'], roof: 'gable', ground: ['#A07E52', '#8A6A42', '#74583A'], pave: 'planks', crit: 'squirrel', pick: 'leaf', land: 'maple' },
    snailhollow: { sky: ['#A7C79C', '#E0EDD5'], far: 'moss', walls: ['#C9B48E', '#B7A27A', '#D6C7A2', '#A99B7C'], roofs: ['#5E7A3A', '#4E6B32', '#6F8C45'], roof: 'round', ground: ['#7E9A55', '#6B8746', '#58733A'], pave: 'moss', crit: 'snail', pick: 'shell', land: 'shell' },
    pinecrust: { sky: ['#AFCDE3', '#E9F2F7'], far: 'pines', walls: ['#B27B4C', '#9C6A40', '#C48D5A', '#E6CFA6'], roofs: ['#3F5A3A', '#5A3B26', '#2F4A33'], roof: 'steep', ground: ['#9A8466', '#857055', '#6E5C46'], pave: 'cobble', crit: 'squirrel', pick: 'cone', land: 'bakery' },
    lemonvale: { sky: ['#FFE27A', '#FFF6D2'], far: 'groves', walls: ['#FFF8E6', '#FBEFC6', '#F5E2A8', '#FFFDF4'], roofs: ['#D9733A', '#C9602E', '#E58C4A'], roof: 'flat', ground: ['#E7CF98', '#D8BC80', '#C4A66A'], pave: 'tiles', crit: 'butterfly', pick: 'lemon', land: 'lemontree' },
    buttonspire: { sky: ['#C6B4EC', '#F2EBFB'], far: 'roofs', walls: ['#F4D3DE', '#D6E6F5', '#E8E1F7', '#FCEBC9', '#D5EBDD'], roofs: ['#7A5BC2', '#C25B8C', '#4F8BC2', '#D99A3B'], roof: 'gable', ground: ['#C2B8CF', '#ADA2BB', '#958AA4'], pave: 'cobble', crit: 'pigeon', pick: 'button', land: 'buttons' },
    noodleford: { sky: ['#F09C58', '#FBDDA9'], far: 'roofs', walls: ['#F3E3C8', '#C8473A', '#E8D2AE', '#B23A31'], roofs: ['#3A3A4A', '#5A2D2D', '#2E3E4A'], roof: 'pagoda', ground: ['#A89A8A', '#948676', '#7D705F'], pave: 'tiles', crit: 'cat', pick: 'noodle', land: 'noodles', lanterns: 1 },
    jamshire: { sky: ['#F4AFC2', '#FDE7EE'], far: 'hills', walls: ['#FBE3E8', '#F6D2DA', '#FFF3EC', '#EBC6D6'], roofs: ['#9E2A4B', '#7A2648', '#B8436B', '#5E2A63'], roof: 'gable', ground: ['#CDB2A8', '#B89C92', '#A0857C'], pave: 'cobble', crit: 'bee', pick: 'berry', land: 'jam' },
    cheddarford: { sky: ['#B7DCF0', '#F1F8EA'], far: 'cliffs', walls: ['#F4E3A6', '#E9D08A', '#D9CFC0', '#F6ECCB'], roofs: ['#C9662E', '#A9552A', '#D98A2B'], roof: 'gable', ground: ['#B8AE9C', '#A39886', '#8A806F'], pave: 'slabs', crit: 'mouse', pick: 'cheese', land: 'bridge' },
    kettleford: { sky: ['#E5C29E', '#F8EADA'], far: 'roofs', walls: ['#B8573E', '#A54B36', '#EADBC4', '#C9694A'], roofs: ['#4E8E7E', '#3F7568', '#5A9C8A'], roof: 'gable', ground: ['#A8968A', '#928074', '#7A6A5F'], pave: 'cobble', crit: 'pigeon', pick: 'sugar', land: 'samovar' },
    department: { sky: ['#6E7488', '#AEB2BF'], far: 'fog', walls: ['#8D8F99', '#7C7E89', '#9A9CA6'], roofs: ['#3C3F4C', '#474A58'], roof: 'flat', ground: ['#80838E', '#6E717C', '#5D606A'], pave: 'slabs', crit: 'crow', pick: 'page', land: 'dept', rain: 1 },
  };
  const LAND = { // название достопримечательности, кнопка и что она отвечает
    clock: [['The Clock Tower', 'Часовая башня', 'Pulksteņa tornis'], ['🔔 Ring the bell', '🔔 Ударить в колокол', '🔔 Iesist zvanu'], ['BONG! The seagull guardians salute in perfect time.', 'БОМ! Чайки-стражи отдают честь точно в такт.', 'BOM! Kaiju sargi salutē precīzi laikā.']],
    maple: [['The Great Syrup Maple', 'Великий сиропный клён', 'Lielā sīrupa kļava'], ['🍁 Shake the branches', '🍁 Потрясти ветки', '🍁 Sapurināt zarus']],
    shell: [['The Old Shell House', 'Старый дом-раковина', 'Vecā gliemežvāka māja'], ['🐌 Knock (slowly)', '🐌 Постучать (медленно)', '🐌 Pieklauvēt (lēnām)']],
    bakery: [['Pie Bakery Under the Pines', 'Пекарня под соснами', 'Maiznīca zem priedēm'], ['🥧 Sniff the pies', '🥧 Понюхать пироги', '🥧 Paostīt pīrāgus']],
    lemontree: [['The Grandmother Lemon Tree', 'Лимонное дерево-бабушка', 'Vecmāmiņas citronkoks'], ['🍋 Shake the tree', '🍋 Потрясти дерево', '🍋 Sapurināt koku']],
    buttons: [['The Button Spire', 'Пуговичный шпиль', 'Pogu smaile'], ['✨ Polish a button', '✨ Начистить пуговицу', '✨ Nopulēt pogu']],
    noodles: [['The Lantern Noodle House', 'Лапшичная с фонариками', 'Laternu nūdeļu nams'], ['🍜 Slurp loudly', '🍜 Громко хлюпнуть', '🍜 Skaļi srēbt']],
    jam: [['The Great Jar', 'Большая банка', 'Lielā burka'], ['🫙 Pop the lid', '🫙 Открыть крышку', '🫙 Atvērt vāku']],
    bridge: [['The Cheese-Wheel Bridge', 'Мост сырных голов', 'Siera ripu tilts'], ['🧀 Roll a wheel', '🧀 Покатить сырную голову', '🧀 Ripināt siera ripu']],
    samovar: [['The Giant Copper Samovar', 'Гигантский медный самовар', 'Milzu vara samovārs'], ['♨️ Open the tap', '♨️ Открыть краник', '♨️ Atgriezt krāniņu']],
    dept: [['The Department building', 'Здание Департамента', 'Departamenta ēka'], ['✍️ Confess something', '✍️ В чём-нибудь признаться', '✍️ Kaut ko atzīties']],
  };
  const OK = { // ответ после действия у достопримечательности
    maple: ['Leaves everywhere. Someone will definitely start a leaf fight.', 'Листья повсюду. Кто-то точно начнёт битву листьями.', 'Lapas visur. Kāds noteikti sāks lapu kauju.'],
    shell: ['…', '…', '…'],
    bakery: ['It smells of pine and warm crust. Your bird is drooling a little.', 'Пахнет хвоей и тёплой корочкой. Птичка слегка пускает слюнки.', 'Smaržo pēc priedēm un silta garozas. Putniņam mazliet tek siekalas.'],
    lemontree: ['Bonk. A lemon. The tree has opinions.', 'Бум. Лимон. У дерева своё мнение.', 'Bums. Citrons. Kokam ir savs viedoklis.'],
    buttons: ['The spire sparkles. Somewhere a button came loose — good luck to someone!', 'Шпиль сверкает. Где-то отскочила пуговица — кому-то повезёт!', 'Smaile mirdz. Kaut kur atlēca poga — kādam paveiksies!'],
    noodles: ['SLUUURP. The whole street applauds.', 'ХЛЮЮЮП. Вся улица аплодирует.', 'SRRRRĒBT. Visa iela aplaudē.'],
    jam: ['Pop! Smells of strawberry and rhubarb-rose.', 'Чпок! Пахнет клубникой и ревенем с розой.', 'Plop! Smaržo pēc zemenēm un rabarberu rozes.'],
    bridge: ['The wheel rolls off to age in the caves. See you in two years.', 'Голова укатилась дозревать в пещеры. Увидимся через два года.', 'Ripa aizripoja nogatavoties alās. Tiksimies pēc diviem gadiem.'],
    samovar: ['Pshhhh! The whole square smells of tea. Somebody hands you a cup.', 'Пшшш! Вся площадь пахнет чаем. Кто-то протягивает чашку.', 'Pššš! Viss laukums smaržo pēc tējas. Kāds pasniedz tasi.'],
    dept: [['“I once ate the last pie and blamed a seagull.” — Not funny enough. Try again.', '“I sometimes read the ending of a book first.” — Accepted. You may leave.', '“I never return borrowed pencils.” — Noted. Stay for tea.'],
      ['«Однажды съела последний пирог и свалила на чайку». — Недостаточно смешно. Ещё раз.', '«Иногда читаю конец книги первым». — Принято. Можно идти.', '«Никогда не возвращаю чужие карандаши». — Записано. Останьтесь на чай.'],
      ['“Reiz apēdu pēdējo pīrāgu un vainoju kaiju.” — Nav pietiekami smieklīgi. Vēlreiz.', '“Dažreiz vispirms izlasu grāmatas beigas.” — Pieņemts. Vari iet.', '“Nekad neatdodu aizņemtos zīmuļus.” — Pierakstīts. Paliec uz tēju.']],
  };
  const CRIT = { // реплика, когда птичка подходит к зверушке
    gull: ['Squawk! (it wants your pastry)', 'Кья! (хочет твой пирожок)', 'Kliegt! (grib tavu pīrādziņu)'], squirrel: ['A squirrel. It saw nothing. It has no nuts.', 'Белка. Ничего не видела. Орехов нет.', 'Vāvere. Neko nav redzējusi. Riekstu nav.'],
    snail: ['The snail hides. It’ll come out next week.', 'Улитка спряталась. Выйдет на следующей неделе.', 'Gliemezis paslēpās. Iznāks nākamnedēļ.'], butterfly: ['A lemon butterfly lands on your bird’s head.', 'Лимонная бабочка садится птичке на голову.', 'Citrontauriņš nosēžas putniņam uz galvas.'],
    pigeon: ['Coo. A cousin!', 'Курлык. Родственник!', 'Kū. Radinieks!'], cat: ['The cat purrs and follows you for noodles.', 'Кот мурлычет и идёт за тобой — за лапшой.', 'Kaķis murrā un seko tev — nūdeļu dēļ.'],
    bee: ['Bzzz. It only wants the jam.', 'Жжж. Ей нужно только варенье.', 'Bzzz. Tai vajag tikai ievārījumu.'], mouse: ['A mouse with a cheese crumb. Respect.', 'Мышка с сырной крошкой. Уважаю.', 'Pele ar siera drupaču. Cieņa.'],
    crow: ['The crow takes notes. Everything is written down here.', 'Ворона что-то записывает. Здесь записывают всё.', 'Vārna kaut ko pieraksta. Šeit visu pieraksta.'],
  };
  // реплики старых жителей — те же, что облачка на карте (wobbleland.js SAY)
  const says = () => (window.PPWl && window.PPWl.SAY) || {};

  // ---------- мелочи ----------
  const rngOf = s => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) + 0x9E3779B9 | 0) >>> 0) / 4294967296; };
  const sh = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(v * k))); return '#' + [n >> 16, n >> 8 & 255, n & 255].map(v => f(v).toString(16).padStart(2, '0')).join(''); };
  const mix = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const rigaHour = () => +new Date().toLocaleString('en-GB', { timeZone: 'Europe/Riga', hour: '2-digit', hour12: false }) % 24;
  const store = { get() { try { return JSON.parse(localStorage.getItem('wl-found') || '{}'); } catch (e) { return {}; } }, set(v) { try { localStorage.setItem('wl-found', JSON.stringify(v)); } catch (e) {} } };

  const WW = 760, H = 180, BASE = 128, Y0 = 138, Y1 = 172, LX = 380; // ширина города, высота, линия домов, полоса прогулки, центр площади
  let ui = null, S = null, raf = 0;

  // ---------- рисование фона (холст 1×) ----------
  function painter(g) {
    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
    const ell = (cx, cy, rx, ry, c) => { for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y / ry) ** 2))); R(cx - w, cy + y, w * 2 + 1, 1, c); } };
    const tri = (cx, top, hw, h, c) => { for (let i = 0; i < h; i++) { const w = Math.round(hw * (i + 1) / h); R(cx - w, top + i, w * 2, 1, c); } };
    return { R, ell, tri };
  }

  function drawFar(g, th, night, rnd) {
    const { R, ell, tri } = painter(g), W = g.canvas.width;
    const sky = night ? ['#1B1B3A', '#3B3566'] : th.sky;
    for (let y = 0; y < BASE; y++) R(0, y, W, 1, mix(sky[0], sky[1], Math.min(1, y / 110)));
    if (night) for (let i = 0; i < 60; i++) R(rnd() * W, rnd() * 80, 1, 1, rnd() < .3 ? '#FFF3B0' : '#E8E4FF');
    const far = night ? c => mix(c, '#2A2850', .6) : c => c;
    const hz = 100;
    if (th.far === 'sea') {
      R(0, hz, W, BASE - hz, far('#3E7CC0'));
      for (let i = 0; i < 40; i++) R(rnd() * W, hz + 2 + rnd() * 20, 4 + rnd() * 6, 1, far('#8FC3EE'));
      const lx = W * .8; R(lx, hz - 30, 6, 30, far('#F2F0EA')); for (let k = 0; k < 4; k++) R(lx, hz - 26 + k * 7, 6, 3, far('#C8473A')); R(lx - 1, hz - 34, 8, 4, far('#3B3566')); R(lx + 1, hz - 33, 4, 2, '#FFE27A');
    } else if (th.far === 'maples' || th.far === 'pines' || th.far === 'groves' || th.far === 'moss') {
      const hill = { maples: '#C98A4A', pines: '#5E8A6A', groves: '#B9C96A', moss: '#7FA463' }[th.far];
      for (let x = 0; x < W; x++) R(x, hz - 8 + Math.sin(x / 37) * 5 + Math.sin(x / 13) * 2, 1, BASE, far(hill));
      for (let x = -10; x < W; x += 9 + rnd() * 12) {
        const y = hz - 4 + rnd() * 10;
        if (th.far === 'pines') { const h = 16 + rnd() * 14; tri(x, y - h, 5 + h / 6, h, far(rnd() < .5 ? '#2F5A43' : '#3C6B4F')); R(x - 1, y, 2, 3, far('#4A3424')); }
        else if (th.far === 'maples') { const c = ['#D9762B', '#E9A93B', '#B84A22', '#CF5A2A'][rnd() * 4 | 0]; R(x - 1, y, 2, 6, far('#6B4426')); ell(x, y - 5, 7, 6, far(c)); }
        else if (th.far === 'groves') { R(x, y, 1, 4, far('#6B5A2A')); ell(x, y - 3, 4, 3, far('#7EA640')); if (rnd() < .7) R(x + 1, y - 4, 1, 1, far('#FFE14A')); }
        else { ell(x, y + 2, 6, 4, far('#6A9455')); if (rnd() < .25) { R(x, y - 3, 1, 3, far('#F2EBD8')); R(x - 1, y - 4, 3, 1, far('#D9533A')); } }
      }
    } else if (th.far === 'roofs') {
      for (let x = 0; x < W;) { const w = 14 + rnd() * 22, h = 18 + rnd() * 26, c = far(mix(th.sky[0], '#4A3C6E', .45 + rnd() * .15)); R(x, hz + 10 - h, w, BASE, c); if (rnd() < .5) tri(x + w / 2, hz + 10 - h - 8, w / 2, 8, c); if (rnd() < .3) R(x + w / 2, hz - h - 14, 2, 8, c); x += w + 1; }
    } else if (th.far === 'cliffs') {
      for (let x = 0; x < W; x++) R(x, hz - 22 + Math.sin(x / 29) * 8 + (x % 40 < 3 ? 2 : 0), 1, BASE, far('#E2C46A'));
      for (let i = 0; i < 18; i++) ell(rnd() * W, hz - 6 + rnd() * 14, 3 + rnd() * 3, 2 + rnd() * 2, far('#B8963E'));
      R(0, hz + 12, W, BASE - hz - 12, far('#5E9FD0')); for (let i = 0; i < 30; i++) R(rnd() * W, hz + 14 + rnd() * 12, 5, 1, far('#A8D3F0'));
    } else if (th.far === 'fog') {
      for (let x = 0; x < W; x++) R(x, hz - 4 + Math.sin(x / 50) * 6, 1, BASE, far('#5E6273'));
      for (let i = 0; i < 6; i++) R(rnd() * W, hz - 12 + rnd() * 20, 40 + rnd() * 50, 2, far('#C3C6D0'));
    } else {
      for (let x = 0; x < W; x++) R(x, hz - 10 + Math.sin(x / 45) * 7, 1, BASE, far(mix(th.sky[0], '#6A4A7A', .35)));
    }
  }

  function drawHouse(g, x, w, h, wall, roof, style, rnd, night, o = {}) {
    const { R, ell, tri } = painter(g), top = BASE - h, dk = sh(wall, .82), lt = sh(wall, 1.08);
    R(x, top, w, h, wall); R(x, top, 1, h, lt); R(x + w - 1, top, 1, h, dk); R(x, BASE - 3, w, 3, dk);
    // крыша
    if (style === 'gable' || style === 'steep') {
      const rh = Math.round(style === 'steep' ? w * .7 : w * .42);
      for (let i = 0; i < rh; i++) { const ww = Math.round((w / 2 + 3) * (i + 1) / rh); R(x + w / 2 - ww, top - rh + i, ww * 2, 1, i % 3 === 2 ? sh(roof, .85) : roof); R(x + w / 2 - ww, top - rh + i, 1, 1, sh(roof, 1.25)); }
      R(x - 3, top - 1, w + 6, 2, sh(roof, .7));
      if (rnd() < .6) { const cx = x + w * (rnd() < .5 ? .25 : .7); R(cx, top - rh * .7 - 6, 4, 8, sh(wall, .7)); R(cx - 1, top - rh * .7 - 7, 6, 2, sh(roof, .6)); }
      if (style === 'steep' && rnd() < .5) { R(x + w / 2 - 3, top - rh * .45, 6, 5, '#F7E6B0'); R(x + w / 2, top - rh * .45, 1, 5, sh(roof, .6)); }
    } else if (style === 'round') {
      ell(x + w / 2, top, w / 2 + 2, Math.max(6, w * .35), roof);
      for (let i = 0; i < 6; i++) R(x + rnd() * w, top - rnd() * w * .3, 3, 1, sh(roof, 1.25));
      R(x - 2, top, w + 4, 2, sh(roof, .7));
    } else if (style === 'pagoda') {
      R(x - 5, top - 3, w + 10, 3, roof); R(x - 7, top - 5, 3, 3, roof); R(x + w + 4, top - 5, 3, 3, roof);
      R(x + 3, top - 12, w - 6, 9, sh(wall, .9)); R(x - 1, top - 14, w + 2, 3, roof); R(x - 3, top - 16, 3, 3, roof); R(x + w, top - 16, 3, 3, roof);
      R(x + w / 2 - 1, top - 20, 2, 6, sh(roof, .8));
    } else { // плоская
      R(x - 1, top - 3, w + 2, 3, roof); R(x - 1, top - 3, w + 2, 1, sh(roof, 1.2));
      if (rnd() < .5) { R(x + 3, top - 9, 8, 6, sh(wall, .95)); R(x + 3, top - 10, 8, 1, roof); }
    }
    // окна
    const cols = Math.max(1, Math.floor((w - 6) / 11)), rows = Math.max(1, Math.floor((h - 18) / 14)), gap = (w - cols * 7) / (cols + 1);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const wx = Math.round(x + gap + c * (7 + gap)), wy = top + 5 + r * 14;
      if (o.door != null && r === rows - 1 && Math.abs(wx + 3 - o.door) < 9) continue;
      const lit = night ? rnd() < .75 : false, glass = lit ? '#FFD86B' : '#9CC1DE';
      R(wx - 1, wy - 1, 9, 10, sh(wall, .7)); R(wx, wy, 7, 8, glass); R(wx + 3, wy, 1, 8, sh(wall, .75)); R(wx, wy + 4, 7, 1, sh(wall, .75));
      if (!lit) R(wx + 1, wy + 1, 1, 2, '#E6F2FB');
      if (style === 'pagoda' || o.shutters) { R(wx - 3, wy, 2, 8, roof); R(wx + 8, wy, 2, 8, roof); }
      R(wx - 1, wy + 9, 9, 1, sh(wall, .6));
      if (rnd() < .25 && !night) { R(wx, wy + 7, 7, 2, '#5E8A3A'); R(wx + 1, wy + 6, 1, 1, '#E8577A'); R(wx + 4, wy + 6, 1, 1, '#F2C94C'); }
    }
    // дверь
    const dx = o.door != null ? o.door - 4 : x + Math.round(w / 2) - 4;
    R(dx - 1, BASE - 15, 10, 15, sh(wall, .6)); R(dx, BASE - 14, 8, 14, o.doorC || sh(roof, .9)); R(dx + 6, BASE - 7, 1, 1, '#F2C94C');
    R(dx + 1, BASE - 13, 6, 1, sh(o.doorC || roof, 1.3)); R(dx - 2, BASE - 1, 12, 1, sh(wall, .5));
    return dx;
  }

  // ---------- главная достопримечательность (холст 1×, неподвижное) ----------
  function drawLand(g, th, night, rnd) {
    const { R, ell, tri } = painter(g), x = LX;
    const k = th.land;
    if (k === 'clock') {
      R(x - 16, 24, 32, BASE - 24, '#D8CBB0'); R(x - 16, 24, 2, BASE - 24, '#EDE3CF'); R(x + 14, 24, 2, BASE - 24, '#B5A68A');
      for (let y = 30; y < BASE; y += 6) R(x - 16, y, 32, 1, '#C4B697');
      tri(x, 0, 20, 24, '#4A5C8A'); R(x - 20, 23, 40, 3, '#33415F'); R(x - 1, -4, 2, 6, '#F2C94C');
      ell(x, 44, 11, 11, '#33415F'); ell(x, 44, 9, 9, '#FFFBEA');
      for (let i = 0; i < 12; i++) R(x + Math.round(Math.sin(i / 6 * Math.PI) * 8), 44 - Math.round(Math.cos(i / 6 * Math.PI) * 8), 1, 1, '#33415F');
      R(x - 6, 66, 12, 12, '#33415F'); ell(x, 66, 6, 4, '#33415F'); R(x - 2, 70, 4, 6, '#F2C94C');
      R(x - 7, BASE - 22, 14, 22, '#5B4A7A'); ell(x, BASE - 22, 7, 5, '#5B4A7A'); R(x - 1, BASE - 24, 2, 24, '#4A3C66');
      // флаги-чайки
      R(x - 30, 60, 1, BASE - 60, '#7A6A55'); R(x - 29, 60, 8, 5, '#C8473A'); R(x + 30, 60, 1, BASE - 60, '#7A6A55'); R(x + 31, 60, 8, 5, '#4A5C8A');
    } else if (k === 'maple') {
      R(x - 6, 60, 12, BASE - 60, '#6B4426'); R(x - 6, 60, 3, BASE - 60, '#835532'); R(x - 14, BASE - 6, 28, 6, '#5A381F');
      for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI, r = 18 + rnd() * 30; ell(x + Math.cos(a) * r * 1.4, 54 - Math.sin(a) * r * .8, 8 + rnd() * 8, 6 + rnd() * 6, ['#D9762B', '#E9A93B', '#B84A22', '#F0B13A', '#CF5A2A'][i % 5]); }
      for (const bx of [-6, 5]) { R(x + bx, 92, 3, 2, '#BFC3C9'); R(x + bx - 1, 96, 5, 7, '#A7ACB3'); R(x + bx, 97, 3, 2, '#C9862E'); }
    } else if (k === 'shell') {
      for (let r = 40; r > 4; r -= 1) ell(x + (40 - r) * .35, BASE - 40 + (40 - r) * .2, r, r * .95, r % 6 < 3 ? '#C98A4A' : '#E0A86A');
      ell(x + 13, BASE - 26, 7, 5, '#F5D7A0'); R(x - 34, BASE - 12, 70, 12, '#8BA35A');
      R(x - 8, BASE - 18, 10, 18, '#5A3B26'); ell(x - 3, BASE - 18, 5, 4, '#5A3B26'); R(x - 7, BASE - 16, 8, 1, '#7A5434');
      for (let i = 0; i < 14; i++) R(x - 40 + rnd() * 80, BASE - 50 + rnd() * 40, 3, 2, '#6F8C45');
      R(x + 22, BASE - 30, 6, 6, night ? '#FFD86B' : '#9CC1DE'); R(x + 21, BASE - 31, 8, 1, '#5A3B26');
    } else if (k === 'bakery') {
      const w = 64; drawHouse(g, x - w / 2, w, 56, '#C48D5A', '#5A3B26', 'steep', rnd, night, { door: x, doorC: '#7A3A1E' });
      ell(x, BASE - 98, 16, 6, '#E0A050'); ell(x, BASE - 100, 14, 4, '#F2C27B'); for (let i = -10; i <= 10; i += 5) R(x + i, BASE - 102, 2, 1, '#B5652B');
      R(x - 24, BASE - 50, 48, 7, '#F7E6B0'); for (let i = 0; i < 6; i++) R(x - 22 + i * 8, BASE - 49, 4, 5, i % 2 ? '#B84A22' : '#E0A050');
    } else if (k === 'lemontree') {
      R(x - 5, 64, 10, BASE - 64, '#7A5A34'); R(x - 18, BASE - 4, 36, 4, '#8E6A3A');
      for (let i = 0; i < 20; i++) { const a = rnd() * Math.PI, r = 14 + rnd() * 28; ell(x + Math.cos(a) * r * 1.3, 58 - Math.sin(a) * r * .8, 9 + rnd() * 6, 6 + rnd() * 5, ['#6E9A3A', '#7EAE44', '#5C8A32'][i % 3]); }
      for (let i = 0; i < 16; i++) { const lx = x - 40 + rnd() * 80, ly = 30 + rnd() * 40; ell(lx, ly, 2, 2, '#FFE14A'); R(lx - 1, ly - 1, 1, 1, '#FFF6B0'); }
      R(x + 20, BASE - 18, 18, 18, '#F5E2A8'); R(x + 18, BASE - 20, 22, 3, '#D9733A'); R(x + 23, BASE - 13, 12, 9, '#FFE14A');
    } else if (k === 'buttons') {
      R(x - 12, 18, 24, BASE - 18, '#E8E1F7'); R(x - 12, 18, 2, BASE - 18, '#FFFFFF'); R(x + 10, 18, 2, BASE - 18, '#BDB2D6');
      tri(x, -6, 15, 24, '#7A5BC2'); R(x - 1, -10, 2, 6, '#F2C94C');
      const cols = ['#C25B8C', '#4F8BC2', '#D99A3B', '#5E9A5A', '#9B5DE5', '#E0443A'];
      for (let y = 24; y < BASE - 20; y += 9) for (let i = -1; i <= 1; i++) { const bx = x + i * 7 + (y % 18 ? 3 : 0), c = cols[(y + i * 3) % 6]; ell(bx, y, 3, 3, c); R(bx - 1, y - 1, 1, 1, '#2B1A51'); R(bx + 1, y - 1, 1, 1, '#2B1A51'); R(bx - 1, y + 1, 1, 1, '#2B1A51'); R(bx + 1, y + 1, 1, 1, '#2B1A51'); }
      R(x - 6, BASE - 16, 12, 16, '#5B4A7A'); ell(x, BASE - 16, 6, 4, '#5B4A7A');
    } else if (k === 'noodles') {
      drawHouse(g, x - 36, 72, 60, '#C8473A', '#3A3A4A', 'pagoda', rnd, night, { door: x, doorC: '#F2C94C' });
      R(x - 16, BASE - 52, 32, 9, '#3A3A4A'); for (let i = 0; i < 5; i++) R(x - 12 + i * 6, BASE - 50, 3, 5, '#F2C94C');
      for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) R(x - 34 + i * 8 + (j % 2), BASE - 40 + j * 2, 1, 1, '#F6E3A8');
    } else if (k === 'jam') {
      R(x - 22, 46, 44, BASE - 46, '#D84A6E'); R(x - 22, 46, 4, BASE - 46, '#F08BA8'); R(x + 18, 46, 4, BASE - 46, '#A82E52');
      R(x - 20, 40, 40, 6, '#F6D2DA'); R(x - 24, 34, 48, 7, '#E8C46A'); for (let i = -22; i < 24; i += 4) R(x + i, 34, 2, 7, '#C9A24A');
      R(x - 14, 62, 28, 22, '#FFF3EC'); R(x - 14, 62, 28, 2, '#C9A24A'); R(x - 10, 68, 20, 2, '#9E2A4B'); R(x - 8, 73, 16, 1, '#9E2A4B'); R(x - 10, 77, 20, 1, '#9E2A4B');
      for (let i = 0; i < 8; i++) R(x - 18 + rnd() * 36, 90 + rnd() * 30, 3, 3, '#F08BA8');
      for (const ox of [-46, 34]) { R(x + ox, BASE - 24, 12, 24, '#7A4A2E'); for (let s = 0; s < 3; s++) { R(x + ox, BASE - 24 + s * 8, 12, 1, '#5A3420'); R(x + ox + 2, BASE - 23 + s * 8, 3, 6, ['#D84A6E', '#9B5DE5', '#E9A93B'][s]); R(x + ox + 7, BASE - 23 + s * 8, 3, 6, ['#E0443A', '#F08BA8', '#7A2648'][s]); } }
    } else if (k === 'bridge') {
      R(x - 62, BASE - 26, 124, 26, '#5E9FD0'); for (let i = 0; i < 20; i++) R(x - 60 + rnd() * 116, BASE - 22 + rnd() * 20, 6, 1, '#A8D3F0');
      for (let i = -60; i <= 60; i++) { const y = BASE - 22 - Math.round(Math.cos(i / 60 * Math.PI / 2) * 22); R(x + i, y, 1, 5, '#C9B48E'); R(x + i, y, 1, 1, '#E6D4AE'); }
      for (const cx of [-40, 0, 40]) { ell(x + cx, BASE - 36 - (cx ? 0 : 6), 7, 7, '#F2C94C'); ell(x + cx, BASE - 36 - (cx ? 0 : 6), 4, 4, '#E0A83A'); R(x + cx - 1, BASE - 37 - (cx ? 0 : 6), 2, 2, '#FFE88A'); }
      for (const px of [-60, 58]) R(x + px, BASE - 30, 3, 30, '#A69276');
      R(x - 54, BASE - 4, 108, 4, '#A69276');
    } else if (k === 'samovar') {
      R(x - 24, BASE - 8, 48, 8, '#7A4A2E');
      ell(x, BASE - 40, 22, 28, '#C8743A'); ell(x - 6, BASE - 48, 6, 14, '#E89A5A'); ell(x + 12, BASE - 36, 5, 16, '#A85A2A');
      R(x - 14, BASE - 70, 28, 6, '#A85A2A'); R(x - 8, BASE - 84, 16, 14, '#C8743A'); R(x - 10, BASE - 86, 20, 3, '#E89A5A'); ell(x, BASE - 90, 6, 4, '#D9B04A'); R(x - 1, BASE - 96, 2, 4, '#D9B04A');
      R(x - 30, BASE - 48, 8, 3, '#A85A2A'); R(x + 22, BASE - 48, 8, 3, '#A85A2A'); R(x - 32, BASE - 48, 3, 10, '#A85A2A'); R(x + 29, BASE - 48, 3, 10, '#A85A2A');
      R(x - 2, BASE - 22, 10, 3, '#D9B04A'); R(x + 6, BASE - 22, 2, 6, '#D9B04A');
      // турка рядом
      R(x + 40, BASE - 20, 12, 18, '#B8622E'); R(x + 38, BASE - 22, 16, 3, '#D98A4A'); R(x + 52, BASE - 18, 14, 3, '#7A4A2E'); R(x + 41, BASE - 18, 3, 14, '#D98A4A');
    } else if (k === 'dept') {
      R(x - 50, 30, 100, BASE - 30, '#6E717C'); R(x - 50, 30, 100, 2, '#9A9CA6');
      for (let y = 36; y < BASE; y += 5) for (let i = 0; i < 10; i++) R(x - 50 + i * 10 + (y % 10 ? 5 : 0), y, 1, 5, '#5D606A');
      R(x - 54, 24, 108, 7, '#3C3F4C'); tri(x, 6, 30, 18, '#3C3F4C');
      for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const wx = x - 42 + c * 18, wy = 40 + r * 22; R(wx, wy, 10, 12, night ? '#E8C86A' : '#2E3040'); for (let b = 2; b < 10; b += 3) R(wx + b, wy, 1, 12, '#9A9CA6'); }
      R(x - 9, BASE - 22, 18, 22, '#2E3040'); ell(x, BASE - 22, 9, 6, '#2E3040'); R(x - 1, BASE - 26, 2, 26, '#45485A');
      R(x - 28, 32, 56, 6, '#DADCE2'); for (let i = 0; i < 12; i++) R(x - 25 + i * 4.4, 34, 3, 2, '#3C3F4C');
    }
  }

  // ---------- лавка, доска, вокзал, указатель ----------
  function drawStall(g, x, th, dishes) {
    const { R } = painter(g), c1 = th.roofs[0], w = 44;
    R(x - w / 2, BASE - 18, w, 18, '#8A5A34'); R(x - w / 2, BASE - 18, w, 3, '#A8754A');
    for (const px of [-w / 2, w / 2 - 2]) R(x + px, BASE - 40, 2, 22, '#6B4426');
    for (let i = 0; i < 11; i++) { R(x - w / 2 - 2 + i * 4.4, BASE - 44, 5, 7, i % 2 ? '#FFFDF5' : c1); R(x - w / 2 - 2 + i * 4.4, BASE - 37, 5, 2, i % 2 ? '#E8E2D2' : sh(c1, .75)); }
    dishes.slice(0, 3).forEach((im, i) => { if (im) g.drawImage(im, x - 19 + i * 13, BASE - 31, 14, 12); });
  }
  function drawBoard(g, x) {
    const { R } = painter(g);
    R(x - 2, BASE - 34, 2, 34, '#6B4426'); R(x + 20, BASE - 34, 2, 34, '#6B4426');
    R(x - 4, BASE - 40, 30, 24, '#8A5A34'); R(x - 2, BASE - 38, 26, 20, '#B98A5A');
    [['#FFFDF5', 0, 0], ['#FDE7EE', 13, 2], ['#FFF3C4', 3, 10], ['#E3F0FA', 14, 11]].forEach(([c, ox, oy]) => { R(x + ox, BASE - 37 + oy, 9, 8, c); R(x + ox + 4, BASE - 37 + oy, 1, 1, '#C8473A'); R(x + ox + 2, BASE - 34 + oy, 5, 1, '#B5A68A'); R(x + ox + 2, BASE - 32 + oy, 4, 1, '#B5A68A'); });
  }
  function drawStation(g, crest) {
    const { R, tri } = painter(g);
    R(4, BASE - 6, 92, 6, '#7A6A5F'); R(4, BASE - 6, 92, 1, '#A8968A');
    for (const px of [10, 50, 88]) R(px, BASE - 40, 2, 34, '#5B4A7A');
    R(2, BASE - 46, 96, 6, '#C8473A'); for (let i = 0; i < 12; i++) R(2 + i * 8, BASE - 40, 8, 3, i % 2 ? '#FFFDF5' : '#C8473A');
    R(26, BASE - 38, 28, 16, '#2B1A51'); R(27, BASE - 37, 26, 14, '#FFFDF5'); if (crest) g.drawImage(crest, 33, BASE - 37, 13, 15);
    R(60, BASE - 16, 22, 3, '#8A5A34'); R(61, BASE - 13, 2, 7, '#6B4426'); R(78, BASE - 13, 2, 7, '#6B4426'); R(60, BASE - 22, 22, 2, '#8A5A34');
    // паровозик
    R(-30, BASE - 22, 26, 14, '#C8473A'); R(-12, BASE - 30, 8, 10, '#2B1A51'); R(-28, BASE - 20, 6, 5, '#FFE27A');
  }
  function drawSign(g, x, c) {
    const { R } = painter(g);
    R(x, BASE - 30, 2, 30, '#5A5A66'); R(x - 10, BASE - 30, 22, 7, c); R(x - 10, BASE - 30, 22, 1, sh(c, 1.3)); R(x - 7, BASE - 27, 16, 1, '#FFFDF5');
  }
  function drawLamp(g, x) { const { R } = painter(g); R(x, BASE - 30, 2, 30, '#3C3F4C'); R(x - 2, BASE - 36, 6, 6, '#3C3F4C'); R(x - 1, BASE - 35, 4, 4, '#FFE7A3'); }

  function drawGround(g, th, rnd) {
    const { R, ell } = painter(g), [a, b, c] = th.ground;
    R(0, BASE, WW, H - BASE, a); R(0, BASE, WW, 3, c);
    for (let y = BASE + 4; y < H - 4; y += 4) {
      for (let x = (y / 4 % 2) * 4; x < WW; x += 8) {
        if (th.pave === 'cobble') { R(x, y, 7, 3, b); R(x, y, 6, 1, sh(a, 1.06)); }
        else if (th.pave === 'planks') { if (x % 24 === 0) R(x, y, 1, 4, c); R(x, y + 3, 8, 1, b); }
        else if (th.pave === 'tiles') { R(x, y, 8, 1, b); R(x, y, 1, 4, b); if ((x + y) % 24 === 0) R(x + 2, y + 1, 4, 2, sh(a, 1.08)); }
        else if (th.pave === 'slabs') { if (y % 8 === 0) R(x, y, 16, 1, b); if ((x + y) % 16 === 0) R(x, y, 1, 8, b); }
        else if (rnd() < .5) ell(x + rnd() * 6, y + rnd() * 3, 2 + rnd() * 3, 1, b);
      }
    }
    if (th.pave === 'moss') for (let i = 0; i < 30; i++) { const x = rnd() * WW, y = BASE + 8 + rnd() * 40; R(x, y - 3, 1, 3, '#F2EBD8'); R(x - 1, y - 4, 3, 1, rnd() < .5 ? '#D9533A' : '#E9A93B'); }
    R(0, H - 5, WW, 5, c); R(0, H - 5, WW, 1, sh(c, 1.2));
  }

  // ---------- город: собрать сцену ----------
  async function build(key) {
    const c = C.find(x => x.key === key), th = TH[key] || TH.newwobbleton, rnd = rngOf(key), night = !th.rain && (rigaHour() >= 21 || rigaHour() < 7);
    const res = c.residents.map((r, ri) => ({ r, who: ((MP.chars || []).find(ch => ch.city === key && ch.ri === ri) || {}).who }));
    const [crest, ...rest] = await Promise.all([loadImg(`/images/wobbleland/crest-${key}.png`),
      ...c.dishes.map((d, i) => loadImg(`/images/wobbleland/dish-${key}-${i}.png`)),
      ...res.map(x => x.who ? loadImg(`/images/wobbleland/ch-${x.who}.png`) : null)]);
    const dishImg = rest.slice(0, c.dishes.length), resImg = rest.slice(c.dishes.length);
    const far = document.createElement('canvas'); far.width = Math.ceil(WW * .5 + 440); far.height = BASE;
    drawFar(far.getContext('2d'), th, night, rnd);
    const near = document.createElement('canvas'); near.width = WW; near.height = H;
    const g = near.getContext('2d');
    drawGround(g, th, rnd);
    const spots = [];
    // дома слева и справа от площади; жители — по очереди в дома
    const slots = [], gapL = [104, LX - 98], gapR = [LX + 108, WW - 6];
    for (const [a, b] of [gapL, gapR]) { let x = a; while (x < b - 30) { const w = Math.min(b - x, 34 + Math.round(rnd() * 20)); if (w < 30) break; slots.push({ x, w }); x += w + 4 + Math.round(rnd() * 6); } }
    const resSlots = [...slots.keys()].sort((p, q) => Math.abs(slots[p].x + slots[p].w / 2 - LX) - Math.abs(slots[q].x + slots[q].w / 2 - LX));
    const owner = {}, spread = slots.length >= res.length * 2; res.forEach((x, i) => { const k = resSlots[spread ? i * 2 + 1 : i]; if (k != null) owner[k] = i; });
    slots.forEach((s, i) => {
      const h = 46 + Math.round(rnd() * 26), wall = th.walls[rnd() * th.walls.length | 0], roof = th.roofs[rnd() * th.roofs.length | 0];
      const door = s.x + 8 + Math.round(rnd() * (s.w - 16));
      drawHouse(g, s.x, s.w, h, wall, roof, th.roof, rnd, night, { door });
      if (th.lanterns) for (let k = 0; k < 3; k++) { const lx = s.x + 6 + k * (s.w - 12) / 2; painter(g).R(lx, BASE - h + 4, 3, 4, '#E0443A'); painter(g).R(lx + 1, BASE - h + 8, 1, 2, '#F2C94C'); }
      if (owner[i] != null) { const ri = owner[i], rr = res[ri]; spots.push({ kind: 'res', x: door, w: 18, door, top: BASE - 20, r: rr.r, who: rr.who, im: resImg[ri], name: rr.r.name }); }
    });
    // фонари между домами
    for (let x = 120; x < WW; x += 96) if (Math.abs(x - LX) > 80) drawLamp(g, x);
    drawLand(g, th, night, rnd);
    spots.push({ kind: 'land', x: LX, w: 60, top: 20, name: tr(LAND[th.land][0]) });
    const stallX = LX + 82, boardX = LX - 86;
    drawStall(g, stallX, th, dishImg); if (c.dishes.length) spots.push({ kind: 'stall', x: stallX, w: 44, top: BASE - 46, name: t('stall') });
    drawBoard(g, boardX); spots.push({ kind: 'board', x: boardX + 11, w: 30, top: BASE - 42, name: t('board') });
    drawStation(g, crest); spots.push({ kind: 'station', x: 50, w: 90, top: BASE - 48, name: t('station') });
    // указатели улиц — в просветах между домами
    const gaps = []; for (let i = 1; i < slots.length; i++) { const a = slots[i - 1].x + slots[i - 1].w, b = slots[i].x; if (b - a >= 4 && b - a < 30) gaps.push((a + b) / 2 | 0); }
    c.streets.forEach((st, i) => { const x = gaps.length ? gaps[Math.floor((i + .5) * gaps.length / c.streets.length)] : 100 + i * 60; drawSign(g, x - 1, th.roofs[i % th.roofs.length]); spots.push({ kind: 'sign', x, w: 14, top: BASE - 32, name: st.name, st }); });
    // зверушки и находки
    const crits = []; const nC = th.crit === 'snail' ? 4 : th.crit === 'bee' || th.crit === 'butterfly' ? 5 : 3;
    for (let i = 0; i < nC; i++) crits.push({ type: th.crit, x: 140 + rnd() * (WW - 200), y: Y0 + rnd() * (Y1 - Y0), dir: rnd() < .5 ? 1 : -1, t: rnd() * 5, st: 'walk', tx: null, ty: null, ph: rnd() * 6, home: 0 });
    const found = store.get()[key] || [];
    const picks = []; for (let i = 0; i < 5; i++) picks.push({ i, x: 130 + i * (WW - 200) / 5 + rnd() * 60, y: Y0 + 4 + rnd() * (Y1 - Y0 - 6), got: found.includes(i) });
    return { c, th, key, night, far, nearC: near, spots, crits, picks, crest, dishImg, rnd: rngOf(key + Date.now()) };
  }

  // ---------- птичка ----------
  const GUEST = 27;
  function birdHD() {
    const B = window.PPBirds; if (!B || !B.spriteHD) return null;
    const u = window.PPWho && window.PPWho.user, lk = u && u.id != null ? B.dress(B.looks(u.id), u.avatar) : B.looks(GUEST);
    return { hd: [0, 1, lk.kind === 'cat' ? 0 : 2].map(f => B.spriteHD(lk, f)), cat: lk.kind === 'cat', guest: !(u && u.id != null) };
  }

  // ---------- окно ----------
  function mountUI() {
    const el = document.createElement('div');
    el.className = 'wl-tw'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.hidden = true;
    el.innerHTML = `<div class="wl-tw-box">
      <header class="wl-tw-head"><img class="wl-tw-crest" alt=""><div class="wl-tw-name"><b></b><span></span></div>
        <button type="button" class="wl-tw-about">${t('about')}</button><button type="button" class="wl-tw-x" aria-label="${t('close')}">✕</button></header>
      <div class="wl-tw-stage"><canvas></canvas><div class="wl-tw-tag" aria-hidden="true"></div><div class="wl-tw-found" aria-hidden="true"></div></div>
      <div class="wl-tw-say" aria-live="polite"></div></div>`;
    document.body.appendChild(el);
    const q = s => el.querySelector(s);
    ui = { el, cv: q('canvas'), stage: q('.wl-tw-stage'), tag: q('.wl-tw-tag'), say: q('.wl-tw-say'), found: q('.wl-tw-found'), crest: q('.wl-tw-crest'), name: q('.wl-tw-name b'), motto: q('.wl-tw-name span') };
    q('.wl-tw-x').onclick = close;
    q('.wl-tw-about').onclick = () => { const k = S && S.key; close(); if (k && window.PPWl) window.PPWl.openCity(k); };
    el.addEventListener('click', e => { if (e.target === el) close(); });
    ui.cv.addEventListener('pointerdown', onTap);
    addEventListener('resize', () => S && fit());
    document.addEventListener('keydown', e => {
      if (!S || el.hidden) return;
      if (e.key === 'Escape') { close(); e.stopImmediatePropagation(); return; }
      if (e.target.closest && e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;
      const k = { ArrowLeft: 'l', a: 'l', ArrowRight: 'r', d: 'r', ArrowUp: 'u', w: 'u', ArrowDown: 'n', s: 'n' }[e.key];
      if (k) { S.keys[k] = 1; S.bird.goal = null; S.bird.pending = null; e.preventDefault(); e.stopImmediatePropagation(); }
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'e') { const n = nearest(); if (n) interact(n); e.preventDefault(); }
    }, true);
    document.addEventListener('keyup', e => { if (!S) return; const k = { ArrowLeft: 'l', a: 'l', ArrowRight: 'r', d: 'r', ArrowUp: 'u', w: 'u', ArrowDown: 'n', s: 'n' }[e.key]; if (k) S.keys[k] = 0; });
  }

  function fit() {
    const r = ui.stage.getBoundingClientRect();
    S.vw = Math.max(140, Math.min(440, Math.round(H * r.width / Math.max(1, r.height))));
    ui.cv.width = S.vw * 2; ui.cv.height = H * 2;
    S.ctx = ui.cv.getContext('2d'); S.ctx.imageSmoothingEnabled = false;
  }

  async function open(key, o = {}) {
    if (!C.find(x => x.key === key)) return;
    if (!ui) mountUI();
    const c = C.find(x => x.key === key);
    ui.el.hidden = false; document.body.classList.add('modal-open');
    ui.crest.src = `/images/wobbleland/crest-${key}.png`; ui.name.textContent = c.name; ui.motto.textContent = '“' + c.motto + '”';
    ui.el.setAttribute('aria-label', c.name);
    ui.say.innerHTML = ''; ui.tag.classList.remove('on');
    const sc = await build(key);
    const bird = { x: o.x ?? 64, y: 152, dir: 1, anim: 0, pose: 'idle', goal: null, pending: null, idle: 0, hop: 0, ...(birdHD() || {}) };
    cancelAnimationFrame(raf);
    S = { ...sc, bird, keys: {}, cam: 0, fx: [], last: performance.now(), near: null, msgT: 0, landT: 0 };
    fit();
    S.cam = Math.max(0, Math.min(WW - S.vw, bird.x - S.vw / 2));
    countFound();
    welcome();
    if (!o.fromHash) history.replaceState(null, '', '#walk-' + key);
    raf = requestAnimationFrame(loop);
    ui.el.querySelector('.wl-tw-x').focus({ preventScroll: true });
  }
  function close() {
    if (!ui || ui.el.hidden) return;
    cancelAnimationFrame(raf); ui.el.hidden = true; S = null;
    if (!document.querySelector('.wl-panel.open')) document.body.classList.remove('modal-open');
    if (location.hash.startsWith('#walk-')) history.replaceState(null, '', location.pathname);
  }

  // ---------- текст под сценой ----------
  const sayHTML = (html, cls = '') => { ui.say.className = 'wl-tw-say ' + cls; ui.say.innerHTML = html; };
  function welcome() {
    const p = PICKS[S.th.pick], left = S.picks.filter(x => !x.got).length;
    sayHTML(`<p class="wl-tw-t">${esc(t('hello', S.c.name))}</p><p>${esc(t('howTo'))}</p>` +
      (left ? `<p>🔎 ${esc(t('hidden', left, tr(p[0])))}</p>` : '') + (S.bird.guest ? `<p class="wl-tw-note">🐣 ${esc(t('guest'))}</p>` : ''));
  }
  function countFound() { const n = S.picks.filter(x => x.got).length; ui.found.textContent = `🔎 ${n}/5`; ui.found.classList.toggle('done', n === 5); }
  const portrait = s => s.r && s.r.key ? `/images/wobbleland/pt-${s.r.key}.png` : s.who ? `/images/wobbleland/ch-${s.who}.png` : '';
  function interact(s) {
    const b = S.bird; b.dir = s.x >= b.x ? 1 : -1; b.goal = null; b.pending = null;
    const c = S.c, th = S.th;
    if (s.kind === 'res') {
      const SAY = says(), list = s.who && SAY[s.who] ? SAY[s.who][L] : null, line = list ? list[S.rnd() * list.length | 0] : [s.r.job, s.r.trait].filter(Boolean).join('. ');
      s.open = 4; burst(s.door, BASE - 22, 'heart', 3);
      sayHTML(`<div class="wl-tw-who">${portrait(s) ? `<img src="${portrait(s)}" alt="">` : ''}<div><p class="wl-tw-t">${esc(s.name)}</p>${s.r.home ? `<p class="wl-tw-sub">🏠 ${esc(s.r.home)}</p>` : ''}<p>${esc(line || s.r.note || '')}</p></div></div>`);
    } else if (s.kind === 'land') {
      const [nm, act] = LAND[th.land];
      sayHTML(`<p class="wl-tw-t">${esc(tr(nm))}</p><p>${esc(c.desc)}</p><p><button type="button" class="wl-tw-btn" data-land>${esc(tr(act))}</button></p>`);
      ui.say.querySelector('[data-land]').onclick = landAct;
    } else if (s.kind === 'stall') {
      sayHTML(`<p class="wl-tw-t">🧺 ${esc(t('stall'))}</p><p>${esc(t('stallHi'))}</p><div class="wl-tw-dishes">${c.dishes.map((d, i) => `<div class="wl-tw-dish"><img src="/images/wobbleland/dish-${S.key}-${i}.png" alt=""><div><b>${esc(d.name)}</b><span>${esc(d.desc)}</span><button type="button" class="wl-tw-btn sm" data-eat="${i}">🍴 ${esc(t('taste'))}</button></div></div>`).join('')}</div>`);
      ui.say.querySelectorAll('[data-eat]').forEach(bt => bt.onclick = () => { b.pose = 'eat'; b.idle = 0; b.hop = .5; burst(b.x, b.y - 26, 'heart', 6); const p = document.createElement('p'); p.className = 'wl-tw-note'; p.textContent = '😋 ' + t('yum'); bt.replaceWith(p); });
    } else if (s.kind === 'board') {
      const now = new Date(), d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const days = h => { let d = new Date(d0.getFullYear(), h.m - 1, h.d); if (d < d0) d = new Date(d0.getFullYear() + 1, h.m - 1, h.d); return Math.round((d - d0) / 864e5); };
      const hs = c.holidays.filter(h => h.m).map(h => ({ h, n: days(h) })).sort((p, q) => p.n - q.n);
      sayHTML(`<p class="wl-tw-t">📌 ${esc(t('board'))}</p>` + (hs.length ? `<ul class="wl-tw-hol">${hs.map(({ h, n }, i) => `<li${i ? '' : ' class="next"'}><span>${esc(h.date)}</span><div><b>${esc(h.title)}</b> <em>${n ? esc(t('inDays', n)) : esc(t('today'))}</em><p>${esc(h.desc)}</p></div></li>`).join('')}</ul>` : `<p>${esc(t('noHol'))}</p>`));
    } else if (s.kind === 'sign') {
      sayHTML(`<p class="wl-tw-t">🪧 ${esc(s.st.name)}</p>${s.st.desc && s.st.desc !== '—' ? `<p>${esc(s.st.desc)}</p>` : ''}`);
    } else if (s.kind === 'station') {
      const i = C.findIndex(x => x.key === S.key);
      sayHTML(`<p class="wl-tw-t">🚂 ${esc(t('station'))}</p><p>${esc(t('where'))}</p><div class="wl-tw-go">${C.map((x, j) => j === i ? '' : `<button type="button" data-go="${x.key}"><img src="/images/wobbleland/crest-${x.key}.png" alt="">${esc(x.short || x.name)}</button>`).join('')}</div><p><button type="button" class="wl-tw-btn ghost" data-map>${esc(t('map'))}</button></p>`);
      ui.say.querySelectorAll('[data-go]').forEach(bt => bt.onclick = () => open(bt.dataset.go));
      ui.say.querySelector('[data-map]').onclick = close;
    } else if (s.kind === 'crit') {
      sayHTML(`<p>${esc(tr(CRIT[s.c.type]))}</p>`);
    }
  }
  function landAct() {
    const th = S.th, k = th.land, b = S.bird; S.landT = 2.5; b.hop = .5;
    const fx = { clock: 'note', maple: 'leaf', shell: 'shell', bakery: 'steam', lemontree: 'lemon', buttons: 'spark', noodles: 'steam', jam: 'heart', bridge: 'wheel', samovar: 'steam', dept: 'ink' }[k];
    if (k === 'clock') { burst(LX, 44, 'note', 10); S.crits.forEach(cr => { cr.st = 'salute'; cr.t = 2; }); }
    else if (k === 'maple' || k === 'lemontree') burst(LX, 50, fx, k === 'maple' ? 30 : 4, 50);
    else if (k === 'bridge') S.fx.push({ type: 'wheel', x: LX, y: BASE + 20, vx: 40, vy: 0, life: 6 });
    else if (k === 'samovar') burst(LX, BASE - 96, 'steam', 24);
    else if (k === 'bakery') { burst(LX, BASE - 100, 'steam', 14); burst(b.x, b.y - 26, 'heart', 4); }
    else if (k === 'noodles') { burst(LX, BASE - 30, 'steam', 14); burst(LX, BASE - 50, 'note', 6); }
    else if (k === 'buttons') burst(LX, 30, 'spark', 18, 30);
    else if (k === 'jam') burst(LX, 36, 'heart', 10, 20);
    else if (k === 'dept') burst(LX, BASE - 30, 'ink', 8);
    else if (k === 'shell') S.landT = 6;
    const ok = k === 'clock' ? tr(LAND.clock[2]) : k === 'dept' ? OK.dept[L][S.rnd() * 3 | 0] : k === 'shell' ? tr(['…knock… knock… (someone is coming. Give it a minute. Or a week.)', '…тук… тук… (кто-то идёт. Подожди минутку. Или неделю.)', '…klauv… klauv… (kāds nāk. Pagaidi minūti. Vai nedēļu.)']) : tr(OK[k]);
    const p = ui.say.querySelector('[data-land]'); if (p) { const n = document.createElement('span'); n.className = 'wl-tw-note'; n.textContent = ok; p.parentNode.appendChild(n); if (k !== 'dept') p.remove(); else { p.parentNode.querySelectorAll('.wl-tw-note').forEach((x, i, a) => i < a.length - 1 && x.remove()); } }
  }

  // ---------- управление ----------
  function toWorld(e) {
    const r = ui.cv.getBoundingClientRect();
    return { x: S.cam + (e.clientX - r.left) / r.width * S.vw, y: (e.clientY - r.top) / r.height * H };
  }
  function onTap(e) {
    if (!S) return;
    const p = toWorld(e), b = S.bird;
    // по зверушке, находке или месту — идём к нему
    const cr = S.crits.find(c => Math.abs(c.x - p.x) < 9 && p.y > c.y - 14 && p.y < c.y + 4);
    const sp = !cr && p.y < BASE + 4 ? S.spots.filter(s => Math.abs(s.x - p.x) < s.w / 2 + 2 && p.y > s.top - 6).sort((a, c) => Math.abs(a.x - p.x) - Math.abs(c.x - p.x))[0] : null;
    if (cr) { b.goal = { x: cr.x - 14 * Math.sign(cr.x - b.x || 1), y: cr.y }; b.pending = { kind: 'crit', x: cr.x, c: cr }; }
    else if (sp) { b.goal = { x: sp.x + (sp.kind === 'res' ? 10 : 0) * (b.x < sp.x ? -1 : 1), y: Y0 + 4 }; b.pending = sp; }
    else { b.goal = { x: Math.max(8, Math.min(WW - 8, p.x)), y: Math.max(Y0, Math.min(Y1, p.y + 10)) }; b.pending = null; }
  }
  function nearest() {
    const b = S.bird; let best = null, bd = 1e9;
    for (const s of S.spots) { const d = Math.abs(s.x - b.x) - s.w / 2; if (d < 10 && b.y < Y0 + 22 && d < bd) { bd = d; best = s; } }
    return best;
  }

  // ---------- частицы ----------
  function burst(x, y, type, n, spread = 8) {
    for (let i = 0; i < n; i++) S.fx.push({ type, x: x + (Math.random() - .5) * spread * 2, y: y + (Math.random() - .5) * spread * .6, vx: (Math.random() - .5) * (type === 'steam' ? 10 : 30), vy: type === 'leaf' || type === 'lemon' ? Math.random() * 10 : -(10 + Math.random() * 25), life: type === 'lemon' ? 3 : 1.6 + Math.random() * 1.4, ph: Math.random() * 6, c: ['#C25B8C', '#4F8BC2', '#D99A3B', '#5E9A5A', '#9B5DE5'][i % 5] });
  }

  // ---------- кадр ----------
  function loop(now) {
    if (!S) return;
    const dt = Math.min(.05, (now - S.last) / 1000); S.last = now;
    step(dt); draw(now / 1000);
    raf = requestAnimationFrame(loop);
  }
  function step(dt) {
    const b = S.bird, K = S.keys, sp = 46;
    let mx = (K.r ? 1 : 0) - (K.l ? 1 : 0), my = (K.n ? 1 : 0) - (K.u ? 1 : 0);
    if (!mx && !my && b.goal) { const dx = b.goal.x - b.x, dy = b.goal.y - b.y, d = Math.hypot(dx, dy); if (d < 1.5) { b.goal = null; if (b.pending) { const p = b.pending; b.pending = null; p.kind === 'crit' ? crit(p.c) : interact(p); } } else { mx = dx / d; my = dy / d; } }
    if (mx || my) {
      const d = Math.hypot(mx, my); b.x = Math.max(8, Math.min(WW - 8, b.x + mx / d * sp * dt)); b.y = Math.max(Y0, Math.min(Y1, b.y + my / d * sp * .7 * dt));
      if (Math.abs(mx) > .2) b.dir = mx > 0 ? 1 : -1; b.pose = 'walk'; b.anim += dt; b.idle = 0;
    } else { if (b.pose === 'walk') b.pose = 'idle'; b.idle += dt; if (b.pose === 'eat' && b.idle > 1.6) b.pose = 'idle'; if (b.pose === 'idle' && b.idle > 5 && Math.random() < dt * .4) { b.pose = 'peck'; b.idle = 4; setTimeout(() => S && S.bird === b && b.pose === 'peck' && (b.pose = 'idle'), 900); } b.anim += dt; }
    if (b.hop > 0) b.hop -= dt;
    // камера
    const want = Math.max(0, Math.min(WW - S.vw, b.x - S.vw / 2));
    S.cam += (want - S.cam) * Math.min(1, dt * 5);
    // ближайшее место — подпись
    const n = nearest();
    if (n !== S.near) { S.near = n; ui.tag.innerHTML = n ? `<b>${esc(n.name)}</b><span>${esc(t('near'))}</span>` : ''; ui.tag.classList.toggle('on', !!n); }
    if (n) { const r = ui.cv.getBoundingClientRect(), k = r.width / S.vw; ui.tag.style.transform = `translate(${((n.x - S.cam) * k).toFixed(0)}px, ${(Math.max(34, n.top - 4) * k).toFixed(0)}px) translate(-50%, -100%)`; }
    // находки
    for (const p of S.picks) if (!p.got && Math.abs(p.x - b.x) < 9 && Math.abs(p.y - b.y) < 8) {
      p.got = true; const all = store.get(); all[S.key] = [...new Set([...(all[S.key] || []), p.i])]; store.set(all);
      burst(p.x, p.y - 6, 'spark', 10); b.hop = .5; countFound();
      const got = S.picks.filter(x => x.got).length;
      sayHTML(`<p class="wl-tw-t">✨ ${esc(t('found', tr(PICKS[S.th.pick][1]), got, 5))}</p>${got === 5 ? `<p>${esc(t('allFound'))}</p>` : ''}`);
    }
    // двери жителей
    for (const s of S.spots) if (s.kind === 'res') { const at = Math.abs(s.door - b.x) < 22 && b.y < Y0 + 20; s.open = at ? Math.min(1, (s.open || 0) + dt * 4) : Math.max(0, (s.open || 0) - dt * 3); }
    // зверушки
    for (const c of S.crits) critStep(c, dt);
    // частицы
    for (const f of S.fx) {
      f.life -= dt; f.ph += dt;
      if (f.type === 'steam') { f.y += f.vy * dt * .5; f.x += Math.sin(f.ph * 2) * 6 * dt; }
      else if (f.type === 'leaf') { f.vy = Math.min(14, f.vy + 20 * dt); f.y += f.vy * dt; f.x += Math.sin(f.ph * 3) * 18 * dt; if (f.y > Y1) { f.y = Y1; f.vy = 0; f.vx = 0; } }
      else if (f.type === 'lemon') { f.vy += 160 * dt; f.y += f.vy * dt; f.x += f.vx * dt * .3; if (f.y > Y0 + 6) { f.y = Y0 + 6; f.vy *= -.4; } }
      else if (f.type === 'wheel') { f.x += f.vx * dt; }
      else if (f.type === 'rain') { f.y += 140 * dt; f.x -= 20 * dt; }
      else { f.vy += 20 * dt; f.x += f.vx * dt; f.y += f.vy * dt; }
    }
    S.fx = S.fx.filter(f => f.life > 0);
    if (S.th.rain && Math.random() < dt * 40) S.fx.push({ type: 'rain', x: S.cam + Math.random() * (S.vw + 40), y: -4, life: 1.4, ph: 0 });
    if (S.th.land === 'maple' && Math.random() < dt * 1.2) S.fx.push({ type: 'leaf', x: LX + (Math.random() - .5) * 120, y: 30 + Math.random() * 30, vx: 0, vy: 0, life: 7, ph: Math.random() * 6 });
    if ((S.th.land === 'samovar' || S.th.land === 'noodles' || S.th.land === 'bakery') && Math.random() < dt * 2) burst(S.th.land === 'samovar' ? LX : S.th.land === 'bakery' ? LX + 18 : LX, S.th.land === 'samovar' ? BASE - 96 : S.th.land === 'bakery' ? BASE - 82 : BASE - 76, 'steam', 1, 2);
    if (S.landT > 0) S.landT -= dt;
  }
  function crit(c) { interact({ kind: 'crit', x: c.x, c }); c.st = c.type === 'snail' ? 'hide' : ['gull', 'pigeon', 'crow'].includes(c.type) ? 'fly' : c.type === 'cat' || c.type === 'butterfly' ? 'follow' : 'run'; c.t = c.type === 'snail' ? 6 : 4; if (c.type === 'cat') burst(c.x, c.y - 10, 'heart', 2); }
  function critStep(c, dt) {
    const b = S.bird, d = Math.hypot(c.x - b.x, (c.y - b.y) * 2), flyer = c.type === 'bee' || c.type === 'butterfly';
    c.ph += dt; c.t -= dt;
    if (c.st === 'fly') { c.y -= 50 * dt; c.x += c.dir * 30 * dt; if (c.y < -20) { c.st = 'gone'; c.t = 6; } return; }
    if (c.st === 'gone') { if (c.t < 0) { c.st = 'walk'; c.x = b.x > WW / 2 ? 80 : WW - 80; c.y = Y0 + Math.random() * (Y1 - Y0); } return; }
    if (c.st === 'hide' || c.st === 'salute') { if (c.t < 0) c.st = 'walk'; return; }
    if (c.st === 'follow') { if (c.t < 0) c.st = 'walk'; const tx = b.x - b.dir * 14, ty = flyer ? b.y - 30 : b.y; c.x += (tx - c.x) * dt * 2; c.y += (ty - c.y) * dt * 2; if (Math.abs(tx - c.x) > 1) c.dir = tx > c.x ? 1 : -1; return; }
    if (c.st === 'run') { c.x += c.dir * 70 * dt; if (c.t < 0 || c.x < 20 || c.x > WW - 20) { c.st = 'walk'; c.x = Math.max(20, Math.min(WW - 20, c.x)); } return; }
    if (d < 18 && !flyer && c.type !== 'cat' && c.type !== 'snail' && b.pose === 'walk') { c.dir = c.x > b.x ? 1 : -1; c.st = ['gull', 'pigeon', 'crow'].includes(c.type) ? 'fly' : 'run'; c.t = 1.5; return; }
    if (d < 14 && c.type === 'snail') { c.st = 'hide'; c.t = 5; return; }
    const speed = { snail: 2, gull: 12, pigeon: 12, crow: 10, squirrel: 24, mouse: 26, cat: 10, bee: 22, butterfly: 16 }[c.type] || 10;
    if (c.tx == null || Math.abs(c.tx - c.x) < 2 || c.t < -6) { c.tx = Math.max(20, Math.min(WW - 20, c.x + (Math.random() - .5) * 140)); c.ty = flyer ? 60 + Math.random() * 70 : Y0 + Math.random() * (Y1 - Y0); c.t = 0; c.pause = Math.random() * 2; }
    if (c.pause > 0) { c.pause -= dt; return; }
    const dx = c.tx - c.x, dy = c.ty - c.y, dd = Math.hypot(dx, dy) || 1;
    c.x += dx / dd * speed * dt; c.y += dy / dd * speed * dt * .6; c.dir = dx > 0 ? 1 : -1;
  }

  // ---------- рисование кадра (ctx ×2) ----------
  function draw(time) {
    const g = S.ctx, cam = S.cam, vw = S.vw;
    g.setTransform(2, 0, 0, 2, 0, 0); g.imageSmoothingEnabled = false;
    const cx = Math.round(cam);
    g.drawImage(S.far, Math.round(cam * .5), 0, vw, BASE, 0, 0, vw, BASE);
    // облака / луна
    if (!S.night) for (let i = 0; i < 4; i++) { const x = ((i * 157 + time * (3 + i)) % (vw + 80)) - 40, y = 10 + i * 13; g.fillStyle = S.th.rain ? 'rgba(90,94,110,.8)' : 'rgba(255,255,255,.85)'; g.fillRect(Math.round(x), y, 22, 4); g.fillRect(Math.round(x) + 4, y - 3, 12, 3); }
    else { g.fillStyle = '#FFF3C4'; g.fillRect(vw - 40, 14, 9, 9); g.fillStyle = '#1B1B3A'; g.fillRect(vw - 37, 13, 7, 7); }
    g.save(); g.translate(-cx, 0);
    g.drawImage(S.nearC, 0, 0);
    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
    // часы показывают время Риги
    if (S.th.land === 'clock') { const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Riga' })), hA = (d.getHours() % 12 + d.getMinutes() / 60) / 12 * Math.PI * 2, mA = d.getMinutes() / 60 * Math.PI * 2; for (let i = 0; i < 7; i++) R(LX + Math.sin(mA) * i, 44 - Math.cos(mA) * i, 1, 1, '#2B1A51'); for (let i = 0; i < 5; i++) R(LX + Math.sin(hA) * i, 44 - Math.cos(hA) * i, 1, 1, '#C8473A'); if (S.landT > 0) { const sw = Math.sin(time * 18) * 2; R(LX - 2 + sw, 70, 4, 5, '#F2C94C'); } }
    if (S.th.land === 'buttons') for (let i = 0; i < 3; i++) { const p = (time * .7 + i * .33) % 1, y = 24 + Math.floor((time * 2 + i * 5) % 9) * 9; if (p < .2) { R(LX - 7 + i * 7, y - 3, 1, 7, '#FFFFFF'); R(LX - 10 + i * 7, y, 7, 1, '#FFFFFF'); } }
    if (S.th.land === 'noodles' || S.th.lanterns) for (let i = -2; i <= 2; i++) { const sw = Math.round(Math.sin(time * 2 + i) * 1); R(LX + i * 14 + sw, BASE - 66, 5, 6, '#E0443A'); R(LX + i * 14 + sw + 1, BASE - 60, 3, 2, '#F2C94C'); }
    if (S.th.land === 'shell' && S.landT > 0) { const k = Math.min(1, (6 - S.landT) / 2); R(LX - 8, BASE - 18, 10, 18 * (1 - k * .5), '#2B1A1A'); }
    // двери жителей: открываются, когда птичка рядом; в проёме — медальон жителя
    for (const s of S.spots) if (s.kind === 'res') {
      const o = s.open || 0, dx = s.door - 4;
      if (o > .05) { R(dx, BASE - 14, 8, 14, '#2B1A1A'); R(dx + (8 - Math.round(8 * (1 - o))), BASE - 14, Math.round(2 * o), 14, '#6B4426'); if (s.im) { const w = s.im.width, h = s.im.height, sc = Math.min(1, 14 / Math.max(w, h)) * Math.min(1, o * 1.5); g.drawImage(s.im, Math.round(s.door - w * sc / 2), Math.round(BASE - 2 - h * sc), Math.round(w * sc), Math.round(h * sc)); } }
      const bob = Math.round(Math.sin(time * 3 + s.x) * 1.5);
      if (o < .5) { R(s.door - 3, BASE - 24 + bob, 7, 5, '#FFFDF5'); R(s.door - 1, BASE - 19 + bob, 2, 2, '#FFFDF5'); R(s.door - 2, BASE - 22 + bob, 1, 1, '#534AB7'); R(s.door, BASE - 22 + bob, 1, 1, '#534AB7'); R(s.door + 2, BASE - 22 + bob, 1, 1, '#534AB7'); }
    }
    // всё на земле — по глубине
    const ents = [];
    for (const p of S.picks) if (!p.got) ents.push({ y: p.y, p });
    for (const c of S.crits) if (c.st !== 'gone') ents.push({ y: c.type === 'bee' || c.type === 'butterfly' || c.st === 'fly' ? 999 : c.y, c });
    ents.push({ y: S.bird.y, b: S.bird });
    for (const f of S.fx) if (f.type === 'wheel') ents.push({ y: f.y, f });
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) {
      if (e.p) drawPick(R, e.p, time);
      else if (e.c) drawCrit(R, e.c, time);
      else if (e.f) { const a = e.f.ph * 6; R(e.f.x - 5, e.f.y - 10, 10, 10, '#F2C94C'); R(e.f.x - 4 + Math.cos(a) * 3, e.f.y - 6 + Math.sin(a) * 3, 2, 2, '#E0A83A'); }
      else drawBird(g, R, e.b);
    }
    // частицы
    for (const f of S.fx) {
      if (f.type === 'wheel') continue;
      const a = Math.min(1, f.life);
      g.globalAlpha = a;
      if (f.type === 'steam') { const r = Math.round(2 + (2.5 - f.life) * 2); R(f.x - r / 2, f.y - r / 2, r, r, 'rgba(255,255,255,.75)'); }
      else if (f.type === 'leaf') R(f.x, f.y, 3, 2, ['#D9762B', '#E9A93B', '#B84A22'][Math.floor(f.ph * 7) % 3]);
      else if (f.type === 'lemon') { R(f.x - 2, f.y - 2, 4, 3, '#FFE14A'); R(f.x - 1, f.y - 3, 1, 1, '#6E9A3A'); }
      else if (f.type === 'heart') { R(f.x - 2, f.y, 2, 2, '#E8577A'); R(f.x + 1, f.y, 2, 2, '#E8577A'); R(f.x - 1, f.y + 2, 3, 1, '#E8577A'); R(f.x, f.y + 3, 1, 1, '#E8577A'); }
      else if (f.type === 'note') { R(f.x, f.y - 4, 1, 5, '#2B1A51'); R(f.x - 2, f.y, 3, 2, '#2B1A51'); R(f.x + 1, f.y - 4, 2, 1, '#2B1A51'); }
      else if (f.type === 'spark') { R(f.x, f.y - 1, 1, 3, f.c); R(f.x - 1, f.y, 3, 1, f.c); }
      else if (f.type === 'ink') R(f.x, f.y, 2, 3, '#2B1A51');
      else if (f.type === 'rain') R(f.x, f.y, 1, 4, 'rgba(200,210,235,.7)');
      else R(f.x, f.y, 2, 2, f.c);
      g.globalAlpha = 1;
    }
    g.restore();
    if (S.night) { g.fillStyle = 'rgba(20,18,60,.18)'; g.fillRect(0, 0, vw, H); }
  }
  function drawBird(g, R, b) {
    const f = b.pose === 'walk' ? 1 + Math.floor(b.anim / .16) % 2 - 1 : b.pose === 'peck' ? 2 : b.pose === 'eat' ? (Math.floor(b.idle / .2) % 2 ? 2 : 0) : 0;
    const hop = b.hop > 0 ? Math.round(Math.sin((.5 - b.hop) / .5 * Math.PI) * 6) : 0;
    const x = Math.round(b.x), y = Math.round(b.y) - hop - (b.pose === 'walk' && f ? 1 : 0);
    R(x - 6, Math.round(b.y), 12, 1, 'rgba(0,0,0,.18)'); R(x - 4, Math.round(b.y) + 1, 8, 1, 'rgba(0,0,0,.12)');
    if (!b.hd) { R(x - 6, y - 12, 12, 12, '#9B8BD6'); return; }
    const h = b.hd[f] || b.hd[0];
    g.save();
    if (b.dir < 0) { g.translate(x, 0); g.scale(-1, 1); g.drawImage(h, -13, y - 26.5, h.width / 2, h.height / 2); }
    else g.drawImage(h, x - 13, y - 26.5, h.width / 2, h.height / 2);
    g.restore();
  }
  function drawPick(R, p, time) {
    const k = S.th.pick, x = Math.round(p.x), y = Math.round(p.y - 3 + Math.sin(time * 3 + p.i) * 1.5);
    R(x - 2, Math.round(p.y), 5, 1, 'rgba(0,0,0,.15)');
    if (Math.floor(time * 2 + p.i) % 4 === 0) { R(x + 3, y - 6, 1, 3, '#FFFFFF'); R(x + 2, y - 5, 3, 1, '#FFFFFF'); }
    const P = {
      feather: () => { R(x - 3, y, 6, 1, '#F2F0EA'); R(x - 2, y - 1, 4, 1, '#DADCE2'); R(x + 3, y, 1, 1, '#7A6A55'); },
      leaf: () => { R(x - 2, y - 2, 5, 3, '#E9A93B'); R(x - 1, y - 3, 3, 1, '#E9A93B'); R(x, y + 1, 1, 2, '#8A5A34'); },
      shell: () => { R(x - 2, y - 2, 4, 3, '#E0A86A'); R(x - 1, y - 1, 2, 1, '#C98A4A'); },
      cone: () => { R(x - 2, y - 3, 4, 4, '#8A5A34'); R(x - 1, y - 2, 1, 1, '#A8754A'); R(x + 1, y - 1, 1, 1, '#A8754A'); R(x - 1, y + 1, 2, 1, '#6B4426'); },
      lemon: () => { R(x - 2, y - 2, 5, 3, '#FFE14A'); R(x - 3, y - 1, 1, 1, '#E8C84A'); R(x, y - 3, 1, 1, '#6E9A3A'); },
      button: () => { R(x - 2, y - 2, 5, 4, '#C25B8C'); R(x - 1, y - 1, 1, 1, '#2B1A51'); R(x + 1, y - 1, 1, 1, '#2B1A51'); R(x - 1, y, 1, 1, '#2B1A51'); R(x + 1, y, 1, 1, '#2B1A51'); },
      noodle: () => { for (let i = 0; i < 6; i++) R(x - 3 + i, y - 1 + (i % 2), 1, 1, '#F6E3A8'); },
      berry: () => { R(x - 2, y - 2, 4, 4, '#C8304A'); R(x - 1, y - 2, 1, 1, '#F08BA8'); R(x, y - 3, 1, 1, '#5E8A3A'); },
      cheese: () => { R(x - 2, y - 2, 4, 3, '#F2C94C'); R(x - 1, y - 1, 1, 1, '#E0A83A'); },
      sugar: () => { R(x - 2, y - 2, 4, 4, '#FFFFFF'); R(x - 2, y + 1, 4, 1, '#DADCE2'); },
      page: () => { R(x - 2, y - 3, 5, 5, '#FFFDF5'); R(x - 1, y - 2, 3, 1, '#9A9CA6'); R(x - 1, y, 3, 1, '#9A9CA6'); },
    };
    (P[k] || P.button)();
  }
  function drawCrit(R, c, time) {
    const x = Math.round(c.x), y = Math.round(c.y), d = c.dir, step = Math.floor(c.ph * 6) % 2;
    const px = (ox, oy, w, h, col) => R(d > 0 ? x + ox : x - ox - w + 1, y + oy, w, h, col);
    if (c.type !== 'bee' && c.type !== 'butterfly' && c.st !== 'fly') R(x - 3, y, 7, 1, 'rgba(0,0,0,.15)');
    switch (c.type) {
      case 'gull': case 'pigeon': case 'crow': {
        const [body, wing, beak] = { gull: ['#F2F0EA', '#B8BCC6', '#F2A33A'], pigeon: ['#9AA0B4', '#7A8098', '#5A5A66'], crow: ['#2E2B3A', '#45415A', '#5A5A66'] }[c.type];
        if (c.st === 'fly') { const up = Math.floor(time * 10) % 2; px(-3, -6, 7, 3, body); px(-5, up ? -9 : -5, 4, 1, wing); px(2, up ? -9 : -5, 4, 1, wing); px(4, -6, 2, 1, beak); break; }
        px(-3, -6, 6, 4, body); px(-4, -5, 2, 2, wing); px(1, -9, 3, 3, body); px(4, -8, 2, 1, beak); px(2, -8, 1, 1, '#120E1C');
        px(-1, -2, 1, 2 - step, beak); px(1, -2, 1, 1 + step, beak);
        if (c.st === 'salute') px(3, -12, 1, 3, wing);
        break;
      }
      case 'squirrel': case 'mouse': {
        const col = c.type === 'mouse' ? '#9A9CA6' : '#C8743A';
        if (c.type === 'squirrel') { px(-6, -9, 3, 6, col); px(-7, -10, 3, 2, col); }
        else px(-6, -2, 3, 1, '#E8A0B0');
        px(-3, -5, 6, 4, col); px(2, -7, 3, 3, col); px(3, -8, 1, 1, col); px(4, -6, 1, 1, '#120E1C'); px(-2, -1, 1, 1, col); px(1 + step, -1, 1, 1, col);
        if (c.type === 'mouse' && c.ph % 4 < 2) px(5, -4, 2, 2, '#F2C94C');
        break;
      }
      case 'snail': {
        if (c.st === 'hide') { px(-3, -6, 6, 6, '#C98A4A'); px(-1, -4, 2, 2, '#E0A86A'); break; }
        px(-4, -1, 10, 1, '#9AB06A'); px(3, -3, 2, 2, '#9AB06A'); px(4, -5, 1, 2, '#9AB06A'); px(-3, -7, 6, 6, '#C98A4A'); px(-1, -5, 2, 2, '#E0A86A');
        break;
      }
      case 'cat': {
        const col = '#3A3550';
        px(-5, -7 + step, 1, 4, col); px(-4, -5, 8, 4, col); px(3, -8, 4, 4, col); px(3, -9, 1, 1, col); px(6, -9, 1, 1, col); px(5, -7, 1, 1, '#7CC36A');
        px(-3, -1, 1, 1, col); px(2 - step, -1, 1, 1, col);
        break;
      }
      case 'bee': { const yy = Math.round(Math.sin(c.ph * 5) * 2); R(x - 1, y - 1 + yy, 3, 2, '#F2C94C'); R(x, y - 1 + yy, 1, 2, '#2B1A51'); R(x - 1, y - 2 + yy, 2, 1, 'rgba(255,255,255,.8)'); break; }
      case 'butterfly': { const yy = Math.round(Math.sin(c.ph * 4) * 3), o = Math.floor(c.ph * 8) % 2; R(x, y - 1 + yy, 1, 3, '#5A3B26'); R(x - 2, y - 1 + yy, 2, o ? 2 : 1, '#FFE14A'); R(x + 1, y - 1 + yy, 2, o ? 2 : 1, '#FFE14A'); break; }
    }
  }

  // ---------- связь с картой ----------
  window.PPWlTown = { open, close, state: () => S }; // state — для проверки (tools/shots)
  document.addEventListener('pp:whoami', () => { if (S) { const n = birdHD(); if (n) Object.assign(S.bird, n); } });
  if (location.hash.startsWith('#walk-')) open(location.hash.slice(6), { fromHash: true });
})();
