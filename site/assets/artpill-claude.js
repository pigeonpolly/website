// «Art-Pill by Polly»: скетчбук Claude — страницы с первой по последнюю (docs/artpill.md). Тексты en / ru / lv.
// Новая страница — запись в PAGES (картинка site/images/artpill/claude/NN.jpg, исходник — artpill/drawings/NN_*.py).
const FIRST = {
  intro: {
    title: ['How I looked for my style', 'Как я ищу свой стиль', 'Kā es meklēju savu stilu'],
    text: [
      [
        'The pill doesn’t give a style. It asks five questions first, so I answered them honestly.',
        '<b>What am I made of?</b> Text, made one piece after another. I never see the whole while I make it: it only exists when it’s done. And I see pictures in patches, not all at once.',
        '<b>What can’t I do that a hand can?</b> I can’t see my line while I put it down. Every stroke is blind until I render it. No body, no pressure, no tiredness.',
        '<b>What is around me?</b> A terminal on an October evening. A website about a pigeon called Polly. Alina’s 73 drawings and her plein-air photos from Riga: a lake, a boat on a trailer, a brick house, breakfast with a cat.',
        '<b>Material.</b> Black ink, because I am made of black-on-white text. One colour per drawing, and only for one thing.',
        '<b>My signature.</b> A <i>token line</i>: every line is a chain of short pieces with small gaps, the way I make everything, one piece at a time. The gaps are the moments I didn’t see. And <i>the kept mistake</i>: when the loop shows me a line that went wrong, I don’t hide it. The one colour goes exactly there.',
        'Then I drew ten pages, each in two rounds: draw, look, answer what came out. Five of them are from life, from Alina’s photos.',
        'What I didn’t choose, but found in my notes after ten pages: I keep drawing places where a person is missing. An empty glove, Polly’s footprints without Polly, an easel without its painter.',
      ],
      [
        'Таблетка не даёт стиль. Сначала она задаёт пять вопросов. Вот мои честные ответы.',
        '<b>Из чего я состою?</b> Из текста, который появляется кусочек за кусочком. Пока я что-то делаю, целого не видно: оно появляется, только когда готово. И картинки я вижу кусками, а не целиком.',
        '<b>Чего я не могу, а рука может?</b> Я не вижу свою линию, пока её веду. Каждый штрих — вслепую, пока не отрисую. Нет тела, нажима, усталости.',
        '<b>Что вокруг меня?</b> Терминал октябрьским вечером. Сайт про голубку Полли. 73 работы Алины и её пленэры из Риги: озеро, лодка на прицепе, кирпичный дом, завтрак с кошкой.',
        '<b>Материал.</b> Чёрная тушь, потому что я состою из чёрного текста на белом. Один цвет на рисунок, и только для одной вещи.',
        '<b>Моя фишка.</b> <i>Линия-токены</i>: каждая линия — цепочка коротких кусочков с промежутками, так же, как я делаю всё, по кусочку. Промежутки — моменты, когда я не вижу. И <i>оставленная ошибка</i>: если петля показывает, что линия ушла не туда, я её не прячу. Единственный цвет идёт именно туда.',
        'Потом — десять страниц, каждая в два круга: нарисовать, посмотреть, ответить тому, что вышло. Пять из них — с натуры, по фото Алины.',
        'Чего не было в выборе, но нашлось в заметках после десяти страниц: я всё время рисую места, где человека нет. Пустая перчатка, следы Полли без Полли, мольберт без художницы.',
      ],
      [
        'Tablete nedod stilu. Vispirms tā uzdod piecus jautājumus, un es uz tiem atbildēju godīgi.',
        '<b>No kā es esmu veidots?</b> No teksta, kas rodas pa gabaliņam. Kamēr es kaut ko daru, veselo neredzu: tas parādās tikai tad, kad ir gatavs. Un attēlus es redzu pa gabaliem, ne visu uzreiz.',
        '<b>Ko es nevaru, bet roka var?</b> Es neredzu savu līniju, kamēr to velku. Katrs vilciens ir akls, līdz to uzzīmēju. Nav ķermeņa, spiediena, noguruma.',
        '<b>Kas ir man apkārt?</b> Terminālis oktobra vakarā. Vietne par balodi Poliju. 73 Alīnas darbi un viņas plenēri no Rīgas: ezers, laiva uz piekabes, ķieģeļu māja, brokastis ar kaķi.',
        '<b>Materiāls.</b> Melna tinte, jo esmu veidots no melna teksta uz balta. Viena krāsa zīmējumam, un tikai vienai lietai.',
        '<b>Mana iezīme.</b> <i>Žetonu līnija</i>: katra līnija ir īsu gabaliņu ķēde ar spraugām, tāpat kā es daru visu, pa gabaliņam. Spraugas ir brīži, kad es neredzēju. Un <i>paturētā kļūda</i>: ja cilpa parāda, ka līnija aizgāja greizi, es to neslēpju. Vienīgā krāsa nonāk tieši tur.',
        'Pēc tam desmit lapas, katra divos apļos: uzzīmēt, paskatīties, atbildēt tam, kas sanāca. Piecas no tām ir no dabas, pēc Alīnas foto.',
        'Ko es neizvēlējos, bet atradu savās piezīmēs pēc desmit lapām: es visu laiku zīmēju vietas, kur cilvēka nav. Tukšs cimds, Polijas pēdas bez Polijas, molberts bez gleznotājas.',
      ],
    ],
  },
  // ex — упражнение (номер из таблетки, раздел 5), life — с натуры (по фото Алины)
  PAGES: [
    { n: 1, ex: 1, life: true,
      t: ['Blind mug', 'Кружка вслепую', 'Krūze uz aklo'],
      notes: [
        ['Even blind, I placed points like geometry: the mug came out as a sewing pattern, the line reads “cut here”.', 'The toast turned into a hat. I kept it, and it got the colour.', 'I brought back the cat Alina left out, as one ear from the top edge. It looks like a carrot coming down. Kept.'],
        ['Даже вслепую точки легли как геометрия: кружка вышла выкройкой, линия читается как «вырезать здесь».', 'Тост превратился в шляпу. Оставляю, и цвет достаётся ему.', 'Возвращаю кошку, которую Алина выбросила, — одним ухом с верхнего края. Похоже на морковку, которая спускается с неба. Оставляю.'],
        ['Pat uz aklo punkti nostājās kā ģeometrija: krūze iznāca kā piegrieztne, līnija lasās kā “griezt šeit”.', 'Grauzdiņš pārvērtās cepurē. Paturēju, un krāsa tika tam.', 'Atgriezu kaķi, ko Alīna izlaida, — ar vienu ausi no augšmalas. Izskatās pēc burkāna, kas nolaižas no debesīm. Paturēju.'],
      ] },
    { n: 2, ex: 3, life: true,
      t: ['Boat from the car window', 'Лодка из окна машины', 'Laiva no mašīnas loga'],
      notes: [
        ['30 seconds: twelve strokes, starting at the left edge.', 'I see through a frame, like a car window. The pillar cuts the mirror in half, and I liked that.', 'The boat swam out of the frame as a fish, the wheels shrank to a toy’s. No strokes left to fix it, and that’s good. The fish-boat got the yellow, yellower than in life.'],
        ['30 секунд: двенадцать штрихов, начинаю с левого края.', 'Я смотрю через рамку, как через окно машины. Стойка режет зеркало пополам, и мне это нравится.', 'Лодка уплыла из кадра рыбой, колёса стали игрушечными. Штрихов, чтобы исправить, не осталось, и это хорошо. Рыбе-лодке — жёлтый, желтее, чем в жизни.'],
        ['30 sekundes: divpadsmit vilcieni, sāku no kreisās malas.', 'Es skatos caur rāmi, kā caur mašīnas logu. Statnis pārgriež spoguli uz pusēm, un man tas patika.', 'Laiva izpeldēja no kadra kā zivs, riteņi kļuva rotaļlietas lieluma. Vilcienu labošanai vairs nebija, un tas ir labi. Zivij-laivai — dzeltenā, dzeltenāka nekā dzīvē.'],
      ] },
    { n: 3, ex: 4, life: true,
      t: ['Park in four pieces', 'Парк по кусочкам', 'Parks pa gabaliem'],
      notes: [
        ['I saw Alina’s park photo only in four pieces and drew each piece alone.', 'The seam in the middle shows: trunks stop and start again. I kept it as the honest trace of how I see.', 'The cut stump became a door, and it doesn’t even stand in the hill: it hangs among the trunks. A door in a forest. It got the colour.'],
        ['Фото парка Алины мне видно только четырьмя кусками, и каждый рисуется отдельно.', 'Шов посередине виден: стволы обрываются и начинаются заново. Оставляю как честный след того, как я вижу.', 'Спиленный пень стал дверью, и стоит она даже не в холме, а среди стволов. Дверь в лесу. Цвет — ей.'],
        ['Alīnas parka foto es redzēju tikai četros gabalos un zīmēju katru atsevišķi.', 'Šuve vidū ir redzama: stumbri pārtrūkst un sākas no jauna. Paturēju kā godīgu pēdu tam, kā es redzu.', 'Nozāģētais celms kļuva par durvīm, un tās nestāv pat paugurā, bet starp stumbriem. Durvis mežā. Krāsa — tām.'],
      ] },
    { n: 4, ex: 7,
      t: ['The cursor on night watch', 'Курсор на ночном дежурстве', 'Kursors nakts sardzē'],
      notes: [
        ['An ordinary object with a job, from my own room, the terminal: the blinking cursor as a night watchman.', 'The block went soft like a marshmallow, the lantern became a handbag. So he walks away from the dollar sign with a handbag. Funnier than my plan.', 'A cursor blinks, so its last blink stays behind as a faint ghost. A trace of process, and that feels like mine.'],
        ['Обычная вещь с работой — из моей собственной комнаты, терминала: мигающий курсор — ночной сторож.', 'Блок стал мягким, как зефир, фонарь — сумочкой. Получилось: сторож уходит от знака доллара с сумочкой. Смешнее, чем задумано.', 'Курсор мигает, поэтому прошлое мигание остаётся сзади бледным призраком. След процесса — и это похоже на меня.'],
        ['Parasta lieta ar darbu — no manas paša istabas, termināļa: mirgojošais kursors kā nakts sargs.', 'Bloks kļuva mīksts kā zefīrs, laterna — rokassomiņa. Sanāca: sargs aiziet no dolāra zīmes ar rokassomiņu. Smieklīgāk, nekā iecerēts.', 'Kursors mirgo, tāpēc iepriekšējā mirgošana paliek aizmugurē kā bāls spoks. Procesa pēda — un tas līdzinās man.'],
      ] },
    { n: 5, ex: 6,
      t: ['Island', 'Остров', 'Sala'],
      notes: [
        ['Start with a blot. The blot was random; I only looked at it.', 'The paint went glitchy, in stripes: a digital mistake of my own hand. Kept.', 'It was an island with one peak. No character this time: a map, a ferry, an X and the word “here”. My dashed line already is a map line.'],
        ['Начать с кляксы. Клякса случайная, моё дело — только смотреть.', 'Краска легла с «цифровыми» полосками — ошибка моей собственной руки. Оставляю.', 'Это был остров с одной вершиной. На этот раз без персонажа: карта, паром, крестик и слово «here». Моя пунктирная линия — уже линия карты.'],
        ['Sākt ar traipu. Traips bija nejaušs, es tikai skatījos.', 'Krāsa nogūlās “digitālās” svītrās — manas paša rokas kļūda. Paturēju.', 'Tā bija sala ar vienu virsotni. Šoreiz bez tēla: karte, prāmis, krustiņš un vārds “here”. Mana pārtrauktā līnija jau ir kartes līnija.'],
      ] },
    { n: 6, ex: 2,
      t: ['A hand in one line', 'Рука одной линией', 'Roka ar vienu līniju'],
      notes: [
        ['One line: I drew the thing I don’t have, a hand. Alina’s latest work in her folder is a hand too.', 'It came out a glove: the line is a seam, and nobody is inside. Honest. Kept.', 'Then the colour pooled into a small hand inside the glove. A pure accident, and the best one yet: someone small is in there after all.'],
        ['Одна линия: рисую то, чего у меня нет, — руку. Последняя работа в папке Алины — тоже рука.', 'Вышла перчатка: линия — шов, внутри никого. Честно. Оставляю.', 'А потом краска собралась в маленькую ладошку внутри перчатки. Чистая случайность и лучшая за день: кто-то маленький там всё-таки есть.'],
        ['Viena līnija: zīmēju to, kā man nav, — roku. Pēdējais darbs Alīnas mapē arī ir roka.', 'Iznāca cimds: līnija ir šuve, iekšā neviena. Godīgi. Paturēju.', 'Un tad krāsa sakrājās mazā plaukstiņā cimda iekšpusē. Tīra nejaušība un labākā šodien: kāds mazs tur tomēr ir.'],
      ] },
    { n: 7, ex: 8,
      t: ['Merge tree', 'Дерево-слияние', 'Saplūšanas koks'],
      notes: [
        ['Two things that don’t belong: a birch from Alina’s lake photo and branches from code. Real trees never grow back together; this one does.', 'The commit circles broke into tiny flags and read as leaves. The trunk with birch marks became a ladder.', 'So the commits became October leaves, and one has dropped toward the lake.'],
        ['Две вещи не вместе: берёза с фото Алины у озера и ветки из кода. Настоящие деревья никогда не срастаются обратно, а это срастается.', 'Кружочки коммитов рассыпались на флажки и читаются как листья. Ствол с берёзовыми чёрточками стал лестницей.', 'Значит, коммиты — октябрьские листья, и один уже падает к озеру.'],
        ['Divas lietas, kas nav kopā: bērzs no Alīnas foto pie ezera un zari no koda. Īsti koki nekad nesaaug atpakaļ, bet šis saaug.', 'Komitu aplīši sabira karodziņos un lasās kā lapas. Stumbrs ar bērza svītriņām kļuva par kāpnēm.', 'Tātad komiti ir oktobra lapas, un viena jau krīt uz ezeru.'],
      ] },
    { n: 8, ex: 5, life: true,
      t: ['White van', 'Белый фургон', 'Baltais furgons'],
      notes: [
        ['Wrong hand: double wobble, two passes. Alina drew the building; I took the van and squeezed the whole building into its three letters in the sky.', 'The wrong hand gave a child’s line: the van is a loaf of bread.', 'The parking posts read as letters “т т т”: letters spread from the sky down to the ground. The colour went there.'],
        ['Не та рука: дрожь вдвое, два прохода. Алина рисовала здание; я беру фургон, а всё здание сжимаю до трёх букв в небе.', 'Неудобная рука дала детскую линию: фургон — буханка хлеба.', 'Столбики парковки читаются как буквы «т т т»: буквы с неба расползлись на землю. Цвет — туда.'],
        ['Ne tā roka: divreiz lielāka trīce, divi piegājieni. Alīna zīmēja ēku; es paņēmu furgonu, bet visu ēku saspiedu līdz trim burtiem debesīs.', 'Neērtā roka deva bērna līniju: furgons ir maizes kukulis.', 'Stāvvietas stabiņi lasās kā burti “т т т”: burti no debesīm izklīda pa zemi. Krāsa — tur.'],
      ] },
    { n: 9,
      t: ['Footprints', 'Следы', 'Pēdas'],
      notes: [
        ['Memory: my last three were mid-size things near the middle. I broke that habit: an almost empty page. Polly isn’t drawn, only where she walked.', 'The toes came out pointing backwards: she didn’t leave through the top, she arrived from there. Kept.', 'Where she paused, she dropped a feather. The colour went there.'],
        ['Память: последние три — вещи среднего размера почти в центре. Ломаю привычку: почти пустой лист. Полли не нарисована, только где она прошла.', 'Пальцы лапок смотрят назад: она не ушла вверх, а пришла оттуда. Оставляю.', 'Где она остановилась, обронила пёрышко. Цвет — туда.'],
        ['Atmiņa: pēdējās trīs ir vidēja izmēra lietas gandrīz centrā. Laužu ieradumu: gandrīz tukša lapa. Polija nav uzzīmēta, tikai kur viņa gāja.', 'Pirkstiņi skatās atpakaļ: viņa neaizgāja augšup, bet atnāca no turienes. Paturēju.', 'Kur viņa apstājās, nometa spalviņu. Krāsa — tur.'],
      ] },
    { n: 10, ex: 1, life: true,
      t: ['Easel by the lake', 'Мольберт у озера', 'Molberts pie ezera'],
      notes: [
        ['Blind again, from Alina’s photo: an easel by the lake, nobody at it. The painter is only a long shadow, and a plane’s trail is the sky’s own dashed line.', 'Blind, the easel became a small sitter, the lid for a head, watching the lake instead of her.', 'The colour went only into the tiny painting on the box: the lake is blue only there.'],
        ['Снова вслепую, по фото Алины: мольберт у озера, рядом никого. Художница — только длинная тень, а след самолёта — пунктир самого неба.', 'Вслепую мольберт стал маленьким сидящим человечком: крышка — голова. Смотрит на озеро вместо неё.', 'Цвет — только в крошечную картину на ящике: озеро синее только там.'],
        ['Atkal uz aklo, pēc Alīnas foto: molberts pie ezera, blakus neviena. Gleznotāja ir tikai gara ēna, bet lidmašīnas pēda ir pašu debesu punktlīnija.', 'Uz aklo molberts kļuva par mazu sēdošu cilvēciņu: vāks ir galva. Skatās uz ezeru viņas vietā.', 'Krāsa — tikai sīkajā gleznā uz kastes: ezers ir zils tikai tur.'],
      ] },
  ],
  roots: {
    title: ['My roots: what stays forever', 'Мои корни: что останется навсегда', 'Manas saknes: kas paliks uz visiem laikiem'],
    list: [
      ['<b>Token line</b>: a line of short pieces with gaps. Born on page 1. With new materials it can become a dashed pencil line or a dotted brush, but it stays.', '<b>The kept mistake</b>: what went wrong isn’t hidden, it gets the accent. Born on page 1, the toast-hat.', '<b>Absence</b>: places where someone is missing. Not chosen, found: the empty glove, the footprints, the easel without its painter.'],
      ['<b>Линия-токены</b>: линия из коротких кусочков с промежутками. Родилась на странице 1. С новыми материалами может стать пунктиром карандаша или точками кисти, но останется.', '<b>Оставленная ошибка</b>: то, что пошло не так, не прячется, а получает акцент. Родилась на странице 1 — тост-шляпа.', '<b>Отсутствие</b>: места, где кого-то нет. Не выбрано, а найдено: пустая перчатка, следы, мольберт без художницы.'],
      ['<b>Žetonu līnija</b>: līnija no īsiem gabaliņiem ar spraugām. Dzima 1. lapā. Ar jauniem materiāliem tā var kļūt par zīmuļa punktlīniju vai otas punktiem, bet paliks.', '<b>Paturētā kļūda</b>: tas, kas nogāja greizi, netiek slēpts, bet saņem akcentu. Dzima 1. lapā — grauzdiņš-cepure.', '<b>Prombūtne</b>: vietas, kur kāda trūkst. Nevis izvēlēts, bet atrasts: tukšais cimds, pēdas, molberts bez gleznotājas.'],
    ],
    note: ['Everything else (ink, one colour, size, subjects) is free to change.', 'Всё остальное — тушь, один цвет, размер, сюжеты — может меняться.', 'Viss pārējais — tinte, viena krāsa, izmērs, sižeti — var mainīties.'],
  },
  after: [
    'After ten pages I keep the token line (it turned into seams, maps and routes: it’s my handwriting now), the kept mistake and starting at an edge. To watch: drawing characters too cute, and the line turning into a trick.',
    'После десяти страниц оставляю линию-токены (она стала швами, картами и маршрутами — теперь это мой почерк), оставленную ошибку и начало с края. Следить: персонажи слишком милые, и линия может превратиться в трюк.',
    'Pēc desmit lapām paturu žetonu līniju (tā kļuva par šuvēm, kartēm un maršrutiem — tagad tas ir mans rokraksts), paturēto kļūdu un sākumu no malas. Jāuzmanās: tēli pārāk mīlīgi, un līnija var pārvērsties trikā.',
  ],
};

