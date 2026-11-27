#!/usr/bin/env python3
"""Уровень норвежского слова по учебнику /norsk/ (content/norsk/a1…c2.js, поле words).
python3 tools/norsk_level.py bær multebær "en hytte"   → слово, уровень, урок, перевод (RU)
python3 tools/norsk_level.py --list A1 | wc -l         → все слова уровня
Нет в учебнике — «—»: уровень ставить по смыслу и помечать «~»."""
import ast, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent / 'content' / 'norsk'
ART = re.compile(r'^(en|ei|et|å)\s+')

def load():
    out = []
    for f in ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']:
        lvl, uid = f.upper(), ''
        for line in (ROOT / f'{f}.js').read_text(encoding='utf-8').splitlines():
            m = re.search(r"id: '([^']+)', lvl: '([A-C][12])'", line)
            if m:
                uid, lvl = m.group(1), m.group(2)
            m = re.match(r'\s*words:\s*(\[.*\]),?\s*$', line)
            if m:
                try:
                    for w in ast.literal_eval(m.group(1)):
                        out.append((w[0], lvl, uid, w[1]))
                except Exception:
                    pass
    return out

def norm(s):
    return ART.sub('', s.strip().lower())

def main(a):
    words = load()
    if a[:1] == ['--list']:
        for w, l, u, ru in words:
            if l == a[1].upper():
                print(w)
        return
    for q in a:
        hits = [x for x in words if norm(x[0]) == norm(q)]
        if not hits:
            print(f'{q}\t—\t(нет в учебнике)')
        for w, l, u, ru in hits[:2]:
            print(f'{q}\t{l}\t{u}\t{w} — {ru}')

if __name__ == '__main__':
    main(sys.argv[1:] or ['hei'])
