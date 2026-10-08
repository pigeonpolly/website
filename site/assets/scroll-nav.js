// Стрелочки «наверх / вниз» для длинных страниц (статья блога и редактор).
(function () {
  const L = { en: ['To the top', 'To the bottom'], ru: ['Наверх', 'Вниз'], lv: ['Uz augšu', 'Uz leju'] }[document.documentElement.lang] || ['To the top', 'To the bottom'];
  const box = document.createElement('div');
  box.className = 'scroll-nav';
  box.innerHTML = `<button type="button" data-dir="up" aria-label="${L[0]}" title="${L[0]}">↑</button><button type="button" data-dir="down" aria-label="${L[1]}" title="${L[1]}">↓</button>`;
  document.body.appendChild(box);
  const up = box.querySelector('[data-dir=up]'), down = box.querySelector('[data-dir=down]');
  const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  up.addEventListener('click', () => window.scrollTo({ top: 0, behavior: smooth }));
  down.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth }));
  const update = () => {
    const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    up.classList.toggle('on', y > 400);
    down.classList.toggle('on', max > 600 && y < max - 400);
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  new ResizeObserver(update).observe(document.body); // статья дописывается или грузятся картинки — пересчитываем
  update();
})();
