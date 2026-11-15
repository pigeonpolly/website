#!/usr/bin/env python3
"""Генератор глав «Norsk med Polly»: ch/uNN.py (данные) → part-NNN-*.html.
Каждый ch/uNN.py задаёт CH (номер, место, заголовки), PAGES (список страниц из блоков ниже; можно не задавать,
если глава уже свёрстана руками в part-*.html) и CTRL (разворот самопроверки). Запуск: python3 gen.py"""
import os, re, glob, importlib.util, html

D = os.path.dirname(os.path.abspath(__file__))
PR = lambda t: f' <i class="pr">[{t}]</i>' if t else ''


def bl(t):
    """'___' → длинная линия, '__' → короткая."""
    t = t.replace('___', '<span class="blank l"></span>')
    return t.replace('__', '<span class="blank"></span>')


# ---------- блоки ----------
def opener(ch):
    return f'''<header class="opener">
    <div class="kicker">{ch["lvl"]} · {ch["n"]}. nodaļa · {ch["place"]}</div>
    <div class="num">{ch["n"]}</div>
    <h1>{ch["title"]}</h1>
    <div class="sub">{ch["lv"]}</div>
  </header>'''

def scene(name, big=True):
    return f'<div class="scene{" big" if big else ""}">{{{{{name}}}}}</div>'

def goals(items, mapname=None):
    li = ''.join(f'<li>{i}</li>' for i in items)
    m = f'<div class="map tall">{{{{{mapname}}}}}</div>' if mapname else ''
    return f'<div class="route{" r2" if mapname else " one"}"><div class="goals"><h3>Šajā nodaļā tu iemācīsies</h3><ul>{li}</ul></div>{m}</div>'

def say(text, tip=False):
    return f'<div class="say{" tip" if tip else ""}"><img src="polly-head.svg" alt="Pollijs"><div class="bubble">{text}</div></div>'

def sec(tag, h2, no, first=False):
    return f'<div class="sec{" first" if first else ""}"><span class="tag">{tag}</span><h2>{h2}</h2><span class="no">{no}</span></div>'

def p(t, cls=''):
    return f'<p{f" class={chr(34)}{cls}{chr(34)}" if cls else ""}>{t}</p>'

def h3(t):
    return f'<h3 class="sub3">{t}</h3>'

def vocab(rows):
    r = ''.join(f'<tr><td class="n">{a}</td><td class="pr">[{b}]</td><td>{c}</td></tr>' for a, b, c in rows)
    return f'<table class="vtab">{r}</table>'

def dialog(lines):
    out = []
    for who, t in lines:
        m = '' if who == 'Polly' else ' m'
        out.append(f'<p><span class="who{m}">{who}</span><span>{t}</span></p>')
    return f'<div class="dialog">{"".join(out)}</div>'

def gloss(rows):
    return '<div class="gloss">' + ''.join(f'<span><b>{a}</b>{PR(b)} — {c}</span>' for a, b, c in rows) + '</div>'

def story(paras, title=None):
    t = f'<h3 class="stitle">{title}</h3>' if title else ''
    return f'<div class="story">{t}' + ''.join(f'<p>{x}</p>' for x in paras) + '</div>'

def ans(t, label='Atbildes'):
    return f'<div class="ans"><span>{label}:</span> {t}</div>'

def ex(q, body, a=None, label='Atbildes'):
    return f'<div class="ex"><div class="q"><span class="n">0</span>{q}</div>{body}{ans(a, label) if a else ""}</div>'

def items(lst, wide=False):
    return f'<ol class="items{" wide" if wide else ""}">' + ''.join(f'<li>{bl(x)}</li>' for x in lst) + '</ol>'

def grid(lst, n=4):
    return f'<div class="grid{n}">' + ''.join(f'<div>{bl(x)}</div>' for x in lst) + '</div>'

def tf(rows):
    return '<table class="tf">' + ''.join(f'<tr><td>{i}. {r}</td><td class="box">R / G</td></tr>' for i, r in enumerate(rows, 1)) + '</table>'

def opts(t):
    return f'<p class="opts">{t}</p>'

def numans(lst):
    return ' · '.join(f'<b>{i}</b> {x}' for i, x in enumerate(lst, 1))

