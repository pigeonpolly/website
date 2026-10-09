// Поиск по сайту: кнопка 🔍 в шапке (или клавиша «/»). Страницы — из индекса /assets/search-<lang>.json (собирается build.py),
// статьи блога — с сервера /api/blog/search.
(function () {
  const btn = document.querySelector('.search-btn');
  if (!btn) return;
  const lang = document.documentElement.lang || 'en', L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const T = {
    ph: ['Search the site…', 'Поиск по сайту…', 'Meklēt vietnē…'], pages: ['Pages', 'Страницы', 'Lapas'], posts: ['Blog posts', 'Статьи блога', 'Bloga raksti'],
    none: ['Nothing found. Try another word.', 'Ничего не нашлось. Попробуйте другое слово.', 'Nekas netika atrasts. Pamēģini citu vārdu.'],
    hint: ['Type at least 2 letters', 'Введите хотя бы 2 буквы', 'Ievadi vismaz 2 burtus'], close: ['Close', 'Закрыть', 'Aizvērt'],
  };
  const t = k => T[k][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let index = null, dlg, input, out, timer, seq = 0;
  function build() {
    dlg = document.createElement('dialog'); dlg.className = 'search-dlg'; dlg.setAttribute('aria-label', t('ph'));
    dlg.innerHTML = `<form method="dialog" class="search-box"><span aria-hidden="true">🔍</span><input type="search" autocomplete="off" placeholder="${t('ph')}" aria-label="${t('ph')}"><button type="submit" class="search-x" aria-label="${t('close')}">✕</button></form><div class="search-out" role="status" aria-live="polite"><p class="search-hint">${t('hint')}</p></div>`;
    document.body.appendChild(dlg);
    input = dlg.querySelector('input'); out = dlg.querySelector('.search-out');
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 180); });
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }
  async function open() {
    if (!dlg) build();
    dlg.showModal(); input.focus(); input.select();
    if (!index) try { index = await (await fetch(`/assets/search-${lang}.json`)).json(); } catch (e) { index = []; }
    if (input.value) run();
  }
  // кусочек текста вокруг найденного слова, слово подсвечено
  function snippet(text, words) {
    const low = text.toLowerCase(); let i = -1;
    for (const w of words) { i = low.indexOf(w); if (i >= 0) break; }
    let s = i < 0 ? text.slice(0, 140) : (i > 50 ? '…' : '') + text.slice(Math.max(0, i - 50), i + 110) + '…';
    s = esc(s);
    for (const w of words) s = s.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    return s;
  }
  async function run() {
    const q = input.value.trim().toLowerCase(), my = ++seq;
    if (q.length < 2) { out.innerHTML = `<p class="search-hint">${t('hint')}</p>`; return; }
    const words = q.split(/\s+/).filter(Boolean);
    const pages = (index || []).map(p => {
      const hay = (p.t + ' ' + p.d + ' ' + p.x).toLowerCase();
      if (!words.every(w => hay.includes(w))) return null;
      return { ...p, s: words.every(w => p.t.toLowerCase().includes(w)) ? 3 : words.every(w => (p.t + ' ' + p.d).toLowerCase().includes(w)) ? 2 : 1 };
    }).filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 8);
    render(pages, null, words);
    let posts = [];
    try { posts = (await (await fetch(`/api/blog/search?lang=${lang}&q=${encodeURIComponent(q)}`)).json()).posts || []; } catch (e) { /* без статей */ }
    if (my === seq) render(pages, posts, words);
  }
  function render(pages, posts, words) {
    const block = (title, list, fn) => list && list.length ? `<h3>${title}</h3><ul>${list.map(fn).join('')}</ul>` : '';
    const html = block(t('posts'), posts, p => `<li><a href="${esc(p.u)}">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : '<span class="search-ic">📝</span>'}<span><b>${esc(p.t)}</b><small>${snippet(p.d || '', words)}</small></span></a></li>`)
      + block(t('pages'), pages, p => `<li><a href="${esc(p.u)}"><span class="search-ic">📄</span><span><b>${esc(p.t)}</b><small>${snippet(p.d + ' ' + p.x, words)}</small></span></a></li>`);
    out.innerHTML = html || (posts === null ? '<p class="search-hint">…</p>' : `<p class="search-hint">${t('none')}</p>`);
  }
  btn.addEventListener('click', open);
  addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); open(); }
  });
})();
