#!/usr/bin/env python3
"""Снимки элемента страницы на нескольких ширинах (Playwright, Chromium из /opt/pw-browsers).

  tools/shots.py URL селектор [--w 390,1440] [--login dev:ник] [--check] [--base http://localhost:8787]

URL — полный адрес или путь от --base (по умолчанию $SHOTS_BASE или http://localhost:8787, wrangler dev).
Текстом печатает: ошибки консоли и страницы, горизонтальную прокрутку, элементы, вылезающие за край
окна или за выбранный элемент, размеры элемента. С --check — только текст.
Снимки и общий лист (не шире 1200 px) — в _shots/.
"""
import argparse
import os
import pathlib
import re
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / '_shots'
CHROMIUM = '/opt/pw-browsers/chromium'
SHEET_W = 1200

PROBE = """sel => {
  const W = document.documentElement.clientWidth;
  const root = document.querySelector(sel);
  const r = root && root.getBoundingClientRect();
  const out = [];
  const name = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') +
    (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\\s+/).slice(0, 2).join('.') : '');
  for (const e of (root || document.body).querySelectorAll('*')) {
    const b = e.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.position === 'fixed') continue;
    if (b.right > W + 1 || b.left < -1) out.push(`${name(e)} за краем окна: ${Math.round(b.left)}…${Math.round(b.right)} при ширине ${W}`);
    else if (r && root !== e && (b.right > r.right + 1 || b.left < r.left - 1) && getComputedStyle(root).overflowX === 'visible')
      out.push(`${name(e)} вылезает за ${sel}: ${Math.round(b.left)}…${Math.round(b.right)}, элемент ${Math.round(r.left)}…${Math.round(r.right)}`);
    if (out.length >= 15) break;
  }
  return { found: !!root, size: r ? [Math.round(r.width), Math.round(r.height)] : null,
    hscroll: document.documentElement.scrollWidth - W, bad: out };
}"""


def slug(s):
    return re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-')[:40] or 'page'


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('url')
    ap.add_argument('selector')
    ap.add_argument('--w', default='390,1440')
    ap.add_argument('--login')
    ap.add_argument('--check', action='store_true')
    ap.add_argument('--base', default=os.environ.get('SHOTS_BASE', 'http://localhost:8787'))
    a = ap.parse_args()
    url = a.url if re.match(r'https?://', a.url) else a.base.rstrip('/') + '/' + a.url.lstrip('/')
    widths = [int(x) for x in a.w.split(',') if x.strip()]
    tag = slug(a.url) + '_' + slug(a.selector)
    shots, problems = [], 0
    if not a.check:
        OUT.mkdir(exist_ok=True)

    with sync_playwright() as pw:
        exe = CHROMIUM if pathlib.Path(CHROMIUM).exists() else None
        br = pw.chromium.launch(executable_path=exe)
        for w in widths:
            ctx = br.new_context(viewport={'width': w, 'height': 900}, device_scale_factor=1)
            page = ctx.new_page()
            errs = []
            page.on('console', lambda m: m.type == 'error' and not m.text.startswith('Failed to load resource')
                    and errs.append('console: ' + m.text[:200]))
            page.on('response', lambda r: r.status >= 400 and errs.append(f'HTTP {r.status}: {r.url[:120]}'))
            page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)[:200]))
            page.on('requestfailed', lambda r: errs.append(f'request failed: {r.url[:120]} {r.failure}'))
            if a.login:
                page.goto(url, wait_until='domcontentloaded')
                st = page.evaluate("""c => fetch('/api/login', {method: 'POST', credentials: 'include',
                    headers: {'content-type': 'application/json'}, body: JSON.stringify({credential: c})}).then(r => r.status)""", a.login)
                if st != 200:
                    errs.append(f'login {a.login}: HTTP {st}')
            page.goto(url, wait_until='networkidle')
            page.wait_for_timeout(500)
            info = page.evaluate(PROBE, a.selector)
            print(f'— {w}px {url} {a.selector}')
            if not info['found']:
                print('  ! элемент не найден')
                problems += 1
            else:
                print(f'  размер {info["size"][0]}×{info["size"][1]}')
            if info['hscroll'] > 0:
                print(f'  ! горизонтальная прокрутка: +{info["hscroll"]} px')
                problems += 1
            for s in info['bad']:
                print('  ! ' + s)
            for e in errs:
                print('  ! ' + e)
            problems += len(info['bad']) + len(errs)
            if not a.check and info['found']:
                p = OUT / f'{tag}_{w}.png'
                page.locator(a.selector).first.screenshot(path=str(p))
                shots.append((w, p))
            ctx.close()

        if shots:
            sheet = OUT / f'{tag}_sheet.png'
            make_sheet(br, shots, sheet)
            print(f'снимки: {", ".join(str(p.relative_to(ROOT)) for _, p in shots)}')
            print(f'общий лист: {sheet.relative_to(ROOT)}')
        br.close()
    print('проблем нет' if not problems else f'проблем: {problems}')
    sys.exit(1 if problems else 0)


def make_sheet(br, shots, out):
    """Склеивает снимки в один лист шириной не больше SHEET_W (каждый — уменьшен до ширины колонки)."""
    import base64
    n = len(shots)
    col = SHEET_W // n - 16
    cells = ''.join(
        f'<figure><figcaption>{w}px</figcaption><img src="data:image/png;base64,'
        f'{base64.b64encode(p.read_bytes()).decode()}" style="max-width:{col}px"></figure>' for w, p in shots)
    html = ('<body style="margin:0;padding:8px;background:#fff;font:14px sans-serif;width:fit-content;max-width:'
            f'{SHEET_W - 16}px"><div id="sheet" style="display:flex;gap:16px;align-items:flex-start;padding:8px;background:#fff;width:fit-content">{cells}</div>'
            '<style>figure{margin:0}figcaption{margin-bottom:4px;color:#555}img{display:block;height:auto;border:1px solid #ddd}</style></body>')
    page = br.new_page(viewport={'width': SHEET_W, 'height': 800})
    page.set_content(html)
    page.wait_for_timeout(100)
    page.locator('#sheet').screenshot(path=str(out))
    page.close()


if __name__ == '__main__':
    main()
