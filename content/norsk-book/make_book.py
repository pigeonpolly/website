#!/usr/bin/env python3
"""Сборка книги: part-u*.html → book.html (тема D). Потом: node shoot.js ПАПКА [pdf]."""
import os, re, glob
D = os.path.dirname(os.path.abspath(__file__))
HEAD = '''<!doctype html>
<html lang="lv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Norsk med Polly</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="base.css"><link rel="stylesheet" href="theme-d.css">
</head><body><div class="book">
'''
parts = sorted(glob.glob(os.path.join(D, 'part-u*.html')), key=lambda p: int(re.search(r'u(\d+)', p)[1]))
def renum(t):
    c = [0]
    def f(m):
        c[0] += 1
        return f'<span class="n">{c[0]}</span>'
    return re.sub(r'<span class="n">\d+</span>', f, t)
body = '\n'.join(renum(open(p).read()) for p in parts)
body = re.sub(r'\{\{([\w.-]+)\}\}', lambda m: open(os.path.join(D, m[1])).read(), body)
n = [0]
def page(m):
    n[0] += 1
    return f'<section class="page {"right" if n[0] % 2 else "left"}" data-p="{n[0]}">'
body = re.sub(r'<section class="page (?:left|right)">', page, body)
k = [0]
def folio(m):
    k[0] += 1
    return f'<div class="folio">{k[0]}</div>'
body = re.sub(r'<div class="folio">\d*</div>', folio, body)
open(os.path.join(D, 'book.html'), 'w').write(HEAD + body + '\n</div></body></html>\n')
print('pages', n[0])
