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
      <button type="button" class="pp-btn" data-exit>Выйти из режима</button>`;
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
        ${edited ? '<button type="button" class="pp-btn" data-revert>↺ Вернуть как было</button>' : ''}</div>
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
      ${imgs.length ? `<h4>Картинки</h4>${imgs.map((im, i) => `<div class="pp-f pp-img"><img src="${esc(im.getAttribute('src'))}" alt=""><label>адрес <input type="text" data-i="${i}" value="${esc(im.getAttribute('src'))}"></label><label>описание <input type="text" data-a="${i}" value="${esc(im.getAttribute('alt') || '')}"></label></div>`).join('')}` : ''}`;
    const sync = () => { c.work = t.innerHTML; changed(); };
    body.querySelectorAll('[data-t]').forEach(f => f.oninput = () => { texts[+f.dataset.t].innerHTML = f.innerHTML; sync(); });
    body.querySelectorAll('[data-l]').forEach(f => f.oninput = () => { links[+f.dataset.l].setAttribute('href', f.value.trim()); sync(); });
    body.querySelectorAll('[data-i]').forEach(f => f.oninput = () => { imgs[+f.dataset.i].setAttribute('src', f.value.trim()); f.closest('.pp-img').querySelector('img').src = f.value.trim(); sync(); });
    body.querySelectorAll('[data-a]').forEach(f => f.oninput = () => { imgs[+f.dataset.a].setAttribute('alt', f.value); sync(); });
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
      await api('admin/blocks', { id: c.id, lang, html: c.work === c.orig ? null : c.work, page: basePath });
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
