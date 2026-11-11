// Учебник нидерландского (/nederlands/, docs/site.md «Учебник нидерландского»): помощники и справочники. Этот файл — первым, до уроков.
// Уроки a1.js … c2.js — U({...}) как в английском учебнике; рядом с каждым уроком: NOTE(id, {...}) — реплика Йопа, свои предложения, истории слов, глава книги;
// ST(id, {...}) — смолток; BK(id, 'Hoofdstuk N. …', [абзацы]) — глава повести «Joop en de grote fietstocht» (с C1 — «Joop over de grens»).
window.NL_NOTES = {};
window.NL_BOOK = { title: 'Joop en de grote fietstocht', author: 'повесть для учебника', year: 2026, parts: [] };
function NOTE(id, o) { window.NL_NOTES[id] = Object.assign(window.NL_NOTES[id] || {}, o); }
function ST(id, o) { (window.NL_NOTES[id] = window.NL_NOTES[id] || {}).st = o; }
window.NL_TOPICS = {};
function TOP(id, o) { window.NL_TOPICS[id] = o; } // тематический словарь урока: {t: тема, ic: значок, w: [[слово, перевод, пример]]}
function SR(id, a) { NOTE(id, { sr: a }); } // сцены в духе шоу к уроку (series.js): добавляются к u.series
function BK(id, ch, txt) { window.NL_BOOK.parts.push({ u: id, ch, h: [ch], txt, n: txt.join(' ').split(/\s+/).length }); }

