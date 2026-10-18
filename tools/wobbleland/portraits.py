"""Портреты жителей для «Блинной Полли»: site/images/wobbleland/pt-<ключ>.png (48×48) — квадрат из картинки карточки.
Медальон ch-*.png (20×20) в окошке раздачи не разобрать; pancakes.js берёт pt-*, если есть, иначе ch-*.
Запуск: python3 tools/wobbleland/portraits.py (после residents.py).
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
OUT = ROOT / "site" / "images" / "wobbleland"
SIZE = 48
# ширина квадрата (доля ширины карточки) и центр по высоте; поправки — где голова уходит из кадра
DEF = (0.9, 0.45)
FIX = {"lady-slugworth": (0.75, 0.6), "leafy-lou": (0.8, 0.52)}


def main():
    d = json.loads((ROOT / "content" / "wobbleland.json").read_text())
    n = 0
    for c in d["cities"]:
        for r in c.get("residents", []):
            if not r.get("card"):
                continue
            im = Image.open(ROOT / "site" / "images" / "cards" / r["card"]).convert("RGB")
            w, h = im.size
            f, cy = FIX.get(r["key"], DEF)
            side, cx, cy = w * f, w / 2, h * cy
            im = im.crop((int(cx - side / 2), int(cy - side / 2), int(cx + side / 2), int(cy + side / 2)))
            im.resize((SIZE, SIZE), Image.LANCZOS).save(OUT / f"pt-{r['key']}.png", optimize=True)
            n += 1
    print(n, "портретов")


if __name__ == "__main__":
    main()
