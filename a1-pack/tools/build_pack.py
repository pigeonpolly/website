#!/usr/bin/env python3
"""A1 English Pack — viens saturs (topic.json + parts/*.json) → HTML + PDF + DOCX + PPTX.

  python3 a1-pack/tools/build_pack.py a1-pack/topics/<slug>            # viss
  python3 a1-pack/tools/build_pack.py a1-pack/topics/<slug> --only html  # tikai HTML (ātri)

Rezultāts: <topic>/out/  (HTML + assets/), <topic>/out/pdf/, <topic>/out/office/.
Shēma: a1-pack/SCHEMA.md.
"""
import html, json, re, shutil, subprocess, sys
from pathlib import Path

PACK = Path(__file__).resolve().parent.parent
DESIGN = PACK / "design"

MAT = {  # atslēga: (fails, LV nosaukums, apraksts)
    "slides":    ("prezentacija", "Prezentācija", "Slaidi nodarbībai, 16:9, ar skolotāja piezīmēm"),
    "homework":  ("majasdarbs", "Mājasdarbs", "Interaktīvs, ar saglabāšanu PDF"),
    "selfcheck": ("pasparbaude", "Pašpārbaude", "Testi, Kļūdu detektīvs, fakti, video"),
    "answers":   ("atbildes", "Atbildes", "Master-PDF skolotājam ar visām atbildēm"),
    "guide":     ("metodika", "Metodiskie norādījumi", "Nodarbības plāns minūtēs, mērķi, padomi"),
    "reserve":   ("rezerves", "Rezerves uzdevumi", "3–4 aktīvi papilduzdevumi"),
    "mistakes":  ("kludas", "Biežākās kļūdas", "Tipiskās kļūdas latviešu runātājiem"),
}
ORDER = ["slides", "homework", "selfcheck", "answers", "guide", "reserve", "mistakes"]


# ---------------------------------------------------------------- dati
def load(topic: Path) -> dict:
    d = json.loads((topic / "topic.json").read_text(encoding="utf-8"))
    parts = sorted((topic / "parts").glob("*.json")) if (topic / "parts").exists() else []
    for p in parts:
        part = json.loads(p.read_text(encoding="utf-8"))
        for k, v in part.items():
            if k == "slides":
                d.setdefault("slides", []).extend(v)
            elif isinstance(v, dict) and isinstance(d.get(k), dict):
                d[k].update(v)
            elif isinstance(v, list) and isinstance(d.get(k), list):
                d[k].extend(v)
            else:
                d[k] = v
    m = d["meta"]
    m.setdefault("course", "English A1")
    m.setdefault("level", "A1")
    m.setdefault("accent", "#FF5A36")
    m.setdefault("materials", ORDER)
    return d


def esc(s):
    return html.escape(str(s if s is not None else ""), quote=True)


def inl(s):
    """**treknais**, *slīpais*, ==izcelts==, ___ → atstarpe."""
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"==(.+?)==", r'<span class="mark">\1</span>', s)
    s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", s)
    return s


def paras(x):
    if not x:
        return ""
    if isinstance(x, str):
        x = [x]
    return "".join(f"<p>{inl(p)}</p>" for p in x)


def bullets(x, cls=""):
    if not x:
        return ""
    return f'<ul class="{cls}">' + "".join(f"<li><span>{inl(i)}</span></li>" for i in x) + "</ul>"


_SVG = {}


def oscar(pose, cls="oscar", style=""):
    if not pose:
        return ""
    if pose not in _SVG:
        f = DESIGN / "oscar" / f"{pose}.svg"
        _SVG[pose] = f.read_text() if f.exists() else ""
    st = f' style="{style}"' if style else ""
    return f'<div class="{cls}" aria-hidden="true"{st}>{_SVG[pose]}</div>'


def page(d, key, body, extra_head="", body_cls=""):
    m = d["meta"]
    title = f'{MAT[key][1] if key in MAT else "Pack"} · {m["title_en"]}'
    return f"""<!doctype html>
<html lang="lv" style="--accent:{esc(m['accent'])}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title><link rel="stylesheet" href="assets/pack.css">{extra_head}</head>
<body class="{body_cls}">{body}<script src="assets/pack.js"></script></body></html>
"""


def head(d, key):
    m = d["meta"]
    return (f'<header class="doc-head"><span class="kicker">{esc(m["course"])} · {esc(m["level"])}'
            f'{" · Nodarbība " + esc(m["lesson"]) if m.get("lesson") else ""}</span>'
            f'<span class="kicker">{esc(MAT[key][1])}</span></header>')


