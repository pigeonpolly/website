# Генератор тематических фонов и рамок для аватаров птичек: SVG → data URI → site/assets/ava-deco.css. Запуск из корня: python3 tools/ava_deco_gen.py
import math, random, urllib.parse
R = random.Random(7)
def uri(svg): return "url(\"data:image/svg+xml," + urllib.parse.quote(svg, safe=" =:/,'#()-.") .replace('#', '%23') + "\")"
def S(body, vb=100): return f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {vb} {vb}'>{body}</svg>"
def grad(id, c1, c2, x2=0, y2=1): return f"<linearGradient id='{id}' x1='0' y1='0' x2='{x2}' y2='{y2}'><stop offset='0' stop-color='{c1}'/><stop offset='1' stop-color='{c2}'/></linearGradient>"
def stars(n, col='#FFF8D6', ymax=100, rmax=1.1):
    out = ''
    for i in range(n):
        x, y = R.uniform(4, 96), R.uniform(3, ymax)
        if 28 < x < 72 and 25 < y < 85: continue  # центр — под птичкой
        out += f"<circle cx='{x:.1f}' cy='{y:.1f}' r='{R.uniform(.4, rmax):.2f}' fill='{col}'/>"
    return out
BAT = "M0 0q2.5-3 5-.6q1.2-1.6 2.4 0q2.5-2.4 5 .6q-3 .4-4.4 3q-1-.8-1.8 0q-1.4-2.6-6.2-3z"
def bat(x, y, s, col='#1B0F2E'): return f"<path d='{BAT}' transform='translate({x} {y}) scale({s})' fill='{col}'/>"
def pumpkin(x, y, s):
    return (f"<g transform='translate({x} {y}) scale({s})'><ellipse cx='0' cy='0' rx='8' ry='6' fill='#E8792B'/><ellipse cx='-3' cy='0' rx='3' ry='6' fill='#F5A25D' opacity='.5'/>"
            f"<path d='M0-6v6M-4-5q-1 5 0 10M4-5q1 5 0 10' stroke='#C85F1C' stroke-width='.8' fill='none'/><rect x='-.8' y='-9' width='1.6' height='3.5' fill='#4C9A5B'/></g>")
def leaf(x, y, rot, col, s=1): return f"<g transform='translate({x} {y}) rotate({rot}) scale({s})'><ellipse rx='4.2' ry='2.2' fill='{col}'/><path d='M-4 0h8' stroke='rgba(0,0,0,.25)' stroke-width='.5'/></g>"
HEART = "M0 2.2C0-.6 3.6-.8 4 2C4.4-.8 8-.6 8 2.2C8 5 4 7 4 9C4 7 0 5 0 2.2Z"
BG = {}
BG['nightsky'] = S(f"<defs>{grad('g','#120A2A','#3A2A6B')}</defs><rect width='100' height='100' fill='url(#g)'/>{stars(46)}<circle cx='76' cy='20' r='9' fill='#FFF3D6'/><circle cx='80' cy='17' r='8' fill='#22163F'/>")
BG['hauntedmoon'] = S(f"<defs>{grad('g','#1E0F3A','#6B2F5E')}</defs><rect width='100' height='100' fill='url(#g)'/>{stars(16,'#F5C4B3',60,.8)}<circle cx='50' cy='38' r='24' fill='#F5A25D' opacity='.95'/><circle cx='43' cy='31' r='4' fill='#E8792B' opacity='.5'/><circle cx='58' cy='45' r='3' fill='#E8792B' opacity='.5'/>"
                      f"<path d='M0 86q20-14 40-4t36-6q14-4 24 4v20H0z' fill='#1B0F2E'/>{bat(12,20,1.9)}{bat(74,14,1.6)}{bat(76,58,1.4)}{bat(10,52,1.3)}")
