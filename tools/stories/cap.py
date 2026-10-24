#!/usr/bin/env python3
"""Снимки для сторис: птички, комната (cap.html) и огород (/garden/ с подставным /api) → _held/stories/src/*.png."""
import base64, functools, http.server, json, pathlib, threading
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
OUT = ROOT / '_held' / 'stories' / 'src'
OUT.mkdir(parents=True, exist_ok=True)

BIRDS = [(27, {'hat': 'beret:2', 'item': 'coffee', 'scarf': '#E0443A'}), (3, {'hat': 'witch', 'item': 'wand'}),
         (6, {'hat': 'crown:1', 'shoes': 'sneakers:1'}), (15, {'hat': 'chef', 'item': 'pancake'}),
         (4, {'hat': 'sunflowers', 'scarf': '#F6D04D'}), (11, {'hat': 'pirate', 'item': 'sword'}),
         (14, {'hat': 'kittyears', 'item': 'bubbletea'}), (2, {'hat': 'headset', 'shoes': 'boots:3'}),
         (37, {'hat': 'wizard', 'item': 'crystal'}), (40, {'hat': 'party:2'}), (8, {'hat': 'santa', 'item': 'giftbox'}), (24, {'hat': 'top:4', 'scarf': '#4A7BD8'})]

ROOM = {'wall': 'flowers', 'floor': 'herring', 'view': 'autumn', 'curtain': 'mustard', 'items': [
    {'k': 'furn', 'v': 'bookshelf:1', 'x': 8}, {'k': 'furn', 'v': 'sofa:2', 'x': 40}, {'k': 'furn', 'v': 'lamp:1', 'x': 90},
    {'k': 'furn', 'v': 'album', 'x': 104}, {'k': 'furn', 'v': 'plant:2', 'x': 128}, {'k': 'furn', 'v': 'cat', 'x': 140},
    {'k': 'furn', 'v': 'easel', 'x': 158}, {'k': 'furn', 'v': 'pumpkin', 'x': 180},
    {'k': 'deco', 'v': 'painting', 'x': 52, 'y': 30}, {'k': 'deco', 'v': 'clock', 'x': 96, 'y': 26}, {'k': 'deco', 'v': 'lights', 'x': 20, 'y': 6}]}

GARDEN = {'on': True, 'mine': True, 'owner': {'id': 27, 'nick': 'polly', 'avatar': {'hat': 'strawhat'}}, 'season': 'autumn', 'today': '2026-10-24',
          'beds': [{'p': 'pumpkin', 'k': 1, 'ready': True, 'wet': True}, {'p': 'carrot', 'k': .7, 'wet': True, 'today': True},
                   {'p': 'sunflower', 'k': 1, 'ready': True}, {'p': 'strawberry', 'k': .5, 'wet': True}, {'p': 'cabbage', 'k': .9, 'wet': True}, {'p': 'tulip', 'k': .3}],
          'seeds': {'radish': 2}, 'crop': {'carrot': 3}, 'prices': {}, 'bugs': [{'i': 0, 'bed': 1, 'x': .5}], 'bugsGot': 0, 'wetH': 24, 'harvests': 5, 'buttons': 120}


def save(name, url):
    (OUT / name).write_bytes(base64.b64decode(url.split(',', 1)[1]))


def serve(d):
    h = functools.partial(type('Q', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None}), directory=str(d))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f'http://127.0.0.1:{srv.server_port}'


def main():
    base, site = serve(ROOT), serve(ROOT / 'site')
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport={'width': 1200, 'height': 900})
        pg.on('pageerror', lambda e: print('ERR', e))
        pg.goto(base + '/tools/stories/cap.html')
        for i, (bid, av) in enumerate(BIRDS):
            save(f'bird-{i}.png', pg.evaluate('([i, a]) => CAP.bird(i, a)', [bid, av]))
        save('room.png', pg.evaluate('o => CAP.room(o)', {'id': 27, 'avatar': BIRDS[0][1], 'room': ROOM}))
        # огород: собранная страница, /api — подставной
        g = b.new_page(viewport={'width': 1200, 'height': 1000})
        g.clock.set_fixed_time('2026-10-24T11:00:00+03:00')
        g.route('**/api/**', lambda r: r.fulfill(json=GARDEN if '/api/garden' in r.request.url else {}))
        g.route('**/fonts.g*/**', lambda r: r.abort())
        g.on('pageerror', lambda e: print('ERR', e))
        g.goto(site + '/garden/')
        g.wait_for_selector('.gd-cv', timeout=8000); g.wait_for_timeout(1500)
        save('garden.png', g.evaluate("document.querySelector('.gd-cv').toDataURL()"))
        # страницы рисования: элементы как на сайте, EN и RU
        for lang, pre in (('en', ''), ('ru', '/ru')):
            for path, sel, name, clip in (('challenge', '.ch-cal .tearpad', 'challenge', None), ('polly-helps', '.ph-guide', 'helps', 760)):
                q = b.new_page(viewport={'width': 430, 'height': 1000}, device_scale_factor=2.5)
                q.clock.set_fixed_time('2026-10-24T11:00:00+03:00')
                q.route('**/api/**', lambda r: r.fulfill(json={}))
                q.goto(f'{site}{pre}/{path}/'); q.add_style_tag(content='.parade{display:none!important}'); q.wait_for_timeout(1500)
                el = q.locator(sel).first; el.scroll_into_view_if_needed(); q.wait_for_timeout(300)
                bb = el.bounding_box()
                if clip: bb['height'] = min(bb['height'], clip)
                q.screenshot(path=str(OUT / f'{name}-{lang}.png'), clip=bb)
                q.close()
        b.close()
    print('ok', sorted(x.name for x in OUT.iterdir()))


main()
