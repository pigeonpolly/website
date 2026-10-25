"""15 · From life: Alina's photo of a lake, a far shore and black cows grazing.
Exercise: 30 seconds (twelve strokes). Roots: token line, the kept mistake, absence."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def draw(path, answer=False):
    s = Sheet(560, 360, seed=1501)
    # 12 strokes, fast
    s.ink([(0, 120), (60, 92), (110, 104), (170, 80), (240, 98), (300, 70), (360, 96), (430, 84), (500, 100), (560, 90)],
          speed=0.8, width=1.3, medium="pencil")                                                     # 1 the tree line
    s.ink([(0, 168), (560, 162)], speed=0.9, width=1.2)                                               # 2 shore
    s.ink([(0, 180), (560, 176)], speed=0.95, width=0.9, tokens=True)                                 # 3 water edge
    # 4-8 the cows: five short charcoal marks on the shore, a dashed line made of animals
    for x in (40, 70, 200, 330, 362):
        s.ink([(x, 160), (x + 18, 158)], speed=0.6, width=2.2, medium="charcoal")
    s.ink([(430, 150), (520, 148)], speed=0.7, width=1.0, medium="pencil", tokens=True)               # 9 reeds
    for y, x0, x1 in ((220, 60, 300), (260, 220, 520), (310, 40, 260)):                               # 10-12 water
        s.ink([(x0, y), (x1, y + 2)], speed=0.95, width=0.8, tokens=True)
    if answer:
        # the cows came out as the dashes of a token line: my own line, drawn by animals.
        # One gap is too wide, between the second and the third: a cow is missing there. The colour goes into that gap,
        # and the missing cow is only in the water, as a reflection
        s.wash([(96, 150), (196, 150), (196, 166), (96, 166)], "#9bbf5a", alpha=0.45, wet=0.5)
        s.ink([(136, 188), (154, 190)], speed=0.6, width=2.0, medium="charcoal", color="#55606e")
        s.ink([(140, 190), (140, 200)], speed=0.7, width=0.9, medium="pencil", color="#55606e")
        s.ink([(150, 190), (150, 200)], speed=0.7, width=0.9, medium="pencil", color="#55606e")
    return s.save(path)

if __name__ == "__main__":
    draw("out/15r1"); draw("out/15", answer=True)
