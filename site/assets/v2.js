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
  const COL = { winter: '#9E1B22', spring: '#BE2F3A', summer: '#D2452B', autumn: '#C04A1C' };
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function season(s, save) {
    if (!T[s]) return;
    html.setAttribute('data-season', s);
    if (save) try { localStorage.setItem('pp_season', s); } catch (e) {}
    document.querySelectorAll('.switch button').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === s ? 'true' : 'false'));
    document.querySelectorAll('[data-sv]').forEach(el => { el.textContent = T[s][el.dataset.sv][L]; });
    const img = document.getElementById('v2-hero');
    if (img) { img.srcset = `/images/v2/hero-${s}-900.jpg 900w, /images/v2/hero-${s}.jpg 1800w`; img.src = `/images/v2/hero-${s}.jpg`; }
  }
  document.querySelectorAll('.switch button').forEach(b => {
    b.style.background = COL[b.dataset.s];
    b.addEventListener('click', () => season(b.dataset.s, true));
  });
  season(html.getAttribute('data-season'));

  // меню на телефоне
  const burger = document.querySelector('.burger'), drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => { const o = drawer.hidden; drawer.hidden = !o; burger.setAttribute('aria-expanded', String(o)); burger.textContent = o ? '✕' : '☰'; });
    drawer.addEventListener('click', e => { if (e.target.closest('a')) { drawer.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.textContent = '☰'; } });
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
    acct.href = pre + '/bird/#room';
    acct.innerHTML = `<canvas width="16" height="16" aria-hidden="true"></canvas><span>${esc(u.nick || ['My bird', 'Моя птичка', 'Mans putniņš'][L])}</span>`;
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
  });

  // подписи бесплатных уроков — по названию видео на YouTube (/api/v2/yt); известные — на языке страницы
  const NAMES = [[/pepper|перец|перц/i, ['Pepper sketching', 'Скетч перца', 'Pipara skice']], [/caf[eé]|outdoor|кафе/i, ['Outdoor sketching in a cafe', 'Скетч на выезде: кафе', 'Skices ārpus mājām: kafejnīca']]];
  document.querySelectorAll('[data-yt]').forEach(a => {
    const b = a.querySelector('b'); if (!b) return;
    fetch('/api/v2/yt?id=' + encodeURIComponent(a.dataset.yt)).then(r => r.ok ? r.json() : null).then(d => {
      const t = d && d.title; if (!t) return;
      const k = NAMES.find(n => n[0].test(t)), name = k ? k[1][L] : t;
      b.textContent = name; const im = a.querySelector('img'); if (im) im.alt = name;
    }).catch(() => {});
  });

  // VIP-видео: только вошедшим (/api/v2/vip), гостю остаётся «Войти бесплатно»
  if (document.querySelector('.vip-go, .vc.vip')) fetch('/api/v2/vip', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => {
    const v = d && d.videos && d.videos[0];
    if (!v) return;
    document.querySelectorAll('.vip-go').forEach(b => { b.dataset.yt = v.id; b.href = 'https://youtu.be/' + v.id; b.textContent = ['▶ Watch the VIP lesson', '▶ Смотреть VIP-урок', '▶ Skatīties VIP nodarbību'][L]; });
    document.querySelectorAll('.vc.vip').forEach(c => {
      c.dataset.yt = v.id; c.href = 'https://youtu.be/' + v.id;
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
})();
