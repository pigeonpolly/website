// Курс туши, урок 9 — «Текстуры» (книга «Ink Sketching», с. 50–53). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '▦', card: 'halloween-2025/48.jpg', cover: 'p51-90.jpg',
  en: {
    name: 'Textures',
    intro: 'Metal, wood, brick, paper — the brain recognises them by a tiny code of marks. Learn the code, and a few strokes will say “cold steel” or “old bark”. Then we break the rules on purpose and swap textures between things.',
    goals: ['draw the texture codes of metal, wood, bark, brick, upholstery and paper', 'put texture only where light meets shadow', 'swap textures between objects and keep them readable'],
    th: `<p>A texture is a <b>code</b> the brain recognises. You don’t have to draw every grain: a few right marks at the right place — and the eye finishes the rest. The right place is almost always the <b>border of light and shadow</b>; in full light and deep shadow texture disappears.</p>
<h4>Metal — a mirror</h4>
${F('p50-86.jpg', 'A metal plate: sparse straight hatching, rivets with a highlight and a dark side')}
<ul><li>No soft gradients: <b>black right next to white</b>.</li>
<li>On cylinders — long vertical highlights; a thin white reflection by the dark edge.</li>
<li>Rivets and screws are the “spices”: a dot of white, a crescent of black.</li></ul>
<h4>Wood and bark</h4>
${F('p51-90.jpg', 'Wood: a stretched uneven knot, and the grain flows around it like water around a stone')}
<ul><li>Wood: a stretched, uneven oval knot, grain lines around it; broken lines with different pressure; small cross-nicks, dots in the cracks; chips on the corners.</li>
<li>Bark: stretched diamonds, dark furrows, light “islands” — and only along the shadow side.</li></ul>
${F('p51-92.jpg', 'Bark: dark furrows between light islands')}
<h4>Brick — the rule of three</h4>
${F('p51-94.jpg', 'Bricks only in 2–3 places — the eye builds the whole wall itself')}
<p>Don’t draw the whole wall. Pick <b>2–3 places</b>: corners, around windows, at the shadow border. Draw an L-shaped shadow under a brick, not a closed rectangle.</p>
<h4>Upholstery and paper</h4>
${F('p52-96.jpg', 'Button tufting: a shiny button with a shadow, folds radiating out')}
<ul><li>Tufting: a shiny button with a highlight and a shadow under it, folds as rays in searching lines, the cushions between stay white.</li>
<li>Paper: a thin shadow under the edge; a stack — parallel lines; folds — sharp; white against hatching; old paper — a “nervous” contour and dots on the edge; a curled corner — a shadow under it.</li></ul>
${F('p52-100.jpg', 'Crumpled paper: sharp folds, hatching only on the faces turned away from the light')}
<h4>Swap the textures</h4>
<p>The best way to learn a code is to put it on the wrong object. A wooden cactus with nails for spines, a glass ball of yarn, a stone shoe — if it still reads, you’ve got the code.</p>
${F('p53-102.jpg', 'A cactus made of wood — with nails instead of spines')}`,
    simple: 'Texture is a code: a few right marks at the border of light and shadow, not everywhere. Metal — black next to white; wood — a knot and flowing grain; bark — furrows and islands; brick — only 2–3 places; tufting — button, shadow, ray folds; paper — sharp folds and a thin shadow under the edge.',
    mist: [['Texture all over the object.', 'Put it at the light–shadow border; in full light and deep shadow let it fade.'],
      ['Every brick in the wall drawn and closed.', 'Rule of three: 2–3 places, L-shaped shadows.'],
      ['Soft grey gradients on metal.', 'Metal is a mirror: black right next to white.'],
      ['Wood grain as straight parallel lines.', 'Let the grain flow around knots, broken and with different pressure.']],
    terms: [['Texture', 'how a surface feels, shown by a code of marks'], ['Knot', 'a stretched oval in wood that the grain flows around'], ['Rule of three', 'show a repeated texture in only 2–3 places'], ['Tufting (capitonné)', 'upholstery pulled in by buttons with folds radiating out'], ['Reflection', 'a thin light line by the dark edge of a shiny object'], ['Texture swap', 'giving an object the material of another']],
    fact: 'Surrealist Meret Oppenheim covered a teacup, saucer and spoon with gazelle fur in 1936. The “Fur Breakfast Cup” is now in the Museum of Modern Art in New York — a famous texture swap.',
    test: [['Where should texture go?', 'At the border of light and shadow', 'All over the object, evenly', 'Only in the deepest shadow', 'In full light and deep shadow texture disappears.'],
      ['How do you show metal?', 'Black right next to white, no soft gradients', 'Soft dots and pale grey', 'Fur-like short strokes', 'Metal reflects like a mirror — hard contrasts.'],
      ['How does wood grain behave around a knot?', 'It flows around it like water around a stone', 'It goes straight through', 'It stops', 'A stretched knot with flowing grain says “wood”.'],
      ['What is the rule of three for brick?', 'Draw bricks in only 2–3 places', 'Draw every third brick', 'Use three colours', 'The eye builds the rest of the wall itself.'],
      ['What shadow goes under a brick?', 'An L-shaped one, not a closed rectangle', 'A full black outline', 'None', 'An open L gives depth and air.'],
      ['How do you draw tufted upholstery?', 'A shiny button with a shadow, folds as rays, cushions white', 'A grid of squares', 'Solid black', 'The buttons and folds carry the whole texture.'],
      ['Why swap textures between objects?', 'To check that you really know the code', 'Because it is quicker', 'To hide mistakes', 'If a glass ball of yarn still reads — the code works.']],
    task: { h: 'Texture swap', need: 'a liner or brush pen, a sketchbook page', time: '30 min',
      steps: ['Pick a pair: a glass ball of yarn and a woollen wine glass; a glass cactus and a fur bottle; a wooden ball and a rubber log; a metal banana and a soft steel spoon; a stone shoe and a leather boulder; a concrete pillow and a feather foundation.', 'Draw both objects with simple shapes, one light source.', 'Give each the texture of the other — only at the light–shadow border.', 'Leave the light side white.', 'Ask someone (or yourself tomorrow): what is each object made of?'] },
    client: { name: 'Baron von Worms', job: 'an aristocrat from the lower layers of soil, owner of a luxurious compost estate', say: 'My dear, I am preparing a garden party, and my estate must look… textured. The old wooden gate, the brick wall, the bark of the oak, the iron bench. And a portrait of myself in the leather armchair with buttons. Every surface, darling, must be recognisable — but tastefully, not everywhere at once.',
      ask: ['At least three textures: wood, bark, brick, metal or tufting', 'Texture only at the border of light and shadow', 'Bricks by the rule of three'] },
  },
  ru: {
    name: 'Текстуры',
    intro: 'Металл, дерево, кирпич, бумага — мозг узнаёт их по крошечному коду штрихов. Выучи код — и пара линий скажет «холодная сталь» или «старая кора». А потом нарочно нарушим правила и поменяем предметы фактурами.',
    goals: ['рисовать коды фактур: металл, дерево, кора, кирпич, капитоне, бумага', 'класть фактуру только на границе света и тени', 'менять предметы фактурами так, чтобы они читались'],
    th: `<p>Фактура — это <b>код</b>, который мозг узнаёт. Не нужно рисовать каждое волокно: несколько верных штрихов в верном месте — и глаз дорисует остальное. Верное место почти всегда — <b>граница света и тени</b>; на полном свету и в глубокой тени фактура исчезает.</p>
<h4>Металл — зеркало</h4>
${F('p50-86.jpg', 'Металлическая пластина: редкая прямая штриховка, заклёпки с бликом и тёмным боком')}
<ul><li>Никаких мягких градиентов: <b>чёрное прямо рядом с белым</b>.</li>
<li>На цилиндрах — длинные вертикальные блики; тонкий белый рефлекс у тёмного края.</li>
<li>Заклёпки и винты — «специи»: точка белого, полумесяц чёрного.</li></ul>
<h4>Дерево и кора</h4>
${F('p51-90.jpg', 'Дерево: вытянутый неровный сучок, и волокна обтекают его, как вода камень')}
<ul><li>Дерево: вытянутый неровный овал-сучок, волокна вокруг него; прерывистые линии с разным нажимом; поперечные засечки, точки в трещинах; сколы на углах.</li>
<li>Кора: вытянутые ромбы, тёмные борозды, светлые «островки» — и только на теневой стороне.</li></ul>
${F('p51-92.jpg', 'Кора: тёмные борозды между светлыми островками')}
<h4>Кирпич — правило трёх</h4>
${F('p51-94.jpg', 'Кирпичи только в 2–3 местах — стену целиком глаз достроит сам')}
<p>Не рисуй всю стену. Выбери <b>2–3 места</b>: углы, около окон, на границе тени. Под кирпичом — L-образная тень, а не замкнутый прямоугольник.</p>
<h4>Капитоне и бумага</h4>
${F('p52-96.jpg', 'Капитоне: блестящая пуговица с тенью, складки лучами')}
<ul><li>Капитоне: блестящая пуговица с бликом и тенью под ней, складки-лучи ищущими линиями, подушки между ними — белые.</li>
<li>Бумага: тонкая тень под краем; стопка — параллельные линии; сгибы — острые; белое против штриховки; старая — «нервный» контур и точки по краю; загнутый уголок — тень под ним.</li></ul>
${F('p52-100.jpg', 'Мятая бумага: острые сгибы, штриховка только на гранях, отвёрнутых от света')}
<h4>Поменяй фактуры</h4>
<p>Лучший способ выучить код — надеть его на чужой предмет. Деревянный кактус с гвоздями вместо колючек, стеклянный клубок, каменная туфля — если всё ещё читается, код пойман.</p>
${F('p53-102.jpg', 'Кактус из дерева — с гвоздями вместо колючек')}`,
    simple: 'Фактура — это код: несколько верных штрихов на границе света и тени, а не везде. Металл — чёрное рядом с белым; дерево — сучок и текущие волокна; кора — борозды и островки; кирпич — только 2–3 места; капитоне — пуговица, тень, складки-лучи; бумага — острые сгибы и тонкая тень под краем.',
    mist: [['Фактура по всему предмету.', 'Клади её на границу света и тени; на свету и в глубокой тени пусть растворяется.'],
      ['Каждый кирпич в стене нарисован и замкнут.', 'Правило трёх: 2–3 места, L-образные тени.'],
      ['Мягкие серые переходы на металле.', 'Металл — зеркало: чёрное прямо рядом с белым.'],
      ['Волокна дерева — прямые параллельные линии.', 'Пусть волокна обтекают сучки, прерывисто и с разным нажимом.']],
    terms: [['Фактура', 'какова поверхность на ощупь, показанная кодом штрихов'], ['Сучок', 'вытянутый овал в дереве, который обтекают волокна'], ['Правило трёх', 'повторяющуюся фактуру показывать только в 2–3 местах'], ['Капитоне', 'обивка, стянутая пуговицами, со складками-лучами'], ['Рефлекс', 'тонкая светлая линия у тёмного края блестящего предмета'], ['Обмен фактур', 'дать предмету материал другого']],
    fact: 'Сюрреалистка Мерет Оппенгейм в 1936 году обтянула чашку, блюдце и ложку мехом газели. «Меховой завтрак» теперь в Музее современного искусства в Нью-Йорке — знаменитый обмен фактур.',
    test: [['Где должна быть фактура?', 'На границе света и тени', 'По всему предмету равномерно', 'Только в самой глубокой тени', 'На полном свету и в глубокой тени фактура исчезает.'],
      ['Как показать металл?', 'Чёрное прямо рядом с белым, без мягких переходов', 'Мягкие точки и светло-серое', 'Короткие штрихи, как мех', 'Металл отражает, как зеркало, — жёсткие контрасты.'],
      ['Как ведут себя волокна дерева у сучка?', 'Обтекают его, как вода камень', 'Идут прямо сквозь него', 'Обрываются', 'Вытянутый сучок с текущими волокнами говорит «дерево».'],
      ['Что такое правило трёх для кирпича?', 'Рисовать кирпичи только в 2–3 местах', 'Рисовать каждый третий кирпич', 'Взять три цвета', 'Остальную стену глаз достроит сам.'],
      ['Какая тень под кирпичом?', 'L-образная, а не замкнутый прямоугольник', 'Полный чёрный контур', 'Никакой', 'Открытая «L» даёт глубину и воздух.'],
      ['Как рисовать капитоне?', 'Блестящая пуговица с тенью, складки лучами, подушки белые', 'Сетка квадратов', 'Сплошное чёрное', 'Пуговицы и складки несут всю фактуру.'],
      ['Зачем менять предметы фактурами?', 'Чтобы проверить, что код правда выучен', 'Потому что быстрее', 'Чтобы спрятать ошибки', 'Если стеклянный клубок читается — код работает.']],
    task: { h: 'Обмен фактурами', need: 'линер или брашпен, страница скетчбука', time: '30 мин',
      steps: ['Выбери пару: стеклянный клубок и шерстяной бокал; стеклянный кактус и меховая бутылка; деревянный шарик и резиновое бревно; металлический банан и мягкая стальная ложка; каменная туфля и кожаный валун; бетонная подушка и перьевой фундамент.', 'Нарисуй оба предмета простыми формами, один источник света.', 'Дай каждому фактуру другого — только на границе света и тени.', 'Освещённую сторону оставь белой.', 'Спроси кого-нибудь (или себя завтра): из чего сделан каждый предмет?'] },
    client: { name: 'Барон фон Червинс', job: 'аристократ из нижних слоёв почвы, владелец роскошного компостного поместья', say: 'Дорогуша, я готовлю приём в саду, и поместье должно выглядеть… фактурно. Старая деревянная калитка, кирпичная стена, кора дуба, чугунная скамья. И мой портрет в кожаном кресле с пуговицами. Каждая поверхность, душенька, должна узнаваться — но со вкусом, не везде сразу.',
      ask: ['Минимум три фактуры: дерево, кора, кирпич, металл или капитоне', 'Фактура только на границе света и тени', 'Кирпичи по правилу трёх'] },
  },
  lv: {
    name: 'Tekstūras',
    intro: 'Metāls, koks, ķieģelis, papīrs — smadzenes tos atpazīst pēc sīka svītriņu koda. Iemācies kodu — un pāris līniju pateiks “auksts tērauds” vai “veca miza”. Bet pēc tam ar nodomu pārkāpsim noteikumus un samainīsim priekšmetiem faktūras.',
    goals: ['zīmēt faktūru kodus: metāls, koks, miza, ķieģelis, kapitone, papīrs', 'likt faktūru tikai uz gaismas un ēnas robežas', 'samainīt priekšmetiem faktūras tā, lai tie nolasītos'],
    th: `<p>Faktūra ir <b>kods</b>, ko smadzenes atpazīst. Nav jāzīmē katra šķiedra: dažas pareizas svītras pareizajā vietā — un acs pabeigs pārējo. Pareizā vieta gandrīz vienmēr ir <b>gaismas un ēnas robeža</b>; pilnā gaismā un dziļā ēnā faktūra pazūd.</p>
<h4>Metāls — spogulis</h4>
${F('p50-86.jpg', 'Metāla plāksne: rets taisns svītrojums, kniedes ar atspīdumu un tumšu sānu')}
<ul><li>Nekādu maigu pāreju: <b>melns tieši blakus baltajam</b>.</li>
<li>Uz cilindriem — gari vertikāli atspīdumi; plāns balts reflekss pie tumšās malas.</li>
<li>Kniedes un skrūves ir “garšvielas”: balts punkts, melns pusmēness.</li></ul>
<h4>Koks un miza</h4>
${F('p51-90.jpg', 'Koks: izstiepts nelīdzens zars, un šķiedras to applūst kā ūdens akmeni')}
<ul><li>Koks: izstiepts nelīdzens ovāls zars, šķiedras ap to; pārtrauktas līnijas ar dažādu spiedienu; šķērseniski iegriezumi, punkti plaisās; atšķēlumi uz stūriem.</li>
<li>Miza: izstiepti rombi, tumšas vagas, gaišas “saliņas” — un tikai ēnas pusē.</li></ul>
${F('p51-92.jpg', 'Miza: tumšas vagas starp gaišām saliņām')}
<h4>Ķieģelis — trīs vietu likums</h4>
${F('p51-94.jpg', 'Ķieģeļi tikai 2–3 vietās — visu sienu acs uzbūvēs pati')}
<p>Nezīmē visu sienu. Izvēlies <b>2–3 vietas</b>: stūrus, pie logiem, uz ēnas robežas. Zem ķieģeļa — L veida ēna, nevis noslēgts taisnstūris.</p>
<h4>Kapitone un papīrs</h4>
${F('p52-96.jpg', 'Kapitone: spīdīga poga ar ēnu, krokas kā stari')}
<ul><li>Kapitone: spīdīga poga ar atspīdumu un ēnu zem tās, krokas-stari ar meklējošām līnijām, spilventiņi starp tām — balti.</li>
<li>Papīrs: plāna ēna zem malas; kaudze — paralēlas līnijas; locījumi — asi; baltais pret svītrojumu; vecs — “nervozs” kontūrs un punkti gar malu; atliekts stūrītis — ēna zem tā.</li></ul>
${F('p52-100.jpg', 'Saburzīts papīrs: asi locījumi, svītrojums tikai uz skaldnēm, kas pagrieztas prom no gaismas')}
<h4>Samaini faktūras</h4>
<p>Labākais veids, kā iemācīties kodu, — uzvilkt to svešam priekšmetam. Koka kaktuss ar naglām adatu vietā, stikla dziju kamols, akmens kurpe — ja vēl nolasās, kods noķerts.</p>
${F('p53-102.jpg', 'Kaktuss no koka — ar naglām adatu vietā')}`,
    simple: 'Faktūra ir kods: dažas pareizas svītras uz gaismas un ēnas robežas, nevis visur. Metāls — melns blakus baltajam; koks — zars un plūstošas šķiedras; miza — vagas un saliņas; ķieģelis — tikai 2–3 vietas; kapitone — poga, ēna, krokas-stari; papīrs — asi locījumi un plāna ēna zem malas.',
    mist: [['Faktūra pa visu priekšmetu.', 'Liec to uz gaismas un ēnas robežas; gaismā un dziļā ēnā lai izzūd.'],
      ['Katrs sienas ķieģelis uzzīmēts un noslēgts.', 'Trīs vietu likums: 2–3 vietas, L veida ēnas.'],
      ['Maigas pelēkas pārejas uz metāla.', 'Metāls ir spogulis: melns tieši blakus baltajam.'],
      ['Koka šķiedras kā taisnas paralēlas līnijas.', 'Lai šķiedras applūst zarus, pārtraukti un ar dažādu spiedienu.']],
    terms: [['Faktūra', 'kāda virsma ir taustei, parādīta ar svītru kodu'], ['Zars (kokā)', 'izstiepts ovāls kokā, ko applūst šķiedras'], ['Trīs vietu likums', 'atkārtotu faktūru rādīt tikai 2–3 vietās'], ['Kapitone', 'polsterējums, savilkts ar pogām, ar krokām-stariem'], ['Reflekss', 'plāna gaiša līnija pie spīdīga priekšmeta tumšās malas'], ['Faktūru maiņa', 'dot priekšmetam cita materiālu']],
    fact: 'Sirreāliste Mereta Openheima 1936. gadā aptina tasi, apakštasīti un karoti ar gazeles kažokādu. “Kažokādas brokastis” tagad atrodas Ņujorkas Modernās mākslas muzejā — slavena faktūru maiņa.',
    test: [['Kur jābūt faktūrai?', 'Uz gaismas un ēnas robežas', 'Pa visu priekšmetu vienmērīgi', 'Tikai dziļākajā ēnā', 'Pilnā gaismā un dziļā ēnā faktūra pazūd.'],
      ['Kā parādīt metālu?', 'Melns tieši blakus baltajam, bez maigām pārejām', 'Maigi punkti un gaiši pelēks', 'Īsas svītras kā kažoks', 'Metāls atstaro kā spogulis — cieti kontrasti.'],
      ['Kā uzvedas koka šķiedras pie zara?', 'Applūst to kā ūdens akmeni', 'Iet taisni tam cauri', 'Pārtrūkst', 'Izstiepts zars ar plūstošām šķiedrām saka “koks”.'],
      ['Kas ir trīs vietu likums ķieģelim?', 'Zīmēt ķieģeļus tikai 2–3 vietās', 'Zīmēt katru trešo ķieģeli', 'Ņemt trīs krāsas', 'Pārējo sienu acs uzbūvēs pati.'],
      ['Kāda ēna ir zem ķieģeļa?', 'L veida, nevis noslēgts taisnstūris', 'Pilns melns kontūrs', 'Nekāda', 'Atvērts “L” dod dziļumu un gaisu.'],
      ['Kā zīmēt kapitoni?', 'Spīdīga poga ar ēnu, krokas kā stari, spilventiņi balti', 'Kvadrātu režģis', 'Vienlaidus melns', 'Pogas un krokas nes visu faktūru.'],
      ['Kāpēc priekšmetiem samainīt faktūras?', 'Lai pārbaudītu, ka kods tiešām iemācīts', 'Jo tā ātrāk', 'Lai noslēptu kļūdas', 'Ja stikla kamols nolasās — kods strādā.']],
    task: { h: 'Faktūru maiņa', need: 'lainers vai otas pildspalva, skiču burtnīcas lapa', time: '30 min',
      steps: ['Izvēlies pāri: stikla dziju kamols un vilnas vīna glāze; stikla kaktuss un kažokādas pudele; koka bumbiņa un gumijas baļķis; metāla banāns un mīksta tērauda karote; akmens kurpe un ādas laukakmens; betona spilvens un spalvu pamati.', 'Uzzīmē abus priekšmetus ar vienkāršām formām, viens gaismas avots.', 'Dod katram otra faktūru — tikai uz gaismas un ēnas robežas.', 'Apgaismoto pusi atstāj baltu.', 'Pajautā kādam (vai sev rīt): no kā taisīts katrs priekšmets?'] },
    client: { name: 'Barons fon Slieka', job: 'aristokrāts no augsnes apakšējiem slāņiem, grezna komposta muižas īpašnieks', say: 'Dārgā dvēsele, es gatavoju dārza pieņemšanu, un muižai jāizskatās… faktūrīgi. Vecie koka vārtiņi, ķieģeļu siena, ozola miza, čuguna sols. Un mans portrets ādas krēslā ar pogām. Katrai virsmai, mīļumiņ, jābūt atpazīstamai — bet gaumīgi, ne visur uzreiz.',
      ask: ['Vismaz trīs faktūras: koks, miza, ķieģelis, metāls vai kapitone', 'Faktūra tikai uz gaismas un ēnas robežas', 'Ķieģeļi pēc trīs vietu likuma'] },
  },
};
