// Пиксельные комнаты (Fantasy World): кабинет Полли и кабинет детектива Титоса.
// Фон день/вечер — tools/rooms/*.py, зоны для клика — window.ROOMS (rooms-data.js). Реплики предметов — ниже, на трёх языках.
(() => {
  const box = document.getElementById('rm'); if (!box || !window.ROOMS) return;
  const room = box.dataset.room, R = window.ROOMS[room];
  const L = { en: 0, ru: 1, lv: 2 }[document.documentElement.lang] ?? 0;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => new Date().toLocaleTimeString(['en-GB', 'ru-RU', 'lv-LV'][L], { hour: '2-digit', minute: '2-digit' });
  const T = {
    office: {
      blinds: [['Original blinds. Nobody knows how to open them evenly. Nobody has tried since 1998.', 'One slat is bent. Someone peeked at the parking lot very dramatically.'],
               ['Жалюзи «с историей». Ровно их открыть не умеет никто. С 1998 года никто и не пробовал.', 'Одна планка погнута. Кто-то очень драматично смотрел на парковку.'],
               ['Vēsturiskas žalūzijas. Vienmērīgi tās atvērt neprot neviens. Kopš 1998. gada neviens arī nav mēģinājis.', 'Viena lamele ir saliekta. Kāds ļoti dramatiski skatījās uz stāvvietu.']],
      cooler: [['Glug… glug. The water cooler: where all office news begins.', 'Polly drinks eight cups a day. Mostly to hear the gossip.'],
               ['Буль… буль. Кулер — место, где рождаются все офисные новости.', 'Полли выпивает восемь стаканчиков в день. В основном ради сплетен.'],
               ['Burbulis… burbulis. Dzesētājs — vieta, kur dzimst visas biroja ziņas.', 'Pollija izdzer astoņas glāzītes dienā. Galvenokārt baumu dēļ.']],
      clock: [['It’s {t}. Too early to go home, too late to start something new.'], ['Сейчас {t}. Домой рано, начинать что-то новое поздно.'], ['Pulkstens ir {t}. Uz mājām par agru, sākt kaut ko jaunu par vēlu.']],
      calendar: [['A red circle on one day. Nobody remembers what it means, but everyone is nervous.'], ['Один день обведён красным. Никто не помнит, что это значит, но все волнуются.'], ['Viena diena apvilkta sarkanā. Neviens neatceras, ko tas nozīmē, bet visi uztraucas.']],
      poster: [['TEAMWORK. Three birds flying into a sunset. Inspiring, apparently.'], ['ТИМВОРК. Три птицы летят в закат. Говорят, вдохновляет.'], ['KOMANDAS DARBS. Trīs putni lido saulrietā. Esot iedvesmojoši.']],
      board: [['Sticky notes: “Buy coffee”, “Buy MORE coffee”, “Who took my stapler??”'], ['Стикеры: «Купить кофе», «Купить ЕЩЁ кофе», «Кто взял мой степлер??»'], ['Līmlapiņas: “Nopirkt kafiju”, “Nopirkt VĒL kafiju”, “Kurš paņēma manu skavotāju??”']],
      cabinet: [['Four drawers of very important papers. The fifth drawer is snacks.'], ['Четыре ящика очень важных бумаг. Пятый ящик — перекусы.'], ['Četras atvilktnes ar ļoti svarīgiem papīriem. Piektā atvilktne ir uzkodām.']],
      plant: [['The office plant. It has survived three managers and one very bad winter.'], ['Офисный цветок. Пережил трёх начальников и одну очень плохую зиму.'], ['Biroja puķe. Pārdzīvojusi trīs priekšniekus un vienu ļoti sliktu ziemu.']],
      desk: [['Polly’s desk. Organised chaos, emphasis on chaos.'], ['Стол Полли. Организованный хаос, с ударением на «хаос».'], ['Pollijas galds. Organizēts haoss, ar uzsvaru uz haoss.']],
      monitor: [['A spreadsheet with 4,000 rows. Polly is on row 12.', 'The screensaver is a flying toaster. Classic.'], ['Таблица на 4000 строк. Полли на 12-й.', 'Заставка — летающий тостер. Классика.'], ['Tabula ar 4000 rindām. Pollija ir 12. rindā.', 'Ekrānsaudzētājs — lidojošs tosteris. Klasika.']],
      mug: [['“World’s Best Pigeon”. She bought it herself.'], ['«Лучший голубь в мире». Купила себе сама.'], ['“Pasaules labākais balodis”. Nopirka pati sev.']],
      jello: [['A stapler in jelly. Again. Polly has suspects.'], ['Степлер в желе. Опять. У Полли есть подозреваемые.'], ['Skavotājs želejā. Atkal. Pollijai ir aizdomās turamie.']],
      nameplate: [['POLLY. Office Clerk. Pigeon. In that order.'], ['ПОЛЛИ. Офисный клерк. Голубь. Именно в таком порядке.'], ['POLLIJA. Biroja klerke. Balodis. Tieši šādā secībā.']],
      trash: [['Mostly crumpled drafts and one sad sandwich.'], ['В основном скомканные черновики и один грустный бутерброд.'], ['Galvenokārt saburzīti melnraksti un viena skumja sviestmaize.']],
      lights: [['Click — and the day is over.'], ['Щёлк — и рабочий день закончился.'], ['Klikšķ — un darba diena ir beigusies.']],
      copier: [['The copier is warming up. It has been warming up since Monday.', 'Paper jam in tray 2. There is no tray 2.'], ['Копир прогревается. С понедельника.', 'Замятие бумаги в лотке 2. Лотка 2 нет.'], ['Kopētājs uzsilst. Kopš pirmdienas.', 'Papīrs iesprūdis 2. paplātē. 2. paplātes nav.']],
      phone: [['Ring ring! “Polly speaking. No, we don’t sell bread crumbs.”'], ['Дзынь-дзынь! «Полли слушает. Нет, хлебными крошками мы не торгуем».'], ['Zvan-zvan! “Pollija klausās. Nē, maizes drupačas mēs nepārdodam.”']],
      polly: [['Hi! I’m on my coffee break. I’ve been on it since nine.', 'Coo. If anyone asks, I’m in a meeting.', 'Have you met the water cooler? Great listener.'],
              ['Привет! У меня перерыв на кофе. С девяти утра.', 'Курлык. Если что, я на совещании.', 'Вы знакомы с кулером? Отличный слушатель.'],
              ['Sveiks! Man ir kafijas pauze. Kopš deviņiem.', 'Kū. Ja kāds jautā, esmu sapulcē.', 'Vai esi iepazinies ar dzesētāju? Lielisks klausītājs.']],
    },
    detective: {
      blinds: [['Through the blinds the city looks like a case file. Striped and full of secrets.'], ['Сквозь жалюзи город похож на папку с делом. Полосатый и полный тайн.'], ['Caur žalūzijām pilsēta izskatās kā lietas mape. Svītraina un pilna noslēpumu.']],
      fan: [['The ceiling fan spins slowly. Like the investigation.'], ['Потолочный вентилятор крутится медленно. Как расследование.'], ['Griestu ventilators griežas lēni. Kā izmeklēšana.']],
      boxes: [['Cases from A to Z. The box marked 1999 is never to be opened.', 'Every box is a story. Most of them end with “and then the cat was found”.'],
              ['Дела от A до Z. Коробку с надписью 1999 не открывать никогда.', 'Каждая коробка — история. Большинство заканчиваются словами «и тут нашёлся кот».'],
              ['Lietas no A līdz Z. Kasti ar uzrakstu 1999 neatvērt nekad.', 'Katra kaste ir stāsts. Lielākā daļa beidzas ar “un tad atradās kaķis”.']],
      board: [['Red string connects everything. Titos is sure the baker did it. He is always sure.'], ['Красные нитки связывают всё. Титос уверен, что это пекарь. Он всегда уверен.'], ['Sarkani diegi savieno visu. Titoss ir pārliecināts, ka to izdarīja maiznieks. Viņš vienmēr ir pārliecināts.']],
      clock: [['{t}. Crime never sleeps. Titos sometimes does, at the desk.'], ['{t}. Преступность не дремлет. Титос иногда дремлет — прямо за столом.'], ['{t}. Noziedzība neguļ. Titoss dažreiz guļ — pie galda.']],
      coat: [['The coat and the hat. For when it rains, and for when it looks dramatic.'], ['Плащ и шляпа. На случай дождя и на случай драмы.'], ['Mētelis un cepure. Lietum un dramatiskiem brīžiem.']],
      cabinet: [['A drawer full of folders. Alphabetical. Mostly.'], ['Ящик, полный папок. По алфавиту. В основном.'], ['Atvilktne pilna ar mapēm. Alfabētiskā secībā. Pārsvarā.']],
      desk: [['The desk has three drawers. The third one sticks. It’s a clue.'], ['У стола три ящика. Третий заедает. Это улика.'], ['Galdam ir trīs atvilktnes. Trešā iesprūst. Tas ir pierādījums.']],
      lamp: [['Click. The late-night shift begins.'], ['Щёлк. Начинается ночная смена.'], ['Klikšķ. Sākas nakts maiņa.']],
      typewriter: [['Clack-clack-ding! Report No. 1,042: “The suspect is still a mystery.”'], ['Щёлк-щёлк-дзынь! Отчёт № 1042: «Подозреваемый по-прежнему загадка».'], ['Klak-klak-dzin! Ziņojums Nr. 1042: “Aizdomās turamais joprojām ir mīkla.”']],
      folders: [['The red folder is marked URGENT. It has been urgent for a long time.'], ['На красной папке надпись СРОЧНО. Срочно уже очень давно.'], ['Uz sarkanās mapes rakstīts STEIDZAMI. Steidzami jau ļoti sen.']],
      mug: [['Cold coffee. A detective’s best friend.'], ['Остывший кофе. Лучший друг детектива.'], ['Atdzisusi kafija. Detektīva labākais draugs.']],
      magnifier: [['Under the magnifying glass: a crumb. Suspicious.'], ['Под лупой: крошка. Подозрительно.'], ['Zem lupas: drupača. Aizdomīgi.']],
      floorboxes: [['More cases. The office ran out of shelves in spring.'], ['Ещё дела. Полки закончились ещё весной.'], ['Vēl lietas. Plaukti beidzās jau pavasarī.']],
      titos: [['Detective Titos. Every clue counts. Even crumbs.', 'Evening. Seen anything suspicious? Anything at all?', 'Don’t touch the board. I have a system.'],
              ['Детектив Титос. Важна каждая улика. Даже крошки.', 'Добрый вечер. Ничего подозрительного не видели? Совсем ничего?', 'Доску не трогайте. У меня система.'],
              ['Detektīvs Titoss. Svarīga ir katra druska. Pat drupačas.', 'Labvakar. Neko aizdomīgu neesi redzējis? Pilnīgi neko?', 'Neaiztiec dēli. Man ir sistēma.']],
    },
  }[room];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const pct = v => v + '%';
  // спрайты
  const SP = {};
  Object.entries(R.sprites || {}).forEach(([k, [x, y, w]]) => {
    const im = document.createElement('img'); im.className = 'rm-sprite rm-' + k; im.alt = ''; im.draggable = false;
    im.src = `/images/rooms/${room}-${k}.png`;
    im.style.left = pct(x / R.w * 100); im.style.top = pct(y / R.h * 100); im.style.width = pct(w / R.w * 100);
    box.appendChild(im); SP[k] = im;
  });
  const who = box.dataset.who, hero = SP[who];
  if (hero) setInterval(() => { hero.src = `/images/rooms/${room}-${who}-blink.png`; setTimeout(() => hero.src = `/images/rooms/${room}-${who}.png`, 160); }, 3800);
  // вечер
  const btn = document.getElementById('rm-time');
  const setEvening = on => { box.classList.toggle('evening', on); btn.textContent = on ? btn.dataset.day : btn.dataset.ev; btn.setAttribute('aria-pressed', on); };
  const h = new Date().getHours(); setEvening(h >= 18 || h < 7);
  btn.addEventListener('click', () => setEvening(!box.classList.contains('evening')));
  // облачко
  const bub = document.createElement('div'); bub.className = 'rm-bub'; bub.setAttribute('role', 'status'); box.appendChild(bub);
  let bt;
  const say = (k, el) => {
    const txt = pick(T[k][L]).replace('{t}', now());
    bub.innerHTML = `<span>${esc(txt)}</span>`;
    const [x, y, w] = R.hot[k];
    const cx = Math.min(80, Math.max(20, x + w / 2));
    const [, , , hh] = R.hot[k], below = y < 24;
    bub.classList.toggle('below', below);
    bub.style.left = cx + '%'; bub.style.top = (below ? Math.min(y + hh, 70) : y) + '%';
    bub.classList.remove('on'); void bub.offsetWidth; bub.classList.add('on');
    clearTimeout(bt); bt = setTimeout(() => bub.classList.remove('on'), 5200);
  };
  const fx = {
    cooler: () => { const [x, y, w, hh] = R.hot.cooler; for (let i = 0; i < 6; i++) { const b = document.createElement('i'); b.className = 'rm-bubble'; b.style.left = pct(x + w * (.3 + Math.random() * .4)); b.style.top = pct(y + hh * .48); b.style.animationDelay = i * .18 + 's'; box.appendChild(b); setTimeout(() => b.remove(), 2200); } },
    copier: () => { const [x, y] = R.hot.copier; const p = document.createElement('i'); p.className = 'rm-paper'; p.style.left = pct(x + 14); p.style.top = pct(y + 9); box.appendChild(p); setTimeout(() => p.remove(), 1500); },
    phone: () => SP.phone && (SP.phone.classList.remove('shake'), void SP.phone.offsetWidth, SP.phone.classList.add('shake')),
    lights: () => setEvening(!box.classList.contains('evening')),
    lamp: () => setEvening(!box.classList.contains('evening')),
  };
  fx[who] = () => hero && (hero.classList.remove('hop'), void hero.offsetWidth, hero.classList.add('hop'));
  // зоны для клика (порядок: мелкие поверх крупных)
  Object.entries(R.hot).sort((a, b) => b[1][2] * b[1][3] - a[1][2] * a[1][3]).forEach(([k, [x, y, w, hh]]) => {
    if (!T[k]) return;
    const z = document.createElement('button'); z.type = 'button'; z.className = 'rm-hot'; z.dataset.k = k;
    z.style.left = pct(x); z.style.top = pct(y); z.style.width = pct(w); z.style.height = pct(hh);
    z.setAttribute('aria-label', T[k][L][0].replace('{t}', now()));
    z.addEventListener('click', () => { say(k, z); fx[k] && fx[k](); });
    box.appendChild(z);
  });
})();