def gtable(rows, head=None, alt=False, hl_last=False):
    h = '<tr>' + ''.join(f'<th>{x}</th>' for x in head) + '</tr>' if head else ''
    body = ''
    for r in rows:
        cells = [f'<td>{c}</td>' for c in r]
        if hl_last:
            cells[-1] = f'<td class="hl">{r[-1]}</td>'
        body += '<tr>' + ''.join(cells) + '</tr>'
    return f'<div class="gbox{" alt" if alt else ""}"><table class="gtable">{h}{body}</table></div>'

def cmp(h, t):
    return f'<div class="cmp"><h3>{h}</h3>{t}</div>'

def warn(h, t):
    return f'<div class="warn"><h3>{h}</h3>{t}</div>'

def formula(*xs):
    return '<div class="formula">' + ''.join(f'<span>{x}</span>' for x in xs) + '</div>'

def cols(*xs):
    return '<div class="cols">' + ''.join(f'<div>{x}</div>' for x in xs) + '</div>'

def daily(sub, paras, words, exercise=''):
    ps = ''.join(f'<p>{x}</p>' for x in paras)
    ws = ''.join(f'<div><b>{a}</b>{PR(b)} {c}</div>' for a, b, c in words)
    return f'''<div class="daily"><div class="dh"><span class="tag">☕</span><h2>Som en nordmann</h2><span class="no">Diena kā norvēģim: {sub}</span></div>
    <div class="dcols"><div>{ps}</div><div class="dwords">{ws}</div></div>{exercise}</div>'''

def fact(icon, t):
    return f'<div class="fact"><div class="ic">{icon}</div><div><h3>Vai zināji?</h3>{t}</div></div>'

def notes(lst):
    return '<div class="notes"><h3>Pollija piezīmes · interesanti fakti</h3><ul>' + ''.join(f'<li>{x}</li>' for x in lst) + '</ul></div>'

def write(lines=None, tall=False):
    if tall:
        return '<div class="write tall"></div>'
    return '<div class="write">' + '<br>'.join(bl(x) for x in lines) + '</div>'

def ordbank(rows):
    return '<div class="ordbank">' + ''.join(f'<div><b>{a}</b>{PR(b)}<span></span></div>' for a, b in rows) + '</div>'

def check(lst):
    return '<div class="check">' + ''.join(f'<div>{x}</div>' for x in lst) + '</div>'

def stamp(place, n, total=20):
    return f'<div class="stamp">{place}<br><small>{n} / {total}</small></div>'


FILL = '<div class="fill"><h3>✎ Manas piezīmes</h3></div>'

# ---------- разворот самопроверки ----------
def ctrl(ch, words, sents, text_title, text, qs, qa, gram_q, gram_items, gram_a, gl=None, qtitle="Atbildi uz jautājumiem norvēģu valodā."):
    """words: [(no, pr, lv)] → перевести на латышский; sents: [(lv, no)] → перевести на норвежский;
    text: абзацы; qs/qa — вопросы и ответы; gram_*: одно задание на грамматику."""
    n = ch['n']
    w = ''.join(f'<div><b>{a}</b>{PR(b)}<span></span></div>' for a, b, c in words)
    wa = ' · '.join(f'<b>{a}</b> {c}' for a, b, c in words)
    s = ''.join(f'<li>{lv}<span class="blank l"></span></li>' for lv, no in sents)
    sa = numans([no for lv, no in sents])
    left = f'''<section class="page"><div class="run">{n}. nodaļa · {ch["title"]}</div>
  <div class="ctrlhead"><span class="tag">{n}✓</span><div><h2>Pārbaudi sevi</h2><span>Kontrolē, ko esi iemācījies. Atbildes — apgrieztas zem uzdevuma.</span></div></div>
  {ex("Iztulko vārdus latviešu valodā.", f'<div class="ordbank tr">{w}</div>', wa)}
  {ex("Iztulko teikumus norvēģu valodā.", f'<ol class="items wide tr">{s}</ol>', sa)}
  {FILL}<div class="folio"></div></section>'''
    tx = ''.join(f'<p>{x}</p>' for x in text)
    qq = ''.join(f'<li>{q}<span class="blank l"></span></li>' for q in qs)
    right = f'''<section class="page"><div class="run">Norsk med Polly · {ch["lvl"]}</div>
  <div class="ctrlhead red"><span class="tag">{n}★</span><div><h2>Kontrolloppgave</h2><span>Kontroldarbs: lasi, atbildi, raksti</span></div></div>
  <div class="story"><h3 class="stitle">{text_title}</h3>{tx}</div>{gloss(gl) if gl else ""}
  {ex(qtitle, f'<ol class="items wide">{qq}</ol>', numans(qa))}
  {ex(gram_q, items(gram_items, wide=True), numans(gram_a))}
  <div class="score">Mans rezultāts: <span></span> / {len(words) + len(sents) + len(qs) + len(gram_items)}</div>
  {FILL}<div class="folio"></div></section>'''
    return left + '\n' + right


