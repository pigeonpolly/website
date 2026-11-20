"""A1 Pack → rediģējamas versijas: Word (.docx) visiem materiāliem, PowerPoint (.pptx) prezentācijai.
Tas pats saturs un dizains kā HTML: balts + melns + tēmas krāsa, 1px līnijas, Oskars (PNG).
Fonti: Nunito / Inter / Caveat — instalē no a1-pack/fonts/ (citādi Word aizstās ar līdzīgu)."""
import re
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor
from pptx import Presentation
from pptx.dml.color import RGBColor as PRGB
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt as PPt

from build_pack import MAT, ORDER

DISP, TEXT, HAND = "Nunito", "Inter", "Caveat"
INK = "111111"
RULE = "CFCFCF"  # tievas gaiši pelēkas līnijas
MUTED = "666666"


def hx(c):
    c = c.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def tint(c, k=0.12):
    r, g, b = hx(c)
    return "%02X%02X%02X" % tuple(round(v * k + 255 * (1 - k)) for v in (r, g, b))


def darker(c, k=0.7):
    return "%02X%02X%02X" % tuple(round(v * k) for v in hx(c))


TOK = re.compile(r"(\*\*.+?\*\*|==.+?==|(?<![\w*])\*(?!\s).+?(?<!\s)\*(?![\w*]))")


def parts(s):
    """'**b** ==m== *i*' → [(teksts, stils)]"""
    out = []
    for p in TOK.split(str(s or "")):
        if not p:
            continue
        if p.startswith("**"):
            out.append((p[2:-2], "b"))
        elif p.startswith("=="):
            out.append((p[2:-2], "m"))
        elif p.startswith("*") and p.endswith("*") and len(p) > 2:
            out.append((p[1:-1], "i"))
        else:
            out.append((p, ""))
    return out


