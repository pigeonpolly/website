// Кабинет → «🖼 Пины» (admin.js открывает PPPostsAdmin.mount(main); раньше тут был генератор постов — docs/retired.md).
// Одна карточка: тип пина → дизайн (10 вариантов в стиле пинов №429–475: коричневый фон, голубой Caveat, палитры как p01–p59)
// → фото (своё или из базы сайта /assets/pin-base.json) → тексты (✨ Gemini: POST /api/admin/pin-text) → «⬇ Скачать JPG» 1000×1500
// и поля для Pinterest (Title, Description, Link, Alt text, Topics) с кнопками «копировать». Всё на английском.
(function () {
  const W = 1000, H = 1500, SITE = 'https://www.pigeonpolly.com';
  const C = { bg: '#2E2521', blue: '#93AFCC', cream: '#F1ECE4', tan: '#C9A27A', mut: '#B9AEA4', pal: '#2A1B1E', gold: '#E0A13A', ink: '#2E2521', paper: '#F4EDE3' };
  const FR = '"Fraunces", Georgia, serif', KA = '"Karla", system-ui, sans-serif', CV = '"Caveat", cursive';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- типы и дизайны ----------
  const TYPES = [
    { id: 'art', ic: '🖼', name: 'Арт крупно', n: 1, about: 'Одна работа во всей красе.' },
    { id: 'palette', ic: '🎨', name: 'Палитра', n: 1, about: 'Цвета из работы с HEX — лучше всего заходят.' },
    { id: 'meme', ic: '😄', name: 'Мем', n: 1, about: 'Узнаваемая шутка про художников.' },
    { id: 'read', ic: '✍️', name: 'Статья / урок', n: 1, about: 'Ведёт на статью блога или видео.' },
    { id: 'prompts', ic: '📝', name: 'Темы для рисования', n: 2, about: 'Список идей «что нарисовать».' },
    { id: 'grid', ic: '🧩', name: 'Серия / процесс', n: 4, about: '2–6 фото: процесс по шагам или серия работ.' },
  ];
  const DESIGNS = [
    { id: 'full', type: 'art', name: 'Во весь пин' },
    { id: 'closer', type: 'art', name: 'Вся работа + деталь' },
    { id: 'paldark', type: 'palette', name: 'Тёмная палитра' },
    { id: 'palcream', type: 'palette', name: 'Светлая палитра' },
    { id: 'memewhite', type: 'meme', name: 'Белый мем' },
    { id: 'memedark', type: 'meme', name: 'Мем-записка' },
    { id: 'read', type: 'read', name: 'Статья блога' },
    { id: 'video', type: 'read', name: 'Видеоурок ▶' },
    { id: 'prompts', type: 'prompts', name: 'Список тем' },
    { id: 'grid', type: 'grid', name: 'Сетка / шаги' },
  ];
  const LINKS = [['/', 'Главная'], ['/blog/', 'Блог'], ['/learn/', 'Уроки'], ['/ink/', 'Курс туши'], ['/palettes/', 'Палитры'], ['/challenge/', 'Челлендж'],
    ['/art-portfolio/', 'Портфолио'], ['/art-portfolio/bird/', 'Полли'], ['/art-portfolio/snail/', 'Мистер Чу'], ['/art-portfolio/sketchbook/', 'Скетчбук'],
    ['/art-portfolio/halloween/', 'Хеллоуин'], ['/titos/', 'Титос'], ['/books/', 'Книги']];
  const DEF = { // тексты по умолчанию — пока не нажали ✨
    art: { kicker: '', headline: 'A small painting, a big mood', hand: 'A small painting, a big mood', sub: 'Watercolor · Alina Otkinska · Pigeon Polly Art Lab' },
    palette: { name: 'Cozy Studio', headline: 'Cozy Studio', sub: 'from my painting' },
    meme: { headline: 'Me: just one quick sketch. Also me, four hours later:', hand: 'worth it' },
    read: { kicker: 'on the blog ✎', headline: 'How to find your *signature style*', hand: 'A simple framework that helped me when I was starting out.', tag: 'free video lesson' },
    prompts: { kicker: 'draw this week', headline: 'Tiny things *worth painting*', items: ['a cup of tea', 'your keys', 'a window at night', 'a houseplant', 'old sneakers', 'a jar of jam', 'your pet asleep', 'one red apple'] },
    grid: { kicker: 'from start to finish', headline: 'From pencil *to paint*', items: ['pencil', 'ink', 'color', 'done', '', ''] },
  };

  // ---------- состояние ----------
  const S = { type: 'art', design: 'full', photos: [], f: JSON.parse(JSON.stringify(DEF.art)), cols: null, link: '/art-portfolio/', custom: '', hint: '', pin: null };
  const photo = i => S.photos[i] || null;

  // ---------- загрузка ----------
  const script = src => new Promise(ok => { if (document.querySelector(`script[src="${src}"]`)) return ok(); const s = document.createElement('script'); s.src = src; s.onload = s.onerror = ok; document.head.appendChild(s); });
  const loadImg = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  let base = null, fontsOk = false;
  async function load() {
    if (!document.querySelector('link[data-pinfonts]')) {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.pinfonts = 1;
      l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&family=Karla:wght@400;700&family=Caveat:wght@700&display=swap';
      document.head.appendChild(l);
    }
    if (!base) base = await fetch('/assets/pin-base.json').then(r => r.json()).catch(() => []);
    if (!fontsOk) { try { await Promise.all([`600 40px ${FR}`, `italic 400 40px ${FR}`, `400 40px ${KA}`, `700 40px ${KA}`, `700 40px ${CV}`].map(f => document.fonts.load(f))); } catch (e) { /* системные */ } fontsOk = true; }
  }

  // ---------- рисование: общие ----------
  const rr = (x, X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
  // картинка «обложкой» в рамку с точкой фокуса fx/fy (0..1); zoom > 1 — крупнее (деталь)
  function pic(x, p, X, Y, w, h, o = {}) {
    const r = o.r ?? 8;
    x.save();
    if (o.rot) { x.translate(X + w / 2, Y + h / 2); x.rotate(o.rot * Math.PI / 180); x.translate(-X - w / 2, -Y - h / 2); }
    if (o.shadow !== false) { x.save(); x.shadowColor = 'rgba(0,0,0,.42)'; x.shadowBlur = 50; x.shadowOffsetY = 24; x.fillStyle = '#000'; rr(x, X, Y, w, h, r); x.fill(); x.restore(); }
    rr(x, X, Y, w, h, r); x.clip();
    if (!p || !p.im) { x.fillStyle = '#5a4d47'; x.fillRect(X, Y, w, h); x.fillStyle = C.mut; x.font = `700 40px ${CV}`; x.textAlign = 'center'; x.fillText('your photo here', X + w / 2, Y + h / 2); x.textAlign = 'left'; x.restore(); return; }
    const im = p.im, z = o.zoom || 1, k = Math.max(w / im.width, h / im.height) * z, iw = im.width * k, ih = im.height * k;
    const fx = p.fx ?? .5, fy = p.fy ?? .5;
    const dx = Math.min(0, Math.max(w - iw, w / 2 - fx * iw)), dy = Math.min(0, Math.max(h - ih, h / 2 - fy * ih));
    x.drawImage(im, X + dx, Y + dy, iw, ih); x.restore();
  }
  // слова с *курсивом* → строки; italic — голубым
  function rich(x, text, maxW, size, o = {}) {
    const words = []; String(text || '').split(/(\*[^*]+\*)/).forEach(part => { const it = /^\*.*\*$/.test(part); (it ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean).forEach(w => words.push({ w, it })); });
    const font = it => it ? `italic 400 ${size}px ${FR}` : `600 ${size}px ${FR}`;
    const lines = [[]]; let lw = 0;
    for (const t of words) { x.font = font(t.it); const ww = x.measureText(t.w + ' ').width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push({ ...t, ww }); lw += ww; }
    return { lines, size, draw(X, Y, col = o.col || C.cream, it = o.it || C.blue) {
      lines.forEach((l, i) => { let cx = X; l.forEach(t => { x.font = font(t.it); x.fillStyle = t.it ? it : col; x.fillText(t.w, cx, Y + i * size * 1.02); cx += t.ww; }); });
      return Y + lines.length * size * 1.02; } };
  }
  function fitRich(x, text, maxW, start, maxLines, min = 40) { let s = start, r; do { r = rich(x, text, maxW, s); s -= 4; } while (r.lines.length > maxLines && s >= min); return r; }
  function wrap(x, text, maxW) { const out = []; let line = ''; for (const w of String(text || '').split(/\s+/)) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
  function hand(x, text, X, Y, maxW, size = 50, col = C.blue, maxLines = 3) { x.font = `700 ${size}px ${CV}`; x.fillStyle = col; const ls = wrap(x, text, maxW).slice(0, maxLines); ls.forEach((l, i) => x.fillText(l, X, Y + i * size * 1.1)); return Y + ls.length * size * 1.1; }
  function url(x, col = C.mut, pre = '') { x.font = `700 36px ${CV}`; x.fillStyle = col; x.textAlign = 'center'; x.fillText((pre ? pre + ' · ' : '') + 'pigeonpolly.com', W / 2, H - 46); x.textAlign = 'left'; }
  function kicker(x, t, X, Y) { if (!t) return; x.save(); x.translate(X, Y); x.rotate(-2 * Math.PI / 180); x.font = `700 46px ${CV}`; x.fillStyle = C.blue; x.fillText(t, 0, 0); x.restore(); }
  const bg = (x, c) => { x.fillStyle = c; x.fillRect(0, 0, W, H); };
  const textOn = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 140 ? '#F6ECDF' : C.ink; };

  // ---------- 10 дизайнов ----------
  const DRAW = {
    full(x, f) { bg(x, C.bg); pic(x, photo(0), 60, 56, 880, 1150); hand(x, f.hand || f.headline, 64, 1290, 870, 56, C.blue, 1);
      x.font = `400 26px ${KA}`; x.fillStyle = C.mut; x.fillText(f.sub || '', 66, 1345); url(x); },
    closer(x, f) { bg(x, C.bg); const p = photo(0), r = p && p.im ? p.im.height / p.im.width : .7, h1 = Math.round(Math.min(660, Math.max(420, 880 * r)));
      pic(x, p, 60, 56, 880, h1, { shadow: true }); kicker(x, 'look closer ↓', 66, h1 + 128);
      pic(x, p, 60, h1 + 170, 880, 1225 - h1 - 170, { zoom: 2.4 });
      hand(x, f.hand || f.headline, 64, 1290, 870, 56, C.blue, 1); x.font = `400 26px ${KA}`; x.fillStyle = C.mut; x.fillText(f.sub || '', 66, 1345); url(x); },
    paldark(x, f, cols) { bg(x, C.pal); pic(x, photo(0), 0, 0, W, 780, { r: 0, shadow: false });
      const g = x.createLinearGradient(0, 400, 0, 780); g.addColorStop(0, 'rgba(42,27,30,0)'); g.addColorStop(.7, 'rgba(42,27,30,.75)'); g.addColorStop(1, C.pal); x.fillStyle = g; x.fillRect(0, 400, W, 381);
      x.font = `700 26px ${KA}`; x.fillStyle = C.gold; x.fillText('C O L O R   P A L E T T E', 70, 700);
      const nm = f.name || f.headline || ''; x.fillStyle = '#F6ECDF'; let s = 80; do { x.font = `600 ${s}px ${FR}`; s -= 4; } while (x.measureText(nm).width > 860 && s > 40); x.fillText(nm, 70, 790);
      (cols || []).slice(0, 6).forEach((c, i) => { const cx = 70 + (i % 3) * 294, cy = 850 + Math.floor(i / 3) * 228;
        x.fillStyle = c.hex; rr(x, cx, cy, 272, 118, 12); x.fill();
        x.fillStyle = '#F6ECDF'; x.font = `700 26px ${KA}`; x.fillText(c.en || '', cx, cy + 156); x.fillStyle = '#BFAEA6'; x.font = `400 21px ${KA}`; x.fillText(c.hex.toUpperCase(), cx, cy + 188); });
      x.font = `italic 400 30px ${FR}`; x.fillStyle = '#BFAEA6'; x.fillText(f.sub || 'from my painting', 70, 1440);
      x.font = `700 30px ${KA}`; x.fillStyle = '#F6ECDF'; x.textAlign = 'right'; x.fillText('pigeonpolly.com', 930, 1440); x.textAlign = 'left'; },
    palcream(x, f, cols) { bg(x, C.paper); pic(x, photo(0), 70, 70, 860, 700, { r: 14 });
      x.font = `700 24px ${KA}`; x.fillStyle = '#A0745A'; x.fillText('C O L O R   P A L E T T E', 70, 850);
      const nm = f.name || f.headline || ''; x.fillStyle = C.ink; let s = 76; do { x.font = `600 ${s}px ${FR}`; s -= 4; } while (x.measureText(nm).width > 860 && s > 40); x.fillText(nm, 70, 930);
      (cols || []).slice(0, 6).forEach((c, i) => { const cx = 70 + (i % 3) * 294 + 136, cy = 1050 + Math.floor(i / 3) * 190;
        x.beginPath(); x.arc(cx, cy, 62, 0, Math.PI * 2); x.fillStyle = c.hex; x.fill(); x.lineWidth = 6; x.strokeStyle = '#fff'; x.stroke();
        x.textAlign = 'center'; x.fillStyle = C.ink; x.font = `700 25px ${KA}`; x.fillText(c.en || '', cx, cy + 100); x.fillStyle = '#8A7C72'; x.font = `400 21px ${KA}`; x.fillText(c.hex.toUpperCase(), cx, cy + 128); x.textAlign = 'left'; });
      url(x, '#8A7C72', f.sub || 'from my painting'); },
    memewhite(x, f) { bg(x, '#FFFFFF'); x.fillStyle = '#1A1A1A'; let s = 66, ls; do { x.font = `700 ${s}px ${KA}`; ls = wrap(x, f.headline, 880); s -= 4; } while (ls.length > 4 && s > 40); s += 4;
      ls.forEach((l, i) => x.fillText(l, 60, 120 + i * s * 1.15)); const top = 120 + ls.length * s * 1.15 + 20;
      pic(x, photo(0), 60, top, 880, 1330 - top, { rot: -1.2 });
      if (f.hand) { x.save(); x.translate(700, 1260); x.rotate(2.5 * Math.PI / 180); x.font = `700 46px ${CV}`; const w = x.measureText(f.hand).width + 52; x.fillStyle = '#FFF4C7'; x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 16; x.shadowOffsetY = 6; x.fillRect(-w / 2, -44, w, 76); x.shadowColor = 'transparent'; x.fillStyle = '#1A1A1A'; x.textAlign = 'center'; x.fillText(f.hand, 0, 10); x.restore(); }
      url(x, '#777'); },
    memedark(x, f) { bg(x, C.bg); pic(x, photo(0), 60, 60, 880, 980, { rot: 1 });
      x.fillStyle = C.cream; let s = 60, ls; do { x.font = `700 ${s}px ${KA}`; ls = wrap(x, f.headline, 870); s -= 4; } while (ls.length > 3 && s > 36); s += 4;
      ls.forEach((l, i) => x.fillText(l, 64, 1120 + i * s * 1.15));
      if (f.hand) hand(x, '— ' + f.hand, 64, 1140 + ls.length * s * 1.15, 870, 52); url(x); },
    read(x, f) { bg(x, C.bg); kicker(x, f.kicker || 'on the blog ✎', 64, 100); const t = fitRich(x, f.headline, 880, 84, 2); t.draw(62, 200);
      const top = 200 + t.lines.length * t.size * 1.02; pic(x, photo(0), 62, top + 10, 876, 1190 - top - 10, { rot: -1 });
      hand(x, f.hand, 66, 1265, 870, 44, C.blue, 2); url(x, C.mut, 'read it on'); },
    video(x, f) { bg(x, C.bg); x.font = `700 24px ${KA}`; const tag = (f.tag || 'free video lesson').toUpperCase(), tw = x.measureText(tag).width + 44; x.fillStyle = C.blue; rr(x, 62, 62, tw, 50, 25); x.fill(); x.fillStyle = C.bg; x.fillText(tag, 84, 96);
      const t = fitRich(x, f.headline, 880, 84, 2); t.draw(62, 210); const top = 210 + t.lines.length * t.size * 1.02;
      const h = 1190 - top - 10; pic(x, photo(0), 62, top + 10, 876, h);
      const cx = 500, cy = top + 10 + h / 2; x.beginPath(); x.arc(cx, cy, 85, 0, Math.PI * 2); x.fillStyle = 'rgba(46,37,33,.82)'; x.fill(); x.lineWidth = 6; x.strokeStyle = C.cream; x.stroke();
      x.beginPath(); x.moveTo(cx - 24, cy - 40); x.lineTo(cx + 40, cy); x.lineTo(cx - 24, cy + 40); x.closePath(); x.fillStyle = C.cream; x.fill();
      hand(x, f.hand, 66, 1265, 870, 44, C.blue, 2); url(x, C.mut, 'watch on'); },
    prompts(x, f) { bg(x, C.bg); kicker(x, f.kicker, 64, 100); const t = fitRich(x, f.headline, 880, 84, 2); t.draw(62, 200);
      const n = Math.min(2, Math.max(1, S.photos.length)); for (let i = 0; i < n; i++) pic(x, photo(i), n === 1 ? 62 : 62 + i * 440, 370 + i * 18, n === 1 ? 876 : 416, 460, { rot: i ? 2 : -2 });
      const items = (f.items || []).filter(Boolean).slice(0, 8);
      items.forEach((it, i) => { const cx = 62 + (i % 2) * 450, cy = 950 + Math.floor(i / 2) * 84; x.beginPath(); x.arc(cx + 12, cy - 14, 8, 0, Math.PI * 2); x.fillStyle = C.tan; x.fill(); x.font = `700 48px ${CV}`; x.fillStyle = C.blue; x.fillText(it, cx + 40, cy); });
      url(x, C.mut, 'more ideas'); },
    grid(x, f) { bg(x, C.bg); kicker(x, f.kicker, 64, 100); const t = fitRich(x, f.headline, 880, 78, 2); t.draw(62, 196);
      const top = 196 + t.lines.length * t.size * 1.02 + 10, n = Math.max(1, Math.min(6, S.photos.length || 4));
      if (n <= 3) { const h = (1380 - top - (n - 1) * 34) / n; for (let i = 0; i < n; i++) { const X = i % 2 ? 110 : 70, Y = top + i * (h + 34);
          pic(x, photo(i), X, Y, 820, h, { rot: i % 2 ? 1 : -1 }); x.beginPath(); x.arc(X + 14, Y + 10, 32, 0, Math.PI * 2); x.fillStyle = C.blue; x.fill(); x.fillStyle = C.bg; x.font = `700 40px ${CV}`; x.textAlign = 'center'; x.fillText(String(i + 1), X + 14, Y + 24); x.textAlign = 'left';
          const lab = (f.items || [])[i]; if (lab) { x.font = `700 36px ${CV}`; const lw = x.measureText(lab).width + 32; x.fillStyle = C.cream; x.fillRect(X + 820 - lw + 14, Y + h - 30, lw, 52); x.fillStyle = C.bg; x.fillText(lab, X + 820 - lw + 30, Y + h + 8); } } }
      else { const rows = Math.ceil(n / 2), h = (1390 - top - (rows - 1) * 22) / rows; for (let i = 0; i < n; i++) { const X = 50 + (i % 2) * 461, Y = top + Math.floor(i / 2) * (h + 22); pic(x, photo(i), X, Y, 439, h, { shadow: false });
          const lab = (f.items || [])[i]; if (lab) { x.font = `700 32px ${CV}`; const lw = x.measureText(lab).width + 24; x.fillStyle = C.cream; x.fillRect(X + 10, Y + h - 56, lw, 46); x.fillStyle = C.bg; x.fillText(lab, X + 22, Y + h - 22); } } }
      url(x); },
  };

  async function colors() {
    const p = photo(0); if (!p) return [];
    if (p.cols) return p.cols;
    await script('/assets/palettes.js');
    if (window.PPPalette && p.im) { p.cols = await window.PPPalette.named(p.im); return p.cols; }
    return [];
  }
  async function render(cv, design = S.design) {
    cv.width = W; cv.height = H; const x = cv.getContext('2d'); x.textBaseline = 'alphabetic';
    const d = DESIGNS.find(z => z.id === design), cols = d.type === 'palette' ? await colors() : null;
    DRAW[design](x, S.f, cols);
  }

  // ---------- тексты для Pinterest ----------
  const linkFull = () => { const path = S.custom.trim() || S.link; const u = /^https?:/.test(path) ? path : SITE + (path.startsWith('/') ? '' : '/') + path; return u + (u.includes('?') ? '&' : '?') + 'utm_source=pinterest&utm_campaign=pin-' + S.type; };
  function fallbackPin() { // без ИИ — из надписей на пине
    const f = S.f, h = (f.name || f.headline || '').replace(/\*/g, ''), cols = (photo(0) && photo(0).cols) || [];
    if (S.type === 'palette') return { title: `${h} Color Palette with HEX Codes | Pigeon Polly`, desc: `Six colors from my painting “${h}”: ${cols.map(c => c.en + ' ' + c.hex.toUpperCase()).join(', ')}. More palettes from my art on my site.`, alt: `A color palette of six swatches (${cols.map(c => c.en).join(', ')}) with HEX codes under a painting by Pigeon Polly.`, topics: 'color palette, hex codes, color inspiration, watercolor palette' };
    return { title: h, desc: [f.hand, f.sub].filter(Boolean).join(' ').replace(/\*/g, ''), alt: '', topics: '' };
  }

  // ---------- экран ----------
  async function mount(main) {
    main.innerHTML = '<p class="be-note">Загружаю генератор пинов…</p>';
    await load();
    main.innerHTML = `<section class="adm-box pp-pin">
      <h2>🖼 Генератор пинов</h2>
      <p class="be-note">1 — тип, 2 — дизайн, 3 — фото (своё или из базы сайта), 4 — ✨ тексты. Потом «⬇ Скачать» и поля для Pinterest. Всё на английском.</p>
      <h3>1. Тип пина</h3><div class="adm-quick" data-types></div>
      <h3>2. Дизайн</h3><div class="pp-pin-designs" data-designs></div>
      <h3>3. Фото <small class="be-note" data-need></small></h3>
      <div class="adm-quick"><label class="pill-btn">📁 Загрузить фото<input type="file" accept="image/*" multiple hidden data-file></label><button type="button" class="pill-btn" data-base>🖼 Из базы сайта</button><button type="button" class="pill-btn" data-clear>✕ Убрать все</button></div>
      <div class="pp-pin-photos" data-photos></div><p class="be-note">Нажмите на фото — туда сдвинется центр кадра (что главное на картинке).</p>
      <div class="pp-pin-base" data-basebox hidden></div>
      <div class="pp-pin-main">
        <div><canvas class="pp-pin-cv" data-cv></canvas>
          <div class="adm-quick"><button type="button" class="pill-btn pill-fill" data-dl>⬇ Скачать JPG</button></div></div>
        <div class="pp-pin-side">
          <h3>4. Тексты</h3>
          <label>Куда ведёт пин<select class="be-input" data-link>${LINKS.map(([p, t]) => `<option value="${p}">${t} — ${p}</option>`).join('')}</select></label>
          <label>…или своя ссылка (статья, видео)<input class="be-input" data-custom placeholder="/blog/how-did-sketching-begin/"></label>
          <label>Подсказка для ✨ (что на картинке, о чём пин — по-русски можно)<textarea class="be-input" rows="2" data-hint></textarea></label>
          <div class="adm-quick"><button type="button" class="pill-btn pill-fill" data-ai>✨ Сгенерировать тексты</button><span class="be-note" data-aimsg></span></div>
          <div data-fields></div>
          <h3>Для Pinterest</h3><div data-pin></div>
        </div></div></section>`;
    const $ = s => main.querySelector(s), cv = $('[data-cv]');
    const redraw = () => render(cv).then(drawThumbs);
    // типы
    const types = () => { $('[data-types]').innerHTML = TYPES.map(t => `<button type="button" class="pill-btn${S.type === t.id ? ' pill-fill' : ''}" data-t="${t.id}" title="${esc(t.about)}">${t.ic} ${t.name}</button>`).join('');
      $('[data-types]').querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.type = b.dataset.t; S.design = DESIGNS.find(d => d.type === S.type).id; S.f = JSON.parse(JSON.stringify(DEF[S.type])); S.pin = null; types(); designs(); fields(); pinBox(); redraw(); }); };
    // дизайны: маленькие превью
    const designs = () => { const list = DESIGNS.filter(d => d.type === S.type);
      $('[data-designs]').innerHTML = list.map(d => `<button type="button" class="pp-pin-d${S.design === d.id ? ' on' : ''}" data-d="${d.id}"><canvas></canvas><span>${d.name}</span></button>`).join('');
      $('[data-designs]').querySelectorAll('[data-d]').forEach(b => b.onclick = () => { S.design = b.dataset.d; $('[data-designs]').querySelectorAll('.pp-pin-d').forEach(z => z.classList.toggle('on', z === b)); redraw(); });
      const t = TYPES.find(z => z.id === S.type); $('[data-need]').textContent = t.n > 1 ? `· можно до 6 фото (${t.about})` : '· одно фото'; };
    const drawThumbs = async () => { for (const b of main.querySelectorAll('.pp-pin-d')) { const c = b.querySelector('canvas'); const tmp = document.createElement('canvas'); await render(tmp, b.dataset.d); c.width = 200; c.height = 300; c.getContext('2d').drawImage(tmp, 0, 0, 200, 300); } };
    // фото
    const addPhoto = async (src, meta = {}) => { const im = await loadImg(src); if (!im) return; const max = TYPES.find(t => t.id === S.type).n > 1 ? 6 : 1;
      const p = { src, im, fx: .5, fy: .5, t: meta.t || '', cols: meta.c ? meta.c.map(([hex, en]) => ({ hex, en })) : null };
      if (max === 1) S.photos = [p]; else { S.photos.push(p); S.photos = S.photos.slice(-6); }
      if (S.type === 'palette' && meta.t) S.f.name = S.f.headline = meta.t.replace(/(^|\s)\S/g, c => c.toUpperCase());
      photos(); fields(); redraw(); };
    const photos = () => { $('[data-photos]').innerHTML = S.photos.map((p, i) => `<div class="pp-pin-ph" data-i="${i}"><img src="${esc(p.src)}" alt=""><i style="left:${p.fx * 100}%;top:${p.fy * 100}%"></i><button type="button" data-x title="Убрать">✕</button>${i ? `<button type="button" data-up title="Раньше">↑</button>` : ''}</div>`).join('');
      $('[data-photos]').querySelectorAll('.pp-pin-ph').forEach(d => { const i = +d.dataset.i, img = d.querySelector('img');
        img.onclick = e => { const r = img.getBoundingClientRect(); S.photos[i].fx = (e.clientX - r.left) / r.width; S.photos[i].fy = (e.clientY - r.top) / r.height; photos(); redraw(); };
        d.querySelector('[data-x]').onclick = () => { S.photos.splice(i, 1); photos(); redraw(); };
        const up = d.querySelector('[data-up]'); if (up) up.onclick = () => { [S.photos[i - 1], S.photos[i]] = [S.photos[i], S.photos[i - 1]]; photos(); redraw(); }; }); };
    $('[data-file]').onchange = e => { [...e.target.files].forEach(f => { const r = new FileReader(); r.onload = () => addPhoto(r.result, { t: f.name.replace(/\.[^.]+$/, '').replace(/^IMG_\d+$/i, '') }); r.readAsDataURL(f); }); e.target.value = ''; };
    $('[data-clear]').onclick = () => { S.photos = []; photos(); redraw(); };
    $('[data-base]').onclick = () => { const box = $('[data-basebox]'); box.hidden = !box.hidden; if (box.hidden || box.dataset.ok) return; box.dataset.ok = 1;
      const G = { all: 'Все', bird: 'Полли', snail: 'Мистер Чу', sketchbook: 'Скетчбук', halloween: 'Хеллоуин', detective: 'Детектив', anxiety: 'Тревога', photo: 'Фото', challenge: 'Челлендж', exhibitions: 'Выставки', publications: 'Публикации' };
      const show = g => { box.querySelector('[data-grid]').innerHTML = base.filter(b => g === 'all' || b.g === g).map(b => `<button type="button" data-src="${esc(b.src)}" title="${esc(b.t)}"><img src="${esc(b.th)}" alt="" loading="lazy"></button>`).join('');
        box.querySelectorAll('[data-grid] button').forEach(b => b.onclick = () => { const it = base.find(z => z.src === b.dataset.src); addPhoto(it.src, it); if (TYPES.find(t => t.id === S.type).n === 1) box.hidden = true; }); };
      box.innerHTML = `<div class="adm-quick">${Object.entries(G).filter(([k]) => k === 'all' || base.some(b => b.g === k)).map(([k, t]) => `<button type="button" class="pill-btn" data-g="${k}">${t}</button>`).join('')}</div><div class="pp-pin-grid" data-grid></div>`;
      box.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { box.querySelectorAll('[data-g]').forEach(z => z.classList.toggle('pill-fill', z === b)); show(b.dataset.g); });
      box.querySelector('[data-g]').classList.add('pill-fill'); show('all'); };
    // поля надписей на пине
    const LABEL = { kicker: 'Маленькая надпись сверху', headline: 'Заголовок (*слово* — голубым курсивом)', name: 'Название палитры', hand: 'Строка от руки', sub: 'Подпись (техника, имя)', tag: 'Метка', items: 'Пункты (каждый с новой строки)' };
    const FIELDS = { art: ['hand', 'sub'], palette: ['name', 'sub'], meme: ['headline', 'hand'], read: ['kicker', 'headline', 'hand', 'tag'], prompts: ['kicker', 'headline', 'items'], grid: ['kicker', 'headline', 'items'] };
    const fields = () => { $('[data-fields]').innerHTML = FIELDS[S.type].map(k => k === 'items' ? `<label>${LABEL[k]}<textarea class="be-input" rows="5" data-f="items">${esc((S.f.items || []).join('\n'))}</textarea></label>` : `<label>${LABEL[k]}<input class="be-input" data-f="${k}" value="${esc(S.f[k] || '')}"></label>`).join('');
      $('[data-fields]').querySelectorAll('[data-f]').forEach(el => el.oninput = () => { const k = el.dataset.f; S.f[k] = k === 'items' ? el.value.split('\n') : el.value; if (k === 'name') S.f.headline = el.value; clearTimeout(fields.t); fields.t = setTimeout(redraw, 150); }); };
    // поля Pinterest
    const pinBox = () => { const p = S.pin || fallbackPin(), rows = [['Title', p.title], ['Description', p.desc], ['Link', linkFull()], ['Alt text', p.alt], ['Topics', p.topics]];
      $('[data-pin]').innerHTML = rows.map(([k, v]) => `<label>${k}<div class="pp-pin-row"><textarea class="be-input" rows="${k === 'Description' ? 4 : 2}" data-pk="${k}">${esc(v || '')}</textarea><button type="button" class="pill-btn" data-cp>📋</button></div></label>`).join('');
      $('[data-pin]').querySelectorAll('[data-cp]').forEach(b => b.onclick = async () => { const t = b.previousElementSibling; try { await navigator.clipboard.writeText(t.value); b.textContent = '✓'; setTimeout(() => { b.textContent = '📋'; }, 1500); } catch (e) { t.select(); } }); };
    $('[data-link]').value = S.link; $('[data-link]').onchange = e => { S.link = e.target.value; pinBox(); };
    $('[data-custom]').oninput = e => { S.custom = e.target.value; pinBox(); };
    $('[data-hint]').oninput = e => { S.hint = e.target.value; };
    // ✨ Gemini
    $('[data-ai]').onclick = async () => {
      const msg = $('[data-aimsg]'), p = photo(0); if (!p) { msg.textContent = 'Сначала фото'; return; }
      msg.textContent = '⏳ Смотрю на картинку…';
      const sm = document.createElement('canvas'), k = Math.min(1, 768 / Math.max(p.im.width, p.im.height)); sm.width = Math.round(p.im.width * k); sm.height = Math.round(p.im.height * k); sm.getContext('2d').drawImage(p.im, 0, 0, sm.width, sm.height);
      const cols = S.type === 'palette' ? (await colors()).map(c => c.en + ' ' + c.hex).join(', ') : '';
      const kind = S.design === 'video' ? 'video' : S.type === 'grid' ? (S.photos.length <= 3 ? 'steps' : 'grid') : S.type;
      const r = await fetch('/api/admin/pin-text', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ img: sm.toDataURL('image/jpeg', .82), kind, hint: S.hint, link: linkFull(), colors: cols }) }).then(async x => x.ok ? x.json() : { error: (await x.json().catch(() => ({}))).error || x.status }).catch(() => ({ error: 'net' }));
      if (r.error) { msg.textContent = r.error === 'ai_limit' || r.error === 429 ? '⚠ Лимит ИИ на сегодня — заполните руками' : '⚠ Не получилось, попробуйте ещё раз'; return; }
      const f = S.f; if (r.kicker && 'kicker' in DEF[S.type]) f.kicker = r.kicker; if (r.headline) f.headline = r.headline; if (r.hand) f.hand = r.hand;
      if (S.type === 'palette' && (r.name || r.headline)) f.name = f.headline = r.name || r.headline;
      if (S.type === 'art' && r.hand) f.hand = r.hand; else if (S.type === 'art' && r.headline) f.hand = r.headline;
      if (Array.isArray(r.items) && r.items.length && f.items) f.items = r.items.slice(0, S.type === 'prompts' ? 8 : 6);
      S.pin = { title: r.title, desc: r.desc, alt: r.alt, topics: r.topics };
      if (S.type === 'palette') { const cs = await colors(); S.pin.desc = `${r.desc} Colors: ${cs.map(c => c.en + ' ' + c.hex.toUpperCase()).join(', ')}.`; }
      msg.textContent = '✓ Готово — можно поправить'; fields(); pinBox(); redraw();
    };
    $('[data-dl]').onclick = () => cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `pin-${S.type}-${S.design}-${Date.now().toString(36)}.jpg`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/jpeg', .9);
    types(); designs(); fields(); pinBox(); photos(); redraw();
  }
  window.PPPostsAdmin = { mount };
})();
