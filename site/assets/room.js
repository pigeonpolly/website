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
        for (let i = 0; i < w; i++) R(g, x0 + i, top + k, 1, 1, c[3] ? c[3][Math.floor((x0 + i) / 2) % c[3].length] : i % 3 === 1 ? b : a);
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
    ornament: { n: i => [['Tree ball (red)', 'Ёлочный шарик (красный)', 'Eglītes bumbiņa (sarkana)'], ['Tree ball (gold)', 'Ёлочный шарик (золотой)', 'Eglītes bumbiņa (zelta)'], ['Tree ball (blue)', 'Ёлочный шарик (синий)', 'Eglītes bumbiņa (zila)'], ['Tree ball (silver)', 'Ёлочный шарик (серебряный)', 'Eglītes bumbiņa (sudraba)'], ['Tree ball (pink)', 'Ёлочный шарик (розовый)', 'Eglītes bumbiņa (rozā)'], ['Tree ball (green)', 'Ёлочный шарик (зелёный)', 'Eglītes bumbiņa (zaļa)']][i], v: 6, w: 5, h: 7,
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
  const LEG = ['furn|throne', 'view|aurora', 'wall|gold', 'floor|marble', 'furn|dragon', 'furn|portal', 'furn|treasure', 'furn|phoenixnest', 'furn|pollystatue', 'deco|rainbowarc', 'deco|constellation', 'wall|stainedglass', 'floor|clouds', 'floor|goldtiles', 'view|dragonsky', 'curtain|starlight']; // то же в worker/index.js LEGEND
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
  B.GIFT_THEMES.push(['tree', ['🎄 Tree decorations', '🎄 Украшения для ёлки', '🎄 Eglītes rotājumi'], ['deco|ornament:0', 'deco|ornament:1', 'deco|ornament:2', 'deco|ornament:3', 'deco|ornament:4', 'deco|ornament:5', 'deco|xmasstar', 'deco|staromini', 'deco|lights', 'deco|tinsel', 'deco|beads', 'deco|icicle', 'deco|pinecone', 'deco|angel', 'deco|gingerorn', 'deco|birdorn', 'deco|candyorn', 'deco|snowmanorn', 'deco|bell', 'deco|candycane', 'furn|xmastree']]);
  addTh('newyear', ['deco|staromini', 'deco|beads', 'deco|icicle', 'deco|pinecone', 'deco|angel', 'deco|gingerorn', 'deco|birdorn', 'deco|candyorn', 'deco|snowmanorn']);
  B.GIFT_THEMES.push(['fun', ['😂 Funny', '😂 Забавное', '😂 Jautri'], ['furn|giantpizza', 'furn|rubberduck', 'furn|toaster', 'furn|lavalamp', 'furn|cattower', 'furn|bathtub', 'furn|mrchew', 'furn|coatstand', 'furn|wormchips', 'furn|flytrap', 'furn|robovac', 'furn|socks', 'furn|tamagotchi', 'furn|giantcoffee', 'furn|nestbed', 'deco|cuckoo', 'deco|moosehead', 'deco|crookedart', 'deco|ufo', 'deco|balloons', 'deco|wormposter']]);
  addTh('magic', ['furn|portal', 'furn|dragon', 'deco|constellation', 'curtain|starlight']);
  addTh('pirate', ['furn|treasure']);
  B.GIFT_THEMES.push(['music', ['🎵 Music', '🎵 Музыка', '🎵 Mūzika'], ['furn|guitar', 'furn|piano', 'furn|drum', 'furn|speaker', 'furn|recordplayer', 'furn|gramophone', 'furn|radio', 'deco|discoball']]);
  B.GIFT_THEMES.push(['space', ['🚀 Space', '🚀 Космос', '🚀 Kosmoss'], ['furn|telescope', 'furn|rocket', 'furn|moonlamp', 'furn|helmet', 'view|space', 'view|aurora', 'wall|planets', 'wall|stars']]);
  B.GIFT_THEMES.push(['polly', ['🐦 Pigeon Polly', '🐦 Pigeon Polly', '🐦 Pigeon Polly'], ['furn|pollyplush', 'furn|seedbag', 'furn|fountain', 'furn|birdhouse', 'deco|poster', 'deco|painting', 'wall|pigeons', 'view|riga']]);
  B.GIFT_THEMES.push(['home', ['🏠 Cozy room', '🏠 Уютная комната', '🏠 Mājīga istaba'], [...[0, 1, 2, 3, 4, 5].map(i => 'furn|rug:' + i), ...[0, 1, 2, 3, 4, 5].map(i => 'furn|cushion:' + i), ...[0, 1, 2, 3, 4].map(i => 'deco|picture:' + i), 'furn|teddy', 'furn|bunny', 'furn|whale', 'furn|fern', 'furn|snakeplant', 'furn|succulents', 'furn|orchid', 'furn|bed', 'furn|nightstand', 'furn|cat', 'furn|catbed', 'furn|grandclock', 'furn|pouf', 'deco|mirror', 'wall|rainbow', 'floor|rainbowrug', 'floor|parquet', 'curtain|rainbow', 'curtain|golden', 'furn|sofa:0', 'furn|sofa:1', 'furn|armchair', 'furn|knitting', 'furn|yarn', 'furn|lamp', 'furn|plant', 'furn|books', 'furn|mug', 'furn|teapot', 'furn|gramophone', 'furn|radio', 'deco|clock', 'deco|painting', 'wall|wood', 'floor|bluerug', 'curtain|lace']]);
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
      const pad = 4, k = Math.max(1, Math.floor(Math.min(64 / (d.w + pad * 2), 64 / (d.h + pad * 2)))) || 1;
      c.width = (d.w + pad * 2) * k; c.height = (d.h + pad * 2) * k; g.setTransform(k, 0, 0, k, 0, 0); g.imageSmoothingEnabled = false;
      d.d(P(g, pad, pad), 0, d.i, { has: () => false });
    }
    const box = document.createElement('span'); box.className = 'pp-icon pp-room-ic' + (ROOM_KINDS[kind] ? ' sq' : ''); box.style.setProperty('--ic', (size || 80) + 'px');
    const z = (size || 80) * .78; c.style.width = c.style.height = ''; if (c.width >= c.height) c.style.width = z + 'px'; else c.style.height = z + 'px';
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
    edit: ['✏️ Decorate the room', '✏️ Обустроить комнату', '✏️ Iekārtot istabu'], done: ['✓ Done', '✓ Готово', '✓ Gatavs'],
    of: ['Room of @{n}', 'Комната @{n}', '@{n} istaba'], saved: ['Saved ✓', 'Сохранено ✓', 'Saglabāts ✓'], saving: ['Saving…', 'Сохраняю…', 'Saglabāju…'], err: ['Could not save', 'Не получилось сохранить', 'Neizdevās saglabāt'],
    hint: ['Tap a thing below to put it in the room. Drag things anywhere: on the floor, on the wall, on top of each other. Near a shelf or table top a thing snaps onto it. Tap a thing to turn it, move it forward or back, or put it back in the bag. Arrow keys nudge it by a pixel.', 'Нажмите на вещь внизу — она появится в комнате. Вещи можно таскать куда угодно: по полу, на стену, друг на друга; у столешницы или полки вещь сама на неё встаёт. Нажмите на вещь, чтобы повернуть, переложить вперёд или назад или убрать в сумку. Стрелки на клавиатуре двигают её на пиксель.', 'Pieskaries lietai apakšā — tā parādīsies istabā. Lietas var vilkt jebkur: pa grīdu, uz sienas, vienu uz otras; pie galda vai plaukta virsmas lieta pati uz tās nostājas. Pieskaries lietai, lai pagrieztu, pārliktu uz priekšu vai atpakaļ vai noliktu somā. Bultiņas to pabīda par pikseli.'],
    empty: ['No room things in your bag yet. Buy them in the shop, get them as gifts or in the advent calendar.', 'В сумке пока нет вещей для комнаты. Их можно купить в магазине, получить в подарок или в адвент-календаре.', 'Somā vēl nav lietu istabai. Tās var nopirkt veikalā, saņemt dāvanā vai adventes kalendārā.'],
    shop: ['🛍 Shop', '🛍 Магазин', '🛍 Veikals'], flip: ['⇆ Turn', '⇆ Повернуть', '⇆ Pagriezt'], front: ['⬆ Forward', '⬆ Вперёд', '⬆ Uz priekšu'], behind: ['⬇ Back', '⬇ Назад', '⬇ Atpakaļ'], top: ['⏫ On top', '⏫ Поверх всего', '⏫ Virs visa'], back: ['↩ To the bag', '↩ В сумку', '↩ Uz somu'],
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
      <div class="room-sel" hidden><button type="button" class="pill-btn" data-flip>${t('flip')}</button><button type="button" class="pill-btn" data-z="1">${t('front')}</button><button type="button" class="pill-btn" data-z="-1">${t('behind')}</button><button type="button" class="pill-btn" data-z="top">${t('top')}</button><button type="button" class="pill-btn" data-back>${t('back')}</button></div>
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
        const x = clampX(it.x, d.w);
        if (it.y != null) { out.push({ it, d, idx, x, y: Math.max(-d.h + 4, Math.min(RH - 2, Math.round(it.y))) }); return; } // поставлена руками — где угодно
        let base = GY;
        out.filter(q => q.it.k === 'furn' && q.d.top != null).forEach(q => {
          const ov = Math.min(x + d.w, q.x + q.d.w) - Math.max(x, q.x);
          if (ov >= Math.min(d.w, q.d.w) * .5) base = Math.min(base, q.y + q.d.top);
        });
        out.push({ it, d, idx, x, y: base - d.h });
      });
      return out;
    }
    const clampX = (x, w) => Math.max(0, Math.min(RW - w, Math.round(x || 0)));
    // ---------- что птичка делает с вещами: подходит (или запрыгивает) и делает своё, над ней — частицы ----------
    const ACTS = {
      sleep: ['sofa', 'armchair', 'beanbag', 'throne', 'bed', 'pouf', 'nestbed', 'beachchair', 'gamingchair', 'catbed', 'giantpizza', 'flamingo'],
      play: ['tv', 'console', 'computer', 'arcade', 'handheld', 'tamagotchi'],
      music: ['piano', 'guitar', 'drum', 'speaker', 'recordplayer', 'gramophone', 'radio'],
      read: ['books', 'bookshelf', 'spellbook', 'desk'],
      eat: ['mug', 'teapot', 'cake', 'cookies', 'donuts', 'watermelon', 'pizzabox', 'breadbasket', 'applebasket', 'lemonade', 'wormchips', 'seedbag', 'candybowl', 'giantcoffee', 'gingerhouse', 'coffeemachine', 'stove', 'fridge', 'toaster'],
      splash: ['fishbowl', 'bathtub', 'fountain', 'wateringcan', 'rubberduck'],
      paint: ['easel', 'painttubes', 'brushjar', 'claypot'],
      warm: ['fireplace', 'candle', 'skullcandle', 'phoenixnest', 'jacklantern'],
      gaze: ['telescope', 'globe', 'orb', 'portal', 'snowglobe', 'lavalamp', 'moonlamp', 'lamp', 'treasure', 'chest', 'pollystatue', 'bust', 'cauldron', 'potionshelf', 'shipbottle', 'rocket', 'grandclock', 'tombstone', 'snowman'],
      pet: ['cat', 'blackcat', 'pollyplush', 'mrchew', 'dragon', 'flytrap', 'cattower', 'robovac'],
      unwrap: ['present', 'xmastree'],
      knit: ['knitting', 'yarn', 'socks'],
    };
    const ACT_OF = {}; Object.entries(ACTS).forEach(([a, ks]) => ks.forEach(k => { ACT_OF[k] = a; }));
    const PART = { // пиксельные частицы над птичкой
      note: [['.xx', '.x.', 'xx.'], ['#F6D04D', '#F28AB2', '#7FB3E8']], heart: [['x.x', 'xxx', '.x.'], ['#E5484D', '#F28AB2']], star: [['.x.', 'xxx', '.x.'], ['#F6D04D', '#FFFFFF']],
      crumb: [['x'], ['#D9A45B', '#8B5A3C', '#F4EBDD']], drop: [['x', 'x'], ['#7FB3E8', '#BFE3F5']], paint: [['xx', 'xx'], ['#E5484D', '#4A7BD8', '#F6D04D', '#4CC38A', '#B79CF2']],
      spark: [['x'], ['#F6D04D', '#FFE08A', '#F08A3B']], yarn: [['xx', 'xx'], ['#F28AB2', '#7FB3E8']], paper: [['xx', 'x.'], ['#E5484D', '#4A7BD8', '#F6D04D', '#4CC38A']],
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
    const FR = [0, 1, 2].map(f => B.sprite(lk, f));
    const bird = { x: 40, y: GY, dir: 1, st: 'idle', t0: 0, until: 0, from: null, to: null, frame: 0, zz: false };
    const surfaces = lay => { const s = [{ x0: 8, x1: RW - 8, y: GY }]; lay.forEach(q => { if (q.it.k === 'furn' && q.d.top != null && q.d.w >= 10) s.push({ x0: q.x + 4, x1: q.x + q.d.w - 4, y: q.y + q.d.top, q }); }); return s; };
    function think(now, lay) {
      if (now < bird.until) return;
      const sf = surfaces(lay), r = Math.random(), cur = sf.find(s => Math.abs(s.y - bird.y) < 1 && bird.x >= s.x0 - 2 && bird.x <= s.x1 + 2) || sf[0];
      bird.zz = false; bird.act = null;
      if (!sf.some(z => Math.abs(z.y - bird.y) < 2)) return hop(now, Math.max(8, Math.min(RW - 8, bird.x)), GY); // была в воздухе у украшения — вниз
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
    const walk = (now, x, y) => { bird.st = 'walk'; bird.from = { x: bird.x, y: bird.y, t: now }; bird.to = { x, y }; bird.dir = x > bird.x ? 1 : -1; bird.until = now + Math.abs(x - bird.x) / .03; };
    const hop = (now, x, y, then) => { bird.st = 'hop'; bird.from = { x: bird.x, y: bird.y, t: now }; bird.to = { x, y, then }; bird.dir = x > bird.x ? 1 : -1; bird.until = now + 650; };
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
      drawParts(now);
    }
    // ---------- хозяин: обустройство ----------
    const owned = () => { const m = {}; ((o.me && o.me.gifts) || []).forEach(x => { if (x.status === 'bag' && isRoom(x.kind)) m[x.kind + '|' + x.item] = (m[x.kind + '|' + x.item] || 0) + 1; }); return m; };
    const placed = key => room.items.filter(it => it.k + '|' + it.v === key).length;
    // мебель, отпущенная рядом с полом или верхом другой вещи (±5px), встаёт на них; иначе висит, где оставили
    let snapOn = -1; // на какую вещь встала перетаскиваемая (чтобы при отпускании оказаться поверх неё)
    function snapY(it, idx) {
      const d = defOf(it.k, it.v), x = clampX(it.x, d.w), bot = it.y + d.h;
      let best = Math.abs(bot - GY) <= 5 ? GY : null; snapOn = -1;
      layout().forEach(q => {
        if (q.idx === idx || q.d.top == null || q.it.k !== 'furn') return;
        const ov = Math.min(x + d.w, q.x + q.d.w) - Math.max(x, q.x), top = q.y + q.d.top;
        if (ov >= Math.min(d.w, q.d.w) * .4 && Math.abs(bot - top) <= 5 && (best == null || Math.abs(bot - top) < Math.abs(bot - best))) { best = top; snapOn = q.idx; }
      });
      return best == null ? it.y : best - d.h;
    }
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
        // берём самую верхнюю вещь под пальцем (рисуются по порядку списка: последняя — сверху)
        const hit = [...lay].reverse().find(q => px >= q.x && px <= q.x + q.d.w && py >= q.y && py <= q.y + q.d.h);
        if (!hit) { sel = -1; selBar.hidden = true; return; }
        sel = hit.idx; selBar.hidden = false; box.focus({ preventScroll: true });
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
        const [px, py] = pt(e), it = room.items[sel]; drag.moved = true;
        it.x = Math.round(px - drag.dx); it.y = Math.round(py - drag.dy);
        if (it.k === 'furn') it.y = snapY(it, sel);
        drag.riders.forEach(r => { r.q.it.x = it.x + r.dx; r.q.it.y = it.y + r.dy; });
      });
      const up = () => {
        if (drag && drag.moved) {
          // встала на вещь, которая рисуется позже, — переложить сразу за ней, иначе окажется за столешницей
          if (snapOn > sel && room.items[sel] && room.items[sel].k === 'furn') {
            const target = room.items[snapOn], block = [sel, ...drag.riders.map(r => r.q.idx)].sort((x, y) => x - y).map(i => room.items[i]);
            room.items = room.items.filter(x => !block.includes(x)); const at = room.items.indexOf(target) + 1;
            room.items.splice(at, 0, ...block); sel = room.items.indexOf(drag.it);
          }
          save();
        }
        drag = null; snapOn = -1;
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
        if (e.key === 'Delete' || e.key === 'Backspace') { selBar.querySelector('[data-back]').click(); e.preventDefault(); return; }
        if (!dx && !dy) return; e.preventDefault();
        const q = layout().find(z => z.idx === sel); it.x = (q ? q.x : it.x) + dx; it.y = (q ? q.y : it.y || 0) + dy; save();
      });
      cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    }
    paintBg();
    raf = requestAnimationFrame(frame);
  }
  window.PPRoom = { mount, icon, nameOf, isRoom, RW, RH };
})();
