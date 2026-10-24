// Вещи для огорода (этап 23, docs/bird.md «Огород»): вид подарка garden — в магазине, сумке, адвенте, кабинете, как вещи комнаты.
// Купленная вещь сама стоит в огороде на своём месте (row: back — вдоль забора, side — под домиком); хозяин может спрятать её в огороде («🪴 Вещи огорода»).
// PPGardenItems.draw(g, v, x, y, t, o) — рисует вещь в пикселях сцены огорода (192×120, x/y — левый верх), o = { night }; layout(list) — где какая стоит.
// Новая вещь = строка в ITEMS (n — название, w×h, row, p — ценность для tools/catalog.js, d — рисунок); легендарная — ещё в LEG и в site/assets/can-do.js LEGEND.
(() => {
  const B = window.PPBirds;
  if (!B) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const tw = (t, ms, n) => Math.floor(t / ms) % n; // кадр анимации
  const ITEMS = {
    wcan: { n: ['Watering can', 'Лейка', 'Lejkanna'], w: 11, h: 8, row: 'side', p: 20, d(g, x, y) {
      R(g, x + 2, y + 2, 6, 6, '#4F9A6A'); R(g, x + 3, y + 3, 4, 1, '#6FBF8A'); R(g, x + 3, y, 4, 1, '#3E7A54'); R(g, x + 2, y + 1, 1, 1, '#3E7A54'); R(g, x + 7, y + 1, 1, 1, '#3E7A54');
      R(g, x + 8, y + 4, 1, 1, '#4F9A6A'); R(g, x + 9, y + 3, 1, 1, '#4F9A6A'); R(g, x + 10, y + 2, 1, 2, '#3E7A54'); } },
    scarecrow: { n: ['Scarecrow', 'Пугало', 'Putnubiedēklis'], w: 14, h: 24, row: 'back', p: 45, d(g, x, y, t) {
      R(g, x + 6, y + 6, 2, 18, '#7A5634'); R(g, x, y + 10, 14, 2, '#7A5634');
      R(g, x + 2, y + 9, 10, 8, '#D2502A'); R(g, x + 2, y + 11, 10, 1, '#F2A93B'); R(g, x + 2, y + 14, 10, 1, '#F2A93B'); R(g, x + 6, y + 9, 1, 8, '#9C3A1E');
      R(g, x, y + 12, 1, 2, '#F2D06A'); R(g, x + 13, y + 12, 1, 2, '#F2D06A'); R(g, x + 4, y + 17, 2, 2, '#F2D06A'); R(g, x + 8, y + 17, 2, 2, '#F2D06A');
      R(g, x + 4, y + 3, 6, 6, '#F2D9A0'); R(g, x + 5, y + 5, 1, 1, '#2B1A51'); R(g, x + 8, y + 5, 1, 1, '#2B1A51'); R(g, x + 5, y + 7, 4, 1, '#B5652A');
      R(g, x + 1, y + 2, 12, 2, '#E8C25A'); R(g, x + 4, y, 6, 2, '#E8C25A'); R(g, x + 4, y + 1, 6, 1, '#C8483A');
      if (tw(t, 2400, 3) === 0) { R(g, x + 11, y + 7, 3, 2, '#2B1A51'); R(g, x + 13, y + 7, 1, 1, '#F2A93B'); } } }, // иногда на руку садится ворона
    greenhouse: { n: ['Greenhouse', 'Теплица', 'Siltumnīca'], w: 26, h: 18, row: 'back', p: 75, d(g, x, y) {
      R(g, x + 1, y + 6, 24, 12, 'rgba(191,230,246,.75)'); for (let i = 0; i < 6; i++) R(g, x + 4 * i + 2, y + 5 - (i < 3 ? i : 5 - i) * 2 + 2, 5, 2, 'rgba(191,230,246,.8)');
      R(g, x + 1, y + 6, 24, 1, '#F4F8FC'); R(g, x + 1, y + 17, 24, 1, '#F4F8FC'); for (let i = 0; i < 5; i++) R(g, x + 1 + i * 6, y + 6, 1, 12, '#F4F8FC');
      R(g, x + 12, y, 2, 1, '#F4F8FC'); R(g, x + 6, y + 3, 14, 1, 'rgba(244,248,252,.8)');
      for (let i = 0; i < 7; i++) { R(g, x + 3 + i * 3, y + 14 - i % 2, 2, 3 + i % 2, '#5FAE48'); if (i % 3 === 1) R(g, x + 3 + i * 3, y + 13, 1, 1, '#E03A3A'); } } },
    barrow: { n: ['Wheelbarrow', 'Тачка', 'Ķerra'], w: 15, h: 10, row: 'side', p: 35, d(g, x, y) {
      R(g, x, y + 4, 4, 1, '#7A5634'); R(g, x + 2, y + 2, 11, 2, '#C8483A'); R(g, x + 3, y + 4, 9, 2, '#C8483A'); R(g, x + 4, y + 6, 7, 1, '#9C3A2E');
      R(g, x + 4, y, 3, 2, '#E8771C'); R(g, x + 8, y + 1, 3, 1, '#7CC24A'); R(g, x + 6, y + 7, 1, 3, '#5A3E26'); R(g, x + 11, y + 7, 3, 3, '#2B2B33'); R(g, x + 12, y + 8, 1, 1, '#9A8F86'); } },
    gnome: { n: ['Garden gnome', 'Садовый гном', 'Dārza rūķis'], w: 7, h: 13, row: 'side', p: 30, d(g, x, y) {
      R(g, x + 3, y, 1, 1, '#D2302A'); R(g, x + 2, y + 1, 3, 2, '#D2302A'); R(g, x + 1, y + 3, 5, 1, '#D2302A'); R(g, x + 2, y + 4, 3, 2, '#F2C9A0'); R(g, x + 3, y + 5, 1, 1, '#E88A7A');
      R(g, x + 1, y + 6, 5, 3, '#FFFFFF'); R(g, x + 2, y + 9, 1, 1, '#FFFFFF'); R(g, x, y + 7, 1, 3, '#3F6FC9'); R(g, x + 6, y + 7, 1, 3, '#3F6FC9'); R(g, x + 1, y + 9, 5, 2, '#3F6FC9');
      R(g, x + 1, y + 11, 2, 2, '#5A3E26'); R(g, x + 4, y + 11, 2, 2, '#5A3E26'); } },
    birdbath: { n: ['Bird bath', 'Поилка для птиц', 'Putnu dzirdne'], w: 13, h: 12, row: 'back', p: 40, d(g, x, y, t) {
      R(g, x, y + 2, 13, 2, '#B8B0A8'); R(g, x + 1, y + 4, 11, 1, '#9A8F86'); R(g, x + 1, y + 1, 11, 1, '#6FB8E8'); R(g, x + 2 + tw(t, 500, 8), y + 1, 1, 1, '#E8F6FF');
      R(g, x + 5, y + 5, 3, 5, '#B8B0A8'); R(g, x + 3, y + 10, 7, 2, '#9A8F86'); } },
    beehive: { n: ['Beehive', 'Улей', 'Bišu strops'], w: 11, h: 13, row: 'back', p: 45, d(g, x, y, t) {
      R(g, x + 1, y + 2, 9, 1, '#C9A050'); R(g, x + 1, y + 3, 9, 3, '#F2C14E'); R(g, x + 1, y + 6, 9, 3, '#E8B23A'); R(g, x, y + 1, 11, 1, '#9C7650');
      R(g, x + 4, y + 7, 3, 1, '#5A3E26'); R(g, x + 2, y + 9, 1, 4, '#7A5634'); R(g, x + 8, y + 9, 1, 4, '#7A5634');
      for (let i = 0; i < 3; i++) { const a = t / 300 + i * 2.1; R(g, x + 5 + Math.round(Math.cos(a) * 5), y + 4 + Math.round(Math.sin(a * 1.3) * 4), 1, 1, i % 2 ? '#2B1A51' : '#F7D774'); } } },
    lamp: { n: ['Garden lamp', 'Садовый фонарь', 'Dārza lukturis'], w: 7, h: 18, row: 'back', p: 30, d(g, x, y, t, o) {
      if (o && o.night) { g.globalAlpha = .25; R(g, x - 3, y - 1, 13, 10, '#F7D774'); g.globalAlpha = 1; }
      R(g, x + 3, y + 7, 1, 10, '#3A3A44'); R(g, x + 1, y + 17, 5, 1, '#3A3A44'); R(g, x + 2, y + 1, 3, 1, '#3A3A44'); R(g, x + 1, y + 2, 5, 4, '#3A3A44'); R(g, x + 2, y + 3, 3, 2, o && o.night ? '#FFE27A' : '#F2E2B0'); R(g, x + 1, y + 6, 5, 1, '#3A3A44'); } },
    sign: { n: ['“Garden” sign', 'Табличка «Огород»', 'Zīme «Dārzs»'], w: 14, h: 13, row: 'back', p: 20, d(g, x, y) {
      R(g, x + 6, y + 7, 2, 6, '#7A5634'); R(g, x, y, 14, 7, '#D9B98E'); R(g, x, y + 6, 14, 1, '#9C7650'); R(g, x + 3, y + 2, 3, 2, '#F08A24'); R(g, x + 4, y + 4, 1, 1, '#F08A24'); R(g, x + 4, y + 1, 1, 1, '#5FAE48');
      R(g, x + 7, y + 2, 5, 1, '#7A5634'); R(g, x + 7, y + 4, 4, 1, '#7A5634'); } },
    bench: { n: ['Garden bench', 'Садовая скамейка', 'Dārza sols'], w: 20, h: 10, row: 'back', p: 40, d(g, x, y) {
      R(g, x + 1, y, 18, 2, '#A0673C'); R(g, x + 1, y + 3, 18, 1, '#A0673C'); R(g, x, y + 5, 20, 2, '#B5784A'); R(g, x, y + 7, 20, 1, '#8A5634');
      R(g, x + 2, y + 2, 1, 8, '#3A3A44'); R(g, x + 17, y + 2, 1, 8, '#3A3A44'); } },
    pinwheel: { n: ['Pinwheel', 'Вертушка', 'Vējdzirnaviņas'], w: 9, h: 15, row: 'side', p: 20, d(g, x, y, t) {
      R(g, x + 4, y + 4, 1, 11, '#7A5634'); const f = tw(t, 180, 2), C = ['#E5484D', '#F6C531', '#4A7BD8', '#4CC38A'];
      if (f) { R(g, x + 4, y, 1, 4, C[0]); R(g, x + 5, y + 4, 4, 1, C[1]); R(g, x + 4, y + 5, 1, 4, C[2]); R(g, x, y + 4, 4, 1, C[3]); }
      else { R(g, x + 1, y + 1, 3, 3, C[0]); R(g, x + 5, y + 1, 3, 3, C[1]); R(g, x + 5, y + 5, 3, 3, C[2]); R(g, x + 1, y + 5, 3, 3, C[3]); }
      R(g, x + 4, y + 4, 1, 1, '#FFFFFF'); } },
    flamingo: { n: ['Lawn flamingo', 'Фламинго для газона', 'Zāliena flamingo'], w: 9, h: 15, row: 'side', p: 25, d(g, x, y) {
      R(g, x + 6, y, 2, 2, '#F29BBA'); R(g, x + 8, y + 1, 1, 1, '#2B2B33'); R(g, x + 6, y + 2, 1, 4, '#F29BBA'); R(g, x + 1, y + 5, 7, 3, '#F29BBA'); R(g, x, y + 5, 2, 1, '#E27AA0'); R(g, x + 2, y + 6, 4, 1, '#E27AA0');
      R(g, x + 4, y + 8, 1, 7, '#E27AA0'); R(g, x + 5, y + 11, 2, 1, '#E27AA0'); } },
    pond: { n: ['Little pond', 'Прудик', 'Dīķītis'], w: 24, h: 8, row: 'side', p: 60, d(g, x, y, t) {
      R(g, x + 3, y + 1, 18, 7, '#9A8F86'); R(g, x + 1, y + 3, 22, 3, '#9A8F86'); R(g, x + 4, y + 2, 16, 5, '#4E9AD0'); R(g, x + 2, y + 3, 20, 3, '#4E9AD0'); R(g, x + 6 + tw(t, 600, 10), y + 4, 2, 1, '#9CD6F4');
      R(g, x + 14, y + 3, 4, 2, '#5FAE48'); R(g, x + 15, y + 2, 2, 1, '#4F9A3A'); R(g, x + 15, y + 2, 1, 1, tw(t, 2000, 4) ? '#2B1A51' : '#4F9A3A'); R(g, x + 6, y + 5, 3, 1, '#5FAE48'); R(g, x + 7, y + 4, 1, 1, '#F29BBA'); } },
    // ★ люксовые
    goldcan: { n: ['Golden watering can', 'Золотая лейка', 'Zelta lejkanna'], w: 12, h: 10, row: 'side', p: 600, d(g, x, y, t) {
      R(g, x + 2, y + 3, 7, 7, '#E9C46A'); R(g, x + 3, y + 4, 5, 1, '#FFF2B0'); R(g, x + 3, y + 1, 5, 1, '#C9A040'); R(g, x + 2, y + 2, 1, 1, '#C9A040'); R(g, x + 8, y + 2, 1, 1, '#C9A040'); R(g, x + 4, y + 6, 3, 2, '#C9A040'); R(g, x + 5, y + 6, 1, 1, '#FFF2B0');
      R(g, x + 9, y + 5, 1, 1, '#E9C46A'); R(g, x + 10, y + 4, 1, 1, '#E9C46A'); R(g, x + 11, y + 2, 1, 3, '#C9A040');
      const s = tw(t, 350, 6); if (s < 3) R(g, x + [1, 10, 6][s], y + [1, 0, 2][s], 1, 1, '#FFFFFF'); } },
    orangery: { n: ['Glass orangery', 'Стеклянная оранжерея', 'Stikla oranžērija'], w: 32, h: 26, row: 'back', p: 600, d(g, x, y, t, o) {
      const gl = 'rgba(191,230,246,.7)', fr = '#E9C46A';
      for (let i = 0; i < 6; i++) R(g, x + 9 - i, y + 2 + i, 14 + i * 2, 1, gl); R(g, x + 3, y + 8, 26, 18, gl);
      R(g, x + 15, y, 2, 2, fr); R(g, x + 3, y + 8, 26, 1, fr); R(g, x + 3, y + 25, 26, 1, fr); for (let i = 0; i < 6; i++) R(g, x + 3 + i * 5, y + 8, 1, 18, fr); R(g, x + 28, y + 8, 1, 18, fr);
      for (let i = 0; i < 6; i++) { R(g, x + 9 - i, y + 2 + i, 1, 1, fr); R(g, x + 22 + i, y + 2 + i, 1, 1, fr); }
      R(g, x + 6, y + 15, 6, 10, '#4F9A3A'); R(g, x + 8, y + 12, 3, 4, '#69B44E'); R(g, x + 9, y + 14, 2, 2, '#F2A93B'); R(g, x + 20, y + 17, 6, 8, '#5FAE48'); R(g, x + 21, y + 16, 2, 2, '#E8445A'); R(g, x + 24, y + 18, 2, 2, '#F6C531');
      R(g, x + 14, y + 19, 4, 6, '#8A5634'); R(g, x + 15, y + 20, 2, 5, '#B5784A');
      if (o && o.night) { g.globalAlpha = .2; R(g, x + 3, y + 8, 26, 18, '#F7D774'); g.globalAlpha = 1; }
      const s = tw(t, 300, 8); if (s < 4) R(g, x + [5, 26, 12, 20][s], y + [10, 12, 4, 22][s], 1, 1, '#FFFFFF'); } },
  };
  const LEG = ['garden|goldcan', 'garden|orangery']; // то же в site/assets/can-do.js LEGEND
  const ORDER = Object.keys(ITEMS);
  const name = (v, l = L) => ITEMS[v] ? ITEMS[v].n[l] : v;

  // где стоят вещи в огороде: back — вдоль забора (низ на y 56, слева направо от x 37), side — под домиком (4 ряда шириной 30, слева направо);
  // люксовые ставятся первыми; не влезло — не рисуется (хозяин может спрятать другую вещь)
  function layout(list) {
    const out = [], rows = [72, 88, 104, 119].map(y => ({ y, x: 1 })); let bx = 37;
    const order = [...ORDER.filter(v => LEG.includes('garden|' + v)), ...ORDER.filter(v => !LEG.includes('garden|' + v))];
    for (const v of order.filter(k => list.includes(k))) {
      const d = ITEMS[v];
      if (d.row === 'back') { if (bx + d.w > 192) continue; out.push({ v, x: bx, y: 56 - d.h }); bx += d.w + 2; }
      else { const r = rows.find(r => r.x + d.w <= 31); if (!r) continue; out.push({ v, x: r.x, y: r.y - d.h }); r.x += d.w + 2; }
    }
    return out;
  }
  const draw = (g, v, x, y, t, o) => { const d = ITEMS[v]; if (d) d.d(g, x, y, t || 0, o || {}); };

  // ---------- каталог подарков: вид garden ----------
  B.GIFTS.garden = ORDER;
  B.GIFT_KINDS.push(['garden', ['🥕 For the garden', '🥕 Для огорода', '🥕 Dārzam']]);
  LEG.forEach(x => B.LEGEND.add(x));
  if (B.ROOM_KINDS && !B.ROOM_KINDS.includes('garden')) B.ROOM_KINDS.push('garden');
  const oldRoomKind = B.isRoomKind; B.isRoomKind = k => k === 'garden' || !!(oldRoomKind && oldRoomKind(k)); // не надевается — как вещь комнаты
  const th = B.GIFT_THEMES.find(t => t[0] === 'legendary'); if (th) th[2].push(...LEG);
  const sur = B.GIFT_THEMES.find(t => t[0] === 'surprise'); if (sur && !sur[2].includes('garden|?')) sur[2].push('garden|?');
  B.GIFT_THEMES.push(['h_garden', ['🥕 Garden', '🥕 Огород', '🥕 Dārzs'], [...ORDER.map(v => 'garden|' + v), 'furn|wateringcan', 'furn|birdhouse', 'furn|applebasket', 'furn|mushstool', 'furn|plant']]);
  function icon(v, size) {
    const d = ITEMS[v], c = document.createElement('canvas'), g = c.getContext('2d'), box = document.createElement('span');
    box.className = 'pp-icon pp-room-ic'; box.style.setProperty('--ic', (size || 80) + 'px');
    if (!d) return box;
    const pad = 1, k = 2 * Math.max(1, Math.floor(Math.min(128 / (d.w + pad * 2), 128 / (d.h + pad * 2)) / 2));
    c.width = (d.w + pad * 2) * k; c.height = (d.h + pad * 2) * k; g.setTransform(k, 0, 0, k, 0, 0); g.imageSmoothingEnabled = false;
    d.d(g, pad, pad, 0, {});
    const z = (size || 80) * .7; if (c.width >= c.height) c.style.width = z + 'px'; else c.style.height = z + 'px';
    box.appendChild(c); return box;
  }
  const oldName = B.giftName, oldIcon = B.itemIcon, oldPic = B.giftPic, own = (k, v) => k === 'garden' && v !== '?';
  B.giftName = (k, v, l) => own(k, v) ? name(v, l == null ? L : l) : oldName(k, v, l);
  B.itemIcon = (k, v, size, id) => own(k, v) ? icon(v, size) : oldIcon(k, v, size, id);
  B.giftPic = (k, v, id, size, av) => { if (!own(k, v)) return oldPic(k, v, id, size, av); const w = document.createElement('span'); w.className = 'gift-pic'; w.appendChild(icon(v, size)); return w; };
  window.PPGardenItems = { ITEMS, ORDER, LEG, name, draw, layout, icon };
})();
