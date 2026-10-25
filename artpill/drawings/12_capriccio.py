"""12 · v0.2. Capriccio from three of Alina's photos: the lake (easel), the sand pile from the building site, the tram.
Plus one stranger. Three drafts, then one is chosen. Roots: token line, the kept mistake, absence."""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def easel(s, x, y, k=1.0, med="ink", w=1.6):
    E = lambda pts: s.ink([(x + px * k, y + py * k) for px, py in pts], speed=0.3, width=w, medium=med, tokens=True)
    E([(0, 0), (-2, 40), (36, 40), (34, -2), (0, 0)]); E([(-6, 44), (-8, 70), (42, 70), (40, 44)]); E([(17, 72), (15, 120)])

def draft_a(path):
    """A: brush ink. The sand pile is an island in the lake, the easel on it, the tram crossing the far shore with no rails."""
    s = Sheet(560, 380, seed=1201)
    B = lambda pts, sp=0.4, w=1.4: s.ink(pts, speed=sp, width=w, medium="brush", tokens=True)
    B([(0, 170), (560, 162)], 0.9, 0.6)
    B([(40, 162), (60, 140), (130, 136), (150, 160)], 0.5, 1.0)                     # the tram, far
    B([(60, 140), (64, 126), (126, 124), (130, 136)], 0.5, 0.8)
    B([(150, 300), (230, 240), (300, 230), (380, 250), (450, 300)], 0.3, 1.8)       # island
    B([(150, 300), (450, 300)], 0.7, 1.0)
    easel(s, 290, 112, 1.0, "brush", 1.2)
    for y in (330, 350):
        B([(60, y), (180, y + 2)], 0.95, 0.6); B([(380, y - 6), (520, y - 4)], 0.95, 0.6)
    return s.save(path)

def draft_b(path):
    """B: pencil and watercolour, frame in a frame: the tram window frames the lake and the island with the easel."""
    s = Sheet(560, 380, seed=1202)
    P = lambda pts, sp=0.4, w=1.6: s.ink(pts, speed=sp, width=w, medium="pencil", tokens=True)
    s.wash([(120, 90), (460, 84), (468, 290), (124, 296)], "#7fa7c9", alpha=0.35)
    P([(100, 70), (480, 64), (490, 310), (104, 318), (100, 74)], 0.2, 2.4)          # tram window
    P([(80, 40), (510, 34)], 0.6, 1.6); P([(70, 350), (520, 344)], 0.6, 1.6)
    P([(124, 200), (466, 194)], 0.9, 1.0)
    P([(200, 290), (260, 240), (330, 236), (400, 288)], 0.3, 1.8)
    easel(s, 300, 140, 0.8, "pencil", 1.4)
    P([(300, 64), (302, 310)], 0.7, 1.2)                                            # window divider cuts the easel
    return s.save(path)

def draft_c(path):
    """C: one stranger. Gouache evening: dark water, the island, an empty easel left as paper, and a flamingo standing at it, painting."""
    s = Sheet(560, 380, seed=1203)
    s.gouache([(0, 0), (560, 0), (560, 180), (0, 186)], "#2b3a5a")
    s.gouache([(0, 186), (560, 180), (560, 380), (0, 380)], "#1f4d5c")
    s.gouache([(160, 300), (240, 238), (320, 230), (400, 250), (470, 300)], "#c9a36a")
    s.gouache([(286, 120), (322, 118), (324, 160), (288, 162)], "#f4efe4")         # the canvas: left empty, glows
    easel(s, 286, 118, 1.0, "pastel", 1.0)
    # the flamingo, pastel, one leg
    F = lambda pts, w=1.2: s.ink(pts, speed=0.3, width=w, medium="pastel", color="#ef8aa0", tokens=True)
    F([(370, 236), (372, 180)]); F([(372, 180), (350, 170), (352, 150), (380, 148), (392, 166), (372, 182)], 1.6)
    F([(380, 150), (384, 110), (370, 96), (356, 104)]); F([(356, 104), (346, 114)], 0.9)
    return s.save(path)

def final(path):
    s = Sheet(560, 380, seed=1203)
    s.gouache([(0, 0), (560, 0), (560, 180), (0, 186)], "#2b3a5a")
    s.gouache([(0, 186), (560, 180), (560, 380), (0, 380)], "#1f4d5c")
    s.gouache([(160, 300), (240, 238), (320, 230), (400, 250), (470, 300)], "#c9a36a")
    s.gouache([(286, 120), (322, 118), (324, 160), (288, 162)], "#f4efe4")
    easel(s, 286, 118, 1.0, "pastel", 1.0)
    F = lambda pts, w=1.2: s.ink(pts, speed=0.3, width=w, medium="pastel", color="#ef8aa0", tokens=True)
    F([(370, 236), (372, 180)]); F([(372, 180), (350, 170), (352, 150), (380, 148), (392, 166), (372, 182)], 1.6)
    F([(380, 150), (384, 110), (370, 96), (356, 104)]); F([(356, 104), (346, 114)], 0.9)
    # finish: the tram from the third photo on the far shore, lights on, nobody inside (absence)
    T = lambda pts, w=1.0: s.ink(pts, speed=0.5, width=w, medium="pastel", color="#f4efe4", tokens=True)
    T([(40, 176), (54, 150), (150, 146), (164, 174)]); T([(60, 160), (150, 156)], 0.6)
    for x in (70, 92, 114, 136):
        s.gouache([(x, 154), (x + 12, 154), (x + 12, 164), (x, 164)], "#e6b422", wet=0.1)
    return s.save(path)

if __name__ == "__main__":
    if "final" in sys.argv:
        final("out/12")
    else:
        out = sys.argv[1] if len(sys.argv) > 1 else "out/12"
        for k, f in (("a", draft_a), ("b", draft_b), ("c", draft_c)):
            f(out + k)
