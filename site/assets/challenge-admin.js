// Кабинет → «🎨 Темы челленджа» (admin.js открывает PPChallengeAdmin.mount(main)): календарь на год вперёд (D.ahead месяцев);
// окно дня (без прокрутки) — тема RU/EN/LV, цвета: 1–5 базовых по одному или гармония на цветовом круге (можно поворачивать); время — под «Ещё» (Ч/Б — без условий, не правится); в день ЭКСТРА — палитра и Ч/Б-условие;
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
  // Ч/Б с 20.10.2026 — без условий, в календаре кабинета смотреть нечего (переключатель убран)

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
    const yr = +ym.slice(0, 4), maxM = ymAdd(thisMonth, D.ahead || 1), minY = 2026, maxY = +maxM.slice(0, 4);
    const cells = D.days.map((d, i) => {
      const t = D.tags[i], works = D.works[d.day] || 0, n = +d.day.slice(8);
      const cls = ['chadm-day', d.day === D.today ? 'today' : '', d.day < D.today ? 'past' : '', d.edited ? 'edited' : '', d.day === D.last ? 'last' : '', d.extra ? 'extra' : '', broken[d.day] ? 'warn' : ''].filter(Boolean).join(' ');
      return `<button type="button" class="${cls}" data-day="${d.day}"><span class="chadm-n">${n}${d.edited ? ' ✏️' : ''}${d.day === D.last ? ' <b class="chadm-lastb">последний</b>' : ''}${d.day === D.today ? ' <b class="chadm-todayb">сегодня</b>' : ''}${d.extra ? ' ✦' : ''}${t.pool === 'bday' ? ' 🎂' : ''}${broken[d.day] ? ' ⚠' : ''}</span>
        <span class="chadm-s">${d.subject.some(x => x) ? esc(d.subject[1] || d.subject[0] || d.subject[2]) : '<i class="chadm-empty">пусто</i>'}</span>
        <span class="chadm-c">${bw ? '✒ Ч/Б' : d.extra ? '🎨 палитра' : d.colors.map(sw).join('')}</span>
        ${works ? `<span class="chadm-w">${works} раб.</span>` : ''}</button>`;
    }).join('');
    main.innerHTML = `<section class="adm-box chadm">
      <div class="chadm-bar"><div class="chadm-ym"><select class="chadm-year" data-y aria-label="Год">${Array.from({ length: maxY - minY + 1 }, (_, k) => minY + k).map(y => `<option value="${y}"${y === yr ? ' selected' : ''}>${y}</option>`).join('')}</select>
        <div class="ch-level chadm-months" role="group">${MON3.map((n, k) => { const m = `${yr}-${pad(k + 1)}`; return `<button type="button" data-m="${m}" aria-pressed="${m === ym}"${m < '2026-10' || m > maxM ? ' disabled' : ''}${m === thisMonth ? ' class="now"' : ''} title="${MON[k]} ${yr}">${n}</button>`; }).join('')}</div></div>
        <span class="chadm-tools"><button type="button" class="pill-btn" data-now${ym === thisMonth ? ' disabled' : ''}>📅 Сегодня</button>
        <button type="button" class="pill-btn" data-bank>📚 Банк тем</button><button type="button" class="pill-btn" data-fill>📚 Заполнить месяц из банка</button></span></div>
      ${D.last ? `<p class="be-note chadm-lastn">Последний изменённый: <button type="button" class="pill-btn" data-last>${new Date(+D.last.slice(0, 4), +D.last.slice(5, 7) - 1, +D.last.slice(8)).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</button></p>` : ''}
      ${D.days.length ? `<div class="chadm-grid" lang="ru">${['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(x => `<span class="chadm-dow">${x}</span>`).join('')}${'<span></span>'.repeat(first)}${cells}</div>
      <p class="be-note">Нажмите на день, чтобы поправить тему. ✏️ — день правили вы, зелёный — последний изменённый, фиолетовый — сегодня, ✦ — день ЭКСТРА, ⚠ — день нарушает правило подбора (подробнее — в окне дня). ${D.broken.length ? `Нарушений в месяце: <b>${D.broken.length}</b>.` : 'Все дни подходят по правилам ✓'}</p>`
        : '<p class="be-note">Плана на этот месяц пока нет.</p>'}
      <p class="be-note">С 1 декабря 2026 дни пустые — темы и цвета заполняете вы. Если к 23:00 (за час до начала дня) день остался пустым, тема и цвета подберутся сами по прежним правилам. Числа правил подбора — в «📜 Все правила» → «Тонкая настройка» → «🎨 Темы челленджа».</p></section>`;
    main.querySelectorAll('[data-m]').forEach(b => b.onclick = () => load(b.dataset.m));
    main.querySelector('[data-y]').onchange = e => { // другой год — тот же месяц (в пределах, где можно)
      let m = `${e.target.value}-${ym.slice(5)}`; if (m < '2026-10') m = '2026-10'; if (m > maxM) m = maxM; load(m);
    };
    main.querySelector('[data-bank]').onclick = () => bankDialog();
    main.querySelector('[data-now]').onclick = () => load(thisMonth); // назад к текущему месяцу
    main.querySelector('[data-fill]').onclick = async e => { // пустые дни месяца (с сегодня) — темами из банка
      const n = D.days.filter(d => d.day >= D.today && !d.subject.some(x => x)).length;
      if (!n) { alert('В этом месяце нет пустых дней (прошедшие не заполняются).'); return; }
      if (!confirm(`Заполнить пустые дни (${n}) темами из банка? Уже заполненные дни не изменятся, цвета можно выбрать потом.`)) return;
      e.target.disabled = true;
      try { const r = await api('/fillmonth', { m: ym }); await load(ym); alert(r.filled ? `Заполнено дней: ${r.filled}${r.filled < r.empty ? ` из ${r.empty} — в банке не хватило тем (тема не ставится ближе 60 дней к той же).` : '.'}` : 'В банке нет подходящих тем — добавьте их в «📚 Банк тем».'); }
      catch (er) { alert(errText(er)); e.target.disabled = false; }
    };
    main.querySelectorAll('[data-day]').forEach(b => b.onclick = () => dayDialog(b.dataset.day));
    const lb = main.querySelector('[data-last]'); if (lb) lb.onclick = () => D.last.slice(0, 7) === ym ? dayDialog(D.last) : load(D.last.slice(0, 7));
  }
  // ---------- банк тем: темы правленных дней (сервер держит банк за днями) + добавленные прямо в банк ----------
  const bankLoad = () => api('/bank').then(x => x.items);
  const dShort = k => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8)).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  async function bankDialog() {
    const dlg = document.createElement('dialog'); dlg.className = 'be-dialog adm-card-dlg chadm-dlg chadm-bank';
    dlg.innerHTML = `<button type="button" class="chadm-x" data-x aria-label="Закрыть">✕</button><h2>📚 Банк тем</h2>
      <p class="be-note">Сюда сами попадают темы всех дней, которые вы заполнили; поменяли или стёрли тему в дне — она уходит и отсюда. Взять тему в день — «📚 Из банка».</p>
      <fieldset class="chadm-f chadm-badd"><legend>Добавить тему в банк</legend>${['ru', 'en', 'lv'].map(l => `<label><span>${l.toUpperCase()}</span><input type="text" data-n="${l}"></label>`).join('')}
        <p class="chadm-acts"><button type="button" class="pill-btn" data-ntr>🌐 Перевести</button><button type="button" class="pill-btn pill-fill" data-nadd>➕ Добавить</button><span class="be-note" data-nst></span></p></fieldset>
      <input type="search" placeholder="Найти тему…" data-q class="chadm-bq"><div class="chadm-blist" data-list><p class="be-note">Загрузка…</p></div>`;
    document.body.appendChild(dlg); dlg.addEventListener('close', () => dlg.remove()); dlg.querySelector('[data-x]').onclick = () => dlg.close(); dlg.showModal();
    let items = [];
    const paint = () => {
      const f = dlg.querySelector('[data-q]').value.trim().toLowerCase();
      const list = items.filter(r => !f || [r.ru, r.en, r.lv].some(x => String(x || '').toLowerCase().includes(f)));
      dlg.querySelector('[data-list]').innerHTML = list.length ? `<p class="be-note">Тем: <b>${list.length}</b></p>` + list.map(r => `<div class="chadm-bi"><div><b>${esc(r.ru || r.en || r.lv)}</b><small>${esc(r.en)} · ${esc(r.lv)}</small>
        <small>добавлена ${dShort(new Date(r.created_at * 1000).toLocaleDateString('sv-SE'))} · ${r.days.length ? 'стоит: ' + r.days.map(dShort).join(', ') : 'сейчас ни в одном дне'}</small></div><button type="button" class="pill-btn" data-del="${r.id}" title="Удалить из банка">🗑</button></div>`).join('')
        : `<p class="be-note">${items.length ? 'Ничего не нашлось.' : 'Пока пусто — впишите тему в любом дне и сохраните.'}</p>`;
      dlg.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
        if (!confirm('Удалить тему из банка? В днях, где она стоит, она останется.')) return;
        try { items = (await api('/bank/delete', { id: +b.dataset.del })).items; paint(); } catch (e) { alert(errText(e)); }
      });
    };
    dlg.querySelector('[data-q]').oninput = paint;
    const nv = l => dlg.querySelector(`[data-n="${l}"]`), nst = dlg.querySelector('[data-nst]');
    dlg.querySelector('[data-ntr]').onclick = async e => { // с первого заполненного языка (RU, EN, LV) на остальные
      const src = ['ru', 'en', 'lv'].find(l => nv(l).value.trim()); if (!src) { nst.textContent = 'Впишите тему хотя бы на одном языке.'; return; }
      e.target.disabled = true; nst.textContent = '🌐 Перевожу…';
      try { const tr = await translate([nv(src).value], src); Object.keys(tr).forEach(l => { if (tr[l][0] && !nv(l).value.trim()) nv(l).value = tr[l][0]; }); nst.textContent = '✓ Переведено'; }
      catch (er) { nst.textContent = '⚠ ' + (TR_ERR[er.code] || er.code || er.message); }
      e.target.disabled = false;
    };
    dlg.querySelector('[data-nadd]').onclick = async () => {
      const sub = L3.map(l => nv(l).value.trim()); if (!sub.some(Boolean)) { nst.textContent = 'Впишите тему хотя бы на одном языке.'; return; }
      try { items = (await api('/bank/add', { subject: sub })).items; L3.forEach(l => { nv(l).value = ''; }); nst.textContent = '✓ Добавлено'; paint(); } catch (er) { nst.textContent = '⚠ ' + errText(er); }
    };
    try { items = await bankLoad(); paint(); } catch (e) { dlg.querySelector('[data-list]').innerHTML = `<p class="be-note">${errText(e)}</p>`; }
  }
  const dnum = k => Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8)) / 864e5;
  function bankOrder(items, day) {
    const n = dnum(day), mo = day.slice(5, 7);
    return items.filter(r => !r.days.some(x => x !== day && Math.abs(dnum(x) - n) < 60))
      .map(r => ({ ...r, g: r.days.some(x => x.slice(5, 7) === mo && n - dnum(x) >= 300) ? 0 : r.days.length ? 2 : 1 }))
      .sort((a, b) => a.g - b.g || a.created_at - b.created_at || a.id - b.id);
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
  // цветовой круг, жёлтый сверху, по часовой. Три вида (переключатель в окне): '24x3' — 24 тона × светлый / чистый / тёмный (wheelColors, по умолчанию),
  // '24' — 24 чистых тона, '12' — 6 базовых + 6 промежуточных из moreColors. Гармонии — сдвиги от главного цвета в 12-шаговых долях круга
  const WT = [['24x3', '24 × 3', '24 цвета × светлый, чистый, тёмный'], ['24', '24', '24 цвета'], ['12', '12', '12 цветов']];
  const WHEEL_N = ['yellow', 'olive', 'green', 'turquoise', 'blue', 'indigo', 'purple', 'fuchsia', 'red', 'coral', 'orange', 'ochre'];
  const HARM = [['mono', 'Монохромная', [0]], ['comp', 'Комплементарная', [0, 6]], ['analog', 'Аналоговая', [-1, 0, 1]], ['analog2', 'Аналоговая через один', [0, 2]], ['acomp', 'Аналогово-комплементарная', [-1, 0, 1, 6]],
    ['triad', 'Триада', [0, 4, 8]], ['split', 'Раздельно-комплементарная', [0, 5, 7]], ['tetrad', 'Тетрада', [0, 2, 6, 8]]];
  const PURE24 = { 0: 'yellow', 4: 'green', 8: 'blue', 12: 'purple', 16: 'red', 20: 'orange' }; // чистые тона круга 24, которые уже есть в colors
  const GRIDS = {};
  function grid(wt) { // { n — секторов, rings — кольца снаружи внутрь: [[индекс цвета по сектору]], pure — какое кольцо «чистое» }
    if (GRIDS[wt]) return GRIDS[wt];
    const byW = (h, r) => D.colors.findIndex(c => c.w && c.w[0] === h && c.w[1] === r);
    const pure = Array.from({ length: 24 }, (_, h) => PURE24[h] ? D.colors.findIndex((c, k) => k < D.base && c.n[0] === PURE24[h]) : byW(h, 1));
    return (GRIDS[wt] = wt === '12' ? { n: 12, rings: [WHEEL_N.map(n => D.colors.findIndex(c => c.n[0] === n))], pure: 0 }
      : wt === '24' ? { n: 24, rings: [pure], pure: 0 }
      : { n: 24, rings: [Array.from({ length: 24 }, (_, h) => byW(h, 0)), pure, Array.from({ length: 24 }, (_, h) => byW(h, 2))], pure: 1 });
  }
  const offs = h => (HARM.find(x => x[0] === h) || HARM[1])[2];
  const sectors = (h, rot, wt) => { const g = grid(wt), st = g.n / 12; return offs(h).map(o => ((rot + o * st) % g.n + g.n) % g.n); };
  // rg — кольцо (оттенок) каждого цвета гармонии; нет — чистый
  const harmCols = (h, rot, wt, rg = []) => { const g = grid(wt); return sectors(h, rot, wt).map((s, j) => g.rings[rg[j] ?? g.pure][s]); };
  function findHarm(list, prefer) { // цвета дня — это гармония на круге? → [гармония, поворот, вид круга, оттенки]
    const want = [...new Set(list)];
    for (const wt of [prefer, ...WT.map(x => x[0])]) {
      const g = grid(wt), at = new Map();
      g.rings.forEach((ring, r) => ring.forEach((ci, s) => at.set(ci, [s, r])));
      if (!want.every(c => at.has(c))) continue;
      for (const [h] of HARM) for (let rot = 0; rot < g.n; rot++) {
        const ss = sectors(h, rot, wt); if (ss.length !== want.length) continue;
        const rg = ss.map(s => { const c = want.find(x => at.get(x)[0] === s); return c == null ? -1 : at.get(c)[1]; });
        if (rg.every(r => r >= 0)) return [h, rot, wt, rg];
      }
    }
    return null;
  }
  // кольца: снаружи внутрь от R до 30; выбранные клетки — с рамкой, к центру — клин цвета
  const pt = (a, r) => [100 + r * Math.sin(a), 100 - r * Math.cos(a)].map(v => v.toFixed(1)).join(' ');
  const RAD = rings => { const R = 97, inner = rings > 1 ? 30 : 60, w = (R - inner) / rings; return Array.from({ length: rings }, (_, k) => [R - k * w, R - (k + 1) * w]); };
  function wheelSvg(wt, on, size) { // on: [[сектор, кольцо]]
    const g = grid(wt), st = 2 * Math.PI / g.n, rad = RAD(g.rings.length), inner = rad[rad.length - 1][1];
    const seg = (k, R, r) => { const a = k * st - st / 2, b = a + st; return `M${pt(a, R)} A${R} ${R} 0 0 1 ${pt(b, R)} L${pt(b, r)} A${r} ${r} 0 0 0 ${pt(a, r)}Z`; };
    const isOn = (k, r) => on.some(([s, rr]) => s === k && rr === r);
    let cells = '', top = '';
    g.rings.forEach((ring, r) => ring.forEach((ci, k) => { const p = `<path d="${seg(k, ...rad[r])}" fill="${(D.colors[ci] || {}).hex || '#ccc'}"${isOn(k, r) ? ' class="on"' : ''}/>`; if (isOn(k, r)) top += p; else cells += p; }));
    const wedge = ([k, r]) => { const a = k * st - st / 2.4, b = k * st + st / 2.4, R = inner - 2; return `<path d="M100 100 L${pt(a, R)} A${R} ${R} 0 0 1 ${pt(b, R)}Z" fill="${(D.colors[g.rings[r][k]] || {}).hex}" class="wg"/>`; };
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" aria-hidden="true">${cells}${top}${on.map(wedge).join('')}</svg>`;
  }
  const hitWheel = (el, e, wt) => { // сектор и кольцо под пальцем
    const g = grid(wt), b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width * 200 - 100, y = (e.clientY - b.top) / b.height * 200 - 100;
    const s = ((Math.round(Math.atan2(x, -y) / (2 * Math.PI / g.n)) % g.n) + g.n) % g.n, d = Math.hypot(x, y), rad = RAD(g.rings.length);
    const r = rad.findIndex(([R, r0]) => d <= R && d > r0);
    return { s, r: r < 0 ? (d > rad[0][0] ? 0 : rad.length - 1) : r };
  };
  let WT_NOW = '24x3';
  try { WT_NOW = localStorage.getItem('pp-chadm-wt') || WT_NOW; } catch (e) { /* без памяти */ }
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
    dlg.innerHTML = `<button type="button" class="chadm-x" data-x aria-label="Закрыть без изменений" title="Закрыть без изменений">✕</button><h2>${dt.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: day.slice(0, 4) === D.today.slice(0, 4) ? undefined : 'numeric' })}${d.extra ? ' · ✦ ЭКСТРА' : ''}${t.pool === 'bday' ? ' · 🎂' : ''}</h2>
      ${works && day <= D.today ? `<p class="chadm-warn">⚠ Уже ${works} ${works % 10 === 1 && works % 100 !== 11 ? 'работа' : [2, 3, 4].includes(works % 10) && ![12, 13, 14].includes(works % 100) ? 'работы' : 'работ'} за этот день — у них тема поменяется.</p>` : ''}
      <p class="be-note chadm-tags" data-tags></p>
      <div class="adm-card-fields">
        ${txt('subject', 'Тема')}
        <p class="chadm-acts"><button type="button" class="pill-btn" data-a="tr"></button><button type="button" class="pill-btn" data-a="bank">📚 Из банка</button><button type="button" class="pill-btn" data-a="reroll">🎲 Другая тема</button>
          <button type="button" class="pill-btn" data-a="swap">⇄ Поменять с днём…</button><select data-swap hidden><option value="">— какой день? —</option>${D.days.filter(x => x.day !== day).map(x => `<option value="${x.day}">${+x.day.slice(8)} — ${esc(x.subject[1] || x.subject[0] || 'пусто')}</option>`).join('')}</select>
          <button type="button" class="pill-btn" data-a="revert"${d.edited ? '' : ' hidden'}>↩ Вернуть как было</button></p>
        ${d.extra ? `<div class="chadm-pal"><b>Палитра дня ЭКСТРА</b>${pal ? `<span>${pal.c.map(c => `<i style="background:${c[0]}" title="${esc(c[2])}"></i>`).join('')}</span><small>«${esc(pal.t[1])}» — очередь палитр: 🎨 Картины и палитры</small>` : '<small>очередь палитр: 🎨 Картины и палитры</small>'}</div>`
        : `<fieldset class="chadm-f"><legend>Цвета дня</legend>
          <div class="chadm-moderow"><div class="ch-level chadm-mode" role="group"><button type="button" data-mode="one">По одному</button><button type="button" data-mode="harm">Гармония на круге</button></div>
            <button type="button" class="pill-btn" data-rnd>🎲 Случайно</button></div>
          <div class="chadm-cols" data-one>${D.colors.slice(0, D.base).map((c, k) => `<button type="button" data-col="${k}" aria-pressed="false"><i style="background:${c.hex}"></i>${esc(c.n[1])}</button>`).join('')}</div>
          <div class="chadm-harm" data-harm hidden><div class="chadm-wheel"><div class="ch-level chadm-wt" role="group">${WT.map(([k, n, t]) => `<button type="button" data-wt="${k}" title="${t}">${n}</button>`).join('')}</div><div data-wheel title="Потяните, чтобы повернуть; нажмите на клетку — цвет или оттенок"></div>
            <p><button type="button" class="pill-btn" data-rot="-1" aria-label="Повернуть против часовой">⟲</button><button type="button" class="pill-btn" data-rot="1" aria-label="Повернуть по часовой">⟳</button></p></div>
            <div class="chadm-hlist">${HARM.map(([h, n]) => `<button type="button" data-h="${h}" aria-pressed="false">${n}</button>`).join('')}</div></div>
          <p class="chadm-picked" data-picked></p></fieldset>`}
        <details><summary>Ещё: время</summary><div>
          <label class="chadm-time">Время <select data-time>${D.times.map(x => `<option value="${x}">${x} мин</option>`).join('')}</select><small class="be-note">в режиме «Спокойно» — на 5 минут больше</small></label>
          </div></details>
      </div>
      <p class="be-dialog-acts"><button type="button" class="pill-btn pill-fill" data-a="save">💾 Сохранить</button><span class="be-note" data-st role="status"></span></p>`;
    document.body.appendChild(dlg);
    const q = s => dlg.querySelector(s), st = q('[data-st]'), trBtn = q('[data-a=tr]');
    let cols = [], from = 'ru', mode = 'one', harm = 'comp', rot = 0, wt = WT_NOW, rg = [];
    const fs = ['subject']; // переводится только тема (Ч/Б-поля под «Ещё» правятся руками)
    const trLabel = () => { trBtn.textContent = `🌐 Перевести с ${from.toUpperCase()} на ${L3.filter(l => l !== from).map(l => l.toUpperCase()).join(' и ')}`; };
    function fill() {
      dlg.querySelectorAll('[data-f]').forEach(inp => { const v = d[inp.dataset.f]; inp.value = v ? v[LI[inp.dataset.l]] || '' : ''; });
      const fh = findHarm(d.colors, WT_NOW);
      if (fh) { mode = 'harm'; [harm, rot, wt, rg] = fh; cols = harmCols(harm, rot, wt, rg); } else { mode = 'one'; cols = baseCols(d.colors); }
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
      dlg.querySelectorAll('[data-wt]').forEach(b => b.setAttribute('aria-pressed', b.dataset.wt === wt));
      if (mode === 'harm') { const g = grid(wt); q('[data-wheel]').innerHTML = wheelSvg(wt, sectors(harm, rot, wt).map((sc, j) => [sc, rg[j] ?? g.pure]), 170); }
      q('[data-picked]').innerHTML = cols.length ? cols.map(c => `<span><i style="background:${D.colors[c].hex}"></i>${esc(D.colors[c].n[1])}</span>`).join('') : 'цвета не выбраны';
    }
    const setHarm = () => { cols = harmCols(harm, rot, wt, rg); paintCols(); };
    dlg.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
      if (b.dataset.mode === mode) return;
      mode = b.dataset.mode;
      if (mode === 'one') { cols = baseCols(cols); paintCols(); return; }
      const g = grid(wt), k = g.rings[g.pure].indexOf(cols[0]); if (k >= 0) rot = k; rg = []; setHarm();
    });
    // вид круга: 24 × 3 / 24 / 12 — гармония та же, поворот пересчитывается, оттенки — чистые
    dlg.querySelectorAll('[data-wt]').forEach(b => b.onclick = () => {
      const nw = b.dataset.wt; if (nw === wt) return;
      rot = Math.round(rot * grid(nw).n / grid(wt).n) % grid(nw).n; wt = WT_NOW = nw; rg = [];
      try { localStorage.setItem('pp-chadm-wt', nw); } catch (e) { /* без памяти */ }
      setHarm();
    });
    dlg.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { harm = b.dataset.h; rg = []; setHarm(); });
    // «🎲 Случайно»: любая гармония с любым поворотом, каждый раз другие цвета
    const rnd = q('[data-rnd]');
    if (rnd) rnd.onclick = () => {
      const was = [...cols].sort().join();
      const g = grid(wt), rnd = n => Math.floor(Math.random() * n);
      do { harm = HARM[rnd(HARM.length)][0]; rot = rnd(g.n); rg = offs(harm).map(() => g.rings.length > 1 ? rnd(g.rings.length) : 0); } while ([...harmCols(harm, rot, wt, rg)].sort().join() === was);
      mode = 'harm'; setHarm();
    };
    dlg.querySelectorAll('[data-rot]').forEach(b => b.onclick = () => { const n = grid(wt).n; rot = (rot + +b.dataset.rot + n) % n; setHarm(); });
    // круг можно тянуть: главный цвет гармонии идёт за пальцем. Нажатие без движения: на выбранный сектор — взять оттенок этого кольца,
    // на другой — главный цвет встаёт туда (с оттенком нажатого кольца)
    const wh = q('[data-wheel]');
    if (wh) {
      let drag = null;
      wh.addEventListener('pointerdown', e => { e.preventDefault(); wh.setPointerCapture(e.pointerId); drag = { ...hitWheel(wh, e, wt), rot }; });
      wh.addEventListener('pointermove', e => { if (!drag) return; const n = grid(wt).n, x = (drag.rot + hitWheel(wh, e, wt).s - drag.s + n) % n; if (x !== rot) { rot = x; setHarm(); } });
      const end = e => {
        if (!drag) return; const hit = hitWheel(wh, e, wt), multi = grid(wt).rings.length > 1;
        if (hit.s === drag.s && rot === drag.rot) {
          const j = sectors(harm, rot, wt).indexOf(hit.s);
          if (j >= 0) { if (multi) { rg = offs(harm).map((_, k) => rg[k] ?? grid(wt).pure); rg[j] = hit.r; } }
          else { rot = (hit.s - offs(harm)[0] * grid(wt).n / 12 + grid(wt).n * 4) % grid(wt).n; if (multi) { rg = offs(harm).map((_, k) => rg[k] ?? grid(wt).pure); rg[0] = hit.r; } }
          setHarm();
        }
        drag = null;
      };
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
    const acts = () => dlg.querySelectorAll('button:not([data-a=tr]):not([data-x])');
    const run = async (fn) => { st.textContent = '…'; acts().forEach(b => b.disabled = true); try { await fn(); } catch (e) { st.textContent = '⚠ ' + errText(e); } acts().forEach(b => b.disabled = false); };
    q('[data-a=save]').onclick = () => run(async () => {
      if (!d.extra && (cols.length < (day >= '2026-12-01' ? 0 : 1) || cols.length > 5)) throw Object.assign(new Error('colors'), { code: 'colors' });
      const body = { day, subject: val('subject'), time: +q('[data-time]').value }; // Ч/Б — без условий (20.10.2026), twist/extra не правятся
      if (!d.extra) body.colors = cols;
      await api('/day', body);
      D = await api('?m=' + ym); draw(); dlg.close(); // сохранено — окно закрывается, календарь уже с новой темой
    });
    // «📚 Из банка» — по очереди, каждое нажатие — следующая: сначала темы, стоявшие в этом же месяце в прошлые годы (год назад и раньше),
    // потом ещё нигде не стоявшие, потом остальные; внутри — добавленные давнее всего. Темы, стоящие ближе 60 дней к этому дню, не предлагаются
    let bank = null, bankI = 0;
    q('[data-a=bank]').onclick = async () => {
      try { bank = bank || bankOrder(await bankLoad(), day); } catch (e) { st.textContent = '⚠ ' + errText(e); return; }
      const curK = (val('subject')[1] || val('subject')[0] || val('subject')[2]).trim().toLowerCase();
      const list = bank.filter(r => (r.ru || r.en || r.lv || '').trim().toLowerCase() !== curK);
      if (!list.length) { st.textContent = 'В банке нет подходящих тем — добавьте: «📚 Банк тем».'; return; }
      const pick = list[bankI++ % list.length];
      ['en', 'ru', 'lv'].forEach(l => { q(`[data-f="subject"][data-l="${l}"]`).value = pick[l] || ''; });
      st.textContent = `📚 ${pick.g === 0 ? 'Тема этого месяца прошлых лет' : 'Из банка'} · добавлена ${dShort(new Date(pick.created_at * 1000).toLocaleDateString('sv-SE'))}${pick.days.length ? ' · стояла: ' + pick.days.map(dShort).join(', ') : ''} — сохраните, если подходит`;
    };
    q('[data-a=reroll]').onclick = () => run(async () => { const r = await api('/reroll', { day, exclude: tried }); tried.push(r.day.item); await after(r); });
    q('[data-a=swap]').onclick = () => { const s = q('[data-swap]'); s.hidden = false; s.focus(); };
    q('[data-swap]').onchange = e => { const w = e.target.value; if (!w) return; run(async () => { await after(await api('/swap', { day, with: w })); e.target.value = ''; e.target.hidden = true; }); };
    q('[data-a=revert]').onclick = () => run(async () => { await after(await api('/revert', { day })); });
    q('[data-x]').onclick = () => dlg.close();
    dlg.addEventListener('close', () => dlg.remove());
    fill(); dlg.showModal();
  }
  window.PPChallengeAdmin = { mount };
})();
