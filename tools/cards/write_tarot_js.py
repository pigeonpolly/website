# Записывает в site/assets/tarot.js список ключей колоды. Остальной код файла не трогает:
# меняется только строка `const KEYS = [...]`, чтобы правки окна (лимит, сброс, карточка-шутка) не терялись.
import io, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tarot_content import CARDS  # noqa: E402

keys = [c['key'] for c in CARDS]
out = os.path.join(HERE, '..', '..', 'site', 'assets', 'tarot.js')
src = io.open(out, encoding='utf-8').read()
pat = re.compile(r'  const KEYS = \[[^\]]*\];')
if not pat.search(src):
    raise SystemExit('в tarot.js не нашёл строку «const KEYS = [...]»')
src = pat.sub(lambda m: '  const KEYS = ' + json.dumps(keys, ensure_ascii=False) + ';', src, count=1)
io.open(out, 'w', encoding='utf-8', newline='\n').write(src)
print('ok', len(keys))