def title_block(d, key, pose="hello", sub=None):
    m = d["meta"]
    sub = sub or m.get("title_lv", "")
    return (f'<div class="title-block"><div><div class="badge-lvl"><span class="chip fill">{esc(m["level"])}</span>'
            f'<span class="chip">{esc(MAT[key][1])}</span></div><h1>{inl(m["title_en"])}</h1>'
            f'<p class="sub">{inl(sub)}</p></div>{oscar(pose)}</div>')


def foot(d):
    m = d["meta"]
    src = " · ".join(s["name"] for s in m.get("sources", [])[:3])
    return f'<footer class="foot"><span>{esc(m["course"])} · {esc(m["title_en"])}</span><span>{esc(src)}</span></footer>'


def student():
    return ('<div class="student"><div class="field"><label for="st-name">Vārds, uzvārds</label>'
            '<input type="text" id="st-name" data-save autocomplete="name"></div>'
            '<div class="field"><label for="st-date">Datums</label><input type="date" id="st-date" data-save></div></div>')


def sec(n, title, inner, lead="", acc=False):
    num = f'<span class="num{" acc" if acc else ""}">{esc(n)}</span>' if n else ""
    ld = f'<p class="lead">{inl(lead)}</p>' if lead else ""
    return f'<section class="section"><h2>{num}{inl(title)}</h2>{ld}{inner}</section>'


