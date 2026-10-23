#!/usr/bin/env python3
"""Пиксельные заставки карточек хаба /games/ → site/images/games/*.png.

  python3 tools/game_covers.py [имя ...]   — без имён рисует все; лист — _shots/game-covers.png

Холст 96×96 логических пикселей, ×5 → 480×480. Текста нет. Низ карточки затемняется
градиентом (.am-tile::after), иконка — в левом верхнем углу: главное — в середине.
"""
import math
import pathlib
import random
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'site' / 'images' / 'games'
N, SCALE = 96, 5


def hexc(c):
    c = c.lstrip('#')
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4)) + (255,)


class Cv:
    def __init__(self, bg='#000000'):
        self.im = Image.new('RGBA', (N, N), hexc(bg))
        self.px = self.im.load()

    def put(self, x, y, c):
        if c and 0 <= x < N and 0 <= y < N:
            self.px[int(x), int(y)] = hexc(c)

    def rect(self, x, y, w, h, c):
        for j in range(h):
            for i in range(w):
                self.put(x + i, y + j, c)

    def hline(self, x0, x1, y, c):
        for x in range(x0, x1 + 1):
            self.put(x, y, c)

    def vline(self, x, y0, y1, c):
        for y in range(y0, y1 + 1):
            self.put(x, y, c)

    def line(self, x0, y0, x1, y1, c):
        n = max(abs(x1 - x0), abs(y1 - y0), 1)
        for i in range(n + 1):
            self.put(round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n), c)

    def disc(self, cx, cy, r, c, ry=None):
        ry = ry or r
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - r) - 1, int(cx + r) + 2):
                if ((x - cx) / r) ** 2 + ((y - cy) / ry) ** 2 <= 1:
                    self.put(x, y, c)

    def sprite(self, rows, pal, x, y, s=1, flip=False):
        for j, row in enumerate(rows):
            if flip:
                row = row[::-1]
            for i, ch in enumerate(row):
                if ch in pal:
                    self.rect(x + i * s, y + j * s, s, s, pal[ch])

    def grad(self, y0, y1, cols):
        """Вертикальные полосы цветов с шахматным переходом между ними."""
        n = len(cols)
        for y in range(y0, y1):
            t = (y - y0) / max(1, y1 - y0) * n
            k = min(n - 1, int(t))
            frac = t - k
            for x in range(N):
                c = cols[k]
                if k + 1 < n and frac > .75 and (x + y) % 2 == 0:
                    c = cols[k + 1]
                self.put(x, y, c)

    def lift(self, dy):
        """Сдвинуть картинку вверх (низ карточки закрыт подписью), снизу — повтор нижних рядов (пол)."""
        if dy:
            low = self.im.crop((0, N - dy, N, N))
            self.im.paste(self.im.crop((0, dy, N, N)), (0, 0))
            self.im.paste(low, (0, N - dy))
        return self

    def save(self, name):
        big = self.im.resize((N * SCALE, N * SCALE), Image.NEAREST)
        big.save(OUT / f'{name}.png', optimize=True)
        return big


# Полли — тот же спрайт, что у питомца в подвале (site/assets/polly.js)
POLLY = [
    '......ddd.....',
    '.....dbbbd....',
    '....dbbwwbd...',
    '....dbbwkbdoo.',
    '....dbbbbbdo..',
    '...dbbbbbbd...',
    '..dbbsbbbbd...',
    '.dbbssbbbbd...',
    'dbbssbbbbbd...',
    'dbbbbbbbbd....',
    '.ddbbbbbdd....',
    '...ddddd......',
    '....o..o......',
    '...oo.oo......',
]
POLLY_FLY = POLLY[:12] + ['..............'] * 2
PCOL = {'d': '#1a1528', 'b': '#7f81bf', 's': '#5e5a9c', 'w': '#ffffff', 'k': '#1a1528', 'o': '#f2a73b'}


def polly(cv, x, y, s=2, flip=False, rows=POLLY):
    cv.sprite(rows, PCOL, x, y, s, flip)


BUTTON = ['..ooo..', '.oBBBo.', 'oBkBkBo', 'oBBBBBo', 'oBkBkBo', '.oBBBo.', '..ooo..']


