#!/usr/bin/env python3
"""Дописывает переводы EN → RU, LV в content/i18n/ru.json и lv.json.

  tools/i18n_add.py ">Save<" ">Сохранить<" ">Saglabāt<"
  tools/i18n_add.py pack.json      — пачка: {"EN": {"ru": "...", "lv": "..."}, ...}  или  [["EN", "RU", "LV"], ...]
  --force                          — переписать уже существующий ключ

Ключ заменяется во всей собранной EN-странице простой заменой строки (build.py localize),
поэтому предупреждаем, если он короче 3 слов или встречается в собранном HTML больше одного раза.
Содержимое словарей не печатается.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
I18N = ROOT / 'content' / 'i18n'
SITE = ROOT / 'site'
LANGS = ('ru', 'lv')


def load_pack(args):
    if len(args) == 1 and args[0].endswith('.json'):
        data = json.loads(pathlib.Path(args[0]).read_text(encoding='utf-8'))
        if isinstance(data, dict):
            return [(k, v['ru'], v['lv']) for k, v in data.items()]
        return [tuple(r) for r in data]
    if len(args) == 3:
        return [tuple(args)]
    sys.exit(__doc__)


def en_html():
    """Собранные EN-страницы (без site/ru и site/lv)."""
    for p in SITE.rglob('*.html'):
        rel = p.relative_to(SITE).parts
        if rel and rel[0] in LANGS:
            continue
        yield p.read_text(encoding='utf-8', errors='ignore')


def main():
    args = [a for a in sys.argv[1:] if a != '--force']
    force = '--force' in sys.argv
    rows = load_pack(args)
    dicts = {l: json.loads((I18N / f'{l}.json').read_text(encoding='utf-8')) for l in LANGS}
    pages = None
    added = 0
    for en, ru, lv in rows:
        if not en or not ru or not lv:
            print(f'! пусто, пропущено: {en!r}')
            continue
        have = [l for l in LANGS if en in dicts[l]]
        if have and not force:
            print(f'! уже есть в {",".join(have)}, пропущено (--force чтобы заменить): {en!r}')
            continue
        if len(en.strip('<>').split()) < 3:
            print(f'~ короче 3 слов — может заменить лишнее: {en!r}')
        if pages is None:
            pages = list(en_html())
        n = sum(p.count(en) for p in pages)
        if n > 1:
            print(f'~ в собранном HTML встречается {n} раз: {en!r}')
        dicts['ru'][en], dicts['lv'][en] = ru, lv
        added += 1
    if added:
        for l in LANGS:
            (I18N / f'{l}.json').write_text(json.dumps(dicts[l], ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'добавлено: {added} из {len(rows)}')


if __name__ == '__main__':
    main()
