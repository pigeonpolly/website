// «Стая» на главной: каждый, кто хоть раз входил на сайт, — пиксельная птичка со своим ником.
// Внешность выводится из id пользователя и не повторяется (форма × цвет × шляпа × туфли = 28 120 вариантов).
(function () {
  const box = document.getElementById('flock');
  if (!box) return;
  const cv = box.querySelector('canvas'), ctx = cv.getContext('2d'), labels = box.querySelector('.fl-labels');
  const lang = document.documentElement.lang || 'en';
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
  function looks(id) {
    let k = (id * 7919 + 12345) % N; // 7919 — простое, не делит N: у разных id разная внешность
    const shoe = k % N_SHOE; k = Math.floor(k / N_SHOE);
    const hat = k % N_HAT; k = Math.floor(k / N_HAT);
    const body = k % BODY.length; k = Math.floor(k / BODY.length);
    return { shape: SHAPES[k % SHAPES.length], body: BODY[body],
      hat: hat ? { t: HATS[(hat - 1) % HATS.length], c: HAT_C[Math.floor((hat - 1) / HATS.length)] } : null,
      shoe: shoe ? { t: SHOES[(shoe - 1) % SHOES.length], c: SHOE_C[Math.floor((shoe - 1) / SHOES.length)] } : null };
  }
  const shade = (hex, k) => '#' + hex.slice(1).match(/../g).map(h => Math.max(0, Math.min(255, Math.round(parseInt(h, 16) * k))).toString(16).padStart(2, '0')).join('');

  // ---------- спрайт птички (20×26, смотрит вправо): кадры 0,1 — шаг, 2 — клюёт ----------
  const SW = 20, SH = 26, BASE = 25;
  function sprite(lk, frame) {
    const g = {}; // "x,y" → [цвет, слой]; слой 'leg' без контура
    const put = (x, y, c, layer = 'body') => { if (x >= 0 && y >= 0 && x < SW && y < SH) g[x + ',' + y] = [c, layer]; };
    const ell = (cx, cy, rx, ry, c) => { for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) if (((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1) put(x, y, c); };
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
    put(bx, by, '#F2A73B'); put(bx + 1, by, '#F2A73B'); if (s.hr >= 3) put(bx, by - 1, '#F2A73B');
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
    // шляпа
    if (lk.hat) {
      const c = lk.hat.c, c2 = shade(c, c === '#2B2340' ? 2.2 : .7), hxR = Math.round(hx), ht = Math.round(hy - s.hr - .2);
      const t = lk.hat.t;
      if (t === 'top') { for (let x = -3; x <= 3; x++) put(hxR + x, ht, c); for (let y = 1; y <= 4; y++) for (let x = -2; x <= 2; x++) put(hxR + x, ht - y, y === 1 ? c2 : c); }
      if (t === 'beret') { for (let x = -3; x <= 2; x++) put(hxR + x, ht, c); for (let x = -2; x <= 2; x++) put(hxR + x, ht - 1, c); put(hxR, ht - 2, c2); }
      if (t === 'cap') { for (let x = -2; x <= 2; x++) put(hxR + x, ht, c); for (let x = -1; x <= 1; x++) put(hxR + x, ht - 1, c); for (let x = 3; x <= 5; x++) put(hxR + x, ht + 1, c2); put(hxR + 2, ht + 1, c2); }
      if (t === 'bow') { const bx0 = hxR - 2; put(bx0 - 1, ht, c); put(bx0 - 1, ht + 1, c); put(bx0 - 1, ht - 1, c); put(bx0, ht, c2); put(bx0 + 1, ht - 1, c); put(bx0 + 1, ht + 1, c); put(bx0 + 1, ht, c); }
      if (t === 'party') { for (let y = 0; y < 5; y++) for (let x = -2 + Math.ceil(y / 2); x <= 2 - Math.ceil(y / 2); x++) put(hxR + x, ht - y, y % 2 ? c2 : c); put(hxR, ht - 5, '#FFFFFF'); }
      if (t === 'crown') { for (let x = -2; x <= 2; x++) { put(hxR + x, ht, c); put(hxR + x, ht - 1, c); } put(hxR - 2, ht - 2, c); put(hxR, ht - 2, c); put(hxR + 2, ht - 2, c); put(hxR, ht - 1, '#FFFFFF'); }
    }
    // контур
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

  // ---------- сцена ----------
  let W = 300, H = 120, S = 3, props = {}, perches = [];
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
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
    // фонарь
    const L = props.lamp;
    g.fillStyle = 'rgba(255, 220, 140, .14)'; g.beginPath(); g.arc(L, 18, 22, 0, 7); g.fill();
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
    // стаканчик кофе
    const C = props.cup;
    r(C, 77, 6, 9, '#F1EEE6'); r(C, 80, 6, 3, '#8A5A3B'); r(C - 1, 75, 8, 2, '#3A3550'); r(C + 2, 74, 2, 1, '#3A3550'); r(C + 2, 81, 2, 1, '#E9A93B');
    // булка
    const U = props.bun;
    r(U, 100, 14, 6, '#D9944A'); r(U + 1, 98, 12, 2, '#E8A95C'); r(U + 3, 97, 8, 1, '#F0C27C'); r(U + 3, 99, 2, 1, '#F7D9A3'); r(U + 8, 99, 2, 1, '#F7D9A3'); r(U, 106, 14, 1, 'rgba(0,0,0,.2)');
    // багет
    const G = props.baguette;
    for (let i = 0; i < 30; i++) { const y = 96 - Math.floor(i / 6); r(G + i, y, 1, 4, '#D9944A'); r(G + i, y, 1, 1, '#EDB56E'); if (i % 6 === 3) r(G + i, y + 1, 2, 1, '#F7D9A3'); }
    // крошки
    for (const [dx, dy] of [[-6, 4], [-3, 7], [18, 5], [20, 1], [10, 8]]) r(U + dx, 100 + dy, 1, 1, '#F0C27C');
    for (const [dx, dy] of [[4, 6], [12, 4], [26, 1], [-4, 3]]) r(G + dx, 96 + dy, 1, 1, '#F0C27C');
    // раскрытая книга
    const K = props.book;
    r(K - 1, 108, 18, 2, '#B23A48'); r(K, 104, 8, 4, '#FFFDF5'); r(K + 8, 104, 8, 4, '#F3EEDF'); r(K + 7, 103, 2, 5, '#C9B79C');
    for (let y = 105; y < 108; y++) { r(K + 1, y, 5, 1, '#C8C2D8'); r(K + 10, y, 5, 1, '#C8C2D8'); }
    return c;
  }

  // ---------- птички ----------
  let birds = [], last = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const food = () => { const f = [props.bun + 7, props.baguette + 14]; return f[Math.floor(Math.random() * f.length)]; };
  function newTarget(b) {
    const free = perches.filter(p => !p.by);
    const r = Math.random();
    if (r < .14 && free.length) { const p = free[Math.floor(Math.random() * free.length)]; p.by = b; b.perch = p; b.state = 'hop'; b.t = 0; b.from = { x: b.x, y: b.y }; b.to = { x: p.x, y: p.y }; return; }
    if (r < .5) { b.tx = food() + rnd(-14, 14); b.ty = rnd(98, 124); b.eat = true; }
    else { b.tx = rnd(8, W - 8); b.ty = rnd(88, 128); b.eat = false; }
    b.state = 'walk';
  }
  function makeBirds(list) {
    labels.innerHTML = '';
    birds = list.slice(0, Math.max(8, Math.floor(W / (W < 260 ? 13 : 9)))).map(u => {
      const lk = looks(u.id);
      const b = { u, frames: [0, 1, 2].map(f => sprite(lk, f)), x: rnd(10, W - 10), y: rnd(90, 128), dir: Math.random() < .5 ? 1 : -1,
        state: 'idle', timer: rnd(.5, 3), anim: 0, speed: rnd(9, 15), perch: null };
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
  function step(dt) {
    for (const b of birds) {
      b.anim += dt;
      if (b.state === 'idle' || b.state === 'peck' || b.state === 'sit') {
        b.timer -= dt;
        if (b.state === 'idle' && Math.random() < dt * .3) b.dir *= -1;
        if (b.timer <= 0) {
          if (b.state === 'sit') { b.state = 'hop'; b.t = 0; b.from = { x: b.x, y: b.y }; b.to = { x: b.x + rnd(-10, 10), y: rnd(90, 104) }; b.perch.by = null; b.perch = null; }
          else newTarget(b);
        }
      } else if (b.state === 'walk') {
        const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy);
        if (d < 1) { b.state = b.eat ? 'peck' : 'idle'; b.timer = b.eat ? rnd(2, 5) : rnd(1, 4); continue; }
        b.dir = dx >= 0 ? 1 : -1;
        const v = Math.min(d, b.speed * dt);
        b.x += dx / d * v; b.y += dy / d * v;
      } else if (b.state === 'hop') {
        b.t += dt / .55;
        const t = Math.min(1, b.t);
        b.dir = b.to.x >= b.from.x ? 1 : -1;
        b.x = b.from.x + (b.to.x - b.from.x) * t;
        b.y = b.from.y + (b.to.y - b.from.y) * t - Math.sin(t * Math.PI) * 16;
        if (t >= 1) { b.y = b.to.y; if (b.perch) { b.state = 'sit'; b.timer = rnd(4, 10); } else { b.state = 'idle'; b.timer = rnd(.5, 2); } }
      }
    }
  }
  function draw() {
    ctx.drawImage(bg, 0, 0);
    const order = [...birds].sort((a, b) => (a.perch ? 85 : a.y) - (b.perch ? 85 : b.y));
    const rect = cv.getBoundingClientRect(), k = rect.width / W;
    for (const b of order) {
      let f = 0;
      if (b.state === 'walk') f = Math.floor(b.anim / .16) % 2;
      if (b.state === 'peck') f = Math.floor(b.anim / .22) % 2 ? 2 : 0;
      const img = b.frames[f], x = Math.round(b.x), y = Math.round(b.y) - (b.state === 'walk' && f ? 1 : 0);
      if (!b.perch && b.state !== 'hop') { ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fillRect(x - 5, Math.round(b.y), 10, 1); }
      ctx.save();
      if (b.dir < 0) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.drawImage(img, -SW / 2, y - BASE); }
      else ctx.drawImage(img, x - SW / 2, y - BASE);
      ctx.restore();
      if (b.label) b.label.style.transform = `translate(${(b.x * k).toFixed(1)}px, ${((b.y + 2) * k).toFixed(1)}px) translateX(-50%)`;
    }
  }
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(cv);
  function loop(t) {
    const dt = Math.min(.1, (t - last) / 1000 || 0); last = t;
    if (visible) { if (!still) step(dt); draw(); }
    requestAnimationFrame(loop);
  }

  function start(data) {
    layout();
    makeBirds(data.birds);
    const cnt = box.querySelector('.fl-count');
    if (cnt && data.total) cnt.textContent = cnt.dataset.tpl.replace('{n}', data.total) + (data.recent ? ' ' + cnt.dataset.recent : '');
    if (data.birds.some(b => b.me)) { const j = box.querySelector('.fl-join'); if (j) j.hidden = true; }
    requestAnimationFrame(loop);
    let rw = box.clientWidth;
    addEventListener('resize', () => { if (Math.abs(box.clientWidth - rw) < 40) return; rw = box.clientWidth; layout(); makeBirds(data.birds); });
  }
  fetch('/api/flock', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject())
    .then(d => start(d.birds.length ? d : { total: 0, birds: demo() }))
    .catch(() => start({ total: 0, birds: demo() }));
  // пока никого нет (или сервер недоступен) — безымянные птички для настроения
  function demo() { return [3, 8, 15, 22, 41, 57, 63, 90].map(id => ({ id, nick: null })); }
  box.querySelector('.fl-stage').addEventListener('click', e => { if (!e.target.closest('a')) birds.forEach(b => { if (b.state === 'idle' || b.state === 'peck') b.timer = 0; }); });
})();
