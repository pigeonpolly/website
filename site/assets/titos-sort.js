// «Разбери дела» на /titos/ (этап 9 А, docs/titos.md): у Титоса упали коробки — документы из стопки по 6 коробкам, чужие — в шредер.
// Раунд, клякса и награда — сервер: POST /api/titos/sort/{start,blot,done} (worker/titos.js, раунд — worker/titos-sort.js); кофе — addCoffee(…, 'sort').
// Повороты раунда: twin, wind, cat, urgent, wet, hint. Состояние кофейника наверху — событие 'pp:titos' (titos-ui.js).
// Проверка вида без сервера: ?sort=demo (раунд с поворотами из заглушки ниже).
(() => {
  const sec0 = document.getElementById('rm') && document.getElementById('rm').closest('section'); if (!sec0) return;
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0, LANG = ['en', 'ru', 'lv'][L];
  const t = a => a[L];
  const T = {
    h: ['🗂 Sort the cases', '🗂 Разбери дела', '🗂 Sakārto lietas'],
    lead: ['Titos dropped his boxes and the cases got all mixed up. Put each document into its case box; papers from other cases go to the shredder.', 'У Титоса упали коробки, и дела рассыпались. Разложите документы по коробкам дел, а бумаги чужих дел — в шредер.', 'Titosam nokrita kastes, un lietas sajaucās. Saliec dokumentus lietu kastēs, bet svešu lietu papīrus — smalcinātājā.'],
    per: [n => `+${n} ☕ for each level`, n => `+${n} ☕ за каждый уровень`, n => `+${n} ☕ par katru līmeni`],
    play: [n => `▶ Play · level ${n}`, n => `▶ Играть · уровень ${n}`, n => `▶ Spēlēt · ${n}. līmenis`],
    login: ['Sign in to play', 'Войдите, чтобы играть', 'Ieej, lai spēlētu'],
    lvl: ['Level', 'Уровень', 'Līmenis'],
    left: ['in the pile', 'в стопке', 'kaudzē'],
    shred: ['Shredder', 'Шредер', 'Smalcinātājs'],
    win: ['Window', 'Окно', 'Logs'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    caseOf: ['Case:', 'Дело:', 'Lieta:'],
    blot: ['An ink blot covers the case name', 'Клякса закрыла название дела', 'Tintes traips aizsedz lietas nosaukumu'],
    wash: [n => `🧽 Wash off · ${n} 🔘`, n => `🧽 Смыть · ${n} 🔘`, n => `🧽 Nomazgāt · ${n} 🔘`],
    guess: ['…or take a guess', '…или рискните угадать', '…vai mēģini uzminēt'],
    urgent: ['URGENT', 'СРОЧНО', 'STEIDZAMI'],
    hint: ['☕ Titos drank coffee — tap for a hint', '☕ Титос выпил кофе — нажмите, будет подсказка', '☕ Titoss izdzēra kafiju — piespied, būs padoms'],
    poor: ['Not enough buttons', 'Не хватает пуговок', 'Nepietiek pogu'],
    err: ['Something went wrong. Try again.', 'Что-то пошло не так. Попробуйте ещё раз.', 'Kaut kas nogāja greizi. Mēģini vēlreiz.'],
    done: [n => `Level ${n} sorted!`, n => `Уровень ${n} разобран!`, n => `${n}. līmenis sakārtots!`],
    got: [n => `+${n} ☕ in the coffee pot`, n => `+${n} ☕ в кофейник`, n => `+${n} ☕ kafijas kannā`],
    sold: [(c, b) => `${c} extra ☕ → +${b} 🔘`, (c, b) => `Лишние ${c} ☕ → +${b} 🔘`, (c, b) => `Liekās ${c} ☕ → +${b} 🔘`],
    full: [(c, b) => `The coffee pot is full. Trade the extra ${c} ☕ for ${b} 🔘?`, (c, b) => `Кофейник полон. Обменять лишние ${c} ☕ на ${b} 🔘?`, (c, b) => `Kafijas kanna ir pilna. Apmainīt liekās ${c} ☕ pret ${b} 🔘?`],
    yes: ['Trade', 'Обменять', 'Apmainīt'], no: ['No, thanks', 'Не надо', 'Nevajag'],
    next: ['Next level', 'Следующий уровень', 'Nākamais līmenis'],
    wait: ['Titos is checking the boxes…', 'Титос проверяет коробки…', 'Titoss pārbauda kastes…'],
    demo: ['Demo: no coffee is added', 'Проверка вида: кофе не начисляется', 'Demo: kafija netiek pieskaitīta'],
  };
  // реплики Титоса
  const SAY = {
    start: ['“Order is the mother of deduction. And the boxes are her children.”', '«Порядок — мать дедукции. А коробки — её дети.»', '“Kārtība ir dedukcijas māte. Un kastes — viņas bērni.”'],
    shred: [['“Well… I suppose this one is unnecessary.”', '«Ну… наверное, это ненужное.»', '“Nu… laikam šis nav vajadzīgs.”'], ['“The shredder approves.”', '«Шредер одобряет.»', '“Smalcinātājs piekrīt.”'], ['“If anything, I have a copy. Probably.”', '«Если что — у меня есть копия. Наверное.»', '“Ja kas — man ir kopija. Laikam.”']],
    wrong: [['“Hmm. Not that box.”', '«Хм. Не та коробка.»', '“Hmm. Ne tā kaste.”'], ['“That paper belongs elsewhere. Elementary.”', '«Этой бумаге не сюда. Элементарно.»', '“Šim papīram vieta citur. Elementāri.”']],
    noShred: ['“Stop! That is evidence from one of our boxes!”', '«Стоп! Это улика из наших коробок!»', '“Stop! Tas ir pierādījums no mūsu kastēm!”'],
    right: [['“Into the box. Excellent.”', '«В коробку. Отлично.»', '“Kastē. Lieliski.”'], ['“A clue in its place is half a solved case.”', '«Улика на месте — полдела раскрыто.»', '“Pierādījums savā vietā — puse lietas atrisināta.”']],
    twin: ['“Two folders with the same name? Look at the numbers.”', '«Две папки с одним названием? Смотрите на номера.»', '“Divas mapes ar vienu nosaukumu? Skatieties uz numuriem.”'],
    wind: ['“A draught! The document flew to the windowsill. Tap the window.”', '«Сквозняк! Документ сдуло на подоконник. Нажмите на окно.»', '“Caurvējš! Dokuments aizlidoja uz palodzes. Piespied logu.”'],
    cat: ['“The cat lay down in the box. Tap the cat — politely.”', '«Кот лёг в коробку. Нажмите на кота — вежливо.»', '“Kaķis apgūlās kastē. Piespied kaķi — pieklājīgi.”'],
    catNo: ['“The cat is in there. The cat is more important.”', '«Там кот. Кот важнее.»', '“Tur ir kaķis. Kaķis ir svarīgāks.”'],
    catGo: ['“Mrrr.” The cat left with dignity.', '«Мрр.» Кот ушёл с достоинством.', '“Murr.” Kaķis aizgāja ar cieņu.'],
    urgent: ['“Urgent clue! Quick, before it gets cold — like my coffee.”', '«Срочная улика! Скорее, пока не остыла — как мой кофе.»', '“Steidzams pierādījums! Ātri, kamēr nav atdzisis — kā mana kafija.”'],
    late: ['“Too late. The urgent clue took offence and hid.”', '«Опоздали. Срочная улика обиделась и спряталась.»', '“Par vēlu. Steidzamais pierādījums apvainojās un paslēpās.”'],
    wet: ['“Somebody spilled coffee on it. Not me. Probably.”', '«Кто-то пролил на него кофе. Не я. Наверное.»', '“Kāds uzlēja tam kafiju. Ne es. Laikam.”'],
    hint: ['“Coffee! Now I see everything. That one goes here.”', '«Кофе! Теперь я вижу всё. Это — сюда.»', '“Kafija! Tagad es redzu visu. Šis — šeit.”'],
    blot: ['“A blot. Wash it off — or trust your intuition.”', '«Клякса. Смыть — или довериться интуиции.»', '“Traips. Nomazgāt — vai uzticēties intuīcijai.”'],
    done: ['“The case of the fallen boxes is closed. Coffee, please.”', '«Дело об упавших коробках закрыто. Кофе, пожалуйста.»', '“Lieta par nokritušajām kastēm ir slēgta. Kafiju, lūdzu.”'],
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // старый стеклянный кофейник: колба, крышка, ручка; кофе — прямоугольник под clipPath, высота = доля
  const potSvg = () => `<svg class="ts-pot" viewBox="0 0 60 70" aria-hidden="true"><defs><clipPath id="ts-flask"><path d="M18 22h24l6 10c4 7 4 20 0 27-3 5-8 7-18 7s-15-2-18-7c-4-7-4-20 0-27z"/></clipPath></defs>
    <rect x="20" y="10" width="20" height="6" rx="2" fill="#3a2a1d"/><rect x="28" y="5" width="4" height="6" rx="2" fill="#3a2a1d"/><rect x="17" y="16" width="26" height="6" rx="1.5" fill="#5b4330"/>
    <g clip-path="url(#ts-flask)"><rect x="0" y="0" width="60" height="70" fill="rgba(200,220,230,.18)"/><rect class="ts-coffee" x="0" y="66" width="60" height="70" fill="#5a321e"/><rect class="ts-crema" x="0" y="66" width="60" height="2.2" fill="#a8673f"/></g>
    <path d="M18 22h24l6 10c4 7 4 20 0 27-3 5-8 7-18 7s-15-2-18-7c-4-7-4-20 0-27z" fill="none" stroke="#c8dce6" stroke-width="1.6"/>
    <path d="M14 34c-5 0-7 4-7 9s2 9 7 9" fill="none" stroke="#5b4330" stroke-width="3" stroke-linecap="round"/><path d="M22 30c-2 6-2 18 0 24" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
  const setPot = (el, c, max) => { // y кофе: дно 66, верх 24
    const y = 66 - Math.max(0, Math.min(1, c / max)) * 42;
    el.querySelectorAll('.ts-coffee, .ts-crema').forEach(r => r.setAttribute('y', y));
    const n = el.closest('.ts-potbox'); if (n) n.querySelector('b').textContent = `${c}/${max}`;
  };
  window.PPTitosPot = { potSvg, setPot }; // стеклянный кофейник — и для «Жуков» (titos-bugs.js)
  // клякса и шредер
  const BLOT = '<svg viewBox="0 0 60 24" class="ts-blot" aria-hidden="true"><path d="M8 12c-4-6 4-10 10-7 4-5 12-4 15 0 6-4 16-2 17 4 7 1 8 8 2 10-1 5-9 6-13 3-5 4-14 4-17 0-6 3-13 0-11-4-4 0-6-4-3-6z" fill="#1d1640"/><circle cx="54" cy="5" r="2.2" fill="#1d1640"/><circle cx="4" cy="20" r="1.6" fill="#1d1640"/></svg>';
  const SHRED = `<svg viewBox="0 0 40 36" aria-hidden="true"><rect x="3" y="4" width="34" height="10" rx="2" fill="#4a4a58"/><rect x="7" y="7" width="26" height="2" rx="1" fill="#16131f"/><rect x="5" y="14" width="30" height="20" rx="2" fill="#6b6b7d"/><path d="M10 18v12M15 18v12M20 18v12M25 18v12M30 18v12" stroke="#55556a" stroke-width="1.2"/><circle cx="32" cy="9" r="1.2" fill="#7bd88f"/></svg>`;

  const CSS = `
.ts-sec{margin-top:26px}
.ts-card{display:flex;gap:16px;align-items:center;flex-wrap:wrap;background:var(--bg-card);border:1px solid var(--line);border-radius:16px;padding:14px 16px}
.ts-card h2{font-family:var(--serif);font-size:1.2rem;margin:0 0 4px}.ts-card p{margin:0;color:var(--muted)}.ts-card .ts-i{flex:1 1 240px;min-width:0}
.ts-card small{display:block;color:var(--peach);margin-top:6px}
.ts-ov{position:fixed;inset:0;z-index:1000;background:rgba(14,9,30,.86);display:flex;align-items:center;justify-content:center;padding:12px}
.ts-st{position:relative;width:min(1080px,100%);height:min(700px,100%);border-radius:18px;overflow:hidden;background:#1b1233;color:#f3effa;display:grid;grid-template-rows:auto 1fr auto;font-family:var(--sans)}
.ts-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated;filter:brightness(.42) saturate(.85);pointer-events:none}
.ts-hd{position:relative;display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(20,13,40,.72)}
.ts-hd b{font-family:var(--serif);font-size:1.05rem}.ts-hd .ts-cnt{color:var(--muted);font-size:.9rem;white-space:nowrap}
.ts-x{margin-left:auto;background:none;border:1px solid var(--line);color:inherit;border-radius:99px;width:36px;height:36px;font-size:1.1rem;cursor:pointer}
.ts-potbox{display:flex;align-items:center;gap:4px;font-size:.85rem}.ts-pot{width:34px;height:40px}.ts-potbox.big .ts-pot{width:92px;height:108px}
.ts-coffee,.ts-crema{transition:y 1.6s ease-in-out}
.ts-main{position:relative;display:grid;grid-template-columns:1fr 300px;gap:14px;padding:14px;min-height:0}
.ts-boxes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:10px;min-height:0}
.ts-box{position:relative;display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(#b98552,#94643a);border:2px solid #5d3c1f;border-radius:8px 8px 10px 10px;padding:8px 10px;color:#2a1a0c;cursor:pointer;text-align:left;font:inherit;min-height:0;overflow:hidden}
.ts-box::before{content:'';position:absolute;left:0;right:0;top:0;height:22%;background:#a87543;border-bottom:2px solid #5d3c1f}
.ts-box .ts-no{position:relative;font-weight:800;font-size:.8rem;background:#f4ead2;border:1px solid #5d3c1f;border-radius:4px;padding:0 6px;align-self:flex-start}
.ts-box .ts-tt{position:relative;display:block;font-weight:700;font-size:.92rem;line-height:1.15;margin-top:4px;background:#f4ead2;border-radius:4px;padding:3px 6px}
.ts-box .ts-n{position:absolute;right:8px;top:6px;font-size:.75rem;font-weight:800;background:#2a1a0c;color:#f4ead2;border-radius:99px;padding:0 7px}
.ts-box.hint{box-shadow:0 0 0 4px #ffd36b,0 0 22px #ffd36b}
.ts-box.ok{animation:ts-ok .5s}.ts-box.no,.ts-doc.no{animation:ts-no .4s}
.ts-cat{position:absolute;left:50%;top:38%;transform:translateX(-50%);width:62%;max-width:120px;image-rendering:pixelated;cursor:pointer;filter:drop-shadow(0 2px 0 #0006)}
.ts-side{display:grid;grid-template-rows:auto 1fr auto;gap:10px;min-height:0}
.ts-win{position:relative;height:74px;border:3px solid #5d3c1f;border-radius:6px;background:linear-gradient(#7fb2e5,#cfe3f2);cursor:pointer;color:#16324f;font:inherit;font-size:.8rem;overflow:hidden}
.ts-win::after{content:'';position:absolute;left:50%;top:0;bottom:0;border-left:3px solid #5d3c1f}
.ts-win .ts-fly{position:absolute;left:28%;top:18%;font-size:1.6rem;animation:ts-flut 1s ease-in-out infinite}
.ts-pile{position:relative;display:flex;align-items:center;justify-content:center;min-height:0}
.ts-doc.s1{box-shadow:5px 5px 0 #e0d6bb,0 6px 14px #0007}.ts-doc.s2{box-shadow:5px 5px 0 #e0d6bb,10px 9px 0 #cfc4a5,0 8px 16px #0007}
.ts-doc{position:relative;width:88%;max-width:250px;background:#f6efd9;color:#2a1a0c;border-radius:6px;padding:12px 12px 10px;box-shadow:0 4px 10px #0007;touch-action:none;cursor:grab;user-select:none;text-align:center}
.ts-doc.drag{position:fixed;z-index:1002;pointer-events:none;width:220px;transform:rotate(-4deg)}
.ts-doc .ts-ico{font-size:2.4rem;line-height:1;display:block;height:46px}.ts-doc .ts-ico img{height:46px;image-rendering:pixelated}
.ts-doc .ts-nm{display:block;font-weight:800;margin:6px 0 4px}
.ts-doc .ts-lb{display:block;font-size:.85rem;border-top:1px dashed #a8946b;padding-top:6px;min-height:2.4em}
.ts-doc .ts-lb i{font-style:normal;color:#7a6440;font-size:.75rem}
.ts-doc.wet .ts-lb{color:#3d5a80;filter:blur(.4px);background:radial-gradient(circle at 30% 40%,#b9cde0aa,transparent 60%)}
.ts-blot{width:80%;height:30px;display:block;margin:2px auto}
.ts-doc .ts-bt{display:flex;flex-direction:column;gap:4px;align-items:center;margin-top:6px;font-size:.78rem;color:#7a6440}
.ts-doc .ts-bt button{font:inherit;font-weight:700;border:0;border-radius:99px;padding:5px 12px;background:#2b1a51;color:#f3effa;cursor:pointer}
.ts-doc .ts-stamp{position:absolute;right:-6px;top:-10px;transform:rotate(10deg);background:#c0392b;color:#fff;font-weight:900;font-size:.72rem;border-radius:4px;padding:2px 7px;letter-spacing:.06em}
.ts-doc .ts-cup{position:absolute;left:-10px;top:-12px;font-size:1.5rem;background:#ffd36b;border:0;border-radius:99px;width:40px;height:40px;cursor:pointer;animation:ts-pulse 1.2s infinite}
.ts-doc.away{animation:ts-wind .7s ease-in forwards}
.ts-sh{position:relative;display:flex;align-items:center;gap:10px;justify-content:center;background:#2c2b3a;border:2px solid #16131f;border-radius:10px;color:#e8e6f5;padding:8px;cursor:pointer;font:inherit;font-weight:700;overflow:visible}
.ts-sh svg{width:42px;height:38px}
.ts-strip{position:absolute;top:70%;width:3px;height:12px;background:#f6efd9;border-radius:1px;animation:ts-strip 1s ease-in forwards;pointer-events:none}
.ts-ti{position:relative;display:flex;align-items:flex-end;gap:10px;pointer-events:none;padding:0 14px 12px;min-height:64px}
.ts-ti img{width:30px;image-rendering:pixelated;flex:none}
.ts-say{background:#f4f0fa;color:#2b1a51;border-radius:12px 12px 12px 2px;padding:7px 11px;font-size:.88rem;line-height:1.3;box-shadow:0 2px 6px #0006}
.ts-say:empty{display:none}
.ts-end{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;background:rgba(20,13,40,.8);padding:16px}
.ts-end>div{background:var(--bg-card);border:1px solid var(--line);border-radius:16px;padding:20px;text-align:center;max-width:420px;width:100%}
.ts-end h3{font-family:var(--serif);margin:6px 0}.ts-end p{color:var(--muted);margin:6px 0}
.ts-end .ts-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px}
.ts-demo{position:absolute;right:10px;bottom:8px;font-size:.72rem;color:var(--muted)}
@keyframes ts-ok{40%{transform:scale(1.05)}}
@keyframes ts-no{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@keyframes ts-flut{50%{transform:translate(8px,-4px) rotate(12deg)}}
@keyframes ts-wind{to{transform:translate(120px,-260px) rotate(60deg) scale(.4);opacity:0}}
@keyframes ts-pulse{50%{transform:scale(1.12)}}
@keyframes ts-strip{to{transform:translateY(46px) rotate(var(--r,10deg));opacity:0}}
@media (max-width:700px){
  .ts-ov{padding:0}.ts-st{height:100%;border-radius:0}
  .ts-main{grid-template-columns:1fr;grid-template-rows:auto 1fr;gap:10px;padding:10px}
  .ts-boxes{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,auto);gap:7px}
  .ts-box{min-height:96px;padding:6px}.ts-box .ts-tt{font-size:.74rem;padding:2px 4px}.ts-box .ts-no{font-size:.7rem}
  .ts-side{grid-template-columns:1fr 92px;grid-template-rows:auto 1fr;gap:8px;align-items:start}
  .ts-pile{grid-column:1;grid-row:1/3;min-height:220px}.ts-win{grid-column:2;grid-row:1;height:64px}.ts-sh{grid-column:2;grid-row:2;flex-direction:column;gap:2px;font-size:.75rem}
  .ts-doc{width:94%;padding:10px 8px 8px}.ts-doc .ts-ico{font-size:2rem;height:38px}
  .ts-ti{padding:0 10px 10px}.ts-hd{gap:8px;padding:8px 10px}.ts-hd b{font-size:.92rem}
  .ts-sh{align-self:start;height:96px}
}
@media (prefers-reduced-motion:reduce){.ts-coffee,.ts-crema{transition:none}.ts-win .ts-fly,.ts-doc .ts-cup{animation:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  // ---------- карточка игры под кабинетом ----------
  const sec = document.createElement('section'); sec.className = 'rm-sec ts-sec'; sec0.after(sec);
  let S = null; // состояние кофейника (titosState)
  const signed = () => !!(window.PPWho && window.PPWho.user && window.PPWho.user.nick);
  const DEMO = new URLSearchParams(location.search).get('sort') === 'demo';
  const drawCard = () => {
    const lv = ((S && S.sort) || 0) + 1, cups = (S && S.prices && S.prices.sort) || 2;
    sec.innerHTML = `<div class="ts-card"><div class="ts-potbox big">${potSvg()}<b hidden></b></div><div class="ts-i"><h2>${t(T.h)}</h2><p>${t(T.lead)}</p><small>${t(T.per)(cups)}</small></div>
      <button type="button" class="pill-btn ts-go">${signed() || DEMO ? t(T.play)(lv) : t(T.login)}</button></div>`;
    if (S) setPot(sec, S.coffee, S.max); else setPot(sec, 10, 10);
    sec.querySelector('.ts-go').onclick = () => DEMO ? open(demoRound()) : signed() ? start() : window.PPAccount && window.PPAccount.openSignIn && window.PPAccount.openSignIn();
  };
  document.addEventListener('pp:titos', e => { if (e.detail && typeof e.detail.coffee === 'number') { S = { ...S, ...e.detail }; if (!ov) drawCard(); } });
  document.addEventListener('pp:whoami', e => { const s = e.detail && e.detail.user && e.detail.user.titos; if (s) S = { ...S, ...s }; if (!ov) drawCard(); });
  if (window.PPWho && window.PPWho.user && window.PPWho.user.titos) S = window.PPWho.user.titos;
  drawCard();

  const api = async (path, body) => {
    try {
      const r = await fetch(`${path}?lang=${LANG}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}), credentials: 'same-origin' });
      const j = await r.json().catch(() => ({}));
      if (j.state) { S = { ...S, ...j.state }; document.dispatchEvent(new CustomEvent('pp:titos', { detail: j.state })); }
      return r.ok ? j : { ...j, error: j.error || 'server', status: r.status };
    } catch (e) { return { error: 'net' }; }
  };
  const start = async () => {
    const j = await api('/api/titos/sort/start');
    if (j.error) { (window.PPToast || alert)(t(T.err)); return; }
    open({ ...j.round, lv: j.lv, blotPrice: j.blot, cups: j.cups, sec: j.sec || 0, t0: Date.now() });
  };

  // ---------- раунд ----------
  let ov = null;
  function open(R) {
    ov = document.createElement('div'); ov.className = 'ts-ov'; document.body.appendChild(ov);
    const prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const left = R.docs.slice(); // стопка: первый — верхний
    const inBox = R.boxes.map(() => 0);
    let catOn = false, catDone = !R.cat, hintN = 0, placed = 0, windAway = null, timer = null, sayI = 0, busy = false;
    ov.innerHTML = `<div class="ts-st" role="dialog" aria-label="${esc(t(T.h))}"><img class="ts-bg" src="/images/rooms/detective-day.png" alt="">
      <div class="ts-hd"><b>${t(T.h)} · ${t(T.lvl)} ${R.lv}</b><span class="ts-cnt"></span><span class="ts-potbox">${potSvg()}<b></b></span><button type="button" class="ts-x" aria-label="${t(T.close)}">✕</button></div>
      <div class="ts-main"><div class="ts-boxes">${R.boxes.map((b, i) => `<button type="button" class="ts-box" data-b="${i}"><span class="ts-n">0</span><span class="ts-no">${esc(b.no)}</span><span class="ts-tt">${esc(b.title)}</span></button>`).join('')}</div>
        <div class="ts-side"><button type="button" class="ts-win" aria-label="${t(T.win)}"></button><div class="ts-pile"></div><button type="button" class="ts-sh" data-b="-1">${SHRED}<span>${t(T.shred)}</span></button></div></div>
      <div class="ts-ti"><img src="/images/rooms/detective-titos.png" alt=""><div class="ts-say" aria-live="polite"></div></div>${DEMO ? `<div class="ts-demo">${t(T.demo)}</div>` : ''}</div>`;
    const $ = s => ov.querySelector(s), pile = $('.ts-pile'), win = $('.ts-win'), sayEl = $('.ts-say');
    const potEl = $('.ts-hd .ts-potbox');
    const coffee = () => S ? [S.coffee, S.max] : [10, 10];
    setPot(potEl, ...coffee());
    let sayT = null;
    const say = (s, ms = 3800) => { sayEl.textContent = t(s); clearTimeout(sayT); sayT = setTimeout(() => { sayEl.textContent = ''; }, ms); };
    const close = () => { clearInterval(timer); ov.remove(); ov = null; document.body.style.overflow = prevOverflow; document.removeEventListener('keydown', onKey); drawCard(); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    $('.ts-x').onclick = close;
    if (R.twists.includes('twin')) say(SAY.twin, 5000); else say(SAY.start);

    // перевод «подмоченного» текста: часть букв расплылась
    const wetText = s => [...s].map((c, i) => /\s/.test(c) || (i * 7 + s.length) % 3 ? c : '·').join('');
    const top = () => left[0];
    const draw = () => {
      clearInterval(timer);
      $('.ts-cnt').textContent = `· ${left.length} ${t(T.left)}`;
      ov.querySelectorAll('.ts-box').forEach((b, i) => { b.querySelector('.ts-n').textContent = inBox[i]; b.classList.toggle('hint', hintN > 0 && top() && top().box === i); });
      // кот ложится в коробку, когда разложено R.cat.at документов
      if (!catDone && !catOn && placed >= R.cat.at) {
        catOn = true; const b = ov.querySelector(`.ts-box[data-b="${R.cat.box}"]`);
        b.insertAdjacentHTML('beforeend', '<img class="ts-cat" src="/images/rooms/prop-cat.png" alt="🐈">'); say(SAY.cat, 5000);
        b.querySelector('.ts-cat').onclick = e => { e.stopPropagation(); e.target.remove(); catOn = false; catDone = true; say(SAY.catGo); };
      }
      win.innerHTML = windAway ? `<span class="ts-fly">${windAway.emo || '📄'}</span>` : '';
      const d = top();
      if (!d) { pile.innerHTML = ''; finish(); return; }
      pile.innerHTML = `<div class="ts-doc${d.wet ? ' wet' : ''}${left.length > 2 ? ' s2' : left.length > 1 ? ' s1' : ''}">${d.urgent ? `<span class="ts-stamp">${t(T.urgent)} · <span class="ts-sec">${d.urgent}</span></span>` : ''}${d.hint && !d.hintUsed ? `<button type="button" class="ts-cup" title="${esc(t(T.hint))}" aria-label="${esc(t(T.hint))}">☕</button>` : ''}
          <span class="ts-ico">${d.icon ? `<img src="${esc(d.icon)}" alt="">` : esc(d.emo || '📄')}</span><span class="ts-nm">${esc(d.name)}</span>
          <span class="ts-lb">${d.blot && !d.label ? `${BLOT}<span class="ts-bt"><span>${t(T.blot)}</span>${R.blotPrice > 0 ? `<button type="button" class="ts-wash">${t(T.wash)(R.blotPrice)}</button>` : ''}<span>${t(T.guess)}</span></span>`
            : `<i>${t(T.caseOf)}</i> ${esc(d.wet ? wetText(d.label) : d.label)}`}</span></div>`;
      const el = pile.querySelector('.ts-doc');
      dragOf(el);
      const cup = el.querySelector('.ts-cup'); if (cup) cup.onclick = e => { e.stopPropagation(); d.hintUsed = true; hintN = 3; say(SAY.hint); draw(); };
      const w = el.querySelector('.ts-wash'); if (w) w.onclick = e => { e.stopPropagation(); wash(d); };
      if (d.blot && !d.label && !d.said) { d.said = true; say(SAY.blot); }
      if (d.wet && !d.said) { d.said = true; say(SAY.wet); }
      if (d.urgent) { // срочная: свой таймер; не успели — улика «обиделась»
        if (!d.said) { d.said = true; say(SAY.urgent); }
        timer = setInterval(() => { d.urgent--; const s = el.querySelector('.ts-sec'); if (s) s.textContent = Math.max(0, d.urgent); if (d.urgent <= 0) { clearInterval(timer); left.shift(); placed++; say(SAY.late); draw(); } }, 1000);
      }
      if (d.wind && !d.blown) { // сквозняк: через миг документ улетает на подоконник
        d.blown = true;
        setTimeout(() => { if (top() !== d || drag) return; el.classList.add('away'); say(SAY.wind, 5000); setTimeout(() => { if (top() !== d) return; windAway = left.shift(); draw(); }, 650); }, 900);
      }
    };
    win.onclick = () => { if (!windAway) return; left.unshift(windAway); windAway = null; draw(); };
    const wash = async d => {
      if (DEMO) { d.label = R.secret ? R.secret[d.i] : '?'; draw(); return; }
      const j = await api('/api/titos/sort/blot', { lv: R.lv, i: d.i });
      if (j.error) { (window.PPToast || alert)(j.status === 402 ? t(T.poor) : t(T.err)); return; }
      d.label = j.label; if (j.paid && window.PPAccount) window.PPAccount.check(); draw();
    };
    // положить верхний документ в коробку b (−1 — шредер)
    const put = b => {
      const d = top(); if (!d || busy) return;
      const target = b < 0 ? $('.ts-sh') : ov.querySelector(`.ts-box[data-b="${b}"]`);
      if (b >= 0 && catOn && b === R.cat.box) { say(SAY.catNo); target.classList.remove('no'); void target.offsetWidth; target.classList.add('no'); return; }
      if (d.box !== b) {
        say(b < 0 ? SAY.noShred : pick(SAY.wrong));
        const el = pile.querySelector('.ts-doc'); [el, target].forEach(x => { if (!x) return; x.classList.remove('no'); void x.offsetWidth; x.classList.add('no'); });
        return;
      }
      left.shift(); placed++; if (hintN > 0) hintN--;
      if (b < 0) { say(SAY.shred[sayI++ % 3]); strips(target); } else { inBox[b]++; target.classList.remove('ok'); void target.offsetWidth; target.classList.add('ok'); if (Math.random() < .3) say(pick(SAY.right), 2200); }
      draw();
    };
    const strips = el => { for (let i = 0; i < 9; i++) { const s = document.createElement('i'); s.className = 'ts-strip'; s.style.left = `${30 + i * 5}%`; s.style.setProperty('--r', `${(Math.random() * 40 - 20) | 0}deg`); s.style.animationDelay = `${i * 40}ms`; el.appendChild(s); setTimeout(() => s.remove(), 1300); } };
    ov.querySelectorAll('.ts-box, .ts-sh').forEach(b => { b.onclick = () => put(Number(b.dataset.b)); });
    // перетаскивание верхнего документа (мышь и палец); короткое касание — ничего, коробку можно просто нажать
    let drag = null;
    function dragOf(el) {
      el.onpointerdown = e => {
        if (e.target.closest('button')) return;
        const r = el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
        let ghost = null;
        drag = { id: e.pointerId };
        const move = ev => {
          if (!ghost) { if (Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 6) return; ghost = el.cloneNode(true); ghost.classList.add('drag'); document.body.appendChild(ghost); el.style.opacity = '.3'; }
          ghost.style.left = `${ev.clientX - Math.min(dx, 110)}px`; ghost.style.top = `${ev.clientY - dy / 2}px`;
        };
        const up = ev => {
          window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
          drag = null; if (!ghost) return;
          ghost.remove(); el.style.opacity = '';
          const at = document.elementFromPoint(ev.clientX, ev.clientY), b = at && at.closest('.ts-box, .ts-sh');
          if (b && ov && ov.contains(b)) put(Number(b.dataset.b));
        };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      };
    }
    // всё разложено: полный кофейник — спросить про обмен лишнего; потом /done (сервер проверит время)
    const finish = async () => {
      if (busy) return; busy = true;
      say(SAY.done, 9000);
      const [c, max] = coffee(), cups = R.cups || 2, extra = Math.max(0, c + cups - max), sellN = Math.min(extra, S && typeof S.sellLeft === 'number' ? S.sellLeft : extra);
      const per = (S && S.prices && S.prices.sell) || 1;
      let sell = false;
      if (sellN > 0) sell = await ask(t(T.full)(sellN, sellN * per));
      if (DEMO) { endCard({ gained: Math.min(cups, max - c), sold: sell ? sellN : 0, buttons: sell ? sellN * per : 0 }, c, max); return; }
      showEnd(`<p>${t(T.wait)}</p>`);
      const rest = R.docs.length * R.sec * 1000 + 300 - (Date.now() - R.t0); // сервер не засчитает быстрее — подождать сразу
      if (rest > 0) await new Promise(r => setTimeout(r, rest));
      let j;
      for (let k = 0; k < 6; k++) { // слишком быстро — сервер ответит 'fast': подождать и спросить ещё раз
        j = await api('/api/titos/sort/done', { lv: R.lv, sell });
        if (j.error !== 'fast') break;
        await new Promise(r => setTimeout(r, 1500));
      }
      if (j.error) { showEnd(`<p>${t(T.err)}</p><div class="ts-row"><button type="button" class="pill-btn ts-c">${t(T.close)}</button></div>`); $('.ts-c').onclick = close; return; }
      if (j.buttons && window.PPAccount) window.PPAccount.check();
      endCard(j, c, max);
    };
    const showEnd = html => { let e = $('.ts-end'); if (!e) { e = document.createElement('div'); e.className = 'ts-end'; $('.ts-st').appendChild(e); } e.innerHTML = `<div>${html}</div>`; return e; };
    const ask = q => new Promise(res => {
      showEnd(`<p>${q}</p><div class="ts-row"><button type="button" class="pill-btn ts-y">${t(T.yes)}</button><button type="button" class="pill-btn ts-n">${t(T.no)}</button></div>`);
      $('.ts-y').onclick = () => res(true); $('.ts-n').onclick = () => res(false);
    });
    const endCard = (j, c0, max) => {
      const e = showEnd(`<span class="ts-potbox big">${potSvg()}<b></b></span><h3>${t(T.done)(R.lv)}</h3><p>${t(T.got)(j.gained || 0)}</p>${j.sold ? `<p>${t(T.sold)(j.sold, j.buttons || 0)}</p>` : ''}
        <div class="ts-row"><button type="button" class="pill-btn ts-nx">${t(T.next)}</button><button type="button" class="pill-btn ts-c">${t(T.close)}</button></div>`);
      const pb = e.querySelector('.ts-potbox'); setPot(pb, c0, max);
      requestAnimationFrame(() => setTimeout(() => { setPot(pb, Math.min(max, c0 + (j.gained || 0)), max); setPot(potEl, Math.min(max, c0 + (j.gained || 0)), max); }, 200)); // видно, как наливается
      $('.ts-c').onclick = close;
      $('.ts-nx').onclick = () => { close(); DEMO ? open(demoRound(R.lv + 1)) : start(); };
    };
    draw();
  }

  // ---------- заглушка для ?sort=demo ----------
  function demoRound(lv = 30) {
    const B = [['№1', ['The Stolen Syrup', 'Украденный сироп', 'Nozagtais sīrups'][L]], ['№2', ['A Spy Among the Cucumbers', 'Шпион среди огурцов', 'Spiegs starp gurķiem'][L]], ['А-3', t(['The Puddle Thief', 'Похититель луж', 'Peļķu zaglis'])],
      ['А-9', t(['The Jam Jar Mystery', 'Тайна банки с вареньем', 'Ievārījuma burkas noslēpums'])], ['А-14', t(['The Ghost in the Bakery', 'Привидение в пекарне', 'Spoks maiznīcā'])], ['А-18', t(['The Snoring Lighthouse', 'Храпящий маяк', 'Krācošā bāka'])]];
    const D = (emo, nm, b, x = {}) => ({ emo, name: t(nm), label: b < 0 ? t(['The Runaway Scarf', 'Сбежавший шарф', 'Aizbēgušais šalle']) : B[b][1], box: b, ...x });
    const docs = [
      D('🪶', ['Feather', 'Перо', 'Spalva'], 0, { hint: true }), D('🧣', ['Fringe of a scarf', 'Бахрома шарфа', 'Šalles bārkstis'], -1), D('🧤', ['Glove by the lamp post', 'Перчатка у фонаря', 'Cimds pie laternas'], 1, { urgent: 12 }),
      D('👢', ['Rubber boot print', 'След резинового сапога', 'Gumijas zābaka nospiedums'], 2, { blot: true }), D('🍓', ['Strawberry stem', 'Хвостик клубники', 'Zemenes kātiņš'], 3, { wet: true }),
      D('🥖', ['Half a baguette', 'Полбагета', 'Puse bagetes'], 4, { wind: true }), D('🐚', ['Seashell', 'Ракушка', 'Gliemežvāks'], 5), D('📮', ['Returned letter', 'Вернувшееся письмо', 'Atgriezta vēstule'], -1),
    ].map((d, i) => ({ ...d, i }));
    const secret = {}; docs.forEach(d => { if (d.blot) { secret[d.i] = d.label; d.label = ''; } });
    return { lv, boxes: B.map(([no, title]) => ({ no, title })), docs, cat: { box: 5, at: 1 }, twists: ['cat', 'urgent', 'wet', 'hint', 'wind'], secret, blotPrice: 1, cups: 2 };
  }
})();
