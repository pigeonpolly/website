"""13 · v0.2, sketchbook 3 (photo next to the drawing). From life: Alina's photo of an old-town alley, house number 4.
Exercise: cut half. Roots: token line, the kept mistake, absence."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

def draw(path, answer=False):
    s = Sheet(560, 400, seed=1301)
    I = lambda pts, sp=0.5, w=1.6, **k: s.ink(pts, speed=sp, width=w, tokens=True, **k)
    # the low brick house, left: roof, wall, two shutters. The right building is cut: only its edge, the pipe and the 4
    I([(20, 150), (120, 120), (300, 126), (330, 150)], 0.4, 1.8)
    I([(30, 150), (32, 300)], 0.5); I([(320, 152), (318, 292)], 0.5)
    I([(90, 118), (92, 96), (118, 94), (120, 120)], 0.4)                       # chimney
    I([(250, 124), (252, 100), (276, 100), (278, 126)], 0.4)                   # chimney
    for x in (70, 180):
        I([(x, 190), (x + 52, 190), (x + 52, 262), (x, 262), (x, 190)], 0.3, 1.4)
        I([(x + 26, 192), (x + 26, 260)], 0.7, 1.0)
    I([(0, 300), (330, 292)], 0.8, 1.2)                                        # stone wall top
    # the alley runs away; nobody in it
    I([(330, 292), (388, 262)], 0.7, 1.2); I([(470, 300), (404, 262)], 0.7, 1.2)
    I([(470, 60), (468, 330)], 0.4, 1.8)                                       # edge of the cut building
    I([(500, 50), (498, 340)], 0.5, 1.2, medium="pencil")                      # drainpipe
    s.ink([(486, 160), (487, 186)], speed=0.3, width=2.2)                      # the number 4
    s.ink([(486, 160), (478, 178), (494, 178)], speed=0.3, width=2.2)
    # the cable: the one thing the photo is really about, a token line across the sky
    I([(276, 104), (330, 140), (400, 150), (470, 128)], 0.3, 1.4)
    I([(0, 380), (560, 372)], 0.9, 0.8)
    if answer:
        # the street came out upside down: a roof between the houses. With the cable it closes into a house made of air.
        # The kept mistake gets the colour: the brick red goes to the gap, not to the brick house
        s.wash([(324, 146), (400, 152), (466, 132), (466, 296), (404, 264), (388, 264), (326, 290)], "#c4553a", alpha=0.42, wet=0.7)
        I([(386, 200), (404, 200), (404, 222), (386, 222), (386, 200)], 0.3, 1.2)  # it even gets a window
    return s.save(path)

if __name__ == "__main__":
    draw("out/13r1"); draw("out/13", answer=True)
