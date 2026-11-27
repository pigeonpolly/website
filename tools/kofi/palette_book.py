# Книга палитр для Ko-fi (27.11.2026, docs/growth.md «Ko-fi»): 172 палитры из артов Алины (content/palettes.json).
# python3 tools/kofi/palette_book.py → tools/kofi/out/ (book.html, previews.html, файлы палитр)
# node tools/kofi/render.js → kofi/palette-book/ (PDF, ZIP, картинки для Ko-fi и пинов)
import colorsys, csv, io, json, os, shutil, struct, zipfile
from pathlib import Path
from PIL import Image

W = Path(__file__).resolve().parents[2]
OUT = W / 'tools' / 'kofi' / 'out'
PROD = W / 'kofi' / 'palette-book'
SITE = W / 'site'

SECTIONS = [  # порядок книги: (название, галереи)
    ('Pigeon Polly', ['bird']),
    ('Mr.Chew the Snail', ['snail']),
    ('Pumpkin Family & friends', ['halloween', 'detective', 'challenge']),
    ('Anxiety', ['anxiety']),
    ('Sketchbook', ['sketchbook']),
    ('From the Studio', ['studio']),
    ('Detail Palettes', ['details']),
]
INTRO = {
    'Pigeon Polly': 'The pixel-hearted pigeon who started it all: warm, playful colours from her adventures.',
    'Mr.Chew the Snail': 'Slow living in colour: mossy greens, soft browns and cosy evening tones.',
    'Pumpkin Family & friends': 'Autumn oranges, spooky purples and a detective’s moody night.',
    'Anxiety': 'A painted series about a hard feeling: muted, deep and honest colours.',
    'Sketchbook': 'Quick ink and watercolour pages: light paper tones with a few bold accents.',
    'From the Studio': 'Paintings and objects photographed in the studio: rich, natural, real-world colour.',
    'Detail Palettes': 'Close-ups of small details from the artworks: tiny corners, big colour ideas.',
}


def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def cmyk(rgb):
    r, g, b = [x / 255 for x in rgb]; k = 1 - max(r, g, b)
    if k >= 1: return (0, 0, 0, 100)
    return tuple(round(100 * x) for x in ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k))


def lum(rgb):
    f = lambda c: (c / 255 / 12.92) if c <= 10 else ((c / 255 + .055) / 1.055) ** 2.4
    r, g, b = map(f, rgb); return .2126 * r + .7152 * g + .0722 * b


def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def slug(s): return ''.join(c if c.isalnum() else '-' for c in s.lower()).strip('-').replace('--', '-')


def load():
    data = json.load(open(W / 'content' / 'palettes.json', encoding='utf-8'))
    book, n = [], 0
    for name, gals in SECTIONS:
        items = [p for g in gals for p in data if p['gallery'] == g]
        for p in items:
            n += 1; p['no'] = n; p['section'] = name
        book.append((name, items))
    assert n == len(data), (n, len(data))
    return book


def img(p, size=900):  # уменьшенная копия арта для PDF
    dst = OUT / 'img' / (p['key'] + '.jpg')
    if not dst.exists():
        im = Image.open(SITE / p['img']).convert('RGB'); im.thumbnail((size, size)); im.save(dst, quality=80, optimize=True)
    return 'img/' + dst.name


