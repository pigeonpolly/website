# -*- coding: utf-8 -*-
"""Три пина на декабрь 2026: список тем, один промпт и челлендж.
Запуск: python tools/pins/dec2026.py  → site/images/pins/dec-2026/*.jpg (1000×1500)
"""
import pathlib

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
IMG = ROOT / 'site' / 'images'
OUT = IMG / 'pins' / 'dec-2026'

W, H = 1000, 1500
PAPER = (244, 236, 221)
INK = (42, 38, 32)
ACCENT = (196, 85, 45)
MUTED = (138, 106, 88)
CREAM = (255, 253, 248)
PEACH = (232, 168, 124)
WARM = (243, 227, 213)

F_SERIF_B = r'C:\Windows\Fonts\georgiab.ttf'
F_SERIF_I = r'C:\Windows\Fonts\georgiai.ttf'
F_SANS = r'C:\Windows\Fonts\arial.ttf'
F_SANS_B = r'C:\Windows\Fonts\arialbd.ttf'


def font(path, size):
    return ImageFont.truetype(path, size)


def cover(im, w, h, fx=0.5, fy=0.5):
    """Кадрирует и масштабирует, чтобы заполнить w×h; fx/fy — куда сместить кадр (0…1)."""
    r = max(w / im.width, h / im.height)
    im2 = im.resize((max(1, round(im.width * r)), max(1, round(im.height * r))), Image.LANCZOS)
    x = round((im2.width - w) * fx)
    y = round((im2.height - h) * fy)
    return im2.crop((x, y, x + w, y + h))


def band(img, top, bottom, alpha):
    """Ровная тёмная полоса (для текста поверх светлой акварели)."""
    layer = Image.new('RGBA', img.size, (20, 12, 32, alpha))
    mask = Image.new('L', (1, H), 0)
    for y in range(top, bottom):
        mask.putpixel((0, y), alpha)
    layer.putalpha(mask.resize(img.size))
    return Image.alpha_composite(img.convert('RGBA'), layer)


def scrim(img, top, bottom, a_top, a_bottom):
    """Тёмная заливка с прозрачностью от a_top до a_bottom (только в полосе top…bottom)."""
    mask = Image.new('L', (1, H), 0)
    for y in range(top, bottom):
        t = (y - top) / max(1, bottom - top - 1)
        mask.putpixel((0, y), int(a_top + (a_bottom - a_top) * t))
    mask = mask.resize(img.size)
    layer = Image.new('RGBA', img.size, (20, 12, 32, 255))
    layer.putalpha(mask)
    return Image.alpha_composite(img.convert('RGBA'), layer)


def save(im, name):
    OUT.mkdir(parents=True, exist_ok=True)
    p = OUT / name
    im.convert('RGB').save(p, 'JPEG', quality=90, optimize=True)
    print('ok', p.relative_to(ROOT))


def pin_list():
    """Пин 1: бумажная карточка — фото скетчбука в рамке + 6 тем из 31."""
    canvas = Image.new('RGB', (W, H), PAPER)
    d = ImageDraw.Draw(canvas)
    art = Image.open(IMG / 'photos2' / 'windowsill_riga.jpg').crop((0, 40, 720, 1200))
    canvas.paste(cover(art, 912, 700), (44, 44))
    d.rectangle((44, 44, 44 + 911, 44 + 699), outline=(42, 38, 32, 60), width=2)

    d.text((44, 784), '30 cosy', font=font(F_SERIF_B, 76), fill=INK)
    d.text((44, 866), 'December prompts', font=font(F_SERIF_B, 76), fill=INK)
    d.text((46, 962), 'one tiny drawing a day · 3 colours · 5–15 minutes',
           font=font(F_SANS, 27), fill=MUTED)
    d.line((44, 1014, 956, 1014), fill=(42, 38, 32, 40), width=2)

    items = ['cocoa', 'snowman', 'cat in a knitted hat',
             'snow globe', 'mulled wine', 'gifts']
    for i, t in enumerate(items):
        col, row = i % 2, i // 2
        x = 44 + col * 470
        y = 1048 + row * 58
        d.text((x, y), str(i + 1), font=font(F_SERIF_B, 29), fill=ACCENT)
        d.text((x + 44, y - 2), t, font=font(F_SANS, 29), fill=INK)

    d.text((44, 1250), 'the whole month on one page —', font=font(F_SERIF_I, 32), fill=MUTED)
    d.text((44, 1294), 'save it to your phone or print it', font=font(F_SERIF_I, 32), fill=MUTED)
    d.text((44, 1396), 'free · pigeonpolly.com/prompts', font=font(F_SANS_B, 27), fill=ACCENT)
    save(canvas, 'pin-1-list.jpg')


def pin_one():
    """Пин 2: акварель во весь кадр — одна тема крупно."""
    im = cover(Image.open(IMG / 'photos2' / 'checker_coffee.jpg'), W, H)
    im = scrim(im, 600, 1010, 0, 238)
    im = band(im, 1010, H, 238)
    d = ImageDraw.Draw(im)
    d.text((60, 1000), 'today’s prompt', font=font(F_SERIF_I, 42), fill=PEACH)
    d.text((58, 1056), 'a cup of cocoa', font=font(F_SERIF_B, 90), fill=CREAM)
    d.text((60, 1176), '30 cosy December prompts', font=font(F_SANS, 34), fill=WARM)
    d.text((60, 1228), '5 minutes · 3 colours · free', font=font(F_SANS, 27), fill=WARM)
    d.text((60, 1392), 'pigeonpolly.com/prompts', font=font(F_SANS_B, 28), fill=PEACH)
    save(im, 'pin-2-cocoa.jpg')


def pin_challenge():
    """Пин 3: бумажная шапка + акварель мистера Чу в гирлянде."""
    canvas = Image.new('RGB', (W, H), PAPER)
    art = cover(Image.open(IMG / 'freebies' / 'wall' / '2023-mr-chew-take-away-coffee.jpg'), W, 1050, fy=0.34)
    canvas.paste(art, (0, 350))
    d = ImageDraw.Draw(canvas)
    d.text((56, 54), 'December', font=font(F_SERIF_B, 92), fill=INK)
    d.text((56, 160), 'sketchbook challenge', font=font(F_SERIF_B, 62), fill=INK)
    d.text((58, 254), '30 tiny drawings · one a day', font=font(F_SANS, 28), fill=MUTED)
    d.line((56, 312, 944, 312), fill=(42, 38, 32, 45), width=2)
    d.text((56, 1408), 'free · pigeonpolly.com/prompts', font=font(F_SANS_B, 27), fill=ACCENT)
    save(canvas, 'pin-3-challenge.jpg')


if __name__ == '__main__':
    pin_list()
    pin_one()
    pin_challenge()

