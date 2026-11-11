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
    vipT: ['Watercolour review', 'Обзор акварели', 'Akvareļu apskats'],
    watch: ['▶ Watch', '▶ Смотреть', '▶ Skatīties'],
    schT: ['Polly’s School', 'Школа Полли', 'Pollijas skola'],
    schS: n => [`Stamps: ${n} of 12`, `Печатей: ${n} из 12`, `Zīmogi: ${n} no 12`][L],
    schNew: ['Twelve small drawing lessons with a pixel diploma at the end', 'Двенадцать маленьких уроков рисования, в конце — пиксельный диплом', 'Divpadsmit mazas zīmēšanas nodarbības, beigās — pikseļu diploms'],
    schGo: ['Continue →', 'Продолжить →', 'Turpināt →'],
    schStart: ['Start →', 'Начать →', 'Sākt →'],
    dipT: ['📜 Diploma of Polly’s School', '📜 Диплом Школы Полли', '📜 Pollijas skolas diploms'],
    dipS: ['All twelve stamps are in. Your diploma lives here.', 'Все двенадцать печатей собраны. Твой диплом лежит здесь.', 'Visi divpadsmit zīmogi savākti. Tavs diploms glabājas šeit.'],
    dipGo: ['Open the diploma →', 'Открыть диплом →', 'Atvērt diplomu →'],
    books: ['📘 My textbooks', '📘 Мои учебники', '📘 Manas mācību grāmatas'],
    study: ['Programming textbook', 'Учебник программирования', 'Programmēšanas mācību grāmata'],
    english: ['English course', 'Учебник английского', 'Angļu valodas kurss'],
    norsk: ['Norwegian course', 'Учебник норвежского', 'Norvēģu valodas kurss'],
    openBook: ['Open →', 'Открыть →', 'Atvērt →'],
    dips: ['📜 Diplomas', '📜 Дипломы', '📜 Diplomi'],
    dipNext: ['On the way to a diploma', 'На пути к диплому', 'Ceļā uz diplomu'],
    guidesH: ['🎬 Guides', '🎬 Гайды', '🎬 Ceļveži'],
    allT: ['All video guides', 'Все видеогайды', 'Visi video ceļveži'],
    allS: ['Free lessons and VIP lessons — in one place', 'Бесплатные и VIP-уроки — в одном месте', 'Bezmaksas un VIP nodarbības — vienuviet'],
    seeAll: ['See all →', 'Смотреть все →', 'Skatīt visus →'],
    gNew: ['New', 'Новое', 'Jaunākais'], gLast: ['Last watched', 'Последний просмотренный', 'Pēdējais skatītais'],
    gNext: ['Next to watch', 'Посмотреть дальше', 'Skaties tālāk'], gSeen: ['watched', 'просмотрено', 'skatīts'],
    vidT: ['Video lesson', 'Видеоурок', 'Video nodarbība'],
    pdf: ['PDF guides and books →', 'PDF-гайды и книги →', 'PDF ceļveži un grāmatas →'],
    soon: ['Courses and materials you get will appear here too.', 'Сюда же лягут курсы и материалы, которые у тебя появятся.', 'Šeit parādīsies arī tavi kursi un materiāli.'],
    all: ['✓ Tick all', '✓ Отметить все', '✓ Atzīmēt visus'], none: ['Untick all', 'Снять все', 'Noņemt visus'],
    play: ['Games', 'Игры', 'Spēles'], shop: ['Shop', 'Магазин', 'Veikals'], flock: ['Other birds’ rooms', 'Комнаты других птичек', 'Citu putniņu istabas'],
  };
  const t = k => T[k][L];
  const NAMES = [[/pepper|перец|перц/i, ['Pepper sketching', 'Скетч перца', 'Pipara skice']], [/caf[eé]|outdoor|кафе/i, ['Outdoor sketching in a cafe', 'Скетч на выезде: кафе', 'Skices ārpus mājām: kafejnīca']]]; // как в v2.js
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

  // Учёба: 📘 учебники книжечками (если доступны) · 📜 дипломы (Школа Полли; пока не пройдена — печати) · 🎬 гайды:
  // новый и последний просмотренный (localStorage pp-yt-last — пишет v2.js при запуске [data-yt]) + «Смотреть все» → /learn/
  const FREE_YT = ['eRa1uB_7s9U', 'VVvLZcIqUbM']; // как в src/pages/preview-learn.html, новое первым
  const BOOK = { study: ['#2F5F6A', '💻', '/study/'], english: ['#22405F', '🇬🇧', '/english/'], norsk: ['#8E2F3C', '🇳🇴', '/norsk/'] };
  const sec = (k, h, more) => `<section class="cab-sec cab-${k}"${k === 'books' ? ' hidden' : ''}><div class="cab-sh"><h2>${h}</h2>${more || ''}</div><div class="cab-body"></div></section>`;
  function learnPane(el) {
    el.innerHTML = sec('books', t('books'))
      + sec('dips', t('dips'))
      + sec('guides', t('guidesH'))
      + `<p class="cab-soon">${t('soon')} <a href="${pre}/guides/">${t('pdf')}</a></p>`;
    const dips = el.querySelector('.cab-dips .cab-body'), guides = el.querySelector('.cab-guides .cab-body');
    dips.innerHTML = `<div class="cab-card cab-school"><span class="cab-k">${t('schT')}</span><b class="cab-sch-t">${t('schT')}</b><p class="cab-sch-s">${t('schNew')}</p>
        <div class="cab-stamps" aria-hidden="true">${'<i></i>'.repeat(12)}</div><a class="cab-btn" href="${pre}/polly-helps/#school">${t('schStart')}</a></div>`;
    fetch('/api/school?peek=1&lang=' + ['en', 'ru', 'lv'][L], { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => {
      if (!d || !d.me) return;
      const n = (d.works || []).filter(w => w.status === 'ok').length, box = dips.querySelector('.cab-school');
      box.querySelectorAll('.cab-stamps i').forEach((i, k) => i.classList.toggle('on', k < n));
      if (n >= 12) {
        box.classList.add('cab-dip');
        box.querySelector('.cab-sch-t').textContent = t('dipT'); box.querySelector('.cab-sch-s').textContent = t('dipS');
        const b = box.querySelector('.cab-btn'); b.href = pre + '/polly-helps/#diploma'; b.textContent = t('dipGo');
      } else if (n || (d.works || []).length) {
        box.querySelector('.cab-k').textContent = t('dipNext');
        box.querySelector('.cab-sch-s').textContent = T.schS(n);
        box.querySelector('.cab-btn').textContent = t('schGo');
      } else box.querySelector('.cab-k').textContent = t('dipNext');
    }).catch(() => {});
    // гайды: VIP (вошедшим) новее бесплатных
    fetch('/api/v2/vip', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).catch(() => null).then(d => {
      const vids = [...((d && d.videos) || []).map(v => ({ id: v.id, vip: 1 })), ...FREE_YT.map(id => ({ id }))];
      let last = null; try { last = localStorage.getItem('pp-yt-last'); } catch (e) {}
      const seen = vids.find(v => v.id === last && v !== vids[0]);
      const pick = [[vids[0], t('gNew')], seen ? [seen, t('gLast')] : [vids[1], t('gNext')]].filter(x => x[0]);
      if (last && last === vids[0].id) pick[0][1] = t('gNew') + ' · ' + t('gSeen');
      guides.innerHTML = '<div class="cab-grid">' + pick.map(([v, k]) => `<a class="cab-card cab-vid" href="https://youtu.be/${v.id}" data-yt="${v.id}" target="_blank" rel="noopener">
        <span class="cab-cover"><img src="${v.vip ? '/images/v2/lesson-szmal.jpg' : `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}" alt="" loading="lazy"><i>▶</i></span>
        <span class="cab-k">${k}${v.vip ? ' · VIP' : ''}</span><b>${v.vip ? t('vipT') : '…'}</b><em>${t('watch')}</em></a>`).join('')
        + `<a class="cab-card cab-more" href="${pre}/learn/"><span class="cab-k">${t('guidesH').slice(3)}</span><b>${t('allT')}</b><p>${t('allS')}</p><em class="cab-go">${t('seeAll')}</em></a></div>`;
      guides.querySelectorAll('.cab-vid').forEach((a, i) => {
        if (pick[i][0].vip) return;
        const b = a.querySelector('b'); b.textContent = t('vidT');
        fetch('/api/v2/yt?id=' + a.dataset.yt).then(r => r.ok ? r.json() : null).then(x => {
          const tt = x && x.title; if (!tt) return;
          const nm = NAMES.find(n => n[0].test(tt)); b.textContent = nm ? nm[1][L] : tt;
        }).catch(() => {});
      });
    });
    who().then(w => {
      const u = w && (w.user || w); if (!u) return;
      const ks = Object.keys(BOOK).filter(k => u[k]);
      if (!ks.length) return;
      const b = el.querySelector('.cab-books'); b.hidden = false;
      b.querySelector('.cab-body').innerHTML = '<div class="cab-shelf">' + ks.map(k => `<a class="cab-book" href="${BOOK[k][2]}" style="--bk:${BOOK[k][0]}"><span class="cab-bk-c"><i>${BOOK[k][1]}</i><b>${t(k)}</b></span><em>${t('openBook')}</em></a>`).join('') + '</div>';
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
