#!/usr/bin/env python3
"""A1 English Lab — satura pārbaude pirms būvēšanas.
  python3 a1-pack/tools/check_lab.py a1-pack/topics/<slug>
✗ — jālabo; ! — jāizvērtē."""
import json, math, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from build_lab import load  # noqa: E402

SLIDES = {"cover", "agenda", "section", "text", "big", "rule", "examples", "vocab", "quiz", "task", "story", "compare", "switcher", "build", "picker", "oscar", "thanks"}
SECS = {"oscar", "story", "rule", "vocab", "practice", "facts", "video", "mistakes", "quiz", "text", "homework"}
EXT = {"gap", "choice", "truefalse", "sort", "build", "match", "detective", "listen", "write"}
POSES = {p.stem for p in (Path(__file__).resolve().parent.parent / "design" / "oscar").glob("*.svg") if not p.stem.startswith("d-")}


def norm(s):
    return re.sub(r"[.?!]+$", "", re.sub(r"\s+", " ", str(s).lower().replace("’", "'"))).strip()


def main():
    d = load(Path(sys.argv[1]).resolve())
    m, E, W = d["meta"], [], []
    for k in ("slug", "title_en", "title_lv", "minutes", "accent", "sources"):
        if not m.get(k):
            E.append(f"meta.{k} trūkst")
    if not re.fullmatch(r"#[0-9A-Fa-f]{6}", m.get("accent", "")):
        E.append("meta.accent jābūt #RRGGBB")
    names = " ".join(s.get("name", "") for s in m.get("sources", []))
    for n in ("British Council", "Cambridge", "BBC"):
        if n not in names:
            E.append(f"avotos nav «{n}»")

    def pose(p, w):
        if p and p not in POSES:
            E.append(f"{w}: nav pozas «{p}» (ir: {', '.join(sorted(POSES))})")

    def ex(e, w, hw=False):
        t = e.get("type")
        if t not in EXT:
            E.append(f"{w}: nezināms tips {t}")
            return
        if not e.get("title"):
            E.append(f"{w}: nav title")
        if t == "write":
            if not e.get("model"):
                E.append(f"{w}: write bez model")
            return
        if t == "sort":
            if len(e.get("buckets", [])) < 2:
                E.append(f"{w}: sort vajag ≥ 2 grupas")
            return
        for j, it in enumerate(e.get("items", []), 1):
            ww = f"{w}.{j}"
            if t in ("gap", "choice") and "___" not in it.get("text", ""):
                E.append(f"{ww}: tekstā nav ___")
            if t == "choice" and it.get("answer") not in it.get("options", []):
                E.append(f"{ww}: answer nav starp options")
            if t == "build":
                words = [x.strip() for x in it.get("words", "").split("/")]
                if sorted(norm(" ".join(words)).split()) != sorted(norm(it.get("answer", "")).split()):
                    E.append(f"{ww}: build vārdi ≠ atbilde («{it.get('words')}» / «{it.get('answer')}»)")
            if t == "detective":
                n = len(it.get("wrong", "").split(" "))
                if not isinstance(it.get("bad"), int) or not 0 <= it["bad"] < n:
                    E.append(f"{ww}: detective.bad jābūt vārda indeksam 0…{n - 1}")
                if not it.get("right"):
                    E.append(f"{ww}: nav right")
            if t in ("gap", "choice", "truefalse", "match") and "answer" not in it and "right" not in it:
                E.append(f"{ww}: nav answer")
            if t == "listen" and not it.get("text"):
                E.append(f"{ww}: listen bez text")

    deck = d.get("deck", [])
    if deck:
        need = math.ceil(m.get("minutes", 45) / 3)
        if len(deck) < need:
            E.append(f"slaidu {len(deck)}, vajag ≥ {need}")
        types = [s.get("type") for s in deck]
        if types[0] != "cover":
            W.append("1. slaids nav cover")
        inter = sum(1 for t in types if t in ("quiz", "switcher", "build", "picker", "task", "vocab", "examples", "story"))
        if types.count("oscar") < max(2, len(deck) // 6):
            W.append(f"maz lielo Oskara slaidu (oscar): {types.count('oscar')} — ieteicams ≥ {max(2, len(deck) // 6)}")
        if inter < len(deck) * 0.4:
            W.append(f"maz interaktīvu slaidu ({inter}/{len(deck)}) — mērķis ≥ 40 %")
        for i, s in enumerate(deck, 1):
            t = s.get("type")
            if t not in SLIDES:
                E.append(f"slaids {i}: nezināms tips {t}")
                continue
            pose(s.get("pose"), f"slaids {i}")
            if t == "quiz" and not 0 <= s.get("answer", -1) < len(s.get("options", [])):
                E.append(f"slaids {i}: quiz.answer — indekss")
            if t == "build":
                ex({"type": "build", "title": "x", "items": [{"words": s.get("words", ""), "answer": s.get("answer", "")}]}, f"slaids {i}")
            txt = json.dumps(s, ensure_ascii=False).lower()
            if re.search(r"pāros|grupā|kaimiņ|staigā pa|lomu spēl|in pairs|your partner", txt):
                E.append(f"slaids {i}: uzdevumi tikai individuāli (atrasts pāru/grupu darbs)")
            if t not in ("cover", "thanks", "section") and not s.get("notes"):
                W.append(f"slaids {i}: nav notes")
    wb = d.get("workbook")
    if wb:
        secs = wb.get("sections", [])
        ts = [s.get("type") for s in secs]
        for s in secs:
            if s.get("type") not in SECS:
                E.append(f"burtnīca: nezināma sadaļa {s.get('type')}")
        for need_t in ("story", "rule", "practice", "facts", "mistakes", "quiz", "homework"):
            if need_t not in ts:
                E.append(f"burtnīcā nav sadaļas «{need_t}»")
        for si, s in enumerate(secs, 1):
            if s.get("type") in ("practice", "homework"):
                exs = s.get("exercises", [])
                for k, e in enumerate(exs, 1):
                    ex(e, f"{s['type']} {k}", s["type"] == "homework")
                if s["type"] == "practice" and len({e.get('type') for e in exs}) < 5:
                    W.append("praksē < 5 dažādi uzdevumu tipi")
                if s["type"] == "homework":
                    if not 4 <= len(exs) <= 5:
                        E.append(f"mājasdarbā {len(exs)} uzdevumi, vajag 4–5")
                    if not any(e.get("type") == "write" for e in exs):
                        E.append("mājasdarbā nav write")
            if s.get("type") == "quiz":
                if len(s.get("items", [])) < 6:
                    W.append("gala testā < 6 jautājumi")
                for j, q in enumerate(s.get("items", []), 1):
                    if q.get("answer") not in q.get("options", []):
                        E.append(f"tests {j}: answer nav starp options")
            if s.get("type") == "facts":
                for f in s.get("items", []):
                    pose(f.get("pose"), "fakts")
            if s.get("type") == "video":
                for v in s.get("items", []):
                    if v.get("youtube") and not v.get("verified"):
                        W.append(f"video «{v.get('title')}»: ID nav verified — rādīsies meklēšanas saite")
    for x in E:
        print("✗", x)
    for x in W:
        print("!", x)
    print(f"{'OK' if not E else 'KĻŪDAS'}: {len(E)} kļūdas, {len(W)} brīdinājumi · slaidi {len(deck)} · sadaļas {len((wb or {}).get('sections', []))}")
    sys.exit(1 if E else 0)


if __name__ == "__main__":
    main()
