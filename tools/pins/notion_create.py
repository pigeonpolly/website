# Создать страницы в Notion «🐸 ENG Media…» одним скриптом (ключ интеграции «Pigeon Polly» подставляет прокси).
# python3 tools/pins/notion_create.py pages.json — [{properties:{...как в notion-create-pages}, content:"![](url)\n\nTopics: …"}]
import json, sys, time, urllib.request
DS = '69634395-245b-8362-aa6e-07febe1124f0'
H = {"Notion-Version": "2025-09-03", "Authorization": "Bearer proxy-injected", "Content-Type": "application/json"}
SEL = {'Pin Board', 'Тип', 'Сезон', 'Праздник'}; TXT = {'Pin Title', 'Pin Description', 'Pin Alt Text', 'Facebook Post Text'}
def rt(s): return [{"text": {"content": s[i:i + 1900]}} for i in range(0, len(s), 1900)]
def props(p):
    o = {}
    for k, v in p.items():
        if k == 'Номер пина и его содержимое': o[k] = {"title": rt(v)}
        elif k in SEL: o[k] = {"select": {"name": v}}
        elif k in TXT: o[k] = {"rich_text": rt(v)}
        elif k.startswith('Pin Link'): o[k] = {"url": v}
        elif v in ('__YES__', '__NO__'): o[k] = {"checkbox": v == '__YES__'}
    return o
def body(c):
    img, _, rest = c.partition('\n\n'); url = img[img.index('(') + 1:-1]
    return [{"type": "image", "image": {"type": "external", "external": {"url": url}}}, {"type": "paragraph", "paragraph": {"rich_text": rt(rest)}}]
ok, fail = 0, []
for x in json.load(open(sys.argv[1])):
    data = json.dumps({"parent": {"type": "data_source_id", "data_source_id": DS}, "properties": props(x['properties']), "children": body(x['content'])}).encode()
    for t in range(4):
        try:
            urllib.request.urlopen(urllib.request.Request("https://api.notion.com/v1/pages", data=data, headers=H, method='POST'), timeout=30).read(); ok += 1; break
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500: time.sleep(2 * (t + 1)); continue
            fail.append((x['properties']['Номер пина и его содержимое'][:6], e.code, e.read()[:300])); break
    time.sleep(0.34)
print('ok', ok, 'fail', len(fail)); print(fail[:3])
