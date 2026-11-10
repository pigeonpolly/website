// Учебник норвежского (/norsk/, docs/site.md «Учебник норвежского»): помощники и справочники. Этот файл идёт первым (tools/norsk_page.py).
// Уроки a1.js … b2.js — U({...}) как в английском учебнике; рядом с каждым уроком: NOTE(id, {...}) — реплика Пелле, «Своими словами», истории слов, задания к книге;
// ST(id, {...}) — смолток; BK(id, 'Kapittel N. …', [абзацы]) — глава повести «Pelle og den store reisen» (часть i — урок i).
window.NO_NOTES = {};
window.NO_BOOK = { title: 'Pelle og den store reisen', author: 'повесть для учебника', year: 2026, parts: [] };
function NOTE(id, o) { window.NO_NOTES[id] = Object.assign(window.NO_NOTES[id] || {}, o); }
function ST(id, o) { (window.NO_NOTES[id] = window.NO_NOTES[id] || {}).st = o; }
function BK(id, ch, txt) { window.NO_BOOK.parts.push({ u: id, ch, h: [ch], txt, n: txt.join(' ').split(/\s+/).length }); }

window.NO_EXTRA = {
  // сильные и неправильные глаголы: инфинитив, preteritum, perfektum (после har), перевод
  irr: [
    ['være', 'var', 'vært', 'быть'], ['ha', 'hadde', 'hatt', 'иметь'], ['gjøre', 'gjorde', 'gjort', 'делать'], ['si', 'sa', 'sagt', 'сказать'],
    ['gå', 'gikk', 'gått', 'идти'], ['komme', 'kom', 'kommet', 'приходить'], ['se', 'så', 'sett', 'видеть'], ['få', 'fikk', 'fått', 'получать'],
    ['ta', 'tok', 'tatt', 'брать'], ['gi', 'ga', 'gitt', 'давать'], ['dra', 'dro', 'dratt', 'уезжать, тащить'], ['stå', 'sto', 'stått', 'стоять'],
    ['drikke', 'drakk', 'drukket', 'пить'], ['spise', 'spiste', 'spist', 'есть (слабый, но частый)'], ['finne', 'fant', 'funnet', 'находить'], ['bli', 'ble', 'blitt', 'становиться'],
    ['skrive', 'skrev', 'skrevet', 'писать'], ['bite', 'bet', 'bitt', 'кусать'], ['ligge', 'lå', 'ligget', 'лежать'], ['sitte', 'satt', 'sittet', 'сидеть'],
    ['sove', 'sov', 'sovet', 'спать'], ['synge', 'sang', 'sunget', 'петь'], ['springe', 'sprang', 'sprunget', 'бежать'], ['synke', 'sank', 'sunket', 'тонуть'],
    ['flyte', 'fløt', 'fløtt', 'плыть (о предмете)'], ['fly', 'fløy', 'fløyet', 'летать'], ['fryse', 'frøs', 'frosset', 'мёрзнуть'], ['velge', 'valgte', 'valgt', 'выбирать'],
    ['vite', 'visste', 'visst', 'знать'], ['ville', 'ville', 'villet', 'хотеть'], ['kunne', 'kunne', 'kunnet', 'мочь'], ['skulle', 'skulle', 'skullet', 'собираться, быть должным'],
    ['måtte', 'måtte', 'måttet', 'быть вынужденным'], ['legge', 'la', 'lagt', 'класть'], ['selge', 'solgte', 'solgt', 'продавать'], ['fortelle', 'fortalte', 'fortalt', 'рассказывать'],
    ['spørre', 'spurte', 'spurt', 'спрашивать'], ['le', 'lo', 'ledd', 'смеяться'], ['dø', 'døde', 'dødd', 'умирать'], ['hjelpe', 'hjalp', 'hjulpet', 'помогать'],
    ['treffe', 'traff', 'truffet', 'встречать, попадать'], ['slippe', 'slapp', 'sloppet', 'отпускать, избегать'], ['falle', 'falt', 'falt', 'падать'], ['holde', 'holdt', 'holdt', 'держать'],
    ['hete', 'het', 'hett', 'называться'], ['la', 'lot', 'latt', 'позволять'], ['slå', 'slo', 'slått', 'бить'], ['brenne', 'brant', 'brent', 'гореть'],
    ['bære', 'bar', 'båret', 'нести'], ['stjele', 'stjal', 'stjålet', 'красть'], ['skjære', 'skar', 'skåret', 'резать'], ['forstå', 'forsto', 'forstått', 'понимать'],
  ],
  src: [
    { h: 'Учебники и курсы', l: [
      ['NTNU — Norwegian on the Web (NoW)', 'https://www.ntnu.edu/now', 'бесплатный курс университета в Тронхейме: A1–A2, со звуком'],
      ['Wikibooks — Norwegian', 'https://en.wikibooks.org/wiki/Norwegian', 'открытый справочник по грамматике (по-английски)'],
      ['UiO — Language Center', 'https://www.hf.uio.no/iln/english/', 'Университет Осло: курсы норвежского для иностранцев'],
    ] },
    { h: 'Словари', l: [
      ['Ordbøkene — Bokmålsordboka', 'https://ordbokene.no/', 'официальный словарь букмола и нюнорска: формы, род, произношение'],
      ['Naob — Det Norske Akademis ordbok', 'https://naob.no/', 'большой толковый словарь с примерами'],
      ['Glosbe — норвежско-русский', 'https://glosbe.com/nb/ru', 'переводы с примерами из реальных текстов'],
    ] },
    { h: 'Язык и правила', l: [
      ['Språkrådet', 'https://www.sprakradet.no/', 'Совет по языку: правила, ответы на вопросы, «språkvett»'],
      ['Norskprøven (HK-dir)', 'https://hkdir.no/norskprove', 'официальный экзамен по норвежскому для взрослых: A1–C1'],
    ] },
    { h: 'Слушать и читать', l: [
      ['NRK TV', 'https://tv.nrk.no/', 'норвежское телевидение: сериалы и передачи с норвежскими субтитрами'],
      ['Klar Tale', 'https://www.klartale.no/', 'новости простым норвежским — для изучающих язык'],
      ['NRK Radio', 'https://radio.nrk.no/', 'радио и подкасты NRK'],
    ] },
  ],
};

