"""11 · v0.2. From life: Alina's office desk, 17:29. Three drafts, then one is chosen.
Roots kept: token line, the kept mistake, absence."""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def ring(cx, cy, rx, ry, n=9):
    return [(cx + math.cos(a / n * 6.283) * rx, cy + math.sin(a / n * 6.283) * ry) for a in range(n + 1)]

def draft_a(path):
    """A: pencil, the flower pot alone, the obvious crop."""
    s = Sheet(480, 360, seed=1101)
    P = lambda pts, sp=0.4, w=1.6: s.ink(pts, speed=sp, width=w, medium="pencil", tokens=True)
    P([(190, 330), (180, 240), (300, 240), (290, 330), (190, 330)], 0.3, 2)
    for cx, cy, r in [(200, 150, 40), (260, 120, 46), (320, 160, 38), (240, 190, 30)]:
        P(ring(cx, cy, r, r * 0.8), 0.3)
        for a in range(0, 360, 45):
            P([(cx, cy), (cx + math.cos(math.radians(a)) * r * 0.9, cy + math.sin(math.radians(a)) * r * 0.75)], 0.8, 1)
    P([(220, 240), (230, 200)], 0.5); P([(270, 240), (262, 170)], 0.5)
    return s.save(path)

def draft_b(path):
    """B: charcoal. The clock is the subject; the flowers only push in from the left edge. Nobody at the desk."""
    s = Sheet(480, 360, seed=1102)
    C = lambda pts, sp=0.4, w=1.4: s.ink(pts, speed=sp, width=w, medium="charcoal", tokens=True)
    C([(200, 40), (460, 30), (470, 250), (210, 262), (200, 44)], 0.25, 1.6)          # the screen, big, tilted
    # 17:29 by hand
    C([(250, 110), (262, 100), (262, 170)], 0.4, 1.8)                                 # 1
    C([(282, 104), (316, 102), (292, 172)], 0.4, 1.8)                                 # 7
    s.ink([(328, 122), (329, 124)], speed=0.2, width=5, medium="charcoal"); s.ink([(330, 150), (331, 152)], speed=0.2, width=5, medium="charcoal")
    C([(346, 112), (360, 100), (378, 110), (348, 170), (382, 168)], 0.4, 1.8)         # 2
    C([(420, 132), (404, 136), (398, 116), (412, 102), (426, 114), (422, 150), (404, 172)], 0.4, 1.8)  # 9
    C([(0, 300), (480, 286)], 0.8, 1.2)                                               # desk edge
    # flowers entering from the left edge, cut by the frame
    for cx, cy, r in [(20, 140, 52), (70, 200, 40), (0, 230, 36)]:
        C(ring(cx, cy, r, r * 0.8), 0.3, 1.2)
    # an empty chair back, low right: someone just left
    C([(330, 360), (336, 300), (420, 296), (430, 360)], 0.3, 1.4)
    return s.save(path)

def draft_c(path):
    """C: marker. Cut half: three pink flower heads and the time written small in the corner, nothing else."""
    s = Sheet(480, 360, seed=1103)
    for cx, cy, r in [(150, 170, 44), (220, 140, 50), (260, 200, 40)]:
        for a in range(0, 360, 30):
            s.ink([(cx, cy), (cx + math.cos(math.radians(a)) * r, cy + math.sin(math.radians(a)) * r * 0.8)], speed=0.7, width=1.2, medium="marker", color="#e88aa5")
    s.ink([(200, 250), (196, 320)], speed=0.5, width=0.8, medium="marker", color="#4f8a3c")
    s.ink([(380, 320), (392, 312), (392, 344)], speed=0.5, width=1.2, tokens=True)
    s.ink([(402, 314), (420, 314), (408, 344)], speed=0.5, width=1.2, tokens=True)
    s.ink([(430, 318), (440, 312), (450, 320), (432, 344), (452, 344)], speed=0.5, width=1.2, tokens=True)
    s.ink([(472, 324), (462, 328), (460, 316), (468, 310), (474, 318), (470, 344)], speed=0.5, width=1.2, tokens=True)
    return s.save(path)

if __name__ == "__main__" and "final" not in sys.argv:
    out = sys.argv[1] if len(sys.argv) > 1 else "out/11"
    for k, f in (("a", draft_a), ("b", draft_b), ("c", draft_c)):
        f(out + k)

# chosen: B. Meaning: the end of a workday with nobody at the desk. Idea: the colon got lost, 17 29 is a number now, not a time.
# Mine: token line in charcoal, absence (the empty chair). The kept mistake, the lost colon, gets the accent in gouache.
def final(path):
    s = Sheet(480, 360, seed=1102)
    s.gouache([(318, 104), (340, 100), (342, 174), (320, 178)], "#e6b422", wet=0.3)
    C = lambda pts, sp=0.4, w=1.4: s.ink(pts, speed=sp, width=w, medium="charcoal", tokens=True)
    C([(200, 40), (460, 30), (470, 250), (210, 262), (200, 44)], 0.25, 1.6)
    C([(250, 110), (262, 100), (262, 170)], 0.4, 1.8)
    C([(282, 104), (316, 102), (292, 172)], 0.4, 1.8)
    C([(346, 112), (360, 100), (378, 110), (348, 170), (382, 168)], 0.4, 1.8)
    C([(420, 132), (404, 136), (398, 116), (412, 102), (426, 114), (422, 150), (404, 172)], 0.4, 1.8)
    C([(0, 300), (480, 286)], 0.8, 1.2)
    for cx, cy, r in [(20, 140, 52), (70, 200, 40), (0, 230, 36)]:
        C(ring(cx, cy, r, r * 0.8), 0.3, 1.2)
    C([(330, 360), (336, 300), (420, 296), (430, 360)], 0.3, 1.4)
    return s.save(path)

if __name__ == "__main__" and "final" in sys.argv:
    final("out/11")
