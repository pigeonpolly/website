// Квесты детектива Титоса поверх rooms.js (window.ROOM). Дела: №1 «Украденный сироп», №2 «Шпион среди огурцов».
// Каждое дело — свой набор улик, подозреваемых и свой прогресс в localStorage; выбранное дело — 'pp-titos-case' (вкладки сверху).
(() => {
  const A = window.ROOM; if (!A || A.R == null || document.getElementById('rm').dataset.room !== 'detective') return;
  const { box, R, L, esc, pct } = A;
  const t = o => o[L];
  const UI = {
    caseNo: ['Case No.', 'Дело №', 'Lieta Nr.'], soon: ['coming soon', 'скоро', 'drīzumā'],
    clues: ['Clues on the board', 'Улик на доске', 'Pierādījumi uz dēļa'],
    board: ['📌 Evidence board', '📌 Доска улик', '📌 Pierādījumu dēlis'],
    inv: ['Pockets', 'Карманы', 'Kabatas'],
    pin: ['📌 Pin to the board', '📌 Приколоть на доску', '📌 Piespraust pie dēļa'],
    pinned: ['On the board ✓', 'Уже на доске ✓', 'Jau uz dēļa ✓'],
    exam: ['🔍 Examine with the magnifier', '🔍 Рассмотреть под лупой', '🔍 Apskatīt ar lupu'],
    needMag: ['You need a magnifying glass. There is one on the filing cabinet, next to the coffee pot.', 'Нужна лупа. Она лежит на шкафу с документами, рядом с кофейником.', 'Vajag lupu. Tā ir uz dokumentu skapja, blakus kafijas kannai.'],
    smeared: ['Something is smeared on it. Too small to see with the naked eye.', 'На этом что-то размазано. Невооружённым глазом не разглядеть.', 'Uz tā kaut kas ir nosmērēts. Ar neapbruņotu aci neredz.'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    suspects: ['Suspects', 'Подозреваемые', 'Aizdomās turamie'],
    noDoss: ['The suspects’ folders are in the filing cabinet drawer.', 'Папки подозреваемых — в ящике шкафа с документами.', 'Aizdomās turamo mapes ir dokumentu skapja atvilktnē.'],
    accuseBtn: ['Accuse', 'Обвинить', 'Apsūdzēt'],
    magGot: ['You take the magnifying glass. Now clues can be examined.', 'Вы берёте лупу. Теперь улики можно рассмотреть.', 'Tu paņem lupu. Tagad pierādījumus var apskatīt.'],
    solvedT: ['CASE CLOSED', 'ДЕЛО ЗАКРЫТО', 'LIETA SLĒGTA'],
    again: ['Investigate again', 'Расследовать заново', 'Izmeklēt vēlreiz'],
    needAll: [n => `Pin all ${n} clues to the board first.`, n => `Сначала приколите на доску все ${n} улик.`, n => `Vispirms piesprauž pie dēļa visus ${n} pierādījumus.`],
    scene: ['🖼 Crime scene', '🖼 Место происшествия', '🖼 Notikuma vieta'],
    sceneHint: ['Click the people and things in the photo.', 'Нажимайте на людей и вещи на фото.', 'Spied uz cilvēkiem un lietām foto.'],
    sceneSwipe: ['The photo scrolls sideways.', 'Фото листается вбок.', 'Foto var ritināt uz sāniem.'],
    ask: ['🗣 Interrogation', '🗣 Допрос', '🗣 Nopratināšana'],
    askAll: ['Ask all three questions first.', 'Сначала задайте все три вопроса.', 'Vispirms uzdodiet visus trīs jautājumus.'],
    pinW: ['📌 Pin the statement to the board', '📌 Приколоть показания на доску', '📌 Piespraust liecību pie dēļa'],
  };
  const C1 = {
    report: { hot: 'folders', icon: null, kind: 'read',
      title: ['Factory report', 'Отчёт фабрики', 'Fabrikas ziņojums'],
      text: ['MAPLEWINK SYRUP FACTORY. Barrel No. 12 of golden syrup vanished overnight. The door was not forced, but the skylight in the roof was open. Found next to the empty spot: floury footprints, a feather, a sticky jar lid.',
             'СИРОПНАЯ ФАБРИКА MAPLEWINK. Ночью пропала бочка № 12 золотого сиропа. Дверь не взломана, но открыт люк в крыше. Рядом с пустым местом найдены: мучные следы, перо, липкая крышка от банки.',
             'MAPLEWINK SĪRUPA FABRIKA. Naktī pazuda zelta sīrupa muca Nr. 12. Durvis nav uzlauztas, bet jumta lūka bija vaļā. Blakus tukšajai vietai atrasti: miltaini pēdu nospiedumi, spalva, lipīgs burkas vāciņš.'] },
    photo: { sprite: ['clue-photo', 206, 160, 14], kind: 'read', herring: true,
      title: ['Photo: floury footprints', 'Фото: мучные следы', 'Foto: miltainas pēdas'],
      text: ['Floury boot prints right next to where barrel No. 12 stood. Size 44. Bun the baker wears size 44… and is always covered in flour.', 'Мучные следы ботинок прямо там, где стояла бочка № 12. Размер 44. Пекарь Бан носит 44-й… и вечно весь в муке.', 'Miltaini zābaku nospiedumi tieši tur, kur stāvēja muca Nr. 12. Izmērs 44. Maiznieks Bans valkā 44. izmēru… un vienmēr ir miltos.'] },
    receipt: { hot: 'paper#1', kind: 'read',
      title: ['Bakery delivery note', 'Накладная пекарни', 'Maiznīcas pavadzīme'],
      text: ['PINECREST BAKERY. Delivered to the Syrup Factory: 40 loaves for the night shift. Time: 6 pm. After that — straight to the Festival of Warm Ovens, back at dawn. Signed: Bun.', 'ПЕКАРНЯ PINECRUST. Доставлено на сиропную фабрику: 40 буханок для ночной смены. Время: 18:00. После — сразу на Праздник тёплых печей, обратно на рассвете. Подпись: Бан.', 'PINECRUST MAIZNĪCA. Piegādāts sīrupa fabrikai: 40 klaipi nakts maiņai. Laiks: 18:00. Pēc tam — uzreiz uz Silto krāšņu svētkiem, atpakaļ rītausmā. Paraksts: Bans.'] },
    statement: { hot: 'recorder', kind: 'listen',
      title: ['Witness statement', 'Показания свидетеля', 'Liecinieka liecība'],
      text: ['Dictaphone, night guard Moss: “I was awake. Mostly. Around two in the morning I heard big wings flapping on the roof and somebody squawking ‘so… heavy!’. Then something rolled towards the station.”', 'Диктофон, ночной сторож Мосс: «Я не спал. Почти. Около двух ночи на крыше хлопали большие крылья, и кто-то вопил: „ох… тяжёлая!“. Потом что-то покатилось к станции».', 'Diktofons, nakts sargs Moss: “Es negulēju. Gandrīz. Ap diviem naktī uz jumta plivinājās lieli spārni un kāds kliedza: ‘ak… smaga!’. Tad kaut kas aizripoja uz staciju.”'] },
    feather: { sprite: ['clue-feather', 176, 194, 16], kind: 'analyze',
      title: ['A feather', 'Перо', 'Spalva'],
      text: ['Under the magnifier: a grey-and-white seagull feather, glued together with maple syrup. In Wobbleland, seagulls live in New Wobbleton.', 'Под лупой: серо-белое перо чайки, склеенное кленовым сиропом. В Wobbleland чайки живут в New Wobbleton.', 'Zem lupas: pelēkbalta kaijas spalva, salipusi ar kļavu sīrupu. Wobbleland kaijas dzīvo New Wobbleton.'] },
    lid: { hot: 'bin', kind: 'analyze',
      title: ['Sticky jar lid', 'Липкая крышка', 'Lipīgs vāciņš'],
      text: ['Under the magnifier: these are not fingerprints at all. Three long toes with webbing, printed in syrup. A bird’s foot, not a hand.', 'Под лупой: это вовсе не отпечатки пальцев. Три длинных пальца с перепонками, отпечатаны в сиропе. Лапа птицы, а не рука.', 'Zem lupas: tie nemaz nav pirkstu nospiedumi. Trīs gari pirksti ar peldplēvēm, nospiesti sīrupā. Putna kāja, nevis roka.'] },
    ticket: { hot: 'coat', kind: 'read',
      title: ['Train ticket', 'Билет на поезд', 'Vilciena biļete'],
      text: ['Found in the coat pocket, Titos picked it up at the station: “Night cargo train, Maplewink → New Wobbleton, 02:14. Passenger: G… (the rest is smudged with syrup). Luggage: 1 barrel, very sticky.”', 'Нашёлся в кармане плаща — Титос подобрал его на станции: «Ночной грузовой поезд, Maplewink → New Wobbleton, 02:14. Пассажир: Г… (дальше заляпано сиропом). Багаж: 1 бочка, очень липкая».', 'Atrasta mēteļa kabatā — Titoss to pacēla stacijā: “Nakts kravas vilciens, Maplewink → New Wobbleton, 02:14. Pasažieris: G… (tālāk notraipīts ar sīrupu). Bagāža: 1 muca, ļoti lipīga.”'] },
  };
  const ORDER1 = ['report', 'photo', 'receipt', 'statement', 'feather', 'lid', 'ticket'];
  const S1 = {
    baker: { name: ['Bun, baker of Pinecrust', 'Бан, пекарь из Pinecrust', 'Bans, Pinecrust maiznieks'],
      text: ['Bakes three hundred pies a day and uses a lot of syrup. Size 44 boots, always floury. Titos suspects him in every case. Every single one.', 'Печёт триста пирогов в день и тратит много сиропа. Ботинки 44-го размера, вечно в муке. Титос подозревает его в каждом деле. В каждом.', 'Cep trīssimt pīrāgus dienā un izlieto daudz sīrupa. 44. izmēra zābaki, vienmēr miltos. Titoss viņu tur aizdomās katrā lietā. Katrā.'],
      verdict: ['Wrong! Bun delivered the bread at 6 pm, that’s where the floury footprints came from, and he spent the whole night at the Festival of Warm Ovens. The real thief flew away…', 'Мимо! Бан привёз хлеб в 18:00 — отсюда мучные следы, — а всю ночь был на Празднике тёплых печей. Настоящий вор улетел…', 'Garām! Bans atveda maizi 18:00 — no turienes miltainās pēdas —, un visu nakti bija Silto krāšņu svētkos. Īstais zaglis aizlidoja…'] },
    gull: { name: ['Gustav, Seagull Guardian of New Wobbleton', 'Густав, чайка-страж из New Wobbleton', 'Gustavs, kaiju sargs no New Wobbleton'],
      text: ['Guards Seagull Square. Famous for snatching pastries. Strong wings: can almost lift a barrel. Has a terrible sweet tooth.', 'Охраняет площадь Чаек. Знаменит тем, что таскает пирожки. Сильные крылья: почти может поднять бочку. Ужасный сладкоежка.', 'Sargā Kaiju laukumu. Slavens ar to, ka zog pīrādziņus. Spēcīgi spārni: gandrīz var pacelt mucu. Briesmīgs saldummīlis.'],
      verdict: ['Correct! The feather, the webbed prints in syrup, wings on the roof and a ticket for “G…” to New Wobbleton. Gustav confessed: he wanted syrup for the Great Wobble Day pastries. Barrel No. 12 is back in Maplewink.', 'Верно! Перо, перепончатые следы в сиропе, крылья на крыше и билет на «Г…» до New Wobbleton. Густав сознался: хотел сироп для пирожков к Великому дню качки. Бочка № 12 вернулась в Maplewink.', 'Pareizi! Spalva, peldplēvju pēdas sīrupā, spārni uz jumta un biļete uz “G…” līdz New Wobbleton. Gustavs atzinās: gribēja sīrupu pīrādziņiem Lielajai šūpošanās dienai. Muca Nr. 12 ir atpakaļ Maplewink.'] },
    guard: { name: ['Moss, night guard of the Syrup Factory', 'Мосс, ночной сторож фабрики', 'Moss, fabrikas nakts sargs'],
      text: ['A snail from Snailhollow, the slowest guard on the island. Says he was awake. Mostly.', 'Улитка из Snailhollow, самый медленный сторож острова. Говорит, что не спал. Почти.', 'Gliemezis no Snailhollow, lēnākais sargs salā. Saka, ka negulēja. Gandrīz.'],
      verdict: ['Wrong! Moss can’t lift a teacup, let alone a barrel, and he would still be crawling to the 02:14 train today. The real thief flew away…', 'Мимо! Мосс не поднимет и чашку, не то что бочку, а до поезда в 02:14 он полз бы до сих пор. Настоящий вор улетел…', 'Garām! Moss nepaceltu pat tasi, kur nu mucu, un uz vilcienu 02:14 viņš rāpotu vēl šodien. Īstais zaglis aizlidoja…'] },
  };
  const ICON1 = id => C1[id].sprite ? `/images/rooms/${C1[id].sprite[0]}.png` : id === 'report' ? '/images/rooms/prop-mail.png' : id === 'statement' ? '/images/rooms/prop-pot.png' : id === 'lid' ? '/images/rooms/clue-lid.png' : '/images/rooms/clue-ticket.png';
  for (const id of ORDER1) C1[id].icon = ICON1(id);
  const CASE1 = { no: 1, key: 'pp-titos-syrup-case', C: C1, ORDER: ORDER1, S: S1, culprit: 'gull',
    title: ['The stolen syrup', 'Украденный сироп', 'Nozagtais sīrups'],
    label: ['Case: the stolen syrup', 'Дело: украденный сироп', 'Lieta: nozagtais sīrups'],
    accuse: ['Who stole the syrup?', 'Кто украл сироп?', 'Kurš nozaga sīrupu?'],
    intro: ['I can’t sleep. Barrel No. 12 of syrup is missing and I have only coffee. Find the clues, there are seven of them somewhere in this office.', 'Не могу уснуть. Пропала бочка сиропа № 12, а у меня только кофе. Найдите улики — их семь, где-то в этом кабинете.', 'Nevaru aizmigt. Pazudusi sīrupa muca Nr. 12, un man ir tikai kafija. Atrodi pierādījumus — tie ir septiņi, kaut kur šajā kabinetā.'],
    bye: ['Case closed. Finally. Home, bed, no coffee. Good night!', 'Дело закрыто. Наконец-то. Домой, в кровать, без кофе. Спокойной ночи!', 'Lieta slēgta. Beidzot. Mājās, gultā, bez kafijas. Ar labu nakti!'],
    sus: k => `/images/rooms/suspect-${k}.png`,
    STR: [[0, 2], [1, 2], [0, 3], [3, 6], [0, 4], [4, 5], [5, 6]],
    POS: [[8, 10], [38, 6], [70, 10], [10, 52], [40, 46], [70, 52], [40, 80]],
  };
  // ---------- Дело №2: шпион среди огурцов (сцена — иллюстрация Алины, site/images/rooms/case2-scene.jpg) ----------
  const P2 = k => `/images/rooms/case2-${k}.jpg`;
  const C2 = {
    news: { emo: '📰', kind: 'read',
      title: ['Newspaper “The Scon-icle”', 'Газета «The Scon-icle»', 'Avīze “The Scon-icle”'],
      text: ['PRICKLY GANG STRIKES AGAIN? At the Cucumber Party, a stack of valuable papers, Madam Pumpkin’s house mortgage and the lovely Tomato Rosa all vanished. Police warn: the Prickly gang’s repeat offender can pass for a cucumber. Signs: never drinks water, hides from the rain, wears gloves, leaves needles behind.',
             'СНОВА БАНДА КОЛЮЧИХ? На Огуречной тусовке пропали пачка ценных бумаг, закладная на дом мадам Тыквы и красавица Помидорка Роза. Полиция предупреждает: рецидивист Колючих умеет выдавать себя за огурца. Приметы: не пьёт воду, прячется от дождя, носит перчатки, оставляет иголки.',
             'ATKAL DZELOŅAINIE? Gurķu ballītē pazuda vērtspapīru kaudze, kundzes Ķirbes mājas hipotēkas līgums un skaistā Tomātiņa Roza. Policija brīdina: Dzeloņaino bandas recidīvists prot uzdoties par gurķi. Pazīmes: nedzer ūdeni, slēpjas no lietus, valkā cimdus, atstāj adatas.'] },
    badge: { emo: '🪪', kind: 'analyze',
      title: ['Police ID', 'Полицейское удостоверение', 'Policijas apliecība'],
      pre: ['The man in the trench coat flashes an ID: “Agent Pickle, Cucumber Police. Move along!” The stamp looks odd, but it is too small to see properly.',
            'Человек в плаще показывает удостоверение: «Агент Пикль, Огуречная полиция. Проходите!» Печать какая-то странная, но мелко — не разглядеть.',
            'Vīrs mētelī parāda apliecību: “Aģents Pikls, Gurķu policija. Ejiet tālāk!” Zīmogs izskatās dīvains, bet tas ir pārāk sīks, lai saskatītu.'],
      text: ['Under the magnifier: the stamp is drawn with a felt-tip pen, “Cucumber” is spelled “Cucumbre”, and the photo is glued over someone else’s. A fake!',
             'Под лупой: печать нарисована фломастером, в слове «Огуречная» ошибка — «Агуречная», а фото приклеено поверх чужого. Подделка!',
             'Zem lupas: zīmogs uzzīmēts ar flomāsteru, vārdā “Gurķu” ir kļūda — “Gurku”, un foto uzlīmēts virsū kāda cita fotogrāfijai. Viltojums!'] },
    glove: { emo: '🧤', kind: 'analyze',
      title: ['Glove by the lamp post', 'Перчатка у фонаря', 'Cimds pie laternas'],
      pre: ['A grey glove lies at the foot of the lamp post. Something is odd about it. Too small to see with the naked eye.',
            'У подножия фонаря лежит серая перчатка. С ней что-то не так. Невооружённым глазом не разглядеть.',
            'Pie laternas pamatnes guļ pelēks cimds. Ar to kaut kas nav kārtībā. Ar neapbruņotu aci neredz.'],
      text: ['Under the magnifier: dozens of tiny holes, pierced from the inside, as if a prickly hand had been in it. The label says “Size: XL Prickly”. Same grey as that trench coat.',
             'Под лупой: десятки крошечных дырочек, проколотых изнутри, — будто в перчатке была колючая лапа. На ярлычке: «Размер: XL Колючий». Того же серого цвета, что и тот плащ.',
             'Zem lupas: desmitiem sīku caurumiņu, caurdurti no iekšpuses, it kā cimdā būtu bijusi dzeloņaina roka. Uz etiķetes: “Izmērs: XL Dzeloņains”. Tādā pašā pelēkā tonī kā tas mētelis.'] },
    needle: { emo: '🎀', kind: 'analyze',
      title: ['Red ribbon', 'Красная ленточка', 'Sarkanā lentīte'],
      pre: ['Tomato Rosa’s red hair ribbon lies on the cobblestones. Something tiny is stuck in it.',
            'На брусчатке — красная ленточка Помидорки Розы. В ней застряло что-то крошечное.',
            'Uz bruģa guļ Tomātiņas Rozas sarkanā matu lentīte. Tajā iesprūdis kaut kas sīks.'],
      text: ['Under the magnifier: not a soft cucumber bump but a real cactus spine, with a grain of desert sand on the tip. Cucumbers prickle gently. Cacti mean it.',
             'Под лупой: это не мягкий огуречный пупырышек, а настоящая кактусовая иголка с песчинкой пустыни на кончике. Огурцы колются понарошку, кактусы — всерьёз.',
             'Zem lupas: tas nav mīksts gurķa pumpiņš, bet īsta kaktusa adata ar tuksneša smilšu graudiņu galā. Gurķi dzeļ pa jokam, kaktusi — pa īstam.'] },
    bill: { emo: '🧾', kind: 'read',
      title: ['Green Grocer bill', 'Счёт из лавки Green Grocer', 'Green Grocer rēķins'],
      text: ['Evening orders. Sir Cornelius: 3 jugs of water. Baron von Dill: 2 jugs of water and a pickle brine. Lord Greenwich: 3 lemonades (“water fogs up my monocle”). Gentleman in the trench coat by the lamp post: nothing at all, not a single glass.',
             'Заказы за вечер. Сэр Корнелиус: 3 кувшина воды. Барон фон Укроп: 2 кувшина воды и рассол. Лорд Гринвич: 3 лимонада («от воды запотевает монокль»). Господин в плаще у фонаря: ничего, ни единого стакана.',
             'Vakara pasūtījumi. Sērs Kornēlijs: 3 krūkas ūdens. Barons fon Dille: 2 krūkas ūdens un sālījums. Lords Grīnvičs: 3 limonādes (“no ūdens aizsvīst monoklis”). Kungs mētelī pie laternas: neko, ne vienas glāzes.'] },
    w_sir: { kind: 'witness', w: 'sir', icon: P2('sir'),
      title: ['Statement: Sir Cornelius', 'Показания: сэр Корнелиус', 'Liecība: sērs Kornēlijs'],
      text: ['Sir Cornelius: Tomato Rosa went up to the man in the trench coat, cried “Ouch, it prickles!” and vanished. He wrote in a notebook marked TOP SECRET all evening.',
             'Сэр Корнелиус: Помидорка Роза подошла к человеку в плаще, вскрикнула «Ой, колется!» и пропала. Весь вечер он писал в блокнот с надписью TOP SECRET.',
             'Sērs Kornēlijs: Tomātiņa Roza piegāja pie vīra mētelī, iesaucās “Ai, dur!” un pazuda. Visu vakaru viņš rakstīja grāmatiņā ar uzrakstu TOP SECRET.'] },
    w_baron: { kind: 'witness', w: 'baron', icon: P2('baron'),
      title: ['Statement: Baron von Dill', 'Показания: барон фон Укроп', 'Liecība: barons fon Dille'],
      text: ['Baron von Dill: when it rained, the man in the trench coat hid under the lamp post with an umbrella, and he took the mortgage folder “as police evidence”.',
             'Барон фон Укроп: когда пошёл дождь, человек в плаще спрятался под фонарём с зонтиком, а папку с закладной забрал «как полицейскую улику».',
             'Barons fon Dille: kad sāka līt, vīrs mētelī paslēpās zem laternas ar lietussargu, un mapi ar hipotēkas līgumu paņēma “kā policijas pierādījumu”.'] },
    w_lord: { kind: 'witness', w: 'lord', icon: P2('lord'),
      title: ['Statement: Lord Greenwich', 'Показания: лорд Гринвич', 'Liecība: lords Grīnvičs'],
      text: ['Lord Greenwich: shaking hands with the man in the trench coat was “like a hedgehog”; he left by taxi “to the desert, quick” with a heavy folder and a very red passenger.',
             'Лорд Гринвич: пожать руку человеку в плаще — «будто ёжику»; он уехал на такси «в пустыню, быстро» с тяжёлой папкой и очень красной пассажиркой.',
             'Lords Grīnvičs: paspiest roku vīram mētelī bija “kā ezim”; viņš aizbrauca ar taksi “uz tuksnesi, ātri” ar smagu mapi un ļoti sarkanu pasažieri.'] },
  };
  // допрос: по три вопроса каждому из трёх джентльменов; показания можно приколоть, когда заданы все вопросы
  const W2 = {
    sir: { img: P2('sir'), name: ['Sir Cornelius Gherkin', 'Сэр Корнелиус Корнишон', 'Sērs Kornēlijs Kornišons'], qa: [
      [['Where were you all evening?', 'Где вы были весь вечер?', 'Kur jūs bijāt visu vakaru?'],
       ['By the Green Grocer window, with friends. Water, pies, polite conversation. I am a cucumber, I need my 95% water!', 'У витрины Green Grocer, с друзьями. Вода, пирожки, светская беседа. Я огурец, мне нужны мои 95% воды!', 'Pie Green Grocer skatloga, ar draugiem. Ūdens, pīrādziņi, pieklājīga saruna. Es esmu gurķis, man vajag savus 95% ūdens!']],
      [['Did you see Tomato Rosa?', 'Вы видели Помидорку Розу?', 'Vai redzējāt Tomātiņu Rozu?'],
       ['She went to ask the gentleman in the trench coat what he was writing. Then she squeaked “Ouch, it prickles!” and I never saw her again.', 'Она подошла спросить у господина в плаще, что он пишет. Потом пискнула «Ой, колется!» — и больше я её не видел.', 'Viņa piegāja pajautāt kungam mētelī, ko viņš raksta. Tad iepīkstējās “Ai, dur!” — un vairāk es viņu neredzēju.']],
      [['Anything else odd?', 'Что-нибудь ещё странное?', 'Vēl kaut kas dīvains?'],
       ['That one stood by the lamp post all evening, writing in a notebook marked TOP SECRET. Secret things are not usually labelled, are they?', 'Тот весь вечер стоял у фонаря и писал в блокнот с надписью TOP SECRET. Секретное ведь обычно не подписывают, правда?', 'Tas visu vakaru stāvēja pie laternas un rakstīja grāmatiņā ar uzrakstu TOP SECRET. Slepenas lietas taču parasti neparaksta, vai ne?']],
    ] },
    baron: { img: P2('baron'), name: ['Baron von Dill', 'Барон фон Укроп', 'Barons fon Dille'], qa: [
      [['Where were you all evening?', 'Где вы были весь вечер?', 'Kur jūs bijāt visu vakaru?'],
       ['Smoking my pipe by the window. I keep away from the fountain only because the spray puts my pipe out!', 'Курил трубку у витрины. К фонтану не подхожу только потому, что брызги тушат трубку!', 'Smēķēju pīpi pie skatloga. Pie strūklakas nenāku tikai tāpēc, ka šļakatas nodzēš pīpi!']],
      [['What happened when it rained?', 'Что было, когда пошёл дождь?', 'Kas notika, kad sāka līt?'],
       ['All of us cucumbers turned our faces up, lovely! Only the one in the trench coat hid under the lamp post and opened an umbrella. A cucumber afraid of rain? Ridiculous.', 'Мы, огурцы, все подставили лица — красота! Только тот, в плаще, спрятался под фонарём и раскрыл зонтик. Огурец боится дождя? Смешно.', 'Mēs, gurķi, visi pavērsām sejas pret lietu — skaisti! Tikai tas mētelī paslēpās zem laternas un atvēra lietussargu. Gurķis baidās no lietus? Smieklīgi.']],
      [['Who was near the papers?', 'Кто был рядом с бумагами?', 'Kurš bija pie papīriem?'],
       ['The folder with the mortgage lay on our table. The man in the trench coat said “Police, I’m taking this as evidence” and took it. Very official.', 'Папка с закладной лежала на нашем столике. Господин в плаще сказал: «Полиция, изымаю как улику» — и забрал. Очень официально.', 'Mape ar hipotēkas līgumu stāvēja uz mūsu galdiņa. Kungs mētelī teica: “Policija, ņemu kā pierādījumu” — un paņēma. Ļoti oficiāli.']],
    ] },
    lord: { img: P2('lord'), name: ['Lord Septimus Greenwich', 'Лорд Септимус Гринвич', 'Lords Septims Grīnvičs'], qa: [
      [['Why don’t you drink water?', 'Почему вы не пьёте воду?', 'Kāpēc jūs nedzerat ūdeni?'],
       ['Water fogs up my monocle, my dear. I drink lemonade, three a night. It is still 95% water, ask the grocer.', 'От воды запотевает монокль, мой дорогой. Я пью лимонад, по три за вечер. Это всё равно 95% воды, спросите у лавочника.', 'No ūdens aizsvīst monoklis, mans dārgais. Es dzeru limonādi, trīs vakarā. Tā tik un tā ir 95% ūdens, pajautājiet bodniekam.']],
      [['Did anyone shake your hand?', 'Кто-нибудь пожимал вам руку?', 'Vai kāds jums spieda roku?'],
       ['The trench coat fellow, through a glove. Like shaking hands with a hedgehog. I had to have my own glove darned.', 'Тип в плаще, через перчатку. Будто ёжику руку пожал. Пришлось штопать свою перчатку.', 'Tas tips mētelī, caur cimdu. It kā ezim roku paspiestu. Nācās lāpīt savu cimdu.']],
      [['Where did he go?', 'Куда он делся?', 'Kur viņš palika?'],
       ['Called a taxi, “to the desert, quick”. With a heavy folder and a very red passenger in the back. I thought it was a police matter.', 'Вызвал такси «в пустыню, быстро». С тяжёлой папкой и очень красной пассажиркой на заднем сиденье. Я думал, это полицейское дело.', 'Izsauca taksi “uz tuksnesi, ātri”. Ar smagu mapi un ļoti sarkanu pasažieri aizmugurē. Es domāju, ka tā ir policijas lieta.']],
    ] },
  };
  const S2 = {
    agent: { name: ['The man in the trench coat (“Agent Pickle”)', 'Человек в плаще («агент Пикль»)', 'Vīrs mētelī (“aģents Pikls”)'],
      text: ['Dark glasses, hat pulled low, an earpiece. Says he is an undercover police agent. Stood by the lamp post all evening.', 'Тёмные очки, шляпа надвинута на глаза, наушник. Говорит, что он агент полиции под прикрытием. Весь вечер простоял у фонаря.', 'Tumšas brilles, cepure dziļi uz acīm, austiņa. Saka, ka ir slepenais policijas aģents. Visu vakaru nostāvēja pie laternas.'],
      verdict: ['Correct! A fake police ID, a glove pierced from the inside, a cactus spine on Rosa’s ribbon, not a drop of water and running from the rain. “Agent Pickle” is Spike, repeat offender of the Prickly gang! The taxi was stopped at the edge of the desert: the papers and the mortgage are back with their owners, and Tomato Rosa is home safe.',
                'Верно! Поддельное удостоверение, перчатка, проколотая изнутри, кактусовая иголка на ленточке Розы, ни капли воды и бегство от дождя. «Агент Пикль» — это Шип, рецидивист банды Колючих! Такси остановили на краю пустыни: бумаги и закладная вернулись к хозяевам, а Помидорка Роза — домой.',
                'Pareizi! Viltota policijas apliecība, no iekšpuses caurdurts cimds, kaktusa adata uz Rozas lentītes, ne pilītes ūdens un bēgšana no lietus. “Aģents Pikls” ir Dzelonis, Dzeloņaino bandas recidīvists! Taksi apturēja tuksneša malā: papīri un hipotēkas līgums atgriezti īpašniekiem, bet Tomātiņa Roza — mājās.'] },
    lord: { name: W2.lord.name,
      text: ['Monocle, bow tie, cane. Never drinks water, only lemonade. Very posh, slightly suspicious.', 'Монокль, бабочка, трость. Воду не пьёт — только лимонад. Очень важный и немного подозрительный.', 'Monoklis, tauriņš, spieķis. Ūdeni nedzer — tikai limonādi. Ļoti svarīgs un mazliet aizdomīgs.'],
      verdict: ['Wrong! Lemonade is 95% water too, and the Lord’s glove was pricked from the outside, when he shook hands with the real cactus. Meanwhile the real one is getting away…', 'Мимо! Лимонад — тоже 95% воды, а перчатку Лорда прокололи снаружи, когда он пожал руку настоящему кактусу. А настоящий тем временем уезжает…', 'Garām! Limonāde arī ir 95% ūdens, un Lorda cimdu sadūra no ārpuses, kad viņš paspieda roku īstajam kaktusam. Bet īstais tikmēr aizbrauc…'] },
    baron: { name: W2.baron.name,
      text: ['Smokes a pipe and keeps away from the fountain. Sat at the table with the mortgage folder.', 'Курит трубку и обходит фонтан стороной. Сидел за столиком с папкой закладной.', 'Smēķē pīpi un apiet strūklaku. Sēdēja pie galdiņa ar hipotēkas mapi.'],
      verdict: ['Wrong! The Baron drank two jugs of water, the bill proves it, and he only avoids the fountain to keep his pipe lit. Meanwhile the real one is getting away…', 'Мимо! Барон выпил два кувшина воды — счёт это подтверждает, — а фонтан обходит, только чтобы не погасла трубка. А настоящий тем временем уезжает…', 'Garām! Barons izdzēra divas krūkas ūdens — rēķins to apliecina —, un strūklaku apiet tikai tāpēc, lai nenodzistu pīpe. Bet īstais tikmēr aizbrauc…'] },
    cap: { name: ['Vasya Flatcap, boss of the Flatcaps', 'Вася Кепка, главарь Кепок', 'Vasja Cepure, Cepuru bandas boss'],
      text: ['The gang from Cucumber Street: caps, waistcoats, heavy boots. Loud and pushy, always hanging around parties.', 'Банда с Огуречной улицы: кепки, жилеты, тяжёлые ботинки. Шумные, толкаются, вечно трутся на вечеринках.', 'Banda no Gurķu ielas: cepures, vestes, smagi zābaki. Skaļi, grūstās, vienmēr grozās ballītēs.'],
      verdict: ['Wrong! The Flatcaps stood by the wall all evening, loudly drinking water straight from buckets. Noisy, but not prickly in the least. Meanwhile the real one is getting away…', 'Мимо! Кепки весь вечер стояли у стены и шумно пили воду прямо из вёдер. Громкие, но ни капли не колючие. А настоящий тем временем уезжает…', 'Garām! Cepures visu vakaru stāvēja pie sienas un skaļi dzēra ūdeni tieši no spaiņiem. Trokšņaini, bet nemaz ne dzeloņaini. Bet īstais tikmēr aizbrauc…'] },
  };
  // зоны на картинке места происшествия (проценты от размера картинки): улика, допрос или просто реплика
  const SCENE2 = { img: '/images/rooms/case2-scene.jpg', zones: [
    { clue: 'news', x: 88.5, y: 33, w: 11, h: 10 },
    { clue: 'bill', x: 63, y: 21, w: 20, h: 17 },
    { clue: 'badge', x: 47.5, y: 40, w: 11, h: 40 },
    { clue: 'glove', x: 42.5, y: 82, w: 6, h: 7, spark: true },
    { clue: 'needle', x: 63, y: 90, w: 6, h: 7, spark: true },
    { wit: 'sir', x: 62, y: 42, w: 10, h: 48 },
    { wit: 'baron', x: 73, y: 42, w: 10, h: 48 },
    { wit: 'lord', x: 83.5, y: 45, w: 10, h: 45 },
    { say: ['Flatcaps: “We saw nothing! Well… we saw the bloke in the trench coat open an umbrella in the rain. Weird bloke.”', 'Кепки: «Мы ничего не видели! Ну… видели, как тип в плаще раскрыл зонтик под дождём. Странный тип».', 'Cepures: “Mēs neko neredzējām! Nu… redzējām, kā tips mētelī lietū atvēra lietussargu. Dīvains tips.”'], x: 8, y: 42, w: 36, h: 44 },
  ] };
  const CASE2 = { no: 2, key: 'pp-titos-cucumber-case', C: C2, ORDER: ['news', 'badge', 'glove', 'needle', 'bill', 'w_sir', 'w_baron', 'w_lord'], S: S2, W: W2, scene: SCENE2, culprit: 'agent',
    title: ['Spy among the cucumbers', 'Шпион среди огурцов', 'Spiegs starp gurķiem'],
    label: ['Case: spy among the cucumbers', 'Дело: шпион среди огурцов', 'Lieta: spiegs starp gurķiem'],
    accuse: ['Who is the cactus from the Prickly gang?', 'Кто кактус из банды Колючих?', 'Kurš ir kaktuss no Dzeloņaino bandas?'],
    intro: ['New case. At the Cucumber Party by the Green Grocer, valuable papers, a house mortgage and a beautiful Tomato have vanished. They say a repeat offender of the Prickly gang is hiding there: a cactus pretending to be a cucumber. The photo from the scene is in the folders. Question the three gentlemen and find all eight clues.',
            'Новое дело. На Огуречной тусовке у лавки Green Grocer пропали ценные бумаги, закладная на дом и красивая Помидорка. Говорят, там прячется рецидивист банды Колючих — кактус, который выдаёт себя за огурца. Фото с места — в папках. Допросите трёх джентльменов и найдите все восемь улик.',
            'Jauna lieta. Gurķu ballītē pie Green Grocer pazuduši vērtspapīri, mājas hipotēkas līgums un skaista Tomātiņa. Runā, ka tur slēpjas Dzeloņaino bandas recidīvists — kaktuss, kas uzdodas par gurķi. Foto no notikuma vietas ir mapēs. Nopratini trīs džentlmeņus un atrodi visus astoņus pierādījumus.'],
    bye: ['Case closed. The cucumbers are safe, the Tomato is home. Time for bed, without coffee. Good night!', 'Дело закрыто. Огурцы в безопасности, Помидорка дома. Пора спать — без кофе. Спокойной ночи!', 'Lieta slēgta. Gurķi ir drošībā, Tomātiņa mājās. Laiks gulēt — bez kafijas. Ar labu nakti!'],
    sus: k => P2(k),
    STR: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 6], [2, 7], [3, 5], [4, 6]],
    POS: [[3, 6], [27, 4], [51, 6], [75, 8], [3, 44], [27, 46], [51, 44], [75, 46]],
  };
  // ---------- какое дело открыто ----------
  const CASES = [CASE1, CASE2];
  const load = k => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; } };
  let pick = 0; try { pick = Number(localStorage.getItem('pp-titos-case')) || 0; } catch (e) {}
  if (!CASES.some(c => c.no === pick)) pick = load(CASE1.key).solved ? 2 : 1; // первое раскрыто — сразу второе
  const K = CASES.find(c => c.no === pick), { C, ORDER, S } = K, N = ORDER.length;
  let st = Object.assign({ found: [], pinned: [], analyzed: [], asked: {}, mag: false, dossiers: false, solved: false, tries: 0 }, load(K.key));
  const save = () => { try { localStorage.setItem(K.key, JSON.stringify(st)); } catch (e) {} };
  const ico = id => C[id].emo ? `<b class="q-emo">${C[id].emo}</b>` : `<img src="${C[id].icon}" alt="">`;
  // --- полоска дела над комнатой и карманы под ней
  const bar = document.querySelector('.rm-bar');
  const banner = document.createElement('div'); banner.className = 'q-banner'; bar.insertBefore(banner, bar.firstChild.nextSibling);
  const pockets = document.createElement('div'); pockets.className = 'q-pockets'; (A.pan || box).after(pockets);
  const modal = document.createElement('div'); modal.className = 'q-modal'; modal.hidden = true; box.appendChild(modal);
  const draw = () => {
    const mz = box.querySelector('.rm-hot[data-k="magnifier"]'); if (mz) mz.classList.toggle('q-want', !st.mag && !st.solved);
    banner.innerHTML = `<nav class="q-tabs">${CASES.map(c => `<button type="button" data-case="${c.no}" class="${c.no === K.no ? 'on' : ''}">${t(UI.caseNo)} ${c.no} · ${esc(t(c.title))}${load(c.key).solved ? ' ✅' : ''}</button>`).join('')}</nav>` +
      (st.solved ? `<span class="q-stat">✅ ${t(UI.solvedT)}</span><button type="button" data-q="again">${t(UI.again)}</button>`
      : `<span class="q-stat">${t(UI.clues)}: ${st.pinned.length}/${N}</span>${K.scene ? `<button type="button" data-q="scene">${t(UI.scene)}</button>` : ''}<button type="button" data-q="board">${t(UI.board)}</button>`);
    pockets.innerHTML = `<span>${t(UI.inv)}:</span>` + (st.mag ? '<img src="/images/rooms/prop-mag.png" alt="" title="🔍">' : '') +
      st.found.filter(id => !st.pinned.includes(id)).map(id => `<button type="button" data-open="${id}" title="${esc(t(C[id].title))}">${ico(id)}${esc(t(C[id].title))}</button>`).join('');
    ORDER.forEach(id => { const sp = sprites[id]; if (sp) sp.hidden = st.pinned.includes(id) || st.solved; });
  };
  const close = () => { modal.hidden = true; };
  const card = (html, wide) => { modal.innerHTML = `<div class="q-card${wide ? ' wide' : ''}">${html}<button type="button" class="q-x" data-q="close">✕</button></div>`; modal.hidden = false; };
  const openClue = id => {
    const c = C[id];
    if (c.kind === 'witness') { openWitness(c.w); return; }
    if (!st.found.includes(id)) { st.found.push(id); save(); }
    const needs = c.kind === 'analyze' && !st.analyzed.includes(id), on = st.pinned.includes(id);
    card(`<p class="q-kick">${c.kind === 'listen' ? '🎙' : c.kind === 'analyze' ? '🔍' : '📄'} ${esc(t(K.label))}</p><h3>${esc(t(c.title))}</h3>
      <div class="q-paper${c.herring ? ' photo' : ''}">${ico(id)}<p>${esc(needs ? t(c.pre || UI.smeared) : t(c.text))}</p></div>
      <div class="q-acts">${needs ? (st.mag ? `<button type="button" data-q="exam" data-id="${id}">${t(UI.exam)}</button>` : `<em>${t(UI.needMag)}</em>`)
        : on ? `<em>${t(UI.pinned)}</em>` : `<button type="button" data-q="pin" data-id="${id}">${t(UI.pin)}</button>`}</div>`);
    draw();
  };
  // допрос свидетеля: вопросы по очереди, ответы остаются на карточке; когда заданы все — показания можно приколоть
  const openWitness = w => {
    const W = K.W[w], id = 'w_' + w, asked = st.asked[w] || [], all = asked.length >= W.qa.length, on = st.pinned.includes(id);
    if (asked.length && !st.found.includes(id)) { st.found.push(id); save(); }
    card(`<p class="q-kick">${t(UI.ask)} · ${esc(t(K.label))}</p>
      <div class="q-wit"><img src="${W.img}" alt=""><h3>${esc(t(W.name))}</h3></div>
      <div class="q-qa">${W.qa.map(([q, a], i) => asked.includes(i) ? `<p class="q-q">— ${esc(t(q))}</p><p class="q-a">${esc(t(a))}</p>` : `<button type="button" data-ask="${w}" data-i="${i}">— ${esc(t(q))}</button>`).join('')}</div>
      <div class="q-acts">${on ? `<em>${t(UI.pinned)}</em>` : all ? `<button type="button" data-q="pin" data-id="${id}">${t(UI.pinW)}</button>` : `<em>${t(UI.askAll)}</em>`}</div>`);
    draw();
  };
  // место происшествия: картинка с кликабельными людьми и вещами
  const openScene = (msg) => {
    const z = K.scene.zones.map((z, i) => {
      const done = z.clue ? st.pinned.includes(z.clue) : z.wit ? st.pinned.includes('w_' + z.wit) : false;
      const label = z.clue ? t(C[z.clue].title) : z.wit ? t(K.W[z.wit].name) : '';
      return `<button type="button" class="q-zone${z.spark && !st.found.includes(z.clue) ? ' spark' : ''}${done ? ' done' : ''}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%" data-zone="${i}" aria-label="${esc(label || '…')}"${label ? ` title="${esc(label)}"` : ''}></button>`;
    }).join('');
    card(`<p class="q-kick">${t(UI.scene)} · ${esc(t(K.label))}</p><p class="q-hint">${t(UI.sceneHint)} <span class="q-m">${t(UI.sceneSwipe)}</span></p>
      <div class="q-scene"><img src="${K.scene.img}" alt="${esc(t(K.title))}">${z}</div>${msg ? `<p class="q-say">${esc(msg)}</p>` : ''}`, true);
  };
  const openBoard = () => {
    const pos = K.POS;
    const lines = K.STR.filter(([a, b]) => st.pinned.includes(ORDER[a]) && st.pinned.includes(ORDER[b]))
      .map(([a, b]) => `<line x1="${pos[a][0] + 10}" y1="${pos[a][1] + 7}" x2="${pos[b][0] + 10}" y2="${pos[b][1] + 7}"/>`).join('');
    const slots = ORDER.map((id, i) => st.pinned.includes(id)
      ? `<button type="button" class="q-slot on" style="left:${pos[i][0]}%;top:${pos[i][1]}%" data-open="${id}"><i></i>${ico(id)}${esc(t(C[id].title))}</button>`
      : `<span class="q-slot" style="left:${pos[i][0]}%;top:${pos[i][1]}%">?</span>`).join('');
    const sus = st.dossiers ? `<div class="q-sus"><p>${t(K.accuse)}</p>${Object.entries(S).map(([k, s]) => `<button type="button" data-acc="${k}"${st.pinned.length < N ? ' disabled' : ''}><img src="${K.sus(k)}" alt="">${esc(t(s.name))}</button>`).join('')}${st.pinned.length < N ? `<em>${t(UI.needAll)(N)}</em>` : ''}</div>`
      : `<div class="q-sus"><em>${t(UI.noDoss)}</em></div>`;
    card(`<h3>${t(UI.board)}</h3><div class="q-cork${N > 7 ? ' tall' : ''}"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>${slots}</div>${sus}`);
  };
  const openDossiers = () => {
    st.dossiers = true; save();
    card(`<p class="q-kick">🗂 ${t(UI.suspects)}</p><div class="q-doss">${Object.entries(S).map(([k, s]) => `<article><img src="${K.sus(k)}" alt=""><h4>${esc(t(s.name))}</h4><p>${esc(t(s.text))}</p></article>`).join('')}</div>`);
  };
  const solve = (k) => {
    const s = S[k];
    if (k !== K.culprit) {
      st.tries++; save(); card(`<h3>❌</h3><p class="q-verdict">${esc(t(s.verdict))}</p>`);
      A.coffee.sip && setTimeout(() => A.coffee.sip(true), 900); return;
    }
    st.solved = true; save(); A.coffee.on = false; draw();
    card(`<div class="q-stamp">${t(UI.solvedT)}</div><p class="q-verdict">${esc(t(s.verdict))}</p>`);
    goHome();
  };
  const goHome = () => {
    const h = A.hero; if (!h) return;
    h.classList.remove('jitter');
    setTimeout(() => { close(); A.sayAt(t(K.bye), 30, 40, 4000); }, 2600);
    setTimeout(() => { h.classList.add('q-walk'); A.setEvening(true); box.classList.add('q-lightsout'); }, 6000);
  };
  // спрайты улик, которых нет в фоне (только у первого дела)
  const sprites = {};
  ORDER.forEach(id => {
    const sp = C[id].sprite; if (!sp) return;
    const [src, x, y, w] = sp, b = document.createElement('button'); b.type = 'button'; b.className = 'q-clue';
    b.style.left = pct(x / R.w * 100); b.style.top = pct(y / R.h * 100); b.style.width = pct(w / R.w * 100);
    b.innerHTML = `<img src="/images/rooms/${src}.png" alt="${esc(t(C[id].title))}">`; b.addEventListener('click', () => openClue(id));
    box.appendChild(b); sprites[id] = b;
  });
  const HOTS = {}; ORDER.forEach(id => { if (C[id].hot) HOTS[C[id].hot] = id; });
  A.hook = k => {
    if (st.solved) return false;
    if (HOTS[k]) { openClue(HOTS[k]); return true; }
    if (k === 'magnifier') { if (!st.mag) { st.mag = true; save(); draw(); } A.sayAt(t(UI.magGot), 34, 46); return true; }
    if (k === 'folderdrawer' || k.startsWith('drawer#')) { openDossiers(); return true; }
    if (K.scene && k === 'folders') { openScene(); return true; } // во втором деле в папках — фото с места
    if (k === 'board' || k.startsWith('photo#') || k === 'clue') { openBoard(); return true; }
    return false;
  };
  const click = e => {
    const q = e.target.closest('[data-q]'), o = e.target.closest('[data-open]'), a = e.target.closest('[data-acc]'), cs = e.target.closest('[data-case]');
    const zn = e.target.closest('[data-zone]'), ask = e.target.closest('[data-ask]');
    if (cs) { if (Number(cs.dataset.case) !== K.no) { try { localStorage.setItem('pp-titos-case', cs.dataset.case); } catch (x) {} location.reload(); } return; }
    if (zn) { const z = K.scene.zones[zn.dataset.zone]; if (z.clue) openClue(z.clue); else if (z.wit) openWitness(z.wit); else openScene(t(z.say)); return; }
    if (ask) { const w = ask.dataset.ask, list = st.asked[w] || (st.asked[w] = []); if (!list.includes(+ask.dataset.i)) list.push(+ask.dataset.i); save(); openWitness(w); return; }
    if (o) { openClue(o.dataset.open); return; }
    if (a && !a.disabled) { solve(a.dataset.acc); return; }
    if (!q) return;
    const id = q.dataset.id;
    if (q.dataset.q === 'close') close();
    if (q.dataset.q === 'board') openBoard();
    if (q.dataset.q === 'scene') openScene();
    if (q.dataset.q === 'exam') { st.analyzed.push(id); save(); openClue(id); }
    if (q.dataset.q === 'pin') { if (!st.pinned.includes(id)) st.pinned.push(id); if (!st.found.includes(id)) st.found.push(id); save(); draw(); openBoard(); }
    if (q.dataset.q === 'again') { localStorage.removeItem(K.key); location.reload(); }
  };
  [modal, banner, pockets].forEach(el => el.addEventListener('click', click));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  if (st.solved) { A.coffee.on = false; A.hero && A.hero.classList.add('q-gone'); box.classList.add('q-lightsout'); }
  else setTimeout(() => A.sayAt(t(K.intro), 30, 40, 9000), 1200);
  draw();
})();
