// Игра «Блинная Полли» (/pancakes/, docs/games.md): Полли печёт блины жителям Воббленда. Уровень — один житель со своим заказом.
// Ход уровня: выбрать сковородку (форма блина) → держать «Лить тесто» до зелёной полосы → перевернуть и снять вовремя (прожарка из заказа)
// → добавить топпинги из заказа → подать. Ошибки не проваливают уровень, но клиент доволен меньше; совсем недовольный — минус сердечко (их 3).
// Каждые info.wash уровней сковородку надо помыть пальцем: средство — info.soap 🔘 (сервер списывает), без него — водой, дольше.
// Пуговки, рекорды, вещи и бейджи — сервер (worker/pancakes.js): /api/pancakes, /api/pancakes/{start,level,wash,up}.
// Прокачка (этап 25): старт с пройденного рубежа и улучшения UPS за пуговки (info.ups). Клиенты (этап 26): постоянные гости захода (roster), характеры TRAITS,
// Медведь-курьер с заляпанным заказом (BEAR, угадал — luck: трое следующих довольны). Топпинги (этап 27): пиксельные спрайты SPR — на блине, в карточках и в заказе.
(() => {
  const app = document.getElementById('pancakes');
  if (!app) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const T = {
    title: ['Polly’s Pancakes', 'Блинная Полли', 'Pollijas pankūkas'],
    how: ['Wobbleland residents come to Polly’s window one by one, and everyone wants something different. Pick the pan for the shape, pour the batter, flip at the right moment and add exactly the toppings from the order.',
      'К окошку Полли по одному приходят жители Воббленда, и у каждого свой заказ. Выбери сковородку под форму, налей тесто, переверни вовремя и добавь ровно те топпинги, что в заказе.',
      'Pie Pollijas lodziņa pa vienam nāk Wobbleland iedzīvotāji, un katram ir savs pasūtījums. Izvēlies pannu formai, ielej mīklu, apgriez īstajā brīdī un pieliec tieši tās piedevas, kas pasūtījumā.'],
    rules: ['A mistake is not the end: the customer is just less happy. A very unhappy customer takes a heart ❤️, and there are 3. Every 5 levels a heart comes back.',
      'Ошибка — не конец: клиент просто доволен меньше. Совсем недовольный забирает сердечко ❤️, их 3. Каждые 5 уровней сердечко возвращается.',
      'Kļūda nav beigas: klients vienkārši ir mazāk apmierināts. Ļoti neapmierināts klients atņem sirsniņu ❤️, to ir 3. Ik pēc 5 līmeņiem sirsniņa atgriežas.'],
    washRule: [(n, s) => `Every ${n} levels the pan must be washed: rub it with your finger. Washing-up liquid costs ${s} 🔘; with plain water it takes longer.`, (n, s) => `Каждые ${n} уровней сковородку надо помыть: три её пальцем. Средство для мытья — ${s} 🔘, просто водой — дольше.`, (n, s) => `Ik pēc ${n} līmeņiem panna jānomazgā: berz to ar pirkstu. Trauku mazgāšanas līdzeklis maksā ${s} 🔘, ar tīru ūdeni — ilgāk.`],
    pay: [p => `Each level gives +${p} 🔘, from level 11 +${p * 2} 🔘, from 21 +${p * 3} 🔘 and so on. Every level pays once a day.`, p => `За каждый уровень +${p} 🔘, с 11-го +${p * 2} 🔘, с 21-го +${p * 3} 🔘 и так далее. Каждый уровень платит раз в день.`, p => `Par katru līmeni +${p} 🔘, no 11. +${p * 2} 🔘, no 21. +${p * 3} 🔘 un tā tālāk. Katrs līmenis maksā reizi dienā.`],
    recRule: [n => `🏆 New personal record: +${n} 🔘 more for every level above your old one.`, n => `🏆 Новый личный рекорд: ещё +${n} 🔘 за каждый уровень выше прежнего.`, n => `🏆 Jauns personīgais rekords: vēl +${n} 🔘 par katru līmeni virs iepriekšējā.`],
    itemRule: [n => `Every ${n} levels a grateful customer leaves a gift from the shop, one you don’t have yet 🎁`, n => `Каждые ${n} уровней благодарный клиент оставляет подарок из магазина, которого у тебя ещё нет 🎁`, n => `Ik pēc ${n} līmeņiem pateicīgs klients atstāj dāvanu no veikala, kuras tev vēl nav 🎁`],
    today0: [n => `Today: +${n} 🔘`, n => `Сегодня: +${n} 🔘`, n => `Šodien: +${n} 🔘`],
    payOff: ['Buttons for the game are switched off for now: play for the record!', 'Пуговки за игру сейчас выключены: играем за рекорд!', 'Pogas par spēli pašlaik ir izslēgtas: spēlējam rekorda dēļ!'],
    guest: ['Sign in to earn buttons and get into the record table.', 'Войдите, чтобы получать пуговки и попасть в таблицу рекордов.', 'Ienāc, lai saņemtu pogas un tiktu rekordu tabulā.'],
    signin: ['Sign in', 'Войти', 'Ienākt'],
    play: ['▶ Open the window', '▶ Открыть окошко', '▶ Atvērt lodziņu'], again: ['↻ Bake again', '↻ Ещё раз', '↻ Vēlreiz'], resume: ['▶ Continue', '▶ Продолжить', '▶ Turpināt'],
    paused: ['Pause', 'Пауза', 'Pauze'], pauseBtn: ['Pause', 'Пауза', 'Pauze'],
    best: [n => `Your record: level ${n}`, n => `Твой рекорд: уровень ${n}`, n => `Tavs rekords: ${n}. līmenis`],
    lv: ['Level', 'Уровень', 'Līmenis'],
    over: ['The window is closed', 'Окошко закрыто', 'Lodziņš ir slēgts'],
    reached: [n => `Customers served: ${n}`, n => `Накормлено жителей: ${n}`, n => `Pabaroti iedzīvotāji: ${n}`],
    newBest: ['🏆 New record!', '🏆 Новый рекорд!', '🏆 Jauns rekords!'],
    earned: [n => `+${n} 🔘 this game`, n => `+${n} 🔘 за эту игру`, n => `+${n} 🔘 šajā spēlē`],
    badge: [n => `🏅 New achievement: “${n}”`, n => `🏅 Новое достижение: «${n}»`, n => `🏅 Jauns sasniegums: “${n}”`],
    gotItem: [n => `🎁 The customer left a gift: ${n}! It is waiting in your profile.`, n => `🎁 Клиент оставил подарок: ${n}! Он ждёт в профиле.`, n => `🎁 Klients atstāja dāvanu: ${n}! Tā gaida profilā.`],
    // ход уровня
    pickPan: ['Which pan?', 'Какая сковородка?', 'Kura panna?'],
    pour: ['🥣 Hold to pour', '🥣 Держи — лей тесто', '🥣 Turi — lej mīklu'],
    pourHint: ['Let go in the green stripe', 'Отпусти на зелёной полоске', 'Atlaid pie zaļās svītras'],
    flip: ['🍳 Flip!', '🍳 Перевернуть!', '🍳 Apgriezt!'],
    off: ['🍽 To the plate', '🍽 На тарелку', '🍽 Uz šķīvja'],
    cookHint: ['Catch the colour from the order', 'Поймай цвет из заказа', 'Noķer krāsu no pasūtījuma'],
    serve: ['✅ Serve', '✅ Подать', '✅ Pasniegt'],
    undo: ['↩', '↩', '↩'],
    next: ['Next customer ▶', 'Следующий ▶', 'Nākamais ▶'],
    pancakeN: [(i, n) => `Pancake ${i} of ${n}`, (i, n) => `Блин ${i} из ${n}`, (i, n) => `Pankūka ${i} no ${n}`],
    bake: { light: ['light', 'светлые', 'gaišas'], gold: ['golden', 'золотистые', 'zeltainas'], crispy: ['crispy', 'поджаристые', 'kraukšķīgas'] },
    order: ['Order', 'Заказ', 'Pasūtījums'],
    // итог
    okShape: ['shape', 'форма', 'forma'], okBake: ['baking', 'прожарка', 'cepšana'], okTops: ['toppings', 'топпинги', 'piedevas'], okTime: ['in time', 'вовремя', 'laikā'],
    mood: ['😣', '😐', '🙂', '😍'],
    moodName: [['Upset', 'Не доволен', 'Pretty happy', 'Delighted!'], ['Расстроен', 'Не очень доволен', 'Доволен', 'В восторге!'], ['Bēdīgs', 'Ne pārāk apmierināts', 'Apmierināts', 'Sajūsmā!']],
    heartBack: ['+1 ❤️', '+1 ❤️', '+1 ❤️'],
    harder: [l => `Level ${l}: busier now! Customers are less patient`, l => `Уровень ${l}: народу больше! Клиенты торопятся`, l => `${l}. līmenis: vairāk ļaužu! Klienti steidzas`],
    // мытьё
    dirty: ['The pan is all greasy! Time to wash it.', 'Сковородка вся в нагаре! Пора помыть.', 'Panna ir pavisam piedegusi! Laiks to nomazgāt.'],
    soap: [s => `🧴 Washing-up liquid · ${s} 🔘`, s => `🧴 Средство · ${s} 🔘`, s => `🧴 Līdzeklis · ${s} 🔘`],
    water: ['💧 Just water (longer)', '💧 Просто водой (дольше)', '💧 Tikai ar ūdeni (ilgāk)'],
    poor: ['Not enough buttons for the liquid', 'Не хватает пуговок на средство', 'Nepietiek pogu līdzeklim'],
    soapGuest: ['Washing-up liquid is for buttons: sign in', 'Средство — за пуговки: войди', 'Līdzeklis ir par pogām: ienāc'],
    rub: [n => `Rub the pan with your finger! ${n} %`, n => `Три сковородку пальцем! ${n} %`, n => `Berz pannu ar pirkstu! ${n} %`],
    clean: ['✨ Sparkling clean!', '✨ Блестит!', '✨ Spīd!'],
    // прокачка
    from: ['Start from level', 'Начать с уровня', 'Sākt no līmeņa'],
    upsBtn: ['🛠 Upgrades', '🛠 Улучшения', '🛠 Uzlabojumi'],
    upsTitle: ['🛠 Pancake shop upgrades', '🛠 Улучшения блинной', '🛠 Pankūku bodes uzlabojumi'],
    upsHow: ['They stay forever and work in every game.', 'Остаются навсегда и работают в каждой игре.', 'Paliek uz visiem laikiem un darbojas katrā spēlē.'],
    upsGuest: ['Upgrades are for buttons: sign in.', 'Улучшения — за пуговки: войди.', 'Uzlabojumi ir par pogām: ienāc.'],
    have: [n => `You have: ${n} 🔘`, n => `У тебя: ${n} 🔘`, n => `Tev ir: ${n} 🔘`],
    buy: [n => `${n} 🔘`, n => `${n} 🔘`, n => `${n} 🔘`],
    maxed: ['✓ Max', '✓ Максимум', '✓ Maksimums'],
    back: ['← Back', '← Назад', '← Atpakaļ'],
    bought: ['✨ Upgrade bought!', '✨ Улучшение куплено!', '✨ Uzlabojums nopirkts!'],
    spare: [n => `🍳 Spare pan (${n})`, n => `🍳 Запасная (${n})`, n => `🍳 Rezerves (${n})`],
    spareOn: ['🍳 A clean pan!', '🍳 Чистая сковородка!', '🍳 Tīra panna!'],
    // клиенты
    trait: { hurry: ['⏱ in a hurry', '⏱ торопыга', '⏱ steidzas'], picky: ['🧐 picky', '🧐 привереда', '🧐 izvēlīgs'], chatty: ['💬 chatterbox', '💬 болтун', '💬 pļāpa'], same: ['🔁 a regular', '🔁 постоянный', '🔁 pastāvīgais'] },
    sameT: ['🔁 Same as last time', '🔁 Как в прошлый раз', '🔁 Tāpat kā pagājušoreiz'],
    sameHint: ['remember the order!', 'запомни заказ!', 'iegaumē pasūtījumu!'],
    plain: ['nothing on top', 'ничего сверху', 'bez nekā virsū'],
    toGo: ['🐻 TO GO', '🐻 НАВЫНОС', '🐻 LĪDZŅEMŠANAI'],
    forWho: [n => `for: ${n}`, n => `для: ${n}`, n => `kam: ${n}`],
    okGuess: ['guessed', 'угадано', 'uzminēts'], okLuck: ['🍯 bear’s luck', '🍯 удача медведя', '🍯 lāča veiksme'],
    luck: ['🐻🍯 Bear’s luck: the next 3 customers will leave happy with any pancake!', '🐻🍯 Удача медведя: следующие 3 клиента уйдут довольными при любом блинчике!', '🐻🍯 Lāča veiksme: nākamie 3 klienti aizies apmierināti ar jebkuru pankūku!'],
    noLuck: ['🐻 Not quite — but no heart lost', '🐻 Не угадано — но сердечко на месте', '🐻 Neuzminēts — bet sirsniņa paliek'],
    noSave: ['Could not save the level: buttons were not added.', 'Не получилось сохранить уровень: пуговки не начислены.', 'Neizdevās saglabāt līmeni: pogas netika pieskaitītas.'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const tr = a => a[L] || a[0];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const post = (path, body) => fetch('/api/' + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.ok ? r.json() : Promise.reject(r.status));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- формы (сковородки): inside(u, v) в квадрате −1…1; from — с какого уровня есть ----------
  const inPoly = (pts, x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const STAR = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.42 : 0.96; return [Math.cos(a) * r, Math.sin(a) * r + 0.06]; });
  const BAT_R = [[0, -0.22], [0.1, -0.5], [0.2, -0.24], [0.42, -0.42], [0.96, -0.32], [0.82, 0.02], [0.66, -0.04], [0.56, 0.24], [0.36, 0.1], [0.2, 0.38], [0, 0.24]];
  const BAT = BAT_R.concat(BAT_R.slice(1, -1).reverse().map(([x, y]) => [-x, y]));
  const TAIL = [[-0.52, 0.02], [-0.98, -0.2], [-0.96, 0.22], [-0.5, 0.38]], BEAK = [[0.66, -0.42], [0.92, -0.32], [0.66, -0.24]];
  const SHAPES = [
    { id: 'round', from: 1, n: ['Round', 'Круглая', 'Apaļā'], f: (u, v) => u * u + v * v < 0.8 },
    { id: 'heart', from: 1, n: ['Heart', 'Сердечко', 'Sirsniņa'], f: (u, v) => { const x = u * 1.22, y = -v * 1.22 + 0.22, a = x * x + y * y - 1; return a * a * a - x * x * y * y * y < 0; } },
    { id: 'square', from: 3, n: ['Square', 'Квадрат', 'Kvadrāts'], f: (u, v) => { const a = Math.abs(u), b = Math.abs(v); return a < 0.74 && b < 0.74 && !(a > 0.52 && b > 0.52 && (a - 0.52) ** 2 + (b - 0.52) ** 2 > 0.048); } },
    { id: 'star', from: 5, n: ['Star', 'Звезда', 'Zvaigzne'], f: (u, v) => inPoly(STAR, u, v) },
    { id: 'flower', from: 8, n: ['Flower', 'Цветок', 'Zieds'], f: (u, v) => { const r = Math.hypot(u, v), a = Math.atan2(v, u) + Math.PI / 2; return r < 0.5 + 0.42 * Math.abs(Math.cos(2.5 * a)); } },
    { id: 'moon', from: 12, n: ['Moon', 'Месяц', 'Mēness'], f: (u, v) => u * u + v * v < 0.82 && (u - 0.36) ** 2 + (v + 0.24) ** 2 > 0.5 },
    { id: 'bat', from: 16, n: ['Bat', 'Летучая мышь', 'Sikspārnis'], f: (u, v) => inPoly(BAT, u, v) },
    { id: 'bird', from: 20, n: ['Pigeon', 'Голубь', 'Balodis'], f: (u, v) => ((u + 0.04) / 0.62) ** 2 + ((v - 0.14) / 0.45) ** 2 < 1 || (u - 0.44) ** 2 + (v + 0.34) ** 2 < 0.075 || inPoly(TAIL, u, v) || inPoly(BEAK, u, v) },
  ];
  const SH = Object.fromEntries(SHAPES.map(s => [s.id, s]));
  const G = 40; // клеток в маске (по стороне)
  for (const s of SHAPES) { // клетки формы: x, y (0…G−1) и расстояние от середины (для растекания теста)
    s.cells = []; s.out = [];
    for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) { const u = (x + 0.5) / G * 2 - 1, v = (y + 0.5) / G * 2 - 1, r = Math.hypot(u, v); (s.f(u, v) ? s.cells : r < 1 ? s.out : []).push([x, y, r]); }
    s.maxR = Math.max(...s.cells.map(c => c[2]));
    s.minOut = Math.min(...s.out.map(c => c[2]));
  }

  // ---------- топпинги: from — с какого уровня есть; k — как лежит на блине; c — палитра спрайта (o — контур, a — цвет, b — тень, h — блик, s, g — детали) ----------
  // pieces — n штук спрайта sp; drizzle — пиксельная струйка (в карточке — банка jar или бутылка bottle); dust — посыпка (в карточке — сито); dollop — одна шапка спрайта sp
  const O = '#1a1528';
  const TOPS = [
    { id: 'berry', from: 1, k: 'pieces', n: 3, sp: 'berry', c: { o: O, a: '#E2464E', b: '#A82632', h: '#FF9A9A', s: '#FFE7A3', g: '#4E9A3F' }, nm: ['strawberries', 'клубника', 'zemenes'] },
    { id: 'honey', from: 1, k: 'drizzle', box: 'jar', c: { o: O, a: '#F2B33D', b: '#C98715', h: '#FFE08A', l: '#8C5A3C' }, nm: ['honey', 'мёд', 'medus'] },
    { id: 'sour', from: 1, k: 'dollop', sp: 'blob', c: { o: '#B9B0A0', a: '#FFF8EC', b: '#E4DCCB', h: '#FFFFFF' }, nm: ['sour cream', 'сметана', 'krējums'] },
    { id: 'choco', from: 1, k: 'drizzle', box: 'bottle', c: { o: O, a: '#6A3B22', b: '#3E2113', h: '#9C6A48', l: '#E2725B', w: '#FFF6D8' }, nm: ['chocolate', 'шоколад', 'šokolāde'] },
    { id: 'banana', from: 3, k: 'pieces', n: 3, sp: 'disc', c: { o: '#B8A040', a: '#FBEFA6', b: '#E8D77A', s: '#8C7A3A', h: '#FFF9D8' }, nm: ['banana', 'банан', 'banāns'] },
    { id: 'rasp', from: 4, k: 'pieces', n: 4, sp: 'rasp', c: { o: O, a: '#E0457B', b: '#A9234F', h: '#FFA3C2', g: '#4E9A3F' }, nm: ['raspberries', 'малина', 'avenes'] },
    { id: 'sugar', from: 5, k: 'dust', dc: ['#FFFFFF', '#F1EEF7'], c: { o: O, a: '#B9C2D0', b: '#8A93A3', h: '#E7ECF4', s: '#FFFFFF' }, nm: ['icing sugar', 'сахарная пудра', 'pūdercukurs'] },
    { id: 'milk', from: 6, k: 'drizzle', box: 'bottle', c: { o: '#9C9484', a: '#FFF4DC', b: '#E6D9BC', h: '#FFFFFF', l: '#5B8FD1', w: '#5B8FD1' }, nm: ['condensed milk', 'сгущёнка', 'iebiezinātais piens'] },
    { id: 'jam', from: 7, k: 'dollop', sp: 'jam', c: { o: O, a: '#B3243F', b: '#7E1129', h: '#F06A86', s: '#D8344F', g: '#4E9A3F' }, nm: ['cherry jam', 'вишнёвое варенье', 'ķiršu ievārījums'] },
    { id: 'kiwi', from: 8, k: 'pieces', n: 2, sp: 'kiwi', c: { o: '#5A4A2A', a: '#6DB33F', b: '#A7D86A', h: '#F4F1C8', s: O }, nm: ['kiwi', 'киви', 'kivi'] },
    { id: 'blue', from: 9, k: 'pieces', n: 5, sp: 'ball', c: { o: O, a: '#5257B8', b: '#2F3378', h: '#A9B0F0' }, nm: ['blueberries', 'черника', 'mellenes'] },
    { id: 'apple', from: 10, k: 'pieces', n: 4, sp: 'cube', c: { o: '#8A6A3A', a: '#F3E3A8', b: '#D9BE72', h: '#FFF6D0', s: '#A0602A' }, nm: ['cinnamon apple', 'яблоко с корицей', 'ābols ar kanēli'] },
    { id: 'cream', from: 11, k: 'dollop', sp: 'swirl', c: { o: '#B6AECB', a: '#FFFFFF', b: '#E6E1F0', h: '#FFFFFF' }, nm: ['whipped cream', 'взбитые сливки', 'putukrējums'] },
    { id: 'sprink', from: 12, k: 'dust', dc: ['#F27BA8', '#F2C94C', '#6FB7E8', '#7CC47F', '#FFFFFF', '#B07CE0'], rods: 1, c: { o: O, a: '#F7D2E2', b: '#E2A3BF', h: '#FFFFFF', s: '#6FB7E8' }, nm: ['sprinkles', 'цветная посыпка', 'krāsainās kaisāmās'] },
    { id: 'maple', from: 13, k: 'drizzle', box: 'bottle', c: { o: O, a: '#B8652A', b: '#7F3E14', h: '#E39A5A', l: '#C0392B', w: '#FFF6D8' }, nm: ['maple syrup', 'кленовый сироп', 'kļavu sīrups'] },
    { id: 'lingon', from: 14, k: 'pieces', n: 7, sp: 'tiny', c: { o: '#5A0F1E', a: '#D0263B', b: '#8E1426', h: '#FF8A8A' }, nm: ['lingonberries', 'брусника', 'brūklenes'] },
    { id: 'nuts', from: 15, k: 'pieces', n: 5, sp: 'nut', c: { o: O, a: '#A8743F', b: '#6E4622', h: '#D9A570' }, nm: ['nuts', 'орехи', 'rieksti'] },
    { id: 'marsh', from: 16, k: 'pieces', n: 4, sp: 'marsh', c: { o: '#A89BB8', a: '#FFE3EE', b: '#F2B8CF', h: '#FFFFFF' }, nm: ['marshmallows', 'маршмеллоу', 'zefīri'] },
    { id: 'lemon', from: 17, k: 'pieces', n: 2, sp: 'citrus', c: { o: '#9C8414', a: '#F7E35A', b: '#FFF6B0', h: '#FCEB80' }, nm: ['lemon', 'лимон', 'citrons'] },
    { id: 'chips', from: 18, k: 'pieces', n: 8, sp: 'drop', c: { o: '#24130A', a: '#5A3019', b: '#3A1E0E', h: '#8C5A3C' }, nm: ['chocolate chips', 'шоколадная крошка', 'šokolādes skaidiņas'] },
    { id: 'cheese', from: 19, k: 'pieces', n: 3, sp: 'wedge', c: { o: '#8C6510', a: '#F6CB4A', b: '#C7961A', h: '#FFE58A', s: '#D9A82A' }, nm: ['cheese', 'сыр', 'siers'] },
    { id: 'ice', from: 20, k: 'dollop', sp: 'scoop', c: { o: '#9C7A6A', a: '#FFF1DC', b: '#EBD3B4', h: '#FFFFFF', s: '#5A3019' }, nm: ['ice cream', 'шарик мороженого', 'saldējuma bumba'] },
    { id: 'pumpkin', from: 21, k: 'dollop', sp: 'swirl', c: { o: '#7A3A0A', a: '#F08A2E', b: '#B85A12', h: '#FFC07A' }, nm: ['pumpkin cream', 'тыквенный крем', 'ķirbju krēms'] },
    { id: 'mint', from: 22, k: 'pieces', n: 3, sp: 'leaf', c: { o: '#1F5A2A', a: '#4CB860', b: '#2E8A44', h: '#A6E8A8' }, nm: ['mint', 'мята', 'piparmētra'] },
    { id: 'caramel', from: 23, k: 'drizzle', box: 'jar', c: { o: O, a: '#D99443', b: '#9C5C1C', h: '#F4C27A', l: '#6A3FB0' }, nm: ['caramel', 'карамель', 'karamele'] },
    { id: 'curd', from: 24, k: 'dollop', sp: 'curd', c: { o: '#A9A08C', a: '#FFFDF4', b: '#EAE3CF', h: '#FFFFFF' }, nm: ['cottage cheese', 'творог', 'biezpiens'] },
    { id: 'worm', from: 25, k: 'pieces', n: 3, sp: 'worm', c: { o: '#5A2A1A', a: '#D6967A', b: '#9C5A44', h: '#F2C0A8' }, nm: ['worm chips', 'червячковые чипсы', 'tārpu čipsi'] },
  ];
  const TP = Object.fromEntries(TOPS.map(x => [x.id, x]));
  // спрайты: строки пикселей, буква — цвет из палитры топпинга (точка — пусто)
  const SPR = {
    berry: ['..g..g..', '...gg...', '.oaaaao.', 'oahasaao', 'oasaaaso', 'oaaasabo', '.oasabo.', '..obbo..', '...oo...'],
    rasp: ['..gg..', '.oaao.', 'oahaao', 'oaabao', 'oabaao', 'oaabao', '.obbo.', '..oo..'],
    ball: ['.ooo.', 'ohaao', 'oaaao', 'oaabo', '.ooo.'],
    tiny: ['.oo.', 'ohao', 'oabo', '.oo.'],
    disc: ['..ooo..', '.oahao.', 'oaasaao', 'oasbsao', 'oaasaao', '.oaaao.', '..ooo..'],
    kiwi: ['..oooo..', '.oaaaao.', 'oasbbsao', 'oabhhbao', 'oabhhbao', 'oasbbsao', '.oaaaao.', '..oooo..'],
    citrus: ['..oooo..', '.oaaaao.', 'oabhhbao', 'oahbbhao', 'oahbbhao', 'oabhhbao', '.oaaaao.', '..oooo..'],
    cube: ['.oooo.', 'ohhhho', 'oaasao', 'oasaao', 'oaaabo', '.oooo.'],
    nut: ['.oo..', 'ohao.', 'oaabo', '.oabo', '..oo.'],
    marsh: ['.oooo.', 'ohhhho', 'oaaaao', 'oahaao', 'oabbbo', '.oooo.'],
    drop: ['.o..', 'oao.', 'oaho', '.oo.'],
    wedge: ['o.....', 'ooo...', 'ohhoo.', 'oasaoo', 'oaaasb', 'oooooo'],
    leaf: ['....oo.', '..ooao.', '.oahao.', 'oahbao.', 'oabao..', '.oo....', 'o......'],
    worm: ['..oo.....', '.oaho.oo.', 'oabaoahao', '.oo.oabo.', '.....oo..'],
    blob: ['...oooo...', '..ohhaao..', '.ohaaaaao.', 'oaaaaaaabo', 'oaaaaaabbo', '.oabbbbbo.', '..oooooo..'],
    jam: ['....g.....', '....g.....', '...oso....', '..ooaooo..', '.ohhaaaao.', 'oahaaaaabo', 'oaaaaaabbo', '.oabbbbbo.', '..oooooo..'],
    swirl: ['.....oo.....', '....ohao....', '...ohaaao...', '...oaaabo...', '..ohaaaaao..', '..oaaaabbo..', '.ohaaaaaaao.', '.oaaaaaabbo.', 'oaaaaaaaabbo', '.oooooooooo.'],
    scoop: ['...oooo...', '..ohhaao..', '.ohaaaaao.', '.oaaaaaso.', 'oaasaaaabo', 'oaaaaasabo', '.obooobbo.', '..o..oo...'],
    curd: ['..oo.oo...', '.ohaohao..', 'ohaaaaaoo.', 'oaahaaahao', 'oaaaaabaao', '.obaabbbo.', '..oooooo..'],
    jar: ['..oooooooo..', '..ollllllo..', '..oooooooo..', '.oaaaaaaaao.', 'oahaaaaaaabo', 'oahaaaaaaabo', 'oahaaaaaaabo', 'oaaaaaaaabbo', '.oaaaaaabbo.', '..oooooooo..'],
    bottle: ['...oo...', '...ll...', '..oooo..', '..oaao..', '.oaaaao.', 'oahaaaao', 'oahwwwao', 'oahwwwao', 'oahaaabo', 'oaaaaabo', '.oooooo.'],
    sieve: ['.oooooooo.', 'ohhhhhhhho', 'oasasasaso', '.oooooooo.', '...o..o...', '....oo....', '...s..s...', '..s.s..s..', '...s.s....'],
  };
  // спрайт в точке (x, y — середина), z — размер пикселя, pal — палитра; flip — отразить
  function sprite(g, name, x, y, z, pal, flip) {
    const rows = SPR[name], w = rows[0].length, h = rows.length, x0 = Math.round(x - w * z / 2), y0 = Math.round(y - h * z / 2);
    rows.forEach((r, j) => { for (let i = 0; i < w; i++) { const col = pal[r[i]]; if (col) { g.fillStyle = col; g.fillRect(x0 + (flip ? w - 1 - i : i) * z, y0 + j * z, z, z); } } });
  }
  // картинка топпинга для карточки и заказа (32×32, рисуется один раз)
  const TICON = {};
  function topIcon(id) {
    if (TICON[id]) return TICON[id];
    const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'), tp = TP[id];
    if (tp.k === 'drizzle') { sprite(g, tp.box, 16, 17, tp.box === 'jar' ? 2 : 2, tp.c); g.fillStyle = tp.c.a; g.fillRect(tp.box === 'jar' ? 25 : 22, 22, 2, 6); g.fillRect(tp.box === 'jar' ? 24 : 21, 27, 4, 3); }
    else if (tp.k === 'dust') { sprite(g, 'sieve', 16, 16, 3, tp.c); tp.dc.forEach((col, i) => { g.fillStyle = col; g.fillRect(7 + (i * 7) % 18, 26 + (i % 2) * 3, 2, 2); }); }
    else if (tp.k === 'dollop') { const r = SPR[tp.sp], z = Math.max(1, Math.floor(30 / Math.max(r.length, r[0].length))); sprite(g, tp.sp, 16, 16, z, tp.c); }
    else { const r = SPR[tp.sp], big = Math.max(r.length, r[0].length);
      if (big >= 7) { sprite(g, tp.sp, 12, 13, 2, tp.c); sprite(g, tp.sp, 21, 19, 2, tp.c, true); }
      else { const z = big >= 6 ? 2 : 3; sprite(g, tp.sp, 10, 11, z, tp.c); sprite(g, tp.sp, 22, 12, z, tp.c, true); sprite(g, tp.sp, 16, 22, z, tp.c); } }
    return (TICON[id] = c);
  }

  // ---------- жители Воббленда (медальоны /images/wobbleland/ch-*.png): любимые топпинги, форма, прожарка; hi — с чем пришёл, yum — когда в восторге ----------
  const C = (img, city, n, fav, shape, bake, hi, yum) => ({ img, city, n, fav, shape, bake, hi, yum });
  const PEOPLE = [
    C('miss-peony', 'newwobbleton', ['Miss Peony', 'Мисс Пиони', 'Miss Peony'], ['sugar', 'berry'], 'heart', 'gold',
      ['Polly, dear! Something sweet for my bakery break, please.', 'Полли, дорогая! Что-нибудь сладкое к перерыву в пекарне.', 'Pollij, dārgā! Kaut ko saldu pārtraukumam maiznīcā, lūdzu.'],
      ['Lovely! I’ll give half to someone who looks sad.', 'Чудесно! Половинку отдам тому, у кого грустный вид.', 'Brīnišķīgi! Pusīti atdošu kādam, kurš izskatās bēdīgs.']),
    C('professor-owlistair-tweed', 'newwobbleton', ['Professor Owlistair Tweed', 'Профессор Совлистер Твид', 'Profesors Owlistair Tweed'], ['honey', 'nuts'], 'square', 'gold',
      ['A square one, like a page. I am not sleepy, I’m resting my eyes.', 'Квадратный, как страница. Я не сплю, я даю глазам отдохнуть.', 'Kvadrātveida, kā lappuse. Es neguļu, es ļauju acīm atpūsties.'],
      ['Splendid. I shall finish my chapter… tomorrow.', 'Превосходно. Дочитаю главу… завтра.', 'Lieliski. Nodaļu izlasīšu… rīt.']),
    C('mr-crisper', 'newwobbleton', ['Mr. Crisper', 'Мистер Криспер', 'Misters Krispers'], ['lemon', 'sugar'], 'square', 'crispy',
      ['Crispy, please, and exactly by the label! Mixed-up toppings make me panic.', 'Поджаристый, пожалуйста, и строго по списку! Перепутанные начинки — моя паника.', 'Kraukšķīgu, lūdzu, un tieši pēc saraksta! Sajauktas piedevas mani biedē.'],
      ['Everything in its place. I’ll put a label on this memory.', 'Всё на своих местах. Подпишу это воспоминание.', 'Viss savā vietā. Šai atmiņai uzlikšu uzlīmi.']),
    C('milka', 'newwobbleton', ['Milka', 'Милка', 'Milka'], ['sour', 'cream'], 'round', 'light',
      ['*a tail waves from the box* …mrrp?', '*из коробки машет хвост* …мрр?', '*no kastes māj aste* …murr?'],
      ['*the tail wags happily*', '*хвост радостно виляет*', '*aste priecīgi luncinās*']),
    C('chew', 'newwobbleton', ['Mr. Chew', 'Мистер Чу', 'Misters Čū'], ['berry', 'banana'], 'round', 'light',
      ['No rush, Polly. Slowly is my favourite speed.', 'Не спеши, Полли. Медленно — моя любимая скорость.', 'Nesteidzies, Pollij. Lēni ir mans mīļākais ātrums.'],
      ['Mmm. Worth crawling across the whole town for.', 'Ммм. Ради такого стоило ползти через весь город.', 'Mmm. Bija vērts rāpot pāri visai pilsētai.']),
    C('buzzby-caramello', 'maplewink', ['Buzzby Caramello', 'Баззби Карамелло', 'Buzzby Caramello'], ['caramel', 'honey'], 'flower', 'gold',
      ['Quick, quick, I have four minutes! Wait, which street am I on?', 'Быстрее-быстрее, у меня четыре минуты! Стоп, а на какой я улице?', 'Ātrāk, ātrāk, man ir četras minūtes! Pag, uz kuras ielas es esmu?'],
      ['Delivered straight to my tummy! Bzzz!', 'Доставлено прямо в животик! Жжж!', 'Piegādāts tieši vēderiņā! Bzzz!']),
    C('hedgewig-bramble', 'maplewink', ['Hedgewig Bramble', 'Ежевига Брамбл', 'Hedgewig Bramble'], ['blue', 'maple'], 'flower', 'gold',
      ['All my leaves are sorted by colour. Now a treat — and a little nap.', 'Все листья разложены по цветам. Теперь угощение — и чуть-чуть подремать.', 'Visas lapas sašķirotas pēc krāsas. Tagad cienasts — un mazliet pasnaust.'],
      ['Perfect. I won’t even feel guilty about the nap.', 'Идеально. Даже за дрёму не будет стыдно.', 'Ideāli. Pat par snaudu nebūs kauns.']),
    C('leafy-lou', 'maplewink', ['Leafy Lou', 'Листик Лу', 'Lapiņš Lū'], ['maple', 'nuts'], 'flower', 'crispy',
      ['Crispy like autumn leaves! Just don’t tickle me with the spatula.', 'Хрустящий, как осенние листья! Только не щекочи меня лопаткой.', 'Kraukšķīgu kā rudens lapas! Tikai nekutini mani ar lāpstiņu.'],
      ['Wheee! I’m swirling with joy!', 'Ииих! Я кружусь от счастья!', 'Ūū! Es virpuļoju no laimes!']),
    C('tim-froggucion', 'maplewink', ['Tim Froggucion', 'Тим Фроггуччино', 'Tims Froggucion'], ['maple', 'pumpkin'], 'round', 'gold',
      ['Something autumnal to go with my frothy cappuccino.', 'Что-нибудь осеннее к моему пенному капучино.', 'Kaut ko rudenīgu pie mana putainā kapučīno.'],
      ['Ribbit! Autumn in every bite.', 'Ква! Осень в каждом кусочке.', 'Kvā! Rudens katrā kumosā.']),
    C('titos', 'snailhollow', ['Detective Titos', 'Детектив Титос', 'Detektīvs Titoss'], ['choco', 'nuts'], 'star', 'crispy',
      ['A quick one, Polly — a case is waiting. And not a word to anyone.', 'Быстренько, Полли, меня ждёт дело. И никому ни слова.', 'Ātri, Pollij, mani gaida lieta. Un nevienam ne vārda.'],
      ['Case closed. The pancake confessed it was delicious.', 'Дело раскрыто: блин признался, что он вкусный.', 'Lieta atrisināta: pankūka atzinās, ka ir garšīga.']),
    C('mr-dr-fisher-iii', 'snailhollow', ['Mr. Dr. Fisher III', 'Мистер Доктор Фишер III', 'Misters Dr. Fišers III'], ['lemon', 'sour'], 'square', 'gold',
      ['That is DOCTOR Fisher, thank you. And no shiny pans — I see my reflection.', 'Доктор Фишер, попрошу. И без блестящих сковородок — я вижу в них своё отражение.', 'Doktors Fišers, lūdzu. Un bez spīdīgām pannām — es tajās redzu savu atspulgu.'],
      ['A diploma-worthy pancake.', 'Блин, достойный диплома.', 'Diploma cienīga pankūka.']),
    C('lady-slugworth', 'snailhollow', ['Lady Slugworth', 'Леди Слизуорт', 'Lēdija Slugworth'], ['cream', 'berry'], 'heart', 'light',
      ['I don’t come late, darling, I make an entrance. Something elegant.', 'Я не опаздываю, дорогуша, я появляюсь. Что-нибудь элегантное.', 'Es nekavēju, dārgā, es parādos. Kaut ko elegantu.'],
      ['Exquisite! Almost as sparkly as my trail.', 'Изысканно! Почти так же блестит, как мой след.', 'Izsmalcināti! Gandrīz tikpat mirdzoši kā mana taka.']),
    C('toad-mortimer', 'snailhollow', ['Toad Mortimer', 'Жаб Мортимер', 'Krupis Mortimers'], ['jam', 'sour'], 'bat', 'crispy',
      ['I traded my scythe for a big fork. Let’s put it to use.', 'Я сменил косу на большую вилку. Пора пустить её в дело.', 'Es izkapti nomainīju pret lielu dakšu. Laiks to likt lietā.'],
      ['Delicious. Now a nap… and maybe another nap.', 'Вкусно. Теперь вздремнуть… и, может, ещё раз.', 'Garšīgi. Tagad nosnausties… un varbūt vēlreiz.']),
    C('lord-croakstill', 'snailhollow', ['Lord Croakstill', 'Лорд Кваксилл', 'Lords Croakstill'], ['blue', 'cream'], 'moon', 'gold',
      ['I may rest for ten minutes. Exactly enough for one pancake.', 'Мне можно отдохнуть десять минут. Ровно на один блин.', 'Man drīkst atpūsties desmit minūtes. Tieši vienai pankūkai.'],
      ['A tragic croak of joy! Kwaaa!', 'Трагическое кваканье от счастья! Ква-а-а!', 'Traģisks kvarkšķis aiz laimes! Kvā-ā-ā!']),
    C('barnaby-burrows', 'pinecrust', ['Barnaby Burrows', 'Барнаби Барроуз', 'Barnabijs Burrows'], ['honey', 'banana'], 'round', 'gold',
      ['A baker visiting a baker! My sourdough sends its regards.', 'Пекарь в гостях у пекаря! Моя закваска передаёт привет.', 'Maiznieks ciemos pie maiznieces! Mans ieraugs sūta sveicienus.'],
      ['Better than half a loaf, and I would know!', 'Лучше полбуханки, а я в этом разбираюсь!', 'Labāk par pusklaipu, un es to zinu!']),
    C('nutmeg-hazelton', 'pinecrust', ['Nutmeg Hazelton', 'Натмег Хейзелтон', 'Nutmeg Hazelton'], ['nuts', 'choco'], 'star', 'gold',
      ['Nuts, please! I hid some somewhere here… or was that last year?', 'С орешками! Я где-то тут припрятала… или это было в прошлом году?', 'Ar riekstiem, lūdzu! Kaut kur šeit paslēpu… vai tas bija pagājušgad?'],
      ['So good I’ll bury one for later!', 'Так вкусно, что один закопаю на потом!', 'Tik garšīgi, ka vienu ierakšu vēlākam!']),
    C('rusty-roamwell', 'pinecrust', ['Rusty Roamwell', 'Расти Роумвелл', 'Rusty Roamwell'], ['maple', 'berry'], 'star', 'crispy',
      ['I was going to the mountains, but the map led me to your window. Lucky!', 'Шёл в горы, а карта привела к твоему окошку. Повезло!', 'Gāju uz kalniem, bet karte atveda pie tava lodziņa. Paveicās!'],
      ['Never got where I planned — got somewhere better!', 'Опять пришёл не туда — опять туда, где лучше!', 'Atkal nonācu ne tur — atkal kaut kur labākā vietā!']),
    C('bramwell-bear', 'pinecrust', ['Bramwell Bear', 'Медведь Брамвелл', 'Lācis Bramvels'], ['honey', 'sour'], 'round', 'gold',
      ['*yawns* This is not waking up. This is a midnight snack.', '*зевает* Это не пробуждение. Это ночной перекус.', '*žāvājas* Tā nav pamošanās. Tā ir pusnakts uzkoda.'],
      ['Honey-perfect. Wake me up in spring.', 'Медово-идеально. Разбудите весной.', 'Medaini ideāli. Pamodiniet pavasarī.']),
    C('dr-panicoli', 'lemonvale', ['Dr. Panicoli', 'Доктор Паниколи', 'Dr. Panikoli'], ['lemon', 'sugar'], 'round', 'light',
      ['Is that a shadow?! No, it’s the menu. I checked it three times.', 'Это тень?! А, нет, меню. Я проверил три раза.', 'Vai tā ir ēna?! Ā, nē, ēdienkarte. Es pārbaudīju trīs reizes.'],
      ['Triple-checked: delicious, delicious, delicious.', 'Трижды проверено: вкусно, вкусно, вкусно.', 'Trīsreiz pārbaudīts: garšīgi, garšīgi, garšīgi.']),
    C('lady-puddle-dip', 'lemonvale', ['Lady Puddle-Dip', 'Леди Лужемак', 'Lēdija Puddle-Dip'], ['jam', 'cream'], 'heart', 'gold',
      ['One to eat now and one to save for a rainy day, please.', 'Один — съесть сейчас, второй — припрятать до дождя.', 'Vienu apēst tagad, otru paglabāt līdz lietum.'],
      ['Divine! I won’t even dip it in a puddle.', 'Божественно! Даже в лужу макать не буду.', 'Dievišķīgi! Pat peļķē nemērcēšu.']),
    C('sir-puddlesworth', 'lemonvale', ['Sir Puddlesworth', 'Сэр Лужуорт', 'Sers Puddlesworth'], ['blue', 'lemon'], 'round', 'gold',
      ['Puddle inspection done. One duck scared me again. I need a pancake.', 'Лужи проверены. Опять напугала утка. Нужен блин.', 'Peļķes pārbaudītas. Atkal nobiedēja pīle. Vajag pankūku.'],
      ['Splash-tastic! Not a single duck in sight.', 'Восхитительно! И ни одной утки.', 'Lieliski! Un neviena pīle.']),
    C('rowena-ghostclaw', 'lemonvale', ['Rowena Ghostclaw', 'Ровена Гостклоу', 'Rovena Ghostclaw'], ['choco', 'caramel'], 'bat', 'crispy',
      ['Food critic. Usually one star out of five. Impress me.', 'Пищевой критик. Обычно одна звезда из пяти. Удиви меня.', 'Ēdienu kritiķe. Parasti viena zvaigzne no piecām. Pārsteidz mani.'],
      ['Five stars. Don’t tell the other ghosts.', 'Пять звёзд. Только другим привидениям не говори.', 'Piecas zvaigznes. Tikai citiem spokiem nesaki.']),
    C('sew-sew-patty', 'buttonspire', ['Sew-Sew Patty', 'Шью-Шью Пэтти', 'Šuj-Šuj Patija'], ['berry', 'jam'], 'heart', 'gold',
      ['The buttons told me such gossip! I need something sweet to digest it.', 'Пуговицы такое рассказали! Нужно сладкое, чтобы это переварить.', 'Pogas tādas tenkas izstāstīja! Vajag ko saldu, lai to sagremotu.'],
      ['Stitched to perfection!', 'Сшито на отлично!', 'Sašūts izcili!']),
    C('spool-ghoul', 'buttonspire', ['Spool Ghoul', 'Катушка-Ворчушка', 'Spole Kurnule'], ['sour', 'cheese'], 'square', 'crispy',
      ['Grr. Wound too tight since 1893. A pancake might loosen me up.', 'Ррр. Туго намотана с 1893 года. Может, блин меня ослабит.', 'Rrr. Cieši satīta kopš 1893. gada. Varbūt pankūka mani atslābinās.'],
      ['Hmph. …Fine. It’s wonderful.', 'Хмф. …Ладно. Это чудесно.', 'Hmf. …Labi. Tas ir brīnišķīgi.']),
    C('bobby-bagster', 'buttonspire', ['Bobby Bagster', 'Бобби Бэгстер', 'Bobijs Bagsters'], ['banana', 'choco'], 'square', 'gold',
      ['To go, please! I brought my own bag. Well, a borrowed one.', 'С собой, пожалуйста! Пакет у меня свой. Ну, одолженный.', 'Līdzņemšanai, lūdzu! Maisiņš man ir savs. Nu, aizņemts.'],
      ['It’s in the bag! And so am I.', 'Упаковано! И я тоже в пакете.', 'Iesaiņots! Un es arī maisiņā.']),
    C('mittens-mulligan', 'buttonspire', ['Mittens Mulligan', 'Варежка Маллиган', 'Dūrainīte Mulligan'], ['cream', 'sugar'], 'round', 'gold',
      ['Something warm, please — I left my radiator just for this.', 'Что-нибудь тёплое — я ради этого слезла с батареи.', 'Kaut ko siltu, lūdzu — šī dēļ atstāju radiatoru.'],
      ['Purrfect. Warmer than the radiator.', 'Мурр-фект. Теплее батареи.', 'Murr-lieliski. Siltāk par radiatoru.']),
    C('ghostina-gravy', 'noodleford', ['Ghostina Gravy', 'Гостина Грейви', 'Ghostina Gravy'], ['cheese', 'sour'], 'moon', 'gold',
      ['My Eternal Soup needs another century. So, a pancake meanwhile.', 'Вечному супу нужно ещё лет сто. Так что пока — блин.', 'Mūžīgajai zupai vajag vēl kādu gadsimtu. Tāpēc pagaidām — pankūku.'],
      ['A chef’s compliment from beyond!', 'Комплимент от шефа с того света!', 'Šefpavāres kompliments no viņsaules!']),
    C('sir-pickleknot', 'noodleford', ['Sir Pickleknot', 'Сэр Пиклнот', 'Sers Pickleknot'], ['cheese', 'lemon'], 'star', 'crispy',
      ['Could you tie it in a knot? No? Then crispy, please.', 'А можно завязать его узлом? Нет? Тогда поджаристый.', 'Vai to var sasiet mezglā? Nē? Tad kraukšķīgu.'],
      ['Tied up my hunger in a perfect bow.', 'Завязал голод идеальным бантиком.', 'Izsalkumu sasēju perfektā bantē.']),
    C('chestnut-charlie', 'noodleford', ['Chestnut Charlie', 'Каштан Чарли', 'Kastanis Čārlijs'], ['nuts', 'maple'], 'round', 'crispy',
      ['Did I tell you the one about the roasted chestnut? Ha! I’ll tell you while you bake.', 'Я рассказывал про жареный каштан? Ха! Расскажу, пока печёшь.', 'Vai es stāstīju par cepto kastani? Hā! Izstāstīšu, kamēr cep.'],
      ['Toasty! Now I really need another one.', 'Хрустяще! Теперь точно хочется ещё.', 'Kraukšķīgi! Tagad tiešām gribas vēl.']),
    C('candice-creepleton', 'jamshire', ['Candice Creepleton', 'Кэндис Криплтон', 'Kendisa Creepleton'], ['berry', 'cream'], 'heart', 'light',
      ['Make it pretty — it’s going straight on my blog! Just don’t call me.', 'Сделай красиво — это сразу в блог! Только не звони мне.', 'Uztaisi skaisti — tas uzreiz būs manā blogā! Tikai nezvani man.'],
      ['Ten thousand likes, guaranteed!', 'Десять тысяч лайков обеспечено!', 'Desmit tūkstoši patīk garantēti!']),
    C('madame-teabite', 'jamshire', ['Madame Teabite', 'Мадам Тибайт', 'Madāma Teabite'], ['jam', 'lemon'], 'flower', 'light',
      ['A pancake to go with tea. Not with coffee. Never with coffee.', 'Блин к чаю. Не к кофе. Никогда не к кофе.', 'Pankūku pie tējas. Ne pie kafijas. Nekad pie kafijas.'],
      ['Impeccable. You hold the spatula like a lady.', 'Безупречно. Лопатку держишь как настоящая леди.', 'Nevainojami. Lāpstiņu turi kā īsta dāma.']),
    C('count-hopula', 'jamshire', ['Count Hopula', 'Граф Прыгула', 'Grāfs Hopula'], ['banana', 'berry'], 'bat', 'gold',
      ['No milk, no cream, no fainting! It’s almost midnight, hurry.', 'Без молока, без сливок, без обмороков! Скоро полночь, поторопись.', 'Bez piena, bez saldā krējuma, bez ģīboņiem! Drīz pusnakts, pasteidzies.'],
      ['Bloody marvellous! Er, berry marvellous.', 'Кровь… то есть клубника с кровью! Прекрасно.', 'Asinīgi lieliski! Tas ir, ogu lieliski.']),
    C('baron-von-worms', 'cheddarford', ['Baron von Worms', 'Барон фон Вормс', 'Barons fon Vormss'], ['worm', 'cheese'], 'round', 'gold',
      ['Something for Miss Pumpkinella… I mean, for me. Purely for me.', 'Что-нибудь для мисс Тыквеллы… то есть для меня. Исключительно для меня.', 'Kaut ko mis Pumpkinellai… tas ir, man. Tikai man.'],
      ['Magnificent! I’d bow, if I had legs.', 'Великолепно! Поклонился бы, будь у меня ноги.', 'Lieliski! Paklanītos, ja man būtu kājas.']),
    C('wren-windlow', 'cheddarford', ['Wren Windlow', 'Рен Виндлоу', 'Rena Windlow'], ['honey', 'lemon'], 'flower', 'light',
      ['It’s drizzling, so my phone is off. Just me and a pancake.', 'Моросит — телефон выключен. Только я и блин.', 'Smidzina, tāpēc telefons ir izslēgts. Tikai es un pankūka.'],
      ['As calm as the rain on the windowsill.', 'Спокойно, как дождь на подоконнике.', 'Mierīgi kā lietus uz palodzes.']),
    C('petunia-spookworth', 'cheddarford', ['Petunia Spookworth', 'Петуния Спуквурт', 'Petūnija Spookworth'], ['blue', 'sugar'], 'flower', 'gold',
      ['A flower-shaped one, please. I’ll leave you a trail of petals.', 'Цветочком, пожалуйста. Оставлю тебе дорожку из лепестков.', 'Zieda formā, lūdzu. Atstāšu tev ziedlapiņu taku.'],
      ['It blooms on the plate!', 'Цветёт прямо на тарелке!', 'Zied tieši uz šķīvja!']),
    C('pumpkin', 'kettleford', ['The Pumpkin Family', 'Семья Тыквиных', 'Ķirbju ģimene'], ['pumpkin', 'cream'], 'round', 'gold',
      ['A whole family is hungry! Something pumpkin-y, please.', 'Вся семья голодная! Что-нибудь тыквенное, пожалуйста.', 'Visa ģimene ir izsalkusi! Kaut ko ķirbjainu, lūdzu.'],
      ['Everyone’s smiling, even the littlest pumpkin!', 'Все улыбаются, даже самая маленькая тыковка!', 'Visi smaida, pat pats mazākais ķirbītis!']),
    C('dr-dripsson', 'kettleford', ['Dr. Dripsson', 'Доктор Дрипссон', 'Dr. Dripsons'], ['choco', 'caramel'], 'star', 'crispy',
      ['A pancake is a coffee you can chew. I’ll explain the meaning of life while you bake.', 'Блин — это кофе, который можно жевать. Расскажу о смысле жизни, пока печёшь.', 'Pankūka ir kafija, ko var košļāt. Izstāstīšu par dzīves jēgu, kamēr cep.'],
      ['Eight legs up! The meaning of life is found.', 'Восемь лапок вверх! Смысл жизни найден.', 'Astoņas kājas augšā! Dzīves jēga atrasta.']),
    C('miss-pumpkinella', 'kettleford', ['Miss Pumpkinella', 'Мисс Тыквелла', 'Mis Pumpkinella'], ['pumpkin', 'sugar'], 'moon', 'gold',
      ['Elbows off the counter, please. Now, an ancient recipe…', 'Локти со стойки, пожалуйста. А теперь — старинный рецепт…', 'Elkoņus nost no letes, lūdzu. Un tagad — sena recepte…'],
      ['Perfect manners and a perfect pancake.', 'Безупречные манеры и безупречный блин.', 'Nevainojamas manieres un nevainojama pankūka.']),
    C('countfluffula', 'kettleford', ['Countfluffula', 'Граф Пушистула', 'Grāfs Pūkula'], ['berry', 'cream'], 'bat', 'light',
      ['*pink mist, bat fanfare* No bites — just desserts!', '*розовый туман, фанфары летучих мышей* Никаких укусов — только десерты!', '*rozā migla, sikspārņu fanfaras* Nekādu kodienu — tikai deserti!'],
      ['Fluff-tastic! Encore, encore!', 'Пушисто-прекрасно! Бис, бис!', 'Pūkaini lieliski! Bis, bis!']),
    C('sir-gourdon-squash', 'kettleford', ['Sir Gourdon Squash', 'Сэр Гордон Сквош', 'Sers Gourdons Squash'], ['pumpkin', 'maple'], 'square', 'gold',
      ['*polishes monocle* Ahem. One pancake. For the Autumn Ball.', '*протирает монокль* Кхм. Один блин. Для Осеннего бала.', '*spodrina monokli* Khm. Vienu pankūku. Rudens ballei.'],
      ['Most distinguished. Not awkward at all.', 'Весьма достойно. Ни капли неловкости.', 'Ļoti cienījami. Ne mazākās neveiklības.']),
    C('moss-mccandle', 'kettleford', ['Moss McCandle', 'Мосс Маккэндл', 'Moss McCandle'], ['caramel', 'choco'], 'star', 'crispy',
      ['Close the window, there’s a draft! …I didn’t flicker. You saw nothing.', 'Закрой окно, сквозняк! …Я не мигнул. Ты ничего не видела.', 'Aizver logu, caurvējš! …Es nenomirgoju. Tu neko neredzēji.'],
      ['I’m glowing! Literally.', 'Я сияю! В прямом смысле.', 'Es mirdzu! Burtiski.']),
  ];
  // общие ответы клиентов: 0 — расстроен, 1 — не очень доволен, 2 — доволен, 3 — в восторге; miss/extra — про топпинги (эмодзи вместо названия)
  const SAY = {
    3: [['Best pancake in Wobbleland!', 'Лучший блин во всём Воббленде!', 'Labākā pankūka visā Wobbleland!'], ['I’ll tell the whole town about this!', 'Расскажу об этом всему городу!', 'Izstāstīšu par to visai pilsētai!'], ['Exactly how I dreamed it!', 'Прямо как в мечтах!', 'Tieši tāda, kā sapņoju!'],
      ['I’ll frame this pancake. After I eat it.', 'Повешу этот блин в рамочку. Когда съем.', 'Šo pankūku ielikšu rāmītī. Kad apēdīšu.'], ['Polly, this is pancake magic!', 'Полли, да это блинное волшебство!', 'Pollij, tā ir pankūku burvība!']],
    2: [['Tasty! Thank you, Polly.', 'Вкусно! Спасибо, Полли.', 'Garšīgi! Paldies, Pollij.'], ['Good pancake. I’ll be back!', 'Хороший блин. Ещё приду!', 'Laba pankūka. Vēl atnākšu!'], ['Not bad at all!', 'Очень даже неплохо!', 'Nemaz nav slikti!'],
      ['Mmm, cosy. Like a blanket, but tasty.', 'Ммм, уютно. Как плед, только вкусный.', 'Mmm, omulīgi. Kā pleds, tikai garšīgs.'], ['Good! My tummy says thank you.', 'Хорошо! Животик говорит спасибо.', 'Labi! Vēderiņš saka paldies.']],
    1: [['Hmm… it’s edible.', 'Хм… съедобно.', 'Hmm… ēdams.'], ['Not quite what I ordered.', 'Не совсем то, что было в заказе.', 'Ne gluži tas, ko pasūtīju.'], ['Well… thanks, I suppose.', 'Ну… спасибо, наверное.', 'Nu… paldies, laikam.'],
      ['I’ll eat it… slowly.', 'Съем… медленно.', 'Apēdīšu… lēnām.'], ['Next time a little more careful, maybe?', 'В следующий раз, может, повнимательнее?', 'Nākamreiz varbūt mazliet uzmanīgāk?']],
    0: [['That’s not my order at all!', 'Это вообще не мой заказ!', 'Tas nemaz nav mans pasūtījums!'], ['Oh no. I’ll go to the noodle shop.', 'Ох. Пойду лучше в лапшичную.', 'Ak nē. Labāk iešu uz nūdeļu bodīti.'], ['*sighs and leaves*', '*вздыхает и уходит*', '*nopūšas un aiziet*'],
      ['Is this a pancake or a puddle?', 'Это блин или лужа?', 'Vai tā ir pankūka vai peļķe?'], ['I’ll just have tea, thanks.', 'Я, пожалуй, только чаю.', 'Es labāk iedzeršu tikai tēju.']],
    miss: [e => `Hmm, where is the ${e}?`, e => `Хм, а где ${e}?`, e => `Hmm, kur ir ${e}?`],
    extra: [e => `That wasn’t in my order: ${e}`, e => `Этого в заказе не было: ${e}`, e => `Tā nebija pasūtījumā: ${e}`],
    plain: [['I asked for nothing on top!', 'В заказе же было: ничего сверху!', 'Es taču lūdzu neko virsū!']],
    shape: [['Wrong shape, but okay…', 'Форма не та, ну ладно…', 'Ne tā forma, nu labi…']],
    late: [['One more minute and I’d have been gone!', 'Ещё минутка — и меня бы тут не было!', 'Vēl minūte, un manis te vairs nebūtu!']],
  };

  // характеры клиентов (с 3-го уровня): hurry — торопится (терпение и до 11-го), picky — строже оценка, chatty — болтает и терпеливее, same — «как в прошлый раз» (заказ виден 3 с)
  const TRAITS = {
    hurry: { pat: 0.65, hi: [['Quick, quick, I’m late!', 'Быстрее, быстрее, опаздываю!', 'Ātrāk, ātrāk, es kavēju!'], ['Just a pancake, I have a train to catch!', 'Мне только блин, у меня поезд!', 'Man tikai pankūku, man jāpaspēj uz vilcienu!'], ['Hurry, Polly, my tea is getting cold!', 'Скорее, Полли, у меня чай стынет!', 'Ātrāk, Pollij, man tēja atdziest!']],
      ok: [['Just in time! Bye!', 'Как раз вовремя! Бегу!', 'Tieši laikā! Skrienu!']], bad: [['Too slow! I’ll eat it on the way…', 'Долго! Съем по дороге…', 'Par lēnu! Apēdīšu pa ceļam…']] },
    picky: { hi: [['Exactly as written, please. I will check.', 'Строго как в заказе, пожалуйста. Я проверю.', 'Tieši kā pasūtījumā, lūdzu. Es pārbaudīšu.'], ['Last time the edge was a little too dark…', 'В прошлый раз краешек был темноват…', 'Pagājušoreiz maliņa bija par tumšu…'], ['I only eat perfect pancakes.', 'Я ем только идеальные блины.', 'Es ēdu tikai ideālas pankūkas.']],
      ok: [['Hmm. Nothing to complain about. Rare!', 'Хм. Даже придраться не к чему. Редкость!', 'Hmm. Nav pie kā piesieties. Retums!']], bad: [['Close, but not perfect.', 'Почти, но не идеально.', 'Gandrīz, bet ne ideāli.']] },
    chatty: { pat: 1.4, hi: [['Oh, Polly, you won’t believe what happened today!', 'Ой, Полли, ты не поверишь, что сегодня было!', 'Ak, Pollij, tu neticēsi, kas šodien notika!'], ['Hello, hello! Have I told you about my cousin?', 'Привет-привет! Про моего кузена уже слышала?', 'Sveiki, sveiki! Vai es stāstīju par savu brālēnu?']],
      ok: [['…and that’s why I never trust a pumpkin. Thank you!', '…и поэтому я никогда не доверяю тыквам. Спасибо!', '…un tāpēc es nekad neuzticos ķirbjiem. Paldies!']], bad: [['Oh, I talked too much and you got distracted!', 'Ой, заболтали тебя совсем!', 'Ak, es tevi pavisam aizrunāju!']] },
    same: { hi: [['The same as last time, Polly!', 'Как в прошлый раз, Полли!', 'Tāpat kā pagājušoreiz, Pollij!'], ['You remember what I like, right?', 'Ты же помнишь, что я люблю?', 'Tu taču atceries, ko es mīlu?'], ['My usual, please!', 'Мне как обычно!', 'Man kā parasti!']],
      ok: [['You remembered! ♥', 'Помнишь! ♥', 'Tu atceries! ♥']], bad: [['That’s not what I had last time…', 'В прошлый раз было не так…', 'Pagājušoreiz bija citādi…']] },
  };
  // болтун болтает, пока печётся блин
  const CHAT = [['My neighbour’s snail won a race. A race! Against another snail.', 'Улитка соседа выиграла забег. Забег! Против другой улитки.', 'Kaimiņa gliemezis uzvarēja sacīkstēs. Sacīkstēs! Pret citu gliemezi.'],
    ['I knitted a scarf for my teapot. It looks very cosy now.', 'Шарф для чайника связан! Теперь ему очень уютно.', 'Noadīju šalli savai tējkannai. Tagad tai ir ļoti omulīgi.'],
    ['The weather is so wobbly today, isn’t it?', 'Погода сегодня такая шаткая, правда?', 'Laiks šodien tik ļodzīgs, vai ne?'],
    ['I saw a ghost in the library. He was reading my book!', 'В библиотеке привидение! Оно читало мою книгу!', 'Bibliotēkā redzēju spoku. Tas lasīja manu grāmatu!'],
    ['My cousin says pancakes taste better on Tuesdays.', 'Кузен говорит, что по вторникам блины вкуснее.', 'Brālēns saka, ka otrdienās pankūkas garšo labāk.'],
    ['Do you think the moon likes pancakes? It looks like one.', 'Как думаешь, луна любит блины? Она же на блин похожа.', 'Kā domā, vai mēness mīl pankūkas? Tas taču izskatās pēc pankūkas.'],
    ['And then I said: no more jam! And then I had more jam.', 'И тогда говорю: хватит варенья! И беру ещё варенья.', 'Un tad es teicu: pietiek ievārījuma! Un paņēmu vēl ievārījumu.'],
    ['Have you heard the frogs singing at night? Wonderful!', 'Слышала, как ночью поют лягушки? Чудесно!', 'Vai dzirdēji, kā naktī dzied vardes? Brīnišķīgi!']];
  // особые просьбы: plain — ничего сверху, double — всего по двойной порции
  const ASK = { plain: ['Just a pancake. Nothing on top, please!', 'Просто блин. Сверху — ничего!', 'Vienkārši pankūku. Virsū — neko!'], double: ['A double portion of everything, I’m starving!', 'Всего по двойной порции, голод просто волчий!', 'Visu dubultā porcijā, esmu izsalcis kā vilks!'] };
  // Медведь-курьер (с 6-го уровня): заказ навынос для жителя, часть требований заляпана вареньем (jam: shape, bake, id топпинга) — угадать по любимому у жителя
  const BEAR = { bear: true, img: 'bear', n: ['Bear the Courier', 'Медведь-курьер', 'Lācis kurjers'],
    hi: [[n => `Delivery for ${n}! Sorry, a bit of jam got on the order…`, n => `Заказ навынос для: ${n}! Простите, чуть-чуть заляпал вареньем…`, n => `Līdzņemšanai: ${n}! Atvainojiet, mazliet notraipīju pasūtījumu ar ievārījumu…`],
      [n => `Sticky paws, smudged order. It’s for ${n}, they know what they like!`, n => `Лапы липкие, заказ смазался. Это для: ${n}, там знают, что любят!`, n => `Lipīgas ķepas, nosmērēts pasūtījums. Tas ir priekš: ${n}, tur zina, ko mīl!`]],
    win: ['You guessed it! I’ll tell everyone: Polly reads jam!', 'Угадано! Всем расскажу: Полли читает по варенью!', 'Uzminēts! Visiem pastāstīšu: Pollija lasa pa ievārījumu!'],
    lose: ['Hmm, not quite… Never mind, it was my jam. No hard feelings!', 'Хм, не совсем… Ничего, варенье-то моё. Без обид!', 'Hmm, ne gluži… Nekas, ievārījums taču mans. Bez aizvainojuma!'] };
  // медведь в кепке курьера: левая половина 10 пикселей, правая — зеркально
  const BEAR_PX = ['..........', '......oooo', '....oocccc', '...ocrcccc', '...occccyy', '...occccyy', 'oo.ooooooo', 'oaoovvvvvv', 'oahooooooo', '.oaaaaaaaa', '.oahaaaaaa', '.oaawkaaaa',
    '.oaakkaaaa', '.oaaaaaamm', '.oapaaamnn', '..oaaaammm', '..oaaaaamm', '...ooaaaaa', '...osooooo', '..ossssyss'].map(r => r + [...r].reverse().join(''));
  const BEAR_COL = { o: O, a: '#8B5A2B', h: '#A87038', c: '#D84A3A', r: '#F07A6A', y: '#F2C94C', v: '#8E2A22', k: O, w: '#FFFFFF', m: '#D9B48A', n: '#2A1A12', p: '#E8957A', s: '#5B3A28' };

  // ---------- разметка ----------
  app.classList.add('rain');
  app.innerHTML = `<div class="rain-stage pk-stage"><canvas class="rain-cv" aria-label="${esc(t('title'))}"></canvas>
    <button type="button" class="rain-pause" aria-label="${esc(t('pauseBtn'))}" hidden>❚❚</button>
    <div class="pk-bar" hidden></div><div class="rain-ov"></div></div>
    <section class="rain-top" data-top="pan"></section>`;
  const cv = app.querySelector('.rain-cv'), ov = app.querySelector('.rain-ov'), pauseBtn = app.querySelector('.rain-pause'), stage = app.querySelector('.rain-stage'), bar = app.querySelector('.pk-bar');
  const ctx = cv.getContext('2d');
  const W = 360, H = 560, BAR = 412; // логический размер поля; ниже BAR — кнопки
  const PAN = { x: 128, y: 318, r: 82 }, CELL = 3.5, POLLY = { x: 258, y: 300 }, PLATE = { x: 292, y: 256 };
  let scale = 1;
  function fit() {
    const maxW = Math.min(app.clientWidth || 360, 440), maxH = Math.max(420, window.innerHeight - 110);
    const w = Math.min(maxW, Math.floor(maxH * W / H));
    scale = w / W;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.width = Math.round(W * scale * dpr); cv.height = Math.round(H * scale * dpr);
    stage.style.width = w + 'px'; stage.style.height = Math.round(H * scale) + 'px';
    bar.style.top = Math.round(BAR * scale) + 'px'; stage.style.setProperty('--pk', scale);
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    draw();
  }

  // ---------- картинки: медальоны жителей и гербы городов ----------
  const IMG = {};
  const img = src => IMG[src] || (IMG[src] = Object.assign(new Image(), { src, onload: () => { if (state !== 'play') draw(); } }));

  // ---------- данные с сервера ----------
  let info = { on: true, per: 1, record: 0, every: 25, wash: 10, soap: 1, start: 10, up: {}, ups: null, today: 0, best: 0, buttons: 0, me: null, top: [] };
  const load = () => fetch('/api/pancakes', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => { if (d) info = d; topList(); if (state === 'menu' || state === 'over') showOverlay(); }).catch(() => {});
  // доска топа — top-board.js (PPTop)
  function topList() { const el = app.querySelector('.rain-top'); if (!window.PPTop || !el) return; const fresh = !el.__top; window.PPTop.mount(el); if (!fresh) window.PPTop.refresh(el); }

  // ---------- сложность ----------
  const tierOf = lv => Math.floor((lv - 1) / 10);
  const P = lv => { const k = tierOf(lv), i = (lv - 1) % 10; return {
    cook: Math.max(1.9, 5.2 - 0.5 * k - 0.04 * i), // секунд от сырого до «готов» (d = 1)
    w: Math.max(0.035, 0.075 - 0.008 * k), // полуширина «идеально» на шкале прожарки
    pour: Math.max(0.9, 1.7 - 0.12 * k), // секунд, чтобы налить ровно форму
    pw: Math.max(0.04, 0.07 - 0.005 * k),
    patience: lv > 10 ? Math.max(0.6, 1 - 0.05 * (k - 1)) : 0, // множитель терпения (0 — не торопится)
  }; };
  const BAKE = { light: 0.4, gold: 0.58, crispy: 0.74 };
  // улучшения (цены и сколько уровней — с сервера: info.up, купленное — info.ups): hot — сырое тесто печётся быстрее (+35 % за уровень), heart — +1 сердечко,
  // pat — +20 % терпения, spare — запасная сковородка вместо мытья (раз за игру за уровень)
  const UPS = {
    hot: { e: '🔥', n: ['Hot stove', 'Горячая плита', 'Karstā plīts'], d: ['Raw batter bakes faster; near the goal — as usual', 'Сырое тесто печётся быстрее, у цели — как обычно', 'Jēlā mīkla cepas ātrāk, pie mērķa — kā parasti'] },
    heart: { e: '❤️', n: ['Extra heart', 'Лишнее сердечко', 'Papildu sirsniņa'], d: ['+1 heart at the start of every game', '+1 сердечко в начале каждой игры', '+1 sirsniņa katras spēles sākumā'] },
    pat: { e: '⏳', n: ['Patient customers', 'Терпеливые клиенты', 'Pacietīgi klienti'], d: ['+20 % patience for every customer', '+20 % терпения у каждого клиента', '+20 % pacietības katram klientam'] },
    spare: { e: '🍳', n: ['Spare pan', 'Запасная сковородка', 'Rezerves panna'], d: ['A clean pan instead of washing: once per game for every level', 'Чистая вместо мытья: раз за игру за каждый уровень', 'Tīra panna mazgāšanas vietā: reizi spēlē par katru līmeni'] },
  };
  const up = k => (info.ups && info.ups[k]) || 0;
  const CARDS = 14; // карточек топпингов за уровень: все из заказа и случайные остальные
  const COLS = [[0, '#F7E7B8'], [0.3, '#F3D48C'], [0.5, '#EBB65E'], [0.64, '#DB9640'], [0.78, '#B86A2C'], [0.9, '#7A4220'], [1.05, '#3A2216']];
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function bakeCol(d, k = 1) {
    let i = 0; while (i < COLS.length - 2 && d > COLS[i + 1][0]) i++;
    const [a, ca] = COLS[i], [b, cb] = COLS[i + 1], f = clamp((d - a) / (b - a)), A = hex(ca), B = hex(cb);
    return `rgb(${A.map((v, j) => Math.round((v + (B[j] - v) * f) * k)).join(',')})`;
  }

  // ---------- игра ----------
  let state = 'menu', phase = '', level = 1, hearts = 3, order = null, cust = null, recent = [], made = [], cur = null, chosen = null, added = {}, addSeq = [];
  let phaseT = 0, patT = 0, late = false, pouring = false, flipT = 0, result = null, fx = [], banner = null, shake = 0, run = null, queue = Promise.resolve();
  let runGot = 0, runItems = [], startBest = 0, dirt = null, dirt0 = 0, soapOn = false, foam = [], walk = 0, last = 0, washBusy = false;
  let startLv = 1, maxH = 3, spareLeft = 0, luck = 0, lastBear = -9, roster = [], hist = [], chatT = 0, fromSel = 0, upsOpen = false, forceNext = null;

  // from — сколько уровней «уже пройдено» (рубеж каждые info.start, не выше рекорда)
  const froms = () => { const st = info.start || 0, a = []; if (info.me && st) for (let m = st; m <= (info.best || 0); m += st) a.push(m); return a; };
  function start(from = 0) {
    if (!froms().includes(from)) from = 0;
    level = startLv = from + 1; maxH = hearts = 3 + up('heart'); spareLeft = up('spare'); luck = 0; lastBear = -9; hist = []; upsOpen = false;
    roster = [PEOPLE[0], ...shuffle(PEOPLE.slice(1)).slice(0, 13)]; // постоянные гости этого захода (новые лица — изредка)
    fx = []; banner = null; recent = []; runGot = 0; runItems = []; startBest = info.best || 0;
    run = null; queue = Promise.resolve();
    if (info.me) queue = post('pancakes/start', { from }).then(r => { run = (r.from || 0) === from ? r.run : null; }).catch(() => { run = null; });
    state = 'play'; ov.innerHTML = ''; ov.hidden = true; pauseBtn.hidden = false; document.documentElement.classList.add('rain-on');
    const r = stage.getBoundingClientRect(); if (r.top < 60 || r.bottom > innerHeight) stage.scrollIntoView({ block: 'center' });
    newCustomer();
    last = performance.now(); requestAnimationFrame(loop);
  }
  // новый житель и его заказ: иногда с характером (TRAITS), «как в прошлый раз» (из hist) или вместо жителя — Медведь-курьер
  function newCustomer() {
    const lv = level, k = tierOf(lv), f = forceNext || {}; forceNext = null;
    const shapes = SHAPES.filter(s => s.from <= lv), tops = TOPS.filter(x => x.from <= lv);
    let trait = '', prev = null, who = null;
    if (f.bear || (!f.trait && lv >= 6 && lv - lastBear >= 4 && lv > startLv && Math.random() < 0.14)) { who = pick(roster.filter(p => p.fav)); lastBear = lv; }
    else if (f.trait === 'same' || (!f.trait && lv >= 5 && Math.random() < 0.16)) prev = pick(hist.filter(h => h.lv <= lv - 2 && !recent.includes(h.cust.img))) || null;
    if (who) cust = BEAR;
    else if (prev) { cust = prev.cust; trait = 'same'; }
    else {
      const pool = roster.filter(p => !recent.includes(p.img)), fresh = PEOPLE.filter(p => !roster.includes(p) && !recent.includes(p.img));
      cust = lv === 1 ? PEOPLE[0] : fresh.length && Math.random() < 0.2 ? pick(fresh) : pick(pool.length ? pool : PEOPLE);
      if (f.trait) trait = f.trait; else if (lv >= 3 && Math.random() < 0.42) trait = pick(['hurry', 'picky', 'chatty']);
    }
    recent.push(cust.img); if (recent.length > 4) recent.shift();
    const like = who || cust; // чьи вкусы: у медведя — того, кому заказ
    let shape, n, bake, want = {}, ask = '';
    if (prev) { ({ shape, n, bake } = prev.order); want = { ...prev.order.tops }; }
    else {
      shape = SH[like.shape].from <= lv && Math.random() < (who ? 0.8 : 0.6) ? like.shape : pick(shapes).id;
      n = lv < 4 ? 1 : lv < 12 ? (Math.random() < 0.4 ? 2 : 1) : lv < 25 ? 1 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * (k >= 4 ? 3 : 2));
      bake = lv < 6 && !who ? 'gold' : Math.random() < (who ? 0.8 : 0.6) ? like.bake : pick(['light', 'gold', 'crispy']);
      const types = lv < 3 ? 1 : lv < 8 ? 1 + (Math.random() < 0.5) : lv < 16 ? 2 + (Math.random() < 0.4) : 2 + Math.floor(Math.random() * 3);
      const favs = like.fav.filter(id => TP[id].from <= lv);
      while (Object.keys(want).length < Math.min(types, tops.length)) {
        const id = favs.length && Math.random() < (who ? 0.8 : 0.6) ? pick(favs) : pick(tops).id;
        if (want[id]) continue;
        want[id] = lv >= 25 && Math.random() < 0.2 ? 3 : lv >= 10 && Math.random() < 0.3 ? 2 : 1;
      }
      if (!who && lv >= 4 && Math.random() < 0.06) { want = {}; ask = 'plain'; }
      else if (!who && lv >= 10 && Math.random() < 0.07) { for (const id in want) want[id] = Math.min(4, want[id] * 2); ask = 'double'; }
    }
    // заляпано вареньем: 1 требование, с 15-го — 2 (чаще топпинги)
    let jam = [];
    if (who) { const c = shuffle(Object.keys(want)).concat(shuffle(['shape', 'bake'])); jam = c.slice(0, Math.min(c.length, lv >= 15 ? 2 : 1)); if (Math.random() < 0.3) jam[0] = pick(['shape', 'bake']); jam = [...new Set(jam)]; }
    const total = Object.values(want).reduce((a, b) => a + b, 0), p = P(lv);
    let mul = p.patience;
    if (trait === 'hurry') mul = (mul || 1) * TRAITS.hurry.pat; else if (trait === 'chatty' && mul) mul *= TRAITS.chatty.pat;
    if (mul) mul *= 1 + 0.2 * up('pat');
    const say = who ? tr(pick(BEAR.hi))(tr(who.n)) : ask ? tr(ASK[ask]) : trait && (trait === 'same' || Math.random() < 0.7) ? tr(pick(TRAITS[trait].hi)) : tr(cust.hi);
    order = { shape, n, bake, tops: want, pat: mul ? Math.round((22 + 11 * n + 3 * total) * mul) : 0, trait, ask, say, bear: who ? { who, jam } : null, memo: trait === 'same' ? 3.5 : null, cards: cardsOf(lv, want) };
    if (!who) { hist.push({ cust, lv, order: { shape, n, bake, tops: { ...want } } }); if (hist.length > 12) hist.shift(); }
    made = []; cur = null; chosen = null; added = {}; addSeq = []; result = null; late = false; patT = order.pat; chatT = 0;
    setPhase('arrive');
    if (lv > 1 && (lv - 1) % 10 === 0) banner = { txt: t('harder', lv), t: 2.4 };
  }
  // карточки топпингов уровня: все из заказа + случайные из открытых, всего CARDS, в порядке TOPS
  function cardsOf(lv, want) {
    const all = TOPS.filter(x => x.from <= lv), keep = new Set(Object.keys(want));
    shuffle(all.filter(x => !keep.has(x.id))).slice(0, Math.max(0, CARDS - keep.size)).forEach(x => keep.add(x.id));
    return all.filter(x => keep.has(x.id)).map(x => x.id);
  }
  function setPhase(ph) { phase = ph; phaseT = 0; pouring = false; renderBar(); }
  const isTimed = () => order && order.pat && ['pan', 'pour', 'cook1', 'flip', 'cook2', 'top'].includes(phase);

  // оценка блина и всего заказа
  const grade = (e, w) => e <= w ? 0 : e <= 2.2 * w ? 1 : 2; // 0 — идеально, 1 — нормально, 2 — плохо
  function judge() {
    const p = P(level), tgt = BAKE[order.bake];
    let pen = 0, bakeG = 0;
    for (const m of made) {
      const gp = grade(Math.abs(m.pour - 0.94), p.pw), g1 = grade(Math.abs(m.s1 - tgt), p.w), g2 = grade(Math.abs(m.s2 - tgt), p.w);
      pen += [0, 4, 10][gp] + [0, 6, 16][g1] + [0, 6, 16][g2]; bakeG = Math.max(bakeG, gp, g1, g2);
    }
    const pk = order.trait === 'picky' ? 1.5 : 1, tr0 = order.trait; // привереда: ошибки стоят в 1,5 раза дороже
    let s = 100 - pk * pen / Math.max(1, made.length);
    const shapeOk = chosen === order.shape; if (!shapeOk) s -= 35 * pk;
    const miss = [], extra = [];
    for (const id of new Set([...Object.keys(order.tops), ...Object.keys(added)])) {
      const d = (added[id] || 0) - (order.tops[id] || 0);
      if (d < 0) { s -= pk * 14 * -d; miss.push(id); } else if (d > 0) { s -= pk * 8 * d; extra.push(id); }
    }
    if (late) s -= 15;
    let mood = s >= (pk > 1 ? 92 : 88) ? 3 : s >= 65 ? 2 : s >= 40 ? 1 : 0;
    // медведь: угадано, если всё заляпанное совпало; удача медведя — трое следующих довольны при любом блине
    const guess = order.bear ? order.bear.jam.every(j => j === 'shape' ? shapeOk : j === 'bake' ? bakeG <= 1 : (added[j] || 0) === order.tops[j]) : null;
    const lucky = !order.bear && luck > 0, raw = mood;
    if (lucky) mood = Math.max(mood, 2);
    const names = ids => ids.map(id => tr(TP[id].nm)).join(', '), traitSay = ok => tr(pick(TRAITS[tr0][ok ? 'ok' : 'bad']));
    let say;
    if (order.bear) say = tr(guess ? BEAR.win : BEAR.lose);
    else if (mood === 3) say = tr0 && Math.random() < 0.6 ? traitSay(true) : Math.random() < 0.7 ? tr(cust.yum) : tr(pick(SAY[3]));
    else if (lucky && raw < 2) say = tr(pick(SAY[2]));
    else if (mood === 0) say = tr(pick(SAY[0]));
    else if (order.ask === 'plain' && extra.length) say = tr(SAY.plain[0]);
    else if (miss.length) say = SAY.miss[L](names(miss));
    else if (extra.length) say = SAY.extra[L](names(extra));
    else if (!shapeOk) say = tr(SAY.shape[0]);
    else if (late) say = tr0 === 'hurry' ? traitSay(false) : tr(SAY.late[0]);
    else say = tr0 && Math.random() < 0.6 ? traitSay(mood === 2 && tr0 !== 'picky') : tr(pick(SAY[mood]));
    return { mood, s: Math.round(s), shapeOk, bakeG, topsOk: !miss.length && !extra.length, say, guess, lucky };
  }
  function serve() {
    result = judge(); setPhase('react');
    const lv = level;
    if (result.lucky) luck--;
    if (order.bear) { if (result.guess) { luck = 3; banner = { txt: t('luck'), t: 3.4 }; } else banner = { txt: t('noLuck'), t: 2.4 }; } // не угадано — сердечко не теряется
    else if (result.mood === 0) { hearts--; shake = 0.4; pop(W - 50, 30, '−❤️', '#D85A30'); }
    if (hearts <= 0) { setTimeout(gameOver, 1800); return; }
    if (lv % 5 === 0 && hearts < maxH) { hearts++; pop(W - 50, 30, t('heartBack'), '#D85A30'); }
    if (info.me) queue = queue.then(() => run ? saveLevel(lv, result.mood, 0) : null).then(r => {
      if (!r) return;
      info.today = r.today; info.best = r.best;
      (r.badges || []).forEach((k, i) => setTimeout(() => toastBadge(k), 300 + i * 1600));
      if (r.got > 0) { runGot += r.got; info.buttons += r.got; pop(PLATE.x, PLATE.y - 40, '+' + r.got + ' 🔘', '#6a3fb0'); }
      if (r.rec > 0) { runGot += r.rec; info.buttons += r.rec; pop(PLATE.x, PLATE.y - 62, '🏆 +' + r.rec + ' 🔘', '#C8961E'); }
      if (r.item) { const B = window.PPBirds, nm = B && B.giftName ? B.giftName(r.item.kind, r.item.item, L) : r.item.item; runItems.push(nm); banner = { txt: t('gotItem', nm), t: 3.2 }; }
    }).catch(() => {});
  }
  // уровень на сервер; «слишком быстро» (429) — подождать и повторить
  const saveLevel = (lv, mood, n) => post('pancakes/level', { run, level: lv, mood }).catch(e => e === 429 && n < 4 ? new Promise(r => setTimeout(r, 3000)).then(() => saveLevel(lv, mood, n + 1)) : (e !== 409 && window.PPToast && window.PPToast(t('noSave')), null));
  const BADGE = { pan1: ['Pancake apprentice', 'Блинный подмастерье', 'Pankūku māceklis'], pan2: ['Flip master', 'Мастер переворота', 'Apgriešanas meistars'], pan3: ['Pancake legend of Wobbleland', 'Блинная легенда Воббленда', 'Wobbleland pankūku leģenda'],
    panstar: ['Everyone’s favourite', 'Всеобщая любимица', 'Visu mīlule'], panwash: ['Squeaky clean', 'Чисто до скрипа', 'Tīrs līdz čīkstēšanai'] };
  const toastBadge = k => window.PPToast && BADGE[k] && window.PPToast(t('badge', tr(BADGE[k])));
  function nextLevel() {
    const lv = level; level++;
    if (lv % (info.wash || 10) === 0) startWash(); else newCustomer();
  }
  function gameOver() {
    state = 'over'; pauseBtn.hidden = true; bar.hidden = true; document.documentElement.classList.remove('rain-on');
    queue.then(() => load()).then(() => showOverlay());
    showOverlay();
  }
  function pause() { if (state !== 'play') return; state = 'pause'; pouring = false; showOverlay(); }
  function resume() { if (state !== 'pause') return; state = 'play'; ov.hidden = true; renderBar(); last = performance.now(); requestAnimationFrame(loop); } // панель кнопок прячется на паузе — вернуть
  const pop = (x, y, txt, col) => fx.push({ x, y, txt, col, t: 1.1 });

  // ---------- мытьё сковородки ----------
  function startWash() {
    order = null; cust = null; result = null; soapOn = false; foam = [];
    dirt = []; dirt0 = 0;
    const N = 28, r2 = (PAN.r - 6) ** 2;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const px = PAN.x - PAN.r + (x + 0.5) * PAN.r * 2 / N, py = PAN.y - PAN.r + (y + 0.5) * PAN.r * 2 / N;
      if ((px - PAN.x) ** 2 + (py - PAN.y) ** 2 > r2) continue;
      const v = 0.6 + Math.random() * 1.4 + (Math.sin(x * 0.7) * Math.cos(y * 0.6) > 0.3 ? 1 : 0); // пятна гуще местами
      dirt.push({ x: px, y: py, v, v0: v }); dirt0 += v;
    }
    setPhase('wash');
  }
  const dirtLeft = () => dirt ? dirt.reduce((a, d) => a + d.v, 0) / dirt0 : 0;
  function chooseWash(soap) {
    if (washBusy) return;
    if (soap === 'spare') { // запасная сковородка (улучшение spare): без мытья
      if (!spareLeft || !run) return;
      washBusy = true;
      queue = queue.then(() => post('pancakes/wash', { run, spare: true })).then(() => {
        washBusy = false; spareLeft--; dirt.forEach(d => { d.v = 0; }); pop(PAN.x, PAN.y - 20, t('spareOn'), '#3E9B4F'); setPhase('clean');
      }).catch(() => { washBusy = false; spareLeft = 0; renderBar(); });
      return;
    }
    const go = () => { soapOn = soap; setPhase('scrub'); };
    if (!info.me || !run) return go();
    washBusy = true;
    queue = queue.then(() => post('pancakes/wash', { run, soap })).then(r => {
      washBusy = false;
      if (r.paid) { info.buttons = r.buttons; window.PPAccount && window.PPAccount.setButtons && window.PPAccount.setButtons(r.buttons); }
      (r.badges || []).forEach(toastBadge); go();
    }).catch(e => { washBusy = false; if (e === 402) { info.buttons = 0; renderBar(); window.PPToast && window.PPToast(t('poor')); } else go(); });
  }
  function scrub(x, y, md) {
    const R = soapOn ? 26 : 14, pw = (soapOn ? 1 : 0.4) * md / 26;
    for (const d of dirt) { const k = 1 - Math.hypot(d.x - x, d.y - y) / R; if (k > 0) d.v = Math.max(0, d.v - pw * (0.4 + k)); }
    if (soapOn && Math.random() < 0.5) foam.push({ x: x + (Math.random() - 0.5) * 24, y: y + (Math.random() - 0.5) * 24, r: 2 + Math.random() * 4, t: 1.6 });
    const left = dirtLeft(); const el = bar.querySelector('.pk-rub'); if (el) el.textContent = t('rub', Math.min(100, Math.round((1 - left) / 0.95 * 100)));
    if (left <= 0.05 && phase === 'scrub') { dirt.forEach(d => { d.v = 0; }); pop(PAN.x, PAN.y - 20, t('clean'), '#3E9B4F'); setPhase('clean'); }
  }

  // ---------- кнопки под полем ----------
  function renderBar() {
    bar.hidden = state !== 'play' || ['arrive', 'flip', 'clean'].includes(phase);
    if (bar.hidden) return;
    const lv = level;
    if (phase === 'pan') {
      bar.innerHTML = `<p class="pk-hint">${t('pickPan')}</p><div class="pk-grid pk-pans">${SHAPES.filter(s => s.from <= lv).map(s => `<button type="button" class="pk-btn" data-pan="${s.id}"><canvas width="28" height="28"></canvas><span>${esc(tr(s.n))}</span></button>`).join('')}</div>`;
      bar.querySelectorAll('[data-pan]').forEach(b => { icon(b.querySelector('canvas'), SH[b.dataset.pan]); b.onclick = () => { chosen = b.dataset.pan; newPancake(); }; });
    } else if (phase === 'pour') {
      bar.innerHTML = `<p class="pk-hint">${made.length + 1 > 1 || order.n > 1 ? t('pancakeN', made.length + 1, order.n) + ' · ' : ''}${t('pourHint')}</p><button type="button" class="pk-big pk-hold">${t('pour')}</button>`;
      const b = bar.querySelector('.pk-hold');
      b.addEventListener('pointerdown', e => { e.preventDefault(); pouring = true; try { b.setPointerCapture(e.pointerId); } catch (x) {} });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => b.addEventListener(ev, () => { if (pouring) stopPour(); }));
      b.addEventListener('contextmenu', e => e.preventDefault());
    } else if (phase === 'cook1' || phase === 'cook2') {
      bar.innerHTML = `<p class="pk-hint">${t('cookHint')}: <b>${esc(tr(T.bake[order.bake]))}</b></p><button type="button" class="pk-big">${phase === 'cook1' ? t('flip') : t('off')}</button>`;
      bar.querySelector('.pk-big').onclick = cookAct;
    } else if (phase === 'top') {
      bar.innerHTML = `<div class="pk-grid pk-tops">${order.cards.map(id => `<button type="button" class="pk-btn pk-top" data-top="${id}" title="${esc(tr(TP[id].nm))}" aria-label="${esc(tr(TP[id].nm))}"><canvas width="32" height="32"></canvas><b hidden></b></button>`).join('')}<button type="button" class="pk-btn pk-undo" aria-label="undo">${t('undo')}</button><button type="button" class="pk-btn pk-serve">${t('serve')}</button></div>`;
      bar.querySelectorAll('[data-top]').forEach(b => { b.querySelector('canvas').getContext('2d').drawImage(topIcon(b.dataset.top), 0, 0); b.onclick = () => { const id = b.dataset.top; added[id] = (added[id] || 0) + 1; addSeq.push(id); topCounts(); }; });
      bar.querySelector('.pk-undo').onclick = () => { const id = addSeq.pop(); if (id) { added[id]--; if (!added[id]) delete added[id]; topCounts(); } };
      bar.querySelector('.pk-serve').onclick = serve;
      topCounts();
    } else if (phase === 'react') {
      bar.innerHTML = `<button type="button" class="pk-big">${t('next')}</button>`;
      bar.querySelector('.pk-big').onclick = () => { if (hearts > 0) nextLevel(); };
      bar.hidden = hearts <= 0;
    } else if (phase === 'wash') {
      const can = info.me && run && (info.buttons || 0) >= info.soap;
      const sp = spareLeft > 0 && info.me && run;
      bar.innerHTML = `<div class="pk-row"><button type="button" class="pk-big pk-soap"${can ? '' : ' disabled'}>${t('soap', info.soap)}</button><button type="button" class="pk-big pk-water">${t('water')}</button></div>${sp ? `<button type="button" class="pk-big pk-spare">${t('spare', spareLeft)}</button>` : can ? '' : `<p class="pk-hint pk-small">${info.me ? t('poor') : t('soapGuest')}</p>`}`;
      bar.querySelector('.pk-soap').onclick = () => chooseWash(true);
      if (sp) bar.querySelector('.pk-spare').onclick = () => chooseWash('spare');
      bar.querySelector('.pk-water').onclick = () => chooseWash(false);
    } else if (phase === 'scrub') {
      bar.innerHTML = `<p class="pk-big pk-rub">${t('rub', 0)}</p>`;
    } else bar.innerHTML = '';
  }
  function topCounts() { bar.querySelectorAll('[data-top]').forEach(b => { const n = added[b.dataset.top] || 0, el = b.querySelector('b'); el.hidden = !n; el.textContent = '×' + n; b.classList.toggle('on', n > 0); }); }
  function icon(c, s) {
    const g = c.getContext('2d'), k = c.width / G;
    g.fillStyle = '#E9B25C'; for (const [x, y] of s.cells) g.fillRect(Math.floor(x * k), Math.floor(y * k), Math.ceil(k), Math.ceil(k));
  }
  function newPancake() { cur = { fill: 0, d1: 0, d2: 0, side: 1, bubbles: [] }; setPhase('pour'); }
  function stopPour() {
    pouring = false;
    if (phase !== 'pour' || cur.fill < 0.15) return;
    setPhase('cook1');
  }
  function cookAct() {
    if (phase === 'cook1') { flipT = 0; setPhase('flip'); }
    else if (phase === 'cook2') {
      made.push({ pour: cur.fill, s1: cur.d1, s2: cur.d2 }); cur = null;
      if (made.length < order.n) newPancake(); else setPhase('top');
    }
  }

  function loop() {
    if (state !== 'play') return;
    const nowT = performance.now(), dt = Math.max(0, Math.min(0.05, (nowT - last) / 1000)); last = nowT;
    update(dt); draw();
    if (state === 'play') requestAnimationFrame(loop);
  }
  function update(dt) {
    phaseT += dt; walk += dt;
    if (shake > 0) shake -= dt;
    if (banner) { banner.t -= dt; if (banner.t <= 0) banner = null; }
    for (const f of fx) { f.t -= dt; f.y -= 30 * dt; }
    fx = fx.filter(f => f.t > 0);
    for (const f of foam) f.t -= dt;
    foam = foam.filter(f => f.t > 0);
    const p = P(level);
    if (isTimed() && !late) { patT -= dt; if (patT <= 0) { late = true; patT = 0; } }
    if (phase === 'arrive' && phaseT > 0.9) setPhase('pan');
    if (phase === 'pour' && pouring) { cur.fill += dt / p.pour; if (cur.fill >= 1.3) { cur.fill = 1.3; stopPour(); } }
    const hot = d => d < BAKE[order.bake] - 0.18 ? 1 + 0.35 * up('hot') : 1; // улучшение «Горячая плита»: до цели — быстрее
    if (order && phase !== 'arrive' && phase !== 'react') {
      if (order.memo != null && order.memo > 0) order.memo -= dt; // «как в прошлый раз»: заказ виден 3,5 с
      if (order.trait === 'chatty' && (chatT += dt) > 3.6) { chatT = 0; order.say = tr(pick(CHAT)); }
    }
    if (phase === 'cook1') { cur.d1 += dt / p.cook * hot(cur.d1); if (cur.d1 > 1.12) cookAct(); }
    if (phase === 'cook1' && cur.d1 > BAKE[order.bake] - 0.2 && Math.random() < dt * 14) { const s = SH[chosen].cells; const c = s[Math.floor(Math.random() * s.length)]; if (c[2] <= cur.fill * SH[chosen].maxR) cur.bubbles.push(c); } // пузырьки — пора переворачивать
    if (phase === 'flip') { flipT += dt / 0.45; if (flipT >= 1) { cur.side = 2; setPhase('cook2'); } }
    if (phase === 'cook2') { cur.d2 += dt / p.cook * hot(cur.d2); if (cur.d2 > 1.12) cookAct(); }
    if (phase === 'clean' && phaseT > 1.3) { dirt = null; newCustomer(); }
  }

  // ---------- рисование ----------
  const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const BODY = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...', '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......'];
  const HAT = ['....dddddd....', '...dwwwwwwd...', '...dwwwwwwd...', '....dwwwwd....', '....dddddd....'];
  const LEGS = [['....o..o......', '...oo.oo......'], ['.....o.o......', '....oo.oo.....']];
  const PCOL = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b' };
  function drawPolly(x, y, s, f, up) {
    const rows = HAT.concat(BODY.slice(1)).concat(LEGS[f]);
    rows.forEach((r, j) => [...r].forEach((ch, i) => { if (PCOL[ch]) px(x + (13 - i) * s, y - up + j * s, s, s, PCOL[ch]); })); // зеркально: смотрит влево, на сковородку
  }
  function wrap(s, max) { const out = []; let c = ''; for (const w of String(s).split(' ')) { const n = c ? c + ' ' + w : w; if (ctx.measureText(n).width > max && c) { out.push(c); c = w; } else c = n; } if (c) out.push(c); return out; }
  function drawShapeCells(s, cx, cy, cell, colFn, filter) {
    const o = G * cell / 2;
    for (const c of s.cells) { if (filter && !filter(c)) continue; ctx.fillStyle = colFn(c); ctx.fillRect(Math.floor(cx - o + c[0] * cell), Math.floor(cy - o + c[1] * cell), Math.ceil(cell), Math.ceil(cell)); }
  }
  function drawPan(dirty) {
    px(PAN.x - PAN.r - 58, PAN.y - 7, 60, 14, '#1a1528'); px(PAN.x - PAN.r - 56, PAN.y - 5, 40, 10, '#8C5A3C'); px(PAN.x - PAN.r - 56, PAN.y - 5, 40, 3, '#A9744F'); // ручка
    ctx.fillStyle = '#1a1528'; ctx.beginPath(); ctx.arc(PAN.x, PAN.y, PAN.r + 3, 0, 7); ctx.fill();
    ctx.fillStyle = '#6C687C'; ctx.beginPath(); ctx.arc(PAN.x, PAN.y, PAN.r, 0, 7); ctx.fill();
    ctx.fillStyle = '#3F3B4E'; ctx.beginPath(); ctx.arc(PAN.x, PAN.y, PAN.r - 8, 0, 7); ctx.fill();
    if (chosen && phase !== 'wash' && phase !== 'scrub' && phase !== 'clean') drawShapeCells(SH[chosen], PAN.x, PAN.y, CELL, () => '#2C2938'); // форма сковородки
    const grime = (level - 1) % (info.wash || 10); // сковородка понемногу грязнеет
    if (!dirt) for (let i = 0; i < grime * 3; i++) { const a = i * 2.39, r = 20 + (i * 37) % 56; px(PAN.x + Math.cos(a) * r, PAN.y + Math.sin(a) * r, 3, 3, 'rgba(40,24,14,.5)'); }
    if (dirt) for (const d of dirt) if (d.v > 0.02) { ctx.globalAlpha = Math.min(1, d.v / 1.6); px(d.x - 3, d.y - 3, 6.5, 6.5, d.v0 > 1.8 ? '#2A160C' : '#5A3A1E'); }
    ctx.globalAlpha = 1;
    px(PAN.x - 40, PAN.y - PAN.r + 6, 26, 3, 'rgba(255,255,255,.18)'); // блик
  }
  function drawBatter() {
    if (!cur || !chosen) return;
    const s = SH[chosen], f = cur.fill, R = f * s.maxR;
    let k = 1, topCol = cur.side === 1 ? bakeCol(Math.min(cur.d1 * 0.25, 0.2)) : bakeCol(cur.d1); // сверху — сырая сторона, после переворота — пропечённая первая
    if (phase === 'flip') { k = Math.abs(Math.cos(Math.PI * flipT)); if (flipT > 0.5) topCol = bakeCol(cur.d1); }
    const lift = phase === 'flip' ? Math.sin(Math.PI * flipT) * 46 : 0;
    ctx.save(); ctx.translate(PAN.x, PAN.y - lift); ctx.scale(1, Math.max(0.08, k)); ctx.translate(-PAN.x, -PAN.y);
    const edge = bakeCol(Math.max(cur.d1, 0.35) + 0.12);
    drawShapeCells(s, PAN.x, PAN.y, CELL, c => c[2] > R - 0.06 ? edge : topCol, c => c[2] <= R);
    if (f > 1) { const o = G * CELL / 2; ctx.fillStyle = bakeCol(0.1); for (const c of s.out) if (c[2] <= s.minOut + (f - 1) * 3) ctx.fillRect(Math.floor(PAN.x - o + c[0] * CELL), Math.floor(PAN.y - o + c[1] * CELL), Math.ceil(CELL), Math.ceil(CELL)); } // перелила — тесто убежало
    if (cur.side === 1 && phase !== 'flip') { const o = G * CELL / 2; ctx.fillStyle = 'rgba(160,110,50,.55)'; for (const c of cur.bubbles) ctx.fillRect(Math.floor(PAN.x - o + c[0] * CELL), Math.floor(PAN.y - o + c[1] * CELL), 2, 2); }
    if (cur.side === 2 && cur.d1 > 0.5) { const o = G * CELL / 2; ctx.fillStyle = bakeCol(cur.d1 + 0.12); s.cells.forEach((c, i) => { if (i % 23 === 0 && c[2] < R - 0.1) ctx.fillRect(Math.floor(PAN.x - o + c[0] * CELL), Math.floor(PAN.y - o + c[1] * CELL), 4, 3); }); }
    ctx.restore();
    // струйка теста из миски
    if (phase === 'pour' && pouring) { px(PAN.x - 3, PAN.y - 120, 6, 120, '#F4DFA6'); px(PAN.x - 20, PAN.y - 140, 40, 22, '#1a1528'); px(PAN.x - 18, PAN.y - 138, 36, 18, '#E7EEF7'); px(PAN.x - 14, PAN.y - 138, 28, 5, '#F4DFA6'); }
    // дымок, если подгорает
    const d = cur.side === 1 ? cur.d1 : cur.d2;
    if ((phase === 'cook1' || phase === 'cook2') && d > 0.82) for (let i = 0; i < 5; i++) { const y = (phaseT * 40 + i * 22) % 90; ctx.globalAlpha = 0.5 * (1 - y / 90); px(PAN.x - 30 + i * 14 + Math.sin(y / 10 + i) * 4, PAN.y - 40 - y, 8, 8, '#8A8696'); }
    ctx.globalAlpha = 1;
  }
  // шкала справа от сковородки: налить (зелёная полоса) или прожарка (цвета и рамка цели)
  function drawGauge() {
    const x = 224, y0 = 244, h = 156, w = 16;
    if (!['pour', 'cook1', 'cook2', 'flip'].includes(phase) || !cur) return;
    px(x - 2, y0 - 2, w + 4, h + 4, '#1a1528');
    const p = P(level);
    if (phase === 'pour') {
      px(x, y0, w, h, '#F3EBDD');
      const yOf = v => y0 + h - v / 1.3 * h;
      px(x, yOf(0.94 + p.pw), w, (2 * p.pw) / 1.3 * h, '#7CC47F');
      px(x, y0 + h - Math.min(1.3, cur.fill) / 1.3 * h, w, Math.min(1.3, cur.fill) / 1.3 * h, 'rgba(240,200,110,.85)');
      px(x - 4, yOf(cur.fill) - 1, w + 8, 3, '#1a1528');
    } else {
      for (let i = 0; i < h; i++) px(x, y0 + h - i - 1, w, 1, bakeCol(i / h * 1.12));
      const yOf = v => y0 + h - v / 1.12 * h, tg = BAKE[order.bake];
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(x - 3, yOf(tg + p.w), w + 6, 2 * p.w / 1.12 * h);
      const d = phase === 'cook2' ? cur.d2 : cur.d1;
      px(x - 5, yOf(Math.min(1.12, d)) - 1, w + 10, 3, '#1a1528'); px(x + w + 5, yOf(Math.min(1.12, d)) - 4, 4, 9, '#1a1528');
    }
  }
  // тарелка: готовые блины стопкой (сбоку)
  function drawPlate() {
    const n = made.length;
    if (!n || phase === 'top' || phase === 'react') return;
    px(PLATE.x - 32, PLATE.y, 64, 5, '#1a1528'); px(PLATE.x - 30, PLATE.y, 60, 3, '#FFFFFF');
    for (let i = 0; i < n; i++) { const c = bakeCol((made[i].s1 + made[i].s2) / 2); px(PLATE.x - 24, PLATE.y - 5 - i * 5, 48, 6, '#1a1528'); px(PLATE.x - 23, PLATE.y - 4 - i * 5, 46, 4, c); }
  }
  // готовый заказ сверху: блин на тарелке и топпинги
  const rnd = i => { const v = Math.sin(i * 127.1 + level * 31.7) * 43758.5453; return v - Math.floor(v); };
  function drawServed() {
    const s = SH[chosen || 'round'], n = made.length || 1, cx = PAN.x, cy = PAN.y;
    ctx.fillStyle = '#1a1528'; ctx.beginPath(); ctx.arc(cx, cy + 6, 90, 0, 7); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(cx, cy + 6, 87, 0, 7); ctx.fill();
    ctx.fillStyle = '#E3E6EE'; ctx.beginPath(); ctx.arc(cx, cy + 6, 70, 0, 7); ctx.fill();
    const avg = made.length ? made.reduce((a, m) => a + (m.s1 + m.s2) / 2, 0) / made.length : 0.58;
    for (let i = n - 1; i >= 0; i--) drawShapeCells(s, cx, cy + i * 3, CELL * 0.9, c => i ? '#1a1528' : c[2] > s.maxR - 0.08 ? bakeCol(avg + 0.14) : bakeCol(avg));
    // топпинги: по порядку добавления, у каждой порции — свои места
    const o = G * CELL * 0.9 / 2, cells = s.cells.filter(c => c[2] < s.maxR - 0.12);
    const at = j => { const c = cells[Math.floor(rnd(j) * cells.length)]; return [cx - o + c[0] * CELL * 0.9, cy - o + c[1] * CELL * 0.9]; };
    addSeq.forEach((id, q) => {
      const tp = TP[id], base = q * 50 + TOPS.indexOf(tp) * 7;
      if (tp.k === 'pieces') for (let i = 0; i < tp.n; i++) { const [x, y] = at(base + i); sprite(ctx, tp.sp, x, y, 2, tp.c, rnd(base + i + 9) < 0.5); }
      else if (tp.k === 'drizzle') drizzle(tp, base, cx, cy);
      else if (tp.k === 'dust') for (let i = 0; i < (tp.rods ? 36 : 64); i++) {
        const [x, y] = at(base + i), col = tp.dc[i % tp.dc.length], v = rnd(base + i + 3) < 0.5;
        if (tp.rods) px(x, y, v ? 2 : 4, v ? 4 : 2, col); else px(x, y, v ? 2 : 1, v ? 2 : 1, col);
      } else { const [x, y] = at(base); sprite(ctx, tp.sp, x, y - 4, 2, tp.c); }
    });
    if (n > 1) { ctx.fillStyle = '#2b1f3d'; ctx.font = '800 14px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('×' + n, cx + 74, cy + 86); }
  }
  // струйка сиропа пикселями: тень, цвет, блики и две капли
  function drizzle(tp, base, cx, cy) {
    const pts = [], dots = [], y0 = cy - 30 + rnd(base) * 20;
    for (let i = 0; i <= 8; i++) pts.push([cx - 44 + i * 11, y0 + (i % 2 ? 16 : 0) + rnd(base + i) * 10]);
    for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], m = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 2); for (let j = 0; j < m; j++) dots.push([x1 + (x2 - x1) * j / m, y1 + (y2 - y1) * j / m]); }
    for (const [x, y] of dots) px(x - 2, y - 1, 4, 5, tp.c.b);
    for (const [x, y] of dots) px(x - 2, y - 2, 4, 4, tp.c.a);
    dots.forEach(([x, y], i) => { if (i % 3 === 0) px(x - 1, y - 2, 2, 1, tp.c.h); });
    for (let k = 0; k < 2; k++) { const [x, y] = dots[Math.floor(rnd(base + 20 + k) * dots.length)], l = 4 + Math.floor(rnd(base + 30 + k) * 6); px(x - 1, y, 3, l, tp.c.a); px(x - 2, y + l, 5, 3, tp.c.a); px(x - 1, y + l + 3, 3, 1, tp.c.b); px(x - 1, y + l, 1, 2, tp.c.h); }
  }
  // клякса варенья поверх заляпанного в заказе (x, y — левый верхний угол)
  function jamBlot(x, y, w, h, seed) {
    for (let j = 0; j < h; j += 2) for (let i = 0; i < w; i += 2) { const u = (i + 1 - w / 2) / (w / 2), v = (j + 1 - h / 2) / (h / 2), r = u * u + v * v; if (r < 0.72 + rnd(seed + i * 3 + j * 7) * 0.4) px(x + i, y + j, 2, 2, r > 0.62 ? '#7E1129' : '#A91E3E'); }
    const dx = x + Math.round(w * (0.3 + rnd(seed) * 0.4)); px(dx, y + h - 2, 2, 5, '#A91E3E'); px(dx - 1, y + h + 3, 4, 3, '#A91E3E');
    px(x + w * 0.28, y + h * 0.3, 3, 2, '#F06A86'); px(x + w * 0.28 + 4, y + h * 0.3 + 3, 1, 1, '#F06A86');
  }
  // заказ: листок под облачком
  function drawTicket(x, y, w) {
    px(x, y, w, 64, '#1a1528'); px(x + 1, y + 1, w - 2, 62, '#FFF6D8');
    for (let i = 0; i < w; i += 8) px(x + i, y + 62, 4, 2, '#FFF6D8');
    const jam = order.bear ? order.bear.jam : [], cut = (txt, mw) => { while (txt.length > 3 && ctx.measureText(txt).width > mw) txt = txt.slice(0, -2) + '…'; return txt; };
    ctx.textAlign = 'left'; ctx.fillStyle = order.bear ? '#A91E3E' : '#7a6a8a'; ctx.font = '700 10px system-ui, sans-serif';
    ctx.fillText(cut(order.bear ? t('toGo') + ' · ' + t('forWho', tr(order.bear.who.n)) : t('order').toUpperCase() + (order.trait ? ' · ' + tr(T.trait[order.trait]) : ''), w - 14), x + 8, y + 13);
    if (order.memo != null) { // «как в прошлый раз»: сначала заказ виден (полоска убывает), потом прячется
      if (order.memo <= 0) { ctx.fillStyle = '#2b1f3d'; ctx.font = '800 15px system-ui, sans-serif'; ctx.fillText(t('sameT'), x + 10, y + 42); return; }
      px(x + 8, y + 58, (w - 16) * clamp(order.memo / 3.5), 2, '#6a3fb0');
    }
    const s = SH[order.shape], o = G / 22;
    ctx.fillStyle = bakeCol(BAKE[order.bake]); for (const c of s.cells) if (c[0] % 2 === 0 && c[1] % 2 === 0) ctx.fillRect(Math.floor(x + 8 + c[0] / o), Math.floor(y + 18 + c[1] / o), 2, 2);
    ctx.fillStyle = '#2b1f3d'; ctx.font = '700 12px system-ui, sans-serif';
    const sn = tr(s.n), mid = ` ×${order.n} · `, bk = tr(T.bake[order.bake]), x1 = x + 36, x2 = x1 + ctx.measureText(sn).width, x3 = x2 + ctx.measureText(mid).width;
    ctx.fillText(sn, x1, y + 32); ctx.fillText(mid, x2, y + 32); ctx.fillText(bk, x3, y + 32);
    if (jam.includes('shape')) { jamBlot(x + 5, y + 16, 26, 24, 3); jamBlot(x1 - 2, y + 21, Math.ceil(x2 - x1) + 4, 14, 5); }
    if (jam.includes('bake')) jamBlot(x3 - 2, y + 21, Math.ceil(ctx.measureText(bk).width) + 4, 14, 7);
    let tx = x1;
    const tops = Object.entries(order.tops);
    if (!tops.length) { ctx.font = 'italic 600 12px system-ui, sans-serif'; ctx.fillText('— ' + t('plain'), tx, y + 52); }
    tops.forEach(([id, n], i) => {
      ctx.drawImage(topIcon(id), tx, y + 38, 20, 20);
      if (jam.includes(id)) jamBlot(tx - 3, y + 35, 17, 16, 11 + i);
      tx += 21; if (n > 1) { ctx.font = '800 12px system-ui, sans-serif'; ctx.fillStyle = '#2b1f3d'; ctx.fillText('×' + n, tx, y + 53); tx += ctx.measureText('×' + n).width + 2; }
      tx += 6;
    });
  }
  function drawCustomer() {
    // окошко раздачи
    const wx = 222, wy = 52, ww = 128, wh = 124;
    px(wx - 4, wy - 4, ww + 8, wh + 8, '#5B3A28'); px(wx, wy, ww, wh, '#BFE3F6'); px(wx, wy + wh - 30, ww, 30, '#9BCB8F');
    px(wx - 8, wy + wh, ww + 16, 8, '#8C5A3C'); px(wx - 8, wy + wh, ww + 16, 3, '#A9744F');
    for (let i = 0; i < 6; i++) px(wx + i * 22, wy - 16, 22, 12, i % 2 ? '#FFFFFF' : '#E2725B'); // навес
    if (!cust) return;
    const k = phase === 'arrive' ? Math.min(1, phaseT / 0.6) : 1, cx = wx + ww / 2, cy = wy + 62 + (1 - k) * 80;
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    // портрет 48×48 из карточки (pt-*, ×2); у кого его нет — медальон ch-*
    const pt = cust.bear ? null : img('/images/wobbleland/pt-' + cust.img + '.png');
    const im = pt && pt.complete && !pt.naturalWidth ? img('/images/wobbleland/ch-' + cust.img + '.png') : pt;
    if (cust.bear) BEAR_PX.forEach((r, j) => [...r].forEach((ch, i) => { if (BEAR_COL[ch]) px(cx - 40 + i * 4, cy - 40 + j * 4, 4, 4, BEAR_COL[ch]); })); // медведь-курьер 20×20 ×4
    else if (im === pt && pt.complete) { const x = Math.round(cx - 48), y = Math.round(cy - 48); px(x - 2, y - 2, 100, 100, '#1a1528'); ctx.drawImage(pt, x, y, 96, 96); }
    else if (im !== pt && im.complete && im.naturalWidth) { const s = Math.floor(84 / Math.max(im.naturalWidth, im.naturalHeight)); ctx.drawImage(im, Math.round(cx - im.naturalWidth * s / 2), Math.round(cy - im.naturalHeight * s / 2), im.naturalWidth * s, im.naturalHeight * s); }
    else { ctx.fillStyle = '#7F81BF'; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, 7); ctx.fill(); }
    ctx.restore();
    const cr = cust.city && img('/images/wobbleland/crest-' + cust.city + '.png');
    if (cr && cr.complete && cr.naturalWidth) ctx.drawImage(cr, wx + ww - 22, wy + 4, 20, 23);
    ctx.textAlign = 'center'; ctx.fillStyle = '#2b1f3d'; ctx.font = '700 11px system-ui, sans-serif';
    const nm = tr(cust.n); ctx.fillText(nm.length > 24 ? nm.slice(0, 23) + '…' : nm, cx, wy + wh + 22);
    // терпение
    if (order && order.pat && phase !== 'react') { const f = clamp(patT / order.pat); px(wx, wy + wh + 28, ww, 5, 'rgba(43,31,61,.2)'); px(wx, wy + wh + 28, ww * f, 5, f > 0.35 ? '#7CC47F' : f > 0 ? '#E9A93B' : '#D85A30'); }
    // облачко
    const say = phase === 'react' && result ? result.say : order ? order.say : tr(cust.hi);
    ctx.font = '600 12px system-ui, sans-serif'; const lines = wrap(say, 186).slice(0, 5), bh = 14 + lines.length * 15;
    const bx = 8, by = 50;
    if (k >= 1) {
      px(bx - 1, by - 1, 204, bh + 2, '#1a1528'); px(bx, by, 202, bh, '#FFFFFF'); px(bx + 202, by + 14, 6, 6, '#FFFFFF'); px(bx + 202, by + 13, 7, 1, '#1a1528'); px(bx + 202, by + 20, 7, 1, '#1a1528');
      ctx.textAlign = 'left'; ctx.fillStyle = '#2b1f3d'; lines.forEach((ln, i) => ctx.fillText(ln, bx + 8, by + 18 + i * 15));
      if (phase !== 'react') drawTicket(bx, by + bh + 8, 202);
    }
    if (phase === 'react' && result) {
      ctx.font = '44px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(T.mood[result.mood], wx + 16, wy + 40);
      const y = by + bh + 12; ctx.textAlign = 'left';
      const items = [[t('okShape'), result.shapeOk], [t('okBake'), result.bakeG], [t('okTops'), result.topsOk]];
      if (order.pat) items.push([t('okTime'), !late]);
      if (order.bear) items.push([t('okGuess'), result.guess]);
      if (result.lucky) items.push([t('okLuck'), true]);
      px(bx, y, 202, 30 + Math.ceil(items.length / 2) * 18, 'rgba(255,250,242,.94)');
      ctx.fillStyle = '#2b1f3d'; ctx.font = '800 14px system-ui, sans-serif'; ctx.fillText(T.moodName[L][result.mood], bx + 8, y + 18);
      ctx.font = '600 12px system-ui, sans-serif';
      const mark = ok => ok === true || ok === 0 ? '✓' : ok === 1 ? '≈' : '✗';
      items.forEach(([n, ok], i) => { ctx.fillStyle = ok === true || ok === 0 ? '#3E9B4F' : ok === 1 ? '#C8961E' : '#D85A30'; ctx.fillText(mark(ok) + ' ' + n, bx + 8 + (i % 2) * 100, y + 38 + Math.floor(i / 2) * 18); });
    }
  }
  function draw() {
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6);
    // стена с плиткой и столешница
    px(-10, -10, W + 20, 236, '#F6E7D2');
    for (let y = 44; y < 226; y += 18) for (let x = (y / 18) % 2 ? -9 : 0; x < W; x += 18) px(x, y, 17, 17, '#F2DEC4');
    px(-10, 226, W + 20, BAR - 226, '#C99A6B'); px(-10, 226, W + 20, 6, '#E0B88A'); px(-10, 232, W + 20, 2, '#8C5A3C');
    for (let x = 0; x < W; x += 40) px(x, 240 + (x * 7) % 30, 18, 2, '#B98A5B');
    px(-10, BAR, W + 20, H - BAR + 10, '#2b1f3d');
    // плита под сковородкой
    px(PAN.x - 96, PAN.y - 96, 192, 192, '#1a1528'); px(PAN.x - 94, PAN.y - 94, 188, 188, '#4A4560');
    const hot = ['pour', 'cook1', 'flip', 'cook2'].includes(phase);
    ctx.strokeStyle = hot ? '#F08A3B' : '#2C2938'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(PAN.x, PAN.y, 88, 0, 7); ctx.stroke(); ctx.lineWidth = 1;
    if (state === 'play' || state === 'pause') {
      drawCustomer();
      if (phase === 'top' || phase === 'react') drawServed(); else { drawPan(); drawBatter(); }
      drawGauge(); drawPlate();
      // Полли у плиты (подпрыгивает, когда переворачивает)
      const up = phase === 'flip' ? Math.sin(Math.PI * flipT) * 10 : phase === 'scrub' ? Math.abs(Math.sin(walk * 10)) * 4 : 0;
      drawPolly(POLLY.x + 34, POLLY.y + 40, 4, Math.floor(walk * 3) % 2 && phase === 'scrub' ? 1 : 0, up);
      for (const f of foam) { ctx.globalAlpha = Math.min(1, f.t); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill(); ctx.strokeStyle = '#BFE3FF'; ctx.stroke(); }
      ctx.globalAlpha = 1;
      if (phase === 'wash' || phase === 'scrub' || phase === 'clean') {
        ctx.textAlign = 'left'; ctx.font = '700 13px system-ui, sans-serif';
        const ln = wrap(t('dirty'), 190); px(7, 49, 206, 16 + ln.length * 16, '#1a1528'); px(8, 50, 204, 14 + ln.length * 16, '#FFFFFF');
        ctx.fillStyle = '#2b1f3d'; ln.forEach((l, i) => ctx.fillText(l, 16, 68 + i * 16));
      }
    } else { drawPan(); drawPolly(POLLY.x + 34, POLLY.y + 40, 4, 0, 0); drawCustomer(); }
    ctx.textAlign = 'center'; ctx.font = '800 16px system-ui, sans-serif';
    for (const e of fx) { ctx.globalAlpha = Math.max(0, Math.min(1, e.t * 1.5)); ctx.fillStyle = e.col; ctx.fillText(e.txt, e.x, e.y); }
    ctx.globalAlpha = 1;
    ctx.restore();
    // панель сверху: уровень, сердечки
    px(0, 0, W, 36, 'rgba(43,31,61,.88)');
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = '700 15px system-ui, sans-serif'; ctx.fillText('🥞 ' + (maxH > 3 && luck > 0 ? '' : t('lv') + ' ') + level, 10, 24); // при 4–5 сердечках и удаче медведя — без слова «Уровень»
    for (let i = 0; i < maxH; i++) drawHeart(W - 74 - (maxH - 1 - i) * (maxH > 3 ? 25 : 28), 10, 3, i < hearts ? '#E2564B' : 'rgba(255,255,255,.25)');
    if (luck > 0 && state === 'play') { ctx.font = '700 12px system-ui, sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.fillText('🍯' + luck, W - 80 - (maxH - 1) * (maxH > 3 ? 25 : 28), 23); }
    if (banner) {
      ctx.globalAlpha = Math.min(1, banner.t * 2); ctx.textAlign = 'center'; ctx.font = '800 15px system-ui, sans-serif';
      const lines = wrap(banner.txt, W - 60), h = lines.length * 21 + 20;
      px(24, 196 - h / 2, W - 48, h, 'rgba(255,250,242,.95)'); ctx.fillStyle = '#2b1f3d'; lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 196 - h / 2 + 25 + i * 21));
      ctx.globalAlpha = 1;
    }
  }
  function drawHeart(x, y, s, c) {
    const H0 = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
    ctx.fillStyle = c; H0.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') ctx.fillRect(Math.round(x + i * s), Math.round(y + j * s), s, s); }));
  }

  // ---------- экраны поверх поля ----------
  function showOverlay() {
    ov.hidden = false; bar.hidden = state !== 'play';
    const payLine = info.on && info.per > 0 ? `<p class="rain-pay">${t('pay', info.per)}${info.me ? ` <b>${t('today0', info.today)}</b>` : ''}</p>` : `<p class="rain-pay">${t('payOff')}</p>`;
    const extra = `${info.record > 0 && info.on ? `<p class="rain-pay">${t('recRule', info.record)}</p>` : ''}${info.every > 0 ? `<p class="rain-pay">${t('itemRule', info.every)}</p>` : ''}<p class="rain-pay">${t('washRule', info.wash, info.soap)}</p>`;
    const guest = info.me ? '' : `<p class="rain-guest">${t('guest')} <button type="button" class="pill-btn rain-in">${t('signin')}</button></p>`;
    // старт с рубежа (последние 5) и кнопка улучшений
    const f = froms().slice(-5);
    const prep = `${f.length ? `<p class="pk-from"><span>${t('from')}:</span>${[0, ...f].map(m => `<button type="button" class="pk-chip${m === fromSel ? ' on' : ''}" data-from="${m}">${m + 1}</button>`).join('')}</p>` : ''}<p><button type="button" class="pill-btn pk-ups-btn">${t('upsBtn')}</button></p>`;
    if (!f.includes(fromSel)) fromSel = 0;
    if (upsOpen && state !== 'pause') {
      const have = info.ups || {};
      ov.innerHTML = `<div class="rain-card"><h2>${t('upsTitle')}</h2><p class="rain-pay">${t('upsHow')}</p>${info.me ? `<p class="rain-best">${t('have', info.buttons || 0)}</p>` : `<p class="rain-guest">${t('upsGuest')} <button type="button" class="pill-btn rain-in">${t('signin')}</button></p>`}<ul class="pk-ups">${Object.entries(UPS).map(([k, u]) => {
        const x = (info.up || {})[k] || { max: 0, cost: 0 }, lv = have[k] || 0, cost = x.cost * (lv + 1), can = info.me && (info.buttons || 0) >= cost;
        return `<li><i>${u.e}</i><div><b>${esc(tr(u.n))}</b> <span class="pk-pips">${'●'.repeat(lv)}${'○'.repeat(Math.max(0, x.max - lv))}</span><small>${esc(tr(u.d))}</small></div>${lv >= x.max ? `<em>${t('maxed')}</em>` : `<button type="button" class="pill-btn pill-fill" data-up="${k}"${can ? '' : ' disabled'}>${t('buy', cost)}</button>`}</li>`;
      }).join('')}</ul><button type="button" class="pill-btn pk-back">${t('back')}</button></div>`;
      ov.querySelector('.pk-back').onclick = () => { upsOpen = false; showOverlay(); };
      ov.querySelectorAll('[data-up]').forEach(b => { b.onclick = () => { b.disabled = true; buyUp(b.dataset.up); }; });
      const si = ov.querySelector('.rain-in'); if (si) si.onclick = () => window.PPAccount && window.PPAccount.openSignIn();
      return;
    }
    if (state === 'menu') ov.innerHTML = `<div class="rain-card"><h2>🥞 ${t('title')}</h2><p>${t('how')}</p>${info.best ? `<p class="rain-best">${t('best', info.best)}</p>` : ''}<button type="button" class="pill-btn pill-fill rain-go">${t('play')}</button>${prep}${guest}<div class="rain-rules"><p>${t('rules')}</p>${payLine}${extra}</div></div>`;
    else if (state === 'pause') ov.innerHTML = `<div class="rain-card"><h2>${t('paused')}</h2><button type="button" class="pill-btn pill-fill rain-go">${t('resume')}</button></div>`;
    else if (state === 'over') ov.innerHTML = `<div class="rain-card"><h2>${t('over')}</h2><p class="rain-big">${t('reached', level - startLv)}</p>${info.me && level - 1 > startBest ? `<p class="rain-best">${t('newBest')}</p>` : info.best ? `<p class="rain-best">${t('best', info.best)}</p>` : ''}${runGot ? `<p class="rain-got">${t('earned', runGot)}</p><p class="pp-sew">${window.PPSew || ''}</p>` : ''}${runItems.length ? `<p class="rain-got">🎁 ${runItems.map(esc).join(', ')}</p>` : ''}${payLine}${guest}<button type="button" class="pill-btn pill-fill rain-go">${t('again')}</button>${prep}</div>`;
    const go = ov.querySelector('.rain-go'); if (go) go.onclick = () => state === 'pause' ? resume() : start(fromSel);
    ov.querySelectorAll('[data-from]').forEach(b => { b.onclick = () => { fromSel = +b.dataset.from; showOverlay(); }; });
    const ub = ov.querySelector('.pk-ups-btn'); if (ub) ub.onclick = () => { upsOpen = true; showOverlay(); };
    const si = ov.querySelector('.rain-in'); if (si) si.onclick = () => window.PPAccount && window.PPAccount.openSignIn();
  }

  // покупка улучшения: сервер списывает пуговки и возвращает новые уровни
  function buyUp(k) {
    post('pancakes/up', { k }).then(r => {
      info.ups = r.ups; info.buttons = r.buttons; window.PPAccount && window.PPAccount.setButtons && window.PPAccount.setButtons(r.buttons);
      window.PPToast && window.PPToast(t('bought')); showOverlay();
    }).catch(() => { window.PPToast && window.PPToast(t('poor')); load(); });
  }

  // ---------- управление: мытьё пальцем по сковородке, пробел — лить тесто / действие ----------
  const toXY = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  let lastXY = null;
  cv.addEventListener('pointerdown', e => { if (phase === 'scrub' && state === 'play') { lastXY = toXY(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} } });
  cv.addEventListener('pointermove', e => {
    if (phase !== 'scrub' || state !== 'play') return;
    if (e.pointerType !== 'mouse' && !e.buttons && !(e.pressure > 0)) return;
    const xy = toXY(e); if (lastXY) scrub(xy[0], xy[1], Math.min(40, Math.hypot(xy[0] - lastXY[0], xy[1] - lastXY[1]))); lastXY = xy;
  });
  cv.addEventListener('pointerup', () => { lastXY = null; });
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if (e.code === 'Escape' && (state === 'play' || state === 'pause')) { e.preventDefault(); state === 'play' ? pause() : resume(); }
    if (e.code === 'Space' && state === 'play') {
      e.preventDefault();
      if (phase === 'pour' && !e.repeat) pouring = true;
      else if ((phase === 'cook1' || phase === 'cook2') && !e.repeat) cookAct();
    }
  });
  addEventListener('keyup', e => { if (e.code === 'Space' && phase === 'pour' && pouring) stopPour(); });
  pauseBtn.onclick = pause;
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  addEventListener('resize', fit);

  // только на локальном сервере: доступ для автотеста
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__pan = { s: () => ({ state, phase, level, hearts, maxH, luck, spareLeft, order, chosen, cur, made, added, result, dirt: dirtLeft(), cust: cust && cust.img }), P, BAKE, TOPS, start, info: o => { Object.assign(info, o); if (state !== 'play') showOverlay(); }, force: o => { forceNext = o; },
    set: o => { if ('fill' in o && cur) cur.fill = o.fill; if ('d' in o && cur) cur[phase === 'cook2' ? 'd2' : 'd1'] = o.d; if ('pat' in o) patT = o.pat; if ('hearts' in o) hearts = o.hearts; }, scrub, pan: id => { chosen = id; newPancake(); }, pour: () => setPhase('cook1'), act: cookAct, top: id => { added[id] = (added[id] || 0) + 1; addSeq.push(id); }, serve, next: () => nextLevel(), wash: chooseWash };
  const ready = () => { fit(); showOverlay(); load(); };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', ready); else ready();
})();
