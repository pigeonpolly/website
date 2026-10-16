#!/usr/bin/env python3
"""Печатает один раздел docs-файла.

  tools/sec.py docs/map.md "Общее"   — раздел до следующего заголовка того же (или старшего) уровня
  tools/sec.py docs/map.md           — раздел «Кратко» и оглавление

Заголовок ищется без учёта регистра: сначала точное совпадение, потом по началу, потом по подстроке.
"""
import re
import sys

HEAD = re.compile(r'^(#{1,6})\s+(.*?)\s*#*\s*$')


def headings(lines):
    out, fence = [], False
    for i, l in enumerate(lines):
        if l.lstrip().startswith('```'):
            fence = not fence
        elif not fence and (m := HEAD.match(l)):
            out.append((i, len(m.group(1)), m.group(2)))
    return out


def section(lines, hs, idx):
    start, lvl, _ = hs[idx]
    end = next((i for i, l2, _ in hs[idx + 1:] if l2 <= lvl), len(lines))
    return '\n'.join(lines[start:end]).rstrip()


def find(hs, q):
    q = q.strip().lower().lstrip('#').strip()
    for test in (lambda t: t == q, lambda t: t.startswith(q), lambda t: q in t):
        hit = [n for n, (_, _, t) in enumerate(hs) if test(t.lower())]
        if hit:
            return hit
    return []


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    lines = open(sys.argv[1], encoding='utf-8').read().splitlines()
    hs = headings(lines)
    if len(sys.argv) > 2:
        hit = find(hs, ' '.join(sys.argv[2:]))
        if not hit:
            sys.exit('Нет раздела. Есть:\n' + '\n'.join('  ' * (l - 1) + t for _, l, t in hs))
        if len(hit) > 1:
            print(f'(совпадений: {len(hit)}, показан первый: ' + '; '.join(hs[n][2] for n in hit) + ')\n')
        print(section(lines, hs, hit[0]))
        return
    k = find(hs, 'Кратко')
    if k:
        print(section(lines, hs, k[0]) + '\n')
    print('## Оглавление')
    for _, l, t in hs:
        print('  ' * (l - 1) + '- ' + t)


if __name__ == '__main__':
    main()