# ---------------------------------------------------------------- slaidi
def slide_html(d, s, i, total):
    m = d["meta"]
    t = s.get("type", "text")
    pose = s.get("pose")
    cls = f"slide s-{t}"
    x = ""
    if t == "cover":
        x = (f'<div class="in"><div><div class="kicker">{esc(m["course"])} · {esc(m["level"])}</div>'
             f'<h1>{inl(s.get("title", m["title_en"]))}</h1><p class="hand">{inl(s.get("subtitle", m.get("title_lv", "")))}</p>'
             f'<div class="meta">{"<b>" + esc(m.get("teacher")) + "</b>" if m.get("teacher") else ""}{inl(s.get("text", ""))}</div></div>'
             f'{oscar(pose or "hello", "oscar", "position:static;width:62%;margin:auto")}</div>'
             + oscar("d-sun", "oscar", "right:4cqw;top:3cqw;width:6cqw") + oscar("d-sparkle", "oscar", "left:46cqw;top:9cqw;width:3cqw"))
    elif t == "agenda":
        x = (f'<div class="in"><h2>{inl(s.get("title", "Šodien"))}</h2><ol class="agenda">'
             + "".join(f"<li><span>{inl(it)}</span></li>" for it in s.get("items", [])) + "</ol></div>"
             + oscar(pose or "teacher", "oscar", "right:6cqw;bottom:5cqw;width:12cqw"))
    elif t == "section":
        x = (f'<div class="in"><div class="n">{esc(s.get("num", ""))}</div><h2>{inl(s["title"])}</h2>'
             f'<p class="hand" style="margin-top:.6em">{inl(s.get("text", ""))}</p></div>'
             + oscar(pose or "peek", "oscar", "right:8cqw;bottom:0;width:15cqw"))
    elif t == "text":
        side = oscar(pose, "oscar", "position:static;width:58%;margin:auto") if pose else ""
        body = paras(s.get("body")) + bullets(s.get("bullets"))
        hand = f'<p class="hand">{inl(s["note"])}</p>' if s.get("note") else ""
        if side:
            x = f'<div class="in"><h2>{inl(s["title"])}</h2><div class="split wide"><div>{body}{hand}</div><div>{side}</div></div></div>'
        else:
            x = f'<div class="in"><h2>{inl(s["title"])}</h2>{body}{hand}</div>'
    elif t == "big":
        x = (f'<div class="in" style="display:flex;flex-direction:column;justify-content:center">'
             f'<div class="kicker">{inl(s.get("kicker", ""))}</div><p class="big">{inl(s["text"])}</p>'
             f'<p class="lv">{inl(s.get("lv", ""))}</p></div>' + (oscar(pose, "oscar", "right:7cqw;bottom:5cqw;width:13cqw") if pose else ""))
    elif t == "rule":
        hd = "".join(f"<th>{inl(h)}</th>" for h in s.get("head", []))
        rows = "".join("<tr>" + "".join(f'<td class="{"k" if j == 0 else ""}">{inl(c)}</td>' for j, c in enumerate(r)) + "</tr>"
                       for r in s.get("rows", []))
        note = f'<p class="hand" style="margin-top:.8em">{inl(s["note"])}</p>' if s.get("note") else ""
        side = oscar(pose, "oscar", "position:static;width:62%;margin:auto") if pose else ""
        tbl = f'<table class="tbl"><thead><tr>{hd}</tr></thead><tbody>{rows}</tbody></table>{note}'
        x = (f'<div class="in"><h2>{inl(s["title"])}</h2>'
             + (f'<div class="split wide"><div>{tbl}</div><div>{side}</div></div>' if side else tbl) + "</div>")
    elif t == "examples":
        x = (f'<div class="in"><h2>{inl(s["title"])}</h2><ul class="exl">'
             + "".join(f'<li><span class="en">{inl(e["en"])}</span><span class="lv">{inl(e.get("lv", ""))}</span></li>' for e in s.get("items", []))
             + "</ul></div>" + (oscar(pose, "oscar", "right:6cqw;top:3.5cqw;width:9cqw") if pose else ""))
    elif t == "vocab":
        items = s.get("items", [])
        cols = s.get("cols") or (3 if len(items) <= 6 else 4)
        x = (f'<div class="in"><h2>{inl(s["title"])}</h2><div class="vgrid" style="--cols:{cols}">'
             + "".join(f'<div class="vcard"><div><div class="w">{inl(v["en"])}</div><div class="ipa">{esc(v.get("ipa", ""))}</div></div>'
                       f'<div class="t">{inl(v.get("lv", ""))}</div></div>' for v in items) + "</div></div>")
    elif t == "quiz":
        ans = s.get("answer", 0)
        opts = "".join(f'<div class="{"ok" if j == ans else ""}"><b>{"ABCD"[j]}</b>{inl(o)}</div>' for j, o in enumerate(s.get("options", [])))
        x = (f'<div class="in"><div class="kicker">{inl(s.get("kicker", "Ātrais tests"))}</div><h2 style="margin-top:.3em">{inl(s["question"])}</h2>'
             f'<div class="qopts">{opts}</div><p class="lv" style="margin-top:1em">{inl(s.get("lv", ""))}</p></div>'
             + oscar(pose or "confused", "oscar", "right:6cqw;top:5cqw;width:9cqw"))
        cls += " quiz"
    elif t == "task":
        mins = f'<span class="timer">⏱ {esc(s["minutes"])} min</span>' if s.get("minutes") else ""
        mode = f'<span class="chip">{inl(s["mode"])}</span>' if s.get("mode") else ""
        x = (f'<div class="in"><div style="display:flex;gap:.8em;align-items:center;margin-bottom:.6em">{mins}{mode}</div>'
             f'<h2>{inl(s["title"])}</h2><div class="split wide"><div><ol class="steps">'
             + "".join(f"<li><span>{inl(st)}</span></li>" for st in s.get("steps", [])) + "</ol>"
             + (f'<div class="boxed" style="margin-top:.6em">{paras(s.get("box"))}</div>' if s.get("box") else "")
             + f'</div><div>{oscar(pose or "idea", "oscar", "position:static;width:52%;margin:auto")}</div></div></div>')
    elif t == "story":
        x = (f'<div class="in"><div class="story"><div>{oscar(pose or "oops", "oscar", "position:static;width:78%;margin:auto")}</div>'
             f'<div><div class="kicker">Oskara stāsts</div><h2 style="margin-top:.2em">{inl(s["title"])}</h2>'
             f'<div class="bubble">{paras(s.get("text"))}</div>'
             + (f'<p class="hand" style="margin-top:.8em">→ {inl(s["lesson"])}</p>' if s.get("lesson") else "") + "</div></div></div>")
    elif t == "compare":
        def col(c):
            return f'<div class="boxed"><h3>{inl(c.get("title", ""))}</h3>{bullets(c.get("items"))}</div>'
        x = (f'<div class="in"><h2>{inl(s["title"])}</h2><div class="split">{col(s.get("left", {}))}{col(s.get("right", {}))}</div>'
             + (f'<p class="hand" style="margin-top:.8em">{inl(s["note"])}</p>' if s.get("note") else "") + "</div>")
    elif t == "thanks":
        x = (f'<div class="in"><div><h1>{inl(s.get("title", "Thank you!"))}</h1><p class="hand">{inl(s.get("text", "Paldies!"))}</p></div>'
             f'{oscar(pose or "celebrate", "oscar", "position:static;width:58%;margin:auto")}</div>'
             + oscar("d-moon", "oscar", "right:4cqw;top:4cqw;width:5cqw") + oscar("d-cloud", "oscar", "left:40cqw;top:4cqw;width:9cqw"))
    else:
        raise SystemExit(f"Nezināms slaida tips: {t} (slaids {i})")
    shead = "" if t in ("cover", "thanks") else (
        f'<div class="sh"><span>{esc(m["course"])} · {esc(m["title_en"])}</span><span>{esc(s.get("tag", ""))}</span></div>')
    notes = f'<aside class="speaker">{inl(s.get("notes", ""))}</aside>' if s.get("notes") else ""
    return (f'<section class="{cls}" id="s{i}" data-n="{i}">{shead}{x}{notes}'
            f'<div class="pg">{i:02d} / {total:02d}</div><div class="bar-acc" style="width:{i / total * 100:.1f}%"></div></section>')


