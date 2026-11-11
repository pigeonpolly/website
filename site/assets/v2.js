// Редизайн 2.0 (/preview/): сезон (по дате, кнопки в шапке), меню ☰, вход, папка Лаборатории, блог на живых данных.
(function () {
  const html = document.documentElement, lang = html.lang || 'en', L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const pre = lang === 'en' ? '' : '/' + lang;
  const T = {
    winter: { tag: ['winter edition', 'зимний выпуск', 'ziemas izdevums'], note: ['rooftops and towers ❄', 'крыши и башни ❄', 'jumti un torņi ❄'] },
    spring: { tag: ['spring edition', 'весенний выпуск', 'pavasara izdevums'], note: ['on my desk: strawberries ❀', 'на моём столе: земляника ❀', 'uz mana galda: zemenes ❀'] },
    summer: { tag: ['summer edition', 'летний выпуск', 'vasaras izdevums'], note: ['Polly, summer lover ☀', 'Полли обожает лето ☀', 'Pollija mīl vasaru ☀'] },
    autumn: { tag: ['autumn edition', 'осенний выпуск', 'rudens izdevums'], note: ['Polly on the train ✿', 'Полли в поезде ✿', 'Pollija vilcienā ✿'] },
  };
  const COL = { winter: '#9E1B22', spring: '#BE2F3A', summer: '#1F7FAE', autumn: '#22405F' };
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function season(s, save) {
    if (!T[s]) return;
    html.setAttribute('data-season', s);
    if (save) try { localStorage.setItem('pp_season', s); } catch (e) {}
    document.querySelectorAll('.switch button').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === s ? 'true' : 'false'));
    document.querySelectorAll('.sea-b i').forEach(i => { i.style.background = COL[s]; });
    document.querySelectorAll('[data-sv]').forEach(el => { el.textContent = T[s][el.dataset.sv][L]; });
    const img = document.getElementById('v2-hero');
    if (img) { img.srcset = `/images/v2/hero-${s}-900.jpg 900w, /images/v2/hero-${s}.jpg 1800w`; img.src = `/images/v2/hero-${s}.jpg`; }
  }
  document.querySelectorAll('.switch button').forEach(b => {
    (b.querySelector('i') || b).style.background = COL[b.dataset.s];
    b.addEventListener('click', () => { season(b.dataset.s, true); seaMenu(false); });
  });
  // выбор сезона в шапке: один кружок текущего сезона, по нажатию — список из 4
  const seaB = document.querySelector('.sea-b'), seaM = document.getElementById('sea-m');
  function seaMenu(open) { if (!seaB || !seaM) return; seaM.hidden = !open; seaB.setAttribute('aria-expanded', String(open)); }
  if (seaB && seaM) {
    seaB.addEventListener('click', e => { e.stopPropagation(); seaMenu(seaM.hidden); });
    document.addEventListener('click', e => { if (!seaM.hidden && !e.target.closest('.sea2')) seaMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !seaM.hidden) { seaMenu(false); seaB.focus(); } });
  }
  season(html.getAttribute('data-season'));
  // выбор языка в шапке: кнопка текущего языка, по нажатию — список из 3
  const langB = document.querySelector('.lang-b'), langM = document.getElementById('lang-m');
  if (langB && langM) {
    const langMenu = open => { langM.hidden = !open; langB.setAttribute('aria-expanded', String(open)); };
    langB.addEventListener('click', e => { e.stopPropagation(); seaMenu(false); langMenu(langM.hidden); });
    seaB && seaB.addEventListener('click', () => langMenu(false));
    document.addEventListener('click', e => { if (!langM.hidden && !e.target.closest('.lang2')) langMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !langM.hidden) { langMenu(false); langB.focus(); } });
  }

  // меню на телефоне
  const burger = document.querySelector('.burger'), drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => { const o = drawer.hidden; drawer.hidden = !o; burger.setAttribute('aria-expanded', String(o)); burger.textContent = o ? '✕' : '☰'; });
    drawer.addEventListener('click', e => { if (e.target.closest('a')) { drawer.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.textContent = '☰'; } });
  }

  // шапка не помещается (у вошедшей птички справа корзина, колокольчик, пуговки): сначала плотнее (.snug), если мало — меню в ☰ (.tight), v2-shell.css
  const hd = document.querySelector('.hd2'), lgo = hd && hd.querySelector('.lg'), nv = hd && hd.querySelector('.nv'), hrr = hd && hd.querySelector('.hr');
  if (hd && lgo && nv && hrr) {
    const fit = () => {
      hd.classList.remove('snug', 'tight');
      if (getComputedStyle(nv).display === 'none') return;
      const w = hd.querySelector('.w');
      const over = () => lgo.getBoundingClientRect().right + 24 > nv.getBoundingClientRect().left || hrr.getBoundingClientRect().right > w.getBoundingClientRect().right - (parseFloat(getComputedStyle(w).paddingRight) || 0) + 1;
      if (over()) { hd.classList.add('snug'); if (over()) { hd.classList.remove('snug'); hd.classList.add('tight'); } }
    };
    fit(); addEventListener('resize', fit); addEventListener('load', fit);
    if (document.fonts) document.fonts.ready.then(fit);
    new MutationObserver(fit).observe(hrr, { childList: true, subtree: true, characterData: true });
  }

  // текущий раздел в шапке; метка pp_v2 — блог (/blog/) тоже показывается в новом стиле (worker/blog.js, ?v2=0 — снять)
  const here = location.pathname.replace(/^\/(ru|lv)\//, '/');
  document.querySelectorAll('.nv a, .drawer a').forEach(a => { const p = a.pathname.replace(/^\/(ru|lv)\//, '/'); if (p !== '/' && p !== '/preview/' && here.startsWith(p)) a.setAttribute('aria-current', 'page'); });
  try { if (!/(^|;\s*)pp_v2=1/.test(document.cookie)) document.cookie = 'pp_v2=1; path=/; max-age=31536000; samesite=lax'; } catch (e) {}

  // папка Лаборатории: на телефоне открывается нажатием
  const fold = document.querySelector('.fold');
  if (fold) fold.querySelector('.cv').addEventListener('click', () => fold.classList.add('open'));

  // вход: вошедшему — птичка и ник (→ профиль), гостю — «Войти» (окно входа на старых страницах, /games/#signin)
  const acct = document.getElementById('acct2');
  if (acct) fetch('/api/whoami', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => {
    const u = d && d.user;
    if (!u) { acct.textContent = ['Sign in', 'Войти', 'Ienākt'][L]; return; }
    acct.href = pre + '/bird/'; // «Мой кабинет» (cabinet.js)
    acct.innerHTML = `<canvas width="28" height="26" aria-hidden="true"></canvas><span>${esc(u.nick || ['My bird', 'Моя птичка', 'Mans putniņš'][L])}</span>`;
    const draw = () => { if (!window.PPBirds) return; try { acct.querySelector('canvas').getContext('2d').drawImage(window.PPBirds.sprite(window.PPBirds.dress(window.PPBirds.looks(u.id), u.avatar), 0), 0, 0); } catch (e) {} };
    if (window.PPBirds) draw(); else addEventListener('load', draw);
  }).catch(() => {});

  // видео YouTube прямо на сайте: [data-yt] открывает плеер в окне (без YouTube — обычная ссылка)
  let box2;
  function play(id) {
    if (!box2) {
      box2 = document.createElement('dialog'); box2.className = 'ytbox';
      box2.innerHTML = `<button type="button" class="x" aria-label="${['Close', 'Закрыть', 'Aizvērt'][L]}">✕</button><div class="fr"></div>`;
      const close = () => { box2.querySelector('.fr').innerHTML = ''; if (box2.open) box2.close(); };
      box2.querySelector('.x').addEventListener('click', close);
      box2.addEventListener('click', e => { if (e.target === box2) close(); });
      box2.addEventListener('close', () => { box2.querySelector('.fr').innerHTML = ''; });
      document.body.appendChild(box2);
    }
    box2.querySelector('.fr').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&hl=${lang}" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    if (box2.showModal) box2.showModal(); else box2.setAttribute('open', '');
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-yt]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault(); play(a.dataset.yt);
    try { localStorage.setItem('pp-yt-last', a.dataset.yt); } catch (e2) {} // «последний просмотренный» в кабинете (cabinet.js)
  });

  // подписи бесплатных уроков — по названию видео на YouTube (/api/v2/yt); известные — на языке страницы
  const NAMES = [[/pepper|перец|перц/i, ['Pepper sketching', 'Скетч перца', 'Pipara skice']], [/caf[eé]|outdoor|кафе/i, ['Outdoor sketching in a cafe', 'Скетч на выезде: кафе', 'Skices ārpus mājām: kafejnīca']]];
  const ytName = a => {
    const b = a.querySelector('b'); if (!b || a.dataset.own) return;
    fetch('/api/v2/yt?id=' + encodeURIComponent(a.dataset.yt)).then(r => r.ok ? r.json() : null).then(d => {
      const t = d && d.title; if (!t) return;
      const k = NAMES.find(n => n[0].test(t)), name = k ? k[1][L] : t;
      b.textContent = name; const im = a.querySelector('img'); if (im) im.alt = name;
    }).catch(() => {});
  };
  document.querySelectorAll('[data-yt]').forEach(ytName);

  // добавленное в кабинете «🎬 Видео и гайды» (/api/v2/guides, worker/guides.js): новое — первым
  const G = { free: ['Free', 'Бесплатно', 'Bez maksas'], vid: ['Video lesson · open to everyone', 'Видеоурок · открыт всем', 'Video nodarbība · atvērta visiem'],
    watch: ['Watch →', 'Смотреть →', 'Skatīties →'], lock: ['Sign in to watch', 'Войдите, чтобы смотреть', 'Ienāc, lai skatītos'], signin: ['Sign in →', 'Войти →', 'Ienākt →'],
    pdf: ['Free PDF', 'Бесплатный PDF', 'Bezmaksas PDF'], dl: ['Download free →', 'Скачать бесплатно →', 'Lejupielādēt bez maksas →'],
    amz: ['Paperback &amp; Kindle', 'Бумажная и Kindle', 'Drukāta un Kindle'], onAmz: ['On Amazon →', 'На Amazon →', 'Amazon →'],
    guide: ['Guide', 'Гайд', 'Ceļvedis'], vipOpen: ['VIP lesson · open for you', 'VIP-урок · открыт для тебя', 'VIP nodarbība · atvērta tev'],
    all: ['All', 'Все', 'Visas'], freeF: ['Free', 'Бесплатные', 'Bezmaksas'], fl: ['Filter lessons', 'Фильтр уроков', 'Filtrēt nodarbības'],
    allOpen: ['🔓 Everything is open for you', '🔓 Тебе открыто всё', '🔓 Tev atvērts viss'],
    vipN: [n => `${n} VIP ${n === 1 ? 'lesson opens' : 'lessons open'} after a free sign-in`, n => `VIP-уроков: ${n} — откроются после бесплатного входа`, n => `VIP nodarbības: ${n} — atvērsies pēc bezmaksas ienākšanas`],
    youN: [n => `Open for you · ${n} VIP ${n === 1 ? 'lesson' : 'lessons'}`, n => `Тебе открыто · VIP-уроков: ${n}`, n => `Tev atvērts · VIP nodarbības: ${n}`], open: ['Open →', 'Открыть →', 'Atvērt →'], vidT: ['Video lesson', 'Видеоурок', 'Video nodarbība'] };
  const tOf = x => (x.t && (x.t[lang] || x.t.en || x.t.ru || x.t.lv)) || '';
  const ext = u => /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : '';
  const own = x => tOf(x) ? ' data-own="1"' : '';
  const guidesReady = fetch('/api/v2/guides', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).catch(() => null).then(d => {
    const items = (d && d.items) || [], vids = items.filter(x => x.kind === 'video'), free = vids.filter(x => !x.vip), vip = vids.filter(x => x.vip), books = items.filter(x => x.kind === 'book');
    const ytCard = x => `<a class="vc yt" href="https://youtu.be/${esc(x.yt)}" data-yt="${esc(x.yt)}"${own(x)} target="_blank" rel="noopener"><span class="th"><img src="${esc(x.cover)}" alt="${esc(tOf(x))}" loading="lazy"><span class="bd">${G.free[L]}</span><span class="pl" aria-hidden="true">▶</span></span><span class="tx"><b>${esc(tOf(x) || G.vidT[L])}</b><small>${G.vid[L]}</small><span class="go">${G.watch[L]}</span></span></a>`;
    // /learn/: каталог всех уроков с фильтрами; VIP гостю — размыто и с замочком, вошедшему — открыто
    const op = !!(d && d.open), fg = document.querySelector('#free .vg2');
    const card = x => {
      const lock = x.vip && !op, nm = esc(tOf(x) || G.vidT[L]);
      return `<a class="vc${lock ? ' lock' : ''}" data-f="${x.vip ? 'vip' : 'free'}" href="${lock ? '#signin' : 'https://youtu.be/' + esc(x.yt)}"${lock ? '' : ` data-yt="${esc(x.yt)}" target="_blank" rel="noopener"`}${own(x)}>`
        + `<span class="th"><img src="${esc(x.cover)}" alt="" loading="lazy"><span class="bd">${x.vip ? 'VIP' : G.free[L]}</span><span class="pl" aria-hidden="true">${lock ? '🔒' : '▶'}</span></span>`
        + `<span class="tx"><b>${nm}</b><small>${x.vip ? (lock ? G.lock[L] : G.vipOpen[L]) : G.vid[L]}</small><span class="go">${lock ? G.signin[L] : G.watch[L]}</span></span></a>`;
    };
    if (fg && vids.length) {
      const more = fg.querySelector('.vc.more');
      fg.innerHTML = vids.map(card).join(''); if (more) fg.appendChild(more);
      fg.querySelectorAll('[data-yt]').forEach(ytName);
      const F = [['all', G.all[L], vids.length], ['free', G.freeF[L], free.length], ['vip', 'VIP', vip.length]];
      fg.insertAdjacentHTML('beforebegin', `<div class="flt" role="group" aria-label="${G.fl[L]}">${F.map(([k, n, c], i) => `<button type="button" data-k="${k}" aria-pressed="${i ? 'false' : 'true'}">${n} <i>${c}</i></button>`).join('')}`
        + `<span class="flt-st">${op ? G.allOpen[L] : `🔒 ${G.vipN[L](vip.length)} · <a href="#signin">${G.signin[L]}</a>`}</span></div>`);
      const bar = fg.previousElementSibling;
      bar.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        fg.querySelectorAll('.vc[data-f]').forEach(c => { c.hidden = b.dataset.k !== 'all' && c.dataset.f !== b.dataset.k; });
        if (more) more.hidden = b.dataset.k !== 'all';
      });
    }
    // /learn/: блок VIP — список VIP-уроков: вошедшему открыт («тебе открыто»), гостю размыт
    const vg = document.querySelector('.vg2.vip1');
    if (vg && vip.length) {
      vg.className = 'vl' + (op ? '' : ' lock');
      vg.innerHTML = `<p class="vl-h">${op ? G.youN[L](vip.length) : G.vipN[L](vip.length)}</p>` + vip.map(x => {
        const nm = esc(tOf(x) || G.vidT[L]);
        return op ? `<a class="vr" href="https://youtu.be/${esc(x.yt)}" data-yt="${esc(x.yt)}"${own(x)} target="_blank" rel="noopener"><span class="th"><img src="${esc(x.cover)}" alt="" loading="lazy"></span><b>${nm}</b><em>▶</em></a>`
          : `<a class="vr" href="#signin"><span class="th"><img src="${esc(x.cover)}" alt="" loading="lazy"></span><b>${nm}</b><em>🔒</em></a>`;
      }).join('');
      vg.querySelectorAll('[data-yt]').forEach(ytName);
      const al = vg.closest('.al'), k = al && al.querySelector('.k'), pp = al && al.querySelector('h2 + p');
      if (op && k) k.textContent = ['You are signed in', 'Вход выполнен', 'Laipni lūdzam'][L];
      if (op && pp) pp.innerHTML = [`All VIP lessons are open for you, right here. Want to support my work? <a href="${pre}/guides/">Get one of my books</a>.`, `Все VIP-уроки открыты, смотрите прямо здесь. Хотите поддержать меня? <a href="${pre}/guides/">Купите одну из моих книг</a>.`, `Visas VIP nodarbības ir atvērtas, skaties tepat. Gribi atbalstīt manu darbu? <a href="${pre}/guides/">Iegādājies kādu no manām grāmatām</a>.`][L];
    }
    // главная: две плитки бесплатных уроков — самые новые
    const tiles = [...document.querySelectorAll('#lessons .t.yt')];
    free.slice(0, tiles.length).forEach((x, i) => {
      const a = tiles[i]; a.href = 'https://youtu.be/' + x.yt; a.dataset.yt = x.yt;
      const im = a.querySelector('img'); if (im) { im.src = x.cover; im.alt = tOf(x); }
      const b = a.querySelector('b'); if (b) b.textContent = tOf(x) || G.vidT[L];
      if (tOf(x)) a.dataset.own = 1; else ytName(a);
    });
    // /guides/: полка — новые книги первыми
    const shelf = document.querySelector('.shelf');
    if (shelf && books.length) shelf.insertAdjacentHTML('afterbegin', books.map(x => {
      const k = x.free ? ['free', G.pdf[L], G.dl[L]] : /amazon\.|a\.co\//.test(x.url) ? ['buy', G.amz[L], G.onAmz[L]] : ['buy', G.guide[L], G.open[L]];
      return `<a class="gb ${k[0]}" href="${esc(x.url)}"${ext(x.url)}><span class="cvr"><img src="${esc(x.cover)}" alt="" loading="lazy"></span><span class="lbl2">${k[1]}</span><b>${esc(tOf(x))}</b><span class="go">${k[2]}</span></a>`;
    }).join(''));
    // главная: блок «Гайды» — три обложки, новые первыми
    const bk = document.querySelector('.books');
    if (bk && books.length) {
      const old = [...bk.querySelectorAll('a[class^="b"]')];
      const add = books.slice(0, 3).map(x => { const a = document.createElement('a'); a.href = x.url; if (/^https?:/.test(x.url)) { a.target = '_blank'; a.rel = 'noopener'; } a.innerHTML = `<img src="${esc(x.cover)}" alt="${esc(tOf(x))}" loading="lazy">`; return a; });
      const all = [...add, ...old].slice(0, 3);
      old.forEach(a => { if (!all.includes(a)) a.remove(); });
      const hand = bk.querySelector('.hand');
      all.forEach((a, i) => { a.className = 'b' + i; bk.insertBefore(a, hand || null); });
    }
  });

  // «Войти» у VIP-уроков: окно входа прямо здесь, без перехода на другую страницу
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#signin"]');
    if (!a || a.dataset.yt || !window.PPAccount) return;
    e.preventDefault(); window.scrollTo({ top: 0, behavior: 'instant' }); // окно входа крепится к шапке — сначала наверх
    window.PPAccount.openSignIn();
  });

  // VIP-видео: только вошедшим (/api/v2/vip), гостю остаётся «Войти бесплатно»
  if (document.querySelector('.vip-go, .vc.vip')) guidesReady.then(() => fetch('/api/v2/vip', { credentials: 'same-origin' })).then(r => r.ok ? r.json() : null).then(d => {
    const vs = (d && d.videos) || [], v = vs[0];
    if (!v) return;
    document.querySelectorAll('.vip-go').forEach(b => { b.dataset.yt = v.id; b.href = 'https://youtu.be/' + v.id; b.textContent = ['▶ Watch the VIP lesson', '▶ Смотреть VIP-урок', '▶ Skatīties VIP nodarbību'][L]; });
    document.querySelectorAll('.vc.vip').forEach(c => {
      const w = vs.find(x => x.key === (c.dataset.vk || 'review')); if (!w) return; // data-vk — добавленные в кабинете; без него — «Обзор акварели»
      c.dataset.yt = w.id; c.href = 'https://youtu.be/' + w.id;
      c.querySelector('.pl').textContent = '▶';
      c.querySelector('.vip-st').textContent = ['VIP lesson · open for you', 'VIP-урок · открыт для тебя', 'VIP nodarbība · atvērta tev'][L];
      c.querySelector('.go').textContent = ['Watch →', 'Смотреть →', 'Skatīties →'][L];
    });
  }).catch(() => {});

  // журнал: 4 последние статьи блога
  const box = document.getElementById('v2-blog');
  if (box) fetch('/api/blog/home?lang=' + lang).then(r => r.ok ? r.json() : null).then(d => {
    const list = (d && (d.recent || [d.latest].concat(d.featured || []))) || [];
    const posts = list.filter(Boolean).slice(0, 4); // крупно одна + справа три
    if (!posts.length) { box.closest('section').hidden = true; return; }
    const meta = p => `<span class="meta">${p.tags && p.tags[0] ? `<i>${esc(p.tags[0])}</i> · ` : ''}${esc(p.date)}</span>`;
    const pic = (p, cls) => p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy"${cls ? ` class="${cls}"` : ''}>` : '';
    const [a, ...rest] = posts;
    box.innerHTML = `<a class="feat" href="${esc(a.url)}"><div class="im">${pic(a)}</div><div class="card">${meta(a)}<h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p></div></a>`
      + `<div>${rest.map(p => `<a class="post" href="${esc(p.url)}"><div>${meta(p)}<h3>${esc(p.title)}</h3><p>${esc(String(p.excerpt || '').slice(0, 110))}${String(p.excerpt || '').length > 110 ? '…' : ''}</p></div>${pic(p)}</a>`).join('')}</div>`;
  }).catch(() => { box.closest('section').hidden = true; });

  // своя статистика посетителей (как в site.js)
  try {
    // на страницах со старыми скриптами (src/layout-v2-lab.html) посещение уже считает site.js
    if (!navigator.webdriver && !/^(localhost|127\.)/.test(location.hostname) && !document.querySelector('script[src*="/assets/site.js"]')) {
      const body = JSON.stringify({ p: location.pathname, r: document.referrer, u: {}, w: screen.width, t: navigator.maxTouchPoints > 1 });
      if (!(navigator.sendBeacon && navigator.sendBeacon('/api/hit', new Blob([body], { type: 'application/json' })))) fetch('/api/hit', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
    }
  } catch (e) {}

  // нажатие на ссылку книги на Amazon — для «🗓 Недели» в кабинете (worker/week.js); один обработчик на страницу
  try {
    if (!window.PPOut && !navigator.webdriver && !/^(localhost|127\.)/.test(location.hostname)) {
      window.PPOut = 1;
      document.addEventListener('click', e => {
        const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
        let h = ''; try { h = new URL(a.href, location.href).hostname.replace(/^www\./, ''); } catch (x) { return; }
        if (!/(^|\.)amazon\.[a-z.]+$|^a\.co$/.test(h)) return;
        const body = JSON.stringify({ o: 'amazon', p: location.pathname, h: a.href });
        if (!(navigator.sendBeacon && navigator.sendBeacon('/api/hit', new Blob([body], { type: 'application/json' })))) fetch('/api/hit', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
      }, true);
    }
  } catch (e) { /* статистика не должна ломать сайт */ }
})();
