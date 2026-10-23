#!/usr/bin/env python3
"""Собирает сайт: src/layout.html + src/pages/*.html + content/*.json -> site/.

Запуск: python3 build.py
В страницах можно писать {{gallery:имя}} — подставится галерея из content/galleries/имя.json,
и {{ebooks}} — список книг из content/ebooks.json.
"""
import html
import json
import runpy
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
CONTENT = ROOT / "content"
OUT = ROOT / "site"
SITE_URL = "https://www.pigeonpolly.com"

# path, title, file, description
PAGES = [
    ("", "Pigeon Polly Art Lab", "home.html",
     "Get your own pixel bird and join the flock, try the daily drawing challenge and mini-games, and support an artist for free. Books and art by the author of Pigeon Polly."),
    ("projects", "Projects", "projects.html",
     "Learning design, EdTech and AI automation projects by Alina Otkinska."),
    ("work-with-me", "Work with me", "work-with-me.html",
     "Learning design, AI in education and sketching workshops by Alina Otkinska."),
    ("challenge", "Daily Challenge", "challenge.html",
     "A daily sketch challenge with Pigeon Polly: one subject, a few colours, a few minutes."),
    ("e-books", "E-Books", "e-books.html", "E-books by Alina Otkinska."),
    ("on-walls-and-pages", "On Walls & Pages", "on-walls-and-pages.html",
     "Exhibitions and publications of Pigeon Polly art: on gallery walls and printed pages."),
    ("art-portfolio/anxiety", "Anxiety", "anxiety.html", "Anxiety, a series in ecolines."),
    ("art-portfolio/sketchbook", "Sketchbook Pages", "sketchbook.html", "Pages from my sketchbook."),
    ("art-portfolio/snail", "Mr.Chew", "snail.html", "Mr.Chew the snail, illustrations 2023–2025."),
    ("art-portfolio/bird", "Pigeon Polly", "pigeon-polly.html", "Pigeon Polly illustrations 2019–2026."),  # галерея; bird.html — профиль птички (/bird/)
    ("art-portfolio/detective", "Mr.Titos", "detective.html", "Detective Mr.Titos."),
    ("art-portfolio/halloween", "Pumpkin Family", "halloween.html", "Welcome to the Pumpkin-Heads family."),
    ("art-portfolio/ai-art", "AI Art", "ai-art.html", "AI art based on the Pigeon Polly traditional art style."),
    ("privacy", "Privacy", "privacy.html", "How pigeonpolly.com handles your data."),
    ("about-me", "About me", "about-me.html",
     "Alina Otkinska: learning experience designer, artist and author of Pigeon Polly. Portfolio, projects and how to work together."),
    ("art-portfolio", "My Sketchbook", "art-portfolio.html", "Art portfolio of Alina Otkinska: ecoline series, sketchbook pages and AI art."),
    ("blog", "Blog", "blog.html", "Notes on drawing, learning and creativity by Alina Otkinska and Pigeon Polly."),
    ("blog-editor", "Blog editor", "blog-editor.html", "Blog editor."),
    ("admin", "Admin", "admin.html", "Admin."),
    ("polly-office", "Polly, Office Clerk", "polly-office.html",
     "Polly's pixel office: old blinds, a water cooler and a desk you can click. Switch to evening and watch the light change."),
    ("shift", "Shift with Polly", "shift.html",
     "Shift with Polly: a focus timer with a pixel office. Pick 20 minutes to 3 hours and a retro tune, and Polly works next to you. Every full hour brings a promotion and buttons."),
    ("titos", "Detective Titos", "titos.html",
     "Help Detective Titos solve 100 cases in Wobbleland: find clues, question suspects and keep the coffee pot from running dry."),
    ("polly-helps", "Polly, help me draw", "polly-helps.html",
     "Polly's little drawing guides: build any object from simple shapes, and find ideas for what to draw with an association map."),
    ("flock", "The Flock", "flock.html",
     "Our flock of pixel birds: everyone who signs in gets one. Scatter seeds, call the wind or rain, throw a party and watch what happens."),
    ("flock/news", "Flock news", "flock-news.html",
     "Flock news: new pixel birds, drawings of the day, housewarmings, badges, collectible cards and news from Polly."),
    ("shop", "Shop", "shop.html",
     "The Pigeon Polly shop: hats, scarves, frames and treasures for your pixel bird, paid for with buttons you earn on the site."),
    ("games", "Games", "games.html",
     "Pigeon Polly games: Button Rain, Polly’s Potion Lab, Polly’s Pancakes, Detective Titos, Polly’s Office, Wobbleland and the advent calendar. Earn buttons and spend them in the shop."),
    ("bird", "Bird profile", "bird.html",
     "A bird of the Pigeon Polly flock: its room, bag of gifts, achievements and sketches from the Daily Challenge."),
    ("garden", "Bird garden", "garden.html",
     "The garden behind a pixel bird’s house: plant seeds, water them every day, catch bugs and sell the harvest for buttons. The weather follows the real season."),
    ("requests", "Draw this for me", "requests.html",
     "Draw this for me: suggest anything for Alina to draw, see every idea turned into a sketchbook drawing, and get a gift for your pixel bird when yours is drawn."),
    ("rain", "Button Rain", "rain.html",
     "Button Rain: a little Pigeon Polly game. Catch falling buttons with your pixel bird, dodge the ink blots and earn buttons for the shop. Endless levels."),
    ("pancakes", "Polly’s Pancakes", "pancakes.html",
     "Polly’s Pancakes: a little Pigeon Polly game. Bake pancakes for the residents of Wobbleland: pick the pan, flip at the right moment, add the toppings and earn buttons for the shop. Endless levels."),
    ("potions", "Polly’s Potion Lab", "potions.html",
     "Polly’s Potion Lab: a Halloween game. Walk endless mazes with your pixel bird, collect ingredients, discover potion recipes by trial and error and earn buttons."),
    ("advent", "Advent calendar", "advent.html",
     "The Pigeon Polly advent calendar: from December 1 to 31 open a window a day and a pixel bird flies out with a gift for your profile."),
    ("palettes", "Palettes", "palettes.html",
     "Color palettes from Pigeon Polly watercolors and sketchbook pages: six colors with HEX codes from every artwork. Copy a color, pick a palette and draw."),
    ("wobbleland", "Wobbleland", "wobbleland.html",
     "Wobbleland: an island of eleven towns drawn in pixels. Explore the interactive map and meet every town with Polly as your guide."),
]
# готовые, но пока не открытые страницы: не попадают в sitemap
UNLISTED = {"blog-editor", "admin", "garden"}