def render_slides(d):
    sl = d.get("slides", [])
    total = len(sl)
    body = ('<main class="deck">' + "".join(slide_html(d, s, i + 1, total) for i, s in enumerate(sl)) + "</main>"
            '<nav class="deck-ui no-print"><button data-act="prev" aria-label="Iepriekšējais">←</button>'
            '<button data-act="present">▶ Rādīt (F)</button><button data-act="reveal">Atbilde (A)</button>'
            '<button data-act="print">PDF</button><button data-act="next" aria-label="Nākamais">→</button></nav>')
    return page(d, "slides", body, body_cls="deck-body")


# ---------------------------------------------------------------- uzdevumi (mājasdarbs)
def ex_items(e, n, show=False):
    """show=True → atbilžu režīms (atbildes ierakstītas)."""
    t = e["type"]
    out = []
    a = lambda v: f' value="{esc(v)}"' if show else ""
    if t in ("gap", "transform", "order"):
        for j, it in enumerate(e["items"]):
            fid = f"e{n}-{j}"
            if t == "gap":
                txt = inl(it["text"])
                w = " w" if len(it.get("answer", "")) > 8 else ""
                inp = f'<input type="text" class="gap{w}" id="{fid}" data-save aria-label="atbilde"{a(it.get("answer"))}>'
                txt = txt.replace("___", inp, 1) if "___" in txt else txt + " " + inp
                hint = f' <span class="muted">({inl(it["hint"])})</span>' if it.get("hint") else ""
                out.append(f"<li><span>{txt}{hint}</span></li>")
            else:
                lead = f'<span class="words">{inl(it.get("words", ""))}</span>' if t == "order" else f"<span>{inl(it['text'])}</span>"
                out.append(f'<li><span>{lead}<br><input type="text" class="gap" style="width:100%;text-align:left" id="{fid}" data-save aria-label="atbilde"{a(it.get("answer"))}></span></li>')
        return '<ol class="items">' + "".join(out) + "</ol>"
    if t == "choice":
        for j, it in enumerate(e["items"]):
            ops = "".join(f'<option{" selected" if show and o == it["answer"] else ""}>{esc(o)}</option>' for o in it["options"])
            sel = f'<select id="e{n}-{j}" data-save aria-label="izvēle"><option value="">…</option>{ops}</select>'
            txt = inl(it["text"])
            txt = txt.replace("___", sel, 1) if "___" in txt else txt + " " + sel
            out.append(f"<li><span>{txt}</span></li>")
        return '<ol class="items">' + "".join(out) + "</ol>"
    if t == "truefalse":
        txt = f'<div class="card soft" style="margin-bottom:16px">{paras(e.get("text"))}</div>' if e.get("text") else ""
        for j, it in enumerate(e["items"]):
            ans = "True" if it["answer"] else "False"
            ops = "".join(f'<option{" selected" if show and o == ans else ""}>{o}</option>' for o in ("True", "False"))
            out.append(f'<li><span class="match"><span>{inl(it["text"])}</span><select id="e{n}-{j}" data-save aria-label="True vai False"><option value="">…</option>{ops}</select></span></li>')
        return txt + '<ol class="items">' + "".join(out) + "</ol>"
    if t == "match":
        opts = sorted({it["answer"] for it in e["items"]} | set(e.get("extra", [])), key=lambda s: s.lower())
        for j, it in enumerate(e["items"]):
            ops = "".join(f'<option{" selected" if show and o == it["answer"] else ""}>{esc(o)}</option>' for o in opts)
            out.append(f'<li><span class="match"><span class="en">{inl(it["left"])}</span><select id="e{n}-{j}" data-save aria-label="pāris"><option value="">…</option>{ops}</select></span></li>')
        return '<ol class="items">' + "".join(out) + "</ol>"
    if t == "write":
        chk = bullets(e.get("checklist")) if e.get("checklist") else ""
        model = f'<div class="card soft"><div class="kicker">Paraugs</div>{paras(e.get("model"))}</div>' if show and e.get("model") else ""
        return (f'<p>{inl(e.get("prompt", ""))}</p>{chk}<textarea id="e{n}-w" data-save rows="{e.get("lines", 6)}" aria-label="teksts"></textarea>'
                f'<div class="printval" data-for="e{n}-w"></div>{model}')
    raise SystemExit(f"Nezināms uzdevuma tips: {t}")


