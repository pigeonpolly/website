// Пиксельный набор кабинета зельевара (docs/brew.md): общая палитра нового стиля, сетка «пиксель → цвет», объёмные формы со светом
// сверху слева и дизерингом, контур, увеличение EPX (scale2x) для мелких рисунков, цифры 4×6. Используют brew-bird.js, brew-room.js и
// следующие части игры (котёл, карта, биржа) — новое рисовать на нём, чтобы стиль был один.
(function () {
  const INK = '#2A1B2E'; // общий контур
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const toHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const shade = (h, k) => toHex(hex(h).map(v => v * k));
  // тоновая лестница с цветным светом и тенью: свет теплее, тень уходит в сливу — так рисует Алина
  function ramp(base) {
    const dark = hex(base).reduce((s, v) => s + v, 0) < 200; // очень тёмный цвет (ворона, графит) — светлеет сильнее
    return {
      hi: mix(base, '#FFF6DA', dark ? .38 : .55), li: mix(base, '#FFE9C0', dark ? .2 : .26), base,
      sh: mix(base, '#4A2E63', dark ? .2 : .3), dk: mix(base, '#2E1B45', dark ? .35 : .55), ol: mix(base, INK, dark ? .55 : .78),
    };
  }
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
  const bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];
  // сетка: put(x, y, цвет, слой) — слой 'nol' не обводится; поверх — по порядку вызовов
  function grid(w, h) {
    const px = new Map();
    const k = (x, y) => x + ',' + y;
    const g = {
      w, h, px,
      put(x, y, c, layer) { x = Math.round(x); y = Math.round(y); if (c && x >= 0 && y >= 0 && x < w && y < h) px.set(k(x, y), [c, layer || 'b']); },
      get(x, y) { const v = px.get(k(Math.round(x), Math.round(y))); return v ? v[0] : null; },
      has(x, y) { return px.has(k(Math.round(x), Math.round(y))); },
      del(x, y) { px.delete(k(Math.round(x), Math.round(y))); },
      rect(x, y, rw, rh, c, layer) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) g.put(x + i, y + j, c, layer); },
      line(x0, y0, x1, y1, c, layer) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let i = 0; i <= n; i++) g.put(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, c, layer); },
      // объёмный овал: col(тон 0…1, u, v, x, y) → цвет; тон — освещённость (свет сверху слева), u/v — координаты в овале −1…1
      blob(cx, cy, rx, ry, col, layer, light = [-.55, -.75]) {
        for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
          const u = (x + .5 - cx) / rx, v = (y + .5 - cy) / ry, d = u * u + v * v;
          if (d > 1) continue;
          const nz = Math.sqrt(1 - d), lit = Math.max(0, -(u * light[0] + v * light[1]) * .8 + nz * .55);
          const c = col(Math.min(1, lit), u, v, x, y); if (c) g.put(x, y, c, layer);
        }
      },
      // тон → цвет лестницы с дизерингом на границах
      tone(r, t, x, y) { const s = t + (bayer(x, y) - .5) * .07; return s > .92 ? r.hi : s > .7 ? r.li : s > .42 ? r.base : s > .22 ? r.sh : r.dk; },
      stamp(rows, x0, y0, pal, flip, layer) { rows.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) g.put(x0 + (flip ? row.length - 1 - x : x), y0 + y, pal[ch], layer); })); },
      // контур снаружи всего, что не 'nol'; снизу и справа — темнее (селективный контур)
      outline(col = INK, soft) {
        const add = [];
        for (const [key, [c, layer]] of px) {
          if (layer === 'nol') continue;
          const [x, y] = key.split(',').map(Number);
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!px.has(k(x + dx, y + dy))) add.push([x + dx, y + dy, soft && (dx < 0 || dy < 0) ? soft : col]);
        }
        for (const [x, y, c] of add) if (x >= 0 && y >= 0 && x < w && y < h && !px.has(k(x, y))) px.set(k(x, y), [c, 'out']);
      },
      paint(ctx, ox = 0, oy = 0, flip) { for (const [key, [c]] of px) { const [x, y] = key.split(',').map(Number); ctx.fillStyle = c; ctx.fillRect(ox + (flip ? w - 1 - x : x), oy + y, 1, 1); } },
      canvas(flip) { const c = document.createElement('canvas'); c.width = w; c.height = h; g.paint(c.getContext('2d'), 0, 0, flip); return c; },
    };
    return g;
  }
  // EPX / scale2x: мелкий рисунок ×2 со сглаженными диагоналями (шапки и вещи из старого HD-спрайта на крупной птичке)
  // px — Map "x,y" → цвет; возвращает новый Map ×2
  function epx(src) {
    const out = new Map(), at = (x, y) => src.get(x + ',' + y) || null;
    for (const [key, P] of src) {
      const [x, y] = key.split(',').map(Number);
      const A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
      const e = [[C === A && C !== D && A !== B ? A : P, A === B && A !== C && B !== D ? B : P], [D === C && D !== B && C !== A ? C : P, B === D && B !== A && D !== C ? D : P]];
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) if (e[j][i]) out.set((x * 2 + i) + ',' + (y * 2 + j), e[j][i]);
    }
    return out;
  }
  // цифры и знаки 4×6 (уровень, счётчики на бутылочках)
  const DIG = {
    0: '.##.|#..#|#..#|#..#|#..#|.##.', 1: '..#.|.##.|..#.|..#.|..#.|.###', 2: '.##.|#..#|...#|..#.|.#..|####', 3: '###.|...#|.##.|...#|...#|###.',
    4: '#..#|#..#|####|...#|...#|...#', 5: '####|#...|###.|...#|...#|###.', 6: '.##.|#...|###.|#..#|#..#|.##.', 7: '####|...#|..#.|.#..|.#..|.#..',
    8: '.##.|#..#|.##.|#..#|#..#|.##.', 9: '.##.|#..#|#..#|.###|...#|.##.', '×': '....|#..#|.##.|.##.|#..#|....', '+': '....|.#..|###.|.#..|....|....', '/': '...#|..#.|..#.|.#..|.#..|#...',
  };
  function text(ctx, s, x, y, col, sh) {
    for (const ch of String(s)) {
      const m = DIG[ch] && DIG[ch].replace(/\|/g, ''); if (!m) { x += 3; continue; }
      for (let j = 0; j < 6; j++) for (let i = 0; i < 4; i++) if (m[j * 4 + i] === '#') {
        if (sh) { ctx.fillStyle = sh; ctx.fillRect(x + i + 1, y + j + 1, 1, 1); }
        ctx.fillStyle = col; ctx.fillRect(x + i, y + j, 1, 1);
      }
      x += 5;
    }
    return x;
  }
  // время и сезон по Риге (как seasonNow() в worker: дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень)
  function riga() {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Riga', hour: 'numeric', minute: 'numeric', month: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const v = t => +(p.find(x => x.type === t) || {}).value || 0;
    const m = v('month'), h = v('hour') + v('minute') / 60;
    return { month: m, hour: h, season: m === 12 || m <= 2 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'autumn', night: h < 7 || h >= 20, dusk: (h >= 17 && h < 20) || (h >= 6 && h < 8) };
  }
  window.PPPix = { INK, hex, toHex, mix, shade, ramp, bayer, grid, epx, text, riga };
})();