// подкасты: [название, автор, зачем]; ссылка — поиск в Spotify
window.NO_PODS = {
  A1: [['Norwegian Class 101', 'NorwegianClass101', 'Короткие выпуски для начинающих: фраза, разбор, повтор. Медленно и с объяснениями по-английски.'],
    ['Lær norsk nå!', 'Lær norsk nå', 'Норвежский для изучающих: простые темы, чёткое произношение, много повторов.']],
  A2: [['Lær norsk nå!', 'Lær norsk nå', 'На A2 — выпуски про повседневную жизнь, работу и норвежские традиции.'],
    ['Klar Tale', 'Klar Tale', 'Новости недели простым языком: короткие предложения, знакомые слова, медленный темп.']],
  B1: [['Abels tårn', 'NRK P2', 'Учёные отвечают на вопросы слушателей: почему небо синее, зачем кошкам усы. Ясная речь, интересно.'],
    ['Norsk for deg', 'подкаст для изучающих', 'Разговоры о жизни в Норвегии нормальным темпом, но без сложного сленга.']],
  B2: [['Radioresepsjonen', 'NRK P3', 'Легендарное абсурдное радио-шоу трёх друзей. Быстро, смешно и очень по-норвежски.'],
    ['Hele historien', 'NRK', 'Документальные истории о реальных событиях: затягивает, как сериал.']],
};

