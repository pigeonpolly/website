// Уровень A2 — коротко: прошлое, будущее, сравнения, количество, первое знакомство с Present Perfect.
U({
  id: 'a2-1', lvl: 'A2', t: 'Past Simple: что было', en: 'Past Simple',
  goals: ['рассказывать о прошлом: вчера, в прошлом году, в детстве', 'знать главные неправильные глаголы', 'строить вопросы и отрицания с did'],
  th: `<p>Past Simple — законченное действие в прошлом, часто с указанием когда: <i>yesterday, last week, in 2019, two days ago, when I was a child</i>.</p>
  <div class="tbl"><table><thead><tr><th></th><th>правильные</th><th>неправильные</th><th>be</th></tr></thead><tbody>
  <tr><td>+</td><td><i>I work<b>ed</b>.</i></td><td><i>I <b>went</b>.</i></td><td><i>I/he/she/it <b>was</b>; you/we/they <b>were</b></i></td></tr>
  <tr><td>−</td><td><i>I <b>didn't</b> work.</i></td><td><i>I <b>didn't</b> go.</i></td><td><i>I wasn't; they weren't</i></td></tr>
  <tr><td>?</td><td><i><b>Did</b> you work?</i></td><td><i><b>Did</b> you go?</i></td><td><i>Was she…? Were they…?</i></td></tr></tbody></table></div>
  <h4>Правило «одного прошлого»</h4><p>Прошедшее время показывается один раз: либо в глаголе (<i>went</i>), либо в <i>did</i>. Поэтому <i>Did you go?</i> (не «Did you went?»), <i>I didn't see</i> (не «didn't saw»).</p>
  <h4>Как пишется -ed</h4><ul><li><i>work → worked, play → played</i></li><li>на -e: <i>live → lived</i></li><li>согласная + y: <i>study → studied</i></li><li>короткие с ударной гласной: <i>stop → stopped, plan → planned</i></li></ul>
  <h4>Произношение -ed</h4><p>[t] после глухих: <i>worked, watched</i>; [d] после звонких и гласных: <i>played, lived</i>; [ɪd] после t и d: <i>wanted, needed</i>. Не говорите «work-ED» во всех словах!</p>
  <p>Главные неправильные глаголы — в справочнике <a href="#irr">«Неправильные глаголы»</a>. Начните с: <i>go–went, see–saw, have–had, do–did, make–made, get–got, come–came, take–took, buy–bought, think–thought</i>.</p>`,
  simple: 'было и закончилось. Прошлое показываем один раз: went или did go — никогда did went.',
  conf: [['*Did you saw?* / *Did you see?*', 'После <i>did / didn\'t</i> — первая форма глагола: <i>Did you see it? I didn\'t like it.</i>', 'Выберите:|Did you see the film?|Did you saw the film?|Were you see the film?'],
    ['*was* / *were*', '<i>was</i> — I, he, she, it; <i>were</i> — you, we, they. «You was» — ошибка (бывает только в диалектах).', 'You ___ right yesterday.|were|was']],
  words: [['yesterday', 'вчера', 'I called her yesterday.'], ['ago', 'тому назад', 'We met two years ago.'], ['last year', 'в прошлом году', 'Last year I went to Italy.'], ['travel', 'путешествовать', 'They travelled by train.'], ['lose / lost', 'терять / потерял', 'I lost my keys again.'], ['find / found', 'находить / нашёл', 'She found a cat in the garden.'], ['buy / bought', 'покупать / купил', 'He bought a new bike.'], ['forget / forgot', 'забывать / забыл', 'Sorry, I forgot your name.'], ['decide', 'решать', 'We decided to stay at home.'], ['spend / spent', 'тратить, проводить (время)', 'I spent the weekend in the country.'], ['childhood', 'детство', 'I was shy in my childhood.'], ['trip', 'поездка', 'The trip was amazing.']],
  ex: [
    { t: 'gap', q: ['Yesterday I ___ (go) to the cinema.|went', 'We ___ (watch) a funny film last night.|watched', 'She ___ (not / come) to the party.|didn\'t come/did not come', '___ you ___ (see) my message?|Did;see', 'I ___ (be) tired after the trip.|was', 'They ___ (be) in Rome last summer.|were', 'He ___ (stop) the car and ___ (get) out.|stopped;got', 'Where ___ you buy that jacket?|did', 'I ___ (lose) my phone two days ago.|lost', 'We ___ (study) all night.|studied'] },
    { t: 'choice', q: ['Did you ___ breakfast?|have|had|has', 'I ___ at home yesterday.|was|were|did', 'She ___ like the film.|didn\'t|wasn\'t|don\'t', 'When ___ you arrive?|did|were|was # arrive — обычный глагол, вопрос с did.', 'We ___ happy with the hotel.|weren\'t|didn\'t|wasn\'t # Прилагательное happy — с be.'] },
    { t: 'order', q: ['Where did you go last weekend?', 'I didn\'t sleep well last night.', 'We met our friends at the station.', 'What did she say about the film?', 'They were very tired after the trip.', 'He bought a new bike two weeks ago.'] },
    { t: 'fix', q: ['Did you went to school yesterday?|Did you go to school yesterday?', 'I didn\'t saw him.|I didn\'t see him.|I did not see him.', 'We was at home.|We were at home.', 'She buyed a dress.|She bought a dress.', 'Yesterday I go to the shop.|Yesterday I went to the shop.|I went to the shop yesterday.', 'They didn\'t were happy.|They weren\'t happy.|They were not happy.'] },
    { t: 'tr', q: ['Я забыл ключи.|I forgot my keys.|I forgot the keys.', 'Где ты был вчера?|Where were you yesterday?', 'Мы не смотрели этот фильм.|We didn\'t watch this film.|We didn\'t see this film.|We did not watch this film.|We haven\'t seen this film.', 'Она купила новый телефон.|She bought a new phone.', 'Они встретились три года назад.|They met three years ago.'] },
  ],
  read: {
    title: 'The worst trip ever (or the best?)',
    txt: ['Last summer my friend Liga and I decided to go to the sea by train. We got up at five, but we forgot the tickets at home. We went back, found them and ran to the station. Of course, we missed the train.', 'The next train was three hours later, so we sat in a small café near the station. The owner was a funny old man. He told us stories about the town and gave us free cake. When we finally arrived at the sea, it started to rain.', 'We didn\'t swim, but we spent the evening in a cosy restaurant and laughed all night. Now, when somebody asks "What was your best trip?", Liga and I always say: "The one where everything went wrong!"'],
    gl: { 'missed': 'опоздали на', 'finally': 'наконец', 'free': 'бесплатный', 'went wrong': 'пошло не так', 'arrived': 'прибыли' },
    q: [{ t: 'tf', q: ['They went to the sea by car.|F', 'They missed the train.|T', 'The café owner gave them free cake.|T', 'They swam in the sea.|F'] },
      { t: 'choice', q: ['Why do they call it the best trip?|Because they had a lot of fun.|Because the weather was great.|Because the train was fast.'] },
      { t: 'gap', q: ['They ___ (forget) the tickets at home.|forgot', 'It ___ (start) to rain.|started'] }],
  },
  write: { h: 'Расскажите о поездке или о дне, который запомнился. 8–10 предложений в Past Simple.', min: 60, use: ['decided', 'spent', 'yesterday', 'ago', 'trip'],
    plan: ['Когда и куда вы поехали.', 'Что случилось (хорошее или смешное).', 'Что вы чувствовали.', 'Чем закончилось.'],
    model: 'Two years ago I went to Tallinn with my sister. We decided to go by bus because it was cheap.\nThe trip took four hours. We arrived in the evening and walked around the old town.\nThe next day we visited a museum and ate in a small café. It rained all day, but we didn\'t care.\nWe spent all our money on cakes and books. It was a great weekend.' },
  vid: [['BBC Learning English', 'past simple'], ['English with Lucy', 'past simple irregular verbs'], ['Rachel\'s English', 'ed pronunciation'], ['engVid', 'past simple questions did']],
  fact: 'Около 70 самых частых глаголов английского — неправильные. Правильные глаголы «побеждают»: многие формы со временем стали правильными (например, <i>helped</i> вместо старого <i>holp</i>).',
  src: [['British Council — Past simple', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Past simple', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a2-2', lvl: 'A2', t: 'Present Continuous против Present Simple', en: 'Present Continuous vs Present Simple',
  goals: ['различать «делаю сейчас» и «делаю обычно»', 'знать глаголы, которые не бывают в -ing', 'использовать Continuous для планов'],
  th: `<p>Present Continuous (<i>am/is/are + глагол-ing</i>) — действие <b>прямо сейчас</b> или в этот период: <i>I'm reading a great book these days.</i></p>
  <div class="tbl"><table><thead><tr><th></th><th>Present Simple</th><th>Present Continuous</th></tr></thead><tbody>
  <tr><td>смысл</td><td>обычно, всегда, факт</td><td>сейчас, временно, в процессе</td></tr>
  <tr><td>пример</td><td><i>I work in a bank.</i></td><td><i>I'm working from home this week.</i></td></tr>
  <tr><td>подсказки</td><td><i>usually, every day, often</i></td><td><i>now, at the moment, today, this week, Look!</i></td></tr>
  <tr><td>?</td><td><i>Do you cook?</i></td><td><i>Are you cooking?</i></td></tr></tbody></table></div>
  <h4>Как пишется -ing</h4><p><i>work → working; make → making</i> (e уходит); <i>sit → sitting, run → running</i> (удваиваем); <i>lie → lying</i>.</p>
  <h4>Глаголы «состояния» — обычно без -ing</h4><p><i>know, like, love, hate, want, need, understand, believe, remember, belong, seem</i>. Говорим <i>I know</i>, <i>I want</i>, <i>I don't understand</i> — даже если «прямо сейчас».</p>
  <p>Но: <i>I'm thinking about it</i> (обдумываю) ≠ <i>I think it's good</i> (считаю). <i>I'm having lunch</i> (ем) ≠ <i>I have a car</i> (владею). Знаменитое <i>I'm lovin' it</i> из рекламы — специально «неправильное», чтобы звучало эмоционально.</p>
  <h4>Continuous для будущего</h4><p>Договорённости: <i>I'm meeting Anna on Friday. We're flying to Rome tomorrow.</i></p>`,
  simple: 'Simple — «вообще, обычно». Continuous — «сейчас, в процессе». Знать, хотеть, любить — без -ing.',
  conf: [['*I am knowing* / *I know*', 'Знать, понимать, хотеть, нужно — без -ing: <i>I know. I understand. I need help.</i>', '«Я понимаю»:|I understand.|I am understanding.|I understanding.'],
    ['*What do you do?* / *What are you doing?*', '<i>What do you do?</i> — «Кем работаешь?» <i>What are you doing?</i> — «Что ты сейчас делаешь?»', 'Вас спросили «What do you do?». Подходящий ответ:|I\'m a designer.|I\'m watching TV.|I do it.']],
  words: [['at the moment', 'в данный момент', 'She is busy at the moment.'], ['these days', 'в последнее время', 'I\'m reading a lot these days.'], ['wait for', 'ждать (кого-то)', 'I\'m waiting for the bus.'], ['look for', 'искать', 'What are you looking for?'], ['wear', 'носить (одежду)', 'She\'s wearing a red coat.'], ['rain / snow', 'дождь (идёт) / снег', 'It\'s raining again.'], ['understand', 'понимать', 'I don\'t understand the question.'], ['belong to', 'принадлежать', 'This bag belongs to me.'], ['still', 'всё ещё', 'He is still sleeping.'], ['right now', 'прямо сейчас', 'I can\'t talk right now.']],
  ex: [
    { t: 'choice', q: ['Look! It ___.|is snowing|snows|snow', 'I ___ coffee every morning.|drink|am drinking|drinking', 'Please be quiet, the baby ___.|is sleeping|sleeps|sleep', 'I ___ what you mean.|understand|am understanding # understand — глагол состояния.', 'Where\'s Tom? — He ___ a shower.|is having|has|have', 'She usually ___ jeans, but today she ___ a dress.|wears … is wearing|is wearing … wears|wears … wears', 'What ___? — I\'m a nurse.|do you do|are you doing|you do', 'This car ___ to my brother.|belongs|is belonging'] },
    { t: 'gap', q: ['Listen! Somebody ___ (sing).|is singing', 'My dad ___ (cook) dinner on Sundays.|cooks', 'Why ___ you ___ (laugh)?|are;laughing', 'I ___ (not / like) this song.|don\'t like/do not like', 'We ___ (meet) Kate tomorrow at six.|are meeting/\'re meeting', 'He ___ (always / forget) my birthday.|always forgets'] },
    { t: 'order', q: ['What are you doing right now?', 'I am waiting for my friend.|I\'m waiting for my friend.', 'She doesn\'t usually work on Fridays.', 'Are you looking for your keys?', 'We are flying to London on Monday.|We\'re flying to London on Monday.'] },
    { t: 'fix', q: ['I am knowing the answer.|I know the answer.', 'Look! The children play in the snow.|Look! The children are playing in the snow.', 'She is work now.|She is working now.|She\'s working now.', 'Do you wait for the bus?|Are you waiting for the bus? # Сейчас — Continuous.', 'I am wanting a coffee.|I want a coffee.'] },
    { t: 'tr', q: ['Что ты сейчас делаешь?|What are you doing now?|What are you doing right now?', 'Я ищу свои очки.|I\'m looking for my glasses.|I am looking for my glasses.', 'Он обычно ходит на работу пешком.|He usually walks to work.|He usually goes to work on foot.', 'Я тебя не понимаю.|I don\'t understand you.|I do not understand you.'] },
  ],
  read: {
    title: 'A video call',
    txt: ['"Hi, Mum! Can you see me? I\'m sitting in a café in Lisbon. Yes, I\'m still working here. No, I don\'t work every day — I usually work four days a week, and on Fridays I explore the city.', 'Right now the sun is shining and a man is playing the guitar on the street. People are dancing! My friend Ana is ordering pastéis de nata — the famous custard tarts. I eat them every day, I know, I know...', 'What are you doing? Are you cooking? Is Dad watching football again? Say hi to him! I\'m flying home on the 20th, so see you soon!"'],
    gl: { 'explore': 'исследовать, гулять по', 'shining': 'светит', 'ordering': 'заказывает', 'custard tarts': 'пирожные с заварным кремом' },
    q: [{ t: 'tf', q: ['The speaker works every day.|F', 'A man is playing the guitar.|T', 'The speaker is flying home on the 20th.|T'] },
      { t: 'choice', q: ['Which sentence is about a habit?|I eat them every day.|The sun is shining.|Ana is ordering.', 'Why is it «I\'m flying home on the 20th»?|It is a plan for the future.|It is happening now.|It is a habit.'] }],
  },
  write: { h: 'Вы звоните другу по видео. Опишите, что вы обычно делаете в это время и что делаете (и что происходит вокруг) прямо сейчас. 7–9 предложений.', min: 50, use: ['usually', 'right now', 'at the moment', 'wearing'],
    model: 'Hi! I\'m sitting on my balcony at the moment. Usually I work in the evenings, but today I\'m relaxing.\nMy neighbour is watering his flowers and his dog is barking at a cat.\nI\'m wearing my old pyjamas and drinking tea.\nWhat about you? Are you still working? I usually call you on Sundays, but I miss you!' },
  vid: [['BBC Learning English', 'present continuous'], ['English with Lucy', 'present simple vs present continuous'], ['engVid', 'stative verbs']],
  fact: 'Слоган McDonald\'s <i>I\'m lovin\' it</i> (2003) нарушает правило: <i>love</i> обычно не ставят в -ing. Именно поэтому фраза звучит живо и запоминается — так носители говорят о сильной эмоции «прямо сейчас».',
  src: [['British Council — Present continuous', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Present continuous', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a2-3', lvl: 'A2', t: 'Будущее: will, going to, планы', en: 'Future: will, going to, Present Continuous',
  goals: ['выбирать между will и going to', 'говорить о планах, решениях, обещаниях, прогнозах', 'не ставить will после when и if'],
  th: `<div class="tbl"><table><thead><tr><th>Форма</th><th>Когда</th><th>Пример</th></tr></thead><tbody>
  <tr><td><i>will</i> + глагол</td><td>решение прямо сейчас, обещание, предложение помощи, мнение о будущем</td><td><i>I'm cold. — I'll close the window. I'll call you. I think it will rain.</i></td></tr>
  <tr><td><i>be going to</i> + глагол</td><td>план, решённый заранее; прогноз по признакам «вижу»</td><td><i>I'm going to learn Spanish. Look at those clouds — it's going to rain.</i></td></tr>
  <tr><td>Present Continuous</td><td>договорённость с временем и местом</td><td><i>I'm seeing the dentist at 3.</i></td></tr>
  <tr><td>Present Simple</td><td>расписание</td><td><i>The train leaves at 6.15.</i></td></tr></tbody></table></div>
  <p>Отрицание: <i>won't</i> (= will not), <i>I'm not going to</i>. Вопрос: <i>Will you…? Are you going to…?</i></p>
  <h4>После when, if, before, after, as soon as — НЕ will</h4>
  <p><i>I'll call you <b>when</b> I <b>arrive</b>.</i> (не «when I will arrive»). <i><b>If</b> it <b>rains</b>, we'll stay at home.</i></p>
  <p>Подсказка: <i>I think…, probably, I'm sure…</i> → чаще <i>will</i>. <i>Gonna</i> — разговорное произношение <i>going to</i>: так говорят в сериалах, но пишут <i>going to</i>.</p>`,
  simple: 'решил прямо сейчас — will. Решил заранее — going to. Договорился на время — am …-ing.',
  conf: [['*when I will come* / *when I come*', 'После <i>when, if, as soon as</i> о будущем — настоящее время: <i>when I come</i>.', 'I\'ll text you when I ___ home.|get|will get|got'],
    ['*will* / *going to*', 'Звонит телефон: <i>I\'ll get it!</i> (решил сейчас). Купили билеты: <i>We\'re going to visit Rome.</i> (план).', 'The phone is ringing. — ___ it!|I\'ll get|I\'m going to get # Решение в момент речи.']],
  words: [['plan', 'план, планировать', 'What are your plans for the weekend?'], ['probably', 'вероятно', 'I\'ll probably stay at home.'], ['promise', 'обещать', 'I promise I\'ll be on time.'], ['soon', 'скоро', 'See you soon!'], ['next week', 'на следующей неделе', 'We\'re moving next week.'], ['tomorrow', 'завтра', 'I\'m going to call him tomorrow.'], ['as soon as', 'как только', 'Call me as soon as you arrive.'], ['move', 'переезжать', 'They\'re going to move to Spain.'], ['get married', 'пожениться', 'They\'re getting married in June.'], ['leave', 'уезжать, отправляться', 'The bus leaves at nine.']],
  ex: [
    { t: 'choice', q: ['A: I\'ve got a headache. — B: Wait, I ___ you some water.|\'ll get|\'m going to get|get', 'Look at the sky! It ___ rain.|\'s going to|will|is # Видим признаки — going to.', 'We ___ a party on Saturday. Everything is ready.|are having|will have|have', 'I think Leo ___ the job. He is very good.|will get|is getting|gets', 'The film ___ at 8.30.|starts|will start|is starting # Расписание — Present Simple.', 'I\'ll call you when I ___.|arrive|will arrive|am going to arrive'] },
    { t: 'gap', q: ['I promise I ___ (not / tell) anyone.|won\'t tell/will not tell', 'She ___ (going to / study) medicine next year.|is going to study', 'If it ___ (rain), we\'ll take a taxi.|rains', '___ you help me with this box? — Of course!|Will', 'We ___ (meet) Anna at the station at five.|are meeting/\'re meeting', 'As soon as I ___ (finish), I\'ll come.|finish'] },
    { t: 'order', q: ['What are you going to do this weekend?', 'I will text you when I get home.|I\'ll text you when I get home.', 'They are getting married in June.|They\'re getting married in June.', 'I think it will be sunny tomorrow.'] },
    { t: 'fix', q: ['I will call you when I will arrive.|I will call you when I arrive.|I\'ll call you when I arrive.', 'If he will come, we will start.|If he comes, we will start.|If he comes, we\'ll start.', 'Look! That glass will fall!|Look! That glass is going to fall!', 'I going to visit my mum.|I\'m going to visit my mum.|I am going to visit my mum.'] },
    { t: 'tr', q: ['Я позвоню тебе завтра.|I\'ll call you tomorrow.|I will call you tomorrow.', 'Мы собираемся переехать.|We are going to move.|We\'re going to move.', 'Я тебе помогу!|I\'ll help you!|I will help you!', 'Что ты будешь делать в субботу?|What are you going to do on Saturday?|What will you do on Saturday?|What are you doing on Saturday?'] },
  ],
  read: {
    title: 'New Year\'s resolutions',
    txt: ['Every January my family makes resolutions — promises for the new year. My dad is going to run a marathon. He bought new running shoes yesterday, so I think he will do it this time.', 'My mum says she\'s going to read twenty books. My little brother promised he will stop playing video games at night (we\'ll see!). And me? I\'m going to learn to cook five Italian dishes. I\'m starting a course next Monday.', 'Our cat didn\'t make any resolutions. She is going to sleep, eat and sleep again. Honestly, I think she will be the only one who keeps her promise.'],
    gl: { 'resolutions': 'новогодние обещания себе', 'marathon': 'марафон', 'dishes': 'блюда', 'keeps her promise': 'сдержит обещание', 'honestly': 'честно говоря' },
    q: [{ t: 'tf', q: ['The dad bought running shoes.|T', 'The writer is going to learn to cook Chinese dishes.|F', 'The course starts next Monday.|T'] },
      { t: 'choice', q: ['What is the joke at the end?|The cat\'s easy plan is the only one that will work.|The cat can read.|The cat runs a marathon.', '«We\'ll see!» means…|maybe it won\'t happen|we will watch a film|we can see well'] }],
  },
  write: { h: 'Ваши планы на ближайший год: что вы собираетесь сделать (going to), что, по-вашему, случится (will), что уже назначено (Continuous). 7–10 предложений.', min: 55, use: ['going to', 'probably', 'plan', 'promise', 'as soon as'],
    model: 'This year I\'m going to learn English properly. I plan to study every morning for twenty minutes.\nI\'m also going to visit my friend in Berlin. I\'m flying there on the 3rd of May.\nI think it will be a busy year, but I\'ll probably have more time in summer.\nI promise I\'ll call my grandma more often. As soon as I get a new phone, I\'ll send her photos every day.' },
  vid: [['BBC Learning English', 'will or going to'], ['English with Lucy', 'future tenses will going to'], ['Oxford Online English', 'future tenses']],
  fact: 'В английском нет «будущего времени» в том смысле, как в русском, — нет отдельной формы глагола. Будущее выражают вспомогательными словами (<i>will, going to</i>) или настоящим временем.',
  src: [['British Council — Future forms', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Future', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a2-4', lvl: 'A2', t: 'Сравнения: bigger, the best, as … as', en: 'Comparatives and superlatives',
  goals: ['сравнивать вещи, людей, города', 'знать особые формы good–better–best', 'говорить «такой же, как» и «не такой, как»'],
  th: `<div class="tbl"><table><thead><tr><th>Прилагательное</th><th>Сравнительная</th><th>Превосходная</th></tr></thead><tbody>
  <tr><td>короткое: <i>cheap</i></td><td><i>cheaper (than)</i></td><td><i>the cheapest</i></td></tr>
  <tr><td>на -e: <i>nice</i></td><td><i>nicer</i></td><td><i>the nicest</i></td></tr>
  <tr><td>согл.+гл.+согл.: <i>big</i></td><td><i>bigger</i></td><td><i>the biggest</i></td></tr>
  <tr><td>на -y: <i>happy</i></td><td><i>happier</i></td><td><i>the happiest</i></td></tr>
  <tr><td>длинное: <i>expensive</i></td><td><i>more expensive</i></td><td><i>the most expensive</i></td></tr>
  <tr><td><i>good / bad / far</i></td><td><i>better / worse / further</i></td><td><i>the best / the worst / the furthest</i></td></tr></tbody></table></div>
  <p>«Чем» — <i>than</i>: <i>Riga is bigger than Jurmala.</i> Превосходная — почти всегда с <i>the</i>: <i>the best café in town</i>.</p>
  <h4>Такой же / не такой</h4><p><i>as + прилагательное + as</i>: <i>My cat is <b>as</b> lazy <b>as</b> my dog.</i> <i>not as … as</i>: <i>This film isn't <b>as</b> good <b>as</b> the book.</i></p>
  <h4>Усиление</h4><p><i>much / a lot / far bigger</i> — намного больше; <i>a bit / slightly cheaper</i> — чуть дешевле. <i>The more, the better</i> — чем больше, тем лучше.</p>`,
  simple: 'короткие слова: +er / the +est. Длинные: more / the most. good → better → the best.',
  conf: [['*more better* / *better*', 'Не удваиваем: либо <i>-er</i>, либо <i>more</i>. <i>better</i>, не «more better».', 'Выберите:|This is much better.|This is more better.|This is most better.'],
    ['*than* / *then*', '<i>than</i> — «чем» (сравнение); <i>then</i> — «потом, тогда».', 'She is older ___ me.|than|then']],
  words: [['cheap', 'дешёвый', 'The bus is cheaper than a taxi.'], ['expensive', 'дорогой', 'It\'s the most expensive hotel in town.'], ['crowded', 'многолюдный', 'The old town is crowded in summer.'], ['safe', 'безопасный', 'Is it safe to swim here?'], ['comfortable', 'удобный', 'This chair is more comfortable.'], ['far', 'далеко', 'How far is the station?'], ['healthy', 'здоровый, полезный', 'Fruit is healthier than sweets.'], ['noisy', 'шумный', 'The city is noisier than the village.'], ['slightly', 'слегка, немного', 'It\'s slightly warmer today.'], ['in the world', 'в мире', 'It\'s the best coffee in the world!']],
  ex: [
    { t: 'gap', q: ['A plane is ___ (fast) than a train.|faster', 'This is the ___ (good) pizza in Riga!|best', 'English is ___ (easy) than Chinese.|easier', 'Today is ___ (hot) than yesterday.|hotter', 'It\'s the ___ (expensive) restaurant in the city.|most expensive', 'My English is ___ (bad) than yours.|worse', 'Is it ___ (far) to the station or to the museum?|further/farther', 'She is as tall ___ her brother.|as'] },
    { t: 'choice', q: ['My flat is ___ than yours.|smaller|more small|smallest', 'It was the ___ day of my life!|happiest|happier|most happy', 'The book is ___ than the film.|much better|more better|much good', 'This bag is not as heavy ___ that one.|as|than|like', 'Who is the ___ person in your family?|funniest|funnier|most funny'] },
    { t: 'order', q: ['London is much bigger than Riga.', 'This is the best day of my life.', 'My sister is not as tall as me.|My sister isn\'t as tall as me.', 'Trains are more comfortable than buses.'] },
    { t: 'fix', q: ['He is more taller than me.|He is taller than me.', 'This is the most good café.|This is the best café.', 'She is older then me.|She is older than me.', 'It is the bigger city in Latvia.|It is the biggest city in Latvia.', 'My car is as fast than yours.|My car is as fast as yours.'] },
    { t: 'tr', q: ['Эта книга интереснее, чем фильм.|This book is more interesting than the film.|The book is more interesting than the film.', 'Это самый дешёвый билет.|This is the cheapest ticket.|It is the cheapest ticket.', 'Сегодня немного теплее.|It\'s slightly warmer today.|It is a bit warmer today.|Today it is slightly warmer.|It is slightly warmer today.', 'Я не такой высокий, как мой брат.|I\'m not as tall as my brother.|I am not as tall as my brother.'] },
  ],
  read: {
    title: 'City or countryside?',
    txt: ['My friends Mark and Zane can never agree. Mark lives in the centre of Riga. "The city is more exciting," he says. "There are more cafés, more museums and the best concerts. And public transport is faster than a car in traffic."', 'Zane lives in a village forty kilometres away. "The countryside is quieter and healthier," she says. "The air is cleaner, food is cheaper and my house is three times bigger than Mark\'s flat." Mark answers: "Yes, but your internet is the slowest in Latvia!"', 'In the end they agree on one thing: the best place is wherever your friends are.'],
    gl: { 'agree': 'соглашаться', 'countryside': 'сельская местность', 'public transport': 'общественный транспорт', 'traffic': 'пробки, движение', 'wherever': 'где бы ни' },
    q: [{ t: 'tf', q: ['Mark lives in a village.|F', 'Zane\'s house is bigger than Mark\'s flat.|T', 'Zane\'s internet is very fast.|F'] },
      { t: 'choice', q: ['What do they agree on?|The best place is where your friends are.|The city is the best.|The countryside is cheaper.'] }],
  },
  write: { h: 'Сравните два места, где вы жили или бывали (или два времени года, два сериала). 7–9 предложений, минимум 3 сравнительные и 2 превосходные формы.', min: 55, use: ['than', 'the most', 'as … as', 'cheaper', 'crowded'],
    model: 'I lived in Daugavpils and now I live in Riga. Riga is bigger and more crowded than Daugavpils.\nFlats in Riga are much more expensive, but the salaries are higher too.\nDaugavpils is quieter and the parks are as beautiful as in the capital.\nThe best thing about Riga is the sea. The worst thing is the traffic in the morning.' },
  vid: [['BBC Learning English', 'comparatives and superlatives'], ['English with Lucy', 'comparative superlative adjectives'], ['engVid', 'as as comparisons']],
  fact: 'Слово <i>worse</i> и <i>worst</i> — от древнего корня, а не от <i>bad</i>. Так же <i>better/best</i> не связаны с <i>good</i>: это «осколки» разных старых слов, как в русском «хороший — лучше».',
  src: [['British Council — Comparatives', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Comparison', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a2-5', lvl: 'A2', t: 'Количество: some, any, much, many, a lot of', en: 'Countable and uncountable nouns',
  goals: ['различать исчисляемые и неисчисляемые существительные', 'выбирать much / many / a lot of / a few / a little', 'спрашивать «сколько» правильно'],
  th: `<p><b>Исчисляемые</b> можно посчитать: <i>one apple, two apples</i>. <b>Неисчисляемые</b> — вещества и абстрактное: <i>water, money, time, information, advice, furniture, news</i>. У них нет множественного числа и нет <i>a/an</i>.</p>
  <div class="tbl"><table><thead><tr><th></th><th>исчисляемые (мн.)</th><th>неисчисляемые</th></tr></thead><tbody>
  <tr><td>много (в вопросах и −)</td><td><i>many</i>: <i>not many people</i></td><td><i>much</i>: <i>not much time</i></td></tr>
  <tr><td>много (в +)</td><td colspan="2"><i>a lot of / lots of</i>: <i>a lot of friends, a lot of money</i></td></tr>
  <tr><td>немного (хватает)</td><td><i>a few</i>: <i>a few days</i></td><td><i>a little</i>: <i>a little sugar</i></td></tr>
  <tr><td>мало (не хватает)</td><td><i>few</i>: <i>few people came</i></td><td><i>little</i>: <i>little hope</i></td></tr>
  <tr><td>сколько?</td><td><i>How many cups?</i></td><td><i>How much coffee?</i></td></tr></tbody></table></div>
  <h4>Some и any</h4><p><i>some</i> — в утверждениях и в просьбах/предложениях: <i>I have some ideas. Would you like some tea?</i> <i>any</i> — в отрицаниях и вопросах: <i>I don't have any money. Have you got any questions?</i></p>
  <h4>Ловушки для русскоговорящих</h4><p>Неисчисляемые по-английски, но исчисляемые по-русски: <i>advice</i> (совет — <i>a piece of advice</i>), <i>information, news</i> (<i>The news <b>is</b> good</i>), <i>furniture, luggage, homework, hair</i> (волосы — <i>her hair is long</i>).</p>`,
  simple: 'считается — many / a few; не считается — much / a little. Всегда можно a lot of.',
  conf: [['*an advice* / *some advice*', '<i>advice, information, news</i> — неисчисляемые: <i>some advice, a piece of advice</i>, не «an advice», не «advices».', 'Выберите:|Can I give you some advice?|Can I give you an advice?|Can I give you advices?'],
    ['*much* / *many*', '<i>many</i> — с тем, что считается (<i>many books</i>), <i>much</i> — с остальным (<i>much time</i>).', 'How ___ money do you need?|much|many']],
  words: [['advice', 'совет(ы)', 'Thanks for the advice.'], ['information', 'информация', 'I need more information.'], ['furniture', 'мебель', 'We bought some new furniture.'], ['luggage', 'багаж', 'How much luggage do you have?'], ['news', 'новость, новости', 'The news is great!'], ['a few', 'несколько', 'I\'ll be back in a few minutes.'], ['a little', 'немного', 'Can I have a little milk?'], ['a piece of', 'кусок, единица чего-то', 'Can I have a piece of cake?'], ['a bottle of', 'бутылка', 'a bottle of water'], ['enough', 'достаточно', 'We don\'t have enough time.']],
  ex: [
    { t: 'choice', q: ['How ___ people were at the party?|many|much', 'There isn\'t ___ milk in the fridge.|much|many', 'I have ___ friends in London, so I\'m not lonely there.|a few|a little|few', 'Would you like ___ coffee?|some|any|a', 'We don\'t have ___ bread.|any|some|many', 'The news ___ really good!|is|are', 'Can you give me ___?|some advice|an advice|advices', 'Hurry up! We have very ___ time.|little|few|a few'] },
    { t: 'gap', q: ['How ___ is this jacket? — 50 euros.|much', 'There are ___ (не много) tourists in winter.|not many', 'I need ___ (немного) sugar in my tea.|a little', 'Have you got ___ questions?|any', 'There\'s a ___ of chocolate on the table.|piece/bar', 'She has ___ (много) of books.|a lot/lots'] },
    { t: 'fix', q: ['I need an information.|I need some information.|I need information.', 'How many money do you have?|How much money do you have?', 'Her hairs are long.|Her hair is long.', 'There aren\'t some apples.|There aren\'t any apples.', 'We bought new furnitures.|We bought new furniture.|We bought some new furniture.'] },
    { t: 'order', q: ['How much time do we have?', 'There are a lot of people in the park.', 'Would you like some more tea?', 'I don\'t have any money with me.'] },
  ],
  read: {
    title: 'Pancakes for a crowd',
    txt: ['On Sunday my flatmates wanted pancakes. "How many people are coming?" I asked. "Just a few," said Leo. In the end eleven people came. We had a big problem: not much flour, only a little milk and no eggs at all.', 'Our neighbour Mrs Berzina saved us. She gave us a bag of flour, a bottle of milk, six eggs and some very good advice: "Never make pancakes for more than ten people without asking me first." We made a lot of pancakes, and there wasn\'t any left for Leo, because he was the last to come to the table.'],
    gl: { 'flatmates': 'соседи по квартире', 'flour': 'мука', 'saved': 'спасла', 'left': 'оставшийся' },
    q: [{ t: 'tf', q: ['Only a few people came.|F # Пришли одиннадцать.', 'They had no eggs.|T', 'Leo got a lot of pancakes.|F'] },
      { t: 'choice', q: ['What did the neighbour give them?|flour, milk, eggs and advice|only advice|pancakes'] }],
  },
  write: { h: 'Напишите, что есть и чего нет у вас на кухне (или что нужно купить к празднику). 6–8 предложений.', min: 45, use: ['some', 'any', 'a few', 'a little', 'enough'],
    model: 'For my birthday party I need to buy some things. There isn\'t any juice in the fridge, and there are only a few eggs.\nWe have a lot of plates, but not enough glasses.\nI need a little cheese for the salad and some flowers for the table.\nHow many people are coming? About twenty, so I need a lot of cake!' },
  vid: [['BBC Learning English', 'countable uncountable nouns'], ['English with Lucy', 'much many a lot of'], ['engVid', 'some any']],
  fact: 'Слово <i>news</i> выглядит как множественное число, но ведёт себя как единственное: <i>The news is…</i>. А <i>police</i> — наоборот: <i>The police are coming.</i>',
  src: [['British Council — Countable and uncountable', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Nouns: countable and uncountable', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});

U({
  id: 'a2-6', lvl: 'A2', t: 'Present Perfect: знакомство и первые фразовые глаголы', en: 'Present Perfect (intro), first phrasal verbs',
  goals: ['говорить об опыте: «я когда-нибудь…»', 'использовать just, already, yet', 'понимать простые фразовые глаголы: get up, turn on, look after'],
  th: `<p>Present Perfect = <i>have/has + третья форма</i> (<i>done, seen, been, worked</i>). Он связывает прошлое с <b>настоящим</b>: важен результат или опыт, а не когда это было.</p>
  <div class="tbl"><table><tbody>
  <tr><td>+</td><td><i>I have (I've) seen this film.</i> <i>She has (she's) finished.</i></td></tr>
  <tr><td>−</td><td><i>I haven't seen it. He hasn't called.</i></td></tr>
  <tr><td>?</td><td><i>Have you ever been to Paris? Has she arrived?</i></td></tr></tbody></table></div>
  <h4>Три главных случая</h4>
  <ol><li><b>Опыт в жизни</b> (когда — не важно): <i>Have you <b>ever</b> tried sushi? I've <b>never</b> been to Japan.</i></li>
  <li><b>Только что</b>: <i>I've <b>just</b> had lunch.</i></li>
  <li><b>Уже / ещё не</b>: <i>I've <b>already</b> done it. Have you done it <b>yet</b>? I haven't done it <b>yet</b>.</i> (<i>yet</i> — в конце)</li></ol>
  <p>Как только назвали время в прошлом (<i>yesterday, in 2020, last week</i>) — переходим в Past Simple: <i>I've been to Paris. I went there in 2019.</i> Подробно — в уроке B1.</p>
  <h4>been или gone?</h4><p><i>She has <b>been</b> to Rome</i> — была и вернулась. <i>She has <b>gone</b> to Rome</i> — уехала и сейчас там.</p>
  <h4>Фразовые глаголы: первое знакомство</h4><p>Глагол + маленькое слово = новый смысл: <i>get up</i> (вставать), <i>turn on/off</i> (включить/выключить), <i>look after</i> (заботиться), <i>look for</i> (искать), <i>give up</i> (бросить), <i>find out</i> (узнать), <i>put on</i> (надеть), <i>take off</i> (снять; взлететь). Больше — в B1.</p>`,
  simple: 'опыт и результат «к настоящему моменту» — have/has + done. Назвали «когда» — Past Simple.',
  conf: [['*been* / *gone*', '<i>has been to</i> — побывал (вернулся); <i>has gone to</i> — уехал (сейчас там).', 'Where\'s Tom? — He\'s ___ to the shop. He\'ll be back soon.|gone|been'],
    ['*I have seen it yesterday* / *I saw it yesterday*', 'С точным прошлым временем Present Perfect не используют: <i>I saw it yesterday.</i>', 'Выберите:|I saw him yesterday.|I have seen him yesterday.'],
    ['*already* / *yet*', '<i>already</i> — «уже» в утверждениях (в середине); <i>yet</i> — «уже?» в вопросах и «ещё не» в отрицаниях (в конце).', 'Have you finished ___?|yet|already']],
  words: [['ever', 'когда-либо', 'Have you ever seen a ghost?'], ['never', 'никогда', 'I\'ve never tried oysters.'], ['just', 'только что', 'She has just left.'], ['already', 'уже', 'I\'ve already eaten.'], ['yet', 'уже? / ещё не', 'I haven\'t decided yet.'], ['try', 'пробовать', 'Have you tried this cake?'], ['turn on / off', 'включить / выключить', 'Turn off the light, please.'], ['look after', 'заботиться, присматривать', 'Can you look after my cat?'], ['give up', 'бросить, сдаться', 'Don\'t give up!'], ['find out', 'узнать, выяснить', 'I found out the truth.'], ['put on', 'надеть', 'Put on your coat, it\'s cold.']],
  ex: [
    { t: 'gap', q: ['I ___ (never / be) to Japan.|have never been/\'ve never been', '___ you ever ___ (try) Thai food?|Have;tried', 'She ___ (just / leave).|has just left/\'s just left', 'We haven\'t finished ___.|yet', 'They ___ (already / see) this film.|have already seen/\'ve already seen', 'He ___ (lose) his keys. He can\'t open the door.|has lost/\'s lost'] },
    { t: 'choice', q: ['I ___ him last week.|saw|have seen # last week — Past Simple.', 'Have you ever ___ to London?|been|gone|went', '— Is Anna here? — No, she\'s ___ home.|gone|been', 'I\'ve ___ finished my homework!|just|yet|ever', 'Please ___ the TV, I\'m trying to sleep.|turn off|turn on|look after', 'Can you ___ my plants while I\'m away?|look after|look for|give up'] },
    { t: 'order', q: ['Have you ever been to Italy?', 'I have just finished my work.|I\'ve just finished my work.', 'She hasn\'t called me yet.', 'We have never seen snow in May.|We\'ve never seen snow in May.'] },
    { t: 'fix', q: ['I have seen him yesterday.|I saw him yesterday.', 'Did you ever try sushi?|Have you ever tried sushi?', 'She has went to Paris.|She has gone to Paris.|She has been to Paris.', 'I haven\'t yet finished.|I haven\'t finished yet.', 'He have lost his phone.|He has lost his phone.|He\'s lost his phone.'] },
    { t: 'tr', q: ['Я никогда не был в Лондоне.|I have never been to London.|I\'ve never been to London.', 'Ты уже поел?|Have you eaten yet?|Have you already eaten?', 'Она только что пришла.|She has just come.|She has just arrived.|She\'s just arrived.|She\'s just come.', 'Включи свет, пожалуйста.|Turn on the light, please.|Please turn on the light.'] },
  ],
  read: {
    title: 'Have you ever…?',
    txt: ['At our English club we play a game called "Have you ever…?". Everyone asks a question, and if your answer is "yes", you stand up.', '"Have you ever eaten a snail?" — Two people stood up. "Have you ever met a famous person?" — Only Daniel. He met a famous chef at the airport in 2018. "Have you ever fallen asleep in the cinema?" — Everybody stood up and laughed!', 'The game is great practice: you use the Present Perfect for the question, and the Past Simple for the story. "Yes, I have! I did it last summer…"'],
    gl: { 'snail': 'улитка', 'stand up': 'вставать', 'chef': 'шеф-повар', 'fallen asleep': 'заснул(и)' },
    q: [{ t: 'tf', q: ['If your answer is «yes», you sit down.|F', 'Daniel met a famous chef.|T', 'Nobody has fallen asleep in the cinema.|F'] },
      { t: 'choice', q: ['Why does the story about the chef use «met», not «has met»?|Because it says when: in 2018.|Because it is a question.|There is no reason.'] }],
  },
  write: { h: 'Напишите 6 вопросов «Have you ever…?» другу и честно ответьте на них сами — с короткой историей в Past Simple к двум ответам.', min: 50, use: ['ever', 'never', 'already', 'yet', 'just'],
    model: 'Have you ever been to Iceland? No, I haven\'t, but I want to go.\nHave you ever tried sushi? Yes, I have. I tried it in Riga last year and I loved it.\nHave you ever lost your phone? Yes! I left it in a taxi in 2021. The driver brought it back.\nI have just finished a big project, and I haven\'t had a holiday yet.' },
  vid: [['BBC Learning English', 'present perfect'], ['English with Lucy', 'present perfect ever never just already yet'], ['engVid', 'been vs gone']],
  fact: 'Американцы реже британцев используют Present Perfect: в США нормально сказать <i>Did you eat yet?</i>, а в Британии скорее скажут <i>Have you eaten yet?</i>. Оба варианта понятны везде.',
  src: [['British Council — Present perfect', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar'], ['Cambridge — Present perfect', 'https://dictionary.cambridge.org/grammar/british-grammar/']],
});
