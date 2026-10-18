// Комната птички (профиль /bird/): пиксельная комната 192×120 — стены, пол, одно окно (вид за окном), шторы по бокам,
// мебель и вещи (ставятся на пол или друг на друга), украшения (висят где угодно: на ёлке, на стене). Птичка в комнате гуляет,
// запрыгивает на мебель, спит на диване, играет в приставку. Вещи для комнаты — подарки того же каталога, что и для птички
// (PPBirds.GIFTS: wall, floor, view, curtain, furn, deco) — их можно купить, подарить, получить в адвенте.
// Хозяин комнаты правит её всегда на месте: вещь из сумки ставит useItem (sketch-wall.js) → PPRoom.live.use; тянуть — двигать; над выбранной ⇆ ⬆ ⬇ ↩.
(() => {
  const B = window.PPBirds;
  if (!B) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const RW = 192, RH = 120, FY = 86, GY = 113; // ширина, высота, низ стены, линия пола (на ней стоит мебель)
  const WX = 124, WY = 14, WW = 42, WH = 42;   // окно
  const rngOf = seed => { let a = seed >>> 0 || 1; return () => (a = (a * 1103515245 + 12345) % 2147483648) / 2147483648; };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };

  // ---------- стены ----------
  const pat = (g, w, h, step, fn) => { for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) fn(x, y); };
  const WALL = {
    _: [['Shabby walls', 'Облезлые стены', 'Nolupušas sienas'], g => {
      const r = rngOf(7); R(g, 0, 0, RW, FY, '#C9BBA0');
      for (let i = 0; i < 16; i++) R(g, r() * RW, r() * FY, 6 + r() * 14, 4 + r() * 8, '#BBAC8F');
      for (let i = 0; i < 4; i++) { const x = r() * (RW - 20), y = 8 + r() * (FY - 30); R(g, x, y, 16, 9, '#A0634A'); for (let k = 0; k < 3; k++) R(g, x, y + 3 * k, 16, 1, '#C7A58C'); R(g, x + 7, y, 1, 3, '#C7A58C'); R(g, x + 3, y + 3, 1, 3, '#C7A58C'); R(g, x + 11, y + 6, 1, 3, '#C7A58C'); }
      for (let i = 0; i < 6; i++) { let x = r() * RW, y = r() * FY * .7; for (let k = 0; k < 14; k++) { R(g, x, y, 1, 1, '#8C7B62'); x += r() < .5 ? 1 : 0; y += 1; } }
      R(g, 20, 0, 22, 6, '#BDAE90'); R(g, 24, 6, 14, 3, '#BDAE90');
    }],
    stripes: [['Candy stripes', 'Розовые полоски', 'Rozā strīpas'], g => { R(g, 0, 0, RW, FY, '#FBEFE9'); for (let x = 0; x < RW; x += 12) R(g, x, 0, 6, FY, '#F6D5DA'); }],
    mint: [['Mint dots', 'Мятный горошек', 'Piparmētru punktiņi'], g => { R(g, 0, 0, RW, FY, '#CDEBD8'); pat(g, RW, FY, 8, (x, y) => R(g, x + ((y / 8) % 2) * 4, y + 3, 2, 2, '#A9D6BB')); }],
    flowers: [['Little flowers', 'Цветочки', 'Ziediņi'], g => { R(g, 0, 0, RW, FY, '#FFF4E0'); pat(g, RW, FY, 12, (x, y) => { const ox = ((y / 12) % 2) * 6; R(g, x + ox + 1, y + 3, 3, 1, '#F28AB2'); R(g, x + ox + 2, y + 2, 1, 3, '#F28AB2'); R(g, x + ox + 2, y + 3, 1, 1, '#F6D04D'); }); }],
    bricks: [['Red bricks', 'Красный кирпич', 'Sarkanie ķieģeļi'], g => { R(g, 0, 0, RW, FY, '#D9B8A0'); for (let y = 0; y < FY; y += 6) for (let x = -((y / 6) % 2) * 6; x < RW; x += 12) R(g, x, y, 11, 5, (x + y) % 5 ? '#B5543C' : '#A84A34'); }],
    wood: [['Wood panels', 'Деревянные панели', 'Koka paneļi'], g => { R(g, 0, 0, RW, FY, '#A8744A'); for (let x = 0; x < RW; x += 10) { R(g, x, 0, 1, FY, '#7E5634'); R(g, x + 4, 0, 1, FY, '#B5814F'); } R(g, 0, FY - 22, RW, 2, '#7E5634'); }],
    stars: [['Starry night', 'Звёздная ночь', 'Zvaigžņota nakts'], g => { R(g, 0, 0, RW, FY, '#1E2550'); const r = rngOf(3); for (let i = 0; i < 60; i++) { const x = r() * RW, y = r() * FY; R(g, x, y, 1, 1, '#FFE9A8'); if (i % 4 === 0) { R(g, x - 1, y, 3, 1, '#FFE9A8'); R(g, x, y - 1, 1, 3, '#FFE9A8'); } } }],
    damask: [['Royal damask', 'Королевский узор', 'Karaliskais raksts'], g => { R(g, 0, 0, RW, FY, '#5B3E8C'); pat(g, RW, FY, 14, (x, y) => { const ox = ((y / 14) % 2) * 7; R(g, x + ox + 5, y + 2, 2, 8, '#6E52A3'); R(g, x + ox + 3, y + 5, 6, 2, '#6E52A3'); R(g, x + ox + 5, y + 5, 2, 2, '#E9C46A'); }); }],
    leaves: [['Autumn leaves', 'Осенние листья', 'Rudens lapas'], g => { R(g, 0, 0, RW, FY, '#F6E3C4'); const c = ['#E07B39', '#C8452B', '#E9B23B', '#A3592A']; pat(g, RW, FY, 11, (x, y) => { const ox = ((y / 11) % 2) * 5, k = c[(x + y) % 4]; R(g, x + ox + 2, y + 2, 3, 2, k); R(g, x + ox + 3, y + 1, 2, 1, k); R(g, x + ox + 1, y + 4, 1, 1, '#7A4A28'); }); }],
    xmas: [['Christmas wallpaper', 'Новогодние обои', 'Ziemassvētku tapetes'], g => { R(g, 0, 0, RW, FY, '#1D6B4F'); pat(g, RW, FY, 10, (x, y) => { const ox = ((y / 10) % 2) * 5; R(g, x + ox + 4, y + 3, 2, 4, (x + y) % 20 ? '#E5484D' : '#F4F0EA'); R(g, x + ox + 3, y + 4, 4, 2, (x + y) % 20 ? '#E5484D' : '#F4F0EA'); }); }],
    gingham: [['Blue gingham', 'Голубая клетка', 'Zilās rūtiņas'], g => { R(g, 0, 0, RW, FY, '#EEF3FB'); for (let x = 0; x < RW; x += 8) R(g, x, 0, 4, FY, 'rgba(120,155,215,.35)'); for (let y = 0; y < FY; y += 8) R(g, 0, y, RW, 4, 'rgba(120,155,215,.35)'); }],
    gold: [['Golden palace', 'Золотой дворец', 'Zelta pils'], g => { R(g, 0, 0, RW, FY, '#E9C46A'); pat(g, RW, FY, 12, (x, y) => { const ox = ((y / 12) % 2) * 6; R(g, x + ox + 4, y + 2, 4, 8, '#F7DC8B'); R(g, x + ox + 2, y + 5, 8, 2, '#F7DC8B'); R(g, x + ox + 5, y + 5, 2, 2, '#C99A2E'); }); R(g, 0, 0, RW, 3, '#C99A2E'); }],
  };
  // ---------- пол ----------
  const planks = (g, a, b, seam, h = 5, len = 24) => { R(g, 0, FY, RW, RH - FY, a); for (let y = FY, row = 0; y < RH; y += h, row++) { R(g, 0, y, RW, 1, seam); for (let x = (row % 2) * len / 2; x < RW; x += len) R(g, x, y, 1, h, seam); if (b) R(g, 0, y + 2, RW, 1, b); } };
  const FLOOR = {
    _: [['Old floorboards', 'Старые доски', 'Vecie dēļi'], g => { planks(g, '#7E6048', null, '#5E4532'); const r = rngOf(11); for (let i = 0; i < 10; i++) R(g, r() * RW, FY + 2 + r() * 28, 3 + r() * 5, 1, '#6A5040'); R(g, 60, FY + 16, 10, 3, '#3A2A1E'); R(g, 150, FY + 6, 7, 2, '#3A2A1E'); }],
    oak: [['Light oak', 'Светлый дуб', 'Gaišais ozols'], g => planks(g, '#C8955E', '#D2A16C', '#A3733F')],
    walnut: [['Dark walnut', 'Тёмный орех', 'Tumšais rieksts'], g => planks(g, '#6B4430', '#77503A', '#553424')],
    checker: [['Checkerboard', 'Шахматка', 'Šahs'], g => { for (let y = FY; y < RH; y += 6) for (let x = 0; x < RW; x += 6) R(g, x, y, 6, 6, ((x + y) / 6) % 2 ? '#2B2340' : '#F4F0FA'); }],
    terracotta: [['Terracotta tiles', 'Терракотовая плитка', 'Terakotas flīzes'], g => { R(g, 0, FY, RW, RH - FY, '#E9C3A8'); for (let y = FY; y < RH; y += 8) for (let x = ((y - FY) / 8 % 2) * 4; x < RW; x += 8) R(g, x, y, 7, 7, '#C66B4A'); }],
    mintiles: [['Mint tiles', 'Мятная плитка', 'Piparmētru flīzes'], g => { R(g, 0, FY, RW, RH - FY, '#A8D3C0'); for (let y = FY; y < RH; y += 8) for (let x = 0; x < RW; x += 8) R(g, x, y, 7, 7, (x + y) % 16 ? '#BFE3D3' : '#CDEBDD'); }],
    carpet: [['Red carpet', 'Красный ковёр', 'Sarkanais paklājs'], g => { R(g, 0, FY, RW, RH - FY, '#9E2B3A'); R(g, 0, FY + 2, RW, 1, '#E9A93B'); R(g, 0, RH - 3, RW, 1, '#E9A93B'); pat(g, RW, RH - FY, 8, (x, y) => R(g, x + 3, FY + y + 4, 2, 2, '#B8404F')); }],
    bluerug: [['Blue rug', 'Синий коврик', 'Zilais paklājiņš'], g => { planks(g, '#C8955E', '#D2A16C', '#A3733F'); for (let y = 0; y < 22; y++) { const w = Math.round(110 * Math.sqrt(1 - Math.pow((y - 11) / 11.5, 2))); R(g, 96 - w / 2, FY + 6 + y, w, 1, y % 5 === 0 ? '#7FA7E0' : '#4A7BD8'); } }],
    herring: [['Herringbone', 'Ёлочка', 'Eglītes raksts'], g => { R(g, 0, FY, RW, RH - FY, '#B9824A'); for (let y = FY; y < RH; y += 4) for (let x = 0; x < RW; x += 8) { R(g, x + ((y / 4) % 2) * 4, y, 4, 2, '#D9A66B'); } }],
    marble: [['White marble', 'Белый мрамор', 'Baltais marmors'], g => { R(g, 0, FY, RW, RH - FY, '#EEE9F2'); const r = rngOf(5); for (let i = 0; i < 9; i++) { let x = r() * RW, y = FY + r() * 30; for (let k = 0; k < 18; k++) { R(g, x, y, 1, 1, '#C9C1D6'); x += 1; y += r() < .5 ? 1 : -1; if (y < FY || y > RH) break; } } for (let x = 0; x < RW; x += 32) R(g, x, FY, 1, RH - FY, '#D9D2E2'); }],
  };
  // ---------- вид за окном (рисуется внутри окна; t — время для анимации) ----------
  const sky = (g, x, y, cols) => cols.forEach((c, i) => R(g, x, y + i * (WH / cols.length), WW, Math.ceil(WH / cols.length), c));
  const houses = (g, x, y, cols, win, seed, t, flick) => { const r = rngOf(seed); let px = x; while (px < x + WW) { const w = 6 + Math.floor(r() * 7), h = 10 + Math.floor(r() * 20), c = cols[Math.floor(r() * cols.length)]; R(g, px, y + WH - h, w, h, c); for (let wy = y + WH - h + 2; wy < y + WH - 2; wy += 4) for (let wx = px + 1; wx < px + w - 1; wx += 3) { const on = r() < .55; if (on) R(g, wx, wy, 1, 2, flick && Math.sin(t / 900 + wx * 7 + wy) > .92 ? cols[0] : win); } px += w + 1; } };
  const VIEW = {
    _: [['Grey day', 'Серый день', 'Pelēka diena'], (g, x, y) => { sky(g, x, y, ['#AEB8C2', '#B9C3CC', '#C6CED6']); houses(g, x, y + 8, ['#6F7680', '#7D8590', '#5F666F'], '#8F98A3', 2, 0); }],
    city: [['Sunny city', 'Солнечный город', 'Saulaina pilsēta'], (g, x, y) => { sky(g, x, y, ['#7EC4F0', '#9FD3F5', '#BDE3F8']); R(g, x + 30, y + 5, 6, 6, '#FFE08A'); houses(g, x, y + 6, ['#E8A87C', '#C38D9E', '#85CDCA', '#41B3A3', '#E27D60'], '#FFF3C4', 4, 0); }],
    night: [['City at night', 'Ночной город', 'Nakts pilsēta'], (g, x, y, t) => { sky(g, x, y, ['#141638', '#1B1E45', '#252A5A']); const r = rngOf(9); for (let i = 0; i < 18; i++) { const sx = x + r() * WW, sy = y + r() * 22; if (Math.sin(t / 500 + i) > -.6) R(g, sx, sy, 1, 1, '#FFFFFF'); } R(g, x + 6, y + 5, 5, 5, '#F6E7B0'); R(g, x + 8, y + 5, 3, 3, '#141638'); houses(g, x, y + 8, ['#2B2F5A', '#23264A', '#343866'], '#F6D04D', 6, t, true); }],
    forest: [['Pine forest', 'Сосновый лес', 'Priežu mežs'], (g, x, y) => { sky(g, x, y, ['#A9D8F0', '#BFE3F5', '#D4EDF8']); R(g, x, y + 24, WW, 18, '#7FB77E'); const r = rngOf(12); for (let i = 0; i < 9; i++) { const px = x + i * 5 - 2 + r() * 3, h = 14 + r() * 12; for (let k = 0; k < h; k++) R(g, px + 3 - Math.floor(k / 3.2), y + WH - h + k, 1 + 2 * Math.floor(k / 3.2), 1, k % 4 ? '#2E6B47' : '#3E8257'); } }],
    sea: [['By the sea', 'Море', 'Jūra'], (g, x, y, t) => { sky(g, x, y, ['#8FD0F2', '#A7DBF5', '#C3E7F8']); R(g, x + 28, y + 8, 7, 7, '#FFE08A'); R(g, x, y + 22, WW, 16, '#3F8FC9'); for (let i = 0; i < 6; i++) R(g, x + ((i * 9 + t / 120) % (WW + 6)) - 4, y + 25 + (i % 3) * 4, 4, 1, '#8EC8EC'); R(g, x, y + 38, WW, 4, '#F2D7A0'); }],
    mountains: [['Mountains', 'Горы', 'Kalni'], (g, x, y) => { sky(g, x, y, ['#9FCBEF', '#B6D8F3', '#CFE5F7']); [[x - 6, 26, '#7A8CA8'], [x + 14, 32, '#66789A'], [x + 28, 22, '#8597B2']].forEach(([px, h, c]) => { for (let k = 0; k < h; k++) { R(g, px + h - k, y + WH - k, 2 * k, 1, k > h - 7 ? '#FFFFFF' : c); } }); R(g, x, y + WH - 4, WW, 4, '#6FA86A'); }],
    snow: [['Snowy street', 'Снежная улица', 'Sniegota iela'], (g, x, y, t) => { sky(g, x, y, ['#B9C8DB', '#C9D6E6', '#D8E2EE']); houses(g, x, y + 10, ['#8E6B5A', '#A07560', '#7D5D4F'], '#F6D04D', 15, 0); R(g, x, y + WH - 3, WW, 3, '#FFFFFF'); const r = rngOf(4); for (let i = 0; i < 22; i++) { const sx = x + ((r() * WW + t / 300 * (i % 3 + 1)) % WW), sy = y + ((r() * WH + t / 70 * (1 + (i % 2))) % WH); R(g, sx, sy, 1, 1, '#FFFFFF'); } }],
    autumn: [['Autumn park', 'Осенний парк', 'Rudens parks'], (g, x, y) => { sky(g, x, y, ['#A9D2EF', '#BFDDF3', '#D5E8F7']); R(g, x, y + 34, WW, 8, '#C9A35B'); const r = rngOf(8), c = ['#E07B39', '#C8452B', '#E9B23B', '#D9952F']; for (let i = 0; i < 5; i++) { const px = x + 2 + i * 9, h = 14 + r() * 8; R(g, px + 3, y + WH - 10, 2, 10, '#6B4329'); for (let k = 0; k < 9; k++) R(g, px + Math.abs(4 - k) * .6, y + WH - 10 - h + k * 1.6, 8 - Math.abs(4 - k) * 1.2, 2, c[(i + k) % 4]); } }],
    space: [['Outer space', 'Космос', 'Kosmoss'], (g, x, y, t) => { R(g, x, y, WW, WH, '#0B0B24'); const r = rngOf(21); for (let i = 0; i < 26; i++) { const sx = x + r() * WW, sy = y + r() * WH; if (Math.sin(t / 400 + i * 3) > -.5) R(g, sx, sy, 1, 1, i % 5 ? '#FFFFFF' : '#FFE9A8'); } for (let k = 0; k < 9; k++) R(g, x + 14 + Math.abs(4 - k) * 0, y + 12 + k, 9 - Math.abs(4 - k) * 1.6 + 2, 1, '#E9A93B'); R(g, x + 9, y + 16, 22, 1, '#F6D78A'); R(g, x + 31, y + 30, 5, 5, '#7F81BF'); }],
    rainbow: [['Rainbow meadow', 'Радуга над лугом', 'Varavīksne pār pļavu'], (g, x, y) => { sky(g, x, y, ['#A9DDF5', '#BCE5F7', '#D0ECF9']); const cols = ['#E5484D', '#F08A3B', '#F6D04D', '#4CC38A', '#4A7BD8', '#9B5DE5']; for (let py = 0; py < WH; py++) for (let px = 0; px < WW; px++) { const d = Math.hypot(px - WW / 2, py - WH + 2) ; const band = Math.floor((d - 18) / 2); if (band >= 0 && band < 6) R(g, x + px, y + py, 1, 1, cols[band]); } R(g, x, y + WH - 6, WW, 6, '#6FBF6A'); R(g, x + 6, y + WH - 6, 1, 1, '#F28AB2'); R(g, x + 30, y + WH - 4, 1, 1, '#F6D04D'); }],
    aurora: [['Northern lights', 'Северное сияние', 'Ziemeļblāzma'], (g, x, y, t) => { R(g, x, y, WW, WH, '#0E1330'); for (let px = 0; px < WW; px++) { const hh = 6 + Math.sin(px / 5 + t / 900) * 4 + Math.sin(px / 3 - t / 600) * 2; for (let k = 0; k < hh; k++) R(g, x + px, y + 8 + Math.sin(px / 7 + t / 1200) * 3 + k, 1, 1, k < hh / 2 ? 'rgba(76,227,160,.85)' : 'rgba(155,93,229,.75)'); } const r = rngOf(31); for (let i = 0; i < 14; i++) R(g, x + r() * WW, y + 24 + r() * 10, 1, 1, '#FFFFFF'); R(g, x, y + WH - 6, WW, 6, '#E6EEF7'); }],
  };
  // ---------- шторы (по бокам окна, не закрывают его) ----------
  const CURT = {
    red: [['Red curtains', 'Красные шторы', 'Sarkanie aizkari'], ['#C9463D', '#A8382F']],
    mustard: [['Mustard curtains', 'Горчичные шторы', 'Sinepju aizkari'], ['#E9A93B', '#C98A28']],
    sage: [['Sage curtains', 'Шалфейные шторы', 'Salvijas aizkari'], ['#8DB596', '#6E9A78']],
    lilac: [['Lilac curtains', 'Сиреневые шторы', 'Ceriņu aizkari'], ['#B79CF2', '#987CD6']],
    navy: [['Starry curtains', 'Звёздные шторы', 'Zvaigžņu aizkari'], ['#2B3A6B', '#1F2B52'], '#F6D04D'],
    pink: [['Flower curtains', 'Шторы в цветочек', 'Ziedu aizkari'], ['#F7B6C8', '#E79AB0'], '#FFFFFF'],
    lace: [['Lace curtains', 'Кружевные шторы', 'Mežģīņu aizkari'], ['rgba(250,247,240,.9)', 'rgba(225,220,210,.9)'], 'rgba(0,0,0,0)'],
    plaid: [['Plaid curtains', 'Шторы в клетку', 'Rūtaini aizkari'], ['#C0392B', '#8E2A20'], '#F2C27B'],
  };
  function drawCurtains(g, v) {
    const c = CURT[v]; if (!c) return;
    const [a, b] = c[1], dot = c[2];
    R(g, WX - 16, WY - 7, WW + 32, 2, '#5B3A1E'); R(g, WX - 18, WY - 8, 3, 4, '#E9C46A'); R(g, WX + WW + 15, WY - 8, 3, 4, '#E9C46A');
    const tie = WH - 8, top = WY - 5, len = WH + 16;
    for (const side of [0, 1]) {
      for (let k = 0; k < len; k++) {
        const w = k < tie ? Math.round(14 - (k / tie) * 7) : Math.round(7 + (k - tie) / (len - tie) * 7);
        const x0 = side ? WX + WW + 14 - w : WX - 14;
        for (let i = 0; i < w; i++) R(g, x0 + i, top + k, 1, 1, c[3] ? c[3][Math.floor((x0 + i) / 2) % c[3].length] : i % 3 === 1 ? b : a);
        if (dot && k % 5 === 2) R(g, x0 + (k % 10 < 5 ? 2 : Math.max(2, w - 3)), top + k, 1, 1, dot);
      }
      R(g, side ? WX + WW + 6 : WX - 14, top + tie, 8, 2, '#E9C46A');
    }
  }

  // ---------- мебель и вещи: w, h, top (высота поверхности сверху, куда можно ставить; null — нельзя), d(g, x, y, t, room) ----------
  const SOFA_C = [['#7F5FB8', '#5E438F', '#9C80D0'], ['#3F7D5C', '#2D5C43', '#5C9C78'], ['#D9A33B', '#B5832A', '#EBC064'], ['#E58CA8', '#C46B88', '#F2AFC4'], ['#34303D', '#211E28', '#4E4958'], ['#EDE9E1', '#CFC8BC', '#FFFFFF']];
  const GIFT_C = [['#E5484D', '#F6D04D'], ['#4A7BD8', '#FFFFFF'], ['#4CC38A', '#E5484D'], ['#B79CF2', '#F6D04D']];
  // ёлочные шарики: цвет (+ узор для последних); порядок не менять — номер = значение «ornament:N»
  const ORN_C = ['#E5484D', '#E9C46A', '#4A7BD8', '#C9CDD6', '#F28AB2', '#4CC38A', '#8E5BD8', '#F08A3B', '#F4F1EA', '#3CC7C0', '#9B2D3A', '#2B3E8C', '#E5484D', '#4A7BD8', '#E9C46A', '#B79CF2'];
  const ORN_N = [['red', 'красный', 'sarkana'], ['gold', 'золотой', 'zelta'], ['blue', 'синий', 'zila'], ['silver', 'серебряный', 'sudraba'], ['pink', 'розовый', 'rozā'], ['green', 'зелёный', 'zaļa'],
    ['purple', 'фиолетовый', 'violeta'], ['orange', 'оранжевый', 'oranža'], ['white', 'белый', 'balta'], ['turquoise', 'бирюзовый', 'tirkīza'], ['burgundy', 'бордовый', 'bordo'], ['navy', 'тёмно-синий', 'tumši zila'],
    ['candy stripes', 'в полоску', 'svītraina'], ['snowflakes', 'со снежинками', 'ar sniegpārslām'], ['glitter', 'с блёстками', 'ar spīdumiem'], ['rainbow', 'радужный', 'varavīksnes']];
  // положение вещи округляем, а детали внутри — нет: так вещи можно рисовать «полупикселями» (вдвое подробнее; в комнате ×4, в значках ×2+)
  const P = (g, x0, y0) => { const bx = Math.round(x0), by = Math.round(y0); return (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(bx + x, by + y, w, h); }; };
  const spr = (p, rows, pal) => rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) p(x, y, 1, 1, pal[ch]); }));
  const FURN = {
    sofa: { n: i => [['Purple sofa', 'Сиреневый диван', 'Violets dīvāns'], ['Green velvet sofa', 'Зелёный бархатный диван', 'Zaļš samta dīvāns'], ['Mustard sofa', 'Горчичный диван', 'Sinepju dīvāns'], ['Pink sofa', 'Розовый диван', 'Rozā dīvāns'], ['Black sofa', 'Чёрный диван', 'Melns dīvāns'], ['White sofa', 'Белый диван', 'Balts dīvāns']][i], v: 6, w: 48, h: 22, top: 10, sit: true,
      d: (p, t, i) => { const [c, d, l] = SOFA_C[i]; p(2, 0, 44, 12, c); p(3, 1, 42, 1, l); p(6, 3, 16, 7, l); p(26, 3, 16, 7, l); p(0, 6, 6, 14, d); p(42, 6, 6, 14, d); p(6, 10, 36, 6, l); p(23, 10, 1, 6, d); p(2, 16, 44, 4, d); p(4, 20, 3, 2, '#5B3A1E'); p(41, 20, 3, 2, '#5B3A1E'); } },
    armchair: { n: () => ['Teal armchair', 'Бирюзовое кресло', 'Tirkīza krēsls'], w: 26, h: 22, top: 10, sit: true,
      d: p => { p(3, 0, 20, 12, '#4A9BA8'); p(4, 1, 18, 1, '#6FBAC5'); p(0, 6, 5, 14, '#357782'); p(21, 6, 5, 14, '#357782'); p(5, 10, 16, 6, '#6FBAC5'); p(3, 16, 20, 4, '#357782'); p(4, 20, 2, 2, '#5B3A1E'); p(20, 20, 2, 2, '#5B3A1E'); } },
    beanbag: { n: () => ['Beanbag', 'Кресло-мешок', 'Sēžammaiss'], w: 22, h: 13, top: 5, sit: true,
      d: p => { p(5, 0, 12, 2, '#F08A3B'); p(2, 2, 18, 3, '#F08A3B'); p(1, 5, 20, 5, '#E07A2E'); p(0, 10, 22, 3, '#C0651F'); p(5, 2, 5, 2, '#F6A86A'); } },
    throne: { n: () => ['Golden throne', 'Золотой трон', 'Zelta tronis'], w: 28, h: 36, top: 22, sit: true,
      d: p => { p(5, 0, 18, 22, '#E9C46A'); p(4, 2, 1, 20, '#B8902F'); p(23, 2, 1, 20, '#B8902F'); p(8, 3, 12, 15, '#B23A48'); p(13, 0, 2, 2, '#E5484D'); p(9, 1, 2, 2, '#4A7BD8'); p(17, 1, 2, 2, '#4CC38A'); p(0, 16, 5, 12, '#E9C46A'); p(23, 16, 5, 12, '#E9C46A'); p(4, 20, 20, 6, '#B23A48'); p(5, 21, 18, 1, '#D45A68'); p(2, 26, 24, 8, '#E9C46A'); p(2, 26, 24, 1, '#F7DC8B'); p(3, 34, 3, 2, '#B8902F'); p(22, 34, 3, 2, '#B8902F'); } },
    table: { n: () => ['Wooden table', 'Деревянный стол', 'Koka galds'], w: 32, h: 18, top: 0,
      d: p => { p(0, 0, 32, 3, '#A0673C'); p(0, 3, 32, 1, '#7A4A28'); p(2, 4, 3, 14, '#7A4A28'); p(27, 4, 3, 14, '#7A4A28'); p(5, 6, 22, 1, '#7A4A28'); } },
    roundtable: { n: () => ['Round café table', 'Круглый столик', 'Apaļš galdiņš'], w: 24, h: 18, top: 0,
      d: p => { p(2, 0, 20, 2, '#F4EBDD'); p(0, 2, 24, 2, '#D9CBB4'); p(10, 4, 4, 12, '#2B2340'); p(5, 16, 14, 2, '#2B2340'); } },
    coffeetable: { n: () => ['Coffee table', 'Журнальный столик', 'Kafijas galdiņš'], w: 30, h: 9, top: 0,
      d: p => { p(0, 0, 30, 3, '#5B3A2A'); p(1, 3, 28, 1, '#3E281C'); p(2, 4, 2, 5, '#3E281C'); p(26, 4, 2, 5, '#3E281C'); p(4, 6, 22, 1, '#3E281C'); } },
    desk: { n: () => ['Writing desk', 'Письменный стол', 'Rakstāmgalds'], w: 36, h: 20, top: 0,
      d: p => { p(0, 0, 36, 3, '#8C5A3A'); p(22, 3, 13, 17, '#7A4A30'); p(23, 9, 11, 1, '#5E3826'); p(27, 5, 3, 1, '#E9C46A'); p(27, 12, 3, 1, '#E9C46A'); p(1, 3, 3, 17, '#7A4A30'); } },
    bookshelf: { n: () => ['Bookshelf', 'Книжная полка', 'Grāmatu plaukts'], w: 26, h: 40, top: 0,
      d: p => { p(0, 0, 26, 40, '#7A4A30'); p(2, 2, 22, 36, '#4E2F1F'); p(2, 13, 22, 2, '#7A4A30'); p(2, 26, 22, 2, '#7A4A30'); const c = ['#E5484D', '#4A7BD8', '#E9C46A', '#4CC38A', '#B79CF2', '#F08A3B', '#F4EBDD'];
        [[2, 13], [15, 26], [28, 38]].forEach(([y0, y1], s) => { let x = 3; let k = s * 3; while (x < 22) { const w = 2 + (k % 2), h = (y1 - y0) - 2 - (k % 3); p(x, y1 - h, w, h, c[k % c.length]); x += w + (k % 4 === 0 ? 1 : 0); k++; } }); } },
    books: { n: () => ['Stack of books', 'Стопка книг', 'Grāmatu kaudze'], w: 12, h: 8, top: 0,
      d: p => { p(0, 5, 12, 3, '#C9463D'); p(1, 6, 10, 1, '#F4EBDD'); p(1, 2, 10, 3, '#4A7BD8'); p(2, 3, 8, 1, '#F4EBDD'); p(2, 0, 9, 2, '#4CC38A'); } },
    tv: { n: () => ['Retro TV', 'Ретро-телевизор', 'Retro televizors'], w: 26, h: 20, top: 0,
      d: (p, t, i, room) => { p(0, 0, 26, 17, '#2B2340'); p(2, 2, 22, 13, '#10213A'); p(10, 17, 6, 3, '#1A1528');
        if (room.has('console')) { p(2, 12, 22, 3, '#3E8257'); const jx = 4 + Math.floor((t / 120) % 16), jy = 9 - Math.abs(Math.sin(t / 300)) * 5; p(jx, jy, 2, 3, '#F6D04D'); p(18 - Math.floor((t / 200) % 12), 10, 2, 2, '#E5484D'); }
        else { p(2, 2, 22, 13, '#3E7BC6'); const cx = 2 + Math.floor((t / 160) % 26) - 4; p(Math.max(2, cx), 5, Math.min(6, 24 - cx), 2, '#FFFFFF'); p(2, 12, 22, 3, '#6FBF6A'); } } },
    console: { n: () => ['Game console', 'Игровая приставка', 'Spēļu konsole'], w: 16, h: 6, top: null,
      d: p => { p(0, 2, 11, 4, '#DADAE6'); p(1, 3, 9, 1, '#A9A9BD'); p(9, 4, 1, 1, '#4CC38A'); p(10, 5, 2, 1, '#2B2340'); p(12, 3, 4, 3, '#2B2340'); p(13, 4, 1, 1, '#E5484D'); p(14, 3, 1, 1, '#4A7BD8'); } },
    knitting: { n: () => ['Knitting basket', 'Корзинка с вязанием', 'Adīšanas grozs'], w: 16, h: 11, top: null,
      d: p => { p(3, 1, 5, 5, '#F28AB2'); p(4, 2, 1, 3, '#E06A95'); p(8, 0, 5, 5, '#7FB3E8'); p(10, 1, 1, 3, '#5B92D0'); p(11, -3, 1, 7, '#C9C9D6'); p(13, -2, 1, 6, '#C9C9D6'); p(1, 4, 14, 7, '#B98236'); for (let y = 5; y < 11; y += 2) p(1, y, 14, 1, '#8C5E22'); p(14, 6, 3, 1, '#F28AB2'); } },
    yarn: { n: () => ['Ball of yarn', 'Клубок', 'Dzijas kamols'], w: 6, h: 6, top: null,
      d: p => { p(1, 0, 4, 6, '#E5484D'); p(0, 1, 6, 4, '#E5484D'); p(1, 1, 1, 4, '#B83A32'); p(3, 0, 1, 6, '#B83A32'); p(6, 4, 3, 1, '#E5484D'); } },
    lamp: { n: () => ['Floor lamp', 'Торшер', 'Stāvlampa'], w: 12, h: 38, top: null, glow: [6, 3],
      d: p => { p(3, 0, 6, 2, '#F6D04D'); p(1, 2, 10, 5, '#F6C445'); p(1, 6, 10, 1, '#D9A33B'); p(5, 7, 2, 27, '#2B2340'); p(2, 34, 8, 4, '#2B2340'); } },
    plant: { n: () => ['Monstera', 'Монстера', 'Monstera'], w: 16, h: 28, top: null,
      d: p => { const g1 = '#3E8E5A', g2 = '#2E6B47'; p(2, 2, 6, 5, g1); p(9, 0, 6, 6, g2); p(0, 8, 7, 5, g2); p(9, 7, 7, 6, g1); p(4, 13, 8, 5, g1); p(5, 3, 1, 3, '#2E6B47'); p(12, 2, 1, 3, g1); p(7, 6, 2, 14, '#2E6B47'); p(3, 19, 10, 2, '#A8553A'); p(4, 21, 8, 7, '#C66B4A'); p(5, 22, 6, 1, '#D9825F'); } },
    cactus: { n: () => ['Little cactus', 'Кактус', 'Kaktuss'], w: 8, h: 13, top: null,
      d: p => { p(3, 0, 2, 1, '#F28AB2'); p(3, 1, 2, 8, '#4E9E5A'); p(1, 3, 2, 1, '#4E9E5A'); p(1, 2, 1, 2, '#4E9E5A'); p(5, 4, 2, 1, '#4E9E5A'); p(6, 3, 1, 2, '#4E9E5A'); p(1, 9, 6, 4, '#C66B4A'); p(0, 9, 8, 1, '#A8553A'); } },
    mug: { n: () => ['Mug of cocoa', 'Кружка какао', 'Kakao krūze'], w: 6, h: 5, top: null,
      d: (p, t) => { p(0, 0, 4, 5, '#F4EBDD'); p(0, 0, 4, 1, '#8B5A3C'); p(4, 1, 1, 1, '#F4EBDD'); p(5, 1, 1, 2, '#F4EBDD'); p(4, 3, 1, 1, '#F4EBDD'); if (Math.sin(t / 400) > 0) p(1, -2, 1, 1, '#FFFFFF'); else p(2, -3, 1, 1, '#FFFFFF'); } },
    teapot: { n: () => ['Teapot', 'Чайник', 'Tējkanna'], w: 12, h: 8, top: null,
      d: p => { p(4, 0, 3, 1, '#4A7BD8'); p(2, 1, 7, 7, '#7FB3E8'); p(1, 3, 9, 4, '#7FB3E8'); p(9, 2, 2, 1, '#7FB3E8'); p(10, 1, 1, 1, '#7FB3E8'); p(0, 3, 1, 3, '#4A7BD8'); p(3, 4, 5, 1, '#FFFFFF'); } },
    cake: { n: () => ['Birthday cake', 'Тортик', 'Kūka'], w: 12, h: 11, top: null,
      d: (p, t) => { p(5, 0, 1, 1, Math.sin(t / 150) > 0 ? '#F6C445' : '#F08A3B'); p(5, 1, 1, 2, '#E5484D'); p(1, 3, 10, 3, '#F7B6C8'); p(1, 6, 10, 3, '#FFF4E0'); p(1, 5, 10, 1, '#E5484D'); p(0, 9, 12, 2, '#E6E6EE'); } },
    candle: { n: () => ['Candle', 'Свеча', 'Svece'], w: 4, h: 9, top: null,
      d: (p, t) => { const f = Math.sin(t / 120) > 0; p(1, 0, 2, 2, f ? '#F6C445' : '#F08A3B'); p(f ? 1 : 2, -1, 1, 1, '#F6D04D'); p(0, 3, 4, 6, '#F4EBDD'); p(1, 2, 1, 1, '#2B2340'); } },
    radio: { n: () => ['Old radio', 'Старое радио', 'Vecais radio'], w: 14, h: 10, top: 0,
      d: p => { p(10, -4, 1, 4, '#2B2340'); p(0, 1, 14, 9, '#C9463D'); p(1, 2, 7, 6, '#7A2A24'); for (let y = 3; y < 8; y += 2) for (let x = 2; x < 8; x += 2) p(x, y, 1, 1, '#E9C46A'); p(10, 3, 2, 2, '#F4EBDD'); p(10, 6, 2, 2, '#F4EBDD'); } },
    globe: { n: () => ['Globe', 'Глобус', 'Globuss'], w: 10, h: 14, top: null,
      d: p => { p(2, 0, 6, 1, '#4A7BD8'); p(1, 1, 8, 7, '#4A7BD8'); p(2, 8, 6, 1, '#4A7BD8'); p(3, 2, 3, 3, '#4CC38A'); p(5, 5, 3, 2, '#4CC38A'); p(0, 3, 1, 5, '#E9C46A'); p(4, 9, 2, 3, '#7A4A28'); p(2, 12, 6, 2, '#7A4A28'); } },
    fishbowl: { n: () => ['Fishbowl', 'Аквариум', 'Akvārijs'], w: 12, h: 11, top: null,
      d: (p, t) => { p(2, 0, 8, 1, '#BFE3F5'); p(1, 1, 10, 9, 'rgba(160,210,240,.55)'); p(1, 4, 10, 6, 'rgba(70,140,210,.6)'); p(0, 10, 12, 1, '#C9CDD6'); const fx = 2 + Math.floor((Math.sin(t / 700) + 1) * 3); p(fx, 6, 3, 2, '#F08A3B'); p(fx + (Math.cos(t / 700) > 0 ? -1 : 3), 6, 1, 2, '#F6A86A'); p(3, 8, 1, 2, '#4CC38A'); } },
    gramophone: { n: () => ['Gramophone', 'Граммофон', 'Gramofons'], w: 14, h: 17, top: null,
      d: p => { p(6, 0, 8, 2, '#E9C46A'); p(5, 2, 7, 2, '#E9C46A'); p(5, 4, 4, 2, '#C99A2E'); p(5, 6, 2, 4, '#C99A2E'); p(0, 10, 14, 7, '#7A4A30'); p(1, 9, 12, 1, '#2B2340'); p(1, 11, 12, 1, '#5E3826'); } },
    pumpkin: { n: () => ['Pumpkin', 'Тыква', 'Ķirbis'], w: 11, h: 9, top: 0,
      d: p => spr(p, ['.....g.....', '....gg.....', '..oOoOoOo..', '.oOoOoOoOo.', 'oOoOoOoOoOo', 'oOkOoOoOkOo', 'oOoOoOoOoOo', '.oOkkkkkOo.', '..ooooooo..'], { o: '#E8812E', O: '#C9621C', g: '#4E7A2E', k: '#3A1E0E' }) },
    xmastree: { n: () => ['Christmas tree', 'Новогодняя ёлка', 'Ziemassvētku egle'], w: 38, h: 64, top: null,
      d: p => { for (let y = 0; y < 52; y++) { const tier = y < 16 ? y / 16 : y < 34 ? (y - 10) / 24 : (y - 24) / 28; const w = Math.max(1, Math.round(tier * 36)); for (let x = 0; x < w; x++) p(19 - Math.floor(w / 2) + x, y, 1, 1, (x + y) % 7 === 0 ? '#3E8257' : x < w / 3 ? '#245C3C' : '#2E7D4F'); } p(17, 52, 4, 4, '#6B4329'); p(13, 56, 12, 8, '#C9463D'); p(13, 56, 12, 1, '#E9C46A'); } },
    present: { n: i => [['Red present', 'Красный подарок', 'Sarkana dāvana'], ['Blue present', 'Синий подарок', 'Zila dāvana'], ['Green present', 'Зелёный подарок', 'Zaļa dāvana'], ['Lilac present', 'Сиреневый подарок', 'Ceriņu dāvana']][i], v: 4, w: 12, h: 11, top: 1,
      d: (p, t, i) => { const [c, r] = GIFT_C[i]; p(0, 3, 12, 8, c); p(-1, 2, 14, 2, c); p(5, 2, 2, 9, r); p(0, 6, 12, 1, r); p(3, 0, 2, 2, r); p(7, 0, 2, 2, r); } },
    snowman: { n: () => ['Snowman', 'Снеговик', 'Sniegavīrs'], w: 12, h: 19, top: null,
      d: p => { p(3, 0, 6, 2, '#2B2340'); p(2, 2, 8, 1, '#2B2340'); p(3, 3, 6, 5, '#FFFFFF'); p(4, 4, 1, 1, '#2B2340'); p(7, 4, 1, 1, '#2B2340'); p(8, 5, 3, 1, '#F08A3B'); p(2, 8, 8, 1, '#E5484D'); p(1, 9, 10, 10, '#FFFFFF'); p(5, 11, 1, 1, '#2B2340'); p(5, 14, 1, 1, '#2B2340'); p(1, 17, 10, 2, '#D8E2EE'); } },
  };
  // украшения: висят где угодно (координаты x, y), рисуются поверх мебели
  const DECO = {
    ornament: { n: i => { const c = ORN_N[i] || ORN_N[0]; return ['Tree ball (' + c[0] + ')', 'Ёлочный шарик (' + c[1] + ')', 'Eglītes bumbiņa (' + c[2] + ')']; }, v: ORN_C.length, w: 5, h: 7,
      d: (p, t, i) => {
        const c = ORN_C[i]; p(2, 0, 1, 1, '#C9C9D6'); p(1, 1, 3, 1, '#E9C46A'); p(1, 2, 3, 1, c); p(0, 3, 5, 3, c); p(1, 6, 3, 1, c);
        if (i === 12) { p(0, 4, 5, 1, '#FFFFFF'); p(1, 2, 3, 1, '#FFFFFF'); p(1, 6, 3, 1, '#FFFFFF'); } // в полоску
        if (i === 13) { p(1, 4, 1, 1, '#FFFFFF'); p(3, 3, 1, 1, '#FFFFFF'); p(3, 5, 1, 1, '#FFFFFF'); p(2, 6, 1, 1, '#BFE3F5'); } // снежинки
        if (i === 14) { const k = Math.floor(t / 180) % 6; [[1, 4], [3, 3], [2, 5], [4, 4], [1, 2], [3, 6]].forEach(([x, y], n) => { if ((n + k) % 3 === 0) p(x, y, 1, 1, '#FFF3B0'); }); } // блёстки мерцают
        if (i === 15) { p(1, 2, 3, 1, '#E5484D'); p(0, 3, 5, 1, '#F08A3B'); p(0, 4, 5, 1, '#F6D04D'); p(0, 5, 5, 1, '#4CC38A'); p(1, 6, 3, 1, '#4A7BD8'); } // радужный
        p(1, 3, 1, 1, '#FFFFFF'); if (Math.sin(t / 700 + i * 2.3) > .93) p(3, 2, 1, 1, '#FFFFFF'); // блик иногда вспыхивает
      } },
    xmasstar: { n: () => ['Tree-top star', 'Звезда на ёлку', 'Zvaigzne eglei'], w: 9, h: 9,
      d: (p, t) => { spr(p, ['....s....', '....s....', '...sss...', 'sssssssss', '.sssssss.', '..sssss..', '.sss.sss.', '.ss...ss.', 's.......s'], { s: '#F6D04D' }); p(4, 4, 1, 1, '#FFF3B0'); if (Math.sin(t / 300) > .6) { p(-1, 0, 1, 1, '#FFFFFF'); p(9, 2, 1, 1, '#FFFFFF'); } } },
    lights: { n: () => ['Fairy lights', 'Гирлянда-огоньки', 'Lampiņu virtene'], w: 32, h: 6,
      d: (p, t) => { const c = ['#E5484D', '#F6D04D', '#4CC38A', '#4A7BD8', '#F28AB2']; for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 3), 1, 1, '#2E4A2E'); for (let k = 0; k < 8; k++) { const x = 2 + k * 4, y = Math.round(Math.sin(x / 32 * Math.PI) * 3) + 1, on = Math.sin(t / 250 + k * 1.7) > -.3; p(x, y, 2, 2, on ? c[k % 5] : '#5B5670'); } } },
    // ещё гирлянды — все мигают
    lightswarm: { n: () => ['Warm white fairy lights', 'Гирлянда тёплая белая', 'Silti balta virtene'], w: 32, h: 6,
      d: (p, t) => { for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 3), 1, 1, '#4A4458'); for (let k = 0; k < 11; k++) { const x = 1 + k * 3, y = Math.round(Math.sin(x / 32 * Math.PI) * 3) + 1, b = Math.sin(t / 400 + k * 2.1); p(x, y, 1, 1, b > .5 ? '#FFF3B0' : b > -.4 ? '#F6D04D' : '#B8954A'); } } },
    lightsice: { n: () => ['Icicle lights', 'Гирлянда-сосульки', 'Lāsteku virtene'], w: 32, h: 10,
      d: (p, t) => { p(0, 0, 32, 1, '#C9C9D6'); for (let k = 0; k < 8; k++) { const x = 1 + k * 4, len = 3 + (k * 5) % 6, drip = Math.floor(t / 120 + k * 3) % (len + 4); for (let y = 1; y <= len; y++) p(x, y, 1, 1, y === drip ? '#FFFFFF' : '#7FB3E8'); } } },
    lightsrun: { n: () => ['Running lights', 'Гирлянда «бегущий огонь»', 'Skrejošā virtene'], w: 32, h: 6,
      d: (p, t) => { const c = ['#E5484D', '#F6D04D', '#4CC38A', '#4A7BD8', '#B79CF2']; const head = Math.floor(t / 110) % 10; for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 3), 1, 1, '#2E4A2E'); for (let k = 0; k < 10; k++) { const x = 1 + k * 3, y = Math.round(Math.sin(x / 32 * Math.PI) * 3) + 1, d = (head - k + 10) % 10; p(x, y, 2, 2, d === 0 ? '#FFFFFF' : d < 3 ? c[k % 5] : '#5B5670'); } } },
    lightsretro: { n: () => ['Big retro bulbs', 'Гирлянда с большими ретро-лампочками', 'Retro spuldžu virtene'], w: 32, h: 9,
      d: (p, t) => { const c = ['#E5484D', '#4CC38A', '#F08A3B', '#4A7BD8', '#F6D04D']; for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 2), 1, 1, '#2E4A2E'); for (let k = 0; k < 6; k++) { const x = 2 + k * 5, y = Math.round(Math.sin(x / 32 * Math.PI) * 2) + 1, on = Math.floor(t / 700 + k) % 4 !== 0, col = on ? c[k % 5] : '#5B5670'; p(x, y, 2, 1, '#3A3550'); p(x - 1 + 1, y + 1, 2, 1, col); p(x - 1, y + 2, 4, 3, col); p(x, y + 5, 2, 1, col); if (on) p(x, y + 2, 1, 1, '#FFFFFF'); } } },
    lightsstar: { n: () => ['Star lights', 'Гирлянда-звёздочки', 'Zvaigznīšu virtene'], w: 32, h: 7,
      d: (p, t) => { for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 2), 1, 1, '#C9C9D6'); for (let k = 0; k < 6; k++) { const x = 2 + k * 5, y = Math.round(Math.sin(x / 32 * Math.PI) * 2) + 1, on = Math.sin(t / 300 + k * 1.3) > -.2, col = on ? '#F6D04D' : '#8A7A40'; p(x + 1, y, 1, 1, col); p(x, y + 1, 3, 1, col); p(x + 1, y + 2, 1, 1, col); if (on && Math.sin(t / 300 + k * 1.3) > .85) { p(x - 1, y + 1, 1, 1, '#FFF3B0'); p(x + 3, y + 1, 1, 1, '#FFF3B0'); } } } },
    lightscurtain: { n: () => ['Curtain lights', 'Гирлянда-занавес', 'Aizkara virtene'], w: 30, h: 22, glow: [15, 10],
      d: (p, t) => { p(0, 0, 30, 1, '#4A4458'); for (let k = 0; k < 8; k++) { const x = 1 + k * 4; for (let y = 2; y < 22; y += 3) { const b = Math.sin(t / 350 - y / 4 + k * .9); p(x, y, 1, 1, b > .3 ? '#FFF3B0' : b > -.5 ? '#E9C46A' : '#6B5A30'); } } } },
    tinsel: { n: () => ['Tinsel', 'Мишура', 'Spīguļvirtene'], w: 32, h: 4,
      d: (p, t) => { for (let x = 0; x < 32; x++) { const y = Math.round(Math.sin(x / 32 * Math.PI) * 2); p(x, y + (x % 2), 1, 2, (x + Math.floor(t / 150)) % 5 ? '#E9C46A' : '#FFF3B0'); } } },
    bell: { n: () => ['Golden bell', 'Колокольчик', 'Zvaniņš'], w: 7, h: 8,
      d: p => { p(2, 0, 3, 1, '#E5484D'); p(1, 1, 5, 1, '#E5484D'); p(2, 2, 3, 2, '#E9C46A'); p(1, 4, 5, 2, '#E9C46A'); p(0, 6, 7, 1, '#C99A2E'); p(3, 7, 1, 1, '#7A4A28'); } },
    candycane: { n: () => ['Candy cane', 'Карамельная трость', 'Konfekšu spieķītis'], w: 5, h: 10,
      d: p => { spr(p, ['.wrw.', 'r...w', 'w...r', '....w', '....r', '....w', '....r', '....w', '....r', '....w'], { w: '#FFFFFF', r: '#E5484D' }); } },
    snowflake: { n: () => ['Paper snowflake', 'Снежинка', 'Papīra sniegpārsla'], w: 7, h: 7,
      d: p => spr(p, ['.w.w.w.', '..www..', 'w.www.w', 'wwwwwww', 'w.www.w', '..www..', '.w.w.w.'], { w: '#FFFFFF' }) },
    painting: { n: () => ['Portrait of Polly', 'Портрет Полли', 'Pollijas portrets'], w: 22, h: 18,
      d: p => { p(0, 0, 22, 18, '#C99A2E'); p(1, 1, 20, 16, '#E9C46A'); p(2, 2, 18, 14, '#F5C4B3'); spr((x, y, w, h, c) => p(5 + x, 3 + y, w, h, c), ['...ddd....', '..dbbbd...', '.dbbwbd...', '.dbbkbdoo.', '.dbbbbbd..', 'dbbsbbbbd.', 'dbbbbbbbd.', '.ddddddd..', '..o..o....'], { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b' }); } },
    clock: { n: () => ['Wall clock', 'Настенные часы', 'Sienas pulkstenis'], w: 11, h: 11,
      d: p => { p(3, 0, 5, 1, '#7A4A30'); p(1, 1, 9, 9, '#7A4A30'); p(0, 3, 11, 5, '#7A4A30'); p(3, 10, 5, 1, '#7A4A30'); p(2, 2, 7, 7, '#F4EBDD'); p(1, 4, 9, 3, '#F4EBDD'); const now = new Date(), a = (now.getMinutes() / 60) * Math.PI * 2, h = ((now.getHours() % 12) / 12) * Math.PI * 2;
        for (let k = 0; k < 4; k++) p(5 + Math.round(Math.sin(a) * k), 5 - Math.round(Math.cos(a) * k), 1, 1, '#2B2340'); for (let k = 0; k < 3; k++) p(5 + Math.round(Math.sin(h) * k), 5 - Math.round(Math.cos(h) * k), 1, 1, '#E5484D'); } },
    bunting: { n: () => ['Party flags', 'Флажки', 'Karodziņi'], w: 32, h: 7,
      d: p => { const c = ['#E5484D', '#F6D04D', '#4CC38A', '#4A7BD8', '#F28AB2']; for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 2), 1, 1, '#7A4A28'); for (let k = 0; k < 6; k++) { const x = 1 + k * 5, y = Math.round(Math.sin((x + 2) / 32 * Math.PI) * 2) + 1; p(x, y, 4, 2, c[k % 5]); p(x + 1, y + 2, 2, 2, c[k % 5]); } } },
  };

  // ---------- ещё вещи (10.10.2026, Алина: «предметов оооочень мало») ----------
  const tileWall = (bg, rows, pal, sx, sy, shift = 0) => g => { R(g, 0, 0, RW, FY, bg); for (let y = 2, r = 0; y < FY; y += sy, r++) for (let x = (r % 2) * shift; x < RW; x += sx) rows.forEach((row, yy) => [...row].forEach((ch, xx) => { if (pal[ch] && y + yy < FY - 3) R(g, x + xx, y + yy, 1, 1, pal[ch]); })); };
  Object.assign(WALL, {
    sunflowers: [['Sunflowers', 'Подсолнухи', 'Saulespuķes'], tileWall('#FFF1C9', ['.y.y.', 'yynyy', '.ynY.', 'yy.yy', '..g..', '.gg..'], { y: '#F6C445', n: '#7A4A28', Y: '#7A4A28', g: '#5E9E45' }, 14, 12, 7)],
    hearts: [['Little hearts', 'Сердечки', 'Sirsniņas'], tileWall('#FFE3EC', ['.h.h.', 'hhhhh', '.hhh.', '..h..'], { h: '#F28AB2' }, 10, 9, 5)],
    clouds: [['Clouds', 'Облака', 'Mākoņi'], tileWall('#BFE3F8', ['..ww...', '.wwwww.', 'wwwwwww'], { w: '#FFFFFF' }, 18, 12, 9)],
    waves: [['Sea waves', 'Морские волны', 'Jūras viļņi'], tileWall('#DDF1FA', ['.bb..', 'b..bb'], { b: '#6FB4E0' }, 6, 6, 3)],
    jungle: [['Jungle leaves', 'Джунгли', 'Džungļi'], tileWall('#2E6B47', ['..lL..', '.llLL.', 'lllLLL', '.llLL.', '..lL..', '...d..'], { l: '#4E9E5A', L: '#3E8257', d: '#245C3C' }, 10, 9, 5)],
    sakura: [['Cherry blossom', 'Сакура', 'Sakura'], tileWall('#FCE8EF', ['.p.', 'pyp', '.p.', '..n'], { p: '#F28AB2', y: '#F6D04D', n: '#8C5E3C' }, 9, 8, 4)],
    mushrooms: [['Forest mushrooms', 'Грибочки', 'Sēnītes'], tileWall('#F4EBDD', ['.rrr.', 'rwrwr', '..s..', '..s..'], { r: '#E5484D', w: '#FFFFFF', s: '#E6D3B0' }, 12, 10, 6)],
    bats: [['Spooky bats', 'Летучие мыши', 'Sikspārņi'], tileWall('#2B1A3F', ['b.....b', 'bb.k.bb', '.bbkbb.', '...b...'], { b: '#140B20', k: '#E8812E' }, 16, 12, 8)],
    pumpkins: [['Pumpkin patch', 'Тыковки', 'Ķirbīši'], tileWall('#3A2410', ['..g..', '.ooo.', 'ooOoo', '.ooo.'], { g: '#4E7A2E', o: '#E8812E', O: '#C9621C' }, 11, 9, 5)],
    ghosts: [['Friendly ghosts', 'Привидения', 'Spociņi'], tileWall('#4B3B6B', ['.www.', 'wkwkw', 'wwwww', 'w.w.w'], { w: '#F4F0FA', k: '#2B2340' }, 12, 10, 6)],
    candycane: [['Candy stripes', 'Карамельные полоски', 'Konfekšu strīpas'], g => { R(g, 0, 0, RW, FY, '#FFFFFF'); for (let y = 0; y < FY; y++) for (let x = 0; x < RW; x++) if (((x + y) % 10) < 4) R(g, x, y, 1, 1, '#E5484D'); }],
    snowflakes: [['Snowflakes', 'Снежинки', 'Sniegpārslas'], tileWall('#CFE3F7', ['.w.w.', '..w..', 'wwwww', '..w..', '.w.w.'], { w: '#FFFFFF' }, 11, 10, 5)],
    gingerbread: [['Gingerbread', 'Пряники', 'Piparkūkas'], tileWall('#C68A55', ['.dd.', 'dwwd', '.dd.', 'dddd', '.dd.', 'd..d'], { d: '#8C5A30', w: '#FFFFFF' }, 10, 9, 5)],
    tartan: [['Red tartan', 'Шотландка', 'Skotu rūtiņas'], g => { R(g, 0, 0, RW, FY, '#A8282E'); for (let x = 0; x < RW; x += 12) { R(g, x, 0, 3, FY, 'rgba(20,40,30,.55)'); R(g, x + 6, 0, 1, FY, 'rgba(240,200,80,.5)'); } for (let y = 0; y < FY; y += 12) { R(g, 0, y, RW, 3, 'rgba(20,40,30,.55)'); R(g, 0, y + 6, RW, 1, 'rgba(240,200,80,.5)'); } }],
    retro: [['Retro 70s', 'Ретро 70-х', 'Retro 70-tie'], tileWall('#F2C27B', ['.ooo.', 'orrro', 'or.ro', 'orrro', '.ooo.'], { o: '#D9822B', r: '#8C4A1E' }, 8, 7, 4)],
    arcade: [['Arcade night', 'Аркада', 'Arkāde'], tileWall('#140F2E', ['..g.g..', '.ggggg.', 'gg.g.gg', 'ggggggg', 'g.g.g.g'], { g: '#4CE3A0' }, 16, 11, 8)],
    library: [['Library shelves', 'Библиотека', 'Bibliotēka'], g => { R(g, 0, 0, RW, FY, '#5E3826'); const c = ['#C9463D', '#4A7BD8', '#E9C46A', '#4CC38A', '#B79CF2', '#F4EBDD']; for (let y = 4; y < FY - 6; y += 13) { R(g, 0, y + 10, RW, 2, '#3E281C'); for (let x = 0, k = y; x < RW; k++) { const w = 2 + (k % 3), h = 7 + (k % 3); R(g, x, y + 10 - h, w, h, c[k % c.length]); x += w + (k % 5 === 0 ? 1 : 0); } } }],
    chalk: [['Chalkboard', 'Школьная доска', 'Tāfele'], g => { R(g, 0, 0, RW, FY, '#2F4A3A'); const r = rngOf(17), w = 'rgba(240,240,230,.7)'; for (let i = 0; i < 14; i++) { const x = r() * (RW - 10), y = r() * (FY - 14); if (i % 3 === 0) { R(g, x, y + 2, 5, 1, w); R(g, x + 2, y, 1, 5, w); } else if (i % 3 === 1) { for (let k = 0; k < 6; k++) R(g, x + k, y + (k % 2), 1, 1, w); } else { R(g, x, y, 4, 1, w); R(g, x, y, 1, 4, w); R(g, x, y + 3, 4, 1, w); } } }],
    bamboo: [['Bamboo', 'Бамбук', 'Bambuss'], g => { R(g, 0, 0, RW, FY, '#E9F2D8'); for (let x = 3; x < RW; x += 11) { R(g, x, 0, 3, FY, '#7FB36A'); R(g, x + 1, 0, 1, FY, '#9CCB84'); for (let y = (x * 7) % 16; y < FY; y += 16) R(g, x - 1, y, 5, 1, '#5E9E45'); } }],
    planets: [['Planets', 'Планеты', 'Planētas'], tileWall('#121236', ['..oo.....', '.oooo..w.', 'rrrrrr...', '.oooo....', '..oo....w'], { o: '#E9A93B', r: '#F6D78A', w: '#FFFFFF' }, 20, 14, 10)],
    rainbow: [['Pastel rainbow', 'Пастельная радуга', 'Pasteļu varavīksne'], g => { const c = ['#F7C6CE', '#FBDDB8', '#FBF0B8', '#C9EBD2', '#C3DDF5', '#D9CDF5']; for (let y = 0; y < FY; y++) R(g, 0, y, RW, 1, c[Math.floor(y / 6) % 6]); }],
    pigeons: [['Pigeon print', 'Голуби', 'Baložu raksts'], tileWall('#E2D3F7', ['..dd..', '.dbbdo', 'dbbbd.', '.ddd..', '..o.o.'], { d: '#5E5A9C', b: '#7F81BF', o: '#F2A73B' }, 13, 10, 6)],
  });
  Object.assign(FLOOR, {
    grass: [['Soft grass', 'Травка', 'Zālīte'], g => { R(g, 0, FY, RW, RH - FY, '#6FBF6A'); const r = rngOf(3); for (let i = 0; i < 160; i++) R(g, r() * RW, FY + r() * (RH - FY), 1, 2, r() < .5 ? '#5AA857' : '#86CF7E'); }],
    sand: [['Beach sand', 'Песок', 'Smiltis'], g => { R(g, 0, FY, RW, RH - FY, '#EED6A0'); const r = rngOf(4); for (let i = 0; i < 90; i++) R(g, r() * RW, FY + r() * (RH - FY), 1, 1, '#D9BC80'); R(g, 30, FY + 18, 3, 2, '#F28AB2'); R(g, 150, FY + 10, 2, 2, '#FFFFFF'); }],
    snowfloor: [['Snow', 'Снег', 'Sniegs'], g => { R(g, 0, FY, RW, RH - FY, '#F4F7FB'); const r = rngOf(5); for (let i = 0; i < 70; i++) R(g, r() * RW, FY + r() * (RH - FY), 2, 1, '#D8E2EE'); }],
    fluffy: [['Fluffy pink rug', 'Пушистый розовый ковёр', 'Pūkains rozā paklājs'], g => { planks(g, '#C8955E', '#D2A16C', '#A3733F'); const r = rngOf(6); for (let y = FY + 5; y < RH - 2; y++) for (let x = 28; x < 164; x++) R(g, x, y, 1, 1, r() < .25 ? '#F7B6C8' : '#F9C9D6'); }],
    rainbowrug: [['Rainbow rug', 'Радужный коврик', 'Varavīksnes paklājiņš'], g => { planks(g, '#6B4430', '#77503A', '#553424'); const c = ['#E5484D', '#F08A3B', '#F6D04D', '#4CC38A', '#4A7BD8', '#9B5DE5']; for (let y = 0; y < 24; y++) { const w = Math.round(120 * Math.sqrt(Math.max(0, 1 - Math.pow((y - 12) / 12.5, 2)))); R(g, 96 - w / 2, FY + 4 + y, w, 1, c[Math.floor(Math.abs(y - 12) / 2) % 6]); } }],
    parquet: [['Royal parquet', 'Паркет', 'Parkets'], g => { for (let y = FY; y < RH; y += 8) for (let x = 0; x < RW; x += 8) { const a = ((x + y) / 8) % 2; for (let k = 0; k < 8; k += 2) R(g, x + (a ? k : 0), y + (a ? 0 : k), a ? 2 : 8, a ? 8 : 2, k % 4 ? '#8C5A3A' : '#A06A44'); } }],
    stone: [['Stone tiles', 'Каменный пол', 'Akmens grīda'], g => { R(g, 0, FY, RW, RH - FY, '#6E6A78'); for (let y = FY; y < RH; y += 9) for (let x = ((y - FY) / 9 % 2) * 7; x < RW; x += 14) R(g, x, y, 13, 8, (x + y) % 3 ? '#8A8696' : '#7E7A8A'); }],
    arcadefloor: [['Arcade carpet', 'Ковёр аркады', 'Arkādes paklājs'], g => { R(g, 0, FY, RW, RH - FY, '#1B1240'); const c = ['#4CE3A0', '#F28AB2', '#F6D04D', '#7FB3E8'], r = rngOf(8); for (let i = 0; i < 60; i++) { const x = r() * RW, y = FY + r() * (RH - FY); R(g, x, y, 2, 1, c[i % 4]); R(g, x + (i % 2 ? 2 : -1), y + 1, 1, 1, c[i % 4]); } }],
    velvet: [['Purple velvet', 'Фиолетовый бархат', 'Violets samts'], g => { R(g, 0, FY, RW, RH - FY, '#5B3E8C'); for (let x = 0; x < RW; x += 3) R(g, x, FY, 1, RH - FY, '#654A97'); R(g, 0, FY + 1, RW, 1, '#E9C46A'); }],
    leafy: [['Fallen leaves', 'Опавшие листья', 'Nokritušas lapas'], g => { planks(g, '#C8955E', '#D2A16C', '#A3733F'); const c = ['#E07B39', '#C8452B', '#E9B23B'], r = rngOf(9); for (let i = 0; i < 40; i++) { const x = r() * RW, y = FY + 2 + r() * 28; R(g, x, y, 2, 1, c[i % 3]); R(g, x + 1, y + 1, 1, 1, c[i % 3]); } }],
  });
  Object.assign(VIEW, {
    sakura: [['Sakura garden', 'Сад сакуры', 'Sakuru dārzs'], (g, x, y, t) => { sky(g, x, y, ['#BFE3F5', '#D1EAF7', '#E3F1F9']); R(g, x, y + WH - 8, WW, 8, '#8DC97F'); R(g, x + 18, y + 18, 3, 18, '#6B4329'); for (let k = 0; k < 40; k++) R(g, x + 6 + (k * 7) % 30, y + 6 + (k * 5) % 16, 3, 2, k % 3 ? '#F7B6C8' : '#F28AB2'); for (let i = 0; i < 5; i++) R(g, x + ((i * 11 + t / 90) % WW), y + ((i * 9 + t / 60) % WH), 1, 1, '#F28AB2'); }],
    spooky: [['Spooky night', 'Жуткая ночь', 'Spokaina nakts'], (g, x, y, t) => { sky(g, x, y, ['#2B1A3F', '#3A2258', '#4B2C6B']); R(g, x + 24, y + 5, 10, 10, '#F6E7B0'); R(g, x + 26, y + 7, 3, 2, '#E9D79A'); for (let i = 0; i < 3; i++) { const bx = x + ((i * 15 + t / 40) % (WW + 8)) - 4, by = y + 10 + i * 6 + Math.sin(t / 200 + i) * 2; R(g, bx, by, 1, 1, '#140B20'); R(g, bx - 2, by - 1, 2, 1, '#140B20'); R(g, bx + 1, by - 1, 2, 1, '#140B20'); } R(g, x, y + WH - 10, WW, 10, '#1B1030'); R(g, x + 6, y + WH - 16, 3, 8, '#1B1030'); R(g, x + 30, y + WH - 14, 1, 6, '#1B1030'); R(g, x + 28, y + WH - 13, 5, 1, '#1B1030'); R(g, x + 12, y + WH - 6, 3, 3, '#E8812E'); }],
    underwater: [['Under the sea', 'Под водой', 'Zem ūdens'], (g, x, y, t) => { sky(g, x, y, ['#3F8FC9', '#2E78B0', '#22629A']); for (let i = 0; i < 6; i++) R(g, x + 4 + i * 7, y + WH - ((t / 25 + i * 9) % WH), 1, 1, '#BFE3F5'); const fx = x + ((t / 50) % (WW + 10)) - 5; R(g, fx, y + 16, 4, 2, '#F08A3B'); R(g, fx - 1, y + 16, 1, 2, '#F6A86A'); R(g, x + 30 - ((t / 70) % (WW + 10)) + 10, y + 26, 3, 2, '#F6D04D'); R(g, x, y + WH - 5, WW, 5, '#EED6A0'); R(g, x + 8, y + WH - 13, 2, 8, '#4CC38A'); R(g, x + 34, y + WH - 11, 2, 6, '#E5484D'); }],
    desert: [['Desert', 'Пустыня', 'Tuksnesis'], (g, x, y) => { sky(g, x, y, ['#F7D9A8', '#F9E3BC', '#FBEDD0']); R(g, x + 28, y + 7, 7, 7, '#F6A84A'); for (let k = 0; k < 14; k++) R(g, x + 4 + k, y + WH - 14 + Math.abs(k - 7), 30 - 2 * Math.abs(k - 7), 1, '#E9B86A'); R(g, x, y + WH - 6, WW, 6, '#E2A85A'); R(g, x + 8, y + WH - 14, 2, 9, '#4E9E5A'); R(g, x + 6, y + WH - 11, 2, 1, '#4E9E5A'); R(g, x + 6, y + WH - 13, 1, 2, '#4E9E5A'); }],
    rain: [['Rainy city', 'Дождливый город', 'Lietaina pilsēta'], (g, x, y, t) => { sky(g, x, y, ['#7E8B9E', '#8E9AAD', '#9EA9BB']); houses(g, x, y + 8, ['#5F6A7D', '#6E798C', '#525C6E'], '#F6D04D', 19, 0); for (let i = 0; i < 26; i++) { const rx = x + ((i * 7 + t / 30) % WW), ry = y + ((i * 13 + t / 8) % WH); R(g, rx, ry, 1, 2, 'rgba(220,235,255,.8)'); } }],
    sunset: [['Sunset beach', 'Закат на море', 'Saulriets jūrā'], (g, x, y, t) => { sky(g, x, y, ['#F28A6B', '#F6A86A', '#F9C77E', '#FBE0A0']); R(g, x + 14, y + 20, 14, 7, '#FFE08A'); R(g, x, y + 26, WW, 12, '#7A5BA8'); for (let i = 0; i < 5; i++) R(g, x + ((i * 9 + t / 150) % WW), y + 28 + (i % 3) * 3, 5, 1, '#F6A86A'); R(g, x, y + 38, WW, 4, '#E2C08A'); }],
    riga: [['Old Riga', 'Старая Рига', 'Vecrīga'], (g, x, y) => { sky(g, x, y, ['#9FD3F5', '#B4DDF7', '#C9E7F9']); R(g, x + 18, y + 4, 2, 10, '#3E8257'); R(g, x + 17, y + 12, 4, 6, '#3E8257'); R(g, x + 16, y + 18, 6, 24, '#B5543C'); R(g, x + 18, y + 2, 1, 2, '#E9C46A'); houses(g, x, y + 16, ['#E8C27B', '#D98C6B', '#F2E3C4', '#C38D9E'], '#FFF3C4', 23, 0); R(g, x + 16, y + 18, 6, 24, '#B5543C'); R(g, x + 18, y + 22, 2, 3, '#FFF3C4'); }],
    lighthouse: [['Lighthouse', 'Маяк', 'Bāka'], (g, x, y, t) => { sky(g, x, y, ['#1F2E5A', '#2B3C6B', '#3A4C7A']); R(g, x, y + 30, WW, 12, '#2E5A8C'); R(g, x + 26, y + 14, 6, 18, '#F4F0FA'); R(g, x + 26, y + 18, 6, 3, '#E5484D'); R(g, x + 26, y + 25, 6, 3, '#E5484D'); R(g, x + 25, y + 10, 8, 4, '#2B2340'); R(g, x + 27, y + 11, 4, 2, '#FFE08A'); if (Math.sin(t / 500) > 0) { g.fillStyle = 'rgba(255,224,138,.35)'; g.fillRect(x, y + 10, 26, 3); } else { g.fillStyle = 'rgba(255,224,138,.35)'; g.fillRect(x + 33, y + 10, 10, 3); } R(g, x + 22, y + 32, 14, 3, '#3E3550'); }],
  });
  Object.assign(CURT, {
    spooky: [['Halloween curtains', 'Хеллоуинские шторы', 'Helovīna aizkari'], ['#2B2340', '#E8812E']],
    xmasgreen: [['Christmas curtains', 'Новогодние шторы', 'Ziemassvētku aizkari'], ['#1D6B4F', '#165A42'], '#E5484D'],
    rainbow: [['Rainbow curtains', 'Радужные шторы', 'Varavīksnes aizkari'], ['#E5484D', '#F6D04D'], null, ['#E5484D', '#F08A3B', '#F6D04D', '#4CC38A', '#4A7BD8', '#9B5DE5']],
    sky: [['Sky blue curtains', 'Голубые шторы', 'Debeszilie aizkari'], ['#BFE3F8', '#9FCDEB'], '#FFFFFF'],
    golden: [['Golden curtains', 'Золотые шторы', 'Zelta aizkari'], ['#E9C46A', '#C99A2E']],
    velvet: [['Velvet curtains', 'Бархатные шторы', 'Samta aizkari'], ['#5B1E3A', '#3F1428']],
  });
  const S = (rows, pal) => p => spr(p, rows, pal);
  const N = (en, ru, lv) => () => [en, ru, lv];
  // зелье «Вкус детства» из «Зельеварни Полли»: бутылочка-сердечко 8 цветов; только из игры — в каталог (магазин, коллекции) не входит
  const KID_C = [['#F28AB2', 'pink', 'розовое', 'rozā'], ['#F2C94C', 'golden', 'золотое', 'zelta'], ['#6BD3A0', 'mint', 'мятное', 'piparmētru'], ['#6BB8F0', 'sky-blue', 'небесное', 'debeszila'],
    ['#B48CF0', 'lilac', 'сиреневое', 'ceriņu'], ['#F6A77A', 'peach', 'персиковое', 'persiku'], ['#E5484D', 'cherry', 'вишнёвое', 'ķiršu'], ['#F6E66A', 'lemon', 'лимонное', 'citronu']];
  FURN.kidpot = { n: i => { const c = KID_C[i] || KID_C[0]; return [`Taste of childhood potion (${c[1]})`, `Зелье «Вкус детства» (${c[2]})`, `Dzira “Bērnības garša” (${c[3]})`]; }, v: KID_C.length, w: 9, h: 11, top: null, game: true,
    d: (p, t, i) => { const c = (KID_C[i] || KID_C[0])[0], g = '#E8F1F7', d = '#2B2340';
      p(3, 0, 3, 1, '#A8553A'); p(3, 1, 3, 2, g); p(1, 3, 3, 1, d); p(5, 3, 3, 1, d); p(0, 4, 9, 3, d); p(1, 4, 3, 3, c); p(5, 4, 3, 3, c); p(4, 5, 1, 2, c);
      p(1, 7, 7, 1, d); p(2, 7, 5, 1, c); p(2, 8, 5, 1, d); p(3, 8, 3, 1, c); p(3, 9, 3, 1, d); p(4, 9, 1, 1, c); p(4, 10, 1, 1, d); p(2, 4, 1, 1, '#FFFFFF');
      if (Math.sin(t / 500 + i) > 0.6) p(7, 1, 1, 1, '#FFF3B0'); } };
  // альбом карточек (этап 7): есть в каждой комнате сам, двигается как мебель; в сумку, магазин и каталог не попадает (fixed, PPCanDo); нажатие — разворот альбома
  FURN.album = { n: N('Card album', 'Альбом карточек', 'Kartīšu albums'), w: 18, h: 22, top: null, fixed: true,
    d: (p, t) => { const w = '#7A4A30', d = '#5E3826', c = '#B8423A', pg = '#F7F1E4', fr = '#D8CCB4';
      p(4, 20, 10, 2, d); p(8, 11, 2, 9, w); p(6, 19, 6, 1, w); p(1, 10, 16, 2, w); p(1, 10, 16, 1, '#9C6A44');
      p(0, 1, 18, 9, c); p(1, 2, 7.5, 7.5, pg); p(9.5, 2, 7.5, 7.5, pg); p(8.5, 1, 1, 9, '#8E2F29');
      p(2, 3, 2.5, 3, '#E9C46A'); p(5, 3, 2.5, 3, '#9B5DE5'); p(2, 6.5, 2.5, 2.5, '#7FB3E8'); p(5, 6.5, 2.5, 2.5, fr);
      p(10.5, 3, 2.5, 3, fr); p(13.5, 3, 2.5, 3, fr); p(10.5, 6.5, 2.5, 2.5, fr); p(13.5, 6.5, 2.5, 2.5, fr);
      if (Math.sin(t / 700) > .7) p(3, 3.5, 1, 1, '#FFFFFF'); } };
  // награды за дела Титоса (этап 10, docs/titos.md «Вещи-награды»): furn|tc<имя>, по одной за дело — content/titos/NNN.json `reward`.
  // Только из игры (game): в магазин и каталог не входят; PPCanDo — не подарить, не продать.
  const TC = (en, ru, lv, w, h, rows, pal, more) => ({ n: N(en, ru, lv), w, h, top: null, game: true, titos: true, d: (p, t) => spr(p, rows, typeof pal === 'function' ? pal(t) : pal), ...more });
  Object.assign(FURN, {
    tcpie: TC('Miss Pumpkinella’s pie', 'Пирог мисс Тыквеллы', 'Mis Pumpkinellas pīrāgs', 14, 7,
      ['...s....s.....', '..cccccccccc..', '.cCCoCCCCoCCc.', 'cCCCCCoCCCCCCc', 'cccccccccccccc', 'wwwwwwwwwwwwww', '.WWWWWWWWWWWW.'],
      t => ({ s: Math.sin(t / 400) > 0 ? '#FFFFFF' : null, c: '#C98A4B', C: '#E0A86A', o: '#E8812E', w: '#F4F0FA', W: '#C9C3D6' })),
    tclantern: TC('Noodle lantern', 'Лапшичный фонарик', 'Nūdeļu laterna', 9, 11,
      ['....k....', '....k....', '..rrrrr..', '.rYYYYYr.', '.rYyYyYr.', '.rYYYYYr.', '.rYyYyYr.', '..rrrrr..', '...kkk...', '....k....', '...kkk...'],
      t => ({ k: '#E9D8A6', r: '#D9433B', Y: Math.sin(t / 300) > -.4 ? '#FFD34D' : '#F6A84A', y: '#F2D27A' }), { glow: [4, 5] }),
    tcjuice: TC('Midnight carrot juice', 'Полночный морковный сок', 'Pusnakts burkānu sula', 7, 11,
      ['..ggg..', '...g...', '..WWW..', '..BBB..', '.BOOOB.', 'BOOOOOB', 'BOwwwOB', 'BOwkwOB', 'BOwwwOB', 'BOOOOOB', '.BBBBB.'],
      { g: '#4E9E5A', W: '#B07A4A', B: '#E8F1F7', O: '#F08A3B', w: '#FFF3C4', k: '#2B2340' }),
    tcladle: TC('Eternal Soup pot', 'Кастрюля Вечного супа', 'Mūžīgās zupas katls', 13, 10,
      ['.........h...', '........h....', '.......h.....', '..ssss.h.ss..', '.KKKKKKhKKKK.', 'KGGGGGGhGGGGK', 'KkkkkkkkkkkkK', 'KkkkkkkkkkkkK', '.KkkkkkkkkkK.', '..KKKKKKKKK..'],
      t => ({ h: '#DDE6F0', s: Math.sin(t / 350) > 0 ? 'rgba(255,255,255,.7)' : null, K: '#3A3550', G: Math.sin(t / 250) > .5 ? '#9AD88A' : '#7FBF6A', k: '#4B4466' })),
    tcmilkabox: TC('Milka’s box', 'Коробка Милки', 'Milkas kaste', 14, 10,
      ['..............', '..............', '..............', 'BBBBBBBBBBBBBB', 'bbbbbbbbbbbbbb', 'bbbbbLLLLbbbbb', 'bbbbbLkkLbbbbb', 'bbbbbLLLLbbbbb', 'bbbbbbbbbbbbbb', 'BBBBBBBBBBBBBB'],
      { B: '#A8794A', b: '#C99A62', L: '#F4F0FA', k: '#5B3A1E' }),
    tcsign: TC('“Do not wake until spring” sign', 'Табличка «Не будить до весны»', 'Zīme “Nemodināt līdz pavasarim”', 14, 12,
      ['WWWWWWWWWWWWWW', 'WwwwwwwwwwwwwW', 'WwkkwkkkwkwkwW', 'WwwwwwwwwwwwwW', 'WwkkkwkkwkkkwW', 'WwwwwwwwwwwwwW', 'WWWWWWWWWWWWWW', '......WW......', '......WW......', '......WW......', '......WW......', '.nn..WWWW..n..'],
      { W: '#6B4423', w: '#E2C08A', k: '#2B2340', n: '#8B5A2B' }),
    tcnotes: TC('“Tragic Croak No. 9” sheet music', 'Ноты «Трагическое ква № 9»', 'Notis “Traģiskais kvaks Nr. 9”', 12, 15,
      ['kkkkkkkkkkkk', 'kwwwwwwwwwwk', 'kwlllllllllk', 'kwwnwwwnwwwk', 'kwlllllnlllk', 'kwwwwnwwwwwk', 'kwllllllllgk', 'kwwwwwwwwwwk', 'kkkkkkkkkkkk', '.....kk.....', '.....kk.....', '.....kk.....', '.....kk.....', '...kk..kk...', '..kk....kk..'],
      { k: '#2B2340', w: '#F7F1E4', l: '#9AA3B5', n: '#2B2340', g: '#6BAA4A' }),
    tcdiploma: TC('Unreadable diploma', 'Нечитаемый диплом', 'Nesalasāms diploms', 14, 10,
      ['FFFFFFFFFFFFFF', 'FppppppppppppF', 'Fpp~~~~~~~~ppF', 'FppppppppppppF', 'Fp~~~p~~~~~ppF', 'Fpp~~~~~p~~ppF', 'FppppppppppppF', 'Fppppppp~~~ppF', 'FpppppprrppppF', 'FFFFFFFFFFFFFF'],
      { F: '#C9962E', p: '#F2E3C4', '~': '#5B3A1E', r: '#C0392B' }),
    tcletter: TC('The Baron’s soggy love letter', 'Промокшее письмо барона', 'Barona samirkusī mīlestības vēstule', 12, 9,
      ['eeeeeeeeeeee', 'eEeeeeeeeeEe', 'eeEeeeeeeEee', 'eeeEeeeeEeee', 'eeeeErrEeeee', 'eeeeerreeeee', 'eeeeeeeeeeee', '.dd......d..', 'dddd....ddd.'],
      t => ({ e: '#F4E9D8', E: '#D8C9B0', r: '#C0392B', d: Math.sin(t / 500) > 0 ? '#7FB3E8' : '#9CC6EE' })),
    tcmonocle: TC('Sir Gourdon’s monocle', 'Монокль сэра Гордона', 'Sera Gourdona monoklis', 13, 10,
      ['....GGGG.....', '...GllllGg...', '...GlwllG.g..', '...GllllG..g.', '....GGGG...g.', '.vvvvvvvvvvv.', 'vVvvvvvvvvvVv', 'vvvvvvvvvvvvv', '.vvvvvvvvvvv.', '.V.........V.'],
      t => ({ G: '#E9C46A', g: '#E9C46A', l: '#BFE3F5', w: Math.sin(t / 450) > .6 ? '#FFFFFF' : '#BFE3F5', v: '#8E2F5A', V: '#E9C46A' })),
    tcredleaves: TC('Stack of red leaves', 'Стопка красных листьев', 'Sarkano lapu kaudzīte', 14, 9,
      ['......s.......', '....RRsRR.....', '..RRRRRRRRR...', '...rrrrrrrrr..', '..CCCCCCCCCC..', '.ccccccccccc..', '..MMMMMMMMMMM.', '.mmmmmmmmmmmm.', 'GGGGGGGGGGGGGG'],
      t => ({ s: '#5B3A1E', R: '#E0453A', r: '#C0392B', C: '#B8233A', c: '#9E1F33', M: '#D8435E', m: '#B83250', G: Math.sin(t / 600) > .3 ? '#8FB86A' : '#7FA85A' })),
    tcteacup: TC('Madame Teabite’s teacup', 'Чашка мадам Тибайт', 'Madāmas Teabaitas tasīte', 12, 10,
      ['...s..s.....', '....s..s....', '.WWWWWWWW...', '.WttttttWhh.', '.WWWWWWWW..h', '..WpWWpW..h.', '..WWWWWWhh..', '...WWWWW....', 'DDDDDDDDDDD.', '.ddddddddd..'],
      t => ({ s: Math.sin(t / 400) > 0 ? 'rgba(255,255,255,.75)' : null, W: '#F7F1E4', t: '#B5652B', h: '#F7F1E4', p: '#E58FA8', D: '#E9C46A', d: '#C9962E' })),
    tcgiftbag: TC('The bag with a surprise', 'Пакет с сюрпризом', 'Maiss ar pārsteigumu', 12, 10,
      ['....k..k....', '...k....k...', '..k......k..', 'PPPPPPPPPPPP', 'PppppppppppP', 'PpYYppppppPP', 'PpYeYepppppP', 'PppYYppppppP', 'PppppppppppP', 'PPPPPPPPPPPP'],
      t => ({ k: '#E9C46A', P: '#B04A8C', p: '#D06AAA', Y: '#F7D560', e: Math.sin(t / 700) > .85 ? '#F7D560' : '#2B2340' })),
    tcmilk: TC('Empty milk bottle', 'Пустая бутылка молока', 'Tukša piena pudele', 7, 11,
      ['..RRR..', '..BBB..', '..BwB..', '.BwwwB.', 'BwwwwwB', 'BwLLLwB', 'BwLkLwB', 'BwLLLwB', 'BwwwwwB', 'BWWWWWB', '.BBBBB.'],
      t => ({ R: '#4D8FD1', B: '#BFD8E8', w: '#EEF5FA', W: Math.sin(t / 500) > 0 ? '#FFFFFF' : '#F1F1EA', L: '#4D8FD1', k: '#FFFFFF' })),
    tcmacrame: TC('Shoelace macramé', 'Макраме из шнурков', 'Šņoru makramē', 14, 9,
      ['kkkkkkkkkkkkkk', '.r.o.y.g.b.p..', '.rro.yyg.bbp..', '..ro..yg..bp..', '.oRr.gYy.pBb..', '..rO..gy..pb..', '.r.o.y.g.b.p..', '.r.o.y.g.b.p..', '..r..o..y..g..'],
      { k: '#8B5A2B', r: '#D9433B', R: '#F07A6E', o: '#E8812E', O: '#F4A65E', y: '#E9C46A', Y: '#F7DE8E', g: '#6BAA4A', b: '#4D8FD1', B: '#7FB3E8', p: '#9B5DE5' }),
    tccarrot: TC('Bitten midnight carrot', 'Надкусанная полночная морковь', 'Nokosts pusnakts burkāns', 8, 9,
      ['...g.g..', '..ggg...', '...g....', '..OOO...', '..OoO...', '..OOO...', '..OoO...', '...OO...', '...O....'],
      t => ({ g: Math.sin(t / 450) > 0 ? '#4E9E5A' : '#5FB06A', O: '#F08A3B', o: '#D9702A' })),
    tccan: TC('Petunia’s copper watering can', 'Медная лейка Петунии', 'Petūnijas vara lejkanna', 14, 9,
      ['....hhhh......', '...h....h.....', '...CCCCCC.....', '..CccfccC....s', '..CcfFfcCssss.', '..CccfccCs.d..', '..CccccccC....', '..CCCCCCCC..d.', '..............'],
      t => ({ h: '#A0602E', C: '#B8733A', c: '#D58A4A', f: '#E58FA8', F: '#F7D560', s: '#A0602E', d: Math.sin(t / 300) > 0 ? '#7FB3E8' : null })),
    tcsalt: TC('Ghostina’s giant salt shaker', 'Огромная солонка Гостины', 'Gostīnas milzu sālstrauks', 11, 10,
      ['...SSSSS...', '..SkSkSkS..', '..SSSSSSS..', '.GGGGGGGGG.', '.GwwwwwwwG.', '.GwwwwwwwG.', '.GwwwwwwwG.', '.GwwwwwwwG.', '.GGGGGGGGG.', '..DDDDDDD..'],
      t => ({ S: '#C9D3DE', k: '#3A3550', G: Math.sin(t / 700) > .5 ? 'rgba(220,235,255,.9)' : 'rgba(200,220,245,.8)', w: '#FFFFFF', D: '#9AA3B5' })),
    tcclock: TC('Snailhollow square clock', 'Часы с площади Улиткина', 'Gliemežciema laukuma pulkstenis', 12, 11,
      ['...BBBBBB...', '..BwwwwwwB..', '.BwwwkwwwwB.', '.BwwwkwwwwB.', '.BwwwkwwwwB.', '.BwwwkkkwwB.', '.BwwwwwwwwB.', '..BwwwwwwB..', '...BBBBBB...', '.....BB.....', '...BBBBBB...'],
      t => ({ B: '#6B4423', w: '#F7F1E4', k: Math.sin(t / 400) > .4 ? '#C9F0FF' : '#2B2340' })),
    tcmetronome: TC('Ten-minute metronome', 'Метроном «Десять минут»', 'Metronoms “Desmit minūtes”', 11, 11,
      ['.....k.....', '....WkW....', '....WkW....', '...WWkWW...', '...WWkWW...', '..WWWkWWW..', '..WWWWWWW..', '.WWWwwwWWW.', '.WWWwwwWWW.', 'WWWWWWWWWWW', 'DDDDDDDDDDD'],
      { k: null, W: '#8B5A2B', w: '#E9C46A', D: '#5E3826' }),
    tcstarter: TC('Barnaby’s happy sourdough', 'Счастливая закваска Барнаби', 'Bārnabija laimīgais ieraugs', 8, 10,
      ['..LLLL..', '.LLLLLL.', '.gaaaag.', '.gdBddg.', '.gddddg.', '.gdedeg.', '.gddddg.', '.gdmmdg.', '.gddddg.', '..gggg..'],
      t => ({ L: '#C8743A', g: '#BFD9E6', a: '#EAF4F8', d: '#F3E3C3', B: Math.sin(t / 350) > 0 ? '#FFFFFF' : '#F3E3C3', e: '#2B2340', m: '#C0392B' })),
    tclabelbox: TC('Lost-and-found box', 'Коробка из бюро находок', 'Atradumu biroja kaste', 12, 8,
      ['LLLLLLLLLLLL', 'LLLLLLLLLLLL', '.BBBBBBBBBB.', '.BBwwwwwwBB.', '.BBwkkkkwBB.', '.BBwwwwwwBB.', '.BBBBBBBBBB.', '.DDDDDDDDDD.'],
      { L: '#B07A4A', B: '#C8955A', w: '#FFFFFF', k: '#2B2340', D: '#8B5A2B' }),
    tcrake: TC('Rake from the pond', 'Грабли из пруда', 'Grābeklis no dīķa', 7, 12,
      ['r.....l', '...h...', '...h..r', '...h...', 'l..h...', '...h...', '...h...', '...h...', '.mmmmm.', 'mmmmmmm', 'm.m.m.m', 'm.m.m.m'],
      t => ({ h: '#A0602E', m: '#7A8290', r: '#D9433B', l: Math.sin(t / 250) > 0 ? '#E9A23B' : '#C8743A' })),
    tcmirror: TC('Bandaged mirror', 'Зеркало в бинтах', 'Pārsiets spogulis', 9, 14,
      ['..FFFFF..', '.FsssssF.', 'FWWWWWWWF', 'FssssgssF', 'FsssRsssF', 'FssRRRssF', 'FsssRsssF', 'FWWWWWWWF', 'FsssssssF', '.FsssssF.', '..FFFFF..', '....F....', '....F....', '..FFFFF..'],
      t => ({ F: '#B8873A', s: '#BFD9E6', g: Math.sin(t / 400) > .5 ? '#FFFFFF' : '#BFD9E6', W: '#F7F7F2', R: '#D9433B' })),
    tcmap: TC('Rusty’s upside-down map', 'Перевёрнутая карта Расти', 'Rastija apgrieztā karte', 12, 9,
      ['pppppppppppp', 'pgggpppbbbpp', 'pggpprppbbpp', 'pppprrrppppp', 'ppbpprpppggp', 'pbbbpppppggp', 'ppppppkkkppp', 'pppppppkpppp', 'pppppppppppp'],
      { p: '#F2E3B8', g: '#6FA65A', b: '#7FB3E8', r: '#C0392B', k: '#2B2340' }),
    tcbuttonbox: TC('Tin of chatty buttons', 'Шкатулка болтливых пуговиц', 'Pļāpīgo pogu kārba', 10, 8,
      ['.aaabbbccc', '.aAabBbcCc', '.aaabbbccc', 'TTTTTTTTTT', 'TttttttttT', 'TtYttttYtT', 'TttttttttT', 'TTTTTTTTTT'],
      t => ({ a: '#E58FA8', A: Math.sin(t / 300) > .5 ? '#2B2340' : '#B85C78', b: '#7FB3E8', B: '#4A7FB0', c: '#E9C46A', C: '#B8902E', T: '#8E9AAB', t: '#B8C2CF', Y: '#F7D560' })),
    tcphone: TC('Candice’s silent phone', 'Молчащий телефон Кэндис', 'Kendisas klusais telefons', 11, 9,
      ['.RRsRRRRRR.', 'RR.......RR', '...PPPPP...', '..PPwwwPP..', '.PPwkwkwPP.', '.PPPwwwPPP.', 'PPPPPPPPPPP', 'PPPPPPPPPPP', '.....cc.c..'],
      t => ({ R: '#D9437A', s: Math.sin(t / 400) > .4 ? '#FFFFFF' : '#D9437A', P: '#F2A7C3', w: '#FFF3F7', k: '#2B2340', c: '#5E3826' })),
    tccandle: TC('Moss’s draught-proof candle', 'Свеча Мосса без сквозняков', 'Mosa svece bez caurvēja', 7, 12,
      ['...f...', '..fFf..', '..fFf..', '...k...', '.WWWWW.', '.WwWWW.', '.WwWWW.', '.WWWWd.', '.WWWWd.', '.WWWWW.', 'BBBBBBB', '.BBBBB.'],
      t => { const on = Math.sin(t / 900) > -.85; return { f: on ? '#F6A84A' : null, F: on ? '#FFD34D' : null, k: '#2B2340', W: '#EAD9B0', w: '#FFF3C4', d: '#D8C49A', B: '#8B5A2B' }; }, { glow: [3, 1] }),
    tcbook: TC('The Great Detective (with the last chapter)', '«Великий детектив» с последней главой', '“Lielais detektīvs” ar pēdējo nodaļu', 12, 9,
      ['pppppkkppppp', 'pLLLpkkpLLLp', 'pppppkkppppp', 'pLLLLkkpLLLp', 'pppppkkppppp', 'pLLLpkkpLLpp', 'pppppkkppppp', 'BBBBBBBBBBBB', '...ss.......'],
      { p: '#F7F1E4', L: '#B8AE98', k: '#8B5A2B', B: '#6B4423', s: '#C0392B' }),
    tcdecaf: TC('Decaf in a web', 'Декаф в паутине', 'Bezkofeīna kafija tīklā', 9, 11,
      ['w...w...w', '.w..w..w.', '..w.w.w..', '...www...', '....w....', '..LLLLL..', '.GGGGGGG.', '.GyyyyyG.', '.GykkkyG.', '.GyyyyyG.', '.GGGGGGG.'],
      t => ({ w: Math.sin(t / 500) > .6 ? '#FFFFFF' : '#C9D0DB', L: '#5E3826', G: '#6B4423', y: '#F7F1E4', k: '#2B2340' })),
    tcmossjar: TC('Jar of moss from Mossy Shell Lane', 'Банка мха с Моховой улицы', 'Sūnu burka no Sūnu ielas', 7, 10,
      ['.LLLLL.', '.LLLLL.', 'GgggggG', 'GgMgggG', 'GmMmMmG', 'GmmmmmG', 'GwwwwwG', 'GwkkkwG', 'GmmmmmG', '.GGGGG.'],
      t => ({ L: '#8B5A2B', G: '#9FC3D6', g: Math.sin(t / 500) > .6 ? '#FFFFFF' : '#D6E8F0', m: '#5E8C3A', M: '#7DB34A', w: '#F7F1E4', k: '#2B2340' })),
    tcgoldacorn: TC('The Golden Acorn', 'Золотой жёлудь', 'Zelta zīle', 7, 9,
      ['...b...', '.CCCCC.', 'CcCcCcC', '.YYYYY.', '.YyYYY.', '.YyYYY.', '.YYYYY.', '..YYY..', '...Y...'],
      t => ({ b: '#5E3826', C: '#8B5A2B', c: '#A0602E', Y: '#E9C46A', y: Math.sin(t / 350) > .5 ? '#FFFFFF' : '#F7D560' })),
    tchalfloaf: TC('Half of Barnaby’s loaf', 'Полкаравая Барнаби', 'Puse Bārnabija klaipa', 12, 8,
      ['..BBBBBW....', '.BbBbBBWW...', 'BBBBBBBWWW..', 'BbBBbBBWsW..', 'BBBBBBBWWW..', 'DDDDDDDDDDDD', '.D........D.', '.D........D.'],
      { B: '#C8803E', b: '#E0A86A', W: '#F4E4C1', s: '#D8C49A', D: '#8B5A2B' }),
    tcsleepsign: TC('“Do not wake until spring” sign', 'Табличка «Не будить до весны»', 'Zīme “Nemodināt līdz pavasarim”', 12, 9,
      ['.....kk.....', '....k..k....', 'BBBBBBBBBBBB', 'BwwwwwwwwwwB', 'BwkkkwkkwwwB', 'BwwwwwwwwzwB', 'BwkkwkkkkwwB', 'BwwwwwwwwwwB', 'BBBBBBBBBBBB'],
      t => ({ k: '#2B2340', B: '#8B5A2B', w: '#E9D8A6', z: Math.sin(t / 600) > 0 ? '#4A7FB0' : '#E9D8A6' })),
    tcwormletter: TC('Baron von Worms’s unsent letter', 'Неотправленное письмо барона', 'Barona nenosūtītā vēstule', 11, 8,
      ['EEEEEEEEEEE', 'eEEEEEEEEEe', 'EeERRERREeE', 'EEeRRRRReEE', 'EEEeRRReEEE', 'EEEEeReEEEE', 'EEEEEEEEEEE', 'dEEEdEEEEdE'],
      t => ({ E: '#F2E3B8', e: '#C9B37A', R: Math.sin(t / 300) > .3 ? '#E5484D' : '#B8423A', d: '#5E3826' })),
    tcflowerclock: TC('Flower clock showing thirteen', 'Цветочные часы на тринадцати', 'Puķu pulkstenis uz trīspadsmit', 11, 9,
      ['...GGGGG...', '.GGpGyGpGG.', 'GyGGGkGGGrG', 'GGGGGkGGGGG', 'GpGGGkkkGyG', 'GGGGGGGGGGG', 'GrGGGGGGGpG', '.GGyGpGrGG.', '...GGGGG...'],
      t => ({ G: '#4E9E5A', p: Math.sin(t / 450) > 0 ? '#D9A6F2' : '#9B5DE5', y: '#F7D560', r: '#E5484D', k: '#2B2340' })),
    tcpumpkinphoto: TC('The Pumpkin family photo', 'Семейное фото Тыквиных', 'Ķirbju ģimenes foto', 12, 9,
      ['FFFFFFFFFFFF', 'FbbbbbbbbbbF', 'FbgbbbgbbbbF', 'FoOobOoObzzF', 'FoOobOoObzzF', 'FbobbbobbzzF', 'FbbbbbbbbbbF', 'FwbwbbwbbwbF', 'FFFFFFFFFFFF'],
      { F: '#8B5A2B', b: '#F2E3B8', g: '#4E7A2E', o: '#E8812E', O: '#C9621C', z: '#6FA65A', w: '#FFFFFF' }),
    tcrecipe: TC('Three Moons Pie recipe, backwards', 'Рецепт «Пирога трёх лун» наоборот', '“Trīs mēnešu pīrāga” recepte otrādi', 10, 11,
      ['FFFFFFFFFF', 'FppppppppF', 'FpkkkpkkpF', 'FppppppppF', 'FpkpkkkkpF', 'FpkkkpkppF', 'FppppppppF', 'FpppoooppF', 'FppoOOOopF', 'FpppppppsF', 'FFFFFFFFFF'],
      t => ({ F: '#B8873A', p: '#F7F1E4', k: '#5E3826', o: '#E0A86A', O: '#C98A4B', s: Math.sin(t / 400) > .5 ? '#FFFFFF' : '#F7F1E4' })),
    tcchestnuts: TC('Charlie’s bag of chestnuts', 'Кулёк каштанов Чарли', 'Čārlija kastaņu tūta', 9, 10,
      ['.s...s...', '..s...s..', '.cCcCcCc.', 'cCcCcCcCc', 'PPPPPPPPP', '.PPpPPPP.', '.PPPPpP..', '..PPPPP..', '...PPP...', '....P....'],
      t => ({ s: Math.sin(t / 300) > 0 ? '#E8EEF2' : null, c: '#6B3A1F', C: '#8B5A2B', P: '#E9D8A6', p: '#C9B37A' })),
    tctrophy: TC('Autumn Ball cup without names', 'Кубок Осеннего бала без имён', 'Rudens balles kauss bez vārdiem', 11, 12,
      ['..SSSSSSS..', 'TTSsSSSSSTT', 'T.SsSSSSS.T', 'T.SSSSSSS.T', 'TT.SSSSS.TT', '...SSSSS...', '....SSS....', '.....S.....', '.....S.....', '...SSSSS...', '..BBBBBBB..', '..BBBBBBB..'],
      t => ({ S: '#D7DDE6', T: '#A8B0BC', s: Math.sin(t / 250) > .4 ? '#FFFFFF' : '#D7DDE6', B: '#5E3826' })),
    tcsyrup: TC('Bottle of maple syrup', 'Бутыль кленового сиропа', 'Kļavu sīrupa pudele', 7, 12,
      ['..CC...', '..GG...', '..GG...', '.GGGG..', 'GGGGGGh', 'GSSSSGh', 'GSwwSG.', 'GSwrSG.', 'GSSSSG.', 'GSSSSG.', 'GGGGGG.', '.d.....'],
      t => ({ C: '#8B5A2B', G: '#E8DCC8', S: '#C8741E', w: '#F7F1E4', r: '#C0392B', h: '#E8DCC8', d: Math.sin(t / 500) > .5 ? '#C8741E' : null })),
    tcduck: TC('Rubber duck from the puddle', 'Резиновая утка из лужи', 'Gumijas pīlīte no peļķes', 12, 9,
      ['...YYY......', '..YYkYY.....', '..YYYYYoo...', '...YYYY.....', '.YYYYYYYY.Y.', 'YYYYYYYYYYY.', '.YYYYYYYYY..', 'bbBbbbbBbbbb', '.bbbbBbbbbb.'],
      t => ({ Y: '#F6D04D', k: '#2B2340', o: '#F08A3B', b: '#7FB3E8', B: Math.sin(t / 400) > 0 ? '#BFE3F5' : '#7FB3E8' })),
    tctrumpet: TC('Bat fanfare', 'Фанфара летучих мышей', 'Sikspārņu fanfara', 12, 8,
      ['k.k.......YY', 'kkk......YYY', 'kwk....YYYYY', 'YYYYYYYYYYYY', '.......YYYYY', '...F.....YYY', '..FFF.....YY', '...F........'],
      t => ({ k: '#2B2340', w: '#F28AB2', Y: '#E9C46A', F: Math.sin(t / 300) > 0 ? '#F28AB2' : '#D9A6F2' })),
    tctag: TC('Tag “Found item No. 4512”', 'Бирка «Находка №4512»', 'Birka “Atradums Nr. 4512”', 10, 8,
      ['s.........', '.s........', '..TTTTTTTT', '.TkTTTTTTT', 'TTTTTTTTTT', '.TTkkkkkTT', '..TTTTTTTT', '...TTkkkTT'],
      t => ({ s: '#8B5A2B', T: '#F2E3B8', k: Math.sin(t / 600) > .8 ? '#C0392B' : '#5E3826' })),
    tcspool: TC('Spool of the tightest thread', 'Катушка самой тугой нитки', 'Visstingrākā diega spole', 8, 10,
      ['WWWWWWWW', '.gGgGgG.', '.GgGgGg.', '.gGgGgG.', '.GgGgGg.', '.gGgGgG.', '.GgGgGg.', '.gGgGgG.', 'WWWWWWWW', '......nn'],
      t => ({ W: '#C8A27A', g: '#8C93A6', G: Math.sin(t / 350) > .3 ? '#C9CEDA' : '#A8B0BC', n: '#8C93A6' })),
    tcleafmail: TC('Envelope with a maple leaf', 'Конверт с кленовым листом', 'Aploksne ar kļavas lapu', 11, 9,
      ['........r..', 'EEEEEErrrrE', 'eEEEEEErrEE', 'EeEEEErrrrE', 'EEeEEEEsEEE', 'EEEeEEEeEEE', 'EEEEeEeEEEE', 'EEEEEeEEEEE', 'EEEEEEEEEEE'],
      t => ({ E: '#F7F1E4', e: '#D8CCB4', r: Math.sin(t / 450) > .4 ? '#E8812E' : '#D9433B', s: '#8B5A2B' })),
    tcpaper: TC('Three stacks of drafts', 'Три стопки черновиков', 'Trīs melnrakstu kaudzes', 12, 12,
      ['...........q', '..........qq', 'pp..pp..pppp', 'Lp..pL..pLpp', 'pp..pp..pppp', 'pL..Lp..ppLp', 'pp..pp..pppp', 'Lp..pL..pLpp', 'pp..pp..pppp', 'pL..Lp..ppLp', 'pp..pp..pppp', 'BBBBBBBBBBBB'],
      t => ({ p: '#F7F1E4', L: '#B8AE98', B: '#8B5A2B', q: Math.sin(t / 500) > 0 ? '#4A4A6A' : null })),
    tcradiator: TC('Mittens’s hot radiator', 'Горячая батарея Миттенс', 'Mitensas karstais radiators', 13, 11,
      ['.h...h...h...', '..h...h...h..', 'RRRRRRRRRRRRR', 'RrRrRrRrRrRrR', 'RrRrRrRrRrRrR', 'RrRrRrRrRrRrR', 'RrRrRrRrRrRrR', 'RrRrRrRrRrRrR', 'RRRRRRRRRRRRR', '.F.........F.', '.F.........F.'],
      t => ({ h: Math.sin(t / 300) > 0 ? '#F6D2D2' : null, R: '#E5A07A', r: '#C9734E', F: '#8B5A2B' })),
    tchammock: TC('Rolled-up hammock with a note', 'Свёрнутый гамак с запиской', 'Saritināts šūpuļtīkls ar zīmīti', 14, 8,
      ['ss..........ss', '.s..........s.', '..GgGgGgGgGg..', '.GgGgGgGgGgGg.', '.gGgGgnnnGgGg.', '..GgGgnwnGgG..', '......nnn.....', '..f.f.f.f.f...'],
      t => ({ s: '#8B5A2B', G: '#4E9E5A', g: '#F2D27A', n: '#F7F1E4', w: Math.sin(t / 500) > .4 ? '#C0392B' : '#5E3826', f: '#F2D27A' })),
    tcraingauge: TC('Rain gauge “Under review”', 'Дождемер «На проверке»', 'Lietus mērītājs “Pārbaudē”', 9, 13,
      ['.d.......', 'GGGGGGG..', '.G...G...', '.G-..G...', '.G...GTTT', '.G-..GTkT', '.G...GTTT', '.GbbbG...', '.GbbbG...', '.GbbbG...', '.GGGGG...', '..WWW....', '.WWWWW...'],
      t => ({ d: Math.sin(t / 400) > .3 ? '#7FB3E8' : null, G: '#BFE3F5', '-': '#4A7FB0', b: '#7FB3E8', T: '#F2E3B8', k: '#5E3826', W: '#8B5A2B' })),
    tcsaucer: TC('Saucer with chalk fingers', 'Блюдце с меловыми пальцами', 'Apakštasīte ar krīta pirkstiem', 12, 6,
      ['..cccccccc..', '.cCCfCfCCCc.', 'cCCfCCCfCCCc', 'cCCCCfCCCCCc', '.cccccccccc.', '...dddddd...'],
      t => ({ c: '#7FB3E8', C: '#BFE3F5', f: Math.sin(t / 600) > -.5 ? '#FFFFFF' : '#E0DCEA', d: '#9AA8C0' })),
    tcbell: TC('Bell with a pillow', 'Колокол с подушкой', 'Zvans ar spilvenu', 11, 9,
      ['....kkk..z.', '...BBBBB...', '..BBBBBBB..', '..BpppppB..', '.BpPpPpPpB.', '.BpppppppB.', 'BBpPpPpPpBB', 'BBBBBBBBBBB', '....nnn....'],
      t => ({ k: '#5E3826', z: Math.sin(t / 500) > 0 ? '#4A4A6A' : null, B: '#D9A33B', p: '#F7F1E4', P: '#F28AB2', n: '#8B5A2B' })),
    tccookie: TC('Cookie with one bite and one star', 'Печенье с укусом и одной звездой', 'Cepums ar kodienu un vienu zvaigzni', 12, 8,
      ['..oooo......', '.oOkOo..YYYY', 'oOOOOO..YyYY', 'oOOkOOo.YYYY', 'oOOOOOo.YYYY', 'oOkOOOo.....', '.oOOOko.....', '..ooooo.....'],
      t => ({ o: '#B8742E', O: '#E0A86A', k: '#5E3826', Y: '#F7F1E4', y: Math.sin(t / 400) > 0 ? '#F2C94C' : '#C9A23A' })),
    tcnoodlebow: TC('Bowl of noodles tied in a bow', 'Миска лапши с бантом', 'Nūdeļu bļoda ar banti', 12, 8,
      ['s...yy.yy...', '.....yyy....', '...yy.y.yy..', 'BBBBBBBBBBBB', '.BRBRBRBRBB.', '..BBBBBBBB..', '...BBBBBB...', '....dddd....'],
      t => ({ s: Math.sin(t / 450) > 0 ? '#F4F0FA' : null, y: '#F2D27A', B: '#D9433B', R: '#F4F0FA', d: '#8B2F29' })),
    tcsockclock: TC('Alarm clock in a woolly sock', 'Будильник в шерстяном носке', 'Modinātājs vilnas zeķē', 9, 11,
      ['.k.....k.', 'kKk...kKk', '..sssss..', '.sSsSsSs.', '.ssfffss.', '.ssfhfss.', '.ssfffss.', '.sSsSsSs.', '..sssss..', '...ss....', '..sss....'],
      t => ({ k: '#C9C3D6', K: '#8E8AA0', s: '#B8423A', S: '#F2D27A', f: '#F7F1E4', h: Math.sin(t / 700) > 0 ? '#2B2340' : '#8E8AA0' })),
    tcsmoothie: TC('Strawberry smoothie with an umbrella', 'Клубничный смузи с зонтиком', 'Zemeņu smūtijs ar lietussargu', 8, 12,
      ['....uuu.', '...uUuUu', '.g....k.', 'WgPPPPkW', 'WPPpPPPW', 'WPPPPpPW', 'WPpPPPPW', '.WPPPPW.', '..WPPW..', '...WW...', '...WW...', '.WWWWWW.'],
      t => ({ u: '#F28AB2', U: '#FFFFFF', k: '#8B5A2B', g: '#4CC38A', W: '#E8F1F7', P: '#F28AB2', p: Math.sin(t / 500) > -.3 ? '#C0392B' : '#FFF3B0' })),
    tcpaintleaf: TC('Leaf repainted with a brush', 'Лист, перекрашенный кисточкой', 'Ar otu pārkrāsota lapa', 11, 10,
      ['.....g.....', '....RRG....', '...RRRGG...', '..RRRRGGG..', '.RRRRRGGGG.', 'RRRRRgGGGGG', '.RRRRgGGGG.', '..RRRgGGG..', '.....g...bB', '.....g..bb.'],
      t => ({ R: '#D9433B', G: '#6BB86A', g: '#8B5A2B', b: '#E9C46A', B: Math.sin(t / 400) > 0 ? '#D9433B' : '#F08A3B' })),
    tcbigspoon: TC('Spoon with the Noodleford crest', 'Ложка с гербом Нудлфорда', 'Karote ar Nūdelfordas ģerboni', 6, 13,
      ['.SSSS.', 'SsppsS', 'SppppS', 'SsppsS', '.SSSS.', '..SS..', '..SS..', '..cc..', '..SS..', '..SS..', '..SS..', '..SS..', '..SS..'],
      t => ({ S: '#C9C3D6', s: '#F4F0FA', p: '#E0A86A', c: Math.sin(t / 500) > .5 ? '#FFF3B0' : '#D9A33B' })),
    tcwebcup: TC('Cup in a sock on a web', 'Чашка в носке на паутине', 'Krūzīte zeķē tīmeklī', 12, 10,
      ['w....w....w.', '.w...w...w..', '..w..w..w...', '...wwwww....', 'wwwwwSwwwww.', '...wSSSw....', '..wsCCCsw...', '.w.sCCCs.w..', 'w..sssss..w.', '....sss.....'],
      t => ({ w: '#C9C3D6', S: Math.sin(t / 450) > 0 ? '#F4F0FA' : null, s: '#9B5DE5', C: '#6B4226' })),
    tcredcarpet: TC('Rolled-up red carpet', 'Свёрнутая красная дорожка', 'Saritināts sarkanais paklājs', 14, 6,
      ['..RRRRRRRRRRR.', '.RrRRRRRRRRRoR', 'RrrRRRRRRRRoyo', '.RrRRRRRRRRRoR', '..RRRRRRRRRRR.', '..t.t.t.t.....'],
      t => ({ R: '#C0392B', r: '#8E2F29', o: '#E9C46A', y: '#F2D27A', t: Math.sin(t / 300) > 0 ? '#E8F1F7' : null })),
  });
  { const box = FURN.tcmilkabox.d; FURN.tcmilkabox.d = (p, t) => { box(p, t); const x = Math.sin(t / 300) > 0 ? 9 : 11; p(10, 1, 1, 2, '#C8743A'); p(Math.min(x, 10), 0, Math.abs(x - 10) + 1, 1, '#C8743A'); p(x, 0, 1, 1, '#F4F0FA'); }; } // хвост Милки машет
  { const mt = FURN.tcmetronome.d; FURN.tcmetronome.d = (p, t) => { mt(p, t); const s = Math.sin(t / 380); for (let y = 0; y < 7; y++) p(5 + Math.round(s * (7 - y) / 2.5), y, 1, 1, y === 2 ? '#C0392B' : '#2B2340'); }; } // маятник метронома качается
  Object.assign(FURN, {
    // Хеллоуин
    cauldron: { n: N('Bubbling cauldron', 'Котёл с зельем', 'Burbuļojošs katls'), w: 14, h: 12, top: null, d: (p, t) => { p(1, 3, 12, 2, '#4CE3A0'); p(0, 4, 14, 7, '#2B2340'); p(1, 5, 12, 5, '#3A3150'); p(2, 11, 2, 1, '#2B2340'); p(10, 11, 2, 1, '#2B2340'); for (let i = 0; i < 3; i++) { const by = 2 - ((t / 300 + i) % 4); p(3 + i * 4, Math.round(by), 2, 2, '#4CE3A0'); } } },
    jacklantern: { n: N('Jack-o’-lantern', 'Тыква-фонарь', 'Ķirbja lukturis'), w: 11, h: 10, top: 0, glow: [5, 5], d: (p, t) => spr(p, ['.....g.....', '..oOoOoOo..', '.oOoOoOoOo.', 'oOyyOoOyyOo', 'oOyyOoOyyOo', 'oOoOoyoOoOo', 'oyyyyyyyyyo', '.oOyOyOyOo.', '..ooooooo..'], { o: '#E8812E', O: '#C9621C', g: '#4E7A2E', y: Math.sin(t / 200) > -.3 ? '#FFD34D' : '#F6A84A' }) },
    broom: { n: N('Witch broom', 'Метла ведьмы', 'Raganas slota'), w: 7, h: 24, top: null, d: S(['......n', '.....n.', '.....n.', '....n..', '....n..', '...n...', '...n...', '..n....', '..n....', '..n....', '.rrr...', '.yyy...', 'yyyyy..', 'yyyyy..', 'yyyyy..', 'yy.yy..', 'y.y.y..'], { n: '#7A4A28', r: '#9B5DE5', y: '#D9A33B' }) },
    candybowl: { n: N('Candy bowl', 'Миска конфет', 'Konfekšu bļoda'), w: 12, h: 7, top: null, d: S(['.r.y.p.g....', 'ryypgrypy...', 'kkkkkkkkkk..', '.kkkkkkkk...', '..kkkkkk....'], { r: '#E5484D', y: '#F6D04D', p: '#F28AB2', g: '#4CC38A', k: '#E8812E' }) },
    skullcandle: { n: N('Skull candle', 'Свеча-череп', 'Galvaskausa svece'), w: 7, h: 11, top: null, d: (p, t) => { p(3, 0, 1, 2, Math.sin(t / 120) > 0 ? '#F6C445' : '#F08A3B'); p(3, 2, 1, 1, '#2B2340'); spr((a, b, w, h, c) => p(a, 3 + b, w, h, c), ['.www.', 'wwwww', 'wkwkw', 'wwwww', '.wkw.', '.www.', 'mmmmm', 'mmmmm'], { w: '#F4F0EA', k: '#2B2340', m: '#5B3E8C' }); } },
    blackcat: { n: N('Black cat statue', 'Чёрный кот', 'Melnais kaķis'), w: 10, h: 12, top: null, d: (p, t) => spr(p, ['k...k.....', 'kk.kk.....', 'kkkkk.....', 'kykyk.....', 'kkkkk....k', '.kkk....k.', 'kkkkk..k..', 'kkkkkkk...', 'kkkkkk....', 'kkkkkk....', 'k.kk.k....', 'k.kk.k....'], { k: '#1A1528', y: Math.floor(t / 2500) % 6 ? '#F6D04D' : '#1A1528' }) },
    tombstone: { n: N('Tiny tombstone', 'Надгробие', 'Kapakmentiņš'), w: 10, h: 12, top: 0, d: p => { p(2, 0, 6, 1, '#9A96A8'); p(1, 1, 8, 10, '#9A96A8'); p(2, 3, 6, 1, '#6E6A78'); p(3, 5, 4, 1, '#6E6A78'); p(0, 11, 10, 1, '#4E9E5A'); } },
    // Новый год
    fireplace: { n: N('Fireplace', 'Камин', 'Kamīns'), w: 36, h: 30, top: 0, glow: [18, 22], d: (p, t) => { p(0, 0, 36, 4, '#7A4A30'); p(2, 4, 32, 26, '#B5543C'); for (let y = 6; y < 30; y += 4) p(2, y, 32, 1, '#9A4632'); p(9, 12, 18, 18, '#2B1A1A'); const f = Math.floor(t / 140) % 3; p(12, 26, 12, 3, '#6B4329'); p(13 + f, 20, 3, 6, '#F08A3B'); p(17, 18 - f, 3, 8, '#F6C445'); p(21 - f, 21, 3, 5, '#E5484D'); p(16, 23, 4, 3, '#FFE08A'); } },
    gingerhouse: { n: N('Gingerbread house', 'Пряничный домик', 'Piparkūku mājiņa'), w: 14, h: 12, top: null, d: S(['......w.......', '.....wdw......', '....wdddw.....', '...wdddddw....', '..wwwwwwwww...', '..dddddddd...', '..drdddgdd...', '..dddyyddd...', '..dddyydrd...', '..dddyyddd...', '.wwwwwwwwww..'], { w: '#FFFFFF', d: '#C68A55', r: '#E5484D', g: '#4CC38A', y: '#8C5A30' }) },
    snowglobe: { n: N('Snow globe', 'Снежный шар', 'Sniega bumba'), w: 9, h: 11, top: null, d: (p, t) => { p(2, 0, 5, 1, '#BFE3F5'); p(1, 1, 7, 7, 'rgba(190,227,245,.7)'); p(0, 3, 9, 3, 'rgba(190,227,245,.7)'); p(3, 4, 3, 3, '#2E7D4F'); for (let i = 0; i < 3; i++) p(1 + ((i * 3 + Math.floor(t / 300)) % 7), 1 + ((i * 2 + Math.floor(t / 200)) % 6), 1, 1, '#FFFFFF'); p(1, 8, 7, 3, '#C9463D'); } },
    rockinghorse: { n: N('Rocking horse', 'Лошадка-качалка', 'Šūpuļzirdziņš'), w: 18, h: 15, top: null, d: (p, t) => { const o = Math.round(Math.sin(t / 500)); spr((a, b, w, h, c) => p(a, b + o * 0, w, h, c), ['..hh..............', '.hwwh.............', 'hwkwh.............', '.wwwwwwwwwwww.....', '..wwwwwwwwwwwwr...', '...wwwwwwwwwww.r..', '...w.w....w.w.....', '...w.w....w.w.....', '...w.w....w.w.....', 'nnnnnnnnnnnnnnnn..', '.nn..........nn...'], { h: '#E5484D', w: '#F4EBDD', k: '#2B2340', r: '#E5484D', n: '#B5543C' }); } },
    sled: { n: N('Wooden sled', 'Санки', 'Ragavas'), w: 22, h: 7, top: 1, d: p => { p(2, 0, 18, 3, '#B5543C'); p(3, 1, 16, 1, '#C9704E'); p(4, 3, 2, 2, '#7A4A28'); p(16, 3, 2, 2, '#7A4A28'); p(0, 5, 22, 1, '#C9CDD6'); p(21, 3, 1, 2, '#C9CDD6'); } },
    cookies: { n: N('Milk and cookies', 'Молоко и печенье', 'Piens un cepumi'), w: 12, h: 8, top: null, d: S(['ww..........', 'ww..........', 'ww..........', 'ww.cccc.....', 'wwccdcccc...', 'ww.ccccdc...', 'wwkkkkkkkkk.', '.kkkkkkkkk..'], { w: '#FFFFFF', c: '#C68A55', d: '#5B3A1E', k: '#E6E6EE' }) },
    // Весна
    vase: { n: N('Flower vase', 'Ваза с цветами', 'Vāze ar ziediem'), w: 10, h: 15, top: null, d: S(['.r..y.p...', 'rrryyypp..', '.r.gyg.p..', '..g.g.g...', '...ggg....', '...ggg....', '..bbbbb...', '.bbBbbbb..', '.bbbbbbb..', '.bBbbbbb..', '.bbbbbbb..', '..bbbbb...'], { r: '#E5484D', y: '#F6D04D', p: '#F28AB2', g: '#5E9E45', b: '#7FB3E8', B: '#BFE3F5' }) },
    tulips: { n: N('Tulips', 'Тюльпаны', 'Tulpes'), w: 12, h: 13, top: null, d: S(['.r.p.y.....', '.r.p.y.....', '.g.g.g.....', 'gg.g.gg....', '.g.g.g.....', '..ggg......', 'tttttttt...', '.tTttttt...', '.tttttt....', '..tttt.....'], { r: '#E5484D', p: '#F28AB2', y: '#F6D04D', g: '#5E9E45', t: '#C66B4A', T: '#D9825F' }) },
    wateringcan: { n: N('Watering can', 'Лейка', 'Lejkanna'), w: 13, h: 9, top: null, d: S(['....ggg......', '...g...g.....', '.gggggggg...g', '.gggggggg..g.', 'ggGggggggg g.', '.gggggggggg..', '.gggggggg....', '.gggggggg....'], { g: '#4CC38A', G: '#8EE0B4' }) },
    eggbasket: { n: N('Easter eggs', 'Пасхальные яйца', 'Lieldienu olas'), w: 13, h: 9, top: null, d: S(['..p..b..y....', '.ppp.bb.yy...', '.pPp.bBbyYy..', 'kkkkkkkkkkkk.', '.kKkKkKkKkk..', '.kkkkkkkkkk..', '..kkkkkkkk...'], { p: '#F7B6C8', P: '#FFFFFF', b: '#BFE3F5', B: '#4A7BD8', y: '#FBEFB0', Y: '#F08A3B', k: '#B98236', K: '#8C5E22' }) },
    birdhouse: { n: N('Birdhouse', 'Скворечник', 'Putnu būrītis'), w: 12, h: 18, top: null, d: S(['.....rr.....', '....rrrr....', '...rrrrrr...', '..rrrrrrrr..', '...wwwwww...', '...wwkkww...', '...wwkkww...', '...wwwwww...', '...wnwwww...', '...wwwwww...', '.....nn.....', '.....nn.....', '.....nn.....', '.....nn.....', '....nnnn....', '...nnnnnn...'], { r: '#E5484D', w: '#F4EBDD', k: '#2B2340', n: '#7A4A28' }) },
    // Лето
    beachchair: { n: N('Deck chair', 'Шезлонг', 'Atpūtas krēsls'), w: 20, h: 14, top: 6, sit: true, d: p => { for (let k = 0; k < 8; k++) p(2 + k, k, 3, 1, k % 2 ? '#FFFFFF' : '#4A7BD8'); p(8, 6, 11, 2, '#4A7BD8'); p(8, 8, 11, 1, '#FFFFFF'); p(3, 8, 1, 6, '#C9955E'); p(17, 8, 1, 6, '#C9955E'); p(9, 9, 1, 5, '#C9955E'); } },
    palm: { n: N('Palm in a pot', 'Пальма', 'Palma'), w: 18, h: 30, top: null, d: S(['....gg....gg......', '..ggggg..gggg.....', '.gg...gggg..gg....', 'g......gg.....g...', '.....gGGg.........', '....g.nn.g........', '...g..nn..g.......', '......nn..........', '......nn..........', '.......nn.........', '.......nn.........', '.......nn.........', '......nn..........', '......nn..........', '......nn..........', '.......nn.........', '.......nn.........', '......nn..........', '......nn..........', '.....tttttt.......', '....tttttttt......', '....tTtttttt......', '....tttttttt......', '.....tttttt.......', '.....tttttt.......'], { g: '#3E8E5A', G: '#2E6B47', n: '#A0673C', t: '#C66B4A', T: '#D9825F' }) },
    surfboard: { n: N('Surfboard', 'Доска для сёрфинга', 'Sērfa dēlis'), w: 7, h: 28, top: null, d: p => { for (let y = 0; y < 28; y++) { const w = y < 4 ? 2 + y : y > 24 ? 2 + (27 - y) : 6; p(Math.round((7 - w) / 2), y, w, 1, y % 6 < 3 ? '#F6D04D' : '#4CC38A'); } p(3, 2, 1, 24, '#E5484D'); } },
    watermelon: { n: N('Watermelon', 'Арбуз', 'Arbūzs'), w: 12, h: 7, top: null, d: S(['rrkrrrkrrr..', 'rrrrkrrrrr..', '.rrrrrrkr...', '.wwwwwwww...', '..gggggg....'], { r: '#E5484D', k: '#2B2340', w: '#E9F7DD', g: '#3E8E5A' }) },
    flamingo: { n: N('Pool flamingo', 'Надувной фламинго', 'Piepūšamais flamingo'), w: 16, h: 15, top: 6, d: S(['..pp............', '.pppk...........', '..pp............', '..pp............', '..pp............', '..pp............', '..ppp...........', '...pppppppppp...', '..pppppppppppp..', '.pppppPpppppppp.', '.ppppppppppppppp', '..ppppppppppppp.', '...ppppppppppp..'], { p: '#F7A8C4', P: '#FFFFFF', k: '#2B2340' }) },
    lemonade: { n: N('Lemonade', 'Лимонад', 'Limonāde'), w: 7, h: 10, top: null, d: S(['....g..', '...g...', 'wwwwww.', 'wyyyyw.', 'wyYyyww', 'wyyyywW', 'wyyyyw.', 'wyyyyw.', 'wwwwww.'], { g: '#4CC38A', w: 'rgba(230,245,255,.9)', W: 'rgba(230,245,255,.9)', y: '#FBE36A', Y: '#FFFFFF' }) },
    fan: { n: N('Electric fan', 'Вентилятор', 'Ventilators'), w: 11, h: 17, top: null, d: (p, t) => { p(1, 0, 9, 9, '#C9CDD6'); p(2, 1, 7, 7, '#E6EEF7'); const f = Math.floor(t / 80) % 2; p(5, 1 + f, 1, 7 - 2 * f, '#7FB3E8'); p(2 + f, 4, 7 - 2 * f, 1, '#7FB3E8'); p(5, 4, 1, 1, '#4A7BD8'); p(5, 9, 1, 6, '#9A96A8'); p(2, 15, 7, 2, '#9A96A8'); } },
    // Осень
    applebasket: { n: N('Basket of apples', 'Корзина яблок', 'Ābolu grozs'), w: 13, h: 10, top: null, d: S(['..rr.gg.rr...', '.rrrrggrrrr..', 'rrRrrrrrRrrr.', 'kkkkkkkkkkkk.', '.kKkKkKkKkk..', '.kkkkkkkkkk..', '..kkkkkkkk...'], { r: '#E5484D', R: '#FF8A8A', g: '#4CC38A', k: '#B98236', K: '#8C5E22' }) },
    mushstool: { n: N('Mushroom stool', 'Табурет-гриб', 'Sēņu ķeblītis'), w: 14, h: 12, top: 0, d: S(['..rrrrrrrrrr..', '.rrwrrrrrwrrr.', 'rrrrrrwrrrrrrr', '.rrrrrrrrrrrr.', '.....ssss.....', '.....ssss.....', '.....ssss.....', '.....ssss.....', '....ssssss....'], { r: '#E5484D', w: '#FFFFFF', s: '#F4EBDD' }) },
    umbrella: { n: N('Umbrella stand', 'Зонт в подставке', 'Lietussargs'), w: 8, h: 20, top: null, d: S(['...n....', '...b....', '..bbb...', '..bbb...', '.bbbbb..', '.bbbbb..', '.bbbbb..', '..bbb...', '..bbb...', '...n....', '...n....', '.kkkkk..', '.kkkkk..', '.kKkkk..', '.kkkkk..', '.kkkkk..'], { n: '#2B2340', b: '#4A7BD8', k: '#7A4A30', K: '#9A6A48' }) },
    boots: { n: N('Rain boots', 'Резиновые сапоги', 'Gumijas zābaki'), w: 11, h: 8, top: null, d: S(['yy...yy....', 'yy...yy....', 'yy...yy....', 'yy...yy....', 'yyyy.yyyy..', 'yyyy.yyyy..', 'kkkk.kkkk..'], { y: '#F6C445', k: '#2B2340' }) },
    teaset: { n: N('Tea set', 'Чайный сервиз', 'Tējas servīze'), w: 16, h: 8, top: null, d: S(['....bbb.........', '...bbbbb........', '..bwbbbbbb..ww..', '.bbbbbbbbb.wbbw.', 'bbbbbbbbbb.wbbwb', '.bbbbbbbb...ww..', 'kkkkkkkkkkkkkkkk'], { b: '#F7B6C8', w: '#FFFFFF', k: '#E6E6EE' }) },
    // Художник
    easel: { n: N('Easel with a painting', 'Мольберт', 'Molberts'), w: 18, h: 32, top: null, d: p => { p(8, 0, 2, 32, '#A0673C'); p(2, 10, 2, 22, '#A0673C'); p(14, 10, 2, 22, '#A0673C'); p(1, 4, 16, 14, '#F4EBDD'); p(2, 5, 14, 6, '#9FD3F5'); p(2, 11, 14, 6, '#6FBF6A'); p(10, 6, 3, 3, '#F6D04D'); p(4, 9, 4, 3, '#E5484D'); p(0, 18, 18, 2, '#7A4A28'); } },
    painttubes: { n: N('Paint tubes', 'Тюбики краски', 'Krāsu tūbiņas'), w: 12, h: 4, top: null, d: S(['rrrk.bbbk...', 'rrrrkbbbbk..', '.yyyk.gggk..', '.yyyykggggk.'], { r: '#E5484D', b: '#4A7BD8', y: '#F6D04D', g: '#4CC38A', k: '#C9CDD6' }) },
    brushjar: { n: N('Jar of brushes', 'Банка с кистями', 'Otu burka'), w: 8, h: 12, top: null, d: S(['.r..b...', '.n.yn...', '.n.n.n..', '.n.n.n..', '..nnn...', 'wwwwww..', 'wbbbbw..', 'wbbbbw..', 'wbbbbw..', 'wwwwww..'], { r: '#E5484D', b: '#7FB3E8', y: '#F6D04D', n: '#A0673C', w: 'rgba(230,245,255,.8)' }) },
    claypot: { n: N('Clay pot', 'Глиняный горшок', 'Māla pods'), w: 9, h: 9, top: null, d: S(['..ttttt..', '...ttt...', '..ttttt..', '.ttTtttt.', 'tttttttt.', 'ttwwwwtt.', '.tttttt..', '..tttt...'], { t: '#C66B4A', T: '#D9825F', w: '#F4EBDD' }) },
    bust: { n: N('Marble bust', 'Мраморный бюст', 'Marmora krūšutēls'), w: 10, h: 15, top: null, d: S(['...www....', '..wwwww...', '..wkwkw...', '..wwwww...', '..wwgww...', '...www....', '.wwwwwww..', 'wwwwwwwww.', 'wwwwwwwww.', '...ggg....', '...ggg....', '..ggggg...', '.ggggggg..'], { w: '#EEE9F2', k: '#9A96A8', g: '#C9C1D6' }) },
    // Игры
    arcade: { n: N('Arcade machine', 'Игровой автомат', 'Spēļu automāts'), w: 16, h: 34, top: 0, d: (p, t) => { p(1, 0, 14, 34, '#5B3E8C'); p(2, 1, 12, 4, '#F28AB2'); p(3, 7, 10, 9, '#0F0F2D'); const x = 4 + Math.floor(t / 150) % 8; p(x, 11, 1, 1, '#F6D04D'); p(4, 14, 8, 1, '#4CE3A0'); p(11 - Math.floor(t / 300) % 6, 9, 1, 1, '#E5484D'); p(0, 17, 16, 4, '#4E2F7A'); p(4, 18, 1, 2, '#2B2340'); p(9, 18, 2, 2, '#E5484D'); p(12, 18, 2, 2, '#4A7BD8'); p(2, 22, 12, 12, '#4E2F7A'); p(6, 26, 4, 3, '#2B2340'); } },
    computer: { n: N('Computer', 'Компьютер', 'Dators'), w: 16, h: 13, top: null, d: (p, t) => { p(1, 0, 14, 10, '#2B2340'); p(2, 1, 12, 7, '#10213A'); p(3, 2, Math.floor(t / 200) % 9 + 1, 1, '#4CE3A0'); p(3, 4, 6, 1, '#7FB3E8'); p(3, 6, 4, 1, '#F28AB2'); p(7, 10, 2, 1, '#2B2340'); p(0, 11, 16, 2, '#C9CDD6'); } },
    gamingchair: { n: N('Gaming chair', 'Игровое кресло', 'Spēļu krēsls'), w: 16, h: 26, top: 13, sit: true, d: p => { p(3, 0, 10, 14, '#2B2340'); p(5, 1, 6, 12, '#E5484D'); p(1, 12, 14, 4, '#2B2340'); p(3, 13, 10, 2, '#E5484D'); p(7, 16, 2, 6, '#5B5670'); p(2, 22, 12, 2, '#5B5670'); p(2, 24, 2, 2, '#2B2340'); p(12, 24, 2, 2, '#2B2340'); } },
    handheld: { n: N('Handheld console', 'Карманная консоль', 'Kabatas konsole'), w: 6, h: 9, top: null, d: S(['gggggg', 'gddddg', 'gdkkdg', 'gdkkdg', 'gddddg', 'gggggg', 'gkggrg', 'gggggg', 'gggggg'], { g: '#C9CDD6', d: '#2B2340', k: '#8EE0B4', r: '#E5484D' }) },
    // Музыка
    guitar: { n: N('Guitar', 'Гитара', 'Ģitāra'), w: 9, h: 26, top: null, d: S(['...nn....', '...nn....', '....n....', '....n....', '....n....', '....n....', '....n....', '....n....', '....n....', '...ooo...', '..ooooo..', '..ookoo..', '...ooo...', '..ooooo..', '.oookooo.', 'ooooooooo', 'ooooooooo', 'oooonoooo', 'ooooooooo', '.ooooooo.', '..ooooo..'], { n: '#5B3A1E', o: '#E8812E', k: '#2B2340' }) },
    piano: { n: N('Upright piano', 'Пианино', 'Klavieres'), w: 36, h: 26, top: 0, d: p => { p(0, 0, 36, 13, '#2B2340'); p(1, 1, 34, 2, '#3A3150'); p(0, 13, 36, 3, '#3A3150'); for (let x = 1; x < 35; x += 2) p(x, 13, 1, 3, '#FFFFFF'); for (let x = 2; x < 34; x += 4) p(x, 13, 1, 2, '#1A1528'); p(2, 16, 32, 8, '#2B2340'); p(3, 24, 2, 2, '#1A1528'); p(31, 24, 2, 2, '#1A1528'); p(14, 4, 8, 6, '#F4EBDD'); } },
    drum: { n: N('Drum', 'Барабан', 'Bungas'), w: 14, h: 11, top: 0, d: p => { p(0, 0, 14, 2, '#F4EBDD'); p(0, 2, 14, 8, '#E5484D'); for (let x = 1; x < 14; x += 3) p(x, 3, 1, 6, '#F6D04D'); p(0, 9, 14, 2, '#F4EBDD'); p(12, -4, 1, 4, '#A0673C'); } },
    speaker: { n: N('Speaker', 'Колонка', 'Skaļrunis'), w: 9, h: 15, top: 0, d: (p, t) => { const k = Math.sin(t / 120) > 0 ? 1 : 0; p(0, 0, 9, 15, '#2B2340'); p(2, 2, 5, 4, '#5B5670'); p(3, 3, 3, 2, '#1A1528'); p(1 - k, 8 - k, 7 + 2 * k, 6 + k, '#5B5670'); p(3, 10, 3, 2, '#1A1528'); } },
    recordplayer: { n: N('Record player', 'Проигрыватель', 'Atskaņotājs'), w: 16, h: 7, top: null, d: (p, t) => { p(0, 3, 16, 4, '#A0673C'); p(1, 2, 11, 1, '#1A1528'); p(2, 1, 9, 1, '#1A1528'); p(6, 1, 1, 1, Math.floor(t / 200) % 2 ? '#E5484D' : '#1A1528'); p(13, 0, 1, 3, '#C9CDD6'); p(11, 0, 2, 1, '#C9CDD6'); } },
    // Уютный дом
    bed: { n: N('Cozy bed', 'Уютная кровать', 'Mājīga gulta'), w: 46, h: 20, top: 8, sit: true, d: p => { p(0, 0, 4, 20, '#7A4A30'); p(42, 4, 4, 16, '#7A4A30'); p(4, 6, 38, 8, '#F4EBDD'); p(5, 3, 10, 6, '#FFFFFF'); p(14, 7, 28, 7, '#7FB3E8'); for (let x = 16; x < 42; x += 4) p(x, 8, 2, 5, '#9FCDEB'); p(4, 14, 38, 3, '#7A4A30'); p(5, 17, 2, 3, '#5E3826'); p(39, 17, 2, 3, '#5E3826'); } },
    nightstand: { n: N('Nightstand', 'Тумбочка', 'Naktsgaldiņš'), w: 12, h: 13, top: 0, d: p => { p(0, 0, 12, 2, '#A0673C'); p(1, 2, 10, 9, '#8C5A3A'); p(2, 5, 8, 1, '#6B4329'); p(5, 3, 2, 1, '#E9C46A'); p(5, 7, 2, 1, '#E9C46A'); p(1, 11, 2, 2, '#6B4329'); p(9, 11, 2, 2, '#6B4329'); } },
    cat: { n: N('House cat', 'Домашний котик', 'Mājas kaķītis'), w: 12, h: 9, top: null, d: (p, t) => { const tail = Math.floor(t / 400) % 2; spr(p, ['o...o.......', 'oo.oo.......', 'ooooo.......', 'okoko.......', 'ooooo....' + (tail ? 'o' : '.') + '..', '.ooooooooo' + (tail ? '.' : 'o') + '.', '.oooooooooo.', '.oo.....oo..', '.oo.....oo..'], { o: '#F08A3B', k: '#2B2340' }); } },
    catbed: { n: N('Cat bed', 'Лежанка для кота', 'Kaķa guļvieta'), w: 14, h: 6, top: 1, d: S(['p............p', 'pppppppppppppp', 'pwwwwwwwwwwwwp', 'pppppppppppppp', '.pppppppppppp.'], { p: '#B79CF2', w: '#F4F0FA' }) },
    grandclock: { n: N('Grandfather clock', 'Напольные часы', 'Grīdas pulkstenis'), w: 12, h: 38, top: 0, d: (p, t) => { p(0, 0, 12, 38, '#6B4329'); p(2, 2, 8, 8, '#F4EBDD'); p(5, 3, 1, 3, '#2B2340'); p(5, 5, 3, 1, '#2B2340'); p(3, 13, 6, 18, '#3E281C'); const sw = Math.round(Math.sin(t / 400) * 2); p(5 + sw, 14, 1, 10, '#E9C46A'); p(4 + sw, 24, 3, 3, '#E9C46A'); p(1, 34, 10, 4, '#5E3826'); } },
    pouf: { n: N('Knitted pouf', 'Вязаный пуф', 'Adīts pufs'), w: 14, h: 9, top: 0, sit: true, d: p => { p(1, 0, 12, 1, '#E6D3B0'); p(0, 1, 14, 7, '#E6D3B0'); for (let x = 1; x < 14; x += 3) p(x, 1, 1, 7, '#CDB78F'); p(1, 8, 12, 1, '#CDB78F'); } },
    // Кухня и кафе
    fridge: { n: N('Fridge', 'Холодильник', 'Ledusskapis'), w: 18, h: 36, top: 0, d: p => { p(0, 0, 18, 36, '#F4F0FA'); p(0, 12, 18, 1, '#C9CDD6'); p(14, 4, 2, 6, '#C9CDD6'); p(14, 16, 2, 10, '#C9CDD6'); p(3, 18, 4, 4, '#F28AB2'); p(8, 20, 3, 3, '#F6D04D'); p(2, 35, 14, 1, '#C9CDD6'); } },
    stove: { n: N('Stove with a pot', 'Плита с кастрюлей', 'Plīts ar katlu'), w: 22, h: 26, top: null, d: (p, t) => { p(0, 6, 22, 20, '#E6E6EE'); p(0, 6, 22, 2, '#2B2340'); p(3, 11, 16, 9, '#2B2340'); p(5, 13, 12, 5, '#F08A3B'); p(4, 0, 12, 6, '#C9463D'); p(3, 1, 14, 1, '#A8382F'); if (Math.sin(t / 300) > 0) p(8, -3, 1, 2, '#FFFFFF'); else p(11, -4, 1, 2, '#FFFFFF'); } },
    coffeemachine: { n: N('Coffee machine', 'Кофемашина', 'Kafijas automāts'), w: 11, h: 13, top: 0, d: p => { p(0, 0, 11, 13, '#2B2340'); p(1, 1, 9, 3, '#5B5670'); p(7, 2, 2, 1, '#4CC38A'); p(3, 5, 5, 2, '#9A96A8'); p(3, 9, 5, 4, '#F4EBDD'); p(4, 9, 3, 1, '#8B5A3C'); } },
    donuts: { n: N('Box of donuts', 'Коробка пончиков', 'Virtuļu kaste'), w: 14, h: 6, top: 0, d: S(['kkkkkkkkkkkkkk', 'kpppkcccky yykk', 'kpkpkckckyky ', 'kpppkccckyyykk', 'kkkkkkkkkkkkkk'], { k: '#F4D9A8', p: '#F28AB2', c: '#8B5A3C', y: '#F6D04D' }) },
    pizzabox: { n: N('Pizza box', 'Коробка пиццы', 'Picas kaste'), w: 14, h: 4, top: 0, d: S(['bbbbbbbbbbbbbb', 'bbbbbrbbbbbbbb', 'bbbbbbbbbbbbbb', 'BBBBBBBBBBBBBB'], { b: '#E6D3B0', B: '#CDB78F', r: '#E5484D' }) },
    breadbasket: { n: N('Bread basket', 'Корзинка с хлебом', 'Maizes grozs'), w: 12, h: 7, top: null, d: S(['.ccc..bbb...', 'ccccc.bbbbb.', 'kkkkkkkkkkk.', '.kKkKkKkKk..', '.kkkkkkkkk..'], { c: '#D9A45B', b: '#B9824A', k: '#B98236', K: '#8C5E22' }) },
    // Космос
    telescope: { n: N('Telescope', 'Телескоп', 'Teleskops'), w: 16, h: 20, top: null, d: S(['.............w', '...........www', '.........wwww.', '.......wwwwb..', '.....wwwwb....', '....wwwb......', '.....kk.......', '.....kk.......', '....k..k......', '...k....k.....', '..k......k....', '.k........k...', 'k..........k..'], { w: '#4A7BD8', b: '#2B3A6B', k: '#5B5670' }) },
    rocket: { n: N('Toy rocket', 'Игрушечная ракета', 'Rotaļu raķete'), w: 9, h: 19, top: null, d: S(['....r....', '...rrr...', '...www...', '..wwwww..', '..wbbbw..', '..wbbbw..', '..wwwww..', '..wwwww..', '..wwrww..', '.rwwwwwr.', 'rrwwwwwrr', 'r.wwwww.r', '...ooo...', '...yoy...', '....y....'], { r: '#E5484D', w: '#F4F0FA', b: '#7FB3E8', o: '#F08A3B', y: '#F6D04D' }) },
    moonlamp: { n: N('Moon lamp', 'Лампа-луна', 'Mēness lampa'), w: 10, h: 12, top: null, glow: [5, 4], d: S(['..mmmm....', '.mmMmmm...', 'mmmmmmMm..', 'mMmmmmmm..', 'mmmmmMmm..', '.mmmmmm...', '..mmmm....', '....k.....', '....k.....', '..kkkkk...'], { m: '#F6E7B0', M: '#E9D79A', k: '#5B5670' }) },
    helmet: { n: N('Space helmet', 'Шлем космонавта', 'Kosmonauta ķivere'), w: 11, h: 10, top: null, d: S(['...wwwww...', '..wwwwwww..', '.wwbbbbbww.', '.wbbbbBbbw.', '.wbbbbbbbw.', '.wwbbbbbww.', '..wwwwwww..', '.ggggggggg.', '.ggggggggg.'], { w: '#F4F0FA', b: '#2B3A6B', B: '#7FB3E8', g: '#C9CDD6' }) },
    // Магия
    potionshelf: { n: N('Potion shelf', 'Полка с зельями', 'Dziru plaukts'), w: 22, h: 18, top: 0, d: (p, t) => { p(0, 0, 22, 18, '#5E3826'); p(1, 1, 20, 16, '#3E281C'); p(1, 8, 20, 1, '#5E3826'); const c = ['#4CE3A0', '#F28AB2', '#B79CF2', '#F6D04D', '#7FB3E8']; for (let i = 0; i < 5; i++) { p(2 + i * 4, 3, 2, 5, c[i]); p(2 + i * 4, 2, 2, 1, '#C9CDD6'); } for (let i = 0; i < 4; i++) { p(3 + i * 5, 11, 3, 6, c[(i + 2) % 5]); if (Math.sin(t / 300 + i) > .5) p(4 + i * 5, 12, 1, 1, '#FFFFFF'); } } },
    spellbook: { n: N('Spell book', 'Книга заклинаний', 'Burvestību grāmata'), w: 12, h: 6, top: null, glow: [6, 1], d: (p, t) => { p(0, 2, 12, 4, '#5B3E8C'); p(1, 1, 5, 4, '#F4EBDD'); p(6, 1, 5, 4, '#F4EBDD'); p(5, 1, 2, 5, '#3E2A63'); p(2, 2, 3, 1, '#9B5DE5'); p(7, 3, 3, 1, '#9B5DE5'); if (Math.sin(t / 250) > 0) p(5, -2, 1, 1, '#F6D04D'); else p(7, -3, 1, 1, '#4CE3A0'); } },
    orb: { n: N('Magic orb', 'Волшебный шар', 'Burvju lode'), w: 9, h: 11, top: null, glow: [4, 4], d: (p, t) => { const c = Math.floor(t / 400) % 3, col = ['#B79CF2', '#7FB3E8', '#4CE3A0'][c]; p(2, 0, 5, 1, col); p(1, 1, 7, 6, col); p(0, 2, 9, 4, col); p(2, 2, 2, 2, '#FFFFFF'); p(2, 7, 5, 1, col); p(1, 8, 7, 3, '#E9C46A'); } },
    // Пираты
    chest: { n: N('Treasure chest', 'Сундук с сокровищами', 'Dārgumu lāde'), w: 16, h: 12, top: 0, d: (p, t) => { p(1, 0, 14, 4, '#8C5A30'); p(0, 3, 16, 9, '#A0673C'); p(0, 3, 16, 1, '#6B4329'); p(2, 0, 1, 12, '#E9C46A'); p(13, 0, 1, 12, '#E9C46A'); p(7, 4, 2, 3, '#E9C46A'); p(3, -2, 10, 2, '#F6D04D'); if (Math.sin(t / 400) > .7) p(10, -3, 1, 1, '#FFFFFF'); } },
    barrel: { n: N('Barrel', 'Бочка', 'Muca'), w: 12, h: 15, top: 0, d: p => { p(1, 0, 10, 15, '#A0673C'); p(0, 2, 12, 11, '#A0673C'); for (let x = 2; x < 12; x += 3) p(x, 0, 1, 15, '#8C5A30'); p(0, 3, 12, 1, '#5B5670'); p(0, 11, 12, 1, '#5B5670'); } },
    shipbottle: { n: N('Ship in a bottle', 'Корабль в бутылке', 'Kuģis pudelē'), w: 14, h: 7, top: null, d: S(['.bbbbbbbbbbb..', 'bbbbbwbbbbbbcc', 'bbbbwwwbbbbbcc', 'bbbnnnnnbbbbcc', '.bbbbbbbbbbb..', '..kk......kk..'], { b: 'rgba(160,210,240,.6)', w: '#FFFFFF', n: '#7A4A28', c: '#A0673C', k: '#7A4A28' }) },
    // Полли
    pollyplush: { n: N('Polly plush toy', 'Плюшевая Полли', 'Plīša Pollija'), w: 11, h: 11, top: null, d: S(['...ddd.....', '..dbbbd....', '.dbbwbd....', '.dbbkbdoo..', '.dbbbbbd...', 'dbbsbbbbd..', 'dbbsbbbbd..', 'dbbbbbbbd..', '.ddddddd...', '..o...o....'], { d: '#1a1528', b: '#9C9EDB', s: '#7F81BF', w: '#ffffff', k: '#1a1528', o: '#f2a73b' }) },
    seedbag: { n: N('Bag of seeds', 'Мешок семечек', 'Sēklu maiss'), w: 11, h: 11, top: null, d: S(['..k...k....', '...kkk.....', '..nnnnn....', '.nnnnnnn...', 'nnnnnnnnn..', 'nnnyyynnn..', 'nnyynyynn..', 'nnnyyynnn..', 'nnnnnnnnn..', '.nnnnnnn...', '.y.y..y....'], { k: '#7A4A28', n: '#D9C29A', y: '#F6D04D' }) },
    fountain: { n: N('Mini fountain', 'Мини-фонтан', 'Mini strūklaka'), w: 20, h: 15, top: null, d: (p, t) => { const k = Math.floor(t / 200) % 2; p(9, 0 + k, 2, 6, 'rgba(127,179,232,.9)'); p(7, 2, 1, 3 + k, 'rgba(127,179,232,.8)'); p(12, 2, 1, 3 + (1 - k), 'rgba(127,179,232,.8)'); p(8, 5, 4, 2, '#C9CDD6'); p(9, 7, 2, 3, '#C9CDD6'); p(0, 10, 20, 2, '#C9CDD6'); p(1, 12, 18, 3, '#9A96A8'); p(2, 10, 16, 1, '#7FB3E8'); } },
  });
  Object.assign(DECO, {
    ghost: { n: N('Floating ghost', 'Привидение', 'Spociņš'), w: 9, h: 10, d: (p, t) => { const o = Math.round(Math.sin(t / 400) * 2); spr((a, b, w, h, c) => p(a, b + o, w, h, c), ['..wwwww..', '.wwwwwww.', 'wwkwwwkww', 'wwwwwwwww', 'wwwkkkwww', 'wwwwwwwww', 'wwwwwwwww', 'w.ww.ww.w'], { w: '#F4F0FA', k: '#2B2340' }); } },
    web: { n: N('Spider web', 'Паутина', 'Zirnekļa tīkls'), w: 14, h: 14, d: (p, t) => { const w = 'rgba(240,240,250,.75)'; for (let k = 0; k < 14; k++) { p(k, 0, 1, 1, w); p(0, k, 1, 1, w); p(k, k, 1, 1, w); } for (const r of [4, 8, 12]) for (let k = 0; k <= r; k++) p(k, r - k, 1, 1, w); const sy = 6 + Math.round(Math.sin(t / 700) * 3); p(9, 0, 1, sy, w); p(8, sy, 3, 2, '#1A1528'); } },
    batgarland: { n: N('Bat garland', 'Гирлянда с мышами', 'Sikspārņu virtene'), w: 32, h: 7, d: p => { for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 2), 1, 1, '#E8812E'); for (let k = 0; k < 5; k++) { const x = 2 + k * 6, y = Math.round(Math.sin((x + 2) / 32 * Math.PI) * 2) + 1; spr((a, b, w, h, c) => p(x + a, y + b, w, h, c), ['k...k', 'kk.kk', '.kkk.', '..k..'], { k: '#1A1528' }); } } },
    stocking: { n: N('Christmas stocking', 'Рождественский носок', 'Ziemassvētku zeķe'), w: 8, h: 12, d: S(['wwwww...', 'wwwww...', '.rrrr...', '.rrrr...', '.rgrr...', '.rrrr...', '.rrrr...', '.rrrrrr.', '.rrrrrrr', '..rrrrr.'], { w: '#FFFFFF', r: '#E5484D', g: '#4CC38A' }) },
    wreath: { n: N('Christmas wreath', 'Рождественский венок', 'Ziemassvētku vainags'), w: 13, h: 13, d: S(['....ggggg....', '..gggrgggg...', '.ggg.....gg..', '.gr.......gg.', 'gg.........g.', 'gg.........r.', 'gr.........g.', 'gg.........g.', '.gg.......gg.', '.gggrrrrggg..', '..ggrrrrgg...', '....r..r.....'], { g: '#2E7D4F', r: '#E5484D' }) },
    mistletoe: { n: N('Mistletoe', 'Омела', 'Āmulis'), w: 9, h: 9, d: S(['....r....', '....r....', '...rrr...', '..g.r.g..', '.ggg.ggg.', '..gwgwg..', '...www...'], { r: '#E5484D', g: '#4E9E5A', w: '#F4F0EA' }) },
    butterfly: { n: N('Butterfly', 'Бабочка', 'Tauriņš'), w: 9, h: 8, d: (p, t) => { const f = Math.floor(t / 180) % 2; spr(p, f ? ['pp...pp..', 'ppp.ppp..', 'pyppppyp.', '.pp.pp...', '.pp.pp...'] : ['.........', '.pp.pp...', 'ppppppp..', '.pp.pp...', '.........'], { p: '#F28AB2', y: '#F6D04D' }); p(4, 1, 1, 4, '#2B2340'); } },
    sunwall: { n: N('Paper sun', 'Бумажное солнце', 'Papīra saule'), w: 13, h: 13, d: S(['......y......', '..y...y...y..', '...yyyyyyy...', '...yoooooy...', '..yookokooy..', 'yyyoooooooyyy', '..yookkkooy..', '...yoooooy...', '...yyyyyyy...', '..y...y...y..', '......y......'], { y: '#F6D04D', o: '#F6A84A', k: '#7A4A28' }) },
    neon: { n: N('Neon “COO” sign', 'Неоновая надпись «КУР»', 'Neona uzraksts «KŪ»'), w: 22, h: 8, d: (p, t) => { const on = Math.sin(t / 600) > -.85, c = on ? '#F28AB2' : '#5B3E5B'; spr((a, b, w, h, cc) => p(1 + a, 1 + b, w, h, cc), ['ccc..ccc..ccc', 'c....c.c..c.c', 'c....c.c..c.c', 'c....c.c..c.c', 'ccc..ccc..ccc'], { c }); if (on) { p(0, 0, 22, 8, 'rgba(242,138,178,.12)'); } } },
    anchor: { n: N('Anchor', 'Якорь', 'Enkurs'), w: 9, h: 12, d: S(['...nnn...', '...n.n...', '...nnn...', '.nnnnnnn.', '....n....', '....n....', '....n....', 'n...n...n', 'nn..n..nn', '.nnnnnnn.', '...nnn...'], { n: '#5B5670' }) },
    hangplant: { n: N('Hanging plant', 'Подвесной цветок', 'Piekarams augs'), w: 12, h: 18, d: S(['.....n......', '.....n......', '....n.n.....', '...n...n....', '...ttttt....', '..ttTtttt...', '..ttttttt...', '.gg.g.g.gg..', 'g..g..g..g..', 'g..g.....g..', '...g.....g..', '...g........', '...g........'], { n: '#C9A35B', t: '#C66B4A', T: '#D9825F', g: '#4E9E5A' }) },
    mirror: { n: N('Round mirror', 'Круглое зеркало', 'Apaļš spogulis'), w: 12, h: 14, d: S(['...gggggg...', '..gbbbbbbg..', '.gbwbbbbbbg.', '.gbbwbbbbbg.', 'gbbbbbbbbbbg', 'gbbbbbbbbbbg', 'gbbbbbbbbbbg', 'gbbbbbbbbbbg', '.gbbbbbbbbg.', '.gbbbbbbbbg.', '..gbbbbbbg..', '...gggggg...'], { g: '#E9C46A', b: '#BFE3F5', w: '#FFFFFF' }) },
    poster: { n: N('Polly poster', 'Постер с Полли', 'Pollijas plakāts'), w: 16, h: 21, d: p => { p(0, 0, 16, 21, '#F4EBDD'); p(1, 1, 14, 14, '#2B1A51'); spr((a, b, w, h, c) => p(3 + a, 3 + b, w, h, c), ['...ddd....', '..dbbbd...', '.dbbwbd...', '.dbbkbdoo.', '.dbbbbbd..', 'dbbsbbbbd.', 'dbbbbbbbd.', '.ddddddd..', '..o..o....'], { d: '#9C9EDB', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b' }); p(2, 17, 12, 1, '#D85A30'); p(4, 19, 8, 1, '#2B1A51'); } },
    palettewall: { n: N('Wall palette', 'Палитра на стене', 'Palete pie sienas'), w: 14, h: 10, d: S(['...wwwwww....', '.wwrwwbwwww..', 'wwwwwwwwwyww.', 'wgww..wwwwww.', 'wwww..wwpwww.', '.wwwwwwwwww..', '..wwwwwww....'], { w: '#E6D3B0', r: '#E5484D', b: '#4A7BD8', y: '#F6D04D', g: '#4CC38A', p: '#F28AB2' }) },
    papermoon: { n: N('Paper moon', 'Бумажная луна', 'Papīra mēness'), w: 10, h: 12, d: S(['....n.....', '....n.....', '..mmm.....', '.mmm......', 'mmm.......', 'mmm.......', 'mmm.......', '.mmm......', '..mmmm....', '....mm....'], { n: '#C9C9D6', m: '#F6E7B0' }) },
    stars: { n: N('Star garland', 'Гирлянда звёзд', 'Zvaigžņu virtene'), w: 32, h: 7, d: (p, t) => { for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 2), 1, 1, '#C9C9D6'); for (let k = 0; k < 6; k++) { const x = 2 + k * 5, y = Math.round(Math.sin((x + 1) / 32 * Math.PI) * 2) + 1, c = Math.sin(t / 300 + k) > 0 ? '#F6D04D' : '#E9C46A'; p(x + 1, y, 1, 3, c); p(x, y + 1, 3, 1, c); } } },
    discoball: { n: N('Disco ball', 'Диско-шар', 'Diskobumba'), w: 11, h: 14, d: (p, t) => { p(5, 0, 1, 3, '#C9C9D6'); for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) { const dx = x - 4, dy = y - 4; if (dx * dx + dy * dy <= 18) p(1 + x, 3 + y, 1, 1, (x + y + Math.floor(t / 150)) % 4 === 0 ? '#FFFFFF' : (x + y) % 2 ? '#C9CDD6' : '#9A96A8'); } } },
  });



  Object.assign(DECO, {
    icicle: { n: N('Icicle ornament', 'Сосулька', 'Lāsteka'), w: 3, h: 10, d: (p, t) => { p(1, 0, 1, 1, '#C9C9D6'); p(0, 1, 3, 3, '#BFE3F5'); p(0, 4, 3, 2, '#D8EEF9'); p(1, 6, 1, 3, '#BFE3F5'); p(1, 9, 1, 1, '#FFFFFF'); if (Math.sin(t / 400) > .6) p(0, 2, 1, 1, '#FFFFFF'); } },
    pinecone: { n: N('Pinecone ornament', 'Шишка', 'Čiekurs'), w: 5, h: 8, d: S(['..r..', '.bnb.', 'nbnbn', 'bnbnb', 'nbnbn', '.nbn.', '..n..'], { r: '#E5484D', n: '#8C5A30', b: '#B9824A' }) },
    angel: { n: N('Little angel', 'Ангелочек', 'Eņģelītis'), w: 9, h: 10, d: S(['...yyy...', '...sss...', 'ww.sss.ww', 'wwwwwwwww', '.wwwwwww.', '..wwwww..', '..wwwww..', '.wwwwwww.', '.wwwwwww.'], { y: '#F6D04D', s: '#F5C9A8', w: '#FFFFFF' }) },
    gingerorn: { n: N('Gingerbread ornament', 'Пряничный человечек', 'Piparkūku vīriņš'), w: 7, h: 9, d: S(['..ddd..', '..dwd..', 'ddddddd', '.dwdwd.', '..ddd..', '..dwd..', '.dd.dd.', '.d...d.'], { d: '#B9824A', w: '#FFFFFF' }) },
    birdorn: { n: N('Polly ornament', 'Игрушка-Полли', 'Pollijas rotaļlieta'), w: 8, h: 9, d: S(['...g....', '..ddd...', '.dbwbd..', '.dbkbdo.', 'dbbbbd..', 'dbsbbd..', '.dddd...', '..o.o...'], { g: '#E9C46A', d: '#1a1528', b: '#9C9EDB', s: '#7F81BF', w: '#fff', k: '#1a1528', o: '#f2a73b' }) },
    beads: { n: N('Bead garland', 'Бусы на ёлку', 'Krelles eglītei'), w: 30, h: 6, d: p => { const c = ['#E5484D', '#E9C46A', '#FFFFFF']; for (let x = 0; x < 30; x += 2) p(x, Math.round(Math.sin(x / 30 * Math.PI) * 4), 2, 2, c[(x / 2) % 3]); } },
    staromini: { n: N('Little star ornament', 'Звёздочка на ёлку', 'Zvaigznīte eglītei'), w: 5, h: 6, d: (p, t) => { const c = Math.sin(t / 300) > 0 ? '#F6D04D' : '#E9C46A'; spr(p, ['..c..', '..c..', 'ccccc', '.ccc.', '.c.c.', 'c...c'], { c }); } },
    candyorn: { n: N('Candy ornament', 'Конфетка на ёлку', 'Konfekte eglītei'), w: 9, h: 4, d: S(['p.rwrw.p.', 'pprwrwrpp', 'p.wrwr.p.'], { p: '#F28AB2', r: '#E5484D', w: '#FFFFFF' }) },
    snowmanorn: { n: N('Snowman ornament', 'Снеговичок на ёлку', 'Sniegavīriņš eglītei'), w: 6, h: 9, d: S(['.kkk..', '.www..', '.wkw..', '.wwwo.', 'wwwwww', 'wwkwww', 'wwwwww', '.wwww.'], { k: '#2B2340', w: '#FFFFFF', o: '#F08A3B' }) },
  });


  // ---------- разнообразие: новые вещи с вариантами и перекраска старых (10.10.2026) ----------
  const RUG_C = [['#C9463D', '#F4EBDD'], ['#4A7BD8', '#BFE3F5'], ['#4CC38A', '#F6D04D'], ['#9B5DE5', '#F28AB2'], ['#E9A93B', '#7A4A28'], ['#2B2340', '#E9C46A']];
  const CUSH_C = [['#E5484D', '#F28AB2'], ['#4A7BD8', '#FFFFFF'], ['#F6D04D', '#F08A3B'], ['#4CC38A', '#FFFFFF'], ['#B79CF2', '#F6D04D'], ['#F4F0FA', '#E5484D']];
  const CNAME = [['red', 'красный', 'sarkans'], ['blue', 'синий', 'zils'], ['yellow', 'жёлтый', 'dzeltens'], ['green', 'зелёный', 'zaļš'], ['lilac', 'сиреневый', 'ceriņu'], ['white', 'белый', 'balts']];
  const named = (base, list) => i => base.map((b, l) => `${b} (${list[i][l]})`);
  Object.assign(FURN, {
    rug: { n: named(['Rug', 'Коврик', 'Paklājiņš'], [['striped', 'полосатый', 'strīpains'], ['blue', 'синий', 'zils'], ['sunny', 'солнечный', 'saulains'], ['magic', 'волшебный', 'burvju'], ['honey', 'медовый', 'medus'], ['royal', 'королевский', 'karalisks']]), v: 6, w: 44, h: 3, top: 0,
      d: (p, t, i) => { const [a, b] = RUG_C[i]; p(1, 0, 42, 3, a); p(0, 1, 44, 1, a); for (let x = 3; x < 41; x += 4) p(x, 1, 2, 1, b); p(-1, 1, 1, 1, b); p(44, 1, 1, 1, b); } },
    cushion: { n: named(['Cushion', 'Подушка', 'Spilvens'], CNAME), v: 6, w: 9, h: 5, top: 0, sit: true,
      d: (p, t, i) => { const [a, b] = CUSH_C[i]; p(1, 0, 7, 5, a); p(0, 1, 9, 3, a); p(4, 2, 1, 1, b); p(2, 1, 1, 1, b); p(6, 3, 1, 1, b); } },
    teddy: { n: N('Teddy bear', 'Плюшевый мишка', 'Plīša lācītis'), w: 10, h: 11, top: null, d: S(['bb....bb..', 'bbbbbbbb..', '.bkbbkb...', '.bbBBbb...', '..bbbb....', '.bbbbbbb..', 'bbbBBbbbb.', '.bbBBbbb..', '.bb..bb...'], { b: '#B9824A', B: '#D9A66B', k: '#2B2340' }) },
    bunny: { n: N('Plush bunny', 'Плюшевый зайчик', 'Plīša zaķītis'), w: 9, h: 13, top: null, d: S(['.w...w...', '.wp..wp..', '.wp..wp..', '.wwwww...', 'wwkwkww..', 'wwwpwww..', '.wwwww...', 'wwwwwww..', 'wwwwwww..', '.ww.ww...'], { w: '#F4F0FA', p: '#F7B6C8', k: '#2B2340' }) },
    whale: { n: N('Plush whale', 'Плюшевый кит', 'Plīša valis'), w: 16, h: 9, top: null, d: S(['............bb..', '..bbbbbbb..bb...', '.bbbbbbbbbbb....', 'bbkbbbbbbbbb....', 'bbbbbbbbbbbb....', 'wwwwwwwwwbb.....', '.wwwwwwww.......'], { b: '#4A7BD8', w: '#BFE3F5', k: '#2B2340' }) },
    fern: { n: N('Fern', 'Папоротник', 'Paparde'), w: 16, h: 18, top: null, d: S(['......g.........', '..g...g..g......', '...g.ggg.g......', 'g..gggggg...g...', '.gggggGgggggg...', '..ggGGGGGggg....', 'gggggGGgggggg...', '...ggggggg......', '....pppppp......', '....pPpppp......', '....pppppp......', '.....pppp.......'], { g: '#5E9E45', G: '#3E8257', p: '#C66B4A', P: '#D9825F' }) },
    snakeplant: { n: N('Snake plant', 'Сансевиерия', 'Sansevjēra'), w: 10, h: 18, top: null, d: S(['..g...g...', '..g..gg...', '.gg..gg.g.', '.gG.gGg.g.', '.gG.gGggg.', '.gGggGgGg.', '.gGgGGgGg.', '.gGgGgGGg.', '.gggGggGg.', '.wwwwwwww.', '.wWwwwwww.', '.wwwwwwww.', '..wwwwww..'], { g: '#3E8257', G: '#C9D86A', w: '#F4F0FA', W: '#FFFFFF' }) },
    succulents: { n: N('Succulents', 'Суккуленты', 'Sukulenti'), w: 14, h: 7, top: null, d: S(['.gg..pp..gg...', 'gGgg.pPpgGgg..', '.gg..pp..gg...', 'tttttttttttt..', 'tTtttttttttt..', '.tttttttttt...'], { g: '#8DB596', G: '#B5D6BC', p: '#F7B6C8', P: '#F28AB2', t: '#E9C46A', T: '#F7DC8B' }) },
    orchid: { n: N('Orchid', 'Орхидея', 'Orhideja'), w: 10, h: 18, top: null, d: S(['.pp.......', 'pyp.pp....', '.pp.pyp...', '..n..pp...', '..n.n.pp..', '..n.n.pyp.', '...nn..pp.', '....n.....', '....n.....', '..gggg....', '.gg..gg...', '.wwwwww...', '.wwwwww...', '..wwww....'], { p: '#E58CC8', y: '#F6D04D', n: '#5E9E45', g: '#3E8E5A', w: '#F4F0FA' }) },
  });
  const PIC = [['Mountain picture', 'Картина с горами', 'Glezna ar kalniem'], ['Cat portrait', 'Портрет кота', 'Kaķa portrets'], ['Flowers picture', 'Картина с цветами', 'Glezna ar ziediem'], ['Abstract art', 'Абстракция', 'Abstrakcija'], ['Sea picture', 'Картина с морем', 'Glezna ar jūru']];
  Object.assign(DECO, {
    picture: { n: i => PIC[i], v: 5, w: 18, h: 14, d: (p, t, i) => { p(0, 0, 18, 14, '#7A4A30'); p(1, 1, 16, 12, '#C9955E'); p(2, 2, 14, 10, '#F4EBDD');
      if (i === 0) { p(2, 2, 14, 10, '#BFE3F5'); for (let k = 0; k < 6; k++) p(4 + k, 11 - k, 12 - 2 * k, 1, k > 3 ? '#FFFFFF' : '#7A8CA8'); p(2, 11, 14, 1, '#6FBF6A'); }
      else if (i === 1) { p(2, 2, 14, 10, '#F7C6DA'); spr((a, b, w, h, c) => p(5 + a, 3 + b, w, h, c), ['o...o...', 'oo.oo...', 'ooooo...', 'okoko...', 'ooooo...', '.ooo....', 'ooooo...', 'ooooo...'], { o: '#F08A3B', k: '#2B2340' }); }
      else if (i === 2) { p(2, 2, 14, 10, '#FFF4E0'); [[4, 4, '#E5484D'], [8, 3, '#F6D04D'], [12, 5, '#9B5DE5']].forEach(([x, y, c]) => { p(x, y, 3, 3, c); p(x + 1, y + 3, 1, 5, '#5E9E45'); }); p(4, 10, 10, 2, '#7FB3E8'); }
      else if (i === 3) { p(2, 2, 7, 6, '#E5484D'); p(9, 2, 7, 10, '#F6D04D'); p(2, 8, 7, 4, '#4A7BD8'); p(8, 2, 1, 10, '#2B2340'); p(2, 7, 7, 1, '#2B2340'); }
      else { p(2, 2, 14, 5, '#BFE3F5'); p(2, 7, 14, 5, '#3F8FC9'); p(11, 3, 3, 3, '#FFE08A'); p(4, 8, 4, 1, '#8EC8EC'); p(9, 10, 5, 1, '#8EC8EC'); p(5, 5, 3, 2, '#FFFFFF'); } } },
  });
  // перекраска: у вещи появляются варианты цвета (значения «armchair», «armchair:1», «armchair:2», «armchair:3» — первый остаётся как был)
  // ---------- темы «🧛 Вампирское», «🪦 Кладбищенское», «👩‍🍳 Поварское» (по одной легендарной в каждой) ----------
  Object.assign(WALL, {
    gothic: [['Gothic wallpaper', 'Готические обои', 'Gotiskās tapetes'], tileWall('#3A1424', ['..r..', '.rrr.', 'r.r.r', '..r..', '.r.r.'], { r: '#6B2340' }, 10, 10, 5)],
    mossbrick: [['Mossy old stones', 'Старая кладка с мхом', 'Sūnaina mūra siena'], g => { R(g, 0, 0, RW, FY, '#5E5A68'); for (let y = 0; y < FY; y += 7) for (let x = ((y / 7) % 2) * 8; x < RW; x += 16) { R(g, x, y, 15, 6, (x + y) % 3 ? '#77738A' : '#6C6880'); } const r = rngOf(31); for (let i = 0; i < 70; i++) R(g, r() * RW, r() * FY, 2 + r() * 3, 1, r() < .5 ? '#5E8A4E' : '#4C7340'); }],
    kitchentiles: [['Kitchen tiles', 'Кухонный кафель', 'Virtuves flīzes'], tileWall('#F4F7FB', ['bbbbbbbb', 'b......b', 'b..bb..b', 'b..bb..b', 'b......b', 'bbbbbbbb'], { b: '#9CC3E6' }, 8, 6, 0)],
  });
  Object.assign(FLOOR, {
    castlerug: [['Castle red carpet', 'Красная дорожка замка', 'Pils sarkanais celiņš'], g => { R(g, 0, FY, RW, RH - FY, '#4E4A58'); for (let y = FY; y < RH; y += 9) for (let x = ((y - FY) / 9 % 2) * 7; x < RW; x += 14) R(g, x, y, 13, 8, '#5E5A68'); R(g, 30, FY + 3, 132, RH - FY - 3, '#8E1F2E'); R(g, 30, FY + 3, 132, 1, '#E9C46A'); R(g, 30, FY + 5, 132, 1, '#6B1422'); for (let x = 34; x < 160; x += 8) R(g, x, FY + 14, 3, 3, '#A8323F'); }],
    gravesoil: [['Graveyard soil', 'Кладбищенская земля', 'Kapsētas zeme'], g => { R(g, 0, FY, RW, RH - FY, '#3E3226'); const r = rngOf(33); for (let i = 0; i < 120; i++) R(g, r() * RW, FY + r() * (RH - FY), 1, 1, '#4D4033'); for (let i = 0; i < 40; i++) { const x = r() * RW, y = FY + 2 + r() * (RH - FY - 4); R(g, x, y, 1, 2, '#5E8A4E'); R(g, x + 1, y - 1, 1, 3, '#6FA35C'); } }],
    checker: [['Checkered kitchen floor', 'Шахматная плитка', 'Šaha flīzes'], g => { for (let j = 0, y = FY; y < RH; y += 6, j++) for (let i = 0, x = 0; x < RW; x += 6, i++) R(g, x, y, 6, 6, (i + j) % 2 ? '#2B2340' : '#F4F0EA'); }],
  });
  Object.assign(VIEW, {
    castlemoon: [['Castle under the moon', 'Замок под луной', 'Pils mēness gaismā'], (g, x, y, t) => { sky(g, x, y, ['#1B0F2E', '#2A1640', '#3A1F55']); R(g, x + 26, y + 4, 11, 11, '#F6E7B0'); R(g, x + 29, y + 6, 3, 3, '#E9D79A'); R(g, x, y + WH - 6, WW, 6, '#140B20'); R(g, x + 4, y + 18, 14, 20, '#140B20'); R(g, x + 3, y + 14, 3, 5, '#140B20'); R(g, x + 10, y + 10, 3, 9, '#140B20'); R(g, x + 16, y + 14, 3, 5, '#140B20'); R(g, x + 10, y + 7, 3, 3, '#140B20'); for (const [wx, wy] of [[7, 22], [13, 26], [11, 13]]) R(g, x + wx, y + wy, 1, 2, Math.sin(t / 900 + wx) > -.4 ? '#F6D04D' : '#3A2A10'); for (let i = 0; i < 3; i++) { const bx = x + ((i * 13 + t / 45) % (WW + 8)) - 4, by = y + 6 + i * 5 + Math.sin(t / 200 + i) * 2, w = Math.sin(t / 90 + i) > 0; R(g, bx, by, 1, 1, '#000'); R(g, bx - 2, by - (w ? 1 : 0), 2, 1, '#000'); R(g, bx + 1, by - (w ? 1 : 0), 2, 1, '#000'); } }],
    foggrave: [['Foggy graveyard', 'Кладбище в тумане', 'Miglaina kapsēta'], (g, x, y, t) => { sky(g, x, y, ['#2C3446', '#384257', '#46506A']); R(g, x + 8, y + 5, 8, 8, '#E8E4D0'); R(g, x, y + WH - 9, WW, 9, '#2B3324'); for (const [cx, h] of [[6, 9], [16, 12], [27, 8], [36, 11]]) { R(g, x + cx, y + WH - 9 - h, 2, h, '#555B66'); R(g, x + cx - 2, y + WH - 9 - h + 2, 6, 2, '#555B66'); } for (let i = 0; i < 4; i++) { const fx = x + ((i * 17 + t / 70) % (WW + 20)) - 14; g.globalAlpha = .35; R(g, fx, y + WH - 12 + (i % 2) * 3, 16, 3, '#DCE3EE'); g.globalAlpha = 1; } }],
  });
  Object.assign(CURT, {
    crimson: [['Crimson curtains', 'Кроваво-красные шторы', 'Asinssarkanie aizkari'], ['#8E1F2E', '#6B1422'], '#E9C46A'],
    ragged: [['Ragged grey curtains', 'Рваные серые шторы', 'Saplēsti pelēki aizkari'], ['#6E6A78', '#55515E'], '#9A96A8'],
    polkadot: [['Kitchen polka-dot curtains', 'Кухонные шторы в горошек', 'Virtuves punktainie aizkari'], ['#F4F0EA', '#E2DCCF'], '#E5484D'],
  });
  Object.assign(FURN, {
    // 🧛 вампирское
    coffin: { n: N('Comfy coffin', 'Уютный гроб', 'Mājīgs zārks'), w: 26, h: 9, top: 1, sit: true, d: p => { p(2, 0, 22, 1, '#5B3348'); p(0, 1, 26, 6, '#3A2230'); p(1, 1, 24, 1, '#5B3348'); p(0, 3, 26, 1, '#8E1F2E'); p(3, 7, 20, 2, '#2B1824'); p(12, 2, 1, 4, '#E9C46A'); p(10, 3, 5, 1, '#E9C46A'); } },
    candelabra: { n: N('Candelabra', 'Канделябр', 'Kandelabrs'), w: 13, h: 16, top: null, glow: [6, 2], d: (p, t) => { [1, 6, 11].forEach((x, i) => { p(x, 0, 1, 2, Math.sin(t / 110 + i * 2) > 0 ? '#F6C445' : '#F08A3B'); p(x, 2, 1, 4, '#F4F0EA'); }); p(1, 6, 11, 1, '#C9A13B'); p(1, 6, 1, 2, '#C9A13B'); p(11, 6, 1, 2, '#C9A13B'); p(6, 6, 1, 8, '#C9A13B'); p(3, 14, 7, 2, '#A07E2A'); } },
    gothicchair: { n: N('Gothic armchair', 'Готическое кресло', 'Gotiskais krēsls'), w: 12, h: 18, top: 9, sit: true, d: S(['k..k..k..k..', 'kk.kk.kk.kk.', 'kkkkkkkkkkk.', 'krrrrrrrrrk.', 'krrrrrrrrrk.', 'krrrrrrrrrk.', 'krrrrrrrrrk.', 'krrrrrrrrrk.', 'krrrrrrrrrk.', 'kkkkkkkkkkkk', 'krrrrrrrrrrk', 'krrrrrrrrrrk', 'kkkkkkkkkkkk', 'k.........k.', 'k.........k.', 'k.........k.', 'k.........k.', 'k.........k.'], { k: '#2B1824', r: '#8E1F2E' }) },
    goblet: { n: N('Goblet of “tomato juice”', 'Бокал «томатного сока»', 'Kauss ar «tomātu sulu»'), w: 5, h: 8, top: null, d: S(['ggggg', 'grrrg', '.grg.', '..g..', '..g..', '..g..', '.ggg.', 'ggggg'], { g: '#C9A13B', r: '#A8202F' }) },
    // 🪦 кладбищенское
    crossgrave: { n: N('Cross gravestone', 'Надгробие-крест', 'Krusta kapakmens'), w: 9, h: 14, top: null, d: p => { p(3, 0, 3, 12, '#8A8696'); p(0, 3, 9, 3, '#8A8696'); p(4, 1, 1, 10, '#A6A2B2'); p(1, 4, 7, 1, '#A6A2B2'); p(0, 12, 9, 2, '#4E7A3E'); p(6, 9, 2, 2, '#5E8A4E'); } },
    graveangel: { n: N('Stone angel', 'Каменный ангел', 'Akmens eņģelis'), w: 14, h: 20, top: null, d: S(['......aa......', '.....aaaa.....', '.....aaaa.....', 'ww...aaaa...ww', 'www.aaaaaa.www', 'wwwwaaaaaawwww', '.wwwaaaaaawww.', '..wwaaaaaaww..', '...waaaaaaw...', '....aaaaaa....', '....aaaaaa....', '...aaaaaaaa...', '...aaaaaaaa...', '..aaaaaaaaaa..', '..ssssssssss..', '..ssssssssss..', '..ssssssssss..', '..ssssssssss..', '.mmmmmmmmmmmm.', 'gggggggggggggg'], { a: '#A6A2B2', w: '#8A8696', s: '#6E6A78', m: '#5E5A68', g: '#4E7A3E' }) },
    gravelantern: { n: N('Graveyard lantern', 'Кладбищенский фонарь', 'Kapsētas laterna'), w: 7, h: 17, top: null, glow: [3, 4], d: (p, t) => { p(2, 0, 3, 1, '#2B2340'); p(1, 1, 5, 1, '#2B2340'); p(1, 2, 5, 5, '#2B2340'); p(2, 3, 3, 3, Math.sin(t / 160) > -.6 ? '#F6C445' : '#C98A28'); p(3, 7, 1, 8, '#2B2340'); p(1, 15, 5, 2, '#2B2340'); } },
    deadtree: { n: N('Dead tree', 'Сухое дерево', 'Nokaltis koks'), w: 18, h: 26, top: null, d: S(['k.....k......k....', '.k...k...k..k.....', '..k.k.....kk...k..', '...kk......k..k...', '....k.....kk.k....', '....kk...k.kk.....', '.....kk.k..k......', '......kkk.k.......', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '.......kkk........', '......kkkkk.......', '.....kk.k.kk......', '....kk..k..kk.....', '...kk...k...kk....', 'gggggggggggggggggg'], { k: '#3A2E2A', g: '#4E7A3E' }) },
    raven: { n: N('Raven', 'Ворон', 'Krauklis'), w: 9, h: 9, top: null, d: (p, t) => { const tilt = Math.sin(t / 900) > .5 ? 1 : 0; spr((a, b, w, h, c) => p(a, b, w, h, c), ['..kk.....', '.kwkk....', 'ookkk....', '..kkkk...', '..kkkkk..', '..kkkkkk.', '...kkkkkk', '....o.o..', '...oo.oo.'], { k: '#1A1626', w: tilt ? '#1A1626' : '#F4F0EA', o: '#E9A93B' }); } },
    shovel: { n: N('Gravedigger’s shovel', 'Лопата могильщика', 'Kapraču lāpsta'), w: 5, h: 18, top: null, d: p => { p(1, 0, 3, 1, '#8C5A3C'); p(2, 1, 1, 11, '#8C5A3C'); p(0, 12, 5, 5, '#9A96A8'); p(1, 17, 3, 1, '#9A96A8'); p(1, 13, 1, 3, '#C9CDD6'); } },
    // 👩‍🍳 поварское
    souppot: { n: N('Pot of soup', 'Кастрюля с супом', 'Zupas katls'), w: 12, h: 12, top: null, d: (p, t) => { for (let i = 0; i < 3; i++) { const y = (Math.floor(t / 180) + i * 3) % 6; p(3 + i * 3, y, 1, 2, 'rgba(255,255,255,.7)'); } p(1, 5, 10, 1, '#C9CDD6'); p(0, 6, 12, 1, '#9A96A8'); p(1, 7, 10, 5, '#B8BCC6'); p(0, 8, 1, 1, '#2B2340'); p(11, 8, 1, 1, '#2B2340'); p(2, 6, 8, 1, '#E8812E'); } },
    pancakes: { n: N('Stack of pancakes', 'Стопка блинчиков', 'Pankūku kaudze'), w: 12, h: 9, top: null, d: p => { p(0, 8, 12, 1, '#F4F0EA'); for (let i = 0; i < 4; i++) { p(1, 7 - i * 1.5, 10, 2, i % 2 ? '#E9B86A' : '#D99A4A'); } p(3, 1, 6, 1, '#8B4A20'); p(4, 0, 4, 1, '#FFF3A8'); p(2, 2, 2, 3, '#8B4A20'); } },
    mixer: { n: N('Stand mixer', 'Миксер', 'Mikseris'), w: 10, h: 14, top: null, d: (p, t) => { p(1, 0, 8, 4, '#E5484D'); p(7, 4, 2, 8, '#E5484D'); p(0, 12, 10, 2, '#E5484D'); p(1, 7, 6, 5, '#C9CDD6'); p(2, 8, 4, 3, '#F4F0EA'); p(Math.floor(t / 90) % 2 ? 3 : 4, 4, 1, 4, '#9A96A8'); } },
    spicerack: { n: N('Spice shelf', 'Полка со специями', 'Garšvielu plaukts'), w: 18, h: 12, top: 0, d: p => { p(0, 0, 18, 1, '#8C5A3C'); p(0, 11, 18, 1, '#8C5A3C'); p(0, 0, 1, 12, '#8C5A3C'); p(17, 0, 1, 12, '#8C5A3C'); p(0, 6, 18, 1, '#8C5A3C'); ['#E5484D', '#E9C46A', '#4CC38A', '#8C5A3C', '#F08A3B'].forEach((c, i) => { p(2 + i * 3, 2, 2, 4, c); p(2 + i * 3, 1, 2, 1, '#F4F0EA'); p(2 + i * 3, 8, 2, 3, ['#9B5DE5', '#F4F0EA', '#4A7BD8', '#E5484D', '#6B8E23'][i]); }); } },
    cuttingboard: { n: N('Board with veggies', 'Доска с овощами', 'Dēlis ar dārzeņiem'), w: 18, h: 6, top: null, d: p => { p(0, 4, 18, 2, '#C8955E'); p(16, 3, 2, 1, '#C8955E'); p(1, 2, 3, 2, '#E5484D'); p(5, 1, 2, 3, '#F08A3B'); p(5, 0, 2, 1, '#4CC38A'); p(8, 2, 4, 2, '#F4F0EA'); p(13, 2, 2, 2, '#6B8E23'); } },
    chefcounter: { n: N('Chef’s worktable', 'Поварской стол', 'Pavāra galds'), w: 32, h: 16, top: 0, d: p => { p(0, 0, 32, 2, '#C9CDD6'); p(0, 2, 32, 1, '#9A96A8'); p(1, 3, 30, 11, '#E8E2D6'); p(3, 5, 12, 7, '#D6CEBF'); p(17, 5, 12, 7, '#D6CEBF'); p(8, 8, 2, 1, '#9A96A8'); p(22, 8, 2, 1, '#9A96A8'); p(1, 14, 2, 2, '#5B5670'); p(29, 14, 2, 2, '#5B5670'); } },
    baguettes: { n: N('Basket of baguettes', 'Корзина с багетами', 'Bagešu grozs'), w: 11, h: 15, top: null, d: p => { [[2, 0], [5, 1], [7, 3]].forEach(([x, y]) => { p(x, y, 2, 9, '#D99A4A'); p(x, y + 2, 2, 1, '#B5782E'); p(x, y + 5, 2, 1, '#B5782E'); }); p(0, 9, 11, 6, '#B5823E'); for (let i = 0; i < 11; i += 2) p(i, 10, 1, 5, '#9A6A2E'); p(0, 9, 11, 1, '#E5484D'); } },
    // ★ легендарные
    countcoffin: { n: N('Count Polly’s golden coffin', 'Золотой гроб графа Полли', 'Grāfa Pollijas zelta zārks'), w: 32, h: 14, top: 3, sit: true, glow: [16, 4], d: (p, t) => { const open = (t % 7000) < 2200; p(0, 13, 32, 1, '#140B20'); p(1, 4, 30, 9, '#2B1824'); p(1, 6, 30, 1, '#8E1F2E'); p(0, 4, 32, 1, '#E9C46A'); p(0, 12, 32, 1, '#E9C46A'); const lx = open ? 6 : 0; p(2 + lx, 1, 28, 3, '#3A2230'); p(2 + lx, 1, 28, 1, '#E9C46A'); p(15 + lx, 0, 2, 4, '#E9C46A'); p(13 + lx, 1, 6, 1, '#E9C46A'); if (open) { const fy = Math.max(-10, -Math.floor((t % 7000) / 160)); p(14, fy, 1, 1, '#000'); p(12, fy - 1, 2, 1, '#000'); p(15, fy - 1, 2, 1, '#000'); } [3, 28].forEach(x => { p(x, 8, 1, 1, Math.sin(t / 300 + x) > .3 ? '#FFF3B0' : '#E9C46A'); }); } },
    crypt: { n: N('Crypt with a ghost', 'Склеп с привидением', 'Kapenes ar spoku'), w: 30, h: 30, top: null, glow: [15, 18], d: (p, t) => { p(15, 0, 1, 4, '#8A8696'); p(13, 1, 5, 1, '#8A8696'); p(4, 4, 23, 2, '#8A8696'); p(2, 6, 27, 2, '#A6A2B2'); p(4, 8, 23, 20, '#8A8696'); for (let y = 10; y < 28; y += 4) p(4, y, 23, 1, '#77738A'); p(11, 14, 9, 14, '#2B2340'); p(12, 13, 7, 1, '#2B2340'); p(5, 9, 2, 19, '#A6A2B2'); p(24, 9, 2, 19, '#A6A2B2'); p(0, 28, 30, 2, '#4E7A3E'); p(3, 26, 2, 2, '#5E8A4E'); p(26, 25, 2, 3, '#5E8A4E'); const peek = Math.sin(t / 1100); if (peek > -.2) { const gx = 13 + Math.round(peek * 2), gy = 17 - Math.round((peek + .2) * 3); g2(p, gx, gy); } } },
    tieredcake: { n: N('Chef’s grand tiered cake', 'Многоярусный торт шефа', 'Šefpavāra daudzstāvu torte'), w: 22, h: 28, top: null, glow: [11, 2], d: (p, t) => { p(10, 0, 2, 2, Math.sin(t / 120) > 0 ? '#F6C445' : '#F08A3B'); p(10, 2, 2, 4, '#F28AB2'); p(6, 6, 10, 5, '#FFF3E6'); p(6, 6, 10, 1, '#F28AB2'); p(4, 11, 14, 6, '#FCE4EC'); p(4, 11, 14, 1, '#F28AB2'); p(2, 17, 18, 7, '#FFF3E6'); p(2, 17, 18, 1, '#F28AB2'); [7, 11, 15].forEach(x => p(x, 16, 2, 1, '#E5484D')); [4, 9, 14, 18].forEach(x => p(x, 23, 1, 1, '#E9C46A')); p(0, 24, 22, 2, '#C9CDD6'); p(9, 26, 4, 2, '#9A96A8'); if (Math.sin(t / 400) > .6) { p(1, 9, 1, 1, '#FFFFFF'); p(20, 14, 1, 1, '#FFFFFF'); } } },
  });
  Object.assign(DECO, {
    hangingbat: { n: N('Upside-down bat', 'Летучая мышь вниз головой', 'Sikspārnis otrādi'), w: 7, h: 8, d: (p, t) => { const o = Math.round(Math.sin(t / 700)); p(3, 0, 1, 2, '#2B2340'); spr((a, b, w, h, c) => p(a + o, b + 2, w, h, c), ['k.....k', 'kk.k.kk', '.kkkkk.', '..kkk..', '..rkr..', '...k...'], { k: '#1A1626', r: Math.sin(t / 1500) > .9 ? '#1A1626' : '#E5484D' }); } },
    countportrait: { n: N('Portrait of the Count', 'Портрет графа', 'Grāfa portrets'), w: 14, h: 16, d: S(['gggggggggggggg', 'gkkkkkkkkkkkkg', 'gkkkkkkkkkkkkg', 'gkkkkbbbbkkkkg', 'gkkkbbbbbbkkkg', 'gkkkwwwwwwkkkg', 'gkkkwkwwkwkkkg', 'gkkkwwwwwwkkkg', 'gkkkwwrrwwkkkg', 'gkkkkwwwwkkkkg', 'gkkrrkwwkrrkkg', 'gkrrrkkkkrrrkg', 'gkrrrkkkkrrrkg', 'gkkkkkkkkkkkkg', 'gggggggggggggg', '..............'], { g: '#E9C46A', k: '#2B1824', b: '#140B20', w: '#EDE6F2', r: '#8E1F2E' }) },
    fog: { n: N('Drifting fog', 'Туман', 'Migla'), w: 44, h: 8, d: (p, t) => { for (let i = 0; i < 4; i++) { const x = Math.round(((i * 13 + t / 90) % 50) - 6); p(Math.max(0, x), 2 + (i % 2) * 3, Math.min(14, 44 - Math.max(0, x)), 2, 'rgba(220,227,238,.45)'); } } },
    ladles: { n: N('Ladles on the wall', 'Половники на стене', 'Kausi pie sienas'), w: 18, h: 13, d: p => { p(0, 0, 18, 1, '#8C5A3C'); [[2, '#9A96A8'], [7, '#C8955E'], [12, '#9A96A8']].forEach(([x, c], i) => { p(x + 1, 1, 1, 7 + i, c); p(x, 8 + i, 3, 2, c); }); p(16, 1, 1, 6, '#5B5670'); p(15, 7, 3, 3, '#5B5670'); } },
    garlic: { n: N('String of garlic', 'Связка чеснока', 'Ķiploku pīne'), w: 7, h: 15, d: p => { p(3, 0, 1, 15, '#C8B68A'); for (let i = 0; i < 4; i++) { const y = 2 + i * 3, x = i % 2 ? 4 : 0; p(x, y, 3, 3, '#F4F0EA'); p(x + 1, y - 1, 1, 1, '#E2DCCF'); p(x, y + 2, 3, 1, '#E2DCCF'); } } },
    menuboard: { n: N('Menu of the day', 'Меню дня', 'Dienas ēdienkarte'), w: 16, h: 14, d: p => { p(0, 0, 16, 14, '#8C5A3C'); p(1, 1, 14, 12, '#2E3A33'); p(3, 3, 10, 1, '#F4F0EA'); p(3, 6, 8, 1, '#E9C46A'); p(3, 8, 9, 1, '#F4F0EA'); p(3, 10, 6, 1, '#F4F0EA'); p(12, 10, 2, 1, '#F28AB2'); } },
  });
  // ---------- тема «🥞 Блинная» (по игре «Блинная Полли», ★ — башня и волшебная сковородка) ----------
  Object.assign(WALL, {
    pancakewall: [['Pancake wallpaper', 'Обои с блинчиками', 'Pankūku tapetes'], tileWall('#FFF4DC', ['.bbb.', 'ooooo', 'yyyyy', 'ooooo'], { b: '#FFE08A', o: '#D99A4A', y: '#E9B86A' }, 12, 10, 6)],
  });
  Object.assign(CURT, {
    butter: [['Butter-yellow curtains', 'Масляно-жёлтые шторы', 'Sviesta dzeltenie aizkari'], ['#F6D04D', '#E9B83A'], '#FFFFFF'],
  });
  Object.assign(FURN, {
    pancakepan: { n: N('Frying pan with a pancake', 'Сковородка с блином', 'Panna ar pankūku'), w: 16, h: 8, top: null, d: (p, t) => { const ph = (t % 3000) / 3000, up = ph < .25 ? Math.round(Math.sin(ph / .25 * Math.PI) * 4) : 0; p(2, 4 - up, 7, 1, ph > .08 && ph < .17 ? '#E9B86A' : '#D99A4A'); p(3, 3 - up, 5, 1, '#E9B86A'); p(0, 5, 11, 1, '#3A3550'); p(1, 6, 9, 1, '#2B2340'); p(2, 7, 7, 1, '#2B2340'); p(11, 5, 4, 1, '#5B5670'); p(15, 4, 1, 2, '#8C5A3C'); } },
    batterbowl: { n: N('Bowl of batter', 'Миска с тестом', 'Bļoda ar mīklu'), w: 11, h: 9, top: null, d: (p, t) => { const o = Math.floor(t / 200) % 2; p(0, 4, 11, 1, '#F4E3B5'); p(6 + o, 0, 1, 4, '#9A96A8'); p(5 + o, 3, 3, 2, '#C9CDD6'); p(0, 5, 11, 1, '#7FB3E8'); p(1, 6, 9, 1, '#7FB3E8'); p(2, 7, 7, 1, '#5E92C8'); p(3, 8, 5, 1, '#5E92C8'); p(2, 5, 2, 1, '#BFE3F5'); } },
    jamjars: { n: N('Jars of jam', 'Баночки варенья', 'Ievārījuma burciņas'), w: 13, h: 8, top: null, d: p => { [[0, 2, '#E5484D', '#B83A32'], [5, 0, '#8E4FB8', '#6B3A8E'], [10, 2, '#F08A3B', '#C96A26']].forEach(([x, y, c, d]) => { p(x, y, 3, 1, '#F4F0EA'); p(x + 1, y, 1, 1, '#E5484D'); p(x, y + 1, 3, 7 - y - 1, c); p(x, 7, 3, 1, d); p(x, y + 2, 1, 2, 'rgba(255,255,255,.55)'); p(x, y + 4, 3, 1, '#F4F0EA'); }); } },
    honeypot: { n: N('Honey pot', 'Горшочек мёда', 'Medus podiņš'), w: 9, h: 9, top: null, d: (p, t) => { const k = Math.floor(t / 250) % 4; p(1, 0, 7, 1, '#C8955E'); p(2, 1, 5, 1, '#8C5A3C'); p(0, 2, 9, 6, '#E9A93B'); p(1, 3, 2, 1, '#FFE08A'); p(1, 5, 7, 1, '#B5782E'); p(1, 8, 7, 1, '#B5782E'); p(2, 2, 1, 1 + k, '#F6C445'); p(6, 2, 1, 1 + ((k + 2) % 4), '#F6C445'); } },
    pancakecart: { n: N('Wobbleland pancake cart', 'Блинная тележка Воббленда', 'Vobllendas pankūku ratiņi'), w: 34, h: 26, top: 10, d: p => { for (let i = 0; i < 34; i += 4) { p(i, 0, 2, 4, '#E5484D'); p(i + 2, 0, 2, 4, '#F4F0EA'); p(i, 4, 2, 1, '#B83A32'); } p(1, 5, 1, 5, '#8C5A3C'); p(32, 5, 1, 5, '#8C5A3C'); p(0, 10, 34, 2, '#C8955E'); p(0, 11, 34, 1, '#A0673C'); p(1, 12, 32, 10, '#F6D04D'); p(1, 12, 32, 1, '#E9B83A'); p(10, 14, 14, 6, '#F4F0EA'); p(15, 15, 4, 1, '#FFF3A8'); p(13, 16, 8, 1, '#E9B86A'); p(12, 17, 10, 1, '#D99A4A'); p(13, 18, 8, 1, '#E9B86A'); p(14, 16, 1, 2, '#8B4A20'); p(4, 22, 5, 4, '#2B2340'); p(5, 23, 3, 2, '#9A96A8'); p(25, 22, 5, 4, '#2B2340'); p(26, 23, 3, 2, '#9A96A8'); } },
    // ★ легендарные
    pancaketower: { n: N('Sky-high pancake tower', 'Блинная башня до потолка', 'Pankūku tornis līdz griestiem'), w: 18, h: 40, top: null, glow: [9, 2], d: (p, t) => { let o = 0; for (let i = 0; i < 17; i++) { const y = 36 - i * 2; o = Math.round(Math.sin(t / 700 + i * .5) * i / 10); p(2 + o, y, 14, 2, i % 2 ? '#E9B86A' : '#D99A4A'); p(2 + o, y + 1, 14, 1, i % 2 ? '#D99A4A' : '#C98A3E'); } const f = Math.floor(t / 90) % 36; p(4 + o, 3, 10, 1, '#8B4A20'); p(5 + o, 4, 1, Math.min(f, 32), '#8B4A20'); p(12 + o, 4, 1, Math.min((f + 15) % 36, 30), '#8B4A20'); p(7 + o, 1, 4, 2, '#FFF3A8'); p(8 + o, 1, 2, 1, '#FFFFFF'); p(9 + o, 0, 1, 1, '#E5484D'); p(0, 38, 18, 1, '#F4F0EA'); p(1, 39, 16, 1, '#C9CDD6'); if (Math.sin(t / 300) > .7) p(15 + o, 10, 1, 1, '#FFFFFF'); } },
    magicpan: { n: N('Polly’s magic frying pan', 'Волшебная сковородка Полли', 'Pollijas burvju panna'), w: 20, h: 22, top: null, glow: [8, 15], d: (p, t) => { const ph = (t % 2400) / 2400, up = ph < .5 ? Math.round(Math.sin(ph / .5 * Math.PI) * 12) : 0, py = 16 + Math.round(Math.sin(t / 500)); for (let i = 0; i < 4; i++) p(3 + i * 4 + (Math.floor(t / 150) + i) % 2, 20 + (Math.floor(t / 200) + i) % 2, 1, 1, i % 2 ? '#F6D04D' : '#FFFFFF'); const cy = py - 1 - up, flip = ph > .15 && ph < .35; p(3, cy, 9, 1, flip ? '#FFF3A8' : '#E9B86A'); if (!flip) p(4, cy - 1, 7, 1, '#D99A4A'); if (up > 3) { p(2, cy + 3, 1, 1, '#FFFFFF'); p(12, cy + 5, 1, 1, '#F6D04D'); p(7, cy + 7, 1, 1, '#FFFFFF'); } p(1, py, 13, 1, '#E9C46A'); p(2, py + 1, 11, 1, '#C9A13B'); p(3, py + 2, 9, 1, '#A07E2A'); p(14, py, 4, 1, '#C9A13B'); p(18, py - 1, 2, 2, '#E5484D'); } },
  });
  Object.assign(DECO, {
    pancakesign: { n: N('“Pancakes” sign', 'Вывеска «Блины»', 'Izkārtne «Pankūkas»'), w: 18, h: 10, d: p => { p(3, 0, 1, 2, '#8C5A3C'); p(14, 0, 1, 2, '#8C5A3C'); p(0, 2, 18, 8, '#8C5A3C'); p(1, 3, 16, 6, '#C8955E'); p(7, 4, 4, 1, '#FFF3A8'); p(5, 5, 8, 1, '#D99A4A'); p(5, 6, 8, 1, '#E9B86A'); p(5, 7, 8, 1, '#D99A4A'); p(6, 5, 1, 2, '#8B4A20'); p(11, 5, 1, 3, '#8B4A20'); } },
    orderslips: { n: N('Orders on a string', 'Заказы на верёвочке', 'Pasūtījumi uz auklas'), w: 20, h: 9, d: (p, t) => { p(0, 0, 20, 1, '#C8B68A'); [1, 6, 11, 15].forEach((x, i) => { const o = Math.sin(t / 600 + i) > .3 ? 1 : 0; p(x + 1, 1, 1, 1, '#E5484D'); p(x + o, 2, 3, 6, '#FFFDF8'); p(x + o, 3, 3, 1, '#C9CDD6'); p(x + o, 5, 2, 1, '#C9CDD6'); p(x + o + 1, 7, 1, 1, ['#E5484D', '#E9C46A', '#4CC38A', '#8E4FB8'][i]); }); } },
  });
  // привидение из склепа (рисуется поверх двери)
  function g2(p, x, y) { spr((a, b, w, h, c) => p(x + a, y + b, w, h, c), ['.www.', 'wkwkw', 'wwwww', 'w.w.w'], { w: '#F4F0FA', k: '#2B2340' }); }
  // ---------- подробные (HD) версии основных вещей: полупиксели, контур, блики и тени; размеры прежние ----------
  const OUT = '#2B1A3A';
  // скруглённый прямоугольник с контуром (r — скругление в полупикселях)
  const rbox = (p, x, y, w, h, fill, out = OUT, r = 1) => { p(x + r, y, w - 2 * r, h, out); p(x, y + r, w, h - 2 * r, out); if (r >= 1) p(x + .5, y + .5, w - 1, h - 1, out); if (fill) { p(x + r, y + .5, w - 2 * r, h - 1, fill); p(x + .5, y + r, w - 1, h - 2 * r, fill); p(x + 1, y + 1, w - 2, h - 2, fill); } };
  const HD = {
    sofa: (p, t, i) => { const [c, d, l] = SOFA_C[i];
      rbox(p, 1, 0, 46, 12, c, OUT, 1.5); p(2.5, .5, 43, .5, l);
      [5, 25].forEach(x => { rbox(p, x, 2, 18, 9, l, d, 1); p(x + 1, 2.5, 16, .5, '#FFFFFF33'); p(x + 1, 9.5, 16, .5, d); [x + 4.5, x + 8.5, x + 12.5].forEach(bx => p(bx, 5.5, .5, .5, d)); });
      rbox(p, 5, 9.5, 38, 6.5, l, OUT, 1); p(6, 10, 36, .5, '#FFFFFF55'); p(23.75, 10, .5, 5.5, d); p(6, 14.5, 36, 1, d);
      [0, 41].forEach(x => { rbox(p, x, 5, 7, 15, c, OUT, 1.5); p(x + 1, 5.5, 5, 1, l); p(x + 1, 7, 5, .5, d); p(x + 1.5, 12, 4, 6.5, d); });
      p(6.5, 15.5, 35, 4, d); p(6.5, 19, 35, .5, OUT); p(7, 16, 34, .5, c);
      [4, 41].forEach(x => { p(x, 19.5, 3, 2.5, OUT); p(x + .5, 19.5, 2, 2, '#7A4E2A'); p(x + .5, 19.5, .5, 2, '#9C6A3C'); }); },
    armchair: p => { const c = '#4A9BA8', d = '#357782', l = '#6FBAC5';
      rbox(p, 3, 0, 20, 12, c, OUT, 1.5); p(4.5, .5, 17, .5, l); rbox(p, 6, 2, 14, 8, l, d, 1); [9.5, 12.75, 16].forEach(x => p(x, 5.5, .5, .5, d));
      rbox(p, 4, 9.5, 18, 6.5, l, OUT, 1); p(5, 10, 16, .5, '#FFFFFF55'); p(5, 14.5, 16, 1, d);
      [0, 21].forEach(x => { rbox(p, x, 5, 5, 15, c, OUT, 1.5); p(x + 1, 5.5, 3, 1, l); p(x + 1, 12, 3, 6.5, d); });
      p(4.5, 15.5, 17, 4, d); p(4.5, 19, 17, .5, OUT);
      [4, 19].forEach(x => { p(x, 19.5, 3, 2.5, OUT); p(x + .5, 19.5, 2, 2, '#7A4E2A'); }); },
    table: p => { const w = '#A0673C', d = '#7A4A28', l = '#C08454';
      rbox(p, 0, 0, 32, 3.5, w, OUT, 1); p(1, .5, 30, .5, l); for (let x = 4; x < 30; x += 7) p(x, 1.5, 3, .5, d);
      [2, 27].forEach(x => { p(x, 3.5, 3, 14.5, OUT); p(x + .5, 3.5, 2, 14, d); p(x + .5, 3.5, .5, 14, w); });
      p(5, 6, 22, 1.5, OUT); p(5, 6.5, 22, .5, d); },
    bed: p => { const wd = '#7A4A30', wl = '#9C6A44';
      rbox(p, 0, 0, 5, 20, wd, OUT, 1); p(1, 1, 1, 18, wl); p(2.5, 3, .5, 14, '#5E3826');
      rbox(p, 41, 4, 5, 16, wd, OUT, 1); p(42, 5, 1, 14, wl);
      rbox(p, 4, 6, 38, 8.5, '#F4EBDD', OUT, .5);
      rbox(p, 5, 2.5, 11, 6.5, '#FFFFFF', OUT, 1.5); p(6.5, 7.5, 8, .5, '#E2DCCF'); p(10, 4, 1, 3, '#EEE8DC');
      rbox(p, 14, 6.5, 28, 8, '#7FB3E8', OUT, 1); for (let x = 17; x < 41; x += 4) p(x, 8, 2, 5, '#9FCDEB'); p(14.5, 7, 27, .5, '#BFE3F5'); p(14.5, 13.5, 27, .5, '#5E92C8');
      p(4, 14, 38, 3.5, OUT); p(4.5, 14.5, 37, 2.5, wd); p(4.5, 14.5, 37, .5, wl);
      [5, 39].forEach(x => { p(x, 17, 2.5, 3, OUT); p(x + .5, 17, 1.5, 2.5, '#5E3826'); }); },
    bookshelf: p => { const w = '#7A4A30', d = '#4E2F1F', l = '#9C6A44';
      rbox(p, 0, 0, 26, 40, w, OUT, 1); p(1, .5, 24, .5, l); p(2, 2, 22, 36, d);
      [13, 26].forEach(y => { p(2, y, 22, 2, w); p(2, y, 22, .5, l); p(2, y + 2, 22, .5, '#3A2216'); });
      const c = [['#E5484D', '#B83A32'], ['#4A7BD8', '#3A62B0'], ['#E9C46A', '#C99A2E'], ['#4CC38A', '#3A9A6C'], ['#B79CF2', '#9478D6'], ['#F08A3B', '#C96A26'], ['#F4EBDD', '#D6CCB8']];
      [[2, 13], [15, 26], [28, 38]].forEach(([y0, y1], s) => { let x = 2.5, k = s * 3;
        while (x < 22.5) { const w2 = 2 + (k % 2) * .5 + (k % 3 === 0 ? .5 : 0), h = (y1 - y0) - 2 - (k % 3) * .5, [cc, cd] = c[k % c.length];
          if (k % 7 === 5 && x < 20) { p(x, y1 - h + 1, w2 + 1.5, h - 1, OUT); p(x + .5, y1 - h + 1.5, w2 + .5, h - 1.5, cc); x += w2 + 2; k++; continue; } // наклонённая книга
          p(x, y1 - h, w2, h, OUT); p(x + .5, y1 - h + .5, w2 - 1, h - .5, cc); p(x + .5, y1 - h + 2, w2 - 1, .5, cd); p(x + .5, y1 - 2, w2 - 1, .5, cd); x += w2 + (k % 4 === 0 ? .5 : 0); k++; } }); },
    lamp: p => { const sh = '#F6D04D', sd = '#D9A33B', sl = '#FFF0A8';
      p(3, 0, 6, .5, OUT); p(2.5, .5, 7, 2, OUT); p(1, 2, 10, 5.5, OUT); p(3.5, .5, 5, 1.5, sh); p(1.5, 2, 9, 5, sh); p(2, 2.5, 3, 4, sl); p(1.5, 6, 9, 1, sd); for (let x = 3; x < 10; x += 2) p(x, 2.5, .5, 4, '#E9B83A');
      p(5.5, 7.5, 1, 27, OUT); p(5.75, 7.5, .5, 26.5, '#5B5670'); p(5, 20, 2, 1, OUT);
      p(2, 33.5, 8, 4.5, OUT); p(2.5, 34, 7, 3.5, '#3A3550'); p(2.5, 34, 7, .5, '#5B5670'); },
    plant: p => { const g1 = '#3E8E5A', g2 = '#2E6B47', g3 = '#5BAE74', pot = '#C66B4A', pd = '#A8553A', pl = '#D9825F';
      const leaf = (x, y, w, h, c, flip) => { rbox(p, x, y, w, h, c, '#1F4A33', 1.5); p(x + w / 2 - .25, y + 1, .5, h - 2, '#1F4A33'); for (let k = 1; k < h - 2; k += 1.5) p(flip ? x + .5 : x + w - 1, y + k, .5, .5, '#1F4A33'); p(x + 1, y + 1, 1, .5, g3); };
      p(7.5, 6, 1, 14, '#1F4A33'); p(7.75, 6, .5, 14, g2);
      leaf(9, 0, 6.5, 6.5, g2, 0); leaf(1.5, 2, 6.5, 5.5, g1, 1); leaf(9, 7, 7, 6, g1, 0); leaf(0, 8, 7, 5.5, g2, 1); leaf(4, 13, 8, 5.5, g1, 0);
      p(3, 19, 10, 2.5, OUT); p(3.5, 19.5, 9, 1.5, pd); p(3.5, 19.5, 9, .5, pl);
      p(4, 21, 8, 7, OUT); p(4.5, 21, 7, 6.5, pot); p(5, 21.5, 1.5, 5.5, pl); p(10.5, 21.5, .5, 5.5, pd); },
    books: p => { const bk = (y, x, w, c, d) => { p(x, y, w, 3, OUT); p(x + .5, y + .5, w - 1, 2, c); p(x + .5, y + 1.25, w - 1, .5, d); p(x + w - 1.5, y + .5, 1, 2, '#F4EBDD'); };
      bk(5, 0, 12, '#C9463D', '#9E3229'); bk(2.5, 1, 10, '#4A7BD8', '#3A62B0'); bk(0, 2, 9, '#4CC38A', '#3A9A6C'); },
    mug: (p, t) => { p(0, 0, 4.5, 5, OUT); p(.5, .5, 3.5, 4.5, '#F4EBDD'); p(.5, .5, 3.5, 1, '#6B3E26'); p(1, .75, 1, .5, '#8B5A3C'); p(.5, 4, 3.5, .5, '#D6CCB8'); p(4.5, 1, 1.5, 3, OUT); p(4.5, 1.5, 1, 2, '#F4EBDD'); p(1, 2.5, 2.5, .5, '#E5484D');
      const k = Math.floor(t / 300) % 3; p(1 + k * .5, -1.5 - k * .5, .5, 1, '#FFFFFFCC'); p(2.5 - k * .5, -2.5 + k * .5, .5, 1, '#FFFFFF99'); },
    cake: (p, t) => { p(5.5, 0, 1, 1, Math.sin(t / 150) > 0 ? '#F6C445' : '#F08A3B'); p(5.75, -.5, .5, .5, '#FFF3B0'); p(5.5, 1, 1, 2, '#F28AB2'); p(5.5, 1.5, 1, .5, '#FFFFFF');
      p(1, 3, 10, 6.5, OUT); p(1.5, 3.5, 9, 2.5, '#F7B6C8'); p(1.5, 6, 9, 3, '#FFF4E0'); p(1.5, 5.5, 9, 1, '#E5484D'); [2.5, 4.5, 6.5, 8.5].forEach(x => p(x, 6.5, .5, 1, '#F7B6C8')); p(2, 3.5, 2, .5, '#FFFFFF');
      p(0, 9, 12, 2, OUT); p(.5, 9.5, 11, 1, '#E6E6EE'); p(.5, 9.5, 11, .5, '#FFFFFF'); },
    tv: (p, t, i, room) => { rbox(p, 0, 0, 26, 17, '#2B2340', '#140E22', 1.5); p(1, 1, 24, .5, '#4A4260'); p(2, 2, 22, 13, '#10213A');
      if (room.has('console')) { p(2, 12, 22, 3, '#3E8257'); const jx = 4 + Math.floor((t / 120) % 16), jy = 9 - Math.abs(Math.sin(t / 300)) * 5; p(jx, jy, 2, 3, '#F6D04D'); p(18 - Math.floor((t / 200) % 12), 10, 2, 2, '#E5484D'); }
      else { p(2, 2, 22, 13, '#3E7BC6'); const cx = 2 + Math.floor((t / 160) % 26) - 4; p(Math.max(2, cx), 5, Math.min(6, 24 - cx), 2, '#FFFFFF'); p(2, 12, 22, 3, '#6FBF6A'); }
      for (let y = 2; y < 15; y += 1.5) p(2, y, 22, .25, '#00000022'); p(2.5, 2.5, 4, .5, '#FFFFFF44'); p(22, 15.5, 1, .5, '#E5484D'); p(19, 15.5, 2, .5, '#5B5670');
      p(9, 17, 8, 3, OUT); p(9.5, 17, 7, 2.5, '#1A1528'); p(5, 19.5, 16, .5, OUT); },
  };
  // круглое с объёмом: по полупиксельной сетке; col(x, y) — цвет точки (x, y в долях: 0..1 от левого верхнего края), край — контур
  const blob = (p, cx, cy, rx, ry, col, out = OUT) => { for (let y = cy - ry; y < cy + ry; y += .5) for (let x = cx - rx; x < cx + rx; x += .5) { const ins = (a, b) => Math.pow((a + .25 - cx) / rx, 2) + Math.pow((b + .25 - cy) / ry, 2) <= 1; if (!ins(x, y)) continue; const edge = !ins(x - .5, y) || !ins(x + .5, y) || !ins(x, y - .5) || !ins(x, y + .5); const cc = edge ? out : col((x - cx + rx) / (2 * rx), (y - cy + ry) / (2 * ry), x, y); if (cc) p(x, y, .5, .5, cc); } };
  const darker = (h, k = .72) => '#' + [1, 3, 5].map(i => Math.round(parseInt(h.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
  const lighter = (h, k = .45) => '#' + [1, 3, 5].map(i => { const v = parseInt(h.slice(i, i + 2), 16); return Math.round(v + (255 - v) * k).toString(16).padStart(2, '0'); }).join('');
  Object.assign(HD, {
    cat: (p, t) => { const o = '#F08A3B', d = '#C96A26', l = '#F6B07A', tail = Math.floor(t / 400) % 2;
      blob(p, 7.25, 6.5, 4.75, 2.75, (u, v) => v > .7 ? d : u > .15 && u < .5 && v < .45 ? l : o); // тело
      for (let k = 0; k < 4; k++) p(10.5 + k * .5, 4.5 - k * (tail ? .75 : .5), .5, 1.5, k === 3 ? OUT : o); p(10.5, 4.5, 2, .5, OUT);
      blob(p, 3, 3.25, 2.75, 2.5, (u, v) => v > .75 ? d : o); p(.75, 0, 1, 1.5, OUT); p(1, .5, .5, 1, '#F7B6C8'); p(3.75, 0, 1, 1.5, OUT); p(4, .5, .5, 1, '#F7B6C8');
      p(1.5, 2.75, .5, .75, OUT); p(3.75, 2.75, .5, .75, OUT); p(2.75, 3.75, .5, .5, '#E5484D'); p(2, 4.25, 2, .25, d);
      [3, 5, 9, 10.5].forEach(x => { p(x, 8.5, 1, .5, OUT); }); for (let k = 0; k < 3; k++) p(6 + k * 1.5, 5, .5, .5, d); },
    candle: (p, t) => { const f = Math.sin(t / 120) > 0; p(1, -.5, 2, 2.5, f ? '#F6C445' : '#F08A3B'); p(1.5, 0, 1, 1.5, '#FFF3B0'); p(f ? 1 : 2.5, -1, .5, .5, '#F6D04D'); p(1.75, 2, .5, 1, OUT);
      p(0, 3, 4, 6, OUT); p(.5, 3, 3, 5.5, '#F4EBDD'); p(.5, 3, 1, 5.5, '#FFFFFF'); p(2.5, 3, .5, 2, '#E2DCCF'); p(-.5, 8.5, 5, .5, OUT); },
  });
  const HD_DECO = {
    ornament: (p, t, i) => { const c = ORN_C[i], d = darker(c), l = lighter(c);
      p(2, 0, 1, 1, '#9A96A8'); p(1.5, .5, 2, 1, OUT); p(2, 1, 1, .5, '#E9C46A');
      blob(p, 2.5, 4.25, 2.5, 2.75, (u, v, x, y) => {
        if (i === 12 && ((v > .4 && v < .55) || (v > .15 && v < .25) || v > .8)) return '#FFFFFF'; // в полоску
        if (i === 13 && ((Math.round(x * 2) + Math.round(y * 2) * 3) % 7 === 0)) return '#FFFFFF'; // снежинки
        if (i === 14 && ((Math.round(x * 2) * 3 + Math.round(y * 2) * 5 + Math.floor(t / 180)) % 9 === 0)) return '#FFF3B0'; // блёстки
        if (i === 15) return ['#E5484D', '#F08A3B', '#F6D04D', '#4CC38A', '#4A7BD8', '#9B5DE5'][Math.min(5, Math.floor(v * 6))]; // радужный
        return u + v > 1.25 ? d : u + v < .55 ? l : c; });
      p(1.25, 2.5, .5, .5, '#FFFFFF'); p(1, 3, .5, 1, '#FFFFFFAA'); if (Math.sin(t / 700 + i * 2.3) > .93) p(3, 2.5, .5, .5, '#FFFFFF'); },
    candyorn: p => { // конфета в фантике: посередине полосатая, по бокам скрученные кончики
      [[0, 1], [7.5, -1]].forEach(([x, dir]) => { const tipx = dir > 0 ? x : x + 1.5; p(x, .5, 1.5, 3, OUT); p(x + .5, 1, .5, 2, '#F28AB2'); p(dir > 0 ? x + 1 : x, 1.5, .5, 1, '#F7B6C8'); });
      blob(p, 4.5, 2, 3, 2, (u, v, x, y) => (Math.round((x + y) * 2) % 3 === 0) ? '#FFFFFF' : v > .7 ? '#B83A32' : '#E5484D'); p(3, 1, .5, .5, '#FFFFFF'); },
    staromini: (p, t) => { const c = Math.sin(t / 300) > 0 ? '#F6D04D' : '#E9C46A', o = '#B5781F';
      [[2, 0, 1, 1.5], [1.5, 1.5, 2, 1], [0, 2.5, 5, 1], [.5, 3.5, 4, 1], [1, 4.5, 3, .5], [.5, 5, 1.25, 1], [3.25, 5, 1.25, 1]].forEach(([x, y, w, h]) => p(x - .5, y - .5, w + 1, h + 1, o));
      [[2, 0, 1, 1.5], [1.5, 1.5, 2, 1], [0, 2.5, 5, 1], [.5, 3.5, 4, 1], [1, 4.5, 3, .5], [.5, 5, 1.25, .5], [3.25, 5, 1.25, .5]].forEach(([x, y, w, h]) => p(x, y, w, h, c)); p(2, 2.5, .5, .5, '#FFFFFF'); },
    gingerorn: p => { const d = '#B9824A', dd = '#8C5A30', w = '#FFFFFF';
      blob(p, 3.5, 1.5, 1.75, 1.5, (u, v) => v > .7 ? dd : d, '#6B4020'); p(2.75, 1.25, .5, .5, '#2B2340'); p(3.75, 1.25, .5, .5, '#2B2340'); p(3, 2.25, 1, .25, w);
      p(.5, 3, 6, 1.5, '#6B4020'); p(1, 3.25, 5, 1, d); p(.75, 3.5, .5, .5, w); p(5.75, 3.5, .5, .5, w);
      p(2, 3, 3, 4, '#6B4020'); p(2.5, 3, 2, 3.5, d); p(3.25, 4, .5, .5, '#E5484D'); p(3.25, 5, .5, .5, '#4CC38A');
      p(1.25, 6.5, 2, 2.5, '#6B4020'); p(3.75, 6.5, 2, 2.5, '#6B4020'); p(1.75, 6.5, 1, 2, d); p(4.25, 6.5, 1, 2, d); p(1.5, 8, 1.5, .25, w); p(4, 8, 1.5, .25, w); },
    snowmanorn: p => { const w = '#FFFFFF', s = '#D8E2EE';
      blob(p, 3, 6.25, 3, 2.75, (u, v) => v > .7 || u > .75 ? s : w, '#5B6478'); blob(p, 3, 2.75, 2, 1.75, (u, v) => v > .75 ? s : w, '#5B6478');
      p(1.5, -.25, 3, 1.25, OUT); p(1, .75, 4, .5, OUT); p(2, 0, 2, .75, '#2B2340'); p(2.25, 2.25, .5, .5, OUT); p(3.25, 2.25, .5, .5, OUT); p(3.5, 3, 1.5, .5, '#F08A3B');
      p(1, 4.25, 4, .75, '#E5484D'); p(4, 4.75, .75, 1.5, '#E5484D'); p(2.75, 5.75, .5, .5, OUT); p(2.75, 7, .5, .5, OUT); },
    pinecone: p => { p(2, -.5, 1, 1, '#E5484D'); p(2.25, 0, .5, .5, OUT);
      blob(p, 2.5, 4.25, 2.5, 3.5, (u, v, x, y) => (Math.round(x * 2) + Math.round(y * 2)) % 3 === 0 ? '#E0B070' : v > .65 ? '#6B4020' : '#8C5A30', '#3A2416'); },
    bell: p => { p(2, -.5, 3, 1.5, '#E5484D'); p(1, .5, 5, 1, '#B83A32'); p(2.5, 0, 1, .5, '#F28AB2');
      blob(p, 3.5, 4, 3, 3, (u, v) => v < .2 ? null : u > .65 ? '#C99A2E' : u < .3 ? '#F7DC8B' : '#E9C46A', '#8A6418'); p(.25, 5.75, 6.5, 1, '#8A6418'); p(.5, 6, 6, .5, '#C99A2E'); p(3, 6.75, 1, 1, '#5E3826'); },
    candycane: p => { const seg = [[1, 0], [2, 0], [3, 0], [3.75, .5], [4, 1.5], [4, 2.5], [4, 3.5], [4, 4.5], [4, 5.5], [4, 6.5], [4, 7.5], [4, 8.5], [.5, .5], [0, 1.5], [0, 2.5]];
      seg.forEach(([x, y]) => p(x - .5, y - .5, 2, 2, '#8E1F2E')); seg.forEach(([x, y], k) => p(x, y, 1, 1, k % 2 ? '#FFFFFF' : '#E5484D')); p(4.25, 2, .25, 3, '#FFFFFF88'); },
    icicle: (p, t) => { p(1, 0, 1, 1, '#9A96A8'); p(0, .75, 3, .5, OUT);
      for (let y = 1; y < 10; y += .5) { const w = Math.max(.5, 3 - (y - 1) * .3); p(1.5 - w / 2 - .25, y, w + .5, .5, '#5E92C8'); p(1.5 - w / 2, y, w, .5, y < 4 ? '#BFE3F5' : '#D8EEF9'); }
      p(1, 2, .5, 3, '#FFFFFF'); if (Math.sin(t / 400) > .6) p(.5, 1.5, .5, .5, '#FFFFFF'); },
  };
  Object.entries(HD_DECO).forEach(([k, d]) => { if (DECO[k]) DECO[k].d = d; });
  Object.assign(HD, {
    present: (p, t, i) => { const [c, r] = GIFT_C[i], d = darker(c), rd = darker(r);
      rbox(p, 0, 3, 12, 8, c, OUT, .5); p(.5, 9.5, 11, 1, d); rbox(p, -1, 2, 14, 2.5, lighter(c, .2), OUT, .5);
      p(5, 2, 2, 9, OUT); p(5.5, 2, 1, 8.5, r); p(.5, 6, 11, 1, r); p(.5, 6.5, 11, .5, rd);
      blob(p, 4, 1, 2, 1.25, (u, v) => v > .6 ? rd : r, OUT); blob(p, 8, 1, 2, 1.25, (u, v) => v > .6 ? rd : r, OUT); p(5.5, .5, 1, 1.5, r); p(.5, 3.5, 2, .5, '#FFFFFF55'); },
    yarn: p => { blob(p, 3, 3, 3, 3, (u, v, x, y) => (Math.round((x - y) * 2) % 3 === 0) ? '#B83A32' : u + v < .6 ? '#F07C76' : '#E5484D'); p(5.5, 4.5, 3, .5, '#E5484D'); p(8, 4, .5, 1, '#E5484D'); },
  });
  Object.entries(HD).forEach(([k, d]) => { if (FURN[k]) FURN[k].d = d; });
  // ---------- награды Титоса за уровни 30/50/90/100 (этап 11 А, docs/titos.md «Награды за уровни»): игровые (game) — нет в магазине и каталоге; PPCanDo.TITOS ----------
  // кофейник: titospot:N — N-й полученный на сайте (счётчик в meta titos_pot_n), цвет кофе — оттенок по золотому углу и разная светлота
  const hsl = (h, s, l) => { s /= 100; l /= 100; const f = n => { const k = (n + h / 30) % 12, c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(c * 255).toString(16).padStart(2, '0'); }; return '#' + f(0) + f(8) + f(4); };
  const potCoffee = i => hsl((25 + i * 137.508) % 360, 50 + (i * 7) % 25, [26, 34, 20, 42, 30][i % 5]);
  const ABOUT = {
    'furn|chalkrug': ['A black rug with a chalk outline. The outline insists it is just lying down for a rest.', 'Чёрный ковёр с меловым силуэтом. Силуэт уверяет, что просто прилёг отдохнуть.', 'Melns paklājs ar krīta siluetu. Siluets apgalvo, ka vienkārši prilēcis atpūsties.'],
    'furn|titospot': ['The coffee in it sloshes all by itself — out of impatience.', 'Кофе в нём плещется сам по себе — от нетерпения.', 'Kafija tajā šļakstās pati no sevis — aiz nepacietības.'],
    'deco|clueboard': ['Stare at it long enough and everything becomes clear. Or not.', 'Если долго смотреть, всё становится понятно. Или нет.', 'Ja ilgi skatās, viss kļūst skaidrs. Vai arī nē.'],
    'deco|titosbadge': ['For those who solved all 100 cases. Titos personally polished it with his sleeve.', 'Для тех, кто раскрыл все 100 дел. Титос лично протёр его рукавом.', 'Tiem, kas atrisinājuši visas 100 lietas. Titoss to personīgi noslaucīja ar piedurkni.'],
  };
  Object.assign(FURN, {
    chalkrug: { n: N('Rug “Somebody Was Here”', 'Ковёр «Здесь кто-то был»', 'Paklājs “Šeit kāds bija”'), w: 44, h: 8, top: 5, flat: true, game: true, titos: true, // flat — плоский, как коврики: на нём стоят
      d: p => { const k = '#1E1A26', e = '#2E2838', c = '#F4F0FA', cd = '#B9B3C6';
        for (let y = 0; y < 8; y += .5) { const ins = Math.round((2.5 - y * .3) * 2) / 2; p(ins, y, 44 - 2 * ins, .5, y < .5 ? e : y > 7 ? '#0E0C14' : k); } // ковёр в перспективе
        for (let x = 1; x < 43.5; x += 1.5) p(x, 8, .5, .5, cd); // бахрома
        // меловой силуэт птички лёжа: контур головы, клюва, тела и хвоста по полупикселям; крыло, глаз-крестик и лапки — линиями
        const E = (x, y, cx, cy, rx, ry) => Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2) <= 1;
        const inS = (x, y) => E(x, y, 11, 3.5, 3.2, 2.2) || E(x, y, 21.5, 3.6, 8, 2.3) || E(x, y, 14, 3.5, 2, 1.5) || (x > 6 && x < 8.2 && Math.abs(y - 3.6) < (x - 6) * .6) || (x > 28 && x < 34 && Math.abs(y - 3.5) < (34 - x) * .4 + .3);
        for (let y = .25; y < 8; y += .5) for (let x = 5.25; x < 35; x += .5) if (inS(x, y) && (!inS(x - .5, y) || !inS(x + .5, y) || !inS(x, y - .5) || !inS(x, y + .5))) p(x - .25, y - .25, .5, .5, c);
        p(9.5, 2.5, .5, .5, c); p(10.5, 2.5, .5, .5, c); p(10, 3, .5, .5, c); p(9.5, 3.5, .5, .5, c); p(10.5, 3.5, .5, .5, c); p(11, .5, .5, .5, c); p(11.5, 0, .5, .5, c); p(12, .5, .5, .5, c); // глаз-крестик и хохолок
        for (let x = 16; x < 25; x += .5) p(x, 3 + Math.abs(x - 20.5) * .25, .5, .5, cd); // крыло
        [19, 23].forEach(x => { for (let k2 = 0; k2 < 2; k2++) p(x + k2 * .5, 6 + k2 * .5, .5, .5, c); p(x + 1, 7, .5, .5, c); p(x + 1.5, 6.5, .5, .5, c); p(x + 1.5, 7, 1, .5, c); }); // лапки
        p(36, 2, 2.5, 1.5, '#E9C46A'); p(36.5, 2.5, 1.5, .5, k); p(4, 6, .5, .5, cd); p(39, 5, .5, .5, cd); p(33, 6.5, .5, .5, cd); } }, // жёлтый номерок улики и меловые крошки
    titospot: { n: N('Detective’s coffee pot', 'Кофейник детектива', 'Detektīva kafijas kanna'), w: 13, h: 15, top: null, game: true, titos: true,
      d: (p, t, i) => { const cf = potCoffee(i || 0), cl = lighter(cf, .35), en = '#B8423A', ed = '#8E2F29', el = '#E06A5E', cr = '#D8DDE6', cd = '#9AA3B5';
        const tilt = Math.sin(t / 260) * .35, lvl = 8.25 + Math.sin(t / 410) * .4; // кофе плещется
        p(1, 6, 1.5, .5, OUT); p(.5, 6.5, .5, 4, OUT); p(1, 10.5, 1.5, .5, OUT); p(1, 6.5, 1, 4, ed); // ручка
        p(10.5, 7, 1, 1.5, OUT); p(11, 5.5, 1, 2, OUT); p(11.5, 4.5, 1.5, 1, OUT); p(11.5, 5.5, .5, 2.5, en); p(11.75, 4.75, .75, .5, cr); // носик
        blob(p, 6.5, 9.5, 4.5, 5, (u, v, x, y) => {
          if (u > .28 && u < .72 && v > .3 && v < .82) { // окошко: стекло и кофе
            if (u < .32 || u > .68 || v < .34 || v > .78) return cd;
            const top = lvl + (x - 6.5) * tilt; return y > top + .5 ? cf : y > top ? cl : '#C8DCE6';
          }
          return u < .25 && v < .5 ? el : v > .8 ? ed : en;
        });
        p(5, 12, 3, .5, en); // перемычка под окошком
        rbox(p, 3.5, 2.5, 6, 2.5, cr, OUT, .5); p(4, 3, 5, .5, '#FFFFFF'); // крышка
        p(5.5, 1, 2, 1.5, OUT); p(6, 1.25, 1, 1, '#E9C46A'); // шишечка
        if (Math.sin(t / 700) > .75) { p(6.25, -.5, .5, .5, '#D9D3F2'); p(6.75, -1.25, .5, .5, '#D9D3F2'); } // пар
        p(2.5, 14, 8, 1, OUT); p(3, 14, 7, .5, '#4B4466'); } },
  });
  Object.assign(DECO, {
    clueboard: { n: N('Evidence board', 'Доска улик', 'Pierādījumu dēlis'), w: 28, h: 19, game: true, titos: true,
      d: (p, t) => { const fr = '#6B4423', fl = '#8A5A2B', ck = '#C9955A', cs = '#B9844C', pa = '#F4F0FA', ph = '#2B2340', red = '#D33A2E';
        rbox(p, 0, 0, 28, 19, fr, OUT, .5); p(.5, .5, 27, .5, fl); p(1.5, 1.5, 25, 16, ck); // рамка и пробка
        for (let k = 0; k < 14; k++) p(2 + (k * 7.3) % 24, 2 + (k * 5.1) % 14, .5, .5, cs); // крапинки пробки
        p(3, 2.5, 6, 5, pa); p(3.5, 3, 5, 3.5, '#5E7A9A'); blob(p, 6, 5, 1.25, 1.25, () => '#2B2340', '#2B2340'); p(5, 6, 2.5, .5, '#2B2340'); // фото с силуэтом
        p(17, 2, 6, 4.5, '#F6D04D'); for (let y = 3; y < 6; y += 1) p(17.5, y, 4.5, .5, '#B5832A'); // жёлтый листок
        p(10.5, 9.5, 5, 6, pa); p(11, 10, 4, 3, '#C9CDD6'); p(11.5, 13.5, 3, .5, ph); p(11.5, 14.5, 2, .5, ph); // фото подозреваемого
        p(19.5, 9.5, 6, 4.5, pa); for (let y = 10.5; y < 14; y += 1) p(20, y, 5 - (y % 2), .5, '#9AA3B5'); // записка
        p(3, 11, 5, 5, '#F28AB2'); p(3.5, 12, 3.5, .5, '#B8423A'); p(3.5, 13.5, 3, .5, '#B8423A'); p(4.5, 14.5, 1.5, 1.5, '#B8423A'); // розовый листок с вопросом
        // красные нитки между кнопками (лёгкое покачивание)
        const s = Math.sin(t / 900) * .25, line = (x1, y1, x2, y2) => { const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2); for (let k = 0; k <= n; k++) { const q = k / n; p(x1 + (x2 - x1) * q, y1 + (y2 - y1) * q + Math.sin(q * Math.PI) * (.6 + s), .5, .5, red); } };
        const pins = [[6, 2.5], [20, 2.25], [13, 9.5], [22.5, 9.5], [5.5, 11]];
        line(6, 2.5, 13, 9.5); line(20, 2.25, 13, 9.5); line(13, 9.5, 22.5, 9.5); line(5.5, 11, 13, 9.5); line(6, 2.5, 20, 2.25);
        pins.forEach(([x, y]) => { p(x - .5, y - .5, 1, 1, red); p(x - .5, y - .5, .5, .5, '#FF8A80'); });
        p(24, 15, 2.5, 1.5, '#E9C46A'); p(24.5, 15.5, 1.5, .5, ph); } }, // номерок улики
    titosbadge: { n: N('Detective Titos’ golden badge', 'Золотой значок детектива Титоса', 'Detektīva Titosa zelta nozīmīte'), w: 15, h: 17, game: true, titos: true,
      d: (p, t) => { const fr = '#8A5A2B', fd = '#5E3A1A', fl = '#B07A44', vel = '#2B1A51', vd = '#1E1240', g = '#E9A93B', gd = '#B5781E', gl = '#FFE08A';
        rbox(p, 0, 0, 15, 17, fr, OUT, .5); p(.5, .5, 14, .5, fl); p(.5, 16, 14, .5, fd); p(1.5, 1.5, 12, 14, fd); p(2, 2, 11, 13, vel); p(2, 14, 11, 1, vd); // рамка и бархат
        // звезда-значок
        const star = [[7.5, 3.5], [8.5, 6], [11.25, 6.25], [9.25, 8.25], [10, 11], [7.5, 9.5], [5, 11], [5.75, 8.25], [3.75, 6.25], [6.5, 6]];
        const inS = (x, y) => { let c = false; for (let a = 0, b = star.length - 1; a < star.length; b = a++) { const [xa, ya] = star[a], [xb, yb] = star[b]; if ((ya > y) !== (yb > y) && x < (xb - xa) * (y - ya) / (yb - ya) + xa) c = !c; } return c; };
        const sweep = ((t / 40) % 60) - 10; // блик пробегает раз в несколько секунд
        for (let y = 3; y < 11.5; y += .5) for (let x = 3.5; x < 11.5; x += .5) { if (!inS(x + .25, y + .25)) continue;
          const edge = !inS(x - .25, y + .25) || !inS(x + .75, y + .25) || !inS(x + .25, y - .25) || !inS(x + .25, y + .75);
          const sh = Math.abs((x - 3.5) + (y - 3) - sweep) < 1; p(x, y, .5, .5, edge ? gd : sh ? '#FFFFFF' : x + y < 13 ? gl : g); }
        blob(p, 7.5, 7.5, 1.25, 1.25, () => gd, gd); p(7.25, 7.25, .5, .5, gl); // серединка
        p(4, 12.5, 7, 1.5, g); p(4.5, 13, 6, .5, gd); // табличка
        if (Math.sin(t / 600) > .85) { p(11.5, 3, .5, 1.5, '#FFFFFF'); p(11, 3.5, 1.5, .5, '#FFFFFF'); } } }, // искорка
  });
  const RECOLOR = {
    armchair: [['Armchair', 'Кресло', 'Krēsls'], [['red', 'красное', 'sarkans'], { '#4A9BA8': '#C9463D', '#357782': '#A8382F', '#6FBAC5': '#E06A5E' }], [['mustard', 'горчичное', 'sinepju'], { '#4A9BA8': '#D9A33B', '#357782': '#B5832A', '#6FBAC5': '#EBC064' }], [['lilac', 'сиреневое', 'ceriņu'], { '#4A9BA8': '#9C80D0', '#357782': '#7F5FB8', '#6FBAC5': '#B9A3E3' }]],
    beanbag: [['Beanbag', 'Кресло-мешок', 'Sēžammaiss'], [['blue', 'синий', 'zils'], { '#F08A3B': '#4A7BD8', '#E07A2E': '#3E68BD', '#C0651F': '#2F519A', '#F6A86A': '#7FA7E0' }], [['pink', 'розовый', 'rozā'], { '#F08A3B': '#F28AB2', '#E07A2E': '#E06A95', '#C0651F': '#C25579', '#F6A86A': '#F7B6C8' }], [['green', 'зелёный', 'zaļš'], { '#F08A3B': '#4CC38A', '#E07A2E': '#3EA874', '#C0651F': '#2E8A5E', '#F6A86A': '#8EE0B4' }]],
    bed: [['Cozy bed', 'Уютная кровать', 'Mājīga gulta'], [['pink blanket', 'розовое одеяло', 'rozā sega'], { '#7FB3E8': '#F28AB2', '#9FCDEB': '#F7B6C8' }], [['green blanket', 'зелёное одеяло', 'zaļa sega'], { '#7FB3E8': '#8DB596', '#9FCDEB': '#A9CBB0' }], [['yellow blanket', 'жёлтое одеяло', 'dzeltena sega'], { '#7FB3E8': '#E9C46A', '#9FCDEB': '#F7DC8B' }]],
    table: [['Table', 'Стол', 'Galds'], [['dark wood', 'тёмное дерево', 'tumšs koks'], { '#A0673C': '#5B3A2A', '#7A4A28': '#3E281C' }], [['white', 'белый', 'balts'], { '#A0673C': '#F4F0FA', '#7A4A28': '#C9CDD6' }], [['pink', 'розовый', 'rozā'], { '#A0673C': '#E58CA8', '#7A4A28': '#C46B88' }]],
    lamp: [['Floor lamp', 'Торшер', 'Stāvlampa'], [['pink', 'розовый', 'rozā'], { '#F6D04D': '#F7B6C8', '#F6C445': '#F28AB2', '#D9A33B': '#C46B88' }], [['mint', 'мятный', 'piparmētru'], { '#F6D04D': '#A8E6CF', '#F6C445': '#8EE0B4', '#D9A33B': '#4CC38A' }], [['blue', 'голубой', 'zils'], { '#F6D04D': '#BFE3F5', '#F6C445': '#7FB3E8', '#D9A33B': '#4A7BD8' }]],
    mug: [['Mug of cocoa', 'Кружка какао', 'Kakao krūze'], [['red', 'красная', 'sarkana'], { '#F4EBDD': '#E5484D' }], [['blue', 'синяя', 'zila'], { '#F4EBDD': '#4A7BD8' }], [['yellow', 'жёлтая', 'dzeltena'], { '#F4EBDD': '#F6D04D' }]],
    vase: [['Flower vase', 'Ваза с цветами', 'Vāze ar ziediem'], [['pink', 'розовая', 'rozā'], { '#7FB3E8': '#F28AB2', '#BFE3F5': '#F7B6C8' }], [['yellow', 'жёлтая', 'dzeltena'], { '#7FB3E8': '#E9C46A', '#BFE3F5': '#F7DC8B' }], [['green', 'зелёная', 'zaļa'], { '#7FB3E8': '#4CC38A', '#BFE3F5': '#8EE0B4' }]],
    plant: [['Monstera', 'Монстера', 'Monstera'], [['white pot', 'белый горшок', 'balts pods'], { '#C66B4A': '#F4F0FA', '#A8553A': '#C9CDD6', '#D9825F': '#FFFFFF' }], [['blue pot', 'синий горшок', 'zils pods'], { '#C66B4A': '#4A7BD8', '#A8553A': '#3E68BD', '#D9825F': '#7FA7E0' }], [['yellow pot', 'жёлтый горшок', 'dzeltens pods'], { '#C66B4A': '#E9C46A', '#A8553A': '#C99A2E', '#D9825F': '#F7DC8B' }]],
    bookshelf: [['Bookshelf', 'Книжная полка', 'Grāmatu plaukts'], [['white', 'белая', 'balts'], { '#7A4A30': '#F4F0FA', '#4E2F1F': '#C9CDD6' }], [['black', 'чёрная', 'melns'], { '#7A4A30': '#2B2340', '#4E2F1F': '#1A1528' }], [['mint', 'мятная', 'piparmētru'], { '#7A4A30': '#8EE0B4', '#4E2F1F': '#4CC38A' }]],
    nightstand: [['Nightstand', 'Тумбочка', 'Naktsgaldiņš'], [['white', 'белая', 'balts'], { '#A0673C': '#FFFFFF', '#8C5A3A': '#F4F0FA', '#6B4329': '#C9CDD6' }], [['pink', 'розовая', 'rozā'], { '#A0673C': '#F7B6C8', '#8C5A3A': '#F28AB2', '#6B4329': '#C46B88' }], [['blue', 'голубая', 'zils'], { '#A0673C': '#BFE3F5', '#8C5A3A': '#7FB3E8', '#6B4329': '#4A7BD8' }]],
    fridge: [['Fridge', 'Холодильник', 'Ledusskapis'], [['mint', 'мятный', 'piparmētru'], { '#F4F0FA': '#A8E6CF' }], [['pink', 'розовый', 'rozā'], { '#F4F0FA': '#F7B6C8' }], [['retro red', 'ретро-красный', 'retro sarkans'], { '#F4F0FA': '#E5484D' }]],
    gamingchair: [['Gaming chair', 'Игровое кресло', 'Spēļu krēsls'], [['blue', 'синее', 'zils'], { '#E5484D': '#4A7BD8' }], [['green', 'зелёное', 'zaļš'], { '#E5484D': '#4CC38A' }], [['pink', 'розовое', 'rozā'], { '#E5484D': '#F28AB2' }]],
    guitar: [['Guitar', 'Гитара', 'Ģitāra'], [['red', 'красная', 'sarkana'], { '#E8812E': '#C9463D' }], [['blue', 'синяя', 'zila'], { '#E8812E': '#4A7BD8' }], [['black', 'чёрная', 'melna'], { '#E8812E': '#2B2340', '#2B2340': '#E9C46A' }]],
    rubberduck: [['Giant rubber duck', 'Огромная резиновая уточка', 'Milzu gumijas pīlīte'], [['pink', 'розовая', 'rozā'], { '#F6D04D': '#F7B6C8', '#E9B23B': '#F28AB2' }], [['blue', 'голубая', 'zila'], { '#F6D04D': '#BFE3F5', '#E9B23B': '#7FB3E8' }], [['gold', 'золотая', 'zelta'], { '#F6D04D': '#E9C46A', '#E9B23B': '#C99A2E' }]],
    cat: [['House cat', 'Домашний котик', 'Mājas kaķītis'], [['grey', 'серый', 'pelēks'], { '#F08A3B': '#9A96A8' }], [['white', 'белый', 'balts'], { '#F08A3B': '#F4F0FA' }], [['black', 'чёрный', 'melns'], { '#F08A3B': '#3A3448', '#2B2340': '#F6D04D' }]],
    pouf: [['Knitted pouf', 'Вязаный пуф', 'Adīts pufs'], [['pink', 'розовый', 'rozā'], { '#E6D3B0': '#F7B6C8', '#CDB78F': '#E79AB0' }], [['mint', 'мятный', 'piparmētru'], { '#E6D3B0': '#A8E6CF', '#CDB78F': '#8ECDB4' }], [['grey', 'серый', 'pelēks'], { '#E6D3B0': '#C9CDD6', '#CDB78F': '#9A96A8' }]],
  };
  Object.entries(RECOLOR).forEach(([k, r]) => {
    const d = FURN[k]; if (!d) return;
    const base = d.n, draw = d.d;
    d.rc = r.length - 1; // вариантов перекраски
    d.n = i => i ? r[0].map((nm, l) => `${nm} (${r[i][0][l]})`) : base(0);
    d.d = (p, t, i, room) => { const m = i ? r[i][1] : null; draw(m ? (x, y, w, h, c) => p(x, y, w, h, m[c] || c) : p, t, 0, room); };
  });

  // ---------- легендарное и забавное (10.10.2026, Алина: «легендарных мало, сделай забавное») ----------
  Object.assign(WALL, {
    stainedglass: [['Stained glass', 'Витраж', 'Vitrāža'], g => { const c = ['#E5484D', '#4A7BD8', '#F6D04D', '#4CC38A', '#9B5DE5', '#F08A3B']; for (let y = 0; y < FY; y += 8) for (let x = 0; x < RW; x += 8) { R(g, x, y, 8, 8, '#2B2340'); R(g, x + 1, y + 1, 6, 6, c[(x / 8 * 7 + y / 8 * 3) % 6]); R(g, x + 2, y + 2, 2, 2, 'rgba(255,255,255,.35)'); } }],
  });
  Object.assign(FLOOR, {
    clouds: [['Walking on clouds', 'Пол из облаков', 'Mākoņu grīda'], g => { R(g, 0, FY, RW, RH - FY, '#BFE3F8'); const r = rngOf(12); for (let i = 0; i < 26; i++) { const x = r() * RW, y = FY + 2 + r() * 26, w = 10 + r() * 16; R(g, x, y, w, 3, '#FFFFFF'); R(g, x + 3, y - 2, w - 6, 2, '#FFFFFF'); } }],
    goldtiles: [['Golden tiles', 'Золотая плитка', 'Zelta flīzes'], g => { R(g, 0, FY, RW, RH - FY, '#C99A2E'); for (let y = FY; y < RH; y += 8) for (let x = ((y - FY) / 8 % 2) * 4; x < RW; x += 8) { R(g, x, y, 7, 7, '#E9C46A'); R(g, x + 1, y + 1, 2, 1, '#F7DC8B'); } }],
  });
  Object.assign(VIEW, {
    dragonsky: [['Dragon over the castle', 'Дракон над замком', 'Pūķis virs pils'], (g, x, y, t) => { sky(g, x, y, ['#F6A86A', '#F9C77E', '#FBE0A0']); R(g, x + 4, y + 22, 12, 20, '#7E7A8A'); R(g, x + 4, y + 18, 2, 4, '#7E7A8A'); R(g, x + 9, y + 18, 2, 4, '#7E7A8A'); R(g, x + 14, y + 18, 2, 4, '#7E7A8A'); R(g, x + 8, y + 30, 3, 5, '#2B2340'); R(g, x, y + WH - 4, WW, 4, '#6FA86A'); const dx = x + ((t / 40) % (WW + 16)) - 8, dy = y + 10 + Math.sin(t / 300) * 3, f = Math.floor(t / 200) % 2; R(g, dx, dy, 8, 3, '#C9463D'); R(g, dx + 7, dy - 1, 3, 2, '#C9463D'); R(g, dx + 2, dy - (f ? 3 : 0), 4, 3, '#A8382F'); R(g, dx - 3, dy + 1, 3, 1, '#C9463D'); if (f) R(g, dx + 10, dy - 1, 3, 1, '#F6C445'); }],
  });
  Object.assign(CURT, {
    starlight: [['Starlight curtains', 'Шторы из звёздного света', 'Zvaigžņu gaismas aizkari'], ['#1B1E45', '#2B2F5A'], '#FFE9A8'],
  });
  Object.assign(FURN, {
    // легендарные
    dragon: { n: N('Baby dragon on gold', 'Дракончик на золоте', 'Pūķēns uz zelta'), w: 26, h: 18, top: null, d: (p, t) => { p(0, 12, 26, 6, '#E9C46A'); for (let x = 1; x < 25; x += 3) p(x, 11 + (x % 2), 2, 1, '#F7DC8B'); const br = Math.sin(t / 700) > 0 ? 1 : 0; spr((a, b, w, h, c) => p(4 + a, b + 1 - br, w, h, c), ['.........gg.....', '........gggg....', '..g....ggkggg...', '.ggg..gggggggo..', 'gggggggggggg....', '.ggGGGGGggg.....', '..gggggggg......', '...g..g.........'], { g: '#4CC38A', G: '#8EE0B4', k: '#2B2340', o: '#F6D04D' }); if (Math.floor(t / 900) % 3 === 0) { p(21, 2, 2, 1, 'rgba(200,200,210,.8)'); p(23, 0, 2, 1, 'rgba(200,200,210,.6)'); } if (Math.sin(t / 300) > .8) p(8, 10, 1, 1, '#FFFFFF'); } },
    portal: { n: N('Magic portal', 'Волшебный портал', 'Burvju portāls'), w: 20, h: 30, top: null, glow: [10, 14], d: (p, t) => { p(1, 0, 18, 30, '#5B5670'); p(3, 2, 14, 26, '#1B1240'); for (let k = 0; k < 6; k++) { const a = t / 300 + k; p(10 + Math.round(Math.cos(a) * (6 - k)), 15 + Math.round(Math.sin(a) * (11 - k * 1.6)), 2, 2, ['#9B5DE5', '#4CE3A0', '#7FB3E8', '#F28AB2', '#F6D04D', '#FFFFFF'][k]); } p(0, 28, 20, 2, '#3E3550'); } },
    treasure: { n: N('Pile of treasure', 'Гора сокровищ', 'Dārgumu kalns'), w: 22, h: 12, top: 4, d: (p, t) => { for (let y = 0; y < 12; y++) { const w = Math.round(22 * Math.sqrt(y / 12)); p(11 - w / 2, y, w, 1, y % 3 ? '#E9C46A' : '#C99A2E'); } p(9, 3, 2, 2, '#E5484D'); p(13, 6, 2, 2, '#4A7BD8'); p(5, 9, 2, 2, '#4CC38A'); const s = Math.floor(t / 250) % 4; p([10, 14, 6, 16][s], [2, 5, 8, 9][s], 1, 1, '#FFFFFF'); } },
    phoenixnest: { n: N('Phoenix nest', 'Гнездо феникса', 'Fēniksa ligzda'), w: 20, h: 14, top: null, glow: [10, 4], d: (p, t) => { const f = Math.floor(t / 130) % 3; p(6 + f, 2, 3, 6, '#F08A3B'); p(9, 0 + f, 3, 8, '#F6C445'); p(12 - f, 3, 3, 5, '#E5484D'); p(9, 3, 2, 2, '#FFE08A'); p(0, 8, 20, 6, '#8C5A30'); for (let x = 0; x < 20; x += 3) p(x, 8 + (x % 2), 2, 1, '#B9824A'); p(7, 7, 3, 3, '#F7DC8B'); p(11, 7, 3, 3, '#F7DC8B'); } },
    pollystatue: { n: N('Golden Polly statue', 'Золотая статуя Полли', 'Pollijas zelta statuja'), w: 14, h: 24, top: null, d: (p, t) => { spr((a, b, w, h, c) => p(1 + a, b, w, h, c), ['....ddd.....', '...dbbbd....', '..dbbwbd....', '..dbbkbdoo..', '..dbbbbbd...', '.dbbsbbbbd..', 'dbbssbbbbd..', 'dbbbbbbbbd..', '.ddddddddd..', '...o..o.....'], { d: '#C99A2E', b: '#E9C46A', s: '#F7DC8B', w: '#FFF3B0', k: '#8C6A1E', o: '#C99A2E' }); p(1, 10, 12, 2, '#9A96A8'); p(2, 12, 10, 10, '#C9CDD6'); p(1, 22, 12, 2, '#9A96A8'); p(4, 15, 6, 1, '#E9C46A'); if (Math.sin(t / 400) > .7) p(10, 1, 1, 1, '#FFFFFF'); } },
    // забавные
    giantpizza: { n: N('Giant pizza beanbag', 'Пуф-пицца', 'Picas pufs'), w: 22, h: 12, top: 4, sit: true, d: S(['kkkkkkkkkkkkkkkkkkkkkk', 'kyyryyyyyyyryyyygyyyk.', '.kyyyygyyyryyyyyyyyk..', '..kyyyyyyyyyyyryyyk...', '...kyryyyyyyyyyyyk....', '....kyyyyyygyyyyk.....', '.....kyyyryyyyyk......', '......kyyyyyyk........', '.......kyyyyk.........', '........kyyk..........'], { k: '#D9A45B', y: '#F6D04D', r: '#E5484D', g: '#4CC38A' }) },
    rubberduck: { n: N('Giant rubber duck', 'Огромная резиновая уточка', 'Milzu gumijas pīlīte'), w: 18, h: 16, top: null, d: S(['.....yyyy.........', '....yyyyyy........', '....yykyyyoo......', '....yyyyyyooo.....', '.....yyyyyy.......', 'y...yyyyyyy.......', 'yy.yyyyyyyyyy.....', 'yyyyyyyyyyyyyyy...', 'yyyyyyyyyyyyyyyy..', '.yyyyyyYYYyyyyyy..', '.yyyyyyyyyyyyyy...', '..yyyyyyyyyyyy....', '....yyyyyyyy......'], { y: '#F6D04D', Y: '#E9B23B', k: '#2B2340', o: '#F08A3B' }) },
    toaster: { n: N('Toaster', 'Тостер', 'Tosteris'), w: 13, h: 12, top: null, d: (p, t) => { const up = Math.floor(t / 1600) % 3 === 0 ? 4 : 0; p(3, 2 - up, 3, 4, '#D9A45B'); p(7, 2 - up, 3, 4, '#D9A45B'); p(0, 4, 13, 8, '#C9CDD6'); p(1, 5, 11, 1, '#E6E6EE'); p(3, 4, 3, 1, '#2B2340'); p(7, 4, 3, 1, '#2B2340'); p(12, 7, 1, 2, '#2B2340'); p(2, 9, 2, 1, '#E5484D'); } },
    lavalamp: { n: N('Lava lamp', 'Лава-лампа', 'Lavas lampa'), w: 8, h: 18, top: null, glow: [4, 8], d: (p, t) => { p(2, 0, 4, 2, '#5B5670'); p(1, 2, 6, 12, 'rgba(155,93,229,.55)'); for (let k = 0; k < 3; k++) { const by = 3 + ((t / (400 + k * 150) + k * 3) % 9); p(2 + (k % 2) * 2, Math.round(by), 2 + (k === 1 ? 1 : 0), 2, '#F28AB2'); } p(0, 14, 8, 4, '#5B5670'); } },
    cattower: { n: N('Cat tower', 'Кошачий домик', 'Kaķu tornis'), w: 18, h: 34, top: 0, d: p => { p(0, 0, 18, 3, '#D9C29A'); p(7, 3, 4, 10, '#B98236'); p(2, 13, 14, 9, '#D9C29A'); p(6, 16, 6, 6, '#2B2340'); p(7, 22, 4, 8, '#B98236'); p(0, 30, 18, 4, '#D9C29A'); p(14, 3, 1, 4, '#E5484D'); p(13, 7, 3, 3, '#E5484D'); } },
    bathtub: { n: N('Bathtub with bubbles', 'Ванна с пеной', 'Vanna ar putām'), w: 34, h: 16, top: null, d: (p, t) => { p(0, 4, 34, 9, '#F4F0FA'); p(1, 5, 32, 1, '#BFE3F5'); for (let k = 0; k < 9; k++) { const o = Math.round(Math.sin(t / 400 + k) * 1); p(2 + k * 3.5, 1 + o, 4, 4, '#FFFFFF'); } spr((a, b, w, h, c) => p(22 + a, b - 2, w, h, c), ['.yy.', 'ykyo', 'yyy.'], { y: '#F6D04D', k: '#2B2340', o: '#F08A3B' }); p(3, 13, 3, 3, '#C9CDD6'); p(28, 13, 3, 3, '#C9CDD6'); p(32, 0, 2, 5, '#C9CDD6'); } },
    mrchew: { n: N('Mr.Chew figurine', 'Фигурка Мистера Чу', 'Mr.Chew figūriņa'), w: 16, h: 13, top: null, d: S(['.k.k............', '.k.k....oooo....', '.ggg...ooOOoo...', 'gkgkg.ooOooOoo..', 'ggggg.oOooOOoo..', '.ggg..oOoooOoo..', '.ggggggoOOOooo..', 'gggggggggoooo...', 'ggggggggggggggg.', '.ggggggggggggg..'], { g: '#8EC27A', k: '#2B2340', o: '#C9955E', O: '#8C5A30' }) },
    coatstand: { n: N('Detective’s coat stand', 'Вешалка детектива', 'Detektīva pakaramais'), w: 14, h: 36, top: null, d: S(['....kkkkk.....', '...kkkkkkk....', '..kkkkkkkkk...', '......n.......', '....tttttt....', '...tttTtttt...', '...ttttttttt..', '...tttTtttt...', '...ttttttttt..', '...tttTtttt...', '...tttttttt...', '...ttttttttt..', '......n.......', '......n.......', '......n.......', '......n.......', '......n.......', '......n.......', '......n.......', '......n.......', '......n.......', '......n.......', '......n.......', '....nnnnn.....'], { k: '#5B3A1E', n: '#3E281C', t: '#C9A35B', T: '#2B2340' }) },
    wormchips: { n: N('Jar of worm chips', 'Банка червячковых чипсов', 'Tārpu čipsu burka'), w: 10, h: 12, top: null, d: S(['.rrrrrr...', '.rrrrrr...', 'wwwwwwww..', 'wpwwpwpw..', 'wwpppwww..', 'wwwwwpww..', 'wppwwwpw..', 'wwwpwwww..', 'wwwwwwww..', '.wwwwww...'], { r: '#E5484D', w: 'rgba(230,245,255,.85)', p: '#F28AB2' }) },
    flytrap: { n: N('Hungry flytrap', 'Голодная мухоловка', 'Izsalkušā mušķērāja'), w: 12, h: 16, top: null, d: (p, t) => { const o = Math.floor(t / 500) % 2; p(3 - o, 0, 6, 3, '#4CC38A'); p(3 - o, 0, 6, 1, '#E5484D'); p(3 + o, 4, 6, 3, '#4CC38A'); p(3 + o, 6, 6, 1, '#E5484D'); for (let x = 4; x < 9; x += 2) { p(x - o, 3, 1, 1, '#FFFFFF'); } p(5, 7, 2, 4, '#3E8E5A'); p(2, 11, 8, 5, '#C66B4A'); p(1, 10, 10, 1, '#A8553A'); } },
    robovac: { n: N('Robot vacuum', 'Робот-пылесос', 'Robotputekļsūcējs'), w: 30, h: 4, top: null, d: (p, t) => { const x = Math.round((Math.sin(t / 1500) + 1) * 9); p(x, 0, 12, 4, '#2B2340'); p(x + 1, 0, 10, 1, '#5B5670'); p(x + 5, 1, 2, 1, Math.floor(t / 300) % 2 ? '#4CC38A' : '#2B2340'); } },
    socks: { n: N('Pile of lost socks', 'Куча потерянных носков', 'Pazudušo zeķu kaudze'), w: 16, h: 8, top: null, d: S(['....rr..bb......', '...rrr.bbbb.....', '..grrrrbbbyy....', '.ggggpppbyyyy...', 'ggggpppppyyyyy..', 'gggppppwwwyyyyy.'], { r: '#E5484D', b: '#4A7BD8', y: '#F6D04D', g: '#4CC38A', p: '#F28AB2', w: '#FFFFFF' }) },
    tamagotchi: { n: N('Pocket pet', 'Тамагочи', 'Kabatas mīlulis'), w: 7, h: 8, top: null, d: (p, t) => { p(1, 0, 5, 1, '#F28AB2'); p(0, 1, 7, 7, '#F28AB2'); p(1, 2, 5, 3, '#BFE3C9'); p(2 + Math.floor(t / 500) % 2, 3, 2, 1, '#2B2340'); p(1, 6, 1, 1, '#FFFFFF'); p(3, 6, 1, 1, '#FFFFFF'); p(5, 6, 1, 1, '#FFFFFF'); } },
    giantcoffee: { n: N('Giant coffee cup', 'Огромная чашка кофе', 'Milzu kafijas krūze'), w: 18, h: 16, top: 0, d: (p, t) => { p(0, 0, 14, 2, '#8B5A3C'); p(0, 2, 14, 12, '#F4F0FA'); p(14, 4, 4, 2, '#F4F0FA'); p(16, 6, 2, 4, '#F4F0FA'); p(14, 10, 4, 2, '#F4F0FA'); p(3, 6, 8, 4, '#E5484D'); p(5, 5, 4, 1, '#E5484D'); p(0, 14, 16, 2, '#C9CDD6'); if (Math.sin(t / 400) > 0) p(5, -3, 1, 2, '#FFFFFF'); else p(8, -4, 1, 2, '#FFFFFF'); } },
    nestbed: { n: N('Nest bed', 'Кровать-гнездо', 'Ligzdas gulta'), w: 26, h: 10, top: 3, sit: true, d: p => { p(2, 0, 22, 4, '#F4EBDD'); p(5, 0, 6, 3, '#FFFFFF'); for (let y = 3; y < 10; y++) { const w = 26 - Math.abs(y - 6) * 2; p((26 - w) / 2, y, w, 1, y % 2 ? '#B9824A' : '#8C5A30'); } } },
  });
  Object.assign(DECO, {
    rainbowarc: { n: N('Wall rainbow', 'Радуга на стене', 'Varavīksne pie sienas'), w: 30, h: 16, d: p => { const c = ['#E5484D', '#F08A3B', '#F6D04D', '#4CC38A', '#4A7BD8', '#9B5DE5']; for (let y = 0; y < 16; y++) for (let x = 0; x < 30; x++) { const d = Math.hypot(x - 14.5, y - 15.5), band = Math.floor(14.5 - d); if (band >= 0 && band < 6 && d <= 14.5) p(x, y, 1, 1, c[band]); } } },
    constellation: { n: N('Living constellation', 'Живое созвездие', 'Dzīvs zvaigznājs'), w: 30, h: 16, d: (p, t) => { const pts = [[1, 12], [7, 6], [13, 9], [19, 2], [25, 7], [28, 14]]; pts.forEach(([x, y], i) => { const on = Math.sin(t / 400 + i) > -.3; p(x, y, 2, 2, on ? '#FFE9A8' : '#B9A86A'); if (on) { p(x - 1, y, 1, 1, 'rgba(255,233,168,.5)'); p(x + 2, y + 1, 1, 1, 'rgba(255,233,168,.5)'); } }); for (let i = 0; i < pts.length - 1; i++) { const [a, b] = pts[i], [c, d] = pts[i + 1]; for (let k = 1; k < 6; k++) p(Math.round(a + (c - a) * k / 6), Math.round(b + (d - b) * k / 6) + 1, 1, 1, 'rgba(255,233,168,.35)'); } } },
    cuckoo: { n: N('Cuckoo clock', 'Часы с кукушкой', 'Dzeguzes pulkstenis'), w: 14, h: 18, d: (p, t) => { p(0, 2, 14, 2, '#5B3A1E'); p(2, 0, 10, 2, '#5B3A1E'); p(1, 4, 12, 11, '#8C5A30'); p(5, 5, 4, 3, '#2B2340'); if (Math.floor(t / 1200) % 4 === 0) { p(6, 5, 4, 3, '#F6D04D'); p(10, 6, 2, 1, '#F08A3B'); } p(4, 9, 6, 5, '#F4EBDD'); p(7, 10, 1, 3, '#2B2340'); p(7, 12, 2, 1, '#2B2340'); p(5, 15, 1, 3, '#C99A2E'); p(9, 15, 1, 2, '#C99A2E'); } },
    moosehead: { n: N('Plush moose head', 'Плюшевая голова лося', 'Plīša aļņa galva'), w: 18, h: 14, d: S(['nn..........nn....', 'n.nn......nn.n....', 'nnnn......nnnn....', '...nn....nn.......', '....bbbbbb........', '...bbkbbkbb.......', '...bbbbbbbb.......', '....bbbbbb........', '....bBBBBb........', '.....BkBk.........', '....wwwwww........', '...wwwwwwww.......'], { n: '#D9C29A', b: '#8C5A30', B: '#B9824A', k: '#2B2340', w: '#7A4A30' }) },
    crookedart: { n: N('Crooked painting', 'Кривая картина', 'Šķība glezna'), w: 20, h: 16, d: p => { for (let y = 0; y < 14; y++) { const o = Math.round(y / 4); p(o, y, 18, 1, y === 0 || y === 13 ? '#C99A2E' : '#C99A2E'); p(o + 2, y, 14, 1, y < 2 || y > 11 ? '#C99A2E' : y < 7 ? '#9FD3F5' : '#6FBF6A'); } p(9, 5, 3, 3, '#F6D04D'); p(6, 12, 1, 3, '#2B2340'); } },
    ufo: { n: N('Toy UFO', 'Игрушечное НЛО', 'Rotaļu NLO'), w: 16, h: 12, d: (p, t) => { const o = Math.round(Math.sin(t / 500) * 2); p(8, 0, 1, 2 + o, '#C9C9D6'); p(5, 2 + o, 6, 3, 'rgba(160,220,250,.85)'); p(1, 5 + o, 14, 3, '#9A96A8'); p(0, 6 + o, 16, 1, '#C9CDD6'); for (let k = 0; k < 4; k++) p(2 + k * 4, 7 + o, 1, 1, Math.floor(t / 200 + k) % 2 ? '#F6D04D' : '#E5484D'); if (Math.floor(t / 700) % 2) p(5, 8 + o, 6, 3, 'rgba(76,227,160,.3)'); } },
    balloons: { n: N('Balloons', 'Воздушные шарики', 'Baloni'), w: 14, h: 22, d: (p, t) => { const o = Math.round(Math.sin(t / 600)); [[1, 0, '#E5484D'], [6, 2, '#4A7BD8'], [10, 0, '#F6D04D']].forEach(([x, y, c]) => { p(x, y + o, 4, 5, c); p(x + 1, y + 5 + o, 2, 1, c); p(x + 1, y + 1 + o, 1, 1, '#FFFFFF'); }); for (let y = 7; y < 22; y++) { p(6 + Math.round(Math.sin(y / 3) * .6), y, 1, 1, '#9A96A8'); } } },
    wormposter: { n: N('“Worm chips” poster', 'Постер «Червячковые чипсы»', 'Plakāts «Tārpu čipsi»'), w: 16, h: 20, d: p => { p(0, 0, 16, 20, '#F6D04D'); p(1, 1, 14, 3, '#E5484D'); p(3, 2, 10, 1, '#FFFFFF'); p(3, 6, 10, 10, '#E5484D'); p(4, 7, 8, 8, '#F7B6C8'); p(5, 9, 1, 1, '#2B2340'); p(9, 9, 1, 1, '#2B2340'); p(6, 12, 4, 1, '#2B2340'); p(2, 17, 12, 1, '#2B2340'); } },
  });

  // ---------- новинки (13.10.2026): по несколько вещей в каждую категорию ----------
  Object.assign(FURN, {
    rockingchair: { n: N('Rocking chair', 'Кресло-качалка', 'Šūpuļkrēsls'), w: 18, h: 20, top: 10, sit: true, d: (p, t) => { const o = Math.round(Math.sin(t / 700)); const w = '#9A6A3E', d = '#6E4628', l = '#C08A55';
      for (let k = 0; k < 4; k++) p(3 + k * 3 + o, 0, 2, 10, k % 2 ? d : w); p(2 + o, 0, 13, 1, l); p(1, 10, 16, 3, w); p(2, 10, 14, 1, l); p(3, 13, 2, 4, d); p(13, 13, 2, 4, d); p(0, 17, 18, 1, d); p(1, 18, 16, 1, w); p(0, 16, 1, 1, d); p(17, 16, 1, 1, d); } },
    wardrobe: { n: N('Wardrobe', 'Платяной шкаф', 'Drēbju skapis'), w: 24, h: 40, top: 0, d: p => { p(0, 0, 24, 2, '#6E4628'); p(1, 2, 22, 36, '#9A6A3E'); p(2, 3, 9, 33, '#B07C4A'); p(13, 3, 9, 33, '#B07C4A'); p(11, 3, 2, 33, '#6E4628'); p(9, 17, 1, 4, '#E9C46A'); p(14, 17, 1, 4, '#E9C46A'); p(3, 4, 7, 1, '#C8955E'); p(14, 4, 7, 1, '#C8955E'); p(1, 38, 3, 2, '#5B3A1E'); p(20, 38, 3, 2, '#5B3A1E'); } },
    dresser: { n: N('Chest of drawers', 'Комод', 'Kumode'), w: 26, h: 18, top: 0, d: p => { p(0, 0, 26, 2, '#E9E2D4'); p(1, 2, 24, 14, '#F4EFE5'); for (let k = 0; k < 3; k++) { p(2, 3 + k * 4.5, 22, 4, '#E2DACB'); p(11, 4.5 + k * 4.5, 4, 1, '#C9A13B'); } p(2, 16, 2, 2, '#B8AE9C'); p(22, 16, 2, 2, '#B8AE9C'); } },
    aquarium: { n: N('Aquarium', 'Аквариум', 'Akvārijs'), w: 24, h: 18, top: 0, d: (p, t) => { p(0, 0, 24, 1, '#2B2340'); p(0, 1, 24, 14, 'rgba(120,200,240,.75)'); p(1, 2, 22, 1, 'rgba(255,255,255,.5)'); p(0, 13, 24, 2, '#E9D7A8');
      [[3, 9, '#5E9E45'], [5, 7, '#4C8A3A'], [19, 8, '#5E9E45']].forEach(([x, y, c]) => p(x, y, 1, 13 - y, c));
      const f = 3 + (t / 60) % 18; p(Math.round(f), 6, 3, 2, '#F08A3B'); p(Math.round(f) - 1, 6.5, 1, 1, '#F08A3B'); const g2 = 18 - (t / 90) % 17; p(Math.round(g2), 10, 3, 2, '#F6D04D'); p(Math.round(g2) + 3, 10.5, 1, 1, '#F6D04D');
      for (let i = 0; i < 3; i++) p(15 + i, 11 - ((t / 140 + i * 4) % 10), 1, 1, '#FFFFFF'); p(0, 15, 24, 3, '#2B2340'); p(1, 15, 22, 1, '#4A4258'); } },
    sidetable: { n: N('Side table', 'Столик у кровати', 'Galdiņš'), w: 12, h: 12, top: 0, d: p => { p(0, 0, 12, 2, '#C8955E'); p(1, 1, 10, .5, '#D9AC78'); p(2, 2, 8, 6, '#A3733F'); p(4, 4, 4, 1, '#E9C46A'); p(2, 8, 1, 4, '#7A4E2A'); p(9, 8, 1, 4, '#7A4E2A'); } },
    monstera: { n: N('Monstera', 'Монстера', 'Monstera'), w: 18, h: 26, top: null, d: S(['......g...gg......', '..gg.ggg.gGgg..g..', '.gGgggg.gggggggGg.', 'ggggg.gggg.ggggggg', '.gggggg.gg.gggggg.', '..ggg.ggGgg.gggg..', '.gggggggggggg.ggg.', 'gggg.gggggg.ggggg.', '.ggggg.gg.ggggg...', '..gg.gggggggg.....', '.....gg.g.gg......', '......g.g.g.......', '.......ggg........', '........g.........', '........g.........', '....tttttttttt....', '....tTTTTTTTTt....', '....tttttttttt....', '.....tttttttt.....', '.....tttttttt.....', '.....tttttttt.....', '......tttttt......'], { g: '#3E8E4F', G: '#6CC27E', t: '#C8794B', T: '#E09B6A' }) },
    hamster: { n: N('Hamster in a wheel', 'Хомяк в колесе', 'Kāmis ritenī'), w: 16, h: 14, top: null, d: (p, t) => { p(0, 13, 16, 1, '#9A96A8'); p(7, 7, 2, 6, '#9A96A8'); const r = 6, cx = 8, cy = 7; for (let a = 0; a < 16; a++) { const an = a / 16 * Math.PI * 2; p(Math.round(cx + Math.cos(an) * r), Math.round(cy + Math.sin(an) * r), 1, 1, '#C9CDD6'); }
      const k = Math.floor(t / 120) % 2; p(6, 9, 5, 3, '#E9A35B'); p(10, 9, 2, 2, '#E9A35B'); p(11, 9, 1, 1, '#2A2433'); p(6, 9, 1, 1, '#F4E2C8'); p(7 + k, 12, 1, 1, '#F2A8B4'); p(9 - k, 12, 1, 1, '#F2A8B4'); } },
    bookstack: { n: N('Stack of books', 'Стопка книг', 'Grāmatu kaudze'), w: 12, h: 10, top: 0, d: p => { [['#E5484D', 0, 12], ['#4A7BD8', 1, 10], ['#F6D04D', 0, 11], ['#4CC38A', 1, 10], ['#9B5DE5', 2, 9]].forEach(([c, x, w], i) => { const y = 8 - i * 2; p(x, y, w, 2, c); p(x + w - 1, y, 1, 2, '#F4F0EA'); p(x, y, w, .5, 'rgba(255,255,255,.35)'); }); } },
    radiator: { n: N('Old radiator', 'Старая батарея', 'Vecs radiators'), w: 20, h: 13, top: 0, d: p => { for (let k = 0; k < 6; k++) { p(1 + k * 3, 0, 2, 11, '#E8E4DA'); p(1 + k * 3, 0, 2, .5, '#FFFFFF'); p(2.5 + k * 3, 1, .5, 9, '#C8C2B6'); } p(0, 9, 20, 2, '#D6D0C4'); p(1, 11, 2, 2, '#9A96A8'); p(17, 11, 2, 2, '#9A96A8'); } },
  });
  Object.assign(DECO, {
    dreamcatcher: { n: N('Dreamcatcher', 'Ловец снов', 'Sapņu ķērājs'), w: 10, h: 18, d: (p, t) => { const o = Math.round(Math.sin(t / 800)); for (let a = 0; a < 20; a++) { const an = a / 20 * Math.PI * 2; p(Math.round(5 + Math.cos(an) * 4), Math.round(4 + Math.sin(an) * 4), 1, 1, '#C08A55'); } p(3, 2, 4, 4, 'rgba(244,240,234,.6)'); p(5, 4, 1, 1, '#4A7BD8');
      [[1, '#F28AB2'], [5, '#F4F0EA'], [8, '#7FC8F8']].forEach(([x, c]) => { p(x, 8, 1, 4, '#C08A55'); p(x - .5 + o * .5, 12, 2, 5, c); }); } },
    wallshelf: { n: N('Shelf with plants', 'Полочка с цветами', 'Plaukts ar augiem'), w: 20, h: 10, d: p => { p(0, 7, 20, 2, '#A3733F'); p(1, 9, 2, 1, '#7A4E2A'); p(17, 9, 2, 1, '#7A4E2A'); p(1, 4, 4, 3, '#E09B6A'); p(1, 1, 1, 3, '#3E8E4F'); p(3, 0, 1, 4, '#5E9E45'); p(4, 2, 2, 1, '#3E8E4F'); p(8, 2, 3, 5, '#E5484D'); p(11, 3, 2, 4, '#4A7BD8'); p(14, 4, 4, 3, '#F4F0EA'); p(15, 1, 2, 3, '#6CC27E'); p(13, 2, 2, 2, '#3E8E4F'); } },
    macrame: { n: N('Macramé', 'Макраме', 'Makramē'), w: 12, h: 20, d: p => { p(0, 0, 12, 1, '#A3733F'); for (let x = 1; x < 12; x += 2) p(x, 1, 1, 6, '#F4EBDD'); for (let k = 0; k < 4; k++) { p(2 + k, 7 + k, 8 - 2 * k, 1, '#E9DCC6'); } p(5, 11, 2, 2, '#F4EBDD'); for (let x = 2; x < 11; x += 2) p(x, 13, 1, 7 - Math.abs(6 - x) / 2, '#F4EBDD'); } },
    pennants: { n: N('Pennant garland', 'Гирлянда флажков', 'Karodziņu virtene'), w: 30, h: 8, d: (p, t) => { p(0, 0, 30, 1, '#8A8696'); ['#E5484D', '#F6D04D', '#4CC38A', '#4A7BD8', '#F28AB2'].forEach((c, i) => { const x = 1 + i * 6, o = Math.sin(t / 500 + i) > .6 ? 1 : 0; for (let k = 0; k < 6; k++) p(x + k / 2 + o * 0, 1 + k, 5 - k, 1, c); }); } },
    polaroids: { n: N('Photos on a string', 'Фото на верёвочке', 'Foto uz auklas'), w: 24, h: 11, d: p => { p(0, 1, 24, .5, '#8A8696'); [[1, '#7FC8F8', '#5E9E45'], [9, '#F7C6DA', '#E5484D'], [17, '#FBE3A1', '#F08A3B']].forEach(([x, a, b]) => { p(x, 2, 6, 8, '#FFFFFF'); p(x + 1, 3, 4, 4, a); p(x + 2, 5, 2, 2, b); p(x + 2, 1, 1, 2, '#E9A93B'); }); } },
    moonphases: { n: N('Moon phases', 'Фазы луны', 'Mēness fāzes'), w: 30, h: 6, d: p => { [0, 1, 2, 3, 4].forEach(i => { const x = 1 + i * 6; p(x, 1, 4, 4, '#3A3550'); if (i === 2) p(x, 1, 4, 4, '#F6E7B0'); else if (i === 1 || i === 3) p(x + (i === 1 ? 2 : 0), 1, 2, 4, '#F6E7B0'); else p(x + (i === 0 ? 3 : 0), 1, 1, 4, '#F6E7B0'); p(x + 1, 0, 2, 1, i === 2 ? '#F6E7B0' : '#3A3550'); p(x + 1, 5, 2, 1, i === 2 ? '#F6E7B0' : '#3A3550'); }); } },
  });
  Object.assign(WALL, {
    polka: [['Polka dots', 'Обои в горошек', 'Punktainas tapetes'], tileWall('#FFF4E8', ['.rr.', 'rrrr', 'rrrr', '.rr.'], { r: '#F2A8B4' }, 12, 12, 6)],
    chevron: [['Chevron', 'Ёлочка-зигзаг', 'Zigzagi'], g => { R(g, 0, 0, RW, FY, '#EAF4F1'); for (let y = 0; y < FY; y += 10) for (let x = 0; x < RW; x++) R(g, x, y + Math.abs((x % 12) - 6) / 2, 1, 3, '#8DC9B6'); }],
    lemons: [['Lemons', 'Лимоны', 'Citroni'], tileWall('#FFFBEA', ['.g...', 'yyy..', 'yyyy.', 'yyyy.', '.yy..'], { y: '#F6D04D', g: '#5E9E45' }, 14, 12, 7)],
    cherries: [['Cherries', 'Вишенки', 'Ķirši'], tileWall('#FDF1F1', ['...g', '..g.', '.g.g', 'rr.r', 'rr.r'], { r: '#D8283A', g: '#5E9E45' }, 13, 12, 6)],
    terrazzo: [['Terrazzo', 'Терраццо', 'Terraco'], g => { R(g, 0, 0, RW, FY, '#F2EEE8'); const r = rngOf(51), cs = ['#E9A35B', '#7FC8B0', '#F2A8B4', '#9AA0AE', '#F6D04D']; for (let i = 0; i < 120; i++) { const big = r() < .25; R(g, r() * RW, r() * (FY - 4), big ? 2 : 1, 1, cs[i % cs.length]); } }],
    navyplaid: [['Navy plaid', 'Синяя шотландка', 'Zilā rūtiņa'], g => { R(g, 0, 0, RW, FY, '#2B3E6B'); for (let x = 0; x < RW; x += 12) R(g, x, 0, 3, FY, 'rgba(120,160,230,.45)'); for (let y = 0; y < FY; y += 12) R(g, 0, y, RW, 3, 'rgba(120,160,230,.45)'); for (let x = 6; x < RW; x += 12) R(g, x, 0, 1, FY, 'rgba(233,196,106,.6)'); }],
  });
  Object.assign(FLOOR, {
    tatami: [['Tatami', 'Татами', 'Tatami'], g => { R(g, 0, FY, RW, RH - FY, '#C9C27E'); for (let y = FY; y < RH; y += 13) for (let x = ((y - FY) / 13 % 2) * 16; x < RW; x += 32) { R(g, x, y, 32, 1, '#5E7A3E'); R(g, x, y, 1, 13, '#5E7A3E'); } for (let y = FY + 2; y < RH; y += 2) R(g, 0, y, RW, .5, 'rgba(160,150,90,.5)'); }],
    mosaic: [['Mosaic', 'Мозаика', 'Mozaīka'], g => { const cs = ['#4A7BD8', '#7FC8F8', '#F4F0EA', '#3CC7C0']; const r = rngOf(61); for (let y = FY; y < RH; y += 4) for (let x = 0; x < RW; x += 4) R(g, x, y, 3, 3, cs[Math.floor(r() * cs.length)]); }],
    cherrywood: [['Cherry wood', 'Вишнёвое дерево', 'Ķiršu koks'], g => planks(g, '#9C4A35', '#A9563F', '#7A3626')],
    pinkcarpet: [['Pink carpet', 'Розовый ковролин', 'Rozā paklājs'], g => { R(g, 0, FY, RW, RH - FY, '#F2B6C6'); const r = rngOf(71); for (let i = 0; i < 200; i++) R(g, r() * RW, FY + r() * (RH - FY), 1, 1, i % 2 ? '#F7CAD6' : '#E8A2B5'); }],
    starrug: [['Starry rug', 'Звёздный ковёр', 'Zvaigžņu paklājs'], g => { planks(g, '#6B4430', '#77503A', '#553424'); R(g, 30, FY + 6, 132, 22, '#26305E'); R(g, 31, FY + 7, 130, 1, '#E9C46A'); R(g, 31, FY + 26, 130, 1, '#E9C46A'); const r = rngOf(81); for (let i = 0; i < 26; i++) R(g, 34 + r() * 124, FY + 9 + r() * 16, 1, 1, i % 4 ? '#FFFFFF' : '#F6D04D'); }],
    bluetiles: [['Blue tiles', 'Синяя плитка', 'Zilās flīzes'], g => { R(g, 0, FY, RW, RH - FY, '#F4F7FB'); for (let y = FY; y < RH; y += 8) for (let x = 0; x < RW; x += 8) { R(g, x + 3, y + 1, 2, 6, '#3F6FC0'); R(g, x + 1, y + 3, 6, 2, '#3F6FC0'); R(g, x, y, 8, .5, '#C9D6EC'); R(g, x, y, .5, 8, '#C9D6EC'); } }],
  });
  Object.assign(VIEW, {
    tulipfield: [['Tulip field', 'Поле тюльпанов', 'Tulpju lauks'], (g, x, y) => { sky(g, x, y, ['#9FD3F5', '#B5DEF7', '#CDE8F9']); R(g, x + 4, y + 6, 8, 3, '#FFFFFF'); R(g, x, y + 22, WW, 20, '#6FB55E'); const cs = ['#E5484D', '#F6D04D', '#F28AB2', '#9B5DE5']; for (let row = 0; row < 4; row++) for (let i = 0; i < 14; i++) R(g, x + i * 3 + (row % 2), y + 24 + row * 4, 2, 2, cs[(row + Math.floor(i / 4)) % cs.length]); }],
    wheat: [['Wheat field', 'Пшеничное поле', 'Kviešu lauks'], (g, x, y, t) => { sky(g, x, y, ['#A6D4F2', '#BFE0F5', '#D6EBF8']); R(g, x + 30, y + 4, 6, 6, '#FFE08A'); R(g, x, y + 20, WW, 22, '#E9C46A'); for (let i = 0; i < WW; i += 2) { const o = Math.round(Math.sin(t / 600 + i / 4)); R(g, x + i + o, y + 18, 1, 4, '#D9A441'); } for (let k = 0; k < 4; k++) R(g, x, y + 25 + k * 4, WW, 1, '#D9A441'); }],
    hotair: [['Hot-air balloons', 'Воздушные шары', 'Gaisa baloni'], (g, x, y, t) => { sky(g, x, y, ['#F6C7A8', '#F9D8B8', '#FBE7CC']); R(g, x, y + 34, WW, 8, '#8DB596'); [[8, 10, '#E5484D', 0], [26, 6, '#4A7BD8', 2], [33, 18, '#F6D04D', 4]].forEach(([bx, by, c, ph]) => { const o = Math.round(Math.sin(t / 900 + ph)); R(g, x + bx - 3, y + by + o, 7, 6, c); R(g, x + bx - 2, y + by - 1 + o, 5, 1, c); R(g, x + bx - 1, y + by + 6 + o, 3, 1, c); R(g, x + bx, y + by + o, 1, 7, 'rgba(255,255,255,.5)'); R(g, x + bx - 1, y + by + 8 + o, 3, 2, '#8B5A2B'); }); }],
    fireflies: [['Fireflies at night', 'Светлячки ночью', 'Jāņtārpiņi naktī'], (g, x, y, t) => { sky(g, x, y, ['#13213A', '#1A2C48', '#223858']); R(g, x, y + 30, WW, 12, '#1F3A2A'); for (let i = 0; i < 6; i++) R(g, x + i * 7, y + 26 - (i % 3) * 2, 6, 6, '#24452F'); for (let i = 0; i < 9; i++) { const fx = x + ((i * 13 + t / 80) % WW), fy = y + 16 + ((i * 7) % 18) + Math.sin(t / 400 + i) * 2; if (Math.sin(t / 300 + i * 1.7) > 0) R(g, fx, fy, 1, 1, '#F6E58A'); } }],
    waterfall: [['Waterfall', 'Водопад', 'Ūdenskritums'], (g, x, y, t) => { sky(g, x, y, ['#A9D8F0', '#BFE3F5', '#D4EDF8']); R(g, x, y + 8, 14, 34, '#7A8C7A'); R(g, x + 28, y + 8, 14, 34, '#7A8C7A'); R(g, x, y + 6, 16, 4, '#5E9E45'); R(g, x + 26, y + 6, 16, 4, '#5E9E45'); R(g, x + 14, y + 8, 14, 30, '#8EC8EC'); for (let i = 0; i < 6; i++) R(g, x + 15 + i * 2, y + 8 + ((t / 40 + i * 9) % 28), 1, 4, '#FFFFFF'); R(g, x, y + 36, WW, 6, '#3F8FC9'); R(g, x + 12, y + 36, 18, 2, '#FFFFFF'); }],
  });
  Object.assign(CURT, {
    blackout: [['Black curtains', 'Чёрные шторы', 'Melnie aizkari'], ['#2E2A35', '#1C1922']],
    linen: [['White linen curtains', 'Белые льняные шторы', 'Baltie lina aizkari'], ['#F4F1EA', '#DCD6CB']],
    teal: [['Teal curtains', 'Бирюзовые шторы', 'Tirkīza aizkari'], ['#3CA6A6', '#2C8484']],
    peach: [['Peach curtains', 'Персиковые шторы', 'Persiku aizkari'], ['#F6B89A', '#E69C7C']],
    cherrydots: [['Cherry-dot curtains', 'Шторы в вишенку', 'Ķiršu aizkari'], ['#FCE4E8', '#F2CBD3'], '#D8283A'],
    sunny: [['Sunny yellow curtains', 'Солнечные шторы', 'Saulaini aizkari'], ['#F6D04D', '#E2B63A'], '#FFFFFF'],
  });
  // ---------- полки на стену (14.10.2026): это мебель с верхом (top) — на них можно ставить вещи, птичка на них запрыгивает;
  // wall: true — из сумки сразу вешается на стену (а не встаёт на пол), дальше двигается как любая вещь ----------
  const SHELF_C = [['#C8955E', '#A3733F', '#D9AC78'], ['#6B4430', '#553424', '#7E5642'], ['#F4F0EA', '#D6D0C4', '#FFFFFF'], ['#34303D', '#211E28', '#4E4958'], ['#7FB8A6', '#5E9A88', '#A3D2C2'], ['#F2A8B4', '#D98A98', '#F7C6D0']];
  const SHELF_N = [['oak', 'дубовая', 'ozola'], ['walnut', 'ореховая', 'riekstkoka'], ['white', 'белая', 'balta'], ['black', 'чёрная', 'melna'], ['mint', 'мятная', 'piparmētru'], ['pink', 'розовая', 'rozā']];
  const brk = (p, x, c) => { p(x, 4, 1, 5, c); p(x, 4, 3, 1, c); p(x + 1, 5, 1, 1, c); }; // кронштейн-уголок
  Object.assign(FURN, {
    wshelf: { n: i => ['Wall shelf (' + SHELF_N[i][0] + ')', 'Полка на стену (' + SHELF_N[i][1] + ')', 'Sienas plaukts (' + SHELF_N[i][2] + ')'], v: 6, wall: true, w: 32, h: 9, top: 0,
      d: (p, t, i) => { const [c, d, l] = SHELF_C[i]; p(0, 0, 32, 4, c); p(0, 0, 32, .5, l); p(0, 3.5, 32, .5, d); brk(p, 4, '#5E5A68'); brk(p, 25, '#5E5A68'); } },
    longshelf: { n: N('Long wall shelf', 'Длинная полка', 'Garš sienas plaukts'), wall: true, w: 60, h: 9, top: 0,
      d: p => { p(0, 0, 60, 4, '#C8955E'); p(0, 0, 60, .5, '#D9AC78'); p(0, 3.5, 60, .5, '#A3733F'); for (let x = 0; x < 60; x += 9) p(x, 1.5, 3, .5, '#B8854F'); brk(p, 6, '#3A3550'); brk(p, 29, '#3A3550'); brk(p, 51, '#3A3550'); } },
    ropeshelf: { n: N('Rope shelf', 'Полка на верёвках', 'Plaukts uz virvēm'), wall: true, w: 30, h: 18, top: 13,
      d: p => { p(14, 0, 2, 2, '#8A8696'); for (let k = 0; k < 13; k++) { p(14 - k, 1 + k, 1, 1, '#C9A97A'); p(15 + k, 1 + k, 1, 1, '#C9A97A'); } p(0, 13, 30, 4, '#A3733F'); p(0, 13, 30, .5, '#C8955E'); p(0, 16.5, 30, .5, '#7A4E2A'); p(1, 14, 1, 3, '#C9A97A'); p(28, 14, 1, 3, '#C9A97A'); } },
    cubby: { n: i => ['Cube shelf (' + SHELF_N[i][0] + ')', 'Полка-куб (' + SHELF_N[i][1] + ')', 'Kuba plaukts (' + SHELF_N[i][2] + ')'], v: 6, wall: true, w: 18, h: 18, top: 0,
      d: (p, t, i) => { const [c, d, l] = SHELF_C[i]; p(0, 0, 18, 18, c); p(2, 2, 14, 14, d); p(2, 2, 14, 1, 'rgba(0,0,0,.18)'); p(0, 0, 18, .5, l); p(2, 9, 14, 2, c); p(2, 9, 14, .5, l); } },
    cornershelf: { n: N('Three little shelves', 'Три полочки лесенкой', 'Trīs plauktiņi'), wall: true, w: 34, h: 30, top: 0, tw: 14,
      d: p => { [[0, 0], [10, 11], [20, 22]].forEach(([x, y]) => { p(x, y, 14, 3, '#F4F0EA'); p(x, y, 14, .5, '#FFFFFF'); p(x, y + 2.5, 14, .5, '#C9C2B6'); p(x + 6, y + 3, 2, 2, '#C9C2B6'); }); } },
    plantledge: { n: N('Shelf with trailing plants', 'Полка с вьющимися растениями', 'Plaukts ar vijīgiem augiem'), wall: true, w: 34, h: 22, top: 0,
      d: (p, t) => { p(0, 0, 34, 4, '#A3733F'); p(0, 0, 34, .5, '#C8955E'); p(0, 3.5, 34, .5, '#7A4E2A'); const o = Math.round(Math.sin(t / 900)); [[3, 14], [12, 9], [22, 17], [30, 11]].forEach(([x, len], i) => { for (let k = 0; k < len; k++) { p(x + (k % 4 === 0 ? o : 0), 4 + k, 1, 1, '#3E8E4F'); if (k % 3 === 1) p(x + 1 + (i % 2 ? -2 : 0), 4 + k, 2, 1, '#6CC27E'); } }); } },
  });
  // этап 11 В: угловая полка и полка-облачко
  Object.assign(FURN, {
    cornerwshelf: { n: N('Corner shelf', 'Угловая полка', 'Stūra plaukts'), wall: true, w: 22, h: 30, top: 0,
      d: p => { p(0, 0, 2, 30, '#8A5A34'); p(0, 0, .5, 30, '#A3733F'); [[0, 22], [10, 17], [20, 12]].forEach(([y, w]) => { p(2, y, w - 2, 3, '#C8955E'); p(w - 1, y + .5, 1, 2, '#C8955E'); p(2, y, w - 2, .5, '#D9AC78'); p(2, y + 2.5, w - 2, .5, '#A3733F'); p(2, y + 3, 3, 1, '#A3733F'); p(2, y + 4, 1.5, 1, '#A3733F'); }); } },
    cloudshelf: { n: N('Cloud shelf', 'Полка-облачко', 'Mākoņplaukts'), wall: true, w: 30, h: 12, top: 0,
      d: (p, t) => { const o = Math.sin(t / 1400) * .5; p(1, 0, 28, 2.5, '#FFFFFF'); p(1, 2, 28, .5, '#DCEBF7');
        blob(p, 7, 5 + o, 6, 4.5, (u, v) => v > .65 ? '#DCEBF7' : '#FFFFFF', '#A9C6DE'); blob(p, 15, 6.5, 7, 5.5, (u, v) => v > .65 ? '#DCEBF7' : '#FFFFFF', '#A9C6DE'); blob(p, 23.5, 5 - o, 6, 4.5, (u, v) => v > .65 ? '#DCEBF7' : '#FFFFFF', '#A9C6DE');
        p(1, 0, 28, 2, '#FFFFFF'); p(1, 0, 28, .5, '#F4FAFF'); p(9, 6, 1, 1, '#F2A8B4'); p(20, 6, 1, 1, '#F2A8B4'); p(14, 7, 2, .5, '#5E5A68'); } },
  });
  // этап 11 В: мелкие вещи — только они встают на полки на стену (и в коробки, этап 11 Г). Награды Титоса небольшие — тоже мелкие
  const SMALL = new Set(['mug', 'teapot', 'teaset', 'books', 'bookstack', 'spellbook', 'candle', 'skullcandle', 'candelabra', 'cake', 'cookies', 'donuts', 'pizzabox', 'candybowl', 'goblet', 'lemonade', 'watermelon', 'pancakes', 'souppot', 'mixer', 'toaster', 'breadbasket', 'applebasket', 'wormchips', 'coffeemachine',
    'cactus', 'succulents', 'vase', 'tulips', 'orchid', 'snakeplant', 'claypot', 'flytrap', 'yarn', 'knitting', 'globe', 'fishbowl', 'radio', 'recordplayer', 'speaker', 'handheld', 'tamagotchi', 'console', 'pumpkin', 'jacklantern', 'snowglobe', 'gingerhouse',
    'painttubes', 'brushjar', 'bust', 'rocket', 'moonlamp', 'lavalamp', 'helmet', 'orb', 'shipbottle', 'pollyplush', 'teddy', 'bunny', 'whale', 'cat', 'blackcat', 'raven', 'mrchew', 'ufo', 'eggbasket', 'wateringcan', 'boots', 'seedbag', 'chest']);
  const isSmall = d => !!d && (SMALL.has(d.k) || (d.titos && d.w <= 16 && d.h <= 16));
  // этап 11 Б: что светит, когда свет выключен: вещь → [цвет, радиус]; центр — d.glow, иначе середина вещи
  const GLOW = {
    lights: ['#FFD36B', 22], lightswarm: ['#FFE3A0', 22], lightsice: ['#CFEFFF', 20], lightsrun: ['#FFB45A', 22], lightsretro: ['#FFC86B', 24], lightsstar: ['#FFF0A0', 20], lightscurtain: ['#FFE3A0', 28], stars: ['#FFF0A0', 18], batgarland: ['#FFB45A', 16],
    lavalamp: ['#C77DFF', 24], lamp: ['#FFD98A', 36], moonlamp: ['#FFF3C4', 22], neon: ['#FF5FA2', 24], discoball: ['#FFFFFF', 18],
    fireplace: ['#FF9A3C', 42], candle: ['#FFC75A', 16], skullcandle: ['#FFC75A', 16], candelabra: ['#FFC75A', 24], phoenixnest: ['#FF7A3C', 26],
    gravelantern: ['#FFD36B', 20], jacklantern: ['#FF9A3C', 18], tclantern: ['#FFC75A', 18],
    orb: ['#B79CF2', 18], portal: ['#9B7BFF', 30], crypt: ['#BFE3FF', 22], spellbook: ['#B79CF2', 12], constellation: ['#CFE6FF', 20], countcoffin: ['#FFD36B', 18],
    xmastree: ['#FFE08A', 30], aquarium: ['#7FD3F5', 18], fishbowl: ['#7FD3F5', 12], tv: ['#9FD3FF', 18], computer: ['#9FD3FF', 14], arcade: ['#FF7AD9', 20], ufo: ['#8CF5B0', 14],
  };
  // этап 11 Г: коробки — мебель с верхом (ставятся друг на друга), box: true; мелкую вещь, отпущенную на коробку, она прячет внутрь.
  // c.lid (0…1) — крышка приоткрыта (вещи выпрыгивают / птичка кладёт обратно). Номер коробки — it.id, вещь внутри — it.in (PPCanDo.isBox, pack)
  const lidUp = c => -3.5 * ((c && c.lid) || 0);
  Object.assign(FURN, {
    cardbox: { n: N('Cardboard box', 'Картонная коробка', 'Kartona kaste'), box: true, w: 20, h: 14, top: 0,
      d: (p, _t, i, c) => { const o = lidUp(c);
        rbox(p, 0, 3, 20, 11, '#C89A62', OUT, .5); p(1, 3.5, 18, 1, '#DDB47E'); p(1, 12.5, 18, 1, '#A57A45'); p(.5, 3.5, .5, 9, '#DDB47E');
        p(3, 6.5, 6, .5, '#8A6236'); p(3, 7.5, 4, .5, '#8A6236'); p(3.5, 9, 2.5, 2, '#8A6236'); p(4, 9.5, 1.5, 1, '#C89A62'); // надпись и стрелка «верх»
        p(12.5, 6, 5, 3.5, '#F4EBDD'); p(13, 7, 4, .5, '#C8B08A'); p(13, 8, 2.5, .5, '#C8B08A');
        rbox(p, -.5, o, 21, 3.5, '#D7A86C', OUT, .5); p(0, .5 + o, 20, .5, '#E8C08A'); p(8.5, o, 3, 3.5, '#E8D2A6'); p(8.5, 3 + o, 3, .5, '#C8B08A'); } },
    crate: { n: N('Wooden crate', 'Деревянный ящик', 'Koka kaste'), box: true, w: 20, h: 14, top: 0,
      d: (p, _t, i, c) => { const o = lidUp(c);
        rbox(p, 0, 3, 20, 11, '#B07A45', OUT, .5); [6, 9.5].forEach(y => p(.5, y, 19, .5, '#7A4E2A')); p(1, 3.5, 18, .5, '#C8955E');
        for (let k = 0; k < 9; k++) p(2.5 + k * 1.7, 11.5 - k * .85, 2, 1, '#8C5A34'); // диагональная планка
        p(.5, 3.5, 2, 10, '#9A6638'); p(17.5, 3.5, 2, 10, '#9A6638'); [[1.25, 5], [1.25, 11.5], [18.25, 5], [18.25, 11.5]].forEach(([x, y]) => p(x, y, .5, .5, '#3A3550'));
        rbox(p, -.5, o, 21, 3.5, '#C08454', OUT, .5); p(0, .5 + o, 20, .5, '#D9AC78'); p(0, 2.5 + o, 20, .5, '#8C5A34'); [1, 18.5].forEach(x => p(x, 1.5 + o, .5, .5, '#3A3550')); } },
    hatbox: { n: N('Hat box', 'Шляпная коробка', 'Cepuru kaste'), box: true, w: 18, h: 14, top: 0,
      d: (p, _t, i, c) => { const o = lidUp(c);
        rbox(p, .5, 3, 17, 11, '#F2A8B4', OUT, 1.5); for (let x = 2.5; x < 16; x += 3) p(x, 4, 1.5, 9, '#FFFFFF'); p(2, 12.5, 14, .5, '#D98A98');
        rbox(p, -.5, .5 + o, 19, 3.5, '#E5484D', OUT, 1); p(1, 1 + o, 16, .5, '#F27A7E'); p(1, 3 + o, 16, .5, '#B5343A');
        p(8, 4, 2, 9.5, '#F6D04D'); p(8, 4, .5, 9.5, '#FFE89A'); blob(p, 7, 1 + o, 2, 1.5, () => '#F6D04D'); blob(p, 11, 1 + o, 2, 1.5, () => '#F6D04D'); p(8.5, .5 + o, 1, 1.5, '#E2B63A'); } },
    trunkbox: { n: N('Little trunk', 'Сундучок', 'Lādīte'), box: true, w: 20, h: 14, top: 0,
      d: (p, _t, i, c) => { const o = lidUp(c);
        rbox(p, 0, 5, 20, 9, '#8C4A2B', OUT, .5); p(1, 5.5, 18, .5, '#A8603A'); p(1, 12.5, 18, 1, '#6B3820');
        rbox(p, 0, o, 20, 5.5, '#9C5530', OUT, 2); p(2, .5 + o, 16, .5, '#B86E44'); p(1, 4.5 + o, 18, .5, '#6B3820');
        [3, 15.5].forEach(x => { p(x, o + .5, 1.5, 5, '#E9C46A'); p(x, 5, 1.5, 8.5, '#E9C46A'); p(x, 5, .5, 8.5, '#FFF3C4'); });
        rbox(p, 8.5, 3.5, 3, 4, '#E9C46A', '#8A6A1E', .5); p(9.75, 5, .5, 1.5, '#3A2A10'); p(9, 4, .5, 1, '#FFF3C4'); } },
    giftbox: { n: N('Gift box', 'Подарочная коробка', 'Dāvanu kaste'), box: true, w: 16, h: 15, top: 2,
      d: (p, _t, i, c) => { const o = lidUp(c);
        rbox(p, .5, 5, 15, 10, '#4A7BD8', OUT, .5); p(1, 5.5, 14, .5, '#7FA3E8'); p(1, 13.5, 14, 1, '#3A62B0'); p(7, 5, 2, 9.5, '#F6D04D'); p(7, 5, .5, 9.5, '#FFE89A');
        [[3, 8.5], [11.5, 10], [4, 12]].forEach(([x, y]) => p(x, y, 1, 1, '#BFD3F5'));
        rbox(p, -.5, 2 + o, 17, 3.5, '#5A8BE8', OUT, .5); p(0, 2.5 + o, 16, .5, '#8FB3F0'); p(7, 2 + o, 2, 3.5, '#F6D04D');
        blob(p, 5.5, 1 + o, 2.5, 1.5, () => '#F6D04D'); blob(p, 10.5, 1 + o, 2.5, 1.5, () => '#F6D04D'); p(7.25, .5 + o, 1.5, 2, '#E2B63A'); } },
  });
  // значения каталога: «sofa:2», «ornament:4»; у вещей без цветов — просто имя
  const vals = o => Object.entries(o).flatMap(([k, d]) => d.v ? [...Array(d.v)].map((_, i) => k + ':' + i) : d.rc ? [k, ...[...Array(d.rc)].map((_, i) => k + ':' + (i + 1))] : [k]);
  const parse = v => { const [k, i] = String(v).split(':'); return [k, +i || 0]; };
  const defOf = (kind, v) => { const [k, i] = parse(v); const d = (kind === 'deco' ? DECO : FURN)[k]; return d ? { ...d, k, i } : null; };
  const ROOM_KINDS = { wall: WALL, floor: FLOOR, view: VIEW, curtain: CURT };
  const nameOf = (kind, v, l = L) => {
    if (ROOM_KINDS[kind]) { const e = ROOM_KINDS[kind][v]; return e ? e[0][l] : v; }
    const d = defOf(kind, v); return d ? d.n(d.i)[l] : v;
  };

  // ---------- регистрация в каталоге подарков (коллекции, магазин, сумка, адвент, кабинет) ----------
  const LEG = ['furn|countcoffin', 'furn|crypt', 'furn|tieredcake', 'furn|pancaketower', 'furn|magicpan', 'furn|throne', 'view|aurora', 'wall|gold', 'floor|marble', 'furn|dragon', 'furn|portal', 'furn|treasure', 'furn|phoenixnest', 'furn|pollystatue', 'deco|rainbowarc', 'deco|constellation', 'wall|stainedglass', 'floor|clouds', 'floor|goldtiles', 'view|dragonsky', 'curtain|starlight']; // то же в worker/index.js LEGEND
  Object.assign(B.GIFTS, { wall: Object.keys(WALL).filter(k => k !== '_'), floor: Object.keys(FLOOR).filter(k => k !== '_'), view: Object.keys(VIEW).filter(k => k !== '_'),
    curtain: Object.keys(CURT), furn: vals(FURN).filter(x => !FURN[parse(x)[0]].game && !FURN[parse(x)[0]].fixed), deco: vals(DECO).filter(x => !DECO[parse(x)[0]].game) }); // game: true — вещи только из игр; fixed — альбом, он в комнате сам
  LEG.forEach(x => B.LEGEND.add(x));
  B.GIFT_KINDS.push(['furn', ['Furniture & things', 'Мебель и вещи', 'Mēbeles un lietas']], ['deco', ['Decorations', 'Украшения', 'Rotājumi']], ['wall', ['Wallpaper', 'Обои', 'Tapetes']],
    ['floor', ['Floors', 'Пол', 'Grīdas']], ['view', ['Window views', 'Вид из окна', 'Skats pa logu']], ['curtain', ['Curtains', 'Шторы', 'Aizkari']]);
  const th = id => B.GIFT_THEMES.find(t => t[0] === id);
  const LIGHTS = ['deco|lightswarm', 'deco|lightsice', 'deco|lightsrun', 'deco|lightsretro', 'deco|lightsstar', 'deco|lightscurtain'];
  const addTh = (id, list) => { const t = th(id); if (t) t[2].push(...list); };
  addTh('legendary', LEG);
  // новинки 13.10.2026 — в темы
  addTh('summer', ['view|tulipfield', 'view|hotair', 'view|fireflies', 'wall|lemons', 'wall|cherries', 'curtain|sunny', 'floor|bluetiles', 'furn|aquarium']);
  addTh('autumn', ['view|wheat', 'floor|cherrywood', 'wall|navyplaid', 'furn|rockingchair', 'furn|radiator']);
  addTh('spring', ['view|tulipfield', 'curtain|cherrydots', 'wall|polka', 'deco|wallshelf']);
  addTh('magic', ['deco|dreamcatcher', 'deco|moonphases']);
  addTh('home', ['furn|wshelf:0', 'furn|wshelf:1', 'furn|wshelf:2', 'furn|wshelf:3', 'furn|longshelf', 'furn|ropeshelf', 'furn|cubby:0', 'furn|cubby:2', 'furn|cornershelf', 'furn|plantledge', 'furn|cornerwshelf', 'furn|cloudshelf', 'furn|cardbox', 'furn|crate', 'furn|hatbox', 'furn|trunkbox', 'furn|giftbox']);
  addTh('newyear', ['furn|xmastree', ...[0, 1, 2, 3].map(i => 'furn|present:' + i), 'furn|snowman', ...ORN_C.map((_, i) => 'deco|ornament:' + i), 'deco|xmasstar', 'deco|lights', ...LIGHTS, 'deco|tinsel', 'deco|bell', 'deco|candycane', 'deco|snowflake', 'wall|xmas', 'view|snow']);
  addTh('autumn', ['wall|leaves', 'view|autumn', 'furn|pumpkin', 'curtain|mustard']);
  addTh('halloween', ['furn|pumpkin', 'furn|candle']);
  addTh('gaming', ['furn|tv', 'furn|console', 'furn|beanbag', 'view|space']);
  addTh('art', ['deco|painting', 'furn|desk']);
  addTh('cafe', ['furn|roundtable', 'furn|mug', 'furn|teapot', 'furn|cake']);
  addTh('school', ['furn|bookshelf', 'furn|books', 'furn|globe', 'furn|desk']);
  addTh('summer', ['view|sea', 'view|rainbow', 'furn|fishbowl']);
  addTh('spring', ['wall|flowers', 'curtain|pink', 'furn|plant']);
  addTh('valentine', ['wall|stripes', 'furn|sofa:3']);
  addTh('halloween', ['furn|cauldron', 'furn|jacklantern', 'furn|broom', 'furn|candybowl', 'furn|skullcandle', 'furn|blackcat', 'furn|tombstone', 'deco|ghost', 'deco|web', 'deco|batgarland', 'wall|bats', 'wall|pumpkins', 'wall|ghosts', 'view|spooky', 'curtain|spooky']);
  addTh('newyear', ['furn|fireplace', 'furn|gingerhouse', 'furn|snowglobe', 'furn|rockinghorse', 'furn|sled', 'furn|cookies', 'deco|stocking', 'deco|wreath', 'deco|mistletoe', 'deco|stars', 'wall|candycane', 'wall|snowflakes', 'wall|gingerbread', 'wall|tartan', 'floor|snowfloor', 'curtain|xmasgreen']);
  addTh('spring', ['furn|vase', 'furn|tulips', 'furn|wateringcan', 'furn|eggbasket', 'furn|birdhouse', 'deco|butterfly', 'deco|hangplant', 'wall|sakura', 'wall|clouds', 'view|sakura', 'floor|grass']);
  addTh('summer', ['furn|beachchair', 'furn|palm', 'furn|surfboard', 'furn|watermelon', 'furn|flamingo', 'furn|lemonade', 'furn|fan', 'deco|sunwall', 'wall|waves', 'wall|sunflowers', 'wall|jungle', 'view|sunset', 'view|underwater', 'view|desert', 'floor|sand', 'curtain|sky']);
  addTh('autumn', ['furn|applebasket', 'furn|mushstool', 'furn|umbrella', 'furn|boots', 'furn|teaset', 'wall|mushrooms', 'wall|retro', 'view|rain', 'floor|leafy']);
  addTh('art', ['furn|easel', 'furn|painttubes', 'furn|brushjar', 'furn|claypot', 'furn|bust', 'deco|palettewall', 'deco|poster', 'wall|chalk']);
  addTh('gaming', ['furn|arcade', 'furn|computer', 'furn|gamingchair', 'furn|handheld', 'deco|neon', 'wall|arcade', 'floor|arcadefloor']);
  addTh('cafe', ['furn|fridge', 'furn|stove', 'furn|coffeemachine', 'furn|donuts', 'furn|pizzabox', 'furn|breadbasket']);
  addTh('magic', ['furn|potionshelf', 'furn|spellbook', 'furn|orb', 'deco|papermoon', 'deco|mirror', 'wall|planets', 'curtain|velvet']);
  addTh('pirate', ['furn|chest', 'furn|barrel', 'furn|shipbottle', 'deco|anchor', 'view|lighthouse']);
  addTh('school', ['wall|library', 'wall|chalk', 'furn|computer']);
  addTh('valentine', ['wall|hearts', 'floor|fluffy']);
  addTh('legendary', []);
  B.GIFT_THEMES.push(['tree', ['🎄 Tree decorations', '🎄 Украшения для ёлки', '🎄 Eglītes rotājumi'], [...ORN_C.map((_, i) => 'deco|ornament:' + i), 'deco|xmasstar', 'deco|staromini', 'deco|lights', ...LIGHTS, 'deco|tinsel', 'deco|beads', 'deco|icicle', 'deco|pinecone', 'deco|angel', 'deco|gingerorn', 'deco|birdorn', 'deco|candyorn', 'deco|snowmanorn', 'deco|bell', 'deco|candycane', 'furn|xmastree']]);
  addTh('newyear', ['deco|staromini', 'deco|beads', 'deco|icicle', 'deco|pinecone', 'deco|angel', 'deco|gingerorn', 'deco|birdorn', 'deco|candyorn', 'deco|snowmanorn']);
  B.GIFT_THEMES.push(['fun', ['😂 Funny', '😂 Забавное', '😂 Jautri'], ['furn|giantpizza', 'furn|rubberduck', 'furn|toaster', 'furn|lavalamp', 'furn|cattower', 'furn|bathtub', 'furn|mrchew', 'furn|coatstand', 'furn|wormchips', 'furn|flytrap', 'furn|robovac', 'furn|socks', 'furn|tamagotchi', 'furn|giantcoffee', 'furn|nestbed', 'deco|cuckoo', 'deco|moosehead', 'deco|crookedart', 'deco|ufo', 'deco|balloons', 'deco|wormposter']]);
  B.GIFT_THEMES.push(['vampire', ['🧛 Vampire', '🧛 Вампирское', '🧛 Vampīru'], ['furn|countcoffin', 'furn|coffin', 'furn|candelabra', 'furn|gothicchair', 'furn|goblet', 'deco|hangingbat', 'deco|countportrait', 'deco|garlic', 'wall|gothic', 'floor|castlerug', 'view|castlemoon', 'curtain|crimson', 'curtain|velvet', 'wall|bats', 'deco|batgarland', 'furn|blackcat', 'furn|skullcandle']]);
  B.GIFT_THEMES.push(['graveyard', ['🪦 Graveyard', '🪦 Кладбищенское', '🪦 Kapsētas'], ['furn|crypt', 'furn|crossgrave', 'furn|graveangel', 'furn|gravelantern', 'furn|deadtree', 'furn|raven', 'furn|shovel', 'furn|tombstone', 'deco|fog', 'deco|ghost', 'deco|web', 'wall|mossbrick', 'floor|gravesoil', 'view|foggrave', 'view|spooky', 'curtain|ragged']]);
  B.GIFT_THEMES.push(['chef', ['👩‍🍳 Chef', '👩‍🍳 Поварское', '👩‍🍳 Pavāru'], ['furn|tieredcake', 'furn|chefcounter', 'furn|souppot', 'furn|pancakes', 'furn|mixer', 'furn|spicerack', 'furn|cuttingboard', 'furn|baguettes', 'deco|ladles', 'deco|garlic', 'deco|menuboard', 'wall|kitchentiles', 'floor|checker', 'curtain|polkadot', 'hat|chef', 'item|spoon', 'item|cheese', 'item|croissant', 'furn|stove', 'furn|fridge', 'furn|coffeemachine', 'furn|toaster', 'furn|breadbasket']]);
  B.GIFT_THEMES.push(['pancake', ['🥞 Pancakes', '🥞 Блинная', '🥞 Pankūku'], ['furn|pancaketower', 'furn|magicpan', 'hat|pancakecrown', 'item|goldspatula', 'furn|pancakecart', 'furn|pancakepan', 'furn|batterbowl', 'furn|jamjars', 'furn|honeypot', 'furn|pancakes', 'deco|pancakesign', 'deco|orderslips', 'wall|pancakewall', 'curtain|butter', 'hat|pancakehat', 'item|spatula', 'item|pancake', 'item|syrup', 'hat|chef', 'furn|stove', 'furn|mixer', 'floor|checker']]);
  addTh('magic', ['furn|portal', 'furn|dragon', 'deco|constellation', 'curtain|starlight']);
  addTh('pirate', ['furn|treasure']);
  B.GIFT_THEMES.push(['music', ['🎵 Music', '🎵 Музыка', '🎵 Mūzika'], ['furn|guitar', 'furn|piano', 'furn|drum', 'furn|speaker', 'furn|recordplayer', 'furn|gramophone', 'furn|radio', 'deco|discoball']]);
  B.GIFT_THEMES.push(['space', ['🚀 Space', '🚀 Космос', '🚀 Kosmoss'], ['furn|telescope', 'furn|rocket', 'furn|moonlamp', 'furn|helmet', 'view|space', 'view|aurora', 'wall|planets', 'wall|stars']]);
  B.GIFT_THEMES.push(['polly', ['🐦 Pigeon Polly', '🐦 Pigeon Polly', '🐦 Pigeon Polly'], ['furn|pollyplush', 'furn|seedbag', 'furn|fountain', 'furn|birdhouse', 'deco|poster', 'deco|painting', 'wall|pigeons', 'view|riga']]);
  B.GIFT_THEMES.push(['home', ['🏠 Cozy room', '🏠 Уютная комната', '🏠 Mājīga istaba'], [...[0, 1, 2, 3, 4, 5].map(i => 'furn|rug:' + i), ...[0, 1, 2, 3, 4, 5].map(i => 'furn|cushion:' + i), ...[0, 1, 2, 3, 4].map(i => 'deco|picture:' + i), 'furn|teddy', 'furn|bunny', 'furn|whale', 'furn|fern', 'furn|snakeplant', 'furn|succulents', 'furn|orchid', 'furn|bed', 'furn|nightstand', 'furn|cat', 'furn|catbed', 'furn|grandclock', 'furn|pouf', 'deco|mirror', 'wall|rainbow', 'floor|rainbowrug', 'floor|parquet', 'curtain|rainbow', 'curtain|golden', 'furn|sofa:0', 'furn|sofa:1', 'furn|armchair', 'furn|knitting', 'furn|yarn', 'furn|lamp', 'furn|plant', 'furn|books', 'furn|mug', 'furn|teapot', 'furn|gramophone', 'furn|radio', 'deco|clock', 'deco|painting', 'wall|wood', 'floor|bluerug', 'curtain|lace']]);
  addTh('home', ['furn|sofa:4', 'furn|sofa:5', 'furn|rockingchair', 'furn|wardrobe', 'furn|dresser', 'furn|sidetable', 'furn|monstera', 'furn|hamster', 'furn|bookstack', 'furn|radiator', 'deco|macrame', 'deco|wallshelf', 'deco|polaroids', 'deco|pennants', 'wall|terrazzo', 'wall|chevron', 'floor|tatami', 'floor|pinkcarpet', 'floor|starrug', 'floor|mosaic', 'curtain|linen', 'curtain|blackout', 'curtain|teal', 'curtain|peach', 'view|waterfall']);
  addTh('polly', ['furn|pollystatue', 'furn|wormchips', 'furn|nestbed', 'furn|mrchew', 'deco|wormposter', 'deco|birdorn']);
  // иконка вещи для комнаты
  function icon(kind, v, size) {
    const s = 6, c = document.createElement('canvas'), g = c.getContext('2d');
    if (ROOM_KINDS[kind]) {
      c.width = 28 * s; c.height = 28 * s; g.imageSmoothingEnabled = false;
      const t = document.createElement('canvas'); t.width = RW; t.height = RH; const tg = t.getContext('2d');
      if (kind === 'wall') { WALL[v] && WALL[v][1](tg); g.drawImage(t, 30, 20, 28, 28, 0, 0, c.width, c.height); }
      else if (kind === 'floor') { FLOOR[v] && FLOOR[v][1](tg); g.drawImage(t, 40, FY, 28, 28, 0, 0, c.width, c.height); }
      else if (kind === 'view') { VIEW[v] && VIEW[v][1](tg, 0, 0, 0); g.drawImage(t, 7, 7, 28, 28, 0, 0, c.width, c.height); }
      else { R(tg, 0, 0, RW, RH, '#C9BBA0'); R(tg, WX, WY, WW, WH, '#BDE3F8'); drawCurtains(tg, v); g.drawImage(t, WX - 18, WY - 10, 26, 30, 0, 0, c.width * 26 / 28, c.height * 30 / 28 > c.height ? c.height : c.height * 30 / 28); }
    } else {
      const d = defOf(kind, v); if (!d) return document.createElement('span');
      const pad = 1, k = 2 * Math.max(1, Math.floor(Math.min(128 / (d.w + pad * 2), 128 / (d.h + pad * 2)) / 2)); // чётный масштаб — полупиксели чёткие
      c.width = (d.w + pad * 2) * k; c.height = (d.h + pad * 2) * k; g.setTransform(k, 0, 0, k, 0, 0); g.imageSmoothingEnabled = false;
      d.d(P(g, pad, pad), 0, d.i, { has: () => false });
    }
    const box = document.createElement('span'); box.className = 'pp-icon pp-room-ic' + (ROOM_KINDS[kind] ? ' sq' : ''); box.style.setProperty('--ic', (size || 80) + 'px');
    const z = (size || 80) * (ROOM_KINDS[kind] ? .78 : .7); c.style.width = c.style.height = ''; if (c.width >= c.height) c.style.width = z + 'px'; else c.style.height = z + 'px';
    box.appendChild(c); return box;
  }
  const isRoom = k => ['wall', 'floor', 'view', 'curtain', 'furn', 'deco'].includes(k);
  // «🎲 Сюрприз» (значение '?'): случайная вещь этой категории, которой у птички ещё нет — выбирает сервер (worker `surprise`)
  const SUR = ['Surprise', 'Сюрприз', 'Pārsteigums'], SUR_ANY = ['anything', 'что угодно', 'jebkas'], SUR_LEG = ['legendary thing ★', 'легендарная вещь ★', 'leģendāra lieta ★'];
  // «Сюрпризы» отдельной категорией: any|? — что угодно, any|legend — любая легендарная (в сумку попадает уже настоящая вещь)
  B.GIFTS.any = ['legend']; B.GIFT_KINDS.unshift(['any', ['🎲 Surprises', '🎲 Сюрпризы', '🎲 Pārsteigumi']]); B.LEGEND.add('any|legend');
  const SUR_C = { any: '#4CC38A', hat: '#9B5DE5', item: '#F08A3B', shoes: '#4A7BD8', scarf: '#E5484D', frame: '#E9A93B', bg: '#4CC38A', anim: '#F28AB2', furn: '#B5543C', deco: '#E5484D', wall: '#7FB3E8', floor: '#A0673C', view: '#3F8FC9', curtain: '#B79CF2' };
  function surpriseIcon(kind, size) {
    const k = 4, c = document.createElement('canvas'), g = c.getContext('2d'); c.width = 16 * k; c.height = 16 * k; g.setTransform(k, 0, 0, k, 0, 0);
    const leg = kind === 'legend', col = leg ? '#E9C46A' : SUR_C[kind] || '#9B5DE5', p = P(g, 1, 1);
    spr(p, ['....yy..yy....', '.....yyyy.....', 'cccccccyccccc.', 'cccccccycccccc', 'CCCCCCCyCCCCCC', '.ccwwwwywwccc.', '.ccwccwycwwcc.', '.cccccwycwccc.', '.ccccwwyccccc.', '.ccccwcyccccc.', '.ccccccyccccc.', '.ccccwcyccccc.', '.ccccccyccccc.', '.CCCCCCyCCCCC.'], { y: '#F6D04D', c: col, C: 'rgba(0,0,0,.25)', w: '#FFFFFF' });
    if (leg) { g.fillStyle = '#FFFFFF'; g.fillRect(2, 2, 1, 1); g.fillRect(13, 4, 1, 1); g.fillStyle = '#B23A48'; g.fillRect(8, 1, 1, 1); }
    const box = document.createElement('span'); box.className = 'pp-icon pp-room-ic'; box.style.setProperty('--ic', (size || 80) + 'px');
    c.style.width = (size || 80) * .7 + 'px'; box.appendChild(c); return box;
  }
  const kindLabel = (k, l) => { const e = B.GIFT_KINDS.find(x => x[0] === k); return e ? e[1][l] : k; };
  const oldName = B.giftName, oldIcon = B.itemIcon, oldPic = B.giftPic;
  const isSur = (k, v) => v === '?' || k === 'any';
  const surName = (k, v, l) => `🎲 ${SUR[l]}: ${k === 'any' ? (v === 'legend' ? SUR_LEG[l] : SUR_ANY[l]) : kindLabel(k, l).replace(/^🎲\s*/, '')}`;
  const surIcon = (k, v, size) => surpriseIcon(k === 'any' && v === 'legend' ? 'legend' : k, size);
  B.giftName = (k, v, l) => isSur(k, v) ? surName(k, v, l == null ? L : l) : isRoom(k) ? nameOf(k, v, l == null ? L : l) : oldName(k, v, l);
  B.itemIcon = (k, v, size, id) => isSur(k, v) ? surIcon(k, v, size) : isRoom(k) ? icon(k, v, size) : oldIcon(k, v, size, id);
  B.giftPic = (k, v, id, size, av) => { if (!isRoom(k) && !isSur(k, v)) return oldPic(k, v, id, size, av); const w = document.createElement('span'); w.className = 'gift-pic'; w.appendChild(isSur(k, v) ? surIcon(k, v, size) : icon(k, v, size)); return w; };
  B.ROOM_KINDS = ['furn', 'deco', 'wall', 'floor', 'view', 'curtain'];
  // тема «🎲 Сюрпризы» — все сюрпризы сразу
  B.GIFT_THEMES.unshift(['surprise', ['🎲 Surprises', '🎲 Сюрпризы', '🎲 Pārsteigumi'], ['any|?', 'any|legend', ...B.GIFT_KINDS.filter(k => k[0] !== 'any').map(k => k[0] + '|?')]]);
  B.withSurprise = k => ['?', ...(B.GIFTS[k] || [])]; // список для магазина, адвента и подарков: «🎲 Сюрприз» первым
  B.isRoomKind = isRoom;

  // ---------- комната ----------
  const T = {
    of: ['Room of @{n}', 'Комната @{n}', '@{n} istaba'], saved: ['Saved ✓', 'Сохранено ✓', 'Saglabāts ✓'], saving: ['Saving…', 'Сохраняю…', 'Saglabāju…'], err: ['Could not save', 'Не получилось сохранить', 'Neizdevās saglabāt'],
    hintOff: ['Tap ✏️ to move things', 'Чтобы двигать вещи — нажать ✏️', 'Lai pārvietotu lietas — nospied ✏️'],
    editOn: ['Arrange the room', 'Обустроить комнату', 'Iekārtot istabu'], editOff: ['Done', 'Готово', 'Gatavs'],
    hint: ['Drag things around · tap one for ⇆ ⬆ ⬇ ↩', 'Вещи можно двигать · нажатие на вещь — ⇆ ⬆ ⬇ ↩', 'Lietas var pārvietot · pieskaries lietai — ⇆ ⬆ ⬇ ↩'],
    tidy: ['🧹 Tidy up', '🧹 Прибраться', '🧹 Sakopt'],
    lightOff: ['Turn the light off', 'Выключить свет', 'Izslēgt gaismu'], lightOn: ['Turn the light on', 'Включить свет', 'Ieslēgt gaismu'],
    flip: ['Turn', 'Повернуть', 'Pagriezt'], front: ['Forward', 'Вперёд', 'Uz priekšu'], behind: ['Back', 'Назад', 'Atpakaļ'], back: ['To the bag', 'В сумку', 'Uz somu'],
  };
  const t = k => T[k][L];
  // свободное место для новой вещи (этап 5 Б): мебель — на пол ближе к центру, украшения и полки — на стену мимо окна и штор.
  // lay — раскладка комнаты (layout() внутри mount), d — defOf вещи; возвращает { x, y }
  function freeSpot(lay, d, k) {
    const ov = (ax, ay, aw, ah, b) => Math.max(0, Math.min(ax + aw, b.x + b.w) - Math.max(ax, b.x)) * Math.max(0, Math.min(ay + ah, b.y + b.h) - Math.max(ay, b.y));
    const boxes = lay.map(q => ({ x: q.x, y: q.y, w: q.d.w, h: q.d.h, flat: q.d.h <= 4 || q.d.flat, wall: q.it.k === 'deco' || q.d.wall }));
    let best = null;
    if (k === 'deco' || d.wall) {
      const win = { x: WX - 17, y: WY - 9, w: WW + 34, h: WH + 22 }, px = Math.max(0, (WX - 17) / 2 - d.w / 2), py = d.wall ? 40 - d.h : 22;
      for (let y = 2; y <= Math.max(2, FY - d.h - 2); y += 2) for (let x = 0; x <= RW - d.w; x += 2) {
        const hit = ov(x, y, d.w, d.h, win) + boxes.reduce((a, b) => a + ov(x, y, d.w, d.h, b), 0);
        const sc = hit * 100 + Math.abs(x - px) + Math.abs(y - py) * 2;
        if (!best || sc < best.sc) best = { x, y, sc };
      }
      return { x: best.x, y: best.y };
    }
    // мелкая вещь — на полку на стену, где есть место (этап 11 В)
    if (isSmall(d)) for (const s of lay.filter(q => q.d.wall && q.d.top != null)) {
      const top = s.y + s.d.top, on = lay.filter(q => q !== s && Math.abs(q.y + q.d.h - top) <= 1 && q.x < s.x + s.d.w && q.x + q.d.w > s.x);
      for (let x = s.x + 1; x <= s.x + (s.d.tw || s.d.w) - d.w - 1; x++) if (!on.some(q => x < q.x + q.d.w + 1 && x + d.w + 1 > q.x)) return { x, y: top - d.h };
    }
    const y = GY - d.h, floor = boxes.filter(b => !b.wall && !b.flat && Math.abs(b.y + b.h - GY) <= 2);
    for (let x = 0; x <= RW - d.w; x += 2) {
      const hit = d.h <= 4 || d.flat ? 0 : floor.reduce((a, b) => a + Math.max(0, Math.min(x + d.w, b.x + b.w) - Math.max(x, b.x)), 0);
      const sc = hit * 1000 + Math.abs(x + d.w / 2 - RW / 2);
      if (!best || sc < best.sc) best = { x, sc };
    }
    return { x: best.x, y };
  }


  // разворот альбома карточек птички (cards-ui.js; где его нет на странице — подгружаем)
  function albumOf(nick) { const go = () => window.PPCards.album(nick); if (window.PPCards) return go(); const s = document.createElement('script'); s.src = '/assets/cards-ui.js'; s.onload = go; document.head.appendChild(s); }

  function mount(box, o) {
    let room = Object.assign({ items: [] }, o.room || {}); room.items = (room.items || []).filter(it => defOf(it.k, it.v));
    let edit = false; // своя комната правится после нажатия ✏️ (иначе случайное касание двигает вещи), у гостей — только смотреть
    let sel = -1, saveT = 0, drag = null, flash = 0;
    let tidy = null; // «🧹 Прибраться»: { carry } — птичка относит выпавшие вещи в их коробки (этап 11 Г)
    const jumps = new Map(), lids = new Map(); // вещь → полёт из коробки; коробка → когда приоткрыта крышка
    const pops = new Map(); // вещь → когда «плюхнулась» (подскок)
    box.classList.add('room');
    box.innerHTML = `<div class="room-stage"><canvas class="room-cv" width="${RW}" height="${RH}" aria-label="${t('of').replace('{n}', o.nick)}" role="img"></canvas></div>
      <div class="room-bar"><span class="room-cap">🏠 ${t('of').replace('{n}', o.nick)}</span>${o.mine ? `<span class="room-hint">${t('hintOff')}</span><button type="button" class="room-tidy" hidden></button><button type="button" class="room-edit" aria-pressed="false"></button><button type="button" class="room-light"></button><span class="room-st" aria-live="polite"></span>` : ''}</div>`;
    const cv = box.querySelector('canvas'), stage = box.querySelector('.room-stage');
    const S = o.scale || 4; cv.width = RW * S; cv.height = RH * S;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    const st = box.querySelector('.room-st');
    // панель над выбранной вещью: ⇆ ⬆ ⬇ ↩
    const selBar = document.createElement('div'); selBar.className = 'room-sel'; selBar.hidden = true;
    if (o.mine) { selBar.innerHTML = [['flip', '⇆', 'data-flip'], ['front', '⬆', 'data-z="1"'], ['behind', '⬇', 'data-z="-1"'], ['back', '↩', 'data-back']].map(([k, ic, at]) => `<button type="button" ${at} title="${t(k)}" aria-label="${t(k)}">${ic}</button>`).join(''); stage.appendChild(selBar); }
    // статичный фон (стены, пол, окно) — рисуется один раз
    let bg = null;
    const paintBg = () => {
      bg = document.createElement('canvas'); bg.width = RW; bg.height = RH; const b = bg.getContext('2d');
      (o.wallPaint || (WALL[room.wall] || WALL._)[1])(b); R(b, 0, FY - 3, RW, 3, '#6B4E3A'); R(b, 0, FY - 3, RW, 1, '#8C6A50');
      (FLOOR[room.floor] || FLOOR._)[1](b);
      R(b, WX - 3, WY - 3, WW + 6, WH + 6, '#EFE7DA'); R(b, WX - 3, WY - 3, WW + 6, 1, '#FFFFFF');
      R(b, WX - 6, WY + WH + 2, WW + 12, 3, '#E2D6C4'); R(b, WX - 6, WY + WH + 5, WW + 12, 1, '#B8AA94');
    };
    const animView = () => ['night', 'sea', 'snow', 'space', 'aurora'].includes(room.view);
    // раскладка: мебель стоит на полу или на том, что под ней (по порядку постановки)
    const has = k => room.items.some(it => parse(it.v)[0] === k);
    function layout() {
      const out = [];
      room.items.forEach((it, idx) => {
        const d = defOf(it.k, it.v); if (!d || it.in != null || (tidy && tidy.carry === it)) return; // в коробке / у птички в лапках — не видно
        if (it.k === 'deco') { out.push({ it, d, idx, x: clampX(it.x, d.w), y: Math.max(0, Math.min(RH - d.h, it.y || 20)) }); return; }
        const x = clampX(it.x, d.w);
        if (it.y != null) { out.push({ it, d, idx, x, y: Math.max(-d.h + 4, Math.min(RH - 2, Math.round(it.y))) }); return; } // поставлена руками — где угодно
        if (d.wall) { out.push({ it, d, idx, x, y: 40 - d.h }); return; } // полка без координат — на стене
        let base = GY;
        out.filter(q => q.it.k === 'furn' && q.d.top != null && (!q.d.wall || isSmall(d))).forEach(q => {
          const ov = Math.min(x + d.w, q.x + q.d.w) - Math.max(x, q.x);
          if (ov >= Math.min(d.w, q.d.w) * .5) base = Math.min(base, q.y + q.d.top);
        });
        out.push({ it, d, idx, x, y: base - d.h });
      });
      return out;
    }
    const clampX = (x, w) => Math.max(0, Math.min(RW - w, Math.round(x || 0)));
    // альбом карточек есть в каждой комнате сам: нет — ставим на свободное место (сохранится при первой правке)
    const isAlbum = it => it.k === 'furn' && parse(it.v)[0] === 'album';
    if (!room.items.some(isAlbum)) room.items.unshift({ k: 'furn', v: 'album', x: freeSpot(layout(), defOf('furn', 'album'), 'furn').x });
    const openAlbum = () => albumOf(o.nick);
    // ---------- коробки (этап 11 Г): it.id — номер коробки, it.in — вещь внутри, it.from — выпала из коробки ----------
    const isBoxIt = it => it.k === 'furn' && !!(defOf(it.k, it.v) || {}).box;
    const boxById = id => room.items.find(it => it.id === id && isBoxIt(it));
    const inBox = b => room.items.filter(it => it.in != null && it.in === b.id);
    const newId = () => room.items.reduce((m, it) => Math.max(m, it.id || 0), 0) + 1;
    const canPack = (it, d) => !!d && (it.k === 'furn' ? isSmall(d) : d.w <= 16 && d.h <= 16) && (!window.PPCanDo || window.PPCanDo(it.k, it.v).pack); // мелкая мебель и мелкие украшения (ёлочные игрушки)
    room.items.forEach(it => { if (isBoxIt(it) && !it.id) it.id = newId(); });
    room.items.forEach(it => { if (it.in != null && !boxById(it.in)) delete it.in; if (it.from != null && !boxById(it.from)) delete it.from; });
    const lidOf = (b, now) => { const l = lids.get(b); if (!l) return 0; const a = now - l.t; if (a > l.open + 200) { lids.delete(b); return 0; } return a < 120 ? a / 120 : a < l.open ? 1 : 1 - (a - l.open) / 200; };
    // куда выпрыгнуть: свободное место на полу или на столе/тумбочке недалеко от коробки (не на полках на стене и не на коробках)
    function scatterSpot(lay, d, cx) {
      const tx = cx + (Math.random() - .5) * 130, surf = [{ x0: 0, x1: RW, y: GY }];
      lay.forEach(q => { if (q.it.k === 'furn' && q.d.top != null && !q.d.box && !q.d.wall && !isSmall(q.d) && q.d.w >= d.w + 2) surf.push({ x0: q.x, x1: q.x + q.d.w, y: q.y + q.d.top }); });
      let best = null;
      surf.forEach(sf => {
        const on = lay.filter(q => q.it.k === 'furn' && q.d.h > 4 && Math.abs(q.y + q.d.h - sf.y) <= 2);
        for (let x = Math.max(0, sf.x0); x <= Math.min(RW, sf.x1) - d.w; x += 2) {
          const hit = on.reduce((a, q) => a + Math.max(0, Math.min(x + d.w, q.x + q.d.w) - Math.max(x, q.x)), 0);
          const sc = hit * 1000 + Math.abs(x + d.w / 2 - tx) + (sf.y === GY ? 0 : 8);
          if (!best || sc < best.sc) best = { x, y: sf.y - d.h, sc };
        }
      });
      return best;
    }
    // вещи выпрыгивают из коробки (дуга, кувырок, отскок) и раскидываются; у хозяина бардак сохраняется, у гостя — только на его экране
    function spill(b) {
      const list = inBox(b), bq = layout().find(q => q.it === b); if (!bq || !list.length) return;
      const now = performance.now(), cx = bq.x + bq.d.w / 2; lids.set(b, { t: now, open: 300 + list.length * 110 + 500 });
      list.forEach((it, n) => {
        const d = defOf(it.k, it.v), sp = scatterSpot(layout(), d, cx);
        delete it.in; it.from = b.id; it.x = sp.x; it.y = sp.y;
        jumps.set(it, { sx: cx - d.w / 2, sy: bq.y + bq.d.top + 2 - d.h, t0: now + 150 + n * 110, dur: 480 + Math.random() * 220, h: 14 + Math.random() * 14, spin: (Math.random() < .5 ? -1 : 1) * (Math.random() < .3 ? 2 : 1) });
      });
      showTidy(); if (o.mine) { save(); changed(); }
    }
    // ---------- что птичка делает с вещами: подходит (или запрыгивает) и делает своё, над ней — частицы ----------
    const ACTS = {
      sleep: ['coffin', 'countcoffin', 'gothicchair', 'sofa', 'armchair', 'beanbag', 'throne', 'bed', 'pouf', 'nestbed', 'beachchair', 'gamingchair', 'catbed', 'giantpizza', 'flamingo'],
      play: ['tv', 'console', 'computer', 'arcade', 'handheld', 'tamagotchi'],
      music: ['piano', 'guitar', 'drum', 'speaker', 'recordplayer', 'gramophone', 'radio'],
      read: ['books', 'bookshelf', 'spellbook', 'desk'],
      eat: ['goblet', 'souppot', 'pancakes', 'pancakepan', 'batterbowl', 'jamjars', 'honeypot', 'pancaketower', 'baguettes', 'cuttingboard', 'tieredcake', 'mixer', 'mug', 'teapot', 'cake', 'cookies', 'donuts', 'watermelon', 'pizzabox', 'breadbasket', 'applebasket', 'lemonade', 'wormchips', 'seedbag', 'candybowl', 'giantcoffee', 'gingerhouse', 'coffeemachine', 'stove', 'fridge', 'toaster'],
      splash: ['fishbowl', 'bathtub', 'fountain', 'wateringcan', 'rubberduck'],
      paint: ['easel', 'painttubes', 'brushjar', 'claypot'],
      warm: ['candelabra', 'gravelantern', 'fireplace', 'candle', 'skullcandle', 'phoenixnest', 'jacklantern'],
      gaze: ['magicpan', 'pancakecart', 'crypt', 'graveangel', 'crossgrave', 'deadtree', 'spicerack', 'telescope', 'globe', 'orb', 'portal', 'snowglobe', 'lavalamp', 'moonlamp', 'lamp', 'treasure', 'chest', 'pollystatue', 'bust', 'cauldron', 'potionshelf', 'shipbottle', 'rocket', 'grandclock', 'tombstone', 'snowman'],
      pet: ['raven', 'cat', 'blackcat', 'pollyplush', 'mrchew', 'dragon', 'flytrap', 'cattower', 'robovac'],
      unwrap: ['present', 'xmastree'],
      knit: ['knitting', 'yarn', 'socks'],
    };
    const ACT_OF = {}; Object.entries(ACTS).forEach(([a, ks]) => ks.forEach(k => { ACT_OF[k] = a; }));
    const PART = { // пиксельные частицы над птичкой
      note: [['.xx', '.x.', 'xx.'], ['#F6D04D', '#F28AB2', '#7FB3E8']], heart: [['x.x', 'xxx', '.x.'], ['#E5484D', '#F28AB2']], star: [['.x.', 'xxx', '.x.'], ['#F6D04D', '#FFFFFF']],
      crumb: [['x'], ['#D9A45B', '#8B5A3C', '#F4EBDD']], drop: [['x', 'x'], ['#7FB3E8', '#BFE3F5']], paint: [['xx', 'xx'], ['#E5484D', '#4A7BD8', '#F6D04D', '#4CC38A', '#B79CF2']],
      spark: [['x'], ['#F6D04D', '#FFE08A', '#F08A3B']], dust: [['x'], ['#E8DFD0', '#FFFFFF', '#C9BCA6']], yarn: [['xx', 'xx'], ['#F28AB2', '#7FB3E8']], paper: [['xx', 'x.'], ['#E5484D', '#4A7BD8', '#F6D04D', '#4CC38A']],
    };
    const ACT_PART = { play: 'star', music: 'note', read: 'star', eat: 'crumb', splash: 'drop', paint: 'paint', warm: 'spark', gaze: 'star', pet: 'heart', unwrap: 'paper', knit: 'yarn', deco: 'star' };
    const parts = [];
    const emit = (kind, x, y, n = 1, up = true) => { const pd = PART[kind]; if (!pd) return; for (let i = 0; i < n; i++) parts.push({ x: x + (Math.random() - .5) * 6, y, vx: (Math.random() - .5) * .02, vy: up ? -.012 - Math.random() * .012 : .01 + Math.random() * .02, t0: performance.now(), life: 1400 + Math.random() * 600, rows: pd[0], c: pd[1][Math.floor(Math.random() * pd[1].length)] }); };
    function drawParts(now) {
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i], age = now - q.t0; if (age > q.life) { parts.splice(i, 1); continue; }
        const x = q.x + q.vx * age, y = q.y + q.vy * age; g.globalAlpha = 1 - age / q.life;
        q.rows.forEach((r, yy) => [...r].forEach((ch, xx) => { if (ch === 'x') R(g, x + xx, y + yy, 1, 1, q.c); }));
        g.globalAlpha = 1;
      }
    }
    // ---------- птичка ----------
    const lk = B.dress(B.looks(o.id), o.avatar || {});
    let FR = [0, 1, 2].map(f => B.sprite(lk, f));
    const bird = { x: 40, y: GY, dir: 1, st: 'idle', t0: 0, until: 0, from: null, to: null, frame: 0, zz: false };
    const surfaces = lay => { const s = [{ x0: 8, x1: RW - 8, y: GY }]; lay.forEach(q => { if (q.it.k === 'furn' && q.d.top != null && q.d.w >= 10) s.push({ x0: q.x + 4, x1: q.x + q.d.w - 4, y: q.y + q.d.top, q }); }); return s; };
    function think(now, lay) {
      if (now < bird.until || bird.st === 'walk' || bird.st === 'hop') return; // идёт/прыгает — сначала дойти (stepBird вызовет then)
      if (tidy) return tidyStep(now, lay);
      const sf = surfaces(lay), r = Math.random(), cur = sf.find(s => Math.abs(s.y - bird.y) < 1 && bird.x >= s.x0 - 2 && bird.x <= s.x1 + 2) || sf[0];
      bird.zz = false; bird.act = null;
      if (!sf.some(z => Math.abs(z.y - bird.y) < 2)) return hop(now, Math.max(8, Math.min(RW - 8, bird.x)), GY); // была в воздухе у украшения — вниз
      // в темноте птичка чаще спит: на диване/кровати, если есть, иначе где стоит
      if (dark() && r < .6) { const beds = lay.filter(q => ACT_OF[parse(q.it.v)[0]] === 'sleep'); if (beds.length && r < .35) return useThing(now, beds[Math.floor(Math.random() * beds.length)], sf); bird.st = 'idle'; bird.zz = true; bird.act = 'sleep'; bird.until = now + 5000 + Math.random() * 5000; return; }
      // с вероятностью ~55% — заняться какой-нибудь вещью в комнате
      const toys = lay.filter(q => ACT_OF[parse(q.it.v)[0]] || q.it.k === 'deco');
      if (toys.length && r < .55) return useThing(now, toys[Math.floor(Math.random() * toys.length)], sf);
      if (r < .55) return walk(now, cur.x0 + Math.random() * (cur.x1 - cur.x0), cur.y);
      if (r < .85 && sf.length > 1) { const s = sf[Math.floor(Math.random() * sf.length)]; return hop(now, s.x0 + Math.random() * (s.x1 - s.x0), s.y); }
      bird.st = 'peck'; bird.until = now + 1200;
    }
    // подойти к вещи: на диван/кровать — запрыгнуть и уснуть; к украшению — подлететь; к остальному — встать рядом на ту же поверхность
    function useThing(now, q, sf) {
      const k = parse(q.it.v)[0], act = q.it.k === 'deco' ? 'deco' : ACT_OF[k];
      const start = (st, ms) => () => { bird.st = st; bird.act = act; bird.actQ = q; bird.dir = q.x + q.d.w / 2 > bird.x ? 1 : -1; if (act === 'sleep') bird.zz = true; bird.until = performance.now() + ms; };
      if (act === 'sleep' && q.d.top != null) { const s = sf.find(z => z.q === q); if (s) return hop(now, s.x0 + Math.random() * (s.x1 - s.x0), s.y, start('sleep', 5000 + Math.random() * 4000)); }
      if (act === 'deco') return hop(now, Math.max(6, Math.min(RW - 6, q.x + q.d.w / 2 + (Math.random() < .5 ? -8 : 8))), Math.min(GY, q.y + q.d.h + 10), start('hover', 2200));
      const base = q.y + q.d.h, s = sf.find(z => Math.abs(z.y - base) < 1 && q.x + q.d.w / 2 >= z.x0 - 4 && q.x + q.d.w / 2 <= z.x1 + 4) || sf[0];
      const side = q.x + q.d.w + 6 < s.x1 ? q.x + q.d.w + 6 : Math.max(s.x0, q.x - 6);
      const tx = Math.max(s.x0, Math.min(s.x1, side)), go = Math.abs(s.y - bird.y) > 1 ? hop : walk;
      if (go === walk) { walk(now, tx, s.y); bird.to.then = start(act === 'warm' ? 'sleep' : 'use', 3500 + Math.random() * 2500); return; }
      return hop(now, tx, s.y, start(act === 'warm' ? 'sleep' : 'use', 3500 + Math.random() * 2500));
    }
    const walk = (now, x, y, sp = .03) => { bird.st = 'walk'; bird.from = { x: bird.x, y: bird.y, t: now }; bird.to = { x, y }; bird.dir = x > bird.x ? 1 : -1; bird.until = now + Math.abs(x - bird.x) / sp; };
    const hop = (now, x, y, then) => { bird.st = 'hop'; bird.from = { x: bird.x, y: bird.y, t: now }; bird.to = { x, y, then }; bird.dir = x > bird.x ? 1 : -1; bird.until = now + 650; };
    const go = (now, x, y, then) => { x = Math.max(6, Math.min(RW - 6, x)); if (Math.abs(y - bird.y) > 1) return hop(now, x, y, then); walk(now, x, y, .06); bird.to.then = then; };
    // «🧹 Прибраться»: ближайшая выпавшая вещь → взять → на коробку → внутрь; так по одной, пока всё не уберёт
    function tidyStep(now, lay) {
      bird.zz = false; bird.act = null;
      const c = tidy.carry, later = ms => { bird.until = performance.now() + ms; };
      if (!c) {
        const it = fallen().filter(x => lay.some(q => q.it === x)).sort((a, b) => Math.abs(a.x - bird.x) - Math.abs(b.x - bird.x))[0];
        if (!it) { tidy = null; showTidy(); return; }
        const q = lay.find(z => z.it === it);
        return go(now, q.x + q.d.w / 2, q.y + q.d.h, () => { if (!tidy) return; if (room.items[sel] === it) sel = -1; tidy.carry = it; emit('dust', q.x + q.d.w / 2, q.y + q.d.h - 1, 3, true); later(250); });
      }
      const b = boxById(c.from), bq = b && lay.find(z => z.it === b);
      if (!bq || !room.items.includes(c)) { tidy.carry = null; return; } // коробку убрали — вещь остаётся, где лежала
      return go(now, bq.x + bq.d.w / 2, bq.y + bq.d.top, () => {
        if (!tidy) return; const t2 = performance.now();
        c.in = c.from; delete c.from; delete c.y; tidy.carry = null; lids.set(b, { t: t2, open: 450 }); pops.set(b, t2); emit('star', bq.x + bq.d.w / 2, bq.y - 2, 2);
        save(); changed(); showTidy(); later(350);
      });
    }
    const goFloor = (now, x, then) => { if (Math.abs(bird.y - GY) > 1) return hop(now, x, GY, then); walk(now, x, GY); bird.to.then = then; };
    function stepBird(now) {
      if (bird.st === 'walk' || bird.st === 'hop') {
        const k = Math.min(1, (now - bird.from.t) / Math.max(1, bird.until - bird.from.t));
        bird.x = bird.from.x + (bird.to.x - bird.from.x) * k; bird.y = bird.from.y + (bird.to.y - bird.from.y) * k - (bird.st === 'hop' ? Math.sin(Math.PI * k) * 14 : 0);
        bird.frame = bird.st === 'walk' ? Math.floor(now / 160) % 2 : 0;
        if (k >= 1) { bird.x = bird.to.x; bird.y = bird.to.y; const th2 = bird.to.then; bird.st = 'idle'; bird.until = now + 600 + Math.random() * 1500; if (th2) th2(); }
      } else if (bird.st === 'peck' || bird.st === 'play' || bird.st === 'use') {
        bird.frame = Math.floor(now / 250) % 2 ? 2 : 0;
        // частицы занятия: ноты, крошки, капли, краски, сердечки…
        if (bird.act && Math.random() < (bird.act === 'eat' ? .06 : .035)) { const q = bird.actQ, kind = ACT_PART[bird.act]; if (kind) emit(kind, q ? q.x + q.d.w / 2 : bird.x, q ? q.y - 2 : bird.y - 22, 1, kind !== 'crumb'); }
        if (bird.act === 'music' && Math.random() < .03) emit('note', bird.x, bird.y - 20);
        if (bird.act === 'pet' && Math.random() < .03) emit('heart', bird.x, bird.y - 20);
      } else if (bird.st === 'hover') { bird.frame = 0; bird.y += Math.sin(now / 120) * .15; if (Math.random() < .04) emit('star', bird.x, bird.y - 18); }
      else { bird.frame = 0; if (bird.zz && bird.act === 'sleep' && Math.random() < .004) emit('heart', bird.x, bird.y - 20); }
    }
    function drawBird(now) {
      const c = FR[bird.frame] || FR[0], k = .75, w = c.width * k, h = c.height * k; // птичка в комнате чуть меньше, чем в стае
      g.save();
      if (bird.dir < 0) { g.translate(Math.round(bird.x) * 2, 0); g.scale(-1, 1); }
      g.drawImage(c, Math.round(bird.x) - w / 2, Math.round(bird.y) - h + 1, w, h);
      g.restore();
      if (bird.zz) { const z = Math.floor(now / 600) % 3; for (let i = 0; i <= z; i++) R(g, bird.x + 6 + i * 4, bird.y - h - 2 - i * 4, 3, 1, '#FFFFFF'); }
    }
    // ---------- кадр ----------
    let raf = 0;
    function frame(now) {
      if (!o.still && !o.film) raf = requestAnimationFrame(frame); // o.still — один кадр без анимации (снимок для галереи комнат); o.film — кадры по api.frame(t) (видео, tools/video)
      if (!box.isConnected) { cancelAnimationFrame(raf); return; }
      const lay = layout();
      g.setTransform(S, 0, 0, S, 0, 0); g.imageSmoothingEnabled = false;
      g.drawImage(bg, 0, 0);
      g.save(); g.beginPath(); g.rect(WX, WY, WW, WH); g.clip(); (VIEW[room.view] || VIEW._)[1](g, WX, WY, now); g.restore();
      R(g, WX + WW / 2 - 1, WY, 2, WH, '#EFE7DA'); R(g, WX, WY + WH / 2 - 1, WW, 2, '#EFE7DA');
      drawCurtains(g, room.curtain);
      const ctx = { has };
      lay.forEach(q => {
        const pp = pops.get(q.it); let oy = 0;
        if (pp != null) { const a = now - pp; if (a > 560) pops.delete(q.it); else oy = a < 240 ? -18 * (1 - (a / 240) ** 2) : -4 * Math.sin(Math.PI * (a - 240) / 320); } // падает и подпрыгивает
        // выпрыгивает из коробки: дуга с кувырком, потом отскок и пылинки
        const jp = jumps.get(q.it); let jx = 0, rot = 0;
        if (jp) {
          const a = now - jp.t0; if (a < 0) return; // ещё в коробке
          if (a < jp.dur) { const k = a / jp.dur; jx = (jp.sx - q.x) * (1 - k); oy = (jp.sy - q.y) * (1 - k) - jp.h * Math.sin(Math.PI * k); rot = jp.spin * Math.PI * 2 * k; }
          else if (a < jp.dur + 280) { oy = -3 * Math.sin(Math.PI * (a - jp.dur) / 280); if (!jp.dust) { jp.dust = 1; for (let i = 0; i < 4; i++) emit('dust', q.x + Math.random() * q.d.w, q.y + q.d.h - 1, 1, true); } }
          else jumps.delete(q.it);
        }
        const X = q.x + jx, Y = q.y + oy;
        ctx.lid = q.d.box ? lidOf(q.it, now) : 0;
        if (q.d.glow) { g.fillStyle = 'rgba(255,214,120,.13)'; g.beginPath(); g.arc(q.x + q.d.glow[0], q.y + q.d.glow[1], 26, 0, Math.PI * 2); g.fill(); }
        if (rot) { g.save(); g.translate(X + q.d.w / 2, Y + q.d.h / 2); g.rotate(rot); g.translate(-X - q.d.w / 2, -Y - q.d.h / 2); }
        if (q.it.f) { g.save(); g.translate((X * 2 + q.d.w), 0); g.scale(-1, 1); q.d.d(P(g, X, Y), now, q.d.i, ctx); g.restore(); }
        else q.d.d(P(g, X, Y), now, q.d.i, ctx);
        if (rot) g.restore();
        if (edit && q.idx === sel) {
          const fl = now - flash < 1400 && Math.floor((now - flash) / 200) % 2 === 0; // «уже в комнате» — мигает
          g.strokeStyle = fl ? '#F5D547' : '#F0A987'; g.lineWidth = fl ? 1.2 : .6; g.setLineDash([1.5, 1]); g.strokeRect(q.x - 1.5, q.y - 1.5, q.d.w + 3, q.d.h + 3); g.setLineDash([]);
        }
      });
      placeSel(lay);
      if (o.film) o.film(g, now, lay); else { think(now, lay); stepBird(now); drawBird(now); } // в видео птичку и всё своё рисует сценарий
      if (tidy && tidy.carry) { const d = defOf(tidy.carry.k, tidy.carry.v); if (d) d.d(P(g, bird.x - d.w / 2, bird.y - FR[0].height * .75 - d.h + 3), now, d.i, ctx); } // несёт вещь над головой
      drawParts(now);
      drawDark(lay, now);
      // сколько вещей в коробке — кружок «N» (поверх темноты, чтобы было видно)
      lay.forEach(q => {
        if (!q.d.box) return; const n = inBox(q.it).length; if (!n) return;
        const bx = q.x + q.d.w - 1, by = q.y + q.d.top + 1;
        g.fillStyle = '#E5484D'; g.beginPath(); g.arc(bx, by, 3.3, 0, Math.PI * 2); g.fill(); g.lineWidth = .6; g.strokeStyle = '#FFFFFF'; g.stroke();
        g.fillStyle = '#FFFFFF'; g.font = 'bold 4.6px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(n > 9 ? '9+' : String(n), bx, by + .3);
      });
    }
    // ---------- свет (этап 11 Б): room.light === 0 — выключен; комната темнеет, вещи из GLOW светят ----------
    const dark = () => room.light === 0;
    let dkLv = dark() ? 1 : 0, dk = null;
    function drawDark(lay, now) {
      dkLv += ((dark() ? 1 : 0) - dkLv) * .12; if (dkLv < .01) { dkLv = 0; return; }
      if (!dk) { dk = document.createElement('canvas'); dk.width = RW * 2; dk.height = RH * 2; }
      const c = dk.getContext('2d'), src = [];
      lay.forEach(q => { const gl = GLOW[q.d.k]; if (!gl) return; const [gx, gy] = q.d.glow || [q.d.w / 2, q.d.h / 2]; src.push([q.x + (q.it.f ? q.d.w - gx : gx), q.y + gy, gl[1] * (1 + .06 * Math.sin(now / 180 + q.idx * 1.7)), gl[0]]); });
      c.setTransform(2, 0, 0, 2, 0, 0); c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, RW, RH);
      c.fillStyle = 'rgba(10,12,34,' + (.74 * dkLv) + ')'; c.fillRect(0, 0, RW, RH);
      c.globalCompositeOperation = 'destination-out';
      c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(WX, WY, WW, WH); // из окна — немного света
      src.forEach(([x, y, r]) => { const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.35, 'rgba(0,0,0,.8)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); });
      g.drawImage(dk, 0, 0, RW, RH);
      g.save(); g.globalCompositeOperation = 'lighter';
      src.forEach(([x, y, r, col]) => { const gr = g.createRadialGradient(x, y, 0, x, y, r * .8), a = Math.round(70 * dkLv).toString(16).padStart(2, '0'); gr.addColorStop(0, col + a); gr.addColorStop(1, col + '00'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); });
      g.restore();
    }
    const tidyBtn = box.querySelector('.room-tidy');
    const fallen = () => room.items.filter(it => it.from != null && it.in == null && boxById(it.from));
    const showTidy = () => { if (!tidyBtn) return; tidyBtn.hidden = !tidy && !fallen().length; tidyBtn.disabled = !!tidy; tidyBtn.textContent = t('tidy'); };
    if (tidyBtn) { showTidy(); tidyBtn.onclick = () => { if (tidy || !fallen().length) return; tidy = { carry: null }; bird.until = 0; if (bird.to) bird.to.then = null; showTidy(); }; } // бросает своё занятие и идёт убирать
    const lightBtn = box.querySelector('.room-light');
    const showLight = () => { if (!lightBtn) return; lightBtn.textContent = dark() ? '🌙' : '💡'; lightBtn.title = t(dark() ? 'lightOn' : 'lightOff'); lightBtn.setAttribute('aria-label', lightBtn.title); lightBtn.setAttribute('aria-pressed', String(dark())); };
    if (lightBtn) { showLight(); lightBtn.onclick = () => { if (dark()) delete room.light; else room.light = 0; showLight(); save(); changed(); }; }
    // ✏️ — режим обустройства: только в нём вещи тянутся и выбираются
    const editBtn = box.querySelector('.room-edit'), hintEl = box.querySelector('.room-hint');
    const setEdit = on => {
      edit = !!on && !!o.mine; box.classList.toggle('editing', edit);
      if (!edit) { sel = -1; drag = null; selBar.hidden = true; }
      if (editBtn) { editBtn.textContent = edit ? '✓' : '✏️'; editBtn.title = t(edit ? 'editOff' : 'editOn'); editBtn.setAttribute('aria-label', editBtn.title); editBtn.setAttribute('aria-pressed', String(edit)); }
      if (hintEl) hintEl.textContent = t(edit ? 'hint' : 'hintOff');
    };
    if (editBtn) { setEdit(false); editBtn.onclick = () => setEdit(!edit); }
    // ---------- хозяин: обустройство ----------
    const owned = () => { const m = {}; ((o.me && o.me.gifts) || []).forEach(x => { if (x.status === 'bag' && isRoom(x.kind)) m[x.kind + '|' + x.item] = (m[x.kind + '|' + x.item] || 0) + 1; }); return m; };
    const placed = key => room.items.filter(it => it.k + '|' + it.v === key).length;
    // мебель, отпущенная рядом с полом или верхом другой вещи (±5px), встаёт на них; иначе висит, где оставили
    let snapOn = -1; // на какую вещь встала перетаскиваемая (чтобы при отпускании оказаться поверх неё)
    function snapY(it, idx) {
      const d = defOf(it.k, it.v), x = clampX(it.x, d.w), bot = it.y + d.h;
      let best = Math.abs(bot - GY) <= 5 ? GY : null; snapOn = -1;
      layout().forEach(q => {
        if (q.idx === idx || q.d.top == null || q.it.k !== 'furn' || (q.d.wall && !isSmall(d))) return; // на полку на стену — только мелкое
        const ov = Math.min(x + d.w, q.x + q.d.w) - Math.max(x, q.x), top = q.y + q.d.top;
        if (ov >= Math.min(d.w, q.d.w) * .4 && Math.abs(bot - top) <= 5 && (best == null || Math.abs(bot - top) < Math.abs(bot - best))) { best = top; snapOn = q.idx; }
      });
      return best == null ? it.y : best - d.h;
    }
    function save() {
      if (o.preview) return; // примерка в окне вещи (магазин) — ничего не сохраняем
      clearTimeout(saveT); if (st) st.textContent = t('saving');
      saveT = setTimeout(() => fetch('/api/room', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ room }) })
        .then(r => { if (!r.ok) throw 0; if (st) st.textContent = t('saved'); }).catch(() => { if (st) st.textContent = t('err'); }), 500);
    }
    const changed = () => { if (o.me) o.me.room = room; if (o.onRoom) o.onRoom(room); }; // сумка пересчитывает ✓
    function placeSel(lay) {
      if (!o.mine) return;
      const q = sel >= 0 && lay.find(z => z.idx === sel);
      if (!q || !edit) { selBar.hidden = true; return; }
      selBar.hidden = false; selBar.querySelector('[data-back]').hidden = isAlbum(q.it); // альбом в сумку не убрать
      const below = q.y / RH * stage.clientHeight < 58, cx = Math.max(14, Math.min(86, (q.x + q.d.w / 2) / RW * 100));
      selBar.style.left = cx + '%'; selBar.style.top = ((below ? q.y + q.d.h : q.y) / RH * 100) + '%';
      selBar.classList.toggle('below', below);
    }
    // птичка подбегает посмотреть на новую вещь
    function lookAt(it) {
      const q = layout().find(z => z.it === it); if (!q) return;
      const cx = q.x + q.d.w / 2, side = bird.x < cx ? -1 : 1, tx = Math.max(8, Math.min(RW - 8, cx + side * (q.d.w / 2 + 6)));
      bird.zz = false; bird.act = null;
      goFloor(performance.now(), tx, () => { bird.st = 'use'; bird.act = 'gaze'; bird.actQ = q; bird.dir = cx > bird.x ? 1 : -1; bird.until = performance.now() + 2400; });
    }
    // useItem для комнаты: own — сколько таких штук в сумке. Возвращает { done: 'put' | 'on' | 'off' | 'there', undo }
    function use(kind, v, own) {
      if (ROOM_KINDS[kind]) { // обои, пол, вид, шторы — сразу; повторное нажатие — как было
        const prev = room[kind]; if (prev === v) delete room[kind]; else room[kind] = v;
        paintBg(); save(); changed();
        return { done: prev === v ? 'off' : 'on', undo: () => { if (prev == null) delete room[kind]; else room[kind] = prev; paintBg(); save(); changed(); } };
      }
      const key = kind + '|' + v, d = defOf(kind, v); if (!d) return null;
      if (own == null) own = owned()[key] || 0;
      if (placed(key) >= own) { const q = [...layout()].reverse().find(z => z.it.k + '|' + z.it.v === key); if (q) { sel = q.idx; flash = performance.now(); } return { done: 'there' }; }
      const sp = freeSpot(layout(), d, kind), it = { k: kind, v, x: sp.x, y: sp.y };
      if (d.box) it.id = newId();
      room.items.push(it); if (o.mine && !o.preview) setEdit(true); sel = room.items.length - 1; pops.set(it, performance.now()); // новую вещь сразу можно подвинуть
      setTimeout(() => { for (let i = 0; i < 7; i++) emit('dust', it.x + Math.random() * d.w, it.y + d.h - 1, 1, true); }, 240); // пылинки при «плюх»
      setTimeout(() => lookAt(it), 300);
      save(); changed();
      return { done: 'put', undo: () => { const i = room.items.indexOf(it); if (i < 0) return; room.items.splice(i, 1); sel = sel === i ? -1 : sel > i ? sel - 1 : sel; save(); changed(); } };
    }
    const api = { use, frame, mine: !!o.mine, box, dress: av => { FR = [0, 1, 2].map(f => B.sprite(B.dress(B.looks(o.id), av || {}), f)); } };
    if (o.mine) window.PPRoom.live = api;
    if (o.mine) {
      selBar.querySelector('[data-flip]').onclick = () => { const it = room.items[sel]; if (it) { it.f = it.f ? 0 : 1; save(); } };
      selBar.querySelector('[data-back]').onclick = () => { if (sel < 0 || isAlbum(room.items[sel])) return;
        const b = room.items[sel]; if (isBoxIt(b)) { spill(b); room.items.forEach(it => { if (it.from === b.id) delete it.from; }); } // коробку в сумку — вещи из неё остаются в комнате
        room.items.splice(sel, 1); showTidy(); sel = -1; selBar.hidden = true; save(); changed(); };
      const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * RW, (e.clientY - r.top) / r.height * RH]; };
      cv.addEventListener('pointerdown', e => {
        if (!edit) return;
        const [px, py] = pt(e), lay = layout();
        // берём самую верхнюю вещь под пальцем (рисуются по порядку списка: последняя — сверху)
        const hit = [...lay].reverse().find(q => px >= q.x && px <= q.x + q.d.w && py >= q.y && py <= q.y + q.d.h);
        if (!hit) { sel = -1; selBar.hidden = true; return; }
        sel = hit.idx; placeSel(lay); box.focus({ preventScroll: true }); // сразу на место: иначе до следующего кадра панель стоит в углу и касание попадает в «↩»
        // закрепить всё на своих местах: дальше вещи двигаются только руками, ничего не «перепрыгивает»
        lay.forEach(q => { if (q.it.y == null) { q.it.x = q.x; q.it.y = q.y; } });
        // что стоит на взятой вещи (и на том, что на ней), едет вместе с ней
        const riders = [], on = p => lay.forEach(q => {
          if (q === p || riders.some(r => r.q === q) || q.it.k !== 'furn' || p.d.top == null) return;
          const ov = Math.min(q.x + q.d.w, p.x + p.d.w) - Math.max(q.x, p.x);
          if (ov > 0 && Math.abs(q.y + q.d.h - (p.y + p.d.top)) <= 1 && q.idx > p.idx) { riders.push({ q, dx: q.x - hit.x, dy: q.y - hit.y }); on(q); }
        });
        if (hit.it.k === 'furn') on(hit);
        drag = { dx: px - hit.x, dy: py - hit.y, moved: false, riders, it: hit.it }; cv.setPointerCapture(e.pointerId); e.preventDefault();
      });
      cv.addEventListener('pointermove', e => {
        if (!drag || sel < 0) return;
        const [px, py] = pt(e), it = room.items[sel]; drag.moved = true; drag.px = px; drag.py = py;
        it.x = Math.round(px - drag.dx); it.y = Math.round(py - drag.dy);
        if (it.k === 'furn') it.y = snapY(it, sel);
        drag.riders.forEach(r => { r.q.it.x = it.x + r.dx; r.q.it.y = it.y + r.dy; });
      });
      const up = () => {
        const it0 = drag && drag.moved && room.items[sel], d0 = it0 && defOf(it0.k, it0.v);
        if (it0 && !drag.riders.length && canPack(it0, d0)) { // мелкую вещь отпустили на коробку — она уходит внутрь
          const lay = layout(), on = room.items[snapOn];
          const bq = (on && isBoxIt(on) && lay.find(q => q.it === on)) || [...lay].reverse().find(q => q.d.box && q.it !== it0 && drag.px >= q.x - 1 && drag.px <= q.x + q.d.w + 1 && drag.py >= q.y - 4 && drag.py <= q.y + q.d.h);
          if (bq) {
            const t2 = performance.now(); it0.in = bq.it.id; delete it0.from; delete it0.y; lids.set(bq.it, { t: t2, open: 450 }); pops.set(bq.it, t2);
            sel = -1; selBar.hidden = true; drag = null; snapOn = -1; moved = true; save(); changed(); showTidy(); return;
          }
        }
        if (drag && drag.moved) {
          // встала на вещь, которая рисуется позже, — переложить сразу за ней, иначе окажется за столешницей
          if (snapOn > sel && room.items[sel] && room.items[sel].k === 'furn') {
            const target = room.items[snapOn], block = [sel, ...drag.riders.map(r => r.q.idx)].sort((x, y) => x - y).map(i => room.items[i]);
            room.items = room.items.filter(x => !block.includes(x)); const at = room.items.indexOf(target) + 1;
            room.items.splice(at, 0, ...block); sel = room.items.indexOf(drag.it);
          }
          save();
        }
        moved = !!(drag && drag.moved); drag = null; snapOn = -1;
      };
      // слой: вперёд/назад на одну вещь или поверх всего
      selBar.querySelectorAll('[data-z]').forEach(b => b.onclick = () => {
        if (sel < 0) return; const z = b.dataset.z, to = z === 'top' ? room.items.length - 1 : Math.max(0, Math.min(room.items.length - 1, sel + Number(z)));
        if (to === sel) return; const it = room.items.splice(sel, 1)[0]; room.items.splice(to, 0, it); sel = to; save();
      });
      // стрелки — сдвиг на пиксель (Shift — на 8)
      box.tabIndex = -1;
      box.addEventListener('keydown', e => {
        if (!edit || sel < 0) return; const it = room.items[sel], d = defOf(it.k, it.v); if (!it || !d) return;
        const st2 = e.shiftKey ? 8 : 1, dx = { ArrowLeft: -st2, ArrowRight: st2 }[e.key] || 0, dy = { ArrowUp: -st2, ArrowDown: st2 }[e.key] || 0;
        if (e.key === 'Escape') { sel = -1; return; }
        if (e.key === 'Delete' || e.key === 'Backspace') { selBar.querySelector('[data-back]').click(); e.preventDefault(); return; }
        if (!dx && !dy) return; e.preventDefault();
        const q = layout().find(z => z.idx === sel); it.x = (q ? q.x : it.x) + dx; it.y = (q ? q.y : it.y || 0) + dy; save();
      });
      cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    }
    // ---------- нажатие на альбом (хозяин и гости) — разворот альбома; хозяин, потащив альбом, его не открывает ----------
    let moved = false;
    const albumAt = e => { const r = cv.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * RW, py = (e.clientY - r.top) / r.height * RH; const hit = [...layout()].reverse().find(q => px >= q.x && px <= q.x + q.d.w && py >= q.y && py <= q.y + q.d.h); return hit && isAlbum(hit.it); };
    cv.addEventListener('click', e => { if (moved) { moved = false; return; } if (!o.preview && !o.still && albumAt(e)) openAlbum(); else if (!o.still && !edit) knock(boxAt(e)); });
    // коробка: нажать 3 раза подряд (мышкой или пальцем) — вещи выпрыгивают; на 1-м и 2-м нажатии крышка вздрагивает. В ✏️ — не открывается
    let knocks = null;
    const knock = b => {
      if (!b || !inBox(b).length) { knocks = null; return; }
      const now = performance.now(); knocks = knocks && knocks.b === b && now - knocks.t < 900 ? { b, n: knocks.n + 1, t: now } : { b, n: 1, t: now };
      if (knocks.n >= 3) { knocks = null; spill(b); } else lids.set(b, { t: now, open: 140 });
    };
    const boxAt = e => { const r = cv.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * RW, py = (e.clientY - r.top) / r.height * RH; const hit = [...layout()].reverse().find(q => px >= q.x && px <= q.x + q.d.w && py >= q.y && py <= q.y + q.d.h); return hit && hit.d.box ? hit.it : null; };
    cv.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && !o.mine) cv.style.cursor = albumAt(e) ? 'pointer' : ''; });
    // ---------- название вещи при наведении (видно всем, и гостям): мебель/украшение, иначе окно, шторы, пол, стены ----------
    const tip = document.createElement('div'); tip.className = 'room-tip'; tip.hidden = true; stage.appendChild(tip);
    const nameAt = (px, py) => {
      const hit = [...layout()].reverse().find(q => px >= q.x && px <= q.x + q.d.w && py >= q.y && py <= q.y + q.d.h);
      if (hit) return nameOf(hit.it.k, hit.it.v);
      if (room.view && px >= WX && px <= WX + WW && py >= WY && py <= WY + WH) return nameOf('view', room.view);
      if (room.curtain && py >= WY - 8 && py <= WY + WH + 12 && ((px >= WX - 16 && px < WX) || (px > WX + WW && px <= WX + WW + 16))) return nameOf('curtain', room.curtain);
      if (room.floor && py >= FY) return nameOf('floor', room.floor);
      if (room.wall && py < FY) return nameOf('wall', room.wall);
      return '';
    };
    const showTip = e => {
      const r = cv.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * RW, py = (e.clientY - r.top) / r.height * RH;
      const nm = e.buttons ? '' : nameAt(px, py); // пока тащат вещь — без подсказки
      if (!nm) { tip.hidden = true; return; }
      tip.textContent = nm; tip.hidden = false;
      const sr = stage.getBoundingClientRect();
      tip.style.left = Math.min(sr.width - 10, Math.max(10, e.clientX - sr.left)) + 'px'; tip.style.top = (e.clientY - sr.top - 14) + 'px';
    };
    cv.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') showTip(e); });
    cv.addEventListener('pointerleave', () => { tip.hidden = true; });
    cv.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { showTip(e); clearTimeout(tip._t); tip._t = setTimeout(() => { tip.hidden = true; }, 1800); } }); // на телефоне — по касанию
    paintBg();
    if (!o.film) raf = requestAnimationFrame(frame);
    return api;
  }
  const aboutOf = (kind, v, l = L) => { const a = ABOUT[kind + '|' + parse(v)[0]]; return a ? a[l] : ''; }; // описание вещи (пока у наград Титоса)
  window.PPRoom = { mount, albumOf, icon, nameOf, aboutOf, potCoffee, isRoom, RW, RH, defOf, ROOM_KINDS, freeSpot, isSmall, GLOW, live: null }; // live — своя комната на странице (для useItem) // defOf и ROOM_KINDS — ещё и для tools/catalog.js (ценность вещей)
})();
