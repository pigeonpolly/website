#!/usr/bin/env python3
"""Картинки превью ссылок (og:image) 1200×630 для разделов сайта на EN/RU/LV — в стиле og-flock-*.jpg.

  python3 tools/og_cards.py            — все карточки → site/assets/og/<ключ>-<язык>.jpg + site/assets/og/index.json (подписи)
  python3 tools/og_cards.py games rain — только эти
  python3 tools/og_cards.py --sheet    — ещё лист-обзор _shots/og-sheet.jpg

Какая страница какую карточку берёт — build.py OG. Стая, главная и «Конфиденциальность» — старые og-flock-*.jpg.
Рисует Chromium (Playwright) по HTML-шаблону; шрифт заголовка — tools/og/Lora-Bold.ttf (OFL).
"""
import json
import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "assets" / "og"
LANGS = ("en", "ru", "lv")

# ключ: картинка(и), вид правой части (arch — рисунок в арке, pixel — пиксельная обложка в арке, grid — 4 обложки, wide — плашка)
# и тексты [надзаголовок, строка 1 (белая), строка 2 (золотая), подпись] на en/ru/lv
CARDS = {
    "challenge": dict(img="images/challenge/challenge-pigeonpolly-cactus-4-10-2026-800.jpg", t={
        "en": ["every day · a few minutes", "Daily", "drawing challenge", "One theme, a few colours and a timer. Draw, upload and keep your streak."],
        "ru": ["каждый день · несколько минут", "Ежедневный", "челлендж", "Одна тема, несколько цветов и таймер. Рисуй, загружай и держи серию."],
        "lv": ["katru dienu · dažas minūtes", "Ikdienas", "izaicinājums", "Viena tēma, dažas krāsas un taimeris. Zīmē, augšupielādē un turpini sēriju."]}),
    "games": dict(img=["images/games/rain.png", "images/games/pancakes.png", "images/games/potions.png", "images/games/titos.png"], view="grid", t={
        "en": ["free · pixel · for buttons", "Pigeon Polly", "games", "Button Rain, pancakes, potions and Detective Titos. Earn buttons, spend them in the shop."],
        "ru": ["бесплатно · пиксельно · за пуговки", "Игры", "Pigeon Polly", "Пуговичный дождь, блинчики, зелья и детектив Титос. Зарабатывай пуговки и трать их в магазине."],
        "lv": ["bez maksas · pikseļos · par pogām", "Pigeon Polly", "spēles", "Pogu lietus, pankūkas, dziras un detektīvs Titoss. Pelni pogas un tērē tās veikalā."]}),
    "shop": dict(img="images/games/shop.jpg", view="wide", t={
        "en": ["hats · scarves · treasures", "The Pigeon Polly", "shop", "Dress up your pixel bird and furnish its room — with buttons earned on the site."],
        "ru": ["шапки · шарфы · сокровища", "Магазин", "Pigeon Polly", "Наряды для пиксельной птички и вещи для её комнаты — за пуговки, заработанные на сайте."],
        "lv": ["cepures · šalles · dārgumi", "Pigeon Polly", "veikals", "Apģērb savu pikseļu putniņu un iekārto tā istabu — par pogām, kas nopelnītas vietnē."]}),
    "rain": dict(img="images/games/rain.png", view="pixel", t={
        "en": ["a little game · endless levels", "Button", "Rain", "Catch falling buttons with your pixel bird and dodge the ink blots."],
        "ru": ["маленькая игра · бесконечные уровни", "Пуговичный", "дождь", "Лови падающие пуговки своей пиксельной птичкой и уворачивайся от клякс."],
        "lv": ["maza spēle · bezgalīgi līmeņi", "Pogu", "lietus", "Ķer krītošās pogas ar savu pikseļu putniņu un izvairies no tintes traipiem."]}),
    "pancakes": dict(img="images/games/pancakes.png", view="pixel", t={
        "en": ["a little game · endless levels", "Polly’s", "Pancakes", "Bake pancakes for the residents of Wobbleland — every customer wants something different."],
        "ru": ["маленькая игра · бесконечные уровни", "Блинная", "Полли", "Пеки блинчики жителям Wobbleland — каждому клиенту нужно своё."],
        "lv": ["maza spēle · bezgalīgi līmeņi", "Pollijas", "pankūkas", "Cep pankūkas Wobbleland iedzīvotājiem — katram klientam vajag ko citu."]}),
    "potions": dict(img="images/games/potions.png", view="pixel", t={
        "en": ["mazes · ingredients · recipes", "Polly’s", "Potion Lab", "Walk endless mazes, collect ingredients and discover potions with silly names."],
        "ru": ["лабиринты · ингредиенты · рецепты", "Зельеварня", "Полли", "Бесконечные лабиринты, ингредиенты и зелья с забавными названиями."],
        "lv": ["labirinti · sastāvdaļas · receptes", "Pollijas", "dziru virtuve", "Bezgalīgi labirinti, sastāvdaļas un dziras ar smieklīgiem nosaukumiem."]}),
    "titos": dict(img="images/games/titos.png", view="pixel", t={
        "en": ["100 cases · clues · coffee", "Detective", "Titos", "Find clues, question suspects and keep the coffee pot from running dry."],
        "ru": ["100 дел · улики · кофе", "Детектив", "Титос", "Ищи улики, допрашивай подозреваемых и следи, чтобы кофейник не опустел."],
        "lv": ["100 lietas · pierādījumi · kafija", "Detektīvs", "Titoss", "Meklē pierādījumus, nopratini aizdomās turamos un neļauj kafijas kannai iztukšoties."]}),
    "office": dict(img="images/games/polly-office.png", view="pixel", t={
        "en": ["a pixel office · day and evening", "Polly,", "Office Clerk", "Help Polly with the mail of the Council of Towns. Click the desk, the cooler and the blinds."],
        "ru": ["пиксельный офис · день и вечер", "Полли,", "офисный клерк", "Помоги Полли с почтой Совета городов. Нажимай на стол, кулер и жалюзи."],
        "lv": ["pikseļu birojs · diena un vakars", "Pollija,", "biroja klerke", "Palīdzi Pollijai ar Pilsētu padomes pastu. Klikšķini uz galda, dzesētāja un žalūzijām."]}),
    "wobbleland": dict(img="images/games/wobbleland.png", view="pixel", t={
        "en": ["an island of eleven towns", "Welcome to", "Wobbleland", "An interactive pixel map with holidays, recipes and residents of every town."],
        "ru": ["остров из одиннадцати городов", "Добро пожаловать", "в Wobbleland", "Интерактивная пиксельная карта: праздники, рецепты и жители каждого города."],
        "lv": ["vienpadsmit pilsētu sala", "Laipni lūdzam", "Wobbleland", "Interaktīva pikseļu karte ar katras pilsētas svētkiem, receptēm un iedzīvotājiem."]}),
    "advent": dict(img="images/games/advent.png", view="pixel", t={
        "en": ["December 1–31 · a window a day", "Advent", "calendar", "Open a window every day — a pixel bird flies out with a gift for your profile."],
        "ru": ["1–31 декабря · окошко в день", "Адвент-", "календарь", "Открывай по окошку в день — оттуда вылетает птичка с подарком для профиля."],
        "lv": ["1.–31. decembris · lodziņš dienā", "Adventes", "kalendārs", "Atver pa lodziņam katru dienu — izlido putniņš ar dāvanu tavam profilam."]}),
    "blog": dict(img="images/home/first-pigeon-polly.jpg", t={
        "en": ["notes from the lab", "Blog of", "Pigeon Polly", "Drawing, learning and creativity: what I try, what works and what Polly thinks about it."],
        "ru": ["заметки из лаборатории", "Блог", "Pigeon Polly", "Рисование, обучение и творчество: что я пробую, что работает и что об этом думает Полли."],
        "lv": ["piezīmes no laboratorijas", "Pigeon Polly", "blogs", "Zīmēšana, mācīšanās un radošums: ko es izmēģinu, kas strādā un ko par to domā Pollija."]}),
    "requests": dict(img="images/sketchbook/sketchbook-5.jpg", t={
        "en": ["suggest an idea · get a gift", "Draw this", "for me", "Suggest anything to draw — every idea becomes a sketchbook page."],
        "ru": ["предложи идею · получи подарок", "Нарисуй", "мне", "Предложи, что нарисовать, — каждая идея становится страницей скетчбука."],
        "lv": ["iesaki ideju · saņem dāvanu", "Uzzīmē", "man", "Iesaki, ko uzzīmēt, — katra ideja kļūst par skiču burtnīcas lapu."]}),
    "palettes": dict(img="palette", t={
        "en": ["six colours · HEX codes", "Palettes from", "my paintings", "Copy a colour, pick a palette and draw — or make one from your own photo."],
        "ru": ["шесть цветов · HEX-коды", "Палитры", "из моих картин", "Скопируй цвет, выбери палитру и рисуй — или собери свою из фото."],
        "lv": ["sešas krāsas · HEX kodi", "Paletes no", "maniem darbiem", "Nokopē krāsu, izvēlies paleti un zīmē — vai izveido savu no foto."]}),
    "helps": dict(img="images/bird/2022-pigeon-polly-graphic-designer.jpg", t={
        "en": ["simple shapes · ideas", "Polly,", "help me draw", "How to draw anything from simple shapes, and where to find ideas."],
        "ru": ["простые фигуры · идеи", "Полли,", "помоги нарисовать", "Как нарисовать что угодно из простых фигур и где найти идею."],
        "lv": ["vienkāršas formas · idejas", "Pollija,", "palīdzi uzzīmēt", "Kā uzzīmēt jebko no vienkāršām formām un kur atrast idejas."]}),
    "books": dict(img=["images/e-books/urban-sketching-digital-traveler.jpg", "images/e-books/ink-sketching.jpg", "images/e-books/watercolor-sketches.jpg", "images/e-books/coloring-book-world-breakfasts.jpg"], view="grid", t={
        "en": ["e-books · sketching · watercolor", "Books by", "Alina Otkinska", "Urban sketching, ink, watercolor and a colouring book."],
        "ru": ["книги · скетчинг · акварель", "Книги", "Алины Откинской", "Городской скетчинг, линер, акварель и раскраска."],
        "lv": ["e-grāmatas · skicēšana · akvarelis", "Alīnas Otkinskas", "grāmatas", "Pilsētas skicēšana, tinte, akvarelis un krāsojamā grāmata."]}),
    "about": dict(img="images/home/alina.jpg", t={
        "en": ["artist · illustrator · learning designer", "Alina", "Otkinska", "Author of Pigeon Polly. Art, books and learning design from Riga."],
        "ru": ["художница · иллюстратор · дизайнер обучения", "Алина", "Откинская", "Автор Pigeon Polly. Рисунки, книги и дизайн обучения из Риги."],
        "lv": ["māksliniece · ilustratore · mācību dizainere", "Alīna", "Otkinska", "Pigeon Polly autore. Māksla, grāmatas un mācību dizains no Rīgas."]}),
    "projects": dict(img="images/projects/ai-support-tool/page-1.jpg", t={
        "en": ["learning design · EdTech · AI", "Learning", "& AI projects", "Courses, tools and automation that help people learn."],
        "ru": ["дизайн обучения · EdTech · ИИ", "Проекты:", "обучение и ИИ", "Курсы, инструменты и автоматизация, которые помогают учиться."],
        "lv": ["mācību dizains · EdTech · MI", "Projekti:", "mācības un MI", "Kursi, rīki un automatizācija, kas palīdz mācīties."]}),
    "work": dict(img="images/sketchbook/sketchbook-12.jpg", t={
        "en": ["illustrations · courses · workshops", "Work", "with me", "Learning design, AI in education and sketching workshops."],
        "ru": ["иллюстрации · курсы · мастер-классы", "Работать", "вместе", "Дизайн обучения, ИИ в образовании и мастер-классы по скетчингу."],
        "lv": ["ilustrācijas · kursi · darbnīcas", "Sadarbība", "ar mani", "Mācību dizains, MI izglītībā un skicēšanas darbnīcas."]}),
    "walls": dict(img="images/exhibitions/exhibitions-2022-1.jpg", t={
        "en": ["exhibitions · publications", "On walls", "& pages", "Pigeon Polly art on gallery walls and printed pages."],
        "ru": ["выставки · публикации", "На стенах", "и страницах", "Рисунки Pigeon Polly на стенах галерей и печатных страницах."],
        "lv": ["izstādes · publikācijas", "Uz sienām", "un lapām", "Pigeon Polly māksla galeriju sienās un drukātās lappusēs."]}),
    "sketchbook": dict(img="images/sketchbook/sketchbook-1.jpg", t={
        "en": ["ecolines · sketchbook · AI art", "My", "sketchbook", "Character series, sketchbook pages and experiments."],
        "ru": ["эколайны · скетчбук · AI-арт", "Мой", "скетчбук", "Серии персонажей, страницы скетчбука и эксперименты."],
        "lv": ["ekolaini · skiču burtnīca · MI māksla", "Mana", "skiču burtnīca", "Tēlu sērijas, skiču burtnīcas lapas un eksperimenti."]}),
    "anxiety": dict(img="images/anxiety/anxiety-4.jpg", pos="50% 15%", zoom=1.3, t={
        "en": ["a series in ecolines", "Anxiety", "", "A series of drawings in ecolines by Alina Otkinska."],
        "ru": ["серия эколайнами", "Тревога", "", "Серия рисунков эколайнами Алины Откинской."],
        "lv": ["sērija ar ekolainiem", "Trauksme", "", "Alīnas Otkinskas zīmējumu sērija ar ekolainiem."]}),
    "snail": dict(img="images/snail/2023-mr-chew-coffee-passion.jpg", t={
        "en": ["illustrations 2023–2025", "Mr.Chew", "the snail", "An Australian postal snail and his small adventures."],
        "ru": ["иллюстрации 2023–2025", "Улитка", "Мистер Чу", "Австралийская почтовая улитка и её маленькие приключения."],
        "lv": ["ilustrācijas 2023–2025", "Gliemezis", "Misters Čū", "Austrālijas pasta gliemezis un viņa mazie piedzīvojumi."]}),
    "pollyart": dict(img="images/bird/2022-pigeon-polly-summer-lover.jpg", t={
        "en": ["illustrations 2019–2026", "Pigeon", "Polly", "An office clerk pigeon from Wobbleland and her everyday life."],
        "ru": ["иллюстрации 2019–2026", "Pigeon", "Polly", "Голубь Полли, офисный клерк из Wobbleland, и её будни."],
        "lv": ["ilustrācijas 2019–2026", "Pigeon", "Polly", "Balodis Pollija, biroja klerke no Wobbleland, un viņas ikdiena."]}),
    "detective": dict(img="images/detective/2024-detective-mr-titos-in-the-office-late-night-800.jpg", t={
        "en": ["illustrations", "Detective", "Mr.Titos", "Late nights in the office of the most perky detective of Wobbleland."],
        "ru": ["иллюстрации", "Детектив", "Мистер Титос", "Поздний вечер в кабинете самого бодрого детектива Wobbleland."],
        "lv": ["ilustrācijas", "Detektīvs", "Misters Titoss", "Vēls vakars visenerģiskākā Wobbleland detektīva birojā."]}),
    "halloween": dict(img="images/halloween/halloween-lady.jpg", t={
        "en": ["Halloween illustrations", "The Pumpkin", "Family", "Welcome to the family of the Pumpkin-Heads."],
        "ru": ["иллюстрации к Хеллоуину", "Семья", "Тыквоголовых", "Добро пожаловать в семью Тыквоголовых."],
        "lv": ["Helovīna ilustrācijas", "Ķirbju", "ģimene", "Laipni lūdzam Ķirbjgalvu ģimenē."]}),
    "aiart": dict(img="images/ai-art/ai-art-1.jpg", t={
        "en": ["in the Pigeon Polly style", "AI", "art", "AI art based on the traditional Pigeon Polly art style."],
        "ru": ["в стиле Pigeon Polly", "AI-арт", "", "AI-арт в стиле традиционных рисунков Pigeon Polly."],
        "lv": ["Pigeon Polly stilā", "MI", "māksla", "MI māksla Pigeon Polly tradicionālās mākslas stilā."]}),
}

