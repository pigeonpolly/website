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
  document.addEventListener('click', e => {
    document.querySelectorAll('.has-sub.open').forEach(li => {
      if (!li.contains(e.target) && window.matchMedia('(min-width: 1281px)').matches) {
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

  const links = [...document.querySelectorAll('a[data-lightbox]')];
  if (!links.length) return;
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
    img.alt = a.querySelector('img').alt;
    cap.textContent = fig.querySelector('figcaption')?.textContent || '';
  };
  const open = n => { lastFocus = document.activeElement; show(n); box.classList.add('open'); document.body.style.overflow = 'hidden'; box.querySelector('.lb-close').focus(); };
  const close = () => { box.classList.remove('open'); document.body.style.overflow = ''; img.src = ''; lastFocus?.focus(); };

  links.forEach((a, n) => a.addEventListener('click', e => { e.preventDefault(); open(n); }));
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
})();
