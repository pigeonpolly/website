// Кабинет → «🔮 Руны» (только админ; admin.js открывает PPRunesAdmin.mount(main)). Колода «Runic Oracle»:
// 1) выбрать расклад → 2) как его делать + какие карты выпали (по позициям) → 3) толкование каждой карты и общее по раскладу.
// Данные — GET /api/admin/runes (worker/runes.js, worker/runes-data.js). Ничего не сохраняется, кроме последнего расклада в localStorage.
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const KEY = 'pp-runes-last';
  const ls = { get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }, set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { } } };
  const CSS = `
  .rn-wrap{max-width:900px}
  .rn-spreads{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:12px 0}
  .rn-sp{text-align:left;padding:14px;border-radius:14px;border:2px solid #E8E4E2;background:#fff;cursor:pointer;font:inherit;color:#2B1A51}
  .rn-sp:hover,.rn-sp:focus-visible{border-color:#E9A93B}
  .rn-sp b{display:block;font-size:1.05em;margin-bottom:4px}
  .rn-sp small{opacity:.75}
  .rn-how{margin:6px 0 14px 20px;padding:0}
  .rn-how li{margin:4px 0}
  .rn-slots{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0}
  .rn-slot{flex:1 1 150px;min-width:140px;max-width:220px;padding:12px;border-radius:14px;border:2px dashed #E8E4E2;background:#fff;cursor:pointer;font:inherit;color:#2B1A51;text-align:center}
  .rn-slot.on{border-style:solid;border-color:#E9A93B}
  .rn-slot.cur{box-shadow:0 0 0 3px #E9A93B}
  .rn-slot .rn-pn{font-size:.85em;opacity:.75;display:block;margin-bottom:6px}
  .rn-g{font-size:2em;line-height:1.1;display:block;min-height:1.1em}
  .rn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;margin:8px 0 16px}
  .rn-c{padding:8px 4px;border-radius:12px;border:1px solid #E8E4E2;background:#fff;cursor:pointer;font:inherit;color:#2B1A51;font-size:.85em}
  .rn-c:hover:not(:disabled){border-color:#E9A93B}
  .rn-c:disabled{opacity:.35;cursor:default}
  .rn-c .rn-g{font-size:1.6em}
  .rn-card{padding:16px;border-radius:16px;border:1px solid #E8E4E2;background:#fff;color:#2B1A51;margin:14px 0}
  .rn-card h3{margin:0 0 4px}
  .rn-kw{opacity:.8;margin:0 0 10px}
  .rn-qa{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:10px 0}
  .rn-qa div{padding:10px 12px;border-radius:12px;background:#F4EFEA}
  .rn-attrs{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;font-size:.85em}
  .rn-attrs span{padding:3px 9px;border-radius:99px;background:#F4EFEA}
  .rn-t p{margin:8px 0;line-height:1.55}
  .rn-pos{font-size:.8em;text-transform:uppercase;letter-spacing:.06em;color:#b9771a;font-weight:700}
  .rn-sum{background:#fff;color:#2B1A51;padding:16px;border-radius:16px;border:2px solid #E9A93B;margin:14px 0}
  .rn-sum ul{margin:6px 0 6px 20px;padding:0}
  .rn-sum li{margin:5px 0;line-height:1.5}
  @media (max-width:600px){.rn-slot{max-width:none}}`;

  let D = null, st = { sp: null, picks: [], cur: 0 };
  const card = n => D.cards.find(c => c.n === n);
  const isGod = c => c.n > 24;
  const allowed = sp => sp.id === 'track' ? D.cards.filter(c => !isGod(c)) : D.cards;

  function mount(main) {
    main.innerHTML = `<style>${CSS}</style><div class="rn-wrap"><p class="be-note">Загружаю колоду…</p></div>`;
    const box = main.querySelector('.rn-wrap');
    fetch('/api/admin/runes', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
      D = d;
      const last = ls.get();
      if (last && D.spreads.find(s => s.id === last.sp)) { st = { sp: last.sp, picks: last.picks || [], cur: 0 }; }
      draw(box);
    }).catch(e => { box.innerHTML = `<p class="be-note">Не получилось открыть руны (${esc(e)}). Раздел только для админа — проверьте вход и PIN.</p>`; });
  }

  function draw(box) {
    const sp = D.spreads.find(s => s.id === st.sp);
    if (!sp) return drawChoose(box);
    const full = st.picks.length === sp.cards && st.picks.every(Boolean);
    box.innerHTML = `<section class="adm-box">
      <p><button type="button" class="pill-btn rn-back">← Другой расклад</button></p>
      <h2>🔮 ${esc(sp.name)}</h2>
      <p class="be-note">${sp.cards} ${sp.cards === 1 ? 'карта' : 'карты'} · ${esc(sp.deck)}</p>
      <h3>Как делать</h3>
      <ol class="rn-how">${sp.how.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
      <details><summary class="be-note">Перед раскладом — настроиться</summary><ul class="rn-how">${D.prep.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
      <h3>Какие карты выпали</h3>
      <p class="be-note">Нажмите на место, потом на карту. Повторное нажатие на выбранную карту — убрать.</p>
      <div class="rn-slots">${sp.pos.map((p, i) => { const c = st.picks[i] && card(st.picks[i]); return `<button type="button" class="rn-slot${c ? ' on' : ''}${i === st.cur ? ' cur' : ''}" data-i="${i}">
        <span class="rn-pn">${i + 1}. ${esc(p.name)}</span><span class="rn-g">${c ? esc(c.g || '✦') : '?'}</span>${c ? `<b>${esc(c.ru)}</b>` : '<span class="be-note">выбрать</span>'}</button>`; }).join('')}</div>
      ${grid(sp, 'Руны', allowed(sp).filter(c => !isGod(c)))}
      ${sp.id === 'track' ? '' : grid(sp, 'Боги', allowed(sp).filter(isGod))}
      <p>${full ? '' : '<span class="be-note">Выберите все карты — появится толкование.</span>'} ${st.picks.some(Boolean) ? '<button type="button" class="pill-btn rn-clear">Очистить</button>' : ''}</p>
    </section>
    ${full ? reading(sp) : ''}`;
    box.querySelector('.rn-back').onclick = () => { st = { sp: null, picks: [], cur: 0 }; save(); draw(box); };
    box.querySelectorAll('.rn-slot').forEach(b => b.onclick = () => { st.cur = +b.dataset.i; draw(box); });
    box.querySelectorAll('.rn-c').forEach(b => b.onclick = () => {
      const n = +b.dataset.n;
      if (st.picks[st.cur] === n) { st.picks[st.cur] = 0; }
      else {
        st.picks[st.cur] = n;
        const next = sp.pos.findIndex((_, i) => !st.picks[i]);
        if (next >= 0) st.cur = next;
      }
      save(); draw(box);
      if (st.picks.length === sp.cards && st.picks.every(Boolean)) { const r = box.querySelector('.rn-sum'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    const cl = box.querySelector('.rn-clear'); if (cl) cl.onclick = () => { st.picks = []; st.cur = 0; save(); draw(box); };
  }

  function grid(sp, title, list) {
    const used = new Set(st.picks.filter((n, i) => n && i !== st.cur));
    return `<p class="be-note" style="margin-bottom:0">${title}</p><div class="rn-grid">${list.map(c => `<button type="button" class="rn-c" data-n="${c.n}" ${used.has(c.n) ? 'disabled' : ''} title="${esc(c.kw)}"${st.picks[st.cur] === c.n ? ' style="border-color:#E9A93B;border-width:2px"' : ''}>
      <span class="rn-g">${esc(c.g || '✦')}</span>${c.n}. ${esc(c.ru)}</button>`).join('')}</div>`;
  }

  function drawChoose(box) {
    box.innerHTML = `<section class="adm-box"><h2>🔮 Руны</h2>
      <p class="be-note">Колода «Runic Oracle»: 24 руны и 20 карт богов. Выберите расклад — покажу, как его делать, потом отметите выпавшие карты и получите толкование.</p>
      <div class="rn-spreads">${D.spreads.map(s => `<button type="button" class="rn-sp" data-id="${s.id}"><b>${esc(s.name)}</b><small>${s.cards} ${s.cards === 1 ? 'карта' : 'карты'} · ${esc(s.deck)}</small></button>`).join('')}</div>
      <details><summary class="be-note">Как настроиться перед раскладом</summary><ul class="rn-how">${D.prep.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
      <details><summary class="be-note">Все карты колоды</summary>${D.cards.map(c => cardHtml(c)).join('')}</details></section>`;
    box.querySelectorAll('.rn-sp').forEach(b => b.onclick = () => { st = { sp: b.dataset.id, picks: [], cur: 0 }; save(); draw(box); });
  }

  const save = () => ls.set({ sp: st.sp, picks: st.picks });

  function cardHtml(c, pos) {
    const at = [['Знак', c.z], ['Тотем', c.tot], ['Цвет', c.col], ['Кристалл', c.cr], ['Стихия', c.el], ['Планета', c.pl], ['Бог', c.god]].filter(x => x[1]);
    return `<article class="rn-card">${pos ? `<div class="rn-pos">${esc(pos.i)}. ${esc(pos.name)}</div><p class="be-note" style="margin:2px 0 10px">${esc(pos.about)}</p>` : ''}
      <h3><span class="rn-g" style="display:inline;font-size:1.3em">${esc(c.g)}</span> ${c.n}. ${esc(c.ru)} <small style="opacity:.6;font-weight:400">${esc(c.name)}</small></h3>
      <p class="rn-kw">${esc(c.kw)}</p>
      <div class="rn-attrs"><span>🎁 Дар: ${esc(c.gift)}</span><span>⚔️ Вызов: ${esc(c.ch)}</span>${at.map(([k, v]) => `<span>${k}: ${esc(v)}</span>`).join('')}</div>
      <div class="rn-qa"><div><b>Вопрос себе</b><br>${esc(c.q)}</div><div><b>Аффирмация</b><br>«${esc(c.a)}»</div></div>
      <div class="rn-t">${c.t.split('\n').map(p => `<p>${esc(p)}</p>`).join('')}</div></article>`;
  }

  // общее толкование: что выпало на каждом месте, стихии, руны/боги, дары и вызовы, аффирмации
  function reading(sp) {
    const cs = st.picks.map(card);
    const els = {}; cs.forEach(c => String(c.el || '').split(/,\s*/).forEach(e => { if (e) els[e] = (els[e] || 0) + 1; }));
    const elTxt = Object.entries(els).sort((a, b) => b[1] - a[1]);
    const EL = { 'Огонь': 'действие, страсть, движение', 'Вода': 'чувства, интуиция, исцеление', 'Земля': 'практичность, тело, опора', 'Воздух': 'мысли, слова, общение', 'Все': 'целостность' };
    const top = elTxt[0] && elTxt[0][1] > 1 && elTxt[0][0] !== 'Все' && !(elTxt[1] && elTxt[1][1] === elTxt[0][1]) ? `Больше всего стихии «${elTxt[0][0]}» (${elTxt[0][1]} из ${cs.length}) — в вопросе важны ${EL[elTxt[0][0]] || ''}.` : '';
    const gods = cs.filter(isGod).length;
    const godTxt = cs.length > 1 ? (gods === 0 ? 'Только руны — ответ о вашей собственной энергии и поступках.' : gods === cs.length ? 'Только боги — сильные внешние силы и архетипы, история больше вас самих.' : `Богов ${gods} из ${cs.length}: личная энергия переплетается с большими силами.`) : '';
    // покровитель: бог руны (c.god) или карта бога, встретившиеся в раскладе дважды и больше
    const gc = {}; cs.forEach(c => { const g = isGod(c) ? c.ru : c.god; if (g) gc[g] = (gc[g] || 0) + 1; });
    const patron = Object.entries(gc).filter(x => x[1] > 1).map(x => x[0]);
    return `<section class="rn-sum adm-box"><h2>✨ Общее по раскладу</h2>
      <ul>${sp.pos.map((p, i) => `<li><b>${esc(p.name)}</b> — ${esc(cs[i].ru)}: ${esc(cs[i].kw.toLowerCase())}. <span class="be-note">${esc(cs[i].q)}</span></li>`).join('')}</ul>
      ${top || godTxt || patron.length ? `<p>${[top, godTxt, patron.length ? `Повторяется покровитель: ${patron.map(esc).join(', ')} — эта энергия ведёт весь расклад.` : ''].filter(Boolean).join(' ')}</p>` : ''}
      ${cs.length > 1 ? `<p><b>Что поможет:</b> ${cs.map(c => esc(c.gift.toLowerCase())).join(' · ')}<br><b>Чего остерегаться:</b> ${cs.map(c => esc(c.ch.toLowerCase())).join(' · ')}</p>` : ''}
      <p><b>Аффирмации расклада:</b> ${cs.map(c => `«${esc(c.a)}»`).join(' ')}</p>
      <p class="be-note">Значения не абсолютны — читайте их в свете своего вопроса и прислушайтесь, что откликается в теле.</p></section>
      ${cs.map((c, i) => cardHtml(c, { i: i + 1, ...sp.pos[i] })).join('')}`;
  }

  window.PPRunesAdmin = { mount };
})();
