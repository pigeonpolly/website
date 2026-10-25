"""03 · From life: Alina's park photo, seen in four pieces. Each quarter drawn alone; joins don't match."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(800, 600, seed=303)
T = dict(tokens=True)
L = lambda pts, sp=0.35, w=1.8: s.ink(pts, speed=sp, width=w, **T)

# piece 1 (top left): a big crown, branches fanning up from below
L([(150, 300), (150, 220), (138, 150), (110, 70), (96, 20)], 0.25, 2.4)
L([(150, 225), (190, 160), (230, 110), (262, 60)])
L([(140, 160), (90, 120), (40, 100), (0, 96)])
L([(115, 90), (150, 50), (170, 0)], 0.5, 1.3)
L([(200, 150), (250, 150), (300, 120), (330, 90)], 0.5, 1.3)
L([(60, 110), (40, 60), (50, 20)], 0.5, 1.2)
L([(300, 300), (310, 210), (290, 150), (310, 110)], 0.4, 1.6)

# piece 2 (top right): sky mostly; a lower crown and a lamp leaning in from the right
L([(470, 300), (480, 230), (470, 190)], 0.3, 2)
L([(480, 230), (530, 190), (560, 170)])
L([(475, 205), (440, 180), (420, 170)], 0.5, 1.3)
L([(560, 300), (566, 220), (600, 180), (620, 160)], 0.4, 1.6)
L([(744, 300), (742, 140)], 0.8, 2.2)
L([(700, 142), (742, 136), (790, 140)], 0.7, 2.6)

# piece 3 (bottom left): trunks, the cut stump, a mound
L([(70, 300), (90, 420), (110, 540)], 0.25, 2.4)
L([(180, 300), (175, 420), (170, 560)], 0.25, 2.6)
L([(212, 470), (220, 400), (232, 396), (236, 470)], 0.2, 2.4)   # stump
L([(0, 560), (100, 530), (230, 500), (330, 520), (400, 560)], 0.35)
L([(260, 300), (280, 420), (300, 520)], 0.4, 1.6)

# piece 4 (bottom right): many thin trunks, the lamp again (it doesn't line up), a small house
for x in (440, 500, 560, 620):
    L([(x, 300), (x + 8, 420), (x + 2, 560)], 0.45, 1.6)
L([(706, 300), (712, 600)], 0.8, 2.2)
L([(640, 560), (640, 520), (690, 494), (760, 520), (760, 560)], 0.4, 1.6)
L([(400, 575), (800, 570)], 0.9, 1.3)

# looked: the seam at the middle shows, trunks stop and start again. Keep it.
# the stump turned into a door in the hill. Answer it: a threshold, and the colour goes inside.
L([(204, 474), (244, 472)], 0.6, 1.4)
s.wash([(214, 470), (220, 402), (232, 394), (238, 470)], "#3c5a8a", alpha=0.6, wet=0.4)
# twigs, fast, so the crowns breathe
for a, b, c in [((96, 60), (70, 30), (60, 0)), ((230, 110), (215, 70), (225, 30)), ((40, 100), (20, 130), (0, 140)),
                ((262, 60), (290, 30), (300, 0)), ((530, 190), (520, 160), (530, 130)), ((600, 180), (640, 170), (660, 150)),
                ((330, 90), (360, 80), (380, 60)), ((170, 0), (190, 30), (200, 60))]:
    L([a, b, c], 0.85, 1.0)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/03")
