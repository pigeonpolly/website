// Пиксельные птички сайта: внешность из id пользователя (без повторов) и спрайт 20×26.
// Используют стая на главной (flock.js) и аватар в шапке (account.js).
(function () {
  const OUT = '#1a1528';
  // ---------- внешность ----------
  const SHAPES = [
    { bw: 10, bh: 8, hr: 3, neck: 0 },  // круглая
    { bw: 8, bh: 11, hr: 3, neck: 0 },  // высокая
    { bw: 13, bh: 9, hr: 3, neck: 0 },  // пухлая
    { bw: 9, bh: 7, hr: 2, neck: 3 },   // длинная шея
    { bw: 7, bh: 6, hr: 4, neck: 0 },   // кроха с большой головой
  ];
  const BODY = ['#8C8FC9', '#B39DDB', '#A0784F', '#F1EEE6', '#3A3550', '#D9A441', '#5FA8A0', '#E59BAE'];
  const HATS = ['top', 'beret', 'cap', 'bow', 'party', 'crown'];
  const HAT_C = ['#E0443A', '#E9A93B', '#4CC38A', '#4A7BD8', '#F08BC0', '#2B2340'];
  const SHOES = ['heels', 'sneakers', 'boots'];
  const SHOE_C = ['#E0443A', '#F08BC0', '#E9A93B', '#4A7BD8', '#FFFFFF', '#9B5DE5'];
  const N_HAT = 1 + HATS.length * HAT_C.length, N_SHOE = 1 + SHOES.length * SHOE_C.length;
  const N = SHAPES.length * BODY.length * N_HAT * N_SHOE;
  // каждый 11-й — ворона с сыром или украшением в клюве, каждый 10-й — котик (дружит с птичками)
  const FUR = ['#E8954A', '#9A9AA8', '#3A3550', '#F1EEE6', '#C8A27A', '#7A5A48'];
  const PATTERNS = ['solid', 'stripes', 'patches'];
  const ITEMS = ['cheese', 'ring', 'pearl', 'ruby', 'sapphire', 'key', 'spoon'];
  const hatOf = h => h ? { t: HATS[(h - 1) % HATS.length], c: HAT_C[Math.floor((h - 1) / HATS.length)] } : null;
  function looks(id) {
    if (id > 0 && id % 11 === 0) {
      let k = (Math.floor(id / 11) * 7919 + 101) % (ITEMS.length * N_HAT);
      return { kind: 'crow', shape: { bw: 12, bh: 9, hr: 3, neck: 0 }, body: '#2E2B3A', beak: '#5A5A66', item: ITEMS[k % ITEMS.length], hat: hatOf(Math.floor(k / ITEMS.length)), shoe: null };
    }
    if (id > 0 && id % 10 === 0) {
      let k = (Math.floor(id / 10) * 7919 + 202) % (FUR.length * PATTERNS.length * N_HAT);
      return { kind: 'cat', fur: FUR[k % FUR.length], pattern: PATTERNS[Math.floor(k / FUR.length) % PATTERNS.length], hat: hatOf(Math.floor(k / FUR.length / PATTERNS.length)) };
    }
    let k = (id * 7919 + 12345) % N; // 7919 — простое, не делит N: у разных id разная внешность
    const shoe = k % N_SHOE; k = Math.floor(k / N_SHOE);
    const hat = k % N_HAT; k = Math.floor(k / N_HAT);
    const body = k % BODY.length; k = Math.floor(k / BODY.length);
    return { kind: 'bird', shape: SHAPES[k % SHAPES.length], body: BODY[body], hat: hatOf(hat),
      shoe: shoe ? { t: SHOES[(shoe - 1) % SHOES.length], c: SHOE_C[Math.floor((shoe - 1) / SHOES.length)] } : null };
  }
  const shade = (hex, k) => '#' + hex.slice(1).match(/../g).map(h => Math.max(0, Math.min(255, Math.round(parseInt(h, 16) * k))).toString(16).padStart(2, '0')).join('');

  // ---------- спрайт птички (20×26, смотрит вправо): кадры 0,1 — шаг, 2 — клюёт ----------
  const SW = 28, SH = 26, BASE = 25, OX = 4; // OX: запас слева, чтобы предмет в клюве вороны помещался справа
  function grid() {
    const g = {}; // "x,y" → [цвет, слой]; слой 'leg' без контура
    const has = (x, y) => !!g[(x + OX) + ',' + y];
    const put = (x, y, c, layer = 'body') => { x += OX; if (x >= 0 && y >= 0 && x < SW && y < SH) g[x + ',' + y] = [c, layer]; };
    const ell = (cx, cy, rx, ry, c) => { for (let y = 0; y < SH; y++) for (let x = -OX; x < SW - OX; x++) if (((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1) put(x, y, c); };
    return { g, put, ell, has };
  }
  function drawHat(put, hat, hxR, ht) {
    if (SPECIAL_HATS && SPECIAL_HATS[hat.t]) hat = { t: SPECIAL_HATS[hat.t].lo[0], c: SPECIAL_HATS[hat.t].lo[1] };
    const c = hat.c, c2 = shade(c, c === '#2B2340' ? 2.2 : .7), t = hat.t;
    if (t === 'top') { for (let x = -3; x <= 3; x++) put(hxR + x, ht, c); for (let y = 1; y <= 4; y++) for (let x = -2; x <= 2; x++) put(hxR + x, ht - y, y === 1 ? c2 : c); }
    if (t === 'beret') { for (let x = -3; x <= 2; x++) put(hxR + x, ht, c); for (let x = -2; x <= 2; x++) put(hxR + x, ht - 1, c); put(hxR, ht - 2, c2); }
    if (t === 'cap') { for (let x = -2; x <= 2; x++) put(hxR + x, ht, c); for (let x = -1; x <= 1; x++) put(hxR + x, ht - 1, c); for (let x = 3; x <= 5; x++) put(hxR + x, ht + 1, c2); put(hxR + 2, ht + 1, c2); }
    if (t === 'bow') { const bx0 = hxR - 2; put(bx0 - 1, ht, c); put(bx0 - 1, ht + 1, c); put(bx0 - 1, ht - 1, c); put(bx0, ht, c2); put(bx0 + 1, ht - 1, c); put(bx0 + 1, ht + 1, c); put(bx0 + 1, ht, c); }
    if (t === 'party') { for (let y = 0; y < 5; y++) for (let x = -2 + Math.ceil(y / 2); x <= 2 - Math.ceil(y / 2); x++) put(hxR + x, ht - y, y % 2 ? c2 : c); put(hxR, ht - 5, '#FFFFFF'); }
    if (t === 'crown') { for (let x = -2; x <= 2; x++) { put(hxR + x, ht, c); put(hxR + x, ht - 1, c); } put(hxR - 2, ht - 2, c); put(hxR, ht - 2, c); put(hxR + 2, ht - 2, c); put(hxR, ht - 1, '#FFFFFF'); }
  }
  function finish(g, w = SW, h = SH) {
    const keys = Object.keys(g).filter(k => g[k][0] && g[k][1] !== 'leg');
    for (const k of keys) {
      const [x, y] = k.split(',').map(Number);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = (x + dx) + ',' + (y + dy); if (!g[n]) g[n] = [OUT, 'out']; }
    }
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x2 = c.getContext('2d');
    for (const k in g) { if (!g[k][0]) continue; const [x, y] = k.split(',').map(Number); x2.fillStyle = g[k][0]; x2.fillRect(x, y, 1, 1); }
    return c;
  }

  // обувь котика (подарок): по пикселю на лапку, сапожки — повыше, кеды — с белой подошвой рядом
  function catShoes(put, sh, paws) {
    if (!sh) return;
    for (const x of paws) {
      put(x, BASE, sh.c);
      if (sh.t === 'boots') put(x, BASE - 1, sh.c);
      if (sh.t === 'sneakers') put(x + 1, BASE, '#FFFFFF', 'leg');
      if (sh.t === 'heels') put(x, BASE - 1, sh.c);
    }
  }
  // котик (смотрит вправо): кадры 0,1 — шаг, 2 — сидит
  function catSprite(lk, frame) {
    const { g, put, ell, has } = grid();
    const fur = lk.fur, dark = shade(fur, fur === '#3A3550' ? 1.6 : .72), white = '#FBF8F0';
    let hx, hy;
    if (frame === 2) {
      for (let x = 3; x <= 10; x++) put(x, BASE, dark);                // хвост обвивает лапы
      ell(9, 19.5, 4.2, 5.2, fur);
      if (lk.pattern === 'patches') ell(10.5, 21, 2, 3, white);
      if (lk.pattern === 'stripes') for (let y = 16; y <= 23; y += 2) for (let x = 6; x <= 11; x++) if (has(x, y)) put(x, y, dark);
      put(10, BASE, fur); put(12, BASE, fur); put(11, BASE, fur);
      catShoes(put, lk.shoe, [10, 12]);
      hx = 11; hy = 12;
    } else {
      const sw = frame === 1 ? 1 : 0;
      for (const [x, y] of [[2, 19], [1, 18], [1, 17], [sw ? 2 : 0, 16], [sw ? 3 : 1, 15]]) put(x, y, dark); // хвост
      ell(8.5, 20.5, 6.8, 3.6, fur);
      if (lk.pattern === 'patches') { ell(10, 22.5, 4, 1.4, white); ell(6, 19, 2, 1.3, dark); }
      if (lk.pattern === 'stripes') for (let x = 4; x <= 12; x += 2) for (let y = 17; y <= 21; y++) if (has(x, y)) put(x, y, dark);
      for (const lx of frame === 1 ? [3, 6, 11, 14] : [4, 5, 12, 13]) { put(lx, BASE - 1, fur); put(lx, BASE, fur); }
      catShoes(put, lk.shoe, frame === 1 ? [3, 6, 11, 14] : [4, 5, 12, 13]);
      hx = 14.5; hy = 15.5;
    }
    ell(hx, hy, 3.7, 3.4, fur);
    const H = Math.round(hx), V = Math.round(hy);
    put(H - 3, V - 3, fur); put(H - 3, V - 4, fur); put(H - 2, V - 3, fur);   // ушки
    put(H + 2, V - 3, fur); put(H + 2, V - 4, fur); put(H + 1, V - 3, fur);
    put(H - 3, V - 3, '#F08BC0'); put(H + 2, V - 3, '#F08BC0');
    if (lk.pattern !== 'solid') ell(hx + .5, hy + 1.5, 2, 1.2, lk.pattern === 'patches' ? white : shade(fur, 1.15));
    put(H - 1, V - 1, '#120e1c'); put(H + 1, V - 1, '#120e1c');              // глаза
    put(H, V, '#F08BC0');                                                       // носик
    if (lk.item) drawItem(put, lk.item, H + 2, V + 1);
    if (lk.scarf) { for (let x = H - 3; x <= H + 2; x++) put(x, V + 3, lk.scarf); put(H - 3, V + 4, shade(lk.scarf, .75)); put(H - 4, V + 5, shade(lk.scarf, .75)); }
    if (lk.hat) drawHat(put, lk.hat, H - 1, V - 4);
    return finish(g);
  }

  // предмет в клюве вороны
  function drawItem(put, item, x, y) {
    const P = (dx, dy, c) => put(x + dx, y + dy, c, 'leg');
    if (item === 'cheese') { for (const [dx, dy] of [[0, -1], [1, -1], [0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2]]) P(dx, dy, '#F5C842'); P(1, 0, '#D9A72A'); P(3, 1, '#D9A72A'); P(1, 2, '#D9A72A'); for (let i = 0; i < 5; i++) P(i, 3, '#C9921F'); }
    if (item === 'ring') { for (const [dx, dy] of [[0, 1], [2, 1], [-1, 2], [3, 2], [-1, 3], [3, 3], [0, 4], [1, 4], [2, 4]]) P(dx, dy, '#E9C14A'); P(1, 0, '#5FD3F3'); P(0, 0, '#E9C14A'); P(2, 0, '#E9C14A'); }
    if (item === 'pearl') { P(0, 1, '#C8C2D8'); P(0, 2, '#C8C2D8'); P(0, 3, '#FFFFFF'); P(1, 3, '#FFFFFF'); P(0, 4, '#E8E4F0'); P(1, 4, '#E8E4F0'); }
    if (item === 'ruby' || item === 'sapphire') { const c = item === 'ruby' ? '#E0443A' : '#4A7BD8'; P(1, -1, c); P(0, 0, c); P(1, 0, '#FFFFFF'); P(2, 0, c); P(1, 1, c); }
    if (item === 'key') { for (let i = 0; i < 4; i++) P(i, 0, '#E9C14A'); P(3, 1, '#E9C14A'); P(4, -1, '#E9C14A'); P(4, 0, '#E9C14A'); P(4, 1, '#E9C14A'); P(5, 0, '#E9C14A'); }
    if (item === 'pizza') { for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx <= 3 - dy; dx++) P(dx, dy - 1, dy === 0 ? '#C98A3E' : '#F5C842'); P(1, 0, '#D84A3A'); P(0, 1, '#D84A3A'); }
    if (item === 'cherry') { P(0, -2, '#3E8E4F'); P(1, -1, '#3E8E4F'); P(0, -1, '#3E8E4F'); P(0, 0, '#D8203A'); P(1, 0, '#D8203A'); P(0, 1, '#D8203A'); P(1, 1, '#A81428'); P(0, 0, '#FF8A9A'); }
    const LO = { dragonegg: '#4CC38A', goldfeather: '#E9A93B', comet: '#F5D547', goldenapple: '#E9C14A', paintbrush: '#E0443A', palette: '#D9A441', pencil: '#F5D547', coffee: '#FFFFFF', croissant: '#D9944A', gamepad: '#3A3550', coin: '#F5D547', sword: '#C8CCD8', mushroom: '#E0443A', wand: '#F5D547', crystal: '#9B7FE0', star: '#F5D547', lollipop: '#F08BC0', minipumpkin: '#E8792B', candycane: '#D8283A', giftbox: '#D8283A', ornament: '#4A7BD8', snowflake: '#DDEEFF', heart: '#E0243A', rose: '#D8203A', letter: '#FFFDF8', icecream: '#F7A8C4', mapleleaf: '#E8792B' };
    if (LO[item]) { P(0, 0, LO[item]); P(1, 0, LO[item]); P(0, 1, LO[item]); P(1, 1, shade(LO[item], .8)); }
    if (item === 'spoon') { for (let i = 0; i < 3; i++) P(i, 0, '#D0D4E0'); P(3, -1, '#E8EBF2'); P(3, 0, '#E8EBF2'); P(4, -1, '#E8EBF2'); P(4, 0, '#E8EBF2'); P(3, 1, '#B8BCC8'); }
  }

  function sprite(lk, frame) {
    if (lk.kind === 'cat') return catSprite(lk, frame);
    const { g, put, ell } = grid();
    const s = lk.shape, legH = lk.shoe && lk.shoe.t === 'heels' ? 4 : 3;
    const cx = 9, bottom = BASE - legH + 1, cy = bottom - s.bh / 2, top = bottom - s.bh;
    const dark = shade(lk.body, lk.body === '#3A3550' ? 1.5 : .72), light = shade(lk.body, 1.12);
    // хвост
    for (let i = 0; i < 4; i++) for (let j = -1; j <= Math.min(1, i); j++) put(Math.round(cx - s.bw / 2) - i + 1, Math.round(cy) + j - i + 1, dark);
    ell(cx, cy, s.bw / 2, s.bh / 2, lk.body);
    ell(cx + 1, cy + s.bh / 4, s.bw / 3, s.bh / 4, light); // грудка
    ell(cx - 1, cy, s.bw / 3, s.bh / 3.2, dark);            // крыло
    // голова и шея
    const peck = frame === 2;
    const hx = cx + s.bw / 2 - 1 + (peck ? 2 : 0), hy = top - s.hr + 2 - s.neck + (peck ? s.bh / 2 + 2 : 0);
    if (s.neck) for (let i = 0; i <= s.neck + 1; i++) put(Math.round(hx - 1 + (peck ? -1 : 0)), Math.round(hy + s.hr - 1 + i), lk.body), put(Math.round(hx) + (peck ? -1 : 0), Math.round(hy + s.hr - 1 + i), lk.body);
    ell(hx, hy, s.hr + .2, s.hr + .2, lk.body);
    const ex = Math.round(hx + s.hr / 2), ey = Math.round(hy - (s.hr > 2 ? 1 : 0));
    put(ex, ey, '#120e1c'); if (s.hr >= 3) put(ex - 1, ey, '#FFFFFF');
    const bx = Math.round(hx + s.hr + .5), by = Math.round(hy) + (peck ? 1 : 0);
    const beak = lk.beak || '#F2A73B';
    put(bx, by, beak); put(bx + 1, by, beak); if (s.hr >= 3) put(bx, by - 1, beak);
    if (lk.kind === 'crow') { put(bx + 2, by, beak); put(bx + 1, by - 1, beak); drawItem(put, lk.item, bx + 3, by); }
    else if (lk.item) drawItem(put, lk.item, bx + 2, by);
    if (lk.scarf) { const ny = Math.round(hy + s.hr) + (peck ? -1 : 0), nx = Math.round(hx); for (let x = nx - s.hr; x <= nx + 1; x++) put(x, ny, lk.scarf); put(nx - s.hr, ny + 1, shade(lk.scarf, .75)); put(nx - s.hr - 1, ny + 2, shade(lk.scarf, .75)); }
    // ноги и обувь
    const legs = frame === 1 ? [cx - 2, cx + 2] : [cx - 1, cx + 1];
    for (const lx of legs) {
      for (let y = bottom; y <= BASE; y++) put(lx, y, '#E9A93B', 'leg');
      const sh = lk.shoe;
      if (!sh) { put(lx + 1, BASE, '#E9A93B', 'leg'); continue; }
      if (sh.t === 'heels') { put(lx, BASE - 1, sh.c, 'leg'); put(lx + 1, BASE - 1, sh.c, 'leg'); put(lx + 1, BASE, sh.c, 'leg'); put(lx - 1, BASE, sh.c, 'leg'); put(lx, BASE, null, 'leg'); }
      if (sh.t === 'sneakers') { for (let x = lx - 1; x <= lx + 1; x++) { put(x, BASE - 1, sh.c, 'leg'); put(x, BASE, '#FFFFFF', 'leg'); } }
      if (sh.t === 'boots') { for (let y = BASE - 3; y <= BASE; y++) put(lx, y, sh.c, 'leg'); put(lx + 1, BASE, sh.c, 'leg'); put(lx + 1, BASE - 1, sh.c, 'leg'); }
    }
    if (lk.hat) drawHat(put, lk.hat, Math.round(hx), Math.round(hy - s.hr - .2));
    return finish(g);
  }

  // ---------- крупная детальная птичка для аватара (в 2 раза подробнее): профиль, сумка, подарки ----------
  const HW = 64, HH = 56, HB = 53, HO = 4;
  function hgrid() {
    const g = {};
    const put = (x, y, c, layer = 'body') => { x = Math.round(x) + HO; y = Math.round(y); if (c !== undefined && x >= 0 && y >= 0 && x < HW && y < HH) g[x + ',' + y] = [c, layer]; };
    const ell = (cx, cy, rx, ry, c) => { for (let y = 0; y < HH; y++) for (let x = -HO; x < HW - HO; x++) if (((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1) put(x, y, c); };
    const has = (x, y) => !!g[(Math.round(x) + HO) + ',' + Math.round(y)];
    return { g, put, ell, has };
  }
  // пиксельная картинка из строк: «.» — пусто, буквы — цвета из палитры
  function stamp(put, rows, x0, y0, pal, flip) {
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) put(x0 + (flip ? r.length - 1 - x : x), y0 + y, pal[ch]); }));
  }
  const HD_HATS = {
    top: ['..cccccccc..', '..clcccccc..', '..clcccccc..', '..cccccccc..', '..cccccccc..', '..bbbbbbbb..', 'cccccccccccc', '.dddddddddd.'],
    beret: ['......d.....', '...cccccc...', '.cclllcccc..', 'ccccccccccc.', 'cccccccccccc', '.dddddddddd.'],
    cap: ['...cccc.......', '..clllccc.....', '.cccccccccc...', 'cccbcccccccc..', 'dddddddddddddd'],
    bow: ['cc........cc', 'cccc....cccc', 'cclccddcclcc', 'cccccddccccc', 'cccc....cccc', 'cc........cc'],
    party: ['....ww....', '...wwww...', '....cc....', '...cccc...', '...bbbb...', '..cccccc..', '..bbbbbb..', '.cccccccc.', '.bbbbbbbb.', 'cccccccccc'],
    crown: ['c....c....c', 'cc..cwc..cc', 'ccc.ccc.ccc', 'ccccccccccc', 'crccbccrccc', 'ddddddddddd'],
  };
  // тематические шапки: свой рисунок и цвета (значение подарка — просто имя, например «wizard»)
  const SPECIAL_HATS = {
    wizard: { r: ['......cc....', '.....ccc....', '.....cscc...', '....cccc....', '....ccccc...', '...ccsccc...', '...cccccc...', '..bbbbbbbb..', 'cccccccccccc', '.dddddddddd.'], p: { c: '#5B3FA8', d: '#3E2A78', s: '#F5D547', b: '#E9A93B' }, lo: ['party', '#5B3FA8'] },
    witch: { r: ['.......k....', '......kk....', '.....kkk....', '....kkkk....', '....kkkkk...', '...pppyppp..', 'kkkkkkkkkkkk', '.KKKKKKKKKK.'], p: { k: '#2A2433', K: '#4A4258', p: '#9B5DE5', y: '#E9C14A' }, lo: ['top', '#2B2340'] },
    pumpkin: { r: ['.....g....', '....gg....', '..oOoooo..', '.ookookoo.', 'oooooooooo', 'oookkkkooo', '.oooooooo.'], p: { o: '#E8792B', O: '#F5A25D', g: '#4C9A5B', k: '#2A1A10' }, lo: ['crown', '#E9A93B'] },
    santa: { r: ['..........ww', '.......rrrww', '.....rrrrr..', '....rrrrrr..', '...rrrrrrr..', '..rrrrrrrr..', '.wwwwwwwwww.', 'wwwwwwwwwwww'], p: { r: '#D8283A', w: '#FFFFFF' }, lo: ['party', '#E0443A'] },
    antlers: { r: ['b.b....b.b', 'bbb....bbb', '.b......b.', '.bb....bb.', '..b....b..', '..hhhhhh..'], p: { b: '#8B5A2B', h: '#C0392B' }, lo: ['crown', '#E9A93B'] },
    beanie: { r: ['....ww....', '...wwww...', '..bbbbbb..', '.bbbbbbbb.', '.wwwwwwww.', 'bbbbbbbbbb', 'dddddddddd'], p: { b: '#4A7BD8', d: '#2C4F96', w: '#FFFFFF' }, lo: ['beret', '#4A7BD8'] },
    heartband: { r: ['.rr.rr......', 'rRrrrrr.....', 'rrrrrrr.....', '.rrrrr......', '..rrr.......', '...r........', 'hhhhhhhhhhhh'], p: { r: '#E0243A', R: '#FF9AA8', h: '#F08BC0' }, lo: ['bow', '#F08BC0'] },
    wreath: { r: ['.p...y...p.', 'pyp.gyg.pyp', 'gpgygpgygpg', 'ggggggggggg'], p: { p: '#F08BC0', y: '#F5D547', g: '#4C9A5B' }, lo: ['crown', '#4CC38A'] },
    strawhat: { r: ['...ssssss...', '..ssssssss..', '..rrrrrrrr..', 'ssssssssssss', '.dddddddddd.'], p: { s: '#E9C46A', d: '#C9A040', r: '#E0443A' }, lo: ['beret', '#E9A93B'] },
    halo: { r: ['..yyyyyyyy..', '.yY......Yy.', '..yyyyyyyy..', '............', '............'], p: { y: '#F5D547', Y: '#FFF8C4' }, lo: ['crown', '#E9A93B'] },
    unicorn: { r: ['....w....', '...wp....', '...ww....', '..wpw....', '..www....', '.wpww.mm.', '.wwwwmmm.'], p: { w: '#FFF3D6', p: '#F7A8C4', m: '#B39DDB' }, lo: ['party', '#F7A8C4'] },
    flamecrown: { r: ['r....r....r', 'ro..ror..or', 'ooyoyyyoyoo', 'yyyyyyyyyyy', 'yryybyyryyy', 'ddddddddddd'], p: { r: '#E0443A', o: '#F5873A', y: '#F5D547', b: '#4A7BD8', d: '#C9921F' }, lo: ['crown', '#E0443A'] },
    pirate: { r: ['....kkkkkk....', '..kkkkkkkkkk..', '.kkkkkwwkkkkk.', 'kkkkkkwwkkkkkk', '.yyyyyyyyyyyy.'], p: { k: '#2A2433', w: '#FFFFFF', y: '#E9C14A' }, lo: ['top', '#2B2340'] },
    chef: { r: ['..wwww..', '.wwwwww.', 'wwwwwwww', 'wwwgwwww', '.wwwwww.', '.gwgwgw.', '.wwwwww.'], p: { w: '#FFFFFF', g: '#DCDCE6' }, lo: ['top', '#FFFFFF'] },
    graduation: { r: ['kkkkkkkkkkkk', '.kkkkkkkkkk.', '....kkkk..y.', '...kkkkkk.y.', '...kkkkkk.yy'], p: { k: '#2A2433', y: '#F5D547' }, lo: ['cap', '#2B2340'] },
    headset: { r: ['...kkkkkk...', '..k......k..', '.k........k.', 'gk........kg', 'gk........kg', 'gk........kg', '.k.......mm.'], p: { k: '#2A2433', g: '#39E07A', m: '#39E07A' }, lo: ['cap', '#4CC38A'] },
    leafcrown: { r: ['o..r..y..o.', 'oo.rr.yy.oo', 'orryyoorryo', 'ddddddddddd'], p: { o: '#E8792B', r: '#C0392B', y: '#E9C14A', d: '#8B5A2B' }, lo: ['crown', '#E0443A'] },
  };
  const HD_ITEMS = {
    wand: { r: ['.......y.', '......yyy', '.......y.', '......k..', '.....k...', '....k....', '...k.....', '..w......'], p: { y: '#F5D547', k: '#2A2433', w: '#FFFFFF' }, dy: -7 },
    crystal: { r: ['.ppp.', 'pwppp', 'ppppp', '.ppp.', 'ddddd'], p: { p: '#9B7FE0', w: '#E8E0FF', d: '#8B5A2B' }, dy: -2 },
    star: { r: ['..y..', '.yyy.', 'yyyyy', '.yyy.', '.y.y.'], p: { y: '#F5D547' }, dy: -2 },
    lollipop: { r: ['...ppp', '..pwpp', '..pppp', '...pp.', '..w...', '.w....', 'w.....'], p: { p: '#F08BC0', w: '#FFFFFF' }, dy: -6 },
    minipumpkin: { r: ['..g..', '.ooo.', 'okoko', 'ooooo', '.ooo.'], p: { o: '#E8792B', g: '#4C9A5B', k: '#2A1A10' }, dy: -2 },
    candycane: { r: ['.wrw.', 'r...r', 'w....', 'r....', 'w....', 'r....'], p: { r: '#D8283A', w: '#FFFFFF' }, dy: -5 },
    giftbox: { r: ['..y.y..', '...y...', 'rrryrrr', 'rrryrrr', 'rrryrrr'], p: { r: '#D8283A', y: '#F5D547' }, dy: -2 },
    ornament: { r: ['..y..', '.bbb.', 'bwbbb', 'bbbbb', '.bbb.'], p: { b: '#4A7BD8', w: '#CFE0FF', y: '#E9C14A' }, dy: -2 },
    snowflake: { r: ['.w.w.', '..w..', 'wwwww', '..w..', '.w.w.'], p: { w: '#DDEEFF' }, dy: -2 },
    heart: { r: ['.rr.rr.', 'rRrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], p: { r: '#E0243A', R: '#FF9AA8' }, dy: -2 },
    rose: { r: ['..rr.', '.rRrr', '..rr.', '..g..', '.gg..', '..g..', '..g..'], p: { r: '#D8203A', R: '#FF8A9A', g: '#3E8E4F' }, dy: -6 },
    letter: { r: ['wwwwwww', 'wpwwwpw', 'wwprpww', 'wwwpwww', 'wwwwwww'], p: { w: '#FFFDF8', p: '#CFC7E8', r: '#E0243A' }, dy: -2 },
    icecream: { r: ['.ppp.', 'ppwpp', '.ppp.', '.oooo', '..oo.', '..o..'], p: { p: '#F7A8C4', w: '#FFFFFF', o: '#D9A441' }, dy: -3 },
    dragonegg: { r: ['..gg..', '.gGgg.', 'gggpgg', 'gpgggg', 'ggggpg', '.gggg.'], p: { g: '#4CC38A', G: '#C8FFE0', p: '#9B5DE5' }, dy: -3 },
    goldfeather: { r: ['.....yy', '....yYy', '...yYy.', '..yYy..', '.yYy...', 'yy.....', 'w......'], p: { y: '#E9A93B', Y: '#FFF1A8', w: '#FFFFFF' }, dy: -6 },
    comet: { r: ['......yY', '....yyYy', '..oyyyy.', 'oo.oy...', 'o.o.....'], p: { y: '#F5D547', Y: '#FFFFFF', o: '#F5873A' }, dy: -2 },
    goldenapple: { r: ['...g.', '..gG.', '.yyyy', 'yYyyy', 'yyyyy', '.yyy.'], p: { y: '#E9C14A', Y: '#FFF3A8', g: '#4C9A5B', G: '#7FC28A' }, dy: -3 },
    paintbrush: { r: ['......rr', '......rr', '.....kk.', '....kk..', '...kk...', '..kk....', '.kk.....'], p: { r: '#E0443A', k: '#8B5A2B' }, dy: -6 },
    palette: { r: ['.bbbbb.', 'bbrbbyb', 'bgbbbbb', 'bbbbwbb', '.bbbb..'], p: { b: '#D9A441', r: '#E0443A', y: '#F5D547', g: '#4CC38A', w: '#FFFFFF' }, dy: -2 },
    pencil: { r: ['.......k', '......wy', '....yyy.', '..yyy...', 'rrr.....'], p: { k: '#2A2433', w: '#F0C27C', y: '#F5D547', r: '#F08BC0' }, dy: -4 },
    coffee: { r: ['.s.s.', '.....', 'wwwww', 'wbbbww', 'wbbbw.', '.www.'], p: { w: '#FFFFFF', b: '#6B3E26', s: '#DCDCE6' }, dy: -4 },
    croissant: { r: ['..oooo..', '.oOooOo.', 'oOoooooO', 'o......o'], p: { o: '#D9944A', O: '#F0C27C' }, dy: -2 },
    gamepad: { r: ['.kkkkkkk.', 'kkwkkkrkk', 'kwwwkbkgk', 'kkwkkkykk', '.kk...kk.'], p: { k: '#3A3550', w: '#FFFFFF', r: '#E0443A', b: '#4A7BD8', g: '#4CC38A', y: '#F5D547' }, dy: -2 },
    coin: { r: ['.yyy.', 'yYddy', 'yYdyy', 'yYddy', '.yyy.'], p: { y: '#F5D547', Y: '#FFF1A8', d: '#C9921F' }, dy: -2 },
    sword: { r: ['.......ss', '......sws', '.....sws.', '....sws..', '.y.sws...', '..yss....', '..bb.....', '.b..y....'], p: { s: '#C8CCD8', w: '#FFFFFF', y: '#E9C14A', b: '#8B5A2B' }, dy: -7 },
    mushroom: { r: ['.rrrr.', 'rwrrwr', 'rrrrrr', '..ww..', '..ww..'], p: { r: '#E0443A', w: '#FFFFFF' }, dy: -3 },
    mapleleaf: { r: ['..o..', 'o.o.o', 'ooooo', '.ooo.', '..d..'], p: { o: '#E8792B', d: '#8B5A2B' }, dy: -2 },
    pizza: { r: ['ooooooooo', 'oOOOOOOOo', '.yyrryyy.', '.yrryyry.', '..yyyrr..', '..yyyyy..', '...ryy...', '...yyy...', '....y....'], p: { y: '#FFD966', r: '#D84A3A', o: '#B8743A', O: '#E0A060' }, dy: -1 }, // кусочек висит из клюва, держится за корочку
    cherry: { r: ['....gG.', '...gGG.', '..g.g..', '.g...g.', 'rr..rr.', 'rRr.rRr', 'rrr.rrr', '.r...r.'], p: { g: '#3E8E4F', G: '#5FC46F', r: '#D8203A', R: '#FF8A9A' }, dy: -1 },
    cheese: { r: ['..yy...', 'yyyyy..', 'yhyyyyy', 'yyyyhyy', 'ddddddd'], p: { y: '#F5C842', h: '#D9A72A', d: '#C9921F' }, dy: -2 },
    ring: { r: ['.wbw.', '..y..', '.y.y.', 'y...y', 'y...y', '.yyy.'], p: { w: '#FFFFFF', b: '#5FD3F3', y: '#E9C14A' }, dy: -1 },
    pearl: { r: ['.pp.', 'pwpp', 'pppp', '.pd.'], p: { p: '#E8E4F0', w: '#FFFFFF', d: '#C8C2D8' }, dy: -1 },
    ruby: { r: ['.cc.', 'cwcc', 'cccc', '.dd.'], p: { c: '#E0443A', w: '#FFB3AA', d: '#9E2A22' }, dy: -1 },
    sapphire: { r: ['.cc.', 'cwcc', 'cccc', '.dd.'], p: { c: '#4A7BD8', w: '#B5CCF5', d: '#2C4F96' }, dy: -1 },
    key: { r: ['.......yyy', 'yyyyyyyy.y', '.y.y...yyy'], p: { y: '#E9C14A' }, dy: -1 },
    spoon: { r: ['......sss', 'ggggggsws', '......sss'], p: { g: '#B8BCC8', s: '#D0D4E0', w: '#FFFFFF' }, dy: -1 },
  };
  function hdHat(put, hat, cx, bottom) {
    if (SPECIAL_HATS[hat.t]) { const h = SPECIAL_HATS[hat.t]; stamp(put, h.r, Math.round(cx - h.r[0].length / 2), bottom - h.r.length + 1, h.p); return; }
    const rows = HD_HATS[hat.t]; if (!rows) return;
    const c = hat.c, dark = c === '#2B2340';
    const pal = { c, d: shade(c, dark ? 1.6 : .7), l: shade(c, dark ? 2.2 : 1.3), b: hat.t === 'party' ? '#FFFFFF' : dark ? '#E0443A' : shade(c, .55), w: '#FFFFFF', r: '#E0443A' };
    if (hat.t === 'crown') pal.b = '#4A7BD8';
    stamp(put, rows, Math.round(cx - rows[0].length / 2), bottom - rows.length + 1, pal);
  }
  function hdShoe(put, sh, x) { // x — левый край лапки (2px)
    const c = sh.c, d = shade(c, c === '#FFFFFF' ? .82 : .7);
    if (sh.t === 'sneakers') { stamp(put, ['.cccc.', 'cwcwcc', 'ssssss'], x - 1, HB - 2, { c, w: '#FFFFFF', s: c === '#FFFFFF' ? '#C8C2D8' : '#FFFFFF' }); }
    if (sh.t === 'boots') { stamp(put, ['lll.', 'cc..', 'cc..', 'cc..', 'cccc', 'ccccc', 'ddddd'], x, HB - 6, { c, d, l: shade(c, 1.25) }); }
    if (sh.t === 'heels') { stamp(put, ['.cccc', 'cccccc', 'd...dd'], x - 1, HB - 2, { c, d }); }
  }
  function hdScarf(put, color, x0, x1, y, tailX) {
    const d = shade(color, color === '#FFFFFF' ? .85 : .72), l = shade(color, 1.2);
    for (let x = x0; x <= x1; x++) for (let k = 0; k < 3; k++) put(x, y + k, (x - x0) % 4 < 2 ? (k === 0 ? l : color) : d);
    for (let k = 0; k < 6; k++) for (let j = 0; j < 3; j++) put(tailX + j, y + 2 + k, k % 2 ? d : color);
    put(tailX, y + 8, d); put(tailX + 2, y + 8, d);
  }
  function spriteHD(lk, frame = 0) { // кадры как у маленькой: 0 — стоит, 1 — шаг, 2 — клюёт (котик: сидит)
    const { g, put, ell, has } = hgrid();
    if (lk.kind === 'cat') {
      const fur = lk.fur, dark = shade(fur, fur === '#3A3550' ? 1.6 : .72), white = '#FBF8F0';
      // хвост
      for (let i = 0; i < 12; i++) { const tx = 6 - Math.round(Math.sin(i / 3) * 3), ty = HB - 10 - i; put(tx, ty, dark); put(tx + 1, ty, dark); put(tx + 2, ty, i > 9 ? shade(dark, .8) : dark); }
      ell(20, HB - 9, 13, 7.5, fur);
      if (lk.pattern === 'patches') { ell(23, HB - 6, 8, 3, white); ell(14, HB - 12, 4, 2.5, dark); }
      if (lk.pattern === 'stripes') for (let x = 10; x <= 28; x += 4) for (let y = HB - 16; y <= HB - 4; y++) if (has(x, y)) { put(x, y, dark); put(x + 1, y, dark); }
      const paws = frame === 1 ? [7, 15, 23, 31] : [9, 14, 25, 30];
      for (const px of paws) { for (let y = HB - 4; y <= HB; y++) { put(px, y, fur); put(px + 1, y, fur); put(px + 2, y, fur); } put(px, HB, shade(fur, .85)); }
      if (lk.shoe) for (const px of paws) hdShoe(put, lk.shoe, px);
      const H = 34, V = HB - 21;
      ell(H, V, 8, 7.2, fur);
      stamp(put, ['c....', 'cc...', 'cpc..', 'cppc.'], H - 8, V - 10, { c: fur, p: '#F4A6C6' });
      stamp(put, ['....c', '...cc', '..cpc', '.cppc'], H + 4, V - 10, { c: fur, p: '#F4A6C6' });
      if (lk.pattern !== 'solid') ell(H + 1, V + 3, 4, 2.5, lk.pattern === 'patches' ? white : shade(fur, 1.15));
      for (const ex of [H - 4, H + 2]) { put(ex, V - 1, '#7CC36A'); put(ex + 1, V - 1, '#7CC36A'); put(ex, V, '#7CC36A'); put(ex + 1, V, '#120e1c'); put(ex, V + 1, '#4E9A45'); put(ex + 1, V + 1, '#4E9A45'); }
      put(H - 1, V + 2, '#F08BC0'); put(H, V + 2, '#F08BC0'); put(H - 1, V + 3, '#120e1c'); put(H - 2, V + 4, '#120e1c'); put(H, V + 4, '#120e1c');
      for (const [x, y] of [[H - 9, V + 2], [H - 10, V + 4], [H + 7, V + 2], [H + 8, V + 4]]) put(x, y, '#FFFFFF', 'leg');
      if (lk.scarf) hdScarf(put, lk.scarf, H - 7, H + 5, V + 6, H - 7);
      if (lk.item && HD_ITEMS[lk.item]) { const it = HD_ITEMS[lk.item]; stamp(put, it.r, H + 6, V + 3 + it.dy, it.p); }
      if (lk.hat) hdHat(put, lk.hat, H, V - 7);
      return finish(g, HW, HH);
    }
    const s = lk.shape, legH = lk.shoe && lk.shoe.t === 'heels' ? 8 : 6;
    const bw = s.bw * 2, bh = s.bh * 2, hr = s.hr * 2, neck = s.neck * 2;
    const cx = 20, bottom = HB - legH + 1, cy = bottom - bh / 2, top = bottom - bh;
    const dark = shade(lk.body, lk.body === '#3A3550' ? 1.5 : .72), light = shade(lk.body, 1.14), deep = shade(dark, .8);
    // хвост из трёх перьев
    for (let i = 0; i < 8; i++) for (let j = -2; j <= Math.min(2, i); j++) put(Math.round(cx - bw / 2) - i + 2, Math.round(cy) + j - i + 2, j === 0 ? deep : dark);
    ell(cx, cy, bw / 2, bh / 2, lk.body);
    ell(cx + 2, cy + bh / 4, bw / 3, bh / 4, light);                 // грудка
    ell(cx - 2, cy, bw / 3, bh / 3.2, dark);                           // крыло
    for (let x = Math.round(cx - 2 - bw / 3) + 2; x < cx - 2 + bw / 3 - 1; x += 2) put(x, Math.round(cy + bh / 3.2) - 1, deep); // перья на крыле
    const peck = frame === 2, hx = cx + bw / 2 - 2 + (peck ? 4 : 0), hy = top - hr + 4 - neck + (peck ? bh / 2 + 4 : 0);
    if (neck) for (let i = 0; i <= neck + 2; i++) for (let k = -2; k <= 1; k++) put(hx + k, hy + hr - 2 + i, lk.body);
    ell(hx, hy, hr + .4, hr + .4, lk.body);
    const ex = Math.round(hx + hr / 2), ey = Math.round(hy - (hr > 4 ? 2 : 1));
    stamp(put, ['ww.', 'wkk', 'wkh'], ex - 1, ey - 1, { w: '#FFFFFF', k: '#120e1c', h: '#3a3150' });
    if (lk.kind !== 'crow') { put(ex - 2, ey + 2, '#F2A0B0'); put(ex - 1, ey + 2, '#F2A0B0'); }
    const bx = Math.round(hx + hr + .5), by = Math.round(hy);
    const beak = lk.beak || '#F2A73B', beak2 = shade(beak, .78);
    if (lk.kind === 'crow') stamp(put, ['bbbbb.', 'bbbbbb', 'dddd..'], bx - 1, by - 1, { b: beak, d: beak2 });
    else stamp(put, ['bb..', 'bbbb', 'ddd.'], bx - 1, by - 1, { b: beak, d: beak2 });
    const item = lk.item && HD_ITEMS[lk.item];
    if (item) stamp(put, item.r, bx + (lk.kind === 'crow' ? 5 : 3), by + item.dy, item.p);
    // лапки с пальчиками
    for (const lx of frame === 1 ? [cx - 5, cx + 4] : [cx - 3, cx + 2]) {
      for (let y = bottom; y <= HB; y++) { put(lx, y, '#E9A93B', 'leg'); put(lx + 1, y, '#D9952B', 'leg'); }
      if (lk.shoe) hdShoe(put, lk.shoe, lx);
      else { put(lx + 2, HB, '#D9952B', 'leg'); put(lx + 3, HB, '#D9952B', 'leg'); put(lx - 1, HB, '#D9952B', 'leg'); }
    }
    if (lk.scarf) hdScarf(put, lk.scarf, Math.round(hx - hr), Math.round(hx + 2), Math.round(hy + hr - 2), Math.round(hx - hr) - 1);
    if (lk.hat) hdHat(put, lk.hat, Math.round(hx), Math.round(hy - hr) + 1);
    return finish(g, HW, HH);
  }

  // ---------- подарки-семечки для аватара (выдаёт админ): фон, обувь, головной убор, анимация, рамка ----------
  // значение подарка — короткая строка: hat «crown:1» (вид:цвет), shoes «boots:3», bg «#F5C4B3», anim «bounce», frame «gold»
  // тематические фоны-картинки и рамки-картинки (рисунки — site/assets/ava-deco.css, генератор tools/ava_deco_gen.py)
  const BG_PICS = ['nightsky', 'hauntedmoon', 'pumpkinpatch', 'autumnleaves', 'rainyday', 'snowfall', 'xmas', 'hearts', 'blossom', 'beach', 'galaxy', 'synthwave', 'library', 'cafe'];
  const SVG_FRAMES = ['web', 'candycorn', 'bats', 'autumnwreath', 'mushrooms', 'flowers', 'canestripe', 'lights', 'pixel', 'catears', 'bubbles', 'sunrays', 'clouds', 'jewels'];
  const GIFTS = {
    bg: ['#F5C4B3', '#FBE3A1', '#CDEBD8', '#BFD7F5', '#E2D3F7', '#F7C6DA', '#FFFDF8', '#2B1A51', '#1D6B4F', '#D85A30', '#1B1035', '#E8F4FF', '#FFD6E0', '#F2C27B', '#0F0F2D', ...BG_PICS],
    hat: ['halo', 'unicorn', 'flamecrown', 'wizard', 'witch', 'pumpkin', 'santa', 'antlers', 'beanie', 'heartband', 'wreath', 'strawhat', 'leafcrown', 'headset', 'pirate', 'chef', 'graduation', ...HATS.flatMap(h => HAT_C.map((c, i) => h + ':' + i))],
    shoes: SHOES.flatMap(h => SHOE_C.map((c, i) => h + ':' + i)),
    anim: ['bounce', 'wiggle', 'float', 'spin', 'sparkle', 'heart', 'aurora'],
    frame: ['gold', 'rainbow', 'stars', 'hearts', 'leaves', 'dotted', 'snow', 'magic', 'spooky', 'neon', 'legend', ...SVG_FRAMES],
    item: ['dragonegg', 'goldfeather', 'comet', 'goldenapple', 'paintbrush', 'palette', 'pencil', 'coffee', 'croissant', 'pizza', 'cherry', 'wand', 'crystal', 'star', 'lollipop', 'minipumpkin', 'candycane', 'giftbox', 'ornament', 'snowflake', 'heart', 'rose', 'letter', 'icecream', 'mapleleaf', 'gamepad', 'coin', 'sword', 'mushroom', 'cheese', 'ring', 'pearl', 'ruby', 'sapphire', 'key', 'spoon'],
    scarf: ['#E0443A', '#E9A93B', '#4CC38A', '#4A7BD8', '#F08BC0', '#9B5DE5', '#FFFFFF', '#2B2340', '#5FA8A0', '#D85A30'],
  };
  const pair = (v, list, cols) => { const [t, i] = String(v || '').split(':'); return list.includes(t) && cols[+i] ? { t, c: cols[+i] } : null; };
  // внешность с надетыми подарками (у котика нет обуви)
  function dress(lk, av) {
    if (!av) return lk;
    const d = Object.assign({}, lk);
    if (av.hat) d.hat = SPECIAL_HATS[av.hat] ? { t: av.hat } : pair(av.hat, HATS, HAT_C) || d.hat;
    if (av.shoes) d.shoe = pair(av.shoes, SHOES, SHOE_C) || d.shoe;
    if (GIFTS.item.includes(av.item)) d.item = av.item;         // в клюве / в зубках
    if (/^#[0-9a-f]{6}$/i.test(av.scarf || '')) d.scarf = av.scarf;
    return d;
  }
  // обрезать пустые края спрайта
  function crop(c) {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return c;
    const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
    o.getContext('2d').drawImage(c, -x0, -y0);
    return o;
  }
  // круглый аватар: фон, рамка, анимация и птичка (крупные пиксели)
  function avatar(id, av, size) {
    av = av || {};
    const el = document.createElement('span');
    el.className = 'pp-ava' + (av.frame ? ' fr-' + av.frame : '') + (SVG_FRAMES.includes(av.frame) ? ' fr-svg' : '') + (BG_PICS.includes(av.bg) ? ' bg-' + av.bg : '') + (av.anim ? ' an-' + av.anim : ''); // фоны-картинки и рамки-картинки — в ava-deco.css
    el.style.setProperty('--ava', (size || 120) + 'px');
    if (/^#[0-9a-f]{6}$/i.test(av.bg || '')) el.style.setProperty('--ava-bg', av.bg);
    const c = crop(spriteHD(dress(looks(id), av)));
    // целый масштаб пикселей, чтобы картинка была чёткой; персонаж занимает ~75% кружка
    const k = Math.max(1, Math.floor((size || 120) * .75 / Math.max(c.width, c.height)));
    c.style.width = c.width * k + 'px'; c.style.height = c.height * k + 'px';
    const i = document.createElement('i'); i.appendChild(c); el.appendChild(i);
    return el;
  }

  // картинка самой вещи (без птички): шапка, вещица, пара обуви, шарфик; фон, рамка и анимация — кружок-аватар
  function itemIcon(kind, v, size, id) {
    const box = document.createElement('span'); box.className = 'pp-icon'; box.style.setProperty('--ic', (size || 80) + 'px');
    if (kind === 'bg' || kind === 'frame' || kind === 'anim') { box.appendChild(avatar(id || 2, { [kind]: v }, size || 80)); return box; }
    const { g, put } = hgrid();
    if (kind === 'hat') hdHat(put, SPECIAL_HATS[v] ? { t: v } : pair(v, HATS, HAT_C) || { t: 'top', c: '#2B2340' }, 20, 30);
    else if (kind === 'item' && HD_ITEMS[v]) stamp(put, HD_ITEMS[v].r, 14, 22, HD_ITEMS[v].p);
    else if (kind === 'shoes') { const sh = pair(v, SHOES, SHOE_C); if (sh) { hdShoe(put, sh, 12); hdShoe(put, sh, 22); } }
    else if (kind === 'scarf') hdScarf(put, v, 10, 26, 30, 10);
    const c = crop(finish(g, HW, HH));
    const k = Math.max(2, Math.floor((size || 80) * .62 / Math.max(c.width, c.height)));
    c.style.width = c.width * k + 'px'; c.style.height = c.height * k + 'px';
    box.appendChild(c); return box;
  }

  // картинка вещи, а при наведении (или касании) — птичка в этой вещи
  function giftPic(kind, v, id, size, av) {
    const w = document.createElement('span'); w.className = 'gift-pic';
    w.appendChild(itemIcon(kind, v, size, id));
    if (!['bg', 'frame', 'anim'].includes(kind)) w.classList.add('dual'), w.appendChild(avatar(id, Object.assign({}, av || {}, { [kind]: v }), size));
    w.addEventListener('touchstart', () => w.classList.toggle('show'), { passive: true });
    return w;
  }

  // названия вещей для «Коллекций» (en, ru, lv)
  const GIFT_NAMES = {
    top: ['Top hat', 'Цилиндр', 'Cilindrs'], beret: ['Beret', 'Берет', 'Berete'], cap: ['Cap', 'Кепка', 'Cepure'], bow: ['Bow', 'Бантик', 'Bantīte'], party: ['Party hat', 'Колпак', 'Ballītes cepure'], crown: ['Crown', 'Корона', 'Kronis'],
    heels: ['Heels', 'Туфельки', 'Kurpītes'], sneakers: ['Sneakers', 'Кеды', 'Kedas'], boots: ['Boots', 'Сапожки', 'Zābaciņi'],
    wizard: ['Wizard hat', 'Шляпа волшебника', 'Burvja cepure'], witch: ['Witch hat', 'Шляпа ведьмы', 'Raganas cepure'], pumpkin: ['Pumpkin hat', 'Тыква', 'Ķirbis'], santa: ['Santa hat', 'Колпак Санты', 'Salaveča cepure'],
    antlers: ['Reindeer antlers', 'Рожки оленя', 'Ziemeļbrieža ragi'], beanie: ['Winter beanie', 'Зимняя шапка', 'Ziemas cepure'], heartband: ['Heart headband', 'Ободок с сердцем', 'Sirsniņu stīpiņa'],
    wreath: ['Spring wreath', 'Весенний венок', 'Pavasara vainags'], strawhat: ['Straw hat', 'Летняя шляпа', 'Salmu cepure'], leafcrown: ['Autumn wreath', 'Осенний венок', 'Rudens vainags'], headset: ['Gamer headset', 'Игровые наушники', 'Spēļu austiņas'],
    pizza: ['Pizza slice', 'Кусочек пиццы', 'Picas gabaliņš'], cherry: ['Cherries', 'Вишенки', 'Ķirši'], wand: ['Magic wand', 'Волшебная палочка', 'Burvju nūjiņa'], crystal: ['Crystal ball', 'Хрустальный шар', 'Kristāla bumba'], star: ['Star', 'Звёздочка', 'Zvaigznīte'],
    lollipop: ['Lollipop', 'Леденец', 'Konfekte'], minipumpkin: ['Little pumpkin', 'Тыковка', 'Ķirbītis'], candycane: ['Candy cane', 'Карамельная трость', 'Karameļu spieķītis'], giftbox: ['Present', 'Подарок', 'Dāvana'],
    ornament: ['Ornament', 'Ёлочный шар', 'Eglītes bumba'], snowflake: ['Snowflake', 'Снежинка', 'Sniegpārsliņa'], heart: ['Heart', 'Сердечко', 'Sirsniņa'], rose: ['Rose', 'Роза', 'Roze'], letter: ['Valentine', 'Валентинка', 'Valentīna kartīte'],
    icecream: ['Ice cream', 'Мороженое', 'Saldējums'], mapleleaf: ['Maple leaf', 'Кленовый лист', 'Kļavas lapa'], gamepad: ['Gamepad', 'Геймпад', 'Spēļu pults'], coin: ['Coin', 'Монетка', 'Monēta'], sword: ['Pixel sword', 'Пиксельный меч', 'Pikseļu zobens'],
    mushroom: ['Mushroom', 'Грибок', 'Sēnīte'], cheese: ['Cheese', 'Сыр', 'Siers'], ring: ['Ring', 'Колечко', 'Gredzens'], pearl: ['Pearl', 'Жемчужина', 'Pērle'], ruby: ['Ruby', 'Рубин', 'Rubīns'], sapphire: ['Sapphire', 'Сапфир', 'Safīrs'], key: ['Key', 'Ключик', 'Atslēdziņa'], spoon: ['Spoon', 'Ложечка', 'Karotīte'],
    gold: ['Gold frame', 'Золотая рамка', 'Zelta rāmis'], rainbow: ['Rainbow frame', 'Радуга', 'Varavīksne'], stars: ['Stars', 'Звёзды', 'Zvaigznes'], hearts: ['Hearts', 'Сердечки', 'Sirsniņas'], leaves: ['Leaves', 'Листики', 'Lapiņas'], dotted: ['Dotted', 'Пунктир', 'Punktiņi'],
    snow: ['Snowflakes', 'Снежинки', 'Sniegpārslas'], magic: ['Magic', 'Волшебная', 'Burvju'], spooky: ['Halloween', 'Хеллоуин', 'Helovīns'], neon: ['Neon', 'Неон', 'Neons'],
    bounce: ['Bounces', 'Прыгает', 'Lēkā'], wiggle: ['Wiggles', 'Качается', 'Šūpojas'], float: ['Floats', 'Парит', 'Lidinās'], spin: ['Spins', 'Кружится', 'Griežas'], sparkle: ['Sparkles', 'Сияет', 'Mirdz'], heartbeat: ['Heartbeat', 'Стучит сердечком', 'Sirdspuksti'],
    halo: ['Angel halo', 'Нимб', 'Oreols'], unicorn: ['Unicorn horn', 'Рог единорога', 'Vienradža rags'], flamecrown: ['Phoenix crown', 'Корона феникса', 'Fēniksa kronis'],
    pirate: ['Pirate hat', 'Пиратская шляпа', 'Pirāta cepure'], chef: ['Chef hat', 'Колпак повара', 'Pavāra cepure'], graduation: ['Graduation cap', 'Шапочка выпускника', 'Absolventa cepure'],
    dragonegg: ['Dragon egg', 'Яйцо дракона', 'Pūķa ola'], goldfeather: ['Golden feather', 'Золотое перо', 'Zelta spalva'], comet: ['Comet', 'Комета', 'Komēta'], goldenapple: ['Golden apple', 'Золотое яблоко', 'Zelta ābols'],
    paintbrush: ['Paintbrush', 'Кисточка', 'Ota'], palette: ['Palette', 'Палитра', 'Palete'], pencil: ['Pencil', 'Карандаш', 'Zīmulis'], coffee: ['Coffee', 'Кофе', 'Kafija'], croissant: ['Croissant', 'Круассан', 'Kruasāns'],
    legend: ['Legendary frame', 'Легендарная рамка', 'Leģendārais rāmis'], aurora: ['Aurora glow', 'Северное сияние', 'Ziemeļblāzma'],
    'bg:nightsky': ['Night sky', 'Ночное небо', 'Nakts debesis'], 'bg:hauntedmoon': ['Haunted moon', 'Жуткая луна', 'Spoku mēness'], 'bg:pumpkinpatch': ['Pumpkin patch', 'Тыквенная грядка', 'Ķirbju dobe'],
    'bg:autumnleaves': ['Falling leaves', 'Листопад', 'Lapkritis'], 'bg:rainyday': ['Rainy day', 'Дождливый день', 'Lietaina diena'], 'bg:snowfall': ['Snowfall', 'Снегопад', 'Sniegs krīt'],
    'bg:xmas': ['Christmas lights', 'Праздничная гирлянда', 'Svētku virtene'], 'bg:hearts': ['Sweetheart', 'Сердечный фон', 'Sirsniņu fons'], 'bg:blossom': ['Cherry blossom', 'Цветущая сакура', 'Ziedoša sakura'],
    'bg:beach': ['Beach day', 'Пляж', 'Pludmale'], 'bg:galaxy': ['Galaxy', 'Галактика', 'Galaktika'], 'bg:synthwave': ['Retro arcade', 'Ретро-аркада', 'Retro arkāde'],
    'bg:library': ['Library', 'Библиотека', 'Bibliotēka'], 'bg:cafe': ['Café tablecloth', 'Скатерть в кафе', 'Kafejnīcas galdauts'],
    web: ['Spider web', 'Паутина', 'Zirnekļa tīkls'], candycorn: ['Candy corn', 'Конфеты-кукурузки', 'Konfekšu kukurūza'], bats: ['Bats', 'Летучие мыши', 'Sikspārņi'],
    autumnwreath: ['Leaf wreath', 'Венок из листьев', 'Lapu vainags'], mushrooms: ['Mushroom ring', 'Грибная полянка', 'Sēņu aplis'], flowers: ['Flower crown', 'Цветочный венок', 'Ziedu vainags'],
    canestripe: ['Candy cane frame', 'Карамельная рамка', 'Konfekšu rāmis'], lights: ['Fairy lights', 'Гирлянда', 'Virtene'], pixel: ['8-bit', '8 бит', '8 biti'],
    catears: ['Cat ears', 'Кошачьи ушки', 'Kaķa austiņas'], bubbles: ['Bubbles', 'Пузырьки', 'Burbulīši'], sunrays: ['Sunshine', 'Солнышко', 'Saulīte'],
    clouds: ['Clouds', 'Облака', 'Mākoņi'], jewels: ['Jewels', 'Драгоценности', 'Dārgakmeņi'],
    bg: ['Background', 'Фон', 'Fons'], scarf: ['Scarf', 'Шарфик', 'Šallīte'],
  };
  const giftName = (kind, v, L = 0) => kind === 'anim' && v === 'heart' ? GIFT_NAMES.heartbeat[L] : kind === 'bg' && GIFT_NAMES['bg:' + v] ? GIFT_NAMES['bg:' + v][L] : kind === 'bg' || kind === 'scarf' ? GIFT_NAMES[kind][L] : (GIFT_NAMES[String(v).split(':')[0]] || [v, v, v])[L];

  // темы и сезоны вещей (для кнопок-фильтров в «Коллекциях» и в кабинете): 'вид|значение'
  // легендарные вещи: редкие, в коллекциях с золотой звездой
  const LEGEND = new Set(['hat|halo', 'hat|unicorn', 'hat|flamecrown', 'item|dragonegg', 'item|goldfeather', 'item|comet', 'item|goldenapple', 'frame|legend', 'anim|aurora']);
  const GIFT_THEMES = [
    ['legendary', ['★ Legendary', '★ Легендарные', '★ Leģendārie'], [...LEGEND]],
    ['art', ['🎨 Artist', '🎨 Художник', '🎨 Mākslinieks'], ['hat|beret:0', 'hat|beret:4', 'item|paintbrush', 'item|palette', 'item|pencil', 'scarf|#9B5DE5', 'frame|catears']],
    ['cafe', ['☕ Café', '☕ Кафе', '☕ Kafejnīca'], ['hat|chef', 'item|coffee', 'item|croissant', 'item|pizza', 'item|cheese', 'item|icecream', 'bg|cafe']],
    ['school', ['🎓 Study', '🎓 Учёба', '🎓 Mācības'], ['hat|graduation', 'item|pencil', 'item|letter', 'item|star', 'frame|stars', 'bg|library']],
    ['pirate', ['🏴‍☠️ Pirates', '🏴‍☠️ Пираты', '🏴‍☠️ Pirāti'], ['hat|pirate', 'item|coin', 'item|key', 'item|sword', 'item|ruby', 'scarf|#E0443A', 'frame|jewels']],
    ['magic', ['✨ Magic', '✨ Волшебство', '✨ Burvība'], ['hat|wizard', 'item|wand', 'item|crystal', 'item|star', 'frame|magic', 'frame|stars', 'anim|sparkle', 'bg|galaxy', 'bg|nightsky', 'frame|clouds']],
    ['halloween', ['🎃 Halloween', '🎃 Хеллоуин', '🎃 Helovīns'], ['hat|witch', 'hat|pumpkin', 'item|minipumpkin', 'item|lollipop', 'frame|spooky', 'bg|#1B1035', 'bg|hauntedmoon', 'bg|pumpkinpatch', 'frame|web', 'frame|candycorn', 'frame|bats']],
    ['newyear', ['🎄 New Year', '🎄 Новый год', '🎄 Jaunais gads'], ['hat|santa', 'hat|antlers', 'hat|beanie', 'item|candycane', 'item|giftbox', 'item|ornament', 'item|snowflake', 'frame|snow', 'bg|#E8F4FF', 'scarf|#E0443A', 'scarf|#FFFFFF', 'bg|snowfall', 'bg|xmas', 'frame|canestripe', 'frame|lights']],
    ['valentine', ["💘 Valentine's Day", '💘 День влюблённых', '💘 Valentīndiena'], ['hat|heartband', 'item|heart', 'item|rose', 'item|letter', 'frame|hearts', 'bg|#FFD6E0', 'anim|heart', 'scarf|#F08BC0', 'bg|hearts']],
    ['spring', ['🌸 Spring', '🌸 Весна', '🌸 Pavasaris'], ['hat|wreath', 'item|cherry', 'bg|#CDEBD8', 'bg|#F7C6DA', 'frame|leaves', 'bg|blossom', 'frame|flowers']],
    ['summer', ['☀️ Summer', '☀️ Лето', '☀️ Vasara'], ['hat|strawhat', 'item|icecream', 'item|cherry', 'bg|#FBE3A1', 'bg|#BFD7F5', 'bg|beach', 'frame|bubbles', 'frame|sunrays']],
    ['autumn', ['🍂 Autumn', '🍂 Осень', '🍂 Rudens'], ['hat|leafcrown', 'item|mapleleaf', 'bg|#F2C27B', 'frame|leaves', 'scarf|#D85A30', 'scarf|#E9A93B', 'bg|autumnleaves', 'bg|rainyday', 'bg|pumpkinpatch', 'frame|autumnwreath', 'frame|mushrooms']],
    ['gaming', ['🎮 Gaming', '🎮 Гейминг', '🎮 Spēles'], ['hat|headset', 'item|gamepad', 'item|coin', 'item|sword', 'item|mushroom', 'frame|neon', 'bg|#0F0F2D', 'bg|synthwave', 'frame|pixel']],
  ];
  const GIFT_KINDS = [['hat', ['Hats', 'Головные уборы', 'Galvassegas']], ['item', ['Treats to hold', 'В клюв', 'Knābī']], ['shoes', ['Shoes', 'Обувь', 'Apavi']], ['scarf', ['Scarves', 'Шарфики', 'Šallītes']],
    ['frame', ['Frames', 'Рамки', 'Rāmji']], ['bg', ['Backgrounds', 'Фоны', 'Foni']], ['anim', ['Animations', 'Анимации', 'Animācijas']]];

  window.PPBirds = { looks, sprite, spriteHD, crop, dress, avatar, giftName, itemIcon, giftPic, LEGEND, GIFT_THEMES, GIFT_KINDS, HW, HH, HB, HO, GIFTS, SW, SH, BASE, OX };
})();
