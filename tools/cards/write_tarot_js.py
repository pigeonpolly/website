# Записывает site/assets/tarot.js со списком ключей колоды.
import io, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tarot_content import CARDS  # noqa: E402

keys = [c[0] for c in CARDS]
JS = """// Птичье таро — колода в шапке: одна карта в сутки, счёт по браузеру (pp_tarot).
// Картинки: site/images/cards/tarot-2027/<ключ>-<en|ru|lv>.png (120x206, пиксель).
(() => {
  const KEYS = __KEYS__;
  const lang = document.documentElement.lang || 'en';
  const L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const LANGS = ['en', 'ru', 'lv'];
  const T = {
    open: ['Open the card', 'Открыть карту', 'Atvērt karti'],
    today: ['Your card for today', 'Твоя карта на сегодня', 'Tava karte šodienai'],
    tomorrow: ['A new card — tomorrow', 'Новая карта — завтра', 'Jauna karte — rīt'],
    aria: ['Bird tarot — one card a day', 'Птичье таро — карта раз в сутки', 'Putnu tarots — viena karte dienā'],
    close: ['Close', 'Закрыть', 'Aizvērt']
  };
  const t = k => T[k][L];
  const dayKey = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  const cardUrl = i => '/images/cards/tarot-2027/' + KEYS[i] + '-' + LANGS[L] + '.png';

  let st = null;
  try { st = JSON.parse(localStorage.getItem('pp_tarot') || 'null'); } catch (e) { st = null; }
  const hasToday = () => !!(st && st.d === dayKey() && typeof st.i === 'number' && KEYS[st.i]);

  const deck = document.getElementById('td');
  const btn = document.getElementById('td-b');
  const badge = document.getElementById('td-n');
  if (!deck || !btn) return;
  deck.hidden = false;
  btn.setAttribute('aria-label', t('aria'));
  if (badge) badge.hidden = hasToday();
  if (hasToday()) deck.classList.add('is-done');

  let modal = null;
  const q = s => modal.querySelector(s);

  function build() {
    modal = document.createElement('div');
    modal.className = 'tdm';
    modal.id = 'tdm';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="tdm-bg" data-td-close></div>' +
      '<div class="tdm-w" role="dialog" aria-modal="true" aria-label="' + t('aria') + '">' +
      '<button type="button" class="tdm-x" data-td-close aria-label="' + t('close') + '">✕</button>' +
      '<div class="tdm-card"><div class="tdm-back"></div><div class="tdm-face"><img alt=""></div></div>' +
      '<p class="tdm-t"></p><p class="tdm-s"></p>' +
      '<button type="button" class="tdm-go"></button>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target.closest('[data-td-close]')) close(); });
    q('.tdm-go').addEventListener('click', draw);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  }

  function open() {
    if (!modal) build();
    const card = q('.tdm-card'), img = q('.tdm-face img'), go = q('.tdm-go');
    card.classList.remove('is-open');
    img.removeAttribute('src');
    go.hidden = true;
    if (hasToday()) {
      img.src = cardUrl(st.i);
      card.classList.add('is-open');
      q('.tdm-t').textContent = t('today');
      q('.tdm-s').textContent = t('tomorrow');
    } else {
      q('.tdm-t').textContent = t('aria');
      q('.tdm-s').textContent = '';
      go.hidden = false;
      go.textContent = t('open');
      modal.classList.remove('shake');
      void modal.offsetWidth;
      modal.classList.add('shake');
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    q('.tdm-x').focus();
  }

  function close() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    btn.focus();
  }

  function draw() {
    const seen = (st && Array.isArray(st.seen)) ? st.seen.filter(i => typeof i === 'number' && i >= 0 && i < KEYS.length) : [];
    let pool = KEYS.map((_, i) => i).filter(i => seen.indexOf(i) < 0);
    if (!pool.length) pool = KEYS.map((_, i) => i);
    const i = pool[Math.floor(Math.random() * pool.length)];
    st = { d: dayKey(), i: i, seen: pool.length === 1 || seen.length >= KEYS.length ? [i] : seen.concat([i]) };
    try { localStorage.setItem('pp_tarot', JSON.stringify(st)); } catch (e) {}
    if (badge) badge.hidden = true;
    deck.classList.add('is-done');
    q('.tdm-face img').src = cardUrl(i);
    q('.tdm-card').classList.add('is-open');
    q('.tdm-t').textContent = t('today');
    q('.tdm-s').textContent = t('tomorrow');
    q('.tdm-go').hidden = true;
  }

  btn.addEventListener('click', open);
})();
"""
out = os.path.join(HERE, '..', '..', 'site', 'assets', 'tarot.js')
io.open(out, 'w', encoding='utf-8', newline='\n').write(JS.replace('__KEYS__', json.dumps(keys, ensure_ascii=False)))
print('ok', len(keys))
