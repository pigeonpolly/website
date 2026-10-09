// Карточка «Моя птичка в стае Pigeon Polly»: картинка для сторис и постов + ссылка, по которой друзья видят птичку и заводят свою.
// Открывается из профиля (sketch-wall.js грузит этот файл по требованию): PPBirdCard.open({ id, nick, avatar, mine }).
// Своя карточка ещё и загружается на сервер (/api/birdcard) — её показывают мессенджеры в превью ссылки /flock/?bird=ник.
(function () {
  const lang = document.documentElement.lang || 'en', L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const T = {
    title: ['Share your bird', 'Поделиться птичкой', 'Dalīties ar putniņu'],
    titleOther: ['Share this bird', 'Поделиться этой птичкой', 'Dalīties ar šo putniņu'],
    hint: ['The picture fits stories and posts. Friends who open the link will see your bird and can get their own.', 'Картинка подходит для сторис и постов. По ссылке друзья увидят твою птичку и смогут завести свою.', 'Attēls der stāstiem un ierakstiem. Draugi pēc saites redzēs tavu putniņu un varēs iegūt savu.'],
    share: ['Share', 'Поделиться', 'Dalīties'], save: ['Save picture', 'Скачать картинку', 'Lejupielādēt attēlu'],
    copy: ['Copy link', 'Скопировать ссылку', 'Kopēt saiti'], copied: ['Link copied!', 'Ссылка скопирована!', 'Saite nokopēta!'],
    text: ['My bird lives in the Pigeon Polly flock 🐦 Get your own:', 'Моя птичка живёт в стае Pigeon Polly 🐦 Заведи свою:', 'Mans putniņš dzīvo Pigeon Polly barā 🐦 Iegūsti savu:'],
    textOther: ['Look who lives in the Pigeon Polly flock 🐦 Get your own bird:', 'Смотри, кто живёт в стае Pigeon Polly 🐦 Заведи свою птичку:', 'Paskaties, kas dzīvo Pigeon Polly barā 🐦 Iegūsti savu putniņu:'],
    close: ['Close', 'Закрыть', 'Aizvērt'],
  };
  const tr = k => T[k][L];
  const RING = { gold: '#E9C14A', legend: '#F5D547', rainbow: '#9B5DE5', neon: '#7FD4FF', hearts: '#F08BC0', stars: '#E9A93B', snow: '#BFD7F5', magic: '#9B5DE5', spooky: '#E8792B', leaves: '#4CC38A', dotted: '#F5C4B3' };
  const linkFor = nick => `https://www.pigeonpolly.com${lang === 'en' ? '' : '/' + lang}/flock/?bird=${encodeURIComponent(nick)}`;

  // ---------- картинка ----------
  // тёмно-фиолетовая с золотом. wide: 1200×630 (превью ссылки), иначе 1080×1920 (сторис)
  const GOLD = '#E9C14A', GOLD2 = '#F5D547', GOLD3 = '#B8862B';
  const rnd = i => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };
  function draw(o, wide) {
    const B = window.PPBirds, W = wide ? 1200 : 1080, H = wide ? 630 : 1920;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    // ночное небо: градиент, туманность, пиксельные звёзды
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#120A2A'); bg.addColorStop(.55, '#2B1A51'); bg.addColorStop(1, '#45287A');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const cx = wide ? 300 : W / 2, cy = wide ? H / 2 : 820, R = wide ? 205 : 360;
    const neb = g.createRadialGradient(cx, cy, R * .3, cx, cy, R * 2.2); neb.addColorStop(0, 'rgba(155, 93, 229, .45)'); neb.addColorStop(1, 'rgba(155, 93, 229, 0)');
    g.fillStyle = neb; g.fillRect(0, 0, W, H);
    for (let i = 0; i < (wide ? 160 : 260); i++) {
      const s = rnd(i + 7) < .85 ? 3 : 6, x = Math.round(rnd(i) * W / 3) * 3, y = Math.round(rnd(i + 99) * H / 3) * 3;
      g.fillStyle = rnd(i + 3) < .25 ? GOLD2 : rnd(i + 5) < .5 ? '#F3EFFA' : '#B9A8E8'; g.globalAlpha = .35 + rnd(i + 11) * .65; g.fillRect(x, y, s, s);
    }
    g.globalAlpha = 1;
    // золотые пиксельные искры-звёздочки
    const spark = (x, y, k, col) => { g.fillStyle = col; g.fillRect(x - k / 2, y - k * 2.5, k, k * 5); g.fillRect(x - k * 2.5, y - k / 2, k * 5, k); g.fillRect(x - k * 1.5, y - k * 1.5, k * 3, k * 3); g.fillStyle = '#FFF8D6'; g.fillRect(x - k / 2, y - k / 2, k, k); };
    const sp = wide ? [[540, 90, 5], [80, 560, 4], [1130, 120, 4], [1090, 540, 5], [530, 520, 3]] : [[150, 330, 7], [930, 260, 8], [120, 1210, 6], [960, 1150, 7], [880, 470, 4], [210, 560, 4], [540, 140, 5]];
    for (const [x, y, k] of sp) spark(x, y, k, GOLD2);
    // рамка-паспарту золотом с уголками
    const m = wide ? 22 : 44, lw = wide ? 3 : 5;
    g.strokeStyle = GOLD; g.lineWidth = lw; g.globalAlpha = .8; g.strokeRect(m, m, W - m * 2, H - m * 2); g.globalAlpha = 1;
    const cs = wide ? 16 : 28;
    for (const [x, y] of [[m, m], [W - m, m], [m, H - m], [W - m, H - m]]) { g.fillStyle = GOLD2; g.fillRect(x - cs / 2, y - cs / 2, cs, cs); g.fillStyle = '#2B1A51'; g.fillRect(x - cs / 4, y - cs / 4, cs / 2, cs / 2); }
    // птичка в золотом круге со свечением
    const av = o.avatar || {}, lk = B.dress(B.looks(o.id), av), spr = B.crop(B.spriteHD(lk, 0));
    const glow = g.createRadialGradient(cx, cy, R * .8, cx, cy, R * 1.35); glow.addColorStop(0, 'rgba(245, 213, 71, .45)'); glow.addColorStop(1, 'rgba(245, 213, 71, 0)');
    g.fillStyle = glow; g.beginPath(); g.arc(cx, cy, R * 1.35, 0, 7); g.fill();
    const disc = g.createRadialGradient(cx, cy - R * .3, R * .1, cx, cy, R);
    if (/^#[0-9a-f]{6}$/i.test(av.bg || '')) { disc.addColorStop(0, av.bg); disc.addColorStop(1, av.bg); } else { disc.addColorStop(0, '#5B4A99'); disc.addColorStop(1, '#2B1A51'); }
    g.fillStyle = disc; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
    g.lineWidth = wide ? 12 : 20; g.strokeStyle = GOLD; g.stroke();
    g.lineWidth = wide ? 3 : 5; g.strokeStyle = GOLD2; g.beginPath(); g.arc(cx, cy, R + (wide ? 14 : 24), 0, 7); g.stroke();
    // светлый ореол под птичкой — чтобы тёмные (ворона) читались на фиолетовом
    const halo = g.createRadialGradient(cx, cy, 0, cx, cy, R * .78); halo.addColorStop(0, 'rgba(255, 248, 214, .55)'); halo.addColorStop(1, 'rgba(255, 248, 214, 0)');
    g.fillStyle = halo; g.beginPath(); g.arc(cx, cy, R * .95, 0, 7); g.fill();
    const k = Math.max(1, Math.floor(R * 1.3 / Math.max(spr.width, spr.height)));
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(cx, cy + spr.height * k / 2 + R * .02, spr.width * k * .32, R * .05, 0, 0, 7); g.fill();
    g.drawImage(spr, Math.round(cx - spr.width * k / 2), Math.round(cy - spr.height * k / 2), spr.width * k, spr.height * k);
    // номер в стае — золотая плашка на кольце
    const num = '№ ' + o.id;
    g.font = `700 ${wide ? 26 : 40}px Karla, Arial, sans-serif`; g.textAlign = 'center';
    const nw = g.measureText(num).width + (wide ? 36 : 56), nh = wide ? 44 : 66, ny = cy + R - nh / 2 + (wide ? 4 : 6);
    g.fillStyle = GOLD; round(g, cx - nw / 2, ny, nw, nh, nh / 2); g.fill(); g.strokeStyle = '#2B1A51'; g.lineWidth = wide ? 3 : 5; g.stroke();
    g.fillStyle = '#2B1A51'; g.fillText(num, cx, ny + nh / 2 + (wide ? 9 : 14));
    // ник золотом и одна строчка
    const tx = wide ? 820 : W / 2;
    let fs = wide ? 84 : 132; const nick = '@' + o.nick;
    g.font = `600 ${fs}px Fraunces, Georgia, serif`;
    while (g.measureText(nick).width > (wide ? 600 : 920) && fs > 40) { fs -= 4; g.font = `600 ${fs}px Fraunces, Georgia, serif`; }
    const ny2 = wide ? 300 : 1430;
    const tg = g.createLinearGradient(0, ny2 - fs, 0, ny2); tg.addColorStop(0, '#FFF3B0'); tg.addColorStop(.5, GOLD2); tg.addColorStop(1, GOLD3);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillText(nick, tx + (wide ? 3 : 5), ny2 + (wide ? 4 : 6));
    g.fillStyle = tg; g.fillText(nick, tx, ny2);
    g.fillStyle = '#E2D3F7'; g.font = `700 ${wide ? 24 : 36}px Karla, Arial, sans-serif`;
    if (g.letterSpacing !== undefined) g.letterSpacing = wide ? '6px' : '10px';
    g.fillText('PIGEON POLLY · FLOCK', tx, ny2 + (wide ? 60 : 92));
    g.fillStyle = GOLD; g.fillRect(tx - (wide ? 40 : 60), ny2 + (wide ? 88 : 132), wide ? 80 : 120, wide ? 3 : 4);
    g.fillStyle = GOLD2; g.font = `700 ${wide ? 28 : 40}px Karla, Arial, sans-serif`;
    g.fillText('pigeonpolly.com', tx, wide ? 460 : H - 150);
    if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
    // внизу сторис — маленькая стая силуэтами в золотом свете
    if (!wide) {
      const ids = [3, 160, 22, 8, 57, 90, 15], step = 128, sk = 2.6;
      ids.forEach((id, i) => { const s = B.crop(B.spriteHD(B.looks(id), i % 3 === 2 ? 2 : 0)); g.globalAlpha = .9; g.drawImage(s, Math.round(W / 2 - (ids.length - 1) * step / 2 + i * step - s.width * sk / 2), H - 230 - s.height * sk, s.width * sk, s.height * sk); });
      g.globalAlpha = 1;
    }
    return c;
  }
  function round(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  const blobOf = c => new Promise(r => c.toBlob(r, 'image/png'));

  // ---------- окно ----------
  const CSS = `.bc-v{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:16px;background:rgba(20,12,40,.62)}
  .bc-card{position:relative;width:min(440px,100%);max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;padding:22px 20px 20px;border-radius:24px;background:#FFFFFF;color:#2B1A51;font-family:Karla,sans-serif;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.4)}
  .bc-card h3{margin:0 0 12px;font-family:Fraunces,serif;font-weight:600;font-size:24px}
  .bc-card img{display:block;width:min(100%,240px);margin:0 auto 12px;border-radius:14px;box-shadow:0 8px 22px rgba(43,26,81,.18)}
  .bc-card p{margin:0 0 14px;font-size:14px;line-height:1.5;color:#5A4E78}
  .bc-row{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:10px}
  .bc-row button,.bc-row a{padding:10px 16px;border-radius:999px;border:1.5px solid #2B1A51;background:#fff;color:#2B1A51;font:700 14px Karla,sans-serif;text-decoration:none;cursor:pointer}
  .bc-row .bc-main{background:#D85A30;border-color:#D85A30;color:#fff}
  .bc-row button:hover,.bc-row a:hover{background:#2B1A51;border-color:#2B1A51;color:#fff}
  .bc-apps a{padding:8px 14px;font-size:13px;border-color:#CFC7E8}
  .bc-x{position:absolute;top:10px;right:12px;width:34px;height:34px;border:0;border-radius:50%;background:#F4F0FA;color:#2B1A51;font-size:16px;cursor:pointer}
  .bc-ok{min-height:1.2em;margin:4px 0 0!important;font-weight:700;color:#3E7A55!important}`;
  async function open(o) {
    if (!window.PPBirds || !o || !o.nick) return;
    if (!document.getElementById('bc-css')) { const s = document.createElement('style'); s.id = 'bc-css'; s.textContent = CSS; document.head.appendChild(s); }
    try { await Promise.all([document.fonts.load('600 64px Fraunces'), document.fonts.load('700 32px Karla'), document.fonts.load('500 32px Karla')]); } catch (e) { /* без шрифтов — запасные */ }
    const card = draw(o, false), url = linkFor(o.nick), text = tr(o.mine ? 'text' : 'textOther');
    const blob = await blobOf(card), file = new File([blob], `pigeonpolly-${o.nick}.png`, { type: 'image/png' }), img = URL.createObjectURL(blob);
    // своя птичка: картинка для превью ссылки в мессенджерах
    if (o.mine) blobOf(draw(o, true)).then(b => fetch('/api/birdcard', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'image/png' }, body: b })).catch(e => console.warn('birdcard', e));
    const enc = encodeURIComponent, full = text + ' ' + url;
    const v = document.createElement('div'); v.className = 'bc-v'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true');
    v.innerHTML = `<div class="bc-card"><button type="button" class="bc-x" aria-label="${tr('close')}">✕</button>
      <h3>${tr(o.mine ? 'title' : 'titleOther')}</h3><img src="${img}" alt="@${o.nick.replace(/[<>&"]/g, '')}"><p>${tr('hint')}</p>
      <div class="bc-row">${navigator.share ? `<button type="button" class="bc-main" data-bc="share">📤 ${tr('share')}</button>` : ''}<a href="${img}" download="pigeonpolly-${o.nick.replace(/[^\w.-]/g, '')}.png" class="${navigator.share ? '' : 'bc-main'}">⬇ ${tr('save')}</a><button type="button" data-bc="copy">🔗 ${tr('copy')}</button></div>
      <div class="bc-row bc-apps"><a target="_blank" rel="noopener" href="https://t.me/share/url?url=${enc(url)}&text=${enc(text)}">Telegram</a><a target="_blank" rel="noopener" href="https://wa.me/?text=${enc(full)}">WhatsApp</a><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${enc(url)}">Facebook</a><a target="_blank" rel="noopener" href="https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}">X</a><a target="_blank" rel="noopener" href="https://www.threads.net/intent/post?text=${enc(full)}">Threads</a></div>
      <p class="bc-ok" role="status"></p></div>`;
    const ok = v.querySelector('.bc-ok');
    const close = () => { v.remove(); URL.revokeObjectURL(img); document.removeEventListener('keydown', esc, true); };
    const esc = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    v.addEventListener('click', async e => {
      if (e.target === v || e.target.closest('.bc-x')) return close();
      const b = e.target.closest('[data-bc]'); if (!b) return;
      if (b.dataset.bc === 'copy') { try { await navigator.clipboard.writeText(url); ok.textContent = tr('copied'); } catch (x) { prompt('', url); } }
      if (b.dataset.bc === 'share') {
        try { await navigator.share(navigator.canShare && navigator.canShare({ files: [file] }) ? { files: [file], text: full } : { title: 'Pigeon Polly', text, url }); }
        catch (x) { if (x.name !== 'AbortError') console.warn('share', x); }
      }
    });
    document.addEventListener('keydown', esc, true);
    document.body.appendChild(v); v.querySelector('.bc-x').focus();
  }
  window.PPBirdCard = { open, draw };
})();
