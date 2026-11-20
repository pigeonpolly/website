# Мелкие предметы для карт «Птичье таро» — 13x13, пиксель-арт, с контуром.
from PIL import Image, ImageDraw

INK = (26, 21, 40)
GOLD = (242, 193, 78)
GOLD_D = (176, 128, 40)
BERRY = (200, 51, 95)
BERRY_D = (148, 32, 68)
PINE = (47, 93, 80)
CREAM = (246, 236, 217)
ICE = (207, 228, 242)
RED = (214, 58, 58)
ORANGE = (236, 138, 52)
BROWN = (120, 82, 52)


def canvas(w=13, h=13):
    return Image.new('RGBA', (w, h), (0, 0, 0, 0))


def gift():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.rectangle((2, 5, 10, 11), fill=BERRY)
    d.rectangle((2, 5, 10, 5), fill=(226, 88, 126))
    d.rectangle((2, 11, 10, 11), fill=BERRY_D)
    d.rectangle((5, 5, 6, 11), fill=GOLD)
    d.rectangle((2, 7, 10, 7), fill=GOLD)
    d.rectangle((4, 3, 7, 4), fill=GOLD)
    d.point([(3, 2), (8, 2), (4, 2), (7, 2)], fill=GOLD_D)
    return im


def cup():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.rectangle((2, 5, 8, 11), fill=CREAM)
    d.rectangle((2, 5, 8, 5), fill=(255, 255, 255))
    d.rectangle((8, 6, 9, 8), fill=CREAM)
    d.rectangle((2, 9, 8, 11), fill=BERRY)
    d.rectangle((9, 6, 9, 8), fill=BERRY)
    d.point((3, 2), fill=(220, 220, 230))
    d.point((5, 1), fill=(220, 220, 230))
    d.point((7, 2), fill=(220, 220, 230))
    return im


def berry():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.line([(3, 11), (6, 5), (10, 2)], fill=PINE)
    d.point([(7, 4), (8, 3)], fill=PINE)
    for x, y in ((4, 8), (7, 7), (9, 9)):
        d.ellipse((x - 1, y - 1, x + 1, y + 1), fill=RED)
        d.point((x, y - 1), fill=(240, 120, 120))
    return im


def candle():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.rectangle((4, 5, 8, 12), fill=CREAM)
    d.rectangle((4, 5, 4, 12), fill=(255, 255, 255))
    d.rectangle((7, 5, 8, 12), fill=(226, 214, 190))
    d.rectangle((4, 9, 8, 9), fill=BERRY)
    d.rectangle((5, 2, 6, 4), fill=GOLD)
    d.point((5, 1), fill=(255, 240, 180))
    return im


def star():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.line([(6, 1), (6, 11)], fill=GOLD)
    d.line([(1, 6), (11, 6)], fill=GOLD)
    d.line([(3, 3), (9, 9)], fill=GOLD_D)
    d.line([(9, 3), (3, 9)], fill=GOLD_D)
    d.ellipse((5, 5, 7, 7), fill=CREAM)
    return im


def tangerine():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.ellipse((2, 4, 10, 12), fill=ORANGE)
    d.ellipse((3, 5, 9, 11), fill=(248, 160, 74))
    d.point([(4, 6), (5, 5)], fill=(255, 200, 130))
    d.rectangle((6, 2, 7, 3), fill=PINE)
    d.point((8, 2), fill=PINE)
    return im


def flake():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.line([(6, 1), (6, 11)], fill=ICE)
    d.line([(1, 6), (11, 6)], fill=ICE)
    d.line([(3, 3), (9, 9)], fill=ICE)
    d.line([(9, 3), (3, 9)], fill=ICE)
    d.point([(4, 2), (8, 2), (4, 10), (8, 10), (2, 4), (2, 8), (10, 4), (10, 8)], fill=(240, 250, 255))
    d.point((6, 6), fill=GOLD)
    return im


def letter():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.rectangle((1, 4, 11, 10), fill=CREAM)
    d.rectangle((1, 4, 11, 4), fill=(255, 255, 255))
    d.line([(1, 4), (6, 8), (11, 4)], fill=BERRY_D)
    d.point([(9, 6), (10, 6)], fill=GOLD)
    return im


def cookie():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.ellipse((2, 4, 10, 11), fill=(206, 158, 96))
    d.ellipse((3, 5, 9, 10), fill=(224, 180, 116))
    for x, y in ((5, 6), (8, 8), (4, 9)):
        d.point((x, y), fill=BROWN)
    return im


KINDS = {'gift': gift, 'cup': cup, 'berry': berry, 'candle': candle, 'star': star,
         'tangerine': tangerine, 'flake': flake, 'letter': letter, 'cookie': cookie}


def draw(kind):
    return KINDS[kind]() if kind in KINDS else None
