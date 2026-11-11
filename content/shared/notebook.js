// 📒 Блокнот в учебниках (docs/site.md «Блокнот в учебниках»): выезжает справа (кнопка-язычок у правого края или Alt+N),
// страницы без конца, поиск, закладки (⭐ страница и 🔖 метка в тексте), форматирование, автосохранение.
// Встраивают tools/study_page.py, english_page.py, norsk_page.py: перед ним window.PPNB_BOOK = 'study' | 'english' | 'norsk'.
// Данные — /api/notebook?book= (worker/notebook.js, своя таблица textbook_notes). С прогрессом учебника НЕ связан:
// ни S, ни /api/<учебник>, ни его localStorage не трогаем. Копия в браузере — localStorage 'ppnb:<book>' (не потеряется без связи).
(() => {
  const BOOK = window.PPNB_BOOK; if (!BOOK || window.__ppnb) return; window.__ppnb = 1;
  const API = '/api/notebook?book=' + encodeURIComponent(BOOK), LS = 'ppnb:' + BOOK, MAX_HTML = 600000;
  let lastT = 0; const now = () => (lastT = Math.max(Date.now(), lastT + 1));
  const rid = () => (Math.random().toString(36).slice(2, 8) + Date.now().toString(36)).replace(/[^a-z0-9]/g, '').slice(0, 20);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- очистка HTML: только простое форматирование ----------
  const KEEP = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'H2', 'H3', 'P', 'DIV', 'BR', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'MARK', 'SPAN', 'A', 'CODE', 'PRE', 'HR', 'SUB', 'SUP']);
  const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'SVG', 'MATH', 'NOSCRIPT', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'IMG', 'VIDEO', 'AUDIO', 'CANVAS', 'LINK', 'META', 'HEAD', 'TITLE']);
  const RENAME = { H1: 'H2', H4: 'H3', H5: 'H3', H6: 'H3', TABLE: 'DIV', TR: 'DIV', TD: 'SPAN', TH: 'SPAN' };
  function scrub(node) {
    for (const ch of [...node.childNodes]) {
      if (ch.nodeType === 3) continue;
      if (ch.nodeType !== 1) { ch.remove(); continue; }
      let el = ch, tag = el.tagName;
      if (DROP.has(tag)) { el.remove(); continue; }
      if (RENAME[tag]) { const n = document.createElement(RENAME[tag]); while (el.firstChild) n.appendChild(el.firstChild); el.replaceWith(n); el = n; tag = n.tagName; }
      scrub(el);
      const bmId = tag === 'SPAN' && el.classList.contains('nb-bm') ? el.getAttribute('data-bm') || '' : '', bm = /^[a-z0-9]{4,24}$/.test(bmId);
      if (!KEEP.has(tag) || (tag === 'SPAN' && !bm)) { el.replaceWith(...el.childNodes); continue; }
      const href = tag === 'A' ? el.getAttribute('href') || '' : '';
      for (const a of [...el.attributes]) el.removeAttribute(a.name);
      if (bm) { el.className = 'nb-bm'; el.setAttribute('data-bm', bmId); el.setAttribute('contenteditable', 'false'); }
      if (tag === 'A') { if (/^(https?:\/\/|#)/i.test(href)) el.setAttribute('href', href); else el.replaceWith(...el.childNodes); }
    }
  }
  function clean(html) {
    const doc = new DOMParser().parseFromString('<!doctype html><body>' + String(html || ''), 'text/html');
    scrub(doc.body); return doc.body.innerHTML;
  }
  const textOf = (() => { const c = new Map(); return p => { const k = p.id + ':' + p.t; if (!c.has(k)) { const d = new DOMParser().parseFromString('<body>' + p.html, 'text/html'); d.querySelectorAll('p,div,li,h2,h3,blockquote,br,pre').forEach(e => e.append(' ')); c.set(k, d.body.textContent.replace(/\s+/g, ' ').trim()); } return c.get(k); }; })();

  // ---------- данные ----------
  // D.pages: {id: {id, title, html, t, c, mark, at}}; cleared — когда очистили весь блокнот; del — {id: когда удалили}
  let D = { uid: '', pages: {}, cleared: 0, del: {}, cur: '' }, dirty = new Set(), metaDirty = false, loaded = false, online = false;
  const list = () => Object.values(D.pages).sort((a, b) => a.c - b.c);
  const dead = p => p.t <= D.cleared || p.t <= (+D.del[p.id] || 0);
  function saveLocal() {
    try { localStorage.setItem(LS, JSON.stringify({ uid: D.uid, pages: list(), cleared: D.cleared, del: D.del, cur: D.cur, dirty: [...dirty], meta: metaDirty })); return true; }
    catch (e) { return false; }
  }
  function readLocal() { try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { return null; } }
  function mergeIn(src, markDirty) { // src: {pages: [], cleared, del}; новее по t — побеждает
    D.cleared = Math.max(D.cleared, +src.cleared || 0);
    for (const [id, t] of Object.entries(src.del || {})) D.del[id] = Math.max(+D.del[id] || 0, +t || 0);
    for (const raw of src.pages || []) {
      if (!raw || !raw.id) continue;
      const p = { id: String(raw.id), title: String(raw.title || ''), html: clean(raw.html), t: +raw.t || 1, c: +raw.c || +raw.t || 1, mark: !!raw.mark, at: String(raw.at || '') };
      const old = D.pages[p.id];
      if (!old || p.t > old.t) { D.pages[p.id] = p; if (markDirty) dirty.add(p.id); }
    }
    for (const p of Object.values(D.pages)) if (dead(p)) { delete D.pages[p.id]; dirty.delete(p.id); }
  }
  function newPage(title) {
    const t = now(), p = { id: rid(), title: title || '', html: '', t, c: t, mark: false, at: location.hash || '' };
    D.pages[p.id] = p; dirty.add(p.id); D.cur = p.id; return p;
  }
  const cur = () => D.pages[D.cur] || list()[list().length - 1] || newPage();

  // ---------- отправка на сервер ----------
  let syncT = 0, busy = false, again = false;
  const body = () => JSON.stringify({ pages: [...dirty].map(id => D.pages[id]).filter(Boolean), cleared: D.cleared, del: D.del });
  function later(ms = 1800) { clearTimeout(syncT); syncT = setTimeout(sync, ms); }
  async function sync() {
    if (!loaded) return;
    if (busy) { again = true; return; }
    if (!dirty.size && !metaDirty) { status(); return; }
    busy = true; status('saving');
    const sent = new Map([...dirty].map(id => [id, D.pages[id] && D.pages[id].t])), wasMeta = metaDirty;
    try {
      const r = await fetch(API, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: body() });
      if (!r.ok) throw new Error(r.status);
      for (const [id, t] of sent) if (!D.pages[id] || D.pages[id].t === t) dirty.delete(id); // за время отправки не меняли — отправлено
      if (wasMeta) metaDirty = false;
      online = true; saveLocal(); status();
    } catch (e) { online = false; status('offline'); later(15000); }
    busy = false; if (again) { again = false; later(300); }
  }
  function flushBeacon() {
    flushEditor();
    saveLocal();
    if (!loaded || (!dirty.size && !metaDirty)) return;
    const b = body();
    if (b.length < 60000 && navigator.sendBeacon) navigator.sendBeacon(API, new Blob([b], { type: 'text/plain' })); // > 64 КБ beacon не берёт — уйдёт в следующий раз из localStorage
  }
  addEventListener('pagehide', flushBeacon);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushBeacon(); });

  // ---------- оформление ----------
  const css = `
#ppnb-tab{position:fixed;z-index:84;right:0;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;border:1px solid var(--rule,#ddd);border-right:0;border-radius:10px 0 0 10px;background:var(--card,var(--paper,#fff));color:var(--ink,#222);font:600 13px/1 var(--f-ui,system-ui,sans-serif);padding:12px 7px;cursor:pointer;box-shadow:-2px 2px 10px rgb(0 0 0/.08);letter-spacing:.04em}
#ppnb-tab:hover{color:var(--accent,#534ab7)}
#ppnb-tab .i{writing-mode:horizontal-tb;display:block;margin-bottom:6px;font-size:16px}
body.ppnb-open #ppnb-tab{opacity:0;pointer-events:none}
#ppnb{position:fixed;z-index:85;top:0;right:0;bottom:0;width:min(540px,100vw);display:flex;flex-direction:column;background:var(--card,var(--paper,#fff));color:var(--ink,#222);border-left:1px solid var(--rule,#ddd);box-shadow:-10px 0 30px rgb(0 0 0/.14);transform:translateX(104%);transition:transform .25s ease;font:15px/1.5 var(--f-ui,system-ui,sans-serif);padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
#ppnb.open{transform:none}
#ppnb[hidden]{display:flex}
#ppnb *{box-sizing:border-box}
#ppnb button{font:inherit;color:inherit;cursor:pointer}
#ppnb .hd{display:flex;align-items:center;gap:8px;padding:10px 12px 8px;border-bottom:1px solid var(--rule,#ddd)}
#ppnb .hd b{font-size:16px}
#ppnb .st{font-size:12px;color:var(--muted,#666);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#ppnb .st.warn{color:var(--warm,#c4521f)}
#ppnb .x{border:0;background:none;font-size:22px;line-height:1;padding:2px 6px;border-radius:8px}
#ppnb .x:hover,#ppnb .ib:hover{background:var(--accent-soft,#eee)}
#ppnb .row{display:flex;align-items:center;gap:6px;padding:8px 12px;flex-wrap:wrap}
#ppnb .q{flex:1;min-width:0;border:1px solid var(--rule,#ddd);border-radius:10px;padding:7px 10px;background:var(--paper,#fff);color:inherit;font:inherit}
#ppnb .q:focus,#ppnb .ttl:focus{outline:2px solid var(--accent,#534ab7);outline-offset:-1px}
#ppnb .ib{border:1px solid var(--rule,#ddd);background:var(--paper,#fff);border-radius:9px;padding:5px 9px;font-size:13px;white-space:nowrap}
#ppnb .ib[aria-pressed=true]{background:var(--accent,#534ab7);color:var(--on-accent,#fff);border-color:var(--accent,#534ab7)}
#ppnb .pg{font-size:13px;color:var(--muted,#666);min-width:5.5em;text-align:center}
#ppnb .ttlrow{display:flex;gap:6px;padding:0 12px 6px;align-items:center}
#ppnb .ttl{flex:1;min-width:0;border:0;border-bottom:1px dashed var(--rule,#ddd);background:none;color:inherit;font:600 18px/1.3 var(--f-body,Georgia,serif);padding:4px 2px}
#ppnb .star{border:0;background:none;font-size:20px;padding:2px 4px;filter:grayscale(1);opacity:.5}
#ppnb .star[aria-pressed=true]{filter:none;opacity:1}
#ppnb .tb{display:flex;gap:3px;flex-wrap:wrap;padding:6px 12px;border-top:1px solid var(--rule,#ddd);border-bottom:1px solid var(--rule,#ddd);background:var(--paper-2,#f6f6f6)}
#ppnb .tb button{border:1px solid transparent;background:none;border-radius:7px;min-width:32px;height:32px;padding:0 7px;font-size:14px}
#ppnb .tb button:hover{border-color:var(--rule,#ddd);background:var(--card,#fff)}
#ppnb .tb button.on{background:var(--accent-soft,#eee);border-color:var(--accent,#534ab7)}
#ppnb .tb .sep{width:1px;background:var(--rule,#ddd);margin:4px 3px}
#ppnb .body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain}
#ppnb .ed{min-height:100%;padding:14px 16px 40vh;outline:none;font:17px/1.6 var(--f-body,Georgia,serif);word-wrap:break-word}
#ppnb .ed:empty::before{content:attr(data-ph);color:var(--muted,#888);font-style:italic}
#ppnb .ed[contenteditable=false]{opacity:.5}
#ppnb .ed h2{font-size:1.3em;margin:.8em 0 .3em}#ppnb .ed h3{font-size:1.12em;margin:.7em 0 .25em}
#ppnb .ed p,#ppnb .ed div{margin:0 0 .45em}
#ppnb .ed blockquote{margin:.4em 0;padding:.2em .8em;border-left:3px solid var(--accent,#534ab7);background:var(--accent-soft,#f3f3f3);border-radius:0 8px 8px 0}
#ppnb .ed mark{background:var(--mark,#fff1a8);color:inherit;padding:0 .1em;border-radius:3px}
#ppnb .ed a{color:var(--accent,#534ab7)}
#ppnb .ed ul,#ppnb .ed ol{margin:.2em 0 .5em;padding-left:1.4em}
#ppnb .ed code{font-family:ui-monospace,Menlo,monospace;font-size:.9em;background:var(--paper-2,#f3f3f3);padding:0 .25em;border-radius:4px}
#ppnb .nb-bm{display:inline-block;font:600 12px/1.6 var(--f-ui,system-ui,sans-serif);background:var(--warm-soft,#fdf0e8);color:var(--warm,#c4521f);border-radius:999px;padding:0 8px;margin:0 2px;user-select:all;cursor:default}
#ppnb .flash{animation:ppnbf 1.6s ease}
@keyframes ppnbf{0%,40%{box-shadow:0 0 0 4px var(--mark,#fff1a8);background:var(--mark,#fff1a8)}100%{box-shadow:none}}
#ppnb .ls{padding:6px 12px 30px}
#ppnb .ls h4{margin:12px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#666)}
#ppnb .it{display:block;width:100%;text-align:left;border:1px solid var(--rule,#ddd);background:var(--paper,#fff);border-radius:10px;padding:8px 10px;margin:0 0 6px}
#ppnb .it:hover{border-color:var(--accent,#534ab7)}
#ppnb .it.cur{border-color:var(--accent,#534ab7);background:var(--accent-soft,#eee)}
#ppnb .it small{display:block;color:var(--muted,#666);font-size:12.5px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#ppnb .it em{font-style:normal;background:var(--mark,#fff1a8);border-radius:3px}
#ppnb .empty{color:var(--muted,#666);padding:16px 4px;text-align:center}
#ppnb .ft{display:flex;gap:6px;flex-wrap:wrap;align-items:center;padding:8px 12px;border-top:1px solid var(--rule,#ddd);font-size:12px;color:var(--muted,#666)}
#ppnb .ft .sp{flex:1}
#ppnb .ft a{color:var(--accent,#534ab7)}
#ppnb .ib.danger{color:var(--warm,#c4521f)}
@media (max-width:600px){#ppnb{width:100vw;border-left:0}#ppnb .ed{font-size:16px;padding:12px 12px 40vh}#ppnb-tab{padding:10px 5px;font-size:12px}}
@media print{#ppnb,#ppnb-tab{display:none!important}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const tab = document.createElement('button');
  tab.id = 'ppnb-tab'; tab.type = 'button'; tab.title = 'Блокнот (Alt+N)'; tab.setAttribute('aria-label', 'Открыть блокнот');
  tab.innerHTML = '<span class="i">📒</span>Блокнот';
  const root = document.createElement('aside');
  root.id = 'ppnb'; root.setAttribute('aria-label', 'Блокнот'); root.setAttribute('aria-hidden', 'true'); root.inert = true;
  root.innerHTML = `
