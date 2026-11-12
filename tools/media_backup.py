#!/usr/bin/env python3
"""Копия картинок сайта на GitHub: блог, картины галерей, карточки (R2 → backup/media/).
Список — /api/blog/media-list; качаются только новые, старые не удаляются (это копия).
Запускает .github/workflows/media-backup.yml раз в неделю; можно и руками: python3 tools/media_backup.py"""
import json, os, sys, urllib.request
SITE = 'https://www.pigeonpolly.com'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backup', 'media')
def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'pigeonpolly-media-backup'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()
keys = json.loads(get(SITE + '/api/blog/media-list'))['keys']
new = bad = 0
for k in keys:
    path = os.path.normpath(os.path.join(OUT, k))
    if not path.startswith(os.path.normpath(OUT)) or os.path.exists(path):
        continue
    try:
        data = get(SITE + '/media/' + urllib.request.quote(k))
    except Exception as e:
        bad += 1; print('не скачалось:', k, e, file=sys.stderr); continue
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(data)
    new += 1
print(f'картинок на сайте: {len(keys)}, скачано новых: {new}, не скачалось: {bad}')
sys.exit(1 if bad else 0)