TPL = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: OgSerif; src: url('file://%(font)s'); font-weight: 700; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; background: #2A1A52; font-family: Inter, 'Liberation Sans', sans-serif; position: relative; }
.l { position: absolute; left: 74px; top: 20px; bottom: 140px; width: 560px; display: flex; flex-direction: column; justify-content: center; }
.k { color: #F0B49A; font-size: 23px; font-weight: 500; letter-spacing: .01em; margin-bottom: 18px; }
h1 { font-family: OgSerif, serif; font-weight: 700; font-size: %(fs)dpx; line-height: 1.08; color: #fff; letter-spacing: -.01em; }
h1 b { display: block; color: #F2B33D; }
.s { color: #E6DDF7; font-size: 25px; line-height: 1.45; margin-top: 24px; max-width: 520px; }
.br { position: absolute; left: 74px; bottom: 54px; }
.br b { display: block; font-family: OgSerif, serif; color: #fff; font-size: 28px; }
.br span { color: #F0B49A; font-size: 22px; }
.arch { position: absolute; left: 700px; top: 58px; width: 452px; height: 518px; border: 8px solid #D9673E; border-radius: 226px 226px 26px 26px; overflow: hidden; background: #3A2868; }
.arch img { width: 100%%; height: 100%%; object-fit: cover; display: block; }
.arch.pixel { background: #FFF3E3; } .arch.pixel img { image-rendering: pixelated; object-fit: cover; }
.arch.grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 6px; background: #D9673E; }
.arch.grid img { image-rendering: %(gridr)s; }
.arch.wide { background: #FBE7D3; display: flex; align-items: center; } .arch.wide img { flex: none; width: 178%%; height: auto; max-width: none; margin-left: -4%%; image-rendering: pixelated; }
.arch.pal { display: flex; flex-direction: column; } .arch.pal img { height: 76%%; } .sw { display: flex; flex: 1; } .sw i { flex: 1; }
.line { position: absolute; left: 690px; top: 582px; width: 470px; height: 6px; background: #D9673E; border-radius: 3px; }
.star { position: absolute; right: 32px; top: 52px; width: 64px; height: 64px; background: #F2B33D; clip-path: polygon(50%% 0, 60%% 40%%, 100%% 50%%, 60%% 60%%, 50%% 100%%, 40%% 60%%, 0 50%%, 40%% 40%%); }
.dot { position: absolute; width: 14px; height: 14px; border-radius: 50%%; background: #F5C4B4; }
</style></head><body>
<div class="l"><p class="k">%(k)s</p><h1>%(t1)s%(t2)s</h1><p class="s">%(s)s</p></div>
<div class="br"><b>Pigeon Polly Art Lab</b><span>pigeonpolly.com</span></div>
<div class="arch %(view)s">%(pic)s</div><div class="line"></div><div class="star"></div>
<div class="dot" style="left:668px;top:236px"></div><div class="dot" style="left:1160px;top:390px;width:11px;height:11px"></div>
</body></html>"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def pic_html(c):
    img = c["img"]
    url = lambda p: (ROOT / "site" / p).as_uri()
    if img == "palette":  # первая палитра из content/palettes.json: картина + шесть цветов
        p = json.loads((ROOT / "content" / "palettes.json").read_text())[0]
        return f'<img src="{url(p["thumb"])}"><div class="sw">' + "".join(f'<i style="background:{x["hex"]}"></i>' for x in p["colors"]) + "</div>"
    if isinstance(img, list):
        return "".join(f'<img src="{url(x)}">' for x in img)
    return f'<img src="{url(img)}"' + (f' style="object-position:{c["pos"]};transform:scale({c.get("zoom", 1)})"' if c.get("pos") else "") + ">"


def html_for(key, lang):
    c = CARDS[key]
    k, t1, t2, s = c["t"][lang]
    view = c.get("view") or ("pal" if c["img"] == "palette" else "")
    longest = max(len(t1), len(t2))
    fs = 84 if longest <= 11 else 74 if longest <= 14 else 64 if longest <= 17 else 56
    return TPL % dict(font=ROOT / "tools" / "og" / "Lora-Bold.ttf", fs=fs, k=esc(k), t1=esc(t1), t2=f"<b>{esc(t2)}</b>" if t2 else "",
                      s=esc(s), view=view, pic=pic_html(c), gridr="pixelated" if key == "games" else "auto")


def main(args):
    keys = [a for a in args if not a.startswith("--")] or list(CARDS)
    OUT.mkdir(parents=True, exist_ok=True)
    idx_f = OUT / "index.json"
    idx = json.loads(idx_f.read_text()) if idx_f.exists() else {}
    tmp = ROOT / "_shots"
    tmp.mkdir(exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--allow-file-access-from-files"])
        pg = b.new_page(viewport={"width": 1200, "height": 630})
        for key in keys:
            for lang in LANGS:
                f = tmp / f"og-{key}-{lang}.html"
                f.write_text(html_for(key, lang))
                pg.goto(f.as_uri())
                pg.wait_for_load_state("load")
                pg.evaluate("document.fonts.ready")
                pg.screenshot(path=str(OUT / f"{key}-{lang}.jpg"), type="jpeg", quality=82)
                f.unlink()
                k, t1, t2, s = CARDS[key]["t"][lang]
                idx.setdefault(key, {})[lang] = f"{t1} {t2}".strip().replace("- ", "-") + ". " + s
            print("og", key)
        b.close()
    idx_f.write_text(json.dumps(idx, ensure_ascii=False, indent=1) + "\n")
    if "--sheet" in args:
        from PIL import Image
        files = [OUT / f"{k}-{l}.jpg" for k in keys for l in LANGS]
        cols, w, h = 3, 400, 210
        sheet = Image.new("RGB", (cols * w, -(-len(files) // cols) * h), "white")
        for i, f in enumerate(files):
            sheet.paste(Image.open(f).resize((w, h)), ((i % cols) * w, (i // cols) * h))
        sheet.save(tmp / "og-sheet.jpg", quality=85)
        print("лист:", tmp / "og-sheet.jpg")


if __name__ == "__main__":
    main(sys.argv[1:])
