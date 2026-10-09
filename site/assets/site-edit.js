// Режим «✏️ Править страницу» (только для админа, включается в меню аккаунта).
// Наводите на блок — он подсвечивается; нажмите — справа панель: Текст (надписи, ссылки, картинки), Цвета, Код.
// Правка хранится в базе (таблица site_blocks) отдельно для каждого языка; worker подставляет её при отдаче страницы.
// «Скрыть» — блок пропадает на всех языках; «Вернуть как было» — убирает правку, остаётся оригинал из кода сайта.
(function () {
  if (window.PPEdit) return;
  const lang = document.documentElement.lang || 'en';
  const PRE = { en: '', ru: '/ru', lv: '/lv' };
  const basePath = location.pathname.replace(/^\/(ru|lv)(?=\/)/, ''); // путь страницы без языка
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body) => {
    const r = await fetch('/api/' + path, body ? { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || r.status);
    return d;
  };
  let on = false, server = [], bar = null, panel = null, cur = null;
  const raws = {};
  // оригинал страницы (без правок) на нужном языке
  async function rawDoc(l = lang) {
    if (!raws[l]) {
      const t = await (await fetch(PRE[l] + basePath + '?raw=1', { cache: 'no-store', credentials: 'same-origin' })).text();
      raws[l] = new DOMParser().parseFromString(t, 'text/html');
    }
    return raws[l];
  }
  const origOf = async (id, l = lang) => { const o = (await rawDoc(l)).querySelector(`[data-ppb="${CSS.escape(id)}"]`); return o ? o.innerHTML : null; };
  const override = (id, l = lang) => server.find(x => x.id === id && x.lang === l && x.html != null);
  const isHidden = id => server.some(x => x.id === id && x.lang === '*' && x.hidden);
  // устройство страницы: порядок блоков и новые блоки (одно на все языки)
  const pageId = 'page:' + basePath;
  const struct = () => { const r = server.find(x => x.id === pageId && x.lang === '*'); try { return r && r.html ? JSON.parse(r.html) : { order: [], custom: [] }; } catch (e) { return { order: [], custom: [] }; } };
  const blocks = () => [...document.querySelectorAll('#main > [data-ppb]')].map((el, i) => ({ el, i, o: +(getComputedStyle(el).order || 0) })).sort((a, b) => a.o - b.o || a.i - b.i).map(x => x.el);
  function applyOrder(ids) {
    const main = document.getElementById('main'); main.style.display = 'flex'; main.style.flexDirection = 'column';
    [...main.children].forEach(el => { el.style.order = el.dataset.ppb ? (ids.includes(el.dataset.ppb) ? ids.indexOf(el.dataset.ppb) : 999) : -1; });
  }
  async function saveStruct(st) {
    await api('admin/blocks', { id: pageId, lang: '*', html: JSON.stringify(st), page: basePath });
    await load();
  }
  async function move(b, dir) {
    const list = blocks().map(x => x.dataset.ppb), i = list.indexOf(b.dataset.ppb), j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    applyOrder(list); b.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const st = struct(); st.order = list; await saveStruct(st);
  }
  // шаблоны новых блоков
  const TPL = {
    text: ['📝 Текст', '<div class="pp-c pp-c-text"><h2>Заголовок</h2><p>Новый текст. Нажмите «Текст» в панели справа и напишите своё.</p></div>'],
    image: ['🖼 Картинка с подписью', '<figure class="pp-c pp-c-img"><img src="/images/home/first-pigeon-polly.jpg" alt=""><figcaption>Подпись к картинке</figcaption></figure>'],
    gallery: ['🖼🖼 Галерея', '<div class="pp-c pp-c-gal"><h2>Галерея</h2><div class="pp-c-grid"><figure><a href="/images/home/first-pigeon-polly.jpg" data-lightbox><img src="/images/home/first-pigeon-polly.jpg" alt=""></a><figcaption>Подпись</figcaption></figure><figure><a href="/images/home/first-pigeon-polly.jpg" data-lightbox><img src="/images/home/first-pigeon-polly.jpg" alt=""></a><figcaption>Подпись</figcaption></figure><figure><a href="/images/home/first-pigeon-polly.jpg" data-lightbox><img src="/images/home/first-pigeon-polly.jpg" alt=""></a><figcaption>Подпись</figcaption></figure></div></div>'],
    quote: ['❝ Цитата', '<blockquote class="pp-c pp-c-quote"><p>Текст цитаты</p><cite>— автор</cite></blockquote>'],
    button: ['🔘 Кнопка-ссылка', '<div class="pp-c pp-c-btn"><a class="pill-btn pill-fill" href="/">Текст кнопки</a></div>'],
  };
  async function addBlock(kind, after) {
    const id = 'custom-' + Math.random().toString(36).slice(2, 10);
    const el = document.createElement('section'); el.className = 'pp-custom'; el.dataset.ppb = id; el.innerHTML = TPL[kind][1];
    const list = blocks().map(x => x.dataset.ppb);
    const pos = after ? list.indexOf(after.dataset.ppb) + 1 : list.length;
    list.splice(pos, 0, id);
    document.getElementById('main').appendChild(el); applyOrder(list); label();
    const st = struct(); st.custom = [...(st.custom || []), id]; st.order = list;
    await api('admin/blocks', { id, lang, html: TPL[kind][1], page: basePath });
    await saveStruct(st);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' }); open(el);
  }
  async function removeBlock(b) {
    const id = b.dataset.ppb;
    if (!confirm('Удалить этот новый блок совсем (на всех языках)?')) return;
    const st = struct(); st.custom = (st.custom || []).filter(x => x !== id); st.order = (st.order || []).filter(x => x !== id);
    for (const l of Object.keys(PRE)) if (override(id, l)) await api('admin/blocks', { id, lang: l, html: null });
    await saveStruct(st);
    close(true); b.remove();
  }
  // загрузка картинки в хранилище сайта (большие уменьшаем до 2000px)
  async function upload(file) {
    let f = file;
    if (file.type !== 'image/gif' && file.size > 900000) {
      try {
        const bmp = await createImageBitmap(file), k = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
        const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
        c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
        f = await new Promise(r => c.toBlob(r, 'image/jpeg', .88));
      } catch (e) { /* как есть */ }
    }
    const fd = new FormData(); fd.append('file', f, 'image.jpg');
    const r = await fetch('/api/blog/admin/upload', { method: 'POST', credentials: 'same-origin', body: fd });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.url) throw new Error(d.error || r.status);
    return d.url;
  }
  const nameOf = b => { const h = b.querySelector('h1, h2, h3'); return (h ? h.textContent.trim().replace(/\s+/g, ' ').slice(0, 50) : '') || b.dataset.ppb; };
  // вставить HTML в блок и заново запустить его скрипты (карусели, переключатели)
  function setInner(b, html) {
    b.innerHTML = html;
    b.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script');
      [...old.attributes].forEach(a => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }

  async function load() { try { server = (await api('admin/blocks')).blocks; } catch (e) { server = []; } drawBar(); }
  function drawBar() {
    if (!bar) { bar = document.createElement('div'); bar.className = 'pp-bar'; document.body.appendChild(bar); }
    const mine = server.filter(x => x.page === basePath && (x.lang === lang || x.lang === '*'));
    bar.innerHTML = `<span>✏️ <b>Режим правки</b> · нажмите на любой блок</span>
      ${mine.length ? `<details class="pp-changed"><summary>Изменено здесь: ${mine.length}</summary><div>${mine.map(x => `<button type="button" data-go="${esc(x.id)}">${x.lang === '*' ? '🙈 скрыт' : '✎ ' + x.lang.toUpperCase()} · ${esc(nameOf(document.querySelector(`[data-ppb="${CSS.escape(x.id)}"]`) || { dataset: { ppb: x.id }, querySelector: () => null }))}</button>`).join('')}</div></details>` : ''}
      <details class="pp-add"><summary class="pp-btn">＋ Новый блок</summary><div>${Object.entries(TPL).map(([k, [n]]) => `<button type="button" data-add="${k}">${n}</button>`).join('')}</div></details>
      <button type="button" class="pp-btn" data-exit>Выйти из режима</button>`;
    bar.querySelectorAll('[data-add]').forEach(x => x.onclick = () => { x.closest('details').open = false; addBlock(x.dataset.add, cur && cur.b); });
    bar.querySelector('[data-exit]').onclick = toggle;
    bar.querySelectorAll('[data-go]').forEach(g => g.onclick = () => { const b = document.querySelector(`[data-ppb="${CSS.escape(g.dataset.go)}"]`); if (b) { b.scrollIntoView({ behavior: 'smooth', block: 'center' }); open(b); } });
  }
  function label() { document.querySelectorAll('[data-ppb]').forEach(b => { b.dataset.ppbName = nameOf(b); }); }
  function toggle() {
    on = !on;
    document.documentElement.classList.toggle('pp-edit', on);
    if (on) { label(); load(); } else { if (cur && !close()) { on = true; document.documentElement.classList.add('pp-edit'); return; } bar && bar.remove(); bar = null; }
  }
  document.addEventListener('click', e => {
    if (!on || e.target.closest('.pp-panel, .pp-bar, .site-header, .acct')) return;
    const b = e.target.closest('[data-ppb]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    open(b);
  }, true);

  // ---------- панель блока ----------
  async function open(b) {
    if (cur && cur.b === b) return;
    if (cur && !close()) return;
    const id = b.dataset.ppb;
    const orig = await origOf(id);
    const ov = override(id);
    const start = b.innerHTML; // если оригинал не нашёлся (?raw недоступен) — берём то, что на странице
    cur = { b, id, orig: orig ?? start, saved: ov ? ov.html : (orig ?? start), work: ov ? ov.html : (orig ?? start), start, tab: 'text', colors: [], colorMap: {} };
    document.querySelectorAll('.pp-cur').forEach(x => x.classList.remove('pp-cur'));
    b.classList.add('pp-cur');
    if (!panel) { panel = document.createElement('aside'); panel.className = 'pp-panel'; panel.setAttribute('aria-label', 'Правка блока'); document.body.appendChild(panel); }
    panel.hidden = false;
    draw();
  }
  function close(force) {
    if (!cur) return true;
    if (!force && cur.work !== cur.saved && !confirm('Изменения в этом блоке не сохранены. Закрыть без сохранения?')) return false;
    if (cur.work !== cur.saved) setInner(cur.b, cur.saved);
    cur.b.classList.remove('pp-cur');
    cur = null; if (panel) panel.hidden = true;
    return true;
  }
  let pt;
  const preview = () => { clearTimeout(pt); pt = setTimeout(() => { if (cur) setInner(cur.b, cur.work); }, 250); };
  const tplOf = html => { const t = document.createElement('template'); t.innerHTML = html; return t; };

  function draw() {
    const c = cur, hid = isHidden(c.id), edited = !!override(c.id);
    panel.innerHTML = `<header><div><b>${esc(nameOf(c.b))}</b><small>${esc(c.id)} · ${lang.toUpperCase()}</small></div><button type="button" class="pp-x" data-close aria-label="Закрыть">✕</button></header>
      <p class="pp-state">${edited ? '✎ Блок изменён на этом языке' : 'Как в коде сайта'}${hid ? ' · <b>🙈 скрыт от посетителей</b>' : ''}</p>
      <div class="pp-row"><button type="button" class="pp-btn" data-hide>${hid ? '👁 Показать блок' : '🙈 Скрыть блок'}</button>
        ${edited && !c.id.startsWith('custom-') ? '<button type="button" class="pp-btn" data-revert>↺ Вернуть как было</button>' : ''}
        <button type="button" class="pp-btn" data-mv="-1" title="Переставить блок выше">↑ Выше</button><button type="button" class="pp-btn" data-mv="1" title="Переставить блок ниже">↓ Ниже</button>
        ${c.id.startsWith('custom-') ? '<button type="button" class="pp-btn pp-del" data-delblk>🗑 Удалить блок</button>' : ''}</div>
      <div class="pp-tabs" role="tablist">${[['text', 'Текст'], ['colors', 'Цвета'], ['code', 'Код']].map(([k, n]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${c.tab === k}">${n}</button>`).join('')}</div>
      <div class="pp-body"></div>
      <footer>${Object.keys(c.colorMap).length ? `<label class="pp-all"><input type="checkbox" id="pp-allc" checked> цвета — сразу на всех языках</label>` : ''}
        <button type="button" class="pp-btn pp-save" data-save ${c.work === c.saved ? 'disabled' : ''}>Сохранить</button><span class="pp-msg" role="status"></span></footer>`;
    panel.querySelector('[data-close]').onclick = () => close();
    panel.querySelectorAll('[data-tab]').forEach(t => t.onclick = () => { c.tab = t.dataset.tab; draw(); });
    panel.querySelector('[data-hide]').onclick = async () => {
      try { await api('admin/blocks', { id: c.id, lang: '*', hidden: !hid, page: basePath }); } catch (e) { alert('Не получилось: ' + e.message); return; }
      c.b.toggleAttribute('data-ppb-hidden', !hid); c.b.hidden = false;
      await load(); draw();
    };
    const rv = panel.querySelector('[data-revert]');
    rv && (rv.onclick = async () => {
      if (!confirm('Убрать все правки этого блока на ' + lang.toUpperCase() + ' и вернуть оригинал из кода сайта?')) return;
      const others = Object.keys(PRE).filter(l => l !== lang && override(c.id, l));
      const alsoOthers = others.length && confirm(`Этот блок изменён и на других языках (${others.map(x => x.toUpperCase()).join(', ')}) — например, цвета. Вернуть оригинал и там?`);
      try { for (const l of [lang, ...(alsoOthers ? others : [])]) await api('admin/blocks', { id: c.id, lang: l, html: null }); } catch (e) { alert('Не получилось: ' + e.message); return; }
      c.work = c.saved = c.orig; setInner(c.b, c.orig);
      await load(); draw();
    });
    panel.querySelector('[data-save]').onclick = save;
    panel.querySelectorAll('[data-mv]').forEach(x => x.onclick = () => move(c.b, +x.dataset.mv));
    const db = panel.querySelector('[data-delblk]'); if (db) db.onclick = () => removeBlock(c.b);
    const body = panel.querySelector('.pp-body');
    ({ text: drawText, colors: drawColors, code: drawCode })[c.tab](body);
  }
  const changed = () => { const s = panel.querySelector('[data-save]'); if (s) s.disabled = cur.work === cur.saved; preview(); };

  // Текст: каждый кусок текста — отдельное поле (жирный и ссылки внутри сохраняются), ниже ссылки и картинки
  function drawText(body) {
    const c = cur, t = tplOf(c.work);
    const skip = el => el.closest('script, style, svg, noscript, template');
    const cands = [...t.content.querySelectorAll('*')].filter(el => !skip(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    const texts = cands.filter(el => !cands.some(o => o !== el && o.contains(el)));
    const links = [...t.content.querySelectorAll('a[href]')].filter(a => !skip(a));
    const imgs = [...t.content.querySelectorAll('img[src]')].filter(i => !skip(i));
    body.innerHTML = `${texts.length ? `<p class="pp-note">Пишите прямо в полях — блок на странице меняется сразу.</p>${texts.map((el, i) => `<div class="pp-f"><span>${el.tagName.toLowerCase()}</span><div class="pp-ce" contenteditable="true" data-t="${i}">${el.innerHTML}</div></div>`).join('')}` : '<p class="pp-note">В этом блоке нет текста — смотрите вкладки «Цвета» и «Код».</p>'}
      ${links.length ? `<h4>Ссылки</h4>${links.map((a, i) => `<label class="pp-f"><span>${esc(a.textContent.trim().slice(0, 40) || 'ссылка')}</span><input type="text" data-l="${i}" value="${esc(a.getAttribute('href'))}"></label>`).join('')}` : ''}
      ${imgs.length ? `<h4>Картинки</h4>${imgs.map((im, i) => `<div class="pp-f pp-img"><img src="${esc(im.getAttribute('src'))}" alt="">
        <div class="pp-img-btns"><label class="pp-btn">⬆ Заменить файлом<input type="file" accept="image/*" data-up="${i}" hidden></label><button type="button" class="pp-btn" data-dup="${i}">＋ Добавить ещё картинку рядом</button><button type="button" class="pp-btn" data-rmimg="${i}">✕ Убрать</button></div>
        <label>адрес <input type="text" data-i="${i}" value="${esc(im.getAttribute('src'))}"></label><label>описание <input type="text" data-a="${i}" value="${esc(im.getAttribute('alt') || '')}"></label></div>`).join('')}` : ''}`;
    const sync = () => { c.work = t.innerHTML; changed(); };
    body.querySelectorAll('[data-t]').forEach(f => f.oninput = () => { texts[+f.dataset.t].innerHTML = f.innerHTML; sync(); });
    body.querySelectorAll('[data-l]').forEach(f => f.oninput = () => { links[+f.dataset.l].setAttribute('href', f.value.trim()); sync(); });
    body.querySelectorAll('[data-i]').forEach(f => f.oninput = () => { imgs[+f.dataset.i].setAttribute('src', f.value.trim()); f.closest('.pp-img').querySelector('img').src = f.value.trim(); sync(); });
    body.querySelectorAll('[data-a]').forEach(f => f.oninput = () => { imgs[+f.dataset.a].setAttribute('alt', f.value); sync(); });
    // картинка: целиком (с подписью и ссылкой на крупную) — ближайший figure / ссылка / пункт списка
    const unit = im => im.closest('figure, li, .wall-item') || im.closest('a') || im;
    const setImg = (im, url) => { im.setAttribute('src', url); im.removeAttribute('srcset'); const a = im.closest('a[data-lightbox], a[href$=".jpg"], a[href$=".png"], a[href$=".webp"]'); if (a) a.setAttribute('href', url); };
    body.querySelectorAll('[data-up]').forEach(inp => inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      const lbl = inp.closest('label'); lbl.firstChild.textContent = 'Загружаю…';
      try { setImg(imgs[+inp.dataset.up], await upload(f)); sync(); drawText(body); } catch (e) { alert('Не получилось загрузить: ' + e.message); lbl.firstChild.textContent = '⬆ Заменить файлом'; }
    });
    body.querySelectorAll('[data-dup]').forEach(x => x.onclick = () => {
      const u = unit(imgs[+x.dataset.dup]), copy = u.cloneNode(true); u.after(copy);
      const pick = document.createElement('input'); pick.type = 'file'; pick.accept = 'image/*';
      pick.onchange = async () => { const f = pick.files[0]; if (f) { try { setImg(copy.matches('img') ? copy : copy.querySelector('img'), await upload(f)); } catch (e) { alert('Не получилось загрузить: ' + e.message); } } sync(); drawText(body); };
      sync(); drawText(body); pick.click();
    });
    body.querySelectorAll('[data-rmimg]').forEach(x => x.onclick = () => { if (!confirm('Убрать эту картинку из блока?')) return; unit(imgs[+x.dataset.rmimg]).remove(); sync(); drawText(body); });
  }

  // Цвета: все цвета блока (#rrggbb в стилях и картинках); меняется цвет — меняется везде в блоке
  const full = h => (h.length === 4 ? '#' + [...h.slice(1)].map(x => x + x).join('') : h).toLowerCase();
  const colorRe = h => new RegExp(h + '(?![0-9a-fA-F])', 'gi');
  function drawColors(body) {
    const c = cur, counts = {};
    for (const m of c.work.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g) || []) { const k = full(m); counts[k] = (counts[k] || 0) + 1; }
    const list = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    body.innerHTML = list.length ? `<p class="pp-note">Нажмите на кружок и выберите новый цвет — он поменяется во всём блоке.</p><div class="pp-colors">${list.map(([h, n]) => `<label class="pp-color"><input type="color" value="${h}" data-c="${h}"><code>${h}</code><small>×${n}</small></label>`).join('')}</div>`
      : '<p class="pp-note">В коде этого блока нет своих цветов (он берёт цвета сайта).</p>';
    body.querySelectorAll('[data-c]').forEach(inp => inp.oninput = () => {
      const from = inp.dataset.c, to = inp.value.toLowerCase();
      if (from === to) return;
      // короткая запись (#fff) тоже считается этим цветом
      const short = /^#(.)\1(.)\2(.)\3$/.test(from) ? '#' + from[1] + from[3] + from[5] : null;
      c.work = c.work.replace(colorRe(from), to); if (short) c.work = c.work.replace(colorRe(short), to);
      const origin = Object.keys(c.colorMap).find(k => c.colorMap[k] === from) || from;
      c.colorMap[origin] = to;
      inp.dataset.c = to; inp.nextElementSibling.textContent = to;
      changed();
      if (!panel.querySelector('#pp-allc')) { const ft = panel.querySelector('footer'); ft.insertAdjacentHTML('afterbegin', '<label class="pp-all"><input type="checkbox" id="pp-allc" checked> цвета — сразу на всех языках</label>'); }
    });
  }

  // Код: HTML блока целиком (стили внутри уже привязаны к блоку)
  function drawCode(body) {
    const c = cur;
    body.innerHTML = `<p class="pp-note">HTML и стили этого блока. Ошибка в коде может сломать вид блока — тогда «Вернуть как было».</p><textarea class="pp-code" spellcheck="false"></textarea>`;
    const ta = body.querySelector('textarea'); ta.value = c.work;
    ta.oninput = () => { c.work = ta.value; changed(); };
  }

  async function save() {
    const c = cur, msg = panel.querySelector('.pp-msg'), btn = panel.querySelector('[data-save]');
    btn.disabled = true; msg.textContent = 'Сохраняю…';
    try {
      await api('admin/blocks', { id: c.id, lang, html: c.work === c.orig && !c.id.startsWith('custom-') ? null : c.work, page: basePath }); // у нового блока правка — это и есть его содержимое
      const all = panel.querySelector('#pp-allc');
      if (all && all.checked && Object.keys(c.colorMap).length) {
        for (const l of Object.keys(PRE).filter(x => x !== lang)) {
          const o = await origOf(c.id, l); if (o == null) continue;
          const ov = override(c.id, l);
          let h = ov ? ov.html : o;
          for (const [from, to] of Object.entries(c.colorMap)) {
            h = h.replace(colorRe(from), to);
            if (/^#(.)\1(.)\2(.)\3$/.test(from)) h = h.replace(colorRe('#' + from[1] + from[3] + from[5]), to);
          }
          if (h !== (ov ? ov.html : o)) await api('admin/blocks', { id: c.id, lang: l, html: h === o ? null : h, page: basePath });
        }
      }
      c.saved = c.work; c.colorMap = {};
      await load();
      draw();
      panel.querySelector('.pp-msg').textContent = '✓ Сохранено — уже на сайте';
    } catch (e) { msg.textContent = '⚠ Не сохранилось: ' + e.message; btn.disabled = false; }
  }

  window.PPEdit = { toggle };
})();
