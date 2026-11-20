"""Kaķis Oskars — oriģināls maskots (melns, apaļš, neveikls) + doodle dekori.
Palaid: python3 a1-pack/tools/draw_oscar.py  → a1-pack/design/oscar/*.svg
Šalle un konfeti — var(--accent) (tēmas krāsa)."""
from pathlib import Path
OUT = Path(__file__).resolve().parent.parent / "design" / "oscar"
A = "var(--accent,#FF5A36)"
K = "#111"
S = f'fill="none" stroke="{K}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'

def head(x, y, rot=0, eyes="open", s=1.0):
    e = ""
    if eyes == "open":
        e = (f'<circle cx="-16" cy="-2" r="11" fill="#fff"/><circle cx="16" cy="-2" r="11" fill="#fff"/>'
             f'<circle cx="-14" cy="0" r="4.5" fill="{K}"/><circle cx="18" cy="0" r="4.5" fill="{K}"/>'
             f'<circle cx="-12.5" cy="-2" r="1.4" fill="#fff"/><circle cx="19.5" cy="-2" r="1.4" fill="#fff"/>')
    elif eyes == "worried":
        e = (f'<circle cx="-16" cy="-2" r="13" fill="#fff"/><circle cx="16" cy="-2" r="13" fill="#fff"/>'
             f'<circle cx="-16" cy="-4" r="3" fill="{K}"/><circle cx="16" cy="-4" r="3" fill="{K}"/>'
             f'<path d="M-28,-22 L-8,-17 M28,-22 L8,-17" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>')
    elif eyes == "odd":
        e = (f'<circle cx="-16" cy="-2" r="12" fill="#fff"/><circle cx="17" cy="-1" r="8" fill="#fff"/>'
             f'<circle cx="-13" cy="-4" r="4.5" fill="{K}"/><circle cx="18" cy="1" r="3" fill="{K}"/>')
    elif eyes == "dizzy":
        e = ('<path d="M-16,-2 m-8,0 a8,8 0 1,1 8,8 a5,5 0 1,1 -5,-5 a2,2 0 1,1 2,2" fill="none" stroke="#fff" stroke-width="1.6"/>'
             '<path d="M16,-2 m-8,0 a8,8 0 1,1 8,8 a5,5 0 1,1 -5,-5 a2,2 0 1,1 2,2" fill="none" stroke="#fff" stroke-width="1.6"/>')
    elif eyes == "closed":
        e = '<path d="M-26,0 Q-16,8 -6,0 M6,0 Q16,8 26,0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'
    elif eyes == "happy":
        e = '<path d="M-26,2 Q-16,-10 -6,2 M6,2 Q16,-10 26,2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'
    mouth = '<path d="M-6,16 Q-3,20 0,16 Q3,20 6,16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'
    if eyes in ("worried", "dizzy"):
        mouth = '<ellipse cx="0" cy="19" rx="4" ry="5" fill="#fff"/>'
    wh = f'<path d="M-40,8 L-58,4 M-40,14 L-57,16 M40,8 L58,4 M40,14 L57,16" {S} stroke-width="1.2"/>'
    return (f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">{wh}'
            f'<path d="M-36,-14 Q-38,-34 -32,-46 Q-20,-38 -10,-30 Z M36,-14 Q38,-34 32,-46 Q20,-38 10,-30 Z" fill="{K}" stroke="{K}" stroke-width="2" stroke-linejoin="round"/>'
            f'<ellipse cx="0" cy="0" rx="34" ry="31" fill="{K}"/>{e}{mouth}</g>')

def scarf(x, y, w=64, rot=0):
    return (f'<g transform="translate({x},{y}) rotate({rot})"><rect x="{-w/2}" y="-4.5" width="{w}" height="9" rx="4.5" fill="{A}" stroke="{K}" stroke-width="1.4"/>'
            f'<path d="M{w/2-18},4 l5,24 l8,-3 l-5,-22 Z" fill="{A}" stroke="{K}" stroke-width="1.4" stroke-linejoin="round"/></g>')

def tail(d, w=7):
    return f'<path d="{d}" fill="none" stroke="{K}" stroke-width="{w}" stroke-linecap="round"/>'

def paw(x1, y1, x2, y2, w=10):
    return f'<path d="M{x1},{y1} L{x2},{y2}" stroke="{K}" stroke-width="{w}" stroke-linecap="round"/>'

def qmark(x, y, s=1):
    return f'<g transform="translate({x},{y}) scale({s})"><path d="M-8,-10 Q-8,-22 2,-22 Q12,-22 12,-12 Q12,-4 2,0 L2,8" {S}/><circle cx="2" cy="17" r="2.5" fill="{K}"/></g>'

def star(x, y, s=1, fill="none"):
    return f'<path transform="translate({x},{y}) scale({s})" d="M0,-12 L3,-3 L12,0 L3,3 L0,12 L-3,3 L-12,0 L-3,-3 Z" fill="{fill}" stroke="{K}" stroke-width="1.6" stroke-linejoin="round"/>'

