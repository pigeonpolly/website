"""04 · Ordinary object with a job. From my own room (a terminal): the blinking cursor as a night watchman."""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(800, 560, seed=404)
T = dict(tokens=True)
L = lambda pts, sp=0.35, w=1.8: s.ink(pts, speed=sp, width=w, **T)

# start at the left edge: the prompt line, long, the whole night long
L([(0, 420), (260, 416), (520, 422), (800, 418)], 0.9, 1.4)
# the dollar sign, by hand, too big
L([(80, 300), (60, 290), (40, 300), (44, 330), (78, 350), (84, 380), (64, 392), (36, 382)], 0.3, 2.6)
L([(60, 270), (58, 410)], 0.6, 2)
# the cursor: an upright block, walking right, a bit tired
L([(430, 250), (432, 380), (490, 384), (486, 254), (432, 250)], 0.2, 2.6)
L([(446, 384), (440, 416)], 0.4, 2.2)
L([(476, 384), (488, 414)], 0.4, 2.2)
# it holds a stick with a lantern
L([(488, 300), (540, 296), (560, 280)], 0.4, 1.8)
L([(560, 280), (560, 300)], 0.5, 1.2)
L([(548, 300), (572, 300), (576, 330), (546, 332), (548, 302)], 0.3, 1.8)
# night: three stars that are asterisks
for cx, cy, r in [(640, 90, 10), (720, 160, 7), (300, 70, 8)]:
    for a in range(3):
        ang = a * math.pi / 3 + 0.3
        L([(cx - math.cos(ang) * r, cy - math.sin(ang) * r), (cx + math.cos(ang) * r, cy + math.sin(ang) * r)], 0.8, 1.6)

# looked: the block went soft like a marshmallow, the lantern became a handbag.
# He is walking away from the dollar, with a handbag. Keep it.
# a cursor blinks: the last blink stays behind, faint, one step back
s.ink([(330, 256), (332, 382), (386, 384), (384, 258), (332, 254)], speed=0.9, width=0.9, color="#8a847c", tokens=True)
# kept mistake: the handbag gets the colour
s.wash([(544, 298), (580, 296), (582, 334), (542, 336)], "#c0392b", alpha=0.55, wet=0.4)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/04")
