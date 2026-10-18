#!/usr/bin/env python3
"""Проверка дел Титоса (content/titos/NNN.json, формат — docs/titos.md) и прохождение каждого дела ботом.
Выводит только ошибки и итог. Код выхода 1, если есть ошибки.
  python3 tools/titos_check.py            — все дела
  python3 tools/titos_check.py 3 7        — только дела №3 и №7
  python3 tools/titos_check.py --index    — ещё и переписать content/titos/index.md (№, название, виновный, трюк)
Старые дела («legacy»: true — бывшие «Дело №1» и «Дело №2») не проверяются на диапазон сложности и без вещи-награды.
У каждого нового дела — вещь-награда `reward`: "furn|tc<имя>", нарисована в site/assets/room.js (блок «награды за дела Титоса»), у каждого дела своя."""
import difflib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "content" / "titos"
sys.path.insert(0, str(ROOT / "tools"))
from titos_cast import cast  # noqa: E402

HOT = json.loads((ROOT / "tools" / "rooms" / "detective.json").read_text())["hot"]
ZONES = set(HOT)


def covered(z, tops):
    """доля зоны [x, y, w, h], закрытая зонами tops (сетка 10×10)"""
    x, y, w, h = z
    pts = [(x + w * (i + .5) / 10, y + h * (j + .5) / 10) for i in range(10) for j in range(10)]
    return sum(any(a <= px <= a + c and b <= py <= b + d for a, b, c, d in tops) for px, py in pts) / len(pts)
CAST = {r["key"] for r in cast()}
# вещи-награды за дела: ключи tc<имя> из site/assets/room.js (FURN, «tcpie: TC(…»)
REWARDS = set(re.findall(r"^\s+(tc[a-z]+): TC\(", (ROOT / "site" / "assets" / "room.js").read_text(), re.M))
TEXT_KEYS = {"title", "ask", "intro", "solved", "bye", "name", "alibi", "wrong", "text", "pre", "q", "a", "say"}
# сложность по номеру: улик (от, до), подозреваемых (от, до), ложных следов (от, до), нужна ли лупа, нужны ли противоречия в показаниях
# дела 3–42 — первый круг: каждый житель виновен один раз; с №43 — второй круг (Алина, этап 10-5): жители снова виновны, но с новым трюком и не дважды за круг
ROUND1 = 42
LEVELS = [
    (1, 10, (3, 4), (2, 2), (0, 0), False, False),
    (11, 30, (5, 6), (3, 3), (1, 1), False, False),
    (31, 60, (5, 7), (4, 4), (0, 9), True, False),
    (61, 90, (8, 9), (4, 9), (0, 9), True, True),
    (91, 100, (9, 30), (4, 9), (0, 9), True, True),
]


def texts(o, path=""):
    """все места, где должен быть текст {"ru": …}: (путь, значение)"""
    if isinstance(o, dict):
        for k, v in o.items():
            p = f"{path}.{k}" if path else k
            if k in TEXT_KEYS:
                yield p, v
            elif isinstance(v, (dict, list)):
                yield from texts(v, p)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from texts(v, f"{path}[{v.get('id') if isinstance(v, dict) and v.get('id') else i}]")


def culprit_name(c):
    s = next((x for x in c.get("suspects", []) if x.get("id") == c.get("culprit")), {})
    return s.get("who") or (s.get("name") or {}).get("ru", "?")


