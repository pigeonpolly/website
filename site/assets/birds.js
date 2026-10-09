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
    const c = hat.c, c2 = shade(c, c === '#2B2340' ? 2.2 : .7), t = hat.t;
    if (t === 'top') { for (let x = -3; x <= 3; x++) put(hxR + x, ht, c); for (let y = 1; y <= 4; y++) for (let x = -2; x <= 2; x++) put(hxR + x, ht - y, y === 1 ? c2 : c); }
    if (t === 'beret') { for (let x = -3; x <= 2; x++) put(hxR + x, ht, c); for (let x = -2; x <= 2; x++) put(hxR + x, ht - 1, c); put(hxR, ht - 2, c2); }
    if (t === 'cap') { for (let x = -2; x <= 2; x++) put(hxR + x, ht, c); for (let x = -1; x <= 1; x++) put(hxR + x, ht - 1, c); for (let x = 3; x <= 5; x++) put(hxR + x, ht + 1, c2); put(hxR + 2, ht + 1, c2); }
    if (t === 'bow') { const bx0 = hxR - 2; put(bx0 - 1, ht, c); put(bx0 - 1, ht + 1, c); put(bx0 - 1, ht - 1, c); put(bx0, ht, c2); put(bx0 + 1, ht - 1, c); put(bx0 + 1, ht + 1, c); put(bx0 + 1, ht, c); }
    if (t === 'party') { for (let y = 0; y < 5; y++) for (let x = -2 + Math.ceil(y / 2); x <= 2 - Math.ceil(y / 2); x++) put(hxR + x, ht - y, y % 2 ? c2 : c); put(hxR, ht - 5, '#FFFFFF'); }
    if (t === 'crown') { for (let x = -2; x <= 2; x++) { put(hxR + x, ht, c); put(hxR + x, ht - 1, c); } put(hxR - 2, ht - 2, c); put(hxR, ht - 2, c); put(hxR + 2, ht - 2, c); put(hxR, ht - 1, '#FFFFFF'); }
  }
  function finish(g) {
    const keys = Object.keys(g).filter(k => g[k][0] && g[k][1] !== 'leg');
    for (const k of keys) {
      const [x, y] = k.split(',').map(Number);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = (x + dx) + ',' + (y + dy); if (!g[n]) g[n] = [OUT, 'out']; }
    }
    const c = document.createElement('canvas'); c.width = SW; c.height = SH;
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

  // ---------- подарки-семечки для аватара (выдаёт админ): фон, обувь, головной убор, анимация, рамка ----------
  // значение подарка — короткая строка: hat «crown:1» (вид:цвет), shoes «boots:3», bg «#F5C4B3», anim «bounce», frame «gold»
  const GIFTS = {
    bg: ['#F5C4B3', '#FBE3A1', '#CDEBD8', '#BFD7F5', '#E2D3F7', '#F7C6DA', '#FFFDF8', '#2B1A51', '#1D6B4F', '#D85A30'],
    hat: HATS.flatMap(h => HAT_C.map((c, i) => h + ':' + i)),
    shoes: SHOES.flatMap(h => SHOE_C.map((c, i) => h + ':' + i)),
    anim: ['bounce', 'wiggle', 'float', 'spin', 'sparkle', 'heart'],
    frame: ['gold', 'rainbow', 'stars', 'hearts', 'leaves', 'dotted'],
  };
  const pair = (v, list, cols) => { const [t, i] = String(v || '').split(':'); return list.includes(t) && cols[+i] ? { t, c: cols[+i] } : null; };
  // внешность с надетыми подарками (у котика нет обуви)
  function dress(lk, av) {
    if (!av) return lk;
    const d = Object.assign({}, lk);
    if (av.hat) d.hat = pair(av.hat, HATS, HAT_C) || d.hat;
    if (av.shoes) d.shoe = pair(av.shoes, SHOES, SHOE_C) || d.shoe;
    return d;
  }
  // круглый аватар: фон, рамка, анимация и птичка (крупные пиксели)
  function avatar(id, av, size) {
    av = av || {};
    const el = document.createElement('span');
    el.className = 'pp-ava' + (av.frame ? ' fr-' + av.frame : '') + (av.anim ? ' an-' + av.anim : '');
    el.style.setProperty('--ava', (size || 120) + 'px');
    if (/^#[0-9a-f]{6}$/i.test(av.bg || '')) el.style.setProperty('--ava-bg', av.bg);
    const c = document.createElement('canvas'); c.width = SW; c.height = SH;
    c.getContext('2d').drawImage(sprite(dress(looks(id), av), 0), 0, 0);
    const i = document.createElement('i'); i.appendChild(c); el.appendChild(i);
    return el;
  }

  window.PPBirds = { looks, sprite, dress, avatar, GIFTS, SW, SH, BASE, OX };
})();
