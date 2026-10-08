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

  const { looks, sprite, SW, BASE } = window.PPBirds;

  // ---------- сцена ----------
  let W = 300, H = 120, S = 3, props = {}, perches = [];
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pickOne = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const X0 = 6, Y0 = 90, Y1 = 128; // где можно ходить
  const cx = x => clamp(x, X0, W - X0), cy = y => clamp(y, Y0, Y1);
  let bg = null;
  function layout() {
    const cw = box.querySelector('.fl-stage').clientWidth;
    S = cw >= 900 ? 3 : cw >= 560 ? 2.5 : 2;
    W = Math.round(cw / S); H = 142;
    cv.width = W; cv.height = H; cv.style.height = H * S + 'px';
    props = { bin: Math.round(W * .05), bench: Math.round(W * .13), cup: Math.round(W * .13) + 52, bun: Math.round(W * .52), baguette: Math.round(W * .68), book: Math.round(W * .86), lamp: Math.round(W * .955) };
    perches = [{ x: props.bench + 10, y: 66 }, { x: props.bench + 24, y: 66 }, { x: props.bench + 38, y: 66 }, { x: props.bin + 6, y: 62 }].map(p => ({ ...p, by: null }));
    bg = drawBackground();
  }
  function drawBackground() {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
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
  const FOOD = ['bun', 'baguette', 'half', 'crumb', 'seed'];
  const CARRY = ['bun', 'half', 'book', 'cup', 'plane', 'leaf'];
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
  let birds = [], last = 0;
  const say = (b, icon, t = 1.6) => { b.emote = { icon, t, max: t }; };
  const freeBirds = (pred = () => true) => birds.filter(b => !b.ev && !b.perch && !b.hop && pred(b));
  const isBird = b => !b.cat && !b.crow;
  function makeBirds(list) {
    labels.innerHTML = '';
    birds = list.slice(0, Math.max(8, Math.floor(W / (W < 260 ? 13 : 9)))).map(u => {
      const lk = looks(u.id);
      const b = { u, cat: lk.kind === 'cat', crow: lk.kind === 'crow', frames: [0, 1, 2].map(f => sprite(lk, f)), x: rnd(10, W - 10), y: rnd(Y0, Y1), dir: Math.random() < .5 ? 1 : -1,
        tasks: [], goal: null, wait: rnd(.3, 3), pose: 'idle', anim: rnd(0, 5), speed: lk.kind === 'cat' ? rnd(6, 9) : rnd(9, 15), fast: 1, perch: null, hold: null, emote: null, ev: null };
      if (u.nick) {
        const a = document.createElement('a');
        a.className = 'fl-nick' + (u.me ? ' me' : '');
        a.href = (lang === 'en' ? '' : '/' + lang) + '/challenge/#@' + encodeURIComponent(u.nick);
        a.textContent = (u.me ? '★ ' : '') + '@' + u.nick;
        labels.appendChild(a); b.label = a;
      }
      return b;
    });
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
      if (!c.cat || c.hop) continue;
      for (const o of birds) {
        if (o.cat || o.hop || Math.abs(o.x - c.x) > 18 || Math.abs(o.y - c.y) > 8) continue;
        if (Math.random() < dt * .35) hearts.push({ x: (o.x + c.x) / 2 + rnd(-3, 3), y: Math.min(o.y, c.y) - 24, life: 1.8 });
      }
    }
    hearts = hearts.filter(h => (h.life -= dt) > 0).slice(-12);
    for (const h of hearts) h.y -= dt * 7;
  }

  function stepBird(b, dt) {
    b.anim += dt;
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
      else { if (Math.abs(dx) > .3) b.dir = dx >= 0 ? 1 : -1; const v = Math.min(d, b.speed * b.fast * dt); b.x += dx / d * v; b.y += dy / d * v; b.pose = 'walk'; return; }
    }
    if (b.wait > 0) { b.wait -= dt; if (b.pose === 'idle' && Math.random() < dt * .3) b.dir *= -1; if (b.wait > 0) return; }
    nextTask(b);
  }

  // ---------- события ----------
  let ev = null, evIn = rnd(6, 10), night = 0, disco = 0, fx = [];
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
        e.ball = { type: 'ball', x: from < 0 ? -4 : W + 4, y: rnd(100, 120), bv: { x: -from * rnd(45, 60), y: rnd(-8, 8) }, spin: 0, lock: true };
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
      ok: () => messy().length >= 2 && freeBirds(isBird).length >= 1, w: 2,
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
        e.box = { type: 'parcel', x: rnd(W * .3, W * .75), y: -10, vy: 14, lock: true, held: 'ev' };
        e.land = rnd(104, 118); items.push(e.box); e.t = 0;
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
          if (!items.some(i => !i.gone && i.type === 'bun')) items.push({ type: 'bun', x: cx(p.x - 10), y: p.y, bites: 10, home: { x: props.bun + 7, y: 106 } });
          if (!items.some(i => !i.gone && (i.type === 'baguette' || i.type === 'half'))) items.push({ type: 'baguette', x: cx(p.x + 12), y: p.y - 2, bites: 14, home: { x: props.baguette + 15, y: 100 } });
          const cup = items.find(i => i.type === 'cup' && !i.gone); if (cup && !cup.full) { cup.full = true; cup.emptyFor = 0; }
        }
        if (e.t - e.landed > 2.5) return true;
      },
      end(e) { e.box.gone = true; e.box.held = null; },
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
    if (ev) { if (ev.def.update(ev, dt) || (ev.age += dt) > 60) endEvent(); return; }
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
    fx.push({ type: kind, x: rnd(0, W), y: -3, vx: rnd(-6, 6), vy: rnd(8, 14), land: rnd(Y0, Y1 + 6), c, t: 30, ph: rnd(0, 6) });
  }
  function stepFx(dt) {
    for (const f of fx) {
      f.t -= dt;
      if (f.type === 'note') f.y -= dt * 10;
      if (f.type === 'leaf' || f.type === 'snow' || f.type === 'petal') {
        if (f.y < f.land) { f.ph += dt * 3; f.x += (f.vx + Math.sin(f.ph) * 8) * dt; f.y += f.vy * dt; }
        else if (f.type === 'leaf' && !f.item) { f.item = true; f.t = 0; if (items.filter(i => i.type === 'leaf').length < 8) items.push({ type: 'leaf', x: cx(f.x), y: cy(f.y), c: f.c, fade: rnd(30, 60) }); }
        else if (f.t > 3) f.t = 3;
      }
    }
    fx = fx.filter(f => f.t > 0).slice(-60);
    // падающие и разлетающиеся крошки
    for (const it of items) if (it.vy != null && (it.type === 'crumb' || it.type === 'seed')) {
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
    // свет фонаря
    const L = props.lamp, now = performance.now();
    ctx.fillStyle = disco > 0 ? `hsla(${(now / 6) % 360},90%,65%,.3)` : `rgba(255, 220, 140, ${.14 + night * .2})`;
    ctx.beginPath(); ctx.arc(L, 18, 22 + night * 10, 0, 7); ctx.fill();
    if (disco > 0) for (let i = 0; i < 8; i++) { const a = now / 700 + i * .8; R(W / 2 + Math.cos(a) * W * .4, 104 + Math.sin(a * 1.3) * 16, 2, 2, `hsla(${i * 45},90%,70%,.55)`); }
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
      if (b.hold) { const it = b.hold, long = it.type === 'baguette' || it.type === 'half'; drawItem(it, x + b.dir * (long ? 9 : 8), y - (long ? 9 : 7), true); }
      if (b.label) b.label.style.transform = `translate(${(b.x * k).toFixed(1)}px, ${((b.y + 2) * k).toFixed(1)}px) translateX(-50%)`;
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
    if (night > 0) { ctx.fillStyle = `rgba(12, 6, 40, ${night * .45})`; ctx.fillRect(0, 0, W, H); ctx.fillStyle = `rgba(255, 220, 140, ${night * .16})`; ctx.beginPath(); ctx.arc(L, 60, 40, 0, 7); ctx.fill(); }
    for (const b of birds) if (b.emote) drawEmote(b.x, b.y - (b.cat ? 17 : 24), b.emote.icon, Math.min(b.emote.t / .3, (b.emote.max - b.emote.t) / .15 + .2));
    drawHearts();
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

  function reset(list) { ev = null; evIn = rnd(6, 10); night = 0; disco = 0; fx = []; hearts = []; makeItems(); makeBirds(list); }
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
    let rw = box.clientWidth;
    addEventListener('resize', () => { if (Math.abs(box.clientWidth - rw) < 40) return; rw = box.clientWidth; layout(); reset(data.birds); });
    // «Насыпать зёрнышек»: зажать мышку (или палец) и водить над сценой
    const stage = box.querySelector('.fl-stage'), seedBtn = box.querySelector('.fl-seed');
    let seeding = false, pouring = false;
    const toWorld = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
    if (seedBtn) seedBtn.addEventListener('click', e => {
      e.stopPropagation();
      seeding = !seeding; seedBtn.setAttribute('aria-pressed', String(seeding));
      seedBtn.textContent = seeding ? seedBtn.dataset.on : seedBtn.dataset.off;
      stage.classList.toggle('seeding', seeding);
    });
    stage.addEventListener('pointerdown', e => { if (!seeding || e.target.closest('.fl-seed')) return; pouring = true; stage.setPointerCapture(e.pointerId); pour(...toWorld(e)); e.preventDefault(); });
    stage.addEventListener('pointermove', e => { if (seeding && pouring) pour(...toWorld(e)); });
    const stopPour = () => { pouring = false; };
    stage.addEventListener('pointerup', stopPour); stage.addEventListener('pointercancel', stopPour);
    // клик по сцене — бросить крошки в это место
    stage.addEventListener('click', e => {
      if (e.target.closest('a') || e.target.closest('.fl-seed') || still || seeding) return;
      const r = cv.getBoundingClientRect();
      scatter(clamp((e.clientX - r.left) / r.width * W, 20, W - 20));
    });
  }
  window.PPFlockDebug = { run(name) { endEvent(); if (!EVENTS[name].ok()) return false; ev = { name, def: EVENTS[name], age: 0 }; EVENTS[name].start(ev); return true; }, get ev() { return ev && ev.name; }, items: () => items, birds: () => birds };
  fetch('/api/flock', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject())
    .then(d => start(d.birds.length ? d : { total: 0, birds: demo() }))
    .catch(() => start({ total: 0, birds: demo() }));
  // пока никого нет (или сервер недоступен) — безымянные птички для настроения
  function demo() { return [3, 8, 15, 22, 41, 57, 63, 90].map(id => ({ id, nick: null })); }
})();
