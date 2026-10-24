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
    card: { // карточки, подаренные из кабинета (worker/cards.js cardGiftNews); гаснет после «Посмотреть» — открывается свой альбом
      icon: '🃏',
      title: x => x.n > 1 ? [`Cards for you! (${x.n})`, `Тебе карточки! (${x.n})`, `Tev kartītes! (${x.n})`][L] : ['A card for you!', 'Тебе карточка!', 'Tev kartīte!'][L],
      text: x => x.note ? '«' + x.note + '»' : ['A gift from Polly — it is already in your album.', 'Подарок от Полли — уже в твоём альбоме.', 'Dāvana no Pollijas — tā jau ir tavā albumā.'][L],
      act: ['Look', 'Посмотреть', 'Apskatīt'],
      open: cardGift,
    },
    trade: { // предложения обмена карточками (этап 7 В); гаснет, когда список открыт в профиле
      icon: '🔁',
      title: x => x.n > 1 ? [`${x.n} trade offers`, `Предложения обмена: ${x.n}`, `Maiņas piedāvājumi: ${x.n}`][L] : ['A trade offer', 'Предложение обмена', 'Maiņas piedāvājums'][L],
      text: x => (x.from || []).map(n => '@' + n).join(', ') + ' · ' + ((x.from || []).length > 1 ? ['want to trade cards with you', 'хотят обменяться карточками', 'grib mainīties ar kartītēm'] : ['wants to trade cards with you', 'хочет обменяться карточками', 'grib mainīties ar kartītēm'])[L],
      act: ['Look', 'Посмотреть', 'Apskatīt'],
      go: () => pre + '/bird/#trades',
    },
    holiday: { // праздник Воббленда (worker/wl-holidays.js): письмо-поздравление с подарком; гаснет, когда подарок открыт
      icon: '🎉',
      title: () => ['A holiday letter!', 'Праздничное письмо!', 'Svētku vēstule!'][L],
      text: x => { const n = wlNote(x); return [`“${n.title}” in ${n.town}`, `«${n.title}» · ${n.town}`, `“${n.title}” · ${n.town}`][L]; },
      act: ['Open the envelope', 'Открыть конвертик', 'Atvērt aploksni'],
      open: holidayLetter,
    },
    reward: { // награда Титоса за уровень 30/50/90/100 (worker/titos.js rewardNews): «Поставить» — useItem в свою комнату
      icon: '🏅',
      title: () => ['A reward!', 'Награда!', 'Balva!'][L],
      text: x => (window.PPBirds ? PPBirds.giftName(x.k, x.v, L) + ' · ' : '') + [`Detective Titos, case No. ${x.level}`, `Детектив Титос, дело №${x.level}`, `Detektīvs Titoss, lieta Nr. ${x.level}`][L],
      act: ['Place it', 'Поставить', 'Novietot'],
      open: reward,
    },
    feathers: { // пёрышки комнате — сводка раз в сутки (worker/flock.js featherNews); гаснет, когда хозяин открыл свой профиль
      icon: '🪶',
      title: x => [`${x.n} ${x.n === 1 ? 'feather' : 'feathers'} for your room`, `Комнате оставили ${x.n} ${pl(x.n, [0, ['пёрышко', 'пёрышка', 'пёрышек']])}`, `Istabai ${x.n} ${pl(x.n, [0, 0, ['spalviņa', 'spalviņas']])}`][L],
      text: x => (x.from || []).map(n => '@' + n).join(', ') + ' · ' + ['dropped by and liked it', 'заглянули в гости, и им понравилось', 'ieskatījās ciemos, un viņiem patika'][L],
      act: ['Look', 'Посмотреть', 'Apskatīt'],
      go: () => pre + '/bird/#feathers',
    },
    seeds: { // семечко из игры, редкое (серия карточки дня) или волшебное (серия полива) — worker/garden.js gardenNews; гаснет в огороде
      icon: '🌱',
      title: x => x.tier === 'magic' ? ['A magic seed!', 'Волшебное семечко!', 'Burvju sēkla!'][L] : x.tier === 'rare' ? ['A rare seed!', 'Редкое семечко!', 'Reta sēkla!'][L]
        : x.n > 1 ? [`${x.n} new seeds`, `Новых семян: ${x.n}`, `Jaunas sēklas: ${x.n}`][L] : ['A seed for your garden', 'Семечко для огорода', 'Sēkla tavam dārzam'][L],
      text: x => ({ game: ['Found in the Button Rain.', 'Нашлось в Пуговичном дожде.', 'Atrasta Pogu lietū.'], potion: ['Found in the potion shop.', 'Нашлось в Зельеварне.', 'Atrasta dziru darbnīcā.'],
        pan: ['Found in Polly’s Pancakes.', 'Нашлось в Блинной Полли.', 'Atrasta Pollijas pankūkās.'], titos: ['Found at Titos’ office.', 'Нашлось у Титоса.', 'Atrasta pie Tito.'], bugs: ['Found while catching bugs for Titos.', 'Нашлось, пока ловились жуки для Титоса.', 'Atrasta, ķerot vaboles Tito.'],
        shift: ['Found during the shift with Polly.', 'Нашлось на смене с Полли.', 'Atrasta maiņā ar Polliju.'], rare: ['For a whole week of stamps on the card of the day.', 'За неделю штампов в карточке дня.', 'Par veselu nedēļu zīmogu dienas kartītē.'],
        magic: ['For watering the garden every day for a week.', 'За неделю полива каждый день.', 'Par dārza laistīšanu katru dienu nedēļas garumā.'] }[x.src] || ['It is waiting in your garden.', 'Оно ждёт в огороде.', 'Tā gaida dārzā.'])[L],
      act: ['Plant it', 'Посадить', 'Iestādīt'],
      go: () => pre + '/garden/',
    },
    school: { // «Школа Полли» (worker/school.js schoolNews): печать или «на доработку» (ставит Алина, ученику — от Полли); гаснет, когда открыта /polly-helps/
      icon: '🎓',
      title: x => x.diploma ? ['Your diploma from Polly’s school! 📜', 'Твой диплом Школы Полли! 📜', 'Tavs Pollijas skolas diploms! 📜'][L] : x.redo && !x.ok ? ['Polly left you a note', 'Полли оставила записку', 'Pollija atstāja zīmīti'][L] : x.n > 1 ? [`Polly checked your pages (${x.n})`, `Полли проверила страницы (${x.n})`, `Pollija pārbaudīja lapas (${x.n})`][L] : ['A stamp from Polly!', 'Печать от Полли!', 'Zīmogs no Pollijas!'][L],
      text: x => x.redo ? [`Lesson ${x.lesson}: something to try once more.`, `Урок ${x.lesson}: кое-что стоит попробовать ещё раз.`, `${x.lesson}. nodarbība: kaut ko vērts pamēģināt vēlreiz.`][L] : [`Lesson ${x.lesson} at Polly’s school.`, `Урок ${x.lesson} в школе Полли.`, `${x.lesson}. nodarbība Pollijas skolā.`][L],
      act: ['Look', 'Посмотреть', 'Apskatīt'],
      go: x => pre + '/polly-helps/' + (x.diploma ? '#diploma' : '#school'),
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
      ['🌪️ Careful — mess! Tap a box three times in a row, and everything inside jumps out and scatters around the room. Guests can do it too, but for them the mess is only on their screen.', '🌪️ Осторожно, бардак! Нажми на коробку три раза подряд, и всё, что внутри, выпрыгнет и разлетится по комнате. Гости тоже так могут, но у них бардак только на их экране.', '🌪️ Uzmanību — nekārtība! Uzspied uz kastes trīs reizes pēc kārtas, un viss, kas iekšā, izlēks un izklīdīs pa istabu. Ciemiņi arī tā var, bet viņiem nekārtība ir tikai viņu ekrānā.'],
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
  // письма по согласию (worker/mail.js): окно при первом входе — «Да, присылать всё», мелко «Выбрать» и «Не сейчас»; галочки не стоят заранее
  const MT = {
    t: ['📮 May Polly write to you?', '📮 Можно писать тебе на почту?', '📮 Vai Pollija drīkst tev rakstīt?'],
    p: ['Now and then: a short letter about your bird, the games and what’s new on the site. Unsubscribe in one click from any letter.', 'Иногда — короткое письмо про птичку, игры и новое на сайте. Отписаться можно в один клик из любого письма.', 'Reizēm — īsa vēstule par putniņu, spēlēm un jaunumiem vietnē. Atrakstīties var ar vienu klikšķi no jebkuras vēstules.'],
    games: ['🎮 Game notifications', '🎮 Уведомления из игр', '🎮 Paziņojumi no spēlēm'],
    gamesD: ['your garden is drying out, a new case is open…', 'сохнут грядки, открылось новое дело…', 'izkalst dobes, atvērta jauna lieta…'],
    feat: ['✨ New things on the site', '✨ Новые фишки на сайте', '✨ Jaunumi vietnē'],
    news: ['🐦 News from Polly', '🐦 Новости от Полли', '🐦 Ziņas no Pollijas'],
    all: ['✅ Yes, send me everything', '✅ Да, присылать всё', '✅ Jā, sūtīt visu'],
    pick: ['Choose what to send', 'Выбрать, что присылать', 'Izvēlēties, ko sūtīt'],
    save: ['Save', 'Сохранить', 'Saglabāt'],
    later: ['Not now', 'Не сейчас', 'Ne tagad'],
    priv: ['Privacy', 'Конфиденциальность', 'Privātums'],
    done: ['📮 Done! You can change this in your profile.', '📮 Готово! Поменять можно в профиле.', '📮 Gatavs! To var mainīt profilā.'],
  };
  function askMail(tries = 0) {
    if (!me || !me.mailAsk || askMail.done) return;
    if (me.box0 === '' || document.querySelector('dialog[open], .adv-modal, .sw-bv')) { if (tries < 120) setTimeout(() => askMail(tries + 1), 1000); return; }
    askMail.done = true;
    const d = document.createElement('dialog'); d.id = 'nw-mail'; d.className = 'nw-dlg nw-maildlg'; d.setAttribute('aria-labelledby', 'nw-mail-t');
    const box = k => `<label class="nw-mailck"><input type="checkbox" data-k="${k}"> <span>${MT[k][L]}${k === 'games' ? `<small>${MT.gamesD[L]}</small>` : ''}</span></label>`;
    d.innerHTML = `<div class="nw-in"><div class="nw-head"><h2 id="nw-mail-t">${MT.t[L]}</h2><button type="button" class="nw-x" aria-label="${t('close')}">✕</button></div>
      <p>${MT.p[L]}</p><ul class="nw-maillist"><li>${MT.games[L]} <small>${MT.gamesD[L]}</small></li><li>${MT.feat[L]}</li><li>${MT.news[L]}</li></ul>
      <p class="nw-mailgo"><button type="button" class="pill-btn pill-fill nw-mailall">${MT.all[L]}</button></p>
      <div class="nw-mailpick" hidden>${box('games')}${box('feat')}${box('news')}<p><button type="button" class="pill-btn nw-mailsave">${MT.save[L]}</button></p></div>
      <p class="nw-mailsmall"><button type="button" class="sw-link nw-mailmore">${MT.pick[L]}</button> · <button type="button" class="sw-link nw-maillater">${MT.later[L]}</button> · <a href="${pre}/privacy/" target="_blank">${MT.priv[L]}</a></p></div>`;
    document.body.appendChild(d);
    const send = async (path, b) => {
      d.querySelectorAll('button').forEach(x => { x.disabled = true; });
      try { await fetch('/api/mail/' + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }); } catch (e) { /* спросим в другой раз */ }
      me.mailAsk = 0; d.close(); d.remove();
      if (path === 'prefs' && (b.games || b.feat || b.news) && window.PPToast) PPToast(MT.done[L], { ms: 4000 });
    };
    const lang = document.documentElement.lang;
    d.querySelector('.nw-mailall').onclick = () => send('prefs', { games: true, feat: true, news: true, lang });
    d.querySelector('.nw-mailmore').onclick = () => { const pk = d.querySelector('.nw-mailpick'), open = pk.hidden; pk.hidden = !open; d.querySelector('.nw-maillist').hidden = open; d.querySelector('.nw-mailgo').hidden = open; };
    d.querySelector('.nw-mailsave').onclick = () => { const v = { lang }; d.querySelectorAll('[data-k]').forEach(c => { v[c.dataset.k] = c.checked; }); send('prefs', v); };
    const later = () => send('later');
    d.querySelector('.nw-maillater').onclick = later; d.querySelector('.nw-x').onclick = later;
    d.addEventListener('cancel', e => { e.preventDefault(); later(); });
    d.showModal();
  }
  // письмо о коробках: прочитать — отметить прочитанным
  // ---------- праздник Воббленда: письмо от жителей города, подарок и ссылка в Воббленд ----------
  // x.note — подарок-вещь ('wl:' + названия | города), иначе пуговки: x.city, x.md, x.btn — название из wl-holidays.json (уже загружен) или из списка в x.t
  let wlDays = null;
  const wlNote = x => { if (x.note) { const a = String(x.note).slice(3).split('|'); return { title: a[L] || a[0] || '', town: a[3 + L] || a[3] || '' }; }
    const h = (wlDays || []).find(d => d.city === x.city && d.md === x.md); return h ? { title: h.title[L], town: h.town[L] } : { title: '', town: 'Wobbleland' }; };
  fetch('/assets/wl-holidays.json').then(r => r.json()).then(d => { wlDays = d; }).catch(() => {});
  async function holidayLetter(card, x) {
    if (card.classList.contains('open')) return drop('holiday', card);
    card.classList.add('open');
    if (!wlDays) wlDays = await fetch('/assets/wl-holidays.json').then(r => r.json()).catch(() => []);
    const n = wlNote(x), en = String(x.note || '').slice(3).split('|')[0];
    const h = wlDays.find(d => x.note ? d.title[0] === en : d.city === x.city && d.md === x.md), gift = x.note ? (window.PPBirds ? PPBirds.giftName(x.k, x.v, L) : '') : '';
    card.insertAdjacentHTML('beforeend', `<div class="nw-paper"><b>${esc([`Hi, @${me.nick}!`, `Привет, @${me.nick}!`, `Sveiks, @${me.nick}!`][L])}</b>
      <p>${esc([`${n.town} celebrates “${n.title}”!`, `${n.town} празднует «${n.title}»!`, `${n.town} svin “${n.title}”!`][L])}</p>${h ? `<p>${esc(h.desc[L])}</p>` : ''}
      <p>${esc(x.note ? ['The whole town sends your bird a holiday gift', 'Весь город шлёт твоей птичке праздничный подарок', 'Visa pilsēta sūta tavam putniņam svētku dāvanu'][L] + (gift ? ': ' + gift : '') + '.'
        : ['Your bird already has every gift like that, so the town sends buttons instead.', 'Таких подарков у твоей птички уже все, поэтому город шлёт пуговки.', 'Tādas dāvanas tavam putniņam jau ir visas, tāpēc pilsēta sūta pogas.'][L])}</p>${x.note ? '' : `<p class="sal-sum">+${x.btn} 🔘</p><p class="sal-note">${t('salNote')}</p>`}
      <i>${esc('— ' + n.town)}</i>
      <p class="nw-paper-act">${x.note ? `<button type="button" class="pill-btn pill-fill nw-wl-gift">🎁 ${esc(['Open the gift', 'Открыть подарок', 'Atvērt dāvanu'][L])}</button> ` : ''}<a class="pill-btn" href="${pre}/wobbleland/">🗺 ${esc(['Visit Wobbleland', 'Заглянуть в Воббленд', 'Ieskatīties Vobblendā'][L])}</a></p></div>`);
    if (!x.note) { fetch('/api/wl-mail/seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => {}); return; }
    card.querySelector('.nw-wl-gift').onclick = () => {
      const gb = document.getElementById('bp-gift'), f = document.getElementById('nw-feed');
      if (gb) { if (f) f.close(); gb.click(); } else location.href = pre + '/bird/#gift';
    };
  }
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
    inline();
    if (!bell) return;
    const n = known().length;
    bell.hidden = !me;
    bell.classList.toggle('has', n > 0);
    bell.setAttribute('aria-label', t('bell') + (n ? ` (${n})` : ''));
    bell.querySelector('.bell-n').textContent = n ? String(n) : '';
    bell.querySelector('.bell-n').hidden = !n;
  }
  // колонка «Мои новости» на главной ([data-my-news]): новые — с кнопкой (открывает ленту, действия там), ниже — уже открытые, бледные с «✓ открыто».
  // Открытые — GET /api/news/history (worker newsHistory: из подарков, зарплат и т. п. — у аккаунта одинаково на всех устройствах).
  let hist = [], histT = 0;
  function loadHist(wait = 0) {
    if (!me || !document.querySelector('[data-my-news]')) return;
    clearTimeout(histT);
    histT = setTimeout(() => fetch('/api/news/history', { credentials: 'same-origin', headers: window.PPDevH ? window.PPDevH() : {} }).then(r => r.ok ? r.json() : null)
      .then(j => { if (j) { hist = (j.items || []).filter(x => KINDS[x.kind]); inline(); } }).catch(() => {}), wait);
  }
  function inline() {
    const els = document.querySelectorAll('[data-my-news]');
    if (!els.length || !me) return;
    const items = known();
    const done = hist.map(x => { const k = KINDS[x.kind]; let go = ''; try { go = k.go ? k.go(x) : ''; } catch (e) {} let text = k.text(x);
      if (x.kind === 'gift') text = [x.from ? ['From @', 'От @', 'No @'][L] + x.from : '', window.PPBirds && x.k ? PPBirds.giftName(x.k, x.v, L) : ''].filter(Boolean).join(' · '); // «ждёт нераскрытым» — уже не так
      if (x.kind === 'gift') go = pre + '/bird/#room';
      if (x.kind === 'salary' && x.sum) text = T.salGot[L](x.sum);
      return { icon: k.icon, title: k.title(x), text, go, at: x.at * 1000 }; });
    const when = ms => new Date(ms).toLocaleDateString(['en-GB', 'ru-RU', 'lv-LV'][L], { day: 'numeric', month: 'short' });
    const opened = ['opened', 'открыто', 'atvērts'][L];
    els.forEach(el => {
      el.innerHTML = `<h2 class="fn-h">🔔 ${t('title')}</h2>` + '<div class="hd-scroll">' + (items.length ? '' : `<p class="fn-msg">${t('empty')}</p>`) + (items.length || done.length ? `<ul class="fn-list">${items.map(x => {
        const k = KINDS[x.kind];
        return `<li class="fn-row nw-mini"><span class="fn-ava" aria-hidden="true">${k.icon}</span><p class="fn-txt"><b>${esc(k.title(x))}</b> ${esc(k.text(x))}</p><button type="button" class="fn-btn">${k.act[L]}</button></li>`;
      }).join('')}${done.map(l => `<li class="fn-row nw-mini nw-done"><span class="fn-ava" aria-hidden="true">${l.icon}</span><p class="fn-txt"><b>${esc(l.title)}</b> ${esc(l.text)}<time>✓ ${opened} · ${when(l.at)}</time></p>${l.go ? `<a class="nw-again" href="${esc(l.go)}">→</a>` : ''}</li>`).join('')}</ul>` : '') + '</div>'; // .hd-scroll: колонка не длиннее соседних, лишнее листается
      el.querySelectorAll('.fn-btn').forEach(b => { b.onclick = () => feed(); });
    });
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
    news = news.filter(x => x.kind !== kind); drawBell(); loadHist(1500);
    if (card) { card.classList.add('gone'); setTimeout(() => { card.remove(); const l = document.querySelector('#nw-feed .nw-list'); if (l && !l.children.length) l.innerHTML = `<p class="nw-empty">${t('empty')}</p>`; }, 350); }
  }

  // зарплата: пуговки уже начислены сервером; здесь письмо открывается (анимация CSS .sal-*, style.css) и отмечается прочитанным
  function salary(card, x, btn) {
    if (card.classList.contains('open')) return drop('salary', card);
    card.id = 'acct-sal';
    if (!card.querySelector('.sal-env')) card.insertAdjacentHTML('beforeend', `<div class="sal-env"><div class="sal-back"></div><div class="sal-letter"><b>${esc(T.salHi[L](me.nick))}</b><p>${t('salText')}</p>
      <p class="sal-sum">${T.salGot[L](x.sum || 0)}</p><p class="sal-note">${t('salNote')}</p><p class="sal-note pp-sew">${esc(window.PPSew || '')}</p><i>${t('salSign')}</i></div><div class="sal-front"></div><div class="sal-flap"></div><div class="sal-seal">W</div></div>`);
    card.classList.add('show'); btn.disabled = true;
    setTimeout(() => { card.classList.add('open'); btn.disabled = false; btn.textContent = t('salOk'); card.querySelector('.sal-env').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 900);
    fetch('/api/salary/seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => {});
  }

  // награда: отметить прочитанной и поставить (своя комната на странице — сразу, иначе — профиль с #use=)
  function cardGift(card) {
    fetch('/api/cards/gift-seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => {});
    drop('card', card); const d = document.getElementById('nw-feed'); if (d) d.close();
    const go = () => window.PPCards.album(me.nick);
    if (window.PPCards) return go();
    const s = document.createElement('script'); s.src = '/assets/cards-ui.js'; s.onload = go; s.onerror = () => { location.href = `${pre}/bird/?nick=${encodeURIComponent(me.nick)}`; }; document.head.appendChild(s);
  }
  function reward(card, x) {
    const C = window.PPCatalog, live = window.PPRoom && PPRoom.live && PPRoom.live.box.isConnected;
    const done = () => fetch('/api/titos/reward/seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => {});
    if (C && C.use && live) { done(); drop('reward', card); const d = document.getElementById('nw-feed'); if (d) d.close(); C.use(x.k, x.v, { me: { nick: me.nick, gifts: [{ status: 'bag', kind: x.k, item: x.v }] } }); return; }
    done().then(() => { location.href = `${pre}/bird/?nick=${encodeURIComponent(me.nick)}#use=${encodeURIComponent(x.k + '|' + x.v)}`; });
  }

  function set(d) {
    me = d && d.user && d.user.nick ? d.user : null;
    news = me ? (d.user.news || []) : [];
    drawBell(); askBox(); askMail(); fly(); loadHist();
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
