// Видео №3 для соцсетей: «Школа Полли» (/polly-helps/, docs/challenge.md) — зовёт пройти уроки и получить пиксельный диплом.
// 1080×1920, 30 fps, 26 с, только EN (как ролики 15). Всё пиксельное: сцена рисуется на холсте 180×320 и растягивается ×6 без сглаживания,
// надписи — Press Start 2P поверх. Полли — та же, что на странице школы (14×15, фартук и берет, polly-school.js).
// Музыка — tools/video/school_music.py, время событий там совпадает с этим сценарием (такт = 2 с, 120 ударов в минуту).
// Рендер: tools/video/render.py --film school --lang en
(() => {
  const FPS = 30, VW = 1080, VH = 1920, U = 6, LW = VW / U, LH = VH / U, END = 26;
  const BG = '#2B1A51', DARK = '#1a1528', PEACH = '#F0A987', GOLD = '#E9A93B', LILAC = '#C9B8E8', WHITE = '#F3EFFA', PAPER = '#FBF6EC', INK = '#2B1A51';
  const PIX = '"Press Start 2P", monospace';

  // ---------- время ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = k => k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
  const back = k => 1 + 2.7 * (k - 1) ** 3 + 1.7 * (k - 1) ** 2;
  const seg = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
  const lerp = (a, b, k) => a + (b - a) * k;
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const beat = t => (t % .5) / .5; // доля четверти: 0 — удар
  const hop = (t, h) => Math.round(h * Math.sin(Math.PI * beat(t)));

  // ---------- холсты ----------
  const lo = document.createElement('canvas'); lo.width = LW; lo.height = LH;
  const g = lo.getContext('2d');
  const vc = document.getElementById('video'), v = vc.getContext('2d');
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };

  // ---------- пиксельные фигуры ----------
  const ring = (cx, cy, r, w = 2) => { // точки кольца по кругу от 12 часов по часовой — как ведут карандаш
    const out = [];
    for (let y = -r - w; y <= r + w; y++) for (let x = -r - w; x <= r + w; x++) { const d = Math.hypot(x + .5, y + .5); if (d <= r + w / 2 && d > r - w / 2) out.push({ x: cx + x, y: cy + y, a: (Math.atan2(x + .5, -(y + .5)) + Math.PI * 2) % (Math.PI * 2) }); }
    return out.sort((p, q) => p.a - q.a);
  };
  const disk = (cx, cy, r, c) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (Math.hypot(x + .5, y + .5) <= r) R(cx + x, cy + y, 1, 1, c); };
  const line = (x0, y0, x1, y1, w, c) => { const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2)); for (let i = 0; i <= n; i++) R(x0 + (x1 - x0) * i / n - w / 2, y0 + (y1 - y0) * i / n - w / 2, w, w, c); };
  const pts = (list, n, c) => { for (let i = 0; i < Math.min(n, list.length); i++) R(list[i].x, list[i].y, 1, 1, c); };
  const sprite = (rows, pal, x0, y0, s = 1) => rows.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) R(x0 + x * s, y0 + y * s, s, s, pal[ch]); }));

  // ---------- Полли (как на странице школы) ----------
  const P = ['......rr......', '.....rrrr.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbaaaad...', '..dbbsaaaad...', '.dbbssaaaad...', 'dbbssbappad...', 'dbbbbaaaad....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const PB = P.map((r, y) => y === 3 ? r.replace('ww', 'bb') : y === 4 ? r.replace('wk', 'dd') : r); // моргнула
  const PC = { d: DARK, b: '#7f81bf', s: '#5e5a9c', w: '#fff', k: DARK, o: '#f2a73b', a: PEACH, p: '#D85A30', r: '#D85A30', y: '#F2D27A', e: '#F28AB2', g: '#3A2530' };
  const PENCIL = ['.............eyyyyg', '.............eyyyyg']; // карандаш в клюве (ряды 4–5)
  function polly(cx, bottom, s, o = {}) { // cx — середина, bottom — низ лапок, s — размер пикселя спрайта
    const blink = o.t !== undefined && (o.t % 3.1) > 2.95;
    const x0 = cx - 7 * s, y0 = bottom - 15 * s;
    g.save();
    if (o.dir < 0) { g.translate(cx * 2, 0); g.scale(-1, 1); }
    sprite(blink ? PB : P, PC, x0, y0, s);
    if (o.pencil) sprite(PENCIL, PC, x0, y0 + 4 * s, s);
    g.restore();
  }

  // ---------- фон: звёзды мигают ----------
  function stars(t, n = 46) {
    for (let i = 0; i < n; i++) {
      if (Math.sin(t * 2.4 + i * 1.7) <= -.25) continue;
      const x = Math.floor(rnd(i) * LW / 2) * 2, y = Math.floor(rnd(i + 9) * LH / 2) * 2;
      R(x, y, 2, 2, i % 5 ? '#4A3C8C' : PEACH);
      if (i % 4 === 0) { R(x - 2, y, 6, 2, i % 5 ? '#4A3C8C' : PEACH); R(x, y - 2, 2, 6, i % 5 ? '#4A3C8C' : PEACH); }
    }
  }

  // ---------- надписи (поверх, в настоящих пикселях) ----------
  function text(s, x, y, size, c, o = {}) {
    v.save();
    v.font = `${o.font ? o.font : `${size}px ${PIX}`}`; v.textAlign = o.align || 'center'; v.textBaseline = 'middle';
    const w = v.measureText(s).width, max = o.max || 980, k = w > max ? max / w : 1;
    v.translate(x, y); v.scale(k * (o.sc || 1), k * (o.sc || 1)); v.globalAlpha = o.a ?? 1;
    if (o.shadow !== false) { v.fillStyle = DARK; v.fillText(s, size / 8, size / 8); }
    v.fillStyle = c; v.fillText(s, 0, 0);
    v.restore();
  }
  // подпись сцены сверху: строка 1 мелко, строка 2 крупно; выпрыгивает
  function caption(t, t0, t1, l1, l2, c2 = PEACH) {
    if (t < t0 || t >= t1) return;
    const k1 = back(seg(t, t0, t0 + .3)), k2 = back(seg(t, t0 + .25, t0 + .55));
    if (k1 > 0) text(l1, VW / 2, 150, 40, WHITE, { sc: Math.max(.01, k1) });
    if (k2 > 0) text(l2, VW / 2, 250, 76, c2, { sc: Math.max(.01, k2) });
  }

  // ---------- печать «от Полли»: зелёный круг с галочкой ----------
  const CHECK = ['..........', '........xx', '.......xx.', '......xx..', 'xx...xx...', '.xx.xx....', '..xxx.....', '...x......'];
  function stampMark(cx, cy, r, s = 1) {
    disk(cx, cy, r + 1, DARK); disk(cx, cy, r, '#4CC38A'); disk(cx - Math.round(r / 3), cy - Math.round(r / 3), Math.max(1, Math.round(r / 4)), '#7FE0AE');
    sprite(CHECK, { x: '#FFFFFF' }, cx - 5 * s, cy - 4 * s, s);
  }

  // ---------- мольберт и лист ----------
  const PAPER_BOX = { x: 62, y: 82, w: 108, h: 104 };
  function easel() {
    const { x, y, w, h } = PAPER_BOX;
    R(x + w / 2 - 2, y - 10, 4, 180, '#A0673C'); R(x + 10, y + 20, 4, 160, '#8A5530'); R(x + w - 14, y + 20, 4, 160, '#8A5530');
    R(x - 2, y - 2, w + 4, h + 4, DARK); R(x, y, w, h, PAPER); R(x, y, w, 1, '#FFFFFF');
    R(x + w / 2 - 8, y - 4, 16, 5, '#C9CDD6'); R(x + w / 2 - 8, y - 4, 16, 1, '#E6E8EE');
    R(x - 6, y + h + 2, w + 12, 5, '#7A4A30'); R(x - 6, y + h + 2, w + 12, 1, '#A0673C');
  }
  const C0 = { x: 116, y: 132, r: 30 };
  const CIRCLE = ring(C0.x, C0.y, C0.r, 2.4);
  // часы: петелька, две стрелки, риски; сковородка: ручка и яичница
  function clock(k) {
    if (k <= 0) return;
    const p = ring(C0.x, C0.y - C0.r - 5, 4, 2); pts(p, p.length * clamp(k * 3), INK);
    if (k > .3) for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, l = i % 3 ? 2 : 4; line(C0.x + Math.sin(a) * (C0.r - 4), C0.y - Math.cos(a) * (C0.r - 4), C0.x + Math.sin(a) * (C0.r - 4 - l), C0.y - Math.cos(a) * (C0.r - 4 - l), 1.4, INK); }
    if (k > .55) line(C0.x, C0.y, C0.x, C0.y - 20 * seg(k, .55, .8), 2.4, INK);
    if (k > .75) line(C0.x, C0.y, C0.x + 14 * seg(k, .75, 1), C0.y, 2.4, INK);
    disk(C0.x, C0.y, 2, '#D85A30');
  }
  function pan(k, cx = C0.x, cy = C0.y, r = C0.r) {
    if (k <= 0) return;
    const hx = cx - Math.cos(Math.PI / 4) * r, hy = cy + Math.sin(Math.PI / 4) * r, L = 34 * seg(k, 0, .45);
    line(hx, hy, hx - L * .72, hy + L * .69, 5, INK); line(hx, hy, hx - L * .72, hy + L * .69, 2.4, '#5A4A6A');
    if (k > .45) { const e = back(seg(k, .45, .8)); // белок кляксой, желток
      for (let i = 0; i < 9; i++) { const a = i * Math.PI * 2 / 9, d = 9 + rnd(i + 3) * 5; disk(Math.round(cx + Math.cos(a) * d * .55 * e), Math.round(cy + Math.sin(a) * d * .55 * e), Math.max(1, Math.round(6 * e)), '#FFFFFF'); }
      if (k > .7) { disk(cx + 1, cy - 1, Math.round(6 * back(seg(k, .7, 1))), '#F2B33B'); R(cx - 2, cy - 4, 2, 2, '#FFE39A'); }
    }
  }

  // ---------- клиент: карточка Мистера Криспера (акварель Алины), уменьшенная в пиксели ----------
  const card = new Image(); card.src = '/site/images/cards/classic/14.jpg';
  const CARD = { x: 100, y: 98, w: 66, h: 92 };
  let cardPix = null;
  const pixCard = () => { if (cardPix) return cardPix; const c = document.createElement('canvas'); c.width = CARD.w; c.height = CARD.h; const q = c.getContext('2d'); q.imageSmoothingQuality = 'high'; q.drawImage(card, 0, 0, CARD.w, CARD.h); return (cardPix = c); };

  // ---------- тропинка 12 уроков ----------
  const LESSONS = ['Shapes', 'Lines', 'Texture', 'Combos', 'Volume', 'Shadows', 'Details', 'Cylinders', 'Ellipses', 'Secrets', 'Layout', 'Collage'];
  const DOTS = LESSONS.map((_, i) => { const row = Math.floor(i / 4), col = i % 4; return { x: 27 + 42 * (row % 2 ? 3 - col : col), y: 92 + row * 52 }; });
  const DIP = { x: 90, y: 252 };
  const STAMP0 = 14.25, STEP = .25; // печати по восьмым (в музыке — те же доли, нота вверх по ладу)
  const stampAt = i => STAMP0 + i * STEP;

  // ---------- диплом ----------
  const SEAL = 19.0;
  function scroll(t) {
    const k = ease(seg(t, 18.0, 18.6)), cy = 146, hh = Math.round(68 * k), x = 14, w = 152;
    R(x - 1, cy - hh - 1, w + 2, hh * 2 + 2, DARK); R(x, cy - hh, w, hh * 2, '#F7E9C8');
    for (let i = 0; i < 26; i++) R(x + 4 + rnd(i) * (w - 8), cy - hh + 4 + rnd(i + 40) * Math.max(0, hh * 2 - 8), 1, 1, '#EAD7AE'); // крапинки бумаги
    if (hh > 8) { R(x + 4, cy - hh + 4, w - 8, 1, GOLD); R(x + 4, cy + hh - 5, w - 8, 1, GOLD); R(x + 4, cy - hh + 4, 1, hh * 2 - 8, GOLD); R(x + w - 5, cy - hh + 4, 1, hh * 2 - 8, GOLD); }
    [cy - hh - 4, cy + hh - 2].forEach(y => { R(x - 6, y - 1, w + 12, 8, DARK); R(x - 5, y, w + 10, 6, '#C99A5B'); R(x - 5, y, w + 10, 2, '#E3BC7E'); R(x - 8, y + 1, 4, 4, '#8A5530'); R(x + w + 4, y + 1, 4, 4, '#8A5530'); });
    return k;
  }
  function seal(t) {
    if (t < SEAL - .25) return;
    const k = t < SEAL ? 3 - 2 * seg(t, SEAL - .25, SEAL) : 1, cx = 136, cy = 186;
    line(cx - 4, cy + 4, cx - 10, cy + 22, 6, '#B23A3A'); line(cx + 4, cy + 4, cx + 10, cy + 22, 6, '#D85A30');
    const r = Math.round(13 * k);
    disk(cx, cy, r + 1, DARK); disk(cx, cy, r, '#D85A30'); disk(cx, cy, Math.round(r * .7), '#B23A3A');
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; R(cx + Math.cos(a) * r - 1, cy + Math.sin(a) * r - 1, 2, 2, '#D85A30'); }
    if (k === 1) sprite(['..y..', '.yyy.', 'yyyyy', '.y.y.'], { y: '#F2D27A' }, cx - 5, cy - 4, 2); // корона-звёздочка
  }
  const CONF = [PEACH, GOLD, '#7F81BF', '#D85A30', '#4CC38A', '#F28AB2'];
  function confetti(t, t0, ox, oy, n = 60) {
    for (let i = 0; i < n; i++) {
      const a = t - t0 - (i % 3) * .5; if (a < 0 || a > 2.4) continue;
      const vx = (rnd(i) - .5) * 160, vy = -90 - rnd(i + 7) * 70;
      R(ox + vx * a, oy + vy * a + 95 * a * a, 2, i % 3 ? 2 : 1, CONF[i % CONF.length]);
    }
  }

  // ---------- переход: пиксельная шторка по диагонали ----------
  const CUTS = [4, 10, 14, 18, 22];
  function wipe(t) {
    for (const c of CUTS) {
      const k = (t - (c - .2)) / .4; if (k < 0 || k > 1) continue;
      const T = 12, n = Math.ceil(LW / T) + Math.ceil(LH / T);
      for (let y = 0; y < LH; y += T) for (let x = 0; x < LW; x += T) {
        const d = (x / T + y / T) / n, on = k < .5 ? d < k * 2 : d > (k - .5) * 2;
        if (on) R(x, y, T, T, (x / T + y / T) % 2 ? '#3D2D6B' : '#342560');
      }
    }
  }

  // ---------- сцены (лист 180×320) ----------
  function sceneIntro(t) {
    const k = ease(seg(t, .2, 1.0)), by = lerp(LH + 10, 238, k) - (t > 1 ? hop(t, 6) : 0);
    disk(90, 200, Math.round(46 + Math.sin(t * 3) * 2), '#3D2D6B');
    polly(90, by, 6, { t });
  }
  function sceneEasel(t) {
    easel();
    const draw = seg(t, 4.3, 5.6), withClock = t < 7.2;
    pts(CIRCLE, CIRCLE.length * draw, INK);
    if (withClock) clock(seg(t, 6.0, 6.9));
    else pan(seg(t, 7.5, 8.6));
    if (t > 7.0 && t < 7.4) { const k = seg(t, 7.0, 7.4); R(PAPER_BOX.x, PAPER_BOX.y, PAPER_BOX.w, PAPER_BOX.h * (k < .5 ? k * 2 : 2 - k * 2), PAPER); if (k > .5) pts(CIRCLE, CIRCLE.length, INK); } // лист стёрт — круг остаётся
    const tip = CIRCLE[Math.min(CIRCLE.length - 1, Math.floor(CIRCLE.length * draw))];
    const by = 262 - (t > 8.8 ? hop(t, 5) : 0), bx = draw > 0 && draw < 1 ? lerp(34, 38, (tip.y - 100) / 64) : 34;
    polly(bx, by, 4, { t, pencil: true });
  }
  function sceneClient(t) {
    // листок ученика со сковородкой
    const pg = { x: 10, y: 136, w: 84, h: 82 };
    R(pg.x - 2, pg.y - 2, pg.w + 4, pg.h + 4, DARK); R(pg.x, pg.y, pg.w, pg.h, PAPER);
    pts(ring(54, 172, 20, 2), 999, INK); pan(1, 54, 172, 20);
    // карточка выезжает справа
    const k = back(seg(t, 10.1, 10.6)), cx = lerp(LW + 10, CARD.x, k);
    if (card.complete) { R(cx - 2, CARD.y - 2, CARD.w + 4, CARD.h + 4, DARK); g.drawImage(pixCard(), Math.round(cx), CARD.y); }
    // облачко клиента
    if (t > 10.7) { const b = back(seg(t, 10.7, 11.0)), w = Math.round(150 * b), h = Math.round(36 * b);
      if (w > 4) { R(15 + (150 - w) / 2 - 1, 72 - h / 2 - 1, w + 2, h + 2, DARK); R(15 + (150 - w) / 2, 72 - h / 2, w, h, '#FFFFFF'); if (b > .9) { R(130, 90, 6, 4, '#FFFFFF'); R(132, 94, 4, 3, '#FFFFFF'); } } }
    // печать на листок
    if (t > 12.25) { const s = t < 12.5 ? 3 - 2 * seg(t, 12.25, 12.5) : 1; stampMark(86, 212, Math.round(11 * s), Math.max(1, Math.round(s))); }
    polly(150, 296 - (t > 12.5 ? hop(t, 6) : 0), 4, { t, dir: -1 });
  }
  function scenePath(t) {
    for (let i = 0; i < 11; i++) { const a = DOTS[i], b = DOTS[i + 1], done = t > stampAt(i + 1); // пунктир между уроками
      const n = Math.hypot(b.x - a.x, b.y - a.y) / 4; for (let s = 1; s < n; s++) R(lerp(a.x, b.x, s / n) - 1, lerp(a.y, b.y, s / n) - 1, 2, 2, done ? PEACH : '#5A4A8C'); }
    { const a = DOTS[11], n = 14; for (let s = 1; s < n; s++) R(lerp(a.x, DIP.x, s / n) - 1, lerp(a.y, DIP.y, s / n) - 1, 2, 2, t > 17.1 ? GOLD : '#5A4A8C'); }
    DOTS.forEach((d, i) => {
      const on = t >= stampAt(i), k = on ? back(seg(t, stampAt(i), stampAt(i) + .2)) : 0;
      disk(d.x, d.y, 13, DARK); disk(d.x, d.y, 12, on ? PEACH : '#3D2D6B');
      if (on) stampMark(d.x + 8, d.y - 8, Math.max(1, Math.round(6 * k)));
    });
    const gl = seg(t, 17.1, 17.4); // диплом в конце тропинки
    if (gl > 0) disk(DIP.x, DIP.y, Math.round(16 + 3 * Math.sin(t * 10)), '#5A3F2E');
    disk(DIP.x, DIP.y, 15, DARK); disk(DIP.x, DIP.y, 14, gl > 0 ? GOLD : '#3D2D6B');
    sprite(['cddddddddddc', 'cpppppppppppc', '.pllllllllp.', '.pppppppppp.', '.plllllpppp.', '.pppppppsss.', 'cpppppppsssc', 'cddddddddddc'].map(r => r.slice(0, 12)), { d: '#C99A5B', c: '#8A5530', p: gl > 0 ? '#F7E9C8' : '#6A5AA0', l: gl > 0 ? '#B8A27A' : '#5A4A8C', s: '#D85A30' }, DIP.x - 12, DIP.y - 8, 2); // свиток с сургучом
    // Полли прыгает по урокам
    const i = clamp(Math.floor((t - STAMP0) / STEP), -1, 11);
    let x, y;
    if (i < 0) { x = DOTS[0].x; y = DOTS[0].y - 12; }
    else { const a = DOTS[i], b = i < 11 ? DOTS[i + 1] : DIP, f = t > stampAt(11) + .4 ? seg(t, 17.1, 17.5) : i < 11 ? seg(t, stampAt(i) + .05, stampAt(i + 1)) : 0;
      x = lerp(a.x, b.x, ease(f)); y = lerp(a.y, b.y, ease(f)) - 12 - Math.sin(Math.PI * f) * 14; }
    polly(x, y, 2, { t, dir: i >= 0 && i < 11 && DOTS[i + 1].x < DOTS[i].x ? -1 : 1 });
  }
  function sceneDiploma(t) {
    const k = scroll(t);
    if (k >= 1) {
      for (let i = 0; i < 12; i++) { const x = 32 + i * 10.5; disk(x, 160, 4, t > 18.7 + i * .04 ? '#4CC38A' : '#E3D3B0'); }
      line(30, 186, 44, 180, 1.5, INK); line(44, 180, 50, 188, 1.5, INK); line(50, 188, 60, 178, 1.5, INK); line(60, 178, 66, 186, 1.5, INK); line(66, 186, 84, 183, 1.5, INK); // подпись Полли
    }
    seal(t);
    confetti(t, SEAL, 90, 140);
    polly(90, 296 - (t > SEAL ? hop(t, 10) : 0), 3, { t });
  }
  function sceneFinal(t) {
    disk(90, 100, Math.round(44 + Math.sin(t * 3) * 2), '#3D2D6B');
    polly(90, 136 - hop(t, 5), 5, { t });
    // маленький диплом в крыле
    R(108, 104, 22, 14, DARK); R(109, 105, 20, 12, '#F7E9C8'); R(111, 108, 14, 1, INK); R(111, 111, 10, 1, INK); disk(125, 115, 3, '#D85A30');
    confetti(t, 22.2, 90, 80, 30);
  }

  // ---------- надписи по сценам ----------
  function words(t) {
    if (t < 4) {
      ['POLLY’S', 'DRAWING', 'SCHOOL'].forEach((s, i) => { const k = back(seg(t, .25 + i * .25, .55 + i * .25)); if (k > 0) text(s, VW / 2, 190 + i * 110, 84, [WHITE, PEACH, GOLD][i], { sc: k }); });
      if (t > 2.0) text('grab a pen', VW / 2, 1560, 44, WHITE, { sc: back(seg(t, 2.0, 2.3)) });
      if (t > 2.5) text('& any paper', VW / 2, 1650, 44, WHITE, { sc: back(seg(t, 2.5, 2.8)) });
    }
    caption(t, 4.1, 6.0, 'Everything is made of', 'SHAPES');
    caption(t, 6.0, 7.4, 'circle + 2 hands =', 'A CLOCK!');
    caption(t, 7.4, 8.8, 'circle + handle =', 'FRYING PAN!');
    caption(t, 8.8, 10.0, 'shapes first,', 'DETAILS LATER', GOLD);
    if (t >= 10 && t < 14) {
      caption(t, 10.0, 14.0, 'Real clients from', 'WOBBLELAND');
      if (t > 10.9) { text('Oh dear! Draw my lost', VW / 2, 72 * U - 22, 26, INK, { shadow: false, a: seg(t, 10.9, 11.1) }); text('things in simple shapes!', VW / 2, 72 * U + 26, 26, INK, { shadow: false, a: seg(t, 11.0, 11.2) }); }
      if (t > 10.6) text('Mr. Crisper', (CARD.x + CARD.w / 2) * U, (CARD.y + CARD.h + 8) * U, 26, LILAC, { a: seg(t, 10.6, 10.9) });
      if (t > 12.5) text('STAMP FROM POLLY!', 52 * U + 40, 238 * U, 32, '#7FE0AE', { sc: back(seg(t, 12.5, 12.8)) });
    }
    if (t >= 14 && t < 18) {
      caption(t, 14.0, 18.0, '12 small', 'LESSONS');
      DOTS.forEach((d, i) => text(LESSONS[i], d.x * U, (d.y + 19) * U, 18, t >= stampAt(i) ? WHITE : '#8C80C0', { max: 230 }));
      DOTS.forEach((d, i) => text(String(i + 1), d.x * U, d.y * U + 4, 36, t >= stampAt(i) ? INK : '#8C80C0', { shadow: false }));
      if (t > 17.1) text('DIPLOMA', DIP.x * U, (DIP.y + 22) * U, 30, GOLD, { sc: back(seg(t, 17.1, 17.4)) });
    }
    if (t >= 18 && t < 22) {
      caption(t, 18.0, 22.0, 'Earn your pixel', 'DIPLOMA!', GOLD);
      const a = seg(t, 18.5, 18.8);
      if (a > 0) {
        text('DIPLOMA', VW / 2, 104 * U, 64, INK, { shadow: false, a });
        text('Polly’s Drawing School', VW / 2, 122 * U, 26, '#8A5530', { shadow: false, a });
        text('12 / 12 lessons', VW / 2, 140 * U, 30, INK, { shadow: false, a });
        text('Polly', 57 * U, 194 * U, 22, '#6B5AA8', { shadow: false, a });
      }
    }
    if (t >= 22) {
      const a = k0 => seg(t, k0, k0 + .35);
      text('pigeonpolly.com', VW / 2, 1010, 100, WHITE, { font: '600 100px Fraunces, Georgia, serif', a: a(22.2), max: 1000 });
      text('Polly’s Drawing School', VW / 2, 1150, 42, PEACH, { a: a(22.5) });
      const bk = back(seg(t, 22.9, 23.3));
      if (bk > 0) { v.save(); v.translate(VW / 2, 1330); v.scale(bk * (1 + .03 * Math.sin(t * 8)), bk * (1 + .03 * Math.sin(t * 8)));
        v.fillStyle = DARK; v.fillRect(-372, -62, 756, 136); v.fillStyle = PEACH; v.fillRect(-380, -70, 756, 136); v.fillStyle = '#F7C6AE'; v.fillRect(-380, -70, 756, 8);
        v.restore(); text('START LESSON 1', VW / 2, 1334, 46, INK, { shadow: false, sc: bk }); }
      text('12 lessons · real clients', VW / 2, 1520, 30, LILAC, { a: a(23.4) });
      text('a pixel diploma at the end', VW / 2, 1580, 30, LILAC, { a: a(23.6) });
    }
  }

  function draw(n) {
    const t = n / FPS;
    g.fillStyle = BG; g.fillRect(0, 0, LW, LH);
    stars(t);
    if (t < 4) sceneIntro(t); else if (t < 10) sceneEasel(t); else if (t < 14) sceneClient(t); else if (t < 18) scenePath(t); else if (t < 22) sceneDiploma(t); else sceneFinal(t);
    // тряска от печатей
    const shake = [12.5, SEAL].some(s => t > s && t < s + .15) ? 2 : 0;
    v.imageSmoothingEnabled = false;
    v.fillStyle = BG; v.fillRect(0, 0, VW, VH);
    v.drawImage(lo, 0, 0, LW, LH, shake * U * (Math.floor(t * 60) % 2 ? 1 : -1), 0, VW, VH);
    words(t);
    // шторка — поверх надписей
    g.clearRect(0, 0, LW, LH); wipe(t); v.drawImage(lo, 0, 0, LW, LH, 0, 0, VW, VH);
  }

  window.FILM = {
    name: 'school', frames: END * FPS, langFrom: END * FPS, keys: [1.6, 6.6, 8.6, 12.9, 17.3, 20.0, 24.5],
    frame: n => { draw(n); return vc.toDataURL('image/png'); },
    ready: Promise.all([document.fonts.load('40px "Press Start 2P"'), document.fonts.load('600 100px Fraunces'), card.decode().catch(() => null)]).catch(() => null).then(() => true),
  };
})();
