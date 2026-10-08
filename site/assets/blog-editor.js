// Редактор блога (только для админа): список статей, модерация комментариев, строгий режим,
// визуальный редактор с вкладками RU/EN/LV, перевод RU → EN/LV (Workers AI), картинки в R2.
(function () {
  const app = document.getElementById('be-app');
  const LANGS = [['ru', 'RU'], ['en', 'EN'], ['lv', 'LV']];
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
    ai_limit: 'Бесплатный лимит переводов на сегодня закончился — попробуйте завтра.',
    ai: 'Переводчик сейчас не отвечает. Попробуйте ещё раз чуть позже.',
    media: 'Хранилище картинок не подключено.', big: 'Картинка слишком большая (до 8 МБ).', type: 'Подходят JPG, PNG, WebP и GIF.',
    title: 'Нужен заголовок.', too_big: 'Статья слишком большая для сохранения (больше ~900 000 символов вместе с разметкой).', save: 'сервер не подтвердил сохранение.', fetch: 'Не удалось скопировать картинку.', login: 'Сессия закончилась — войдите снова.', admin: 'Нужен вход администратора.',
  };
  const errText = e => ERR[e.code] || 'Что-то пошло не так (' + esc(e.code || e.message) + ').';
  let flash = '', state = null, dirty = false, knownTags = {}, knownTagCounts = {}, dashTab = 'published', tagFilter = null;
  // все теги из статей: { ru: ['акварель', …], … } и счётчики
  function tagsByLang() {
    knownTagCounts = {};
    for (const l of ['ru', 'en', 'lv']) {
      const c = knownTagCounts[l] = {};
      for (const p of (state && state.posts) || []) for (const t of String(p['tags_' + l] || '').split(',').map(x => x.trim()).filter(Boolean)) c[t] = (c[t] || 0) + 1;
    }
    return Object.fromEntries(Object.entries(knownTagCounts).map(([l, c]) => [l, Object.keys(c).sort()]));
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
  async function dashboard() {
    app.innerHTML = '<p class="be-note">Загрузка…</p>';
    try { state = await api('blog/admin/posts'); } catch (e) { app.innerHTML = `<p class="be-note">${errText(e)}</p>`; return; }
    const pend = state.pending;
    const pub = state.posts.filter(p => p.status === 'published'), drafts = state.posts.filter(p => p.status !== 'published');
    knownTags = tagsByLang();
    const tagCount = new Set(['ru', 'en', 'lv'].flatMap(l => Object.keys(knownTagCounts[l] || {}).map(t => l + ':' + t))).size;
    const postsHtml = list => {
      if (tagFilter) list = state.posts.filter(p => String(p['tags_' + tagFilter.l] || '').split(',').map(x => x.trim()).includes(tagFilter.t));
      const head = tagFilter ? `<p class="be-filter">Статьи с тегом <b>#${esc(tagFilter.t)}</b> (${tagFilter.l.toUpperCase()}) · <button type="button" class="bc-link" data-unfilter>показать все</button></p>` : '';
      if (!list.length) return head + `<p class="be-note">${dashTab === 'draft' ? 'Черновиков нет.' : 'Опубликованных статей пока нет.'}</p>`;
      return head + `<table class="be-table"><thead><tr><th>Статья</th><th>Статус</th><th>Дата</th><th title="лайки">♥</th><th title="просмотры">👁</th><th title="комментарии">💬</th><th></th></tr></thead><tbody>
        ${list.map(p => `<tr data-id="${p.id}"><td><button class="be-star" data-star aria-pressed="${!!p.featured}" title="Избранное: показывать справа на главной">${p.featured ? '★' : '☆'}</button> <a href="#${p.id}"><b>${esc(p.t_ru || p.t_en || p.t_lv || '(без названия)')}</b></a><small>/blog/${esc(p.slug)}/ · ${['ru', 'en', 'lv'].map(l => p['t_' + l] ? l.toUpperCase() : `<s>${l.toUpperCase()}</s>`).join(' ')}</small></td>
          <td><span class="be-st ${p.status}">${p.status === 'published' ? 'опубликована' : 'черновик'}</span></td><td>${fmt(p.published_at || p.updated_at)}</td>
          <td>${p.likes}</td><td>${p.views}</td><td>${p.comments}</td>
          <td class="be-acts"><a href="#${p.id}">Изменить</a> <a href="/ru/blog/${esc(p.slug)}/" target="_blank">Открыть ↗</a> <button class="bc-link be-danger" data-delpost>Удалить</button></td></tr>`).join('')}
      </tbody></table>`;
    };
    const tagsHtml = () => {
      const cols = ['ru', 'en', 'lv'].map(l => {
        const c = knownTagCounts[l] || {}, keys = Object.keys(c).sort((a, b) => c[b] - c[a] || a.localeCompare(b));
        return `<div class="be-tagcol"><h3>${l.toUpperCase()}</h3>${keys.length ? `<ul>${keys.map(t => `<li data-l="${l}" data-t="${esc(t)}">
          <button type="button" class="be-tagname" data-show title="Показать статьи">#${esc(t)} <span>${c[t]}</span></button>
          <button type="button" class="be-ico" data-ren title="Переименовать во всех статьях" aria-label="Переименовать #${esc(t)}">✎</button><button type="button" class="be-ico be-danger" data-deltag title="Удалить из всех статей" aria-label="Удалить #${esc(t)}">✕</button></li>`).join('')}</ul>` : '<p class="be-note">Тегов нет.</p>'}</div>`;
      }).join('');
      return `<p class="be-note">Нажмите на тег, чтобы увидеть его статьи. Переименование и удаление меняют тег сразу во всех статьях.</p><div class="be-tagcols">${cols}</div>`;
    };
    const flashHtml = flash ? `<p class="be-flash" role="status">${flash}</p>` : ''; flash = '';
    app.innerHTML = `${flashHtml}<div class="be-top">
        <a class="pill-btn pill-fill" href="#new">＋ Новая статья</a>
        <label class="be-switch"><input type="checkbox" id="be-strict" ${state.strict ? 'checked' : ''}><span></span>
          <b>Строгий режим</b><small>не больше 1 комментария в час с одного адреса</small></label>
      </div>
      ${pend.length ? `<section class="be-card be-pend"><h2>Комментарии со ссылками ждут проверки (${pend.length})</h2><ol>${pend.map(c => `
        <li data-cid="${c.id}"><p><b>${esc(c.name)}</b> → <a href="/ru/blog/${esc(c.slug)}/#comments" target="_blank">${esc(c.t_ru)}</a> · ${fmt(c.created_at)}</p>
        <p class="be-ctext">${esc(c.body)}</p><p><button class="pill-btn" data-ok>Одобрить</button> <button class="pill-btn be-danger" data-del>Удалить</button></p></li>`).join('')}</ol></section>` : ''}
      <section class="be-card">
        <div class="be-dtabs" role="tablist">${[['published', 'Опубликованные', pub.length], ['draft', 'Черновики', drafts.length], ['tags', 'Теги', tagCount]].map(([k, n, c]) =>
          `<button type="button" role="tab" data-dtab="${k}" aria-selected="${dashTab === k}">${n} <span>${c}</span></button>`).join('')}</div>
        ${dashTab === 'tags' ? tagsHtml() : postsHtml(dashTab === 'draft' ? drafts : pub)}
      </section>
      ${state.gemini ? '' : '<p class="be-note">⚠ Ключ Gemini (GEMINI_KEY) не подключён в Cloudflare — переводит запасной, более слабый переводчик.</p>'}
      ${state.media ? '' : '<p class="be-note">⚠ Хранилище картинок (R2) не подключено — загрузка картинок не заработает.</p>'}`;
    app.querySelectorAll('[data-dtab]').forEach(b => b.addEventListener('click', () => { dashTab = b.dataset.dtab; tagFilter = null; dashboard(); }));
    const unf = app.querySelector('[data-unfilter]'); unf && unf.addEventListener('click', () => { tagFilter = null; dashboard(); });
    app.querySelectorAll('[data-show]').forEach(b => b.addEventListener('click', () => { const li = b.closest('li'); tagFilter = { l: li.dataset.l, t: li.dataset.t }; dashTab = 'published'; dashboard(); }));
    app.querySelectorAll('[data-ren], [data-deltag]').forEach(b => b.addEventListener('click', async () => {
      const li = b.closest('li'), l = li.dataset.l, t = li.dataset.t, n = (knownTagCounts[l] || {})[t];
      let to = '';
      if (b.hasAttribute('data-ren')) { to = prompt(`Новое название для #${t} (${l.toUpperCase()}):`, t); if (to === null || !to.trim() || to.trim() === t) return; }
      else if (!confirm(`Убрать тег #${t} из ${n} стат${n === 1 ? 'ьи' : 'ей'}?`)) return;
      try { await api('blog/admin/tag', { lang: l, from: t, to }); } catch (e) { alert(errText(e)); }
      dashboard();
    }));
    app.querySelector('#be-strict').addEventListener('change', async e => {
      try { await api('blog/admin/settings', { strict: e.target.checked }); } catch (err) { e.target.checked = !e.target.checked; alert(errText(err)); }
    });
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
    app.querySelectorAll('[data-delpost]').forEach(b => b.addEventListener('click', async () => {
      const tr = b.closest('tr');
      if (!confirm('Удалить статью вместе с комментариями и лайками? Это нельзя отменить.')) return;
      await api('blog/admin/delete', { id: Number(tr.dataset.id) });
      dashboard();
    }));
  }

  // ---------- редактор статьи ----------
  const TOOLS = [
    ['h2', 'Заголовок', 'Заг'], ['h3', 'Подзаголовок', 'Подзаг'], ['p', 'Обычный текст', '¶'], ['bold', 'Жирный', '<b>Ж</b>'], ['italic', 'Курсив', '<i>К</i>'],
    ['ul', 'Список', '• —'], ['ol', 'Нумерованный список', '1.'], ['quote', 'Цитата', '❝'], ['link', 'Ссылка', '🔗'], ['img', 'Картинка', '🖼'],
    ['hr', 'Разделитель', '—'], ['clear', 'Убрать оформление', '⌫'],
  ];
  async function editor(id) {
    let post = { id: 0, slug: '', status: 'draft', cover: '' };
    if (!state) { try { state = await api('blog/admin/posts'); } catch (e) { /* подсказки тегов просто не появятся */ } }
    knownTags = tagsByLang();
    if (id) {
      app.innerHTML = '<p class="be-note">Загрузка…</p>';
      try { post = (await api('blog/admin/post?id=' + id)).post; } catch (e) { app.innerHTML = `<p class="be-note">${errText(e)}</p>`; return; }
    }
    for (const [l] of LANGS) for (const k of ['t', 'd', 'tags', 'b']) post[`${k}_${l}`] = post[`${k}_${l}`] || '';
    app.innerHTML = `<p class="be-back"><a href="#">← Все статьи</a></p>
      <div class="be-tabs" role="tablist">${LANGS.map(([l, n], i) => `<button type="button" role="tab" data-tab="${l}" aria-selected="${!i}">${n}</button>`).join('')}
        <button type="button" class="pill-btn pill-fill be-tr" id="be-tr">🌐 Перевести с RU на EN и LV</button></div>
      <div class="be-progress" id="be-progress" hidden></div>
      <p class="be-hint">Можно писать прямо здесь или вставить готовую статью из Google Docs (Ctrl+A, Ctrl+C → Ctrl+V в поле «Текст»): заголовок, жирный, списки и картинки перенесутся, а картинки сразу скопируются на сайт (это займёт несколько секунд).</p>
      ${LANGS.map(([l], i) => `<section class="be-pane" data-pane="${l}" ${i ? 'hidden' : ''}>
        <label class="be-f"><span>Заголовок</span><input type="text" data-k="t_${l}" maxlength="200" value="${esc(post['t_' + l])}"></label>
        <label class="be-f"><span>Краткое описание <small>(видно в списке статей и в Google)</small></span><textarea data-k="d_${l}" rows="2" maxlength="400">${esc(post['d_' + l])}</textarea></label>
        <div class="be-f"><span>Теги <small>(впишите тег и нажмите Enter)</small></span>
          <div class="be-tags" data-tags="${l}"><input type="text" class="be-tag-in" list="be-taglist-${l}" placeholder="новый тег…" aria-label="Новый тег"></div>
          <datalist id="be-taglist-${l}">${(knownTags[l] || []).map(x => `<option value="${esc(x)}">`).join('')}</datalist>
          <input type="hidden" data-k="tags_${l}" value="${esc(post['tags_' + l])}"></div>
        <div class="be-f"><span>Текст</span>
          <div class="be-tools">${TOOLS.map(([c, title, label]) => `<button type="button" data-cmd="${c}" title="${title}">${label}</button>`).join('')}</div>
          <div class="be-body bp-body" contenteditable="true" data-k="b_${l}" data-ph="Начните писать… Картинки можно перетащить прямо сюда.">${post['b_' + l]}</div>
        </div></section>`).join('')}
      <section class="be-card be-common">
        <div class="be-f"><span>Обложка</span><div class="be-cover">
          <div class="be-cover-img">${post.cover ? `<img src="${esc(post.cover)}" alt="">` : '<span>нет обложки</span>'}</div>
          <div><button type="button" class="pill-btn" id="be-cover-up">Загрузить картинку</button>
            <input type="url" id="be-cover-url" placeholder="или вставьте ссылку на картинку" value="${esc(post.cover)}">
            ${post.cover ? '<button type="button" class="bc-link" id="be-cover-rm">убрать обложку</button>' : ''}</div></div></div>
        <label class="be-f be-srclang"><span>Язык оригинала <small>(на остальных языках внизу статьи появится маленькая пометка «перевод сделан онлайн-инструментами» со ссылкой на оригинал; кнопка «Перевести» ставит его сама)</small></span>
          <select id="be-src"><option value="">— не указан (пометки не будет) —</option>${LANGS.map(([l, n]) => `<option value="${l}"${post.src_lang === l ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
        <label class="be-check"><input type="checkbox" id="be-featured" ${post.featured ? 'checked' : ''}> <b>★ Избранное</b> <small>— показывать справа в блоке блога на главной</small></label>
        <label class="be-f"><span>Адрес статьи <small id="be-slug-note">${post.status === 'published' ? '(статья опубликована — адрес лучше не менять, иначе старые ссылки перестанут работать)' : '(заполняется сам из заголовка; можно поправить)'}</small></span><div class="be-slug"><span>pigeonpolly.com/blog/</span><input type="text" id="be-slug" value="${esc(post.slug)}" spellcheck="false"><span>/</span></div></label>
      </section>
      <div class="be-save">
        <button type="button" class="pill-btn" data-save="draft">${post.status === 'published' ? 'Снять с публикации' : 'Сохранить черновик'}</button>
        <button type="button" class="pill-btn pill-fill" data-save="published">${post.status === 'published' ? 'Сохранить изменения' : 'Опубликовать'}</button>
        ${post.id ? `<a class="pill-btn" href="/ru/blog/${esc(post.slug)}/" target="_blank">Посмотреть ↗</a>` : ''}
        <p class="be-status" role="status" aria-live="polite"></p>
      </div>
      <input type="file" id="be-file" accept="image/*" hidden>`;
    const $ = s => app.querySelector(s);
    const status = msg => { $('.be-status').innerHTML = msg; };
    let cover = post.cover, active = 'ru', fileTarget = null;
    const bodies = [...app.querySelectorAll('.be-body')];
    document.execCommand('defaultParagraphSeparator', false, 'p');

    const collect = () => {
      const d = { id: post.id, slug: slugify($('#be-slug').value), cover, featured: $('#be-featured').checked, src_lang: $('#be-src').value };
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
        else if (c === 'clear') { document.execCommand('removeFormat'); document.execCommand('unlink'); document.execCommand('formatBlock', false, 'p'); }
        else if (c === 'link') {
          const u = prompt('Адрес ссылки (https://…). Пусто — убрать ссылку.', 'https://');
          if (u === null) return;
          if (!u.trim() || u.trim() === 'https://') document.execCommand('unlink');
          else document.execCommand('createLink', false, u.trim());
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
    $('#be-tr').addEventListener('click', async () => {
      const ru = collect(), from = active, targets = LANGS.map(x => x[0]).filter(x => x !== from);
      if (!ru['t_' + from].trim() && !stripHtml(ru['b_' + from])) { status(`Во вкладке ${from.toUpperCase()} пока пусто — напишите или вставьте статью.`); return; }
      const filled = targets.filter(l => ru['t_' + l] || stripHtml(ru['b_' + l]));
      if (filled.length && !confirm(`Во вкладках ${filled.map(x => x.toUpperCase()).join(' и ')} уже есть текст. Заменить его новым переводом?`)) return;
      const btn = $('#be-tr'); btn.disabled = true;
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
          for (let i = 0; i < texts.length; i += 15) {
            const r = await api('blog/admin/translate', { texts: texts.slice(i, i + 15), from, to: l });
            out.push(...r.texts);
            if (r.engine !== 'gemini') backup = true;
            const pct = Math.round(out.length / texts.length * 100);
            bar(l, pct, pct >= 100 ? (backup ? 'готово (запасной переводчик — проверьте внимательнее)' : 'готово ✓') : pct + '%');
          }
          const res = rebuild(out);
          app.querySelector(`[data-k="t_${l}"]`).value = res.t;
          app.querySelector(`[data-k="d_${l}"]`).value = res.d;
          setTags(l, res.tags.split(','));
          app.querySelector(`[data-k="b_${l}"]`).innerHTML = res.b;
          autoSlug();
        }
        $('#be-src').value = from; // запоминаем язык оригинала — для пометки под переводом
        status(`Готово! Проверьте переводы во вкладках ${targets.map(x => x.toUpperCase()).join(' и ')} — их можно поправить.`);
        touch();
      } catch (e) { status(errText(e)); prog.querySelectorAll('.be-prog:not(.done) em').forEach(x => { x.textContent = 'остановлено'; }); }
      btn.disabled = false;
    });

    // сохранение
    app.querySelectorAll('[data-save]').forEach(b => b.addEventListener('click', async () => {
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

  // делим статью на кусочки для переводчика и собираем обратно
  function splitForTranslation(ru, from) {
    const texts = [ru['t_' + from], ru['d_' + from], ru['tags_' + from]];
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
  const stripHtml = s => String(s || '').replace(/<[^>]*>/g, '').trim();

  start();
})();