PORTFOLIO = [
    ("art-portfolio/anxiety", "Anxiety"),
    ("art-portfolio/sketchbook", "Sketchbook Pages"),
    ("art-portfolio/snail", "Mr.Chew"),
    ("art-portfolio/bird", "PigeonPolly"),
    ("art-portfolio/detective", "Mr.Titos"),
    ("art-portfolio/halloween", "Pumpkin Family"),
    ("art-portfolio/ai-art", "AI Art"),
]

# пункт меню: (путь, название) или (ключ, название, [подпункты])
SOCIAL = [
    ("https://www.amazon.com/stores/Alina-Otkinska/author/B0FTMCBTQJ", "Amazon"),
    ("https://lv.linkedin.com/in/otkinska", "LinkedIn"),
    ("https://www.instagram.com/pigeonpolly", "Instagram"),
    ("https://www.tiktok.com/@pigeonpolly", "TikTok"),
    ("https://www.patreon.com/cw/pigeon_polly", "Patreon"),
    ("https://www.pinterest.com/pigeonpollyart/", "Pinterest"),
]
# Меню (этап 14 Б): 5 пунктов — Стая · Играть · Рисовать · Блог · Обо мне. Пункт ведёт на хаб раздела,
# подпункт — (путь, название, значок, описание); путь с «#» — якорь на странице. Переводы — content/i18n (ключи с классами ns-t / ns-d / nm-t).
SECTIONS = {
    "flock": [("flock", "All birds", "🐦", "Find any bird and pay a visit"),
              ("challenge#sw-wall", "Flock drawings", "🎨", "What was drawn today and before"),
              ("flock/news", "Flock news", "📰", "Who hatched, what was drawn, who had a housewarming")],
    "play": [("advent", "Advent calendar", "🎄", "31 windows with gifts"),
             ("rain", "Button Rain", "🔘", "Catch buttons, dodge ink blots"),
             ("potions", "Potion Lab", "🧪", "A maze, ingredients and potions with silly names"),
             ("pancakes", "Polly’s Pancakes", "🥞", "Pancakes for Wobbleland, every customer is different"),
             ("titos", "Detective Titos", "🕵️", "100 cases and one very perky detective"),
             ("shift", "Shift with Polly", "⏱", "A timer, retro music and Polly working next to you"),
             ("polly-office", "Polly’s Office", "📮", "Help Polly with the Council of Towns’ mail"),
             ("wobbleland", "Wobbleland", "🗺", "Map, holidays and recipes of eleven towns")],
    "draw": [("challenge", "Daily Challenge", "✏️", "A theme, a few colours and a timer — every day"),
             ("requests", "Draw this for me", "💡", "Suggest an idea and I’ll draw it"),
             ("palettes", "Palettes", "🎨", "Colours from my paintings and from your photos"),
             ("polly-helps", "Polly, help me", "🕊", "How to draw anything from simple shapes"),
             ("e-books", "Books", "📚", "My books about drawing")],
    "about": [("art-portfolio", "Sketchbook", "📓", "Character series, sketchbook pages, AI art"),
              ("on-walls-and-pages", "On Walls & Pages", "🖼", "Exhibitions and publications"),
              ("projects", "Learning & AI", "🎓", "Projects about learning and technology"),
              ("work-with-me", "Work with me", "🤝", "Illustrations, courses, collaboration")],
}
# внизу подменю, через линию — хаб раздела
SECTION_HUB = {"play": ("games", "All games and the shop →"), "draw": ("challenge", "To today’s theme →"), "about": ("about-me", "About me →")}
# страницы не из меню: в каком они разделе и какой подпункт подсвечен («Стая › Все птички» над заголовком)
TAB_ALIAS = {"bird": "flock", "garden": "flock", "shop": "games", "games": "games"}
# подпись над заголовком для страниц раздела, которых нет в подменю
CRUMB_ONLY = {"shop": ("play", "Shop")}
for _p in ("anxiety", "sketchbook", "snail", "bird", "detective", "halloween", "ai-art"):
    TAB_ALIAS["art-portfolio/" + _p] = "art-portfolio"
