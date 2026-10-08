// Блок блога на главной: самая новая статья крупно, справа — избранные (★ в редакторе). Без статей блок скрыт.
(function () {
  const box = document.getElementById('home-blog');
  if (!box) return;
  const lang = document.documentElement.lang || 'en';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pic = (p, cls) => `<span class="${cls}">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : '🕊'}</span>`;
  fetch('/api/blog/home?lang=' + lang).then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !d.latest) { box.classList.add('hb-solo', 'hb-none'); box.hidden = false; return; } // статей ещё нет — показываем заглушку
    const p = d.latest, read = box.querySelector('[data-read]').textContent;
    box.querySelector('.hb-latest').innerHTML = `<a class="hb-main" href="${esc(p.url)}">${pic(p, 'hb-img')}<span class="hb-txt">
      <p class="hb-meta">${esc(p.date)}${p.tags.map(t => ` · <span class="hb-tag">#${esc(t)}</span>`).join('')}</p>
      <h3>${esc(p.title)}</h3><p class="hb-ex">${esc(p.excerpt)}</p><span class="hb-more">${esc(read)}</span></span></a>`;
    const side = box.querySelector('.hb-side');
    if (d.featured.length) side.querySelector('ol').innerHTML = d.featured.slice(0, 3).map(f =>
      `<li><a href="${esc(f.url)}">${pic(f, 'hb-th')}<span><b>${esc(f.title)}</b><small>${esc(f.date)}</small></span></a></li>`).join('');
    else side.hidden = true;
    if (side.hidden) box.classList.add('hb-solo');
    box.hidden = false;
  }).catch(() => { box.classList.add('hb-solo', 'hb-none'); box.hidden = false; });
})();
