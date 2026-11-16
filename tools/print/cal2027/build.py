#!/usr/bin/env python3
"""Календарь 2027 «Небо и земля» (A3) из скана/фото акварели «Козий город».

  python3 tools/print/cal2027/build.py СКАН.tif [--out ПАПКА] [--crop x0,y0,x1,y1] [--rot ГРАДУСЫ]
         [--nocrop] [--vib 0.30] [--dpi 400]

Скан: весь лист, фон сканера светлый — края листа и наклон находятся сами (--crop/--rot — вручную).
От листа срезается 1 % по краю (скотч, неровный край). Дальше всё как в утверждённом варианте:
небо-глазурь с январём–июнем и «2027» сверху, тёмная земля с июлем–декабрём снизу, сайт в самом низу.
Выход: RGB PDF с вылетами 3 мм, RGB PDF A3, CMYK PDF (ISO Coated v2 300 / FOGRA39) с вылетами,
JPG 30×42 см sRGB для Minnti, превью.
"""
import argparse, io, os, calendar
import numpy as np, cv2, img2pdf
from PIL import Image, ImageDraw, ImageFont, ImageCms
Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
sys_path = __import__('sys').path; sys_path.insert(0, HERE)
from enhance import enhance

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('--out', default='cal2027_out')
ap.add_argument('--crop'); ap.add_argument('--rot', type=float); ap.add_argument('--nocrop', action='store_true')
ap.add_argument('--vib', type=float, default=0.30); ap.add_argument('--dpi', type=int, default=400)
A = ap.parse_args(); os.makedirs(A.out, exist_ok=True)

DPI = A.dpi; F = DPI / 25.4; mm = lambda v: int(round(v * F)); B = 3
W, H = mm(303), mm(426)
rng = np.random.default_rng(7)
def hexf(h): return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], np.float32) / 255
def n2(h, w, s): r = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), s); return r / r.std()
def n1(n, s): r = cv2.GaussianBlur(rng.standard_normal(n).astype(np.float32).reshape(1, -1), (0, 0), s).ravel(); return r / np.abs(r).max()
def font(f, pt): return ImageFont.truetype(os.path.join(HERE, 'fonts', f), max(1, int(round(pt / 72 * DPI))))
to_lin = lambda a: np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
to_gam = lambda a: np.where(a <= 0.0031308, a * 12.92, 1.055 * np.clip(a, 0, 1) ** (1 / 2.4) - 0.055)

# ---------- 1. лист из скана ----------
src = Image.open(A.src); icc = src.info.get('icc_profile') or ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
if src.mode not in ('RGB',):
    src = src.convert('RGB')          # 16-бит TIFF Pillow открывает как RGB 8 бит
