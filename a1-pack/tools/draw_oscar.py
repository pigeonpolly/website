"""Kaķis Oskars — oriģināls maskots: viens plūstošs melns siluets, lielas baltas acis ar punktiņiem,
garā aste, tievas ķepas. Neveikls. Akcenta krāsa (šalle, dzija, kafija) — var(--accent).
Palaid: python3 a1-pack/tools/draw_oscar.py  → a1-pack/design/oscar/*.svg"""
from pathlib import Path
OUT = Path(__file__).resolve().parent.parent / "design" / "oscar"
A = "var(--accent,#FF5A36)"
K = "#111"
L = f'fill="none" stroke="{K}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'


def sil(d):
    return f'<path d="{d}" fill="{K}"/>'


def limb(d, w=9):
    return f'<path d="{d}" fill="none" stroke="{K}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'


# sēdošs kaķis: galva + kakls + bumbierveida ķermenis — viena kontūra
SIT = ("M70,62 C69,50 70,43 72,38 Q75,32 80,36 C84,40 88,43 92,45 C97,44 103,44 108,45 "
       "C112,43 116,40 120,36 Q125,32 128,38 C130,43 131,50 130,62 C130,77 125,87 120,93 "
       "C139,112 150,141 147,168 C146,181 138,187 127,187 L73,187 C62,187 54,181 53,168 "
       "C50,141 61,112 80,93 C75,87 70,77 70,62 Z")


def face(cx=100, cy=64, kind="open", rot=0, sc=.86):
    w = "#fff"
    if kind == "open":
        e = (f'<ellipse cx="-12" cy="0" rx="10" ry="11" fill="{w}"/><ellipse cx="12" cy="0" rx="10" ry="11" fill="{w}"/>'
             f'<circle cx="-9" cy="1" r="2.6" fill="{K}"/><circle cx="9" cy="1" r="2.6" fill="{K}"/>')
    elif kind == "side":
        e = (f'<ellipse cx="-12" cy="0" rx="10" ry="11" fill="{w}"/><ellipse cx="12" cy="0" rx="10" ry="11" fill="{w}"/>'
             f'<circle cx="-6" cy="0" r="2.6" fill="{K}"/><circle cx="18" cy="0" r="2.6" fill="{K}"/>')
    elif kind == "up":
        e = (f'<ellipse cx="-12" cy="0" rx="10" ry="11" fill="{w}"/><ellipse cx="12" cy="0" rx="10" ry="11" fill="{w}"/>'
             f'<circle cx="-10" cy="-5" r="2.6" fill="{K}"/><circle cx="10" cy="-5" r="2.6" fill="{K}"/>')
    elif kind == "odd":
        e = (f'<ellipse cx="-12" cy="0" rx="11" ry="12" fill="{w}"/><ellipse cx="12" cy="1" rx="7.5" ry="8" fill="{w}"/>'
             f'<circle cx="-12" cy="-2" r="2.6" fill="{K}"/><circle cx="13" cy="2" r="2" fill="{K}"/>')
    elif kind == "wide":
        e = (f'<ellipse cx="-12" cy="0" rx="11" ry="12" fill="{w}"/><ellipse cx="12" cy="0" rx="11" ry="12" fill="{w}"/>'
             f'<circle cx="-12" cy="0" r="1.8" fill="{K}"/><circle cx="12" cy="0" r="1.8" fill="{K}"/>')
    elif kind == "closed":
        e = f'<path d="M-20,1 Q-12,6 -4,1 M4,1 Q12,6 20,1" fill="none" stroke="{w}" stroke-width="1.8" stroke-linecap="round"/>'
    elif kind == "happy":
        e = f'<path d="M-20,3 Q-12,-6 -4,3 M4,3 Q12,-6 20,3" fill="none" stroke="{w}" stroke-width="2" stroke-linecap="round"/>'
    elif kind == "dizzy":
        e = (f'<path d="M-17,-4 l9,8 M-8,-4 l-9,8 M8,-4 l9,8 M17,-4 l-9,8" fill="none" stroke="{w}" stroke-width="1.8" stroke-linecap="round"/>')
    nose = f'<path d="M-2,13 L2,13 L0,15.5 Z" fill="{w}"/>'
    return f'<g transform="translate({cx},{cy}) rotate({rot}) scale({sc})">{e}{nose}</g>'


