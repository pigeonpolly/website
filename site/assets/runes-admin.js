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
  .rn-q{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:12px;border:2px solid #E8E4E2;font:inherit;color:#2B1A51;background:#fff;resize:vertical;min-height:2.6em}
  .rn-q:focus{outline:none;border-color:#E9A93B}
  .rn-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:12px 0;padding:0;list-style:none;counter-reset:s}
  .rn-steps li{padding:10px 12px;border-radius:12px;background:#F4EFEA;counter-increment:s;line-height:1.45}
  .rn-steps li::before{content:counter(s);display:inline-grid;place-items:center;width:1.6em;height:1.6em;border-radius:50%;background:#E9A93B;color:#fff;font-weight:700;margin-right:6px}
  .rn-ans{list-style:none;margin:10px 0;padding:0}
  .rn-ans li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid #F0EBE7}
  .rn-ans li:first-child{border-top:0}
  .rn-ans .rn-g{font-size:1.8em;min-width:1.2em;text-align:center}
  .rn-ask{display:block;font-size:.85em;color:#b9771a;font-weight:700}
  .rn-do{padding:12px 14px;border-radius:12px;background:#FFF4DC;margin:12px 0;line-height:1.5}
  .rn-do b{display:block;margin-bottom:2px}
  .rn-plain{font-size:1.08em;line-height:1.5;margin:6px 0}
  .rn-card details,.rn-sum details{margin-top:10px}
  .rn-card summary,.rn-sum summary{cursor:pointer}
  @media (max-width:600px){.rn-slot{max-width:none}}`;

  let D = null, st = { sp: null, picks: [], cur: 0, q: '' };
  const card = n => D.cards.find(c => c.n === n);
  const isGod = c => c.n > 24;
  const allowed = sp => sp.id === 'track' ? D.cards.filter(c => !isGod(c)) : D.cards;

  function mount(main) {
    main.innerHTML = `<style>${CSS}</style><div class="rn-wrap"><p class="be-note">Загружаю колоду…</p></div>`;
    const box = main.querySelector('.rn-wrap');
    fetch('/api/admin/runes', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
      D = d;
      const last = ls.get();
      if (last && D.spreads.find(s => s.id === last.sp)) { st = { sp: last.sp, picks: last.picks || [], cur: 0, q: last.q || '' }; }
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
      <h3>Ваш вопрос</h3>
      <textarea class="rn-q" rows="2" maxlength="300" placeholder="Например: «Что будет, если я сменю работу?»">${esc(st.q)}</textarea>
      <p class="be-note" style="margin-top:4px">Необязательно, но так ответ будет понятнее: каждую строку толкования читайте как ответ именно на этот вопрос.</p>
      <h3>Какие карты выпали</h3>
      <p class="be-note">Нажмите на место, потом на карту. Повторное нажатие на выбранную карту — убрать.</p>
      <div class="rn-slots">${sp.pos.map((p, i) => { const c = st.picks[i] && card(st.picks[i]); return `<button type="button" class="rn-slot${c ? ' on' : ''}${i === st.cur ? ' cur' : ''}" data-i="${i}">
        <span class="rn-pn">${i + 1}. ${esc(p.name)}<br><small>${esc(p.ask)}</small></span><span class="rn-g">${c ? esc(c.g || '✦') : '?'}</span>${c ? `<b>${esc(c.ru)}</b>` : '<span class="be-note">выбрать</span>'}</button>`; }).join('')}</div>
      ${grid(sp, 'Руны', allowed(sp).filter(c => !isGod(c)))}
      ${sp.id === 'track' ? '' : grid(sp, 'Боги', allowed(sp).filter(isGod))}
      <p>${full ? '' : '<span class="be-note">Выберите все карты — появится толкование.</span>'} ${st.picks.some(Boolean) ? '<button type="button" class="pill-btn rn-clear">Очистить</button>' : ''}</p>
    </section>
    ${full ? reading(sp) : ''}`;
    box.querySelector('.rn-back').onclick = () => { st = { sp: null, picks: [], cur: 0, q: '' }; save(); draw(box); };
    const qa = box.querySelector('.rn-q'); qa.oninput = () => { st.q = qa.value; save(); const o = box.querySelector('.rn-myq'); if (o) o.textContent = st.q.trim() ? `«${st.q.trim()}»` : ''; };
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
    const cl = box.querySelector('.rn-clear'); if (cl) cl.onclick = () => { st.picks = []; st.cur = 0; st.q = ''; save(); draw(box); };
  }

  function grid(sp, title, list) {
    const used = new Set(st.picks.filter((n, i) => n && i !== st.cur));
    return `<p class="be-note" style="margin-bottom:0">${title}</p><div class="rn-grid">${list.map(c => `<button type="button" class="rn-c" data-n="${c.n}" ${used.has(c.n) ? 'disabled' : ''} title="${esc(c.kw)}"${st.picks[st.cur] === c.n ? ' style="border-color:#E9A93B;border-width:2px"' : ''}>
      <span class="rn-g">${esc(c.g || '✦')}</span>${c.n}. ${esc(c.ru)}</button>`).join('')}</div>`;
  }

  function drawChoose(box) {
    box.innerHTML = `<section class="adm-box"><h2>🔮 Руны</h2>
      <p class="be-note">Колода «Runic Oracle»: 24 руны и 20 карт богов.</p>
      <ol class="rn-steps"><li>Выберите расклад и запишите вопрос.</li><li>Вытяните карты из настоящей колоды и отметьте их здесь.</li><li>Прочитайте ответ простыми словами и выберите один шаг.</li></ol>
      <p class="be-note">Не знаете, какой расклад? Начните с «Одной карты».</p>
      <div class="rn-spreads">${D.spreads.map(s => `<button type="button" class="rn-sp" data-id="${s.id}"><b>${esc(s.name)}</b><small>${s.cards} ${s.cards === 1 ? 'карта' : 'карты'} · ${esc(s.deck)}</small></button>`).join('')}</div>
      <details><summary class="be-note">Как настроиться перед раскладом</summary><ul class="rn-how">${D.prep.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
      <details><summary class="be-note">Все карты колоды</summary>${D.cards.map(c => cardHtml(c)).join('')}</details></section>`;
    box.querySelectorAll('.rn-sp').forEach(b => b.onclick = () => { st = { sp: b.dataset.id, picks: [], cur: 0, q: '' }; save(); draw(box); });
  }

  const save = () => ls.set({ sp: st.sp, picks: st.picks, q: st.q });

  function cardHtml(c, pos) {
    const at = [['Знак', c.z], ['Тотем', c.tot], ['Цвет', c.col], ['Кристалл', c.cr], ['Стихия', c.el], ['Планета', c.pl], ['Бог', c.god]].filter(x => x[1]);
    return `<article class="rn-card">${pos ? `<div class="rn-pos">${esc(pos.i)}. ${esc(pos.name)} — ${esc(pos.ask)}</div>` : ''}
      <h3><span class="rn-g" style="display:inline;font-size:1.3em">${esc(c.g)}</span> ${c.n}. ${esc(c.ru)} <small style="opacity:.6;font-weight:400">${esc(c.name)}</small></h3>
      <p class="rn-kw">${esc(c.kw)}</p>
      <p class="rn-plain">${esc(c.s)}</p>
      <div class="rn-do"><b>👣 Что сделать</b>${esc(c.do)}</div>
      <div class="rn-qa"><div><b>Спросите себя</b><br>${esc(c.q)}</div><div><b>Скажите себе</b><br>«${esc(c.a)}»</div></div>
      <details><summary class="be-note">Подробнее: полное толкование и символы</summary>
        <div class="rn-attrs"><span>🎁 Помогает: ${esc(c.gift)}</span><span>⚔️ Мешает: ${esc(c.ch)}</span>${at.map(([k, v]) => `<span>${k}: ${esc(v)}</span>`).join('')}</div>
        ${pos ? `<p class="be-note">Это место расклада: ${esc(pos.about)}</p>` : ''}
        <div class="rn-t">${c.t.split('\n').map(p => `<p>${esc(p)}</p>`).join('')}</div></details></article>`;
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
    const ai = Math.max(0, sp.pos.findIndex(p => p.act)), act = cs[ai];
    const extra = [top, godTxt, patron.length ? `Повторяется покровитель: ${patron.map(esc).join(', ')} — эта энергия ведёт весь расклад.` : ''].filter(Boolean);
    return `<section class="rn-sum adm-box"><h2>✨ Ответ простыми словами</h2>
      <p class="rn-myq" style="font-style:italic;margin:0 0 4px">${st.q.trim() ? `«${esc(st.q.trim())}»` : ''}</p>
      <ul class="rn-ans">${sp.pos.map((p, i) => `<li><span class="rn-g">${esc(cs[i].g || '✦')}</span><div><span class="rn-ask">${esc(p.ask)}</span><b>${esc(cs[i].ru)}:</b> ${esc(cs[i].s)}</div></li>`).join('')}</ul>
      <div class="rn-do"><b>👣 Главный шаг${cs.length > 1 ? ` (карта «${esc(act.ru)}», место «${esc(sp.pos[ai].name)}»)` : ''}</b>${esc(act.do)}</div>
      <p><b>Как пользоваться:</b> прочитайте строки выше как ответ на свой вопрос; что откликается — важно, что нет — пропустите. Сделайте главный шаг в ближайшие 1–3 дня, а через неделю вернитесь и посмотрите, что изменилось.</p>
      <details><summary class="be-note">Ещё по раскладу: помогает, мешает, аффирмации</summary>
        ${extra.length ? `<p>${extra.join(' ')}</p>` : ''}
        <p><b>Что поможет:</b> ${cs.map(c => esc(c.gift.toLowerCase())).join(' · ')}<br><b>Чего остерегаться:</b> ${cs.map(c => esc(c.ch.toLowerCase())).join(' · ')}</p>
        <p><b>Аффирмации:</b> ${cs.map(c => `«${esc(c.a)}»`).join(' ')}</p></details></section>
      <h3>Каждая карта отдельно</h3>
      ${cs.map((c, i) => cardHtml(c, { i: i + 1, ...sp.pos[i] })).join('')}`;
  }

  window.PPRunesAdmin = { mount };
})();
