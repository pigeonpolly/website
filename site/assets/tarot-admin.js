// Кабинет → «🃏 Таро» (только админ; admin.js открывает PPTarotAdmin.mount(main)). «Таро кошек»:
// 1) выбрать расклад → 2) отметить выпавшие карты по местам (прямо/перевёрнуто) → 3) у каждой карты: место, одна выделенная строка
// ключевых слов и описание из колоды. Больше ничего — Алина просила просто (14.11.2026).
// Данные — GET /api/admin/tarot (worker/tarot.js, worker/tarot-data.js). Сохраняется только последний расклад в localStorage.
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const KEY = 'pp-tarot-last';
  const ls = { get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }, set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { } } };
  const CSS = `
  .tr-wrap{max-width:900px}
  .tr-spreads{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:12px 0}
  .tr-sp{text-align:left;padding:14px;border-radius:14px;border:2px solid #E8E4E2;background:#fff;cursor:pointer;font:inherit;color:#2B1A51}
  .tr-sp:hover,.tr-sp:focus-visible{border-color:#E9A93B}
  .tr-sp b{display:block;font-size:1.05em;margin-bottom:4px}
  .tr-sp small{opacity:.75}
  .tr-how{margin:6px 0 14px 20px;padding:0}
  .tr-how li{margin:4px 0}
  .tr-slots{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0}
  .tr-slot{flex:1 1 150px;min-width:140px;max-width:220px;padding:12px;border-radius:14px;border:2px dashed #E8E4E2;background:#fff;color:#2B1A51;text-align:center}
  .tr-slot.on{border-style:solid;border-color:#E9A93B}
  .tr-slot.cur{box-shadow:0 0 0 3px #E9A93B}
  .tr-slot>button.tr-pick{all:unset;cursor:pointer;display:block;width:100%}
  .tr-slot .tr-pn{font-size:.85em;opacity:.75;display:block;margin-bottom:6px}
  .tr-g{font-size:1.6em;line-height:1.2;display:inline-block;min-height:1.2em;font-weight:700}
  .tr-g.rev{transform:rotate(180deg)}
  .tr-flip{margin-top:8px;font:inherit;font-size:.8em;padding:3px 10px;border-radius:99px;border:1px solid #E8E4E2;background:#F4EFEA;color:#2B1A51;cursor:pointer}
  .tr-flip[aria-pressed="true"]{background:#2B1A51;color:#fff;border-color:#2B1A51}
  .tr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;margin:8px 0 16px}
  .tr-c{padding:8px 4px;border-radius:12px;border:1px solid #E8E4E2;background:#fff;cursor:pointer;font:inherit;color:#2B1A51;font-size:.85em}
  .tr-c:hover:not(:disabled){border-color:#E9A93B}
  .tr-c:disabled{opacity:.35;cursor:default}
  .tr-c .tr-g{font-size:1.2em;display:block}
  .tr-card{padding:16px;border-radius:16px;border:1px solid #E8E4E2;background:#fff;color:#2B1A51;margin:14px 0}
  .tr-card h3{margin:0 0 8px}
  .tr-card h3 .tr-g{font-size:1em}
  .tr-pos{font-size:.8em;text-transform:uppercase;letter-spacing:.06em;color:#b9771a;font-weight:700;margin-bottom:4px}
  .tr-kw{margin:0 0 10px;padding:8px 12px;border-radius:10px;background:#FFF4DC;font-weight:700;line-height:1.4}
  .tr-t p{margin:8px 0;line-height:1.55}
  .tr-side{font-size:.8em;font-weight:700;margin:14px 0 6px;opacity:.7}
  @media (max-width:600px){.tr-slot{max-width:none}}`;

  const SUITS = [['wands', 'Жезлы', 'Огонь'], ['cups', 'Кубки', 'Вода'], ['swords', 'Мечи', 'Воздух'], ['pent', 'Пентакли', 'Земля']];

  let D = null, st = { sp: null, picks: [], rev: [], cur: 0 };
  const card = n => D.cards.find(c => c.n === n);
  const picked = i => st.picks[i] !== undefined && st.picks[i] !== null && st.picks[i] >= 0;
  const nCards = k => `${k} ${k === 1 ? 'карта' : k < 5 ? 'карты' : 'карт'}`;
  const paras = t => String(t || '').split('\n').map(p => `<p>${esc(p)}</p>`).join('');
  const save = () => ls.set({ sp: st.sp, picks: st.picks, rev: st.rev });

  function mount(main) {
    main.innerHTML = `<style>${CSS}</style><div class="tr-wrap"><p class="be-note">Загружаю колоду…</p></div>`;
    const box = main.querySelector('.tr-wrap');
    fetch('/api/admin/tarot', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
      D = d;
      const last = ls.get();
      if (last && D.spreads.find(s => s.id === last.sp)) st = { sp: last.sp, picks: last.picks || [], rev: last.rev || [], cur: 0 };
      draw(box);
    }).catch(e => { box.innerHTML = `<p class="be-note">Не получилось открыть таро (${esc(e)}). Раздел только для админа — проверьте вход и PIN.</p>`; });
  }

  function draw(box) {
    const sp = D.spreads.find(s => s.id === st.sp);
    if (!sp) return drawChoose(box);
    const full = sp.pos.every((_, i) => picked(i));
    box.innerHTML = `<section class="adm-box">
      <p><button type="button" class="pill-btn tr-back">← Другой расклад</button></p>
      <h2>🃏 ${esc(sp.name)}</h2>
      <details><summary class="be-note">Как делать этот расклад</summary><ol class="tr-how">${sp.how.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <ul class="tr-how">${D.prep.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
      <h3>Какие карты выпали</h3>
      <p class="be-note">Нажмите на место, потом на карту. «↺ Перевёрнута» — если карта легла вверх ногами.</p>
      <div class="tr-slots">${sp.pos.map((p, i) => { const c = picked(i) && card(st.picks[i]); return `<div class="tr-slot${c ? ' on' : ''}${i === st.cur ? ' cur' : ''}">
        <button type="button" class="tr-pick" data-i="${i}"><span class="tr-pn">${i + 1}. ${esc(p.name)}</span><span class="tr-g${c && st.rev[i] ? ' rev' : ''}">${c ? esc(c.g) : '?'}</span><br>${c ? `<b>${esc(c.ru)}</b>` : '<span class="be-note">выбрать</span>'}</button>
        ${c ? `<button type="button" class="tr-flip" data-i="${i}" aria-pressed="${st.rev[i] ? 'true' : 'false'}">↺ Перевёрнута</button>` : ''}</div>`; }).join('')}</div>
      ${full ? '' : grid('Старшие арканы', D.cards.filter(c => c.ar === 'major')) + SUITS.map(([id, name]) => grid(name, D.cards.filter(c => c.suit === id))).join('')}
      <p>${st.picks.some((_, i) => picked(i)) ? '<button type="button" class="pill-btn tr-clear">Очистить</button>' : ''}</p>
    </section>
    ${full ? `<section class="tr-read">${sp.pos.map((p, i) => cardHtml(card(st.picks[i]), { i: i + 1, rev: !!st.rev[i], ...p })).join('')}</section>` : ''}`;
    box.querySelector('.tr-back').onclick = () => { st = { sp: null, picks: [], rev: [], cur: 0 }; save(); draw(box); };
    box.querySelectorAll('.tr-pick').forEach(b => b.onclick = () => {
      st.cur = +b.dataset.i;
      if (full) { st.picks[st.cur] = -1; st.rev[st.cur] = false; save(); } // при полном раскладе место открывает выбор заново
      draw(box);
    });
    box.querySelectorAll('.tr-flip').forEach(b => b.onclick = () => { const i = +b.dataset.i; st.rev[i] = !st.rev[i]; save(); draw(box); });
    box.querySelectorAll('.tr-c').forEach(b => b.onclick = () => {
      const n = +b.dataset.n;
      if (st.picks[st.cur] === n) { st.picks[st.cur] = -1; st.rev[st.cur] = false; }
      else {
        st.picks[st.cur] = n; st.rev[st.cur] = false;
        const next = sp.pos.findIndex((_, i) => !picked(i));
        if (next >= 0) st.cur = next;
      }
      save(); draw(box);
      if (sp.pos.every((_, i) => picked(i))) { const r = box.querySelector('.tr-read'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    const cl = box.querySelector('.tr-clear'); if (cl) cl.onclick = () => { st.picks = []; st.rev = []; st.cur = 0; save(); draw(box); };
  }

  function grid(title, list) {
    const used = new Set(st.picks.filter((n, i) => n >= 0 && n !== null && i !== st.cur));
    return `<p class="be-note" style="margin-bottom:0">${esc(title)}</p><div class="tr-grid">${list.map(c => `<button type="button" class="tr-c" data-n="${c.n}" ${used.has(c.n) ? 'disabled' : ''}${st.picks[st.cur] === c.n ? ' style="border-color:#E9A93B;border-width:2px"' : ''}>
      <span class="tr-g">${esc(c.g)}</span>${esc(c.ru)}</button>`).join('')}</div>`;
  }

  function drawChoose(box) {
    box.innerHTML = `<section class="adm-box"><h2>🃏 Таро</h2>
      <p class="be-note">«Таро кошек», 78 карт. Выберите расклад и отметьте выпавшие карты.</p>
      <div class="tr-spreads">${D.spreads.map(s => `<button type="button" class="tr-sp" data-id="${s.id}"><b>${esc(s.name)}</b><small>${nCards(s.cards)}</small></button>`).join('')}</div>
      <details><summary class="be-note">Все карты колоды</summary>${D.cards.map(c => cardHtml(c)).join('')}</details></section>`;
    box.querySelectorAll('.tr-sp').forEach(b => b.onclick = () => { st = { sp: b.dataset.id, picks: [], rev: [], cur: 0 }; save(); draw(box); });
  }

  // карта: место (в раскладе), название, одна выделенная строка ключевых слов, описание из колоды
  function cardHtml(c, pos) {
    const title = rev => `<h3><span class="tr-g${rev ? ' rev' : ''}">${esc(c.g)}</span> ${esc(c.ru)}${rev ? ' — перевёрнута' : ''}</h3>`;
    if (!pos) return `<article class="tr-card">${title(false)}<p class="tr-kw">${esc(c.kw)}</p><div class="tr-t">${paras(c.t)}</div>
      <p class="tr-side">↺ Перевёрнутая</p><p class="tr-kw">${esc(c.kwr)}</p><div class="tr-t">${paras(c.r)}</div></article>`;
    return `<article class="tr-card"><div class="tr-pos">${esc(pos.i)}. ${esc(pos.name)}</div>${title(pos.rev)}
      <p class="tr-kw">${esc(pos.rev ? c.kwr : c.kw)}</p><div class="tr-t">${paras(pos.rev ? c.r : c.t)}</div></article>`;
  }

  window.PPTarotAdmin = { mount };
})();
