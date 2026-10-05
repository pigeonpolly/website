# Спрайты для пасхалок: конверт, пустая чашка, кофейник, кот
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from kit import sprite
OUT = os.path.join(os.path.dirname(__file__), '../../site/images/rooms')
sprite(["wwwwwwwwwww", "wkwwwwwwwkw", "wwkwwwwwkww", "wwwkwrwkwww", "wwwwkkkwwww", "wwwwwwwwwww"],
       {'w': (250, 248, 236), 'k': (170, 160, 140), 'r': (220, 60, 60)}).save(f'{OUT}/prop-mail.png')
sprite([".wwwwww.", "wbbbbbbw.", "wwwwwwwwkk", "wwwwwwww.k", "wwwwwwwwkk", ".wwwwww..", "..wwww..."],
       {'w': (190, 50, 50), 'b': (70, 40, 30), 'k': (190, 50, 50)}).save(f'{OUT}/prop-cup.png')
sprite(["...kkkk...", "..kkkkkk..", ".gggggggg.", ".gccccccgh", "gccccccccgh", "gccccccccg.h", "gccccccccgh", ".gccccccg..", "..gggggg...", ".kkkkkkkk.."],
       {'k': (40, 40, 46), 'g': (200, 220, 230), 'c': (90, 50, 30), 'h': (40, 40, 46)}).save(f'{OUT}/prop-pot.png')
sprite(["o.....o.", "oo...oo.", "ooooooo.", "oyoooyo.", "ooopooo.", ".ooooo..", "ooooooo.", "ooooooootoo", "oooooooo..o"],
       {'o': (226, 140, 60), 'y': (40, 30, 30), 'p': (240, 140, 150), 't': (226, 140, 60)}).save(f'{OUT}/prop-cat.png')
print('ok')
# --- улики для дела о сиропе (кабинет Титоса) и портреты подозреваемых
from PIL import Image as _I, ImageDraw as _D
import numpy as _n
def _out(im):
    a = _n.asarray(im).copy(); m = a[..., 3] > 0; pp = _n.pad(m, 1)
    nb = pp[:-2, 1:-1] | pp[2:, 1:-1] | pp[1:-1, :-2] | pp[1:-1, 2:]; a[nb & ~m] = (26, 21, 40, 255); return _I.fromarray(a, 'RGBA')
def canvas(w, h): im = _I.new('RGBA', (w, h), (0, 0, 0, 0)); return im, _D.Draw(im)
im, d = canvas(16, 10); d.polygon([(1, 8), (6, 2), (14, 1), (10, 6)], fill=(230, 230, 236)); d.line([(2, 8), (13, 2)], fill=(150, 150, 160)); d.point((9, 5), fill=(200, 140, 40)); d.point((11, 3), fill=(200, 140, 40))
_out(im).save(f'{OUT}/clue-feather.png')
im, d = canvas(14, 12); d.rectangle((1, 1, 12, 11), fill=(250, 250, 244)); d.rectangle((2, 2, 11, 8), fill=(120, 110, 100))
for x, y in ((4, 6), (7, 4), (9, 6)): d.rectangle((x, y, x + 1, y + 1), fill=(250, 250, 250))
_out(im).save(f'{OUT}/clue-photo.png')
im, d = canvas(14, 8); d.rectangle((1, 1, 12, 6), fill=(240, 200, 120)); d.line([(8, 1), (8, 6)], fill=(200, 150, 80)); d.line([(3, 3), (6, 3)], fill=(120, 80, 40)); d.line([(3, 5), (6, 5)], fill=(120, 80, 40)); d.point((12, 3), fill=(0, 0, 0, 0))
_out(im).save(f'{OUT}/clue-ticket.png')
im, d = canvas(12, 8); d.ellipse((1, 1, 10, 6), fill=(214, 160, 60)); d.ellipse((3, 2, 8, 4), fill=(240, 196, 90)); d.point((6, 5), fill=(180, 110, 20))
_out(im).save(f'{OUT}/clue-lid.png')
def portrait(kind):
    im, d = canvas(32, 32); d.rectangle((0, 0, 31, 31), fill=(200, 206, 220))
    if kind == 'gull':
        d.ellipse((8, 6, 26, 24), fill=(246, 246, 250)); d.rectangle((8, 18, 26, 31), fill=(246, 246, 250)); d.polygon([(24, 14), (31, 16), (24, 18)], fill=(244, 190, 50)); d.point((29, 17), fill=(220, 60, 50))
        d.rectangle((19, 11, 20, 12), fill=(26, 21, 40)); d.polygon([(6, 20), (14, 18), (12, 31), (4, 31)], fill=(170, 176, 190)); d.rectangle((14, 26, 22, 28), fill=(60, 90, 160))
    elif kind == 'baker':
        d.ellipse((7, 9, 25, 27), fill=(236, 190, 120)); d.rectangle((6, 24, 26, 31), fill=(250, 250, 244)); d.ellipse((8, 2, 24, 12), fill=(250, 250, 244)); d.rectangle((9, 8, 23, 12), fill=(250, 250, 244))
        d.point((13, 16), fill=(26, 21, 40)); d.point((19, 16), fill=(26, 21, 40)); d.line([(13, 21), (19, 21)], fill=(160, 90, 60)); d.ellipse((10, 18, 13, 20), fill=(240, 160, 140)); d.ellipse((19, 18, 22, 20), fill=(240, 160, 140))
        for x, y in ((9, 26), (20, 28), (14, 29)): d.point((x, y), fill=(220, 210, 190))
    else:
        d.ellipse((12, 8, 30, 26), fill=(200, 140, 80)); d.ellipse((16, 12, 26, 22), fill=(170, 110, 60)); d.ellipse((19, 15, 23, 19), fill=(200, 140, 80))
        d.rectangle((2, 20, 22, 31), fill=(190, 196, 180)); d.ellipse((2, 12, 12, 24), fill=(190, 196, 180)); d.line([(5, 12), (3, 4)], fill=(150, 156, 140)); d.line([(9, 12), (10, 4)], fill=(150, 156, 140))
        d.ellipse((1, 2, 5, 6), fill=(190, 196, 180)); d.ellipse((8, 2, 12, 6), fill=(190, 196, 180)); d.line([(4, 16), (7, 17)], fill=(26, 21, 40)); d.rectangle((2, 9, 12, 12), fill=(60, 70, 110))
    _out(im).save(f'{OUT}/suspect-{kind}.png')
for k in ('gull', 'baker', 'guard'): portrait(k)
print('clues ok')
