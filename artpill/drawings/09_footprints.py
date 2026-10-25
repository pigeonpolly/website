"""09 · Memory: my last three were mid-size things near the middle. Break it: an almost empty page.
Polly isn't here, only where she walked."""
import sys, os, math, random
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(760, 560, seed=909)
rr = random.Random(9)
def foot(x, y, ang, sz=11):
    # three toes forward and one back, a quick mark
    for da in (-0.45, 0, 0.45):
        a = ang + da
        s.ink([(x, y), (x + math.cos(a) * sz, y + math.sin(a) * sz)], speed=0.85, width=1.5, tokens=True)
    s.ink([(x, y), (x - math.cos(ang) * sz * 0.6, y - math.sin(ang) * sz * 0.6)], speed=0.85, width=1.3, tokens=True)

# a walk from the bottom-left corner, wandering, stopping once, then out of the top edge
path = [(20, 540), (60, 510), (90, 500), (110, 470), (150, 455), (170, 430), (176, 400), (210, 392), (214, 392),
        (240, 370), (290, 350), (330, 310), (390, 300), (420, 250), (470, 230), (500, 180), (560, 150), (580, 100),
        (640, 70), (660, 20)]
for i, (x, y) in enumerate(path):
    nx, ny = path[min(i + 1, len(path) - 1)]
    ang = math.atan2(ny - y, nx - x) if (nx, ny) != (x, y) else -1.0
    side = 7 if i % 2 else -7
    foot(x - math.sin(ang) * side, y + math.cos(ang) * side, ang)

# looked: the toes point backwards. She didn't leave through the top: she came in from there and went to the corner.
# Kept. Where she stopped, she dropped a feather; the colour goes there.
s.ink([(232, 432), (250, 440), (276, 442), (300, 432)], speed=0.4, width=1.6, tokens=True)
for i in range(6):
    x = 238 + i * 10
    s.ink([(x, 437 + i * 0.6), (x + 6, 424)], speed=0.9, width=0.9, tokens=True)
    s.ink([(x, 439 + i * 0.6), (x + 7, 452)], speed=0.9, width=0.9, tokens=True)
s.wash([(232, 432), (262, 420), (300, 428), (290, 452), (250, 452)], "#7d6f9c", alpha=0.45, wet=0.5)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/09")