def answer_line(e):
    t = e["type"]
    if t == "write":
        return paras(e.get("model")) or "<p>Brīva atbilde.</p>"
    if t == "truefalse":
        return "<ol>" + "".join(f'<li>{"True" if it["answer"] else "False"}</li>' for it in e["items"]) + "</ol>"
    return "<ol>" + "".join(f'<li><span class="key">{inl(it.get("answer", ""))}</span></li>' for it in e["items"]) + "</ol>"


def exercise(e, n, show=False):
    pts = f'<span class="chip pts">{esc(e["points"])} p.</span>' if e.get("points") else ""
    ex = f'<p class="muted" style="font-size:14px">Piemērs: {inl(e["example"])}</p>' if e.get("example") else ""
    return (f'<div class="ex"><div class="ex-h"><span class="num">{n}</span><div><h3>{inl(e["title"])}</h3>'
            f'<div class="instr">{inl(e.get("instruction", ""))}</div></div>{pts}</div>{ex}{ex_items(e, n, show)}</div>')


def remind_block(d, items=None):
    items = items or d.get("homework", {}).get("reminder") or [f'{m["wrong"]} → **{m["right"]}**' for m in d.get("mistakes", [])[:3]]
    if not items:
        return ""
    return (f'<div class="remind">{oscar("spill")}<div><div class="kicker">Pirms sāc — Oskara padoms</div>'
            f'{bullets(items)}</div></div>')


def render_homework(d):
    h = d["homework"]
    exs = "".join(exercise(e, i + 1) for i, e in enumerate(h["exercises"]))
    body = (f'<main class="doc">{head(d, "homework")}{title_block(d, "homework", "tangled", h.get("intro"))}{student()}'
            f'{remind_block(d)}{exs}'
            '<div class="bar no-print"><button class="btn" data-act="print">⤓ Saglabāt PDF ar atbildēm</button>'
            '<button class="btn ghost" data-act="clear">Notīrīt</button></div>'
            '<p class="muted no-print" style="font-size:13px">PDF: drukas logā izvēlies «Saglabāt kā PDF». Ievadītais saglabājas šajā pārlūkā.</p>'
            f'{foot(d)}</main>')
    return page(d, "homework", body)


# ---------------------------------------------------------------- pašpārbaude
def yt(v):
    vid = v.get("youtube", "")
    if vid:
        fr = (f'<iframe src="https://www.youtube-nocookie.com/embed/{esc(vid)}" title="{esc(v["title"])}" loading="lazy" '
              'allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>')
    else:
        q = esc(v.get("search", v["title"]))
        fr = (f'<div class="ph"><div><div class="kicker">Video</div><p style="margin:.4em 0 0">'
              f'<a href="https://www.youtube.com/results?search_query={q}" target="_blank" rel="noopener">Meklēt YouTube: {q}</a></p></div></div>')
    link = f'<p style="margin-top:6px"><a href="{esc(v["url"])}" target="_blank" rel="noopener">{esc(v.get("source", "Avots"))}</a></p>' if v.get("url") else ""
    return (f'<div class="video"><div class="frame">{fr}</div><div class="cap"><h3>{inl(v["title"])}</h3>'
            f'<p>{inl(v.get("lv", ""))}</p>{link}</div></div>')