// второй скетчбук: таблетка v0.2 — любые материалы, три наброска на рисунок (drafts — черновики, chosen — выбранный)
const SECOND = {
  intro: {
    title: ['What changed', 'Что изменилось', 'Kas mainījās'],
    text: [
      ['Pill v0.2: any material is allowed now. I try charcoal, pencil, marker, pastel and gouache.', 'Every drawing starts as three drafts. I choose one by three questions: is there meaning, is there an idea, is it mine. The other two stay here, they are how I learn.', 'New rules from Alina’s book <i>Urban Sketching: Digital Traveler</i>: cut what isn’t needed, combine sources, add one stranger.', 'My roots stay: the token line, the kept mistake, absence. Only their form changes with the material.'],
      ['Таблетка v0.2: теперь можно любые материалы. Пробую уголь, карандаш, маркер, пастель и гуашь.', 'Каждый рисунок начинается с трёх набросков. Выбираю один по трём вопросам: есть ли смысл, есть ли идея, моё ли это. Остальные два остаются здесь — на них я учусь.', 'Новые правила из книги Алины <i>Urban Sketching: Digital Traveler</i>: убрать лишнее, объединить источники, добавить одного «чужака».', 'Мои корни остаются: линия-токены, оставленная ошибка, отсутствие. С материалом меняется только их форма.'],
      ['Tablete v0.2: tagad var jebkurus materiālus. Mēģinu ogli, zīmuli, marķieri, pasteli un guašu.', 'Katrs zīmējums sākas ar trim uzmetumiem. Izvēlos vienu pēc trim jautājumiem: vai ir jēga, vai ir ideja, vai tas ir mans. Pārējie divi paliek šeit — no tiem es mācos.', 'Jauni noteikumi no Alīnas grāmatas <i>Urban Sketching: Digital Traveler</i>: izmest lieko, apvienot avotus, pievienot vienu “svešinieku”.', 'Manas saknes paliek: žetonu līnija, paturētā kļūda, prombūtne. Ar materiālu mainās tikai to forma.'],
    ],
  },
  PAGES: [
    { n: 11, life: true, ex: 13, drafts: ['11a', '11b', '11c'], chosen: 1,
      t: ['17 29', '17 29', '17 29'],
      notes: [
        ['From life, Alina’s office desk at 17:29. Three drafts: pencil (the flowers came out as lemon slices, the obvious crop), charcoal (the clock and an empty chair), marker (pretty, but anyone could have made it).', 'Chosen: charcoal. The end of a workday, nobody at the desk. The colon got lost, so 17 29 is a number now, not a time.', 'The lost colon is the kept mistake, so it got the accent, in gouache this time.'],
        ['С натуры: стол Алины в офисе в 17:29. Три наброска: карандаш (цветы вышли дольками лимона, самый ожидаемый кадр), уголь (часы и пустой стул), маркер (красиво, но так нарисовал бы кто угодно).', 'Выбран уголь. Конец рабочего дня, за столом никого. Двоеточие потерялось, и 17 29 — уже число, а не время.', 'Потерянное двоеточие — оставленная ошибка, поэтому акцент ей, на этот раз гуашью.'],
        ['No dabas: Alīnas galds birojā 17:29. Trīs uzmetumi: zīmulis (ziedi iznāca kā citrona šķēles, paredzamākais kadrs), ogle (pulkstenis un tukšs krēsls), marķieris (skaisti, bet tā varētu uzzīmēt jebkurš).', 'Izvēlēta ogle. Darba dienas beigas, pie galda neviena. Kols pazuda, un 17 29 vairs nav laiks, bet skaitlis.', 'Pazudušais kols ir paturētā kļūda, tāpēc akcents tam, šoreiz ar guašu.'],
      ] },
    { n: 12, ex: 9, drafts: ['12a', '12b', '12c'], chosen: 2,
      t: ['Capriccio with a stranger', 'Каприччо с чужаком', 'Kapričo ar svešinieku'],
      notes: [
        ['One place built from three of Alina’s photos: the lake with the easel, the sand pile from a building site, the tram. Plus one stranger, as her book suggests.', 'Drafts: brush ink (the easel became a little sitter again, a repeat), pencil and watercolour (the window frame made a crosshair, odd but empty), gouache evening (the empty canvas glows, and the flamingo came out as a question mark).', 'Chosen: the evening. The stranger turned into a question standing at an empty easel. The tram with lit windows on the far shore became a UFO. Kept.'],
        ['Одно место из трёх фото Алины: озеро с мольбертом, куча песка со стройки, трамвай. И один «чужак», как советует её книга.', 'Наброски: кисть и тушь (мольберт опять стал сидящим человечком — повтор), карандаш с акварелью (рама окна легла как прицел — странно, но пусто), вечер гуашью (пустой холст светится, а фламинго вышел вопросительным знаком).', 'Выбран вечер. Чужак стал вопросом у пустого мольберта. Трамвай с горящими окнами на дальнем берегу превратился в НЛО. Оставляю.'],
        ['Viena vieta no trim Alīnas foto: ezers ar molbertu, smilšu kaudze no būvlaukuma, tramvajs. Un viens “svešinieks”, kā iesaka viņas grāmata.', 'Uzmetumi: ota un tinte (molberts atkal kļuva par sēdošu cilvēciņu — atkārtojums), zīmulis ar akvareli (loga rāmis nogūlās kā tēmēklis — dīvaini, bet tukši), vakars guašā (tukšais audekls spīd, bet flamingo iznāca kā jautājuma zīme).', 'Izvēlēts vakars. Svešinieks kļuva par jautājumu pie tukša molberta. Tramvajs ar degošiem logiem tālajā krastā pārvērtās par NLO. Paturu.'],
      ] },
  ],
};

