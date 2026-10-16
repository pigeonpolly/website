#!/usr/bin/env python3
"""docs/db.md — все таблицы D1 (из CREATE TABLE / ALTER TABLE в worker/*.js) и все ключи meta.

Запуск: python3 tools/docs/build_db.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRCS = sorted((ROOT / 'worker').glob('*.js'))
OUT = ROOT / 'docs' / 'db.md'

CREATE = re.compile(r'CREATE TABLE IF NOT EXISTS (\w+) *\(')
ALTER = re.compile(r'ALTER TABLE (\w+) ADD COLUMN (\w+) ([A-Z]+)?([^\'"`;]*?(?:DEFAULT (?:\'[^\']*\'|\S+))?)?(?=[\'"`;)]|$)')
CONSTRAINT = re.compile(r'^(PRIMARY KEY|UNIQUE|FOREIGN KEY|CHECK)\b', re.I)
# ключи meta: первый строковый аргумент этих функций, SQL с ключом-литералом, списки ключей
META_CALL = re.compile(r'\b(?:getMeta|setMeta|meta|secFail|secLocked|bump)\((?:env, *)?\'([\w:.-]+)\'')
META_SQL = re.compile(r'meta WHERE key = \'([\w:.-]+)\'|INTO meta \(key, value\) VALUES \(\'([\w:.-]+)\'')
META_LIST = re.compile(r'\[((?:\'[\w:.-]+\', *)+\'[\w:.-]+\')\]\.map\(k => (?:h\.)?getMeta')
META_IN = re.compile(r'meta WHERE key (?:NOT )?IN \(([^)]*)\)')
META_PREFIX = re.compile(r'\b(\w+) = \'([a-z_]+:)\' *\+')


def body(src, start):
    """Текст между скобками CREATE TABLE … ( … )."""
    depth, i = 1, start
    while depth:
        c = src[i]
        depth += c == '('
        depth -= c == ')'
        i += 1
    return src[start:i - 1]


def split_top(s):
    out, depth, cur = [], 0, ''
    for c in s:
        if c == ',' and depth == 0:
            out.append(cur); cur = ''
            continue
        depth += (c == '(') - (c == ')')
        cur += c
    out.append(cur)
    return [x.strip() for x in out if x.strip()]


def col(defn):
    defn = re.sub(r'\s+', ' ', defn)
    name, _, rest = defn.partition(' ')
    rest = rest.replace('PRIMARY KEY AUTOINCREMENT', 'PK auto').replace('PRIMARY KEY', 'PK').replace('NOT NULL', 'nn')
    rest = rest.replace('INTEGER', 'int').replace('TEXT', 'text').replace('REAL', 'real').replace('DEFAULT ', '=')
    return f'`{name}` {rest}'.strip()


def main():
    tables, where = {}, {}
    meta = {}
    for f in SRCS:
        src = f.read_text(encoding='utf-8')
        rel = f.relative_to(ROOT).as_posix()
        for m in CREATE.finditer(src):
            t = m.group(1)
            parts = split_top(body(src, m.end()))
            cols = [col(p) for p in parts if not CONSTRAINT.match(p)]
            keys = [re.sub(r'\s+', ' ', p) for p in parts if CONSTRAINT.match(p)]
            tables[t] = {'cols': cols, 'keys': keys, 'added': []}
            where[t] = rel
        for m in ALTER.finditer(src):
            t, c, typ, rest = m.group(1), m.group(2), m.group(3) or '', (m.group(4) or '').strip()
            if t in tables and not any(x.startswith(f'`{c}`') for x in tables[t]['cols'] + tables[t]['added']):
                tables[t]['added'].append(col(f'{c} {typ} {rest}'))
        found = set()
        for m in META_CALL.finditer(src):
            found.add(m.group(1))
        for m in META_SQL.finditer(src):
            found.add(m.group(1) or m.group(2))
        for m in META_LIST.finditer(src):
            found.update(re.findall(r'\'([\w:.-]+)\'', m.group(1)))
        for m in META_IN.finditer(src):
            found.update(re.findall(r'\\?\'([\w:.-]+)\\?\'', m.group(1)))
        for m in META_PREFIX.finditer(src):
            var, prefix = m.groups()
            if re.search(rf'(?:getMeta|setMeta|secFail|secLocked)\((?:env, *)?{var}\b', src):
                found.add(prefix + '*')
        for k in found:
            meta.setdefault(k, set()).add(rel)
    out = ['# База D1 и ключи meta', '',
           '_Собрано скриптом `python3 tools/docs/build_db.py` из CREATE TABLE / ALTER TABLE и обращений к meta в worker/*.js. Руками не править._', '',
           f'## Таблицы ({len(tables)})', '',
           'Обозначения: PK — первичный ключ, nn — NOT NULL, =x — DEFAULT x; «+» — столбцы, добавленные ALTER TABLE.', '']
    for t, d in tables.items():
        line = f'- **{t}** ({where[t]}): ' + ', '.join(d['cols'])
        if d['added']:
            line += '; + ' + ', '.join(d['added'])
        if d['keys']:
            line += '; ' + '; '.join(d['keys'])
        out.append(line)
    out += ['', f'## Ключи meta ({len(meta)})', '', 'Таблица `meta (key, value)`. Ключ → где используется.', '']
    for k in sorted(meta):
        out.append(f'- `{k}` — ' + ', '.join(sorted(meta[k])))
    OUT.write_text('\n'.join(out) + '\n', encoding='utf-8')
    print(f'{OUT.relative_to(ROOT)}: {len(tables)} таблиц, {len(meta)} ключей meta, {OUT.stat().st_size} байт')


if __name__ == '__main__':
    main()
