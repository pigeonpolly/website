// Кабинет → «🎨 Темы челленджа» (admin.js открывает PPChallengeAdmin.mount(main)): календарь любого месяца до D.max (2095-12), «🧹 Стереть месяц», «📚 Заполнить месяц из банка»;
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
    const yr = +ym.slice(0, 4), maxM = D.max || '2095-12', minY = 2026, maxY = +maxM.slice(0, 4);
    const cells = D.days.map((d, i) => {
      const t = D.tags[i], works = D.works[d.day] || 0, n = +d.day.slice(8);
      const cls = ['chadm-day', d.day === D.today ? 'today' : '', d.day < D.today ? 'past' : '', d.edited ? 'edited' : '', d.day === D.last ? 'last' : '', d.extra ? 'extra' : '', broken[d.day] ? 'warn' : ''].filter(Boolean).join(' ');
      return `<button type="button" class="${cls}" data-day="${d.day}"><span class="chadm-n">${n}${d.edited ? ' ✏️' : ''}${d.day === D.last ? ' <b class="chadm-lastb">последний</b>' : ''}${d.day === D.today ? ' <b class="chadm-todayb">сегодня</b>' : ''}${d.extra ? ' ✦' : ''}${(D.mthemes || []).some(x => x.s <= d.day && d.day <= x.e) ? ' 🏅' : ''}${t.pool === 'bday' ? ' 🎂' : ''}${broken[d.day] ? ' ⚠' : ''}</span>
        <span class="chadm-s">${d.subject.some(x => x) ? esc(d.subject[1] || d.subject[0] || d.subject[2]) : '<i class="chadm-empty">пусто</i>'}</span>
        <span class="chadm-c">${bw ? '✒ Ч/Б' : d.extra ? '🎨 палитра' : d.colors.map(sw).join('')}</span>
        ${works ? `<span class="chadm-w">${works} раб.</span>` : ''}</button>`;
    }).join('');
    main.innerHTML = `<section class="adm-box chadm">
      <div class="chadm-bar"><div class="chadm-ym"><select class="chadm-year" data-y aria-label="Год">${Array.from({ length: maxY - minY + 1 }, (_, k) => minY + k).map(y => `<option value="${y}"${y === yr ? ' selected' : ''}>${y}</option>`).join('')}</select>
        <div class="ch-level chadm-months" role="group">${MON3.map((n, k) => { const m = `${yr}-${pad(k + 1)}`; return `<button type="button" data-m="${m}" aria-pressed="${m === ym}"${m < '2026-10' || m > maxM ? ' disabled' : ''}${m === thisMonth ? ' class="now"' : ''} title="${MON[k]} ${yr}">${n}</button>`; }).join('')}</div></div>
        <span class="chadm-tools"><button type="button" class="pill-btn" data-now${ym === thisMonth ? ' disabled' : ''}>📅 Сегодня</button>
        <button type="button" class="pill-btn" data-bank>📚 Банк тем</button><button type="button" class="pill-btn" data-fill title="Заполнить пустые дни месяца темами из банка">📚 Заполнить из банка</button><button type="button" class="pill-btn" data-clear>🧹 Стереть месяц</button></span></div>
      <div class="chadm-mt"><b title="Бейдж «тема + год» за рисунки каждый день тематики (день ЭКСТРА можно пропустить)">🏅 Тематики</b>${mtList()}<button type="button" class="pill-btn" data-mtnew>＋ Новая тематика</button></div>
      ${D.last ? `<p class="be-note chadm-lastn">Последний изменённый: <button type="button" class="pill-btn" data-last>${new Date(+D.last.slice(0, 4), +D.last.slice(5, 7) - 1, +D.last.slice(8)).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</button></p>` : ''}
      ${D.days.length ? `<div class="chadm-grid" lang="ru">${['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(x => `<span class="chadm-dow">${x}</span>`).join('')}${'<span></span>'.repeat(first)}${cells}</div>
      <p class="be-note">Нажмите на день, чтобы поправить тему. ✏️ — день правили вы, зелёный — последний изменённый, фиолетовый — сегодня, ✦ — день ЭКСТРА, 🏅 — день тематики, ⚠ — день нарушает правило подбора (подробнее — в окне дня). ${D.broken.length ? `Нарушений в месяце: <b>${D.broken.length}</b>.` : 'Все дни подходят по правилам ✓'}</p>`
        : '<p class="be-note">Плана на этот месяц пока нет.</p>'}
      <p class="be-note">С 1 декабря 2026 дни пустые — темы и цвета заполняете вы. Если к 23:00 (за час до начала дня) день остался пустым, тема и цвета подберутся сами по прежним правилам. Числа правил подбора — в «📜 Все правила» → «Тонкая настройка» → «🎨 Темы челленджа».</p></section>`;
    main.querySelectorAll('[data-m]').forEach(b => b.onclick = () => load(b.dataset.m));
    main.querySelector('[data-y]').onchange = e => { // другой год — тот же месяц (в пределах, где можно)
      let m = `${e.target.value}-${ym.slice(5)}`; if (m < '2026-10') m = '2026-10'; if (m > maxM) m = maxM; load(m);
    };
    main.querySelector('[data-bank]').onclick = () => bankDialog();
    main.querySelectorAll('[data-mtid]').forEach(b => b.onclick = () => mthemeDialog(D.mthemes.find(x => x.ym === b.dataset.mtid)));
    main.querySelector('[data-mtnew]').onclick = () => mthemeDialog(null);
    main.querySelector('[data-now]').onclick = () => load(thisMonth); // назад к текущему месяцу
    main.querySelector('[data-clear]').onclick = async e => { // темы и цвета обычных дней с завтрашнего; ЭКСТРА и прошедшие не трогаются
      const n = D.days.filter(d => d.day > D.today && !d.extra && (d.subject.some(x => x) || d.colors.length)).length;
      if (!n) { alert('Стирать нечего: прошедшие дни, сегодня и дни ЭКСТРА не стираются.'); return; }
      if (!confirm(`Стереть темы и цвета ${n} дн. в месяце «${MON[+ym.slice(5) - 1]} ${ym.slice(0, 4)}»? Прошедшие дни, сегодня и дни ЭКСТРА останутся, темы сохранятся в банке.`)) return;
      e.target.disabled = true;
      try { const r = await api('/clearmonth', { m: ym }); await load(ym); alert(`Стёрто дней: ${r.cleared}. Если день останется пустым, за час до его начала тема и цвета подберутся сами.`); }
      catch (er) { alert(errText(er)); e.target.disabled = false; }
    };
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
  // ---------- 🏅 тематики с датами «с — по» (неделя, 10 дней, месяц, 100 дней…): бейдж «тема + год» за рисунок каждый день ----------
  const dOf = k => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8));
  const kOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (k, n) => { const d = dOf(k); d.setDate(d.getDate() + n); return kOf(d); };
  const lenOf = (s, e) => Math.round((dOf(e) - dOf(s)) / 864e5) + 1;
  const ruDays = n => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'день' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'дня' : 'дней'}`;
  const fmtRange = (s, e) => { const o = { day: 'numeric', month: 'short' }, y = s.slice(0, 4) !== e.slice(0, 4) || s.slice(0, 4) !== D.today.slice(0, 4);
    return `${dOf(s).toLocaleDateString('ru-RU', { ...o, ...(y ? { year: 'numeric' } : {}) })} — ${dOf(e).toLocaleDateString('ru-RU', { ...o, ...(y ? { year: 'numeric' } : {}) })}`; };
  const medalOf = x => { const B = window.PPPixelBadge; if (!B) return ''; const dz = B.clean(x.badge) || B.suggest(x.t.join(' '), x.s); return `<span class="sw-medal has-ring" style="--bg:${dz.bg};--ring:${dz.ring || '#C98A1E'}"><b>${B.svg(dz)}</b></span>`; };
  const mtList = () => (D.mthemes || []).map(x => `<button type="button" class="pill-btn chadm-mtb" data-mtid="${esc(x.ym)}" title="Изменить тематику, даты или бейдж">${medalOf(x)} «${esc(x.t[1] || x.t[0] || x.t[2])}» · ${fmtRange(x.s, x.e)} · ${ruDays(lenOf(x.s, x.e))}${x.e < D.today ? ' · прошла' : x.s <= D.today ? ' · идёт' : ''}</button>`).join('') || '<span class="be-note">нет — бейджа за тематику нет</span>';
  function mthemeDialog(x) {
    const mEnd = `${ym}-${pad(new Date(+ym.slice(0, 4), +ym.slice(5, 7), 0).getDate())}`;
    let s = x ? x.s : ym + '-01', e = x ? x.e : mEnd; // новая — по умолчанию весь открытый месяц
    const LENS = [[7, 'Неделя'], [10, '10 дней'], [14, '2 недели'], [30, '30 дней'], [100, '100 дней']];
    const dlg = document.createElement('dialog'); dlg.className = 'be-dialog adm-card-dlg chadm-dlg chadm-mtd';
    dlg.innerHTML = `<button type="button" class="chadm-x" data-x aria-label="Закрыть без изменений">✕</button><h2>🏅 ${x ? 'Тематика' : 'Новая тематика'}</h2>
      <div class="chadm-mtdates"><label>С <input type="date" data-s></label><label>по <input type="date" data-e></label><b data-len></b></div>
      <p class="chadm-mtlens">${LENS.map(([n, t]) => `<button type="button" class="pill-btn" data-len-n="${n}">${t}</button>`).join('')}<button type="button" class="pill-btn" data-len-m>Месяц</button></p>
      ${['ru', 'en', 'lv'].map(l => `<label class="chadm-mtl"><span>${l.toUpperCase()}</span><input type="text" data-mt="${l}" maxlength="120" value="${esc(x ? x.t[LI[l]] : '')}"></label>`).join('')}
      <p class="be-note">За рисунок каждый день с первого по последний (дни ЭКСТРА можно пропустить) — бейдж «тема + год» и пуговки (📜 Правила → «Тематика месяца»). Полученные бейджи не отнимаются.</p>
      <p class="be-dialog-acts"><button type="button" class="pill-btn" data-tr>🌐 Перевести</button><button type="button" class="pill-btn pill-fill" data-save>💾 Сохранить</button>${x ? '<button type="button" class="pill-btn" data-badge>🎨 Бейдж</button><button type="button" class="pill-btn" data-del>🗑 Удалить</button>' : ''}<span class="be-note" data-st role="status"></span></p>`;
    document.body.appendChild(dlg); dlg.addEventListener('close', () => dlg.remove());
    const q = k => dlg.querySelector(k), st = q('[data-st]'), mv = l => q(`[data-mt="${l}"]`);
    const show = () => { q('[data-s]').value = s; q('[data-e]').value = e; q('[data-len]').textContent = e >= s ? ruDays(lenOf(s, e)) : '⚠ конец раньше начала'; };
    q('[data-s]').onchange = ev => { const n = e >= s ? lenOf(s, e) : 1; s = ev.target.value || s; e = addDays(s, n - 1); show(); }; // сдвиг начала — длина та же
    q('[data-e]').onchange = ev => { e = ev.target.value || e; show(); };
    dlg.querySelectorAll('[data-len-n]').forEach(b => b.onclick = () => { e = addDays(s, +b.dataset.lenN - 1); show(); });
    q('[data-len-m]').onclick = () => { const d = dOf(s); d.setMonth(d.getMonth() + 1, Math.min(d.getDate(), new Date(d.getFullYear(), d.getMonth() + 2, 0).getDate())); e = addDays(kOf(d), -1); show(); };
    q('[data-tr]').onclick = async ev => {
      const src = ['ru', 'en', 'lv'].find(l => mv(l).value.trim()); if (!src) { st.textContent = 'Впишите тематику хотя бы на одном языке.'; return; }
      ev.target.disabled = true; st.textContent = '🌐 Перевожу…';
      try { const tr = await translate([mv(src).value], src); Object.keys(tr).forEach(l => { if (tr[l][0]) mv(l).value = tr[l][0]; }); st.textContent = '✓ Переведено — сохраните'; }
      catch (er) { st.textContent = '⚠ ' + (TR_ERR[er.code] || er.code || er.message); }
      ev.target.disabled = false;
    };
    const send = async body => {
      st.textContent = '…';
      try { await api('/mtheme', body); dlg.close(); await load(ym); }
      catch (er) { st.textContent = '⚠ ' + ({ dates: 'Проверьте даты: конец не раньше начала.', long: 'Не длиннее 366 дней.', same: 'Тематика с такими датами уже есть.' }[er.code] || errText(er)); }
    };
    q('[data-save]').onclick = () => { const sub = L3.map(l => mv(l).value.trim()); if (!sub.some(Boolean)) { st.textContent = 'Впишите тематику хотя бы на одном языке.'; return; } send({ id: x ? x.ym : '', s, e, subject: sub }); };
    if (x) {
      q('[data-del]').onclick = () => confirm(`Удалить тематику «${x.t[1] || x.t[0]}»? Бейдж больше нельзя будет получить (у кого уже есть — останется).`) && send({ id: x.ym, del: 1 });
      q('[data-badge]').onclick = () => { dlg.close(); badgeDialog(x.ym, x.t, x.badge, () => load(ym), x); };
    }
    q('[data-x]').onclick = () => dlg.close();
    show(); dlg.showModal();
  }
  // ---------- 🎨 редактор пиксельного бейджа тематики месяца (site/assets/pixel-badge.js) ----------
  // шаблоны, цвета рисунка (поменять цвет — меняются все его пиксели), фон и обводка медали, контур рисунка, символ в углу, рисование по клеткам 16×16
  const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const hsl = h => { const v = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255), mx = Math.max(...v), mn = Math.min(...v), l = (mx + mn) / 2, dd = mx - mn; if (!dd) return [0, 0, l];
    const [r, g, b] = v, hh = mx === r ? ((g - b) / dd + 6) % 6 : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4; return [hh * 60, dd / (1 - Math.abs(2 * l - 1)), l]; };
  const hex = (h, s, l) => { const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)); return '#' + [0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join(''); };
  function badgeDialog(m, theme, design, onSaved, per) {
    const B = window.PPPixelBadge; if (!B) { alert('Не загрузился pixel-badge.js'); return; }
    let d = B.clean(design) || B.suggest((theme || []).join(' '), m), tool = 'pen', cur = Object.keys(d.pal)[0] || 'a';
    const dlg = document.createElement('dialog'); dlg.className = 'be-dialog adm-card-dlg chadm-dlg chadm-bed';
    const mon = per ? fmtRange(per.s, per.e) : new Date(+m.slice(0, 4), +m.slice(5, 7) - 1, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }).replace(/\s*г\.$/, '');
    dlg.innerHTML = `<button type="button" class="chadm-x" data-x aria-label="Закрыть без изменений">✕</button><h2>🎨 Бейдж «${esc(theme[1] || theme[0] || theme[2])} ${m.slice(0, 4)}» · ${mon}</h2>
      <div class="bed-main"><div class="bed-left">
        <div class="bed-prev" data-prev></div>
        <div class="bed-grid" data-grid></div>
        <p class="bed-tools">${[['pen', '✏️ Рисовать'], ['erase', '🧽 Стереть'], ['fill', '🪣 Заливка']].map(([k, n]) => `<button type="button" class="pill-btn" data-tool="${k}">${n}</button>`).join('')}<button type="button" class="pill-btn" data-clear>🗑 Очистить</button></p>
      </div><div class="bed-right">
        <b>Шаблоны</b><div class="bed-tpls">${Object.entries(B.TEMPLATES).map(([k, t]) => `<button type="button" data-tpl="${k}" title="${esc(t.n[1])}"><span class="sw-medal has-ring" style="--bg:${t.bg};--ring:#C98A1E"><b>${B.svg(B.fromTemplate(k))}</b></span></button>`).join('')}</div>
        <b>Цвета рисунка</b> <small>— нажмите, чтобы рисовать этим цветом; круглая кнопка рядом — поменять цвет</small><div class="bed-pal" data-pal></div>
        <div class="bed-row"><label>Фон медали <input type="color" data-bg></label><label>Обводка медали <input type="color" data-ring></label><label><input type="checkbox" data-ol> Контур рисунка <input type="color" data-olc></label></div>
        <div class="bed-row"><label>Символ <select data-sym><option value="">нет</option>${Object.entries(B.GLYPH_N).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}<option value="text">свой знак…</option></select></label>
          <input type="text" data-symt maxlength="2" placeholder="7" hidden><input type="color" data-symc><select data-symp><option value="tr">↗ сверху справа</option><option value="tl">↖ сверху слева</option><option value="br">↘ снизу справа</option><option value="bl">↙ снизу слева</option></select></div>
        <p class="bed-tools"><button type="button" class="pill-btn" data-recolor>🎲 Другие цвета</button><button type="button" class="pill-btn" data-auto>✨ Под тему</button></p>
      </div></div>
      <p class="be-dialog-acts"><button type="button" class="pill-btn pill-fill" data-save>💾 Сохранить бейдж</button><span class="be-note" data-st></span></p>`;
    document.body.appendChild(dlg); dlg.addEventListener('close', () => dlg.remove());
    const q = s => dlg.querySelector(s), st = q('[data-st]');
    const cells = []; for (let y = 0; y < B.N; y++) for (let x = 0; x < B.N; x++) { const c = document.createElement('i'); c.dataset.x = x; c.dataset.y = y; cells.push(c); q('[data-grid]').appendChild(c); }
    const setCell = (x, y, ch) => { const r = d.rows[y].split(''); r[x] = ch; d.rows[y] = r.join(''); };
    function paint() {
      cells.forEach(c => { const ch = d.rows[c.dataset.y][c.dataset.x]; c.style.background = ch === '.' ? '' : d.pal[ch]; });
      const md = (size, off) => `<span class="sw-medal${off ? ' off' : ' has-ring'}" style="--bg:${d.bg};--ring:${d.ring};width:${size}px;height:${size}px"><b>${B.svg(d)}</b></span>`;
      q('[data-prev]').innerHTML = md(120) + md(62) + md(62, true);
      q('[data-pal]').innerHTML = Object.entries(d.pal).map(([k, c]) => `<span class="bed-sw${k === cur ? ' on' : ''}"><button type="button" data-cur="${k}" style="background:${c}" title="рисовать этим цветом"></button><input type="color" value="${c}" data-pc="${k}" title="поменять цвет"></span>`).join('') + '<button type="button" class="bed-add" data-addc title="добавить цвет">＋</button>';
      dlg.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === tool)));
      q('[data-bg]').value = d.bg; q('[data-ring]').value = d.ring; q('[data-ol]').checked = !!d.outline; q('[data-olc]').value = d.outline || '#2B1A51';
      q('[data-sym]').value = d.sym ? (d.sym.g || 'text') : ''; q('[data-symt]').hidden = !(d.sym && !d.sym.g); q('[data-symt]').value = d.sym && d.sym.t || ''; q('[data-symc]').value = d.sym ? d.sym.c : '#F2C230'; q('[data-symp]').value = d.sym ? d.sym.p : 'tr';
      dlg.querySelectorAll('[data-cur]').forEach(b => b.onclick = () => { cur = b.dataset.cur; if (tool === 'erase') tool = 'pen'; paint(); });
      dlg.querySelectorAll('[data-pc]').forEach(inp => inp.oninput = () => { d.pal[inp.dataset.pc] = inp.value; cur = inp.dataset.pc; paintSoft(); });
      q('[data-addc]').onclick = () => { const k = [...LETTERS].find(l => !d.pal[l]); if (!k) return; d.pal[k] = '#7B4FB8'; cur = k; tool = 'pen'; paint(); };
    }
    const paintSoft = () => { cells.forEach(c => { const ch = d.rows[c.dataset.y][c.dataset.x]; c.style.background = ch === '.' ? '' : d.pal[ch]; }); q('[data-prev]').querySelectorAll('b').forEach(b => { b.innerHTML = B.svg(d); }); };
    function flood(x, y, to) { const from = d.rows[y][x]; if (from === to) return; const stack = [[x, y]];
      while (stack.length) { const [a, b] = stack.pop(); if (a < 0 || b < 0 || a >= B.N || b >= B.N || d.rows[b][a] !== from) continue; setCell(a, b, to); stack.push([a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]); } }
    let down = false;
    const act = c => { const x = +c.dataset.x, y = +c.dataset.y; if (tool === 'fill') flood(x, y, cur); else setCell(x, y, tool === 'erase' ? '.' : cur); paintSoft(); };
    q('[data-grid]').addEventListener('pointerdown', e => { const c = e.target.closest('i'); if (!c) return; e.preventDefault(); down = tool !== 'fill'; act(c); });
    q('[data-grid]').addEventListener('pointerover', e => { const c = e.target.closest('i'); if (c && down) act(c); });
    window.addEventListener('pointerup', () => { down = false; });
    dlg.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => { tool = b.dataset.tool; paint(); });
    q('[data-clear]').onclick = () => { if (confirm('Стереть весь рисунок?')) { d.rows = B.blankRows(); paint(); } };
    dlg.querySelectorAll('[data-tpl]').forEach(b => b.onclick = () => { const t = B.fromTemplate(b.dataset.tpl); d = { ...t, sym: d.sym }; cur = Object.keys(d.pal)[0]; paint(); });
    q('[data-bg]').oninput = e => { d.bg = e.target.value; paintSoft(); paint(); };
    q('[data-ring]').oninput = e => { d.ring = e.target.value; paint(); };
    q('[data-ol]').onchange = () => { d.outline = q('[data-ol]').checked ? q('[data-olc]').value : ''; paint(); };
    q('[data-olc]').oninput = e => { if (q('[data-ol]').checked) { d.outline = e.target.value; paint(); } };
    const symNow = () => { const g = q('[data-sym]').value; d.sym = !g ? null : { g: g === 'text' ? '' : g, t: g === 'text' ? (q('[data-symt]').value || '★') : '', c: q('[data-symc]').value, p: q('[data-symp]').value }; paint(); };
    ['[data-sym]', '[data-symc]', '[data-symp]'].forEach(s => { q(s).onchange = symNow; }); q('[data-symt]').oninput = symNow;
    q('[data-recolor]').onclick = () => { const k = 40 + Math.random() * 280; for (const c of Object.keys(d.pal)) { const [h, s, l] = hsl(d.pal[c]); if (s > .15) d.pal[c] = hex((h + k) % 360, s, l); } const [h, s, l] = hsl(d.bg); d.bg = hex((h + k) % 360, s, l); paint(); };
    q('[data-auto]').onclick = () => { d = B.suggest((theme || []).join(' '), m); cur = Object.keys(d.pal)[0]; paint(); };
    q('[data-x]').onclick = () => dlg.close();
    q('[data-save]').onclick = async () => {
      st.textContent = '…';
      try { await api('/mbadge', { m, design: B.clean(d) }); st.textContent = '✓ Сохранено'; if (onSaved) onSaved(B.clean(d)); setTimeout(() => dlg.close(), 400); }
      catch (e) { st.textContent = '⚠ ' + (e.code === 'notheme' ? 'Сначала сохраните тематику.' : errText(e)); }
    };
    paint(); dlg.showModal();
  }
  // ---------- банк тем: темы правленных дней (сервер держит банк за днями) + добавленные прямо в банк ----------
  const bankLoad = day => api('/bank' + (day ? '?day=' + day : '')).then(x => x.items);
  const TAGS = [['winter', '❄️ зима'], ['spring', '🌷 весна'], ['summer', '☀️ лето'], ['autumn', '🍂 осень'], ['extra', '✦ ЭКСТРА'], ['bday', '🎂 день рождения'], ['halloween', '🎃 Хеллоуин'], ['xmas', '🎄 Новый год']];
  const tagChips = (on, attr) => `<span class="chadm-tags2">${TAGS.map(([k, n]) => `<button type="button" ${attr}="${k}" aria-pressed="${on.includes(k)}">${n}</button>`).join('')}</span>`;
  const dShort = k => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8)).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  async function bankDialog() {
    const dlg = document.createElement('dialog'); dlg.className = 'be-dialog adm-card-dlg chadm-dlg chadm-bank';
    dlg.innerHTML = `<button type="button" class="chadm-x" data-x aria-label="Закрыть">✕</button><h2>📚 Банк тем</h2>
      <p class="be-note">Сюда сами попадают темы всех дней, которые вы заполнили; поменяли или стёрли тему в дне — она уходит и отсюда. Взять тему в день — «📚 Из банка». Метки: сезон — тема только в этот сезон; ✦ — только в день ЭКСТРА; 🎂 — 23 января; 🎃 — октябрь; 🎄 — декабрь и 1–7 января.</p>
      <fieldset class="chadm-f chadm-badd"><legend>Добавить тему в банк</legend>${['ru', 'en', 'lv'].map(l => `<label><span>${l.toUpperCase()}</span><input type="text" data-n="${l}"></label>`).join('')}
        ${tagChips([], 'data-nt')}<p class="chadm-acts"><button type="button" class="pill-btn" data-ntr>🌐 Перевести</button><button type="button" class="pill-btn pill-fill" data-nadd>➕ Добавить</button><span class="be-note" data-nst></span></p></fieldset>
      <div class="chadm-bfind"><input type="search" placeholder="Найти тему…" data-q class="chadm-bq"><select data-sort aria-label="Порядок"><option value="new">Сначала новые</option><option value="old">Сначала старые</option><option value="az">По алфавиту</option></select></div><div class="chadm-blist" data-list><p class="be-note">Загрузка…</p></div>`;
    document.body.appendChild(dlg); dlg.addEventListener('close', () => dlg.remove()); dlg.querySelector('[data-x]').onclick = () => dlg.close(); dlg.showModal();
    let items = [];
    const paint = () => {
      const f = dlg.querySelector('[data-q]').value.trim().toLowerCase();
      const so = dlg.querySelector('[data-sort]').value, nm = r => String(r.ru || r.en || r.lv || '').toLowerCase();
      const list = items.filter(r => !f || [r.ru, r.en, r.lv].some(x => String(x || '').toLowerCase().includes(f)))
        .sort((a, b) => so === 'az' ? nm(a).localeCompare(nm(b), 'ru') : so === 'old' ? a.created_at - b.created_at || a.id - b.id : b.created_at - a.created_at || b.id - a.id); // по дате добавления в банк
      dlg.querySelector('[data-list]').innerHTML = list.length ? `<p class="be-note">Тем: <b>${list.length}</b></p>` + list.map(r => `<div class="chadm-bi" data-id="${r.id}"><div><b>${esc(r.ru || r.en || r.lv)}</b><small>${esc(r.en)} · ${esc(r.lv)}</small>${tagChips(r.tags || [], 'data-t')}
        <small>добавлена ${dShort(new Date(r.created_at * 1000).toLocaleDateString('sv-SE'))} · ${r.days.length ? 'стоит: ' + r.days.map(dShort).join(', ') : 'сейчас ни в одном дне'}</small></div><button type="button" class="pill-btn" data-del="${r.id}" title="Удалить из банка">🗑</button></div>`).join('')
        : `<p class="be-note">${items.length ? 'Ничего не нашлось.' : 'Пока пусто — впишите тему в любом дне и сохраните.'}</p>`;
      dlg.querySelectorAll('[data-t]').forEach(b => b.onclick = async () => { // метка темы — сразу сохраняется
        const r = items.find(x => x.id === +b.closest('[data-id]').dataset.id), k = b.dataset.t;
        const tags = r.tags.includes(k) ? r.tags.filter(x => x !== k) : [...r.tags, k];
        b.setAttribute('aria-pressed', String(tags.includes(k)));
        try { items = (await api('/bank/tags', { id: r.id, tags })).items; } catch (e) { alert(errText(e)); paint(); }
      });
      dlg.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
        if (!confirm('Удалить тему из банка? В днях, где она стоит, она останется.')) return;
        try { items = (await api('/bank/delete', { id: +b.dataset.del })).items; paint(); } catch (e) { alert(errText(e)); }
      });
    };
    dlg.querySelector('[data-q]').oninput = paint;
    const sortSel = dlg.querySelector('[data-sort]');
    try { sortSel.value = localStorage.getItem('pp-chadm-bsort') || 'new'; } catch (e) { /* без памяти */ }
    sortSel.onchange = () => { try { localStorage.setItem('pp-chadm-bsort', sortSel.value); } catch (e) { /* без памяти */ } paint(); };
    dlg.querySelectorAll('[data-nt]').forEach(b => b.onclick = () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')));
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
      const tags = [...dlg.querySelectorAll('[data-nt][aria-pressed=true]')].map(b => b.dataset.nt);
      try { items = (await api('/bank/add', { subject: sub, tags })).items; L3.forEach(l => { nv(l).value = ''; }); dlg.querySelectorAll('[data-nt]').forEach(b => b.setAttribute('aria-pressed', 'false')); nst.textContent = '✓ Добавлено'; paint(); } catch (er) { nst.textContent = '⚠ ' + errText(er); }
    };
    try { items = await bankLoad(); paint(); } catch (e) { dlg.querySelector('[data-list]').innerHTML = `<p class="be-note">${errText(e)}</p>`; }
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
        ${d.extra ? `<fieldset class="chadm-f chadm-pal"><legend>Палитра дня ЭКСТРА</legend><select data-pal><option value="">По очереди${pal ? ` — «${esc(pal.t[1])}»` : ''}</option>${(window.EXTRA_PALETTES || []).map(x => `<option value="${esc(x.k)}">«${esc(x.t[1])}»</option>`).join('')}</select><span data-palsw></span><small>картины и палитры — «🎨 Картины и палитры»</small></fieldset>`
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
    const palSw = () => { const sel = q('[data-pal]'); if (!sel) return; const P = window.EXTRA_PALETTES || [], x = P.find(y => y.k === sel.value) || pal; q('[data-palsw]').innerHTML = x ? x.c.map(c => `<i style="background:${c[0]}" title="${esc(c[2])}"></i>`).join('') : ''; };
    function paintCols() {
      if (d.extra) { const sel = q('[data-pal]'); if (sel) { sel.value = d.pal || ''; palSw(); } return; }
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
    if (q('[data-pal]')) q('[data-pal]').onchange = palSw;
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
      if (!d.extra) body.colors = cols; else body.pal = q('[data-pal]').value || null;
      await api('/day', body);
      D = await api('?m=' + ym); draw(); dlg.close(); // сохранено — окно закрывается, календарь уже с новой темой
    });
    // «📚 Из банка» — по очереди, каждое нажатие — следующая (порядок — сервер, bankOrder в challenge-days.js)
    let bank = null, bankI = 0;
    q('[data-a=bank]').onclick = async () => {
      try { bank = bank || await bankLoad(day); } catch (e) { st.textContent = '⚠ ' + errText(e); return; } // уже по порядку для этого дня (сервер, bankOrder)
      const curK = (val('subject')[1] || val('subject')[0] || val('subject')[2]).trim().toLowerCase();
      const list = bank.filter(r => (r.ru || r.en || r.lv || '').trim().toLowerCase() !== curK);
      if (!list.length) { st.textContent = 'В банке нет подходящих тем — добавьте: «📚 Банк тем».'; return; }
      const pick = list[bankI++ % list.length];
      ['en', 'ru', 'lv'].forEach(l => { q(`[data-f="subject"][data-l="${l}"]`).value = pick[l] || ''; });
      st.textContent = `📚 ${pick.g === -1 ? 'Тема для этого особого дня' : pick.g === 0 && !pick.manual ? 'Тема этого месяца прошлых лет' : 'Из банка'} · добавлена ${dShort(new Date(pick.created_at * 1000).toLocaleDateString('sv-SE'))}${pick.days.length ? ' · стояла: ' + pick.days.map(dShort).join(', ') : ''} — сохраните, если подходит`;
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