window.NL_EXTRA = {
  // сильные и неправильные глаголы: инфинитив, imperfectum (ед./мн.), причастие perfectum, перевод (zijn — perfectum через is/zijn, z/h — бывает и так, и так)
  irr: [
    ['zijn', 'was/waren', 'geweest', 'быть (zijn)'], ['hebben', 'had/hadden', 'gehad', 'иметь'], ['gaan', 'ging/gingen', 'gegaan', 'идти, ехать (zijn)'], ['komen', 'kwam/kwamen', 'gekomen', 'приходить (zijn)'],
    ['doen', 'deed/deden', 'gedaan', 'делать'], ['zien', 'zag/zagen', 'gezien', 'видеть'], ['zeggen', 'zei/zeiden', 'gezegd', 'сказать'], ['krijgen', 'kreeg/kregen', 'gekregen', 'получать'],
    ['geven', 'gaf/gaven', 'gegeven', 'давать'], ['nemen', 'nam/namen', 'genomen', 'брать'], ['eten', 'at/aten', 'gegeten', 'есть'], ['drinken', 'dronk/dronken', 'gedronken', 'пить'],
    ['lezen', 'las/lazen', 'gelezen', 'читать'], ['schrijven', 'schreef/schreven', 'geschreven', 'писать'], ['spreken', 'sprak/spraken', 'gesproken', 'говорить'], ['kijken', 'keek/keken', 'gekeken', 'смотреть'],
    ['vinden', 'vond/vonden', 'gevonden', 'находить, считать'], ['zitten', 'zat/zaten', 'gezeten', 'сидеть'], ['liggen', 'lag/lagen', 'gelegen', 'лежать'], ['staan', 'stond/stonden', 'gestaan', 'стоять'],
    ['slapen', 'sliep/sliepen', 'geslapen', 'спать'], ['lopen', 'liep/liepen', 'gelopen', 'идти пешком (z/h)'], ['rijden', 'reed/reden', 'gereden', 'ехать (z/h)'], ['vliegen', 'vloog/vlogen', 'gevlogen', 'летать (z/h)'],
    ['zwemmen', 'zwom/zwommen', 'gezwommen', 'плавать (z/h)'], ['blijven', 'bleef/bleven', 'gebleven', 'оставаться (zijn)'], ['worden', 'werd/werden', 'geworden', 'становиться (zijn)'], ['beginnen', 'begon/begonnen', 'begonnen', 'начинать (zijn)'],
    ['vallen', 'viel/vielen', 'gevallen', 'падать (zijn)'], ['sterven', 'stierf/stierven', 'gestorven', 'умирать (zijn)'], ['vertrekken', 'vertrok/vertrokken', 'vertrokken', 'уезжать (zijn)'], ['kopen', 'kocht/kochten', 'gekocht', 'покупать'],
    ['denken', 'dacht/dachten', 'gedacht', 'думать'], ['brengen', 'bracht/brachten', 'gebracht', 'приносить'], ['zoeken', 'zocht/zochten', 'gezocht', 'искать'], ['weten', 'wist/wisten', 'geweten', 'знать'],
    ['kunnen', 'kon/konden', 'gekund', 'мочь'], ['willen', 'wilde/wilden', 'gewild', 'хотеть'], ['mogen', 'mocht/mochten', 'gemogen', 'иметь право'], ['moeten', 'moest/moesten', 'gemoeten', 'быть должным'],
    ['zullen', 'zou/zouden', '—', 'будет / бы'], ['laten', 'liet/lieten', 'gelaten', 'позволять, оставлять'], ['houden', 'hield/hielden', 'gehouden', 'держать; houden van — любить'], ['helpen', 'hielp/hielpen', 'geholpen', 'помогать'],
    ['vragen', 'vroeg/vroegen', 'gevraagd', 'спрашивать'], ['dragen', 'droeg/droegen', 'gedragen', 'носить'], ['lachen', 'lachte/lachten', 'gelachen', 'смеяться'], ['zingen', 'zong/zongen', 'gezongen', 'петь'],
    ['winnen', 'won/wonnen', 'gewonnen', 'выигрывать'], ['verliezen', 'verloor/verloren', 'verloren', 'терять, проигрывать'], ['vergeten', 'vergat/vergaten', 'vergeten', 'забывать (z/h)'], ['begrijpen', 'begreep/begrepen', 'begrepen', 'понимать'],
    ['kiezen', 'koos/kozen', 'gekozen', 'выбирать'], ['trekken', 'trok/trokken', 'getrokken', 'тянуть'], ['wassen', 'waste/wasten', 'gewassen', 'мыть'], ['bakken', 'bakte/bakten', 'gebakken', 'печь, жарить'],
  ],
  src: [
    { h: 'Учебники и курсы', l: [
      ['Wikibooks — Dutch', 'https://en.wikibooks.org/wiki/Dutch', 'открытый учебник грамматики по-английски: уроки, таблицы, упражнения'],
      ['DutchGrammar.com', 'https://www.dutchgrammar.com/', 'подробная грамматика с примерами и упражнениями (по-английски)'],
      ['Taalunie — Nederlands leren', 'https://taalunie.org/', 'Нидерландский языковой союз (Нидерланды, Фландрия, Суринам): нормы и материалы'],
    ] },
    { h: 'Словари', l: [
      ['Van Dale', 'https://www.vandale.nl/', 'главный толковый словарь нидерландского'],
      ['Woordenlijst (Het Groene Boekje)', 'https://woordenlijst.org/', 'официальное написание и артикли: de или het — смотреть здесь'],
      ['Glosbe — нидерландско-русский', 'https://glosbe.com/nl/ru', 'переводы с примерами из реальных текстов'],
    ] },
    { h: 'Язык и правила', l: [
      ['Onze Taal', 'https://onzetaal.nl/', 'общество любителей языка: ответы на вопросы «как правильно»'],
      ['Taaladvies.net', 'https://taaladvies.net/', 'языковые советы Taalunie: спорные случаи, правописание'],
      ['DUO — Inburgeringsexamen', 'https://www.inburgeren.nl/', 'официальный экзамен для живущих в Нидерландах (A1–B1)'],
    ] },
    { h: 'Слушать и читать', l: [
      ['NPO Start', 'https://npo.nl/start', 'нидерландское общественное телевидение: передачи с субтитрами'],
      ['NOS Jeugdjournaal', 'https://jeugdjournaal.nl/', 'новости для детей — простой язык, короткие тексты'],
      ['VRT NWS', 'https://www.vrt.be/vrtnws/nl/', 'фламандские новости: как звучит бельгийский нидерландский'],
    ] },
  ],
};

