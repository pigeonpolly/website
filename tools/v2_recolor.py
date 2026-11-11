#!/usr/bin/env python3
"""Редизайн 2.0, часть Д: убирает фиолетовые тона из CSS старых страниц.

  tools/v2_recolor.py site/assets/style.css [--dry]

Основные цвета → переменные сезона с прежним цветом запасным (#2B1A51 → var(--pp-ink,#2B1A51)…),
задаются в v2-shell.css (body.v2s). Остальные сиреневые/фиолетовые фоны и подписи (насыщенность < .5)
→ тёплый графит той же светлоты. Яркие фиолетовые (вещи, пиксели) не трогает. Повторный запуск безопасен.
"""
import colorsys, re, sys

VARS = {'2B1A51': '--pp-ink', '1A1528': '--pp-deep', '534AB7': '--pp-2', '36235F': '--pp-card', 'F0A987': '--pp-acc'}
HUE = 25 / 360   # тёплый графит, как --gr сезонов
SAT = 0.07

def purple(r, g, b):
    H, L, S = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return 0.62 < H < 0.86 and S > 0.12 and (S < 0.5 or L < 0.2 or L > 0.85), L, S

def neutral(r, g, b):
    ok, L, S = purple(r, g, b)
    nr, ng, nb = colorsys.hls_to_rgb(HUE, L, min(SAT, S) if L < 0.85 else 0.12)
    return round(nr * 255), round(ng * 255), round(nb * 255)

def fix(s):
    def hexrep(m):
        h = m.group(1).upper()
        if re.search(r'var\(--pp-[a-z0-9-]+,\s*$', s[max(0, m.start() - 24):m.start()]):
            return m.group(0)            # уже запасной цвет переменной
        if h in VARS:
            return f'var({VARS[h]},#{h})'
        r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
        if not purple(r, g, b)[0]:
            return m.group(0)
        return '#%02X%02X%02X' % neutral(r, g, b)
    s = re.sub(r'#([0-9A-Fa-f]{6})\b', hexrep, s)
    def rgbrep(m):
        r, g, b = int(m.group(2)), int(m.group(3)), int(m.group(4))
        if not purple(r, g, b)[0]:
            return m.group(0)
        nr, ng, nb = neutral(r, g, b)
        return f'{m.group(1)}({nr}, {ng}, {nb}'
    return re.sub(r'(rgba?)\(\s*(\d+),\s*(\d+),\s*(\d+)', rgbrep, s)

if __name__ == '__main__':
    p = sys.argv[1]
    old = open(p, encoding='utf-8').read()
    new = fix(old)
    n = sum(a != b for a, b in zip(old.splitlines(), new.splitlines()))
    print(f'{p}: изменено строк {n}')
    if '--dry' not in sys.argv:
        open(p, 'w', encoding='utf-8').write(new)
