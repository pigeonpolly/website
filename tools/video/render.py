#!/usr/bin/env python3
"""Видео для соцсетей (этап 15): кадры рисует tools/video/film.js в Chromium → PNG → ffmpeg → _held/video/*.mp4.

  tools/video/render.py            — три версии (EN, RU, LV), отличаются только финальной надписью
  tools/video/render.py --keys     — 4 ключевых кадра одним листом: _shots/video_keys.png
  tools/video/render.py --lang ru  — одна версия
  --film apple                     — второй ролик (Полли рисует яблоко, tools/video/apple.js); по умолчанию — блинчики (film.js)

Сайт не нужен: файлы отдаёт свой http-сервер из корня репозитория (птичка и комната — те же birds.js и room.js).
"""
import argparse
import base64
import functools
import http.server
import pathlib
import shutil
import subprocess
import tempfile
import threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
OUT = ROOT / '_held' / 'video'
CHROMIUM = '/opt/pw-browsers/chromium'
FPS = 30


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    h = functools.partial(Quiet, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


FILMS = {'pancakes': 'film.html', 'apple': 'apple.html'}  # ролик → страница; ключевые кадры и с какого кадра текст зависит от языка — FILM.keys, FILM.langFrom


def open_film(br, port, lang, film):
    page = br.new_page(viewport={'width': 400, 'height': 400})
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    page.goto(f'http://127.0.0.1:{port}/tools/video/{FILMS[film]}?lang={lang}', wait_until='load')
    page.evaluate('FILM.ready')
    if errs:
        raise SystemExit('ошибки на странице: ' + '; '.join(errs[:5]))
    return page


def png(page, n):
    return base64.b64decode(page.evaluate('n => FILM.frame(n)', n).split(',', 1)[1])


def keys(br, port, film):
    page = open_film(br, port, 'en', film)
    ts = page.evaluate('FILM.keys')
    cells = ''.join(f'<img src="data:image/png;base64,{base64.b64encode(png(page, round(t * FPS))).decode()}">' for t in ts)
    sheet = br.new_page(viewport={'width': 1200, 'height': 800})
    sheet.set_content(f'<body style="margin:0"><div id="s" style="display:grid;grid-template-columns:repeat({len(ts)},1fr);gap:8px;padding:8px;'
                      f'width:1184px;background:#fff">{cells}</div><style>img{{width:100%;display:block}}</style></body>')
    out = ROOT / '_shots' / ('video_keys.png' if film == 'pancakes' else f'video_keys_{film}.png')
    out.parent.mkdir(exist_ok=True)
    sheet.locator('#s').screenshot(path=str(out))
    print('лист:', out.relative_to(ROOT))


def video(br, port, langs, film):
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = pathlib.Path(tempfile.mkdtemp(prefix='ppvideo-'))
    try:
        page = open_film(br, port, 'en', film)
        total, fin = page.evaluate('[FILM.frames, FILM.langFrom]')
        common = tmp / 'common'
        common.mkdir()
        for n in range(fin):  # до langFrom кадры у всех языков одинаковые
            (common / f'{n:04d}.png').write_bytes(png(page, n))
        for lang in langs:
            d = tmp / lang
            d.mkdir()
            for f in common.iterdir():
                (d / f.name).symlink_to(f)
            p = page if lang == 'en' else open_film(br, port, lang, film)
            for n in range(fin, total):
                (d / f'{n:04d}.png').write_bytes(png(p, n))
            mp4 = OUT / f'pigeonpolly-bird-{film}-{lang}.mp4'
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(d / '%04d.png'),
                            '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', '-an', str(mp4)], check=True)
            print(f'{mp4.relative_to(ROOT)}: {total / FPS:.1f} с, {mp4.stat().st_size // 1024} КБ')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--keys', action='store_true')
    ap.add_argument('--lang')
    ap.add_argument('--film', choices=FILMS, default='pancakes')
    a = ap.parse_args()
    srv = serve()
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path=CHROMIUM if pathlib.Path(CHROMIUM).exists() else None)
        if a.keys:
            keys(br, srv.server_address[1], a.film)
        else:
            video(br, srv.server_address[1], [a.lang] if a.lang else ['en', 'ru', 'lv'], a.film)
        br.close()
    srv.shutdown()


if __name__ == '__main__':
    main()
