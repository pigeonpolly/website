// «Стая» на главной: каждый, кто хоть раз входил на сайт, — пиксельная птичка со своим ником.
// Внешность выводится из id пользователя и не повторяется (форма × цвет × шляпа × туфли = 28 120 вариантов).
(function () {
  const box = document.getElementById('flock');
  if (!box) return;
  const cv = box.querySelector('canvas'), ctx = cv.getContext('2d'), labels = box.querySelector('.fl-labels');
  const lang = document.documentElement.lang || 'en';

  const { looks, sprite, SW, BASE } = window.PPBirds;

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
    if (r < .5 && !b.cat) { b.tx = food() + rnd(-14, 14); b.ty = rnd(98, 124); b.eat = true; }
    else if (r < .5 && b.cat) { const f = birds.filter(x => !x.cat && !x.perch); const o = f[Math.floor(Math.random() * f.length)]; // котик идёт посидеть рядом с другом
      b.tx = o ? Math.max(8, Math.min(W - 8, o.x + (Math.random() < .5 ? -12 : 12))) : rnd(8, W - 8); b.ty = o ? Math.max(88, Math.min(128, o.y + rnd(-3, 3))) : rnd(88, 128); b.eat = false; }
    else { b.tx = rnd(8, W - 8); b.ty = rnd(88, 128); b.eat = false; }
    b.state = 'walk';
  }
  function makeBirds(list) {
    labels.innerHTML = '';
    birds = list.slice(0, Math.max(8, Math.floor(W / (W < 260 ? 13 : 9)))).map(u => {
      const lk = looks(u.id);
      const b = { u, cat: lk.kind === 'cat', frames: [0, 1, 2].map(f => sprite(lk, f)), x: rnd(10, W - 10), y: rnd(90, 128), dir: Math.random() < .5 ? 1 : -1,
        state: 'idle', timer: rnd(.5, 3), anim: 0, speed: lk.kind === 'cat' ? rnd(6, 9) : rnd(9, 15), perch: null };
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
  // котики дружат с птичками: когда рядом — сердечки
  let hearts = [];
  function friends(dt) {
    for (const c of birds) {
      if (!c.cat || c.state === 'hop') continue;
      for (const o of birds) {
        if (o.cat || o.state === 'hop' || Math.abs(o.x - c.x) > 18 || Math.abs(o.y - c.y) > 8) continue;
        if (Math.random() < dt * .35) hearts.push({ x: (o.x + c.x) / 2 + rnd(-3, 3), y: Math.min(o.y, c.y) - 24, life: 1.8 });
      }
    }
    hearts = hearts.filter(h => (h.life -= dt) > 0).slice(-12);
    for (const h of hearts) h.y -= dt * 7;
  }
  const HEART = ['.##.##.', '#######', '.#####.', '..###..', '...#...'];
  function drawHearts() {
    for (const h of hearts) {
      ctx.globalAlpha = Math.min(1, h.life);
      HEART.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') R(h.x - 3 + x, h.y + y, 1, 1, y === 0 && x === 1 ? '#FFD0E4' : '#F06A9A'); }));
    }
    ctx.globalAlpha = 1;
  }
  function step(dt) {
    friends(dt);
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
      if (b.cat && b.state !== 'walk' && b.state !== 'hop') f = 2; // котик сидит
      const img = b.frames[f], x = Math.round(b.x), y = Math.round(b.y) - (b.state === 'walk' && f ? 1 : 0);
      if (!b.perch && b.state !== 'hop') { ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fillRect(x - 5, Math.round(b.y), 10, 1); }
      ctx.save();
      if (b.dir < 0) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.drawImage(img, -SW / 2, y - BASE); }
      else ctx.drawImage(img, x - SW / 2, y - BASE);
      ctx.restore();
      if (b.label) b.label.style.transform = `translate(${(b.x * k).toFixed(1)}px, ${((b.y + 2) * k).toFixed(1)}px) translateX(-50%)`;
    }
    drawHearts();
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
    // «Хочу свою птичку»: открывает вход через Google в шапке (после входа сразу попросит ник)
    const join = box.querySelector('.fl-join');
    join && join.addEventListener('click', e => {
      if (!window.PPAccount || window.PPAccount.signedIn()) return;
      e.preventDefault(); e.stopPropagation(); // иначе клик дойдёт до страницы и сразу закроет окно входа
      window.PPAccount.openSignIn();
    });
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
