// Пиксельные комнаты (Fantasy World): кабинет Полли и кабинет детектива Титоса.
// Фон день/вечер — tools/rooms/*.py, зоны для клика — window.ROOMS (rooms-data.js). Реплики предметов — ниже, на трёх языках.
(() => {
  const box = document.getElementById('rm'); if (!box || !window.ROOMS) return;
  const room = box.dataset.room, R = window.ROOMS[room];
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => new Date().toLocaleTimeString(['en-GB', 'ru-RU', 'lv-LV'][L], { hour: '2-digit', minute: '2-digit' });
  const T = {
    office: {
      blinds: [['Original blinds. Nobody knows how to open them evenly. Nobody has tried since 1998.', 'One slat is bent. Someone peeked at the parking lot very dramatically.'],
               ['Жалюзи «с историей». Ровно их открыть не умеет никто. С 1998 года никто и не пробовал.', 'Одна планка погнута. Кто-то очень драматично смотрел на парковку.'],
               ['Vēsturiskas žalūzijas. Vienmērīgi tās atvērt neprot neviens. Kopš 1998. gada neviens arī nav mēģinājis.', 'Viena lamele ir saliekta. Kāds ļoti dramatiski skatījās uz stāvvietu.']],
      cooler: [['Glug… glug. The water cooler: where all office news begins.', 'Polly drinks eight cups a day. Mostly to hear the gossip.'],
               ['Буль… буль. Кулер — место, где рождаются все офисные новости.', 'Полли выпивает восемь стаканчиков в день. В основном ради сплетен.'],
               ['Burbulis… burbulis. Dzesētājs — vieta, kur dzimst visas biroja ziņas.', 'Pollija izdzer astoņas glāzītes dienā. Galvenokārt baumu dēļ.']],
      clock: [['It’s {t}. Too early to go home, too late to start something new.'], ['Сейчас {t}. Домой рано, начинать что-то новое поздно.'], ['Pulkstens ir {t}. Uz mājām par agru, sākt kaut ko jaunu par vēlu.']],
      calendar: [['A red circle on one day. Nobody remembers what it means, but everyone is nervous.'], ['Один день обведён красным. Никто не помнит, что это значит, но все волнуются.'], ['Viena diena apvilkta sarkanā. Neviens neatceras, ko tas nozīmē, bet visi uztraucas.']],
      poster: [['TEAMWORK. Three birds flying into a sunset. Inspiring, apparently.'], ['ТИМВОРК. Три птицы летят в закат. Говорят, вдохновляет.'], ['KOMANDAS DARBS. Trīs putni lido saulrietā. Esot iedvesmojoši.']],
      board: [['Sticky notes: “Buy coffee”, “Buy MORE coffee”, “Who took my stapler??”'], ['Стикеры: «Купить кофе», «Купить ЕЩЁ кофе», «Кто взял мой степлер??»'], ['Līmlapiņas: “Nopirkt kafiju”, “Nopirkt VĒL kafiju”, “Kurš paņēma manu skavotāju??”']],
      cabinet: [['Four drawers of very important papers. The fifth drawer is snacks.'], ['Четыре ящика очень важных бумаг. Пятый ящик — перекусы.'], ['Četras atvilktnes ar ļoti svarīgiem papīriem. Piektā atvilktne ir uzkodām.']],
      plant: [['The office plant. It has survived three managers and one very bad winter.'], ['Офисный цветок. Пережил трёх начальников и одну очень плохую зиму.'], ['Biroja puķe. Pārdzīvojusi trīs priekšniekus un vienu ļoti sliktu ziemu.']],
      desk: [['Polly’s desk. Organised chaos, emphasis on chaos.'], ['Стол Полли. Организованный хаос, с ударением на «хаос».'], ['Pollijas galds. Organizēts haoss, ar uzsvaru uz haoss.']],
      monitor: [['A spreadsheet with 4,000 rows. Polly is on row 12.', 'The screensaver is a flying toaster. Classic.'], ['Таблица на 4000 строк. Полли на 12-й.', 'Заставка — летающий тостер. Классика.'], ['Tabula ar 4000 rindām. Pollija ir 12. rindā.', 'Ekrānsaudzētājs — lidojošs tosteris. Klasika.']],
      mug: [['“World’s Best Pigeon”. She bought it herself.'], ['«Лучший голубь в мире». Купила себе сама.'], ['“Pasaules labākais balodis”. Nopirka pati sev.']],
      jello: [['A stapler in jelly. Again. Polly has suspects.'], ['Степлер в желе. Опять. У Полли есть подозреваемые.'], ['Skavotājs želejā. Atkal. Pollijai ir aizdomās turamie.']],
      nameplate: [['POLLY. Office Clerk. Pigeon. In that order.'], ['ПОЛЛИ. Офисный клерк. Голубь. Именно в таком порядке.'], ['POLLIJA. Biroja klerke. Balodis. Tieši šādā secībā.']],
      trash: [['Mostly crumpled drafts and one sad sandwich.'], ['В основном скомканные черновики и один грустный бутерброд.'], ['Galvenokārt saburzīti melnraksti un viena skumja sviestmaize.']],

      radiator: [['The radiator. Either off or volcano. No in-between.'], ['Батарея. Либо выключена, либо вулкан. Без середины.'], ['Radiators. Vai nu izslēgts, vai vulkāns. Nekā pa vidu.']],
      cord: [['The blinds cord. Pull it and the blinds go up on one side only. Every time.'], ['Шнурок от жалюзи. Потянешь — поднимется только одна сторона. Всегда.'], ['Žalūziju aukla. Pavelc — pacelsies tikai viena puse. Vienmēr.']],
      diploma: [['Diploma: Advanced Crumb Management.', 'Certificate: Spreadsheet Whisperer, level 2.'], ['Диплом: Продвинутое управление крошками.', 'Сертификат: Заклинатель таблиц, 2-й уровень.'], ['Diploms: Padziļināta drupaču pārvaldība.', 'Sertifikāts: Tabulu čukstētāja, 2. līmenis.']],
      eom: [['Employee of the Month: Polly. The month was February. Short month, still counts.'], ['Сотрудник месяца: Полли. Месяц был февраль. Короткий, но считается.'], ['Mēneša darbiniece: Pollija. Mēnesis bija februāris. Īss, bet skaitās.']],
      alarm: [['Don’t press it. Last time the whole office went outside for an hour and loved it.'], ['Не нажимать. В прошлый раз весь офис час стоял на улице, и всем понравилось.'], ['Nespied. Pagājušoreiz viss birojs stundu stāvēja ārā, un visiem patika.']],
      switch: [['Click. Lights off, evening on.'], ['Щёлк. Свет выключен, вечер включён.'], ['Klikšķ. Gaisma izslēgta, vakars ieslēgts.']],
      vent: [['The air vent hums in B flat. Polly hums along.'], ['Вентиляция гудит в си-бемоль. Полли подпевает.'], ['Ventilācija dūc si-bemolā. Pollija dzied līdzi.']],
      binder: [['Binder: “Receipts 2019–2021”.', 'Binder: “Meeting notes about meetings”.', 'Binder: “Important (not important)”.', 'Binder: “Coffee budget”. It is the thickest one.', 'Binder: “DO NOT OPEN”. Polly opened it. Recipes.'],
               ['Папка: «Чеки 2019–2021».', 'Папка: «Протоколы совещаний о совещаниях».', 'Папка: «Важное (неважное)».', 'Папка: «Бюджет на кофе». Самая толстая.', 'Папка: «НЕ ОТКРЫВАТЬ». Полли открыла. Там рецепты.'],
               ['Mape: “Čeki 2019–2021”.', 'Mape: “Sapulču protokoli par sapulcēm”.', 'Mape: “Svarīgi (nesvarīgi)”.', 'Mape: “Kafijas budžets”. Visbiezākā.', 'Mape: “NEATVĒRT”. Pollija atvēra. Tur ir receptes.']],
      trophy: [['A golden trophy: “Best Coo at the office party”.'], ['Золотой кубок: «Лучшее курлыканье на корпоративе».'], ['Zelta kauss: “Labākais kūkojiens ballītē”.']],
      shelfbox: [['A box of spare staplers. Hidden from the jelly prankster.'], ['Коробка запасных степлеров. Спрятана от шутника с желе.'], ['Kaste ar rezerves skavotājiem. Paslēpta no želejas jokdara.']],
      drawer: [['Top drawer: invoices.', 'Second drawer: more invoices.', 'Third drawer: forms for requesting new forms.', 'Bottom drawer: snacks. The real treasure.'],
               ['Верхний ящик: счета.', 'Второй ящик: ещё счета.', 'Третий ящик: бланки для заказа новых бланков.', 'Нижний ящик: перекусы. Настоящее сокровище.'],
               ['Augšējā atvilktne: rēķini.', 'Otrā atvilktne: vēl rēķini.', 'Trešā atvilktne: veidlapas jaunu veidlapu pieprasīšanai.', 'Apakšējā atvilktne: uzkodas. Īstais dārgums.']],
      cups: [['Paper cups. Polly uses one per piece of gossip.'], ['Бумажные стаканчики. Полли берёт по одному на каждую сплетню.'], ['Papīra glāzītes. Pollija ņem vienu katrai baumai.']],
      keyboard: [['The S key sticks. Polly types “Sorry” a lot.'], ['Клавиша S залипает. Полли часто пишет «Sorry».'], ['S taustiņš iesprūst. Pollija bieži raksta “Sorry”.']],
      mnote: [['Sticky note: “Reply to emails!!”', 'Sticky note: “Lunch at 12 (11:45)”.', 'Sticky note: “Password: ********”. Very secure.'],
              ['Стикер: «Ответить на письма!!»', 'Стикер: «Обед в 12 (в 11:45)».', 'Стикер: «Пароль: ********». Очень надёжно.'],
              ['Līmlapiņa: “Atbildēt uz vēstulēm!!”', 'Līmlapiņa: “Pusdienas 12 (11:45)”.', 'Līmlapiņa: “Parole: ********”. Ļoti droši.']],
      note: [['“Buy coffee.”', '“Buy MORE coffee.”', '“Who took my stapler??”', '“Meeting at 3. (It was moved.) (Again.)”', '“Call Mom back.”', '“Smile! It’s almost Friday.”'],
             ['«Купить кофе».', '«Купить ЕЩЁ кофе».', '«Кто взял мой степлер??»', '«Совещание в 3. (Перенесли.) (Опять.)»', '«Перезвонить маме».', '«Улыбнись! Почти пятница».'],
             ['“Nopirkt kafiju.”', '“Nopirkt VĒL kafiju.”', '“Kurš paņēma manu skavotāju??”', '“Sapulce 3:00. (Pārcelta.) (Atkal.)”', '“Atzvanīt mammai.”', '“Smaidi! Gandrīz piektdiena.”']],
      box: [['A box of Polly’s things: a cactus, papers and a mug she will never give back.'], ['Коробка с вещами Полли: кактус, бумаги и кружка, которую она никогда не вернёт.'], ['Kaste ar Pollijas mantām: kaktuss, papīri un krūze, ko viņa nekad neatdos.']],
      boxcactus: [['The cactus from home. It doesn’t need water. It needs respect.'], ['Домашний кактус. Ему не нужна вода. Ему нужно уважение.'], ['Kaktuss no mājām. Tam nevajag ūdeni. Tam vajag cieņu.']],
      cactus: [['Desk cactus. Low maintenance, high attitude.'], ['Настольный кактус. Ухода мало, характера много.'], ['Galda kaktuss. Maz kopšanas, daudz rakstura.']],
      papers: [['The “urgent” pile. It is the tallest pile.'], ['Стопка «срочно». Самая высокая стопка.'], ['Kaudze “steidzami”. Visaugstākā kaudze.']],
      neighbour: [['The neighbour’s desk. He is “working from home” today.'], ['Стол соседа. Он сегодня «работает из дома».'], ['Kaimiņa galds. Viņš šodien “strādā no mājām”.']],
      nstapler: [['The neighbour’s stapler. Not in jelly. Yet.'], ['Степлер соседа. Не в желе. Пока.'], ['Kaimiņa skavotājs. Nav želejā. Pagaidām.']],
      ncup: [['Someone’s cold tea from Tuesday.'], ['Чей-то остывший чай со вторника.'], ['Kāda atdzisusi tēja no otrdienas.']],
      npapers: [['Reports nobody will read. Beautifully stapled.'], ['Отчёты, которые никто не прочтёт. Красиво скреплены.'], ['Atskaites, ko neviens neizlasīs. Skaisti saskavotas.']],
      lights: [['Click — and the day is over.'], ['Щёлк — и рабочий день закончился.'], ['Klikšķ — un darba diena ir beigusies.']],
      copier: [['The copier is warming up. It has been warming up since Monday.', 'Paper jam in tray 2. There is no tray 2.'], ['Копир прогревается. С понедельника.', 'Замятие бумаги в лотке 2. Лотка 2 нет.'], ['Kopētājs uzsilst. Kopš pirmdienas.', 'Papīrs iesprūdis 2. paplātē. 2. paplātes nav.']],
      phone: [['Ring ring! “Polly speaking. No, we don’t sell bread crumbs.”'], ['Дзынь-дзынь! «Полли слушает. Нет, хлебными крошками мы не торгуем».'], ['Zvan-zvan! “Pollija klausās. Nē, maizes drupačas mēs nepārdodam.”']],
      polly: [['Hi! I’m on my coffee break. I’ve been on it since nine.', 'Coo. If anyone asks, I’m in a meeting.', 'Have you met the water cooler? Great listener.'],
              ['Привет! У меня перерыв на кофе. С девяти утра.', 'Курлык. Если что, я на совещании.', 'Вы знакомы с кулером? Отличный слушатель.'],
              ['Sveiks! Man ir kafijas pauze. Kopš deviņiem.', 'Kū. Ja kāds jautā, esmu sapulcē.', 'Vai esi iepazinies ar dzesētāju? Lielisks klausītājs.']],
    },
    detective: {
      blinds: [['Through the blinds the city looks like a case file. Striped and full of secrets.'], ['Сквозь жалюзи город похож на папку с делом. Полосатый и полный тайн.'], ['Caur žalūzijām pilsēta izskatās kā lietas mape. Svītraina un pilna noslēpumu.']],
      fan: [['The ceiling fan spins slowly. Like the investigation.'], ['Потолочный вентилятор крутится медленно. Как расследование.'], ['Griestu ventilators griežas lēni. Kā izmeklēšana.']],
      boxes: [['Cases from A to Z. The box marked 1999 is never to be opened.', 'Every box is a story. Most of them end with “and then the cat was found”.'],
              ['Дела от A до Z. Коробку с надписью 1999 не открывать никогда.', 'Каждая коробка — история. Большинство заканчиваются словами «и тут нашёлся кот».'],
              ['Lietas no A līdz Z. Kasti ar uzrakstu 1999 neatvērt nekad.', 'Katra kaste ir stāsts. Lielākā daļa beidzas ar “un tad atradās kaķis”.']],
      board: [['Red string connects everything. Titos is sure the baker did it. He is always sure.'], ['Красные нитки связывают всё. Титос уверен, что это пекарь. Он всегда уверен.'], ['Sarkani diegi savieno visu. Titoss ir pārliecināts, ka to izdarīja maiznieks. Viņš vienmēr ir pārliecināts.']],
      clock: [['{t}. Crime never sleeps. Titos sometimes does, at the desk.'], ['{t}. Преступность не дремлет. Титос иногда дремлет — прямо за столом.'], ['{t}. Noziedzība neguļ. Titoss dažreiz guļ — pie galda.']],
      coat: [['The coat and the hat. For when it rains, and for when it looks dramatic.'], ['Плащ и шляпа. На случай дождя и на случай драмы.'], ['Mētelis un cepure. Lietum un dramatiskiem brīžiem.']],
      cabinet: [['A drawer full of folders. Alphabetical. Mostly.'], ['Ящик, полный папок. По алфавиту. В основном.'], ['Atvilktne pilna ar mapēm. Alfabētiskā secībā. Pārsvarā.']],
      desk: [['The desk has three drawers. The third one sticks. It’s a clue.'], ['У стола три ящика. Третий заедает. Это улика.'], ['Galdam ir trīs atvilktnes. Trešā iesprūst. Tas ir pierādījums.']],
      lamp: [['Click. The late-night shift begins.'], ['Щёлк. Начинается ночная смена.'], ['Klikšķ. Sākas nakts maiņa.']],
      typewriter: [['Clack-clack-ding! Report No. 1,042: “The suspect is still a mystery.”'], ['Щёлк-щёлк-дзынь! Отчёт № 1042: «Подозреваемый по-прежнему загадка».'], ['Klak-klak-dzin! Ziņojums Nr. 1042: “Aizdomās turamais joprojām ir mīkla.”']],
      folders: [['The red folder is marked URGENT. It has been urgent for a long time.'], ['На красной папке надпись СРОЧНО. Срочно уже очень давно.'], ['Uz sarkanās mapes rakstīts STEIDZAMI. Steidzami jau ļoti sen.']],
      mug: [['Cold coffee. A detective’s best friend.'], ['Остывший кофе. Лучший друг детектива.'], ['Atdzisusi kafija. Detektīva labākais draugs.']],
      magnifier: [['Under the magnifying glass: a crumb. Suspicious.'], ['Под лупой: крошка. Подозрительно.'], ['Zem lupas: drupača. Aizdomīgi.']],
      floorboxes: [['More cases. The office ran out of shelves in spring.'], ['Ещё дела. Полки закончились ещё весной.'], ['Vēl lietas. Plaukti beidzās jau pavasarī.']],

      box: [['Case box {x}. Labelled, taped and full of mysteries.', 'Box {x}. Titos knows every case in it by heart.', 'Box {x}. Something inside rustles. Probably paper.'],
            ['Коробка с делами {x}. Подписана, заклеена и полна тайн.', 'Коробка {x}. Титос помнит каждое дело в ней наизусть.', 'Коробка {x}. Внутри что-то шуршит. Наверное, бумага.'],
            ['Lietu kaste {x}. Parakstīta, aizlīmēta un pilna noslēpumu.', 'Kaste {x}. Titoss katru lietu tajā zina no galvas.', 'Kaste {x}. Iekšā kaut kas čaukst. Laikam papīrs.']],
      photo: [['Suspect No. 1: the baker. Again.', 'A blurry photo of a seagull holding a pastry.', 'Mr. Chew at the post office. Alibi: too slow to be anywhere else.', 'The Pumpkin family porch. Suspiciously cosy.', 'A footprint. Or a croissant. Investigation ongoing.', 'The Department of Reflection on the Deed. Never again.'],
              ['Подозреваемый № 1: пекарь. Опять.', 'Размытое фото чайки с пирожком.', 'Мистер Чу на почте. Алиби: слишком медленный, чтобы быть где-то ещё.', 'Крыльцо семьи Тыквиных. Подозрительно уютно.', 'Отпечаток лапы. Или круассан. Следствие продолжается.', 'Департамент размышлений о содеянном. Больше никогда.'],
              ['Aizdomās turamais Nr. 1: maiznieks. Atkal.', 'Izplūdusi kaijas foto ar pīrādziņu.', 'Misters Čū pastā. Alibi: pārāk lēns, lai būtu kur citur.', 'Ķirbju ģimenes lievenis. Aizdomīgi mājīgs.', 'Pēdas nospiedums. Vai kruasāns. Izmeklēšana turpinās.', 'Pārdomu par izdarīto departaments. Nekad vairs.']],
      clue: [['The yellow note says: “Follow the crumbs.”'], ['На жёлтом стикере: «Иди по крошкам».'], ['Uz dzeltenās lapiņas: “Seko drupačām.”']],
      door: [['Frosted glass: TITOS, DETECTIVE. Some letters fell off. Nobody noticed.'], ['Матовое стекло: ТИТОС, ДЕТЕКТИВ. Пара букв отвалилась. Никто не заметил.'], ['Matēts stikls: TITOSS, DETEKTĪVS. Daži burti nokrita. Neviens nepamanīja.']],
      hat: [['The hat. Tilted for maximum mystery.'], ['Шляпа. Наклонена для максимальной таинственности.'], ['Cepure. Noliekta maksimālam noslēpumam.']],
      drawer: [['Top drawer: closed cases.', 'Middle drawer: open cases.', 'Bottom drawer: cases that are neither. Titos calls them “sleeping”.'],
               ['Верхний ящик: закрытые дела.', 'Средний ящик: открытые дела.', 'Нижний ящик: дела ни то ни сё. Титос называет их «спящими».'],
               ['Augšējā atvilktne: slēgtas lietas.', 'Vidējā atvilktne: atvērtas lietas.', 'Apakšējā atvilktne: lietas ne šādas, ne tādas. Titoss tās sauc par “guļošām”.']],
      folderdrawer: [['A drawer full of folders. Alphabetical. Mostly.'], ['Ящик, полный папок. По алфавиту. В основном.'], ['Atvilktne pilna ar mapēm. Alfabētiskā secībā. Pārsvarā.']],
      deskdrawer: [['Desk drawer one: spare magnifying glasses. Seven of them.', 'Desk drawer two sticks. It’s a clue.'], ['Первый ящик стола: запасные лупы. Семь штук.', 'Второй ящик стола заедает. Это улика.'], ['Pirmā galda atvilktne: rezerves lupas. Septiņas.', 'Otrā galda atvilktne iesprūst. Tas ir pierādījums.']],
      safe: [['The safe. Inside: the most important case file and one emergency cookie.'], ['Сейф. Внутри: самое важное дело и одно печенье на экстренный случай.'], ['Seifs. Iekšā: svarīgākā lieta un viens ārkārtas cepums.']],
      dial: [['Click… click… The combination is Titos’ birthday. Don’t tell anyone.'], ['Щёлк… щёлк… Код — день рождения Титоса. Никому не говорите.'], ['Klikšķ… klikšķ… Kods ir Titosa dzimšanas diena. Nevienam nesaki.']],
      parcel: [['A parcel tied with string. Delivered by Mr. Chew. It took a while.'], ['Посылка, перевязанная бечёвкой. Доставил Мистер Чу. Заняло время.'], ['Paciņa, apsieta ar auklu. Piegādāja Misters Čū. Tas prasīja laiku.']],
      recorder: [['Dictaphone: “Note to self: buy more coffee.”', 'Dictaphone: “Day 41. The baker still suspects nothing.”'], ['Диктофон: «Заметка: купить ещё кофе».', 'Диктофон: «День 41. Пекарь всё ещё ничего не подозревает».'], ['Diktofons: “Piezīme: nopirkt vēl kafiju.”', 'Diktofons: “41. diena. Maiznieks joprojām neko nenojauš.”']],
      bin: [['Crumpled theories. Very bad ones.'], ['Скомканные версии. Очень плохие.'], ['Saburzītas versijas. Ļoti sliktas.']],
      news: [['Newspapers: “Pastry thief strikes again!”'], ['Газеты: «Похититель пирожков снова в деле!»'], ['Avīzes: “Pīrādziņu zaglis atkal uzbrūk!”']],
      paper: [['Page 47 of a report. Pages 1–46 are missing.', 'A receipt for 31 coffees.', 'A map with an X. The X is the coffee shop.', 'A sketch of a suspect. It’s a seagull.'],
              ['Страница 47 отчёта. Страниц 1–46 нет.', 'Чек на 31 кофе.', 'Карта с крестиком. Крестик — это кофейня.', 'Набросок подозреваемого. Это чайка.'],
              ['Ziņojuma 47. lapa. 1.–46. lapas trūkst.', 'Čeks par 31 kafiju.', 'Karte ar krustiņu. Krustiņš ir kafejnīca.', 'Aizdomās turamā skice. Tā ir kaija.']],
      rug: [['Under the rug: more papers. Obviously.'], ['Под ковром: ещё бумаги. Разумеется.'], ['Zem paklāja: vēl papīri. Protams.']],
      titos: [['Detective Titos. Every clue counts. Even crumbs.', 'Evening. Seen anything suspicious? Anything at all?', 'Don’t touch the board. I have a system.'],
              ['Детектив Титос. Важна каждая улика. Даже крошки.', 'Добрый вечер. Ничего подозрительного не видели? Совсем ничего?', 'Доску не трогайте. У меня система.'],
              ['Detektīvs Titoss. Svarīga ir katra druska. Pat drupačas.', 'Labvakar. Neko aizdomīgu neesi redzējis? Pilnīgi neko?', 'Neaiztiec dēli. Man ir sistēma.']],
    },
  }[room];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const API = window.ROOM = { box, R, L, esc, pct: v => v + '%', hero: null, sayAt: null, setEvening: null, place: null, hook: null, coffee: { on: true } };
  const pct = v => v + '%';
  // спрайты
  const SP = {};
  Object.entries(R.sprites || {}).forEach(([k, [x, y, w]]) => {
    const im = document.createElement('img'); im.className = 'rm-sprite rm-' + k; im.alt = ''; im.draggable = false;
    im.src = `/images/rooms/${room}-${k}.png`;
    im.style.left = pct(x / R.w * 100); im.style.top = pct(y / R.h * 100); im.style.width = pct(w / R.w * 100);
    box.appendChild(im); SP[k] = im;
  });
  const who = box.dataset.who, hero = SP[who];
  if (hero) setInterval(() => { hero.src = `/images/rooms/${room}-${who}-blink.png`; setTimeout(() => hero.src = `/images/rooms/${room}-${who}.png`, 160); }, 3800);
  API.hero = hero;
  // вечер
  const btn = document.getElementById('rm-time');
  const setEvening = on => { box.classList.toggle('evening', on); btn.textContent = on ? btn.dataset.day : btn.dataset.ev; btn.setAttribute('aria-pressed', on); };
  const h = new Date().getHours(); setEvening(h >= 18 || h < 7);
  btn.addEventListener('click', () => setEvening(!box.classList.contains('evening')));
  API.setEvening = setEvening;
  // облачко
  const bub = document.createElement('div'); bub.className = 'rm-bub'; bub.setAttribute('role', 'status'); box.appendChild(bub);
  let bt;
  const IDX = new Set(['note', 'diploma', 'drawer', 'photo', 'mnote', 'deskdrawer', 'paper']);
  const line = k => {
    const [base, id] = k.split('#'), list = T[base][L];
    return (IDX.has(base) && id != null ? list[+id % list.length] : pick(list)).replace('{t}', now()).replace('{x}', id || '');
  };
  const say = (k, el) => {
    const txt = line(k);
    bub.innerHTML = `<span>${esc(txt)}</span>`;
    const [x, y, w] = R.hot[k];
    const cx = Math.min(80, Math.max(20, x + w / 2));
    const [, , , hh] = R.hot[k], below = y < 24;
    bub.classList.toggle('below', below);
    bub.style.left = cx + '%'; bub.style.top = (below ? Math.min(y + hh, 70) : y) + '%';
    bub.classList.remove('on'); void bub.offsetWidth; bub.classList.add('on');
    clearTimeout(bt); bt = setTimeout(() => bub.classList.remove('on'), 5200);
  };
  const sayAt = (txt, x, y, ms = 5200) => {
    bub.innerHTML = `<span>${esc(txt)}</span>`; bub.classList.toggle('below', y < 24);
    bub.style.left = Math.min(80, Math.max(20, x)) + '%'; bub.style.top = y + '%';
    bub.classList.remove('on'); void bub.offsetWidth; bub.classList.add('on'); clearTimeout(bt); bt = setTimeout(() => bub.classList.remove('on'), ms);
  };
  API.sayAt = sayAt;
  const fx = {
    cooler: () => { const [x, y, w, hh] = R.hot.cooler; for (let i = 0; i < 6; i++) { const b = document.createElement('i'); b.className = 'rm-bubble'; b.style.left = pct(x + w * (.3 + Math.random() * .4)); b.style.top = pct(y + hh * .48); b.style.animationDelay = i * .18 + 's'; box.appendChild(b); setTimeout(() => b.remove(), 2200); } },
    copier: () => { const [x, y] = R.hot.copier; const p = document.createElement('i'); p.className = 'rm-paper'; p.style.left = pct(x + 14); p.style.top = pct(y + 9); box.appendChild(p); setTimeout(() => p.remove(), 1500); },
    phone: () => SP.phone && (SP.phone.classList.remove('shake'), void SP.phone.offsetWidth, SP.phone.classList.add('shake')),
    lights: () => setEvening(!box.classList.contains('evening')),
    lamp: () => setEvening(!box.classList.contains('evening')),
    switch: () => setEvening(!box.classList.contains('evening')),
  };
  fx[who] = () => hero && (hero.classList.remove('hop'), void hero.offsetWidth, hero.classList.add('hop'));
  // зоны для клика (порядок: мелкие поверх крупных)
  Object.entries(R.hot).sort((a, b) => b[1][2] * b[1][3] - a[1][2] * a[1][3]).forEach(([k, [x, y, w, hh]]) => {
    const base = k.split('#')[0];
    if (!T[base]) return;
    const z = document.createElement('button'); z.type = 'button'; z.className = 'rm-hot'; z.dataset.k = k;
    z.style.left = pct(x); z.style.top = pct(y); z.style.width = pct(w); z.style.height = pct(hh);
    z.setAttribute('aria-label', line(k));
    z.addEventListener('click', () => { if (API.hook && API.hook(k)) return; say(k, z); (fx[k] || fx[base]) && (fx[k] || fx[base])(); });
    box.appendChild(z);
  });

  // ---------- пасхалки ----------
  const counter = document.createElement('span'); counter.className = 'rm-count';
  document.querySelector('.rm-bar').insertBefore(counter, document.getElementById('rm-time'));
  const place = (src, x, y, w, cls = '') => {
    const im = document.createElement('img'); im.src = src; im.alt = ''; im.className = 'rm-prop ' + cls;
    im.style.left = pct(x / R.w * 100); im.style.top = pct(y / R.h * 100); im.style.width = pct(w / R.w * 100); box.appendChild(im); return im;
  };
  API.place = place; API.fx = fx;
  const clicks = {};
  const bump = k => (clicks[k] = (clicks[k] || 0) + 1);
  if (room === 'office') {
    const MAIL = [
      ['HR', 'Mandatory fun on Friday (attendance mandatory)', 'Отдел кадров', 'Обязательное веселье в пятницу (явка обязательна)', 'Personāldaļa', 'Obligātā jautrība piektdien (ierašanās obligāta)'],
      ['Mr. Chew', 'Your parcel is on its way. Slowly.', 'Мистер Чу', 'Ваша посылка уже в пути. Медленно.', 'Misters Čū', 'Tava paciņa jau ceļā. Lēnām.'],
      ['Detective Titos', 'Have you seen any suspicious crumbs?', 'Детектив Титос', 'Вы не видели подозрительных крошек?', 'Detektīvs Titoss', 'Vai neesi redzējusi aizdomīgas drupačas?'],
      ['IT', 'Have you tried turning it off and on again?', 'IT-отдел', 'Вы пробовали выключить и включить?', 'IT nodaļa', 'Vai mēģināji izslēgt un ieslēgt?'],
      ['The Boss', 'Quick question (not quick)', 'Начальник', 'Быстрый вопрос (не быстрый)', 'Priekšnieks', 'Ātrs jautājums (nav ātrs)'],
      ['Kitchen', 'WHO TOOK MY YOGHURT', 'Кухня', 'КТО ВЗЯЛ МОЙ ЙОГУРТ', 'Virtuve', 'KURŠ PAŅĒMA MANU JOGURTU'],
      ['Seagull Guardians', 'We saw your pastry. Just saying.', 'Чайки-стражи', 'Мы видели ваш пирожок. Просто говорим.', 'Kaiju sargi', 'Mēs redzējām tavu pīrādziņu. Tikai saku.'],
      ['Copier', 'Paper jam in tray 2', 'Копир', 'Замятие бумаги в лотке 2', 'Kopētājs', 'Papīrs iesprūdis 2. paplātē'],
      ['Mom', 'Are you eating enough crumbs?', 'Мама', 'Ты достаточно ешь крошек?', 'Mamma', 'Vai ēd pietiekami daudz drupaču?'],
      ['Pumpkin Family', 'Tea on Saturday? The kettle’s always on', 'Семья Тыквиных', 'Чай в субботу? Чайник всегда горячий', 'Ķirbju ģimene', 'Tēja sestdien? Tējkanna vienmēr karsta'],
      ['Everyone', 'Re: Re: Re: Fwd: Who is in this chain?', 'Все', 'Re: Re: Re: Fwd: Кто вообще в этой переписке?', 'Visi', 'Re: Re: Re: Fwd: Kas vispār ir šajā sarakstē?'],
      ['Newsletter', '10 tips to fly to work faster', 'Рассылка', '10 советов, как долететь до работы быстрее', 'Jaunumi', '10 padomi, kā ātrāk aizlidot uz darbu'],
    ];
    const TX = { unread: ['Unread emails', 'Непрочитанных писем', 'Nelasītas vēstules'], inbox: ['Inbox', 'Входящие', 'Iesūtne'], all: ['Mark all as read', 'Прочитать все', 'Atzīmēt visas kā lasītas'],
      reply: ['Everyone', 'Re: Re: Fwd: Mark all as read?', 'Все', 'Re: Re: Fwd: Прочитать все?', 'Visi', 'Re: Re: Fwd: Atzīmēt visas kā lasītas?'],
      flood: ['Fine! I’ll answer the emails… oh no.', 'Ладно! Отвечу на письма… ой нет.', 'Labi! Atbildēšu uz vēstulēm… ak nē.'] };
    const inbox = []; let unread = 0;
    const [mx, my, mw] = R.hot.monitor;
    const badge = document.createElement('b'); badge.className = 'rm-badge'; badge.style.left = pct(mx + mw - 2.2); badge.style.top = pct(my + 1); box.appendChild(badge);
    const win = document.createElement('div'); win.className = 'rm-win'; win.hidden = true; box.appendChild(win);
    const render = () => {
      badge.textContent = unread > 99 ? '99+' : unread; badge.classList.toggle('zero', !unread);
      counter.textContent = `📧 ${TX.unread[L]}: ${unread}`;
      if (!win.hidden) win.innerHTML = `<div class="rm-win-t"><span>✉ ${TX.inbox[L]} (${unread})</span><button type="button" data-x>✕</button></div>
        <ul>${inbox.slice(0, 40).map(m => `<li class="${m.u ? 'u' : ''}"><b>${esc(m.f)}</b><span>${esc(m.s)}</span></li>`).join('')}</ul>
        <div class="rm-win-b"><button type="button" data-all>${TX.all[L]}</button></div>`;
    };
    const mail = (m, fly = true) => {
      inbox.unshift({ f: m[L * 2], s: m[L * 2 + 1], u: true }); unread++; render();
      if (fly) {
        const sx = 20 + Math.random() * 60, sy = 20 + Math.random() * 40, e = place('/images/rooms/prop-mail.png', sx, sy, 12, 'fly');
        const bw = box.clientWidth / R.w, bh = box.clientHeight / R.h;
        e.style.setProperty('--tx', ((mx / 100 * R.w + 30) - sx) * bw + 'px'); e.style.setProperty('--ty', ((my / 100 * R.h + 10) - sy) * bh + 'px');
        setTimeout(() => e.remove(), 1600);
      }
    };
    for (let i = 0; i < 7; i++) mail(MAIL[i], false);
    const tick = () => { mail(MAIL[Math.floor(Math.random() * MAIL.length)]); setTimeout(tick, 3500 + Math.random() * 5000); };
    setTimeout(tick, 2500);
    win.addEventListener('click', e => {
      if (e.target.closest('[data-x]')) { win.hidden = true; return; }
      if (e.target.closest('[data-all]')) { inbox.forEach(m => m.u = false); unread = 0; render(); setTimeout(() => mail(TX.reply), 1200); }
    });
    fx.monitor = () => { win.hidden = false; render(); bub.classList.remove('on'); };
    const pollyFx = fx.polly;
    fx.polly = () => { pollyFx(); if (bump('polly') % 5 === 0) { setTimeout(() => { bub.innerHTML = `<span>${esc(TX.flood[L])}</span>`; }, 50); for (let i = 0; i < 14; i++) setTimeout(() => mail(MAIL[i % MAIL.length]), i * 120); } };
    render();
  }
  if (room === 'detective') {
    const TX = { cups: ['Coffee today', 'Кофе за сегодня', 'Kafija šodien'],
      sip: [['Sip. Ahh. Now I can think.', 'Another cup. For the investigation.', 'Coffee is a clue. To staying awake.'],
            ['Глоток. Ах. Теперь можно думать.', 'Ещё чашечку. Ради расследования.', 'Кофе — это улика. Против сна.'],
            ['Malks. Ah. Tagad var domāt.', 'Vēl vienu tasi. Izmeklēšanas labā.', 'Kafija ir pierādījums. Pret miegu.']],
      jit: [['I CAN HEAR THE CLUES. They are very loud.', 'Case solved! No, wait. That was the coffee talking.', 'Is the room spinning or is it the fan?'],
            ['Я СЛЫШУ УЛИКИ. Они очень громкие.', 'Дело раскрыто! Нет, стоп. Это говорил кофе.', 'Это комната кружится или вентилятор?'],
            ['ES DZIRDU PIERĀDĪJUMUS. Tie ir ļoti skaļi.', 'Lieta atrisināta! Nē, pag. Tā runāja kafija.', 'Vai griežas istaba vai ventilators?']],
      pot: ['Fresh pot! The night is young.', 'Свежий кофейник! Ночь только начинается.', 'Svaigs kafijas kanna! Nakts vēl tikai sākas.'],
      cat: ['Meow. (The cat from case 1999. Case closed.)', 'Мяу. (Тот самый кот из дела 1999. Дело закрыто.)', 'Ņau. (Tas pats kaķis no 1999. gada lietas. Lieta slēgta.)'] };
    let cups = 0;
    const pot = place('/images/rooms/prop-pot.png', 298, 100, 13);
    const towers = [[224, 118], [233, 118], [196, 196], [206, 200]];
    const sip = (talk) => {
      cups++; counter.textContent = `☕ ${TX.cups[L]}: ${cups}`;
      const t = towers[Math.floor((cups - 1) / 6) % towers.length], n = (cups - 1) % 6;
      place('/images/rooms/prop-cup.png', t[0], t[1] - 8 - n * 6, 9, 'drop');
      if (hero) { hero.classList.remove('hop'); void hero.offsetWidth; hero.classList.add('hop'); hero.classList.toggle('jitter', cups >= 5 && API.coffee.on); }
      if (talk) {
        const lines = cups >= 5 ? TX.jit[L] : TX.sip[L];
        bub.innerHTML = `<span>${esc(pick(lines))}</span>`; const [x, y, w] = R.hot.titos; bub.classList.remove('below'); bub.style.left = (x + w / 2) + '%'; bub.style.top = y + '%';
        bub.classList.remove('on'); void bub.offsetWidth; bub.classList.add('on'); clearTimeout(bt); bt = setTimeout(() => bub.classList.remove('on'), 4000);
      }
    };
    counter.textContent = `☕ ${TX.cups[L]}: 0`;
    setTimeout(function auto() { if (API.coffee.on) sip(true); setTimeout(auto, 11000 + Math.random() * 8000); }, 4000);
    fx.mug = () => setTimeout(() => sip(true), 900);
    API.coffee.sip = sip;
    const potZ = document.createElement('button'); potZ.type = 'button'; potZ.className = 'rm-hot'; potZ.setAttribute('aria-label', TX.pot[L]);
    potZ.style.left = pct(298 / R.w * 100); potZ.style.top = pct(100 / R.h * 100); potZ.style.width = pct(14 / R.w * 100); potZ.style.height = pct(14 / R.h * 100);
    potZ.addEventListener('click', () => { pot.classList.remove('hop'); void pot.offsetWidth; pot.classList.add('hop'); bub.innerHTML = `<span>${esc(TX.pot[L])}</span>`; bub.classList.remove('below'); bub.style.left = '80%'; bub.style.top = '44%'; bub.classList.remove('on'); void bub.offsetWidth; bub.classList.add('on'); setTimeout(() => sip(false), 600); });
    box.appendChild(potZ);
    fx['box#1999'] = () => {
      if (bump('box1999') % 3 !== 0) return;
      const [bx_, by_] = R.hot['box#1999'];
      const cat = place('/images/rooms/prop-cat.png', bx_ / 100 * R.w + 6, by_ / 100 * R.h + 1, 18, 'peek');
      setTimeout(() => { bub.innerHTML = `<span>${esc(TX.cat[L])}</span>`; bub.classList.remove('below'); bub.style.left = '14%'; bub.style.top = '56%'; bub.classList.remove('on'); void bub.offsetWidth; bub.classList.add('on'); }, 300);
      setTimeout(() => cat.remove(), 7000);
    };
  }
})();
