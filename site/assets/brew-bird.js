// Крупная детальная птичка пользователя для кабинета зельевара (docs/brew.md). Внешность — та же, что у аватара и в стае:
// PPBirds.looks(id) + надетое (PPBirds.dress), только нарисована заново крупнее (≈60 px вместо 26) со светом, тенью, дизерингом.
// Шапки, вещи в клюве и обувь — рисунки HD-спрайта (PPBirds.HDX), увеличенные EPX; шарфик рисуется здесь.
// Позы: idle (дышит), walk (шаг), flap (машет крылом), stir (мешает ложкой), happy (подпрыгивает), sad, think.
// Глаза: open, blink, wink, happy (^^), sad, closed. Кадры кэшируются.
// PPBrewBird.actor(id, avatar) — живая птичка: walkTo(x), act(поза, мс), mood(глаза, мс), draw(ctx, сейчас); моргает сама.
(function () {
  const X = window.PPPix, B = () => window.PPBirds;
  const W = 120, H = 112, FOOT = 106; // холст кадра; ноги стоят на y = FOOT, птичка смотрит вправо
  const PUPIL = '#1E1424', IRIS = '#4B2E52', BLUSH = '#F49BB0', TEAR = '#8FD3F5', WOOD = ['#E0B47A', '#B9844C', '#7E5230'];

  // повёрнутый объёмный овал: ang — наклон оси u; col(тон, u, v, x, y)
  function rblob(g, cx, cy, rx, ry, ang, col, layer) {
    const ca = Math.cos(ang), sa = Math.sin(ang), R = Math.max(rx, ry) + 1;
    for (let y = Math.floor(cy - R); y <= cy + R; y++) for (let x = Math.floor(cx - R); x <= cx + R; x++) {
      const dx = x + .5 - cx, dy = y + .5 - cy, u = (dx * ca + dy * sa) / rx, v = (-dx * sa + dy * ca) / ry, d = u * u + v * v;
      if (d > 1) continue;
      const nz = Math.sqrt(1 - d), lit = Math.max(0, (dx / R) * -.5 + (dy / R) * -.7 + nz * .6);
      const c = col(Math.min(1, lit), u, v, x, y); if (c) g.put(x, y, c, layer);
    }
  }
  // мелкий рисунок старого HD-спрайта → ×2 EPX → на сетку (якорь: ax, ay — куда встаёт точка (0,0) рисунка)
  function paste(g, draw, ax, ay, flip) {
    const m = new Map(); draw((x, y, c) => { if (c) m.set(Math.round(x) + ',' + Math.round(y), c); });
    if (!m.size) return;
    for (const [k, c] of X.epx(m)) { const [x, y] = k.split(',').map(Number); g.put(ax + (flip ? -x : x), ay + y, c, 'acc'); }
  }
  function eye(g, x, y, kind, big) {
    const ry = kind === 'sad' ? 2.6 : big ? 3.6 : 3.2, rx = 2.3;
    if (kind === 'blink' || kind === 'closed') {
      for (let i = -2; i <= 2; i++) g.put(x + i, y + 1 + (kind === 'closed' && Math.abs(i) < 2 ? 1 : 0), PUPIL, 'face');
      g.put(x - 3, y, PUPIL, 'face'); g.put(x + 3, y, PUPIL, 'face'); // реснички
      return;
    }
    if (kind === 'happy') { for (const [i, j] of [[-3, 1], [-2, 0], [-1, -1], [0, -1], [1, -1], [2, 0], [3, 1]]) g.put(x + i, y + j, PUPIL, 'face'); return; }
    for (let j = -4; j <= 4; j++) for (let i = -3; i <= 3; i++) if (((i + .5 - .5) / rx) ** 2 + ((j) / ry) ** 2 <= 1) g.put(x + i, y + j, j > ry / 3 ? IRIS : PUPIL, 'face');
    g.put(x - 1, y - 2, '#FFFFFF', 'face'); g.put(x, y - 2, '#FFFFFF', 'face'); g.put(x - 1, y - 1, '#FFFFFF', 'face'); g.put(x, y - 1, '#FFFFFF', 'face');
    g.put(x + 1, y + 2, '#FFFFFF', 'face');
    if (kind === 'sad') { g.put(x - 2, y + 1, '#CFEFFF', 'face'); }
  }
  function blush(g, x, y, k) { for (let j = -1; j <= 1; j++) for (let i = -3; i <= 3; i++) if ((i / 3.4) ** 2 + j * j / 1.6 <= 1 && X.bayer(x + i, y + j) < k) g.put(x + i, y + j, BLUSH, 'face'); }
  function spoon(g, x0, y0, ang, len) { // деревянная ложка из крыла/лапы: ручка и черпак
    const dx = Math.cos(ang), dy = Math.sin(ang);
    for (let i = 0; i < len; i++) { g.put(x0 + dx * i, y0 + dy * i, i % 5 ? WOOD[1] : WOOD[0], 'acc'); g.put(x0 + dx * i + dy, y0 + dy * i - dx, WOOD[2], 'acc'); }
    const ex = x0 + dx * len, ey = y0 + dy * len;
    rblob(g, ex + dx * 2, ey + dy * 2, 3.6, 2.4, ang, t => t > .6 ? WOOD[0] : t > .3 ? WOOD[1] : WOOD[2], 'acc');
  }

  function birdFrame(lk, st) {
    const g = X.grid(W, H), s = lk.shape, crow = lk.kind === 'crow';
    const K = 3.2, bw = s.bw * K, bh = s.bh * K, hr = s.hr * 2.4 + 6.5, neck = s.neck * 3;
    const heels = lk.shoe && lk.shoe.t === 'heels', legH = heels ? 12 : 9;
    const jump = st.pose === 'happy' ? [0, -4, -7, -4][st.f % 4] : 0, bob = st.pose === 'idle' ? (st.f % 2) : 0;
    const cx = 46, bottom = FOOT - legH + 1 + jump, cy = bottom - bh / 2 + bob, top = cy - bh / 2;
    const R = X.ramp(lk.body), Wr = X.ramp(X.mix(lk.body, '#3B2550', .18)), Bel = X.ramp(X.mix(lk.body, '#FFF4E4', crow ? .18 : .5));
    // хвост: три пера веером назад
    [[-.15, 1], [.2, .9], [.55, .78]].forEach(([a, k], i) => rblob(g, cx - bw / 2 - 4 + i, cy + 2 - i * 2, 9 * k, 3.2, Math.PI - .35 - a, (t, u) => g.tone(u < -.3 ? Wr : R, t * .8, 0, 0)));
    // лапки
    const legs = st.pose === 'walk' ? [[-7, [0, -2, 0, 1][st.f % 4]], [5, [1, 0, -2, 0][st.f % 4]]] : [[-5, 0], [4, 0]];
    for (const [lx0, lift] of legs) {
      const lx = cx + lx0, by = FOOT + jump + lift;
      for (let y = bottom - 2; y <= by; y++) { g.put(lx, y, '#F2B54A', 'leg'); g.put(lx + 1, y, '#E39A2E', 'leg'); g.put(lx + 2, y, '#C67E22', 'leg'); }
      if (lk.shoe) paste(g, put => B().HDX.shoe(put, lk.shoe, 0), lx - 2, by - B().HB * 2 + 1);
      else { for (let i = 3; i <= 5; i++) g.put(lx + i, by, '#C67E22', 'leg'); g.put(lx - 1, by, '#C67E22', 'leg'); g.put(lx + 4, by - 1, '#E39A2E', 'leg'); }
    }
    // тело и грудка с «чешуйками» перьев
    g.blob(cx, cy, bw / 2, bh / 2, (t, u, v, x, y) => g.tone(R, t, x, y));
    g.blob(cx + bw * .14, cy + bh * .16, bw * .33, bh * .3, (t, u, v, x, y) => {
      const c = g.tone(Bel, Math.min(1, t + .15), x, y);
      return (x + (y >> 2) * 2) % 4 === 0 && y % 4 === 1 && v > -.5 ? Bel.sh : c;
    });
    // голова (шея у длинношеих)
    const hx = cx + bw * .3 + (st.pose === 'think' ? -1 : 0), hy = top - hr * .5 - neck + 3 + (st.pose === 'sad' ? 2 : 0);
    if (neck) g.blob(cx + bw * .28, (top + hy) / 2 + 3, hr * .55, neck / 2 + 5, (t, u, v, x, y) => g.tone(R, t, x, y));
    g.blob(hx, hy, hr, hr * .94, (t, u, v, x, y) => g.tone(R, t, x, y));
    // хохолок
    for (let i = 0; i < 4; i++) g.put(hx - 2 + i, hy - hr - 1 - (i === 1 || i === 2 ? 1 : 0), i < 2 ? R.li : R.base);
    // крыло: поза → угол (вперёд — для ложки)
    const stir = st.pose === 'stir', flapA = [-1.05, -.45, .2, -.45][st.f % 4];
    const ang = st.pose === 'flap' ? flapA : stir ? .55 + Math.sin(st.f / 6 * Math.PI * 2) * .22 : st.pose === 'sad' ? .62 : .32;
    const sx = cx - 2, sy = cy - bh * .14, wl = bw * .4, wd = stir ? [Math.cos(ang), Math.sin(ang)] : [-Math.cos(ang), Math.sin(ang)];
    const wcx = sx + wd[0] * wl * .62, wcy = sy + wd[1] * wl * .62, wa = Math.atan2(wd[1], wd[0]);
    rblob(g, wcx, wcy, wl, bh * .27, wa, (t, u, v, x, y) => {
      const c = g.tone(Wr, t * .9, x, y);
      if (u > .35 && Math.abs(((v + 1) * 2.6) % 1 - .5) < .14) return Wr.dk; // маховые перья
      return c;
    }, 'wing');
    if (stir && !st.noSpoon) spoon(g, wcx + wd[0] * wl * .9, wcy + wd[1] * wl * .9, .9 + Math.sin(st.f / 6 * Math.PI * 2) * .25, 26);
    // лицо (вид 3/4 вправо): глаза, румянец, клюв
    const e1 = hx + hr * .02, e2 = hx + hr * .55, ey = hy - hr * .08, eyes = st.eyes || 'open';
    blush(g, Math.round(hx - hr * .3), Math.round(ey + 6), eyes === 'happy' ? .9 : .55);
    blush(g, Math.round(hx + hr * .68), Math.round(ey + 6), eyes === 'happy' ? .9 : .55);
    eye(g, Math.round(e1), Math.round(ey), eyes === 'wink' ? 'open' : eyes, true);
    eye(g, Math.round(e2), Math.round(ey), eyes === 'wink' ? 'happy' : eyes, true);
    if (eyes === 'sad') { // бровки домиком и слезинка
      g.line(e1 - 3, ey - 6, e1 + 1, ey - 7, PUPIL, 'face'); g.line(e2 - 1, ey - 7, e2 + 3, ey - 6, PUPIL, 'face');
      if (st.f % 4 > 0) { g.put(e2 + 1, ey + 4 + st.f % 4, TEAR, 'face'); g.put(e2 + 1, ey + 5 + st.f % 4, TEAR, 'face'); }
    }
    const bx = Math.round(hx + hr * .86), by = Math.round(hy + hr * .2), beak = lk.beak || '#F2A73B', bk = X.ramp(beak), open = st.beak === 'open' || eyes === 'happy';
    const up = crow ? [4, 8, 9] : [3, 6, 7], lo = crow ? [7, 4] : [5, 3];
    up.forEach((n, j) => { for (let i = 0; i < n; i++) g.put(bx + i - 1, by - 2 + j, j === 0 ? bk.hi : i > n - 3 ? bk.sh : bk.base, 'face'); });
    if (open) for (let i = 1; i < 5; i++) g.put(bx + i - 1, by + 1, '#B0384F', 'face');
    lo.forEach((n, j) => { for (let i = 0; i < n; i++) g.put(bx + i - 1, by + 1 + j + (open ? 1 : 0), bk.dk, 'face'); });
    // шарфик, шапка, вещь в клюве
    if (lk.scarf) {
      const c = X.ramp(lk.scarf), sy0 = Math.round(hy + hr * .72);
      for (let x = Math.round(hx - hr * .75); x <= hx + hr * .6; x++) for (let k = 0; k < 5; k++) g.put(x, sy0 + k, (Math.floor(x / 3) % 2 ? c.base : c.sh) && (k === 0 ? c.li : Math.floor(x / 3) % 2 ? c.base : c.sh), 'acc');
      for (let k = 0; k < 11; k++) for (let j = 0; j < 4; j++) g.put(Math.round(hx - hr * .7) + j - (k > 6 ? 1 : 0), sy0 + 3 + k, k % 3 === 2 ? c.sh : c.base, 'acc');
    }
    if (lk.hat) paste(g, put => B().HDX.hat(put, lk.hat, 0, 0), Math.round(hx), Math.round(hy - hr + 5));
    const it = lk.item && B().HDX.items[lk.item];
    if (it) paste(g, put => B().HDX.stamp(put, it.r, 0, it.dy, it.p), bx + (crow ? 4 : 3), by - 2);
    g.outline(X.INK, X.mix(X.INK, lk.body, .45));
    return g.canvas();
  }

  function catFrame(lk, st) {
    const g = X.grid(W, H), R = X.ramp(lk.fur), Wt = X.ramp('#FBF6EC'), jump = st.pose === 'happy' ? [0, -3, -6, -3][st.f % 4] : 0;
    const cx = 44, cy = FOOT - 16 + jump + (st.pose === 'idle' ? st.f % 2 : 0);
    const stripe = (x, y) => lk.pattern === 'stripes' && (x + Math.round(y / 2)) % 6 < 2;
    // хвост — колышется
    const sw = Math.sin((st.f || 0) / 3) * 3;
    for (let i = 0; i < 26; i++) { const tx = cx - 19 - Math.sin(i / 7) * 7 + (i > 14 ? sw * (i - 14) / 10 : 0), ty = cy + 10 - i * 1.1, r = i > 22 ? 1.4 : 2.4; for (let k = -2; k <= 2; k++) if (Math.abs(k) <= r) g.put(tx + k, ty, stripe(Math.round(tx), Math.round(ty * 1.4)) ? R.sh : k < 0 ? R.li : k > 0 ? R.sh : R.base); }
    g.blob(cx, cy, 20, 15, (t, u, v, x, y) => stripe(x, y) ? R.sh : g.tone(R, t, x, y));
    if (lk.pattern === 'patches') g.blob(cx + 6, cy + 5, 10, 8, (t, u, v, x, y) => g.tone(Wt, t + .2, x, y));
    // лапки (передняя машет / мешает)
    const wave = st.pose === 'flap', stir = st.pose === 'stir';
    for (const [px, k] of [[cx - 12, 0], [cx - 4, 0], [cx + 8, 1], [cx + 15, 1]]) {
      const lift = (wave && k && px > cx + 10) ? -14 + (st.f % 2) * 3 : 0;
      g.blob(px, FOOT - 3 + jump + lift, 3.6, 3.4, (t, u, v, x, y) => g.tone(R, t + .1, x, y));
    }
    if (stir && !st.noSpoon) spoon(g, cx + 18, cy - 4, .9 + Math.sin(st.f / 6 * Math.PI * 2) * .25, 24);
    const hx = cx + 12, hy = cy - 22 + (st.pose === 'sad' ? 2 : 0);
    for (const s of [-1, 1]) { // уши
      for (let j = 0; j < 9; j++) for (let i = -4 + Math.ceil(j / 2); i <= 4 - Math.ceil(j / 2); i++) g.put(hx + s * 9 + i, hy - 9 - j, Math.abs(i) < 2 && j < 6 ? '#F4A6C6' : R.base);
    }
    g.blob(hx, hy, 15, 13, (t, u, v, x, y) => stripe(x, y) && v < -.3 ? R.sh : g.tone(R, t, x, y));
    if (lk.pattern !== 'solid') g.blob(hx + 1, hy + 6, 8, 5, (t, u, v, x, y) => g.tone(lk.pattern === 'patches' ? Wt : X.ramp(X.mix(lk.fur, '#FFF4E4', .45)), t + .2, x, y));
    const eyes = st.eyes || 'open', ey = hy - 1;
    for (const [ex, k] of [[hx - 6, 0], [hx + 6, 1]]) {
      const kind = eyes === 'wink' ? (k ? 'happy' : 'open') : eyes;
      if (kind === 'open' || kind === 'sad') { eye(g, ex, ey, kind, true); g.put(ex, ey + 2, '#5BA84E', 'face'); g.put(ex - 1, ey + 2, '#5BA84E', 'face'); }
      else eye(g, ex, ey, kind);
    }
    blush(g, hx - 10, ey + 6, .5); blush(g, hx + 10, ey + 6, .5);
    g.put(hx, ey + 4, '#F08BC0', 'face'); g.put(hx + 1, ey + 4, '#F08BC0', 'face');
    for (const [i, j] of [[-1, 6], [0, 7], [1, 7], [2, 6]]) g.put(hx + i, ey + j, PUPIL, 'face');
    for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { g.put(hx + s * (12 + i), ey + 4 + (i >> 1) - 1, '#FFFFFF', 'nol'); g.put(hx + s * (12 + i), ey + 7 + (i >> 2), '#FFFFFF', 'nol'); }
    if (lk.scarf) { const c = X.ramp(lk.scarf); for (let x = hx - 11; x <= hx + 9; x++) for (let k = 0; k < 4; k++) g.put(x, hy + 11 + k, k === 0 ? c.li : Math.floor(x / 3) % 2 ? c.base : c.sh, 'acc'); }
    if (lk.hat) paste(g, put => B().HDX.hat(put, lk.hat, 0, 0), hx, hy - 10);
    const it = lk.item && B().HDX.items[lk.item];
    if (it) paste(g, put => B().HDX.stamp(put, it.r, 0, it.dy, it.p), hx + 10, ey + 4);
    g.outline(X.INK, X.mix(X.INK, lk.fur, .45));
    return g.canvas();
  }

  function create(id, avatar) {
    const lk = B().dress(B().looks(id || 1), avatar || null), cache = new Map();
    const frame = st => {
      const key = [st.pose, st.f, st.eyes, st.beak, st.noSpoon ? 1 : 0].join('|');
      if (!cache.has(key)) { if (cache.size > 160) cache.clear(); cache.set(key, (lk.kind === 'cat' ? catFrame : birdFrame)(lk, st)); }
      return cache.get(key);
    };
    return { lk, frame, W, H, FOOT };
  }

  // живая птичка на сцене: x, y — точка между лапками в пикселях сцены; dir 1 — вправо, −1 — влево
  function actor(id, avatar, o = {}) {
    const b = create(id, avatar);
    const a = { x: o.x || 0, y: o.y || 0, dir: o.dir || 1, pose: 'idle', eyes: 'open', until: 0, eyesUntil: 0, nextBlink: 0, target: null, onArrive: null, speed: o.speed || 38, last: 0, bird: b };
    a.act = (pose, ms, eyes) => { a.pose = pose; a.until = performance.now() + (ms || 1500); if (eyes) a.mood(eyes, ms); };
    a.mood = (eyes, ms) => { a.eyes = eyes; a.eyesUntil = performance.now() + (ms || 1200); };
    a.walkTo = (x, cb, dir) => { a.target = x; a.onArrive = cb || null; a.endDir = dir; };
    a.busy = () => a.target != null || (a.pose !== 'idle' && performance.now() < a.until);
    a.draw = (ctx, now) => {
      const dt = Math.min(.1, a.last ? (now - a.last) / 1000 : 0); a.last = now;
      if (a.target != null) {
        const d = a.target - a.x; a.dir = d < 0 ? -1 : 1; a.pose = 'walk';
        if (Math.abs(d) <= a.speed * dt + .5) { a.x = a.target; a.target = null; a.pose = 'idle'; if (a.endDir) a.dir = a.endDir; const cb = a.onArrive; a.onArrive = null; if (cb) cb(); }
        else a.x += Math.sign(d) * a.speed * dt;
      } else if (a.pose !== 'idle' && now > a.until) a.pose = 'idle';
      if (a.eyes !== 'open' && a.eyes !== 'blink' && now > a.eyesUntil) a.eyes = 'open';
      if (!a.nextBlink) a.nextBlink = now + 2000 + Math.random() * 3000;
      let eyes = a.eyes;
      if (eyes === 'open' && now > a.nextBlink) { eyes = 'blink'; if (now > a.nextBlink + 140) a.nextBlink = now + 2200 + Math.random() * 3800; }
      const speed = { walk: 130, flap: 110, stir: 110, happy: 120, idle: 700, sad: 260, think: 700 }[a.pose] || 400;
      const f = Math.floor(now / speed) % (a.pose === 'stir' ? 6 : 4);
      if (o.hd) { // мелкий рисунок (котик в комнате): кадры HD-спрайта — 0/1 шаг, 2 сидит
        const k = a.pose === 'walk' ? f % 2 : a.pose === 'idle' && a.eyes === 'closed' ? 2 : 0;
        a.hdc = a.hdc || []; if (!a.hdc[k]) a.hdc[k] = B().crop(B().spriteHD(b.lk, k));
        const im = a.hdc[k], jump = a.pose === 'happy' ? -3 : 0;
        ctx.save(); ctx.fillStyle = 'rgba(42,27,46,.25)'; ctx.fillRect(Math.round(a.x) - 12, Math.round(a.y) - 1, 24, 2);
        if (a.dir < 0) { ctx.translate(Math.round(a.x) + im.width / 2, Math.round(a.y) - im.height + jump); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0); }
        else ctx.drawImage(im, Math.round(a.x - im.width / 2), Math.round(a.y) - im.height + jump);
        ctx.restore(); return;
      }
      const c = b.frame({ noSpoon: !!o.noSpoon, pose: a.pose, f, eyes: a.pose === 'sad' && eyes === 'open' ? 'sad' : eyes, beak: a.pose === 'happy' ? 'open' : 'shut' });
      const ox = 46; // x точки между лапками в кадре
      ctx.save();
      // тень на полу
      ctx.fillStyle = 'rgba(42,27,46,.28)';
      for (let i = -14; i <= 14; i++) { const h = Math.round(Math.sqrt(1 - (i / 15) ** 2) * 2.2); ctx.fillRect(Math.round(a.x + i), Math.round(a.y) - h + 1, 1, h * 2 - 1 || 1); }
      if (a.dir < 0) { ctx.translate(Math.round(a.x) + ox, Math.round(a.y) - FOOT); ctx.scale(-1, 1); ctx.drawImage(c, 0, 0); }
      else ctx.drawImage(c, Math.round(a.x) - ox, Math.round(a.y) - FOOT);
      ctx.restore();
    };
    // попадание по птичке (пиксели сцены)
    a.hit = (x, y) => Math.abs(x - a.x) < (o.hd ? 18 : 26) && y < a.y + 4 && y > a.y - (o.hd ? 40 : 70);
    return a;
  }

  window.PPBrewBird = { create, actor, W, H, FOOT };
})();
