#!/usr/bin/env python3
"""Жители Воббленда для дел Титоса → docs/titos-cast.md (одна строка на жителя: ключ, имя, город, занятие, черта характера).
Берёт content/wobbleland.json (cities[].residents[]). Поля жителя: name, key, job (или work), trait (или note). Ключ без key — из имени.
Запуск: python3 tools/titos_cast.py"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower().replace("mr.", "mr ")).strip("-")


def cast():
    data = json.loads((ROOT / "content" / "wobbleland.json").read_text())
    out = []
    for city in data["cities"]:
        for r in city.get("residents", []):
            out.append({"key": r.get("key") or slug(r["name"]), "name": r["name"], "city": city["name"],
                        "job": r.get("job") or r.get("work") or "—", "trait": r.get("trait") or r.get("note") or "—"})
    return out


def main():
    rows = cast()
    lines = ["# Жители Воббленда для дел Титоса", "",
             "_Собирает `python3 tools/titos_cast.py` из content/wobbleland.json — руками не править. `who` подозреваемого в деле — ключ отсюда._", "",
             "| Ключ | Имя | Город | Занятие | Черта |", "|---|---|---|---|---|"]
    lines += [f"| {r['key']} | {r['name']} | {r['city']} | {r['job']} | {r['trait']} |" for r in rows]
    (ROOT / "docs" / "titos-cast.md").write_text("\n".join(lines) + "\n")
    print(f"docs/titos-cast.md: {len(rows)} жителей")


if __name__ == "__main__":
    main()
