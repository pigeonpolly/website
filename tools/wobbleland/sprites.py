from PIL import Image
import numpy as np
INK = (26, 21, 40, 255)
def make(rows, col, name, outline=True):
    h, w = len(rows), max(len(r) for r in rows)
    a = np.zeros((h + 2, w + 2, 4), np.uint8)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in col: a[y + 1, x + 1] = col[ch] + (255,)
    if outline:
        m = a[..., 3] > 0; p = np.pad(m, 1)
        nb = p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
        a[nb & ~m] = INK
    Image.fromarray(a, 'RGBA').save(f'ch-{name}.png')
    return Image.fromarray(a, 'RGBA')
S = {}
S['polly'] = make([
'......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...',
'.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'],
 {'d': (26, 21, 40), 'b': (127, 129, 191), 's': (94, 90, 156), 'w': (255, 255, 255), 'k': (26, 21, 40), 'o': (242, 167, 59)}, 'polly', outline=False)
S['chew'] = make([
'y.....y.........',
'.k....k.........',
'..k..k..........',
'.ggggggg........',
'gkkgggkkg.......',
'kwwkkkwwk.......',
'gkkgggkkg.cccc..',
'.ggggggg.cBBBcc.',
'..ggggg.cBbbbBcc',
'..ggggg.cBbBBbBc',
'..gggggpcBbbBbBc',
'..gggggppcBBbBcc',
'..ggggggpccBBcc.',
'.ggggggggggggggg',
'gggggggggggggggg'],
 {'y': (240, 200, 90), 'k': (40, 34, 52), 'g': (190, 190, 196), 'w': (210, 236, 246), 'c': (150, 80, 40), 'B': (200, 120, 60), 'b': (110, 56, 30), 'p': (232, 210, 150)}, 'chew')
S['titos'] = make([
'.k......k.',
'..k....k..',
'..gggggg..',
'.gggggggg.',
'.ggkggkgg.',
'.gggggggg.',
'..gggggg..',
'.wwwrrwww.',
'wwswrrwsww',
'wwswrrwsww',
'gwswrrwswg',
'.wswwwwsw.',
'.nnnnnnnn.',
'.nnn..nnn.',
'.kkk..kkk.'],
 {'k': (40, 34, 52), 'g': (150, 156, 178), 'w': (240, 240, 244), 'r': (180, 40, 50), 's': (60, 50, 70), 'n': (60, 66, 100)}, 'titos')
S['pumpkin'] = make([
'.....g..........',
'..oooooo........',
'.oOooOooo.......',
'oookoookoo......',
'oooooooooo...g..',
'ookkkkkkoo.oooo.',
'.ooooooooooOoOoo',
'..oooooo.okooko.',
'...pppp..ookkoo.',
'.pppPPppp.oooo..',
'ppPpppPppp.pp...',
'pppppppppp.pp...',
'.pppppppp..rr...',
'..pppppp...rr...',
'...k..k....k.k..'],
 {'g': (90, 140, 70), 'o': (232, 130, 50), 'O': (250, 170, 90), 'k': (40, 34, 52), 'p': (140, 90, 170), 'P': (190, 150, 220), 'r': (70, 90, 150)}, 'pumpkin')
sheet = Image.new('RGBA', (90, 22), (240, 230, 200, 255)); x = 2
for k, im in S.items(): sheet.alpha_composite(im, (x, 2)); x += im.width + 4
sheet.resize((sheet.width * 8, sheet.height * 8), Image.NEAREST).save('chars-sheet.png')
