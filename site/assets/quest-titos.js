// Детектив Титос поверх rooms.js (window.ROOM): один движок, дела — данные с сервера (/api/titos/case, content/titos/NNN.json, docs/titos.md).
// Сервер ведёт дело (кофе, найденные улики, обвинение, пуговки); без входа — открытые дела №1–2 без кофе и наград. Свой прогресс окна — localStorage (ключ дела).
(() => {
  const A = window.ROOM; if (!A || A.R == null || document.getElementById('rm').dataset.room !== 'detective') return;
  const { box, R, L, esc, pct } = A;
  const t = o => typeof o === 'string' ? o : o == null ? '' : o[L];
  const UI = {
    caseNo: ['Case No.', 'Дело №', 'Lieta Nr.'], soon: ['coming soon', 'скоро', 'drīzumā'],
    clues: ['Clues on the board', 'Улик на доске', 'Pierādījumi uz dēļa'],
    board: ['📌 Evidence board', '📌 Доска улик', '📌 Pierādījumu dēlis'],
    inv: ['Pockets', 'Карманы', 'Kabatas'],
    pin: ['📌 Pin to the board', '📌 Приколоть на доску', '📌 Piespraust pie dēļa'],
    pinned: ['On the board ✓', 'Уже на доске ✓', 'Jau uz dēļa ✓'],
    exam: ['🔍 Examine with the magnifier', '🔍 Рассмотреть под лупой', '🔍 Apskatīt ar lupu'],
    needMag: ['You need a magnifying glass. There is one on the filing cabinet, next to the coffee pot.', 'Нужна лупа. Она лежит на шкафу с документами, рядом с кофейником.', 'Vajag lupu. Tā ir uz dokumentu skapja, blakus kafijas kannai.'],
    smeared: ['Something is smeared on it. Too small to see with the naked eye.', 'На этом что-то размазано. Невооружённым глазом не разглядеть.', 'Uz tā kaut kas ir nosmērēts. Ar neapbruņotu aci neredz.'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    suspects: ['Suspects', 'Подозреваемые', 'Aizdomās turamie'],
    noDoss: ['The suspects’ folders are in the filing cabinet drawer.', 'Папки подозреваемых — в ящике шкафа с документами.', 'Aizdomās turamo mapes ir dokumentu skapja atvilktnē.'],
    accuseBtn: ['Accuse', 'Обвинить', 'Apsūdzēt'],
    magGot: ['You take the magnifying glass. Now clues can be examined.', 'Вы берёте лупу. Теперь улики можно рассмотреть.', 'Tu paņem lupu. Tagad pierādījumus var apskatīt.'],
    solvedT: ['CASE CLOSED', 'ДЕЛО ЗАКРЫТО', 'LIETA SLĒGTA'],
    again: ['Investigate again', 'Расследовать заново', 'Izmeklēt vēlreiz'],
    needAll: [n => `Pin all ${n} clues to the board first.`, n => `Сначала приколите на доску все ${n} улик.`, n => `Vispirms piesprauž pie dēļa visus ${n} pierādījumus.`],
    scene: ['🖼 Crime scene', '🖼 Место происшествия', '🖼 Notikuma vieta'],
    sceneHint: ['Click the people and things in the photo.', 'Нажимайте на людей и вещи на фото.', 'Spied uz cilvēkiem un lietām foto.'],
    guideT: ['What to do', 'Что делать', 'Ko darīt'],
    gMag: ['Take the magnifying glass: it is on the filing cabinet, next to the coffee pot', 'Возьмите лупу: она лежит на шкафу с документами, рядом с кофейником', 'Paņem lupu: tā ir uz dokumentu skapja, blakus kafijas kannai'],
    gSearch: [n => `Search the office: tap folders, papers, the dictaphone, the bin, the coat and everything that sticks out (${n} found)`, n => `Обыщите кабинет: нажимайте на папки, бумаги, диктофон, корзину, плащ и всё, что выделяется (найдено ${n})`, n => `Pārmeklē kabinetu: spied uz mapēm, papīriem, diktofonu, grozu, mēteli un visu, kas izceļas (atrasti ${n})`],
    gScene: ['Open “🖼 Crime scene” and tap everything that blinks', 'Откройте «🖼 Место происшествия» и нажимайте на всё, что мигает', 'Atver “🖼 Notikuma vieta” un spied uz visu, kas mirgo'],
    gExam: [(n, m) => `Examine the small clues with the magnifier (${n}/${m})`, (n, m) => `Рассмотрите мелкие улики под лупой (${n}/${m})`, (n, m) => `Apskati sīkos pierādījumus ar lupu (${n}/${m})`],
    gPin: [(n, m) => `Pin every clue to the evidence board (${n}/${m})`, (n, m) => `Приколите все улики на доску (${n}/${m})`, (n, m) => `Piesprauž visus pierādījumus pie dēļa (${n}/${m})`],
    gDoss: ['Read the suspects’ folders (filing cabinet drawer)', 'Изучите папки подозреваемых (ящик шкафа)', 'Izlasi aizdomās turamo mapes (skapja atvilktne)'],
    gAcc: ['Name the culprit on the evidence board', 'Назовите виновного на доске улик', 'Nosauc vainīgo uz pierādījumu dēļa'],
    sceneSwipe: ['The photo scrolls sideways.', 'Фото листается вбок.', 'Foto var ritināt uz sāniem.'],
    ask: ['🗣 Interrogation', '🗣 Допрос', '🗣 Nopratināšana'],
    askAll: ['Ask all three questions first.', 'Сначала задайте все три вопроса.', 'Vispirms uzdodiet visus trīs jautājumus.'],
    pinW: ['📌 Pin the statement to the board', '📌 Приколоть показания на доску', '📌 Piespraust liecību pie dēļa'],
    gTalk: [(n, m) => `Question the witnesses, every question (${n}/${m})`, (n, m) => `Допросите свидетелей, все вопросы (${n}/${m})`, (n, m) => `Nopratini lieciniekus, visus jautājumus (${n}/${m})`],
    accDef: ['Who did it?', 'Кто это сделал?', 'Kurš to izdarīja?'],
    nocoffee: [m => `The coffee pot is empty. Titos is asleep. Next cup in ${m} min.`, m => `Кофейник пуст. Титос спит. Следующая чашка через ${m} мин.`, m => `Kafijas kanna ir tukša. Titoss guļ. Nākamā tase pēc ${m} min.`],
    asleep: ['I am not asleep. I am analysing with my eyes closed.', 'Я не сплю. Я анализирую с закрытыми глазами.', 'Es neguļu. Es analizēju ar aizvērtām acīm.'],
    wake: ['☕ Wake Titos (1 cup)', '☕ Разбудить Титоса (1 чашка)', '☕ Pamodināt Titosu (1 tase)'],
    loginMore: ['Sign in to open the next cases and earn buttons.', 'Войдите, чтобы открыть следующие дела и получать пуговки.', 'Ienāc, lai atvērtu nākamās lietas un saņemtu pogas.'],
    err: ['Something went wrong. Try again.', 'Что-то пошло не так. Попробуйте ещё раз.', 'Kaut kas nogāja greizi. Mēģini vēlreiz.'],
    total: [(n, m) => `📁 Cases on the site: ${n} of ${m}`, (n, m) => `📁 Дел на сайте: ${n} из ${m}`, (n, m) => `📁 Lietas vietnē: ${n} no ${m}`],
    allDone: [(n, m) => `That was the last case on the site so far — you have solved them all! Cases ${n + 1}–${m} are still in development. They will open here on their own, and Titos is already brewing coffee for them.`, (n, m) => `Это последнее дело на сайте — пока. Всё раскрыто! Дела ${n + 1}–${m} ещё в разработке. Они откроются здесь сами, а Титос уже варит для них кофе.`, (n, m) => `Šī ir pēdējā lieta vietnē — pagaidām. Viss atrisināts! Lietas ${n + 1}–${m} vēl tiek izstrādātas. Tās atvērsies šeit pašas, un Titoss jau vāra tām kafiju.`],
    devNote: [(n, m) => `🛠 All cases on the site are solved. Cases ${n + 1}–${m} are in development and will open here on their own.`, (n, m) => `🛠 Все дела на сайте раскрыты. Дела ${n + 1}–${m} в разработке — они откроются здесь сами.`, (n, m) => `🛠 Visas lietas vietnē ir atrisinātas. Lietas ${n + 1}–${m} tiek izstrādātas un atvērsies šeit pašas.`],
    got: [n => `+${n} 🔘 for the case`, n => `+${n} 🔘 за дело`, n => `+${n} 🔘 par lietu`],
    prize: ['🎁 Case keepsake — already in your bag:', '🎁 Память о деле — уже в сумке:', '🎁 Lietas piemiņa — jau somā:'],
    toRoom: ['🏠 To my room', '🏠 В мою комнату', '🏠 Uz manu istabu'],
  };
  // ---------- дело с сервера (content/titos/NNN.json, язык страницы) → то, что рисует движок ----------
  const LANG = ['en', 'ru', 'lv'][L], LEVELS = 100; // всего уровней в игре (docs/titos.md)
  const OLD = { 1: 'pp-titos-syrup-case', 2: 'pp-titos-cucumber-case' }; // прогресс бывших «Дела №1» и «Дела №2» в localStorage
  const api = async (path, body) => {
    try {
      const r = await fetch(path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' } : { credentials: 'same-origin' });
      const j = await r.json().catch(() => ({}));
      if (j.state) document.dispatchEvent(new CustomEvent('pp:titos', { detail: j.prices ? { ...j.state, prices: j.prices } : j.state })); // кофейник и награды наверху (titos-ui.js)
      return r.ok ? j : { ...j, error: j.error || 'server', status: r.status };
    } catch (e) { return { error: 'net' }; }
  };
  const load = k => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; } };
  const fromData = d => {
    const C = {}, S = {}, W = {}, talkClue = {};
    (d.talk || []).forEach(x => { if (x.clue) talkClue[x.clue] = x.to; });
    for (const x of d.clues) C[x.id] = { hot: x.at && !x.at.startsWith('scene:') ? x.at : null, title: x.title, text: x.text, pre: x.pre, emo: x.emo, icon: x.icon,
      kind: talkClue[x.id] ? 'witness' : x.lens ? 'analyze' : x.kind === 'listen' ? 'listen' : 'read', w: talkClue[x.id], herring: !!x.photo, sprite: x.spot && x.icon ? x.spot : null };
    for (const s of d.suspects) S[s.id] = { name: s.name, text: s.alibi, img: s.img || '' };
    const who = id => S[id] || (d.people || []).find(p => p.id === id) || {};
    (d.talk || []).forEach(x => { const p = who(x.to); (W[x.to] = W[x.to] || { img: p.img, name: p.name, qa: [] }).qa.push([x.q, x.a]); });
    const ORDER = d.clues.map(x => x.id), n = ORDER.length;
    // доска: у старых дел — своя раскладка, у новых — сетка по 4 и нити по порядку
    const POS = d.board ? d.board.pos : ORDER.map((_, i) => [3 + (i % 4) * 24, 6 + Math.floor(i / 4) * 40]);
    const STR = d.board ? d.board.str : ORDER.slice(1).map((_, i) => [i, i + 1]);
    const scenes = (d.scenes || []).map(s => ({ ...s, zones: (s.spots || []).map(z => ({ ...z, wit: z.talk })) }));
    return { no: d.n, key: OLD[d.n] || 'pp-titos-case-' + d.n, C, ORDER, S, W, scenes, scene: scenes[0] || null, title: d.title,
      label: `${t(UI.caseNo)} ${d.n} · ${d.title}`, accuse: d.ask || t(UI.accDef), intro: d.intro, bye: d.bye || t(UI.asleep), sus: k => S[k].img, STR, POS, big: n > 7 };
  };
  const start = async () => {
    const info = await api(`/api/titos?lang=${LANG}`);
    if (info.error) return;
    const srv = { on: !!info.play && info.on !== false, state: info.state || {}, top: Math.max(0, ...(info.cases || []).map(c => c.n)) }; // top — последнее дело на сайте
    // кто раскрыл бывшие дела №1 и №2 раньше (localStorage) — засчитать без пуговок
    if (srv.on) {
      const solved = Object.entries(OLD).filter(([, k]) => load(k).solved).map(([n]) => +n);
      if (solved.some(n => n > (srv.state.level || 0))) { const r = await api('/api/titos/legacy', { solved }); if (r.state) srv.state = r.state; }
    }
    const open = srv.on ? (srv.state.level || 0) + 1 : 2;
    const CASES = (info.cases || []).filter(c => c.n <= open);
    if (!CASES.length) return;
    let pick = 0; try { pick = Number(localStorage.getItem('pp-titos-case')) || 0; } catch (e) {}
    if (!CASES.some(c => c.n === pick)) pick = srv.on ? CASES[CASES.length - 1].n : load(OLD[1]).solved ? Math.min(2, CASES.length) : 1; // по умолчанию — первое нераскрытое
    const cd = await api(`/api/titos/case?n=${pick}&lang=${LANG}`);
    if (!cd.case) return;
    engine(fromData(cd.case), CASES, srv);
  };
  const engine = (K, CASES, srv) => {
  const { C, ORDER, S } = K, N = ORDER.length;
  let st = Object.assign({ found: [], pinned: [], analyzed: [], asked: {}, mag: false, dossiers: false, solved: false, tries: 0 }, load(K.key));
  const save = () => { try { localStorage.setItem(K.key, JSON.stringify(st)); } catch (e) {} };
  const ico = id => C[id].emo ? `<b class="q-emo">${C[id].emo}</b>` : `<img src="${C[id].icon || '/images/rooms/prop-mail.png'}" alt="">`;
  // --- сервер: дело идёт, пока Титос пьёт кофе. Первое действие начинает дело (1 чашка); уснул — разбудить кнопкой
  const reported = () => [...(st.mag ? ['lens'] : []), ...ORDER.filter(id => st.found.includes(id) && (C[id].kind === 'analyze' ? st.analyzed.includes(id) : C[id].kind === 'witness' ? (st.asked[C[id].w] || []).length >= K.W[C[id].w].qa.length : true))];
  const sync = async () => { // найденное здесь, но ещё не на сервере (старый прогресс, обрыв сети)
    for (const id of reported()) if (!(srv.state.found || []).includes(id)) { const r = await api('/api/titos/clue', { n: K.no, id }); if (r.state) srv.state = r.state; else return r; }
    return {};
  };
  const go = async (wake) => {
    if (!srv.on || st.solved) return true;
    const s = srv.state;
    if (s.run === K.no && s.awake) return true;
    if (s.run === K.no && s.sleep && !wake) { sleepy(); return false; }
    const r = await api('/api/titos/start', { n: K.no });
    if (r.error) { if (r.error === 'coffee') sleepy(); else card(`<p>${t(UI.err)}</p>`); return false; }
    srv.state = r.state; draw(); await sync(); return true;
  };
  const tell = async id => { // улика раскрыта (прочитана, под лупой, допрос окончен) — сказать серверу
    if (!srv.on || st.solved) return;
    const r = await api('/api/titos/clue', { n: K.no, id });
    if (r.state) { srv.state = r.state; draw(); }
    else if (r.error === 'sleep') { srv.state.awake = false; srv.state.sleep = true; sleepy(); }
  };
  const sleepy = () => {
    const s = srv.state, mins = s.next ? Math.max(1, Math.ceil((s.next - Date.now()) / 60000)) : 60;
    A.coffee.on = false; A.hero && A.hero.classList.remove('jitter');
    card(`<p class="q-kick">☕ ${s.coffee || 0}/${s.max || 10}</p><h3>${esc(t(UI.asleep))}</h3>` +
      (s.coffee > 0 ? `<div class="q-acts"><button type="button" data-q="wake">${t(UI.wake)}</button></div>` : `<p>${esc(t(UI.nocoffee)(mins))}</p>`));
  };
  // --- полоска дела над комнатой и карманы под ней
  const bar = document.querySelector('.rm-bar');
  const banner = document.createElement('div'); banner.className = 'q-banner'; bar.insertBefore(banner, bar.firstChild.nextSibling);
  const pockets = document.createElement('div'); pockets.className = 'q-pockets'; (A.pan || box).after(pockets);
  const modal = document.createElement('div'); modal.className = 'q-modal'; modal.hidden = true; document.body.appendChild(modal); // окно — поверх всей страницы (на iPhone внутри прокручиваемой комнаты оно обрезалось)
  // «Что делать»: шаги над комнатой; текущий выделен, нажатие показывает место или открывает окно
  const guide = document.createElement('ol'); guide.className = 'q-guide'; (A.pan || box).before(guide);
  const hasLens = ORDER.some(id => C[id].kind === 'analyze');
  const steps = () => {
    const pinned = st.pinned.length, an = ORDER.filter(id => C[id].kind === 'analyze'), anDone = an.filter(id => st.analyzed.includes(id)).length;
    const list = hasLens ? [{ done: st.mag, text: t(UI.gMag), act: 'mag' }] : [];
    const roomN = ORDER.filter(id => C[id].hot || C[id].sprite).length;
    if (roomN) list.push({ done: ORDER.filter(id => (C[id].hot || C[id].sprite) && st.found.includes(id)).length >= roomN, text: t(UI.gSearch)(st.found.length), act: 'show' });
    if (K.scene) list.push({ done: ORDER.filter(id => !C[id].hot && !C[id].sprite).every(id => st.found.includes(id) || C[id].kind === 'witness'), text: t(UI.gScene), act: 'scene' });
    const wits = Object.keys(K.W);
    if (wits.length) { const wDone = wits.filter(w => (st.asked[w] || []).length >= K.W[w].qa.length).length; list.push({ done: wDone === wits.length, text: t(UI.gTalk)(wDone, wits.length), act: K.scene ? 'scene' : 'doss' }); }
    if (an.length) list.push({ done: anDone === an.length, text: t(UI.gExam)(anDone, an.length), act: K.scene ? 'scene' : 'show' });
    list.push({ done: pinned >= N, text: t(UI.gPin)(pinned, N), act: 'board' }, { done: st.dossiers, text: t(UI.gDoss), act: 'doss' }, { done: st.solved, text: t(UI.gAcc), act: 'board' });
    return list;
  };
  const drawGuide = () => {
    if (st.solved) { guide.hidden = true; return; }
    const list = steps(), cur = list.findIndex(x => !x.done);
    guide.hidden = false;
    guide.innerHTML = `<li class="q-guide-h"><button type="button" data-g="all">${t(UI.guideT)} · ${Math.min(cur + 1, list.length)}/${list.length} <span class="q-m">▾</span></button></li>` + list.map((x, i) => `<li class="${x.done ? 'done' : i === cur ? 'cur' : ''}"><button type="button" data-g="${x.act}">${x.done ? '✅' : i === cur ? '👉' : '▫️'} ${esc(x.text)}</button></li>`).join('');
  };
  const flash = keys => { // подсветить места в комнате и прокрутить к первому
    const els = keys.map(k => box.querySelector(`.rm-hot[data-k="${k}"]`) || sprites[k]).filter(Boolean);
    els.forEach(el => { el.classList.remove('q-flash'); void el.offsetWidth; el.classList.add('q-flash'); setTimeout(() => el.classList.remove('q-flash'), 3200); });
    const pan = A.pan, el = els[0];
    if (pan && el && pan.scrollWidth > pan.clientWidth + 4) { const r = el.getBoundingClientRect(), b = box.getBoundingClientRect(); pan.scrollTo({ left: r.left - b.left + r.width / 2 - pan.clientWidth / 2, behavior: 'smooth' }); }
    (A.pan || box).scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const draw = () => {
    drawGuide();
    const mz = box.querySelector('.rm-hot[data-k="magnifier"]'); if (mz) { mz.classList.toggle('q-want', hasLens && !st.mag && !st.solved); mz.classList.add('rm-detective-mag'); }
    // место с ещё не приколотой уликой — поверх соседних зон (ящик с папками почти целиком закрыт ящиками drawer#0 и #1)
    Object.entries(HOTS).forEach(([k, id]) => { const z = box.querySelector(`.rm-hot[data-k="${k}"]`); if (z) z.classList.toggle('q-has', !st.pinned.includes(id) && !st.solved); });
    const done = n => srv.on ? (srv.state.level || 0) >= n : load(OLD[n] || 'pp-titos-case-' + n).solved;
    const cup = srv.on ? `<span class="q-stat" title="☕">☕ ${srv.state.coffee ?? '–'}/${srv.state.max || 10}</span>` : '';
    banner.innerHTML = `<nav class="q-tabs">${CASES.map(c => `<button type="button" data-case="${c.n}" class="${c.n === K.no ? 'on' : ''}">${t(UI.caseNo)} ${c.n} · ${esc(c.title)}${done(c.n) ? ' ✅' : ''}</button>`).join('')}${CASES.length && CASES[CASES.length - 1].n === srv.top && srv.top < LEVELS ? `<button type="button" class="q-soon" disabled>${t(UI.caseNo)} ${srv.top + 1} · ${t(UI.soon)}</button>` : ''}</nav>` +
      `<span class="q-stat">${t(UI.total)(srv.top, LEVELS)}</span>` + cup +
      (st.solved ? `<span class="q-stat">✅ ${t(UI.solvedT)}</span><button type="button" data-q="again">${t(UI.again)}</button>`
      : `<span class="q-stat">${t(UI.clues)}: ${st.pinned.length}/${N}</span>${(K.scenes || []).map((s, i) => `<button type="button" data-q="scene" data-i="${i}">${t(UI.scene)}${K.scenes.length > 1 ? ' ' + (i + 1) : ''}</button>`).join('')}<button type="button" data-q="board">${t(UI.board)}</button>`) +
      (!srv.on && K.no >= 2 ? `<span class="q-m">${t(UI.loginMore)}</span>` : '') +
      (srv.on && srv.top < LEVELS && (srv.state.level || 0) >= srv.top ? `<span class="q-m">${t(UI.devNote)(srv.top, LEVELS)}</span>` : ''); // дошли до последнего дела — остальные в разработке
    pockets.innerHTML = `<span>${t(UI.inv)}:</span>` + (st.mag ? '<img src="/images/rooms/prop-mag.png" alt="" title="🔍">' : '') +
      st.found.filter(id => !st.pinned.includes(id)).map(id => `<button type="button" data-open="${id}" title="${esc(t(C[id].title))}">${ico(id)}${esc(t(C[id].title))}</button>`).join('');
    ORDER.forEach(id => { const sp = sprites[id]; if (sp) sp.hidden = st.pinned.includes(id) || st.solved; });
  };
  const close = () => { modal.hidden = true; };
  const card = (html, wide) => { modal.innerHTML = `<div class="q-card${wide ? ' wide' : ''}"><button type="button" class="q-x" data-q="close" aria-label="${t(UI.close)}">✕</button>${html}</div>`; modal.hidden = false; };
  const openClue = async id => {
    const c = C[id];
    if (c.kind === 'witness') { openWitness(c.w); return; }
    if (!(await go())) return;
    if (!st.found.includes(id)) { st.found.push(id); save(); if (c.kind !== 'analyze') tell(id); }
    const needs = c.kind === 'analyze' && !st.analyzed.includes(id), on = st.pinned.includes(id);
    card(`<p class="q-kick">${c.kind === 'listen' ? '🎙' : c.kind === 'analyze' ? '🔍' : '📄'} ${esc(K.label)}</p><h3>${esc(t(c.title))}</h3>
      <div class="q-paper${c.herring ? ' photo' : ''}">${ico(id)}<p>${esc(needs ? t(c.pre || UI.smeared) : t(c.text))}</p></div>
      <div class="q-acts">${needs ? (st.mag ? `<button type="button" data-q="exam" data-id="${id}">${t(UI.exam)}</button>` : `<em>${t(UI.needMag)}</em>`)
        : on ? `<em>${t(UI.pinned)}</em>` : `<button type="button" data-q="pin" data-id="${id}">${t(UI.pin)}</button>`}</div>`);
    draw();
  };
  // допрос: вопросы по очереди, ответы остаются на карточке; когда заданы все — показания можно приколоть
  const witClue = w => ORDER.find(id => C[id].w === w);
  const openWitness = w => {
    const W = K.W[w], id = witClue(w), asked = st.asked[w] || [], all = asked.length >= W.qa.length, on = id && st.pinned.includes(id);
    if (id && asked.length && !st.found.includes(id)) { st.found.push(id); save(); }
    card(`<p class="q-kick">${t(UI.ask)} · ${esc(K.label)}</p>
      <div class="q-wit">${W.img ? `<img src="${W.img}" alt="">` : ''}<h3>${esc(t(W.name))}</h3></div>
      <div class="q-qa">${W.qa.map(([q, a], i) => asked.includes(i) ? `<p class="q-q">— ${esc(t(q))}</p><p class="q-a">${esc(t(a))}</p>` : `<button type="button" data-ask="${w}" data-i="${i}">— ${esc(t(q))}</button>`).join('')}</div>
      <div class="q-acts">${!id ? '' : on ? `<em>${t(UI.pinned)}</em>` : all ? `<button type="button" data-q="pin" data-id="${id}">${t(UI.pinW)}</button>` : `<em>${t(UI.askAll)}</em>`}</div>`);
    draw();
  };
  // сцена: картинка с кликабельными людьми и вещами или текст со списком мест
  let sceneI = 0;
  const openScene = (msg, i = sceneI) => {
    sceneI = i; const sc = K.scenes[i]; if (!sc) return;
    const z = sc.zones.map((z, j) => {
      const done = z.clue ? st.pinned.includes(z.clue) : z.wit ? st.pinned.includes(witClue(z.wit)) : false;
      const label = z.clue ? t(C[z.clue].title) : z.wit ? t(K.W[z.wit] ? K.W[z.wit].name : '') : '';
      const seen = z.say ? st.heard : done;
      return sc.img ? `<button type="button" class="q-zone${seen ? '' : ' spark'}${z.clue || z.wit ? '' : ' talk'}${z.h > 30 ? ' person' : ''}${done ? ' done' : ''}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%" data-zone="${j}" aria-label="${esc(label || '…')}"${label ? ` title="${esc(label)}"` : ''}></button>`
        : `<button type="button" class="q-spot${done ? ' done' : ''}" data-zone="${j}">${z.clue ? (done ? '✅ ' : '🔎 ') + esc(label) : z.wit ? '🗣 ' + esc(label) : '💬 …'}</button>`;
    }).join('');
    card(`<p class="q-kick">${t(UI.scene)} · ${esc(K.label)}</p><p class="q-hint">${esc(t(sc.text))}${sc.img ? ` <span class="q-m">${t(UI.sceneSwipe)}</span>` : ''}</p>
      ${sc.img ? `<div class="q-scene"><img src="${sc.img}" alt="${esc(t(K.title))}">${z}</div>` : `<div class="q-acts">${z}</div>`}${msg ? `<p class="q-say">${esc(msg)}</p>` : ''}`, !!sc.img);
  };
  const openBoard = () => {
    const pos = K.POS;
    const lines = K.STR.filter(([a, b]) => st.pinned.includes(ORDER[a]) && st.pinned.includes(ORDER[b]))
      .map(([a, b]) => `<line x1="${pos[a][0] + 10}" y1="${pos[a][1] + 7}" x2="${pos[b][0] + 10}" y2="${pos[b][1] + 7}"/>`).join('');
    const slots = ORDER.map((id, i) => st.pinned.includes(id)
      ? `<button type="button" class="q-slot on" style="left:${pos[i][0]}%;top:${pos[i][1]}%" data-open="${id}"><i></i>${ico(id)}${esc(t(C[id].title))}</button>`
      : `<span class="q-slot" style="left:${pos[i][0]}%;top:${pos[i][1]}%">?</span>`).join('');
    const sus = st.dossiers ? `<div class="q-sus"><p>${esc(t(K.accuse))}</p>${Object.entries(S).map(([k, s]) => `<button type="button" data-acc="${k}"${st.pinned.length < N ? ' disabled' : ''}>${K.sus(k) ? `<img src="${K.sus(k)}" alt="">` : '<b class="q-emo">❔</b>'}${esc(t(s.name))}</button>`).join('')}${st.pinned.length < N ? `<em>${t(UI.needAll)(N)}</em>` : ''}</div>`
      : `<div class="q-sus"><em>${t(UI.noDoss)}</em></div>`;
    card(`<h3>${t(UI.board)}</h3><div class="q-cork${K.big ? ' tall' : ''}"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>${slots}</div>${sus}`);
  };
  const openDossiers = () => {
    st.dossiers = true; save(); drawGuide();
    card(`<p class="q-kick">🗂 ${t(UI.suspects)}</p><div class="q-doss">${Object.entries(S).map(([k, s]) => `<article>${K.sus(k) ? `<img src="${K.sus(k)}" alt="">` : '<b class="q-emo">❔</b>'}<h4>${esc(t(s.name))}</h4><p>${esc(t(s.text))}</p></article>`).join('')}</div>`);
  };
  const solve = async (k) => {
    if (srv.on && !(await go())) return;
    let r = await api(`/api/titos/accuse?lang=${LANG}`, { n: K.no, who: k });
    if (r.error === 'clues') { await sync(); r = await api(`/api/titos/accuse?lang=${LANG}`, { n: K.no, who: k }); }
    if (r.error === 'sleep') { srv.state.awake = false; srv.state.sleep = true; sleepy(); return; }
    if (r.error) { card(`<p>${t(UI.err)}</p>`); return; }
    if (r.state) srv.state = r.state;
    if (!r.right) {
      st.tries++; save(); card(`<h3>❌</h3><p class="q-verdict">${esc(r.text)}</p>`);
      A.coffee.sip && setTimeout(() => A.coffee.sip(true), 900); return;
    }
    st.solved = true; save(); A.coffee.on = false; draw();
    if (window.PPTop) PPTop.refresh(); // доска топа «Раскрыто дел»
    card(`<div class="q-stamp">${t(UI.solvedT)}</div><p class="q-verdict">${esc(r.text)}</p>${r.buttons ? `<p class="q-kick">${t(UI.got)(r.buttons)}</p>` : ''}${r.item && window.PPBirds ? `<p class="q-kick q-prize">${t(UI.prize)} <b>${esc(PPBirds.giftName(r.item.kind, r.item.item))}</b></p><p><a class="pill-btn" href="${L ? '/' + LANG : ''}/bird/">${t(UI.toRoom)}</a></p>` : ''}${K.no >= srv.top && srv.top < LEVELS ? `<p class="q-m">${t(UI.allDone)(srv.top, LEVELS)}</p>` : ''}`);
    if (r.buttons && window.PPToast) PPToast(t(UI.got)(r.buttons));
    if (r.reward && window.PPNews) PPNews.refresh(); // награда за уровень — новость «Награда!» в 🔔
    const pz = r.item && modal.querySelector('.q-prize'); if (pz && PPBirds.itemIcon) pz.prepend(PPBirds.itemIcon(r.item.kind, r.item.item, 48)); // картинка вещи-награды
    goHome();
  };
  const goHome = () => {
    const h = A.hero; if (!h) return;
    h.classList.remove('jitter');
    setTimeout(() => { close(); A.sayAt(t(K.bye), 30, 40, 4000); }, 2600);
    setTimeout(() => { h.classList.add('q-walk'); A.setEvening(true); box.classList.add('q-lightsout'); }, 6000);
  };
  // улики-спрайты, которых нет в фоне кабинета (spot: [x, y, ширина] в пикселях комнаты)
  const sprites = {};
  ORDER.forEach(id => {
    const sp = C[id].sprite; if (!sp) return;
    const [x, y, w] = sp, b = document.createElement('button'); b.type = 'button'; b.className = 'q-clue';
    b.style.left = pct(x / R.w * 100); b.style.top = pct(y / R.h * 100); b.style.width = pct(w / R.w * 100);
    b.innerHTML = `<img src="${C[id].icon}" alt="${esc(t(C[id].title))}">`; b.addEventListener('click', () => openClue(id));
    box.appendChild(b); sprites[id] = b;
  });
  const HOTS = {}; ORDER.forEach(id => { if (C[id].hot && !C[id].sprite) HOTS[C[id].hot] = id; });
  A.hook = k => {
    if (st.solved) return false;
    if (HOTS[k]) { openClue(HOTS[k]); return true; }
    if (k === 'magnifier' && hasLens) { go().then(ok => { if (!ok) return; if (!st.mag) { st.mag = true; save(); draw(); tell('lens'); } A.sayAt(t(UI.magGot), 34, 46); }); return true; }
    if (k === 'folderdrawer' || k.startsWith('drawer#')) { openDossiers(); return true; }
    if (K.scene && k === 'folders') { openScene(null, 0); return true; } // в папках — место происшествия (если там нет своей улики)
    if (k === 'board' || k.startsWith('photo#') || k === 'clue') { openBoard(); return true; }
    return false;
  };
  const click = async e => {
    const q = e.target.closest('[data-q]'), o = e.target.closest('[data-open]'), a = e.target.closest('[data-acc]'), cs = e.target.closest('[data-case]');
    const zn = e.target.closest('[data-zone]'), ask = e.target.closest('[data-ask]'), g = e.target.closest('[data-g]');
    if (g) { const a = g.dataset.g; if (a === 'all') { guide.classList.toggle('open'); return; } if (a === 'mag') flash(['magnifier']); if (a === 'scene') openScene(null, 0); if (a === 'board') openBoard(); if (a === 'doss') openDossiers();
      if (a === 'show') flash(ORDER.filter(id => !st.found.includes(id) && (C[id].hot || C[id].sprite)).map(id => C[id].sprite ? id : C[id].hot)); return; }
    if (cs) { if (Number(cs.dataset.case) !== K.no) { try { localStorage.setItem('pp-titos-case', cs.dataset.case); } catch (x) {} location.reload(); } return; }
    if (zn) { const z = K.scenes[sceneI].zones[zn.dataset.zone]; if (z.clue) openClue(z.clue); else if (z.wit) openWitness(z.wit); else { st.heard = true; save(); openScene(t(z.say)); } return; }
    if (ask) {
      if (!(await go())) return;
      const w = ask.dataset.ask, list = st.asked[w] || (st.asked[w] = []); if (!list.includes(+ask.dataset.i)) list.push(+ask.dataset.i); save();
      const id = witClue(w); if (id && list.length >= K.W[w].qa.length) { if (!st.found.includes(id)) st.found.push(id); save(); tell(id); }
      openWitness(w); return;
    }
    if (o) { openClue(o.dataset.open); return; }
    if (a && !a.disabled) { solve(a.dataset.acc); return; }
    if (!q) return;
    const id = q.dataset.id;
    if (q.dataset.q === 'close') close();
    if (q.dataset.q === 'board') openBoard();
    if (q.dataset.q === 'scene') openScene(null, Number(q.dataset.i) || 0);
    if (q.dataset.q === 'wake') { if (await go(true)) { close(); A.coffee.on = true; } }
    if (q.dataset.q === 'exam') { if (!(await go())) return; if (!st.analyzed.includes(id)) st.analyzed.push(id); save(); tell(id); openClue(id); }
    if (q.dataset.q === 'pin') { if (!st.pinned.includes(id)) st.pinned.push(id); if (!st.found.includes(id)) st.found.push(id); save(); draw(); openBoard(); }
    if (q.dataset.q === 'again') { localStorage.removeItem(K.key); location.reload(); }
  };
  [modal, banner, pockets, guide].forEach(el => el.addEventListener('click', click));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  if (st.solved) { A.coffee.on = false; A.hero && A.hero.classList.add('q-gone'); box.classList.add('q-lightsout'); }
  else if (srv.on && srv.state.run === K.no && srv.state.sleep) { A.coffee.on = false; setTimeout(() => A.sayAt(t(UI.asleep), 30, 40, 6000), 1200); }
  else setTimeout(() => A.sayAt(t(K.intro), 30, 40, 9000), 1200);
  draw();
  };
  start();
})();
