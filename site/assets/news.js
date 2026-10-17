// «Конвертик» — одна очередь новостей птички на всех страницах (этап 4 А).
// Сервер отдаёт news: [{kind, n, …}] в /api/whoami (account.js шлёт событие 'pp:whoami') и в /api/news (refresh после действий).
// 🔔 в шапке (#pp-bell, src/layout.html) — число новостей; если есть новое — из угла вылетает пиксельный конвертик
// «У тебя N новостей!», нажатие — окно-лента с карточками, «Потом» прячет конвертик до следующей страницы.
// Новый вид новости = одна запись в NEWS_KINDS (worker/index.js) и одна в KINDS ниже.
(() => {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, pre = ['', '/ru', '/lv'][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // склонение: [1, 2–4, 5+] для RU; [1, много] для EN и LV (21, 31… — как 1)
  // f — формы по языкам [en, ru, lv]; формы чужого языка не нужны (строки других языков в массивах тоже вычисляются — для них '')
  const pl = (n, f) => !f[L] ? '' : L === 1 ? f[1][n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : 2]
    : f[L][(L === 2 ? n % 10 === 1 && n % 100 !== 11 : n === 1) ? 0 : 1];
  const T = {
    bell: ['News', 'Новости', 'Jaunumi'],
    have: [n => `You have ${n} ${pl(n, [['new thing', 'new things']])}!`, n => `У тебя ${n} ${pl(n, [0, ['новость', 'новости', 'новостей']])}!`, n => `Tev ir ${n} ${pl(n, [0, 0, ['jaunums', 'jaunumi']])}!`],
    later: ['Later', 'Потом', 'Vēlāk'],
    open: ['Open', 'Открыть', 'Atvērt'],
    title: ['News for your bird', 'Новости птички', 'Putniņa jaunumi'],
    empty: ['Nothing new yet. Come back later!', 'Пока ничего нового. Загляни позже!', 'Pagaidām nekā jauna. Ieskaties vēlāk!'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    // зарплата (раньше — отдельное окно #acct-sal в account.js)
    salHi: [n => `Hi, @${n}!`, n => `Привет, @${n}!`, n => `Sveiks, @${n}!`],
    salText: ['The Wobbleland Administration takes care of its birds and every now and then pays them a salary.', 'Администрация Воббленда проводит социальную поддержку птичек и иногда выдаёт им зарплату.', 'Wobbleland administrācija rūpējas par saviem putniņiem un šad tad izmaksā tiem algu.'],
    salGot: [n => `Your salary: +${n} 🔘`, n => `Твоя зарплата: +${n} 🔘`, n => `Tava alga: +${n} 🔘`],
    salNote: ['The buttons are already in your pocket.', 'Пуговки уже у тебя в кармане.', 'Pogas jau ir tavā kabatā.'],
    salSign: ['— The Wobbleland Administration', '— Администрация Воббленда', '— Wobbleland administrācija'],
    salOk: ['Thank you!', 'Спасибо!', 'Paldies!'],
  };
  const t = k => T[k][L];

  // виды новостей: icon, title(x), text(x), act — подпись кнопки; go(x) — куда ведёт, или open(card, x) — действие прямо в ленте
  const KINDS = {
    gift: {
      icon: '🎁',
      title: x => x.n > 1 ? [`Gifts for you! (${x.n})`, `Тебе подарки! (${x.n})`, `Tev dāvanas! (${x.n})`][L] : ['A gift for you!', 'Тебе подарок!', 'Tev dāvana!'][L],
      text: x => x.from ? [`From @${x.from}`, `От @${x.from}`, `No @${x.from}`][L] : ['It is waiting unopened in your profile.', 'Он ждёт нераскрытым в твоём профиле.', 'Tā gaida neatvērta tavā profilā.'][L],
      act: ['Open the gift', 'Открыть подарок', 'Atvērt dāvanu'],
      go: () => pre + '/bird/#gift',
    },
    salary: {
      icon: '💌',
      title: () => ['A letter for you!', 'Тебе письмо!', 'Tev vēstule!'][L],
      text: () => ['From the Wobbleland Administration', 'От администрации Воббленда', 'No Wobbleland administrācijas'][L],
      act: ['Open the envelope', 'Открыть конвертик', 'Atvērt aploksni'],
      open: salary,
    },
    advent: {
      icon: '🎄',
      title: x => x.n > 1 ? [`${x.n} windows are waiting for you`, `Тебя ${pl(x.n, [0, ['ждёт', 'ждут', 'ждут']])} ${x.n} ${pl(x.n, [0, ['окошко', 'окошка', 'окошек']])}`, `Tevi gaida ${x.n} ${pl(x.n, [0, 0, ['lodziņš', 'lodziņi']])}`][L]
        : [`Window №${x.day} is open!`, `Окошко №${x.day} открылось!`, `Lodziņš Nr. ${x.day} ir atvēries!`][L],
      text: x => x.n > 1 ? [`Today’s №${x.day} and the ones you missed — a gift in each.`, `Сегодняшнее №${x.day} и пропущенные — в каждом подарок.`, `Šodienas Nr. ${x.day} un izlaistie — katrā dāvana.`][L]
        : ['Advent calendar: a gift for your bird inside.', 'Адвент-календарь: внутри подарок для птички.', 'Adventes kalendārs: iekšā dāvana putniņam.'][L],
      act: ['Open the window', 'Открыть окошко', 'Atvērt lodziņu'],
      go: x => pre + '/advent/#d=' + x.day,
    },
    potion: {
      icon: '🧪',
      title: x => x.n > 1 ? ['Ingredients from friends', 'Ингредиенты от друзей', 'Sastāvdaļas no draugiem'][L] : ['Ingredients from a friend', 'Ингредиенты от друга', 'Sastāvdaļas no drauga'][L],
      text: x => (x.from || []).map(n => '@' + n).join(', ') + ' · ' + ['for your potions', 'для твоих зелий', 'taviem dziriem'][L],
      act: ['Look', 'Посмотреть', 'Apskatīt'],
      go: () => pre + '/potions/',
    },
    trade: { // предложения обмена карточками (этап 7 В); гаснет, когда список открыт в профиле
      icon: '🔁',
      title: x => x.n > 1 ? [`${x.n} trade offers`, `Предложения обмена: ${x.n}`, `Maiņas piedāvājumi: ${x.n}`][L] : ['A trade offer', 'Предложение обмена', 'Maiņas piedāvājums'][L],
      text: x => (x.from || []).map(n => '@' + n).join(', ') + ' · ' + ((x.from || []).length > 1 ? ['want to trade cards with you', 'хотят обменяться карточками', 'grib mainīties ar kartītēm'] : ['wants to trade cards with you', 'хочет обменяться карточками', 'grib mainīties ar kartītēm'])[L],
      act: ['Look', 'Посмотреть', 'Apskatīt'],
      go: () => pre + '/bird/#trades',
    },
    reward: { // награда Титоса за уровень 30/50/90/100 (worker/titos.js rewardNews): «Поставить» — useItem в свою комнату
      icon: '🏅',
      title: () => ['A reward!', 'Награда!', 'Balva!'][L],
      text: x => (window.PPBirds ? PPBirds.giftName(x.k, x.v, L) + ' · ' : '') + [`Detective Titos, case No. ${x.level}`, `Детектив Титос, дело №${x.level}`, `Detektīvs Titoss, lieta Nr. ${x.level}`][L],
      act: ['Place it', 'Поставить', 'Novietot'],
      open: reward,
    },
    boxes: { // письмо о коробках и бардаке — старым птичкам и новым после выбора коробки (worker: users.box_mail)
      icon: '📦',
      title: () => ['A letter for you!', 'Тебе письмо!', 'Tev vēstule!'][L],
      text: () => ['A box for your room — and a word about mess', 'Коробка для комнаты — и пара слов о бардаке', 'Kaste tavai istabai — un pāris vārdu par nekārtību'][L],
      act: ['Read', 'Прочитать', 'Izlasīt'],
      open: boxLetter,
    },
  };
  // ---------- коробка при регистрации (как альбом): окно выбора, письмо ----------
  const BOXES = ['cardbox', 'crate', 'hatbox', 'trunkbox', 'giftbox'];
  const BX = {
    hi: [n => `Hi, @${n}!`, n => `Привет, @${n}!`, n => `Sveiks, @${n}!`],
    pickT: ['Gifts for your room', 'Подарки для комнаты', 'Dāvanas tavai istabai'],
    pickAlbum: ['There is already a card album in your room — tap it to leaf through your cards.', 'В комнате уже лежит альбом для карточек — нажми на него, чтобы листать карточки.', 'Istabā jau ir kartīšu albums — pieskaries tam, lai šķirstītu kartītes.'],
    pickBox: ['And every bird gets a box for little things. Which one would you like?', 'А ещё каждой птичке положена коробка для мелочей. Какую хочешь?', 'Un katram putniņam pienākas kaste sīkumiem. Kuru tu gribi?'],
    swapT: ['Another box', 'Другая коробка', 'Cita kaste'],
    swapText: ['Pick a different box. It stays where it is, and everything inside stays inside.', 'Выбери другую коробку. Она встанет на то же место, всё, что внутри, останется внутри.', 'Izvēlies citu kasti. Tā paliks turpat, un viss, kas iekšā, paliks iekšā.'],
    rules: ['Small things go into a box, boxes stack on top of each other, but a box can’t go inside a box. You can change your box later.', 'Мелкие вещи кладутся в коробку, коробки ставятся друг на друга, а коробку в коробку положить нельзя. Коробку потом можно поменять.', 'Sīkas lietas liek kastē, kastes var likt vienu uz otras, bet kasti kastē ielikt nevar. Kasti vēlāk var nomainīt.'],
    now: ['Current', 'Сейчас', 'Tagad'],
    later: ['Later', 'Потом', 'Vēlāk'],
    done: [b => `${b} is in your room!`, b => `${b} уже в комнате!`, b => `${b} jau ir istabā!`],
    look: ['Look', 'Посмотреть', 'Apskatīt'],
    err: ['Something went wrong. Try again.', 'Что-то пошло не так. Попробуй ещё раз.', 'Kaut kas nogāja greizi. Mēģini vēlreiz.'],
    letter: [
      ['The Wobbleland Administration has given every bird a box — it is already in your room.', 'Администрация Воббленда подарила каждой птичке коробку — она уже стоит в твоей комнате.', 'Wobbleland administrācija uzdāvināja katram putniņam kasti — tā jau stāv tavā istabā.'],
      ['📦 Drag a small thing onto the box and it goes inside. The number on the box is how many things are in it (up to 30).', '📦 Перетащи мелкую вещь на коробку — и она спрячется внутрь. Число на коробке — сколько там вещей (до 30).', '📦 Uzvelc sīku lietu uz kastes — un tā paslēpsies iekšā. Skaitlis uz kastes — cik lietu tur ir (līdz 30).'],
      ['🧱 Boxes stack on top of each other. But a box can’t go inside a box.', '🧱 Коробки можно ставить друг на друга. А вот коробку в коробку положить нельзя.', '🧱 Kastes var likt vienu uz otras. Bet kasti kastē ielikt nevar.'],
      ['🌪️ Careful — mess! Hover over a box (on a phone — tap it), and everything inside jumps out and scatters around the room. Guests can do it too, but for them the mess is only on their screen.', '🌪️ Осторожно, бардак! Наведи на коробку (на телефоне — нажми), и всё, что внутри, выпрыгнет и разлетится по комнате. Гости тоже так могут, но у них бардак только на их экране.', '🌪️ Uzmanību — nekārtība! Uzved uz kastes (telefonā — pieskaries), un viss, kas iekšā, izlēks un izklīdīs pa istabu. Ciemiņi arī tā var, bet viņiem nekārtība ir tikai viņu ekrānā.'],
      ['🧹 To tidy up, press «🧹 Tidy up» — your bird will carry every thing back to its box, one by one.', '🧹 Чтобы прибраться, нажми «🧹 Прибраться» — птичка сама разнесёт всё по коробкам, по одной вещи.', '🧹 Lai sakoptu, nospied «🧹 Sakopt» — putniņš pats aiznesīs visu atpakaļ uz kastēm, pa vienai lietai.'],
      ['🔄 Don’t like your box? You can swap it for another one.', '🔄 Не нравится коробка? Её можно поменять на другую.', '🔄 Nepatīk kaste? To var nomainīt pret citu.'],
    ],
    sign: ['— The Wobbleland Administration', '— Администрация Воббленда', '— Wobbleland administrācija'],
    swap: ['🔄 Another box', '🔄 Другая коробка', '🔄 Cita kaste'],
    ok: ['Thank you!', 'Спасибо!', 'Paldies!'],
  };
  const boxName = b => window.PPBirds && PPBirds.giftName ? PPBirds.giftName('furn', b, L) : b;
  // окно выбора: cur — какая коробка сейчас (нет — первый раз: ещё и про альбом)
  function pickBox(cur) {
    let d = document.getElementById('nw-box');
    if (!d) { d = document.createElement('dialog'); d.id = 'nw-box'; d.className = 'nw-dlg nw-boxdlg'; d.setAttribute('aria-labelledby', 'nw-box-t'); document.body.appendChild(d); }
    d.innerHTML = `<div class="nw-in"><div class="nw-head"><h2 id="nw-box-t">📦 ${BX[cur ? 'swapT' : 'pickT'][L]}</h2><button type="button" class="nw-x" aria-label="${t('close')}">✕</button></div>
      ${cur ? `<p>${BX.swapText[L]}</p>` : `<p><b>${esc(BX.hi[L](me.nick))}</b> ${BX.pickAlbum[L]}</p><p>${BX.pickBox[L]}</p>`}
      <div class="nw-boxgrid"></div><p class="nw-boxrule">${BX.rules[L]}</p>${cur ? '' : `<p class="nw-boxlater"><button type="button" class="pill-btn">${BX.later[L]}</button></p>`}</div>`;
    const close = () => d.close();
    d.querySelector('.nw-x').onclick = close; if (!cur) d.querySelector('.nw-boxlater button').onclick = close;
    const grid = d.querySelector('.nw-boxgrid');
    BOXES.forEach(b => {
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'nw-boxbtn' + (b === cur ? ' on' : ''); btn.dataset.box = b;
      if (window.PPRoom && PPRoom.icon) { const ic = PPRoom.icon('furn', b); ic.setAttribute('aria-hidden', 'true'); btn.appendChild(ic); }
      btn.insertAdjacentHTML('beforeend', `<span>${esc(boxName(b))}</span>${b === cur ? `<small>${BX.now[L]}</small>` : ''}`);
      btn.onclick = async () => {
        if (b === cur) return close();
        grid.querySelectorAll('button').forEach(x => { x.disabled = true; });
        try {
          const r = await fetch('/api/box0', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json', ...(window.PPDevH ? PPDevH() : {}) }, body: JSON.stringify({ box: b }) });
          if (!r.ok) throw new Error(r.status);
          me.box0 = b; close();
          if (window.PPRoom && PPRoom.live && PPRoom.live.box.isConnected) { location.reload(); return; } // своя комната на странице — показать коробку сразу
          const href = `${pre}/bird/?nick=${encodeURIComponent(me.nick)}`;
          if (window.PPToast) PPToast(BX.done[L](boxName(b)), { action: BX.look[L], onAction: () => { location.href = href; }, ms: 6000 });
          if (!cur) refresh().then(() => { flown = false; fly(); }); // пришло письмо о коробках — конвертик
        } catch (e) { grid.querySelectorAll('button').forEach(x => { x.disabled = false; }); alert(BX.err[L]); }
      };
      grid.appendChild(btn);
    });
    if (!d.open) d.showModal();
  }
  // первый заход после регистрации: коробка ещё не выбрана — окно выбора (подождать, если открыто другое окно)
  function askBox(tries = 0) {
    if (!me || me.box0 !== '' || askBox.done) return;
    if (document.querySelector('dialog[open], .adv-modal, .sw-bv')) { if (tries < 60) setTimeout(() => askBox(tries + 1), 1000); return; }
    askBox.done = true; pickBox('');
  }
  // письмо о коробках: прочитать — отметить прочитанным
  function boxLetter(card, x, btn) {
    if (card.classList.contains('open')) return drop('boxes', card);
    card.classList.add('open');
    card.insertAdjacentHTML('beforeend', `<div class="nw-paper"><b>${esc(BX.hi[L](me.nick))}</b>${BX.letter.map(p => `<p>${esc(p[L])}</p>`).join('')}<i>${BX.sign[L]}</i>
      <p class="nw-paper-act"><button type="button" class="pill-btn nw-swap">${BX.swap[L]}</button></p></div>`);
    card.querySelector('.nw-swap').onclick = () => { const f = document.getElementById('nw-feed'); if (f) f.close(); drop('boxes'); pickBox(me.box0 || x.box); };
    btn.textContent = BX.ok[L];
    card.querySelector('.nw-paper').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    fetch('/api/box0/seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => {});
  }

  let news = [], me = null, flown = false;
  const known = () => news.filter(x => KINDS[x.kind]);

  // ---------- 🔔 в шапке ----------
  const bell = document.getElementById('pp-bell');
  function drawBell() {
    if (!bell) return;
    const n = known().length;
    bell.hidden = !me;
    bell.classList.toggle('has', n > 0);
    bell.setAttribute('aria-label', t('bell') + (n ? ` (${n})` : ''));
    bell.querySelector('.bell-n').textContent = n ? String(n) : '';
    bell.querySelector('.bell-n').hidden = !n;
  }
  if (bell) bell.addEventListener('click', () => feed());

  // ---------- пиксельный конвертик из угла ----------
  const PIX = ['OOOOOOOOOOOOOOOO', 'OHBBBBBBBBBBBBHO', 'OBDBBBBBBBBBBDBO', 'OBBDBBBBBBBBDBBO', 'OBBBDBBBBBBDBBBO', 'OBBBBDBBBBDBBBBO', 'OBBBBBDRRDBBBBBO',
    'OBBBBBRRWRBBBBBO', 'OBBBBDBRRBDBBBBO', 'OBBBDBBBBBBDBBBO', 'OBBDBBBBBBBBDBBO', 'OOOOOOOOOOOOOOOO'];
  const COL = { O: '#5A2E1A', B: '#F2C79A', H: '#FFE2BF', D: '#C98A55', R: '#C0392B', W: '#FFD27A' };
  const envSvg = () => `<svg viewBox="0 0 16 12" shape-rendering="crispEdges" aria-hidden="true">${PIX.map((r, y) => [...r].map((c, x) => COL[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${COL[c]}"/>` : '').join('')).join('')}</svg>`;
  function fly(tries = 0) {
    const n = known().length;
    if (!n || flown || document.querySelector('.nw-env')) return;
    try { if (sessionStorage.getItem('pp-nw-skip')) { sessionStorage.removeItem('pp-nw-skip'); flown = true; return; } } catch (e) {} // пришли сюда из ленты — не вылетать снова
    if (document.querySelector('dialog[open], .adv-modal, .sw-bv')) { if (tries < 60) setTimeout(() => fly(tries + 1), 1000); return; } // открыто другое окно — подождать
    flown = true;
    const box = document.createElement('div'); box.className = 'nw-env';
    box.innerHTML = `<div class="nw-bub" role="status"><button type="button" class="nw-say">${esc(T.have[L](n))}</button><button type="button" class="nw-later">${t('later')}</button></div>
      <button type="button" class="nw-pix" aria-label="${esc(T.have[L](n))}">${envSvg()}<b>${n}</b></button>`;
    document.body.appendChild(box);
    const go = () => { box.remove(); feed(); };
    box.querySelector('.nw-pix').onclick = go; box.querySelector('.nw-say').onclick = go;
    box.querySelector('.nw-later').onclick = () => { box.classList.add('off'); setTimeout(() => box.remove(), 400); }; // до следующей страницы
  }

  // ---------- окно-лента ----------
  function feed() {
    const old = document.querySelector('.nw-env'); if (old) old.remove();
    let d = document.getElementById('nw-feed');
    if (!d) {
      d = document.createElement('dialog'); d.id = 'nw-feed'; d.className = 'nw-dlg'; d.setAttribute('aria-labelledby', 'nw-feed-t');
      document.body.appendChild(d);
      d.addEventListener('click', e => { if (e.target === d) d.close(); });
    }
    d.innerHTML = `<div class="nw-in"><div class="nw-head"><h2 id="nw-feed-t">🔔 ${t('title')}</h2><button type="button" class="nw-x" aria-label="${t('close')}">✕</button></div><div class="nw-list"></div></div>`;
    d.querySelector('.nw-x').onclick = () => d.close();
    const list = d.querySelector('.nw-list');
    const items = known();
    if (!items.length) list.innerHTML = `<p class="nw-empty">${t('empty')}</p>`;
    items.forEach(x => {
      const k = KINDS[x.kind], c = document.createElement('article');
      c.className = 'nw-card nw-' + x.kind; c.dataset.kind = x.kind;
      c.innerHTML = `<div class="nw-row"><span class="nw-ic" aria-hidden="true">${k.icon}</span><div class="nw-tx"><b>${esc(k.title(x))}</b><small>${esc(k.text(x))}</small></div>
        ${k.open ? `<button type="button" class="pill-btn pill-fill nw-act">${k.act[L]}</button>` : `<a class="pill-btn pill-fill nw-act" href="${esc(k.go(x))}">${k.act[L]}</a>`}</div>`;
      const a = c.querySelector('.nw-act');
      if (k.open) a.onclick = () => k.open(c, x, a);
      else a.addEventListener('click', e => { // уже на этой странице (смена # не перезагружает) — сразу действие
        try { sessionStorage.setItem('pp-nw-skip', '1'); } catch (er) {}
        const u = new URL(a.href, location.href);
        if (u.pathname !== location.pathname) return;
        e.preventDefault(); d.close();
        const gb = document.getElementById('bp-gift');
        if (x.kind === 'gift' && gb) { try { sessionStorage.removeItem('pp-nw-skip'); } catch (er) {} gb.click(); } else { location.hash = u.hash; location.reload(); }
      });
      list.appendChild(c);
    });
    if (!d.open) d.showModal();
  }
  // убрать карточку, когда новость прочитана
  function drop(kind, card) {
    news = news.filter(x => x.kind !== kind); drawBell();
    if (card) { card.classList.add('gone'); setTimeout(() => { card.remove(); const l = document.querySelector('#nw-feed .nw-list'); if (l && !l.children.length) l.innerHTML = `<p class="nw-empty">${t('empty')}</p>`; }, 350); }
  }

  // зарплата: пуговки уже начислены сервером; здесь письмо открывается (анимация CSS .sal-*, style.css) и отмечается прочитанным
  function salary(card, x, btn) {
    if (card.classList.contains('open')) return drop('salary', card);
    card.id = 'acct-sal';
    if (!card.querySelector('.sal-env')) card.insertAdjacentHTML('beforeend', `<div class="sal-env"><div class="sal-back"></div><div class="sal-letter"><b>${esc(T.salHi[L](me.nick))}</b><p>${t('salText')}</p>
      <p class="sal-sum">${T.salGot[L](x.sum || 0)}</p><p class="sal-note">${t('salNote')}</p><i>${t('salSign')}</i></div><div class="sal-front"></div><div class="sal-flap"></div><div class="sal-seal">W</div></div>`);
    card.classList.add('show'); btn.disabled = true;
    setTimeout(() => { card.classList.add('open'); btn.disabled = false; btn.textContent = t('salOk'); card.querySelector('.sal-env').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 900);
    fetch('/api/salary/seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => {});
  }

  // награда: отметить прочитанной и поставить (своя комната на странице — сразу, иначе — профиль с #use=)
  function reward(card, x) {
    const C = window.PPCatalog, live = window.PPRoom && PPRoom.live && PPRoom.live.box.isConnected;
    const done = () => fetch('/api/titos/reward/seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => {});
    if (C && C.use && live) { done(); drop('reward', card); const d = document.getElementById('nw-feed'); if (d) d.close(); C.use(x.k, x.v, { me: { nick: me.nick, gifts: [{ status: 'bag', kind: x.k, item: x.v }] } }); return; }
    done().then(() => { location.href = `${pre}/bird/?nick=${encodeURIComponent(me.nick)}#use=${encodeURIComponent(x.k + '|' + x.v)}`; });
  }

  function set(d) {
    me = d && d.user && d.user.nick ? d.user : null;
    news = me ? (d.user.news || []) : [];
    drawBell(); askBox(); fly();
  }
  // после действия на странице (открыто окошко, подарок…) — заново спросить сервер; конвертик второй раз не вылетает
  function refresh() {
    if (!me) return Promise.resolve();
    return fetch('/api/news', { credentials: 'same-origin', headers: window.PPDevH ? window.PPDevH() : {} }).then(r => r.ok ? r.json() : null)
      .then(j => { if (j) { news = j.news || []; drawBell(); } }).catch(() => {});
  }
  window.PPNews = { refresh, open: feed, list: () => known().slice(), pickBox: () => me && pickBox(me.box0 || '') };
  if (window.PPWho) set(window.PPWho);
  document.addEventListener('pp:whoami', e => set(e.detail));
})();
