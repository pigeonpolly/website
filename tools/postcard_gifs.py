#!/usr/bin/env python3
"""Анимированные картинки открыток для писем: site/images/postcards/<id>.gif (docs/postcards.md).

  python3 tools/postcard_gifs.py            — все открытки из site/assets/postcard-designs.js
  python3 tools/postcard_gifs.py ny-tree    — только эти

Кадры снимает Playwright со страницы /postcards/?shot=<id> (тот же рисунок и анимация, что на сайте, без надписи —
надпись в письме своя, на языке письма), PIL собирает GIF-петлю. Нужен собранный site/ (python3 build.py).
"""
import http.server, json, pathlib, subprocess, sys, tempfile, threading, functools
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'site' / 'images' / 'postcards'
N, MS, WIDTH = 16, 250, 560  # 16 кадров × 250 мс = петля 4 с (LOOP в postcards.js)

JS = r"""
const { chromium } = require('playwright');
(async () => {
  const [port, dir, ids, n] = process.argv.slice(2), b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 420 } });
  await p.route('**/api/**', r => r.fulfill({ json: {} }));
  for (const id of ids.split(',')) {
    await p.goto(`http://127.0.0.1:${port}/postcards/?shot=${id}`); await p.waitForFunction(() => window.PPPostcard && PPPostcard.draw);
    await p.evaluate(id => PPPostcard.ready(id), id); await p.waitForTimeout(300);
    for (let i = 0; i < +n; i++) { await p.evaluate(t => PPPostcard.draw(t), i / +n); await p.locator('#pc-shot .pc-pic').screenshot({ path: `${dir}/${id}-${String(i).padStart(2, '0')}.png` }); }
  }
  await b.close();
})();
"""


def main():
    src = (ROOT / 'site/assets/postcard-designs.js').read_text(encoding='utf-8')
    import re
    ids = sys.argv[1:] or re.findall(r"\{ id: '([\w-]+)'", src)
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    handler = functools.partial(Quiet, directory=str(ROOT / 'site'))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        js = pathlib.Path(tmp) / 'shot.js'; js.write_text(JS)
        subprocess.run(['node', str(js), str(srv.server_address[1]), tmp, ','.join(ids), str(N)], check=True)
        for id_ in ids:
            frames = [Image.open(f).convert('RGB') for f in sorted(pathlib.Path(tmp).glob(f'{id_}-*.png'))]
            frames = [f.resize((WIDTH, round(WIDTH * f.height / f.width)), Image.LANCZOS) for f in frames]
            # общая палитра на все кадры — без мерцания цветов
            pal = frames[0].quantize(colors=255, method=Image.MEDIANCUT)
            q = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
            out = OUT / f'{id_}.gif'
            q[0].save(out, save_all=True, append_images=q[1:], duration=MS, loop=0, optimize=True, disposal=1)
            print(f'{out.relative_to(ROOT)}  {out.stat().st_size // 1024} КБ')
    srv.shutdown()


if __name__ == '__main__':
    main()
