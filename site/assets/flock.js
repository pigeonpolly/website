// «Стая» на главной: каждый, кто хоть раз входил на сайт, — пиксельная птичка со своим ником.
// Внешность выводится из id пользователя и не повторяется (форма × цвет × шляпа × туфли = 28 120 вариантов).
// Птички живут своей жизнью: таскают предметы, клюют, сидят на скамейке, а раз в 10–20 секунд
// что-то случается (перетягивание багета, футбол, книжный клуб, кофе, дискотека, самолётик, сон, доставка еды…).
// Клик по сцене — бросить крошки. Для проверки: PPFlockDebug.run('tug').
(function () {
  const box = document.getElementById('flock');
  if (!box) return;
  const cv = box.querySelector('canvas'), ctx = cv.getContext('2d'), labels = box.querySelector('.fl-labels');
  const lang = document.documentElement.lang || 'en';
  const FIND = {
    en: { here: 'Here it is! 💛', flying: 'Flying in! 🪽', none: 'No bird with this nickname yet.', short: 'Type at least 2 letters.', error: 'Could not search right now.' },
    ru: { here: 'Вот она! 💛', flying: 'Летит к вам! 🪽', none: 'Птички с таким ником пока нет.', short: 'Введите хотя бы 2 буквы.', error: 'Сейчас не получилось поискать.' },
    lv: { here: 'Re, kur viņš! 💛', flying: 'Lido šurp! 🪽', none: 'Putniņa ar tādu segvārdu vēl nav.', short: 'Ievadi vismaz 2 burtus.', error: 'Šobrīd neizdevās meklēt.' },
  };

  const { looks, sprite, SW, BASE } = window.PPBirds;

  // ---------- сцена ----------
  let W = 300, H = 120, S = 3, OFF = 0, props = {}, perches = []; // OFF — лишнее небо сверху на высоком экране (/flock/)
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pickOne = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const X0 = 6, Y0 = 90, Y1 = 128; // где можно ходить
  const cx = x => clamp(x, X0, W - X0), cy = y => clamp(y, Y0, Y1);
  let bg = null;
  const full = !!box.closest('.fl-full'); // отдельная страница /flock/: сцена на всю высоту окна
  function layout() {
    const st = box.querySelector('.fl-stage'), cw = st.clientWidth;
    S = cw >= 900 ? 3 : cw >= 560 ? 2.5 : 2;
    H = 142; OFF = 0;
    if (full) { // сцена во всю высоту окна: птички того же размера, сверху просто больше неба
      if (cw >= 1300) S = 3.5;
      const avail = Math.max(300, innerHeight - Math.max(0, st.getBoundingClientRect().top) - (document.fullscreenElement === box ? 12 : 20));
      if (avail / S < 142) S = Math.max(2, avail / 142);
      H = Math.max(142, Math.floor(avail / S)); OFF = H - 142;
    }
    W = Math.round(cw / S);
    cv.width = W; cv.height = H; cv.style.height = Math.round(H * S) + 'px';
    props = { bin: Math.round(W * .05), bench: Math.round(W * .13), cup: Math.round(W * .13) + 52, bun: Math.round(W * .52), baguette: Math.round(W * .68), book: Math.round(W * .86), lamp: Math.round(W * .955) };
    perches = [{ x: props.bench + 10, y: 66 }, { x: props.bench + 24, y: 66 }, { x: props.bench + 38, y: 66 }, { x: props.bin + 6, y: 62 }].map(p => ({ ...p, by: null }));
    bg = drawBackground();
  }
  function drawBackground() {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
    if (OFF) { // высокое небо: темнее кверху, звёзды и луна
      for (let y = 0; y < OFF; y++) { const k = y / OFF; r(0, y, W, 1, `rgb(${Math.round(24 + 19 * k)},${Math.round(14 + 14 * k)},${Math.round(56 + 26 * k)})`); }
      for (let i = 0; i < W * OFF / 220; i++) r((i * 97) % W, (i * 61) % OFF, 1, 1, i % 4 ? '#F5C4B3' : '#FFFFFF');
      if (OFF > 30) {
        const mx = Math.round(W * .22), my = Math.round(Math.min(OFF * .45, 40)) + 6;
        g.fillStyle = 'rgba(255, 240, 200, .12)'; g.beginPath(); g.arc(mx, my, 14, 0, 7); g.fill();
        g.fillStyle = '#FFF3D6'; g.beginPath(); g.arc(mx, my, 7, 0, 7); g.fill();
        g.fillStyle = '#EFE0BC'; r(mx - 3, my - 2, 2, 2, '#EFE0BC'); r(mx + 2, my + 2, 2, 1, '#EFE0BC');
      }
      g.translate(0, OFF);
    }
    // небо и звёзды
    for (let y = 0; y < 40; y++) r(0, y, W, 1, `rgb(${43 + y},${28 + y * .6},${82 + y * .4})`);
    for (let i = 0; i < W / 9; i++) r((i * 53) % W, (i * 29) % 30, 1, 1, i % 3 ? '#F5C4B3' : '#FFFFFF');
    // кусты
    for (let x = 0; x < W; x += 1) { const h = 12 + Math.round(3 * Math.sin(x / 6) + 2 * Math.sin(x / 2.3)); r(x, 46 - h, 1, h, '#2E5A3C'); r(x, 46 - h, 1, 1, '#3F7550'); }
    for (let i = 0; i < W / 14; i++) r((i * 37) % W, 36 + (i * 7) % 8, 2, 1, '#3F7550');
    // дорожка из плитки
    r(0, 46, W, H - 46, '#C9B79C');
    for (let y = 46; y < H; y += 7) { r(0, y, W, 1, '#B3A184'); for (let x = (y / 7) % 2 ? 0 : 6; x < W; x += 12) r(x, y, 1, 7, '#B3A184'); }
    r(0, 46, W, 2, '#A89577');
    // фонарь (свет рисуется поверх — он мигает на дискотеке и ярче ночью)
    const L = props.lamp;
    r(L - 1, 16, 2, 66, '#2B2340'); r(L - 4, 80, 8, 2, '#2B2340'); r(L - 3, 11, 6, 6, '#2B2340'); r(L - 2, 12, 4, 4, '#FFE7A3'); r(L - 4, 10, 8, 1, '#2B2340');
    // урна
    const B = props.bin;
    r(B, 66, 12, 18, '#2F4F3E'); r(B - 1, 64, 14, 3, '#253F31'); for (let x = B + 2; x < B + 12; x += 3) r(x, 67, 1, 16, '#3F6A53');
    r(B + 3, 61, 4, 3, '#F1EEE6'); r(B + 6, 62, 3, 2, '#D9D3C4'); r(B + 1, 84, 10, 1, 'rgba(0,0,0,.18)');
    // скамейка
    const Bx = props.bench;
    r(Bx + 2, 70, 2, 14, '#2B2340'); r(Bx + 44, 70, 2, 14, '#2B2340'); r(Bx + 2, 52, 2, 18, '#2B2340'); r(Bx + 44, 52, 2, 18, '#2B2340');
    for (const y of [53, 58]) { r(Bx, y, 48, 3, '#9C6B3F'); r(Bx, y, 48, 1, '#B98652'); }
    for (const y of [67, 70]) { r(Bx - 1, y, 50, 3, '#9C6B3F'); r(Bx - 1, y, 50, 1, '#B98652'); }
    r(Bx, 84, 48, 1, 'rgba(0,0,0,.18)');
    return c;
  }

  // ---------- предметы: их можно носить, есть, пинать ----------
  let items = [];
  const free = it => it && !it.gone && !it.held && !it.lock && it.vy == null;
  function makeItems() {
    items = [
      { type: 'bun', x: props.bun + 7, y: 106, bites: 10 },
      { type: 'baguette', x: props.baguette + 15, y: 100, bites: 14 },
      { type: 'book', x: props.book + 8, y: 110 },
      { type: 'cup', x: props.cup + 3, y: 92, full: true },
    ];
    for (const it of items) it.home = { x: it.x, y: it.y };
    for (const [dx, dy] of [[-6, 4], [-3, 7], [18, 5], [10, 8]]) items.push({ type: 'crumb', x: props.bun + dx, y: 100 + dy, bites: 1 });
  }
  const FOOD = ['bun', 'baguette', 'half', 'crumb', 'seed', 'cake', 'slice'];
  const CARRY = ['bun', 'half', 'book', 'cup', 'plane', 'leaf', 'scrap', 'slice', 'letter'];
  function bite(it) {
    if (!it || it.gone || it.held) return;
    it.bites = (it.bites || 1) - 1;
    if (it.bites > 0) return;
    it.gone = true;
    if (it.type !== 'crumb') for (let i = 0; i < 3; i++) items.push({ type: 'crumb', x: cx(it.x + rnd(-6, 6)), y: cy(it.y + rnd(-2, 3)), bites: 1 });
  }
  function crumbsAt(x, n, fromY) {
    for (let i = 0; i < n; i++) items.push({ type: 'crumb', x: cx(x + rnd(-22, 22)), y: fromY + rnd(-8, 0), land: cy(rnd(96, 126)), vy: rnd(10, 30), bites: 1 });
  }

  function drawItem(it, x, y, held) {
    x = Math.round(x); y = Math.round(y);
    const sh = w => { if (!held && it.vy == null) R(x - w / 2, y, w, 1, 'rgba(0,0,0,.18)'); };
    switch (it.type) {
      case 'bun': {
        const s = it.bites > 6 ? 0 : it.bites > 3 ? 1 : 2, w = [14, 10, 6][s];
        R(x - w / 2, y - 6 + s, w, 6 - s, '#D9944A'); R(x - w / 2 + 1, y - 8 + s, w - 2, 2, '#E8A95C'); if (!s) { R(x - 4, y - 9, 8, 1, '#F0C27C'); R(x - 4, y - 7, 2, 1, '#F7D9A3'); R(x + 1, y - 7, 2, 1, '#F7D9A3'); }
        sh(w); break;
      }
      case 'baguette': case 'half': {
        const len = Math.max(6, Math.round((it.type === 'half' ? 14 : 30) * Math.min(1, it.bites / (it.type === 'half' ? 6 : 14))));
        const x0 = x - Math.round(len / 2);
        if (held || it.flat) { for (let i = 0; i < len; i++) { R(x0 + i, y - 3, 1, 3, '#D9944A'); R(x0 + i, y - 3, 1, 1, '#EDB56E'); if (i % 6 === 3) R(x0 + i, y - 2, 2, 1, '#F7D9A3'); } }
        else { for (let i = 0; i < len; i++) { const yy = y - 4 - Math.floor(i / 6); R(x0 + i, yy, 1, 4, '#D9944A'); R(x0 + i, yy, 1, 1, '#EDB56E'); if (i % 6 === 3) R(x0 + i, yy + 1, 2, 1, '#F7D9A3'); } sh(len); }
        break;
      }
      case 'book':
        if (held) { R(x - 5, y - 4, 10, 4, '#B23A48'); R(x - 5, y - 1, 10, 1, '#FFFDF5'); break; }
        R(x - 9, y - 2, 18, 2, '#B23A48'); R(x - 8, y - 6, 8, 4, '#FFFDF5'); R(x, y - 6, 8, 4, '#F3EEDF'); R(x - 1, y - 7, 2, 5, '#C9B79C');
        for (let yy = y - 5; yy < y - 2; yy++) { R(x - 7, yy, 5, 1, '#C8C2D8'); R(x + 2, yy, 5, 1, '#C8C2D8'); }
        if (it.reading) { const p = Math.floor(it.flip || 0) % 8; if (p < 4) R(x - 6 + p * 3, y - 8 + (p === 1 || p === 2 ? -1 : 0), 2, 5, '#FFFFFF'); }
        if (!it.cat) sh(18);
        break;
      case 'cup':
        if (it.tipped) { R(x - 5, y - 6, 9, 6, '#F1EEE6'); R(x - 2, y - 6, 3, 6, '#8A5A3B'); R(x + 4, y - 7, 2, 8, '#3A3550'); if (it.full) R(x - 9, y - 1, 4, 1, '#8A5A3B'); sh(10); break; }
        R(x - 3, y - 9, 6, 9, '#F1EEE6'); R(x - 3, y - 6, 6, 3, it.full ? '#8A5A3B' : '#D9D3C4');
        R(x - 4, y - 11, 8, 2, '#3A3550'); R(x - 1, y - 12, 2, 1, '#3A3550'); if (it.full) R(x - 1, y - 5, 2, 1, '#E9A93B'); sh(6); break;
      case 'crumb': R(x, y - 1, 1, 1, '#F0C27C'); break;
      case 'seed': R(x, y - 1, 2, 1, it.c); break;
      case 'ball': {
        const k = Math.floor(it.spin || 0) % 4;
        R(x - 2, y - 6, 4, 1, '#E0443A'); R(x - 3, y - 5, 6, 4, '#E0443A'); R(x - 2, y - 1, 4, 1, '#E0443A');
        R(x - 3 + k, y - 5, 1, 4, '#FFFFFF'); R(x - 1, y - 5, 1, 1, '#F7A8A0'); sh(5); break;
      }
      case 'plane':
        if (it.fly) { R(x - 4, y, 9, 1, '#FFFFFF'); R(x - 3 * it.dir, y - 1, 4, 1, '#E6E1F2'); R(x - 4 * it.dir, y - 2, 2, 1, '#FFFFFF'); R(x - 2, y + 1, 5, 1, '#C8C2D8'); break; }
        R(x - 4, y - 2, 9, 1, '#FFFFFF'); R(x - 3, y - 1, 7, 1, '#E6E1F2'); sh(8); break;
      case 'cake': {
        const s2 = it.bites > 8 ? 0 : it.bites > 4 ? 1 : 2, w = [14, 10, 6][s2];
        R(x - w / 2, y - 7 + s2, w, 7 - s2, '#F7C6D9'); R(x - w / 2, y - 8 + s2, w, 2, '#FFFDF5');
        for (let i = 0; i < w; i += 3) R(x - w / 2 + i, y - 6 + s2, 1, 1, '#FFFDF5');
        R(x - w / 2, y - 3, w, 1, '#E59BAE');
        if (!s2) { R(x + 3, y - 9, 2, 1, '#E0443A'); if (it.lit != null) { R(x - 1, y - 12, 1, 4, '#4A7BD8'); if (it.lit) R(x - 1, y - 14 - (Math.floor(performance.now() / 150) % 2), 1, 2, '#FFD15C'); } }
        sh(w); break;
      }
      case 'pizza': R(x - 7, y - 4, 14, 4, '#D9944A'); R(x - 6, y - 4, 12, 3, '#F3D06B'); for (const [a, b2] of [[-4, -3], [0, -2], [3, -3], [-2, -2]]) R(x + a, y + b2, 1, 1, '#C0392B'); sh(14); break;
      case 'slice': R(x - 3, y - 3, 6, 1, '#D9944A'); R(x - 2, y - 2, 5, 1, '#F3D06B'); R(x - 1, y - 1, 3, 1, '#F3D06B'); R(x, y - 2, 1, 1, '#C0392B'); sh(5); break;
      case 'letter': R(x - 4, y - 5, 8, 5, '#FFFDF5'); R(x - 3, y - 4, 1, 1, '#C8C2D8'); R(x - 2, y - 3, 1, 1, '#C8C2D8'); R(x + 2, y - 4, 1, 1, '#C8C2D8'); R(x + 1, y - 3, 1, 1, '#C8C2D8'); R(x - 1, y - 3, 2, 2, '#E0443A'); sh(8); break;
      case 'worm': { const ph = performance.now() / 120; for (let i = 0; i < 6; i++) R(x - 3 + i, y - 2 + Math.round(Math.sin(ph + i * 1.2) * .8), 1, 2, i === (it.dir > 0 ? 5 : 0) ? '#D96B8A' : '#F08BA8'); break; }
      case 'yarn': {
        if (it.thread && it.thread.length > 1) for (const [tx, ty] of it.thread) R(tx, ty - 1, 1, 1, '#B98BE8');
        R(x - 2, y - 5, 5, 5, '#9B5DE5'); R(x - 3, y - 4, 7, 3, '#9B5DE5'); R(x - 1, y - 4, 1, 3, '#C8A2F2'); R(x + 1, y - 3, 2, 1, '#C8A2F2'); sh(6); break;
      }
      case 'scrap': R(x - 1, y - 2, 3, 2, '#C8955B'); R(x - 1, y - 2, 3, 1, '#DDB07A'); break;
      case 'bigbox': {
        const w = Math.round(it.w), h = Math.round(it.h), x0 = x - Math.round(w / 2) + Math.round(it.shake || 0), top = y - h;
        R(x0, top, w, h, '#C8955B'); R(x0, top, w, 1, '#DDB07A'); R(x0, top, 1, h, '#B07D45'); R(x0 + w - 1, top, 1, h, '#9C6B3F');
        R(x0 + Math.round(w / 2) - 1, top, 2, h, '#E3C08C'); // скотч
        for (let i = 0; i < 5; i++) { R(x0 - 1 - i, top - i, 1, 1, '#B07D45'); R(x0 + w + i, top - i, 1, 1, '#B07D45'); } // клапаны
        R(x0 + 3, top + h - 5, 6, 1, '#9C6B3F'); R(x0 + 3, top + h - 3, 4, 1, '#9C6B3F'); // «надпись»
        if (it.vy == null) R(x0, y, w, 1, 'rgba(0,0,0,.22)');
        break;
      }
      case 'leaf': R(x - 1, y - 2, 3, 1, it.c); R(x - 2, y - 1, 4, 1, it.c); R(x, y - 3, 1, 1, '#7A4A2A'); break;
      case 'parcel': {
        if (it.vy != null) { // парашют
          R(x - 8, y - 22, 16, 2, '#E0443A'); R(x - 9, y - 20, 18, 2, '#F0A987'); R(x - 6, y - 23, 12, 1, '#E0443A');
          for (const d of [-8, 0, 7]) for (let k = 0; k < 9; k++) R(x + d * (1 - k / 9), y - 18 + k, 1, 1, '#2B2340');
        }
        R(x - 4, y - 7, 9, 7, '#B98652'); R(x - 4, y - 7, 9, 1, '#D2A06B'); R(x, y - 7, 1, 7, '#E0443A'); R(x - 4, y - 4, 9, 1, '#E0443A'); sh(9); break;
      }
    }
  }

  // ---------- эмоции над головой ----------
  const ICON = {
    '!': ['..#..', '..#..', '..#..', '.....', '..#..'],
    '?': ['.###.', '...#.', '..#..', '.....', '..#..'],
    note: ['..##.', '..#.#', '..#..', '###..', '##...'],
    z: ['#####', '...#.', '..#..', '.#...', '#####'],
    heart: ['##.##', '#####', '#####', '.###.', '..#..'],
    dots: ['.....', '.....', '#.#.#', '.....', '.....'],
    drop: ['..#..', '.###.', '#####', '#####', '.###.'],
    star: ['..#..', '#.#.#', '.###.', '#.#.#', '..#..'],
  };
  const ICON_C = { '!': '#E0443A', '?': '#534AB7', note: '#534AB7', z: '#4A7BD8', heart: '#F06A9A', dots: '#2B1A51', drop: '#4A7BD8', star: '#E9A93B' };
  function drawEmote(x, y, icon, a) {
    ctx.globalAlpha = clamp(a, 0, 1);
    x = Math.round(x); y = Math.round(y);
    R(x - 4, y - 8, 9, 7, '#FFFDF5'); R(x - 3, y - 9, 7, 1, '#FFFDF5'); R(x - 3, y - 1, 7, 1, '#FFFDF5'); R(x - 1, y, 2, 1, '#FFFDF5');
    ICON[icon].forEach((row, yy) => [...row].forEach((ch, xx) => { if (ch === '#') R(x - 2 + xx, y - 8 + yy, 1, 1, ICON_C[icon]); }));
    ctx.globalAlpha = 1;
  }

  // ---------- птички: у каждой очередь маленьких дел ----------
  let birds = [], last = 0, party = false;
  const HAT_COLORS = [['#E0443A', '#FFE7A3'], ['#4A7BD8', '#F7C6D9'], ['#4CC38A', '#FFFFFF'], ['#9B5DE5', '#E9A93B'], ['#F08BC0', '#4A7BD8']];
  const say = (b, icon, t = 1.6) => { b.emote = { icon, t, max: t }; };
  const freeBirds = (pred = () => true) => birds.filter(b => !b.ev && !b.perch && !b.hop && pred(b));
  const isBird = b => !b.cat && !b.crow;
  // верхняя точка спрайта (макушка) — сюда садится праздничный колпак
  function headOf(c) {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    for (let y = 0; y < c.height; y++) { const xs = []; for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 0) xs.push(x); if (xs.length) return { x: xs[Math.floor(xs.length / 2)], y }; }
    return { x: c.width / 2, y: 0 };
  }
  let guests = []; // найденные по нику — остаются в сцене и после перестройки
  const cap = () => full ? Math.min(60, Math.max(12, Math.floor(W / (W < 260 ? 9 : 6.5)))) : Math.max(8, Math.floor(W / (W < 260 ? 13 : 9)));
  function makeBirds(list) {
    labels.innerHTML = '';
    const ids = new Set(guests.map(g => g.id));
    const me = list.filter(u => u.me);
    list = [...me, ...guests.filter(g => !me.some(m => m.id === g.id)), ...list.filter(u => !u.me && !ids.has(u.id))];
    birds = list.slice(0, cap()).map(makeBird);
  }
  function makeBird(u) {
    {
      const lk = looks(u.id);
      const b = { u, cat: lk.kind === 'cat', crow: lk.kind === 'crow', frames: [0, 1, 2].map(f => sprite(lk, f)), hat: null, x: rnd(10, W - 10), y: rnd(Y0, Y1), dir: Math.random() < .5 ? 1 : -1,
        tasks: [], goal: null, wait: rnd(.3, 3), pose: 'idle', anim: rnd(0, 5), speed: lk.kind === 'cat' ? rnd(6, 9) : rnd(9, 15), fast: 1, perch: null, hold: null, emote: null, ev: null };
      b.heads = b.frames.map(headOf);
      if (party) b.hat = pickOne(HAT_COLORS);
      if (u.nick) {
        const a = document.createElement('a');
        a.className = 'fl-nick' + (u.me ? ' me' : '');
        a.href = (lang === 'en' ? '' : '/' + lang) + '/challenge/#@' + encodeURIComponent(u.nick);
        a.textContent = (u.me ? '★ ' : '') + '@' + u.nick;
        labels.appendChild(a); b.label = a;
      }
      return b;
    }
  }
  // встать рядом с предметом, лицом к нему
  const beside = (b, it, gap = 8) => { const side = b.x < it.x ? -1 : 1; return { x: cx(it.x + side * gap), y: cy(it.y), face: -side }; };
  function fetchTo(b, it, x, y, fast = 1) { // подойти, взять, отнести, положить
    const p = beside(b, it);
    b.tasks.push({ go: p, fast }, { face: p.face }, { pick: it }, { go: { x: cx(x), y: cy(y) }, fast }, { drop: true }, { wait: rnd(.6, 1.6) });
  }
  function nextTask(b) {
    while (b.tasks.length) {
      const t = b.tasks.shift();
      if (t.go) { b.goal = t.go; b.fast = t.fast || 1; b.pose = 'walk'; return; }
      if (t.wait != null) { b.wait = t.wait; b.pose = t.pose || 'idle'; return; }
      if (t.hop) { b.hop = { from: { x: b.x, y: b.y }, to: t.hop, t: 0, dur: t.dur || .55, h: t.h ?? 16 }; return; }
      if (t.face) b.dir = t.face;
      if (t.say) say(b, t.say, t.t);
      if (t.pick) { if (free(t.pick) && Math.abs(t.pick.x - b.x) < 16) { t.pick.held = b; b.hold = t.pick; } else { b.tasks = []; if (b.ev) return; break; } }
      if (t.drop && b.hold) drop(b);
      if (t.fn) t.fn(b);
    }
    if (!b.ev) ambient(b);
  }
  function drop(b) {
    const it = b.hold; if (!it) return;
    it.held = null; it.x = cx(b.x + b.dir * 8); it.y = cy(b.y + 1); it.flat = false; b.hold = null;
  }
  // обычная жизнь, когда ничего не происходит
  function ambient(b) {
    const r = Math.random();
    const freePerch = perches.filter(p => !p.by);
    if (r < .12 && freePerch.length && !b.hold) {
      const p = pickOne(freePerch); p.by = b;
      b.tasks.push({ hop: { x: p.x, y: p.y } }, { fn: () => { b.perch = p; } }, { wait: rnd(4, 10), pose: 'sit' },
        { fn: () => { p.by = null; b.perch = null; } }, { hop: { x: cx(b.x + rnd(-10, 10)), y: rnd(Y0, 104) } });
      return;
    }
    if (r < .26 && isBird(b)) { // переложить что-нибудь на новое место
      const it = pickOne(items.filter(i => free(i) && CARRY.includes(i.type)));
      if (it) { fetchTo(b, it, rnd(X0, W - X0), rnd(Y0 + 4, Y1)); if (Math.random() < .3) b.tasks.unshift({ say: 'note' }); return; }
    }
    const seeds = !b.cat && items.filter(i => i.type === 'seed' && free(i));
    if (seeds && seeds.length && r < .85) { feast(b); return; }
    if (r < .58 && !b.cat) { // поесть
      const food = items.filter(i => free(i) && FOOD.includes(i.type));
      const it = pickOne(food.sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y)).slice(0, 3));
      if (it) { const p = beside(b, it, it.type === 'crumb' ? 4 : 9); b.tasks.push({ go: p }, { face: p.face }, { wait: rnd(1.5, 4), pose: 'peck' }, { fn: () => { if (Math.abs(it.x - b.x) < 16) bite(it); } }); return; }
    }
    if (r < .66 && b.cat) { // котик идёт посидеть рядом с другом
      const o = pickOne(birds.filter(x => !x.cat && !x.perch && !x.ev));
      if (o) { b.tasks.push({ go: { x: cx(o.x + (Math.random() < .5 ? -12 : 12)), y: cy(o.y + rnd(-3, 3)) } }, { wait: rnd(3, 7), pose: 'sit' }); return; }
    }
    b.tasks.push({ go: { x: rnd(X0, W - X0), y: rnd(Y0, Y1) } }, { wait: rnd(.8, 3.5) });
  }

  // котики дружат с птичками: когда рядом — сердечки
  let hearts = [];
  function friends(dt) {
    for (const c of birds) {
      if (!c.cat || c.hop || c.inBox) continue;
      for (const o of birds) {
        if (o.cat || o.hop || o.inBox || Math.abs(o.x - c.x) > 18 || Math.abs(o.y - c.y) > 8) continue;
        if (Math.random() < dt * .35) hearts.push({ x: (o.x + c.x) / 2 + rnd(-3, 3), y: Math.min(o.y, c.y) - 24, life: 1.8 });
      }
    }
    hearts = hearts.filter(h => (h.life -= dt) > 0).slice(-12);
    for (const h of hearts) h.y -= dt * 7;
  }

  function stepBird(b, dt) {
    b.anim += dt;
    if (b.found > 0 && (b.found -= dt) <= 0) { b.found = 0; if (b.label) b.label.classList.remove('found'); }
    if (b.emote && (b.emote.t -= dt) <= 0) b.emote = null;
    if (b.hop) {
      const h = b.hop; h.t += dt / h.dur;
      const t = Math.min(1, h.t);
      if (h.to.x !== h.from.x) b.dir = h.to.x > h.from.x ? 1 : -1;
      b.x = h.from.x + (h.to.x - h.from.x) * t;
      b.y = h.from.y + (h.to.y - h.from.y) * t - Math.sin(t * Math.PI) * h.h;
      if (t >= 1) { b.y = h.to.y; b.hop = null; b.pose = b.perch ? 'sit' : 'idle'; }
      return;
    }
    if (b.ctl) return; // событие само двигает птичку
    if (b.goal) {
      const dx = b.goal.x - b.x, dy = b.goal.y - b.y, d = Math.hypot(dx, dy);
      if (d < 1) { b.goal = null; b.pose = 'idle'; }
      else { if (Math.abs(dx) > .3) b.dir = dx >= 0 ? 1 : -1; const v = Math.min(d, b.speed * b.fast * dt); b.x += dx / d * v; b.y += dy / d * v; b.pose = 'walk'; if (puddles.length && Math.random() < dt * 6 && puddles.some(p => p.a > .4 && ((b.x - p.x) / p.r) ** 2 + ((b.y - p.y) / (p.r * .35)) ** 2 < 1)) fx.push({ type: 'splash', x: b.x, y: b.y, t: .3 }); return; }
    }
    if (b.wait > 0) { b.wait -= dt; if (b.pose === 'idle' && Math.random() < dt * .3) b.dir *= -1; if (b.wait > 0) return; }
    nextTask(b);
  }

  // ---------- события ----------
  let ev = null, evIn = rnd(6, 10), night = 0, disco = 0, fx = [], gloom = 0, puddles = [];
  function release(list) { for (const b of list) { if (b.hold) drop(b); b.ev = null; b.ctl = false; b.tasks = []; b.goal = null; b.wait = rnd(.3, 1.2); b.pose = 'idle'; } }
  const done = list => list.every(b => !b.tasks.length && !b.goal && !b.hop && b.wait <= 0);
  const enlist = (list, e) => { for (const b of list) { if (b.hold) drop(b); if (b.perch) { b.perch.by = null; b.perch = null; } b.ev = e; b.tasks = []; b.goal = null; b.wait = 0; b.ctl = false; } };
  const closest = (list, x, n) => [...list].sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x)).slice(0, n);
  const hop = (b, h, dur) => { b.hop = { from: { x: b.x, y: b.y }, to: { x: b.x, y: b.y }, t: 0, dur, h }; };
  const missing = () => !items.some(i => !i.gone && i.type === 'bun') || !items.some(i => !i.gone && (i.type === 'baguette' || i.type === 'half')) || items.some(i => i.type === 'cup' && !i.full && !i.gone && (i.emptyFor || 0) > 40);

  const EVENTS = {
    // двое тянут багет: он ломается пополам или кто-то побеждает и убегает с ним
    tug: {
      ok: () => items.some(i => i.type === 'baguette' && free(i)) && freeBirds(isBird).length >= 2, w: 3,
      start(e) {
        const it = e.it = items.find(i => i.type === 'baguette' && free(i));
        it.lock = true;
        const [A, B] = closest(freeBirds(isBird), it.x, 2); e.A = A; e.B = B; enlist([A, B], e);
        e.cx = clamp(it.x, 30, W - 30); e.y = cy(it.y);
        A.tasks.push({ go: { x: e.cx - 19, y: e.y } }, { face: 1 }, { say: '!' }); B.tasks.push({ go: { x: e.cx + 19, y: e.y } }, { face: -1 }, { say: '!' });
        e.phase = 'gather';
      },
      update(e, dt) {
        const { A, B, it } = e;
        if (e.phase === 'gather') { if (done([A, B])) { e.phase = 'pull'; e.t = 0; e.dur = rnd(3, 6); e.drift = 0; A.ctl = B.ctl = true; it.held = 'ev'; it.flat = true; } return; }
        if (e.phase === 'pull') {
          e.t += dt; e.drift = clamp(e.drift + rnd(-1, 1) * dt * 30, -7, 7);
          const off = Math.sin(e.t * 9) * 1.5 + e.drift;
          A.x = e.cx - 19 + off; B.x = e.cx + 19 + off; A.y = B.y = e.y; it.x = e.cx + off; it.y = e.y - 9;
          A.pose = B.pose = 'walk'; A.anim += dt * 2; B.anim += dt * 2;
          if (Math.random() < dt * .8) say(Math.random() < .5 ? A : B, pickOne(['!', 'drop']), 1);
          if (e.t < e.dur) return;
          A.ctl = B.ctl = false; e.phase = 'after'; it.lock = false;
          if (Math.random() < .45) { // хрусть! две половинки и крошки во все стороны
            it.gone = true; it.held = null;
            const h1 = { type: 'half', x: it.x, y: e.y, bites: 6 }, h2 = { type: 'half', x: it.x, y: e.y, bites: 6 };
            items.push(h1, h2); h1.held = A; A.hold = h1; h2.held = B; B.hold = h2;
            for (let i = 0; i < 7; i++) items.push({ type: 'crumb', x: it.x + rnd(-4, 4), y: e.y - 10, land: cy(e.y + rnd(-4, 8)), vy: rnd(-25, -5), vx: rnd(-30, 30), bites: 1 });
            fx.push({ type: 'snap', x: it.x, y: e.y - 12, t: .6 });
            A.tasks.push({ hop: { x: cx(A.x - 12), y: A.y }, h: 6, dur: .4 }, { say: '!' }, { wait: .6 }, { go: { x: rnd(X0, W / 2), y: rnd(Y0, Y1) } }, { drop: true }, { wait: rnd(2, 4), pose: 'peck' });
            B.tasks.push({ hop: { x: cx(B.x + 12), y: B.y }, h: 6, dur: .4 }, { say: '!' }, { wait: .6 }, { go: { x: rnd(W / 2, W - X0), y: rnd(Y0, Y1) } }, { drop: true }, { wait: rnd(2, 4), pose: 'peck' });
          } else {
            const [win, lose] = Math.random() < .5 ? [A, B] : [B, A];
            it.held = win; win.hold = it; it.flat = false;
            const away = win === A ? -1 : 1, tx = cx(win.x + away * rnd(60, 110));
            lose.tasks.push({ hop: { x: cx(lose.x - away * 8), y: lose.y }, h: 5, dur: .35 }, { say: 'drop', t: 1.4 }, { wait: .8 }, { say: '?' }, { go: { x: cx(tx - away * 14), y: win.y }, fast: 1.3 }, { wait: 1.5 });
            win.tasks.push({ say: 'note' }, { go: { x: tx, y: win.y }, fast: 1.7 }, { drop: true }, { wait: 2, pose: 'peck' });
          }
          return;
        }
        if (done([A, B])) return true;
      },
      end(e) { e.it.lock = false; if (e.it.held === 'ev') e.it.held = null; e.it.flat = false; },
    },
    // кто-то бросил крошки — все бегут
    crumbs: { ok: () => true, w: 2, start(e) { scatter(rnd(W * .2, W * .8)); e.t = 0; }, update(e, dt) { return (e.t += dt) > 4; } },
    // футбол
    football: {
      ok: () => freeBirds().length >= 3, w: 3,
      start(e) {
        const from = Math.random() < .5 ? -1 : 1;
        e.ball = e.at ? { type: 'ball', x: e.at.x, y: e.at.y, bv: { x: rnd(-40, 40), y: rnd(-10, 10) }, spin: 0, lock: true } : { type: 'ball', x: from < 0 ? -4 : W + 4, y: rnd(100, 120), bv: { x: -from * rnd(45, 60), y: rnd(-8, 8) }, spin: 0, lock: true };
        items.push(e.ball);
        e.team = closest(freeBirds(), e.ball.x, Math.min(6, Math.max(3, Math.floor(birds.length / 2)))); enlist(e.team, e);
        for (const b of e.team) { say(b, '!', 1); b.ctl = true; b.cool = rnd(0, 1); }
        e.t = 0; e.dur = rnd(16, 24);
      },
      update(e, dt) {
        const ball = e.ball, v = ball.bv; e.t += dt;
        for (const b of e.team) {
          if (!b.ctl) continue;
          b.cool -= dt; b.anim += dt;
          if (b.hop) continue;
          const tx = ball.x - Math.sign(v.x || 1) * 3, ty = ball.y;
          const dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy);
          if (d > 2) { b.dir = dx >= 0 ? 1 : -1; const s = Math.min(d, b.speed * 1.6 * dt); b.x = cx(b.x + dx / d * s); b.y = cy(b.y + dy / d * s); b.pose = 'walk'; }
          else b.pose = 'idle';
          if (Math.hypot(ball.x - b.x, ball.y - b.y) < 7 && b.cool <= 0) {
            const ang = rnd(-.6, .6) + (Math.random() < .5 ? 0 : Math.PI), sp = rnd(45, 85);
            v.x = Math.cos(ang) * sp; v.y = Math.sin(ang) * sp * .5; b.cool = rnd(1, 2);
            if (Math.random() < .35) say(b, pickOne(['!', 'star', 'note']), 1);
            if (Math.random() < .25) hop(b, 6, .35);
          }
        }
        const out = e.t > e.dur;
        ball.x += v.x * dt; ball.y += v.y * dt; ball.spin += Math.abs(v.x) * dt * .3;
        v.x *= Math.pow(.55, dt); v.y *= Math.pow(.55, dt);
        if (ball.y < Y0) { ball.y = Y0; v.y = Math.abs(v.y); } if (ball.y > Y1 + 2) { ball.y = Y1 + 2; v.y = -Math.abs(v.y); }
        if (!out && e.t > 1.5) { if (ball.x < 4) { ball.x = 4; v.x = Math.abs(v.x); } if (ball.x > W - 4) { ball.x = W - 4; v.x = -Math.abs(v.x); } }
        if (out && !e.kicked) { e.kicked = true; v.x = ball.x < W / 2 ? -110 : 110; for (const b of e.team) { b.ctl = false; say(b, pickOne(['?', 'drop']), 1.4); b.tasks.push({ wait: rnd(1, 2) }); } }
        if (e.kicked && (ball.x < -10 || ball.x > W + 10)) { ball.gone = true; return done(e.team); }
      },
      end(e) { e.ball.gone = true; },
    },
    // книжный клуб: одна читает, остальные слушают; в конце — неожиданный поворот сюжета!
    bookclub: {
      ok: () => items.some(i => i.type === 'book' && free(i)) && freeBirds(isBird).length >= 3, w: 2,
      start(e) {
        const book = e.book = items.find(i => i.type === 'book' && free(i)); book.lock = true;
        book.x = clamp(book.x, 20, W - 24); book.y = clamp(book.y, Y0 + 4, Y1 - 10);
        const club = closest(freeBirds(isBird), book.x, 4); enlist(club, e); e.club = club;
        const [reader, ...rest] = club; e.reader = reader;
        reader.tasks.push({ go: { x: book.x - 13, y: book.y } }, { face: 1 });
        const spots = [[14, -2], [7, 9], [-5, 10], [17, 8]];
        rest.forEach((b, i) => b.tasks.push({ go: { x: cx(book.x + spots[i][0]), y: cy(book.y + spots[i][1]) } }, { face: -1 }));
        e.t = 0;
      },
      update(e, dt) {
        e.t += dt;
        if (!done(e.club)) return e.t > 20;
        e.read = (e.read || 0) + dt; e.book.reading = true; e.book.flip = (e.book.flip || 0) + dt * 2.5;
        if (Math.random() < dt * .7) say(e.reader, 'dots', 1.2);
        if (e.read > 7 && !e.twist) {
          e.twist = true; say(e.reader, '!', 1.8);
          for (const b of e.club) if (b !== e.reader) { say(b, '!', 1.6); hop(b, 8, .4); }
        }
        if (e.read > 10) return true;
      },
      end(e) { e.book.reading = false; e.book.lock = false; },
    },
    // кофе: глоток — и птичка носится как ракета, а потом засыпает
    coffee: {
      ok: () => items.some(i => i.type === 'cup' && i.full && free(i)) && freeBirds(isBird).length >= 1, w: 2,
      start(e) {
        const cup = e.cup = items.find(i => i.type === 'cup' && i.full && free(i)); cup.lock = true;
        const [b] = closest(freeBirds(isBird), cup.x, 1); e.b = b; enlist([b], e);
        const p = beside(b, cup, 7);
        b.tasks.push({ go: p }, { face: p.face }, { fn: () => { cup.tipped = true; } }, { wait: 1.6, pose: 'peck' },
          { fn: () => { cup.full = false; cup.tipped = false; cup.emptyFor = 0; cup.lock = false; } }, { say: 'star', t: 1 });
        for (let i = 0; i < 7; i++) b.tasks.push({ go: { x: rnd(X0, W - X0), y: rnd(Y0, Y1) }, fast: 4 }, { say: pickOne(['!', 'star']), t: .5 });
        b.tasks.push({ wait: 4, pose: 'sleep' }, { say: '?' });
      },
      update(e) { return done([e.b]); },
      end(e) { e.cup.lock = false; e.cup.tipped = false; },
    },
    // дискотека у фонаря
    dance: {
      ok: () => freeBirds().length >= 3, w: 2,
      start(e) { e.list = freeBirds(); enlist(e.list, e); for (const b of e.list) b.tasks.push({ wait: rnd(7, 9), pose: 'dance' }); },
      update(e, dt) {
        disco = Math.min(1, disco + dt);
        if (Math.random() < dt * 3) { const b = pickOne(e.list); fx.push({ type: 'note', x: b.x + rnd(-4, 4), y: b.y - 24, t: 1.6 }); }
        if (done(e.list)) return true;
      },
      end() { disco = 0; },
    },
    // бумажный самолётик пролетает и садится — кто-нибудь его ловит
    plane: {
      ok: () => freeBirds(isBird).length >= 1, w: 2,
      start(e) {
        const dir = Math.random() < .5 ? 1 : -1;
        e.x0 = dir > 0 ? -6 : W + 6;
        e.p = { type: 'plane', fly: true, dir, x: e.x0, y: 40, lock: true, held: 'ev' };
        e.land = { x: rnd(W * .25, W * .75), y: rnd(Y0 + 6, Y1 - 4) };
        items.push(e.p);
        e.fans = closest(freeBirds(isBird), e.land.x, 2); enlist(e.fans, e);
        for (const b of e.fans) b.tasks.push({ say: '!' }, { wait: .4 });
        e.t = 0;
      },
      update(e, dt) {
        const p = e.p; e.t += dt;
        if (p.fly) {
          const k = Math.min(1, e.t / (Math.abs(e.land.x - e.x0) / 38));
          p.x = e.x0 + (e.land.x - e.x0) * k;
          p.y = 40 + (e.land.y - 40) * k * k + Math.sin(e.t * 4) * 3 * (1 - k);
          for (const b of e.fans) if (!b.goal && !b.tasks.length && !b.hop && b.wait <= 0) b.goal = { x: cx(p.x - p.dir * 7), y: cy(e.land.y) };
          if (k >= 1) {
            p.fly = false; p.held = null; p.lock = false; p.y = e.land.y;
            const c = closest(e.fans, p.x, 1)[0];
            if (c && Math.abs(c.x - p.x) < 14) { c.goal = null; c.tasks = [{ face: p.x > c.x ? 1 : -1 }, { pick: p }, { say: 'note' }, { hop: { x: c.x, y: c.y }, h: 8, dur: .4 }, { go: { x: rnd(X0, W - X0), y: rnd(Y0, Y1) } }, { drop: true }, { wait: 1 }]; }
            for (const b of e.fans) if (b !== c) { b.goal = null; b.tasks.push({ say: '?' }, { wait: 1 }); }
          }
          return;
        }
        if (done(e.fans) || e.t > 30) return true;
      },
      end(e) { e.p.fly = false; if (e.p.held === 'ev') e.p.held = null; e.p.lock = false; },
    },
    // ночь: все засыпают, фонарь светит ярче
    nap: {
      ok: () => true, w: 1,
      start(e) {
        e.list = birds.filter(b => !b.ev && !b.hop);
        e.perched = e.list.filter(b => b.perch);
        enlist(e.list.filter(b => !b.perch), e);
        for (const b of e.perched) { b.ev = e; b.tasks = []; b.goal = null; b.wait = 0; }
        for (const b of e.list) b.tasks.push({ wait: rnd(9, 11), pose: 'sleep' });
        e.t = 0;
      },
      update(e, dt) {
        e.t += dt; night = e.t < 2 ? Math.min(1, night + dt / 2) : e.t > 9 ? Math.max(0, night - dt / 2) : night;
        for (const b of e.list) if (b.pose === 'sleep' && !b.emote && Math.random() < dt * .8) say(b, 'z', 1.2);
        if (e.t > 11) { for (const b of e.list) if (Math.random() < .5) say(b, '!', .8); return true; }
      },
      end(e) {
        night = 0;
        for (const b of e.perched) if (b.perch) { const p = b.perch; b.ev = null; b.tasks = [{ wait: rnd(1, 3), pose: 'sit' }, { fn: () => { p.by = null; b.perch = null; } }, { hop: { x: cx(b.x + rnd(-10, 10)), y: rnd(Y0, 104) } }]; b.wait = 0; }
      },
    },
    // аккуратистка возвращает вещи на место (и ворчит)
    tidy: {
      ok: () => messy().length >= 1 && freeBirds(isBird).length >= 1, w: 2,
      start(e) {
        const list = messy().slice(0, 3);
        const b = e.b = pickOne(freeBirds(isBird)); enlist([b], e);
        b.tasks.push({ say: 'drop', t: 1.4 }, { wait: .8 });
        for (const it of list) { fetchTo(b, it, it.home.x, it.home.y); b.tasks.push({ say: pickOne(['!', 'dots']), t: 1 }); }
        b.tasks.push({ say: 'star' }, { wait: 1.5 });
      },
      update(e) { return done([e.b]); },
    },
    // доставка: посылка на парашюте, внутри — свежая булка, багет и кофе
    delivery: {
      ok: () => missing(), w: 6,
      start(e) {
        e.box = { type: 'parcel', x: rnd(W * .3, W * .75), y: -10 - OFF, vy: 30 + OFF * .2, lock: true, held: 'ev' };
        e.land = rnd(104, 118); items.push(e.box); e.t = 0;
        // по кнопке — всегда сюрприз, сама по себе — иногда
        if (e.force || Math.random() < .45) e.kind = pickOne(Object.keys(SURPRISES));
      },
      update(e, dt) {
        const p = e.box; e.t += dt;
        if (p.vy != null) {
          p.y += p.vy * dt; p.x += Math.sin(e.t * 2) * dt * 6;
          if (p.y >= e.land) {
            p.y = e.land; p.vy = null; e.landed = e.t;
            for (const b of closest(freeBirds(), p.x, 4)) { say(b, '!', 1.2); b.tasks = [{ go: { x: cx(p.x + rnd(-20, 20)), y: cy(p.y + rnd(-8, 8)) }, fast: 1.4 }, { wait: 2 }]; b.goal = null; b.wait = 0; }
          }
          return;
        }
        if (e.t - e.landed > 1.5 && !p.gone) {
          p.gone = true; fx.push({ type: 'poof', x: p.x, y: p.y - 4, t: .6 });
          if (!items.some(i => !i.gone && i.type === 'bun') || (e.force && items.filter(i => !i.gone && i.type === 'bun').length < 3)) items.push({ type: 'bun', x: cx(p.x - 10), y: p.y, bites: 10, home: { x: props.bun + 7, y: 106 } });
          if (!items.some(i => !i.gone && (i.type === 'baguette' || i.type === 'half'))) items.push({ type: 'baguette', x: cx(p.x + 12), y: p.y - 2, bites: 14, home: { x: props.baguette + 15, y: 100 } });
          const cup = items.find(i => i.type === 'cup' && !i.gone); if (cup && !cup.full) { cup.full = true; cup.emptyFor = 0; }
          if (e.kind) { for (const b of birds) if (b.ev === e) { b.ev = null; } e.sur = SURPRISES[e.kind]; e.sur.start(e, cx(p.x), cy(p.y)); }
        }
        if (e.sur && p.gone) return e.sur.update(e, dt);
        if (e.t - e.landed > 2.5) return true;
      },
      end(e) { e.box.gone = true; e.box.held = null; if (e.sur && e.sur.end) e.sur.end(e); for (const b of birds) if (b.balloon) b.balloon = null; },
    },
    // котик укладывается спать прямо на книгу
    catbook: {
      ok: () => birds.some(b => b.cat && !b.ev && !b.perch && !b.hop) && items.some(i => i.type === 'book' && free(i)), w: 2,
      start(e) {
        const book = e.book = items.find(i => i.type === 'book' && free(i)); book.lock = true;
        const c = e.c = pickOne(birds.filter(b => b.cat && !b.ev && !b.perch && !b.hop)); enlist([c], e);
        c.tasks.push({ go: { x: book.x, y: book.y } }, { fn: () => { book.cat = true; } }, { wait: 9, pose: 'sleep' }, { fn: () => { book.cat = false; } }, { go: { x: cx(book.x + rnd(-30, 30)), y: rnd(Y0, Y1) } });
        e.fans = closest(freeBirds(isBird), book.x, 2); enlist(e.fans, e);
        e.fans.forEach((b, i) => b.tasks.push({ wait: rnd(2, 3) }, { go: { x: cx(book.x + (i ? 16 : -16)), y: cy(book.y + 2) } }, { face: i ? -1 : 1 }, { say: '?', t: 1.5 }, { wait: 3 }, { say: 'heart', t: 1.5 }, { wait: 1.5 }));
      },
      update(e) { return done([e.c, ...e.fans]); },
      end(e) { e.book.lock = false; e.book.cat = false; },
    },
  };
  Object.assign(EVENTS, {
    // сильный ветер: всех сдувает, листья и крошки улетают, стаканчик падает
    wind: {
      ok: () => true, w: 1,
      start(e) {
        e.dir = Math.random() < .5 ? 1 : -1; e.t = 0; e.dur = rnd(7, 9);
        e.list = freeBirds(); enlist(e.list, e);
        for (const b of e.list) { b.ctl = true; say(b, pickOne(['!', 'drop']), 1.2); }
        for (const b of birds) if (b.perch && !b.ev) say(b, '!', 1.5);
      },
      update(e, dt) {
        e.t += dt; const s = clamp(Math.min(e.t / 1.5, (e.dur - e.t) / 1.5), 0, 1);
        if (Math.random() < dt * 25 * s) fx.push({ type: 'gust', x: e.dir > 0 ? rnd(-30, W * .3) : rnd(W * .7, W + 30), y: rnd(4 - OFF, 136), vx: e.dir * rnd(140, 220), len: rnd(6, 16), t: 1.4 });
        if (Math.random() < dt * 4 * s) fx.push({ type: 'leaf', x: e.dir > 0 ? -4 : W + 4, y: rnd(20, 120), vx: e.dir * rnd(70, 110), vy: rnd(-6, 6), land: H + 50, c: pickOne(['#E9A93B', '#C0582F', '#D9944A', '#4CC38A']), t: 6, ph: rnd(0, 6), item: true });
        for (const b of e.list) {
          if (b.hop) continue;
          b.dir = -e.dir; b.pose = 'walk'; b.anim += dt * .3;
          b.x = cx(b.x + e.dir * s * dt * (b.cat ? 3 : 9));
          if (!b.cat && Math.random() < dt * .35 * s) { say(b, '!', .8); b.hop = { from: { x: b.x, y: b.y }, to: { x: cx(b.x + e.dir * rnd(18, 40)), y: cy(b.y + rnd(-6, 6)) }, t: 0, dur: .6, h: 10 }; }
        }
        for (const it of items) {
          if (it.held || it.vy != null) continue;
          const v = { leaf: 70, plane: 55, crumb: 22, seed: 16 }[it.type];
          if (v) { it.x += e.dir * s * v * dt * rnd(.6, 1.2); if (it.x < -10 || it.x > W + 10) it.gone = true; }
          if (it.type === 'cup' && s > .8 && !it.tipped && !it.lock) { it.tipped = true; if (it.full) { it.full = false; it.emptyFor = 0; } }
        }
        return e.t >= e.dur;
      },
      end() { for (const it of items) if (it.type === 'cup' && !it.lock) it.tipped = false; },
    },
    // дождь: все прячутся под скамейку, остаются лужи
    rain: {
      ok: () => true, w: 1,
      start(e) {
        e.t = 0; e.dur = rnd(9, 12);
        e.list = freeBirds(); enlist(e.list, e);
        const B = props.bench;
        for (const b of e.list) b.tasks.push({ say: '!', t: 1 }, { go: { x: rnd(B + 4, B + 46), y: rnd(Y0, Y0 + 5) }, fast: 1.8 }, { wait: 99 });
        for (let i = 0; i < 4; i++) puddles.push({ x: rnd(W * .3, W * .95), y: rnd(Y0 + 8, Y1), r: rnd(8, 16), a: 0, life: 40 });
      },
      update(e, dt) {
        e.t += dt; const s = clamp(Math.min(e.t / 1.5, (e.dur - e.t) / 1.5), 0, 1);
        gloom = s;
        for (let i = 0; i < 60 * s * dt * 10 * (1 + OFF / 142); i++) fx.push({ type: 'rain', x: rnd(0, W + 30), y: rnd(-10, 0) - OFF, land: rnd(48, H), t: 2 });
        for (const p of puddles) p.a = Math.min(1, p.a + dt * .2 * s);
        for (const b of e.list) if (!b.goal && Math.random() < dt * .3) say(b, pickOne(['drop', 'dots', 'heart']), 1.2);
        if (e.t >= e.dur) { gloom = 0; for (const b of e.list) { b.tasks = []; b.wait = 0; } return true; }
      },
      end() { gloom = 0; },
    },
  });
  // коробка: все пытаются залезть, не помещаются — и коробка лопается
  EVENTS.box = {
    ok: () => freeBirds().length >= 3, w: 2,
    start(e) {
      const bx = { type: 'bigbox', x: clamp(rnd(W * .35, W * .65), 30, W - 30), y: rnd(Y0 + 16, Y1 - 6), w: 24, h: 15, lock: true };
      bx.land = bx.y; bx.y = -OFF - 30; bx.vy = 0; e.bx = bx; items.push(bx);
      e.list = freeBirds(); enlist(e.list, e); e.inside = []; e.phase = 'drop'; e.t = 0;
    },
    update(e, dt) {
      const bx = e.bx; e.t += dt;
      if (e.phase === 'drop') {
        bx.vy += 320 * dt; bx.y += bx.vy * dt;
        if (bx.y >= bx.land) {
          bx.y = bx.land; bx.vy = null; e.phase = 'climb'; e.t = 0;
          fx.push({ type: 'poof', x: bx.x, y: bx.y - 2, t: .6 });
          e.list.forEach((b, i) => {
            const side = b.x < bx.x ? -1 : 1;
            b.tasks.push({ say: pickOne(['!', 'heart', 'star']), t: 1.2 }, { go: { x: cx(bx.x + side * rnd(30, 50)), y: cy(bx.y + rnd(-9, 2)) }, fast: 1.6 }, { wait: rnd(.2, 1.5) + i * .12 },
              { fn: b2 => { b2.hop = { from: { x: b2.x, y: b2.y }, to: { x: bx.x + rnd(-bx.w / 2 + 5, bx.w / 2 - 5), y: bx.y - 1 - (e.inside.length % 3) * 2 }, t: 0, dur: .5, h: 20 }; } },
              { fn: b2 => { b2.inBox = true; b2.ctl = true; e.inside.push(b2); bx.w = Math.min(46, bx.w + 1.6); bx.h = Math.min(19, bx.h + .25); if (Math.random() < .3) say(b2, pickOne(['heart', '!']), 1); } });
          });
        }
        return;
      }
      if (e.phase === 'climb') {
        bx.shake = Math.sin(e.t * 30) * Math.min(2, e.inside.length * .15);
        for (const b of e.inside) { if (Math.random() < dt * .12) say(b, pickOne(['drop', '!']), .9); b.x = clamp(b.x, bx.x - bx.w / 2 + 4, bx.x + bx.w / 2 - 4); }
        if (e.inside.length >= Math.min(12, Math.ceil(e.list.length * .6)) || e.t > 9) { e.phase = 'shake'; e.t = 0; for (const b of e.list) if (!b.inBox) { b.tasks = []; b.goal = null; b.wait = 0; say(b, '?', 1.5); } }
        return;
      }
      if (e.phase === 'shake') {
        bx.shake = Math.sin(e.t * 60) * 3; bx.w += dt * 3;
        for (const b of e.inside) if (Math.random() < dt * 3) b.hop || (b.hop = { from: { x: b.x, y: b.y }, to: { x: b.x, y: b.y }, t: 0, dur: .25, h: 3 });
        if (e.t < 1.6) return;
        // БАХ! обрывки картона и птички во все стороны
        bx.gone = true; e.phase = 'after'; e.t = 0;
        fx.push({ type: 'poof', x: bx.x, y: bx.y - 8, t: .6 }, { type: 'snap', x: bx.x, y: bx.y - 10, t: .6 });
        for (let i = 0; i < 12; i++) items.push({ type: 'scrap', x: bx.x + rnd(-8, 8), y: bx.y - rnd(4, 14), land: cy(bx.y + rnd(-10, 14)), vy: rnd(-70, -30), vx: rnd(-70, 70), bites: 1, fade: rnd(25, 40) });
        for (const b of e.inside) {
          b.inBox = false; b.ctl = false;
          const ang = rnd(0, Math.PI * 2), d = rnd(25, 70);
          b.hop = { from: { x: b.x, y: b.y }, to: { x: cx(b.x + Math.cos(ang) * d), y: cy(b.y + Math.sin(ang) * d * .4) }, t: 0, dur: rnd(.6, .9), h: rnd(18, 34) };
          b.tasks.push({ say: pickOne(['!', '?', 'star', 'drop']), t: 1.4 }, { wait: rnd(1, 2.5) });
        }
        return;
      }
      if (e.phase === 'after') return done(e.list) && e.t > 1;
    },
    end(e) { e.bx.gone = true; for (const b of e.list) { b.inBox = false; b.ctl = false; } },
  };
  // сюрпризы в посылке: торт, пицца, шарик, клубок, мяч, письмо от Полли, червячок
  const SURPRISES = {
    cake: {
      start(e, x, y) {
        const cake = e.it = { type: 'cake', x, y, bites: 12, lit: true, lock: true }; items.push(cake);
        e.fans = closest(freeBirds(), x, 8); enlist(e.fans, e);
        e.fans.forEach((b, i) => { const a = (i / e.fans.length) * Math.PI * 2; b.tasks.push({ go: { x: cx(x + Math.cos(a) * 24), y: cy(y + Math.sin(a) * 9) }, fast: 1.3 }, { face: Math.cos(a) > 0 ? -1 : 1 }); });
        e.st = 'gather'; e.st_t = 0;
      },
      update(e, dt) {
        e.st_t += dt;
        if (e.st === 'gather') { if (done(e.fans) || e.st_t > 8) { e.st = 'sing'; e.st_t = 0; } return; }
        if (e.st === 'sing') {
          for (const b of e.fans) if (!b.emote && Math.random() < dt * 1.5) say(b, 'note', .9);
          if (Math.random() < dt * 4) fx.push({ type: 'note', x: e.it.x + rnd(-20, 20), y: e.it.y - 30, t: 1.5 });
          if (e.st_t > 4) { // задули свечку
            e.it.lit = false; fx.push({ type: 'poof', x: e.it.x - 1, y: e.it.y - 14, t: .5 }); e.it.lock = false;
            for (const b of e.fans) { say(b, pickOne(['star', 'heart', '!']), 1.4); hop(b, 7, .4); const p = beside(b, e.it, 9); b.tasks.push({ wait: rnd(.5, 1.5) }, { go: { x: cx(p.x + rnd(-4, 4)), y: cy(p.y + rnd(-4, 4)) } }, { face: p.face }, { wait: rnd(2, 4), pose: 'peck' }, { fn: () => bite(e.it) }); }
            e.st = 'eat'; e.st_t = 0;
          }
          return;
        }
        return done(e.fans) || e.st_t > 15;
      },
    },
    pizza: {
      start(e, x, y) {
        e.slices = [];
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, sl = { type: 'slice', x: cx(x + Math.cos(a) * 6), y: cy(y + Math.sin(a) * 3), bites: 3 }; items.push(sl); e.slices.push(sl); }
        fx.push({ type: 'poof', x, y: y - 3, t: .6 });
        e.fans = closest(freeBirds(isBird), x, 5); enlist(e.fans, e);
        e.fans.forEach((b, i) => { const sl = e.slices[i]; if (!sl) return; b.tasks.push({ say: '!', t: 1 }); fetchTo(b, sl, rnd(X0, W - X0), rnd(Y0, Y1), 1.5); b.tasks.push({ fn: b2 => { const p = beside(b2, sl, 7); b2.tasks.unshift({ go: p }, { face: p.face }, { wait: rnd(2, 3), pose: 'peck' }, { fn: () => bite(sl) }); } }); });
      },
      update(e) { return done(e.fans); },
    },
    balloon: {
      start(e, x, y) {
        const [b] = closest(freeBirds(isBird), x, 1); e.fans = b ? [b] : []; if (!b) return;
        enlist([b], e); e.b = b; e.base = y;
        b.tasks.push({ go: { x: cx(x + 6), y } }, { say: '!', t: 1 }, { fn: () => { b.balloon = pickOne(['#E0443A', '#4A7BD8', '#E9A93B', '#4CC38A', '#F08BC0']); b.ctl = true; e.st = 'lift'; e.st_t = 0; } });
        e.st = 'walk'; e.st_t = 0;
      },
      update(e, dt) {
        const b = e.b; if (!b) return true;
        e.st_t += dt;
        if (e.st === 'lift') {
          b.y = e.base - Math.min(38, e.st_t * 11); b.x = cx(b.x + Math.sin(e.st_t * 1.5) * dt * 10); b.pose = 'idle'; b.anim += dt;
          if (e.st_t > .6 && !e.wow) { e.wow = true; for (const o of closest(freeBirds(), b.x, 5)) say(o, '!', 1.5); say(b, 'heart', 1.5); }
          if (e.st_t > 6) { // ПУФ — шарик лопнул
            fx.push({ type: 'snap', x: b.x + b.dir * 4, y: b.y - 37, t: .6 }); b.balloon = null; b.ctl = false;
            b.hop = { from: { x: b.x, y: b.y }, to: { x: b.x, y: e.base }, t: 0, dur: .6, h: 0 }; b.tasks.push({ say: 'drop', t: 1.5 }, { wait: 1.5 });
            e.st = 'fall';
          }
          return;
        }
        if (e.st === 'fall') return done([b]);
        return e.st_t > 12;
      },
      end(e) { if (e.b) { e.b.balloon = null; if (e.b.y < Y0) e.b.y = cy(e.base || Y0); } },
    },
    yarn: {
      start(e, x, y) {
        e.it = { type: 'yarn', x, y, bv: { x: rnd(-30, 30), y: rnd(-8, 8) }, thread: [[Math.round(x), Math.round(y)]], lock: true }; items.push(e.it);
        const cats = freeBirds(b => b.cat), others = closest(freeBirds(b => !b.cat), x, Math.max(2, 4 - cats.length));
        e.fans = [...cats.slice(0, 3), ...others]; enlist(e.fans, e);
        for (const b of e.fans) { b.ctl = true; b.cool = rnd(0, .8); say(b, b.cat ? 'heart' : '!', 1.2); }
        e.st_t = 0;
      },
      update(e, dt) {
        const it = e.it, v = it.bv; e.st_t += dt;
        for (const b of e.fans) {
          if (!b.ctl) continue; b.cool -= dt; b.anim += dt; if (b.hop) continue;
          const dx = it.x - b.x - Math.sign(v.x || 1) * 3, dy = it.y - b.y, d = Math.hypot(dx, dy);
          if (d > 2) { b.dir = dx >= 0 ? 1 : -1; const st = Math.min(d, b.speed * 1.3 * dt); b.x = cx(b.x + dx / d * st); b.y = cy(b.y + dy / d * st); b.pose = 'walk'; } else b.pose = b.cat ? 'sit' : 'idle';
          if (Math.hypot(it.x - b.x, it.y - b.y) < 7 && b.cool <= 0) { const a = rnd(0, Math.PI * 2), sp = rnd(25, 50); v.x = Math.cos(a) * sp; v.y = Math.sin(a) * sp * .5; b.cool = rnd(.8, 1.6); if (Math.random() < .3) hop(b, 5, .3); }
        }
        it.x = cx(it.x + v.x * dt); it.y = cy(it.y + v.y * dt); v.x *= Math.pow(.5, dt); v.y *= Math.pow(.5, dt);
        if (it.x <= X0 || it.x >= W - X0) v.x = -v.x; if (it.y <= Y0 || it.y >= Y1) v.y = -v.y;
        const lastP = it.thread[it.thread.length - 1];
        if (Math.hypot(lastP[0] - it.x, lastP[1] - it.y) >= 1) { it.thread.push([Math.round(it.x), Math.round(it.y)]); if (it.thread.length > 220) it.thread.shift(); }
        return e.st_t > 11;
      },
      end(e) { if (e.it) e.it.lock = false; },
    },
    ball: { start(e, x, y) { queued = { name: 'football', at: { x, y } }; e.fans = []; }, update() { return true; } },
    letter: {
      start(e, x, y) {
        const it = e.it = { type: 'letter', x, y, lock: true }; items.push(it);
        const [b] = closest(freeBirds(isBird), x, 1); e.fans = b ? [b] : []; if (!b) return;
        enlist([b], e); const p = beside(b, it, 7);
        b.tasks.push({ go: p, fast: 1.3 }, { face: p.face }, { wait: 1, pose: 'peck' }, { say: 'dots', t: 1.2 }, { wait: 1.4 }, { say: 'dots', t: 1.2 }, { wait: 1.4 },
          { fn: () => { say(b, 'heart', 2.5); for (let i = 0; i < 6; i++) hearts.push({ x: b.x + rnd(-8, 8), y: b.y - 26 - rnd(0, 8), life: rnd(1.4, 2.4) }); for (const o of closest(freeBirds(), b.x, 4)) say(o, 'heart', 1.5); it.lock = false; } }, { wait: 2 });
      },
      update(e) { return done(e.fans); },
      end(e) { if (e.it) e.it.lock = false; },
    },
    worm: {
      start(e, x, y) {
        const it = e.it = { type: 'worm', x, y, dir: 1, wv: { x: rnd(-1, 1), y: rnd(-1, 1) }, lock: true }; items.push(it);
        e.fans = closest(freeBirds(), x, 6); enlist(e.fans, e);
        for (const b of e.fans) { b.ctl = true; say(b, '!', 1); }
        e.st_t = 0; e.turn = 0;
      },
      update(e, dt) {
        const it = e.it; e.st_t += dt; e.turn -= dt;
        if (e.turn <= 0) { const a = rnd(0, Math.PI * 2); it.wv = { x: Math.cos(a), y: Math.sin(a) * .5 }; e.turn = rnd(.4, 1.1); }
        const near = e.fans.some(b => Math.hypot(b.x - it.x, b.y - it.y) < 9);
        const sp = near ? 42 : 22;
        it.x = cx(it.x + it.wv.x * sp * dt); it.y = cy(it.y + it.wv.y * sp * dt); it.dir = it.wv.x >= 0 ? 1 : -1;
        if (it.x <= X0 || it.x >= W - X0) it.wv.x *= -1; if (it.y <= Y0 || it.y >= Y1) it.wv.y *= -1;
        for (const b of e.fans) {
          if (!b.ctl || b.hop) continue; b.anim += dt;
          const dx = it.x - b.x, dy = it.y - b.y, d = Math.hypot(dx, dy);
          if (d > 3) { b.dir = dx >= 0 ? 1 : -1; const st = Math.min(d, b.speed * 1.4 * dt); b.x = cx(b.x + dx / d * st); b.y = cy(b.y + dy / d * st); b.pose = 'walk'; }
          else if (Math.random() < dt * 2) { hop(b, 6, .3); say(b, '?', .8); const a = rnd(0, Math.PI * 2); it.wv = { x: Math.cos(a), y: Math.sin(a) * .5 }; }
        }
        if (e.st_t > 9) { // червячок зарылся в щель между плитками
          it.gone = true; fx.push({ type: 'poof', x: it.x, y: it.y - 1, t: .5 });
          for (const b of e.fans) { b.ctl = false; say(b, pickOne(['?', 'drop']), 1.5); b.tasks.push({ wait: rnd(1, 2), pose: 'peck' }); }
          return true;
        }
      },
      end(e) { if (e.it) e.it.gone = true; },
    },
  };
  let queued = null;
  const messy = () => items.filter(i => free(i) && i.home && CARRY.includes(i.type) && Math.hypot(i.x - i.home.x, i.y - i.home.y) > 25);
  // ---------- зёрнышки: насыпать курсором, птички слетаются ----------
  const nearestSeed = (b, maxD = 1e9) => { let best = null, bd = maxD; for (const i of items) if (i.type === 'seed' && free(i)) { const d = Math.hypot(i.x - b.x, (i.y - b.y) * 2); if (d < bd) { bd = d; best = i; } } return best; };
  function feast(b) { // подойти к ближайшему зёрнышку и поклевать, пока рядом есть ещё
    const sd = nearestSeed(b); if (!sd) return;
    const side = b.x < sd.x ? -1 : 1, x = cx(sd.x + side * 5), y = cy(sd.y);
    b.tasks.push({ go: { x, y }, fast: 1.3 }, { face: -side });
    for (let i = 0; i < 4; i++) b.tasks.push({ wait: rnd(.5, 1), pose: 'peck' }, { fn: () => { for (let k = 0; k < 2; k++) { const s2 = nearestSeed(b, 9); if (s2) s2.gone = true; } } });
  }
  function attract() {
    const now = performance.now();
    for (const b of birds) {
      if (b.cat || b.ev || b.hop || (b.feedUntil || 0) > now) continue;
      const sd = nearestSeed(b); if (!sd) return;
      const d = Math.hypot(sd.x - b.x, sd.y - b.y);
      if (Math.random() < .25 && d > 30) continue; // не все сразу
      b.feedUntil = now + rnd(4000, 7000);
      if (b.hold) drop(b);
      b.tasks = []; b.goal = null; b.wait = 0;
      const side = b.x < sd.x ? -1 : 1, tx = cx(sd.x + side * rnd(4, 9)), ty = cy(sd.y + rnd(-3, 3));
      if (b.perch) { b.perch.by = null; b.perch = null; }
      if (Math.random() < .5) say(b, pickOne(['!', 'heart', 'note']), 1);
      if (d > 35 || b.y < Y0) b.tasks.push({ hop: { x: tx, y: ty }, h: clamp(d * .3, 14, 40), dur: clamp(d / 110, .5, 1.5) }); // прилетает
      else b.tasks.push({ go: { x: tx, y: ty }, fast: 1.6 });
      b.tasks.push({ face: -side });
      for (let i = 0; i < 4; i++) b.tasks.push({ wait: rnd(.5, 1), pose: 'peck' }, { fn: () => { for (let k = 0; k < 2; k++) { const s2 = nearestSeed(b, 9); if (s2) s2.gone = true; } } });
    }
  }
  function setParty(on) {
    party = on;
    for (const b of birds) b.hat = on ? pickOne(HAT_COLORS) : null;
    if (!on) return;
    for (let i = 0; i < 140; i++) fx.push({ type: 'confetti', x: rnd(0, W), y: rnd(-60, -2) - OFF, vy: rnd(25, 45), land: rnd(Y0 - 30, Y1 + 8), ph: rnd(0, 6), c: pickOne(['#E0443A', '#E9A93B', '#4CC38A', '#4A7BD8', '#F08BC0', '#FFFFFF', '#9B5DE5']), t: 14 });
    for (const b of birds) { say(b, pickOne(['note', 'star', 'heart', '!']), 1.8); if (!b.ev && !b.hop && !b.perch) hop(b, rnd(6, 12), .45); }
  }
  // кнопки над сценой: запустить событие сразу
  function trigger(name) {
    if (!EVENTS[name]) return;
    if (ev && ev.name === name) return;
    endEvent(); // кнопка прерывает то, что идёт сейчас
    for (const b of birds) if (b.hold && !b.ev) { drop(b); b.tasks = []; b.goal = null; b.wait = .5; } // и кладёт на землю всё, что птички несут
    if (name === 'coffee' && !EVENTS.coffee.ok()) { const cup = items.find(i => i.type === 'cup' && !i.gone); if (cup && !cup.lock && !cup.held) { cup.full = true; cup.tipped = false; fx.push({ type: 'poof', x: cup.x, y: cup.y - 6, t: .6 }); } }
    if (name === 'tug' && !EVENTS.tug.ok() && !items.some(i => i.type === 'baguette' && !i.gone)) name = 'delivery';
    const d = EVENTS[name];
    if (name !== 'delivery' && !d.ok()) { const b = pickOne(birds); if (b) say(b, '?', 1.5); return; }
    ev = { name, def: d, age: 0, force: true }; lastEv = name; d.start(ev);
  }
  // «Всё как было»: остановить всё, снять колпаки, убрать лужи и мусор, разложить вещи по местам
  function tidyAll() {
    endEvent();
    if (party) setParty(false);
    night = 0; disco = 0; gloom = 0; puddles = []; fx = []; hearts = []; queued = null;
    for (const p of perches) p.by = null;
    for (const b of birds) {
      b.hold = null; b.tasks = []; b.goal = null; b.hop = null; b.ctl = false; b.ev = null; b.perch = null; b.hat = null; b.inBox = false; b.balloon = null;
      b.wait = rnd(.5, 2); b.pose = 'idle'; b.y = cy(b.y); b.x = cx(b.x);
      if (Math.random() < .5) say(b, pickOne(['star', 'heart', 'note']), 1.4);
    }
    makeItems();
    for (const it of items) if (it.type !== 'crumb') fx.push({ type: 'poof', x: it.x, y: it.y - 4, t: .6 });
    evIn = rnd(10, 16);
  }
  // «Найти птичку»: ищем в сцене, а если её тут нет — спрашиваем сервер, и она прилетает сверху
  function spotlight(b) {
    birds.forEach(x => { if (x.found) { x.found = 0; if (x.label) x.label.classList.remove('found'); } });
    b.found = 7; if (b.label) b.label.classList.add('found');
    if (!b.hop) { b.tasks = []; b.goal = null; b.wait = 0; if (b.perch) { b.perch.by = null; b.perch = null; b.y = cy(b.y); } }
    b.tasks.push({ say: 'heart', t: 2 }, { hop: { x: b.x, y: b.y }, h: 8, dur: .4 }, { hop: { x: b.x, y: b.y }, h: 8, dur: .4 }, { wait: 2 });
  }
  async function findBird(q) {
    q = q.trim().replace(/^@/, '').toLowerCase();
    if (q.length < 2) return 'short';
    let b = birds.find(x => x.u.nick && x.u.nick.toLowerCase() === q) || birds.find(x => x.u.nick && x.u.nick.toLowerCase().startsWith(q));
    if (b) { spotlight(b); return 'here'; }
    let r;
    try { r = await (await fetch('/api/flock/find?nick=' + encodeURIComponent(q))).json(); } catch (e) { return 'error'; }
    const u = r.birds && r.birds[0];
    if (!u) return 'none';
    b = birds.find(x => x.u.id === u.id);
    if (b) { spotlight(b); return 'here'; }
    guests = [u, ...guests.filter(g => g.id !== u.id)].slice(0, 5);
    if (birds.length >= cap()) { // кто-то улетает, чтобы освободить место
      const out = birds.filter(x => !x.u.me && !x.ev && !guests.some(g => g.id === x.u.id)).sort(() => Math.random() - .5)[0];
      if (out) { if (out.hold) drop(out); if (out.perch) out.perch.by = null; if (out.label) out.label.remove(); birds = birds.filter(x => x !== out); }
    }
    b = makeBird(u);
    const tx = rnd(W * .2, W * .8), ty = rnd(Y0 + 4, Y1 - 4);
    b.x = tx; b.y = ty; b.hop = { from: { x: tx + rnd(-60, 60), y: -OFF - 30 }, to: { x: tx, y: ty }, t: 0, dur: 1.6, h: 0 }; b.wait = 0;
    birds.push(b);
    spotlight(b);
    return 'flying';
  }
  let lastPour = 0, lastCall = 0;
  function pour(wx, wy) {
    const now = performance.now();
    if (now - lastPour < 30) return; lastPour = now;
    const land = clamp(wy, Y0, Y1);
    for (let i = 0; i < 3; i++) items.push({ type: 'seed', x: cx(wx + rnd(-4, 4)), y: Math.min(wy, land) + rnd(-2, 0), land: cy(land + rnd(-3, 3)), vy: rnd(0, 10), vx: rnd(-6, 6), bites: 1, c: pickOne(['#E9C46A', '#C08A3E', '#F3D98B', '#8A5A3B']) });
    if (now - lastCall > 350) { lastCall = now; setTimeout(attract, 250); }
  }
  function scatter(x) {
    crumbsAt(x, 12, -4);
    for (const b of freeBirds(b => !b.cat && !b.hold)) {
      if (Math.random() < .35) continue;
      b.tasks = [{ say: '!', t: 1 }, { wait: rnd(.6, 1.4) }]; b.goal = null; b.wait = 0;
    }
  }
  function endEvent() { if (!ev) return; ev.def.end && ev.def.end(ev); release(birds.filter(b => b.ev === ev)); ev = null; evIn = rnd(8, 16); }
  function director(dt) {
    for (const it of items) if (it.type === 'cup' && !it.full) it.emptyFor = (it.emptyFor || 0) + dt;
    if (ev) {
      if (ev.def.update(ev, dt) || (ev.age += dt) > 60) {
        endEvent();
        if (queued) { const q = queued; queued = null; ev = { name: q.name, def: EVENTS[q.name], age: 0, at: q.at }; EVENTS[q.name].start(ev); }
      }
      return;
    }
    if ((evIn -= dt) > 0) return;
    const pool = Object.entries(EVENTS).filter(([n, d]) => d.ok() && n !== lastEv);
    if (!pool.length) { evIn = 5; return; }
    let r = Math.random() * pool.reduce((s, [, d]) => s + d.w, 0), pick = pool[0];
    for (const p of pool) { r -= p[1].w; if (r <= 0) { pick = p; break; } }
    lastEv = pick[0];
    ev = { name: pick[0], def: pick[1], age: 0 };
    pick[1].start(ev);
  }
  let lastEv = '';

  // времена года: листья осенью, снег зимой, лепестки весной
  function seasonTick(dt) {
    const m = new Date().getMonth();
    const kind = m >= 8 && m <= 10 ? 'leaf' : m === 11 || m <= 1 ? 'snow' : m >= 2 && m <= 4 ? 'petal' : null;
    if (!kind || Math.random() > dt * .5) return;
    const c = kind === 'leaf' ? pickOne(['#E9A93B', '#C0582F', '#D9944A', '#B23A48']) : kind === 'snow' ? '#FFFFFF' : '#F7C6D9';
    fx.push({ type: kind, x: rnd(0, W), y: -OFF - 3, vx: rnd(-6, 6), vy: rnd(8, 14), land: rnd(Y0, Y1 + 6), c, t: 30, ph: rnd(0, 6) });
  }
  function stepFx(dt) {
    for (const f of fx) {
      f.t -= dt;
      if (f.type === 'note') f.y -= dt * 10;
      if (f.type === 'gust') f.x += f.vx * dt;
      if (f.type === 'rain') { if (f.y < f.land) { f.y += 170 * dt; f.x -= 25 * dt; } else { f.type = 'splash'; f.t = .25; } }
      if (f.type === 'confetti') { if (f.y < f.land) { f.y += f.vy * dt; f.x += Math.sin(f.ph += dt * 5) * dt * 12; } else if (f.t > 8) f.t = 8; }
      if (f.type === 'leaf' || f.type === 'snow' || f.type === 'petal') {
        if (f.y < f.land) { f.ph += dt * 3; f.x += (f.vx + Math.sin(f.ph) * 8) * dt; f.y += f.vy * dt; }
        else if (f.type === 'leaf' && !f.item) { f.item = true; f.t = 0; if (items.filter(i => i.type === 'leaf').length < 8) items.push({ type: 'leaf', x: cx(f.x), y: cy(f.y), c: f.c, fade: rnd(30, 60) }); }
        else if (f.t > 3) f.t = 3;
      }
    }
    fx = fx.filter(f => f.t > 0).slice(-400);
    for (const p of puddles) p.life -= dt;
    puddles = puddles.filter(p => p.life > 0);
    // падающие и разлетающиеся крошки
    for (const it of items) if (it.vy != null && (it.type === 'crumb' || it.type === 'seed' || it.type === 'scrap')) {
      it.vy += 60 * dt; it.y += it.vy * dt; if (it.vx) it.x = cx(it.x + it.vx * dt);
      if (it.y >= it.land && it.vy > 0) { it.y = it.land; it.vy = null; it.vx = 0; }
    }
    for (const it of items) if (it.fade != null && !it.held && (it.fade -= dt) <= 0) it.gone = true;
    const crumbs = items.filter(i => i.type === 'crumb' && !i.gone);
    if (crumbs.length > 40) for (const c of crumbs.slice(0, crumbs.length - 40)) c.gone = true;
    const seeds = items.filter(i => i.type === 'seed' && !i.gone);
    if (seeds.length > 160) for (const c of seeds.slice(0, seeds.length - 160)) c.gone = true;
    items = items.filter(i => !i.gone || (i.held && i.held !== 'ev'));
  }

  function step(dt) {
    friends(dt);
    director(dt);
    seasonTick(dt);
    stepFx(dt);
    for (const b of birds) stepBird(b, dt);
  }

  function draw() {
    ctx.drawImage(bg, 0, 0);
    ctx.save(); ctx.translate(0, OFF);
    // свет фонаря
    const L = props.lamp, now = performance.now();
    ctx.fillStyle = disco > 0 ? `hsla(${(now / 6) % 360},90%,65%,.3)` : `rgba(255, 220, 140, ${.14 + night * .2})`;
    ctx.beginPath(); ctx.arc(L, 18, 22 + night * 10, 0, 7); ctx.fill();
    if (disco > 0) for (let i = 0; i < 8; i++) { const a = now / 700 + i * .8; R(W / 2 + Math.cos(a) * W * .4, 104 + Math.sin(a * 1.3) * 16, 2, 2, `hsla(${i * 45},90%,70%,.55)`); }
    for (const p of puddles) { ctx.globalAlpha = Math.min(p.a, p.life / 5) * .7; ctx.fillStyle = '#7FA6C9'; ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, p.r * .35, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#B9D3E8'; ctx.fillRect(Math.round(p.x - p.r * .4), Math.round(p.y - 1), Math.round(p.r * .5), 1); ctx.globalAlpha = 1; }
    const k = cv.getBoundingClientRect().width / W;
    // всё на земле — по глубине (кто ниже, тот ближе)
    const ents = [];
    for (const it of items) if (!it.held && !it.fly && it.vy == null) ents.push({ y: it.y - (it.cat ? 1 : 0), it });
    for (const b of birds) ents.push({ y: b.perch ? 85 : (b.hop && b.hop.to.y < 80 ? 85 : b.y), b });
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) {
      if (e.it) { drawItem(e.it, e.it.x, e.it.y, false); continue; }
      const b = e.b;
      let f = 0, dy = 0;
      if (b.pose === 'walk') f = Math.floor(b.anim / (b.fast > 2 ? .07 : .16)) % 2;
      if (b.pose === 'peck') f = Math.floor(b.anim / .22) % 2 ? 2 : 0;
      if (b.pose === 'dance') { dy = Math.abs(Math.sin(b.anim * 6)) * 3; b.dir = Math.floor(b.anim * 1.5) % 2 ? 1 : -1; f = Math.floor(b.anim * 6) % 2; }
      if (b.cat && b.pose !== 'walk' && !b.hop) f = 2; // котик сидит
      const img = b.frames[f], x = Math.round(b.x), y = Math.round(b.y - dy) - (b.pose === 'walk' && f ? 1 : 0);
      if (!b.perch && !b.hop) { ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fillRect(x - 5, Math.round(b.y), 10, 1); }
      ctx.save();
      if (b.dir < 0) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.drawImage(img, -SW / 2, y - BASE); }
      else ctx.drawImage(img, x - SW / 2, y - BASE);
      ctx.restore();
      if (b.balloon) { // воздушный шарик на ниточке
        const sx = x + b.dir * 4, top = y - 40 + Math.round(Math.sin(b.anim * 2) * 1.5);
        for (let yy = top + 8; yy < y - 12; yy++) R(sx + Math.round(Math.sin(yy / 4 + b.anim * 3) * .6), yy, 1, 1, '#FFFDF5');
        R(sx - 3, top, 7, 7, b.balloon); R(sx - 2, top - 1, 5, 1, b.balloon); R(sx - 2, top + 7, 5, 1, b.balloon); R(sx, top + 8, 1, 1, b.balloon); R(sx - 1, top + 1, 1, 2, '#FFFFFF');
      }
      if (b.hat) { // праздничный колпак на макушке
        const hd = b.heads[f], hx = b.dir > 0 ? x - SW / 2 + hd.x : x + SW / 2 - hd.x - 1, hy = y - BASE + hd.y;
        const [c1, c2] = b.hat;
        [[0, 1], [-1, 3], [-1, 3], [-2, 5], [-2, 5]].forEach(([o, w], i) => R(hx + o, hy - 5 + i, w, 1, i % 2 ? c2 : c1));
        R(hx, hy - 7, 1, 2, '#FFE7A3'); R(hx - 1, hy - 7, 3, 1, '#FFE7A3');
      }
      if (b.hold) { const it = b.hold, long = it.type === 'baguette' || it.type === 'half'; drawItem(it, x + b.dir * (long ? 9 : 8), y - (long ? 9 : 7), true); }
      if (b.label) b.label.style.transform = `translate(${(b.x * k).toFixed(1)}px, ${((b.y + 2 + OFF) * k).toFixed(1)}px) translateX(-50%)`;
    }
    // багет в перетягивании, падающее и летящее
    for (const it of items) if (it.held === 'ev' && !it.fly && it.vy == null) drawItem(it, it.x, it.y, true);
    for (const it of items) if (it.fly || it.vy != null) drawItem(it, it.x, it.y, false);
    for (const f of fx) {
      if (f.type === 'leaf') { R(f.x - 1, f.y, 3, 1, f.c); R(f.x, f.y - 1, 1, 1, f.c); }
      else if (f.type === 'snow') R(f.x, f.y, 1, 1, f.c);
      else if (f.type === 'petal') R(f.x, f.y, 2, 1, f.c);
      else if (f.type === 'note') { ctx.globalAlpha = Math.min(1, f.t); ICON.note.forEach((row, yy) => [...row].forEach((ch, xx) => { if (ch === '#') R(f.x - 2 + xx, f.y + yy, 1, 1, '#FFE7A3'); })); ctx.globalAlpha = 1; }
      else if (f.type === 'poof' || f.type === 'snap') { const r = (1 - f.t / .6) * 10 + 3; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; R(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r * .6, 2, 2, f.type === 'snap' ? '#F0C27C' : '#FFFDF5'); } }
    }
    if (gloom > 0) { ctx.fillStyle = `rgba(40, 50, 80, ${gloom * .3})`; ctx.fillRect(0, -OFF, W, H); }
    for (const f of fx) {
      if (f.type === 'gust') { ctx.globalAlpha = Math.min(1, f.t) * .55; R(f.x, f.y, f.len, 1, '#FFFFFF'); ctx.globalAlpha = 1; }
      else if (f.type === 'rain') R(f.x, f.y, 1, 3, 'rgba(185, 211, 232, .8)');
      else if (f.type === 'splash') { R(f.x - 2, f.y - 1, 1, 1, '#B9D3E8'); R(f.x + 2, f.y - 1, 1, 1, '#B9D3E8'); R(f.x, f.y - 2, 1, 1, '#B9D3E8'); }
      else if (f.type === 'confetti') { ctx.globalAlpha = Math.min(1, f.t); R(f.x, f.y, (f.ph | 0) % 2 ? 2 : 1, (f.ph | 0) % 2 ? 1 : 2, f.c); ctx.globalAlpha = 1; }
    }
    if (night > 0) { ctx.fillStyle = `rgba(12, 6, 40, ${night * .45})`; ctx.fillRect(0, -OFF, W, H); ctx.fillStyle = `rgba(255, 220, 140, ${night * .16})`; ctx.beginPath(); ctx.arc(L, 60, 40, 0, 7); ctx.fill(); }
    for (const b of birds) if (b.found > 0) { // стрелка над найденной птичкой
      const ax = Math.round(b.x), ay = Math.round(b.y - (b.cat ? 26 : 34) - (b.emote ? 11 : 0) - Math.abs(Math.sin(b.anim * 5)) * 3);
      ['#####', '.###.', '..#..'].forEach((row, yy) => [...row].forEach((ch, xx) => { if (ch === '#') R(ax - 2 + xx, ay + yy, 1, 1, '#E9A93B'); }));
      R(ax - 1, ay - 3, 3, 3, '#E9A93B');
    }
    for (const b of birds) if (b.emote) drawEmote(b.x, b.y - (b.cat ? 17 : 24), b.emote.icon, Math.min(b.emote.t / .3, (b.emote.max - b.emote.t) / .15 + .2));
    drawHearts();
    ctx.restore();
  }
  const HEART = ['.##.##.', '#######', '.#####.', '..###..', '...#...'];
  function drawHearts() {
    for (const h of hearts) {
      ctx.globalAlpha = Math.min(1, h.life);
      HEART.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') R(h.x - 3 + x, h.y + y, 1, 1, y === 0 && x === 1 ? '#FFD0E4' : '#F06A9A'); }));
    }
    ctx.globalAlpha = 1;
  }

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(cv);
  function loop(t) {
    const dt = Math.min(.1, (t - last) / 1000 || 0); last = t;
    if (visible) { if (!still) step(dt); draw(); }
    requestAnimationFrame(loop);
  }

  function reset(list) { ev = null; evIn = rnd(6, 10); night = 0; disco = 0; gloom = 0; puddles = []; fx = []; hearts = []; makeItems(); makeBirds(list); }
  function start(data) {
    layout();
    reset(data.birds);
    const cnt = box.querySelector('.fl-count');
    if (cnt && data.total) cnt.textContent = cnt.dataset.tpl.replace('{n}', data.total) + (data.recent ? ' ' + cnt.dataset.recent : '');
    if (data.birds.some(b => b.me)) { const j = box.querySelector('.fl-join'); if (j) j.hidden = true; }
    // «Хочу свою птичку»: открывает вход через Google в шапке (после входа сразу попросит ник)
    const join = box.querySelector('.fl-join');
    join && join.addEventListener('click', e => {
      if (!window.PPAccount || window.PPAccount.signedIn()) return;
      e.preventDefault(); e.stopPropagation(); // иначе клик дойдёт до страницы и сразу закроет окно входа
      window.PPAccount.openSignIn();
    });
    requestAnimationFrame(loop);
    let rw = box.clientWidth, rh = innerHeight;
    const relayout = () => { layout(); reset(data.birds); };
    addEventListener('resize', () => { if (Math.abs(box.clientWidth - rw) < 40 && (!full || Math.abs(innerHeight - rh) < 60)) return; rw = box.clientWidth; rh = innerHeight; relayout(); });
    // ники: показать/скрыть (запоминаем в браузере); свой ник и найденный видны всегда
    const nickBtn = box.querySelector('[data-act=nicks]');
    const setNicks = on => { labels.classList.toggle('hide-nicks', !on); if (nickBtn) nickBtn.setAttribute('aria-pressed', String(on)); try { localStorage.setItem('fl-nicks', on ? '1' : '0'); } catch (e) { /* без памяти */ } };
    let nicksOn = true; try { nicksOn = localStorage.getItem('fl-nicks') !== '0'; } catch (e) { /* */ }
    setNicks(nicksOn);
    if (nickBtn) nickBtn.addEventListener('click', e => { e.stopPropagation(); nicksOn = !nicksOn; setNicks(nicksOn); });
    const findForm = box.querySelector('.fl-find');
    if (findForm) findForm.addEventListener('submit', async e => {
      e.preventDefault();
      const out = findForm.querySelector('.fl-find-msg'), inp = findForm.querySelector('input');
      out.textContent = '…';
      const r = await findBird(inp.value);
      out.textContent = (FIND[lang] || FIND.en)[r] || '';
      if (r === 'here' || r === 'flying') box.querySelector('.fl-stage').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    // «На весь экран»: на главной открывает /flock/, на самой /flock/ — настоящий полноэкранный режим
    const open = box.querySelector('.fl-open');
    if (open && full) {
      if (!box.requestFullscreen) open.hidden = true;
      open.removeAttribute('target');
      open.addEventListener('click', e => { e.preventDefault(); if (document.fullscreenElement) document.exitFullscreen(); else box.requestFullscreen().catch(() => {}); });
      document.addEventListener('fullscreenchange', () => setTimeout(relayout, 60));
    }
    // «Насыпать зёрнышек»: зажать мышку (или палец) и водить над сценой
    const stage = box.querySelector('.fl-stage');
    let seeding = false, pouring = false;
    const toWorld = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H - OFF]; };
    box.querySelectorAll('.fl-tools [data-act]').forEach(btn => btn.addEventListener('click', e => {
      e.stopPropagation();
      const act = btn.dataset.act;
      if (act === 'seed') { seeding = !seeding; btn.setAttribute('aria-pressed', String(seeding)); stage.classList.toggle('seeding', seeding); const h = box.querySelector('.fl-seedhint'); if (h) h.hidden = !seeding; return; }
      if (act === 'party') { setParty(!party); btn.setAttribute('aria-pressed', String(party)); return; }
      if (act === 'reset') {
        tidyAll(); seeding = false; stage.classList.remove('seeding');
        box.querySelectorAll('.fl-tools [aria-pressed]').forEach(x => x.setAttribute('aria-pressed', 'false'));
        const h = box.querySelector('.fl-seedhint'); if (h) h.hidden = true;
        btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
        return;
      }
      if (still) return;
      trigger(act);
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
    }));
    stage.addEventListener('pointerdown', e => { if (!seeding) return; pouring = true; stage.setPointerCapture(e.pointerId); pour(...toWorld(e)); e.preventDefault(); });
    stage.addEventListener('pointermove', e => { if (seeding && pouring) pour(...toWorld(e)); });
    const stopPour = () => { pouring = false; };
    stage.addEventListener('pointerup', stopPour); stage.addEventListener('pointercancel', stopPour);
    // клик по сцене — бросить крошки в это место
    stage.addEventListener('click', e => {
      if (e.target.closest('a') || still || seeding) return;
      const r = cv.getBoundingClientRect();
      scatter(clamp((e.clientX - r.left) / r.width * W, 20, W - 20));
    });
  }
  window.PPFlockDebug = { surprise(kind) { endEvent(); ev = { name: 'delivery', def: EVENTS.delivery, age: 0, force: true }; EVENTS.delivery.start(ev); ev.kind = kind; }, run(name) { endEvent(); if (!EVENTS[name].ok()) return false; ev = { name, def: EVENTS[name], age: 0 }; EVENTS[name].start(ev); return true; }, get ev() { return ev && ev.name; }, items: () => items, birds: () => birds };
  fetch('/api/flock' + (full ? '?limit=60' : ''), { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject())
    .then(d => start(d.birds.length ? d : { total: 0, birds: demo() }))
    .catch(() => start({ total: 0, birds: demo() }));
  // пока никого нет (или сервер недоступен) — безымянные птички для настроения
  function demo() { return [3, 8, 15, 22, 41, 57, 63, 90].map(id => ({ id, nick: null })); }
})();
