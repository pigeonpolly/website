#!/usr/bin/env python3
"""Жители Воббленда из коллекционных карточек (этап 8, для дел Титоса).
Пишет: content/wobbleland.json (cities[].residents[] — после старых жителей), content/i18n/wobbleland.{ru,lv}.json (те же индексы),
content/wobbleland-map.json (chars с "sm": true — фигурки у домов), site/images/wobbleland/ch-<ключ>.png (пиксельный медальон 20×20 из картинки карточки).
Повторный запуск ничего не дублирует: жители с полем card пересобираются заново. Потом — python3 tools/titos_cast.py.
Запуск: python3 tools/wobbleland/residents.py"""
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT = ROOT / "content"
OUT = ROOT / "site" / "images" / "wobbleland"
INK, RING = (26, 21, 40, 255), (255, 246, 228, 255)

# город, улица (ключ из wobbleland-map.json), дом, карточка (коллекция/файл), имя EN / RU / LV, занятие EN / RU / LV, черта EN / RU / LV
R = [
    ("newwobbleton", "seag", "3", "classic/13.jpg", ["Miss Peony", "Мисс Пиони", "Miss Peony"],
     ["Bakery seller", "Продавщица в пекарне", "Maiznīcas pārdevēja"],
     ["Gives buns to anyone who looks sad.", "Отдаёт булочки всем, у кого грустный вид.", "Atdod bulciņas ikvienam, kurš izskatās bēdīgs."]),
    ("newwobbleton", "fall", "6", "autumn-cozy/79.png", ["Professor Owlistair Tweed", "Профессор Совлистер Твид", "Profesors Owlistair Tweed"],
     ["Retired professor", "Профессор на пенсии", "Profesors pensijā"],
     ["Has been reading the same chapter since October and says he is only resting his eyes.", "С октября читает одну и ту же главу и уверяет, что просто даёт глазам отдохнуть.", "Kopš oktobra lasa vienu un to pašu nodaļu un apgalvo, ka tikai atpūtina acis."]),
    ("newwobbleton", "ytom", "8", "classic/14.jpg", ["Mr. Crisper", "Мистер Криспер", "Misters Krispers"],
     ["Keeper of the lost-and-found boxes at the train station", "Хранитель коробок в бюро находок на вокзале", "Atrasto mantu kastu glabātājs stacijā"],
     ["Labels everything and panics when lids get mixed up.", "Подписывает всё подряд и паникует, когда путают крышки.", "Visam uzlīmē etiķetes un krīt panikā, ja sajauc vākus."]),
    ("newwobbleton", "ytom", "9", "classic/15.jpg", ["Milka", "Милка", "Milka"],
     ["Unknown — lives in a box", "Неизвестно — живёт в коробке", "Nezināms — dzīvo kastē"],
     ["Nobody has ever seen more than her tail.", "Никто никогда не видел ничего, кроме её хвоста.", "Neviens nekad nav redzējis neko vairāk par viņas asti."]),
    ("snailhollow", "moss", "10", "classic/17.jpg", ["Mr. Dr. Fisher III", "Мистер Доктор Фишер III", "Misters Dr. Fišers III"],
     ["Doctor of… something (the diploma is unreadable)", "Доктор каких-то наук (диплом не прочесть)", "Kaut kādu zinātņu doktors (diplomu nevar izlasīt)"],
     ["Afraid of his own reflection; gets upset if you forget to call him Doctor.", "Боится своего отражения и обижается, если не назвать его доктором.", "Baidās no sava atspulga un apvainojas, ja viņu nesauc par doktoru."]),
    ("snailhollow", "moss", "7", "halloween-remix/64.png", ["Lady Slugworth", "Леди Слизуорт", "Lēdija Slugworth"],
     ["Society lady, leads the snail parade", "Светская дама, ведёт парад улиток", "Augstākās sabiedrības dāma, vada gliemežu parādi"],
     ["Never arrives on time — she makes an entrance, and expects compliments for her sparkly trail.", "Никогда не приходит вовремя — она появляется. И ждёт комплиментов своему блестящему следу.", "Nekad neierodas laikā — viņa parādās. Un gaida komplimentus savām mirdzošajām pēdām."]),
    ("snailhollow", "slow", "9", "halloween-remix/68.png", ["Toad Mortimer", "Жаб Мортимер", "Krupis Mortimers"],
     ["Retired grim reaper; swapped the scythe for a very large fork", "Мрачный жнец на пенсии; сменил косу на очень большую вилку", "Pensionēts nāves pļāvējs; izkapti nomainīja pret ļoti lielu dakšu"],
     ["Naps, feels guilty, then naps again to recover.", "Дремлет, мучается совестью и снова дремлет, чтобы прийти в себя.", "Nosnaužas, jūtas vainīgs un atkal nosnaužas, lai atgūtos."]),
    ("snailhollow", "slow", "2", "halloween-2025/52.jpg", ["Lord Croakstill", "Лорд Кваксилл", "Lords Croakstill"],
     ["Former leader of the Choir of Tragic Croaks; lives in a manor by the pond", "Бывший руководитель Хора Трагического Кваканья, живёт в усадьбе у пруда", "Bijušais Traģisko kurkstienu kora vadītājs, dzīvo muižā pie dīķa"],
     ["Feels terribly guilty if he rests for more than ten minutes.", "Мучается совестью, если отдыхает дольше десяти минут.", "Jūtas briesmīgi vainīgs, ja atpūšas ilgāk par desmit minūtēm."]),
    ("maplewink", "gsap", "4", "halloween-remix/65.png", ["Buzzby Caramello", "Баззби Карамелло", "Buzzby Caramello"],
     ["Sweet delivery courier", "Курьер, разносит сладости", "Saldumu kurjers"],
     ["Delivers to every door in four minutes, then forgets which street. Panics on the phone.", "Обходит все двери за четыре минуты, а потом забывает, на какой улице был. Паникует от телефонных звонков.", "Apstaigā visas durvis četrās minūtēs un pēc tam aizmirst, kurā ielā bija. Krīt panikā no telefona zvaniem."]),
    ("maplewink", "gsap", "9", "autumn-cozy/78.png", ["Hedgewig Bramble", "Ежевига Брамбл", "Hedgewig Bramble"],
     ["Collects fallen leaves in the park", "Собирает в парке опавшие листья", "Parkā vāc kritušās lapas"],
     ["Sorts her leaves by colour every evening, then naps and feels a little guilty.", "Каждый вечер раскладывает листья по цветам, потом дремлет и немного этого стыдится.", "Katru vakaru šķiro lapas pēc krāsas, pēc tam nosnaužas un mazliet kaunas."]),
    ("maplewink", "gsap", "15", "autumn-cozy/89.png", ["Leafy Lou", "Листик Лу", "Lapiņš Lū"],
     ["Leaf pile for jumping into at the syrup fair", "Куча листьев для прыжков на сиропной ярмарке", "Lapu kaudze lēkšanai sīrupa gadatirgū"],
     ["Very ticklish; storms off in a swirl if anyone tries to rake him.", "Ужасно боится щекотки; если его сгребают граблями, уносится вихрем.", "Ļoti kutīgs; ja viņu mēģina sagrābt ar grābekli, aizvirpuļo prom."]),
    ("maplewink", "gsap", "12", "fall-2025/38.jpg", ["Tim Froggucion", "Тим Фроггуччино", "Tims Froggucion"],
     ["Acorn collector", "Собирает блестящие жёлуди", "Vāc spīdīgas zīles"],
     ["Autumn is his lifestyle; drinks frothy mosquito cappuccino.", "Осень для него — образ жизни; пьёт капучино с комарами.", "Rudens viņam ir dzīvesveids; dzer kapučīno ar odiem."]),
    ("pinecrust", "cris", "5", "autumn-cozy/81.png", ["Barnaby Burrows", "Барнаби Барроуз", "Barnabijs Burrows"],
     ["Baker", "Пекарь", "Maiznieks"],
     ["Talks to his sourdough starter; ask for a slice and he hands you half a loaf.", "Разговаривает со своей закваской; попросишь ломтик — даст полбуханки.", "Runā ar savu ieraugu; palūdz šķēli — iedos pusklaipu."]),
    ("pinecrust", "cone", "4", "autumn-cozy/82.png", ["Nutmeg Hazelton", "Натмег Хейзелтон", "Nutmeg Hazelton"],
     ["Nut supplier for the pie shops", "Поставляет орехи в пирожные лавки", "Piegādā riekstus pīrāgu veikaliem"],
     ["Hides hazelnuts everywhere and forgets half of them — that is how the forest grew.", "Прячет орехи повсюду и забывает половину — так и вырос лес.", "Slēpj riekstus visur un aizmirst pusi — tā izauga mežs."]),
    ("pinecrust", "cone", "12", "autumn-cozy/80.png", ["Rusty Roamwell", "Расти Роумвелл", "Rusty Roamwell"],
     ["Hiking guide", "Проводник в походах", "Pārgājienu gids"],
     ["Holds the map upside down; never gets where he planned, always somewhere better.", "Держит карту вверх ногами; никогда не приходит, куда собирался, но всегда — в место получше.", "Tur karti otrādi; nekad nenonāk tur, kur plānoja, bet vienmēr kaut kur labāk."]),
    ("pinecrust", "cris", "17", "autumn-cozy/87.png", ["Bramwell Bear", "Медведь Брамвелл", "Lācis Bramvels"],
     ["Professional winter sleeper", "Профессионально спит всю зиму", "Profesionāli guļ visu ziemu"],
     ["Note on the door: “Do not wake until spring”. Midnight fridge visits do not count.", "На двери записка: «Не будить до весны». Ночные походы к холодильнику не считаются.", "Uz durvīm zīmīte: “Nemodināt līdz pavasarim”. Nakts gājieni pie ledusskapja neskaitās."]),
    ("lemonvale", "sour", "6", "classic/25.jpg", ["Dr. Panicoli", "Доктор Паниколи", "Dr. Panikoli"],
     ["PhD candidate", "Аспирант", "Doktorants"],
     ["Jumps at every shadow and triple-checks his notes.", "Вздрагивает от каждой тени и трижды перепроверяет записи.", "Satrūkstas no katras ēnas un trīsreiz pārbauda savas piezīmes."]),
    ("lemonvale", "spla", "2", "classic/23.jpg", ["Lady Puddle-Dip", "Леди Лужемак", "Lēdija Puddle-Dip"],
     ["Gourmet", "Гурман", "Gardēde"],
     ["Saves every snack for a rainy day — then dips it in a fresh puddle.", "Припрятывает каждое угощение до дождя — и макает его в свежую лужу.", "Katru kārumu noglabā lietainai dienai — un tad iemērc svaigā peļķē."]),
    ("lemonvale", "spla", "3", "autumn-cozy/83.png", ["Sir Puddlesworth", "Сэр Лужуорт", "Sers Puddlesworth"],
     ["Puddle inspector", "Инспектор луж", "Peļķu inspektors"],
     ["Jumps into the deepest puddle — and shrieks at the duck looking back. Every time.", "Прыгает в самую глубокую лужу — и визжит от утки, которая смотрит оттуда. Каждый раз.", "Ielec dziļākajā peļķē — un iekliedzas, ieraugot pīli, kas skatās pretī. Katru reizi."]),
    ("lemonvale", "zest", "3", "halloween-2025/51.jpg", ["Rowena Ghostclaw", "Ровена Гостклоу", "Rovena Ghostclaw"],
     ["Ghost food critic", "Ресторанный критик-призрак", "Spoku restorānu kritiķe"],
     ["Reviews cookies left on her grave — usually one star out of five.", "Оценивает печенье, оставленное на её могиле, — обычно на одну звезду из пяти.", "Vērtē cepumus, kas atstāti uz viņas kapa, — parasti ar vienu zvaigzni no piecām."]),
    ("buttonspire", "cbtn", "7", "halloween-2025/55.jpg", ["Sew-Sew Patty", "Шью-Шью Пэтти", "Šuj-Šuj Patija"],
     ["Pincushion and seamstress; mends broken hearts", "Игольница и швея; зашивает разбитые сердца", "Adatu spilventiņš un šuvēja; sašuj salauztas sirdis"],
     ["Moody; gossips with the buttons every evening.", "Капризная; каждый вечер сплетничает с пуговицами.", "Kaprīza; katru vakaru tenko ar pogām."]),
    ("buttonspire", "cbtn", "8", "halloween-remix/71.png", ["Spool Ghoul", "Катушка-Ворчушка", "Spole Kurnule"],
     ["Thread keeper, fixes things that come apart", "Хранительница ниток, чинит всё, что расползлось", "Diegu glabātāja, salabo visu, kas izirst"],
     ["Wound too tight in 1893; grumpy but surprisingly helpful.", "Слишком туго намотана с 1893 года; ворчит, но неожиданно помогает.", "Pārāk cieši uztīta kopš 1893. gada; kurn, bet negaidīti palīdz."]),
    ("buttonspire", "thrd", "2", "classic/22.jpg", ["Bobby Bagster", "Бобби Бэгстер", "Bobijs Bagsters"],
     ["Bag connoisseur", "Знаток сумок и пакетов", "Somu un maisiņu zinātājs"],
     ["“Borrows” grocery bags and hides inside gift bags.", "«Одалживает» пакеты с покупками и прячется в подарочных пакетах.", "“Aizņemas” iepirkumu maisiņus un slēpjas dāvanu maisiņos."]),
    ("buttonspire", "cbtn", "12", "autumn-cozy/86.png", ["Mittens Mulligan", "Варежка Маллиган", "Dūrainīte Mulligan"],
     ["Models hand-knitted sweaters", "Позирует в вязаных свитерах", "Pozē adītos džemperos"],
     ["Claims the radiator from October to April. Loves milk; milk does not love her back.", "С октября по апрель занимает батарею. Любит молоко, а молоко её — нет.", "No oktobra līdz aprīlim aizņem radiatoru. Mīl pienu, bet piens viņu — ne."]),
    ("noodleford", "brot", "3", "halloween-remix/67.png", ["Ghostina Gravy", "Гостина Грейви", "Ghostina Gravy"],
     ["Ghost chef", "Повар-призрак", "Spoku pavāre"],
     ["Has been stirring the same Eternal Soup for 200 years — almost ready. Keeps the mirror covered: her reflection steals croutons.", "200 лет помешивает Вечный суп — почти готово. Зеркало завешено: отражение ворует сухарики.", "200 gadus maisa Mūžīgo zupu — gandrīz gatava. Spogulis aizklāts: atspulgs zog grauzdiņus."]),
    ("noodleford", "chop", "5", "classic/24.jpg", ["Sir Pickleknot", "Сэр Пиклнот", "Sers Pickleknot"],
     ["Knot master; ties the noodle lanterns", "Мастер узлов; вяжет лапшичные фонарики", "Mezglu meistars; sien nūdeļu laternas"],
     ["Obsessed with knots and macramé — calls it artistic expression.", "Помешан на узлах и макраме и называет это творчеством.", "Apsēsts ar mezgliem un makramē un sauc to par mākslu."]),
    ("noodleford", "chop", "2", "autumn-cozy/85.png", ["Chestnut Charlie", "Каштан Чарли", "Kastanis Čārlijs"],
     ["Roasted chestnut at the street market", "Жареный каштан на уличном рынке", "Cepts kastanis ielas tirgū"],
     ["Chats with everyone passing by; once you start listening, you need another one.", "Болтает со всеми прохожими; начнёшь слушать — захочется ещё.", "Pļāpā ar katru garāmgājēju; sāksi klausīties — gribēsies vēl."]),
    ("jamshire", "straw", "6", "halloween-2025/49.jpg", ["Candice Creepleton", "Кэндис Криплтон", "Kendisa Creepleton"],
     ["Blogger (Life in the Sugar Lane)", "Блогер («Жизнь на сахарной улице»)", "Blogere (“Dzīve cukura ielā”)"],
     ["Panics whenever a follower actually calls; checks the mirror every evening — sometimes it answers.", "Паникует, когда подписчики правда звонят; каждый вечер проверяет зеркало — иногда оно отвечает.", "Krīt panikā, kad sekotāji tiešām zvana; katru vakaru pārbauda spoguli — dažreiz tas atbild."]),
    ("jamshire", "straw", "10", "halloween-remix/63.png", ["Madame Teabite", "Мадам Тибайт", "Madāma Teabite"],
     ["Tea sommelier", "Чайный сомелье", "Tējas someljē"],
     ["Refuses to serve coffee on principle; judges guests by how they hold the saucer.", "Принципиально не подаёт кофе; судит гостей по тому, как они держат блюдце.", "Principā nepasniedz kafiju; vērtē viesus pēc tā, kā viņi tur apakštasīti."]),
    ("jamshire", "straw", "13", "halloween-remix/66.png", ["Count Hopula", "Граф Прыгула", "Grāfs Hopula"],
     ["Owner of a night carrot-juice bar", "Хозяин ночного бара морковного сока", "Nakts burkānu sulas bāra īpašnieks"],
     ["Drinks carrot juice at midnight sharp; faints from lactose.", "Пьёт морковный сок ровно в полночь; от лактозы падает в обморок.", "Dzer burkānu sulu tieši pusnaktī; no laktozes noģībst."]),
    ("cheddarford", "melt", "9", "halloween-2025/48.jpg", ["Baron von Worms", "Барон фон Вормс", "Barons fon Vormss"],
     ["Owner of a luxurious compost estate", "Владелец роскошного компостного поместья", "Grezna komposta muižas īpašnieks"],
     ["Secretly in love with Miss Pumpkinella, but has not made a move — he has no legs.", "Тайно влюблён в мисс Тыквеллу, но шага не делает — у него нет ног.", "Slepeni iemīlējies Mis Pumpkinellā, bet soli nesper — viņam nav kāju."]),
    ("cheddarford", "chee", "3", "autumn-cozy/88.png", ["Wren Windlow", "Рен Виндлоу", "Rena Windlow"],
     ["Counts raindrops on the windowsill", "Считает капли дождя на подоконнике", "Skaita lietus lāses uz palodzes"],
     ["Never answers the phone during rain: rain is a meeting with herself.", "Никогда не берёт трубку во время дождя: дождь — встреча с собой.", "Lietus laikā nekad neceļ telefonu: lietus ir tikšanās ar sevi."]),
    ("cheddarford", "chee", "7", "fall-2025/41.jpg", ["Petunia Spookworth", "Петуния Спуквурт", "Petūnija Spookworth"],
     ["Ghost gardener", "Садовница-призрак", "Spoku dārzniece"],
     ["Replants flowers so they bloom brighter; leaves a trail of petals.", "Пересаживает цветы, чтобы они цвели ярче; оставляет след из лепестков.", "Pārstāda puķes, lai tās ziedētu krāšņāk; atstāj ziedlapu taku."]),
    ("kettleford", "copp", "4", "halloween-2025/47.jpg", ["Dr. Dripsson", "Доктор Дрипссон", "Dr. Dripsons"],
     ["Spider barista, owner of the first web-based coffee bar", "Паук-бариста, хозяин первого кофе-бара в паутине", "Zirnekļbarista, pirmā tīmekļa kafijas bāra īpašnieks"],
     ["Ask for decaf and he lectures you on the meaning of life.", "Попросишь кофе без кофеина — прочтёт лекцию о смысле жизни.", "Palūdz kafiju bez kofeīna — nolasīs lekciju par dzīves jēgu."]),
    ("kettleford", "kett", "5", "halloween-2025/46.jpg", ["Miss Pumpkinella", "Мисс Тыквелла", "Mis Pumpkinella"],
     ["Etiquette teacher for witches and ghosts", "Учит этикету ведьм и призраков", "Māca etiķeti raganām un spokiem"],
     ["Collects ancient pie recipes; argues with her reflection, which always laughs first.", "Собирает старинные рецепты пирогов; спорит со своим отражением, а оно всегда смеётся первым.", "Krāj senas pīrāgu receptes; strīdas ar savu atspulgu, kas vienmēr iesmejas pirmais."]),
    ("kettleford", "kclk", "3", "halloween-2025/50.jpg", ["Countfluffula", "Граф Пушистула", "Grāfs Pūkula"],
     ["Hosts “No Bites, Just Desserts” soirées in a cloud castle above the pumpkin fields", "Устраивает вечера «Не кусаемся, только десерты» в замке-облаке над тыквенными полями", "Rīko vakarus “Nekožam, tikai deserti” mākoņu pilī virs ķirbju laukiem"],
     ["Drinks strawberry smoothies; always enters out of a pink mist with bat fanfare.", "Пьёт клубничные смузи; всегда появляется из розового тумана под фанфары летучих мышей.", "Dzer zemeņu smūtijus; vienmēr parādās no rozā miglas sikspārņu fanfaru pavadībā."]),
    ("kettleford", "kett", "8", "halloween-remix/62.png", ["Sir Gourdon Squash", "Сэр Гордон Сквош", "Sers Gourdons Squash"],
     ["Gentleman, regular at the Autumn Ball", "Джентльмен, завсегдатай Осеннего бала", "Džentlmenis, Rudens balles pastāvīgais viesis"],
     ["Polishes his monocle when a conversation turns awkward — which is always.", "Протирает монокль, когда разговор становится неловким, то есть всегда.", "Spodrina monokli, kad saruna kļūst neveikla, — tas ir, vienmēr."]),
    ("kettleford", "copp", "9", "autumn-cozy/84.png", ["Moss McCandle", "Мосс Маккэндл", "Moss McCandle"],
     ["Night light at the coffee roastery", "Ночник в кофейной обжарке", "Naktslampiņa kafijas grauzdētavā"],
     ["Terrified of drafts; goes out with a theatrical sigh, then pretends nothing happened.", "Боится сквозняков; гаснет с театральным вздохом, а потом делает вид, что ничего не было.", "Baidās no caurvēja; nodziest ar teatrālu nopūtu un tad izliekas, ka nekas nav noticis."]),
]


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower().replace("mr.", "mr ")).strip("-")


