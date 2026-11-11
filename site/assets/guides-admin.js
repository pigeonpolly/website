// Кабинет → «🎬 Видео и книги» (admin.js открывает PPGuidesAdmin.mount(main)): добавить видеоурок YouTube (бесплатный или VIP)
// или гайд/книгу (ссылка + обложка). Сервер — worker/guides.js (/api/admin/guides), на сайте — v2.js и cabinet.js (/api/v2/guides).
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ERR = { yt: 'Не похоже на ссылку YouTube — скопируйте адрес видео (youtu.be/… или youtube.com/watch?v=…).', url: 'Нужна ссылка, которая начинается с https://',
    title: 'Напишите название книги.', cover: 'Добавьте обложку книги (картинку).', img: 'Картинка слишком большая — до 3 МБ.', admin: 'Нужно войти как админ.' };
  const api = async fd => {
    const r = await fetch('/api/admin/guides', fd ? { method: 'POST', credentials: 'same-origin', body: fd } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
    return d.items || [];
  };
  // обложка: уменьшаем до 900 px по длинной стороне, JPEG
  const jpeg = file => new Promise((ok, no) => {
    const im = new Image(); im.onload = () => {
      const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
      c.toBlob(b => b ? ok(b) : no(new Error('img')), 'image/jpeg', 0.86); URL.revokeObjectURL(im.src);
    }; im.onerror = () => no(Object.assign(new Error('img'), { code: 'badimg' })); im.src = URL.createObjectURL(file);
  });
  const L3 = [['ru', 'RU'], ['en', 'EN'], ['lv', 'LV']];
  const inp = 'style="width:100%;padding:10px 12px;font:inherit;box-sizing:border-box"';

  function form(box, x, done) {
    const kind = x ? x.kind : box.dataset.kind, v = kind === 'video', t = (x && x.t) || {};
    box.innerHTML = `<section class="adm-box"><h2>${x ? '✏️ Править' : v ? '🎬 Новое видео' : '📘 Новая книга'}</h2>
      <p><label>${v ? 'Ссылка на видео YouTube' : 'Ссылка на книгу (Amazon, Google Drive…)'}<br>
        <input ${inp} class="be-input gd-url" value="${esc(x ? (v ? 'https://youtu.be/' + x.yt : x.url) : '')}" placeholder="${v ? 'https://youtu.be/…' : 'https://…'}"></label></p>
      ${v ? `<p class="adm-quick"><label><input type="radio" name="gd-vip" value="0"${x && x.vip ? '' : ' checked'}> Бесплатное — видят все</label>
        <label><input type="radio" name="gd-vip" value="1"${x && x.vip ? ' checked' : ''}> VIP — только тем, кто вошёл</label></p>`
        : `<p><label><input type="checkbox" class="gd-free"${x && x.free ? ' checked' : ''}> Бесплатная (PDF и т. п.)</label></p>`}
      <p class="be-note">Название — хотя бы на одном языке, остальные переведутся сами.${v ? ' Можно пусто — возьмётся название с YouTube.' : ''}</p>
      ${L3.map(([l, n]) => `<p><label>${n}<br><input ${inp} class="be-input gd-t" data-l="${l}" maxlength="120" value="${esc(t[l] || '')}"></label></p>`).join('')}
      <p><label>${v ? 'Своя обложка (можно пусто — возьмётся кадр с YouTube)' : 'Обложка'}<br><input type="file" accept="image/*" class="gd-pic"></label></p>
      ${x && x.img ? `<p><img src="${esc(x.cover)}" alt="" style="max-height:120px;border-radius:8px"> ${v ? '<label><input type="checkbox" class="gd-nocov"> убрать свою обложку</label>' : ''}</p>` : ''}
      <div class="adm-quick"><button type="button" class="pill-btn pill-fill gd-save">${x ? '💾 Сохранить' : '➕ Добавить на сайт'}</button><button type="button" class="pill-btn gd-cancel">Отмена</button></div>
      <p class="be-note gd-msg" aria-live="polite"></p></section>`;
    const $ = q => box.querySelector(q), msg = $('.gd-msg');
    $('.gd-cancel').onclick = () => { box.innerHTML = ''; };
    $('.gd-save').onclick = async () => {
      const b = $('.gd-save'), fd = new FormData();
      fd.set('act', 'save'); fd.set('kind', kind); if (x) fd.set('id', x.id);
      fd.set('url', $('.gd-url').value.trim());
      if (v) fd.set('vip', (box.querySelector('[name=gd-vip]:checked') || {}).value || '0'); else fd.set('free', $('.gd-free').checked ? '1' : '0');
      box.querySelectorAll('.gd-t').forEach(i => fd.set('t_' + i.dataset.l, i.value.trim()));
      if ($('.gd-nocov') && $('.gd-nocov').checked) fd.set('nocover', '1');
      b.disabled = true; msg.textContent = '⏳ Сохраняю и перевожу название…';
      try {
        const f = $('.gd-pic').files[0]; if (f) fd.set('cover', await jpeg(f), 'cover.jpg');
        const items = await api(fd); box.innerHTML = ''; done(items, x ? '✓ Сохранено' : '✓ Добавлено — уже на сайте');
      } catch (e) { b.disabled = false; msg.textContent = ERR[e.code] || (e.code === 'badimg' ? 'Не получилось открыть картинку — попробуйте JPG или PNG.' : 'Ошибка: ' + e.message); }
    };
  }

  function list(box, items, onEdit, onChange) {
    if (!items.length) { box.innerHTML = '<p class="be-note">Пока ничего не добавлено. Уже на сайте: 2 бесплатных урока, VIP «Обзор акварели» и книги — они остаются.</p>'; return; }
    box.innerHTML = items.map((x, i) => `<div class="adm-box" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap${x.hidden ? ';opacity:.5' : ''}">
      <img src="${esc(x.cover)}" alt="" style="width:96px;height:64px;object-fit:cover;border-radius:8px;background:#eee">
      <div style="flex:1;min-width:180px"><b>${esc((x.t && (x.t.ru || x.t.en)) || 'Название с YouTube')}</b><br>
        <small class="be-note">${x.kind === 'video' ? (x.vip ? '🔒 VIP-видео' : '🎬 Бесплатное видео') : x.free ? '📘 Бесплатная книга' : '📘 Книга'}${x.hidden ? ' · скрыто' : ''} ·
        <a href="${esc(x.kind === 'video' ? 'https://youtu.be/' + x.yt : x.url)}" target="_blank" rel="noopener">ссылка</a></small></div>
      <div class="adm-quick" style="margin:0">
        <button type="button" class="pill-btn" data-a="up" data-i="${i}" title="Выше"${i ? '' : ' disabled'}>↑</button>
        <button type="button" class="pill-btn" data-a="down" data-i="${i}" title="Ниже"${i < items.length - 1 ? '' : ' disabled'}>↓</button>
        <button type="button" class="pill-btn" data-a="edit" data-i="${i}">✏️ Править</button>
        <button type="button" class="pill-btn" data-a="hide" data-i="${i}">${x.hidden ? '👁 Показать' : '🙈 Скрыть'}</button>
        <button type="button" class="pill-btn" data-a="del" data-i="${i}">🗑</button></div></div>`).join('');
    box.querySelectorAll('[data-a]').forEach(b => b.onclick = async () => {
      const x = items[b.dataset.i], a = b.dataset.a;
      if (a === 'edit') return onEdit(x);
      if (a === 'del' && !confirm('Убрать с сайта насовсем?')) return;
      const fd = new FormData(); fd.set('act', a); fd.set('id', x.id); b.disabled = true;
      try { onChange(await api(fd)); } catch (e) { b.disabled = false; alert(ERR[e.code] || 'Ошибка: ' + e.message); }
    });
  }

  async function mount(main) {
    main.innerHTML = `<section class="adm-box"><h2>➕ Добавить</h2>
        <p class="be-note">Новое встаёт первым. Бесплатные видео — на «Уроках» и на главной, VIP — в «VIP-уроках» (гостю — замочек и «Войти»), книги — на полке «Книги» и на главной. Всё это — и в кабинете ученика.</p>
        <div class="adm-quick"><button type="button" class="pill-btn pill-fill" data-k="video">🎬 Видео с YouTube</button><button type="button" class="pill-btn pill-fill" data-k="book">📘 Книга</button></div>
        <p class="be-note gd-done" aria-live="polite"></p></section>
      <div class="gd-form"></div><h3>На сайте</h3><div class="gd-list"><p class="be-note">Загрузка…</p></div>`;
    const fbox = main.querySelector('.gd-form'), lbox = main.querySelector('.gd-list'), done = main.querySelector('.gd-done');
    const show = items => list(lbox, items, x => { form(fbox, x, after); fbox.scrollIntoView({ behavior: 'smooth' }); }, show);
    const after = (items, m) => { done.textContent = m; show(items); };
    main.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { fbox.dataset.kind = b.dataset.k; form(fbox, null, after); done.textContent = ''; });
    try { show(await api()); } catch (e) { lbox.innerHTML = `<p class="be-note">${esc(ERR[e.code] || 'Ошибка: ' + e.message)}</p>`; }
  }
  window.PPGuidesAdmin = { mount };
})();
