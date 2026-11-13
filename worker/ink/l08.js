// Курс туши, урок 8 — «Вода и ошибки» (книга «Ink Sketching», с. 48–49). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '💧', card: 'autumn-cozy/88.png', cover: 'p48-85.jpg',
  en: {
    name: 'Water and mistakes',
    intro: 'Two things scare beginners most: water that runs where it wants, and a line that went wrong. Today we make friends with both. A drop of water turns a line into a shadow, and a mistake turns a drawing into a story.',
    goals: ['make soft and sharp washes with diluted ink', 'plan highlights before the ink goes down', 'turn a mistake or a blot into part of the sketch'],
    th: `<p>Ink + water = a whole scale of greys. A wash gives what lines can’t: soft shadow, air, wetness, the glow of a candle.</p>
${F('p48-85.jpg', 'Wash only: a candle, cups and a can — light is the paper left white')}
<h4>Paper and greys</h4>
<ul><li>Take paper from <b>200 g/m²</b> — thinner paper waves and pills.</li>
<li>Mix several greys in the palette <b>in advance</b>: very pale, middle, dark. Work from light to dark.</li>
<li>Wet ink looks <b>darker</b> than dry — test on a scrap.</li></ul>
<h4>Wet on dry, wet on wet</h4>
<ul><li><b>Wet on dry</b> — brush on dry paper: sharp edges, clear shadows.</li>
<li><b>Wet on wet</b> — brush on damp paper: the ink blooms and gives soft, foggy shadows.</li>
<li><b>Don’t touch</b> a place that is drying — that’s how blooms and dirty edges appear.</li>
<li>Second layer — only when the first is <b>completely dry</b>.</li></ul>
${F('p30-39.jpg', 'Pale and dark washes over a quick ink line — a whole scene in three greys')}
<h4>Plan the white</h4>
<p>Dry ink can’t be lifted. Decide where the highlights are <b>before</b> the brush touches the paper and walk around them.</p>
<h4>Food in wash</h4>
<ul><li>A light watery wash with white highlights — a juicy fruit.</li>
<li>A dry brush and thick ink — bread crust, fried things.</li></ul>
<h4>Mistakes</h4>
<p>A sketch is an impression, not a photo. Fear of a mistake shows on paper: the line gets timid and stiff.</p>
<ul><li>Went wrong? <b>Leave it</b> and draw the “right” line next to it. Two lines are a <b>searching line</b> — livelier than a dead smooth one.</li>
<li>Imperfection is character: a crooked cylinder is the story of an old jar.</li>
<li>A blot is part of the story: turn it into a shadow, a stone texture — or sign it with an arrow: “blot”.</li></ul>
${F('p26-23.jpg', 'Wash, lines, a little colour — and nothing “cleaned up”: that is what makes it alive')}
<p>In the age of neural networks, your “crooked” hand is the most valuable currency.</p>`,
    simple: 'Thick paper, greys mixed in advance, light to dark. Wet on dry — sharp, wet on wet — soft; don’t touch drying ink, wait before the second layer. Plan highlights first. A mistake stays — draw the right line next to it, turn a blot into a shadow.',
    mist: [['Poking at a wash while it dries.', 'Leave it alone; fix only after it is completely dry.'],
      ['Starting with the darkest grey.', 'Go from light to dark — darker can always be added, lighter can’t.'],
      ['Remembering the highlights at the end.', 'Plan the white before the first stroke: dry ink can’t be lifted.'],
      ['Scrubbing out or hiding a wrong line.', 'Leave it and draw the right one next to it — a searching line.']],
    terms: [['Wash', 'a layer of ink diluted with water'], ['Wet on dry', 'wash on dry paper — sharp edges'], ['Wet on wet', 'wash on damp paper — soft, blooming edges'], ['Bloom', 'a ragged “cauliflower” edge when water runs into drying ink'], ['Dry brush', 'little water, thick ink — a scratchy, grainy mark'], ['Searching line', 'several lines side by side while looking for the right form']],
    fact: 'Chinese and Japanese painters ground their ink from a stick on a stone and diluted it for different tones — the tradition speaks of “five colours of ink”, all made from one black.',
    test: [['What paper suits ink washes?', 'From 200 g/m²', 'Thin printer paper', 'Any glossy paper', 'Thick paper doesn’t wave or pill under water.'],
      ['What gives soft, foggy shadows?', 'Wet on wet', 'Wet on dry', 'A dry brush', 'On damp paper ink blooms and the edges melt.'],
      ['When can you put the second layer?', 'When the first is completely dry', 'Right away, while it is wet', 'Never', 'On a drying layer you get blooms and dirt.'],
      ['Why plan highlights in advance?', 'Dry ink can’t be lifted from the paper', 'Highlights are drawn with a white pen anyway', 'It doesn’t matter', 'White in ink is untouched paper.'],
      ['How does a dry brush with thick ink help in food sketches?', 'It shows bread crust and fried things', 'It shows juicy fruit', 'It makes highlights', 'Rough texture = crust; watery wash = juice.'],
      ['A line went wrong. What do you do?', 'Leave it and draw the right one next to it', 'Tear out the page', 'Cover it in black', 'Two lines make a lively searching line.'],
      ['What can a blot become?', 'A shadow, a stone texture or a signed “blot”', 'Only a reason to start over', 'Nothing', 'A blot is part of the sketch’s story.']],
    task: { h: 'Three greys and one blot', need: 'a liner, a brush, ink and water, a palette, paper from 200 g/m², a cup and a fruit', time: '35 min',
      steps: ['Mix three greys in the palette: very pale, middle, dark. Test each on a scrap.', 'Draw a cup and a fruit with a quick line. Mark the highlights — they stay white.', 'Wash the pale grey over everything except the highlights. Wait until it dries completely.', 'Add the middle grey wet on dry to the shadows; somewhere wet the paper first and drop in the dark grey wet on wet.', 'Make one blot on purpose — and turn it into a shadow, a texture or sign it with an arrow.'] },
    client: { name: 'Wren Windlow', job: 'a tiny wren who spends rainy days on the windowsill, counting drops', say: 'Shh, it’s raining, I’m in a meeting with myself. But you may draw it: the window, the drops racing down the glass, my thimble of tea. The rain must be wet — really wet, with water, not just lines. And if a drop of ink falls by accident — let it stay. It’s raining, after all.',
      ask: ['A window in the rain with washes: soft wet-on-wet and sharp wet-on-dry', 'Highlights on the glass and drops left white', 'One accidental blot turned into part of the rain'] },
  },
  ru: {
    name: 'Вода и ошибки',
    intro: 'Больше всего новичков пугают две вещи: вода, которая растекается куда хочет, и линия, которая пошла не туда. Сегодня дружим с обеими. Капля воды превращает линию в тень, а ошибка превращает рисунок в историю.',
    goals: ['делать мягкие и чёткие заливки разбавленной тушью', 'планировать блики до того, как ляжет тушь', 'превращать ошибку или кляксу в часть скетча'],
    th: `<p>Тушь + вода = целая шкала серых. Заливка даёт то, чего не могут линии: мягкую тень, воздух, влажность, свечение свечи.</p>
${F('p48-85.jpg', 'Только заливкой: свеча, чашки и банка — свет это бумага, оставленная белой')}
<h4>Бумага и серые</h4>
<ul><li>Бери бумагу от <b>200 г/м²</b> — тонкая идёт волнами и скатывается.</li>
<li>Разведи несколько серых в палитре <b>заранее</b>: совсем светлый, средний, тёмный. Работай от светлого к тёмному.</li>
<li>Мокрая тушь выглядит <b>темнее</b> сухой — пробуй на обрывке.</li></ul>
<h4>По сухому и по мокрому</h4>
<ul><li><b>Мокрым по сухому</b> — кисть по сухой бумаге: чёткие края, ясные тени.</li>
<li><b>По мокрому</b> — кисть по влажной бумаге: тушь расплывается и даёт мягкие туманные тени.</li>
<li><b>Не трогай</b> подсыхающее место — так появляются «цветочки» и грязные края.</li>
<li>Второй слой — только когда первый <b>полностью высох</b>.</li></ul>
${F('p30-39.jpg', 'Светлые и тёмные заливки поверх быстрой линии — целая сцена в трёх серых')}
<h4>Планируй белое</h4>
<p>Высохшую тушь не снять. Реши, где блики, <b>до того</b>, как кисть коснётся бумаги, и обходи их.</p>
<h4>Еда в заливке</h4>
<ul><li>Светлая водянистая заливка с белыми бликами — сочный фрукт.</li>
<li>Сухая кисть и густая тушь — корочка хлеба, жареное.</li></ul>
<h4>Ошибки</h4>
<p>Скетч — впечатление, а не фото. Страх ошибки виден на бумаге: линия становится робкой и деревянной.</p>
<ul><li>Пошло не туда? <b>Оставь</b> и проведи рядом «правильную» линию. Две линии — это <b>ищущая линия</b>, она живее мёртвой гладкой.</li>
<li>Несовершенство — это характер: кривой цилиндр — история старой банки.</li>
<li>Клякса — часть истории: преврати её в тень, в фактуру камня — или подпиши стрелкой: «клякса».</li></ul>
${F('p26-23.jpg', 'Заливки, линии, немного цвета — и ничего не «вычищено»: поэтому живо')}
<p>В эпоху нейросетей твоя «кривая» рука — самая ценная валюта.</p>`,
    simple: 'Плотная бумага, серые разведены заранее, от светлого к тёмному. По сухому — чётко, по мокрому — мягко; подсыхающее не трогай, второй слой — после высыхания. Блики планируй сначала. Ошибку оставь — рядом проведи верную линию, кляксу преврати в тень.',
    mist: [['Тыкать кистью в подсыхающую заливку.', 'Оставь её в покое; поправляй только после полного высыхания.'],
      ['Начинать с самого тёмного серого.', 'Иди от светлого к тёмному — темнее добавить можно всегда, светлее — нет.'],
      ['Вспоминать про блики в конце.', 'Планируй белое до первого мазка: высохшую тушь не снять.'],
      ['Затирать или прятать неверную линию.', 'Оставь её и проведи рядом верную — это ищущая линия.']],
    terms: [['Заливка (лессировка)', 'слой туши, разбавленной водой'], ['По сухому', 'заливка по сухой бумаге — чёткие края'], ['По мокрому', 'заливка по влажной бумаге — мягкие расплывающиеся края'], ['«Цветочек» (затёк)', 'рваный край, когда вода затекает в подсыхающую тушь'], ['Сухая кисть', 'мало воды, густая тушь — шершавый зернистый след'], ['Ищущая линия', 'несколько линий рядом, пока ищешь верную форму']],
    fact: 'Китайские и японские художники растирали тушь из палочки на камне и разбавляли её для разных тонов — в традиции говорят о «пяти цветах туши», и все они сделаны из одного чёрного.',
    test: [['Какая бумага подходит для заливок тушью?', 'От 200 г/м²', 'Тонкая офисная', 'Любая глянцевая', 'Плотная бумага не идёт волнами и не скатывается от воды.'],
      ['Что даёт мягкие туманные тени?', 'По мокрому', 'Мокрым по сухому', 'Сухая кисть', 'На влажной бумаге тушь расплывается, и края тают.'],
      ['Когда можно класть второй слой?', 'Когда первый полностью высох', 'Сразу, пока мокро', 'Никогда', 'По подсыхающему слою выходят затёки и грязь.'],
      ['Зачем планировать блики заранее?', 'Высохшую тушь с бумаги не снять', 'Блики всё равно рисуют белой ручкой', 'Неважно', 'Белое в туши — нетронутая бумага.'],
      ['Чем помогает сухая кисть с густой тушью в скетчах еды?', 'Показывает корочку хлеба и жареное', 'Показывает сочный фрукт', 'Делает блики', 'Шершавая фактура — корочка; водянистая заливка — сок.'],
      ['Линия пошла не туда. Что делать?', 'Оставить и провести рядом верную', 'Вырвать страницу', 'Закрасить чёрным', 'Две линии дают живую ищущую линию.'],
      ['Чем может стать клякса?', 'Тенью, фактурой камня или подписанной «кляксой»', 'Только поводом начать заново', 'Ничем', 'Клякса — часть истории скетча.']],
    task: { h: 'Три серых и одна клякса', need: 'линер, кисть, тушь и вода, палитра, бумага от 200 г/м², чашка и фрукт', time: '35 мин',
      steps: ['Разведи в палитре три серых: совсем светлый, средний, тёмный. Попробуй каждый на обрывке.', 'Нарисуй чашку и фрукт быстрой линией. Отметь блики — они останутся белыми.', 'Залей светлым серым всё, кроме бликов. Подожди, пока полностью высохнет.', 'Добавь средний серый в тени по сухому; где-нибудь сначала смочи бумагу и капни тёмный по мокрому.', 'Сделай одну кляксу нарочно — и преврати её в тень, фактуру или подпиши стрелкой.'] },
    client: { name: 'Крапивка Окошкина', job: 'крошечная птичка-крапивник, в дождь сидит на подоконнике и считает капли', say: 'Тсс, идёт дождь, у меня встреча с собой. Но рисовать можно: окно, капли, которые бегут наперегонки по стеклу, мой напёрсток с чаем. Дождь должен быть мокрым — по-настоящему, водой, а не только линиями. А если капля туши упадёт случайно — пусть останется. Дождь же.',
      ask: ['Окно в дождь заливками: мягко по мокрому и чётко по сухому', 'Блики на стекле и капли оставлены белыми', 'Одна случайная клякса стала частью дождя'] },
  },
  lv: {
    name: 'Ūdens un kļūdas',
    intro: 'Iesācējus visvairāk biedē divas lietas: ūdens, kas tek, kur grib, un līnija, kas aizgāja ne tur. Šodien sadraudzējamies ar abām. Ūdens piliens pārvērš līniju ēnā, bet kļūda pārvērš zīmējumu stāstā.',
    goals: ['veidot maigus un asus lavierus ar atšķaidītu tušu', 'plānot atspīdumus, pirms uzklāta tuša', 'pārvērst kļūdu vai traipu par skices daļu'],
    th: `<p>Tuša + ūdens = vesela pelēko skala. Laviers dod to, ko nespēj līnijas: maigu ēnu, gaisu, mitrumu, sveces mirdzumu.</p>
${F('p48-85.jpg', 'Tikai ar lavieru: svece, krūzes un bundža — gaisma ir papīrs, kas atstāts balts')}
<h4>Papīrs un pelēkie</h4>
<ul><li>Ņem papīru no <b>200 g/m²</b> — plāns iet viļņos un spolējas.</li>
<li>Atšķaidi paletē vairākus pelēkos <b>iepriekš</b>: pavisam gaišu, vidēju, tumšu. Strādā no gaišā uz tumšo.</li>
<li>Mitra tuša izskatās <b>tumšāka</b> nekā sausa — izmēģini uz strēmelītes.</li></ul>
<h4>Pa sausu un pa mitru</h4>
<ul><li><b>Slapjš pa sausu</b> — ota pa sausu papīru: asas malas, skaidras ēnas.</li>
<li><b>Pa mitru</b> — ota pa mitru papīru: tuša izplūst un dod maigas, miglainas ēnas.</li>
<li><b>Neaiztiec</b> vietu, kas žūst, — tā rodas “ziediņi” un netīras malas.</li>
<li>Otrais slānis — tikai tad, kad pirmais <b>pilnībā izžuvis</b>.</li></ul>
${F('p30-39.jpg', 'Gaiši un tumši lavieri pāri ātrai līnijai — vesela aina trijos pelēkos')}
<h4>Plāno balto</h4>
<p>Izžuvušu tušu nenoņemsi. Izlem, kur būs atspīdumi, <b>pirms</b> ota pieskaras papīram, un apej tos.</p>
<h4>Ēdiens lavierā</h4>
<ul><li>Gaišs ūdeņains laviers ar baltiem atspīdumiem — sulīgs auglis.</li>
<li>Sausa ota un bieza tuša — maizes garoza, cepti ēdieni.</li></ul>
<h4>Kļūdas</h4>
<p>Skice ir iespaids, nevis foto. Bailes no kļūdas redzamas uz papīra: līnija kļūst bikla un stīva.</p>
<ul><li>Aizgāja ne tur? <b>Atstāj</b> un novelc blakus “pareizo” līniju. Divas līnijas ir <b>meklējošā līnija</b> — dzīvāka par mirušu gludu.</li>
<li>Nepilnība ir raksturs: šķībs cilindrs — vecas burkas stāsts.</li>
<li>Traips ir stāsta daļa: pārvērt to ēnā, akmens faktūrā — vai paraksti ar bultu: “traips”.</li></ul>
${F('p26-23.jpg', 'Lavieri, līnijas, nedaudz krāsas — un nekas nav “iztīrīts”: tāpēc dzīvs')}
<p>Neironu tīklu laikmetā tava “šķībā” roka ir visvērtīgākā valūta.</p>`,
    simple: 'Biezs papīrs, pelēkie atšķaidīti iepriekš, no gaišā uz tumšo. Pa sausu — asi, pa mitru — maigi; žūstošo neaiztiec, otrais slānis — pēc izžūšanas. Atspīdumus plāno vispirms. Kļūdu atstāj — blakus novelc pareizo līniju, traipu pārvērt ēnā.',
    mist: [['Bakstīt ar otu žūstošā lavierā.', 'Liec to mierā; labo tikai pēc pilnīgas izžūšanas.'],
      ['Sākt ar tumšāko pelēko.', 'Ej no gaišā uz tumšo — tumšāku var pielikt vienmēr, gaišāku — nē.'],
      ['Atcerēties atspīdumus beigās.', 'Plāno balto pirms pirmā triepiena: izžuvušu tušu nenoņemsi.'],
      ['Berzt ārā vai slēpt nepareizo līniju.', 'Atstāj to un novelc blakus pareizo — tā ir meklējošā līnija.']],
    terms: [['Laviers', 'ar ūdeni atšķaidītas tušas slānis'], ['Pa sausu', 'laviers pa sausu papīru — asas malas'], ['Pa mitru', 'laviers pa mitru papīru — maigas, izplūstošas malas'], ['“Ziediņš”', 'robaina mala, kad ūdens ietek žūstošā tušā'], ['Sausā ota', 'maz ūdens, bieza tuša — raupjš, graudains nospiedums'], ['Meklējošā līnija', 'vairākas līnijas blakus, kamēr meklē pareizo formu']],
    fact: 'Ķīniešu un japāņu mākslinieki berza tušu no stienīša uz akmens un atšķaidīja to dažādiem toņiem — tradīcijā runā par “piecām tušas krāsām”, un visas tās ir no viena melnā.',
    test: [['Kāds papīrs der tušas lavieriem?', 'No 200 g/m²', 'Plāns biroja papīrs', 'Jebkurš glancēts', 'Biezs papīrs no ūdens neiet viļņos un nespolējas.'],
      ['Kas dod maigas, miglainas ēnas?', 'Pa mitru', 'Slapjš pa sausu', 'Sausā ota', 'Uz mitra papīra tuša izplūst, un malas izkūst.'],
      ['Kad var likt otro slāni?', 'Kad pirmais pilnībā izžuvis', 'Uzreiz, kamēr mitrs', 'Nekad', 'Uz žūstoša slāņa rodas ziediņi un netīrumi.'],
      ['Kāpēc atspīdumus plānot iepriekš?', 'Izžuvušu tušu no papīra nenoņemsi', 'Atspīdumus tāpat zīmē ar baltu pildspalvu', 'Nav svarīgi', 'Baltais tušā ir neskarts papīrs.'],
      ['Kā sausā ota ar biezu tušu palīdz ēdiena skicēs?', 'Parāda maizes garozu un ceptus ēdienus', 'Parāda sulīgu augli', 'Veido atspīdumus', 'Raupja faktūra — garoza; ūdeņains laviers — sula.'],
      ['Līnija aizgāja ne tur. Ko darīt?', 'Atstāt un novilkt blakus pareizo', 'Izraut lapu', 'Aizkrāsot melnu', 'Divas līnijas dod dzīvu meklējošo līniju.'],
      ['Par ko var kļūt traips?', 'Par ēnu, akmens faktūru vai parakstītu “traipu”', 'Tikai par iemeslu sākt no jauna', 'Par neko', 'Traips ir skices stāsta daļa.']],
    task: { h: 'Trīs pelēkie un viens traips', need: 'lainers, ota, tuša un ūdens, palete, papīrs no 200 g/m², krūze un auglis', time: '35 min',
      steps: ['Atšķaidi paletē trīs pelēkos: pavisam gaišu, vidēju, tumšu. Izmēģini katru uz strēmelītes.', 'Uzzīmē krūzi un augli ar ātru līniju. Atzīmē atspīdumus — tie paliks balti.', 'Pārklāj ar gaišo pelēko visu, izņemot atspīdumus. Pagaidi, līdz pilnībā izžūst.', 'Pievieno vidējo pelēko ēnās pa sausu; kaut kur vispirms samitrini papīru un iepilini tumšo pa mitru.', 'Uztaisi vienu traipu ar nodomu — un pārvērt to ēnā, faktūrā vai paraksti ar bultu.'] },
    client: { name: 'Čipste Lodziņa', job: 'sīka sētas čipste, lietainās dienās sēž uz palodzes un skaita pilienus', say: 'Čš, līst, man ir tikšanās ar sevi. Bet zīmēt drīkst: logu, pilienus, kas sacenšas pa stiklu, manu uzpirksteni ar tēju. Lietum jābūt slapjam — pa īstam, ar ūdeni, nevis tikai līnijām. Un ja tušas piliens nokrīt nejauši — lai paliek. Līst taču.',
      ask: ['Logs lietū ar lavieriem: maigi pa mitru un asi pa sausu', 'Atspīdumi uz stikla un pilieni atstāti balti', 'Viens nejaušs traips kļuvis par lietus daļu'] },
  },
};
