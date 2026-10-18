// Видео №2 для соцсетей (этап 15, docs/bird.md «Видео»): Полли рисует яблоко у мольберта, фотографирует, загружает в челлендж,
// получает бейдж «Яйцо» и радуется; финал — pigeonpolly.com и «присоединяйтесь». Устроено как film.js: комната — PPRoom.mount с o.film,
// FILM.frame(n) отдаёт PNG кадра n; рендер — tools/video/render.py --film apple. ?lang=en|ru|lv — язык экрана телефона и финала.
(() => {
  const B = window.PPBirds, RM = window.PPRoom;
  const FPS = 30, VW = 1080, VH = 1920, S = 14, RW = RM.RW, RH = RM.RH, GY = 113, FY = 86;
  const ROOM_Y = (VH - RH * S) / 2, CAM = 98;           // в кадре 77 из 192 пикселей комнаты: окно, мольберт, портрет Полли
  const BG = '#2B1A51', OUT = '#1a1528', PEACH = '#F0A987';
  const LANG = new URLSearchParams(location.search).get('lang') || 'en', LI = { en: 0, ru: 1, lv: 2 }[LANG] || 0;
  const T = { // подписи — как на сайте (sketch-wall.js), финал — по просьбе Алины
    today: ['Today’s theme', 'Тема дня', 'Dienas tēma'],
    theme: ['Apple', 'Яблоко', 'Ābols'],
    upload: ['Put it on the wall', 'Повесить на стену', 'Likt uz sienas'],
    uploading: ['Uploading…', 'Загружаю…', 'Augšupielādē…'],
    posted: ['Today’s sketch is on the wall ✓', 'Рисунок дня уже на стене ✓', 'Dienas skice ir uz sienas ✓'],
    levelUp: ['New level!', 'Новый уровень!', 'Jauns līmenis!'],
    egg: ['Egg', 'Яйцо', 'Ola'],
    join: [['Join the challenge', 'and the community'], ['Присоединяйтесь', 'к челленджу и сообществу'], ['Pievienojieties', 'izaicinājumam un kopienai']],
  };
  const tr = k => T[k][LI];
  const END = 21, FIN = 16.5; // секунд; с FIN — финал

  // ---------- время ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = k => k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
  const back = k => 1 + 2.7 * (k - 1) ** 3 + 1.7 * (k - 1) ** 2; // с перелётом — «выпрыгивает»
  const seg = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
  const lerp = (a, b, k) => a + (b - a) * k;
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };

  // ---------- Полли: голубая, как талисман сайта, в красном берете художника ----------
  const lk = Object.assign({}, B.looks(27), { body: '#8C8FC9', hat: { t: 'beret', c: '#E0443A' }, shoe: null });
  const FR = [0, 1].map(f => B.spriteHD(lk, f));
  const BEAK = (() => { // кончик клюва в кадре 0 (пиксели спрайта) — к нему крепится карандаш
    const c = FR[0], d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let bx = 0, by = 0;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4; if (d[i] === 0xF2 && d[i + 1] === 0xA7 && d[i + 2] === 0x3B && x >= bx) { bx = x; by = y; } }
    return { dx: (bx + 1 - (20 + B.HO)) / 2, dy: (by + .5 - (B.HB + 1)) / 2 }; // от середины тела и линии лапок, в пикселях комнаты
  })();
  function drawBird(g, b) {
    const c = FR[b.f], x = Math.round(b.x * 2) / 2, y = Math.round(b.y * 2) / 2;
    g.save();
    if (b.dir < 0) { g.translate(x * 2, 0); g.scale(-1, 1); }
    g.drawImage(c, x - (20 + B.HO) / 2, y - (B.HB + 1) / 2, c.width / 2, c.height / 2);
    g.restore();
  }

  // ---------- яблоко 20×20 клеток: контур карандашом, черенок, листик, заливка штрихами ----------
  const APPLE = (() => {
    const inS = (x, y) => { const X = x + .5, Y = y + .5;
      return Y > 4 && (Math.hypot(X - 7.3, Y - 11.6) < 6.4 || Math.hypot(X - 12.7, Y - 11.6) < 6.4) && Math.hypot(X - 10, Y - 4.6) > 1.9 && Math.hypot(X - 10, Y - 18.9) > 1.3; };
    const out = [], stem = [], leaf = [], fill = [];
    for (let y = 0; y < 20; y++) for (let x = 0; x < 20; x++) {
      const X = x + .5, Y = y + .5;
      if (inS(x, y)) {
        if (!inS(x - 1, y) || !inS(x + 1, y) || !inS(x, y - 1) || !inS(x, y + 1)) out.push({ x, y, c: '#3A2530', a: Math.atan2(X - 10, -(Y - 12)) });
        else fill.push({ x, y, c: Math.hypot(X - 5.6, Y - 9.4) < 1.4 ? '#FFC2C0' : (X - 10) * .5 + (Y - 12) * .8 > 3.2 ? '#B83A3F' : '#E5484D' });
        continue;
      }
      const u = (X - 13.6) * Math.cos(.35) + (Y - 2.6) * Math.sin(.35), v = -(X - 13.6) * Math.sin(.35) + (Y - 2.6) * Math.cos(.35);
      if ((u / 3.3) ** 2 + (v / 1.5) ** 2 <= 1) leaf.push({ x, y, c: (u / 3.3) ** 2 + (v / 1.5) ** 2 > .45 ? '#2E6B47' : '#4CC38A' });
    }
    [[10, 5], [10, 4], [10, 3], [9, 2], [9, 1]].forEach(([x, y]) => stem.push({ x, y, c: '#7A4A28' }));
    out.sort((p, q) => (p.a + 7) % 7 - (q.a + 7) % 7); // по кругу от черенка — как ведут линию
    fill.sort((p, q) => (p.x + p.y) - (q.x + q.y) || p.y - q.y); // штрихи по диагонали
    return [...out, ...stem, ...leaf, ...fill];
  })();
  const DRAW = [2.3, 7.3];
  const drawn = t => Math.floor(APPLE.length * seg(t, DRAW[0], DRAW[1]));
  function paintApple(g, n, x0, y0, cs) { for (let i = 0; i < n; i++) { const p = APPLE[i]; R(g, x0 + p.x * cs, y0 + p.y * cs, cs, cs, p.c); } }

  // ---------- комната: уголок художника ----------
  const room = { floor: 'walnut', view: 'autumn', curtain: 'sunny', items: [
    { k: 'furn', v: 'lamp', x: 99 },
    { k: 'deco', v: 'painting', x: 101, y: 30 },
    { k: 'furn', v: 'painttubes', x: 149 },
    { k: 'furn', v: 'plant', x: 160 },
  ] };
  const EZ = { x: 128, y: GY - 32 }, CS = 4 / 7, AX = 131 + 2 / 7, AY = 86 + 2 / 7; // мольберт, клетка яблока, угол яблока на листе
  function drawEasel(g, t) {
    const p = (x, y, w, h, c) => R(g, EZ.x + x, EZ.y + y, w, h, c);
    p(8, 0, 2, 32, '#A0673C'); p(2, 10, 2, 22, '#A0673C'); p(14, 10, 2, 22, '#A0673C');
    p(0, 3, 18, 16, OUT); p(1, 4, 16, 14, '#FBF6EC'); p(1, 4, 16, .5, '#FFFFFF'); // лист на мольберте
    p(7, 2.5, 4, 2, '#C9CDD6'); // зажим
    p(-1, 18, 20, 2, '#7A4A30'); p(-1, 18, 20, .5, '#A0673C');
    paintApple(g, drawn(t), AX, AY, CS);
  }

  // ---------- сценарий (секунды) ----------
  const PH_UP = [8.7, 9.2], PH_DOWN = [13.6, 14.0];   // телефон крупно: выезжает снизу и уезжает
  const SNAP = 9.9, TAP = 11.0, LOAD = [11.1, 11.9], POP = 12.0;
  const JOY = 14.0;
  // куда тянется кончик карандаша: последняя нарисованная клетка
  const tip = t => { const n = drawn(t); const p = APPLE[Math.max(0, Math.min(APPLE.length - 1, n - 1))]; return { x: AX + (p.x + .5) * CS, y: AY + (p.y + .5) * CS, c: p.c }; };
  function bird(t) {
    const b = { x: 117, y: GY, dir: 1, f: 0 };
    const walkF = () => Math.floor(t / .16) % 2;
    if (t < 2.0) { b.x = lerp(86, 117, ease(seg(t, .4, 2.0))); b.f = t > .4 ? walkF() : 0; return b; }
    if (t < DRAW[1] + .2) { // рисует: тянется за кончиком карандаша (сглажено, чтобы не дёргалась)
      let sx = 0, sy = 0; for (let k = 0; k < 8; k++) { const p = tip(Math.max(DRAW[0], t - k * .06)); sx += p.x; sy += p.y; }
      sx /= 8; sy /= 8;
      b.x = clamp(sx - 10 - BEAK.dx, 114, 121); b.y = GY - clamp(GY + BEAK.dy - sy - 1, 0, 5);
      if (t < DRAW[0] + .3) { const k = ease(seg(t, DRAW[0] - .1, DRAW[0] + .3)); b.x = lerp(117, b.x, k); b.y = lerp(GY, b.y, k); }
      return b;
    }
    if (t < 8.0) { b.x = lerp(118, 112, ease(seg(t, DRAW[1] + .2, 7.9))); return b; } // отходит — любуется
    b.x = 112;
    if (t < 8.4) { b.y = GY - 3 * Math.sin(Math.PI * seg(t, 8.0, 8.4)); return b; }   // подпрыгнула: получилось!
    if (t < JOY + .2) return b;
    const k = (t - JOY - .2) * 7; b.y = GY - 6 * Math.abs(Math.sin(k)); // прыгает от радости
    if (Math.floor(k / Math.PI) % 4 === 3) b.dir = -1;
    return b;
  }

  // ---------- своё поверх комнаты ----------
  function drawPencil(g, t, b) {
    if (t < DRAW[0] - .1 || t > DRAW[1] + .2) return;
    const p = tip(t), bx = b.x + BEAK.dx - .5, by = b.y + BEAK.dy, dx = p.x - bx, dy = p.y - by, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const col = p.c === '#3A2530' ? '#E9C46A' : p.c, step = .5; // карандаш того цвета, которым рисует (контур — простым, жёлтым)
    for (let s = 0; s <= L - .8; s += step) R(g, Math.round((bx + ux * s) * 2) / 2 - .25, Math.round((by + uy * s) * 2) / 2 + .25, 1, 1, OUT); // тень снизу — карандаш виден на яблоке
    for (let s = 0; s <= L; s += step) {
      const c = s < 1.2 ? '#F28AB2' : s > L - .8 ? (p.c === '#3A2530' ? '#3A2530' : p.c) : s > L - 2.2 ? '#F2D7A8' : col;
      R(g, Math.round((bx + ux * s) * 2) / 2 - .25, Math.round((by + uy * s) * 2) / 2 - .25, 1, 1, c);
    }
  }
  function drawHandPhone(g, t, b) { // телефон в крыле, когда фотографирует и пока телефон крупно
    if (t < 8.4 || t > PH_DOWN[1]) return;
    const x = b.x + BEAK.dx - 2, y = b.y + BEAK.dy - 1 + (1 - ease(seg(t, 8.4, 8.6))) * 4;
    R(g, x - .5, y - .5, 4, 7, OUT); R(g, x, y, 3, 6, '#3A3550'); R(g, x + .5, y + .5, 2, 4.5, t > SNAP && t < SNAP + .15 ? '#FFFFFF' : '#7EA6E8');
  }
  // бейдж-медалька: круг, белое кольцо, пиксельное яйцо (как .sw-medal и spriteSvg('egg') на сайте)
  const EGG = ['.....dddd.....', '....dwwwwd....', '...dwwwwwwd...', '...dwwswwwd...', '..dwwwwwwwwd..', '..dwwwwwswwd..',
    '..dwswwwwwwd..', '..dwwwwwwwwd..', '..dwwwwwwwwd..', '...dwwwwwwd...', '....dwwwwd....', '.....dddd.....'];
  const EGG_C = { d: '#1a1528', w: '#ffffff', s: '#5e5a9c' };
  function medal(g, cx, cy, r, px) {
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(cx, cy, r + px * .5, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#F4F0FA'; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.08)'; g.beginPath(); g.arc(cx, cy + px * .4, r, .15 * Math.PI, .85 * Math.PI); g.fill();
    EGG.forEach((row, y) => [...row].forEach((ch, x) => { if (EGG_C[ch]) R(g, cx + (x - 7) * px, cy + (y - 6) * px, px, px, EGG_C[ch]); }));
  }
  // конфетти из птички (цвета — как у праздника на сайте)
  const CONF = ['#F0A987', '#E9A93B', '#7F81BF', '#D85A30', '#4CC38A', '#F28AB2'];
  function drawJoy(g, t, b) {
    if (t < JOY) return;
    for (let i = 0; i < 40; i++) {
      const t0 = JOY + .2 + (i % 2) * .9, a = t - t0; if (a < 0 || a > 1.8) continue;
      const vx = (rnd(i) - .5) * 40, vy = -30 - rnd(i + 7) * 25, x = 112 + vx * a, y = GY - 20 + vy * a + 32 * a * a;
      R(g, Math.round(x * 2) / 2, Math.round(y * 2) / 2, 1, i % 3 ? 1 : .5, CONF[i % CONF.length]);
    }
    const k = seg(t, JOY + .1, JOY + .5), my = b.y - 34 - Math.sin(t * 4) * 1; // медалька над головой
    if (k > 0) { g.save(); g.globalAlpha = k; medal(g, Math.round(b.x * 2) / 2, Math.round(my * 2) / 2, 5.5, .5); g.restore();
      if (Math.floor(t * 4) % 2) { R(g, b.x + 7, my - 5, .5, 1.5, '#FFF3B0'); R(g, b.x + 6.5, my - 4.5, 1.5, .5, '#FFF3B0'); } else { R(g, b.x - 7, my + 2, .5, 1.5, '#FFF3B0'); R(g, b.x - 7.5, my + 2.5, 1.5, .5, '#FFF3B0'); } }
  }

  function film(g, ms) {
    const t = ms / 1000, b = bird(t);
    drawEasel(g, t);
    if (t < 2.0) { g.save(); g.beginPath(); g.rect(CAM - 2, 0, RW, RH); g.clip(); drawBird(g, b); g.restore(); } else drawBird(g, b);
    drawPencil(g, t, b);
    drawHandPhone(g, t, b);
    drawJoy(g, t, b);
  }

  // ---------- кадр видео ----------
  const box = document.getElementById('room');
  const wallPaint = w => { // спокойные обои: светло-сиреневые в мелкий горошек, внизу панель
    R(w, 0, 0, RW, FY, '#EFE9F6'); for (let y = 3; y < 64; y += 6) for (let x = (y / 6 % 2) * 3 + 1; x < RW; x += 6) R(w, x, y, 1, 1, '#DDD3EC');
    R(w, 0, 64, RW, FY - 64, '#DCD0EA'); R(w, 0, 64, RW, 1.5, '#B9A8D3'); R(w, 0, 65.5, RW, .5, '#FFFFFF');
  };
  const api = RM.mount(box, { room, wallPaint, id: 27, nick: 'polly', film: (g, now) => film(g, now), scale: S });
  const cv = box.querySelector('canvas'), vc = document.getElementById('video'), v = vc.getContext('2d');
  v.imageSmoothingEnabled = false;
  function stars(t) {
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(rnd(i) * VW / 12) * 12, top = i % 2 === 0, y = top ? Math.floor(rnd(i + 9) * (ROOM_Y - 24) / 12) * 12 : ROOM_Y + RH * S + 12 + Math.floor(rnd(i + 9) * (ROOM_Y - 24) / 12) * 12;
      if (Math.sin(t * 2.2 + i * 1.7) <= -.3) continue;
      v.fillStyle = i % 5 ? '#534AB7' : PEACH; v.fillRect(x, y, 12, 12);
      if (i % 4 === 0) { v.fillRect(x - 12, y, 36, 12); v.fillRect(x, y - 12, 12, 36); }
    }
  }
  const rr = (x, y, w, h, r, c) => { v.fillStyle = c; v.beginPath(); v.roundRect(x, y, w, h, r); v.fill(); };
  const text = (s, x, y, font, c, align = 'center') => { v.font = font; v.fillStyle = c; v.textAlign = align; v.textBaseline = 'middle'; v.fillText(s, x, y); };

  // фото рисунка: лист на деревянном столе, яблоко крупно (в видоискателе и в карточке загрузки)
  function photo(x, y, w, h, n = APPLE.length) {
    v.save(); v.beginPath(); v.rect(x, y, w, h); v.clip();
    v.fillStyle = '#B98A5E'; v.fillRect(x, y, w, h);
    for (let i = 0; i < 9; i++) { v.fillStyle = i % 2 ? '#A97A50' : '#C49669'; v.fillRect(x, y + h * (i + .3) / 9, w, 4); }
    const pw = w * .74, ph = pw * .9, cs = Math.floor(pw * .72 / 20);
    v.translate(x + w / 2, y + h / 2); v.rotate(-.05);
    v.fillStyle = 'rgba(40,20,10,.28)'; v.fillRect(-pw / 2 + 10, -ph / 2 + 14, pw, ph);
    v.fillStyle = '#FBF6EC'; v.fillRect(-pw / 2, -ph / 2, pw, ph);
    paintApple(v, n, -10 * cs, -10 * cs + 4, cs);
    v.restore();
  }
  // экран телефона: камера → сайт с загрузкой → праздник «Новый уровень!»
  function screen(t, x, y, w, h) {
    v.save(); v.beginPath(); v.roundRect(x, y, w, h, 64); v.clip();
    if (t < 10.4) { // камера
      v.fillStyle = '#000'; v.fillRect(x, y, w, h);
      const sway = t < SNAP ? Math.sin(t * 3) * 6 : 0;
      photo(x + sway, y + 130, w, h - 400);
      v.strokeStyle = 'rgba(255,255,255,.85)'; v.lineWidth = 6;
      const fx = x + 60, fy = y + 190, fw = w - 120, fh = h - 520, L = 50;
      [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fh, 1, -1], [fx + fw, fy + fh, -1, -1]].forEach(([cx, cy, sx, sy]) => { v.beginPath(); v.moveTo(cx + sx * L, cy); v.lineTo(cx, cy); v.lineTo(cx, cy + sy * L); v.stroke(); });
      const press = t > SNAP - .12 && t < SNAP + .1 ? .82 : 1, sy = y + h - 135;
      v.fillStyle = '#FFFFFF'; v.beginPath(); v.arc(x + w / 2, sy, 72, 0, Math.PI * 2); v.fill();
      v.fillStyle = '#000'; v.beginPath(); v.arc(x + w / 2, sy, 62, 0, Math.PI * 2); v.fill();
      v.fillStyle = '#FFFFFF'; v.beginPath(); v.arc(x + w / 2, sy, 54 * press, 0, Math.PI * 2); v.fill();
      if (t > SNAP && t < SNAP + .1) { /* затвор — белая вспышка ниже */ }
    } else { // сайт
      v.fillStyle = BG; v.fillRect(x, y, w, h);
      R(v, x, y, w, 150, '#22163F');
      text('pigeonpolly.com', x + w / 2, y + 95, '600 40px Fraunces, Georgia, serif', '#F3EFFA');
      text(tr('today'), x + w / 2, y + 220, '700 32px Karla, system-ui, sans-serif', '#C9B8E8');
      text(tr('theme'), x + w / 2, y + 290, '600 76px Fraunces, Georgia, serif', '#F3EFFA');
      const cx = x + 50, cy = y + 360, cw = w - 100, ch = 470;
      rr(cx - 6, cy - 6, cw + 12, ch + 12, 30, 'rgba(255,255,255,.12)');
      v.save(); v.beginPath(); v.roundRect(cx, cy, cw, ch, 24); v.clip(); photo(cx, cy, cw, ch); v.restore();
      const by = y + 930, bw = w - 140, bh = 110, loading = t >= LOAD[0], done = t >= LOAD[1];
      const sq = t > TAP - .08 && t < TAP + .1 ? .96 : 1;
      v.save(); v.translate(x + w / 2, by); v.scale(sq, sq);
      rr(-bw / 2, -bh / 2, bw, bh, bh / 2, done ? '#4CC38A' : PEACH);
      text(done ? '✓' : loading ? tr('uploading') : tr('upload'), 0, 3, '700 42px Karla, system-ui, sans-serif', BG);
      v.restore();
      if (t > TAP - .05 && t < TAP + .45) { const k = seg(t, TAP - .05, TAP + .45); v.fillStyle = `rgba(255,255,255,${.5 * (1 - k)})`; v.beginPath(); v.arc(x + w / 2 + 120, by, 30 + 90 * k, 0, Math.PI * 2); v.fill(); }
      if (loading) {
        rr(x + 90, by + 90, w - 180, 16, 8, 'rgba(255,255,255,.15)');
        rr(x + 90, by + 90, (w - 180) * ease(seg(t, LOAD[0], LOAD[1])), 16, 8, PEACH);
      }
      if (done) text(tr('posted'), x + w / 2, by + 160, '700 30px Karla, system-ui, sans-serif', '#C9B8E8');
      if (t >= POP) { // праздник: как .sw-pop на сайте
        v.fillStyle = `rgba(26,21,40,${.6 * seg(t, POP, POP + .2)})`; v.fillRect(x, y, w, h);
        const k = back(seg(t, POP, POP + .45)), px = x + w / 2, py = y + h / 2 - 20;
        v.save(); v.translate(px, py); v.scale(Math.max(.01, .5 + .5 * k), Math.max(.01, .5 + .5 * k)); v.globalAlpha = seg(t, POP, POP + .15);
        rr(-240, -230, 480, 460, 44, '#FFFDF8');
        medal(v, 0, -60, 105, 11);
        text(tr('levelUp'), 0, 110, '600 50px Fraunces, Georgia, serif', BG);
        text(tr('egg'), 0, 175, '700 38px Karla, system-ui, sans-serif', '#6B5AA8');
        for (let i = 0; i < 16; i++) { // брызги конфетти от медали
          const a = seg(t, POP + .2, POP + 1.2); if (a <= 0 || a >= 1) continue;
          const ang = i * Math.PI / 8, d = 40 + 260 * (1 - (1 - a) ** 3);
          v.globalAlpha = 1 - a; v.fillStyle = ['#F0A987', '#E9A93B', '#7F81BF', '#D85A30'][i % 4];
          v.beginPath(); v.arc(Math.cos(ang) * d, -60 + Math.sin(ang) * d, 14, 0, Math.PI * 2); v.fill();
        }
        v.restore();
      }
    }
    v.restore();
  }
  function phone(t) {
    const up = ease(seg(t, PH_UP[0], PH_UP[1])), down = ease(seg(t, PH_DOWN[0], PH_DOWN[1])), k = up * (1 - down);
    if (k <= 0) return;
    v.fillStyle = `rgba(26,21,40,${.6 * k})`; v.fillRect(0, 0, VW, VH);
    const w = 660, h = 1340, x = (VW - w) / 2, y = (VH - h) / 2 + (1 - k) * (VH - (VH - h) / 2 + 40);
    rr(x - 26, y - 26, w + 52, h + 52, 96, '#141020'); rr(x - 20, y - 20, w + 40, h + 40, 90, '#2E2744');
    screen(t, x, y, w, h);
    rr(x + w / 2 - 70, y + 18, 140, 34, 17, '#141020'); // вырез камеры
    if (t > SNAP && t < SNAP + .3) { v.fillStyle = `rgba(255,255,255,${1 - seg(t, SNAP, SNAP + .3)})`; v.beginPath(); v.roundRect(x, y, w, h, 64); v.fill(); } // вспышка
  }
  function finale(t) {
    const k = seg(t, FIN, FIN + .4);
    v.fillStyle = BG; v.fillRect(0, 0, VW, VH); stars(t);
    v.globalAlpha = k;
    v.fillStyle = 'rgba(240,169,135,.18)'; v.beginPath(); v.arc(VW / 2, 700, 330, 0, Math.PI * 2); v.fill();
    const sc = k < 1 ? .7 + .3 * ease(k) : 1, pw = 440 * sc, ph = 400 * sc, cs = Math.floor(16 * sc);
    v.save(); v.translate(VW / 2, 700); v.rotate(-.06);
    v.fillStyle = 'rgba(0,0,0,.3)'; v.fillRect(-pw / 2 + 14, -ph / 2 + 18, pw, ph);
    v.fillStyle = '#FBF6EC'; v.fillRect(-pw / 2, -ph / 2, pw, ph);
    paintApple(v, APPLE.length, -10 * cs, -10 * cs + 6, cs);
    v.restore();
    const mk = back(seg(t, FIN + .5, FIN + .95)); // медалька «Яйцо» прилетает в угол рисунка
    if (mk > 0) { v.save(); v.translate(VW / 2 + 210, 880); v.scale(mk, mk); v.rotate(Math.sin(t * 2) * .05); medal(v, 0, 0, 92, 10); v.restore(); }
    v.globalAlpha = seg(t, FIN + .4, FIN + .8);
    text('pigeonpolly.com', VW / 2, 1200, '600 104px Fraunces, Georgia, serif', '#F3EFFA');
    const [l1, l2] = tr('join');
    v.globalAlpha = seg(t, FIN + .8, FIN + 1.2);
    text(l1, VW / 2, 1340, '700 62px Karla, system-ui, sans-serif', PEACH);
    v.globalAlpha = seg(t, FIN + 1.0, FIN + 1.4);
    text(l2, VW / 2, 1420, '700 62px Karla, system-ui, sans-serif', PEACH);
    v.globalAlpha = 1;
  }
  function draw(n) {
    const t = n / FPS;
    if (t >= FIN) return finale(t);
    api.frame(t * 1000);
    v.fillStyle = BG; v.fillRect(0, 0, VW, VH); stars(t);
    v.drawImage(cv, Math.round(CAM * S), 0, VW, RH * S, 0, ROOM_Y, VW, RH * S);
    if (t > 15.8) { // круг сходится на Полли
      const b = bird(t), cx = (b.x - CAM) * S, cy = ROOM_Y + (b.y - 14) * S, r = lerp(1300, 0, ease(seg(t, 15.8, FIN)));
      v.fillStyle = BG; v.beginPath(); v.rect(0, 0, VW, VH); v.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2, true); v.fill('evenodd');
    }
    phone(t);
  }
  window.FILM = {
    name: 'apple', frames: END * FPS, langFrom: Math.floor(PH_UP[0] * FPS), keys: [4.6, 9.6, 12.8, 15.0, 18.5],
    frame: n => { draw(n); return vc.toDataURL('image/png'); },
    ready: Promise.all([document.fonts.load('600 104px Fraunces'), document.fonts.load('700 60px Karla')]).catch(() => null).then(() => true),
  };
})();
