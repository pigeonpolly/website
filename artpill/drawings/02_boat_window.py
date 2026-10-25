"""02 · From life: Alina's photo from the car window. 30 seconds: 12 strokes. Start at an edge."""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(760, 520, seed=202)
T = dict(tokens=True)
def ring(cx, cy, r, k=1.15):
    return [(cx + math.cos(a / 8 * 6.283) * r * (1 + 0.08 * (a % 3 - 1)), cy + math.sin(a / 8 * 6.283) * r) for a in range(int(9 * k))]

# I see through a frame. Start at the left edge: the window pillar.
s.ink([(0, 70), (40, 200), (90, 360), (125, 520)], speed=0.2, width=2.4, **T)        # 1
s.ink([(0, 470), (300, 452), (760, 430)], speed=0.9, **T)                             # 2
s.ink([(62, 250), (168, 236), (192, 300), (150, 346), (70, 338), (50, 290), (64, 254)], speed=0.35, **T)  # 3 mirror
s.ink([(78, 312), (118, 296), (166, 312)], speed=0.6, width=1.3, **T)                 # 4 a car in the mirror
s.ink([(330, 200), (450, 186), (600, 228), (760, 246)], speed=0.4, **T)               # 5 cover
s.ink([(318, 262), (420, 300), (600, 338), (760, 352)], speed=0.4, **T)               # 6 hull
s.ink([(332, 200), (302, 232), (318, 262)], speed=0.3, **T)                           # 7 nose
s.ink(ring(422, 332, 32), speed=0.3, **T)                                             # 8
s.ink(ring(622, 388, 36), speed=0.3, **T)                                             # 9
s.ink([(296, 330), (520, 365), (760, 402)], speed=0.85, **T)                          # 10 bar
s.ink([(472, 192), (466, 250), (456, 306)], speed=0.5, **T)                           # 11 strap
s.ink([(642, 236), (634, 290), (622, 346)], speed=0.5, **T)                           # 12 strap

# looked: the boat became a fish swimming out of the frame, the wheels a toy's. 12 strokes used, so no more lines.
# kept mistake: the fish-boat gets the yellow, more yellow than in life
s.wash([(300, 236), (330, 196), (450, 182), (600, 226), (760, 244), (760, 354), (600, 342), (420, 304), (316, 266)], "#e3b21f", alpha=0.55)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/02")