FONT_CSS = f'''
@font-face{{font-family:Fraunces;src:url("{(SITE / 'assets/fonts/fraunces.woff2').as_uri()}") format("woff2");font-weight:100 900}}
@font-face{{font-family:Fraunces;font-style:italic;src:url("{(SITE / 'assets/fonts/fraunces-italic.woff2').as_uri()}") format("woff2");font-weight:100 900}}
@font-face{{font-family:Inter;src:url("{(W / 'a1-pack/fonts/web/Inter-normal-latin.woff2').as_uri()}") format("woff2");font-weight:100 900}}
'''
CSS = FONT_CSS + '''
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#ddd;font-family:Inter,sans-serif;color:#2b2622}
.pg{width:8.5in;height:11in;background:#f7f3ec;position:relative;overflow:hidden;page-break-after:always;margin:0 auto}
.ft{position:absolute;bottom:.38in;left:.6in;right:.6in;display:flex;justify-content:space-between;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#9a8f84}
h1,h2,h3{font-family:Fraunces,serif;font-weight:500}
/* palette page */
.pp{padding:.55in .6in}
.top{display:flex;justify-content:space-between;align-items:baseline;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#9a8f84}
.top b{font-family:Fraunces;font-size:22px;letter-spacing:0;color:#2b2622;font-weight:500}
.pp h2{font-style:italic;font-size:40px;margin:.08in 0 .2in;line-height:1.05}
.art{height:4.05in;display:flex;align-items:center;justify-content:center;background:#efe8dc;border-radius:14px;padding:.18in}
.art img{max-width:100%;max-height:100%;border-radius:6px;box-shadow:0 6px 18px rgba(60,40,20,.18)}
.lab{display:flex;justify-content:space-between;margin:.16in 0 .07in;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:#9a8f84}
.sw{display:grid;grid-template-columns:repeat(3,1fr);gap:.14in}
.c{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(60,40,20,.12)}
.c i{display:block;height:.82in}
.c div{padding:.08in .11in .1in;font-size:9px;line-height:1.5;color:#6d625a}
.c div b{display:block;font-family:Fraunces;font-size:14px;font-weight:500;color:#2b2622;line-height:1.25}
.c div span{font-family:Inter;font-weight:600;color:#2b2622;letter-spacing:.04em}
.mix{display:flex;height:.3in;border-radius:8px;overflow:hidden;margin-top:.08in}
/* section page */
.sec{display:flex;flex-direction:column;justify-content:center;padding:1in .9in}
.sec small{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#9a8f84}
.sec h1{font-size:58px;font-style:italic;margin:.15in 0 .2in;line-height:1}
.sec p{font-size:15px;line-height:1.6;max-width:5.4in;color:#5b5049}
.thumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:.12in;margin-top:.45in}
.thumbs div{aspect-ratio:1;border-radius:10px;background-size:cover;background-position:center}
.strip{display:flex;height:.16in;border-radius:4px;overflow:hidden;margin-top:.05in}
.strip i{flex:1}
/* text pages */
.tx{padding:.8in .85in}
.tx h1{font-size:40px;font-style:italic;margin-bottom:.25in}
.tx h3{font-size:19px;margin:.24in 0 .06in}
.tx p,.tx li{font-size:12.5px;line-height:1.65;color:#4a403a}
.tx ul{padding-left:.2in}
/* index */
.ix{padding:.6in .55in}
.ix h1{font-size:34px;font-style:italic;margin-bottom:.18in}
.ixg{display:grid;grid-template-columns:repeat(3,1fr);gap:.06in .22in}
.ixr{display:flex;align-items:center;gap:.07in;font-size:9px;border-bottom:1px solid #e6ddd0;padding:.035in 0}
.ixr em{font-style:normal;color:#9a8f84;width:.24in;font-weight:600}
.ixr span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dots{display:flex}.dots i{width:.12in;height:.12in;border-radius:50%;margin-left:-.025in;border:1px solid #f7f3ec}
/* cover */
.cv{background:#2b2622;color:#f7f3ec}
.mos{position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:2.2in;gap:6px;opacity:.95}
.mos div{background-size:cover;background-position:center}
.cvb{position:absolute;left:.55in;right:.55in;top:3.2in;background:#f7f3ec;color:#2b2622;border-radius:18px;padding:.45in .5in;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.35)}
.cvb small{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#9a8f84}
.cvb h1{font-size:76px;line-height:.95;margin:.12in 0 .06in}
.cvb h1 em{font-style:italic;display:block;font-size:46px}
.cvb p{font-size:15px;color:#5b5049;margin-top:.12in}
.cvb .bar{display:flex;height:.28in;border-radius:8px;overflow:hidden;margin:.22in auto 0;width:80%}
.cvb .bar i{flex:1}
.cvb .by{margin-top:.2in;display:flex;align-items:center;justify-content:center;gap:.1in;font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.cvb .by img{width:.42in;height:.42in}
'''


def swatch_card(c):
    rgb = hx(c['hex']); k = cmyk(rgb)
    return (f'<div class="c"><i style="background:{c["hex"]}"></i><div><b>{esc(c["en"])}</b>'
            f'<span>{c["hex"].upper()}</span><br>RGB {rgb[0]} · {rgb[1]} · {rgb[2]}<br>CMYK {k[0]} · {k[1]} · {k[2]} · {k[3]}</div></div>')