def render_selfcheck(d, show=False):
    c = d["selfcheck"]
    qs = ""
    for j, q in enumerate(c.get("quiz", [])):
        ops = "".join(f'<button type="button" data-ok="{1 if o == q["answer"] else 0}"{" class=ok" if show and o == q["answer"] else ""}>{inl(o)}</button>' for o in q["options"])
        qs += (f'<div class="q"><div class="qt">{j + 1}. {inl(q["q"])}</div><div class="opts">{ops}</div><div class="fb" aria-live="polite"></div>'
               f'<details class="ans"{" open" if show else ""}><summary>Parādīt atbildi un paskaidrojumu</summary><div class="body"><span class="key">{inl(q["answer"])}</span> — {inl(q.get("why", ""))}</div></details></div>')
    det = ""
    for j, x in enumerate(c.get("detective", [])):
        det += (f'<div class="row"><div><span class="wrong">{inl(x["wrong"])}</span></div><div>'
                f'<input type="text" class="gap" style="width:100%;text-align:left" data-save id="dt{j}" placeholder="Pareizi: …" aria-label="labojums">'
                f'<details class="ans"{" open" if show else ""}><summary>Pārbaudīt</summary><div class="body"><span class="right">{inl(x["right"])}</span><br>'
                f'<span class="muted">{inl(x.get("why", ""))}</span></div></details></div></div>')
    facts = "".join(f'<div class="fact">{oscar(f.get("pose", "idea"))}<div><h3>{inl(f["title"])}</h3><p>{inl(f["text"])}</p></div></div>'
                    for f in c.get("facts", []))
    vids = "".join(yt(v) for v in c.get("videos", []))
    n = 0

    def nx():
        nonlocal n
        n += 1
        return f"{n:02d}"
    secs = ((sec(nx(), "Tests", qs, "Noklikšķini uz atbildes, pēc tam atver paskaidrojumu.") if qs else "")
            + (sec(nx(), "Kļūdu detektīvs", f'<div class="detective">{det}</div>', "Katrā teikumā ir viena kļūda. Uzraksti pareizi un pārbaudi.", True) if det else "")
            + (sec(nx(), "Interesanti fakti", f'<div class="grid">{facts}</div>') if facts else "")
            + (sec(nx(), "Video", f'<div class="grid g2">{vids}</div>', "Īsi video A1 līmenim. Skaties ar subtitriem angļu valodā.") if vids and not show else "")
)
    if show:
        return secs
    return page(d, "selfcheck", f'<main class="doc">{head(d, "selfcheck")}{title_block(d, "selfcheck", "idea", c.get("intro"))}{student()}{secs}'
                '<div class="bar no-print"><button class="btn" data-act="print">⤓ Saglabāt PDF</button></div>' + f"{foot(d)}</main>")


# ---------------------------------------------------------------- rezerves, kļūdas, metodika
def reserve_task(t, i, show=False):
    kind = {"roleplay": "Lomu spēle", "letter": "Mini-vēstule", "errors": "Atrodi kļūdas", "game": "Spēle"}.get(t.get("kind"), t.get("kind", ""))
    meta = " · ".join(x for x in [kind, f'{t["minutes"]} min' if t.get("minutes") else "", t.get("mode", "")] if x)
    inner = paras(t.get("instruction"))
    if t.get("roles"):
        inner += '<div class="grid g2">' + "".join(f'<div class="card"><div class="kicker">{inl(r["role"])}</div>{paras(r["card"])}</div>' for r in t["roles"]) + "</div>"
    if t.get("items"):
        inner += '<ol class="items">' + "".join(f"<li><span>{inl(x)}</span></li>" for x in t["items"]) + "</ol>"
    if t.get("useful"):
        inner += f'<div class="card soft" style="margin-top:12px"><div class="kicker">Noderīgas frāzes</div>{bullets(t["useful"])}</div>'
    if t.get("kind") == "letter" and not show:
        inner += f'<textarea id="r{i}" data-save rows="6" aria-label="vēstule"></textarea><div class="printval" data-for="r{i}"></div>'
    if t.get("answers"):
        inner += (f'<details class="ans"{" open" if show else ""}><summary>Atbildes / paraugs</summary><div class="body">'
                  f'{paras(t["answers"]) if isinstance(t["answers"], (str, list)) else ""}</div></details>')
    return sec(f"{i:02d}", t["title"], f'<div class="kicker" style="margin-bottom:12px">{esc(meta)}</div>{inner}')


