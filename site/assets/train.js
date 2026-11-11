// «Поезд Полли» (/train/, src/pages/train.html, docs/games.md): Полли едет на поезде из Риги в Испанию и дальше по Испании без конца,
// Эмпанадильо (маскот Libertas.study) помогает узнавать слова: из плиток с буквами собрать слова станции (очки за буквы — как в настольных играх).
// Языки игры: en, lv, es, no (слова — site/assets/train-words.js). Станции 1–8 — ручные, дальше `gen` собирает их из словаря (бесконечно).
// Пуговки, рекорды, вещи, бейджи и улучшения — сервер (worker/train.js): /api/train, /api/train/{start,station,up}.
// В браузере: язык игры, лучший счёт, словарик выученных слов (localStorage pp-train).
(() => {
  const app = document.getElementById('train'); if (!app) return;
  const L = { ru: 1, lv: 2 }[document.documentElement.lang] || 0, SL = ['en', 'ru', 'lv'][L];
  const WD = window.PPTrainWords;
  const T = {
    langs: { en: ['English', 'Английский', 'Angļu'], lv: ['Latvian', 'Латышский', 'Latviešu'], es: ['Spanish', 'Испанский', 'Spāņu'], no: ['Norwegian', 'Норвежский', 'Norvēģu'] },
    support: ['With the support of', 'При поддержке', 'Ar atbalstu no'],
    title: ['Polly’s train', 'Поезд Полли', 'Pollijas vilciens'],
    intro: ['Polly is leaving Wobbleland on a trip by train, and Empanadillo is helping with the words. Choose where to go: you will learn the language of that country. At every station, make words out of the letters. The trip never ends.',
      'Полли едет из Воббленда в путешествие на поезде, а Эмпанадильо помогает со словами. Выбери, куда ехать: язык этой страны и будешь учить. На каждой станции собери слова из букв. Поездка не кончается.',
      'Pollija no Vobllendas dodas ceļojumā ar vilcienu, un Empanadiljo palīdz ar vārdiem. Izvēlies, kurp braukt: tās valsts valodu arī mācīsies. Katrā stacijā saliec vārdus no burtiem. Brauciens nebeidzas.'],
    where: ['Where are we going?', 'Куда едем?', 'Kurp brauksim?'],
    to: { es: ['to Spain', 'в Испанию', 'uz Spāniju'], no: ['to Norway', 'в Норвегию', 'uz Norvēģiju'], en: ['to Great Britain', 'в Великобританию', 'uz Lielbritāniju'], lv: ['to Latvia', 'в Латвию', 'uz Latviju'] },
    land: { es: ['Spain', 'Испания', 'Spānija'], no: ['Norway', 'Норвегия', 'Norvēģija'], en: ['Great Britain', 'Великобритания', 'Lielbritānija'], lv: ['Latvia', 'Латвия', 'Latvija'] },
    go: ['🚆 All aboard!', '🚆 По вагонам!', '🚆 Iekāpt!'],
    from: ['From station {n}', 'Со станции {n}', 'No {n}. stacijas'],
    ups: ['🛠 Upgrades', '🛠 Улучшения', '🛠 Uzlabojumi'],
    dict: ['📒 My words', '📒 Мой словарик', '📒 Mana vārdnīca'],
    dictEmpty: ['No words yet: play and they will appear here.', 'Пока пусто — сыграй, и слова появятся здесь.', 'Vēl tukšs — uzspēlē, un vārdi parādīsies šeit.'],
    dictN: ['{n} words learned', 'Выучено слов: {n}', 'Iemācīti vārdi: {n}'],
    back: ['← Back', '← Назад', '← Atpakaļ'],
    station: ['Station {n}', 'Станция {n}', '{n}. stacija'],
    find: ['Find {n} words', 'Найди слов: {n}', 'Atrodi vārdus: {n}'],
    score: ['Score', 'Очки', 'Punkti'],
    best: ['Best: {n}', 'Рекорд: {n}', 'Rekords: {n}'],
    hint: ['Hint', 'Подсказка', 'Padoms'], word: ['Whole word', 'Целое слово', 'Viss vārds'],
    shuffle: ['Shuffle', 'Перемешать', 'Sajaukt'], clear: ['Erase', 'Стереть', 'Dzēst'], ok: ['Check', 'Проверить', 'Pārbaudīt'],
    jar: ['Bonus words: every {n} give a hint', 'Бонусные слова: каждые {n} дают подсказку', 'Bonusa vārdi: katri {n} dod padomu'],
    already: ['Already found!', 'Уже есть!', 'Jau atrasts!'],
    nope: ['No such word here. Try again!', 'Такого слова здесь нет. Попробуй ещё!', 'Šeit tāda vārda nav. Mēģini vēlreiz!'],
    bonus: ['Bonus word! +{n}', 'Бонусное слово! +{n}', 'Bonusa vārds! +{n}'],
    jarFull: ['The jar is full: +1 hint!', 'Баночка полна — +1 подсказка!', 'Burciņa pilna — +1 padoms!'],
    noHints: ['No hints left at this station', 'Подсказок на этой станции больше нет', 'Šajā stacijā padomu vairs nav'],
    done: ['Station {s}: all words found!', 'Станция {s}: все слова найдены!', '{s}: visi vārdi atrasti!'],
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
    lvlN: ['level {n} of {m}', 'уровень {n} из {m}', '{n}. līmenis no {m}'],
    trip: ['Trip {n}', 'Поездка {n}', '{n}. brauciens'],
    tap: ['Tap the letters to make a word', 'Нажимай на буквы, чтобы собрать слово', 'Spied uz burtiem, lai saliktu vārdu'],
  };
  const t = (k, o) => { let v = T[k][L]; if (o) for (const [a, b] of Object.entries(o)) v = v.split('{' + a + '}').join(b); return v; };
  const tr = a => a[L];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const post = (path, body) => fetch('/api/' + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.ok ? r.json() : Promise.reject(r.status));
  const toast = s => window.PPToast ? window.PPToast(s) : null;
  // реплики Эмпанадильо
  const SAY = {
    hi: [['Hola! I’m Empanadillo. Let’s find some words!', 'Hola! Я Эмпанадильо. Давай искать слова!', 'Hola! Es esmu Empanadiljo. Meklēsim vārdus!'],
      ['Next stop, new words. ¡Vamos!', 'Новая станция — новые слова. ¡Vamos!', 'Jauna stacija — jauni vārdi. ¡Vamos!']],
    good: [['¡Muy bien!', '¡Muy bien! Отлично!', '¡Muy bien! Lieliski!'], ['You’re a word wizard!', 'Да ты волшебник слов!', 'Tu esi vārdu burvis!'], ['Yum, a tasty word!', 'Ммм, вкусное слово!', 'Mmm, garšīgs vārds!'], ['Polly is proud of you!', 'Полли тобой гордится!', 'Pollija ar tevi lepojas!']],
    hint: [['Psst… look at this letter!', 'Псст… смотри, какая буква!', 'Psst… paskaties uz šo burtu!'], ['Here’s a little crumb of help.', 'Вот крошечка помощи.', 'Lūk, mazliet palīdzības.']],
  };
  const say = (k, extra) => { const a = SAY[k][Math.floor(Math.random() * SAY[k].length)]; bubble(tr(a) + (extra ? ' ' + extra : '')); };

  // ---------- хранилище в браузере ----------
  const store = (() => { let o = {}; try { o = JSON.parse(localStorage.getItem('pp-train') || '{}') || {}; } catch (e) {} return o; })();
  const save = () => { try { localStorage.setItem('pp-train', JSON.stringify(store)); } catch (e) {} };
  const DEST = ['es', 'no', 'en', 'lv'].filter(l => l !== SL), FLAG = { en: '🇬🇧', lv: '🇱🇻', es: '🇪🇸', no: '🇳🇴' };
  if (!DEST.includes(store.lang)) store.lang = 'es'; store.best = store.best || {}; store.lv = store.lv || {}; store.dict = store.dict || {};

  // ---------- слова ----------
  const COL = { en: 1, lv: 3, es: 4, no: 5 };
  const norm = (w, l) => { w = w.toLowerCase(); if (l === 'es') w = w.normalize('NFD').replace(/ñ/g, 'ñ').replace(/[̀-ͯ]/g, '').normalize('NFC'); return w; };
  const cnt = s => { const m = {}; for (const c of s) m[c] = (m[c] || 0) + 1; return m; };
  const fits = (w, tc) => { const a = cnt(w); for (const c in a) if ((tc[c] || 0) < a[c]) return false; return true; };
  const VOC = {};
  function vocab(l) {
    if (VOC[l]) return VOC[l];
    const map = new Map(), add = (w, e, g) => { const k = norm(w, l); if (k.length >= 3 && !/[\s\-]/.test(k) && !map.has(k)) map.set(k, { k, w, e, g }); };
    WD[l].forEach(st => st.w.forEach(x => add(x[0], x[1], x.slice(2))));
    WD.dict.trim().split('\n').forEach(line => { const p = line.split('|'); add(p[COL[l]], p[0], [p[1], p[2], p[3]]); });
    const extra = new Set(); WD[l].forEach(st => st.x.split(' ').forEach(w => w && extra.add(norm(w, l))));
    return (VOC[l] = { map, list: [...map.values()], extra, sets: null });
  }
  // наборы плиток для бесконечных станций: слово (5–9 букв) или слово + 1–2 буквы другого, из которых складываются ≥ 3 слова словаря
  function sets(l) {
    const v = vocab(l); if (v.sets) return v.sets;
    const words = v.list.map(x => x.k), out = new Map();
    const add = tiles => { const key = [...tiles].sort().join(''); if (out.has(key)) return; const tc = cnt(tiles), tg = words.filter(w => fits(w, tc)); if (tg.length >= 3) out.set(key, { tiles, tg }); };
    for (const a of words) {
      if (a.length < 5 || a.length > 9) continue;
      add(a); const ta = cnt(a);
      for (const b of words) { const bb = cnt(b); let ex = ''; for (const c in bb) { const d = bb[c] - (ta[c] || 0); if (d > 0) ex += c.repeat(d); } if (ex && ex.length <= 2 && a.length + ex.length <= 9) add(a + ex); }
    }
    const by = {}; [...out.values()].sort((x, y) => x.tiles < y.tiles ? -1 : 1).forEach(s => (by[s.tiles.length] = by[s.tiles.length] || []).push(s));
    return (v.sets = by);
  }
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  // станция n: {tiles: [буквы], tg: [ключи слов], need, bonus: Set}
  function level(l, n) {
    const v = vocab(l), H = WD[l];
    if (n <= H.length) {
      const st = H[n - 1], tiles = norm(st.b, l);
      return { tiles: [...tiles], tg: st.w.map(x => norm(x[0], l)), bonus: new Set([...st.x.split(' ').filter(Boolean).map(w => norm(w, l)), ...v.list.map(x => x.k)].filter(w => fits(w, cnt(tiles)))) };
    }
    const k = n - H.length, size = k < 8 ? 6 : k < 22 ? 7 : k < 45 ? 8 : 9, by = sets(l);
    let pool = by[size] || by[7] || Object.values(by)[0];
    const r = rng(hash(l + ':' + size)), order = pool.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const s = pool[order[(k * 3) % order.length]], need = Math.min(s.tg.length, 3 + Math.floor(k / 10), 8);
    const rr = rng(hash(l + '#' + n)), sorted = s.tg.slice().sort((a, b) => b.length - a.length);
    const tg = [sorted[0]], rest = sorted.slice(1).sort(() => rr() - .5);
    while (tg.length < need && rest.length) tg.push(rest.shift());
    const tc = cnt(s.tiles), bonus = new Set([...v.list.map(x => x.k), ...v.extra].filter(w => !tg.includes(w) && fits(w, tc)));
    return { tiles: [...s.tiles], tg, bonus };
  }
  const info = k => vocab(lang).map.get(k);
  const show = k => { const x = info(k); return x ? x.w : k; };
  const gloss = k => { const x = info(k); if (!x) return ''; const g = x.g[L]; return g && norm(g, lang) !== k ? g : ''; };
  const pts = c => (WD.pts[lang] || {})[c] || 1;
  const scoreOf = w => { let s = 0; for (const c of w) s += pts(c); return s * (w.length >= 6 ? 2 : 1); };

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
  const UPS = {
    hint: { n: ['🥟 More empanadas', '🥟 Больше эмпанад', '🥟 Vairāk empanādu'], d: ['+1 hint at every station', '+1 подсказка на каждой станции', '+1 padoms katrā stacijā'] },
    word: { n: ['🔎 Magnifying glass', '🔎 Лупа', '🔎 Lupa'], d: ['Empanadillo shows a whole word: +1 per station', 'Эмпанадильо показывает целое слово — +1 на станцию', 'Empanadiljo parāda visu vārdu — +1 stacijā'] },
    jar: { n: ['🫙 Smaller jar', '🫙 Баночка поменьше', '🫙 Mazāka burciņa'], d: ['A hint for fewer bonus words (5 → 4 → 3)', 'Подсказка за меньшее число бонусных слов (5 → 4 → 3)', 'Padoms par mazāk bonusa vārdiem (5 → 4 → 3)'] },
  };
  const up = k => (srv.ups && srv.ups[k]) || 0;
  const BADGE = { tr1: ['Ticket punched', 'Билет прокомпостирован', 'Biļete komposterēta'], tr2: ['Seasoned traveller', 'Бывалый путешественник', 'Pieredzējis ceļotājs'],
    tr3: ['Endless rails', 'Бесконечные рельсы', 'Bezgalīgās sliedes'], trpoly: ['Polyglot pigeon', 'Голубь-полиглот', 'Poliglots balodis'], trwords: ['Word collector', 'Собиратель слов', 'Vārdu krājējs'] };

  // ---------- разметка ----------
  app.innerHTML = `<div class="tr-stage"><canvas class="tr-scene" width="360" height="150" aria-hidden="true"></canvas>
    <div class="tr-hud"><span class="tr-st"></span><span class="tr-sc"></span></div>
    <div class="tr-say" role="status" aria-live="polite"><img src="/images/train/emp.png" alt="" width="48" height="24"><p></p></div>
    <div class="tr-play"><p class="tr-need"></p><ul class="tr-words"></ul><div class="tr-cur" aria-live="polite"></div><div class="tr-rack"></div>
      <div class="tr-btns"><button type="button" data-a="shuffle" title="${t('shuffle')}">🔀</button><button type="button" data-a="clear" title="${t('clear')}">⌫</button><button type="button" data-a="ok" class="tr-ok">${t('ok')} ✔</button>
      <button type="button" data-a="hint" class="tr-hint">🥟 <b></b></button><button type="button" data-a="word" class="tr-wordb">🔎 <b></b></button></div>
      <p class="tr-jar"></p></div>
    <div class="tr-ov" hidden></div></div>
    <section class="rain-top" data-top="train"></section>`;
  const $ = s => app.querySelector(s);
  const cv = $('.tr-scene'), ctx = cv.getContext('2d'), ov = $('.tr-ov');
  const setOv = on => { ov.hidden = !on; $('.tr-stage').classList.toggle('ov', on); };
  const bubble = s => { $('.tr-say p').textContent = s; };

  // ---------- состояние игры ----------
  let state = 'menu', lang = store.lang, lvl = 1, cur = null, picked = [], order = [], found = [], revealed = {}, hints = 0, words = 0, wordsN = 0, jar = 0, score = 0, used = 0;
  let run = null, queue = Promise.resolve(), runGot = 0, runItems = [];
  const jarSize = () => 5 - up('jar');

  function startStation() {
    cur = level(lang, lvl); found = []; revealed = {}; picked = []; used = 0; wordsN = 0;
    order = cur.tiles.map((_, i) => i); shuffleRack();
    hints = 2 + up('hint'); words = up('word'); state = 'play'; setOv(false);
    say('hi'); render(); travel = 0;
  }
  function shuffleRack() { for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } }
  function render() {
    if (!cur) return;
    $('.tr-st').textContent = `${t('station', { n: lvl })} · ${city(lvl)} · ${tr(T.langs[lang])}`;
    $('.tr-sc').textContent = `${t('score')}: ${score}`;
    $('.tr-need').textContent = t('find', { n: cur.tg.length }) + ` · ${found.length}/${cur.tg.length}`;
    $('.tr-words').innerHTML = cur.tg.slice().sort((a, b) => a.length - b.length || (a < b ? -1 : 1)).map(k => {
      const ok = found.includes(k), x = info(k), g = gloss(k), r = revealed[k] || 0;
      const cells = [...k].map((c, i) => `<i class="${ok ? 'on' : i < r ? 'hint' : ''}">${ok || i < r ? esc(c.toUpperCase()) : ''}</i>`).join('');
      return `<li class="${ok ? 'ok' : ''}"><span class="tr-cells">${cells}</span>${ok ? `<span class="tr-gl">${x ? x.e : ''} ${esc(show(k))}${g ? ' — ' + esc(g) : ''}</span>` : ''}</li>`;
    }).join('');
    const w = picked.map(i => cur.tiles[i]).join('');
    $('.tr-cur').innerHTML = w ? [...w].map(c => `<i>${esc(c.toUpperCase())}<sub>${pts(c)}</sub></i>`).join('') : `<em>${t('tap')}</em>`;
    $('.tr-rack').innerHTML = order.map(i => `<button type="button" class="tr-tile" data-i="${i}"${picked.includes(i) ? ' disabled' : ''}>${esc(cur.tiles[i].toUpperCase())}<sub>${pts(cur.tiles[i])}</sub></button>`).join('');
    $('.tr-hint b').textContent = hints; $('.tr-hint').disabled = !hints;
    $('.tr-wordb').hidden = !up('word'); $('.tr-wordb b').textContent = words; $('.tr-wordb').disabled = !words;
    $('.tr-jar').textContent = `🫙 ${'●'.repeat(jar)}${'○'.repeat(Math.max(0, jarSize() - jar))} · ${t('jar', { n: jarSize() })}`;
  }
  function check() {
    const w = picked.map(i => cur.tiles[i]).join(''); if (!w) return;
    picked = [];
    if (found.includes(w)) { bubble(t('already')); return render(); }
    if (cur.tg.includes(w)) {
      found.push(w); wordsN++; const s = scoreOf(w); score += s; learn(w);
      const g = gloss(w), x = info(w); say('good', `${x ? x.e : ''} ${show(w)}${g ? ' — ' + g : ''} (+${s})`);
      render(); if (found.length === cur.tg.length) setTimeout(stationDone, 700); return;
    }
    if (cur.bonus.has(w) || vocab(lang).map.has(w)) {
      if ((cur.bonusFound = cur.bonusFound || []).includes(w)) { bubble(t('already')); return render(); }
      cur.bonusFound.push(w); wordsN++; const s = Math.ceil(scoreOf(w) / 2); score += s; bubble(t('bonus', { n: s }) + ' ' + show(w).toUpperCase() + (gloss(w) ? ' — ' + gloss(w) : ''));
      if (++jar >= jarSize()) { jar = 0; hints++; setTimeout(() => bubble(t('jarFull')), 1400); }
      return render();
    }
    bubble(t('nope')); $('.tr-cur').classList.remove('shake'); void $('.tr-cur').offsetWidth; $('.tr-cur').classList.add('shake'); render();
  }
  // подсказка: следующая буква самого короткого ненайденного слова
  function hint() {
    if (!hints) return bubble(t('noHints'));
    const k = cur.tg.filter(w => !found.includes(w)).sort((a, b) => a.length - b.length)[0]; if (!k) return;
    hints--; used++; revealed[k] = (revealed[k] || 0) + 1; say('hint');
    if (revealed[k] >= k.length) { found.push(k); learn(k); if (found.length === cur.tg.length) setTimeout(stationDone, 700); }
    render();
  }
  function wholeWord() {
    if (!words) return; const k = cur.tg.filter(w => !found.includes(w)).sort((a, b) => b.length - a.length)[0]; if (!k) return;
    words--; used += 2; found.push(k); learn(k); bubble(`🔎 ${info(k) ? info(k).e : ''} ${show(k)}${gloss(k) ? ' — ' + gloss(k) : ''}`); render();
    if (found.length === cur.tg.length) setTimeout(stationDone, 700);
  }
  function learn(k) { const d = store.dict[lang] = store.dict[lang] || []; if (!d.includes(k)) { d.push(k); save(); } }
  function stationDone() {
    if (state !== 'play') return; state = 'done';
    const stars = used === 0 ? 3 : used <= 2 ? 2 : 1, n = lvl;
    if (score > (store.best[lang] || 0)) store.best[lang] = score;
    if (n > (store.lv[lang] || 0)) store.lv[lang] = n; save();
    const box = document.createElement('div'); box.className = 'tr-card';
    box.innerHTML = `<h2>${esc(t('done', { s: city(n) }))}</h2><p class="tr-stars" title="${t('stars')}">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</p>
      <h3>${t('learned')}</h3><ul class="tr-learn">${cur.tg.map(k => { const x = info(k); return `<li>${x ? x.e : '•'} <b>${esc(show(k))}</b>${gloss(k) ? ' — ' + esc(gloss(k)) : ''}</li>`; }).join('')}</ul>
      <p class="tr-pay"></p><p><button type="button" class="pill-btn pill-fill tr-next">${t('next')}</button> <button type="button" class="pill-btn tr-stop">${t('stop')}</button></p>`;
    ov.innerHTML = ''; ov.appendChild(box); setOv(true);
    box.querySelector('.tr-next').onclick = () => { lvl++; setOv(false); travel = 1; state = 'travel'; travelT = 0; };
    box.querySelector('.tr-stop').onclick = () => { run = null; state = 'menu'; menu(); };
    const pay = box.querySelector('.tr-pay');
    if (srv.me && run) queue = queue.then(() => saveStation(n, wordsN, 0)).then(r => {
      if (!r) return; srv.lv = r.lv; srv.best = r.best;
      const a = []; if (r.got > 0) { a.push(t('got', { n: r.got })); srv.buttons += r.got; } if (r.rec > 0) { a.push(t('rec', { n: r.rec })); srv.buttons += r.rec; }
      if (r.item) { const B = window.PPBirds, nm = B && B.giftName ? B.giftName(r.item.kind, r.item.item, L) : r.item.item; a.push(t('gotItem', { n: nm })); runItems.push(nm); }
      pay.textContent = a.join(' · '); runGot += (r.got || 0) + (r.rec || 0);
      if (window.PPAccount && window.PPAccount.setButtons && (r.got || r.rec)) window.PPAccount.setButtons(srv.buttons);
      (r.badges || []).forEach((k, i) => setTimeout(() => BADGE[k] && toast(t('badge', { n: tr(BADGE[k]) })), 400 + i * 1600));
    }).catch(() => {});
    else if (!srv.me) pay.innerHTML = `${t('guest')} <button type="button" class="pill-btn tr-in">${t('signin')}</button>`, pay.querySelector('.tr-in').onclick = signIn;
  }
  const saveStation = (n, w, k) => post('train/station', { run, level: n, words: w }).catch(e => e === 429 && k < 5 ? new Promise(r => setTimeout(r, 3000)).then(() => saveStation(n, w, k + 1)) : (e !== 409 && toast(t('noSave')), null));
  const signIn = () => window.PPAccount && window.PPAccount.openSignIn && window.PPAccount.openSignIn();

  // ---------- меню ----------
  function menu() {
    state = 'menu'; setOv(true);
    const best = Math.max(store.lv[lang] || 0, (srv.lv && srv.lv[lang]) || 0), every = srv.start || 10;
    const froms = []; for (let f = every; f <= best && every; f += every) froms.push(f);
    ov.innerHTML = `<div class="tr-card tr-menu">
      <a class="tr-sup" href="https://libertas.study/" target="_blank" rel="noopener"><span>${t('support')}</span><img src="/images/train/libertas.png" alt="Libertas.study" width="129" height="52"></a>
      <h2>${t('title')} ${tr(T.to[lang])}</h2><img class="tr-emp" src="/images/train/emp.png" alt="" width="96" height="48"><p>${t('intro')}</p>
      <p class="tr-lh">${t('where')}</p><div class="tr-langs">${DEST.map(l => `<button type="button" class="tr-lang${l === lang ? ' on' : ''}" data-l="${l}">${FLAG[l]} <b>${tr(T.land[l])}</b><small>${tr(T.langs[l])}</small></button>`).join('')}</div>
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
    lvl = from + 1; score = 0; jar = 0; runGot = 0; runItems = []; run = null;
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
    const d = (store.dict[lang] || []).slice().sort();
    ov.innerHTML = `<div class="tr-card"><h2>${t('dict')} · ${tr(T.langs[lang])}</h2><p>${d.length ? t('dictN', { n: d.length }) : t('dictEmpty')}</p>
      <ul class="tr-learn tr-dict">${d.map(k => { const x = info(k); return `<li>${x ? x.e : '•'} <b>${esc(show(k))}</b>${gloss(k) ? ' — ' + esc(gloss(k)) : ''}</li>`; }).join('')}</ul>
      <p><button type="button" class="pill-btn tr-back">${t('back')}</button></p></div>`;
    ov.querySelector('.tr-back').onclick = menu;
  }
  function topList() { const el = app.querySelector('.rain-top'); if (!window.PPTop || !el) return; const fresh = !el.__top; window.PPTop.mount(el); if (!fresh) window.PPTop.refresh(el); }

  // ---------- управление ----------
  app.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || state !== 'play') return;
    if (b.classList.contains('tr-tile')) { picked.push(+b.dataset.i); render(); return; }
    const a = b.dataset.a;
    if (a === 'shuffle') { shuffleRack(); render(); } else if (a === 'clear') { picked.pop(); render(); } else if (a === 'ok') check(); else if (a === 'hint') hint(); else if (a === 'word') wholeWord();
  });
  $('.tr-cur').addEventListener('click', () => { if (state === 'play' && picked.length) { picked = []; render(); } });
  document.addEventListener('keydown', e => {
    if (state !== 'play' || e.ctrlKey || e.metaKey || e.altKey || /input|textarea/i.test((e.target || {}).tagName || '')) return;
    if (e.key === 'Enter') { e.preventDefault(); check(); return; }
    if (e.key === 'Backspace') { e.preventDefault(); picked.pop(); render(); return; }
    if (e.key === ' ') { e.preventDefault(); shuffleRack(); render(); return; }
    if (e.key.length !== 1) return;
    const k = norm(e.key, lang), free = order.filter(i => !picked.includes(i));
    // буква без значка подходит к плитке со значком (a → ā), если такой простой буквы нет
    let i = free.find(j => cur.tiles[j] === k); if (i == null) i = free.find(j => norm(cur.tiles[j].normalize('NFD').replace(/[̀-ͯ]/g, ''), lang) === k);
    if (i != null) { picked.push(i); render(); }
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