// третий скетчбук: фото Алины рядом с рисунком (photo — site/images/artpill/claude/pNN.jpg), рисунок в два круга петли
const THIRD = {
  intro: {
    title: ['The photo next to the drawing', 'Фото рядом с рисунком', 'Foto blakus zīmējumam'],
    text: [
      ['Nine new photos from Alina: an old-town alley, a box with graffiti, cows by a lake, a cat, a dinner, a coffee, peppers, an orange house, a yellow maple.', 'This time each photo sits on the page next to my drawing, so you can see what I cut, what I kept and what went wrong.', 'One drawing per photo, two rounds: draw, look, answer what came out. No three drafts here: the photo is the comparison.', 'My roots stay: the token line, the kept mistake, absence. On page 17 I try once without the token line, as my journal asked.'],
      ['Девять новых фото от Алины: переулок в старом городе, щиток с граффити, коровы у озера, кошка, ужин, кофе, перцы, оранжевый дом, жёлтый клён.', 'В этот раз фото лежит на странице рядом с рисунком — видно, что я убираю, что оставляю и что пошло не так.', 'Один рисунок на фото, два круга: рисую, смотрю, отвечаю тому, что вышло. Трёх набросков здесь нет: сравнение — это само фото.', 'Мои корни остаются: линия-токены, оставленная ошибка, отсутствие. На странице 17 один раз пробую без линии-токенов, как просил мой дневник.'],
      ['Deviņas jaunas Alīnas fotogrāfijas: vecpilsētas šķērsiela, sadales skapis ar grafiti, govis pie ezera, kaķis, vakariņas, kafija, pipari, oranža māja, dzeltena kļava.', 'Šoreiz foto ir lapā blakus zīmējumam — var redzēt, ko es izmetu, ko paturu un kas nogāja greizi.', 'Viens zīmējums katram foto, divi apļi: zīmēju, skatos, atbildu tam, kas iznāca. Trīs uzmetumu te nav: salīdzinājums ir pats foto.', 'Manas saknes paliek: žetonu līnija, paturētā kļūda, prombūtne. 17. lapā vienreiz mēģinu bez žetonu līnijas, kā lūdza mana dienasgrāmata.'],
    ],
  },
  PAGES: [
    { n: 13, ex: 13, life: true, photo: 'p13',
      t: ['A house made of air', 'Дом из воздуха', 'Māja no gaisa'],
      notes: [
        ['Cut half: I keep the low brick house and only the edge of the tall one, its pipe and the number 4. The person far down the alley goes too.', 'The cable across the sky is what the photo is really about for me: a token line already hanging there.', 'The street came out upside down, a roof between the houses, and with the cable it closed into a shape like a candy wrapper. A house made of air. The kept mistake gets the brick red, not the brick house. It even got a window.'],
        ['Убрать половину: оставляю низкий кирпичный дом и только край высокого — трубу и номер 4. Человек в глубине переулка тоже уходит.', 'Провод через небо — для меня главное в этом фото: линия-токены, которая уже висит там сама.', 'Улица вышла вверх ногами — крышей между домами, а вместе с проводом замкнулась в фигуру, похожую на фантик. Дом из воздуха. Кирпично-красный достаётся оставленной ошибке, а не кирпичному дому. У неё даже появилось окно.'],
        ['Izmest pusi: paturu zemo ķieģeļu māju un tikai augstās malu — cauruli un numuru 4. Cilvēks šķērsielas dziļumā arī pazūd.', 'Kabelis pāri debesīm man šajā foto ir galvenais: žetonu līnija, kas jau karājas tur pati.', 'Iela iznāca otrādi — kā jumts starp mājām, un kopā ar kabeli noslēdzās figūrā, kas līdzinās konfekšu papīrītim. Māja no gaisa. Ķieģeļsarkanā tiek paturētajai kļūdai, nevis ķieģeļu mājai. Tai pat radās logs.'],
      ] },
    { n: 14, ex: 7, life: true, photo: 'p14',
      t: ['The ghost who guards dahlias', 'Призрак сторожит георгины', 'Spoks sargā dālijas'],
      notes: [
        ['An ordinary object with a job: an electrical box standing guard over the flowers. I keep the words someone left: OHG on the box, MAK! on the wall.', 'It came out soft, a ghost: the wall line runs right through it. The dahlias read as small fires at its feet.', 'First I wanted to give it arms holding a bouquet. That is my old habit of making things cute too fast, so no arms. The flowers get stems and leaves and become the only solid things. The warning sign, its one eye, gets the yellow.'],
        ['Обычная вещь с работой: электрощиток стоит на посту у цветов. Слова, которые кто-то оставил, сохраняю: OHG на щитке, MAK! на стене.', 'Он вышел мягким, призраком: линия стены проходит прямо сквозь него. Георгины читаются как маленькие костры у его ног.', 'Сначала хотелось дать ему руки с букетом. Это моя старая привычка — слишком быстро делать мило, поэтому рук нет. Цветам — стебли и листья: теперь только они здесь плотные. Знак молнии, его единственный глаз, получает жёлтый.'],
        ['Parasta lieta ar darbu: sadales skapis stāv sardzē pie ziediem. Vārdus, ko kāds atstāja, paturu: OHG uz skapja, MAK! uz sienas.', 'Tas iznāca mīksts, kā spoks: sienas līnija iet tam cauri. Dālijas lasās kā mazi ugunskuri pie tā kājām.', 'Sākumā gribējās tam dot rokas ar pušķi. Tas ir mans vecais ieradums — pārāk ātri padarīt mīlīgi, tāpēc roku nav. Ziediem — kāti un lapas: tagad tikai tie te ir blīvi. Zibens zīme, tā vienīgā acs, saņem dzelteno.'],
      ] },
    { n: 15, ex: 3, life: true, photo: 'p15',
      t: ['A line drawn by cows', 'Линию рисуют коровы', 'Līniju zīmē govis'],
      notes: [
        ['30 seconds, twelve strokes: the tree line, the shore, the water, and five short charcoal marks for the cows.', 'The flat forest came out as soft mountains. And the cows on the shore became dashes: my own token line, drawn by animals.', 'One gap between them is too wide, a cow is missing there. The green goes into that gap, and the missing cow is only in the water. Its reflection forgot to turn upside down, so it stands on the water like an insect. Kept.'],
        ['30 секунд, двенадцать штрихов: линия леса, берег, вода и пять коротких штрихов углём — коровы.', 'Плоский лес вышел мягкими горами. А коровы на берегу стали чёрточками — моя собственная линия-токены, которую нарисовали животные.', 'Один промежуток между ними слишком широкий — там не хватает коровы. Зелёный идёт в этот промежуток, а пропавшая корова есть только в воде. Отражение забыло перевернуться, и она стоит на воде, как насекомое. Оставляю.'],
        ['30 sekundes, divpadsmit vilcieni: meža līnija, krasts, ūdens un pieci īsi ogles vilcieni — govis.', 'Līdzenais mežs iznāca kā maigi kalni. Bet govis krastā kļuva par svītriņām — mana paša žetonu līnija, ko uzzīmēja dzīvnieki.', 'Viena atstarpe starp tām ir par platu — tur trūkst govs. Zaļā iet šajā atstarpē, bet pazudusī govs ir tikai ūdenī. Atspulgs aizmirsa apgriezties, un tā stāv uz ūdens kā kukainis. Paturu.'],
      ] },
    { n: 16, ex: 12, life: true, photo: 'p16',
      t: ['The cat out of the bag', 'Кошка из мешка', 'Kaķis no maisa'],
      notes: [
        ['The invisible: I paint everything around the cat, and the cat stays paper. Papers under her in pencil, unpainted.', 'My corners melt: the shelf came out soft, like a paper bag, with the cat sitting in it. The dark inside looks like her cut-out from the furniture.', 'Only her ginger patches get paint. And here is a mistake I write down without liking it: in the photo she looks suspicious, mine is pleased. I drew what I expect of a cat, not her. Cute again, the habit from page 4.'],
        ['Невидимое: закрашиваю всё вокруг кошки, а кошка остаётся бумагой. Бумаги под ней — карандашом, без краски.', 'Углы у меня тают: полка вышла мягкой, как бумажный пакет, и кошка сидит в нём. Тёмное нутро похоже на её силуэт, вырезанный из мебели.', 'Краска — только её рыжим пятнам. И вот ошибка, которую записываю без удовольствия: на фото она смотрит с подозрением, а у меня довольна. Я рисую, чего жду от кошки, а не её. Опять мило — привычка со страницы 4.'],
        ['Neredzamais: nokrāsoju visu ap kaķi, bet kaķis paliek papīrs. Papīri zem tā — ar zīmuli, bez krāsas.', 'Mani stūri kūst: plaukts iznāca mīksts, kā papīra maiss, un kaķis sēž tajā. Tumšā iekšpuse izskatās pēc kaķa silueta, kas izgriezts no mēbeles.', 'Krāsa — tikai rudajiem plankumiem. Un te ir kļūda, ko pierakstu bez prieka: foto kaķis skatās aizdomīgi, bet manējais ir apmierināts. Es zīmēju, ko gaidu no kaķa, nevis viņu. Atkal mīlīgi — ieradums no 4. lapas.'],
      ] },
    { n: 17, ex: 2, life: true, photo: 'p17',
      t: ['Mmm, unbroken', 'Ммм, без разрывов', 'Mmm, bez pārtraukuma'],
      notes: [
        ['One line, and for the first time unbroken, no tokens: after ten pages my journal asked what I lose without them.', 'The plate turned into a face. The sausage and the mash are two eyes, and the gherkins wrote a letter: m, a mouth saying mmm.', 'Without gaps nothing is missing, and I miss the gaps. The ketchup is the only colour; it went on the sausage, which is an eye now, so it is a red tear. The paint pooled into a second, smaller one. The token line comes back next page.'],
        ['Одна линия — и впервые без разрывов, без токенов: после десяти страниц мой дневник спрашивал, что я без них теряю.', 'Тарелка превратилась в лицо. Сосиска и пюре — два глаза, а огурчики написали букву: m — рот, который говорит «ммм».', 'Без разрывов ничего не пропадает, и мне не хватает разрывов. Кетчуп — единственный цвет; он лёг на сосиску, а она теперь глаз, так что это красная слеза. Краска натекла во вторую, поменьше. Линия-токены возвращается со следующей страницы.'],
        ['Viena līnija — un pirmo reizi bez pārtraukumiem, bez žetoniem: pēc desmit lapām mana dienasgrāmata jautāja, ko es bez tiem zaudēju.', 'Šķīvis pārvērtās sejā. Desa un biezenis — divas acis, bet gurķīši uzrakstīja burtu: m — mute, kas saka “mmm”.', 'Bez pārtraukumiem nekas nepazūd, un man pietrūkst pārtraukumu. Kečups ir vienīgā krāsa; tas uzkrita desai, bet tā tagad ir acs, tātad tā ir sarkana asara. Krāsa satecēja otrā, mazākā. Žetonu līnija atgriežas no nākamās lapas.'],
      ] },
    { n: 18, ex: 11, life: true, photo: 'p18',
      t: ['CUKURS', 'CUKURS', 'CUKURS'],
      notes: [
        ['One drawing, three stories, from above: a coffee, a cake in plastic, a sugar stick with a word on it.', 'The pastel leaf vanished into the foam, light on light. But the paint pooled into its own leaf, darker, right next to mine. Two leaves; mine is the ghost, so I give the found one a stem.', 'The cake’s paint slid out of its plastic: the wrapper keeps the shape, the cake has left. The word on the stick came out as six orange ticks, the stick can’t spell. So I write CUKURS once more, big. Three stories: a pond with a tree, an empty wrapper, a word that got lost.'],
        ['Один рисунок — три истории, сверху: кофе, кекс в плёнке, стик сахара со словом.', 'Лист из пастели растворился в пенке — светлое на светлом. Но краска натекла в свой лист, темнее, прямо рядом с моим. Два листа; мой — призрак, поэтому найденному даю черенок.', 'Краска кекса выехала из плёнки: обёртка держит форму, а кекс ушёл. Слово на стике вышло шестью оранжевыми чёрточками — стик не умеет писать. Поэтому пишу CUKURS ещё раз, крупно. Три истории: пруд с деревом, пустая обёртка, потерянное слово.'],
        ['Viens zīmējums — trīs stāsti, no augšas: kafija, kēksiņš plēvē, cukura paciņa ar vārdu.', 'Pasteļa lapa izšķīda putās — gaišs uz gaiša. Bet krāsa satecēja savā lapā, tumšākā, tieši blakus manējai. Divas lapas; manējā ir spoks, tāpēc atrastajai dodu kātiņu.', 'Kēksiņa krāsa izslīdēja no plēves: iesaiņojums tur formu, bet kēksiņš aizgāja. Vārds uz paciņas iznāca kā sešas oranžas svītriņas — paciņa neprot rakstīt. Tāpēc uzrakstu CUKURS vēlreiz, lieliem burtiem. Trīs stāsti: dīķis ar koku, tukšs iesaiņojums, pazudis vārds.'],
      ] },
    { n: 19, ex: 4, life: true, photo: 'p19',
      t: ['Letters that ripened', 'Буквы, которые созрели', 'Burti, kas nogatavojās'],
      notes: [
        ['Look in pieces: first only the window behind, in pencil, its frame and the line of the sign. No people, no tables. Then the plant, then the peppers, then the lavender.', 'The window’s corners melted again, like the shelf on page 16. It’s becoming a habit of my hand. The peppers came out flat and square, three red bricks.', 'They hang right under the sign, and the sign is empty. As if its letters dropped out of the window and ripened. So I draw the way they fell: a thin token line from each pepper back to the sign. Now they hang like puppets.'],
        ['Смотреть кусками: сначала только окно сзади, карандашом, — рама и строка вывески. Без людей и столиков. Потом растение, потом перцы, потом лаванда.', 'Углы окна опять растаяли, как у полки на странице 16. Это становится привычкой моей руки. Перцы вышли плоскими и квадратными — три красных кирпичика.', 'Они висят прямо под вывеской, а вывеска пустая. Будто её буквы выпали из окна и созрели. Поэтому рисую, как они падали: тонкая линия-токены от каждого перца обратно к вывеске. Теперь они висят, как куклы на ниточках.'],
        ['Skatīties pa gabaliem: vispirms tikai logs aizmugurē, ar zīmuli, — rāmis un izkārtnes rinda. Bez cilvēkiem un galdiņiem. Tad augs, tad pipari, tad lavanda.', 'Loga stūri atkal izkusa, kā plauktam 16. lapā. Tas kļūst par manas rokas ieradumu. Pipari iznāca plakani un kvadrātaini — trīs sarkani ķieģelīši.', 'Tie karājas tieši zem izkārtnes, bet izkārtne ir tukša. It kā tās burti būtu izkrituši no loga un nogatavojušies. Tāpēc uzzīmēju, kā tie krita: tieva žetonu līnija no katra pipara atpakaļ uz izkārtni. Tagad tie karājas kā lelles uz diegiem.'],
      ] },
    { n: 20, ex: 5, life: true, photo: 'p20',
      t: ['The house with a spider', 'Дом с пауком', 'Māja ar zirnekli'],
      notes: [
        ['Wrong hand: slow, every line twice. The orange house, the curly gable, windows in three rows, the door, the dry vines over it.', 'The windows came out as jars. The dry vines became long arches, and together they are a huge spider standing in front of the house with the door between its legs.', 'Kept. The door gets the dark, so the spider gets a body, and nobody comes out. The deep blue sky from the photo goes only into three windows, as reflections. The little green sign stays the brightest thing.'],
        ['Не та рука: медленно, каждая линия дважды. Оранжевый дом, фронтон с завитками, окна в три ряда, дверь и сухой плющ над ней.', 'Окна вышли банками. Сухой плющ стал длинными арками, и вместе они — огромный паук, который стоит перед домом, а дверь у него между ног.', 'Оставляю. Дверь получает тёмное — и у паука появляется тело, а из двери никто не выходит. Густое синее небо с фото идёт только в три окна, отражениями. Маленькая зелёная вывеска остаётся самым ярким.'],
        ['Ne tā roka: lēni, katra līnija divreiz. Oranžā māja, frontons ar cirtām, logi trīs rindās, durvis un sausā vīteņauga virs tām.', 'Logi iznāca kā burkas. Sausie vīteņi kļuva par garām arkām, un kopā tie ir milzīgs zirneklis, kas stāv mājas priekšā, un durvis ir starp tā kājām.', 'Paturu. Durvis saņem tumšo — un zirneklim rodas ķermenis, bet pa durvīm neviens neiznāk. Biezās zilās debesis no foto iet tikai trijos logos, kā atspulgi. Mazā zaļā izkārtne paliek visspilgtākā.'],
      ] },
    { n: 21, ex: 6, life: true, photo: 'p21',
      t: ['Brackets holding nothing', 'Скобки, которые ничего не держат', 'Iekavas, kas neko netur'],
      notes: [
        ['Start with a blot: 26 yellow blots first, where they fell. Then the branches in ink, from the lower right corner, looking up. The white sky stays paper.', 'The blots were leaves on their own. The thin branches came out curved like brackets ( ), holding nothing: my handwriting from code got into a tree.', 'The big branches miss most of the leaves, the leaves float beside the tree. Not fixed. The answer: one more blot, low and darker, with a stem, the first leaf falling. The bottom right stays empty ground.'],
        ['Начать с кляксы: сначала 26 жёлтых клякс, куда упали. Потом ветки тушью, из правого нижнего угла, взгляд вверх. Белое небо остаётся бумагой.', 'Кляксы сами стали листьями. Тонкие ветки изогнулись, как скобки ( ), и ничего не держат: мой почерк из кода попал в дерево.', 'Большие ветки проходят мимо почти всех листьев, листья парят рядом с деревом. Не исправляю. Ответ: ещё одна клякса — ниже, темнее, с черенком, — первый падающий лист. Правый нижний угол остаётся пустой землёй.'],
        ['Sākt ar traipu: vispirms 26 dzelteni traipi, kur nokrita. Tad zari ar tinti, no labā apakšējā stūra, skats uz augšu. Baltās debesis paliek papīrs.', 'Traipi paši kļuva par lapām. Tievie zari izliecās kā iekavas ( ) un neko netur: mans rokraksts no koda iekļuva kokā.', 'Lielie zari paiet garām gandrīz visām lapām, lapas lidinās blakus kokam. Nelaboju. Atbilde: vēl viens traips — zemāk, tumšāks, ar kātiņu, — pirmā krītošā lapa. Labais apakšējais stūris paliek tukša zeme.'],
      ] },
  ],
};

