// «Стена рисунков»: вход через Google, ник, загрузка работы дня, серии и бейджи, топ, стена, модерация, GDPR.
// Сервер — worker/index.js (/api/*). Пока сервер не подключён, показываем «Скоро».
(() => {
  const app = document.getElementById('sw-app');
  const profileOnly = !app; // на других страницах (например, «Стая») — только окно профиля птички
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const locale = ['en-GB', 'ru-RU', 'lv-LV'][L];
  const T = {
    soon: ['The Sketch Wall opens very soon. Meanwhile, draw today’s theme on the Daily Challenge page!', 'Стена рисунков скоро откроется. А пока нарисуйте тему дня на странице челленджа!', 'Skiču siena drīz atvērsies. Pagaidām uzzīmē dienas tēmu izaicinājuma lapā!'],
    toChallenge: ['To the Daily Challenge', 'К челленджу', 'Uz izaicinājumu'],
    signTitle: ['Join the wall', 'Присоединяйтесь к стене', 'Pievienojies sienai'],
    signText: ['Sign in with Google to upload your daily sketch, keep your streak and collect badges. No passwords.', 'Войдите через Google, чтобы загружать рисунок дня, вести серию и собирать бейджи. Без паролей.', 'Ienāc ar Google, lai augšupielādētu dienas skici, turētu sēriju un krātu nozīmītes. Bez parolēm.'],
    devLogin: ['Dev login', 'Тестовый вход', 'Testa ieeja'],
    nickTitle: ['Choose your nickname', 'Выберите ник', 'Izvēlies segvārdu'],
    nickText: ['It will be shown under your sketches and in the top. 2–24 letters, numbers, _ . -', 'Он будет под вашими рисунками и в топе. 2–24 символа: буквы, цифры, _ . -', 'Tas būs redzams zem tavām skicēm un topā. 2–24 simboli: burti, cipari, _ . -'],
    save: ['Save', 'Сохранить', 'Saglabāt'],
    nickBad: ['Use 2–24 letters, numbers, _ . -', 'Нужно 2–24 символа: буквы, цифры, _ . -', 'Vajag 2–24 simbolus: burti, cipari, _ . -'],
    nickTaken: ['This nickname is taken, try another one.', 'Этот ник уже занят, попробуйте другой.', 'Šis segvārds ir aizņemts, pamēģini citu.'],
    streak: [n => `${n} day${n === 1 ? '' : 's'} in a row`, n => `${n} ${pl(n, 'день', 'дня', 'дней')} подряд`, n => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'diena' : 'dienas'} pēc kārtas`],
    best: [n => `Best: ${n}`, n => `Рекорд: ${n}`, n => `Rekords: ${n}`],
    toNext: [(n, l) => `${n} more day${n === 1 ? '' : 's'} to “${l}”`, (n, l) => `Ещё ${n} ${pl(n, 'день', 'дня', 'дней')} до «${l}»`, (n, l) => `Vēl ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'diena' : 'dienas'} līdz “${l}”`],
    maxLevel: ['You reached the top level!', 'Вы на высшем уровне!', 'Tu esi augstākajā līmenī!'],
    badges: ['Badges', 'Бейджи', 'Nozīmītes'],
    today: ['Today’s theme', 'Тема дня', 'Dienas tēma'],
    pick: ['Choose a photo of your sketch', 'Выбрать фото рисунка', 'Izvēlēties skices foto'],
    consent: ['I agree that my sketch is shown publicly on this wall with my nickname, and I am 13 or older.', 'Я согласен(на), что мой рисунок будет публично показан на этой стене с моим ником, и мне есть 13 лет.', 'Piekrītu, ka mana skice tiks publiski rādīta šajā sienā ar manu segvārdu, un man ir vismaz 13 gadi.'],
    upload: ['Put it on the wall', 'Повесить на стену', 'Likt uz sienas'],
    uploading: ['Uploading…', 'Загружаю…', 'Augšupielādē…'],
    posted: ['Today’s sketch is on the wall ✓', 'Рисунок дня уже на стене ✓', 'Dienas skice ir uz sienas ✓'],
    replace: ['Replace', 'Заменить', 'Aizstāt'],
    del: ['Delete', 'Удалить', 'Dzēst'],
    delAsk: ['Delete this sketch?', 'Удалить этот рисунок?', 'Dzēst šo skici?'],
    logout: ['Sign out', 'Выйти', 'Iziet'],
    myData: ['Download my data', 'Скачать мои данные', 'Lejupielādēt manus datus'],
    delAcc: ['Delete my account', 'Удалить аккаунт', 'Dzēst kontu'],
    delAccAsk: ['Delete your account, all your sketches and your streak? This can’t be undone.', 'Удалить аккаунт, все ваши рисунки и серию? Это нельзя отменить.', 'Dzēst kontu, visas tavas skices un sēriju? To nevarēs atsaukt.'],
    err: ['Something went wrong. Please try again.', 'Что-то пошло не так. Попробуйте ещё раз.', 'Kaut kas nogāja greizi. Pamēģini vēlreiz.'],
    banned: ['This account is blocked.', 'Этот аккаунт заблокирован.', 'Šis konts ir bloķēts.'],
    big: ['This file is too big or isn’t a picture.', 'Файл слишком большой или это не картинка.', 'Fails ir par lielu vai nav attēls.'],
    emptyTop: ['No streaks yet. Be the first!', 'Серий пока нет. Будьте первым!', 'Sēriju vēl nav. Esi pirmais!'],
    emptyWall: ['The wall is waiting for the first sketch.', 'Стена ждёт первый рисунок.', 'Siena gaida pirmo skici.'],
    levelUp: ['New level!', 'Новый уровень!', 'Jauns līmenis!'],
    have: ['You have it ✓', 'Получен ✓', 'Iegūta ✓'],
    storage: ['storage', 'хранилище', 'krātuve'],
    noWorks: ['No sketches on the wall right now.', 'Сейчас работ на стене нет.', 'Šobrīd uz sienas nav skiču.'],
    dToday: ['Today', 'Сегодня', 'Šodien'], dYesterday: ['Yesterday', 'Вчера', 'Vakar'], d2ago: ['2 days ago', 'Позавчера', 'Aizvakar'],
    themeOf: ['Theme of', 'Тема за', 'Tēma par'],
    hadIt: ['You had it once', 'Был у вас', 'Tev tā bija'],
    notYet: ['Not yet', 'Ещё впереди', 'Vēl priekšā'],
    tapBadge: ['Tap a badge to see it up close and how to get it.', 'Нажмите на значок, чтобы рассмотреть его и узнать, как получить.', 'Pieskaries nozīmītei, lai to apskatītu un uzzinātu, kā to iegūt.'],
    newBadge: ['New badge!', 'Новый бейдж!', 'Jauna nozīmīte!'],
    unpick: ['Remove', 'Снять', 'Noņemt'],
    picked: [n => `Picked ${n} time${n === 1 ? '' : 's'}. Every 5 picks = a star, 3 stars = a golden nickname.`, n => `Выбран(а) ${n} ${pl(n, 'раз', 'раза', 'раз')}. Каждые 5 раз — звезда, 3 звезды — золотой ник.`, n => `Izvēlēts ${n} reizi. Katras 5 reizes — zvaigzne, 3 zvaigznes — zelta segvārds.`],
    giftNew: [n => `A gift for you!${n > 1 ? ' (' + n + ')' : ''}`, n => `Тебе подарок!${n > 1 ? ' (' + n + ')' : ''}`, n => `Tev dāvana!${n > 1 ? ' (' + n + ')' : ''}`],
    bag: ['Bag', 'Сумка', 'Soma'],
    shareBird: ['Share my bird', 'Поделиться птичкой', 'Dalīties ar putniņu'],
    btnT: ['🔘 Buttons', '🔘 Пуговки', '🔘 Pogas'],
    btnHave: [n => `You have ${n}`, n => `У вас ${n}`, n => `Tev ir ${n}`],
    btnHow: ['How to earn buttons', 'Как получить пуговки', 'Kā nopelnīt pogas'],
    btnDaily: [n => `Visit the site: +${n} once a day`, n => `Зайти на сайт: +${n} раз в сутки`, n => `Apmeklē vietni: +${n} reizi dienā`],
    btnUpload: [n => `Upload a drawing to the challenge: +${n}`, n => `Загрузить рисунок в челлендж: +${n}`, n => `Augšupielādē zīmējumu izaicinājumā: +${n}`],
    btnComment: [(n, k, m) => `Comment on any blog post: +${n} each, ${m} times a day (today ${k}/${m})`, (n, k, m) => `Комментарий под любым постом: +${n}, до ${m} раз в сутки (сегодня ${k}/${m})`, (n, k, m) => `Komentārs zem jebkura ieraksta: +${n}, līdz ${m} reizēm dienā (šodien ${k}/${m})`],
    btnFriend: [(n, k) => `A friend signs up and picks you as the one who invited them: +${n} for each (friends: ${k})`, (n, k) => `Друг регистрируется и выбирает тебя как пригласившего: +${n} за каждого (друзей: ${k})`, (n, k) => `Draugs reģistrējas un izvēlas tevi kā uzaicinātāju: +${n} par katru (draugi: ${k})`],
    btnToday: ['done today', 'сегодня уже', 'šodien jau'],
    btnBadges: ['New badges: from +5 to +300 for each (tap a badge to see how much)', 'Новые бейджи: от +5 до +300 за каждый (нажмите на бейдж — там видно, сколько)', 'Jaunas nozīmītes: no +5 līdz +300 par katru (spied uz nozīmītes, lai redzētu, cik)'],
    btnPick: [n => `Polly’s Choice for your drawing: +${n}`, n => `«Выбор Полли» для вашего рисунка: +${n}`, n => `“Pollijas izvēle” tavam zīmējumam: +${n}`],
    btnBadge: [n => `🔘 +${n} buttons for this badge`, n => `🔘 +${n} пуговок за этот бейдж`, n => `🔘 +${n} pogas par šo nozīmīti`],
    btnForBadges: [n => `+${n} 🔘 buttons for your badges!`, n => `+${n} 🔘 пуговок за достижения!`, n => `+${n} 🔘 pogas par sasniegumiem!`],
    give: ['🎁 Gift', '🎁 Подарить', '🎁 Uzdāvināt'],
    giveT: ['Gift it to another bird', 'Подарить другой птичке', 'Uzdāvināt citam putniņam'],
    giveText: ['The thing leaves your bag and arrives as an unopened gift. Only things bought in the shop can be gifted.', 'Вещь уйдёт из вашей сумки и придёт птичке неоткрытым подарком. Дарить можно только купленное в магазине.', 'Lieta pazudīs no tavas somas un pienāks putniņam kā neatvērta dāvana. Dāvināt var tikai veikalā pirktās lietas.'],
    givePh: ['bird’s nickname', 'ник птички', 'putniņa segvārds'],
    giveGo: ['Give', 'Подарить', 'Uzdāvināt'],
    giveOk: [n => `Gift sent to @${n} 🎁`, n => `Подарок отправлен @${n} 🎁`, n => `Dāvana nosūtīta @${n} 🎁`],
    giveNo: ['There is no bird with this nickname.', 'Птички с таким ником нет.', 'Putniņa ar tādu segvārdu nav.'],
    giveHas: ['This bird already has this thing.', 'У этой птички уже есть эта вещь.', 'Šim putniņam šī lieta jau ir.'],
    fromBird: [n => `🎁 A gift from @${n}`, n => `🎁 Подарок от @${n}`, n => `🎁 Dāvana no @${n}`],
    btnShop: ['🛍 Shop', '🛍 Магазин', '🛍 Veikals'],
    btnInvite: ['📤 Invite a friend', '📤 Позвать друга', '📤 Uzaicināt draugu'],
    btnEarned: [n => `+${n} 🔘 buttons!`, n => `+${n} 🔘 пуговок!`, n => `+${n} 🔘 pogas!`],
    btnOther: [n => `🔘 ${n} buttons`, n => `🔘 ${n} пуговок`, n => `🔘 ${n} pogas`],
    shareThis: ['Share', 'Поделиться', 'Dalīties'],
    seedOf: [k => `A seed: ${k}`, k => `Семечко: ${k}`, k => `Sēkla: ${k}`],
    fromAlina: ['— Alina', '— Алина', '— Alīna'],
    open: ['Open', 'Открыть', 'Atvērt'],
    use: ['✨ Use it', '✨ Использовать', '✨ Izmantot'],
    later: ['↩ Back (into the bag)', '↩ Вернуться (в сумку)', '↩ Atpakaļ (somā)'],
    bagTitle: ['Your bag', 'Твоя сумка', 'Tava soma'],
    bagNote: ['Everything you get stays here forever. Tap a thing to put it on or take it off.', 'Всё, что ты получаешь, остаётся здесь навсегда. Нажми на вещь, чтобы надеть или снять.', 'Viss, ko saņem, paliek šeit uz visiem laikiem. Pieskaries lietai, lai to uzvilktu vai novilktu.'],
    bagEmptyOther: ['The bag is empty for now.', 'Сумка пока пустая.', 'Soma pagaidām ir tukša.'],
    bagEmpty: ['Empty for now. Gifts from Alina will appear here.', 'Пока пусто. Здесь появятся подарки от Алины.', 'Pagaidām tukšs. Šeit parādīsies Alīnas dāvanas.'],
    wearing: ['on ✓', 'надето ✓', 'uzvilkts ✓'],
    kinds: [{ bg: 'background', shoes: 'shoes', hat: 'hat', anim: 'animation', frame: 'frame', item: 'a treat to hold', scarf: 'scarf' }, { bg: 'фон', shoes: 'обувь', hat: 'головной убор', anim: 'анимация', frame: 'рамка', item: 'вкусняшка в клюв', scarf: 'шарфик' }, { bg: 'fons', shoes: 'apavi', hat: 'galvassega', anim: 'animācija', frame: 'rāmis', item: 'gardums knābī', scarf: 'šalle' }],
    pageN: [n => `Page ${n}`, n => `Страница ${n}`, n => `Lapa ${n}`],
    hide: ['Hide', 'Скрыть', 'Paslēpt'], ban: ['Block', 'Блок', 'Bloķēt'],
    banAsk: ['Block this user? Their sketches disappear from the wall.', 'Заблокировать пользователя? Его рисунки пропадут со стены.', 'Bloķēt lietotāju? Viņa skices pazudīs no sienas.'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  function pl(n, a, b, c) { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; }
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, opt = {}) => {
    const r = await fetch('/api/' + path, { credentials: 'same-origin', ...opt });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(data.error || r.status); e.code = data.error; e.status = r.status; throw e; }
    return data;
  };
  const post = (path, body) => api(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) });

  // ---------- уровни и бейджи ----------
  const HOW_LEVEL = [d => `Draw ${d} day${d === 1 ? '' : 's'} in a row (best streak)`, d => `Рисовать ${d} ${pl(d, 'день', 'дня', 'дней')} подряд (рекорд серии)`, d => `Zīmēt ${d} ${d % 10 === 1 && d % 100 !== 11 ? 'dienu' : 'dienas'} pēc kārtas (sērijas rekords)`];
  const LEVELS = [
    { d: 1, n: ['Egg', 'Яйцо', 'Ola'], f: ['Something is about to hatch. Probably talent.', 'Что-то вот-вот вылупится. Скорее всего, талант.', 'Kaut kas tūlīt izšķilsies. Visticamāk, talants.'], s: 'egg', bg: '#F4F0FA' },
    { d: 3, n: ['Chick', 'Птенец', 'Cālis'], f: ['Already pecking at paper. Cute and dangerous.', 'Уже клюёт бумагу. Мило и опасно.', 'Jau knābā papīru. Mīlīgi un bīstami.'], s: 'chick', bg: '#F7E7A6' },
    { d: 7, n: ['Little pigeon', 'Голубёнок', 'Balodītis'], f: ['A whole week! Polly nods approvingly.', 'Целая неделя! Полли одобрительно кивает.', 'Vesela nedēļa! Pollija atzinīgi māj ar galvu.'], s: 'polly', bg: '#CFC7E8' },
    { d: 14, n: ['Carrier pigeon', 'Почтовый голубь', 'Pasta balodis'], f: ['Delivers sketches on schedule. Rain or shine.', 'Доставляет скетчи по расписанию. В дождь и в снег.', 'Piegādā skices pēc grafika. Lietū un sniegā.'], s: 'post', bg: '#C6E4D6' },
    { d: 30, n: ['Travelling pigeon', 'Голубь-путешественник', 'Ceļotājs balodis'], f: ['30 days! Has seen things. Has drawn things.', '30 дней! Многое повидал. Многое нарисовал.', '30 dienas! Daudz redzēts. Daudz uzzīmēts.'], s: 'travel', bg: '#F5C4B3' },
    { d: 60, n: ['Artist pigeon', 'Голубь-художник', 'Mākslinieks balodis'], f: ['Wears a beret. Professionally.', 'Носит берет. Профессионально.', 'Nēsā bereti. Profesionāli.'], s: 'artist', bg: '#F0A987' },
    { d: 100, n: ['Astronaut pigeon', 'Голубь-астронавт', 'Astronauts balodis'], f: ['100 days. Officially out of this world.', '100 дней. Официально вне этого мира.', '100 dienas. Oficiāli ārpus šīs pasaules.'], s: 'astro', bg: '#9FB6E8' },
    { d: 365, n: ['Polly legend', 'Легенда Полли', 'Pollijas leģenda'], f: ['A whole year. Pigeons tell legends about you.', 'Целый год. Голуби слагают о вас легенды.', 'Vesels gads. Baloži par tevi stāsta leģendas.'], s: 'crown', bg: '#9C8FE0' },
  ];
  const SPECIAL = [
    { k: 'extra', f: ['Took the extra challenge and didn’t even blink.', 'Взял(а) экстра-задание и даже не моргнул(а).', 'Paņēmi papildu uzdevumu un pat nesamirkšķināji.'], n: ['EXTRA day done', 'День ЭКСТРА пройден', 'EKSTRA diena paveikta'], s: 'sparkle', bg: '#F7E7A6',
      h: ['Upload a sketch on the monthly EXTRA day (see the calendar on the Daily Challenge page)', 'Загрузить рисунок в день ЭКСТРА (раз в месяц, отмечен в календаре челленджа)', 'Augšupielādēt skici EKSTRA dienā (reizi mēnesī, atzīmēta izaicinājuma kalendārā)'] },
    { k: 'bw', f: ['Ink in the veins. Colours are overrated.', 'Тушь в венах. Цвета переоценены.', 'Tuša vēnās. Krāsas ir pārvērtētas.'], n: ['Ink mood: drew in B/W', 'Нарисовал(а) в Ч/Б', 'Zīmēju melnbalti'], s: 'ink', bg: '#F4F4F4',
      h: ['Upload a sketch with “Black & white” mode switched on on the Daily Challenge page', 'Загрузить рисунок, когда на странице челленджа включён режим «Ч/Б»', 'Augšupielādēt skici, kad izaicinājuma lapā ieslēgts “Melnbalts”'] },
    { k: 'bday', f: ['Came to Polly’s party with a drawing instead of a cake.', 'Пришёл(ла) к Полли на день рождения с рисунком вместо торта.', 'Atnāci uz Pollijas ballīti ar zīmējumu kūkas vietā.'], n: ['Polly’s birthday guest', 'Гость на дне рождения Полли', 'Pollijas dzimšanas dienas viesis'], s: 'party', bg: '#F9D3E3',
      h: ['Upload a sketch on 23 January', 'Загрузить рисунок 23 января', 'Augšupielādēt skici 23. janvārī'] },
    { k: 'alt', f: ['Draws every other day, rests like a pro.', 'Рисует через день, отдыхает как профи.', 'Zīmē katru otro dienu, atpūšas kā profesionālis.'], n: ['Every other day', 'Через денёк', 'Katru otro dienu'], s: 'sleepy', bg: '#CDE7F7',
      h: ['Upload 15 sketches in a row, each exactly every other day (about a month)', 'Загрузить 15 рисунков подряд строго через день (примерно месяц)', 'Augšupielādēt 15 skices pēc kārtas, katru otro dienu (apmēram mēnesis)'] },
    { k: 'monthly', f: ['Drops in once a month, like a full moon.', 'Заглядывает раз в месяц, как полнолуние.', 'Ienāk reizi mēnesī kā pilnmēness.'], n: ['Monthly regular', 'Каждый месяц', 'Ik mēnesi'], s: 'moon', bg: '#D9D3F2',
      h: ['Upload at least one sketch in 3 calendar months in a row', 'Загрузить хотя бы один рисунок в 3 календарных месяцах подряд', 'Augšupielādēt vismaz vienu skici 3 kalendāra mēnešos pēc kārtas'] },
    { k: 'pick', n: ['Polly’s pick', 'Выбор Полли', 'Pollijas izvēle'], s: 'medal', bg: '#F0A987',
      f: ['Polly pecked your sketch with approval. The highest honour.', 'Полли одобрительно клюнула ваш рисунок. Высшая награда.', 'Pollija atzinīgi noknābāja tavu skici. Augstākais gods.'],
      past: ['Once Polly’s pick. Forever in history.', 'Когда-то — выбор Полли. Навсегда в истории.', 'Reiz Pollijas izvēle. Uz visiem laikiem vēsturē.'],
      h: ['Polly picks one sketch she loves. Only one owner at a time: when she picks another, yours turns black & white. Every 5 picks earn a star; 3 stars give you a golden nickname.', 'Полли выбирает один рисунок, который ей особенно понравился. Владелец только один: когда она выберет другой, ваш бейдж станет чёрно-белым. Каждые 5 выборов — звезда, 3 звезды — золотой ник.', 'Pollija izvēlas vienu skici, kas viņai īpaši patīk. Īpašnieks tikai viens: kad viņa izvēlas citu, tava nozīmīte kļūst melnbalta. Katras 5 izvēles — zvaigzne, 3 zvaigznes — zelta segvārds.'] },
    { k: 'veteran', f: ['Here since the dinosaurs. Well, almost three years.', 'Здесь со времён динозавров. Ну, почти три года.', 'Šeit kopš dinozauru laikiem. Nu, gandrīz trīs gadus.'],
      n: ['Old-timer', 'Старожил', 'Vecais draugs'], s: 'wise', bg: '#EADFC8',
      h: ['Upload at least 2 sketches every month for 36 months in a row (3 years). No daily streak needed.', 'Загружать хотя бы 2 рисунка в каждом месяце 36 месяцев подряд (3 года). Ежедневная серия не нужна.', 'Augšupielādēt vismaz 2 skices katru mēnesi 36 mēnešus pēc kārtas (3 gadus). Ikdienas sērija nav vajadzīga.'] },
    { k: 'early', s: 'early', bg: '#FBE3A1', n: ['Early bird', 'Ранняя пташка', 'Agrais putniņš'], f: ['Draws before the coffee is ready.', 'Рисует раньше, чем сварится кофе.', 'Zīmē, pirms kafija gatava.'],
      h: ['Upload 5 sketches before 8 in the morning', 'Загрузить 5 рисунков до 8 утра', 'Augšupielādēt 5 skices pirms 8 rītā'] },
    { k: 'owl', s: 'owl', bg: '#C9C3EA', n: ['Night owl', 'Ночная сова', 'Nakts pūce'], f: ['The best ideas come after midnight.', 'Лучшие идеи приходят после полуночи.', 'Labākās idejas nāk pēc pusnakts.'],
      h: ['Upload 5 sketches between 11 pm and 4 am', 'Загрузить 5 рисунков между 23:00 и 4:00', 'Augšupielādēt 5 skices no 23:00 līdz 4:00'] },
    { k: 'weekend', s: 'weekend', bg: '#BFE3FF', n: ['Weekend artist', 'Художник выходного дня', 'Brīvdienu mākslinieks'], f: ['Saturday? Sunday? Sketchbook day.', 'Суббота? Воскресенье? День скетчбука.', 'Sestdiena? Svētdiena? Skiču dienas.'],
      h: ['Draw on both Saturday and Sunday of the same weekend, 4 times', 'Нарисовать и в субботу, и в воскресенье одних выходных — 4 раза', 'Zīmēt gan sestdienā, gan svētdienā vienās brīvdienās — 4 reizes'] },
    { k: 'ten', s: 'ten', bg: '#E2D3F7', n: ['First ten', 'Первая десятка', 'Pirmais desmitnieks'], f: ['Ten sketches. The habit has a pulse.', 'Десять рисунков. У привычки появился пульс.', 'Desmit skices. Ieradumam ir pulss.'],
      h: ['Upload 10 sketches in total', 'Загрузить всего 10 рисунков', 'Kopā augšupielādēt 10 skices'] },
    { k: 'fifty', s: 'fifty', bg: '#CDEBD8', n: ['Half a hundred', 'Полсотни', 'Pussimts'], f: ['A whole stack of sketchbooks!', 'Целая стопка скетчбуков!', 'Vesela skiču bloku kaudze!'],
      h: ['Upload 50 sketches in total', 'Загрузить всего 50 рисунков', 'Kopā augšupielādēt 50 skices'] },
    { k: 'hundred', s: 'hundred', bg: '#FBE3A1', n: ['Hundred club', 'Клуб сотни', 'Simtnieku klubs'], f: ['One hundred sketches. Laurels well earned.', 'Сто рисунков. Лавры заслужены.', 'Simts skices. Lauri pelnīti.'],
      h: ['Upload 100 sketches in total', 'Загрузить всего 100 рисунков', 'Kopā augšupielādēt 100 skices'] },
    { k: 'inkmaster', s: 'inkpot', bg: '#E6E6E6', n: ['Ink master', 'Мастер туши', 'Tušas meistars'], f: ['Ten times in black and white. Ink runs in the family.', 'Десять раз в Ч/Б. Тушь — это семейное.', 'Desmit reizes melnbaltā. Tuša ir ģimenē.'],
      h: ['Upload 10 sketches in “Black & white” mode', 'Загрузить 10 рисунков в режиме «Ч/Б»', 'Augšupielādēt 10 skices “Melnbaltā” režīmā'] },
    { k: 'comeback', s: 'comeback', bg: '#FBD3E3', n: ['Welcome back', 'С возвращением', 'Laipni atpakaļ'], f: ['Life happens. The sketchbook waited for you.', 'Жизнь бывает разной. Скетчбук вас дождался.', 'Dzīve notiek. Skiču bloks tevi gaidīja.'],
      h: ['Come back and upload a sketch after a break of 30 days or more', 'Вернуться и загрузить рисунок после перерыва в 30 дней и больше', 'Atgriezties un augšupielādēt skici pēc 30 vai vairāk dienu pārtraukuma'] },
    { k: 'newyear', s: 'newyear', bg: '#CFE6F7', n: ['New Year sketch', 'Новогодний скетч', 'Jaungada skice'], f: ['Started the year with a pencil in hand.', 'Встретил(а) год с карандашом в руке.', 'Sagaidīji gadu ar zīmuli rokā.'],
      h: ['Upload a sketch on 31 December or 1 January', 'Загрузить рисунок 31 декабря или 1 января', 'Augšupielādēt skici 31. decembrī vai 1. janvārī'] },
    { k: 'halloween', s: 'pumpkin', bg: '#F7C9A3', n: ['Spooky sketch', 'Тыквенный скетч', 'Ķirbju skice'], f: ['Drew on Halloween and wasn’t even scared.', 'Рисовал(а) на Хеллоуин и даже не испугался(ась).', 'Zīmēji Helovīnā un pat nenobijies.'],
      h: ['Upload a sketch on 31 October', 'Загрузить рисунок 31 октября', 'Augšupielādēt skici 31. oktobrī'] },
    { k: 'clock', f: ['Polly sets her watch by you.', 'Полли сверяет по вам часы.', 'Pollija pēc tevis regulē pulksteni.'], n: ['Like clockwork', 'Как по часам', 'Kā pulkstenis'], s: 'clock', bg: '#FBE3D6',
      h: ['Upload 10 sketches in a row at about the same time of day (within one hour)', 'Загрузить 10 рисунков подряд примерно в одно время суток (в пределах часа)', 'Augšupielādēt 10 skices pēc kārtas apmēram vienā laikā (vienas stundas robežās)'] },
  ];
  const POLLY = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...',
    '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const SPR = {
    egg: ['..............', '.....dddd.....', '....dwwwwd....', '...dwwwwwwd...', '...dwwswwwd...', '..dwwwwwwwwd..', '..dwwwwwswwd..',
      '..dwswwwwwwd..', '..dwwwwwwwwd..', '..dwwwwwwwwd..', '...dwwwwwwd...', '....dwwwwd....', '.....dddd.....', '..............'],
    chick: ['..............', '.....dddd.....', '....dyyyyd....', '...dyyykyd....', '...dyyyyydoo..', '...dyyyyyd....', '..dyyyyyyyd...',
      '.dyyyyyyyyyd..', '.dwdwdwdwdwd..', '.dwwwwwwwwwd..', '..dwwwwwwwd...', '...ddddddd....', '..............', '..............'],
  };
  const COL = { d: '#1a1528', b: '#7f81bf', s: '#5e5a9c', w: '#ffffff', k: '#1a1528', o: '#f2a73b', y: '#F2C230', e: '#FFFDF8', r: '#D9372B',
    n: '#8A5A3C', g: '#E9A93B', h: '#BFE3FF', c: '#c9b8e8', p: '#EE7DB0', l: '#FFF3B0', m: '#F7D774' };
  const EXTRA_PIX = {
    post: [[10, 6, 'eeee'], [10, 7, 'eree'], [10, 8, 'eeee']],
    travel: [[10, 9, '.nn.'], [9, 10, 'nnnnn'], [9, 11, 'nggnn'], [9, 12, 'nnnnn']],
    artist: [[4, -2, '..rrrr'], [3, -1, '.rrrrrrr'], [3, 0, 'rrr...r']],
    crown: [[4, -3, 'd.d.d'], [4, -2, 'gdgdg'], [3, -1, 'dgggggd'], [3, 0, 'dgrgrgd'], [4, 1, 'ddddd']],
    // особые бейджи — тоже Полли в образе
    sparkle: [[11, -3, '.l.'], [10, -2, 'lml'], [11, -1, '.l.'], [1, 0, '.m.'], [0, 1, 'mlm'], [1, 2, '.m.'], [12, 4, 'l'], [3, -2, 'm']],
    ink: [[9, 13, '.dd'], [8, 12, 'd'], [12, 12, 'd'], [12, 9, 'dd'], [13, 8, 'd'], [12, 6, '.n'], [12, 7, 'dd']],
    party: [[7, -3, 'y'], [6, -2, 'pyp'], [5, -1, 'ypypy'], [1, 0, 'p'], [12, -1, 'y'], [2, 3, 'h'], [13, 1, 'p'], [0, 5, 'y']],
    sleepy: [[7, 2, 'bb'], [7, 3, 'dd'], [10, -3, 'hhh'], [11, -2, 'h'], [10, -1, 'hhh'], [13, -2, 'h'], [12, 0, 'hh']],
    moon: [[1, -3, '.mmm'], [0, -2, 'mm'], [0, -1, 'mm'], [1, 0, '.mmm'], [12, -2, 'l'], [6, -3, 'l']],
    clock: [[9, 7, 'd...d'], [9, 8, '.rrr.'], [9, 9, 'rwwwr'], [9, 10, 'rwddr'], [9, 11, 'rwwwr'], [9, 12, '.rrr.'], [9, 13, 'd...d']],
    // мудрая Полли: круглые очки и тросточка
    wise: [[7, 1, 'mm'], [6, 2, 'm'], [9, 2, 'm'], [6, 3, 'm'], [9, 3, 'm'], [7, 4, 'mm'], [5, 2, 'm'], [3, -1, '.c.'], [4, 0, 'c'], [12, 6, 'nn'], [12, 7, '.n'], [12, 8, '.n'], [12, 9, '.n'], [12, 10, '.n'], [12, 11, '.n'], [12, 12, '.n'], [13, 13, 'd']],
    early: [[0, -3, 'm.m.m'], [1, -2, 'mmm'], [0, -1, 'mmlmm'], [1, 0, 'mmm'], [0, 1, 'm.m.m']],
    owl: [[5, -3, '...c'], [4, -2, '..ccc'], [3, -1, '.ccccl'], [3, 0, 'cccccc'], [12, -3, 'l'], [1, -2, 'l'], [0, 3, 'l'], [13, 2, 'l']],
    weekend: [[6, 2, 'kkk.kk'], [6, 3, 'kkkkkk'], [7, 4, 'k..k'], [12, 8, 'h'], [11, 9, 'hhh'], [12, 10, 'p'], [12, 11, 'd']],
    ten: [[0, 3, 'g.ggg'], [0, 4, 'g.g.g'], [0, 5, 'g.g.g'], [0, 6, 'g.g.g'], [0, 7, 'g.ggg']],
    fifty: [[9, 9, 'rrrrr'], [9, 10, 'nnnnn'], [9, 11, 'hhhhh'], [9, 12, 'ppppp'], [10, 8, 'eee']],
    hundred: [[1, 2, 'g'], [0, 3, 'g'], [0, 4, 'g'], [0, 5, 'g'], [1, 6, 'g'], [2, 7, 'g'], [12, 2, 'g'], [13, 3, 'g'], [13, 4, 'g'], [13, 5, 'g'], [12, 6, 'g'], [11, 7, 'g'], [5, -3, '.m.m.'], [5, -2, 'mmmmm']],
    inkpot: [[10, 7, '.d.'], [9, 8, 'ddd'], [9, 9, 'dkd'], [9, 10, 'dkd'], [9, 11, 'ddd'], [12, 5, 'n'], [12, 6, 'n'], [13, 4, 'n']],
    comeback: [[10, -3, 'pp.pp'], [10, -2, 'ppppp'], [11, -1, 'ppp'], [12, 0, 'p'], [0, 2, 'hh'], [0, 3, 'h'], [0, 4, 'hhh']],
    newyear: [[8, -3, '....w'], [5, -2, '.rrrrw'], [4, -1, 'rrrrr'], [3, 0, 'wwwwwww'], [0, 2, 'h.h'], [1, 3, 'h'], [0, 4, 'h.h']],
    pumpkin: [[1, 8, '.n.'], [0, 9, 'ooooo'], [0, 10, 'okoko'], [0, 11, 'ooooo'], [0, 12, 'okkko'], [1, 13, 'ooo']],
    medal: [[10, -3, '.m.'], [9, -2, 'mmm'], [10, -1, 'm.m'], [5, 8, 'r.r'], [5, 9, 'r.r'], [5, 10, 'mmm'], [4, 11, 'mmlmm'], [5, 12, 'mmm']],
  };
  const MONO = { b: '#D9D9D9', s: '#9A9A9A', o: '#6B6B6B' };
  function spriteSvg(kind) {
    const rows = SPR[kind] || POLLY, px = [];
    const pal = kind === 'ink' ? { ...COL, ...MONO } : COL;
    rows.forEach((r, y) => [...r].forEach((ch, x) => pal[ch] && px.push([x, y + 3, pal[ch]])));
    (EXTRA_PIX[kind] || []).forEach(([x0, y0, s]) => [...s].forEach((ch, i) => COL[ch] && px.push([x0 + i, y0 + 3, COL[ch]])));
    // шлем астронавта: стеклянное кольцо вокруг головы
    if (kind === 'astro') for (let y = -3; y < 9; y++) for (let x = 0; x < 14; x++) {
      const r = Math.hypot(x + .5 - 7.6, y + .5 - 3); if (r > 4.4 && r < 5.5) px.push([x, y + 3, '#BFE3FF']);
    }
    return `<svg viewBox="0 0 14 17" shape-rendering="crispEdges">${px.map(([x, y, c]) => `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${c}"/>`).join('')}</svg>`;
  }
  const howTo = lv => lv.h ? lv.h[L] : HOW_LEVEL[L](lv.d);
  // state: true — есть, false — нет, 'past' — был (чёрно-белый)
  const medal = (lv, on = true, big = false, tag = 'span', picks = me?.picks || 0) => {
    const fun = on === 'past' && lv.past ? lv.past[L] : lv.f[L];
    const cls = on === 'past' ? ' past' : on ? '' : ' off';
    const stars = lv.k === 'pick' && picks ? `<span class="sw-stars" aria-label="${Math.min(3, Math.floor(picks / 5))}/3">${[1, 2, 3].map(i => `<i class="${picks >= i * 5 ? 'on' : ''}">★</i>`).join('')}</span>` : '';
    const tip = lv.k === 'pick' && picks ? `${fun}&#10;${t('picked', picks)}` : esc(fun);
    return `<${tag}${tag === 'button' ? ' type="button"' : ''} class="sw-medal${cls}${big ? ' big' : ''}" style="--bg:${lv.bg}" aria-label="${esc(lv.n[L])}" data-tip="${esc(lv.n[L])}&#10;${tip}" data-badge="${esc(lv.k || lv.s)}">${lv.s ? spriteSvg(lv.s) : `<b>${lv.icon}</b>`}${stars}</${tag}>`;
  };
  const stateOf = (s, got) => s.k === 'pick' ? (got.has('pick') ? true : got.has('pick_past') ? 'past' : false) : got.has(s.k);
  const levelOf = best => [...LEVELS].reverse().find(l => best >= l.d) || null;
  function specials(posts) {
    const got = new Set(me?.keptBadges || []);
    for (const p of posts) {
      const d = new Date(p.day + 'T12:00:00');
      if (p.bw) got.add('bw');
      if (d.getMonth() === 0 && d.getDate() === 23) got.add('bday');
      if (window.ChallengeTheme && d.getDate() === window.ChallengeTheme.extraDay(d.getFullYear(), d.getMonth())) got.add('extra');
    }
    return got;
  }
  // тема хранится по-английски — показываем на языке страницы
  function themeLocal(en) {
    const row = (window.CHALLENGE_DATA?.subjects || []).find(r => r[0] === en);
    return row ? row[L] : en;
  }
  // загрузка за сегодня, вчера или позавчера
  let upOff = 0;
  const dayAgo = n => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - n); return d; };
  const keyOfD = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const fmtDay = k => new Date(k + 'T12:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  // ---------- состояние ----------
  let cfg = null, me = null;
  async function start() {
    try { cfg = await api('config'); } catch (e) { cfg = null; }
    if (!cfg || !cfg.ready) {
      app.innerHTML = `<div class="sw-card sw-soon">${spriteSvg('polly')}<div><p>${t('soon')}</p><a class="cta-btn" href="${L === 1 ? '/ru' : L === 2 ? '/lv' : ''}/challenge/">${t('toChallenge')}</a></div></div>`;
      document.querySelector('.sw-cols').hidden = true;
      return;
    }
    await refresh();
    loadTop(); loadWall();
  }
  async function refresh(prev) {
    try { me = (await api('me')).user; } catch (e) { me = null; }
    if (me && me.badgeEarned && me.badgeEarned.total && window.PPToast) window.PPToast(t('btnForBadges', me.badgeEarned.total));
    render(prev);
  }

  function render(prev) {
    const dz = document.getElementById('sw-danger'); if (dz) dz.innerHTML = '';
    renderQuick();
    if (!me) return renderSignIn();
    if (me.banned) { app.innerHTML = `<div class="sw-card"><p>${t('banned')}</p></div>`; return; }
    if (!me.nick) return renderNick();
    renderProfile(prev);
  }

  function renderSignIn() {
    app.innerHTML = `<div class="sw-card sw-signin"><span class="sw-signin-polly">${spriteSvg('polly')}</span><div>
      <h2>${t('signTitle')}</h2><p>${t('signText')}</p><div id="sw-gbtn" class="sw-gbtn"></div>
      ${cfg.dev ? `<button class="pill-btn" type="button" id="sw-dev">${t('devLogin')}</button>` : ''}
      <p class="sw-status" id="sw-status"></p></div></div>`;
    const dev = document.getElementById('sw-dev');
    dev && dev.addEventListener('click', () => login('dev:' + (prompt('nick?', 'tester') || 'tester')));
    googleButton(document.getElementById('sw-gbtn'), 'large');
  }
  // кнопка Google: одна инициализация, кнопок может быть несколько (внизу и в шапке страницы)
  let gsiInit = false;
  function googleButton(el, size, n = 0) {
    if (!el) return;
    if (!window.google?.accounts?.id) { if (n < 50) setTimeout(() => googleButton(el, size, n + 1), 200); return; }
    if (!gsiInit) { google.accounts.id.initialize({ client_id: cfg.clientId, callback: r => login(r.credential), ux_mode: 'popup' }); gsiInit = true; }
    google.accounts.id.renderButton(el, { theme: 'outline', size, shape: 'pill', text: size === 'large' ? 'continue_with' : 'signin_with', locale: ['en', 'ru', 'lv'][L] });
  }
  // шапка челленджа: «Войти» или плашка с ником, уровнем и серией
  function renderQuick() {
    const q = document.getElementById('sw-quick');
    if (!q) return;
    if (!cfg || !cfg.ready || (me && me.banned)) { q.innerHTML = ''; return; }
    if (!me) {
      q.innerHTML = '<span class="sw-quick-g"></span>' + (cfg.dev ? `<button class="pill-btn" type="button" id="sw-dev-top">${t('devLogin')}</button>` : '');
      googleButton(q.querySelector('.sw-quick-g'), 'medium');
      const d = document.getElementById('sw-dev-top');
      d && d.addEventListener('click', () => login('dev:' + (prompt('nick?', 'tester') || 'tester')));
      return;
    }
    const lv = levelOf(me.best || 0);
    q.innerHTML = `<a class="sw-chip" href="#works">${lv ? medal(lv) : ''}<span>${me.nick ? `<b class="sw-nickname${me.gold ? ' gold' : ''}">@${esc(me.nick)}</b> · 🔥 ${me.current || 0}` : t('nickTitle')}</span></a><button type="button" class="sw-link sw-out-top">${t('logout')}</button>`;
    q.querySelector('.sw-out-top').onclick = async () => { await post('logout'); me = null; render(); loadWall(true); };
  }
  async function login(credential) {
    const st = document.getElementById('sw-status');
    try {
      await post('login', { credential }); window.PPAccount && window.PPAccount.check(); await refresh(); loadTop(); loadWall(true);
      document.getElementById('works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    catch (e) { if (st) st.textContent = e.code === 'banned' ? t('banned') : t('err'); }
  }

  function renderNick() {
    app.innerHTML = `<form class="sw-card sw-nickform" id="sw-nick"><h2>${t('nickTitle')}</h2><p>${t('nickText')}</p>
      <div class="sw-row"><input name="nick" required maxlength="24" placeholder="@pigeonpolly" autocomplete="nickname"><button class="cta-btn" type="submit">${t('save')}</button></div>
      <p class="sw-status" id="sw-status"></p></form>`;
    document.getElementById('sw-nick').addEventListener('submit', async e => {
      e.preventDefault();
      const st = document.getElementById('sw-status');
      try { await post('nick', { nick: e.target.nick.value }); await refresh(); }
      catch (err) { st.textContent = err.code === 'taken' ? t('nickTaken') : err.code === 'nick' ? t('nickBad') : t('err'); }
    });
  }

  // ---------- подарки-семечки и сумка ----------
  const kindName = k => T.kinds[L][k] || k;
  const bagItems = () => { const seen = new Set(); return (me.gifts || []).filter(g => g.status === 'bag' && !seen.has(g.kind + g.item) && seen.add(g.kind + g.item)); };
  function modal(html) {
    const v = document.createElement('div'); v.className = 'sw-bv'; v.setAttribute('role', 'dialog');
    v.innerHTML = `<div class="sw-bv-card">${html}<button type="button" class="sw-bv-close" aria-label="Close">✕</button></div>`;
    const close = () => { v.remove(); document.removeEventListener('keydown', k); };
    const k = e => e.key === 'Escape' && close();
    v.addEventListener('click', e => { if (e.target === v || e.target.closest('.sw-bv-close')) close(); });
    document.addEventListener('keydown', k); document.body.appendChild(v);
    return { v, card: v.querySelector('.sw-bv-card'), close };
  }
  function openGift(g) {
    if (!g) return;
    const m = modal(`<div class="gf-card"><span class="gf-seed" aria-hidden="true">🌰</span><h3>${esc(t('seedOf', kindName(g.kind)))}</h3>
      ${noteHtml(g)}<div class="gf-btns"><button type="button" class="cta-btn" data-open>${t('open')}</button></div></div>`);
    m.card.classList.add('gf-card');
    m.card.querySelector('[data-open]').onclick = () => {
      const box = m.card.querySelector('.gf-card');
      box.innerHTML = `<h3>🎁 ${esc(kindName(g.kind))}</h3><div class="gf-ava"></div>${noteHtml(g)}
        <div class="gf-btns"><button type="button" class="cta-btn" data-use>${t('use')}</button><button type="button" class="pill-btn" data-later>${t('later')}</button></div>`;
      const a = window.PPBirds.avatar(me.id, Object.assign({}, me.avatar, { [g.kind]: g.item }), 140); a.classList.add('gf-pop');
      box.querySelector('.gf-ava').appendChild(a);
      const act = async use => { try { await post('gift', { id: g.id, use }); } catch (e) { alert(t('err')); return; } m.close(); await refresh(); };
      box.querySelector('[data-use]').onclick = () => act(true);
      box.querySelector('[data-later]').onclick = () => act(false);
    };
  }
  const noteHtml = g => !g.note || g.note === 'shop' ? '' : g.note.startsWith('from:') ? `<p class="gf-note">${esc(t('fromBird', g.note.slice(5)))}</p>` : `<p class="gf-note">«${esc(g.note)}» ${t('fromAlina')}</p>`;
  // подарить купленную вещь: ник птички (подсказки — из списка стаи)
  async function giveDialog(g, done) {
    const m = modal(''); m.card.classList.add('give-card');
    m.card.innerHTML = `<button type="button" class="sw-bv-close" aria-label="Close">✕</button><h3>${t('giveT')}</h3><div class="give-pic"></div><p class="sw-bv-how">${t('giveText')}</p>
      <form class="give-f"><input name="to" list="give-list" required maxlength="24" autocomplete="off" placeholder="${t('givePh')}"><datalist id="give-list"></datalist><button type="submit" class="cta-btn">${t('giveGo')}</button></form><p class="give-st" role="status"></p>`;
    m.card.querySelector('.give-pic').appendChild(window.PPBirds.giftPic(g.kind, g.item, me.id, 84));
    fetch('/api/birds').then(r => r.ok ? r.json() : { birds: [] }).then(x => { const dl = m.card.querySelector('#give-list'); if (dl) dl.innerHTML = (x.birds || []).filter(b => b.nick && b.id !== me.id).map(b => `<option value="${esc(b.nick)}">`).join(''); }).catch(() => {});
    const f = m.card.querySelector('.give-f'), st = m.card.querySelector('.give-st');
    f.onsubmit = async e => {
      e.preventDefault();
      try { const r = await post('gift/give', { id: g.id, to: f.to.value }); me.avatar = r.avatar; m.close && m.close(); m.card.closest('.sw-bv') && m.card.closest('.sw-bv').remove(); window.PPToast && window.PPToast(t('giveOk', r.to)); await refresh(); done && done(); }
      catch (err) { st.textContent = err.code === 'bird' ? t('giveNo') : err.code === 'has' ? t('giveHas') : t('err'); }
    };
  }
  function openBag() {
    const items = bagItems();
    const m = modal('');
    m.card.classList.add('bag-card');
    const draw = () => {
      const kinds = ['hat', 'item', 'shoes', 'scarf', 'bg', 'frame', 'anim'].filter(k => items.some(g => g.kind === k));
      m.card.innerHTML = `<button type="button" class="sw-bv-close" aria-label="Close">✕</button><h3>🎒 ${t('bagTitle')}</h3><p class="sw-bv-how">${t('bagNote')}</p>
        ${items.length ? kinds.map(k => `<h4>${esc(kindName(k))}</h4><div class="bag-grid">${items.filter(g => g.kind === k).map(g =>
          { const sh = (me.gifts || []).find(x => x.status === 'bag' && x.kind === g.kind && x.item === g.item && x.note === 'shop');
            return `<div class="bag-cell"><button type="button" class="bag-item${me.avatar && me.avatar[k] === g.item ? ' on' : ''}" data-k="${k}" data-i="${esc(g.item)}"><span class="bag-ava"></span>${me.avatar && me.avatar[k] === g.item ? t('wearing') : ''}</button>${sh ? `<button type="button" class="bag-give" data-gid="${sh.id}">${t('give')}</button>` : ''}</div>`; }).join('')}</div>`).join('') : `<p class="bag-empty">${t('bagEmpty')}</p>`}`;
      m.card.querySelectorAll('.bag-give').forEach(b => b.onclick = () => { const g = me.gifts.find(x => x.id === +b.dataset.gid); m.card.closest('.sw-bv') && m.card.closest('.sw-bv').remove(); giveDialog(g); });
      m.card.querySelectorAll('.bag-item').forEach(b => {
        b.querySelector('.bag-ava').appendChild(window.PPBirds.giftPic(b.dataset.k, b.dataset.i, me.id, 64, me.avatar));
        b.onclick = async () => {
          const on = me.avatar && me.avatar[b.dataset.k] === b.dataset.i;
          try { const r = await post('avatar', { kind: b.dataset.k, item: on ? null : b.dataset.i }); me.avatar = r.avatar; } catch (e) { alert(t('err')); return; }
          draw(); renderProfile(); window.PPAccount && window.PPAccount.check();
        };
      });
    };
    draw();
  }

  const badgeReward = x => { const R = me && me.btn && me.btn.rules; if (!R) return 0; return x.d ? (R.levels || {})[x.d] || 0 : x.k === 'pick' ? R.pick || 0 : (R.badges || {})[x.k] || 0; };
  // 🔘 пуговки: сколько есть и что можно получить сегодня (✅ — уже получено)
  function buttonsHtml(b) {
    const R = b.rules, pre = L === 1 ? '/ru' : L === 2 ? '/lv' : '';
    const row = (done, text) => `<li class="${done ? 'done' : ''}"><span>${done ? '✅' : '⬜'}</span> ${esc(text)}${done ? ` <em>${t('btnToday')}</em>` : ''}</li>`;
    return `<div class="sw-btns"><h3>${t('btnT')} <b>${b.buttons}</b></h3>
      <p class="sw-btns-how">${t('btnHow')}:</p><ul>
      ${row(b.daily, t('btnDaily', R.daily))}${row(b.upload, t('btnUpload', R.upload))}${row(b.comments >= R.commentsPerDay, t('btnComment', R.comment, b.comments, R.commentsPerDay))}
      <li class="sw-btns-friend"><span>👥</span> ${esc(t('btnFriend', R.friend, b.invited))}</li>
      <li><span>🏅</span> ${esc(t('btnBadges'))}</li>${R.pick ? `<li><span>⭐</span> ${esc(t('btnPick', R.pick))}</li>` : ''}</ul>
      <p class="sw-btns-acts"><a class="pill-btn" href="${pre}/shop/">${t('btnShop')}</a><button type="button" class="pill-btn" id="sw-invite">${t('btnInvite')}</button></p></div>`;
  }
  function renderProfile(prev) {
    const lv = levelOf(me.best), next = LEVELS.find(l => l.d > me.best);
    const upDate = dayAgo(upOff), upKey = keyOfD(upDate);
    const got = specials(me.posts), mine = me.posts.find(p => p.day === upKey);
    const th = window.ChallengeTheme ? window.ChallengeTheme.themeFor(upDate, L) : null;
    const dayBtns = [0, 1, 2].map(n => `<button type="button" data-off="${n}" aria-pressed="${n === upOff}">${t(['dToday', 'dYesterday', 'd2ago'][n])}${me.posts.some(p => p.day === keyOfD(dayAgo(n))) ? ' ✓' : ''}</button>`).join('');
    const base = (LEVELS.indexOf(next) > 0 ? LEVELS[LEVELS.indexOf(next) - 1].d : 0);
    const progress = next ? Math.round((me.best - base) / (next.d - base) * 100) : 100;
    const newGifts = (me.gifts || []).filter(g => g.status === 'new');
    app.innerHTML = `<div class="sw-grid">
      <div class="sw-card sw-profile">
        ${window.PPBirds && me.id ? '<span class="sw-ava-slot"></span>' : lv ? medal(lv, true, true) : `<span class="sw-medal big off" style="--bg:#F4F0FA">${spriteSvg('egg')}</span>`}
        <div class="sw-who"><h2><span class="sw-nickname${me.gold ? ' gold' : ''}">@${esc(me.nick)}</span></h2><p class="sw-level">${lv ? esc(lv.n[L]) : '—'}</p>
          <p class="sw-streak">🔥 ${t('streak', me.current)} · ${t('best', me.best)}</p>
          <div class="sw-bar"><i style="width:${progress}%"></i></div>
          <p class="sw-next">${next ? t('toNext', next.d - me.best, next.n[L]) : t('maxLevel')}</p></div>
        ${me.id ? `<div class="sw-gifts">${newGifts.length ? `<button type="button" class="pill-btn sw-gift-btn" id="sw-gift">🎁 ${t('giftNew', newGifts.length)}</button>` : ''}<button type="button" class="pill-btn" id="sw-bag">🎒 ${t('bag')} (${bagItems().length})</button><button type="button" class="pill-btn sw-share-btn" id="sw-share">📤 ${t('shareBird')}</button></div>` : ''}
        ${me.btn ? buttonsHtml(me.btn) : ''}
        <div class="sw-badges"><h3>${t('badges')}</h3><div>${LEVELS.map(l => medal(l, me.best >= l.d, false, 'button')).join('')}${SPECIAL.map(s => medal(s, stateOf(s, got), false, 'button')).join('')}</div><p class="sw-how" id="sw-how">${t('tapBadge')}</p></div>
        <p class="sw-acc"><button type="button" class="sw-link" id="sw-out">${t('logout')}</button> · <a class="sw-link" href="/api/export">${t('myData')}</a>${me.admin ? ` · <b>admin</b> · ${t('storage')}: ${me.storage ?? 0}%${me.migration && me.migration.total ? ` · R2: ${me.migration.r2 + me.migration.missing >= me.migration.total ? `✓ ${me.migration.r2}/${me.migration.total}` : `${me.migration.r2}/${me.migration.total}…`}` : ''}` : ''}</p>
      </div>
      <form class="sw-card sw-upload" id="sw-up">
        <div class="ch-level sw-days" role="group">${dayBtns}</div>
        <p class="sw-kicker">${upOff ? `${t('themeOf')} ${upDate.toLocaleDateString(locale, { day: 'numeric', month: 'long' })}` : t('today')}</p><h2>${th ? esc(th.subject) : ''}</h2>
        ${mine ? `<div class="sw-mine"><img src="/api/img/${mine.id}?t=1" alt=""><div><p>${t('posted')}</p><button type="button" class="sw-link danger" data-del="${mine.id}">${t('del')}</button></div></div>` : ''}
        <label class="pill-btn sw-file">${mine ? t('replace') : t('pick')}<input type="file" accept="image/*" name="file" hidden></label>
        <div class="sw-prev" hidden><img alt=""></div>
        ${me.consent ? '' : `<label class="sw-check"><input type="checkbox" name="consent" required> <span>${t('consent')} <a href="/privacy/">↗</a></span></label>`}
        <button class="cta-btn" type="submit" disabled>${t('upload')}</button>
        <p class="sw-status" id="sw-status"></p>
      </form></div>`;
    const slot = app.querySelector('.sw-ava-slot'); if (slot) slot.replaceWith(window.PPBirds.avatar(me.id, me.avatar, 120));
    const gb = document.getElementById('sw-gift'); if (gb) gb.onclick = () => openGift(newGifts[newGifts.length - 1]);
    const bb = document.getElementById('sw-bag'); if (bb) bb.onclick = openBag;
    const sb = document.getElementById('sw-share'); if (sb) sb.onclick = () => shareBird({ id: me.id, nick: me.nick, avatar: me.avatar, mine: true });
    const inv = document.getElementById('sw-invite'); if (inv) inv.onclick = () => shareBird({ id: me.id, nick: me.nick, avatar: me.avatar, mine: true });
    if (prev) celebrate(prev, lv, got);
    // по нажатию — бейдж крупно, с описанием
    app.querySelectorAll('.sw-badges .sw-medal').forEach(b => b.onclick = () => {
      const x = [...LEVELS, ...SPECIAL].find(v => (v.k || v.s) === b.dataset.badge);
      const state = b.classList.contains('past') ? 'past' : !b.classList.contains('off');
      const fun = state === 'past' && x.past ? x.past[L] : x.f[L];
      const v = document.createElement('div');
      v.className = 'sw-bv'; v.setAttribute('role', 'dialog');
      v.innerHTML = `<div class="sw-bv-card"><button type="button" class="sw-bv-close" aria-label="Close">✕</button>${medal(x, state)}
        <h3>${esc(x.n[L])}</h3><p class="sw-bv-fun">${esc(fun)}</p><p class="sw-bv-how">${esc(howTo(x))}${x.k === 'pick' && me.picks ? `<br>${esc(t('picked', me.picks))}` : ''}</p>
        ${badgeReward(x) ? `<p class="sw-bv-btn">${esc(t('btnBadge', badgeReward(x)))}</p>` : ''}<span class="sw-bv-state${state === true ? ' ok' : ''}">${state === true ? t('have') : state === 'past' ? t('hadIt') : t('notYet')}</span></div>`;
      const close = () => { v.remove(); document.removeEventListener('keydown', esc1); };
      const esc1 = e => e.key === 'Escape' && close();
      v.addEventListener('click', e => { if (e.target === v || e.target.closest('.sw-bv-close')) close(); });
      document.addEventListener('keydown', esc1);
      document.body.appendChild(v); v.querySelector('.sw-bv-close').focus();
    });
    document.getElementById('sw-out').onclick = async () => { await post('logout'); me = null; render(); loadWall(true); };
    // «Удалить аккаунт» — в самом низу страницы, подальше от «Выйти»
    document.getElementById('sw-danger').innerHTML = `<button type="button" class="sw-link danger" id="sw-delacc">${t('delAcc')}</button>`;
    document.getElementById('sw-delacc').onclick = async () => {
      if (!confirm(t('delAccAsk'))) return;
      try { await post('delete-account'); me = null; render(); loadTop(); loadWall(true); } catch (e) { alert(t('err')); }
    };
    app.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      if (!confirm(t('delAsk'))) return;
      try { await post('delete-post', { id: b.dataset.del }); await refresh(); loadTop(); loadWall(true); } catch (e) { alert(t('err')); }
    });
    app.querySelectorAll('.sw-days [data-off]').forEach(b => b.onclick = () => { upOff = +b.dataset.off; renderProfile(); });
    setupUpload(th, upDate, upKey);
  }

  // ---------- загрузка ----------
  async function shrink(file, max, q) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    return new Promise(r => c.toBlob(r, 'image/jpeg', q));
  }
  function setupUpload(th, upDate, upKey) {
    const form = document.getElementById('sw-up'), input = form.file, btn = form.querySelector('button[type="submit"]');
    const prev = form.querySelector('.sw-prev'), st = document.getElementById('sw-status');
    let full = null, thumb = null;
    input.addEventListener('change', async () => {
      st.textContent = ''; full = thumb = null; btn.disabled = true; prev.hidden = true;
      const f = input.files[0]; if (!f) return;
      try {
        if (!/^image\//.test(f.type)) throw 0;
        full = await shrink(f, 1000, 0.76); thumb = await shrink(f, 400, 0.72);
        if (!full || full.size > 2.4e6) throw 0;
        prev.querySelector('img').src = URL.createObjectURL(thumb); prev.hidden = false; btn.disabled = false;
      } catch (e) { st.textContent = t('big'); }
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!full) return;
      btn.disabled = true; st.textContent = t('uploading');
      const fd = new FormData();
      fd.append('image', new File([full], 'sketch.jpg', { type: 'image/jpeg' }));
      fd.append('thumb', new File([thumb], 'thumb.jpg', { type: 'image/jpeg' }));
      fd.append('day', upKey);
      // время суток — только для сегодняшней работы (для бейджа «Как по часам»)
      if (upKey === todayKey()) { const nowD = new Date(); fd.append('tod', String(nowD.getHours() * 60 + nowD.getMinutes())); }
      fd.append('theme', th ? window.ChallengeTheme.themeFor(upDate, 0).subject : '');
      let bw = false; try { bw = localStorage.getItem('ch-bw') === '1'; } catch (err) { /* без памяти */ }
      fd.append('bw', bw ? '1' : '0');
      if (form.consent) fd.append('consent', form.consent.checked ? 'yes' : '');
      try {
        const up = await api('upload', { method: 'POST', body: fd });
        if (up.earned && window.PPToast) window.PPToast(t('btnEarned', up.earned));
        const before = { best: me.best, got: specials(me.posts) };
        await refresh(before); loadTop(); loadWall(true);
      } catch (err) { st.textContent = err.code === 'big' || err.code === 'file' ? t('big') : t('err'); btn.disabled = false; }
    });
  }

  // праздник: новый уровень или бейдж
  function celebrate(prev, lv, got) {
    const oldLv = levelOf(prev.best);
    const newSpecial = SPECIAL.find(s => got.has(s.k) && !prev.got.has(s.k) && s.k !== 'pick');
    let html = '';
    if (lv && lv !== oldLv) html = `${medal(lv, true, true)}<b>${t('levelUp')}</b><span>${esc(lv.n[L])}</span>`;
    else if (newSpecial) html = `${medal(newSpecial, true, true)}<b>${t('newBadge')}</b><span>${esc(newSpecial.n[L])}</span>`;
    if (!html) return;
    const pop = document.createElement('div');
    pop.className = 'sw-pop'; pop.innerHTML = html + [...Array(16)].map((_, i) => `<i style="--a:${i * 22.5}deg;--c:${['#F0A987', '#E9A93B', '#7F81BF', '#D85A30'][i % 4]}"></i>`).join('');
    document.body.appendChild(pop);
    pop.addEventListener('click', () => pop.remove());
    setTimeout(() => pop.classList.add('out'), 3200);
    setTimeout(() => pop.remove(), 3800);
  }

  // ---------- публичный профиль ----------
  // карточка «Моя птичка в стае» (bird-card.js грузится, только когда нужна)
  function shareBird(o) {
    const go = () => window.PPBirdCard && window.PPBirdCard.open(o);
    if (window.PPBirdCard) return go();
    const s = document.createElement('script'); s.src = '/assets/bird-card.js'; s.onload = go; document.head.appendChild(s);
  }
  async function openProfile(nick) {
    let pr;
    try { pr = await api('profile?nick=' + encodeURIComponent(nick)); } catch (e) { return; }
    const got = new Set(pr.badges), lv = levelOf(pr.best);
    const st = s => s.k === 'pick' ? (got.has('pick') ? true : got.has('pick_past') ? 'past' : false) : got.has(s.k);
    const v = document.createElement('div');
    v.className = 'sw-bv sw-pv'; v.setAttribute('role', 'dialog');
    v.innerHTML = `<div class="sw-bv-card sw-pv-card"><button type="button" class="sw-bv-close" aria-label="Close">✕</button>
      <div class="sw-pv-head">${window.PPBirds && pr.id ? '<span class="sw-ava-slot"></span>' : lv ? medal(lv, true, true) : `<span class="sw-medal big off" style="--bg:#F4F0FA">${spriteSvg('egg')}</span>`}
        <div><h3><span class="sw-nickname${pr.gold ? ' gold' : ''}">@${esc(pr.nick)}</span></h3><p class="sw-level">${lv ? esc(lv.n[L]) : '—'}</p>
        <p class="sw-pv-streak">🔥 ${t('streak', pr.current)} · ${t('best', pr.best)}${pr.buttons != null ? ` · ${t('btnOther', pr.buttons)}` : ''}</p>${window.PPBirds && pr.id ? `<button type="button" class="pill-btn sw-pv-share">📤 ${t('shareThis')}</button>` : ''}</div></div>
      <div class="sw-pv-badges">${LEVELS.map(l => medal(l, pr.best >= l.d)).join('')}${SPECIAL.map(x => medal(x, st(x), false, 'span', pr.picks)).join('')}</div>
      ${window.PPBirds && pr.id ? `<h4 class="sw-pv-bag-t">🎒 ${t('bag')}</h4><div class="sw-pv-bag">${'<span class="sw-pv-item sw-pv-wrap" title="🎁">🎁</span>'.repeat(Math.min(pr.unopened || 0, 12))}</div>${!(pr.bag || []).length && !pr.unopened ? `<p class="sw-pv-empty">${t('bagEmptyOther')}</p>` : ''}` : ''}
      <div class="sw-pv-works">${pr.posts.map(p => `<a href="/api/img/${p.id}" data-lightbox><img src="/api/img/${p.id}?t=1" alt="${esc(themeLocal(p.theme))}" loading="lazy"><span>${esc(themeLocal(p.theme))} · ${fmtDay(p.day)}</span></a>`).join('') || `<p class="sw-empty">${t('noWorks')}</p>`}</div>
    </div>`;
    if (window.PPBirds && pr.id) {
      v.querySelector('.sw-pv-share').onclick = () => shareBird({ id: pr.id, nick: pr.nick, avatar: pr.avatar, mine: !!(me && me.id === pr.id) });
      const slot = v.querySelector('.sw-ava-slot'); if (slot) slot.replaceWith(window.PPBirds.avatar(pr.id, pr.avatar, 110));
      const bagEl = v.querySelector('.sw-pv-bag');
      if (bagEl) for (const g of pr.bag || []) { const it = document.createElement('span'); it.className = 'sw-pv-item' + (pr.avatar && pr.avatar[g.kind] === g.item ? ' on' : ''); it.title = kindName(g.kind); it.appendChild(window.PPBirds.giftPic(g.kind, g.item, pr.id, 52, pr.avatar)); bagEl.appendChild(it); }
    }
    // Esc: если открыта картинка — закрывается только она (слушаем раньше просмотрщика, в фазе перехвата)
    const close = () => { v.remove(); document.removeEventListener('keydown', k, true); };
    const k = e => e.key === 'Escape' && !document.querySelector('.lightbox.open') && close();
    v.addEventListener('click', e => { if (e.target === v || e.target.closest('.sw-bv-close')) close(); });
    document.addEventListener('keydown', k, true);
    document.body.appendChild(v); v.querySelector('.sw-bv-close').focus();
  }
  // ссылка вида /challenge/#@ник (например, из комментариев блога) сразу открывает профиль
  if (location.hash.startsWith('#@')) setTimeout(() => openProfile(decodeURIComponent(location.hash.slice(2))), 400);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-profile]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    openProfile(b.dataset.profile);
  });

  // ---------- топ и стена ----------
  // парад над заголовком: впереди — «Выбор Полли» в короне, за ним — ники из топа
  function parade(top, pick, pickGold) {
    const el = document.getElementById('parade');
    if (!el) return;
    const birds = [];
    if (pick) birds.push({ nick: pick, crown: true, gold: pickGold });
    top.filter(r => r.nick !== pick).slice(0, 8).forEach(r => birds.push({ nick: r.nick, fire: r.current, gold: r.gold }));
    if (!birds.length) { el.innerHTML = ''; el.classList.remove('on'); return; }
    const key = JSON.stringify(birds);
    if (el.dataset.key === key) return; // те же птицы — не перезапускаем шествие
    el.dataset.key = key;
    const pickName = SPECIAL.find(x => x.k === 'pick').n[L];
    // идут слева направо, поэтому первый (лидер) — последний в ряду, самый правый
    el.innerHTML = `<div class="parade-track">${birds.slice().reverse().map((b, i) => `<span class="pb${b.crown ? ' crown' : ''}" style="--d:${(i % 3) * .17}s">
      <span class="pb-tag${b.gold ? ' gold' : ''}" data-profile="${esc(b.nick)}">${b.crown ? `★ ${esc(pickName)} · ` : ''}@${esc(b.nick)}${b.fire ? ` 🔥${b.fire}` : ''}</span>
      <span class="pb-bird">${spriteSvg(b.crown ? 'crown' : 'polly')}</span></span>`).join('')}</div>`;
    el.classList.add('on');
    const track = el.firstElementChild;
    // скорость ~45 px/с независимо от ширины экрана
    const dist = innerWidth + track.scrollWidth;
    track.style.setProperty('--w', track.scrollWidth + 'px');
    track.style.animationDuration = Math.round(dist / 45) + 's';
  }

  async function loadTop() {
    const el = document.getElementById('sw-top');
    try {
      const { top, pick, pickGold } = await api('top');
      parade(top, pick, pickGold);
      el.innerHTML = top.length ? top.map((r, i) => {
        const lv = levelOf(r.best);
        return `<li><span class="sw-pos">${i + 1}</span>${lv ? medal(lv) : ''}<span class="sw-topnick"><button type="button" class="sw-nickname sw-plink${r.gold ? ' gold' : ''}" data-profile="${esc(r.nick)}">@${esc(r.nick)}</button></span><span class="sw-fire">🔥 ${r.current}</span></li>`;
      }).join('') : `<li class="sw-empty">${t('emptyTop')}</li>`;
    } catch (e) { el.innerHTML = ''; }
  }
  // работы участников — страницами по 24, первыми самые новые
  let pageCursors = [null], pageIdx = 0;
  async function loadWall(reset) {
    const el = document.getElementById('sw-wall'), more = document.getElementById('sw-more'), newer = document.getElementById('sw-newer'), pg = document.getElementById('sw-page');
    if (reset) { pageCursors = [null]; pageIdx = 0; }
    const cursor = pageCursors[pageIdx];
    try {
      const { posts, pick } = await api('wall' + (cursor ? `?before=${cursor}` : ''));
      el.innerHTML = posts.length ? posts.map(p => `<figure class="sw-tile${p.bw ? ' bw' : ''}${p.id === pick ? ' pick' : ''}" data-id="${p.id}">
        ${p.id === pick ? `<span class="sw-stamp">★ ${esc(SPECIAL.find(x => x.k === 'pick').n[L])}</span>` : ''}
        <a href="/api/img/${p.id}" data-lightbox><img src="/api/img/${p.id}?t=1" alt="${esc(themeLocal(p.theme))}" loading="lazy"></a>
        <figcaption><button type="button" class="sw-nickname sw-plink${p.gold ? ' gold' : ''}" data-profile="${esc(p.nick)}">@${esc(p.nick)}</button> <span>${esc(themeLocal(p.theme))} · ${fmtDay(p.day)}</span></figcaption>
        ${me && me.admin ? `<div class="sw-mod">${p.id === pick ? `<button type="button" data-unpick="1">☆ ${t('unpick')}</button>` : `<button type="button" data-pick="${p.id}" title="${esc(SPECIAL.find(x => x.k === 'pick').n[L])}">★</button>`}<button type="button" data-hide="${p.id}">${t('hide')}</button><button type="button" data-ban="${p.uid}">${t('ban')}</button></div>` : ''}
      </figure>`).join('') : `<p class="sw-empty">${t('emptyWall')}</p>`;
      if (posts.length) pageCursors[pageIdx + 1] = posts[posts.length - 1].created_at;
      if (more) more.hidden = posts.length < 24;
      if (newer) newer.hidden = pageIdx === 0;
      if (pg) pg.textContent = more && more.hidden && !pageIdx ? '' : t('pageN', pageIdx + 1);
    } catch (e) { if (more) more.hidden = true; }
  }
  const toPage = d => { pageIdx = Math.max(0, pageIdx + d); loadWall().then(() => document.getElementById('sw-wall')?.closest('.sw-wall-box')?.scrollIntoView({ behavior: 'smooth', block: 'start' })); };
  document.getElementById('sw-more')?.addEventListener('click', () => toPage(1));
  document.getElementById('sw-newer')?.addEventListener('click', () => toPage(-1));
  document.getElementById('sw-wall')?.addEventListener('click', async e => {
    const h = e.target.closest('[data-hide]'), b = e.target.closest('[data-ban]'), pk = e.target.closest('[data-pick]');
    try {
      if (pk) { await post('admin/pick', { id: pk.dataset.pick }); loadWall(true); refresh(); }
      if (e.target.closest('[data-unpick]')) { await post('admin/pick', { undo: true }); loadWall(true); refresh(); }
      if (h) { await post('admin/hide', { id: h.dataset.hide }); h.closest('.sw-tile').remove(); }
      if (b && confirm(t('banAsk'))) { await post('admin/ban', { uid: b.dataset.ban }); loadWall(true); loadTop(); }
    } catch (err) { alert(t('err')); }
  });

  window.PPProfile = openProfile;
  if (!profileOnly) start();
})();
