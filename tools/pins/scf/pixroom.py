# Уютная пиксельная комната 160×200 + Полли (pixpolly) → ×5 (800×1000). python3 tools/pins/scf/pixroom.py OUT.png [hat] [hold]
import sys, random
from PIL import Image, ImageDraw
sys.path.insert(0, __file__.rsplit('/', 1)[0]); from pixpolly import sprite
def room(hat='beret', hold=None, night=False):
    W, H = 160, 200; im = Image.new('RGB', (W, H), (232, 205, 170)); d = ImageDraw.Draw(im); R = lambda b, c: d.rectangle(b, fill=c)
    R((0, 0, W, 130), (214, 176, 140) if not night else (70, 56, 88))
    for y in range(0, 130, 8):
        for x in range((y // 8) % 2 * 4, W, 8): d.point((x, y), fill=(200, 160, 124) if not night else (80, 66, 100))
    # окно
    R((10, 14, 56, 66), (120, 84, 58)); R((13, 17, 53, 63), (150, 190, 220) if not night else (30, 40, 80)); R((32, 17, 34, 63), (120, 84, 58)); R((13, 39, 53, 41), (120, 84, 58))
    random.seed(3)
    for _ in range(20): d.point((random.randint(14, 52), random.randint(18, 62)), fill=(255, 255, 255))
    # полка с книгами
    R((92, 18, 152, 20), (120, 84, 58)); R((92, 46, 152, 48), (120, 84, 58))
    x = 94
    for c in [(176, 64, 74), (70, 110, 150), (220, 170, 70), (90, 140, 90), (140, 90, 160), (200, 110, 60), (60, 80, 120), (176, 64, 74)]:
        h = random.randint(16, 24); R((x, 18 - h + 0, x + 5, 17), c) if False else R((x, 46 - h, x + 5, 45), c); x += 7
    # растение
    R((100, 6, 112, 17), (190, 110, 70))
    for dx, dy in ((-4, -4), (0, -6), (4, -4), (-6, 0), (6, 0)): d.ellipse((104 + dx, 2 + dy, 110 + dx, 8 + dy), fill=(80, 140, 80))
    # гирлянда
    for x in range(0, W, 2):
        y = 6 + int(3 * abs(((x % 40) - 20) / 20) * -1 + 3); d.point((x, y), fill=(60, 90, 60))
        if x % 10 == 4: R((x, y + 1, x + 1, y + 2), [(240, 80, 80), (250, 200, 80), (100, 170, 230), (130, 200, 110)][(x // 10) % 4])
    # стол
    R((0, 130, W, 200), (150, 98, 62)); R((0, 130, W, 133), (120, 76, 46))
    for y in range(140, 200, 10): d.line([(0, y), (W, y)], fill=(136, 88, 54))
    # кружка (если Полли не держит свою)
    if hold != 'mug':
        R((120, 112, 134, 128), (252, 248, 240)); R((134, 115, 137, 124), (252, 248, 240)); R((135, 117, 136, 122), (232, 205, 170))
        for x in (122, 126, 130): R((x, 118, x + 2, 120), (210, 50, 50))
        for i in range(8): d.point((126 + (i % 2), 108 - i), fill=(255, 255, 255))
    # бумага
    d.polygon([(70, 128), (104, 124), (108, 130), (74, 134)], fill=(250, 246, 236))
    sp = sprite(hat, hold); im.paste(sp, (20, 56), sp)
    return im.resize((W * 5, H * 5), Image.NEAREST)
if __name__ == '__main__':
    room(*(sys.argv[2:4] + [None] * 2)[:2]).save(sys.argv[1])
