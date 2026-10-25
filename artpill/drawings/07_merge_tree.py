"""07 · Two things that don't belong: a birch (Alina's lake photo) and git branches. Trees never merge back; this one does."""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(640, 760, seed=707)
T = dict(tokens=True)
L = lambda pts, sp=0.35, w=1.8: s.ink(pts, speed=sp, width=w, **T)
def dot(x, y, r=6):
    L([(x + math.cos(a / 7 * 6.283) * r, y + math.sin(a / 7 * 6.283) * r) for a in range(8)], 0.5, 1.6)

# trunk = main, from the bottom edge, birch-white: two sides
L([(300, 760), (296, 600), (306, 440), (300, 300), (310, 140), (304, 40)], 0.3, 2.2)
L([(330, 760), (326, 600), (334, 440), (326, 300), (330, 150)], 0.3, 2.2)
# birch marks, short and fast
for y in (700, 640, 560, 470, 380, 320, 230):
    L([(302, y), (322, y - 4)], 0.9, 2.6)
# a branch goes off to the left and comes back (a merge)
L([(300, 560), (230, 500), (200, 420), (230, 340), (300, 300)], 0.4, 1.6)
# a branch goes right, splits, one half returns, one half leaves the page
L([(330, 470), (420, 420), (470, 340), (440, 250), (330, 200)], 0.4, 1.6)
L([(470, 340), (560, 300), (640, 290)], 0.5, 1.4)
# commits
for x, y in [(300, 640), (214, 460), (214, 380), (304, 380), (446, 400), (462, 300), (560, 300), (306, 120)]:
    dot(x, y)
# the lake line, low, from the left edge
L([(0, 690), (180, 694), (270, 690)], 0.9, 1.2)
L([(360, 692), (640, 686)], 0.9, 1.2)

# looked: the commits broke into little flags, they read as leaves. The trunk is a ladder.
# Answer: the commits are leaves now, October ones. One has dropped toward the lake.
dot(380, 620, 6)
L([(372, 640), (390, 660), (376, 676)], 0.6, 1.0)
for x, y in [(300, 640), (214, 460), (214, 380), (304, 380), (446, 400), (462, 300), (560, 300), (306, 120), (380, 620)]:
    s.blot(x, y, 9, "#d9772b", alpha=0.6)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/07")
