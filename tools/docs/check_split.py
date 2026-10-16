#!/usr/bin/env python3
"""Сверка: ни одно предложение из docs/_claude-old.md не потерялось.

Каждая непустая строка исходника (кроме заголовков — они собраны в docs/history.md)
делится на предложения своим, более мелким разбиением; каждое предложение должно
дословно найтись в одном из docs/*.md (кроме самого исходника).
Пункты, которые сжаты в CLAUDE.md, проверяются по «опорным» кускам: всё в `коде`,
адреса и цвета #RRGGBB должны быть в CLAUDE.md или docs/basics.md.

Запуск: python3 tools/docs/check_split.py  (код выхода 1, если что-то потерялось)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
from split_claude_old import parse_spec, SPLIT, CLAUDE, SRC  # noqa: E402

SENT = re.compile(r'(?<=[.!?…])\s+')
MARK = re.compile(r'^\s*(?:- |\d+\. )')
KEY = re.compile(r'`[^`]+`|https?://\S+|#[0-9A-Fa-f]{6}\b')


def main():
    lines = SRC.read_text(encoding='utf-8').split('\n')
    docs = {p.name: p.read_text(encoding='utf-8') for p in (ROOT / 'docs').glob('*.md') if p.name != SRC.name}
    every = '\n'.join(docs.values())
    # сжатый общий раздел: CLAUDE.md + docs/basics.md
    claude = (ROOT / 'CLAUDE.md').read_text(encoding='utf-8') + (ROOT / 'docs' / 'basics.md').read_text(encoding='utf-8')
    spec = parse_spec()
    lost, sent_n, key_n = [], 0, 0
    for n, line in enumerate(lines, 1):
        if not line.strip():
            continue
        if line.startswith('#'):
            if f'`{line}`' not in docs.get('history.md', ''):
                lost.append((n, 'заголовок', line))
            continue
        # куски строки, ушедшие в CLAUDE.md (целиком или часть предложений)
        to_claude = spec.get(n) == CLAUDE
        body = MARK.sub('', line)
        if n in SPLIT:
            from split_claude_old import sentences
            ss = sentences(line)
            cl = [i for idx, dest, _ in SPLIT[n] if dest == CLAUDE for i in idx]
            for i in cl:
                for k in KEY.findall(ss[i]):
                    key_n += 1
                    if k.strip('`') not in claude:
                        lost.append((n, 'CLAUDE.md', k))
            body = MARK.sub('', ' '.join(s for i, s in enumerate(ss) if i not in cl))
        if to_claude:
            for k in KEY.findall(body):
                key_n += 1
                if k.strip('`') not in claude:
                    lost.append((n, 'CLAUDE.md', k))
            continue
        for s in SENT.split(body):
            s = s.strip()
            if not s:
                continue
            sent_n += 1
            if s not in every:
                lost.append((n, 'docs', s[:100]))
    print(f'предложений проверено: {sent_n}, опорных кусков CLAUDE.md: {key_n}, потеряно: {len(lost)}')
    for n, where, s in lost:
        print(f'  строка {n} [{where}]: {s}')
    big = (ROOT / 'CLAUDE.md').stat().st_size
    print(f'CLAUDE.md: {big} байт' + ('' if big <= 6144 else ' — БОЛЬШЕ 6 КБ!'))
    return 1 if lost or big > 6144 else 0


if __name__ == '__main__':
    sys.exit(main())