# ---------- сборка ----------
def render_pages(ch, pages):
    out = []
    for i, blocks in enumerate(pages):
        run = '' if i == 0 else (f'<div class="run">{ch["n"]}. nodaļa · {ch["title"]}</div>' if i % 2 == 0
                                 else f'<div class="run">Norsk med Polly · {ch["lvl"]}</div>')
        fill = FILL
        out.append(f'<section class="page">{run}\n' + '\n'.join(blocks) + f'\n{fill}<div class="folio"></div></section>')
    return '\n'.join(out)


def load(path):
    spec = importlib.util.spec_from_file_location(os.path.basename(path)[:-3], path)
    m = importlib.util.module_from_spec(spec)
    m.__dict__.update({k: v for k, v in globals().items() if not k.startswith('__')})
    spec.loader.exec_module(m)
    return m


def main():
    for f in sorted(glob.glob(os.path.join(D, 'ch', 'u*.py'))):
        m = load(f)
        n = m.CH['n']
        base = os.path.join(D, f'part-{10 * (n + 1):03d}')
        if hasattr(m, 'PAGES'):
            open(base + '-a.html', 'w').write(f'<!-- {n}. nodaļa -->\n' + render_pages(m.CH, m.PAGES) + '\n')
        if hasattr(m, 'CTRL'):
            open(base + '-b.html', 'w').write(f'<!-- {n}. nodaļa: pārbaude -->\n' + m.CTRL + '\n')
        if hasattr(m, 'EXTRA'):  # тест после главы
            open(base + '-z.html', 'w').write(m.EXTRA + '\n')
    print('ok')


if __name__ == '__main__':
    main()


# ---------- pielikums: darbības vārdu tabula un vārdnīca ----------
VERBS = [
 ('å være', 'er', 'var', 'har vært', 'būt'), ('å ha', 'har', 'hadde', 'har hatt', 'būt (kādam), turēt'), ('å gjøre', 'gjør', 'gjorde', 'har gjort', 'darīt'),
 ('å si', 'sier', 'sa', 'har sagt', 'teikt'), ('å gå', 'går', 'gikk', 'har gått', 'iet'), ('å komme', 'kommer', 'kom', 'har kommet', 'nākt'),
 ('å se', 'ser', 'så', 'har sett', 'redzēt'), ('å ta', 'tar', 'tok', 'har tatt', 'ņemt'), ('å få', 'får', 'fikk', 'har fått', 'saņemt; drīkstēt'),
 ('å gi', 'gir', 'ga', 'har gitt', 'dot'), ('å vite', 'vet', 'visste', 'har visst', 'zināt'), ('å stå', 'står', 'sto', 'har stått', 'stāvēt'),
 ('å sitte', 'sitter', 'satt', 'har sittet', 'sēdēt'), ('å ligge', 'ligger', 'lå', 'har ligget', 'gulēt, atrasties'), ('å sove', 'sover', 'sov', 'har sovet', 'gulēt (miegā)'),
 ('å drikke', 'drikker', 'drakk', 'har drukket', 'dzert'), ('å spise', 'spiser', 'spiste', 'har spist', 'ēst'), ('å skrive', 'skriver', 'skrev', 'har skrevet', 'rakstīt'),
 ('å finne', 'finner', 'fant', 'har funnet', 'atrast'), ('å fly', 'flyr', 'fløy', 'har fløyet', 'lidot'), ('å bli', 'blir', 'ble', 'har blitt', 'kļūt, palikt'),
 ('å dra', 'drar', 'dro', 'har dratt', 'doties'), ('å hjelpe', 'hjelper', 'hjalp', 'har hjulpet', 'palīdzēt'), ('å synge', 'synger', 'sang', 'har sunget', 'dziedāt'),
 ('å selge', 'selger', 'solgte', 'har solgt', 'pārdot'), ('å spørre', 'spør', 'spurte', 'har spurt', 'jautāt'), ('å fortelle', 'forteller', 'fortalte', 'har fortalt', 'stāstīt'),
 ('å vinne', 'vinner', 'vant', 'har vunnet', 'uzvarēt'), ('å gråte', 'gråter', 'gråt', 'har grått', 'raudāt'), ('å le', 'ler', 'lo', 'har ledd', 'smieties'),
 ('å kunne', 'kan', 'kunne', 'har kunnet', 'varēt, prast'), ('å ville', 'vil', 'ville', 'har villet', 'gribēt'), ('å måtte', 'må', 'måtte', 'har måttet', 'vajadzēt'),
 ('å skulle', 'skal', 'skulle', 'har skullet', 'grasīties'), ('å snakke', 'snakker', 'snakket', 'har snakket', 'runāt (1. gr.)'), ('å lese', 'leser', 'leste', 'har lest', 'lasīt (2. gr.)'),
 ('å prøve', 'prøver', 'prøvde', 'har prøvd', 'mēģināt (3. gr.)'), ('å bo', 'bor', 'bodde', 'har bodd', 'dzīvot (4. gr.)'),
]
ORDER = 'abcdefghijklmnopqrstuvwxyzæøå'