# =================================================================== WORD
class W:
    def __init__(self, d, key):
        self.d, self.m, self.key = d, d["meta"], key
        self.acc = self.m["accent"].lstrip("#").upper()
        self.doc = Document()
        s = self.doc.sections[0]
        s.page_width, s.page_height = Mm(210), Mm(297)
        s.left_margin = s.right_margin = Mm(18)
        s.top_margin, s.bottom_margin = Mm(16), Mm(16)
        st = self.doc.styles["Normal"]
        st.font.name, st.font.size = TEXT, Pt(10.5)
        st.element.rPr.rFonts.set(qn("w:eastAsia"), TEXT)
        st.paragraph_format.space_after = Pt(4)
        st.paragraph_format.line_spacing = 1.25
        self.png = None

    # --- zemā līmeņa
    def run(self, p, text, bold=False, italic=False, size=None, color=None, font=None, mark=False):
        r = p.add_run(text)
        r.bold, r.italic = bold or None, italic or None
        if size:
            r.font.size = Pt(size)
        if color:
            r.font.color.rgb = RGBColor.from_string(color)
        if font:
            r.font.name = font
            r._element.rPr.rFonts.set(qn("w:eastAsia"), font)
        if mark:
            sh = OxmlElement("w:shd")
            sh.set(qn("w:val"), "clear"), sh.set(qn("w:fill"), tint(self.acc, .25))
            r._element.rPr.append(sh)
        return r

    def rich(self, p, s, size=None, color=None, bold=False):
        for t, k in parts(s):
            self.run(p, t, bold=bold or k == "b", italic=k == "i", size=size, color=color, mark=k == "m")
        return p

    def para(self, s="", size=None, color=None, bold=False, after=4, align=None):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_after = Pt(after)
        if align:
            p.alignment = align
        return self.rich(p, s, size, color, bold)

    def border(self, p, side="bottom", color=RULE, sz=4):
        pPr = p._p.get_or_add_pPr()
        bd = pPr.find(qn("w:pBdr"))
        if bd is None:
            bd = OxmlElement("w:pBdr")
            pPr.append(bd)
        e = OxmlElement(f"w:{side}")
        e.set(qn("w:val"), "single"), e.set(qn("w:sz"), str(sz)), e.set(qn("w:space"), "4"), e.set(qn("w:color"), color)
        bd.append(e)

    def cell_borders(self, cell, top=None, bottom=None, left=None, right=None):
        tcPr = cell._tc.get_or_add_tcPr()
        b = OxmlElement("w:tcBorders")
        for side, v in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
            e = OxmlElement(f"w:{side}")
            if v:
                e.set(qn("w:val"), "single"), e.set(qn("w:sz"), str(v[0])), e.set(qn("w:color"), v[1])
            else:
                e.set(qn("w:val"), "nil")
            b.append(e)
        tcPr.append(b)

    def shade(self, cell, fill):
        sh = OxmlElement("w:shd")
        sh.set(qn("w:val"), "clear"), sh.set(qn("w:fill"), fill)
        cell._tc.get_or_add_tcPr().append(sh)

    def table(self, rows, widths, line=True, head=None):
        t = self.doc.add_table(rows=0, cols=len(widths))
        t.alignment = WD_TABLE_ALIGNMENT.LEFT
        t.autofit = False
        allrows = ([head] if head else []) + rows
        for ri, r in enumerate(allrows):
            cells = t.add_row().cells
            for ci, v in enumerate(r):
                c = cells[ci]
                c.width = Mm(widths[ci])
                p = c.paragraphs[0]
                p.paragraph_format.space_after = Pt(2)
                if head and ri == 0:
                    self.run(p, str(v).upper(), bold=True, size=7.5, color=MUTED)
                elif isinstance(v, tuple):
                    self.rich(p, v[0], bold=v[1] == "b", color=self.acc_dark() if v[1] == "k" else None)
                else:
                    self.rich(p, v)
                if line:
                    last = ri == len(allrows) - 1
                    self.cell_borders(c, top=None if head and ri == 0 else (4, RULE), bottom=(4, RULE) if last else None)
                else:
                    self.cell_borders(c)
        self.grid(t, widths)
        self.para("", after=2)
        return t

    def grid(self, t, widths):
        """Kolonnu platumi, ko ievēro gan Word, gan LibreOffice."""
        tbl = t._tbl
        tblPr = tbl.tblPr
        lay = OxmlElement("w:tblLayout")
        lay.set(qn("w:type"), "fixed")
        tblPr.append(lay)
        g = tbl.tblGrid
        for gc, w in zip(g.findall(qn("w:gridCol")), widths):
            gc.set(qn("w:w"), str(int(w * 56.7)))
        for row in t.rows:
            for c, w in zip(row.cells, widths):
                c.width = Mm(w)

    def lines(self, n):
        t = self.doc.add_table(rows=n, cols=1)
        for r in t.rows:
            r.height = Mm(9)
            self.cell_borders(r.cells[0], bottom=(4, "BBBBBB"))
        self.grid(t, [174])
        self.para("", after=2)

    def acc_dark(self):
        return darker(self.acc)

    def oscar_png(self, pose):
        f = self.out / "assets" / "png" / f"{pose}.png"
        return f if f.exists() else None

    # --- bloki
    def header(self):
        p = self.doc.add_paragraph()
        p.paragraph_format.tab_stops.add_tab_stop(Mm(174), alignment=2)
        les = f" · Nodarbība {self.m['lesson']}" if self.m.get("lesson") else ""
        self.run(p, f"{self.m['course']} · {self.m['level']}{les}".upper(), bold=True, size=7.5, color=MUTED)
        self.run(p, "\t" + MAT[self.key][1].upper(), bold=True, size=7.5)
        self.border(p)
        p.paragraph_format.space_after = Pt(14)
        sec = self.doc.sections[0]
        fp = sec.footer.paragraphs[0]
        fp.paragraph_format.tab_stops.add_tab_stop(Mm(174), alignment=2)
        self.run(fp, f"{self.m['course']} · {re.sub(r'[*=]', '', self.m['title_en'])}", size=7.5, color=MUTED)

    def title(self, pose="hello", sub=None):
        t = self.doc.add_table(rows=1, cols=2)
        t.autofit = False
        a, b = t.rows[0].cells
        a.width, b.width = Mm(134), Mm(40)
        for c in (a, b):
            self.cell_borders(c)
        self.grid(t, [134, 40])
        p = a.paragraphs[0]
        r = self.run(p, f" {self.m['level']} ", bold=True, size=8, color="FFFFFF")
        sh = OxmlElement("w:shd")
        sh.set(qn("w:val"), "clear"), sh.set(qn("w:fill"), self.acc)
        r._element.rPr.append(sh)
        self.run(p, "   " + MAT[self.key][1].upper(), bold=True, size=8)
        p2 = a.add_paragraph()
        self.run(p2, re.sub(r"[*=]", "", self.m["title_en"]), bold=True, size=26, font=DISP)
        p2.paragraph_format.line_spacing = 0.95
        p3 = a.add_paragraph()
        self.rich(p3, sub if sub is not None else self.m.get("title_lv", ""), size=12, color=MUTED)
        png = self.oscar_png(pose)
        if png:
            bp = b.paragraphs[0]
            bp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            bp.add_run().add_picture(str(png), width=Mm(36))
        self.para("", after=8)

    def h2(self, num, title, lead=None, acc=False):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        if num:
            self.run(p, f"{num}  ", bold=True, size=13, color=darker(self.acc) if acc else self.acc, font=DISP)
        for t, k in parts(title):
            self.run(p, t, bold=True, size=15, font=DISP)
        if lead:
            self.para(lead, size=9.5, color=MUTED, after=8)

    def bullets(self, items):
        for it in items or []:
            p = self.doc.add_paragraph(style="List Bullet")
            p.paragraph_format.space_after = Pt(2)
            self.rich(p, it)

    def student(self):
        self.table([["Vārds, uzvārds: ________________________________", "Datums: ______________"]], [120, 54], line=False)

    def save(self, out):
        f = out / "office" / f"{MAT[self.key][0]}.docx"
        self.doc.save(f)
        return f


