// «Конвертик» — одна очередь новостей птички на всех страницах (этап 4 А).
// Сервер отдаёт news: [{kind, n, …}] в /api/whoami (account.js шлёт событие 'pp:whoami') и в /api/news (refresh после действий).
// 🔔 в шапке (#pp-bell, src/layout.html) — число новостей; если есть новое — из угла вылетает пиксельный конвертик
// «У тебя N новостей!», нажатие — окно-лента с карточками, «Потом» прячет конвертик до следующей страницы.
// Новый вид новости = одна запись в NEWS_KINDS (worker/index.js) и одна в KINDS ниже.
(() => {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, pre = ['', '/ru', '/lv'][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // склонение: [1, 2–4, 5+] для RU; [1, много] для EN и LV (21, 31… — как 1)
  // f — формы по языкам [en, ru, lv]; формы чужого языка не нужны (строки других языков в массивах тоже вычисляются — для них '')
  const pl = (n, f) => !f[L] ? '' : L === 1 ? f[1][n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : 2]
    : f[L][(L === 2 ? n % 10 === 1 && n % 100 !== 11 : n === 1) ? 0 : 1];
  const T = {
    bell: ['News', 'Новости', 'Jaunumi'],
    have: [n => `You have ${n} ${pl(n, [['new thing', 'new things']])}!`, n => `У тебя ${n} ${pl(n, [0, ['новость', 'новости', 'новостей']])}!`, n => `Tev ir ${n} ${pl(n, [0, 0, ['jaunums', 'jaunumi']])}!`],
    later: ['Later', 'Потом', 'Vēlāk'],
    open: ['Open', 'Открыть', 'Atvērt'],
    title: ['News for your bird', 'Новости птички', 'Putniņa jaunumi'],
    empty: ['Nothing new yet. Come back later!', 'Пока ничего нового. Загляни позже!', 'Pagaidām nekā jauna. Ieskaties vēlāk!'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    // зарплата (раньше — отдельное окно #acct-sal в account.js)
    salHi: [n => `Hi, @${n}!`, n => `Привет, @${n}!`, n => `Sveiks, @${n}!`],
    salText: ['The Wobbleland Administration takes care of its birds and every now and then pays them a salary.', 'Администрация Воббленда проводит социальную поддержку птичек и иногда выдаёт им зарплату.', 'Wobbleland administrācija rūpējas par saviem putniņiem un šad tad izmaksā tiem algu.'],
    salGot: [n => `Your salary: +${n} 🔘`, n => `Твоя зарплата: +${n} 🔘`, n => `Tava alga: +${n} 🔘`],
    salNote: ['The buttons are already in your pocket.', 'Пуговки уже у тебя в кармане.', 'Pogas jau ir tavā kabatā.'],
    salSign: ['— The Wobbleland Administration', '— Администрация Воббленда', '— Wobbleland administrācija'],
    salOk: ['Thank you!', 'Спасибо!', 'Paldies!'],
  };
  const t = k => T[k][L];

  // виды новостей: icon, title(x), text(x), act — подпись кнопки; go(x) — куда ведёт, или open(card, x) — действие прямо в ленте
  const KINDS = {
    gift: {
      icon: '🎁',
      title: x => x.n > 1 ? [`Gifts for you! (${x.n})`, `Тебе подарки! (${x.n})`, `Tev dāvanas! (${x.n})`][L] : ['A gift for you!', 'Тебе подарок!', 'Tev dāvana!'][L],
      text: x => x.from ? [`From @${x.from}`, `От @${x.from}`, `No @${x.from}`][L] : ['It is waiting unopened in your profile.', 'Он ждёт нераскрытым в твоём профиле.', 'Tā gaida neatvērta tavā profilā.'][L],
      act: ['Open the gift', 'Открыть подарок', 'Atvērt dāvanu'],
      go: () => pre + '/bird/#gift',
    },
    salary: {
      icon: '💌',
      title: () => ['A letter for you!', 'Тебе письмо!', 'Tev vēstule!'][L],
      text: () => ['From the Wobbleland Administration', 'От администрации Воббленда', 'No Wobbleland administrācijas'][L],
      act: ['Open the envelope', 'Открыть конвертик', 'Atvērt aploksni'],
      open: salary,
    },
    advent: {
      icon: '🎄',
      title: x => x.n > 1 ? [`${x.n} windows are waiting for you`, `Тебя ${pl(x.n, [0, ['ждёт', 'ждут', 'ждут']])} ${x.n} ${pl(x.n, [0, ['окошко', 'окошка', 'окошек']])}`, `Tevi gaida ${x.n} ${pl(x.n, [0, 0, ['lodziņš', 'lodziņi']])}`][L]
        : [`Window №${x.day} is open!`, `Окошко №${x.day} открылось!`, `Lodziņš Nr. ${x.day} ir atvēries!`][L],
      text: x => x.n > 1 ? [`Today’s №${x.day} and the ones you missed — a gift in each.`, `Сегодняшнее №${x.day} и пропущенные — в каждом подарок.`, `Šodienas Nr. ${x.day} un izlaistie — katrā dāvana.`][L]
        : ['Advent calendar: a gift for your bird inside.', 'Адвент-календарь: внутри подарок для птички.', 'Adventes kalendārs: iekšā dāvana putniņam.'][L],
      act: ['Open the window', 'Открыть окошко', 'Atvērt lodziņu'],
      go: x => pre + '/advent/#d=' + x.day,
    },
    potion: {
      icon: '🧪',
      title: x => x.n > 1 ? ['Ingredients from friends', 'Ингредиенты от друзей', 'Sastāvdaļas no draugiem'][L] : ['Ingredients from a friend', 'Ингредиенты от друга', 'Sastāvdaļas no drauga'][L],
      text: x => (x.from || []).map(n => '@' + n).join(', ') + ' · ' + ['for your potions', 'для твоих зелий', 'taviem dziriem'][L],
      act: ['Look', 'Посмотреть', 'Apskatīt'],
      go: () => pre + '/potions/',
    },
    trade: { // предложения обмена карточками (этап 7 В); гаснет, когда список открыт в профиле
      icon: '🔁',
      title: x => x.n > 1 ? [`${x.n} trade offers`, `Предложения обмена: ${x.n}`, `Maiņas piedāvājumi: ${x.n}`][L] : ['A trade offer', 'Предложение обмена', 'Maiņas piedāvājums'][L],
      text: x => (x.from || []).map(n => '@' + n).join(', ') + ' · ' + ((x.from || []).length > 1 ? ['want to trade cards with you', 'хотят обменяться карточками', 'grib mainīties ar kartītēm'] : ['wants to trade cards with you', 'хочет обменяться карточками', 'grib mainīties ar kartītēm'])[L],
      act: ['Look', 'Посмотреть', 'Apskatīt'],
      go: () => pre + '/bird/#trades',
    },
  };

  let news = [], me = null, flown = false;
  const known = () => news.filter(x => KINDS[x.kind]);

  // ---------- 🔔 в шапке ----------
  const bell = document.getElementById('pp-bell');
  function drawBell() {
    if (!bell) return;
    const n = known().length;
    bell.hidden = !me;
    bell.classList.toggle('has', n > 0);
    bell.setAttribute('aria-label', t('bell') + (n ? ` (${n})` : ''));
    bell.querySelector('.bell-n').textContent = n ? String(n) : '';
    bell.querySelector('.bell-n').hidden = !n;
  }
  if (bell) bell.addEventListener('click', () => feed());

  // ---------- пиксельный конвертик из угла ----------
  const PIX = ['OOOOOOOOOOOOOOOO', 'OHBBBBBBBBBBBBHO', 'OBDBBBBBBBBBBDBO', 'OBBDBBBBBBBBDBBO', 'OBBBDBBBBBBDBBBO', 'OBBBBDBBBBDBBBBO', 'OBBBBBDRRDBBBBBO',
    'OBBBBBRRWRBBBBBO', 'OBBBBDBRRBDBBBBO', 'OBBBDBBBBBBDBBBO', 'OBBDBBBBBBBBDBBO', 'OOOOOOOOOOOOOOOO'];
  const COL = { O: '#5A2E1A', B: '#F2C79A', H: '#FFE2BF', D: '#C98A55', R: '#C0392B', W: '#FFD27A' };
  const envSvg = () => `<svg viewBox="0 0 16 12" shape-rendering="crispEdges" aria-hidden="true">${PIX.map((r, y) => [...r].map((c, x) => COL[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${COL[c]}"/>` : '').join('')).join('')}</svg>`;
  function fly(tries = 0) {
    const n = known().length;
    if (!n || flown || document.querySelector('.nw-env')) return;
    try { if (sessionStorage.getItem('pp-nw-skip')) { sessionStorage.removeItem('pp-nw-skip'); flown = true; return; } } catch (e) {} // пришли сюда из ленты — не вылетать снова
    if (document.querySelector('dialog[open], .adv-modal, .sw-bv')) { if (tries < 60) setTimeout(() => fly(tries + 1), 1000); return; } // открыто другое окно — подождать
    flown = true;
    const box = document.createElement('div'); box.className = 'nw-env';
    box.innerHTML = `<div class="nw-bub" role="status"><button type="button" class="nw-say">${esc(T.have[L](n))}</button><button type="button" class="nw-later">${t('later')}</button></div>
      <button type="button" class="nw-pix" aria-label="${esc(T.have[L](n))}">${envSvg()}<b>${n}</b></button>`;
    document.body.appendChild(box);
    const go = () => { box.remove(); feed(); };
    box.querySelector('.nw-pix').onclick = go; box.querySelector('.nw-say').onclick = go;
    box.querySelector('.nw-later').onclick = () => { box.classList.add('off'); setTimeout(() => box.remove(), 400); }; // до следующей страницы
  }

  // ---------- окно-лента ----------
  function feed() {
    const old = document.querySelector('.nw-env'); if (old) old.remove();
    let d = document.getElementById('nw-feed');
    if (!d) {
      d = document.createElement('dialog'); d.id = 'nw-feed'; d.className = 'nw-dlg'; d.setAttribute('aria-labelledby', 'nw-feed-t');
      document.body.appendChild(d);
      d.addEventListener('click', e => { if (e.target === d) d.close(); });
    }
    d.innerHTML = `<div class="nw-in"><div class="nw-head"><h2 id="nw-feed-t">🔔 ${t('title')}</h2><button type="button" class="nw-x" aria-label="${t('close')}">✕</button></div><div class="nw-list"></div></div>`;
    d.querySelector('.nw-x').onclick = () => d.close();
    const list = d.querySelector('.nw-list');
    const items = known();
    if (!items.length) list.innerHTML = `<p class="nw-empty">${t('empty')}</p>`;
    items.forEach(x => {
      const k = KINDS[x.kind], c = document.createElement('article');
      c.className = 'nw-card nw-' + x.kind; c.dataset.kind = x.kind;
      c.innerHTML = `<div class="nw-row"><span class="nw-ic" aria-hidden="true">${k.icon}</span><div class="nw-tx"><b>${esc(k.title(x))}</b><small>${esc(k.text(x))}</small></div>
        ${k.open ? `<button type="button" class="pill-btn pill-fill nw-act">${k.act[L]}</button>` : `<a class="pill-btn pill-fill nw-act" href="${esc(k.go(x))}">${k.act[L]}</a>`}</div>`;
      const a = c.querySelector('.nw-act');
      if (k.open) a.onclick = () => k.open(c, x, a);
      else a.addEventListener('click', e => { // уже на этой странице (смена # не перезагружает) — сразу действие
        try { sessionStorage.setItem('pp-nw-skip', '1'); } catch (er) {}
        const u = new URL(a.href, location.href);
        if (u.pathname !== location.pathname) return;
        e.preventDefault(); d.close();
        const gb = document.getElementById('bp-gift');
        if (x.kind === 'gift' && gb) { try { sessionStorage.removeItem('pp-nw-skip'); } catch (er) {} gb.click(); } else { location.hash = u.hash; location.reload(); }
      });
      list.appendChild(c);
    });
    if (!d.open) d.showModal();
  }
  // убрать карточку, когда новость прочитана
  function drop(kind, card) {
    news = news.filter(x => x.kind !== kind); drawBell();
    if (card) { card.classList.add('gone'); setTimeout(() => { card.remove(); const l = document.querySelector('#nw-feed .nw-list'); if (l && !l.children.length) l.innerHTML = `<p class="nw-empty">${t('empty')}</p>`; }, 350); }
  }

  // зарплата: пуговки уже начислены сервером; здесь письмо открывается (анимация CSS .sal-*, style.css) и отмечается прочитанным
  function salary(card, x, btn) {
    if (card.classList.contains('open')) return drop('salary', card);
    card.id = 'acct-sal';
    if (!card.querySelector('.sal-env')) card.insertAdjacentHTML('beforeend', `<div class="sal-env"><div class="sal-back"></div><div class="sal-letter"><b>${esc(T.salHi[L](me.nick))}</b><p>${t('salText')}</p>
      <p class="sal-sum">${T.salGot[L](x.sum || 0)}</p><p class="sal-note">${t('salNote')}</p><i>${t('salSign')}</i></div><div class="sal-front"></div><div class="sal-flap"></div><div class="sal-seal">W</div></div>`);
    card.classList.add('show'); btn.disabled = true;
    setTimeout(() => { card.classList.add('open'); btn.disabled = false; btn.textContent = t('salOk'); card.querySelector('.sal-env').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 900);
    fetch('/api/salary/seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => {});
  }

  function set(d) {
    me = d && d.user && d.user.nick ? d.user : null;
    news = me ? (d.user.news || []) : [];
    drawBell(); fly();
  }
  // после действия на странице (открыто окошко, подарок…) — заново спросить сервер; конвертик второй раз не вылетает
  function refresh() {
    if (!me) return Promise.resolve();
    return fetch('/api/news', { credentials: 'same-origin', headers: window.PPDevH ? window.PPDevH() : {} }).then(r => r.ok ? r.json() : null)
      .then(j => { if (j) { news = j.news || []; drawBell(); } }).catch(() => {});
  }
  window.PPNews = { refresh, open: feed, list: () => known().slice() };
  if (window.PPWho) set(window.PPWho);
  document.addEventListener('pp:whoami', e => set(e.detail));
})();
