// Кабинет → «🃏 Карточки» (admin.js открывает PPCardsAdmin.mount(main)): список, новая карточка, правка всего, номер, скрыть, удалить,
// множитель цены обычных и «⟳ Импортировать карточки с сайта». Сервер — /api/admin/cards/* (worker/cards.js), подробности — docs/cards.md.
(function () {
  const LANGS = ['ru', 'en', 'lv'];
  const RAR = [['common', '🤖 Обычная', 'нарисована ИИ; цена считается сама'], ['rare', '✎ Редкая', 'пиксель-арт Алины; цену ставите вы'], ['unique', '✎ Уникальная', 'акварель Алины; цену ставите вы']];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body, form) => {
    const r = await fetch('/api/admin/cards' + path, body || form ? { method: 'POST', credentials: 'same-origin', ...(form ? { body: form } : { headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error || r.status });
    return d;
  };
  const ERR = { owned: 'У карточки есть владелец — её можно только скрыть.', title: 'Впишите название хотя бы на одном языке.', collection: 'Выберите или впишите коллекцию.', img: 'Картинка должна быть загружена здесь или лежать в /images/cards/.', admin: 'Только для админа.' };
  const errText = e => ERR[e.code] || 'Не получилось (' + (e.code || e.message) + ').';
  let main = null, D = null, F = { collection: '', rarity: '' };
  const pick = (c, f, l) => c[f + '_' + l] || c[f + '_' + (c.src_lang || 'ru')] || c[f + '_ru'] || c[f + '_en'] || c[f + '_lv'] || '';
  const setName = s => s ? (s.ru || s[s.src_lang] || s.en || s.slug) : '';
  // строка базы → то, что понимает PPCards (плитка, окно)
  const view = c => ({ id: c.id, n: c.n, rarity: c.rarity, img: c.img, hidden: !!c.hidden, title: pick(c, 't', 'ru') || '(без названия)', desc: pick(c, 'd', 'ru'),
    set: setName(D.sets.find(s => s.slug === c.collection)), price: c.rarity === 'common' ? D.common : c.price || 0,
    stats: (c.stats || []).map(s => ({ name: s.ru || s[c.src_lang] || s.en || '', v: s.v })), owner: c.owner_id ? { nick: c.owner_nick } : null });
  const missing = c => LANGS.some(l => !c['t_' + l] || (pick(c, 'd', 'ru') && !c['d_' + l]) || (c.stats || []).some(s => !s[l]));

  async function mount(el) {
    main = el; main.innerHTML = '<p class="be-note">Загрузка…</p>';
    try { D = await api(''); } catch (e) { main.innerHTML = `<p class="be-note">${errText(e)}</p>`; return; }
    draw();
  }
  function draw() {
    const P = window.PPCards;
    const files = D.files || [], fresh = files.filter(f => !f.done), noTr = D.cards.filter(missing).length;
    main.innerHTML = `<section class="adm-box adm-pc">
      <p class="adm-r-bar"><button type="button" class="pill-btn pill-fill" data-a="new">＋ Новая карточка</button>
        <button type="button" class="pill-btn" data-a="import">⟳ Импортировать карточки с сайта</button> <span class="be-note" data-st></span></p>
      <p class="be-note">${files.length ? 'Коллекции из репозитория: ' + files.map(f => `<b>${esc(f.slug)}</b> ${f.done ? '✓ занесена' : '— <b>новая</b>, нажмите «Импортировать»'}`).join(' · ') + '.' : 'Коллекций в репозитории пока нет.'}
        Каждая заносится один раз; удалённые здесь карточки не вернутся.</p>
      ${noTr ? `<p class="be-note">⚠️ У ${noTr} карт. нет перевода на какой-то язык (на сайте там будет язык оригинала). <button type="button" class="pill-btn" data-a="trmiss">🌐 Перевести недостающее</button></p>` : ''}
      <div class="shop-row adm-pc-f"><span class="shop-lab">Показать</span><div class="shop-opts">
        <select data-f="collection"><option value="">Все коллекции</option>${D.sets.map(s => `<option value="${esc(s.slug)}">${esc(setName(s))}</option>`).join('')}</select>
        <select data-f="rarity"><option value="">Любая редкость</option>${RAR.map(r => `<option value="${r[0]}">${r[1]}</option>`).join('')}</select>
        <span class="be-note">${D.cards.length} карт., куплено ${D.cards.filter(c => c.owner_id).length}</span></div></div>
      <div class="pc-grid" data-grid></div></section>
      <details class="adm-fine"><summary>⚙️ Цена обычных карточек</summary><section class="adm-box">
        <p class="be-note">Обычная карточка 🤖 стоит как средняя вещь в магазине прямо сейчас (${D.avg} 🔘) × множитель, с округлением до 5. Редким и уникальным цену ставите вы в самой карточке.</p>
        <p class="adm-r-bar">Множитель <input type="number" min="10" max="1000" step="5" value="${D.mult}" data-mult style="width:80px"> % → обычная карточка сейчас <b data-mp>${D.common}</b> 🔘
          <button type="button" class="pill-btn" data-a="mult">💾 Сохранить</button></p>
        <p class="be-note">«Карточек одной коллекции в одни руки в первые сутки» — в <a href="#rules">📜 Все правила</a> → Магазин (сейчас: ${D.firstDay ? D.firstDay : 'без лимита'}).</p></section></details>`;
    const grid = main.querySelector('[data-grid]');
    D.cards.filter(c => (!F.collection || c.collection === F.collection) && (!F.rarity || c.rarity === F.rarity)).forEach(c => {
      const t = P.tile(view(c), { admin: true, onOpen: () => edit(c) });
      if (c.hidden) t.querySelector('.pc-foot').insertAdjacentHTML('afterbegin', '<span class="adm-tag">скрыта</span>');
      if (missing(c)) t.querySelector('.pc-foot').insertAdjacentHTML('beforeend', '<span class="adm-tag" title="Нет перевода на какой-то язык">🌐?</span>');
      grid.appendChild(t);
    });
    if (!grid.children.length) grid.innerHTML = '<p class="be-note">Карточек пока нет.</p>';
    main.querySelectorAll('[data-f]').forEach(s => { s.value = F[s.dataset.f]; s.onchange = () => { F[s.dataset.f] = s.value; draw(); }; });
    const st = main.querySelector('[data-st]');
    const run = async (btn, fn) => { btn.disabled = true; try { await fn(); } catch (e) { alert(errText(e)); } btn.disabled = false; };
    main.querySelector('[data-a="new"]').onclick = () => edit(null);
    main.querySelector('[data-a="import"]').onclick = e => run(e.target, async () => {
      st.textContent = 'Заношу и перевожу… (до минуты)';
      const r = await api('/import', {}); D = r; draw();
      const s = main.querySelector('[data-st]');
      s.textContent = r.imported.length ? '✓ Занесено: ' + r.imported.map(x => `${x.slug} (${x.cards} карт.${x.translated.length < 2 ? ', перевод не на все языки' : ', с переводом'})`).join(', ') : r.errors.length ? 'Ошибка: ' + r.errors.map(x => x.slug + ' — ' + x.error).join(', ') : 'Новых коллекций нет — всё уже занесено.';
      if (r.removed) s.textContent += ` Убраны повторы: ${r.removed} карт.`;
    });
    const tm = main.querySelector('[data-a="trmiss"]');
    if (tm) tm.onclick = e => run(e.target, async () => { st.textContent = 'Перевожу…'; D = await api('/translate-missing', {}); draw(); });
    const mi = main.querySelector('[data-mult]'), mp = main.querySelector('[data-mp]');
    mi.oninput = () => { mp.textContent = Math.max(5, Math.round(D.avg * (Number(mi.value) || 0) / 100 / 5) * 5); };
    main.querySelector('[data-a="mult"]').onclick = e => run(e.target, async () => { D = await api('/mult', { mult: Number(mi.value) || 100 }); draw(); });
  }

  // окно правки: картинка, номер, коллекция, редкость, цена, тексты на трёх языках со статами, «🌐 Перевести», скрыть; внизу — удалить
  function edit(c) {
    const isNew = !c;
    c = c || { n: D.nextN, rarity: 'common', collection: F.collection || (D.sets[D.sets.length - 1] || {}).slug || '', src_lang: 'ru', stats: [{ v: 5 }, { v: 5 }, { v: 5 }], price: 0, img: '' };
    const S = JSON.parse(JSON.stringify(c)); // черновик
    S.stats = [0, 1, 2].map(i => Object.assign({ v: 5 }, (c.stats || [])[i] || {}));
    let tab = S.src_lang || 'ru', newSet = null;
    const d = document.createElement('dialog'); d.className = 'be-dialog adm-card-dlg';
    const field = (l, k) => k === 't' ? S['t_' + l] || '' : S['d_' + l] || '';
    function render() {
      d.innerHTML = `<h2>${isNew ? '＋ Новая карточка' : '🃏 Карточка №' + c.n}</h2>
      <div class="adm-card-ed"><div class="adm-card-pv"><div data-pv></div>
        <p><label class="pill-btn">⬆ Загрузить картинку<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden data-up></label></p>
        <p class="be-note">Картинка 5:7. Обычные — пиксель-арт 120×168. Рамку, номер и пометку сайт рисует сам.</p>
        <label class="be-note">или путь: <input type="text" data-k="img" value="${esc(S.img)}" placeholder="/images/cards/…/01.png" style="width:100%"></label></div>
      <div class="adm-card-fields">
        <p class="adm-r-bar">${isNew ? `Номер: <b>№${D.nextN}</b> <span class="be-note">(следующий)</span>` : `Номер № <input type="number" min="1" value="${c.n}" data-num style="width:80px"> <button type="button" class="pill-btn" data-a="num">Сменить номер</button><br><small class="be-note">Номер занят — карточки поменяются номерами.</small>`}</p>
        <p class="adm-r-bar">Коллекция <select data-set>${D.sets.map(s => `<option value="${esc(s.slug)}"${s.slug === S.collection && !newSet ? ' selected' : ''}>${esc(setName(s))}</option>`).join('')}<option value="+"${newSet || !D.sets.length ? ' selected' : ''}>＋ Новая коллекция…</option></select>
          ${newSet || !D.sets.length ? `<input type="text" data-newset placeholder="Название на ${tab.toUpperCase()}" value="${esc((newSet || {})[tab] || '')}">` : ''}</p>
        <p class="adm-r-bar adm-card-rar">${RAR.map(r => `<button type="button" class="pill-btn" data-rar="${r[0]}" aria-pressed="${S.rarity === r[0]}" title="${r[2]}">${r[1]}</button>`).join('')}</p>
        <p class="adm-r-bar">${S.rarity === 'common' ? `Цена: <b>${D.common} 🔘</b> <small class="be-note">считается сама (средняя вещь × ${D.mult} %)</small>` : `Цена <input type="number" min="0" step="5" value="${S.price || 0}" data-k="price" style="width:100px"> 🔘`}</p>
        <p class="adm-r-bar adm-card-tabs" role="tablist">${LANGS.map(l => `<button type="button" class="pill-btn" data-tab="${l}" aria-pressed="${tab === l}">${l.toUpperCase()}${S.src_lang === l ? ' ✎' : ''}</button>`).join('')}
          <span class="be-note">✎ — язык, на котором писали</span></p>
        <label>Название <input type="text" data-t="t" maxlength="80" value="${esc(field(tab, 't'))}" style="width:100%"></label>
        <label>Описание <textarea data-t="d" maxlength="700" rows="3" style="width:100%">${esc(field(tab, 'd'))}</textarea></label>
        <div class="adm-card-stats">${S.stats.map((s, i) => `<label>Стат ${i + 1} <input type="text" data-sn="${i}" maxlength="30" value="${esc(s[tab] || '')}" placeholder="название"> <input type="number" min="1" max="10" data-sv="${i}" value="${s.v}" style="width:60px"> /10</label>`).join('')}</div>
        <p class="adm-r-bar" data-tr></p>
        <label class="adm-r-chk"><input type="checkbox" data-k="hidden"${S.hidden ? ' checked' : ''}> Скрыта (на сайте её не видно)</label>
      </div></div>
      <p class="be-dialog-acts"><button type="button" class="pill-btn pill-fill" data-a="save">💾 Сохранить</button><button type="button" class="pill-btn" data-a="close">Отмена</button></p>
      ${isNew ? '' : `<section class="adm-danger"><p>${c.owner_id ? `У карточки есть владелец (<b>@${esc(c.owner_nick || '?')}</b>) — удалить нельзя, только скрыть.` : 'Удалить карточку навсегда (у неё нет владельца).'}</p>
        <button type="button" class="pill-btn" data-a="del"${c.owner_id ? ' disabled' : ''}>🗑 Удалить карточку</button></section>`}`;
      const pv = d.querySelector('[data-pv]'); pv.appendChild(window.PPCards.card(Object.assign(view(Object.assign({}, S, { stats: S.stats })), { n: isNew ? D.nextN : c.n }), true));
      // «🌐 Перевести»: с языка, на котором писали, на два других (название, описание, статы, новая коллекция)
      const src = () => S.src_lang;
      const texts = () => [S['t_' + src()] || '', S['d_' + src()] || '', ...S.stats.map(s => s[src()] || ''), (newSet || {})[src()] || ''];
      const tb = window.PPTranslateBtn({ from: src, texts, about: 'cards', fill: (l, tr) => { S['t_' + l] = tr[0]; S['d_' + l] = tr[1]; S.stats.forEach((s, i) => { s[l] = tr[2 + i]; }); if (newSet) newSet[l] = tr[5]; }, done: render });
      d.querySelector('[data-tr]').appendChild(tb);
      bind();
    }
    function grab() { // поля вкладки → черновик
      d.querySelectorAll('[data-t]').forEach(i => { S[i.dataset.t + '_' + tab] = i.value.trim(); });
      d.querySelectorAll('[data-sn]').forEach(i => { S.stats[+i.dataset.sn][tab] = i.value.trim(); });
      d.querySelectorAll('[data-sv]').forEach(i => { S.stats[+i.dataset.sv].v = Math.max(1, Math.min(10, Math.round(Number(i.value) || 1))); });
      const img = d.querySelector('[data-k="img"]'); if (img) S.img = img.value.trim();
      const pr = d.querySelector('[data-k="price"]'); if (pr) S.price = Math.max(0, Math.floor(Number(pr.value) || 0));
      S.hidden = d.querySelector('[data-k="hidden"]').checked ? 1 : 0;
      const ns = d.querySelector('[data-newset]'); if (ns) { newSet = newSet || {}; newSet[tab] = ns.value.trim(); }
      // язык оригинала — первая вкладка, где есть название (если на исходном его нет)
      if (!S['t_' + S.src_lang]) { const l = LANGS.find(x => S['t_' + x]); if (l) S.src_lang = l; }
    }
    function bind() {
      d.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { grab(); tab = b.dataset.tab; render(); });
      d.querySelectorAll('[data-rar]').forEach(b => b.onclick = () => { grab(); S.rarity = b.dataset.rar; render(); });
      d.querySelector('[data-set]').onchange = e => { grab(); if (e.target.value === '+') newSet = newSet || {}; else { newSet = null; S.collection = e.target.value; } render(); };
      d.querySelector('[data-a="close"]').onclick = () => d.close();
      d.querySelector('[data-up]').onchange = async e => {
        const f = e.target.files[0]; if (!f) return;
        grab(); const fd = new FormData(); fd.append('file', f);
        try { S.img = (await api('/upload', null, fd)).url; render(); } catch (er) { alert(er.code === 'big' ? 'Картинка больше 4 МБ.' : errText(er)); }
      };
      d.querySelectorAll('[data-t], [data-sn], [data-sv], [data-k="img"]').forEach(i => i.addEventListener('change', () => { grab(); const pv = d.querySelector('[data-pv]'); pv.innerHTML = ''; pv.appendChild(window.PPCards.card(Object.assign(view(S), { n: isNew ? D.nextN : c.n }), true)); }));
      const nb = d.querySelector('[data-a="num"]');
      if (nb) nb.onclick = async () => {
        const n = Math.floor(Number(d.querySelector('[data-num]').value) || 0); if (n < 1 || n === c.n) return;
        const other = D.cards.find(x => x.n === n);
        if (other && !confirm(`№${n} занят карточкой «${pick(other, 't', 'ru')}». Поменять их номерами (она станет №${c.n})?`)) return;
        try { D = await api('/number', { id: c.id, n }); c = D.cards.find(x => x.id === c.id) || c; draw(); render(); } catch (e) { alert(errText(e)); }
      };
      d.querySelector('[data-a="save"]').onclick = async e => {
        grab(); e.target.disabled = true;
        const body = { id: isNew ? 0 : c.id, rarity: S.rarity, price: S.price, img: S.img, hidden: !!S.hidden, src_lang: S.src_lang, collection: newSet ? '' : S.collection,
          t: Object.fromEntries(LANGS.map(l => [l, S['t_' + l] || ''])), d: Object.fromEntries(LANGS.map(l => [l, S['d_' + l] || ''])), stats: S.stats };
        if (newSet) body.setName = newSet;
        try { D = await api('/save', body); d.close(); draw(); } catch (er) { alert(errText(er)); e.target.disabled = false; }
      };
      const del = d.querySelector('[data-a="del"]');
      if (del) del.onclick = async () => {
        if (!confirm(`Удалить карточку №${c.n} «${pick(c, 't', 'ru')}» навсегда?`)) return;
        try { D = await api('/delete', { id: c.id }); d.close(); draw(); } catch (e) { alert(errText(e)); }
      };
    }
    render();
    d.addEventListener('close', () => d.remove());
    document.body.appendChild(d); d.showModal();
  }
  window.PPCardsAdmin = { mount };
})();
