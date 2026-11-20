#!/usr/bin/env python3
"""A1 English Lab: topic.json (+ parts/*.json) → 2 pašpietiekami HTML faili.
  python3 a1-pack/tools/build_lab.py a1-pack/topics/<slug>
Rezultāts blakus topic.json:  <slug>-prezentacija.html  un  <slug>-tema.html
Viss iekšā (CSS, JS, fonti, Oskars) — strādā bez interneta (izņemot video un PDF bibliotēku)."""
import base64, json, re, sys
from pathlib import Path

PACK = Path(__file__).resolve().parent.parent
LAB = PACK / "lab"


def load(topic: Path) -> dict:
    d = json.loads((topic / "topic.json").read_text(encoding="utf-8"))
    for p in sorted((topic / "parts").glob("*.json")) if (topic / "parts").exists() else []:
        part = json.loads(p.read_text(encoding="utf-8"))
        for k, v in part.items():
            if k == "deck":
                d.setdefault("deck", []).extend(v)
            elif k == "workbook" and "sections" in v:
                wb = d.setdefault("workbook", {})
                wb.setdefault("sections", []).extend(v.pop("sections"))
                wb.update(v)
            else:
                d[k] = v
    d["meta"].setdefault("course", "English A1")
    d["meta"].setdefault("level", "A1")
    return d


def fonts():
    css = []
    for fam, f, style, rng in [
        ("Inter", "Inter-normal-latin", "normal", "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"),
        ("Inter", "Inter-normal-latin-ext", "normal", "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"),
        ("Instrument Serif", "InstrumentSerif-italic-latin", "italic", "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212"),
        ("Instrument Serif", "InstrumentSerif-italic-latin-ext", "italic", "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+2C60-2C7F,U+A720-A7FF"),
    ]:
        b64 = base64.b64encode((PACK / "fonts" / "web" / f"{f}.woff2").read_bytes()).decode()
        w = "100 900" if fam == "Inter" else "400"
        css.append(f'@font-face{{font-family:"{fam}";font-style:{style};font-weight:{w};font-display:swap;src:url(data:font/woff2;base64,{b64}) format("woff2");unicode-range:{rng}}}')
    return "\n".join(css)


def poses():
    return {p.stem: re.sub(r"\s+", " ", p.read_text()).strip() for p in (PACK / "design" / "oscar").glob("*.svg")}


def page(d, kind, title):
    m = d["meta"]
    data = {"meta": m, "poses": poses()}
    data[kind] = d[kind]
    js = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    body = "deck" if kind == "deck" else "wb"
    # PDF bibliotēka (html2pdf.js 0.10.1, MIT) — iebūvēta, ielādējas tikai pēc klikšķa
    lazy = ""
    if kind == "workbook":
        v = (LAB / "vendor" / "html2pdf.bundle.min.js").read_text().replace("</script", "<\\/script")
        lazy = f'<script type="text/x-lazy" id="h2p">{v}</script>\n'
    return f"""<!doctype html>
<html lang="lv" style="--accent:{m['accent']}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="theme-color" content="{m['accent']}">
<style>{fonts()}
{(LAB / 'lab.css').read_text()}</style></head>
<body class="{body}"><div id="app"></div>
<noscript>Lai lietotu materiālu, ieslēdz JavaScript.</noscript>
<script>window.LAB={js};</script>
{lazy if kind == "workbook" else ""}<script>{(LAB / 'lab.js').read_text()}</script>
</body></html>
"""


def main():
    topic = Path(sys.argv[1]).resolve()
    d = load(topic)
    slug = d["meta"]["slug"]
    t = re.sub(r"[*=]", "", d["meta"]["title_en"])
    out = []
    if d.get("deck"):
        f = topic / f"{slug}-prezentacija.html"
        f.write_text(page(d, "deck", f"Prezentācija · {t}"), encoding="utf-8")
        out.append(f)
    if d.get("workbook"):
        f = topic / f"{slug}-tema.html"
        f.write_text(page(d, "workbook", f"{t} · English A1"), encoding="utf-8")
        out.append(f)
    for f in out:
        print(f.name, f"{f.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
