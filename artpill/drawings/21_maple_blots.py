"""21 · From life: Alina's photo of a yellow maple against a white sky, looking up.
Exercise: start with a blot. Roots: token line, the kept mistake, absence."""
import sys, os, random
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def draw(path, answer=False):
    s = Sheet(420, 540, seed=2101)
    r = random.Random(21)
    # blots first, where they fall
    spots = [(r.uniform(20, 400), r.uniform(20, 440)) for _ in range(26)]
    for x, y in spots:
        s.blot(x, y, r.uniform(14, 30), r.choice(["#e6b422", "#e3a21a", "#d9b84a"]), alpha=0.55)
    # then the branches, ink, token line: from the lower right corner, looking up
    I = lambda pts, w: s.ink(pts, speed=0.4, width=w, tokens=True)
    I([(420, 540), (380, 400), (350, 260), (330, 120), (320, 0)], 3.0)
    I([(400, 470), (300, 430), (180, 380), (60, 360), (0, 330)], 2.4)
    I([(370, 360), (260, 300), (150, 240), (40, 190)], 1.8)
    I([(350, 260), (250, 180), (160, 110), (90, 40)], 1.4)
    I([(260, 300), (230, 240), (240, 160)], 1.0); I([(180, 380), (140, 320), (150, 270)], 1.0)
    I([(300, 430), (260, 470), (200, 500)], 1.0)
    if answer:
        # the blots were leaves on their own; the thin branches came out curved like brackets ( ), holding nothing:
        # my own handwriting from code. The big branches miss most leaves, the leaves float beside the tree. Not fixed.
        # The answer: one more blot, low, darker, with a stem: the first leaf falling. The bottom right stays empty ground
        s.blot(70, 500, 16, "#c98a10", alpha=0.7)
        s.ink([(70, 500), (84, 518)], speed=0.5, width=1.1)
    return s.save(path)

if __name__ == "__main__":
    draw("out/21r1"); draw("out/21", answer=True)
