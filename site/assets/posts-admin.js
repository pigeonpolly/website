// Кабинет → «📣 Посты» (admin.js открывает PPPostsAdmin.mount(main)): готовые картинки и подписи для соцсетей (docs/growth.md).
// Всё рисуется в браузере из того, что уже есть на сайте, поэтому всегда свежее: тема дня (ChallengeTheme — план из D1),
// темы на месяц, палитра (/assets/palettes.json), дело Титоса (titos-cases.json + названия из /api/titos).
// Формат: 4:5 Instagram/Threads, 2:3 Pinterest, 9:16 сторис/TikTok. Язык картинки и подписи — EN/RU/LV.
// Ссылка в подписи — с utm_source площадки (кабинет → 👥 Посетители покажет, откуда пришли).
(function () {
  const C = { ink: '#2B1A51', cream: '#FFFDF8', peach: '#F0A987', gold: '#E9A93B', lilac: '#7F81BF', soft: '#8A7FA8', paper: '#F4F0FA' };
  const SERIF = '"Fraunces", Georgia, serif', SANS = '"Karla", system-ui, sans-serif';
  const SIZES = { ig: [1080, 1350, '4:5 · Instagram, Threads, Facebook'], pin: [1000, 1500, '2:3 · Pinterest'], story: [1080, 1920, '9:16 · сторис, TikTok, Shorts'] };
  const PLAT = { instagram: 'Instagram', threads: 'Threads', pinterest: 'Pinterest', tiktok: 'TikTok', facebook: 'Facebook' };
  const LANGS = ['en', 'ru', 'lv'], SITE = 'https://www.pigeonpolly.com';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const S = { lang: 'en', size: 'ig', plat: 'instagram', day: null, month: 0, pal: 0, cas: 0 };
  try { Object.assign(S, JSON.parse(localStorage.getItem('pp_posts') || '{}'), { day: null }); } catch (e) { /* нет хранилища */ }
  const keep = () => { try { const { lang, size, plat } = S; localStorage.setItem('pp_posts', JSON.stringify({ lang, size, plat })); } catch (e) { /* нет хранилища */ } };
  const Li = () => LANGS.indexOf(S.lang);
  const pre = () => S.lang === 'en' ? '' : '/' + S.lang;
  const link = (path, kind) => `${SITE}${pre()}${path}?utm_source=${S.plat}&utm_campaign=post-${kind}`;
  const short = path => `pigeonpolly.com${pre()}${path}`.replace(/\/$/, '');

  // ---------- загрузка ----------
  const script = src => new Promise(ok => { if (document.querySelector(`script[src="${src}"]`)) return ok(); const s = document.createElement('script'); s.src = src; s.onload = s.onerror = ok; document.head.appendChild(s); });
  const img = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  let data = null;
  async function load() {
    if (data) return data;
    for (const s of ['/assets/challenge-data.js', '/assets/extra-palettes.js', '/api/extra-palettes.js', '/assets/challenge-theme.js']) await script(s);
    const [pal, tc, logo] = await Promise.all([fetch('/assets/palettes.json').then(r => r.json()).catch(() => []), fetch('/assets/titos-cases.json').then(r => r.json()).catch(() => ({ cases: [] })), img('/assets/logo.png?v=2')]);
    const titles = {};
    for (const l of LANGS) titles[l] = await fetch('/api/titos?lang=' + l, { credentials: 'same-origin' }).then(r => r.json()).then(d => Object.fromEntries((d.cases || []).map(c => [c.n, c.title]))).catch(() => ({}));
    data = { pal: pal.filter(p => p.thumb && p.colors && p.colors.length), cases: (tc.cases || []).filter(c => (c.scenes || []).some(s => s.img)), titles, logo };
    try { await document.fonts.load(`600 40px ${SERIF}`); await document.fonts.load(`400 40px ${SANS}`); await document.fonts.load(`700 40px ${SANS}`); } catch (e) { /* без шрифтов — системные */ }
    return data;
  }

  // ---------- рисование ----------
  function fit(x, text, font, max, start, min) { // самый крупный кегль, при котором строка влезает
    let s = start; for (; s > min; s -= 2) { x.font = font.replace('#', s); if (x.measureText(text).width <= max) break; }
    return s;
  }
  function wrap(x, text, max) { // строки по ширине
    const out = []; let line = '';
    for (const w of String(text).split(/\s+/)) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > max && line) { out.push(line); line = w; } else line = t; }
    if (line) out.push(line); return out;
  }
  function cover(x, im, X, Y, W, H, pixel) {
    if (!im) { x.fillStyle = C.paper; x.fillRect(X, Y, W, H); return; }
    const k = Math.max(W / im.width, H / im.height), w = im.width * k, h = im.height * k;
    x.save(); x.beginPath(); x.rect(X, Y, W, H); x.clip(); x.imageSmoothingEnabled = !pixel;
    x.drawImage(im, X + (W - w) / 2, Y + (H - h) / 2, w, h); x.restore();
  }
  function frame(cv, label) { // фон, шапка с логотипом и подписью, нижняя полоса — возвращает рабочую область
    const [W, H] = SIZES[S.size], x = cv.getContext('2d'); cv.width = W; cv.height = H;
    x.fillStyle = C.cream; x.fillRect(0, 0, W, H);
    const top = S.size === 'story' ? 150 : 40;
    if (data.logo) x.drawImage(data.logo, 60, top, 72, 72);
    x.fillStyle = C.ink; x.font = `600 34px ${SERIF}`; x.textBaseline = 'middle'; x.fillText('Pigeon Polly Art Lab', 150, top + 36);
    x.fillStyle = C.soft; x.font = `700 26px ${SANS}`; x.textAlign = 'right'; x.fillText(label.toUpperCase(), W - 60, top + 36); x.textAlign = 'left';
    return { x, W, H, y0: top + 120, y1: H - (S.size === 'story' ? 430 : 140) }; // y1 — над нижней полосой (footer)
  }
  function footer(f, text) {
    const { x, W, H } = f, h = S.size === 'story' ? 150 : 110, y = H - (S.size === 'story' ? 260 : 0) - h;
    x.fillStyle = C.ink; x.fillRect(0, y, W, h);
    x.fillStyle = C.cream; x.textAlign = 'center'; x.textBaseline = 'middle';
    fit(x, text, `700 #px ${SANS}`, W - 120, 40, 22); x.fillText(text, W / 2, y + h / 2); x.textAlign = 'left';
  }
  function swatches(f, cols, y, names) { // кружки цветов с подписями, по центру
    const { x, W } = f, n = cols.length; if (!n) return y;
    const r = Math.min(70, (W - 120) / n / 2 - 14), step = (W - 120) / n;
    cols.forEach((c, i) => {
      const cx = 60 + step * (i + .5);
      x.beginPath(); x.arc(cx, y + r, r, 0, Math.PI * 2); x.fillStyle = c.hex; x.fill(); x.lineWidth = 4; x.strokeStyle = '#fff'; x.stroke();
      if (names) { x.fillStyle = C.ink; x.textAlign = 'center'; x.textBaseline = 'top'; const nm = c.n ? c.n[Li()] || c.n[0] : ''; fit(x, nm, `500 #px ${SANS}`, step - 12, 28, 16); x.fillText(nm, cx, y + 2 * r + 14); x.textAlign = 'left'; }
    });
    return y + 2 * r + (names ? 60 : 0);
  }
  const fmtDay = d => d.toLocaleDateString(['en-GB', 'ru-RU', 'lv-LV'][Li()], { day: 'numeric', month: 'long' });
  const T = (en, ru, lv) => [en, ru, lv][Li()];

  // ---------- 1. тема дня ----------
  const dayOf = () => { const d = S.day ? new Date(S.day + 'T12:00') : new Date(); d.setHours(12); return d; };
  function theme(cv) {
    const d = dayOf(), th = window.ChallengeTheme.themeFor(d, Li());
    const f = frame(cv, T('Drawing prompt', 'Тема дня', 'Dienas tēma') + ' · ' + fmtDay(d)), { x, W } = f;
    const mid = (f.y0 + f.y1) / 2, cols = (th.colors || []).slice(0, 6);
    x.fillStyle = C.soft; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.font = `italic 400 44px ${SERIF}`;
    x.fillText(T('Today, draw…', 'Сегодня рисуем…', 'Šodien zīmējam…'), W / 2, mid - 250);
    x.fillStyle = C.ink; const sz = fit(x, th.subject, `600 #px ${SERIF}`, W - 120, 150, 60);
    const lines = sz <= 62 ? wrap(x, th.subject, W - 120) : [th.subject];
    lines.slice(0, 3).forEach((l, i) => x.fillText(l, W / 2, mid - 90 + i * sz * 1.05));
    let y = mid - 40 + (Math.min(lines.length, 3) - 1) * sz;
    if (th.twist) { x.fillStyle = C.lilac; x.font = `italic 400 36px ${SERIF}`; wrap(x, th.twist, W - 160).slice(0, 2).forEach((l, i) => x.fillText(l, W / 2, y + 30 + i * 46)); y += 40 + 46 * Math.min(2, wrap(x, th.twist, W - 160).length); }
    x.textAlign = 'left';
    y = swatches(f, cols, y + 40, true);
    x.fillStyle = C.soft; x.textAlign = 'center'; x.font = `500 32px ${SANS}`;
    x.fillText(`⏱ ${th.time || 10} ${T('min', 'мин', 'min')} · ${T('a new theme every day', 'новая тема каждый день', 'jauna tēma katru dienu')}`, W / 2, y + 30); x.textAlign = 'left';
    footer(f, T('Draw with us → ', 'Рисуй с нами → ', 'Zīmē ar mums → ') + short('/challenge/'));
    const names = cols.map(c => c.n ? c.n[Li()] || c.n[0] : c.hex).join(', ');
    return { file: `theme-${ChallengeTheme.keyOf(d)}`, loading: th.loading, text: T(
      `Today’s drawing prompt: ${th.subject} 🎨\n${names ? 'Colors: ' + names + '\n' : ''}${th.twist ? th.twist + '\n' : ''}\nDraw it in ${th.time || 10} minutes and post it on the wall — your first drawing hatches your own pixel bird 🐣\n${S.plat === 'instagram' ? 'Link in bio' : link('/challenge/', 'theme')}\n\n#drawingprompt #dailydrawing #drawingchallenge #sketchbook #artprompt #cozyart`,
      `Тема дня: ${th.subject} 🎨\n${names ? 'Цвета: ' + names + '\n' : ''}${th.twist ? th.twist + '\n' : ''}\nНарисуй за ${th.time || 10} минут и выложи на стену — за первый рисунок вылупится твоя пиксельная птичка 🐣\n${S.plat === 'instagram' ? 'Ссылка в профиле' : link('/challenge/', 'theme')}\n\n#темадня #рисуемкаждыйдень #челлендж #скетчбук #идеидлярисования`,
      `Dienas tēma: ${th.subject} 🎨\n${names ? 'Krāsas: ' + names + '\n' : ''}${th.twist ? th.twist + '\n' : ''}\nUzzīmē ${th.time || 10} minūtēs un ieliec sienā — par pirmo zīmējumu izšķilsies tavs pikseļu putniņš 🐣\n${S.plat === 'instagram' ? 'Saite profilā' : link('/challenge/', 'theme')}\n\n#zīmēšana #ikdienaszīmējums #skiču_burtnīca #māksla`) };
  }

  // ---------- 2. темы на месяц ----------
  function month(cv) {
    const now = new Date(), y = now.getFullYear(), m = now.getMonth() + S.month, first = new Date(y, m, 1, 12), days = new Date(y, m + 1, 0).getDate();
    const mName = first.toLocaleString(['en-GB', 'ru-RU', 'lv-LV'][Li()], { month: 'long' }), mCap = mName[0].toUpperCase() + mName.slice(1);
    const f = frame(cv, T('Save this list', 'Сохрани список', 'Saglabā sarakstu')), { x, W } = f;
    x.fillStyle = C.ink; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    const title = T(`${mCap} drawing prompts`, `Темы для рисования: ${mName}`, `Zīmēšanas tēmas: ${mName}`);
    fit(x, title, `600 #px ${SERIF}`, W - 120, 76, 40); x.fillText(title, W / 2, f.y0 + 60);
    x.fillStyle = C.soft; x.font = `italic 400 32px ${SERIF}`; x.fillText(T('one small theme a day', 'одна маленькая тема в день', 'viena maza tēma dienā'), W / 2, f.y0 + 112); x.textAlign = 'left';
    const top = f.y0 + 160, rows = Math.ceil(days / 2), rh = Math.min(S.size === 'story' ? 84 : 64, (f.y1 - top - 20) / rows), colW = (W - 140) / 2;
    let loading = false;
    for (let i = 0; i < days; i++) {
      const th = window.ChallengeTheme.themeFor(new Date(y, m, i + 1, 12), Li()); if (th.loading) loading = true;
      const cx = 60 + (i < rows ? 0 : colW + 20), cy = top + (i % rows) * rh;
      x.fillStyle = i % 2 ? C.cream : C.paper; x.fillRect(cx, cy, colW, rh - 6);
      x.fillStyle = C.peach; x.font = `700 ${Math.round(rh * .42)}px ${SANS}`; x.textBaseline = 'middle'; x.fillText(String(i + 1), cx + 14, cy + rh / 2 - 3);
      x.fillStyle = C.ink; const t = th.loading ? '…' : th.subject, fs = Math.round(rh * .46);
      if (fit(x, t, `500 #px ${SANS}`, colW - 90, fs, 14) >= fs * .8) x.fillText(t, cx + 74, cy + rh / 2 - 3);
      else { const s2 = Math.round(rh * .32); x.font = `500 ${s2}px ${SANS}`; const ls = wrap(x, t, colW - 90).slice(0, 2); ls.forEach((l, j) => x.fillText(l, cx + 74, cy + rh / 2 - 3 + (j - (ls.length - 1) / 2) * s2 * 1.1)); } // длинная тема — в две строки
    }
    footer(f, T('Colors for every day → ', 'Цвета на каждый день → ', 'Krāsas katrai dienai → ') + short('/challenge/'));
    return { file: `prompts-${y}-${String(first.getMonth() + 1).padStart(2, '0')}`, loading, text: T(
      `${mCap} drawing prompts ✏️ One small theme a day — save this list and draw along!\nEvery day on the site: the theme, colors to use and a timer. Your first drawing hatches your own pixel bird 🐣\n${S.plat === 'instagram' ? 'Link in bio' : link('/challenge/', 'month')}\n\n#drawingprompts #${mName.toLowerCase()}drawingchallenge #artchallenge #sketchbookideas #30daychallenge #drawingideas`,
      `Темы для рисования на ${['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'][first.getMonth()]} ✏️ Одна маленькая тема в день — сохрани и рисуй вместе с нами!\nКаждый день на сайте: тема, цвета и таймер. За первый рисунок вылупится твоя пиксельная птичка 🐣\n${S.plat === 'instagram' ? 'Ссылка в профиле' : link('/challenge/', 'month')}\n\n#темыдлярисования #челлендж #рисуемкаждыйдень #идеидлярисования #скетчбук`,
      `Zīmēšanas tēmas: ${mName} ✏️ Viena maza tēma dienā — saglabā un zīmē kopā ar mums!\n${S.plat === 'instagram' ? 'Saite profilā' : link('/challenge/', 'month')}\n\n#zīmēšana #izaicinājums #skiču_burtnīca`) };
  }

  // ---------- 3. палитра ----------
  async function palette(cv) {
    const p = data.pal[((S.pal % data.pal.length) + data.pal.length) % data.pal.length]; if (!p) return null;
    const im = await img('/' + p.thumb.replace(/^\//, ''));
    const f = frame(cv, T('Free palette', 'Палитра', 'Palete')), { x, W } = f, L = S.lang;
    const ih = Math.round((f.y1 - f.y0) * .5);
    cover(x, im, 60, f.y0, W - 120, ih);
    const title = (p.title && (p.title[L] || p.title.en)) || '';
    x.fillStyle = C.ink; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; fit(x, title, `600 #px ${SERIF}`, W - 120, 64, 34); x.fillText(title, W / 2, f.y0 + ih + 80); x.textAlign = 'left';
    const cols = p.colors.slice(0, 6), top = f.y0 + ih + 120, sh = (f.y1 - top - 10) / cols.length;
    cols.forEach((c, i) => {
      const y = top + i * sh; x.fillStyle = c.hex; x.fillRect(60, y, W - 120, sh - 8);
      const dark = (() => { const n = parseInt(c.hex.slice(1), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 140; })();
      x.fillStyle = dark ? '#fff' : C.ink; x.textBaseline = 'middle'; x.font = `700 ${Math.round(Math.min(40, sh * .38))}px ${SANS}`; x.fillText(c[L] || c.en || '', 90, y + sh / 2 - 4);
      x.textAlign = 'right'; x.font = `500 ${Math.round(Math.min(34, sh * .32))}px ${SANS}`; x.fillText(c.hex.toUpperCase(), W - 90, y + sh / 2 - 4); x.textAlign = 'left';
    });
    footer(f, T('More free palettes → ', 'Ещё палитры → ', 'Vairāk palešu → ') + short('/palettes/'));
    const list = cols.map(c => `${c[L] || c.en} ${c.hex.toUpperCase()}`).join('\n');
    return { file: `palette-${p.key}`, text: T(
      `Color palette from my painting “${title}” 🎨\n\n${list}\n\nSave it for your next piece! More free palettes from my art — and one from your own photo:\n${S.plat === 'instagram' ? 'Link in bio' : link('/palettes/', 'palette')}\n\n#colorpalette #colorinspiration #palette #colorscheme #artinspiration #watercolor`,
      `Палитра из моей картины «${title}» 🎨\n\n${list}\n\nСохрани для следующего рисунка! Ещё палитры из моих картин — и палитра из твоего фото:\n${S.plat === 'instagram' ? 'Ссылка в профиле' : link('/palettes/', 'palette')}\n\n#палитра #цветоваяпалитра #сочетаниецветов #вдохновение #акварель`,
      `Krāsu palete no manas gleznas “${title}” 🎨\n\n${list}\n\n${S.plat === 'instagram' ? 'Saite profilā' : link('/palettes/', 'palette')}\n\n#krāsas #palete #iedvesma`) };
  }

  // ---------- 4. дело Титоса ----------
  async function titos(cv) {
    const ok = data.cases.filter(c => S.lang === 'ru' || !/[а-яё]/i.test(data.titles[S.lang][c.n] || '')); // без перевода названия — не показывать
    const c = ok[((S.cas % ok.length) + ok.length) % ok.length]; if (!c) return null;
    const sc = c.scenes.find(s => s.img), im = await img(sc.img);
    const title = data.titles[S.lang][c.n] || (c.title || {}).ru || '';
    const f = frame(cv, T('Case', 'Дело', 'Lieta') + ' #' + c.n), { x, W } = f;
    const ih = Math.round((f.y1 - f.y0) * .62);
    cover(x, im, 60, f.y0, W - 120, ih, true);
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillStyle = C.soft; x.font = `700 30px ${SANS}`; x.fillText(T('🕵️ DETECTIVE TITOS', '🕵️ ДЕТЕКТИВ ТИТОС', '🕵️ DETEKTĪVS TITOSS'), W / 2, f.y0 + ih + 60);
    x.fillStyle = C.ink; const sz = fit(x, title, `600 #px ${SERIF}`, W - 120, 72, 36); x.fillText(title, W / 2, f.y0 + ih + 60 + sz * 1.2);
    x.fillStyle = C.lilac; x.font = `italic 400 44px ${SERIF}`; x.fillText(T('Can you solve it?', 'Сможешь раскрыть?', 'Vai tu to atrisināsi?'), W / 2, Math.min(f.y1 - 20, f.y0 + ih + 60 + sz * 1.2 + 80)); x.textAlign = 'left';
    footer(f, T('Play free → ', 'Играть бесплатно → ', 'Spēlē bez maksas → ') + short('/titos/'));
    return { file: `titos-${c.n}`, text: T(
      `🕵️ Detective Titos, case #${c.n}: “${title}”\nLook closely at the picture. Find the clues, question the suspects and name the culprit. Can you solve it?\n\nA free cozy mystery game in your browser — no download, 100 cases.\n${S.plat === 'instagram' ? 'Link in bio' : link('/titos/', 'titos')}\n\n#cozygames #mysterygame #detectivegame #browsergame #indiegame #pixelart`,
      `🕵️ Детектив Титос, дело №${c.n}: «${title}»\nПрисмотрись к картинке. Найди улики, допроси подозреваемых и назови виновного. Сможешь раскрыть?\n\nБесплатная уютная детективная игра прямо в браузере — без скачивания, 100 дел.\n${S.plat === 'instagram' ? 'Ссылка в профиле' : link('/titos/', 'titos')}\n\n#уютныеигры #детектив #головоломка #браузернаяигра #пиксельарт`,
      `🕵️ Detektīvs Titoss, lieta Nr. ${c.n}: “${title}”\nAtrodi pierādījumus un nosauc vainīgo. Vai tu to atrisināsi?\n${S.plat === 'instagram' ? 'Saite profilā' : link('/titos/', 'titos')}\n\n#spēles #detektīvs #pikseļmāksla`) };
  }

  const POSTS = [
    { id: 'theme', ic: '🎨', name: 'Тема дня', draw: theme, about: 'Каждый день: Instagram, сторис, Threads, Pinterest.' },
    { id: 'month', ic: '📅', name: 'Темы на месяц', draw: month, about: 'Главный пост 1-го числа: список сохраняют и рисуют по нему. Лучше всего — Pinterest (2:3).' },
    { id: 'palette', ic: '🌈', name: 'Палитра', draw: palette, about: 'Pinterest обожает палитры: 2–3 пина в неделю.' },
    { id: 'titos', ic: '🕵️', name: 'Загадка Титоса', draw: titos, about: 'Раз в неделю: «Сможешь раскрыть?» — люди любят отвечать в комментариях.' },
  ];

  // ---------- экран ----------
  async function mount(main) {
    main.innerHTML = '<p class="be-note">Рисую посты…</p>';
    await load();
    const chips = (k, obj) => Object.entries(obj).map(([v, t]) => `<button type="button" class="pill-btn${S[k] === v ? ' pill-fill' : ''}" data-set="${k}" data-v="${v}">${esc(Array.isArray(t) ? t[2] : t)}</button>`).join('');
    const today = new Date(), iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    main.innerHTML = `<section class="adm-box"><p class="be-note">Картинки рисуются сами из того, что сейчас на сайте. Выберите язык, формат и куда выкладываете — потом «⬇ Скачать» и «📋 Скопировать текст». Ссылка в тексте помечена площадкой: в «👥 Посетителях» будет видно, откуда пришли.</p>
      <div class="adm-quick">${chips('lang', { en: 'EN', ru: 'RU', lv: 'LV' })}</div>
      <div class="adm-quick">${chips('size', SIZES)}</div>
      <div class="adm-quick">${chips('plat', PLAT)}</div></section>
      <div class="pp-posts">${POSTS.map(p => `<section class="adm-box pp-post" data-p="${p.id}"><h2>${p.ic} ${p.name}</h2><p class="be-note">${p.about}</p>
        <div class="adm-quick pp-post-ctl">${p.id === 'theme' ? `<label>День: <input type="date" class="be-input" data-day value="${S.day || iso(today)}"></label>` : ''}
          ${p.id === 'month' ? `<button type="button" class="pill-btn" data-mon="0">Этот месяц</button><button type="button" class="pill-btn" data-mon="1">Следующий</button>` : ''}
          ${p.id === 'palette' || p.id === 'titos' ? `<button type="button" class="pill-btn" data-prev>←</button><button type="button" class="pill-btn" data-rnd>🎲 Другая</button><button type="button" class="pill-btn" data-next>→</button>` : ''}</div>
        <canvas class="pp-post-cv"></canvas><p class="be-note pp-post-wait" hidden>⏳ Темы ещё загружаются — картинка обновится сама.</p>
        <textarea class="be-input pp-post-tx" rows="8" readonly></textarea>
        <div class="adm-quick"><button type="button" class="pill-btn pill-fill" data-dl>⬇ Скачать картинку</button><button type="button" class="pill-btn" data-cp>📋 Скопировать текст</button></div></section>`).join('')}</div>`;
    const draw = async sec => {
      const p = POSTS.find(x => x.id === sec.dataset.p), cv = sec.querySelector('canvas');
      const r = await p.draw(cv); if (!r) return;
      sec.dataset.file = `pp-${r.file}-${S.lang}-${S.size}.png`;
      sec.querySelector('.pp-post-tx').value = r.text;
      sec.querySelector('.pp-post-wait').hidden = !r.loading;
    };
    const all = () => main.querySelectorAll('.pp-post').forEach(draw);
    main.querySelectorAll('[data-set]').forEach(b => b.onclick = () => {
      S[b.dataset.set] = b.dataset.v; keep();
      main.querySelectorAll(`[data-set="${b.dataset.set}"]`).forEach(x => x.classList.toggle('pill-fill', x === b)); all();
    });
    main.querySelectorAll('.pp-post').forEach(sec => {
      const id = sec.dataset.p, again = () => draw(sec);
      const day = sec.querySelector('[data-day]'); if (day) day.onchange = () => { S.day = day.value; again(); };
      sec.querySelectorAll('[data-mon]').forEach(b => { b.classList.toggle('pill-fill', +b.dataset.mon === S.month); b.onclick = () => { S.month = +b.dataset.mon; sec.querySelectorAll('[data-mon]').forEach(x => x.classList.toggle('pill-fill', x === b)); again(); }; });
      const k = id === 'palette' ? 'pal' : 'cas', n = () => (id === 'palette' ? data.pal : data.cases).length;
      if (id === 'palette' || id === 'titos') {
        if (!S['_' + k]) { S[k] = Math.floor(Math.random() * n()); S['_' + k] = 1; }
        sec.querySelector('[data-prev]').onclick = () => { S[k]--; again(); };
        sec.querySelector('[data-next]').onclick = () => { S[k]++; again(); };
        sec.querySelector('[data-rnd]').onclick = () => { S[k] = Math.floor(Math.random() * n()); again(); };
      }
      sec.querySelector('[data-dl]').onclick = () => sec.querySelector('canvas').toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = sec.dataset.file || 'pp-post.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
      const cp = sec.querySelector('[data-cp]');
      cp.onclick = async () => { const t = sec.querySelector('.pp-post-tx').value; try { await navigator.clipboard.writeText(t); cp.textContent = '✓ Скопировано'; setTimeout(() => { cp.textContent = '📋 Скопировать текст'; }, 2000); } catch (e) { sec.querySelector('.pp-post-tx').select(); } };
    });
    if (!mount.on) mount.on = 1, document.addEventListener('pp:chplan', () => { if (main.querySelector('.pp-posts')) main.querySelectorAll('.pp-post[data-p="theme"], .pp-post[data-p="month"]').forEach(draw); });
    all();
  }
  window.PPPostsAdmin = { mount };
})();
