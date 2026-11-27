// Кабинет зельевара — главный экран игры птички (docs/brew.md). Пиксельная сцена 384×216, всё рисуется кодом на PPPix:
// слева очаг с котлом (огонь, бульканье, пар), сзади шкаф с зельями (слоты, закрытые слоты — с замочком), тумбочка с книгой рецептов,
// справа окно с погодой по сезону и времени Риги, сумка на полу; птичка пользователя (PPBrewBird.actor) ходит, моргает, мешает котёл.
// Поверх — HTML: уровень сверху слева, кнопки справа снизу вверх: ᚹ карта · 🔘 игры · 🚪 комнаты · 🐾 стая.
// PPBrewRoom.mount(el, { id, avatar, state, cat, on: { cauldron, book, shelf, bag, window, map, games, door, flock } }) → api
//   api.setState(state) — уровень/шкаф/котёл из GET /api/brew; api.bird — птичка; api.say(текст) — облачко; api.stir(мс).
(function () {
  const X = window.PPPix, SW = 384, SH = 216, FLOOR = 168;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const T = {
    lvl: ['Level', 'Уровень', 'Līmenis'], map: ['Map of Wobbleland', 'Карта Воббленда', 'Vobllendes karte'], games: ['Games', 'Игры', 'Spēles'],
    door: ['Rooms', 'Комнаты', 'Istabas'], flock: ['Flock', 'Стая', 'Bars'], xp: ['XP', 'опыт', 'pieredze'],
    cauldron: ['Cauldron', 'Котёл', 'Katls'], book: ['Recipe book', 'Книга рецептов', 'Receptu grāmata'], shelf: ['Potion cabinet', 'Шкаф с зельями', 'Dziru skapis'], bag: ['Ingredient bag', 'Сумка с ингредиентами', 'Sastāvdaļu soma'],
    win: [['Look at that weather!', 'What a sky today.', 'I could watch it all day.'], ['Ну и погодка!', 'Какое сегодня небо.', 'Смотреть бы и смотреть.'], ['Kas par laiku!', 'Kādas šodien debesis.', 'Varētu skatīties visu dienu.']],
  };
  const t = k => T[k][L];
  // ---------- палитра комнаты ----------
  const C = {
    wall: '#D9B98F', wall2: '#C9A479', wallDk: '#A97F58', beam: '#6B4330', beamLi: '#8C5B3F', beamDk: '#4A2C22',
    floor: '#9A6440', floorLi: '#B57A50', floorDk: '#6E4128', stone: '#8E8597', stoneLi: '#B3AAB8', stoneDk: '#5E566B',
    iron: '#3A3346', ironLi: '#5E5570', ironDk: '#231D2C', rug: '#8E3B4E', rugLi: '#B85A68', rugDk: '#5E2236', gold: '#E9C14A', goldDk: '#B8862E',
    herb: '#6E9A4A', herbDk: '#4A6B33', herbLi: '#9BC46A', paper: '#F4E6C8', cloth: '#7A4E8C', clothLi: '#9D6DB0',
  };
  // ---------- помощники рисования прямо на ctx ----------
  const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const P = (c, x, y, col) => { c.fillStyle = col; c.fillRect(x, y, 1, 1); };
  const rnd = s => () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  function grid2ctx(c, g, x, y) { g.paint(c, x, y); }
  // бутылочка: форма 0 — круглая колба, 1 — высокая, 2 — пузатая с пробкой-сердцем, 3 — звёздная (легендарная)
  function bottle(c, x, y, shape, col, glow) {
    const g = X.grid(16, 22), r = X.ramp(col), gl = X.ramp('#DCEBF2');
    const liquid = (t, u, v, px, py) => v > -.25 ? g.tone(r, t, px, py) : g.tone(gl, t * .7 + .3, px, py);
    if (shape === 1) { g.rect(5, 2, 6, 3, '#C9B8D8'); g.blob(8, 13, 4.5, 8, liquid); }
    else if (shape === 2) { g.rect(6, 4, 4, 3, '#D8C8E4'); g.blob(8, 14, 6.8, 6.4, liquid); }
    else { g.rect(6, 4, 4, 4, '#D8C8E4'); g.blob(8, 14, 6, 6, liquid); }
    g.rect(6, shape === 1 ? 0 : 2, 4, 2, shape === 3 ? C.gold : '#9A6440'); // пробка
    if (shape === 3) { g.put(8, -0, C.gold); g.put(7, 1, '#FFF3A8'); }
    g.put(5, 11, '#FFFFFF'); g.put(5, 12, '#FFFFFF'); g.put(6, 10, '#F4FBFF');
    g.outline(X.INK, '#5A4560');
    g.paint(c, x - 8, y - 22);
    if (glow) { c.fillStyle = col; c.globalAlpha = .18; c.fillRect(x - 9, y - 20, 18, 18); c.globalAlpha = 1; }
  }

  // ---------- статичный фон (перерисовывается раз в минуту: день/ночь) ----------
  function background(c, st, env) {
    const rd = rnd(7);
    // стена: штукатурка с пятнами и трещинками
    R(c, 0, 0, SW, FLOOR, C.wall);
    for (let i = 0; i < 900; i++) { const x = rd() * SW | 0, y = rd() * FLOOR | 0; P(c, x, y, rd() < .5 ? C.wall2 : '#E3C79F'); }
    for (let i = 0; i < 14; i++) { let x = rd() * SW | 0, y = 30 + rd() * 110 | 0; for (let k = 0; k < 6; k++) { P(c, x, y, C.wallDk); x += rd() < .5 ? 1 : 0; y += 1; } }
    // фахверк: стойки и балки
    const post = (x, w) => { R(c, x, 0, w, FLOOR, C.beam); R(c, x, 0, 1, FLOOR, C.beamLi); R(c, x + w - 1, 0, 1, FLOOR, C.beamDk); for (let y = 8; y < FLOOR; y += 11) P(c, x + 2 + (y % 3), y, C.beamDk); };
    post(0, 6); post(126, 7); post(268, 7);
    R(c, 0, 0, SW, 10, C.beamDk); R(c, 0, 10, SW, 6, C.beam); R(c, 0, 10, SW, 1, C.beamLi); R(c, 0, 15, SW, 1, C.beamDk);
    for (let x = 4; x < SW; x += 17) { P(c, x, 12, C.beamDk); P(c, x + 1, 13, C.beamDk); }
    // пол: доски
    R(c, 0, FLOOR, SW, SH - FLOOR, C.floor);
    for (let y = FLOOR; y < SH; y += 7) { R(c, 0, y, SW, 1, C.floorDk); R(c, 0, y + 1, SW, 1, C.floorLi); const off = (y * 13) % 40; for (let x = off; x < SW; x += 48) R(c, x, y + 1, 1, 6, C.floorDk); }
    for (let i = 0; i < 260; i++) P(c, rd() * SW | 0, FLOOR + 2 + rd() * 46 | 0, rd() < .5 ? '#8A5636' : '#A86F47');
    R(c, 0, FLOOR - 3, SW, 3, C.beamDk); R(c, 0, FLOOR - 3, SW, 1, C.beam); // плинтус
    // круглый коврик в центре
    for (let y = -10; y <= 10; y++) for (let x = -56; x <= 56; x++) { const d = (x / 56) ** 2 + (y / 10) ** 2; if (d > 1) continue; P(c, 214 + x, 198 + y, d > .82 ? C.rugDk : d > .62 ? C.gold : d > .5 ? C.rug : (x + y * 3) % 9 === 0 ? C.rugLi : C.rug); }
    // очаг: каменная арка за котлом
    const hx = 18, hw = 96;
    for (let y = 40; y < FLOOR; y += 8) for (let x = hx + ((y / 8) % 2 ? 0 : 6); x < hx + hw; x += 12) {
      const w = Math.min(11, hx + hw - x); R(c, x, y, w, 7, C.stone); R(c, x, y, w, 1, C.stoneLi); R(c, x, y + 6, w, 1, C.stoneDk); R(c, x + w - 1, y, 1, 7, C.stoneDk);
    }
    R(c, hx - 4, 34, hw + 8, 7, C.beam); R(c, hx - 4, 34, hw + 8, 1, C.beamLi); R(c, hx - 4, 40, hw + 8, 1, C.beamDk); // полка над очагом
    for (let y = 0; y < 82; y++) for (let x = 0; x < 64; x++) { const u = (x - 32) / 32, v = (y - 82) / 82; if (u * u + v * v * .55 < 1 && y > 8) P(c, hx + 16 + x, 86 + y, y > 70 ? '#1A1220' : '#261A2C'); } // топка
    // на полке очага: банки, свеча, череп-пирожок, песочные часы
    const jar = (x, h, col) => { const g = X.grid(12, 18), r = X.ramp(col); g.blob(6, 18 - h / 2, 5, h / 2, (tt, u, v, px, py) => v > -.1 ? g.tone(r, tt, px, py) : g.tone(X.ramp('#E3EEF2'), tt * .6 + .4, px, py)); g.rect(3, 17 - h, 6, 2, '#9A6440'); g.outline(X.INK); g.paint(c, x - 6, 34 - 18); };
    jar(30, 12, '#6FBF73'); jar(42, 9, '#E07B5A'); jar(52, 14, '#7FA3E8'); jar(96, 10, '#C98AD8');
    // песочные часы
    R(c, 70, 22, 9, 2, C.beamDk); R(c, 70, 32, 9, 2, C.beamDk); for (let y = 0; y < 8; y++) { const w = Math.abs(4 - y) + 1; R(c, 74 - (w >> 1), 24 + y, w, 1, y < 4 ? '#F4E6C8' : '#E9C14A'); }
    // сушёные травы и чеснок на балке
    const bundle = (x, len, col) => { const r = X.ramp(col); R(c, x, 16, 1, 4, '#5A3A28'); R(c, x - 2, 19, 5, 2, '#C9A479'); for (let i = 0; i < len; i++) { const w = Math.min(6, 2 + i * .4) | 0; for (let k = 0; k < w; k++) P(c, x - (w >> 1) + k, 21 + i, (k + i) % 3 === 0 ? r.dk : k === 0 ? r.li : r.base); } };
    bundle(140, 16, C.herb); bundle(160, 12, '#B07AC8'); bundle(176, 18, '#8CA05A'); bundle(222, 14, '#D9A441'); bundle(244, 17, C.herb); bundle(292, 12, '#C85A6A');
    for (let i = 0; i < 4; i++) { const g = X.grid(10, 10); g.blob(5, 5, 3.6, 4, (tt, u, v, px, py) => g.tone(X.ramp('#F1E9DC'), tt, px, py)); g.put(5, 0, '#8C7A5A'); g.outline(X.INK); g.paint(c, 196 + i * 5 - 5, 16 + (i % 2) * 6); }
    // гирлянда-флажки
    for (let x = 136; x < 264; x += 2) { const y = 18 + Math.round(Math.sin((x - 136) / 128 * Math.PI) * 6); P(c, x, y, C.beamDk); if ((x - 136) % 12 === 0) { const col = ['#E07B5A', '#E9C14A', '#6FBF73', '#7FA3E8', '#C98AD8'][(x / 12) % 5 | 0]; for (let k = 0; k < 4; k++) R(c, x - 3 + k, y + 1 + k, 7 - k * 2, 1, col); } }
    // лунная карта на стене справа от шкафа
    R(c, 232, 52, 30, 38, C.paper); R(c, 232, 52, 30, 1, '#FFF6DA'); R(c, 232, 89, 30, 1, '#C9B08A');
    for (let i = 0; i < 5; i++) { const cx = 238 + (i % 3) * 9, cy = 60 + Math.floor(i / 3) * 14; for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y <= 9) P(c, cx + x, cy + y, x < i - 2 ? '#3A3346' : '#E9C14A'); }
    R(c, 236, 82, 22, 1, '#8C7A5A'); R(c, 236, 85, 16, 1, '#8C7A5A');
    // паутинка в углу
    for (let i = 0; i < 14; i++) { P(c, 7 + i, 16 + i, '#EDE6F0'); P(c, 7 + i, 16 + (i >> 1), '#EDE6F0'); P(c, 7 + (i >> 1), 16 + i, '#EDE6F0'); }
    // метла у стены
    for (let y = 70; y < FLOOR - 2; y++) { P(c, 120 + (y >> 5), y, C.beamLi); P(c, 121 + (y >> 5), y, C.beam); }
    for (let y = 0; y < 16; y++) for (let x = -5 - (y >> 2); x <= 5 + (y >> 2); x++) P(c, 125 + x, 150 + y, (x + y) % 3 ? '#D9A441' : '#B8862E');
    R(c, 119, 149, 13, 2, '#8E3B4E');
    // окно (рама, подоконник) — вид за окном рисуется в кадре
    win(c);
  }
  const WX = 284, WY = 42, WW = 58, WH = 76; // проём окна
  function win(c) {
    R(c, WX - 6, WY - 6, WW + 12, WH + 14, C.beamDk);
    R(c, WX - 5, WY - 5, WW + 10, WH + 10, C.beam); R(c, WX - 5, WY - 5, WW + 10, 1, C.beamLi);
    R(c, WX - 9, WY + WH + 4, WW + 18, 5, C.beamLi); R(c, WX - 9, WY + WH + 8, WW + 18, 2, C.beamDk); // подоконник
  }
  function winFrame(c) { // переплёт поверх вида
    R(c, WX + (WW >> 1) - 1, WY, 3, WH, C.beam); R(c, WX, WY + (WH >> 1) - 1, WW, 3, C.beam);
    R(c, WX + (WW >> 1) - 1, WY, 1, WH, C.beamLi); R(c, WX, WY + (WH >> 1) - 1, WW, 1, C.beamLi);
    // шторки
    for (const [x0, dir] of [[WX - 10, 1], [WX + WW + 2, -1]]) for (let y = WY - 8; y < WY + WH + 2; y++) { const w = 8 + Math.round(Math.sin(y / 9) * 1.5) + (y > WY + WH - 20 ? 2 : 0); for (let k = 0; k < w; k++) P(c, x0 + (dir > 0 ? k : 8 - k), y, k % 4 === 1 ? C.clothLi : (k + (y >> 3)) % 4 === 3 ? '#5A3670' : C.cloth); }
    R(c, WX - 12, WY - 10, WW + 24, 3, C.goldDk); R(c, WX - 12, WY - 10, WW + 24, 1, C.gold); // карниз
    // горшок с цветком на подоконнике
    const g = X.grid(20, 22); g.blob(10, 17, 6, 5, (tt, u, v, px, py) => v < -.4 ? null : g.tone(X.ramp('#C8643C'), tt, px, py)); g.rect(4, 12, 13, 2, '#A84E2C');
    g.blob(7, 8, 3, 4, (tt, u, v, px, py) => g.tone(X.ramp(C.herb), tt, px, py)); g.blob(13, 7, 3, 5, (tt, u, v, px, py) => g.tone(X.ramp(C.herb), tt, px, py)); g.blob(10, 3, 2.5, 2.5, (tt, u, v, px, py) => g.tone(X.ramp('#F08BC0'), tt, px, py));
    g.outline(X.INK); g.paint(c, WX + WW - 18, WY + WH - 14);
  }
  // вид за окном: небо по часу, дальний лес и холмы, погода сезона
  function view(c, env, now) {
    const h = env.hour, night = env.night, dusk = env.dusk;
    c.save(); c.beginPath(); c.rect(WX, WY, WW, WH); c.clip();
    const sky = night ? ['#1B1838', '#2B2652', '#3E3670'] : dusk ? ['#5A4A8A', '#C77A8E', '#F2B27A'] : { winter: ['#9FB6D6', '#C2D2E6', '#E4ECF4'], autumn: ['#8FA9C9', '#B9C7D9', '#E2D9CC'], spring: ['#8CC4EE', '#B6DDF5', '#E3F3FB'], summer: ['#6FB5EE', '#A2D2F6', '#DDF0FC'] }[env.season];
    for (let y = 0; y < WH; y++) R(c, WX, WY + y, WW, 1, sky[Math.min(2, Math.floor(y / WH * 3))]);
    if (night) { const rd = rnd(3); for (let i = 0; i < 18; i++) { const x = WX + rd() * WW | 0, y = WY + rd() * 40 | 0; if ((now / 600 + i) % 7 > .6) P(c, x, y, '#FFF6DA'); } for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) if (x * x + y * y <= 16 && (x - 2) ** 2 + (y - 1) ** 2 > 9) P(c, WX + 14 + x, WY + 12 + y, '#F4E6A8'); }
    else if (!dusk) for (let y = -5; y <= 5; y++) for (let x = -5; x <= 5; x++) if (x * x + y * y <= 25) P(c, WX + WW - 14 + x, WY + 12 + y, env.season === 'winter' ? '#F4F0E0' : '#FFE27A');
    // облака плывут
    if (env.season !== 'summer' || night) { const ox = (now / 220) % (WW + 30); for (const [dx, dy] of [[0, 18], [34, 30]]) { const x = WX - 20 + ((ox + dx) % (WW + 30)); R(c, x, WY + dy, 16, 3, night ? '#3E3670' : '#F4F6FA'); R(c, x + 3, WY + dy - 2, 8, 2, night ? '#4A4280' : '#FFFFFF'); } }
    // холмы и ели
    const hill = night ? ['#2A3A4A', '#1E2A36'] : { winter: ['#E8EEF4', '#C8D4E2'], autumn: ['#B8863E', '#8E5E2E'], spring: ['#8CC46A', '#6FA14E'], summer: ['#6FB04A', '#4E8E36'] }[env.season];
    for (let x = 0; x < WW; x++) { const y1 = 50 + Math.round(Math.sin(x / 9) * 3), y2 = 58 + Math.round(Math.sin(x / 13 + 2) * 2); R(c, WX + x, WY + y1, 1, WH - y1, hill[0]); R(c, WX + x, WY + y2, 1, WH - y2, hill[1]); }
    const tree = night ? '#14202A' : env.season === 'autumn' ? '#C8643C' : env.season === 'winter' ? '#3E6A56' : '#3E7A46';
    for (const [x, y, s] of [[8, 50, 9], [20, 54, 7], [44, 48, 10]]) { for (let k = 0; k < s; k++) R(c, WX + x - (k >> 1), WY + y - s + k, k + 1 - (k & 1), 1, tree); if (env.season === 'winter' && !night) for (let k = 0; k < s; k += 3) P(c, WX + x - (k >> 1), WY + y - s + k, '#FFFFFF'); }
    // погода
    const fall = (n, col, sp, sway, size) => { for (let i = 0; i < n; i++) { const s = (i * 7919) % 997, x = (s * 13 + Math.sin(now / 700 + i) * sway + now / 1000 * sp * .3 * (i % 3)) % WW, y = (s * 7 + now / 1000 * sp) % WH; R(c, WX + ((x + WW) % WW | 0), WY + (y | 0), size[0], size[1], col[i % col.length]); } };
    if (env.season === 'winter') fall(26, ['#FFFFFF', '#E4ECF4'], 9, 4, [1, 1]);
    if (env.season === 'autumn') { fall(18, ['#9FB6D6'], 60, 0, [1, 3]); fall(6, ['#E07B3A', '#D9A441', '#B8452E'], 12, 8, [2, 1]); }
    if (env.season === 'spring') fall(10, ['#F7C6DA', '#FFFFFF'], 8, 6, [1, 1]);
    if (env.season === 'summer' && night) for (let i = 0; i < 6; i++) if ((now / 400 + i * 1.7) % 3 < 1.6) P(c, WX + 6 + (i * 9 + Math.sin(now / 900 + i) * 4 | 0), WY + 44 + (Math.cos(now / 800 + i) * 6 | 0), '#F4F08A');
    // стекло: блик
    c.globalAlpha = .18; for (let k = 0; k < 10; k++) R(c, WX + 4 + k, WY + 6 + k * 2, 2, 2, '#FFFFFF'); c.globalAlpha = 1;
    c.restore();
  }

  // ---------- котёл (живой): огонь, зелье, пузыри, пар ----------
  const KX = 66, KY = 160; // центр дна котла
  let pot = null;
  function cauldron(dirt) { // кэш тела котла (+ грязь на краях)
    const g = X.grid(84, 64), ir = X.ramp('#4A4258');
    g.blob(42, 34, 36, 25, (tt, u, v, x, y) => v < -.62 ? null : g.tone(ir, tt, x, y)); // чаша
    for (let x = 6; x <= 78; x++) for (let k = 0; k < 5; k++) g.put(x, 13 + k, k === 0 ? ir.hi : k === 1 ? ir.li : k === 4 ? ir.dk : ir.base); // край
    for (const lx of [16, 64]) for (let y = 52; y < 62; y++) for (let k = 0; k < 4; k++) g.put(lx + k + (y > 58 ? (lx < 40 ? -1 : 1) : 0), y, k === 0 ? ir.li : ir.sh); // ножки
    for (let x = 12; x <= 72; x += 6) g.put(x, 20, ir.dk); // заклёпки
    for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { g.put(42 + s * 39, 16 + k, ir.dk); g.put(42 + s * 40, 17 + k, ir.base); } // ушки
    const rd = rnd(11);
    for (let i = 0; i < Math.min(80, dirt * 8); i++) { const x = 8 + rd() * 68 | 0, y = 14 + rd() * 6 | 0; g.put(x, y, rd() < .5 ? '#5E6B3A' : '#6B4A2E'); }
    g.outline(X.INK, '#3A3346');
    return g.canvas();
  }
  function fire(c, now) {
    for (let i = 0; i < 40; i++) {
      const x = KX - 30 + i * 1.5, ph = now / 90 + i * 1.3, edge = 1 - Math.abs(i - 20) / 22, hgt = (6 + Math.abs(Math.sin(ph) * 8) + Math.abs(Math.sin(ph * .37 + i)) * 6) * edge;
      for (let y = 0; y < hgt; y++) P(c, x | 0, KY + 6 - y, y > hgt - 3 ? '#FFF3A8' : y > hgt * .55 ? '#F7B23A' : y > hgt * .25 ? '#EE6A2E' : '#B8322A');
    }
    for (let i = 0; i < 7; i++) { R(c, KX - 32 + i * 9, KY + 4, 8, 3, i % 2 ? '#5A3A28' : '#6B4330'); R(c, KX - 32 + i * 9, KY + 4, 1, 3, '#3A2418'); P(c, KX - 30 + i * 9, KY + 5, '#E0602E'); } // поленья
    for (let i = 0; i < 5; i++) { const ph = (now / 1400 + i / 5) % 1; if (ph < .8) P(c, KX - 20 + i * 10 + Math.sin(now / 300 + i) * 3 | 0, KY - 4 - ph * 26 | 0, ph < .4 ? '#FFF3A8' : '#F7B23A'); } // искры
  }
  function brew(c, now, col, stir) {
    const r = X.ramp(col), cx = KX, y0 = KY - 50; // поверхность зелья
    for (let x = -33; x <= 33; x++) { const w = Math.sqrt(1 - (x / 34) ** 2) * 4, wave = Math.sin(now / 300 + x / 5) * (stir ? 1.2 : .6); for (let y = -w; y <= w; y++) P(c, cx + x, y0 + y + wave | 0, y < -w * .4 ? r.hi : y < w * .2 ? r.li : r.base); }
    const n = stir ? 9 : 5;
    for (let i = 0; i < n; i++) { const ph = (now / (stir ? 500 : 900) + i * .37) % 1, x = cx - 26 + ((i * 37) % 52), s = ph < .7 ? 1 + ph * 3 | 0 : 0; if (s) { R(c, x - s, y0 - s - 1, s * 2 + 1, s * 2 - 1, r.li); P(c, x - s + 1, y0 - s - 1, '#FFFFFF'); } }
    for (let i = 0; i < 8; i++) { const ph = (now / 2400 + i / 8) % 1, x = cx - 20 + ((i * 23) % 40) + Math.sin(now / 600 + i) * 4, y = y0 - 6 - ph * 60; c.globalAlpha = .45 * (1 - ph); R(c, x | 0, y | 0, 3 + (ph * 4 | 0), 2, '#F4F0FA'); }
    c.globalAlpha = 1;
  }
  // тёплый свет: ступенчатые круги (пиксельно), ночью сильнее
  function glow(c, x, y, r, col, a) { for (let k = 4; k >= 1; k--) { c.globalAlpha = a / 4; c.fillStyle = col; const rr = r * k / 4; for (let yy = -rr; yy <= rr; yy += 2) { const w = Math.sqrt(rr * rr - yy * yy); c.fillRect(x - w | 0, y + yy | 0, w * 2 | 0, 2); } } c.globalAlpha = 1; }

  // ---------- шкаф с зельями ----------
  const CX = 140, CY = 36, CW = 122, CH = 128; // шкаф
  const SLOT = { cols: 6, rows: 4, x0: CX + 12, y0: CY + 52, dx: 17, dy: 24 }; // 24 места на виду
  function cabinet(c, st) {
    const w = X.ramp('#7A4A32');
    R(c, CX, CY, CW, CH, w.base); R(c, CX, CY, CW, 2, w.li); R(c, CX, CY, 2, CH, w.li); R(c, CX + CW - 2, CY, 2, CH, w.dk);
    R(c, CX - 4, CY - 8, CW + 8, 9, w.sh); R(c, CX - 4, CY - 8, CW + 8, 2, w.li); // карниз
    for (let i = 0; i < 9; i++) P(c, CX + 10 + i * 13, CY - 4, C.gold);
    R(c, CX + 6, CY + 8, CW - 12, CH - 14, '#3A2430'); // задняя стенка
    for (let y = CY + 8; y < CY + CH - 6; y += 6) R(c, CX + 6, y, CW - 12, 1, '#2E1C26');
    // табличка
    R(c, CX + 36, CY + 12, 50, 12, C.paper); R(c, CX + 36, CY + 12, 50, 1, '#FFF6DA'); R(c, CX + 36, CY + 23, 50, 1, '#B89A6E');
    for (let i = 0; i < 6; i++) R(c, CX + 42 + i * 7, CY + 17, 5, 2, '#7A4A32');
    const slots = (st && st.slots) || 6, shelf = (st && st.shelf) || [];
    for (let r = 0; r < SLOT.rows; r++) {
      const sy = SLOT.y0 + r * SLOT.dy;
      R(c, CX + 4, sy + 1, CW - 8, 4, w.li); R(c, CX + 4, sy + 4, CW - 8, 2, w.dk); // полка
      for (let k = 0; k < SLOT.cols; k++) {
        const i = r * SLOT.cols + k, x = SLOT.x0 + k * SLOT.dx + 4;
        if (i >= slots) { // закрытое место: замочек
          R(c, x - 3, sy - 8, 7, 6, C.goldDk); R(c, x - 3, sy - 8, 7, 1, C.gold); P(c, x, sy - 5, '#3A2430'); R(c, x - 2, sy - 12, 1, 4, '#9A9AA8'); R(c, x + 2, sy - 12, 1, 4, '#9A9AA8'); R(c, x - 1, sy - 13, 3, 1, '#9A9AA8');
          continue;
        }
        const p = shelf[i]; if (!p) { R(c, x - 3, sy - 1, 7, 1, '#4A2E3A'); continue; } // пустое — тень на полке
        bottle(c, x, sy + 1, p.shape || 0, p.color || '#8FD06A', p.rare >= 3);
        if (p.n > 1) { R(c, x + 1, sy - 9, 4 + String(p.n).length * 5, 8, '#2A1B2E'); X.text(c, p.n, x + 3, sy - 8, '#FFF3A8'); }
      }
    }
    // ножки
    R(c, CX + 4, CY + CH, 8, 4, w.dk); R(c, CX + CW - 12, CY + CH, 8, 4, w.dk);
  }
  // ---------- тумбочка с книгой рецептов и свечой ----------
  function nightstand(c, now) {
    const x = 242, y = 136, w = X.ramp('#8C5A3C');
    R(c, x, y, 34, 30, w.base); R(c, x, y, 34, 3, w.li); R(c, x + 32, y, 2, 30, w.dk); R(c, x + 3, y + 8, 28, 9, w.sh); R(c, x + 15, y + 11, 4, 2, C.gold);
    R(c, x + 3, y + 30, 4, 2, w.dk); R(c, x + 27, y + 30, 4, 2, w.dk);
    // книга
    const g = X.grid(32, 16), b = X.ramp('#6B2E4E');
    g.rect(2, 6, 28, 8, b.base); g.rect(2, 6, 28, 1, b.li); g.rect(2, 13, 28, 1, b.dk); g.rect(3, 4, 26, 2, C.paper); g.rect(4, 3, 24, 1, '#FFF6DA');
    g.rect(14, 7, 4, 4, C.gold); g.put(15, 8, '#9BE0F0'); g.put(16, 9, '#5FB6D0'); for (const k of [3, 27]) g.rect(k, 7, 2, 2, C.gold);
    g.rect(24, 0, 2, 7, '#C2305C');
    g.outline(X.INK); g.paint(c, x + 1, y - 13);
    const pulse = (Math.sin(now / 500) + 1) / 2; if (pulse > .6) { P(c, x + 6, y - 15, '#FFF3A8'); P(c, x + 27, y - 12, '#FFF3A8'); }
  }
  function candle(c, x, y, now) {
    R(c, x - 2, y - 10, 5, 10, '#F4E6C8'); R(c, x - 2, y - 10, 1, 10, '#FFFFFF'); R(c, x - 4, y, 9, 2, C.goldDk); P(c, x, y - 11, '#3A2430');
    const f = Math.sin(now / 120) > 0 ? 1 : 0; R(c, x - 1, y - 15 - f, 3, 4, '#F7B23A'); P(c, x, y - 16 - f, '#FFF3A8'); P(c, x, y - 13, '#FFF3A8');
  }
  // ---------- сумка на полу ----------
  function bag(c) {
    const g = X.grid(48, 36), r = X.ramp('#9A5E36');
    g.blob(24, 24, 20, 11, (tt, u, v, x, y) => v < -.55 ? null : g.tone(r, tt, x, y));
    g.rect(6, 14, 36, 3, r.sh); g.rect(6, 14, 36, 1, r.li);
    g.blob(24, 13, 15, 5, (tt, u, v, x, y) => v > .2 ? null : g.tone(X.ramp('#B87A4A'), tt, x, y)); // клапан
    g.rect(22, 15, 5, 5, C.gold); g.put(24, 17, C.goldDk);
    for (let k = 0; k < 9; k++) { g.put(12 - (k >> 2), 13 - k, C.herbDk); g.put(13 - (k >> 2), 13 - k, k > 5 ? C.herbLi : C.herb); } // травинка торчит
    g.blob(36, 9, 4, 4, (tt, u, v, x, y) => g.tone(X.ramp('#D8563E'), tt, x, y)); g.put(36, 4, C.herbDk); // мухомор
    for (let k = 0; k < 18; k++) g.put(8 + k * 1.8, 8 - Math.sin(k / 18 * Math.PI) * 9, '#6B4330'); // ремень
    g.outline(X.INK, '#5A3A28'); return g.canvas();
  }

  function mount(el, o = {}) {
    if (!X || !window.PPBrewBird) return null;
    el.innerHTML = '';
    el.classList.add('brw');
    const cv = document.createElement('canvas'); cv.width = SW; cv.height = SH; cv.className = 'brw-cv';
    const bg = document.createElement('canvas'); bg.width = SW; bg.height = SH;
    const hud = document.createElement('div'); hud.className = 'brw-hud';
    hud.innerHTML = `<div class="brw-lv"><b class="brw-lvn">1</b><span class="brw-lvt">${t('lvl')}</span><i class="brw-xp"><em></em></i><small class="brw-xpt"></small></div>
      <div class="brw-side">${[['flock', '🐾'], ['door', '🚪'], ['games', '🔘'], ['map', 'ᚹ']].map(([k]) => `<button type="button" class="brw-b brw-b-${k}" data-go="${k}" title="${t(k)}" aria-label="${t(k)}"></button>`).join('')}</div>
      <div class="brw-say" hidden></div>`;
    const sc = document.createElement('div'); sc.className = 'brw-sc'; sc.append(cv);
    el.append(sc, hud);
    const follow = () => { if (sc.scrollWidth <= sc.clientWidth + 2) return; const k = cv.clientWidth / SW, want = bird.x * k - sc.clientWidth / 2; if (Math.abs(sc.scrollLeft - want) > sc.clientWidth * .3) sc.scrollTo({ left: want, behavior: 'smooth' }); };
    // пиксельные значки кнопок
    const ICON = {
      flock: ['....kk..kk....', '...kppk.kppk...', '...kppk.kppk...', '....kk..kk.....', '.kk........kk.', 'kppk......kppk', 'kppk.kkkk.kppk', '.kk.kppppk.kk.', '...kppppppk...', '...kppppppk...', '....kkkkkk....'],
      door: ['...kkkkkk...', '..kwwwwwwk..', '.kwbbbbbbwk.', '.kwbllbbbwk.', '.kwbllbbbwk.', '.kwbbbbbbwk.', '.kwbbbbyywk.', '.kwbbbbyywk.', '.kwbbbbbbwk.', '.kwbllbbbwk.', '.kwbbbbbbwk.', 'kkkkkkkkkkkk'],
      games: ['...kkkkkk...', '..kyyyyyyk..', '.kyYyyyyyyk.', 'kyYykyykyyyk', 'kyyyyyyyyyyk', 'kyyykyykyyyk', 'kyyyyyyyyyyk', '.kyyyyyyyyk.', '..kyyyyyyk..', '...kkkkkk...'],
      map: ['.kkkkkkkkkk.', 'kssssssssssk', 'ksssrsssssk.', 'ksssrrsssssk', 'ksssrsrssssk', 'ksssrssssssk', 'ksssrssssssk', 'ksssrssssssk', 'kssssssssssk', '.kkkkkkkkkk.'],
    };
    const IP = { k: '#2A1B2E', p: '#F49BB0', w: '#8C5A3C', b: '#B87A4A', l: '#D9A06A', y: '#E9C14A', Y: '#FFF3A8', s: '#9A93A8', r: '#F4F0FA' };
    hud.querySelectorAll('.brw-b').forEach(b => { const rows = ICON[b.dataset.go], c = document.createElement('canvas'); c.width = rows[0].length; c.height = rows.length; const x = c.getContext('2d'); rows.forEach((r, j) => [...r].forEach((ch, i) => { if (IP[ch]) { x.fillStyle = IP[ch]; x.fillRect(i, j, 1, 1); } })); b.append(c); });
    const ctx = cv.getContext('2d'), bctx = bg.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let st = o.state || {}, env = X.riga(), bgAt = 0, potCv = null, bagCv = bag(), stirUntil = 0, sayT = 0;
    const bird = window.PPBrewBird.actor(o.id, o.avatar, { x: 200, y: 190, dir: -1, noSpoon: true });
    let cat = o.cat ? window.PPBrewBird.actor(o.cat.id || 10, null, { x: 300, y: 206, dir: -1, speed: 24, hd: true }) : null; // котик меньше птички: рисунок HD-спрайта
    if (cat && o.cat.look) cat.bird.lk && Object.assign(cat.bird.lk, o.cat.look);
    const redraw = () => { env = X.riga(); background(bctx, st, env); cabinet(bctx, st); potCv = cauldron((st.cauldron && st.cauldron.dirt) || 0); bgAt = performance.now(); };
    const api = {
      bird, el,
      setState(s) { st = Object.assign({}, st, s || {}); const lv = hud.querySelector('.brw-lvn'); lv.textContent = st.level || 1; const n = st.need || 1, x = Math.max(0, Math.min(1, (st.xp || 0) / n)); hud.querySelector('.brw-xp em').style.width = (x * 100).toFixed(1) + '%'; hud.querySelector('.brw-xpt').textContent = `${st.xp || 0} / ${n} ${t('xp')}`; redraw(); },
      say(text, ms = 2600) { const b = hud.querySelector('.brw-say'); b.textContent = text; b.hidden = false; const bx = bird.x / SW * 100; b.style.left = Math.max(8, Math.min(70, bx - 12)) + '%'; b.style.top = Math.max(2, (bird.y - 92) / SH * 100) + '%'; clearTimeout(sayT); sayT = setTimeout(() => { b.hidden = true; }, ms); },
      stir(ms = 2400, cb) { bird.walkTo(118, () => { bird.act('stir', ms); stirUntil = performance.now() + ms; setTimeout(() => cb && cb(), ms); }, -1); },
      stop() { alive = false; },
    };
    api.setState(st);
    // клики по сцене
    const HIT = [
      ['cauldron', 24, 96, 92, 72], ['shelf', CX, CY - 8, CW, CH + 8], ['book', 238, 118, 42, 20], ['bag', 300, 168, 50, 36], ['window', WX - 8, WY - 8, WW + 16, WH + 16],
    ];
    const at = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * SW, (e.clientY - r.top) / r.height * SH]; };
    cv.addEventListener('click', e => {
      const [x, y] = at(e);
      if (bird.hit(x, y)) { const m = [['flap', 'wink'], ['happy', 'happy'], ['flap', 'open'], ['think', 'wink']][Math.random() * 4 | 0]; bird.act(m[0], 1400, m[1]); if (o.on && o.on.bird) o.on.bird(); return; }
      if (cat && cat.hit(x, y)) { cat.act('happy', 1200, 'happy'); return; }
      const h = HIT.find(([, hx, hy, hw, hh]) => x >= hx && x <= hx + hw && y >= hy && y <= hy + hh);
      if (!h) { if (y > FLOOR) bird.walkTo(Math.max(110, Math.min(330, x))); return; }
      const k = h[0];
      if (k === 'cauldron') { api.stir(2000, () => o.on && o.on.cauldron && o.on.cauldron(api)); return; }
      if (k === 'window') { bird.walkTo(286, () => { bird.act('think', 1600); api.say(T.win[L][Math.random() * 3 | 0]); }, 1); return; }
      const go = { shelf: 200, book: 232, bag: 296 }[k];
      bird.walkTo(go, () => { bird.act('happy', 600); if (o.on && o.on[k]) o.on[k](api); }, k === 'shelf' ? -1 : 1);
    });
    cv.addEventListener('mousemove', e => { const [x, y] = at(e); cv.style.cursor = bird.hit(x, y) || HIT.some(([, hx, hy, hw, hh]) => x >= hx && x <= hx + hw && y >= hy && y <= hy + hh) ? 'pointer' : ''; });
    hud.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const k = b.dataset.go; if (o.on && o.on[k]) o.on[k](api); });
    // кадр
    let alive = true, catNext = 0;
    function frame(now) {
      if (!alive || !el.isConnected) return;
      if (now - bgAt > 60000) redraw();
      ctx.drawImage(bg, 0, 0);
      view(ctx, env, now); winFrame(ctx);
      fire(ctx, now);
      ctx.drawImage(potCv, KX - 42, KY - 64);
      brew(ctx, now, (st.cauldron && st.cauldron.color) || '#7BD66A', now < stirUntil);
      nightstand(ctx, now); candle(ctx, 274, 136, now);
      ctx.drawImage(bagCv, 302, 170);
      // котик живёт тут же: бродит у котла и под окном, иногда спит
      if (cat) { if (!cat.busy() && now > catNext) { catNext = now + 4000 + Math.random() * 6000; const r = Math.random(); if (r < .5) cat.walkTo(140 + Math.random() * 180); else cat.act(r < .8 ? 'idle' : 'happy', 2000, r < .8 ? 'closed' : 'happy'); } cat.draw(ctx, now); }
      bird.draw(ctx, now);
      if (bird.target != null && now - (frame.f || 0) > 400) { frame.f = now; follow(); }
      if (now < stirUntil && bird.pose === 'stir') { // длинная ложка: от крыла в котёл, черпак ходит по кругу
        const ph = now / 520, ex = KX + 6 + Math.cos(ph) * 14, ey = KY - 50 + Math.sin(ph) * 2, tx = bird.x + 14 * bird.dir, ty = bird.y - 16;
        const n = Math.max(Math.abs(ex - tx), Math.abs(ey - ty)) | 0;
        for (let i = 0; i <= n; i++) { const x = tx + (ex - tx) * i / n, y = ty + (ey - ty) * i / n; P(ctx, x | 0, y | 0, i % 6 ? '#B9844C' : '#E0B47A'); P(ctx, x | 0, (y | 0) + 1, '#7E5230'); }
        R(ctx, (ex | 0) - 4, (ey | 0) + 1, 9, 1, '#C8F09A'); P(ctx, (ex | 0) - 6, (ey | 0) + 2, '#C8F09A'); P(ctx, (ex | 0) + 6, (ey | 0) + 2, '#C8F09A'); // круги на зелье
      }
      // свет: огонь, свеча; ночью комната темнее
      if (env.night || env.dusk) { ctx.globalAlpha = env.night ? .32 : .16; ctx.fillStyle = '#1B1238'; ctx.fillRect(0, 0, SW, SH); ctx.globalAlpha = 1; }
      glow(ctx, KX, KY - 20, 60 + Math.sin(now / 200) * 3, '#F7A23A', env.night ? .22 : .1);
      glow(ctx, 274, 120, 26, '#FFE27A', env.night ? .2 : .08);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    // птичка сама по себе: иногда гуляет, машет, подмигивает
    const idle = setInterval(() => {
      if (!alive || !el.isConnected) { clearInterval(idle); return; }
      if (bird.busy() || document.hidden) return;
      const r = Math.random();
      if (r < .3) bird.walkTo(150 + Math.random() * 150);
      else if (r < .45) bird.act('flap', 900);
      else if (r < .55) bird.mood('wink', 700);
      else if (r < .62) bird.act('think', 1800);
    }, 3500);
    return api;
  }
  window.PPBrewRoom = { mount, bottle, SW, SH };
})();
