# Не-существительные A1–A2 (букмол) для второго PDF. Строка: "тип|слово|перевод|картинка"
# Типы: v глагол (без å), a прилагательное, b наречие, pr предлог, p местоимение, q вопрос, k союз,
#       n число, f фраза, w слово (дни, месяцы и пр.)
# Картинка: эмодзи (1–3 шт.), "t:текст" — надпись от руки, "s:сцена" — кот и коробка (предлоги)
TOPICS = [
("Hilsener og fraser", "Приветствия и фразы", """
f|hei|привет|👋
f|hallo|алло, привет|📞
f|god morgen|доброе утро|🌄
f|god dag|добрый день|☀️
f|god kveld|добрый вечер|🌆
f|god natt|спокойной ночи|🌙
f|ha det|пока|🙋
f|ha det bra|всего хорошего|👋
f|vi ses|увидимся|👀
f|velkommen|добро пожаловать|🤗
f|takk|спасибо|🙏
f|tusen takk|большое спасибо|💐
f|takk for maten|спасибо за еду|🍽️
f|vær så god|пожалуйста (вот, держи)|🎁
f|vær så snill|пожалуйста (прошу)|🥺
f|unnskyld|извините|🙇
f|beklager|простите, сожалею|😔
f|ingen årsak|не за что|🙂
f|ja|да|👍
f|nei|нет|👎
f|kanskje|может быть|🤷
f|ok|хорошо, ладно|👌
f|selvfølgelig|конечно|💯
f|gratulerer|поздравляю|🎉
f|gratulerer med dagen|с днём рождения|🎂
f|god jul|с Рождеством|🎄
f|godt nytt år|с Новым годом|🎆
f|god tur|хорошей поездки|🧳
f|god bedring|выздоравливай|🤒
f|lykke til|удачи|🍀
f|skål|за здоровье! (тост)|🥂
f|kos deg|наслаждайся, отдыхай|☕
f|hvordan går det|как дела?|🙂
f|bare bra|хорошо (всё в порядке)|😊
f|jeg heter …|меня зовут …|📛
f|jeg forstår ikke|я не понимаю|🤔
f|kan du gjenta|можешь повторить?|🔁
f|snakker du engelsk|ты говоришь по-английски?|🇬🇧
f|hva koster det|сколько это стоит?|🏷️
f|hjelp|помогите!|🆘
"""),
("Spørreord", "Вопросительные слова", """
q|hva|что|❓
q|hvem|кто|🕵️
q|hvor|где, куда|📍
q|hvor fra|откуда|🧭
q|når|когда|⏰
q|hvorfor|почему|🤔
q|hvordan|как|🔧
q|hvilken|какой, который|👉
q|hvor mye|сколько (чего-то)|⚖️
q|hvor mange|сколько (штук)|🔢
q|hvor gammel|сколько лет|🎂
q|hva slags|какого рода|🗂️
"""),
("Pronomen", "Местоимения", """
p|jeg|я|🙋
p|du|ты|👉
p|han|он|👨
p|hun|она|👩
p|den|он, она (о вещи en/ei)|📦
p|det|оно, это|🍎
p|vi|мы|👨‍👩‍👧
p|dere|вы|👥
p|de|они|🧑‍🤝‍🧑
p|meg|меня, мне|🫵
p|deg|тебя, тебе|👉
p|ham|его, ему|👨
p|henne|её, ей|👩
p|oss|нас, нам|👪
p|dem|их, им|👥
p|seg|себя|🪞
p|min|мой|🏠
p|din|твой|🎁
p|hans|его (чей)|🎩
p|hennes|её (чей)|👜
p|vår|наш|🏡
p|deres|ваш, их|🏘️
p|sin|свой|🔑
p|denne|этот|👇
p|den der|тот|👉
p|alle|все|🌍
p|noen|кто-то, некоторые|👤
p|ingen|никто|🚫
p|alt|всё|♾️
p|ingenting|ничего|🕳️
p|noe|что-то|❔
p|hver|каждый|✔️
p|annen|другой|🔄
p|selv|сам|💪
"""),
("Tall", "Числа", """
n|null|ноль|t:0
n|en|один|t:1
n|to|два|t:2
n|tre|три|t:3
n|fire|четыре|t:4
n|fem|пять|t:5
n|seks|шесть|t:6
n|sju|семь|t:7
n|åtte|восемь|t:8
n|ni|девять|t:9
n|ti|десять|t:10
n|elleve|одиннадцать|t:11
n|tolv|двенадцать|t:12
n|tretten|тринадцать|t:13
n|fjorten|четырнадцать|t:14
n|femten|пятнадцать|t:15
n|seksten|шестнадцать|t:16
n|sytten|семнадцать|t:17
n|atten|восемнадцать|t:18
n|nitten|девятнадцать|t:19
n|tjue|двадцать|t:20
n|tjueen|двадцать один|t:21
n|tretti|тридцать|t:30
n|førti|сорок|t:40
n|femti|пятьдесят|t:50
n|seksti|шестьдесят|t:60
n|sytti|семьдесят|t:70
n|åtti|восемьдесят|t:80
n|nitti|девяносто|t:90
n|hundre|сто|t:100
n|tusen|тысяча|t:1000
n|en million|миллион|t:1 000 000
n|halv|половина|t:½
n|kvart|четверть|t:¼
n|første|первый|t:1.
n|andre|второй|t:2.
n|tredje|третий|t:3.
n|fjerde|четвёртый|t:4.
n|femte|пятый|t:5.
n|sjette|шестой|t:6.
n|sjuende|седьмой|t:7.
n|åttende|восьмой|t:8.
n|niende|девятый|t:9.
n|tiende|десятый|t:10.
n|tjuende|двадцатый|t:20.
n|siste|последний|🏁
"""),
("Klokka", "Который час", """
f|hva er klokka|который час?|🕰️
f|klokka er tre|сейчас три часа|🕒
f|halv fire|половина четвёртого (3:30)|🕞
f|kvart over tre|четверть четвёртого (3:15)|t:3:15
f|kvart på fire|без четверти четыре (3:45)|t:3:45
f|ti over tre|десять минут четвёртого|t:3:10
f|fem på halv fire|3:25|t:3:25
b|presis|ровно|🎯
"""),
("Ukedager og måneder", "Дни недели и месяцы", """
w|mandag|понедельник|t:Пн
w|tirsdag|вторник|t:Вт
w|onsdag|среда|t:Ср
w|torsdag|четверг|t:Чт
w|fredag|пятница|t:Пт
w|lørdag|суббота|t:Сб
w|søndag|воскресенье|t:Вс
w|januar|январь|⛄
w|februar|февраль|💘
w|mars|март|🌱
w|april|апрель|🌷
w|mai|май|🇳🇴
w|juni|июнь|🍓
w|juli|июль|🏖️
w|august|август|🌻
w|september|сентябрь|🎒
w|oktober|октябрь|🍂
w|november|ноябрь|🌧️
w|desember|декабрь|🎄
"""),
("Tid", "Время: когда и как часто", """
b|nå|сейчас|⏱️
b|i dag|сегодня|📍
b|i morgen|завтра|➡️
b|i går|вчера|⬅️
b|i overmorgen|послезавтра|⏩
b|i forgårs|позавчера|⏪
b|i kveld|сегодня вечером|🌆
b|i natt|сегодня ночью|🌃
b|i morges|сегодня утром (прошло)|🌄
b|snart|скоро|⏳
b|senere|позже|🔜
b|tidlig|рано|🐓
b|sent|поздно|🦉
b|før|раньше, до|⏮️
b|etterpå|потом, после|⏭️
b|først|сначала|🥇
b|så|потом, затем|👣
b|til slutt|в конце|🏁
b|allerede|уже|✅
b|ennå|ещё (до сих пор)|⌛
b|fortsatt|всё ещё|🔁
b|igjen|снова|🔂
b|alltid|всегда|♾️
b|ofte|часто|🔄
b|vanligvis|обычно|📆
b|noen ganger|иногда|🎲
b|sjelden|редко|🌠
b|aldri|никогда|🚫
b|hver dag|каждый день|📅
b|lenge|долго|🐢
b|plutselig|вдруг|⚡
b|endelig|наконец|🎉
b|med en gang|сразу|💨
"""),
("Farger", "Цвета", """
a|rød|красный|🟥
a|oransje|оранжевый|🟧
a|gul|жёлтый|🟨
a|grønn|зелёный|🟩
a|blå|синий|🟦
a|lilla|фиолетовый|🟪
a|rosa|розовый|🌸
a|brun|коричневый|🟫
a|svart|чёрный|⬛
a|hvit|белый|⬜
a|grå|серый|🐘
a|lys|светлый|🔆
a|mørk|тёмный|🌑
a|fargerik|разноцветный|🌈
a|gull|золотой|🥇
a|sølv|серебряный|🥈
"""),
("Hvor? Preposisjoner", "Где? Предлоги места", """
pr|på|на|s:on
pr|under|под|s:under
pr|over|над|s:over
pr|i|в|s:in
pr|ved siden av|рядом с|s:beside
pr|bak|за, позади|s:behind
pr|foran|перед|s:front
pr|mellom|между|s:between
pr|rundt|вокруг|s:around
pr|utenfor|снаружи, за пределами|s:outside
pr|ved|у, возле|🏠🌊
pr|hos|у (кого-то дома)|👵🏠
pr|blant|среди|🐑🐺🐑
pr|langs|вдоль|🛤️
pr|gjennom|через, сквозь|🚇
pr|over (broen)|через (мост)|🌉
"""),
("Hvor hen? Preposisjoner", "Куда? Откуда? С чем?", """
pr|til|к, в (куда)|➡️🏠
pr|fra|из, от|🏠➡️
pr|mot|к, против|➡️🎯
pr|med|с|☕🥛
pr|uten|без|☕🚫
pr|for|для|🎁
pr|av|из (материала), от|🧶🧣
pr|om|о, про|💬
pr|etter|после, за|🐕🐈
pr|før|до, перед (во времени)|⏮️
pr|siden|с (какого-то времени)|⏳
pr|fram til|до (какого-то момента)|🏁
pr|per|в (за каждый)|t:/
b|hit|сюда|👇
b|dit|туда|👉
b|her|здесь|📍
b|der|там|🗺️
b|inn|внутрь|🚪⬅️
b|ut|наружу|🚪➡️
b|inne|внутри|🏠
b|ute|на улице, снаружи|🌳
b|opp|вверх|⬆️
b|ned|вниз|⬇️
b|oppe|наверху|🔝
b|nede|внизу|🔽
b|hjem|домой|🏃🏠
b|hjemme|дома|🛋️
b|borte|далеко, нет на месте|🫥
b|overalt|везде|🌍
b|langt|далеко|🔭
b|nær|близко|🤏
b|til venstre|налево|⬅️
b|til høyre|направо|➡️
b|rett fram|прямо|⬆️
"""),
("Små ord", "Маленькие слова: союзы и частицы", """
k|og|и|➕
k|eller|или|🔀
k|men|но|✋
k|fordi|потому что|💡
k|så|поэтому, так что|➡️
k|at|что (союз)|💬
k|som|который; как|🔗
k|hvis|если|🤞
k|når|когда (союз)|⏰
k|da|когда (в прошлом); тогда|🕰️
k|mens|пока, в то время как|⏳
k|før|прежде чем|⏮️
k|etter at|после того как|⏭️
k|selv om|хотя|🤷
k|enten … eller|либо … либо|🔀
k|både … og|и … и|🤝
b|ikke|не|🚫
b|også|тоже|➕
b|bare|только|☝️
b|kanskje|может быть|🤷
b|nesten|почти|🤏
b|ganske|довольно|👌
b|veldig|очень|💯
b|litt|немного|🤏
b|mye|много (чего-то)|🍝
b|mange|много (штук)|🎈
b|få|мало (штук)|🪶
b|mer|больше|➕
b|mest|больше всего|🏆
b|mindre|меньше|➖
b|for|слишком|‼️
b|nok|достаточно|✋
b|altså|итак, то есть|🧐
b|jo|ведь|😉
b|vel|ну, наверное|🤔
b|sikkert|наверняка|👍
b|heldigvis|к счастью|🍀
b|dessverre|к сожалению|😞
b|gjerne|охотно|😊
b|sammen|вместе|🤝
b|alene|один, в одиночку|🧍
"""),
("Være, ha og andre viktige verb", "Самые важные глаголы", """
v|være|быть|🟰
v|ha|иметь|🤲
v|bli|становиться; оставаться|🐛
v|få|получать|📬
v|gjøre|делать|🛠️
v|kunne|мочь, уметь|💪
v|ville|хотеть|🤩
v|skulle|собираться; должен|📝
v|måtte|быть должным|❗
v|burde|следовало бы|☝️
v|trenge|нуждаться|🆘
v|bruke|использовать|🧰
v|finne|находить|🔍
v|lete|искать|🕵️
v|miste|терять|🧦
v|vise|показывать|👉
v|gi|давать|🎁
v|ta|брать|🫳
v|holde|держать|🤲
v|legge|класть|📥
v|sette|ставить|🍽️
v|hente|забирать, приносить|🐕
v|bringe|приносить|📦
v|sende|отправлять|📤
v|prøve|пробовать|🧪
v|begynne|начинать|🏁
v|slutte|заканчивать, бросать|🛑
v|fortsette|продолжать|⏩
v|vente|ждать|⏳
v|skje|происходить|💥
v|bety|значить|📖
v|hete|называться, зваться|📛
v|eie|владеть|🔑
"""),
("Hverdagen", "Повседневная жизнь", """
v|våkne|просыпаться|⏰
v|stå opp|вставать|🛏️
v|dusje|принимать душ|🚿
v|vaske seg|умываться|🧼
v|pusse tennene|чистить зубы|🪥
v|kle på seg|одеваться|👕
v|spise frokost|завтракать|🥣
v|gå på jobb|идти на работу|💼
v|komme hjem|приходить домой|🏠
v|lage mat|готовить еду|🧑‍🍳
v|vaske opp|мыть посуду|🍽️
v|rydde|убирать|🧹
v|vaske|мыть, стирать|🫧
v|støvsuge|пылесосить|🌀
v|handle|делать покупки|🛒
v|hvile|отдыхать|🛋️
v|slappe av|расслабляться|🧘
v|legge seg|ложиться спать|🛌
v|sove|спать|😴
v|drømme|мечтать, видеть сон|💭
v|bo|жить (где-то)|🏡
v|leve|жить (быть живым)|🌱
v|flytte|переезжать|📦
v|åpne|открывать|📭
v|lukke|закрывать|🚪
v|låse|запирать|🔒
v|slå på|включать|💡
v|slå av|выключать|🔌
v|bruke tid|тратить время|⌛
a|travel|занятой|🏃
a|ledig|свободный|🟢
a|opptatt|занятый|🔴
a|ferdig|готовый, закончивший|✅
a|klar|готовый (к чему-то)|🚀
a|ren|чистый|✨
a|skitten|грязный|🐷
a|ryddig|аккуратный, прибранный|📐
a|rotete|неубранный|🌪️
a|hjemmekoselig|уютный|🕯️
a|koselig|уютный, приятный|☕
"""),
("Mat og drikke", "Еда и напитки", """
v|spise|есть|🍽️
v|drikke|пить|🥤
v|smake|пробовать на вкус|👅
v|lage|делать, готовить|🥘
v|koke|варить, кипятить|♨️
v|steke|жарить|🍳
v|bake|печь|🧁
v|skjære|резать|🔪
v|blande|смешивать|🥄
v|helle|наливать|🫗
v|bestille|заказывать|📋
v|betale|платить|💳
v|dekke bordet|накрывать на стол|🍴
v|ha lyst på|хотеть (чего-то)|🤤
a|sulten|голодный|😋
a|tørst|жаждущий пить|🥵
a|mett|сытый|😌
a|god|вкусный; хороший|😋
a|deilig|восхитительный|🤤
a|søt|сладкий; милый|🍬
a|sur|кислый|🍋
a|salt|солёный|🧂
a|bitter|горький|☕
a|sterk|острый; крепкий|🌶️
a|fersk|свежий|🥬
a|kokt|варёный|🥚
a|stekt|жареный|🍳
a|rå|сырой|🥩
a|varm|горячий, тёплый|🔥
a|kald|холодный|🧊
a|lunken|тёплый (едва)|🍵
a|vegetarisk|вегетарианский|🥗
a|sunn|полезный|🥦
a|usunn|вредный|🍟
"""),
("Bevegelse og reise", "Движение и поездки", """
v|gå|идти|🚶
v|løpe|бежать|🏃
v|springe|бежать, прыгать|🦘
v|hoppe|прыгать|🐸
v|kjøre|ехать, вести машину|🚗
v|sykle|ехать на велосипеде|🚴
v|fly|летать|✈️
v|svømme|плавать|🏊
v|reise|путешествовать|🧳
v|komme|приходить, приезжать|🚶‍➡️
v|dra|уезжать, отправляться|👋
v|ankomme|прибывать|🛬
v|gå av|выходить (из транспорта)|🚏
v|gå på|садиться (в транспорт)|🚌
v|bytte|пересаживаться; менять|🔄
v|rekke|успевать|⏱️
v|komme for sent|опаздывать|🐌
v|møte|встречать|🤝
v|besøke|навещать|🏘️
v|følge|провожать; следовать|👣
v|snu|поворачивать|↩️
v|stoppe|останавливаться|🛑
v|parkere|парковать|🅿️
v|krysse|пересекать|🚸
v|klatre|лазать|🧗
v|falle|падать|🍂
v|sitte|сидеть|🪑
v|stå|стоять|🧍
v|ligge|лежать|🛌
v|sette seg|садиться|💺
v|legge seg ned|ложиться|🛏️
a|rask|быстрый|🐆
a|langsom|медленный|🐢
a|nær|близкий|🤏
a|fjern|далёкий|🔭
a|direkte|прямой|➡️
a|forsinket|опоздавший, задержанный|⏰
b|fort|быстро|💨
b|sakte|медленно|🐌
b|til fots|пешком|👣
b|med buss|на автобусе|🚌
"""),
("Snakke og tenke", "Говорить и думать", """
v|si|сказать|💬
v|snakke|говорить|🗣️
v|prate|болтать|💭
v|fortelle|рассказывать|📖
v|spørre|спрашивать|❓
v|svare|отвечать|❗
v|ringe|звонить|📞
v|skrive|писать|✍️
v|lese|читать|📖
v|høre|слышать|👂
v|lytte|слушать|🎧
v|se|видеть|👀
v|se på|смотреть на|📺
v|forstå|понимать|💡
v|forklare|объяснять|🧑‍🏫
v|oversette|переводить|🔤
v|uttale|произносить|👄
v|stave|произносить по буквам|🔠
v|gjenta|повторять|🔁
v|rope|кричать|📢
v|hviske|шептать|🤫
v|tenke|думать|🤔
v|tro|верить, думать|🙏
v|synes|считать (мнение)|💭
v|mene|иметь в виду; считать|☝️
v|vite|знать (факт)|🧠
v|kjenne|знать (кого-то)|🤝
v|huske|помнить|🗃️
v|glemme|забывать|🫥
v|lære|учить(ся)|📚
v|studere|изучать|🎓
v|øve|упражняться|🏋️
v|undervise|преподавать|🧑‍🏫
v|bestemme|решать|⚖️
v|velge|выбирать|☑️
v|planlegge|планировать|🗓️
v|lure på|интересоваться, гадать|🤨
v|takke|благодарить|🙏
v|hilse|здороваться|👋
v|invitere|приглашать|💌
v|be om|просить|🥺
v|love|обещать|🤞
v|lyve|врать|🤥
v|krangle|ссориться|😤
a|enig|согласный|🤝
a|uenig|несогласный|🙅
a|sikker|уверенный|👍
a|usikker|неуверенный|🤷
a|riktig|правильный|✅
a|feil|неправильный|❌
a|lett|лёгкий (не трудный)|🪶
a|vanskelig|трудный|🧗
a|enkel|простой|1️⃣
a|viktig|важный|❗
a|interessant|интересный|🧐
a|kjedelig|скучный|🥱
a|morsom|смешной, весёлый|😂
a|rar|странный|🤪
a|klok|умный, мудрый|🦉
a|smart|умный|🧠
a|dum|глупый|🙃
"""),
("Følelser", "Чувства и характер", """
v|elske|любить|❤️
v|like|нравиться|👍
v|hate|ненавидеть|💢
v|savne|скучать|🥺
v|le|смеяться|😂
v|smile|улыбаться|😊
v|gråte|плакать|😭
v|håpe|надеяться|🤞
v|glede seg|радоваться (будущему)|🤩
v|bekymre seg|волноваться|😟
v|kjede seg|скучать (нечем заняться)|🥱
v|bli sint|рассердиться|😠
v|bli redd|испугаться|😱
v|trøste|утешать|🫂
v|klemme|обнимать|🤗
v|kysse|целовать|💋
v|stole på|доверять|🤝
v|ønske|желать|🌠
a|glad|радостный|😀
a|lykkelig|счастливый|🥰
a|trist|грустный|😢
a|lei seg|огорчённый|😞
a|sint|сердитый|😠
a|redd|испуганный|😨
a|nervøs|нервный|😬
a|rolig|спокойный|😌
a|sliten|уставший|😩
a|trøtt|сонный|😪
a|overrasket|удивлённый|😮
a|stolt|гордый|🦚
a|forelsket|влюблённый|😍
a|sjalu|ревнивый|😒
a|flau|смущённый|😳
a|sjenert|застенчивый|🙈
a|modig|смелый|🦁
a|snill|добрый|😇
a|slem|злой, вредный|😈
a|hyggelig|приятный, милый|🙂
a|vennlig|дружелюбный|🤗
a|ærlig|честный|🙌
a|flink|способный, молодец|🌟
a|lat|ленивый|🦥
a|flittig|старательный|🐝
a|nysgjerrig|любопытный|🧐
a|tålmodig|терпеливый|🧘
a|sur|сердитый, недовольный|😤
a|fornøyd|довольный|😌
a|skuffet|разочарованный|😞
a|ensom|одинокий|🧍
a|heldig|везучий|🍀
"""),
("Hvordan ser det ut?", "Описание: какой?", """
a|stor|большой|🐘
a|liten|маленький|🐭
a|høy|высокий|🦒
a|lav|низкий|🐕
a|lang|длинный|🐍
a|kort|короткий|📏
a|tykk|толстый|🐷
a|tynn|тонкий, худой|🥢
a|bred|широкий|↔️
a|smal|узкий|↕️
a|tung|тяжёлый|🏋️
a|lett|лёгкий (по весу)|🎈
a|gammel|старый|👴
a|ung|молодой|👶
a|ny|новый|🆕
a|pen|красивый|🌹
a|vakker|прекрасный|🌅
a|søt|милый|🐱
a|stygg|некрасивый|👹
a|sterk|сильный|💪
a|svak|слабый|🥀
a|rund|круглый|⚪
a|firkantet|квадратный|🟦
a|flat|плоский|🥞
a|spiss|острый (конец)|📌
a|skarp|острый (нож)|🔪
a|myk|мягкий|🧸
a|hard|твёрдый|🪨
a|glatt|гладкий; скользкий|🧊
a|våt|мокрый|💦
a|tørr|сухой|🏜️
a|full|полный|🫙
a|tom|пустой|🪹
a|åpen|открытый|🔓
a|stengt|закрытый|🔒
a|ødelagt|сломанный|💔
a|hel|целый|🍏
a|lys|светлый|💡
a|mørk|тёмный|🌑
a|stille|тихий|🤫
a|bråkete|шумный|📢
a|rik|богатый|🤑
a|fattig|бедный|🪹
a|dyr|дорогой|💎
a|billig|дешёвый|🏷️
a|gratis|бесплатный|🆓
a|samme|тот же самый|🟰
a|annerledes|другой, иной|🔀
a|lik|похожий|👯
a|ekte|настоящий|💯
a|farlig|опасный|☠️
a|trygg|безопасный|🛡️
a|berømt|знаменитый|⭐
a|vanlig|обычный|📄
a|spesiell|особенный|✨
a|perfekt|идеальный|👌
a|mulig|возможный|✔️
a|umulig|невозможный|🚫
a|hemmelig|секретный|🤫
"""),
("Kropp og helse", "Тело и здоровье", """
v|lukte|нюхать; пахнуть|👃
v|føle|чувствовать|🫶
v|kjenne|ощущать|✋
v|ta på|трогать|👆
v|puste|дышать|🌬️
v|hoste|кашлять|😷
v|nyse|чихать|🤧
v|ha vondt|болеть (о боли)|🤕
v|skade seg|пораниться|🩹
v|bli frisk|выздороветь|💪
v|trene|тренироваться|🏋️
v|vokse|расти|🌱
v|dø|умирать|🥀
a|syk|больной|🤒
a|frisk|здоровый|💪
a|skadet|раненый|🤕
a|svimmel|с головокружением|😵‍💫
a|blind|слепой|🦯
a|døv|глухой|🧏
a|gravid|беременная|🤰
a|naken|голый|🛀
a|fysisk|физический|🏃
"""),
("Jobb og penger", "Работа и деньги", """
v|jobbe|работать|💼
v|arbeide|работать|👷
v|tjene|зарабатывать|💰
v|kjøpe|покупать|🛍️
v|selge|продавать|🏷️
v|koste|стоить|💵
v|spare|копить|🐷
v|låne|одалживать, брать в долг|🤝
v|bruke penger|тратить деньги|💸
v|søke|искать; подавать заявку|📝
v|ansette|нанимать|🤝
v|si opp|увольнять(ся)|📦
v|ringe til|звонить кому-то|📞
v|sende e-post|отправлять письмо|📧
v|lage|создавать|🛠️
v|bygge|строить|🏗️
v|reparere|чинить|🔧
v|male|красить, рисовать красками|🎨
v|tegne|рисовать|✏️
v|skrive ut|распечатывать|🖨️
v|hjelpe|помогать|🤝
v|samarbeide|сотрудничать|🧩
v|lede|руководить|🧭
v|vinne|выигрывать|🏆
v|tape|проигрывать|😞
a|ansatt|работающий (по найму)|🪪
a|arbeidsledig|безработный|🪑
a|profesjonell|профессиональный|👔
a|praktisk|практичный|🧰
a|nyttig|полезный|🔧
a|effektiv|эффективный|⚡
"""),
("Fritid", "Досуг", """
v|spille|играть (в игру, на инструменте)|🎮
v|leke|играть (о детях)|🧸
v|synge|петь|🎤
v|danse|танцевать|💃
v|gå på ski|кататься на лыжах|⛷️
v|gå tur|гулять|🥾
v|fiske|рыбачить|🎣
v|ta bilder|фотографировать|📷
v|se film|смотреть фильм|🎬
v|høre på musikk|слушать музыку|🎧
v|feire|праздновать|🥳
v|besøke|навещать|🏡
v|kose seg|уютно проводить время|🕯️
v|ha det gøy|веселиться|🎉
v|strikke|вязать|🧶
v|sy|шить|🪡
v|bade|купаться|🏖️
v|sole seg|загорать|😎
v|campe|жить в палатке|⛺
v|plukke|собирать (ягоды, грибы)|🫐
a|gøy|весёлый, прикольный|🤪
a|spennende|захватывающий|🎢
a|avslappende|расслабляющий|🛀
a|populær|популярный|🔥
a|kreativ|творческий|🎨
"""),
("Været", "Погода", """
v|regne|идти (о дожде)|🌧️
v|snø|идти (о снеге)|🌨️
v|blåse|дуть|🌬️
v|skinne|светить|☀️
v|fryse|мёрзнуть; замерзать|🥶
v|smelte|таять|🫠
v|tordne|греметь (о громе)|⛈️
a|varm|тёплый, жаркий|🥵
a|kald|холодный|🥶
a|kjølig|прохладный|🍃
a|mild|мягкий (о погоде)|🌤️
a|solrik|солнечный|☀️
a|overskyet|облачный|☁️
a|tåkete|туманный|🌫️
a|vindfull|ветреный|💨
a|regnfull|дождливый|☔
a|pent|хороший (о погоде)|🌈
a|stygt|плохой (о погоде)|🌧️
a|glatt|скользкий|🧊
b|ute|на улице|🌳
"""),
("Hvordan? Adverb", "Как? Наречия", """
b|godt|хорошо|👍
b|bra|хорошо|👌
b|dårlig|плохо|👎
b|riktig|правильно|✅
b|feil|неправильно|❌
b|høyt|громко; высоко|📢
b|lavt|тихо (негромко)|🔉
b|stille|тихо|🤫
b|forsiktig|осторожно|⚠️
b|nøye|тщательно|🔍
b|lett|легко|🪶
b|vanskelig|трудно|🧗
b|sammen|вместе|👫
b|annerledes|по-другому|🔀
b|slik|так, таким образом|👉
b|helt|совсем, полностью|💯
b|nesten|почти|🤏
b|akkurat|как раз, точно|🎯
b|egentlig|на самом деле|🤔
b|faktisk|фактически, вообще-то|📊
b|kanskje|может быть|🤷
b|selvfølgelig|конечно|💯
b|sannsynligvis|вероятно|🎲
b|særlig|особенно|⭐
b|spesielt|особенно|✨
b|omtrent|примерно|〰️
b|ellers|иначе; в остальном|🔁
b|derfor|поэтому|➡️
"""),
]
