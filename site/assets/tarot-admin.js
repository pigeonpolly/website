// Кабинет → «🃏 Таро» (только админ; admin.js открывает PPTarotAdmin.mount(main)). «Таро кошек», устроено как runes-admin.js:
// 1) выбрать расклад → 2) как его делать + какие карты выпали (по позициям, прямо/перевёрнуто) → 3) значение каждой карты и общее по раскладу.
// Данные — GET /api/admin/tarot (worker/tarot.js, worker/tarot-data.js). Ничего не сохраняется, кроме последнего расклада в localStorage.
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
  .tr-g{font-size:1.6em;line-height:1.2;display:block;min-height:1.2em;font-weight:700}
  .tr-g.rev{transform:rotate(180deg)}
  .tr-flip{margin-top:8px;font:inherit;font-size:.8em;padding:3px 10px;border-radius:99px;border:1px solid #E8E4E2;background:#F4EFEA;color:#2B1A51;cursor:pointer}
  .tr-flip[aria-pressed="true"]{background:#2B1A51;color:#fff;border-color:#2B1A51}
  .tr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;margin:8px 0 16px}
  .tr-c{padding:8px 4px;border-radius:12px;border:1px solid #E8E4E2;background:#fff;cursor:pointer;font:inherit;color:#2B1A51;font-size:.85em}
  .tr-c:hover:not(:disabled){border-color:#E9A93B}
  .tr-c:disabled{opacity:.35;cursor:default}
  .tr-c .tr-g{font-size:1.2em}
  .tr-card{padding:16px;border-radius:16px;border:1px solid #E8E4E2;background:#fff;color:#2B1A51;margin:14px 0}
  .tr-card h3{margin:0 0 4px}
  .tr-kw{opacity:.8;margin:0 0 10px}
  .tr-attrs{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;font-size:.85em}
  .tr-attrs span{padding:3px 9px;border-radius:99px;background:#F4EFEA}
  .tr-t p{margin:8px 0;line-height:1.55}
  .tr-side{font-size:.8em;font-weight:700;margin:12px 0 0;opacity:.7}
  .tr-other{opacity:.7}
  .tr-pos{font-size:.8em;text-transform:uppercase;letter-spacing:.06em;color:#b9771a;font-weight:700}
  .tr-sum{background:#fff;color:#2B1A51;padding:16px;border-radius:16px;border:2px solid #E9A93B;margin:14px 0}
  .tr-sum ul{margin:6px 0 6px 20px;padding:0}
  .tr-sum li{margin:5px 0;line-height:1.5}
  @media (max-width:600px){.tr-slot{max-width:none}}`;

  const SUITS = [['wands', 'Жезлы', 'Огонь'], ['cups', 'Кубки', 'Вода'], ['swords', 'Мечи', 'Воздух'], ['pent', 'Пентакли', 'Земля']];
  const EL = { 'Огонь': 'действие, страсть, творчество', 'Вода': 'чувства, отношения, интуиция', 'Воздух': 'мысли, решения, конфликты', 'Земля': 'деньги, работа, тело, быт' };
  const RANK = { 1: 'Туз', 11: 'Паж', 12: 'Рыцарь', 13: 'Королева', 14: 'Король' };

  let D = null, st = { sp: null, picks: [], rev: [], cur: 0 };
  const card = n => D.cards.find(c => c.n === n);
  const picked = i => st.picks[i] !== undefined && st.picks[i] !== null && st.picks[i] >= 0;

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

  const nCards = k => `${k} ${k === 1 ? 'карта' : k < 5 ? 'карты' : 'карт'}`;

  function draw(box) {
    const sp = D.spreads.find(s => s.id === st.sp);
    if (!sp) return drawChoose(box);
    const full = sp.pos.every((_, i) => picked(i));
    box.innerHTML = `<section class="adm-box">
      <p><button type="button" class="pill-btn tr-back">← Другой расклад</button></p>
      <h2>🃏 ${esc(sp.name)}</h2>
      <p class="be-note">${nCards(sp.cards)} · вся колода, 78 карт</p>
      <h3>Как делать</h3>
      <ol class="tr-how">${sp.how.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
      <details><summary class="be-note">Перед раскладом — настроиться</summary><ul class="tr-how">${D.prep.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
      <h3>Какие карты выпали</h3>
      <p class="be-note">Нажмите на место, потом на карту. Повторное нажатие на выбранную карту — убрать. «↺ Перевёрнута» — если карта легла вверх ногами.</p>
      <div class="tr-slots">${sp.pos.map((p, i) => { const c = picked(i) && card(st.picks[i]); return `<div class="tr-slot${c ? ' on' : ''}${i === st.cur ? ' cur' : ''}">
        <button type="button" class="tr-pick" data-i="${i}"><span class="tr-pn">${i + 1}. ${esc(p.name)}</span><span class="tr-g${c && st.rev[i] ? ' rev' : ''}">${c ? esc(c.g) : '?'}</span>${c ? `<b>${esc(c.ru)}</b>` : '<span class="be-note">выбрать</span>'}</button>
        ${c ? `<button type="button" class="tr-flip" data-i="${i}" aria-pressed="${st.rev[i] ? 'true' : 'false'}">↺ Перевёрнута</button>` : ''}</div>`; }).join('')}</div>
      ${grid('Старшие арканы', D.cards.filter(c => c.ar === 'major'))}
      ${SUITS.map(([id, name, el]) => grid(`${name} · ${el}`, D.cards.filter(c => c.suit === id))).join('')}
      <p>${full ? '' : '<span class="be-note">Выберите все карты — появится толкование.</span>'} ${st.picks.some((_, i) => picked(i)) ? '<button type="button" class="pill-btn tr-clear">Очистить</button>' : ''}</p>
    </section>
    ${full ? reading(sp) : ''}`;
    box.querySelector('.tr-back').onclick = () => { st = { sp: null, picks: [], rev: [], cur: 0 }; save(); draw(box); };
    box.querySelectorAll('.tr-pick').forEach(b => b.onclick = () => { st.cur = +b.dataset.i; draw(box); });
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
      if (sp.pos.every((_, i) => picked(i))) { const r = box.querySelector('.tr-sum'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    const cl = box.querySelector('.tr-clear'); if (cl) cl.onclick = () => { st.picks = []; st.rev = []; st.cur = 0; save(); draw(box); };
  }

  function grid(title, list) {
    const used = new Set(st.picks.filter((n, i) => n >= 0 && n !== null && i !== st.cur));
    return `<p class="be-note" style="margin-bottom:0">${esc(title)}</p><div class="tr-grid">${list.map(c => `<button type="button" class="tr-c" data-n="${c.n}" ${used.has(c.n) ? 'disabled' : ''} title="${esc(c.kw)}"${st.picks[st.cur] === c.n ? ' style="border-color:#E9A93B;border-width:2px"' : ''}>
      <span class="tr-g">${esc(c.g)}</span>${esc(c.ru)}</button>`).join('')}</div>`;
  }

  function drawChoose(box) {
    box.innerHTML = `<section class="adm-box"><h2>🃏 Таро</h2>
      <p class="be-note">«Таро кошек»: 22 старших аркана и 56 младших (жезлы, кубки, мечи, пентакли). Выберите расклад — покажу, как его делать, потом отметите выпавшие карты и получите толкование.</p>
      <div class="tr-spreads">${D.spreads.map(s => `<button type="button" class="tr-sp" data-id="${s.id}"><b>${esc(s.name)}</b><small>${nCards(s.cards)}</small></button>`).join('')}</div>
      <details><summary class="be-note">Как настроиться перед раскладом</summary><ul class="tr-how">${D.prep.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
      <details><summary class="be-note">Все карты колоды</summary>${D.cards.map(c => cardHtml(c)).join('')}</details></section>`;
    box.querySelectorAll('.tr-sp').forEach(b => b.onclick = () => { st = { sp: b.dataset.id, picks: [], rev: [], cur: 0 }; save(); draw(box); });
  }

  const save = () => ls.set({ sp: st.sp, picks: st.picks, rev: st.rev });
  const paras = t => String(t || '').split('\n').map(p => `<p>${esc(p)}</p>`).join('');

  // карта: в раскладе — главное значение по положению, второе свернуто; в списке колоды — оба
  function cardHtml(c, pos) {
    const at = [c.ar === 'major' ? 'Старший аркан' : 'Младший аркан', c.suit && SUITS.find(s => s[0] === c.suit)[1], c.el && `Стихия: ${c.el}`].filter(Boolean);
    const rev = pos && pos.rev;
    const main = pos ? `<p class="tr-side">${rev ? '↺ ПЕРЕВЁРНУТАЯ' : '↑ ПРЯМАЯ'}</p><div class="tr-t">${paras(rev ? c.r : c.t)}</div>
      <details class="tr-other"><summary class="be-note">${rev ? 'Прямое значение' : 'Перевёрнутое значение'}</summary><div class="tr-t">${paras(rev ? c.t : c.r)}</div></details>`
      : `<p class="tr-side">↑ ПРЯМАЯ</p><div class="tr-t">${paras(c.t)}</div><p class="tr-side">↺ ПЕРЕВЁРНУТАЯ</p><div class="tr-t">${paras(c.r)}</div>`;
    return `<article class="tr-card">${pos ? `<div class="tr-pos">${esc(pos.i)}. ${esc(pos.name)}</div><p class="be-note" style="margin:2px 0 10px">${esc(pos.about)}</p>` : ''}
      <h3><span class="tr-g${rev ? ' rev' : ''}" style="display:inline-block;font-size:1em">${esc(c.g)}</span> ${esc(c.ru)} <small style="opacity:.6;font-weight:400">${esc(c.name)}</small></h3>
      <p class="tr-kw">${esc(c.kw)}</p>
      <div class="tr-attrs">${at.map(v => `<span>${esc(v)}</span>`).join('')}</div>${main}</article>`;
  }

  // общее толкование: что на каждом месте, старшие/младшие, масти и стихии, перевёрнутые, придворные, тузы, повтор достоинств
  function reading(sp) {
    const cs = st.picks.map(card), k = cs.length;
    const lines = [];
    if (k > 1) {
      const maj = cs.filter(c => c.ar === 'major').length;
      lines.push(maj === 0 ? 'Только младшие арканы — речь о повседневных делах, всё в ваших руках.'
        : maj * 2 > k ? `Старших арканов ${maj} из ${k} — важный, судьбоносный период: события больше вас самих, их стоит прожить, а не торопить.`
          : `Старших арканов ${maj} из ${k}: большие силы переплетаются с повседневными делами.`);
      const su = {}; cs.forEach(c => { if (c.suit) su[c.suit] = (su[c.suit] || 0) + 1; });
      const top = Object.entries(su).sort((a, b) => b[1] - a[1]);
      if (top[0] && top[0][1] > 1 && !(top[1] && top[1][1] === top[0][1])) { const s = SUITS.find(x => x[0] === top[0][0]); lines.push(`Больше всего мастей «${s[1]}» (${top[0][1]} из ${k}, стихия ${s[2]}) — в вопросе главное ${EL[s[2]]}.`); }
      const miss = SUITS.filter(s => !su[s[0]]);
      if (k >= 5 && miss.length && miss.length < 4) lines.push(`Нет ни одной карты масти ${miss.map(s => `«${s[1]}»`).join(', ')} — эта сторона жизни (${miss.map(s => EL[s[2]]).join('; ')}) сейчас в тени.`);
      const rv = st.rev.slice(0, k).filter(Boolean).length;
      if (rv) lines.push(rv * 2 > k ? `Перевёрнутых ${rv} из ${k} — много задержек и внутреннего сопротивления; ответ, скорее, внутри вас, чем снаружи.` : `Перевёрнутых ${rv} из ${k} — где-то энергия застряла или повёрнута внутрь.`);
      const court = cs.filter(c => c.rank > 10);
      if (court.length) lines.push(`Придворные карты (${court.map(c => esc(c.ru)).join(', ')}) — в ситуации важны люди или роли, которые вы сами примеряете.`);
      const aces = cs.filter(c => c.rank === 1);
      if (aces.length) lines.push(`${aces.length > 1 ? 'Несколько тузов' : 'Туз'} — начало чего-то нового.`);
      const rk = {}; cs.forEach(c => { if (c.rank) rk[c.rank] = (rk[c.rank] || 0) + 1; });
      Object.entries(rk).filter(x => x[1] > 1 && x[0] !== '1').forEach(([r, m]) => lines.push(`Повторяется достоинство «${RANK[r] || r}» (${m} раза) — эта тема звучит громче остальных.`));
    }
    return `<section class="tr-sum adm-box"><h2>✨ Общее по раскладу</h2>
      <ul>${sp.pos.map((p, i) => `<li><b>${esc(p.name)}</b> — ${esc(cs[i].ru)}${st.rev[i] ? ' (перевёрнута)' : ''}: ${esc(cs[i].kw.toLowerCase())}.</li>`).join('')}</ul>
      ${lines.length ? `<p>${lines.join(' ')}</p>` : ''}
      <p class="be-note">Значения не абсолютны — читайте их в свете своего вопроса и прислушайтесь, что откликается.</p></section>
      ${cs.map((c, i) => cardHtml(c, { i: i + 1, rev: !!st.rev[i], ...sp.pos[i] })).join('')}`;
  }

  window.PPTarotAdmin = { mount };
})();
