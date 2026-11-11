// Скетчбук /sketchbook/ (docs/site.md): вкладки-тетрадки, просмотр картин, число картин на обложке;
// Алина (админ): «✏️ Разделы» — порядок, скрыть/вернуть, названия EN/RU/LV, новые разделы → POST /api/admin/sketchbook (meta sketchbook).
// Картины в разделы добавляет и прячет palettes.js («➕ Добавить картину», 🗑) — он видит каждую .gallery[data-gallery].
(() => {
  const root = document.querySelector('.skb');
  if (!root) return;
  const L = { ru: 'ru', lv: 'lv' }[document.documentElement.lang] || 'en', li = { en: 0, ru: 1, lv: 2 }[L];
  const T = {
    edit: { en: '✏️ Sections', ru: '✏️ Разделы', lv: '✏️ Sadaļas' },
    head: { en: 'Sketchbook sections', ru: 'Разделы скетчбука', lv: 'Skiču burtnīcas sadaļas' },
    tip: { en: 'Order, hide and rename. Pictures are added inside each section.', ru: 'Порядок, скрыть, переименовать. Картины добавляются внутри раздела.', lv: 'Secība, paslēpt, pārdēvēt. Darbus pievieno sadaļā.' },
    add: { en: '➕ New section', ru: '➕ Новый раздел', lv: '➕ Jauna sadaļa' },
    save: { en: 'Save', ru: 'Сохранить', lv: 'Saglabāt' },
    cancel: { en: 'Close', ru: 'Закрыть', lv: 'Aizvērt' },
    name: { en: 'Name', ru: 'Название', lv: 'Nosaukums' },
    note: { en: 'Line under it', ru: 'Строка под ним', lv: 'Rinda zem tā' },
    hide: { en: 'Hide', ru: 'Скрыть', lv: 'Paslēpt' },
    show: { en: 'Show', ru: 'Показать', lv: 'Rādīt' },
    hidden: { en: 'hidden', ru: 'скрыт', lv: 'paslēpta' },
    del: { en: 'Delete this new section? Its pictures stay saved but will not be shown.', ru: 'Удалить новый раздел? Картины в нём останутся сохранёнными, но не будут видны.', lv: 'Dzēst jauno sadaļu? Darbi paliks saglabāti, bet netiks rādīti.' },
    err: { en: 'Could not save, try again.', ru: 'Не сохранилось, попробуй ещё раз.', lv: 'Neizdevās saglabāt, mēģini vēlreiz.' },
    empty: { en: 'No pictures here yet.', ru: 'Здесь пока нет картин.', lv: 'Šeit vēl nav darbu.' },
    close: { en: 'Close', ru: 'Закрыть', lv: 'Aizvērt' },
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tabsBox = root.querySelector('.sk-tabs');
  const tabs = () => [...root.querySelectorAll('.sk-tab')].sort((a, b) => (parseInt(getComputedStyle(a).order) || 0) - (parseInt(getComputedStyle(b).order) || 0));
  const panel = id => document.getElementById('sk-' + id);

  // --- вкладки ---
  const select = (id, focus) => {
    tabs().forEach(t => { const on = t.dataset.sec === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    root.querySelectorAll('.sk-p').forEach(p => { const on = p.dataset.sec === id; p.hidden = !on; if (on) { p.classList.remove('sk-in'); void p.offsetWidth; p.classList.add('sk-in'); } });
  };
  tabsBox.addEventListener('click', e => {
    const t = e.target.closest('.sk-tab'); if (!t) return;
    select(t.dataset.sec);
    try { history.replaceState(null, '', '#sk-' + t.dataset.sec); } catch (err) { /* без адреса */ }
    const p = panel(t.dataset.sec); if (p && p.getBoundingClientRect().top > innerHeight * .8) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  tabsBox.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const all = tabs(), i = all.indexOf(document.activeElement); if (i < 0) return;
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length;
    e.preventDefault(); select(all[j].dataset.sec, true);
  });
  const fromHash = () => { const m = location.hash.match(/^#sk-([a-z0-9-]+)$/); return m && panel(m[1]) ? m[1] : null; };
  const first = tabs()[0];
  const start = fromHash() || (first && first.dataset.sec);
  if (start) select(start);
  if (fromHash()) setTimeout(() => panel(start).scrollIntoView({ block: 'start' }), 80);
  addEventListener('hashchange', () => { const h = fromHash(); if (h) select(h); });

  // --- число картин и обложка: картины с сайта (palettes.js) догружаются позже ---
  const recount = g => {
    const id = g.closest('.sk-p').dataset.sec, tab = document.getElementById('skt-' + id); if (!tab) return;
    const figs = g.querySelectorAll('figure'), n = tab.querySelector('.sk-n'); n.textContent = figs.length;
    const cov = tab.querySelector('.sk-cov'); if (!cov.querySelector('img') && figs[0]) cov.insertAdjacentHTML('afterbegin', `<img src="${esc(figs[0].querySelector('img').getAttribute('src'))}" alt="">`);
    let em = g.querySelector('.sk-empty');
    if (!figs.length && !em) { em = document.createElement('p'); em.className = 'sk-empty hand'; em.textContent = T.empty[L]; g.appendChild(em); }
    if (figs.length && em) em.remove();
  };
  root.querySelectorAll('.sk-g').forEach(g => { recount(g); new MutationObserver(() => recount(g)).observe(g, { childList: true }); });

  // --- просмотр картины (листать — внутри открытой темы) ---
  const box = document.createElement('div');
  box.className = 'sk-lb'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
  box.innerHTML = `<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="sk-lb-x" aria-label="${T.close[L]}">✕</button><button type="button" class="sk-lb-p" aria-label="‹">‹</button><button type="button" class="sk-lb-n" aria-label="›">›</button>`;
  document.body.appendChild(box);
  const bImg = box.querySelector('img'), bCap = box.querySelector('figcaption');
  let list = [], at = 0, back = null;
  const show = i => { at = (i + list.length) % list.length; const a = list[at]; bImg.src = a.href; bImg.alt = a.querySelector('img')?.alt || ''; bCap.textContent = (a.closest('figure')?.querySelector('figcaption')?.textContent || '').trim(); };
  const close = () => { box.hidden = true; bImg.removeAttribute('src'); document.documentElement.style.overflow = ''; back && back.focus(); };
  root.addEventListener('click', e => {
    const a = e.target.closest('a[data-lightbox]'); if (!a || e.ctrlKey || e.metaKey || e.target.closest('.pal-del')) return;
    e.preventDefault(); back = a; list = [...a.closest('.sk-g').querySelectorAll('a[data-lightbox]')];
    show(list.indexOf(a)); box.hidden = false; document.documentElement.style.overflow = 'hidden'; box.querySelector('.sk-lb-x').focus();
  });
  box.querySelector('.sk-lb-x').onclick = close;
  box.querySelector('.sk-lb-p').onclick = () => show(at - 1);
  box.querySelector('.sk-lb-n').onclick = () => show(at + 1);
  box.addEventListener('click', e => { if (e.target === box || e.target.tagName === 'FIGURE') close(); });
  addEventListener('keydown', e => { if (box.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1)); x0 = null; });

  // --- Алина: разделы ---
  fetch('/api/whoami', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => d && d.user && d.user.admin && admin()).catch(() => {});
  async function admin() {
    const [stat, cfg] = await Promise.all([fetch('/assets/sketchbook.json').then(r => r.json()), fetch('/api/sketchbook', { credentials: 'same-origin' }).then(r => r.json())]);
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn sk-edit'; btn.textContent = T.edit[L];
    root.querySelector('.hd5').appendChild(btn);
    const dlg = document.createElement('div'); dlg.className = 'sk-adm'; dlg.hidden = true; root.querySelector('.hd5').after(dlg);
    let rows;
    const reset = () => {
      const all = [...stat.map(s => ({ id: s.id, color: s.color, t: s.t, n: s.n, own: false })), ...cfg.custom.map(c => ({ id: c.id, color: c.color, t: ['', '', ''], n: ['', '', ''], own: true }))];
      all.forEach(r => { const v = cfg.names[r.id]; if (v) { r.t = r.t.map((x, i) => v.t[i] || x); r.n = r.n.map((x, i) => v.n[i] || x); } r.hid = cfg.hidden.includes(r.id); });
      const o = id => { const i = cfg.order.indexOf(id); return i < 0 ? 999 : i; };
      rows = all.map((r, i) => ({ ...r, k: o(r.id) * 1000 + i })).sort((a, b) => a.k - b.k);
    };
    const draw = () => {
      dlg.innerHTML = `<h3>${T.head[L]}</h3><p class="sk-adm-tip">${T.tip[L]}</p><ol>${rows.map((r, i) => `<li class="${r.hid ? 'off' : ''}" style="--c:${esc(r.color)}">
        <div class="sk-adm-row"><i></i><b>${esc(r.t[li] || r.t[0] || '…')}</b>${r.hid ? `<small>${T.hidden[L]}</small>` : ''}
        <span><button type="button" data-a="up" data-i="${i}" aria-label="↑"${i ? '' : ' disabled'}>↑</button><button type="button" data-a="down" data-i="${i}" aria-label="↓"${i < rows.length - 1 ? '' : ' disabled'}>↓</button>
        <button type="button" data-a="hid" data-i="${i}">${r.hid ? T.show[L] : T.hide[L]}</button><button type="button" data-a="ed" data-i="${i}" aria-label="✎">✎</button>${r.own ? `<button type="button" data-a="del" data-i="${i}" aria-label="🗑">🗑</button>` : ''}</span></div>
        <div class="sk-adm-f"${r.open ? '' : ' hidden'}>${['en', 'ru', 'lv'].map((l, j) => `<label>${T.name[L]} ${l.toUpperCase()}<input data-f="t" data-i="${i}" data-j="${j}" maxlength="60" value="${esc(r.t[j])}"></label>`).join('')}
        ${['en', 'ru', 'lv'].map((l, j) => `<label>${T.note[L]} ${l.toUpperCase()}<input data-f="n" data-i="${i}" data-j="${j}" maxlength="200" value="${esc(r.n[j])}"></label>`).join('')}
        <label>🎨<input type="color" data-f="c" data-i="${i}" value="${esc(r.color)}"${r.own ? '' : ' disabled'}></label></div></li>`).join('')}</ol>
        <div class="sk-adm-b"><button type="button" class="btn" data-a="new">${T.add[L]}</button><button type="button" class="btn pri" data-a="save">${T.save[L]}</button><button type="button" class="btn" data-a="close">${T.cancel[L]}</button><span class="sk-adm-m" aria-live="polite"></span></div>`;
    };
    dlg.addEventListener('input', e => { const f = e.target.dataset.f; if (!f) return; const r = rows[+e.target.dataset.i]; if (f === 'c') r.color = e.target.value; else r[f][+e.target.dataset.j] = e.target.value; });
    dlg.addEventListener('click', async e => {
      const b = e.target.closest('button[data-a]'); if (!b) return;
      const a = b.dataset.a, i = +b.dataset.i;
      if (a === 'up' || a === 'down') { const j = i + (a === 'up' ? -1 : 1); [rows[i], rows[j]] = [rows[j], rows[i]]; draw(); }
      if (a === 'hid') { rows[i].hid = !rows[i].hid; draw(); }
      if (a === 'ed') { rows[i].open = !rows[i].open; draw(); }
      if (a === 'del' && confirm(T.del[L])) { rows.splice(i, 1); draw(); }
      if (a === 'new') { rows.push({ id: 's-' + Date.now().toString(36).slice(-6) + Math.random().toString(36).slice(2, 4), color: '#8A2638', t: ['', '', ''], n: ['', '', ''], own: true, hid: false, open: true }); draw(); dlg.querySelector('li:last-child input').focus(); }
      if (a === 'close') { dlg.hidden = true; }
      if (a === 'save') {
        const m = dlg.querySelector('.sk-adm-m'); b.disabled = true;
        const names = {};
        for (const r of rows) {
          const s = stat.find(x => x.id === r.id), same = s && r.t.every((x, j) => x === s.t[j]) && r.n.every((x, j) => x === s.n[j]);
          if (!same) { const any = r.t.find(Boolean) || '…'; names[r.id] = { t: r.t.map(x => x || any), n: r.n.map((x, j) => x || r.n[0] || '') }; }
        }
        const body = { order: rows.map(r => r.id), hidden: rows.filter(r => r.hid).map(r => r.id), names, custom: rows.filter(r => r.own).map(r => ({ id: r.id, color: r.color })) };
        try {
          const r = await fetch('/api/admin/sketchbook', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
          if (!r.ok) throw 0; location.reload();
        } catch (err) { m.textContent = T.err[L]; b.disabled = false; }
      }
    });
    btn.onclick = () => { if (dlg.hidden) { reset(); draw(); } dlg.hidden = !dlg.hidden; };
  }
})();
