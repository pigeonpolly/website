// Пёрышки комнаты (этап 13 В, docs/flock.md): полоска под комнатой в профиле /bird/.
// Гость: «🪶 Оставить пёрышко» — одно от птички в сутки (POST /api/feather); хозяин: «в гостях было N птичек, M оставили пёрышко» и последние гости.
// Открытие профиля — POST /api/feathers {nick}: гость отмечается в гостях, хозяин гасит новость feathers в конвертике (worker/flock.js).
(() => {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, pre = ['', '/ru', '/lv'][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ru = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? b : c;
  const lv1 = n => n % 10 === 1 && n % 100 !== 11;
  const T = {
    n: [n => `${n} ${n === 1 ? 'feather' : 'feathers'}`, n => `${n} ${ru(n, 'пёрышко', 'пёрышка', 'пёрышек')}`, n => `${n} ${lv1(n) ? 'spalviņa' : 'spalviņas'}`],
    leave: ['🪶 Leave a feather', '🪶 Оставить пёрышко', '🪶 Atstāt spalviņu'],
    given: ['Feather left — come back tomorrow for another one', 'Пёрышко оставлено — следующее можно завтра', 'Spalviņa atstāta — nākamo varēs rīt'],
    thanks: ['🪶 Feather left! The owner will see it.', '🪶 Пёрышко оставлено! Хозяин увидит.', '🪶 Spalviņa atstāta! Saimnieks to redzēs.'],
    why: ['A feather means: “Lovely room, glad I dropped by!”', 'Пёрышко — знак: «Уютная комната, хорошо в гостях!»', 'Spalviņa nozīmē: «Mājīga istaba, jauki ciemos!»'],
    guests: [(n, m) => `${n} ${n === 1 ? 'bird has' : 'birds have'} visited, ${m} left a feather`, (n, m) => `В гостях ${ru(n, 'была', 'было', 'было')} ${n} ${ru(n, 'птичка', 'птички', 'птичек')}, ${m} ${ru(m, 'оставила', 'оставили', 'оставили')} пёрышко`, (n, m) => `Ciemos ${lv1(n) ? 'bijis' : 'bijuši'} ${n} ${lv1(n) ? 'putniņš' : 'putniņi'}, ${m} ${lv1(m) ? 'atstāja' : 'atstāja'} spalviņu`],
    noGuests: ['No guests yet. Share your bird — friends can leave you a feather.', 'Гостей пока не было. Поделись птичкой — друзья смогут оставить пёрышко.', 'Ciemiņu vēl nav bijis. Padalies ar putniņu — draugi varēs atstāt spalviņu.'],
    last: ['Recent guests:', 'Последние гости:', 'Pēdējie ciemiņi:'],
    err: ['Something went wrong. Try again.', 'Что-то пошло не так. Попробуй ещё раз.', 'Kaut kas nogāja greizi. Pamēģini vēlreiz.'],
  };
  const t = (k, ...a) => { const v = T[k][L]; return typeof v === 'function' ? v(...a) : v; };
  const post = (p, b) => fetch('/api/' + p, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) })
    .then(async r => { const d = await r.json().catch(() => ({})); if (!r.ok) throw Object.assign(new Error(d.error || 'err'), { status: r.status }); return d; });

  // перо медленно падает над комнатой
  function fall(room) {
    if (!room || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const f = document.createElement('span'); f.className = 'fe-fall'; f.textContent = '🪶'; f.setAttribute('aria-hidden', 'true');
    room.style.position = room.style.position || 'relative'; room.appendChild(f);
    setTimeout(() => f.remove(), 2600);
  }

  // el — контейнер под комнатой; o: {nick, room (элемент комнаты), signedIn, onShare}
  async function mount(el, o) {
    let s;
    try { s = await post('feathers', { nick: o.nick }); } catch (e) { el.hidden = true; return; }
    const draw = () => {
      if (s.mine) {
        el.innerHTML = `<p class="fe-line"><b>🪶 ${t('n', s.feathers)}</b> · ${s.guests ? t('guests', s.guests, s.givers) : t('noGuests')}</p>
          ${(s.last || []).length ? `<p class="fe-last">${t('last')} ${s.last.map(g => `<a href="${pre}/bird/?nick=${encodeURIComponent(g.nick)}" data-profile>@${esc(g.nick)}</a>${g.feather ? ' 🪶' : ''}`).join(', ')}</p>` : ''}`;
        return;
      }
      el.innerHTML = `<p class="fe-line"><b>🪶 ${t('n', s.feathers)}</b>${s.given ? ` · <span class="fe-given">${t('given')}</span>` : ''}</p>
        ${s.given ? '' : `<button type="button" class="pill-btn pill-fill fe-btn">${t('leave')}</button><p class="fe-why">${t('why')}</p>`}`;
      const b = el.querySelector('.fe-btn');
      if (b) b.onclick = async () => {
        if (!o.signedIn) { if (window.PPAccount) window.PPAccount.openSignIn(); return; }
        b.disabled = true;
        try { s = { ...s, ...(await post('feather', { nick: o.nick })) }; fall(o.room); if (window.PPToast) window.PPToast(t('thanks')); draw(); }
        catch (e) { if (e.status === 409) { s.given = true; draw(); } else { b.disabled = false; if (window.PPToast) window.PPToast(t('err')); } }
      };
    };
    draw();
  }
  window.PPFeathers = { mount };
})();