def button(cv, x, y, col, dark, hole='#2a1a4a', hi=None):
    cv.sprite(BUTTON, {'o': dark, 'B': col, 'k': hole}, x, y)
    if hi:
        cv.put(x + 2, y + 1, hi)


def stars(cv, rnd, n, y1, cols=('#ffffff', '#cfc6ff')):
    for _ in range(n):
        cv.put(rnd.randrange(N), rnd.randrange(y1), rnd.choice(cols))


def rain():
    rnd = random.Random(3)
    cv = Cv()
    cv.grad(0, 96, ['#170f36', '#21154a', '#2d1d5f', '#3b2774', '#4a3287'])
    stars(cv, rnd, 26, 50)
    for cx, cy, w in ((22, 10, 9), (70, 6, 11), (88, 18, 7)):
        cv.disc(cx, cy, w, '#5a4a96', 3)
        cv.disc(cx - w // 2, cy - 1, w // 2, '#6b5aa8', 3)
        cv.disc(cx + w // 3, cy - 2, w // 2, '#6b5aa8', 3)
    cols = [('#f29b7b', '#b9583f'), ('#8fd6b4', '#3f8f6c'), ('#f28ab2', '#b04a77'), ('#7fb2f0', '#3f67a8')]
    for x, y, k in ((18, 24, 0), (40, 16, 1), (62, 28, 2), (80, 38, 3), (30, 44, 3), (70, 54, 1), (12, 58, 2), (52, 40, 0)):
        c, d = cols[k]
        for t in (1, 3):
            cv.put(x + 1 + t, y - t, '#8d7fd0')
            cv.put(x + 5 - t, y - t, '#8d7fd0')
        button(cv, x, y, c, d, hi='#ffffff')
    for x, y in ((46, 4), (86, 60)):
        for t in (1, 3):
            cv.put(x + 1 + t, y - t, '#f6d77a')
            cv.put(x + 5 - t, y - t, '#f6d77a')
        button(cv, x, y, '#f6c445', '#b8862a', hole='#8a5a10', hi='#fff6c8')
    blot = ['..kk...', '.kkkkk.', 'kkkkkkk', '.kkkkkk', 'kkkkk..', '.k.kk..', '...k...']
    for x, y in ((28, 30), (58, 10), (84, 26)):
        cv.sprite(blot, {'k': '#0d0a1c'}, x, y)
        cv.put(x + 2, y + 1, '#3a3060')
    cv.rect(0, 82, 96, 14, '#2f6a4a')
    for x in range(0, 96, 3):
        cv.put(x + (x // 3) % 2, 81, '#4f9a62')
        cv.put(x + 1, 83, '#3f8256')
    polly(cv, 34, 54)
    for y in range(87, 96, 3):
        for x in range((y // 3) % 4, 96, 7):
            cv.put(x, y, '#25563c')
    return cv


def potions():
    rnd = random.Random(5)
    cv = Cv('#1c2a2e')
    for y in range(0, 80, 6):
        off = 0 if (y // 6) % 2 else 6
        for x in range(-12, 96, 12):
            cv.rect(x + off + 1, y + 1, 10, 4, '#26383c')
            cv.hline(x + off + 1, x + off + 10, y + 1, '#2f464a')
    for sx in (6, 58):
        cv.rect(sx, 22, 34, 2, '#6b4a2e')
        cv.hline(sx, sx + 33, 24, '#3f2a1a')
    bottles = [(9, '#e06b9a'), (17, '#7fd36b'), (25, '#7fb2f0'), (33, '#f6c445'), (61, '#c48af0'), (70, '#f29b7b'), (79, '#8fe0d0'), (88, '#e06b9a')]
    for i, (bx, c) in enumerate(bottles):
        tall = i % 2
        h = 9 if tall else 7
        y0 = 22 - h
        cv.rect(bx + 1, y0, 2, 2, '#c9a27a')
        cv.rect(bx, y0 + 2, 4, h - 2, '#cfe6ee')
        cv.rect(bx, y0 + 4, 4, h - 4, c)
        cv.put(bx, y0 + 4, '#ffffff')
    for x, y in ((40, 36), (48, 30), (44, 22), (52, 16), (38, 12)):
        r = 2 if y > 20 else 1
        cv.disc(x, y, r, '#8ff07a')
        cv.put(x - 1, y - 1, '#e2ffd8')
    cv.disc(46, 50, 14, '#7cf06a', 4)
    cv.disc(46, 50, 11, '#b6ff9c', 2)
    for x, y in ((40, 49), (50, 51), (45, 48)):
        cv.disc(x, y, 1.6, '#e2ffd8')
    cv.disc(46, 62, 19, '#141018', 13)
    cv.disc(46, 59, 18, '#26202e', 10)
    cv.rect(26, 49, 41, 3, '#3a3242')
    cv.hline(28, 64, 49, '#5a5068')
    for x in (37, 52):
        cv.rect(x, 70, 3, 6, '#141018')
    for x in range(30, 64, 4):
        h = rnd.randrange(4, 8)
        cv.vline(x, 80 - h, 80, '#f2a73b')
        cv.vline(x + 1, 80 - h + 2, 80, '#f6d04d')
        cv.put(x, 80 - h - 1, '#e0602a')
    cv.rect(0, 80, 96, 16, '#2a2226')
    for x in range(0, 96, 8):
        cv.vline(x, 80, 96, '#1e181c')
    polly(cv, 70, 52)
    return cv


def pancakes():
    cv = Cv('#f2c9a0')
    for y in range(0, 62, 8):
        for x in range(0, 96, 8):
            if (x // 8 + y // 8) % 2:
                cv.rect(x, y, 8, 8, '#eab88c')
    cv.rect(62, 8, 26, 22, '#7fc4e8')
    cv.rect(62, 8, 26, 22, None)
    for x, y, w, h in ((61, 7, 28, 1), (61, 30, 28, 2), (61, 7, 1, 25), (88, 7, 1, 25), (74, 8, 1, 22), (62, 18, 26, 1)):
        cv.rect(x, y, w, h, '#ffffff')
    cv.disc(68, 13, 2, '#fff6c8')
    cv.rect(0, 62, 96, 34, '#9a5a32')
    cv.hline(0, 95, 62, '#c78452')
    cv.hline(0, 95, 63, '#b06c3e')
    for x in range(6, 96, 16):
        cv.vline(x, 66, 95, '#82482a')
    cv.disc(48, 63, 22, '#f4f1ea', 4)
    cv.disc(48, 62, 18, '#ffffff', 3)
    for i in range(6):
        y = 58 - i * 5
        cv.disc(48, y, 17 - (i % 2), '#b8742e', 3)
        cv.disc(48, y - 1, 16 - (i % 2), '#e8a94e', 2.5)
        cv.hline(36, 60, y - 2, '#f3c770')
    top = 58 - 5 * 5 - 2
    cv.disc(48, top, 13, '#9a4a1a', 2)
    for x, l in ((36, 6), (42, 10), (54, 8), (59, 5)):
        cv.vline(x, top, top + l, '#9a4a1a')
        cv.put(x, top + l + 1, '#7a3410')
    cv.rect(44, top - 4, 7, 4, '#fff1a6')
    cv.hline(44, 50, top - 4, '#ffffff')
    cv.hline(44, 50, top - 1, '#e8d070')
    berry = ['.gg.', 'rrrr', 'rwrr', 'rrrr', '.rr.']
    for x, y in ((38, top - 5), (55, top - 4)):
        cv.sprite(berry, {'g': '#4f9a3a', 'r': '#e0384a', 'w': '#ffd0d6'}, x, y)
    for x, y in ((40, top - 12), (48, top - 16), (56, top - 11)):
        cv.put(x, y, '#ffffff')
        cv.put(x + 1, y - 1, '#ffffff')
        cv.put(x, y - 2, '#ffffff')
    cv.disc(80, 70, 9, '#2a2430', 3)
    cv.disc(80, 69, 7, '#e8a94e', 2)
    cv.rect(88, 68, 8, 2, '#2a2430')
    polly(cv, 6, 42)
    hat = ['.wwww.', 'wwwwww', 'wwwwww', '.wwww.', '.wwww.', '.cccc.']
    cv.sprite(hat, {'w': '#ffffff', 'c': '#d9d2c4'}, 16, 31, 2)
    return cv


def titos():
    rnd = random.Random(7)
    cv = Cv('#211a3a')
    for y in range(0, 96, 4):
        cv.hline(0, 95, y, '#251d42')
    cv.rect(66, 6, 26, 26, '#140f28')
    cv.grad  # окно — ночь с луной
    cv.rect(67, 7, 24, 24, '#1d2a5a')
    stars(cv, rnd, 0, 0)
    for x, y in ((70, 10), (86, 12), (75, 22), (88, 26)):
        cv.put(x, y, '#ffffff')
    cv.disc(82, 15, 4, '#f6e7a8')
    cv.disc(84, 14, 3, '#1d2a5a')
    cv.rect(66, 18, 26, 1, '#140f28')
    cv.rect(78, 6, 1, 26, '#140f28')
    cv.rect(6, 10, 54, 40, '#6b4a2e')
    cv.rect(8, 12, 50, 36, '#c48a52')
    for _ in range(90):
        cv.put(rnd.randrange(8, 58), rnd.randrange(12, 48), '#b37a46')
    notes = [(12, 15, 12, 10, '#fff8e0'), (36, 14, 10, 12, '#ffffff'), (14, 32, 11, 10, '#fff2a0'), (40, 33, 13, 10, '#ffffff'), (27, 24, 9, 8, '#bfe4ff')]
    pins = []
    for x, y, w, h, c in notes:
        cv.rect(x + 1, y + 1, w, h, '#7a5432')
        cv.rect(x, y, w, h, c)
        for ly in range(y + 4, y + h - 1, 2):
            cv.hline(x + 2, x + w - 3 - (ly % 3), ly, '#9a9ab0')
        pins.append((x + w // 2, y + 1))
    cv.rect(37, 15, 8, 6, '#7f81bf')
    cv.rect(39, 16, 3, 3, '#1a1528')
    for a, b in ((0, 4), (4, 1), (4, 2), (4, 3), (2, 3)):
        (x0, y0), (x1, y1) = pins[a], pins[b]
        cv.line(x0, y0, x1, y1, '#e0384a')
    for x, y in pins:
        cv.put(x, y, '#ff6a6a')
        cv.put(x, y - 1, '#ffffff')
    cv.rect(0, 80, 96, 16, '#3a2a22')
    cv.hline(0, 95, 80, '#5a4232')
    t = {'L': '#b9a6e8', 'l': '#8e7ac8', 'k': '#1a1528', 'w': '#ffffff', 'W': '#d6d6e6', 'r': '#e0384a', 'n': '#2a2f5a', 's': '#141018'}
    body = [
        '..k......k..',
        '.kLk....kLk.',
        '.kwk....kwk.',
        '..l......l..',
        '..l......l..',
        '...l....l...',
        '..LLLLLLLL..',
        '.LLLLLLLLLL.',
        '.LLLLLLLLLL.',
        '.LLLkLLkLLL.',
        '.LLLLLLLLLL.',
        '.LLLLkkLLLL.',
        '..LLLLLLLL..',
        '...wwrrww...',
        '.wwwwrrwwww.',
        'wWwwwrrwwwWw',
        'wWwwwrrwwwWw',
        'wWwwrrrrwwWw',
        'LWwwwrrwwwWL',
        'L.wwwwwwww.L',
        '..nnnnnnnn..',
        '..nnnnnnnn..',
        '..nnn..nnn..',
        '..nnn..nnn..',
        '..nnn..nnn..',
        '.ssss..ssss.',
    ]
    cv.sprite(body, t, 62, 30, 2)
    cv.put(64 + 3 * 2, 34 + 1 * 2, '#1a1528')
    cv.disc(30, 70, 6, '#cfe6ee')
    cv.disc(30, 70, 4, '#9fd0e6')
    cv.put(28, 68, '#ffffff')
    cv.line(34, 74, 42, 82, '#6b4a2e')
    cv.line(35, 74, 43, 82, '#4a3220')
    return cv


def office():
    rnd = random.Random(11)
    cv = Cv('#d9c8f0')
    for y in range(0, 60, 2):
        if y % 6 == 0:
            cv.hline(0, 95, y, '#cfbde8')
    cv.rect(4, 6, 44, 42, '#8a5a32')
    for j in range(3):
        for i in range(4):
            x, y = 6 + i * 10, 8 + j * 13
            cv.rect(x, y, 8, 11, '#5e3a1e')
            if rnd.random() < .75:
                c = rnd.choice(['#ffffff', '#fff2c8', '#ffd6e0', '#d6ecff'])
                cv.rect(x + 1, y + 4, 6, 6, c)
                cv.line(x + 1, y + 4, x + 4, y + 6, '#9a8ab0')
                cv.line(x + 6, y + 4, x + 4, y + 6, '#9a8ab0')
    cv.rect(58, 8, 30, 22, '#ffffff')
    cv.rect(59, 9, 28, 20, '#f6f0ff')
    cv.rect(70, 12, 6, 6, '#e0384a')
    cv.rect(62, 22, 22, 1, '#b8a8d8')
    cv.rect(62, 25, 16, 1, '#b8a8d8')
    cv.rect(0, 60, 96, 36, '#7a4a2a')
    cv.hline(0, 95, 60, '#a8683e')
    cv.hline(0, 95, 61, '#8e5832')
    for i in range(5):
        x, y = 8 + i, 58 - i * 3
        cv.rect(x, y, 16, 3, ['#ffffff', '#fff2c8', '#d6ecff', '#ffd6e0', '#ffffff'][i])
        cv.hline(x, x + 15, y + 2, '#a89ac0')
    def env(x, y, c, flap='#9a8ab0'):
        cv.rect(x, y, 12, 8, c)
        cv.line(x, y, x + 6, y + 4, flap)
        cv.line(x + 11, y, x + 5, y + 4, flap)
        cv.rect(x + 9, y + 1, 2, 2, '#e0384a')
    env(64, 40, '#fff2c8')
    env(78, 50, '#d6ecff')
    env(22, 36, '#ffd6e0')
    for x, y in ((60, 36), (76, 47), (34, 33)):
        cv.put(x, y, '#ffffff')
        cv.put(x - 2, y + 1, '#ffffff')
    polly(cv, 40, 38, rows=POLLY_FLY)
    for i, (x, y) in enumerate(((36, 44), (34, 48), (36, 52))):
        cv.hline(x - 6 + i, x - 2, y, '#ffffff')
    cv.rect(62, 42, 12, 8, '#ffffff')
    cv.line(62, 42, 68, 46, '#9a8ab0')
    cv.line(73, 42, 67, 46, '#9a8ab0')
    cv.rect(52, 66, 18, 14, '#c43a3a')
    cv.rect(52, 66, 18, 3, '#e05050')
    cv.rect(56, 71, 10, 2, '#1a1528')
    return cv


def wobbleland():
    rnd = random.Random(13)
    cv = Cv('#3d7fc4')
    for y in range(N):
        for x in range(N):
            if (x * 3 + y * 7) % 23 == 0:
                cv.put(x, y, '#5a9ad8')
    blob = [(46, 50, 34, 26), (30, 40, 18, 16), (64, 36, 18, 14), (58, 64, 16, 12), (24, 64, 12, 9)]
    for cx, cy, rx, ry in blob:
        cv.disc(cx, cy, rx + 3, '#e8d49a', ry + 3)
    for cx, cy, rx, ry in blob:
        cv.disc(cx, cy, rx, '#6fb85a', ry)
    for _ in range(140):
        x, y = rnd.randrange(14, 86), rnd.randrange(24, 80)
        if cv.px[x, y][:3] == hexc('#6fb85a')[:3]:
            cv.put(x, y, '#5ea64c')
    cv.disc(70, 34, 9, '#8a8a9a', 7)
    for i in range(9):
        cv.line(62 + i, 40 - i // 2, 70, 27, '#8a8a9a')
    cv.line(70, 27, 76, 36, '#6a6a7a')
    cv.disc(70, 29, 2, '#ffffff')
    cv.disc(38, 56, 7, '#3d7fc4', 4)
    cv.disc(37, 55, 3, '#5a9ad8', 2)
    trees = ((22, 38), (26, 44), (32, 36), (56, 70), (62, 66), (50, 40), (80, 52), (18, 66))
    for x, y in trees:
        cv.disc(x, y, 2, '#2f7a3a')
        cv.put(x - 1, y - 1, '#4f9a4a')
        cv.put(x, y + 3, '#6b4a2e')
    house = ['.rr.', 'rrrr', 'wwww', 'wdww']
    roofs = ['#e0384a', '#f2a73b', '#7f81bf', '#e06b9a']
    towns = ((30, 46), (48, 46), (58, 54), (44, 62), (66, 64), (24, 62), (76, 44), (54, 30), (36, 34), (60, 44), (52, 70))
    path = [(31, 49), (49, 49), (59, 57), (45, 65), (25, 65)]
    for (x0, y0), (x1, y1) in zip(path, path[1:]):
        n = max(abs(x1 - x0), abs(y1 - y0))
        for i in range(0, n, 2):
            cv.put(x0 + (x1 - x0) * i // n, y0 + (y1 - y0) * i // n, '#f6e7c0')
    for i, (x, y) in enumerate(towns):
        cv.sprite(house, {'r': roofs[i % 4], 'w': '#fff8e8', 'd': '#6b4a2e'}, x, y)
    boat = ['..w...', '..ww..', '..www.', 'bbbbbb', '.bbbb.']
    cv.sprite(boat, {'w': '#ffffff', 'b': '#8a5a32'}, 80, 72)
    cv.sprite(boat, {'w': '#ffffff', 'b': '#8a5a32'}, 12, 20)
    for x in (78, 86):
        cv.hline(x, x + 3, 79, '#8fc0ec')
    polly(cv, 62, 10, rows=POLLY_FLY, s=1)
    cr = 7
    cx, cy = 86, 14
    cv.disc(cx, cy, cr, '#fff8e8')
    cv.disc(cx, cy, cr - 1, '#f6e7c0')
    cv.line(cx, cy - cr + 1, cx, cy + cr - 1, '#8a5a32')
    cv.line(cx - cr + 1, cy, cx + cr - 1, cy, '#8a5a32')
    cv.line(cx, cy - cr + 1, cx, cy - 1, '#e0384a')
    return cv


def advent():
    rnd = random.Random(17)
    cv = Cv()
    cv.grad(0, 96, ['#14103a', '#1c1650', '#262064', '#302a78'])
    stars(cv, rnd, 20, 40)
    cv.rect(14, 18, 62, 58, '#5a3a1e')
    cv.rect(16, 20, 58, 54, '#8a5a32')
    cols = ['#c43a3a', '#2f7a4a', '#c43a3a', '#d9a03a']
    for j in range(4):
        for i in range(4):
            x, y = 19 + i * 14, 23 + j * 13
            c = cols[(i + j) % 4]
            if (i, j) == (2, 1):
                cv.rect(x, y, 11, 10, '#ffe9a0')
                cv.rect(x + 1, y + 1, 9, 8, '#fff6d0')
                cv.rect(x + 3, y + 4, 5, 5, '#e06b9a')
                cv.vline(x + 5, y + 4, y + 8, '#ffd84a')
                cv.hline(x + 3, x + 7, y + 6, '#ffd84a')
                cv.put(x + 4, y + 3, '#ffd84a')
                cv.put(x + 6, y + 3, '#ffd84a')
                cv.rect(x - 4, y, 4, 10, c)
                cv.vline(x - 4, y, y + 9, '#1a1528')
                continue
            cv.rect(x, y, 11, 10, c)
            cv.hline(x, x + 10, y, '#ffffff' if c == '#d9a03a' else '#e8b0a0' if c == '#c43a3a' else '#7fc49a')
            cv.put(x + 8, y + 5, '#ffd84a')
            if (i * 7 + j * 3) % 5 == 0:
                cv.put(x + 5, y + 3, '#ffd84a')
                cv.hline(x + 4, x + 6, y + 4, '#ffd84a')
                cv.put(x + 5, y + 5, '#ffd84a')
    star = ['...y...', '..yyy..', 'yyyyyyy', '.yyyyy.', '.yy.yy.', 'y.....y']
    cv.sprite(star, {'y': '#ffd84a'}, 42, 10)
    cv.put(45, 12, '#ffffff')
    for x in range(12, 80, 4):
        cv.put(x, 17, '#ffffff')
        cv.put(x + 1, 16, '#f4f7fb')
    cv.rect(0, 80, 96, 16, '#e6eef7')
    for x in range(0, 96, 2):
        cv.put(x, 79 - (x // 6) % 2, '#f4f7fb')
    for _ in range(46):
        x, y = rnd.randrange(N), rnd.randrange(78)
        if not (14 <= x < 76 and 18 <= y < 76):
            cv.put(x, y, '#ffffff')
            if rnd.random() < .3:
                cv.put(x + 1, y, '#cfd8ff')
    polly(cv, 66, 52, flip=True)
    hat = ['....w', '...rr', '..rrr', '.rrrr', 'wwwww']
    cv.sprite(hat, {'r': '#e0384a', 'w': '#ffffff'}, 70, 44, 2)
    return cv


def shift():
    """«Смена с Полли»: стена кабинета, дипломы, Полли в галстуке за столом, таймер на столе, ноты."""
    cv = Cv('#e2d2aa')
    for y in range(0, 62, 2):
        for x in range(0, 96, 7):
            if (x * 3 + y * 5) % 11 == 0:
                cv.put(x, y, '#d4c296')
    cv.rect(0, 56, 96, 2, '#b89a70')
    for i, (y, c) in enumerate(((6, '#7a5030'), (24, '#c8a040'))):
        cv.rect(6, y, 16, 13, c)
        cv.rect(7, y + 1, 14, 11, '#fcf6e4')
        cv.hline(9, 18, y + 4, '#5a5068')
        cv.hline(9, 16, y + 7, '#b4aaa0')
        cv.disc(17, y + 9, 1.5, '#e0384a' if i == 0 else '#3c6ec8')
    # окно с жалюзи справа
    cv.rect(62, 6, 30, 30, '#f4f4ee')
    cv.rect(64, 8, 26, 26, '#9ccbee')
    for y in range(8, 22, 3):
        cv.hline(64, 89, y, '#ece4c8')
    # Полли (спрайт ×2) с красным галстуком
    polly(cv, 30, 25)
    cv.rect(41, 40, 2, 2, '#a01e30')
    cv.rect(41, 42, 2, 6, '#d0303c')
    cv.put(41, 44, '#f0c850')
    # стол
    cv.rect(0, 50, 96, 4, '#b07a4c')
    cv.hline(0, 95, 50, '#c88e5c')
    cv.rect(0, 54, 96, 42, '#8e5e38')
    cv.rect(60, 60, 30, 9, '#a06a40')
    cv.rect(60, 72, 30, 9, '#a06a40')
    cv.hline(72, 78, 64, '#e0c890')
    cv.hline(72, 78, 76, '#e0c890')
    # ретро-таймер «20:00»
    cv.rect(8, 37, 26, 14, '#1a1528')
    cv.rect(9, 38, 24, 12, '#d8d0c0')
    cv.rect(11, 40, 20, 8, '#20302a')
    digits = {'2': '111001111100111', '0': '111101101101111', ':': '000010000010000'}
    for i, ch in enumerate('20:00'):
        f = digits[ch]
        for j in range(15):
            if f[j] == '1':
                cv.put(12 + i * 4 + j % 3, 41 + j // 3, '#8cf0a8')
    # кружка с кофе
    cv.rect(52, 42, 6, 8, '#ffffff')
    cv.rect(52, 42, 6, 1, '#784828')
    cv.put(58, 45, '#ffffff')
    cv.put(58, 46, '#ffffff')
    for y in (36, 38):
        cv.put(54, y, '#ffffff')
        cv.put(55, y - 1, '#ffffff')
    # ноты
    note = ['..kk', '..k.', '..k.', 'kkk.', 'kkk.']
    cv.sprite(note, {'k': '#3c2a6e'}, 70, 40)
    cv.sprite(note, {'k': '#3c2a6e'}, 80, 30)
    return cv


SCENES = {'rain': rain, 'potions': potions, 'pancakes': pancakes, 'titos': titos,
          'polly-office': office, 'shift': shift, 'wobbleland': wobbleland, 'advent': advent}
LIFT = {'rain': 8, 'potions': 6, 'pancakes': 4, 'titos': 6, 'polly-office': 6, 'shift': 4, 'advent': 8}

if __name__ == '__main__':
    names = sys.argv[1:] or list(SCENES)
    bigs = [SCENES[n]().lift(LIFT.get(n, 0)).save(n) for n in names]
    sheet = Image.new('RGBA', (len(bigs) * 250, 250), (40, 30, 80, 255))
    for i, b in enumerate(bigs):
        sheet.paste(b.resize((240, 240), Image.NEAREST), (i * 250 + 5, 5))
    (ROOT / '_shots').mkdir(exist_ok=True)
    sheet.save(ROOT / '_shots' / 'game-covers.png')
    print('готово:', ', '.join(names))
