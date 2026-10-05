// Wobbleland: интерактивная карта (гербы-булавки, приближение и перетаскивание, карточка города) и квиз.
// Данные городов — window.WOBBLELAND из wobbleland-data.<язык>.js (собирается build.py из content/wobbleland.json).
(() => {
  const D = window.WOBBLELAND, box = document.getElementById('wl-mapbox');
  if (!D || !box) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const T = {
    entry: ['Bestiary entry No.', 'Запись в бестиарии №', 'Bestiārija ieraksts Nr.'],
    holidays: ['Local holidays', 'Местные праздники', 'Vietējie svētki'],
    dishes: ['Signature dishes', 'Фирменные блюда', 'Firmas ēdieni'],
    streets: ['Streets & landmarks', 'Улицы и места', 'Ielas un vietas'],
    residents: ['Notable residents', 'Известные жители', 'Ievērojami iedzīvotāji'],
    home: ['Home', 'Дом', 'Mājas'], work: ['Work', 'Работа', 'Darbs'],
    labeled: ['labeled', 'на карте подписан', 'kartē rakstīts'],
    prev: ['Previous town', 'Предыдущий город', 'Iepriekšējā pilsēta'], next: ['Next town', 'Следующий город', 'Nākamā pilsēta'],
    crest: ['Crest of', 'Герб:', 'Ģerbonis:'],
    view: ['detail from the Wobbleland map', 'фрагмент карты Wobbleland', 'Wobbleland kartes fragments'],
    // квиз
    qOf: [(i, n) => `Question ${i} of ${n}`, (i, n) => `Вопрос ${i} из ${n}`, (i, n) => `Jautājums ${i} no ${n}`],
    youre: ['You are from', 'Вы из города', 'Tu esi no'],
    dept: ['Oh no. You belong to the', 'Ой. Ваше место —', 'Ak vai. Tava vieta ir'],
    deptNote: ['Don’t worry, one honest (or funny) confession and you’re out.', 'Не волнуйтесь: одно честное (или смешное) признание, и вы свободны.', 'Neuztraucies: viena godīga (vai smieklīga) atzīšanās, un tu esi brīvs.'],
    show: ['Show on the map', 'Показать на карте', 'Parādīt kartē'],
    again: ['Try again', 'Пройти ещё раз', 'Mēģināt vēlreiz'],
    start: ['Start the quiz', 'Начать квиз', 'Sākt testu'],
    startNote: ['Six questions, zero wrong answers. Polly will tell you where you truly belong.', 'Шесть вопросов, ни одного неправильного ответа. Полли подскажет, где ваше место.', 'Seši jautājumi, neviena nepareiza atbilde. Pollija pateiks, kur ir tava īstā vieta.'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // кусок пиксельной карты вокруг города: карта в Z раз шире окна, окно 16:10
  const viewPos = (c) => {
    const Z = 4, mapH = Z * 464 / 640, winH = 10 / 16;
    const fx = Math.min(1, Math.max(0, (c.coords.left / 100 * Z - .5) / (Z - 1)));
    const fy = Math.min(1, Math.max(0, (c.coords.top / 100 * mapH - winH / 2) / (mapH - winH)));
    const dx = (c.coords.left / 100 * Z - fx * (Z - 1)) * 100, dy = (c.coords.top / 100 * mapH - fy * (mapH - winH)) / winH * 100;
    return `background-position:${(fx * 100).toFixed(2)}% ${(fy * 100).toFixed(2)}%;--dx:${dx.toFixed(1)}%;--dy:${dy.toFixed(1)}%`;
  };
  const img = (kind, key) => `/images/wobbleland/${kind}-${key}.${kind === 'crest' ? 'png' : 'jpg'}`;
  const C = D.cities;

  // ---------- карта: гербы-булавки ----------
  const stage = document.getElementById('wl-stage'), chips = document.getElementById('wl-chips'), wall = document.getElementById('wl-wall');
  C.forEach(c => {
    const pin = document.createElement('button');
    pin.type = 'button'; pin.className = 'wl-pin'; pin.dataset.key = c.key;
    pin.style.left = c.coords.left + '%'; pin.style.top = c.coords.top + '%';
    if (c.coords.left > 84) pin.classList.add('wl-pin-r');
    pin.setAttribute('aria-label', c.name);
    pin.innerHTML = `<span class="wl-pin-in"><img src="${img('crest', c.key)}" alt="" draggable="false"><span class="wl-pin-label">${esc(c.short || c.name)}</span></span>`;
    stage.appendChild(pin);
    const chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'wl-chip'; chip.dataset.key = c.key;
    chip.innerHTML = `<img src="${img('crest', c.key)}" alt=""><span class="n">${c.no}</span>${esc(c.name)}`;
    chip.addEventListener('click', () => openCity(c.key));
    chips.appendChild(chip);
    if (wall) {
      const w = document.createElement('button');
      w.type = 'button'; w.className = 'wl-wall-c'; w.title = c.name;
      w.innerHTML = `<img src="${img('crest', c.key)}" alt="${esc(c.name)}">`;
      w.addEventListener('click', () => openCity(c.key));
      wall.appendChild(w);
    }
  });

  // ---------- приближение и перетаскивание ----------
  let s = 1, tx = 0, ty = 0;
  const MAX = 4;
  const clamp = () => {
    const w = box.clientWidth, h = box.clientHeight;
    tx = Math.min(0, Math.max(w - w * s, tx)); ty = Math.min(0, Math.max(h - h * s, ty));
  };
  const apply = (anim) => {
    clamp();
    stage.style.transition = anim ? 'transform .3s ease' : 'none';
    stage.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    stage.style.setProperty('--inv', 1 / s);
    box.classList.toggle('zoomed', s > 1.01);
  };
  const zoomAt = (px, py, ns, anim = true) => {
    ns = Math.max(1, Math.min(MAX, ns));
    tx = px - (px - tx) * (ns / s); ty = py - (py - ty) * (ns / s); s = ns; apply(anim);
  };
  box.querySelector('.wl-zoom').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const cx = box.clientWidth / 2, cy = box.clientHeight / 2;
    if (b.dataset.z === 'in') zoomAt(cx, cy, s * 1.6);
    if (b.dataset.z === 'out') zoomAt(cx, cy, s / 1.6);
    if (b.dataset.z === 'reset') { s = 1; tx = ty = 0; apply(true); }
  });
  box.addEventListener('dblclick', e => {
    if (e.target.closest('.wl-pin, .wl-zoom, .wl-legend')) return;
    const r = box.getBoundingClientRect();
    if (s >= MAX - .01) { s = 1; tx = ty = 0; apply(true); } else zoomAt(e.clientX - r.left, e.clientY - r.top, s * 2);
  });
  // щипок на тачпаде (ctrl + колесо); обычное колесо листает страницу
  box.addEventListener('wheel', e => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const r = box.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, s * Math.exp(-e.deltaY * 0.01), false);
  }, { passive: false });
  const pts = new Map();
  let moved = 0, pinch = null;
  box.addEventListener('pointerdown', e => {
    if (e.target.closest('.wl-zoom, .wl-legend')) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = 0;
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s }; }
  });
  box.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    const prev = pts.get(e.pointerId), cur = { x: e.clientX, y: e.clientY };
    pts.set(e.pointerId, cur);
    if (pts.size === 2 && pinch) {
      const [a, b] = [...pts.values()], r = box.getBoundingClientRect();
      zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d, false);
      moved = 99; return;
    }
    if (s <= 1.01) return; // на целой карте — не мешаем листать страницу
    tx += cur.x - prev.x; ty += cur.y - prev.y; moved += Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y);
    if (moved > 4) box.setPointerCapture?.(e.pointerId);
    apply(false);
  });
  const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; };
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  // клик по гербу (если не тащили карту)
  stage.addEventListener('click', e => {
    const pin = e.target.closest('.wl-pin');
    if (!pin || moved > 6) return;
    openCity(pin.dataset.key);
  });
  addEventListener('resize', () => apply(false));
  apply(false);

  // ---------- карточка города ----------
  const panel = document.getElementById('wl-panel'), body = document.getElementById('wl-panel-body'), scrim = document.getElementById('wl-scrim');
  let current = null;
  function openCity(key, fromHash) {
    const i = C.findIndex(x => x.key === key); if (i < 0) return;
    const c = C[i]; current = key;
    document.querySelectorAll('.wl-pin, .wl-chip').forEach(p => p.classList.toggle('active', p.dataset.key === key));
    const res = r => `<li><b>${esc(r.name)}</b><span>${r.home ? `${t('home')}: ${esc(r.home)}. ` : ''}${r.work ? `${t('work')}: ${esc(r.work)}. ` : ''}${r.note ? esc(r.note) : ''}</span></li>`;
    body.innerHTML = `
      <figure class="wl-view wl-view-px" style="${viewPos(c)}"><span class="wl-view-dot"></span></figure>
      <div class="wl-title"><img class="wl-crest" src="${img('crest', c.key)}" alt="${t('crest')} ${esc(c.name)}"><div><p class="wl-entry">${t('entry')} ${c.no}</p><h2>${esc(c.name)}</h2></div></div>
      <p class="wl-motto">“${esc(c.motto)}”</p>
      <p class="wl-desc">${esc(c.desc)}</p>
      ${c.holidays.length ? `<h3>${t('holidays')}</h3>${c.holidays.map(h => `<div class="wl-hol"><span>${esc(h.date)}</span><div><b>${esc(h.title)}</b><p>${esc(h.desc)}</p></div></div>`).join('')}` : ''}
      ${c.dishes.length ? `<h3>${t('dishes')}</h3>${c.dishes.map(d => `<div class="wl-dish"><b>${esc(d.name)}</b><p>${esc(d.desc)}</p></div>`).join('')}` : ''}
      ${c.streets.length ? `<h3>${t('streets')}</h3><ul class="wl-streets">${c.streets.map(st => `<li><b>${esc(st.name)}</b>${st.desc && st.desc !== '—' ? `<span>${esc(st.desc)}</span>` : ''}</li>`).join('')}</ul>` : ''}
      ${c.residents.length ? `<h3>${t('residents')}</h3><ul class="wl-res">${c.residents.map(res).join('')}</ul>` : ''}
      <p class="wl-nb">${esc(c.neighbors)}</p>
      <div class="wl-nav"><button type="button" data-go="${C[(i + C.length - 1) % C.length].key}">← ${esc(C[(i + C.length - 1) % C.length].name)}</button><button type="button" data-go="${C[(i + 1) % C.length].key}">${esc(C[(i + 1) % C.length].name)} →</button></div>`;
    body.querySelectorAll('[data-go]').forEach(b => b.onclick = () => openCity(b.dataset.go));
    panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); scrim.classList.add('open');
    panel.scrollTop = 0;
    document.body.classList.add('modal-open');
    if (!fromHash) history.replaceState(null, '', '#town-' + key);
    document.getElementById('wl-close').focus({ preventScroll: true });
  }
  function closePanel() {
    if (!current) return;
    panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); scrim.classList.remove('open');
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.wl-pin, .wl-chip').forEach(p => p.classList.remove('active'));
    current = null;
    if (location.hash.startsWith('#town-')) history.replaceState(null, '', location.pathname);
  }
  document.getElementById('wl-close').addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanel();
    if (current && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const i = C.findIndex(x => x.key === current);
      openCity(C[(i + (e.key === 'ArrowRight' ? 1 : C.length - 1)) % C.length].key);
    }
  });
  if (location.hash.startsWith('#town-')) openCity(location.hash.slice(6), true);

  // ---------- квиз «Из какого вы города?» ----------
  const Q = [
    { q: ['Your ideal morning starts with…', 'Идеальное утро начинается с…', 'Ideāls rīts sākas ar…'], a: [
      [['A maple coffee and a wink at the neighbour', 'Кофе с кленовым сиропом и подмигивания соседу', 'Kļavu kafiju un piemiegšanu kaimiņam'], 'maplewink'],
      [['Tea from one of my three kettles', 'Чая из одного из трёх моих чайников', 'Tēju no vienas no manām trim tējkannām'], 'kettleford'],
      [['Mossy tea. No rush. Ever.', 'Мохового чая. Без спешки. Никогда.', 'Sūnu tēju. Bez steigas. Nekad.'], 'snailhollow'],
      [['Squeezing a lemon into everything', 'Лимона, выжатого во всё подряд', 'Citronu, kas izspiests visā pēc kārtas'], 'lemonvale']] },
    { q: ['Pick a snack', 'Выберите перекус', 'Izvēlies uzkodu'], a: [
      [['A warm pine nut pie', 'Тёплый пирог с кедровыми орехами', 'Silts priežu riekstu pīrāgs'], 'pinecrust'],
      [['A jar of jam and a spoon', 'Банка варенья и ложка', 'Ievārījuma burka un karote'], 'jamshire'],
      [['A smoked cheese braid', 'Копчёная сырная косичка', 'Kūpināta siera bize'], 'cheddarford'],
      [['Noodles you can’t eat quietly', 'Лапша, которую невозможно есть тихо', 'Nūdeles, ko nevar ēst klusi'], 'noodleford']] },
    { q: ['Your friends say you are…', 'Друзья говорят, что вы…', 'Draugi saka, ka tu esi…'], a: [
      [['Steady, even when everything wobbles', 'Спокойны, даже когда всё шатается', 'Mierīgs, pat kad viss šūpojas'], 'newwobbleton'],
      [['Lucky: I always find lost things', 'Везучи: всегда нахожу потерянное', 'Veiksmīgs: vienmēr atrodu pazudušo'], 'buttonspire'],
      [['Sharp as an aged cheddar', 'Остры, как выдержанный чеддер', 'Ass kā nogatavināts čedars'], 'cheddarford'],
      [['The one who always has the kettle on', 'Те, у кого всегда горячий чайник', 'Tas, kuram vienmēr vārās tējkanna'], 'kettleford']] },
    { q: ['A perfect weekend is…', 'Идеальные выходные — это…', 'Ideālas brīvdienas ir…'], a: [
      [['Arguing about the syrup tax under the clock tower', 'Спорить о налоге на сироп под часовой башней', 'Strīdēties par sīrupa nodokli zem pulksteņa torņa'], 'newwobbleton'],
      [['A leaf fight in golden autumn', 'Битва листьями золотой осенью', 'Lapu kauja zelta rudenī'], 'maplewink'],
      [['Walking a street as slowly as humanly possible', 'Пройти улицу как можно медленнее', 'Iet pa ielu pēc iespējas lēnāk'], 'snailhollow'],
      [['Sewing mismatched buttons onto everything', 'Пришивать ко всему разные пуговицы', 'Piešūt visam dažādas pogas'], 'buttonspire']] },
    { q: ['Choose a souvenir', 'Выберите сувенир', 'Izvēlies suvenīru'], a: [
      [['A lantern carved from a lemon', 'Фонарик, вырезанный из лимона', 'Laterna, izgriezta no citrona'], 'lemonvale'],
      [['A golden pinecone', 'Золотая шишка', 'Zelta čiekurs'], 'pinecrust'],
      [['A bottle of ink made from berries', 'Бутылочка чернил из ягод', 'Pudelīte tintes no ogām'], 'jamshire'],
      [['A tangle of dried noodles on a string', 'Связка сушёной лапши на нитке', 'Kaltētu nūdeļu virtene'], 'noodleford']] },
    { q: ['Be honest. You once…', 'Признайтесь честно. Однажды вы…', 'Atzīsties godīgi. Reiz tu…'], a: [
      [['Ate the last pie and blamed a seagull', 'Съели последний пирог и свалили на чайку', 'Apēdi pēdējo pīrāgu un vainoji kaiju'], 'department', 2],
      [['Fed bread to the marching seagulls', 'Кормили хлебом марширующих чаек', 'Baroji maizi soļojošām kaijām'], 'newwobbleton'],
      [['Gave the first slice of pie to a stranger', 'Отдали первый кусок пирога незнакомцу', 'Atdevi pirmo pīrāga gabalu svešiniekam'], 'pinecrust'],
      [['Slurped so loudly the neighbours applauded', 'Хлюпали лапшой так громко, что соседи аплодировали', 'Srēbi tik skaļi, ka kaimiņi aplaudēja'], 'noodleford']] },
  ];
  const qbox = document.getElementById('wl-quizbox');
  let step = -1, score = {}, last = null;
  function quiz() {
    if (step < 0) {
      qbox.innerHTML = `<div class="wl-q-start"><div class="wl-q-crests">${C.slice(0, 10).map(c => `<img src="${img('crest', c.key)}" alt="">`).join('')}</div><p>${t('startNote')}</p><button type="button" class="cta-btn" id="wl-q-go">${t('start')}</button></div>`;
      document.getElementById('wl-q-go').onclick = () => { step = 0; score = {}; quiz(); };
      return;
    }
    if (step < Q.length) {
      const q = Q[step];
      qbox.innerHTML = `<p class="wl-q-step">${t('qOf', step + 1, Q.length)}</p><div class="wl-q-bar"><i style="width:${step / Q.length * 100}%"></i></div>
        <h3>${esc(q.q[L])}</h3><div class="wl-q-opts">${q.a.map((a, i) => `<button type="button" data-i="${i}">${esc(a[0][L])}</button>`).join('')}</div>`;
      qbox.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
        const [, town, w] = q.a[+b.dataset.i];
        score[town] = (score[town] || 0) + (w || 1); last = town; step++; quiz();
      });
      return;
    }
    // итог: больше всего очков; при равенстве — последний выбранный из лидеров
    const top = Math.max(...Object.values(score));
    const leaders = Object.keys(score).filter(k => score[k] === top);
    const win = leaders.includes(last) ? last : leaders[0];
    const c = C.find(x => x.key === win), isDept = win === 'department';
    qbox.innerHTML = `<div class="wl-q-res"><img class="wl-crest big" src="${img('crest', c.key)}" alt="">
      <div><p class="wl-q-step">${isDept ? t('dept') : t('youre')}</p><h3>${esc(c.name)}!</h3><p class="wl-motto">“${esc(c.motto)}”</p>
      <p>${esc(isDept ? t('deptNote') : c.desc)}</p>
      <div class="wl-q-btns"><button type="button" class="cta-btn" id="wl-q-show">${t('show')}</button><button type="button" class="pill-btn" id="wl-q-again">${t('again')}</button></div></div></div>`;
    document.getElementById('wl-q-show').onclick = () => { openCity(c.key); };
    document.getElementById('wl-q-again').onclick = () => { step = 0; score = {}; quiz(); };
  }
  if (qbox) quiz(); // квиз пока не показываем на странице — код готов

  // ---------- отрывной календарь (ближайший праздник), календарь праздников, книга рецептов ----------
  const LOC = ['en-GB', 'ru-RU', 'lv-LV'][L];
  const TT = {
    today: ['Today!', 'Сегодня!', 'Šodien!'],
    inDays: [n => n === 1 ? 'Tomorrow' : `In ${n} days`, n => n === 1 ? 'Завтра' : `Через ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'день' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'дня' : 'дней'}`, n => n === 1 ? 'Rīt' : `Pēc ${n} dienām`],
    next: ['Tear off · next holiday', 'Оторвать · следующий праздник', 'Noplēst · nākamie svētki'],
    nextLabel: ['Next holiday in Wobbleland', 'Ближайший праздник в Wobbleland', 'Tuvākie svētki Wobbleland'],
    all: ['All towns', 'Все города', 'Visas pilsētas'],
    upcoming: ['coming up', 'скоро', 'drīz'],
  };
  const tt = (k, ...a) => { const v = TT[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const HOL = [];
  C.forEach(c => c.holidays.forEach(h => { if (h.m) HOL.push({ ...h, c }); }));
  HOL.sort((a, b) => a.m - b.m || a.d - b.d);
  const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysTo = h => {
    let d = new Date(today.getFullYear(), h.m - 1, h.d);
    if (d < today) d = new Date(today.getFullYear() + 1, h.m - 1, h.d);
    return { date: d, n: Math.round((d - today) / 864e5) };
  };
  const upcoming = HOL.map(h => ({ h, ...daysTo(h) })).sort((a, b) => a.n - b.n);
  const tear = document.getElementById('wl-tear');
  let ti = 0;
  const renderTear = (anim) => {
    if (!tear) return;
    const u = upcoming[ti % upcoming.length], h = u.h;
    const month = u.date.toLocaleDateString(LOC, { month: 'long' });
    tear.innerHTML = `<p class="wl-tear-label">${tt('nextLabel')}</p>
      <div class="tearpad">${anim ? '<div class="page old" aria-hidden="true"></div>' : ''}
        <div class="page">
          <div class="page-top"><span>${esc(month)}</span></div>
          <div class="page-day">${u.date.getDate()}</div>
          <div class="page-weekday">${u.n === 0 ? tt('today') : tt('inDays', u.n)}</div>
          <h3 class="page-subject">${esc(h.title)}</h3>
          <p class="wl-tear-desc">${esc(h.desc)}</p>
          <button type="button" class="wl-town-tag" data-key="${h.c.key}"><img src="${img('crest', h.c.key)}" alt="">${esc(h.c.short || h.c.name)}</button>
        </div>
      </div>
      <button type="button" class="wl-tear-next">${tt('next')} ✂</button>`;
    tear.querySelector('.wl-town-tag').addEventListener('click', () => openCity(h.c.key));
    tear.querySelector('.wl-tear-next').addEventListener('click', () => { ti++; renderTear(true); });
  };
  renderTear(false);

  const calBox = document.getElementById('wl-cal-grid');
  if (calBox) {
    const next = upcoming[0].h;
    let html = '';
    for (let m = 1; m <= 12; m++) {
      const list = HOL.filter(h => h.m === m);
      const name = new Date(2026, m - 1, 1).toLocaleDateString(LOC, { month: 'long' });
      html += `<div class="wl-cal-m${list.length ? '' : ' empty'}"><h3>${esc(name)}</h3>${list.length ? list.map(h => `
        <button type="button" class="wl-cal-h${h === next ? ' next' : ''}" data-key="${h.c.key}">
          <span class="wl-cal-d">${h.d}</span>
          <span class="wl-cal-t"><b>${esc(h.title)}</b><i><img src="${img('crest', h.c.key)}" alt="">${esc(h.c.short || h.c.name)}</i></span>
          ${h === next ? `<em>${tt('upcoming')}</em>` : ''}
        </button>`).join('') : '<p class="wl-cal-none">—</p>'}</div>`;
    }
    calBox.innerHTML = html;
    calBox.addEventListener('click', e => { const b = e.target.closest('.wl-cal-h'); if (b) openCity(b.dataset.key); });
  }

  const recBox = document.getElementById('wl-rec-list'), recF = document.getElementById('wl-rec-filter');
  if (recBox) {
    let only = '';
    const draw = () => {
      recBox.innerHTML = C.filter(c => !only || c.key === only).flatMap(c => c.dishes.map(f => `
        <article class="wl-rec">
          <h3>${esc(f.name)}</h3>
          <p>${esc(f.desc)}</p>
          <button type="button" class="wl-town-tag" data-key="${c.key}"><img src="${img('crest', c.key)}" alt="">${esc(c.short || c.name)}</button>
        </article>`)).join('');
      recF.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === only));
    };
    recF.innerHTML = `<button type="button" data-k="">${tt('all')}</button>` + C.map(c => `<button type="button" data-k="${c.key}"><img src="${img('crest', c.key)}" alt="">${esc(c.short || c.name)}</button>`).join('');
    recF.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { only = b.dataset.k; draw(); } });
    recBox.addEventListener('click', e => { const b = e.target.closest('.wl-town-tag'); if (b) openCity(b.dataset.key); });
    draw();
  }
})();
