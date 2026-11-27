# Пиксельная Полли «как в видео» (Алина 27.11): крупный спрайт 64×76, без сглаживания, контур по краю.
# python3 tools/pins/scf/pixpolly.py OUT.png [k] [hat] [hold] → PNG ×k (прозрачный фон)
import sys
from PIL import Image, ImageDraw
W, H = 64, 76
OL = (38, 28, 62); B1 = (92, 82, 158); B2 = (74, 64, 136); B3 = (120, 110, 186); BEL = (150, 140, 210); BEL2 = (128, 118, 196)
WG = (64, 54, 120); WG2 = (52, 44, 104); BER = (176, 40, 74); BER2 = (208, 70, 100); BER3 = (140, 28, 58)
EYEW = (255, 255, 255); IRIS = (70, 40, 30); IRIS2 = (120, 70, 40); BEAK = (240, 140, 50); BEAK2 = (200, 100, 30); CERE = (235, 228, 222)
CHEEK = (240, 150, 170); LEG = (240, 140, 60); LEG2 = (200, 100, 40)

def sprite(hat='beret', hold=None):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    E = lambda b, c: d.ellipse(b, fill=c)
    # ноги
    for x in (26, 36):
        d.rectangle((x, 64, x + 2, 70), fill=LEG); d.rectangle((x + 2, 64, x + 2, 70), fill=LEG2)
        d.rectangle((x - 3, 70, x + 6, 72), fill=LEG); d.point([(x - 3, 72), (x + 1, 73), (x + 6, 72), (x + 2, 73)], fill=LEG2)
    # хвост, тело, голова (3/4, смотрит вправо)
    d.polygon([(10, 56), (2, 66), (8, 67), (16, 62)], fill=WG2)
    E((8, 30, 52, 68), B1); E((18, 6, 54, 42), B1)
    E((10, 34, 30, 66), B2); E((32, 10, 50, 26), B3)
    E((26, 38, 50, 66), BEL); E((30, 54, 48, 66), BEL2)
    for y in (42, 47, 52, 57):
        for x in range(29 + (y % 2) * 2, 47, 5): d.arc((x, y, x + 4, y + 4), 20, 160, fill=BEL2)
    # крыло слева с перьями
    d.polygon([(12, 36), (4, 50), (6, 62), (14, 66), (26, 60), (24, 44)], fill=WG)
    for i, y in enumerate((48, 53, 58)): d.line([(8 + i, y), (20, y + 3)], fill=WG2)
    if hold:
        d.polygon([(42, 46), (54, 40), (60, 42), (56, 50), (46, 54)], fill=WG); d.line([(48, 48), (56, 43)], fill=WG2)
    # глаза: крупные, с ресницами
    for cx, w in ((30, 6), (43, 5)):
        E((cx - w, 17, cx + w, 31), EYEW); E((cx - w + 2, 19, cx + w - 1, 31), IRIS); E((cx - w + 3, 25, cx + w - 2, 30), IRIS2)
        d.rectangle((cx - w + 3, 20, cx - w + 5, 22), fill=EYEW); d.point((cx + w - 2, 28), fill=EYEW)
        d.arc((cx - w, 17, cx + w, 31), 190, 350, fill=OL); d.point([(cx + w, 18), (cx + w + 1, 17), (cx + w + 2, 16), (cx + w, 16)], fill=OL)
    # клюв вправо, восковица, щёки
    d.rectangle((47, 25, 51, 27), fill=CERE)
    d.polygon([(47, 28), (58, 30), (55, 33), (47, 33)], fill=BEAK); d.line([(48, 31), (56, 31)], fill=BEAK2)
    E((21, 30, 26, 33), CHEEK); E((45, 33, 49, 35), CHEEK)
    # шапка
    if hat == 'beret':
        E((12, 0, 50, 15), BER); E((16, 2, 36, 7), BER2); d.polygon([(12, 8), (6, 14), (14, 15)], fill=BER); d.rectangle((14, 12, 48, 14), fill=BER3); d.rectangle((33, 0, 35, 1), fill=BER3)
    elif hat == 'santa':
        d.polygon([(14, 14), (30, 0), (48, 4), (60, 16), (52, 16), (48, 10)], fill=(200, 40, 50)); E((56, 12, 63, 20), (255, 255, 255))
        d.rectangle((12, 12, 50, 17), fill=(255, 255, 255))
    # предмет
    if hold == 'mug':
        d.rectangle((52, 42, 61, 53), fill=(252, 248, 240)); [d.rectangle((x, 46, x + 1, 47), fill=(210, 50, 50)) for x in (53, 56, 59)]
    if hold == 'brush':
        d.line([(54, 50), (62, 32)], fill=(200, 140, 60), width=2); d.rectangle((61, 28, 63, 32), fill=(226, 84, 74))
    if hold == 'book':
        d.rectangle((47, 42, 63, 55), fill=(246, 196, 69)); d.rectangle((55, 42, 63, 55), fill=(252, 246, 234)); d.line([(55, 42), (55, 55)], fill=OL)
    # контур: прозрачный пиксель рядом с непрозрачным → OL
    px = im.load(); out = im.copy(); po = out.load()
    for y in range(H):
        for x in range(W):
            if px[x, y][3] == 0 and any(0 <= x + dx < W and 0 <= y + dy < H and px[x + dx, y + dy][3] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                po[x, y] = OL + (255,)
    return out

if __name__ == '__main__':
    k = int(sys.argv[2]) if len(sys.argv) > 2 else 8
    s = sprite(sys.argv[3] if len(sys.argv) > 3 else 'beret', sys.argv[4] if len(sys.argv) > 4 else None)
    s.resize((W * k, H * k), Image.NEAREST).save(sys.argv[1])
