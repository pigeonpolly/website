#!/usr/bin/env python3
"""Дела Титоса в браузере: можно ли нажать каждую улику (зоны кабинета, спрайты, лупа, места в сценах).
Ищет места, которые закрыты другими элементами больше чем на 40 % (нажатие попадёт не туда). API подменяется, база не нужна.
  python3 build.py && (cd site && python3 -m http.server 8766 &)
  python3 tools/titos_clicks.py [--w 390] [номера дел…]
Пусто в выводе, кроме итога, — всё нажимается."""
import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
CASES = {c["n"]: c for c in json.loads((ROOT / "site/assets/titos-cases.json").read_text())["cases"]}
PROBE = """sel => [...document.querySelectorAll(sel)].map(el => { el.scrollIntoView({block: 'center', inline: 'center'}); const r = el.getBoundingClientRect(); let hit = 0;
  for (let i = 1; i < 10; i++) for (let j = 1; j < 10; j++) { const h = document.elementFromPoint(r.left + r.width * i / 10, r.top + r.height * j / 10); if (h && (h === el || el.contains(h))) hit++; }
  return [el.dataset.k || el.dataset.zone || (el.querySelector('img') || {}).alt, hit / 81]; })"""


def ru(o):
    if isinstance(o, dict) and isinstance(o.get("ru"), str) and set(o) <= {"ru", "en", "lv"}:
        return o["ru"]
    if isinstance(o, list):
        return [ru(x) for x in o]
    if isinstance(o, dict):
        return {k: ru(v) for k, v in o.items()}
    return o


def main():
    a = sys.argv[1:]
    w = int(a[a.index("--w") + 1]) if "--w" in a else 1440
    only = {int(x) for i, x in enumerate(a) if x.isdigit() and (i == 0 or a[i - 1] != "--w")}
    bad = 0
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        for n, c in sorted(CASES.items()):
            if only and n not in only:
                continue
            st = {"level": 99, "coffee": 9, "max": 10, "run": n, "awake": True, "sleep": False, "found": []}
            cl = ru(c)
            for k in ("culprit", "trick", "solved"):
                cl.pop(k, None)

            def api(route, req=None, cl=cl, st=st):
                p = re.sub(r"^https?://[^/]+", "", route.request.url).split("?")[0]
                route.fulfill(json={"/api/titos": {"on": True, "play": True, "state": st, "cases": [{"n": k, "title": "…"} for k in CASES]},
                                    "/api/titos/case": {"case": cl}}.get(p, {"ok": True, "state": st}))
            ctx = br.new_context(viewport={"width": w, "height": 900})
            ctx.route(re.compile(r".*/api/.*"), api)
            ctx.route(re.compile(r"^https?://(?!localhost).*"), lambda r: r.abort())
            pg = ctx.new_page()
            pg.add_init_script(f"localStorage.setItem('pp-titos-case','{n}'); localStorage.removeItem('pp-titos-case-{n}');")
            pg.goto("http://localhost:8766/ru/titos/")
            pg.wait_for_selector(".q-banner .q-tabs")
            pg.wait_for_timeout(300)
            hots = {x["at"] for x in c["clues"] if not x["at"].startswith("scene:") and not (x.get("spot") and x.get("icon"))} | {"magnifier"}
            res = pg.evaluate(PROBE, ".q-clue") + [r for r in pg.evaluate(PROBE, ".rm-hot") if r[0] in hots]
            for i, sc in enumerate(c.get("scenes", [])):
                pg.click(f'.q-banner [data-q="scene"][data-i="{i}"]')
                pg.wait_for_timeout(150)
                res += [(f"сцена {sc['id']}, место {k}", f) for k, f in pg.evaluate(PROBE, ".q-modal [data-zone]")]
                pg.click(".q-modal .q-x")
            errs = [f"{k}: нажимается только {round(f * 100)} %" for k, f in res if f < .6]
            for x in errs:
                print(f"{n:03d}: {x}")
            bad += bool(errs)
            ctx.close()
    print(f"Итог: ширина {w}, дел с закрытыми уликами {bad}")


if __name__ == "__main__":
    main()
