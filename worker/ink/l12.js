// Курс туши, урок 12 — «Еда, рецепты, композиция и ритм» (книга «Ink Sketching», с. 64–68). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '🍞', card: 'autumn-cozy/81.png', cover: 'p65-122.jpg',
  en: {
    name: 'Food and composition',
    intro: 'Breakfast cools down, ice cream melts — food teaches you to be quick and to look for what makes it tasty. Then we turn a recipe into a picture map and learn where to put things on the page so the eye knows where to go.',
    goals: ['draw food quickly through its recognisable signs', 'turn a process into a clear sketch with steps, arrows and lettering', 'place things on the page with composition, rhythm and white space'],
    th: `<p>Drawing food and recipes is an old tradition: travellers and scientists filled notebooks with plants, fruit and dishes they met on the way. A drawn recipe is often clearer than a written one — and it becomes a <b>family archive</b>: the shape of grandma’s pan, the colour of the sauce.</p>
<h4>Food: be quick, find the signs</h4>
${F('p65-122.jpg', 'A quick lunch on a diary page: a cup is a cylinder, fries are sticks, the shadow puts them on the page, the lettering is part of the picture')}
<ul><li>Food cools down and gets eaten — <b>speed</b> matters more than accuracy.</li>
<li>Look for the <b>recognisable signs</b>: a crust, the see-through slice of a lemon, the shine of a sauce, steam.</li>
<li>Start with simple shapes (a cup — a cylinder, toast — a block), then crumbs and steam. A light wash — a juicy egg yolk; a dark one — coffee.</li></ul>
<h4>A recipe is a map</h4>
<ul><li>Clear <b>states</b>: raw — mixed — baked.</li>
<li><b>Arrows, frames</b>, hands and tools show what happens; everything extra goes.</li>
<li><b>Lettering</b> is a texture too: a title in architectural capitals, small notes in quick italics — but readable.</li></ul>
<h4>Composition</h4>
${F('p68-127.jpg', 'Composition schemes: rule of thirds, golden spiral, diagonal, pyramid, S-curve (like a road), L-shape')}
<p>Composition is how <b>visual weight</b> is spread over the page. Put the main thing on a third, not in the dead centre. Use a <b>viewfinder</b> — a frame of your fingers or a cut card — to choose. <b>Leading lines</b> (cutlery, the edge of a table, a line of text) bring the eye in. The darkest dark next to the whitest white is the <b>anchor</b> — the centre of interest.</p>
<h4>Rhythm</h4>
${F('p67-125.jpg', 'Kinds of rhythm: flowing, progressive, regular, random')}
<ul><li>Rhythm is <b>repetition</b> — of lines, spots, textures — with small “breaks” in size or tilt so it doesn’t get boring.</li>
<li>Regular (even), alternating, <b>progressive</b> (café tables going into the distance — smaller and lighter), <b>flowing</b> (steam, greenery, ice cream).</li>
<li>Dense places need quiet ones. <b>White is the silence in music</b>.</li></ul>`,
    simple: 'Draw food fast, through its signs: crust, shine, steam. A recipe is a map of states with arrows, frames and readable lettering. Put the main thing on a third, lead the eye with lines, anchor it with the darkest dark next to the whitest white. Rhythm is repetition with small breaks; white space is the pause.',
    mist: [['Food drawn slowly, every crumb, while it gets cold.', 'Simple shapes first, then the signs that make it tasty — quickly.'],
      ['A recipe with every tiny step and no arrows.', 'Clear states, arrows, frames; cut the extra.'],
      ['Lettering squeezed in as an afterthought.', 'Plan it as part of the picture: capitals for the title, italics for notes.'],
      ['The main thing in the dead centre, everything the same weight.', 'Put it on a third and give it the strongest contrast.'],
      ['The whole page filled edge to edge.', 'Leave white — dense places need quiet ones.']],
    terms: [['Visual weight', 'how strongly a part of the page pulls the eye'], ['Rule of thirds', 'putting important things on lines that divide the page into thirds'], ['Viewfinder', 'a frame of fingers or card to choose a composition'], ['Leading lines', 'lines that bring the eye to the centre of interest'], ['Anchor', 'the darkest dark next to the whitest white — the centre of interest'], ['Progressive rhythm', 'repeats that grow smaller and lighter into the distance'], ['Flowing rhythm', 'soft, wavy repetition, like steam or leaves']],
    fact: 'The phrase “rule of thirds” was first printed in 1797 by the English painter John Thomas Smith in his book “Remarks on Rural Scenery”. He suggested it for balancing light and dark masses in a landscape.',
    test: [['What matters most when drawing food?', 'Speed and its recognisable signs: crust, shine, steam', 'Every crumb in detail', 'A ruler-straight outline', 'Food cools down — catch what makes it tasty.'],
      ['What makes a drawn recipe clear?', 'Clear states, arrows, frames, nothing extra', 'Every small step', 'Lots of shading', 'A recipe is a map — it needs a route, not clutter.'],
      ['How should lettering be treated?', 'As part of the picture: capitals for titles, readable italics for notes', 'Squeezed in at the end', 'Avoided', 'Lettering is also a texture on the page.'],
      ['Where to put the main object?', 'On a third, not in the dead centre', 'Exactly in the middle', 'In a corner, half cut off', 'Thirds give the page tension and balance.'],
      ['What is the “anchor” of a composition?', 'The darkest dark next to the whitest white', 'The biggest object', 'The title', 'The strongest contrast catches the eye first.'],
      ['What is a progressive rhythm?', 'Repeats that get smaller and lighter into the distance', 'Exactly equal repeats', 'Random dots', 'Like café tables going away from you.'],
      ['What is white space in a sketch?', 'The pause — like silence in music', 'A mistake to fill', 'Unfinished work', 'Dense places need quiet ones to breathe.']],
    task: { h: 'Breakfast as a recipe', need: 'a liner, a brush pen or a brush with diluted ink, a sketchbook spread, your breakfast', time: '40 min',
      steps: ['Use a viewfinder to choose the composition; put the main thing on a third.', 'Draw breakfast as a set of visual facts: a cup — a cylinder, toast — a block; clean contours first, then crumbs and steam.', 'Add washes: light — egg, juice; dark — coffee. Keep the brightest white next to the darkest dark at the centre of interest.', 'Next to it, show a process in 3–4 frames with arrows and labels: brewing coffee, putting on slippers or screwing in a light bulb.', 'Letter it: a title in capitals, ingredients and time in quick italics. Leave white space.'] },
    client: { name: 'Barnaby Burrows', job: 'a badger baker who talks to his sourdough starter like an old friend', say: 'Morning! Been up since four — the starter was in a mood. Listen, folk keep asking for my loaf recipe, and I can’t write it down proper, I just know it in my paws. Could you draw it? Flour, water, the starter, the folding, the waiting, the crackly crust. Big letters on top. And put the loaf where folk see it first — it’s the star.',
      ask: ['A recipe in 4–6 frames with arrows', 'A readable title and short labels', 'The finished loaf on a third, with the strongest contrast', 'White space between the steps'] },
  },
  ru: {
    name: 'Еда и композиция',
    intro: 'Завтрак остывает, мороженое тает — еда учит рисовать быстро и искать то, что делает её вкусной. Потом превратим рецепт в карту-картинку и научимся раскладывать всё на листе так, чтобы глаз знал, куда идти.',
    goals: ['быстро рисовать еду через её узнаваемые признаки', 'превращать процесс в ясный скетч с шагами, стрелками и надписями', 'раскладывать предметы на листе: композиция, ритм и белое'],
    th: `<p>Рисовать еду и рецепты — старая традиция: путешественники и учёные заполняли блокноты растениями, фруктами и блюдами, встреченными в пути. Нарисованный рецепт часто понятнее написанного — и становится <b>семейным архивом</b>: форма бабушкиной сковородки, цвет соуса.</p>
<h4>Еда: быстро и по признакам</h4>
${F('p65-122.jpg', 'Быстрый обед на странице ежедневника: стакан — цилиндр, картошка — палочки, тень ставит их на лист, надпись — часть картинки')}
<ul><li>Еда остывает и съедается — <b>скорость</b> важнее точности.</li>
<li>Ищи <b>узнаваемые признаки</b>: корочка, прозрачный ломтик лимона, блеск соуса, пар.</li>
<li>Сначала простые фигуры (чашка — цилиндр, тост — брусок), потом крошки и пар. Светлая заливка — сочный желток, тёмная — кофе.</li></ul>
<h4>Рецепт — это карта</h4>
<ul><li>Ясные <b>состояния</b>: сырое — смешанное — испечённое.</li>
<li><b>Стрелки, рамки</b>, руки и инструменты показывают, что происходит; всё лишнее — долой.</li>
<li><b>Надписи</b> — тоже фактура: заголовок архитектурными капителями, мелочи — беглым курсивом, но читабельно.</li></ul>
<h4>Композиция</h4>
${F('p68-127.jpg', 'Схемы композиции: правило третей, золотая спираль, диагональ, пирамида, S-кривая (как дорога), L-форма')}
<p>Композиция — это распределение <b>визуального веса</b> по листу. Главное ставь на треть, а не в мёртвый центр. Выбирай <b>видоискателем</b> — рамкой из пальцев или вырезанной карточкой. <b>Ведущие линии</b> (приборы, край стола, строка текста) приводят глаз внутрь. Самое тёмное рядом с самым белым — <b>якорь</b>, центр интереса.</p>
<h4>Ритм</h4>
${F('p67-125.jpg', 'Виды ритма: текучий, прогрессивный, равномерный, случайный')}
<ul><li>Ритм — это <b>повторение</b> линий, пятен, фактур — с маленькими «сбоями» по размеру или наклону, чтобы не было скучно.</li>
<li>Равномерный, чередующийся, <b>прогрессивный</b> (столики кафе уходят вдаль — мельче и светлее), <b>текучий</b> (пар, зелень, мороженое).</li>
<li>Плотным местам нужны тихие. <b>Белое — это тишина в музыке</b>.</li></ul>`,
    simple: 'Еду рисуй быстро, по признакам: корочка, блеск, пар. Рецепт — карта состояний со стрелками, рамками и читабельными надписями. Главное — на треть, глаз веди линиями, якорь — самое тёмное рядом с самым белым. Ритм — повторение с маленькими сбоями; белое — пауза.',
    mist: [['Еда рисуется медленно, каждая крошка, пока остывает.', 'Сначала простые фигуры, потом признаки вкусного — быстро.'],
      ['Рецепт со всеми мелкими шагами и без стрелок.', 'Ясные состояния, стрелки, рамки; лишнее убрать.'],
      ['Надпись втиснута в последний момент.', 'Планируй её как часть картинки: капители для заголовка, курсив для заметок.'],
      ['Главное в мёртвом центре, всё одного веса.', 'Поставь на треть и дай ему самый сильный контраст.'],
      ['Весь лист забит от края до края.', 'Оставь белое — плотным местам нужны тихие.']],
    terms: [['Визуальный вес', 'насколько сильно часть листа притягивает глаз'], ['Правило третей', 'важное — на линиях, делящих лист на трети'], ['Видоискатель', 'рамка из пальцев или картона, чтобы выбрать композицию'], ['Ведущие линии', 'линии, которые приводят глаз к центру интереса'], ['Якорь', 'самое тёмное рядом с самым белым — центр интереса'], ['Прогрессивный ритм', 'повторы, которые вдаль становятся мельче и светлее'], ['Текучий ритм', 'мягкое волнистое повторение, как пар или листва']],
    fact: 'Выражение «правило третей» впервые напечатал в 1797 году английский художник Джон Томас Смит в книге «Заметки о сельском пейзаже». Он советовал так уравновешивать светлые и тёмные массы в пейзаже.',
    test: [['Что важнее всего, когда рисуешь еду?', 'Скорость и узнаваемые признаки: корочка, блеск, пар', 'Каждая крошка подробно', 'Контур по линейке', 'Еда остывает — лови то, что делает её вкусной.'],
      ['Что делает нарисованный рецепт понятным?', 'Ясные состояния, стрелки, рамки, ничего лишнего', 'Каждый мелкий шаг', 'Много штриховки', 'Рецепт — карта: нужен маршрут, а не завалы.'],
      ['Как относиться к надписям?', 'Как к части картинки: капители для заголовков, читабельный курсив для заметок', 'Втиснуть в конце', 'Избегать', 'Надпись — тоже фактура на листе.'],
      ['Куда поставить главный предмет?', 'На треть, а не в мёртвый центр', 'Ровно в середину', 'В угол, наполовину обрезанным', 'Трети дают листу напряжение и равновесие.'],
      ['Что такое «якорь» композиции?', 'Самое тёмное рядом с самым белым', 'Самый большой предмет', 'Заголовок', 'Самый сильный контраст ловит глаз первым.'],
      ['Что такое прогрессивный ритм?', 'Повторы, которые вдаль становятся мельче и светлее', 'Совершенно одинаковые повторы', 'Случайные точки', 'Как столики кафе, уходящие от тебя.'],
      ['Что такое белое в скетче?', 'Пауза — как тишина в музыке', 'Ошибка, которую надо заполнить', 'Недоделка', 'Плотным местам нужны тихие, чтобы дышать.']],
    task: { h: 'Завтрак как рецепт', need: 'линер, брашпен или кисть с разбавленной тушью, разворот скетчбука, твой завтрак', time: '40 мин',
      steps: ['Видоискателем выбери композицию; главное поставь на треть.', 'Нарисуй завтрак как набор визуальных фактов: чашка — цилиндр, тост — брусок; сначала ровные контуры, потом крошки и пар.', 'Добавь заливки: светлая — яйцо, сок; тёмная — кофе. Самое белое рядом с самым тёмным — в центре интереса.', 'Рядом покажи процесс в 3–4 кадрах со стрелками и подписями: заварить кофе, надеть тапки или вкрутить лампочку.', 'Подпиши: заголовок капителями, ингредиенты и время — беглым курсивом. Оставь белое.'] },
    client: { name: 'Барнаби Барроуз', job: 'барсук-пекарь, который разговаривает со своей закваской, как со старым другом', say: 'Доброе утро! Я с четырёх на ногах — закваска капризничала. Слушай, все просят рецепт моего хлеба, а записать его толком я не умею — он у меня в лапах. Нарисуешь? Мука, вода, закваска, складывание, ожидание, хрустящая корочка. Сверху — большими буквами. И поставь каравай туда, куда глядят первым делом, — он тут звезда.',
      ask: ['Рецепт в 4–6 кадрах со стрелками', 'Читабельный заголовок и короткие подписи', 'Готовый каравай на трети, с самым сильным контрастом', 'Белое между шагами'] },
  },
  lv: {
    name: 'Ēdiens un kompozīcija',
    intro: 'Brokastis atdziest, saldējums kūst — ēdiens māca zīmēt ātri un meklēt to, kas padara to garšīgu. Pēc tam pārvērtīsim recepti par karti-attēlu un iemācīsimies izkārtot visu lapā tā, lai acs zinātu, kurp iet.',
    goals: ['ātri zīmēt ēdienu pēc tā atpazīstamajām pazīmēm', 'pārvērst procesu skaidrā skicē ar soļiem, bultām un uzrakstiem', 'izkārtot priekšmetus lapā: kompozīcija, ritms un baltais'],
    th: `<p>Zīmēt ēdienu un receptes ir sena tradīcija: ceļotāji un zinātnieki pildīja piezīmju grāmatiņas ar augiem, augļiem un ēdieniem, ko sastapa ceļā. Uzzīmēta recepte bieži ir saprotamāka par uzrakstītu — un kļūst par <b>ģimenes arhīvu</b>: vecmāmiņas pannas forma, mērces krāsa.</p>
<h4>Ēdiens: ātri un pēc pazīmēm</h4>
${F('p65-122.jpg', 'Ātras pusdienas dienasgrāmatas lapā: glāze — cilindrs, frī kartupeļi — kociņi, ēna noliek tos uz lapas, uzraksts — attēla daļa')}
<ul><li>Ēdiens atdziest un tiek apēsts — <b>ātrums</b> svarīgāks par precizitāti.</li>
<li>Meklē <b>atpazīstamās pazīmes</b>: garoziņa, caurspīdīga citrona šķēlīte, mērces spīdums, tvaiks.</li>
<li>Vispirms vienkāršas formas (krūze — cilindrs, grauzdiņš — klucītis), tad drupatas un tvaiks. Gaišs laukums — sulīgs dzeltenums, tumšs — kafija.</li></ul>
<h4>Recepte ir karte</h4>
<ul><li>Skaidri <b>stāvokļi</b>: neapstrādāts — samaisīts — izcepts.</li>
<li><b>Bultas, rāmji</b>, rokas un rīki rāda, kas notiek; viss liekais — prom.</li>
<li><b>Uzraksti</b> arī ir faktūra: virsraksts arhitektoniskiem lielajiem burtiem, sīkumi — ašā kursīvā, bet salasāmi.</li></ul>
<h4>Kompozīcija</h4>
${F('p68-127.jpg', 'Kompozīcijas shēmas: trešdaļu likums, zelta spirāle, diagonāle, piramīda, S līkne (kā ceļš), L forma')}
<p>Kompozīcija ir <b>vizuālā svara</b> sadalījums lapā. Galveno liec uz trešdaļas, nevis nedzīvā centrā. Izvēlies ar <b>skatu meklētāju</b> — rāmīti no pirkstiem vai izgrieztu kartīti. <b>Vadošās līnijas</b> (galda piederumi, galda mala, teksta rinda) ieved aci iekšā. Tumšākais blakus baltākajam ir <b>enkurs</b>, interešu centrs.</p>
<h4>Ritms</h4>
${F('p67-125.jpg', 'Ritma veidi: plūstošs, progresīvs, vienmērīgs, nejaušs')}
<ul><li>Ritms ir līniju, laukumu, faktūru <b>atkārtojums</b> — ar maziem “pārrāvumiem” izmērā vai slīpumā, lai nebūtu garlaicīgi.</li>
<li>Vienmērīgs, mainīgs, <b>progresīvs</b> (kafejnīcas galdiņi aiziet tālumā — sīkāki un gaišāki), <b>plūstošs</b> (tvaiks, zaļumi, saldējums).</li>
<li>Blīvām vietām vajag klusas. <b>Baltais ir klusums mūzikā</b>.</li></ul>`,
    simple: 'Ēdienu zīmē ātri, pēc pazīmēm: garoziņa, spīdums, tvaiks. Recepte ir stāvokļu karte ar bultām, rāmjiem un salasāmiem uzrakstiem. Galveno — uz trešdaļas, aci ved ar līnijām, enkurs — tumšākais blakus baltākajam. Ritms ir atkārtojums ar maziem pārrāvumiem; baltais — pauze.',
    mist: [['Ēdiens zīmēts lēni, katra drupata, kamēr tas atdziest.', 'Vispirms vienkāršas formas, tad garšīgā pazīmes — ātri.'],
      ['Recepte ar visiem sīkajiem soļiem un bez bultām.', 'Skaidri stāvokļi, bultas, rāmji; lieko — prom.'],
      ['Uzraksts iespiests pēdējā brīdī.', 'Plāno to kā attēla daļu: lielie burti virsrakstam, kursīvs piezīmēm.'],
      ['Galvenais nedzīvā centrā, viss ar vienādu svaru.', 'Noliec to uz trešdaļas un dod tam spēcīgāko kontrastu.'],
      ['Visa lapa piepildīta no malas līdz malai.', 'Atstāj balto — blīvām vietām vajag klusas.']],
    terms: [['Vizuālais svars', 'cik stipri lapas daļa pievelk aci'], ['Trešdaļu likums', 'svarīgo liek uz līnijām, kas dala lapu trešdaļās'], ['Skatu meklētājs', 'rāmītis no pirkstiem vai kartona kompozīcijas izvēlei'], ['Vadošās līnijas', 'līnijas, kas aizved aci līdz interešu centram'], ['Enkurs', 'tumšākais blakus baltākajam — interešu centrs'], ['Progresīvs ritms', 'atkārtojumi, kas tālumā kļūst sīkāki un gaišāki'], ['Plūstošs ritms', 'maigs viļņains atkārtojums kā tvaiks vai lapotne']],
    fact: 'Izteicienu “trešdaļu likums” pirmo reizi 1797. gadā iespieda angļu gleznotājs Džons Tomass Smits grāmatā “Piezīmes par lauku ainavu”. Viņš ieteica tā līdzsvarot gaišās un tumšās masas ainavā.',
    test: [['Kas ir svarīgākais, zīmējot ēdienu?', 'Ātrums un atpazīstamās pazīmes: garoziņa, spīdums, tvaiks', 'Katra drupata detalizēti', 'Kontūrs pēc lineāla', 'Ēdiens atdziest — ķer to, kas padara to garšīgu.'],
      ['Kas padara uzzīmētu recepti saprotamu?', 'Skaidri stāvokļi, bultas, rāmji, nekā lieka', 'Katrs sīkais solis', 'Daudz svītrojuma', 'Recepte ir karte — vajag maršrutu, nevis sablīvējumu.'],
      ['Kā izturēties pret uzrakstiem?', 'Kā pret attēla daļu: lielie burti virsrakstiem, salasāms kursīvs piezīmēm', 'Iespiest beigās', 'Izvairīties', 'Uzraksts arī ir faktūra lapā.'],
      ['Kur likt galveno priekšmetu?', 'Uz trešdaļas, nevis nedzīvā centrā', 'Tieši vidū', 'Stūrī, līdz pusei nogrieztu', 'Trešdaļas dod lapai spriegumu un līdzsvaru.'],
      ['Kas ir kompozīcijas “enkurs”?', 'Tumšākais blakus baltākajam', 'Lielākais priekšmets', 'Virsraksts', 'Spēcīgākais kontrasts noķer aci pirmais.'],
      ['Kas ir progresīvs ritms?', 'Atkārtojumi, kas tālumā kļūst sīkāki un gaišāki', 'Pilnīgi vienādi atkārtojumi', 'Nejauši punkti', 'Kā kafejnīcas galdiņi, kas aiziet prom no tevis.'],
      ['Kas skicē ir baltais?', 'Pauze — kā klusums mūzikā', 'Kļūda, kas jāaizpilda', 'Nepabeigts darbs', 'Blīvām vietām vajag klusas, lai elpotu.']],
    task: { h: 'Brokastis kā recepte', need: 'lainers, otas pildspalva vai ota ar atšķaidītu tušu, skiču burtnīcas atvērums, tavas brokastis', time: '40 min',
      steps: ['Ar skatu meklētāju izvēlies kompozīciju; galveno noliec uz trešdaļas.', 'Uzzīmē brokastis kā vizuālu faktu kopu: krūze — cilindrs, grauzdiņš — klucītis; vispirms gludi kontūri, tad drupatas un tvaiks.', 'Pievieno laukumus: gaišs — ola, sula; tumšs — kafija. Baltākais blakus tumšākajam — interešu centrā.', 'Blakus parādi procesu 3–4 kadros ar bultām un parakstiem: uzvārīt kafiju, uzvilkt čības vai ieskrūvēt spuldzi.', 'Uzraksti: virsraksts lielajiem burtiem, sastāvdaļas un laiks — ašā kursīvā. Atstāj balto.'] },
    client: { name: 'Barnabijs Burrows', job: 'āpsis maiznieks, kas runā ar savu ieraugu kā ar vecu draugu', say: 'Labrīt! Esmu kājās kopš četriem — ieraugs bija untumains. Klau, visi prasa manas maizes recepti, bet kārtīgi to pierakstīt es neprotu — tā man ir ķepās. Uzzīmēsi? Milti, ūdens, ieraugs, locīšana, gaidīšana, kraukšķīga garoziņa. Augšā — lieliem burtiem. Un noliec klaipu tur, kur skatās vispirms, — viņš te ir zvaigzne.',
      ask: ['Recepte 4–6 kadros ar bultām', 'Salasāms virsraksts un īsi paraksti', 'Gatavais klaips uz trešdaļas, ar spēcīgāko kontrastu', 'Baltais starp soļiem'] },
  },
};