def blank(n=10):
    return "_" * n


def ex_word(w, e, n, show=False):
    w.h2(str(n), e["title"], e.get("instruction"))
    if e.get("points"):
        w.para(f"{e['points']} p.", size=8, color=MUTED)
    if e.get("example"):
        w.para("Piemērs: " + e["example"], size=9.5, color=MUTED)
    t = e["type"]
    if t == "truefalse" and e.get("text"):
        tb = w.table([[e["text"] if isinstance(e["text"], str) else " ".join(e["text"])]], [174], line=False)
        w.shade(tb.rows[0].cells[0], tint(w.acc))
    if t == "match":
        opts = sorted({it["answer"] for it in e["items"]} | set(e.get("extra", [])), key=str.lower)
        w.para("Varianti: " + "  ·  ".join(opts), size=9.5, color=MUTED)
    if t == "write":
        w.para(e.get("prompt", ""))
        w.bullets(e.get("checklist"))
        if show:
            w.para("**Paraugs:** " + " ".join(e["model"]) if isinstance(e.get("model"), list) else "**Paraugs:** " + str(e.get("model", "")))
        else:
            w.lines(e.get("lines", 6))
        return
    rows = []
    for j, it in enumerate(e["items"]):
        ans = it.get("answer")
        if t == "truefalse":
            ans = "True" if ans else "False"
        a = f"**{ans}**" if show else None
        if t == "gap":
            txt = it["text"].replace("___", f"=={ans}==" if show else blank(10)) + (f"  ({it['hint']})" if it.get("hint") else "")
        elif t == "choice":
            txt = it["text"].replace("___", f"=={ans}==" if show else "___ (" + " / ".join(it["options"]) + ")")
        elif t == "match":
            txt = f"**{it['left']}**  →  " + (f"=={ans}==" if show else blank(14))
        elif t == "truefalse":
            txt = it["text"] + ("  →  " + a if show else "   True / False")
        elif t == "order":
            txt = f"*{it['words']}*\n" + (a if show else blank(44))
        else:  # transform
            txt = it["text"] + "\n" + (a if show else blank(44))
        rows.append([f"{j + 1}.", txt])
    w.table(rows, [9, 165])


