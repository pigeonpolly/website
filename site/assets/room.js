// Комната птички (профиль /bird/): пиксельная комната 192×120 — стены, пол, одно окно (вид за окном), шторы по бокам,
// мебель и вещи (ставятся на пол или друг на друга), украшения (висят где угодно: на ёлке, на стене). Птичка в комнате гуляет,
// запрыгивает на мебель, спит на диване, играет в приставку. Вещи для комнаты — подарки того же каталога, что и для птички
// (PPBirds.GIFTS: wall, floor, view, curtain, furn, deco) — их можно купить, подарить, получить в адвенте.
// Хозяин комнаты: «✏️ Обустроить» — снизу вещи из сумки, нажать — поставить; тянуть — двигать; ⇆ — повернуть; ↩ — убрать в сумку.
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
        for (let i = 0; i < w; i++) R(g, x0 + i, top + k, 1, 1, i % 3 === 1 ? b : a);
        if (dot && k % 5 === 2) R(g, x0 + (k % 10 < 5 ? 2 : Math.max(2, w - 3)), top + k, 1, 1, dot);
      }
      R(g, side ? WX + WW + 6 : WX - 14, top + tie, 8, 2, '#E9C46A');
    }
  }

  // ---------- мебель и вещи: w, h, top (высота поверхности сверху, куда можно ставить; null — нельзя), d(g, x, y, t, room) ----------
  const SOFA_C = [['#7F5FB8', '#5E438F', '#9C80D0'], ['#3F7D5C', '#2D5C43', '#5C9C78'], ['#D9A33B', '#B5832A', '#EBC064'], ['#E58CA8', '#C46B88', '#F2AFC4']];
  const GIFT_C = [['#E5484D', '#F6D04D'], ['#4A7BD8', '#FFFFFF'], ['#4CC38A', '#E5484D'], ['#B79CF2', '#F6D04D']];
  const ORN_C = ['#E5484D', '#E9C46A', '#4A7BD8', '#C9CDD6', '#F28AB2', '#4CC38A'];
  const P = (g, x0, y0) => (x, y, w, h, c) => R(g, x0 + x, y0 + y, w, h, c);
  const spr = (p, rows, pal) => rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) p(x, y, 1, 1, pal[ch]); }));
  const FURN = {
    sofa: { n: i => [['Purple sofa', 'Сиреневый диван', 'Violets dīvāns'], ['Green velvet sofa', 'Зелёный бархатный диван', 'Zaļš samta dīvāns'], ['Mustard sofa', 'Горчичный диван', 'Sinepju dīvāns'], ['Pink sofa', 'Розовый диван', 'Rozā dīvāns']][i], v: 4, w: 48, h: 22, top: 10, sit: true,
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
    ornament: { n: i => [['Red ornament', 'Красный шарик', 'Sarkana bumbiņa'], ['Gold ornament', 'Золотой шарик', 'Zelta bumbiņa'], ['Blue ornament', 'Синий шарик', 'Zila bumbiņa'], ['Silver ornament', 'Серебряный шарик', 'Sudraba bumbiņa'], ['Pink ornament', 'Розовый шарик', 'Rozā bumbiņa'], ['Green ornament', 'Зелёный шарик', 'Zaļa bumbiņa']][i], v: 6, w: 5, h: 7,
      d: (p, t, i) => { const c = ORN_C[i]; p(2, 0, 1, 1, '#C9C9D6'); p(1, 1, 3, 1, '#E9C46A'); p(1, 2, 3, 1, c); p(0, 3, 5, 3, c); p(1, 6, 3, 1, c); p(1, 3, 1, 1, '#FFFFFF'); } },
    xmasstar: { n: () => ['Tree-top star', 'Звезда на ёлку', 'Zvaigzne eglei'], w: 9, h: 9,
      d: (p, t) => { spr(p, ['....s....', '....s....', '...sss...', 'sssssssss', '.sssssss.', '..sssss..', '.sss.sss.', '.ss...ss.', 's.......s'], { s: '#F6D04D' }); p(4, 4, 1, 1, '#FFF3B0'); if (Math.sin(t / 300) > .6) { p(-1, 0, 1, 1, '#FFFFFF'); p(9, 2, 1, 1, '#FFFFFF'); } } },
    lights: { n: () => ['Fairy lights', 'Гирлянда-огоньки', 'Lampiņu virtene'], w: 32, h: 6,
      d: (p, t) => { const c = ['#E5484D', '#F6D04D', '#4CC38A', '#4A7BD8', '#F28AB2']; for (let x = 0; x < 32; x++) p(x, Math.round(Math.sin(x / 32 * Math.PI) * 3), 1, 1, '#2E4A2E'); for (let k = 0; k < 8; k++) { const x = 2 + k * 4, y = Math.round(Math.sin(x / 32 * Math.PI) * 3) + 1, on = Math.sin(t / 250 + k * 1.7) > -.3; p(x, y, 2, 2, on ? c[k % 5] : '#5B5670'); } } },
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
  // значения каталога: «sofa:2», «ornament:4»; у вещей без цветов — просто имя
  const vals = o => Object.entries(o).flatMap(([k, d]) => d.v ? [...Array(d.v)].map((_, i) => k + ':' + i) : [k]);
  const parse = v => { const [k, i] = String(v).split(':'); return [k, +i || 0]; };
  const defOf = (kind, v) => { const [k, i] = parse(v); const d = (kind === 'deco' ? DECO : FURN)[k]; return d ? { ...d, k, i } : null; };
  const ROOM_KINDS = { wall: WALL, floor: FLOOR, view: VIEW, curtain: CURT };
  const nameOf = (kind, v) => {
    if (ROOM_KINDS[kind]) { const e = ROOM_KINDS[kind][v]; return e ? e[0][L] : v; }
    const d = defOf(kind, v); return d ? d.n(d.i)[L] : v;
  };

  // ---------- регистрация в каталоге подарков (коллекции, магазин, сумка, адвент, кабинет) ----------
  const LEG = ['furn|throne', 'view|aurora', 'wall|gold', 'floor|marble']; // то же в worker/index.js LEGEND
  Object.assign(B.GIFTS, { wall: Object.keys(WALL).filter(k => k !== '_'), floor: Object.keys(FLOOR).filter(k => k !== '_'), view: Object.keys(VIEW).filter(k => k !== '_'),
    curtain: Object.keys(CURT), furn: vals(FURN), deco: vals(DECO) });
  LEG.forEach(x => B.LEGEND.add(x));
  B.GIFT_KINDS.push(['furn', ['Furniture & things', 'Мебель и вещи', 'Mēbeles un lietas']], ['deco', ['Decorations', 'Украшения', 'Rotājumi']], ['wall', ['Wallpaper', 'Обои', 'Tapetes']],
    ['floor', ['Floors', 'Пол', 'Grīdas']], ['view', ['Window views', 'Вид из окна', 'Skats pa logu']], ['curtain', ['Curtains', 'Шторы', 'Aizkari']]);
  const th = id => B.GIFT_THEMES.find(t => t[0] === id);
  const addTh = (id, list) => { const t = th(id); if (t) t[2].push(...list); };
  addTh('legendary', LEG);
  addTh('newyear', ['furn|xmastree', ...[0, 1, 2, 3].map(i => 'furn|present:' + i), 'furn|snowman', ...[0, 1, 2, 3, 4, 5].map(i => 'deco|ornament:' + i), 'deco|xmasstar', 'deco|lights', 'deco|tinsel', 'deco|bell', 'deco|candycane', 'deco|snowflake', 'wall|xmas', 'view|snow']);
  addTh('autumn', ['wall|leaves', 'view|autumn', 'furn|pumpkin', 'curtain|mustard']);
  addTh('halloween', ['furn|pumpkin', 'furn|candle']);
  addTh('gaming', ['furn|tv', 'furn|console', 'furn|beanbag', 'view|space']);
  addTh('art', ['deco|painting', 'furn|desk']);
  addTh('cafe', ['furn|roundtable', 'furn|mug', 'furn|teapot', 'furn|cake']);
  addTh('school', ['furn|bookshelf', 'furn|books', 'furn|globe', 'furn|desk']);
  addTh('summer', ['view|sea', 'view|rainbow', 'furn|fishbowl']);
  addTh('spring', ['wall|flowers', 'curtain|pink', 'furn|plant']);
  addTh('valentine', ['wall|stripes', 'furn|sofa:3']);
  B.GIFT_THEMES.push(['home', ['🏠 Cozy room', '🏠 Уютная комната', '🏠 Mājīga istaba'], ['furn|sofa:0', 'furn|sofa:1', 'furn|armchair', 'furn|knitting', 'furn|yarn', 'furn|lamp', 'furn|plant', 'furn|books', 'furn|mug', 'furn|teapot', 'furn|gramophone', 'furn|radio', 'deco|clock', 'deco|painting', 'wall|wood', 'floor|bluerug', 'curtain|lace']]);
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
      const pad = 4, k = Math.max(1, Math.floor(Math.min(64 / (d.w + pad * 2), 64 / (d.h + pad * 2)))) || 1;
      c.width = (d.w + pad * 2) * k; c.height = (d.h + pad * 2) * k; g.setTransform(k, 0, 0, k, 0, 0); g.imageSmoothingEnabled = false;
      d.d(P(g, pad, pad), 0, d.i, { has: () => false });
    }
    const box = document.createElement('span'); box.className = 'pp-icon pp-room-ic' + (ROOM_KINDS[kind] ? ' sq' : ''); box.style.setProperty('--ic', (size || 80) + 'px');
    const z = (size || 80) * .78; c.style.width = c.style.height = ''; if (c.width >= c.height) c.style.width = z + 'px'; else c.style.height = z + 'px';
    box.appendChild(c); return box;
  }
  const isRoom = k => ['wall', 'floor', 'view', 'curtain', 'furn', 'deco'].includes(k);
  const oldName = B.giftName, oldIcon = B.itemIcon, oldPic = B.giftPic;
  B.giftName = (k, v, l) => isRoom(k) ? nameOf(k, v) : oldName(k, v, l);
  B.itemIcon = (k, v, size, id) => isRoom(k) ? icon(k, v, size) : oldIcon(k, v, size, id);
  B.giftPic = (k, v, id, size, av) => { if (!isRoom(k)) return oldPic(k, v, id, size, av); const w = document.createElement('span'); w.className = 'gift-pic'; w.appendChild(icon(k, v, size)); return w; };
  B.isRoomKind = isRoom;

  // ---------- комната ----------
  const T = {
    edit: ['✏️ Decorate the room', '✏️ Обустроить комнату', '✏️ Iekārtot istabu'], done: ['✓ Done', '✓ Готово', '✓ Gatavs'],
    of: ['Room of @{n}', 'Комната @{n}', '@{n} istaba'], saved: ['Saved ✓', 'Сохранено ✓', 'Saglabāts ✓'], saving: ['Saving…', 'Сохраняю…', 'Saglabāju…'], err: ['Could not save', 'Не получилось сохранить', 'Neizdevās saglabāt'],
    hint: ['Tap a thing below to put it in the room. Drag things around; they can stand on each other. Tap a thing in the room to turn it or put it back in the bag.', 'Нажмите на вещь внизу — она появится в комнате. Вещи можно двигать и ставить друг на друга. Нажмите на вещь в комнате, чтобы повернуть или убрать в сумку.', 'Pieskaries lietai apakšā — tā parādīsies istabā. Lietas var vilkt un likt vienu uz otras. Pieskaries lietai istabā, lai pagrieztu vai noliktu atpakaļ somā.'],
    empty: ['No room things in your bag yet. Buy them in the shop, get them as gifts or in the advent calendar.', 'В сумке пока нет вещей для комнаты. Их можно купить в магазине, получить в подарок или в адвент-календаре.', 'Somā vēl nav lietu istabai. Tās var nopirkt veikalā, saņemt dāvanā vai adventes kalendārā.'],
    shop: ['🛍 Shop', '🛍 Магазин', '🛍 Veikals'], flip: ['⇆ Turn', '⇆ Повернуть', '⇆ Pagriezt'], back: ['↩ To the bag', '↩ В сумку', '↩ Uz somu'],
    def: ['default', 'как было', 'kā bija'],
    tabs: { furn: ['Furniture', 'Мебель', 'Mēbeles'], deco: ['Decorations', 'Украшения', 'Rotājumi'], wall: ['Walls', 'Стены', 'Sienas'], floor: ['Floor', 'Пол', 'Grīda'], view: ['Window', 'Окно', 'Logs'], curtain: ['Curtains', 'Шторы', 'Aizkari'] },
  };
  const t = k => T[k][L];
  const pre = ['', '/ru', '/lv'][L];

  function mount(box, o) {
    let room = Object.assign({ items: [] }, o.room || {}); room.items = (room.items || []).filter(it => defOf(it.k, it.v));
    let edit = false, sel = -1, saveT = 0;
    box.classList.add('room');
    box.innerHTML = `<div class="room-stage"><canvas class="room-cv" width="${RW}" height="${RH}" aria-label="${t('of').replace('{n}', o.nick)}" role="img"></canvas></div>
      <div class="room-bar"><span class="room-cap">🏠 ${t('of').replace('{n}', o.nick)}</span>${o.mine ? `<span class="room-st" aria-live="polite"></span><button type="button" class="pill-btn room-edit">${t('edit')}</button>` : ''}</div>
      <div class="room-sel" hidden><button type="button" class="pill-btn" data-flip>${t('flip')}</button><button type="button" class="pill-btn" data-back>${t('back')}</button></div>
      <div class="room-tray" hidden></div>`;
    const cv = box.querySelector('canvas'), stage = box.querySelector('.room-stage');
    const S = 4; cv.width = RW * S; cv.height = RH * S;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    const st = box.querySelector('.room-st'), tray = box.querySelector('.room-tray'), selBar = box.querySelector('.room-sel');
    // статичный фон (стены, пол, окно) — рисуется один раз
    let bg = null;
    const paintBg = () => {
      bg = document.createElement('canvas'); bg.width = RW; bg.height = RH; const b = bg.getContext('2d');
      (WALL[room.wall] || WALL._)[1](b); R(b, 0, FY - 3, RW, 3, '#6B4E3A'); R(b, 0, FY - 3, RW, 1, '#8C6A50');
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
        const d = defOf(it.k, it.v); if (!d) return;
        if (it.k === 'deco') { out.push({ it, d, idx, x: clampX(it.x, d.w), y: Math.max(0, Math.min(RH - d.h, it.y || 20)) }); return; }
        const x = clampX(it.x, d.w); let base = GY;
        out.filter(q => q.it.k === 'furn' && q.d.top != null).forEach(q => {
          const ov = Math.min(x + d.w, q.x + q.d.w) - Math.max(x, q.x);
          if (ov >= Math.min(d.w, q.d.w) * .5) base = Math.min(base, q.y + q.d.top);
        });
        out.push({ it, d, idx, x, y: base - d.h });
      });
      return out;
    }
    const clampX = (x, w) => Math.max(0, Math.min(RW - w, Math.round(x || 0)));
    // ---------- птичка ----------
    const lk = B.dress(B.looks(o.id), o.avatar || {});
    const FR = [0, 1, 2].map(f => B.sprite(lk, f));
    const bird = { x: 40, y: GY, dir: 1, st: 'idle', t0: 0, until: 0, from: null, to: null, frame: 0, zz: false };
    const surfaces = lay => { const s = [{ x0: 8, x1: RW - 8, y: GY }]; lay.forEach(q => { if (q.it.k === 'furn' && q.d.top != null && q.d.w >= 10) s.push({ x0: q.x + 4, x1: q.x + q.d.w - 4, y: q.y + q.d.top, q }); }); return s; };
    function think(now, lay) {
      if (now < bird.until) return;
      const sf = surfaces(lay), r = Math.random(), cur = sf.find(s => Math.abs(s.y - bird.y) < 1 && bird.x >= s.x0 - 2 && bird.x <= s.x1 + 2) || sf[0];
      bird.zz = false;
      const sofa = lay.find(q => q.d.sit), tv = has('tv') && has('console');
      if (sofa && r < .15) { const s = sf.find(z => z.q === sofa); if (s) return hop(now, s.x0 + Math.random() * (s.x1 - s.x0), s.y, () => { bird.st = 'sleep'; bird.zz = true; bird.until = performance.now() + 5000 + Math.random() * 4000; }); }
      if (tv && r < .3) { const q = lay.find(z => parse(z.it.v)[0] === 'tv'); return goFloor(now, Math.max(8, Math.min(RW - 8, q.x + q.d.w / 2 + 12)), () => { bird.dir = -1; bird.st = 'play'; bird.until = performance.now() + 4000; }); }
      if (r < .55) return walk(now, cur.x0 + Math.random() * (cur.x1 - cur.x0), cur.y);
      if (r < .85 && sf.length > 1) { const s = sf[Math.floor(Math.random() * sf.length)]; return hop(now, s.x0 + Math.random() * (s.x1 - s.x0), s.y); }
      bird.st = 'peck'; bird.until = now + 1200;
    }
    const walk = (now, x, y) => { bird.st = 'walk'; bird.from = { x: bird.x, y: bird.y, t: now }; bird.to = { x, y }; bird.dir = x > bird.x ? 1 : -1; bird.until = now + Math.abs(x - bird.x) / .03; };
    const hop = (now, x, y, then) => { bird.st = 'hop'; bird.from = { x: bird.x, y: bird.y, t: now }; bird.to = { x, y, then }; bird.dir = x > bird.x ? 1 : -1; bird.until = now + 650; };
    const goFloor = (now, x, then) => { if (Math.abs(bird.y - GY) > 1) return hop(now, x, GY, then); walk(now, x, GY); bird.to.then = then; };
    function stepBird(now) {
      if (bird.st === 'walk' || bird.st === 'hop') {
        const k = Math.min(1, (now - bird.from.t) / Math.max(1, bird.until - bird.from.t));
        bird.x = bird.from.x + (bird.to.x - bird.from.x) * k; bird.y = bird.from.y + (bird.to.y - bird.from.y) * k - (bird.st === 'hop' ? Math.sin(Math.PI * k) * 14 : 0);
        bird.frame = bird.st === 'walk' ? Math.floor(now / 160) % 2 : 0;
        if (k >= 1) { bird.x = bird.to.x; bird.y = bird.to.y; const th2 = bird.to.then; bird.st = 'idle'; bird.until = now + 600 + Math.random() * 1500; if (th2) th2(); }
      } else if (bird.st === 'peck' || bird.st === 'play') bird.frame = Math.floor(now / 250) % 2 ? 2 : 0;
      else bird.frame = 0;
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
      raf = requestAnimationFrame(frame);
      if (!box.isConnected) { cancelAnimationFrame(raf); return; }
      const lay = layout();
      g.setTransform(S, 0, 0, S, 0, 0); g.imageSmoothingEnabled = false;
      g.drawImage(bg, 0, 0);
      g.save(); g.beginPath(); g.rect(WX, WY, WW, WH); g.clip(); (VIEW[room.view] || VIEW._)[1](g, WX, WY, now); g.restore();
      R(g, WX + WW / 2 - 1, WY, 2, WH, '#EFE7DA'); R(g, WX, WY + WH / 2 - 1, WW, 2, '#EFE7DA');
      drawCurtains(g, room.curtain);
      const ctx = { has };
      lay.forEach(q => {
        if (q.d.glow) { g.fillStyle = 'rgba(255,214,120,.13)'; g.beginPath(); g.arc(q.x + q.d.glow[0], q.y + q.d.glow[1], 26, 0, Math.PI * 2); g.fill(); }
        if (q.it.f) { g.save(); g.translate((q.x * 2 + q.d.w), 0); g.scale(-1, 1); q.d.d(P(g, q.x, q.y), now, q.d.i, ctx); g.restore(); }
        else q.d.d(P(g, q.x, q.y), now, q.d.i, ctx);
        if (edit && q.idx === sel) { g.strokeStyle = '#F0A987'; g.lineWidth = .6; g.setLineDash([1.5, 1]); g.strokeRect(q.x - 1.5, q.y - 1.5, q.d.w + 3, q.d.h + 3); g.setLineDash([]); }
      });
      if (!edit) { think(now, lay); stepBird(now); }
      drawBird(now);
    }
    // ---------- хозяин: обустройство ----------
    const owned = () => { const m = {}; ((o.me && o.me.gifts) || []).forEach(x => { if (x.status === 'bag' && isRoom(x.kind)) m[x.kind + '|' + x.item] = (m[x.kind + '|' + x.item] || 0) + 1; }); return m; };
    const placed = key => room.items.filter(it => it.k + '|' + it.v === key).length;
    function save() {
      clearTimeout(saveT); if (st) st.textContent = t('saving');
      saveT = setTimeout(() => fetch('/api/room', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ room }) })
        .then(r => { if (!r.ok) throw 0; if (st) st.textContent = t('saved'); }).catch(() => { if (st) st.textContent = t('err'); }), 500);
    }
    let tab = 'furn';
    function drawTray() {
      const own = owned(), keys = Object.keys(own);
      if (!keys.length) { tray.innerHTML = `<p class="room-hint">${t('empty')}</p><a class="pill-btn" href="${pre}/shop/">${t('shop')}</a>`; return; }
      const kinds = ['furn', 'deco', 'wall', 'floor', 'view', 'curtain'].filter(k => keys.some(x => x.startsWith(k + '|')));
      if (!kinds.includes(tab)) tab = kinds[0];
      tray.innerHTML = `<p class="room-hint">${t('hint')}</p><div class="room-tabs">${kinds.map(k => `<button type="button" data-k="${k}" aria-pressed="${k === tab}">${T.tabs[k][L]}</button>`).join('')}</div><div class="room-items"></div>`;
      const list = tray.querySelector('.room-items');
      if (ROOM_KINDS[tab]) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'room-it' + (!room[tab] ? ' on' : ''); b.textContent = t('def'); b.onclick = () => { delete room[tab]; paintBg(); save(); drawTray(); }; list.appendChild(b);
      }
      keys.filter(x => x.startsWith(tab + '|')).forEach(key => {
        const v = key.slice(tab.length + 1), b = document.createElement('button'); b.type = 'button'; b.className = 'room-it'; b.title = nameOf(tab, v);
        b.appendChild(icon(tab, v, 58));
        if (ROOM_KINDS[tab]) { b.classList.toggle('on', room[tab] === v); b.onclick = () => { room[tab] = v; paintBg(); save(); drawTray(); }; }
        else {
          const left = own[key] - placed(key); const n = document.createElement('em'); n.textContent = '×' + left; b.appendChild(n); b.disabled = left <= 0;
          b.onclick = () => { if (own[key] - placed(key) <= 0) return; const d = defOf(tab, v); room.items.push(tab === 'deco' ? { k: tab, v, x: Math.round(RW / 2 - d.w / 2 - 20), y: 24 } : { k: tab, v, x: Math.round(RW / 2 - d.w / 2 - 20) }); sel = room.items.length - 1; selBar.hidden = false; save(); drawTray(); };
        }
        list.appendChild(b);
      });
      tray.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { tab = b.dataset.k; drawTray(); });
    }
    if (o.mine) {
      box.querySelector('.room-edit').onclick = e => { edit = !edit; e.target.textContent = edit ? t('done') : t('edit'); tray.hidden = !edit; box.classList.toggle('editing', edit); sel = -1; selBar.hidden = true; if (edit) drawTray(); };
      selBar.querySelector('[data-flip]').onclick = () => { const it = room.items[sel]; if (it) { it.f = it.f ? 0 : 1; save(); } };
      selBar.querySelector('[data-back]').onclick = () => { if (sel < 0) return; room.items.splice(sel, 1); sel = -1; selBar.hidden = true; save(); drawTray(); };
      const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * RW, (e.clientY - r.top) / r.height * RH]; };
      let drag = null;
      cv.addEventListener('pointerdown', e => {
        if (!edit) return;
        const [px, py] = pt(e), lay = layout();
        const hit = [...lay].sort((a, b) => (a.it.k === 'deco') - (b.it.k === 'deco') || a.idx - b.idx).reverse().find(q => px >= q.x && px <= q.x + q.d.w && py >= q.y && py <= q.y + q.d.h);
        if (!hit) { sel = -1; selBar.hidden = true; return; }
        // взятая вещь — в конец списка: при отпускании встаёт поверх того, что под ней
        const it = room.items.splice(hit.idx, 1)[0]; room.items.push(it); sel = room.items.length - 1; selBar.hidden = false;
        drag = { dx: px - hit.x, dy: py - hit.y, moved: false }; cv.setPointerCapture(e.pointerId); e.preventDefault();
      });
      cv.addEventListener('pointermove', e => {
        if (!drag || sel < 0) return;
        const [px, py] = pt(e), it = room.items[sel]; drag.moved = true;
        it.x = Math.round(px - drag.dx); if (it.k === 'deco') it.y = Math.round(py - drag.dy);
      });
      const up = () => { if (drag && drag.moved) save(); drag = null; };
      cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    }
    paintBg();
    raf = requestAnimationFrame(frame);
  }
  window.PPRoom = { mount, icon, nameOf, isRoom, RW, RH };
})();
