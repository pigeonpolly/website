"""16 · From life: Alina's photo of a ginger-and-white cat on a shelf full of papers.
Exercise: the invisible (paint around it). Roots: token line, the kept mistake, absence."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

CAT = [(120, 150), (130, 112), (150, 140), (190, 138), (210, 110), (214, 150), (226, 200), (300, 230), (330, 290),
       (320, 300), (230, 300), (196, 300), (150, 300), (140, 250), (120, 200), (120, 150)]

def draw(path, answer=False):
    s = Sheet(420, 540, seed=1601)
    # the shelf is painted; the cat is not: it stays paper, the shelf goes around it
    wood = "#c99a5b"
    s.gouache([(90, 40), (360, 40), (360, 520), (90, 520)], wood)
    s.gouache([(108, 60), (342, 60), (342, 300), (108, 300)], "#7a5532")                  # the dark inside of the shelf
    s.gouache(CAT, "#fbf8f1", wet=0.3)                                                     # cat = paper
    s.gouache([(90, 300), (360, 300), (360, 318), (90, 318)], wood, wet=0.2)               # the board she sits on
    I = lambda pts, sp=0.4, w=1.4, **k: s.ink(pts, speed=sp, width=w, tokens=True, **k)
    I(CAT, 0.3, 1.5)
    # face: only two eyes
    s.ink([(150, 168), (160, 170)], speed=0.6, width=1.6); s.ink([(178, 170), (188, 168)], speed=0.6, width=1.6)
    # the tail hangs over the board
    I([(320, 296), (350, 290), (372, 266)], 0.3, 1.6)
    # papers under her: pencil, a stack, unpainted
    for y in (350, 372, 394, 420, 450):
        s.ink([(112, y), (338, y + 4)], speed=0.8, width=1.2, medium="pencil")
    I([(90, 40), (360, 40), (360, 520), (90, 520), (90, 40)], 0.4, 1.2)
    if answer:
        # with the cat as paper, the shelf became her shape: the dark box looks like a cat-shaped hole, as if she cut
        # herself out of the furniture. Only her ginger patches get paint: the ears, a spot on the back, the tail
        s.gouache([(126, 118), (132, 140), (144, 140)], "#e08a3c", wet=0.2)
        s.gouache([(206, 116), (196, 138), (210, 140)], "#e08a3c", wet=0.2)
        s.gouache([(232, 208), (296, 232), (320, 280), (262, 270)], "#e08a3c", wet=0.4)
        s.ink([(322, 296), (350, 290), (372, 266)], speed=0.4, width=4.0, medium="brush", color="#e08a3c")
        s.ink([(164, 180), (168, 186), (174, 180)], speed=0.6, width=1.1)                  # nose
    return s.save(path)

if __name__ == "__main__":
    draw("out/16r1"); draw("out/16", answer=True)
