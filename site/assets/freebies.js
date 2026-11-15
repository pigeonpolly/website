// /freebies/ (docs/freebies.md): календари и заставки из site/assets/freebies.json (tools/pins/cal.js).
// Фильтр как на /learn/: Вид · Неделя (с понедельника — EU, с воскресенья — US) · Год. Ссылка ?f=<id>&d=<дизайн> — сразу окно «Скачать».
(() => {
  const g = document.getElementById('fb-g'); if (!g) return;
  const lang = document.documentElement.lang || 'en', L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const T = {
    typ: ['Type', 'Вид', 'Veids'], all: ['All', 'Всё', 'Viss'], cal: ['Calendars', 'Календари', 'Kalendāri'], wall: ['Phone wallpapers', 'Заставки на телефон', 'Tālruņa fona attēli'],
    wk: ['Week starts', 'Неделя с', 'Nedēļa sākas'], mon: ['Monday start · EU', 'С понедельника · EU', 'No pirmdienas · EU'], sun: ['Sunday start · US', 'С воскресенья · US', 'No svētdienas · US'],
    per: ['Calendar', 'Календарь', 'Kalendārs'], allP: ['Month & year', 'Месяц и год', 'Mēnesis un gads'], pM: ['Monthly', 'На месяц', 'Mēneša'], pY: ['Yearly', 'На год', 'Gada'],
    yr: ['Year', 'Год', 'Gads'], rs: ['Reset filters', 'Сбросить фильтры', 'Notīrīt filtrus'], ally: ['All years', 'Все годы', 'Visi gadi'],
    tpC: ['Calendar', 'Календарь', 'Kalendārs'], tpY: ['Whole year', 'Весь год', 'Viss gads'], tpW: ['Wallpaper', 'Заставка', 'Fona attēls'], free: ['Free', 'Бесплатно', 'Bez maksas'],
    monS: ['Week starts on Monday', 'Неделя с понедельника', 'Nedēļa sākas pirmdienā'], sunS: ['Week starts on Sunday', 'Неделя с воскресенья', 'Nedēļa sākas svētdienā'],
    d3: n => [`${n} designs`, `${n} дизайна`, `${n} dizaini`][L], dl: ['Download', 'Скачать', 'Lejupielādēt'], open: ['Choose & download →', 'Выбрать и скачать →', 'Izvēlēties un lejupielādēt →'],
    year: y => [`${y}: the whole year`, `${y}: весь год`, `${y}: viss gads`][L], phone: ['For your phone · 1179×2556', 'Для телефона · 1179×2556', 'Tālrunim · 1179×2556'],
    hi: ['High resolution · 1600×2400 JPG · print or use as a background', 'Высокое разрешение · 1600×2400 JPG · печать или фон', 'Augsta izšķirtspēja · 1600×2400 JPG · drukai vai fonam'],
    use: ['Free for personal use. Please don’t sell or reupload it.', 'Бесплатно для личного пользования. Пожалуйста, не продавайте и не выкладывайте как своё.', 'Bez maksas personīgai lietošanai. Lūdzu, nepārdodiet un nepublicējiet kā savu.'],
    art: ['Art', 'Арт', 'Māksla'], des: ['Design', 'Дизайн', 'Dizains'], x: ['Close', 'Закрыть', 'Aizvērt'], none: ['Nothing here yet — try another filter.', 'Здесь пока пусто — попробуйте другой фильтр.', 'Šeit vēl nekā nav — izmēģini citu filtru.'],
  };
  const MON = [['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris']][L];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const DN = ['Night', 'Paper', 'Arch'];
  fetch('/assets/freebies.json').then(r => r.json()).then(D => {
    const items = [...(D.year || []).map(x => ({ ...x, k: 'cal', yr: 1 })), ...(D.cal || []).map(x => ({ ...x, k: 'cal' })), ...(D.wall || []).map(x => ({ ...x, k: 'wall' }))];
    const name = x => x.k === 'wall' ? x.t[L] : x.yr ? T.year(x.y) : `${MON[x.m - 1]} ${x.y}`;
    const card = x => `<a class="vc fb-c ${x.k}${x.yr ? ' yr' : ''}" href="#${esc(x.id)}" data-id="${esc(x.id)}" data-c="${x.k}"${x.k === 'cal' ? ` data-p="${x.yr ? 'year' : 'month'}"` : ''}${x.w ? ` data-w="${x.w}"` : ''}${x.y ? ` data-y="${x.y}"` : ''}>`
      + `<span class="tp">${x.k === 'wall' ? T.tpW[L] : x.yr ? T.tpY[L] : T.tpC[L]}</span><span class="th">${x.k === 'wall' ? `<img src="${esc(x.th)}" alt="" loading="lazy">` : x.d.map((d, i) => `<img src="${esc(d.th)}" alt="" loading="lazy" class="d${i + 1}">`).join('')}<span class="bd">${T.free[L]}</span></span>`
      + `<span class="tx"><b>${esc(name(x))}</b><small>${x.k === 'wall' ? T.phone[L] : `${x.w === 'sun' ? T.sunS[L] : T.monS[L]} · ${T.d3(x.d.length)}`}</small><span class="go">${x.k === 'wall' ? T.dl[L] + ' →' : T.open[L]}</span></span></a>`;
    g.innerHTML = items.map(card).join('');
    const more = document.querySelector('.fb-more'); if (more) g.appendChild(more);
    // фильтр: неделя по умолчанию — по языку браузера (en-US, en-CA… → воскресенье), «Любая» тоже есть
    const years = [...new Set(items.filter(x => x.y).map(x => x.y))].sort();
    const sunLoc = /-(US|CA|MX|BR|JP|PH|IL)$/i.test(navigator.language || '');
    const DEF = { c: 'all', p: 'all', w: sunLoc ? 'sun' : 'mon', y: 'all' }, st = { ...DEF };
    const grp = (k, lb, F) => `<div class="flt-g" role="group" aria-label="${lb}" data-gr="${k}"><span class="flt-l">${lb}</span>${F.map(([v, n]) => `<button type="button" data-g="${k}" data-k="${v}">${n} <i></i></button>`).join('')}</div>`;
    g.insertAdjacentHTML('beforebegin', `<div class="flt">${grp('c', T.typ[L], [['all', T.all[L]], ['cal', T.cal[L]], ['wall', T.wall[L]]])}${grp('p', T.per[L], [['all', T.allP[L]], ['month', T.pM[L]], ['year', T.pY[L]]])}${grp('w', T.wk[L], [['mon', T.mon[L]], ['sun', T.sun[L]]])}`
      + (years.length ? grp('y', T.yr[L], [['all', T.ally[L]], ...years.map(y => [String(y), y])]) : '') + `<button type="button" class="fb-rs" hidden>✕ ${T.rs[L]}</button></div>`);
    g.insertAdjacentHTML('afterend', `<p class="flt-empty" hidden>${T.none[L]}</p>`);
    const bar = g.previousElementSibling, emp = g.nextElementSibling, cards = [...g.querySelectorAll('.fb-c')];
    const fits = (c, s) => (s.c === 'all' || c.dataset.c === s.c) && !(c.dataset.c === 'wall' && s.p !== 'all') && (c.dataset.c !== 'cal' || ((s.p === 'all' || c.dataset.p === s.p) && (s.w === 'all' || c.dataset.w === s.w) && (s.y === 'all' || c.dataset.y === s.y)));
    const apply = () => {
      let n = 0; cards.forEach(c => { c.hidden = !fits(c, st); if (!c.hidden) n++; });
      bar.querySelectorAll('button[data-g]').forEach(b => { b.setAttribute('aria-pressed', st[b.dataset.g] === b.dataset.k ? 'true' : 'false');
        b.querySelector('i').textContent = cards.filter(c => fits(c, { ...st, [b.dataset.g]: b.dataset.k })).length; });
      bar.querySelectorAll('[data-gr=p],[data-gr=w],[data-gr=y]').forEach(x => { x.hidden = st.c === 'wall'; });
      emp.hidden = !!n;
      bar.querySelector('.fb-rs').hidden = Object.keys(DEF).every(k => st[k] === DEF[k]);
    };
    bar.addEventListener('click', e => {
      if (e.target.closest('.fb-rs')) { Object.assign(st, DEF); apply(); return; }
      const b = e.target.closest('button[data-g]'); if (!b) return;
      // вид сбрасывает остальные фильтры; фильтр календаря при «заставках» переключает вид на календари
      if (b.dataset.g === 'c') Object.assign(st, DEF, { c: b.dataset.k });
      else { st[b.dataset.g] = b.dataset.k; if (st.c === 'wall') st.c = 'cal'; }
      apply();
    });
    apply();
    // окно: превью, выбор из 3 дизайнов, «Скачать»
    const box = (x, d = 1) => {
      const bx = document.createElement('div'); bx.className = 'colbox fb-box'; bx.setAttribute('role', 'dialog'); bx.setAttribute('aria-label', name(x));
      const ds = x.k === 'wall' ? [{ full: x.full, th: x.th }] : x.d; let cur = Math.min(Math.max(d, 1), ds.length) - 1;
      const fn = i => ds[i].full.split('/').pop();
      bx.innerHTML = `<div class="colbox-in"><button type="button" class="colbox-x" aria-label="${T.x[L]}">×</button><img class="fb-big" src="${esc(ds[cur].th)}" alt="${esc(name(x))}">`
        + (ds.length > 1 ? `<div class="fb-ds" role="group" aria-label="${T.des[L]}">${ds.map((v, i) => `<button type="button" data-i="${i}" aria-pressed="${i === cur}" aria-label="${T.des[L]} ${i + 1}: ${DN[i]}"><img src="${esc(v.th)}" alt=""></button>`).join('')}</div>` : '')
        + `<p class="colbox-k">${x.k === 'wall' ? T.tpW[L] : `${x.yr ? T.tpY[L] : T.tpC[L]} · ${x.w === 'sun' ? T.sunS[L] : T.monS[L]}`}</p><h3>${esc(name(x))}</h3>`
        + `<p class="fb-s">${x.k === 'wall' ? T.phone[L] : T.hi[L]}<br>${T.art[L]}: ${esc(x.art ? x.art[L] : x.t[L])}</p>`
        + `<a class="btn pri fb-dl" href="${esc(ds[cur].full)}" download="${esc('pigeonpolly-' + fn(cur))}">⬇ ${T.dl[L]}</a><p class="fb-use">${T.use[L]}</p></div>`;
      document.body.appendChild(bx);
      const big = bx.querySelector('.fb-big'), dl = bx.querySelector('.fb-dl');
      // большое превью — полный файл, когда загрузится
      const full = new Image(); full.onload = () => { if (big.dataset.i == null || +big.dataset.i === cur) big.src = full.src; }; full.src = ds[cur].full;
      bx.querySelectorAll('.fb-ds button').forEach(b => b.addEventListener('click', () => {
        cur = +b.dataset.i; big.src = ds[cur].th; big.dataset.i = cur; dl.href = ds[cur].full; dl.download = 'pigeonpolly-' + fn(cur);
        bx.querySelectorAll('.fb-ds button').forEach(o => o.setAttribute('aria-pressed', o === b));
        const f = new Image(); f.onload = () => { if (cur === +b.dataset.i) big.src = f.src; }; f.src = ds[cur].full;
      }));
      const close = () => { bx.remove(); document.removeEventListener('keydown', key); if (location.hash) history.replaceState(null, '', location.pathname + location.search); };
      const key = e => { if (e.key === 'Escape') close(); };
      bx.addEventListener('click', e => { if (e.target === bx || e.target.closest('.colbox-x')) close(); });
      document.addEventListener('keydown', key);
    };
    g.addEventListener('click', e => { const a = e.target.closest('.fb-c'); if (!a) return; e.preventDefault(); box(items.find(x => x.id === a.dataset.id)); });
    // пин ведёт сюда: ?f=<id>&d=<дизайн>
    const q = new URLSearchParams(location.search), x = items.find(v => v.id === q.get('f'));
    if (x) {
      st.c = x.k; if (x.w) st.w = x.w; if (x.k === 'cal') st.p = x.yr ? 'year' : 'month'; apply();
      const c = g.querySelector(`[data-id="${x.id}"]`); if (c) { c.classList.add('hl'); setTimeout(() => c.scrollIntoView({ block: 'center' }), 60); }
      box(x, +q.get('d') || 1);
    }
  }).catch(() => { g.innerHTML = `<p class="flt-empty">${['Could not load the list. Please refresh the page.', 'Не удалось загрузить список. Обновите страницу.', 'Neizdevās ielādēt sarakstu. Atsvaidzini lapu.'][L]}</p>`; });
})();