def word_all(d, out):
    files = []
    m = d["meta"]
    mats = m["materials"]

    def W_(key):
        w = W(d, key)
        w.out = out
        w.header()
        return w

    if "homework" in mats:
        h = d["homework"]
        w = W_("homework")
        w.title("tangled", h.get("intro"))
        w.student()
        rem = h.get("reminder") or [f'{x["wrong"]} → **{x["right"]}**' for x in d.get("mistakes", [])[:3]]
        if rem:
            w.h2("!", "Pirms sāc — Oskara padoms", acc=True)
            w.bullets(rem)
        for i, e in enumerate(h["exercises"]):
            ex_word(w, e, i + 1)
        files.append(w.save(out))
    if "selfcheck" in mats:
        files.append(selfcheck_word(d, out, W_("selfcheck")))
    if "answers" in mats:
        w = W_("answers")
        w.title("teacher", "Visas atbildes vienuviet. Tikai skolotājam.")
        qs = [(i + 1, s) for i, s in enumerate(d.get("slides", [])) if s.get("type") == "quiz"]
        if qs and "slides" in mats:
            w.h2("", "Prezentācija — testi")
            w.table([[str(i), s["question"], (f"**{s['options'][s.get('answer', 0)]}**")] for i, s in qs], [16, 110, 48], head=["Slaids", "Jautājums", "Atbilde"])
        if d.get("homework") and "homework" in mats:
            w.h2("", "Mājasdarbs")
            for i, e in enumerate(d["homework"]["exercises"]):
                ex_word(w, e, i + 1, show=True)
        if d.get("selfcheck") and "selfcheck" in mats:
            selfcheck_word(d, out, w, show=True)
        if d.get("reserve") and "reserve" in mats:
            w.h2("", "Rezerves uzdevumi")
            for i, t in enumerate(d["reserve"]):
                if t.get("answers"):
                    w.para(f"**{i + 1:02d}. {t['title']}**")
                    for a in ([t["answers"]] if isinstance(t["answers"], str) else t["answers"]):
                        w.para(a)
        files.append(w.save(out))
    if "guide" in mats:
        g = d["guide"]
        w = W_("guide")
        w.title("teacher", f"Ilgums: {m.get('minutes', '?')} min · slaidi: {len(d.get('slides', []))}")
        w.h2("01", "Mērķi")
        w.bullets(g.get("aims"))
        w.h2("", "Pēc nodarbības students var… (CEFR A1)")
        w.bullets(g.get("outcomes"))
        w.h2("02", "Nodarbības gaita")
        w.table([[r["min"], f"**{r['stage']}**\n{r.get('what', '')}", r.get("slides", "")] for r in g.get("timeline", [])], [22, 128, 24], head=["Min", "Posms", "Slaidi"])
        if g.get("grammar") or g.get("vocabulary"):
            w.h2("03", "Valoda")
            w.para("**Gramatika**")
            w.bullets(g.get("grammar"))
            w.para("**Vārdu krājums**")
            w.bullets(g.get("vocabulary"))
        w.h2("04", "Padomi skolotājam")
        w.bullets(g.get("tips"))
        diff = g.get("differentiation") or {}
        if diff:
            w.para("**Vājākiem**")
            w.bullets(diff.get("weaker"))
            w.para("**Stiprākiem**")
            w.bullets(diff.get("stronger"))
        if g.get("assessment"):
            w.h2("05", "Mājasdarbs un vērtēšana")
            for p in ([g["assessment"]] if isinstance(g["assessment"], str) else g["assessment"]):
                w.para(p)
        w.h2("06", "Avoti")
        w.bullets([f"{s['name']} — {s['url']}" for s in m.get("sources", [])])
        files.append(w.save(out))
    if "reserve" in mats:
        w = W_("reserve")
        w.title("celebrate", "Kad laiks paliek pāri vai grupai vajag vairāk prakses.")
        kinds = {"roleplay": "Lomu spēle", "letter": "Mini-vēstule", "errors": "Atrodi kļūdas", "game": "Spēle"}
        for i, t in enumerate(d["reserve"]):
            w.h2(f"{i + 1:02d}", t["title"])
            w.para(" · ".join(x for x in [kinds.get(t.get("kind"), t.get("kind", "")), f"{t['minutes']} min" if t.get("minutes") else "", t.get("mode", "")] if x).upper(), size=7.5, color=MUTED)
            for p in ([t["instruction"]] if isinstance(t.get("instruction"), str) else t.get("instruction") or []):
                w.para(p)
            if t.get("roles"):
                w.table([[f"**{r['role']}**", r["card"] if isinstance(r["card"], str) else " ".join(r["card"])] for r in t["roles"]], [40, 134])
            if t.get("items"):
                w.table([[f"{j + 1}.", x] for j, x in enumerate(t["items"])], [9, 165])
            if t.get("useful"):
                w.para("**Noderīgas frāzes**")
                w.bullets(t["useful"])
            if t.get("kind") == "letter":
                w.lines(6)
        files.append(w.save(out))
    if "mistakes" in mats:
        w = W_("mistakes")
        w.title("oops", "Tipiskās kļūdas, ko latviešu runātāji pieļauj šajā tēmā — un kā tās atcerēties.")
        for x in d["mistakes"]:
            t = w.table([[f"✗  ~{x['wrong']}~", f"✓  **{x['right']}**"], [x.get("why", "") + (f"  — {x['tip']}" if x.get("tip") else ""), ""]], [87, 87])
            row = t.rows[1].cells
            row[0].merge(row[1])
            w.shade(t.rows[1].cells[0], tint(w.acc))
            # nosvītrojums kļūdai
            for r in t.rows[0].cells[0].paragraphs[0].runs:
                if r.text.startswith("~") or "~" in r.text:
                    r.text = r.text.replace("~", "")
                    r.font.strike = True
                    r.font.color.rgb = RGBColor.from_string(darker(w.acc))
        files.append(w.save(out))
    return files


