// Огород птички (этап 22, /garden/?nick=, docs/bird.md «Огород»): пиксельная сцена 192×120 (canvas ×4), грядки, птичка, жуки, погода по сезону.
// Нажал грядку → панель под сценой: посадить (свои семена), полить (раз в сутки), собрать. Корзинка — продать урожай за пуговки; «🛒 Семена» — купить.
// Всё считает сервер (worker/garden.js): GET /api/garden?nick=, POST /api/garden/{plant,water,harvest,sell,buy,bug,hide,dig,move} (dig — выкопать, move — ✋ перестановка). Гость только смотрит.
// Рисунки и названия растений — и для рынка (window.PPGardenPlants: icon, name — блок «🌱 Семена» в src/pages/shop.html); без #garden на странице — только это.
(() => {
  const app = document.getElementById('garden');
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const pre = L === 1 ? '/ru' : L === 2 ? '/lv' : '';
  const T = {
    of: ['Garden of @{n}', 'Огород @{n}', '@{n} dārzs'],
    home: ['🚪 Back to the house', '🚪 В дом', '🚪 Uz māju'],
    sign: ['Sign in and hatch your bird: it gets a house with a garden.', 'Войди и вылупи птичку: у неё есть дом с огородом.', 'Ienāc un izperē savu putniņu: tam ir māja ar dārzu.'],
    signBtn: ['Sign in', 'Войти', 'Ienākt'],
    none: ['There is no such bird.', 'Такой птички нет.', 'Tāda putniņa nav.'],
    waterAll: [n => `💧 Water all (${n})`, n => `💧 Полить всё (${n})`, n => `💧 Aplaistīt visu (${n})`],
    watered: ['Everything is watered today ✓', 'Сегодня всё полито ✓', 'Šodien viss aplaistīts ✓'],
    bed: [n => `Bed ${n}`, n => `Грядка ${n}`, n => `${n}. dobe`],
    empty: ['Empty. What shall we plant?', 'Пусто. Что посадим?', 'Tukšs. Ko stādīsim?'],
    noSeeds: ['No seeds left — buy some below.', 'Семян нет — купи ниже.', 'Sēklu nav — nopērc zemāk.'],
    tapBed: ['Tap a bed to plant, water or harvest.', 'Нажми на грядку: посадить, полить или собрать.', 'Pieskaries dobei: iestādīt, aplaistīt vai novākt.'],
    plant: ['Plant', 'Посадить', 'Iestādīt'],
    water: ['💧 Water', '💧 Полить', '💧 Aplaistīt'],
    harvest: ['🧺 Harvest', '🧺 Собрать', '🧺 Novākt'],
    ready: ['Ready! Time to harvest.', 'Выросло! Пора собирать.', 'Izaudzis! Laiks novākt.'],
    left: [s => `${s} to go`, s => `ещё ${s}`, s => `vēl ${s}`],
    wetToday: ['💧 watered today', '💧 полито сегодня', '💧 šodien aplaistīts'],
    dry: ['the soil is dry: it grows only when watered', 'земля сухая: растёт, только когда полито', 'zeme ir sausa: aug tikai aplaistīts'],
    wetYet: ['still damp from yesterday: water again today', 'земля ещё влажная со вчера: полей и сегодня', 'zeme vēl mitra no vakardienas: aplaisti arī šodien'],
    seedNew: ['planted: water it to start growing', 'посажено: полей, чтобы начало расти', 'iestādīts: aplaisti, lai sāktu augt'],
    basket: ['🧺 Basket', '🧺 Корзинка', '🧺 Grozs'],
    basket0: ['Empty for now — the harvest goes here.', 'Пока пусто — сюда попадает урожай.', 'Pagaidām tukšs — šeit nonāk raža.'],
    sell: [n => `Sell for ${n} 🔘`, n => `Продать за ${n} 🔘`, n => `Pārdot par ${n} 🔘`],
    seeds: ['🌱 Seeds', '🌱 Семена', '🌱 Sēklas'],
    seeds0: ['No seeds.', 'Семян нет.', 'Sēklu nav.'],
    shop: ['🛒 Buy seeds', '🛒 Купить семена', '🛒 Pirkt sēklas'],
    shopHead: ['Seed stall', 'Лавка семян', 'Sēklu kiosks'],
    shopNote: ['Price of one seed · how many days it grows · what the harvest sells for.', 'Цена семечка · сколько дней растёт · за сколько продаётся урожай.', 'Sēklas cena · cik dienas aug · par cik pārdod ražu.'],
    days: [n => `${n} d`, n => `${n} дн.`, n => `${n} d.`],
    buy: [n => `+1 for ${n} 🔘`, n => `+1 за ${n} 🔘`, n => `+1 par ${n} 🔘`],
    buyFree: ['+1 free', '+1 бесплатно', '+1 bez maksas'],
    poor: ['Not enough buttons', 'Не хватает пуговок', 'Nepietiek pogu'],
    oops: ['Something went wrong. Try again.', 'Что-то пошло не так. Попробуй ещё раз.', 'Kaut kas nogāja greizi. Mēģini vēlreiz.'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    bugsHead: ['🐞 Bugs', '🐞 Жуки', '🐞 Vaboles'],
    bugsNow: [n => `In the garden now: ${n}. Tap a bug to catch it.`, n => `Сейчас в огороде: ${n}. Нажми на жука — поймать.`, n => `Dārzā tagad: ${n}. Pieskaries vabolei — noķer.`],
    bugsNone: ['No bugs right now.', 'Жуков сейчас нет.', 'Vaboļu pašlaik nav.'],
    bugsGot: [n => `Caught today: ${n}.`, n => `Поймано сегодня: ${n}.`, n => `Šodien noķertas: ${n}.`],
    bugsLater: ['More may crawl out later today.', 'Позже сегодня могут вылезти ещё.', 'Vēlāk šodien var izlīst vēl.'],
    bugsDone: ['That is all for today. Come back tomorrow!', 'На сегодня всё. Заходи завтра!', 'Šodienai viss. Nāc rīt!'],
    bugsRule: [n => `Bugs come out every day, but not many and not always: each one is +${n} 🔘.`, n => `Жуки вылезают каждый день, но немного и не всегда: каждый — +${n} 🔘.`, n => `Vaboles izlien katru dienu, bet maz un ne vienmēr: katra — +${n} 🔘.`],
    caught: [n => `🐞 Caught! +${n} 🔘`, n => `🐞 Пойман! +${n} 🔘`, n => `🐞 Noķerta! +${n} 🔘`],
    caught0: ['🐞 Caught!', '🐞 Пойман!', '🐞 Noķerta!'],
    sold: [n => `🧺 Sold! +${n} 🔘`, n => `🧺 Продано! +${n} 🔘`, n => `🧺 Pārdots! +${n} 🔘`],
    gotCrop: [n => `🧺 ${n} is in the basket`, n => `🧺 ${n} — в корзинке`, n => `🧺 ${n} — grozā`],
    mandrake: ['🔮 Aaaah! The mandrake squeaked', '🔮 А-а-а! Мандрагора пискнула', '🔮 A-a-a! Mandragora iepīkstējās'],
    found: [n => `🌱 New seeds: ${n}`, n => `🌱 Новые семена: ${n}`, n => `🌱 Jaunas sēklas: ${n}`],
    specialHead: ['✨ Special seeds', '✨ Особые семена', '✨ Īpašās sēklas'],
    rare: [(a, b) => `✨ Rare seed: ${a} of ${b} days in a row with the bonus of the card of the day`, (a, b) => `✨ Редкое семечко: ${a} из ${b} дней подряд с бонусом карточки дня`, (a, b) => `✨ Reta sēkla: ${a} no ${b} dienām pēc kārtas ar dienas kartītes bonusu`],
    magic: [(a, b) => `🔮 Magic seed: ${a} of ${b} days in a row of watering`, (a, b) => `🔮 Волшебное семечко: ${a} из ${b} дней полива подряд`, (a, b) => `🔮 Burvju sēkla: ${a} no ${b} laistīšanas dienām pēc kārtas`],
    gotSeed: [n => `🎁 Today: ${n}!`, n => `🎁 Сегодня: ${n}!`, n => `🎁 Šodien: ${n}!`],
    specialNote: ['Simple seeds are sold in the stall and the market and sometimes drop in games. Rare and magic ones are not sold.', 'Простые семена продаются в лавке и на рынке и иногда выпадают в играх. Редкие и волшебные не продаются.', 'Vienkāršās sēklas pārdod kioskā un tirgū, un tās dažreiz izkrīt spēlēs. Retās un burvju sēklas nepārdod.'],
    itemsHead: ['🪴 Garden things', '🪴 Вещи огорода', '🪴 Dārza lietas'],
    items0: ['Watering cans, a scarecrow, a greenhouse and more are at the market — bought things stand in the garden by themselves.', 'Лейки, пугало, теплица и другое — на рынке; купленная вещь сама встанет в огороде.', 'Lejkannas, putnubiedēklis, siltumnīca un citas lietas ir tirgū — nopirktā lieta pati nostāsies dārzā.'],
    itemsNote: ['Tap a thing to hide it or put it back.', 'Нажми на вещь — спрятать или вернуть.', 'Pieskaries lietai — paslēpt vai atgriezt.'],
    itemsShop: ['🛒 Things for the garden', '🛒 Вещи для огорода', '🛒 Lietas dārzam'],
    how: ['Plant a seed, water it every day and it grows: plants grow only while the soil is damp. Harvest goes into the basket and sells for buttons 🔘.',
      'Посади семечко и поливай каждый день — растёт, только пока земля влажная. Урожай попадает в корзинку и продаётся за пуговки 🔘.',
      'Iestādi sēklu un laisti katru dienu — tā aug tikai, kamēr zeme ir mitra. Raža nonāk grozā un pārdodas par pogām 🔘.'],
    guest: ['You are a guest here: you can look, but only the owner looks after the beds.', 'Ты в гостях: смотреть можно, а ухаживать за грядками — только хозяину.', 'Tu esi ciemos: skatīties drīkst, bet dobes kopj tikai saimnieks.'],
    off: ['The garden is resting today.', 'Огород сегодня отдыхает.', 'Dārzs šodien atpūšas.'],
    seasons: { autumn: ['🍂 Cosy autumn', '🍂 Уютная осень', '🍂 Mājīgs rudens'], winter: ['❄️ Snowy winter', '❄️ Снежная зима', '❄️ Sniegota ziema'],
      spring: ['🌸 Spring in bloom', '🌸 Весна в цвету', '🌸 Ziedošs pavasaris'], summer: ['☀️ Sunny summer', '☀️ Солнечное лето', '☀️ Saulaina vasara'] },
    weather: { rain: ['light rain', 'моросит дождик', 'smidzina lietutiņš'], leaves: ['leaves are falling', 'падают листья', 'krīt lapas'], fog: ['morning mist', 'туманно', 'migla'],
      snow: ['snowing', 'идёт снег', 'snieg'], frost: ['frosty and clear', 'морозно и ясно', 'salst un skaidrs'], petals: ['petals in the air', 'летят лепестки', 'lido ziedlapiņas'],
      sun: ['sunny', 'солнечно', 'saulains'], butterflies: ['butterflies', 'летают бабочки', 'lido tauriņi'] },
    h: ['h', 'ч', 'st.'], m: ['min', 'мин', 'min'], d: ['d', 'дн.', 'd.'],
    dig: ['🪓 Dig up', '🪓 Выкопать', '🪓 Izrakt'],
    digAsk: ['Dig it up? The bed will be empty and there will be no harvest.', 'Выкопать? Грядка освободится, урожая не будет.', 'Izrakt? Dobe būs tukša, ražas nebūs.'],
    treeGrown: [s => `🌳 Fully grown. New fruit in ${s}`, s => `🌳 Выросло. Новые плоды — через ${s}`, s => `🌳 Izaudzis. Jauni augļi pēc ${s}`],
    treeReady: ['🌳 Fruit is ripe! The tree stays and will bear fruit again.', '🌳 Плоды поспели! Дерево останется и принесёт ещё.', '🌳 Augļi ir gatavi! Koks paliks un nesīs vēl.'],
    saplings: ['🌳 Saplings', '🌳 Саженцы', '🌳 Stādi'],
    saplingsNote: ['Trees grow for a long time, one per bed. Then they stay and bear fruit again and again.', 'Деревья растут долго, одно на грядку. Потом остаются и плодоносят снова и снова.', 'Koki aug ilgi, viens dobē. Pēc tam paliek un nes augļus atkal un atkal.'],
    again: [n => `fruit every ${n} d`, n => `плоды каждые ${n} дн.`, n => `augļi ik pēc ${n} d.`],
    move: ['✋ Move things', '✋ Переставить', '✋ Pārkārtot'],
    moveHint: ['Drag beds and things with your finger or mouse. Then tap “Save”.', 'Перетащи грядки и вещи пальцем или мышкой. Потом — «Сохранить».', 'Velc dobes un lietas ar pirkstu vai peli. Pēc tam — «Saglabāt».'],
    moveSave: ['✅ Save', '✅ Сохранить', '✅ Saglabāt'],
    moveCancel: ['Cancel', 'Отмена', 'Atcelt'],
    moveReset: ['↩ As it was at first', '↩ Как было сначала', '↩ Kā bija sākumā'],
    moveOver: [n => `Things that did not fit: ${n} — they wait above the beds, drag them to a free spot.`, n => `Не влезло вещей: ${n} — они ждут над грядками, перетащи на свободное место.`, n => `Neiederējās lietas: ${n} — tās gaida virs dobēm, pārvelc uz brīvu vietu.`],
    moveSaved: ['✋ Saved', '✋ Сохранено', '✋ Saglabāts'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  // растения: названия (порядок — как в лавке), цвета для разных грядок
  const CROP = {
    radish: ['Radish', 'Редиска', 'Redīss'], lettuce: ['Lettuce', 'Салат', 'Salāti'], carrot: ['Carrot', 'Морковь', 'Burkāns'], tulip: ['Tulip', 'Тюльпан', 'Tulpe'],
    strawberry: ['Strawberry', 'Клубника', 'Zemene'], sunflower: ['Sunflower', 'Подсолнух', 'Saulespuķe'], cabbage: ['Cabbage', 'Капуста', 'Kāposts'], pumpkin: ['Pumpkin', 'Тыква', 'Ķirbis'],
    // этап 23: редкие (серия карточки дня) и волшебные (серия полива) — в лавке не продаются
    rainbowcarrot: ['Rainbow carrot ✨', 'Радужная морковь ✨', 'Varavīksnes burkāns ✨'], bluerose: ['Blue rose ✨', 'Синяя роза ✨', 'Zilā roze ✨'], goldpumpkin: ['Golden pumpkin ✨', 'Золотая тыква ✨', 'Zelta ķirbis ✨'],
    starberry: ['Starberry 🔮', 'Звёздная ягода 🔮', 'Zvaigžņoga 🔮'], moonflower: ['Moonflower 🔮', 'Лунный цветок 🔮', 'Mēnesszieds 🔮'], mandrake: ['Mandrake 🔮', 'Мандрагора 🔮', 'Mandragora 🔮'],
    // деревья (23.11.2026): саженцы в лавке, одно на грядку, растут долго, потом плодоносят снова и снова
    cherrytree: ['Cherry tree 🌳', 'Вишня 🌳', 'Ķirsis 🌳'], appletree: ['Apple tree 🌳', 'Яблоня 🌳', 'Ābele 🌳'], plumtree: ['Plum tree 🌳', 'Слива 🌳', 'Plūme 🌳'],
    rowan: ['Rowan 🌳', 'Рябина 🌳', 'Pīlādzis 🌳'], peartree: ['Pear tree 🌳', 'Груша 🌳', 'Bumbiere 🌳'], birch: ['Birch 🌳', 'Берёза 🌳', 'Bērzs 🌳'],
    linden: ['Linden 🌳', 'Липа 🌳', 'Liepa 🌳'], spruce: ['Spruce 🌲', 'Ель 🌲', 'Egle 🌲'], pine: ['Pine 🌲', 'Сосна 🌲', 'Priede 🌲'], oak: ['Oak 🌳', 'Дуб 🌳', 'Ozols 🌳'],
  };
  // что приносит дерево (корзинка, тост урожая)
  const HARV = {
    cherrytree: ['Cherries', 'Вишни', 'Ķirši'], appletree: ['Apples', 'Яблоки', 'Āboli'], plumtree: ['Plums', 'Сливы', 'Plūmes'], rowan: ['Rowan berries', 'Ягоды рябины', 'Pīlādžogas'],
    peartree: ['Pears', 'Груши', 'Bumbieri'], birch: ['Birch sap', 'Берёзовый сок', 'Bērzu sula'], linden: ['Linden blossom', 'Липовый цвет', 'Liepziedi'],
    spruce: ['Spruce cones', 'Еловые шишки', 'Egļu čiekuri'], pine: ['Pine cones', 'Сосновые шишки', 'Priežu čiekuri'], oak: ['Acorns', 'Жёлуди', 'Zīles'],
  };
  const TALL = ['sunflower', 'moonflower'];
  const cname = k => CROP[k] ? CROP[k][L] : k;
  const hname = k => HARV[k] ? HARV[k][L] : cname(k); // урожай: у дерева — плоды
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const api = (path, body) => fetch('/api/garden' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' })
    .then(r => r.ok ? r.json() : Promise.reject(r.status));
  const toast = m => window.PPToast ? window.PPToast(m) : null;
  const dur = ms => { const mi = Math.ceil(ms / 6e4), d = Math.floor(mi / 1440), h = Math.floor(mi % 1440 / 60), m = mi % 60; return d ? `${d} ${t('d')} ${h} ${t('h')}` : h ? `${h} ${t('h')} ${m} ${t('m')}` : `${m} ${t('m')}`; };
  const fnv = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  // ---------- рисование ----------
  let NIGHT_ON = false; // вечер (19–7): лунный цветок светится
  const TIER_OF = { rainbowcarrot: 'rare', bluerose: 'rare', goldpumpkin: 'rare', starberry: 'magic', moonflower: 'magic', mandrake: 'magic' }; // то же в worker/garden.js TIER
  Object.keys(HARV).forEach(k => { TIER_OF[k] = 'tree'; });
  const isTree = p => TIER_OF[p] === 'tree';
  const W = 192, H = 120, K = 4;
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const SKY = { autumn: ['#F6C89A', '#F3B489', '#E9A07F'], winter: ['#CFE1F2', '#BCD3EA', '#AAC4E2'], spring: ['#BFE6F6', '#D4EEF6', '#E8F6F2'], summer: ['#7FC8F0', '#9CD6F4', '#BDE4F6'] };
  const NIGHT = ['#2B1A51', '#3A2670', '#4B3488'];
  const GROUND = { autumn: ['#8C8A3E', '#7A7836', '#9C9A48'], winter: ['#F4F8FC', '#E2EAF4', '#FFFFFF'], spring: ['#7CC45A', '#6BB34C', '#8ED26A'], summer: ['#6DB548', '#5EA43E', '#80C65A'] };
  const TREE = { autumn: ['#E8771C', '#D2502A', '#F2A93B'], winter: ['#FFFFFF', '#E6EEF6', '#FFFFFF'], spring: ['#F6B8CF', '#F29BBA', '#FFFFFF'], summer: ['#4F9A3A', '#3F8530', '#69B44E'] };

  function bgLayer(season, night, wx) {
    const c = document.createElement('canvas'); c.width = W * K; c.height = H * K;
    const g = c.getContext('2d'); g.setTransform(K, 0, 0, K, 0, 0);
    const sky = night ? NIGHT : SKY[season];
    for (let i = 0; i < 3; i++) R(g, 0, i * 14, W, 14, sky[i]);
    R(g, 0, 42, W, 4, sky[2]);
    if (night) for (let i = 0; i < 22; i++) { const h = fnv('star' + i); R(g, h % W, (h >>> 8) % 36, 1, 1, i % 4 ? '#F2E9FF' : '#F0A987'); }
    else if (season === 'summer' || wx === 'sun' || wx === 'frost') { R(g, 156, 6, 12, 12, '#FFE27A'); R(g, 154, 8, 16, 8, '#FFE27A'); R(g, 158, 4, 8, 16, '#FFE27A'); R(g, 158, 8, 8, 8, '#FFF2B0'); }
    if (night) { R(g, 158, 7, 10, 8, '#F7F1D0'); R(g, 159, 6, 8, 10, '#F7F1D0'); R(g, 160, 9, 2, 2, '#E0D6A8'); R(g, 164, 12, 2, 1, '#E0D6A8'); } // луна
    // облака
    if (!night && wx !== 'sun') for (const [x, y] of [[20, 10], [92, 6], [128, 16]]) { const cc = wx === 'rain' || wx === 'snow' ? '#D9D4E6' : '#FFFFFF'; R(g, x, y, 22, 4, cc); R(g, x + 4, y - 3, 12, 3, cc); }
    // деревья за забором
    const tc = TREE[season];
    for (const [x, s] of [[40, 1], [70, .8], [118, 1.1], [150, .9], [178, 1]]) {
      const w = 22 * s, h = 18 * s, top = 44 - h - 4;
      R(g, x - 1, top + h - 2, 3, 10, '#6B4A2E');
      if (season === 'winter') { R(g, x - 6 * s, top + 4, 1, 6, '#6B4A2E'); R(g, x + 6 * s, top + 3, 1, 6, '#6B4A2E'); R(g, x - 6 * s, top + 3, 3, 1, '#FFFFFF'); R(g, x + 5 * s, top + 2, 3, 1, '#FFFFFF'); continue; }
      const blob = (cx, cy, r, c) => { R(g, cx - r, cy - r + 2, r * 2, r * 2 - 4, c); R(g, cx - r + 2, cy - r, r * 2 - 4, r * 2, c); }; // круглая крона из трёх «шаров»
      blob(x - w / 4, top + h / 2 + 1, w / 3, tc[1]); blob(x + w / 4, top + h / 2 + 1, w / 3, tc[1]); blob(x, top + h / 2 - 2, w / 2.6, tc[0]); blob(x - w / 8, top + h / 3, w / 6, tc[2]);
    }
    // земля
    const gr = GROUND[season];
    R(g, 0, 46, W, H - 46, gr[0]);
    for (let i = 0; i < 160; i++) { const h = fnv('grass' + i); R(g, h % W, 50 + (h >>> 8) % 70, 1 + (h >>> 3) % 2, 1, gr[1 + (h >>> 5) % 2]); }
    if (season === 'autumn') for (let i = 0; i < 40; i++) { const h = fnv('leaf' + i); R(g, h % W, 52 + (h >>> 8) % 66, 2, 1, ['#E8771C', '#D2502A', '#F2A93B', '#B5652A'][h % 4]); }
    if (season === 'spring') for (let i = 0; i < 26; i++) { const h = fnv('fl' + i); const x = h % W, y = 52 + (h >>> 8) % 66; R(g, x, y, 1, 1, ['#FFFFFF', '#F6E36A', '#F29BBA'][h % 3]); }
    // забор
    const fc = season === 'winter' ? '#B89A78' : '#D9B98E', fd = '#9C7650';
    R(g, 0, 37, W, 2, fd); R(g, 0, 43, W, 2, fd);
    for (let x = 2; x < W; x += 7) { R(g, x, 33, 5, 13, fc); R(g, x + 1, 32, 3, 1, fc); R(g, x + 4, 34, 1, 12, fd); if (season === 'winter') R(g, x, 32, 5, 1, '#FFFFFF'); }
    // домик слева: стена, окно, дверь (в дом)
    const wall = '#C98A5E', wall2 = '#B07450';
    R(g, 0, 12, 30, 44, wall); for (let y = 16; y < 56; y += 5) R(g, 0, y, 30, 1, wall2);
    R(g, 0, 8, 34, 5, '#7A3E4A'); R(g, 0, 6, 32, 2, '#8E4C58'); if (season === 'winter') R(g, 0, 5, 33, 2, '#FFFFFF');
    R(g, 6, 18, 12, 10, '#5B3A26'); R(g, 7, 19, 10, 8, night ? '#F7D774' : '#BFE3F2'); R(g, 11, 19, 1, 8, '#5B3A26'); R(g, 7, 22, 10, 1, '#5B3A26');
    R(g, 18, 34, 11, 21, '#5B3A26'); R(g, 19, 35, 9, 20, '#8A5634'); R(g, 20, 37, 7, 7, '#9C6640'); R(g, 20, 46, 7, 7, '#9C6640'); R(g, 26, 45, 1, 2, '#F7D774');
    R(g, 16, 55, 15, 2, '#9A8F86');
    // уют по сезону: тыквы и фонарик осенью, снеговик зимой, лейка весной и летом
    if (season === 'autumn') { pumpkinAt(g, 6, 56); pumpkinAt(g, 12, 58, .8); R(g, 31, 30, 1, 4, '#3A2A20'); R(g, 30, 34, 3, 4, '#3A2A20'); R(g, 31, 35, 1, 2, '#F7D774'); }
    if (season === 'winter') { R(g, 6, 50, 9, 7, '#FFFFFF'); R(g, 7, 44, 7, 6, '#FFFFFF'); R(g, 9, 46, 1, 1, '#2B1A51'); R(g, 11, 46, 1, 1, '#2B1A51'); R(g, 10, 47, 2, 1, '#F08A24'); R(g, 7, 49, 7, 1, '#D2502A'); }
    if (season === 'spring' || season === 'summer') { R(g, 5, 53, 7, 4, '#5FA8D8'); R(g, 11, 51, 4, 1, '#5FA8D8'); R(g, 4, 52, 1, 3, '#5FA8D8'); }
    if (wx === 'fog') { g.globalAlpha = .25; R(g, 0, 20, W, 40, '#FFFFFF'); g.globalAlpha = 1; }
    return c;
  }
  function pumpkinAt(g, x, y, s = 1) { const w = 7 * s, h = 5 * s; R(g, x, y - h, w, h, '#E8771C'); R(g, x + 1, y - h - 1, w - 2, 1, '#E8771C'); R(g, x + w / 2 - .5, y - h - 2, 1, 2, '#6B4A1E'); R(g, x + 2 * s, y - h, .5, h, '#C85E12'); R(g, x + 4.5 * s, y - h, .5, h, '#C85E12'); }

  // грядки: 3 в ряд (больше 6 — по 4)
  function bedRects(n) {
    const cols = n <= 6 ? 3 : 4, rows = Math.ceil(n / cols), x0 = 38, x1 = 188, y0 = 62, y1 = 116;
    const bw = (x1 - x0) / cols - 6, rh = (y1 - y0) / rows, bh = Math.min(15, rh - 10);
    return Array.from({ length: n }, (_, i) => ({ x: Math.round(x0 + (i % cols) * (bw + 6)), y: Math.round(y0 + Math.floor(i / cols) * rh + (rh - bh)), w: Math.round(bw), h: bh }));
  }
  function drawBed(g, r, b, season, sel) {
    const wet = b && b.wet;
    R(g, r.x - 1, r.y - 1, r.w + 2, r.h + 2, '#6B4A2E');
    R(g, r.x, r.y, r.w, r.h, wet ? '#4A2E1E' : '#8A6446');
    for (let i = 0; i < r.w / 3; i++) { const h = fnv(r.x + ':' + i); R(g, r.x + 1 + h % (r.w - 2), r.y + 1 + (h >>> 8) % (r.h - 2), 1, 1, wet ? '#3A2416' : '#A07A58'); }
    if (b && !wet) for (let i = 0; i < 3; i++) R(g, r.x + 4 + i * r.w / 3, r.y + 3 + i % 2 * 4, 3, .5, '#6E4E34'); // трещинки сухой земли
    R(g, r.x - 1, r.y + r.h - 1, r.w + 2, 2, '#9C7650'); R(g, r.x - 1, r.y + r.h + 1, r.w + 2, 1, '#6B4A2E');
    if (season === 'winter') { R(g, r.x - 1, r.y - 2, r.w + 2, 1, '#FFFFFF'); if (!b) for (let i = 0; i < 4; i++) R(g, r.x + 3 + i * r.w / 4, r.y + 4 + i % 2 * 5, 4, 2, '#FFFFFF'); }
    if (b) { R(g, r.x + 2, r.y + r.h + .5, r.w - 4, 1, '#5A3E26'); R(g, r.x + 2, r.y + r.h + .5, (r.w - 4) * b.k, 1, b.ready ? '#F7D774' : '#8ED26A'); } // полоска роста
    if (sel) { g.strokeStyle = '#F0A987'; g.lineWidth = 1; g.strokeRect(r.x - 2.5, r.y - 2.5, r.w + 5, r.h + 5); }
  }
  const TULIP = ['#E8445A', '#F6C531', '#B57BE0', '#FFFFFF', '#F29BBA'];
  function drawPlant(g, p, k, cx, by, now, i, started) {
    cx = Math.round(cx);
    const G1 = '#4F8F2E', G2 = '#6FB04A', G3 = '#94D85A';
    if (!started) { R(g, cx - 2, by - 1, 5, 1, '#5A3A24'); R(g, cx - 1, by - 2, 3, 1, '#5A3A24'); R(g, cx, by - 3, 1, 1, '#E8D8A0'); return; } // семечко в лунке
    const sway = Math.sin(now / 900 + cx) > .6 ? .5 : 0;
    if (k < .25) { R(g, cx, by - 3, 1, 3, G2); R(g, cx - 2 + sway, by - 4, 2, 1, G3); R(g, cx + 1 + sway, by - 4, 2, 1, G3); return; } // росток
    if (k < 1) { // подрастает
      const tall = TALL.includes(p) ? 12 : p === 'tulip' || p === 'bluerose' ? 8 : 5, h = Math.round(tall * (.5 + k / 2));
      if (['pumpkin', 'cabbage', 'lettuce', 'strawberry', 'goldpumpkin', 'starberry', 'mandrake'].includes(p)) {
        R(g, cx - 3, by - 3, 7, 2, G2); R(g, cx - 2 + sway, by - 5, 5, 2, G3); R(g, cx, by - 3, 1, 3, G1);
        if ((p === 'pumpkin' || p === 'goldpumpkin') && k > .6) R(g, cx - 1, by - 2, 3, 2, p === 'goldpumpkin' ? '#D8C060' : '#9BC24A');
        if (TIER_OF[p] === 'magic' && Math.floor(now / 300 + i) % 9 === 0) R(g, cx + 2, by - 6, 1, 1, '#E6D8FF'); // волшебное поблёскивает уже ростком
        return;
      }
      R(g, cx, by - h, 1, h, G1); R(g, cx - 2 + sway, by - h + 2, 2, 1, G2); R(g, cx + 1 + sway, by - h + 3, 2, 1, G2); R(g, cx - 1 + sway, by - h - 1, 3, 2, p === 'tulip' || p === 'sunflower' ? G2 : G3);
      return;
    }
    // выросло
    if (p === 'radish') { R(g, cx - 2 + sway, by - 7, 1, 3, G2); R(g, cx + sway, by - 8, 1, 4, G3); R(g, cx + 2 + sway, by - 7, 1, 3, G2); R(g, cx - 2, by - 4, 5, 3, '#D83A5A'); R(g, cx - 1, by - 5, 3, 1, '#D83A5A'); R(g, cx - 1, by - 4, 1, 1, '#F07890'); }
    else if (p === 'lettuce') { R(g, cx - 4, by - 3, 9, 3, '#7CC24A'); R(g, cx - 3, by - 5, 7, 2, G3); R(g, cx - 1, by - 6, 3, 1, '#B5EA7A'); R(g, cx - 2, by - 2, 1, 2, G1); R(g, cx + 2, by - 2, 1, 2, G1); }
    else if (p === 'carrot') { R(g, cx - 2 + sway, by - 8, 1, 5, G2); R(g, cx + sway, by - 9, 1, 6, G3); R(g, cx + 2 + sway, by - 8, 1, 5, G2); R(g, cx - 2, by - 2, 5, 2, '#F08A24'); R(g, cx - 1, by - 3, 3, 1, '#F08A24'); R(g, cx - 1, by - 2, 1, 1, '#F7B060'); }
    else if (p === 'tulip') { const c = TULIP[i % TULIP.length]; R(g, cx, by - 10, 1, 10, G1); R(g, cx - 2, by - 5, 2, 1, G2); R(g, cx - 3, by - 4, 1, 1, G2); R(g, cx + 1, by - 6, 2, 1, G2); R(g, cx - 2 + sway, by - 14, 5, 4, c); R(g, cx - 2 + sway, by - 15, 1, 1, c); R(g, cx + sway, by - 15, 1, 1, c); R(g, cx + 2 + sway, by - 15, 1, 1, c); R(g, cx - 1 + sway, by - 13, 1, 2, 'rgba(255,255,255,.35)'); }
    else if (p === 'strawberry') { R(g, cx - 4, by - 5, 9, 4, '#4F9A3A'); R(g, cx - 3, by - 6, 7, 1, '#5FAE48'); for (const [x, y] of [[-3, -3], [2, -4], [0, -2]]) { R(g, cx + x, by + y, 2, 2, '#E03A3A'); R(g, cx + x, by + y, .5, .5, '#F7D774'); } }
    else if (p === 'sunflower') { R(g, cx, by - 18, 1, 18, G1); R(g, cx - 3, by - 9, 3, 2, G2); R(g, cx + 1, by - 12, 3, 2, G2); const y = by - 24, x = cx - 3 + sway; R(g, x + 1, y, 5, 7, '#F7C531'); R(g, x, y + 1, 7, 5, '#F7C531'); R(g, x + 2, y + 2, 3, 3, '#7A4A1E'); R(g, x + 2, y + 2, 1, 1, '#9C6A34'); }
    else if (p === 'cabbage') { R(g, cx - 5, by - 3, 2, 3, '#6FAE5C'); R(g, cx + 4, by - 3, 2, 3, '#6FAE5C'); R(g, cx - 4, by - 6, 9, 6, '#9BD08A'); R(g, cx - 3, by - 7, 7, 1, '#9BD08A'); R(g, cx - 1, by - 5, 3, 2, '#C5E8B5'); R(g, cx, by - 6, 1, 5, '#7FBF6E'); }
    else if (p === 'pumpkin') { R(g, cx - 6, by - 3, 3, 2, G1); R(g, cx + 4, by - 2, 3, 2, G2); R(g, cx - 4, by - 5, 9, 5, '#E8771C'); R(g, cx - 3, by - 6, 7, 1, '#E8771C'); R(g, cx - 1, by - 5, 1, 5, '#C85E12'); R(g, cx + 2, by - 5, 1, 5, '#C85E12'); R(g, cx, by - 8, 1, 2, '#6B4A1E'); R(g, cx - 3, by - 4, 1, 2, '#F59A4A'); }
    else if (p === 'rainbowcarrot') { R(g, cx - 2 + sway, by - 8, 1, 5, G2); R(g, cx + sway, by - 9, 1, 6, G3); R(g, cx + 2 + sway, by - 8, 1, 5, G2); R(g, cx - 2, by - 3, 5, 1, '#E8445A'); R(g, cx - 2, by - 2, 5, 1, '#F6C531'); R(g, cx - 1, by - 1, 3, 1, '#4CC38A'); R(g, cx - 1, by - 4, 3, 1, '#B57BE0'); }
    else if (p === 'bluerose') { R(g, cx, by - 11, 1, 11, G1); R(g, cx - 2, by - 6, 2, 1, G2); R(g, cx + 1, by - 8, 2, 1, G2); R(g, cx - 2 + sway, by - 15, 5, 4, '#4A7BD8'); R(g, cx - 1 + sway, by - 16, 3, 1, '#4A7BD8'); R(g, cx - 1 + sway, by - 14, 3, 2, '#7FB3E8'); R(g, cx + sway, by - 14, 1, 1, '#2E4FA0'); }
    else if (p === 'goldpumpkin') { R(g, cx - 6, by - 3, 3, 2, G1); R(g, cx + 4, by - 2, 3, 2, G2); R(g, cx - 4, by - 5, 9, 5, '#E9C46A'); R(g, cx - 3, by - 6, 7, 1, '#E9C46A'); R(g, cx - 1, by - 5, 1, 5, '#C9A040'); R(g, cx + 2, by - 5, 1, 5, '#C9A040'); R(g, cx, by - 8, 1, 2, '#6B4A1E'); R(g, cx - 3, by - 4, 1, 2, '#FFF2B0'); if (Math.floor(now / 250 + i) % 5 === 0) R(g, cx + 3, by - 6, 1, 1, '#FFFFFF'); }
    else if (p === 'starberry') { R(g, cx - 4, by - 5, 9, 4, '#3F6F5A'); R(g, cx - 3, by - 6, 7, 1, '#4F8A6A'); for (const [x, y, j] of [[-3, -4, 0], [2, -5, 1], [0, -2, 2]]) { const on = Math.floor(now / 350 + i + j) % 3; R(g, cx + x, by + y, 1, 1, '#F7D774'); R(g, cx + x - 1, by + y, 3, 1, on ? '#F7D774' : '#FFF2B0'); R(g, cx + x, by + y - 1, 1, 3, on ? '#F7D774' : '#FFF2B0'); } }
    else if (p === 'moonflower') { if (NIGHT_ON) { g.globalAlpha = .25; R(g, cx - 4, by - 22, 9, 8, '#E6F0FF'); g.globalAlpha = 1; } R(g, cx, by - 16, 1, 16, G1); R(g, cx - 3, by - 8, 3, 2, G2); R(g, cx + 1, by - 11, 3, 2, G2); const y = by - 21, x = cx - 3 + sway; R(g, x + 1, y, 5, 5, '#EAF2FF'); R(g, x, y + 1, 7, 3, '#EAF2FF'); R(g, x + 2, y + 1, 3, 3, '#B9CCF4'); R(g, x + 3, y + 2, 1, 1, '#F7F1D0'); }
    else if (p === 'mandrake') { R(g, cx - 3 + sway, by - 9, 2, 4, G2); R(g, cx - 1 + sway, by - 10, 2, 5, G3); R(g, cx + 2 + sway, by - 9, 2, 4, G2); R(g, cx - 3, by - 5, 7, 4, '#C9A27A'); R(g, cx - 2, by - 6, 5, 1, '#C9A27A'); const bl = Math.floor(now / 1800 + i) % 6 === 0; R(g, cx - 2, by - 4, 1, bl ? .5 : 1, '#2B1A51'); R(g, cx + 2, by - 4, 1, bl ? .5 : 1, '#2B1A51'); R(g, cx, by - 2, 1, 1, '#7A4A3A'); }
    if (Math.floor(now / 400 + i) % 7 === 0) R(g, cx + 3, by - 10, 1, 1, '#FFFFFF'); // блик «готово»
  }
  // деревья: одно на грядку, растёт постепенно (k 0…1), по сезону — цветёт, зеленеет, желтеет, зимой голое в снегу; поспело — плоды
  const TREES = {
    cherrytree: { leaf: ['#4F9A3A', '#6FB04A'], aut: ['#D2502A', '#E8771C'], fruit: '#9C1A2E', bloom: '#F6C8D8' },
    appletree: { leaf: ['#4F9A3A', '#69B44E'], aut: ['#C8A030', '#E0B848'], fruit: '#E03A3A', bloom: '#FFFFFF', big: 2 },
    plumtree: { leaf: ['#4A8A3A', '#62A24C'], aut: ['#C88A30', '#E0A848'], fruit: '#6A3A8A', bloom: '#FFFFFF' },
    rowan: { leaf: ['#5A9A3E', '#74B455'], aut: ['#D2402A', '#E8602C'], fruit: '#E8501C', bloom: '#FFF6E0' },
    peartree: { leaf: ['#4F9A3A', '#69B44E'], aut: ['#D0A030', '#E8C048'], fruit: '#C8D850', bloom: '#FFFFFF', tall: 1.3, big: 2 },
    birch: { leaf: ['#7CC24A', '#9AD860'], aut: ['#F2C531', '#F6D860'], fruit: '#B08A40', trunk: '#EDEAE2', tall: 1.2 },
    linden: { leaf: ['#5FA048', '#78BC58'], aut: ['#E0B030', '#F0C848'], fruit: '#F2E08A', wide: 1.15 },
    spruce: { cone: 1, leaf: ['#2F6B45', '#3E8257'], fruit: '#7A4A2A' },
    pine: { pine: 1, leaf: ['#3F7A3A', '#4F8A48'], fruit: '#8A5A30', trunk: '#A0582C' },
    oak: { leaf: ['#4A7A2E', '#5E9038'], aut: ['#A0602A', '#C07830'], fruit: '#8A6030', wide: 1.35 },
  };
  function drawTree(g, p, k, cx, by, now, season, started, ready, mature) {
    const d = TREES[p] || TREES.appletree, BR = '#6B4A2E';
    cx = Math.round(cx); by = Math.round(by);
    if (!started && !mature) { R(g, cx - 2, by - 1, 5, 1, '#5A3A24'); R(g, cx, by - 5, 1, 4, BR); R(g, cx - 1, by - 6, 1, 1, '#6FB04A'); R(g, cx + 1, by - 5, 1, 1, '#6FB04A'); return; } // саженец
    const s = mature ? 1 : Math.max(.08, Math.min(1, k)), Ht = Math.round((7 + 25 * s) * (d.tall || 1)), r = Math.max(2, Math.round(2 + 8 * s)), tw = s < .35 ? 1 : 2;
    const tc = d.trunk || BR, top = by - Ht, snow = season === 'winter';
    const fruitAt = (n, fx, fy) => { for (let j = 0; j < n; j++) { const h = fnv(p + ':f' + j); fx(h); } };
    if (d.cone) { // ель: ярусы треугольником
      R(g, cx - (tw > 1 ? 1 : 0), by - 3, tw, 3, BR);
      const bot = by - 3, rr = Math.round(r * 1.05);
      for (let y = top; y < bot; y++) { const f = (y - top) / Math.max(1, bot - top), half = Math.max(0, Math.round(f * rr) - ((y - top) % 5 === 0 && y > top + 2 ? 1 : 0)); R(g, cx - half, y, half * 2 + 1, 1, d.leaf[0]); R(g, cx - half, y, Math.max(1, half), 1, d.leaf[1]); if (snow && (y - top) % 5 === 1) R(g, cx - half + 1, y, Math.max(1, half * 2 - 1), 1, '#FFFFFF'); }
      if (ready) fruitAt(5, h => { const y = top + 4 + h % Math.max(1, bot - top - 5), half = Math.round((y - top) / Math.max(1, bot - top) * rr) - 1; R(g, cx - half + (h >>> 8) % Math.max(1, half * 2), y, 1, 2, d.fruit); });
      if (season === 'winter' && Math.floor(now / 500) % 6 === 0) R(g, cx, top, 1, 1, '#F7D774');
      return;
    }
    if (d.pine) { // сосна: высокий ствол и плоская крона
      const cy = top + Math.round(r * .6), rx = r, ry = Math.max(2, Math.round(r * .6));
      R(g, cx - (tw > 1 ? 1 : 0), cy, tw, by - cy, tc); if (s > .5) R(g, cx + 1, cy + ry + 3, Math.round(r * .5), 1, tc);
      R(g, cx - rx, cy - ry + 1, rx * 2, ry * 2 - 2, d.leaf[0]); R(g, cx - rx + 1, cy - ry, rx * 2 - 2, ry * 2, d.leaf[0]); R(g, cx - rx + 2, cy - ry + 1, rx, 1, d.leaf[1]);
      if (s > .5) { R(g, cx + 1, cy + ry + 1, Math.round(r * .7), 3, d.leaf[0]); R(g, cx + 2, cy + ry + 1, Math.round(r * .4), 1, d.leaf[1]); }
      if (snow) R(g, cx - rx + 1, cy - ry, rx * 2 - 2, 1, '#FFFFFF');
      if (ready) fruitAt(4, h => R(g, cx - rx + 1 + h % Math.max(1, rx * 2 - 2), cy - ry + 2 + (h >>> 8) % Math.max(1, ry * 2 - 3), 1, 2, d.fruit));
      return;
    }
    // лиственное: ствол и круглая крона
    const rx = Math.round(r * (d.wide || 1)), ry = r, cy = top + ry;
    R(g, cx - (tw > 1 ? 1 : 0), cy, tw, by - cy, tc);
    if (d.trunk) for (let y = cy + 2; y < by - 1; y += 3) R(g, cx - (tw > 1 ? 1 : 0) + (y % 2), y, 1, 1, '#2B2B33'); // берёза: чёрные пятнышки
    if (snow) { // голые ветки в снегу
      if (s > .3) { R(g, cx - rx + 2, cy, rx - 2, 1, tc); R(g, cx - rx + 2, cy - 2, 1, 2, tc); R(g, cx + 1, cy - 2, rx - 2, 1, tc); R(g, cx + rx - 2, cy - 4, 1, 2, tc); R(g, cx - 1, cy - ry + 1, 1, ry, tc);
        R(g, cx - rx + 2, cy - 1, rx - 2, 1, '#FFFFFF'); R(g, cx + 1, cy - 3, rx - 2, 1, '#FFFFFF'); R(g, cx - 1, cy - ry, 1, 1, '#FFFFFF'); }
      R(g, cx - 2, by - 1, 5, 1, '#FFFFFF');
      if (ready) fruitAt(3, h => R(g, cx - rx + 3 + h % Math.max(1, rx * 2 - 5), cy - 1 + (h >>> 8) % 3, 1, 1, d.fruit));
      return;
    }
    const lf = season === 'autumn' ? d.aut : d.leaf;
    R(g, cx - rx, cy - ry + 2, rx * 2, ry * 2 - 4, lf[0]); R(g, cx - rx + 2, cy - ry, rx * 2 - 4, ry * 2, lf[0]);
    R(g, cx - rx + 2, cy - ry + 1, rx, 2, lf[1]); R(g, cx - rx + 1, cy - ry + 3, 2, Math.max(1, ry - 2), lf[1]);
    g.globalAlpha = .18; R(g, cx - rx + 2, cy + ry - 3, rx * 2 - 4, 2, '#1A2A10'); g.globalAlpha = 1;
    if (season === 'spring' && s > .5 && d.bloom) fruitAt(8, h => R(g, cx - rx + 1 + h % Math.max(1, rx * 2 - 2), cy - ry + 1 + (h >>> 8) % Math.max(1, ry * 2 - 2), 1, 1, d.bloom));
    if (season === 'autumn' && Math.floor(now / 700 + cx) % 5 === 0) R(g, cx - rx + (now / 90 | 0) % (rx * 2), cy + ry + ((now / 120 | 0) % Math.max(1, by - cy - ry)), 1, 1, lf[0]); // падает листик
    if (ready) fruitAt(p === 'rowan' ? 4 : 6, h => { const fx = cx - rx + 2 + h % Math.max(1, rx * 2 - 4), fy = cy - ry + 2 + (h >>> 8) % Math.max(1, ry * 2 - 4), z = d.big || 1;
      if (p === 'rowan') { R(g, fx, fy, 2, 1, d.fruit); R(g, fx, fy + 1, 1, 1, d.fruit); } else R(g, fx, fy, z, z, d.fruit); });
    if (ready && Math.floor(now / 400 + cx) % 7 === 0) R(g, cx + rx - 2, cy - ry + 1, 1, 1, '#FFFFFF');
  }
  function drawBug(g, x, y, now, i) {
    const wig = Math.floor(now / 160 + i) % 2, red = i % 3 !== 2;
    R(g, x - 2, y - 2, 4, 3, red ? '#D83A3A' : '#3A8A6A'); R(g, x - 1, y - 3, 2, 1, red ? '#D83A3A' : '#3A8A6A'); R(g, x + 2, y - 2, 1, 2, '#2B1A51');
    R(g, x, y - 3, .5, 3, '#2B1A51'); if (red) { R(g, x - 1.5, y - 1.5, 1, 1, '#2B1A51'); R(g, x + .5, y - .5, 1, 1, '#2B1A51'); }
    R(g, x - 2 + wig, y + 1, 1, .5, '#2B1A51'); R(g, x + wig, y + 1, 1, .5, '#2B1A51');
  }
  // иконка растения для панели (выросшее, 16×16 × 3)
  const icons = {};
  function icon(p) {
    if (icons[p]) return icons[p];
    const c = document.createElement('canvas'), k = 3; c.width = 16 * k; c.height = 18 * k;
    const g = c.getContext('2d'); g.setTransform(k, 0, 0, k, 0, 0);
    if (isTree(p)) { g.setTransform(k / 2, 0, 0, k / 2, 0, 0); drawTree(g, p, 1, 16, 35, 0, 'summer', true, true, true); } // дерево — вдвое мельче
    else drawPlant(g, p, 1, 8, TALL.includes(p) ? 17 : 15, 1, 0, true);
    return (icons[p] = c.toDataURL());
  }
  const pic = p => `<img class="gd-ic" src="${icon(p)}" alt="" width="24" height="27">`;

  // погода дня: по сезону и дню (одна на всех)
  function weatherOf(season, day) {
    const opts = { autumn: ['leaves', 'leaves', 'rain', 'fog'], winter: ['snow', 'snow', 'frost'], spring: ['petals', 'petals', 'sun', 'rain'], summer: ['sun', 'butterflies', 'sun'] }[season];
    return opts[fnv(day + ':wx') % opts.length];
  }
  function particles(season, wx) {
    const n = wx === 'rain' ? 60 : wx === 'snow' ? 50 : wx === 'leaves' || wx === 'petals' ? 16 : wx === 'butterflies' ? 5 : season === 'autumn' ? 6 : season === 'winter' ? 12 : 0;
    return Array.from({ length: n }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, s: .3 + Math.random() * .7, c: i % 3 }));
  }

  // ---------- страница ----------
  let D = null, sel = -1, busy = false;
  const nick = (new URLSearchParams(location.search).get('nick') || '').replace(/^@/, '');
  async function load() {
    try { D = await api(nick ? '?nick=' + encodeURIComponent(nick) : ''); } catch (e) { D = null; }
    render();
    if (D && D.found && D.found.length) { const m = t('found', D.found.map(x => cname(x.p)).join(', ')); float(m); toast(m); if (window.PPNews && window.PPNews.refresh) window.PPNews.refresh(); } // семена из игр и за серии — новость «🌱» гаснет
  }
  let scene = null;
  function render() {
    if (!D) { app.innerHTML = `<p class="gd-note">${t('oops')}</p>`; return; }
    if (!D.owner) {
      app.innerHTML = nick ? `<p class="gd-note">${t('none')}</p>` : `<div class="bp-sign"><p>${t('sign')}</p><button type="button" class="cta-btn" id="gd-in">${t('signBtn')}</button></div>`;
      const b = document.getElementById('gd-in'); if (b) b.onclick = () => window.PPAccount && window.PPAccount.openSignIn();
      return;
    }
    if (!scene) mountScene();
    panel();
  }
  function mountScene() {
    const o = D.owner;
    app.innerHTML = `<div class="gd-bar"><span class="gd-cap">🥕 ${esc(t('of').replace('{n}', o.nick))}</span><span class="gd-wx"></span><a class="pill-btn gd-home" href="${pre}/bird/?nick=${encodeURIComponent(o.nick)}#room">${t('home')}</a></div>
      <div class="gd-stage"><canvas class="gd-cv" width="${W * K}" height="${H * K}" role="img" aria-label="${esc(t('of').replace('{n}', o.nick))}"></canvas><div class="gd-float" aria-live="polite"></div></div>
      <div class="gd-panel"></div>`;
    const cv = app.querySelector('.gd-cv'), g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    const season = D.season || 'autumn', wx = weatherOf(season, D.today || ''), hr = +new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Riga', hour: '2-digit', hour12: false });
    const night = hr >= 19 || hr < 7; NIGHT_ON = night;
    app.querySelector('.gd-wx').textContent = T.seasons[season][L] + ' · ' + T.weather[wx][L];
    const bg = bgLayer(season, night, wx), parts = particles(season, wx);
    let FR = null;
    try { const B = window.PPBirds; FR = [0, 1, 2].map(f => B.sprite(B.dress(B.looks(o.id), o.avatar || {}), f)); } catch (e) { FR = null; }
    const bird = { x: 60, y: 57, tx: 60, ty: 57, dir: 1, frame: 0, wait: 0, peck: 0 };
    const lanes = () => { const rs = bedsAt(); return [57, ...new Set(rs.map(r => Math.min(H - 2, r.y + r.h + 4)))]; };
    scene = { cv, g, bug: null };
    const hitBug = (x, y) => (D.bugs || []).find(b => { const p = bugPos(b); return Math.abs(p.x - x) < 6 && Math.abs(p.y - y) < 6; });
    const bugPos = b => { const r = bedsAt()[b.bed] || { x: 60, y: 70, w: 40, h: 14 }; return { x: r.x + 3 + (r.w - 6) * b.x / 100, y: r.y + r.h / 2 + 1 }; };
    let last = 0;
    function frame(now) {
      if (!cv.isConnected) return;
      requestAnimationFrame(frame);
      if (now - last < 33) return; last = now;
      g.setTransform(K, 0, 0, K, 0, 0); g.imageSmoothingEnabled = false;
      g.drawImage(bg, 0, 0, W, H);
      const GI = window.PPGardenItems; // вещи для огорода: вдоль забора и под домиком (garden-items.js) или где поставил хозяин (pos)
      const its = GI ? GI.layout(shown(), POS()).filter(it => !it.over || EDIT) : [];
      const rs = bedsAt();
      // птичка: гуляет по дорожкам между грядками, иногда клюёт
      if (bird.wait > 0) { bird.wait--; bird.frame = bird.peck > 0 && Math.floor(now / 200) % 2 ? 2 : 0; if (bird.peck > 0) bird.peck--; }
      else {
        const dx = bird.tx - bird.x, dy = bird.ty - bird.y, d = Math.hypot(dx, dy);
        if (d < 1 && bird.next) { bird.tx = bird.next[0]; bird.ty = bird.next[1]; bird.next = bird.next[2]; }
        else if (d < 1) { // постоять, иногда поклевать, потом — на другую дорожку (по краю, мимо грядок)
          bird.wait = 20 + Math.random() * 80; bird.peck = Math.random() < .5 ? 30 : 0;
          const ls = lanes(), ty = ls[Math.floor(Math.random() * ls.length)], tx = 36 + Math.random() * 148;
          if (Math.abs(ty - bird.y) > 1) { bird.tx = 33; bird.next = [33, ty, [tx, ty]]; } else bird.tx = tx;
        }
        else { bird.x += dx / d * .6; bird.y += dy / d * .6; bird.dir = dx < 0 ? -1 : 1; bird.frame = Math.floor(now / 160) % 2; }
      }
      const drawB = () => {
        if (!FR) return;
        const c = FR[bird.frame] || FR[0], k = .75, w = c.width * k, h = c.height * k;
        g.save(); if (bird.dir < 0) { g.translate(Math.round(bird.x) * 2, 0); g.scale(-1, 1); }
        g.drawImage(c, Math.round(bird.x) - w / 2, Math.round(bird.y) - h + 1, w, h); g.restore();
      };
      // всё по глубине: что ниже на сцене — то ближе (вещи, грядки, птичка)
      const L2 = [];
      its.forEach(it => { const d = GI.ITEMS[it.v]; L2.push([it.y + d.h, 0, () => {
        if (it.over) g.globalAlpha = .6;
        GI.draw(g, it.v, it.x, it.y, now, { night, season });
        g.globalAlpha = 1;
        if (EDIT) { g.strokeStyle = EDIT.drag && EDIT.drag.key === 'i:' + it.v ? '#F0A987' : 'rgba(255,255,255,.75)'; g.lineWidth = .5; g.strokeRect(it.x - .5, it.y - .5, d.w + 1, d.h + 1); }
      }]); });
      rs.forEach((r, i) => L2.push([r.y + r.h, 1, () => {
        const b = D.beds[i];
        drawBed(g, r, b, season, D.mine && sel === i && !EDIT);
        if (b && isTree(b.p)) drawTree(g, b.p, b.k, r.x + r.w / 2, r.y + r.h - 3, now, season, b.k > 0 || b.wet, b.ready, b.m);
        else if (b) for (let j = 0; j < 3; j++) drawPlant(g, b.p, b.k, r.x + r.w * (1 + j * 2) / 6, r.y + r.h - 3, now, i * 3 + j, b.k > 0 || b.wet);
        if (D.mine && !EDIT && b && !b.today && !b.ready) { const x = r.x + r.w - 2, y = r.y - 4 + Math.round(Math.sin(now / 300 + i)); R(g, x - 1, y, 4, 4, '#5FB8F0'); R(g, x, y - 1, 2, 1, '#5FB8F0'); R(g, x + .5, y - 2, 1, 1, '#5FB8F0'); R(g, x, y + 1, 1, 1, '#BFE6FA'); } // капля на углу грядки: полей сегодня
        if (EDIT) { g.strokeStyle = EDIT.drag && EDIT.drag.key === 'b' + i ? '#F0A987' : 'rgba(255,255,255,.75)'; g.lineWidth = .5; g.strokeRect(r.x - 2.5, r.y - 2.5, r.w + 5, r.h + 5); }
      }]));
      L2.push([bird.y, 2, drawB]);
      L2.sort((a, b) => a[0] - b[0] || a[1] - b[1]).forEach(x => x[2]());
      (D.bugs || []).forEach(b => { const p = bugPos(b), mv = Math.sin(now / 700 + b.i) * 2; drawBug(g, p.x + mv, p.y, now, b.i); });
      // погода
      for (const p of parts) {
        if (wx === 'rain') { p.y += 3 * p.s + 1; p.x -= .4; R(g, p.x, p.y, .5, 2, 'rgba(160,190,230,.8)'); }
        else if (wx === 'snow' || season === 'winter') { p.y += .3 * p.s + .1; p.x += Math.sin(now / 900 + p.y / 9) * .2; R(g, p.x, p.y, 1, 1, '#FFFFFF'); }
        else if (wx === 'petals') { p.y += .25 * p.s + .1; p.x += Math.sin(now / 700 + p.y / 7) * .3; R(g, p.x, p.y, 1.5, 1, p.c ? '#F6B8CF' : '#FFFFFF'); }
        else if (wx === 'butterflies') { p.x += Math.sin(now / 1500 + p.s * 9) * .4; p.y = 50 + (p.s * 60) + Math.sin(now / 400 + p.s * 20) * 3; const f = Math.floor(now / 150 + p.s * 9) % 2; R(g, p.x - 1, p.y, 1, f ? 2 : 1, p.c ? '#F6C531' : '#F29BBA'); R(g, p.x + 1, p.y, 1, f ? 2 : 1, p.c ? '#F6C531' : '#F29BBA'); }
        else { p.y += .2 * p.s + .1; p.x += Math.sin(now / 800 + p.y / 6) * .4; R(g, p.x, p.y, 2, 1, ['#E8771C', '#D2502A', '#F2A93B'][p.c]); }
        if (p.y > H) { p.y = -2; p.x = Math.random() * W; } if (p.x < -2) p.x = W; if (p.x > W + 2) p.x = 0;
      }
      if (night) { g.globalAlpha = .18; R(g, 0, 0, W, H, '#1A0F38'); g.globalAlpha = 1; }
    }
    requestAnimationFrame(frame);
    const at = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; };
    // ✋ перестановка: тащим грядку или вещь (что ближе к зрителю — то и берём), место — в EDIT.pos до «Сохранить»
    const grab = p => {
      const GI = window.PPGardenItems, cand = [];
      if (GI) GI.layout(shown(), POS()).forEach(it => { const d = GI.ITEMS[it.v]; if (p.x >= it.x - 1 && p.x <= it.x + d.w + 1 && p.y >= it.y - 1 && p.y <= it.y + d.h + 1) cand.push({ key: 'i:' + it.v, x: it.x, y: it.y, w: d.w, h: d.h, z: 500 + it.y + d.h }); });
      bedsAt().forEach((r, i) => { // земля грядки — точное попадание; над ней — растение или дерево (по росту) — слабее, чем вещь
        const b = D.beds[i], up = !b ? 0 : isTree(b.p) ? Math.round(b.m ? 32 : 6 + 26 * b.k) : 12, inX = p.x >= r.x - 3 && p.x <= r.x + r.w + 3;
        if (inX && p.y >= r.y - 3 && p.y <= r.y + r.h + 3) cand.push({ key: 'b' + i, x: r.x, y: r.y, w: r.w, h: r.h, z: 1000 + r.y + r.h, bed: 1 });
        else if (inX && p.y >= r.y - up && p.y < r.y) cand.push({ key: 'b' + i, x: r.x, y: r.y, w: r.w, h: r.h, z: r.y + r.h - 500, bed: 1 });
      });
      return cand.sort((a, b) => b.z - a.z)[0];
    };
    const place = (q, x, y) => {
      x = Math.round(x); y = Math.round(y);
      if (q.bed) { x = Math.max(32, Math.min(W - 2 - q.w, x)); y = Math.max(50, Math.min(H - 3 - q.h, y)); }
      else { x = Math.max(0, Math.min(W - q.w, x)); y = Math.max(44 - q.h, Math.min(H - q.h, y)); }
      EDIT.pos[q.key] = [x, y];
    };
    cv.addEventListener('pointerdown', e => {
      if (!EDIT) return;
      const p = at(e), q = grab(p); if (!q) return;
      e.preventDefault(); cv.setPointerCapture(e.pointerId);
      EDIT.drag = { ...q, dx: p.x - q.x, dy: p.y - q.y };
      place(EDIT.drag, q.x, q.y); // вещь, что не влезла, становится на своё место сразу
    });
    cv.addEventListener('pointermove', e => { if (!EDIT || !EDIT.drag) return; const p = at(e); place(EDIT.drag, p.x - EDIT.drag.dx, p.y - EDIT.drag.dy); });
    const drop = () => { if (EDIT && EDIT.drag) { EDIT.drag = null; EDIT.moved = true; panel(); } };
    cv.addEventListener('pointerup', drop); cv.addEventListener('pointercancel', drop);
    cv.addEventListener('click', e => {
      if (EDIT) return;
      const p = at(e);
      if (p.x >= 18 && p.x <= 29 && p.y >= 34 && p.y <= 55) { location.href = app.querySelector('.gd-home').href; return; } // дверь домика — обратно в дом
      if (!D.mine) return;
      const bug = hitBug(p.x, p.y);
      if (bug) { catchBug(bug); return; }
      const i = bedsAt().findIndex(r => p.x >= r.x - 3 && p.x <= r.x + r.w + 3 && p.y >= r.y - 18 && p.y <= r.y + r.h + 3);
      if (i >= 0) { sel = i; panel(); const pn = app.querySelector('.gd-sel'); if (pn && pn.getBoundingClientRect().bottom > innerHeight) pn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    });
    cv.addEventListener('pointermove', e => { const p = at(e); if (EDIT) { cv.style.cursor = EDIT.drag ? 'grabbing' : grab(p) ? 'grab' : ''; return; } cv.style.cursor = (p.x >= 18 && p.x <= 29 && p.y >= 34 && p.y <= 55) || (D.mine && (hitBug(p.x, p.y) || bedsAt().some(r => p.x >= r.x - 3 && p.x <= r.x + r.w + 3 && p.y >= r.y - 18 && p.y <= r.y + r.h + 3))) ? 'pointer' : ''; });
  }
  const shown = () => (D.items || []).filter(v => !(D.hide || []).includes(v)); // вещи огорода, которые стоят на сцене
  // перестановка: места грядок и вещей — D.pos с сервера или EDIT.pos, пока хозяин двигает
  let EDIT = null;
  const POS = () => (EDIT ? EDIT.pos : D.pos) || {};
  const bedsAt = () => bedRects(D.beds.length).map((r, i) => { const q = POS()['b' + i]; return q ? { ...r, x: q[0], y: q[1] } : r; });
  function editMode(on) {
    EDIT = on ? { pos: { ...(D.pos || {}) }, drag: null } : null;
    const cv = app.querySelector('.gd-cv'); if (cv) { cv.style.touchAction = on ? 'none' : ''; cv.classList.toggle('gd-edit', !!on); }
    panel();
  }
  function float(msg) { const f = app.querySelector('.gd-float'); if (!f) return; f.textContent = msg; f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); }
  function setButtons(n) { if (n != null && window.PPAccount && window.PPAccount.setButtons) window.PPAccount.setButtons(n); }
  async function act(path, body, ok) {
    if (busy) return; busy = true;
    try { const r = await api('/' + path, body); D = { ...D, ...r }; setButtons(r.buttons); ok && ok(r); }
    catch (e) { if (e === 402) toast(t('poor')); else if (e === 409) { await load(); } else toast(t('oops')); }
    busy = false; panel();
  }
  function catchBug(b) { D.bugs = D.bugs.filter(x => x !== b); act('bug', { i: b.i }, r => { const m = r.got ? t('caught', r.got) : t('caught0'); float(m); toast(m); }); }

  // панель под сценой: выбранная грядка, корзинка, семена, жуки
  function panel() {
    const box = app.querySelector('.gd-panel'); if (!box) return;
    if (!D.mine) { box.innerHTML = `<p class="gd-note">${t('guest')}</p>`; return; }
    if (EDIT) { // ✋ перестановка
      const GI = window.PPGardenItems, over = GI ? GI.layout(shown(), D.pos || {}).filter(it => it.over).length : 0;
      box.innerHTML = `<section class="gd-sel gd-move"><h3>${t('move')}</h3><p>${t('moveHint')}</p>${over ? `<p class="gd-note">${t('moveOver', over)}</p>` : ''}
        <div class="gd-row"><button type="button" class="cta-btn" data-mv="save">${t('moveSave')}</button><button type="button" class="pill-btn" data-mv="cancel">${t('moveCancel')}</button><button type="button" class="pill-btn" data-mv="reset">${t('moveReset')}</button></div></section>`;
      box.querySelectorAll('[data-mv]').forEach(b => { b.onclick = () => {
        const k = b.dataset.mv, pos = EDIT.pos;
        if (k === 'cancel') return editMode(false);
        EDIT = null; app.querySelector('.gd-cv').style.touchAction = '';
        act('move', k === 'reset' ? { reset: true } : { pos }, () => float(t('moveSaved')));
      }; });
      return;
    }
    const beds = D.beds || [], P = D.prices || {};
    const need = beds.filter(b => b && !b.today && !b.ready).length;
    let h = `<div class="gd-row">${need ? `<button type="button" class="cta-btn gd-water-all">${t('waterAll', need)}</button>` : beds.some(Boolean) ? `<span class="gd-ok">${t('watered')}</span>` : ''}</div>`;
    if (!D.on) h += `<p class="gd-note">${t('off')}</p>`;
    // выбранная грядка
    if (sel >= 0 && sel < beds.length) {
      const b = beds[sel];
      h += `<section class="gd-sel"><h3>${t('bed', sel + 1)}${b ? ' · ' + esc(cname(b.p)) : ''}</h3>`;
      if (!b) {
        const have = Object.keys(CROP).filter(k => D.seeds[k] > 0);
        h += `<p>${t('empty')}</p>` + (have.length ? `<div class="gd-chips">${have.map(k => `<button type="button" class="gd-chip" data-plant="${k}">${pic(k)}<span>${esc(cname(k))}</span><b>×${D.seeds[k]}</b></button>`).join('')}</div>` : `<p class="gd-note">${t('noSeeds')}</p>`);
      } else {
        const st = b.ready ? (isTree(b.p) ? t('treeReady') : t('ready')) : b.m ? [t('treeGrown', dur(b.left)), b.today ? t('wetToday') : b.wet ? t('wetYet') : t('dry')].join(' · ') : [t('left', dur(b.left)), b.today ? t('wetToday') : b.k === 0 && !b.wet ? t('seedNew') : b.wet ? t('wetYet') : t('dry')].join(' · ');
        h += `<div class="gd-info">${pic(b.p)}<p>${st}</p></div><div class="gd-row">${b.ready ? `<button type="button" class="cta-btn" data-harvest>${t('harvest')}</button>` : !b.today ? `<button type="button" class="cta-btn" data-water>${t('water')}</button>` : ''}<button type="button" class="pill-btn gd-dig" data-dig>${t('dig')}</button></div>`;
      }
      h += '</section>';
    } else h += `<p class="gd-note">${t('tapBed')}</p>`;
    // жуки
    const nb = (D.bugs || []).length;
    h += `<section class="gd-box"><h3>${t('bugsHead')}</h3><p>${nb ? t('bugsNow', nb) : t('bugsNone')} ${D.bugsGot ? t('bugsGot', D.bugsGot) : ''} ${nb ? '' : D.bugsLater ? t('bugsLater') : D.bugsGot ? t('bugsDone') : ''}</p><p class="gd-note">${t('bugsRule', D.bugBtn || 0)}</p></section>`;
    // корзинка
    const crop = Object.keys(CROP).filter(k => D.crop[k] > 0);
    h += `<section class="gd-box"><h3>${t('basket')}</h3>${crop.length ? `<div class="gd-list">${crop.map(k => `<div class="gd-item">${pic(k)}<span>${esc(hname(k))} ×${D.crop[k]}</span><button type="button" class="pill-btn" data-sell="${k}">${t('sell', (P[k] ? P[k].sell : 0) * D.crop[k])}</button></div>`).join('')}</div>` : `<p class="gd-note">${t('basket0')}</p>`}</section>`;
    // семена
    const seeds = Object.keys(CROP).filter(k => D.seeds[k] > 0);
    h += `<section class="gd-box"><h3>${t('seeds')}</h3>${seeds.length ? `<div class="gd-chips">${seeds.map(k => `<span class="gd-chip gd-chip-s">${pic(k)}<span>${esc(cname(k))}</span><b>×${D.seeds[k]}</b></span>`).join('')}</div>` : `<p class="gd-note">${t('seeds0')}</p>`}
      <button type="button" class="pill-btn gd-shop-btn">${t('shop')}</button></section>`;
    // особые семена: серии до редкого и волшебного
    const wk = D.week || {}, line = (k, w) => w ? `<li>${t(k, w.n, w.need)}${w.got ? ' ' + t('gotSeed', esc(cname(w.got))) : ''}<span class="gd-bar-p"><i style="width:${Math.round(100 * w.n / Math.max(1, w.need))}%"></i></span></li>` : '';
    h += `<section class="gd-box"><h3>${t('specialHead')}</h3><ul class="gd-week">${line('rare', wk.rare)}${line('magic', wk.magic)}</ul><p class="gd-note">${t('specialNote')}</p></section>`;
    // вещи огорода: спрятать / вернуть
    const GI = window.PPGardenItems, its = (D.items || []).filter(v => GI && GI.ITEMS[v]);
    const overN = GI ? GI.layout(shown(), D.pos || {}).filter(it => it.over).length : 0; // не влезло — ждут перестановки
    h += `<section class="gd-box"><h3>${t('itemsHead')}</h3>${its.length ? `<div class="gd-chips gd-things">${its.map(v => `<button type="button" class="gd-chip${(D.hide || []).includes(v) ? ' off' : ''}" data-thing="${esc(v)}" aria-pressed="${!(D.hide || []).includes(v)}"><span class="gd-thing-ic" data-ic="${esc(v)}"></span><span>${esc(GI.name(v, L))}</span></button>`).join('')}</div><p class="gd-note">${t('itemsNote')}</p>${overN ? `<p class="gd-note gd-over">${t('moveOver', overN)}</p>` : ''}` : `<p class="gd-note">${t('items0')}</p>`}
      <a class="pill-btn" href="${pre}/shop/#room:garden">${t('itemsShop')}</a> <button type="button" class="pill-btn gd-move-btn">${t('move')}</button></section>`;
    h += `<p class="gd-note gd-how">${t('how')}</p>`;
    box.innerHTML = h;
    const on = (sel2, f) => box.querySelectorAll(sel2).forEach(b => { b.onclick = () => f(b); });
    const boost = r => r.boost > 0 ? ' 🍵 +' + r.boost + ['h', 'ч', 'h'][L] : ''; // блюдо с кухни «быстрее растёт» (этап 89)
    on('.gd-water-all', () => act('water', { all: true }, r => float('💧 ×' + r.watered + boost(r))));
    on('[data-water]', () => act('water', { bed: sel }, r => float('💧' + boost(r))));
    on('[data-harvest]', () => { const p = D.beds[sel] && D.beds[sel].p; act('harvest', { bed: sel }, r => { const m = p === 'mandrake' ? t('mandrake') : t('gotCrop', hname(p) + (r.n > 1 ? ' ×' + r.n : '')); float(m); toast(m); }); });
    on('[data-dig]', () => { if (confirm(t('digAsk'))) act('dig', { bed: sel }, () => float('🪓')); });
    on('.gd-move-btn', () => { editMode(true); const st = app.querySelector('.gd-stage'); if (st && st.getBoundingClientRect().top < 0) st.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    on('[data-plant]', b => act('plant', { bed: sel, seed: b.dataset.plant }, () => float('🌱')));
    on('[data-sell]', b => act('sell', { crop: b.dataset.sell }, r => { const m = t('sold', r.got || 0); float(m); toast(m); }));
    on('.gd-shop-btn', shop);
    box.querySelectorAll('[data-ic]').forEach(e => e.appendChild(GI.icon(e.dataset.ic, 28)));
    on('[data-thing]', b => act('hide', { item: b.dataset.thing, on: !(D.hide || []).includes(b.dataset.thing) }));
  }
  function shop() {
    const P = D.prices || {}, dlg = document.createElement('dialog');
    dlg.className = 'gd-dlg';
    const draw = () => {
      dlg.innerHTML = `<h3>${t('shopHead')}</h3><p class="gd-note">${t('shopNote')}</p><div class="gd-list">${Object.keys(CROP).filter(k => P[k] && P[k].seed != null).map((k, j, a) => `${isTree(k) && !isTree(a[j - 1]) ? `<h4 class="gd-sub">${t('saplings')}</h4><p class="gd-note">${t('saplingsNote')}</p>` : ''}<div class="gd-item">${pic(k)}<span>${esc(cname(k))}<small> · ${t('days', P[k].days)}${P[k].again ? ' · ' + t('again', P[k].again) : ''} · → ${P[k].sell} 🔘${D.seeds[k] ? ` · ×${D.seeds[k]}` : ''}</small></span><button type="button" class="pill-btn" data-buy="${k}"${P[k].seed > (D.buttons || 0) ? ' disabled' : ''}>${P[k].seed ? t('buy', P[k].seed) : t('buyFree')}</button></div>`).join('')}</div>
        <p class="gd-note">🔘 ${D.buttons || 0}</p><button type="button" class="pill-btn gd-close">${t('close')}</button>`;
      dlg.querySelector('.gd-close').onclick = () => dlg.close();
      dlg.querySelectorAll('[data-buy]').forEach(b => { b.onclick = () => act('buy', { seed: b.dataset.buy }, () => float('🌱 +1')).then(draw); });
    };
    draw(); document.body.appendChild(dlg); dlg.addEventListener('close', () => dlg.remove()); dlg.showModal();
  }
  window.PPGardenPlants = { icon, name: cname, CROP };
  if (!app) return;
  load();
  setInterval(() => { if (!document.hidden && !busy && D && D.owner) api(nick ? '?nick=' + encodeURIComponent(nick) : '').then(d => { D = d; panel(); }).catch(() => {}); }, 60000); // жуки вылезают, таймеры тикают
})();
