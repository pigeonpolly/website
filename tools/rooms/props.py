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
