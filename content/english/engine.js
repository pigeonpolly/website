// Движок учебника английского (/english/): рисует уроки из UNITS, проверяет упражнения, ведёт словарь, прогресс и ачивки.
// Тексты уроков — свой HTML (fmt не экранирует, *слово* → жирный); всё, что вводит человек, — только через esc.
  // Состояние S хранится в localStorage и на сервере (GET/POST /api/english, worker/english.js) — у каждого своё.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = s => String(s ?? '').replace(/\*([^*]+)\*/g, '<b>$1</b>');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
  const view = $('#view');

  const LEVELS = [
    { id: 'A1', name: 'Начальный', about: 'Азы: to be, порядок слов, простое настоящее, артикли. Быстро закрыть пробелы.' },
    { id: 'A2', name: 'Элементарный', about: 'Прошлое и будущее, сравнения, much/many, первые фразовые глаголы.' },
    { id: 'B1', name: 'Средний', about: 'Времена без путаницы, модальные, условные, пассив. Сериалы: первые шутки и идиомы.' },
    { id: 'B2', name: 'Выше среднего', about: 'Сложные времена, косвенная речь, связки, идиомы из «Друзей», «Теории большого взрыва» и других.' },
    { id: 'C1', name: 'Продвинутый', about: 'Инверсия, акценты, стиль, сарказм и каламбуры, длинные тексты и эссе.' },
    { id: 'C2', name: 'Свободный', about: 'Тонкости как у носителей: оттенки смысла, игра слов, риторика, стиль.' },
  ];
  const SHOWS = {
    friends: { name: 'Friends · «Друзья»', cls: 's-friends' },
    tbbt: { name: 'The Big Bang Theory · «Теория большого взрыва»', cls: 's-tbbt' },
    parks: { name: 'Parks and Recreation · «Парки и зоны отдыха»', cls: 's-parks' },
    spn: { name: 'Supernatural · «Сверхъестественное»', cls: 's-spn' },
  };
  const unitsOf = lv => UNITS.filter(u => u.lvl === lv);
  const byId = id => UNITS.find(u => u.id === id);
  const EXTRA = window.EN_EXTRA || {};

  // ---------- состояние ----------
  const LS = 'english-state';
  let S = { d: {}, w: {}, v: {}, a: {}, days: [], c: {}, last: '' };
  try { Object.assign(S, JSON.parse(localStorage.getItem(LS) || '{}')); } catch (e) { /* пусто */ }
  const saveEl = $('#save');
  let timer = 0, online = true;
  function save() {
    try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { /* нет места */ }
    if (!online) return;
    clearTimeout(timer);
    saveEl.textContent = '…'; saveEl.className = 'save';
    timer = setTimeout(() => fetch('/api/english', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ state: S }) })
      .then(r => { if (!r.ok) throw 0; saveEl.textContent = 'сохранено'; })
      .catch(() => { saveEl.textContent = 'сохранено на этом устройстве'; saveEl.className = 'save err'; }), 1200);
  }
  function merge(a, b) { // a — локальное, b — с сервера
    const m = { ...b, ...a };
    m.d = { ...(b.d || {}) }; for (const [k, v] of Object.entries(a.d || {})) m.d[k] = Math.max(v, m.d[k] || 0);
    m.v = { ...(b.v || {}), ...(a.v || {}) };
    m.w = { ...(b.w || {}), ...(a.w || {}) };
    m.a = { ...(b.a || {}), ...(a.a || {}) };
    m.days = [...new Set([...(b.days || []), ...(a.days || [])])].sort((x, y) => x - y).slice(-120);
    m.c = { ...(b.c || {}) }; for (const [k, v] of Object.entries(a.c || {})) m.c[k] = Math.max(v, m.c[k] || 0);
    return m;
  }
  function touch() { const d = today(); if (!S.days.includes(d)) { S.days.push(d); S.days = S.days.slice(-120); } }
  function streak() {
    const set = new Set(S.days); let d = today(); if (!set.has(d)) d--;
    let n = 0; while (set.has(d)) { n++; d--; } return n;
  }

  // ---------- блоки и прогресс ----------
  const blocksOf = u => [...(u.ex || []).map((_, i) => `${u.id}-e${i}`), ...(u.read ? [`${u.id}-r`] : []), ...(u.series ? [`${u.id}-s`] : []), ...(u.write ? [`${u.id}-w`] : [])];
  const isDone = id => (S.d[id] || 0) >= 60;
  const pctOf = ids => ids.length ? Math.round(100 * ids.filter(isDone).length / ids.length) : 0;
  const unitPct = u => pctOf(blocksOf(u));
  const levelPct = lv => pctOf(unitsOf(lv).flatMap(blocksOf));
  const ALL = () => UNITS.flatMap(blocksOf);

  function refresh() {
    const p = pctOf(ALL());
    $('#meter').style.width = p + '%'; $('#pct').textContent = p + ' %';
    $('#achip').textContent = '🏆 ' + Object.keys(S.a).length;
    $('#dchip').textContent = '📒 ' + Object.keys(S.v).length;
    $('#streak').textContent = '🔥 ' + streak();
    for (const el of $$('[data-up]')) {
      const u = byId(el.dataset.up); if (!u) continue; const v = unitPct(u);
      el.textContent = v ? v + '%' : ''; el.classList.toggle('full', v === 100);
    }
    for (const el of $$('[data-lp]')) el.textContent = levelPct(el.dataset.lp) + '%';
    for (const el of $$('[data-um]')) { const u = byId(el.dataset.um); if (u) el.style.width = unitPct(u) + '%'; }
    for (const el of $$('[data-lm]')) el.style.width = levelPct(el.dataset.lm) + '%';
    checkAch();
  }

  // ---------- ачивки ----------
  const showDone = sh => UNITS.filter(u => (u.series || []).some(q => q.show === sh)).every(u => isDone(u.id + '-s'));
  const showAny = sh => UNITS.some(u => (u.series || []).some(q => q.show === sh));
  const nDone = () => ALL().filter(isDone).length;
  const nPerfect = () => Object.entries(S.d).filter(([k, v]) => v === 100 && !k.endsWith('-w')).length;
  const nRead = () => UNITS.filter(u => u.read && isDone(u.id + '-r')).length;
  const nWrite = () => Object.keys(S.d).filter(k => k.endsWith('-w')).length;
  const nUsed = () => Object.values(S.v).filter(v => (v.u || 0) > 0).length;
  const lvDone = lv => unitsOf(lv).length && levelPct(lv) === 100;
  const ACH = [
    ['first', '🌱', 'Первый шаг', 'Пройти первое упражнение', () => nDone() >= 1],
    ['perfect', '🎯', 'В яблочко', 'Упражнение на 100 %', () => nPerfect() >= 1],
    ['perfect10', '🏹', 'Снайпер', '10 упражнений на 100 %', () => nPerfect() >= 10],
    ['perfect50', '🥇', 'Без ошибок', '50 упражнений на 100 %', () => nPerfect() >= 50],
    ['ex25', '💪', 'Разминка', 'Пройти 25 блоков', () => nDone() >= 25],
    ['ex100', '🏋️', 'Марафонец', 'Пройти 100 блоков', () => nDone() >= 100],
    ['build20', '🧱', 'Строитель', 'Собрать 20 предложений без ошибок', () => (S.c.built || 0) >= 20],
    ['build100', '🏗️', 'Архитектор', 'Собрать 100 предложений без ошибок', () => (S.c.built || 0) >= 100],
    ['reader', '📖', 'Читатель', 'Первый текст с заданиями', () => nRead() >= 1],
    ['reader10', '📚', 'Книжный червь', '10 текстов с заданиями', () => nRead() >= 10],
    ['writer', '✍️', 'Перо', 'Сдать первый свой текст', () => nWrite() >= 1],
    ['writer10', '🖋️', 'Автор', 'Сдать 10 своих текстов', () => nWrite() >= 10],
    ['long', '📜', 'Длинная мысль', 'Текст от 250 слов', () => (S.c.long || 0) >= 1],
    ['words25', '📒', 'Копилка', '25 слов в словаре', () => Object.keys(S.v).length >= 25],
    ['words100', '🗃️', 'Коллекционер', '100 слов в словаре', () => Object.keys(S.v).length >= 100],
    ['words300', '🏛️', 'Библиотека', '300 слов в словаре', () => Object.keys(S.v).length >= 300],
    ['use10', '🗣️', 'В деле', '10 слов использовано в своих предложениях', () => nUsed() >= 10],
    ['use50', '🎙️', 'Живой язык', '50 слов использовано в своих предложениях', () => nUsed() >= 50],
    ['rev50', '🔁', 'Повторение', '50 повторений словаря', () => (S.c.rev || 0) >= 50],
    ['rev300', '🧠', 'Память слона', '300 повторений словаря', () => (S.c.rev || 0) >= 300],
    ['master20', '💎', 'Намертво', '20 слов на последней ступени', () => Object.values(S.v).filter(v => v.l >= 5).length >= 20],
    ['streak3', '🔥', 'Три дня', '3 дня подряд', () => streak() >= 3],
    ['streak7', '🌟', 'Неделя', '7 дней подряд', () => streak() >= 7],
    ['streak30', '🌈', 'Месяц', '30 дней подряд', () => streak() >= 30],
    ['conf', '🧭', 'Не путаю', 'Тест «Не путай» на 100 %', () => S.d['conf-q'] === 100],
    ['irr', '🔤', 'Неправильные — правильно', 'Тест неправильных глаголов на 90 %+', () => (S.d['irr-q'] || 0) >= 90],
    ['test', '🎓', 'Экзамен', 'Тест уровня на 85 %+', () => LEVELS.some(l => (S.d['lt-' + l.id] || 0) >= 85)],
    ['A1', '🐣', 'A1 пройден', 'Все блоки уровня A1', () => lvDone('A1')],
    ['A2', '🐥', 'A2 пройден', 'Все блоки уровня A2', () => lvDone('A2')],
    ['B1', '🐦', 'B1 пройден', 'Все блоки уровня B1', () => lvDone('B1')],
    ['B2', '🕊️', 'B2 пройден', 'Все блоки уровня B2', () => lvDone('B2')],
    ['C1', '🦅', 'C1 пройден', 'Все блоки уровня C1', () => lvDone('C1')],
    ['C2', '🦚', 'C2 пройден', 'Все блоки уровня C2', () => lvDone('C2')],
    ['friends', '☕', 'How you doin\'?', 'Все цитаты из «Друзей»', () => showAny('friends') && showDone('friends')],
    ['tbbt', '🧪', 'Bazinga!', 'Все цитаты из «Теории большого взрыва»', () => showAny('tbbt') && showDone('tbbt')],
    ['parks', '🧇', 'Treat yo self', 'Все цитаты из «Парков и зон отдыха»', () => showAny('parks') && showDone('parks')],
    ['spn', '🚗', 'Family business', 'Все цитаты из «Сверхъестественного»', () => showAny('spn') && showDone('spn')],
  ];
  const toastEl = $('#toast'); let toastQ = [], toastOn = false;
  function toast(i, t, s) {
    toastQ.push([i, t, s]); if (toastOn) return;
    const next = () => {
      const x = toastQ.shift(); if (!x) { toastOn = false; return; }
      toastOn = true; toastEl.innerHTML = `<span class="i">${x[0]}</span><span>Ачивка: ${esc(x[1])}<small>${esc(x[2])}</small></span>`;
      toastEl.classList.add('show'); setTimeout(() => { toastEl.classList.remove('show'); setTimeout(next, 400); }, 3200);
    };
    next();
  }
  let achReady = false;
  function checkAch() {
    let got = false;
    for (const [id, i, t, s, f] of ACH) if (!S.a[id] && f()) { S.a[id] = Date.now(); got = true; if (achReady) toast(i, t, s); }
    if (got) save();
  }

  // ---------- проверка ответов ----------
  function norm(s) {
    return String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[“”«»"]/g, '').replace(/\s+/g, ' ').trim()
      .replace(/\bwon't\b/g, 'will not').replace(/\bcan't\b/g, 'cannot').replace(/\bcan not\b/g, 'cannot').replace(/\bshan't\b/g, 'shall not')
      .replace(/n't\b/g, ' not').replace(/'m\b/g, ' am').replace(/'re\b/g, ' are').replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will')
      .replace(/[,;:!?.…—–-]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const NAMES = /^(I|I'm|I've|I'll|I'd|Sheldon|Leonard|Penny|Howard|Raj|Amy|Bernadette|Stuart|Ross|Rachel|Monica|Chandler|Joey|Phoebe|Gunther|Janice|Leslie|Ron|Ann|April|Andy|Tom|Ben|Chris|Donna|Jerry|Garry|Dean|Sam|Castiel|Cas|Bobby|Crowley|Jack|Mary|John|Kate|Anna|Mr|Mrs|Ms|Dr|London|Paris|Riga|Lisbon|Rome|Tallinn|Italy|Spain|Japan|Daniel|Liga|Kate|Mark|Zane|Leo|Emma|Latvia|England|English|Britain|America|Pawnee|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|July|Christmas|Netflix|Google|God)\b/;
  function parse(t, s) {
    const [body, why = ''] = s.split(' # ');
    const p = body.split('|').map(x => x.trim());
    return { t, p, why: why.trim() };
  }
  function itemHTML(it, n) {
    const { t, p } = it;
    if (t === 'gap') {
      let k = 0; const txt = fmt(p[0]).replace(/_{3,}/g, () => `<input class="gap" data-g="${k++}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="пропуск">`);
      return `<li data-n="${n}">${txt}</li>`;
    }
    if (t === 'choice' || t === 'tf') {
      const opts = t === 'tf' ? [['T', 'Верно'], ['F', 'Неверно']] : shuffle(p.slice(1)).map(o => [o, o]);
      return `<li data-n="${n}"><div>${fmt(p[0]).replace(/_{3,}/g, '<b>____</b>')}</div>${opts.map(([v, l]) => `<label class="opt"><input type="radio" name="o${uid}-${n}" value="${esc(v)}"><span>${fmt(l)}</span></label>`).join('')}</li>`;
    }
    if (t === 'order') {
      const toks = p[0].replace(/[.!?]+$/, '').split(/\s+/).map((w, i) => i === 0 && !NAMES.test(w) ? w[0].toLowerCase() + w.slice(1) : w);
      return `<li data-n="${n}"><div class="note-s">${it.hint ? fmt(it.hint) : 'Нажимайте на слова по порядку; нажатое слово в строке — вернуть.'}</div><div class="built" aria-label="ваше предложение"></div><div class="pool">${shuffle(toks).map(w => `<button type="button" class="tok">${esc(w)}</button>`).join('')}</div></li>`;
    }
    if (t === 'fix') return `<li data-n="${n}"><div>${fmt(p[0])}</div><input class="line" value="${esc(p[0])}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="исправленное предложение"></li>`;
    if (t === 'tr') return `<li data-n="${n}"><div class="ru-q">${fmt(p[0])}</div><input class="line" placeholder="по-английски…" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="перевод"></li>`;
    return '';
  }
  let uid = 0;
  const HOW = { gap: 'Впишите слово (или несколько) в пропуск.', choice: 'Выберите вариант.', tf: 'Верно или неверно по тексту?', order: 'Соберите осмысленное предложение из слов.', fix: 'В предложении ошибка — исправьте его прямо в строке.', tr: 'Переведите на английский. Сокращения (I\'m, don\'t) и полные формы засчитываются одинаково.' };
  const NAMES_T = { gap: 'Вставьте', choice: 'Выберите', tf: 'Верно / неверно', order: 'Конструктор предложений', fix: 'Найдите ошибку', tr: 'Перевод' };
  // ex: [{t, h, q:[…]}] — несколько групп в одном блоке или одна
  function blockHTML(id, title, groups, opts = {}) {
    uid++;
    const items = []; let html = '';
    for (const g of groups) {
      const start = items.length;
      for (const s of g.q) { const it = parse(g.t, s); it.hint = g.hint; items.push(it); }
      const lis = items.slice(start).map((it, i) => itemHTML(it, start + i)).join('');
      html += `${g.h || groups.length > 1 ? `<p class="how">${fmt(g.h || HOW[g.t])}</p>` : ''}<ol start="${start + 1}">${lis}</ol>`;
    }
    BLOCKS[id] = items;
    const best = S.d[id];
    const one = groups.length === 1 && !groups[0].h ? `<p class="how">${HOW[groups[0].t]}</p>` : '';
    return `<section class="exb" data-b="${id}"><header><b>${esc(title || (groups.length === 1 ? NAMES_T[groups[0].t] : 'Упражнение'))}</b><span class="best${best === 100 ? ' full' : ''}">${best != null ? 'лучший результат: ' + best + ' %' : ''}</span></header>
      ${one}${html}<footer><button type="button" class="btn primary" data-act="check">Проверить</button><button type="button" class="btn" data-act="again" hidden>Ещё раз</button><span class="res"></span>${opts.foot || ''}</footer></section>`;
  }
  const BLOCKS = {};
  function itemOK(it, li) {
    const { t, p } = it;
    if (t === 'gap') {
      const ans = p[1].split(';');
      const ins = $$('input.gap', li);
      return { ok: ins.every((inp, k) => (ans[k] || '').split('/').some(a => norm(a) === norm(inp.value))), right: ans.map(a => a.split('/')[0]).join(' … ') };
    }
    if (t === 'choice' || t === 'tf') {
      const v = ($('input:checked', li) || {}).value;
      for (const o of $$('.opt', li)) { const iv = $('input', o).value; o.classList.toggle('right', iv === p[1]); o.classList.toggle('wrong', iv === v && v !== p[1]); }
      return { ok: v === p[1], right: t === 'tf' ? (p[1] === 'T' ? 'Верно' : 'Неверно') : p[1], noShow: true };
    }
    if (t === 'order') {
      const v = $$('.built .tok', li).map(b => b.textContent).join(' ');
      const alts = [p[0], ...p.slice(1)];
      return { ok: alts.some(a => norm(a) === norm(v)), right: p[0] };
    }
    if (t === 'fix') { const v = $('input', li).value; return { ok: p.slice(1).some(a => norm(a) === norm(v)), right: p[1] }; }
    if (t === 'tr') { const v = $('input', li).value; return { ok: p.slice(1).some(a => norm(a) === norm(v)), right: p.slice(1).join('  /  '), self: !!v.trim() }; }
    return { ok: false, right: '' };
  }
  function score(sec) {
    const lis = $$('ol > li', sec); const ok = lis.filter(li => li.classList.contains('ok')).length;
    return Math.round(100 * ok / Math.max(1, lis.length));
  }
  function setResult(sec, pct) {
    const r = $('.res', sec); r.textContent = pct + ' %'; r.className = 'res ' + (pct >= 80 ? 'good' : pct < 60 ? 'low' : '');
    const id = sec.dataset.b;
    if (pct > (S.d[id] ?? -1)) S.d[id] = pct;
    const b = $('.best', sec); b.textContent = 'лучший результат: ' + S.d[id] + ' %'; b.classList.toggle('full', S.d[id] === 100);
    touch(); save(); refresh();
  }
  function check(sec) {
    const items = BLOCKS[sec.dataset.b]; if (!items) return;
    for (const li of $$('ol > li', sec)) {
      const it = items[+li.dataset.n]; const r = itemOK(it, li);
      li.classList.toggle('ok', r.ok); li.classList.toggle('no', !r.ok);
      if (r.ok && it.t === 'order') S.c.built = (S.c.built || 0) + 1;
      let fb = $('.fb', li); if (!fb) { fb = document.createElement('p'); fb.className = 'fb'; li.append(fb); }
      fb.innerHTML = (r.ok ? '<b class="ok">✓ Верно.</b> ' : `<b class="no">✗</b> ${r.noShow ? '' : 'Правильно: '}<span class="ans">${r.noShow ? '' : fmt(r.right)}</span> `)
        + (it.why ? fmt(it.why) : '')
        + (!r.ok && r.self ? ` <button type="button" class="btn small" data-act="self">Мой вариант тоже верен</button>` : '')
        + (!r.ok && it.t !== 'choice' && it.t !== 'tf' ? '' : '');
      for (const inp of $$('input', li)) inp.disabled = true;
      for (const b of $$('.tok', li)) b.disabled = true;
    }
    $('[data-act=check]', sec).hidden = true; $('[data-act=again]', sec).hidden = false;
    setResult(sec, score(sec));
  }
  function again(sec) {
    const id = sec.dataset.b, items = BLOCKS[id];
    const lis = $$('ol > li', sec);
    for (const li of lis) { const n = +li.dataset.n; const tmp = document.createElement('div'); tmp.innerHTML = itemHTML(items[n], n); li.replaceWith(tmp.firstElementChild); }
    $('.res', sec).textContent = ''; $('[data-act=check]', sec).hidden = false; $('[data-act=again]', sec).hidden = true;
  }

  // ---------- озвучка ----------
  const canSay = 'speechSynthesis' in window;
  function say(text) {
    if (!canSay) return; speechSynthesis.cancel();
    const m = new SpeechSynthesisUtterance(text); m.lang = 'en-GB'; m.rate = .92;
    const v = speechSynthesis.getVoices().find(v => /^en[-_]GB/i.test(v.lang)) || speechSynthesis.getVoices().find(v => /^en/i.test(v.lang)); if (v) m.voice = v;
    speechSynthesis.speak(m);
  }
  const sayBtn = t => canSay ? `<button type="button" class="say" data-say="${esc(t)}" aria-label="Послушать" title="Послушать">🔊</button>` : '';

  // ---------- словарь ----------
  const STEPS = [0, 1, 2, 4, 7, 15, 30];
  function addWord(w, tr, ex, src) {
    const k = w.trim().toLowerCase(); if (!k) return false;
    if (S.v[k]) return false;
    S.v[k] = { w: w.trim().slice(0, 60), tr: String(tr || '').slice(0, 120), ex: String(ex || '').slice(0, 240), l: 0, due: today(), u: 0, src: src || '' };
    touch(); save(); refresh(); return true;
  }
  const stem = w => w.toLowerCase().split(/\s+/).map(x => x.length > 4 ? x.slice(0, x.length - (x.endsWith('e') ? 1 : 2)) : x);
  function uses(text, w) { // слово (или все части выражения) встречается в тексте, с учётом окончаний
    const t = ' ' + text.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]+/g, ' ') + ' ';
    return stem(w).every(s => new RegExp(`\\s${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z']*\\s`).test(t));
  }

  // ---------- подсказка к словам текста ----------
  const tip = document.createElement('div'); tip.id = 'tip'; tip.hidden = true; document.body.append(tip);
  function showTip(el) {
    const w = el.dataset.w, tr = el.dataset.tr;
    const p = el.closest('p'); const sent = p ? (p.textContent.split(/(?<=[.!?])\s+/).find(s => s.toLowerCase().includes(el.textContent.toLowerCase())) || '') : '';
    tip.innerHTML = `<b>${esc(w)}</b>${esc(tr)}<br>${S.v[w.toLowerCase()] ? '<small>уже в словаре ✓</small>' : '<button type="button" data-add>+ в словарь</button>'} ${canSay ? '<button type="button" data-tsay>🔊</button>' : ''}`;
    tip.hidden = false;
    const r = el.getBoundingClientRect();
    tip.style.left = Math.max(8, Math.min(innerWidth - tip.offsetWidth - 8, r.left)) + 'px';
    tip.style.top = (r.bottom + 6 + tip.offsetHeight > innerHeight ? r.top - tip.offsetHeight - 6 : r.bottom + 6) + 'px';
    tip.onclick = e => {
      if (e.target.dataset.add !== undefined) { addWord(w, tr, sent, view.dataset.unit); tip.hidden = true; }
      if (e.target.dataset.tsay !== undefined) say(w);
    };
  }
  document.addEventListener('click', e => {
    const g = e.target.closest('.gl'); if (g) { showTip(g); return; }
    if (!e.target.closest('#tip')) tip.hidden = true;
  });
  addEventListener('scroll', () => { tip.hidden = true; }, { passive: true });

  function glossText(txt, gl) {
    const keys = Object.keys(gl || {}).sort((a, b) => b.length - a.length);
    let h = fmt(txt);
    if (!keys.length) return h;
    const re = new RegExp(`\\b(${keys.map(k => esc(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    return h.replace(re, m => { const k = keys.find(x => x.toLowerCase() === m.toLowerCase()) || m; return `<span class="gl" tabindex="0" data-w="${esc(k)}" data-tr="${esc(gl[k])}">${m}</span>`; });
  }

  // ---------- страницы ----------
  const ytq = (ch, t) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ch + ' ' + t);
  function unitPage(u) {
    const i = UNITS.indexOf(u), prev = UNITS[i - 1], next = UNITS[i + 1];
    S.last = u.id; save();
    let h = `<div class="uhead"><div class="lv">Уровень ${u.lvl} · урок ${unitsOf(u.lvl).indexOf(u) + 1}</div><h2>${esc(u.t)}</h2>${u.en ? `<p class="sub">${esc(u.en)}</p>` : ''}<div class="m"><i data-um="${u.id}"></i></div></div>`;
    if (u.goals) h += `<div class="goals"><h4>После урока получится</h4><ul>${u.goals.map(g => `<li>${fmt(g)}</li>`).join('')}</ul></div>`;
    h += `<section class="sec th" id="theory"><h3><span class="ic">📘</span>Теория</h3>${u.th}${u.simple ? `<p class="simple">${fmt(u.simple)}</p>` : ''}</section>`;
    if (u.exm) h += `<div class="ex-list">${u.exm.map(([e, r]) => `<p>${sayBtn(e)} <i class="en">${esc(e)}</i><span class="ru">${esc(r)}</span></p>`).join('')}</div>`;
    if (u.conf) h += `<div class="box conf"><h4>⚠ Не путай</h4><dl>${u.conf.map(c => `<dt>${fmt(c[0])}</dt><dd>${c[1]}</dd>`).join('')}</dl></div>`;
    if (u.words) h += `<section class="sec" id="words"><h3><span class="ic">📒</span>Слова урока</h3><p class="note-s">Слово запоминается, когда его используешь: добавьте слова в словарь, потом тренируйте их и пишите с ними свои предложения.</p>
      <ul class="words">${u.words.map(([w, tr, s]) => `<li><span><span class="w">${esc(w)}</span> <span class="tr">— ${esc(tr)}</span></span><span class="acts">${sayBtn(w)}${S.v[w.toLowerCase()] ? '<span class="in-dict">в словаре ✓</span>' : `<button type="button" class="btn small" data-addw="${esc(w)}">+</button>`}</span>${s ? `<span class="s">${esc(s)}</span>` : ''}</li>`).join('')}</ul>
      <button type="button" class="btn" data-addall>+ Все слова урока в словарь</button></section>`;
    if (u.ex) h += `<section class="sec" id="practice"><h3><span class="ic">✏️</span>Упражнения</h3>${u.ex.map((e, k) => blockHTML(`${u.id}-e${k}`, `Упражнение ${k + 1}. ${e.h || NAMES_T[e.t]}`, [{ t: e.t, q: e.q, hint: e.hint }])).join('')}</section>`;
    if (u.read) {
      const r = u.read;
      h += `<section class="sec" id="reading"><h3><span class="ic">📖</span>Чтение</h3>${r.intro ? `<p>${fmt(r.intro)}</p>` : ''}<article class="reading"><h4>${esc(r.title)} ${sayBtn(r.title + '. ' + r.txt.join(' '))}</h4><div class="txt">${r.txt.map(p => `<p>${glossText(p, r.gl)}</p>`).join('')}</div>
        ${r.gl ? '<p class="note-s">Подчёркнутые слова — нажмите: перевод и «+ в словарь».</p>' : ''}</article>${blockHTML(u.id + '-r', 'Задания к тексту', r.q)}</section>`;
    }
    if (u.series) {
      h += `<section class="sec" id="series"><h3><span class="ic">📺</span>Из сериалов</h3><p class="note-s">Цитаты короткие, для разбора языка. Посмотрите сцену — так шутка запомнится лучше.</p><div class="series">${u.series.map(quoteHTML).join('')}</div>
        ${blockHTML(u.id + '-s', 'Проверь себя: поймёшь шутку?', [{ t: 'choice', q: u.series.map(s => s.qz).filter(Boolean) }])}</section>`;
    }
    if (u.write) {
      const w = u.write, id = u.id + '-w';
      h += `<section class="sec write" id="writing" data-w="${id}"><h3><span class="ic">✍️</span>Письмо</h3><p>${fmt(w.h)}</p>
        ${w.plan ? `<ol class="plan">${w.plan.map(x => `<li>${fmt(x)}</li>`).join('')}</ol>` : ''}
        ${w.use ? `<p class="note-s">Используйте эти слова (засчитывается и с окончаниями):</p><div class="need">${w.use.map(x => `<span data-need="${esc(x)}">${esc(x)}</span>`).join('')}</div>` : ''}
        <textarea data-ta="${id}" placeholder="Пишите по-английски…" spellcheck="true" lang="en">${esc(S.w[id] || '')}</textarea>
        <p><span class="wc" data-wc>0 слов</span> · минимум ${w.min}</p>
        <ul class="chk">${(w.chk || ['Каждое предложение: кто/что + действие + остальное', 'Время глагола подходит к смыслу', 'Предложения начинаются с большой буквы и заканчиваются точкой']).map(c => `<li><label><input type="checkbox"><span>${fmt(c)}</span></label></li>`).join('')}</ul>
        <p><button type="button" class="btn primary" data-submit="${id}" disabled>Сдать текст</button> <span class="note-s" data-wstat>${S.d[id] ? 'Сдано ✓ — можно дописывать и сдавать снова.' : ''}</span></p>
        ${w.model ? `<details><summary>Пример ответа</summary><div class="model">${w.model.split('\n').map(p => `<p class="en">${esc(p)}</p>`).join('')}</div></details>` : ''}</section>`;
    }
    if (u.vid) h += `<section class="sec" id="video"><h3><span class="ic">▶️</span>Видео по теме</h3><ul class="vids">${u.vid.map(([ch, t]) => `<li><a href="${ytq(ch, t)}" target="_blank" rel="noopener"><span><b>${esc(ch)}</b> — ${esc(t)}</span><small>YouTube</small></a></li>`).join('')}</ul><p class="note-s">Ссылки открывают поиск на YouTube по каналу и теме — там всегда свежие уроки этого автора.</p></section>`;
    if (u.fact) h += `<div class="box fact"><h4>💡 Интересный факт</h4><p>${fmt(u.fact)}</p></div>`;
    if (u.src) h += `<p class="note-s">По материалам открытых учебников: ${u.src.map(s => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(' · ')}</p>`;
    h += `<nav class="pager">${prev ? `<a href="#u/${prev.id}"><small>← назад</small>${esc(prev.lvl + ' · ' + prev.t)}</a>` : ''}${next ? `<a class="next" href="#u/${next.id}"><small>дальше →</small>${esc(next.lvl + ' · ' + next.t)}</a>` : ''}</nav>`;
    view.dataset.unit = u.id;
    view.innerHTML = h;
    for (const s of $$('.write', view)) wInput(s);
  }
  function quoteHTML(s) {
    const sh = SHOWS[s.show] || { name: s.show, cls: '' };
    return `<div class="quote ${sh.cls}"><div class="show">${esc(sh.name)}</div><blockquote>${sayBtn(s.q)} «${esc(s.q)}»</blockquote><div class="who">${esc(s.who)}</div>
      <p><b>Что значит.</b> ${s.mean}</p>${s.fun ? `<p><b>В чём шутка.</b> ${s.fun}</p>` : ''}${s.use ? `<p><b>Как сказать самим.</b> <i class="en">${esc(s.use)}</i></p>` : ''}</div>`;
  }
  function wInput(sec) {
    const ta = $('textarea', sec), id = sec.dataset.w, u = byId(id.slice(0, -2)), w = u.write;
    const n = (ta.value.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
    const wc = $('[data-wc]', sec); wc.textContent = n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? 'слово' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'слова' : 'слов'); wc.classList.toggle('okc', n >= w.min);
    for (const sp of $$('[data-need]', sec)) sp.classList.toggle('used', uses(ta.value, sp.dataset.need));
    $('[data-submit]', sec).disabled = n < w.min;
  }
  function submit(id) {
    const sec = $(`[data-w="${id}"]`), ta = $('textarea', sec), u = byId(id.slice(0, -2));
    const txt = ta.value; const n = (txt.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
    S.d[id] = 100; S.w[id] = txt.slice(0, 6000); if (n >= 250) S.c.long = (S.c.long || 0) + 1;
    let used = 0;
    for (const x of u.write.use || []) if (uses(txt, x)) { const wd = (u.words || []).find(w => w[0].toLowerCase() === x.toLowerCase()); addWord(x, wd ? wd[1] : '', wd ? wd[2] : '', u.id); S.v[x.toLowerCase()].u++; used++; }
    for (const v of Object.values(S.v)) if (!(u.write.use || []).some(x => x.toLowerCase() === v.w.toLowerCase()) && uses(txt, v.w)) { v.u++; used++; }
    $('[data-wstat]', sec).textContent = `Сдано ✓ Слов из словаря в тексте: ${used}. Сравните с примером ответа ниже.`;
    touch(); save(); refresh();
  }

  function homePage() {
    const p = pctOf(ALL());
    const due = Object.values(S.v).filter(v => v.due <= today()).length;
    const facts = UNITS.filter(u => u.fact); const f = facts[today() % Math.max(1, facts.length)];
    const last = byId(S.last) || UNITS[0];
    let h = `<section class="cover"><div class="kicker">Учебник · от азов до C2</div><h1>English <em>от A1 до C2</em></h1>
      <p class="lead">Теория простыми словами, упражнения с проверкой, чтение, письмо, видео и разбор шуток из «Друзей», «Теории большого взрыва», «Парков и зон отдыха» и «Сверхъестественного».</p>
      <div class="big-meter"><i style="width:${p}%"></i></div><p class="note-s">Пройдено ${p} % учебника · блок считается пройденным с результатом от 60 %</p>
      <div class="stats"><div><b>${ALL().filter(isDone).length}</b><span>блоков пройдено из ${ALL().length}</span></div><div><b>${Object.keys(S.v).length}</b><span>слов в словаре</span></div><div><b>${nUsed()}</b><span>слов использовано в своих предложениях</span></div><div><b>${nWrite()}</b><span>текстов написано</span></div><div><b>${streak()}</b><span>дней подряд</span></div><div><b>${Object.keys(S.a).length}/${ACH.length}</b><span>ачивок</span></div></div>
      <div class="go"><a class="btn primary" href="#u/${last.id}">${S.last ? 'Продолжить: ' + esc(last.lvl + ' · ' + last.t) : 'Начать с A1'}</a><a class="btn" href="#dict">📒 Словарь${due ? ` · ${due} к повторению` : ''}</a><a class="btn" href="#ach">🏆 Ачивки</a></div></section>
      ${f ? `<div class="box fact"><h4>💡 Факт дня</h4><p>${fmt(f.fact)}</p></div>` : ''}
      <h2>Уровни</h2><p>A1 и A2 — коротко, чтобы закрыть пробелы. Если уверены в уровне — сдайте тест уровня: от 85 % можно идти дальше. Больше всего материала — на B1 и выше.</p>
      <div class="levels">${LEVELS.map(l => { const us = unitsOf(l.id); return `<div class="lvcard"><h3><span>${l.id}</span>${esc(l.name)}</h3><p>${esc(l.about)}</p><p>${us.length} уроков · ${levelPct(l.id)} %${S.d['lt-' + l.id] != null ? ` · тест: ${S.d['lt-' + l.id]} %` : ''}</p><div class="m"><i style="width:${levelPct(l.id)}%"></i></div>
        <div class="row">${us.length ? `<a class="btn small primary" href="#u/${(us.find(u => unitPct(u) < 100) || us[0]).id}">Открыть</a><a class="btn small" href="#test/${l.id}">Тест уровня</a>` : '<span class="note-s">скоро</span>'}</div></div>`; }).join('')}</div>
      <h2>Как заниматься</h2>
      <ol><li><b>Теория → упражнения.</b> Прочитайте теорию и «Не путай», потом упражнения. Ошиблись — прочитайте пояснение и нажмите «Ещё раз».</li>
      <li><b>Конструктор предложений</b> есть почти в каждом уроке: английское предложение строится по схеме <i class="en">кто — делает — что — где — когда</i>. Соберите сто таких — и порядок слов станет привычкой.</li>
      <li><b>Словарь — через использование.</b> Добавляйте слова урока и из текстов, тренируйте каждый день (5–10 минут) и пишите с ними свои предложения. Слово, которое вы использовали 3–5 раз, остаётся надолго.</li>
      <li><b>Письмо.</b> Пишите сами, потом сравнивайте с примером. Ошибки — нормально: это материал для следующего раза.</li>
      <li><b>Сериалы.</b> С B1 в уроках есть цитаты и шутки. Посмотрите сцену с английскими субтитрами, потом без них.</li></ol>
      <p class="note-s">Прогресс, словарь и ачивки сохраняются в вашем аккаунте на сайте (и на этом устройстве).</p>`;
    view.innerHTML = h;
  }

  function testPage(lv) {
    const pool = unitsOf(lv).flatMap(u => (u.ex || []).filter(e => ['gap', 'choice', 'fix'].includes(e.t)).flatMap(e => e.q.map(s => ({ t: e.t, s }))));
    const pick = shuffle(pool).slice(0, 20);
    const groups = []; for (const x of pick) { const g = groups[groups.length - 1]; if (g && g.t === x.t) g.q.push(x.s); else groups.push({ t: x.t, h: HOW[x.t], q: [x.s] }); }
    view.innerHTML = `<div class="uhead"><div class="lv">Уровень ${lv}</div><h2>Тест уровня ${lv}</h2><p class="sub">20 случайных заданий из уроков уровня. От 85 % — уровень можно считать пройденным и идти дальше. Каждый раз вопросы новые.</p></div>
      ${blockHTML('lt-' + lv, 'Тест ' + lv, groups)}<p><a class="btn" href="#test/${lv}" data-retest>Новый набор вопросов</a> <a class="btn" href="#home">На главную</a></p>`;
  }

  function achPage() {
    view.innerHTML = `<div class="uhead"><div class="lv">Награды</div><h2>Ачивки</h2><p class="sub">Получено ${Object.keys(S.a).length} из ${ACH.length}</p></div>
      <div class="ach">${ACH.map(([id, i, t, s]) => `<div class="${S.a[id] ? 'got' : ''}"><span class="i">${i}</span><b>${esc(t)}</b><small>${esc(s)}</small>${S.a[id] ? `<small>✓ ${new Date(S.a[id]).toLocaleDateString('ru-RU')}</small>` : ''}</div>`).join('')}</div>`;
  }

  let dictFilter = '', dictSort = 'new';
  function dictPage() {
    const all = Object.entries(S.v);
    const due = all.filter(([, v]) => v.due <= today());
    let rows = all.filter(([k, v]) => !dictFilter || k.includes(dictFilter.toLowerCase()) || (v.tr || '').toLowerCase().includes(dictFilter.toLowerCase()));
    rows.sort((a, b) => dictSort === 'az' ? a[0].localeCompare(b[0]) : dictSort === 'weak' ? a[1].l - b[1].l : 0);
    if (dictSort === 'new') rows.reverse();
    view.innerHTML = `<div class="uhead"><div class="lv">Вокабуляр</div><h2>Мой словарь</h2><p class="sub">${all.length} слов · ${due.length} к повторению сегодня · ${nUsed()} использовано в своих предложениях</p></div>
      <p>Слово переходит на следующую ступень (●), когда вы правильно его вспомнили; повтор — через 1, 2, 4, 7, 15 и 30 дней. Самое важное — <b>✍ своё предложение</b>: напишите со словом фразу про свою жизнь.</p>
      <div class="go"><button type="button" class="btn primary" data-train ${due.length ? '' : 'disabled'}>Тренировка (${due.length})</button><button type="button" class="btn" data-train-all ${all.length ? '' : 'disabled'}>Повторить все слабые</button></div>
      <div id="trainer"></div>
      <h3>Добавить своё слово</h3>
      <form class="dict-tools" id="addf"><input name="w" placeholder="слово или выражение" required maxlength="60"><input name="tr" placeholder="перевод" maxlength="120"><input name="ex" placeholder="пример (по желанию)" maxlength="240" style="flex:1"><button class="btn">Добавить</button></form>
      <div class="dict-tools"><input id="df" type="search" placeholder="найти…" value="${esc(dictFilter)}"><select id="ds"><option value="new">сначала новые</option><option value="az">по алфавиту</option><option value="weak">сначала слабые</option></select></div>
      ${rows.length ? `<div class="tbl"><table class="dict"><thead><tr><th>Слово</th><th>Перевод и пример</th><th>Ступень</th><th></th></tr></thead><tbody>${rows.map(([k, v]) => `<tr><td><b class="en">${esc(v.w)}</b> ${sayBtn(v.w)}</td><td>${esc(v.tr)}${v.ex ? `<br><small class="en">${esc(v.ex)}</small>` : ''}${v.my ? `<br><small>Моё: <i class="en">${esc(v.my)}</i></small>` : ''}</td><td><span class="lvl">${[1, 2, 3, 4, 5].map(n => `<i class="${v.l >= n ? 'on' : ''}"></i>`).join('')}</span><br><small>исп.: ${v.u || 0}</small></td><td><button type="button" class="btn small" data-use="${esc(k)}" title="Своё предложение">✍</button> <button type="button" class="btn small" data-del="${esc(k)}" title="Удалить">✕</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="note-s">Словарь пуст. Добавляйте слова в уроках (кнопка «+») и из текстов для чтения.</p>'}`;
    $('#ds').value = dictSort;
  }
  let queue = [];
  function train(all) {
    const list = Object.entries(S.v);
    queue = shuffle(all ? list.filter(([, v]) => v.l < 4).slice(0, 30) : list.filter(([, v]) => v.due <= today()).slice(0, 30)).map(([k]) => k);
    if (!queue.length && all) queue = shuffle(list.map(([k]) => k)).slice(0, 20);
    nextCard();
  }
  function nextCard() {
    const box = $('#trainer'); if (!box) return;
    const k = queue.shift();
    if (!k) { box.innerHTML = '<div class="card"><p class="q">Готово на сегодня! 🎉</p><p class="note-s">Теперь напишите со словами свои предложения — кнопка ✍ в таблице.</p></div>'; return; }
    const v = S.v[k]; if (!v) return nextCard();
    const re = new RegExp(`\\b${v.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (v.ex && re.test(v.ex) && Math.random() < .7) {
      box.innerHTML = `<div class="card" data-k="${esc(k)}" data-mode="gap"><div class="note-s">Впишите слово · подсказка: ${esc(v.tr || '—')}</div><p class="q">${esc(v.ex.replace(re, '_____'))}</p><input autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="слово"><div class="row"><button class="btn primary" data-card="check">Проверить</button><button class="btn" data-card="skip">Не помню</button></div></div>`;
    } else {
      box.innerHTML = `<div class="card" data-k="${esc(k)}" data-mode="flash"><div class="note-s">Вспомните по-английски</div><p class="q">${esc(v.tr || '(без перевода — вспомните значение)')}</p><div class="a" hidden>${esc(v.w)} ${sayBtn(v.w)}</div><div class="row"><button class="btn primary" data-card="show">Показать</button></div><div class="row" hidden data-grade><button class="btn" data-card="no">Не вспомнилось — повторить</button><button class="btn primary" data-card="yes">Вспомнилось</button></div></div>`;
    }
    const inp = $('input', box); if (inp) inp.focus();
  }
  function grade(k, ok) {
    const v = S.v[k]; if (!v) return;
    S.c.rev = (S.c.rev || 0) + 1;
    if (ok) { v.l = Math.min(6, (v.l || 0) + 1); v.due = today() + STEPS[v.l]; } else { v.l = Math.max(0, (v.l || 0) - 1); v.due = today(); queue.push(k); }
    touch(); save(); refresh();
  }
  function useCard(k) {
    const v = S.v[k], box = $('#trainer'); if (!v || !box) return;
    box.innerHTML = `<div class="card" data-k="${esc(k)}" data-mode="use"><div class="note-s">Своё предложение со словом</div><p class="a">${esc(v.w)}</p><p class="note-s">${esc(v.tr)}</p>
      <textarea lang="en" spellcheck="true" placeholder="Напишите про себя, свою работу, друзей, сериал…"></textarea>
      <ul><li>Схема: <i class="en">кто — делает — что — где/когда</i>.</li><li>Предложение — про вашу жизнь, тогда слово запомнится.</li></ul>
      <div class="row"><button class="btn primary" data-card="use">Готово</button></div><p class="fb" hidden></p></div>`;
    box.scrollIntoView({ block: 'start' }); $('textarea', box).focus();
  }
  function checkUse(card) {
    const k = card.dataset.k, v = S.v[k], t = $('textarea', card).value.trim(), fb = $('.fb', card);
    const probs = [];
    if (!uses(t, v.w)) probs.push(`нет слова «${esc(v.w)}»`);
    if ((t.match(/[A-Za-z']+/g) || []).length < 4) probs.push('коротко: нужно хотя бы 4 слова');
    if (t && !/^[A-Z"'«]/.test(t)) probs.push('начните с большой буквы');
    if (t && !/[.!?…]["'»]?$/.test(t)) probs.push('в конце нужна точка, ? или !');
    if (/[а-яё]/i.test(t)) probs.push('есть русские буквы');
    fb.hidden = false;
    if (probs.length) { fb.innerHTML = '<b class="no">Почти:</b> ' + probs.join('; ') + '.'; return; }
    v.u = (v.u || 0) + 1; v.my = t.slice(0, 300); S.c.use = (S.c.use || 0) + 1; touch(); save(); refresh();
    fb.innerHTML = `<b class="ok">✓ Принято!</b> Слово использовано ${v.u} раз. Проверьте сами: есть ли подлежащее и глагол, подходит ли время? ${sayBtn(t)}`;
  }

  function confPage() {
    const list = UNITS.filter(u => u.conf).flatMap(u => u.conf.map(c => [u, c]));
    const q = list.map(([, c]) => c[2]).filter(Boolean);
    view.innerHTML = `<div class="uhead"><div class="lv">Справочник</div><h2>Не путай!</h2><p class="sub">Все пары, которые чаще всего путают, — из всех уроков, по уровням. Внизу — тест.</p></div>
      ${LEVELS.map(l => { const xs = list.filter(([u]) => u.lvl === l.id); return xs.length ? `<h3>${l.id}</h3><div class="box conf"><dl>${xs.map(([u, c]) => `<dt>${fmt(c[0])} <a class="note-s" href="#u/${u.id}">урок</a></dt><dd>${c[1]}</dd>`).join('')}</dl></div>` : ''; }).join('')}
      ${q.length ? blockHTML('conf-q', 'Тест «Не путай»', [{ t: 'choice', q: shuffle(q).slice(0, 25) }]) : ''}`;
  }
  function seriesPage() {
    const all = UNITS.filter(u => u.series).flatMap(u => u.series.map(s => [u, s]));
    view.innerHTML = `<div class="uhead"><div class="lv">Справочник</div><h2>Сериальный разговорник</h2><p class="sub">Все цитаты, идиомы и шутки из уроков — по сериалам. ${all.length} разборов.</p></div>
      ${Object.entries(SHOWS).map(([k, sh]) => { const xs = all.filter(([, s]) => s.show === k); return xs.length ? `<h3>${esc(sh.name)}</h3><div class="series">${xs.map(([u, s]) => quoteHTML(s) + `<p class="note-s" style="margin:-8px 0 0">Урок: <a href="#u/${u.id}">${esc(u.lvl + ' · ' + u.t)}</a></p>`).join('')}</div>` : ''; }).join('')}`;
  }
  function irrPage() {
    const V = EXTRA.irr || [];
    const q = shuffle(V).slice(0, 15).map(([a, b, c, r]) => Math.random() < .5 ? `*${a}* (${r}) — ___ — ${c.split('/')[0]}|${b}` : `*${a}* (${r}) — ${b.split('/')[0]} — ___|${c}`);
    view.innerHTML = `<div class="uhead"><div class="lv">Справочник</div><h2>Неправильные глаголы</h2><p class="sub">${V.length} самых нужных. Учите группами по 10, вслух: <i class="en">go — went — gone</i>.</p></div>
      <div class="tbl"><table><thead><tr><th>Форма 1</th><th>Past Simple</th><th>Participle</th><th>Перевод</th></tr></thead><tbody>${V.map(([a, b, c, r]) => `<tr><td><b class="en">${a}</b> ${sayBtn(a + ', ' + b.split('/')[0] + ', ' + c.split('/')[0])}</td><td><i class="en">${b}</i></td><td><i class="en">${c}</i></td><td>${esc(r)}</td></tr>`).join('')}</tbody></table></div>
      ${blockHTML('irr-q', 'Тест: 15 случайных глаголов', [{ t: 'gap', q }])}<p><a class="btn" href="#irr" data-retest>Новые глаголы</a></p>`;
  }
  function srcPage() {
    const S2 = EXTRA.src || [];
    view.innerHTML = `<div class="uhead"><div class="lv">Справочник</div><h2>Источники и куда идти дальше</h2><p class="sub">Учебник собран по открытым и бесплатным материалам. Все тексты, упражнения и пояснения написаны заново, простыми словами.</p></div>
      ${S2.map(g => `<h3>${esc(g.h)}</h3><ul class="srcs">${g.l.map(([t, u, n]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a> — ${esc(n)}</li>`).join('')}</ul>`).join('')}`;
  }

  // ---------- оглавление и поиск ----------
  function buildToc() {
    const lis = LEVELS.map(l => { const us = unitsOf(l.id); if (!us.length) return ''; return `<li class="lvl" data-lv="${l.id}"><button type="button" aria-expanded="false"><span class="lv">${l.id}</span><span class="t">${esc(l.name)}</span><span class="c" data-lp="${l.id}"></span></button><ul>
      ${us.map((u, i) => `<li><a href="#u/${u.id}" data-to="u/${u.id}"><span class="n">${l.id}.${i + 1}</span><span class="t">${esc(u.t)}</span><span class="c" data-up="${u.id}"></span></a></li>`).join('')}
      <li><a href="#test/${l.id}" data-to="test/${l.id}"><span class="n">✓</span><span class="t">Тест уровня ${l.id}</span></a></li></ul></li>`; }).join('');
    $('#toc').innerHTML = `<li><a href="#home" data-to="home"><span class="n">⌂</span><span class="t">Главная и прогресс</span></a></li><li class="part">Уровни</li>${lis}
      <li class="part">Справочник</li>
      <li><a href="#dict" data-to="dict"><span class="n">📒</span><span class="t">Мой словарь</span></a></li>
      <li><a href="#conf" data-to="conf"><span class="n">⚠</span><span class="t">Не путай!</span></a></li>
      <li><a href="#irr" data-to="irr"><span class="n">🔤</span><span class="t">Неправильные глаголы</span></a></li>
      <li><a href="#series" data-to="series"><span class="n">📺</span><span class="t">Сериальный разговорник</span></a></li>
      <li><a href="#ach" data-to="ach"><span class="n">🏆</span><span class="t">Ачивки</span></a></li>
      <li><a href="#src" data-to="src"><span class="n">📚</span><span class="t">Источники</span></a></li>`;
  }
  const IDX = [];
  for (const u of UNITS) {
    IDX.push([u.t + ' ' + (u.en || ''), u.lvl + ' · ' + u.t, 'урок', '#u/' + u.id]);
    for (const w of u.words || []) IDX.push([w[0] + ' ' + w[1], w[0] + ' — ' + w[1], 'слово · ' + u.lvl + ' · ' + u.t, '#u/' + u.id]);
    for (const s of u.series || []) IDX.push([s.q + ' ' + s.who, s.q, (SHOWS[s.show] || {}).name + ' · ' + u.lvl, '#u/' + u.id]);
    for (const c of u.conf || []) IDX.push([c[0].replace(/[*_]/g, ''), c[0].replace(/[*_]/g, ''), 'не путай · ' + u.lvl, '#u/' + u.id]);
  }
  $('#q').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    $('#hits').innerHTML = q.length < 2 ? '' : IDX.filter(x => x[0].toLowerCase().includes(q)).slice(0, 12).map(x => `<li><a href="${x[3]}">${esc(x[1])}<small>${esc(x[2])}</small></a></li>`).join('') || '<li class="note-s">Ничего не нашлось</li>';
  });

  // ---------- маршрут ----------
  function route() {
    const h = location.hash.slice(1) || 'home';
    tip.hidden = true; if (canSay) speechSynthesis.cancel();
    const [a, b] = h.split('/');
    if (a === 'u' && byId(b)) unitPage(byId(b));
    else if (a === 'test' && LEVELS.some(l => l.id === b)) testPage(b);
    else if (a === 'dict') dictPage();
    else if (a === 'ach') achPage();
    else if (a === 'conf') confPage();
    else if (a === 'series') seriesPage();
    else if (a === 'irr') irrPage();
    else if (a === 'src') srcPage();
    else homePage();
    if (a !== 'u') delete view.dataset.unit;
    for (const x of $$('#toc a')) x.classList.toggle('on', x.dataset.to === h);
    const lv = a === 'u' && byId(b) ? byId(b).lvl : a === 'test' ? b : '';
    for (const li of $$('#toc li.lvl')) if (li.dataset.lv === lv) { li.classList.add('open'); $('button', li).setAttribute('aria-expanded', 'true'); }
    document.body.classList.remove('nav');
    scrollTo({ top: 0, behavior: 'instant' });
    refresh();
  }
  addEventListener('hashchange', route);

  // ---------- события ----------
  document.addEventListener('click', e => {
    const t = e.target;
    const sb = t.closest('[data-say]'); if (sb) { say(sb.dataset.say); return; }
    const lvb = t.closest('#toc li.lvl > button'); if (lvb) { const li = lvb.parentElement; li.classList.toggle('open'); lvb.setAttribute('aria-expanded', li.classList.contains('open')); return; }
    if (t.closest('[data-retest]')) { e.preventDefault(); route(); return; }
    const act = t.closest('[data-act]');
    if (act) {
      const sec = act.closest('.exb');
      if (act.dataset.act === 'check') check(sec);
      else if (act.dataset.act === 'again') again(sec);
      else if (act.dataset.act === 'self') { const li = act.closest('li'); li.classList.remove('no'); li.classList.add('ok'); act.replaceWith(Object.assign(document.createElement('b'), { className: 'ok', textContent: ' ✓ засчитано' })); setResult(sec, score(sec)); }
      return;
    }
    const tok = t.closest('.tok');
    if (tok && !tok.disabled) { const li = tok.closest('li'); (tok.parentElement.classList.contains('pool') ? $('.built', li) : $('.pool', li)).append(tok); return; }
    const aw = t.closest('[data-addw]');
    if (aw) { const u = byId(view.dataset.unit); const w = u.words.find(x => x[0] === aw.dataset.addw); addWord(w[0], w[1], w[2], u.id); aw.outerHTML = '<span class="in-dict">в словаре ✓</span>'; return; }
    if (t.closest('[data-addall]')) { const u = byId(view.dataset.unit); let n = 0; for (const w of u.words) if (addWord(w[0], w[1], w[2], u.id)) n++; for (const b of $$('[data-addw]')) b.outerHTML = '<span class="in-dict">в словаре ✓</span>'; t.textContent = n ? `Добавлено слов: ${n} ✓` : 'Все слова уже в словаре ✓'; return; }
    const sub = t.closest('[data-submit]'); if (sub) { submit(sub.dataset.submit); return; }
    if (t.closest('[data-train]')) { train(false); return; }
    if (t.closest('[data-train-all]')) { train(true); return; }
    const us = t.closest('[data-use]'); if (us) { useCard(us.dataset.use); return; }
    const del = t.closest('[data-del]'); if (del) { if (confirm('Удалить слово из словаря?')) { delete S.v[del.dataset.del]; save(); dictPage(); refresh(); } return; }
    const cb = t.closest('[data-card]');
    if (cb) {
      const card = cb.closest('.card'), k = card.dataset.k, a2 = cb.dataset.card;
      if (a2 === 'show') { $('.a', card).hidden = false; cb.parentElement.hidden = true; $('[data-grade]', card).hidden = false; say(S.v[k].w); }
      else if (a2 === 'yes' || a2 === 'no') { grade(k, a2 === 'yes'); nextCard(); }
      else if (a2 === 'check') {
        const ok = norm($('input', card).value) === norm(S.v[k].w);
        grade(k, ok);
        card.innerHTML = `<p class="q">${ok ? '✓ Верно!' : '✗ Правильно:'} <b class="en">${esc(S.v[k].w)}</b> ${sayBtn(S.v[k].ex)}</p><p class="en">${esc(S.v[k].ex)}</p><div class="row"><button class="btn primary" data-card="next">Дальше</button></div>`;
        $('[data-card=next]', card).focus();
      }
      else if (a2 === 'skip') { grade(k, false); card.innerHTML = `<p class="q">Слово: <b class="en">${esc(S.v[k].w)}</b></p><p class="en">${esc(S.v[k].ex)}</p><div class="row"><button class="btn primary" data-card="next">Дальше</button></div>`; }
      else if (a2 === 'next') nextCard();
      else if (a2 === 'use') checkUse(card);
      return;
    }
    if (t.closest('#menu')) { document.body.classList.toggle('nav'); return; }
    if (t.closest('#scrim')) { document.body.classList.remove('nav'); return; }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('.card input')) { const b = $('[data-card=check]', e.target.closest('.card')); if (b) b.click(); }
    if (e.key === 'Enter' && e.target.matches('.gl')) showTip(e.target);
    if (e.key === 'Escape') { tip.hidden = true; document.body.classList.remove('nav'); }
  });
  document.addEventListener('input', e => {
    const ta = e.target.closest('[data-ta]');
    if (ta) { S.w[ta.dataset.ta] = ta.value.slice(0, 6000); wInput(ta.closest('.write')); clearTimeout(ta._t); ta._t = setTimeout(save, 1500); }
    if (e.target.id === 'df') { dictFilter = e.target.value; const pos = e.target.selectionStart; dictPage(); const f = $('#df'); f.focus(); f.setSelectionRange(pos, pos); }
  });
  document.addEventListener('change', e => { if (e.target.id === 'ds') { dictSort = e.target.value; dictPage(); } });
  document.addEventListener('submit', e => {
    if (e.target.id !== 'addf') return; e.preventDefault();
    const f = new FormData(e.target); if (addWord(f.get('w'), f.get('tr'), f.get('ex'), 'моё')) dictPage(); else alert('Такое слово уже есть в словаре');
  });

  buildToc(); route(); achReady = true;
  fetch('/api/english', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(j => { S = merge(S, (j && j.state) || {}); try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { /* нет места */ } saveEl.textContent = 'синхронизировано'; achReady = false; refresh(); achReady = true; if (!view.dataset.unit) route(); })
    .catch(() => { online = location.protocol !== 'file:'; saveEl.textContent = 'сохранено на этом устройстве'; });
})();