<div class="hd"><b>📒 Блокнот</b><span class="st" aria-live="polite">загружаю…</span><button type="button" class="x" data-a="close" title="Закрыть (Esc)" aria-label="Закрыть">×</button></div>
<div class="row"><input class="q" type="search" placeholder="🔍 Поиск по всему блокноту" aria-label="Поиск по блокноту"></div>
<div class="row">
  <button type="button" class="ib" data-a="prev" title="Предыдущая страница" aria-label="Предыдущая страница">◀</button><span class="pg"></span><button type="button" class="ib" data-a="next" title="Следующая страница" aria-label="Следующая страница">▶</button>
  <button type="button" class="ib" data-a="new" title="Новая страница">＋ Страница</button>
  <button type="button" class="ib" data-a="pages" aria-pressed="false">☰ Все</button>
  <button type="button" class="ib" data-a="marks" aria-pressed="false">🔖 Закладки</button>
</div>
<div class="ttlrow"><input class="ttl" maxlength="200" placeholder="Название страницы" aria-label="Название страницы"><button type="button" class="star" data-a="star" aria-pressed="false" title="Страница в закладках">⭐</button></div>
<div class="tb" role="toolbar" aria-label="Форматирование">
  <button type="button" data-f="bold" title="Жирный (Ctrl+B)"><b>Ж</b></button>
  <button type="button" data-f="italic" title="Курсив (Ctrl+I)"><i>К</i></button>
  <button type="button" data-f="underline" title="Подчёркнутый (Ctrl+U)"><u>Ч</u></button>
  <button type="button" data-f="strikeThrough" title="Зачёркнутый"><s>З</s></button>
  <button type="button" data-f="mark" title="Выделить маркером">🖍</button>
  <span class="sep"></span>
  <button type="button" data-f="h2" title="Большой заголовок">H1</button>
  <button type="button" data-f="h3" title="Подзаголовок">H2</button>
  <button type="button" data-f="insertUnorderedList" title="Список">•</button>
  <button type="button" data-f="insertOrderedList" title="Нумерованный список">1.</button>
  <button type="button" data-f="blockquote" title="Цитата">❝</button>
  <span class="sep"></span>
  <button type="button" data-f="bm" title="Поставить закладку здесь">🔖＋</button>
  <button type="button" data-f="quote" title="Вставить выделенное в учебнике (со ссылкой на место)">📎</button>
  <button type="button" data-f="removeFormat" title="Убрать оформление">⌫</button>
