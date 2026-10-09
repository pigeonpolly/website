// Редактор блога (только для админа): список статей, модерация комментариев, строгий режим,
// визуальный редактор с вкладками RU/EN/LV, перевод RU → EN/LV (Workers AI), картинки в R2.
(function () {
  const app = document.getElementById('be-app');
  const LANGS = [['ru', 'RU'], ['en', 'EN'], ['lv', 'LV']];
  const PANE_NAME = { ru: '🇷🇺 Русская версия', en: '🇬🇧 English version', lv: '🇱🇻 Latviešu versija' };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body, raw) => {
    const opt = { credentials: 'same-origin' };
    if (raw) Object.assign(opt, { method: 'POST', body: raw });
    else if (body) Object.assign(opt, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const r = await fetch('/api/' + path, opt);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || r.status); e.code = d.error || String(r.status); throw e; }
    return d;
  };
  const fmt = ts => ts ? new Date(ts * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const ERR = {
    google: 'Google Переводчик сейчас не ответил — попробуйте ещё раз или нажмите «✨ Gemini».', google_limit: 'Google Переводчик просит передохнуть — подождите пару минут или нажмите «✨ Gemini».',
    ai_limit: 'Бесплатный лимит Gemini на сейчас закончился — попробуйте через час или завтра.',
    ai: 'Gemini сейчас не отвечает (бывает, когда он перегружен). Попробуйте ещё раз через пару минут.',
    no_key: 'Перевод не подключён: нажмите в списке статей «⚙ Перевод (Gemini)» и вставьте ключ.', bad_key: 'Google не принял ключ Gemini — проверьте его в «⚙ Перевод (Gemini)».',
    media: 'Хранилище картинок не подключено.', big: 'Картинка слишком большая (до 8 МБ).', type: 'Подходят JPG, PNG, WebP и GIF.',
    title: 'Нужен заголовок.', too_big: 'Статья слишком большая для сохранения (больше ~900 000 символов вместе с разметкой).', save: 'сервер не подтвердил сохранение.', fetch: 'Не удалось скопировать картинку.', login: 'Сессия закончилась — войдите снова.', admin: 'Нужен вход администратора.',
  };
  const errText = e => ERR[e.code] || 'Что-то пошло не так (' + esc(e.code || e.message) + ').';
  let flash = '', state = null, dirty = false, knownTags = {}, knownTagCounts = {}, dashTab = 'published', tagFilter = null, langFilter = 'all', picked = new Set();
  // все теги из статей: { ru: ['акварель', …], … } и счётчики
  let sections = [], tagDict = [], tagSort = 'unchecked'; // словарь тегов: [{ en, ru, lv, count, checked, src, created }]
  function tagsByLang() {
    knownTagCounts = {};
    for (const l of ['ru', 'en', 'lv']) {
      const c = knownTagCounts[l] = {};
      for (const p of (state && state.posts) || []) for (const t of String(p['tags_' + l] || '').split(',').map(x => x.trim()).filter(Boolean)) c[t] = (c[t] || 0) + 1;
    }
    const out = Object.fromEntries(Object.entries(knownTagCounts).map(([l, c]) => [l, Object.keys(c).sort()]));
    out.en = [...new Set([...(out.en || []), ...tagDict.map(x => x.en)])].sort();
    return out;
  }
  window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  // ---------- вход ----------
  async function start() {
    let me, cfg;
    try { [me, cfg] = await Promise.all([api('me'), api('config')]); } catch (e) { app.innerHTML = '<p class="be-note">Сервер блога недоступен.</p>'; return; }
    if (!me.user || !me.user.admin) {
      app.innerHTML = `<div class="be-card"><p>Редактор доступен только автору сайта. Войдите тем же Google-аккаунтом, что и в челлендже.</p>
        <div id="be-g"></div>${cfg.dev ? '<button class="pill-btn" type="button" id="be-dev">dev: войти как admin</button>' : ''}</div>`;
      const dev = document.getElementById('be-dev');
      dev && dev.addEventListener('click', async () => { await api('login', { credential: 'dev:admin' }); start(); });
      const go = () => {
        window.google.accounts.id.initialize({ client_id: cfg.clientId, ux_mode: 'popup', callback: async r => { await api('login', { credential: r.credential }); start(); } });
        window.google.accounts.id.renderButton(document.getElementById('be-g'), { theme: 'outline', size: 'large', shape: 'pill', locale: 'ru' });
      };
      if (window.google?.accounts?.id) go();
      else { const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.onload = go; document.head.appendChild(s); }
      return;
    }
    route();
  }
  window.addEventListener('hashchange', () => {
    if (dirty && !confirm('Есть несохранённые изменения. Уйти без сохранения?')) return;
    dirty = false; route();
  });
  function route() {
    const h = location.hash.slice(1);
    if (h === 'new') return editor(null);
    if (/^\d+$/.test(h)) return editor(Number(h));
    return dashboard();
  }

  // ---------- список статей ----------
  // меню «⋯» в списке статей закрывается кликом мимо
  document.addEventListener('click', e => { document.querySelectorAll('.be-menu[open]').forEach(d => { if (!d.contains(e.target)) d.open = false; }); });
  const dashboardLocal = () => dashboard(false); // перерисовать без повторной загрузки (галочки, фильтры)
  async function dashboard(reload = true) {
    if (reload || !state) {
    app.innerHTML = '<p class="be-note">Загрузка…</p>';
    try { [state, tagDict, sections] = await Promise.all([api('blog/admin/posts'), api('blog/admin/tags').then(r => r.tags).catch(() => []), api('blog/admin/sections').then(r => r.sections).catch(() => [])]); } catch (e) { app.innerHTML = `<p class="be-note">${errText(e)}</p>`; return; }
    }
    const pend = state.pending;
    const pub = state.posts.filter(p => p.status === 'published'), drafts = state.posts.filter(p => p.status !== 'published');
    knownTags = tagsByLang();
    const tagCount = tagDict.length;
    const postsHtml = list => {
      if (tagFilter) list = state.posts.filter(p => String(p.tags_en || '').split(',').map(x => x.trim().toLowerCase()).includes(tagFilter.t));
      // фильтр по переводам: все / переведены на все три языка / нужен перевод
      const full = p => ['ru', 'en', 'lv'].every(l => p['t_' + l]);
      const LF = [['all', 'Все статьи', () => true], ['full', 'Переведены полностью', full], ['part', 'Нужен перевод', p => !full(p)]];
      const base = list;
      if (!LF.some(([k]) => k === langFilter)) langFilter = 'all';
      list = base.filter(LF.find(([k]) => k === langFilter)[2]);
      const bar = base.length ? `<div class="be-seg" role="group" aria-label="Переводы">${LF.map(([k, n, f]) =>
        `<button type="button" data-lf="${k}" aria-pressed="${langFilter === k}">${n} <span>${base.filter(f).length}</span></button>`).join('')}</div>` : '';
      const head = bar + (tagFilter ? `<p class="be-filter">Статьи с тегом <b>#${esc(tagFilter.t)}</b> · <button type="button" class="bc-link" data-unfilter>показать все</button></p>` : '');
      if (!list.length) return head + `<p class="be-note">${langFilter === 'part' ? 'Все статьи переведены 🎉' : langFilter === 'full' ? 'Полностью переведённых статей пока нет.' : dashTab === 'draft' ? 'Черновиков нет.' : 'Опубликованных статей пока нет.'}</p>`;
      // галочки слева → действия с выбранными; раздел меняется прямо в строке; остальное — в меню «⋯»
      const ids = new Set(list.map(p => p.id));
      for (const id of [...picked]) if (!ids.has(id)) picked.delete(id);
      const secOpts = cur => `<option value="">— без раздела —</option>${sections.map(x => `<option value="${esc(x.slug)}"${x.slug === cur ? ' selected' : ''}>${esc(x.ru || x.en)}</option>`).join('')}`;
      const n = picked.size;
      const bulk = `<div class="be-bulk${n ? ' on' : ''}"><span>${n ? `Выбрано: <b>${n}</b>` : 'Отметьте статьи галочками, чтобы сделать что-то сразу с несколькими'}</span>
        ${n ? `<select id="be-bulk" aria-label="Что сделать с выбранными"><option value="">Что сделать…</option>
          ${sections.length ? `<optgroup label="Перенести в раздел">${sections.map(x => `<option value="section:${esc(x.slug)}">→ ${esc(x.ru || x.en)}</option>`).join('')}<option value="section:">→ без раздела</option></optgroup>` : ''}
          <optgroup label="Избранное"><option value="feature">★ Добавить в избранное</option><option value="unfeature">☆ Убрать из избранного</option></optgroup>
          <optgroup label="Статус">${dashTab === 'draft' ? '<option value="publish">Опубликовать</option>' : '<option value="draft">Снять с публикации (в черновики)</option>'}</optgroup>
          <optgroup label="Опасно"><option value="delete">🗑 Удалить</option></optgroup></select>
          <button type="button" class="bc-link" data-unpick>снять выбор</button>` : ''}</div>`;
      return head + bulk + `<table class="be-table be-posts"><thead><tr><th class="be-ck"><input type="checkbox" id="be-pickall" aria-label="Выбрать все" ${n && n === list.length ? 'checked' : ''}></th><th>Статья</th><th>Языки</th><th>Раздел</th><th>Дата</th><th title="лайки">♥</th><th title="просмотры">👁</th><th title="комментарии">💬</th><th></th></tr></thead><tbody>
        ${list.map(p => `<tr data-id="${p.id}"${picked.has(p.id) ? ' class="picked"' : ''}><td class="be-ck"><input type="checkbox" data-pick ${picked.has(p.id) ? 'checked' : ''} aria-label="Выбрать"></td>
          <td><button class="be-star" data-star aria-pressed="${!!p.featured}" title="Избранное: показывать справа на главной">${p.featured ? '★' : '☆'}</button> <a href="#${p.id}"><b>${esc(p.t_ru || p.t_en || p.t_lv || '(без названия)')}</b></a></td>
          <td><span class="be-langs">${['ru', 'en', 'lv'].map(l => p['t_' + l] ? `<i class="on" title="Есть на ${l.toUpperCase()}">✓ ${l.toUpperCase()}</i>` : `<i title="Нет перевода на ${l.toUpperCase()}">${l.toUpperCase()}</i>`).join('')}</span></td>
          <td><select class="be-rowsec" data-rowsec aria-label="Раздел">${secOpts(p.section || '')}</select></td>
          <td>${fmt(p.published_at || p.updated_at)}</td>
          <td>${p.likes}</td><td>${p.views}</td><td>${p.comments}</td>
          <td><details class="be-menu"><summary aria-label="Ещё">⋯</summary><div><a href="#${p.id}">✎ Изменить</a><a href="/ru/blog/${esc(p.slug)}/" target="_blank">↗ Открыть на сайте</a><button type="button" class="be-danger" data-delpost>🗑 Удалить</button></div></details></td></tr>`).join('')}
      </tbody></table>`;
    };
    // словарь тегов: английский тег (как в статьях) и его перевод — правится прямо в таблице
    // разделы блога (как коллекции на Patreon)
    const sectionsHtml = () => `<p class="be-note">Разделы — крупные темы блога (как коллекции на Patreon). У каждой статьи один раздел; читатели видят их кнопками над списком статей. Названия на RU и LV подставляются сами — их можно поправить прямо здесь.</p>
      <form class="be-newsec" id="be-newsec"><input type="text" name="en" placeholder="Название нового раздела (на английском), например Weekly Polly" required maxlength="60"><button class="pill-btn pill-fill" type="submit">＋ Добавить раздел</button></form>
      ${sections.length ? `<table class="be-table be-tagtable"><thead><tr><th>EN</th><th>RU</th><th>LV</th><th>Статей</th><th>Порядок</th><th></th></tr></thead><tbody>
      ${sections.map((r, i) => `<tr data-s="${esc(r.slug)}"><td><input type="text" class="be-tr-in" data-f="en" value="${esc(r.en)}"></td><td><input type="text" class="be-tr-in" data-f="ru" value="${esc(r.ru)}"></td><td><input type="text" class="be-tr-in" data-f="lv" value="${esc(r.lv)}"></td>
        <td>${r.count}</td><td class="be-acts"><button type="button" class="be-ico" data-move="-1" ${i ? '' : 'disabled'} aria-label="Выше">↑</button><button type="button" class="be-ico" data-move="1" ${i < sections.length - 1 ? '' : 'disabled'} aria-label="Ниже">↓</button></td>
        <td><button type="button" class="be-ico be-danger" data-delsec aria-label="Удалить раздел">✕</button></td></tr>`).join('')}</tbody></table>` : '<p class="be-note">Разделов пока нет.</p>'}`;
    const SRC = { glossary: 'словарь', auto: 'автоперевод', manual: 'вы' };
    const sorted = () => [...tagDict].sort({
      unchecked: (a, b) => a.checked - b.checked || b.count - a.count || a.en.localeCompare(b.en),
      count: (a, b) => b.count - a.count || a.en.localeCompare(b.en),
      recent: (a, b) => (b.created || 0) - (a.created || 0) || a.en.localeCompare(b.en),
      abc: (a, b) => a.en.localeCompare(b.en),
    }[tagSort]);
    const tagsHtml = () => tagDict.length ? `<p class="be-note">Теги в статьях — на английском. Перевод на RU и LV общий для всех статей: исправьте в таблице, и он поменяется везде (сохраняется сам).
        Нажмите на тег, чтобы увидеть его статьи.</p>
      <div class="be-tagbar"><label>Сортировка: <select id="be-tagsort">${[['unchecked', 'сначала непроверенные'], ['count', 'по частоте'], ['recent', 'сначала новые'], ['abc', 'по алфавиту']].map(([k, n]) => `<option value="${k}"${tagSort === k ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
        <span class="be-note">Не проверено: <b>${tagDict.filter(x => !x.checked).length}</b> из ${tagDict.length}</span>
        <button type="button" class="pill-btn" id="be-tags-tr">🌐 Перевести пустые</button></div>
      <table class="be-table be-tagtable"><thead><tr><th>EN (в статьях)</th><th>RU</th><th>LV</th><th>Статей</th><th>Проверено</th><th></th></tr></thead><tbody>
      ${sorted().map(r => `<tr data-t="${esc(r.en)}" class="${r.checked ? 'ok' : 'todo'}"><td><button type="button" class="be-tagname" data-show title="Показать статьи">#${esc(r.en)}</button></td>
        <td><input type="text" class="be-tr-in" data-l="ru" value="${esc(r.ru)}" placeholder="перевод…" aria-label="Перевод #${esc(r.en)} на русский"></td>
        <td><input type="text" class="be-tr-in" data-l="lv" value="${esc(r.lv)}" placeholder="tulkojums…" aria-label="Перевод #${esc(r.en)} на латышский"></td>
        <td>${r.count}</td>
        <td><label class="be-chk"><input type="checkbox" data-checked ${r.checked ? 'checked' : ''}> <small>${SRC[r.src] || ''}</small></label></td>
        <td class="be-acts"><button type="button" class="be-ico" data-ren title="Переименовать английский тег во всех статьях" aria-label="Переименовать #${esc(r.en)}">✎</button><button type="button" class="be-ico be-danger" data-deltag title="Удалить из всех статей" aria-label="Удалить #${esc(r.en)}">✕</button></td></tr>`).join('')}
      </tbody></table>` : '<p class="be-note">Тегов пока нет — они появятся, когда вы добавите их в статьи.</p>';
    const flashHtml = flash ? `<p class="be-flash" role="status">${flash}</p>` : ''; flash = '';
    app.innerHTML = `${flashHtml}<div class="be-top">
        <a class="pill-btn pill-fill" href="#new">＋ Новая статья</a>
        <button type="button" class="pill-btn" id="be-gkey">⚙ Перевод (Gemini)${state.gemini ? ' ✓' : ''}</button>
      </div>
      ${pend.length ? `<section class="be-card be-pend"><h2>Комментарии со ссылками ждут проверки (${pend.length})</h2><ol>${pend.map(c => `
        <li data-cid="${c.id}"><p><b>${esc(c.name)}</b> → <a href="/ru/blog/${esc(c.slug)}/#comments" target="_blank">${esc(c.t_ru)}</a> · ${fmt(c.created_at)}</p>
        <p class="be-ctext">${esc(c.body)}</p><p><button class="pill-btn" data-ok>Одобрить</button> <button class="pill-btn be-danger" data-del>Удалить</button></p></li>`).join('')}</ol></section>` : ''}
      <section class="be-card">
        <div class="be-dtabs" role="tablist">${[['published', 'Опубликованные', pub.length], ['draft', 'Черновики', drafts.length], ['sections', 'Разделы', sections.length], ['tags', 'Теги', tagCount]].map(([k, n, c]) =>
          `<button type="button" role="tab" data-dtab="${k}" aria-selected="${dashTab === k}">${n} <span>${c}</span></button>`).join('')}</div>
        ${dashTab === 'tags' ? tagsHtml() : dashTab === 'sections' ? sectionsHtml() : postsHtml(dashTab === 'draft' ? drafts : pub)}
      </section>
      ${state.media ? '' : '<p class="be-note">⚠ Хранилище картинок (R2) не подключено — загрузка картинок не заработает.</p>'}`;
    app.querySelectorAll('[data-dtab]').forEach(b => b.addEventListener('click', () => { dashTab = b.dataset.dtab; tagFilter = null; picked.clear(); dashboard(); }));
    app.querySelectorAll('[data-lf]').forEach(b => b.addEventListener('click', () => { langFilter = b.dataset.lf; dashboardLocal(); }));
    const unf = app.querySelector('[data-unfilter]'); unf && unf.addEventListener('click', () => { tagFilter = null; dashboard(); });
    app.querySelectorAll('[data-show]').forEach(b => b.addEventListener('click', () => { tagFilter = { t: b.closest('tr').dataset.t }; dashTab = 'published'; dashboard(); }));
    app.querySelectorAll('[data-ren], [data-deltag]').forEach(b => b.addEventListener('click', async () => {
      const t = b.closest('tr').dataset.t, n = (tagDict.find(x => x.en === t) || {}).count || 0;
      let to = '';
      if (b.hasAttribute('data-ren')) { to = prompt(`Новое английское название для #${t}:`, t); if (to === null || !to.trim() || to.trim() === t) return; }
      else if (!confirm(`Убрать тег #${t} из ${n} стат${n === 1 ? 'ьи' : 'ей'}?`)) return;
      try { await api('blog/admin/tag', { from: t, to }); } catch (e) { alert(errText(e)); }
      dashboard();
    }));
    // перевод тега сохраняется сам, когда уходите из поля; правка руками = «проверено»
    const saveRow = async (tr, checked) => {
      const row = tagDict.find(x => x.en === tr.dataset.t);
      tr.querySelectorAll('.be-tr-in').forEach(i => { row[i.dataset.l] = i.value.trim().toLowerCase(); });
      row.checked = checked;
      await api('blog/admin/tag-set', { en: row.en, ru: row.ru, lv: row.lv, checked });
      tr.className = checked ? 'ok' : 'todo'; tr.querySelector('[data-checked]').checked = checked;
      if (checked) tr.querySelector('.be-chk small').textContent = 'вы';
    };
    app.querySelectorAll('.be-tr-in').forEach(inp => inp.addEventListener('change', async () => {
      inp.classList.remove('saved');
      try { await saveRow(inp.closest('tr'), true); inp.classList.add('saved'); } catch (e) { alert(errText(e)); }
    }));
    app.querySelectorAll('[data-checked]').forEach(c => c.addEventListener('change', async () => {
      try { await saveRow(c.closest('tr'), c.checked); } catch (e) { c.checked = !c.checked; alert(errText(e)); }
    }));
    // разделы: добавить, переименовать, порядок, удалить
    const ns = app.querySelector('#be-newsec');
    ns && ns.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = ns.querySelector('button'); btn.disabled = true; btn.textContent = 'Добавляю и перевожу…';
      try { await api('blog/admin/section-set', { en: ns.en.value.trim() }); flash = 'Раздел добавлен ✓'; } catch (err) { alert(errText(err)); }
      dashboard();
    });
    app.querySelectorAll('tr[data-s] .be-tr-in').forEach(inp => inp.addEventListener('change', async () => {
      const tr = inp.closest('tr'), r = sections.find(x => x.slug === tr.dataset.s);
      tr.querySelectorAll('.be-tr-in').forEach(i => { r[i.dataset.f] = i.value.trim(); });
      try { await api('blog/admin/section-set', { slug: r.slug, en: r.en, ru: r.ru, lv: r.lv }); inp.classList.add('saved'); } catch (err) { alert(errText(err)); }
    }));
    app.querySelectorAll('[data-move]').forEach(b => b.addEventListener('click', async () => {
      const i = sections.findIndex(x => x.slug === b.closest('tr').dataset.s), j = i + Number(b.dataset.move);
      const list = [...sections]; [list[i], list[j]] = [list[j], list[i]];
      for (const [k, r] of list.entries()) await api('blog/admin/section-set', { slug: r.slug, en: r.en, ru: r.ru, lv: r.lv, sort: k + 1 });
      dashboard();
    }));
    app.querySelectorAll('[data-delsec]').forEach(b => b.addEventListener('click', async () => {
      const r = sections.find(x => x.slug === b.closest('tr').dataset.s);
      if (!confirm(`Удалить раздел «${r.en}»? Статьи останутся, просто без раздела.`)) return;
      await api('blog/admin/section-delete', { slug: r.slug }); dashboard();
    }));
    const ts = app.querySelector('#be-tagsort'); ts && ts.addEventListener('change', () => { tagSort = ts.value; dashboard(); });
    const ttr = app.querySelector('#be-tags-tr');
    ttr && ttr.addEventListener('click', async () => {
      ttr.disabled = true; ttr.textContent = 'Перевожу…';
      try { await api('blog/admin/tags-translate', {}); } catch (e) { alert(errText(e)); }
      dashboard();
    });
    app.querySelector('#be-gkey').addEventListener('click', () => geminiPanel());
    app.querySelectorAll('.be-pend [data-ok], .be-pend [data-del]').forEach(b => b.addEventListener('click', async () => {
      const li = b.closest('li');
      if (b.hasAttribute('data-del') && !confirm('Удалить комментарий?')) return;
      await api('blog/admin/comment', { id: Number(li.dataset.cid), action: b.hasAttribute('data-ok') ? 'approve' : 'delete' });
      dashboard();
    }));
    app.querySelectorAll('[data-star]').forEach(b => b.addEventListener('click', async () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      await api('blog/admin/feature', { id: Number(b.closest('tr').dataset.id), featured: on });
      b.setAttribute('aria-pressed', on); b.textContent = on ? '★' : '☆';
    }));
    // выбор галочками и действия с выбранными
    const pick = () => { const y = scrollY; dashboardLocal(); scrollTo(0, y); };
    app.querySelectorAll('[data-pick]').forEach(c => c.addEventListener('change', () => { const id = Number(c.closest('tr').dataset.id); c.checked ? picked.add(id) : picked.delete(id); pick(); }));
    const all = app.querySelector('#be-pickall');
    all && all.addEventListener('change', () => { app.querySelectorAll('tr[data-id]').forEach(tr => { const id = Number(tr.dataset.id); all.checked ? picked.add(id) : picked.delete(id); }); pick(); });
    const unp = app.querySelector('[data-unpick]'); unp && unp.addEventListener('click', () => { picked.clear(); pick(); });
    const bulkSel = app.querySelector('#be-bulk');
    bulkSel && bulkSel.addEventListener('change', async () => {
      const v = bulkSel.value; if (!v) return;
      const [action, value] = v.split(':'), n = picked.size;
      const word = n === 1 ? 'статью' : n < 5 ? 'статьи' : 'статей';
      if (action === 'delete' && !confirm(`Удалить ${n} ${word} вместе с комментариями и лайками? Это нельзя отменить.`)) { bulkSel.value = ''; return; }
      if (action === 'draft' && !confirm(`Снять с публикации ${n} ${word}? Читатели перестанут их видеть.`)) { bulkSel.value = ''; return; }
      bulkSel.disabled = true;
      try {
        await api('blog/admin/bulk', { ids: [...picked], action, value: value || '' });
        flash = `✓ Готово: ${n} ${word} — ${bulkSel.selectedOptions[0].textContent.trim()}`;
        picked.clear();
      } catch (e) { alert(errText(e)); }
      const y = scrollY; await dashboard(); scrollTo(0, y);
    });
    // раздел прямо в строке
    app.querySelectorAll('[data-rowsec]').forEach(sel => sel.addEventListener('change', async () => {
      const tr = sel.closest('tr'), id = Number(tr.dataset.id);
      sel.classList.remove('saved'); sel.disabled = true;
      try { await api('blog/admin/bulk', { ids: [id], action: 'section', value: sel.value }); (state.posts.find(x => x.id === id) || {}).section = sel.value; sel.classList.add('saved'); } catch (e) { alert(errText(e)); }
      sel.disabled = false;
    }));
    // меню «⋯»: открыто только одно, закрывается кликом мимо
    app.querySelectorAll('.be-menu').forEach(d => d.addEventListener('toggle', () => { if (d.open) app.querySelectorAll('.be-menu[open]').forEach(x => { if (x !== d) x.open = false; }); }));
    app.querySelectorAll('[data-delpost]').forEach(b => b.addEventListener('click', async () => {
      const tr = b.closest('tr');
      if (!confirm('Удалить статью вместе с комментариями и лайками? Это нельзя отменить.')) return;
      await api('blog/admin/delete', { id: Number(tr.dataset.id) });
      dashboard();
    }));
  }

  // ---------- редактор статьи ----------
  // форматирование — всплывает над выделенным текстом; вставка — кнопкой ＋ на пустой строке
  const TOOLS = [
    ['bold', 'Жирный', '<b>Ж</b>'], ['italic', 'Курсив', '<i>К</i>'], ['link', 'Ссылка', '🔗'], ['h2', 'Заголовок', 'H2'], ['h3', 'Подзаголовок', 'H3'],
    ['p', 'Обычный текст', '¶'], ['ul', 'Список', '•'], ['ol', 'Нумерованный список', '1.'], ['quote', 'Цитата', '❝'], ['clear', 'Убрать оформление', '⌫'],
  ];
  const INSERTS = [
    ['img', 'Картинка с устройства или по ссылке', '🖼 Картинка'], ['yt', 'Видео с YouTube', '🎬 Видео YouTube'], ['quote', 'Цитата', '❝ Цитата'],
    ['hr', 'Разделитель', '— Разделитель'], ['h2', 'Заголовок раздела', 'H2 Заголовок'], ['imgs', 'Вставить картинки (с подписями) из оригинала на те же места', '🖼 Картинки из оригинала'],
  ];
  async function editor(id) {
    let post = { id: 0, slug: '', status: 'draft', cover: '' };
    if (!state) { try { state = await api('blog/admin/posts'); } catch (e) { /* подсказки тегов просто не появятся */ } }
    try { sections = (await api('blog/admin/sections')).sections; } catch (e) { /* без разделов */ }
    knownTags = tagsByLang();
    if (id) {
      app.innerHTML = '<p class="be-note">Загрузка…</p>';
      try { post = (await api('blog/admin/post?id=' + id)).post; } catch (e) { app.innerHTML = `<p class="be-note">${errText(e)}</p>`; return; }
    }
    for (const [l] of LANGS) for (const k of ['t', 'd', 'tags', 'b']) post[`${k}_${l}`] = post[`${k}_${l}`] || '';
    app.innerHTML = `<p class="be-back"><a href="#">← Все статьи</a></p>
      <div class="be-tabs" role="tablist">${LANGS.map(([l, n], i) => `<button type="button" role="tab" data-tab="${l}" aria-selected="${!i}">${n}</button>`).join('')}
        <span class="be-trs"><button type="button" class="pill-btn be-setbtn" id="be-set">⚙ Настройки</button><button type="button" class="pill-btn pill-fill be-tr" id="be-tr" data-engine="google">🌐 Перевести с RU на EN и LV</button>
        <button type="button" class="pill-btn be-tr2" id="be-tr-g" data-engine="gemini" title="Перевод через Gemini: точнее и живее, но с дневным лимитом">✨ Gemini</button></span></div>
      <div class="be-progress" id="be-progress" hidden></div>
      <details class="be-hint"><summary>Как перевести статью и не потерять картинки</summary>
        <ol><li><b>Кнопка «🌐 Перевести»</b> (вверху справа): переводит открытую вкладку на два других языка через Google Переводчик — бесплатно и без лимитов. Кнопка <b>«✨ Gemini»</b> рядом переводит живее и точнее, но у неё дневной лимит. В обоих случаях картинки, подписи, заголовки и жирный остаются на месте, переводится только текст. Потом проверьте и поправьте перевод.</li>
        <li><b>Или в Google Docs:</b> откройте документ со статьёй → <i>Инструменты → Перевести документ</i> → выберите язык. Google сделает копию документа уже на нужном языке, с картинками и оформлением. Откройте её, Ctrl+A, Ctrl+C и вставьте во вкладку RU / EN / LV здесь.</li>
        <li><b>Если переводите в другом переводчике</b> (DeepL, Google Translate) и вставили текст без картинок — поставьте курсор на пустую строку, нажмите <b>＋</b> слева и выберите <b>«🖼 Картинки из оригинала»</b>: картинки (с подписями) встанут на те же места между абзацами, что и в оригинале. Подписи потом переведите сами.</li></ol>
        Писать можно и прямо здесь, или вставлять из Google Docs (Ctrl+A, Ctrl+C → Ctrl+V в поле «Текст») — картинки сразу скопируются на сайт.</details>
      ${LANGS.map(([l], i) => `<section class="be-pane" data-pane="${l}" ${i ? 'hidden' : ''}>
        <div class="be-panehead be-ph-${l}"><b>${PANE_NAME[l]}</b>
          <span class="be-move">Текст не на этом языке? Перенести в: ${LANGS.filter(x => x[0] !== l).map(([o, n]) => `<button type="button" class="bc-link" data-move="${o}">${n}</button>`).join(' · ')}</span></div>
        <p class="be-langwarn" hidden></p>
        <label class="be-f be-title"><span>Заголовок</span><input type="text" data-k="t_${l}" maxlength="200" placeholder="Заголовок" value="${esc(post['t_' + l])}"></label>
        <label class="be-f be-desc"><span>Краткое описание</span><textarea data-k="d_${l}" rows="2" maxlength="400" placeholder="Короткое описание — видно в списке статей и в Google">${esc(post['d_' + l])}</textarea></label>
        <div class="be-f be-bodywrap"><span>Текст</span>
          <div class="be-tools be-bubble" hidden>${TOOLS.map(([c, title, label]) => `<button type="button" data-cmd="${c}" title="${title}">${label}</button>`).join('')}</div>
          <button type="button" class="be-plus" hidden title="Вставить: картинку, видео, цитату, разделитель" aria-label="Вставить">＋</button>
          <div class="be-tools be-plusmenu" hidden>${INSERTS.map(([c, title, label]) => `<button type="button" data-cmd="${c}" title="${title}">${label}</button>`).join('')}</div>
          <div class="be-body bp-body" contenteditable="true" data-k="b_${l}" data-ph="Начните писать… Картинки можно перетащить прямо сюда.">${post['b_' + l]}</div>
        </div></section>`).join('')}
      <aside class="be-drawer" id="be-drawer" aria-label="Настройки публикации"><div class="be-drawer-head"><b>⚙ Настройки публикации</b><button type="button" class="be-x" data-drawer-close aria-label="Закрыть">✕</button></div>
      <section class="be-card be-common">
        <div class="be-f"><span>Обложка</span><div class="be-cover">
          <div class="be-cover-img">${post.cover ? `<img src="${esc(post.cover)}" alt="">` : '<span>нет обложки</span>'}</div>
          <div><button type="button" class="pill-btn" id="be-cover-up">Загрузить картинку</button>
            <input type="url" id="be-cover-url" placeholder="или вставьте ссылку на картинку" value="${esc(post.cover)}">
            ${post.cover ? '<button type="button" class="bc-link" id="be-cover-rm">убрать обложку</button>' : ''}</div></div></div>
        <label class="be-f be-srclang"><span>Язык оригинала <small>(на остальных языках внизу статьи появится маленькая пометка «перевод сделан онлайн-инструментами» со ссылкой на оригинал; кнопка «Перевести» ставит его сама)</small></span>
          <select id="be-src"><option value="">— не указан (пометки не будет) —</option>${LANGS.map(([l, n]) => `<option value="${l}"${post.src_lang === l ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
        <div class="be-f be-date"><span>Дата и время публикации <small>(статьи идут по дате — от новых к старым. Пусто — сейчас. Если поставить будущее время, статья выйдет сама в этот момент)</small></span>
          <div class="be-dt"><input type="date" id="be-date" value="${post.published_at ? localDate(post.published_at) : ''}"><input type="time" id="be-time" value="${post.published_at ? localTime(post.published_at) : ''}"></div></div>
        <label class="be-f"><span>Раздел <small>(крупная тема, как коллекция на Patreon)</small></span>
          <select id="be-section"><option value="">— без раздела —</option>${sections.map(r => `<option value="${esc(r.slug)}"${post.section === r.slug ? ' selected' : ''}>${esc(r.en)}${r.ru ? ' / ' + esc(r.ru) : ''}</option>`).join('')}<option value="__new">＋ Новый раздел…</option></select></label>
        <div class="be-f"><span>Теги <small>(на английском: впишите тег и нажмите Enter. Перевод на RU и LV подставится сам — поправить его можно во вкладке «Теги» списка статей)</small></span>
          <div class="be-tags" data-tags="en"><input type="text" class="be-tag-in" list="be-taglist-en" placeholder="new tag…" aria-label="Новый тег"></div>
          <datalist id="be-taglist-en">${(knownTags.en || []).map(x => `<option value="${esc(x)}">`).join('')}</datalist>
          <input type="hidden" data-k="tags_en" value="${esc(post.tags_en || post.tags_ru || post.tags_lv || '')}"></div>
        <label class="be-check"><input type="checkbox" id="be-featured" ${post.featured ? 'checked' : ''}> <b>★ Избранное</b> <small>— показывать справа в блоке блога на главной</small></label>
        <label class="be-f"><span>Адрес статьи <small id="be-slug-note">${post.status === 'published' ? '(статья опубликована — адрес лучше не менять, иначе старые ссылки перестанут работать)' : '(заполняется сам из заголовка; можно поправить)'}</small></span><div class="be-slug"><span>pigeonpolly.com/blog/</span><input type="text" id="be-slug" value="${esc(post.slug)}" spellcheck="false"><span>/</span></div></label>
      </section></aside><div class="be-shade" id="be-shade" hidden></div>
      <div class="be-save">
        <button type="button" class="pill-btn" data-save="draft">${post.status === 'published' ? 'Снять с публикации' : 'Сохранить черновик'}</button>
        <button type="button" class="pill-btn pill-fill" data-save="published">${post.status === 'published' ? 'Сохранить изменения' : 'Опубликовать'}</button>
        ${post.id ? `<a class="pill-btn" href="/ru/blog/${esc(post.slug)}/" target="_blank">Посмотреть ↗</a>` : ''}
        <p class="be-status" role="status" aria-live="polite"></p>
        <span class="be-meta"><span class="be-auto" id="be-auto"></span><span class="be-words" id="be-words"></span></span>
      </div>
      <input type="file" id="be-file" accept="image/*" hidden>`;
    const $ = s => app.querySelector(s);
    const status = msg => { $('.be-status').innerHTML = msg; };
    let cover = post.cover, active = 'ru', fileTarget = null;
    const bodies = [...app.querySelectorAll('.be-body')];
    document.execCommand('defaultParagraphSeparator', false, 'p');

    const collect = () => {
      const d = { id: post.id, slug: slugify($('#be-slug').value), cover, featured: $('#be-featured').checked, src_lang: $('#be-src').value, published_at: dateToTs($('#be-date').value, $('#be-time').value, post.published_at), section: $('#be-section').value === '__new' ? '' : $('#be-section').value };
      app.querySelectorAll('[data-k]').forEach(el => {
        if (!el.isContentEditable) { d[el.dataset.k] = el.value; return; }
        const c = el.cloneNode(true);
        c.querySelectorAll('figure').forEach(f => {
          const cap = f.querySelector('figcaption'), img = f.querySelector('img'), txt = cap ? cap.textContent.trim() : '';
          if (img && txt) img.setAttribute('alt', txt); // подпись = описание картинки для Google и незрячих (на языке вкладки)
          if (cap && !txt) cap.remove();                                         // пустая подпись в статью не попадает
        });
        d[el.dataset.k] = c.innerHTML;
      });
      return d;
    };
    const touch = () => { dirty = true; };
    app.addEventListener('input', touch);
    app.addEventListener('change', touch);

    // теги: вписать и нажать Enter (или запятую) — появляется «чип» с крестиком
    const tagList = l => app.querySelector(`[data-k="tags_${l}"]`).value.split(',').map(x => x.trim()).filter(Boolean);
    const setTags = (l, arr) => {
      const uniq = [...new Set(arr.map(x => x.trim().toLowerCase().replace(/^#/, '')).filter(Boolean))].slice(0, 12);
      app.querySelector(`[data-k="tags_${l}"]`).value = uniq.join(', ');
      const box = app.querySelector(`[data-tags="${l}"]`), inp = box.querySelector('.be-tag-in');
      box.querySelectorAll('.be-chip').forEach(c => c.remove());
      for (const tg of uniq) inp.insertAdjacentHTML('beforebegin', `<span class="be-chip">#${esc(tg)}<button type="button" data-rm="${esc(tg)}" aria-label="Убрать тег ${esc(tg)}">×</button></span>`);
    };
    app.querySelectorAll('[data-tags]').forEach(box => {
      const l = box.dataset.tags, inp = box.querySelector('.be-tag-in');
      setTags(l, tagList(l));
      const add = () => { if (!inp.value.trim()) return; setTags(l, [...tagList(l), ...inp.value.split(',')]); inp.value = ''; touch(); };
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
        else if (e.key === 'Backspace' && !inp.value) { setTags(l, tagList(l).slice(0, -1)); touch(); }
      });
      inp.addEventListener('blur', add);
      inp.addEventListener('change', () => { if (knownTags[l]?.includes(inp.value.trim().toLowerCase())) add(); }); // выбрали из подсказки
      box.addEventListener('click', e => {
        const rm = e.target.closest('[data-rm]');
        if (rm) { setTags(l, tagList(l).filter(x => x !== rm.dataset.rm)); touch(); } else inp.focus();
      });
    });

    // адрес: сам из заголовка (английский, если есть), пока его не поправили руками и статья не опубликована
    let slugManual = post.status === 'published' || (!!post.slug && post.slug !== slugify(post.t_en || post.t_ru || post.t_lv));
    const autoSlug = () => {
      if (slugManual) return;
      const v = (n => app.querySelector(`[data-k="t_${n}"]`).value.trim());
      $('#be-slug').value = slugify(v('en') || v('ru') || v('lv'));
    };
    app.querySelectorAll('[data-k^="t_"]').forEach(i => i.addEventListener('input', autoSlug));
    $('#be-slug').addEventListener('input', () => { slugManual = true; });
    $('#be-slug').addEventListener('blur', e => { e.target.value = slugify(e.target.value); });
    autoSlug();

    // вкладки языков
    app.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
      active = b.dataset.tab;
      app.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === b));
      app.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== active; });
      const others = LANGS.map(x => x[0]).filter(x => x !== active).map(x => x.toUpperCase());
      $('#be-tr').textContent = `🌐 Перевести с ${active.toUpperCase()} на ${others.join(' и ')}`;
    }));
    // текст попал не в ту вкладку: перенести (если там уже что-то есть — вкладки меняются местами)
    const fieldsOf = l => [app.querySelector(`[data-k="t_${l}"]`), app.querySelector(`[data-k="d_${l}"]`), app.querySelector(`[data-k="b_${l}"]`)];
    const hasText = l => { const [t, d, b] = fieldsOf(l); return !!(t.value.trim() || d.value.trim() || stripHtml(b.innerHTML)); };
    function moveLang(from, to) {
      if (hasText(to) && !confirm(`Во вкладке ${to.toUpperCase()} уже есть текст. Поменять вкладки ${from.toUpperCase()} и ${to.toUpperCase()} местами?`)) return;
      const [t1, d1, b1] = fieldsOf(from), [t2, d2, b2] = fieldsOf(to);
      [t1.value, t2.value] = [t2.value, t1.value]; [d1.value, d2.value] = [d2.value, d1.value]; [b1.innerHTML, b2.innerHTML] = [b2.innerHTML, b1.innerHTML];
      const src = $('#be-src'); if (src.value === from) src.value = to; else if (src.value === to) src.value = from;
      touch(); autoSlug();
      app.querySelector(`[data-tab="${to}"]`).click();
      status(`✓ Текст перенесён во вкладку ${to.toUpperCase()}.`);
      checkLang();
    }
    app.querySelectorAll('[data-move]').forEach(b => b.addEventListener('click', () => moveLang(b.closest('[data-pane]').dataset.pane, b.dataset.move)));
    // подсказка, если язык текста не совпадает с вкладкой
    function guessLang(l) {
      const [t, d, b] = fieldsOf(l);
      const txt = (t.value + ' ' + d.value + ' ' + b.innerText).slice(0, 3000);
      const cyr = (txt.match(/[а-яё]/gi) || []).length, lat = (txt.match(/[a-zāčēģīķļņšūž]/gi) || []).length, lvd = (txt.match(/[āčēģīķļņšūž]/gi) || []).length;
      if (cyr + lat < 25) return null;
      if (cyr > lat) return 'ru';
      return lvd / Math.max(1, lat) > .015 ? 'lv' : 'en';
    }
    function checkLang() {
      for (const [l] of LANGS) {
        const w = app.querySelector(`[data-pane="${l}"] .be-langwarn`), g = guessLang(l);
        if (g && g !== l) { w.hidden = false; w.innerHTML = `⚠ Похоже, здесь текст на <b>${g.toUpperCase()}</b>, а это вкладка <b>${l.toUpperCase()}</b>. <button type="button" class="pill-btn" data-fix="${g}">Перенести во вкладку ${g.toUpperCase()}</button>`; w.querySelector('[data-fix]').onclick = () => moveLang(l, g); }
        else w.hidden = true;
      }
    }
    let langTimer = 0;
    app.querySelectorAll('[data-pane]').forEach(p => p.addEventListener('input', () => { clearTimeout(langTimer); langTimer = setTimeout(checkLang, 900); }));
    app.querySelectorAll('[data-pane]').forEach(p => p.addEventListener('paste', () => { clearTimeout(langTimer); langTimer = setTimeout(checkLang, 900); }));
    checkLang();
    $('#be-section').addEventListener('change', async e => {
      if (e.target.value !== '__new') return;
      const en = prompt('Название нового раздела на английском (например Weekly Polly):', '');
      if (!en || !en.trim()) { e.target.value = post.section || ''; return; }
      try {
        const r = await api('blog/admin/section-set', { en: en.trim() });
        sections = (await api('blog/admin/sections')).sections;
        e.target.insertAdjacentHTML('afterbegin', '');
        const opt = document.createElement('option'); opt.value = r.slug; opt.textContent = en.trim();
        e.target.insertBefore(opt, e.target.querySelector('[value="__new"]')); e.target.value = r.slug; touch();
      } catch (err) { alert(errText(err)); e.target.value = ''; }
    });
    // открываем вкладку языка оригинала (если не указан — первую, где есть текст)
    const startLang = post.src_lang || LANGS.map(x => x[0]).find(l => post['t_' + l] || stripHtml(post['b_' + l])) || 'ru';
    if (startLang !== 'ru') app.querySelector(`[data-tab="${startLang}"]`).click();

    // панель инструментов
    let lastRange = null;
    document.addEventListener('selectionchange', () => {
      const s = getSelection();
      if (s.rangeCount && bodies.some(b => b.contains(s.anchorNode))) lastRange = s.getRangeAt(0).cloneRange();
    });
    const restore = body => {
      body.focus();
      if (lastRange && body.contains(lastRange.startContainer)) { const s = getSelection(); s.removeAllRanges(); s.addRange(lastRange); }
    };
    app.querySelectorAll('.be-tools button').forEach(b => {
      b.addEventListener('mousedown', e => e.preventDefault());
      b.addEventListener('click', () => {
        const body = b.closest('.be-pane').querySelector('.be-body');
        restore(body);
        const c = b.dataset.cmd;
        if (c === 'h2' || c === 'h3' || c === 'p') document.execCommand('formatBlock', false, c);
        else if (c === 'quote') document.execCommand('formatBlock', false, 'blockquote');
        else if (c === 'bold' || c === 'italic') document.execCommand(c);
        else if (c === 'ul') document.execCommand('insertUnorderedList');
        else if (c === 'ol') document.execCommand('insertOrderedList');
        else if (c === 'hr') document.execCommand('insertHorizontalRule');
        else if (c === 'imgs') { mergeImages(body); return; }
        else if (c === 'clear') { document.execCommand('removeFormat'); document.execCommand('unlink'); document.execCommand('formatBlock', false, 'p'); }
        else if (c === 'link') {
          const u = prompt('Адрес ссылки (https://…). Пусто — убрать ссылку.', 'https://');
          if (u === null) return;
          if (!u.trim() || u.trim() === 'https://') document.execCommand('unlink');
          else document.execCommand('createLink', false, u.trim());
        } else if (c === 'yt') {
          const u = prompt('Ссылка на видео YouTube:', 'https://www.youtube.com/watch?v=');
          const m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,20})/);
          if (!m) { if (u && u.trim() && !/watch\?v=$/.test(u)) alert('Не похоже на ссылку YouTube.'); return; }
          document.execCommand('insertHTML', false, `<figure><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}"></iframe></figure><p><br></p>`);
        } else if (c === 'img') {
          const how = prompt('Вставьте ссылку на картинку или оставьте пустым, чтобы загрузить файл с устройства:', '');
          if (how === null) return;
          if (how.trim()) insertImage(body, how.trim());
          else { fileTarget = body; $('#be-file').click(); }
          return;
        }
        touch();
      });
    });

    // ---- панель форматирования всплывает над выделенным текстом ----
    const hideBubbles = () => app.querySelectorAll('.be-bubble').forEach(x => { x.hidden = true; });
    document.addEventListener('selectionchange', () => {
      const sel = getSelection(); if (!app.isConnected) return;
      const body = sel.rangeCount && bodies.find(b => b.contains(sel.anchorNode));
      if (!body || sel.isCollapsed) { if (!app.querySelector('.be-bubble:hover')) hideBubbles(); placePlus(); return; }
      const bub = body.closest('.be-pane').querySelector('.be-bubble'), r = sel.getRangeAt(0).getBoundingClientRect();
      if (!r.width && !r.height) return;
      bub.hidden = false;
      const w = bub.offsetWidth, top = r.top - bub.offsetHeight - 10;
      bub.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
      bub.style.top = (top < 70 ? r.bottom + 10 : top) + 'px';
      placePlus();
    });
    addEventListener('scroll', hideBubbles, { passive: true });
    // ---- ＋ на пустой строке: вставить картинку, видео, цитату, разделитель ----
    function placePlus() {
      app.querySelectorAll('.be-plus').forEach(pl => { pl.hidden = true; });
      const sel = getSelection(); if (!sel.rangeCount || !sel.isCollapsed) return;
      const body = bodies.find(b => b.contains(sel.anchorNode)); if (!body) return;
      let blk = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
      while (blk && blk.parentElement !== body) blk = blk.parentElement;
      const empty = !body.textContent.trim() && !body.querySelector('img, iframe') || (blk && blk.tagName === 'P' && !blk.textContent.trim() && !blk.querySelector('img, iframe'));
      if (!empty) return;
      const wrap = body.closest('.be-bodywrap'), pl = wrap.querySelector('.be-plus');
      const top = (blk ? blk.getBoundingClientRect().top : body.getBoundingClientRect().top + 16) - wrap.getBoundingClientRect().top;
      pl.style.top = top + 'px'; pl.hidden = false;
    }
    app.querySelectorAll('.be-plus').forEach(pl => {
      pl.addEventListener('mousedown', e => e.preventDefault());
      pl.addEventListener('click', () => { const m = pl.nextElementSibling; m.hidden = !m.hidden; m.style.top = (parseFloat(pl.style.top) + 40) + 'px'; });
    });
    app.querySelectorAll('.be-plusmenu button').forEach(b => b.addEventListener('click', () => { b.closest('.be-plusmenu').hidden = true; setTimeout(placePlus, 50); }));
    document.addEventListener('mousedown', e => { if (!e.target.closest('.be-plusmenu, .be-plus')) app.querySelectorAll('.be-plusmenu').forEach(m => { m.hidden = true; }); });
    // ---- настройки публикации — выезжают справа ----
    const drawer = $('#be-drawer'), shade = $('#be-shade');
    const openDrawer = on => { drawer.classList.toggle('open', on); shade.hidden = !on; };
    $('#be-set').addEventListener('click', () => openDrawer(true));
    shade.addEventListener('click', () => openDrawer(false));
    drawer.querySelector('[data-drawer-close]').addEventListener('click', () => openDrawer(false));
    addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) openDrawer(false); });
    // ---- счётчик слов и время чтения ----
    const countWords = () => {
      const b = app.querySelector(`[data-k="b_${active}"]`), n = (b.innerText.match(/[\p{L}\p{N}]+/gu) || []).length;
      $('#be-words').textContent = n ? `${n.toLocaleString('ru-RU')} слов · ~${Math.max(1, Math.round(n / 200))} мин чтения` : '';
    };
    // ---- кнопка публикации: «Запланировать», если выбрано будущее время ----
    const pubBtn = app.querySelector('[data-save="published"]'), pubLabel = pubBtn.textContent;
    const schedLabel = () => {
      const ts = dateToTs($('#be-date').value, $('#be-time').value, post.published_at);
      pubBtn.textContent = ts && ts > Date.now() / 1000 + 60 ? `⏰ Запланировать на ${new Date(ts * 1000).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : pubLabel;
    };
    $('#be-date').addEventListener('change', schedLabel); $('#be-time').addEventListener('change', schedLabel); schedLabel();
    // ---- автосохранение черновика (у опубликованной статьи — только напоминание) ----
    let autoTimer = 0, saving = false;
    const autoMark = t => { $('#be-auto').textContent = t; };
    async function autosave() {
      if (saving) return;
      if (post.status === 'published') { autoMark('● есть несохранённые изменения'); return; }
      const d = collect(); d.status = 'draft';
      if (!d.t_ru.trim() && !d.t_en.trim() && !d.t_lv.trim()) { autoMark('черновик сохранится, когда появится заголовок'); return; }
      saving = true; autoMark('сохраняю…');
      try {
        const r = await api('blog/admin/save', d);
        post.id = r.id; post.slug = r.slug || post.slug; dirty = false;
        if (location.hash !== '#' + r.id) history.replaceState(null, '', '#' + r.id);
        autoMark('✓ черновик сохранён в ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
      } catch (e) { autoMark('⚠ не сохранилось автоматически — нажмите «Сохранить черновик»'); }
      saving = false;
    }
    app.addEventListener('input', () => { countWords(); clearTimeout(autoTimer); autoTimer = setTimeout(autosave, 4000); });
    app.addEventListener('change', () => { clearTimeout(autoTimer); autoTimer = setTimeout(autosave, 4000); });
    app.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => setTimeout(countWords, 0)));
    countWords();

    // картинки: перетаскивание, вставка из буфера, выбор файла
    // картинка сразу с местом для подписи: курсор встаёт в подпись
    // курсор в абзац после картинки (создаём абзац, если его нет)
    const afterFigure = fig => {
      let next = fig.nextElementSibling;
      if (!next || next.tagName !== 'P') { next = document.createElement('p'); next.innerHTML = '<br>'; fig.after(next); }
      const r = document.createRange(); r.setStart(next, 0); r.collapse(true);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); lastRange = r.cloneRange();
    };
    const insertImage = (body, url) => {
      restore(body);
      const at = getSelection().anchorNode, inFig = at && (at.nodeType === 1 ? at : at.parentElement).closest('figure');
      if (inFig && body.contains(inFig)) afterFigure(inFig); // не вкладываем картинку в картинку
      document.execCommand('insertHTML', false, `<figure data-new><img src="${esc(url)}" alt=""><figcaption></figcaption></figure><p><br></p>`);
      const fig = body.querySelector('figure[data-new]');
      if (fig) {
        fig.removeAttribute('data-new');
        const cap = fig.querySelector('figcaption') || fig.appendChild(document.createElement('figcaption'));
        const r = document.createRange(); r.setStart(cap, 0); r.collapse(true);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); cap.focus();
      }
      touch();
    };
    // у каждой картинки в тексте — место для подписи (и у вставленных из Google Docs, и у старых статей)
    const addCaptions = body => body.querySelectorAll('figure').forEach(f => { if (!f.querySelector('figcaption')) f.appendChild(document.createElement('figcaption')); });
    bodies.forEach(addCaptions);
    bodies.forEach(b => {
      // Enter в подписи — новый абзац под картинкой; пустое поле сразу начинается с абзаца
      b.addEventListener('keydown', e => {
        const at = getSelection().anchorNode, cap = at && (at.nodeType === 1 ? at : at.parentElement).closest('figcaption');
        if (e.key === 'Enter' && cap) { e.preventDefault(); afterFigure(cap.closest('figure')); }
      });
      b.addEventListener('focus', () => { if (!b.innerHTML.trim()) { b.innerHTML = '<p><br></p>'; const r = document.createRange(); r.setStart(b.firstChild, 0); r.collapse(true); getSelection().removeAllRanges(); getSelection().addRange(r); } });
    });
    bodies.forEach(b => new MutationObserver(() => addCaptions(b)).observe(b, { childList: true }));
    async function upload(file) {
      status('Загружаю картинку…');
      const blob = await shrink(file);
      const fd = new FormData(); fd.append('file', blob, 'image');
      try { const r = await api('blog/admin/upload', null, fd); status(''); return r.url; } catch (e) { status(errText(e)); return null; }
    }
    $('#be-file').addEventListener('change', async e => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      const url = await upload(f);
      if (!url) return;
      if (fileTarget === 'cover') setCover(url); else insertImage(fileTarget, url);
    });
    bodies.forEach(body => {
      body.addEventListener('dragover', e => { if ([...e.dataTransfer.items].some(i => i.kind === 'file')) { e.preventDefault(); body.classList.add('drop'); } });
      body.addEventListener('dragleave', () => body.classList.remove('drop'));
      body.addEventListener('drop', async e => {
        const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
        body.classList.remove('drop');
        if (!files.length) return;
        e.preventDefault();
        const pos = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
        if (pos) { const s = getSelection(); s.removeAllRanges(); s.addRange(pos); lastRange = pos.cloneRange(); }
        for (const f of files) { const u = await upload(f); if (u) insertImage(body, u); }
      });
      body.addEventListener('paste', async e => {
        const files = [...e.clipboardData.files].filter(f => f.type.startsWith('image/'));
        if (files.length) { e.preventDefault(); for (const f of files) { const u = await upload(f); if (u) insertImage(body, u); } return; }
        const htmlData = e.clipboardData.getData('text/html');
        if (htmlData) {
          e.preventDefault();
          const pane = body.closest('.be-pane'), titleIn = pane.querySelector('[data-k^="t_"]');
          const res = clean(htmlData, !titleIn.value.trim());
          if (res.title) titleIn.value = res.title;
          document.execCommand('insertHTML', false, res.html); touch();
          copyImages(body);
        }
      });
    });

    // картинки из Google Docs живут там по временным ссылкам — копируем их на сайт сразу при вставке
    const foreign = src => /^(data:image|blob:)/i.test(src) || (/^https?:\/\//i.test(src) && !src.startsWith(location.origin) && /googleusercontent\.com|docs\.google\.com|ggpht\.com/i.test(src));
    const copied = {}; // одна и та же картинка в RU/EN/LV копируется один раз
    async function copyImages(body) {
      const imgs = [...body.querySelectorAll('img')].filter(i => foreign(i.getAttribute('src') || ''));
      if (!imgs.length) return;
      let ok = 0, bad = 0;
      for (const [i, img] of imgs.entries()) {
        status(`Копирую картинки из Google Docs на сайт: ${i + 1} из ${imgs.length}…`);
        const src = img.getAttribute('src');
        let local = copied[src] || null;
        if (!local && /^https?:/i.test(src)) { try { local = (await api('blog/admin/fetch-image', { url: src })).url; } catch (e) { /* попробуем через браузер */ } }
        if (!local) {
          try { const r = await fetch(src); if (r.ok) local = await upload(await r.blob()); } catch (e) { /* не вышло */ }
        }
        if (local) copied[src] = local;
        const fig = img.closest('figure');
        if (local) { img.setAttribute('src', local); fig && fig.classList.remove('be-img-bad'); ok++; }
        else { (fig || img).classList.add('be-img-bad'); img.title = 'Не скопировалась — перетащите сюда файл картинки'; bad++; }
      }
      touch();
      status(bad ? `Скопировано ${ok} из ${imgs.length}. ${bad} не удалось — они обведены красным: сохраните их с Google Docs и перетащите файлами на их место (старую удалите).`
        : `Готово: все картинки (${ok}) скопированы на сайт ✓`);
    }
    // если в статье остались картинки со ссылками на Google Docs — предлагаем скопировать их одной кнопкой (не автоматически)
    const leftovers = bodies.reduce((n, b) => n + [...b.querySelectorAll('img')].filter(i => foreign(i.getAttribute('src') || '')).length, 0);
    if (leftovers) {
      status(`В статье ${leftovers} картин(ки/ок) со ссылками на Google Docs — они могут не показываться читателям. <button type="button" class="bc-link" id="be-copy-left">Скопировать их на сайт</button>`);
      $('#be-copy-left').addEventListener('click', async () => { for (const b of bodies) await copyImages(b); });
    }

    // «Картинки из оригинала»: переведённый текст вставили без картинок — ставим картинки оригинала после того же по счёту абзаца
    function mergeImages(body) {
      const target = body.dataset.k.slice(2);
      const srcLang = [$('#be-src').value, ...LANGS.map(x => x[0])].find(l => l && l !== target && app.querySelector(`[data-k="b_${l}"]`).querySelector('figure, img'));
      if (!srcLang) { status('В других вкладках нет картинок, которые можно перенести.'); return; }
      const src = app.querySelector(`[data-k="b_${srcLang}"]`);
      const isText = el => el.tagName !== 'FIGURE' && !el.querySelector('img') && el.textContent.trim();
      const have = new Set([...body.querySelectorAll('img')].map(i => i.getAttribute('src')));
      const plan = []; let k = 0;
      for (const el of src.children) {
        if (isText(el)) k++;
        else if (el.tagName === 'FIGURE' || el.querySelector('img')) { const img = el.querySelector('img') || el; if (!have.has(img.getAttribute('src'))) plan.push([k, el]); }
      }
      if (!plan.length) { status('Все картинки оригинала уже есть в этой вкладке.'); return; }
      const texts = [...body.children].filter(isText);
      for (const [n, el] of plan.reverse()) {
        const fig = el.tagName === 'FIGURE' ? el.cloneNode(true) : Object.assign(document.createElement('figure'), { innerHTML: el.innerHTML });
        if (n === 0) body.prepend(fig); else (texts[Math.min(n, texts.length) - 1] || body.lastElementChild).after(fig);
      }
      addCaptions(body); touch();
      status(`Готово: перенесено картинок — ${plan.length} (из вкладки ${srcLang.toUpperCase()}). Проверьте, что они стоят на своих местах, и переведите подписи.`);
    }

    // обложка
    const setCover = url => {
      cover = url; $('#be-cover-url').value = url;
      $('.be-cover-img').innerHTML = url ? `<img src="${esc(url)}" alt="">` : '<span>нет обложки</span>';
      touch();
    };
    $('#be-cover-up').addEventListener('click', () => { fileTarget = 'cover'; $('#be-file').click(); });
    $('#be-cover-url').addEventListener('change', e => setCover(e.target.value.trim()));
    app.addEventListener('click', e => { if (e.target.id === 'be-cover-rm') setCover(''); });

    // перевод с открытой вкладки на две другие
    // Google Переводчик (бесплатно, без ключа и лимитов) или Gemini (точнее, но с лимитом)
    const runTranslate = async engine => {
      const ru = collect(), from = active, targets = LANGS.map(x => x[0]).filter(x => x !== from);
      if (!ru['t_' + from].trim() && !stripHtml(ru['b_' + from])) { status(`Во вкладке ${from.toUpperCase()} пока пусто — напишите или вставьте статью.`); return; }
      const filled = targets.filter(l => ru['t_' + l] || stripHtml(ru['b_' + l]));
      if (filled.length && !confirm(`Во вкладках ${filled.map(x => x.toUpperCase()).join(' и ')} уже есть текст. Заменить его новым переводом?`)) return;
      const btns = app.querySelectorAll('#be-tr, #be-tr-g'); btns.forEach(x => { x.disabled = true; });
      // полоска загрузки на каждый язык: переводим кусочками по несколько абзацев
      status('');
      const prog = $('#be-progress');
      prog.hidden = false;
      prog.innerHTML = targets.map(l => `<div class="be-prog" data-p="${l}"><b>${l.toUpperCase()}</b><span class="be-bar"><i style="width:0%"></i></span><em>ждёт…</em></div>`).join('');
      const bar = (l, pct, text) => { const r = prog.querySelector(`[data-p="${l}"]`); r.querySelector('i').style.width = pct + '%'; r.querySelector('em').textContent = text; r.classList.toggle('done', pct >= 100); };
      try {
        for (const l of targets) {
          const { texts, rebuild } = splitForTranslation(ru, from);
          const out = [];
          bar(l, 2, '0%');
          let backup = false;
          for (let i = 0; i < texts.length;) {
            let n;
            if (engine === 'google') { n = googleBatch(texts, i); out.push(...await googleTranslate(texts.slice(i, i + n), from, l)); }
            else {
              n = 15;
              const r = await api('blog/admin/translate', { texts: texts.slice(i, i + n), from, to: l, strict: true });
              out.push(...r.texts);
              if (r.engine !== 'gemini') backup = true;
            }
            i += n;
            const pct = Math.round(out.length / texts.length * 100);
            bar(l, pct, pct >= 100 ? (backup ? 'готово (запасной переводчик — проверьте внимательнее)' : 'готово ✓') : pct + '%');
          }
          const res = rebuild(out);
          app.querySelector(`[data-k="t_${l}"]`).value = res.t;
          app.querySelector(`[data-k="d_${l}"]`).value = res.d;
          app.querySelector(`[data-k="b_${l}"]`).innerHTML = res.b;
          autoSlug();
        }
        $('#be-src').value = from; // запоминаем язык оригинала — для пометки под переводом
        status(`Готово! Проверьте переводы во вкладках ${targets.map(x => x.toUpperCase()).join(' и ')} — их можно поправить.`);
        touch();
      } catch (e) { status(errText(e)); prog.querySelectorAll('.be-prog:not(.done) em').forEach(x => { x.textContent = 'остановлено'; }); }
      btns.forEach(x => { x.disabled = false; });
    };
    $('#be-tr').addEventListener('click', () => runTranslate('google'));
    $('#be-tr-g').addEventListener('click', () => runTranslate('gemini'));

    // сохранение
    app.querySelectorAll('[data-save]').forEach(b => b.addEventListener('click', async () => {
      clearTimeout(autoTimer);
      const d = collect(); d.status = b.dataset.save;
      if (!d.t_ru.trim() && !d.t_en.trim() && !d.t_lv.trim()) { status(ERR.title); return; }
      const empty = LANGS.map(x => x[0]).filter(l => !d['t_' + l].trim());
      if (d.status === 'published' && empty.length && !confirm(`Нет версии ${empty.map(x => x.toUpperCase()).join(' и ')} — там будет показан текст на другом языке. Всё равно опубликовать?`)) return;
      app.querySelectorAll('[data-save]').forEach(x => { x.disabled = true; });
      status('Сохраняю…');
      try {
        const r = await api('blog/admin/save', d);
        if (!r || !r.id) throw Object.assign(new Error('save'), { code: 'save' });
        dirty = false;
        // после сохранения — сразу к списку статей, на нужную вкладку, с отметкой «сохранено»
        const title = d.t_ru || d.t_en || d.t_lv;
        flash = r.status === 'published'
          ? `✓ «${esc(title)}» опубликована. <a href="/ru/blog/${esc(r.slug)}/" target="_blank">Открыть статью ↗</a>`
          : `✓ Черновик «${esc(title)}» сохранён (его видите только вы).`;
        dashTab = r.status === 'published' ? 'published' : 'draft'; tagFilter = null;
        if (location.hash) location.hash = ''; else dashboard();
        window.scrollTo(0, 0);
      } catch (e) {
        status('⚠ Не сохранилось: ' + errText(e));
        alert('Статья НЕ сохранилась: ' + errText(e).replace(/<[^>]+>/g, '') + '\nНе закрывайте страницу — попробуйте ещё раз.');
        app.querySelectorAll('[data-save]').forEach(x => { x.disabled = false; });
      }
    }));
  }


  // Google Переводчик прямо из браузера: бесплатно и без ключа; HTML (жирный, ссылки) сохраняется
  const googleBatch = (texts, i) => { let n = 0, len = 0; while (i + n < texts.length && (n === 0 || len + String(texts[i + n]).length < 4500) && n < 40) { len += String(texts[i + n]).length; n++; } return n; };
  async function googleTranslate(texts, from, to) {
    const idx = [], body = new URLSearchParams();
    texts.forEach((x, i) => { if (String(x || '').trim()) { idx.push(i); body.append('q', x); } });
    const out = texts.map(() => '');
    if (!idx.length) return out;
    let d = null, code = 'google';
    for (let attempt = 0; attempt < 4 && !d; attempt++) { // Google иногда отвечает ошибкой — пробуем ещё раз с паузой
      if (attempt) await new Promise(r => setTimeout(r, attempt * 1500));
      try {
        const r = await fetch(`https://translate.googleapis.com/translate_a/t?client=gtx&sl=${from}&tl=${to}&format=html`, { method: 'POST', body });
        if (r.ok) d = await r.json(); else code = r.status === 429 ? 'google_limit' : 'google';
      } catch (e) { /* сеть — ещё попытка */ }
    }
    if (!d) throw Object.assign(new Error('google'), { code });
    if (!Array.isArray(d)) d = [d];
    // Google ставит лишний пробел перед запятой после жирного/ссылки: «<b>руками</b> ,» → «<b>руками</b>,»
    const tidy = v => String(v ?? '').replace(/(<\/(?:b|strong|i|em|a|u|s)>)\s+([,.;:!?)»])/g, '$1$2');
    idx.forEach((k, j) => { const v = d[j]; out[k] = tidy(Array.isArray(v) ? v[0] : v); });
    return out;
  }

  // делим статью на кусочки для переводчика и собираем обратно
  function splitForTranslation(ru, from) {
    const texts = [ru['t_' + from], ru['d_' + from], '']; // теги не переводим здесь — у них общий словарь
    const box = document.createElement('div'); box.innerHTML = ru['b_' + from];
    const slots = [];
    const walk = el => {
      for (const ch of el.children) {
        const tag = ch.tagName.toLowerCase();
        if (tag === 'ul' || tag === 'ol' || tag === 'blockquote' && ch.querySelector('p')) walk(ch);
        else if (tag === 'figure') { const cap = ch.querySelector('figcaption'); if (cap && cap.textContent.trim()) { slots.push(cap); texts.push(cap.innerHTML); } } // подпись к картинке тоже переводим
        else if (tag === 'hr' || tag === 'img' || !ch.textContent.trim()) continue;
        else { slots.push(ch); texts.push(ch.innerHTML); }
      }
    };
    walk(box);
    return {
      texts,
      rebuild(out) {
        slots.forEach((el, i) => { el.innerHTML = out[3 + i]; });
        return { t: out[0], d: out[1], tags: out[2], b: box.innerHTML };
      },
    };
  }

  // уменьшаем большие фото до 1600px, чтобы страницы грузились быстро (GIF не трогаем)
  async function shrink(file) {
    if (file.type === 'image/gif' || file.size < 300_000) return file;
    try {
      const bmp = await createImageBitmap(file);
      const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      const type = file.type === 'image/png' && file.size < 1_500_000 ? 'image/png' : 'image/webp';
      const blob = await new Promise(r => c.toBlob(r, type, 0.86));
      return blob && blob.size < file.size ? blob : file;
    } catch (e) { return file; }
  }

  // вставка из Word/Google Docs: оставляем только простое оформление (сервер чистит ещё раз)
  const OK = new Set(['P', 'H2', 'H3', 'B', 'STRONG', 'I', 'EM', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'BR', 'IMG', 'FIGURE', 'FIGCAPTION', 'HR']);
  function clean(htmlStr, wantTitle) {
    const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
    doc.querySelectorAll('script, style, meta, link, title').forEach(n => n.remove());
    // Google Docs: всё обёрнуто в <b style="font-weight:normal">, а жирный/курсив — это <span style="...">
    doc.querySelectorAll('b[id^="docs-internal-guid"], b[style*="font-weight:normal"], b[style*="font-weight: normal"]').forEach(n => n.replaceWith(...n.childNodes));
    doc.querySelectorAll('p[role="presentation"], p.title').forEach(n => { if (n.classList.contains('title')) { const h = doc.createElement('h1'); h.innerHTML = n.innerHTML; n.replaceWith(h); } });
    // заголовок статьи: первый абзац стиля «Название» (крупный шрифт) или первый h1
    let title = '';
    const first = [...doc.body.querySelectorAll('h1, h2, h3, p, li, img')].find(n => n.tagName === 'IMG' || n.textContent.trim());
    const big = n => n && n.tagName === 'P' && [...n.querySelectorAll('span[style]')].some(x => parseFloat((x.getAttribute('style').match(/font-size:\s*([\d.]+)pt/) || [])[1]) >= 20);
    const head = first && (first.tagName === 'H1' || big(first)) ? first : null;
    if (wantTitle && head) { title = head.textContent.trim(); head.remove(); }
    doc.querySelectorAll('span[style]').forEach(n => {
      const st = n.getAttribute('style');
      let inner = n.innerHTML;
      if (/font-weight:\s*(bold|[6-9]00)/.test(st)) inner = `<b>${inner}</b>`;
      if (/font-style:\s*italic/.test(st)) inner = `<i>${inner}</i>`;
      n.innerHTML = inner;
    });
    doc.querySelectorAll('li > p').forEach(n => n.replaceWith(...n.childNodes));
    doc.querySelectorAll('h2 b, h3 b, h2 strong, h3 strong').forEach(n => n.replaceWith(...n.childNodes));
    doc.querySelectorAll('h1').forEach(n => { const h = doc.createElement('h2'); h.innerHTML = n.innerHTML; n.replaceWith(h); });
    doc.querySelectorAll('h4, h5, h6').forEach(n => { const h = doc.createElement('h3'); h.innerHTML = n.innerHTML; n.replaceWith(h); });
    [...doc.body.querySelectorAll('*')].reverse().forEach(n => {
      if (!OK.has(n.tagName)) { n.replaceWith(...n.childNodes); return; }
      for (const a of [...n.attributes]) if (!(n.tagName === 'A' && a.name === 'href') && !(n.tagName === 'IMG' && (a.name === 'src' || a.name === 'alt'))) n.removeAttribute(a.name);
    });
    // картинка с подписью в одном абзаце (как в Google Docs) → figure с figcaption
    doc.querySelectorAll('p').forEach(p => {
      const img = p.querySelector('img');
      if (!img) return;
      const cap = p.textContent.trim();
      const fig = doc.createElement('figure');
      fig.appendChild(img);
      if (cap) { img.alt = cap; const fc = doc.createElement('figcaption'); p.querySelectorAll('img').forEach(x => x.remove()); fc.innerHTML = p.innerHTML.trim(); fig.appendChild(fc); }
      p.replaceWith(fig);
    });
    doc.querySelectorAll('p, li').forEach(p => { if (!p.textContent.trim() && !p.querySelector('img')) p.remove(); });
    return { html: doc.body.innerHTML, title };
  }
  // как на сервере: кириллица → латиница, всё остальное → дефисы
  const slugify = s => String(s || '').toLowerCase()
    .replace(/[а-яё]/g, c => ({ а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' }[c]))
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
  // ключ Gemini для перевода статей — вставляется прямо здесь (хранится на сервере сайта)
  async function geminiPanel() {
    let st = await api('blog/admin/gemini-key').catch(() => ({}));
    const d = document.createElement('dialog');
    d.className = 'be-dialog';
    const render = () => {
      d.innerHTML = `<h2>⚙ Перевод статей (Gemini)</h2>
        <p>Статус: ${st.connected ? `<b style="color:#1E7A45">ключ подключён ✓</b>${st.from === 'cloudflare' ? ' (из настроек Cloudflare)' : ''}` : '<b style="color:#C0392B">ключ не подключён</b>'}</p>
        <ol><li>Откройте <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">aistudio.google.com → API keys ↗</a> (бесплатно, тем же Google-аккаунтом).</li>
        <li>Нажмите <b>Create API key</b>, скопируйте ключ.</li><li>Вставьте его сюда и нажмите «Сохранить». Ключ хранится на сервере сайта, читатели его не видят.</li></ol>
        <p><input type="password" id="be-gk" placeholder="вставьте ключ Gemini" autocomplete="off" style="width:100%;box-sizing:border-box;padding:10px 14px;border-radius:12px;border:1px solid #CFC7E2;font:15px var(--sans)"></p>
        <p class="be-gk-test"></p>
        <p class="be-dialog-acts"><button type="button" class="pill-btn pill-fill" data-save>Сохранить</button>
          ${st.connected ? '<button type="button" class="pill-btn" data-test>Проверить перевод</button>' : ''}
          <button type="button" class="pill-btn" data-close>Закрыть</button></p>`;
      d.querySelector('[data-close]').onclick = () => { d.close(); d.remove(); dashboard(); };
      d.querySelector('[data-save]').onclick = async () => {
        const key = d.querySelector('#be-gk').value.trim();
        if (!key) return;
        st = await api('blog/admin/gemini-key?test=1', { key });
        render(); showTest();
      };
      const t = d.querySelector('[data-test]');
      t && (t.onclick = async () => { d.querySelector('.be-gk-test').textContent = 'Проверяю…'; st = await api('blog/admin/gemini-key?test=1'); showTest(); });
    };
    const showTest = () => {
      const el = d.querySelector('.be-gk-test'); if (!el || st.test == null) return;
      el.innerHTML = String(st.test).startsWith('ERROR:') ? `⚠ Не получилось: ${errText({ code: st.test.slice(6) })}` : `✓ Работает! «Привет! Это проверка перевода.» → «${esc(st.test)}»`;
    };
    render(); document.body.appendChild(d); d.showModal();
  }
  // дата и время публикации (местное время) ↔ секунды
  const pad2 = n => String(n).padStart(2, '0');
  const localDate = ts => { const d = new Date(ts * 1000); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
  const localTime = ts => { const d = new Date(ts * 1000); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
  const dateToTs = (date, time, prev) => {
    if (!date) return null;
    if (prev && localDate(prev) === date && localTime(prev) === (time || localTime(prev))) return prev;
    const [y, m, d] = date.split('-').map(Number), [hh, mm] = (time || (prev ? localTime(prev) : '12:00')).split(':').map(Number);
    return Math.floor(new Date(y, m - 1, d, hh, mm).getTime() / 1000);
  };
  const stripHtml = s => String(s || '').replace(/<[^>]*>/g, '').trim();

  start();
})();
