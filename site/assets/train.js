// «Поезд Полли» (/train/, src/pages/train.html, docs/games.md): Полли едет из Воббленда в выбранную страну и дальше по ней без конца,
// Эмпанадильо (маскот Libertas.study) учит слова языка этой страны. Станции по кругу: «Что это?» (выбрать перевод), «Пары в купе» (мемори),
// «Вагон-ресторан» (подать заказ, пока пассажир не заскучал). Перед станцией — 4 новых слова; слова с ошибками возвращаются (localStorage pp-train).
// Слова — site/assets/train-words.js (ручные слова станций + словарь dict). Пуговки, рекорды, вещи, бейджи и улучшения — сервер worker/train.js.
(() => {
  const app = document.getElementById('train'); if (!app) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, SL = ['en', 'ru', 'lv'][L];
  const WD = window.PPTrainWords;
  const T = {
    langs: { en: ['English', 'Английский', 'Angļu'], lv: ['Latvian', 'Латышский', 'Latviešu'], es: ['Spanish', 'Испанский', 'Spāņu'], no: ['Norwegian', 'Норвежский', 'Norvēģu'] },
    support: ['With the support of', 'При поддержке', 'Ar atbalstu no'],
    title: ['Polly’s train', 'Поезд Полли', 'Pollijas vilciens'],
    intro: ['Polly is leaving Wobbleland on a trip by train, and Empanadillo is teaching the words. Choose where to go: you will learn the language of that country. At every station there are new words and a little game. The trip never ends.',
      'Полли едет из Воббленда в путешествие на поезде, а Эмпанадильо учит словам. Выбери, куда ехать: язык этой страны и будешь учить. На каждой станции — новые слова и маленькая игра. Поездка не кончается.',
      'Pollija no Vobllendas dodas ceļojumā ar vilcienu, un Empanadiljo māca vārdus. Izvēlies, kurp braukt: tās valsts valodu arī mācīsies. Katrā stacijā — jauni vārdi un maza spēle. Brauciens nebeidzas.'],
    where: ['Where are we going?', 'Куда едем?', 'Kurp brauksim?'],
    to: { es: ['to Spain', 'в Испанию', 'uz Spāniju'], no: ['to Norway', 'в Норвегию', 'uz Norvēģiju'], en: ['to Great Britain', 'в Великобританию', 'uz Lielbritāniju'], lv: ['to Latvia', 'в Латвию', 'uz Latviju'] },
    land: { es: ['Spain', 'Испания', 'Spānija'], no: ['Norway', 'Норвегия', 'Norvēģija'], en: ['Britain', 'Британия', 'Britānija'], lv: ['Latvia', 'Латвия', 'Latvija'] },
    go: ['🚆 All aboard!', '🚆 По вагонам!', '🚆 Iekāpt!'],
    from: ['From station {n}', 'Со станции {n}', 'No {n}. stacijas'],
    ups: ['🛠 Upgrades', '🛠 Улучшения', '🛠 Uzlabojumi'],
    dict: ['📒 My words', '📒 Мой словарик', '📒 Mana vārdnīca'],
    dictEmpty: ['No words yet: play and they will appear here.', 'Пока пусто — сыграй, и слова появятся здесь.', 'Vēl tukšs — uzspēlē, un vārdi parādīsies šeit.'],
    dictN: ['{n} words learned', 'Выучено слов: {n}', 'Iemācīti vārdi: {n}'],
    dictMiss: ['To repeat: {n}', 'Повторить: {n}', 'Jāatkārto: {n}'],
    back: ['← Back', '← Назад', '← Atpakaļ'],
    station: ['Station {n}', 'Станция {n}', '{n}. stacija'],
    score: ['Score', 'Очки', 'Punkti'],
    best: ['Best: {n}', 'Рекорд: {n}', 'Rekords: {n}'],
    newW: ['New words', 'Новые слова', 'Jauni vārdi'],
    newHow: ['Look at them and remember: they will be in the game.', 'Посмотри и запомни — они будут в игре.', 'Apskati un iegaumē — tie būs spēlē.'],
    play: ['Let’s play →', 'Играть →', 'Spēlēt →'],
    G: { pick: ['❓ What is it?', '❓ Что это?', '❓ Kas tas ir?'], pairs: ['🎴 Pairs in the compartment', '🎴 Пары в купе', '🎴 Pāri kupejā'], diner: ['🍽 Dining car', '🍽 Вагон-ресторан', '🍽 Restorānvagons'] },
    how: { pick: ['Choose what the word means.', 'Выбери, что значит слово.', 'Izvēlies, ko nozīmē vārds.'],
      pairs: ['Turn the cards over and find pairs: a word and its picture.', 'Переворачивай карточки и находи пары: слово и его картинку.', 'Apgriez kartītes un atrodi pārus: vārdu un tā attēlu.'],
      diner: ['Passengers order in the local language. Serve the right thing before they get bored!', 'Пассажиры заказывают на местном языке. Подай нужное, пока им не надоело ждать!', 'Pasažieri pasūta vietējā valodā. Pasniedz pareizo, pirms viņiem apnīk gaidīt!'] },
    hint: ['Hint', 'Подсказка', 'Padoms'],
    noHints: ['No hints left at this station', 'Подсказок на этой станции больше нет', 'Šajā stacijā padomu vairs nav'],
    wrong: ['Not quite. Try again!', 'Не совсем. Попробуй ещё!', 'Ne gluži. Mēģini vēlreiz!'],
    shield: ['🛡 Second chance: this mistake doesn’t count', '🛡 Второй шанс — эта ошибка не считается', '🛡 Otrā iespēja — šī kļūda neskaitās'],
    left: ['The passenger got bored and left. It was: {w}', 'Пассажир заскучал и ушёл. Это было: {w}', 'Pasažierim apnika, un viņš aizgāja. Tas bija: {w}'],
    done: ['Station {s}: done!', 'Станция {s}: готово!', '{s}: gatavs!'],
    learned: ['Words of this station', 'Слова этой станции', 'Šīs stacijas vārdi'],
    next: ['Next station →', 'Следующая станция →', 'Nākamā stacija →'],
    stop: ['Get off the train', 'Сойти с поезда', 'Izkāpt no vilciena'],
    stars: ['Stars', 'Звёзды', 'Zvaigznes'],
    got: ['+{n} 🔘 for the station', '+{n} 🔘 за станцию', '+{n} 🔘 par staciju'],
    rec: ['🏆 New record: +{n} 🔘', '🏆 Новый рекорд: +{n} 🔘', '🏆 Jauns rekords: +{n} 🔘'],
    gotItem: ['🎁 A gift for your bird: {n}', '🎁 Подарок птичке: {n}', '🎁 Dāvana putniņam: {n}'],
    badge: ['🏅 New badge: {n}', '🏅 Новый бейдж: {n}', '🏅 Jauna nozīmīte: {n}'],
    guest: ['Sign in to get buttons 🔘, gifts and badges for the stations.', 'Войди, чтобы получать пуговки 🔘, подарки и бейджи за станции.', 'Ienāc, lai saņemtu pogas 🔘, dāvanas un nozīmītes par stacijām.'],
    signin: ['Sign in', 'Войти', 'Ienākt'],
    pay: ['Each station: {p} 🔘 (more every 10 stations), once a day. A gift every {e} stations.', 'Каждая станция — {p} 🔘 (каждые 10 станций больше), раз в сутки. Подарок каждые {e} станций.', 'Katra stacija — {p} 🔘 (ik pēc 10 stacijām vairāk), reizi dienā. Dāvana ik pēc {e} stacijām.'],
    have: ['You have {n} 🔘', 'У тебя {n} 🔘', 'Tev ir {n} 🔘'],
    upsHow: ['Upgrades stay with you forever and work in every language.', 'Улучшения остаются навсегда и работают во всех языках.', 'Uzlabojumi paliek uz visiem laikiem un darbojas visās valodās.'],
    upsGuest: ['Sign in to buy upgrades.', 'Войди, чтобы покупать улучшения.', 'Ienāc, lai pirktu uzlabojumus.'],
    buy: ['Buy · {n} 🔘', 'Купить · {n} 🔘', 'Pirkt · {n} 🔘'], maxed: ['✓ Maximum', '✓ Максимум', '✓ Maksimums'],
    bought: ['Upgrade bought!', 'Улучшение куплено!', 'Uzlabojums nopirkts!'], poor: ['Not enough buttons', 'Не хватает пуговок', 'Nepietiek pogu'],
    noSave: ['The station was not saved: check your connection', 'Станция не сохранилась — проверь интернет', 'Stacija netika saglabāta — pārbaudi internetu'],
  };
  const t = (k, o) => { let v = T[k][L]; if (o) for (const [a, b] of Object.entries(o)) v = v.split('{' + a + '}').join(b); return v; };
  const tr = a => a[L];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const post = (path, body) => fetch('/api/' + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.ok ? r.json() : Promise.reject(r.status));
  const toast = s => window.PPToast ? window.PPToast(s) : null;
  const rnd = n => Math.floor(Math.random() * n);
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // реплики Эмпанадильо
  const SAY = {
    hi: [['Hola! I’m Empanadillo. Let’s learn some words!', 'Hola! Я Эмпанадильо. Давай учить слова!', 'Hola! Es esmu Empanadiljo. Mācīsimies vārdus!'],
      ['Next stop, new words. ¡Vamos!', 'Новая станция — новые слова. ¡Vamos!', 'Jauna stacija — jauni vārdi. ¡Vamos!']],
    good: [['¡Muy bien!', '¡Muy bien! Отлично!', '¡Muy bien! Lieliski!'], ['You’re a word wizard!', 'Да ты волшебник слов!', 'Tu esi vārdu burvis!'], ['Yum, a tasty word!', 'Ммм, вкусное слово!', 'Mmm, garšīgs vārds!'], ['Polly is proud of you!', 'Полли тобой гордится!', 'Pollija ar tevi lepojas!']],
    hint: [['Psst… one less to think about!', 'Псст… одним вариантом меньше!', 'Psst… par vienu variantu mazāk!'], ['Here’s a little crumb of help.', 'Вот крошечка помощи.', 'Lūk, mazliet palīdzības.']],
  };
  const say = (k, extra) => { const a = SAY[k][rnd(SAY[k].length)]; bubble(tr(a) + (extra ? ' ' + extra : '')); };
  // заказ в вагоне-ресторане — на языке страны
  const ORDER = { es: w => `¡${w}, por favor!`, no: w => `${w}, takk!`, en: w => `${w}, please!`, lv: w => `${w}, lūdzu!` };
  const FACES = ['🧔', '👵', '👨‍🦰', '👩', '🧑‍🎨', '👴', '👧', '🧑‍🦱', '👩‍🦳', '🧑‍💼'];

  // ---------- хранилище в браузере ----------
  const store = (() => { let o = {}; try { o = JSON.parse(localStorage.getItem('pp-train') || '{}') || {}; } catch (e) {} return o; })();
  const save = () => { try { localStorage.setItem('pp-train', JSON.stringify(store)); } catch (e) {} };
  const DEST = ['es', 'no', 'en', 'lv'].filter(l => l !== SL), FLAG = { // флаги картинкой: эмодзи-флагов нет на Windows (там буквы ES, NO)
    es: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#C60B1E"/><rect y="5" width="30" height="10" fill="#FFC400"/></svg>',
    no: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#BA0C2F"/><path d="M8 0h6v20H8zM0 7h30v6H0z" fill="#fff"/><path d="M9.5 0h3v20h-3zM0 8.5h30v3H0z" fill="#00205B"/></svg>',
    en: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" stroke-width="1.5"/><path d="M12 0h6v20h-6zM0 7h30v6H0z" fill="#fff"/><path d="M13.5 0h3v20h-3zM0 8.5h30v3H0z" fill="#C8102E"/></svg>',
    lv: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#9E3039"/><rect y="8" width="30" height="4" fill="#fff"/></svg>' };
  if (!DEST.includes(store.lang)) store.lang = 'es';
  store.best = store.best || {}; store.lv = store.lv || {}; store.dict = store.dict || {}; store.miss = store.miss || {};

  // ---------- слова: сначала слова ручных станций, потом словарь; у каждого — значок и перевод на язык сайта ----------
  const COL = { en: 1, lv: 3, es: 4, no: 5 };
  const VOC = {};
  function vocab(l) {
    if (VOC[l]) return VOC[l];
    const map = new Map(), emo = new Set(), add = (w, e, g) => { const k = w.toLowerCase(); if (!w || map.has(k) || emo.has(e)) return; emo.add(e); map.set(k, { k, w, e, g }); };
    WD[l].forEach(st => st.w.forEach(x => add(x[0], x[1], x.slice(2))));
    WD.dict.trim().split('\n').forEach(line => { const p = line.split('|'); add(p[COL[l]], p[0], [p[1], p[2], p[3]]); });
    return (VOC[l] = { map, list: [...map.values()] });
  }
  const info = k => vocab(lang).map.get(k);
  const show = k => { const x = info(k); return x ? x.w : k; };
  const gloss = k => { const x = info(k); return x ? x.g[L] : ''; };
  const emo = k => { const x = info(k); return x ? x.e : '•'; };
  const NEW = 4;
  // что можно заказать в вагоне-ресторане: еда, напитки и вещи (по значку)
  const MENU = new Set('🥚 🥛 🍵 🍞 🍰 🍎 🍐 🍋 🍇 🍚 🍲 🧂 🧀 🧃 🍄 🍅 🥔 🥕 🧈 🍯 🍪 🥗 🍝 🍫 🍉 🥜 🍒 🌽 🧅 🍊 🫒 🐟 ☕ 🥄 🍴 🍽 🍳 🧊 💧 🗺 🎫 📖 🖊 ✏️ 🔑 🧳 💡 🕯 🎈 🧸 ⚽ 📷 👜 🎩 🧦 🧥 👞 🌹 🌸 🎁 ✉️ 🪑 🛏 🧺 🪞 ⌚ 🎂 🍣 🥟'.split(' '));
  const isMenu = k => MENU.has(emo(k));
  // новые слова станции n — по порядку словаря, по кругу: ресторан (каждая 3-я) берёт из «меню», остальные станции — из прочих слов
  const freshOf = n => { const din = n % 3 === 0, a = vocab(lang).list.filter(x => MENU.has(x.e) === din), j = din ? n / 3 - 1 : n - 1 - Math.floor((n - 1) / 3);
    return Array.from({ length: NEW }, (_, i) => a[(j * NEW + i) % a.length].k); };
  // повторение: слова с ошибками, потом случайные выученные
  function reviewOf(skip, n) {
    const miss = (store.miss[lang] || []).filter(k => info(k) && !skip.includes(k)).slice(0, 2);
    const learned = shuffle((store.dict[lang] || []).filter(k => info(k) && !skip.includes(k) && !miss.includes(k)));
    return [...miss, ...learned].slice(0, n);
  }
  // варианты ответа: правильный + другие слова языка (другие значки)
  const optsFor = (k, n, menu) => shuffle([k, ...shuffle(vocab(lang).list.filter(x => x.k !== k && (!menu || MENU.has(x.e))).map(x => x.k)).slice(0, n - 1)]); // в ресторане на подносе — только еда и вещи

  // ---------- станции маршрута ----------
  // маршрут всегда из Воббленда (New Wobbleton и два города острова), сразу в страну, дальше — по кругу её городов; чужих городов по пути нет
  const ROUTES = {
    es: [['New Wobbleton', 'Maplewink', 'Kettleford', 'Barcelona', 'Madrid'],
      ['Toledo', 'Córdoba', 'Sevilla', 'Cádiz', 'Málaga', 'Granada', 'Almería', 'Murcia', 'Alicante', 'Valencia', 'Tarragona', 'Girona', 'Zaragoza', 'Pamplona', 'San Sebastián', 'Bilbao', 'Santander', 'Oviedo', 'Santiago', 'León', 'Burgos', 'Salamanca', 'Segovia', 'Ávila', 'Cuenca', 'Ronda', 'Mérida', 'Madrid']],
    no: [['New Wobbleton', 'Pinecrust', 'Snailhollow', 'Halden', 'Oslo'],
      ['Drammen', 'Kongsberg', 'Geilo', 'Finse', 'Myrdal', 'Flåm', 'Voss', 'Bergen', 'Stavanger', 'Kristiansand', 'Arendal', 'Lillehammer', 'Dombås', 'Åndalsnes', 'Røros', 'Trondheim', 'Steinkjer', 'Mo i Rana', 'Bodø', 'Narvik', 'Tromsø', 'Hamar', 'Oslo']],
    en: [['New Wobbleton', 'Jamshire', 'Cheddarford', 'Dover', 'London'],
      ['Oxford', 'Bath', 'Bristol', 'Cardiff', 'Birmingham', 'Liverpool', 'Manchester', 'York', 'Durham', 'Newcastle', 'Edinburgh', 'Glasgow', 'Fort William', 'Inverness', 'Aberdeen', 'Dundee', 'Carlisle', 'Lancaster', 'Chester', 'Cambridge', 'Norwich', 'Canterbury', 'Brighton', 'London']],
    lv: [['New Wobbleton', 'LemonVale', 'Noodleford', 'Valmiera', 'Rīga'],
      ['Jūrmala', 'Tukums', 'Kuldīga', 'Ventspils', 'Talsi', 'Liepāja', 'Saldus', 'Jelgava', 'Bauska', 'Ogre', 'Aizkraukle', 'Jēkabpils', 'Daugavpils', 'Krāslava', 'Rēzekne', 'Ludza', 'Gulbene', 'Alūksne', 'Madona', 'Limbaži', 'Salacgrīva', 'Saulkrasti', 'Rīga']],
  };
  const city = n => { const [a, b] = ROUTES[lang] || ROUTES.es; return n < a.length ? a[n] : b[(n - a.length) % b.length]; };

  // ---------- сервер ----------
  let srv = { on: true, per: 1, record: 0, every: 10, start: 10, up: {}, ups: null, lv: null, today: 0, best: 0, buttons: 0, me: null };
  const load = () => fetch('/api/train', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(d => { if (d) srv = d; if (state === 'menu') menu(); }).catch(() => {});
  // улучшения (ключи на сервере прежние: hint, word, jar)
  const UPS = {
    hint: { n: ['🥟 More empanadas', '🥟 Больше эмпанад', '🥟 Vairāk empanādu'], d: ['+1 hint at every station: removes wrong answers or shows a pair', '+1 подсказка на каждой станции: убирает лишние варианты или показывает пару', '+1 padoms katrā stacijā: noņem liekos variantus vai parāda pāri'] },
    word: { n: ['🛡 Second chance', '🛡 Второй шанс', '🛡 Otrā iespēja'], d: ['+1 mistake per station doesn’t count', '+1 ошибка на станции не считается', '+1 kļūda stacijā neskaitās'] },
    jar: { n: ['⏳ Patient passengers', '⏳ Терпеливые пассажиры', '⏳ Pacietīgi pasažieri'], d: ['Passengers in the dining car wait 25 % longer', 'В вагоне-ресторане ждут на 25 % дольше', 'Restorānvagonā gaida par 25 % ilgāk'] },
  };
  const up = k => (srv.ups && srv.ups[k]) || 0;
  const BADGE = { tr1: ['Ticket punched', 'Билет прокомпостирован', 'Biļete komposterēta'], tr2: ['Seasoned traveller', 'Бывалый путешественник', 'Pieredzējis ceļotājs'],
    tr3: ['Endless rails', 'Бесконечные рельсы', 'Bezgalīgās sliedes'], trpoly: ['Polyglot pigeon', 'Голубь-полиглот', 'Poliglots balodis'], trwords: ['Word collector', 'Собиратель слов', 'Vārdu krājējs'] };

  // ---------- разметка ----------
  app.innerHTML = `<div class="tr-stage"><canvas class="tr-scene" width="360" height="150" aria-hidden="true"></canvas>
    <div class="tr-hud"><span class="tr-st"></span><span class="tr-sc"></span></div>
    <div class="tr-say" role="status" aria-live="polite"><img src="/images/train/emp.png" alt="" width="48" height="24"><p></p></div>
    <div class="tr-play"><p class="tr-need"></p><div class="tr-task"></div>
      <div class="tr-btns"><button type="button" data-a="hint" class="tr-hint">🥟 ${t('hint')} · <b></b></button></div></div>
    <div class="tr-ov" hidden></div></div>
    <section class="rain-top" data-top="train"></section>`;
  const $ = s => app.querySelector(s);
  const cv = $('.tr-scene'), ctx = cv.getContext('2d'), ov = $('.tr-ov'), box = $('.tr-task');
  const setOv = on => { ov.hidden = !on; $('.tr-stage').classList.toggle('ov', on); };
  const bubble = s => { $('.tr-say p').textContent = s; };
  const wordLine = k => `${emo(k)} <b>${esc(show(k))}</b> — ${esc(gloss(k))}`;

  // ---------- состояние игры ----------
  let state = 'menu', lang = store.lang, lvl = 1, task = null, score = 0, timer = null;
  let run = null, queue = Promise.resolve();
  const TYPES = ['pick', 'pairs', 'diner'];

  // станция: знакомство с новыми словами, потом игра
  function startStation() {
    clearInterval(timer);
    const type = TYPES[(lvl - 1) % 3], fresh = freshOf(lvl), k = lvl - 1;
    const size = type === 'pairs' ? Math.min(6, 4 + Math.floor(k / 12)) : Math.min(8, 6 + Math.floor(k / 12));
    let items = [...fresh, ...reviewOf(fresh, size - fresh.length).filter(x => type !== 'diner' || isMenu(x))];
    if (type === 'diner' && items.length < size) items.push(...shuffle(vocab(lang).list.filter(x => MENU.has(x.e) && !items.includes(x.k)).map(x => x.k)).slice(0, size - items.length)); // в ресторан — только из меню
    items = items.slice(0, size);
    task = { type, fresh, items: type === 'pairs' ? items : shuffle(items), i: 0, miss: 0, ok: 0, shield: up('word'), hints: 1 + up('hint'), missed: [] };
    state = 'intro'; travel = 0;
    $('.tr-st').textContent = `${t('station', { n: lvl })} · ${city(lvl)} · ${tr(T.langs[lang])}`;
    $('.tr-sc').textContent = `${t('score')}: ${score}`;
    ov.innerHTML = `<div class="tr-card"><h2>${tr(T.G[type])}</h2><p>${tr(T.how[type])}</p><h3>${t('newW')}</h3>
      <ul class="tr-new">${fresh.map(k => `<li><span class="e">${emo(k)}</span><b>${esc(show(k))}</b><small>${esc(gloss(k))}</small></li>`).join('')}</ul>
      <p class="tr-best">${t('newHow')}</p><p><button type="button" class="pill-btn pill-fill tr-play-go">${t('play')}</button></p></div>`;
    setOv(true); say('hi');
    ov.querySelector('.tr-play-go').onclick = () => { setOv(false); state = 'play'; ({ pick: pickNext, pairs: pairsStart, diner: dinerNext })[type](); };
  }
  const progress = () => { $('.tr-need').textContent = `${tr(T.G[task.type])} · ${Math.min(task.i, task.items.length)}/${task.items.length}`; $('.tr-hint b').textContent = task.hints; $('.tr-hint').disabled = !task.hints; $('.tr-sc').textContent = `${t('score')}: ${score}`; };
  // ошибка: «второй шанс» прощает, иначе слово — в повторение
  function mistake(k) {
    if (task.shield > 0) { task.shield--; bubble(t('shield')); return; }
    task.miss++; if (!task.missed.includes(k)) task.missed.push(k);
    const m = store.miss[lang] = store.miss[lang] || []; if (!m.includes(k)) m.push(k); save();
  }
  function right(k, first) {
    task.ok++; score += first ? 10 : 4;
    const d = store.dict[lang] = store.dict[lang] || []; if (!d.includes(k)) d.push(k);
    if (first && !task.missed.includes(k)) store.miss[lang] = (store.miss[lang] || []).filter(x => x !== k);
    save(); say('good', `${emo(k)} ${show(k)} — ${gloss(k)}`);
  }
  const nOpts = () => lvl < 7 ? 3 : lvl < 25 ? 4 : 5;

  // «Что это?»: слово на языке страны → выбрать картинку с переводом
  function pickNext() {
    if (task.i >= task.items.length) return stationDone();
    const k = task.items[task.i]; task.opts = optsFor(k, nOpts()); task.first = true; progress();
    box.innerHTML = `<p class="tr-q"><b>${esc(show(k))}</b></p><div class="tr-opts">${task.opts.map((o, i) => `<button type="button" class="tr-opt" data-k="${esc(o)}"><span class="e">${emo(o)}</span><small>${esc(gloss(o))}</small><i>${i + 1}</i></button>`).join('')}</div>`;
  }
  function pickAnswer(b) {
    const k = task.items[task.i];
    if (b.dataset.k === k) { b.classList.add('ok'); right(k, task.first); task.i++; box.querySelectorAll('.tr-opt').forEach(x => x.disabled = true); setTimeout(pickNext, 750); }
    else { b.classList.add('no'); b.disabled = true; if (task.first) mistake(k); task.first = false; bubble(t('wrong')); }
  }

  // «Пары в купе»: мемори — карточки слов и картинок рубашкой вверх
  function pairsStart() {
    task.cards = shuffle(task.items.flatMap(k => [{ k, w: 1 }, { k, w: 0 }])); task.open = []; task.done = []; task.moves = 0; task.i = 0; progress();
    box.innerHTML = `<div class="tr-grid c${task.cards.length > 8 ? 4 : 4}">${task.cards.map((c, i) => `<button type="button" class="tr-mem" data-i="${i}"><span class="back">🎫</span><span class="face">${c.w ? `<b>${esc(show(c.k))}</b>` : `<span class="e">${emo(c.k)}</span><small>${esc(gloss(c.k))}</small>`}</span></button>`).join('')}</div>`;
  }
  function pairsFlip(b) {
    const i = +b.dataset.i; if (task.lock || task.open.includes(i) || task.done.includes(i)) return;
    b.classList.add('up'); task.open.push(i); if (task.open.length < 2) return;
    task.moves++; const [a, c] = task.open, A = task.cards[a], C = task.cards[c];
    if (A.k === C.k && A.w !== C.w) {
      task.done.push(a, c); task.open = []; task.i++; [a, c].forEach(j => box.querySelector(`[data-i="${j}"]`).classList.add('ok'));
      right(A.k, true); progress(); if (task.done.length === task.cards.length) setTimeout(stationDone, 700);
    } else {
      task.lock = true; if (task.moves > task.items.length + 3) task.miss = task.moves - task.items.length - 3;
      setTimeout(() => { [a, c].forEach(j => box.querySelector(`[data-i="${j}"]`).classList.remove('up')); task.open = []; task.lock = false; }, 900);
    }
  }

  // «Вагон-ресторан»: пассажир заказывает — подать нужное, пока шкала терпения не кончилась
  function dinerNext() {
    clearInterval(timer);
    if (task.i >= task.items.length) return stationDone();
    const k = task.items[task.i], w = show(k); task.opts = optsFor(k, Math.min(6, nOpts() + 1), true); task.first = true; progress();
    const full = Math.max(7, 15 - lvl * 0.08) * (1 + 0.25 * up('jar')) * 1000, t0 = Date.now();
    box.innerHTML = `<div class="tr-guest"><span class="face">${FACES[rnd(FACES.length)]}</span><p>${esc(ORDER[lang](w.charAt(0).toUpperCase() + w.slice(1)))}</p></div><div class="tr-pat"><i></i></div>
      <div class="tr-opts tray">${task.opts.map((o, i) => `<button type="button" class="tr-opt" data-k="${esc(o)}"><span class="e">${emo(o)}</span><small>${esc(gloss(o))}</small><i>${i + 1}</i></button>`).join('')}</div>`;
    const bar = box.querySelector('.tr-pat i');
    timer = setInterval(() => { const left = 1 - (Date.now() - t0) / full; bar.style.width = Math.max(0, left * 100) + '%'; bar.classList.toggle('low', left < .3);
      if (left <= 0) { clearInterval(timer); mistake(k); bubble(t('left', { w: `${emo(k)} ${w} — ${gloss(k)}` })); task.i++; setTimeout(dinerNext, 1600); } }, 100);
  }
  function dinerAnswer(b) {
    const k = task.items[task.i];
    if (b.dataset.k === k) { clearInterval(timer); b.classList.add('ok'); right(k, task.first); if (task.first) score += 3; task.i++; box.querySelectorAll('.tr-opt').forEach(x => x.disabled = true); setTimeout(dinerNext, 750); }
    else { b.classList.add('no'); b.disabled = true; if (task.first) mistake(k); task.first = false; bubble(t('wrong')); }
  }

  // подсказка: в «Что это?» и ресторане убирает половину лишних вариантов, в «Парах» на миг показывает одну пару
  function hint() {
    if (!task || !task.hints) return bubble(t('noHints'));
    if (task.type === 'pairs') {
      if (task.lock || task.open.length) return;
      const k = task.cards.find((c, i) => !task.done.includes(i)); if (!k) return;
      const idx = task.cards.map((c, i) => c.k === k.k ? i : -1).filter(i => i >= 0);
      idx.forEach(i => box.querySelector(`[data-i="${i}"]`).classList.add('up', 'peek')); task.lock = true;
      setTimeout(() => { idx.forEach(i => box.querySelector(`[data-i="${i}"]`).classList.remove('up', 'peek')); task.lock = false; }, 1300);
    } else {
      const k = task.items[task.i], wrong = [...box.querySelectorAll('.tr-opt:not([disabled])')].filter(b => b.dataset.k !== k);
      if (!wrong.length) return;
      shuffle(wrong).slice(0, Math.max(1, Math.ceil(wrong.length / 2))).forEach(b => { b.disabled = true; b.classList.add('gone'); });
    }
    task.hints--; say('hint'); progress();
  }

  function stationDone() {
    if (state !== 'play') return; state = 'done'; clearInterval(timer);
    const stars = task.miss === 0 ? 3 : task.miss <= 2 ? 2 : 1, n = lvl;
    if (score > (store.best[lang] || 0)) store.best[lang] = score;
    if (n > (store.lv[lang] || 0)) store.lv[lang] = n; save();
    const card = document.createElement('div'); card.className = 'tr-card';
    card.innerHTML = `<h2>${esc(t('done', { s: city(n) }))}</h2><p class="tr-stars" title="${t('stars')}">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</p>
      <h3>${t('learned')}</h3><ul class="tr-learn">${task.items.map(k => `<li>${wordLine(k)}${task.missed.includes(k) ? ' 🔁' : ''}</li>`).join('')}</ul>
      <p class="tr-pay"></p><p><button type="button" class="pill-btn pill-fill tr-next">${t('next')}</button> <button type="button" class="pill-btn tr-stop">${t('stop')}</button></p>`;
    ov.innerHTML = ''; ov.appendChild(card); setOv(true);
    card.querySelector('.tr-next').onclick = () => { lvl++; setOv(false); box.innerHTML = ''; travel = 1; state = 'travel'; travelT = 0; };
    card.querySelector('.tr-stop').onclick = () => { run = null; state = 'menu'; menu(); };
    const pay = card.querySelector('.tr-pay');
    if (srv.me && run) queue = queue.then(() => saveStation(n, task.ok, 0)).then(r => {
      if (!r) return; srv.lv = r.lv; srv.best = r.best;
      const a = []; if (r.got > 0) { a.push(t('got', { n: r.got })); srv.buttons += r.got; } if (r.rec > 0) { a.push(t('rec', { n: r.rec })); srv.buttons += r.rec; }
      if (r.item) { const B = window.PPBirds, nm = B && B.giftName ? B.giftName(r.item.kind, r.item.item, L) : r.item.item; a.push(t('gotItem', { n: nm })); }
      pay.textContent = a.join(' · ');
      if (window.PPAccount && window.PPAccount.setButtons && (r.got || r.rec)) window.PPAccount.setButtons(srv.buttons);
      (r.badges || []).forEach((k, i) => setTimeout(() => BADGE[k] && toast(t('badge', { n: tr(BADGE[k]) })), 400 + i * 1600));
    }).catch(() => {});
    else if (!srv.me) { pay.innerHTML = `${t('guest')} <button type="button" class="pill-btn tr-in">${t('signin')}</button>`; pay.querySelector('.tr-in').onclick = signIn; }
  }
  const saveStation = (n, w, k) => post('train/station', { run, level: n, words: w }).catch(e => e === 429 && k < 5 ? new Promise(r => setTimeout(r, 3000)).then(() => saveStation(n, w, k + 1)) : (e !== 409 && toast(t('noSave')), null));
  const signIn = () => window.PPAccount && window.PPAccount.openSignIn && window.PPAccount.openSignIn();

  // ---------- меню ----------
  function menu() {
    state = 'menu'; clearInterval(timer); setOv(true);
    const best = Math.max(store.lv[lang] || 0, (srv.lv && srv.lv[lang]) || 0), every = srv.start || 10;
    const froms = []; for (let f = every; f <= best && every; f += every) froms.push(f);
    ov.innerHTML = `<div class="tr-card tr-menu">
      <a class="tr-sup" href="https://libertas.study/" target="_blank" rel="noopener"><span>${t('support')}</span><img src="/images/train/libertas.png" alt="Libertas.study" width="129" height="52"></a>
      <h2>${t('title')} ${tr(T.to[lang])}</h2><img class="tr-emp" src="/images/train/emp.png" alt="" width="96" height="48"><p>${t('intro')}</p>
      <p class="tr-lh">${t('where')}</p><div class="tr-langs">${DEST.map(l => `<button type="button" class="tr-lang${l === lang ? ' on' : ''}" data-l="${l}"><i class="fl">${FLAG[l]}</i><b>${tr(T.land[l])}</b><small>${tr(T.langs[l])}</small></button>`).join('')}</div>
      <p class="tr-best">${best ? t('station', { n: best }) + ' · ' + city(best) + ' · ' : ''}${t('best', { n: store.best[lang] || 0 })}</p>
      <p><button type="button" class="pill-btn pill-fill tr-go" data-f="0">${t('go')}</button>${froms.slice(-3).map(f => ` <button type="button" class="pill-btn tr-go" data-f="${f}">${t('from', { n: f + 1 })}</button>`).join('')}</p>
      <p><button type="button" class="pill-btn tr-upsb">${t('ups')}</button> <button type="button" class="pill-btn tr-dictb">${t('dict')}</button></p>
      ${srv.me ? `<p class="tr-pay">${t('pay', { p: srv.per, e: srv.every })}</p>` : `<p class="tr-pay">${t('guest')} <button type="button" class="pill-btn tr-in">${t('signin')}</button></p>`}</div>`;
    ov.querySelectorAll('.tr-lang').forEach(b => b.onclick = () => { lang = store.lang = b.dataset.l; save(); menu(); });
    ov.querySelectorAll('.tr-go').forEach(b => b.onclick = () => start(+b.dataset.f));
    ov.querySelector('.tr-upsb').onclick = ups; ov.querySelector('.tr-dictb').onclick = dict;
    const si = ov.querySelector('.tr-in'); if (si) si.onclick = signIn;
    topList();
  }
  function start(from) {
    lvl = from + 1; score = 0; run = null;
    if (srv.me) queue = post('train/start', { lang, from }).then(r => { run = r.run; if (r.from !== from) { lvl = r.from + 1; startStation(); } }).catch(() => { run = null; });
    startStation();
  }
  function ups() {
    ov.innerHTML = `<div class="tr-card"><h2>${t('ups')}</h2><p>${t('upsHow')}</p>${srv.me ? `<p class="tr-best">${t('have', { n: srv.buttons || 0 })}</p>` : `<p class="tr-pay">${t('upsGuest')} <button type="button" class="pill-btn tr-in">${t('signin')}</button></p>`}
      <ul class="tr-ups">${Object.entries(UPS).map(([k, u]) => { const s = srv.up[k] || { max: 0, cost: 0 }, have = up(k);
        return `<li><b>${tr(u.n)}</b> <span>${'●'.repeat(have)}${'○'.repeat(Math.max(0, s.max - have))}</span><br><small>${tr(u.d)}</small><br>${have >= s.max ? `<em>${t('maxed')}</em>` : `<button type="button" class="pill-btn tr-buy" data-k="${k}"${srv.me ? '' : ' disabled'}>${t('buy', { n: s.cost * (have + 1) })}</button>`}</li>`; }).join('')}</ul>
      <p><button type="button" class="pill-btn tr-back">${t('back')}</button></p></div>`;
    ov.querySelector('.tr-back').onclick = menu; const si = ov.querySelector('.tr-in'); if (si) si.onclick = signIn;
    ov.querySelectorAll('.tr-buy').forEach(b => b.onclick = () => { b.disabled = true; post('train/up', { k: b.dataset.k }).then(r => {
      srv.ups = r.ups; srv.buttons = r.buttons; window.PPAccount && window.PPAccount.setButtons && window.PPAccount.setButtons(r.buttons); toast(t('bought')); ups();
    }).catch(() => { toast(t('poor')); b.disabled = false; }); });
  }
  function dict() {
    const d = (store.dict[lang] || []).filter(k => info(k)).sort((a, b) => show(a).localeCompare(show(b))), miss = (store.miss[lang] || []).filter(k => info(k));
    ov.innerHTML = `<div class="tr-card"><h2>${t('dict')} · ${tr(T.langs[lang])}</h2><p>${d.length ? t('dictN', { n: d.length }) + (miss.length ? ' · ' + t('dictMiss', { n: miss.length }) : '') : t('dictEmpty')}</p>
      <ul class="tr-learn tr-dict">${d.map(k => `<li>${wordLine(k)}${miss.includes(k) ? ' 🔁' : ''}</li>`).join('')}</ul>
      <p><button type="button" class="pill-btn tr-back">${t('back')}</button></p></div>`;
    ov.querySelector('.tr-back').onclick = menu;
  }
  function topList() { const el = app.querySelector('.rain-top'); if (!window.PPTop || !el) return; const fresh = !el.__top; window.PPTop.mount(el); if (!fresh) window.PPTop.refresh(el); }

  // ---------- управление ----------
  app.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || state !== 'play' || b.disabled) return;
    if (b.dataset.a === 'hint') return hint();
    if (b.classList.contains('tr-mem')) return pairsFlip(b);
    if (b.classList.contains('tr-opt')) return task.type === 'diner' ? dinerAnswer(b) : pickAnswer(b);
  });
  // цифры 1–6 — выбрать вариант
  document.addEventListener('keydown', e => {
    if (state !== 'play' || !task || task.type === 'pairs' || e.ctrlKey || e.metaKey || e.altKey || /input|textarea/i.test((e.target || {}).tagName || '')) return;
    const n = +e.key; if (!(n >= 1 && n <= 6)) return;
    const b = box.querySelectorAll('.tr-opt')[n - 1]; if (b && !b.disabled) { e.preventDefault(); task.type === 'diner' ? dinerAnswer(b) : pickAnswer(b); }
  });

  // ---------- картинка: вагон с Полли и Эмпанадильо, пейзаж едет ----------
  const EMP = Object.assign(new Image(), { src: '/images/train/emp.png' });
  // Полли — как на загрузке (src/polly-loader.html), с беретом
  const PB = ['......rrr.....', '.....rrrrr....', '......ddd.....', '.....dbbbd....', '....dbbwwbd...', '....dbbwkbdoo.', '....dbbbbbdo..', '...dbbbbbbd...', '..dbbsbbbbd...', '.dbbssbbbbd...', 'dbbssbbbbbd...', 'dbbbbbbbbd....'];
  const PC = { d: '#1e1a26', b: '#4c4369', s: '#3b3352', w: '#fbf5ec', k: '#1e1a26', o: '#e8782e', r: '#c2305c' };
  // пейзаж страны: Испания — оливы и рыжие холмы, Норвегия — горы со снегом и ели, Британия — зелёные холмы, Латвия — сосны
  const LAND = { es: { hill: '#D9B27C', ground: '#C9B26A', tree: '#7E9A4E', leaf: '#97B260', peak: 70, olive: 1 },
    no: { hill: '#8DA3B8', ground: '#6FA27A', tree: '#2F6B4A', peak: 52, snow: 1, pine: 1 },
    en: { hill: '#9CC7A4', ground: '#7FB58A', tree: '#4C9A5B', leaf: '#5DB06C', peak: 72 },
    lv: { hill: '#A9C9A0', ground: '#86B77E', tree: '#3E7D50', peak: 76, pine: 1 } };
  const SKY = [['#BFE3F5', '#EAF6FB'], ['#9FD3EF', '#DDF0F9'], ['#F6C8A0', '#FBE6CF'], ['#C7B5E8', '#F3D9E4']];
  let travel = 0, travelT = 0, scroll = 0, last = 0;
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  function scene(dt) {
    const W = 360, H = 150, sk = SKY[(lvl - 1) % SKY.length];
    if (state === 'travel') { travelT += dt; scroll += dt * 140 * Math.min(1, travelT, Math.max(0, 2.6 - travelT)); if (travelT > 2.6) { startStation(); } }
    const g = ctx.createLinearGradient(0, 0, 0, 100); g.addColorStop(0, sk[0]); g.addColorStop(1, sk[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    R(300, 18, 14, 14, '#F6D04D'); R(298, 22, 18, 6, '#F6D04D');
    // дальние холмы и ближние деревья (параллакс)
    const LS = LAND[lang] || LAND.es;
    for (let i = -1; i < 8; i++) { const x = i * 60 - (scroll * .25) % 60, top = LS.peak + (i % 3) * 6; ctx.fillStyle = LS.hill; ctx.beginPath(); ctx.moveTo(x, 96); ctx.lineTo(x + 30, top); ctx.lineTo(x + 60, 96); ctx.fill();
      if (LS.snow) { ctx.fillStyle = '#F7F9FB'; ctx.beginPath(); ctx.moveTo(x + 22, top + 8); ctx.lineTo(x + 30, top); ctx.lineTo(x + 38, top + 8); ctx.fill(); } }
    R(0, 92, W, 58, LS.ground);
    for (let i = -1; i < 10; i++) { const x = i * 44 - (scroll * .7) % 44; R(x + 10, 80, 4, 14, '#6B4A2E');
      if (LS.pine) { R(x + 8, 62, 8, 6, LS.tree); R(x + 5, 68, 14, 7, LS.tree); R(x + 3, 75, 18, 6, LS.tree); } else if (LS.olive) { R(x + 2, 72, 20, 9, LS.tree); R(x + 6, 68, 12, 5, LS.leaf); } else { R(x + 4, 70, 16, 12, LS.tree); R(x + 7, 66, 10, 6, LS.leaf); } }
    // перрон с вывеской станции, когда стоим
    if (state !== 'travel' || travelT < .9 || travelT > 1.8) {
      const off = state === 'travel' ? (travelT < .9 ? -travelT * 300 : (2.6 - travelT) * 300) : 0, name = city(state === 'menu' || (state === 'travel' && travelT < .9) ? lvl - 1 : lvl); // в меню — вокзал отправления (New Wobbleton)
      R(20 + off, 120, 320, 6, '#C9C2B6'); R(250 + off, 70, 3, 50, '#4C4369'); ctx.font = 'bold 9px Karla, sans-serif'; const sw = Math.max(60, Math.ceil(ctx.measureText(name).width) + 12); R(252 - sw / 2 + off, 62, sw, 14, '#22405F'); // вывеска по длине названия
      ctx.fillStyle = '#F7F1E9'; ctx.textAlign = 'center'; ctx.fillText(name, 252 + off, 72);
    }
    // рельсы и шпалы
    R(0, 138, W, 3, '#5B5670'); for (let i = 0; i < 20; i++) R(i * 20 - (scroll % 20), 141, 10, 3, '#8C5A3C');
    // вагон
    const bob = state === 'travel' && Math.floor(travelT * 8) % 2 ? 1 : 0, cx = 40, cy = 86 + bob;
    R(cx, cy, 200, 46, '#7C1B1B'); R(cx, cy + 4, 200, 3, '#E9C14A'); R(cx, cy + 40, 200, 3, '#5A1414'); R(cx - 4, cy - 4, 208, 5, '#2A2433');
    R(cx + 12, cy + 10, 120, 26, '#2A2433'); R(cx + 14, cy + 12, 116, 22, '#DCEFF8');
    R(cx + 150, cy + 10, 30, 30, '#2A2433'); R(cx + 152, cy + 12, 26, 26, '#DCEFF8');
    // Полли в окне
    const px = cx + 30, py = cy + 8 + (state === 'done' ? -Math.round(Math.abs(Math.sin(performance.now() / 180)) * 3) : 0);
    PB.forEach((row, y) => [...row].forEach((ch, x) => { if (PC[ch]) R(px + x * 2, py + y * 2, 2, 2, PC[ch]); }));
    if (EMP.complete && EMP.naturalWidth) { ctx.imageSmoothingEnabled = false; ctx.drawImage(EMP, cx + 70, cy + 12 + (state === 'done' ? -Math.abs(Math.sin(performance.now() / 150)) * 3 : 0), 48, 24); }
    R(cx + 14, cy + 30, 116, 4, '#7C1B1B');
    [cx + 20, cx + 60, cx + 140, cx + 180].forEach(x => { R(x, 130 + bob, 14, 8, '#2A2433'); R(x + 4, 132 + bob, 6, 4, '#9A96A8'); });
    // паровоз (кусок справа)
    R(cx + 206, cy + 8, 110, 38, '#22405F'); R(cx + 216, cy - 8, 12, 16, '#2A2433'); R(cx + 290, cy + 4, 24, 18, '#2A2433'); R(cx + 293, cy + 7, 18, 12, '#DCEFF8');
    if (state === 'travel') for (let i = 0; i < 3; i++) { const k = (travelT * 3 + i) % 3; R(cx + 214 - k * 20, cy - 16 - k * 8, 8 + k * 4, 6 + k * 3, 'rgba(240,238,245,' + (0.9 - k * .25) + ')'); }
  }
  function loop(ts) { const dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts; scene(dt); requestAnimationFrame(loop); }
  const fit = () => { const w = cv.clientWidth || 360, dpr = window.devicePixelRatio || 1; cv.width = Math.round(w * dpr); cv.height = Math.round(w * 150 / 360 * dpr); ctx.setTransform(cv.width / 360, 0, 0, cv.height / 150, 0, 0); ctx.imageSmoothingEnabled = false; };
  addEventListener('resize', fit); fit(); requestAnimationFrame(loop);
  document.addEventListener('pp:whoami', load);
  bubble(tr(SAY.hi[0])); menu(); load();
})();
