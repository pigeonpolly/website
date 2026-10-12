// Галерея комнат внизу «Стаи» (12.10.2026): уменьшенные неподвижные снимки комнат (PPRoom.mount с still: true — один кадр),
// первыми — где недавно что-то добавили (/api/rooms, users.room_at). Наведение — чуть крупнее, клик — живая комната на весь экран.
(() => {
  const grid = document.querySelector('.fl-rooms-grid');
  if (!grid) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, pre = ['', '/ru', '/lv'][L];
  const T = { more: ['Show more rooms', 'Показать ещё комнаты', 'Rādīt vēl istabas'], none: ['No rooms yet: be the first to furnish yours!', 'Комнат пока нет — обустрой свою первой!', 'Istabu vēl nav — iekārto savu pirmais!'],
    profile: ['Open profile →', 'Открыть профиль →', 'Atvērt profilu →'], close: ['Close', 'Закрыть', 'Aizvērt'] };
  const t = k => T[k][L];
  let offset = 0, all = [];
  const thumb = r => {
    const fig = document.createElement('figure'); fig.className = 'fl-room';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'fl-room-btn'; btn.setAttribute('aria-label', '@' + r.nick);
    const box = document.createElement('div'); btn.appendChild(box); fig.appendChild(btn);
    const cap = document.createElement('figcaption'); cap.textContent = '@' + r.nick; fig.appendChild(cap);
    // снимок рисуем, когда комната доходит до экрана
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); try { window.PPRoom.mount(box, { id: r.id, nick: r.nick, avatar: r.avatar, room: r.room, still: true }); } catch (e) {} } }, { rootMargin: '300px' });
    io.observe(fig);
    btn.onclick = () => open(r);
    return fig;
  };
  function open(r) {
    const d = document.createElement('div'); d.className = 'fl-room-lb'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = `<div class="fl-room-lb-in"><button type="button" class="fl-room-x" aria-label="${t('close')}">✕</button><div class="fl-room-live"></div><a class="pill-btn pill-fill" href="${pre}/bird/?nick=${encodeURIComponent(r.nick)}">${t('profile')}</a></div>`;
    const close = () => { d.remove(); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', key); };
    const key = e => { if (e.key === 'Escape') close(); };
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('.fl-room-x')) close(); });
    document.addEventListener('keydown', key); document.body.classList.add('modal-open'); document.body.appendChild(d);
    window.PPRoom.mount(d.querySelector('.fl-room-live'), { id: r.id, nick: r.nick, avatar: r.avatar, room: r.room }); // живая: птичка ходит
  }
  async function more() {
    const d = await fetch(`/api/rooms?offset=${offset}`).then(x => x.json()).catch(() => ({ rooms: [] }));
    offset += 24; all = all.concat(d.rooms || []);
    (d.rooms || []).forEach(r => grid.appendChild(thumb(r)));
    let b = grid.parentNode.querySelector('.fl-rooms-more');
    if (d.more) { if (!b) { b = document.createElement('button'); b.type = 'button'; b.className = 'pill-btn fl-rooms-more'; b.textContent = t('more'); b.onclick = more; grid.after(b); } }
    else if (b) b.remove();
    if (!all.length) grid.innerHTML = `<p class="fl-rooms-none">${t('none')}</p>`;
  }
  const go = () => { if (window.PPRoom) more(); else setTimeout(go, 200); };
  go();
})();