</div>
<div class="body"><div class="ed" contenteditable="false" spellcheck="true" data-ph="Пишите здесь… Страница бесконечная, всё сохраняется само."></div><div class="ls" hidden></div></div>
<div class="ft"><span class="info"></span><span class="sp"></span>
  <button type="button" class="ib" data-a="clearPage" title="Стереть текст этой страницы">🧹 Очистить страницу</button>
  <button type="button" class="ib" data-a="delPage" title="Удалить эту страницу">🗑</button>
  <button type="button" class="ib danger" data-a="clearAll" title="Удалить все страницы блокнота">Очистить весь блокнот</button>
</div>`;
  document.body.append(tab, root);
  const $ = s => root.querySelector(s);
  const ed = $('.ed'), ls = $('.ls'), q = $('.q'), ttl = $('.ttl'), stEl = $('.st');
  try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) { /* старый браузер */ }

  // события блокнота не уходят в учебник (его горячие клавиши, перевод по выделению, подсказки)
  for (const ev of ['click', 'keydown', 'keyup', 'keypress', 'input', 'mouseup', 'mousedown', 'touchend', 'touchstart', 'change', 'submit', 'paste', 'copy', 'cut', 'focusin', 'selectstart'])
    root.addEventListener(ev, e => e.stopPropagation());

  function status(kind) {
    stEl.classList.toggle('warn', kind === 'offline' || kind === 'big');
    stEl.textContent = !loaded ? 'загружаю…'
      : kind === 'saving' ? 'сохраняю…'
      : kind === 'big' ? 'страница слишком большая — начните новую'
      : kind === 'offline' || !online ? 'сохранено в браузере, отправлю, когда будет связь'
      : (dirty.size || metaDirty) ? 'сохраняю…' : 'всё сохранено ✓';
  }

  // ---------- открыть / закрыть ----------
  let lastSel = { text: '', at: '' };
  document.addEventListener('selectionchange', () => { // что выделено в учебнике — для 📎
    const s = getSelection(); if (!s || s.isCollapsed || !s.anchorNode || root.contains(s.anchorNode)) return;
    const t = s.toString().trim(); if (t) lastSel = { text: t.slice(0, 3000), at: location.hash || '' };
  });
  const isOpen = () => root.classList.contains('open');
  function open() {
    if (isOpen()) return;
    root.classList.add('open'); root.inert = false; root.setAttribute('aria-hidden', 'false'); document.body.classList.add('ppnb-open');
    if (loaded) { if (mode === 'edit') { render(); setTimeout(() => ed.focus({ preventScroll: true }), 260); } }
  }
  function close() {
    flushEditor(); saveLocal(); later(200);
    root.classList.remove('open'); root.inert = true; root.setAttribute('aria-hidden', 'true'); document.body.classList.remove('ppnb-open'); tab.focus({ preventScroll: true });
  }
  tab.addEventListener('click', e => { e.stopPropagation(); open(); });
  addEventListener('keydown', e => { // Alt+N — из любого места страницы
    if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyN') { e.preventDefault(); e.stopPropagation(); isOpen() ? close() : open(); }
  }, true);
  root.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); if (mode !== 'edit') show('edit'); else close(); } });

  // ---------- редактор ----------
  let edTimer = 0, edFor = '';
  function flushEditor() { // текст из редактора — в страницу
    clearTimeout(edTimer);
    const p = D.pages[edFor]; if (!p || !loaded) return;
    const html = ed.innerHTML === '<br>' || ed.innerHTML === '<p><br></p>' ? '' : ed.innerHTML, title = ttl.value.trim();
    if (html === p.html && title === p.title) return;
    if (html.length > MAX_HTML) { status('big'); return; }
    p.html = html; p.title = title; p.t = now(); dirty.add(p.id);
  }
  function changed() {
    clearTimeout(edTimer);
    edTimer = setTimeout(() => { flushEditor(); if (!saveLocal()) stEl.textContent = 'в браузере не хватает места — сохраняю только на сервер'; later(); status(dirty.size ? 'saving' : ''); }, 500);
  }
  ed.addEventListener('input', changed);
  ttl.addEventListener('input', changed);
  ttl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ed.focus(); } });
  ed.addEventListener('paste', e => {
    const cd = e.clipboardData; if (!cd) return;
    e.preventDefault();
    const html = cd.getData('text/html');
    if (html) document.execCommand('insertHTML', false, clean(html));
    else document.execCommand('insertText', false, cd.getData('text/plain'));
  });
  ed.addEventListener('drop', e => {
    const t = e.dataTransfer && e.dataTransfer.getData('text/plain'); e.preventDefault();
    if (t) { const r = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null; if (r) { const s = getSelection(); s.removeAllRanges(); s.addRange(r); } document.execCommand('insertText', false, t); }
  });
  ed.addEventListener('click', e => { // ссылка «↩ в учебник» — переход к месту
    const a = e.target.closest('a[href]'); if (!a) return;
    e.preventDefault(); const h = a.getAttribute('href');
    if (h.startsWith('#')) { location.hash = h; if (innerWidth < 900) close(); } else window.open(h, '_blank', 'noopener');
  });

  const inEd = () => { const s = getSelection(); return s && s.rangeCount && ed.contains(s.getRangeAt(0).commonAncestorContainer) ? s : null; };
  let saved = null; // выделение в редакторе — кнопки панели не должны его терять
  document.addEventListener('selectionchange', () => { const s = inEd(); if (s) { saved = s.getRangeAt(0).cloneRange(); tbState(); } });
  function restore() { ed.focus({ preventScroll: true }); if (saved && !inEd()) { const s = getSelection(); s.removeAllRanges(); s.addRange(saved); } return getSelection(); }
  const block = () => { try { return String(document.queryCommandValue('formatBlock') || '').toLowerCase().replace(/[<>]/g, ''); } catch (e) { return ''; } };
  function tbState() {
    for (const b of root.querySelectorAll('.tb [data-f]')) {
      const f = b.dataset.f; let on = false;
      try {
        if (['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'].includes(f)) on = document.queryCommandState(f);
        else if (f === 'h2' || f === 'h3' || f === 'blockquote') on = block() === f;
        else if (f === 'mark') { const s = inEd(); on = !!(s && s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement).closest('mark')); }
      } catch (e) { /* ничего */ }
      b.classList.toggle('on', !!on);
    }
  }
  function toggleMark() {
    const s = restore(); if (!s.rangeCount) return;
    const r = s.getRangeAt(0), host = n => (n.nodeType === 1 ? n : n.parentElement);
    const m = host(r.startContainer).closest('mark');
    if (m && ed.contains(m) && (r.collapsed || m.contains(r.endContainer))) { m.replaceWith(...m.childNodes); }
    else if (!r.collapsed) { const x = document.createElement('mark'); x.appendChild(r.extractContents()); x.querySelectorAll('mark').forEach(i => i.replaceWith(...i.childNodes)); r.insertNode(x); s.selectAllChildren(x); }
    changed();
  }
  function insertNode(node, after = ' ') {
    const s = restore(); if (!s.rangeCount) { ed.appendChild(node); return; }
    const r = s.getRangeAt(0); r.deleteContents(); r.insertNode(node);
    const t = document.createTextNode(after); node.after(t); r.setStartAfter(t); r.collapse(true); s.removeAllRanges(); s.addRange(r);
  }
  root.querySelector('.tb').addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); }); // фокус остаётся в тексте
  root.querySelector('.tb').addEventListener('click', e => {
    const b = e.target.closest('[data-f]'); if (!b || !loaded) return;
    const f = b.dataset.f;
    if (f === 'mark') toggleMark();
    else if (f === 'h2' || f === 'h3' || f === 'blockquote') { restore(); document.execCommand('formatBlock', false, block() === f ? '<p>' : '<' + f + '>'); }
    else if (f === 'removeFormat') { restore(); document.execCommand('removeFormat'); document.execCommand('formatBlock', false, '<p>'); const s = inEd(); if (s) { const m = (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement).closest('mark'); if (m) m.replaceWith(...m.childNodes); } }
    else if (f === 'bm') {
      const s = restore(), sel = s.rangeCount ? s.toString().trim() : '';
      const name = prompt('Название закладки', (sel || '').slice(0, 60) || ('Закладка ' + (allMarks().length + 1)));
      if (name == null) return;
      const sp = document.createElement('span'); sp.className = 'nb-bm'; sp.dataset.bm = rid(); sp.contentEditable = 'false'; sp.textContent = '🔖 ' + (name.trim() || 'Закладка').slice(0, 80);
      if (s.rangeCount && !s.isCollapsed) { const r = s.getRangeAt(0); r.collapse(true); s.removeAllRanges(); s.addRange(r); }
      insertNode(sp);
    }
    else if (f === 'quote') {
      if (!lastSel.text) { alert('Сначала выделите текст в учебнике, потом нажмите 📎 — он вставится цитатой со ссылкой на место.'); return; }
      const bq = document.createElement('blockquote'); bq.textContent = lastSel.text;
      if (lastSel.at) { const a = document.createElement('a'); a.href = lastSel.at; a.textContent = ' ↩ в учебник'; bq.append(a); }
      insertNode(bq, ''); const p = document.createElement('p'); p.innerHTML = '<br>'; bq.after(p);
      const s = getSelection(), r = document.createRange(); r.setStart(p, 0); r.collapse(true); s.removeAllRanges(); s.addRange(r);
    }
    else { restore(); document.execCommand(f); }
    changed(); tbState();
  });

  // ---------- виды: страница / все страницы / закладки / поиск ----------
  let mode = 'edit';
  function render() { // текущая страница в редактор
    const p = cur(), all = list(), i = all.indexOf(p);
    if (edFor !== p.id) { ed.innerHTML = p.html; edFor = p.id; ttl.value = p.title; $('.body').scrollTop = 0; }
    ed.contentEditable = loaded ? 'true' : 'false';
    $('.pg').textContent = `стр. ${i + 1} из ${all.length}`;
    $('[data-a=prev]').disabled = i <= 0; $('[data-a=next]').disabled = i >= all.length - 1;
    $('[data-a=star]').setAttribute('aria-pressed', String(p.mark));
    const d = new Date(p.c);
    $('.info').innerHTML = `создана ${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}` + (p.at ? ` · <a href="${esc(p.at)}" data-go="${esc(p.at)}">↩ где начата</a>` : '');
  }
  function go(id, then) {
    flushEditor(); if (D.pages[id]) D.cur = id; saveLocal();
    show('edit'); render();
    if (then) requestAnimationFrame(() => then());
  }
  const titleOf = p => p.title || textOf(p).slice(0, 50) || 'Без названия';
  function allMarks() {
    const out = [];
    for (const p of list()) {
      const html = p.id === edFor ? ed.innerHTML : p.html;
      if (!html.includes('nb-bm')) continue;
      const d = new DOMParser().parseFromString('<body>' + html, 'text/html');
      d.querySelectorAll('span.nb-bm[data-bm]').forEach(s => out.push({ p, id: s.dataset.bm, name: s.textContent.replace(/^🔖\s*/, '') }));
    }
    return out;
  }
  function flash(el) { if (!el) return; el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  function findText(word) { // первое совпадение на открытой странице — выделить и показать
    const w = word.toLowerCase(), it = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT);
    for (let n = it.nextNode(); n; n = it.nextNode()) {
      const k = n.data.toLowerCase().indexOf(w);
      if (k >= 0) { const r = document.createRange(); r.setStart(n, k); r.setEnd(n, k + word.length); const s = getSelection(); s.removeAllRanges(); s.addRange(r); flash(n.parentElement); return; }
    }
  }
  function show(m) {
    mode = m; ed.hidden = m !== 'edit'; ls.hidden = m === 'edit';
    for (const x of ['.ttlrow', '.tb']) $(x).hidden = m !== 'edit';
    $('[data-a=pages]').setAttribute('aria-pressed', String(m === 'pages'));
    $('[data-a=marks]').setAttribute('aria-pressed', String(m === 'marks'));
    if (m !== 'search' && q.value && m !== 'edit') q.value = '';
    if (m === 'edit') return;
    flushEditor();
    const item = (p, sub, attrs = '') => `<button type="button" class="it${p.id === D.cur ? ' cur' : ''}" data-p="${p.id}" ${attrs}>${p.mark ? '⭐ ' : ''}${esc(titleOf(p))}${sub ? `<small>${sub}</small>` : ''}</button>`;
    let h = '';
    if (m === 'pages') {
      const all = list();
      h = `<h4>Все страницы · ${all.length}</h4>` + all.map((p, i) => item(p, `${i + 1}. ${esc(textOf(p).slice(0, 120)) || '<i>пусто</i>'}`)).reverse().join('');
    } else if (m === 'marks') {
      const stars = list().filter(p => p.mark), bms = allMarks();
      h = `<h4>⭐ Страницы в закладках</h4>` + (stars.length ? stars.map(p => item(p, esc(textOf(p).slice(0, 100)))).join('') : '<p class="empty">Нажмите ⭐ рядом с названием страницы.</p>')
        + `<h4>🔖 Закладки в тексте</h4>` + (bms.length ? bms.map(b => `<button type="button" class="it" data-p="${b.p.id}" data-bm="${esc(b.id)}">🔖 ${esc(b.name)}<small>${esc(titleOf(b.p))}</small></button>`).join('') : '<p class="empty">Поставьте курсор в тексте и нажмите 🔖＋ на панели.</p>');
    } else if (m === 'search') {
      const w = q.value.trim(), lw = w.toLowerCase(), res = [];
      for (const p of list()) {
        const t = textOf(p), k = t.toLowerCase().indexOf(lw), kt = p.title.toLowerCase().indexOf(lw);
        if (k < 0 && kt < 0) continue;
        const from = Math.max(0, k - 50), snip = k < 0 ? esc(t.slice(0, 120)) : (from ? '…' : '') + esc(t.slice(from, k)) + '<em>' + esc(t.slice(k, k + w.length)) + '</em>' + esc(t.slice(k + w.length, k + w.length + 80));
        res.push(item(p, snip));
      }
      h = `<h4>Найдено страниц: ${res.length}</h4>` + (res.join('') || '<p class="empty">Ничего не нашлось.</p>');
    }
    ls.innerHTML = h;
  }
  ls.addEventListener('click', e => {
    const b = e.target.closest('[data-p]'); if (!b) return;
    const bm = b.dataset.bm, w = mode === 'search' ? q.value.trim() : '';
    if (mode === 'search') q.value = '';
    go(b.dataset.p, () => { if (bm) flash(ed.querySelector(`[data-bm="${CSS.escape(bm)}"]`)); else if (w) findText(w); });
  });
  let qT = 0;
  q.addEventListener('input', () => { clearTimeout(qT); qT = setTimeout(() => (q.value.trim() ? show('search') : show('edit')), 180); });
  q.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const f = ls.querySelector('[data-p]'); if (f) f.click(); } });

  root.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); location.hash = g.dataset.go; if (innerWidth < 900) close(); return; }
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'close') return close();
    if (!loaded) return;
    const all = list(), i = all.indexOf(cur());
    if (a === 'prev' && i > 0) go(all[i - 1].id);
    else if (a === 'next' && i < all.length - 1) go(all[i + 1].id);
    else if (a === 'new') { flushEditor(); newPage(); saveLocal(); later(); show('edit'); render(); ttl.focus(); }
    else if (a === 'pages' || a === 'marks') show(mode === a ? 'edit' : a);
    else if (a === 'star') { flushEditor(); const p = cur(); p.mark = !p.mark; p.t = now(); dirty.add(p.id); saveLocal(); later(); render(); }
    else if (a === 'clearPage') {
      if (!confirm('Очистить эту страницу? Текст на ней сотрётся (страница останется).')) return;
      ed.innerHTML = ''; flushEditor(); saveLocal(); later(300); render(); ed.focus();
    } else if (a === 'delPage') {
      if (!confirm(`Удалить страницу «${titleOf(cur())}» целиком?`)) return;
      const p = cur(), t = now(); D.del[p.id] = t; metaDirty = true; delete D.pages[p.id]; dirty.delete(p.id);
      const rest = list(); D.cur = rest.length ? rest[Math.min(i, rest.length - 1)].id : newPage().id; edFor = ''; saveLocal(); later(300); show('edit'); render();
    } else if (a === 'clearAll') {
      if (!confirm(`Очистить ВЕСЬ блокнот? Удалятся все страницы (${all.length}) и закладки. Прогресс учебника не пострадает.`)) return;
      if (!confirm('Точно? Вернуть записи будет нельзя.')) return;
      D.cleared = now(); metaDirty = true; D.pages = {}; dirty.clear(); D.del = {}; newPage(); edFor = ''; saveLocal(); later(300); show('edit'); render();
    }
    status(dirty.size || metaDirty ? 'saving' : '');
  });

  // ---------- загрузка ----------
  (async () => {
    const L = readLocal();
    let srv = null;
    try { const r = await fetch(API, { credentials: 'same-origin', cache: 'no-store' }); if (r.ok) srv = await r.json(); } catch (e) { /* нет связи */ }
    if (srv) {
      D.uid = String(srv.uid || '');
      mergeIn({ pages: srv.pages, cleared: srv.meta && srv.meta.cleared, del: srv.meta && srv.meta.del }, false);
      if (L && (!L.uid || L.uid === D.uid)) { // своя копия из браузера: всё, что новее сервера, — отправить
        mergeIn(L, true);
        for (const id of L.dirty || []) if (D.pages[id]) dirty.add(id);
        if (L.meta || (+L.cleared || 0) > ((srv.meta && srv.meta.cleared) || 0)) metaDirty = true;
        if (L.cur && D.pages[L.cur]) D.cur = L.cur;
      }
      online = true;
    } else if (L) { D.uid = L.uid || ''; mergeIn(L, false); for (const id of L.dirty || []) if (D.pages[id]) dirty.add(id); metaDirty = !!L.meta; if (L.cur && D.pages[L.cur]) D.cur = L.cur; }
    if (!list().length) newPage();
    if (!D.pages[D.cur]) D.cur = list()[list().length - 1].id;
    loaded = true; saveLocal(); render(); status(srv ? '' : 'offline');
    if (dirty.size || metaDirty) later(srv ? 500 : 15000);
  })();
})();