def motion(x, y, rot=0):
    return f'<path transform="translate({x},{y}) rotate({rot})" d="M0,0 l10,-6 M2,10 l12,-4 M4,20 l10,-2" {S} stroke-width="1.6"/>'

P = {}
P["hello"] = ("0 0 200 200",
    tail("M138,178 C178,182 192,140 170,124 C160,118 154,128 162,134") +
    '<ellipse cx="100" cy="152" rx="39" ry="39" fill="#111"/>' + paw(132, 140, 160, 84) +
    '<ellipse cx="82" cy="190" rx="14" ry="7" fill="#111"/><ellipse cx="118" cy="190" rx="14" ry="7" fill="#111"/>' +
    scarf(100, 116) + head(98, 84) + motion(168, 66, 10))
P["oops"] = ("0 0 200 200",
    '<g transform="translate(16,8) scale(.9)">' + tail("M150,160 C170,150 160,128 178,118") +
    '<ellipse cx="110" cy="168" rx="58" ry="22" fill="#111"/>' + paw(150, 176, 186, 184, 10) + paw(70, 178, 92, 192, 9) +
    head(52, 150, -24, "dizzy") + star(36, 98, .9) + star(70, 90, .7) + star(18, 118, .6) +
    '<g transform="translate(140,52) rotate(-25)"><path d="M-26,0 L0,-10 L0,22 L-26,30 Z M26,0 L0,-10 L0,22 L26,30 Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/>'
    '<path d="M-20,6 L-6,1 M-20,13 L-6,8 M6,1 L20,6 M6,8 L20,13" stroke="#111" stroke-width="2"/></g>' + motion(102, 52, -40) +
    scarf(80, 158, 40, -70) + "</g>")
P["tangled"] = ("0 0 200 200",
    head(92, 70, -8, "worried") +
    f'<circle cx="104" cy="140" r="52" fill="{A}" stroke="#111" stroke-width="2"/>'
    f'<path d="M60,112 Q104,150 150,108 M54,140 Q104,176 156,138 M70,178 Q90,120 64,104 M110,90 Q150,140 128,188 M80,96 Q120,150 92,192" {S} stroke-width="1.6"/>'
    + paw(60, 128, 44, 150, 10) + paw(150, 150, 168, 168, 10) +
    f'<path d="M156,150 C182,150 190,176 168,182 C150,186 160,196 186,196" {S} stroke-width="1.6"/>' + qmark(150, 40, .9))