BG['pumpkinpatch'] = S(f"<defs>{grad('g','#F5A25D','#7A3A1E')}</defs><rect width='100' height='100' fill='url(#g)'/><circle cx='22' cy='20' r='8' fill='#FFE2A8' opacity='.8'/><rect y='76' width='100' height='24' fill='#4A2F20'/><path d='M0 76q25-4 50 0t50 0' stroke='#5E3E2A' stroke-width='2' fill='none'/>{pumpkin(14,86,1.1)}{pumpkin(86,88,1.2)}{pumpkin(50,95,.8)}{pumpkin(30,79,.6)}{pumpkin(70,79,.6)}")
cols = ['#B23A48', '#E9A93B', '#8B5A2B', '#C0582F', '#D85A30']
lv = ''.join(leaf(x, y, R.uniform(0, 180), cols[i % 5], R.uniform(.9, 1.4)) for i, (x, y) in enumerate([(10,12),(26,8),(80,10),(92,26),(8,36),(90,52),(12,62),(86,78),(18,88),(40,94),(62,92),(70,6),(50,4),(94,90)]))
BG['autumnleaves'] = S(f"<defs>{grad('g','#FBE3A1','#E8792B')}</defs><rect width='100' height='100' fill='url(#g)'/>{lv}")
rain = ''.join(f"<path d='M{x:.0f} {y:.0f}l-2 6' stroke='#E8F4FF' stroke-width='.7' opacity='.6'/>" for x, y in [(R.uniform(2,98), R.uniform(0,90)) for _ in range(60)])
BG['rainyday'] = S(f"<defs>{grad('g','#7F93B0','#46546E')}</defs><rect width='100' height='100' fill='url(#g)'/><ellipse cx='30' cy='10' rx='22' ry='8' fill='#DDE3EC' opacity='.6'/><ellipse cx='74' cy='8' rx='24' ry='9' fill='#DDE3EC' opacity='.5'/>{rain}<ellipse cx='50' cy='95' rx='34' ry='4' fill='#9FB4D0' opacity='.6'/>")
snow = ''.join(f"<circle cx='{R.uniform(2,98):.1f}' cy='{R.uniform(0,88):.1f}' r='{R.uniform(.6,1.6):.1f}' fill='#FFFFFF'/>" for _ in range(55))
BG['snowfall'] = S(f"<defs>{grad('g','#7FA6D9','#DDEEFF')}</defs><rect width='100' height='100' fill='url(#g)'/>{snow}<path d='M0 88q25-8 50 0t50 0v12H0z' fill='#FFFFFF'/>")
bulbs = ''.join(f"<circle cx='{x}' cy='{10 + 6 * math.sin(x / 9):.1f}' r='2' fill='{['#E0443A','#F5D547','#4A7BD8','#F08BC0'][i % 4]}'/>" for i, x in enumerate(range(4, 100, 8)))
tree = lambda x, s: f"<path d='M{x} {100 - 26 * s}l{-9 * s} {22 * s}h{18 * s}z' fill='#3E7A55'/><rect x='{x - 1.5 * s}' y='{100 - 4 * s}' width='{3 * s}' height='{4 * s}' fill='#6B4A32'/>"
BG['xmas'] = S(f"<defs>{grad('g','#7A1F2B','#C0392B')}</defs><rect width='100' height='100' fill='url(#g)'/><path d='M0 10q12 10 25 0t25 0t25 0t25 0' stroke='#2B1A1A' stroke-width='.8' fill='none'/>{bulbs}{stars(20,'#FFE7A3',100,.7)}{tree(24,1.05)}{tree(76,1.15)}")
hearts = ''.join(f"<path d='{HEART}' transform='translate({x} {y}) scale({s})' fill='{c}'/>" for x, y, s, c in [(6,8,1,'#F08BC0'),(80,6,1.2,'#E0443A'),(88,40,.9,'#F08BC0'),(4,50,1.1,'#E0443A'),(10,82,1,'#F08BC0'),(78,80,1.3,'#E0443A'),(44,90,.8,'#F08BC0'),(40,4,.8,'#E0443A')])
BG['hearts'] = S(f"<defs>{grad('g','#FFE3EC','#F7B2C8')}</defs><rect width='100' height='100' fill='url(#g)'/>{hearts}")
bl = ''.join(f"<g transform='translate({x} {y})'>" + ''.join(f"<circle cx='{1.6 * math.cos(a * 1.2566):.1f}' cy='{1.6 * math.sin(a * 1.2566):.1f}' r='1.3' fill='#F7A8C4'/>" for a in range(5)) + "<circle r='.8' fill='#E9A93B'/></g>" for x, y in [(8,14),(18,8),(28,16),(14,26),(84,30),(92,18),(78,44),(90,60),(8,70)])
BG['blossom'] = S(f"<defs>{grad('g','#FFF4F8','#F7C6DA')}</defs><rect width='100' height='100' fill='url(#g)'/><path d='M0 6q14 4 30 14M10 10q4 10 4 18M100 14q-10 10-20 34M88 26q4 18 2 36' stroke='#7A5A48' stroke-width='1.6' fill='none'/>{bl}")
BG['beach'] = S("<rect width='100' height='100' fill='#BFE3F5'/><circle cx='80' cy='18' r='9' fill='#F5D547'/><path d='M0 60h100v18H0z' fill='#4A9FD8'/><path d='M0 62q8-3 16 0t16 0t16 0t16 0t16 0t20 0' stroke='#E8F4FF' stroke-width='1.2' fill='none'/><path d='M0 78q50-6 100 0v22H0z' fill='#F2D49B'/><path d='M8 30q6-3 12 0q6-3 12 0' stroke='#FFFFFF' stroke-width='1.5' fill='none'/>")
neb = "<radialGradient id='a'><stop offset='0' stop-color='#E05AA8' stop-opacity='.7'/><stop offset='1' stop-color='#E05AA8' stop-opacity='0'/></radialGradient><radialGradient id='b'><stop offset='0' stop-color='#5A8CE0' stop-opacity='.7'/><stop offset='1' stop-color='#5A8CE0' stop-opacity='0'/></radialGradient>"
BG['galaxy'] = S(f"<defs>{neb}</defs><rect width='100' height='100' fill='#120A2A'/><circle cx='26' cy='30' r='34' fill='url(#a)'/><circle cx='76' cy='72' r='36' fill='url(#b)'/>{stars(60,'#FFFFFF',100,1)}")
grid = ''.join(f"<path d='M50 60L{x} 100' stroke='#FF6FB5' stroke-width='.6'/>" for x in range(-60, 161, 20)) + ''.join(f"<path d='M0 {y}H100' stroke='#FF6FB5' stroke-width='.6'/>" for y in [64, 70, 78, 88])
BG['synthwave'] = S(f"<defs>{grad('g','#1A0B3A','#B0306E')}</defs><rect width='100' height='60' fill='url(#g)'/><circle cx='50' cy='60' r='20' fill='#F5D547'/>" + ''.join(f"<rect x='28' y='{y}' width='44' height='1.6' fill='#B0306E'/>" for y in [48, 52, 55, 58]) + f"<rect y='60' width='100' height='40' fill='#1A0B3A'/>{grid}{stars(14,'#FFFFFF',40,.7)}")
books = ''
for row_y in [4, 76]:
    x = 2
    while x < 98:
        w = R.choice([3, 4, 5]); h = R.choice([14, 16, 18])
        books += f"<rect x='{x}' y='{row_y + 20 - h}' width='{w}' height='{h}' fill='{R.choice(['#B23A48','#3E7A55','#4A7BD8','#E9A93B','#9B5DE5','#E8792B'])}'/>"; x += w + .6
