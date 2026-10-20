// Пиксельные бейджи тематик месяцев (кабинет → «🏅 Тематика месяца» → «🎨 Бейдж»; показ — sketch-wall.js, шкала месяца на /challenge/).
// Дизайн бейджа: { n — детализация (SIZES: 12…48 клеток, нет — 16), rows: n строк по n символов ('.' — пусто, буква — цвет из pal), pal: { буква: '#hex' }, bg — фон медали, ring — обводка медали,
//   outline — контур вокруг рисунка ('' — нет), sym: { g: символ из GLYPHS или свой текст (t), c: цвет, p: 'tl' | 'tr' | 'bl' | 'br' } | null }.
// PPPixelBadge.svg(design) → <svg> рисунка (фон и обводку медали рисует CSS .sw-medal), suggest(тема, 'ГГГГ-ММ') — шаблон под тему.
(function () {
  const N = 16, SIZES = [12, 16, 24, 32, 48];
  // шаблоны: [названия en/ru/lv, рисунок, цвета, фон медали, ключевые слова тем (ru/en/lv, по началу слова)]
  const T = {
    rocket: [['Rocket', 'Ракета', 'Raķete'], ['.....r.....', '....rwr....', '....www....', '...wwbww...', '...wbbbw...', '...wwbww...', '...wwwww...', '..rwwwwwr..', '.rrwwwwwrr.', '.rr.www.rr.', '....o.o....', '...ooyoo...', '....yyy....'],
      { r: '#D9372B', w: '#F3EFFA', b: '#2F6FC0', o: '#F08A24', y: '#F2C230' }, '#2B1A51', ['косм', 'ракет', 'space', 'rocket', 'kosm', 'raķet', 'звёзд', 'звезд', 'планет', 'planet']],
    star: [['Star', 'Звезда', 'Zvaigzne'], ['.....y.....', '.....y.....', '....yyy....', '....yyy....', 'yyyyyyyyyyy', '.yyyyyyyyy.', '..yyyyyyy..', '...yyyyy...', '...yy.yy...', '..yy...yy..', '.y.......y.'],
      { y: '#F2C230' }, '#3F3C8F', ['звезд', 'звёзд', 'star', 'zvaigzn', 'мечт', 'dream', 'sapņ']],
    moon: [['Moon', 'Луна', 'Mēness'], ['...yyyy....', '..yyy......', '.yyy.......', '.yy........', 'yyy........', 'yyy........', 'yyy........', '.yy........', '.yyy.......', '..yyy......', '...yyyy....'],
      { y: '#F4E66A' }, '#1F3A68', ['лун', 'ноч', 'moon', 'night', 'mēnes', 'nakt', 'сон', 'sleep', 'mieg']],
    sun: [['Sun', 'Солнце', 'Saule'], ['.....o.....', '.o...o...o.', '..o.yyy.o..', '...yyyyy...', '..yyyyyyy..', 'ooyyyyyyyoo', '..yyyyyyy..', '...yyyyy...', '..o.yyy.o..', '.o...o...o.', '.....o.....'],
      { y: '#F2C230', o: '#F08A24' }, '#8EC5E8', ['солн', 'лет', 'sun', 'summer', 'saul', 'vasar', 'тепл', 'warm', 'silt']],
    flower: [['Flower', 'Цветок', 'Zieds'], ['..pp...pp..', '.pppp.pppp.', '.ppppppppp.', '..ppyyypp..', '...pyyyp...', '..ppyyypp..', '.ppppppppp.', '.pppp.pppp.', '..pp.g.pp..', '.....g.....', '...gg.g....', '....ggg....', '.....g.....'],
      { p: '#EE7DB0', y: '#F2C230', g: '#3E9B4F' }, '#E6F5E9', ['цвет', 'весн', 'сад', 'flower', 'spring', 'garden', 'zied', 'pavasar', 'dārz']],
    leaf: [['Leaf', 'Лист', 'Lapa'], ['.......ggg', '.....ggggg', '....gggGgg', '...gggGggg', '..gggGgggg', '..ggGggggg', '.ggGgggggg', '.gGgggggg.', '.Ggggggg..', 'G.gggg....', 'G.........'],
      { g: '#E8833A', G: '#8A3B12' }, '#FCE7C8', ['лист', 'осен', 'лес', 'leaf', 'autumn', 'fall', 'forest', 'lap', 'rudens', 'mež']],
    snow: [['Snowflake', 'Снежинка', 'Sniegpārsla'], ['.....b.....', '...b.b.b...', '....bbb....', '.b...b...b.', '..b..b..b..', 'bbbbbbbbbbb', '..b..b..b..', '.b...b...b.', '....bbb....', '...b.b.b...', '.....b.....'],
      { b: '#FFFFFF' }, '#8EC5E8', ['снег', 'зим', 'мороз', 'snow', 'winter', 'frost', 'snieg', 'ziem', 'sal']],
    pumpkin: [['Pumpkin', 'Тыква', 'Ķirbis'], ['.....gg....', '.....g.....', '..ooooooo..', '.oOooOooOo.', 'ooOooOooOoo', 'ooOooOooOoo', 'ooOooOooOoo', 'ooOooOooOoo', '.oOooOooOo.', '..ooooooo..'],
      { o: '#F08A24', O: '#C0582F', g: '#3E9B4F' }, '#2B1A51', ['тыкв', 'хэллоуин', 'хеллоуин', 'pumpkin', 'halloween', 'ķirb', 'урож', 'harvest', 'raž']],
    heart: [['Heart', 'Сердце', 'Sirds'], ['.rr...rr.', 'rrrr.rrrr', 'rrrrrrrrr', 'rwrrrrrrr', 'rrrrrrrrr', '.rrrrrrr.', '..rrrrr..', '...rrr...', '....r....'],
      { r: '#D9372B', w: '#FFFFFF' }, '#FBD3E2', ['сердц', 'любов', 'heart', 'love', 'sird', 'mīl', 'друж', 'friend', 'draudz']],
    cat: [['Cat', 'Кот', 'Kaķis'], ['k........k', 'kk......kk', 'kkkkkkkkkk', 'kkkkkkkkkk', 'kyykkkkyyk', 'kyykkkkyyk', 'kkkkppkkkk', 'wkkkkkkkkw', '.kkkkkkkk.', '..kkkkkk..'],
      { k: '#4A4A5A', y: '#F2C230', p: '#EE7DB0', w: '#FFFDF8' }, '#F6B68E', ['кот', 'кош', 'живот', 'cat', 'pet', 'animal', 'kaķ', 'dzīvn']],
    fish: [['Fish', 'Рыба', 'Zivs'], ['....bbbb...', '..bbbbbbb.bb', '.bkbbbbbbbbb', 'bbbbbbbbbbb.', '.bbbbbbbbbbb', '..bbbbbbb.bb', '....bbbb....'],
      { b: '#2BB3B1', k: '#1F3A68' }, '#8EC5E8', ['рыб', 'мор', 'вод', 'fish', 'sea', 'ocean', 'water', 'ziv', 'jūr', 'ūden']],
    tree: [['Fir tree', 'Ёлка', 'Egle'], ['.....y.....', '....ggg....', '...ggggg...', '....ggg....', '...gggrg...', '..ggggggg..', '....ggg....', '..grggggg..', '.ggggggrgg.', 'ggggggggggg', '.....t.....', '.....t.....'],
      { g: '#1E7F5C', y: '#F2C230', r: '#D9372B', t: '#8A5A3C' }, '#E6F5E9', ['ёлк', 'елк', 'нов', 'рожд', 'tree', 'christmas', 'new year', 'xmas', 'egl', 'ziemassvēt', 'jaun']],
    cup: [['Cup', 'Чашка', 'Krūze'], ['...s..s...', '..s..s....', '...s..s...', '.wwwwwww..', '.wbbbbbwww', '.wwwwwwww.w', '.wwwwwwww.w', '.wwwwwwwww.', '..wwwwww...', '.tttttttt..'],
      { w: '#FFFDF8', b: '#8A5A3C', s: '#B3A9C9', t: '#C9A227' }, '#D8C3A0', ['кофе', 'чай', 'чаш', 'кружк', 'уют', 'coffee', 'tea', 'cup', 'cozy', 'kafij', 'tēj', 'krūz']],
    palette: [['Palette', 'Палитра', 'Palete'], ['...wwwww...', '.wwwwwwwww.', 'wwrwwwwbwww', 'wwwwwwwwwww', 'wwywwww..ww', 'wwwwwww..w.', 'wwgwwwwww..', '.wwwwwwww..', '..wwwwww...'],
      { w: '#E8C9A0', r: '#D9372B', b: '#2F6FC0', y: '#F2C230', g: '#3E9B4F' }, '#F3EFFA', ['цвет', 'краск', 'палитр', 'рису', 'художн', 'color', 'colour', 'paint', 'art', 'krās', 'palet', 'māksl']],
    mushroom: [['Mushroom', 'Гриб', 'Sēne'], ['...rrrrr...', '.rrwrrrwrr.', 'rrrrrrrrrrr', 'rwrrrwrrrwr', 'rrrrrrrrrrr', '...wwwww...', '...wwwww...', '...wwwww...', '..wwwwwww..'],
      { r: '#D9372B', w: '#FFFDF8' }, '#9ED9BE', ['гриб', 'mushroom', 'sēn', 'сказк', 'fairy', 'pasak']],
    ghost: [['Ghost', 'Привидение', 'Spoks'], ['...wwwww...', '..wwwwwww..', '.wwkwwwkww.', '.wwkwwwkww.', '.wwwwwwwww.', '.wwwwkwwww.', '.wwwwwwwww.', '.wwwwwwwww.', '.ww.ww.ww..'],
      { w: '#FFFDF8', k: '#2B1A51' }, '#7B4FB8', ['привид', 'призрак', 'ghost', 'spok', 'страш', 'spooky']],
    gift: [['Gift', 'Подарок', 'Dāvana'], ['..r....r..', '...r..r...', 'yyyyrryyyy', 'yyyyrryyyy', 'rrrrrrrrrr', 'yyyyrryyyy', 'yyyyrryyyy', 'yyyyrryyyy', 'yyyyrryyyy'],
      { y: '#2BB3B1', r: '#D9372B' }, '#FCE7C8', ['подар', 'праздн', 'gift', 'present', 'holiday', 'party', 'dāvan', 'svētk']],
    house: [['House', 'Дом', 'Māja'], ['.....r.....', '....rrr....', '...rrrrr...', '..rrrrrrr..', '.rrrrrrrrr.', '..wwwwwww..', '..wbwwwbw..', '..wwwwwww..', '..wwwttww..', '..wwwttww..'],
      { r: '#C8643C', w: '#F3E7CF', b: '#8EC5E8', t: '#8A5A3C' }, '#9ED9BE', ['дом', 'город', 'house', 'home', 'city', 'māj', 'pilsēt']],
    note: [['Music', 'Музыка', 'Mūzika'], ['....kkkkkk', '....kkkkkk', '....k....k', '....k....k', '....k....k', '....k....k', '..kkk..kkk', '.kkkk.kkkk', '.kkk..kkk.'],
      { k: '#2B1A51' }, '#F4E66A', ['муз', 'песн', 'music', 'song', 'mūzik', 'dziesm', 'танц', 'dance', 'dej']],
    pencil: [['Pencil', 'Карандаш', 'Zīmulis'], ['..........kk', '.........kpp', '........kyyk', '.......kyyk.', '......kyyk..', '.....kyyk...', '....kyyk....', '...kyyk.....', '..wwyk......', '..wwk.......', '.kk.........', 'kk..........'],
      { k: '#2B1A51', y: '#F2C230', p: '#EE7DB0', w: '#E8C9A0' }, '#F3EFFA', ['каранд', 'скетч', 'набросок', 'линия', 'pencil', 'sketch', 'line', 'zīmul', 'skic', 'līnij']],
  };
  const TEMPLATES = Object.fromEntries(Object.entries(T).map(([k, [n, art, pal, bg, kw]]) => [k, { n, art, pal, bg, kw }]));
  // символы 5×5 (пиксели) — в угол бейджа
  const GLYPHS = {
    star: ['..#..', '.###.', '#####', '.###.', '.#.#.'], heart: ['.#.#.', '#####', '#####', '.###.', '..#..'], spark: ['..#..', '..#..', '##.##', '..#..', '..#..'],
    crown: ['#.#.#', '#####', '#####', '.....', '.....'], plus: ['..#..', '..#..', '#####', '..#..', '..#..'], dot: ['.###.', '#####', '#####', '#####', '.###.'],
    moon: ['.##..', '#....', '#....', '#....', '.##..'], drop: ['..#..', '.###.', '#####', '#####', '.###.'],
  };
  const GLYPH_N = { star: '★ звезда', heart: '♥ сердце', spark: '✦ искра', crown: '♛ корона', plus: '+ плюс', dot: '● точка', moon: '☾ месяц', drop: '💧 капля' };
  const SEAS_T = ['snow', 'snow', 'flower', 'flower', 'flower', 'sun', 'sun', 'sun', 'leaf', 'leaf', 'pumpkin', 'tree'];
  const RING = '#C98A1E';
  const blankRows = (n = N) => Array.from({ length: n }, () => '.'.repeat(n));
  // шаблон → дизайн 16×16 (рисунок по центру)
  function fromTemplate(key) {
    const t = TEMPLATES[key] || TEMPLATES.star, h = t.art.length, w = Math.max(...t.art.map(r => r.length));
    const y0 = Math.floor((N - h) / 2), x0 = Math.floor((N - w) / 2), rows = blankRows().map(r => r.split(''));
    t.art.forEach((r, y) => [...r].forEach((ch, x) => { if (ch !== '.') rows[y0 + y][x0 + x] = ch; }));
    return { v: 1, n: N, tpl: key, rows: rows.map(r => r.join('')), pal: { ...t.pal }, bg: t.bg, ring: RING, outline: '#2B1A51', sym: null };
  }
  // шаблон под тему: по ключевым словам темы (ru/en/lv), иначе — по сезону месяца
  function suggest(text, ym) {
    const s = ' ' + String(text || '').toLowerCase();
    for (const [k, t] of Object.entries(TEMPLATES)) if (t.kw.some(w => s.includes(' ' + w) || s.includes(w))) return fromTemplate(k);
    return fromTemplate(SEAS_T[(+String(ym || '').slice(5, 7) || 1) - 1]);
  }
  function clean(d) { // дизайн из базы/кабинета → безопасный
    if (!d || !Array.isArray(d.rows)) return null;
    const hex = c => /^#[0-9a-fA-F]{6}$/.test(String(c || '')) ? c : null;
    const pal = {}; for (const [k, v] of Object.entries(d.pal || {})) if (/^[a-zA-Z0-9]$/.test(k) && hex(v)) pal[k] = v;
    const n = SIZES.includes(+d.n) ? +d.n : N;
    const rows = Array.from({ length: n }, (_, y) => [...String(d.rows[y] || '').slice(0, n).padEnd(n, '.')].map(ch => pal[ch] ? ch : '.').join(''));
    const sym = d.sym && (GLYPHS[d.sym.g] || d.sym.t) ? { g: GLYPHS[d.sym.g] ? d.sym.g : '', t: String(d.sym.t || '').slice(0, 2), c: hex(d.sym.c) || '#F2C230', p: ['tl', 'tr', 'bl', 'br'].includes(d.sym.p) ? d.sym.p : 'br' } : null;
    return { v: 1, n, tpl: String(d.tpl || ''), rows, pal, bg: hex(d.bg) || '#FCE7C8', ring: hex(d.ring) || RING, outline: hex(d.outline) || '', sym };
  }
  const rect = (x, y, c) => `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${c}"/>`;
  function svg(d0) {
    const d = clean(d0); if (!d) return '';
    const n = d.n, on = (x, y) => y >= 0 && y < n && x >= 0 && x < n && d.rows[y][x] !== '.';
    let out = '';
    if (d.outline) for (let y = -1; y <= n; y++) for (let x = -1; x <= n; x++) if (!on(x, y) && (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1))) out += rect(x + 1, y + 1, d.outline);
    d.rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch !== '.') out += rect(x + 1, y + 1, d.pal[ch]); }));
    if (d.sym) { // символ — в сетке 18×18 при любой детализации (масштаб группой)
      out += `<g transform="scale(${(n + 2) / 18})">`;
      const [sx, sy] = { tl: [0, 0], tr: [13, 0], bl: [0, 13], br: [13, 13] }[d.sym.p];
      if (d.sym.g) GLYPHS[d.sym.g].forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') out += rect(sx + x, sy + y, d.sym.c); }));
      else out += `<text x="${sx + 2.5}" y="${sy + 4.6}" font-size="5.4" text-anchor="middle" fill="${d.sym.c}" font-family="system-ui, sans-serif" font-weight="700">${String(d.sym.t).replace(/[<&>"]/g, '')}</text>`;
      out += '</g>';
    }
    return `<svg viewBox="0 0 ${n + 2} ${n + 2}" shape-rendering="crispEdges">${out}</svg>`;
  }
  // другая детализация: рисунок растягивается/сжимается по ближайшей клетке
  function resize(d0, n) {
    const d = clean(d0); if (!d || !SIZES.includes(n) || n === d.n) return d;
    return { ...d, n, rows: Array.from({ length: n }, (_, y) => Array.from({ length: n }, (_, x) => d.rows[Math.floor((y + .5) * d.n / n)][Math.floor((x + .5) * d.n / n)]).join('')) };
  }
  window.PPPixelBadge = { N, SIZES, resize, TEMPLATES, GLYPHS, GLYPH_N, fromTemplate, suggest, clean, svg, blankRows };
})();