# подпункты, которых нет в выпадающем меню (а в подвале есть)
MENU_HIDE = {}
NAV = [
    ("flock", "The Flock", "flock"),
    ("games", "Play", "play"),
    ("challenge", "Draw", "draw"),
    ("blog", "Blog"),
    ("about-me", "About me", "about"),
]
# адвент — первым в «Играть» и со счётчиком с 1.10 по 23.01 (site.js по дате)
SEASONAL = {"advent"}


def section_of(path):
    path = TAB_ALIAS.get(path, path)
    for key, tabs in SECTIONS.items():
        if any(t[0] == path for t in tabs):
            return key, path
    for key, (hub, _) in SECTION_HUB.items():
        if hub == path:
            return key, path
    return None, path


def section_tabs(path):
    """Над заголовком страницы раздела: «Стая › Все птички» (раздел — ссылкой). Хабам без своего подпункта — ничего."""
    key, cur = section_of(path)
    sub = CRUMB_ONLY.get(path) or next((t for t in SECTIONS.get(key, []) if t[0] == cur), None)
    key = CRUMB_ONLY.get(path, (key,))[0]
    if not key or not sub:
        return ""
    top = next(e for e in NAV if len(e) == 3 and e[2] == key)
    return (f'<nav class="crumbs" aria-label="Breadcrumb"><a href="{href(top[0])}"><span class="nm-t">{esc(top[1])}</span></a>'
            f'<span aria-hidden="true">›</span><span aria-current="page" class="ns-t">{esc(sub[1])}</span></nav>\n')

esc = html.escape


def href(path):
    if "#" in path:
        base, frag = path.split("#", 1)
        return href(base) + "#" + frag
    return path if path.startswith("http") else "/" + (path + "/" if path else "")


def nav_link(path, label, current):
    if path.startswith("http"):
        return f'<a href="{path}" target="_blank" rel="noopener">{esc(label)}<span class="ext" aria-hidden="true">↗</span></a>'
    cur = ' aria-current="page"' if path == current else ""
    return f'<a href="{href(path)}"{cur}>{esc(label)}</a>'


def nav_subs(key):
    return [t for t in SECTIONS.get(key, []) if t[0] not in MENU_HIDE.get(key, ())]


def nav_html(current):
    items = []
    key, cur = section_of(current)
    for entry in NAV:
        path, label = entry[0], entry[1]
        on = (len(entry) == 3 and entry[2] == key) or path == current
        cur_attr = ' aria-current="page"' if on else ""
        top = f'<span class="nm-t">{esc(label)}</span>'
        subs = nav_subs(entry[2]) if len(entry) == 3 else []
        if not subs:
            items.append(f'<li><a href="{href(path)}"{cur_attr}>{top}</a></li>')
            continue
        # подменю: на компьютере — светлая карточка при наведении, на телефоне — аккордеон (раздел текущей страницы раскрыт)
        sub = "".join(f'<li{" data-adv" if p in SEASONAL else ""}><a href="{href(p)}"{" aria-current=" + chr(34) + "page" + chr(34) if p == cur else ""}>'
                      f'<i class="ns-i" aria-hidden="true">{i}</i><span class="ns-t">{esc(l)}</span><small class="ns-d">{esc(d)}</small></a></li>'
                      for p, l, i, d in subs)
        hub = SECTION_HUB.get(entry[2])
        if hub:
            sub += f'<li class="ns-hub"><a href="{href(hub[0])}"><span class="ns-t">{esc(hub[1])}</span></a></li>'
        items.append(f'<li class="has-sub{" active open-cur" if on else ""}"><a href="{href(path)}"{cur_attr}>{top}</a>'
                     f'<button type="button" class="sub-toggle" aria-expanded="{"true" if on else "false"}" aria-label="Show submenu"><span aria-hidden="true">▾</span></button>'
                     f'<ul class="nav-sub">{sub}</ul></li>')
    return "\n".join(items)


def footer_html():
    """Карта сайта в подвале: те же разделы, что в меню, колонками."""
    cols = []
    for entry in NAV:
        path, label = entry[0], entry[1]
        links = nav_subs(entry[2]) if len(entry) == 3 else []
        lis = "".join(f'<li><a href="{href(t[0])}"><span class="ns-t">{esc(t[1])}</span></a></li>' for t in links)
        cols.append(f'<div class="ft-col"><p class="ft-h"><a href="{href(path)}"><span class="nm-t">{esc(label)}</span></a></p><ul>{lis}</ul></div>')
    return '<nav class="ft-map" aria-label="Site map">' + "".join(cols) + "</nav>"


GALLERY_LABELS = {
    "bird": "Pigeon Polly illustration", "snail": "Mr.Chew illustration", "detective": "Mr.Titos illustration",
    "halloween": "Pumpkin Family illustration", "anxiety": "Anxiety series, ecoline painting",
    "sketchbook": "Sketchbook page", "ai-art": "AI art in the Pigeon Polly style",
    "exhibitions": "Exhibition photo, The House of the Blackheads, Riga 2022",
    "publications": "Flora Fiction publication, 2023",
}


