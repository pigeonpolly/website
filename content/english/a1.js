// Уровень A1 — азы, коротко: закрыть пробелы. Формат уроков — в docs/site.md «Учебник английского».
U({
  id: 'a1-1', lvl: 'A1', t: 'Порядок слов: кто — делает — что', en: 'Word order: Subject — Verb — Object',
  goals: ['строить простое английское предложение без «русского» порядка слов', 'не терять подлежащее и глагол', 'ставить «где» и «когда» в конец'],
  th: `<p>В русском можно сказать «Я люблю кофе», «Кофе я люблю», «Люблю я кофе» — смысл почти не меняется. В английском <b>порядок слов и есть грамматика</b>: по месту слова понятно, кто действует, а кто — объект.</p>
  <h4>Главная схема</h4>
  <div class="tbl"><table><thead><tr><th>Кто (подлежащее)</th><th>Делает (глагол)</th><th>Что / кого</th><th>Где</th><th>Когда</th></tr></thead>
  <tbody><tr><td><i>I</i></td><td><i>drink</i></td><td><i>coffee</i></td><td><i>at work</i></td><td><i>every morning.</i></td></tr>
  <tr><td><i>Alina</i></td><td><i>draws</i></td><td><i>birds</i></td><td><i>in Riga</i></td><td><i>on Sundays.</i></td></tr>
  <tr><td><i>The cat</i></td><td><i>likes</i></td><td><i>fish.</i></td><td></td><td></td></tr></tbody></table></div>
  <p><i>The cat likes fish</i> — кошка любит рыбу. <i>Fish likes the cat</i> — уже рыба любит кошку! Поменяли места — поменялся смысл.</p>
  <h4>Три правила, которые нельзя нарушать</h4>
  <ol><li><b>В предложении всегда есть подлежащее.</b> По-русски «Холодно», «Идёт дождь», «Люблю тебя». По-английски: <i>It is cold. It is raining. I love you.</i> Если «кто» нет — ставим пустое <i>it</i> или <i>there</i>.</li>
  <li><b>В предложении всегда есть глагол.</b> «Я дома» → <i>I <b>am</b> at home</i>. «Она врач» → <i>She <b>is</b> a doctor</i>. Там, где по-русски ничего нет, по-английски стоит <i>am / is / are</i> (следующий урок).</li>
  <li><b>Наречие места — перед наречием времени.</b> <i>I work <u>in Riga</u> <u>every day</u>.</i> Время можно вынести и в начало: <i>Every day I work in Riga.</i></li></ol>
  <h4>Где стоят «часто», «всегда», «никогда»</h4>
  <p>Слова частоты (<i>always, usually, often, sometimes, never</i>) стоят <b>перед смысловым глаголом</b>, но <b>после</b> <i>am/is/are</i>: <i>I <b>often</b> drink tea.</i> — <i>I am <b>often</b> tired.</i></p>
  <h4>Почему <i>love</i>, но <i>eats</i>?</h4>
  <p>Глагол подстраивается под «кто». Если «кто» — <b>он, она, оно</b> (<i>he, she, it</i>, или одно существо: <i>my mum, the cat, Alina</i>), к глаголу добавляется <b>-s</b>: <i>She eat<b>s</b> fish. The cat like<b>s</b> milk.</i> Со всеми остальными (<i>I, you, we, they</i> и «много кого»: <i>the children</i>) — без -s: <i>They love cake. The children love their teacher.</i></p>
  <p>Подвох: <i>The children love their teacher</i> — любят дети, их много, поэтому <i>love</i>. А если перевернуть — <i>The teacher love<b>s</b> the children</i> — учитель один, и нужно уже <i>loves</i>. Подробно — в уроке A1.3 «Present Simple».</p>`,
  simple: 'сначала «кто», сразу за ним «делает», потом всё остальное. Нет «кто» — ставим it. Нет глагола — ставим am/is/are.',
  exm: [['I love you.', 'Я тебя люблю. (не «I you love»)'], ['It is cold today.', 'Сегодня холодно.'], ['We usually have lunch at one.', 'Мы обычно обедаем в час.'], ['My brother plays football in the park on Saturdays.', 'Мой брат играет в футбол в парке по субботам.']],
  conf: [['*I like it* / *I it like*', 'Объект всегда <b>после</b> глагола: <i>I like it</i>, <i>She knows him</i>. По-русски «я его знаю», по-английски только <i>I know him</i>.', 'По-английски «Я его знаю» — это …|I know him.|I him know.|Him I know. # Объект после глагола.'],
    ['*Is cold* / *It is cold*', 'Без подлежащего предложения нет: <i>It is cold. It is late. It is my birthday.</i>', '«Поздно» по-английски:|It is late.|Is late.|Late is. # Нужно подлежащее it.']],
  words: [['every day', 'каждый день', 'I drink coffee every day.'], ['usually', 'обычно', 'We usually walk to work.'], ['always', 'всегда', 'She always smiles.'], ['never', 'никогда', 'I never eat meat.'], ['sometimes', 'иногда', 'Sometimes I draw at night.'], ['at home', 'дома', 'They are at home.'], ['at work', 'на работе', 'He is at work now.'], ['weekend', 'выходные', 'I sleep a lot at the weekend.'], ['morning', 'утро', 'I read in the morning.'], ['friend', 'друг, подруга', 'My friend lives in Riga.']],
  ex: [
    { t: 'order', q: ['I drink tea every morning.', 'My sister lives in London.', 'We play chess on Fridays.', 'The children love their teacher.', 'It is very cold today.|Today it is very cold.', 'They usually have dinner at seven.', 'She never eats fish.', 'Alina draws pigeons in the park.'] },
    { t: 'choice', h: 'Какое предложение построено правильно?', q: [
      'Выберите верное:|I often go to the cinema.|I go often to the cinema.|Often I go the cinema to. # Слово частоты — перед смысловым глаголом.',
      'Выберите верное:|He is always late.|He always is late.|Always he late. # После am/is/are слово частоты ставится после глагола.',
      'Выберите верное:|It is raining.|Is raining.|Raining is. # Подлежащее нужно всегда: it.',
      'Выберите верное:|We meet our friends in the café on Sundays.|We meet on Sundays our friends in the café.|We our friends meet in the café on Sundays. # Кто — делает — кого — где — когда.',
      'Выберите верное:|My mum makes great soup.|Great soup makes my mum.|My mum great soup makes. # Если поменять местами, суп начнёт готовить маму.',
      'Выберите верное:|I am at home.|I at home.|At home I. # Нужен глагол am.'] },
    { t: 'fix', q: ['I every day drink coffee.|I drink coffee every day.|Every day I drink coffee. # «Когда» — в конец или в начало.', 'Is very late.|It is very late.|It\'s very late. # Нужно it.', 'She at work.|She is at work.|She\'s at work. # Нужен глагол is.', 'I you love.|I love you. # Объект после глагола.', 'We go sometimes to the park.|We sometimes go to the park.|Sometimes we go to the park. # sometimes — перед глаголом (или в начале).', 'They play in the garden football.|They play football in the garden. # Сначала «что», потом «где».'] },
    { t: 'tr', q: ['Я люблю кошек.|I love cats.|I like cats.', 'Сегодня холодно.|It is cold today.|Today it is cold.', 'Мы обычно гуляем в парке.|We usually walk in the park.|We usually go for a walk in the park.', 'Он всегда пьёт чай утром.|He always drinks tea in the morning.', 'Я на работе.|I am at work.'] },
  ],
  read: {
    title: 'My week', intro: 'Короткий текст — обратите внимание на порядок слов в каждом предложении.',
    txt: ['My name is Kate. I live in Riga with my cat, Biscuit. I work in a small bookshop near the river.', 'I usually get up at seven. I drink coffee and read the news. Biscuit always sleeps on my bed in the morning.', 'On Saturdays I meet my friends in a café. We talk, laugh and eat cake. On Sundays I never work. I draw in the park or watch a funny series at home.'],
    gl: { 'bookshop': 'книжный магазин', 'near': 'рядом с', 'get up': 'вставать', 'news': 'новости', 'laugh': 'смеяться', 'draw': 'рисовать', 'series': 'сериал' },
    q: [{ t: 'tf', q: ['Kate lives alone.|F # Она живёт с кошкой Biscuit.', 'Kate works in a bookshop.|T', 'The cat sleeps on the bed in the morning.|T', 'Kate works on Sundays.|F # On Sundays I never work.'] },
      { t: 'choice', q: ['What does Kate do on Saturdays?|She meets her friends.|She works.|She sleeps all day.', 'When does Kate get up?|at seven|at nine|at eleven'] }],
  },
  write: { h: 'Напишите 5–6 предложений о своей обычной неделе по схеме «кто — делает — что — где — когда».', min: 35, use: ['usually', 'always', 'never', 'every day', 'at the weekend'],
    plan: ['Как вас зовут и где вы живёте.', 'Что делаете утром (usually, always).', 'Что делаете по выходным.', 'Чего не делаете никогда (never).'],
    model: 'My name is Anna. I live in Riga.\nI usually get up at eight. I always drink coffee in the morning.\nI work at a school every day. At the weekend I visit my parents or read at home.\nI never watch horror films.' },
  vid: [['BBC Learning English', 'word order basic sentence'], ['English with Lucy', 'English sentence structure'], ['engVid', 'word order adverbs of frequency']],
  fact: 'Порядок слов в английском закрепился около 1000 лет назад. В древнеанглийском, как в русском, были падежные окончания, и слова можно было переставлять. Окончания постепенно отпали — и роль «кто кого» взял на себя порядок слов.',
  src: [['British Council — A1–A2 grammar', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — English Grammar Today', 'https://dictionary.cambridge.org/grammar/british-grammar/'], ['Wikibooks — English Grammar', 'https://en.wikibooks.org/wiki/English_Grammar']],
});

U({
  id: 'a1-2', lvl: 'A1', t: 'Глагол to be: am, is, are', en: 'The verb "to be"',
  goals: ['говорить, кто вы, откуда и как себя чувствуете', 'задавать вопросы и отрицать с am / is / are', 'не ставить be рядом с обычным глаголом без нужды'],
  th: `<p><i>To be</i> — «быть, являться, находиться». В русском в настоящем времени его почти не слышно («Я — врач», «Он дома»), а в английском он обязателен.</p>
  <div class="tbl"><table><thead><tr><th>Кто</th><th>+</th><th>−</th><th>?</th></tr></thead><tbody>
  <tr><td><i>I</i></td><td><i>I am (I'm) happy.</i></td><td><i>I am not (I'm not) happy.</i></td><td><i>Am I happy?</i></td></tr>
  <tr><td><i>he / she / it</i></td><td><i>She is (she's) at home.</i></td><td><i>She is not (isn't) at home.</i></td><td><i>Is she at home?</i></td></tr>
  <tr><td><i>you / we / they</i></td><td><i>They are (they're) friends.</i></td><td><i>They are not (aren't) friends.</i></td><td><i>Are they friends?</i></td></tr></tbody></table></div>
  <h4>Когда нужен to be</h4>
  <ul><li>кто или что: <i>I am a designer.</i></li><li>какой: <i>The film is funny.</i></li><li>где: <i>We are in the kitchen.</i></li><li>возраст: <i>I am thirty.</i> (не «I have thirty»)</li><li>чувства и состояния: <i>I am hungry / tired / cold.</i> (не «I have cold»)</li></ul>
  <h4>Вопрос — меняем местами</h4>
  <p><i>You are tired.</i> → <i><b>Are</b> you tired?</i> С вопросительным словом: <i>Where <b>are</b> you? How old <b>is</b> he? What <b>is</b> your name?</i></p>
  <p>Короткие ответы: <i>Are you tired? — Yes, I am. / No, I'm not.</i> В положительном коротком ответе не сокращают: не «Yes, I'm».</p>`,
  simple: 'там, где по-русски «пусто» или тире, по-английски стоит am, is или are.',
  conf: [['*I am work* / *I work*', 'С обычным глаголом <i>am/is/are</i> не нужен: <i>I work</i>, <i>She likes tea</i>. «I am work» — ошибка. <i>I am working</i> — это уже другое время (урок A2).', 'Как сказать «Я работаю в банке»?|I work in a bank.|I am work in a bank.|I working in a bank. # С обычным глаголом am не ставим.'],
    ['*I am 25* / *I have 25*', 'Возраст — через <i>be</i>: <i>I am 25 (years old)</i>.', '«Мне 30 лет»:|I am thirty.|I have thirty.|Me is thirty. # Возраст — через be.']],
  words: [['hungry', 'голодный', 'I am hungry. Let\'s eat!'], ['tired', 'уставший', 'She is tired after work.'], ['busy', 'занятой', 'Are you busy now?'], ['happy', 'счастливый, довольный', 'We are happy here.'], ['late', 'поздно, опоздавший', 'Sorry, I am late.'], ['ready', 'готовый', 'Is dinner ready?'], ['from', 'из (откуда)', 'He is from Latvia.'], ['married', 'женатый, замужем', 'They are married.'], ['angry', 'злой, сердитый', 'Why are you angry?'], ['sure', 'уверенный', 'Are you sure?']],
  ex: [
    { t: 'gap', q: ['I ___ a student.|am', 'My parents ___ at home.|are', 'It ___ very hot today.|is', '___ you from Riga?|Are', 'She ___ not my sister, she is my cousin.|is', 'Where ___ my keys?|are', 'The coffee ___ cold.|is', 'We ___ (not) ready yet.|are not/aren\'t'] },
    { t: 'choice', q: ['___ he your brother?|Is|Are|Am', 'They ___ in the garden.|are|is|am', 'Are you hungry? — Yes, I ___.|am|\'m|is # В коротком «да» не сокращают: Yes, I am.', 'How old ___ your cat?|is|are|has', 'I ___ cold. Close the window, please.|am|have|is # Состояние — через be.'] },
    { t: 'order', q: ['Where are you from?', 'My brother is a doctor.', 'Are your friends at the party?', 'I am not tired today.|I\'m not tired today.', 'What is your name?', 'The film is very funny.'] },
    { t: 'fix', q: ['I have 25 years.|I am 25.|I am 25 years old.|I\'m 25.|I\'m 25 years old.', 'She very happy.|She is very happy.|She\'s very happy.', 'Is they at school?|Are they at school?', 'I am work in an office.|I work in an office.', 'He are my friend.|He is my friend.|He\'s my friend.', 'Yes, I\'m.|Yes, I am. # В коротком ответе — полная форма.'] },
    { t: 'tr', q: ['Я голоден.|I am hungry.', 'Где ты?|Where are you?', 'Мы не заняты.|We are not busy.', 'Она из Латвии.|She is from Latvia.', 'Ты уверен?|Are you sure?'] },
  ],
  read: {
    title: 'A message from a new friend',
    txt: ['Hi! My name is Tom. I am from Manchester, but now I am in Riga. I am a programmer and I am twenty-eight. My office is in the old town. It is small, but it is very nice.', 'My sister Emma is here too. She is a teacher. She is not married, and she is always busy! Our flat is near the park. Are you free on Saturday? We are at the café on the corner at five. Are you ready for good coffee?'],
    gl: { 'old town': 'старый город', 'flat': 'квартира', 'free': 'свободный', 'corner': 'угол' },
    q: [{ t: 'tf', q: ['Tom is from Riga.|F # He is from Manchester.', 'Tom is twenty-eight.|T', 'Emma is married.|F', 'The flat is near the park.|T'] },
      { t: 'choice', q: ['What is Emma\'s job?|She is a teacher.|She is a programmer.|She is a doctor.', 'Where is the office?|in the old town|near the river|in Manchester'] }],
  },
  write: { h: 'Представьтесь в 5–7 предложениях: имя, откуда вы, сколько лет, кем работаете, какой вы сейчас (tired, happy, busy…).', min: 35, use: ['from', 'happy', 'busy', 'tired'],
    model: 'Hello! My name is Marta. I am from Latvia and I am thirty-two.\nI am a designer. My office is in Riga.\nToday I am happy, but I am a bit tired. My friends are at the cinema, and I am at home with my cat.' },
  vid: [['BBC Learning English', 'verb to be am is are'], ['English with Lucy', 'verb to be'], ['Learn English with EnglishClass101', 'to be am is are beginners']],
  fact: 'Глагол <i>be</i> — самый неправильный в английском: у него восемь форм (be, am, is, are, was, were, been, being). Они пришли из трёх разных древних корней.',
  src: [['British Council — be', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Be', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a1-3', lvl: 'A1', t: 'Present Simple: что бывает обычно', en: 'Present Simple',
  goals: ['рассказывать о привычках, работе, фактах', 'не забывать -s у he / she / it', 'строить вопросы и отрицания с do / does'],
  th: `<p>Present Simple — время для того, что происходит <b>обычно, регулярно или всегда</b>: привычки, расписание, факты. <i>I work in Riga. Water boils at 100 degrees.</i></p>
  <div class="tbl"><table><thead><tr><th></th><th>I / you / we / they</th><th>he / she / it</th></tr></thead><tbody>
  <tr><td>+</td><td><i>I work.</i></td><td><i>She work<b>s</b>.</i></td></tr>
  <tr><td>−</td><td><i>I <b>do not</b> (don't) work.</i></td><td><i>She <b>does not</b> (doesn't) work.</i></td></tr>
  <tr><td>?</td><td><i><b>Do</b> you work?</i></td><td><i><b>Does</b> she work?</i></td></tr></tbody></table></div>
  <h4>Правило «одной S»</h4>
  <p>У <i>he/she/it</i> окончание <b>-s</b> стоит один раз: либо у глагола, либо у <i>does</i>. <i>She works.</i> — <i>Does she work?</i> (не «Does she works?») — <i>She doesn't work.</i></p>
  <h4>Как пишется -s</h4>
  <ul><li>обычно + s: <i>work → works, play → plays</i></li><li>после s, sh, ch, x, o + es: <i>watch → watches, go → goes, do → does</i></li><li>согласная + y → ies: <i>study → studies</i> (но <i>play → plays</i>)</li><li>исключение: <i>have → has</i></li></ul>
  <h4>Слова-подсказки</h4><p><i>always, usually, often, sometimes, never, every day, on Mondays, at the weekend, twice a week</i>.</p>
  <h4>Вопросы с вопросительным словом</h4><p>Схема <b>Вопрос-слово + do/does + кто + глагол</b>: <i>Where do you live? What does she do? How often do they swim?</i></p>`,
  simple: 'привычки и факты. У he/she/it — одна буква s: She works, но Does she work?',
  conf: [['*Does she works* / *Does she work*', 'S уже «ушла» в <i>does</i> — у глагола её нет: <i>Does he like jazz? He doesn\'t like jazz.</i>', 'Выберите верное:|Does he like jazz?|Does he likes jazz?|Do he likes jazz? # Одна S: в does.'],
    ['*I don\'t* / *I am not*', '<i>Don\'t / doesn\'t</i> — с обычными глаголами (<i>I don\'t know</i>). <i>Am not / isn\'t / aren\'t</i> — с be (<i>I\'m not sure</i>).', '«Я не знаю»:|I don\'t know.|I am not know.|I not know.']],
  words: [['get up', 'вставать', 'I get up at seven.'], ['have breakfast', 'завтракать', 'We have breakfast together.'], ['go to work', 'ходить на работу', 'She goes to work by bus.'], ['finish', 'заканчивать', 'He finishes work at six.'], ['cook', 'готовить', 'My dad cooks on Sundays.'], ['watch', 'смотреть', 'We watch films on Friday.'], ['often', 'часто', 'Do you often travel?'], ['twice a week', 'два раза в неделю', 'I swim twice a week.'], ['live', 'жить', 'Where do you live?'], ['want', 'хотеть', 'She wants a cat.'], ['need', 'нуждаться, нужно', 'I need help.'], ['know', 'знать', 'Do you know him?']],
  ex: [
    { t: 'gap', q: ['She ___ (live) in Paris.|lives', 'My brother ___ (watch) football every weekend.|watches', 'I ___ (not / like) cold weather.|don\'t like/do not like', '___ your mum work on Saturdays?|Does', 'He ___ (study) English at night.|studies', 'They ___ (not / eat) meat.|don\'t eat/do not eat', 'Where ___ you work?|do', 'The film ___ (start) at eight.|starts', 'My cat ___ (have) blue eyes.|has', 'What time ___ the shop open?|does'] },
    { t: 'choice', q: ['___ she speak French?|Does|Do|Is', 'He ___ coffee in the evening.|doesn\'t drink|don\'t drink|doesn\'t drinks', 'We ___ to the gym on Mondays.|go|goes|are go', 'My friends ___ in a band.|play|plays|playing', 'I ___ understand this word.|don\'t|am not|doesn\'t'] },
    { t: 'order', q: ['What time do you get up?', 'She doesn\'t eat breakfast.', 'My father works in a hospital.', 'How often do you go to the cinema?', 'Does your sister like cats?', 'We never watch TV in the morning.'] },
    { t: 'fix', q: ['He work in a bank.|He works in a bank.', 'Does she likes pizza?|Does she like pizza?', 'I doesn\'t know.|I don\'t know.|I do not know.', 'She don\'t speak Russian.|She doesn\'t speak Russian.|She does not speak Russian.', 'Where you live?|Where do you live?', 'My sister studys law.|My sister studies law.'] },
    { t: 'tr', q: ['Она работает дома.|She works at home.|She works from home.', 'Ты любишь кофе?|Do you like coffee?', 'Он не знает её.|He doesn\'t know her.|He does not know her.', 'Где живёт твой брат?|Where does your brother live?', 'Мы часто готовим вместе.|We often cook together.'] },
  ],
  read: {
    title: 'A day of an illustrator',
    txt: ['Mira is an illustrator. She works at home, in a small room with a big window. She gets up at eight and has breakfast with her husband, Sam. Sam doesn\'t work at home; he goes to the office by bike.', 'Mira starts work at nine. She draws for children\'s books and magazines. She doesn\'t like noise, so she listens to quiet music. At one o\'clock she has lunch and walks her dog, Pepper.', 'In the evening Mira and Sam cook dinner together. They often watch a comedy series. Mira says: "I don\'t need a big office. I need good light, coffee and a happy dog."'],
    gl: { 'illustrator': 'иллюстратор', 'noise': 'шум', 'quiet': 'тихий', 'magazines': 'журналы', 'light': 'свет' },
    q: [{ t: 'tf', q: ['Mira works in an office.|F', 'Sam goes to work by bike.|T', 'Mira likes noise.|F', 'They cook dinner together.|T'] },
      { t: 'gap', q: ['Mira ___ (start) work at nine.|starts', 'Sam ___ (not / work) at home.|doesn\'t work/does not work', '___ Mira walk her dog at one? — Yes.|Does'] }],
  },
  write: { h: 'Опишите свой обычный день (или день друга) — 6–8 предложений в Present Simple. Хотя бы два предложения — про he или she.', min: 45, use: ['get up', 'often', 'never', 'finish', 'cook'],
    model: 'I get up at seven and have breakfast. My husband doesn\'t eat in the morning, he only drinks coffee.\nI go to work by tram. I finish work at five.\nIn the evening we often cook together. My son plays the guitar, and our cat watches him.\nI never go to bed after midnight.' },
  vid: [['BBC Learning English', 'present simple'], ['English with Lucy', 'present simple tense'], ['Oxford Online English', 'present simple'], ['engVid', 'present simple do does']],
  fact: 'Окончание <i>-s</i> у he/she/it — единственный «осколок» старых личных окончаний. Когда-то у глагола были разные окончания почти для каждого лица, как в русском.',
  src: [['British Council — Present simple', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Present simple', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a1-4', lvl: 'A1', t: 'Артикли a / an / the и множественное число', en: 'Articles and plurals',
  goals: ['понимать, когда a, когда the, а когда ничего', 'образовывать множественное число, включая особые слова', 'не путать a и an'],
  th: `<p>Артикль — маленькое слово перед существительным. По-русски его нет, поэтому его часто забывают. Самый простой способ понять:</p>
  <ul><li><b>a / an</b> = «какой-то, один из многих», впервые упоминаем: <i>I have <b>a</b> cat.</i></li>
  <li><b>the</b> = «тот самый», понятно какой: <i><b>The</b> cat is black.</i> (тот, про которого уже сказали)</li>
  <li><b>без артикля</b> — когда говорим вообще о многих или о веществе: <i>I like cats. I drink coffee.</i></li></ul>
  <h4>a или an — решает звук</h4><p><i>an</i> — перед гласным <b>звуком</b>: <i>an apple, an hour</i> (h не читается). <i>a</i> — перед согласным звуком: <i>a book, a university</i> (звучит «ю»).</p>
  <h4>The всегда</h4><p>Единственное в своём роде: <i>the sun, the moon, the internet</i>; с превосходной степенью: <i>the best</i>; с реками, морями, океанами: <i>the Daugava, the Baltic Sea</i>.</p>
  <h4>Без артикля</h4><p>Имена, города, страны (<i>Riga, Latvia</i>, но <i>the USA, the UK</i>), языки, приёмы пищи (<i>have breakfast</i>), <i>at home, at work, by bus</i>.</p>
  <h4>Множественное число</h4>
  <ul><li>+s: <i>book → books</i>; после s, sh, ch, x +es: <i>box → boxes, watch → watches</i></li><li>согласная + y → ies: <i>city → cities</i></li><li>особые: <i>man → men, woman → women, child → children, person → people, foot → feet, tooth → teeth, mouse → mice</i></li><li>одинаковые: <i>sheep, fish</i></li></ul>
  <p>С множественным числом <i>a/an</i> не бывает: <i>a cat → cats</i>, но <i>the cat → the cats</i>.</p>`,
  simple: 'a — «какой-то один», the — «тот самый», ничего — «вообще» или много.',
  conf: [['*a* / *an*', 'Решает звук, а не буква: <i>an hour</i>, <i>a uniform</i>, <i>an MP3</i>.', 'Выберите:|an hour|a hour # h не читается, первый звук — гласный.'],
    ['*I like the cats* / *I like cats*', 'Про всех кошек вообще — без артикля. <i>The cats</i> — конкретные, «эти кошки».', '«Я люблю собак (вообще)»:|I like dogs.|I like the dogs.|I like a dogs.']],
  words: [['apple', 'яблоко', 'An apple a day keeps the doctor away.'], ['hour', 'час', 'The film is two hours long.'], ['child / children', 'ребёнок / дети', 'The children are in the garden.'], ['person / people', 'человек / люди', 'Ten people work here.'], ['city', 'город', 'Riga is a beautiful city.'], ['river', 'река', 'The river is cold in May.'], ['moon', 'луна', 'Look at the moon!'], ['university', 'университет', 'She studies at a university.'], ['shelf', 'полка', 'The books are on the shelf.'], ['tooth / teeth', 'зуб / зубы', 'Brush your teeth.']],
  ex: [
    { t: 'choice', q: ['I have ___ idea!|an|a|— # idea начинается с гласного звука.', 'She is ___ best student in the class.|the|a|— # Превосходная степень — the.', 'We live in ___ small flat. ___ flat is near the station.|a … The|the … A|a … A', 'I love ___ music.|—|the|a # Музыка вообще.', 'He is ___ honest man.|an|a # h не читается.', 'Look at ___ sun!|the|a|—', 'She works at ___ university.|a|an # university звучит с «ю» — согласный звук.', 'They have breakfast at ___ eight.|—|the|an'] },
    { t: 'gap', h: 'Напишите множественное число.', q: ['one child — two ___|children', 'one woman — three ___|women', 'one city — many ___|cities', 'one box — two ___|boxes', 'one tooth — all my ___|teeth', 'one person — five ___|people', 'one mouse — two ___|mice', 'one day — seven ___|days'] },
    { t: 'fix', q: ['I have a two cats.|I have two cats.', 'She is a my friend.|She is my friend.|She\'s my friend.', 'Moon is very bright tonight.|The moon is very bright tonight.', 'I want an banana.|I want a banana.', 'There are three mans in the room.|There are three men in the room.', 'He plays the football.|He plays football. # Спорт — без артикля.'] },
    { t: 'order', q: ['The children are in the garden.', 'I need an umbrella today.', 'Riga is a beautiful city.', 'The book on the table is mine.'] },
  ],
  read: {
    title: 'The bird on the balcony',
    txt: ['Every morning a bird visits my balcony. It is a small grey pigeon with a white spot on its head. I call it Polly. Polly likes bread, but bread is not good for birds, so I give it seeds.', 'One day Polly comes with a friend. The friend is a big pigeon with a green neck. The two birds eat the seeds and look at me. Now I have two guests every morning — and the neighbours think I am a bird hotel!'],
    gl: { 'balcony': 'балкон', 'spot': 'пятно', 'seeds': 'семена, зёрна', 'neck': 'шея', 'guests': 'гости', 'neighbours': 'соседи' },
    q: [{ t: 'tf', q: ['The pigeon is grey.|T', 'Bread is good for birds.|F', 'Polly\'s friend has a green neck.|T'] },
      { t: 'choice', q: ['Why does the text say «a bird» first and then «the bird»?|First it is new, then we know which bird.|There is no difference.|Because the bird is big. # a — впервые, the — уже знакомая.', '«The neighbours think I am a bird hotel» — это …|a joke|a sad fact|a rule'] }],
  },
  write: { h: 'Опишите свою комнату или любимое место: 5–7 предложений. Следите за a / an / the.', min: 35, use: ['shelf', 'window', 'the', 'a'],
    model: 'My room is small but cosy. There is a big window and a desk under the window.\nThe desk is white. On the desk there is a lamp and an old laptop.\nI have a shelf with books and plants. The plants are my favourite thing in the room.' },
  vid: [['BBC Learning English', 'articles a an the'], ['English with Lucy', 'articles a an the'], ['engVid', 'a an the articles']],
  fact: 'Слово <i>an</i> старше, чем <i>a</i>: оно произошло от древнеанглийского <i>ān</i> — «один». Перед согласными <i>n</i> со временем отпала, и получилось <i>a</i>.',
  src: [['British Council — Articles', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Articles', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a1-5', lvl: 'A1', t: 'There is / there are и предлоги места', en: 'There is / there are, prepositions of place',
  goals: ['говорить, что где есть', 'правильно ставить in, on, at, under, next to', 'не путать there is и it is'],
  th: `<p>Когда хотим сказать, что что-то <b>где-то есть</b>, по-английски начинаем с <i>there is / there are</i>. По-русски «В комнате есть диван» — по-английски <i>There is a sofa in the room.</i></p>
  <div class="tbl"><table><thead><tr><th></th><th>одно / неисчисляемое</th><th>много</th></tr></thead><tbody>
  <tr><td>+</td><td><i>There is (there's) a park near my house.</i></td><td><i>There are two cafés.</i></td></tr>
  <tr><td>−</td><td><i>There isn't a cinema.</i></td><td><i>There aren't any shops.</i></td></tr>
  <tr><td>?</td><td><i>Is there a bank here?</i></td><td><i>Are there any good restaurants?</i></td></tr></tbody></table></div>
  <h4>Предлоги места</h4>
  <ul><li><i>in</i> — внутри: <i>in the box, in Riga, in the kitchen</i></li><li><i>on</i> — на поверхности: <i>on the table, on the wall, on the floor</i></li><li><i>at</i> — в точке: <i>at the door, at the bus stop, at home, at work</i></li><li><i>under</i> — под; <i>above</i> — над; <i>next to</i> — рядом; <i>between</i> — между; <i>behind</i> — позади; <i>in front of</i> — перед; <i>opposite</i> — напротив</li></ul>
  <h4>There is или it is?</h4><p><i>There is</i> — сообщаем, что что-то есть. <i>It is</i> — описываем то, о чём уже сказали: <i>There is a café on the corner. It is very cosy.</i></p>`,
  simple: 'хотим сказать «есть, имеется где-то» — начинаем с there is / there are, а «где» ставим в конец.',
  conf: [['*There is* / *It is*', 'Сначала «есть» — <i>There is a lake.</i> Потом описание — <i>It is beautiful.</i>', '«На углу есть кафе»:|There is a café on the corner.|It is a café on the corner.|On the corner is café.'],
    ['*in* / *on* (о стене, картинке)', 'Картинка <b>на</b> стене — <i>on the wall</i>; человек <b>на</b> картинке — <i>in the picture</i>.', 'Человек на фотографии:|the man in the photo|the man on the photo # На изображении — in.']],
  words: [['near', 'рядом, недалеко', 'Is there a shop near here?'], ['next to', 'рядом с (вплотную)', 'The bank is next to the café.'], ['between', 'между', 'The cat is between the boxes.'], ['opposite', 'напротив', 'The school is opposite the park.'], ['behind', 'за, позади', 'The bike is behind the door.'], ['in front of', 'перед', 'There is a tree in front of my house.'], ['above', 'над', 'There is a lamp above the table.'], ['corner', 'угол', 'There is a café on the corner.'], ['square', 'площадь', 'The market is in the main square.'], ['neighbourhood', 'район (где живёшь)', 'My neighbourhood is quiet.']],
  ex: [
    { t: 'gap', q: ['___ a cat on my bed!|There is/There\'s', '___ any milk in the fridge?|Is there', '___ two windows in the kitchen.|There are', 'There ___ any shops in my street.|aren\'t/are not', 'The keys are ___ the table.|on', 'She is ___ home now.|at', 'My flat is ___ the third floor.|on', 'The cat is hiding ___ the bed.|under'] },
    { t: 'choice', q: ['There ___ a lot of people in the square.|are|is # people — множественное число.', '___ a good café here? — Yes, it\'s on the left.|Is there|Is it|There is', 'Wait for me ___ the bus stop.|at|in|on', 'There is a lake near the town. ___ very deep.|It is|There is', 'The picture is ___ the wall.|on|in|at'] },
    { t: 'order', q: ['There is a bakery opposite my house.', 'Are there any parks in your neighbourhood?', 'The cat is between the two boxes.', 'There aren\'t any chairs in the room.'] },
    { t: 'tr', q: ['В холодильнике есть сыр.|There is cheese in the fridge.|There is some cheese in the fridge.', 'Рядом с банком есть кафе.|There is a café next to the bank.', 'Здесь есть парк?|Is there a park here?', 'В моей комнате два окна.|There are two windows in my room.'] },
  ],
  read: {
    title: 'My street',
    txt: ['I live on a quiet street in Riga. There is a small bakery on the corner. It opens at seven, and the bread is always warm. Opposite the bakery there is a park with old trees and a pond.', 'There aren\'t any big shops in my street, but there is a market in the square. Next to my house there is a flower shop. The owner, Mr Ozols, always says "Good morning!" in three languages.'],
    gl: { 'bakery': 'пекарня', 'pond': 'пруд', 'market': 'рынок', 'owner': 'владелец' },
    q: [{ t: 'tf', q: ['There is a bakery on the corner.|T', 'There are big shops in the street.|F', 'The flower shop is next to the house.|T'] },
      { t: 'choice', q: ['What is opposite the bakery?|a park|a market|a flower shop'] }],
  },
  write: { h: 'Опишите улицу или район, где вы живёте: что там есть и где оно находится. 6–8 предложений.', min: 40, use: ['there is', 'there are', 'next to', 'opposite', 'near'],
    model: 'I live in a green neighbourhood. There is a big park near my house.\nThere are two supermarkets and a pharmacy. The pharmacy is next to the bus stop.\nOpposite my building there is a school, so it is noisy in the morning.\nThere isn\'t a cinema, but there is a cosy café on the corner.' },
  vid: [['BBC Learning English', 'there is there are'], ['English with Lucy', 'prepositions of place in on at'], ['engVid', 'prepositions in on at place']],
  fact: 'В английском около 150 предлогов, но 10 самых частых (of, in, to, for, with, on, at, by, from, about) — это большая часть всех предлогов в текстах.',
  src: [['British Council — There is/are', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — There is, there are', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a1-6', lvl: 'A1', t: 'Can, вопросы и «чей»: my, your, Kate\'s', en: 'Can, question words, possessives',
  goals: ['говорить, что вы умеете и что можно', 'задавать вопросы с who, what, where, when, why, how', 'говорить «мой, твой, Катин» без ошибок'],
  th: `<h4>Can — могу, умею, можно</h4>
  <p><i>Can</i> одинаковый для всех лиц, после него — глагол без <i>to</i> и без <i>-s</i>: <i>She <b>can</b> swim.</i> (не «She cans swims», не «can to swim»).</p>
  <p>Отрицание: <i>can't (cannot)</i>. Вопрос: <i><b>Can</b> you help me?</i> — Yes, I can. / No, I can't.</p>
  <h4>Вопросительные слова</h4>
  <p><i>who</i> — кто · <i>what</i> — что, какой · <i>where</i> — где, куда · <i>when</i> — когда · <i>why</i> — почему · <i>how</i> — как · <i>how much / how many</i> — сколько · <i>which</i> — который (из выбора) · <i>whose</i> — чей</p>
  <p>Схема вопроса: <b>Вопрос-слово + вспомогательный глагол (do/does/is/are/can) + кто + глагол</b>: <i>Where <b>can</b> I park? What <b>do</b> you want? Why <b>is</b> he angry?</i></p>
  <h4>Чей: притяжательные слова</h4>
  <div class="tbl"><table><thead><tr><th>кто</th><th>чей (перед словом)</th><th>чей (без слова)</th></tr></thead><tbody>
  <tr><td><i>I</i></td><td><i>my bag</i></td><td><i>It's mine.</i></td></tr><tr><td><i>you</i></td><td><i>your bag</i></td><td><i>yours</i></td></tr><tr><td><i>he</i></td><td><i>his bag</i></td><td><i>his</i></td></tr><tr><td><i>she</i></td><td><i>her bag</i></td><td><i>hers</i></td></tr><tr><td><i>it</i></td><td><i>its tail</i></td><td>—</td></tr><tr><td><i>we</i></td><td><i>our flat</i></td><td><i>ours</i></td></tr><tr><td><i>they</i></td><td><i>their car</i></td><td><i>theirs</i></td></tr></tbody></table></div>
  <p>«Катин, мамин» — через <b>'s</b>: <i>Kate<b>'s</b> phone, my mum<b>'s</b> car</i>. У множественного на -s — только апостроф: <i>my parents<b>'</b> house</i>.</p>`,
  simple: 'can + голый глагол. Вопрос: слово-вопрос + помощник + кто + глагол. «Чей» — my, your, his, her… или ’s.',
  conf: [['*its* / *it\'s*', '<i>its</i> — «его/её» (о предмете, животном): <i>The dog wags its tail.</i> <i>it\'s</i> = <i>it is</i>: <i>It\'s cold.</i>', 'The cat is licking ___ paw.|its|it\'s # «Свою лапу» — its, без апострофа.'],
    ['*his* / *her*', 'По-русски «свой» — по-английски выбираем по владельцу: <i>She loves <b>her</b> brother. He loves <b>his</b> sister.</i>', 'Anna calls ___ mum every day.|her|his|its'],
    ['*who\'s* / *whose*', '<i>who\'s</i> = who is; <i>whose</i> — чей: <i>Whose bag is this? Who\'s that?</i>', '___ jacket is this?|Whose|Who\'s']],
  words: [['swim', 'плавать', 'Can you swim?'], ['drive', 'водить машину', 'I can\'t drive.'], ['help', 'помогать', 'Can you help me, please?'], ['borrow', 'брать на время', 'Can I borrow your pen?'], ['whose', 'чей', 'Whose phone is this?'], ['why', 'почему', 'Why are you sad?'], ['how many', 'сколько (штук)', 'How many cats do you have?'], ['how much', 'сколько (денег, вещества)', 'How much is this?'], ['mine', 'мой (без слова после)', 'This coffee is mine.'], ['speak', 'говорить (на языке)', 'She can speak three languages.']],
  ex: [
    { t: 'choice', q: ['She can ___ the piano.|play|plays|to play', '___ you speak German?|Can|Do can|Are', 'This is not my umbrella. Is it ___?|yours|your|you', '___ is your birthday? — In July.|When|Where|Who', '___ do you go to work? — By bus.|How|What|Why', 'The dog is eating ___ dinner.|its|it\'s|his', 'This is ___ room.|my sister\'s|my sisters|my sister', '___ are you laughing? — Because the film is funny!|Why|Where|Whose'] },
    { t: 'gap', q: ['___ many languages can you speak?|How', '___ is that man? — He\'s my boss.|Who', 'Tom and Jane love ___ new flat.|their', 'Is this ___ (Anna) bag?|Anna\'s', 'I ___ (not / can) hear you.|can\'t/cannot', '___ much is the ticket?|How'] },
    { t: 'order', q: ['Can you help me with this box?', 'Where can I buy a ticket?', 'Whose coat is this?', 'Why do you want to learn English?', 'My brother can\'t swim.', 'How many people live in your flat?'] },
    { t: 'fix', q: ['He can speaks English.|He can speak English.', 'Can you to help me?|Can you help me?', 'Where you can buy bread?|Where can you buy bread?', 'This is Kate phone.|This is Kate\'s phone.', 'The company changed it\'s logo.|The company changed its logo.'] },
    { t: 'tr', q: ['Я умею рисовать.|I can draw.', 'Можно взять твою ручку?|Can I borrow your pen?|Can I take your pen?', 'Чья это кошка?|Whose cat is this?|Whose is this cat?', 'Почему ты устал?|Why are you tired?'] },
  ],
  read: {
    title: 'The talent show',
    txt: ['Our office has a talent show every December. Everyone can take part. My colleague Raj can juggle five oranges. Our boss, Linda, can sing opera — her voice is amazing!', 'I can\'t sing and I can\'t juggle. What can I do? I can draw very fast. So this year I draw funny portraits of my colleagues in one minute each. Whose portrait is the funniest? Linda\'s — she has a crown and a microphone!'],
    gl: { 'talent show': 'конкурс талантов', 'take part': 'участвовать', 'juggle': 'жонглировать', 'voice': 'голос', 'portraits': 'портреты', 'crown': 'корона' },
    q: [{ t: 'tf', q: ['Raj can juggle.|T', 'The writer can sing.|F', 'Linda\'s portrait has a crown.|T'] },
      { t: 'choice', q: ['What can the writer do?|draw very fast|sing opera|juggle oranges', 'How often is the talent show?|once a year|every month|every week'] }],
  },
  write: { h: 'Напишите о себе: что умеете и что не умеете (can / can\'t), и задайте 3 вопроса другу.', min: 40, use: ['can', 'can\'t', 'speak', 'swim', 'why'],
    model: 'I can speak three languages: Latvian, Russian and English. I can draw and I can cook good soup.\nI can\'t drive, and I can\'t swim very well.\nMy questions for you: Can you play the guitar? What languages can you speak? Why do you want to learn English?' },
  vid: [['BBC Learning English', 'can and can\'t ability'], ['English with Lucy', 'question words'], ['engVid', 'possessive adjectives pronouns my mine']],
  fact: 'Путаница <i>its / it\'s</i> настолько частая, что её делают даже носители языка — в том числе в рекламе и на вывесках. Запомните проверку: если можно сказать <i>it is</i> — нужен апостроф.',
  src: [['British Council — can', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Questions', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});
