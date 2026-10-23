// Общие данные «Зельеварни Полли» (подключаются на всех страницах — нужны и игре, и подаркам в профиле):
// ингредиенты четырёх сезонов, имена и свойства зелий (по номеру рецепта — без повторов), бутылочки. Порядок ингредиентов — как SEASON_ING в worker/index.js.
(() => {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const L2 = L === 1 ? 1 : 0; // имена зелий и свойства — по-русски или по-английски (латышской версии у генератора нет)
  // ---------- ингредиенты (тот же порядок, что ING в worker/index.js) ----------
  const AUTUMN = [
    ['amanita', '🍄', 'Fly agaric', 'Мухомор', 'Mušmire'], ['pumpkin', '🎃', 'Pumpkin', 'Тыква', 'Ķirbis'], ['web', '🕸️', 'Spider web', 'Паутинка', 'Zirnekļtīkls'],
    ['bat', '🦇', 'Bat wing', 'Крыло летучей мыши', 'Sikspārņa spārns'], ['eye', '👁️', 'Newt eye', 'Глаз тритона', 'Tritona acs'], ['mandrake', '🌿', 'Mandrake root', 'Корень мандрагоры', 'Mandragoras sakne'],
    ['moon', '🌙', 'Moon dust', 'Лунная пыль', 'Mēness putekļi'], ['feather', '🪶', 'Owl feather', 'Совиное перо', 'Pūces spalva'], ['bone', '🦴', 'Old bone', 'Старая косточка', 'Vecs kauliņš'],
    ['candle', '🕯️', 'Candle stub', 'Огарок свечи', 'Sveces galiņš'], ['garlic', '🧄', 'Garlic', 'Чеснок', 'Ķiploks'], ['pepper', '🌶️', 'Dragon pepper', 'Драконий перчик', 'Pūķa pipars'],
    ['frog', '🐸', 'Frog spawn', 'Лягушачья икра', 'Vardes kurkuļi'], ['clover', '🍀', 'Four-leaf clover', 'Четырёхлистный клевер', 'Četrlapu āboliņš'], ['star', '⭐', 'Star dust', 'Звёздная пыль', 'Zvaigžņu putekļi'],
    ['apple', '🍎', 'Candy apple', 'Яблоко в карамели', 'Karameles ābols'], ['candy', '🍬', 'Sweetie', 'Конфета', 'Konfekte'], ['choco', '🍫', 'Chocolate', 'Шоколадка', 'Šokolāde'],
    ['milk', '🥛', 'Warm milk', 'Тёплое молоко', 'Silts piens'], ['honey', '🍯', 'Honey', 'Мёд', 'Medus'], ['cookie', '🍪', 'Grandma’s cookie', 'Бабушкино печенье', 'Vecmāmiņas cepums'],
  ];
  const WINTER = [
    ['snow', '❄️', 'Snowflake', 'Снежинка', 'Sniegpārsliņa'], ['icicle', '🧊', 'Icicle', 'Сосулька', 'Lāsteka'], ['pine', '🌲', 'Fir twig', 'Еловая веточка', 'Egles zariņš'],
    ['mitten', '🧤', 'Lost mitten', 'Потерянная варежка', 'Pazaudēts dūrainis'], ['bell', '🔔', 'Sleigh bell', 'Бубенчик', 'Kamanu zvaniņš'], ['scarf', '🧣', 'Scarf thread', 'Ниточка от шарфа', 'Šalles diegs'],
    ['snowman', '☃️', 'Snowman’s nose', 'Нос снеговика', 'Sniegavīra deguns'], ['tea', '🍵', 'Herbal tea', 'Травяной чай', 'Zāļu tēja'], ['salt', '🧂', 'Pinch of salt', 'Щепотка соли', 'Šķipsna sāls'],
    ['log', '🪵', 'Fireplace log', 'Полено из камина', 'Kamīna pagale'], ['tree', '🎄', 'Tree needle', 'Ёлочная иголка', 'Eglītes skuja'], ['ribbon', '🎁', 'Gift ribbon', 'Ленточка от подарка', 'Dāvanas lente'],
    ['deer', '🦌', 'Reindeer horn', 'Олений рожок', 'Ziemeļbrieža rags'], ['owlw', '🦉', 'Owl down', 'Совиный пух', 'Pūces pūkas'], ['comet', '☄️', 'Comet tail', 'Хвост кометы', 'Komētas aste'],
    ['tangerine', '🍊', 'Tangerine', 'Мандарин', 'Mandarīns'], ['cupcake', '🧁', 'Cupcake', 'Кекс', 'Kēksiņš'], ['hotcoco', '☕', 'Cocoa with marshmallows', 'Какао с зефирками', 'Kakao ar zefīriem'],
    ['lolly', '🍭', 'Lollipop', 'Леденец', 'Konfekte uz kociņa'], ['pie', '🥧', 'Warm pie', 'Тёплый пирог', 'Silts pīrāgs'], ['cake', '🎂', 'Holiday cake', 'Праздничный торт', 'Svētku torte'],
  ];
  const SPRING = [
    ['tulip', '🌷', 'Tulip', 'Тюльпан', 'Tulpe'], ['daisy', '🌼', 'Daisy', 'Ромашка', 'Margrietiņa'], ['sakura', '🌸', 'Cherry petal', 'Лепесток сакуры', 'Sakuras ziedlapiņa'],
    ['sprout', '🌱', 'Sprout', 'Росток', 'Asns'], ['butterfly', '🦋', 'Butterfly dust', 'Пыльца бабочки', 'Tauriņa putekšņi'], ['ladybug', '🐞', 'Ladybird spot', 'Пятнышко божьей коровки', 'Mārītes punktiņš'],
    ['rainbow', '🌈', 'Piece of rainbow', 'Кусочек радуги', 'Varavīksnes gabaliņš'], ['drop', '💧', 'Raindrop', 'Капля дождя', 'Lietus lāse'], ['bee', '🐝', 'Bee buzz', 'Пчелиное жужжание', 'Bites dūkoņa'],
    ['snail', '🐌', 'Snail trail', 'Улиточья дорожка', 'Gliemeža taka'], ['egg', '🥚', 'Painted egg', 'Крашеное яйцо', 'Krāsota ola'], ['nest', '🪺', 'Nest twig', 'Веточка из гнезда', 'Ligzdas zariņš'],
    ['worm', '🪱', 'Polite worm', 'Вежливый червячок', 'Pieklājīgs tārpiņš'], ['kite', '🪁', 'Kite string', 'Нитка воздушного змея', 'Pūķa aukla'], ['cloud', '☁️', 'Little cloud', 'Облачко', 'Mākonītis'],
    ['strawberry', '🍓', 'Strawberry', 'Клубника', 'Zemene'], ['cherry', '🍒', 'Cherries', 'Вишенки', 'Ķirši'], ['pancake', '🥞', 'Pancakes', 'Блинчики', 'Pankūkas'],
    ['waffle', '🧇', 'Waffle', 'Вафля', 'Vafele'], ['pudding', '🍮', 'Pudding', 'Пудинг', 'Pudiņš'], ['croissant', '🥐', 'Croissant', 'Круассан', 'Kruasāns'],
  ];
  const SUMMER = [
    ['sun', '☀️', 'Sunbeam', 'Солнечный зайчик', 'Saules zaķītis'], ['shell', '🐚', 'Seashell', 'Ракушка', 'Gliemežvāks'], ['wave', '🌊', 'Sea foam', 'Морская пена', 'Jūras putas'],
    ['crab', '🦀', 'Crab claw', 'Клешня краба', 'Krabja spīle'], ['palm', '🌴', 'Palm leaf', 'Пальмовый лист', 'Palmas lapa'], ['cactus', '🌵', 'Cactus spine', 'Колючка кактуса', 'Kaktusa ērkšķis'],
    ['sunflower', '🌻', 'Sunflower seed', 'Семечко подсолнуха', 'Saulgriezes sēkla'], ['fish', '🐟', 'Fish scale', 'Рыбья чешуйка', 'Zivs zvīņa'], ['coral', '🪸', 'Coral', 'Коралл', 'Korallis'],
    ['sand', '⏳', 'Hourglass sand', 'Песок из часов', 'Smilšu pulksteņa smiltis'], ['compass', '🧭', 'Compass needle', 'Стрелка компаса', 'Kompasa adata'], ['strawhat', '👒', 'Straw hat', 'Соломенная шляпка', 'Salmu cepure'],
    ['shades', '🕶️', 'Sunglasses', 'Тёмные очки', 'Saulesbrilles'], ['spark', '🔥', 'Campfire spark', 'Искра костра', 'Ugunskura dzirkstele'], ['dolphin', '🐬', 'Dolphin whistle', 'Свист дельфина', 'Delfīna svilpiens'],
    ['watermelon', '🍉', 'Watermelon', 'Арбуз', 'Arbūzs'], ['icecream', '🍦', 'Ice cream', 'Мороженое', 'Saldējums'], ['peach', '🍑', 'Peach', 'Персик', 'Persiks'],
    ['lemonade', '🍋', 'Lemonade', 'Лимонад', 'Limonāde'], ['sherbet', '🍧', 'Sherbet', 'Шербет', 'Šerbets'], ['pineapple', '🍍', 'Pineapple', 'Ананас', 'Ananass'],
  ];
  const SEASONS = { autumn: AUTUMN, winter: WINTER, spring: SPRING, summer: SUMMER };
  // сезон: название, значок и цвета лабиринта (пол, стены, фон)
  const SEASON_INFO = {
    autumn: { n: ['Autumn · Halloween', 'Осень · Хеллоуин', 'Rudens · Helovīns'], e: '🎃', bg: '#1E1530', f1: '#2A2046', f2: '#2E2350', wall: '#9C8FD0' },
    winter: { n: ['Winter · New Year', 'Зима · Новый год', 'Ziema · Jaungads'], e: '❄️', bg: '#14233A', f1: '#1C3150', f2: '#203757', wall: '#BFE0FF' },
    spring: { n: ['Spring', 'Весна', 'Pavasaris'], e: '🌷', bg: '#1C2E22', f1: '#24402D', f2: '#284632', wall: '#F2A9C8' },
    summer: { n: ['Summer', 'Лето', 'Vasara'], e: '☀️', bg: '#2A2414', f1: '#3B3218', f2: '#41381C', wall: '#F6CF6A' },
  };
  const ING = Object.entries(SEASONS).flatMap(([s, list]) => list.map(r => [...r, s]));
  const IG = Object.fromEntries(ING.map(r => [r[0], { id: r[0], e: r[1], n: [r[2], r[3], r[4]][L], s: r[5] }]));
  // ---------- эмодзи новее 2020 года (🪶 совиное перо и др.) рисуются не на всех устройствах (старые Windows/Android — пустой квадрат): там — своя пиксельная картинка (этап 28) ----------
  // IG[id].h — для HTML (эмодзи или <img>), IG[id].t — для текста тостов (эмодзи или название), emoImg(e) — картинка для canvas (или null)
  const PIX = {
    '🪶': ['..........oooo..........oowwlwo........owlbllbo.......owlbllblo......owlbllblo......owllbllbo......owlbllblo.......owbllblo.......owlbllbo........owllbwo.........olbwoo..........owwo...........oqoo............qo.............q...............................', { o: '#4A3826', w: '#F4E6CF', l: '#C9A27A', b: '#7A5236', q: '#6B4E3A' }],
    '🪵': ['..................................................................ooooooooooo....obbdbbbbbdbooo.obbbbbdbbbbortroobdbbbbbbdboryroobbbbdbbbbbortroobbdbbbbdbbortro.obbbbbdbbbbooo...ooooooooooo...................................................................', { o: '#3E2A1C', b: '#8B5A3C', d: '#6B4329', r: '#D9A45B', t: '#B98236', y: '#F0C987' }],
    '🪱': ['...........................................................oo.............oppo...........opkpko..........opppo....oo....oppdo....oppo..oppdo....oppdpooppdo.....opdoppppdo.......oo.opppo.............o.........................................................', { o: '#7A3B4A', p: '#F28AB2', d: '#D96C93', k: '#2B2340' }],
    '🪺': ['.....................................................................oo..oo.........ocwoocwo........owwoowwo......oooooooooooo...obdbbdbbdbbdbo.obbbdbbdbbdbbbbo.obdbbdbbdbbdbo...obbbbdbbbbbo.....oooooooooo...................................................', { o: '#4E3424', b: '#A87A4E', d: '#7A5236', c: '#BFE3F5', w: '#E8F4FA' }],
    '🪁': ['........o..............oro............orryo..........orrryyo........orrrryyyo......ooooooooooo......obbbbgggo........obbbggo..........obbgo............oo...............o..............o................o................o..............o.......................', { o: '#2B2340', r: '#E5484D', y: '#F6D04D', b: '#4A7BD8', g: '#4CC38A' }],
    '🪸': ['..................o.....o....o...opo...opo..opo..opo.o.opo.opo....opoopopo.opo....oppopppoopo......oppppppppo.......oppppppo.........oppppo...........oppo............oppo..........oooooooo.......osssssssso...................................................', { o: '#8C2F3A', p: '#F08A8A', s: '#E9C46A' }],
  };
  const emoOk = e => { try { const c = document.createElement('canvas'); c.width = c.height = 24; const x = c.getContext('2d', { willReadFrequently: true }); x.font = '20px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textBaseline = 'top'; x.fillText(e, 0, 0);
    const d = x.getImageData(0, 0, 24, 24).data; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 40 && (Math.abs(d[i] - d[i + 1]) > 24 || Math.abs(d[i + 1] - d[i + 2]) > 24)) return true; return false; } catch (err) { return true; } }; // цветные точки — эмодзи есть; серый квадрат — нет
  const FALL = {};
  Object.entries(PIX).forEach(([e, [rows, pal]]) => { if (emoOk(e)) return; const c = document.createElement('canvas'); c.width = c.height = 16; const x = c.getContext('2d');
    [...rows].forEach((ch, i) => { if (pal[ch]) { x.fillStyle = pal[ch]; x.fillRect(i % 16, Math.floor(i / 16), 1, 1); } }); const src = c.toDataURL(), im = new Image(); im.src = src; FALL[e] = { src, im }; });
  const emoImg = e => FALL[e] ? FALL[e].im : null;
  Object.values(IG).forEach(g => { const f = FALL[g.e]; g.h = f ? `<img class="pp-emo" src="${f.src}" alt="${g.n.replace(/"/g, '&quot;')}">` : g.e; g.t = f ? g.n : g.e; });
  const SWEET = new Set(Object.values(SEASONS).flatMap(list => list.slice(15).map(r => r[0]))); // в каждом сезоне последние 6 — сладкие

  // ---------- имена и свойства зелий: номер рецепта (0…1770) → своё имя, у разных рецептов имена не совпадают ----------
  const ADJ = [['Fizzy', 'Шипучее'], ['Grumpy', 'Ворчливое'], ['Sticky', 'Липкое'], ['Hiccupping', 'Икающее'], ['Sleepy', 'Сонное'], ['Bubbly', 'Пузырчатое'], ['Crunchy', 'Хрустящее'],
    ['Suspicious', 'Подозрительное'], ['Squeaky', 'Скрипучее'], ['Purring', 'Мурлыкающее'], ['Giggling', 'Хихикающее'], ['Shy', 'Застенчивое'], ['Dancing', 'Танцующее'], ['Bitey', 'Кусачее'],
    ['Glowing', 'Светящееся'], ['Invisible', 'Невидимое'], ['Yawning', 'Зевающее'], ['Tickly', 'Щекотное'], ['Wobbly', 'Дрожащее'], ['Mumbling', 'Бормочущее'], ['Sneezy', 'Чихающее'],
    ['Fluffy', 'Пушистое'], ['Croaky', 'Квакающее'], ['Lazy', 'Ленивое'], ['Ruffled', 'Взъерошенное'], ['Mysterious', 'Загадочное'], ['Prickly', 'Колючее'], ['Boastful', 'Хвастливое'],
    ['Gooey', 'Тягучее'], ['Stripy', 'Полосатое']];
  const GEN = [['of the Loud Sneeze', 'громкого чиха'], ['of Grandma’s Socks', 'бабушкиных носков'], ['of Flying Slippers', 'летающих тапок'], ['of Sudden Courage', 'внезапной храбрости'],
    ['of Pumpkin Happiness', 'тыквенного счастья'], ['of Moon Hiccups', 'лунной икоты'], ['of the Forgotten Umbrella', 'забытого зонтика'], ['of the Midnight Snack', 'полуночного перекуса'],
    ['of the Grumpy Cat', 'ворчливого кота'], ['of Dancing Spoons', 'танцующих ложек'], ['of the Lost Sock', 'потерянного носка'], ['of Unlearned Lessons', 'невыученных уроков'],
    ['of the Sleepy Owl', 'сонной совы'], ['of Crunchy Leaves', 'хрустящих листьев'], ['of the Warm Blanket', 'тёплого пледа'], ['of Brave Pigeons', 'храбрых голубей'],
    ['of the Summer Storm', 'летней грозы'], ['of Whispering Pumpkins', 'шёпота тыкв'], ['of the Creaky Staircase', 'скрипучей лестницы'], ['of the Missing Key', 'пропавшего ключа'],
    ['of Sudden Inspiration', 'внезапного вдохновения'], ['of Morning Laziness', 'утренней лени'], ['of the Funny Echo', 'смешного эха'], ['of the Crooked Broom', 'кривой метлы'],
    ['of the Dusty Attic', 'пыльного чердака'], ['of the Eternal Monday', 'вечного понедельника'], ['of Fluffy Clouds', 'пушистых облаков'], ['of the Secret Library', 'тайной библиотеки'],
    ['of the Chatty Raven', 'болтливого ворона'], ['of the Cheerful Skeleton', 'весёлого скелета'], ['of the Stuck Elevator', 'застрявшего лифта'], ['of the First Snow', 'первого снега'],
    ['of Wet Boots', 'мокрых ботинок'], ['of the Midnight Fridge', 'ночного холодильника'], ['of the Talking Teapot', 'говорящего чайника'], ['of Tangled Shoelaces', 'перепутанных шнурков'],
    ['of the Endless Friday', 'бесконечной пятницы'], ['of the Runaway Pie', 'сбежавшего пирога'], ['of the Smiling Moon', 'улыбчивой луны'], ['of Loud Purring', 'громкого мурчания'],
    ['of the Sour Lemon', 'кислого лимона'], ['of Unruly Curls', 'непослушных кудряшек'], ['of the Old Gramophone', 'старого граммофона'], ['of the Lazy Dragon', 'ленивого дракона'],
    ['of the Offended Ghost', 'обиженного привидения'], ['of Magic Crumbs', 'волшебных крошек'], ['of Friday Evening', 'пятничного вечера'], ['of Bouncing Pumpkins', 'прыгающих тыкв'],
    ['of Shiny Buttons', 'блестящих пуговиц'], ['of Happy Little Spiders', 'весёлых паучков'], ['of the Broken Broom', 'сломанной метлы'], ['of the Snoring Troll', 'храпящего тролля'],
    ['of Green Goosebumps', 'зелёных мурашек'], ['of Summer Holidays', 'летних каникул'], ['of Grandma’s Pies', 'бабушкиных пирожков'], ['of the Yard after Rain', 'двора после дождя'],
    ['of the Snowy Slide', 'снежной горки'], ['of Soap Bubbles', 'мыльных пузырей'], ['of Blanket Forts', 'шалашей из одеял'], ['of Morning Cartoons', 'мультиков по утрам']];
  // существительные у каждого сезона свои (и разные по уровню) — поэтому имена разных сезонов тоже не совпадают
  const NOUNS = {
    autumn: [null, [['Potion', 'зелье'], ['Brew', 'варево'], ['Tonic', 'снадобье']], [['Jam', 'варенье'], ['Treat', 'лакомство'], ['Soufflé', 'суфле']], [['Cocoa', 'какао'], ['Ice Cream', 'мороженое'], ['Cookie', 'печенье']]],
    winter: [null, [['Draught', 'питьё'], ['Remedy', 'средство'], ['Medicine', 'лекарство']], [['Jelly', 'желе'], ['Dragée', 'драже'], ['Praline', 'пралине']], [['Popsicle', 'эскимо'], ['Pastry', 'пирожное'], ['Meringue', 'безе']]],
    spring: [null, [['Sip', 'пойло'], ['Philtre', 'зельице'], ['Infusion', 'варевце']], [['Bonbon', 'монпансье'], ['Blancmange', 'бланманже'], ['Parfait', 'парфе']], [['Purée', 'пюре'], ['Soda', 'ситро'], ['Sundae', 'мороженко']]],
    summer: [null, [['Spell', 'колдовство'], ['Magic', 'волшебство'], ['Charm', 'чародейство']], [['Smoothie', 'смузи'], ['Frappé', 'фраппе'], ['Medley', 'ассорти']], [['Crème Brûlée', 'крем-брюле'], ['Tiramisu', 'тирамису'], ['Canapé', 'канапе']]],
  };
  const EFF = [['You can only whisper for three hours', 'Три часа говоришь только шёпотом'], ['Your ears turn warm and pink', 'Уши становятся тёплыми и розовыми'],
    ['Every cat nearby starts to respect you', 'Все коты вокруг начинают тебя уважать'], ['Your hair stands on end, but stylishly', 'Волосы встают дыбом, но красиво'],
    ['You hiccup soap bubbles', 'Икаешь мыльными пузырями'], ['Your feet keep dancing on their own', 'Ноги сами пританцовывают'], ['You start to understand pigeons', 'Начинаешь понимать язык голубей'],
    ['Everything sweet tastes even sweeter', 'Всё сладкое кажется ещё слаще'], ['Your fingers glow in the dark', 'Пальцы светятся в темноте'], ['Your shadow walks half a step behind', 'Тень ходит на полшага позади'],
    ['Your socks never get lost again', 'Носки больше никогда не теряются'], ['Every sneeze rings like a little bell', 'Каждый чих звенит, как колокольчик'],
    ['You want to hug the nearest pillow', 'Хочется обнять ближайшую подушку'], ['You vanish for exactly one minute', 'Ровно на минуту исчезаешь'], ['Your voice sounds like a cartoon', 'Голос становится как в мультике'],
    ['You draw perfect circles on the first try', 'Рисуешь ровные круги с первого раза'], ['All your buttons start to shine', 'Все пуговицы на одежде начинают сиять'],
    ['You smell of cinnamon and adventure', 'Пахнешь корицей и приключениями'], ['You remember all your dreams from last week', 'Помнишь все сны за неделю'],
    ['Pumpkins smile when you walk by', 'Тыквы улыбаются, когда ты проходишь мимо'], ['Your tea stays hot all day', 'Чай в кружке не остывает весь день'], ['It suddenly feels like Friday', 'Кажется, что сегодня пятница'],
    ['You speak in rhyme until dinner', 'До самого ужина говоришь в рифму'], ['Spiders weave you compliments', 'Пауки плетут тебе комплименты'], ['Owls invite you to their night parties', 'Совы зовут на ночные посиделки'],
    ['Your pencils stop breaking', 'Карандаши перестают ломаться'], ['You want to sing, even outside the shower', 'Хочется петь, даже не в душе'], ['The moon winks at you through the window', 'Луна подмигивает тебе в окно'],
    ['Your shoelaces tie themselves', 'Шнурки завязываются сами'], ['Your reflection waves first', 'Отражение в зеркале машет первым'],
    ['You float a couple of centimetres above the floor for an hour', 'Час паришь в паре сантиметров над полом'], ['Mosquitoes fly around you', 'Комары облетают тебя стороной'],
    ['You smell like a mystery', 'Вокруг тебя пахнет загадкой'], ['You laugh at jokes nobody has made yet', 'Смеёшься над шутками, которые ещё не придумали'],
    ['You remember where every lost thing is', 'Вспоминаешь, где лежат все потерянные вещи'], ['Houseplants start growing faster', 'Комнатные цветы начинают расти быстрее'],
    ['You urgently need to build a blanket fort', 'Срочно хочется построить шалаш из одеял'], ['It smells like grandma’s kitchen', 'Пахнет бабушкиной кухней'],
    ['You want summer holidays again', 'Снова хочется на каникулы'], ['Your knees stop being afraid of slides', 'Коленки перестают бояться горок']];
  const FAILS = [['The cauldron sneezed and spat out a sock.', 'Котёл чихнул и выплюнул носок.'], ['A suspicious grey goo. Polly poured it into a plant, and the plant got offended.', 'Вышла подозрительная серая жижа. Полли вылила её в цветок — цветок обиделся.'],
    ['Bloop… and nothing. Just a smell of old slippers.', 'Бульк… и ничего. Только запах старых тапок.'], ['The potion ran out of the cauldron and hid under the cupboard.', 'Зелье убежало из котла и спряталось под шкаф.'],
    ['The steam spelled out “NO”.', 'Пар сложился в слово «НЕТ».'], ['The cauldron gurgled, offended, and turned away.', 'Котёл обиженно булькнул и отвернулся.'],
    ['It turned into jelly. Just jelly.', 'Вышел кисель. Просто кисель.'], ['A bat flew out and asked you never to do that again.', 'Из котла вылетела летучая мышь и попросила больше так не делать.'],
    ['The mix changed colour five times and got tired.', 'Смесь пять раз поменяла цвет и устала.'], ['Something crunchy came out. Better not taste it.', 'Получилось что-то хрустящее. Лучше не пробовать.'],
    ['The pumpkin in the corner sighed loudly.', 'Тыква в углу громко вздохнула.'], ['The potion appeared and evaporated out of embarrassment.', 'Зелье появилось и тут же испарилось от смущения.']];
  const SOFF = { autumn: 0, winter: 1, spring: 2, summer: 3 };
  function potion(ix, tier, season = 'autumn') {
    const k = (ix * 7919 + 17) % (ADJ.length * GEN.length), a = ADJ[k % ADJ.length], g = GEN[Math.floor(k / ADJ.length)], nn = (NOUNS[season] || NOUNS.autumn)[tier || 1][ix % 3], e = EFF[(ix * 13 + 5 + SOFF[season] * 11) % EFF.length];
    const name = L2 ? `${a[1]} ${nn[1]} ${g[1]}` : `${a[0]} ${nn[0]} ${g[0]}`;
    return { name, eff: e[L2], hue: (ix * 137 + SOFF[season] * 47) % 360 };
  }
  // бутылочка зелья: форма по уровню, цвет — свой у каждого рецепта
  function bottle(ix, tier, size = 40, season = 'autumn') {
    const c = document.createElement('canvas'); c.width = c.height = 16; c.className = 'pot-bottle'; c.style.width = c.style.height = size + 'px';
    const g = c.getContext('2d'), hue = tier ? (ix * 137 + (SOFF[season] || 0) * 47) % 360 : 0, liq = tier ? `hsl(${hue},70%,55%)` : '#8a8478', glass = '#e8f1f7', d = '#2b1f3d';
    const shapes = { 0: ['......dd......', '.....dggd.....', '....dggggd....', '...dllllllld..', '...dllllllld..', '....dllllld...', '.....ddddd....'],
      1: ['......dd......', '.....dggd.....', '.....dggd.....', '...ddggggdd...', '..dgggggggggd.', '..dlllllllld..', '..dlllllllld..', '..dlllllllld..', '...dlllllld...', '....dddddd....'],
      2: ['.....dddd.....', '.....dggd.....', '.....dggd.....', '....dggggd....', '....dllllld...', '....dllllld...', '....dllllld...', '....dllllld...', '....dllllld...', '....dddddd....'],
      3: ['.....dddd.....', '.....dggd.....', '..dd.dggd.dd..', '.dllddllddlld.', '.dllllllllllld', '.dllllllllllld', '..dllllllllld.', '...dllllllld..', '....dllllld...', '.....dllld....', '......ddd.....'] };
    const rows = shapes[tier] || shapes[0], y0 = 16 - rows.length - 1;
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '.') return; g.fillStyle = ch === 'd' ? d : ch === 'g' ? glass : liq; g.fillRect(x + 1, y + y0, 1, 1); }));
    if (tier) { g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(5, y0 + rows.length - 4, 1, 2); }
    if (tier === 3) { g.fillStyle = '#F2C94C'; g.fillRect(14, 1, 1, 1); g.fillRect(13, 2, 3, 1); g.fillRect(14, 3, 1, 1); }
    return c;
  }

  window.PPPotion = { ING, IG, emoImg, SWEET, SEASONS, SEASON_INFO, FAILS, potion, bottle, L2 };
})();
