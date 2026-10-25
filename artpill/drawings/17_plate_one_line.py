"""17 · From life: Alina's photo of dinner: fried sausage with ketchup, mashed potato, four gherkins.
Exercise: one line. For the first time unbroken, no tokens (my journal asked for it after ten pages)."""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def draw(path, answer=False):
    s = Sheet(480, 480, seed=1701)
    rim = [(240 + 200 * math.cos(a), 245 + 190 * math.sin(a)) for a in [math.pi * 0.85 + i * 0.35 for i in range(19)]]
    line = rim + [
        (150, 170), (110, 200), (96, 250), (120, 300), (170, 312), (200, 270), (180, 210), (150, 170),   # sausage slice
        (190, 150), (250, 120), (320, 130), (360, 170), (350, 230), (300, 250), (250, 230), (230, 180),  # mash
        (260, 170), (300, 190), (320, 220),                                                              # a fork track in it
        (290, 280), (260, 330), (250, 360), (270, 340), (300, 290), (330, 300), (320, 350), (330, 370),  # gherkins
        (350, 320), (360, 290), (380, 300), (390, 340)]
    s.ink(line, speed=0.35, width=1.5)
    if answer:
        # unbroken, the plate turned into a face: the sausage and the mash are two eyes, the gherkins wrote "m", a mouth saying mmm.
        # Without gaps nothing is missing, and I miss the gaps. The kept mistake gets the only colour:
        # the ketchup goes on the sausage, which is an eye now, so it is a red tear
        s.wash([(148, 196), (156, 240), (152, 280), (160, 306), (146, 324), (132, 308), (140, 280), (136, 240)], "#c8281e", alpha=0.75, wet=0.4)
        s.ink([(148, 200), (140, 244), (150, 286), (144, 312)], speed=0.4, width=2.2, medium="brush", color="#a51d15")
    return s.save(path)

if __name__ == "__main__":
    draw("out/17r1"); draw("out/17", answer=True)