def palette_page(p, page):
    cs = p['colors']
    # 60-30-10: спокойный основной, второй спокойный, яркий акцент
    mix = f'<div class="mix"><i style="flex:6;background:{cs[3]["hex"]}"></i><i style="flex:3;background:{cs[4]["hex"]}"></i><i style="flex:1;background:{cs[0]["hex"]}"></i></div>'
    return f'''<section class="pg pp"><div class="top"><span>{esc(p["section"])}</span><b>No. {p["no"]:03d}</b></div>
<h2>{esc(p["title"]["en"])}</h2><div class="art"><img src="{img(p)}"></div>
<div class="lab"><span>Bright accents</span></div><div class="sw">{''.join(swatch_card(c) for c in cs[:3])}</div>
<div class="lab"><span>Calm base</span></div><div class="sw">{''.join(swatch_card(c) for c in cs[3:])}</div>
<div class="lab"><span>Try it: 60 · 30 · 10 mix</span><span>{' · '.join(c["hex"].upper() for c in cs)}</span></div>{mix}
<div class="ft"><span>Pigeon Polly Art Lab · pigeonpolly.com</span><span>{page}</span></div></section>'''


def strip(p): return '<div class="strip">' + ''.join(f'<i style="background:{c["hex"]}"></i>' for c in p['colors']) + '</div>'


def section_page(name, items, page):
    th = ''.join(f'<div><div style="aspect-ratio:1;border-radius:10px;background:url({img(p)}) center/cover"></div>{strip(p)}</div>' for p in items[:8])
    return f'''<section class="pg sec"><small>Palettes {items[0]["no"]:03d}–{items[-1]["no"]:03d} · {len(items)} palettes</small>
<h1>{esc(name)}</h1><p>{esc(INTRO[name])}</p><div class="thumbs" style="grid-template-columns:repeat(4,1fr)">{th}</div>
<div class="ft"><span>Pigeon Polly Art Lab</span><span>{page}</span></div></section>'''


