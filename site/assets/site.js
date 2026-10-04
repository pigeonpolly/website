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
      if (!li.contains(e.target) && window.matchMedia('(min-width: 1081px)').matches) {
        li.classList.remove('open');
        li.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false');
      }
    });
  });

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