def check(c, f):
    err = []
    e = err.append
    n = c.get("n")
    if not isinstance(n, int) or n < 1 or n > 100:
        e("n — номер уровня 1…100")
    elif f.stem != f"{n:03d}":
        e(f"файл должен называться {n:03d}.json")
    for k in ("title", "trick", "intro", "solved", "suspects", "culprit", "clues"):
        if k not in c:
            e(f"нет поля «{k}»")
    rw = c.get("reward")
    if not c.get("legacy"):
        m = re.fullmatch(r"furn\|(tc[a-z]+)", str(rw or ""))
        if not m:
            e("reward — вещь-награда «furn|tc<имя>» (docs/titos.md «Вещи-награды»)")
        elif m[1] not in REWARDS:
            e(f"reward «{rw}»: такой вещи нет в site/assets/room.js (блок «награды за дела Титоса»)")
    if not isinstance(c.get("trick"), str) or not c.get("trick", "").strip():
        e("trick — строка RU (главный трюк дела)")
    # тексты — только RU
    for p, v in texts(c):
        if not isinstance(v, dict) or not isinstance(v.get("ru"), str) or not v["ru"].strip():
            e(f"{p}: нужен текст {{\"ru\": \"…\"}}")
        elif set(v) != {"ru"}:
            e(f"{p}: в деле только RU (EN и LV добавит сервер)")
    sus = {s.get("id"): s for s in c.get("suspects", [])}
    clues = {x.get("id"): x for x in c.get("clues", [])}
    people = {p.get("id"): p for p in c.get("people", [])}
    scenes = {s.get("id"): s for s in c.get("scenes", [])}
    if len(sus) != len(c.get("suspects", [])):
        e("у подозреваемых повторяются id")
    if len(clues) != len(c.get("clues", [])):
        e("у улик повторяются id")
    for s in sus.values():
        if s.get("who") and s["who"] not in CAST:
            e(f"подозреваемый {s.get('id')}: «{s['who']}» нет в docs/titos-cast.md")
        if not s.get("who") and not s.get("name"):
            e(f"подозреваемый {s.get('id')}: нужен who (житель из titos-cast.md) или name")
        if s.get("id") != c.get("culprit") and not s.get("wrong"):
            e(f"подозреваемый {s.get('id')}: нет «wrong» — что скажет Титос, если обвинить его")
    if c.get("culprit") not in sus:
        e(f"culprit «{c.get('culprit')}» — не подозреваемый")
    for cid, x in clues.items():
        at = str(x.get("at", ""))
        if at.startswith("scene:"):
            if at[6:] not in scenes:
                e(f"улика {cid}: нет сцены «{at[6:]}»")
        elif at not in ZONES:
            e(f"улика {cid}: «{at}» — не зона кабинета (tools/rooms/detective.json) и не scene:<id>")
        for k in ("against", "clears"):
            for s in x.get(k, []):
                if s not in sus:
                    e(f"улика {cid}: {k} — «{s}» не подозреваемый")
        for r in x.get("refutes", []):
            if r not in clues:
                e(f"улика {cid}: refutes — нет улики «{r}»")
    talk_clue = {}
    for i, t in enumerate(c.get("talk", [])):
        if t.get("to") not in sus and t.get("to") not in people:
            e(f"talk[{i}]: «{t.get('to')}» — не подозреваемый и не свидетель (people)")
        if t.get("clue"):
            if t["clue"] not in clues:
                e(f"talk[{i}]: нет улики «{t['clue']}»")
            talk_clue[t["clue"]] = t.get("to")
    for sid, s in scenes.items():
        for j, z in enumerate(s.get("spots", [])):
            if z.get("clue") and z["clue"] not in clues:
                e(f"сцена {sid}, место {j}: нет улики «{z['clue']}»")
            if z.get("talk") and z["talk"] not in sus and z["talk"] not in people:
                e(f"сцена {sid}, место {j}: «{z['talk']}» не подозреваемый и не свидетель")
    if err:
        return err  # дальше — логика, без формата не проверить
    # логика дела
    real = {k: x for k, x in clues.items() if not x.get("fake")}
    fakes = {k: x for k, x in clues.items() if x.get("fake")}
    cul = c["culprit"]
    if not any(cul in x.get("against", []) for x in real.values()):
        e(f"против виновного «{cul}» нет ни одной настоящей улики")
    for k, x in clues.items():
        if cul in x.get("clears", []):
            e(f"улика {k} снимает подозрение с виновного «{cul}»")
    for s in sus:
        if s != cul and not any(s in x.get("clears", []) for x in real.values()):
            e(f"невиновного «{s}» не снимает ни одна настоящая улика")
    for k in fakes:
        if not any(k in x.get("refutes", []) for x in real.values()):
            e(f"ложный след {k} ничем не опровергнут (нужна настоящая улика с refutes: [\"{k}\"])")
    # сложность по номеру
    lens = any(x.get("lens") for x in clues.values())
    contra = any(r in talk_clue and clues[r].get("fake") for x in real.values() for r in x.get("refutes", []))
    if not c.get("legacy"):
        for lo, hi, nc, ns, nf, need_lens, need_contra in LEVELS:
            if lo <= n <= hi:
                if not nc[0] <= len(clues) <= nc[1]:
                    e(f"уровни {lo}–{hi}: улик {nc[0]}–{nc[1]}, а не {len(clues)}")
                if not ns[0] <= len(sus) <= ns[1]:
                    e(f"уровни {lo}–{hi}: подозреваемых {ns[0]}–{ns[1]}, а не {len(sus)}")
                if not nf[0] <= len(fakes) <= nf[1]:
                    e(f"уровни {lo}–{hi}: ложных следов {nf[0]}–{nf[1]}, а не {len(fakes)}")
                if need_lens and not lens:
                    e(f"уровни {lo}–{hi}: нужна хотя бы одна улика под лупой (lens)")
                if need_contra and not contra:
                    e(f"уровни {lo}–{hi}: нужно противоречие — ложные показания (talk → улика fake), опровергнутые настоящей уликой")
    # бот: обходит кабинет и сцены, допрашивает всех, берёт лупу, потом снимает подозрения
    reach = set()
    visible = {z.get("talk") for s in scenes.values() for z in s.get("spots", [])} | set(sus)
    for k, x in clues.items():
        at = x.get("at", "")
        if k in talk_clue:
            if talk_clue[k] in visible:
                reach.add(k)
        elif at.startswith("scene:"):
            sc = scenes[at[6:]]
            if not sc.get("spots") or any(z.get("clue") == k for z in sc["spots"]):
                reach.add(k)
        else:
            reach.add(k)
    # улику можно нажать: зона в кабинете не закрыта другими (quest-titos.js поднимает зоны с уликами и лупу поверх остальных,
    # среди них сверху — меньшая), место в сцене не закрыто следующими местами (позже в списке — выше)
    room = {x.get("at") for x in clues.values() if x.get("at") in ZONES and not (x.get("spot") and x.get("icon"))}
    area = lambda k: HOT[k][2] * HOT[k][3]
    for k in sorted(room):
        tops = [HOT[o] for o in room | {"magnifier"} if o != k and area(o) < area(k)]
        if covered(HOT[k], tops) > .4:
            e(f"улика в «{k}»: зона закрыта другими зонами с уликами или лупой — не нажать")
    for sid, s in scenes.items():
        sp = s.get("spots", []) if s.get("img") else []  # текстовая сцена — список кнопок, перекрытий нет
        for j, z in enumerate(sp):
            if covered([z.get(q, 0) for q in "xywh"], [[o.get(q, 0) for q in "xywh"] for o in sp[j + 1:]]) > .4:
                e(f"сцена {sid}, место {j}: закрыто следующими местами — не нажать")
    for k in sorted(set(clues) - reach):
        e(f"бот: улику {k} не найти (нет ни в зоне, ни на месте в сцене, ни в допросе)")
    left = [s for s in sus if not any(s in real[k].get("clears", []) for k in real if k in reach)]
    hit = [s for s in left if any(s in real[k].get("against", []) for k in real if k in reach)]
    if hit != [cul]:
        e(f"бот: по уликам выходит {hit or 'никто'}, а виновный — «{cul}»")
    return err


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    files = sorted(DIR.glob("[0-9][0-9][0-9].json"))
    if args:
        files = [f for f in files if str(int(f.stem)) in args]
    cases, bad = {}, 0
    for f in files:
        try:
            cases[f] = json.loads(f.read_text())
        except Exception as x:
            print(f"{f.name}: не JSON — {x}")
            bad += 1
    # уже записанные дела: content/titos/index.md (| № | название | виновный | трюк |)
    idx = {}
    if (DIR / "index.md").exists():
        for line in (DIR / "index.md").read_text().splitlines():
            m = re.match(r"\|\s*(\d+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|", line)
            if m:
                idx[int(m[1])] = (m[3].strip(), m[4].strip())
    seen = {}
    for f in DIR.glob("[0-9][0-9][0-9].json"):
        try:
            rw = json.loads(f.read_text()).get("reward")
        except Exception:
            continue
        if rw:
            seen.setdefault(rw, []).append(int(f.stem))
    for f, c in cases.items():
        errs = check(c, f)
        if c.get("reward") and len(seen.get(c["reward"], [])) > 1:
            errs.append(f"вещь-награда «{c['reward']}» уже в деле №{min(x for x in seen[c['reward']] if x != c.get('n'))}")
        n = c.get("n")
        for m, (who, trick) in idx.items():
            if m == n or not who:
                continue
            if who == culprit_name(c) and (m <= ROUND1) == (n <= ROUND1):
                errs.append(f"виновный «{who}» уже был в деле №{m}")
            if difflib.SequenceMatcher(None, trick.lower(), str(c.get("trick", "")).lower()).ratio() > 0.8:
                errs.append(f"трюк почти как в деле №{m}: «{trick}»")
        for x in errs:
            print(f"{f.name}: {x}")
        bad += bool(errs)
    if "--index" in sys.argv:
        all_cases = sorted((json.loads(f.read_text()) for f in DIR.glob("[0-9][0-9][0-9].json")), key=lambda c: c.get("n", 0))
        lines = ["# Дела Титоса", "", "_`python3 tools/titos_check.py --index` — одна строка на дело. Новое дело не повторяет виновного, трюк и вещь-награду._", "",
                 "| № | Название | Виновный | Трюк | Награда |", "|---|---|---|---|---|"]
        lines += [f"| {c['n']} | {c['title']['ru']} | {culprit_name(c)} | {c['trick']} | {c.get('reward') or '—'} |" for c in all_cases]
        (DIR / "index.md").write_text("\n".join(lines) + "\n")
    print(f"Итог: дел {len(cases)}, с ошибками {bad}" + ("" if bad else " — всё в порядке, бот прошёл все"))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
