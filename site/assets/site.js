// Меню (☰ на телефоне, подменю Art Portfolio) и просмотр картинок галереи на весь экран
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open);
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    });
  }
  document.querySelectorAll('.sub-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.parentElement;
      const open = !li.classList.contains('open');
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });
  // телефон (☰ — аккордеон): раздел текущей страницы раскрыт (build.py ставит .open-cur)
  const narrow = () => window.matchMedia('(max-width: 1300px)').matches;
  if (narrow()) document.querySelectorAll('.has-sub.open-cur').forEach(li => li.classList.add('open'));
  // адвент в «Играть»: с 1.10 по 23.01 — первым и со счётчиком (до 1.12 — сколько дней, в декабре — окошко дня, в январе — догнать пропущенное)
  document.querySelectorAll('.nav-sub [data-adv]').forEach(li => {
    const d = new Date(), m = d.getMonth() + 1, day = d.getDate(), L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
    if (!(m >= 10 || (m === 1 && day <= 23))) return;
    const left = Math.ceil((new Date(d.getFullYear(), 11, 1) - new Date(d.getFullYear(), m - 1, day)) / 864e5);
    const txt = m === 12 ? [`window ${day} of 31`, `окошко ${day} из 31`, `lodziņš ${day} no 31`][L]
      : m === 1 ? ['catch up till 23.01', 'догнать до 23.01', 'panākt līdz 23.01'][L]
      : [`in ${left} days`, `через ${left} дн.`, `pēc ${left} d.`][L];
    const b = document.createElement('b'); b.className = 'ns-c'; b.textContent = txt;
    li.querySelector('a').appendChild(b);
    li.parentElement.prepend(li);
  });
  document.addEventListener('click', e => {
    document.querySelectorAll('.has-sub.open').forEach(li => {
      if (!li.contains(e.target) && !narrow()) {
        li.classList.remove('open');
        li.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Всплывающие окна: кнопка с data-open="id" открывает <dialog id="id">
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = document.getElementById(btn.dataset.open);
      if (!d || !d.showModal) return;
      d.showModal();
      document.body.classList.add('modal-open');
      history.replaceState(null, '', '#' + d.id);
    });
  });
  document.querySelectorAll('dialog.modal').forEach(d => {
    d.querySelector('.modal-close')?.addEventListener('click', () => d.close());
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    d.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (location.hash === '#' + d.id) history.replaceState(null, '', location.pathname);
    });
  });
  // прямая ссылка на проект: /projects/#p-...
  if (location.hash) {
    const d = document.getElementById(location.hash.slice(1));
    if (d && d.tagName === 'DIALOG' && d.showModal) { d.showModal(); document.body.classList.add('modal-open'); }
  }

  // Фильтр тем на полке проектов
  const shelf = document.querySelector('.bookshelf');
  document.querySelectorAll('.theme-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const on = chip.getAttribute('aria-pressed') !== 'true';
      document.querySelectorAll('.theme-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', on);
      shelf.classList.toggle('filtering', on);
      shelf.querySelectorAll('.spine').forEach(b =>
        b.classList.toggle('match', on && b.dataset.themes.split(' ').includes(chip.dataset.theme)));
    });
  });

  // Форма письма
  const form = document.querySelector('#contact .contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = form.querySelector('.form-status'), btn = form.querySelector('button[type="submit"]');
      if (form.elements._honey.value) return;
      btn.disabled = true;
      status.className = 'form-status';
      const lang = document.documentElement.lang, lv = lang === 'lv', ru = lang === 'ru';
      status.textContent = ru ? 'Отправляю…' : lv ? 'Sūta…' : 'Sending…';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            email: form.elements.email.value,
            message: form.elements.message.value,
            _subject: 'New message from pigeonpolly.com',
            _replyto: form.elements.email.value,
            _template: 'table',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || String(data.success) === 'false') throw new Error(data.message || res.status);
        form.reset();
        status.className = 'form-status ok';
        status.textContent = ru ? 'Спасибо! Сообщение отправлено, скоро отвечу.' : lv ? 'Paldies! Ziņa ir ceļā, drīz atbildēšu.' : 'Thank you! Your message is on its way. I’ll get back to you soon.';
      } catch (err) {
        status.className = 'form-status error';
        status.textContent = ru ? 'Не получилось отправить сообщение. Попробуйте чуть позже.' : lv ? 'Diemžēl ziņu neizdevās nosūtīt. Lūdzu, pamēģini vēlāk.' : 'Sorry, the message didn’t go through. Please try again a bit later.';
      } finally {
        btn.disabled = false;
      }
    });
  }

  // клик по нику или птичке (data-profile) в любом месте сайта — страница профиля /bird/?nick=…
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-profile]');
    if (!b || !b.dataset.profile || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    location.href = ({ ru: '/ru', lv: '/lv' }[document.documentElement.lang] || '') + '/bird/?nick=' + encodeURIComponent(b.dataset.profile);
  });
  // Просмотр картинок: любые ссылки a[data-lightbox], в том числе догруженные позже (стена рисунков)
  let links = [];
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<img alt=""><p></p>'
    + '<button class="lb-btn lb-close" aria-label="Close">✕</button>'
    + '<button class="lb-btn lb-prev" aria-label="Previous">‹</button>'
    + '<button class="lb-btn lb-next" aria-label="Next">›</button>';
  document.body.appendChild(box);
  const img = box.querySelector('img'), cap = box.querySelector('p');
  let i = 0, lastFocus = null;

  const show = n => {
    i = (n + links.length) % links.length;
    const a = links[i], fig = a.closest('figure');
    img.src = a.href;
    img.alt = a.querySelector('img')?.alt || '';
    cap.textContent = (fig?.querySelector('figcaption')?.textContent || '').replace(/\s+/g, ' ').trim();
  };
  const open = n => { lastFocus = document.activeElement; show(n); box.classList.add('open'); document.body.style.overflow = 'hidden'; box.querySelector('.lb-close').focus(); };
  const close = () => { box.classList.remove('open'); document.body.style.overflow = ''; img.src = ''; lastFocus?.focus(); };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-lightbox]');
    if (!a || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    links = [...document.querySelectorAll('a[data-lightbox]')];
    open(links.indexOf(a));
  });
  box.querySelector('.lb-close').onclick = close;
  box.querySelector('.lb-prev').onclick = () => show(i - 1);
  box.querySelector('.lb-next').onclick = () => show(i + 1);
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  // полоска «в цифрах» над меню: прячется, когда листаете вниз; цифры — с сервера (запоминаются на минуту)
  const sb = document.querySelector('.statbar');
  if (sb) {
    let lastY = scrollY;
    addEventListener('scroll', () => {
      const y = scrollY;
      if (Math.abs(y - lastY) > 6) { document.documentElement.classList.toggle('sb-hide', y > 40 && y > lastY); lastY = y; }
    }, { passive: true });
    const days = Math.floor((Date.now() - new Date(2019, 0, 1)) / 864e5) + 1;
    const loc = { ru: 'ru-RU', lv: 'lv-LV' }[document.documentElement.lang] || 'en-GB';
    const fill = d => sb.querySelectorAll('[data-stat]').forEach(b => { const v = b.dataset.stat === 'days' ? days : d && d[b.dataset.stat]; if (v != null) b.textContent = Number(v).toLocaleString(loc); });
    fill(null);
    let cached = null;
    try { const c = JSON.parse(sessionStorage.getItem('pp-stats2') || 'null'); if (c && c.d && c.d.birds != null && Date.now() - c.at < 6e4) cached = c.d; } catch (e) { /* без памяти */ }
    if (cached) fill(cached);
    else fetch('/api/stats?v=2', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(d => { if (!d) return; fill(d); try { sessionStorage.setItem('pp-stats2', JSON.stringify({ at: Date.now(), d })); } catch (e) { /* без памяти */ } }).catch(() => {});
  }
})();

