// 📮 Почтовый ящик Полли в шапке (вместо Птичьего таро, Алина 28.11.2026). Клик — окно «Приятная почта от Полли»:
// адрес → POST /api/subscribe {topic: 'news'} → таблица subscribers у нас и сразу в Kit (worker/kit.js), оттуда Алина пишет раз в неделю.
// Рядом с ящиком — полоска для почты (Алина 28.11), если в шапке хватает места до меню (fit); нет места — только ящик и окно.
// Ссылка с #polly-post (например, из пина) открывает окно сразу. Подписались — localStorage pp_mb = 'sub', полоска не показывается.
(function () {
  const box = document.getElementById('pmb'); if (!box) return;
  const L = ({ ru: 1, lv: 2 })[document.documentElement.lang] || 0;
  const T = {
    aria: ['Pleasant post from Polly — get letters', 'Приятная почта от Полли — получать письма', 'Patīkams pasts no Pollija — saņemt vēstules'],
    h: ['Pleasant post <em>from Polly</em>', 'Приятная почта <em>от Полли</em>', 'Patīkams pasts <em>no Pollija</em>'],
    lead: ['Once a week, a little letter: a drawing tip, a new painting, something free to print. Cosy, short, no spam.',
      'Раз в неделю — маленькое письмо: совет по рисованию, новый рисунок, что-нибудь бесплатное для печати. Уютно, коротко, без спама.',
      'Reizi nedēļā — neliela vēstule: zīmēšanas padoms, jauns zīmējums, kaut kas bez maksas izdrukāšanai. Mājīgi, īsi, bez surogātpasta.'],
    ph: ['your@email.com', 'твоя@почта.com', 'tavs@epasts.lv'],
    go: ['Send me letters 💌', 'Хочу письма 💌', 'Gribu vēstules 💌'],
    strip: ['E-mail for Polly’s letters', 'Почта для писем Полли', 'E-pasts Pollija vēstulēm'],
    thanks: ['✓ Thank you! Polly’s letters are on the way', '✓ Спасибо! Письма Полли уже в пути', '✓ Paldies! Pollija vēstules jau ceļā'],
    sub: ['Subscribe', 'Подписаться', 'Pierakstīties'],
    small: ['Alina will send you a letter about once a week. Your address is not shared with anyone, and every letter has an “Unsubscribe” link.',
      'Алина будет присылать письмо примерно раз в неделю. Адрес никому не передаётся, в каждом письме есть ссылка «Отписаться».',
      'Alīna sūtīs vēstuli apmēram reizi nedēļā. Tava adrese netiek nodota citiem, un katrā vēstulē ir saite «Atrakstīties».'],
    priv: ['Privacy', 'Конфиденциальность', 'Privātums'],
    okH: ['Hooray! 💌', 'Ура! 💌', 'Urā! 💌'],
    ok: ['You are on Polly’s list. If a letter asks you to confirm the address, just press the button inside.',
      'Ты в списке Полли. Если придёт письмо с просьбой подтвердить адрес — просто нажми кнопку в нём.',
      'Tu esi Pollija sarakstā. Ja pienāks vēstule ar lūgumu apstiprināt adresi — vienkārši nospied pogu tajā.'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
    email: ['Please check the email address.', 'Проверь адрес почты.', 'Pārbaudi e-pasta adresi.'],
    err: ['Something went wrong. Please try again a bit later.', 'Что-то пошло не так. Попробуй ещё раз чуть позже.', 'Kaut kas nogāja greizi. Pamēģini vēlreiz mazliet vēlāk.'],
  };
  const t = k => T[k][L];
  const pre = ['', '/ru', '/lv'][L];
  // ящик: синий, с красным флажком и письмом с сердечком в щели
  const SVG = `<svg viewBox="0 0 64 64" aria-hidden="true">
    <rect x="28.5" y="38" width="7" height="24" rx="1.5" fill="#7A4A28"/><rect x="22" y="59" width="20" height="4" rx="2" fill="#5E3A1F"/>
    <path d="M8 40V25a15 15 0 0 1 15-15h20a13 13 0 0 1 13 13v17z" fill="#2E5A8C"/>
    <path d="M8 40V25a11 11 0 0 1 22 0v15z" fill="#3E73AD"/><path d="M8 40V25a11 11 0 0 1 22 0v15z" fill="none" stroke="#24486F" stroke-width="1.5"/>
    <g class="pmb-let"><g transform="rotate(-12 19 20)"><rect x="10" y="12" width="20" height="13" rx="1.5" fill="#FFFDF6" stroke="#D9CBB4"/><path d="M10.5 12.8 20 19.5l9.5-6.7" fill="none" stroke="#D9CBB4"/><path d="M20 23.2c-2.6-1.7-3.6-3-3-4.2.6-1.1 2.1-1 3 .2.9-1.2 2.4-1.3 3-.2.6 1.2-.4 2.5-3 4.2z" fill="#D85A30"/></g></g>
    <rect x="12" y="29" width="14" height="2.6" rx="1.3" fill="#24486F"/><circle cx="26" cy="35" r="1.6" fill="#E9A93B"/>
    <g class="pmb-flag"><rect x="49" y="15" width="2.6" height="22" rx="1" fill="#8B2A1E"/><path d="M51 15h9l-2.5 3.5L60 22h-9z" fill="#D85A30"/></g>
  </svg>`;
  box.hidden = false;
  box.innerHTML = `<button type="button" class="pmb-b" aria-haspopup="dialog" aria-label="${t('aria')}" title="${t('aria')}">${SVG}</button>`
    + `<form class="pmb-f" hidden novalidate><input type="email" name="email" required maxlength="254" autocomplete="email" placeholder="${t('strip')}" aria-label="${t('strip')}">`
    + `<input class="pmm-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="submit" aria-label="${t('sub')}" title="${t('sub')}">→</button></form>`;
  const btn = box.firstElementChild, strip = box.querySelector('.pmb-f');
  let subbed = false; try { subbed = localStorage.getItem('pp_mb') === 'sub'; } catch (e) {}
  const valid = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  const send = (email, website) => fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, topic: 'news', consent: true, consentText: T.small[0], lang: ['en', 'ru', 'lv'][L], website }) })
    .then(r => r.json().catch(() => ({})).then(d => { if (!r.ok) throw d; try { localStorage.setItem('pp_mb', 'sub'); } catch (x) {} return d; }));
  // полоска: показываем, только если до меню справа хватает места (иначе меню бы съехало)
  let done = false;
  function fit() {
    if (subbed && !done) { strip.hidden = true; return; }
    strip.hidden = true; strip.style.width = '';
    const hd = box.closest('header'); if (hd) hd.classList.remove('pmb-roomy');
    const next = box.nextElementSibling; if (!next || getComputedStyle(box).position === 'fixed') return;
    const gap = () => next.getBoundingClientRect().left - box.getBoundingClientRect().right - 24;
    let free = gap();
    // мало места (английская шапка) — прячем надпись «Pigeon Polly Art Lab» у логотипа: имя и так на значке (Алина 28.11: «в англ обязательно»)
    if (free < 210 && hd) { hd.classList.add('pmb-roomy'); free = gap(); }
    if (free >= 180) { strip.style.width = Math.min(300, free) + 'px'; strip.hidden = false; }
    else if (hd) hd.classList.remove('pmb-roomy');
  }
  strip.onsubmit = async e => {
    e.preventDefault();
    const inp = strip.email, email = inp.value.trim();
    if (!valid(email)) { strip.classList.add('bad'); inp.focus(); return; }
    strip.classList.remove('bad'); strip.classList.add('busy');
    try { await send(email, strip.website.value); done = true; strip.innerHTML = `<span class="pmb-ok">${t('thanks')}</span>`; }
    catch (d) { strip.classList.remove('busy'); strip.classList.add('bad'); open(); }
  };
  addEventListener('resize', fit); addEventListener('load', fit); fit();

  let modal = null;
  function build() {
    modal = document.createElement('div');
    modal.className = 'pmm'; modal.hidden = true;
    modal.innerHTML = `<div class="pmm-bg"></div><div class="pmm-w" role="dialog" aria-modal="true" aria-labelledby="pmm-h">
      <button type="button" class="pmm-x" aria-label="${t('close')}">✕</button>
      <div class="pmm-in"><span class="pmm-pic">${SVG}</span><h2 class="pmm-h" id="pmm-h">${t('h')}</h2><p class="pmm-lead">${t('lead')}</p>
      <form class="pmm-f" novalidate><input type="email" name="email" required maxlength="254" autocomplete="email" placeholder="${t('ph')}" aria-label="Email">
        <input class="pmm-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button type="submit" class="pmm-go">${t('go')}</button></form>
      <p class="pmm-msg" role="alert"></p>
      <p class="pmm-small">${t('small')} <a href="${pre}/privacy/">${t('priv')}</a></p></div></div>`;
    document.body.appendChild(modal);
    const close = () => { modal.hidden = true; document.removeEventListener('keydown', esc); btn.focus(); };
    const esc = e => { if (e.key === 'Escape') close(); };
    modal._esc = esc; modal._close = close;
    modal.querySelector('.pmm-bg').onclick = close;
    modal.querySelector('.pmm-x').onclick = close;
    const f = modal.querySelector('form'), msg = modal.querySelector('.pmm-msg'), go = modal.querySelector('.pmm-go');
    f.onsubmit = async e => {
      e.preventDefault(); msg.textContent = '';
      const email = f.email.value.trim();
      if (!valid(email)) { msg.textContent = t('email'); f.email.focus(); return; }
      go.disabled = true;
      try {
        await send(email, f.website.value);
        modal.querySelector('.pmm-in').innerHTML = `<span class="pmm-pic">${SVG}</span><div class="pmm-ok"><b>${t('okH')}</b><p>${t('ok')}</p></div>`;
        done = true; strip.innerHTML = `<span class="pmb-ok">${t('thanks')}</span>`;
      } catch (d) { msg.textContent = d && d.error === 'email' ? t('email') : t('err'); go.disabled = false; }
    };
  }
  function open() {
    if (!modal) build();
    modal.hidden = false; document.addEventListener('keydown', modal._esc);
    const inp = modal.querySelector('input[type=email]'); if (inp) setTimeout(() => inp.focus(), 50);
  }
  btn.addEventListener('click', open);
  window.PPMailbox = { open };
  if (location.hash === '#polly-post') open();
})();
