// «Жуки» на /titos/ (этап 9 Б, docs/titos.md): в кабинет Титоса заползли жуки и жучки-прослушки — поймать, пока не разбежались.
// Сервер: POST /api/titos/bugs/start (не больше titosBugsPerHour в час), потом POST /api/titos/coffee {src: 'bugs', sell} — +titosBugsCups чашек, не быстрее titosBugsSec с.
// Окно и кофейник — от titos-sort.js (классы .ts-*, PPTitos.kit). Проверка вида без сервера: ?bugs=demo.
(() => {
  const kit = window.PPTitos && window.PPTitos.kit, after = document.querySelector('.ts-sec'); if (!kit || !after) return;
  const { potSvg, setPot, esc } = kit;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const t = a => a[L];
  const GOAL = 15, TIME = 30, MAXON = 6; // очков для победы, секунд на игру, жуков на столе сразу
  const T = {
    h: ['🪲 Bugs', '🪲 Жуки', '🪲 Vaboles'],
    lead: ['Bugs crawled into Titos’s office — and among them, a few listening bugs. Catch them before they run off. Don’t touch the ladybird: she’s a witness.', 'В кабинет Титоса заползли жуки, а среди них — жучки-прослушки. Ловите, пока не разбежались. Божью коровку не трогайте: она свидетель.', 'Titosa kabinetā ielīda vaboles, bet starp tām — noklausīšanās blaktis. Ķer, kamēr nav izskrējušas. Mārīti neaiztiec: viņa ir lieciniece.'],
    per: [(n, k, m) => `+${n} ☕ per game · ${k} of ${m} left this hour`, (n, k, m) => `+${n} ☕ за игру · осталось ${k} из ${m} в этот час`, (n, k, m) => `+${n} ☕ par spēli · šajā stundā atlikušas ${k} no ${m}`],
    wait: [n => `next game in ${n} min`, n => `следующая игра через ${n} мин`, n => `nākamā spēle pēc ${n} min`],
    play: ['▶ Play', '▶ Играть', '▶ Spēlēt'],
    login: ['Sign in to play', 'Войдите, чтобы играть', 'Ieej, lai spēlētu'],
    rule: [`Catch ${GOAL} points in ${TIME} s: 🪲 = 1, 📡 listening bug = 2, 🐞 ladybird = −3 s`, `Наберите ${GOAL} очков за ${TIME} с: 🪲 = 1, 📡 жучок-прослушка = 2, 🐞 божья коровка = −3 с`, `Savāc ${GOAL} punktus ${TIME} s laikā: 🪲 = 1, 📡 noklausīšanās blakts = 2, 🐞 mārīte = −3 s`],
    go: ['Start', 'Начать', 'Sākt'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    lost: ['The bugs ran off', 'Жуки разбежались', 'Vaboles aizbēga'],
    again: ['Try again', 'Ещё раз', 'Vēlreiz'],
    win: ['All bugs caught!', 'Жуки пойманы!', 'Visas vaboles noķertas!'],
    got: [n => `+${n} ☕ in the coffee pot`, n => `+${n} ☕ в кофейник`, n => `+${n} ☕ kafijas kannā`],
    sold: [(c, b) => `${c} extra ☕ → +${b} 🔘`, (c, b) => `Лишние ${c} ☕ → +${b} 🔘`, (c, b) => `Liekās ${c} ☕ → +${b} 🔘`],
    full: [(c, b) => `The coffee pot is full. Trade the extra ${c} ☕ for ${b} 🔘?`, (c, b) => `Кофейник полон. Обменять лишние ${c} ☕ на ${b} 🔘?`, (c, b) => `Kafijas kanna ir pilna. Apmainīt liekās ${c} ☕ pret ${b} 🔘?`],
    yes: ['Trade', 'Обменять', 'Apmainīt'], no: ['No, thanks', 'Не надо', 'Nevajag'],
    limit: ['That’s enough bugs for this hour', 'На этот час жуков хватит', 'Šai stundai vaboļu pietiek'],
    err: ['Something went wrong. Try again.', 'Что-то пошло не так. Попробуйте ещё раз.', 'Kaut kas nogāja greizi. Mēģini vēlreiz.'],
    checking: ['Titos is counting the bugs…', 'Титос пересчитывает жуков…', 'Titoss skaita vaboles…'],
    demo: ['Demo: no coffee is added', 'Проверка вида: кофе не начисляется', 'Demo: kafija netiek pieskaitīta'],
  };
  const SAY = {
    start: ['“Bugs. In MY office. This is personal.”', '«Жуки. В МОЁМ кабинете. Это личное.»', '“Vaboles. MANĀ kabinetā. Tas ir personīgi.”'],
    bug: [['“Got one!”', '«Есть один!»', '“Viena ir!”'], ['“Elementary.”', '«Элементарно.»', '“Elementāri.”'], ['“Into the matchbox with you.”', '«В спичечный коробок его.»', '“Sērkociņu kastītē!”']],
    spy: [['“A listening bug! Who sent you?”', '«Жучок-прослушка! Кто тебя прислал?»', '“Noklausīšanās blakts! Kas tevi sūtīja?”'], ['“So that’s how they knew about the syrup.”', '«Так вот откуда они знали про сироп.»', '“Lūk, kā viņi zināja par sīrupu.”']],
    lady: [['“Not her! She is a witness!”', '«Не её! Она свидетель!»', '“Ne viņu! Viņa ir lieciniece!”'], ['“Apologise to the witness.”', '«Извинитесь перед свидетелем.»', '“Atvainojieties lieciniecei.”']],
    hurry: ['“Faster! They’re heading for the coffee!”', '«Быстрее! Они ползут к кофе!»', '“Ātrāk! Tās rāpo uz kafiju!”'],
    win: ['“The office is clean. The coffee is safe. I am a genius.”', '«Кабинет чист. Кофе в безопасности. Я гений.»', '“Kabinets ir tīrs. Kafija ir drošībā. Es esmu ģēnijs.”'],
    lost: ['“They’ll be back. They always come back.”', '«Они вернутся. Они всегда возвращаются.»', '“Tās atgriezīsies. Tās vienmēr atgriežas.”'],
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];

  // жуки сверху: голова смотрит вправо (угол 0), лапки — штрихи
  const legs = c => `<path d="M14 9l-4-5M20 9l0-6M26 9l4-5M14 23l-4 5M20 23l0 6M26 23l4 5" stroke="${c}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`;
  const BUG = {
    bug: `<svg viewBox="0 0 40 32" aria-hidden="true">${legs('#2a1b10')}<ellipse cx="19" cy="16" rx="11" ry="8" fill="#5b3a1f"/><path d="M19 8v16" stroke="#2a1b10" stroke-width="1.2"/><ellipse cx="15" cy="13" rx="4" ry="2" fill="#fff" opacity=".18"/><circle cx="32" cy="16" r="4.5" fill="#2a1b10"/><path d="M35 13l4-3M35 19l4 3" stroke="#2a1b10" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    spy: `<svg viewBox="0 0 40 32" aria-hidden="true">${legs('#2b2f3a')}<ellipse cx="19" cy="16" rx="11" ry="8" fill="#6b7385"/><rect x="12" y="12" width="12" height="8" rx="2" fill="#3d4352"/><path d="M14 14h8M14 16h8M14 18h8" stroke="#8b93a6" stroke-width=".8"/><circle cx="32" cy="16" r="4.5" fill="#2b2f3a"/><path d="M33 12l3-9" stroke="#2b2f3a" stroke-width="1.4" stroke-linecap="round"/><circle class="tb-led" cx="36" cy="3" r="2.2" fill="#ff4d4d"/></svg>`,
    lady: `<svg viewBox="0 0 40 32" aria-hidden="true">${legs('#1a1a1a')}<ellipse cx="19" cy="16" rx="11" ry="9" fill="#d8322b"/><path d="M8 16h22" stroke="#1a1a1a" stroke-width="1.4"/><circle cx="14" cy="11" r="2.2" fill="#1a1a1a"/><circle cx="22" cy="10.5" r="2" fill="#1a1a1a"/><circle cx="15" cy="21" r="2" fill="#1a1a1a"/><circle cx="23" cy="21.5" r="2.2" fill="#1a1a1a"/><circle cx="31" cy="16" r="5" fill="#1a1a1a"/><circle cx="33" cy="13.5" r="1.2" fill="#fff"/><circle cx="33" cy="18.5" r="1.2" fill="#fff"/></svg>`,
  };

  const CSS = `
.tb-sec{padding-top:0}
.tb-card .tb-ico{font-size:3.4rem;line-height:1;width:92px;text-align:center}
.tb-field{position:relative;margin:12px;border-radius:12px;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,#7a5232,#4d3020 70%);border:3px solid #2e1c10;touch-action:none;user-select:none;min-height:0}
.tb-field::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 58px,rgba(0,0,0,.12) 58px 60px);pointer-events:none}
.tb-prop{position:absolute;pointer-events:none;opacity:.9;font-size:2.2rem}
.tb-bug{position:absolute;left:0;top:0;width:70px;height:70px;margin:-35px 0 0 -35px;padding:6px;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent}
.tb-bug svg{width:100%;height:100%;display:block;filter:drop-shadow(0 2px 1px #0008);animation:tb-walk .18s steps(2) infinite}
.tb-bug.caught{pointer-events:none}.tb-bug.caught svg{animation:tb-catch .35s ease-in forwards}
.tb-led{animation:tb-led .7s steps(2) infinite}
.tb-pop{position:absolute;font-weight:900;font-size:1.1rem;color:#ffd36b;text-shadow:0 2px 0 #000a;pointer-events:none;animation:tb-pop .8s ease-out forwards}
.tb-pop.neg{color:#ff8a80}
.tb-hd-i{display:flex;gap:12px;font-weight:800;font-size:.95rem;white-space:nowrap}
.tb-hd-i .tb-low{color:#ff8a80}
.tb-rule{margin:6px 0 0;color:var(--muted);font-size:.9rem}
@keyframes tb-walk{50%{transform:translateY(1px) rotate(2deg)}}
@keyframes tb-catch{to{transform:scale(.2) rotate(200deg);opacity:0}}
@keyframes tb-led{50%{opacity:.2}}
@keyframes tb-pop{to{transform:translateY(-34px);opacity:0}}
@media (max-width:700px){.tb-field{margin:8px}.tb-bug{width:64px;height:64px;margin:-32px 0 0 -32px}}
@media (prefers-reduced-motion:reduce){.tb-bug svg,.tb-led{animation:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  // ---------- карточка под «Разбери дела» ----------
  const sec = document.createElement('section'); sec.className = 'rm-sec ts-sec tb-sec'; after.after(sec);
  let S = null, ov = null;
  const signed = () => !!(window.PPWho && window.PPWho.user && window.PPWho.user.nick);
  const DEMO = new URLSearchParams(location.search).get('bugs') === 'demo';
  const cupsOf = () => (S && S.prices && S.prices.bugs) || 5;
  const leftOf = () => DEMO || !S || typeof S.bugsLeft !== 'number' ? 2 : S.bugsLeft;
  const drawCard = () => {
    const left = leftOf(), max = Math.max(left, (S && S.bugsMax) || 2);
    const mins = S && S.bugsNext ? Math.max(1, Math.ceil((S.bugsNext - Date.now()) / 60000)) : 0;
    const note = left || DEMO ? t(T.per)(cupsOf(), left, max) : `${t(T.per)(cupsOf(), 0, max)} · ${t(T.wait)(mins)}`;
    const can = DEMO || (signed() && left > 0);
    sec.innerHTML = `<div class="ts-card tb-card"><div class="tb-ico" aria-hidden="true">🪲</div><div class="ts-i"><h2>${t(T.h)}</h2><p>${t(T.lead)}</p><small>${note}</small></div>
      <button type="button" class="pill-btn tb-go"${signed() && !can ? ' disabled' : ''}>${signed() || DEMO ? t(T.play) : t(T.login)}</button></div>`;
    sec.querySelector('.tb-go').onclick = () => DEMO ? open() : signed() ? start() : window.PPAccount && window.PPAccount.openSignIn && window.PPAccount.openSignIn();
  };
  const take = s => { if (s && typeof s.coffee === 'number') { S = { ...S, ...s }; if (!ov) drawCard(); } };
  document.addEventListener('pp:titos', e => take(e.detail));
  document.addEventListener('pp:whoami', e => { const s = e.detail && e.detail.user && e.detail.user.titos; if (s) S = { ...S, ...s }; if (!ov) drawCard(); });
  if (window.PPWho && window.PPWho.user && window.PPWho.user.titos) S = window.PPWho.user.titos;
  drawCard(); setInterval(() => { if (!ov) drawCard(); }, 30000);

  const api = async (path, body) => {
    try {
      const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}), credentials: 'same-origin' });
      const j = await r.json().catch(() => ({}));
      if (j.state) { S = { ...S, ...j.state }; document.dispatchEvent(new CustomEvent('pp:titos', { detail: j.state })); }
      return r.ok ? j : { ...j, error: j.error || 'server', status: r.status };
    } catch (e) { return { error: 'net' }; }
  };
  let run = null; // {sec, t0} — открытая игра на сервере
  const start = async () => {
    const j = await api('/api/titos/bugs/start');
    if (j.error) { (window.PPToast || alert)(t(j.status === 429 ? T.limit : T.err)); drawCard(); return; }
    run = { sec: j.sec || 0, cups: j.cups || cupsOf(), t0: Date.now() };
    if (ov) return play(); open();
  };

  // ---------- игра ----------
  let play = () => {};
  function open() {
    ov = document.createElement('div'); ov.className = 'ts-ov'; document.body.appendChild(ov);
    const prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    ov.innerHTML = `<div class="ts-st" role="dialog" aria-label="${esc(t(T.h))}"><img class="ts-bg" src="/images/rooms/detective-night.png" alt="">
      <div class="ts-hd"><b>${t(T.h)}</b><span class="tb-hd-i"><span class="tb-sc">0/${GOAL}</span><span class="tb-tm">⏱ ${TIME}</span></span><span class="ts-potbox">${potSvg()}<b></b></span><button type="button" class="ts-x" aria-label="${t(T.close)}">✕</button></div>
      <div class="tb-field"><span class="tb-prop" style="left:6%;top:8%">☕</span><span class="tb-prop" style="right:8%;bottom:10%">🗂</span><span class="tb-prop" style="right:30%;top:12%;font-size:1.7rem">🔍</span></div>
      <div class="ts-ti"><img src="/images/rooms/detective-titos.png" alt=""><div class="ts-say" aria-live="polite"></div></div>${DEMO ? `<div class="ts-demo">${t(T.demo)}</div>` : ''}</div>`;
    const $ = s => ov.querySelector(s), field = $('.tb-field'), sayEl = $('.ts-say'), scEl = $('.tb-sc'), tmEl = $('.tb-tm');
    const potEl = $('.ts-hd .ts-potbox'), coffee = () => S ? [S.coffee, S.max] : [10, 10];
    setPot(potEl, ...coffee());
    let sayT = null, raf = 0, tick = 0, bugs = [], score = 0, end = 0, spawnAt = 0, busy = false, hurried = false;
    const say = (s, ms = 2600) => { sayEl.textContent = t(s); clearTimeout(sayT); sayT = setTimeout(() => { sayEl.textContent = ''; }, ms); };
    const stop = () => { cancelAnimationFrame(raf); clearInterval(tick); bugs.forEach(b => b.el.remove()); bugs = []; };
    const close = () => { stop(); clearTimeout(sayT); ov.remove(); ov = null; run = null; document.body.style.overflow = prevOverflow; document.removeEventListener('keydown', onKey); drawCard(); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    $('.ts-x').onclick = close;
    const showEnd = html => { let e = $('.ts-end'); if (!e) { e = document.createElement('div'); e.className = 'ts-end'; $('.ts-st').appendChild(e); } e.innerHTML = `<div>${html}</div>`; return e; };
    const hideEnd = () => { const e = $('.ts-end'); if (e) e.remove(); };
    const pop = (x, y, txt, neg) => { const p = document.createElement('span'); p.className = 'tb-pop' + (neg ? ' neg' : ''); p.textContent = txt; p.style.left = x + 'px'; p.style.top = y + 'px'; field.appendChild(p); setTimeout(() => p.remove(), 800); };
    const hud = () => { const s = Math.max(0, Math.ceil((end - Date.now()) / 1000)); scEl.textContent = `${Math.min(score, GOAL)}/${GOAL}`; tmEl.textContent = `⏱ ${s}`; tmEl.classList.toggle('tb-low', s <= 7); };

    // жук выползает с края и бродит; время вышло — уползает за край
    const spawn = () => {
      const W = field.clientWidth, H = field.clientHeight, r = Math.random();
      const kind = r < 0.2 ? 'spy' : r < 0.36 ? 'lady' : 'bug';
      const side = Math.floor(Math.random() * 4), m = 30;
      const x = side === 0 ? -m : side === 1 ? W + m : m + Math.random() * (W - 2 * m), y = side === 2 ? -m : side === 3 ? H + m : m + Math.random() * (H - 2 * m);
      const ang = Math.atan2(H / 2 - y + (Math.random() - .5) * H * .6, W / 2 - x + (Math.random() - .5) * W * .6);
      const el = document.createElement('button'); el.type = 'button'; el.className = 'tb-bug'; el.innerHTML = BUG[kind]; el.setAttribute('aria-label', kind);
      const b = { el, kind, x, y, ang, sp: (kind === 'spy' ? 150 : kind === 'lady' ? 70 : 105) * (0.85 + Math.random() * 0.4) * Math.min(1.4, Math.max(0.7, W / 700)), life: Date.now() + 2600 + Math.random() * 2600, turn: 0 };
      el.addEventListener('pointerdown', e => { e.preventDefault(); catchBug(b); });
      field.appendChild(el); bugs.push(b);
    };
    const catchBug = b => {
      if (b.gone || !end) return; b.gone = true; b.el.classList.add('caught'); setTimeout(() => b.el.remove(), 360);
      bugs = bugs.filter(x => x !== b);
      if (b.kind === 'lady') { end -= 3000; pop(b.x, b.y, '−3 s', true); say(pick(SAY.lady)); }
      else { const n = b.kind === 'spy' ? 2 : 1; score += n; pop(b.x, b.y, '+' + n); if (Math.random() < .5 || b.kind === 'spy') say(pick(SAY[b.kind])); }
      hud(); if (score >= GOAL) finish(true);
    };
    let last = 0;
    const step = now => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      const W = field.clientWidth, H = field.clientHeight, T0 = Date.now();
      if (T0 >= spawnAt && bugs.length < MAXON) { spawn(); spawnAt = T0 + 380 + Math.random() * 520; }
      bugs = bugs.filter(b => {
        const leaving = T0 > b.life;
        if (--b.turn <= 0) { b.turn = 20 + Math.random() * 40; b.dir = (Math.random() - .5) * 3; }
        b.ang += b.dir * dt;
        if (!leaving) { // внутри стола — разворачиваться у края
          const m = 26;
          if (b.x < m && Math.cos(b.ang) < 0 || b.x > W - m && Math.cos(b.ang) > 0) b.ang = Math.PI - b.ang;
          if (b.y < m && Math.sin(b.ang) < 0 || b.y > H - m && Math.sin(b.ang) > 0) b.ang = -b.ang;
        }
        b.x += Math.cos(b.ang) * b.sp * dt; b.y += Math.sin(b.ang) * b.sp * dt;
        b.el.style.transform = `translate(${b.x}px,${b.y}px) rotate(${b.ang}rad)`;
        if (leaving && (b.x < -50 || b.x > W + 50 || b.y < -50 || b.y > H + 50)) { b.el.remove(); return false; }
        return true;
      });
      if (end) raf = requestAnimationFrame(step);
    };
    const intro = () => {
      showEnd(`<h3>${t(T.h)}</h3><p>${t(T.rule)}</p><div class="ts-row"><button type="button" class="pill-btn tb-st">${t(T.go)}</button></div>`);
      $('.tb-st').onclick = () => { hideEnd(); begin(); };
    };
    const begin = () => {
      stop(); score = 0; hurried = false; busy = false; end = Date.now() + TIME * 1000; spawnAt = 0; last = 0;
      say(SAY.start); hud();
      raf = requestAnimationFrame(step);
      tick = setInterval(() => {
        hud(); const left = end - Date.now();
        if (!hurried && left < 8000) { hurried = true; say(SAY.hurry); }
        if (left <= 0) finish(false);
      }, 200);
    };
    play = intro;
    const finish = async win => {
      if (busy) return; busy = true; end = 0; clearInterval(tick); cancelAnimationFrame(raf);
      setTimeout(() => bugs.forEach(b => { b.el.remove(); }), 400);
      if (!win) {
        say(SAY.lost, 6000);
        showEnd(`<h3>${t(T.lost)}</h3><p>${Math.min(score, GOAL)}/${GOAL}</p><div class="ts-row"><button type="button" class="pill-btn tb-ag">${t(T.again)}</button><button type="button" class="pill-btn ts-c">${t(T.close)}</button></div>`);
        $('.ts-c').onclick = close; $('.tb-ag').onclick = () => { hideEnd(); begin(); };
        return;
      }
      say(SAY.win, 9000);
      const [c, max] = coffee(), cups = (run && run.cups) || cupsOf(), extra = Math.max(0, c + cups - max), sellN = Math.min(extra, S && typeof S.sellLeft === 'number' ? S.sellLeft : extra);
      const per = (S && S.prices && S.prices.sell) || 1;
      let sell = false;
      if (sellN > 0) sell = await new Promise(res => {
        showEnd(`<p>${t(T.full)(sellN, sellN * per)}</p><div class="ts-row"><button type="button" class="pill-btn ts-y">${t(T.yes)}</button><button type="button" class="pill-btn ts-n">${t(T.no)}</button></div>`);
        $('.ts-y').onclick = () => res(true); $('.ts-n').onclick = () => res(false);
      });
      if (DEMO) { endCard({ gained: Math.min(cups, max - c), sold: sell ? sellN : 0, buttons: sell ? sellN * per : 0 }, c, max); return; }
      showEnd(`<p>${t(T.checking)}</p>`);
      const rest = run.sec * 1000 + 300 - (Date.now() - run.t0); // сервер не засчитает быстрее — подождать сразу
      if (rest > 0) await new Promise(r => setTimeout(r, rest));
      const j = await api('/api/titos/coffee', { src: 'bugs', sell });
      run = null;
      if (j.error) { showEnd(`<p>${t(j.status === 429 && j.error === 'bugs' ? T.limit : T.err)}</p><div class="ts-row"><button type="button" class="pill-btn ts-c">${t(T.close)}</button></div>`); $('.ts-c').onclick = close; return; }
      if (j.buttons && window.PPAccount) window.PPAccount.check();
      endCard(j, c, max);
    };
    const endCard = (j, c0, max) => {
      const more = DEMO || leftOf() > 0;
      const e = showEnd(`<span class="ts-potbox big">${potSvg()}<b></b></span><h3>${t(T.win)}</h3><p>${t(T.got)(j.gained || 0)}</p>${j.sold ? `<p>${t(T.sold)(j.sold, j.buttons || 0)}</p>` : ''}
        <div class="ts-row">${more ? `<button type="button" class="pill-btn tb-ag">${t(T.again)}</button>` : ''}<button type="button" class="pill-btn ts-c">${t(T.close)}</button></div>`);
      const pb = e.querySelector('.ts-potbox'); setPot(pb, c0, max);
      requestAnimationFrame(() => setTimeout(() => { setPot(pb, Math.min(max, c0 + (j.gained || 0)), max); setPot(potEl, Math.min(max, c0 + (j.gained || 0)), max); }, 200));
      $('.ts-c').onclick = close;
      const ag = $('.tb-ag'); if (ag) ag.onclick = () => { if (DEMO) { hideEnd(); begin(); } else start(); };
    };
    intro();
  }
})();
