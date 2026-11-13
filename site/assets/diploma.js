// Пиксельный диплом курсов (общий): «Смотри на мир как художник» (polly-school.js) и курс туши (ink-course.js).
// PPDiploma.canvas(o) → <canvas> 1200×850; o: { L, school, title, to, line, motto, sign, date, fine, nick, icons: ['◯', …], last (сек) }.
// PPDiploma.P / C — пиксельная Полли (14×15), PPDiploma.svg(cls) — она же картинкой.
(() => {
  const P = ['......rr......', '.....rrrr.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbaaaad...', '..dbbsaaaad...', '.dbbssaaaad...', 'dbbssbappad...', 'dbbbbaaaad....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const C = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#fff', k: '#1a1528', o: '#f2a73b', a: '#F0A987', p: '#D85A30', r: '#D85A30' };
  const svg = cls => `<svg class="${cls}" viewBox="0 0 14 15" shape-rendering="crispEdges" aria-hidden="true">${P.map((row, y) => [...row].map((ch, x) => C[ch] ? `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${C[ch]}"/>` : '').join('')).join('')}</svg>`;

  function canvas(o) {
    const c = document.createElement('canvas'), W = 1200, H = 850, x = c.getContext('2d'), L = o.L || 0;
    c.width = W; c.height = H;
    x.imageSmoothingEnabled = false;
    const INK = '#2E2521', SOFT = '#7A6C63', GOLD = '#C98A5B', RED = '#D85A30', PAPER = '#FBF7F0'; // цвета сайта: графит, бумага, охра, оранжевый
    x.fillStyle = INK; x.fillRect(0, 0, W, H);
    x.fillStyle = PAPER; x.fillRect(28, 28, W - 56, H - 56);
    // зерно бумаги — редкие пиксели
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    x.fillStyle = 'rgba(201,138,91,.09)'; for (let i = 0; i < 2600; i++) x.fillRect(28 + Math.floor(rnd() * (W - 56) / 4) * 4, 28 + Math.floor(rnd() * (H - 56) / 4) * 4, 4, 4);
    // двойная золотая рамка и пиксельные уголки
    x.strokeStyle = INK; x.lineWidth = 3; x.strokeRect(58, 58, W - 116, H - 116);
    x.strokeStyle = GOLD;
    x.lineWidth = 2; x.strokeRect(70, 70, W - 140, H - 140);
    const corner = (cx, cy, sx, sy) => { x.fillStyle = GOLD; for (const [i, j] of [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [2, 2], [3, 3]]) x.fillRect(cx + sx * i * 8 - (sx < 0 ? 8 : 0), cy + sy * j * 8 - (sy < 0 ? 8 : 0), 8, 8); };
    corner(84, 84, 1, 1); corner(W - 84, 84, -1, 1); corner(84, H - 84, 1, -1); corner(W - 84, H - 84, -1, -1);
    const serif = (sz, it, w = 600) => `${it ? 'italic 400' : w} ${sz}px Fraunces, Georgia, serif`, sans = (sz, w = 400) => `${w} ${sz}px Karla, system-ui, sans-serif`;
    const spaced = (txt, y, gap) => { x.letterSpacing = gap + 'px'; x.fillText(txt, W / 2 + gap / 2, y); x.letterSpacing = '0px'; };
    x.textAlign = 'center';
    x.fillStyle = RED; x.font = sans(17, 700); spaced(o.school.toUpperCase() + '  ·  PIGEON POLLY ART LAB', 140, 5);
    x.fillStyle = INK; x.font = serif(104, false, 400); x.fillText(o.title, W / 2, 250);
    // ромбик-разделитель
    x.fillStyle = GOLD; x.fillRect(W / 2 - 150, 284, 120, 2); x.fillRect(W / 2 + 30, 284, 120, 2);
    x.save(); x.translate(W / 2, 285); x.rotate(Math.PI / 4); x.fillRect(-7, -7, 14, 14); x.restore();
    x.fillStyle = SOFT; x.font = serif(26, true); x.fillText(o.to, W / 2, 338);
    x.fillStyle = INK; x.font = serif(70); x.fillText('@' + (o.nick || '…'), W / 2, 420);
    x.fillStyle = SOFT; x.font = sans(16, 700); spaced(o.line.toUpperCase(), 466, 3);
    // печати в ряд: кружок-штемпель (12 — шаг 64, больше — ýже)
    const n = o.icons.length, step = Math.min(64, 900 / n), r = Math.min(25, step * 0.4);
    o.icons.forEach((ic, i) => {
      const cx = W / 2 + (i - (n - 1) / 2) * step, cy = 530;
      x.strokeStyle = 'rgba(216,90,48,.85)'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
      x.lineWidth = 1; x.beginPath(); x.arc(cx, cy, r - 5, 0, 7); x.stroke();
      x.fillStyle = RED; x.font = sans(Math.round(r * 0.8), 700); x.fillText(ic, cx, cy + r * 0.28);
    });
    x.fillStyle = INK; x.font = serif(24, true); x.fillText('«' + o.motto + '»', W / 2, 618);
    // низ: дата — печать — подпись
    const ly = 712;
    x.fillStyle = INK; x.fillRect(150, ly, 260, 2); x.fillRect(W - 410, ly, 260, 2);
    const date = new Date((o.last || Date.now() / 1000) * 1000).toLocaleDateString(['en-GB', 'ru-RU', 'lv-LV'][L], { day: 'numeric', month: 'long', year: 'numeric' });
    x.font = sans(24, 500); x.fillText(date, 280, ly - 14);
    x.fillStyle = SOFT; x.font = sans(13, 700); x.letterSpacing = '3px'; x.fillText(o.sign.toUpperCase(), W - 280 + 1.5, ly + 28); x.fillText(o.date.toUpperCase(), 280 + 1.5, ly + 28); x.letterSpacing = '0px';
    // подпись — отпечаток голубиной лапки (подушечки пальцев и коготки)
    x.save(); x.translate(W - 280, ly - 34); x.rotate(-0.22); x.fillStyle = 'rgba(46,37,33,.88)';
    const pad = (d, a, rx, ry) => { x.beginPath(); x.ellipse(d * Math.sin(a), -d * Math.cos(a), rx, ry, a, 0, 7); x.fill(); };
    pad(0, 0, 10, 9);
    for (const [a, k] of [[-0.75, 3], [0, 3], [0.75, 3], [Math.PI, 2]]) {
      for (let i = 0; i < k; i++) pad(17 + i * 13, a, 5.5, 7);
      const d = 17 + k * 13 - 1; x.beginPath(); x.moveTo((d - 4) * Math.sin(a) - 3 * Math.cos(a), -(d - 4) * Math.cos(a) - 3 * Math.sin(a)); x.lineTo((d - 4) * Math.sin(a) + 3 * Math.cos(a), -(d - 4) * Math.cos(a) + 3 * Math.sin(a)); x.lineTo((d + 6) * Math.sin(a), -(d + 6) * Math.cos(a)); x.fill();
    }
    x.restore();
    // мелкая оговорка на тёмном поле снизу
    x.fillStyle = 'rgba(251,247,240,.6)'; x.font = sans(13, 500); x.fillText(o.fine, W / 2, H - 9);
    // восковая печать с Полли
    const sx = W / 2, sy = 702;
    x.fillStyle = '#9E3A1E'; x.beginPath(); for (let k = 0; k < 24; k++) { const rr = k % 2 ? 62 : 68, a = k / 24 * Math.PI * 2; x.lineTo(sx + rr * Math.cos(a), sy + rr * Math.sin(a)); } x.fill();
    x.fillStyle = RED; x.beginPath(); x.arc(sx, sy, 54, 0, 7); x.fill();
    x.strokeStyle = 'rgba(251,244,226,.55)'; x.lineWidth = 2; x.beginPath(); x.arc(sx, sy, 46, 0, 7); x.stroke();
    const s = 5, ox = sx - 7 * s, oy = sy - 7.5 * s;
    P.forEach((row, yy) => [...row].forEach((ch, xx) => { if (C[ch]) { x.fillStyle = ch === 'd' || ch === 'k' ? '#6E2410' : '#F6D7C6'; if (ch === 'w') x.fillStyle = RED; x.fillRect(ox + xx * s, oy + yy * s, s, s); } }));
    return c;
  }
  // положить диплом в el и перерисовать, когда догрузятся шрифты сайта
  function mount(el, o) {
    const c = canvas(o); c.className = 'ps-dip-canvas'; el.append(c);
    document.fonts && Promise.all(['600 70px Fraunces', '400 70px Fraunces', 'italic 400 70px Fraunces', '700 20px Karla', '500 20px Karla'].map(f => document.fonts.load(f))).then(() => c.getContext('2d').drawImage(canvas(o), 0, 0)).catch(() => {});
    return c;
  }
  const save = (c, name) => c && c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
  window.PPDiploma = { P, C, svg, canvas, mount, save };
})();
