// Daily Challenge: тема дня (одинаковая у всех в один день), таймер с этапами,
// личный дневник скетчей в браузере, серия дней и карточка «поделиться».
(() => {
  const D = window.CHALLENGE_DATA, root = document.getElementById('challenge');
  if (!D || !root || !window.ChallengeTheme) return;
  const lang = document.documentElement.lang, L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const locale = ['en-GB', 'ru-RU', 'lv-LV'][L];
  const UI = {
    min: ['min', 'мин', 'min'],
    colors: ['Your 3 colours', 'Ваши 3 цвета', 'Tavas 3 krāsas'],
    time: ['Time', 'Время', 'Laiks'],
    tip: ['Tip of the day', 'Совет дня', 'Dienas padoms'],
    easy: ['Relaxed', 'Спокойно', 'Mierīgi'],
    pro: ['Challenge me', 'Посложнее', 'Grūtāk'],
    start: ['Start', 'Старт', 'Sākt'], pause: ['Pause', 'Пауза', 'Pauze'], resume: ['Resume', 'Продолжить', 'Turpināt'], reset: ['Reset', 'Сброс', 'No sākuma'],
    stages: [['Big shape', 'Большая форма', 'Lielā forma'], ['Colour blocks', 'Цветовые пятна', 'Krāsu laukumi'], ['Darkest accents & details', 'Тёмные акценты и детали', 'Tumšie akcenti un detaļas']],
    stageHints: [['Catch the silhouette. No details yet.', 'Поймайте силуэт. Пока без деталей.', 'Noķer siluetu. Vēl bez detaļām.'],
      ['Lay in your three colours in big shapes.', 'Положите свои три цвета большими пятнами.', 'Uzklāj savas trīs krāsas lielos laukumos.'],
      ['Only the darkest bits and a few details.', 'Только самые тёмные места и пара деталей.', 'Tikai tumšākās vietas un dažas detaļas.']],
    ready: ['Ready when you are', 'Начинайте, когда будете готовы', 'Sāc, kad esi gatavs'],
    timeUp: ['Time! Brush down, you did it.', 'Время! Кисть в сторону — вы справились.', 'Laiks! Ota malā — tu to izdarīji.'],
    done: ['I drew it', 'Я нарисовал(а)', 'Es uzzīmēju'],
    doneYes: ['Drawn ✓', 'Нарисовано ✓', 'Uzzīmēts ✓'],
    backToday: ['← Back to today', '← Вернуться к сегодня', '← Atpakaļ uz šodienu'],
    extra: ['EXTRA day! Add 1 extra art material in any colour.', 'День ЭКСТРА! Добавьте 1 дополнительный арт-материал любого цвета.', 'EKSTRA diena! Pievieno 1 papildu mākslas materiālu jebkurā krāsā.'],
    extraBw: ['EXTRA day!', 'День ЭКСТРА!', 'EKSTRA diena!'],
    twist: ['Your twist', 'Особенность', 'Tavs pavērsiens'],
    modeColor: ['In colour', 'В цвете', 'Krāsās'],
    modeBw: ['Black & white', 'Ч/Б', 'Melnbalts'],
    stage2Bw: ['Tones & textures', 'Тон и фактура', 'Toņi un faktūras'],
    hint2Bw: ['Build up the darks with hatching, dots or solid fills.', 'Наберите тёмные места штриховкой, точками или заливкой.', 'Veido tumšās vietas ar svītrojumu, punktiem vai pilnu aizkrāsojumu.'],
    bday: ['Today is my birthday! Draw something festive with me 🎂', 'Сегодня мой день рождения! Нарисуйте со мной что-нибудь праздничное 🎂', 'Šodien ir mana dzimšanas diena! Uzzīmē ar mani kaut ko svētku 🎂'],
    today: ['Today', 'Сегодня', 'Šodien'],
    bwQ: ['Only a pen or ink today?', 'Сегодня только ручка или тушь?', 'Šodien tikai pildspalva vai tuša?'],
    saveShare: ['Save to photos or share', 'Сохранить в фото или поделиться', 'Saglabāt foto vai dalīties'],
    downloadFile: ['Download as a file', 'Скачать файлом', 'Lejupielādēt failu'],
    holdHint: ['Or press and hold the picture and choose “Save to Photos”.', 'Или нажмите на картинку и удерживайте → «Сохранить в Фото».', 'Vai turi nospiestu attēlu un izvēlies “Saglabāt attēlu”.'],
    styleFull: ['Full card', 'Полная карточка', 'Pilna kartīte'],
    styleMini: ['Just the photo', 'Только фото', 'Tikai foto'],
    needPhoto: ['Add a photo of your sketch first.', 'Сначала добавьте фото рисунка.', 'Vispirms pievieno skices foto.'],
    locked: ['Opens on this day', 'Откроется в этот день', 'Atvērsies šajā dienā'],
    photo: ['Add a photo of my sketch', 'Добавить фото рисунка', 'Pievienot skices foto'],
    photoChange: ['Change photo', 'Заменить фото', 'Mainīt foto'],
    share: ['Make a share card', 'Сделать карточку для соцсетей', 'Izveidot kartīti dalīšanai'],
    shareHint: ['Post it with #dailypigeonpolly', 'Выложите с хэштегом #dailypigeonpolly', 'Publicē ar #dailypigeonpolly'],
    download: ['Download card', 'Скачать карточку', 'Lejupielādēt kartīti'],
    streak: [n => n ? `${n} day${n === 1 ? '' : 's'} in a row` : 'Start your streak today',
      n => n ? `${n} ${plural(n, 'день', 'дня', 'дней')} подряд` : 'Начните серию сегодня',
      n => n ? `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'diena' : 'dienas'} pēc kārtas` : 'Sāc savu sēriju šodien'],
    total: [n => `${n} sketches in total`, n => `Всего скетчей: ${n}`, n => `Kopā skices: ${n}`],
    full: ['Your browser storage is full, so the photo wasn’t saved.', 'Память браузера заполнена, фото не сохранилось.', 'Pārlūka atmiņa ir pilna, foto netika saglabāts.'],
    prev: ['Previous month', 'Предыдущий месяц', 'Iepriekšējais mēnesis'], next: ['Next month', 'Следующий месяц', 'Nākamais mēnesis'],
  };
  const t = k => UI[k][L];
  function plural(n, a, b, c) { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; }

  // ---------- тема дня (расчёт — в challenge-theme.js, общий с главной) ----------
  const CT = window.ChallengeTheme, { keyOf, rngFor, extraDay } = CT;
  const pad = n => String(n).padStart(2, '0');
  const today = new Date(), todayKey = keyOf(today);
  const themeFor = d => CT.themeFor(d, L);
  let sel = new Date(today), selKey = todayKey, theme = themeFor(sel);
  let bw = false; try { bw = localStorage.getItem('ch-bw') === '1'; } catch (e) { /* без памяти */ }

  // ---------- хранилище ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  let level = store.get('ch-level', 'easy');
  const diary = {}; // фото только в памяти — для карточки, нигде не сохраняется
  const minutes = () => theme.time + (level === 'easy' ? 5 : 0);

  // ---------- календарь ----------
  const $ = s => root.querySelector(s);
  function renderCal(anim) {
    const weekday = sel.toLocaleDateString(locale, { weekday: 'long' });
    const month = sel.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    $('#ch-cal').innerHTML = `
    <div class="tearpad${bw ? ' bw' : ''}">
      ${anim ? '<div class="page old" aria-hidden="true"></div>' : ''}
      <div class="page">
        ${bw ? inkBlots(selKey) : ''}
        <div class="page-top"><span>${month}</span></div>
        <div class="page-day">${sel.getDate()}</div>
        <div class="page-weekday">${weekday}</div>
        <div class="page-subject">${theme.subject}</div>
        <div class="page-label">${bw ? t('twist') : t('colors')}</div>
        ${bw ? `<div class="page-twist">✒ ${theme.twist}</div>` : `<div class="swatches">${theme.colors.map(c => `<span class="sw"><i style="background:${c.hex}"></i>${c.n[L]}</span>`).join('')}</div>`}
        <div class="page-time"><span class="page-label">${t('time')}</span> <b id="ch-min"></b></div>
        ${theme.bday ? `<div class="page-extra page-bday">${t('bday')}</div>` : ''}
        ${theme.extra ? `<div class="page-extra">✦ ${extraText(theme)}</div>` : ''}
      </div>
    </div>
    ${selKey !== todayKey ? `<p class="back-today"><button type="button" id="ch-today">${t('backToday')}</button></p>` : ''}
    <div class="tip"><b>${t('tip')}</b><p>${theme.tip}</p></div>`;
    const old = $('.page.old'); old && old.addEventListener('animationend', () => old.remove());
    const bt = $('#ch-today'); bt && bt.addEventListener('click', () => { view = new Date(today.getFullYear(), today.getMonth(), 1); selectDay(new Date(today)); });
    renderMin();
  }
  function extraText(th) { return bw ? `${t('extraBw')} ${th.extraBw[0].toUpperCase() + th.extraBw.slice(1)}.` : t('extra'); }
  // кляксы для Ч/Б листка: свои на каждый день, всегда по краям, под текстом
  function blot(r, x, y, R) {
    const n = 11 + Math.floor(r() * 5), pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, k = R * (0.65 + r() * 0.55); pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k]); }
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let d = `M${mid(pts[n - 1], pts[0]).join(' ')}`;
    pts.forEach((p, i) => { const m = mid(p, pts[(i + 1) % n]); d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`; });
    let dots = '';
    for (let i = 0, m = 3 + Math.floor(r() * 5); i < m; i++) {
      const a = r() * Math.PI * 2, dist = R * (1.25 + r() * 0.9);
      dots += `<circle cx="${(x + Math.cos(a) * dist).toFixed(1)}" cy="${(y + Math.sin(a) * dist).toFixed(1)}" r="${(1.5 + r() * R * 0.13).toFixed(1)}"/>`;
    }
    const drip = r() < 0.5 ? `<path d="M${x - 4} ${y + R * 0.6} q4 ${R * 1.1} 8 0 z"/><circle cx="${x}" cy="${y + R * 1.55}" r="4"/>` : '';
    return `<path d="${d} Z"/>${dots}${drip}`;
  }
  function inkBlots(seed) {
    const r = rngFor('ink-' + seed);
    // центры клякс в % листка — только края, чтобы не закрывать текст
    const spots = [[4, 26], [94, 22], [95, 62], [3, 74], [72, 95], [22, 96], [96, 42], [2, 48], [86, 88]];
    for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
    const k = 2 + Math.floor(r() * 2);
    return spots.slice(0, k).map(([x, y]) => {
      const size = 70 + Math.floor(r() * 60);
      return `<svg class="ink" style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;transform:translate(-50%,-50%) rotate(${Math.floor(r() * 360)}deg)" viewBox="-60 -60 120 120" aria-hidden="true"><g fill="#141414">${blot(r, 0, 0, 20 + r() * 10)}</g></svg>`;
    }).join('');
  }
  const renderMin = () => { $('#ch-min').textContent = `${minutes()} ${t('min')}`; };
  renderCal(true);

  // ---------- цвет / Ч/Б: Полли в тёмных очках ----------
  const COOL = ['......ddd.....', '.....dbbbd....', '....dggggggg..', '....dbgwgggoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...',
    '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const COOLC = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', g: '#0d0a14', w: '#ffffff', o: '#f2a73b' };
  document.getElementById('ch-bw-polly').innerHTML = `<svg viewBox="0 0 14 14" shape-rendering="crispEdges">${COOL.map((r, y) => [...r].map((ch, x) => COOLC[ch] ? `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${COOLC[ch]}"/>` : '').join('')).join('')}</svg>`;
  document.getElementById('ch-bw-q').textContent = t('bwQ');
  const pick = document.getElementById('ch-bw-pick'); pick.classList.toggle('on', bw);
  const pm = document.getElementById('ch-palette');
  pm.innerHTML = ['color', 'bw'].map(v => `<button type="button" data-v="${v}" aria-pressed="${(v === 'bw') === bw}">${t(v === 'bw' ? 'modeBw' : 'modeColor')}</button>`).join('');
  pm.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    bw = b.dataset.v === 'bw'; try { localStorage.setItem('ch-bw', bw ? '1' : '0'); } catch (err) { /* без памяти */ }
    pm.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); pick.classList.toggle('on', bw);
    renderCal(false); renderDiary(); draw(); $('#ch-card').innerHTML = '';
  });

  // ---------- уровень ----------
  const lv = $('#ch-level');
  lv.innerHTML = ['easy', 'pro'].map(v => `<button type="button" data-v="${v}" aria-pressed="${v === level}">${t(v)}</button>`).join('');
  lv.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || running) return;
    level = b.dataset.v; store.set('ch-level', level);
    lv.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    renderMin(); resetTimer();
  });

  // ---------- таймер ----------
  const SPLIT = [0.2, 0.55, 0.25];
  let total = 0, left = 0, running = false, iv = null, stage = -1, actx = null;
  const clock = $('#ch-clock'), stageEl = $('#ch-stage'), hintEl = $('#ch-hint'), bar = $('#ch-bar'), go = $('#ch-go'), rs = $('#ch-reset');
  bar.innerHTML = SPLIT.map(f => `<span style="flex:${f}"><i></i></span>`).join('');
  const fmt = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
  const beep = (f = 880, d = 0.15) => {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = f; g.gain.setValueAtTime(0.12, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + d);
      o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + d);
    } catch (e) { /* без звука */ }
    navigator.vibrate && navigator.vibrate(120);
  };
  function stageAt(elapsed) { let acc = 0; for (let i = 0; i < SPLIT.length; i++) { acc += SPLIT[i] * total; if (elapsed < acc) return i; } return SPLIT.length - 1; }
  function draw() {
    clock.textContent = fmt(left);
    const elapsed = total - left;
    let acc = 0;
    [...bar.children].forEach((seg, i) => {
      const len = SPLIT[i] * total, k = Math.max(0, Math.min(1, (elapsed - acc) / len));
      seg.firstChild.style.width = k * 100 + '%'; acc += len;
    });
    if (!running && left === total) { stageEl.textContent = t('ready'); hintEl.textContent = ''; return; }
    const s = stageAt(elapsed);
    if (s !== stage) { if (stage >= 0 && running) beep(660); stage = s; }
    stageEl.textContent = `${s + 1}/3 · ${bw && s === 1 ? t('stage2Bw') : UI.stages[s][L]}`;
    hintEl.textContent = bw && s === 1 ? t('hint2Bw') : UI.stageHints[s][L];
  }
  function resetTimer() { clearInterval(iv); running = false; total = left = minutes() * 60; stage = -1; go.textContent = t('start'); draw(); }
  go.addEventListener('click', () => {
    if (running) { clearInterval(iv); running = false; go.textContent = t('resume'); return; }
    if (left === 0) resetTimer();
    running = true; go.textContent = t('pause'); beep(990, 0.1);
    iv = setInterval(() => {
      left--; draw();
      if (left <= 0) { clearInterval(iv); running = false; go.textContent = t('start'); stageEl.textContent = t('timeUp'); hintEl.textContent = ''; beep(523, .2); setTimeout(() => beep(784, .3), 220); }
    }, 1000);
  });
  rs.addEventListener('click', resetTimer);
  rs.textContent = t('reset');
  resetTimer();

  // ---------- дневник ----------
  const photoBtn = $('#ch-photo'), fileIn = $('#ch-file'), note = $('#ch-note'), shareBtn = $('#ch-share');
  const save = () => true;
  function renderToday() {
    const e = diary[selKey];
    photoBtn.textContent = e && e.img ? t('photoChange') : t('photo');
    shareBtn.textContent = t('share');
    $('#ch-thumb').innerHTML = e && e.img ? `<img src="${e.img}" alt="">` : '';
  }
  // стиль карточки: полная рамка или только фото с хэштегом, сайтом и Полли в кружке
  let cardStyle = store.get('ch-card-style', 'full');
  const styleBox = document.createElement('div');
  styleBox.className = 'ch-level ch-card-style'; styleBox.setAttribute('role', 'group');
  styleBox.innerHTML = ['full', 'mini'].map(v => `<button type="button" data-v="${v}" aria-pressed="${v === cardStyle}">${t(v === 'full' ? 'styleFull' : 'styleMini')}</button>`).join('');
  shareBtn.before(styleBox);
  styleBox.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    cardStyle = b.dataset.v; store.set('ch-card-style', cardStyle);
    styleBox.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    $('#ch-card').innerHTML = '';
  });
  photoBtn.addEventListener('click', () => fileIn.click());
  fileIn.addEventListener('change', () => {
    const f = fileIn.files[0]; if (!f) return;
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1600 / Math.max(img.width, img.height)); // хватает и для карточки «только фото»
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      diary[selKey] = { done: 1, img: c.toDataURL('image/jpeg', 0.86) };
      URL.revokeObjectURL(img.src); fileIn.value = '';
      renderToday(); renderDiary();
    };
    img.src = URL.createObjectURL(f);
  });

  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  const START = new Date(2026, 9, 1); // челлендж начался 1 октября 2026
  function streak() {
    let n = 0; const d = new Date(today);
    if (!diary[keyOf(d)]) d.setDate(d.getDate() - 1);
    while (diary[keyOf(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function renderDiary() {
    $('#ch-month').textContent = view.toLocaleDateString(locale, { month: 'long', year: 'numeric' }).replace(/\s*г\.$/, '');
    const first = (view.getDay() + 6) % 7, days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const names = [...Array(7)].map((_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }));
    let html = names.map(n => `<span class="dow">${n}</span>`).join('') + '<span></span>'.repeat(first);
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    for (let i = 1; i <= days; i++) {
      const d = new Date(view.getFullYear(), view.getMonth(), i), k = keyOf(d), e = diary[k];
      if (d < START) { html += `<span class="day before"><b>${i}</b></span>`; continue; }
      if (d > t0) { html += `<span class="day locked${i === extraDay(d.getFullYear(), d.getMonth()) ? ' extra' : ''}${d.getMonth() === 0 && i === 23 ? ' bday' : ''}" title="${t('locked')}"><b>${i}</b><i aria-hidden="true">🔒</i></span>`; continue; }
      const th = themeFor(d);
      html += `<button type="button" class="day${th.extra ? ' extra' : ''}${th.bday ? ' bday' : ''}${k === todayKey ? ' today' : ''}${k === selKey ? ' sel' : ''}" data-k="${k}">`
        + (e && e.img ? `<img src="${e.img}" alt="">` : '')
        + `<b>${i}</b><span class="d-subj">${th.subject}</span><span class="d-dots">${bw ? '<em>✒</em>' : th.colors.map(c => `<i style="background:${c.hex}"></i>`).join('')}</span></button>`;
    }
    $('#ch-grid').innerHTML = html;
    let lg = $('#ch-legend');
    if (!lg) { lg = document.createElement('p'); lg.id = 'ch-legend'; lg.className = 'extra-legend'; $('#ch-grid').after(lg); }
    lg.innerHTML = `<span aria-hidden="true">✦</span> ${bw ? t('extraBw') : t('extra')}`;
    $('#ch-prev').disabled = view <= START;
  }
  $('#ch-grid').addEventListener('click', e => {
    const b = e.target.closest('button.day'); if (!b) return;
    const [yy, mm, dd] = b.dataset.k.split('-').map(Number);
    selectDay(new Date(yy, mm - 1, dd));
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  function selectDay(d) {
    sel = d; selKey = keyOf(d); theme = themeFor(d);
    renderCal(true); resetTimer(); $('#ch-card').innerHTML = ''; renderToday(); renderDiary();
  }
  $('#ch-prev').addEventListener('click', () => { view.setMonth(view.getMonth() - 1); renderDiary(); });
  $('#ch-next').addEventListener('click', () => { view.setMonth(view.getMonth() + 1); renderDiary(); });
  const tb = document.createElement('button'); tb.type = 'button'; tb.id = 'ch-goto-today'; tb.className = 'diary-today'; tb.textContent = t('today');
  $('#ch-next').after(tb);
  tb.addEventListener('click', () => {
    view = new Date(today.getFullYear(), today.getMonth(), 1); selectDay(new Date(today));
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#ch-prev').setAttribute('aria-label', t('prev')); $('#ch-next').setAttribute('aria-label', t('next'));

  // ---------- карточка «поделиться» ----------
  const POLLY = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...',
    '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const PC = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b' };
  function wrapText(g, text, x, y, maxW, lh) {
    const words = text.split(' '); let line = '';
    for (const w of words) { const test = line ? line + ' ' + w : w; if (g.measureText(test).width > maxW && line) { g.fillText(line, x, y); y += lh; line = w; } else line = test; }
    g.fillText(line, x, y); return y;
  }
  async function makeCard() {
    await (document.fonts ? document.fonts.ready : Promise.resolve());
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
    const g = c.getContext('2d');
    g.fillStyle = '#2B1A51'; g.fillRect(0, 0, 1080, 1350);
    g.fillStyle = '#F0A987'; g.font = '500 36px Karla, sans-serif';
    g.fillText(`Daily Challenge · ${sel.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}`, 70, 100);
    const e = diary[selKey];
    const box = { x: 70, y: 150, w: 940, h: 760 };
    g.fillStyle = '#F4F0FA'; g.beginPath(); g.roundRect ? g.roundRect(box.x, box.y, box.w, box.h, 28) : g.rect(box.x, box.y, box.w, box.h); g.fill();
    if (e && e.img) {
      const im = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = e.img; });
      const s = Math.min((box.w - 40) / im.width, (box.h - 40) / im.height);
      const w = im.width * s, h = im.height * s;
      g.drawImage(im, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h);
    } else {
      g.fillStyle = '#2B1A51'; g.font = '600 76px Fraunces, Georgia, serif'; g.textAlign = 'center';
      wrapText(g, theme.subject, 540, 480, 820, 90); g.textAlign = 'left';
    }
    g.fillStyle = '#F3EFFA'; g.font = '600 58px Fraunces, Georgia, serif';
    wrapText(g, theme.subject, 70, 1010, 760, 66);
    if (bw) {
      g.fillStyle = '#F0A987'; g.font = '500 36px Karla, sans-serif';
      wrapText(g, `✒ ${theme.twist} · ${minutes()} ${t('min')}`, 70, 1122, 760, 42);
    } else {
      theme.colors.forEach((col, i) => {
        g.fillStyle = col.hex; g.beginPath(); g.arc(100 + i * 70, 1110, 26, 0, Math.PI * 2); g.fill();
        g.strokeStyle = '#F3EFFA'; g.lineWidth = 4; g.stroke();
      });
      g.fillStyle = '#D9D3F2'; g.font = '500 34px Karla, sans-serif';
      g.fillText(`${minutes()} ${t('min')}`, 330, 1122);
    }
    if (theme.extra) { g.fillStyle = '#E9A93B'; g.font = '700 30px Karla, sans-serif'; wrapText(g, '✦ ' + extraText(theme), 70, 1185, 760, 36); }
    g.fillStyle = '#F0A987'; g.font = '700 40px Karla, sans-serif'; g.fillText('#dailypigeonpolly', 70, 1250);
    g.fillStyle = '#D9D3F2'; g.font = '500 32px Karla, sans-serif'; g.fillText('pigeonpolly.com', 70, 1300);
    const px = 9;
    POLLY.forEach((row, y) => [...row].forEach((ch, x) => { if (PC[ch]) { g.fillStyle = PC[ch]; g.fillRect(860 + x * px, 1150 + y * px, px, px); } }));
    return c;
  }
  async function makeMini() {
    await (document.fonts ? document.fonts.ready : Promise.resolve());
    const im = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = diary[selKey].img; });
    // пропорции фото, но в рамках, которые принимает Instagram (от 1.91:1 до 4:5)
    const W = 1080, H = Math.max(566, Math.min(1350, Math.round(W * im.height / im.width)));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const k = Math.max(W / im.width, H / im.height), w = im.width * k, h = im.height * k;
    g.drawImage(im, (W - w) / 2, (H - h) * 0.35, w, h);
    // Полли в кружке
    const R = 62, cx = 40 + R, cy = H - 40 - R;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.arc(cx + 3, cy + 5, R + 4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#FFFDF8'; g.beginPath(); g.arc(cx, cy, R + 4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#F0A987'; g.beginPath(); g.arc(cx, cy, R - 2, 0, Math.PI * 2); g.fill();
    const px = 6, ox = cx - 7 * px + 2, oy = cy - 7 * px;
    POLLY.forEach((row, y) => [...row].forEach((ch, x) => { if (PC[ch]) { g.fillStyle = PC[ch]; g.fillRect(ox + x * px, oy + y * px, px, px); } }));
    // плашка: хэштег и сайт
    g.font = '700 34px Karla, sans-serif'; const t1 = '#dailypigeonpolly', w1 = g.measureText(t1).width;
    g.font = '500 28px Karla, sans-serif'; const t2 = 'pigeonpolly.com', w2 = g.measureText(t2).width;
    const pw = Math.max(w1, w2) + 52, ph = 96, x0 = cx + R + 18, y0 = cy - ph / 2;
    g.fillStyle = 'rgba(20,12,40,.72)'; g.beginPath(); g.roundRect ? g.roundRect(x0, y0, pw, ph, 26) : g.rect(x0, y0, pw, ph); g.fill();
    g.fillStyle = '#FFFFFF'; g.font = '700 34px Karla, sans-serif'; g.fillText(t1, x0 + 26, y0 + 42);
    g.fillStyle = '#F0A987'; g.font = '500 28px Karla, sans-serif'; g.fillText(t2, x0 + 26, y0 + 78);
    return c;
  }
  shareBtn.addEventListener('click', async () => {
    if (cardStyle === 'mini' && !(diary[selKey] && diary[selKey].img)) { $('#ch-card').innerHTML = `<p>${t('needPhoto')}</p>`; return; }
    const c = cardStyle === 'mini' ? await makeMini() : await makeCard();
    const name = `dailypigeonpolly-${selKey}.png`;
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    const url = URL.createObjectURL(blob);
    let file = null;
    try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { /* старый браузер */ }
    const canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
    const out = $('#ch-card');
    // на телефоне главное — «Поделиться»: там есть «Сохранить изображение» в фотоплёнку
    out.innerHTML = `<img src="${url}" alt=""><p>${t('shareHint')}</p><div class="card-actions">`
      + (canShare ? `<button type="button" class="cta-btn" id="ch-share-go">${t('saveShare')}</button><a class="cta-link" download="${name}" href="${url}">${t('downloadFile')}</a>`
        : `<a class="cta-btn" download="${name}" href="${url}">${t('download')}</a>`)
      + `</div>${canShare || matchMedia('(pointer: coarse)').matches ? `<p class="hold-hint">${t('holdHint')}</p>` : ''}`;
    const go = $('#ch-share-go');
    go && go.addEventListener('click', () => navigator.share({ files: [file], text: '#dailypigeonpolly' }).catch(() => {}));
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  renderToday(); renderDiary();
})();
