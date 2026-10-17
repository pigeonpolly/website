// «Жуки на цветах» на /titos/ (этап 9 Б, docs/titos.md): уборщица оставила записку, в кабинете горшки с цветами, жуки едят листья — собрать всех.
// Жуки: runner «Бегунок» — при первом касании убегает на другой лист; leafy «Листик» — притворяется листом; jumper «Прыгун» — перелетает на соседний цветок.
// Некоторые прячутся за листом (касание отодвигает лист). Пока ищешь, листья объедаются.
// Сервер: POST /api/titos/bugs/{start,done} (worker/titos.js) — titosBugsPerHour раз в час, +titosBugsCups чашек через addCoffee(…, 'bugs').
// Проверка вида без сервера: ?bugs=demo.
(() => {
  const after = document.querySelector('.ts-sec') || (document.getElementById('rm') && document.getElementById('rm').closest('section')); if (!after) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0, LANG = ['en', 'ru', 'lv'][L];
  const t = a => a[L];
  const T = {
    h: ['🪲 Bugs on the flowers', '🪲 Жуки на цветах', '🪲 Vaboles uz ziediem'],
    lead: ['The cleaner left a note. There are flower pots in the office, and bugs are eating the leaves. Catch them all before the leaves are gone.', 'Уборщица оставила записку. В кабинете горшки с цветами, а на них жуки, которые едят листья. Соберите всех, пока листья целы.', 'Apkopēja atstāja zīmīti. Kabinetā ir puķu podi, un uz tiem vaboles ēd lapas. Salasi visas, kamēr lapas vēl ir.'],
    per: [(c, n) => `+${c} ☕ · ${n} times an hour`, (c, n) => `+${c} ☕ · ${n} раза в час`, (c, n) => `+${c} ☕ · ${n} reizes stundā`],
    left: [n => `Games left this hour: ${n}`, n => `Игр в этот час: ${n}`, n => `Spēles šajā stundā: ${n}`],
    play: ['▶ Catch the bugs', '▶ Собирать жуков', '▶ Vākt vaboles'],
    nextIn: [n => `Next in ${n} min`, n => `Следующая через ${n} мин`, n => `Nākamā pēc ${n} min`],
    login: ['Sign in to play', 'Войдите, чтобы играть', 'Ieej, lai spēlētu'],
    note: ['A note from the cleaner', 'Записка уборщицы', 'Apkopējas zīmīte'],
    noteText: ['Water the flowers.<br>Collect the bugs.<br>Do not spill the coffee.', 'Цветы поливать.<br>Жуков собирать.<br>Кофе не проливать.', 'Puķes laistīt.<br>Vaboles vākt.<br>Kafiju neizliet.'],
    go: ['Got it', 'Понятно', 'Skaidrs'],
    kinds: ['Runner — runs away · Leafy — pretends to be a leaf · Jumper — hops to the next flower', 'Бегунок — убегает · Листик — притворяется листом · Прыгун — перелетает на соседний цветок', 'Skrējējs — aizbēg · Lapiņa — izliekas par lapu · Lēcējs — pārlec uz blakus ziedu'],
    jar: ['in the jar', 'в банке', 'burkā'],
    leaves: [n => `Leaves saved: ${n}%`, n => `Листьев спасено: ${n}%`, n => `Izglābtas lapas: ${n}%`],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    err: ['Something went wrong. Try again.', 'Что-то пошло не так. Попробуйте ещё раз.', 'Kaut kas nogāja greizi. Mēģini vēlreiz.'],
    limit: ['That’s enough bugs for this hour', 'Жуков на этот час хватит', 'Vaboļu šai stundai pietiek'],
    done: ['All bugs caught!', 'Все жуки собраны!', 'Visas vaboles salasītas!'],
    got: [n => `+${n} ☕ in the coffee pot`, n => `+${n} ☕ в кофейник`, n => `+${n} ☕ kafijas kannā`],
    sold: [(c, b) => `${c} extra ☕ → +${b} 🔘`, (c, b) => `Лишние ${c} ☕ → +${b} 🔘`, (c, b) => `Liekās ${c} ☕ → +${b} 🔘`],
    full: [(c, b) => `The coffee pot is full. Trade the extra ${c} ☕ for ${b} 🔘?`, (c, b) => `Кофейник полон. Обменять лишние ${c} ☕ на ${b} 🔘?`, (c, b) => `Kafijas kanna ir pilna. Apmainīt liekās ${c} ☕ pret ${b} 🔘?`],
    yes: ['Trade', 'Обменять', 'Apmainīt'], no: ['No, thanks', 'Не надо', 'Nevajag'],
    wait: ['Titos is counting the bugs…', 'Титос пересчитывает жуков…', 'Titoss pārskaita vaboles…'],
    demo: ['Demo: no coffee is added', 'Проверка вида: кофе не начисляется', 'Demo: kafija netiek pieskaitīta'],
  };
  const SAY = {
    start: ['“Point two is mine. Bugs, you are under arrest.”', '«Пункт второй — мой. Жуки, вы арестованы.»', '“Otrais punkts ir mans. Vaboles, jūs esat arestētas.”'],
    cover: ['“Something is crunching under that leaf.”', '«Под листом кто-то хрустит.»', '“Zem tās lapas kāds kraukšķina.”'],
    run: [['“A runner! He flees — so he is guilty.”', '«Бегунок! Убегает — значит, виновен.»', '“Skrējējs! Bēg — tātad vainīgs.”'], ['“He won’t get far. The pot is not that big.”', '«Далеко не убежит. Горшок не такой большой.»', '“Tālu neaizbēgs. Pods nav tik liels.”']],
    hop: ['“The jumper changed flowers. A classic trick.”', '«Прыгун сменил цветок. Классический приём.»', '“Lēcējs nomainīja ziedu. Klasisks paņēmiens.”'],
    leafy: ['“Pretending to be a leaf. Not with me.”', '«Притворялся листом. Не на того напал.»', '“Izlikās par lapu. Ne ar mani.”'],
    caught: [['“Into the jar.”', '«В банку.»', '“Burkā.”'], ['“Detained.”', '«Задержан.»', '“Aizturēts.”'], ['“You have the right to remain silent. And not to chew.”', '«Вы имеете право хранить молчание. И не жевать.»', '“Jums ir tiesības klusēt. Un nekošļāt.”']],
    eaten: ['“The leaves are melting before my eyes. Faster!”', '«Листья тают на глазах. Быстрее!»', '“Lapas kūst acu priekšā. Ātrāk!”'],
    last: ['“One more is hiding. I can hear it chewing.”', '«Ещё один прячется. Я слышу, как он жуёт.»', '“Vēl viens slēpjas. Es dzirdu, kā tas košļā.”'],
    done: ['“All bugs detained. The flowers are ready to testify.”', '«Все жуки задержаны. Цветы готовы дать показания.»', '“Visas vaboles aizturētas. Ziedi ir gatavi liecināt.”'],
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const P = window.PPTitosPot || { potSvg: () => '', setPot: () => {} }; // кофейник — из titos-sort.js
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };

  // цветок в горшке: viewBox 0 0 100 150; стебель x=50; 4 листа (y, сторона); жук сидит на середине листа
  const LEAVES = [[98, -1], [82, 1], [64, -1], [48, 1]], LL = 34, LW = 10, BITES = 7;
  const leafD = `M0 0C${LL * .3} ${-LW} ${LL * .75} ${-LW} ${LL} 0C${LL * .75} ${LW} ${LL * .3} ${LW} 0 0Z`;
  const angle = side => side < 0 ? 205 : -25;
  const spot = l => { const [y, side] = LEAVES[l], a = angle(side) * Math.PI / 180; return [50 + Math.cos(a) * LL * .55, y + Math.sin(a) * LL * .55]; };
  const FLOWER = ['#f28fb0', '#ffd36b', '#b49cf2', '#ff9d6b'];
  const plantSvg = (p, bites) => `<svg viewBox="0 0 100 150" aria-hidden="true">
    <path d="M50 116V28" stroke="#3f7d3a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${LEAVES.map(([y, side], l) => `<g transform="translate(50 ${y}) rotate(${angle(side)})"><mask id="tbm${p}-${l}" maskUnits="userSpaceOnUse" x="-4" y="-16" width="${LL + 8}" height="32"><rect x="-4" y="-16" width="${LL + 8}" height="32" fill="#fff"/><g class="tb-bt">${bites[l].map(([x, s, r]) => `<circle cx="${x}" cy="${s * LW * .75}" r="${r}" fill="#000"/>`).join('')}</g></mask>
      <path d="${leafD}" fill="#5aa24a" stroke="#2f6b2a" stroke-width="1.2" mask="url(#tbm${p}-${l})"/><path d="M2 0H${LL - 4}" stroke="#2f6b2a" stroke-width=".9" mask="url(#tbm${p}-${l})"/></g>`).join('')}
    <g transform="translate(50 24)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-8" rx="6" ry="9" fill="${FLOWER[p % 4]}" transform="rotate(${a})"/>`).join('')}<circle r="5.5" fill="#f6c343" stroke="#b07a1a"/></g>
    <path d="M24 112h52l-6 36H30z" fill="#c4683f" stroke="#7a3a1f" stroke-width="1.5"/><rect x="21" y="108" width="58" height="9" rx="2" fill="#d87a4f" stroke="#7a3a1f" stroke-width="1.5"/></svg>`;
  const BUG = {
    runner: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9 2 7M6 13H1.5M6 17l-4 2M18 9l4-2M18 13h4.5M18 17l4 2" stroke="#2a1a0c" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="12" cy="14" rx="7" ry="8" fill="#c0392b" stroke="#2a1a0c" stroke-width="1.2"/><path d="M12 6v16" stroke="#2a1a0c"/><circle cx="9" cy="12" r="1.4" fill="#2a1a0c"/><circle cx="15" cy="16" r="1.4" fill="#2a1a0c"/><circle cx="12" cy="5" r="3" fill="#2a1a0c"/><path d="M11 3 9 0M13 3l2-3" stroke="#2a1a0c" stroke-linecap="round"/></svg>',
    leafy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C19 7 20 15 12 22 4 15 5 7 12 2Z" fill="#6cb356" stroke="#2f6b2a" stroke-width="1"/><path d="M12 5v15M12 10l3-2M12 14l-3-2M12 17l3-2" stroke="#2f6b2a" stroke-width=".8"/><circle cx="10.4" cy="5.6" r=".9" fill="#1d1d1d"/><circle cx="13.6" cy="5.6" r=".9" fill="#1d1d1d"/></svg>',
    jumper: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 15 3 22M16 15l5 7" stroke="#6b5a12" stroke-width="1.6" stroke-linecap="round"/><path d="M9 12 4 9M15 12l5-3" stroke="#6b5a12" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="12" cy="13" rx="5" ry="7.5" fill="#d4b72c" stroke="#6b5a12" stroke-width="1.2"/><path d="M8 11c2 2 6 2 8 0" stroke="#6b5a12" fill="none"/><circle cx="12" cy="5.5" r="3.2" fill="#d4b72c" stroke="#6b5a12"/><circle cx="10.8" cy="5" r=".9" fill="#1d1d1d"/><circle cx="13.2" cy="5" r=".9" fill="#1d1d1d"/><path d="M11 3 8 0M13 3l3-3" stroke="#6b5a12" stroke-linecap="round"/></svg>',
  };
  const COVER = `<svg viewBox="-2 -14 40 28" aria-hidden="true"><path d="${leafD}" fill="#4f9a41" stroke="#2f6b2a" stroke-width="1.2" transform="scale(1.05)"/><path d="M2 0H31" stroke="#2f6b2a" stroke-width=".9"/></svg>`;

  const CSS = `