def scarf(path="M79,93 Q100,106 121,93", tail="M113,99 q4,14 -1,26"):
    return (f'<path d="{path}" fill="none" stroke="{A}" stroke-width="7" stroke-linecap="round"/>'
            f'<path d="{tail}" fill="none" stroke="{A}" stroke-width="6" stroke-linecap="round"/>')


def legline(x=100, y1=150, y2=186):
    return f'<path d="M{x},{y1} L{x},{y2}" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>'


def qmark(x, y, s=1):
    return f'<g transform="translate({x},{y}) scale({s})"><path d="M-7,-9 Q-7,-20 2,-20 Q11,-20 11,-11 Q11,-4 2,0 L2,7" {L}/><circle cx="2" cy="15" r="2" fill="{K}"/></g>'


def spark(x, y, s=1):
    return f'<path transform="translate({x},{y}) scale({s})" d="M0,-10 Q1,-1 10,0 Q1,1 0,10 Q-1,1 -10,0 Q-1,-1 0,-10 Z" {L}/>'


def lines(x, y, rot=0):
    return f'<path transform="translate({x},{y}) rotate({rot})" d="M0,0 l9,-5 M2,9 l11,-3 M3,18 l9,-1" {L}/>'


TAIL_R = limb("M138,180 C166,186 182,166 178,144 C175,128 164,120 170,104", 8)
TAIL_L = limb("M62,180 C34,186 18,166 22,144 C25,128 36,120 30,104", 8)

P = {}
P["hello"] = ("0 0 200 200", TAIL_L + sil(SIT) + limb("M128,118 C140,108 148,92 152,72", 9) +
              limb("M152,72 l2,-4", 11) + legline() + scarf() + face() + lines(160, 60, 10))
P["confused"] = ("0 0 200 200", f'<g transform="rotate(-8 100 186)">' + TAIL_R + sil(SIT) + legline() + scarf() + face(kind="odd") + "</g>"
                 + qmark(156, 36, 1.2) + qmark(30, 36, .8) + qmark(172, 80, .6))
P["idea"] = ("0 0 200 200", TAIL_R + sil(SIT.replace("M70,26", "M70,26")) + legline() + scarf() + face(kind="up") +
             f'<g transform="translate(100,0)"><circle cx="0" cy="12" r="0" fill="none"/></g>')
# idea: spuldze virs galvas — maza, tieva
P["idea"] = ("0 0 220 220", '<g transform="translate(10,22)">' + TAIL_R + sil(SIT) + legline() + scarf() + face(kind="up") + "</g>" +
             f'<g transform="translate(110,22)"><circle r="11" fill="{A}"/><path d="M-4,11 v5 h8 v-5 M-3,20 h6" {L}/>'
             f'<path d="M-20,-2 l-7,-1 M20,-2 l7,-1 M-14,-15 l-5,-5 M14,-15 l5,-5 M0,-19 v-6" {L}/></g>')
# guļus uz muguras, ķepas gaisā — siluets vienā gabalā
OOPS = ("M30,150 C26,134 32,120 44,114 C42,106 40,100 41,98 Q43,94 47,97 C52,101 56,106 60,112 C66,110 72,110 78,112 "
        "C100,116 130,126 152,132 C170,137 178,148 172,160 C166,172 140,172 110,170 "
        "C88,168 66,170 54,168 C42,166 32,160 30,150 Z")