// подкасты: [название, автор, зачем]; ссылка — поиск в Spotify
window.NL_PODS = {
  A1: [['DutchPod101', 'DutchPod101', 'Короткие выпуски для начинающих: фраза, разбор, повтор. Медленно и по-английски.'],
    ['Learn Dutch with Bart de Pau', 'Bart de Pau', 'Учитель из Нидерландов: произношение, первые фразы, частые ошибки.']],
  A2: [['DutchPod101', 'DutchPod101', 'На A2 — диалоги о повседневной жизни: магазин, работа, выходные. Чётко и не спеша.'],
    ['NOS Jeugdjournaal', 'NOS', 'Новости для детей: короткие фразы, понятные темы, нормальная скорость.']],
  B1: [['Echt Gebeurd', 'Echt Gebeurd', 'Люди рассказывают реальные истории из жизни — живой язык, по 10–15 минут.'],
    ['De Taalstaat', 'NPO Radio 1', 'Передача о самом языке: новые слова, споры о правилах, ответы слушателям.']],
  B2: [['De Dag', 'NOS', 'Одна новость дня, глубоко и подробно: 20 минут нормальной нидерландской речи.'],
    ['Man man man', 'Man man man', 'Разговорное шоу: юмор, споры и быстрая речь.']],
  C1: [['Betrouwbare Bronnen', 'подкаст', 'Длинные разговоры о политике и истории: сложные мысли и богатый язык.'],
    ['De Correspondent', 'De Correspondent', 'Журналистика и эссе вслух: аргументация, регистр, длинные предложения.']],
  C2: [['Damn, Honey', 'подкаст', 'Очень быстрая живая речь, сленг, ирония — для удовольствия.'],
    ['Radio Tour de France', 'NPO Radio 1', 'Велосипед и культура в одном: юмор, отступления, игра слов. Йоп одобряет.']],
};

