// Птичье таро — колода в шапке: одна карта в час, счёт по браузеру (pp_tarot).
// Через час можно открыть новую; лимит сбрасывается за пуговки (POST /api/tarot/reset, сколько стоит — /api/whoami → tarot).
// 10 нажатий «Открыть карту», пока лимит ещё идёт, — карточка-шутка «дырка» (/images/cards/tarot-2027/hole-<язык>.png).
// Картинки: site/images/cards/tarot-2027/<ключ>-<en|ru|lv>.png (160x270, пиксель).
(() => {
  const KEYS = ["feeder", "tit", "sparrow", "magpie", "bullfinch", "dove", "owl", "woodpecker", "seagull", "penguin", "crow", "starling", "stork", "swan", "cuckoo", "nightingale", "thrush", "siskin", "goldfinch", "crossbill", "waxwing", "nuthatch", "rook", "lark", "bluetit", "fir", "garland", "olivier", "tangerine", "snowman", "rink", "gift", "postcard", "candle", "mittens", "scarf", "cocoa", "cookie", "chimes", "wish", "firework", "cracker", "bauble", "topstar", "flake", "icicle", "skis", "sled", "gingerbread", "sock", "robin", "jay", "raven", "eagleowl", "wader", "gull", "heron", "crane", "puffin", "pelican", "hummingbird", "flamingo", "parrot", "canary", "rooster", "hen", "goose", "duck", "drake", "eagle", "roof", "silence", "slice", "seat", "mug", "tram", "noplan", "sleep", "news", "socks", "mandarin", "mitten", "snow", "firsmell", "chores", "cat", "angel", "firstsnow", "home", "wind", "neighbour", "flock", "feather", "nest", "flight", "morning", "envy", "time", "ny", "together"];
  const lang = document.documentElement.lang || 'en';
  const L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const LANGS = ['en', 'ru', 'lv'];
  // {n} — сколько минут осталось
  const T = {
    open: ['Open the card', 'Открыть карту', 'Atvērt karti'],
    card: ['Your card', 'Твоя карта', 'Tava karte'],
    ready: ['You can open a new one', 'Можно открыть новую', 'Vari atvērt jaunu'],
    next: ['A new card in {n} min', 'Новая карта через {n} мин', 'Jauna karte pēc {n} min'],
    early: ['Too soon! {n} min to go', 'Рано! Ещё {n} мин', 'Par agru! Vēl {n} min'],
    reset: ['Reset the limit · {n} 🔘', 'Сбросить лимит · {n} 🔘', 'Atiestatīt limitu · {n} 🔘'],
    resetFree: ['Reset the limit', 'Сбросить лимит', 'Atiestatīt limitu'],
    guest: ['Sign in to reset the limit with buttons', 'Войди, чтобы сбросить лимит за пуговки', 'Ienāc, lai atiestatītu limitu par pogām'],
    poor: ['Not enough buttons', 'Не хватает пуговок', 'Nepietiek pogu'],
    err: ['Something went wrong, try again', 'Не получилось, попробуй ещё раз', 'Neizdevās, mēģini vēlreiz'],
    hole: ['Polly says', 'Полли говорит', 'Pollijs saka'],
    save: ['Download the card', 'Скачать карту', 'Lejupielādēt karti'],
    share: ['Share', 'Поделиться', 'Dalīties'],
    invite: ['Draw your card', 'Вытяни свою карту', 'Izvelc savu karti'],
    failPic: ['Could not make the picture — try again', 'Не получилось собрать картинку — попробуй ещё раз', 'Neizdevās izveidot attēlu — mēģini vēlreiz'],
    aria: ['Bird tarot — one card an hour', 'Птичье таро — карта раз в час', 'Putnu tarots — viena karte stundā'],
    close: ['Close', 'Закрыть', 'Aizvērt']
  };
  const t = k => T[k][L];
  const txt = (k, n) => t(k).replace('{n}', n);
  // сколько стоит сброс и через сколько часов новая карта — из «📜 Правил» (через /api/whoami); до ответа — 1 час и 1 пуговка
  const CFG = { hour: 1, reset: 1 };
  const hourMs = () => Math.max(1, CFG.hour) * 3600000;
  const minutes = ms => Math.max(1, Math.ceil(ms / 60000));
  const cardUrl = i => '/images/cards/tarot-2027/' + KEYS[i] + '-' + LANGS[L] + '.png';
  const holeUrl = '/images/cards/tarot-2027/hole-' + LANGS[L] + '.png';

  let st = null;
  try { st = JSON.parse(localStorage.getItem('pp_tarot') || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object') st = {};
  if (!Array.isArray(st.seen)) st.seen = [];
  if (typeof st.p !== 'number' || st.p < 0) st.p = 0;
  // старое «раз в сутки» хранило только день (d): последнюю карту оставляем, лимит считаем истёкшим
  if (!st.t && typeof st.i === 'number' && KEYS[st.i]) st.t = 1; // давно — лимит истёк
  const hasCard = () => typeof st.i === 'number' && !!KEYS[st.i] && !!st.t;
  const leftMs = () => (st.t ? Math.max(0, st.t + hourMs() - Date.now()) : 0);
  const save = () => { try { localStorage.setItem('pp_tarot', JSON.stringify(st)); } catch (e) {} };

  const deck = document.getElementById('td');
  const btn = document.getElementById('td-b');
  const badge = document.getElementById('td-n');
  if (!deck || !btn) return;
  deck.hidden = false;
  btn.setAttribute('aria-label', t('aria'));

  let modal = null, holeShown = false, timer = 0, tick = 0, busy = false;
  const q = s => modal.querySelector(s);
  const canSystemShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  function sync() {
    const ready = leftMs() <= 0;
    if (badge) badge.hidden = !ready;
    deck.classList.toggle('is-done', !ready);
  }
  // когда час пройдёт — сам вернуть значок «можно открыть» (страница может висеть открытой)
  function schedule() {
    clearTimeout(timer);
    sync();
    const ms = leftMs();
    if (ms > 0) timer = setTimeout(() => { schedule(); if (modal && !modal.hidden) { if (leftMs() <= 0) { holeShown = false; refresh(); } } }, Math.min(ms + 800, 600000));
  }

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
      '<div class="tdm-btns"><button type="button" class="tdm-go"></button><button type="button" class="tdm-reset" hidden></button></div>' +
      '<div class="tdm-share" hidden><button type="button" class="tdm-dl"></button><button type="button" class="tdm-share-b" hidden></button></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target.closest('[data-td-close]')) close(); });
    q('.tdm-go').addEventListener('click', poke);
    q('.tdm-reset').addEventListener('click', resetLimit);
    q('.tdm-dl').textContent = '⬇ ' + t('save');
    const sb = q('.tdm-share-b');
    sb.textContent = '📤 ' + t('share');
    sb.hidden = !canSystemShare();
    q('.tdm-dl').addEventListener('click', downloadCard);
    sb.addEventListener('click', shareCard);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  }

  function resetLabel() {
    return CFG.reset > 0 ? txt('reset', CFG.reset) : t('resetFree');
  }
  function refresh() {
    const left = leftMs();
    const go = q('.tdm-go'), res = q('.tdm-reset'), img = q('.tdm-face img');
    go.hidden = false;
    go.textContent = t('open');
    if (holeShown && left > 0) { // карточку-шутку не затираем, пока идёт лимит
      q('.tdm-t').textContent = t('hole');
      q('.tdm-s').textContent = txt('next', minutes(left));
      res.hidden = false; res.textContent = resetLabel();
      syncShare();
      return;
    }
    holeShown = false;
    if (hasCard()) {
      const card = q('.tdm-card'), src = cardUrl(st.i);
      if (img.getAttribute('src') !== src) { // после карточки-шутки возвращаем свою карту
        card.classList.remove('is-open');
        void card.offsetWidth;
        img.src = src;
        card.classList.add('is-open');
      } else card.classList.add('is-open');
    } else {
      img.removeAttribute('src');
      q('.tdm-card').classList.remove('is-open');
    }
    if (left <= 0) {
      q('.tdm-t').textContent = hasCard() ? t('card') : t('aria');
      q('.tdm-s').textContent = hasCard() ? t('ready') : '';
      res.hidden = true;
    } else {
      q('.tdm-t').textContent = t('card');
      q('.tdm-s').textContent = txt('next', minutes(left));
      res.hidden = false; res.textContent = resetLabel();
    }
    syncShare();
  }

  function open() {
    if (!modal) build();
    holeShown = false;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    sync();
    refresh();
    if (leftMs() <= 0) { modal.classList.remove('shake'); void modal.offsetWidth; modal.classList.add('shake'); }
    q('.tdm-x').focus();
    clearInterval(tick);
    tick = setInterval(() => {
      if (!modal || modal.hidden) { clearInterval(tick); return; }
      if (leftMs() > 0) { if (!holeShown) q('.tdm-s').textContent = txt('next', minutes(leftMs())); }
      else if (holeShown || q('.tdm-s').textContent !== t('ready')) { holeShown = false; refresh(); }
    }, 20000);
  }

  function close() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    clearInterval(tick);
    btn.focus();
  }

  function newCard() {
    const seen = st.seen.filter(i => typeof i === 'number' && i >= 0 && i < KEYS.length);
    let pool = KEYS.map((_, i) => i).filter(i => seen.indexOf(i) < 0);
    if (!pool.length) pool = KEYS.map((_, i) => i);
    const i = pool[Math.floor(Math.random() * pool.length)];
    st = { t: Date.now(), i: i, seen: pool.length === 1 || seen.length >= KEYS.length ? [i] : seen.concat([i]), p: 0 };
    save();
    holeShown = false;
    const card = q('.tdm-card'), img = q('.tdm-face img');
    card.classList.remove('is-open');
    void card.offsetWidth;
    img.src = cardUrl(i);
    card.classList.add('is-open');
    q('.tdm-t').textContent = t('card');
    q('.tdm-s').textContent = txt('next', minutes(leftMs()));
    q('.tdm-reset').hidden = false;
    q('.tdm-reset').textContent = resetLabel();
    syncShare();
    schedule();
  }

  function poke() {
    const left = leftMs();
    if (left <= 0) { newCard(); return; }
    st.p = (Number(st.p) || 0) + 1;
    if (st.p >= 10) { st.p = 0; save(); showHole(); return; }
    save();
    modal.classList.remove('shake'); void modal.offsetWidth; modal.classList.add('shake');
    q('.tdm-s').textContent = txt('early', minutes(left));
  }

  // 10 нажатий впустую — Полли предупреждает про дырку (карточка-шутка, в колоду не входит)
  function showHole() {
    holeShown = true;
    const card = q('.tdm-card'), img = q('.tdm-face img');
    card.classList.remove('is-open');
    void card.offsetWidth;
    img.src = holeUrl;
    card.classList.add('is-open');
    q('.tdm-t').textContent = t('hole');
    q('.tdm-s').textContent = txt('next', minutes(leftMs()));
    q('.tdm-reset').hidden = false;
    q('.tdm-reset').textContent = resetLabel();
    syncShare();
  }

  // сброс лимита за пуговки: платит сервер (POST /api/tarot/reset), сразу открываем новую карту
  async function resetLimit() {
    const b = q('.tdm-reset');
    if (b.disabled) return;
    b.disabled = true; b.textContent = '…';
    let ok = false;
    try {
      const r = await fetch('/api/tarot/reset', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        ok = true;
        if (window.PPAccount && window.PPAccount.setButtons && typeof j.buttons === 'number') window.PPAccount.setButtons(j.buttons);
        newCard();
      } else if (r.status === 401) {
        close();
        if (window.PPToast) window.PPToast(t('guest'));
        if (window.PPAccount && window.PPAccount.openSignIn) window.PPAccount.openSignIn();
      } else if (r.status === 402) q('.tdm-s').textContent = t('poor');
      else q('.tdm-s').textContent = t('err');
    } catch (e) { q('.tdm-s').textContent = t('err'); }
    b.disabled = false;
    if (!ok) b.textContent = resetLabel();
  }

  // ---------- поделиться выпавшей картой: скачать картинку 1080×1920 (карта 5× + адрес сайта) ----------
  const rnd = i => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };
  function faceSrc() { const img = q('.tdm-face img'); return (img && img.getAttribute('src')) || ''; }
  function syncShare() { const row = q('.tdm-share'); if (row) row.hidden = !faceSrc(); }
  function shareName() {
    const key = faceSrc().indexOf('/hole-') >= 0 ? 'hole' : (KEYS[st.i] || 'card');
    return 'pigeonpolly-tarot-' + key + '-' + LANGS[L] + '.png';
  }
  const loadImg = src => new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im); im.onerror = rej; im.src = src;
    if (im.decode) im.decode().then(() => res(im)).catch(() => {});
  });
  async function cardBlob() {
    const src = faceSrc();
    if (!src) return null;
    const im = await loadImg(src);
    try { await Promise.race([document.fonts && document.fonts.ready, new Promise(r => setTimeout(r, 1200))]); } catch (e) {}
    const W = 1080, H = 1920, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    if (!g) return null;
    g.imageSmoothingEnabled = false;
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#120A2A'); bg.addColorStop(.55, '#2B1A51'); bg.addColorStop(1, '#45287A');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 220; i++) { // звёзды — как на карточке птички
      const s = rnd(i + 7) < .85 ? 4 : 8, x = Math.round(rnd(i) * W / 4) * 4, y = Math.round(rnd(i + 99) * H / 4) * 4;
      g.fillStyle = rnd(i + 3) < .25 ? '#F5D547' : rnd(i + 5) < .5 ? '#F3EFFA' : '#B9A8E8';
      g.globalAlpha = .35 + rnd(i + 11) * .65; g.fillRect(x, y, s, s);
    }
    g.globalAlpha = 1;
    const cx = W / 2, cy = 845;
    const glow = g.createRadialGradient(cx, cy, 150, cx, cy, 700);
    glow.addColorStop(0, 'rgba(155,93,229,.4)'); glow.addColorStop(1, 'rgba(155,93,229,0)');
    g.fillStyle = glow; g.beginPath(); g.arc(cx, cy, 700, 0, 7); g.fill();
    const cw = 800, ch = 1350, x0 = (W - cw) / 2, y0 = 170; // 160×270 → 800×1350, ровно 5×
    g.save();
    g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 48; g.shadowOffsetY = 26;
    g.drawImage(im, x0, y0, cw, ch);
    g.restore();
    g.strokeStyle = 'rgba(246,236,217,.22)'; g.lineWidth = 2; g.strokeRect(x0 - 1, y0 - 1, cw + 2, ch + 2);
    g.textAlign = 'center';
    g.fillStyle = '#E9C14A'; g.font = '700 30px Karla, Arial, sans-serif';
    if (g.letterSpacing !== undefined) g.letterSpacing = '9px';
    g.fillText('PIGEON POLLY', cx, 116);
    if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
    g.fillStyle = '#E9C14A'; g.fillRect(cx - 70, 1588, 140, 3);
    g.fillStyle = '#F6ECD9'; g.font = '700 34px Karla, Arial, sans-serif';
    g.fillText(t('invite'), cx, 1652);
    g.fillStyle = '#F5D547'; g.font = '700 46px Karla, Arial, sans-serif';
    g.fillText('pigeonpolly.com', cx, 1732);
    return new Promise(r => c.toBlob(r, 'image/png'));
  }
  const saveBlob = b => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = shareName();
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  };
  function shareBusy(on) {
    const dl = q('.tdm-dl'), sb = q('.tdm-share-b');
    if (dl) dl.disabled = on;
    if (sb) sb.disabled = on;
  }
  async function downloadCard() {
    if (busy) return;
    busy = true; shareBusy(true);
    try { const b = await cardBlob(); if (!b) throw new Error('no blob'); saveBlob(b); }
    catch (e) { if (window.PPToast) window.PPToast(t('failPic')); }
    busy = false; shareBusy(false);
  }
  async function shareCard() {
    if (busy) return;
    busy = true; shareBusy(true);
    let b = null;
    try {
      b = await cardBlob();
      if (!b) throw new Error('no blob');
      let f = null;
      try { f = new File([b], shareName(), { type: 'image/png' }); } catch (e) {}
      if (f && navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f], title: 'Pigeon Polly', text: t('invite') + ' · pigeonpolly.com' });
      else saveBlob(b);
    } catch (e) {
      if (e && e.name === 'AbortError') { /* закрыли системное окно */ }
      else if (b) saveBlob(b);
      else if (window.PPToast) window.PPToast(t('failPic'));
    }
    busy = false; shareBusy(false);
  }

  btn.addEventListener('click', open);

  // ⚙️ Правила: сколько часов ждать новую карту и сколько пуговок стоит сброс (account.js ловит /api/whoami и шлёт pp:whoami)
  const applyCfg = x => {
    if (!x) return;
    if (Number(x.hour) > 0) CFG.hour = Number(x.hour);
    if (Number(x.reset) >= 0) CFG.reset = Number(x.reset);
    schedule();
    if (modal && !modal.hidden) refresh();
  };
  if (window.PPWho && window.PPWho.tarot) applyCfg(window.PPWho.tarot);
  document.addEventListener('pp:whoami', e => applyCfg(e.detail && e.detail.tarot));

  sync();
  schedule();
})();