P["oops"] = ("0 0 200 200", limb("M168,148 C184,140 186,118 176,104 C170,96 176,86 186,88", 8) + sil(OOPS) + sil("M34,126 Q20,118 17,120 Q15,124 30,140 Z") +
             limb("M100,128 C96,108 104,96 96,80", 8) + limb("M124,134 C126,112 136,104 132,88", 8) +
             limb("M150,140 C162,124 160,112 168,100", 8) + face(54, 140, "dizzy", -70) +
             spark(30, 92, .9) + spark(62, 72, .7) +
             f'<g transform="translate(150,52) rotate(-22)"><path d="M-22,0 L0,-8 L0,18 L-22,26 Z M22,0 L0,-8 L0,18 L22,26 Z" fill="#fff" {L[10:]}/>'
             f'<path d="M-17,6 L-5,2 M-17,12 L-5,8 M5,2 L17,6 M5,8 L17,12" {L}/></g>' + lines(112, 52, -40) +
             f'<path d="M76,118 Q72,132 82,146" fill="none" stroke="{A}" stroke-width="6" stroke-linecap="round"/>')
# apķēries ap dzijas kamolu, dzija apvijusies
P["tangled"] = ("0 0 200 200", TAIL_R + sil(SIT) + face(kind="wide") +
                f'<circle cx="100" cy="150" r="34" fill="{A}"/>'
                f'<path d="M72,136 Q100,152 128,132 M68,152 Q100,170 132,150 M76,172 Q92,140 84,120 M108,118 Q130,150 112,182 M92,120 Q118,148 96,183" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4"/>'
                + limb("M70,118 C62,130 64,146 72,150", 8) + limb("M130,118 C138,130 136,146 128,150", 8) +
                f'<path d="M64,104 C80,96 92,120 110,104 C124,92 140,106 136,120 M132,168 C150,176 150,190 170,188 C182,187 186,194 182,198" fill="none" stroke="{A}" stroke-width="2" stroke-linecap="round"/>'
                + qmark(150, 30, .9))
# izlej kafiju
P["spill"] = ("0 0 200 200", TAIL_L + sil(SIT) + legline() + scarf() + face(kind="wide") +
              limb("M126,118 C140,118 150,110 156,100", 9) +
              f'<g transform="translate(166,92) rotate(55)"><path d="M-11,-13 L11,-13 L8,13 L-8,13 Z" fill="#fff" {L[10:]}/>'
              f'<path d="M11,-6 Q21,-4 19,5 Q17,10 9,8" {L}/></g>'
              f'<path d="M168,108 C172,130 160,150 166,176" fill="none" stroke="{A}" stroke-width="2.4" stroke-dasharray="2 6" stroke-linecap="round"/>'
              f'<ellipse cx="166" cy="188" rx="20" ry="4.5" fill="{A}"/>' + lines(150, 58))
# pie tāfeles (stāv uz pakaļkājām, rāda)
P["teacher"] = ("0 0 270 200",
                f'<rect x="8" y="20" width="96" height="72" rx="3" fill="#fff" {L[10:]}/>'
                f'<path d="M22,74 L33,40 L44,74 M27,62 L39,62 M56,46 L63,40 L63,74 M56,74 L70,74 M80,52 q8,-6 16,0 M80,64 h16" {L}/>'
                f'<path d="M28,92 L20,132 M84,92 L92,132" {L}/>' +
                '<g transform="translate(70,0)">' + TAIL_R + sil(SIT) + legline() + scarf() + face(kind="side") +
                limb("M76,116 C62,106 50,96 44,84", 9) + "</g>")
# guļ saritinājies, aste apvijusies
SLEEP = ("M40,170 C34,150 44,128 64,122 C62,114 60,108 61,106 Q63,102 67,105 C71,109 76,114 80,120 C88,118 94,120 100,122 "
         "C130,118 162,128 168,150 C174,170 152,182 110,182 C80,182 46,184 40,170 Z")
