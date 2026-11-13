// Курс туши, урок 6 — «Негативное пространство» (книга «Ink Sketching», с. 39–40). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '◫', card: 'autumn-cozy/86.png', cover: 'p40-67.jpg',
  en: {
    name: 'Negative space',
    intro: 'Today we draw… nothing. More exactly — the holes between things. It sounds strange, but it is the quickest way to stop drawing what you “know” and start drawing what you see.',
    goals: ['see and draw the shapes between objects', 'make a light object stand out without an outline', 'use empty paper as part of the composition'],
    th: `<p>Your brain is in a hurry. It sees a chair, names it “chair” and hands your hand a ready-made symbol: four sticks and a square. The real chair in front of you looks different — but the symbol wins.</p>
<p>The space <b>between</b> things has no name and no symbol. The gap between the legs of a chair, the light between the spokes of a bicycle, the sky between branches — the brain doesn’t know what they “should” look like, so you draw them as they are. And suddenly the chair is right.</p>
<h4>Background instead of outline</h4>
<p>Fill the background next to the <b>light edge</b> of an object — and the object “jumps out” by itself, without any contour. The white of the paper becomes its body.</p>
${F('p40-67.jpg', 'The lit side of the cup has no line at all — the shadow and the background draw it')}
<ul><li>Where a highlight is as light as the background — <b>remove the line</b>. The eye connects the edge itself.</li>
<li>Dark windows and roofs are enough for a white house: the walls are drawn by what surrounds them.</li></ul>
${F('p40-65.jpg', 'White walls — only the dark around and inside them')}
<h4>Emptiness has weight</h4>
<p>Empty paper is not “unfinished”. It is air, light, a pause. A page packed with details <b>suffocates</b>; a page with breathing space lets the eye rest and find the main thing.</p>
<h4>The Rubin vase</h4>
<p>A famous picture: a white vase — or two dark faces in profile? The empty shape becomes a figure of its own. Check your sketch for this: does a random gap between objects look like a heart, a vase, a funny face? If it does — change it, or use it on purpose.</p>
<h4>Where to look for negative shapes</h4>
<ul><li>between the legs of a chair or a table;</li>
<li>between the branches and leaves of a houseplant;</li>
<li>in a door or window opening;</li>
<li>in the gap between two houses;</li>
<li>in the stripes of light from blinds;</li>
<li>between your fingers, a cat’s paws, the handle of a cup and its body.</li></ul>`,
    simple: 'The brain draws symbols of things it knows; the gaps between things have no symbol — so draw them, and the object comes out right. Dark next to a light edge makes it pop without a line. Empty paper has weight — let the page breathe.',
    mist: [['Drawing the object from memory — “a chair is four sticks”.', 'Draw the gaps between the legs and rails — they show the true chair.'],
      ['Outlining a white object on a white page.', 'Darken the background next to its light edge — no contour needed.'],
      ['Filling every corner of the page.', 'Leave empty paper: it is air and a pause for the eye.'],
      ['An accidental gap shaped like a heart or a face.', 'Check the empty shapes — change them or use them on purpose.']],
    terms: [['Positive space', 'the objects themselves'], ['Negative space', 'the shapes between and around objects'], ['Symbol', 'a ready-made image from memory that replaces what you actually see'], ['Lost edge', 'a place where the contour disappears because object and background have the same tone'], ['Rubin vase', 'an image where the empty shape becomes a figure — a vase or two faces'], ['Breathing space', 'empty paper that gives the composition air']],
    fact: 'The Rubin vase was described in 1915 by the Danish psychologist Edgar Rubin. Artists used the trick long before: in Japanese ink painting, unpainted paper is often the most important part — mist, water, sky.',
    test: [['Why is it easier to draw the gaps between things?', 'They have no name or ready symbol in the brain', 'They are always smaller', 'They don’t need ink', 'Without a symbol, you draw what you really see.'],
      ['How can you show a white cup on white paper without an outline?', 'Darken the background next to its light edge', 'Draw a thick black contour', 'Colour the cup grey', 'The dark around the light edge draws the shape itself.'],
      ['What do you do with the line where a highlight is as light as the background?', 'Remove it — the eye joins the edge itself', 'Make it bolder', 'Hatch over it', 'A lost edge makes the light look brighter.'],
      ['What happens to a page packed with details?', 'It “suffocates” — the eye can’t rest or find the main thing', 'It looks finished and professional', 'Nothing', 'Empty paper has weight and is part of the composition.'],
      ['What is the Rubin vase effect?', 'An empty shape that becomes a figure of its own', 'A vase drawn with negative space', 'Ink spreading on wet paper', 'Check accidental gaps — they can turn into hearts or faces.'],
      ['Where is a good place to look for negative shapes?', 'Between the legs of a chair', 'In the middle of a white wall', 'Only in the sky', 'Gaps between legs, branches and spokes are the best training.']],
    task: { h: 'Drawing the emptiness', need: 'a liner or brush pen, a sketchbook page, a chair, a houseplant, a window or blinds nearby', time: '25 min',
      steps: ['Find a “silhouette of emptiness”: the legs of a chair, the branches of a plant, a door or window opening, a gap between houses, the shadows of blinds.', 'Draw ONLY the empty shapes — do not draw the object itself at all.', 'Fill the empty shapes with texture: hatching or dots, with a little “noise”.', 'The object stays clean white paper. Is it recognisable?', 'Look at the rhythm of the holes: where they are big, where small, where they repeat. Write one word about it next to the sketch.'] },
    client: { name: 'Mittens Mulligan', job: 'grey cat in a knitted sweater, owner of the radiator from October to April', say: 'Mrrr. Everybody draws me. Nobody draws my radiator — the real hero, the warm one, with all those lovely gaps. Draw the radiator and the chair beside it. But only the gaps, please. I will lie in the white part and look magnificent.',
      ask: ['Only negative shapes: between the radiator ribs, chair legs or plant leaves', 'The gaps filled with texture, the objects left white', 'A word about the rhythm of the holes'] },
  },
  ru: {
    name: 'Негативное пространство',
    intro: 'Сегодня рисуем… ничего. Точнее — дырки между предметами. Звучит странно, но это самый быстрый способ перестать рисовать то, что «знаешь», и начать рисовать то, что видишь.',
    goals: ['видеть и рисовать формы между предметами', 'выделять светлый предмет без контура', 'делать пустую бумагу частью композиции'],
    th: `<p>Мозг торопится. Видит стул, называет его «стул» и подсовывает руке готовый символ: четыре палочки и квадрат. Настоящий стул перед тобой выглядит иначе — но символ побеждает.</p>
<p>У пространства <b>между</b> предметами нет ни названия, ни символа. Щель между ножками стула, свет между спицами велосипеда, небо между ветками — мозг не знает, как они «должны» выглядеть, и ты рисуешь их такими, какие они есть. И вдруг стул получается верным.</p>
<h4>Фон вместо контура</h4>
<p>Залей фон рядом со <b>светлым краем</b> предмета — и предмет сам «выпрыгнет» вперёд, без всякого контура. Белая бумага станет его телом.</p>
${F('p40-67.jpg', 'У освещённой стороны чашки нет линии вовсе — её рисуют тень и фон')}
<ul><li>Там, где блик такой же светлый, как фон, — <b>убери линию</b>. Глаз соединит край сам.</li>
<li>Для белого дома хватит тёмных окон и крыш: стены нарисованы тем, что вокруг и внутри них.</li></ul>
${F('p40-65.jpg', 'Белые стены — только тёмное вокруг и внутри них')}
<h4>У пустоты есть вес</h4>
<p>Пустая бумага — это не «недоделано». Это воздух, свет, пауза. Лист, забитый деталями, <b>задыхается</b>; лист с местом для дыхания даёт глазу отдохнуть и найти главное.</p>
<h4>Ваза Рубина</h4>
<p>Знаменитая картинка: белая ваза — или два тёмных профиля? Пустая форма становится самостоятельной фигурой. Проверяй свой скетч: не похожа ли случайная щель между предметами на сердечко, вазу, смешную рожицу? Если похожа — измени её или используй нарочно.</p>
<h4>Где искать негативные формы</h4>
<ul><li>между ножками стула или стола;</li>
<li>между ветками и листьями комнатного растения;</li>
<li>в проёме двери или окна;</li>
<li>в щели между двумя домами;</li>
<li>в полосках света от жалюзи;</li>
<li>между пальцами, лапами кота, ручкой чашки и её стенкой.</li></ul>`,
    simple: 'Мозг рисует символы знакомых вещей; у дыр между вещами символа нет — рисуй их, и предмет получится верным. Тёмное рядом со светлым краем выделяет его без линии. У пустой бумаги есть вес — дай листу дышать.',
    mist: [['Рисовать предмет по памяти — «стул — это четыре палочки».', 'Рисуй щели между ножками и перекладинами — они покажут настоящий стул.'],
      ['Обводить белый предмет на белом листе.', 'Затемни фон рядом с его светлым краем — контур не нужен.'],
      ['Заполнять каждый угол листа.', 'Оставь пустую бумагу: это воздух и пауза для глаза.'],
      ['Случайная щель в форме сердечка или рожицы.', 'Проверь пустые формы — измени их или используй нарочно.']],
    terms: [['Позитивное пространство', 'сами предметы'], ['Негативное пространство', 'формы между предметами и вокруг них'], ['Символ', 'готовая картинка из памяти, которая подменяет то, что видишь на самом деле'], ['Потерянный край', 'место, где контур исчезает, потому что тон предмета и фона одинаковый'], ['Ваза Рубина', 'изображение, где пустая форма становится фигурой — ваза или два лица'], ['Место для дыхания', 'пустая бумага, которая даёт композиции воздух']],
    fact: 'Вазу Рубина описал в 1915 году датский психолог Эдгар Рубин. Художники пользовались этим задолго до него: в японской живописи тушью незакрашенная бумага часто — самое главное: туман, вода, небо.',
    test: [['Почему щели между предметами рисовать проще?', 'У них нет названия и готового символа в мозгу', 'Они всегда меньше', 'Им не нужна тушь', 'Без символа рисуешь то, что действительно видишь.'],
      ['Как показать белую чашку на белой бумаге без контура?', 'Затемнить фон рядом с её светлым краем', 'Обвести толстым чёрным контуром', 'Закрасить чашку серым', 'Тёмное вокруг светлого края само рисует форму.'],
      ['Что делать с линией там, где блик такой же светлый, как фон?', 'Убрать — глаз соединит край сам', 'Сделать жирнее', 'Заштриховать поверх', 'Потерянный край делает свет ярче.'],
      ['Что происходит с листом, забитым деталями?', 'Он «задыхается» — глазу негде отдохнуть и найти главное', 'Выглядит законченным и профессиональным', 'Ничего', 'Пустая бумага имеет вес и тоже часть композиции.'],
      ['Что такое эффект вазы Рубина?', 'Пустая форма становится самостоятельной фигурой', 'Ваза, нарисованная негативным пространством', 'Тушь растекается по мокрой бумаге', 'Проверяй случайные щели — они могут превратиться в сердечки или лица.'],
      ['Где хорошо искать негативные формы?', 'Между ножками стула', 'Посреди белой стены', 'Только в небе', 'Щели между ножками, ветками и спицами — лучшая тренировка.']],
    task: { h: 'Рисуем пустоту', need: 'линер или брашпен, страница скетчбука, рядом стул, комнатное растение, окно или жалюзи', time: '25 мин',
      steps: ['Найди «силуэт пустоты»: ножки стула, ветки растения, проём двери или окна, щель между домами, тени жалюзи.', 'Рисуй ТОЛЬКО пустые формы — сам предмет не рисуй вовсе.', 'Заполни пустые формы фактурой: штриховкой или точками, с капелькой «шума».', 'Предмет остаётся чистой белой бумагой. Узнаётся?', 'Посмотри на ритм дыр: где они большие, где маленькие, где повторяются. Напиши рядом со скетчем одно слово об этом.'] },
    client: { name: 'Мурка Маллиган', job: 'серая кошка в вязаном свитере, хозяйка батареи с октября по апрель', say: 'Мрр. Меня рисуют все. Никто не рисует мою батарею — настоящую героиню, тёплую, со всеми этими чудесными щелями. Нарисуй батарею и стул рядом. Но только щели, пожалуйста. А я улягусь в белом и буду выглядеть великолепно.',
      ask: ['Только негативные формы: между рёбрами батареи, ножками стула или листьями растения', 'Щели заполнены фактурой, предметы — белые', 'Слово о ритме дыр'] },
  },
  lv: {
    name: 'Negatīvā telpa',
    intro: 'Šodien zīmējam… neko. Precīzāk — caurumus starp priekšmetiem. Izklausās dīvaini, bet tas ir ātrākais veids, kā beigt zīmēt to, ko “zini”, un sākt zīmēt to, ko redzi.',
    goals: ['redzēt un zīmēt formas starp priekšmetiem', 'izcelt gaišu priekšmetu bez kontūra', 'padarīt tukšo papīru par kompozīcijas daļu'],
    th: `<p>Smadzenes steidzas. Tās ierauga krēslu, nosauc to par “krēslu” un iedod rokai gatavu simbolu: četri kociņi un kvadrāts. Īstais krēsls tavā priekšā izskatās citādi — bet simbols uzvar.</p>
<p>Telpai <b>starp</b> priekšmetiem nav ne nosaukuma, ne simbola. Sprauga starp krēsla kājām, gaisma starp riteņa spieķiem, debesis starp zariem — smadzenes nezina, kā tām “jāizskatās”, un tu tās zīmē tādas, kādas tās ir. Un pēkšņi krēsls sanāk pareizs.</p>
<h4>Fons kontūra vietā</h4>
<p>Aizpildi fonu blakus priekšmeta <b>gaišajai malai</b> — un priekšmets pats “izlec” uz priekšu, bez jebkāda kontūra. Baltais papīrs kļūst par tā ķermeni.</p>
${F('p40-67.jpg', 'Krūzes apgaismotajai pusei līnijas nav vispār — to zīmē ēna un fons')}
<ul><li>Kur atspīdums ir tikpat gaišs kā fons, — <b>noņem līniju</b>. Acs pati savienos malu.</li>
<li>Baltai mājai pietiek ar tumšiem logiem un jumtiem: sienas uzzīmē tas, kas ap tām un tajās.</li></ul>
${F('p40-65.jpg', 'Baltas sienas — tikai tumšais ap tām un tajās')}
<h4>Tukšumam ir svars</h4>
<p>Tukšs papīrs nav “nepabeigts”. Tas ir gaiss, gaisma, pauze. Lapa, kas piebāzta ar detaļām, <b>smok</b>; lapa ar vietu elpai ļauj acij atpūsties un atrast galveno.</p>
<h4>Rubina vāze</h4>
<p>Slavens attēls: balta vāze — vai divi tumši profili? Tukšā forma kļūst par patstāvīgu figūru. Pārbaudi savu skici: vai nejauša sprauga starp priekšmetiem neizskatās pēc sirsniņas, vāzes, smieklīgas sejiņas? Ja izskatās — maini to vai izmanto ar nodomu.</p>
<h4>Kur meklēt negatīvās formas</h4>
<ul><li>starp krēsla vai galda kājām;</li>
<li>starp istabas auga zariem un lapām;</li>
<li>durvju vai loga ailē;</li>
<li>spraugā starp divām mājām;</li>
<li>gaismas joslās no žalūzijām;</li>
<li>starp pirkstiem, kaķa ķepām, krūzes osu un tās sieniņu.</li></ul>`,
    simple: 'Smadzenes zīmē pazīstamu lietu simbolus; caurumiem starp lietām simbola nav — zīmē tos, un priekšmets sanāks pareizs. Tumšais blakus gaišai malai izceļ to bez līnijas. Tukšam papīram ir svars — ļauj lapai elpot.',
    mist: [['Zīmēt priekšmetu no atmiņas — “krēsls ir četri kociņi”.', 'Zīmē spraugas starp kājām un šķērskokiem — tās parādīs īsto krēslu.'],
      ['Apvilkt baltu priekšmetu uz baltas lapas.', 'Patumšo fonu blakus tā gaišajai malai — kontūrs nav vajadzīgs.'],
      ['Aizpildīt katru lapas stūri.', 'Atstāj tukšu papīru: tas ir gaiss un pauze acij.'],
      ['Nejauša sprauga sirsniņas vai sejiņas formā.', 'Pārbaudi tukšās formas — maini tās vai izmanto ar nodomu.']],
    terms: [['Pozitīvā telpa', 'paši priekšmeti'], ['Negatīvā telpa', 'formas starp priekšmetiem un ap tiem'], ['Simbols', 'gatavs attēls no atmiņas, kas aizstāj to, ko patiesībā redzi'], ['Pazudusī mala', 'vieta, kur kontūrs pazūd, jo priekšmeta un fona tonis ir vienāds'], ['Rubina vāze', 'attēls, kurā tukšā forma kļūst par figūru — vāzi vai divām sejām'], ['Vieta elpai', 'tukšs papīrs, kas dod kompozīcijai gaisu']],
    fact: 'Rubina vāzi 1915. gadā aprakstīja dāņu psihologs Edgars Rubins. Mākslinieki to izmantoja jau sen pirms viņa: japāņu tušas glezniecībā nekrāsotais papīrs bieži ir pats svarīgākais — migla, ūdens, debesis.',
    test: [['Kāpēc spraugas starp priekšmetiem zīmēt ir vieglāk?', 'Tām smadzenēs nav nosaukuma un gatava simbola', 'Tās vienmēr ir mazākas', 'Tām nevajag tušu', 'Bez simbola zīmē to, ko tiešām redzi.'],
      ['Kā parādīt baltu krūzi uz balta papīra bez kontūra?', 'Patumšot fonu blakus tās gaišajai malai', 'Apvilkt ar biezu melnu kontūru', 'Nokrāsot krūzi pelēku', 'Tumšais ap gaišo malu pats uzzīmē formu.'],
      ['Ko darīt ar līniju tur, kur atspīdums ir tikpat gaišs kā fons?', 'Noņemt — acs pati savienos malu', 'Padarīt treknāku', 'Nosvītrot pāri', 'Pazudusī mala padara gaismu spožāku.'],
      ['Kas notiek ar lapu, kas piebāzta ar detaļām?', 'Tā “smok” — acij nav kur atpūsties un atrast galveno', 'Izskatās pabeigta un profesionāla', 'Nekas', 'Tukšam papīram ir svars, un tas arī ir kompozīcijas daļa.'],
      ['Kas ir Rubina vāzes efekts?', 'Tukša forma kļūst par patstāvīgu figūru', 'Vāze, uzzīmēta ar negatīvo telpu', 'Tuša izplūst pa mitru papīru', 'Pārbaudi nejaušas spraugas — tās var pārvērsties sirsniņās vai sejās.'],
      ['Kur labi meklēt negatīvās formas?', 'Starp krēsla kājām', 'Baltas sienas vidū', 'Tikai debesīs', 'Spraugas starp kājām, zariem un spieķiem ir labākais treniņš.']],
    task: { h: 'Zīmējam tukšumu', need: 'lainers vai otas pildspalva, skiču burtnīcas lapa, tuvumā krēsls, istabas augs, logs vai žalūzijas', time: '25 min',
      steps: ['Atrodi “tukšuma siluetu”: krēsla kājas, auga zarus, durvju vai loga ailu, spraugu starp mājām, žalūziju ēnas.', 'Zīmē TIKAI tukšās formas — pašu priekšmetu nezīmē nemaz.', 'Aizpildi tukšās formas ar faktūru: svītrojumu vai punktiem, ar piliecienu “trokšņa”.', 'Priekšmets paliek tīrs balts papīrs. Vai to var atpazīt?', 'Paskaties uz caurumu ritmu: kur tie lieli, kur mazi, kur atkārtojas. Uzraksti blakus skicei vienu vārdu par to.'] },
    client: { name: 'Minka Maligana', job: 'pelēka kaķene adītā džemperī, radiatora saimniece no oktobra līdz aprīlim', say: 'Murr. Mani zīmē visi. Neviens nezīmē manu radiatoru — īsto varoni, silto, ar visām tām brīnišķīgajām spraugām. Uzzīmē radiatoru un krēslu blakus. Bet tikai spraugas, lūdzu. Es iegulšos baltajā un izskatīšos lieliski.',
      ask: ['Tikai negatīvās formas: starp radiatora ribām, krēsla kājām vai auga lapām', 'Spraugas aizpildītas ar faktūru, priekšmeti — balti', 'Vārds par caurumu ritmu'] },
  },
};
