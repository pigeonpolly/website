"""05 · Start with a blot. The blot is random (I don't choose it); then I find what it is."""
import sys, os, random, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(760, 560, seed=505)
T = dict(tokens=True)
L = lambda pts, sp=0.35, w=1.8: s.ink(pts, speed=sp, width=w, **T)
rr = random.Random(5)
cx, cy = rr.uniform(250, 500), rr.uniform(200, 360)
pts = [(cx + math.cos(a / 11 * 6.283) * rr.uniform(60, 190), cy + math.sin(a / 11 * 6.283) * rr.uniform(40, 130)) for a in range(11)]
s.wash(pts, "#4f6d4a", alpha=0.5, wet=1.6)   # the one colour comes first this time

if "r1" in sys.argv:
    s.save(sys.argv[2]); sys.exit()

# looked: the paint went glitchy, in stripes (my hand's own mistake; kept).
# The blot is an island with one peak. Not a character this time: a map.
# the ferry route from the left edge, a token line is already a map's dashed line
L([(0, 470), (120, 450), (200, 400), (250, 340), (272, 300)], 0.6, 1.4)
# a small boat on it
L([(150, 432), (178, 432), (172, 442), (156, 442), (150, 432)], 0.4, 1.6)
L([(164, 432), (164, 414), (176, 428)], 0.5, 1.2)
# X on the dark pool
L([(430, 290), (452, 312)], 0.7, 2.4)
L([(452, 288), (430, 312)], 0.7, 2.4)
# "here", by hand, with an arrow
L([(560, 150), (560, 200)], 0.5, 2)                              # h
L([(560, 178), (572, 168), (584, 176), (584, 200)], 0.4, 2)
L([(596, 186), (620, 184), (614, 170), (600, 172), (596, 190), (606, 202), (622, 198)], 0.4, 2)   # e
L([(632, 170), (634, 202)], 0.5, 2)                              # r
L([(634, 182), (644, 170), (656, 172)], 0.4, 2)
L([(664, 186), (688, 184), (682, 170), (668, 172), (664, 190), (674, 202), (690, 198)], 0.4, 2)   # e
L([(600, 214), (560, 250), (470, 286)], 0.5, 1.6)                # arrow
L([(486, 270), (466, 288), (490, 294)], 0.6, 1.6)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/05")