P["sleep"] = ("0 0 200 200", sil(SLEEP) + sil("M80,124 Q88,106 91,106 Q95,110 98,124 Z") + limb("M166,160 C176,178 150,190 110,188 C84,187 62,188 56,180", 8) +
              face(76, 150, "closed", -8) +
              f'<path d="M66,128 Q80,140 98,132" fill="none" stroke="{A}" stroke-width="6" stroke-linecap="round"/>'
              f'<path d="M112,90 h12 l-12,13 h12 M134,66 h15 l-15,16 h15 M160,40 h18 l-18,20 h18" {L}/>')
# prieks — stāv, abas ķepas augšā
P["celebrate"] = ("0 0 200 200", TAIL_R + sil(SIT) + legline() + scarf() + face(kind="happy") +
                  limb("M76,114 C64,100 58,84 56,66", 9) + limb("M124,114 C136,100 142,84 144,66", 9) +
                  f'<g fill="{A}"><rect x="30" y="40" width="8" height="5" rx="1" transform="rotate(30 34 42)"/><rect x="164" y="34" width="8" height="5" rx="1" transform="rotate(-25 168 36)"/>'
                  f'<circle cx="40" cy="150" r="3.5"/><circle cx="170" cy="140" r="3.5"/><rect x="98" y="6" width="8" height="5" rx="1" transform="rotate(15 102 8)"/></g>' +
                  spark(26, 100, .7) + spark(176, 96, .7))
# lūr no apakšas (galva + ķepiņas uz malas)
PEEK = ("M62,110 C60,98 62,86 68,78 C66,66 67,56 70,48 Q73,42 78,46 C83,50 88,53 92,55 C97,54 103,54 108,55 "
        "C112,53 117,50 122,46 Q127,42 130,48 C133,56 134,66 132,78 C138,86 140,98 138,110 Z")
P["peek"] = ("0 0 200 110", sil(PEEK) + face(100, 80) +
             '<ellipse cx="66" cy="106" rx="14" ry="7" fill="#111"/><ellipse cx="134" cy="106" rx="14" ry="7" fill="#111"/>'
             '<path d="M62,103 v5 M70,103 v5 M130,103 v5 M138,103 v5" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>')

D = {}
D["sun"] = ("0 0 60 60", f'<circle cx="30" cy="30" r="10" {L}/><path d="M30,6 v8 M30,46 v8 M6,30 h8 M46,30 h8 M13,13 l6,6 M41,41 l6,6 M47,13 l-6,6 M13,47 l6,-6" {L}/>')
D["cloud"] = ("0 0 90 50", f'<path d="M14,40 Q2,40 4,30 Q6,20 18,22 Q20,8 36,10 Q46,2 58,12 Q74,8 76,24 Q88,26 86,36 Q84,42 74,40 Z" {L}/>')
D["sparkle"] = ("0 0 40 40", f'<path d="M20,4 Q22,18 36,20 Q22,22 20,36 Q18,22 4,20 Q18,18 20,4 Z" {L}/>')
D["star"] = ("0 0 40 40", f'<path d="M20,4 L24,15 L36,16 L27,24 L30,36 L20,29 L10,36 L13,24 L4,16 L16,15 Z" {L}/>')
D["arrow"] = ("0 0 90 40", f'<path d="M4,30 C20,4 40,40 60,16 Q66,10 80,14 M70,6 L82,14 L72,22" {L}/>')
D["pencil"] = ("0 0 60 60", f'<path d="M10,50 L14,38 L42,10 L50,18 L22,46 Z M38,14 L46,22 M10,50 L22,46" {L}/>')
D["moon"] = ("0 0 50 50", f'<path d="M34,8 A18,18 0 1,0 42,36 A14,14 0 1,1 34,8 Z" {L}/>')
D["bulb"] = ("0 0 50 60", f'<circle cx="25" cy="22" r="13" {L}/><path d="M19,36 v8 h12 v-8 M21,50 h8" {L}/>')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob("*.svg"):
        f.unlink()
    for name, (vb, body) in {**P, **{"d-" + k: v for k, v in D.items()}}.items():
        (OUT / f"{name}.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Oskars">{body}</svg>\n')
    print("svg:", len(P) + len(D))


if __name__ == "__main__":
    main()