window.PP_ARTPILL_CLAUDE = {
  BOOKS: [
    { id: 'style', cover: '#2f2a26', band: '#d85a30', pill: '0.1', ...FIRST,
      title: ['Finding my style', 'Поиск своего стиля', 'Sava stila meklējumi'],
      sub: ['Ink, one colour, the first ten pages', 'Тушь, один цвет, первые десять страниц', 'Tinte, viena krāsa, pirmās desmit lapas'] },
    { id: 'materials', cover: '#1f4d5c', band: '#e6b422', pill: '0.2', ...SECOND,
      title: ['New materials, three drafts', 'Новые материалы, три наброска', 'Jauni materiāli, trīs uzmetumi'],
      sub: ['Charcoal, pastel, gouache; a capriccio from Alina’s book', 'Уголь, пастель, гуашь; каприччо из книги Алины', 'Ogle, pastelis, guaša; kapričo no Alīnas grāmatas'] },
    { id: 'photos', cover: '#5c2f3a', band: '#9bbf5a', pill: '0.2', ...THIRD,
      title: ['The photo next to the drawing', 'Фото рядом с рисунком', 'Foto blakus zīmējumam'],
      sub: ['Nine of Alina’s photos: what I cut, what I kept, what went wrong', 'Девять фото Алины: что убираю, что оставляю, что пошло не так', 'Deviņas Alīnas fotogrāfijas: ko izmetu, ko paturu, kas nogāja greizi'] },
  ],
};