def token(src, key):
    """Пиксельный медальон 20×20: центр картинки карточки (ярче и контрастнее) → 16 px, кремовое кольцо и тёмный контур."""
    im = Image.open(ROOT / "site" / "images" / "cards" / src).convert("RGB")
    w, h = im.size
    side = w * 0.56
    cx, cy = w / 2, h * 0.5
    im = im.crop((int(cx - side / 2), int(cy - side / 2), int(cx + side / 2), int(cy + side / 2)))
    im = ImageEnhance.Color(ImageEnhance.Contrast(im).enhance(1.35)).enhance(1.4)
    px = im.resize((16, 16), Image.LANCZOS).quantize(16, Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGBA")
    out = Image.new("RGBA", (20, 20))
    m = Image.new("L", (16, 16))
    ImageDraw.Draw(m).ellipse((0, 0, 15, 15), fill=255)
    d = ImageDraw.Draw(out)
    d.ellipse((0, 0, 19, 19), fill=INK)
    d.ellipse((1, 1, 18, 18), fill=RING)
    out.paste(px, (2, 2), m)
    out.save(OUT / f"ch-{key}.png")


def main():
    base = json.loads((CONTENT / "wobbleland.json").read_text())
    trs = {lang: json.loads((CONTENT / "i18n" / f"wobbleland.{lang}.json").read_text()) for lang in ("ru", "lv")}
    mp = json.loads((CONTENT / "wobbleland-map.json").read_text())
    houses = {(h[3], h[2]): h for h in mp["houses"]}
    names = {k: v["name"] for part in ("streets", "squares") for k, v in mp[part].items()}
    cities = {c["key"]: c for c in base["cities"]}
    mp["chars"] = [ch for ch in mp["chars"] if not ch.get("sm")]
    keep = {}  # сколько старых жителей в городе (их переводы стоят первыми)
    for c in base["cities"]:
        c["residents"] = [r for r in c.get("residents", []) if not r.get("card")]
        keep[c["key"]] = len(c["residents"])
        for lang, tr in trs.items():
            tr.setdefault(c["key"], {})["residents"] = tr.get(c["key"], {}).get("residents", [])[:keep[c["key"]]]
    for city, st, no, card, nm, job, trait in R:
        assert (st, no) in houses, (st, no)
        c, street = cities[city], names[st]
        key = slug(nm[0])
        c["residents"].append({"name": nm[0], "key": key, "home": f"{street} {no}", "job": job[0], "trait": trait[0], "card": card})
        for i, (lang, tr) in enumerate(trs.items(), 1):
            sn = tr["_map"].get(street, street)
            tr[city]["residents"].append({"name": nm[i], "home": f"{sn}, {no}" if lang == "ru" else f"{sn} {no}", "job": job[i], "trait": trait[i]})
        h = houses[(st, no)]
        mp["chars"].append({"who": key, "at": [h[0], h[1]], "street": st, "no": no, "city": city, "ri": len(c["residents"]) - 1, "sm": True})
        token(card, key)
    (CONTENT / "wobbleland.json").write_text(json.dumps(base, ensure_ascii=False, indent=2))
    for lang, tr in trs.items():
        (CONTENT / "i18n" / f"wobbleland.{lang}.json").write_text(json.dumps(tr, ensure_ascii=False, indent=2) + "\n")
    (CONTENT / "wobbleland-map.json").write_text(json.dumps(mp, ensure_ascii=False, indent=1))
    print(f"жителей из карточек: {len(R)}")


if __name__ == "__main__":
    main()