BG['library'] = S(f"<rect width='100' height='100' fill='#8B5A3C'/><rect y='26' width='100' height='48' fill='#A8714A'/>{books}<rect y='24' width='100' height='2' fill='#5A3A26'/><rect y='96' width='100' height='4' fill='#5A3A26'/>")
BG['cafe'] = S("<defs><pattern id='p' width='14' height='14' patternUnits='userSpaceOnUse'><rect width='14' height='14' fill='#FFFDF6'/><rect width='7' height='14' fill='#E0443A' opacity='.55'/><rect width='14' height='7' fill='#E0443A' opacity='.55'/></pattern></defs><rect width='100' height='100' fill='url(#p)'/>")

# ---- рамки: viewBox 124, аватар — круг r=50 в центре 62
C = 62
def ring_items(n, r, fn, start=-90):
    return ''.join(fn(C + r * math.cos(math.radians(start + i * 360 / n)), C + r * math.sin(math.radians(start + i * 360 / n)), start + i * 360 / n, i) for i in range(n))
FR = {}
web = "<circle cx='62' cy='62' r='52' fill='none' stroke='#2A2433' stroke-width='2.5'/>"
for i in range(16):
    t = math.radians(-90 + i * 22.5)
    web += f"<path d='M{C + 51 * math.cos(t):.1f} {C + 51 * math.sin(t):.1f}L{C + 61 * math.cos(t):.1f} {C + 61 * math.sin(t):.1f}' stroke='#F4F0FA' stroke-width='.9'/>"
