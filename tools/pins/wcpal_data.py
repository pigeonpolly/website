# Данные 100 пинов «акварельная палитра» №1310–1409 → tools/pins/wcpal.json (заголовок, описание, alt, ссылка, темы)
import json, colorsys, random
ROOT = __file__.rsplit('/tools/', 1)[0]
PAL = json.load(open(f'{ROOT}/content/palettes.json'))
SKIP = {  # уже был (1309), новости/война, арты с надписями, ч/б карандаш, инфографика
    '2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes',
    '2026-pigeon-polly-and-rat-tuna-are-scared-of-last-news-about-drones-and-hantavirus', '2023-pigeon-polly-against-war',
    '2026-pigeon-polly-seven-years-later', '2022-pigeon-polly-celebrates-dia-de-muertos', '2024-mr-chew-celebrates-new-year',
    '2024-mr-chew-celebrates-valentines-day', '2023-mr-chew-coffee-passion', 'sketchbook-1', 'sketchbook-2', 'sketchbook-3',
    'studio-chars', 'sketchbook-10',  # sketchbook-10 = тот же Пуаро, что studio-poirot
    'studio-myth_beach', 'studio-myth_read', 'studio-myth_worm', 'studio-finland'}
GAL = ('bird', 'snail', 'sketchbook', 'halloween', 'detective', 'challenge', 'studio')
arts = [p for p in PAL if (p['gallery'] in GAL and p['key'] not in SKIP) or p['key'] == 'details-rainy-tram-street']
random.Random(1310).shuffle(arts)
assert len(arts) == 100, len(arts)

WHAT = {'bird': 'my watercolor of Pigeon Polly', 'snail': 'my painting of Mr. Chew the snail', 'sketchbook': 'a page of my sketchbook',
        'halloween': 'my Halloween portrait', 'detective': 'my detective painting', 'challenge': 'my daily challenge sketch', 'studio': 'my painting', 'details': 'my sketch'}


def mood(cols):
    hls = [colorsys.rgb_to_hls(*(int(c['hex'][i:i + 2], 16) / 255 for i in (1, 3, 5))) for c in cols]
    L = sum(h[1] for h in hls) / len(hls)
    S = sum(h[2] for h in hls) / len(hls)
    warm = sum(1 for h, l, s in hls if (h < 0.17 or h > 0.9) and s > 0.2)
    cool = sum(1 for h, l, s in hls if 0.4 < h < 0.75 and s > 0.15)
    if L > 0.68: return 'soft pastel', 'Pastel'
    if L < 0.38: return 'dark and moody', 'Moody'
    if warm >= 4: return 'warm cozy', 'Cozy'
    if cool >= 3: return 'cool calm', 'Calm'
    if S < 0.3: return 'muted earthy', 'Earthy'
    if S > 0.55: return 'bright cheerful', 'Bright'
    return 'balanced', 'Balanced'


T_TITLE = [
    '{M} Watercolor Color Palette: {a}, {b} and {c}',
    '{t} — a {m} color palette from my painting',
    '{M} color palette inspiration: {a} + {b}',
    '6-color {m} palette from “{t}”',
    'Watercolor swatches: {a}, {b}, {c} and more',
    '{M} color scheme from a real painting: {t}',
    'A {m} palette for your next painting: {t}',
    '{a} and {b}: {m} color combination',
]
T_DESC = [
    'A {m} color palette picked straight from {w} “{t}”: {all}. Six colors that already work together, so you can paint, design or decorate with them. All HEX codes are free on pigeonpolly.com.',
    'Colors from {w} “{t}”, painted as watercolor swatches: {all}. Save it for your sketchbook, your next illustration or a {m} mood board. Copy the HEX codes on pigeonpolly.com.',
    'Not a random generator: this {m} palette comes from a real painting, {w} “{t}”. {all}. Find the HEX codes and 170 more palettes from my art on pigeonpolly.com.',
    'Need colors that go together? Here are the six from {w} “{t}”: {all}. A {m} combination for watercolor, gouache or digital art. HEX codes on pigeonpolly.com.',
]
out = []
for i, p in enumerate(arts):
    n = 1310 + i
    cs = p['colors']
    names = [c['en'] for c in cs]
    m, M = mood(cs)
    t = p['title']['en']
    k = dict(m=m, M=M, t=t, a=names[0], b=names[1], c=names[2], w=WHAT[p['gallery']], all=', '.join(names[:-1]) + ' and ' + names[-1])
    title = T_TITLE[i % len(T_TITLE)].format(**k)
    if len(title) > 100: title = T_TITLE[2].format(**k)
    out.append({
        'n': n, 'key': p['key'], 'layout': 'top' if i % 2 == 0 else 'bottom', 'title': title[:100],
        'desc': T_DESC[i % len(T_DESC)].format(**k),
        'alt': f'Six watercolor swatches ({", ".join(names)}) {"above" if i % 2 == 0 else "below"} “{t}”, {WHAT[p["gallery"]].replace("my ", "a ").replace("a page of a", "a page of a")} by Pigeon Polly.',
        'link': f'https://www.pigeonpolly.com/palettes/?utm_source=pinterest&utm_campaign=wcpal&utm_content=pin-{n}#{p["key"]}',
        'topics': f'Watercolor palette, {m.capitalize()} color palette, Color combinations, Color palette inspiration, Watercolor swatches',
        'hex': [c['hex'] for c in cs],
    })
json.dump(out, open(f'{ROOT}/tools/pins/wcpal.json', 'w'), ensure_ascii=False, indent=1)
print(len(out), max(len(o['title']) for o in out))
for o in out[:8]: print(o['n'], o['title'], '|', o['desc'][:90])