POLLY_ROWS = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...',
              '..dbbsbbbbd...', '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......',
              '....o..o......', '...oo.oo......']
POLLY_COL = {"d": "#1a1528", "b": "#7f81bf", "s": "#5e5a9c", "w": "#ffffff", "k": "#1a1528", "o": "#f2a73b"}
POLLY_SVG = ('<svg class="ph-polly" viewBox="0 0 14 14" shape-rendering="crispEdges" aria-hidden="true">' + "".join(
    f'<rect x="{x}" y="{y}" width="1" height="1" fill="{POLLY_COL[ch]}"/>'
    for y, row in enumerate(POLLY_ROWS) for x, ch in enumerate(row) if ch in POLLY_COL) + "</svg>")


def wall_html():
    """Стена работ челленджа: настоящие работы + заглушки, 3 ряда, листается вбок."""
    f = CONTENT / "galleries" / "challenge.json"
    items = json.loads(f.read_text()) if f.exists() else []
    cards = []
    for it in items:
        cap = esc(it.get("caption", ""))
        cards.append(f'<figure class="wall-item"><a href="/{it["full"]}" data-lightbox>'
                     f'<img src="/{it["thumb"]}" alt="{cap or "Daily challenge sketch"}" loading="lazy"></a>'
                     f'<figcaption>{cap}</figcaption></figure>')
    tints = ["#F5C4B3", "#CFC7E8", "#F2E3B3", "#BFE3D3", "#F4F0FA"]
    for i in range(max(0, 15 - len(items))):
        cards.append(f'<div class="wall-ph" style="--t:{tints[i % len(tints)]};--r:{(i * 37 % 7) - 3}deg">'
                     f'{POLLY_SVG}<span class="ph-text">Your sketch could be here</span>'
                     f'<span class="ph-tag">#dailypigeonpolly</span></div>')
    return '<div class="wall-strip">' + "".join(cards) + "</div>"


def gallery_html(name):
    if name == "challenge":
        return wall_html()
    f = CONTENT / "galleries" / f"{name}.json"
    items = json.loads(f.read_text()) if f.exists() else []
    if not items:
        return '<p class="empty">Gallery is coming soon.</p>'
    out = []
    for n, it in enumerate(items):
        cap = esc(it.get("caption", ""))
        label = GALLERY_LABELS.get(name, "Artwork")
        cap_txt = re.sub(r"^\(\d{4}\)\s*", "", it.get("caption", ""))
        alt = esc(it.get("alt") or (f"{cap_txt} — {label} by Alina Otkinska" if cap_txt
                                     else f"{label} by Alina Otkinska, artwork {n + 1}"))
        out.append(
            f'<figure data-src="{esc(it["full"])}"><a href="/{it["full"]}" data-lightbox>'
            f'<img src="/{it["thumb"]}" width="{it["w"]}" height="{it["h"]}" alt="{alt}" loading="lazy" decoding="async"></a>'
            + (f"<figcaption>{cap}</figcaption>" if cap else "") + "</figure>")
    return f'<div class="gallery" data-gallery="{name}">' + "\n".join(out) + "</div>"


_bust_cache = {}
def bust(html):
    """Метка версии у своих скриптов и стилей (/assets/x.js?v=хеш): после обновления сайта телефоны берут новые файлы, а не старые из кэша."""
    import hashlib
    def ver(m):
        path = m.group(2)
        if path not in _bust_cache:
            f = OUT / path.lstrip("/")
            _bust_cache[path] = hashlib.md5(f.read_bytes()).hexdigest()[:8] if f.exists() else ""
        v = _bust_cache[path]
        return f'{m.group(1)}="{path}?v={v}"' if v else m.group(0)
    return re.sub(r'(src|href)="(/assets/[\w.-]+\.(?:js|css))"', ver, html)


def ebooks_html():
    data = json.loads((CONTENT / "ebooks.json").read_text())
    out = []
    for section in data["sections"]:
        cards = []
        for b in section["books"]:
            cover = (f'<img src="/{b["cover"]}" alt="" loading="lazy">' if b.get("cover")
                     else '<span class="cover-ph" aria-hidden="true">📖</span>')
            cards.append(
                f'<a class="book" href="{esc(b["url"])}"' + ('' if b["url"].startswith("/") else ' target="_blank" rel="noopener"') + '>'
                f'<span class="cover">{cover}</span>'
                f'<span class="book-title">{esc(b["title"])}</span></a>')
        out.append(f'<h2 class="section-title">{esc(section["title"])}</h2><div class="book-grid">{"".join(cards)}</div>')
    return "\n".join(out)


