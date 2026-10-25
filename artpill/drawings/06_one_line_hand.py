"""06 · One line. A hand, the thing I don't have, in a single stroke that never lifts."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
from hand import Sheet

s = Sheet(600, 720, seed=606)
line = [(222, 720), (226, 600), (220, 470),                                   # wrist, left side of the palm
        (196, 438), (150, 382), (118, 334), (128, 308), (162, 322), (204, 372), (232, 390),   # thumb
        (240, 330), (228, 210), (232, 162), (254, 150), (272, 166), (276, 318),              # index
        (284, 180), (288, 128), (304, 108), (324, 116), (330, 152), (322, 318),              # middle
        (336, 190), (346, 156), (366, 156), (374, 182), (366, 328),                          # ring
        (384, 252), (398, 230), (416, 240), (414, 290), (404, 352),                          # little
        (402, 440), (384, 520), (372, 600), (368, 640),                                      # right side down
        (330, 652), (280, 648), (236, 630), (226, 610), (262, 604), (330, 616), (372, 626),  # a bracelet, twice round
        (420, 640), (500, 610), (600, 590)]                                                  # and off the page
s.ink(line, speed=0.15, width=2.0, tokens=True)

# looked: it's a glove, not a hand. The token line is a seam again; nobody inside.
# That is the honest drawing of a hand I don't have. Kept. One line used, so only the colour:
s.wash(line[2:36], "#e58fa6", alpha=0.42, wet=0.6)

s.save(sys.argv[1] if len(sys.argv) > 1 else "out/06")