for rr in (55, 58.5):
    pts = [(C + rr * math.cos(math.radians(-90 + i * 22.5)), C + rr * math.sin(math.radians(-90 + i * 22.5))) for i in range(17)]
    d = f"M{pts[0][0]:.1f} {pts[0][1]:.1f}"
    for i in range(16):
        mx, my = (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2
        d += f"Q{C + (mx - C) * .965:.1f} {C + (my - C) * .965:.1f} {pts[i + 1][0]:.1f} {pts[i + 1][1]:.1f}"  # нить чуть провисает к центру
    web += f"<path d='{d}' fill='none' stroke='#F4F0FA' stroke-width='.8'/>"
web += "<path d='M98 22v16' stroke='#F4F0FA' stroke-width='.7'/><circle cx='98' cy='41' r='3.6' fill='#1B1528' stroke='#F4F0FA' stroke-width='.5'/><path d='M95 39l-3.5-2.5M95 41h-4M95 43l-3.5 2.5M101 39l3.5-2.5M101 41h4M101 43l3.5 2.5' stroke='#1B1528' stroke-width='.9'/>"
FR['web'] = S(web, 124)
def corn(x, y, a, i):
    return f"<g transform='translate({x:.1f} {y:.1f}) rotate({a + 90:.1f})'><path d='M-4.5 3L0-7L4.5 3Z' fill='#FFFFFF'/><path d='M-3.9 1.6L-1.6-3.3H1.6L3.9 1.6Z' fill='#E8792B'/><path d='M-4.5 3L-3.9 1.6H3.9L4.5 3Z' fill='#F5D547'/></g>"
FR['candycorn'] = S(f"<circle cx='62' cy='62' r='52' fill='none' stroke='#2A2433' stroke-width='3'/>" + ring_items(14, 57, corn), 124)
FR['bats'] = S(f"<circle cx='62' cy='62' r='52' fill='none' stroke='#9B5DE5' stroke-width='3.5'/><circle cx='62' cy='62' r='55.5' fill='none' stroke='#E8792B' stroke-width='1.2' stroke-dasharray='3 4'/>" + ring_items(6, 57, lambda x, y, a, i: bat(round(x - 10, 1), round(y - 3, 1), 1.65, '#1B1528'), -60), 124)
FR['autumnwreath'] = S(f"<circle cx='62' cy='62' r='53' fill='none' stroke='#8B5A2B' stroke-width='2'/>" + ring_items(22, 55, lambda x, y, a, i: leaf(round(x, 1), round(y, 1), round(a + 90 + (25 if i % 2 else -25)), cols[i % 5], 1.3)) + ring_items(4, 55, lambda x, y, a, i: f"<g transform='translate({x:.1f} {y:.1f})'><ellipse cy='1' rx='2.6' ry='3.2' fill='#B8742E'/><path d='M-3-1.2q3-2.6 6 0z' fill='#6B4A32'/></g>", -45), 124)
def mush(x, y, a, i):
    return f"<g transform='translate({x:.1f} {y:.1f}) rotate({a + 90:.1f})'><rect x='-2' y='-2' width='4' height='6' rx='1.5' fill='#FFF6E4'/><path d='M-7-1.5a7 6 0 0 1 14 0z' fill='#E0443A'/><circle cx='-3' cy='-4' r='1.1' fill='#FFF'/><circle cx='2' cy='-5' r='1' fill='#FFF'/><circle cx='4.5' cy='-2.6' r='.8' fill='#FFF'/></g>"
FR['mushrooms'] = S(f"<circle cx='62' cy='62' r='53' fill='none' stroke='#4C9A5B' stroke-width='4'/>" + ring_items(36, 55, lambda x, y, a, i: f"<path d='M{x:.1f} {y:.1f}l{1.5 * math.cos(math.radians(a - 20)):.1f} {1.5 * math.sin(math.radians(a - 20)):.1f}' stroke='#6FB07F' stroke-width='1'/>") + ring_items(6, 57, mush, -90), 124)
def flower(x, y, a, i):
    c = ['#F7A8C4', '#FFFFFF', '#C9B6F2', '#FBE3A1'][i % 4]
    return f"<g transform='translate({x:.1f} {y:.1f})'>" + ''.join(f"<circle cx='{3 * math.cos(k * 1.2566):.1f}' cy='{3 * math.sin(k * 1.2566):.1f}' r='2.5' fill='{c}'/>" for k in range(5)) + "<circle r='1.6' fill='#E9A93B'/></g>"
FR['flowers'] = S(f"<circle cx='62' cy='62' r='53.5' fill='none' stroke='#6FB07F' stroke-width='2.5'/>" + ring_items(24, 55, lambda x, y, a, i: leaf(round(x, 1), round(y, 1), round(a + 90 + 35), '#4C9A5B', .8)) + ring_items(12, 56, flower, -75), 124)
FR['canestripe'] = S("<circle cx='62' cy='62' r='55' fill='none' stroke='#FFFFFF' stroke-width='7'/><circle cx='62' cy='62' r='55' fill='none' stroke='#E0443A' stroke-width='7' stroke-dasharray='6 6'/><circle cx='62' cy='62' r='58.5' fill='none' stroke='rgba(0,0,0,.15)' stroke-width='.8'/><path d='M50 10q12-8 24 0l-6 6q-6-4-12 0z' fill='#3E7A55'/><circle cx='62' cy='9' r='3' fill='#E0443A'/>", 124)
def bulb(x, y, a, i):
    c = ['#E0443A', '#F5D547', '#4A7BD8', '#4CC38A', '#F08BC0'][i % 5]
    return f"<g transform='translate({x:.1f} {y:.1f}) rotate({a + 90:.1f})'><circle cy='-3' r='4.5' fill='{c}' opacity='.35'/><rect x='-1.3' y='-1' width='2.6' height='2' fill='#2A2433'/><ellipse cy='-3.6' rx='2.2' ry='3' fill='{c}'/></g>"
FR['lights'] = S("<path d='" + ''.join(('M' if i == 0 else 'L') + f"{C + (55 + 1.6 * math.sin(i * 1.3)) * math.cos(math.radians(i * 5)):.1f} {C + (55 + 1.6 * math.sin(i * 1.3)) * math.sin(math.radians(i * 5)):.1f}" for i in range(73)) + "' fill='none' stroke='#2A2433' stroke-width='1.4'/>" + ring_items(16, 56, bulb), 124)
px = set()
for i in range(360):
    a = math.radians(i); x = round((C + 55 * math.cos(a)) / 4) * 4; y = round((C + 55 * math.sin(a)) / 4) * 4; px.add((x, y))
FR['pixel'] = S(''.join(f"<rect x='{x - 2.5}' y='{y - 2.5}' width='5' height='5' fill='{'#39E07A' if (x + y) % 8 else '#F5D547'}' stroke='#0F0F2D' stroke-width='.8'/>" for x, y in sorted(px)), 124)
FR['catears'] = S("<path d='M22 34L18 4L48 18Z' fill='#2B2340'/><path d='M25 28L23 11L41 19Z' fill='#F7A8C4'/><path d='M102 34L106 4L76 18Z' fill='#2B2340'/><path d='M99 28L101 11L83 19Z' fill='#F7A8C4'/><circle cx='62' cy='62' r='53' fill='none' stroke='#2B2340' stroke-width='4'/>"
                  "<path d='M2 66l14-2M2 74l14 0M108 64l14 2M108 74h14' stroke='#2B2340' stroke-width='1.6' stroke-linecap='round'/>", 124)
FR['bubbles'] = S(ring_items(18, 56, lambda x, y, a, i: f"<circle cx='{x + R.uniform(-1.5, 1.5):.1f}' cy='{y + R.uniform(-1.5, 1.5):.1f}' r='{[4.5, 3, 5.5, 2.5][i % 4]}' fill='rgba(255,255,255,.35)' stroke='#7FD4FF' stroke-width='1.2'/><circle cx='{x - 1:.1f}' cy='{y - 1.2:.1f}' r='.9' fill='#FFFFFF'/>"), 124)
def ray(x, y, a, i):
    l = 7 if i % 2 else 4.5
    return f"<g transform='translate({x:.1f} {y:.1f}) rotate({a + 90:.1f})'><path d='M-2.4 2L0 {-l}L2.4 2Z' fill='{'#F5D547' if i % 2 else '#E9A93B'}'/></g>"
FR['sunrays'] = S("<circle cx='62' cy='62' r='53' fill='none' stroke='#F5D547' stroke-width='3'/>" + ring_items(28, 56, ray), 124)
FR['clouds'] = S(ring_items(22, 56, lambda x, y, a, i: f"<circle cx='{x:.1f}' cy='{y + .6:.1f}' r='{[7, 6, 7.5, 6.5][i % 4]}' fill='#C9DDF2'/>") + ring_items(22, 56, lambda x, y, a, i: f"<circle cx='{x:.1f}' cy='{y:.1f}' r='{[6.6, 5.6, 7, 6][i % 4]}' fill='#FFFFFF'/>"), 124)
def gem(x, y, a, i):
    c = ['#E0443A', '#4A7BD8', '#4CC38A', '#9B5DE5'][i % 4]
    return f"<g transform='translate({x:.1f} {y:.1f}) rotate({a + 90:.1f})'><path d='M0-5L4-1L0 5L-4-1Z' fill='{c}' stroke='#8B6914' stroke-width='.8'/><path d='M0-5L-2-1H2Z' fill='rgba(255,255,255,.5)'/></g>"
FR['jewels'] = S("<circle cx='62' cy='62' r='54' fill='none' stroke='#E9A93B' stroke-width='4'/><circle cx='62' cy='62' r='54' fill='none' stroke='#FBE3A1' stroke-width='1' stroke-dasharray='2 5'/>" + ring_items(8, 55, gem, -90), 124)

css = ["/* тематические фоны и рамки аватаров — сгенерированы tools/ava_deco_gen.py: фон .bg-<имя>, рамка .fr-<имя> поверх кружка */"]
for k, v in BG.items(): css.append(f".pp-ava.bg-{k} {{ background: {uri(v)} center / cover no-repeat; }}")
css.append(".pp-ava.fr-svg { box-shadow: 0 6px 16px rgba(0,0,0,.3); }")
css.append(".pp-ava.fr-svg::before { content: ''; position: absolute; inset: calc(var(--ava) * -.12); background: var(--fr) center / 100% 100% no-repeat; pointer-events: none; z-index: 2; }")
for k, v in FR.items(): css.append(f".pp-ava.fr-{k} {{ --fr: {uri(v)}; }}")
open('site/assets/ava-deco.css', 'w').write('\n'.join(css) + '\n')
# предпросмотр
html = "<html><body style='background:#2B1A51;display:flex;flex-wrap:wrap;gap:24px;padding:24px'>"
for k, v in BG.items(): html += f"<div style='width:120px;height:120px;border-radius:50%;background:{uri(v).replace(chr(34), chr(39))} center/cover'></div>"
for k, v in FR.items(): html += f"<div style='position:relative;width:120px;height:120px;margin:16px;border-radius:50%;background:#F4F0FA'><div style='position:absolute;inset:-14px;background:{uri(v).replace(chr(34), chr(39))} center/100% 100%'></div></div>"
open('/tmp/ava-deco-preview.html', 'w').write(html + "</body></html>")
print(len(BG), len(FR), sum(len(x) for x in css))
