/* «Мой кабинет» — свой профиль /bird/ (без ?nick=). sketch-wall.js renderPage() рисует профиль и шлёт pp:profile;
   здесь он раскладывается по вкладкам: 📚 Учёба · 🐦 Птичка и игры · ✉️ Письма · ⚙ Настройки. Чужой профиль — как был.
   Вкладка запоминается (localStorage pp-cab); /bird/#learn, #bird, #mail, #settings — сразу нужная; #room/#bag/#album — «Птичка и игры». */
(function () {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const pre = ['', '/ru', '/lv'][L];
  const T = {
    title: ['My space', 'Мой кабинет', 'Mans kabinets'],
    learn: ['📚 Learning', '📚 Учёба', '📚 Mācības'],
    bird: ['🐦 Bird & games', '🐦 Птичка и игры', '🐦 Putniņš un spēles'],
    mail: ['✉️ Letters', '✉️ Письма', '✉️ Vēstules'],
    acc: ['⚙ Settings', '⚙ Настройки', '⚙ Iestatījumi'],
    vipK: ['VIP lesson · open for you', 'VIP-урок · открыт для тебя', 'VIP nodarbība · atvērta tev'],
    vipT: ['Watercolour review', 'Обзор акварели', 'Akvareļu apskats'],
    watch: ['▶ Watch', '▶ Смотреть', '▶ Skatīties'],
    freeT: ['Free lessons', 'Бесплатные уроки', 'Bezmaksas nodarbības'],
    freeS: ['Paint-alongs and sketches, open to everyone', 'Рисуем вместе и скетчи — открыты всем', 'Zīmējam kopā un skices — atvērtas visiem'],
    guidesT: ['Guides & books', 'Гайды и книги', 'Ceļveži un grāmatas'],
    guidesS: ['Creative guides by Alina', 'Творческие гайды Алины', 'Alīnas radošie ceļveži'],
    open: ['Open →', 'Открыть →', 'Atvērt →'],
    schT: ['Polly’s School', 'Школа Полли', 'Pollijas skola'],
    schS: n => [`Stamps: ${n} of 12`, `Печатей: ${n} из 12`, `Zīmogi: ${n} no 12`][L],
    schNew: ['Twelve small drawing lessons with a pixel diploma at the end', 'Двенадцать маленьких уроков рисования, в конце — пиксельный диплом', 'Divpadsmit mazas zīmēšanas nodarbības, beigās — pikseļu diploms'],
    schGo: ['Continue →', 'Продолжить →', 'Turpināt →'],
    schStart: ['Start →', 'Начать →', 'Sākt →'],
    dipT: ['📜 Diploma of Polly’s School', '📜 Диплом Школы Полли', '📜 Pollijas skolas diploms'],
    dipS: ['All twelve stamps are in. Your diploma lives here.', 'Все двенадцать печатей собраны. Твой диплом лежит здесь.', 'Visi divpadsmit zīmogi savākti. Tavs diploms glabājas šeit.'],
    dipGo: ['Open the diploma →', 'Открыть диплом →', 'Atvērt diplomu →'],
    books: ['My textbooks', 'Мои учебники', 'Manas mācību grāmatas'],
    study: ['📘 Textbook', '📘 Учебник', '📘 Mācību grāmata'],
    english: ['🇬🇧 English course', '🇬🇧 Учебник английского', '🇬🇧 Angļu valodas kurss'],
    norsk: ['🇳🇴 Norwegian course', '🇳🇴 Учебник норвежского', '🇳🇴 Norvēģu valodas kurss'],
    soon: ['Courses and materials you get will appear here too.', 'Сюда же лягут курсы и материалы, которые у тебя появятся.', 'Šeit parādīsies arī tavi kursi un materiāli.'],
    all: ['✓ Tick all', '✓ Отметить все', '✓ Atzīmēt visus'], none: ['Untick all', 'Снять все', 'Noņemt visus'],
    play: ['Games', 'Игры', 'Spēles'], shop: ['Shop', 'Магазин', 'Veikals'], flock: ['Other birds’ rooms', 'Комнаты других птичек', 'Citu putniņu istabas'],
  };
  const t = k => T[k][L];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const TABS = ['learn', 'bird', 'mail', 'acc'];
  const HASH = { learn: 'learn', bird: 'bird', mail: 'mail', settings: 'acc' };
  let cur = null, root = null;
  try { cur = localStorage.getItem('pp-cab'); } catch (e) {}
  const h0 = location.hash.slice(1);
  if (HASH[h0]) cur = HASH[h0];
  if (['room', 'bag', 'album', 'gift'].includes(h0)) cur = 'bird';
  if (!TABS.includes(cur)) cur = 'learn';

  function show(k) {
    if (!TABS.includes(k)) return;
    cur = k;
    try { localStorage.setItem('pp-cab', k); } catch (e) {}
    if (!root) return;
    root.querySelectorAll('.cab-tabs [data-cab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.cab === k)));
    root.querySelectorAll('.cab-pane').forEach(p => { p.hidden = p.dataset.pane !== k; });
    if (k === 'bird') dispatchEvent(new Event('resize')); // комната мерит ширину
  }
  window.PPCab = { show };
  addEventListener('hashchange', () => { const k = HASH[location.hash.slice(1)]; if (k) show(k); });

  const who = () => window.PPWho ? Promise.resolve(window.PPWho) : fetch('/api/whoami', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).catch(() => null);

  function learnPane(el) {
    el.innerHTML = `<div class="cab-grid">
      <a class="cab-card cab-vip" href="${pre}/learn/" hidden><span class="cab-cover"><img src="/images/v2/lesson-szmal.jpg" alt="" loading="lazy"><i>▶</i></span>
        <span class="cab-k">${t('vipK')}</span><b>${t('vipT')}</b><em>${t('watch')}</em></a>
      <div class="cab-card cab-school"><span class="cab-k">${t('schT')}</span><b class="cab-sch-t">${t('schT')}</b><p class="cab-sch-s">${t('schNew')}</p>
        <div class="cab-stamps" aria-hidden="true">${'<i></i>'.repeat(12)}</div><a class="cab-btn" href="${pre}/polly-helps/#school">${t('schStart')}</a></div>
      <a class="cab-card" href="${pre}/learn/"><span class="cab-k">YouTube</span><b>${t('freeT')}</b><p>${t('freeS')}</p><em>${t('open')}</em></a>
      <a class="cab-card" href="${pre}/guides/"><span class="cab-k">PDF · Amazon</span><b>${t('guidesT')}</b><p>${t('guidesS')}</p><em>${t('open')}</em></a>
    </div>
    <div class="cab-books" hidden><h2>${t('books')}</h2><div class="cab-row"></div></div>
    <p class="cab-soon">${t('soon')}</p>`;
    fetch('/api/v2/vip', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => {
      const v = d && d.videos && d.videos[0]; if (!v) return;
      const a = el.querySelector('.cab-vip'); a.hidden = false; a.dataset.yt = v.id; a.href = 'https://youtu.be/' + v.id;
    }).catch(() => {});
    fetch('/api/school?peek=1&lang=' + ['en', 'ru', 'lv'][L], { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => {
      if (!d || !d.me) return;
      const n = (d.works || []).filter(w => w.status === 'ok').length, box = el.querySelector('.cab-school');
      box.querySelectorAll('.cab-stamps i').forEach((i, k) => i.classList.toggle('on', k < n));
      if (n >= 12) {
        box.classList.add('cab-dip');
        box.querySelector('.cab-sch-t').textContent = t('dipT'); box.querySelector('.cab-sch-s').textContent = t('dipS');
        const b = box.querySelector('.cab-btn'); b.href = pre + '/polly-helps/#diploma'; b.textContent = t('dipGo');
      } else if (n || (d.works || []).length) {
        box.querySelector('.cab-sch-s').textContent = T.schS(n);
        box.querySelector('.cab-btn').textContent = t('schGo');
      }
    }).catch(() => {});
    who().then(w => {
      const u = w && (w.user || w); if (!u) return;
      const links = [['study', '/study/'], ['english', '/english/'], ['norsk', '/norsk/']].filter(([k]) => u[k]);
      if (!links.length) return;
      const b = el.querySelector('.cab-books'); b.hidden = false;
      b.querySelector('.cab-row').innerHTML = links.map(([k, h]) => `<a class="cab-pill" href="${h}">${t(k)}</a>`).join('');
    });
  }

  document.addEventListener('pp:profile', e => {
    const page = document.getElementById('bird-profile');
    if (!page || !e.detail || !e.detail.mine) { document.body.classList.remove('cab-on'); return; }
    document.body.classList.add('cab-on');
    document.title = t('title') + ' · Pigeon Polly';
    const cr = document.querySelector('.crumbs [aria-current]'); if (cr) cr.textContent = t('title');
    const head = page.querySelector('.bp-head');
    const kids = [...page.children].filter(x => x !== head);
    const accAt = kids.findIndex(x => x.classList.contains('bp-acc'));
    const birdEls = accAt < 0 ? kids : kids.slice(0, accAt), accEls = accAt < 0 ? [] : kids.slice(accAt);
    const kick = document.createElement('p'); kick.className = 'cab-kick'; kick.textContent = t('title');
    head.querySelector('.bp-who').prepend(kick);
    root = document.createElement('div'); root.className = 'cab';
    root.innerHTML = `<div class="cab-tabs" role="tablist">${TABS.map(k => `<button type="button" role="tab" data-cab="${k}">${t(k)}</button>`).join('')}</div>`
      + TABS.map(k => `<div class="cab-pane" data-pane="${k}" role="tabpanel"></div>`).join('');
    head.after(root);
    const pane = k => root.querySelector(`[data-pane="${k}"]`);
    learnPane(pane('learn'));
    const quick = document.createElement('div'); quick.className = 'cab-row cab-quick';
    quick.innerHTML = `<a class="cab-pill" href="${pre}/games/">🎮 ${t('play')}</a><a class="cab-pill" href="${pre}/shop/">🛍 ${t('shop')}</a><a class="cab-pill" href="${pre}/flock/">🏠 ${t('flock')}</a>`;
    pane('bird').append(quick, ...birdEls);
    pane('mail').innerHTML = `<div class="cab-mail"><div class="cab-col" data-my-news></div><div class="cab-col" data-fn="site"></div><div class="cab-col" data-fn="rooms"></div></div>`;
    if (window.PPNews && window.PPNews.inline) window.PPNews.inline();
    if (window.PPFlockNews) { window.PPFlockNews.mount(pane('mail').querySelector('[data-fn="site"]'), { limit: 5, view: 'site' }); window.PPFlockNews.mount(pane('mail').querySelector('[data-fn="rooms"]'), { limit: 5, view: 'rooms' }); }
    pane('acc').append(...accEls);
    const mb = pane('acc').querySelector('#mail'); // письма с сайта: «Отметить все» / «Снять все» одной кнопкой
    if (mb) {
      const all = document.createElement('button'); all.type = 'button'; all.className = 'cab-all';
      const boxes = () => [...mb.querySelectorAll('input[type=checkbox]')];
      const label = () => { all.textContent = boxes().every(b => b.checked) ? t('none') : t('all'); };
      all.onclick = () => {
        const on = !boxes().every(b => b.checked);
        const dm = [...mb.querySelectorAll('[data-mail]')];
        dm.forEach(b => { b.checked = on; });
        if (dm[0]) dm[0].dispatchEvent(new Event('change')); // sketch-wall сохраняет все три галочки разом
        mb.querySelectorAll('input:not([data-mail])').forEach(b => { if (b.checked !== on) { b.checked = on; b.dispatchEvent(new Event('change')); } });
        label();
      };
      mb.addEventListener('change', label); label();
      mb.querySelector('legend').after(all);
    }
    root.querySelectorAll('.cab-tabs [data-cab]').forEach(b => b.onclick = () => { show(b.dataset.cab); history.replaceState(null, '', location.pathname + location.search); });
    show(cur);
  });
})();
