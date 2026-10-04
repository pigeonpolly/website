#!/usr/bin/env python3
"""Добавляет картинки в галерею.

  python3 tools/add_images.py bird "путь/2023 Pigeon Polly space.jpg" ...

- Подпись берётся из имени файла: "2023 Pigeon Polly space.jpg" -> "(2023) Pigeon Polly space".
- Картинка ужимается до 1600px (полная) и 800px (превью) в JPEG и кладётся в site/images/<галерея>/.
- Запись добавляется в content/galleries/<галерея>.json (порядок и подписи там можно править руками).
Нужен ImageMagick (convert/identify). После добавления: python3 build.py
"""
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s or "image"


def caption_from(name):
    m = re.match(r"^\(?((?:19|20)\d\d)\)?[\s_-]+(.*)$", name)
    if m:
        return f"({m.group(1)}) {m.group(2).strip()}"
    m = re.match(r"^(.*?)[\s_-]*\(?((?:19|20)\d\d)\)?$", name)
    if m and m.group(1):
        return f"({m.group(2)}) {m.group(1).strip()}"
    return name.strip()


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    gallery, files = sys.argv[1], sys.argv[2:]
    out_dir = ROOT / "site" / "images" / gallery
    out_dir.mkdir(parents=True, exist_ok=True)
    data_file = ROOT / "content" / "galleries" / f"{gallery}.json"
    items = json.loads(data_file.read_text()) if data_file.exists() else []
    known = {it["full"] for it in items}
    for f in files:
        src = pathlib.Path(f)
        name = src.stem
        base = slug(re.sub(r"^(PP|MC|MP)-\d+\s*", "", name))
        full = out_dir / f"{base}.jpg"
        thumb = out_dir / f"{base}-800.jpg"
        rel_full = full.relative_to(ROOT / "site").as_posix()
        if rel_full in known:
            print("skip (already there)", src.name)
            continue
        common = ["-auto-orient", "-strip", "-colorspace", "sRGB", "-background", "white", "-alpha", "remove"]
        subprocess.run(["convert", str(src), *common, "-resize", "1600x1600>", "-quality", "84", "-interlace", "Plane", str(full)], check=True)
        subprocess.run(["convert", str(src), *common, "-resize", "800x800>", "-quality", "80", "-interlace", "Plane", str(thumb)], check=True)
        w, h = subprocess.run(["identify", "-format", "%w %h", str(thumb)], capture_output=True, text=True, check=True).stdout.split()
        items.append({
            "full": rel_full,
            "thumb": thumb.relative_to(ROOT / "site").as_posix(),
            "w": int(w), "h": int(h),
            "caption": caption_from(re.sub(r"^(PP|MC|MP)-\d+\s*", "", name)),
        })
        print("added", src.name)
    data_file.parent.mkdir(parents=True, exist_ok=True)
    data_file.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