def selfcheck_word(d, out, w, show=False):
    c = d["selfcheck"]
    if not show:
        w.title("idea", c.get("intro"))
        w.student()
    else:
        w.h2("", "Pašpārbaude")
    n = 0
    if c.get("quiz"):
        n += 1
        w.h2(f"{n:02d}", "Tests", None if show else "Apvelc pareizo atbildi.")
        rows = []
        for j, q in enumerate(c["quiz"]):
            opts = "   ".join(("**" + o + "**") if show and o == q["answer"] else o for o in q["options"])
            rows.append([f"{j + 1}.", f"{q['q']}\n{opts}" + (f"\n*{q.get('why', '')}*" if show else "")])
        w.table(rows, [9, 165])
    if c.get("detective"):
        n += 1
        w.h2(f"{n:02d}", "Kļūdu detektīvs", None if show else "Katrā teikumā ir viena kļūda. Uzraksti pareizi.", acc=True)
        w.table([[x["wrong"], (f"**{x['right']}**\n*{x.get('why', '')}*" if show else blank(30))] for x in c["detective"]], [87, 87], head=["Ar kļūdu", "Pareizi"])
    if c.get("facts") and not show:
        n += 1
        w.h2(f"{n:02d}", "Interesanti fakti")
        for f in c["facts"]:
            t = w.doc.add_table(rows=1, cols=2)
            a, b = t.rows[0].cells
            a.width, b.width = Mm(28), Mm(146)
            png = w.oscar_png(f.get("pose", "idea"))
            if png:
                a.paragraphs[0].add_run().add_picture(str(png), width=Mm(24))
            w.rich(b.paragraphs[0], f"**{f['title']}**")
            w.rich(b.add_paragraph(), f["text"])
            for cc in (a, b):
                w.cell_borders(cc, top=(4, RULE), bottom=(4, RULE))
            w.grid(t, [28, 146])
            w.para("", after=4)
    if c.get("videos") and not show:
        n += 1
        w.h2(f"{n:02d}", "Video")
        for v in c["videos"]:
            link = f"https://www.youtube.com/watch?v={v['youtube']}" if v.get("youtube") else (v.get("url") or "YouTube: " + v.get("search", v["title"]))
            w.para(f"**{v['title']}** — {v.get('lv', '')}")
            w.para(link, size=9, color=MUTED)
    if not show:
        return w.save(out)


# =================================================================== POWERPOINT
SW, SH = Inches(13.333), Inches(7.5)


def cqw(x):  # HTML cqw → EMU
    return Emu(int(SW * x / 100))


