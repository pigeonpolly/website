// /draw/ «Things to draw» (docs/palettes.md → Pinterest «Топ-форматы 2.0»): полные версии пинов-тизеров №945–1084 из site/assets/draw.json (tools/pins/pins16.js).
// Виды: prompts (темы на N дней), bingo, pal (палитра по детали), palch (палитра-челлендж), steps (4 шага), ispy (найди детали), diff (найди отличия), dtiys (контур).
// Ссылка ?f=p<номер пина> — фильтр под вид, подсветка и сразу окно. Печать — только окно (@media print в draw.css).
(() => {
  const g = document.getElementById('dr-g'); if (!g) return;
  const lang = document.documentElement.lang || 'en', L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const tr = a => a[L];
  const K = {
    prompts: ['Drawing prompts', 'Темы для рисования', 'Zīmēšanas tēmas'], bingo: ['Drawing bingo', 'Бинго для рисования', 'Zīmēšanas bingo'],
    pal: ['Palettes', 'Палитры', 'Paletes'], palch: ['Palette challenges', 'Палитра-челлендж', 'Paletes izaicinājumi'],
    steps: ['Step by step', 'По шагам', 'Soli pa solim'], ispy: ['Find the details', 'Найди детали', 'Atrodi detaļas'],
    diff: ['Spot the difference', 'Найди отличия', 'Atrodi atšķirības'], dtiys: ['Draw in your style', 'Нарисуй по-своему', 'Uzzīmē savā stilā'],
  };
  const T = {
    typ: ['Type', 'Вид', 'Veids'], all: ['All', 'Всё', 'Viss'], x: ['Close', 'Закрыть', 'Aizvērt'], print: ['Print', 'Распечатать', 'Drukāt'],
    days: n => [`${n} days`, `${n} дней`, `${n} dienas`][L], open: ['Open →', 'Открыть →', 'Atvērt →'],
    copy: ['Click a color to copy its HEX', 'Нажмите на цвет — HEX скопируется', 'Noklikšķini uz krāsas, lai kopētu HEX'], copied: ['Copied', 'Скопировано', 'Nokopēts'],
    copyAll: ['Copy all HEX', 'Скопировать все HEX', 'Kopēt visus HEX'], only: ['Paint these with only these six colors:', 'Нарисуйте это только этими шестью цветами:', 'Uzzīmē to tikai ar šīm sešām krāsām:'],
    step: ['Step', 'Шаг', 'Solis'], caps: [['Light pencil shapes', 'Ink the main lines', 'First pale wash', 'Darks & details'], ['Лёгкий карандаш', 'Главные линии тушью', 'Первая светлая заливка', 'Тени и детали'], ['Viegls zīmulis', 'Galvenās līnijas ar tušu', 'Pirmais gaišais slānis', 'Ēnas un detaļas']][L],
    tip: ['My tip', 'Совет', 'Padoms'], show: ['Show answers', 'Показать ответы', 'Rādīt atbildes'], hide: ['Hide answers', 'Скрыть ответы', 'Slēpt atbildes'],
    find: ['Find these 5 details in the picture:', 'Найдите эти 5 деталей на картинке:', 'Atrodi šīs 5 detaļas attēlā:'], two: ['Top: the original. Bottom: 5 differences.', 'Сверху — оригинал, снизу — 5 отличий.', 'Augšā — oriģināls, apakšā — 5 atšķirības.'],
    dl: ['Download the line art (PNG)', 'Скачать контур (PNG)', 'Lejupielādēt kontūru (PNG)'], orig: ['The original', 'Оригинал', 'Oriģināls'],
    redraw: ['Print it or trace it, then make it yours: new style, new colors, new season.', 'Распечатайте или обведите — и сделайте по-своему: новый стиль, цвета, время года.', 'Izdrukā vai apvelc — un padari to savu: jauns stils, krāsas, gadalaiks.'],
    bingo: ['Draw a thing, tap its square. A full line wins; the whole card is a legend.', 'Нарисовали — нажмите клетку. Целая линия — победа, вся карточка — легенда.', 'Uzzīmēji — pieskaries rūtiņai. Pilna līnija — uzvara, visa kartīte — leģenda.'],
    free: ['FREE: draw Polly', 'СВОБОДНО: нарисуйте Полли', 'BRĪVS: uzzīmē Polliju'], daily: ['One a day, ten minutes is enough.', 'По одной в день — хватит десяти минут.', 'Pa vienai dienā — pietiek ar desmit minūtēm.'],
    use: ['Free for personal use.', 'Бесплатно для личного пользования.', 'Bez maksas personīgai lietošanai.'],
    none: ['Could not load the list. Please refresh the page.', 'Не удалось загрузить список. Обновите страницу.', 'Neizdevās ielādēt sarakstu. Atsvaidzini lapu.'],
  };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const thumb = x => x.img || (x.steps && x.steps[3]) || (x.ab && x.ab[0]) || x.line;
  const sub = x => x.k === 'prompts' ? T.days(x.items.length) : x.k === 'bingo' ? '5 × 5' : x.k === 'pal' || x.k === 'palch' ? x.cols.map(c => `<i style="background:${c.hex}"></i>`).join('') : x.k === 'steps' ? `4 ${tr(['steps', 'шага', 'soļi'])}` : '';
  const store = { get: k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  fetch('/assets/draw.json').then(r => r.json()).then(D => {
    const kinds = Object.keys(K).filter(k => D.some(x => x.k === k));
    g.innerHTML = D.map(x => `<a class="vc dr-c k-${x.k}" href="?f=${x.id}" data-id="${x.id}" data-k="${x.k}"><span class="tp">${esc(tr(K[x.k]))}</span><span class="th"><img src="${esc(thumb(x))}" alt="" loading="lazy"></span><span class="tx"><b>${esc(x.t)}</b><small>${sub(x)}</small><span class="go">${T.open[L]}</span></span></a>`).join('');
    const st = { k: 'all' };
    g.insertAdjacentHTML('beforebegin', `<div class="flt"><div class="flt-g" role="group" aria-label="${T.typ[L]}"><span class="flt-l">${T.typ[L]}</span>${[['all', T.all[L]], ...kinds.map(k => [k, tr(K[k])])].map(([v, n]) => `<button type="button" data-k="${v}">${esc(n)} <i>${v === 'all' ? D.length : D.filter(x => x.k === v).length}</i></button>`).join('')}</div></div>`);
    const bar = g.previousElementSibling, cards = [...g.querySelectorAll('.dr-c')];
    const apply = () => { cards.forEach(c => { c.hidden = st.k !== 'all' && c.dataset.k !== st.k; }); bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === st.k)); };
    bar.addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (b) { st.k = b.dataset.k; apply(); } }); apply();

    const swatches = x => `<p class="dr-h">${T.copy[L]}</p><div class="dr-sw">${x.cols.map(c => `<button type="button" data-hex="${c.hex}"><i style="background:${c.hex}"></i><b>${esc(c.n[L] || c.n[0])}</b><code>${c.hex}</code></button>`).join('')}</div><button type="button" class="btn dr-all">${T.copyAll[L]}</button>`;
    const circles = (pts, on) => pts.map(([x, y, r], i) => `<span class="dr-ring" style="left:${x * 100}%;top:${y * 100}%;width:${(r || .09) * 200}%;"${on ? '' : ' hidden'}><b>${i + 1}</b></span>`).join('');
    const body = x => {
      if (x.k === 'prompts') return `<img class="dr-art" src="${esc(x.img)}" alt=""><p class="colbox-k">${esc(x.kick || '')}</p><h3>${esc(x.t)}</h3><p class="dr-h">${T.daily[L]}</p><ol class="dr-ol">${x.items.map(q => `<li>${esc(q)}</li>`).join('')}</ol>`;
      if (x.k === 'bingo') { const cells = [...x.items.slice(0, 12), null, ...x.items.slice(12)], done = store.get('pp-bingo-' + x.id) || [];
        return `<h3>${esc(x.t)}</h3><p class="dr-h">${T.bingo[L]}</p><div class="dr-bingo">${cells.map((q, i) => `<button type="button" data-i="${i}" class="${q === null ? 'fr' : ''}${done.includes(i) ? ' on' : ''}">${q === null ? T.free[L] : esc(q)}</button>`).join('')}</div>`; }
      if (x.k === 'pal') return `<img class="dr-art" src="${esc(x.img)}" alt=""><p class="colbox-k">${tr(K.pal)}</p><h3>${esc(x.t)}</h3>${x.mood ? `<p class="dr-h">${esc(x.mood)}</p>` : ''}${swatches(x)}`;
      if (x.k === 'palch') return `<img class="dr-art" src="${esc(x.img)}" alt=""><h3>${esc(x.t)}</h3>${swatches(x)}<p class="dr-h">${T.only[L]}</p><ol class="dr-ol one">${x.items.map(q => `<li>${esc(q)}</li>`).join('')}</ol>`;
      if (x.k === 'steps') return `<p class="colbox-k">${tr(K.steps)}</p><h3>${esc(x.t)}</h3><div class="dr-steps">${x.steps.map((s, i) => `<figure><img src="${esc(s)}" alt="${T.step[L]} ${i + 1}"><figcaption><b>${i + 1}</b>${T.caps[i]}</figcaption></figure>`).join('')}</div>${x.tip ? `<p class="dr-tip"><b>${T.tip[L]}:</b> ${esc(x.tip)}.</p>` : ''}`;
      if (x.k === 'ispy') return `<h3>${tr(K.ispy)}</h3><p class="dr-h">${T.find[L]}</p><div class="dr-pic"><img src="${esc(x.img)}" alt="">${circles(x.pts.map(([a, b]) => [a, b, .08]))}</div><button type="button" class="btn dr-ans">${T.show[L]}</button>`;
      if (x.k === 'diff') return `<h3>${tr(K.diff)}</h3><p class="dr-h">${T.two[L]}</p><div class="dr-pic"><img src="${esc(x.ab[0])}" alt=""></div><div class="dr-pic"><img src="${esc(x.ab[1])}" alt="">${circles(x.spots)}</div><button type="button" class="btn dr-ans">${T.show[L]}</button>`;
      if (x.k === 'dtiys') return `<p class="colbox-k">${tr(K.dtiys)}</p><h3>${esc(x.t)}</h3><p class="dr-h">${T.redraw[L]}</p><img class="dr-line" src="${esc(x.line)}" alt=""><a class="btn pri" href="${esc(x.line)}" download="pigeonpolly-${x.id}-line-art.png">⬇ ${T.dl[L]}</a><p class="dr-h">${T.orig[L]}:</p><img class="dr-art sm" src="${esc(x.img)}" alt="">`;
      return '';
    };
    const box = x => {
      const bx = document.createElement('div'); bx.className = 'colbox dr-box'; bx.setAttribute('role', 'dialog'); bx.setAttribute('aria-label', x.t);
      bx.innerHTML = `<div class="colbox-in"><button type="button" class="colbox-x" aria-label="${T.x[L]}">×</button>${body(x)}<div class="dr-act"><button type="button" class="btn dr-pr">🖨 ${T.print[L]}</button></div><p class="dr-use">${T.use[L]} · pigeonpolly.com</p></div>`;
      document.body.appendChild(bx); document.body.classList.add('dr-printing');
      bx.addEventListener('click', e => {
        const sw = e.target.closest('.dr-sw button');
        if (sw) { navigator.clipboard?.writeText(sw.dataset.hex).catch(() => { }); const c = sw.querySelector('code'); c.textContent = T.copied[L]; setTimeout(() => { c.textContent = sw.dataset.hex; }, 1100); return; }
        if (e.target.closest('.dr-all')) { navigator.clipboard?.writeText(x.cols.map(c => c.hex).join(', ')).catch(() => { }); e.target.textContent = '✓ ' + T.copied[L]; return; }
        const ans = e.target.closest('.dr-ans');
        if (ans) { const rs = bx.querySelectorAll('.dr-ring'), on = rs[0] && rs[0].hidden; rs.forEach(r => { r.hidden = !on; }); ans.textContent = on ? T.hide[L] : T.show[L]; return; }
        const bi = e.target.closest('.dr-bingo button');
        if (bi) { bi.classList.toggle('on'); store.set('pp-bingo-' + x.id, [...bx.querySelectorAll('.dr-bingo button.on')].map(b => +b.dataset.i)); return; }
        if (e.target.closest('.dr-pr')) { window.print(); return; }
        if (e.target === bx || e.target.closest('.colbox-x')) close();
      });
      const close = () => { bx.remove(); document.body.classList.remove('dr-printing'); document.removeEventListener('keydown', key); if (location.search) history.replaceState(null, '', location.pathname); };
      const key = e => { if (e.key === 'Escape') close(); };
      document.addEventListener('keydown', key);
    };
    g.addEventListener('click', e => { const a = e.target.closest('.dr-c'); if (!a) return; e.preventDefault(); history.replaceState(null, '', '?f=' + a.dataset.id); box(D.find(x => x.id === a.dataset.id)); });
    const q = new URLSearchParams(location.search), x = D.find(v => v.id === q.get('f'));
    if (x) { st.k = x.k; apply(); const c = g.querySelector(`[data-id="${x.id}"]`); if (c) { c.classList.add('hl'); setTimeout(() => c.scrollIntoView({ block: 'center' }), 60); } box(x); }
  }).catch(() => { g.innerHTML = `<p class="flt-empty">${T.none[L]}</p>`; });
})();
