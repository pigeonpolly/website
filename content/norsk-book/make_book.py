#!/usr/bin/env python3
"""Сборка книги: gen.py (главы из ch/*.py) → part-*.html (по имени файла) → book.html.
Страница 1 — правая; глава = 8 стр. и начинается слева, разворот самопроверки — последние 2 стр.
Потом: node shoot.js ПАПКА [pdf]."""
import os, re, glob, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
subprocess.run([sys.executable, os.path.join(D, 'gen.py')], check=True)
HEAD = '''<!doctype html>
<html lang="lv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Norsk med Polly</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="base.css"><link rel="stylesheet" href="theme-d.css">
</head><body><div class="book">
'''
parts = sorted(glob.glob(os.path.join(D, 'part-*.html')))
def renum(t):
    c = [0]
    def f(m):
        c[0] += 1
        return f'<span class="n">{c[0]}</span>'
    return re.sub(r'<span class="n">\d+</span>', f, t)
body = '\n'.join(renum(open(p).read()) for p in parts)
body = re.sub(r'\{\{([\w/-]+\.\w+)\}\}', lambda m: open(os.path.join(D, m[1])).read(), body)
n = [0]
def page(m):
    n[0] += 1
    return f'<section class="page {"right" if n[0] % 2 else "left"}{m[1] or ""}" data-p="{n[0]}">'
body = re.sub(r'<section class="page(?: left| right)?((?: [\w-]+)*)">', page, body)
chunks = body.split('<section ')
for i in range(1, len(chunks)):
    num = re.search(r'data-p="(\d+)"', chunks[i])[1]
    chunks[i] = re.sub(r'<div class="folio">\d*</div>', f'<div class="folio">{num}</div>', chunks[i])
body = '<section '.join(chunks)
# satura rādītājs: каждая глава — по заголовку h1 в шапке
toc = []
for m in re.finditer(r'data-p="(\d+)">\s*<header class="opener">.*?<div class="num">(.*?)</div>\s*<h1>(.*?)</h1>\s*<div class="sub">(.*?)</div>', body, re.S):
    toc.append((m[2], m[3], m[4], m[1]))
for m in re.finditer(r'data-p="(\d+)">\s*<div class="testhead"><h1>(.*?)</h1>', body, re.S):
    toc.append(('✓', m[2], '', m[1]))
toc.sort(key=lambda x: int(x[3]))
rows = ''.join(f'<div class="toc-row"><span class="tn">{a}</span><span class="tt"><b>{b}</b><i>{c}</i></span><span class="tp">{d}</span></div>' for a, b, c, d in toc)
body = body.replace('{{TOC}}', rows)
open(os.path.join(D, 'book.html'), 'w').write(HEAD + body + '\n</div></body></html>\n')
print('pages', n[0])
for a, b, c, d in toc:
    print(' ', a, b, d)
