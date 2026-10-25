#!/usr/bin/env python3
"""Пиксельные заставки плиток /about-me/ → site/images/about/*.png.

  python3 tools/about_covers.py [имя ...]   — без имён рисует все; лист — _shots/about-covers.png

Те же кисти и Полли, что в tools/game_covers.py. Холст 96×96 ×5; плитка 4:5 обрезает
по ~10 px с боков, низ закрыт подписью — главное в середине и в верхней половине.
"""
import random
import sys

from PIL import Image

from game_covers import Cv, polly, ROOT, N

OUT = ROOT / 'site' / 'images' / 'about'


def frame(cv, x, y, w, h, wood, inner):
    cv.rect(x, y, w, h, wood)
    cv.rect(x + 1, y + 1, w - 2, h - 2, inner)


def splash(cv, rnd, x, y, r, c):
    cv.disc(x, y, r, c)
    for _ in range(4):
        cv.put(x + rnd.randint(-r - 2, r + 2), y + rnd.randint(-r - 2, r + 2), c)


def sketchbook():
    """Мой скетчбук: стена с приколотыми листами эколином, раскрытый скетчбук, банки туши, Полли с кистью."""
    rnd = random.Random(7)
    cv = Cv('#4a1f4e')
    for y in range(0, 56, 4):
        for x in range((y // 4) % 2 * 3, 96, 6):
            cv.put(x, y, '#56265a')
    # гирлянда с листами
    cv.line(4, 6, 92, 10, '#2a1230')
    pages = [(10, 8, '#f2a73b', '#e05a7a'), (30, 9, '#7fb2f0', '#c48af0'), (52, 10, '#8fe0a0', '#f6c445'), (72, 10, '#e05a7a', '#7f81bf')]
    for px_, py, a, b in pages:
        cv.rect(px_, py, 14, 17, '#fbf4e2')
        splash(cv, rnd, px_ + 5, py + 6, 3, a)
        splash(cv, rnd, px_ + 9, py + 11, 2, b)
        cv.put(px_ + 6, py, '#d85a30')
        cv.put(px_ + 7, py, '#d85a30')
    # огоньки гирлянды
    for x in range(6, 92, 9):
        cv.put(x, 6 + (x - 4) * 4 // 88 + 1, '#ffe08a')
    # стол
    cv.rect(0, 50, 96, 46, '#c98a4e')
    cv.hline(0, 95, 50, '#e0a464')
    for y in range(56, 96, 6):
        cv.hline(0, 95, y, '#b87a42')
    # раскрытый скетчбук
    cv.rect(26, 44, 40, 14, '#2a1230')
    cv.rect(27, 43, 18, 14, '#fbf4e2')
    cv.rect(47, 43, 18, 14, '#fff9ec')
    cv.vline(46, 43, 56, '#d8cbb0')
    splash(cv, rnd, 34, 48, 4, '#e05a7a')
    splash(cv, rnd, 38, 51, 3, '#c48af0')
    splash(cv, rnd, 55, 49, 4, '#f2a73b')
    splash(cv, rnd, 58, 52, 2, '#d85a30')
    # банки эколина
    for bx, c in ((14, '#e05a7a'), (20, '#7fb2f0'), (80, '#f6c445')):
        cv.rect(bx, 40, 5, 10, '#cfe6ee')
        cv.rect(bx, 43, 5, 7, c)
        cv.rect(bx + 1, 38, 3, 2, '#3a2430')
        cv.put(bx, 43, '#ffffff')
    # Полли с кистью
    polly(cv, 62, 18, flip=True)
    cv.line(63, 30, 59, 41, '#d85a30')
    cv.rect(58, 41, 2, 2, '#2a1230')
    cv.put(58, 43, '#e05a7a')
    return cv


def walls():
    """На стенах и страницах: стена выставки, три картины под лампами, Полли смотрит, стопка книг."""
    cv = Cv('#efe6d6')
    for y in range(0, 60, 3):
        for x in range((y // 3) % 2 * 4, 96, 8):
            cv.put(x, y, '#e4d8c2')
    # лампы и световые пятна
    for lx in (22, 48, 74):
        cv.rect(lx - 2, 0, 5, 3, '#2b1a51')
        for y in range(3, 40):
            w = (y - 3) // 3
            for x in range(lx - w, lx + w + 1):
                if (x + y) % 3 == 0:
                    cv.put(x, y, '#fbf4e2')
    # картины
    frame(cv, 12, 12, 20, 24, '#d85a30', '#3a2775')
    cv.disc(26, 18, 2, '#f6c445')
    cv.put(16, 16, '#ffffff'); cv.put(20, 20, '#ffffff')
    cv.rect(13, 28, 18, 7, '#6fbf73')
    cv.disc(20, 29, 5, '#8e86d6', 3)
    frame(cv, 38, 8, 20, 30, '#7a5030', '#f2c9a8')
    polly(cv, 41, 16, s=1)
    cv.disc(47, 32, 6, '#e05a7a', 2)
    frame(cv, 64, 14, 20, 20, '#c8a040', '#7fd3e6')
    for y in range(20, 33):
        cv.hline(65, 83, y, '#5aa9e6' if y % 3 else '#7fd3e6')
    cv.disc(74, 24, 4, '#ffffff', 2)
    # подписи под картинами
    for x in (18, 44, 70):
        cv.rect(x, 40, 8, 3, '#fbfbf6')
    # пол
    cv.rect(0, 56, 96, 40, '#8e5e38')
    cv.hline(0, 95, 56, '#a87048')
    for x in range(0, 96, 12):
        cv.vline(x, 57, 95, '#7e5030')
    # стопка книг
    for i, (c, w) in enumerate((('#5b47c2', 18), ('#e05a7a', 16), ('#6fbf73', 19), ('#f2a73b', 15))):
        cv.rect(66 + (18 - w) // 2, 52 - i * 4, w, 4, c)
        cv.hline(67 + (18 - w) // 2, 64 + (18 - w) // 2 + w, 53 - i * 4, '#fbf4e2')
    # Полли смотрит на картины
    polly(cv, 22, 30)
    return cv


def projects():
    """Проекты: обучение и AI — вечерний класс, доска с формулами, ноутбук с роботом, Полли в шапочке выпускника."""
    rnd = random.Random(11)
    cv = Cv('#2d2560')
    for y in range(0, 60, 5):
        cv.hline(0, 95, y, '#332a6a')
    # доска
    cv.rect(8, 6, 80, 32, '#7a5030')
    cv.rect(10, 8, 76, 28, '#2f5a48')
    for x, y in ((14, 12), (14, 18)):
        cv.hline(x, x + 18, y, '#d8e8dc')
    cv.hline(14, 26, 24, '#d8e8dc')
    # схема «идея → робот»
    cv.disc(48, 18, 4, '#f6c445')
    cv.rect(47, 22, 3, 3, '#d8e8dc')
    cv.line(54, 18, 62, 18, '#d8e8dc')
    cv.put(61, 17, '#d8e8dc'); cv.put(61, 19, '#d8e8dc')
    cv.rect(66, 12, 12, 11, '#c9c2da')
    cv.rect(68, 15, 2, 2, '#2b1a51'); cv.rect(74, 15, 2, 2, '#2b1a51')
    cv.hline(69, 75, 20, '#2b1a51')
    cv.vline(72, 9, 11, '#c9c2da'); cv.put(72, 8, '#e05a7a')
    for _ in range(6):
        cv.put(rnd.randrange(12, 84), rnd.randrange(28, 34), '#9cc4ae')
    # стол
    cv.rect(0, 52, 96, 44, '#4a3a8a')
    cv.hline(0, 95, 52, '#6a5ab0')
    # ноутбук
    cv.rect(50, 34, 30, 18, '#1a1528')
    cv.rect(52, 36, 26, 14, '#7fd3e6')
    cv.rect(57, 39, 4, 4, '#2b1a51'); cv.rect(69, 39, 4, 4, '#2b1a51')
    cv.hline(60, 70, 46, '#2b1a51')
    cv.rect(46, 52, 38, 3, '#c9c2da')
    for y in range(36, 52):
        if y % 2:
            cv.put(80 + (y - 36) // 3, y, '#4f62a0')
    # Полли в шапочке
    polly(cv, 18, 26)
    cv.rect(22, 22, 16, 2, '#1a1528')
    cv.rect(26, 24, 8, 3, '#1a1528')
    cv.vline(37, 24, 28, '#f6c445'); cv.put(37, 29, '#f6c445')
    # искорки
    for x, y in ((86, 30), (44, 30), (90, 44)):
        cv.put(x, y, '#f6c445'); cv.put(x - 1, y, '#f6c445'); cv.put(x + 1, y, '#f6c445')
        cv.put(x, y - 1, '#f6c445'); cv.put(x, y + 1, '#f6c445')
    return cv


def work():
    """Сотрудничество: мастер-класс — флипчарт со скетчем, стикеры на стене, кофе, Полли с маркером."""
    cv = Cv('#f3d9c2')
    for y in range(0, 58, 6):
        for x in range((y // 6) % 2 * 6, 96, 12):
            cv.rect(x, y, 6, 6, '#eccdb2')
    # окно
    cv.rect(66, 6, 24, 22, '#fbf4e2')
    cv.rect(68, 8, 9, 8, '#9ccbee'); cv.rect(79, 8, 9, 8, '#9ccbee')
    cv.rect(68, 18, 9, 8, '#9ccbee'); cv.rect(79, 18, 9, 8, '#9ccbee')
    cv.disc(84, 11, 2, '#fff6c8')
    # стикеры
    for x, y, c in ((70, 32, '#f6c445'), (78, 34, '#8fe0a0'), (86, 31, '#f28ab2'), (74, 41, '#7fb2f0'), (83, 42, '#f6c445')):
        cv.rect(x, y, 6, 6, c)
        cv.hline(x + 1, x + 4, y + 2, '#5a5068')
    # флипчарт
    cv.line(30, 46, 24, 60, '#7a5030')
    cv.line(50, 46, 56, 60, '#7a5030')
    cv.rect(24, 8, 32, 40, '#ffffff')
    cv.rect(24, 6, 32, 3, '#5a4a6e')
    # скетч на флипчарте: домики и Полли
    cv.rect(26, 26, 8, 8, '#e05a7a'); cv.line(25, 26, 30, 21, '#2b1a51'); cv.line(30, 21, 35, 26, '#2b1a51')
    cv.rect(36, 22, 7, 12, '#7fb2f0'); cv.hline(35, 43, 22, '#2b1a51')
    cv.hline(24, 51, 34, '#2b1a51')
    cv.disc(46, 14, 3, '#f6c445')
    for x in range(25, 52, 4):
        cv.put(x, 40, '#8e86d6'); cv.put(x + 1, 40, '#8e86d6')
    cv.hline(25, 40, 43, '#c9c2da')
    # пол
    cv.rect(0, 56, 96, 40, '#9a6a44')
    cv.hline(0, 95, 56, '#b07a4c')
    # столик с кофе
    cv.rect(62, 50, 26, 3, '#7a5030')
    cv.vline(64, 53, 62, '#5a3a20'); cv.vline(85, 53, 62, '#5a3a20')
    for cx in (66, 76):
        cv.rect(cx, 44, 6, 6, '#ffffff')
        cv.rect(cx, 44, 6, 1, '#784828')
        cv.put(cx + 6, 46, '#ffffff'); cv.put(cx + 6, 47, '#ffffff')
        cv.put(cx + 2, 41, '#ffffff'); cv.put(cx + 3, 40, '#ffffff')
    # Полли с маркером
    polly(cv, 10, 32)
    cv.rect(27, 42, 4, 2, '#d85a30')
    cv.put(31, 42, '#2b1a51')
    return cv


def books():
    """Книги: книжный шкаф, торшер, Полли читает на стопке своих гайдов."""
    rnd = random.Random(13)
    cv = Cv('#1f4a52')
    for y in range(0, 58, 4):
        for x in range((y // 4) % 2 * 4, 96, 8):
            cv.put(x, y, '#245460')
    # шкаф
    cv.rect(10, 2, 76, 52, '#6a4228')
    cols = ['#e05a7a', '#7fb2f0', '#f6c445', '#6fbf73', '#c48af0', '#f29b7b', '#fbf4e2', '#5b47c2']
    for sy in (4, 21, 38):
        cv.rect(12, sy, 72, 14, '#3a2418')
        x = 13
        while x < 82:
            w = rnd.choice((2, 3, 3, 4))
            h = rnd.randint(9, 13)
            if x + w > 83:
                break
            c = rnd.choice(cols)
            cv.rect(x, sy + 14 - h, w, h, c)
            cv.hline(x, x + w - 1, sy + 15 - h + 2, '#fbf4e2' if c != '#fbf4e2' else '#c9c2da')
            x += w + (1 if rnd.random() < .2 else 0)
        cv.rect(12, sy + 14, 72, 3, '#8a5a36')
    # пол
    cv.rect(0, 58, 96, 38, '#8e5e38')
    cv.hline(0, 95, 58, '#a87048')
    # торшер
    cv.vline(78, 30, 70, '#2b1a51')
    cv.rect(72, 24, 13, 7, '#f6c445')
    cv.hline(73, 83, 24, '#fff6c8')
    cv.rect(75, 70, 7, 2, '#2b1a51')
    # стопка книг и Полли с раскрытой книгой
    for i, (c, w) in enumerate((('#5b47c2', 30), ('#e05a7a', 28), ('#f2a73b', 31))):
        cv.rect(30 + (31 - w) // 2, 58 - i * 5, w, 5, c)
        cv.hline(31 + (31 - w) // 2, 28 + (31 - w) // 2 + w, 59 - i * 5, '#fbf4e2')
    polly(cv, 32, 20)
    cv.rect(40, 34, 18, 9, '#2b1a51')
    cv.rect(41, 33, 8, 9, '#fbf4e2')
    cv.rect(50, 33, 7, 9, '#fff9ec')
    for y in (35, 37, 39):
        cv.hline(42, 47, y, '#c9c2da')
        cv.hline(51, 55, y, '#c9c2da')
    # кружка какао
    cv.rect(18, 52, 6, 6, '#e05a7a')
    cv.put(24, 54, '#e05a7a'); cv.put(24, 55, '#e05a7a')
    cv.put(20, 49, '#ffffff'); cv.put(21, 48, '#ffffff')
    return cv


SCENES = {'sketchbook': sketchbook, 'walls': walls, 'projects': projects, 'work': work, 'books': books}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    names = sys.argv[1:] or list(SCENES)
    bigs = []
    for n in names:
        cv = SCENES[n]()
        big = cv.im.resize((N * 5, N * 5), Image.NEAREST)
        big.save(OUT / f'{n}.png', optimize=True)
        bigs.append(big)
    sheet = Image.new('RGBA', (len(bigs) * 250, 250), (40, 30, 80, 255))
    for i, b in enumerate(bigs):
        sheet.paste(b.resize((240, 240), Image.NEAREST), (i * 250 + 5, 5))
    (ROOT / '_shots').mkdir(exist_ok=True)
    sheet.save(ROOT / '_shots' / 'about-covers.png')
    print('готово:', ', '.join(names))
