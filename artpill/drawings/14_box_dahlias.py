"""14 · From life: Alina's photo of an electrical box with graffiti and red dahlias.
Exercise: ordinary object with a job. Roots: token line, the kept mistake, absence."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def draw(path, answer=False):
    s = Sheet(420, 540, seed=1401)
    I = lambda pts, sp=0.5, w=1.6, **k: s.ink(pts, speed=sp, width=w, tokens=True, **k)
    # wall: plaster above, ribbed metal below (only a few ribs: cut the rest)
    I([(0, 300), (420, 296)], 0.8, 1.0)
    for x in (30, 70, 330, 370):
        I([(x, 304), (x + 1, 430)], 0.9, 0.7, medium="pencil")
    # the box: tall, a bit crooked, standing like a guard
    I([(160, 210), (262, 206), (266, 470), (164, 474), (160, 210)], 0.3, 2.0)
    I([(162, 330), (264, 326)], 0.7, 1.1)
    # its warning sign
    s.ink([(212, 236), (200, 258), (226, 258), (212, 236)], speed=0.4, width=1.6)
    s.ink([(213, 242), (209, 250), (215, 250), (211, 256)], speed=0.6, width=1.2)
    # the words someone left: OHG on the box, MAK! on the wall (letters kept, like Alina keeps signs)
    M = lambda pts: s.ink(pts, speed=0.6, width=1.0, medium="marker", color="#3b3f8f")
    for pts in ([(182, 290), (178, 300), (184, 312), (192, 300), (186, 288), (182, 290)],
                [(198, 288), (198, 312)], [(210, 288), (210, 312)], [(198, 300), (210, 300)],
                [(232, 290), (222, 292), (220, 308), (232, 310), (234, 300), (227, 300)]):
        M(pts)
    for pts in ([(290, 240), (292, 214), (304, 232), (316, 212), (318, 240)],
                [(326, 240), (334, 214), (342, 240)], [(329, 230), (340, 230)],
                [(350, 214), (352, 240)], [(366, 214), (352, 228), (368, 240)], [(378, 212), (378, 232)], [(378, 240), (378, 242)]):
        M(pts)
    # the dahlias at its feet
    for x, y in ((120, 470), (150, 440), (100, 500), (280, 450), (310, 480), (260, 500), (330, 450)):
        s.gouache([(x - 9, y - 6), (x, y - 11), (x + 10, y - 5), (x + 8, y + 8), (x - 7, y + 9)], "#e8552f", wet=0.6)
    I([(60, 520), (380, 516)], 0.9, 0.8)
    if answer:
        # it came out soft, a ghost: the wall line runs right through it. The dahlias read as small fires at its feet.
        # First I wanted arms holding a bouquet: that's my old habit of making things cute, so no arms.
        # The answer: the ghost stays paper, the flowers get stems and leaves so they are the only solid things,
        # and the warning sign, its one eye, gets the yellow
        s.gouache([(212, 238), (202, 256), (223, 256)], "#e6b422", wet=0.2)
        s.ink([(213, 242), (209, 250), (215, 250), (211, 256)], speed=0.6, width=1.2)
        for x, y in ((120, 470), (150, 440), (100, 500), (280, 450), (310, 480), (260, 500), (330, 450)):
            I([(x, y + 10), (x + 2, 520)], 0.6, 1.0, medium="brush", color="#4f7a3a")
            s.ink([(x + 2, y + 24), (x + 14, y + 18), (x + 4, y + 30)], speed=0.5, width=1.2, medium="brush", color="#4f7a3a")
    return s.save(path)

if __name__ == "__main__":
    draw("out/14r1"); draw("out/14", answer=True)