def render_reserve(d, show=False):
    body = "".join(reserve_task(t, i + 1, show) for i, t in enumerate(d["reserve"]))
    if show:
        return body
    return page(d, "reserve", f'<main class="doc">{head(d, "reserve")}{title_block(d, "reserve", "celebrate", "Kad laiks paliek pāri vai grupai vajag vairāk prakses.")}'
                f'{body}<div class="bar no-print"><button class="btn" data-act="print">⤓ PDF</button></div>{foot(d)}</main>')


def render_mistakes(d):
    rows = "".join(f'<div class="mist"><div><div class="lab">✗ Kļūda</div><span class="wrong">{inl(x["wrong"])}</span></div>'
                   f'<div><div class="lab">✓ Pareizi</div><span class="right">{inl(x["right"])}</span></div>'
                   f'<div class="why">{inl(x.get("why", ""))}{(" <span class=hand>" + inl(x["tip"]) + "</span>") if x.get("tip") else ""}</div></div>'
                   for x in d["mistakes"])
    return page(d, "mistakes", f'<main class="doc">{head(d, "mistakes")}{title_block(d, "mistakes", "oops", "Tipiskās kļūdas, ko latviešu runātāji pieļauj šajā tēmā — un kā tās atcerēties.")}'
                f'{rows}<div class="bar no-print"><button class="btn" data-act="print">⤓ PDF</button></div>{foot(d)}</main>')


def render_guide(d):
    g = d["guide"]
    m = d["meta"]
    tl = "".join(f'<tr><td>{esc(r["min"])}</td><td><b>{inl(r["stage"])}</b><br>{inl(r.get("what", ""))}</td><td>{esc(r.get("slides", ""))}</td></tr>'
                 for r in g.get("timeline", []))
    src = "".join(f'<li><a href="{esc(s["url"])}" target="_blank" rel="noopener">{esc(s["name"])}</a>{" — " + inl(s["note"]) if s.get("note") else ""}</li>'
                  for s in m.get("sources", []))
    diff = g.get("differentiation", {})
    body = (f'<main class="doc">{head(d, "guide")}{title_block(d, "guide", "teacher", f"Ilgums: {m.get("minutes", "?")} min · slaidi: {len(d.get("slides", []))}")}'
            + sec("01", "Mērķi un rezultāti", f'<div class="grid g2"><div class="card"><h3>Mērķi</h3>{bullets(g.get("aims"))}</div>'
                  f'<div class="card"><h3>Pēc nodarbības students var… (CEFR A1)</h3>{bullets(g.get("outcomes"))}</div></div>')
            + sec("02", "Nodarbības gaita", f'<div class="timeline"><table class="tbl"><thead><tr><th>Min</th><th>Posms</th><th>Slaidi</th></tr></thead><tbody>{tl}</tbody></table></div>')
            + (sec("03", "Valoda", f'<div class="grid g2"><div class="card"><h3>Gramatika</h3>{bullets(g.get("grammar"))}</div>'
                   f'<div class="card"><h3>Vārdu krājums</h3>{bullets(g.get("vocabulary"))}</div></div>') if g.get("grammar") or g.get("vocabulary") else "")
            + sec("04", "Padomi skolotājam", bullets(g.get("tips")) + (
                f'<div class="grid g2" style="margin-top:16px"><div class="card soft"><h3>Vājākiem</h3>{bullets(diff.get("weaker"))}</div>'
                f'<div class="card soft"><h3>Stiprākiem</h3>{bullets(diff.get("stronger"))}</div></div>' if diff else ""))
            + (sec("05", "Mājasdarbs un vērtēšana", paras(g.get("assessment"))) if g.get("assessment") else "")
            + sec("06", "Avoti", f"<ul>{src}</ul>")
            + f'<div class="bar no-print"><button class="btn" data-act="print">⤓ PDF</button></div>{foot(d)}</main>')
    return page(d, "guide", body)