// Своя статистика посетителей (видна в кабинете → «👥 Посетители»): одна отметка на просмотр страницы, без cookie
(() => {
  try {
    if (navigator.webdriver || /^(localhost|127\.)/.test(location.hostname) && !/[?&]track=1/.test(location.search)) return;
    const sp = new URLSearchParams(location.search), u = {};
    ['source', 'campaign'].forEach(k => { const v = sp.get('utm_' + k); if (v) u[k] = v; });
    const body = JSON.stringify({ p: location.pathname, r: document.referrer, u, w: screen.width, t: navigator.maxTouchPoints > 1 });
    if (!(navigator.sendBeacon && navigator.sendBeacon('/api/hit', new Blob([body], { type: 'application/json' })))) fetch('/api/hit', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
  } catch (e) { /* статистика не должна ломать сайт */ }
})();

// шапка всегда влезает в экран (12.10.2026): ширина телефонов, размер шрифта в браузере, кнопка аккаунта — у всех разные,
// поэтому не угадываем по ширине экрана, а проверяем: не влезает — ужимаем по шагам (c1 — без «Art Lab», c2 — плотнее, c3 — кнопки меньше, c4 — только звёздочка)
(() => {
  const h = document.querySelector('.site-header');
  if (!h) return;
  const over = () => {
    let m = 0; const pad = parseFloat(getComputedStyle(h).paddingRight) || 0;
    const rs = [];
    for (const c of h.children) { const st = getComputedStyle(c); if (st.position === 'fixed' || st.position === 'absolute' || st.display === 'none') continue; const r = c.getBoundingClientRect(); if (r.width) { m = Math.max(m, r.right); rs.push(r); } } // меню-панель (fixed) не считаем
    const b = h.querySelector('.brand'); if (b && b.scrollWidth > b.clientWidth + 1) return true; // надпись не влезла в сжатый логотип
    rs.sort((a, b) => a.left - b.left);
    for (let i = 1; i < rs.length; i++) if (rs[i].left < rs[i - 1].right - 1) return true; // наезжают друг на друга (iPhone, 19.10.2026)
    return m > h.clientWidth - pad + 1;
  };
  let busy = false;
  const fit = () => {
    if (busy) return; busy = true;
    h.classList.remove('c1', 'c2', 'c3', 'c4');
    for (const c of ['c1', 'c2', 'c3', 'c4']) { if (!over()) break; h.classList.add(c); }
    busy = false;
  };
  fit();
  addEventListener('resize', fit);
  if (window.ResizeObserver) { const ro = new ResizeObserver(() => requestAnimationFrame(fit)); for (const c of h.children) ro.observe(c); new MutationObserver(() => { for (const c of h.children) ro.observe(c); fit(); }).observe(h, { childList: true }); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
