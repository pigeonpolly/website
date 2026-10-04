#!/usr/bin/env python3
"""Собирает сайт: src/layout.html + src/pages/*.html + content/*.json -> site/.

Запуск: python3 build.py
В страницах можно писать {{gallery:имя}} — подставится галерея из content/galleries/имя.json,
и {{ebooks}} — список книг из content/ebooks.json.
"""
import html
import json
import pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
CONTENT = ROOT / "content"
OUT = ROOT / "site"
SITE_URL = "https://www.pigeonpolly.com"

# path, title, file, description
PAGES = [
    ("", "Pigeon Polly Art Lab", "home.html",
     "Creative AI, learning that fits different minds, and illustrated worlds by Alina Otkinska."),
    ("e-books", "E-Books", "e-books.html", "E-books by Alina Otkinska."),
    ("exhibitions", "Exhibitions", "exhibitions.html", "Exhibitions of Pigeon Polly art."),
    ("publications", "Publications", "publications.html", "Publications of Pigeon Polly art."),
    ("art-portfolio/anxiety", "Anxiety", "anxiety.html", "Anxiety, a series in ecolines."),
    ("art-portfolio/sketchbook", "My Sketchbook", "sketchbook.html", "Pages from my sketchbook."),
    ("art-portfolio/snail", "Mr.Chew", "snail.html", "Mr.Chew the snail, illustrations 2023–2025."),
    ("art-portfolio/bird", "Pigeon Polly", "bird.html", "Pigeon Polly illustrations 2019–2026."),
    ("art-portfolio/detective", "Mr.Titos", "detective.html", "Detective Mr.Titos."),
    ("art-portfolio/halloween", "Pumpkin Family", "halloween.html", "Welcome to the Pumpkin-Heads family."),
    ("art-portfolio/ai-art", "AI Art", "ai-art.html", "AI art based on the Pigeon Polly traditional art style."),
    ("wobbleland-comics", "Wobbleland", "wobbleland.html", "Welcome to Wobbleland, an island told by Pigeon Polly."),
]

PORTFOLIO = [
    ("art-portfolio/anxiety", "Anxiety"),
    ("art-portfolio/sketchbook", "My Sketchbook"),
    ("art-portfolio/snail", "Mr.Chew"),
    ("art-portfolio/bird", "PigeonPolly"),
    ("art-portfolio/detective", "Mr.Titos"),
    ("art-portfolio/halloween", "Pumpkin Family"),
    ("art-portfolio/ai-art", "AI Art"),
]

NAV = [
    ("", "Home"),
    ("e-books", "E-Books"),
    ("exhibitions", "Exhibitions"),
    ("publications", "Publications"),
    ("art-portfolio", "Art Portfolio"),
    ("wobbleland-comics", "Wobbleland"),
    ("http://blog.pigeonpolly.com", "Patreon Blog"),
    ("https://www.pinterest.com/pigeonpollyart/", "Pinterest"),
]

esc = html.escape


def href(path):
    return path if path.startswith("http") else "/" + (path + "/" if path else "")


def nav_html(current):
    items = []
    for path, label in NAV:
        if path == "art-portfolio":
            active = current.startswith("art-portfolio")
            cur_attr = ' aria-current="page"'
            sub = "".join(
                f'<li><a href="{href(p)}"{cur_attr if p == current else ""}>{esc(l)}</a></li>'
                for p, l in PORTFOLIO)
            items.append(
                f'<li class="has-sub{" active" if active else ""}">'
                f'<button class="sub-toggle" aria-expanded="false">{esc(label)}<span aria-hidden="true">▾</span></button>'
                f'<ul class="sub">{sub}</ul></li>')
        elif path.startswith("http"):
            items.append(f'<li><a href="{path}" target="_blank" rel="noopener">{esc(label)}<span class="ext" aria-hidden="true">↗</span></a></li>')
        else:
            cur = ' aria-current="page"' if path == current else ""
            items.append(f'<li><a href="{href(path)}"{cur}>{esc(label)}</a></li>')
    return "\n".join(items)


def gallery_html(name):
    f = CONTENT / "galleries" / f"{name}.json"
    items = json.loads(f.read_text()) if f.exists() else []
    if not items:
        return '<p class="empty">Gallery is coming soon.</p>'
    out = []
    for it in items:
        cap = esc(it.get("caption", ""))
        alt = esc(it.get("alt") or it.get("caption", ""))
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
        out.append(f'<h2 class="section-title">{esc(section["title"])}</h2><div class="books">{"".join(cards)}</div>')
    return "\n".join(out)


def build():
    layout = (SRC / "layout.html").read_text()
    for path, title, file, desc in PAGES:
        body = (SRC / "pages" / file).read_text()
        while "{{gallery:" in body:
            start = body.index("{{gallery:")
            end = body.index("}}", start)
            body = body[:start] + gallery_html(body[start + 10:end]) + body[end + 2:]
        body = body.replace("{{ebooks}}", ebooks_html() if "{{ebooks}}" in body else "")
        full_title = title if not path else f"{title} · Pigeon Polly Art Lab"
        page = (layout
                .replace("{{title}}", esc(full_title))
                .replace("{{description}}", esc(desc))
                .replace("{{canonical}}", SITE_URL + href(path))
                .replace("{{nav}}", nav_html(path))
                .replace("{{body_class}}", "home" if not path else "inner")
                .replace("{{content}}", body))
        dest = OUT / path / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(page)
        print("built", dest.relative_to(ROOT))
    # 404
    nf = layout.replace("{{title}}", "Page not found · Pigeon Polly Art Lab").replace("{{description}}", "")
    nf = nf.replace("{{canonical}}", SITE_URL + "/").replace("{{nav}}", nav_html("404")).replace("{{body_class}}", "inner")
    nf = nf.replace("{{content}}", (SRC / "pages" / "404.html").read_text())
    (OUT / "404.html").write_text(nf)
    # sitemap
    urls = "".join(f"<url><loc>{SITE_URL}{href(p)}</loc></url>" for p, *_ in PAGES)
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')


if __name__ == "__main__":
    build()
