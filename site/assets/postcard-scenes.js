// 💌 Рисованные открытки /postcards/ (docs/postcards.md): пиксельные сцены 180×120 с Полли (PollyPet.paint), по праздникам.
// Сцена = функция (g, t): g — маленький холст 180×120, t — фаза петли 0…1 (анимация без шва: всё — sin(2π·t·целое)).
// postcards.js растягивает холст на открытку без сглаживания; сверху — частицы FX. Новая сцена = функция здесь + строка в postcard-designs.js (scene).
(() => {
  const W = 180, H = 120, TAU = Math.PI * 2;
  const S = (t, k = 1, ph = 0) => Math.sin(TAU * (t * k + ph));
  // ---------- растр: всё по целым пикселям ----------
  let g;
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const P = (x, y, c) => R(x, y, 1, 1, c);
  const E = (cx, cy, rx, ry, c) => { g.fillStyle = c; for (let dy = -ry; dy <= ry; dy++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy / (ry + .5)) ** 2))); g.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2 + 1, 1); } };
  const D = (cx, cy, r, c) => E(cx, cy, r, r, c);
  const TRI = (cx, top, h, w, c) => { g.fillStyle = c; for (let i = 0; i < h; i++) { const hw = Math.round(w / 2 * (i + 1) / h); g.fillRect(Math.round(cx - hw), Math.round(top + i), hw * 2 + 1, 1); } };
  const LINE = (x0, y0, x1, y1, c) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) P(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), c); };
  const SKY = (cols, y0 = 0, y1 = H) => { const n = cols.length, hh = (y1 - y0) / n; cols.forEach((c, i) => R(0, y0 + i * hh, W, hh + 1, c)); // полосы с «шахматным» переходом
    for (let i = 1; i < n; i++) { const y = Math.round(y0 + i * hh); for (let x = 0; x < W; x += 2) { P(x + (i % 2), y - 1, cols[i]); P(x + 1 - (i % 2), y, cols[i - 1]); } } };
  // спрайт из строк: '.' — прозрачно, буква — цвет из pal
  const SP = (rows, pal, x, y, k = 1) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch]) R(x + i * k, y + j * k, k, k, pal[ch]); }));
  const polly = (x, y, o) => { if (!(window.PollyPet && PollyPet.paint)) return; const c = polly.c || (polly.c = document.createElement('canvas')); PollyPet.paint(c, { sp: 1, ...o }); g.drawImage(c, Math.round(x), Math.round(y)); }; // 30×37, ноги на y+36
  const stars = (n, y1, seed, t) => { let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n; i++) { const x = r() * W, y = r() * y1, ph = r(); if (S(t, 1 + (i % 2), ph) > -.3) P(x, y, S(t, 2, ph) > .6 ? '#FFFFFF' : '#C9D6F2'); } };
  const bulbs = (pts, t, k = 2) => pts.forEach(([x, y], i) => { const on = S(t, k, i * .17) > -.2; const c = ['#E5484D', '#F6C445', '#5BA3D9', '#6A9A3A', '#F28AB2'][i % 5]; R(x, y, 2, 2, on ? c : '#3a2a2a'); if (on) { P(x - 1, y, c + '66'); P(x + 2, y + 1, c + '66'); } });
  const garland = (x0, x1, y, sag, t) => { const pts = []; for (let x = x0; x <= x1; x++) { const yy = y + Math.round(sag * Math.sin(Math.PI * ((x - x0) % 30) / 30)); P(x, yy, '#2F5D3A'); if ((x - x0) % 6 === 3) pts.push([x - 1, yy + 1]); } bulbs(pts, t); };

  // ---------- маленькие спрайты ----------
  const HEART = ['.aa.aa.', 'abbabba', 'abbbbba', '.abbba.', '..aba..', '...a...'];
  const GIFT = (x, y, w, h, c, rb) => { R(x, y, w, h, c); R(x, y, w, 1, '#00000022'); R(x + Math.floor(w / 2) - 1, y, 2, h, rb); R(x, y + 2, w, 2, rb); P(x + w / 2 - 3, y - 1, rb); P(x + w / 2 - 2, y - 2, rb); P(x + w / 2 + 1, y - 2, rb); P(x + w / 2 + 2, y - 1, rb); R(x, y + h - 1, w, 1, '#00000033'); };
  const EGG = (x, y, a, b, c) => { E(x, y, 4, 5, a); R(x - 4, y - 1, 9, 1, b); R(x - 4, y + 2, 9, 1, b); [[-2, 0], [1, 0], [-1, 3], [2, 3]].forEach(([dx, dy]) => P(x + dx, y + dy, c)); P(x - 2, y - 4, '#FFFFFF99'); };
  const TULIP = (x, y, c, t, ph) => { const sw = Math.round(S(t, 1, ph)); LINE(x, y, x + sw, y - 9, '#4E7A2E'); R(x - 3, y - 5, 2, 3, '#6A9A3A'); R(x + 2, y - 7, 2, 3, '#6A9A3A'); R(x + sw - 2, y - 13, 5, 4, c); P(x + sw - 2, y - 14, c); P(x + sw, y - 14, c); P(x + sw + 2, y - 14, c); P(x + sw - 1, y - 12, '#FFFFFF66'); };
  const PUMPKIN = (x, y, lit, t) => { E(x, y, 9, 7, '#D9701E'); E(x - 4, y, 4, 7, '#E8862E'); E(x + 4, y, 4, 7, '#E8862E'); E(x, y, 2, 7, '#C45F14'); R(x - 1, y - 9, 3, 3, '#4E7A2E');
    if (lit) { const f = S(t, 4) > 0 ? '#FFE27A' : '#FFC23D'; [[-5, -2], [-4, -3], [-3, -2], [3, -2], [4, -3], [5, -2]].forEach(([a, b]) => P(x + a, y + b, f)); R(x - 4, y + 2, 9, 2, f); P(x - 2, y + 2, '#C45F14'); P(x + 2, y + 2, '#C45F14'); } };
  const BALLOON = (x, y, c, t, ph) => { const dy = Math.round(S(t, 1, ph) * 2); LINE(x, y + 8 + dy, x + Math.round(S(t, 1, ph + .3)), y + 26, '#8A7A7A'); E(x, y + dy, 5, 7, c); P(x - 2, y - 4 + dy, '#FFFFFFAA'); P(x - 3, y - 3 + dy, '#FFFFFF77'); P(x, y + 8 + dy, c); };
  const FLAGS = (x0, x1, y, t, cols) => { for (let x = x0, i = 0; x < x1; x += 10, i++) { const sw = Math.round(S(t, 1, i * .13)); LINE(x, y + (i % 2), x + 10, y + ((i + 1) % 2), '#7A5A4A'); TRI(x + 5 + sw, y + 2, 7, 7, cols[i % cols.length]); g.fillStyle = cols[i % cols.length]; } };

  const SC = {
    // 🎄 Рождество: комната с окном, ёлкой, камином; Полли в шапке Санты с мешком
    xmas(c, t) { g = c;
      R(0, 0, W, 96, '#8C2F39'); for (let x = 4; x < W; x += 10) R(x, 0, 2, 96, '#7C2832'); for (let x = 9; x < W; x += 10) for (let y = 6; y < 96; y += 12) P(x, y, '#B9545E');
      R(0, 96, W, 24, '#9A6A45'); for (let y = 100; y < H; y += 6) R(0, y, W, 1, '#7E5434'); for (let x = 20; x < W; x += 37) R(x, 96, 1, 24, '#7E5434');
      // окно
      R(10, 16, 40, 44, '#F4E9D8'); R(13, 19, 34, 38, '#1F3A5F'); R(13, 45, 34, 12, '#DDE7F3'); D(40, 26, 4, '#FFF5D6'); D(42, 25, 3, '#1F3A5F');
      for (let i = 0; i < 14; i++) { const x = 13 + ((i * 7) % 34), y = 19 + ((i * 11 + Math.round(t * 38 * (1 + i % 2))) % 38); if (y < 57) P(x, y, '#FFFFFF'); }
      R(29, 19, 2, 38, '#F4E9D8'); R(13, 37, 34, 2, '#F4E9D8'); R(8, 60, 44, 3, '#E0D2BC'); R(6, 14, 48, 3, '#5B2A2F');
      // камин
      R(56, 62, 36, 34, '#C9B8A6'); R(54, 58, 40, 5, '#E8DCCB'); R(62, 72, 24, 24, '#2A1C1C'); for (let x = 56; x < 92; x += 6) for (let y = 64; y < 96; y += 4) P(x + (y % 8 ? 0 : 3), y, '#B3A290');
      const fl = i => Math.round(S(t, 4, i * .23) * 2); R(66, 90, 16, 3, '#5A3A22'); TRI(70, 80 + fl(0), 11 - fl(0), 8, '#E8862E'); TRI(77, 78 + fl(1), 13 - fl(1), 9, '#F6C445'); TRI(74, 84 + fl(2), 7, 5, '#FFF3B0');
      [[60, '#E5484D'], [74, '#2F6B3A'], [86, '#F4F1EA']].forEach(([x, c2], i) => { const sw = Math.round(S(t, 1, i * .3)); R(x + sw, 60, 4, 9, c2); R(x - 1 + sw, 67, 6, 4, c2); R(x + sw, 60, 4, 2, '#FFFFFF'); });
      // ёлка
      R(146, 86, 6, 10, '#6E4630'); TRI(149, 20, 24, 30, '#2F6B3A'); TRI(149, 34, 26, 40, '#2F6B3A'); TRI(149, 50, 32, 50, '#2F6B3A');
      for (let i = 0; i < 60; i++) { const y = 26 + (i * 29) % 56, hw = (y - 20) * .42; P(Math.round(149 + (((i * 47) % 100) / 50 - 1) * hw), y, '#3F8A4A'); }
      bulbs([[143, 30], [152, 36], [139, 46], [150, 52], [158, 48], [136, 62], [146, 66], [158, 70], [131, 78], [142, 80], [154, 80], [165, 78]], t, 2);
      const sg = S(t, 2) > 0 ? '#FFE27A' : '#F6C445'; TRI(149, 13, 5, 7, sg); TRI(149, 18, 3, 7, sg); P(149, 12, '#FFFFFF');
      GIFT(126, 86, 12, 10, '#5BA3D9', '#F4F1EA'); GIFT(156, 84, 14, 12, '#F6C445', '#E5484D'); GIFT(140, 90, 9, 6, '#B79CF2', '#F6C445');
      // гирлянда по верху, коврик, Полли с мешком
      garland(0, W, 4, 4, t); E(100, 104, 34, 6, '#B0412E'); E(100, 104, 30, 4, '#C9563F');
      polly(86, 62, { hat: 'santa', acc: 'scarf', legs: S(t, 2) > 0 ? 'legA' : 'legB' });
      const sy = Math.round(S(t, 2) * 1); SP(['......aaaa......', '.....awwwwa.....', '....aowwwwoa....', '...aoooooooa....', '...annnnnnnna...', '..appppppppppa..', '.apppqpppppqppa.', '.appppppppppppa.', 'appqpppppqppppa', 'apppppppppppppa', 'apqppppppppqppa', '.appppppppppppa.', '..aaaaaaaaaaaa..'],
        { a: '#3a1d14', w: '#f4f1ea', o: '#f6c445', n: '#5ba3d9', p: '#b0412e', q: '#8d2f20' }, 108, 86 + sy);
    },
    // 🎆 Новый год: крыши ночного города, часы на башне, Полли в колпаке с бенгальским огнём
    night(c, t) { g = c;
      SKY(['#0B1228', '#121C3A', '#1A2850', '#243566', '#2E4378']); stars(70, 70, 11, t);
      // башня с часами: полночь
      R(14, 30, 26, 70, '#141B30'); TRI(27, 12, 18, 30, '#141B30'); D(27, 44, 8, '#F3E7C6'); D(27, 44, 7, '#FFF7DE'); R(27, 37, 1, 7, '#2A211C'); R(27, 38, 1, 6, '#2A211C'); P(26, 37, '#2A211C');
      for (let a = 0; a < 12; a++) P(27 + Math.round(Math.cos(a * TAU / 12) * 6), 44 + Math.round(Math.sin(a * TAU / 12) * 6), '#8A7A6A');
      for (let y = 60; y < 96; y += 9) R(22, y, 4, 5, S(t, 1, y * .01) > -.5 ? '#F6D04D' : '#3A3420');
      // дома
      const houses = [[40, 70, 26], [66, 62, 30], [96, 74, 24], [120, 58, 28], [148, 68, 34]];
      houses.forEach(([x, y, w], i) => { R(x, y, w, H - y, ['#1B2440', '#202B4C', '#1B2440', '#232E52', '#1D2746'][i]); TRI(x + w / 2, y - 12, 12, w + 4, '#2A3560'); R(x - 2, y - 1, w + 4, 2, '#DDE7F3');
        for (let wy = y + 6; wy < H - 6; wy += 10) for (let wx = x + 4; wx < x + w - 4; wx += 8) R(wx, wy, 4, 5, (wx + wy + i) % 3 ? '#F6D04D' : '#2B3456'); });
      R(0, 108, W, 12, '#E9EEF6'); for (let x = 0; x < W; x += 3) P(x, 107, '#FFFFFF');
      garland(66, 148, 50, 5, t);
      // Полли на крыше с бенгальским огнём
      polly(118, 21, { hat: 'party', acc: 'scarf', legs: 'legA' });
      const sx = 147, sy = 32; LINE(sx - 4, sy + 10, sx, sy, '#8A8A8A');
      for (let i = 0; i < 10; i++) { const a = TAU * (i / 10 + t * 3), r = 2 + ((i * 7 + Math.floor(t * 40)) % 5); P(sx + Math.round(Math.cos(a) * r), sy + Math.round(Math.sin(a) * r), i % 2 ? '#FFE27A' : '#FFFFFF'); }
      P(sx, sy, '#FFFFFF');
    },
    // ❄️ Полли с мешком подарков на снегу: деревня, ёлочки, домик с окошками
    polly(c, t) { g = c;
      SKY(['#1F3A5F', '#2C4D78', '#3E6390', '#587FAA']); stars(40, 50, 5, t); D(150, 20, 9, '#FFF8DC'); D(153, 18, 8, '#3E6390');
      E(40, 120, 80, 30, '#D3DFEC'); E(150, 122, 70, 26, '#DCE6F2');
      // домик
      R(18, 66, 34, 26, '#8A4B35'); TRI(35, 50, 18, 44, '#E9EEF6'); R(30, 76, 10, 16, '#4A2A1E'); R(22, 70, 7, 7, '#F6D04D'); R(43, 70, 7, 7, S(t, 1) > -.6 ? '#F6D04D' : '#7A6A30'); R(44, 54, 5, 8, '#6B3A2A');
      for (let i = 0; i < 4; i++) { const p = (t * 2 + i / 4) % 1; D(46 + Math.round(S(t, 2, i * .25) * 2), 52 - p * 22, 1 + Math.round(p * 2), `rgba(230,236,246,${(1 - p).toFixed(2)})`); }
      // ёлочки
      [[70, 70, 22], [160, 64, 30], [176, 76, 20], [6, 84, 18]].forEach(([x, y, h]) => { R(x - 1, y + h, 3, 5, '#5A3A22'); TRI(x, y, h * .6, h * .6, '#2F6B3A'); TRI(x, y + h * .35, h * .65, h * .85, '#2F6B3A'); TRI(x, y - 1, 4, 4, '#E9EEF6'); });
      R(0, 100, W, 20, '#EEF3FA'); for (let x = 0; x < W; x += 4) P(x + 1, 101, '#FFFFFF');
      polly(78, 64, { hat: 'santa', acc: 'scarf', legs: S(t, 2) > 0 ? 'legA' : 'legB' });
      const sy = Math.round(S(t, 2) * 1); SP(['......aaaa......', '.....awwwwa.....', '....aowwwwoa....', '...aoooooooa....', '...annnnnnnna...', '..appppppppppa..', '.apppqpppppqppa.', '.appppppppppppa.', 'appqpppppqppppa', 'apppppppppppppa', 'appppppqppppppa', 'apqppppppppqppa', '.appppppppppppa.', '..aaaaaaaaaaaa..'],
        { a: '#3a1d14', w: '#f4f1ea', o: '#f6c445', n: '#5ba3d9', p: '#b0412e', q: '#8d2f20' }, 106, 74 + sy, 2);
      // подарок выпрыгивает из мешка
      const q = (t * 2) % 1, gy = 70 - Math.round(Math.sin(Math.PI * q) * 22); if (q < .9) GIFT(118, gy, 7, 6, ['#E5484D', '#6A9A3A'][Math.floor(t * 2)], '#F6C445');
    },
    // 🎂 День рождения: флажки, шарики, трёхъярусный торт со свечами, Полли в колпаке
    cake(c, t) { g = c;
      R(0, 0, W, H, '#FCE4EC'); for (let x = 0; x < W; x += 16) R(x, 0, 8, 92, '#F9D3E0'); for (let x = 6; x < W; x += 16) for (let y = 10; y < 92; y += 14) P(x, y, '#FFFFFF');
      FLAGS(-2, W + 4, 6, t, ['#E5484D', '#F6C445', '#5BA3D9', '#6A9A3A', '#B79CF2']);
      BALLOON(14, 32, '#E5484D', t, 0); BALLOON(26, 26, '#5BA3D9', t, .3); BALLOON(20, 44, '#F6C445', t, .6); BALLOON(168, 30, '#B79CF2', t, .2); BALLOON(158, 40, '#6A9A3A', t, .5);
      // стол
      R(0, 92, W, 28, '#FFFFFF'); for (let x = 0; x < W; x += 8) for (let y = 94; y < H; y += 8) R(x + (y % 16 ? 0 : 4), y, 3, 3, '#F7A8C4'); R(0, 92, W, 2, '#EBD3DB');
      // торт
      const cx = 74; R(cx - 32, 88, 64, 4, '#E8DCD0'); R(cx - 34, 91, 68, 2, '#CDBFB2');
      R(cx - 28, 66, 56, 22, '#F28AB2'); R(cx - 28, 66, 56, 3, '#FFF3F7'); for (let x = cx - 26; x < cx + 28; x += 7) R(x, 69, 3, 3 + (x % 3), '#FFF3F7');
      for (let x = cx - 24; x < cx + 26; x += 10) { D(x, 79, 2, '#FFFFFF'); P(x, 78, '#E5484D'); }
      R(cx - 20, 48, 40, 18, '#FFF3E0'); R(cx - 20, 48, 40, 3, '#8FD3C1'); for (let x = cx - 18; x < cx + 20; x += 6) R(x, 51, 2, 2 + (x % 4), '#8FD3C1');
      for (let i = 0; i < 12; i++) P(cx - 17 + (i * 7) % 36, 55 + (i * 5) % 9, ['#E5484D', '#5BA3D9', '#F6C445', '#6A9A3A'][i % 4]);
      R(cx - 12, 34, 24, 14, '#B79CF2'); R(cx - 12, 34, 24, 3, '#FFFFFF'); for (let x = cx - 10; x < cx + 12; x += 5) R(x, 37, 2, 2 + (x % 3), '#FFFFFF');
      [[cx - 8, 33], [cx + 7, 33]].forEach(([x, y]) => { D(x, y, 2, '#E5484D'); P(x, y - 3, '#4E7A2E'); P(x - 1, y - 1, '#FFFFFF88'); });
      [cx - 4, cx, cx + 4].forEach((x, i) => { R(x - 1, 24, 2, 10, ['#5BA3D9', '#F6C445', '#6A9A3A'][i]); P(x - 1, 26, '#FFFFFF'); P(x, 29, '#FFFFFF');
        const f = S(t, 3, i * .3); R(x - 1, 20 - (f > .3 ? 1 : 0), 2, 4, '#F6C445'); P(x - 1 + (f > 0 ? 0 : 1), 19 - (f > .3 ? 1 : 0), '#FFE27A'); P(x - 1, 22, '#FFF3B0'); });
      // подарок и Полли
      GIFT(14, 78, 16, 14, '#5BA3D9', '#F6C445'); GIFT(30, 84, 10, 8, '#F6C445', '#E5484D');
      polly(118, 55, { hat: 'party', legs: S(t, 2) > 0 ? 'legA' : 'legB', closed: S(t, 1, .9) > .97 });
    },
    // 💘 День влюблённых: Полли держит большое сердце, роза в горшке, конверт
    love(c, t) { g = c;
      R(0, 0, W, H, '#F9D6E0'); for (let y = 6, j = 0; y < 100; y += 14, j++) for (let x = (j % 2) * 9; x < W; x += 18) SP(HEART, { a: '#F2B6C8', b: '#F2B6C8' }, x, y);
      R(0, 96, W, 24, '#E79AB0'); R(0, 96, W, 2, '#D9819A');
      // роза в горшке
      R(26, 82, 16, 14, '#C8642A'); R(24, 80, 20, 4, '#D9752F'); LINE(34, 80, 34, 56, '#4E7A2E'); R(28, 66, 5, 3, '#6A9A3A'); R(35, 62, 5, 3, '#6A9A3A');
      D(34, 52, 6, '#C2185B'); D(33, 51, 4, '#E5484D'); P(34, 50, '#8A1238'); P(32, 52, '#8A1238'); P(35, 53, '#8A1238');
      // конверт
      const ey = 74 + Math.round(S(t, 1) * 1); R(132, ey, 30, 20, '#FFF7EE'); LINE(132, ey, 147, ey + 11, '#E0C9B6'); LINE(161, ey, 147, ey + 11, '#E0C9B6'); R(132, ey, 30, 1, '#E0C9B6'); SP(HEART, { a: '#9E1B22', b: '#E5484D' }, 144, ey + 8);
      // Полли с сердцем
      polly(72, 60, { hat: 'beret', legs: 'legA', closed: S(t, 1, .4) > .95 });
      const k = S(t, 2) > .5 ? 3 : 2; SP(HEART, { a: '#9E1B22', b: '#E5484D' }, 96 - (k - 2) * 3, 72 - (k - 2) * 3, k); P(99, 75, '#FFFFFF');
      for (let i = 0; i < 3; i++) { const q = (t + i / 3) % 1; SP(HEART, { a: '#E5484D', b: '#F28AB2' }, 104 + Math.round(S(t, 2, i * .3) * 3) + i * 4, 64 - q * 50); }
    },
    // 🐣 Пасха: луг с тюльпанами, корзинка крашеных яиц, цыплёнок вылупляется
    easter(c, t) { g = c;
      SKY(['#BFE3FF', '#CDEAFF', '#DDF1FF', '#ECF8FF']); [[30, 18], [120, 12], [160, 28]].forEach(([x, y], i) => { const dx = Math.round(S(t, 1, i * .3) * 3); E(x + dx, y, 12, 4, '#FFFFFF'); E(x + dx + 6, y - 3, 7, 4, '#FFFFFF'); });
      D(28, 22, 0, '#fff'); E(50, 120, 90, 40, '#8CC36A'); E(150, 118, 70, 34, '#7DB65A'); R(0, 100, W, 20, '#7DB65A');
      for (let i = 0; i < 30; i++) P((i * 37) % W, 88 + (i * 13) % 30, '#5E9A44');
      [[8, '#E5484D'], [20, '#F6C445'], [32, '#F28AB2'], [150, '#B79CF2'], [162, '#E5484D'], [174, '#F6C445']].forEach(([x, col], i) => TULIP(x, 112, col, t, i * .2));
      // корзинка
      E(66, 98, 20, 5, '#8A5A3B'); R(46, 96, 41, 14, '#B07A4E'); for (let x = 48; x < 86; x += 4) R(x, 96, 2, 14, '#8A5A3B'); for (let y = 99; y < 110; y += 4) R(46, y, 41, 1, '#C99464');
      for (let a = 0; a < 40; a++) P(46 + Math.round(20 + 22 * Math.cos(Math.PI + a * Math.PI / 39)), 96 - Math.round(20 * Math.sin(a * Math.PI / 39)), '#8A5A3B');
      EGG(54, 92, '#5BA3D9', '#F4F1EA', '#F6C445'); EGG(64, 90, '#F28AB2', '#FFFFFF', '#6A9A3A'); EGG(74, 92, '#F6C445', '#E5484D', '#5BA3D9'); EGG(82, 93, '#B79CF2', '#FFF3B0', '#E5484D');
      // яйцо с цыплёнком: верх скорлупы подпрыгивает
      const ex = 134, ey = 98, up = Math.max(0, S(t, 1)) * 6; E(ex, ey, 7, 6, '#F4EBDD'); D(ex, ey - 6 - up, 4, '#F6D04D'); P(ex - 2, ey - 7 - up, '#1a1528'); P(ex + 2, ey - 7 - up, '#1a1528'); R(ex, ey - 5 - up, 2, 1, '#F08A3C');
      E(ex + 2, ey - 11 - up * 1.4, 4, 2, '#F4EBDD'); P(ex - 1, ey - 9 - up * 1.4, '#F4EBDD'); P(ex + 5, ey - 9 - up * 1.4, '#F4EBDD'); for (let x = -6; x <= 6; x += 2) P(ex + x, ey - 6 + (x % 4 ? 1 : 0), '#F4EBDD'); R(ex - 7, ey + 5, 15, 1, '#E3D5C0'); R(ex - 5, ey - 4 - up, 2, 3, '#F6D04D'); R(ex + 4, ey - 4 - up, 2, 3, '#F6D04D');
      polly(94, 64, { hat: 'beret', legs: S(t, 2) > 0 ? 'legA' : 'legB' });
    },
    // 💐 8 Марта: Полли с букетом мимозы и тюльпанов, лента
    flowers(c, t) { g = c;
      R(0, 0, W, H, '#FFF4D6'); for (let y = 0; y < H; y += 10) for (let x = (y / 10 % 2) * 10; x < W; x += 20) { P(x, y, '#F6D04D'); P(x + 1, y, '#F6E3A0'); }
      R(0, 98, W, 22, '#F2C6A0'); R(0, 98, W, 2, '#E0AE84');
      // большая веточка мимозы в вазе слева
      R(18, 74, 18, 24, '#5BA3D9'); R(16, 72, 22, 4, '#7FB8E3'); R(20, 78, 2, 16, '#9CCBEE');
      LINE(26, 72, 18, 34, '#6A8A3A'); LINE(28, 72, 36, 30, '#6A8A3A'); LINE(27, 72, 28, 24, '#6A8A3A');
      for (let i = 0; i < 46; i++) { const a = i * 2.39, r = (i % 9) * 1.6 + 2, bx = [18, 36, 28][i % 3], by = [34, 30, 24][i % 3]; const sw = Math.round(S(t, 1, i * .05)); D(bx + Math.round(Math.cos(a) * r) + sw, by + Math.round(Math.sin(a) * r * .8), 1, i % 4 ? '#F6D04D' : '#FFE88A'); }
      // букет у Полли
      polly(82, 61, { hat: 'beret', legs: 'legA', closed: S(t, 1, .7) > .96 });
      const bx = 112, by = 74; TRI(bx, by + 2, 18, 12, '#F4EFE6'); LINE(bx - 6, by + 2, bx, by + 20, '#E0D6C6');
      [[-6, -4, '#E5484D'], [0, -8, '#F28AB2'], [6, -4, '#E5484D'], [-3, -12, '#F6D04D'], [4, -13, '#F6D04D']].forEach(([dx, dy, col], i) => { const sw = Math.round(S(t, 1, i * .2)); LINE(bx, by + 6, bx + dx + sw, by + dy + 4, '#4E7A2E'); D(bx + dx + sw, by + dy, 3, col); P(bx + dx + sw - 1, by + dy - 1, '#FFFFFF88'); });
      R(bx - 4, by + 8, 9, 3, '#C2185B'); P(bx - 6, by + 12, '#C2185B'); P(bx + 6, by + 12, '#C2185B'); P(bx - 5, by + 11, '#C2185B'); P(bx + 5, by + 11, '#C2185B');
      for (let i = 0; i < 5; i++) { const q = (t + i / 5) % 1; E(140 + i * 8 + Math.round(S(t, 2, i * .2) * 4), q * 100, 2, 1, '#F7A8C4'); }
    },
    // 🔥 Лиго: закат, костёр, Полли в венке, Янов сыр, берёзки
    ligo(c, t) { g = c;
      SKY(['#3B2A5E', '#6A3D72', '#B4577A', '#E4826A', '#F6B26B', '#FFD59A'], 0, 84); D(90, 84, 16, '#FFE7A8'); D(90, 84, 13, '#FFF3CF');
      R(0, 80, W, 40, '#3E6B2E'); E(40, 84, 60, 6, '#4E7A2E'); E(150, 86, 50, 6, '#355F27'); for (let i = 0; i < 40; i++) P((i * 23) % W, 88 + (i * 11) % 30, '#5E8F3C');
      // берёзки по краям
      [[8, 14], [168, 10]].forEach(([x, y]) => { R(x, y, 4, 76, '#F4F1EA'); for (let yy = y + 4; yy < 88; yy += 7) R(x + (yy % 2), yy, 2, 1, '#2A211C'); for (let i = 0; i < 26; i++) { const sw = Math.round(S(t, 1, i * .1)); P(x - 8 + (i * 5) % 20 + sw, y - 4 + (i * 7) % 26, i % 3 ? '#6A9A3A' : '#8CC36A'); } });
      // костёр
      const fx = 126, fy = 98; R(fx - 12, fy, 24, 3, '#5A3A22'); LINE(fx - 12, fy + 3, fx + 10, fy - 2, '#6E4630'); LINE(fx - 10, fy - 2, fx + 12, fy + 3, '#6E4630');
      for (let i = 0; i < 5; i++) { const h = 14 + Math.round(S(t, 4, i * .21) * 4) - Math.abs(i - 2) * 3; TRI(fx - 8 + i * 4, fy - h, h, 7, ['#E5484D', '#E8862E', '#F6C445', '#E8862E', '#E5484D'][i]); }
      TRI(fx, fy - 10 + Math.round(S(t, 4) * 2), 9, 5, '#FFF3B0');
      for (let i = 0; i < 6; i++) { const q = (t * 2 + i / 6) % 1; P(fx - 6 + (i * 5) % 12 + Math.round(S(t, 3, i * .2) * 3), fy - 18 - q * 40, q < .7 ? '#FFD59A' : '#E8862E'); }
      // сыр на пеньке и кружка
      R(36, 92, 18, 10, '#7A4A28'); E(45, 92, 9, 2, '#A3683A'); E(45, 88, 10, 4, '#F6D04D'); R(35, 86, 21, 3, '#F6D04D'); E(45, 85, 10, 3, '#FFE27A'); [[-5, 0], [-1, -1], [3, 0], [6, -1], [1, 1]].forEach(([a, b]) => P(45 + a, 85 + b, '#8A6A2A'));
      polly(66, 60, { hat: 'wreath', legs: S(t, 2) > 0 ? 'legA' : 'legB' });
    },
    // 🎃 Хеллоуин: луна, кривое дерево, тыква-фонарь, Полли в шляпе ведьмы с ведёрком конфет
    halloween(c, t) { g = c;
      SKY(['#1A1030', '#24163F', '#2F1D52', '#3B2463', '#4A2C72']); stars(40, 60, 3, t); D(134, 30, 18, '#FFF1C4'); D(130, 27, 4, '#F2E0A8'); D(140, 36, 3, '#F2E0A8');
      E(90, 128, 120, 34, '#1B1230'); R(0, 104, W, 16, '#1B1230');
      // дерево
      R(18, 40, 6, 66, '#120B22'); LINE(21, 50, 4, 34, '#120B22'); LINE(21, 46, 40, 26, '#120B22'); LINE(22, 60, 44, 52, '#120B22'); LINE(4, 34, 2, 26, '#120B22'); LINE(40, 26, 46, 22, '#120B22'); LINE(30, 36, 32, 28, '#120B22');
      for (let i = 0; i < 2; i++) { const p = (t + i * .5) % 1; LINE(40, 27, 40, 30 + Math.round(S(t, 1, i * .5) * 2), '#C9C0D8'); } SP(['.a.a.', 'aaaaa', '.aaa.'], { a: '#F4F1EA' }, 38, 32 + Math.round(S(t, 1) * 2));
      // тыквы
      PUMPKIN(64, 100, true, t); PUMPKIN(150, 104, true, t); PUMPKIN(166, 108, false, t);
      // Полли с ведёрком конфет
      polly(92, 63, { hat: 'witch', legs: S(t, 2) > 0 ? 'legA' : 'legB' });
      R(118, 88, 12, 10, '#E8862E'); R(118, 88, 12, 2, '#C45F14'); P(122, 92, '#1a1528'); P(126, 92, '#1a1528'); R(122, 95, 5, 1, '#1a1528'); LINE(118, 88, 124, 81, '#2A211C'); LINE(130, 88, 124, 81, '#2A211C');
      [[120, 86, '#E5484D'], [124, 85, '#5BA3D9'], [127, 86, '#F6C445']].forEach(([x, y, col]) => R(x, y, 3, 2, col));
      // летучие мыши
      for (let i = 0; i < 3; i++) { const q = (t + i / 3) % 1, x = Math.round(q * (W + 20)) - 10, y = 18 + i * 12 + Math.round(S(t, 3, i * .3) * 4), up = S(t, 8, i * .2) > 0;
        R(x - 1, y, 3, 2, '#0B0614'); if (up) { LINE(x - 5, y - 2, x - 1, y, '#0B0614'); LINE(x + 5, y - 2, x + 1, y, '#0B0614'); } else { LINE(x - 5, y + 2, x - 1, y, '#0B0614'); LINE(x + 5, y + 2, x + 1, y, '#0B0614'); } }
    },
  };
  window.PPPostcardScenes = { W, H, draw: (name, c, t) => { if (SC[name]) { c.imageSmoothingEnabled = false; SC[name](c, t); } } };
})();
