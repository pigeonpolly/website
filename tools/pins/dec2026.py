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


def gift(d, x, y, s, box, line, ribbon):
    """Маленький подарочек: коробка, лента, бантик — для «остальных тем»."""
    lid = y + s * 0.30
    d.rectangle([x, lid, x + s, y + s], fill=box, outline=line, width=2)
    d.rectangle([x - 2, y + s * 0.18, x + s + 2, lid + 2], fill=box, outline=line, width=2)
    d.rectangle([x + s * 0.40, y + s * 0.18, x + s * 0.60, y + s], fill=ribbon)
    d.ellipse([x + s * 0.24, y - s * 0.02, x + s * 0.46, y + s * 0.18], outline=line, width=2)
    d.ellipse([x + s * 0.54, y - s * 0.02, x + s * 0.76, y + s * 0.18], outline=line, width=2)


def pin_list():
    """Пин 1: бумажная карточка — фото скетчбука, 6 тем и 25 подарков."""
    canvas = Image.new('RGB', (W, H), PAPER)
    d = ImageDraw.Draw(canvas)
    art = Image.open(IMG / 'photos2' / 'windowsill_riga.jpg').crop((0, 40, 720, 1200))
    canvas.paste(cover(art, 912, 620), (44, 44))
    d.rectangle((44, 44, 44 + 911, 44 + 619), outline=(42, 38, 32, 60), width=2)

    d.text((44, 704), '30 cosy', font=font(F_SERIF_B, 72), fill=INK)
    d.text((44, 782), 'December prompts', font=font(F_SERIF_B, 72), fill=INK)
    d.text((46, 872), 'one tiny drawing a day · 3 colours · 5–15 minutes',
           font=font(F_SANS, 27), fill=MUTED)
    d.line((44, 922, 956, 922), fill=(42, 38, 32, 40), width=2)

    items = ['cocoa', 'snowman', 'cat in a knitted hat',
             'snow globe', 'mulled wine', 'gifts']
    for i, t in enumerate(items):
        col, row = i % 2, i // 2
        x = 44 + col * 470
        y = 952 + row * 56
        d.text((x, y), str(i + 1), font=font(F_SERIF_B, 28), fill=ACCENT)
        d.text((x + 42, y - 2), t, font=font(F_SANS, 28), fill=INK)

    gx0, gy0, gs, gap = 44, 1136, 30, 14
    for i in range(24):
        gift(d, gx0 + (i % 5) * (gs + gap), gy0 + (i // 5) * (gs + gap), gs,
             (233, 221, 202), (42, 38, 32, 120), ACCENT)

    d.text((300, 1136), 'the other 24', font=font(F_SERIF_B, 34), fill=INK)
    d.text((300, 1180), 'open on the site —', font=font(F_SERIF_I, 32), fill=MUTED)
    d.text((300, 1222), 'save the whole month', font=font(F_SERIF_I, 32), fill=MUTED)
    d.text((44, 1396), 'free · pigeonpolly.com/prompts', font=font(F_SANS_B, 27), fill=ACCENT)
    save(canvas, 'pin-1-list.jpg')


def pin_one():
    """Пин 2: акварель во весь кадр — месяц, одна тема и подарки."""
    im = cover(Image.open(IMG / 'photos2' / 'checker_coffee.jpg'), W, H)
    im = scrim(im, 0, 360, 165, 0)
    im = scrim(im, 600, 1010, 0, 238)
    im = band(im, 1010, H, 238)
    d = ImageDraw.Draw(im)
    d.text((58, 66), 'December', font=font(F_SERIF_B, 80), fill=CREAM)
    d.text((60, 168), '30 cosy drawing prompts', font=font(F_SANS, 30), fill=WARM)

    d.text((60, 936), 'today’s prompt', font=font(F_SERIF_I, 42), fill=PEACH)
    d.text((58, 992), 'a cup of cocoa', font=font(F_SERIF_B, 88), fill=CREAM)
    d.text((60, 1112), 'the other 29 open on the site', font=font(F_SANS, 28), fill=WARM)
    for i in range(9):
        gift(d, 60 + i * 46, 1160, 32, (52, 38, 58), WARM, PEACH)
    d.text((60, 1250), '5 minutes · 3 colours · free', font=font(F_SANS, 26), fill=WARM)
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


