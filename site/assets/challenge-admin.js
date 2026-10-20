// Кабинет → «🎨 Темы челленджа» (admin.js открывает PPChallengeAdmin.mount(main)): календарь на год вперёд (D.ahead месяцев), «В цвете / Ч/Б»;
// окно дня (без прокрутки) — тема RU/EN/LV, цвета: 1–5 базовых по одному или гармония на цветовом круге (можно поворачивать); время и Ч/Б-указание — под «Ещё»; в день ЭКСТРА — палитра и Ч/Б-условие;
// «🌐 Перевести», «🎲 Другой предмет», «⇄ Поменять с днём…», «↩ Вернуть как было». Сервер — /api/admin/challenge/* (worker/challenge-days.js), docs/challenge.md.
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body) => {
    const r = await fetch('/api/admin/challenge' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error || r.status });
    return d;
  };
  const ERR = { none: 'Больше нет предметов, которые подходят по правилам.', colors: 'Нужно от 1 до 5 разных цветов.', subject: 'Впишите предмет хотя бы на одном языке.', orig: 'Нечего возвращать.', admin: 'Это может только админ.', auth: 'Войдите через Google.' };
  const errText = e => ERR[e.code] || 'Не получилось (' + (e.code || e.message) + ').';
  const L3 = ['en', 'ru', 'lv'], LI = { en: 0, ru: 1, lv: 2 };
  const CAT = { idea: 'слово-тема', life: 'из жизни', food: 'еда', drink: 'напиток', animal: 'животное', bird: 'птица', plant: 'растение', home: 'дом', clothes: 'одежда', transport: 'транспорт', place: 'место', nature: 'природа', weather: 'погода', tool: 'инструмент', toy: 'игрушка', music: 'музыка', fantasy: 'сказка', person: 'человек', holiday: 'праздник' };
  const POOL = { winter: '❄️ зима', spring: '🌷 весна', summer: '☀️ лето', autumn: '🍂 осень', none: 'без сезона', bday: '🎂 день рождения' };
  const DIF = { 1: 'простой', 2: 'средний', 3: 'сложный' };
  const RULE = { family: 'та же семья предметов была недавно', word: 'тот же предмет в соседние 3 дня (кружка и «кружка чая…»)', cat: 'та же категория, что у соседнего дня', window: 'мало разных категорий за неделю', deck: 'сложность не по колоде (3 простых, 3 средних, 1 сложный)', pool: 'не тот сезон' };
  const MON3 = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const MON = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  const pad = n => String(n).padStart(2, '0');
  const ymAdd = (ym, k) => { const t = +ym.slice(0, 4) * 12 + +ym.slice(5, 7) - 1 + k; return `${Math.floor(t / 12)}-${pad(t % 12 + 1)}`; };
  let main = null, D = null, ym = null, bw = false, thisMonth = null;
  try { bw = sessionStorage.getItem('pp-chadm-bw') === '1'; } catch (e) { /* без памяти */ }

  async function mount(el, m) {
    main = el; main.innerHTML = '<p class="be-note">Загрузка…</p>';
    if (!window.EXTRA_PALETTES) { const s = document.createElement('script'); s.src = '/api/extra-palettes.js'; document.head.appendChild(s); } // палитры дней ЭКСТРА
    await load(m || ym);
  }
  async function load(m) {
    try { D = await api(m ? '?m=' + m : ''); } catch (e) { main.innerHTML = `<p class="be-note">${errText(e)}</p>`; return; }
    ym = D.m; thisMonth = thisMonth || D.today.slice(0, 7);
    draw();
  }
  const sw = i => D.colors[i] ? `<i style="background:${D.colors[i].hex}" title="${esc(D.colors[i].n[1])}"></i>` : '';
  function palOf(day) { // палитра дня ЭКСТРА — очередь картин, месяц N (октябрь 2026 = 0) берёт N-ю
    const P = window.EXTRA_PALETTES; if (!P || !P.length) return null;
    const mi = +day.slice(0, 4) * 12 + +day.slice(5, 7) - 1 - (2026 * 12 + 9);
    return P[((mi % P.length) + P.length) % P.length];
  }
  function draw() {
    const first = (new Date(+ym.slice(0, 4), +ym.slice(5, 7) - 1, 1).getDay() + 6) % 7;
    const broken = Object.fromEntries(D.broken.map(b => [b.day, b.rules]));
    const months = Array.from({ length: (D.ahead || 1) + 1 }, (_, k) => ymAdd(thisMonth, k));
    const cells = D.days.map((d, i) => {
      const t = D.tags[i], works = D.works[d.day] || 0, n = +d.day.slice(8);
      const cls = ['chadm-day', d.day === D.today ? 'today' : '', d.day < D.today ? 'past' : '', d.edited ? 'edited' : '', d.day === D.last ? 'last' : '', d.extra ? 'extra' : '', broken[d.day] ? 'warn' : ''].filter(Boolean).join(' ');
      return `<button type="button" class="${cls}" data-day="${d.day}"><span class="chadm-n">${n}${d.edited ? ' ✏️' : ''}${d.day === D.last ? ' <b class="chadm-lastb">последний</b>' : ''}${d.extra ? ' ✦' : ''}${t.pool === 'bday' ? ' 🎂' : ''}${broken[d.day] ? ' ⚠' : ''}</span>
        <span class="chadm-s">${esc(d.subject[1] || d.subject[0])}</span>
        <span class="chadm-c">${bw ? `✒ ${esc(d.twist[1] || d.twist[0])}` : d.extra ? '🎨 палитра' : d.colors.map(sw).join('')}</span>
        ${works ? `<span class="chadm-w">${works} раб.</span>` : ''}</button>`;
    }).join('');
    main.innerHTML = `<section class="adm-box chadm">
      <div class="chadm-bar"><div class="ch-level chadm-months" role="group">${months.map(m => `<button type="button" data-m="${m}" aria-pressed="${m === ym}" title="${MON[+m.slice(5) - 1]} ${m.slice(0, 4)}">${MON3[+m.slice(5) - 1]}${m.slice(5) === '01' || m === thisMonth ? ' ' + m.slice(2, 4) : ''}</button>`).join('')}</div>
        <div class="ch-level" role="group"><button type="button" data-bw="0" aria-pressed="${!bw}">В цвете</button><button type="button" data-bw="1" aria-pressed="${bw}">Ч/Б</button></div></div>
      ${D.last ? `<p class="be-note chadm-lastn">Последний изменённый: <button type="button" class="pill-btn" data-last>${new Date(+D.last.slice(0, 4), +D.last.slice(5, 7) - 1, +D.last.slice(8)).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</button></p>` : ''}
      ${D.days.length ? `<div class="chadm-grid" lang="ru">${['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(x => `<span class="chadm-dow">${x}</span>`).join('')}${'<span></span>'.repeat(first)}${cells}</div>
      <p class="be-note">Нажмите на день, чтобы поправить тему. ✏️ — день правили вы (сиреневый), зелёный — последний изменённый, ✦ — день ЭКСТРА, ⚠ — день нарушает правило подбора (подробнее — в окне дня). ${D.broken.length ? `Нарушений в месяце: <b>${D.broken.length}</b>.` : 'Все дни подходят по правилам ✓'}</p>`
        : '<p class="be-note">Плана на этот месяц пока нет.</p>'}
      <p class="be-note">План следующего месяца создаётся сам 20-го числа; месяцы на год вперёд — когда вы их откроете здесь. Созданный месяц сам уже не меняется. Числа правил подбора — в «📜 Все правила» → «Тонкая настройка» → «🎨 Темы челленджа».</p></section>`;
    main.querySelectorAll('[data-m]').forEach(b => b.onclick = () => load(b.dataset.m));
    main.querySelectorAll('[data-bw]').forEach(b => b.onclick = () => { bw = b.dataset.bw === '1'; try { sessionStorage.setItem('pp-chadm-bw', bw ? '1' : ''); } catch (e) { /* без памяти */ } draw(); });
    main.querySelectorAll('[data-day]').forEach(b => b.onclick = () => dayDialog(b.dataset.day));
    const lb = main.querySelector('[data-last]'); if (lb) lb.onclick = () => D.last.slice(0, 7) === ym ? dayDialog(D.last) : load(D.last.slice(0, 7));
  }
  // ---------- окно дня ----------
  // базовые цвета — первые D.base (colors в challenge-data.js); оттенок из moreColors в окне показывается своим базовым (семья f или ближайший)
  const rgb = h => [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16));
  function toBase(k) {
    if (k < D.base) return k;
    const c = D.colors[k]; if (!c) return -1;
    const f = D.colors.slice(0, D.base).findIndex(b => b.n[0] === c.f);
    if (f >= 0) return f;
    const [r, g, b] = rgb(c.hex);
    let best = 0, bd = Infinity;
    for (let j = 0; j < D.base; j++) { const [r2, g2, b2] = rgb(D.colors[j].hex), dd = (r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2; if (dd < bd) { bd = dd; best = j; } }
    return best;
  }
  const baseCols = list => [...new Set(list.map(toBase).filter(k => k >= 0))];
  // цветовой круг (12 секторов по часовой, жёлтый сверху): 6 базовых + 6 промежуточных из moreColors; гармонии — сдвиги от главного цвета
  const WHEEL_N = ['yellow', 'olive', 'green', 'turquoise', 'blue', 'indigo', 'purple', 'fuchsia', 'red', 'coral', 'orange', 'ochre'];
  const HARM = [['mono', 'Монохромная', [0]], ['comp', 'Комплементарная', [0, 6]], ['analog', 'Аналоговая', [-1, 0, 1]], ['acomp', 'Аналогово-комплементарная', [-1, 0, 1, 6]],
    ['triad', 'Триада', [0, 4, 8]], ['split', 'Раздельно-комплементарная', [0, 5, 7]], ['tetrad', 'Тетрада', [0, 2, 6, 8]]];
  const wheelIdx = () => WHEEL_N.map(n => D.colors.findIndex(c => c.n[0] === n));
  const harmCols = (h, rot) => { const w = wheelIdx(); return (HARM.find(x => x[0] === h) || HARM[1])[2].map(o => w[((rot + o) % 12 + 12) % 12]); };
  function findHarm(list) { // цвета дня — это гармония на круге? → [гармония, поворот]
    const s = [...new Set(list)].sort().join();
    for (const [h] of HARM) for (let r = 0; r < 12; r++) if ([...new Set(harmCols(h, r))].sort().join() === s) return [h, r];
    return null;
  }
  // сектор кольца k (0 — сверху) и клин к центру для выбранных
  const pt = (a, r) => [100 + r * Math.sin(a), 100 - r * Math.cos(a)].map(v => v.toFixed(1)).join(' ');
  function wheelSvg(on, size) {
    const w = wheelIdx(), st = Math.PI / 6, R = 96, r = 60;
    const seg = k => { const a = k * st - st / 2, b = a + st; return `M${pt(a, R)} A${R} ${R} 0 0 1 ${pt(b, R)} L${pt(b, r)} A${r} ${r} 0 0 0 ${pt(a, r)}Z`; };
    const wedge = k => { const a = k * st - st / 2 + .04, b = a + st - .08; return `M100 100 L${pt(a, r - 2)} A${r - 2} ${r - 2} 0 0 1 ${pt(b, r - 2)}Z`; };
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" aria-hidden="true">${w.map((ci, k) => `<path d="${seg(k)}" fill="${(D.colors[ci] || {}).hex || '#ccc'}" data-k="${k}"${on.has(k) ? ' class="on"' : ''}/>`).join('')}
      ${[...on].map(k => `<path d="${wedge(k)}" fill="${(D.colors[w[k]] || {}).hex}" class="wg"/>`).join('')}</svg>`;
  }
  // перевод темы: с того языка, который правили последним (или с первого заполненного), на два других
  async function translate(texts, from) {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 45000);
    try {
      const r = await fetch('/api/admin/translate', { method: 'POST', credentials: 'same-origin', cache: 'no-store', signal: ctl.signal, headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ texts, from, to: L3.filter(l => l !== from), about: 'short' }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error || r.status });
      return d.tr || {};
    } catch (e) { if (e.name === 'AbortError') throw Object.assign(new Error('timeout'), { code: 'timeout' }); throw e; } finally { clearTimeout(timer); }
  }
  const TR_ERR = { no_key: 'нет ключа Gemini (⚙️ Сервис → Ключ Gemini)', bad_key: 'ключ Gemini не подходит', ai_limit: 'переводчик устал (лимит) — попробуйте позже', timeout: 'переводчик долго не отвечает — нажмите ещё раз' };
  function dayDialog(day) {
    const i = D.days.findIndex(x => x.day === day); if (i < 0) return;
    let d = D.days[i]; const t = D.tags[i], works = D.works[day] || 0, br = (D.broken.find(b => b.day === day) || {}).rules || [];
    const tried = [d.item];
    const dlg = document.createElement('dialog'); dlg.className = 'be-dialog adm-card-dlg chadm-dlg';
    const txt = (f, label) => `<fieldset class="chadm-f"><legend>${label}</legend>${['ru', 'en', 'lv'].map(l => `<label><span>${l.toUpperCase()}</span><input type="text" data-f="${f}" data-l="${l}"></label>`).join('')}</fieldset>`;
    const pal = d.extra ? palOf(day) : null;
    const dt = new Date(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8));
    dlg.innerHTML = `<h2>${dt.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: day.slice(0, 4) === D.today.slice(0, 4) ? undefined : 'numeric' })}${d.extra ? ' · ✦ ЭКСТРА' : ''}${t.pool === 'bday' ? ' · 🎂' : ''}</h2>
      ${works && day <= D.today ? `<p class="chadm-warn">⚠ Уже ${works} ${works % 10 === 1 && works % 100 !== 11 ? 'работа' : [2, 3, 4].includes(works % 10) && ![12, 13, 14].includes(works % 100) ? 'работы' : 'работ'} за этот день — у них тема поменяется.</p>` : ''}
      <p class="be-note chadm-tags" data-tags></p>
      <div class="adm-card-fields">
        ${txt('subject', 'Тема')}
        <p class="chadm-acts"><button type="button" class="pill-btn" data-a="tr"></button><button type="button" class="pill-btn" data-a="reroll">🎲 Другая тема</button>
          <button type="button" class="pill-btn" data-a="swap">⇄ Поменять с днём…</button><select data-swap hidden><option value="">— какой день? —</option>${D.days.filter(x => x.day !== day).map(x => `<option value="${x.day}">${+x.day.slice(8)} — ${esc(x.subject[1] || x.subject[0])}</option>`).join('')}</select>
          <button type="button" class="pill-btn" data-a="revert"${d.edited ? '' : ' hidden'}>↩ Вернуть как было</button></p>
        ${d.extra ? `<div class="chadm-pal"><b>Палитра дня ЭКСТРА</b>${pal ? `<span>${pal.c.map(c => `<i style="background:${c[0]}" title="${esc(c[2])}"></i>`).join('')}</span><small>«${esc(pal.t[1])}» — очередь палитр: 🎨 Картины и палитры</small>` : '<small>очередь палитр: 🎨 Картины и палитры</small>'}</div>`
        : `<fieldset class="chadm-f"><legend>Цвета дня</legend>
          <div class="ch-level chadm-mode" role="group"><button type="button" data-mode="one">По одному</button><button type="button" data-mode="harm">Гармония на круге</button></div>
          <div class="chadm-cols" data-one>${D.colors.slice(0, D.base).map((c, k) => `<button type="button" data-col="${k}" aria-pressed="false"><i style="background:${c.hex}"></i>${esc(c.n[1])}</button>`).join('')}</div>
          <div class="chadm-harm" data-harm hidden><div class="chadm-wheel"><div data-wheel title="Потяните или нажмите на цвет, чтобы повернуть"></div>
            <p><button type="button" class="pill-btn" data-rot="-1" aria-label="Повернуть против часовой">⟲</button><button type="button" class="pill-btn" data-rot="1" aria-label="Повернуть по часовой">⟳</button></p></div>
            <div class="chadm-hlist">${HARM.map(([h, n]) => `<button type="button" data-h="${h}" aria-pressed="false">${n}</button>`).join('')}</div></div>
          <p class="chadm-picked" data-picked></p></fieldset>`}
        <details><summary>Ещё: время, Ч/Б-указание${d.extra ? ', Ч/Б-условие ЭКСТРА' : ''}</summary><div>
          <label class="chadm-time">Время <select data-time>${D.times.map(x => `<option value="${x}">${x} мин</option>`).join('')}</select><small class="be-note">в режиме «Спокойно» — на 5 минут больше</small></label>
          ${txt('twist', 'Ч/Б-указание')}${d.extra ? txt('extra', 'Ч/Б-условие дня ЭКСТРА') : ''}</div></details>
      </div>
      <p class="be-dialog-acts"><button type="button" class="pill-btn pill-fill" data-a="save">💾 Сохранить</button><span class="be-note" data-st role="status"></span></p>`;
    document.body.appendChild(dlg);
    const q = s => dlg.querySelector(s), st = q('[data-st]'), trBtn = q('[data-a=tr]');
    let cols = [], from = 'ru', mode = 'one', harm = 'comp', rot = 0;
    const fs = ['subject']; // переводится только тема (Ч/Б-поля под «Ещё» правятся руками)
    const trLabel = () => { trBtn.textContent = `🌐 Перевести с ${from.toUpperCase()} на ${L3.filter(l => l !== from).map(l => l.toUpperCase()).join(' и ')}`; };
    function fill() {
      dlg.querySelectorAll('[data-f]').forEach(inp => { const v = d[inp.dataset.f]; inp.value = v ? v[LI[inp.dataset.l]] || '' : ''; });
      const fh = findHarm(d.colors);
      if (fh) { mode = 'harm'; [harm, rot] = fh; cols = harmCols(harm, rot); } else { mode = 'one'; cols = baseCols(d.colors); }
      paintCols();
      q('[data-time]').value = String(d.time);
      q('[data-a=revert]').hidden = !d.edited;
      from = 'ru'; trLabel();
      const tg = D.tags[i];
      q('[data-tags]').innerHTML = `${esc(POOL[tg.pool] || tg.pool)} · ${esc(CAT[tg.c] || tg.c)} · ${DIF[tg.d] || '—'} · семья «${esc(tg.f)}»${br.length ? `<br><span class="chadm-warn">⚠ ${br.map(r => RULE[r] || r).join('; ')}</span>` : ''}`;
    }
    function paintCols() {
      if (d.extra) return;
      dlg.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode));
      q('[data-one]').hidden = mode !== 'one'; q('[data-harm]').hidden = mode !== 'harm';
      dlg.querySelectorAll('[data-col]').forEach(b => b.setAttribute('aria-pressed', cols.includes(+b.dataset.col)));
      dlg.querySelectorAll('[data-h]').forEach(b => b.setAttribute('aria-pressed', b.dataset.h === harm));
      if (mode === 'harm') { const w = wheelIdx(); q('[data-wheel]').innerHTML = wheelSvg(new Set(cols.map(c => w.indexOf(c))), 150); }
      q('[data-picked]').innerHTML = cols.length ? cols.map(c => `<span><i style="background:${D.colors[c].hex}"></i>${esc(D.colors[c].n[1])}</span>`).join('') : 'цвета не выбраны';
    }
    const setHarm = () => { cols = harmCols(harm, rot); paintCols(); };
    dlg.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
      if (b.dataset.mode === mode) return;
      mode = b.dataset.mode;
      if (mode === 'one') { cols = baseCols(cols); paintCols(); return; }
      const k = wheelIdx().indexOf(cols[0]); if (k >= 0) rot = k; setHarm();
    });
    dlg.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { harm = b.dataset.h; setHarm(); });
    dlg.querySelectorAll('[data-rot]').forEach(b => b.onclick = () => { rot = (rot + +b.dataset.rot + 12) % 12; setHarm(); });
    // круг можно тянуть: главный цвет гармонии встаёт в сектор под пальцем (второй выбранный цвет — со своим сдвигом)
    const wh = q('[data-wheel]');
    if (wh) {
      let drag = null;
      const sector = e => { const r = wh.getBoundingClientRect(), a = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2)); return ((Math.round(a / (Math.PI / 6)) % 12) + 12) % 12; };
      wh.addEventListener('pointerdown', e => { e.preventDefault(); wh.setPointerCapture(e.pointerId); const k = sector(e); drag = { k, rot }; });
      wh.addEventListener('pointermove', e => { if (!drag) return; const n = (drag.rot + sector(e) - drag.k + 12) % 12; if (n !== rot) { rot = n; setHarm(); } });
      const end = e => { if (!drag) return; if (sector(e) === drag.k && rot === drag.rot) { rot = drag.k; setHarm(); } drag = null; };
      wh.addEventListener('pointerup', end); wh.addEventListener('pointercancel', () => { drag = null; });
    }
    dlg.querySelectorAll('[data-col]').forEach(b => b.onclick = () => {
      const k = +b.dataset.col;
      if (cols.includes(k)) cols = cols.filter(x => x !== k); else if (cols.length < 5) cols.push(k); else { cols.shift(); cols.push(k); }
      paintCols();
    });
    // какой язык темы правили — с него и переводим
    dlg.querySelectorAll('[data-f="subject"]').forEach(inp => inp.addEventListener('input', () => { from = inp.dataset.l; trLabel(); }));
    const val = f => L3.map(l => (q(`[data-f="${f}"][data-l="${l}"]`) || {}).value || '');
    trBtn.onclick = async () => {
      const src = val('subject')[LI[from]].trim() ? from : ['ru', 'en', 'lv'].find(l => val('subject')[LI[l]].trim());
      if (!src) { st.textContent = '⚠ Сначала впишите тему хотя бы на одном языке.'; return; }
      from = src; trLabel();
      const texts = fs.map(f => val(f)[LI[src]]);
      trBtn.disabled = true; trBtn.textContent = '🌐 Перевожу…'; st.textContent = '';
      try {
        const tr = await translate(texts, src), miss = L3.filter(l => l !== src && !tr[l]);
        for (const l of Object.keys(tr)) fs.forEach((f, k) => { const inp = q(`[data-f="${f}"][data-l="${l}"]`); if (inp && texts[k].trim() && tr[l][k]) inp.value = tr[l][k]; });
        st.textContent = miss.length ? `⚠ Не перевелось на ${miss.map(l => l.toUpperCase()).join(', ')} — нажмите ещё раз или впишите руками.` : '✓ Переведено — проверьте и сохраните';
      } catch (e) { st.textContent = '⚠ Не получилось перевести: ' + (TR_ERR[e.code] || e.code || e.message) + '.'; }
      trBtn.disabled = false; trLabel();
    };
    const after = r => { // ответ сервера → обновить месяц (теги, нарушения) и окно
      st.textContent = '✓ Сохранено';
      return api('?m=' + ym).then(x => { D = x; d = D.days[i]; tagsNow(); fill(); draw(); });
    };
    const tagsNow = () => { br.length = 0; br.push(...((D.broken.find(b => b.day === day) || {}).rules || [])); };
    const acts = () => dlg.querySelectorAll('button:not([data-a=tr])');
    const run = async (fn) => { st.textContent = '…'; acts().forEach(b => b.disabled = true); try { await fn(); } catch (e) { st.textContent = '⚠ ' + errText(e); } acts().forEach(b => b.disabled = false); };
    q('[data-a=save]').onclick = () => run(async () => {
      if (!d.extra && (cols.length < 1 || cols.length > 5)) throw Object.assign(new Error('colors'), { code: 'colors' });
      const body = { day, subject: val('subject'), twist: val('twist'), time: +q('[data-time]').value };
      if (d.extra) body.extra = val('extra'); else body.colors = cols;
      await api('/day', body);
      D = await api('?m=' + ym); draw(); dlg.close(); // сохранено — окно закрывается, календарь уже с новой темой
    });
    q('[data-a=reroll]').onclick = () => run(async () => { const r = await api('/reroll', { day, exclude: tried }); tried.push(r.day.item); await after(r); });
    q('[data-a=swap]').onclick = () => { const s = q('[data-swap]'); s.hidden = false; s.focus(); };
    q('[data-swap]').onchange = e => { const w = e.target.value; if (!w) return; run(async () => { await after(await api('/swap', { day, with: w })); e.target.value = ''; e.target.hidden = true; }); };
    q('[data-a=revert]').onclick = () => run(async () => { await after(await api('/revert', { day })); });
    dlg.addEventListener('close', () => dlg.remove());
    fill(); dlg.showModal();
  }
  window.PPChallengeAdmin = { mount };
})();