class P:
    def __init__(self, d, out):
        self.d, self.m, self.out = d, d["meta"], out
        self.acc = self.m["accent"].lstrip("#").upper()
        self.prs = Presentation()
        self.prs.slide_width, self.prs.slide_height = SW, SH
        self.blank = self.prs.slide_layouts[6]
        self.total = len(d.get("slides", []))

    def box(self, s, x, y, w, h, line=None, fill=None, shape=MSO_SHAPE.RECTANGLE):
        b = s.shapes.add_shape(shape, x, y, w, h)
        if fill:
            b.fill.solid(), setattr(b.fill.fore_color, "rgb", PRGB.from_string(fill))
        else:
            b.fill.background()
        if line:
            b.line.color.rgb = PRGB.from_string(line)
            b.line.width = PPt(.5)
        else:
            b.line.fill.background()
        b.shadow.inherit = False
        return b

    def text(self, s, x, y, w, h, txt, size=18, font=TEXT, bold=False, color=INK, align=None, anchor=MSO_ANCHOR.TOP, spacing=1.1):
        tb = s.shapes.add_textbox(x, y, w, h)
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        tf.vertical_anchor = anchor
        lines = txt if isinstance(txt, list) else [txt]
        for i, ln in enumerate(lines):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.line_spacing = spacing
            if align:
                p.alignment = align
            for t, k in parts(ln):
                r = p.add_run()
                r.text = t
                r.font.size, r.font.name = PPt(size), font
                r.font.bold = bold or k == "b"
                r.font.italic = k == "i"
                r.font.color.rgb = PRGB.from_string(darker(self.acc) if k == "m" else color)
        return tb

    def pic(self, s, pose, x, y, w=None, h=None):
        f = self.out / "assets" / "png" / f"{pose}.png"
        if f.exists():
            s.shapes.add_picture(str(f), x, y, w, h)

    def chrome(self, s, i, t, dark=False):
        mut = "BBBBBB" if dark else MUTED
        if t not in ("cover", "thanks"):
            self.text(s, cqw(7), cqw(2.4), cqw(60), cqw(2), f"{self.m['course']} · {self.m['title_en']}".upper(), 9, bold=True, color=mut)
        self.text(s, cqw(80), SH - cqw(3.6), cqw(17), cqw(2), f"{i:02d} / {self.total:02d}", 9, bold=True, color=mut, align=PP_ALIGN.RIGHT)
        self.box(s, 0, SH - cqw(.25), int(SW * i / self.total), cqw(.25), fill=self.acc)

    def h2(self, s, txt, y=6, w=86, size=32):
        self.text(s, cqw(7), cqw(y), cqw(w), cqw(6), txt, size, DISP, True)

    def bullets(self, s, items, x, y, w, h, size=18):
        self.text(s, x, y, w, h, ["•  " + i for i in items], size, spacing=1.35)

    def build(self):
        for i, sd in enumerate(self.d.get("slides", []), 1):
            s = self.prs.slides.add_slide(self.blank)
            t = sd.get("type", "text")
            getattr(self, "s_" + t)(s, sd)
            self.chrome(s, i, t)
            if sd.get("notes"):
                s.notes_slide.notes_text_frame.text = re.sub(r"[*=]{1,2}", "", sd["notes"])
        f = self.out / "office" / f"{MAT['slides'][0]}.pptx"
        self.prs.save(f)
        return f

    # --- tipi
    def s_cover(self, s, sd):
        self.text(s, cqw(7), cqw(8), cqw(50), cqw(2), f"{self.m['course']} · {self.m['level']}".upper(), 10, bold=True, color=MUTED)
        self.text(s, cqw(7), cqw(14), cqw(52), cqw(16), sd.get("title", self.m["title_en"]), 54, DISP, True, spacing=.95)
        self.text(s, cqw(7), cqw(33), cqw(50), cqw(5), sd.get("subtitle", self.m.get("title_lv", "")), 30, HAND, True, darker(self.acc))
        meta = ([f"**{self.m['teacher']}**"] if self.m.get("teacher") else []) + ([sd["text"]] if sd.get("text") else [])
        if meta:
            self.text(s, cqw(7), cqw(43), cqw(45), cqw(6), meta, 14)
        self.pic(s, sd.get("pose") or "hello", cqw(64), cqw(14), h=cqw(28))
        self.pic(s, "d-sun", cqw(90), cqw(3), w=cqw(6))
        self.pic(s, "d-sparkle", cqw(52), cqw(9), w=cqw(3))

    def s_agenda(self, s, sd):
        self.h2(s, sd.get("title", "Šodien"))
        items = sd.get("items", [])
        for j, it in enumerate(items):
            col, row = j % 2, j // 2
            x, y = cqw(7 + col * 34), cqw(17 + row * 6.2)
            self.box(s, x, y, cqw(31), Emu(9525), fill=RULE)
            self.text(s, x, y + cqw(1), cqw(3), cqw(3), f"{j + 1:02d}", 10, color=darker(self.acc), anchor=MSO_ANCHOR.MIDDLE)
            self.text(s, x + cqw(3.4), y + cqw(1), cqw(28), cqw(3), it, 20, anchor=MSO_ANCHOR.MIDDLE)
        self.pic(s, sd.get("pose") or "teacher", cqw(80), cqw(36), w=cqw(12))

    def s_section(self, s, sd):
        self.text(s, cqw(7), cqw(20), cqw(40), cqw(3), sd.get("num", ""), 12, color=darker(self.acc))
        self.text(s, cqw(7), cqw(25), cqw(60), cqw(10), sd["title"], 48, DISP, True)
        if sd.get("text"):
            self.text(s, cqw(7), cqw(41), cqw(60), cqw(5), sd["text"], 28, HAND, True, darker(self.acc))
        self.pic(s, sd.get("pose") or "peek", cqw(77), cqw(47.8), w=cqw(15))

    def side(self, s, sd, w=86):
        if sd.get("pose"):
            self.pic(s, sd["pose"], cqw(70), cqw(18), w=cqw(18))
            return 56
        return w

    def s_text(self, s, sd):
        self.h2(s, sd["title"])
        w = self.side(s, sd)
        y = 16
        body = sd.get("body")
        if body:
            body = [body] if isinstance(body, str) else body
            self.text(s, cqw(7), cqw(y), cqw(w), cqw(14), body, 18, spacing=1.3)
            y += 4 + 3.2 * len(body)
        if sd.get("bullets"):
            self.bullets(s, sd["bullets"], cqw(7), cqw(y), cqw(w), cqw(20))
            y += 3.4 * len(sd["bullets"]) + 2
        if sd.get("note"):
            self.text(s, cqw(7), cqw(min(y, 46)), cqw(w), cqw(4), sd["note"], 26, HAND, True, darker(self.acc))

    def s_big(self, s, sd):
        if sd.get("kicker"):
            self.text(s, cqw(7), cqw(18), cqw(70), cqw(2), sd["kicker"].upper(), 10, bold=True, color=MUTED)
        self.text(s, cqw(7), cqw(21), cqw(66), cqw(16), sd["text"], 32, DISP, spacing=1.2)
        if sd.get("lv"):
            self.text(s, cqw(7), cqw(40), cqw(66), cqw(4), sd["lv"], 16, color=MUTED)
        if sd.get("pose"):
            self.pic(s, sd["pose"], cqw(77), cqw(30), w=cqw(18))

    def s_rule(self, s, sd):
        self.h2(s, sd["title"])
        w = self.side(s, sd)
        rows = [sd.get("head", [])] + sd.get("rows", [])
        n = len(rows[0]) if rows[0] else len(rows[1])
        tbl = s.shapes.add_table(len(rows), n, cqw(7), cqw(16), cqw(w), cqw(4) * len(rows)).table
        for ri, r in enumerate(rows):
            for ci in range(n):
                c = tbl.cell(ri, ci)
                c.fill.background()
                c.margin_left = 0
                tf = c.text_frame
                tf.text = ""
                p = tf.paragraphs[0]
                v = r[ci] if ci < len(r) else ""
                for t, k in parts(v.upper() if ri == 0 else v):
                    rr = p.add_run()
                    rr.text = t
                    rr.font.name, rr.font.size = TEXT, PPt(10 if ri == 0 else 20)
                    rr.font.bold = ri == 0 or ci == 0 or k == "b"
                    rr.font.color.rgb = PRGB.from_string(MUTED if ri == 0 else (darker(self.acc) if k == "m" else INK))
                self._cell_lines(c, top=ri > 0, bottom=ri == len(rows) - 1)
        tbl.first_row = False
        tbl.horz_banding = False
        if sd.get("note"):
            self.text(s, cqw(7), cqw(18 + 4 * len(rows)), cqw(w), cqw(4), sd["note"], 24, HAND, True, darker(self.acc))

    def _cell_lines(self, c, top, bottom):
        tcPr = c._tc.get_or_add_tcPr()
        for tag, on in (("a:lnL", False), ("a:lnR", False), ("a:lnT", top), ("a:lnB", bottom)):
            ln = OxmlElement(tag)
            if on:
                ln.set("w", "9525")
                sf = OxmlElement("a:solidFill")
                clr = OxmlElement("a:srgbClr")
                clr.set("val", RULE)
                sf.append(clr)
                ln.append(sf)
            else:
                ln.set("w", "0")
                ln.append(OxmlElement("a:noFill"))
            tcPr.append(ln)

    def s_examples(self, s, sd):
        self.h2(s, sd["title"])
        items = sd.get("items", [])
        for j, e in enumerate(items):
            y = cqw(16 + j * 5)
            self.box(s, cqw(7), y, cqw(78), Emu(9525), fill=RULE)
            self.text(s, cqw(7), y + cqw(1), cqw(38), cqw(4), e["en"], 20, bold=True)
            self.text(s, cqw(47), y + cqw(1), cqw(38), cqw(4), e.get("lv", ""), 18, color=MUTED)
        self.box(s, cqw(7), cqw(16 + len(items) * 5), cqw(78), Emu(9525), fill=RULE)
        if sd.get("pose"):
            self.pic(s, sd["pose"], cqw(86), cqw(40), w=cqw(11))

    def s_vocab(self, s, sd):
        self.h2(s, sd["title"])
        items = sd.get("items", [])
        cols = sd.get("cols") or (3 if len(items) <= 6 else 4)
        gw = (86 - (cols - 1) * 1.6) / cols
        for j, v in enumerate(items):
            x, y = cqw(7 + (j % cols) * (gw + 1.6)), cqw(16 + (j // cols) * 13)
            self.box(s, x, y, cqw(gw), Emu(9525), fill=RULE)
            self.text(s, x + cqw(1.4), y + cqw(1.2), cqw(gw - 2.8), cqw(4), v["en"], 26, DISP, True)
            if v.get("ipa"):
                self.text(s, x + cqw(1.4), y + cqw(5), cqw(gw - 2.8), cqw(2), v["ipa"], 11, color=MUTED)
            self.text(s, x + cqw(1.4), y + cqw(8), cqw(gw - 2.8), cqw(3), v.get("lv", ""), 14)

    def s_quiz(self, s, sd):
        self.text(s, cqw(7), cqw(6), cqw(60), cqw(2), sd.get("kicker", "Ātrais tests").upper(), 10, bold=True, color=MUTED)
        self.text(s, cqw(7), cqw(9), cqw(72), cqw(10), sd["question"], 32, DISP, True)
        for j, o in enumerate(sd.get("options", [])):
            x, y = cqw(7 + (j % 2) * 43), cqw(24 + (j // 2) * 7)
            ok = j == sd.get("answer", 0)
            self.box(s, x, y, cqw(41), Emu(9525), fill=RULE)
            self.text(s, x, y, cqw(3), cqw(5.6), "ABCD"[j], 11, color=darker(self.acc), anchor=MSO_ANCHOR.MIDDLE)
            self.text(s, x + cqw(3), y, cqw(38), cqw(5.6), o, 22, anchor=MSO_ANCHOR.MIDDLE)
        if sd.get("lv"):
            self.text(s, cqw(7), cqw(40), cqw(80), cqw(3), sd["lv"], 15, color=MUTED)
        self.pic(s, sd.get("pose") or "confused", cqw(84), cqw(4), w=cqw(11))

    def s_task(self, s, sd):
        top = []
        if sd.get("minutes"):
            top.append(f"⏱ {sd['minutes']} min")
        if sd.get("mode"):
            top.append(sd["mode"])
        if top:
            self.text(s, cqw(7), cqw(6), cqw(60), cqw(2.5), "   ·   ".join(top).upper(), 11, bold=True)
        self.h2(s, sd["title"], y=10)
        for j, st in enumerate(sd.get("steps", [])):
            y = cqw(20 + j * 5)
            self.text(s, cqw(7), y, cqw(3), cqw(4.6), f"{j + 1:02d}", 10, color=darker(self.acc), anchor=MSO_ANCHOR.MIDDLE)
            self.text(s, cqw(11.5), y, cqw(46), cqw(4.6), st, 18, anchor=MSO_ANCHOR.MIDDLE)
        if sd.get("box"):
            y = cqw(21 + len(sd.get("steps", [])) * 5)
            self.box(s, cqw(7), y, cqw(50), Emu(9525), fill=RULE)
            self.text(s, cqw(7), y + cqw(1), cqw(50), cqw(6), sd["box"], 16)
        self.pic(s, sd.get("pose") or "idea", cqw(68), cqw(16), w=cqw(17))

    def s_story(self, s, sd):
        self.pic(s, sd.get("pose") or "oops", cqw(8), cqw(14), w=cqw(28))
        self.text(s, cqw(44), cqw(7), cqw(40), cqw(2), "OSKARA STĀSTS", 10, bold=True, color=MUTED)
        self.text(s, cqw(44), cqw(10), cqw(48), cqw(8), sd["title"], 30, DISP, True)
        txt = sd.get("text")
        txt = [txt] if isinstance(txt, str) else (txt or [])
        b = self.box(s, cqw(44), cqw(21), cqw(48), cqw(16), fill=tint(self.acc, .12), shape=MSO_SHAPE.ROUNDED_RECTANGLE)
        b.adjustments[0] = .12
        self.text(s, cqw(46), cqw(23), cqw(44), cqw(13), txt, 18, spacing=1.3)
        if sd.get("lesson"):
            self.text(s, cqw(44), cqw(40), cqw(48), cqw(4), "→ " + sd["lesson"], 26, HAND, True, darker(self.acc))

    def s_compare(self, s, sd):
        self.h2(s, sd["title"])
        for j, side in enumerate((sd.get("left", {}), sd.get("right", {}))):
            x = cqw(7 + j * 44)
            self.box(s, x, cqw(16), cqw(42), Emu(9525), fill=RULE)
            self.text(s, x, cqw(17.5), cqw(40), cqw(3), side.get("title", ""), 22, bold=True)
            self.bullets(s, side.get("items", []), x, cqw(22), cqw(40), cqw(16))
        if sd.get("note"):
            self.text(s, cqw(7), cqw(42), cqw(86), cqw(4), sd["note"], 24, HAND, True, darker(self.acc))

    def s_thanks(self, s, sd):
        self.text(s, cqw(7), cqw(18), cqw(55), cqw(14), sd.get("title", "Thank you!"), 64, DISP, True, spacing=.95)
        self.text(s, cqw(7), cqw(34), cqw(55), cqw(6), sd.get("text", "Paldies!"), 30, HAND, True, darker(self.acc))
        self.pic(s, sd.get("pose") or "celebrate", cqw(66), cqw(14), h=cqw(28))
        self.pic(s, "d-moon", cqw(90), cqw(4), w=cqw(5))
        self.pic(s, "d-cloud", cqw(40), cqw(4), w=cqw(9))


def build(d, out: Path):
    (out / "office").mkdir(exist_ok=True)
    files = []
    if "slides" in d["meta"]["materials"] and d.get("slides"):
        files.append(P(d, out).build())
    files += word_all(d, out)
    return len(files)
