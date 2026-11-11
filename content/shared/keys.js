// ⌨️ Кнопки особых букв языка в учебниках (/norsk/, /nederlands/; docs/site.md «Кнопки особых букв»).
// Встраивают tools/{norsk,nederlands}_page.py функцией keys(html, 'å æ ø …'). Буквы — window.PPKEYS (строка через пробел).
// Под полем, в котором стоит курсор (input/textarea/contenteditable), всплывает строка кнопок; нажатие вставляет букву
// туда, где курсор (фокус не уходит — pointerdown.preventDefault). ⇧ — заглавные. Поля имени, ника, перевода, пароля — без кнопок.
(function () {
  const CH = String(window.PPKEYS || '').split(/\s+/).filter(Boolean);
  if (!CH.length) return;
  const css = document.createElement('style');
  css.textContent = '#ppkeys{position:absolute;z-index:60;display:flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:10px;background:var(--card,#fff);border:1px solid var(--line,#ccc);box-shadow:0 4px 14px rgba(0,0,0,.15);max-width:calc(100vw - 16px)}'
    + '#ppkeys[hidden]{display:none}'
    + '#ppkeys button{font:inherit;font-size:17px;line-height:1;min-width:34px;height:34px;padding:0 6px;border-radius:8px;border:1px solid var(--line,#ccc);background:var(--bg,#faf7f2);color:var(--ink,#222);cursor:pointer;touch-action:manipulation}'
    + '#ppkeys button:hover{border-color:var(--accent,#c8601e)}'
    + '#ppkeys button.sh{font-size:14px}#ppkeys button.sh[aria-pressed=true]{background:var(--accent,#c8601e);color:#fff}';
  document.head.appendChild(css);
  const bar = document.createElement('div');
  bar.id = 'ppkeys'; bar.hidden = true; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Особые буквы');
  let up = false;
  const paint = () => {
    bar.innerHTML = CH.map(c => `<button type="button" data-k="${c}" tabindex="-1">${up ? c.toUpperCase() : c}</button>`).join('')
      + `<button type="button" class="sh" data-sh tabindex="-1" aria-pressed="${up}" title="Заглавные">⇧</button>`;
  };
  paint();
  document.body.appendChild(bar);
  const SKIP = 'input[type=password],input[type=checkbox],input[type=radio],input[type=number],input[name=nick],input[name=en],input[name=ru],input[name=tr],[data-nokeys]';
  const ok = el => el && !el.disabled && !el.readOnly && !el.matches(SKIP)
    && (el.matches('textarea,input:not([type]),input[type=text],input[type=search]') || el.isContentEditable);
  let cur = null;
  const place = () => {
    if (!cur || !cur.isConnected) { bar.hidden = true; return; }
    const r = cur.getBoundingClientRect();
    if (!r.width && !r.height) { bar.hidden = true; return; }
    bar.hidden = false;
    const w = bar.offsetWidth, h = bar.offsetHeight;
    let left = Math.max(8, Math.min(r.left, innerWidth - w - 8));
    let top = r.bottom + 4;
    if (cur.isContentEditable && r.height > 200) top = Math.min(r.bottom, innerHeight) - h - 6; // большое поле (блокнот) — внутри, внизу видимой части
    else if (top + h > innerHeight && r.top - h - 4 > 0) top = r.top - h - 4;
    bar.style.left = (left + scrollX) + 'px'; bar.style.top = (top + scrollY) + 'px';
  };
  document.addEventListener('focusin', e => { cur = ok(e.target) ? e.target : null; place(); });
  document.addEventListener('focusout', () => setTimeout(() => { if (!ok(document.activeElement)) { cur = null; bar.hidden = true; } }, 0));
  document.addEventListener('input', () => { if (cur) place(); });
  addEventListener('resize', () => cur && place());
  addEventListener('scroll', () => cur && place(), true);
  bar.addEventListener('pointerdown', e => e.preventDefault()); // фокус и курсор остаются в поле
  bar.addEventListener('mousedown', e => e.preventDefault());
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    e.stopPropagation();
    if (b.dataset.sh !== undefined) { up = !up; paint(); return; }
    let el = document.activeElement;
    if (!ok(el)) el = cur;
    if (!ok(el) || !el.isConnected) return;
    if (document.activeElement !== el) el.focus();
    const c = up ? b.dataset.k.toUpperCase() : b.dataset.k;
    if (!document.execCommand || !document.execCommand('insertText', false, c)) {
      if (el.isContentEditable) return;
      const s = el.selectionStart ?? el.value.length, en = el.selectionEnd ?? s;
      el.setRangeText(c, s, en, 'end');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (up) { up = false; paint(); } // ⇧ — на одну букву
    cur = document.activeElement; place();
  });
})();
