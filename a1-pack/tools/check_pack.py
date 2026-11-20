#!/usr/bin/env python3
"""A1 Pack — satura pārbaude pirms būvēšanas.
  python3 a1-pack/tools/check_pack.py a1-pack/topics/<slug>
Kļūdas (✗) jālabo; brīdinājumi (!) — jāizvērtē."""
import math, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from build_pack import load, ORDER  # noqa: E402

SLIDE_T = {"cover", "agenda", "section", "text", "big", "rule", "examples", "vocab", "quiz", "task", "story", "compare", "thanks"}
EX_T = {"gap", "choice", "truefalse", "match", "order", "transform", "write"}
POSES = {p.stem for p in (Path(__file__).resolve().parent.parent / "design" / "oscar").glob("*.svg")}
NEED_SRC = ["British Council", "Cambridge", "BBC"]


def main():
    topic = Path(sys.argv[1]).resolve()
    d = load(topic)
    m = d["meta"]
    E, W = [], []
    for k in ("slug", "title_en", "title_lv", "minutes", "accent", "materials", "sources"):
        if not m.get(k):
            E.append(f"meta.{k} trūkst")
    if not re.fullmatch(r"#[0-9A-Fa-f]{6}", m.get("accent", "")):
        E.append("meta.accent jābūt #RRGGBB")
    for k in m.get("materials", []):
        if k not in ORDER:
            E.append(f"nezināms materiāls: {k}")
    names = " ".join(s.get("name", "") for s in m.get("sources", []))
    for n in NEED_SRC:
        if n not in names:
            E.append(f"avotos nav «{n}»")
    mats = m.get("materials", [])

    def pose(p, where):
        if p and p not in POSES:
            E.append(f"{where}: nav Oskara pozas «{p}» (ir: {', '.join(sorted(x for x in POSES if not x.startswith('d-')))})")

    if "slides" in mats:
        sl = d.get("slides", [])
        need = math.ceil(m.get("minutes", 45) / 3)
        if len(sl) < need:
            E.append(f"slaidu {len(sl)}, vajag ≥ {need} ({m.get('minutes')} min / 3)")
        if sl and sl[0].get("type") != "cover":
            W.append("1. slaids nav cover")
        if sl and sl[-1].get("type") != "thanks":
            W.append("pēdējais slaids nav thanks")
        nq = sum(1 for s in sl if s.get("type") == "quiz")
        if sl and nq < max(1, len(sl) // 10):
            W.append(f"maz ātro testu ({nq}) — ieteicams ~1 uz 10 slaidiem")
        if sl and sum(1 for s in sl if s.get("type") == "task") < max(1, len(sl) // 15):
            W.append("maz aktivitāšu (task) — A1 vajag runāšanu ik ~15 min")
        for i, s in enumerate(sl, 1):
            t = s.get("type")
            if t not in SLIDE_T:
                E.append(f"slaids {i}: nezināms tips {t}")
                continue
            pose(s.get("pose"), f"slaids {i}")
            if t == "quiz" and not (0 <= s.get("answer", 0) < len(s.get("options", []))):
                E.append(f"slaids {i}: quiz.answer ārpus variantiem")
            if t not in ("cover", "thanks", "section") and not s.get("notes"):
                W.append(f"slaids {i}: nav skolotāja piezīmju (notes)")
            if t in ("text", "rule", "examples", "vocab", "compare", "story", "task") and not s.get("title"):
                E.append(f"slaids {i}: nav title")
            if t == "vocab" and len(s.get("items", [])) > 8:
                W.append(f"slaids {i}: >8 vārdi vienā slaidā — sadali")
    if "homework" in mats:
        exs = d.get("homework", {}).get("exercises", [])
        if not 4 <= len(exs) <= 5:
            E.append(f"mājasdarbā {len(exs)} uzdevumi, vajag 4–5")
        if len({e.get('type') for e in exs}) < 3:
            W.append("mājasdarbā maz dažādu uzdevumu tipu")
        for i, e in enumerate(exs, 1):
            t = e.get("type")
            if t not in EX_T:
                E.append(f"uzdevums {i}: nezināms tips {t}")
                continue
            if t == "write":
                if not e.get("model"):
                    E.append(f"uzdevums {i}: write bez parauga (model)")
                continue
            for j, it in enumerate(e.get("items", []), 1):
                if "answer" not in it:
                    E.append(f"uzdevums {i}.{j}: nav answer")
                if t in ("gap", "choice") and "___" not in it.get("text", ""):
                    E.append(f"uzdevums {i}.{j}: tekstā nav ___")
                if t == "choice" and it.get("answer") not in it.get("options", []):
                    E.append(f"uzdevums {i}.{j}: answer nav starp options")
        if "textarea" and not any(e.get("type") == "write" for e in exs):
            W.append("mājasdarbā nav rakstīšanas (write → textarea)")
        if not any(e.get("type") in ("choice", "match", "truefalse") for e in exs):
            W.append("mājasdarbā nav izvēles (select)")
    if "selfcheck" in mats:
        c = d.get("selfcheck", {})
        for j, q in enumerate(c.get("quiz", []), 1):
            if q.get("answer") not in q.get("options", []):
                E.append(f"pašpārbaude tests {j}: answer nav starp options")
            if not q.get("why"):
                W.append(f"pašpārbaude tests {j}: nav paskaidrojuma")
        if len(c.get("detective", [])) < 4:
            E.append("Kļūdu detektīvā vajag ≥ 4 teikumus")
        if not c.get("facts"):
            E.append("pašpārbaudē nav faktu")
        for f in c.get("facts", []):
            pose(f.get("pose"), "fakts")
        for v in c.get("videos", []):
            if v.get("youtube") and not re.fullmatch(r"[A-Za-z0-9_-]{11}", v["youtube"]):
                E.append(f"video «{v.get('title')}»: youtube jābūt 11 simbolu ID")
            if v.get("youtube") and not v.get("verified"):
                W.append(f"video «{v.get('title')}»: ID nav pārbaudīts (verified: true) — citādi izmanto search")
    if "reserve" in mats and not 3 <= len(d.get("reserve", [])) <= 4:
        E.append(f"rezerves uzdevumi: {len(d.get('reserve', []))}, vajag 3–4")
    if "mistakes" in mats and len(d.get("mistakes", [])) < 5:
        E.append("Biežākās kļūdas: vajag ≥ 5")
    if "guide" in mats:
        tl = d.get("guide", {}).get("timeline", [])
        if tl:
            last = re.findall(r"\d+", tl[-1].get("min", ""))
            if last and int(last[-1]) != m.get("minutes"):
                E.append(f"metodikas laika josla beidzas {last[-1]} min, nodarbība {m.get('minutes')} min")
        else:
            E.append("metodikā nav timeline")
    for x in E:
        print("✗", x)
    for x in W:
        print("!", x)
    print(f"{'OK' if not E else 'KĻŪDAS'}: {len(E)} kļūdas, {len(W)} brīdinājumi · slaidi {len(d.get('slides', []))}")
    sys.exit(1 if E else 0)


if __name__ == "__main__":
    main()
