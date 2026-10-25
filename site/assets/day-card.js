// Карточка дня (этап 13 А): «почтовая открытка» с ячейками-штампами — задания на сегодня из GET /api/today.
// PPDay.mount(el, { size: 'big' | 'small', log: true, onInvite }) — большая наверху своего профиля (с историей пуговок), маленькая — для главной.
// На любой странице: после POST в /api/… (и после первого захода за сутки) карточка перепроверяется — новый штамп → тост «Штамп!», бонус → тост.
(() => {
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0, pre = ['', '/ru', '/lv'][L], locale = ['en-GB', 'ru-RU', 'lv-LV'][L];
  const T = {
    title: ['Card of the day', 'Карточка дня', 'Dienas kartīte'],
    earned: [n => `Earned today: <b>${n}</b> 🔘`, n => `Заработано сегодня: <b>${n}</b> 🔘`, n => `Šodien nopelnīts: <b>${n}</b> 🔘`],
    stamps: [(a, b) => `Stamps: ${a} of ${b}`, (a, b) => `Штампов: ${a} из ${b}`, (a, b) => `Zīmogi: ${a} no ${b}`],
    bonus: [(n, k) => `${k} stamps — bonus +${n} 🔘`, (n, k) => `${k} штампов — бонус +${n} 🔘`, (n, k) => `${k} zīmogi — bonuss +${n} 🔘`],
    bonusGot: [n => `✓ Bonus of the day +${n} 🔘`, n => `✓ Бонус дня +${n} 🔘`, n => `✓ Dienas bonuss +${n} 🔘`],
    go: ['Do it', 'Сделать', 'Darīt'],
    again: ['again tomorrow', 'снова завтра', 'atkal rīt'],
    waitIn: ['available in', 'доступно через', 'pieejams pēc'],
    soon: ['new case soon', 'новое дело скоро', 'jauna lieta drīz'],
    of: [(a, b) => `${a} of ${b}`, (a, b) => `${a} из ${b}`, (a, b) => `${a} no ${b}`],
    coffee: [n => `+${n} ☕`, n => `+${n} ☕`, n => `+${n} ☕`],
    invite: [n => `👥 Invite a friend — +${n} 🔘`, n => `👥 Позвать друга — +${n} 🔘`, n => `👥 Uzaicināt draugu — +${n} 🔘`],
    badge: [(b, d) => `🏅 ${b} — ${d} more day${d === 1 ? '' : 's'} of streak`, (b, d) => `🏅 ${b} — ещё ${d} ${pl(d, 'день', 'дня', 'дней')} серии`, (b, d) => `🏅 ${b} — vēl ${d} ${d % 10 === 1 && d % 100 !== 11 ? 'diena' : 'dienas'} sērijā`],
    guest: ['Hatch a bird — and collect stamps', 'Вылупи птичку — и собирай штампы', 'Izperē putniņu — un krāj zīmogus'],
    guestBtn: ['Hatch a bird', 'Вылупить птичку', 'Izperēt putniņu'],
    stamp: ['Stamp!', 'Штамп!', 'Zīmogs!'],
    bonusToast: [n => `Bonus of the day! +${n} 🔘`, n => `Бонус дня! +${n} 🔘`, n => `Dienas bonuss! +${n} 🔘`],
    open: ['Open the card', 'Открыть карточку', 'Atvērt kartīti'],
    hist: ['🔘 Buttons history', '🔘 История пуговок', '🔘 Pogu vēsture'],
    histNone: ['Nothing yet.', 'Пока пусто.', 'Pagaidām tukšs.'],
    shop: ['🛍 Shop', '🛍 Магазин', '🛍 Veikals'],
    copied: ['Link copied', 'Ссылка скопирована', 'Saite nokopēta'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  function pl(n, a, b, c) { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; }
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // уровни серии — те же, что в sketch-wall.js LEVELS
  const LV = { 1: ['Egg', 'Яйцо', 'Ola'], 3: ['Chick', 'Птенец', 'Cālis'], 7: ['Little pigeon', 'Голубёнок', 'Balodītis'], 14: ['Carrier pigeon', 'Почтовый голубь', 'Pasta balodis'],
    30: ['Travelling pigeon', 'Голубь-путешественник', 'Ceļotājs balodis'], 60: ['Artist pigeon', 'Голубь-художник', 'Mākslinieks balodis'], 100: ['Astronaut pigeon', 'Голубь-астронавт', 'Astronauts balodis'], 365: ['Polly legend', 'Легенда Полли', 'Pollijas leģenda'] };
  const ICON = { daily: '🚪', draw: '🎨', comment: '💬', rain: '🌧', potion: '🧪', pan: '🥞', titos: '🕵️', bugs: '🪲', advent: '🎄' };
  // история пуговок: за что
  const KIND = { daily: ['Visit', 'Заход', 'Apmeklējums'], upload: ['Drawing', 'Рисунок', 'Zīmējums'], comment: ['Comment', 'Комментарий', 'Komentārs'], friend: ['Friend', 'Друг', 'Draugs'], welcome: ['Welcome gift', 'Подарок новичку', 'Dāvana jaunpienācējam'], holiday: ['Wobbleland holiday', 'Праздник Воббленда', 'Vobblendas svētki'],
    pick: ['Polly’s pick', 'Выбор Полли', 'Pollijas izvēle'], badge: ['Badge', 'Бейдж', 'Nozīmīte'], game: ['Button Rain', 'Пуговичный дождь', 'Pogu lietus'], gamerec: ['Rain record', 'Рекорд дождя', 'Lietus rekords'],
    rainking: ['Rain king', 'Король дождя', 'Lietus karalis'], pan: ['Polly’s Pancakes', 'Блинная Полли', 'Pollijas pankūkas'], panrec: ['Pancake record', 'Блинный рекорд', 'Pankūku rekords'], pansoap: ['Washing-up liquid', 'Средство для мытья', 'Trauku līdzeklis'], panup: ['Pancake upgrade', 'Улучшение блинной', 'Pankūku uzlabojums'], potion: ['Potion', 'Зелье', 'Dzira'], titos: ['Titos case', 'Дело Титоса', 'Tito lieta'], titossell: ['Titos coffee', 'Кофе Титоса', 'Tito kafija'],
    advent: ['Advent', 'Адвент', 'Advente'], buy: ['Shop', 'Покупка', 'Pirkums'], sell: ['Sold', 'Продажа', 'Pārdots'], card: ['Card', 'Карточка', 'Kartīte'], admin: ['From Polly', 'От Полли', 'No Pollijas'],
    salary: ['Salary', 'Зарплата', 'Alga'], tax: ['Tax', 'Налог', 'Nodoklis'], daybonus: ['Bonus of the day', 'Бонус дня', 'Dienas bonuss'],
    gsell: ['Harvest sold', 'Урожай продан', 'Raža pārdota'], gseed: ['Seeds', 'Семена', 'Sēklas'], gbug: ['Garden bug', 'Жук в огороде', 'Vabole dārzā'],
    achat: ['Chat with Alina & Polly', 'Чат с Алиной и Полли', 'Čats ar Alīnu un Polliju'] };

  // пиксельная Полли (как в today.js) — одним цветом чернил
  const P = ['......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...',
    '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....', '.ddbbbbbdd....', '...ddddd......', '....o..o......', '...oo.oo......'];
  const pollyPx = P.map((r, y) => [...r].map((ch, x) => ch !== '.' && ch !== 'w' ? `<rect x="${x + 5}" y="${y + 5}" width="1.02" height="1.02"${ch === 's' || ch === 'k' ? ' opacity=".55"' : ''}/>` : '').join('')).join('');
  const stampSvg = day => `<svg class="pd-stamp-svg" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width=".5" stroke-dasharray="1 .8"/><g fill="currentColor">${pollyPx}</g>${day ? `<text x="12" y="22.2" font-size="2.3" text-anchor="middle" fill="currentColor" font-family="monospace">${day}</text>` : ''}</svg>`;

  const two = n => String(n).padStart(2, '0');
  const left = ms => { const s = Math.max(0, Math.round(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? `${h}:${two(m)}:${two(s % 60)}` : `${m}:${two(s % 60)}`; };
  let data = null, skew = 0, loading = null;
  const mounted = new Set();
  const seenKey = 'pp-stamps';
  const seen = () => { try { return JSON.parse(localStorage.getItem(seenKey) || '{}'); } catch (e) { return {}; } };
  const saveSeen = o => { try { localStorage.setItem(seenKey, JSON.stringify(o)); } catch (e) { /* без памяти */ } };

  async function load(log) {
    const r = await (window.__ppFetch || fetch)(`/api/today?lang=${['en', 'ru', 'lv'][L]}${log ? '&log=1' : ''}`, { credentials: 'same-origin', headers: window.PPDevH ? window.PPDevH() : {} });
    const d = await r.json();
    if (d && d.now) skew = d.now - Date.now();
    return d;
  }
  // свежие штампы (поставлены только что) → тост; бонус → тост; карточки на странице перерисовать
  function apply(d, toast) {
    if (!d || d.guest) return;
    if (!d.log && data && data.log) d.log = data.log; // история пуговок приходит только при первой загрузке
    const s = seen(), was = s.day === d.day ? new Set(s.ids || []) : null, ids = d.tasks.filter(x => x.done).map(x => x.id);
    const fresh = was ? d.tasks.filter(x => x.done && !was.has(x.id)) : d.tasks.filter(x => x.done && x.at && d.now / 1000 - x.at < 60);
    saveSeen({ day: d.day, ids });
    d.fresh = new Set(fresh.map(x => x.id));
    data = d;
    if (toast && window.PPToast) {
      if (d.bonus.just) setTimeout(() => window.PPToast(t('bonusToast', d.bonus.just)), fresh.length ? 4000 : 0);
      if (fresh.length) window.PPToast(`📮 ${t('stamp')} ${fresh[0].name}${fresh.length > 1 ? ` +${fresh.length - 1}` : ''}`, { action: t('open'), onAction: () => { location.href = pre + '/bird/'; } });
    }
    mounted.forEach(m => m.el.isConnected ? draw(m) : mounted.delete(m));
    document.dispatchEvent(new CustomEvent('pp:today', { detail: d }));
  }
  async function check(toast = true) {
    const w = window.PPWho && window.PPWho.user;
    if (!w || !w.nick) return;
    if (loading) return loading;
    loading = load(false).then(d => apply(d, toast)).catch(() => {}).finally(() => { loading = null; });
    return loading;
  }

  function cell(x, day) {
    const rw = x.coffee ? t('coffee', x.coffee) : x.reward ? `+${x.reward} 🔘` : '';
    const prog = x.prog ? `<span class="pd-prog">${t('of', x.prog[0], x.prog[1])}</span>` : '';
    if (x.done) return `<li class="pd-cell done${data.fresh && data.fresh.has(x.id) ? ' fresh' : ''}" data-id="${x.id}"><span class="pd-stamp">${stampSvg(day)}</span>
      <span class="pd-name">${ICON[x.id] || ''} ${esc(x.name)}</span>${prog}${x.prog && x.prog[0] < x.prog[1] ? `<a class="pd-more" href="${esc(x.url)}">+${x.reward} 🔘</a>` : `<span class="pd-sub">${t('again')}</span>`}</li>`;
    if (x.wait) return `<li class="pd-cell wait" data-id="${x.id}"><span class="pd-ico">${ICON[x.id] || ''}</span><span class="pd-name">${esc(x.name)}</span>
      <span class="pd-sub">${x.wait < 0 ? t('soon') : `⏳ ${t('waitIn')} <b class="pd-timer" data-to="${x.wait}">${left(x.wait - Date.now() - skew)}</b>`}</span><span class="pd-rw">${rw}</span></li>`;
    return `<li class="pd-cell todo" data-id="${x.id}"><span class="pd-ico">${ICON[x.id] || ''}</span><span class="pd-name">${esc(x.name)}</span>${prog}<span class="pd-rw">${rw}</span>
      <a class="pd-go" href="${esc(x.url)}">${t('go')}</a></li>`;
  }
  function logHtml(d) {
    const rows = (d.log || []).map(r => `<li><span>${new Date(r.created_at * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</span> ${esc((KIND[r.kind] || ['🔘', '🔘', '🔘'])[L])} <b class="${r.amount < 0 ? 'neg' : ''}">${r.amount > 0 ? '+' : ''}${r.amount}</b></li>`).join('');
    return `<details class="pd-log"><summary>${t('hist')} · <b>${d.buttons}</b></summary>${rows ? `<ul>${rows}</ul>` : `<p>${t('histNone')}</p>`}
      <p class="pd-log-acts"><a class="pill-btn" href="${pre}/shop/">${t('shop')}</a></p></details>`;
  }
  function draw(m) {
    const { el, o } = m, d = data;
    if (!d) return;
    const small = o.size === 'small';
    if (d.guest) {
      el.innerHTML = `<section class="pd-card guest${small ? ' small' : ''}"><div class="pd-head"><h3>📮 ${t('title')}</h3></div>
        <ul class="pd-grid">${'<li class="pd-cell todo ghost"><span class="pd-ico">✉</span></li>'.repeat(small ? 4 : 7)}</ul>
        <p class="pd-guest">${t('guest')}</p><p class="pd-guest-btn"><button type="button" class="cta-btn">${t('guestBtn')}</button></p></section>`;
      el.querySelector('.cta-btn').onclick = () => window.PPAccount && window.PPAccount.openSignIn();
      return;
    }
    const day = new Date(d.day + 'T12:00:00'), dd = `${two(day.getDate())}.${two(day.getMonth() + 1)}`;
    const pct = Math.min(100, Math.round(d.done / Math.max(1, d.bonus.need) * 100));
    const bar = `<div class="pd-bar${d.bonus.got ? ' full' : ''}"><i style="width:${pct}%"></i></div>
      <p class="pd-bonus">${t('stamps', d.done, d.bonus.of)} · ${d.bonus.got ? t('bonusGot', d.bonus.amount) : t('bonus', d.bonus.amount, d.bonus.need)}</p>`;
    if (small) {
      el.innerHTML = `<a class="pd-card small" href="${pre}/bird/"><div class="pd-head"><h3>📮 ${t('title')}</h3><span class="pd-earned">${t('earned', d.earned)}</span></div>
        <ul class="pd-dots">${d.tasks.map(x => `<li class="${x.done ? 'done' : x.wait ? 'wait' : ''}" title="${esc(x.name)}">${x.done ? stampSvg('') : ICON[x.id] || ''}</li>`).join('')}</ul>${bar}</a>`;
      return;
    }
    const lv = d.badge && LV[d.badge.d];
    el.innerHTML = `<section class="pd-card"><div class="pd-head"><h3>📮 ${t('title')} <span class="pd-date">${day.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}</span></h3>
        <p class="pd-earned">${t('earned', d.earned)}</p></div>${bar}
      <ul class="pd-grid">${d.tasks.map(x => cell(x, dd)).join('')}</ul>
      <p class="pd-foot"><button type="button" class="pd-link" data-invite>${t('invite', d.friend)}</button>${lv ? `<span>${esc(t('badge', lv[L], d.badge.left))}${d.badge.reward ? ` · +${d.badge.reward} 🔘` : ''}</span>` : ''}</p></section>
      ${o.log && d.log ? logHtml(d) : ''}`;
    el.querySelector('[data-invite]').onclick = () => {
      if (o.onInvite) return o.onInvite();
      const w = window.PPWho && window.PPWho.user, url = `${location.origin}${pre}/flock/?bird=${encodeURIComponent(w && w.nick || '')}`;
      if (navigator.share) navigator.share({ url }).catch(() => {}); else navigator.clipboard && navigator.clipboard.writeText(url).then(() => window.PPToast && window.PPToast(t('copied')));
    };
    d.fresh = new Set(); // «шлёп» — один раз
  }
  // таймеры ячеек «ждёт»: раз в секунду; дождались — перепроверить карточку
  setInterval(() => {
    let due = false;
    document.querySelectorAll('.pd-timer').forEach(b => { const ms = Number(b.dataset.to) - Date.now() - skew; if (ms <= 0) due = true; b.textContent = left(ms); });
    if (due && !loading) check(false);
  }, 1000);

  async function mount(el, o = {}) {
    const m = { el, o }; mounted.add(m);
    try { const d = await load(!!o.log); apply(d, false); if (d.guest) { data = d; draw(m); } } catch (e) { el.innerHTML = ''; }
  }
  window.PPDay = { mount, check };

  // штамп с любой страницы: после POST в /api/… перепроверить карточку (не чаще раза в 1,5 с)
  const skip = /^\/api\/(today|hit|news|whoami|login|logout)/;
  let timer = 0;
  const orig = window.fetch.bind(window);
  window.__ppFetch = orig;
  window.fetch = function (input, init) {
    const res = orig(input, init);
    try {
      const url = new URL(typeof input === 'string' ? input : input.url, location.href), method = (init && init.method || (typeof input === 'object' && input.method) || 'GET').toUpperCase();
      if (method === 'POST' && url.origin === location.origin && url.pathname.startsWith('/api/') && !skip.test(url.pathname) && !url.pathname.startsWith('/api/admin'))
        res.then(r => { if (r.ok) { clearTimeout(timer); timer = setTimeout(() => check(true), 1500); } }).catch(() => {});
    } catch (e) { /* не наш адрес */ }
    return res;
  };
  // первый заход за сутки — тоже штамп (после тоста о +пуговках)
  document.addEventListener('pp:whoami', e => { const u = e.detail && e.detail.user; if (u && u.nick && u.earned) setTimeout(() => check(true), 4200); });
})();