.tb-main{position:relative;display:flex;align-items:center;justify-content:center;padding:10px;min-height:0;overflow:hidden}
.tb-gd{position:relative;flex:none}
.tb-gd::after{content:'';position:absolute;left:-2%;right:-2%;bottom:-1.5%;height:3%;background:#6b4423;border-radius:4px;box-shadow:0 4px 0 #3e2612}
.tb-pl{position:absolute;pointer-events:none}.tb-pl svg{width:100%;height:100%;display:block}
.tb-bug,.tb-cov{position:absolute;transform:translate(-50%,-50%);border:0;background:none;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:left .55s ease-in-out,top .55s ease-in-out}
.tb-bug{width:max(44px,calc(var(--cw) * .2));height:max(44px,calc(var(--cw) * .2));z-index:2}
.tb-bug svg{width:calc(var(--cw) * .15);height:calc(var(--cw) * .15);min-width:26px;min-height:26px;filter:drop-shadow(0 1px 0 #0005)}
.tb-bug.chew svg{animation:tb-chew .35s ease-in-out infinite alternate}
.tb-bug.leafy svg{opacity:.92}
.tb-bug.hop{animation:tb-hop .55s ease-in-out}
.tb-bug.got{animation:tb-got .5s ease-in forwards;pointer-events:none}
.tb-cov{z-index:3;width:calc(var(--cw) * .42);height:calc(var(--cw) * .3);min-width:56px;min-height:40px;transition:transform .5s ease-out,opacity .5s}
.tb-cov svg{width:100%;height:100%;filter:drop-shadow(0 2px 1px #0006)}
.tb-cov.off{transform:translate(-5%,-95%) rotate(-38deg);opacity:.55;pointer-events:none}
.tb-note{position:absolute;inset:0;z-index:6;display:flex;align-items:center;justify-content:center;background:rgba(20,13,40,.7);padding:16px}
.tb-note>div{background:#fff8d6;color:#2a1a0c;border-radius:4px;padding:22px 24px 18px;max-width:340px;width:100%;transform:rotate(-2deg);box-shadow:0 10px 30px #0008;font-family:'Comic Sans MS','Segoe Print',cursive}
.tb-note b{display:block;font-family:var(--serif);font-size:.85rem;color:#7a6440;margin-bottom:8px}
.tb-note p{font-size:1.25rem;line-height:1.5;margin:0 0 12px}
.tb-note small{display:block;font-family:var(--sans);font-size:.8rem;color:#5a4a30;margin-bottom:14px;line-height:1.4}
.tb-note button{font-family:var(--sans);background:#2b1a51;color:#f3effa;border-color:#2b1a51}
.ts-end .ts-potbox{justify-content:center}
.tb-jar{font-size:.9rem;white-space:nowrap}.tb-jar i{font-style:normal}
.ts-card .tb-wait{color:var(--muted);font-size:.9rem}
@keyframes tb-chew{to{transform:rotate(8deg) scale(1.04)}}
@keyframes tb-hop{50%{transform:translate(-50%,-120%) scale(1.15)}}
@keyframes tb-got{to{transform:translate(-50%,-260%) scale(.3);opacity:0}}
@media (max-width:700px){.tb-main{padding:6px}.tb-jar i{display:none}}
@media (prefers-reduced-motion:reduce){.tb-bug.chew svg,.tb-bug.hop{animation:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  // ---------- карточка под «Разбери дела» ----------
  const sec = document.createElement('section'); sec.className = 'rm-sec ts-sec'; after.after(sec);
  let S = null, ov = null;
  const signed = () => !!(window.PPWho && window.PPWho.user && window.PPWho.user.nick);
  const DEMO = new URLSearchParams(location.search).get('bugs') === 'demo';
  const drawCard = () => {
    const cups = (S && S.prices && S.prices.bugs) || 5, left = S && typeof S.bugsLeft === 'number' ? S.bugsLeft : 2;
    const mins = S && S.bugsNext ? Math.max(1, Math.ceil((S.bugsNext - Date.now()) / 60000)) : 0;
    const can = DEMO || (signed() && left > 0);
    sec.innerHTML = `<div class="ts-card"><div class="ts-potbox big">${BUG.runner.replace('<svg', '<svg style="width:72px;height:72px"')}</div><div class="ts-i"><h2>${t(T.h)}</h2><p>${t(T.lead)}</p><small>${t(T.per)(cups, (S && S.prices && S.prices.bugsHour) || 2)}${signed() && left > 0 ? ` · ${t(T.left)(left)}` : ''}</small></div>
      ${can ? `<button type="button" class="pill-btn tb-go">${t(T.play)}</button>` : signed() ? `<span class="tb-wait">⏳ ${t(T.nextIn)(mins || 60)}</span>` : `<button type="button" class="pill-btn tb-go">${t(T.login)}</button>`}</div>`;
    const b = sec.querySelector('.tb-go');
    if (b) b.onclick = () => DEMO ? open({ n: 8, seed: 7, cups: 5, sec: 0, t0: Date.now() }) : signed() ? start() : window.PPAccount && window.PPAccount.openSignIn && window.PPAccount.openSignIn();
  };
  const take = s => { if (s && typeof s.coffee === 'number') S = { ...S, ...s }; if (!ov) drawCard(); };
  document.addEventListener('pp:titos', e => take(e.detail));
  document.addEventListener('pp:whoami', e => take(e.detail && e.detail.user && e.detail.user.titos));
  if (window.PPWho && window.PPWho.user) take(window.PPWho.user.titos);
  drawCard(); setInterval(() => { if (!ov) drawCard(); }, 30000);
  // цены (prices.bugs) приходят с GET /api/titos
  fetch(`/api/titos?lang=${LANG}`, { credentials: 'same-origin' }).then(r => r.json()).then(j => { if (j && j.state) take({ ...j.state, prices: j.prices }); }).catch(() => {});

  const api = async (path, body) => {
    try {
      const r = await fetch(`${path}?lang=${LANG}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}), credentials: 'same-origin' });
      const j = await r.json().catch(() => ({}));
      if (j.state) { S = { ...S, ...j.state }; document.dispatchEvent(new CustomEvent('pp:titos', { detail: j.state })); }
      return r.ok ? j : { ...j, error: j.error || 'server', status: r.status };
    } catch (e) { return { error: 'net' }; }
  };
  const toast = m => (window.PPToast || alert)(m);
  const start = async () => {
    const j = await api('/api/titos/bugs/start');
    if (j.error) { toast(j.error === 'bugs' ? t(T.limit) : t(T.err)); drawCard(); return; }
    open({ n: j.n, seed: j.seed, cups: j.cups, sec: j.sec || 0, t0: Date.now() });
  };

  // ---------- игра ----------
  function open(G) {
    const rnd = rng(G.seed), phone = matchMedia('(max-width:700px)').matches, NP = 4, cols = phone ? 2 : 4, rows = phone ? 2 : 1;
    const bites = Array.from({ length: NP }, () => LEAVES.map(() => []));
    // жуки: вид, цветок, лист, за листом ли
    const free = []; for (let p = 0; p < NP; p++) for (let l = 0; l < LEAVES.length; l++) free.push([p, l]);
    for (let i = free.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [free[i], free[j]] = [free[j], free[i]]; }
    const KINDS = ['runner', 'leafy', 'jumper'];
    const bugs = Array.from({ length: Math.min(G.n, free.length) }, (_, i) => {
      const [p, l] = free[i], kind = KINDS[i % 3];
      return { i, kind, p, l, p0: p, l0: l, hidden: kind !== 'jumper' && rnd() < .4, scared: false, got: false, eat: rnd() * 2, hopAt: 4 + rnd() * 4 };
    });
    ov = document.createElement('div'); ov.className = 'ts-ov'; document.body.appendChild(ov);
    const prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    ov.innerHTML = `<div class="ts-st" role="dialog" aria-label="${esc(t(T.h))}"><img class="ts-bg" src="/images/rooms/detective-day.png" alt="">
      <div class="ts-hd"><b>${t(T.h)}</b><span class="tb-jar"></span><span class="ts-cnt tb-lv"></span><span class="ts-potbox">${P.potSvg()}<b></b></span><button type="button" class="ts-x" aria-label="${t(T.close)}">✕</button></div>
      <div class="tb-main"><div class="tb-gd"></div></div>
      <div class="ts-ti"><img src="/images/rooms/detective-titos.png" alt=""><div class="ts-say" aria-live="polite"></div></div>${DEMO ? `<div class="ts-demo">${t(T.demo)}</div>` : ''}
      <div class="tb-note"><div><b>${t(T.note)}</b><p>${t(T.noteText)}</p><small>${t(T.kinds)}</small><button type="button" class="pill-btn tb-ok">${t(T.go)}</button></div></div></div>`;
    const $ = s => ov.querySelector(s), gd = $('.tb-gd'), main = $('.tb-main'), sayEl = $('.ts-say'), potEl = $('.ts-hd .ts-potbox');
    const coffee = () => S ? [S.coffee, S.max] : [10, 10];
    P.setPot(potEl, ...coffee());
    let sayT = null, timer = null, busy = false, warned = false, cw = 100;
    const say = (s, ms = 3600) => { sayEl.textContent = t(s); clearTimeout(sayT); sayT = setTimeout(() => { sayEl.textContent = ''; }, ms); };
    const close = () => { clearInterval(timer); window.removeEventListener('resize', fit); document.removeEventListener('keydown', onKey); ov.remove(); ov = null; document.body.style.overflow = prevOverflow; drawCard(); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    $('.ts-x').onclick = close;

    gd.innerHTML = Array.from({ length: NP }, (_, p) => `<div class="tb-pl" data-p="${p}"></div>`).join('')
      + bugs.map(b => `<button type="button" class="tb-bug ${b.kind}" data-i="${b.i}" aria-label="🪲">${BUG[b.kind]}</button>${b.hidden ? `<button type="button" class="tb-cov" data-i="${b.i}" aria-label="🍃">${COVER}</button>` : ''}`).join('');
    const drawPlant = p => { gd.querySelector(`.tb-pl[data-p="${p}"]`).innerHTML = plantSvg(p, bites[p]); };
    for (let p = 0; p < NP; p++) drawPlant(p);
    // координаты в саду (px) — цветок p, точка (x, y) в его viewBox
    const at = (p, x, y) => [((p % cols) + x / 100) * cw, (Math.floor(p / cols) + y / 150) * cw * 1.5];
    const place = b => { const [x, y] = at(b.p, ...spot(b.l)), el = gd.querySelector(`.tb-bug[data-i="${b.i}"]`); el.style.left = `${x}px`; el.style.top = `${y}px`; const c = gd.querySelector(`.tb-cov[data-i="${b.i}"]`); if (c) { const [cx, cy] = at(b.p0, ...spot(b.l0)); c.style.left = `${cx}px`; c.style.top = `${cy}px`; } };
    function fit() { // сад вписывается в свободное место; цветок — 100×150
      const w = main.clientWidth - 16, h = main.clientHeight - 16;
      cw = Math.max(60, Math.min(w / cols, h / rows / 1.5));
      gd.style.width = `${cw * cols}px`; gd.style.height = `${cw * 1.5 * rows}px`; gd.style.setProperty('--cw', `${cw}px`);
      gd.querySelectorAll('.tb-pl').forEach(el => { const p = Number(el.dataset.p); el.style.left = `${(p % cols) * cw}px`; el.style.top = `${Math.floor(p / cols) * cw * 1.5}px`; el.style.width = `${cw}px`; el.style.height = `${cw * 1.5}px`; });
      bugs.forEach(place);
    }
    window.addEventListener('resize', fit);
    fit();
    const busyLeaf = (p, l, me) => bugs.some(b => b !== me && !b.got && b.p === p && b.l === l);
    const moveTo = (b, plants) => { // на свободный лист одного из цветков plants
      const opts = []; plants.forEach(p => LEAVES.forEach((_, l) => { if (!busyLeaf(p, l, b) && !(p === b.p && l === b.l)) opts.push([p, l]); }));
      if (!opts.length) return false;
      [b.p, b.l] = opts[Math.floor(Math.random() * opts.length)]; place(b); return true;
    };
    const near = p => [p - 1, p + 1].filter(x => x >= 0 && x < NP);
    const left = () => bugs.filter(b => !b.got).length;
    const hud = () => { $('.tb-jar').innerHTML = `🫙 ${bugs.length - left()}/${bugs.length} <i>${t(T.jar)}</i>`; $('.tb-lv').textContent = `· 🍃 ${saved()}%`; };
    const saved = () => { let n = 0; bites.forEach(pl => pl.forEach(b => { n += b.length; })); return Math.round(100 - n / (NP * LEAVES.length * BITES) * 100); };

    gd.addEventListener('click', e => {
      const c = e.target.closest('.tb-cov');
      if (c) { c.classList.add('off'); const b = bugs[Number(c.dataset.i)]; b.hidden = false; return; }
      const el = e.target.closest('.tb-bug'); if (!el || busy) return;
      const b = bugs[Number(el.dataset.i)]; if (b.got || b.hidden) return;
      if (b.kind === 'runner' && !b.scared) { b.scared = true; if (moveTo(b, [b.p, ...near(b.p)])) { say(pick(SAY.run)); return; } }
      b.got = true; el.classList.remove('chew'); el.classList.add('got');
      say(b.kind === 'leafy' && Math.random() < .6 ? SAY.leafy : pick(SAY.caught), 2200);
      hud();
      if (!left()) finish();
      else if (left() === 1 && bugs.some(x => !x.got && x.hidden)) say(SAY.last);
    });
    // раз в секунду: жуки едят свой лист, прыгуны перелетают на соседний цветок
    const tick = () => {
      bugs.forEach(b => {
        if (b.got) return;
        gd.querySelector(`.tb-bug[data-i="${b.i}"]`).classList.add('chew');
        b.eat += 1;
        if (b.eat >= 2.5) {
          b.eat = 0; const bt = bites[b.p][b.l];
          if (bt.length < BITES) { bt.push([4 + Math.random() * (LL - 6), Math.random() < .5 ? -1 : 1, 3 + Math.random() * 3]); drawPlant(b.p); }
        }
        if (b.kind === 'jumper' && (b.hopAt -= 1) <= 0) {
          b.hopAt = 5 + Math.random() * 3;
          const el = gd.querySelector(`.tb-bug[data-i="${b.i}"]`);
          if (moveTo(b, near(b.p))) { el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); if (Math.random() < .35) say(SAY.hop); }
        }
      });
      hud();
      if (!warned && saved() < 70) { warned = true; say(SAY.eaten); }
    };
    $('.tb-ok').onclick = () => { $('.tb-note').remove(); say(SAY.start); if (bugs.some(b => b.hidden)) setTimeout(() => { if (ov && !busy) say(SAY.cover); }, 4000); timer = setInterval(tick, 1000); };
    hud();

    // все собраны: полный кофейник — спросить про обмен лишнего; потом /done (сервер проверит время)
    const finish = async () => {
      busy = true; clearInterval(timer); say(SAY.done, 9000);
      const pct = saved(), [c, max] = coffee(), cups = G.cups || 5, extra = Math.max(0, c + cups - max), sellN = Math.min(extra, S && typeof S.sellLeft === 'number' ? S.sellLeft : extra);
      const per = (S && S.prices && S.prices.sell) || 1;
      await new Promise(r => setTimeout(r, 600));
      let sell = false;
      if (sellN > 0) sell = await ask(t(T.full)(sellN, sellN * per));
      if (DEMO) { endCard({ gained: Math.min(cups, max - c), sold: sell ? sellN : 0, buttons: sell ? sellN * per : 0 }, c, max, pct); return; }
      showEnd(`<p>${t(T.wait)}</p>`);
      const rest = G.n * G.sec * 1000 + 300 - (Date.now() - G.t0);
      if (rest > 0) await new Promise(r => setTimeout(r, rest));
      let j;
      for (let k = 0; k < 6; k++) { j = await api('/api/titos/bugs/done', { sell }); if (j.error !== 'fast') break; await new Promise(r => setTimeout(r, 1500)); }
      if (j.error) { showEnd(`<p>${j.error === 'bugs' ? t(T.limit) : t(T.err)}</p><div class="ts-row"><button type="button" class="pill-btn ts-c">${t(T.close)}</button></div>`); $('.ts-c').onclick = close; return; }
      if (j.buttons && window.PPAccount) window.PPAccount.check();
      endCard(j, c, max, pct);
    };
    const showEnd = html => { let e = $('.ts-end'); if (!e) { e = document.createElement('div'); e.className = 'ts-end'; $('.ts-st').appendChild(e); } e.innerHTML = `<div>${html}</div>`; return e; };
    const ask = q => new Promise(res => {
      showEnd(`<p>${q}</p><div class="ts-row"><button type="button" class="pill-btn ts-y">${t(T.yes)}</button><button type="button" class="pill-btn ts-n">${t(T.no)}</button></div>`);
      $('.ts-y').onclick = () => res(true); $('.ts-n').onclick = () => res(false);
    });
    const endCard = (j, c0, max, pct) => {
      const e = showEnd(`<span class="ts-potbox big">${P.potSvg()}<b></b></span><h3>${t(T.done)}</h3><p>${t(T.leaves)(pct)}</p><p>${t(T.got)(j.gained || 0)}</p>${j.sold ? `<p>${t(T.sold)(j.sold, j.buttons || 0)}</p>` : ''}
        <div class="ts-row"><button type="button" class="pill-btn ts-c">${t(T.close)}</button></div>`);
      const pb = e.querySelector('.ts-potbox'); P.setPot(pb, c0, max);
      requestAnimationFrame(() => setTimeout(() => { const c1 = Math.min(max, c0 + (j.gained || 0)); P.setPot(pb, c1, max); P.setPot(potEl, c1, max); }, 200)); // видно, как наливается
      $('.ts-c').onclick = close;
    };
  }
})();
