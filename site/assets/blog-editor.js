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
    title: 'Нужен заголовок.', login: 'Сессия закончилась — войдите снова.', admin: 'Нужен вход администратора.',
  };
  const errText = e => ERR[e.code] || 'Что-то пошло не так (' + esc(e.code || e.message) + ').';
  let state = null, dirty = false;
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
    app.innerHTML = `<div class="be-top">
        <a class="pill-btn pill-fill" href="#new">＋ Новая статья</a>
        <label class="be-switch"><input type="checkbox" id="be-strict" ${state.strict ? 'checked' : ''}><span></span>
          <b>Строгий режим</b><small>не больше 1 комментария в час с одного адреса</small></label>
      </div>
      ${pend.length ? `<section class="be-card be-pend"><h2>Комментарии со ссылками ждут проверки (${pend.length})</h2><ol>${pend.map(c => `
        <li data-cid="${c.id}"><p><b>${esc(c.name)}</b> → <a href="/ru/blog/${esc(c.slug)}/#comments" target="_blank">${esc(c.t_ru)}</a> · ${fmt(c.created_at)}</p>
        <p class="be-ctext">${esc(c.body)}</p><p><button class="pill-btn" data-ok>Одобрить</button> <button class="pill-btn be-danger" data-del>Удалить</button></p></li>`).join('')}</ol></section>` : ''}
      <section class="be-card"><h2>Статьи</h2>${state.posts.length ? `<table class="be-table"><thead><tr><th>Статья</th><th>Статус</th><th>Дата</th><th title="лайки">♥</th><th title="просмотры">👁</th><th title="комментарии">💬</th><th></th></tr></thead><tbody>
        ${state.posts.map(p => `<tr data-id="${p.id}"><td><button class="be-star" data-star aria-pressed="${!!p.featured}" title="Избранное: показывать справа на главной">${p.featured ? '★' : '☆'}</button> <a href="#${p.id}"><b>${esc(p.t_ru || p.t_en || '(без названия)')}</b></a><small>/blog/${esc(p.slug)}/</small></td>
          <td><span class="be-st ${p.status}">${p.status === 'published' ? 'опубликована' : 'черновик'}</span></td><td>${fmt(p.published_at || p.updated_at)}</td>
          <td>${p.likes}</td><td>${p.views}</td><td>${p.comments}</td>
          <td class="be-acts"><a href="#${p.id}">Изменить</a> <a href="/ru/blog/${esc(p.slug)}/" target="_blank">Открыть ↗</a> <button class="bc-link be-danger" data-delpost>Удалить</button></td></tr>`).join('')}
      </tbody></table>` : '<p class="be-note">Пока ни одной статьи. Нажмите «Новая статья».</p>'}</section>
      ${state.media ? '' : '<p class="be-note">⚠ Хранилище картинок (R2) не подключено — загрузка картинок не заработает.</p>'}`;
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
    if (id) {
      app.innerHTML = '<p class="be-note">Загрузка…</p>';
      try { post = (await api('blog/admin/post?id=' + id)).post; } catch (e) { app.innerHTML = `<p class="be-note">${errText(e)}</p>`; return; }
    }
    for (const [l] of LANGS) for (const k of ['t', 'd', 'tags', 'b']) post[`${k}_${l}`] = post[`${k}_${l}`] || '';
    const local = loadLocal(post.id);
    if (local && local.saved > (post.updated_at || 0) * 1000 && confirm('Есть несохранённая версия этой статьи из этого браузера. Восстановить её?')) {
      Object.assign(post, local.data); dirty = true;
    }
    app.innerHTML = `<p class="be-back"><a href="#">← Все статьи</a></p>
      <div class="be-tabs" role="tablist">${LANGS.map(([l, n], i) => `<button type="button" role="tab" data-tab="${l}" aria-selected="${!i}">${n}</button>`).join('')}
        <button type="button" class="pill-btn pill-fill be-tr" id="be-tr">🌐 Перевести с RU на EN и LV</button></div>
      <p class="be-hint">Можно писать прямо здесь или вставить готовую статью из Google Docs (Ctrl+A, Ctrl+C → Ctrl+V в поле «Текст»): заголовок, жирный, списки и картинки перенесутся, а картинки при сохранении скопируются на сайт.</p>
      ${LANGS.map(([l], i) => `<section class="be-pane" data-pane="${l}" ${i ? 'hidden' : ''}>
        <label class="be-f"><span>Заголовок</span><input type="text" data-k="t_${l}" maxlength="200" value="${esc(post['t_' + l])}"></label>
        <label class="be-f"><span>Краткое описание <small>(видно в списке статей и в Google)</small></span><textarea data-k="d_${l}" rows="2" maxlength="400">${esc(post['d_' + l])}</textarea></label>
        <label class="be-f"><span>Теги <small>(через запятую)</small></span><input type="text" data-k="tags_${l}" value="${esc(post['tags_' + l])}"></label>
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
        <label class="be-check"><input type="checkbox" id="be-featured" ${post.featured ? 'checked' : ''}> <b>★ Избранное</b> <small>— показывать справа в блоке блога на главной</small></label>
        <label class="be-f"><span>Адрес статьи <small>(пусто = из английского заголовка)</small></span><div class="be-slug"><span>/blog/</span><input type="text" id="be-slug" value="${esc(post.slug)}" pattern="[a-z0-9-]*"><span>/</span></div></label>
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
      const d = { id: post.id, slug: $('#be-slug').value.trim(), cover, featured: $('#be-featured').checked };
      app.querySelectorAll('[data-k]').forEach(el => { d[el.dataset.k] = el.isContentEditable ? el.innerHTML : el.value; });
      return d;
    };
    const touch = () => { dirty = true; saveLocal(post.id, collect()); };
    app.addEventListener('input', touch);
    app.addEventListener('change', touch);

    // вкладки языков
    app.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
      active = b.dataset.tab;
      app.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === b));
      app.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== active; });
      const others = LANGS.map(x => x[0]).filter(x => x !== active).map(x => x.toUpperCase());
      $('#be-tr').textContent = `🌐 Перевести с ${active.toUpperCase()} на ${others.join(' и ')}`;
    }));

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
    const insertImage = (body, url) => {
      restore(body);
      document.execCommand('insertHTML', false, `<figure><img src="${esc(url)}" alt=""></figure><p><br></p>`);
      touch();
    };
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
        }
      });
    });

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
      try {
        for (const l of targets) {
          const { texts, rebuild } = splitForTranslation(ru, from);
          status(`Перевожу на ${l.toUpperCase()}… (длинная статья — до минуты)`);
          const r = await api('blog/admin/translate', { texts, from, to: l });
          const out = rebuild(r.texts);
          app.querySelector(`[data-k="t_${l}"]`).value = out.t;
          app.querySelector(`[data-k="d_${l}"]`).value = out.d;
          app.querySelector(`[data-k="tags_${l}"]`).value = out.tags;
          app.querySelector(`[data-k="b_${l}"]`).innerHTML = out.b;
        }
        status(`Готово! Проверьте переводы во вкладках ${targets.map(x => x.toUpperCase()).join(' и ')} — их можно поправить.`);
        touch();
      } catch (e) { status(errText(e)); }
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
        dirty = false; dropLocal(post.id); dropLocal(r.id);
        if (!post.id) { history.replaceState(null, '', '#' + r.id); }
        await editor(r.id);
        app.querySelector('.be-status').innerHTML = r.status === 'published'
          ? `Опубликовано ✓ <a href="/ru/blog/${esc(r.slug)}/" target="_blank">открыть статью ↗</a>` : 'Черновик сохранён ✓ (его видите только вы)';
      } catch (e) { status(errText(e)); app.querySelectorAll('[data-save]').forEach(x => { x.disabled = false; }); }
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
        else if (tag === 'figure' || tag === 'hr' || tag === 'img' || !ch.textContent.trim()) continue;
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
  const stripHtml = s => String(s || '').replace(/<[^>]*>/g, '').trim();
  // запасная копия в браузере на случай закрытой вкладки
  const lk = id => 'pp-blog-draft-' + (id || 'new');
  function saveLocal(id, data) { try { localStorage.setItem(lk(id), JSON.stringify({ saved: Date.now(), data })); } catch (e) { /* нет места */ } }
  function loadLocal(id) { try { return JSON.parse(localStorage.getItem(lk(id))); } catch (e) { return null; } }
  function dropLocal(id) { try { localStorage.removeItem(lk(id)); } catch (e) { /* ок */ } }

  start();
})();
