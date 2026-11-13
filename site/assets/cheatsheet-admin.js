// Кабинет → «🧩 Конструктор шпаргалок» (admin.js открывает PPCheatAdmin.mount(main)): шпаргалка из блоков в стиле главной (зима),
// картинки, шаги, текст, советы, списки; ширина «во всю / пол-строки», перестановка (↑↓ и перетаскиванием), RU/EN/LV + «🌐 Перевести»,
// черновик или «Выложить в шпаргалки» (для всех / для своих). Сервер — worker/guides.js (/api/admin/guides, built=1),
// на сайте — /learn/ (фильтр «Шпаргалки», «На 3 языках») и /learn/v/<id>/ (v2.js, стиль — cheatsheet.css).
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LANGS = ['ru', 'en', 'lv'];
  const KINDS = { h: ['✦ Заголовок', 'Заголовок раздела'], p: ['¶ Текст', 'Текст. Пустая строка — новый абзац'], img: ['🖼 Картинка', 'Подпись под картинкой (можно пусто)'],
    step: ['① Шаг', 'Что делаем на этом шаге'], tip: ['💡 Совет', 'Совет или важная мелочь'], list: ['• Список', 'Каждый пункт — с новой строки'] };
  const ERR = { title: 'Напишите название.', blocks: 'Добавьте хотя бы один блок.', img: 'Картинка слишком большая.', admin: 'Нужно войти как админ.', badimg: 'Не получилось открыть картинку — попробуйте JPG или PNG.' };
  const rid = () => Math.random().toString(36).slice(2, 8);
  const api = async fd => {
    const r = await fetch('/api/admin/guides', fd ? { method: 'POST', credentials: 'same-origin', body: fd } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
    return d.items || [];
  };
  const jpeg = (file, max) => new Promise((ok, no) => {
    const im = new Image(); im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
      c.toBlob(b => b ? ok(b) : no(new Error('img')), 'image/jpeg', 0.86); URL.revokeObjectURL(im.src);
    }; im.onerror = () => no(Object.assign(new Error('img'), { code: 'badimg' })); im.src = URL.createObjectURL(file);
  });
  // шрифты главной (в кабинете их нет): Fraunces 400 и курсив, Caveat
  const fonts = () => { if (document.getElementById('csb-fonts')) return; const l = document.createElement('link'); l.id = 'csb-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Nunito+Sans:wght@400;700&display=swap'; document.head.appendChild(l); const f = document.createElement('link'); f.rel = 'stylesheet'; f.href = '/assets/fraunces.css'; document.head.appendChild(f); };

  // предпросмотр — так же, как на сайте (v2.js, страница /learn/v/<id>/)
  function sheet(S, lang) {
    const bt = b => b.t[lang] || b.t.ru || b.t.en || b.t.lv || '';
    const paras = s => s.split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
    let n = 0;
    return `<div class="cs-sheet">${S.blocks.map(b => { const t = bt(b), w = b.w === 'half' ? ' half' : '', im = b.url ? `<img src="${esc(b.url)}" alt="">` : '';
      if (b.k === 'h') return `<h2 class="cs-b cs-h">${esc(t)}</h2>`;
      if (b.k === 'p') return `<div class="cs-b cs-p${w}">${paras(t)}</div>`;
      if (b.k === 'img') return `<figure class="cs-b cs-img${w}">${im}${t ? `<figcaption>${esc(t)}</figcaption>` : ''}</figure>`;
      if (b.k === 'step') return `<div class="cs-b cs-step${w}"><span class="cs-n">${++n}</span>${im}${t ? `<div class="cs-st">${paras(t)}</div>` : ''}</div>`;
      if (b.k === 'tip') return `<aside class="cs-b cs-tip${w}">${paras(t)}</aside>`;
      return `<ul class="cs-b cs-list${w}">${t.split('\n').filter(s => s.trim()).map(s => `<li>${esc(s.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul>`;
    }).join('')}</div>`;
  }

  function editor(box, x, done) {
    const S = { id: x ? x.id : '', t: { ...((x && x.t) || {}) }, d: { ...((x && x.d) || {}) }, vip: x && x.vip ? 1 : 0, lang: 'ru', prev: false,
      blocks: x ? (x.blocks || []).map(b => ({ id: b.id, k: b.k, w: b.w, t: { ...b.t }, img: b.img, url: b.img ? `/api/img/${b.img}` : '' }))
        : [{ id: rid(), k: 'p', w: 'full', t: {} }, { id: rid(), k: 'step', w: 'half', t: {} }, { id: rid(), k: 'step', w: 'half', t: {} }, { id: rid(), k: 'tip', w: 'full', t: {} }] };
    let dirty = false, dragI = -1;
    const draw = () => {
      const L = S.lang;
      box.innerHTML = `<div class="csb"><p class="csb-k">${x ? 'Правка шпаргалки' : 'Новая шпаргалка'}${x && x.hidden ? ' · черновик' : ''}</p>
        <h2 class="csb-t">Шпаргалка <em>из блоков</em></h2>
        <p class="csb-note">Пишите на одном языке и нажмите «🌐 Перевести» — потом проверьте вкладки. Что не переведено, переведётся само при сохранении. Блоки перетаскиваются за название или кнопками ↑↓; «⇆» — во всю ширину или пол-строки (на телефоне всё в столбик).</p>
        <div class="csb-row"><span class="csb-lang" role="group" aria-label="Язык">${LANGS.map(l => `<button type="button" data-lang="${l}" aria-pressed="${l === L}">${l.toUpperCase()}</button>`).join('')}</span><span class="csb-tr"></span>
          <button type="button" class="csb-pv" aria-pressed="${S.prev}">👁 Как на сайте</button></div>
        <label class="csb-l">Название · ${L.toUpperCase()}</label><input type="text" class="csb-title" maxlength="120" data-f="t" value="${esc(S.t[L] || '')}">
        <label class="csb-l">Короткое описание (над шпаргалкой, можно пусто) · ${L.toUpperCase()}</label><textarea rows="2" maxlength="3000" data-f="d">${esc(S.d[L] || '')}</textarea>
        ${S.prev ? `<div class="csb-prev"><p class="csb-k">Так увидят на сайте (${L.toUpperCase()})</p>${sheet(S, L)}</div>` : `<div class="csb-ed">${S.blocks.map((b, i) => `<div class="csb-blk k-${b.k}${b.w === 'half' ? ' half' : ''}" data-i="${i}">
          <div class="csb-bar"><b draggable="true" title="Перетащить">⠿ ${KINDS[b.k][0]}</b>
            ${b.k === 'h' ? '' : `<button type="button" data-a="w" title="Ширина">${b.w === 'half' ? '⇆ пол-строки' : '⇆ во всю'}</button>`}
            <button type="button" data-a="up"${i ? '' : ' disabled'} title="Выше">↑</button><button type="button" data-a="down"${i < S.blocks.length - 1 ? '' : ' disabled'} title="Ниже">↓</button><button type="button" data-a="del" title="Убрать">✕</button></div>
          ${b.k === 'img' || b.k === 'step' ? `${b.url ? `<img class="pic" src="${esc(b.url)}" alt="">` : ''}<p><input type="file" accept="image/*" data-a="pic"></p>` : ''}
          ${b.k === 'h' ? `<textarea rows="1" data-b="${i}" placeholder="${KINDS.h[1]}">${esc(b.t[L] || '')}</textarea>` : `<textarea rows="${b.k === 'p' || b.k === 'list' ? 5 : 3}" data-b="${i}" placeholder="${KINDS[b.k][1]}">${esc(b.t[L] || '')}</textarea>`}
        </div>`).join('')}<div class="csb-add">${Object.keys(KINDS).map(k => `<button type="button" data-add="${k}">＋ ${KINDS[k][0]}</button>`).join('')}</div></div>`}
        <label class="csb-l">Кто видит</label>
        <div class="csb-row"><label><input type="radio" name="csb-vip" value="0"${S.vip ? '' : ' checked'}> Для всех</label><label><input type="radio" name="csb-vip" value="1"${S.vip ? ' checked' : ''}> Для своих — только тем, кто вошёл</label></div>
        <p class="csb-note">На сайте у шпаргалки будет пометка «🌍 На 3 языках» и ссылки на EN / RU / LV.</p>
        <div class="csb-row"><button type="button" class="acc" data-save="pub">📤 Выложить в шпаргалки</button><button type="button" data-save="draft">💾 Черновик (на сайте не видно)</button><button type="button" data-a="close">Закрыть</button></div>
        <p class="csb-msg" aria-live="polite"></p></div>`;
      const $ = q => box.querySelector(q), msg = $('.csb-msg');
      box.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { S.lang = b.dataset.lang; draw(); });
      $('.csb-pv').onclick = () => { S.prev = !S.prev; draw(); };
      box.querySelectorAll('[data-f]').forEach(i => i.oninput = () => { S[i.dataset.f][S.lang] = i.value; dirty = true; });
      box.querySelectorAll('textarea[data-b]').forEach(i => i.oninput = () => { S.blocks[i.dataset.b].t[S.lang] = i.value; dirty = true; });
      box.querySelectorAll('[name=csb-vip]').forEach(r => r.onchange = () => { S.vip = r.value === '1' ? 1 : 0; dirty = true; });
      if (window.PPTranslateBtn) $('.csb-tr').appendChild(window.PPTranslateBtn({ from: () => S.lang, about: 'short',
        texts: () => [S.t[S.lang] || '', S.d[S.lang] || '', ...S.blocks.map(b => b.t[S.lang] || '')],
        fill: (l, tr) => { if (tr[0]) S.t[l] = tr[0]; if (tr[1]) S.d[l] = tr[1]; S.blocks.forEach((b, i) => { if (tr[i + 2]) b.t[l] = tr[i + 2]; }); dirty = true; },
        done: () => { draw(); box.querySelector('.csb-msg').textContent = '✓ Переведено — проверьте вкладки ' + LANGS.filter(l => l !== S.lang).map(l => l.toUpperCase()).join(' и '); } }));
      box.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { const k = b.dataset.add; S.blocks.push({ id: rid(), k, w: k === 'step' || k === 'img' ? 'half' : 'full', t: {} }); dirty = true; draw(); });
      box.querySelectorAll('.csb-blk').forEach(el => {
        const i = +el.dataset.i, b = S.blocks[i];
        el.querySelectorAll('button[data-a]').forEach(btn => btn.onclick = () => {
          const a = btn.dataset.a;
          if (a === 'w') b.w = b.w === 'half' ? 'full' : 'half';
          if (a === 'up' || a === 'down') { const j = i + (a === 'up' ? -1 : 1); [S.blocks[i], S.blocks[j]] = [S.blocks[j], S.blocks[i]]; }
          if (a === 'del') { if ((b.url || LANGS.some(l => b.t[l])) && !confirm('Убрать этот блок?')) return; S.blocks.splice(i, 1); }
          dirty = true; draw();
        });
        const fi = el.querySelector('input[data-a=pic]');
        if (fi) fi.onchange = async () => {
          const f = fi.files[0]; if (!f) return;
          try { b.file = await jpeg(f, 1600); b.thumb = await jpeg(f, 600); b.url = URL.createObjectURL(b.file); dirty = true; draw(); }
          catch (e) { msg.textContent = ERR.badimg; }
        };
        // перетаскивание за название блока
        const h = el.querySelector('[draggable]');
        h.ondragstart = e => { dragI = i; el.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); };
        h.ondragend = () => el.classList.remove('drag');
        el.ondragover = e => { if (dragI < 0) return; e.preventDefault(); el.classList.add('over'); };
        el.ondragleave = () => el.classList.remove('over');
        el.ondrop = e => { e.preventDefault(); el.classList.remove('over'); if (dragI < 0 || dragI === i) return; const [m] = S.blocks.splice(dragI, 1); S.blocks.splice(i, 0, m); dragI = -1; dirty = true; draw(); };
      });
      $('[data-a=close]').onclick = () => { if (dirty && !confirm('Закрыть без сохранения?')) return; box.innerHTML = ''; done(null); };
      box.querySelectorAll('[data-save]').forEach(btn => btn.onclick = async () => {
        const src = S.t[S.lang] ? S.lang : LANGS.find(l => S.t[l]);
        if (!src) { msg.textContent = ERR.title; return; }
        const fd = new FormData();
        fd.set('act', 'save'); fd.set('kind', 'howto'); fd.set('built', '1'); if (S.id) fd.set('id', S.id);
        fd.set('vip', String(S.vip)); fd.set('draft', btn.dataset.save === 'draft' ? '1' : '0'); fd.set('src', src);
        for (const l of LANGS) { fd.set('t_' + l, (S.t[l] || '').trim()); fd.set('d_' + l, (S.d[l] || '').trim()); }
        fd.set('blocks', JSON.stringify(S.blocks.map(b => ({ id: b.id, k: b.k, w: b.w, t: b.t, img: b.file ? '' : b.img || '' }))));
        S.blocks.forEach(b => { if (b.file) { fd.append('bi_' + b.id, b.file, 'b.jpg'); fd.append('bt_' + b.id, b.thumb, 't.jpg'); } });
        box.querySelectorAll('[data-save]').forEach(z => z.disabled = true); msg.textContent = '⏳ Сохраняю и перевожу…';
        try {
          const items = await api(fd), y = S.id ? items.find(z => z.id === S.id) : items.find(z => z.built && !S.known.has(z.id));
          dirty = false; done(items, y, btn.dataset.save === 'draft' ? '✓ Черновик сохранён' : '✓ Выложено в «Шпаргалки» на «Уроках»');
        } catch (e) { box.querySelectorAll('[data-save]').forEach(z => z.disabled = false); msg.textContent = ERR[e.code] || 'Ошибка: ' + e.message; }
      });
    };
    S.known = new Set(); editor.known && editor.known.forEach(id => S.known.add(id));
    draw();
  }

  function list(box, items, onEdit, onChange) {
    const own = items.filter(x => x.built);
    if (!own.length) { box.innerHTML = '<p class="csb-note">Пока нет собранных шпаргалок. Загруженные картинками или PDF — в «🎬 Видео и книги».</p>'; return; }
    box.innerHTML = own.map(x => `<div class="csb-it"><img src="${esc(x.cover)}" alt="">
      <div class="nm"><b>${esc(x.t.ru || x.t.en || x.t.lv || '')}</b><br>
        <span class="csb-tag${x.hidden ? ' dr' : ''}">${x.hidden ? 'Черновик' : 'На сайте'}</span><span class="csb-tag">${x.vip ? '🔒 Для своих' : 'Для всех'}</span><span class="csb-tag">🌍 EN · RU · LV</span>
        ${x.hidden ? '' : `<a href="/ru/learn/v/${esc(x.id)}/" target="_blank" rel="noopener">открыть ↗</a>`}</div>
      <button type="button" data-a="edit" data-id="${esc(x.id)}">✏️ Править</button>
      <button type="button" data-a="hide" data-id="${esc(x.id)}">${x.hidden ? '📤 Выложить' : '🙈 В черновики'}</button>
      <button type="button" data-a="del" data-id="${esc(x.id)}">🗑</button></div>`).join('');
    box.querySelectorAll('[data-a]').forEach(b => b.onclick = async () => {
      const x = own.find(z => z.id === b.dataset.id), a = b.dataset.a;
      if (a === 'edit') return onEdit(x);
      if (a === 'del' && !confirm('Удалить шпаргалку насовсем (с картинками)?')) return;
      const fd = new FormData(); fd.set('act', a); fd.set('id', x.id); b.disabled = true;
      try { onChange(await api(fd)); } catch (e) { b.disabled = false; alert(ERR[e.code] || 'Ошибка: ' + e.message); }
    });
  }

  async function mount(main) {
    fonts();
    main.innerHTML = `<div class="csb"><p class="csb-k">Шпаргалки</p><h2 class="csb-t">Конструктор <em>шпаргалок</em></h2>
      <p class="csb-note">Собранные здесь шпаргалки — на «Уроках» (фильтр «Шпаргалки»), со своей страницей и пометкой «🌍 На 3 языках».</p>
      <div class="csb-row"><button type="button" class="acc csb-new">＋ Новая шпаргалка</button></div><p class="csb-msg csb-done" aria-live="polite"></p>
      <div class="csb-list"><p class="csb-note">Загрузка…</p></div></div><div class="csb-form"></div>`;
    const fbox = main.querySelector('.csb-form'), lbox = main.querySelector('.csb-list'), msg = main.querySelector('.csb-done');
    const remember = items => { editor.known = new Set(items.map(x => x.id)); };
    const show = items => { remember(items); list(lbox, items, open, show); };
    const after = (items, y, m) => { if (!items) return; show(items); msg.textContent = m || ''; if (y) open(y); fbox.querySelector('.csb-msg') && (fbox.querySelector('.csb-msg').textContent = m || ''); };
    const open = x => { msg.textContent = ''; editor(fbox, x, after); fbox.scrollIntoView({ behavior: 'smooth' }); };
    main.querySelector('.csb-new').onclick = () => open(null);
    try { show(await api()); } catch (e) { lbox.innerHTML = `<p class="csb-note">${esc(ERR[e.code] || 'Ошибка: ' + e.message)}</p>`; }
  }
  window.PPCheatAdmin = { mount };
})();
