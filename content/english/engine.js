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
    hp: { name: 'Harry Potter · «Гарри Поттер»', cls: 's-hp' },
  };
  const unitsOf = lv => UNITS.filter(u => u.lvl === lv);
  const byId = id => UNITS.find(u => u.id === id);
  const EXTRA = window.EN_EXTRA || {}, BOOK = window.EN_BOOK || { parts: [] }, NOTES = window.EN_NOTES || {};
  const bookOf = u => BOOK.parts.find(p => p.u === u.id);
  const PICS = window.EN_PICS || {}; // иллюстрации Тенниела: номер части книги → картинки (content/english/pics.js)
  // линии рисунка — цветом текста темы: картинка служит маской (сама прозрачна и только задаёт размер)
  const picHTML = (x, cls = '') => `<figure class="tenniel ${cls}"><span class="tn" style="-webkit-mask-image:url(/images/english/tenniel-${x.n}.webp);mask-image:url(/images/english/tenniel-${x.n}.webp)"><img src="/images/english/tenniel-${x.n}.webp" alt="${esc(x.alt)}" loading="lazy"></span><figcaption><i class="en">${esc(x.alt)}</i> <span>— John Tenniel, 1865</span></figcaption></figure>`;
  const PODS = window.EN_PODS || {}, podq = n => 'https://open.spotify.com/search/' + encodeURIComponent(n) + '/podcasts';
  const podHTML = ([n, a, why]) => `<li><a href="${podq(n)}" target="_blank" rel="noopener"><b>${esc(n)}</b></a> <span class="note-s">· ${esc(a)}</span><br>${fmt(why)}</li>`;
  // ---------- имя: в материалах «Alina» / «Алина» заменяется на имя того, кто учится (S.name = {en, ru}) ----------
  const ORIG = JSON.parse(JSON.stringify({ u: UNITS, n: NOTES, l: window.EN_LIFT || {} })); // исходные тексты — чтобы имя можно было поменять
  let ME = 'Alina', idxOn = false; // idxOn — поиск уже собран (IDX объявлен ниже)
  function ruCase(n, end) { // простое склонение русского имени: Алин|а, ы, е, у, ой
    const c = { 'а': 0, 'ы': 1, 'е': 2, 'у': 3, 'ой': 4, 'ою': 4 }[end], st = n.slice(0, -1), l = n.slice(-1).toLowerCase();
    if (c === 0 || !/[а-яё]/i.test(l)) return n;
    if (l === 'а') return st + [, /[гкхжшщч]$/i.test(st) ? 'и' : 'ы', 'е', 'у', /[жшщчц]$/i.test(st) ? 'ей' : 'ой'][c];
    if (l === 'я') return st + [, 'и', /и$/i.test(st) ? 'и' : 'е', 'ю', 'ей'][c];
    if (l === 'й' || l === 'ь') return st + [, 'я', 'ю', 'я', 'ем'][c];
    if (/[бвгджзклмнпрстфхцчшщ]/.test(l)) return n + [, 'а', 'у', 'а', /[жшщчц]$/i.test(n) ? 'ем' : 'ом'][c];
    return n;
  }
  function personal(o, en, ru) {
    if (typeof o === 'string') return o.replace(/\bAlina\b/g, en).replace(/Алин(ой|ою|ы|е|у|а)(?![а-яё])/g, (m, e) => ruCase(ru, e));
    if (Array.isArray(o)) return o.map(x => personal(x, en, ru));
    if (o && typeof o === 'object') { const r = {}; for (const [k, v] of Object.entries(o)) r[k] = personal(v, en, ru); return r; }
    return o;
  }
  function applyName(nm) {
    const en = (nm && nm.en) || 'Alina', ru = (nm && nm.ru) || (nm && nm.en) || 'Алина'; ME = en;
    const P = personal(ORIG, en, ru);
    UNITS.splice(0, UNITS.length, ...P.u);
    for (const k of Object.keys(NOTES)) delete NOTES[k]; Object.assign(NOTES, P.n);
    if (window.EN_LIFT) Object.assign(window.EN_LIFT, P.l);
    for (const u of UNITS) { const sr = (NOTES[u.id] || {}).sr; if (sr) u.series = [...(u.series || []), ...sr]; } // цитаты из notes.js — к цитатам урока
    if (idxOn) buildIdx();
  }

  // ---------- состояние ----------
  // прогресс в браузере — отдельно для каждого аккаунта (EN_UID подставляет worker/english.js); общий старый ключ больше не читаем
  const LS = 'english-state:' + (/^\d+$/.test(window.EN_UID || '') ? window.EN_UID : 'local');
  try { localStorage.removeItem('english-state'); } catch (e) { /* нет доступа */ }
  // k — открыто паролем админа {id урока или блока: время}; m — ошибки {id урока или t:тип: [неверно, всего]}; x — задания с ошибками {ref: вес}; t — время сохранения
  // rv — когда прогресс сбрасывали (кнопка «Сбросить учебник» или RESET_AT ниже): состояние со старым rv при слиянии отбрасывается целиком
  const RESET_AT = 1793007114497; // 26.10.2026: учебник обновлён (замки, книга, ворона, смолток) — прогресс с нуля; новое значение = ещё один сброс у всех
  const fresh = rv => ({ d: {}, w: {}, v: {}, a: {}, days: [], pd: [], c: {}, n: {}, ans: {}, last: '', k: {}, m: {}, x: {}, t: 0, rv }); // n — неудачных попыток подряд по блокам // pd — дни, когда хоть одно задание пройдено от PASS %
  let S = fresh(RESET_AT);
  try { const loc = JSON.parse(localStorage.getItem(LS) || '{}') || {}; if ((loc.rv || 0) >= RESET_AT) Object.assign(S, loc); } catch (e) { /* пусто */ } // старое состояние без метки сброса не берём
  applyName(S.name);
  const saveEl = $('#save');
  let timer = 0, online = true;
  function save() {
    S.t = Date.now();
    try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { /* нет места */ }
    if (!online) return;
    clearTimeout(timer);
    saveEl.textContent = '…'; saveEl.className = 'save';
    timer = setTimeout(() => fetch('/api/english', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ state: S }) })
      .then(r => { if (!r.ok) throw 0; saveEl.textContent = 'сохранено'; })
      .catch(() => { saveEl.textContent = 'сохранено на этом устройстве'; saveEl.className = 'save err'; }), 1200);
  }
  function merge(a, b) { // a — локальное, b — с сервера
    if ((b.rv || 0) < RESET_AT) b = fresh(RESET_AT);
    if ((a.rv || 0) !== (b.rv || 0)) return (a.rv || 0) > (b.rv || 0) ? a : b; // после сброса старый прогресс не возвращается с другого устройства
    const m = { ...b, ...a };
    m.d = { ...(b.d || {}) }; for (const [k, v] of Object.entries(a.d || {})) m.d[k] = Math.max(v, m.d[k] || 0);
    m.v = { ...(b.v || {}), ...(a.v || {}) };
    m.w = { ...(b.w || {}), ...(a.w || {}) };
    m.a = { ...(b.a || {}), ...(a.a || {}) };
    m.days = [...new Set([...(b.days || []), ...(a.days || [])])].sort((x, y) => x - y).slice(-120);
    m.pd = [...new Set([...(b.pd || []), ...(a.pd || [])])].sort((x, y) => x - y).slice(-400);
    m.c = { ...(b.c || {}) }; for (const [k, v] of Object.entries(a.c || {})) m.c[k] = Math.max(v, m.c[k] || 0);
    m.k = { ...(b.k || {}), ...(a.k || {}) };
    m.name = a.name || b.name;
    m.theme = a.theme !== undefined ? a.theme : b.theme;
    m.n = (a.t || 0) >= (b.t || 0) ? (a.n || {}) : (b.n || {});
    m.ans = (a.t || 0) >= (b.t || 0) ? (a.ans || {}) : (b.ans || {}); // свои ответы — из более свежего состояния
    m.m = { ...(b.m || {}) }; for (const [k, v] of Object.entries(a.m || {})) m.m[k] = m.m[k] && m.m[k][1] > v[1] ? m.m[k] : v;
    m.x = (a.t || 0) >= (b.t || 0) ? (a.x || {}) : (b.x || {}); // отработанные ошибки удаляются — берём более свежий список
    return m;
  }
  function touch() { const d = today(); if (!S.days.includes(d)) { S.days.push(d); S.days = S.days.slice(-120); } }
  function pstreak() { // дней подряд с пройденным заданием (сегодня ещё можно успеть)
    const set = new Set(S.pd || []); let d = today(); if (!set.has(d)) d--;
    let n = 0; while (set.has(d)) { n++; d--; } return n;
  }
  function streak() {
    const set = new Set(S.days); let d = today(); if (!set.has(d)) d--;
    let n = 0; while (set.has(d)) { n++; d--; } return n;
  }

  // ---------- блоки и прогресс ----------
  // порядок блоков = порядок на странице урока: упражнения → «Своими словами» → слушание → чтение → книга → сериалы → повторение → письмо; следующий открывается от PASS % в предыдущем
  const hasMk = u => !!((NOTES[u.id] || {}).mk || u.words);
  const hasSt = u => !!(NOTES[u.id] || {}).st;
  const LIFT = window.EN_LIFT || {};
  const liftOf = u => { const L = LIFT[u.lvl]; if (!L) return []; const i = unitsOf(u.lvl).indexOf(u) * 2; return [L.q[i % L.q.length], L.q[(i + 1) % L.q.length]]; }; // два «лифта с коллегами» на урок, по кругу
  const hasLs = u => !!((u.exm || []).length || (u.words || []).length);
  const blocksOf = u => [...(u.ex || []).map((_, i) => `${u.id}-e${i}`), ...(hasMk(u) ? [`${u.id}-m`] : []), ...(hasLs(u) ? [`${u.id}-l`] : []), ...(hasSt(u) ? [`${u.id}-t`] : []), ...(u.read ? [`${u.id}-r`] : []), ...(bookOf(u) && bookGroups(u).length ? [`${u.id}-b`] : []), ...(u.series ? [`${u.id}-s`] : []), ...(UNITS.indexOf(u) > 0 ? [`${u.id}-p`] : []), ...(u.write ? [`${u.id}-w`] : [])];
  const BID = /-(e\d+|m|l|t|r|b|s|p|w)$/;
  const PASS = 80;
  const isDone = id => (S.d[id] || 0) >= PASS;
  const pctOf = ids => ids.length ? Math.round(100 * ids.filter(isDone).length / ids.length) : 0;
  const unitPct = u => pctOf(blocksOf(u));
  const levelPct = lv => pctOf(unitsOf(lv).flatMap(blocksOf));
  const ALL = () => UNITS.flatMap(blocksOf);
  // замки: урок открыт, если предыдущий пройден в среднем на PASS % (лучшие результаты блоков), если сдан тест его уровня (от 85 %) или открыт паролем админа
  const unitScore = u => { const b = blocksOf(u); return b.length ? Math.round(b.reduce((a, id) => a + Math.min(100, S.d[id] || 0), 0) / b.length) : 0; };
  const lvTest = lv => (S.d['lt-' + lv] || 0) >= 85;
  const unitPassed = u => unitScore(u) >= PASS || lvTest(u.lvl);
  function reach() { let r = 0; UNITS.forEach((u, i) => { if (S.k[u.id] || lvTest(u.lvl)) r = Math.max(r, i); if (unitPassed(u)) r = Math.max(r, i + 1); }); return r; }
  const unitOpen = u => UNITS.indexOf(u) <= reach();
  function blockOpen(id) {
    const u = byId(id.replace(BID, '')); if (!u || unitPassed(u)) return true;
    const ch = blocksOf(u); let r = 0;
    ch.forEach((x, i) => { if (S.k[x]) r = Math.max(r, i); if ((S.d[x] || 0) >= PASS) r = Math.max(r, i + 1); });
    return ch.indexOf(id) <= r;
  }
  const pwHTML = (key, what) => `<details class="pw"><summary>Пропустить с паролем админа</summary><form data-pwf="${esc(key)}"><input type="password" inputmode="numeric" autocomplete="current-password" placeholder="пароль (PIN) админа" aria-label="пароль админа"><button class="btn small">Открыть ${what}</button><span class="note-s" data-pwm></span></form></details>`;
  function lockHTML(id, title) {
    const u = byId(id.replace(BID, '')), ch = blocksOf(u), prev = ch[ch.indexOf(id) - 1];
    return `<section class="exb locked" data-lock="${id}"><header><b>🔒 ${esc(title)}</b></header><p class="note-s">Откроется, когда предыдущее задание будет пройдено хотя бы на ${PASS} %${prev && S.d[prev] != null ? ` (сейчас ${S.d[prev]} %)` : ''}.</p>${pwHTML(id, 'задание')}</section>`;
  }

  function refresh() {
    const p = pctOf(ALL());
    $('#meter').style.width = p + '%'; $('#pct').textContent = p + ' %';
    $('#achip').textContent = '🏆 ' + Object.keys(S.a).length;
    $('#dchip').textContent = '📒 ' + Object.keys(S.v).length;
    $('#streak').textContent = '🔥 ' + pstreak();
    for (const el of $$('[data-up]')) {
      const u = byId(el.dataset.up); if (!u) continue; const v = unitPct(u);
      el.textContent = v ? v + '%' : ''; el.classList.toggle('full', v === 100);
    }
    for (const el of $$('[data-lp]')) el.textContent = levelPct(el.dataset.lp) + '%';
    for (const el of $$('[data-um]')) { const u = byId(el.dataset.um); if (u) el.style.width = unitPct(u) + '%'; }
    for (const el of $$('[data-lm]')) el.style.width = levelPct(el.dataset.lm) + '%';
    for (const el of $$('#toc a[data-to^="u/"]')) { const u = byId(el.dataset.to.slice(2)); if (u) el.classList.toggle('locked', !unitOpen(u)); }
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
  const nBook = () => UNITS.filter(u => bookOf(u) && isDone(u.id + '-b')).length;
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
    ['pd1', '☀️', 'Задание дня', 'Пройти хотя бы одно задание за день', () => (S.pd || []).length >= 1],
    ['pd10', '📅', 'Десять дней', '10 дней с пройденным заданием', () => (S.pd || []).length >= 10],
    ['pd50', '🗓️', 'Пятьдесят дней', '50 дней с пройденным заданием', () => (S.pd || []).length >= 50],
    ['pd100', '💯', 'Сто дней', '100 дней с пройденным заданием', () => (S.pd || []).length >= 100],
    ['ps3', '🐣', 'Без пропусков: 3', 'Задание каждый день 3 дня подряд', () => pstreak() >= 3],
    ['ps7', '⭐', 'Без пропусков: неделя', 'Задание каждый день 7 дней подряд', () => pstreak() >= 7],
    ['ps14', '🪶', 'Без пропусков: 2 недели', 'Задание каждый день 14 дней подряд', () => pstreak() >= 14],
    ['ps30', '🏰', 'Без пропусков: месяц', 'Задание каждый день 30 дней подряд', () => pstreak() >= 30],
    ['ps100', '👑', 'Без пропусков: 100 дней', 'Задание каждый день 100 дней подряд', () => pstreak() >= 100],
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
    ['hp', '⚡', 'Mischief managed', 'Все цитаты из «Гарри Поттера»', () => showAny('hp') && showDone('hp')],
    ['book1', '🐇', 'Вниз по кроличьей норе', 'Первая часть «Алисы» с заданиями', () => nBook() >= 1],
    ['book25', '🫖', 'Безумное чаепитие', 'Половина «Алисы в Стране чудес»', () => nBook() >= Math.ceil(BOOK.parts.length / 2)],
    ['bookAll', '👑', 'Книга прочитана', 'Вся «Алиса в Стране чудес» по-английски', () => BOOK.parts.length && nBook() >= BOOK.parts.length],
    ['mk20', '💬', 'Своими словами', '20 своих предложений в заданиях', () => (S.c.mk || 0) >= 20],
    ['mk100', '📣', 'Красноречие', '100 своих предложений в заданиях', () => (S.c.mk || 0) >= 100],
    ['fix20', '🩹', 'Работа над ошибками', '20 отработанных ошибок', () => (S.c.fixed || 0) >= 20],
  ];
  const toastEl = $('#toast'); let toastQ = [], toastOn = false;
  function toast(i, t, s, kind = 'Ачивка: ') {
    toastQ.push([i, t, s, kind]); if (toastOn) return;
    const next = () => {
      const x = toastQ.shift(); if (!x) { toastOn = false; return; }
      toastOn = true; toastEl.innerHTML = `<span class="i">${x[0]}</span><span>${x[3] === 'Ачивка: ' ? '<b>🏆 Новая ачивка!</b><br>' : esc(x[3])}${esc(x[1])}<small>${esc(x[2])}</small></span>`;
      toastEl.onclick = () => { if (x[3] === 'Ачивка: ') location.hash = 'ach'; };
      toastEl.classList.add('show'); setTimeout(() => { toastEl.classList.remove('show'); setTimeout(next, 400); }, 4500);
    };
    next();
  }
  let synced = false; // ачивки считаем после загрузки прогресса с сервера — тогда уведомление только о новых
  function checkAch() {
    if (!synced) return;
    let got = false;
    for (const [id, i, t, s, f] of ACH) if (!S.a[id] && f()) { S.a[id] = Date.now(); got = true; toast(i, t, s); }
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
      const toks = p[0].replace(/[.!?]+$/, '').split(/\s+/).map((w, i) => i === 0 && !NAMES.test(w) && w !== ME ? w[0].toLowerCase() + w.slice(1) : w);
      return `<li data-n="${n}"><div class="note-s">${it.hint ? fmt(it.hint) : 'Нажимайте на слова по порядку; нажатое слово в строке — вернуть.'}</div><div class="built" aria-label="ваше предложение"></div><div class="pool">${shuffle(toks).map(w => `<button type="button" class="tok">${esc(w)}</button>`).join('')}</div></li>`;
    }
    if (t === 'fix') return `<li data-n="${n}"><div>${fmt(p[0])}</div><input class="line" value="${esc(p[0])}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="исправленное предложение"></li>`;
    if (t === 'tr') return `<li data-n="${n}"><div class="ru-q">${fmt(p[0])}</div><input class="line" placeholder="по-английски…" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="перевод"></li>`;
    if (t === 'ls') return `<li data-n="${n}"><div class="lsn">${canSay ? `<button type="button" class="btn small" data-say="${esc(p[0])}">🔊 Послушать</button><button type="button" class="btn small" data-say="${esc(p[0])}" data-slow>🐢 Медленно</button>` : `<i class="en">${esc(p[0])}</i>`}</div><input class="line" placeholder="запишите, что услышали…" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="что услышали"></li>`;
    if (t === 'lc') return `<li data-n="${n}"><div class="lsn">${canSay ? `<button type="button" class="btn small" data-say="${esc(p[0])}">🔊 Послушать слово</button>` : `<i class="en">${esc(p[0])}</i>`} — что оно значит?</div>${shuffle(p.slice(1)).map(o => `<label class="opt"><input type="radio" name="o${uid}-${n}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</li>`;
    if (t === 'sp') return `<li data-n="${n}"><div class="${p[0] === p[1] ? 'en-q' : 'ru-q'}">${p[0] === p[1] ? '<span class="note-s">Прочитайте вслух:</span> <i class="en">' + esc(p[0]) + '</i> ' + sayBtn(p[0]) : fmt(p[0])}</div><div class="lsn">${canRec ? '<button type="button" class="btn small" data-mic>🎤 Сказать</button>' : '<span class="note-s">микрофона нет — напишите, что сказали бы</span>'}<input class="line" placeholder="${canRec ? 'тут появится сказанное (можно поправить)' : 'по-английски…'}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="сказанное"></div></li>`;
    if (t === 'mk') { const need = needsOf(it); return `<li data-n="${n}"><div class="ru-q">${fmt(p[0])}</div>${need.length ? `<div class="need">${need.map(x => `<span>${esc(x.split('/')[0])}</span>`).join('')}</div>` : ''}<textarea class="mk" rows="2" lang="en" spellcheck="true" placeholder="Пишите по-английски…" aria-label="своё предложение"></textarea></li>`; }
    return '';
  }
  let uid = 0;
  // mk — «напиши сама»: «задание|слово1/вариант;слово2|пример # пояснение». Проверка: нужные слова (с окончаниями), от it.min слов (6), большая буква, точка, без кириллицы
  const needsOf = it => (it.p[1] || '').split(';').map(x => x.trim()).filter(Boolean);
  function mkProbs(it, t) {
    const probs = [];
    for (const nd of needsOf(it)) if (!nd.split('/').some(w => uses(t, w))) probs.push(`нет «${esc(nd.split('/')[0])}»`);
    if ((t.match(/[A-Za-z']+/g) || []).length < (it.min || 6)) probs.push(`коротко: нужно хотя бы ${it.min || 6} слов`);
    if (t && !/^[A-Z"'«(]/.test(t)) probs.push('начните с большой буквы');
    if (t && !/[.!?…]["'»)]?$/.test(t)) probs.push('в конце нужна точка, ? или !');
    if (/[а-яё]/i.test(t)) probs.push('есть русские буквы');
    return probs;
  }
  function mkCredit(it, t) { // своё предложение засчитано: слова урока — в словарь, слова словаря — использованы, слово «к повторению» — повторено
    S.c.mk = (S.c.mk || 0) + 1;
    const u = byId(view.dataset.unit);
    for (const nd of needsOf(it)) { const w = ((u && u.words) || []).find(x => nd.split('/').some(a => a.toLowerCase() === x[0].toLowerCase())); if (w) addWord(w[0], w[1], w[2], u.id); }
    for (const [k, v] of Object.entries(S.v)) if (uses(t, v.w)) { v.u = (v.u || 0) + 1; if (v.due <= today()) { v.l = Math.min(6, (v.l || 0) + 1); v.due = today() + STEPS[v.l]; S.c.rev = (S.c.rev || 0) + 1; } if (k === it.dk && !v.my) v.my = t.slice(0, 300); }
  }
  const HOW = { gap: 'Впишите слово (или несколько) в пропуск.', choice: 'Выберите вариант.', tf: 'Верно или неверно по тексту?', order: 'Соберите осмысленное предложение из слов.', fix: 'В предложении ошибка — исправьте его прямо в строке.', tr: 'Переведите на английский. Сокращения (I\'m, don\'t) и полные формы засчитываются одинаково.', sp: 'Говорение: нажмите 🎤 и скажите по-английски. Засчитывается, если прозвучало почти всё.', ls: 'Диктант: послушайте и запишите предложение. Можно слушать сколько угодно раз.', lc: 'Послушайте слово и выберите перевод.', mk: 'Напишите своё предложение (или два) по-английски. Нужные слова засчитываются и с окончаниями. После проверки — пример.' };
  const NAMES_T = { gap: 'Вставьте', choice: 'Выберите', tf: 'Верно / неверно', order: 'Конструктор предложений', fix: 'Найдите ошибку', tr: 'Перевод', mk: 'Своими словами', ls: 'Диктант', lc: 'Слово на слух', sp: 'Говорение' };
  // ex: [{t, h, q:[…]}] — несколько групп в одном блоке или одна
  function blockHTML(id, title, groups, opts = {}) {
    uid++;
    const items = []; let html = '';
    for (const g of groups) {
      const start = items.length;
      for (const s of g.q) { const it = typeof s === 'string' ? parse(g.t, s) : { ...s }; it.hint = it.hint || g.hint; if (opts.track && !it.ref && !it.auto) it.ref = id + '#' + items.length; items.push(it); }
      const lis = items.slice(start).map((it, i) => itemHTML(it, start + i)).join('');
      html += `${g.h || groups.length > 1 ? `<p class="how">${fmt(g.h || HOW[g.t])}</p>` : ''}<ol start="${start + 1}">${lis}</ol>`;
    }
    BLOCKS[id] = items;
    const best = S.d[id];
    const one = groups.length === 1 && !groups[0].h ? `<p class="how">${groups[0].how || HOW[groups[0].t]}</p>` : '';
    const fold = best >= PASS; // пройденное — свёрнуто, разворачивается по нажатию на заголовок (foldable — можно свернуть обратно)
    return `<section class="exb${fold ? ' fold foldable' : ''}" data-b="${id}"><header data-fold title="Свернуть / развернуть"><b>${esc(title || (groups.length === 1 ? NAMES_T[groups[0].t] : 'Упражнение'))}</b><span class="best${best === 100 ? ' full' : ''}">${best != null ? (best >= PASS ? '✓ ' : '') + 'лучший результат: ' + best + ' %' : ''}</span><span class="fold-t" aria-hidden="true"></span></header>
      ${one}${html}<footer><button type="button" class="btn primary" data-act="check">Проверить</button><button type="button" class="btn" data-act="again" hidden>Очистить</button><span class="res"></span>${opts.foot || ''}<button type="button" class="btn small fold-b" data-act="fold"${fold ? '' : ' hidden'}>Свернуть ✓</button></footer></section>`;
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
    if (t === 'sp') { const v = $('input', li).value, alts = p.slice(1); return { ok: alts.some(a => norm(a) === norm(v) || overlap(a, v) >= .8), right: alts[0], self: !!v.trim() }; }
    if (t === 'ls') { const v = $('input', li).value; return { ok: norm(v) === norm(p[0]), right: p[0], self: !!v.trim() }; }
    if (t === 'lc') { const v = ($('input:checked', li) || {}).value; for (const o of $$('.opt', li)) { const iv = $('input', o).value; o.classList.toggle('right', iv === p[1]); o.classList.toggle('wrong', iv === v && v !== p[1]); } return { ok: v === p[1], right: p[0] + ' — ' + p[1] }; }
    if (t === 'mk') { const v = $('textarea', li).value.trim(), probs = mkProbs(it, v); return { ok: !probs.length, mk: probs, right: p[2] || '', self: (v.match(/[A-Za-z']+/g) || []).length >= 3 && !/[а-яё]/i.test(v), text: v }; }
    return { ok: false, right: '' };
  }
  function score(sec) {
    const lis = $$('ol > li', sec); const ok = lis.filter(li => li.classList.contains('ok')).length;
    return Math.round(100 * ok / Math.max(1, lis.length));
  }
  function setResult(sec, pct) {
    const r = $('.res', sec); r.textContent = pct + ' %' + (pct < PASS && blocksOf(byId(view.dataset.unit) || {}).includes(sec.dataset.b) ? ` · для следующего задания нужно ${PASS} %` : ''); r.className = 'res ' + (pct >= PASS ? 'good' : pct < 60 ? 'low' : '');
    const id = sec.dataset.b, was = reach();
    if (pct > (S.d[id] ?? -1)) S.d[id] = pct;
    if (S.d[id] >= PASS) { $('[data-act=fold]', sec).hidden = false; sec.classList.add('foldable'); }
    if (pct < PASS) S.n[id] = (S.n[id] || 0) + 1; else delete S.n[id]; // неудачные попытки подряд
    if (pct >= PASS && !(S.pd || []).includes(today())) S.pd = [...(S.pd || []), today()].slice(-400);
    const b = $('.best', sec); b.textContent = 'лучший результат: ' + S.d[id] + ' %'; b.classList.toggle('full', S.d[id] === 100);
    let cf = $('.crow-fb', sec); if (!cf) { cf = document.createElement('div'); cf.className = 'crow-fb'; $('footer', sec).after(cf); }
    cf.innerHTML = crow((pct >= PASS && Math.random() < .35 ? hey() : '') + crowFor(pct), 'small');
    touch(); save(); refresh(); openLive();
    const nu = UNITS[reach()]; if (reach() > was && nu) toast('🔓', nu.lvl + ' · ' + nu.t, `Урок пройден на ${PASS} % — открыт следующий`, 'Открыто: ');
  }
  // ---------- ошибки: где ошибаюсь — там новые задания ----------
  const refUnit = ref => byId(ref.replace(/-(e\d+|m|t|r|b|s)#\d+$/, ''));
  function mark(it, ok) {
    const u = refUnit(it.ref), bump = k => { const a = S.m[k] || [0, 0]; S.m[k] = [a[0] + (ok ? 0 : 1), a[1] + 1]; };
    if (u) bump(u.id); bump('t:' + it.t);
    if (!ok) S.x[it.ref] = Math.min(6, (S.x[it.ref] || 0) + 2);
    else if (S.x[it.ref]) { if (--S.x[it.ref] <= 0) { delete S.x[it.ref]; S.c.fixed = (S.c.fixed || 0) + 1; } }
  }
  function groupsOf(u, tag) { // задания блока в том же порядке, что на странице (без авто-заданий «Своими словами»)
    if (/^e\d+$/.test(tag)) { const e = (u.ex || [])[+tag.slice(1)]; return e ? [e] : []; }
    if (tag === 'r') return (u.read || {}).q || [];
    if (tag === 's') return [{ t: 'choice', q: (u.series || []).map(s => s.qz).filter(Boolean) }];
    if (tag === 'm') return [{ t: 'mk', q: (NOTES[u.id] || {}).mk || [] }];
    if (tag === 'b') return bookGroups(u);
    if (tag === 't') { const st = (NOTES[u.id] || {}).st; return st ? [{ t: 'choice', h: 'Что ответить естественно?', q: st.dlg }, { t: 'choice', h: '🛗 Лифт с коллегами: что сказать?', q: liftOf(u) }, { t: 'mk', q: [st.mk] }] : []; }
    return [];
  }
  function itemsOf(bid) {
    const u = byId(bid.replace(/-(e\d+|m|t|r|b|s)$/, '')); if (!u) return [];
    return groupsOf(u, bid.slice(u.id.length + 1)).flatMap(g => g.q.map(s => ({ ...parse(g.t, s), hint: g.hint })));
  }
  function itemByRef(ref) { const [bid, n] = ref.split('#'); const its = itemsOf(bid); return its[+n] ? { ...its[+n], ref, sib: its } : null; }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function variant(it) { // то же правило в другой форме: пропуск ↔ выбор, перевод → конструктор, ошибка → пропуск в нужном месте
    const { t, p } = it, base = { ref: it.ref, why: it.why, hint: '' };
    if (t === 'gap' && !p[1].includes(';')) {
      const right = p[1].split('/')[0], ds = [...new Set(it.sib.filter(x => x.t === 'gap' && !x.p[1].includes(';')).map(x => x.p[1].split('/')[0]))].filter(x => norm(x) !== norm(right));
      if (ds.length >= 2 && Math.random() < .6) return { ...base, t: 'choice', p: [p[0], right, ...shuffle(ds).slice(0, 2)] };
    }
    if (t === 'choice' && /_{3,}/.test(p[0]) && p[1].split(' ').length <= 3 && Math.random() < .6) return { ...base, t: 'gap', p: [p[0], p[1]] };
    if (t === 'tr' && Math.random() < .6) return { ...base, t: 'order', p: [p[1], ...p.slice(2)], hint: 'Соберите перевод: «' + p[0] + '»' };
    if (t === 'fix') {
      const a = p[0].split(/\s+/), b = p[1].split(/\s+/); let i = 0, j = 0;
      while (i < a.length && i < b.length && norm(a[i]) === norm(b[i])) i++;
      while (j < a.length - i && j < b.length - i && norm(a[a.length - 1 - j]) === norm(b[b.length - 1 - j])) j++;
      const mid = b.slice(i, b.length - j);
      if (mid.length >= 1 && mid.length <= 3) return { ...base, t: 'gap', p: [[...b.slice(0, i), '___', ...b.slice(b.length - j)].join(' '), mid.join(' ')], why: (it.why ? it.why + ' ' : '') + `(Было с ошибкой: «${a.slice(i, a.length - j).join(' ') || '—'}».)` };
    }
    if (t === 'order' && Math.random() < .5) {
      const ws = p[0].replace(/[.!?]+$/, '').split(/\s+/), cand = ws.map((w, k) => [w, k]).filter(([w, k]) => k > 0 && /^[a-z']{4,}$/i.test(w));
      if (cand.length) { const [w, k] = pick(cand); ws[k] = '___'; return { ...base, t: 'gap', p: [ws.join(' ') + (p[0].match(/[.!?]+$/) || ['.'])[0], w] }; }
    }
    return { ...base, t, p: p.slice() };
  }
  function weakUnits() { return UNITS.filter(u => (S.m[u.id] || [0, 0])[1] >= 5).map(u => [u, S.m[u.id][0] / S.m[u.id][1]]).filter(x => x[1] >= .15).sort((a, b) => b[1] - a[1]); }
  function fixItems(units, n) { // задания с ошибками (сначала самые частые) + новые задания по тем же урокам, если ошибок мало
    const refs = Object.entries(S.x).filter(([r]) => { const u = refUnit(r); return u && (!units || units.includes(u)); }).sort((a, b) => b[1] - a[1]).map(x => x[0]);
    const out = []; for (const r of refs) { if (out.length >= n) break; const it = itemByRef(r); if (it) out.push(variant(it)); }
    const pool = shuffle((units || weakUnits().map(x => x[0])).flatMap(u => blocksOf(u).filter(b => !/-w$/.test(b)).flatMap(b => itemsOf(b).map((_, i) => b + '#' + i)))).filter(r => !refs.includes(r));
    for (const r of pool) { if (out.length >= n) break; const it = itemByRef(r); if (it && it.t !== 'mk') out.push(variant(it)); }
    return out;
  }
  function grouped(items) { const gs = []; for (const it of items) { const g = gs[gs.length - 1]; if (g && g.t === it.t) g.q.push(it); else gs.push({ t: it.t, h: HOW[it.t], q: [it] }); } return gs; }
  function check(sec, silent) { // silent — показать сохранённые ответы с проверкой, ничего не засчитывая
    const items = BLOCKS[sec.dataset.b]; if (!items) return;
    const saved = silent ? (S.ans[sec.dataset.b] || {}) : null;
    for (const li of $$('ol > li', sec)) {
      if (li.dataset.keep) continue; // верный ответ сохранён после 3 неудачных попыток — не проверяем заново
      const it = items[+li.dataset.n]; const r = itemOK(it, li);
      if (silent && (saved[ikey(it)] || {}).s) r.ok = true; // «Мой вариант тоже верен»
      li.classList.toggle('ok', r.ok); li.classList.toggle('no', !r.ok);
      if (!silent && r.ok && it.t === 'order') S.c.built = (S.c.built || 0) + 1;
      if (!silent && it.ref) mark(it, r.ok);
      if (!silent && r.ok && it.t === 'mk') mkCredit(it, r.text);
      let fb = $('.fb', li); if (!fb) { fb = document.createElement('p'); fb.className = 'fb'; li.append(fb); }
      fb.innerHTML = (r.mk ? (r.ok ? '<b class="ok">✓ Принято.</b> ' : `<b class="no">Почти:</b> ${r.mk.join('; ')}. `) + (r.right ? `Пример: <i class="en">${esc(r.right)}</i> ` : '')
        : r.ok ? '<b class="ok">✓ Верно.</b> ' : `<b class="no">✗</b> ${r.noShow ? '' : 'Правильно: '}<span class="ans">${r.noShow ? '' : fmt(r.right)}</span> `)
        + (it.why ? fmt(it.why) : '')
        + (!r.ok && r.self ? ` <button type="button" class="btn small" data-act="self">Мой вариант тоже верен</button>` : '')
        + (!r.ok && it.t !== 'choice' && it.t !== 'tf' ? '' : '');
      for (const inp of $$('input, textarea', li)) inp.disabled = true;
      for (const b of $$('.tok', li)) b.disabled = true;
    }
    $('[data-act=check]', sec).hidden = true; $('[data-act=again]', sec).hidden = false;
    if (silent) { const r = $('.res', sec), pct = score(sec); r.textContent = pct + ' %'; r.className = 'res ' + (pct >= PASS ? 'good' : pct < 60 ? 'low' : ''); return; }
    storeAns(sec);
    setResult(sec, score(sec));
  }
  // ---------- ответы сохраняются (S.ans[блок][задание]) — видно свои ошибки, пока не нажать «Очистить» ----------
  const NOSAVE = /^(lt-|fx-|conf-q|irr-q)|-(l|p)$/; // наборы, которые каждый раз собираются заново
  const ikey = it => it.t + '|' + String(it.p[0] || '').slice(0, 80);
  function ansOf(it, li) {
    if (it.t === 'gap') return $$('input.gap', li).map(x => x.value.slice(0, 120));
    if (['choice', 'tf', 'lc'].includes(it.t)) return ($('input:checked', li) || {}).value || '';
    if (it.t === 'order') return $$('.built .tok', li).map(b => b.textContent);
    if (it.t === 'mk') return $('textarea', li).value.slice(0, 600);
    return ($('input.line', li) || {}).value || '';
  }
  function putAns(it, li, v) {
    if (it.t === 'gap') $$('input.gap', li).forEach((x, i) => { x.value = (v || [])[i] || ''; });
    else if (['choice', 'tf', 'lc'].includes(it.t)) { const r = $$('input[type=radio]', li).find(x => x.value === v); if (r) r.checked = true; }
    else if (it.t === 'order') { const built = $('.built', li); for (const w of v || []) { const t = $$('.pool .tok', li).find(x => x.textContent === w); if (t) built.append(t); } }
    else if (it.t === 'mk') $('textarea', li).value = v || '';
    else if ($('input.line', li)) $('input.line', li).value = v || '';
  }
  function storeAns(sec) {
    const id = sec.dataset.b; if (NOSAVE.test(id)) return;
    const items = BLOCKS[id], o = {};
    for (const li of $$('ol > li', sec)) { const it = items[+li.dataset.n]; o[ikey(it)] = { v: ansOf(it, li), s: li.querySelector('b.ok.selfok') ? 1 : 0 }; }
    S.ans[id] = o;
  }
  function restoreAns(root) { // после отрисовки: свои ответы на место и проверка без засчитывания
    for (const sec of $$('.exb[data-b]', root)) {
      const id = sec.dataset.b, o = S.ans[id], items = BLOCKS[id]; if (!o || !items || NOSAVE.test(id)) continue;
      const lis = $$('ol > li', sec); let all = true;
      for (const li of lis) { const it = items[+li.dataset.n], a = o[ikey(it)]; if (a) putAns(it, li, a.v); else all = false; }
      if (all) check(sec, true);
    }
  }
  function again(sec) { // «Очистить»: стереть ответы (после 3 неудачных попыток — только ошибки)
    const id = sec.dataset.b, items = BLOCKS[id];
    const lis = $$('ol > li', sec);
    const keep = (S.n[id] || 0) >= 3; // с 3-й попытки ниже PASS верные ответы остаются, решать заново — только ошибки
    for (const li of lis) {
      if (keep && li.classList.contains('ok')) { li.dataset.keep = 1; continue; }
      const n = +li.dataset.n; const tmp = document.createElement('div'); tmp.innerHTML = itemHTML(items[n], n); li.replaceWith(tmp.firstElementChild);
    }
    if (keep) storeAns(sec); else delete S.ans[id];
    if (keep) for (const li of $$('ol > li:not([data-keep])', sec)) { const it = items[+li.dataset.n]; delete (S.ans[id] || {})[ikey(it)]; }
    save();
    $('.res', sec).textContent = keep ? 'Верные ответы сохранены — исправьте только ошибки.' : ''; const cf = $('.crow-fb', sec); if (cf) cf.remove(); $('[data-act=check]', sec).hidden = false; $('[data-act=again]', sec).hidden = true;
  }

  // ---------- озвучка ----------
  const canSay = 'speechSynthesis' in window;
  function say(text, slow) {
    if (!canSay) return; speechSynthesis.cancel();
    const m = new SpeechSynthesisUtterance(text); m.lang = 'en-GB'; m.rate = slow ? .6 : .92;
    const v = speechSynthesis.getVoices().find(v => /^en[-_]GB/i.test(v.lang)) || speechSynthesis.getVoices().find(v => /^en/i.test(v.lang)); if (v) m.voice = v;
    speechSynthesis.speak(m);
  }
  const sayBtn = t => canSay ? `<button type="button" class="say" data-say="${esc(t)}" aria-label="Послушать" title="Послушать">🔊</button>` : '';

  // ---------- говорение: распознавание речи (Chrome, Safari, Edge); без него — письменно ----------
  const REC = window.SpeechRecognition || window.webkitSpeechRecognition, canRec = !!REC;
  function overlap(a, b) { // доля слов эталона, которые прозвучали (распознавание часто теряет мелочи)
    const want = norm(a).split(' ').filter(Boolean), got = norm(b).split(' '); let n = 0;
    for (const w of want) { const i = got.indexOf(w); if (i >= 0) { n++; got.splice(i, 1); } }
    return want.length ? n / want.length : 0;
  }
  function listen(btn) {
    const inp = $('input', btn.closest('li')); if (!REC || inp.disabled) return;
    const r = new REC(); r.lang = 'en-GB'; r.interimResults = false; r.maxAlternatives = 1;
    btn.textContent = '🎙 Слушаю…'; btn.disabled = true;
    r.onresult = e => { inp.value = e.results[0][0].transcript; };
    r.onerror = e => { inp.placeholder = e.error === 'not-allowed' ? 'нет доступа к микрофону — напишите сами' : 'не расслышала — попробуйте ещё раз'; };
    r.onend = () => { btn.textContent = '🎤 Сказать ещё раз'; btn.disabled = false; };
    try { r.start(); } catch (e) { r.onend(); }
  }

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
    if (/^'/.test(w.trim())) return text.toLowerCase().replace(/[’]/g, "'").includes(w.trim().toLowerCase()); // 's, 'd — часть слова
    const t = ' ' + text.toLowerCase().replace(/[’']/g, "'").replace(/'ve\b/g, ' have').replace(/'re\b/g, ' are').replace(/'ll\b/g, ' will').replace(/\bi'm\b/g, 'i am').replace(/[^a-z' ]+/g, ' ') + ' '; // I've = I have — нужное слово засчитывается
    w = w.toLowerCase().replace(/[’]/g, "'").replace(/'ve\b/g, ' have').replace(/'re\b/g, ' are').replace(/'ll\b/g, ' will').replace(/\bi'm\b/g, 'i am');
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

  // ---------- ворона Невермор: ведёт уроки, язвит, но болеет за вас ----------
  const CROW_SVG = `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="30" cy="40" rx="17" ry="15" fill="#2b2540"/><circle cx="38" cy="22" r="11" fill="#2b2540"/><path d="M47 20 L60 24 L47 27 Z" fill="#e0a526"/><circle cx="41" cy="20" r="3.4" fill="#fff"/><circle cx="42" cy="20" r="1.7" fill="#1f1832"/><path d="M36.5 15.5 L45 17" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M14 38 Q2 44 8 56 Q16 50 20 46 Z" fill="#3b3456"/><path d="M24 54 L22 61 M32 55 L33 61" stroke="#e0a526" stroke-width="2.4" stroke-linecap="round"/><path d="M22 34 Q30 30 38 36" stroke="#4a4266" stroke-width="2" fill="none"/></svg>`;
  const nameRu = () => (S.name && (S.name.ru || S.name.en)) || '';
  const hey = () => nameRu() ? pick([`Кар, ${nameRu()}! `, `${nameRu()}, `, `Так, ${nameRu()}. `, '']) : ''; // обращение по имени — не каждый раз
  const crow = (txt, cls = '') => `<div class="crow ${cls}"><div class="crow-av" title="Ворона Невермор">${CROW_SVG}</div><div class="crow-say"><b>Невермор:</b> ${fmt(txt)}</div></div>`;
  const CROW = {
    hi: ['Кар. Я Невермор, и сегодня я ваш учитель. Сочувствую нам обоим.', 'Снова вы. Ладно, ладно, я рада. Почти.', 'Открываем урок. Обещаю язвить только по делу.', 'Сядьте прямо. Ну, или как удобно — я же ворона, а не завуч.'],
    p100: ['100 %. Я проверила дважды. Подозрительно хорошо.', 'Без ошибок? Записываю в летопись ворон.', 'Идеально. Даже придраться не к чему, а я старалась.', 'Блестяще. Как ложечка, которую я однажды украла.'],
    p80: ['Неплохо. Я почти впечатлена.', 'Засчитано. Пара перьев выпала, но полёт нормальный.', 'Хорошо! Ошибки — в «Работу над ошибками», я их там покормлю.'],
    p60: ['Ну… Шекспир бы поплакал. Но не навзрыд.', 'Половина — уже что-то. Вторую половину я съела бы на завтрак.', 'Почти. «Ещё раз» — лучшая кнопка на этой странице.'],
    p0: ['Кар-р. Давайте сделаем вид, что этого не было, и нажмём «Ещё раз».', 'Я видела голубей, которые справились бы лучше. Шучу. Одного.', 'Ничего, ошибки — это просто задания, которые ещё не поняли, что они лёгкие.'],
    lock: ['Закрыто. Сначала предыдущее — минимум на 80 %. Я тут не для красоты сижу. Хотя и для неё тоже.', 'Сюда пока нельзя. Вороны помнят всё, а вот вы предыдущий урок — пока не очень.', 'Не так быстро. Сначала докажите прошлому уроку, что он был не зря.'],
    fix: ['Вот всё, на чём вы спотыкались. Я собрала в кучку, как блестяшки.', 'Ошибки вернулись в новом костюме. Узнаете?', 'Тренируем слабые места. Сильные и так справятся.'],
    rev: ['Повторение. Мозг — не гнездо: само не держится, надо подкладывать веточки.', 'Быстренько вспоминаем прошлое. Без ностальгии, по делу.'],
    mk: ['Пишем сами. Да, сами. Я не буду подсказывать. Ладно, буду — пример после проверки.', 'Своё предложение стоит десяти выученных. Это я сейчас придумала, но звучит умно.'],
    ls: ['Слушаем. Ушей у меня не видно, но они есть.', 'Аудирование: закрыть глаза не обязательно, но драматично.'],
    book: ['Читаем «Алису». Там тоже все говорящие и все немного странные — как дома.', 'Кролик опаздывает, а вы — нет. Уже прогресс.'],
  };
  const crowPick = k => pick(CROW[k]);
  const crowFor = pct => crowPick(pct === 100 ? 'p100' : pct >= PASS ? 'p80' : pct >= 50 ? 'p60' : 'p0');

  // ---------- задания, собранные на лету: «Своими словами», слушание, повторение ----------
  const CTX = ['про кота, который уверен, что он тут начальник', 'про голубя, который ворует картошку фри', 'про утренний кофе', 'про ваш последний рисунок', 'про Шелдона, Пенни или Раджа', 'про Ригу под дождём', 'про планы на выходные', 'про самый странный сон', 'про работу, где все хотят «просто быстренько»', 'про друга, который всегда опаздывает', 'про ворону, которая ведёт этот учебник', 'про Алису и Белого Кролика', 'про любимый сериал', 'про путешествие мечты', 'про чашку чая, которая остыла, пока вы работали', 'про поход в магазин за молоком, который пошёл не по плану'];
  const clean = w => w.replace(/[^A-Za-z' \/-]/g, ' ').replace(/\s+/g, ' ').trim().split(' / ').join('/');
  function mkAuto(u) {
    const ws = shuffle(u.words || []).slice(0, 2);
    const out = ws.map(([w, tr, ex]) => ({ t: 'mk', p: [`Придумайте предложение со словом *${w}* (${tr}) — ${pick(CTX)}.`, clean(w), ex || ''], auto: 1, min: 4 }));
    const due = shuffle(Object.entries(S.v).filter(([k, v]) => v.due <= today() && !(u.words || []).some(x => x[0].toLowerCase() === k)))[0];
    if (due) out.push({ t: 'mk', p: [`Слово из словаря, пора повторить: *${due[1].w}* (${due[1].tr || '—'}) — ${pick(CTX)}.`, clean(due[1].w), due[1].ex || ''], auto: 1, min: 4, dk: due[0] });
    return out;
  }
  function mkGroups(u) { return [{ t: 'mk', q: [...((NOTES[u.id] || {}).mk || []), ...mkAuto(u)] }]; }
  function listenItems(u) {
    const sents = shuffle([...(u.exm || []).map(x => x[0]), ...(u.words || []).map(w => w[2]).filter(Boolean)].filter(x => x.split(' ').length <= 12)).slice(0, 3);
    const ws = shuffle((u.words || []).filter(w => !/[\/…]/.test(w[0]))).slice(0, 2), trs = (u.words || []).map(w => w[1]);
    const spk = shuffle((u.exm || []).map(x => x[0]).filter(x => !sents.includes(x)))[0];
    return [...sents.map(x => ({ t: 'ls', p: [x, x], auto: 1 })), ...ws.map(w => ({ t: 'lc', p: [w[0], w[1], ...shuffle(trs.filter(x => x !== w[1])).slice(0, 2)], auto: 1 })), ...(spk ? [{ t: 'sp', p: [spk, spk], auto: 1 }] : [])];
  }
  function reviewItems(u) { // повторение пройденного: слова и правила из прошлых уроков (сначала то, где были ошибки)
    const prev = UNITS.slice(0, UNITS.indexOf(u)); if (!prev.length) return [];
    const words = shuffle(prev.flatMap(x => x.words || []).filter(w => !/[\/…]/.test(w[0]))).sort((a, b) => ((S.v[a[0].toLowerCase()] || {}).l || 0) - ((S.v[b[0].toLowerCase()] || {}).l || 0)).slice(0, 4);
    const allTr = prev.flatMap(x => x.words || []).map(w => w[1]);
    const wi = words.map(([w, tr, ex]) => {
      const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return ex && re.test(ex) ? { t: 'gap', p: [ex.replace(re, `___ (${tr})`), w], auto: 1 } : { t: 'choice', p: [`Что значит *${w}*?`, tr, ...shuffle(allTr.filter(x => x !== tr)).slice(0, 2)], auto: 1 };
    });
    return [...wi, ...fixItems(prev.slice(-8), 3)];
  }
  function bookGroups(u) { const n = NOTES[u.id] || {}, gs = []; if (n.tf) gs.push({ t: 'tf', q: n.tf }); if (n.ch) gs.push({ t: 'choice', q: n.ch }); if (n.bmk) gs.push({ t: 'mk', q: n.bmk }); return gs; }

  // ---------- страницы ----------
  const ytq = (ch, t) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ch + ' ' + t);
  const LATE = {}; // id блока → () => HTML: закрытый блок открывается сразу, как только предыдущий пройден
  function late(id, title, build) { LATE[id] = build; return blockOpen(id) ? build() : lockHTML(id, title); }
  function openLive() {
    for (const el of $$('[data-lock]', view)) if (blockOpen(el.dataset.lock) && LATE[el.dataset.lock]) {
      const tmp = document.createElement('div'); tmp.innerHTML = LATE[el.dataset.lock](); const n = tmp.firstElementChild; el.replaceWith(n);
      if (n.matches('.write')) wInput(n); else restoreAns(n.parentNode);
    }
  }
  function lockedUnit(u) {
    const i = UNITS.indexOf(u), prev = UNITS[i - 1];
    view.dataset.unit = u.id;
    view.innerHTML = `<div class="uhead"><div class="lv">Уровень ${u.lvl} · урок ${unitsOf(u.lvl).indexOf(u) + 1}</div><h2>🔒 ${esc(u.t)}</h2>${u.en ? `<p class="sub">${esc(u.en)}</p>` : ''}</div>
      ${crow(crowPick('lock'))}
      <p>Урок откроется, когда предыдущий — <a href="#u/${prev.id}">${esc(prev.lvl + ' · ' + prev.t)}</a> — будет пройден хотя бы на ${PASS} % (сейчас ${unitScore(prev)} %). Процент урока — среднее лучших результатов всех его заданий.</p>
      ${u.goals ? `<div class="goals"><h4>Что будет в уроке</h4><ul>${u.goals.map(g => `<li>${fmt(g)}</li>`).join('')}</ul></div>` : ''}
      <p><a class="btn primary" href="#u/${prev.id}">К предыдущему уроку</a> <a class="btn" href="#test/${u.lvl}">Тест уровня ${u.lvl}</a></p>${pwHTML(u.id, 'урок')}`;
  }
  function unitPage(u) {
    if (!unitOpen(u)) return lockedUnit(u);
    const i = UNITS.indexOf(u), prev = UNITS[i - 1], next = UNITS[i + 1], N = NOTES[u.id] || {}, bk = bookOf(u);
    S.last = u.id; save();
    view.dataset.unit = u.id;
    let h = `<div class="uhead"><div class="lv">Уровень ${u.lvl} · урок ${unitsOf(u.lvl).indexOf(u) + 1} · пройдено ${unitScore(u)} %</div><h2>${esc(u.t)}</h2>${u.en ? `<p class="sub">${esc(u.en)}</p>` : ''}<div class="m"><i data-um="${u.id}"></i></div></div>`;
    const hp = (PICS[BOOK.parts.indexOf(bk)] || [])[0];
    h += crow(hey() + (N.crow || crowPick('hi')));
    if (hp) h += `<a class="uhead-pic" href="#book-${u.id}" data-tobook>${picHTML(hp, 'small')}</a>`;
    if (u.goals) h += `<div class="goals"><h4>После урока получится</h4><ul>${u.goals.map(g => `<li>${fmt(g)}</li>`).join('')}</ul></div>`;
    h += `<section class="sec th" id="theory"><h3><span class="ic">📘</span>Теория</h3>${u.th}${u.simple ? `<p class="simple">${fmt(u.simple)}</p>` : ''}</section>`;
    if (u.exm) h += `<div class="ex-list">${u.exm.map(([e, r]) => `<p>${sayBtn(e)} <i class="en">${esc(e)}</i><span class="ru">${esc(r)}</span></p>`).join('')}</div>`;
    if (u.conf) h += `<div class="box conf"><h4>⚠ Не путай</h4><dl>${u.conf.map(c => `<dt>${fmt(c[0])}</dt><dd>${c[1]}</dd>`).join('')}</dl></div>`;
    if (u.words) h += `<section class="sec" id="words"><h3><span class="ic">📒</span>Слова урока</h3><p class="note-s">Слово запоминается, когда его используешь: оно встретится в заданиях «Своими словами», в слушании и в повторении следующих уроков.</p>
      <ul class="words">${u.words.map(([w, tr, s]) => `<li><span><span class="w">${esc(w)}</span> <span class="tr">— ${esc(tr)}</span></span><span class="acts">${sayBtn(w)}${S.v[w.toLowerCase()] ? '<span class="in-dict">в словаре ✓</span>' : `<button type="button" class="btn small" data-addw="${esc(w)}">+</button>`}</span>${s ? `<span class="s">${esc(s)}</span>` : ''}</li>`).join('')}</ul>
      <p><button type="button" class="btn" data-addall>+ Все слова урока в словарь</button> <button type="button" class="btn" data-cards>🃏 Карточки</button></p><div class="cards" hidden>${cardsHTML(u.words.map(([w, tr, s]) => ({ w, tr, ex: s })))}</div></section>`;
    if (N.etym) h += `<div class="box etym"><h4>🔎 Откуда слово</h4>${N.etym.map(([w, t]) => `<p><b class="en">${esc(w)}</b> — ${fmt(t)}</p>`).join('')}</div>`;
    if (u.ex) h += `<section class="sec" id="practice"><h3><span class="ic">✏️</span>Упражнения</h3>${u.ex.map((e, k) => { const id = `${u.id}-e${k}`, title = `Упражнение ${k + 1}. ${e.h || NAMES_T[e.t]}`; return late(id, title, () => blockHTML(id, title, [{ t: e.t, q: e.q, hint: e.hint, how: e.how }], { track: true })); }).join('')}</section>`;
    if (hasMk(u)) h += `<section class="sec" id="mk"><h3><span class="ic">💬</span>Своими словами</h3>${crow(crowPick('mk'), 'small')}${late(u.id + '-m', 'Своими словами', () => blockHTML(u.id + '-m', 'Своими словами: пишем сами', mkGroups(u), { track: true }))}</section>`;
    if (hasLs(u)) h += `<section class="sec" id="listen"><h3><span class="ic">🎧</span>Слушание и говорение</h3>${crow(crowPick('ls'), 'small')}${canSay ? '' : '<p class="note-s">В этом браузере нет озвучки — откройте страницу в Chrome или Safari.</p>'}${late(u.id + '-l', 'Слушание и говорение', () => blockHTML(u.id + '-l', 'Послушайте, ответьте и скажите сами', grouped(listenItems(u))))}</section>`;
    if (hasSt(u)) h += smallTalkHTML(u);
    if (u.read) {
      const r = u.read;
      h += `<section class="sec" id="reading"><h3><span class="ic">📖</span>Чтение</h3>${r.intro ? `<p>${fmt(r.intro)}</p>` : ''}<article class="reading"><h4>${esc(r.title)} ${sayBtn(r.title + '. ' + r.txt.join(' '))}</h4><div class="txt">${r.txt.map(p => `<p>${glossText(p, r.gl)}</p>`).join('')}</div>
        ${r.gl ? '<p class="note-s">Подчёркнутые слова — нажмите: перевод и «+ в словарь».</p>' : ''}</article>${late(u.id + '-r', 'Задания к тексту', () => blockHTML(u.id + '-r', 'Задания к тексту', r.q, { track: true }))}</section>`;
    }
    if (bk) h += bookHTML(u, bk, N);
    if (u.series) {
      h += `<section class="sec" id="series"><h3><span class="ic">📺</span>Из сериалов</h3><p class="note-s">Цитаты короткие, для разбора языка. Посмотрите сцену (ссылка под цитатой) — так шутка запомнится лучше.</p><div class="series">${u.series.map(quoteHTML).join('')}</div>
        ${late(u.id + '-s', 'Проверь себя: поймёшь шутку?', () => blockHTML(u.id + '-s', 'Проверь себя: поймёшь шутку?', [{ t: 'choice', q: u.series.map(s => s.qz).filter(Boolean) }], { track: true }))}</section>`;
    }
    if (prev) h += `<section class="sec" id="review"><h3><span class="ic">🔄</span>Повторение пройденного</h3>${crow(crowPick('rev'), 'small')}<p class="note-s">Слова и правила из прошлых уроков, коротко. Каждый раз набор новый — сначала то, что вспоминается хуже.</p>${late(u.id + '-p', 'Повторение пройденного', () => blockHTML(u.id + '-p', 'Вспомнить прошлое', grouped(reviewItems(u))))}</section>`;
    if (u.write) {
      const w = u.write, id = u.id + '-w';
      h += late(id, 'Письмо', () => `<section class="sec write${(S.d[id] || 0) >= PASS ? ' fold' : ''}" id="writing" data-w="${id}"><h3><span class="ic">✍️</span>Письмо <span class="fold-t" aria-hidden="true"></span></h3><p class="wdone note-s">Текст сдан ✓ — нажмите на заголовок, чтобы открыть.</p><p>${fmt(w.h)}</p>
        ${w.plan ? `<ol class="plan">${w.plan.map(x => `<li>${fmt(x)}</li>`).join('')}</ol>` : ''}
        ${w.use ? `<p class="note-s">Используйте эти слова (засчитывается и с окончаниями):</p><div class="need">${w.use.map(x => `<span data-need="${esc(x)}">${esc(x)}</span>`).join('')}</div>` : ''}
        <textarea data-ta="${id}" placeholder="Пишите по-английски…" spellcheck="true" lang="en">${esc(S.w[id] || '')}</textarea>
        <p><span class="wc" data-wc>0 слов</span> · минимум ${w.min}</p>
        <ul class="chk">${(w.chk || ['Каждое предложение: кто/что + действие + остальное', 'Время глагола подходит к смыслу', 'Предложения начинаются с большой буквы и заканчиваются точкой']).map(c => `<li><label><input type="checkbox"><span>${fmt(c)}</span></label></li>`).join('')}</ul>
        <p><button type="button" class="btn primary" data-submit="${id}" disabled>Сдать текст</button> <span class="note-s" data-wstat>${S.d[id] ? 'Сдано ✓ — можно дописывать и сдавать снова.' : ''}</span></p>
        ${w.model ? `<details><summary>Пример ответа</summary><div class="model">${w.model.split('\n').map(p => `<p class="en">${esc(p)}</p>`).join('')}</div></details>` : ''}</section>`);
    }
    if (Object.keys(S.x).some(r => refUnit(r) === u)) h += `<section class="sec" id="fix"><h3><span class="ic">🩹</span>Работа над ошибками</h3>${crow(crowPick('fix'), 'small')}<p class="note-s">Задания этого урока, где были ошибки, — в другой форме, и новые задания на ту же тему. Ошибка уходит из списка после двух верных ответов подряд.</p>${blockHTML('fx-' + u.id, 'Ещё раз, но по-другому', grouped(fixItems([u], 8)))}</section>`;
    if (u.vid) h += `<section class="sec" id="video"><h3><span class="ic">▶️</span>Видео по теме</h3><ul class="vids">${u.vid.map(([ch, t]) => `<li><a href="${ytq(ch, t)}" target="_blank" rel="noopener"><span><b>${esc(ch)}</b> — ${esc(t)}</span><small>YouTube</small></a></li>`).join('')}</ul><p class="note-s">Ссылки открывают поиск на YouTube по каналу и теме — там всегда свежие уроки этого автора.</p></section>`;
    const pods = PODS[u.lvl] || []; if (pods.length) h += `<div class="box pod"><h4>🎙 Подкаст уровня ${u.lvl}</h4><ul class="pods">${podHTML(pods[unitsOf(u.lvl).indexOf(u) % pods.length])}</ul><p class="note-s"><a href="#pods">Все подкасты</a></p></div>`;
    if (u.fact) h += `<div class="box fact"><h4>💡 Интересный факт</h4><p>${fmt(u.fact)}</p></div>`;
    if (u.src) h += `<p class="note-s">По материалам открытых учебников: ${u.src.map(s => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(' · ')}</p>`;
    h += `<nav class="pager">${prev ? `<a href="#u/${prev.id}"><small>← назад</small>${esc(prev.lvl + ' · ' + prev.t)}</a>` : ''}${next ? `<a class="next" href="#u/${next.id}"><small>${unitOpen(next) ? 'дальше →' : '🔒 дальше — от ' + PASS + ' %'}</small>${esc(next.lvl + ' · ' + next.t)}</a>` : ''}</nav>`;
    view.innerHTML = h;
    for (const s of $$('.write', view)) wInput(s);
    restoreAns(view);
  }
  function smallTalkHTML(u) { // смолток с Невермор: ситуация, фразы, лифт с коллегами, задания (+ сказать вслух)
    const st = NOTES[u.id].st, L = LIFT[u.lvl];
    const phr = list => `<div class="ex-list">${list.map(([e, r]) => `<p>${sayBtn(e)} <i class="en">${esc(e)}</i><span class="ru">${esc(r)}</span></p>`).join('')}</div>`;
    const build = () => blockHTML(u.id + '-t', 'Смолток: ваша очередь', [...groupsOf(u, 't'), { t: 'sp', h: 'Скажите вслух — как будто это ваша реплика:', q: [{ t: 'sp', p: [st.ph[0][0], st.ph[0][0]], auto: 1 }] }], { track: true });
    return `<section class="sec" id="smalltalk"><h3><span class="ic">☕</span>Смолток с Невермор: ${esc(st.t)}</h3>${crow(st.tip)}
      <p><b>Ситуация.</b> ${fmt(st.sit)}</p>${phr(st.ph)}
      ${L ? `<div class="box lift"><h4>🛗 Лифт с коллегами</h4><p>${fmt(L.tip)}</p>${phr(L.ph)}</div>` : ''}
      ${late(u.id + '-t', 'Смолток: ваша очередь', build)}</section>`;
  }
  function bookHTML(u, bk, N) {
    const k = BOOK.parts.indexOf(bk);
    return `<section class="sec" id="book"><span id="book-${u.id}"></span><h3><span class="ic">🐇</span>Книга: «Alice's Adventures in Wonderland»</h3>${crow(N.bcrow || crowPick('book'), 'small')}
      <p class="note-s">Часть ${k + 1} из ${BOOK.parts.length} · Lewis Carroll, 1865 — оригинал, без сокращений. Глава ${esc(bk.ch)} · ${bk.n} слов. К концу учебника — вся книга.</p>
      ${N.ru ? `<div class="box bk-ru"><h4>${['A1', 'A2'].includes(u.lvl) ? 'Сначала по-русски: что будет в отрывке' : 'Перед чтением'}</h4><p>${fmt(N.ru)}</p></div>` : ''}
      <article class="reading book">${bk.h.map(x => `<h4>Chapter ${esc(x)}</h4>`).join('')}<div class="txt">${bk.txt.map((p, j) => { const ps = PICS[k] || []; return ps.filter(x => x.at === j && !x.after).map(x => picHTML(x)).join('') + `<p>${glossText(p, N.gl)}</p>` + ps.filter(x => x.at === j && x.after).map(x => picHTML(x)).join(''); }).join('')}</div>
      <p>${sayBtn(bk.txt.join(' ').replace(/<br>/g, ' ').replace(/&amp;/g, '&').slice(0, 3000))} <span class="note-s">послушать отрывок (начало)</span></p>
      ${N.gl ? '<p class="note-s">Подчёркнутые слова — нажмите: перевод и «+ в словарь».</p>' : ''}</article>
      ${N.etb ? `<div class="box etym"><h4>🔎 Слово из Кэрролла</h4><p>${fmt(N.etb)}</p></div>` : ''}
      ${bookGroups(u).length ? late(u.id + '-b', 'Задания к книге', () => blockHTML(u.id + '-b', 'Задания к книге', bookGroups(u), { track: true })) : ''}</section>`;
  }
  function cardsHTML(list) {
    return list.map(c => `<button type="button" class="fcard" data-flip><span class="f"><b class="en">${esc(c.w)}</b><small>нажмите — перевод</small></span><span class="b">${esc(c.tr || '—')}${c.ex ? `<small class="en">${esc(c.ex)}</small>` : ''}</span></button>`).join('');
  }
  function quoteHTML(s) {
    const sh = SHOWS[s.show] || { name: s.show, cls: '' };
    return `<div class="quote ${sh.cls}"><div class="show">${esc(sh.name)}</div><blockquote>${sayBtn(s.q)} «${esc(s.q)}»</blockquote><div class="who">${esc(s.who)}</div>
      <p><b>Что значит.</b> ${s.mean}</p>${s.fun ? `<p><b>В чём шутка.</b> ${s.fun}</p>` : ''}${s.use ? `<p><b>Как сказать самим.</b> <i class="en">${esc(s.use)}</i></p>` : ''}
      <p class="yt"><a href="${ytq(sh.name.split(' · ')[0], s.yt || s.q.slice(0, 80))}" target="_blank" rel="noopener">▶ Найти сцену на YouTube</a></p></div>`;
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
    S.d[id] = 100; S.w[id] = txt.slice(0, 6000); if (!(S.pd || []).includes(today())) S.pd = [...(S.pd || []), today()]; if (n >= 250) S.c.long = (S.c.long || 0) + 1;
    let used = 0;
    for (const x of u.write.use || []) if (uses(txt, x)) { const wd = (u.words || []).find(w => w[0].toLowerCase() === x.toLowerCase()); if (wd) addWord(wd[0], wd[1], wd[2], u.id); if (S.v[x.toLowerCase()]) { S.v[x.toLowerCase()].u++; used++; } } // слово урока — сразу в словарь
    for (const v of Object.values(S.v)) if (!(u.write.use || []).some(x => x.toLowerCase() === v.w.toLowerCase()) && uses(txt, v.w)) { v.u++; used++; }
    $('[data-wstat]', sec).textContent = `Сдано ✓ Слов из словаря в тексте: ${used}. Сравните с примером ответа ниже.`;
    touch(); save(); refresh();
  }

  function homePage() {
    const p = pctOf(ALL());
    const due = Object.values(S.v).filter(v => v.due <= today()).length;
    const facts = UNITS.filter(u => u.fact); const f = facts[today() % Math.max(1, facts.length)];
    const last = UNITS[Math.min(reach(), UNITS.length - 1)]; // самый новый открытый урок; «Продолжить» ведёт к его первому непройденному заданию (#u/id/go)
    const ety = UNITS.flatMap(u => ((NOTES[u.id] || {}).etym || []).map(e => [u, e])), e1 = ety[(today() * 7) % Math.max(1, ety.length)];
    const nx = Object.keys(S.x).length, weak = weakUnits().slice(0, 3);
    let h = `<section class="cover"><div class="kicker">Учебник · от азов до C2</div><h1>English <em>от A1 до C2</em></h1>
      <p class="lead">Ведёт уроки ворона Невермор. Теория простыми словами, упражнения с проверкой, «Своими словами», слушание и говорение, чтение, вся «Алиса в Стране чудес» в оригинале, письмо и разбор шуток из «Друзей», «Теории большого взрыва», «Парков», «Сверхъестественного» и «Гарри Поттера».</p>
      <div class="big-meter"><i style="width:${p}%"></i></div><p class="note-s">Пройдено ${p} % учебника · задание считается пройденным от ${PASS} %; следующий урок открывается, когда предыдущий пройден в среднем на ${PASS} %</p>
      <div class="stats"><div><b>${ALL().filter(isDone).length}</b><span>блоков пройдено из ${ALL().length}</span></div><div><b>${Object.keys(S.v).length}</b><span>слов в словаре</span></div><div><b>${nUsed()}</b><span>слов использовано в своих предложениях</span></div><div><b>${nWrite()}</b><span>текстов написано</span></div><div><b>${pstreak()}</b><span>дней подряд с заданием</span></div><div><b>${Object.keys(S.a).length}/${ACH.length}</b><span>ачивок</span></div></div>
      <div class="go"><a class="btn primary" href="#u/${last.id}/go">${S.last ? 'Продолжить: ' + esc(last.lvl + ' · ' + last.t) : 'Начать с A1'}</a><a class="btn" href="#dict">📒 Словарь${due ? ` · ${due} к повторению` : ''}</a><a class="btn" href="#ach">🏆 Ачивки</a></div></section>
      ${crow(S.last ? `${nameRu() ? 'С возвращением, ' + esc(nameRu()) + '.' : 'С возвращением.'} ${due ? `В словаре ${due} слов ждут повторения — они не обидятся, но я да.` : 'Словарь в порядке. Подозрительно.'}${nx ? ` А ещё ${nx} ошибок скучают в «Работе над ошибками».` : ''}` : 'Кар. Я Невермор, ворона и по совместительству ваш учитель английского. Буду вести уроки, проверять, язвить и болеть за вас. Начинаем с A1 — да, даже если кажется, что это слишком просто. Особенно тогда.')}
      <div class="box fixbox"><h4>🩹 Слабые места</h4>${nx ? `<p>Ошибок к отработке: <b>${nx}</b>.${weak.length ? ' Чаще всего ошибки в уроках: ' + weak.map(([u, r]) => `<a href="#u/${u.id}">${esc(u.lvl + ' · ' + u.t)}</a> (${Math.round(r * 100)} %)`).join(', ') + '.' : ''}</p><p><a class="btn primary small" href="#fix">Работа над ошибками</a></p>` : '<p class="note-s">Пока ошибок нет — или пока нет заданий. Где будут ошибаться чаще всего, там и появятся новые задания.</p>'}</div>
      ${f ? `<div class="box fact"><h4>💡 Факт дня</h4><p>${fmt(f.fact)}</p></div>` : ''}
      ${e1 ? `<div class="box etym"><h4>🔎 Слово дня: откуда оно</h4><p><b class="en">${esc(e1[1][0])}</b> — ${fmt(e1[1][1])}</p><p class="note-s"><a href="#etym">Все истории слов</a></p></div>` : ''}
      <div class="box bk-ru"><h4>🐇 Книга курса</h4>${picHTML({ n: 2, alt: 'The White Rabbit in a waistcoat, consulting his pocket-watch.' }, 'side')}<p>По ходу уроков — вся «Alice's Adventures in Wonderland» Льюиса Кэрролла в оригинале: в каждом уроке следующий отрывок и задания к нему. Прочитано частей: <b>${nBook()} из ${BOOK.parts.length}</b>. <a href="#book">Оглавление книги</a></p></div>
      <h2>Уровни</h2><p>A1 и A2 — коротко, чтобы закрыть пробелы. Если уверены в уровне — сдайте тест уровня: от 85 % можно идти дальше. Больше всего материала — на B1 и выше.</p>
      <div class="levels">${LEVELS.map(l => { const us = unitsOf(l.id); return `<div class="lvcard"><h3><span>${l.id}</span>${esc(l.name)}</h3><p>${esc(l.about)}</p><p>${us.length} уроков · ${levelPct(l.id)} %${S.d['lt-' + l.id] != null ? ` · тест: ${S.d['lt-' + l.id]} %` : ''}</p><div class="m"><i style="width:${levelPct(l.id)}%"></i></div>
        <div class="row">${us.length ? `<a class="btn small primary" href="#u/${(us.find(u => unitPct(u) < 100) || us[0]).id}">Открыть</a><a class="btn small" href="#test/${l.id}">Тест уровня</a>` : '<span class="note-s">скоро</span>'}</div></div>`; }).join('')}</div>
      <h2>Как заниматься</h2>
      <ol><li><b>По порядку.</b> Задания в уроке открываются друг за другом — от ${PASS} % в предыдущем. Следующий урок — когда этот пройден в среднем на ${PASS} %. Пропустить можно паролем админа.</li><li><b>Теория → упражнения.</b> Прочитайте теорию и «Не путай», потом упражнения. Ошиблись — прочитайте пояснение и нажмите «Ещё раз».</li>
      <li><b>Конструктор предложений</b> есть почти в каждом уроке: английское предложение строится по схеме <i class="en">кто — делает — что — где — когда</i>. Соберите сто таких — и порядок слов станет привычкой.</li>
      <li><b>Словарь — через использование.</b> Добавляйте слова урока и из текстов, тренируйте каждый день (5–10 минут) и пишите с ними свои предложения. Слово, которое вы использовали 3–5 раз, остаётся надолго.</li>
      <li><b>Письмо.</b> Пишите сами, потом сравнивайте с примером. Ошибки — нормально: это материал для следующего раза.</li>
      <li><b>Сериалы.</b> С B1 в уроках есть цитаты и шутки. Посмотрите сцену с английскими субтитрами, потом без них.</li></ol>
      <p class="note-s">Прогресс, словарь и ачивки сохраняются в вашем аккаунте на сайте (и на этом устройстве).</p>
      <p class="note-s">Имя в учебнике: <b>${esc((S.name || {}).en || '—')}</b>${(S.name || {}).ru ? ' / ' + esc(S.name.ru) : ''} · <button type="button" class="btn small" data-name>Изменить</button></p>
      <div id="access"></div>
      <details class="pw reset"><summary>Сбросить учебник</summary><p class="note-s">Весь прогресс, словарь, ачивки и тексты удалятся — на всех устройствах. Нужен пароль админа и два подтверждения.</p><form data-pwf="reset"><input type="password" inputmode="numeric" autocomplete="current-password" placeholder="пароль (PIN) админа" aria-label="пароль админа"><button class="btn small">Сбросить всё</button><span class="note-s" data-pwm></span></form></details>`;
    view.innerHTML = h;
    if (location.protocol !== 'file:') accessPanel();
  }

  function testPage(lv) { // тест уровня: грамматика, чтение, понимание (книга и сериалы), слушание, говорение
    const us = unitsOf(lv), first = us[0];
    if (first && !unitOpen(first)) { view.innerHTML = `<div class="uhead"><div class="lv">Уровень ${lv}</div><h2>🔒 Тест уровня ${lv}</h2></div>${crow(crowPick('lock'))}<p>Тест откроется вместе с первым уроком уровня ${lv}.</p>${pwHTML(first.id, 'уровень')}`; return; }
    const from = (u, tag) => groupsOf(u, tag).flatMap(g => g.q.map((s, i) => ({ ...parse(g.t, s), ref: `${u.id}-${tag}#${i}` })));
    const gram = shuffle(us.flatMap(u => (u.ex || []).flatMap((e, k) => ['gap', 'choice', 'fix'].includes(e.t) ? from(u, 'e' + k) : []))).slice(0, 8);
    const read = shuffle(us.filter(u => u.read).flatMap(u => from(u, 'r'))).slice(0, 4);
    const und = shuffle([...us.filter(u => bookOf(u)).flatMap(u => from(u, 'b').filter(x => x.t !== 'mk')), ...us.filter(u => u.series).flatMap(u => from(u, 's'))]).slice(0, 4);
    const ws = shuffle(us.flatMap(u => u.words || []).filter(w => !/[\/…]/.test(w[0]))), trs = ws.map(w => w[1]);
    const sents = shuffle(us.flatMap(u => (u.exm || []).map(x => x[0])).filter(x => x.split(' ').length <= 12));
    const lsn = [...sents.slice(0, 2).map(x => ({ t: 'ls', p: [x, x] })), ...ws.slice(0, 2).map(w => ({ t: 'lc', p: [w[0], w[1], ...shuffle(trs.filter(x => x !== w[1])).slice(0, 2)] }))];
    const trI = shuffle(us.flatMap(u => (u.ex || []).filter(e => e.t === 'tr').flatMap(e => e.q.map(q => parse('tr', q))))).slice(0, 2);
    const spk = [...trI.map(x => ({ t: 'sp', p: [x.p[0], ...x.p.slice(1)], why: x.why })), ...sents.slice(2, 3).map(x => ({ t: 'sp', p: [x, x] }))];
    const sec = (h, items) => items.length ? grouped(items).map((g, i) => ({ ...g, h: (i ? '' : `<b>${h}.</b> `) + HOW[g.t] })) : [];
    const groups = [...sec('Грамматика', gram), ...sec('Чтение', read), ...sec('Понимание: книга и сериалы', und), ...sec('Слушание', lsn), ...sec('Говорение', spk)];
    view.innerHTML = `<div class="uhead"><div class="lv">Уровень ${lv}</div><h2>Тест уровня ${lv}</h2><p class="sub">Грамматика, чтение, понимание, слушание и говорение — задания из уроков уровня, каждый раз новые. От 85 % уровень можно считать пройденным: откроются все его уроки и следующий уровень.</p></div>
      ${crow('Экзамен. Я надела строгие перья. Без паники: всё это уже было в уроках.')}
      ${blockHTML('lt-' + lv, 'Тест ' + lv, groups)}<p><a class="btn" href="#test/${lv}" data-retest>Новый набор вопросов</a> <a class="btn" href="#home">На главную</a></p>`;
  }
  function fixPage() {
    const weak = weakUnits(), types = Object.entries(S.m).filter(([k, v]) => k.startsWith('t:') && v[1] >= 5).map(([k, v]) => [k.slice(2), v[0] / v[1]]).sort((a, b) => b[1] - a[1]);
    const items = fixItems(null, 10); const u0 = (weak[0] || [])[0];
    if (u0) items.push(...mkAuto(u0).slice(0, 2));
    view.innerHTML = `<div class="uhead"><div class="lv">Справочник</div><h2>Работа над ошибками</h2><p class="sub">Задания, где были ошибки, — в новой форме, и новые задания по темам, где ошибок больше всего. Каждый раз набор новый.</p></div>
      ${crow(crowPick('fix'))}
      ${weak.length ? `<h3>Где ошибок больше всего</h3><ul>${weak.slice(0, 6).map(([u, r]) => `<li><a href="#u/${u.id}">${esc(u.lvl + ' · ' + u.t)}</a> — ${Math.round(r * 100)} % ответов с ошибкой</li>`).join('')}</ul>` : ''}
      ${types.length ? `<p class="note-s">По типам заданий: ${types.map(([t, r]) => `${esc(NAMES_T[t] || t)} — ${Math.round(r * 100)} %`).join(' · ')}</p>` : ''}
      ${items.length ? blockHTML('fx-all', 'Набор по слабым местам', grouped(items)) + `<p><a class="btn" href="#fix" data-retest>Новый набор</a></p>` : '<p>Ошибок пока нет. Невермор разочарована: ей некого поучать.</p>'}`;
  }
  function bookPage() {
    view.innerHTML = `<div class="uhead"><div class="lv">Книга курса</div><h2>Alice's Adventures in Wonderland</h2><p class="sub">Lewis Carroll, 1865 · ${BOOK.parts.length} частей — по одной в каждом уроке. Прочитано с заданиями: ${nBook()}.</p></div>
      ${PICS.front ? picHTML(PICS.front) : ''}
      ${crow('Книга про девочку, которая падает в нору, растёт, уменьшается и спорит с грибами. То есть обычная неделя взрослого человека.')}
      <ol class="booktoc">${BOOK.parts.map((bp, i) => { const u = byId(bp.u); if (!u) return ''; const done = isDone(u.id + '-b'); return `<li class="${done ? 'done' : ''}">${bp.h.length ? `<b>Chapter ${esc(bp.h.join(' · '))}</b><br>` : ''}${unitOpen(u) ? `<a href="#u/${u.id}">Часть ${i + 1}</a>` : `🔒 Часть ${i + 1}`} <span class="note-s">· урок ${esc(u.lvl + ' · ' + u.t)} · ${bp.n} слов${done ? ' · ✓' : ''}</span></li>`; }).join('')}</ol>
      <p class="note-s">Текст — Project Gutenberg (eBook #11), общественное достояние.</p>`;
  }
  function podsPage() {
    view.innerHTML = `<div class="uhead"><div class="lv">Справочник</div><h2>Подкасты</h2><p class="sub">Не учебные «повторите за диктором», а то, что слушают носители, — про странные факты, слова, дизайн, искусство, «Гарри Поттера» и сериалы. По уровням: начните со своего и поднимайтесь.</p></div>
      ${crow('Подкасты — это как я, только без перьев и с хорошим микрофоном. Слушайте в дороге, за рисованием, в очереди. С субтитрами, если есть, — не стыдно.')}
      ${LEVELS.map(l => (PODS[l.id] || []).length ? `<h3>${l.id} · ${esc(l.name)}</h3><ul class="pods">${PODS[l.id].map(podHTML).join('')}</ul>` : '').join('')}
      <p class="note-s">Ссылки открывают поиск подкаста в Spotify; он же есть в Apple Podcasts, YouTube и других приложениях.</p>`;
  }
  function etymPage() {
    view.innerHTML = `<div class="uhead"><div class="lv">Справочник</div><h2>Откуда слова</h2><p class="sub">Истории происхождения слов из уроков — странные, смешные и иногда неправдоподобные, но правдивые.</p></div>
      ${crow('Слова тоже откуда-то прилетели. Как и я — из Тауэра. Шучу. Наверное.')}
      ${LEVELS.map(l => { const xs = unitsOf(l.id).flatMap(u => [...((NOTES[u.id] || {}).etym || []).map(e => [u, e]), ...((NOTES[u.id] || {}).etb ? [[u, ['Кэрролл', NOTES[u.id].etb]]] : [])]); return xs.length ? `<h3>${l.id}</h3><div class="box etym">${xs.map(([u, [w, t]]) => `<p><b class="en">${esc(w)}</b> — ${fmt(t)} <a class="note-s" href="#u/${u.id}">урок</a></p>`).join('')}</div>` : ''; }).join('')}`;
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
      <form class="dict-tools" id="addf"><input name="w" placeholder="слово или выражение" required maxlength="60"><input name="tr" placeholder="перевод" maxlength="120"><button type="button" class="btn" data-xlate>Перевести</button><input name="ex" placeholder="пример (по желанию)" maxlength="240" style="flex:1"><button class="btn">Добавить</button></form><p class="note-s" id="xm"></p>
      ${all.length ? `<p><button type="button" class="btn" data-cards>🃏 Карточки${due.length ? ' (сначала к повторению)' : ''}</button></p><div class="cards" hidden>${cardsHTML([...due, ...all.filter(x => !due.includes(x))].slice(0, 40).map(([, v]) => v))}</div>` : ''}
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

  // ---------- пароль админа: пропустить урок/задание или сбросить учебник ----------
  // пароль = PIN админа сайта; проверяет сервер (/api/admin/pin/verify: 5 ошибок подряд — замок на час)
  async function pwSubmit(f) {
    const key = f.dataset.pwf, msg = $('[data-pwm]', f), pin = $('input', f).value.trim();
    if (!pin) { msg.textContent = 'Введите пароль'; return; }
    if (key === 'reset' && !(confirm('Точно сбросить весь учебник? Прогресс, словарь, ачивки и тексты удалятся.') && confirm('Совсем точно? Вернуть будет нельзя.'))) return;
    msg.textContent = 'Проверяю…';
    const r = await fetch('/api/admin/pin/verify', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ pin }) }).catch(() => null);
    if (!r || !r.ok) { const j = r ? await r.json().catch(() => ({})) : {}; msg.textContent = !r ? 'Нет связи с сайтом' : r.status === 429 ? `Много попыток — подождите ${j.minutes || 60} мин.` : r.status === 401 ? 'Войдите на сайт' : 'Неверный пароль'; return; }
    if (key === 'reset') { const nm = S.name, th = S.theme; S = fresh(Date.now()); S.name = nm; S.theme = th; try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { /* нет места */ } save(); location.hash = 'home'; route(); toast('🧹', 'Учебник сброшен', 'Всё с начала. Невермор уже точит клюв.', ''); return; }
    S.k[key] = Date.now(); save(); route();
  }
  // ---------- цветовая схема: S.theme (в аккаунте) + localStorage english-theme (сразу при загрузке, скрипт в shell.html) ----------
  const THEMES = [['', 'Лаванда', '#fbfaff', '#534ab7'], ['mint', 'Мята', '#f5fbf8', '#2a7a5f'], ['peach', 'Персик', '#fff8f3', '#b9532f'], ['sky', 'Небо', '#f5f9fe', '#2c69b0'],
    ['rose', 'Роза', '#fff7f9', '#ad3a66'], ['lemon', 'Лимон', '#fffdf1', '#806300'], ['night', 'Ночь', '#16132a', '#a49aff'], ['forest', 'Лес', '#141a17', '#7fd2a8']];
  function setTheme(t, keep) {
    if (!THEMES.some(x => x[0] === t)) t = '';
    if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
    try { if (t) localStorage.setItem('english-theme', t); else localStorage.removeItem('english-theme'); } catch (e) { /* без памяти браузера */ }
    if (!keep && (S.theme || '') !== t) { S.theme = t; save(); }
    for (const b of $$('[data-theme-set]')) b.classList.toggle('on', b.dataset.themeSet === t);
  }
  function themePanel() {
    const old = $('.themes'); if (old) { old.remove(); return; }
    const cur = document.documentElement.dataset.theme || '', box = document.createElement('div'); box.className = 'themes';
    box.innerHTML = `<h4>Пастельные</h4><div class="sw">${THEMES.slice(0, 6).map(sw).join('')}</div><h4 style="margin-top:10px">Тёмные</h4><div class="sw">${THEMES.slice(6).map(sw).join('')}</div>`;
    function sw([id, n, bg, ac]) { return `<button type="button" data-theme-set="${id}" class="${id === cur ? 'on' : ''}"><i style="background:linear-gradient(135deg, ${bg} 55%, ${ac} 55%)"></i>${n}</button>`; }
    document.body.append(box);
  }

  // имя при первом заходе (и «Изменить» на главной)
  function askName() {
    if ($('#namebox')) return;
    const nm = S.name || {}, box = document.createElement('div'); box.id = 'namebox';
    box.innerHTML = `<form class="namecard" data-namef>${crow('Кар! Давайте познакомимся. Как вас зовут? Имя появится в примерах, диалогах и смолтоках — вместо «Alina». Поменять можно потом на главной.')}
      <label>Имя латиницей — для английских текстов<input name="en" required maxlength="30" autocomplete="given-name" placeholder="Alina" value="${esc(nm.en || '')}"></label>
      <label>Имя по-русски — для русских пояснений (можно пусто)<input name="ru" maxlength="30" placeholder="Алина" value="${esc(nm.ru || '')}"></label>
      <p class="note-s" data-namem></p><button class="btn primary">Готово</button></form>`;
    document.body.append(box); $('input', box).focus();
  }
  function saveName(f) {
    const cap = x => x.trim().replace(/\s+/g, ' ').replace(/^./, c => c.toUpperCase());
    const en = cap(f.en.value), ru = cap(f.ru.value), m = $('[data-namem]', f);
    if (!/^[A-Za-z][A-Za-z -]{0,29}$/.test(en)) { m.textContent = 'Имя латиницей: только английские буквы, пробел и дефис.'; return; }
    if (ru && !/^[А-Яа-яЁё][А-Яа-яЁё -]{0,29}$/.test(ru)) { m.textContent = 'Имя по-русски: только русские буквы.'; return; }
    S.name = { en, ru }; save(); applyName(S.name); $('#namebox').remove(); route();
  }

  // доступ к учебнику для других птичек (только админ: /api/english/access отвечает 403 остальным — панель не показывается)
  async function accessPanel(nick, on) {
    const box = $('#access'); if (!box) return;
    const r = await fetch('/api/english/access', nick ? { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ nick, on }) } : { credentials: 'same-origin' }).catch(() => null);
    if (!r) return;
    if (!r.ok) { if (nick) { const m = $('[data-accm]', box); if (m) m.textContent = r.status === 404 ? 'Такого ника на сайте нет' : 'Не получилось — нужен вход админом с PIN'; } return; }
    const j = await r.json();
    box.innerHTML = `<div class="box access"><h4>🔑 Доступ к учебнику</h4><p class="note-s">Видно только вам. Впишите ник птички с сайта — у неё появится «🇬🇧 Учебник английского» в меню аватара, прогресс у каждого свой.</p>
      <form class="dict-tools" data-accf><input name="nick" placeholder="ник птички" maxlength="40" required><button class="btn small primary">Открыть доступ</button><span class="note-s" data-accm></span></form>
      ${j.list.length ? `<ul>${j.list.map(x => `<li><b>${esc(x.nick)}</b> <span class="note-s">с ${new Date(x.at).toLocaleDateString('ru-RU')}</span> <button type="button" class="btn small" data-accoff="${esc(x.nick)}">Закрыть</button></li>`).join('')}</ul>` : '<p class="note-s">Пока доступ только у вас.</p>'}</div>`;
  }

  // перевод для «Добавить своё слово»: сначала слова и подсказки учебника, потом — бесплатный онлайн-переводчик MyMemory
  function lex() {
    const L = {};
    for (const u of UNITS) { for (const [w, tr, ex] of u.words || []) for (const x of w.split(' / ')) L[x.toLowerCase()] = L[x.toLowerCase()] || [tr, ex]; for (const [w, tr] of Object.entries((u.read || {}).gl || {})) L[w.toLowerCase()] = L[w.toLowerCase()] || [tr, '']; for (const [w, tr] of Object.entries((NOTES[u.id] || {}).gl || {})) L[w.toLowerCase()] = L[w.toLowerCase()] || [tr, '']; }
    for (const [a, b, c, r] of EXTRA.irr || []) L[a.toLowerCase()] = L[a.toLowerCase()] || [r, ''];
    return L;
  }
  async function xlate() {
    const f = $('#addf'), w = f.w.value.trim(), m = $('#xm'); if (!w) { m.textContent = 'Сначала впишите слово'; return; }
    const L = lex(), k = w.toLowerCase(), hit = L[k] || L[k.replace(/(ies)$/, 'y')] || L[k.replace(/(es|s|ed|ing|d)$/, '')] || L[k.replace(/(ing|ed)$/, 'e')];
    if (hit) { f.tr.value = hit[0]; if (hit[1] && !f.ex.value) f.ex.value = hit[1]; m.textContent = 'Перевод — из учебника.'; return; }
    m.textContent = 'Ищу перевод…';
    try {
      const j = await (await fetch('https://api.mymemory.translated.net/get?langpair=en|ru&q=' + encodeURIComponent(w))).json();
      const tr = j && j.responseData && j.responseData.translatedText;
      if (tr && !/MYMEMORY|INVALID/i.test(tr)) { f.tr.value = tr.toLowerCase() === k ? '' : tr; m.textContent = 'Перевод — машинный (MyMemory), проверьте его.'; } else m.textContent = 'Перевод не нашёлся — впишите сами.';
    } catch (e) { m.textContent = 'Переводчик недоступен — впишите сами.'; }
  }

  // ---------- оглавление и поиск ----------
  function buildToc() {
    const lis = LEVELS.map(l => { const us = unitsOf(l.id); if (!us.length) return ''; return `<li class="lvl" data-lv="${l.id}"><button type="button" aria-expanded="false"><span class="lv">${l.id}</span><span class="t">${esc(l.name)}</span><span class="c" data-lp="${l.id}"></span></button><ul>
      ${us.map((u, i) => `<li><a href="#u/${u.id}" data-to="u/${u.id}"><span class="n">${l.id}.${i + 1}</span><span class="t">${esc(u.t)}</span><span class="c" data-up="${u.id}"></span></a></li>`).join('')}
      <li><a href="#test/${l.id}" data-to="test/${l.id}"><span class="n">✓</span><span class="t">Тест уровня ${l.id}</span></a></li></ul></li>`; }).join('');
    $('#toc').innerHTML = `<li><a href="#home" data-to="home"><span class="n">⌂</span><span class="t">Главная и прогресс</span></a></li><li class="part">Уровни</li>${lis}
      <li class="part">Справочник</li>
      <li><a href="#dict" data-to="dict"><span class="n">📒</span><span class="t">Мой словарь</span></a></li>
      <li><a href="#fix" data-to="fix"><span class="n">🩹</span><span class="t">Работа над ошибками</span></a></li>
      <li><a href="#book" data-to="book"><span class="n">🐇</span><span class="t">Книга: «Алиса»</span></a></li>
      <li><a href="#pods" data-to="pods"><span class="n">🎙</span><span class="t">Подкасты</span></a></li>
      <li><a href="#etym" data-to="etym"><span class="n">🔎</span><span class="t">Откуда слова</span></a></li>
      <li><a href="#conf" data-to="conf"><span class="n">⚠</span><span class="t">Не путай!</span></a></li>
      <li><a href="#irr" data-to="irr"><span class="n">🔤</span><span class="t">Неправильные глаголы</span></a></li>
      <li><a href="#series" data-to="series"><span class="n">📺</span><span class="t">Сериальный разговорник</span></a></li>
      <li><a href="#ach" data-to="ach"><span class="n">🏆</span><span class="t">Ачивки</span></a></li>
      <li><a href="#src" data-to="src"><span class="n">📚</span><span class="t">Источники</span></a></li>`;
  }
  const IDX = [];
  function buildIdx() { IDX.length = 0; for (const u of UNITS) {
    IDX.push([u.t + ' ' + (u.en || ''), u.lvl + ' · ' + u.t, 'урок', '#u/' + u.id]);
    for (const w of u.words || []) IDX.push([w[0] + ' ' + w[1], w[0] + ' — ' + w[1], 'слово · ' + u.lvl + ' · ' + u.t, '#u/' + u.id]);
    for (const s of u.series || []) IDX.push([s.q + ' ' + s.who, s.q, (SHOWS[s.show] || {}).name + ' · ' + u.lvl, '#u/' + u.id]);
    for (const e of (NOTES[u.id] || {}).etym || []) IDX.push([e[0] + ' происхождение', e[0], 'откуда слово · ' + u.lvl, '#u/' + u.id]);
    for (const c of u.conf || []) IDX.push([c[0].replace(/[*_]/g, ''), c[0].replace(/[*_]/g, ''), 'не путай · ' + u.lvl, '#u/' + u.id]);
  } }
  buildIdx(); idxOn = true;
  $('#q').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    $('#hits').innerHTML = q.length < 2 ? '' : IDX.filter(x => x[0].toLowerCase().includes(q)).slice(0, 12).map(x => `<li><a href="${x[3]}">${esc(x[1])}<small>${esc(x[2])}</small></a></li>`).join('') || '<li class="note-s">Ничего не нашлось</li>';
  });

  // ---------- маршрут ----------
  function route() {
    const h = location.hash.slice(1) || 'home';
    tip.hidden = true; if (canSay) speechSynthesis.cancel();
    const [a, b, c] = h.split('/');
    if (a === 'u' && byId(b)) unitPage(byId(b));
    else if (a === 'test' && LEVELS.some(l => l.id === b)) testPage(b);
    else if (a === 'dict') dictPage();
    else if (a === 'ach') achPage();
    else if (a === 'conf') confPage();
    else if (a === 'series') seriesPage();
    else if (a === 'irr') irrPage();
    else if (a === 'src') srcPage();
    else if (a === 'fix') fixPage();
    else if (a === 'book') bookPage();
    else if (a === 'etym') etymPage();
    else if (a === 'pods') podsPage();
    else homePage();
    if (a !== 'u') delete view.dataset.unit;
    for (const x of $$('#toc a')) x.classList.toggle('on', x.dataset.to === h);
    const lv = a === 'u' && byId(b) ? byId(b).lvl : a === 'test' ? b : '';
    for (const li of $$('#toc li.lvl')) if (li.dataset.lv === lv) { li.classList.add('open'); $('button', li).setAttribute('aria-expanded', 'true'); }
    document.body.classList.remove('nav');
    scrollTo({ top: 0, behavior: 'instant' });
    refresh();
    if (a === 'u' && c === 'go' && byId(b)) goNext(byId(b));
  }
  function goNext(u) { // к первому открытому, но ещё не пройденному заданию урока
    history.replaceState(null, '', '#u/' + u.id);
    for (const x of $$('#toc a')) x.classList.toggle('on', x.dataset.to === 'u/' + u.id);
    const id = blocksOf(u).find(x => blockOpen(x) && (S.d[x] || 0) < PASS);
    const el = id && ($(`[data-b="${id}"]`, view) || $(`[data-w="${id}"]`, view));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  addEventListener('hashchange', route);

  // ---------- события ----------
  document.addEventListener('click', e => {
    const t = e.target;
    if (!t.closest('.themes, #themeb')) { const tp = $('.themes'); if (tp) tp.remove(); } // панель тем закрывается любым кликом мимо
    const fh = t.closest('.exb > header[data-fold], .write.fold > h3, .write .wfold');
    if (fh && !t.closest('button:not(.wfold)')) { const box = fh.closest('.exb, .write'); if (box.classList.contains('fold') || box.classList.contains('foldable') || (S.d[box.dataset.b || box.dataset.w] || 0) >= PASS) box.classList.toggle('fold'); return; }
    const tb = t.closest('[data-tobook]'); if (tb) { e.preventDefault(); const el = $('#book'); if (el) el.scrollIntoView({ behavior: 'smooth' }); return; }
    const mic = t.closest('[data-mic]'); if (mic) { listen(mic); return; }
    const sb = t.closest('[data-say]'); if (sb) { say(sb.dataset.say, sb.dataset.slow !== undefined); return; }
    const lvb = t.closest('#toc li.lvl > button'); if (lvb) { const li = lvb.parentElement; li.classList.toggle('open'); lvb.setAttribute('aria-expanded', li.classList.contains('open')); return; }
    if (t.closest('[data-retest]')) { e.preventDefault(); route(); return; }
    const act = t.closest('[data-act]');
    if (act) {
      const sec = act.closest('.exb');
      if (act.dataset.act === 'check') check(sec);
      else if (act.dataset.act === 'again') again(sec);
      else if (act.dataset.act === 'fold') { sec.classList.add('fold'); sec.scrollIntoView({ block: 'nearest' }); }
      else if (act.dataset.act === 'self') { const li = act.closest('li'), it = (BLOCKS[sec.dataset.b] || [])[+li.dataset.n]; if (it && it.t === 'mk') mkCredit(it, $('textarea', li).value.trim()); if (it && it.ref && S.x[it.ref]) mark(it, true); li.classList.remove('no'); li.classList.add('ok'); act.replaceWith(Object.assign(document.createElement('b'), { className: 'ok selfok', textContent: ' ✓ засчитано' })); storeAns(sec); setResult(sec, score(sec)); }
      return;
    }
    const tok = t.closest('.tok');
    if (tok && !tok.disabled) { const li = tok.closest('li'); (tok.parentElement.classList.contains('pool') ? $('.built', li) : $('.pool', li)).append(tok); return; }
    const aw = t.closest('[data-addw]');
    if (aw) { const u = byId(view.dataset.unit); const w = u.words.find(x => x[0] === aw.dataset.addw); addWord(w[0], w[1], w[2], u.id); aw.outerHTML = '<span class="in-dict">в словаре ✓</span>'; return; }
    if (t.closest('[data-addall]')) { const u = byId(view.dataset.unit); let n = 0; for (const w of u.words) if (addWord(w[0], w[1], w[2], u.id)) n++; for (const b of $$('[data-addw]')) b.outerHTML = '<span class="in-dict">в словаре ✓</span>'; t.textContent = n ? `Добавлено слов: ${n} ✓` : 'Все слова уже в словаре ✓'; return; }
    const sub = t.closest('[data-submit]'); if (sub) { submit(sub.dataset.submit); return; }
    const fc = t.closest('[data-flip]'); if (fc) { fc.classList.toggle('on'); if (fc.classList.contains('on')) say($('.f b', fc).textContent); return; }
    const cd = t.closest('[data-cards]'); if (cd) { const box = cd.closest('section, .col').querySelector('.cards'); if (box) { box.hidden = !box.hidden; cd.classList.toggle('primary', !box.hidden); } return; }
    if (t.closest('[data-xlate]')) { xlate(); return; }
    if (t.closest('[data-name]')) { askName(); return; }
    if (t.closest('#themeb')) { themePanel(); return; }
    const ts = t.closest('[data-theme-set]'); if (ts) { setTheme(ts.dataset.themeSet); return; }
    const ao = t.closest('[data-accoff]'); if (ao) { if (confirm(`Закрыть учебник для ${ao.dataset.accoff}?`)) accessPanel(ao.dataset.accoff, false); return; }
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
    if (e.target.dataset.pwf) { e.preventDefault(); pwSubmit(e.target); return; }
    if (e.target.dataset.namef !== undefined) { e.preventDefault(); saveName(e.target); return; }
    if (e.target.dataset.accf !== undefined) { e.preventDefault(); accessPanel(e.target.nick.value.trim(), true); return; }
    if (e.target.id !== 'addf') return; e.preventDefault();
    const f = new FormData(e.target); if (addWord(f.get('w'), f.get('tr'), f.get('ex'), 'моё')) dictPage(); else alert('Такое слово уже есть в словаре');
  });

  window.EN_DEBUG = { BLOCKS, state: () => S }; // для tools/english_check.js
  buildToc(); route();
  fetch('/api/english', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(j => { const sv = (j && j.state) || {}; S = Object.assign(fresh(RESET_AT), merge(S, sv)); /* недостающие разделы — пустыми */ if ((sv.rv || 0) !== S.rv) save(); /* сброс записываем на сервер один раз — дальше прогресс копится как обычно */ try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { /* нет места */ } saveEl.textContent = 'синхронизировано'; synced = true; applyName(S.name); if (S.theme !== undefined) setTheme(S.theme, true); route(); if (!S.name) askName(); })
    .catch(() => { online = location.protocol !== 'file:'; saveEl.textContent = 'сохранено на этом устройстве'; synced = true; refresh(); if (!S.name) askName(); });
})();
