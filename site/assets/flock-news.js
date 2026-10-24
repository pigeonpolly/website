// Новости стаи (этап 13 Г, docs/flock.md): лента /flock/news/ и 3 строки на главной над сценой.
// PPFlockNews.mount(el, { limit, view }) — view: 'rooms' | 'site' (колонки главной, VIEWS); — limit: сколько строк показать (главная — 3, без разделителей дней); без limit — вся лента по дням с «Показать ещё».
// Данные — GET /api/flock/news (worker/flock-news.js). Однотипное за день — одной строкой; шаблон выбирается по id события (не прыгает при обновлении).
(() => {
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, lang = ['en', 'ru', 'lv'][L], pre = ['', '/ru', '/lv'][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ru = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? b : c;
  const lvp = (n, a, b) => n % 10 === 1 && n % 100 !== 11 ? a : b;
  // названия бейджей — из sketch-wall.js (LEVELS: lv + дни, SPECIAL: k)
  const BADGES = {"lv1":["Egg","Яйцо","Ola"],"lv3":["Chick","Птенец","Cālis"],"lv7":["Little pigeon","Голубёнок","Balodītis"],"lv14":["Carrier pigeon","Почтовый голубь","Pasta balodis"],"lv30":["Travelling pigeon","Голубь-путешественник","Ceļotājs balodis"],"lv60":["Artist pigeon","Голубь-художник","Mākslinieks balodis"],"lv100":["Astronaut pigeon","Голубь-астронавт","Astronauts balodis"],"lv365":["Polly legend","Легенда Полли","Pollijas leģenda"],"extra":["Drew on an EXTRA palette day","Рисовал(а) в день ЭКСТРА-палитры","Zīmēju EKSTRA paletes dienā"],"bw":["Ink mood: drew in B/W","Нарисовал(а) в Ч/Б","Zīmēju melnbalti"],"bday":["Polly’s birthday guest","Гость на дне рождения Полли","Pollijas dzimšanas dienas viesis"],"alt":["Every other day","Через денёк","Katru otro dienu"],"monthly":["Monthly regular","Каждый месяц","Ik mēnesi"],"pick":["Polly’s pick","Выбор Полли","Pollijas izvēle"],"early":["Early bird","Ранняя пташка","Agrais putniņš"],"owl":["Night owl","Ночная сова","Nakts pūce"],"weekend":["Weekend artist","Художник выходного дня","Brīvdienu mākslinieks"],"ten":["First ten","Первая десятка","Pirmais desmitnieks"],"fifty":["Half a hundred","Полсотни","Pussimts"],"hundred":["Hundred club","Клуб сотни","Simtnieku klubs"],"inkmaster":["Ink master","Мастер туши","Tušas meistars"],"comeback":["Welcome back","С возвращением","Laipni atpakaļ"],"newyear":["New Year sketch","Новогодний скетч","Jaungada skice"],"triple":["Three in one","Три в одном","Trīs vienā"],"halloween":["Spooky sketch","Тыквенный скетч","Ķirbju skice"],"collector":["Collector","Коллекционер","Kolekcionārs"],"robot":["Beep-boop","Бип-буп","Bīp-būp"],"cpurple":["Purple mood","Фиолетовое настроение","Violeta noskaņa"],"cyellow":["Sunny streak","Солнечная серия","Saulainā sērija"],"cred":["Red alert","Красная тревога","Sarkanā trauksme"],"cblue":["Feeling blue (the good kind)","Синее настроение (хорошее)","Zilā noskaņa (labā)"],"cgreen":["Green thumb","Зелёные руки","Zaļie pirksti"],"clock":["Like clockwork","Как по часам","Kā pulkstenis"],"rain1":["Rain walker","Под дождём","Lietus gājējs"],"rain2":["Quick paws","Ловкие лапки","Veiklās ķepas"],"rain3":["Lord of the downpour","Повелитель ливня","Lietusgāzes valdnieks"],"pot1":["First potion","Первое зелье","Pirmā dzira"],"pot2":["Young alchemist","Юный алхимик","Jaunais alķīmiķis"],"pot3":["Cauldron master","Мастер котла","Katla meistars"],"potkid":["Taste of childhood","Вкус детства","Bērnības garša"],"maze":["Maze walker","Лабиринтоход","Labirintu gājējs"],"pan1":["Pancake apprentice","Блинный подмастерье","Pankūku māceklis"],"pan2":["Flip master","Мастер переворота","Apgriešanas meistars"],"pan3":["Pancake legend of Wobbleland","Блинная легенда Воббленда","Wobbleland pankūku leģenda"],"panstar":["Everyone’s favourite","Всеобщая любимица","Visu mīlule"],"panwash":["Squeaky clean","Чисто до скрипа","Tīrs līdz čīkstēšanai"]};
  // {n} — ник-ссылка, {t} — тема или название, {N} — число, {b} — бейдж, {i} — вещь
  const TPL = {
    new: [['A new bird in the flock: {n}!', '{n} has just hatched. Say hello!', 'The flock grows: {n}.'],
      ['В стае новенькая — птичка {n}!', 'Из яйца проклюнулась птичка {n}. Встречайте!', 'Пополнение в стае: {n}.'],
      ['Barā jauns putniņš — {n}!', 'No olas izšķīlies putniņš {n}. Sveicam!', 'Papildinājums barā: {n}.']],
    drawing: [['{n} has a new drawing: “{t}”.', 'Theme of the day “{t}”: a piece by {n}.'],
      ['У {n} новый рисунок: «{t}».', 'Тема дня «{t}» — работа {n}.'],
      ['{n} ir jauns zīmējums: “{t}”.', 'Dienas tēma “{t}” — {n} darbs.']],
    room: [[N => 'Housewarming at {n}: {N} new things in the room.', () => '{n} has rearranged the room. Drop by and have a look.', () => '{n} is feathering the nest.'],
      [N => 'У {n} новоселье: {N} ' + ru(N, 'новая вещь', 'новые вещи', 'новых вещей') + ' в комнате.', () => 'В комнате {n} перестановка. Загляните оценить.', () => 'Птичка {n} обустраивает гнёздышко.'],
      [N => '{n} istabā ievākšanās svētki: {N} ' + lvp(N, 'jauna lieta', 'jaunas lietas') + '.', () => '{n} istabā pārkārtojumi. Ieskaties novērtēt.', () => 'Putniņš {n} iekārto ligzdiņu.']],
    badge: [['{n} has a new badge: “{b}”.', '“{b}” badge: now {n} has it too. Proud of you.'],
      ['У {n} новый бейдж — «{b}».', 'Бейдж «{b}» — теперь и у {n}. Гордимся.'],
      ['{n} ir jauna nozīmīte — “{b}”.', 'Nozīmīte “{b}” tagad ir arī {n}. Lepojamies.']],
    card: [['Card No. {N} “{t}” has found its owner: {n}. There is only one.', 'A new card in {n}’s album: “{t}”.'],
      ['Карточка №{N} «{t}» нашла хозяйку — {n}. Она такая одна.', 'В альбоме {n} прибавление: «{t}».'],
      ['Kartīte Nr. {N} “{t}” atrada saimnieku — {n}. Tāda ir tikai viena.', '{n} albumā papildinājums: “{t}”.']],
    legend: [['{n} has a legendary item: {i} ★.', '{i} ★ now lives with {n}. Everyone else is quietly jealous.'],
      ['У {n} легендарная вещь: {i} ★.', '{i} ★ теперь живёт у {n}. Остальные тихо завидуют.'],
      ['{n} ir leģendāra lieta: {i} ★.', '{i} ★ tagad dzīvo pie {n}. Pārējie klusi apskauž.']],
    titos: [['{n}: {N} Titos cases solved. Titos had a coffee to celebrate.', '{N} cases behind. {n} is the terror of Wobbleland villains.'],
      ['{n}: раскрыто {N} дел Титоса. Титос выпил за это кофе.', '{N} дел позади. {n} — гроза злодеев Воббленда.'],
      ['{n}: atrisinātas {N} Titosa lietas. Titoss par to iedzēra kafiju.', '{N} lietas aiz muguras. {n} — Wobbleland ļaundaru posts.']],
    pick: [['{n}’s drawing is “Polly’s choice” ★.', 'Polly picked a drawing by {n}. Polly knows her stuff.'],
      ['Работа {n} — «Выбор Полли» ★.', 'Полли выбрала рисунок {n}. Полли знает толк.'],
      ['{n} darbs — “Pollijas izvēle” ★.', 'Pollija izvēlējās {n} zīmējumu. Pollija zina, kas ir labs.']],
    feathers: [['Birds left {N} feathers in {n}’s room. It must be cosy there.'], ['Комнате {n} оставили {N} пёрышек. Уютно там, наверное.'], ['{n} istabai atstātas {N} spalviņas. Tur laikam ir omulīgi.']],
  };
  const PACK = {
    new: [(N, K) => `${N} new birds hatched: {list}${K ? ` and ${K} more` : ''}.`, (N, K) => `Вылупились ${N} ${ru(N, 'новая птичка', 'новые птички', 'новых птичек')}: {list}${K ? ` и ещё ${K}` : ''}.`, (N, K) => `Izšķīlušies ${N} jauni putniņi: {list}${K ? ` un vēl ${K}` : ''}.`],
    drawing: [N => `“{t}” has been drawn by ${N} birds already.`, N => `«{t}» уже ${ru(N, 'нарисовала', 'нарисовали', 'нарисовали')} ${N} ${ru(N, 'птичка', 'птички', 'птичек')}.`, N => `“{t}” jau uzzīmējuši ${N} putniņi.`],
  };
  const POLLY = {
    post: ['New blog post: “{t}”.', 'Новая статья в блоге: «{t}».', 'Jauns raksts blogā: “{t}”.'],
    set: ['New collection in the shop: {t}.', 'В магазине новая коллекция: {t}.', 'Veikalā jauna kolekcija: {t}.'],
    restock: [N => `The shop has been restocked: ${N} ${N === 1 ? 'item is' : 'items are'} back in stock.`, N => `Магазин пополнился: ${N} ${ru(N, 'вещь', 'вещи', 'вещей')} снова в наличии.`, N => `Veikals papildināts: ${N} ${lvp(N, 'lieta', 'lietas')} atkal pieejamas.`],
    advent: ['Advent is open! Window No. {N} is waiting.', 'Адвент открыт! Окошко №{N} ждёт.', 'Advente atvērta! Lodziņš Nr. {N} gaida.'],
  };
  const T = {
    title: ['Flock news', 'Новости стаи', 'Bara ziņas'], all: ['All flock news →', 'Все новости стаи →', 'Visas bara ziņas →'],
    today: ['Today', 'Сегодня', 'Šodien'], yday: ['Yesterday', 'Вчера', 'Vakar'], more: ['Show more', 'Показать ещё', 'Rādīt vairāk'],
    empty: ['No news yet. Draw something, and the flock will hear about it!', 'Пока новостей нет. Нарисуй что-нибудь — и стая узнает!', 'Pagaidām ziņu nav. Uzzīmē kaut ko, un bars uzzinās!'],
    err: ['Could not load the news. Try again later.', 'Не удалось загрузить новости. Попробуй позже.', 'Neizdevās ielādēt ziņas. Pamēģini vēlāk.'],
    visit: ['Visit', 'Зайти', 'Ieiet'], look: ['Look', 'Смотреть', 'Skatīt'], hello: ['Say hi', 'Поздороваться', 'Sasveicināties'],
    polly: ['Polly', 'Полли', 'Pollija'], pin: ['Announcement', 'Объявление', 'Paziņojums'],
  };
  // виды для колонок главной (data-fn-view): только свои kind, свой заголовок; all — ссылка внизу (пусто — без ссылки)
  const VIEWS = {
    rooms: { kinds: ['room', 'feathers'], title: ['News from bird rooms', 'Новое в комнатах птичек', 'Jaunumi putniņu istabās'], all: T.all,
      empty: ['The rooms are quiet for now.', 'В комнатах пока тихо.', 'Istabās pagaidām klusi.'] },
    site: { kinds: ['polly'], title: ['New on the site', 'Новое на сайте', 'Jaunumi vietnē'], all: null,
      empty: ['Nothing new yet.', 'Пока ничего нового.', 'Pagaidām nekā jauna.'] },
  };
  const BTN = { new: 'hello', drawing: 'look', pick: 'look', card: 'look', polly: 'look' };
  const hash = s => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const pickT = (list, id) => list[hash(id) % list.length];
  const prof = nick => pre + '/bird/?nick=' + encodeURIComponent(nick);
  const nickA = nick => `<a href="${prof(nick)}" data-profile="${esc(nick)}">@${esc(nick)}</a>`;
  const fill = (tpl, o) => esc(tpl).replace(/\{(\w+)\}/g, (m, k) => k === 'n' ? nickA(o.nick) : k === 'list' ? o.list : k === 'i' ? '<b>' + esc(o.i) + '</b>' : esc(o[k] ?? ''));
  const time = ts => new Date(ts * 1000).toLocaleTimeString(['en-GB', 'ru-RU', 'lv-LV'][L], { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Riga' });
  const dayName = (day, today) => {
    if (day === today) return T.today[L];
    const y = new Date(today + 'T12:00:00Z'); y.setUTCDate(y.getUTCDate() - 1);
    if (day === y.toISOString().slice(0, 10)) return T.yday[L];
    return new Date(day + 'T12:00:00Z').toLocaleDateString(['en-GB', 'ru-RU', 'lv-LV'][L], { day: 'numeric', month: 'long', timeZone: 'UTC' });
  };
  const local = u => (pre && u.startsWith('/') && !/^\/(ru|lv)\//.test(u) && !u.startsWith('/api/') ? pre : '') + u;

  // однотипное за день — в одну строку: new — все за день, drawing — по теме, остальное — одна птичка и один вид
  function group(evs) {
    const out = [], at = new Map();
    for (const e of evs) {
      if (e.kind === 'badge' && !BADGES[e.badge]) continue;
      const key = e.kind === 'polly' ? 'p' + e.id : e.day + '|' + e.kind + '|' + (e.kind === 'new' ? '' : e.kind === 'drawing' ? e.theme : e.uid);
      const g = at.get(key);
      if (g) g.more.push(e); else { const x = { ...e, more: [] }; at.set(key, x); out.push(x); }
    }
    return out;
  }
  function text(g) {
    const n = g.more.length + 1, o = { nick: g.nick, t: g.theme || g.title, N: g.n, b: BADGES[g.badge] && BADGES[g.badge][L], i: window.PPBirds && g.k ? PPBirds.giftName(g.k, g.v, L) : g.v };
    if (g.kind === 'polly') { const p = g.what === 'note' ? null : POLLY[g.what][L]; return p ? fill(typeof p === 'function' ? p(g.n) : p, { t: g.title, N: g.n }) : esc(g.text); }
    if (n > 1 && g.kind === 'new') {
      const all = [g, ...g.more], K = all.length > 3 ? all.length - 2 : 0, shown = K ? all.slice(0, 2) : all;
      const ns = shown.map(x => nickA(x.nick)), list = K ? ns.join(', ') : ns.slice(0, -1).join(', ') + [' and ', ' и ', ' un '][L] + ns[ns.length - 1];
      return fill(PACK.new[L](all.length, K), { list });
    }
    if (n > 1 && g.kind === 'drawing') return fill(PACK.drawing[L](n), o);
    const tpl = pickT(TPL[g.kind][L], g.id);
    return fill(typeof tpl === 'function' ? tpl(g.n) : tpl, o) + (n > 1 ? ` <span class="fn-plus">+${n - 1}</span>` : '');
  }
  function row(g, today) {
    const li = document.createElement('li'); li.className = 'fn-row fn-' + g.kind;
    const who = g.kind === 'polly' || (g.kind === 'new' || g.kind === 'drawing') && g.more.length ? null : g.nick;
    const href = g.kind === 'polly' ? local(g.url || '') : g.kind === 'drawing' && g.more.length ? '' : prof(g.nick);
    const btn = g.kind === 'polly' && !g.url ? '' : href ? `<a class="fn-btn" href="${esc(href)}">${T[BTN[g.kind] || 'visit'][L]}</a>` : '';
    const strip = g.kind === 'drawing' && g.more.length ? `<span class="fn-strip">${[g, ...g.more].slice(0, 8).map(x => `<a href="${prof(x.nick)}" title="@${esc(x.nick)}"><img src="${esc(x.img)}" alt="" loading="lazy"></a>`).join('')}</span>` : '';
    const pic = !strip && g.img ? `<a class="fn-pic" href="${esc(href || prof(g.nick))}"><img src="${esc(g.img)}" alt="" loading="lazy"></a>` : '';
    li.innerHTML = `<span class="fn-ava">${who ? '' : g.kind === 'polly' ? '🕊️' : g.kind === 'drawing' ? '🎨' : '🐣'}</span>
      <p class="fn-txt">${text(g)}<time>${today && g.day !== today ? dayName(g.day, today) : time(g.ts)}</time></p>${strip}${pic}${btn}`;
    if (who && window.PPBirds) { const a = document.createElement('a'); a.href = prof(who); a.className = 'fn-ava'; a.title = '@' + who; a.appendChild(PPBirds.avatar(g.uid, g.avatar, 36)); li.querySelector('.fn-ava').replaceWith(a); }
    return li;
  }

  async function mount(el, o = {}) {
    el.classList.add('fn'); el.innerHTML = '<p class="fn-msg">…</p>';
    let d;
    try { d = await fetch('/api/flock/news?lang=' + lang).then(r => r.ok ? r.json() : Promise.reject()); }
    catch (e) { el.innerHTML = `<p class="fn-msg">${T.err[L]}</p>`; return; }
    const v = VIEWS[o.view] || { title: T.title, all: T.all, empty: T.empty };
    const rows = group((d.events || []).filter(e => !v.kinds || v.kinds.includes(e.kind)));
    el.innerHTML = '';
    if (o.limit) {
      const ul = document.createElement('ul'); ul.className = 'fn-list';
      rows.slice(0, o.limit).forEach(g => ul.appendChild(row(g, v.kinds && d.today)));
      el.insertAdjacentHTML('beforeend', `<h2 class="fn-h">${v.title[L]}</h2>`);
      if (rows.length) el.appendChild(ul); else el.insertAdjacentHTML('beforeend', `<p class="fn-msg">${v.empty[L]}</p>`);
      if (v.all) el.insertAdjacentHTML('beforeend', `<a class="fn-all" href="${pre}/flock/news/">${v.all[L]}</a>`);
      return;
    }
    for (const p of d.pinned || []) el.insertAdjacentHTML('beforeend', `<p class="fn-pinned"><b>📣 ${T.pin[L]}</b> ${esc(p.text)}</p>`);
    if (!rows.length) { el.insertAdjacentHTML('beforeend', `<p class="fn-msg">${T.empty[L]}</p>`); return; }
    const days = [...new Set(rows.map(g => g.day))];
    let shown = 0;
    const more = document.createElement('button'); more.type = 'button'; more.className = 'pill-btn fn-more'; more.textContent = T.more[L];
    const step = () => {
      for (const day of days.slice(shown, shown + 7)) {
        el.insertBefore(Object.assign(document.createElement('h3'), { className: 'fn-day', textContent: dayName(day, d.today) }), more);
        const ul = document.createElement('ul'); ul.className = 'fn-list';
        rows.filter(g => g.day === day).forEach(g => ul.appendChild(row(g)));
        el.insertBefore(ul, more);
      }
      shown += 7; more.hidden = shown >= days.length;
    };
    el.appendChild(more); more.onclick = step;
    step();
  }
  window.PPFlockNews = { mount };
  const go = () => document.querySelectorAll('[data-flock-news]').forEach(el => mount(el, { limit: Number(el.dataset.flockNews) || 0, view: el.dataset.fnView }));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
