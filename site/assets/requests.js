// «Нарисуй мне» (/requests/): сверху любой может предложить тему (аноним — «птица + номер», как в комментариях),
// ниже — темы, которые ждут, и сетка рисунков-ответов Алины (наведение — чуть крупнее, клик — на весь экран).
// Только Алина (админ) видит кнопки: загрузить рисунок к теме, скрыть тему, скачать карточку «рисунок + тема» для соцсетей.
// Автор темы с ником получает за каждый рисунок подарок для птички (сервер: /api/requests, /api/admin/requests/*).
(() => {
  const app = document.getElementById('requests');
  if (!app) return;
  const lang = { ru: 'ru', lv: 'lv' }[document.documentElement.lang] || 'en', L = { en: 0, ru: 1, lv: 2 }[lang];
  const T = {
    ask: ['What should I draw?', 'Что мне нарисовать?', 'Ko man uzzīmēt?'],
    askP: ['A pigeon eating spaghetti, a cat on a scooter, my grandma’s garden…', 'Голубь ест спагетти, кот на самокате, бабушкин сад…', 'Balodis ēd spageti, kaķis uz skrejriteņa, vecmāmiņas dārzs…'],
    send: ['✏️ Suggest', '✏️ Предложить', '✏️ Ieteikt'],
    as: [n => `You’ll appear as ${n}.`, n => `Ты будешь подписан(а) как ${n}.`, n => `Tu būsi parakstīts kā ${n}.`],
    gift: ['🎁 Sign in and get a gift for your pixel bird for every drawing of your idea.', '🎁 Войди — и за каждый рисунок по твоей теме твоя пиксельная птичка получит подарок.', '🎁 Ienāc — un par katru zīmējumu pēc tavas tēmas tavs pikseļu putniņš saņems dāvanu.'],
    giftIn: ['🎁 For every drawing of your idea your bird gets a gift.', '🎁 За каждый рисунок по твоей теме твоя птичка получит подарок.', '🎁 Par katru zīmējumu pēc tavas tēmas tavs putniņš saņems dāvanu.'],
    signin: ['Sign in', 'Войти', 'Ienākt'],
    thanks: ['Thank you! Your idea is in the queue ✨', 'Спасибо! Тема в очереди ✨', 'Paldies! Tēma ir rindā ✨'],
    err: { short: ['A few more words, please.', 'Напиши чуть подробнее.', 'Uzraksti mazliet vairāk.'], link: ['Please, no links.', 'Без ссылок, пожалуйста.', 'Bez saitēm, lūdzu.'],
      many: ['That’s enough ideas for today: come back tomorrow!', 'На сегодня хватит идей — приходи завтра!', 'Šodienai idejām pietiek — nāc rīt!'], x: ['Something went wrong, try again.', 'Что-то пошло не так, попробуй ещё раз.', 'Kaut kas nogāja greizi, mēģini vēlreiz.'] },
    waiting: n => [`Waiting to be drawn (${n})`, `Ждут своей очереди (${n})`, `Gaida savu kārtu (${n})`][L],
    drawn: n => [`Drawn (${n})`, `Нарисовано (${n})`, `Uzzīmēts (${n})`][L],
    none: ['No ideas yet. Be the first!', 'Пока нет тем. Будь первым!', 'Vēl nav tēmu. Esi pirmais!'],
    noneDone: ['The first drawings are on their way.', 'Первые рисунки уже в пути.', 'Pirmie zīmējumi jau ceļā.'],
    up: ['📤 Upload drawing', '📤 Загрузить рисунок', '📤 Augšupielādēt'], hide: ['🙈 Hide', '🙈 Скрыть', '🙈 Paslēpt'], card: ['⬇ Card', '⬇ Карточка', '⬇ Kartīte'],
    hideAsk: ['Hide this idea?', 'Скрыть эту тему?', 'Paslēpt šo tēmu?'], uploading: ['Uploading…', 'Загружаю…', 'Augšupielādē…'],
    gave: ['🎁 Gift sent to', '🎁 Подарок отправлен:', '🎁 Dāvana nosūtīta:'], redo: ['📤 Replace', '📤 Заменить', '📤 Aizstāt'],
    cardIdea: ['Idea by', 'Тема от', 'Ideja no'], cardCta: ['Suggest yours:', 'Предложи свою:', 'Iesaki savu:'],
    close: ['Close', 'Закрыть', 'Aizvērt'], mine: ['your idea', 'твоя тема', 'tava tēma'],
  };
  const t = (k, ...a) => { const v = T[k]; const x = Array.isArray(v) ? v[L] : v; return typeof x === 'function' ? x(...a) : x; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const imgUrl = (id, thumb) => `/api/img/${id}${thumb ? '?t=1' : ''}`;
  let S = null;

  async function load() {
    S = await fetch(`/api/requests?lang=${lang}`, { credentials: 'same-origin' }).then(r => r.json());
    draw();
  }
  function draw() {
    const adm = S.admin;
    app.innerHTML = `<section class="rq-ask"><h2>${t('ask')}</h2>
        <form class="rq-form"><textarea name="text" maxlength="200" rows="3" required placeholder="${esc(t('askP'))}"></textarea>
        <div class="rq-row"><button type="submit" class="pill-btn pill-fill">${t('send')}</button><span class="rq-who">${esc(t('as', S.me ? '@' + S.me.nick : S.anon))}</span></div>
        <p class="rq-gift">${S.me ? t('giftIn') : `${t('gift')} <button type="button" class="rq-in">${t('signin')}</button>`}</p><p class="rq-st" role="status"></p></form></section>
      <section class="rq-wait"><h2>${t('waiting', S.open.length)}</h2>${S.open.length ? `<ul class="rq-list">${S.open.map(r => `<li data-id="${r.id}"${r.mine ? ' class="mine"' : ''}><span class="rq-q">“${esc(r.text)}”</span><span class="rq-by">${esc(r.name)}${r.mine ? ` · ${t('mine')}` : ''}</span>${adm ? `<span class="rq-adm"><label class="pill-btn pill-fill rq-upl">${t('up')}<input type="file" accept="image/*" hidden></label><button type="button" class="pill-btn rq-hide">${t('hide')}</button></span>` : ''}</li>`).join('')}</ul>` : `<p class="rq-none">${t('none')}</p>`}</section>
      <section class="rq-done"><h2>${t('drawn', S.done.length)}</h2>${S.done.length ? `<div class="rq-grid">${S.done.map(r => `<figure data-id="${r.id}"><button type="button" class="rq-pic" aria-label="${esc(r.text)}"><img src="${imgUrl(r.img, 1)}" alt="${esc(r.text)}" loading="lazy"></button>
        <figcaption><span class="rq-q">“${esc(r.text)}”</span><span class="rq-by">${esc(r.name)}</span></figcaption>${adm ? `<div class="rq-adm"><button type="button" class="pill-btn pill-fill rq-card">${t('card')}</button><label class="pill-btn rq-upl">${t('redo')}<input type="file" accept="image/*" hidden></label></div>` : ''}</figure>`).join('')}</div>` : `<p class="rq-none">${t('noneDone')}</p>`}</section>`;
    const f = app.querySelector('.rq-form'), st = app.querySelector('.rq-st');
    f.onsubmit = async e => {
      e.preventDefault(); const b = f.querySelector('button[type=submit]'); b.disabled = true;
      try {
        const r = await fetch('/api/requests', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: f.text.value, lang }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) { st.textContent = (T.err[j.error] || T.err.x)[L]; b.disabled = false; return; }
        await load(); const s2 = app.querySelector('.rq-st'); if (s2) s2.textContent = t('thanks');
      } catch (x) { st.textContent = T.err.x[L]; b.disabled = false; }
    };
    const si = app.querySelector('.rq-in'); if (si) si.onclick = () => window.PPAccount && window.PPAccount.openSignIn();
    app.querySelectorAll('.rq-pic').forEach(b => b.onclick = () => open(+b.closest('figure').dataset.id));
    if (!adm) return;
    app.querySelectorAll('.rq-upl input').forEach(i => i.onchange = () => upload(+i.closest('[data-id]').dataset.id, i.files[0], i.closest('label')));
    app.querySelectorAll('.rq-hide').forEach(b => b.onclick = async () => { if (!confirm(t('hideAsk'))) return; await fetch('/api/admin/requests/hide', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: +b.closest('[data-id]').dataset.id }) }); load(); });
    app.querySelectorAll('.rq-card').forEach(b => b.onclick = () => card(S.done.find(r => r.id === +b.closest('[data-id]').dataset.id)));
  }

  // ---------- загрузка ответа (как в челлендже: полная до 1600 px и превью 500 px) ----------
  async function shrink(file, max, q) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(img.src);
    return new Promise(r => c.toBlob(r, 'image/jpeg', q));
  }
  async function upload(id, file, lbl) {
    if (!file) return; lbl.classList.add('busy'); lbl.firstChild.textContent = t('uploading');
    try {
      const fd = new FormData(); fd.append('id', id); fd.append('full', new File([await shrink(file, 1600, .85)], 'full.jpg', { type: 'image/jpeg' })); fd.append('thumb', new File([await shrink(file, 500, .78)], 'thumb.jpg', { type: 'image/jpeg' }));
      const r = await fetch('/api/admin/requests/answer', { method: 'POST', credentials: 'same-origin', body: fd }).then(x => x.json());
      if (r.gift && window.PPToast) { const B = window.PPBirds; window.PPToast(`${t('gave')} ${B && B.giftName ? B.giftName(r.gift.kind, r.gift.item, L) : r.gift.item}${r.gift.mid ? ' ✨' : ''}`); }
      await load();
    } catch (x) { alert(T.err.x[L]); lbl.classList.remove('busy'); }
  }

  // ---------- на весь экран ----------
  function open(id) {
    const list = S.done; let i = list.findIndex(r => r.id === id);
    const d = document.createElement('div'); d.className = 'rq-lb'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    const show = () => { const r = list[i]; d.innerHTML = `<button type="button" class="rq-lb-x" aria-label="${t('close')}">✕</button>${list.length > 1 ? '<button type="button" class="rq-lb-p" aria-label="←">‹</button><button type="button" class="rq-lb-n" aria-label="→">›</button>' : ''}
      <figure><img src="${imgUrl(r.img)}" alt="${esc(r.text)}"><figcaption><span class="rq-q">“${esc(r.text)}”</span><span class="rq-by">${esc(r.name)}</span></figcaption></figure>`; };
    const close = () => { d.remove(); document.removeEventListener('keydown', key); document.body.classList.remove('modal-open'); };
    const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') { i = (i + 1) % list.length; show(); } if (e.key === 'ArrowLeft') { i = (i - 1 + list.length) % list.length; show(); } };
    d.addEventListener('click', e => { if (e.target.closest('.rq-lb-x') || e.target === d) close(); else if (e.target.closest('.rq-lb-n')) { i = (i + 1) % list.length; show(); } else if (e.target.closest('.rq-lb-p')) { i = (i - 1 + list.length) % list.length; show(); } });
    let sx = null; d.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true }); d.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { i = (i + (dx < 0 ? 1 : -1) + list.length) % list.length; show(); } sx = null; });
    document.addEventListener('keydown', key); document.body.classList.add('modal-open'); show(); document.body.appendChild(d);
  }

  // ---------- карточка для соцсетей (12.10.2026): фото Алины целиком, без рамки и без обрезки; поверх — белое «сообщение»
  // с предложенной темой и ником автора (как в чате); внизу — pigeonpolly.com ----------
  async function card(r) {
    try { await Promise.all(['600 60px Fraunces', '700 34px Karla'].map(f => document.fonts.load(f))); } catch (e) {}
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = imgUrl(r.img); });
    const W = 1080, H = Math.round(W * img.height / img.width), u = W / 1080; // размер — как у фото
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    g.drawImage(img, 0, 0, W, H);
    const rr = (x, y, w, h, rad) => { g.beginPath(); g.moveTo(x + rad, y); g.arcTo(x + w, y, x + w, y + h, rad); g.arcTo(x + w, y + h, x, y + h, rad); g.arcTo(x, y + h, x, y, rad); g.arcTo(x, y, x + w, y, rad); g.closePath(); };
    // сообщение: ник сверху, тема ниже; ширина — по тексту, но не шире 82 % карточки
    const pad = 40 * u, maxW = W * 0.82 - pad * 2, fs = Math.round(H > W * 1.4 ? 56 : 50) * u;
    g.font = `600 ${fs}px Fraunces, Georgia, serif`;
    const lines = []; let cur = ''; for (const w of r.text.split(' ')) { const tt = cur ? cur + ' ' + w : w; if (g.measureText(tt).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tt; } lines.push(cur);
    const ls = lines.slice(0, 5), tw = Math.max(...ls.map(l => g.measureText(l).width));
    g.font = `700 ${32 * u}px Karla, system-ui, sans-serif`; const nw = g.measureText(r.name).width;
    const bw = Math.max(tw, nw) + pad * 2, lh = fs * 1.18, bh = pad + 36 * u + 14 * u + ls.length * lh + pad * 0.7, bx = 48 * u, by = 48 * u;
    g.save(); g.shadowColor = 'rgba(0,0,0,.28)'; g.shadowBlur = 30 * u; g.shadowOffsetY = 8 * u;
    rr(bx, by, bw, bh, 34 * u); g.fillStyle = '#FFFFFF'; g.fill();
    g.beginPath(); g.moveTo(bx + 46 * u, by + bh - 4); g.lineTo(bx + 30 * u, by + bh + 34 * u); g.lineTo(bx + 96 * u, by + bh - 4); g.closePath(); g.fill(); // «хвостик» сообщения
    g.restore();
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.font = `700 ${32 * u}px Karla, system-ui, sans-serif`; g.fillStyle = '#7F81BF'; g.fillText(r.name, bx + pad, by + pad + 26 * u);
    g.font = `600 ${fs}px Fraunces, Georgia, serif`; g.fillStyle = '#2B1A51';
    ls.forEach((ln, i) => g.fillText(ln, bx + pad, by + pad + 36 * u + 14 * u + fs * 0.92 + i * lh));
    // адрес сайта внизу
    g.font = `700 ${34 * u}px Karla, system-ui, sans-serif`; g.textAlign = 'center';
    const site = 'pigeonpolly.com', sw = g.measureText(site).width + 56 * u, sx = (W - sw) / 2, sy = H - 48 * u - 64 * u;
    g.save(); g.shadowColor = 'rgba(0,0,0,.25)'; g.shadowBlur = 20 * u; rr(sx, sy, sw, 64 * u, 32 * u); g.fillStyle = 'rgba(255,255,255,.92)'; g.fill(); g.restore();
    g.fillStyle = '#2B1A51'; g.fillText(site, W / 2, sy + 44 * u);
    c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `pigeonpolly-request-${r.id}.jpg`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }, 'image/jpeg', .92);
  }

  load().catch(() => { app.innerHTML = `<p class="rq-none">${T.err.x[L]}</p>`; });
})();
