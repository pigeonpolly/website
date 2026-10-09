// Задачи Полли: «Ответ Совету городов» — собрать 5 листов по папкам, найти потерянный, расставить по порядку и отправить.
(() => {
  const A = window.ROOM; if (!A || document.getElementById('rm').dataset.room !== 'office') return;
  const { box, L, esc } = A; const t = o => o[L];
  const KEY = 'pp-polly-task1';
  let st = { found: [], read: false, order: [], sent: false };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  // меню задач: новые добавлять сюда с номерами
  const TASKS = [{ no: 1, title: ['Reply to the Council', 'Ответ Совету городов', 'Atbilde Pilsētu padomei'] }, { no: 2, soon: true }];
  const UI = {
    taskNo: ['Task No.', 'Задача №', 'Uzdevums Nr.'], soon: ['coming soon', 'скоро', 'drīzumā'],
    pages: ['Pages found', 'Листов найдено', 'Atrastas lapas'], mail: ['✉ Open the email', '✉ Открыть письмо', '✉ Atvērt vēstuli'], inv: ['Pockets', 'Карманы', 'Kabatas'],
    from: ['From: Council of Cities, New Wobbleton', 'От: Совет городов, New Wobbleton', 'No: Pilsētu padome, New Wobbleton'],
    subj: ['★ URGENT: the Annual Crumb Report', '★ СРОЧНО: Годовой отчёт по крошкам', '★ STEIDZAMI: Gada drupaču atskaite'],
    body: ['Dear Polly, please reply with the Annual Crumb Report before the end of the day. Five pages, in this order: 1. Cover letter, 2. Crumb count table, 3. Crumb chart, 4. Receipts, 5. Signed approval form. Kind regards, the Council.',
           'Дорогая Полли, пришлите, пожалуйста, ответом Годовой отчёт по крошкам до конца дня. Пять листов, по порядку: 1. Сопроводительное письмо, 2. Таблица подсчёта крошек, 3. График крошек, 4. Чеки, 5. Подписанный бланк согласования. С уважением, Совет.',
           'Dārgā Pollija, lūdzu, atsūti atbildē Gada drupaču atskaiti līdz dienas beigām. Piecas lapas, secībā: 1. Pavadvēstule, 2. Drupaču uzskaites tabula, 3. Drupaču grafiks, 4. Čeki, 5. Parakstīta saskaņojuma veidlapa. Ar cieņu, Padome.'],
    hint: ['Polly’s sticky note: “Letter — yellow binder. Table — cabinet, 2nd drawer. Chart — print on the copier. Receipts — red binder. Form — signed it this morning… and then?”',
           'Стикер Полли: «Письмо — жёлтая папка. Таблица — шкаф, 2-й ящик. График — распечатать на копире. Чеки — красная папка. Бланк — подписала утром… а потом?»',
           'Pollijas lapiņa: “Vēstule — dzeltenā mape. Tabula — skapis, 2. atvilktne. Grafiks — izdrukāt uz kopētāja. Čeki — sarkanā mape. Veidlapa — parakstīju no rīta… un tad?”'],
    reply: ['Reply', 'Ответ', 'Atbilde'], attach: ['Click a found page below to put it into the next empty line. Click an attached line to take the page back.', 'Нажмите на найденный лист ниже — он встанет в следующую пустую строку. Нажмите на прикреплённую строку — лист вернётся обратно.', 'Spied uz atrastās lapas zemāk — tā nostāsies nākamajā tukšajā rindā. Spied uz pievienotās rindas — lapa atgriezīsies atpakaļ.'],
    foundL: ['Found pages:', 'Найденные листы:', 'Atrastās lapas:'], none: ['No pages found yet. Close the email and search the office: folders, drawers, the copier…', 'Пока не найдено ни одного листа. Закройте письмо и поищите по кабинету: папки, ящики, копир…', 'Vēl nav atrasta neviena lapa. Aizver vēstuli un meklē birojā: mapēs, atvilktnēs, kopētājā…'],
    allUsed: ['All found pages are attached.', 'Все найденные листы прикреплены.', 'Visas atrastās lapas ir pievienotas.'],
    clear: ['Start over', 'Сначала', 'No sākuma'], send: ['Send ➤', 'Отправить ➤', 'Sūtīt ➤'], wrong: ['The order is wrong. Check the email again.', 'Порядок неправильный. Перечитайте письмо.', 'Secība nav pareiza. Pārlasi vēstuli.'],
    missing: ['Not all five pages are attached yet.', 'Прикреплены ещё не все пять листов.', 'Vēl nav pievienotas visas piecas lapas.'],
    sent: ['Sent! ✅', 'Отправлено! ✅', 'Nosūtīts! ✅'],
    thanks: ['The Council replies within a minute: “Thank you, Polly! The report is perfect. Employee of the Month again.” Polly does a little happy dance.', 'Совет отвечает через минуту: «Спасибо, Полли! Отчёт идеален. Снова сотрудник месяца». Полли танцует маленький танец радости.', 'Padome atbild pēc minūtes: “Paldies, Pollija! Atskaite ir ideāla. Atkal mēneša darbiniece.” Pollija izdejo mazu prieka deju.'],
    again: ['Play again', 'Пройти заново', 'Spēlēt vēlreiz'], other: ['📥 Other emails', '📥 Остальные письма', '📥 Citas vēstules'], got: ['Found:', 'Найдено:', 'Atrasts:'],
    intro: ['Oh no. An urgent email from the Council… and my report is scattered all over the office. Help me?', 'Ой-ой. Срочное письмо от Совета… а мой отчёт разбросан по всему офису. Поможете?', 'Ak vai. Steidzama vēstule no Padomes… un mana atskaite izmētāta pa visu biroju. Palīdzēsi?'],
  };
  const P = {
    letter: { hot: 'binder#02', title: ['1. Cover letter', '1. Сопроводительное письмо', '1. Pavadvēstule'] },
    table: { hot: 'drawer#1', title: ['2. Crumb count table', '2. Таблица подсчёта крошек', '2. Drupaču uzskaites tabula'] },
    chart: { hot: 'copier', title: ['3. Crumb chart', '3. График крошек', '3. Drupaču grafiks'] },
    receipts: { hot: 'binder#00', title: ['4. Receipts', '4. Чеки', '4. Čeki'] },
    form: { hot: 'jello', title: ['5. Signed approval form', '5. Подписанный бланк', '5. Parakstīta veidlapa'] },
  };
  const ORDER = ['letter', 'table', 'chart', 'receipts', 'form'];
  const FOUND = {
    letter: ['The yellow binder! The cover letter is right on top.', 'Жёлтая папка! Сопроводительное письмо прямо сверху.', 'Dzeltenā mape! Pavadvēstule pašā augšā.'],
    table: ['Second drawer: under the forms for new forms — the crumb count table.', 'Второй ящик: под бланками для бланков — таблица подсчёта крошек.', 'Otrā atvilktne: zem veidlapām veidlapām — drupaču tabula.'],
    chart: ['Brrr-zzzt… The copier warms up and slowly prints the crumb chart.', 'Брр-ззз… Копир прогревается и медленно печатает график крошек.', 'Brr-zzz… Kopētājs uzsilst un lēnām izdrukā drupaču grafiku.'],
    receipts: ['The red binder: “Receipts 2019–2021”. The new receipts are tucked in the back.', 'Красная папка: «Чеки 2019–2021». Новые чеки вложены в конец.', 'Sarkanā mape: “Čeki 2019–2021”. Jaunie čeki ielikti beigās.'],
    form: ['THERE it is! The signed form, stuck to the stapler… inside the jelly. Again. It’s a bit wobbly, but readable.', 'ВОТ он! Подписанный бланк прилип к степлеру… в желе. Опять. Немного дрожит, но читается.', 'TE tā ir! Parakstītā veidlapa pielipusi skavotājam… želejā. Atkal. Mazliet trīc, bet lasāma.'],
  };
  const SEARCH = {
    cooler: ['At the cooler someone says: “I saw a paper sticking out of something wobbly this morning.” Wobbly?', 'У кулера кто-то говорит: «Утром видела листок, торчащий из чего-то дрожащего». Дрожащего?', 'Pie dzesētāja kāds saka: “No rīta redzēju lapu, kas spraucās ārā no kaut kā trīcoša.” Trīcoša?'],
    trash: ['Not in the bin. Only the sad sandwich.', 'В корзине нет. Только грустный бутерброд.', 'Miskastē nav. Tikai skumjā sviestmaize.'],
    box: ['The STUFF box: a cactus, a mug… no form.', 'Коробка STUFF: кактус, кружка… бланка нет.', 'STUFF kaste: kaktuss, krūze… veidlapas nav.'],
    radiator: ['Something rustles behind the radiator… just dust and a lost button.', 'За батареей что-то шуршит… только пыль и потерянная пуговица.', 'Aiz radiatora kaut kas čaukst… tikai putekļi un pazaudēta poga.'],
    papers: ['The “urgent” pile. Everything here is urgent except the form.', 'Стопка «срочно». Тут всё срочное, кроме бланка.', 'Kaudze “steidzami”. Te viss ir steidzams, izņemot veidlapu.'],
    neighbour: ['The neighbour’s desk. Only cold tea and very well stapled reports.', 'Стол соседа. Только холодный чай и очень хорошо скреплённые отчёты.', 'Kaimiņa galds. Tikai auksta tēja un ļoti labi saskavotas atskaites.'],
  };
  const bar = document.querySelector('.rm-bar');
  const banner = document.createElement('div'); banner.className = 'q-banner'; bar.insertBefore(banner, bar.firstChild.nextSibling);
  const pockets = document.createElement('div'); pockets.className = 'q-pockets'; (A.pan || box).after(pockets);
  const modal = document.createElement('div'); modal.className = 'q-modal'; modal.hidden = true; document.body.appendChild(modal); // окно — поверх всей страницы (на iPhone внутри прокручиваемой комнаты оно обрезалось)
  const draw = () => {
    banner.innerHTML = `<nav class="q-tabs">${TASKS.map(c => `<button type="button" class="${c.no === 1 ? 'on' : ''}"${c.soon ? ' disabled' : ''}>${t(UI.taskNo)} ${c.no}${c.soon ? ' · ' + t(UI.soon) : ' · ' + t(c.title) + (st.sent ? ' ✅' : '')}</button>`).join('')}</nav>` +
      (st.sent ? `<span class="q-stat">${t(UI.sent)}</span><button type="button" data-q="again">${t(UI.again)}</button>`
        : `<span class="q-stat">${t(UI.pages)}: ${st.found.length}/5</span><button type="button" data-q="mail">${t(UI.mail)}</button>`);
    pockets.innerHTML = `<span>${t(UI.inv)}:</span>` + ORDER.filter(id => st.found.includes(id) && !st.order.includes(id))
      .map(id => `<button type="button" data-att="${id}"><img src="/images/rooms/prop-page.png" alt="">${esc(t(P[id].title))}</button>`).join('');
  };
  const card = html => { modal.innerHTML = `<div class="q-card">${html}<button type="button" class="q-x" data-q="close">✕</button></div>`; modal.hidden = false; };
  const close = () => { modal.hidden = true; };
  const openMail = () => {
    st.read = true; save();
    const slots = [0, 1, 2, 3, 4].map(i => st.order[i] ? `<li class="on"><button type="button" data-det="${i}"><img src="/images/rooms/prop-page.png" alt="">${esc(t(P[st.order[i]].title))}<span>✕</span></button></li>` : `<li>${i + 1}. …</li>`).join('');
    const free = ORDER.filter(id => st.found.includes(id) && !st.order.includes(id));
    const avail = !st.found.length ? `<p class="q-small">${t(UI.none)}</p>` : free.length
      ? `<div class="q-avail"><span>${t(UI.foundL)}</span>${free.map(id => `<button type="button" data-att="${id}"><img src="/images/rooms/prop-page.png" alt="">${esc(t(P[id].title))}</button>`).join('')}</div>`
      : `<p class="q-small">✓ ${t(UI.allUsed)}</p>`;
    card(`<p class="q-kick">${esc(t(UI.from))}</p><h3>${esc(t(UI.subj))}</h3><div class="q-paper"><p>${esc(t(UI.body))}</p></div>
      <p class="q-note">📝 ${esc(t(UI.hint))}</p>
      ${st.sent ? `<p class="q-verdict">${esc(t(UI.thanks))}</p>` : `<h4 class="q-h4">${t(UI.reply)}</h4><p class="q-small">${t(UI.attach)}</p>${avail}<ol class="q-attach">${slots}</ol>
      <div class="q-acts"><button type="button" data-q="send">${t(UI.send)}</button> <button type="button" class="q-ghost" data-q="clear">${t(UI.clear)}</button> <button type="button" class="q-ghost" data-q="inbox">${t(UI.other)}</button></div><p class="q-err" id="q-err"></p>`}`);
  };
  const find = id => {
    if (!st.found.includes(id)) { st.found.push(id); save(); draw(); }
    if (id === 'chart') A.fx.copier && A.fx.copier();
    card(`<p class="q-kick">${t(UI.got)}</p><h3>${esc(t(P[id].title))}</h3><div class="q-paper"><img src="/images/rooms/prop-page.png" alt=""><p>${esc(t(FOUND[id]))}</p></div>`);
  };
  const HOTS = {}; ORDER.forEach(id => HOTS[P[id].hot] = id);
  A.hook = k => {
    if (st.sent) return false;
    if (k === 'monitor') { openMail(); return true; }
    if (HOTS[k]) { find(HOTS[k]); return true; }
    if (SEARCH[k] && !st.found.includes('form')) { A.sayAt(t(SEARCH[k]), (A.R.hot[k][0] + A.R.hot[k][2] / 2), A.R.hot[k][1]); return true; }
    return false;
  };
  const click = e => {
    const q = e.target.closest('[data-q]'), a = e.target.closest('[data-att]'), dt = e.target.closest('[data-det]');
    if (dt) { st.order.splice(+dt.dataset.det, 1); save(); draw(); openMail(); return; }
    if (a) { if (!st.order.includes(a.dataset.att) && st.order.length < 5) { st.order.push(a.dataset.att); save(); draw(); } openMail(); return; }
    if (!q) return;
    const k = q.dataset.q;
    if (k === 'close') close();
    if (k === 'mail') openMail();
    if (k === 'clear') { st.order = []; save(); draw(); openMail(); }
    if (k === 'inbox') { close(); A.fx.monitor && A.fx.monitor(); }
    if (k === 'send') {
      const err = document.getElementById('q-err');
      if (st.order.length < 5) { err.textContent = t(UI.missing); return; }
      if (st.order.join() !== ORDER.join()) { err.textContent = t(UI.wrong); return; }
      st.sent = true; save(); draw(); openMail();
      A.hero && (A.hero.classList.remove('hop'), void A.hero.offsetWidth, A.hero.classList.add('hop', 'q-dance'));
    }
    if (k === 'again') { localStorage.removeItem(KEY); location.reload(); }
  };
  [modal, banner, pockets].forEach(el => el.addEventListener('click', click));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  if (!st.sent) setTimeout(() => A.sayAt(t(UI.intro), 30, 52, 8000), 1200);
  draw();
})();