P["teacher"] = ("0 0 200 200",
    '<rect x="10" y="22" width="100" height="78" rx="4" fill="#fff" stroke="#111" stroke-width="2"/>'
    '<path d="M24,80 L36,44 L48,80 M29,66 L43,66 M60,50 L68,44 L68,80 M60,80 L76,80" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    f'<path d="M84,52 Q92,46 100,52 M84,66 L100,66" {S} stroke-width="1.6"/>'
    '<path d="M30,100 L22,140 M90,100 L98,140" stroke="#111" stroke-width="2" stroke-linecap="round"/>' +
    tail("M178,182 C198,170 196,138 182,132") +
    '<ellipse cx="150" cy="160" rx="32" ry="34" fill="#111"/>' + paw(124, 146, 110, 118, 9) +
    '<path d="M112,122 Q90,96 76,92" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    scarf(150, 128, 54) + head(150, 96, 6, "open", .85))
P["confused"] = ("0 0 200 200",
    tail("M140,180 C176,184 186,150 168,140") +
    '<ellipse cx="100" cy="154" rx="37" ry="38" fill="#111"/>' + paw(70, 150, 76, 116, 10) +
    '<ellipse cx="84" cy="192" rx="13" ry="6" fill="#111"/><ellipse cx="116" cy="192" rx="13" ry="6" fill="#111"/>' +
    scarf(100, 120, 60, 6) + head(102, 86, 16, "odd") + qmark(158, 46, 1.2) + qmark(40, 40, .8) + qmark(176, 96, .6))
P["sleep"] = ("0 0 200 200",
    '<g transform="translate(10,0) scale(.94)"><ellipse cx="104" cy="160" rx="64" ry="30" fill="#111"/>' +
    tail("M160,170 C190,170 184,190 140,190 C110,190 92,186 80,184", 11) +
    head(64, 140, -10, "closed", .9) +
    f'<path d="M110,92 h14 l-14,16 h14 M136,66 h18 l-18,20 h18 M164,38 h22 l-22,24 h22" {S} stroke-width="2"/>' +
    scarf(96, 150, 36, -60) + "</g>")
P["spill"] = ("0 0 200 200",
    tail("M60,180 C24,184 18,150 34,140") +
    '<ellipse cx="96" cy="154" rx="37" ry="38" fill="#111"/>' + paw(128, 144, 150, 116, 10) +
    '<g transform="translate(160,98) rotate(60)"><path d="M-14,-16 L14,-16 L10,16 L-10,16 Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/>'
    '<path d="M14,-8 Q26,-6 24,6 Q22,12 12,10" fill="none" stroke="#111" stroke-width="2"/></g>'
    f'<path d="M150,118 Q160,150 150,170 Q170,186 190,176" fill="none" stroke="#111" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round"/>'
    f'<ellipse cx="166" cy="190" rx="26" ry="6" fill="{A}" stroke="#111" stroke-width="1.6"/>' +
    '<ellipse cx="80" cy="192" rx="13" ry="6" fill="#111"/><ellipse cx="112" cy="192" rx="13" ry="6" fill="#111"/>' +
    scarf(96, 118, 60) + head(94, 84, -6, "worried") + motion(150, 60, 0))
P["idea"] = ("0 0 200 200",
    tail("M140,180 C178,184 190,150 170,138") +
    '<ellipse cx="100" cy="158" rx="37" ry="36" fill="#111"/>' + paw(130, 150, 150, 120, 10) +
    '<ellipse cx="84" cy="194" rx="13" ry="5" fill="#111"/><ellipse cx="116" cy="194" rx="13" ry="5" fill="#111"/>' +
    scarf(100, 126, 60) + head(100, 96, 0, "happy") +
    f'<g transform="translate(100,30)"><circle r="16" fill="{A}" stroke="#111" stroke-width="2"/><path d="M-6,16 L-6,24 L6,24 L6,16 M-4,29 L4,29" {S} stroke-width="2"/>'
    f'<path d="M-28,-4 l-10,-2 M28,-4 l10,-2 M-20,-22 l-7,-7 M20,-22 l7,-7 M0,-26 l0,-9" {S} stroke-width="2"/></g>')
P["peek"] = ("0 0 200 110",
    head(100, 74, 0, "open", 1.05) + '<ellipse cx="62" cy="108" rx="16" ry="9" fill="#111"/><ellipse cx="138" cy="108" rx="16" ry="9" fill="#111"/>'
    '<path d="M57,103 l0,6 M67,103 l0,6 M133,103 l0,6 M143,103 l0,6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>')
P["celebrate"] = ("0 0 200 200",
    tail("M128,160 C170,170 176,130 160,120") +
    '<ellipse cx="100" cy="140" rx="35" ry="36" fill="#111"/>' + paw(70, 124, 44, 82, 10) + paw(130, 124, 156, 82, 10) +
    '<path d="M86,172 L76,194 M114,172 L124,194" stroke="#111" stroke-width="10" stroke-linecap="round"/>' +
    scarf(100, 108, 58) + head(100, 76, 0, "happy") +
    f'<g fill="{A}" stroke="#111" stroke-width="2"><rect x="24" y="40" width="10" height="6" transform="rotate(30 29 43)"/><rect x="164" y="34" width="10" height="6" transform="rotate(-25 169 37)"/>'
    f'<circle cx="40" cy="160" r="5"/><circle cx="176" cy="150" r="5"/><rect x="100" y="8" width="10" height="6" transform="rotate(15 105 11)"/></g>' +
    star(30, 100, .7) + star(178, 100, .7))

D = {}
D["sun"] = ("0 0 60 60", f'<circle cx="30" cy="30" r="11" {S}/><path d="M30,4 v8 M30,48 v8 M4,30 h8 M48,30 h8 M12,12 l6,6 M42,42 l6,6 M48,12 l-6,6 M12,48 l6,-6" {S}/>')
D["cloud"] = ("0 0 90 50", f'<path d="M14,40 Q2,40 4,30 Q6,20 18,22 Q20,8 36,10 Q46,2 58,12 Q74,8 76,24 Q88,26 86,36 Q84,42 74,40 Z" {S} stroke-width="2"/>')
D["sparkle"] = ("0 0 40 40", f'<path d="M20,4 Q22,18 36,20 Q22,22 20,36 Q18,22 4,20 Q18,18 20,4 Z" {S} stroke-width="2"/>')
D["star"] = ("0 0 40 40", f'<path d="M20,4 L24,15 L36,16 L27,24 L30,36 L20,29 L10,36 L13,24 L4,16 L16,15 Z" {S} stroke-width="2"/>')
D["arrow"] = ("0 0 90 40", f'<path d="M4,30 C20,4 40,40 60,16 Q66,10 80,14 M70,6 L82,14 L72,22" {S} stroke-width="2"/>')
D["pencil"] = ("0 0 60 60", f'<path d="M10,50 L14,38 L42,10 L50,18 L22,46 Z M38,14 L46,22 M10,50 L22,46" {S} stroke-width="2"/>')
D["moon"] = ("0 0 50 50", f'<path d="M34,8 A18,18 0 1,0 42,36 A14,14 0 1,1 34,8 Z" {S} stroke-width="2"/>')
D["bulb"] = ("0 0 50 60", f'<circle cx="25" cy="22" r="13" {S} stroke-width="2"/><path d="M19,36 v8 h12 v-8 M21,50 h8" {S} stroke-width="2"/>')

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (vb, body) in {**P, **{"d-" + k: v for k, v in D.items()}}.items():
        (OUT / f"{name}.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Oskars">{body}</svg>\n')
    print("svg:", len(P) + len(D))

if __name__ == "__main__":
    main()