// 🚲 Bij het fietsenrek — у велопарковки у работы (как «лифт с коллегами» в английском): tip — совет Йопа, ph — фразы, q — «что ответить»; engine.js берёт два задания на урок
window.NL_LIFT = {
  A1: { tip: 'У велопарковки утром — короткие и прямые разговоры. Достаточно *Hoi!*, улыбки и одной фразы. Голландцы не любят долгих вступлений: сказали — поехали. Мокрый? Это норма, обсуждать необязательно, но можно.',
    ph: [['Hoi! Hoe gaat het?', 'Привет! Как дела?'], ['Goed, en met jou?', 'Хорошо, а у тебя?'], ['Wat een weer, hè!', 'Ну и погода, а!'], ['Fijne dag!', 'Хорошего дня!']],
    q: ['Коллега пристёгивает велосипед рядом.|Hoi! Hoe gaat het?|Wat doe jij hier?|Fiets is fiets. # Простое и тёплое начало.',
      'Коллега: «Hoe gaat het?»|Goed, en met jou?|Ja, ik ben.|Nee, fiets. # Ответ + встречный вопрос *en met jou?*',
      'Вы оба мокрые после дождя.|Wat een weer, hè!|Ik haat Nederland.|Regen is water. # Пожаловаться на погоду — национальный спорт, но с улыбкой.',
      'Коллега уходит в офис.|Fijne dag!|Dag voor altijd!|Jij gaat nu. # Лёгкое прощание.',
      'У велопарковки — начальница.|Goedemorgen!|Hallo baas, ik werk veel!|…(уехать обратно) # С начальством в Нидерландах просто: иерархия плоская.',
      'Ваш велосипед упал на велосипед коллеги.|Oeps, sorry!|Dat is jouw fiets.|Waarom? # *Sorry* и *oeps* — здесь тоже понимают.'] },
  A2: { tip: 'В понедельник спрашивают про выходные, в пятницу — про планы. Голландцы планируют всё заранее, даже свободное время: «давай кофе через три недели» — нормальное предложение.',
    ph: [['Hoe was je weekend?', 'Как выходные?'], ['Heb je plannen voor het weekend?', 'Есть планы на выходные?'], ['Eindelijk vrijdag!', 'Наконец-то пятница!'], ['Tot morgen!', 'До завтра!']],
    q: ['Понедельник, велопарковка, коллега.|Hoi! Hoe was je weekend?|Waarom ben je hier op maandag?|Mijn weekend was lang. # Классика понедельника.',
      'Пятница, коллега улыбается.|Eindelijk vrijdag! Heb je plannen?|Vandaag is het vrijdag.|Werk je zaterdag? # Классика пятницы.',
      'Коллега: «Hoe was je weekend?»|Heel leuk! Ik ben naar het strand gefietst. En jij?|Het was zaterdag en zondag.|Weekend. # Одна деталь в прошлом + вопрос.',
      'Коллега: «Wat ga je vanavond doen?»|Niks bijzonders, ik ga koken. En jij?|Ik ga voor altijd slapen.|Waarom vraag je dat? # gaan + инфинитив — для планов.',
      'Коллега вернулась из отпуска.|Welkom terug! Hoe was de vakantie?|Je was weg.|Werk nu! # Тёплое «с возвращением» и вопрос.',
      'У коллеги спустило колесо.|Balen! Zal ik even helpen?|Fietsen zijn dom.|Loop dan. # *Balen!* — «досада!»: очень голландское слово.'] },
  B1: { tip: 'На B1 можно чуть глубже: спросить мнение, поддержать, пошутить. Голландцы говорят прямо, но без злобы: *Eerlijk gezegd…* («честно говоря…») — и дальше правду. Принимайте её спокойно — и отвечайте так же.',
    ph: [['Dat klinkt leuk!', 'Звучит здорово!'], ['Wat goed van je!', 'Как здорово (за тебя)!'], ['Eerlijk gezegd…', 'Честно говоря…'], ['Succes!', 'Удачи!']],
    q: ['Коллега: «Ik heb een nieuwe baan in Utrecht!»|Wat goed van je! Gefeliciteerd!|Utrecht is saai.|Waarom ga je weg? # Порадоваться — *wat goed van je*.',
      'Коллега: «Ik moet morgen een presentatie geven.»|Succes! Je kunt het.|Presentaties zijn saai.|Ik geef betere presentaties. # Поддержка.',
      'Коллега спрашивает, нравится ли вам её новая куртка. Не очень.|Eerlijk gezegd vind ik de kleur niet zo mooi, maar hij lijkt me warm.|Ja, prachtig!|Lelijk. # Честно, но мягко — по-голландски.',
      'Коллега рассказывает о новом хобби — гончарном деле.|Wat leuk! Wat maak je nu?|Dat is voor oma\'s.|Oké. # Вопрос о деталях — лучший смолток.',
      'Коллега жалуется: «Ik ben zo moe vandaag.»|Ah, slecht geslapen?|Ik ook, maar ik klaag niet.|Drink koffie. # Сочувствие + вопрос.',
      'Коллега: «Zullen we samen lunchen?»|Ja, gezellig! Om twaalf uur?|Lunch is eten.|Misschien volgende maand. # Обед в Нидерландах — бутерброд в 12, без церемоний.'] },
  B2: { tip: 'На B2 — нюансы: частицы *toch*, *wel*, *even*, мягкое несогласие. *Daar heb je een punt, maar…* — «тут ты прав, но…». Голландцы любят спорить по существу и не обижаются на «нет».',
    ph: [['Daar heb je een punt, maar…', 'Тут ты прав, но…'], ['Dat is toch logisch?', 'Это же логично?'], ['Het is wat het is.', 'Что есть, то есть.'], ['Leuk je gesproken te hebben!', 'Рад(а) была поговорить!']],
    q: ['Коллега: «We moeten elke dag vergaderen.» Вы не согласны.|Daar heb je een punt, maar ik denk dat het te veel is.|Nee, dat is dom.|Jij hebt altijd ongelijk. # Мягкое несогласие.',
      'Коллега: «Het regent alweer.»|Ja, maar dat is toch ook waarom we zo goede regenjassen hebben.|Nee, gisteren niet.|Regen is dom. # Ирония с *toch*.',
      'Разговор окончен, вам пора.|Leuk je gesproken te hebben! Tot later.|Ik moet nu gaan. Doei.|… (уйти молча) # Вежливо закрыть разговор.',
      'Коллега: «Het management wil het kantoor verhuizen.»|Het is wat het is. Wanneer gebeurt het?|Het management is gek.|Ik stop! # Спокойное принятие + вопрос.',
      'Коллега хвалит ваш рисунок на стене.|Dank je, leuk om te horen! Ik ben er wel tevreden over.|Ja, ik ben een genie.|Nee, hij is lelijk. # Принять комплимент спокойно.',
      'Коллега: «Kun je even helpen?»|Ja hoor, waarmee?|Even? Hoe lang is even?|Nee. # *even* — «на минутку», вежливо смягчает просьбу.'] },
  C1: { tip: 'На C1 у велопарковки обсуждают новости, жильё (вечная тема!) и работу. Ценится взвешенность: *Ik snap wat je bedoelt, maar…* и *Het ligt eraan.* Сарказм — можно, но с улыбкой.',
    ph: [['Ik snap wat je bedoelt, maar…', 'Понимаю, о чём ты, но…'], ['Het ligt eraan.', 'Смотря как.'], ['Nu overdrijf je een beetje.', 'Ну, тут ты немного преувеличиваешь.'], ['Dat is een ander verhaal.', 'Это другой разговор.']],
    q: ['Коллега: «Thuiswerken is onzin.» Вы не согласны.|Ik snap wat je bedoelt, maar voor mij werkt het eigenlijk prima.|Je bent ouderwets.|Onzin is onzin. # Взвешенное несогласие.',
      'Коллега: «Is het slim om te verhuizen?»|Het ligt eraan wat we ervoor terugkrijgen.|Ja. Nee. Misschien.|Kan me niet schelen. # «Смотря как» — нюанс.',
      'Коллега: «Ik ben de enige die hier werkt!»|Nu overdrijf je een beetje, maar ik snap dat je moe bent.|Ja, jij bent onze held.|Nee, jij werkt het minst. # Мягко осадить с юмором.',
      'Разговор ушёл в политику, а вам пора на встречу.|Interessant onderwerp! Laten we het er later over hebben.|Politiek is saai.|Ik ga. # Вежливо закрыть тему.',
      'Коллега рассказывает о проблеме с проектом.|Balen! Kan ik ergens mee helpen?|Dat is jouw probleem.|Projecten gaan altijd mis. # Предложить помощь.',
      'Коллега: «Heb je het nieuwe rapport gelezen?» Вы не читали.|Nog niet, maar het staat bovenaan mijn lijstje.|Nee, rapporten zijn saai.|Welk rapport? Waarom? # Честно и вежливо.'] },
  C2: { tip: 'На C2 вы уже свой: можно иронизировать и преуменьшать по-голландски. *Niet slecht!* о блестящей работе, *Het had erger gekund* о катастрофе. И помните: *Doe normaal, dan doe je al gek genoeg* — «веди себя нормально, это и так достаточно странно».',
    ph: [['Niet slecht!', 'Неплохо! (= великолепно)'], ['Het had erger gekund.', 'Могло быть и хуже.'], ['Typisch maandag.', 'Типичный понедельник.'], ['We zien wel.', 'Посмотрим.']],
    q: ['Коллега показывает блестящую презентацию.|Niet slecht, hè!|Hij is perfect en ik hou van je!|Mwah. Volgende. # Голландская похвала — сдержанная.',
      'Кофеавтомат сломался в третий раз за неделю.|Typisch. Het had erger gekund — het had maandag kunnen zijn.|Ik neem ontslag!|Bel de politie! # Сухой юмор.',
      'Коллега: «Denk je dat we dit jaar een bonus krijgen?»|We zien wel. Ik reken er niet op.|Ja, we worden allemaal rijk.|Bonus? Wat is dat? # Трезво и с иронией.',
      'Коллега хвастается новой машиной.|Mooie auto! Maar je fietst toch gewoon?|Ik heb een betere.|Auto\'s vervuilen. # Лёгкая ирония без зависти.',
      'Начальница: «We moeten deze week een beetje extra werken.»|Nou, de schouders eronder dan.|Nee, ik heb vakantie.|Waarom altijd wij? # «Подставим плечи» — с улыбкой.',
      'Коллега: «Ik heb drie nachten niet geslapen.»|Dan begrijp ik waarom je mail zo creatief was.|Dat is jouw probleem.|Ik slaap altijd goed. # Мягкая ирония и сочувствие.'] },
};
