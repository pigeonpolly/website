// Уровень A1 — с нуля: звуки, «быть», presens, de и het, порядок слов, niet и geen. Формат — docs/site.md «Учебник английского» (тот же движок).

U({
  id: 'a1-1', lvl: 'A1', t: 'Звуки и «Hoi!»', en: 'Het alfabet en de uitspraak',
  goals: ['читать *ui, ij/ei, oe, eu, uu* и хриплое *g*', 'здороваться, прощаться и благодарить', 'представиться: *Ik heet …*'],
  th: `<p>Нидерландский — германский язык, «средний брат» между английским и немецким. На нём говорят в Нидерландах, во Фландрии (север Бельгии) и в Суринаме. Мы учим стандарт Нидерландов; где во Фландрии говорят иначе — будет пометка 🇧🇪.</p>
  <h4>Буквы те же, звуки — свои</h4>
  <div class="tbl"><table><thead><tr><th>Буквы</th><th>Как звучит</th><th>Пример</th></tr></thead><tbody>
  <tr><td><b>g, ch</b></td><td>хриплое «х» из горла, как в «хлеб», но глубже</td><td><i>goed</i> [хут] — хорошо, <i>lachen</i> — смеяться</td></tr>
  <tr><td><b>ui</b></td><td>«а» + «ю» слитно, губы округлены; в русском такого нет</td><td><i>huis</i> — дом, <i>uit</i> — из</td></tr>
  <tr><td><b>ij</b> = <b>ei</b></td><td>«эй» (одинаково!)</td><td><i>mijn</i> — мой, <i>klein</i> — маленький</td></tr>
  <tr><td><b>oe</b></td><td>«у»</td><td><i>boek</i> [бук] — книга, <i>goed</i></td></tr>
  <tr><td><b>eu</b></td><td>как немецкое ö: губы для «о», язык для «э»</td><td><i>leuk</i> — классный, <i>neus</i> — нос</td></tr>
  <tr><td><b>u, uu</b></td><td>«ю» с вытянутыми губами</td><td><i>u</i> — вы, <i>duur</i> — дорогой</td></tr>
  <tr><td><b>w</b></td><td>между «в» и английским w</td><td><i>water</i>, <i>wij</i> — мы</td></tr>
  <tr><td><b>sch</b></td><td>«с» + хриплое «х»</td><td><i>school</i> [схол], <i>Scheveningen</i></td></tr></tbody></table></div>
  <h4>Долгий и короткий звук</h4>
  <p>Двойная гласная — долгая: <i>maan</i> (луна), <i>boom</i> (дерево). Одна гласная в конце слога — тоже долгая: <i>ma-ken</i>, <i>bo-men</i>. Одна гласная перед согласной в том же слоге — короткая: <i>man</i>, <i>bom</i>. Поэтому на письме буквы то удваиваются, то нет — это одно правило, а не хаос.</p>
  <p><b>-en</b> в конце слова: <i>n</i> в обычной речи почти не слышно — <i>praten</i> [пратэ].</p>
  <h4>Первые фразы</h4>
  <p><i>Hallo!</i> / <i>Hoi!</i> — привет. <i>Goedemorgen!</i> — доброе утро. <i>Dag!</i> — и «здравствуйте», и «до свидания». <i>Doei!</i> — пока. <i>Tot straks!</i> — до скорого. <i>Dank je wel!</i> — спасибо. <i>Ik heet …</i> — меня зовут … <i>Hoe heet je?</i> — как тебя зовут?</p>
  <p><b>jij / je</b> — «ты» (с друзьями, коллегами, ровесниками). <b>u</b> — «вы» (незнакомые старшие, официально). Голландцы переходят на «ты» быстро, но с бабушкой в магазине лучше начать с <i>u</i>: <i>Dank u wel!</i></p>`,
  simple: 'g — хриплое «х». ij и ei — «эй». oe — «у». ui — свой звук, слушайте 🔊. Двойная гласная — долгая. jij — ты, u — вы.',
  exm: [['Hoi! Ik heet Alina.', 'Привет! Меня зовут Алина.'], ['Hoe heet je?', 'Как тебя зовут?'], ['Dank je wel!', 'Большое спасибо!'], ['Goedemorgen! Fijne dag!', 'Доброе утро! Хорошего дня!']],
  conf: [['*dank je* / *dank u*', '<i>Dank je</i> — «спасибо» на «ты», <i>dank u</i> — на «вы». <i>wel</i> в конце делает спасибо теплее.', 'Пожилая дама уступила место. Что сказать?|Dank u wel!|Dank je, joh!|Doei! # Незнакомому старшему — на «вы».'],
    ['*ij* / *ui*', '<i>ij</i> — «эй»: <i>wijn</i> (вино). <i>ui</i> — округлённый звук: <i>ui</i> (лук), <i>huis</i> (дом).', 'Какое слово читается с «эй»?|tijd|tuin|toen # ij = ei = «эй».']],
  words: [['hallo', 'привет', 'Hallo! Hoe gaat het?'], ['doei', 'пока', 'Doei, tot morgen!'], ['dank je wel', 'спасибо', 'Dank je wel voor de koffie!'], ['ja', 'да', 'Ja, ik heet Joop.'], ['nee', 'нет', 'Nee, dank je.'], ['sorry', 'извините', 'Sorry, hoe heet je?'], ['goedemorgen', 'доброе утро', 'Goedemorgen, mama!'], ['welterusten', 'спокойной ночи', 'Welterusten en slaap lekker!'], ['leuk', 'классно, приятно', 'Leuk je te ontmoeten!'], ['heten', 'называться, зваться', 'Ik heet Alina.']],
  ex: [
    { t: 'choice', h: 'Как это читается?', q: ['*goed* (хорошо) начинается со звука…|хриплого «х»|«г»|«дж» # g — хриплое «х».', '*boek* читается…|[бук]|[боэк]|[бэк] # oe — «у».', '*mijn* (мой) читается…|[мэйн]|[миjн]|[мин] # ij — «эй».', '*klein* и *mijn*: гласные…|одинаковые|разные|в klein долгое «и» # ij и ei звучат одинаково.', '*school* читается…|[схол]|[школ]|[скул] # sch — «с» + хриплое «х».', 'В слове *maan* (луна) гласная…|долгая|короткая|не читается # Двойная гласная — долгая.'] },
    { t: 'gap', h: 'Вставьте слово.', q: ['Hoi! Ik ___ Joop.|heet # Ik heet — меня зовут.', 'Hoe heet ___? (ты)|je/jij', 'Dank je ___!|wel', 'Goede___! (утро)|morgen', 'Tot ___! (до скорого)|straks', '___, hoe heet je? (извините)|Sorry/Pardon'] },
    { t: 'order', q: ['Ik heet Alina.', 'Hoe heet je?', 'Dank je wel voor de koffie.', 'Leuk je te ontmoeten.', 'Fijne dag.', 'Goedemorgen en dank je wel.'] },
    { t: 'tr', q: ['Привет!|Hoi!|Hallo!|Hoi hoi!', 'Спасибо!|Dank je!|Dank je wel!|Bedankt!|Dank u wel!|Dank u!', 'Меня зовут Йоп.|Ik heet Joop.|Mijn naam is Joop.', 'Как тебя зовут?|Hoe heet je?|Hoe heet jij?|Wat is je naam?', 'Пока!|Doei!|Dag!|Tot ziens!|Doeg!'] },
  ],
  read: {
    title: 'Hoi, ik ben Joop!', intro: 'Первый текст. Слушайте 🔊 и читайте вслух — особенно слова с g, ui, ij.',
    txt: ['Hoi! Ik heet Joop. Ik ben een meeuw. Ik woon in Scheveningen, aan zee.', 'Ik hou van patat en zon. Ik hou niet van regen, maar het regent vaak in Scheveningen.', 'Hoe heet jij? Leuk je te ontmoeten! Fijne dag!'],
    gl: { 'meeuw': 'чайка', 'woon': 'живу', 'aan zee': 'у моря', 'ik hou van': 'я люблю', 'patat': 'картошка фри', 'zon': 'солнце', 'regen': 'дождь', 'maar': 'но', 'het regent': 'идёт дождь', 'vaak': 'часто' },
    q: [{ t: 'tf', q: ['Joop is een meeuw.|T', 'Joop woont in Amsterdam.|F # Hij woont in Scheveningen.', 'Joop houdt van patat.|T', 'Joop houdt van regen.|F # Ik hou niet van regen.'] },
      { t: 'choice', q: ['Waar woont Joop?|in Scheveningen|in Utrecht|in Riga', 'Waar houdt Joop van?|patat en zon|regen en wind|thee en kaas'] }],
  },
  series: [{ show: 'typisch', who: 'типично голландское', q: 'Doei!', mean: '«Пока!» — лёгкое, дружеское прощание. Часто удваивают: <i>doei doei!</i>', fun: '<i>Doei</i> говорят друзьям, коллегам и даже кассиру. А вот <i>Dag!</i> работает в обе стороны: им и здороваются, и прощаются. Входите в магазин — <i>Dag!</i>, выходите — <i>Dag!</i> Удобно, экономно — очень по-голландски.', use: 'Doei! Tot morgen!', qz: 'Кассир говорит вам «Dag!», когда вы уходите. Что это значит?|«До свидания!»|«День!» (о погоде)|«Давай ещё!» # Dag — и привет, и пока.' }],
  write: { h: 'Представьтесь 2–3 короткими фразами по образцу: Ik heet … Ik woon in … Ik hou van …', min: 8, use: ['hoi', 'ik heet', 'ik woon', 'ik hou van'],
    plan: ['Поздоровайтесь.', 'Ik heet …', 'Ik woon in …', 'Ik hou van … (кофе, книги, море)'],
    model: 'Hoi! Ik heet Anna.\nIk woon in Riga.\nIk hou van koffie en boeken.\nLeuk je te ontmoeten!' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch pronunciation g ui ij'], ['DutchPod101', 'Dutch alphabet pronunciation'], ['DutchPod101', 'basic Dutch greetings']],
  fact: 'Говорят, во время Второй мировой по слову *Scheveningen* отличали голландцев от чужих: правильно произнести *sch* и *g* у немцев почти не выходило. Правда это или легенда — спорят, но слово с тех пор самое знаменитое «испытание на произношение». Йоп родом именно оттуда и очень этим гордится.',
  src: [['Wikibooks — Dutch', 'https://en.wikibooks.org/wiki/Dutch'], ['DutchGrammar.com', 'https://www.dutchgrammar.com/'], ['Woordenlijst', 'https://woordenlijst.org/']],
});
NOTE('a1-1', {
  crow: '*Hoi.* Я Йоп, чайка. По-нидерландски — *meeuw*. Сегодня звуки. Хриплое *g* — это не простуда, это нидерландский. Хотя одно другому не мешает: тут всегда дует.',
  mk: ['Представьтесь: напишите, как вас зовут и что вы любите.|heet;hou van|Hoi! Ik heet Alina en ik hou van koffie.', 'Напишите, где вы живёте.|woon|Ik woon in Riga.', 'Поблагодарите друга за кофе и пожелайте хорошего дня.|dank|Dank je wel voor de koffie! Fijne dag!'],
  etym: [['dank', 'родня английского *thanks* и немецкого *Dank*. Все от древнего слова «мысль»: благодарить — значит «помнить о ком-то».'], ['meeuw', 'родня английского *mew* (так когда-то звали чайку) и немецкого *Möwe*. Назвали, похоже, по крику. Йоп считает, что по красоте голоса.']],
  ru: 'Знакомимся с героем повести. Чайка Йоп живёт в Схевенингене, у моря. Он любит картошку фри и солнце, а дождь — нет. Но дождь там идёт часто.',
  gl: { 'meeuw': 'чайка', 'strand': 'пляж', 'klein': 'маленький', 'groot': 'большой', 'zee': 'море', 'patat': 'картошка фри', 'regen': 'дождь', 'duinen': 'дюны', 'denkt': 'думает' },
  tf: ['Joop woont aan zee.|T # Joop woont in Scheveningen, aan zee.', 'Joop houdt van regen.|F # Hij houdt niet van regen.', 'Joop ziet elke dag de zee.|T'],
  ch: ['Wat vraagt Joop?|Wat is er achter de duinen?|Waar is mijn patat?|Hoe laat is het? # «Wat is er achter de duinen?» denkt Joop.'],
  bmk: ['Что вы видите каждый день из окна? Одно предложение: *Ik zie …*|zie|Ik zie een groot park en veel bomen.'],
  etb: '*Duin* — дюна. Слово голландское: английское *dune* пришло из нидерландского через французский. Дюны в Нидерландах — не декорация, а защита от моря. Без них половина страны была бы аквариумом.',
});
ST('a1-1', { t: 'Привет и «Hoe gaat het?»', tip: '*Hoe gaat het?* — «как идёт?» — это просто «как дела?». Отвечают коротко: *Goed, en met jou?* Голландцы честные: если плохо, могут сказать *niet zo goed* — и это нормально.',
  sit: 'Сосед на лестнице утром.', ph: [['Hoi! Hoe gaat het?', 'Привет! Как дела?'], ['Goed, en met jou?', 'Хорошо, а у тебя?'], ['Prima!', 'Отлично!'], ['Fijne dag!', 'Хорошего дня!']],
  dlg: ['Сосед: «Hoi! Hoe gaat het?» Как ответить естественно?|Goed, en met jou?|Ik heb hoofdpijn en mijn kat is ziek en de fiets is kapot.|Ja. # Короткий ответ и встречный вопрос.', 'Сосед: «Fijne dag!»|Dank je, jij ook!|Waarom?|Nee, dank je. # *Jij ook* — «и тебе».'],
  mk: 'Напишите мини-диалог: вас спросили *Hoe gaat het?* — ответьте и спросите в ответ.|goed;met jou|Goed, dank je! En met jou?' });
BK('a1-1', 'Hoofdstuk 1. Joop in Scheveningen', ['Dit is Joop. Joop is een meeuw. Hij woont in Scheveningen. Scheveningen ligt aan zee.', 'Het strand is groot. De zee is groot. Joop is klein, maar hij is heel luid.', 'Joop houdt van patat. Hij houdt niet van regen. Maar in Scheveningen is er veel regen!', 'Elke dag ziet Joop de zee en de duinen. «Wat is er achter de duinen?» denkt Joop.']);

U({
  id: 'a1-2', lvl: 'A1', t: 'Местоимения и «быть»: ik ben', en: 'Persoonlijke voornaamwoorden en «zijn»',
  goals: ['говорить, кто вы и откуда: *Ik kom uit Letland*', 'знать все личные местоимения', 'спрягать *zijn* (быть) и *hebben* (иметь)'],
  th: `<p>В нидерландском глагол меняется по лицам — но не так сильно, как в русском. А два самых нужных глагола, <b>zijn</b> (быть) и <b>hebben</b> (иметь), неправильные: их просто запоминаем.</p>
  <div class="tbl"><table><thead><tr><th>Местоимение</th><th>Перевод</th><th>zijn (быть)</th><th>hebben (иметь)</th></tr></thead><tbody>
  <tr><td><i>ik</i></td><td>я</td><td><i>ik ben</i></td><td><i>ik heb</i></td></tr>
  <tr><td><i>jij / je</i></td><td>ты</td><td><i>jij bent</i></td><td><i>jij hebt</i></td></tr>
  <tr><td><i>u</i></td><td>вы (вежливо, одному)</td><td><i>u bent</i></td><td><i>u hebt / u heeft</i></td></tr>
  <tr><td><i>hij / zij (ze) / het</i></td><td>он / она / оно</td><td><i>hij is</i></td><td><i>hij heeft</i></td></tr>
  <tr><td><i>wij / we</i></td><td>мы</td><td><i>wij zijn</i></td><td><i>wij hebben</i></td></tr>
  <tr><td><i>jullie</i></td><td>вы (много людей)</td><td><i>jullie zijn</i></td><td><i>jullie hebben</i></td></tr>
  <tr><td><i>zij / ze</i></td><td>они</td><td><i>zij zijn</i></td><td><i>zij hebben</i></td></tr></tbody></table></div>
  <p>Короткие формы <i>je, ze, we</i> — обычные в речи; длинные <i>jij, zij, wij</i> — для ударения: <i><b>Jij</b> bent laat, niet ik!</i> (Это <b>ты</b> опоздал… опоздание твоё, не моё!)</p>
  <h4>Когда нужен <i>zijn</i></h4>
  <ul><li>кто: <i>Ik ben kunstenaar.</i> — Я художник. (без артикля перед профессией!)</li><li>откуда: <i>Ik kom uit Letland.</i> или <i>Ik ben Lets.</i></li><li>какой: <i>Joop is brutaal.</i> — Йоп нахальный.</li><li>где: <i>We zijn thuis.</i> — Мы дома.</li><li>возраст: <i>Ik ben dertig (jaar).</i> — Мне тридцать. (не «heb»!)</li></ul>
  <h4>Вопрос: меняем местами</h4>
  <p><i>Jij bent moe.</i> → <i><b>Ben</b> jij moe?</i> — Ты устал(а)? Заметили? <b>bent → ben</b>: когда <i>jij/je</i> стоит <b>после</b> глагола, <b>-t отпадает</b>. Это правило касается всех глаголов, мы ещё встретим его в следующем уроке. С <i>u</i> и <i>hij</i> -t остаётся: <i>Bent u moe? Is hij moe?</i></p>
  <p>С вопросительным словом: <i>Waar <b>kom</b> je vandaan?</i> — Откуда ты? <i>Hoe oud <b>ben</b> je?</i> — Сколько тебе лет?</p>`,
  simple: 'ik ben, jij bent, hij is, wij/jullie/zij zijn. ik heb, jij hebt, hij heeft. Возраст — через zijn: Ik ben 30. В вопросе: Ben jij? (без -t).',
  exm: [['Ik ben Alina. Ik ben kunstenaar.', 'Я Алина. Я художник.'], ['Waar kom je vandaan?', 'Откуда ты?'], ['Ik kom uit Letland.', 'Я из Латвии.'], ['Hoe oud ben je? Ik ben dertig.', 'Сколько тебе лет? Мне тридцать.']],
  conf: [['*Ik heb 30 jaar* / *Ik ben 30 jaar*', 'Возраст — через <b>zijn</b>, как в английском <i>I am 30</i>.', '«Мне двадцать пять лет»:|Ik ben vijfentwintig jaar.|Ik heb vijfentwintig jaar.|Mij is vijfentwintig jaar. # Возраст — через zijn.'],
    ['*Bent jij?* / *Ben jij?*', 'Если <i>jij/je</i> стоит после глагола — -t отпадает: <i>ben jij, heb jij</i>. С <i>u</i> и <i>hij</i> — остаётся.', 'Как правильно спросить «У тебя есть кошка?»|Heb jij een kat?|Hebt jij een kat?|Heeft jij een kat? # После глагола jij — без -t.']],
  words: [['ik', 'я', 'Ik ben moe.'], ['jij', 'ты', 'Jij bent laat!'], ['u', 'вы (вежливо)', 'Bent u meneer De Vries?'], ['wij', 'мы', 'Wij zijn thuis.'], ['jullie', 'вы (много)', 'Zijn jullie klaar?'], ['zijn', 'быть', 'Ik ben kunstenaar.'], ['hebben', 'иметь', 'Ik heb een kat.'], ['komen uit', 'быть родом из', 'Ik kom uit Riga.'], ['moe', 'усталый', 'Ben je moe?'], ['oud', 'старый; (о возрасте) лет', 'Hoe oud ben je?']],
  ex: [
    { t: 'gap', h: 'zijn или hebben — в нужной форме.', q: ['Ik ___ kunstenaar.|ben', 'Joop ___ een meeuw.|is', 'Wij ___ thuis.|zijn', '___ jij moe?|Ben', 'Hij ___ een fiets.|heeft', '___ jij een kat?|Heb', 'Jullie ___ laat!|zijn', 'Ik ___ dertig jaar.|ben # Возраст — через zijn.'] },
    { t: 'choice', h: 'Выберите местоимение.', q: ['___ zijn klaar. (мы)|We|Ik|Hij', '___ bent laat. (ты)|Jij|Hij|Wij', '___ is moe. (она)|Ze|Jullie|Ik', 'Zijn ___ klaar? (вы, много людей)|jullie|jij|u # jullie — «вы» для нескольких.'] },
    { t: 'order', q: ['Ik kom uit Letland.', 'Waar kom je vandaan?', 'Hoe oud ben je?', 'Wij zijn niet moe.', 'Joop is een brutale meeuw.'] },
    { t: 'fix', q: ['Ik heb dertig jaar.|Ik ben dertig jaar. # Возраст — через zijn.', 'Bent jij moe?|Ben jij moe? # После глагола jij — без -t.', 'Hij hebt een kat.|Hij heeft een kat.', 'Ik is kunstenaar.|Ik ben kunstenaar.'] },
    { t: 'tr', q: ['Я из Латвии.|Ik kom uit Letland.|Ik ben uit Letland.', 'Ты устал(а)?|Ben je moe?|Ben jij moe?', 'Мы дома.|We zijn thuis.|Wij zijn thuis.', 'Сколько тебе лет?|Hoe oud ben je?|Hoe oud ben jij?', 'У меня есть велосипед.|Ik heb een fiets.'] },
  ],
  read: {
    title: 'Joop en zijn familie', intro: 'Найдите все формы zijn и hebben.',
    txt: ['Joop is drie jaar. Hij heeft een grote familie. Zijn mama heet Greet. Zijn papa heet Kees.', 'Joop heeft ook een zus. Ze heet Lies. Lies is slim en heel snel.', '«Zijn jullie meeuwen?» vraagt een toerist. «Ja,» zegt Joop. «En u bent een toerist met patat. Leuk!»'],
    gl: { 'familie': 'семья', 'ook': 'тоже', 'zus': 'сестра', 'slim': 'умная', 'snel': 'быстрая', 'vraagt': 'спрашивает', 'zegt': 'говорит' },
    q: [{ t: 'tf', q: ['Joop is drie jaar.|T', 'Joop heeft een broer.|F # Hij heeft een zus, Lies.', 'Lies is snel.|T', 'De toerist heeft patat.|T # «U bent een toerist met patat.»'] },
      { t: 'choice', q: ['Hoe heet de mama van Joop?|Greet|Lies|Kees', 'Waarom zegt Joop «Leuk!»?|de toerist heeft patat|hij houdt van toeristen|hij is moe'] }],
  },
  series: [{ show: 'spreekwoord', who: 'нидерландская пословица', q: 'Oost west, thuis best.', mean: '«Восток, запад — дома лучше всего». В гостях хорошо, а дома лучше.', fun: 'Эту фразу вышивают на подушках и пишут на табличках у входа. Голландцы много путешествуют — и всё равно возвращаются к своему дождю и *gezelligheid*.', use: 'Oost west, thuis best!', qz: '«Oost west, thuis best» — это про то, что…|дома лучше всего|на западе лучше|надо путешествовать # Как «в гостях хорошо, а дома лучше».' }],
  write: { h: 'Расскажите о себе и одном человеке из семьи: кто, сколько лет, откуда.', min: 10, use: ['ik ben', 'ik kom uit', 'heet', 'is'],
    plan: ['Ik ben … (кто вы)', 'Ik kom uit …', 'Mijn … (мама / брат / подруга) heet …', 'Ze/Hij is … jaar.'],
    model: 'Ik ben Anna. Ik ben kunstenaar.\nIk kom uit Letland.\nMijn zus heet Liga.\nZe is vijfentwintig jaar en ze is heel slim.' },
  vid: [['DutchPod101', 'Dutch personal pronouns'], ['Learn Dutch with Bart de Pau', 'zijn hebben Dutch conjugation'], ['DutchPod101', 'introduce yourself in Dutch']],
  fact: '«Голландия» — это только две провинции из двенадцати: Северная и Южная Голландия. Страна называется *Nederland* — «низкие земли», и с 2020 года правительство официально просит называть её именно так. Йоп из Южной Голландии, поэтому ему всё равно.',
  src: [['Wikibooks — Dutch', 'https://en.wikibooks.org/wiki/Dutch'], ['DutchGrammar.com — pronouns', 'https://www.dutchgrammar.com/'], ['Woordenlijst', 'https://woordenlijst.org/']],
});
NOTE('a1-2', {
  crow: '*Ik ben Joop.* *Ik ben brutaal.* *Ik heb patat* — правда, не свою. Три предложения, и все чистая правда. Голландцы ценят честность.',
  mk: ['Напишите, кто вы и откуда.|ben;uit|Ik ben Alina en ik kom uit Letland.', 'Спросите друга, сколько ему лет, и ответьте за себя.|oud|Hoe oud ben jij? Ik ben dertig.', 'Напишите, что у вас есть (кот, велосипед, брат…).|heb|Ik heb een kat en een oude fiets.'],
  etym: [['familie', 'от латинского *familia* — «домочадцы». В нидерландском это и семья, и вообще вся родня: *verre familie* — дальние родственники.'], ['zus', 'короткая форма от *zuster* — сестра (родня английского *sister*). *Zuster* сегодня — ещё и медсестра.']],
  ru: 'Знакомимся с семьёй Йопа: мама Грет, папа Кес и младшая сестра Лис. Чайки — шумная семья.',
  gl: { 'familie': 'семья', 'zus': 'сестра', 'jonger': 'младше', 'luid': 'громкие', 'samen': 'вместе', 'toeristen': 'туристы', 'nooit': 'никогда' },
  tf: ['Joop heeft een zus.|T # Lies is de zus van Joop.', 'De familie is stil.|F # Ze zijn luid.', 'Joop heeft nooit honger.|F # Joop heeft altijd honger.'],
  ch: ['Wat zegt mama Greet?|Joop, jij bent een probleem!|Joop, jij bent lief!|Joop, jij bent moe! # «Joop, jij bent een probleem!»'],
  bmk: ['Опишите кого-то из своей семьи одним-двумя предложениями.|is|Mijn broer is vijfendertig en hij is heel grappig.'],
  etb: '*Toerist* — из английского *tourist*, а то — от французского *tour*, «круг, поездка». Для чаек Схевенингена *toerist* значит «человек, который не знает, что его картошка в опасности».',
});
ST('a1-2', { t: 'Знакомство: откуда вы?', tip: 'Голландцы спрашивают прямо: *Waar kom je vandaan?* и *Wat doe je?* Это не допрос, а нормальный интерес. Ответьте коротко и спросите в ответ.',
  sit: 'Вечеринка у знакомых, рядом новый человек.', ph: [['Waar kom je vandaan?', 'Откуда ты?'], ['Ik kom uit Letland, uit Riga.', 'Я из Латвии, из Риги.'], ['En jij?', 'А ты?'], ['Leuk!', 'Здорово!']],
  dlg: ['Вас спросили «Waar kom je vandaan?».|Ik kom uit Letland. En jij?|Ik ben vandaan Letland.|Letland ben ik. # kom uit — «родом из».', 'Человек: «Ik kom uit Utrecht.»|O, leuk! Is het mooi daar?|Waarom?|Utrecht is klein. # Интерес + вопрос.'],
  mk: 'Напишите, откуда вы, и спросите собеседника.|kom uit|Ik kom uit Riga. Waar kom jij vandaan?' });
BK('a1-2', 'Hoofdstuk 2. Joop en zijn familie', ['Joop heeft een familie. Zijn mama heet Greet en zijn papa heet Kees. Joop heeft ook een zus. Ze heet Lies. Ze is jonger dan Joop.', 'De familie is groot en luid. Ze zijn altijd samen op het strand.', 'Ze houden van patat en van toeristen. Toeristen hebben patat. Joop heeft altijd honger. Nooit heeft hij genoeg.', 'Mama Greet zegt: «Joop, jij bent een probleem!» Joop zegt: «Nee, mama. Ik ben een meeuw.»']);

U({
  id: 'a1-3', lvl: 'A1', t: 'Presens: основа + t', en: 'De tegenwoordige tijd',
  goals: ['образовывать настоящее время любого правильного глагола', 'не путаться с удвоением букв: *lopen → ik loop*', 'говорить, что вы делаете обычно и сейчас'],
  th: `<p>Нидерландский глагол в словаре кончается на <b>-en</b>: <i>werken</i> (работать), <i>wonen</i> (жить). Уберите <b>-en</b> — получите <b>основу</b> (stam). Дальше всё просто:</p>
  <div class="tbl"><table><thead><tr><th></th><th>werken</th><th>wonen</th><th>правило</th></tr></thead><tbody>
  <tr><td><i>ik</i></td><td>werk</td><td>woon</td><td>основа</td></tr>
  <tr><td><i>jij, u, hij, zij, het</i></td><td>werk<b>t</b></td><td>woon<b>t</b></td><td>основа + t</td></tr>
  <tr><td><i>wij, jullie, zij</i></td><td>werken</td><td>wonen</td><td>как инфинитив</td></tr></tbody></table></div>
  <p>И снова: <i>jij</i> после глагола — без -t: <i>Jij werkt.</i> → <i>Werk jij?</i></p>
  <h4>Как найти основу: правило звука</h4>
  <p>Основа должна <b>звучать</b> так же, как в инфинитиве. Поэтому:</p>
  <ul><li>долгая гласная в открытом слоге → на письме удваивается: <i>lo-pen</i> → <i>ik loop</i>, <i>ma-ken</i> → <i>ik maak</i>, <i>sla-pen</i> → <i>ik slaap</i>;</li>
  <li>двойная согласная → одна: <i>zitten</i> → <i>ik zit</i>, <i>bellen</i> → <i>ik bel</i>;</li>
  <li>в конце слова не бывает <i>v</i> и <i>z</i>: <i>leven</i> → <i>ik leef</i>, <i>lezen</i> → <i>ik lees</i>, <i>reizen</i> → <i>ik reis</i>;</li>
  <li>основа на <i>-t</i> — второе t не добавляем: <i>zitten</i> → <i>hij zit</i>, <i>eten</i> → <i>hij eet</i>.</li></ul>
  <h4>Неправильные — немного</h4>
  <p><i>gaan</i> → ik ga, hij gaat · <i>staan</i> → ik sta, hij staat · <i>doen</i> → ik doe, hij doet · <i>zien</i> → ik zie, hij ziet · <i>komen</i> → ik kom · <i>kunnen</i> → ik kan, jij kunt/kan · <i>willen</i> → ik wil, jij wilt/wil.</p>
  <h4>Presens = «обычно» и «сейчас»</h4>
  <p><i>Ik drink koffie</i> — и «я пью кофе (вообще)», и «я пью кофе (сейчас)». Подчеркнуть «прямо сейчас»: <i>Ik ben koffie <b>aan het</b> drinken</i> (дословно «я в питье кофе»). А с <i>morgen</i> presens — это ещё и будущее: <i>Morgen fiets ik naar Delft.</i></p>
  <p><b>Нравится</b> по-нидерландски — <i>graag</i> после глагола: <i>Ik teken graag</i> — я люблю рисовать. А «люблю что-то» — <i>houden van</i>: <i>Ik hou van koffie.</i> (разговорное <i>hou</i> = <i>houd</i>).</p>`,
  simple: 'ik + основа, jij/hij + основа + t, мы/вы/они = инфинитив. lopen → ik loop (звук сохраняем). Werk jij? — без -t. Люблю делать — graag: Ik teken graag.',
  exm: [['Ik werk in Riga.', 'Я работаю в Риге.'], ['Alina tekent elke dag vogels.', 'Алина каждый день рисует птиц.'], ['We drinken nu koffie.', 'Мы сейчас пьём кофе.'], ['Wat doe je?', 'Что ты делаешь?']],
  conf: [['*Werkt jij?* / *Werk jij?*', 'После глагола <i>jij/je</i> — без -t: <i>Werk jij hier? Woon je in Riga?</i> Но <i>Werkt hij? Werkt u?</i>', '«Ты живёшь в Делфте?»|Woon jij in Delft?|Woont jij in Delft?|Wonen jij in Delft? # После глагола jij — основа без -t.'],
    ['*ik loop* / *ik lop*', 'Долгая гласная из <i>lo-pen</i> в закрытом слоге пишется двойной: <i>ik loop</i>. А <i>ik lop</i> читалось бы коротко.', 'maken → ik …|maak|mak|maken # Долгое «а» — двойная aa.']],
  words: [['werken', 'работать', 'Ik werk thuis.'], ['wonen', 'жить (где-то)', 'Waar woon je?'], ['drinken', 'пить', 'Wij drinken thee.'], ['eten', 'есть', 'Joop eet patat.'], ['lezen', 'читать', 'Ik lees een boek.'], ['tekenen', 'рисовать', 'Alina tekent graag.'], ['fietsen', 'ездить на велосипеде', 'Ik fiets naar mijn werk.'], ['spreken', 'говорить (язык)', 'Spreek jij Nederlands?'], ['graag', 'охотно; люблю (делать)', 'Ik lees graag.'], ['elke dag', 'каждый день', 'Hij fietst elke dag.']],
  ex: [
    { t: 'gap', h: 'Поставьте глагол в нужную форму.', q: ['Ik ___ in Riga. (wonen)|woon', 'Hij ___ thuis. (werken)|werkt', 'Wij ___ koffie. (drinken)|drinken', '___ jij Nederlands? (spreken)|Spreek', 'Joop ___ patat. (eten)|eet # Основа eet — второе t не нужно.', 'Ik ___ naar huis. (lopen)|loop', 'Zij ___ een boek. (lezen, она)|leest', 'Jullie ___ graag. (fietsen)|fietsen'] },
    { t: 'choice', h: 'Выберите правильную форму.', q: ['Ik ___ elke dag.|teken|tekent|tekenen', '___ je thee?|Drink|Drinkt|Drinken # После глагола je — без -t.', 'U ___ goed Nederlands.|spreekt|spreek|spreken # С u -t остаётся.', 'Lies ___ naar school.|gaat|ga|gaan'] },
    { t: 'order', q: ['Ik teken graag vogels.', 'Spreek jij Nederlands?', 'Wij drinken elke dag koffie.', 'Joop eet graag patat.', 'Waar woon je?'] },
    { t: 'fix', q: ['Ik werkt in Delft.|Ik werk in Delft. # С ik — только основа.', 'Woont jij hier?|Woon jij hier? # После глагола jij — без -t.', 'Hij eett patat.|Hij eet patat. # Основа на t — второе t не добавляем.', 'Ik lop naar huis.|Ik loop naar huis. # Долгое «о» — oo.'] },
    { t: 'tr', q: ['Я работаю дома.|Ik werk thuis.', 'Ты говоришь по-нидерландски?|Spreek jij Nederlands?|Spreek je Nederlands?', 'Он ест картошку фри.|Hij eet patat.|Hij eet friet.', 'Я люблю читать.|Ik lees graag.', 'Мы едем на велосипеде домой.|We fietsen naar huis.|Wij fietsen naar huis.'] },
  ],
  read: {
    title: 'Een dag in Scheveningen', intro: 'Найдите все глаголы и их подлежащие.',
    txt: ['Joop staat vroeg op. Hij kijkt naar de zee. Dan vliegt hij naar de boulevard.', 'Op de boulevard zitten toeristen. Ze eten patat met mayonaise. Joop wacht. Hij is geduldig. Een beetje.', 'Een man leest de krant. Joop pakt een frietje. De man roept: «Hé!» Joop zegt niets. Hij eet.'],
    gl: { 'staat vroeg op': 'встаёт рано', 'kijkt naar': 'смотрит на', 'vliegt': 'летит', 'boulevard': 'набережная', 'wacht': 'ждёт', 'geduldig': 'терпеливый', 'een beetje': 'немного', 'de krant': 'газета', 'pakt': 'хватает', 'roept': 'кричит', 'niets': 'ничего' },
    q: [{ t: 'tf', q: ['Joop staat laat op.|F # Hij staat vroeg op.', 'De toeristen eten patat.|T', 'Joop is heel geduldig.|F # Hij is geduldig. Een beetje.', 'De man leest een boek.|F # Hij leest de krant.'] },
      { t: 'choice', q: ['Wat doet Joop met het frietje?|hij eet het|hij geeft het terug|hij gooit het weg', 'Wat zegt de man?|Hé!|Dank je wel!|Lekker!'] }],
  },
  series: [{ show: 'typisch', who: 'типично голландское', q: 'Lekker!', mean: '«Вкусно!» — и ещё «приятно, классно, здорово».', fun: '<i>Lekker</i> — главное слово страны. <i>Lekker eten</i> — вкусная еда. <i>Lekker weer</i> — хорошая погода. <i>Lekker slapen</i> — сладко спать. <i>Lekker bezig!</i> — «молодец, хорошо работаешь!» Если не знаете, что сказать, — скажите <i>lekker</i>. Йоп говорит его чаще, чем дышит.', use: 'Slaap lekker!', qz: 'Друг говорит «Lekker weer vandaag!». Он имеет в виду…|хорошую погоду|вкусную погоду|дождь # lekker — не только вкусно, но и приятно.' }],
  write: { h: 'Опишите свой обычный день 3–4 фразами: что вы делаете, где, что любите.', min: 12, use: ['ik werk', 'ik drink', 'graag', 'elke dag'],
    plan: ['Ik woon in …', 'Ik werk … / Ik teken …', 'Elke dag drink ik …', 'Ik … graag.'],
    model: 'Ik woon in Riga.\nIk werk thuis.\nElke dag drink ik koffie.\nIk teken graag vogels en ik lees graag.' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch present tense'], ['DutchPod101', 'Dutch verbs conjugation present'], ['DutchPod101', 'Dutch spelling long short vowels']],
  fact: 'В Нидерландах велосипедов больше, чем людей: около 23 миллионов на 18 миллионов жителей. Глагол *fietsen* поэтому учат одним из первых. Йоп учил его самым первым — сразу после *eten*.',
  src: [['DutchGrammar.com — present tense', 'https://www.dutchgrammar.com/'], ['Wikibooks — Dutch', 'https://en.wikibooks.org/wiki/Dutch'], ['Woordenlijst', 'https://woordenlijst.org/']],
});
NOTE('a1-3', {
  crow: 'Основа + t. Вот и вся магия. *Joop eet. Joop wacht. Joop eet weer.* Мой день в трёх глаголах. Ваш, надеюсь, разнообразнее.',
  mk: ['Напишите, что вы делаете каждый день.|elke dag|Elke dag drink ik koffie en teken ik.', 'Напишите, что вы любите делать (graag).|graag|Ik fiets graag en ik lees graag.', 'Спросите друга, где он работает.|werk|Waar werk jij?', 'Напишите, что любит делать Алина — или вы сами.|graag|Alina tekent graag vogels.'],
  etym: [['fiets', 'откуда это слово — не знает никто. Есть версий десять, и голландцы спорят о них уже сто лет. Йоп считает, что это хорошо: у самой важной вещи в стране должна быть тайна.'], ['krant', 'от французского *courante* — «текущие (новости)». Отсюда же английское *current*.']],
  ru: 'Обычный день Йопа: встать, посмотреть на море, найти туристов с картошкой фри. Остальное — по обстоятельствам.',
  gl: { 'staat': 'встаёт (opstaan)', 'zwemt': 'плавает', 'vliegt': 'летит', 'zoekt': 'ищет', 'kijken': 'смотрят', 'slaapt': 'спит', 'dak': 'крыша' },
  tf: ['Joop staat om zes uur op.|T', 'Joop zoekt toeristen.|T # Hij zoekt toeristen met patat.', 'Joop slaapt in een huis.|F # Hij slaapt op een dak.'],
  ch: ['Waarom kijken de toeristen boos?|Joop pakt hun patat|het regent|ze zijn moe # Joop pakt hun patat.'],
  bmk: ['Что вы делаете утром? Два-три глагола: *Ik sta op, ik …*|ik|Ik sta op, ik drink koffie en ik teken.'],
  etb: '*Boulevard* — французское слово, а французы взяли его из нидерландского *bolwerk* — «бастион, вал». Слово уехало во Францию и вернулось обратно уже набережной. Как Йоп из отпуска: тот же, но важнее.',
});
ST('a1-3', { t: 'Чем вы занимаетесь?', tip: '*Wat doe jij?* — «что ты делаешь?» — значит «кем работаешь?». Это частый вопрос, не обидный. Ответ: *Ik ben …* (без артикля) или *Ik werk bij / in …*',
  sit: 'Новый сосед спрашивает о работе.', ph: [['Wat doe jij?', 'Чем занимаешься?'], ['Ik ben kunstenaar.', 'Я художник.'], ['Ik werk thuis.', 'Я работаю дома.'], ['Wat leuk!', 'Как здорово!']],
  dlg: ['Сосед: «Wat doe jij?»|Ik ben kunstenaar. Ik teken en schilder.|Ik doe niets, ik ben.|Wat doe jij? # Ответ + деталь.', 'Сосед: «Ik werk bij een bank.»|O, en werk je in Den Haag?|Banken zijn saai.|Werkt jij veel? # Вопрос о деталях (и без -t после je).'],
  mk: 'Напишите, кем вы работаете и где.|ik ben;werk|Ik ben kunstenaar en ik werk thuis.' });
BK('a1-3', 'Hoofdstuk 3. Een dag van Joop', ['Joop staat om zes uur op. Hij zwemt in de zee. Dan vliegt hij naar de boulevard.', 'Daar zoekt hij toeristen. Toeristen met patat. Hij wacht en hij kijkt.', 'Een toerist eet patat met mayonaise. Joop pakt een frietje. En nog een. De toeristen kijken boos. Joop kijkt niet terug.', 'Om negen uur is Joop moe. Hij slaapt op een dak. Hij droomt van patat.']);

U({
  id: 'a1-4', lvl: 'A1', t: 'Существительные: de и het', en: 'Lidwoorden: de en het',
  goals: ['понимать, когда *de*, когда *het*, а когда *een*', 'образовывать множественное число: *-en* и *-s*', 'делать уменьшительные на *-je* (и знать, что они все *het*)'],
  th: `<p>В нидерландском два определённых артикля: <b>de</b> и <b>het</b>. Неопределённый — один на всех: <b>een</b> (читается [эн]).</p>
  <div class="tbl"><table><thead><tr><th></th><th>de-слова (≈ ¾ всех)</th><th>het-слова</th></tr></thead><tbody>
  <tr><td>какие-то</td><td><i>een fiets</i> — велосипед</td><td><i>een huis</i> — дом</td></tr>
  <tr><td>этот, известный</td><td><i>de fiets</i></td><td><i>het huis</i></td></tr>
  <tr><td>много</td><td><i>de fietsen</i></td><td><i>de huizen</i> ← во множественном <b>всегда de</b></td></tr></tbody></table></div>
  <h4>Как угадать het</h4>
  <p>Честно: артикль учим вместе со словом, как род в русском. Но есть подсказки — это <b>het</b>:</p>
  <ul><li>все уменьшительные на <b>-je</b>: <i>het meisje</i> (девочка), <i>het kopje</i> (чашечка), <i>het frietje</i>;</li>
  <li>языки и инфинитивы как существительные: <i>het Nederlands</i>, <i>het eten</i> (еда);</li>
  <li>многие слова на <i>ge-, be-, ver-</i>: <i>het gesprek</i> (разговор), <i>het verhaal</i> (история);</li>
  <li>слова на <i>-um</i>: <i>het museum</i>, <i>het centrum</i>.</li></ul>
  <p>Не знаете? Говорите <i>de</i> — попадёте в трёх случаях из четырёх. Голландцы поймут. Йоп — съязвит, но тоже поймёт.</p>
  <h4>Множественное число</h4>
  <ul><li>обычно <b>-en</b>: <i>boek → boeken</i>, <i>fiets → fietsen</i>; звук сохраняем: <i>boom → bomen</i>, <i>bed → bedden</i>, <i>huis → huizen</i>;</li>
  <li><b>-s</b> после <i>-el, -er, -em, -en, -je</i>: <i>tafel → tafels</i>, <i>kamer → kamers</i>, <i>meisje → meisjes</i>;</li>
  <li><b>-'s</b> после <i>-a, -o, -u, -i, -y</i>: <i>auto → auto's</i>, <i>foto → foto's</i>;</li>
  <li>особые: <i>kind → kinderen</i>, <i>stad → steden</i>, <i>ei → eieren</i>.</li></ul>
  <h4>Этот / тот</h4>
  <p>С de: <b>deze</b> (этот), <b>die</b> (тот). С het: <b>dit</b>, <b>dat</b>. <i>Deze fiets, dit huis.</i> Во множественном — как с de: <i>deze huizen</i>.</p>`,
  simple: 'een — для всех. de или het — учим со словом (de чаще). Все -je — het. Множественное: -en или -s, и всегда de. deze/die — с de, dit/dat — с het.',
  exm: [['Ik heb een fiets. De fiets is oud.', 'У меня есть велосипед. Велосипед старый.'], ['Het huis is klein.', 'Дом маленький.'], ['De kinderen spelen op het strand.', 'Дети играют на пляже.'], ['Dit kopje is van Alina.', 'Эта чашечка — Алины.']],
  conf: [['*het huis* / *de huizen*', 'Во множественном числе артикль всегда <b>de</b> — даже у het-слов.', '«Дома» (много):|de huizen|het huizen|het huisen # Множественное — всегда de.'],
    ['*deze* / *dit*', '<i>deze</i> — с de-словами, <i>dit</i> — с het-словами: <i>deze fiets</i>, <i>dit huis</i>.', '«Эта девочка» (het meisje):|dit meisje|deze meisje|die meisje # Уменьшительное — het, значит dit.']],
  words: [['de fiets', 'велосипед', 'De fiets is nieuw.'], ['het huis', 'дом', 'Het huis is groot.'], ['de man', 'мужчина', 'De man leest.'], ['de vrouw', 'женщина', 'De vrouw fietst.'], ['het kind', 'ребёнок', 'Het kind speelt.'], ['het meisje', 'девочка', 'Het meisje heet Lotte.'], ['de stad', 'город', 'Delft is een mooie stad.'], ['het boek', 'книга', 'Het boek is leuk.'], ['de kat', 'кошка', 'De kat slaapt.'], ['het strand', 'пляж', 'Het strand is breed.']],
  ex: [
    { t: 'choice', h: 'de или het?', q: ['___ meisje|het|de # Все -je — het.', '___ fiets|de|het', '___ huis|het|de', '___ fietsen|de|het # Множественное — de.', '___ museum|het|de # -um — het.', '___ kopje|het|de'] },
    { t: 'gap', h: 'Множественное число.', q: ['een boek — twee ___|boeken', 'een tafel — drie ___|tafels', 'een auto — vier ___|auto\'s', 'een kind — vijf ___|kinderen', 'een huis — twee ___|huizen # s между гласными → z.', 'een meisje — drie ___|meisjes'] },
    { t: 'gap', h: 'deze / dit.', q: ['___ fiets is van mij.|Deze', '___ huis is oud.|Dit', '___ kopje is leeg.|Dit', '___ boeken zijn nieuw.|Deze # Множественное — как с de.'] },
    { t: 'order', q: ['Het meisje heeft een kat.', 'De fietsen staan bij het huis.', 'Dit boek is heel leuk.', 'Deze stad is mooi.'] },
    { t: 'fix', q: ['Het huizen zijn groot.|De huizen zijn groot. # Множественное — de.', 'De meisje speelt.|Het meisje speelt. # -je — het.', 'Deze huis is mooi.|Dit huis is mooi. # huis — het, значит dit.', 'Ik heb twee boek.|Ik heb twee boeken.'] },
    { t: 'tr', q: ['Велосипед старый.|De fiets is oud.', 'Дом маленький.|Het huis is klein.', 'Дети на пляже.|De kinderen zijn op het strand.', 'Этот дом красивый.|Dit huis is mooi.'] },
  ],
  read: {
    title: 'Wat is dat?', intro: 'Найдите все de, het и een. Почему так?',
    txt: ['Op het strand ligt een fiets. De fiets is oud. Hij heeft een bel en een mandje.', 'Naast de fiets staat een meisje. Het meisje heet Fien. Ze heeft twee katten en drie fietsen.', '«Is dit jouw fiets?» vraagt Fien. «Nee,» zegt Joop, «maar dit is mijn frietje.»'],
    gl: { 'ligt': 'лежит', 'de bel': 'звонок', 'het mandje': 'корзинка', 'naast': 'рядом с', 'staat': 'стоит', 'jouw': 'твой', 'mijn': 'мой' },
    q: [{ t: 'tf', q: ['De fiets is nieuw.|F # De fiets is oud.', 'Het meisje heet Fien.|T', 'Fien heeft drie katten.|F # Ze heeft twee katten.', 'Het is de fiets van Joop.|F # «Nee,» zegt Joop.'] },
      { t: 'choice', q: ['Wat heeft de fiets?|een bel en een mandje|twee wielen en een kat|een lamp en een tas', 'Waarom is het «het meisje»?|-je — всегда het|девочки — het|так звучит красивее'] }],
  },
  series: [{ show: 'typisch', who: 'типично голландское', q: 'Gezellig!', mean: '«Уютно, душевно, приятно вместе» — и ещё десять смыслов.', fun: '<i>Gezellig</i> не переводится одним словом. Это кофе с друзьями, свечка на столе в дождь, шумный день рождения, маленькое кафе. «Как было?» — <i>Gezellig!</i> — и всё понятно. Йоп считает <i>gezellig</i> любое место, где падают картошки.', use: 'Het was heel gezellig!', qz: 'Подруга говорит о вечере с друзьями: «Het was zo gezellig!» Значит, было…|уютно и приятно вместе|скучно|очень дорого # gezellig — тепло, уютно, вместе.' }],
  write: { h: 'Опишите свою комнату или вид из окна: 4 предмета, с артиклями.', min: 12, use: ['de', 'het', 'een', 'is'],
    plan: ['In mijn kamer is …', 'De … is … (какой)', 'Het … is …', 'Ik heb ook twee … (множественное)'],
    model: 'In mijn kamer is een groot raam.\nDe tafel is oud.\nHet bed is klein.\nIk heb ook twee katten en veel boeken.' },
  vid: [['Learn Dutch with Bart de Pau', 'de or het Dutch articles'], ['DutchPod101', 'Dutch plural nouns'], ['DutchPod101', 'Dutch diminutives je']],
  fact: 'Уменьшительные — любимая форма голландцев: *een biertje* (пивко), *een kopje koffie*, *even een momentje*. Они не только про размер: так звучит мягче и *gezelliger*. Английское *cookie* — из нидерландского *koekje*, «печеньице».',
  src: [['Woordenlijst — de of het', 'https://woordenlijst.org/'], ['DutchGrammar.com — articles', 'https://www.dutchgrammar.com/'], ['Wikibooks — Dutch', 'https://en.wikibooks.org/wiki/Dutch']],
});
NOTE('a1-4', {
  crow: '*De* или *het*? Если честно — угадывайте *de*. Попадёте в трёх случаях из четырёх. В четвёртом я съязвлю, но вы это переживёте.',
  mk: ['Напишите, что у вас дома есть (с артиклем).|een|Ik heb een oude fiets en een kleine kat.', 'Опишите одну вещь с het.|het|Het huis is klein maar gezellig.', 'Напишите о чём-то во множественном числе.|de|De kinderen spelen op het strand.'],
  etym: [['koekje', 'уменьшительное от *koek* — «пирог, печенье». Голландские поселенцы в Нью-Йорке (тогда Новом Амстердаме) пекли *koekjes* — и английский забрал слово как *cookie*.'], ['strand', 'то же, что английское *strand* — «берег» (оттуда *stranded* — «выброшенный на берег»). В нидерландском осталось главное значение — пляж.']],
  ru: 'Йоп находит на пляже старый велосипед. И решает, что это судьба.',
  gl: { 'vindt': 'находит', 'roestig': 'ржавый', 'het zadel': 'сиденье', 'kapot': 'сломанный', 'de bel': 'звонок', 'mandje': 'корзинка', 'perfect': 'идеальный' },
  tf: ['De fiets is nieuw.|F # De fiets is oud en roestig.', 'De fiets heeft een mandje.|T', 'Joop vindt de fiets perfect.|T'],
  ch: ['Wat zegt Joop?|Dit is mijn fiets!|Dit is jouw fiets!|Dit is een auto! # «Dit is mijn fiets!»'],
  bmk: ['Опишите свой велосипед или любую вашу вещь: какая она?|is|Mijn fiets is oud, maar hij is heel mooi.'],
  etb: '*Kapot* — «сломанный». Пришло из французского *capot* — так говорили в карточной игре о том, кто проиграл всё. Оттуда же русское «капут». Йоп считает, что сломанное сиденье — мелочь, если у велосипеда есть корзинка для картошки.',
});
ST('a1-4', { t: 'В кафе: заказать', tip: 'Заказывают прямо: *Een koffie, graag* или *Mag ik een thee?* Официант может сказать *Zeg het maar* — «говорите» (то есть «что желаете?»). Пирог — *appeltaart met slagroom*, это почти закон.',
  sit: 'Маленькое кафе в Гааге.', ph: [['Zeg het maar!', 'Что желаете?'], ['Een koffie, graag.', 'Кофе, пожалуйста.'], ['Mag ik appeltaart met slagroom?', 'Можно яблочный пирог со сливками?'], ['Mag ik afrekenen?', 'Можно рассчитаться?']],
  dlg: ['Официант: «Zeg het maar!»|Een koffie en een appeltaart, graag.|Ik zeg het.|Koffie is. # Коротко и вежливо: … graag.', 'Вы хотите заплатить.|Mag ik afrekenen?|Ik wil weg.|Hoeveel ben ik? # afrekenen — рассчитаться.'],
  mk: 'Закажите что-нибудь в кафе одной-двумя фразами.|graag|Een thee en een stuk appeltaart, graag.' });
BK('a1-4', 'Hoofdstuk 4. De oude fiets', ['Op een dag vindt Joop een fiets. Hij ligt in het zand bij het strand.', 'De fiets is oud en roestig. Het zadel is kapot. Maar de bel doet het nog: tring tring!', 'Voor op de fiets is een mandje. Een mandje voor patat, denkt Joop.', '«Dit is mijn fiets!» roept hij. «Hij is perfect!» De andere meeuwen lachen. Een meeuw op een fiets? Dat is nieuw.']);

U({
  id: 'a1-5', lvl: 'A1', t: 'Порядок слов: глагол на втором месте', en: 'Woordvolgorde en vragen',
  goals: ['ставить глагол на второе место: *Vandaag fiets ik*', 'задавать вопросы с *wat, waar, wie, wanneer, hoe, waarom*', 'ставить второй глагол в конец: *Ik wil koffie drinken*'],
  th: `<p>Главное правило нидерландского: <b>спрягаемый глагол — на втором месте</b>. Не «второе слово», а второй <b>блок</b>.</p>
  <div class="tbl"><table><thead><tr><th>1</th><th>2 (глагол)</th><th>дальше</th></tr></thead><tbody>
  <tr><td>Ik</td><td><b>fiets</b></td><td>vandaag naar Delft.</td></tr>
  <tr><td>Vandaag</td><td><b>fiets</b></td><td>ik naar Delft.</td></tr>
  <tr><td>Naar Delft</td><td><b>fiets</b></td><td>ik vandaag.</td></tr></tbody></table></div>
  <p>Начали не с подлежащего — подлежащее встаёт <b>после</b> глагола (<i>inversie</i>). <i>Vandaag ik fiets</i> — ошибка номер один у всех, кто учит нидерландский. Даже у чаек.</p>
  <h4>Второй глагол — в самый конец</h4>
  <p>Если глаголов два, второй (инфинитив) уезжает <b>в конец</b>: <i>Ik <b>wil</b> vandaag koffie <b>drinken</b>.</i> <i>We <b>gaan</b> morgen naar Rotterdam <b>fietsen</b>.</i> Глаголы как рамка: всё остальное — внутри.</p>
  <h4>Вопросы</h4>
  <p>Да/нет — глагол первым: <i><b>Woon</b> jij in Riga?</i> (и без -t!). С вопросительным словом — оно первое, глагол второй:</p>
  <ul><li><i>Wat</i> — что: <i>Wat doe je?</i></li><li><i>Waar</i> — где: <i>Waar woon je?</i></li><li><i>Wie</i> — кто: <i>Wie is dat?</i></li><li><i>Wanneer</i> — когда: <i>Wanneer kom je?</i></li><li><i>Hoe</i> — как: <i>Hoe gaat het?</i></li><li><i>Waarom</i> — почему: <i>Waarom lach je?</i></li><li><i>Hoeveel</i> — сколько: <i>Hoeveel kost het?</i></li></ul>
  <p>«Куда» и «откуда» разрываются: <i><b>Waar</b> ga je <b>naartoe</b>?</i> — куда идёшь? <i><b>Waar</b> kom je <b>vandaan</b>?</i> — откуда ты?</p>
  <h4>Порядок в середине: время — образ — место</h4>
  <p><i>Ik fiets <b>morgen</b> (когда) <b>met Rik</b> (с кем/как) <b>naar Delft</b> (куда).</i> Сначала время, потом как, потом место.</p>`,
  simple: 'Глагол — второй. Начали не с подлежащего — подлежащее после глагола. Второй глагол — в конец. Вопрос: Wat/Waar/Wie + глагол + подлежащее.',
  exm: [['Vandaag fiets ik naar Delft.', 'Сегодня я еду на велосипеде в Делфт.'], ['Ik wil koffie drinken.', 'Я хочу выпить кофе.'], ['Waar ga je naartoe?', 'Куда ты идёшь?'], ['Morgen werkt Alina thuis.', 'Завтра Алина работает дома.']],
  conf: [['*Vandaag ik fiets* / *Vandaag fiets ik*', 'Если первым стоит не подлежащее — глагол всё равно второй, а подлежащее за ним.', '«Сегодня я рисую»:|Vandaag teken ik.|Vandaag ik teken.|Ik vandaag teken. # Инверсия.'],
    ['*Ik wil drinken koffie* / *Ik wil koffie drinken*', 'Второй глагол — в самый конец предложения.', '«Мы хотим поехать в Амстердам»:|We willen naar Amsterdam gaan.|We willen gaan naar Amsterdam.|We gaan willen naar Amsterdam. # Инфинитив — в конец.']],
  words: [['wat', 'что', 'Wat doe je?'], ['waar', 'где', 'Waar is het station?'], ['wie', 'кто', 'Wie is die man?'], ['wanneer', 'когда', 'Wanneer kom je?'], ['hoe', 'как', 'Hoe gaat het?'], ['waarom', 'почему', 'Waarom lach je?'], ['vandaag', 'сегодня', 'Vandaag regent het.'], ['morgen', 'завтра', 'Morgen fiets ik naar Delft.'], ['willen', 'хотеть', 'Ik wil patat eten.'], ['naartoe', 'туда (куда)', 'Waar ga je naartoe?']],
  ex: [
    { t: 'order', hint: 'Глагол — второй!', q: ['Vandaag fiets ik naar Delft.', 'Morgen werkt Alina thuis.', 'In Scheveningen regent het vaak.', 'Ik wil koffie drinken.', 'Waar woon je?', 'Wanneer gaan we naar Amsterdam?'] },
    { t: 'choice', h: 'Выберите вопросительное слово.', q: ['___ heet je? — Joop.|Hoe|Waar|Wie # Hoe heet je? — как тебя зовут.', '___ woon je? — In Riga.|Waar|Wat|Wanneer', '___ kom je? — Morgen.|Wanneer|Waarom|Wie', '___ is dat? — Mijn zus.|Wie|Wat|Hoe', '___ lach je? — Omdat Joop een fiets heeft!|Waarom|Waar|Hoeveel'] },
    { t: 'fix', q: ['Vandaag ik werk thuis.|Vandaag werk ik thuis. # Глагол — второй.', 'Ik wil drinken koffie.|Ik wil koffie drinken. # Второй глагол — в конец.', 'Waar jij woont?|Waar woon jij? # В вопросе глагол — сразу после waar (и без -t).', 'Morgen Joop fietst naar Delft.|Morgen fietst Joop naar Delft.'] },
    { t: 'gap', h: 'Вставьте глагол на место.', q: ['Vandaag ___ ik thee. (drinken)|drink', 'Morgen ___ Lies naar school. (gaan)|gaat', 'Ik wil een boek ___. (lezen)|lezen', 'Waar ___ je vandaan? (komen)|kom'] },
    { t: 'tr', q: ['Сегодня я работаю дома.|Vandaag werk ik thuis.|Ik werk vandaag thuis.', 'Где ты живёшь?|Waar woon je?|Waar woon jij?', 'Я хочу есть картошку фри.|Ik wil patat eten.|Ik wil friet eten.', 'Куда ты едешь?|Waar ga je naartoe?|Waar ga jij naartoe?|Waar fiets je naartoe?', 'Почему ты смеёшься?|Waarom lach je?|Waarom lach jij?'] },
  ],
  read: {
    title: 'Vragen, vragen, vragen', intro: 'Найдите все вопросы. Где в них глагол?',
    txt: ['Vandaag fietst Joop door de duinen. Daar staat een grote grijze vogel. Hij kijkt naar het water.', '«Wie ben jij?» vraagt Joop. «Ik ben Rik,» zegt de vogel. «Ik ben een reiger. En wie ben jij?»', '«Ik ben Joop. Ik fiets naar Amsterdam.» «Waarom?» vraagt Rik. «Daar is de beste patat van Nederland!» Rik denkt lang na. «Ik ga mee,» zegt hij.'],
    gl: { 'door': 'через', 'grijze': 'серая', 'vogel': 'птица', 'reiger': 'цапля', 'de beste': 'лучшая', 'denkt na': 'думает, размышляет', 'ik ga mee': 'я с тобой (иду вместе)' },
    q: [{ t: 'tf', q: ['Rik is een meeuw.|F # Rik is een reiger.', 'Joop fietst naar Amsterdam.|T', 'Rik denkt kort na.|F # Rik denkt lang na.', 'Rik gaat mee.|T'] },
      { t: 'choice', q: ['Waarom fietst Joop naar Amsterdam?|daar is de beste patat|daar woont zijn zus|hij houdt van regen', 'Waar staat Rik?|in de duinen|op het strand|op een dak'] }],
  },
  series: [{ show: 'uitdrukking', who: 'нидерландское выражение', q: 'Met de deur in huis vallen.', mean: '«Ввалиться в дом вместе с дверью» — сразу перейти к делу, без вступлений.', fun: 'Голландцы часто так и делают — и не считают это грубостью. Вопрос в лоб, ответ в лоб. Говорят: <i>Ik val maar meteen met de deur in huis</i> — «скажу сразу, как есть». Порядок слов у них прямой, как дорога по польдеру, и разговоры — тоже.', use: 'Ik val maar met de deur in huis: ik heb een vraag.', qz: '«Met de deur in huis vallen» значит…|сразу перейти к делу|упасть у двери|прийти без приглашения # Без долгих вступлений.' }],
  write: { h: 'Напишите 3 вопроса новому знакомому и 2 фразы о своих планах на завтра.', min: 15, use: ['waar', 'wat', 'morgen', 'wil'],
    plan: ['Вопрос с waar.', 'Вопрос с wat.', 'Вопрос с wanneer или waarom.', 'Morgen … ik … (инверсия!)', 'Ik wil … (инфинитив в конец)'],
    model: 'Waar woon je?\nWat doe je graag?\nWanneer heb je tijd?\nMorgen fiets ik naar Delft.\nIk wil daar een museum bezoeken.' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch word order inversion'], ['DutchPod101', 'Dutch question words'], ['DutchPod101', 'Dutch sentence structure']],
  fact: 'Около четверти Нидерландов лежит ниже уровня моря. Землю отвоёвывали дамбами, мельницами и насосами веками. Отсюда поговорка: «Бог создал мир, а голландцы — Нидерланды». Йоп добавляет: «А чайки создали хаос на набережной».',
  src: [['DutchGrammar.com — word order', 'https://www.dutchgrammar.com/'], ['Wikibooks — Dutch', 'https://en.wikibooks.org/wiki/Dutch'], ['Onze Taal', 'https://onzetaal.nl/']],
});
NOTE('a1-5', {
  crow: 'Глагол — второй. Всегда. Даже если с утра всё пошло не так, глагол стоит на месте. Это единственное в Нидерландах, что не сдувает ветром.',
  mk: ['Начните предложение с *Vandaag* или *Morgen*.|vandaag/morgen|Vandaag drink ik koffie met mijn zus.', 'Напишите, что вы хотите сделать (wil + инфинитив в конце).|wil|Ik wil morgen een boek lezen.', 'Задайте другу два вопроса.|waar|Waar woon je? Wat doe je graag?'],
  etym: [['reiger', 'родня немецкого *Reiher* и старого английского *hragra*. Цапли в Нидерландах повсюду: стоят у каналов неподвижно, как служащие в очереди за кофе.'], ['waarom', '«на что?» — *waar* (где/что) + *om* (за, вокруг). Как русское «зачем» — «за чем».']],
  ru: 'В дюнах Йоп встречает серую цаплю Рика. Рик медленный и задумчивый. Узнав, куда едет Йоп, Рик решает ехать с ним.',
  gl: { 'duinen': 'дюны', 'reiger': 'цапля', 'langzaam': 'медленно', 'waarom': 'почему', 'beste': 'лучшая', 'mandje': 'корзинка', 'samen': 'вместе' },
  tf: ['Rik is een reiger.|T', 'Rik praat heel snel.|F # Hij praat langzaam.', 'Rik zit in het mandje.|T # Rik zit in het mandje.'],
  ch: ['Wat vraagt Rik?|Waarom ga je naar Amsterdam?|Hoe laat is het?|Wie is je zus? # «Waarom?»'],
  bmk: ['Задайте Йопу два вопроса о его поездке.|waar|Waar slaap je? Wanneer ben je in Amsterdam?'],
  etb: '*Duin* и английское *down* («холм», откуда *the Downs*) — родня. А вот *naartoe* — чисто голландское: *naar* (к) + *toe* (к). Два раза «к» — для надёжности. Голландцы любят надёжность.',
});
ST('a1-5', { t: 'Спросить дорогу', tip: 'Начните с *Pardon* или *Sorry*. Голландцы отвечают быстро и часто сразу по-английски — скажите *Nederlands graag, ik leer het!* — и большинство перейдёт обратно с удовольствием.',
  sit: 'Вы в Гааге и ищете вокзал.', ph: [['Pardon, waar is het station?', 'Извините, где вокзал?'], ['Rechtdoor en dan links.', 'Прямо, а потом налево.'], ['Kunt u dat herhalen?', 'Можете повторить?'], ['Nederlands graag, ik leer het!', 'По-нидерландски, пожалуйста, я учу!']],
  dlg: ['Вы ищете вокзал.|Pardon, waar is het station?|Waar het station is?|Station! # Pardon + вопрос с правильным порядком.', 'Прохожий сразу переходит на английский.|Nederlands graag, ik leer het!|Engels is beter.|Ik spreek niets. # Голландцы обычно рады помочь.'],
  mk: 'Спросите прохожего, где находится что-нибудь (музей, кафе, остановка).|pardon;waar|Pardon, waar is het museum?' });
BK('a1-5', 'Hoofdstuk 5. Rik de reiger', ['Joop fietst door de duinen. Het is zwaar. De wind is sterk. Daar staat een grote grijze vogel.', '«Wie ben jij?» vraagt Joop. «Ik ben Rik. Ik ben een reiger,» zegt de vogel. Hij praat heel langzaam.', '«Waar ga je naartoe?» vraagt Rik. «Naar Amsterdam,» zegt Joop. «Waarom?» «Daar is de beste patat van Nederland!»', 'Rik denkt lang na. Heel lang. «Ik ga mee,» zegt hij. Hij gaat in het mandje zitten. Nu fietsen ze samen.']);

U({
  id: 'a1-6', lvl: 'A1', t: 'niet и geen, числа и время', en: 'Ontkenning, getallen en de klok',
  goals: ['отрицать правильно: *niet* или *geen*', 'считать до 100 и называть цену', 'говорить время (и не попасться на *half vier*)'],
  th: `<p>В нидерландском два «не»: <b>geen</b> и <b>niet</b>.</p>
  <h4>geen — «никакой, ни одного»</h4>
  <p>Перед существительным с <i>een</i> или без артикля: <i>Ik heb <b>een</b> fiets.</i> → <i>Ik heb <b>geen</b> fiets.</i> <i>Ik heb tijd.</i> → <i>Ik heb <b>geen</b> tijd.</i> Никогда не <i>niet een</i>!</p>
  <h4>niet — во всех остальных случаях</h4>
  <ul><li>в конце простого предложения: <i>Ik werk <b>niet</b>.</i> <i>Ik zie de fiets <b>niet</b>.</i></li>
  <li>перед прилагательным: <i>Het is <b>niet</b> koud.</i></li>
  <li>перед местом с предлогом: <i>Ik ga <b>niet</b> naar huis.</i></li>
  <li>перед вторым глаголом в конце: <i>Ik wil <b>niet</b> werken.</i></li></ul>
  <h4>Числа</h4>
  <p>0 nul, 1 een (één), 2 twee, 3 drie, 4 vier, 5 vijf, 6 zes, 7 zeven, 8 acht, 9 negen, 10 tien, 11 elf, 12 twaalf, 13 dertien, 14 veertien, 15 vijftien, 16 zestien, 17 zeventien, 18 achttien, 19 negentien, 20 twintig, 30 dertig, 40 veertig, 50 vijftig, 60 zestig, 70 zeventig, 80 tachtig, 90 negentig, 100 honderd.</p>
  <p><b>21 = «один-и-двадцать»</b>, как в немецком: <i>eenentwintig, tweeëntwintig, vijfendertig</i>. Пишется одним словом. Сначала единицы, потом десятки — как в старом русском «одиннадцать» (один-на-десять).</p>
  <p>Цены: <i>Het kost vijf euro.</i> — <i>euro</i> не меняется! <i>Twee euro vijftig</i> — 2,50.</p>
  <h4>Hoe laat is het?</h4>
  <p><i>Het is drie uur.</i> — 3:00. <i>Kwart over drie</i> — 3:15. <i>Kwart voor vier</i> — 3:45. <b><i>Half vier</i> — 3:30</b> (половина <b>четвёртого</b>, как по-русски!). А теперь главная ловушка: <i>vijf voor half vier</i> — 3:25 (пять до половины четвёртого), <i>vijf over half vier</i> — 3:35. «Во сколько?» — <i>om</i>: <i>om acht uur</i>.</p>
  <h4>Дни недели — с маленькой буквы</h4>
  <p><i>maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag, zondag</i>. «В понедельник» — <i>op maandag</i> или просто <i>maandag</i>; «по понедельникам» — <i>elke maandag</i>.</p>`,
  simple: 'geen — вместо een/без артикля перед существительным: geen tijd. niet — всё остальное, часто в конце. 21 = eenentwintig. half vier = 3:30. vijf voor half vier = 3:25.',
  exm: [['Ik heb geen tijd.', 'У меня нет времени.'], ['Ik werk vandaag niet.', 'Я сегодня не работаю.'], ['Het is half vier.', 'Сейчас половина четвёртого.'], ['Het kost vijfentwintig euro.', 'Это стоит двадцать пять евро.']],
  conf: [['*niet een* / *geen*', 'С <i>een</i> и без артикля — только <b>geen</b>: <i>geen fiets, geen geld</i>.', '«У меня нет велосипеда»:|Ik heb geen fiets.|Ik heb niet een fiets.|Ik niet heb fiets. # een → geen.'],
    ['*half vier* / *4:30*', '<i>half vier</i> — «половина четвёртого», то есть 3:30. Смотрим на следующий час.', '«half acht» — это…|7:30|8:30|8:00 # Половина восьмого.']],
  words: [['niet', 'не', 'Ik weet het niet.'], ['geen', 'никакой, не (с существительным)', 'Ik heb geen geld.'], ['het uur', 'час', 'Het is twee uur.'], ['half', 'половина', 'Het is half negen.'], ['het kwart', 'четверть', 'Kwart over drie.'], ['kosten', 'стоить', 'Wat kost dat?'], ['de euro', 'евро', 'Het kost tien euro.'], ['de tijd', 'время', 'Ik heb geen tijd.'], ['de week', 'неделя', 'Deze week werk ik veel.'], ['het weekend', 'выходные', 'In het weekend slaap ik lang.']],
  ex: [
    { t: 'choice', h: 'niet или geen?', q: ['Ik heb ___ fiets.|geen|niet # een fiets → geen fiets.', 'Het is ___ koud.|niet|geen # Перед прилагательным — niet.', 'Ik werk vandaag ___.|niet|geen', 'Joop heeft ___ geld.|geen|niet # Без артикля — geen.', 'Ik ga ___ naar huis.|niet|geen', 'We hebben ___ tijd.|geen|niet'] },
    { t: 'choice', h: 'Сколько времени?', q: ['half vier|3:30|4:30|3:00 # Половина четвёртого.', 'kwart over zes|6:15|5:45|6:45 # over — после.', 'kwart voor tien|9:45|10:15|10:45 # voor — до.', 'tien over twee|2:10|1:50|10:02', 'vijf voor half negen|8:25|8:55|7:55 # Пять до половины девятого.'] },
    { t: 'gap', h: 'Напишите число словом.', q: ['3 + 4 = ___|zeven', '10 + 10 = ___|twintig', '50 − 10 = ___|veertig', '20 + 1 = ___|eenentwintig # Один-и-двадцать.', '11 + 1 = ___|twaalf', '30 + 5 = ___|vijfendertig'] },
    { t: 'order', hint: 'Поставьте niet или geen на место.', q: ['Ik heb geen tijd.', 'Joop werkt vandaag niet.', 'Het is niet koud.', 'Rik wil niet fietsen.'] },
    { t: 'fix', q: ['Ik heb niet een fiets.|Ik heb geen fiets. # niet een → geen.', 'Ik niet werk vandaag.|Ik werk vandaag niet. # niet — после глагола.', 'Op Maandag fiets ik.|Op maandag fiets ik. # Дни недели — с маленькой буквы.', 'Het kost vijf euros.|Het kost vijf euro. # euro не меняется.'] },
    { t: 'tr', q: ['У меня нет времени.|Ik heb geen tijd.', 'Я не знаю.|Ik weet het niet.|Weet ik niet.', 'Сколько это стоит?|Wat kost dat?|Hoeveel kost dat?|Wat kost het?|Hoeveel kost het?', 'Который час?|Hoe laat is het?', 'Сейчас половина восьмого.|Het is half acht.'] },
  ],
  read: {
    title: 'Om half negen', intro: 'Найдите время, цену и все niet/geen.',
    txt: ['Het is acht uur. Joop en Rik staan bij een kraam. «Een patatje, graag,» zegt Joop.', '«Dat is drie euro vijftig,» zegt de man. Joop heeft geen geld. Meeuwen hebben nooit geld.', 'Rik betaalt. Hij is niet blij. «We gaan om half negen,» zegt Joop. «Niet om negen uur. Om half negen!»'],
    gl: { 'de kraam': 'ларёк', 'geld': 'деньги', 'nooit': 'никогда', 'betaalt': 'платит', 'blij': 'довольный, радостный' },
    q: [{ t: 'tf', q: ['Het patatje kost drie euro vijftig.|T', 'Joop heeft veel geld.|F # Joop heeft geen geld.', 'Rik betaalt.|T', 'Ze gaan om negen uur.|F # Om half negen.'] },
      { t: 'choice', q: ['Hoe laat gaan ze?|om half negen (8:30)|om half negen (9:30)|om negen uur', 'Waarom is Rik niet blij?|hij betaalt|het regent|hij is moe'] }],
  },
  series: [{ show: 'spreekwoord', who: 'нидерландская пословица', q: 'Wie het kleine niet eert, is het grote niet weerd.', mean: '«Кто не ценит малое, не достоин большого». Как «копейка рубль бережёт».', fun: 'Голландцы славятся бережливостью — и сами над этим шутят. В английском даже есть выражение <i>going Dutch</i> — «платить каждый за себя». Йоп с этой пословицей согласен полностью: он ценит каждый кусочек картошки. Особенно чужой.', use: 'Wie het kleine niet eert…', qz: '«Wie het kleine niet eert, is het grote niet weerd» — про то, что…|надо ценить мелочи|маленьким быть плохо|большое важнее # Как «копейка рубль бережёт».' }],
  write: { h: '3–4 короткие фразы о неделе: Op maandag … Ik werk niet op …', min: 15, use: ['niet', 'geen', 'om', 'uur'],
    plan: ['Op maandag … om … uur.', 'Op woensdag …', 'Op zaterdag … niet …', 'Op zondag heb ik geen …'],
    model: 'Op maandag sta ik om zeven uur op.\nIk werk van negen tot vijf.\nOp woensdag teken ik om half acht.\nOp zaterdag werk ik niet.\nOp zondag heb ik geen plannen.' },
  vid: [['DutchPod101', 'Dutch numbers 1-100'], ['Learn Dutch with Bart de Pau', 'telling time in Dutch half'], ['DutchPod101', 'Dutch negation niet geen']],
  fact: 'Монеты в 1 и 2 цента в Нидерландах почти не встречаются: с 2004 года сумму в магазине при оплате наличными округляют до 5 центов. А платят наличными всё реже — почти везде *pinnen*, картой. Йоп платит чужими картошками.',
  src: [['DutchGrammar.com — niet / geen', 'https://www.dutchgrammar.com/'], ['Wikibooks — Dutch numbers', 'https://en.wikibooks.org/wiki/Dutch'], ['Woordenlijst', 'https://woordenlijst.org/']],
});
NOTE('a1-6', {
  crow: '*Ik heb geen geld.* Это я. *Het is niet koud.* Это не про Нидерланды. И запомните: *half vier* — 3:30. Голландцы опаздывают на час именно из-за иностранцев, которые этого не знают.',
  mk: ['Напишите, чего у вас нет (geen).|geen|Ik heb geen auto, maar ik heb een fiets.', 'Напишите, во сколько вы встаёте.|uur/half|Ik sta om half acht op.', 'Напишите, что вы не делаете в выходные (niet).|niet|In het weekend werk ik niet.'],
  etym: [['euro', 'от *Europa*. Гульден, деньги Нидерландов почти 700 лет, ушёл в 2002 году. Пожилые голландцы до сих пор иногда пересчитывают цены в гульдены — и ужасаются.'], ['zaterdag', '«день Сатурна» — как английское *Saturday*. А *zondag* — день солнца (*zon*), *maandag* — день луны (*maan*).']],
  ru: 'Йоп и Рик покупают картошку фри у ларька. Денег у Йопа, конечно, нет. Рик платит. Отъезд — в половине девятого.',
  gl: { 'geld': 'деньги', 'betaalt': 'платит', 'blij': 'довольный', 'licht': 'фара, свет', 'wind': 'ветер', 'tegen': 'против, навстречу', 'natuurlijk': 'конечно' },
  tf: ['Joop heeft geen geld.|T', 'De fiets heeft een licht.|F # De fiets heeft geen licht.', 'De wind is tegen.|T # Natuurlijk.'],
  ch: ['Hoe laat gaan ze weg?|om half negen|om negen uur|om acht uur # Om half negen.'],
  bmk: ['Напишите, чего у вашего велосипеда (или у вашей сумки) нет.|geen|Mijn fiets heeft geen bel en geen mandje.'],
  etb: '*Tegenwind* — встречный ветер, *tegen* (против) + *wind*. Голландцы уверены: на велосипеде ветер всегда встречный, в обе стороны. Физики спорят. Велосипедисты — нет.',
});
ST('a1-6', { t: 'На рынке: сколько стоит?', tip: 'На рынке и в магазине вас спросят *Anders nog iets?* — «что-нибудь ещё?» и *Pinnen of contant?* — «картой или наличными?». *Pinnen* — платить картой, почти везде так.',
  sit: 'Сырный прилавок на рынке в Гауде.', ph: [['Wat kost dat?', 'Сколько это стоит?'], ['Anders nog iets?', 'Что-нибудь ещё?'], ['Nee, dat was het.', 'Нет, это всё.'], ['Ik wil graag pinnen.', 'Я заплачу картой.']],
  dlg: ['Продавец: «Anders nog iets?»|Nee, dank u, dat was het.|Ik heb niet een iets.|Anders! # Вежливо закончить покупку.', 'Продавец: «Pinnen of contant?»|Pinnen, graag.|Ja.|Contant pinnen. # pinnen — картой.'],
  mk: 'Купите что-нибудь: спросите цену и скажите, как заплатите.|kost|Wat kost deze kaas? Ik wil graag pinnen.' });
BK('a1-6', 'Hoofdstuk 6. Om half negen', ['Het is acht uur. Joop en Rik staan bij een kraam. Ze willen patat voor de reis.', 'Joop heeft geen geld. Rik betaalt. Hij is niet blij, maar hij zegt niets.', 'De fiets heeft geen licht en de bel doet het niet meer. «Geen probleem,» zegt Joop.', 'Om half negen fietsen ze weg. De wind is tegen. Natuurlijk is de wind tegen. Het is Nederland.']);
