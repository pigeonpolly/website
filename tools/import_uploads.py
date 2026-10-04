#!/usr/bin/env python3
"""Разбирает файлы, загруженные в корень репозитория через GitHub, по галереям.

Префикс имени файла -> галерея:
  polly_ bird, chew_ snail, titos_ detective, pumpkin_ halloween, anxiety_ anxiety,
  sketchbook_ sketchbook, aiart_ ai-art, exhibition_ exhibitions, publication_ publications
Подпись берётся из имени, если в нём есть год: "polly_(2023) Pigeon Polly space.jpg".
Файлы без года (aiart_3.png) идут без подписи, по номеру.
После обработки исходники удаляются. Затем: python3 build.py
"""
import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
PREFIX = {
    "polly_": "bird", "chew_": "snail", "titos_": "detective", "pumpkin_": "halloween",
    "anxiety_": "anxiety", "sketchbook_": "sketchbook", "aiart_": "ai-art",
    "exhibition_": "exhibitions", "publication_": "publications",
}
EXT = {".jpg", ".jpeg", ".png", ".webp"}


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "image"


def parse(stem):
    """-> (год или None, подпись или '', номер для сортировки)"""
    m = re.match(r"^\((\d{4})\)\s*(.+)$", stem)
    if m:
        return int(m.group(1)), f"({m.group(1)}) {m.group(2).strip().rstrip('.').strip()}", 0
    n = re.findall(r"\d+", stem)
    return None, "", int(n[-1]) if n else 0


def convert(src, dst, size, q):
    subprocess.run(["convert", str(src), "-auto-orient", "-strip", "-colorspace", "sRGB",
                    "-background", "white", "-alpha", "remove", "-resize", f"{size}x{size}>",
                    "-quality", str(q), "-interlace", "Plane", str(dst)], check=True)


def main():
    found = {}
    for f in sorted(ROOT.iterdir()):
        if f.suffix.lower() not in EXT:
            continue
        for p, gal in PREFIX.items():
            if f.name.startswith(p):
                found.setdefault(gal, []).append((f, f.stem[len(p):]))
    for gal, files in found.items():
        out = ROOT / "site" / "images" / gal
        out.mkdir(parents=True, exist_ok=True)
        data_file = ROOT / "content" / "galleries" / f"{gal}.json"
        items = json.loads(data_file.read_text()) if data_file.exists() else []
        known = {it["full"] for it in items}
        new = []
        for src, stem in files:
            year, cap, num = parse(stem)
            base = slug(f"{gal} {stem}") if not year else slug(cap)
            full, thumb = out / f"{base}.jpg", out / f"{base}-800.jpg"
            rel = full.relative_to(ROOT / "site").as_posix()
            if rel not in known:
                convert(src, full, 1600, 84)
                convert(src, thumb, 800, 80)
                w, h = subprocess.run(["identify", "-format", "%w %h", str(thumb)],
                                      capture_output=True, text=True, check=True).stdout.split()
                new.append(({"full": rel, "thumb": thumb.relative_to(ROOT / "site").as_posix(),
                             "w": int(w), "h": int(h), "caption": cap}, year, num))
            src.unlink()
        # новые сверху по году (новые -> старые), без года — по номеру
        new.sort(key=lambda x: (-(x[1] or 0), x[2], x[0]["caption"]))
        items += [n[0] for n in new]
        data_file.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n")
        print(f"{gal}: +{len(new)}")


if __name__ == "__main__":
    main()