img = np.asarray(src)
if not A.nocrop:
    if A.crop:
        x0, y0, x1, y1 = map(int, A.crop.split(',')); rot = A.rot or 0.0
        M = cv2.getRotationMatrix2D(((x0 + x1) / 2, (y0 + y1) / 2), rot, 1)
        img = cv2.warpAffine(img, M, (img.shape[1], img.shape[0]), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)[y0:y1, x0:x1]
    else:
        sc = 1500 / max(img.shape[:2]); sm = cv2.resize(img, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA)
        hsv = cv2.cvtColor(sm, cv2.COLOR_RGB2HSV)
        bg = np.median(np.concatenate([sm[:8].reshape(-1, 3), sm[-8:].reshape(-1, 3), sm[:, :8].reshape(-1, 3), sm[:, -8:].reshape(-1, 3)]), 0)
        diff = np.linalg.norm(sm.astype(float) - bg, axis=2)
        m = (diff > 28).astype(np.uint8) * 255
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8)); m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
        cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        (cx, cy), (rw, rh), ang = cv2.minAreaRect(max(cs, key=cv2.contourArea))
        if rw > rh: rw, rh, ang = rh, rw, ang - 90
        if ang < -45: ang += 90
        if ang > 45: ang -= 90
        rot = A.rot if A.rot is not None else ang
        cx, cy, rw, rh = cx / sc, cy / sc, rw / sc, rh / sc
        M = cv2.getRotationMatrix2D((cx, cy), rot, 1)
        img = cv2.warpAffine(img, M, (img.shape[1], img.shape[0]), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
        img = img[int(cy - rh / 2):int(cy + rh / 2), int(cx - rw / 2):int(cx + rw / 2)]
        print(f'лист найден: {int(rw)}×{int(rh)} px, поворот {rot:.2f}°')
    ih, iw = img.shape[:2]; ix, iy = int(iw * 0.010), int(ih * 0.010 * 0.707)
    img = img[iy:ih - iy, ix:iw - ix]
cv2.imwrite(os.path.join(A.out, 'check_sheet.jpg'), cv2.cvtColor(cv2.resize(img, (900, int(900 * img.shape[0] / img.shape[1]))), cv2.COLOR_RGB2BGR))

# ---------- 2. под ширину листа с вылетами, в линейном свете ----------
a = img.astype(np.float32) / 255
ah = int(round(W * a.shape[0] / a.shape[1]))
interp = cv2.INTER_AREA if a.shape[1] >= W else cv2.INTER_LANCZOS4
art = np.clip(to_gam(cv2.resize(to_lin(a), (W, ah), interpolation=interp)), 0, 1).astype(np.float32)
print(f'исходник {img.shape[1]} px по ширине → {img.shape[1] / (303 / 25.4):.0f} dpi на A3')
art = enhance(art, vib=A.vib, px=1.6 * DPI / 400)
if art.shape[0] < H: art = np.concatenate([art, art[::-1][:H - art.shape[0]]], 0)
page = art[:H].copy()

# ---------- 3. небо и земля ----------
yy = np.arange(H, dtype=np.float32)[:, None]; xs = np.arange(W) / W
e = n1(W, mm(12)) * mm(2.5) + n1(W, mm(3)) * mm(.8)
g = np.clip(1 - (yy - mm(29) - e[None, :]) / mm(8), 0, 1) ** 1.1 * 0.84 * (1 + 0.07 * n2(H, W, mm(7)))
dx = (xs[None, :] * W - .505 * W) / 1.35; dy = yy - mm(42); tt = np.clip((mm(29.5) - np.sqrt(dx * dx + dy * dy)) / mm(8.5), 0, 1)
g = g * (1 - 0.92 * tt * tt * (3 - 2 * tt))   # мягкий светлый полукруг над флюгером
col = np.stack([np.interp(xs, [0, .5, 1], c) for c in zip(hexf('#2f2b4a'), hexf('#25405e'), hexf('#3a3940'))], -1)[None]
page = page * (1 - g[..., None]) + col * g[..., None]
e2 = n1(W, mm(10)) * mm(2) + n1(W, mm(2)) * mm(.6); d = yy - (mm(392.6) + e2[None, :])
a2 = np.clip(d / mm(.4) + .5, 0, 1) * np.clip(0.72 + 0.2 * np.clip(d / mm(8), 0, 1) + 0.05 * n2(H, W, mm(5)), 0, .95)
a2 = a2 + np.exp(-np.clip(d, 0, None) / mm(.5)) * np.clip(d / mm(.4) + .5, 0, 1) * 0.2
page = page * (1 - np.clip(a2, 0, .96)[..., None] * (1 - hexf('#33282a'))) * (1 - 0.3 * np.clip(a2, 0, 1)[..., None])
page = page * (1 + 0.025 * n2(H, W, 1.1))[..., None]

# ---------- 4. текст ----------
L = {}
def t(c, x, y, s, f, op=1):
    L.setdefault((c, op), Image.new('L', (W, H), 0)); ImageDraw.Draw(L[(c, op)]).text((mm(x), mm(y)), s, font=f, fill=255, anchor='ms')
cal = calendar.Calendar(0)
NAME, NUM, WE = '#c9c4ea', '#f7f0e1', '#ffb47e'
def month(mo, x, y, w, fm, fd, lh):
    cw = w / 7; t(NAME, x + w / 2, y, calendar.month_name[mo], font('CaveatBrush.ttf', fm))
    for k, wd in enumerate('MTWTFSS'): t(WE if k > 4 else NUM, x + cw * (k + .5), y + fm * 0.3, wd, font('PatrickHand.ttf', fd * .85), op=.6)
    weeks = cal.monthdayscalendar(2027, mo)
    if len(weeks) == 6:                       # 6-я неделя — в пустые клетки первой
        for k, dd in enumerate(weeks[5]):
            if dd: weeks[0][k] = dd
        weeks = weeks[:5]
    for r, wk in enumerate(weeks):
        for k, dd in enumerate(wk):
            if dd: t(WE if k > 4 else NUM, x + cw * (k + .5), y + fm * 0.3 + lh * (r + 1) + 0.6, str(dd), font('PatrickHand.ttf', fd))
MW = (297 - 14 - 6 * 6) / 7
for c, mo in enumerate([1, 2, 3, None, 4, 5, 6]):
    x = B + 7 + c * (MW + 6)
    if mo is None: t(NUM, x + MW / 2, B + 12.3, '2027', font('CaveatBrush.ttf', 34)); continue
    month(mo, x, B + 8, MW, 13.5, 10.8, 2.75)
MW2 = (297 - 14 - 5 * 7) / 6
for c in range(6): month(7 + c, B + 7 + c * (MW2 + 7), B + 393.8, MW2, 14, 10.4, 2.7)
t(NUM, B + 148.5, B + 416.3, 'pigeonpolly.com', font('PatrickHand.ttf', 8), op=.45)
for (c, op), m in L.items():
    al = cv2.GaussianBlur(np.asarray(m).astype(np.float32) / 255, (0, 0), 0.4 * DPI / 150) * op
    page = page * (1 - al[..., None]) + hexf(c)[None, None, :] * al[..., None]

# ---------- 5. файлы ----------
im = Image.fromarray((np.clip(page, 0, 1) * 255 + .5).astype(np.uint8))
o = lambda n: os.path.join(A.out, n); pt = img2pdf.mm_to_pt
lay = lambda w, h: img2pdf.get_layout_fun((pt(w), pt(h)), fit=img2pdf.FitMode.exact)
src_p = ImageCms.ImageCmsProfile(io.BytesIO(icc)); srgb = ImageCms.createProfile('sRGB'); srgb_b = ImageCms.ImageCmsProfile(srgb).tobytes()
cmyk_f = os.path.join(HERE, 'ISOcoated_v2_300_eci.icc'); cmyk_p = ImageCms.getOpenProfile(cmyk_f)
b = mm(3)
im.save(o('_rgb_bleed.jpg'), quality=97, subsampling=0, icc_profile=icc, dpi=(DPI, DPI))
open(o('Calendar_2027_A3_RGB_bleed3mm.pdf'), 'wb').write(img2pdf.convert(o('_rgb_bleed.jpg'), layout_fun=lay(303, 426), trimborder=(pt(3), pt(3))))
a3 = im.crop((b, b, W - b, H - b)); a3.save(o('_rgb_a3.jpg'), quality=97, subsampling=0, icc_profile=icc, dpi=(DPI, DPI))
open(o('Calendar_2027_A3_RGB.pdf'), 'wb').write(img2pdf.convert(o('_rgb_a3.jpg'), layout_fun=lay(297, 420)))
cm = ImageCms.applyTransform(im, ImageCms.buildTransform(src_p, cmyk_p, 'RGB', 'CMYK', renderingIntent=ImageCms.Intent.PERCEPTUAL, flags=ImageCms.Flags.BLACKPOINTCOMPENSATION))
cm.save(o('_cmyk_bleed.jpg'), quality=95, icc_profile=open(cmyk_f, 'rb').read(), dpi=(DPI, DPI))
open(o('Calendar_2027_A3_CMYK_bleed3mm.pdf'), 'wb').write(img2pdf.convert(o('_cmyk_bleed.jpg'), layout_fun=lay(303, 426), trimborder=(pt(3), pt(3))))
x0 = round(1.5 * F); mn = im.crop((x0, b, x0 + round(300 * F), b + round(420 * F)))
ImageCms.profileToProfile(mn, src_p, srgb, renderingIntent=ImageCms.Intent.PERCEPTUAL).save(o('Calendar_2027_30x42_minnti.jpg'), quality=95, subsampling=0, icc_profile=srgb_b, dpi=(DPI, DPI))
ImageCms.profileToProfile(a3.resize((a3.width // 3, a3.height // 3), Image.LANCZOS), src_p, srgb).save(o('Calendar_2027_preview.jpg'), quality=90)
for n in ('_rgb_bleed.jpg', '_rgb_a3.jpg', '_cmyk_bleed.jpg'): os.remove(o(n))
print('готово:', A.out)
