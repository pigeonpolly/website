"""01 · Blind contour, from life: Alina's breakfast photo. Only the mug, and the cat's ear she left out."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(700, 560, seed=101)
T = dict(tokens=True)

# round 1, blind: the rim, going round once and a bit
s.ink([(250, 200), (300, 170), (380, 165), (440, 185), (450, 210), (410, 232), (330, 238), (262, 222), (252, 200), (275, 182)], speed=0.3, **T)
# the coffee line inside
s.ink([(285, 210), (340, 196), (410, 202)], speed=0.5, **T)
# body: left side down, bottom, right side up
s.ink([(254, 214), (258, 300), (268, 380), (300, 410), (370, 416), (420, 398), (436, 330), (446, 214)], speed=0.25, **T)
# handle
s.ink([(258, 260), (214, 262), (200, 300), (214, 340), (262, 350)], speed=0.3, **T)
# the toast, a crust at the right, lower
s.ink([(470, 400), (520, 372), (575, 350), (600, 362), (560, 395), (500, 430), (472, 432)], speed=0.45, **T)
s.ink([(520, 440), (560, 470), (610, 452), (590, 420)], speed=0.5, **T)

if "r1" in sys.argv:
    s.save(sys.argv[2]); sys.exit()

# round 2 — after looking (see journal)
# it came out too tidy, like a sewing pattern; the toast turned into a hat.
# second pass on the left side, wobblier, a hand finding the shape again
s.ink([(250, 222), (247, 290), (262, 372), (292, 404)], speed=0.1, width=1.4, **T)
# the cat she left out comes back: one ear entering from the top edge
s.ink([(520, 0), (548, 60), (566, 96), (590, 58), (612, 0)], speed=0.2, **T)
s.ink([(552, 30), (566, 70), (580, 40)], speed=0.4, width=1.2, **T)
# kept mistake: the toast-hat gets the one colour
s.wash([(468, 405), (525, 368), (600, 345), (612, 372), (600, 460), (540, 474), (470, 434)], "#c98a2e", alpha=0.5)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/01")
