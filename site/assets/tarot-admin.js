// Кабинет → «🃏 Таро» (только админ; admin.js открывает PPTarotAdmin.mount(main)). «Таро кошек»:
// 1) выбрать расклад → 2) у каждого места — выпадающий список карт и галочка «перевёрнута»; сразу под ним одна выделенная строка
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
  .tr-g{font-size:1.6em;line-height:1.2;display:inline-block;min-height:1.2em;font-weight:700}
  .tr-g.rev{transform:rotate(180deg)}
  .tr-pickrow{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin:4px 0 10px}
  .tr-sel{font:inherit;font-weight:700;color:#2B1A51;padding:8px 10px;border-radius:10px;border:2px solid #E8E4E2;background:#fff;max-width:100%;cursor:pointer}
  .tr-sel:focus{outline:none;border-color:#E9A93B}
  .tr-flip{white-space:nowrap;cursor:pointer;font-size:.9em;user-select:none}
  .tr-flip input{accent-color:#2B1A51;width:16px;height:16px;vertical-align:-3px}
  .tr-card{padding:16px;border-radius:16px;border:1px solid #E8E4E2;background:#fff;color:#2B1A51;margin:14px 0}
  .tr-card h3{margin:0 0 8px}
  .tr-card h3 .tr-g{font-size:1em}
  .tr-pos{font-size:.8em;text-transform:uppercase;letter-spacing:.06em;color:#b9771a;font-weight:700;margin-bottom:4px}
  .tr-kw{margin:0 0 10px;padding:8px 12px;border-radius:10px;background:#FFF4DC;font-weight:700;line-height:1.4}
  .tr-t p{margin:8px 0;line-height:1.55}
  .tr-side{font-size:.8em;font-weight:700;margin:14px 0 6px;opacity:.7}
  .tr-top{display:flex;align-items:center;flex-wrap:wrap;gap:6px 14px;margin:0 0 6px}
  .tr-top h2{margin:0}
  .tr-back{all:unset;cursor:pointer;font-size:.9em;opacity:.75}
  .tr-back:hover{opacity:1;text-decoration:underline}
  .tr-row{display:flex;align-items:center;flex-wrap:wrap;gap:6px 14px;margin:10px 0 0}
  .tr-row h3{margin:0}
  .tr-cnt{display:inline-flex;align-items:center;gap:2px;border:1px solid #E8E4E2;border-radius:99px;background:#fff}
  .tr-cnt button{all:unset;cursor:pointer;width:30px;height:30px;text-align:center;font-weight:700;font-size:1.1em;border-radius:50%}
  .tr-cnt button:hover:not(:disabled){background:#F4EFEA}
  .tr-cnt button:disabled{opacity:.3;cursor:default}
  .tr-cnt b{min-width:1.6em;text-align:center}`;

  const SUITS = [['wands', 'Жезлы', 'Огонь'], ['cups', 'Кубки', 'Вода'], ['swords', 'Мечи', 'Воздух'], ['pent', 'Пентакли', 'Земля']];

  let D = null, st = { sp: null, picks: [], rev: [], cur: 0, n: 3 };
  const FREE_MAX = 15;
  // места расклада; у свободного — «Карта 1…N» по выбранному числу
  const places = sp => sp.free ? Array.from({ length: st.n }, (_, i) => ({ name: `Карта ${i + 1}`, about: '', free: true })) : sp.pos;
  const card = n => D.cards.find(c => c.n === n);
  const picked = i => st.picks[i] !== undefined && st.picks[i] !== null && st.picks[i] >= 0;
  const nCards = k => `${k} ${k === 1 ? 'карта' : k < 5 ? 'карты' : 'карт'}`;
  const paras = t => String(t || '').split('\n').map(p => `<p>${esc(p)}</p>`).join('');
  const save = () => ls.set({ sp: st.sp, picks: st.picks, rev: st.rev, n: st.n });

  function mount(main) {
    main.innerHTML = `<style>${CSS}</style><div class="tr-wrap"><p class="be-note">Загружаю колоду…</p></div>`;
    const box = main.querySelector('.tr-wrap');
    fetch('/api/admin/tarot', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
      D = d;
      const last = ls.get();
      if (last && D.spreads.find(s => s.id === last.sp)) st = { sp: last.sp, picks: last.picks || [], rev: last.rev || [], cur: 0, n: Math.min(FREE_MAX, Math.max(1, +last.n || 3)) };
      draw(box);
    }).catch(e => { box.innerHTML = `<p class="be-note">Не получилось открыть таро (${esc(e)}). Раздел только для админа — проверьте вход и PIN.</p>`; });
  }

  function draw(box) {
    const sp = D.spreads.find(s => s.id === st.sp);
    if (!sp) return drawChoose(box);
    const pl = places(sp);
    const opt = (c, i) => `<option value="${c.n}"${st.picks[i] === c.n ? ' selected' : ''}${used(i).has(c.n) ? ' disabled' : ''}>${esc(c.g)} ${esc(c.ru)}</option>`;
    const select = i => `<select class="tr-sel" data-i="${i}" aria-label="Карта для места ${i + 1}"><option value="-1">— выберите карту —</option>
      <optgroup label="Старшие арканы">${D.cards.filter(c => c.ar === 'major').map(c => opt(c, i)).join('')}</optgroup>
      ${SUITS.map(([id, name]) => `<optgroup label="${name}">${D.cards.filter(c => c.suit === id).map(c => opt(c, i)).join('')}</optgroup>`).join('')}</select>`;
    box.innerHTML = `<section class="adm-box">
      <div class="tr-top"><h2>🃏 ${esc(sp.name)}</h2><button type="button" class="tr-back">← другой расклад</button></div>
      <details><summary class="be-note">Как делать этот расклад</summary><ol class="tr-how">${sp.how.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <ul class="tr-how">${D.prep.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
      ${sp.free ? `<div class="tr-row"><h3>Карты</h3><span class="tr-cnt" title="Сколько карт"><button type="button" class="tr-n" data-d="-1" ${st.n <= 1 ? 'disabled' : ''} aria-label="Меньше карт">−</button><b>${st.n}</b><button type="button" class="tr-n" data-d="1" ${st.n >= FREE_MAX ? 'disabled' : ''} aria-label="Больше карт">+</button></span></div>` : ''}
      ${st.picks.some((_, i) => picked(i)) ? '<p style="margin:6px 0 0"><button type="button" class="tr-back tr-clear">очистить всё</button></p>' : ''}
    </section>
    ${pl.map((p, i) => { const c = picked(i) && card(st.picks[i]), rev = !!st.rev[i];
      return `<article class="tr-card"><div class="tr-pos">${p.free ? esc(p.name) : `${i + 1}. ${esc(p.name)}`}</div>
        <div class="tr-pickrow">${select(i)}${c ? `<label class="tr-flip"><input type="checkbox" data-i="${i}"${rev ? ' checked' : ''}> ↺ перевёрнута</label>` : ''}</div>
        ${c ? `<p class="tr-kw">${esc(rev ? c.kwr : c.kw)}</p><div class="tr-t">${paras(rev ? c.r : c.t)}</div>` : `<p class="be-note" style="margin:6px 0 0">${esc(p.about || '')}</p>`}</article>`; }).join('')}`;
    box.querySelector('.tr-back').onclick = () => { st = { sp: null, picks: [], rev: [], cur: 0, n: st.n }; save(); draw(box); };
    box.querySelectorAll('.tr-n').forEach(b => b.onclick = () => { // меньше карт — последние места убираются
      st.n = Math.min(FREE_MAX, Math.max(1, st.n + +b.dataset.d)); st.picks = st.picks.slice(0, st.n); st.rev = st.rev.slice(0, st.n); save(); draw(box);
    });
    box.querySelectorAll('.tr-sel').forEach(s => s.onchange = () => { const i = +s.dataset.i; st.picks[i] = +s.value; st.rev[i] = false; save(); draw(box); });
    box.querySelectorAll('.tr-flip input').forEach(x => x.onchange = () => { st.rev[+x.dataset.i] = x.checked; save(); draw(box); });
    const cl = box.querySelector('.tr-clear'); if (cl) cl.onclick = () => { st.picks = []; st.rev = []; save(); draw(box); };
  }

  // карты, уже выбранные на других местах (в списке недоступны — карта не повторяется)
  const used = i => new Set(st.picks.filter((n, j) => n >= 0 && n !== null && j !== i));

  function drawChoose(box) {
    box.innerHTML = `<section class="adm-box"><h2>🃏 Таро</h2>
      <p class="be-note">«Таро кошек», 78 карт. Выберите расклад и отметьте выпавшие карты.</p>
      <div class="tr-spreads">${D.spreads.map(s => `<button type="button" class="tr-sp" data-id="${s.id}"><b>${esc(s.name)}</b><small>${s.free ? 'сколько хотите карт' : nCards(s.cards)}</small></button>`).join('')}</div>
      <details><summary class="be-note">Все карты колоды</summary>${D.cards.map(c => cardHtml(c)).join('')}</details></section>`;
    box.querySelectorAll('.tr-sp').forEach(b => b.onclick = () => { st = { sp: b.dataset.id, picks: [], rev: [], cur: 0, n: st.n }; save(); draw(box); });
  }

  // карта: место (в раскладе), название, одна выделенная строка ключевых слов, описание из колоды
  function cardHtml(c, pos) {
    const title = rev => `<h3><span class="tr-g${rev ? ' rev' : ''}">${esc(c.g)}</span> ${esc(c.ru)}${rev ? ' — перевёрнута' : ''}</h3>`;
    if (!pos) return `<article class="tr-card">${title(false)}<p class="tr-kw">${esc(c.kw)}</p><div class="tr-t">${paras(c.t)}</div>
      <p class="tr-side">↺ Перевёрнутая</p><p class="tr-kw">${esc(c.kwr)}</p><div class="tr-t">${paras(c.r)}</div></article>`;
    return `<article class="tr-card"><div class="tr-pos">${pos.free ? '' : `${esc(pos.i)}. `}${esc(pos.name)}</div>${title(pos.rev)}
      <p class="tr-kw">${esc(pos.rev ? c.kwr : c.kw)}</p><div class="tr-t">${paras(pos.rev ? c.r : c.t)}</div></article>`;
  }

  window.PPTarotAdmin = { mount };
})();
