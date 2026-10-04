// Daily Challenge: тема дня (одинаковая у всех в один день), таймер с этапами,
// личный дневник скетчей в браузере, серия дней и карточка «поделиться».
(() => {
  const D = window.CHALLENGE_DATA, root = document.getElementById('challenge');
  if (!D || !root) return;
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

  // ---------- тема дня ----------
  const pad = n => String(n).padStart(2, '0');
  const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = new Date(), todayKey = keyOf(today);
  function rngFor(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    let a = h >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  }
  // день ЭКСТРА: свой случайный день каждый месяц, число не повторяет прошлый месяц
  const extraMemo = {};
  function extraDay(y, m) {
    const key = y * 12 + m; if (extraMemo[key]) return extraMemo[key];
    const days = new Date(y, m + 1, 0).getDate(), rm = rngFor('extra-' + y + '-' + m);
    let v = 1 + Math.floor(rm() * days);
    if (key > 2026 * 12 + 9) { const prev = extraDay(m ? y : y - 1, m ? m - 1 : 11); while (v === prev) v = 1 + Math.floor(rm() * days); }
    return (extraMemo[key] = v);
  }
  const orders = {};
  function orderOf(name, len) {
    if (orders[name]) return orders[name];
    const r = rngFor(name), o = [...Array(len).keys()];
    for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    return (orders[name] = o);
  }
  // 2/3 дней — предмет текущего сезона, остальные — любой другой; внутри каждой группы без повторов
  const SEASON = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
  const pools = { none: [] }; D.subjects.forEach((r, i) => (r[3] || 'none').split(' ').forEach(t => (pools[t] = pools[t] || []).push(i)));
  const plan = [], used = {};
  // ровно 2/3 дней каждого месяца — сезонные (какие именно — случайно, но одинаково у всех)
  function seasonalDay(d) {
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const o = orderOf('season-' + d.getFullYear() + '-' + d.getMonth(), days);
    return o.indexOf(d.getDate() - 1) < Math.ceil(days * 2 / 3);
  }
  function planFor(n) {
    while (plan.length <= n) {
      const d = new Date(2026, 9, 5 + plan.length);
      const bd = d.getMonth() === 0 && d.getDate() === 23;
      const p = seasonalDay(d) ? SEASON[d.getMonth()] : 'none';
      const pool = pools[p], o = orderOf('pool-' + p, pool.length);
      let k = used[p] || 0, idx = pool[o[k % pool.length]];
      // сезонный предмет мог встретиться в соседнем сезоне недавно — пропускаем повтор за последние 60 дней
      for (let tries = 0; tries < pool.length && plan.slice(-60).includes(idx); tries++) { k++; idx = pool[o[k % pool.length]]; }
      if (!bd) used[p] = k + 1;
      plan.push(bd ? -1 : idx);
    }
    return plan[n];
  }
  const BDAY = ['a birthday cake', 'a gift box with a bow', 'a bunch of balloons', 'a party hat', 'a birthday candle', 'a cupcake', 'a piñata', 'a greeting card', 'a confetti cannon', 'a paper crown'];
  function birthdayIdx(y) {
    const name = BDAY[mod(y - 2027, BDAY.length)], i = D.subjects.findIndex(r => r[0] === name);
    return i < 0 ? 0 : i;
  }
  const mod = (a, b) => ((a % b) + b) % b;
  function themeFor(d) {
    const r = rngFor('polly-' + keyOf(d));
    // до 5 октября 2026 — старая формула (первые 98 тем), дальше все темы по кругу без повторов
    const legacy = Math.floor(r() * 98);
    const n = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 9, 5)) / 864e5);
    const bday = d.getMonth() === 0 && d.getDate() === 23;
    const subject = n < 0 ? D.subjects[legacy] : bday ? D.subjects[birthdayIdx(d.getFullYear())] : D.subjects[planFor(n)];
    const cols = D.colors.slice();
    for (let i = cols.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
    const time = D.times[Math.floor(r() * D.times.length)];
    const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    // раз в месяц — день ЭКСТРА (свой случайный день для каждого месяца)
    const extra = d.getDate() === extraDay(d.getFullYear(), d.getMonth());
    const twist = D.twists[orderOf('polly-twist', D.twists.length)[mod(n, D.twists.length)]][L];
    const mi = d.getFullYear() * 12 + d.getMonth() - (2026 * 12 + 9);
    const extraBw = D.extrasBw[orderOf('polly-extrabw', D.extrasBw.length)[mod(mi, D.extrasBw.length)]][L];
    return { subject: subject[L], colors: cols.slice(0, 3), twist, extraBw, time, extra, bday, tip: D.tips[day % D.tips.length][L] };
  }
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
    <div class="tearpad">
      ${anim ? '<div class="page old" aria-hidden="true"></div>' : ''}
      <div class="page">
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
  const renderMin = () => { $('#ch-min').textContent = `${minutes()} ${t('min')}`; };
  renderCal(true);

  // ---------- цвет / Ч/Б ----------
  const pm = $('#ch-palette');
  pm.innerHTML = ['color', 'bw'].map(v => `<button type="button" data-v="${v}" aria-pressed="${(v === 'bw') === bw}">${t(v === 'bw' ? 'modeBw' : 'modeColor')}</button>`).join('');
  pm.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    bw = b.dataset.v === 'bw'; try { localStorage.setItem('ch-bw', bw ? '1' : '0'); } catch (err) { /* без памяти */ }
    pm.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
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
  photoBtn.addEventListener('click', () => fileIn.click());
  fileIn.addEventListener('change', () => {
    const f = fileIn.files[0]; if (!f) return;
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 520 / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      diary[selKey] = { done: 1, img: c.toDataURL('image/jpeg', 0.72) };
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
  shareBtn.addEventListener('click', async () => {
    const c = await makeCard();
    const url = c.toDataURL('image/png');
    const out = $('#ch-card');
    out.innerHTML = `<img src="${url}" alt=""><p>${t('shareHint')}</p><div class="card-actions"><a class="cta-btn" download="dailypigeonpolly-${selKey}.png" href="${url}">${t('download')}</a></div>`;
    try {
      const blob = await new Promise(r => c.toBlob(r, 'image/png'));
      const file = new File([blob], `dailypigeonpolly-${selKey}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        const b = document.createElement('button'); b.className = 'cta-link'; b.type = 'button'; b.textContent = '↗ ' + t('share');
        b.onclick = () => navigator.share({ files: [file], text: '#dailypigeonpolly' }).catch(() => {});
        out.querySelector('.card-actions').appendChild(b);
      }
    } catch (e) { /* только скачивание */ }
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  renderToday(); renderDiary();
})();
