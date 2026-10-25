"""10 · Blind contour, from life: Alina's easel by the lake. The painter is only a shadow.
Theme noticed in my journal: I keep drawing where a person is missing."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(600, 780, seed=1010)
T = dict(tokens=True)
L = lambda pts, sp=0.3, w=1.8: s.ink(pts, speed=sp, width=w, **T)

# blind. start at the top edge: the plane's trail, the sky's own dashed line
L([(120, 0), (200, 120), (260, 200)], 0.95, 1.0)
# horizon, low and far
L([(0, 420), (200, 414), (420, 418), (600, 410)], 0.8, 1.3)
L([(0, 410), (90, 396), (180, 402), (300, 398), (440, 404)], 0.9, 1.0)      # the far forest, one pass
# the easel lid, standing up
L([(318, 470), (316, 560), (398, 562), (394, 468), (320, 470)], 0.25, 2.2)
# the box, open, the small painting on it
L([(300, 570), (296, 640), (402, 642), (400, 568)], 0.25, 2.2)
L([(306, 576), (390, 572), (392, 604), (308, 608), (306, 578)], 0.4, 1.4)
L([(286, 650), (412, 648)], 0.6, 2)
# one leg down to the bottom edge
L([(350, 652), (346, 720), (348, 780)], 0.4, 2.4)
L([(410, 650), (430, 720), (446, 780)], 0.6, 1.2)
# her shadow, from the bottom-left edge, long, the only trace of her
L([(0, 760), (120, 744), (230, 736), (290, 742)], 0.2, 3.2)
L([(0, 776), (140, 768), (260, 760)], 0.3, 2.6)
# reeds at the left, quick
for x in (20, 46, 70, 96, 120):
    L([(x, 600), (x + 10, 520), (x + 4, 470)], 0.9, 1.0)

# looked: blind, the easel became a small sitter, lid for a head, box for a body, watching the lake instead of her.
# Kept. The one colour goes only into the little painting: the lake is blue only there.
s.wash([(306, 576), (390, 572), (392, 604), (308, 608)], "#2f74b5", alpha=0.6, wet=0.35)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/10")