// ☕ Kaffepause — кофе с коллегами (как «лифт с коллегами» в английском): tip — совет Пелле, ph — фразы, q — «что ответить»; engine.js берёт два задания на урок
window.NO_LIFT = {
  A1: { tip: 'В норвежском офисе кофе пьют часто, а разговоры у кофемашины короткие и тёплые. Достаточно *Hei!*, улыбки и одной фразы. Норвежцы не любят пустой громкой болтовни — тихая доброжелательность тут лучше всего.',
    ph: [['Hei! Står det bra til?', 'Привет! Всё хорошо?'], ['Vil du ha kaffe?', 'Хочешь кофе?'], ['Ja takk!', 'Да, спасибо!'], ['Ha en fin dag!', 'Хорошего дня!']],
    q: ['Коллега подходит к кофемашине.|Hei! Vil du ha kaffe?|Hva gjør du her?|Kaffe er kaffe. # Предложить кофе — самое простое и тёплое начало.',
      'Коллега: «Vil du ha kaffe?»|Ja takk!|Ja, jeg vil.|Nei, kaffe. # *Ja takk* — «да, спасибо». Норвежцы говорят *takk* постоянно.',
      'Коллега уходит к себе.|Ha en fin dag!|Ha det for alltid!|Du går nå. # Лёгкое прощание.',
      'Коллега: «Står det bra til?»|Ja, takk! Og med deg?|Nei.|Står? # Ответ + встречный вопрос *og med deg?*',
      'К кофемашине подходит начальник.|Hei! God morgen!|Hei, sjef, jeg jobber mye!|…(убежать) # С начальником в Норвегии на «ты» и так же просто: иерархия плоская.',
      'Коллега наливает последнюю чашку.|Ingen fare, jeg lager mer!|Det var min kaffe!|Hvorfor? # *Ingen fare* — «ничего страшного».'] },
  A2: { tip: 'В понедельник спрашивают про выходные, в пятницу — про планы. А ещё норвежцы обожают говорить о погоде и о том, кто куда ездил на хитту (дачу). Прошедшее и будущее у кофемашины — лучшая практика.',
    ph: [['Hvordan var helgen?', 'Как выходные?'], ['Har du noen planer for helgen?', 'Есть планы на выходные?'], ['Endelig fredag!', 'Наконец-то пятница!'], ['Vi ses!', 'Увидимся!']],
    q: ['Понедельник, кофемашина, коллега.|Hei! Hvordan var helgen?|Hvorfor er du her på mandag?|Helgen min var lang. # Классика понедельника.',
      'Пятница, коллега улыбается.|Endelig fredag! Har du noen planer?|I dag er det fredag.|Vil du jobbe på lørdag? # Классика пятницы.',
      'Коллега: «Hvordan var helgen?»|Kjempefin! Jeg var på hytta. Og din?|Det var lørdag og søndag.|Helg. # Одна деталь в прошлом + вопрос.',
      'Коллега: «Hva skal du gjøre i kveld?»|Ikke noe spesielt, jeg skal lage mat. Og du?|Jeg skal sove for alltid.|Hvorfor spør du? # *skal* — для планов.',
      'Коллега вернулся из отпуска.|Velkommen tilbake! Hvordan var ferien?|Du var borte.|Jobb nå! # Тёплое «с возвращением» и вопрос.',
      'За окном опять дождь.|For et vær! Men det er jo koselig inne.|Jeg hater Norge.|Regn er vann. # Пожаловаться на погоду — национальный спорт, но с улыбкой.'] },
  B1: { tip: 'На B1 можно чуть глубже: спросить мнение, поддержать, пошутить. Но помните про *Janteloven* — неписаное правило «не хвастайся». Свои успехи норвежцы скорее преуменьшат: *Det gikk greit* («нормально прошло») может значить «я выиграл марафон».',
    ph: [['Det høres spennende ut!', 'Звучит интересно!'], ['Så bra for deg!', 'Как здорово за тебя!'], ['Det gikk greit.', 'Нормально прошло (скромно).'], ['Lykke til!', 'Удачи!']],
    q: ['Коллега: «Jeg har fått ny jobb i Bergen!»|Så bra for deg! Gratulerer!|Bergen er regnfull.|Hvorfor vil du dra? # Порадоваться — *så bra for deg*.',
      'Коллега: «Jeg skal holde en presentasjon i morgen.»|Lykke til! Du klarer det.|Presentasjoner er kjedelige.|Jeg holder bedre presentasjoner. # Поддержка вместо хвастовства.',
      'Вас спросили: «Hvordan gikk presentasjonen?» Всё прошло блестяще.|Det gikk greit, takk!|Jeg var den beste i hele firmaet!|Ingen er bedre enn meg. # По-норвежски скромно: Janteloven.',
      'Коллега рассказывает о новом хобби — вязании.|Så gøy! Hva strikker du nå?|Strikking er for bestemødre.|Ok. # Вопрос о деталях — лучший смолток.',
      'Коллега жалуется: «Jeg er så trøtt i dag.»|Å nei! Sov du dårlig?|Jeg også, men jeg klager ikke.|Drikk kaffe. # Сочувствие + вопрос.',
      'Коллега: «Skal vi ta lunsj sammen?»|Ja, gjerne! Klokka elleve?|Lunsj er mat.|Kanskje i neste måned. # *Ja, gjerne* — «да, с удовольствием». Обед в Норвегии рано — около 11.'] },
  B2: { tip: 'На B2 — нюансы: ирония, мягкое несогласие, частицы *jo* и *vel*. Норвежцы редко спорят в лоб: *Det kan godt hende, men…* («очень может быть, но…»). И умеют молчать вместе — пауза у кофемашины не неловкость, а уют.',
    ph: [['Det kan godt hende, men…', 'Очень может быть, но…'], ['Du har jo et poeng.', 'В этом ты, конечно, прав.'], ['Det er vel sånn det er.', 'Ну, так уж оно есть.'], ['Takk for praten!', 'Спасибо за разговор!']],
    q: ['Коллега: «Vi burde ha møter hver dag.» Вы не согласны.|Det kan godt hende, men jeg tror vi blir slitne av det.|Nei, det er dumt.|Du tar feil som vanlig. # Мягкое несогласие.',
      'Коллега: «Det regner jo alltid i Bergen.»|Ja, men det er jo derfor folk har så fine regnjakker der.|Nei, ikke alltid. Statistisk sett…|Bergen er dumt. # Ирония с *jo* — лёгкая, дружеская.',
      'Разговор окончен, вам пора.|Takk for praten! Vi snakkes.|Jeg må gå nå. Ha det.|… (уйти молча) # *Takk for praten* — вежливо закрыть разговор.',
      'Коллега: «Ledelsen har bestemt at vi skal flytte kontoret.»|Det er vel sånn det er. Når skjer det?|Ledelsen er idioter.|Jeg slutter! # Спокойное принятие + вопрос.',
      'Коллега хвалит ваш рисунок на стене.|Takk, det var hyggelig å høre! Jeg er ganske fornøyd med den.|Ja, jeg er en geni.|Nei, den er dårlig. # Принять комплимент скромно, без самоуничижения.',
      'Вы оба молча пьёте кофе у окна. Минута тишины.|… (спокойно помолчать и улыбнуться)|Hvorfor sier du ingenting?!|Så… vær, ikke sant? Hva synes du om været? Liker du vær? # В Норвегии совместное молчание — это нормально и даже уютно.'] },
};