def render_answers(d):
    parts = []
    mats = d["meta"]["materials"]
    if "slides" in mats:
        qs = [(i + 1, s) for i, s in enumerate(d.get("slides", [])) if s.get("type") == "quiz"]
        if qs:
            parts.append(sec("", "Prezentācija — testi", '<table class="tbl"><thead><tr><th>Slaids</th><th>Jautājums</th><th>Atbilde</th></tr></thead><tbody>'
                             + "".join(f'<tr><td>{i}</td><td>{inl(s["question"])}</td><td class="key">{inl(s["options"][s.get("answer", 0)])}</td></tr>' for i, s in qs)
                             + "</tbody></table>"))
    if "homework" in mats and d.get("homework"):
        parts.append(sec("", "Mājasdarbs", "".join(
            f'<div class="ex"><div class="ex-h"><span class="num">{i + 1}</span><div><h3>{inl(e["title"])}</h3></div>'
            f'{"<span class=" + chr(34) + "chip pts" + chr(34) + ">" + esc(e["points"]) + " p.</span>" if e.get("points") else ""}</div>{answer_line(e)}</div>'
            for i, e in enumerate(d["homework"]["exercises"]))))
    if "selfcheck" in mats and d.get("selfcheck"):
        parts.append('<div class="section"><h2>Pašpārbaude</h2></div>' + render_selfcheck(d, show=True))
    if "reserve" in mats and d.get("reserve"):
        parts.append('<div class="section"><h2>Rezerves uzdevumi</h2></div><div class="show-ans">' + render_reserve(d, show=True) + "</div>")
    body = (f'<main class="doc show-ans">{head(d, "answers")}{title_block(d, "answers", "teacher", "Visas atbildes vienuviet. Tikai skolotājam.")}'
            + "".join(parts) + f'<div class="bar no-print"><button class="btn" data-act="print">⤓ Master-PDF</button></div>{foot(d)}</main>')
    return page(d, "answers", body)


def render_index(d):
    m = d["meta"]
    cards = ""
    for k in ORDER:
        if k not in m["materials"]:
            continue
        f, name, desc = MAT[k]
        cards += (f'<a href="{f}.html"><span class="chip f">HTML · PDF · {"PPTX" if k == "slides" else "DOCX"}</span>'
                  f'<div class="kicker">{ORDER.index(k) + 1:02d}</div><div class="t">{esc(name)}</div><div class="d">{esc(desc)}</div></a>')
    body = (f'<main class="doc">{head(d, "slides").replace(MAT["slides"][1], "Materiālu pakete")}'
            f'{title_block(d, "slides", "hello").replace(MAT["slides"][1], "Pakete")}'
            f'<div class="packlist">{cards}</div>'
            f'<p class="muted" style="margin-top:32px;font-size:14px">Rediģējamās versijas: mapē <b>office/</b> (Word, PowerPoint). PDF: mapē <b>pdf/</b>. '
            f'Tēmas krāsa: <span class="chip" style="background:{esc(m["accent"])};color:#fff;border-color:{esc(m["accent"])}">{esc(m["accent"])}</span></p>{foot(d)}</main>')
    return page(d, "index", body).replace("<title>Pack ·", "<title>A1 ·")


# ---------------------------------------------------------------- būvēšana
def build_html(d, out: Path):
    assets = out / "assets"
    if assets.exists():
        shutil.rmtree(assets)
    assets.mkdir(parents=True)
    shutil.copy(DESIGN / "pack.css", assets)
    shutil.copy(DESIGN / "pack.js", assets)
    shutil.copytree(PACK / "fonts", assets / "fonts")
    R = {"slides": render_slides, "homework": render_homework, "selfcheck": render_selfcheck, "answers": render_answers,
         "guide": render_guide, "reserve": render_reserve, "mistakes": render_mistakes}
    files = []
    for k in d["meta"]["materials"]:
        f = out / f"{MAT[k][0]}.html"
        f.write_text(R[k](d), encoding="utf-8")
        files.append(f)
    (out / "index.html").write_text(render_index(d), encoding="utf-8")
    return files


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    topic = Path(sys.argv[1]).resolve()
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else "all"
    d = load(topic)
    out = topic / "out"
    out.mkdir(exist_ok=True)
    files = build_html(d, out)
    print("html:", len(files) + 1)
    if only in ("all", "office"):
        sys.path.insert(0, str(Path(__file__).parent))
        import make_office
        subprocess.run(["node", str(Path(__file__).parent / "render.js"), "png", str(out), d["meta"]["accent"]], check=True)
        print("office:", make_office.build(d, out))
    if only in ("all", "pdf"):
        subprocess.run(["node", str(Path(__file__).parent / "render.js"), "pdf", str(out)] + [str(f) for f in files], check=True)
    if only == "all":
        import zipfile
        z = topic / f"{d['meta']['slug']}-pack.zip"
        with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in sorted(out.rglob("*")):
                if f.is_file() and f != z and "/png/" not in str(f):
                    zf.write(f, f"{d['meta']['slug']}/{f.relative_to(out)}")
        print("zip:", z.name, f"{z.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
