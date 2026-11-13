// Курс туши, урок 14 — «Быстрые наброски, люди, птицы, животные» (книга «Ink Sketching», с. 73–78). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '🐦', card: 'classic/17.jpg', cover: 'p78-139.jpg',
  en: {
    name: 'Quick sketches and living things',
    intro: 'People turn away, birds fly off, cats change their minds. Living things never pose — so we learn to catch them in seconds: big shapes first, one line of action, one spot of shadow, and a few words that turn the page into a story.',
    goals: ['draw in seconds to five minutes: big shapes and directions first', 'catch people, birds and animals through simple masses, a line of action or one telling detail', 'turn a page into a reportage with notes, smells, sounds and a joke'],
    th: `<h4>Quick sketch: less is more</h4>
<p>A quick sketch lasts from a few seconds to five minutes. There is no time for details — and that is its power. First the <b>big shapes and directions</b>, then, if the subject is still there, a little more. Try a <b>continuous line</b> without lifting the pen. Show volume with a couple of <b>accent spots</b>, not with careful hatching.</p>
<ul><li>Typical mistakes: everything equally detailed (no focus), a “hairy” line made of tiny pieces, no white, no tonal contrast, tilted verticals, scribbling over a mistake.</li></ul>
<h4>Things that move</h4>
${F('p77-137.jpg', 'People waiting: a few lines for the pose, open contours, a dark spot for the bag and the hair')}
<ul><li>One energetic <b>line of action</b> — the main direction of the body.</li>
<li><b>Joints</b> as small knots: shoulder, elbow, knee.</li>
<li><b>Open contours</b> — the line doesn’t have to close; movement leaks out.</li>
<li>One spot of deep shadow <b>grounds</b> the figure — under the feet, under the bird.</li></ul>
<h4>Three ways in</h4>
${F('p77-133.jpg', 'A bird-lady: a drop for the body, a few accents — necklace, bag, beak — and a dark mass below')}
<ul><li><b>Architectural</b>: a person is cylinders and balls, a bird is a drop, an animal’s chest is a barrel. Light masses first, then a confident contour.</li>
<li><b>Intuitive</b>: follow the line of action, almost without looking at the paper.</li>
<li><b>From a detail</b>: start with a look, a tilt of the head, the bend of a wing — and grow the drawing around it.</li></ul>
${F('p77-135.jpg', 'Faces on the go: start from the look or the glasses and let the rest be a few strokes')}
<h4>From life, not from a photo</h4>
<p>From life you feel the volume, choose what matters and catch the “mistake of reality” — the odd pose, the funny moment. A photo tempts you to colour in every detail. Drawing from a photo is fine for training; life is better for the sketchbook.</p>
<h4>A page as a reportage</h4>
${F('p78-139.jpg', 'Ducks on a pond: small sketches and handwritten notes — what they did, what it sounded like')}
${F('p66-124.jpg', 'A Monday page: faces, people waiting, a framed “Monday vibes” and overheard phrases')}
<p><b>Notes and mini-sketches</b> turn a page into a report: what it smelled like, what music played, what someone said, a joke about a bird. Write in the gaps — the words become part of the drawing.</p>`,
    simple: 'Quick sketch: seconds to five minutes, big shapes first, a continuous line, volume with accent spots. For moving things — one line of action, knots for joints, open contours, one spot of shadow under them. Go in through simple masses, through the gesture or through one detail. Draw from life when you can, and add notes — the page becomes a reportage.',
    mist: [['Starting with the eyelashes while the person is leaving.', 'Big shape and direction first; details only if there is time.'],
      ['A “hairy” line of many tiny strokes.', 'One confident line — even if it is not quite right.'],
      ['Closing every contour neatly.', 'Leave contours open — movement leaks out.'],
      ['Copying every detail from a photo.', 'Draw from life when possible; choose what matters.'],
      ['A page of sketches with no words.', 'Add notes: sounds, smells, a phrase, a joke.']],
    terms: [['Quick sketch', 'a drawing in seconds to five minutes: big shapes and directions'], ['Continuous line', 'drawing without lifting the pen'], ['Line of action', 'one energetic line for the main direction of the body'], ['Open contour', 'a contour that doesn’t close, so movement leaks out'], ['Accent spot', 'a dark patch that gives volume instead of hatching'], ['Grounding shadow', 'one deep shadow under a figure that puts it on the ground'], ['Reportage page', 'sketches plus notes that tell what happened']],
    fact: 'Around 1505 Leonardo da Vinci filled a small notebook with sketches and notes on how birds fly — wing angles, wind, balance. This “Codex on the Flight of Birds” has only 18 sheets and is kept in the Royal Library of Turin.',
    test: [['How long does a quick sketch take?', 'From a few seconds to about five minutes', 'At least an hour', 'Exactly ten minutes', 'Living things don’t wait — catch the big shapes.'],
      ['What comes first in a quick sketch?', 'Big shapes and directions', 'Eyes and eyelashes', 'The background', 'Details only if the subject is still there.'],
      ['What is the line of action?', 'One energetic line for the main direction of the body', 'The outline of the shadow', 'A ruler line for the ground', 'It carries the movement of the whole figure.'],
      ['Why leave contours open?', 'So movement and light leak out', 'To save ink', 'Because closing is forbidden', 'A closed outline freezes the figure.'],
      ['In the architectural way, what is a bird?', 'A drop', 'A cube', 'A pyramid', 'Light masses first, then the contour.'],
      ['Why is drawing from life better than from a photo?', 'You feel volume and choose what matters', 'Life has more details to copy', 'Photos are forbidden', 'A photo tempts you to colour in every detail.'],
      ['What turns a sketch page into a reportage?', 'Notes and mini-sketches: sounds, smells, phrases, a joke', 'A ruler frame', 'Only one big drawing', 'Words tell what happened around the picture.']],
    task: { h: 'Birds and people', need: 'a liner or brush pen, a small sketchbook, a café, tram, park — or a series without pause', time: '40 min',
      steps: ['Warm-up: look out of the window, turn away, draw the general shape from memory. Look again — add details. Compare.', 'Five quick sketches of people or animals, 1–3 minutes each, small format. Line of action first, then masses.', 'A spread “birds and people”: at least three birds (start from a drop) and two people.', 'Give each figure one grounding spot of shadow; leave contours open.', 'Write in the gaps: what you heard, smelled, a phrase someone said, and one joke about a bird.'] },
    client: { name: 'Mr. Dr. Fisher III', job: 'a fish with a doctorate in… something; afraid of his own reflection', say: 'Ahem. DOCTOR Fisher. I am conducting research. Very serious research. The ducks at Snailhollow pond look at me in a way I do not appreciate, and the people feeding them are… suspicious. I need field records. Quick ones — they move! Not a photograph, I can’t look at shiny things. And write down what they say. For science.',
      ask: ['A spread with at least three birds and two people', 'Quick lines: line of action, open contours', 'One shadow spot under each figure', 'Field notes: sounds, smells, overheard phrases'] },
  },
  ru: {
    name: 'Быстрые наброски и живые',
    intro: 'Люди отворачиваются, птицы улетают, коты передумывают. Живое никогда не позирует — поэтому учимся ловить его за секунды: сначала крупные формы, одна линия действия, одно пятно тени и пара слов, которые превращают страницу в историю.',
    goals: ['рисовать за секунды–пять минут: сначала крупные формы и направления', 'ловить людей, птиц и зверей через простые массы, линию действия или одну говорящую деталь', 'превращать страницу в репортаж с заметками, запахами, звуками и шуткой'],
    th: `<h4>Быстрый набросок: меньше — лучше</h4>
<p>Быстрый набросок длится от нескольких секунд до пяти минут. На детали нет времени — и в этом его сила. Сначала <b>крупные формы и направления</b>, потом, если натура ещё на месте, чуть больше. Попробуй <b>непрерывную линию</b>, не отрывая перо. Объём покажи парой <b>акцентных пятен</b>, а не аккуратной штриховкой.</p>
<ul><li>Частые ошибки: всё одинаково подробно (нет фокуса), «волосатая» линия из мелких кусочков, нет белого, нет тонального контраста, заваленные вертикали, замазанная ошибка.</li></ul>
<h4>То, что движется</h4>
${F('p77-137.jpg', 'Люди ждут: несколько линий на позу, открытые контуры, тёмное пятно — сумка и волосы')}
<ul><li>Одна энергичная <b>линия действия</b> — главное направление тела.</li>
<li><b>Сочленения</b> — маленькими узелками: плечо, локоть, колено.</li>
<li><b>Открытые контуры</b> — линия не обязана замыкаться; движение «вытекает».</li>
<li>Одно пятно глубокой тени <b>заземляет</b> фигуру — под ногами, под птицей.</li></ul>
<h4>Три пути</h4>
${F('p77-133.jpg', 'Дама-птица: капля — тело, несколько акцентов — бусы, сумочка, клюв — и тёмная масса снизу')}
<ul><li><b>Архитектурный</b>: человек — цилиндры и шары, птица — капля, грудная клетка зверя — бочка. Сначала лёгкие массы, потом уверенный контур.</li>
<li><b>Интуитивный</b>: следуй линии действия, почти не глядя на бумагу.</li>
<li><b>От детали</b>: начни со взгляда, наклона головы, изгиба крыла — и наращивай рисунок вокруг.</li></ul>
${F('p77-135.jpg', 'Лица на ходу: начать со взгляда или очков, остальное — несколько штрихов')}
<h4>С натуры, а не с фото</h4>
<p>С натуры чувствуешь объём, выбираешь главное и ловишь «ошибку реальности» — странную позу, смешной момент. Фото провоцирует раскрашивать каждую деталь. С фото тренироваться можно; для скетчбука лучше жизнь.</p>
<h4>Страница как репортаж</h4>
${F('p78-139.jpg', 'Утки на пруду: маленькие наброски и заметки от руки — что делали, как звучало')}
${F('p66-124.jpg', 'Страница понедельника: лица, люди в ожидании, «Monday vibes» в рамке и подслушанные фразы')}
<p><b>Подписи и мини-скетчи</b> превращают страницу в репортаж: чем пахло, какая играла музыка, что кто-то сказал, шутка про птицу. Пиши в промежутках — слова становятся частью рисунка.</p>`,
    simple: 'Быстрый набросок: секунды–пять минут, сначала крупные формы, непрерывная линия, объём — акцентными пятнами. Для движения — одна линия действия, узелки суставов, открытые контуры, одно пятно тени под фигурой. Входи через простые массы, через жест или через одну деталь. Рисуй с натуры, когда можно, и добавляй заметки — страница станет репортажем.',
    mist: [['Начать с ресниц, пока человек уходит.', 'Сначала крупная форма и направление; детали — если останется время.'],
      ['«Волосатая» линия из множества мелких штрихов.', 'Одна уверенная линия — даже если не совсем точная.'],
      ['Аккуратно замыкать каждый контур.', 'Оставлять контуры открытыми — движение «вытекает».'],
      ['Переносить с фото каждую деталь.', 'Рисовать с натуры, когда можно; выбирать главное.'],
      ['Страница набросков без единого слова.', 'Добавить заметки: звуки, запахи, фразу, шутку.']],
    terms: [['Быстрый набросок', 'рисунок за секунды–пять минут: крупные формы и направления'], ['Непрерывная линия', 'рисовать, не отрывая перо'], ['Линия действия', 'одна энергичная линия главного направления тела'], ['Открытый контур', 'контур, который не замыкается, — движение «вытекает»'], ['Акцентное пятно', 'тёмное пятно, дающее объём вместо штриховки'], ['Заземляющая тень', 'одно глубокое пятно тени под фигурой, которое ставит её на землю'], ['Страница-репортаж', 'наброски плюс заметки, которые рассказывают, что было']],
    fact: 'Около 1505 года Леонардо да Винчи заполнил небольшую тетрадь набросками и заметками о том, как летают птицы: углы крыльев, ветер, равновесие. В этом «Кодексе о полёте птиц» всего 18 листов, он хранится в Королевской библиотеке Турина.',
    test: [['Сколько длится быстрый набросок?', 'От нескольких секунд до пяти минут', 'Не меньше часа', 'Ровно десять минут', 'Живое не ждёт — лови крупные формы.'],
      ['С чего начинается быстрый набросок?', 'С крупных форм и направлений', 'С глаз и ресниц', 'С фона', 'Детали — только если натура ещё на месте.'],
      ['Что такое линия действия?', 'Одна энергичная линия главного направления тела', 'Контур тени', 'Линия земли по линейке', 'Она несёт движение всей фигуры.'],
      ['Зачем оставлять контуры открытыми?', 'Чтобы движение и свет «вытекали»', 'Чтобы сэкономить тушь', 'Потому что замыкать запрещено', 'Замкнутый контур замораживает фигуру.'],
      ['В архитектурном пути птица — это…', 'Капля', 'Куб', 'Пирамида', 'Сначала лёгкие массы, потом контур.'],
      ['Чем натура лучше фото?', 'Чувствуешь объём и выбираешь главное', 'В жизни больше деталей для копирования', 'Фото запрещены', 'Фото провоцирует раскрашивать каждую деталь.'],
      ['Что превращает страницу набросков в репортаж?', 'Заметки и мини-скетчи: звуки, запахи, фразы, шутка', 'Рамка по линейке', 'Только один большой рисунок', 'Слова рассказывают, что было вокруг картинки.']],
    task: { h: 'Птицы и люди', need: 'линер или брашпен, маленький скетчбук, кафе, трамвай, парк — или сериал без паузы', time: '40 мин',
      steps: ['Разминка: взгляни в окно, отвернись, нарисуй общую форму по памяти. Взгляни снова — добавь детали. Сравни.', 'Пять быстрых набросков людей или животных, по 1–3 минуты, маленький формат. Сначала линия действия, потом массы.', 'Разворот «птицы и люди»: хотя бы три птицы (начни с капли) и два человека.', 'Каждой фигуре — одно заземляющее пятно тени; контуры оставь открытыми.', 'Пиши в промежутках: что слышно, чем пахнет, подслушанная фраза и одна шутка про птицу.'] },
    client: { name: 'Мистер Доктор Фишер III', job: 'рыба с докторской степенью по… чему-то; боится своего отражения', say: 'Кхм. ДОКТОР Фишер. Я провожу исследование. Очень серьёзное. Утки на нашем пруду смотрят на меня так, что мне это не нравится, а люди, которые их кормят, — подозрительны. Нужны полевые записи. Быстрые — они же двигаются! Не фотография, я не могу смотреть на блестящее. И запиши, что они говорят. Для науки.',
      ask: ['Разворот: хотя бы три птицы и два человека', 'Быстрые линии: линия действия, открытые контуры', 'Пятно тени под каждой фигурой', 'Полевые заметки: звуки, запахи, подслушанные фразы'] },
  },
  lv: {
    name: 'Ātras skices un dzīvās būtnes',
    intro: 'Cilvēki pagriežas prom, putni aizlido, kaķi pārdomā. Dzīvais nekad nepozē — tāpēc mācāmies to noķert sekundēs: vispirms lielās formas, viena darbības līnija, viens ēnas laukums un daži vārdi, kas pārvērš lapu stāstā.',
    goals: ['zīmēt sekundēs līdz piecām minūtēm: vispirms lielās formas un virzieni', 'noķert cilvēkus, putnus un dzīvniekus caur vienkāršām masām, darbības līniju vai vienu runājošu detaļu', 'pārvērst lapu reportāžā ar piezīmēm, smaržām, skaņām un joku'],
    th: `<h4>Ātra skice: mazāk ir labāk</h4>
<p>Ātra skice ilgst no dažām sekundēm līdz piecām minūtēm. Detaļām nav laika — un tajā ir tās spēks. Vispirms <b>lielās formas un virzieni</b>, tad, ja modelis vēl ir uz vietas, nedaudz vairāk. Pamēģini <b>nepārtrauktu līniju</b>, neatraujot spalvu. Apjomu parādi ar pāris <b>akcenta laukumiem</b>, nevis ar rūpīgu svītrojumu.</p>
<ul><li>Biežas kļūdas: viss vienlīdz detalizēts (nav fokusa), “spalvaina” līnija no sīkiem gabaliņiem, nav baltā, nav toņu kontrasta, sašķiebtas vertikāles, aizķēpāta kļūda.</li></ul>
<h4>Tas, kas kustas</h4>
${F('p77-137.jpg', 'Cilvēki gaida: dažas līnijas pozai, vaļēji kontūri, tumšs laukums — soma un mati')}
<ul><li>Viena enerģiska <b>darbības līnija</b> — ķermeņa galvenais virziens.</li>
<li><b>Locītavas</b> — kā mazi mezgliņi: plecs, elkonis, celis.</li>
<li><b>Vaļēji kontūri</b> — līnijai nav jānoslēdzas; kustība “izplūst”.</li>
<li>Viens dziļas ēnas laukums <b>iezemē</b> figūru — zem kājām, zem putna.</li></ul>
<h4>Trīs ceļi</h4>
${F('p77-133.jpg', 'Putnu dāma: piliens — ķermenis, daži akcenti — krelles, somiņa, knābis — un tumša masa apakšā')}
<ul><li><b>Arhitektoniskais</b>: cilvēks — cilindri un lodes, putns — piliens, dzīvnieka krūškurvis — muca. Vispirms vieglas masas, tad pārliecināts kontūrs.</li>
<li><b>Intuitīvais</b>: seko darbības līnijai, gandrīz neskatoties uz papīru.</li>
<li><b>No detaļas</b>: sāc ar skatienu, galvas slīpumu, spārna izliekumu — un audzē zīmējumu ap to.</li></ul>
${F('p77-135.jpg', 'Sejas garāmejot: sākt ar skatienu vai brillēm, pārējais — daži vilcieni')}
<h4>No dabas, nevis no foto</h4>
<p>No dabas tu jūti apjomu, izvēlies galveno un noķer “realitātes kļūdu” — dīvainu pozu, smieklīgu mirkli. Foto mudina izkrāsot katru detaļu. Trenēties pēc foto var; skiču burtnīcai labāka ir dzīve.</p>
<h4>Lapa kā reportāža</h4>
${F('p78-139.jpg', 'Pīles dīķī: mazas skices un piezīmes ar roku — ko darīja, kā skanēja')}
${F('p66-124.jpg', 'Pirmdienas lapa: sejas, gaidoši cilvēki, “Monday vibes” rāmītī un noklausītas frāzes')}
<p><b>Paraksti un mini skices</b> pārvērš lapu reportāžā: kā smaržoja, kāda mūzika skanēja, ko kāds teica, joks par putnu. Raksti starpās — vārdi kļūst par zīmējuma daļu.</p>`,
    simple: 'Ātra skice: sekundes–piecas minūtes, vispirms lielās formas, nepārtraukta līnija, apjoms — ar akcenta laukumiem. Kustībai — viena darbības līnija, locītavu mezgliņi, vaļēji kontūri, viens ēnas laukums zem figūras. Ej caur vienkāršām masām, caur žestu vai caur vienu detaļu. Zīmē no dabas, kad var, un pievieno piezīmes — lapa kļūs par reportāžu.',
    mist: [['Sākt ar skropstām, kamēr cilvēks aiziet.', 'Vispirms lielā forma un virziens; detaļas — ja paliks laiks.'],
      ['“Spalvaina” līnija no daudziem sīkiem vilcieniem.', 'Viena pārliecināta līnija — pat ja ne gluži precīza.'],
      ['Rūpīgi noslēgt katru kontūru.', 'Atstāt kontūrus vaļā — kustība “izplūst”.'],
      ['Pārnest no foto katru detaļu.', 'Zīmēt no dabas, kad var; izvēlēties galveno.'],
      ['Skiču lapa bez neviena vārda.', 'Pievienot piezīmes: skaņas, smaržas, frāzi, joku.']],
    terms: [['Ātra skice', 'zīmējums sekundēs–piecās minūtēs: lielās formas un virzieni'], ['Nepārtraukta līnija', 'zīmēt, neatraujot spalvu'], ['Darbības līnija', 'viena enerģiska līnija ķermeņa galvenajam virzienam'], ['Vaļējs kontūrs', 'kontūrs, kas nenoslēdzas, — kustība “izplūst”'], ['Akcenta laukums', 'tumšs laukums, kas dod apjomu svītrojuma vietā'], ['Iezemējošā ēna', 'viens dziļas ēnas laukums zem figūras, kas noliek to uz zemes'], ['Reportāžas lapa', 'skices plus piezīmes, kas stāsta, kas notika']],
    fact: 'Ap 1505. gadu Leonardo da Vinči piepildīja nelielu burtnīcu ar skicēm un piezīmēm par to, kā lido putni: spārnu leņķi, vējš, līdzsvars. Šajā “Kodeksā par putnu lidojumu” ir tikai 18 lapas, to glabā Turīnas Karaliskajā bibliotēkā.',
    test: [['Cik ilgi top ātra skice?', 'No dažām sekundēm līdz piecām minūtēm', 'Vismaz stundu', 'Tieši desmit minūtes', 'Dzīvais negaida — ķer lielās formas.'],
      ['Ar ko sākas ātra skice?', 'Ar lielajām formām un virzieniem', 'Ar acīm un skropstām', 'Ar fonu', 'Detaļas — tikai ja modelis vēl ir uz vietas.'],
      ['Kas ir darbības līnija?', 'Viena enerģiska līnija ķermeņa galvenajam virzienam', 'Ēnas kontūrs', 'Zemes līnija pēc lineāla', 'Tā nes visas figūras kustību.'],
      ['Kāpēc atstāt kontūrus vaļā?', 'Lai kustība un gaisma “izplūstu”', 'Lai taupītu tušu', 'Jo noslēgt aizliegts', 'Noslēgts kontūrs sasaldē figūru.'],
      ['Arhitektoniskajā ceļā putns ir…', 'Piliens', 'Kubs', 'Piramīda', 'Vispirms vieglas masas, tad kontūrs.'],
      ['Ar ko daba labāka par foto?', 'Jūti apjomu un izvēlies galveno', 'Dzīvē vairāk detaļu kopēšanai', 'Foto ir aizliegti', 'Foto mudina izkrāsot katru detaļu.'],
      ['Kas pārvērš skiču lapu reportāžā?', 'Piezīmes un mini skices: skaņas, smaržas, frāzes, joks', 'Rāmis pēc lineāla', 'Tikai viens liels zīmējums', 'Vārdi stāsta, kas notika ap attēlu.']],
    task: { h: 'Putni un cilvēki', need: 'lainers vai otas pildspalva, maza skiču burtnīca, kafejnīca, tramvajs, parks — vai seriāls bez pauzes', time: '40 min',
      steps: ['Iesildīšanās: paskaties pa logu, pagriezies prom, uzzīmē kopējo formu no atmiņas. Paskaties vēlreiz — pievieno detaļas. Salīdzini.', 'Piecas ātras cilvēku vai dzīvnieku skices, pa 1–3 minūtēm, mazs formāts. Vispirms darbības līnija, tad masas.', 'Atvērums “putni un cilvēki”: vismaz trīs putni (sāc ar pilienu) un divi cilvēki.', 'Katrai figūrai — viens iezemējošs ēnas laukums; kontūrus atstāj vaļā.', 'Raksti starpās: ko dzirdi, kā smaržo, noklausīta frāze un viens joks par putnu.'] },
    client: { name: 'Misters Dr. Fišers III', job: 'zivs ar doktora grādu… kaut kādā jomā; baidās no sava atspulga', say: 'Khm. DOKTORS Fišers. Es veicu pētījumu. Ļoti nopietnu. Pīles mūsu dīķī skatās uz mani tā, ka man tas nepatīk, un cilvēki, kas tās baro, ir… aizdomīgi. Vajag lauka pierakstus. Ātrus — viņi taču kustas! Ne fotogrāfiju, es nevaru skatīties uz spīdīgo. Un pieraksti, ko viņi saka. Zinātnes labā.',
      ask: ['Atvērums: vismaz trīs putni un divi cilvēki', 'Ātras līnijas: darbības līnija, vaļēji kontūri', 'Ēnas laukums zem katras figūras', 'Lauka piezīmes: skaņas, smaržas, noklausītas frāzes'] },
  },
};
