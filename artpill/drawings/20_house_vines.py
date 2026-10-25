"""20 · From life: Alina's photo of an old orange house, a curly gable, dry vines over the door, a small green sign.
Exercise: wrong hand (slow, double pass). Roots: token line, the kept mistake, absence."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def draw(path, answer=False):
    s = Sheet(440, 540, seed=2001)
    W = lambda pts, w=1.5, **k: s.ink(pts, speed=0.05, width=w, passes=2, tokens=True, **k)
    s.wash([(30, 150), (130, 140), (210, 60), (290, 140), (410, 150), (410, 470), (30, 470)], "#e09a5a", alpha=0.5)
    W([(30, 470), (30, 150), (130, 140), (160, 110), (190, 70), (210, 60), (230, 70), (260, 110), (290, 140), (410, 150), (410, 470)])
    # windows: three rows, wrong hand makes them uneven
    for row, y in enumerate((180, 260, 350)):
        for x in (60, 160, 260, 340):
            if row == 2 and x == 160:
                continue                         # the door is here
            W([(x, y), (x + 44, y + 2), (x + 42, y + 56), (x + 2, y + 54), (x, y)], 1.2)
    W([(164, 360), (206, 358), (208, 470), (166, 470), (164, 360)], 1.4)       # the door
    # dry vines from the door, charcoal, both ways
    for side in (-1, 1):
        for k in range(4):
            x0 = 186 + side * 24
            s.ink([(x0, 470), (x0 + side * (20 + k * 18), 400 - k * 30), (x0 + side * (50 + k * 30), 330 - k * 10),
                   (x0 + side * (80 + k * 26), 470)], speed=0.1, width=1.0, medium="charcoal")
    s.gouache([(360, 380), (392, 378), (394, 398), (362, 400)], "#3fa35a", wet=0.2)  # the green sign
    s.ink([(0, 480), (440, 476)], speed=0.6, width=1.0)
    if answer:
        # wrong hand made the dry vines into long arches: a huge spider standing in front of the house, the door between its legs.
        # Kept. The door gets the dark, so the spider gets a body; nobody comes out of it.
        # The blue sky from the photo goes only into three windows, as reflections. The green sign stays the brightest thing
        s.wash([(166, 362), (206, 360), (206, 468), (168, 468)], "#5a3a26", alpha=0.65, wet=0.4)
        for x, y in ((60, 180), (260, 180), (160, 260)):
            s.wash([(x + 4, y + 4), (x + 40, y + 6), (x + 22, y + 30)], "#3a5fae", alpha=0.45, wet=0.4)
    return s.save(path)

if __name__ == "__main__":
    draw("out/20r1"); draw("out/20", answer=True)
