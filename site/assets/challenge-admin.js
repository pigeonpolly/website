// Кабинет → «🎨 Темы челленджа» (admin.js открывает PPChallengeAdmin.mount(main)): календарь текущего и следующего месяца, «В цвете / Ч/Б»;
// окно дня — предмет, совет, 2–5 цветов, время, Ч/Б-указание (EN/RU/LV), в день ЭКСТРА — палитра и Ч/Б-условие;
// «🌐 Перевести», «🎲 Другой предмет», «⇄ Поменять с днём…», «↩ Вернуть как было». Сервер — /api/admin/challenge/* (worker/challenge-days.js), docs/challenge.md.
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body) => {
    const r = await fetch('/api/admin/challenge' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error || r.status });
    return d;
  };
  const ERR = { none: 'Больше нет предметов, которые подходят по правилам.', colors: 'Нужно от 2 до 5 разных цветов.', subject: 'Впишите предмет хотя бы на одном языке.', orig: 'Нечего возвращать.', admin: 'Это может только админ.', auth: 'Войдите через Google.' };
  const errText = e => ERR[e.code] || 'Не получилось (' + (e.code || e.message) + ').';
  const L3 = ['en', 'ru', 'lv'], LI = { en: 0, ru: 1, lv: 2 };
  const CAT = { idea: 'слово-тема', life: 'из жизни', food: 'еда', drink: 'напиток', animal: 'животное', bird: 'птица', plant: 'растение', home: 'дом', clothes: 'одежда', transport: 'транспорт', place: 'место', nature: 'природа', weather: 'погода', tool: 'инструмент', toy: 'игрушка', music: 'музыка', fantasy: 'сказка', person: 'человек', holiday: 'праздник' };
  const POOL = { winter: '❄️ зима', spring: '🌷 весна', summer: '☀️ лето', autumn: '🍂 осень', none: 'без сезона', bday: '🎂 день рождения' };
  const DIF = { 1: 'простой', 2: 'средний', 3: 'сложный' };
  const RULE = { family: 'та же семья предметов была недавно', cat: 'та же категория, что у соседнего дня', window: 'мало разных категорий за неделю', deck: 'сложность не по колоде (3 простых, 3 средних, 1 сложный)', pool: 'не тот сезон' };
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
    const months = [thisMonth, ymAdd(thisMonth, 1)];
    const cells = D.days.map((d, i) => {
      const t = D.tags[i], works = D.works[d.day] || 0, n = +d.day.slice(8);
      const cls = ['chadm-day', d.day === D.today ? 'today' : '', d.day < D.today ? 'past' : '', d.edited ? 'edited' : '', d.extra ? 'extra' : '', broken[d.day] ? 'warn' : ''].filter(Boolean).join(' ');
      return `<button type="button" class="${cls}" data-day="${d.day}"><span class="chadm-n">${n}${d.edited ? ' ✏️' : ''}${d.extra ? ' ✦' : ''}${t.pool === 'bday' ? ' 🎂' : ''}${broken[d.day] ? ' ⚠' : ''}</span>
        <span class="chadm-s">${esc(d.subject[1] || d.subject[0])}</span>
        <span class="chadm-c">${bw ? `✒ ${esc(d.twist[1] || d.twist[0])}` : d.extra ? '🎨 палитра' : d.colors.map(sw).join('')}</span>
        ${works ? `<span class="chadm-w">${works} раб.</span>` : ''}</button>`;
    }).join('');
    main.innerHTML = `<section class="adm-box chadm">
      <div class="chadm-bar"><div class="ch-level" role="group">${months.map(m => `<button type="button" data-m="${m}" aria-pressed="${m === ym}">${MON[+m.slice(5) - 1]} ${m.slice(0, 4)}</button>`).join('')}</div>
        <div class="ch-level" role="group"><button type="button" data-bw="0" aria-pressed="${!bw}">В цвете</button><button type="button" data-bw="1" aria-pressed="${bw}">Ч/Б</button></div></div>
      ${D.days.length ? `<div class="chadm-grid" lang="ru">${['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(x => `<span class="chadm-dow">${x}</span>`).join('')}${'<span></span>'.repeat(first)}${cells}</div>
      <p class="be-note">Нажмите на день, чтобы поправить тему. ✏️ — день правили вы, ✦ — день ЭКСТРА, ⚠ — день нарушает правило подбора (подробнее — в окне дня). ${D.broken.length ? `Нарушений в месяце: <b>${D.broken.length}</b>.` : 'Все дни подходят по правилам ✓'}</p>`
        : '<p class="be-note">Плана на этот месяц пока нет.</p>'}
      <p class="be-note">План следующего месяца создаётся сам 20-го числа (или когда вы его откроете здесь); созданный месяц сам уже не меняется. Числа правил подбора — в «📜 Все правила» → «Тонкая настройка» → «🎨 Темы челленджа».</p></section>`;
    main.querySelectorAll('[data-m]').forEach(b => b.onclick = () => load(b.dataset.m));
    main.querySelectorAll('[data-bw]').forEach(b => b.onclick = () => { bw = b.dataset.bw === '1'; try { sessionStorage.setItem('pp-chadm-bw', bw ? '1' : ''); } catch (e) { /* без памяти */ } draw(); });
    main.querySelectorAll('[data-day]').forEach(b => b.onclick = () => dayDialog(b.dataset.day));
  }
  // ---------- окно дня ----------
  function dayDialog(day) {
    const i = D.days.findIndex(x => x.day === day); if (i < 0) return;
    let d = D.days[i]; const t = D.tags[i], works = D.works[day] || 0, br = (D.broken.find(b => b.day === day) || {}).rules || [];
    const tried = [d.item];
    const dlg = document.createElement('dialog'); dlg.className = 'be-dialog adm-card-dlg chadm-dlg';
    const txt = (f, label, area) => `<fieldset class="chadm-f"><legend>${label}</legend>${['ru', 'en', 'lv'].map(l => `<label><span>${l.toUpperCase()}</span>${area ? `<textarea rows="2" data-f="${f}" data-l="${l}"></textarea>` : `<input type="text" data-f="${f}" data-l="${l}">`}</label>`).join('')}</fieldset>`;
    const pal = d.extra ? palOf(day) : null;
    const dt = new Date(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8));
    dlg.innerHTML = `<h2>${dt.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}${d.extra ? ' · ✦ ЭКСТРА' : ''}${t.pool === 'bday' ? ' · 🎂' : ''}</h2>
      ${works && day <= D.today ? `<p class="chadm-warn">⚠ Уже ${works} ${works % 10 === 1 && works % 100 !== 11 ? 'работа' : [2, 3, 4].includes(works % 10) && ![12, 13, 14].includes(works % 100) ? 'работы' : 'работ'} за этот день — у них тема поменяется.</p>` : ''}
      <p class="be-note chadm-tags" data-tags></p>
      <div class="adm-card-fields">
        ${txt('subject', 'Предмет')}
        <p class="adm-r-bar chadm-acts"><span data-tr></span><button type="button" class="pill-btn" data-a="reroll">🎲 Другой предмет</button>
          <button type="button" class="pill-btn" data-a="swap">⇄ Поменять с днём…</button><select data-swap hidden><option value="">— какой день? —</option>${D.days.filter(x => x.day !== day).map(x => `<option value="${x.day}">${+x.day.slice(8)} — ${esc(x.subject[1] || x.subject[0])}</option>`).join('')}</select>
          <button type="button" class="pill-btn" data-a="revert"${d.edited ? '' : ' hidden'}>↩ Вернуть как было</button></p>
        ${txt('tip', 'Совет дня', true)}
        ${d.extra ? `<div class="chadm-pal"><b>Палитра дня ЭКСТРА</b>${pal ? `<span>${pal.c.map(c => `<i style="background:${c[0]}" title="${esc(c[2])}"></i>`).join('')}</span><small>«${esc(pal.t[1])}» — очередь палитр: 🎨 Картины и палитры</small>` : '<small>очередь палитр: 🎨 Картины и палитры</small>'}</div>
          ${txt('extra', 'Ч/Б-условие дня ЭКСТРА')}`
        : `<fieldset class="chadm-f"><legend>Цвета дня: от 2 до 5</legend><div class="chadm-cols">${D.colors.map((c, k) => `<button type="button" data-col="${k}" aria-pressed="false"><i style="background:${c.hex}"></i>${esc(c.n[1])}</button>`).join('')}</div></fieldset>`}
        <label class="chadm-time">Время <select data-time>${D.times.map(x => `<option value="${x}">${x} мин</option>`).join('')}</select><small class="be-note">в режиме «Спокойно» — на 5 минут больше</small></label>
        ${txt('twist', 'Ч/Б-указание')}
      </div>
      <p class="be-dialog-acts"><button type="button" class="pill-btn pill-fill" data-a="save">💾 Сохранить</button><button type="button" class="pill-btn" data-a="close">Закрыть</button><span class="be-note" data-st role="status"></span></p>`;
    document.body.appendChild(dlg);
    const q = s => dlg.querySelector(s), st = q('[data-st]');
    let cols = d.colors.slice();
    function fill() {
      dlg.querySelectorAll('[data-f]').forEach(inp => { const v = d[inp.dataset.f]; inp.value = v ? v[LI[inp.dataset.l]] || '' : ''; });
      cols = d.colors.slice(); paintCols();
      q('[data-time]').value = String(d.time);
      q('[data-a=revert]').hidden = !d.edited;
      const tg = D.tags[i];
      q('[data-tags]').innerHTML = `${esc(POOL[tg.pool] || tg.pool)} · ${esc(CAT[tg.c] || tg.c)} · ${DIF[tg.d] || '—'} · семья «${esc(tg.f)}»${br.length ? `<br><span class="chadm-warn">⚠ ${br.map(r => RULE[r] || r).join('; ')}</span>` : ''}`;
    }
    function paintCols() { dlg.querySelectorAll('[data-col]').forEach(b => b.setAttribute('aria-pressed', cols.includes(+b.dataset.col))); }
    dlg.querySelectorAll('[data-col]').forEach(b => b.onclick = () => {
      const k = +b.dataset.col;
      if (cols.includes(k)) cols = cols.filter(x => x !== k); else if (cols.length < 5) cols.push(k); else { cols.shift(); cols.push(k); }
      paintCols();
    });
    const val = f => L3.map(l => (q(`[data-f="${f}"][data-l="${l}"]`) || {}).value || '');
    // «🌐 Перевести» — общий для кабинета (translate-btn.js): с RU на EN и LV всё, что в окне
    if (window.PPTranslateBtn) {
      const fs = ['subject', 'tip', 'twist', ...(d.extra ? ['extra'] : [])];
      q('[data-tr]').appendChild(window.PPTranslateBtn({ from: () => 'ru', about: 'short', texts: () => fs.map(f => val(f)[1]),
        fill: (l, arr) => fs.forEach((f, k) => { const inp = q(`[data-f="${f}"][data-l="${l}"]`); if (inp && arr[k]) inp.value = arr[k]; }) }));
    }
    const after = r => { // ответ сервера → обновить месяц (теги, нарушения) и окно
      st.textContent = '✓ Сохранено';
      return api('?m=' + ym).then(x => { D = x; d = D.days[i]; tagsNow(); fill(); draw(); });
    };
    const tagsNow = () => { br.length = 0; br.push(...((D.broken.find(b => b.day === day) || {}).rules || [])); };
    const run = async (fn) => { st.textContent = '…'; dlg.querySelectorAll('button').forEach(b => b.disabled = true); try { await fn(); } catch (e) { st.textContent = '⚠ ' + errText(e); } dlg.querySelectorAll('button').forEach(b => b.disabled = false); };
    q('[data-a=save]').onclick = () => run(async () => {
      if (!d.extra && (cols.length < 2 || cols.length > 5)) throw Object.assign(new Error('colors'), { code: 'colors' });
      const body = { day, subject: val('subject'), tip: val('tip'), twist: val('twist'), time: +q('[data-time]').value };
      if (d.extra) body.extra = val('extra'); else body.colors = cols;
      await after(await api('/day', body));
    });
    q('[data-a=reroll]').onclick = () => run(async () => { const r = await api('/reroll', { day, exclude: tried }); tried.push(r.day.item); await after(r); });
    q('[data-a=swap]').onclick = () => { const s = q('[data-swap]'); s.hidden = false; s.focus(); };
    q('[data-swap]').onchange = e => { const w = e.target.value; if (!w) return; run(async () => { await after(await api('/swap', { day, with: w })); e.target.value = ''; e.target.hidden = true; }); };
    q('[data-a=revert]').onclick = () => run(async () => { await after(await api('/revert', { day })); });
    q('[data-a=close]').onclick = () => dlg.close();
    dlg.addEventListener('close', () => dlg.remove());
    fill(); dlg.showModal();
  }
  window.PPChallengeAdmin = { mount };
})();
