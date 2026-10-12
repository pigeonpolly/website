// Кабинет → «📸 Карусели»: собрать слайды для Instagram / TikTok из работ челленджа (12.10.2026).
// Всё делается в браузере Алины на настоящем сайте: работы со стены (/api/wall) и их картинки (/api/img/…) →
// слайды 1080×1350 (4:5): обложка, по одной работе на слайд (тема дня + @ник), последний — приглашение на сайт. Скачивается zip.
(() => {
  const W = 1080, H = 1350;
  const C = { ink: '#2B1A51', deep: '#2B1A51', cream: '#FFFDF8', peach: '#F0A987', gold: '#E9A93B', lilac: '#7F81BF', soft: '#8A7FA8' };
  const TX = {
    en: { cover: 'Our daily\ndrawing challenge', coverSub: (n, b) => `${n} drawings · ${b} ${b === 1 ? 'artist' : 'artists'}`, swipe: 'swipe →', by: n => `by @${n}`,
      theme: 'Theme of the day', cta: 'Draw with us', l1: '✏️ a new theme every day', l2: '🥚 draw once, get your own pixel bird', l3: '🌈 turn your art into a palette', l4: '📚 books & behind the scenes', site: 'pigeonpolly.com', ai: '🤖 AI-made' },
    ru: { cover: 'Наш ежедневный\nчеллендж', coverSub: (n, b) => `${n} рисунков · ${b} ${b % 10 === 1 && b % 100 !== 11 ? 'художник' : b % 10 >= 2 && b % 10 <= 4 && (b % 100 < 12 || b % 100 > 14) ? 'художника' : 'художников'}`, swipe: 'листай →', by: n => `@${n}`,
      theme: 'Тема дня', cta: 'Рисуй с нами', l1: '✏️ новая тема каждый день', l2: '🥚 нарисуй — и вылупится твоя птичка', l3: '🌈 палитра из твоего рисунка', l4: '📚 мои книги и как я их пишу', site: 'pigeonpolly.com', ai: '🤖 ИИ' },
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SERIF = '"Fraunces", Georgia, serif', SANS = '"Karla", system-ui, sans-serif';

  // ---------- zip без сжатия (картинки и так сжаты) ----------
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = u8 => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  function zip(files) { // files: [{name, data: Uint8Array}]
    const enc = new TextEncoder(), parts = [], cent = []; let off = 0;
    for (const f of files) {
      const nm = enc.encode(f.name), crc = crc32(f.data), sz = f.data.length;
      const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint32(14, crc, true); h.setUint32(18, sz, true); h.setUint32(22, sz, true); h.setUint16(26, nm.length, true);
      parts.push(new Uint8Array(h.buffer), nm, f.data);
      const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint32(16, crc, true); c.setUint32(20, sz, true); c.setUint32(24, sz, true); c.setUint16(28, nm.length, true); c.setUint32(42, off, true);
      cent.push(new Uint8Array(c.buffer), nm); off += 30 + nm.length + sz;
    }
    const csz = cent.reduce((a, x) => a + x.length, 0), e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csz, true); e.setUint32(16, off, true);
    return new Blob([...parts, ...cent, new Uint8Array(e.buffer)], { type: 'application/zip' });
  }
  const save = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); };

  // ---------- рисование ----------
  const canvas = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function star(g, cx, cy, r, col) { g.save(); g.translate(cx, cy); g.fillStyle = col; g.beginPath(); const k = r / 48; [[0, -48], [14, -14], [48, 0], [14, 14], [0, 48], [-14, 14], [-48, 0], [-14, -14]].forEach(([x, y], i) => i ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k)); g.closePath(); g.fill(); g.restore(); }
  function wrap(g, text, max) { const out = []; for (const para of String(text).split('\n')) { let cur = ''; for (const w of para.split(' ')) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > max && cur) { out.push(cur); cur = w; } else cur = t; } out.push(cur); } return out; }
  function fit(g, img, x, y, w, h, r) { // картинка целиком в рамке, со скруглением и тенью
    const k = Math.min(w / img.width, h / img.height), iw = img.width * k, ih = img.height * k, ix = x + (w - iw) / 2, iy = y + (h - ih) / 2;
    g.save(); g.shadowColor = 'rgba(43,26,81,.28)'; g.shadowBlur = 40; g.shadowOffsetY = 14; rr(g, ix, iy, iw, ih, r); g.fillStyle = '#fff'; g.fill(); g.restore();
    g.save(); rr(g, ix, iy, iw, ih, r); g.clip(); g.drawImage(img, ix, iy, iw, ih); g.restore();
    return { ix, iy, iw, ih };
  }
  function brand(g, dark, n, total) {
    g.font = `700 30px ${SANS}`; g.fillStyle = dark ? 'rgba(255,255,255,.85)' : C.ink; g.textAlign = 'left'; g.textBaseline = 'middle';
    star(g, 72, 76, 20, C.gold); g.fillText('Pigeon Polly', 104, 77); g.fillStyle = C.peach; g.fillText('Art Lab', 104 + g.measureText('Pigeon Polly ').width, 77);
    if (n) { g.textAlign = 'right'; g.font = `700 26px ${SANS}`; g.fillStyle = dark ? 'rgba(255,255,255,.6)' : C.soft; g.fillText(`${n}/${total}`, W - 64, 77); }
  }
  function cover(L, imgs, works, total) {
    const c = canvas(), g = c.getContext('2d');
    g.fillStyle = C.deep; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${(i % 5) / 20 + .05})`; g.fillRect((i * 173) % W, (i * 97) % (H * .45), 3, 3); }
    brand(g, true, 1, total);
    // веер из работ
    const spots = [[-9, 190, 560], [6, 560, 520], [-4, 330, 830], [8, 720, 820]];
    imgs.slice(0, 4).forEach((im, i) => { const [rot, cx, cy] = spots[i]; g.save(); g.translate(cx, cy); g.rotate(rot * Math.PI / 180); fit(g, im, -190, -190, 380, 380, 22); g.restore(); });
    g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff'; g.font = `600 84px ${SERIF}`;
    const lines = TX[L].cover.split('\n'); lines.forEach((ln, i) => g.fillText(ln, 72, 1090 + i * 92));
    const authors = new Set(works.map(w => w.nick)).size;
    g.font = `500 36px ${SANS}`; g.fillStyle = C.peach; g.fillText(TX[L].coverSub(works.length, authors), 72, 1090 + lines.length * 92 + 10);
    g.textAlign = 'right'; g.font = `700 34px ${SANS}`; g.fillStyle = 'rgba(255,255,255,.8)'; g.fillText(TX[L].swipe, W - 72, H - 72);
    star(g, W - 120, 1000, 34, C.gold);
    return c;
  }
  function work(L, img, w, n, total, opt) {
    const c = canvas(), g = c.getContext('2d');
    g.fillStyle = C.cream; g.fillRect(0, 0, W, H);
    brand(g, false, n, total);
    const box = fit(g, img, 72, 140, W - 144, 900, 26);
    let y = Math.max(box.iy + box.ih + 70, 1110);
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.font = `700 26px ${SANS}`; g.fillStyle = C.soft; g.fillText(TX[L].theme.toUpperCase() + (w.day ? ' · ' + w.day.split('-').reverse().slice(0, 2).join('.') : ''), 72, y - 52);
    g.font = `600 52px ${SERIF}`; g.fillStyle = C.ink;
    const th = wrap(g, w.theme ? `“${w.theme}”` : '', W - 144).slice(0, 2); th.forEach((ln, i) => g.fillText(ln, 72, y + i * 60)); y += th.length * 60 + 4;
    if (opt.nicks) { g.font = `700 34px ${SANS}`; g.fillStyle = C.lilac; g.fillText(TX[L].by(w.nick) + (w.ai ? '   ' + TX[L].ai : ''), 72, Math.min(y + 18, H - 70)); }
    g.textAlign = 'right'; g.font = `700 28px ${SANS}`; g.fillStyle = C.peach; g.fillText('pigeonpolly.com', W - 72, H - 56);
    return c;
  }
  function cta(L, total, bird) {
    const c = canvas(), g = c.getContext('2d');
    g.fillStyle = C.deep; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,255,255,${(i % 5) / 20 + .05})`; g.fillRect((i * 211) % W, (i * 131) % H, 3, 3); }
    brand(g, true, total, total);
    if (bird) { g.imageSmoothingEnabled = false; const k = Math.floor(300 / Math.max(bird.width, bird.height)); g.drawImage(bird, (W - bird.width * k) / 2, 200, bird.width * k, bird.height * k); g.imageSmoothingEnabled = true; }
    g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff'; g.font = `600 96px ${SERIF}`; g.fillText(TX[L].cta, W / 2, 640);
    g.font = `500 42px ${SANS}`; g.fillStyle = 'rgba(255,255,255,.92)';
    [TX[L].l1, TX[L].l2, TX[L].l3, TX[L].l4].forEach((ln, i) => g.fillText(ln, W / 2, 760 + i * 74));
    rr(g, W / 2 - 300, 1110, 600, 110, 55); g.fillStyle = C.peach; g.fill();
    g.fillStyle = C.ink; g.font = `800 50px ${SANS}`; g.fillText(TX[L].site, W / 2, 1182);
    star(g, W / 2 + 330, 1110, 30, C.gold);
    return c;
  }
  const toBlob = (c, type = 'image/jpeg') => new Promise(r => c.toBlob(r, type, .92));

  // ---------- экран в кабинете ----------
  window.PPCarousel = async function (main) {
    main.innerHTML = `<section class="adm-box adm-car"><h2>📸 Карусели из челленджа</h2>
      <p class="be-note">Слайды 1080×1350 (4:5 — подходят и для Instagram, и для фото-карусели в TikTok): обложка с веером работ, по одной работе на слайд с темой дня и ником автора, последний слайд — приглашение на сайт. В одной карусели до 10 слайдов (обложка + 8 работ + приглашение); если работ больше — получится несколько каруселей. Всё собирается здесь, в браузере, и скачивается архивом.</p>
      <p class="be-note">💛 Это работы других людей: отмечайте авторов (галочка «Подписывать ники») и, если можно, напишите им, что их рисунок попал в пост — обычно это очень радует.</p>
      <div class="adm-car-opts">
        <label>Какие работы <select data-o="period"><option value="7">за последние 7 дней</option><option value="30" selected>за последние 30 дней</option><option value="0">все</option></select></label>
        <label>Язык текста <select data-o="lang"><option value="en">English</option><option value="ru">Русский</option></select></label>
        <label class="adm-r-chk"><input type="checkbox" data-o="nicks" checked> Подписывать ники</label>
        <label class="adm-r-chk"><input type="checkbox" data-o="ai"> Включать работы с пометкой 🤖</label>
        <button type="button" class="pill-btn pill-fill" data-go>✨ Собрать слайды</button>
      </div><p class="adm-car-st be-note" role="status"></p><div class="adm-car-out"></div></section>`;
    const st = main.querySelector('.adm-car-st'), out = main.querySelector('.adm-car-out'), o = k => main.querySelector(`[data-o=${k}]`);
    main.querySelector('[data-go]').onclick = async e => {
      e.target.disabled = true; out.innerHTML = ''; st.textContent = 'Загружаю работы со стены…';
      try {
        const days = +o('period').value, since = days ? Date.now() / 1000 - days * 86400 : 0, L = o('lang').value, opt = { nicks: o('nicks').checked };
        let before = 9e12, all = [];
        for (let i = 0; i < 20; i++) { // до 480 работ
          const r = await fetch(`/api/wall?before=${before}`, { credentials: 'same-origin' }).then(x => x.json());
          if (!r.posts || !r.posts.length) break;
          all.push(...r.posts); before = r.posts[r.posts.length - 1].created_at;
          if (since && before < since) break;
        }
        let works = all.filter(w => (!since || w.created_at >= since) && (o('ai').checked || !(w.ai > 0))).reverse(); // от старых к новым
        if (!works.length) { st.textContent = 'За это время работ нет.'; e.target.disabled = false; return; }
        try { await Promise.all(['600 84px Fraunces', '700 30px Karla', '500 36px Karla', '800 50px Karla'].map(f => document.fonts.load(f))); } catch (x) { /* шрифты сайта не загрузились — будут системные */ }
        await document.fonts.ready;
        st.textContent = `Работ: ${works.length}. Загружаю картинки…`;
        const imgs = [];
        for (const [i, w] of works.entries()) {
          try { const b = await fetch(`/api/img/${w.id}`, { credentials: 'same-origin' }).then(x => x.ok ? x.blob() : null); imgs[i] = b ? await createImageBitmap(b) : null; } catch (x) { imgs[i] = null; }
          if (i % 5 === 0) st.textContent = `Загружаю картинки… ${i + 1} из ${works.length}`;
        }
        works = works.filter((_, i) => imgs[i]); const pics = imgs.filter(Boolean);
        const B = window.PPBirds; let bird = null; try { bird = B.crop(B.spriteHD(B.dress(B.looks(1), {}), 0)); } catch (x) {}
        const PER = 8, groups = []; for (let i = 0; i < works.length; i += PER) groups.push([i, Math.min(works.length, i + PER)]);
        const files = [];
        for (const [gi, [a, z]] of groups.entries()) {
          const total = z - a + 2, slides = [cover(L, pics.slice(a, z), works.slice(a, z), total)];
          for (let i = a; i < z; i++) slides.push(work(L, pics[i], works[i], i - a + 2, total, opt));
          slides.push(cta(L, total, bird));
          const sec = document.createElement('div'); sec.className = 'adm-car-set'; sec.innerHTML = `<h3>Карусель ${gi + 1}${groups.length > 1 ? ` из ${groups.length}` : ''} · ${slides.length} слайдов</h3><div class="adm-car-row"></div>`;
          out.appendChild(sec); const row = sec.querySelector('.adm-car-row');
          for (const [si, c] of slides.entries()) {
            const blob = await toBlob(c), name = `carousel-${String(gi + 1).padStart(2, '0')}/slide-${String(si + 1).padStart(2, '0')}.jpg`;
            files.push({ name, data: new Uint8Array(await blob.arrayBuffer()) });
            const im = document.createElement('img'); im.src = URL.createObjectURL(blob); im.alt = name; im.title = 'Нажмите, чтобы скачать этот слайд'; im.onclick = () => save(blob, name.replace('/', '-')); row.appendChild(im);
          }
          st.textContent = `Собрано каруселей: ${gi + 1} из ${groups.length}…`;
        }
        st.innerHTML = `Готово: ${groups.length} ${groups.length === 1 ? 'карусель' : 'каруселей'}, ${works.length} работ. Нажмите на слайд, чтобы скачать его, или скачайте всё сразу.`;
        const dl = document.createElement('button'); dl.type = 'button'; dl.className = 'pill-btn pill-fill'; dl.textContent = '⬇ Скачать все слайды (zip)';
        dl.onclick = () => save(zip(files), `pigeonpolly-carousels-${new Date().toISOString().slice(0, 10)}.zip`);
        out.prepend(dl);
      } catch (x) { st.textContent = 'Не получилось: ' + (x && x.message || x); }
      e.target.disabled = false;
    };
  };
})();