def _key(w):
    w = re.sub(r'^(ei/en|en|ei|et|å)\s+', '', w.lower())
    return [ORDER.index(ch) if ch in ORDER else 99 for ch in w]

def appendix():
    rows = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td>{e}</td></tr>' for a, b, c, d, e in VERBS)
    half = len(VERBS) // 2 + 1
    def vt(lst):
        r = ''.join(f'<tr><td class="n">{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td class="lv">{e}</td></tr>' for a, b, c, d, e in lst)
        return f'<table class="verbs"><tr><th>Infinitiv</th><th>Presens</th><th>Preteritum</th><th>Perfektum</th><th>Latviešu valodā</th></tr>{r}</table>'
    out = f'''<section class="page"><div class="testhead"><h1>Verbtabell</h1><p>Svarīgākie neregulārie darbības vārdi un pa vienam piemēram no katras regulārās grupas.</p></div>
{vt(VERBS[:half])}<div class="folio"></div></section>
<section class="page"><div class="run">Verbtabell</div>{vt(VERBS[half:])}
<div class="cmp" style="margin-top:12px"><h3>Regulārās grupas</h3>1. <b>-et</b>: snakke — snakket — har snakket · 2. <b>-te</b>: spise — spiste — har spist · 3. <b>-de</b>: prøve — prøvde — har prøvd · 4. <b>-dde</b>: bo — bodde — har bodd</div>
{FILL}<div class="folio"></div></section>'''
    ents = {}
    for f in sorted(glob.glob(os.path.join(D, 'part-*.html'))):
        if os.path.basename(f).startswith('part-9'):
            continue
        s = open(f).read()
        found = re.findall(r'<tr><td class="n">(.*?)</td><td class="pr">\[(.*?)\]</td><td>(.*?)</td></tr>', s)
        found += re.findall(r'<span><b>(.*?)</b> <i class="pr">\[(.*?)\]</i> — (.*?)</span>', s)
        found += re.findall(r'<div><b>(.*?)</b> <i class="pr">\[(.*?)\]</i> (.*?)</div>', s)
        for a, b, c in found:
            a = re.sub('<.*?>', '', a).strip(); c = re.sub('<.*?>', '', c).strip()
            if '?' in a or '!' in a or len(a.split()) > 4 or a.isupper():
                continue
            ents.setdefault(a.lower(), (a, b, c))
    items_ = sorted(ents.values(), key=lambda e: _key(e[0]))
    per = 96
    first = 84
    pages = [items_[:first]] + [items_[i:i + per] for i in range(first, len(items_), per)]
    for k, chunk in enumerate(pages):
        body = ''.join(f'<div><b>{a}</b> <i>[{b}]</i> {c}</div>' for a, b, c in chunk)
        head = ('<div class="testhead"><h1>Ordliste</h1><p>Norvēģu–latviešu vārdnīca: visi grāmatas jaunie vārdi ar transkripciju.</p></div>' if k == 0
                else '<div class="run">Ordliste</div>')
        out += f'\n<section class="page">{head}<div class="gloss-list">{body}</div><div class="folio"></div></section>'
    open(os.path.join(D, 'part-900-appendix.html'), 'w').write(out + '\n')
    return len(items_), len(pages)


if __name__ == '__main__':
    print('appendix', appendix())