def scope_css(css, scope):
    """Приставляет #scope ко всем селекторам, чтобы стили блока не задевали остальной сайт."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out, i = [], 0
    while True:
        j = css.find("{", i)
        if j < 0:
            break
        head = css[i:j].strip()
        depth, k = 1, j + 1
        while depth:
            depth += {"{": 1, "}": -1}.get(css[k], 0)
            k += 1
        inner = css[j + 1:k - 1]
        if head.startswith("@media") or head.startswith("@supports"):
            out.append(f"{head} {{{scope_css(inner, scope)}}}")
        elif head.startswith("@"):
            out.append(f"{head} {{{inner}}}")
        else:
            sels = [x.strip() for x in head.split(",")]
            # фон, заданный блоку через html/body, переносим на сам блок
            sels = [scope if re.match(r"^(html|body)$", x) else f"{scope} {x}" for x in sels]
            sels = list(dict.fromkeys(sels))
            if sels:
                out.append(f"{', '.join(sels)} {{{inner}}}")
        i = k
    return "\n".join(out)


def block_html(name):
    raw = (SRC / "blocks" / f"{name}.html").read_text()
    styles = "".join(re.findall(r"<style>(.*?)</style>", raw, flags=re.S))
    body = re.sub(r"<style>.*?</style>\s*", "", raw, flags=re.S)
    return f'<div class="blk" id="blk-{name}" data-ppb="blk-{name}"><style>{scope_css(styles, "#blk-" + name)}</style>{body}</div>'


def mark_editable(body, key):
    """Метка data-ppb на каждом блоке верхнего уровня страницы: по ней админ правит блок прямо на сайте
    (изменения хранятся в базе, worker подставляет их при отдаче страницы). Блоки {{block:..}} уже помечены."""
    n = 0
    def tag(m):
        nonlocal n
        n += 1
        return f'{m.group(1)} data-ppb="{key}.{n}"'
    return re.sub(r'^(<(?:section|div|header|article|aside|figure|nav|ul|ol|p|h1|h2|h3|dl|table|form)\b)(?![^>]*data-ppb)', tag, body, flags=re.M)


def projects_html(lang="en"):
    data = json.loads((CONTENT / "projects.json").read_text())
    themes = data["themes"]
    legend = "".join(
        f'<button class="theme-chip" data-theme="{k}" aria-pressed="false">'
        f'<i style="background:{t["color"]}"></i>{esc(t["label"])}</button>'
        for k, t in themes.items())
    books, dialogs = [], []
    heights = [208, 192, 216, 200, 184, 212, 196]
    tr_file = CONTENT / "i18n" / f"projects.{lang}.json"
    tr = json.loads(tr_file.read_text()) if lang != "en" and tr_file.exists() else {}
    heads = {"lv": {"Challenge": "Izaicinājums", "Solution": "Risinājums", "Impact": "Rezultāts", "Method": "Metode", "What it does": "Ko tas dara", "Why": "Kāpēc"},
             "ru": {"Challenge": "Задача", "Solution": "Решение", "Impact": "Результат", "Method": "Метод", "What it does": "Что делает", "Why": "Зачем"}}.get(lang, {})
    for n, p in enumerate(data["projects"]):
        p = dict(p)
        o = tr.get(p["slug"], {})
        for key in ("role", "domain", "scale", "summary"):
            if o.get(key):
                p[key] = o[key]
        if o.get("sections"):
            p["sections"] = [{"h": h, "items": items} for h, items in o["sections"]]
        else:
            p["sections"] = [{"h": heads.get(sec["h"], sec["h"]), "items": sec["items"]} for sec in p["sections"]]
        if o.get("link") and p.get("link"):
            p["link"] = dict(p["link"], label=o["link"])
        t = themes[p["theme"]]
        dots = "".join(f'<i style="background:{themes[k]["color"]}"></i>' for k in p["themes"] if k != p["theme"])
        books.append(
            f'<div class="book-slot"><button class="spine" data-open="p-{p["slug"]}" data-themes="{" ".join(p["themes"])}" '
            f'style="--c:{t["color"]};--ink:{t["ink"]};height:{heights[n % len(heights)]}px" '
            f'aria-label="{esc(p["title"])}, {esc(p["years"])}">'
            f'<span class="spine-title">{esc(p["title"])}</span>'
            f'<span class="spine-dots">{dots}</span>'
            f'<span class="spine-year">{esc(p["years"])}</span></button></div>')
        secs = "".join(
            f'<h3>{esc(sec["h"])}</h3><ul>' + "".join(f"<li>{esc(i)}</li>" for i in sec["items"]) + "</ul>"
            for sec in p["sections"])
        tags = "".join(f'<span class="tag">{esc(x)}</span>' for x in p["topics"])
        pages = ""
        if p.get("pages"):
            pages = '<div class="doc-pages">' + "".join(
                f'<img src="/{pg}" alt="{esc(p["title"])}, page {i + 1}" width="1240" height="1754" loading="lazy" decoding="async">'
                for i, pg in enumerate(p["pages"])) + "</div>"
        link = (f'<p><a class="pill" href="{esc(p["link"]["url"])}" target="_blank" rel="noopener">{esc(p["link"]["label"])} ↗</a></p>'
                if p.get("link") else "")
        dialogs.append(
            f'<dialog class="modal project{" wide" if p.get("pages") else ""}" id="p-{p["slug"]}" aria-labelledby="p-{p["slug"]}-t">'
            f'<div class="modal-band" style="background:{t["color"]}"></div>'
            f'<button class="modal-close" aria-label="Close">✕</button>'
            f'<p class="modal-kicker">{esc(t["label"])} · {esc(p["years"])}</p>'
            f'<h2 id="p-{p["slug"]}-t">{esc(p["title"])}</h2>'
            f'<dl class="facts"><div><dt>Role</dt><dd>{esc(p["role"])}</dd></div>'
            f'<div><dt>Domain</dt><dd>{esc(p["domain"])}</dd></div>'
            f'<div><dt>Scale</dt><dd>{esc(p["scale"])}</dd></div></dl>'
            f'<p class="modal-lead">{esc(p["summary"])}</p>{link}{pages}{secs}'
            f'<p class="tags">{tags}</p></dialog>')
    return (f'<div class="legend" role="group" aria-label="Filter by theme">{legend}</div>'
            f'<div class="bookshelf">{"".join(books)}</div>' + "".join(dialogs))


def cv_html(lang="en"):
    d = json.loads((CONTENT / "cv.json").read_text())
    # переводы: content/i18n/cv.<lang>.json — английская строка → перевод
    tr_file = CONTENT / "i18n" / f"cv.{lang}.json"
    tr = json.loads(tr_file.read_text()) if lang != "en" and tr_file.exists() else {}
    now = {"lv": "šobrīd", "ru": "сейчас"}.get(lang, "now")

    def t(s):
        return tr.get(s, s)

    def items(lst, key="years"):
        out = []
        for it in lst:
            text = f'<p>{esc(t(it["text"]))}</p>' if it.get("text") else ""
            cls = ' class="current"' if it.get("current") else ""
            when = it[key].replace("now", now)
            out.append(f'<li{cls}><span class="when">{esc(when)}</span>'
                       f'<h3>{esc(t(it["title"]))}</h3><p class="org">{esc(t(it["org"]))}</p>{text}</li>')
        return "".join(out)

    return (
        '<div class="cv-grid">'
        f'<section class="cv-col"><h2 class="cv-title">Experience</h2><ol class="timeline">{items(d["experience"])}</ol></section>'
        f'<section class="cv-col"><h2 class="cv-title">Education</h2><ol class="timeline">{items(d["education"])}</ol></section>'
        f'<section class="cv-col"><h2 class="cv-title">Courses &amp; certificates</h2><ol class="timeline compact">{items(d["courses"], "year")}</ol></section>'
        '</div>')


LANGS = {"en": "", "lv": "lv", "ru": "ru"}


def localize(page, lang):
    """Переводит готовую страницу по словарю content/i18n/<lang>.json и переписывает внутренние ссылки."""
    if lang == "en":
        return page
    tr = json.loads((CONTENT / "i18n" / f"{lang}.json").read_text())
    for k in sorted(tr, key=len, reverse=True):
        page = page.replace(k, tr[k])
    page = page.replace('<html lang="en">', f'<html lang="{lang}">')
    page = re.sub(r'href="/(?!assets/|images/|files/|' + lang + r'/)([^"]*)"', rf'href="/{lang}/\1"', page)
    return page


def lang_bits(path, lang):
    url = {k: SITE_URL + "/" + (v + "/" if v else "") + (path + "/" if path else "") for k, v in LANGS.items()}
    hreflang = "".join(f'<link rel="alternate" hreflang="{k}" href="{u}">' for k, u in url.items())
    hreflang += f'<link rel="alternate" hreflang="x-default" href="{url["en"]}">'
    links = []
    for k in LANGS:
        rel = url[k][len(SITE_URL):]
        cur = ' aria-current="true"' if k == lang else ""
        links.append(f'<a href="{rel}" hreflang="{k}" lang="{k}"{cur}>{k.upper()}</a>')
    return url[lang], hreflang, '<nav class="lang-switch" aria-label="Language">' + "".join(links) + "</nav>"


def wobbleland_data():
    """Данные Wobbleland по языкам: content/wobbleland.json + переводы content/i18n/wobbleland.<lang>.json."""
    base = json.loads((CONTENT / "wobbleland.json").read_text())
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for c in base["cities"]:
        for h in c["holidays"]:  # месяц и день из английской даты «Mar 12» — для календаря
            m, d = h["date"].split()
            h["m"], h["d"] = months.index(m[:3]) + 1, int(d)
    for lang in LANGS:
        data = json.loads(json.dumps(base))
        tr_file = CONTENT / "i18n" / f"wobbleland.{lang}.json"
        tr = json.loads(tr_file.read_text()) if lang != "en" and tr_file.exists() else {}
        for c in data["cities"]:
            o = tr.get(c["key"], {})
            for k in ("name", "short", "motto", "desc", "neighbors"):
                if o.get(k): c[k] = o[k]
            for part in ("holidays", "dishes", "streets", "residents"):
                for item, t in zip(c[part], o.get(part, [])):
                    item.update({k: v for k, v in t.items() if v})
        # карта: улицы, площади, дома (адреса), персонажи — content/wobbleland-map.json, названия переводятся через "_map"
        mp = json.loads((CONTENT / "wobbleland-map.json").read_text())
        names = tr.get("_map", {})
        for part in ("streets", "squares"):
            for v in mp[part].values():
                v["name"] = names.get(v["name"], v["name"])
        data["map"] = mp
        (OUT / "assets" / f"wobbleland-data.{lang}.js").write_text(
            "// Сгенерировано build.py из content/wobbleland.json — не править руками\nwindow.WOBBLELAND = "
            + json.dumps(data, ensure_ascii=False) + ";\n")


def rooms_data():
    """Зоны для клика и спрайты комнат (tools/rooms/*.json — пишут office.py и detective.py) → site/assets/rooms-data.js."""
    data = {p.stem: json.loads(p.read_text()) for p in sorted((ROOT / "tools" / "rooms").glob("*.json"))}
    (OUT / "assets" / "rooms-data.js").write_text("// Сгенерировано build.py из tools/rooms/*.json\nwindow.ROOMS = " + json.dumps(data) + ";\n")


def search_entry(page, lang, path):
    """Заголовок, описание и видимый текст страницы — для поиска по сайту."""
    title = html.unescape(re.search(r"<title>(.*?)</title>", page, re.S).group(1)).replace(" · Pigeon Polly Art Lab", "")
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S)  # заголовок на странице уже переведён
    if h1 and path:
        title = html.unescape(re.sub(r"<[^>]+>", "", h1.group(1))).strip() or title
    m = re.search(r'<meta name="description" content="([^"]*)"', page)
    main = re.search(r"<main[^>]*>(.*?)</main>", page, re.S)
    text = main.group(1) if main else ""
    text = re.sub(r"<(script|style|svg|nav)[^>]*>.*?</\1>", " ", text, flags=re.S)
    text = html.unescape(re.sub(r"<[^>]+>", " ", text))
    text = re.sub(r"\s+", " ", text).strip()
    pre = "" if lang == "en" else "/" + lang
    return {"u": pre + "/" + (path + "/" if path else ""), "t": title, "d": html.unescape(m.group(1)) if m else "", "x": text[:4000]}


def titos_cases():
    """Дела Титоса: content/titos/NNN.json (тексты RU) + готовые EN/LV старых дел из content/titos/tr/NNN.json → site/assets/titos-cases.json.
    Worker импортирует файл по хэшу (meta titos_cases_<хэш>) и переводит недостающее (worker/titos.js, docs/titos.md)."""
    import hashlib
    import sys
    sys.path.insert(0, str(ROOT / "tools"))
    from titos_cast import slug
    # имена жителей (who) на трёх языках — для подозреваемых без своего name
    base = json.loads((CONTENT / "wobbleland.json").read_text())
    trs = {lang: json.loads((CONTENT / "i18n" / f"wobbleland.{lang}.json").read_text()) for lang in ("ru", "lv") if (CONTENT / "i18n" / f"wobbleland.{lang}.json").exists()}
    who = {}
    for c in base["cities"]:
        for i, r in enumerate(c.get("residents", [])):
            names = {"en": r["name"]}
            for lang, tr in trs.items():
                rs = tr.get(c["key"], {}).get("residents", [])
                names[lang] = (rs[i].get("name") if i < len(rs) else None) or r["name"]
            who[r.get("key") or slug(r["name"])] = {"ru": names.get("ru", r["name"]), "en": names["en"], "lv": names.get("lv", r["name"])}
    cases = []
    for f in sorted((CONTENT / "titos").glob("[0-9][0-9][0-9].json")):
        case = json.loads(f.read_text())
        tr_file = CONTENT / "titos" / "tr" / f.name
        tr = json.loads(tr_file.read_text()) if tr_file.exists() else {}

        def merge(o):
            if isinstance(o, dict):
                if isinstance(o.get("ru"), str) and len(o) == 1:
                    return {**o, **{k: v for k, v in tr.get(o["ru"], {}).items() if v}}
                return {k: merge(v) for k, v in o.items()}
            if isinstance(o, list):
                return [merge(x) for x in o]
            return o
        case = merge(case)
        for sp in case.get("suspects", []):
            if not sp.get("name") and sp.get("who") in who:
                sp["name"] = who[sp["who"]]
        case["hash"] = hashlib.md5(json.dumps(case, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:12]
        cases.append(case)
    body = json.dumps(cases, ensure_ascii=False, separators=(",", ":"))
    (OUT / "assets" / "titos-cases.json").write_text(
        json.dumps({"hash": hashlib.md5(body.encode()).hexdigest()[:16], "cases": cases}, ensure_ascii=False, separators=(",", ":")) + "\n")


def build():
    rooms_data()
    wobbleland_data()
    titos_cases()
    layout = (SRC / "layout.html").read_text()
    search_index = {lang: [] for lang in LANGS}
    for path, title, file, desc in PAGES:
        body = (SRC / "pages" / file).read_text()
        while "{{gallery:" in body:
            start = body.index("{{gallery:")
            end = body.index("}}", start)
            body = body[:start] + gallery_html(body[start + 10:end]) + body[end + 2:]
        while "{{block:" in body:
            start = body.index("{{block:")
            end = body.index("}}", start)
            body = body[:start] + block_html(body[start + 8:end]) + body[end + 2:]

        body = body.replace("{{ebooks}}", ebooks_html() if "{{ebooks}}" in body else "")
        full_title = title if not path else f"{title} · Pigeon Polly Art Lab"
        for lang, prefix in LANGS.items():
            canonical, hreflang, switch = lang_bits(path, lang)
            page_body = body.replace("{{projects}}", projects_html(lang)) if "{{projects}}" in body else body
            page_body = page_body.replace("{{cv}}", cv_html(lang)) if "{{cv}}" in page_body else page_body
            # отдельный файл страницы для языка (длинные тексты): privacy.ru.html, privacy.lv.html
            alt = SRC / "pages" / f"{pathlib.Path(file).stem}.{lang}.html"
            if lang != "en" and alt.exists():
                page_body = alt.read_text()
            page_body = mark_editable(page_body, (path or "home").replace("/", "-"))
            page_body = section_tabs(path) + page_body
            page = (layout
                    .replace("{{title}}", esc(full_title))
                    .replace("{{description}}", esc(desc))
                    .replace("{{canonical}}", canonical)
                    .replace("{{nav}}", nav_html(path)).replace("{{footer_map}}", footer_html())
                    .replace("{{body_class}}", "home" if not path else "inner")
                    .replace("{{content}}", page_body))
            page = localize(page, lang)
            page = page.replace("{{hreflang}}", hreflang).replace("{{lang_switch}}", switch).replace("{{lang}}", lang)
            page = bust(page)
            dest = OUT / prefix / path / "index.html"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(page)
            if path not in UNLISTED:
                search_index[lang].append(search_entry(page, lang, path))
        print("built", dest.relative_to(ROOT))
    # книги Алины для стаи (витрина в книжном: обложки кликабельные, птички их читают)
    books = [b for sec in json.loads((CONTENT / "ebooks.json").read_text())["sections"] for b in sec["books"]]
    (OUT / "assets" / "books.json").write_text(json.dumps([{"title": b["title"], "url": b["url"], "cover": "/" + b["cover"]} for b in books if b.get("cover")], ensure_ascii=False))
    # палитры из артов (страница «Палитры» и кнопка 🎨 в челлендже); данные — content/palettes.json (tools/palettes.py)
    pals = json.loads((CONTENT / "palettes.json").read_text())
    (OUT / "assets" / "palettes.json").write_text(json.dumps(pals, ensure_ascii=False, separators=(",", ":")))
    # названия цветов для «Палитры из своего фото» (palettes.js); список — tools/palette_names.py
    names = runpy.run_path(str(ROOT / "tools" / "palette_names.py"))["NAMES"]
    (OUT / "assets" / "palette-names.json").write_text(json.dumps([list(n) for n in names], ensure_ascii=False, separators=(",", ":")))
    # день ЭКСТРА в челлендже: очередь палитр картин, месяц N (октябрь 2026 = 0) берёт N-ю. Порядок — content/extra-order.json
    # (не меняется; новые картины из tools/palettes.py дописываются в конец). Сервер (/api/extra-palettes.js) вставляет в неё картины, добавленные с сайта.
    order = json.loads((CONTENT / "extra-order.json").read_text())
    by_key = {p["key"]: p for p in pals}
    keys = [k for k in order if k in by_key] + [p["key"] for p in pals if p["key"] not in order]
    extra = [{"k": k, "t": [by_key[k]["title"][l] for l in ("en", "ru", "lv")], "th": by_key[k]["thumb"],
              "c": [[c["hex"], c["en"], c["ru"], c["lv"]] for c in by_key[k]["colors"]]} for k in keys]
    extra_json = json.dumps(extra, ensure_ascii=False, separators=(",", ":"))
    (OUT / "assets" / "extra-palettes.json").write_text(extra_json)
    (OUT / "assets" / "extra-palettes.js").write_text("// генерирует build.py: запасной список, если /api/extra-palettes.js недоступен\nwindow.EXTRA_PALETTES=" + extra_json + ";\n")
    # каталог вещей для сервера («🎲 Сюрприз» выбирает случайную вещь категории) — из birds.js и room.js
    import subprocess
    subprocess.run(["node", str(ROOT / "tools" / "catalog.js"), str(ROOT)], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(["node", str(ROOT / "tools" / "daycolors.js"), str(ROOT)], check=True, stdout=subprocess.DEVNULL)  # цвета темы дня → бейджи за цвета
    subprocess.run(["node", str(ROOT / "tools" / "challenge_items.js"), str(ROOT)], check=True, stdout=subprocess.DEVNULL)  # предметы + теги → подбор тем на сервере (worker/challenge-plan.js)
    # коллекции карточек из репозитория: site/assets/cards/<коллекция>.json → список для импорта на сервере (worker/cards.js, docs/cards.md)
    cards_dir = OUT / "assets" / "cards"
    cards_dir.mkdir(exist_ok=True)
    (cards_dir / "index.json").write_text(json.dumps(sorted(f.stem for f in cards_dir.glob("*.json") if f.stem != "index")) + "\n")
    # индекс для поиска по сайту (кнопка 🔍 в шапке; статьи блога ищутся отдельно на сервере)
    for lang, entries in search_index.items():
        (OUT / "assets" / f"search-{lang}.json").write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")))
    # 404
    nf = layout.replace("{{title}}", "Page not found · Pigeon Polly Art Lab").replace("{{description}}", "")
    nf = nf.replace("{{canonical}}", SITE_URL + "/").replace("{{nav}}", nav_html("404")).replace("{{footer_map}}", footer_html()).replace("{{body_class}}", "inner")
    nf = nf.replace("{{content}}", (SRC / "pages" / "404.html").read_text())
    nf = nf.replace("{{hreflang}}", "").replace("{{lang_switch}}", "")
    (OUT / "404.html").write_text(bust(nf))
    # sitemap
    urls = "".join(f"<url><loc>{SITE_URL}/{(v + '/') if v else ''}{(p + '/') if p else ''}</loc></url>"
                   for p, *_ in PAGES if p not in UNLISTED for v in LANGS.values())
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')


if __name__ == "__main__":
    build()