def cover(all_items):
    pick = [p for p in all_items if p['gallery'] in ('bird', 'snail', 'studio', 'halloween')]
    step = max(1, len(pick) // 20); pick = pick[::step][:20]
    mos = ''.join(f'<div style="background-image:url({img(p)})"></div>' for p in pick)
    hero = next(p for p in all_items if p['gallery'] == 'bird')
    bar = ''.join(f'<i style="background:{c["hex"]}"></i>' for c in hero['colors'])
    logo = (SITE / 'images/logo/round-512.png').as_uri()
    return f'''<section class="pg cv"><div class="mos">{mos}</div><div class="cvb"><small>Digital palette book</small>
<h1>{len(all_items)}<em>Color Palettes</em></h1><p>taken from real paintings, sketchbooks &amp; studio art.<br>HEX · RGB · CMYK · Procreate · Adobe · Krita</p>
<div class="bar">{bar}</div><div class="by"><img src="{logo}">Pigeon Polly Art Lab</div></div></section>'''


def intro_pages(book, n, start):
    rows = ''.join(f'<li><b>{esc(nm)}</b> · palettes {it[0]["no"]:03d}–{it[-1]["no"]:03d}</li>' for nm, it in book)
    return f'''<section class="pg tx"><h1>Welcome to the palette book</h1>
<p>Every one of these {n} palettes was pulled from a real artwork by Alina Otkinska, an artist from Riga, Latvia, and the creator of Pigeon Polly Art Lab. No AI art, no random generators: just colors that already worked together on paper and canvas.</p>
<h3>How each page works</h3><ul>
<li><b>Bright accents</b> (top row): the small, lively colors that make a picture sing.</li>
<li><b>Calm base</b> (bottom row): the larger, quieter colors that hold everything together.</li>
<li><b>60 · 30 · 10 mix</b>: a ready starting point: 60% first calm color, 30% second calm color, 10% first accent.</li>
<li>Every color has a name, HEX, RGB and CMYK. CMYK values are approximate; test-print before a big print run.</li></ul>
<h3>What’s inside the download</h3><ul>
<li>This PDF (read on a tablet or print at home: US Letter, fits A4).</li>
<li><b>Procreate</b>: one .swatches file per palette. Tap a file on iPad, or drag it onto the Procreate palettes panel.</li>
<li><b>Adobe</b> (Photoshop, Illustrator, InDesign) and <b>Affinity</b>: .ase swatch libraries, one per series and one with everything.</li>
<li><b>Krita, GIMP, Inkscape</b>: .gpl palettes.</li>
<li><b>hex-codes.csv</b>: every color in one spreadsheet, for Canva, Figma or the web.</li></ul>
<h3>The series</h3><ul>{rows}</ul>
<div class="ft"><span>Pigeon Polly Art Lab</span><span>{start}</span></div></section>
<section class="pg tx"><h1>Ideas for using it</h1><ul>
<li><b>Palette challenge:</b> open a random page and paint anything at all with only those six colors.</li>
<li><b>Mood first:</b> pick a palette by feeling (cosy, spooky, calm, bold), then decide what to draw.</li>
<li><b>Mixing practice:</b> try to mix each swatch from your own paints before you look at the HEX.</li>
<li><b>Design work:</b> use the calm base for backgrounds and text, the accents for buttons and highlights.</li>
<li><b>Seasons:</b> Pumpkin Family for October, Mr.Chew for rainy days, Pigeon Polly for anything that needs a smile.</li></ul>
<h3>License</h3><p>Use the colors in anything you make, personal or commercial: colors belong to everyone. The artwork images in this book are © Alina Otkinska. Please don’t resell, share or upload this book or its files, and don’t reuse the artwork itself. Thank you for supporting an independent artist!</p>
<h3>More free palettes &amp; drawing ideas</h3><p>pigeonpolly.com/palettes · pigeonpolly.com/prompts</p>
<div class="ft"><span>Pigeon Polly Art Lab</span><span>{start + 1}</span></div></section>'''


def index_pages(items, pages_of, start):
    per = 96; out = []
    for i in range(0, len(items), per):
        rows = ''.join(f'<div class="ixr"><em>{p["no"]:03d}</em><span>{esc(p["title"]["en"])}</span><div class="dots">'
                       + ''.join(f'<i style="background:{c["hex"]}"></i>' for c in p['colors']) + f'</div><em style="text-align:right">{pages_of[p["no"]]}</em></div>' for p in items[i:i + per])
        out.append(f'<section class="pg ix"><h1>All palettes at a glance{" (cont.)" if i else ""}</h1><div class="ixg">{rows}</div>'
                   f'<div class="ft"><span>No. · name · colors · page</span><span>{start + len(out)}</span></div></section>')
    return out


def about_page(page):
    logo = (SITE / 'images/logo/round-512.png').as_uri()
    return f'''<section class="pg tx" style="display:flex;flex-direction:column;justify-content:center;text-align:center"><img src="{logo}" style="width:1.6in;margin:0 auto .3in">
<h1>Thank you!</h1><p style="max-width:5.2in;margin:0 auto">Alina Otkinska is an artist from Riga, Latvia. Pigeon Polly Art Lab is her little world of drawing challenges, free palettes, games and stories about a pigeon named Polly.</p>
<p style="margin-top:.25in"><b>pigeonpolly.com</b></p><div class="ft"><span>Pigeon Polly Art Lab</span><span>{page}</span></div></section>'''


# ---------- файлы палитр
def procreate(p):
    sw = []
    for c in p['colors']:
        h, s, v = colorsys.rgb_to_hsv(*[x / 255 for x in hx(c['hex'])])
        sw.append({'hue': h, 'saturation': s, 'brightness': v, 'alpha': 1, 'colorSpace': 0})
    b = io.BytesIO()
    with zipfile.ZipFile(b, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('Swatches.json', json.dumps([{'name': f'{p["no"]:03d} {p["title"]["en"]}', 'swatches': sw}]))
    return b.getvalue()


def ase(groups):
    def s(t): t = t + '\0'; return struct.pack('>H', len(t)) + t.encode('utf-16-be')
    blocks = []
    for gname, items in groups:
        blocks.append(struct.pack('>H', 0xC001) + struct.pack('>I', len(s(gname))) + s(gname))
        for p in items:
            for c in p['colors']:
                body = s(f'{p["no"]:03d} {c["en"]} {c["hex"].upper()}') + b'RGB ' + struct.pack('>fff', *[x / 255 for x in hx(c['hex'])]) + struct.pack('>H', 2)
                blocks.append(struct.pack('>HI', 1, len(body)) + body)
        blocks.append(struct.pack('>HI', 0xC002, 0))
    return b'ASEF' + struct.pack('>HHI', 1, 0, len(blocks)) + b''.join(blocks)


def gpl(name, items):
    lines = ['GIMP Palette', f'Name: {name}', 'Columns: 6', '#']
    for p in items:
        for c in p['colors']:
            r, g, b = hx(c['hex']); lines.append(f'{r:3d} {g:3d} {b:3d}\t{p["no"]:03d} {c["en"]} {c["hex"].upper()}')
    return '\n'.join(lines) + '\n'


def files(book, all_items):
    root = OUT / 'files'
    if root.exists(): shutil.rmtree(root)
    for si, (name, items) in enumerate(book, 1):
        sd = f'{si}-{slug(name)}'
        (root / 'procreate' / sd).mkdir(parents=True, exist_ok=True)
        (root / 'krita-gimp' / sd).mkdir(parents=True, exist_ok=True)
        for p in items:
            fn = f'{p["no"]:03d}-{slug(p["title"]["en"])}'
            (root / 'procreate' / sd / (fn + '.swatches')).write_bytes(procreate(p))
            (root / 'krita-gimp' / sd / (fn + '.gpl')).write_text(gpl(f'{p["no"]:03d} {p["title"]["en"]}', [p]), encoding='utf-8')
        (root / 'adobe-affinity').mkdir(exist_ok=True)
        (root / 'adobe-affinity' / f'{sd}.ase').write_bytes(ase([(f'{p["no"]:03d} {p["title"]["en"]}', [p]) for p in items]))
    (root / 'adobe-affinity' / '0-all-palettes.ase').write_bytes(ase([(f'{p["no"]:03d} {p["title"]["en"]}', [p]) for p in all_items]))
    (root / 'krita-gimp' / '0-all-palettes.gpl').write_text(gpl('Pigeon Polly 172 palettes', all_items), encoding='utf-8')
    with open(root / 'hex-codes.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f); w.writerow(['no', 'palette', 'series', 'role', 'color name', 'hex', 'r', 'g', 'b'])
        for p in all_items:
            for i, c in enumerate(p['colors']):
                w.writerow([p['no'], p['title']['en'], p['section'], 'accent' if i < 3 else 'base', c['en'], c['hex'].upper(), *hx(c['hex'])])
    (root / 'README.txt').write_text(
        'Pigeon Polly Art Lab: 172 Color Palettes\n\nprocreate/     one .swatches per palette: AirDrop or tap on iPad to import\n'
        'adobe-affinity/ .ase libraries: Photoshop/Illustrator Swatches panel > Import Swatches; Affinity: Swatches > Import Palette\n'
        'krita-gimp/   .gpl palettes: Krita Palette docker > Import; GIMP Palettes > Import; Inkscape: copy to palettes folder\n'
        'hex-codes.csv every color in one table\n\nColors: free for personal and commercial use. Artwork © Alina Otkinska. Please do not resell or share these files.\npigeonpolly.com\n', encoding='utf-8')
    return root


# ---------- картинки для Ko-fi и пинов
def previews(book, all_items):
    def art(p): return img(p)
    pick = lambda g, k: [p for p in all_items if p['gallery'] == g][:k]
    cards = pick('bird', 3) + pick('snail', 2) + pick('studio', 3) + pick('details', 2) + pick('halloween', 2)
    tiles = ''.join(f'<div class="t"><div class="a" style="background-image:url({art(p)})"></div>{strip(p)}<b>{esc(p["title"]["en"])}</b></div>' for p in cards)
    css = FONT_CSS + '''*{margin:0;padding:0;box-sizing:border-box}body{background:#ccc}.v{position:relative;overflow:hidden;background:#f7f3ec;color:#2b2622;font-family:Inter;margin:20px}
h1{font-family:Fraunces;font-weight:500;line-height:.95}em{font-style:italic}.strip{display:flex;height:22px;border-radius:5px;overflow:hidden;margin-top:6px}.strip i{flex:1}
.t b{display:block;font-family:Fraunces;font-weight:500;font-size:19px;margin-top:6px}.a{aspect-ratio:1;border-radius:12px;background-size:cover;background-position:center}
.tag{display:inline-block;background:#2b2622;color:#f7f3ec;border-radius:40px;padding:12px 26px;font-size:20px;letter-spacing:.08em;text-transform:uppercase}
.pgimg{border-radius:8px;box-shadow:0 20px 40px rgba(60,40,20,.28);position:absolute;background:#fff}'''
    pal = all_items[0]
    v1 = f'''<div class="v" id="pin1" style="width:1000px;height:1500px;padding:70px 64px"><div style="font-size:22px;letter-spacing:.2em;text-transform:uppercase;color:#9a8f84">Digital palette book</div>
<h1 style="font-size:150px;margin:18px 0 0">{len(all_items)}</h1><h1 style="font-size:88px"><em>color palettes</em></h1>
<p style="font-size:30px;color:#5b5049;margin:20px 0 36px">from real paintings &amp; sketchbooks</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px">{tiles[:0]}{''.join(f'<div class="t"><div class="a" style="background-image:url({art(p)})"></div>{strip(p)}</div>' for p in cards[:9])}</div>
<div style="position:absolute;bottom:60px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center"><span class="tag">Procreate · Adobe · HEX</span><span style="font-size:22px;letter-spacing:.1em;text-transform:uppercase">Pigeon Polly Art Lab</span></div></div>'''
    p2 = [p for p in all_items if p['gallery'] == 'snail'][0]
    v2 = f'''<div class="v" id="pin2" style="width:1000px;height:1500px;padding:70px 64px;background:#efe8dc"><h1 style="font-size:84px"><em>Every page:</em><br>art + 6 colors<br>with HEX, RGB, CMYK</h1>
<img class="pgimg" data-page="{p2['no']}" style="left:120px;top:470px;width:760px;transform:rotate(-3deg)">
<div style="position:absolute;bottom:60px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center"><span class="tag">{len(all_items)} palettes · PDF</span><span style="font-size:22px;letter-spacing:.1em;text-transform:uppercase">Pigeon Polly Art Lab</span></div></div>'''
    v3 = f'''<div class="v" id="pin3" style="width:1000px;height:1500px;padding:70px 64px"><h1 style="font-size:80px">Tap &amp; import<br><em>into Procreate</em></h1>
<p style="font-size:30px;color:#5b5049;margin:22px 0 40px">{len(all_items)} ready swatches + Adobe .ase + Krita .gpl + HEX list</p>
<div style="display:flex;flex-direction:column;gap:20px">{''.join(f'<div style="display:flex;align-items:center;gap:22px;background:#fff;border-radius:18px;padding:16px 20px;box-shadow:0 2px 6px rgba(0,0,0,.08)"><div class="a" style="width:120px;flex:none;background-image:url({art(p)})"></div><div style="flex:1"><b style="font-family:Fraunces;font-weight:500;font-size:30px">{esc(p["title"]["en"])}</b><div style="display:flex;gap:10px;margin-top:12px">' + ''.join(f'<i style="width:62px;height:62px;border-radius:50%;background:{c["hex"]}"></i>' for c in p["colors"]) + '</div></div></div>' for p in cards[1:8])}</div>
<div style="position:absolute;bottom:60px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center"><span class="tag">Instant download</span><span style="font-size:22px;letter-spacing:.1em;text-transform:uppercase">Pigeon Polly Art Lab</span></div></div>'''
    sq = f'''<div class="v" id="square" style="width:1600px;height:1600px;background:#2b2622"><img class="pgimg" data-page="cover" style="left:170px;top:130px;width:620px;transform:rotate(-4deg)">
<img class="pgimg" data-page="{pal['no']}" style="left:820px;top:200px;width:620px;transform:rotate(3deg)"><div style="position:absolute;left:0;right:0;bottom:110px;text-align:center;color:#f7f3ec">
<h1 style="font-size:110px">{len(all_items)} <em>Color Palettes</em></h1><p style="font-size:34px;margin-top:16px;opacity:.8">PDF · Procreate · Adobe · Krita · HEX</p></div></div>'''
    return f'<!doctype html><meta charset="utf-8"><style>{css}</style>{v1}{v2}{v3}{sq}'


def main():
    (OUT / 'img').mkdir(parents=True, exist_ok=True)
    book = load(); all_items = [p for _, it in book for p in it]
    pages = [cover(all_items)]
    start = 2
    intro_at = start; start += 2
    idx_n = (len(all_items) + 95) // 96
    idx_at = start; start += idx_n
    body, pages_of = [], {}
    for name, items in book:
        body.append(section_page(name, items, start)); start += 1
        for p in items:
            pages_of[p['no']] = start; body.append(palette_page(p, start)); start += 1
    pages += [intro_pages(book, len(all_items), intro_at)] + index_pages(all_items, pages_of, idx_at) + body + [about_page(start)]
    (OUT / 'book.html').write_text(f'<!doctype html><html lang="en"><meta charset="utf-8"><title>172 Color Palettes</title><style>{CSS}</style>' + ''.join(pages), encoding='utf-8')
    (OUT / 'previews.html').write_text(previews(book, all_items), encoding='utf-8')
    json.dump({'cover': 1, **{str(k): v for k, v in pages_of.items()}}, open(OUT / 'pages.json', 'w'))
    files(book, all_items)
    print('pages', start, 'palettes', len(all_items))


if __name__ == '__main__':
    main()
