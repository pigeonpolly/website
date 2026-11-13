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
  const acct = document.getElementById('acct2'), verEl = document.querySelector('.ft2 .ver');
  if (acct || verEl) fetch('/api/whoami', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => {
    const u = d && d.user;
    // номер версии сайта в подвале — только админу; если на сервере уже новее — подсказка обновить страницу
    const vEl = u && u.admin && verEl;
    if (vEl) {
      vEl.hidden = false;
      fetch('/assets/version.json?t=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(v => {
        if (v && v.n > +vEl.dataset.ver) vEl.textContent += ' · ' + ['on server: v', 'на сервере: v', 'serverī: v'][L] + v.n + ' — ' + ['reload', 'обнови страницу', 'pārlādē'][L];
        else if (v) vEl.textContent += ' ✓';
      }).catch(() => {});
    }
    if (!acct) return;
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
    const b = a.querySelector('b, h1'); if (!b || a.dataset.own) return;
    fetch('/api/v2/yt?id=' + encodeURIComponent(a.dataset.yt || a.dataset.ytn)).then(r => r.ok ? r.json() : null).then(d => {
      const t = d && d.title; if (!t) return;
      const k = NAMES.find(n => n[0].test(t)), name = k ? k[1][L] : t;
      b.textContent = name; const im = a.querySelector('img'); if (im) im.alt = name;
      if (b.tagName === 'H1') document.title = name + ' · Pigeon Polly Art Lab';
    }).catch(() => {});
  };
  document.querySelectorAll('[data-yt]').forEach(ytName);

  // добавленное в кабинете «🎬 Видео и гайды» (/api/v2/guides, worker/guides.js): новое — первым
  const G = { free: ['Open to all', 'Открыто всем', 'Atvērts visiem'], vid: ['Video lesson · open to everyone', 'Видеоурок · открыт всем', 'Video nodarbība · atvērta visiem'],
    watch: ['Watch →', 'Смотреть →', 'Skatīties →'], lock: ['Sign in to watch', 'Войдите, чтобы смотреть', 'Ienāc, lai skatītos'], signin: ['Sign in →', 'Войти →', 'Ienākt →'],
    pdf: ['Free PDF', 'Бесплатный PDF', 'Bezmaksas PDF'], dl: ['Download free →', 'Скачать бесплатно →', 'Lejupielādēt bez maksas →'],
    amz: ['Amazon', 'Amazon', 'Amazon'], onAmz: ['On Amazon →', 'На Amazon →', 'Amazon →'],
    guide: ['Book', 'Книга', 'Grāmata'], soon: ['Soon', 'Скоро', 'Drīzumā'], soonS: ['Coming soon to the site', 'Скоро на сайте', 'Drīzumā vietnē'], soonB: ['Coming soon', 'Скоро выйдет', 'Drīzumā'], vipOpen: ['Insider lesson · open for you', 'Урок для своих · открыт для тебя', 'Nodarbība saviem · atvērta tev'],
    all: ['All', 'Все', 'Visas'], course: ['Courses', 'Курсы', 'Kursi'], howto: ['Cheat sheets', 'Шпаргалки', 'Špikeri'], vipB: ['For insiders', 'Для своих', 'Saviem'], openAll: ['Open to all', 'Открытые всем', 'Atvērti visiem'], allT: ['Everything', 'Всё', 'Viss'], vidF: ['Videos', 'Видео', 'Video'],
    accL: ['Access', 'Доступ', 'Pieeja'], lngL: ['Language', 'Язык', 'Valoda'], l3: ['In 3 languages', 'На 3 языках', '3 valodās'], l3o: ['Also in', 'Есть и на', 'Ir arī'], typL: ['Type', 'Вид', 'Veids'], tpV: ['Video', 'Видео', 'Video'], tpC: ['Course', 'Курс', 'Kurss'],
    noneE: ['Nothing here yet with these filters.', 'С такими фильтрами пока ничего нет.', 'Ar šiem filtriem pagaidām nekā nav.'], cs: ['Cheat sheet', 'Шпаргалка', 'Špikeris'], pg: [n => `${n} ${n === 1 ? 'page' : 'pages'}`, n => `страниц: ${n}`, n => `lpp.: ${n}`],
    pdfO: ['Open the PDF ↗', 'Открыть PDF ↗', 'Atvērt PDF ↗'], hwLock: ['This cheat sheet is for insiders. Sign in for free and it opens right here.', 'Эта шпаргалка — для своих. Войдите бесплатно — и она откроется прямо здесь.', 'Šis špikeris ir saviem. Ienāc bez maksas, un tas atvērsies tepat.'],
    courseE: ['Courses are several lessons in a row on one theme. The first one is on its way!', 'Курсы — несколько уроков подряд на одну тему. Первый уже в работе!', 'Kursi ir vairākas nodarbības pēc kārtas par vienu tēmu. Pirmais jau top!'],
    howtoE: ['Short guides, a couple of pages each: how to draw one thing, step by step. The first ones are on their way!', 'Короткие гайды на пару страниц: как нарисовать что-то одно, шаг за шагом. Первые уже в работе!', 'Īsi ceļveži pa pāris lappusēm: kā soli pa solim uzzīmēt vienu lietu. Pirmie jau top!'], freeF: ['Free', 'Бесплатные', 'Bezmaksas'], fl: ['Filter lessons', 'Фильтр уроков', 'Filtrēt nodarbības'],
    allOpen: ['🔓 Everything is open for you', '🔓 Тебе открыто всё', '🔓 Tev atvērts viss'],
    vipN: [n => `${n} insider ${n === 1 ? 'lesson opens' : 'lessons open'} after a free sign-in`, n => `Уроков «для своих»: ${n} — откроются после бесплатного входа`, n => `Nodarbības «saviem»: ${n} — atvērsies pēc bezmaksas ienākšanas`],
    youN: [n => `Open for you · ${n} insider ${n === 1 ? 'lesson' : 'lessons'}`, n => `Тебе открыто · уроков «для своих»: ${n}`, n => `Tev atvērts · nodarbības «saviem»: ${n}`], open: ['Open →', 'Открыть →', 'Atvērt →'], vidT: ['Video lesson', 'Видеоурок', 'Video nodarbība'] };
  const tOf = x => (x.t && (x.t[lang] || x.t.en || x.t.ru || x.t.lv)) || '';
  const ext = u => /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : '';
  const own = x => tOf(x) ? ' data-own="1"' : '';
  // язык видео / шпаргалки (кабинет: галочки EN RU LV; собранные в конструкторе — все три): data-l для фильтра «Язык», подпись на карточке
  const LN = { en: 'EN', ru: 'RU', lv: 'LV' }, lgs = x => (x.langs || []).filter(l => LN[l]);
  const dl = x => ` data-l="${lgs(x).join(' ')}"`, lgT = x => lgs(x).length === 3 ? ' · 🌍 ' + G.l3[L] : lgs(x).length ? ' · ' + lgs(x).map(l => LN[l]).join(' · ') : '';
  // страница видео /learn/v/<id>/ и «просмотрено» (localStorage pp-yt-seen — id YouTube; у каждого браузера свой)
  const vurl = x => `${pre}/learn/v/${encodeURIComponent(x.id)}/`;
  // вошедшему — в профиле (/api/v2/seen, users.yt_seen), гостю — в браузере; после входа отметки гостя переезжают в профиль
  const SEEN = (() => { try { return new Set(JSON.parse(localStorage.getItem('pp-yt-seen') || '[]')); } catch (e) { return new Set(); } })();
  let seenAcc = false;
  const seenPost = b => fetch('/api/v2/seen', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).catch(() => {});
  const seenSet = (id, on) => {
    if (on) SEEN.add(id); else SEEN.delete(id);
    if (seenAcc) seenPost(on ? { add: [id] } : { del: [id] });
    else try { localStorage.setItem('pp-yt-seen', JSON.stringify([...SEEN].slice(-500))); } catch (e) {}
  };
  const isSeen = x => !!(x.yt && SEEN.has(x.yt));
  const W = { seen: ['✓ Watched', '✓ Просмотрено', '✓ Noskatīts'], mark: ['Mark as watched', 'Отметить как просмотренное', 'Atzīmēt kā noskatītu'],
    hide: ['Hide watched', 'Скрыть просмотренные', 'Paslēpt noskatītos'], vid: ['Video', 'Видео', 'Video'], nf: ['This video is not here any more.', 'Этого видео здесь больше нет.', 'Šī video šeit vairs nav.'],
    all: ['See all videos', 'Все видео', 'Visi video'], soonP: ['This video is coming soon. Come back in a little while!', 'Это видео скоро появится. Загляните чуть позже!', 'Šis video drīzumā būs. Ienāc nedaudz vēlāk!'],
    lockP: ['This video is for insiders. Sign in for free and it opens right here.', 'Это видео — для своих. Войдите бесплатно — и оно откроется прямо здесь.', 'Šis video ir saviem. Ienāc bez maksas, un tas atvērsies tepat.'],
    signin: ['Sign in for free', 'Войти бесплатно', 'Ienākt bez maksas'], yt: ['Open on YouTube', 'Открыть на YouTube', 'Atvērt YouTube'], play: ['Play the video', 'Включить видео', 'Atskaņot video'] };
  const guidesReady = fetch('/api/v2/guides', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).catch(() => null).then(d => {
    if (d && Array.isArray(d.seen)) { // вошёл: отметки из профиля + перенос отметок гостя
      seenAcc = true;
      const local = [...SEEN].filter(id => !d.seen.includes(id));
      SEEN.clear(); d.seen.forEach(id => SEEN.add(id)); local.forEach(id => SEEN.add(id));
      if (local.length) seenPost({ add: local });
      try { localStorage.removeItem('pp-yt-seen'); } catch (e) {}
    }
    const items = (d && d.items) || [], vids = items.filter(x => x.kind === 'video'), free = vids.filter(x => !x.vip), vip = vids.filter(x => x.vip), books = items.filter(x => x.kind === 'book'), hws = items.filter(x => x.kind === 'howto');
    const ytCard = x => `<a class="vc yt" href="https://youtu.be/${esc(x.yt)}" data-yt="${esc(x.yt)}"${own(x)} target="_blank" rel="noopener"><span class="th"><img src="${esc(x.cover)}" alt="${esc(tOf(x))}" loading="lazy"><span class="bd">${G.free[L]}</span><span class="pl" aria-hidden="true">▶</span></span><span class="tx"><b>${esc(tOf(x) || G.vidT[L])}</b><small>${G.vid[L]}</small><span class="go">${G.watch[L]}</span></span></a>`;
    // /learn/: каталог всех уроков с фильтрами; VIP гостю — размыто и с замочком, вошедшему — открыто
    const op = !!(d && d.open), fg = document.querySelector('#free .vg2');
    const card = x => {
      const lock = x.vip && !op, nm = esc(tOf(x) || G.vidT[L]);
      if (x.soon) return `<div class="vc soon" data-f="${x.vip ? 'vip' : 'free'}" data-c="video"${dl(x)}><span class="tp">${G.tpV[L]}</span><span class="th">${x.cover ? `<img src="${esc(x.cover)}" alt="" loading="lazy">` : ''}<span class="bd">${x.vip ? G.vipB[L] + ' · ' : ''}${G.soon[L]}</span><span class="pl" aria-hidden="true">⏳</span></span>`
        + `<span class="tx"><b>${nm}</b><small>${G.soonS[L]}${lgT(x)}</small></span></div>`; // «скоро»: видео ещё нет
      const sn = !lock && isSeen(x);
      return `<a class="vc${lock ? ' lock' : ''}${sn ? ' seen' : ''}" data-f="${x.vip ? 'vip' : 'free'}" data-c="video"${dl(x)} href="${vurl(x)}"${lock ? '' : ` data-ytn="${esc(x.yt)}"`}${own(x)}>`
        + `<span class="tp">${G.tpV[L]}</span><span class="th"><img src="${esc(x.cover)}" alt="" loading="lazy"><span class="bd">${x.vip ? G.vipB[L] : G.free[L]}</span>${sn ? `<span class="sn">${W.seen[L]}</span>` : ''}<span class="pl" aria-hidden="true">${lock ? '🔒' : '▶'}</span></span>`
        + `<span class="tx"><b>${nm}</b><small>${x.vip ? (lock ? G.lock[L] : G.vipOpen[L]) : G.vid[L]}${lgT(x)}</small><span class="go">${lock ? G.signin[L] : G.watch[L]}</span></span></a>`;
    };
    // курсы на сайте (не видео): Школа Полли /polly-helps/
    const COURSES = [{ u: '/polly-helps/', img: '/images/school/course-cover.jpg', t: ['Polly’s Drawing School', 'Школа Полли', 'Pollijas skola'],
      s: ['Course · 12 short lessons and a diploma', 'Курс · 12 коротких уроков и диплом', 'Kurss · 12 īsas nodarbības un diploms'] }];
    const crs = x => `<a class="vc crs" data-f="free" data-c="course" data-l="en ru lv" href="${pre}${x.u}"><span class="tp">${G.tpC[L]}</span><span class="th"><img src="${x.img}" alt="" loading="lazy"><span class="bd">${G.free[L]}</span></span>`
      + `<span class="tx"><b>${x.t[L]}</b><small>${x.s[L]} · 🌍 ${G.l3[L]}</small><span class="go">${G.open[L]}</span></span></a>`;
    // шпаргалки (кабинет → «📝 Шпаргалка»): страницы-картинки или PDF, своя страница /learn/v/<id>/
    const hwCard = x => { const lock = x.vip && !op;
      return `<a class="vc hw${lock ? ' lock' : ''}${x.built ? ' blt' : ''}" data-f="${x.vip ? 'vip' : 'free'}" data-c="howto"${dl(x)} href="${vurl(x)}"><span class="tp">${G.cs[L]}</span><span class="th">${x.cover ? `<img src="${esc(x.cover)}" alt="" loading="lazy">` : ''}<span class="bd">${x.vip ? G.vipB[L] : G.free[L]}</span><span class="pl" aria-hidden="true">${lock ? '🔒' : '✎'}</span></span>`
        + `<span class="tx"><b>${esc(tOf(x))}</b><small>${G.cs[L]}${x.pdf ? ' · PDF' : x.pages ? ' · ' + G.pg[L](x.pages) : ''}${lgT(x)}</small><span class="go">${lock ? G.signin[L] : G.open[L]}</span></span></a>`; };
    if (fg && (vids.length || hws.length)) {
      const more = fg.querySelector('.vc.more');
      fg.innerHTML = vids.map(card).join('') + hws.map(hwCard).join('') + COURSES.map(crs).join(''); if (more) fg.appendChild(more);
      fg.querySelectorAll('[data-ytn]').forEach(ytName);
      // два фильтра вместе: доступ (все / открытые всем / для своих) и вид (видео / курс / шпаргалка); числа — с учётом другого фильтра
      const FA = [['all', G.all[L]], ['free', G.openAll[L]], ['vip', G.vipB[L]]], FT = [['all', G.allT[L]], ['video', G.vidF[L]], ['course', G.course[L]], ['howto', G.howto[L]]];
      const FL = [['all', G.all[L]], ['en', 'English'], ['ru', 'Русский'], ['lv', 'Latviešu']];
      const grp = (g, lb, F) => `<div class="flt-g" role="group" aria-label="${lb}"><span class="flt-l">${lb}</span>${F.map(([k, n], i) => `<button type="button" data-g="${g}" data-k="${k}" aria-pressed="${i ? 'false' : 'true'}">${n} <i></i></button>`).join('')}</div>`;
      fg.insertAdjacentHTML('beforebegin', `<div class="flt">${grp('a', G.accL[L], FA)}${grp('t', G.typL[L], FT)}${grp('l', G.lngL[L], FL)}<div class="flt-g flt-x">`
        + (SEEN.size ? `<label class="flt-sn"><input type="checkbox"> ${W.hide[L]}</label>` : '')
        + `<span class="flt-st">${op ? G.allOpen[L] : `🔒 ${G.vipN[L](vip.length + hws.filter(x => x.vip).length)} · <a href="#signin">${G.signin[L]}</a>`}</span></div></div>`);
      fg.insertAdjacentHTML('afterend', '<p class="flt-empty" hidden></p>');
      const bar = fg.previousElementSibling, hs = bar.querySelector('.flt-sn input'), emp = fg.nextElementSibling;
      const st = { a: 'all', t: 'all', l: 'all' }, cards = [...fg.querySelectorAll('.vc[data-f]')];
      const fits = (c, a, t, h, l = st.l) => (a === 'all' || c.dataset.f === a) && (t === 'all' || c.dataset.c === t) && (l === 'all' || (c.dataset.l || '').split(' ').includes(l)) && !(h && c.classList.contains('seen'));
      const apply = () => {
        const h = !!(hs && hs.checked);
        let n = 0;
        cards.forEach(c => { c.hidden = !fits(c, st.a, st.t, h); if (!c.hidden) n++; });
        if (more) more.hidden = st.a !== 'all' || st.t !== 'all' || st.l !== 'all';
        bar.querySelectorAll('button').forEach(b => { b.setAttribute('aria-pressed', st[b.dataset.g] === b.dataset.k ? 'true' : 'false');
          b.querySelector('i').textContent = cards.filter(c => b.dataset.g === 'a' ? fits(c, b.dataset.k, st.t, h) : b.dataset.g === 't' ? fits(c, st.a, b.dataset.k, h) : fits(c, st.a, st.t, h, b.dataset.k)).length; });
        emp.hidden = !!n; if (!n) emp.textContent = (st.l === 'all' && G[st.t + 'E'] || G.noneE)[L];
      };
      if (hs) { try { hs.checked = localStorage.getItem('pp-yt-hide') === '1'; } catch (e) {} hs.addEventListener('change', () => { try { localStorage.setItem('pp-yt-hide', hs.checked ? '1' : '0'); } catch (e) {} apply(); }); }
      bar.addEventListener('click', e => {
        const b = e.target.closest('button[data-g]'); if (!b) return;
        st[b.dataset.g] = b.dataset.k; apply();
      });
      apply();
    }
    // /learn/: блок VIP — список VIP-уроков: вошедшему открыт («тебе открыто»), гостю размыт
    const vg = document.querySelector('.vg2.vip1');
    if (vg && vip.length) {
      vg.className = 'vl' + (op ? '' : ' lock');
      vg.innerHTML = `<p class="vl-h">${op ? G.youN[L](vip.length) : G.vipN[L](vip.length)}</p>` + vip.map(x => {
        const nm = esc(tOf(x) || G.vidT[L]);
        if (x.soon) return `<div class="vr soon"><span class="th">${x.cover ? `<img src="${esc(x.cover)}" alt="" loading="lazy">` : ''}</span><b>${nm}</b><em title="${G.soon[L]}">⏳</em></div>`;
        return op ? `<a class="vr${isSeen(x) ? ' seen' : ''}" href="${vurl(x)}" data-ytn="${esc(x.yt)}"${own(x)}><span class="th"><img src="${esc(x.cover)}" alt="" loading="lazy"></span><b>${nm}</b><em>${isSeen(x) ? '✓' : '▶'}</em></a>`
          : `<a class="vr" href="#signin"><span class="th"><img src="${esc(x.cover)}" alt="" loading="lazy"></span><b>${nm}</b><em>🔒</em></a>`;
      }).join('');
      vg.querySelectorAll('[data-ytn]').forEach(ytName);
      const al = vg.closest('.al'), k = al && al.querySelector('.k'), pp = al && al.querySelector('h2 + p');
      if (op && k) k.textContent = ['You are signed in', 'Вход выполнен', 'Laipni lūdzam'][L];
      if (op && pp) pp.innerHTML = [`All insider lessons are open for you, right here. Want to support my work? <a href="${pre}/books/">Get one of my books</a>.`, `Все уроки для своих открыты, смотрите прямо здесь. Хотите поддержать меня? <a href="${pre}/books/">Купите одну из моих книг</a>.`, `Visas nodarbības saviem ir atvērtas, skaties tepat. Gribi atbalstīt manu darbu? <a href="${pre}/books/">Iegādājies kādu no manām grāmatām</a>.`][L];
    }
    // главная: две плитки бесплатных уроков — самые новые
    const tiles = [...document.querySelectorAll('#lessons .t.yt')];
    free.filter(x => !x.soon).slice(0, tiles.length).forEach((x, i) => {
      const a = tiles[i]; a.href = vurl(x); delete a.dataset.yt; a.removeAttribute('target'); a.dataset.ytn = x.yt;
      const im = a.querySelector('img'); if (im) { im.src = x.cover; im.alt = tOf(x); }
      const b = a.querySelector('b'); if (b) b.textContent = tOf(x) || G.vidT[L];
      if (tOf(x)) a.dataset.own = 1; else ytName(a);
    });
    // страница одного видео /learn/v/<id>/ (src/pages/watch.html): плеер, название, описание, «просмотрено», ещё видео
    const wm = document.querySelector('.wv-main');
    if (wm) {
      const key = decodeURIComponent((location.pathname.match(/\/learn\/v\/([\w-]+)/) || [])[1] || '');
      const x = vids.find(v => v.id === key || (v.yt && v.yt === key)), hx = !x && hws.find(v => v.id === key);
      if (hx) { // шпаргалка: страницы друг под другом или PDF во весь блок
        const lock = hx.vip && !op, nm = tOf(hx), d = (hx.d && (hx.d[lang] || hx.d.en || hx.d.ru || hx.d.lv)) || '';
        document.title = nm + ' · Pigeon Polly Art Lab';
        const f = hx.files || [];
        // собранная в конструкторе: блоки в стиле главной (.cs-sheet, v2.css), всегда на 3 языках — ссылки на другие языки
        const bt = b => (b.t && (b.t[lang] || b.t.en || b.t.ru || b.t.lv)) || '';
        const paras = s => s.split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
        let sn = 0;
        const blk = b => { const im = b.img ? `<img src="${esc(b.img)}" alt="${esc(bt(b).split('\n')[0])}" loading="lazy">` : '', t = bt(b), w = b.w === 'half' ? ' half' : '';
          if (b.k === 'h') return `<h2 class="cs-b cs-h">${esc(t)}</h2>`;
          if (b.k === 'p') return `<div class="cs-b cs-p${w}">${paras(t)}</div>`;
          if (b.k === 'img') return `<figure class="cs-b cs-img${w}">${im}${t ? `<figcaption>${esc(t)}</figcaption>` : ''}</figure>`;
          if (b.k === 'step') return `<div class="cs-b cs-step${w}"><span class="cs-n">${++sn}</span>${im}${t ? `<div class="cs-st">${paras(t)}</div>` : ''}</div>`;
          if (b.k === 'tip') return `<aside class="cs-b cs-tip${w}">${paras(t)}</aside>`;
          if (b.k === 'list') return `<ul class="cs-b cs-list${w}">${t.split('\n').filter(s => s.trim()).map(s => `<li>${esc(s.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul>`;
          return ''; };
        const l3 = hx.built ? `<p class="cs-l3">🌍 ${G.l3[L]} · ${G.l3o[L]} ${['en', 'ru', 'lv'].filter(l => l !== lang).map(l => `<a href="${l === 'en' ? '' : '/' + l}/learn/v/${encodeURIComponent(hx.id)}/" hreflang="${l}">${LN[l]}</a>`).join(' · ')}</p>` : '';
        const body = lock ? `<a class="wv-pl lock" href="#signin">${hx.cover ? `<img src="${esc(hx.cover)}" alt="">` : ''}<span class="pl" aria-hidden="true">🔒</span></a><p class="wv-note">${G.hwLock[L]}</p><a class="btn pri" href="#signin">${W.signin[L]}</a>`
          : hx.built ? `<div class="cs-sheet">${(hx.blocks || []).map(blk).join('')}</div>`
          : hx.pdf ? `<div class="hw-pdf"><iframe src="${esc(f[0] || '')}" title="${esc(nm)}"></iframe></div><p><a class="btn pri" href="${esc(f[0] || '')}" target="_blank" rel="noopener">${G.pdfO[L]}</a></p>`
          : `<div class="hw-pages">${f.map((u, i) => `<img src="${esc(u)}" alt="${esc(nm)} · ${i + 1}" loading="${i ? 'lazy' : 'eager'}">`).join('')}</div>`;
        wm.innerHTML = `<div class="wv-tx" data-own="1"><p class="wv-k"><span class="bd2">${hx.vip ? G.vipB[L] : G.cs[L]}</span></p><h1>${esc(nm)}</h1>` + l3
          + (d ? `<div class="wv-d">${d.split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('')}</div>` : '') + '</div>' + body;
        wm.classList.add('hw-main');
      } else if (!x) { wm.innerHTML = `<p class="wv-wait">${W.nf[L]}</p><a class="btn pri" href="${pre}/learn/">${W.all[L]}</a>`; }
      else {
        const lock = x.vip && !op, nm = tOf(x) || W.vid[L];
        document.title = nm + ' · Pigeon Polly Art Lab';
        const d = (x.d && (x.d[lang] || x.d.en || x.d.ru || x.d.lv)) || '';
        const desc = d ? d.split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('') : '';
        const stage = x.soon ? `<div class="wv-pl soon">${x.cover ? `<img src="${esc(x.cover)}" alt="">` : ''}<span class="pl" aria-hidden="true">⏳</span></div>`
          : lock ? `<a class="wv-pl lock" href="#signin"><img src="${esc(x.cover)}" alt=""><span class="pl" aria-hidden="true">🔒</span></a>`
          : `<button type="button" class="wv-pl" aria-label="${W.play[L]}"><img src="${esc(x.cover)}" alt=""><span class="pl" aria-hidden="true">▶</span></button>`;
        const note = x.soon ? `<p class="wv-note">${W.soonP[L]}</p>` : lock ? `<p class="wv-note">${W.lockP[L]}</p><a class="btn pri" href="#signin">${W.signin[L]}</a>` : '';
        wm.innerHTML = stage + `<div class="wv-tx"${x.yt && !tOf(x) ? ` data-ytn="${esc(x.yt)}"` : ' data-own="1"'}><p class="wv-k"><span class="bd2">${x.vip ? G.vipB[L] : G.free[L]}</span>${x.soon ? ` · ${G.soon[L]}` : ''}${lgT(x)}</p><h1>${esc(nm)}</h1>`
          + (lock || x.soon ? '' : `<div class="wv-act"><button type="button" class="wv-seen" aria-pressed="false"></button><a class="wv-yt" href="https://youtu.be/${esc(x.yt)}" target="_blank" rel="noopener">${W.yt[L]} ↗</a></div>`)
          + note + (desc ? `<div class="wv-d">${desc}</div>` : '') + '</div>';
        const tx = wm.querySelector('.wv-tx'); if (tx.dataset.ytn) ytName(tx);
        const sb = wm.querySelector('.wv-seen');
        const mark = (on, save) => { if (save !== false) seenSet(x.yt, on); if (sb) { sb.setAttribute('aria-pressed', on ? 'true' : 'false'); sb.textContent = on ? W.seen[L] : W.mark[L]; } };
        if (sb) { mark(isSeen(x), false); sb.addEventListener('click', () => mark(!isSeen(x))); }
        const pb = wm.querySelector('button.wv-pl');
        if (pb) pb.addEventListener('click', () => {
          const fr = document.createElement('div'); fr.className = 'wv-pl on';
          fr.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(x.yt)}?autoplay=1&rel=0&hl=${lang}" title="${esc(nm)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
          pb.replaceWith(fr); mark(true);
          try { localStorage.setItem('pp-yt-last', x.yt); } catch (e) {} // «последний просмотренный» в кабинете (cabinet.js)
        });
      }
      const mg = document.querySelector('.wv-more .vg2'), rest = vids.filter(v => v !== x && !v.soon);
      const pick = [...rest.filter(v => !isSeen(v)), ...rest.filter(isSeen)].slice(0, 3); // сначала непросмотренные
      if (mg && pick.length) { mg.innerHTML = pick.map(card).join(''); mg.querySelectorAll('[data-ytn]').forEach(ytName); mg.closest('section').hidden = false; }
    }
    // /books/: полка — новые книги первыми
    const shelf = document.querySelector('.shelf');
    if (shelf && books.length) shelf.insertAdjacentHTML('afterbegin', books.map(x => {
      const k = x.soon ? ['soon', G.soonB[L], x.url ? G.open[L] : G.soon[L]] : x.free ? ['free', G.pdf[L], G.dl[L]] : /amazon\.|a\.co\//.test(x.url) ? ['buy', G.amz[L], G.onAmz[L]] : ['buy', G.guide[L], G.open[L]];
      return `<a class="gb ${k[0]}"${x.url ? ` href="${esc(x.url)}"${ext(x.url)}` : ''}><span class="cvr"><img src="${esc(x.cover)}" alt="" loading="lazy"></span><span class="lbl2">${k[1]}</span><b>${esc(tOf(x))}</b><span class="go">${k[2]}</span></a>`;
    }).join(''));
    // главная: блок «Книги» — три обложки, новые первыми
    const bk = document.querySelector('.books');
    if (bk && books.length) {
      const old = [...bk.querySelectorAll('a[class^="b"]')];
      const add = books.slice(0, 3).map(x => { const a = document.createElement('a'); if (x.url) a.href = x.url; if (/^https?:/.test(x.url)) { a.target = '_blank'; a.rel = 'noopener'; } a.innerHTML = (x.soon ? `<span class="lbl">${G.soon[L]}</span>` : '') + `<img src="${esc(x.cover)}" alt="${esc(tOf(x))}" loading="lazy">`; return a; });
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
    document.querySelectorAll('.vip-go').forEach(b => { b.dataset.yt = v.id; b.href = 'https://youtu.be/' + v.id; b.textContent = ['▶ Watch the insider lesson', '▶ Смотреть урок для своих', '▶ Skatīties nodarbību saviem'][L]; });
    document.querySelectorAll('.vc.vip').forEach(c => {
      const w = vs.find(x => x.key === (c.dataset.vk || 'review')); if (!w) return; // data-vk — добавленные в кабинете; без него — «Обзор акварели»
      c.dataset.yt = w.id; c.href = 'https://youtu.be/' + w.id;
      c.querySelector('.pl').textContent = '▶';
      c.querySelector('.vip-st').textContent = G.vipOpen[L];
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
      + `<div>${rest.map(p => `<a class="post${p.courier ? ' cr' : ''}" href="${esc(p.url)}"><div>${p.courier ? '<span class="cr-tag">Art Coo-rier</span>' : ''}${meta(p)}<h3>${esc(p.title)}</h3><p>${esc(String(p.excerpt || '').slice(0, 110))}${String(p.excerpt || '').length > 110 ? '…' : ''}</p></div>${pic(p)}</a>`).join('')}</div>`;
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
