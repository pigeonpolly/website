"""19 · From life: Alina's photo of a pepper plant in front of a café window, three red peppers, lavender below.
Exercise: look in pieces (the window behind cut into its panes). Roots: token line, the kept mistake, absence."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def draw(path, answer=False):
    s = Sheet(420, 540, seed=1901)
    # the café window behind, in pencil: only its frame and a sign line, no people, no tables
    Pn = lambda pts, w=1.2: s.ink(pts, speed=0.7, width=w, medium="pencil", tokens=True)
    Pn([(20, 40), (300, 36), (304, 380), (24, 384), (20, 40)], 1.4)
    Pn([(40, 150), (220, 146)], 0.9)                                    # the sign
    # the plant: stems in brush, leaves as quick almonds
    B = lambda pts, w=1.1, c="#3f6b34": s.ink(pts, speed=0.5, width=w, medium="brush", color=c)
    B([(330, 540), (334, 300), (300, 120), (250, 20)], 1.3)
    B([(334, 330), (280, 250), (240, 230)]); B([(318, 220), (360, 120), (400, 60)])
    for (x, y, dx, dy) in ((300, 120, -60, -40), (360, 120, 40, -30), (280, 250, -50, 20), (334, 420, 50, 10), (334, 380, -60, -10), (390, 70, 20, 30)):
        s.ink([(x, y), (x + dx * 0.5 + dy * 0.3, y + dy * 0.5 - dx * 0.3), (x + dx, y + dy), (x + dx * 0.5 - dy * 0.3, y + dy * 0.5 + dx * 0.3), (x, y)],
              speed=0.6, width=1.0, medium="brush", color="#3f6b34")
    # three peppers
    for x, y in ((210, 300), (270, 250), (290, 380)):
        s.gouache([(x, y), (x + 34, y + 4), (x + 30, y + 90), (x + 12, y + 104), (x - 2, y + 86)], "#d42a1c", wet=0.4)
    # lavender: dots
    for x in range(30, 200, 22):
        s.ink([(x, 540), (x + 4, 470)], speed=0.8, width=0.8, medium="pencil", color="#7d8f7a")
        s.blot(x + 4, 466, 4, "#8a74b8", alpha=0.6)
    if answer:
        # the peppers came out flat and square, like three red lanterns, and they hang exactly where the café sign is:
        # as if the sign's letters dropped out of the window and ripened. The sign stays empty (absence), the colour is theirs.
        # One answer: a thin token line from each pepper back to the sign, the way they fell
        for x, y in ((226, 300), (286, 250), (306, 380)):
            s.ink([(x, y), (x - 40, 150)], speed=0.6, width=0.9, tokens=True)
    return s.save(path)

if __name__ == "__main__":
    draw("out/19r1"); draw("out/19", answer=True)
