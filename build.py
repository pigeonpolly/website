#!/usr/bin/env python3
"""Собирает сайт: src/layout.html + src/pages/*.html + content/*.json -> site/.

Запуск: python3 build.py
В страницах можно писать {{gallery:имя}} — подставится галерея из content/galleries/имя.json,
и {{ebooks}} — список книг из content/ebooks.json.
"""
import html
import json
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
     "Creative AI, learning that fits different minds, and illustrated worlds by Alina Otkinska."),
    ("projects", "Projects", "projects.html",
     "Learning design, EdTech and AI automation projects by Alina Otkinska."),
    ("work-with-me", "Work with me", "work-with-me.html",
     "Learning design, AI in education and sketching workshops by Alina Otkinska."),
    ("challenge", "Daily Challenge", "challenge.html",
     "A daily sketch challenge with Pigeon Polly: one subject, three colours, a few minutes."),
    ("e-books", "E-Books", "e-books.html", "E-books by Alina Otkinska."),
    ("on-walls-and-pages", "On Walls & Pages", "on-walls-and-pages.html",
     "Exhibitions and publications of Pigeon Polly art: on gallery walls and printed pages."),
    ("art-portfolio/anxiety", "Anxiety", "anxiety.html", "Anxiety, a series in ecolines."),
    ("art-portfolio/sketchbook", "My Sketchbook", "sketchbook.html", "Pages from my sketchbook."),
    ("art-portfolio/snail", "Mr.Chew", "snail.html", "Mr.Chew the snail, illustrations 2023–2025."),
    ("art-portfolio/bird", "Pigeon Polly", "bird.html", "Pigeon Polly illustrations 2019–2026."),
    ("art-portfolio/detective", "Mr.Titos", "detective.html", "Detective Mr.Titos."),
    ("art-portfolio/halloween", "Pumpkin Family", "halloween.html", "Welcome to the Pumpkin-Heads family."),
    ("art-portfolio/ai-art", "AI Art", "ai-art.html", "AI art based on the Pigeon Polly traditional art style."),
    ("privacy", "Privacy", "privacy.html", "How pigeonpolly.com handles your data."),
]
# готовые, но пока не открытые страницы: не попадают в sitemap
UNLISTED = set()


PORTFOLIO = [
    ("art-portfolio/anxiety", "Anxiety"),
    ("art-portfolio/sketchbook", "My Sketchbook"),
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
NAV = [
    ("challenge", "Daily Challenge"),
    ("e-books", "E-Books"),
    ("art-portfolio", "Art Portfolio", PORTFOLIO),
    ("learning", "Learning & AI", [("projects", "Projects"), ("work-with-me", "Work with me")]),
    ("on-walls-and-pages", "On Walls & Pages"),
    ("social", "Social Media", SOCIAL),
]

esc = html.escape


def href(path):
    return path if path.startswith("http") else "/" + (path + "/" if path else "")


def nav_link(path, label, current):
    if path.startswith("http"):
        return f'<a href="{path}" target="_blank" rel="noopener">{esc(label)}<span class="ext" aria-hidden="true">↗</span></a>'
    cur = ' aria-current="page"' if path == current else ""
    return f'<a href="{href(path)}"{cur}>{esc(label)}</a>'


def nav_html(current):
    items = []
    for entry in NAV:
        if len(entry) == 3:
            key, label, children = entry
            active = any(p == current for p, _ in children)
            sub = "".join(f"<li>{nav_link(p, l, current)}</li>" for p, l in children)
            items.append(
                f'<li class="has-sub{" active" if active else ""}">'
                f'<button class="sub-toggle" aria-expanded="false">{esc(label)}<span aria-hidden="true">▾</span></button>'
                f'<ul class="nav-sub">{sub}</ul></li>')
        else:
            items.append(f"<li>{nav_link(entry[0], entry[1], current)}</li>")
    return "\n".join(items)


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
            f'<figure><a href="/{it["full"]}" data-lightbox>'
            f'<img src="/{it["thumb"]}" width="{it["w"]}" height="{it["h"]}" alt="{alt}" loading="lazy" decoding="async"></a>'
            + (f"<figcaption>{cap}</figcaption>" if cap else "") + "</figure>")
    return '<div class="gallery">' + "\n".join(out) + "</div>"


def ebooks_html():
    data = json.loads((CONTENT / "ebooks.json").read_text())
    out = []
    for section in data["sections"]:
        cards = []
        for b in section["books"]:
            cover = (f'<img src="/{b["cover"]}" alt="" loading="lazy">' if b.get("cover")
                     else '<span class="cover-ph" aria-hidden="true">📖</span>')
            cards.append(
                f'<a class="book" href="{esc(b["url"])}" target="_blank" rel="noopener">'
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
    return f'<div class="blk" id="blk-{name}"><style>{scope_css(styles, "#blk-" + name)}</style>{body}</div>'


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


def cv_html():
    d = json.loads((CONTENT / "cv.json").read_text())

    def items(lst, key="years"):
        out = []
        for it in lst:
            text = f'<p>{esc(it["text"])}</p>' if it.get("text") else ""
            cls = ' class="current"' if it.get("current") else ""
            out.append(f'<li{cls}><span class="when">{esc(it[key])}</span>'
                       f'<h3>{esc(it["title"])}</h3><p class="org">{esc(it["org"])}</p>{text}</li>')
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


def build():
    layout = (SRC / "layout.html").read_text()
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
        body = body.replace("{{cv}}", cv_html() if "{{cv}}" in body else "")

        body = body.replace("{{ebooks}}", ebooks_html() if "{{ebooks}}" in body else "")
        full_title = title if not path else f"{title} · Pigeon Polly Art Lab"
        for lang, prefix in LANGS.items():
            canonical, hreflang, switch = lang_bits(path, lang)
            page_body = body.replace("{{projects}}", projects_html(lang)) if "{{projects}}" in body else body
            # отдельный файл страницы для языка (длинные тексты): privacy.ru.html, privacy.lv.html
            alt = SRC / "pages" / f"{pathlib.Path(file).stem}.{lang}.html"
            if lang != "en" and alt.exists():
                page_body = alt.read_text()
            page = (layout
                    .replace("{{title}}", esc(full_title))
                    .replace("{{description}}", esc(desc))
                    .replace("{{canonical}}", canonical)
                    .replace("{{nav}}", nav_html(path))
                    .replace("{{body_class}}", "home" if not path else "inner")
                    .replace("{{content}}", page_body))
            page = localize(page, lang)
            page = page.replace("{{hreflang}}", hreflang).replace("{{lang_switch}}", switch)
            dest = OUT / prefix / path / "index.html"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(page)
        print("built", dest.relative_to(ROOT))
    # 404
    nf = layout.replace("{{title}}", "Page not found · Pigeon Polly Art Lab").replace("{{description}}", "")
    nf = nf.replace("{{canonical}}", SITE_URL + "/").replace("{{nav}}", nav_html("404")).replace("{{body_class}}", "inner")
    nf = nf.replace("{{content}}", (SRC / "pages" / "404.html").read_text())
    nf = nf.replace("{{hreflang}}", "").replace("{{lang_switch}}", "")
    (OUT / "404.html").write_text(nf)
    # sitemap
    urls = "".join(f"<url><loc>{SITE_URL}/{(v + '/') if v else ''}{(p + '/') if p else ''}</loc></url>"
                   for p, *_ in PAGES if p not in UNLISTED for v in LANGS.values())
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')


if __name__ == "__main__":
    build()
