"""08 · From life: Alina's SPG photo. Wrong hand. Only the white van; the whole building flattens to its letters."""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(760, 560, seed=808)
W = lambda pts, w=2.2: s.ink(pts, speed=0.0, width=w, passes=2, tokens=True)   # wrong hand: slow, double

# start at the right edge: parking posts
for x in (700, 640, 590):
    W([(x, 380), (x + 4, 470)], 2.6)
W([(560, 400), (760, 392)], 1.6)
# the van, boxy, too tall
W([(200, 210), (420, 200), (470, 250), (500, 300), (500, 400), (190, 410), (184, 230), (200, 210)])
W([(420, 204), (430, 290), (500, 300)], 1.8)                         # windscreen
W([(330, 210), (334, 400)], 1.4)                                       # side door seam
for cx in (260, 440):
    W([(cx + math.cos(a / 7 * 6.283) * 30, 412 + math.sin(a / 7 * 6.283) * 30) for a in range(8)], 2.4)
# the building, flattened to its letters, floating
# S
W([(120, 60), (96, 48), (76, 62), (88, 84), (116, 96), (118, 120), (92, 128), (72, 116)], 2.6)
# P
W([(150, 130), (148, 50), (184, 52), (190, 78), (152, 90)], 2.6)
# G
W([(260, 62), (236, 48), (212, 66), (210, 110), (232, 130), (260, 118), (262, 96), (240, 96)], 2.6)
# the ground, one line from the left edge
W([(0, 450), (300, 446), (560, 452)], 1.4)

# looked: the van is a loaf of bread; the parking posts read as letters "т т т".
# The letters from the sky spread down to the ground. Kept; the colour goes on the post-letters.
s.wash([(578, 386), (720, 380), (716, 474), (580, 476)], "#c8402f", alpha=0.45, wet=0.8)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/08")
