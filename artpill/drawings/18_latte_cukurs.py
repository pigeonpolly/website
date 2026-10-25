"""18 · From life: Alina's photo from above: a cappuccino with a leaf, a cake in plastic, a sugar stick that says CUKURS.
Exercise: one drawing, three stories. Material: pastel and marker on a wash. Roots: token line, the kept mistake, absence."""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def draw(path, answer=False):
    s = Sheet(420, 540, seed=1801)
    cx, cy, R = 250, 200, 110
    cup = [(cx + R * math.cos(a), cy + R * math.sin(a)) for a in [i * 0.42 for i in range(16)]]
    s.wash(cup, "#b98a5e", alpha=0.45)
    s.ink(cup, speed=0.4, width=1.4, medium="pencil")
    # the leaf in the foam: a stem and leaves in pastel, token line
    P = lambda pts, w=1.0: s.ink(pts, speed=0.4, width=w, medium="pastel", color="#fbf3e4", tokens=True)
    P([(210, 290), (270, 150)], 1.2)
    for k in range(5):
        x, y = 220 + k * 11, 268 - k * 26
        P([(x, y), (x - 40, y - 30), (x - 30, y - 50), (x + 2, y - 10)])
        P([(x + 4, y - 4), (x + 44, y - 26), (x + 44, y - 46), (x + 8, y - 14)])
    # the cake, a log in plastic
    s.ink([(60, 330), (100, 300), (240, 470), (200, 500), (60, 330)], speed=0.3, width=1.6, tokens=True)
    s.wash([(70, 330), (100, 310), (226, 466), (200, 488)], "#5a3a26", alpha=0.6)
    # the sugar stick with its word
    s.ink([(380, 400), (396, 410), (340, 520), (324, 512), (380, 400)], speed=0.4, width=1.4)
    s.wash([(380, 402), (394, 410), (340, 516), (326, 510)], "#26221f", alpha=0.75, wet=0.3)
    word = "CUKURS"
    for i, ch in enumerate(word):
        x, y = 375 - i * 7, 420 + i * 14
        s.ink([(x - 3, y - 3), (x + 3, y + 3)], speed=0.8, width=0.9, medium="marker", color="#e8552f")
    if answer:
        # the pastel leaf vanished into the foam: light on light. But the pigment pooled into its own leaf, darker, next to mine.
        # Two leaves now, mine is the ghost. I give the found one a stem in token line, nothing more.
        # The cake's paint slid out of its plastic: the wrapper keeps the shape, the cake has left (absence).
        # The word on the stick came out as six orange ticks, the stick can't spell. So I write CUKURS once more, big
        s.ink([(196, 236), (226, 180), (256, 124)], speed=0.4, width=1.3, tokens=True)
        L = lambda pts: s.ink(pts, speed=0.5, width=1.2, medium="marker", color="#e8552f")
        x0, y0 = 300, 330
        L([(x0 + 12, y0), (x0, y0 + 2), (x0, y0 + 16), (x0 + 12, y0 + 18)])                          # C
        L([(x0 + 18, y0), (x0 + 18, y0 + 16), (x0 + 28, y0 + 16), (x0 + 28, y0)])                    # U
        L([(x0 + 34, y0), (x0 + 34, y0 + 18)]); L([(x0 + 46, y0), (x0 + 36, y0 + 9), (x0 + 46, y0 + 18)])  # K
        L([(x0 + 52, y0), (x0 + 52, y0 + 16), (x0 + 62, y0 + 16), (x0 + 62, y0)])                    # U
        L([(x0 + 68, y0 + 18), (x0 + 68, y0), (x0 + 78, y0 + 4), (x0 + 68, y0 + 9), (x0 + 78, y0 + 18)])  # R
        L([(x0 + 94, y0 + 2), (x0 + 84, y0), (x0 + 84, y0 + 9), (x0 + 94, y0 + 10), (x0 + 94, y0 + 18), (x0 + 84, y0 + 17)])  # S
    return s.save(path)

if __name__ == "__main__":
    draw("out/18r1"); draw("out/18", answer=True)
