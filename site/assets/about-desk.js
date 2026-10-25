// «Стол Алины» на /about-me/ (docs/site.md): пиксельная картинка site/images/about/desk.webp (1024×765) и поверх неё:
// холст 256×192 (×4) — рука Алины (берёт кисть, моет, набирает краску, рисует на чистой странице, печатает, жмёт мышку,
// гладит Милку), пар над кружкой, пылинки в луче, свет лампы, сердечки; Милка дышит и моргает (куски той же картинки);
// предметы по клику говорят фразы; на экране ноутбука — «Поболтать с Алиной и Полли» → ретро-чат.
// Чат: вопросы site/assets/about-chat.json (content/about-chat/, tools/about_chat.py), подсказки по вводу, 🎲, счётчик открытых.
// Открытые вопросы: гость — sessionStorage pp-achat (при закрытии — предупреждение), вошедший — /api/about-chat (worker/about-chat.js).
(() => {
  const root = document.getElementById('am-desk');
  if (!root) return;
  const LI = { ru: 1, lv: 2 }[document.documentElement.lang] || 0;
  const LG = ['en', 'ru', 'lv'][LI];
  const tr = a => a[LI] != null ? a[LI] : a[0];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = root.querySelector('.ad-scene');
  const IW = 1024, IH = 765, S = 4, LW = IW / S, LH = Math.ceil(IH / S);
  const box = (x, y, w, h) => `left:${x / IW * 100}%;top:${y / IH * 100}%;width:${w / IW * 100}%;height:${h / IH * 100}%`;
  // кусок картинки на своём месте (веко, дыхание): фон — та же картинка, сдвинутая на (sx, sy)
  const piece = (cls, x, y, w, h, sx, sy) => {
    const d = document.createElement('div');
    d.className = cls;
    d.style.cssText = box(x, y, w, h) + `;background-size:${IW / w * 100}% ${IH / h * 100}%;background-position:${sx / (IW - w) * 100}% ${sy / (IH - h) * 100}%`;
    scene.appendChild(d);
    return d;
  };

  const T = {
    screen: ['Chat with Alina & Polly', 'Поболтать с Алиной и Полли', 'Parunāties ar Alīnu un Polliju'],
    title: ['PollyChat 98', 'PollyChat 98', 'PollyChat 98'],
    menu: [['File', 'Edit', 'View', 'Help'], ['Файл', 'Правка', 'Вид', 'Справка'], ['Fails', 'Labot', 'Skats', 'Palīdzība']],
    online: ['Online', 'В сети', 'Tiešsaistē'],
    alina: ['Alina', 'Алина', 'Alīna'], polly: ['Polly', 'Полли', 'Pollija'], you: ['You', 'Ты', 'Tu'],
    stA: ['🎨 painting', '🎨 рисует', '🎨 zīmē'], stP: ['🐦 snacking on crumbs', '🐦 клюёт крошки', '🐦 knābā drupatas'],
    with: ['Chatting with', 'Болтаем с', 'Sarunājamies ar'],
    hiA: ['Hi! I’m Alina. Ask me anything — start typing and I’ll suggest questions, or roll the 🎲.', 'Привет! Это Алина. Спрашивай что угодно — начни печатать, и я подскажу вопросы. Или брось 🎲.', 'Sveiki! Es esmu Alīna. Jautā ko vien vēlies — sāc rakstīt, un es ieteikšu jautājumus. Vai met 🎲.'],
    hiP: ['Coo! Polly here. Same questions, my own answers. Type or roll the 🎲!', 'Курлы! Это Полли. Вопросы те же, ответы — мои. Печатай или бросай 🎲!', 'Kurr! Te Pollija. Jautājumi tie paši, atbildes — manas. Raksti vai met 🎲!'],
    ph: ['Type a question…', 'Напиши вопрос…', 'Uzraksti jautājumu…'],
    send: ['Send', 'Отправить', 'Sūtīt'], dice: ['Random question', 'Случайный вопрос', 'Nejaušs jautājums'],
    typing: ['is typing', 'печатает', 'raksta'],
    try: ['Try:', 'Попробуй:', 'Pamēģini:'],
    noA: ['Hmm, I haven’t written an answer to this one yet. Check back soon! ✍️', 'Хм, на этот вопрос ответ ещё пишется. Загляни попозже! ✍️', 'Hmm, atbilde uz šo vēl top. Ieskaties vēlāk! ✍️'],
    noP: ['Coo… Polly is still thinking about this one. Come back later!', 'Курлы… Полли ещё думает над этим. Приходи попозже!', 'Kurr… Pollija vēl domā par šo. Nāc vēlāk!'],
    miss: ['I don’t have an answer to that yet. Maybe one of these? Or send it to Alina — she’ll answer it herself.', 'На такое ответа пока нет. Может, один из этих? Или отправь вопрос Алине — она ответит сама.', 'Uz to atbildes vēl nav. Varbūt kāds no šiem? Vai nosūti jautājumu Alīnai — viņa atbildēs pati.'],
    own: ['📮 Send as', '📮 Отправить от', '📮 Nosūtīt kā'],
    anon: ['🙈 Send anonymously', '🙈 Отправить анонимно', '🙈 Nosūtīt anonīmi'],
    anonHint: ['Sign in if you want a notification when Alina answers.', 'Войди, если хочешь уведомление, когда Алина ответит.', 'Ienāc, ja gribi paziņojumu, kad Alīna atbildēs.'],
    ownS: ['📮 Ask my own question', '📮 Задать свой вопрос', '📮 Uzdot savu jautājumu'],
    ownOk: ['Sent! 📮 Alina will answer it herself — you’ll get a 🔔 notification, and then your question will appear here for everyone, signed with your nickname.', 'Отправлено! 📮 Алина ответит сама — придёт уведомление 🔔, а потом вопрос появится здесь у всех с твоим ником.', 'Nosūtīts! 📮 Alīna atbildēs pati — saņemsi paziņojumu 🔔, un tad jautājums parādīsies šeit visiem ar tavu segvārdu.'],
    ownAnon: ['Sent anonymously! 🙈 When Alina answers, the question will appear here for everyone — come back later and look for it.', 'Отправлено анонимно! 🙈 Когда Алина ответит, вопрос появится здесь у всех — загляни попозже.', 'Nosūtīts anonīmi! 🙈 Kad Alīna atbildēs, jautājums parādīsies šeit visiem — ieskaties vēlāk.'],
    ownAnonIn: ['Sent anonymously! 🙈 Nobody will see your nickname, but you’ll still get a 🔔 notification when Alina answers.', 'Отправлено анонимно! 🙈 Ник никто не увидит, а уведомление 🔔 об ответе всё равно придёт.', 'Nosūtīts anonīmi! 🙈 Segvārdu neviens neredzēs, bet paziņojums 🔔 par atbildi tik un tā atnāks.'],
    ownErr: { short: ['That’s a bit short for a question — add a few words?', 'Коротковато для вопроса — добавь пару слов?', 'Jautājumam mazliet par īsu — pieliec pāris vārdus?'],
      wait: ['You already have 3 questions waiting for Alina. Let her answer those first!', 'У Алины уже ждут 3 твоих вопроса. Пусть сначала ответит на них!', 'Alīnu jau gaida 3 tavi jautājumi. Lai viņa vispirms atbild uz tiem!'],
      many: ['That’s enough questions for today — come back tomorrow!', 'На сегодня вопросов хватит — приходи завтра!', 'Šodienai jautājumu pietiek — nāc rīt!'],
      busy: ['Too many questions right now — try again in an hour!', 'Сейчас слишком много вопросов — попробуй через час!', 'Pašlaik pārāk daudz jautājumu — mēģini pēc stundas!'],
      fast: ['Whoa, that was fast! Try sending it again.', 'Ого, как быстро! Отправь ещё раз.', 'Oho, cik ātri! Nosūti vēlreiz.'],
      link: ['Please, no links in questions.', 'Без ссылок, пожалуйста.', 'Lūdzu, bez saitēm.'],
      x: ['Couldn’t send it — check the connection and try again.', 'Не получилось отправить — проверь интернет и попробуй ещё раз.', 'Neizdevās nosūtīt — pārbaudi savienojumu un mēģini vēlreiz.'] },
    from: ['📮 asked by', '📮 вопрос прислал(а)', '📮 jautājumu atsūtīja'],
    fromAnon: ['📮 an anonymous question', '📮 анонимный вопрос', '📮 anonīms jautājums'],
    mine: ['📮 My questions to Alina', '📮 Мои вопросы Алине', '📮 Mani jautājumi Alīnai'],
    rwBtn: ['🎉 {n} of {who}’s answers opened — +{b} 🔘!', '🎉 Открыто {n} ответов: {who} — +{b} 🔘!', '🎉 Atvērtas {n} atbildes: {who} — +{b} 🔘!'],
    rwBadge: ['🏅 New badge “{t}”{b}! Look for it in your profile.', '🏅 Новый бейдж «{t}»{b}! Он уже в профиле.', '🏅 Jauna nozīmīte “{t}”{b}! Tā jau ir profilā.'],
    rwItem: ['🎁 The PollyChat 98 laptop (with Milka!) is in your bag — put it in your room!', '🎁 Ноутбук PollyChat 98 (с Милкой!) — в сумке. Поставь его в комнату!', '🎁 PollyChat 98 klēpjdators (ar Milku!) ir tavā somā — noliec to istabā!'],
    rwT: { chatA: ['Knows Alina', 'Знает Алину', 'Pazīst Alīnu'], chatP: ['Knows Polly', 'Знает Полли', 'Pazīst Polliju'], chatAP: ['PollyChat 98 regular', 'Завсегдатай PollyChat 98', 'PollyChat 98 pastāvīgais'] },
    rwNext: ['🎁 next reward:', '🎁 до награды:', '🎁 līdz balvai:'],
    rwDone: ['🏅 all rewards', '🏅 все награды', '🏅 visas balvas'],
    rwGuest: ['Sign in — answers bring buttons, badges and a laptop for your room 🎁', 'Войди — за ответы дают пуговки, бейджи и ноутбук для комнаты 🎁', 'Ienāc — par atbildēm dod pogas, nozīmītes un klēpjdatoru istabai 🎁'],
    mineW: ['⏳ waiting for an answer', '⏳ ждёт ответа', '⏳ gaida atbildi'], mineA: ['🙈 anonymous', '🙈 анонимно', '🙈 anonīmi'], mineOk: ['✅ in the chat', '✅ в чате', '✅ čatā'],
    opened: ['Opened', 'Открыто', 'Atvērts'], of: ['of', 'из', 'no'],
    list: ['📖 My questions', '📖 Мои вопросы', '📖 Mani jautājumi'],
    listT: ['Questions you’ve opened', 'Открытые вопросы', 'Atvērtie jautājumi'],
    left: ['Still hidden in the base:', 'Ещё спрятано в базе:', 'Bāzē vēl paslēpti:'],
    none: ['Nothing yet — ask something!', 'Пока ничего — спроси что-нибудь!', 'Pagaidām nekā — pajautā kaut ko!'],
    back: ['← Back to chat', '← Назад в чат', '← Atpakaļ uz čatu'],
    guest: ['Guest: progress isn’t saved.', 'Гость: прогресс не сохраняется.', 'Viesis: progress netiek saglabāts.'],
    signin: ['Sign in', 'Войти', 'Ienākt'],
    saved: ['✔ Progress saved', '✔ Прогресс сохраняется', '✔ Progress tiek saglabāts'],
    warnT: ['Your progress won’t be saved', 'Прогресс не сохранится', 'Progress netiks saglabāts'],
    warn: ['You’ve opened {n}. Sign in — and they’ll stay with you, and the counter will keep going.', 'Открыто: {n}. Войди — и они останутся с тобой, а счётчик продолжит считать.', 'Atvērti: {n}. Ienāc — un tie paliks ar tevi, un skaitītājs turpinās skaitīt.'],
    qN: [['question', 'questions'], ['вопрос', 'вопроса', 'вопросов'], ['jautājums', 'jautājumi']],
    close: ['Close anyway', 'Всё равно закрыть', 'Tomēr aizvērt'],
  };
  const plural = n => {
    const f = T.qN[LI];
    if (LI === 1) { const a = n % 10, b = n % 100; return n + ' ' + f[a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 1 : 2]; }
    if (LI === 2) return n + ' ' + f[n % 10 === 1 && n % 100 !== 11 ? 0 : 1];
    return n + ' ' + f[n === 1 ? 0 : 1];
  };

  // ── предметы: место на картинке (x, y, w, h в 1024×765), фразы en/ru/lv, действие руки ──
  const HOT = [
    ['cat', 715, 448, 250, 168, 'pet', [
      ['Milka: “Mrrr.” Petting allowed, waking up is not.', 'Милка: «Мррр». Гладить можно, будить — нет.', 'Milka: “Murr.” Glāstīt drīkst, modināt — nē.'],
      ['Milka is guarding the warmest spot in the sun.', 'Милка охраняет самое тёплое место на солнце.', 'Milka sargā siltāko vietiņu saulē.'],
      ['Milka thinks this desk is hers. She’s right.', 'Милка считает, что этот стол — её. И она права.', 'Milka domā, ka šis galds ir viņas. Un viņai taisnība.']]],
    ['brushes', 52, 405, 110, 180, 'paint', [
      ['Pick a brush, any brush!', 'Выбери кисть, любую!', 'Izvēlies otu, jebkuru!'],
      ['Every brush here has its favourite colour.', 'У каждой кисти здесь — своя любимая краска.', 'Katrai otai šeit ir sava mīļākā krāsa.']]],
    ['table', 600, 600, 300, 110, 'paint', [
      ['Brushes taking a little break.', 'Кисти на перерыве.', 'Otas ieturējušas pauzīti.'],
      ['Wash me, then paint with me!', 'Помой меня — и рисуй мной!', 'Nomazgā mani — un zīmē ar mani!']]],
    ['paints', 368, 448, 194, 140, 'paint', [
      ['Twelve little puddles of colour, waiting.', 'Двенадцать маленьких лужиц цвета ждут своей очереди.', 'Divpadsmit mazas krāsu peļķītes gaida savu kārtu.'],
      ['The paint box: tidy on the outside, wild on the inside.', 'Коробка красок: снаружи порядок, внутри — буйство.', 'Krāsu kārba: ārpusē kārtība, iekšpusē — trakums.']]],
    ['jars', 576, 480, 124, 98, 'paint', [
      ['Two jars: one for clean water, one for… history.', 'Две баночки: одна для чистой воды, другая — для… истории.', 'Divas burciņas: viena tīram ūdenim, otra — vēsturei.'],
      ['Never drink from these. Polly checked.', 'Из них не пьют. Полли проверила.', 'No tām nedzer. Pollija pārbaudīja.']]],
    ['dish', 566, 568, 94, 48, null, [
      ['The mixing dish: where new colours are born.', 'Палитра: тут рождаются новые цвета.', 'Palete: šeit dzimst jaunas krāsas.']]],
    ['book', 120, 590, 458, 112, 'paint', [
      ['A sketchbook: one page painted, one page waiting.', 'Скетчбук: одна страница уже нарисована, другая ждёт.', 'Skiču burtnīca: viena lapa uzzīmēta, otra gaida.'],
      ['A blank page isn’t scary when there’s a cat nearby.', 'Чистая страница не страшна, когда рядом кошка.', 'Tukša lapa nebaida, ja blakus ir kaķis.']]],
    ['swatch', 0, 585, 140, 98, null, [
      ['A colour swatch card. Every square is a tiny decision.', 'Карта выкрасок. Каждый квадратик — маленькое решение.', 'Krāsu paraugu kartīte. Katrs kvadrātiņš — mazs lēmums.']]],
    ['mouse', 664, 602, 92, 76, 'mouse', [
      ['Click!', 'Клик!', 'Klikšķ!'],
      ['A purple mouse. Of course it’s purple.', 'Фиолетовая мышка. Конечно, фиолетовая.', 'Violeta pele. Protams, violeta.']]],
    ['pumpkins', 698, 192, 112, 118, null, [
      ['Pumpkins: the official vegetable of this desk.', 'Тыквы — официальный овощ этого стола.', 'Ķirbji — šī galda oficiālais dārzenis.'],
      ['One pumpkin is never enough.', 'Одной тыквы всегда мало.', 'Ar vienu ķirbi vienmēr par maz.']]],
    ['pumpkin', 152, 88, 80, 52, null, [
      ['A pumpkin on top of the drawers. Supervising.', 'Тыква на комоде. Присматривает за порядком.', 'Ķirbis uz kumodes. Pieskata kārtību.']]],
    ['wheel', 318, 148, 80, 80, null, [
      ['The colour wheel: a map for when colours argue.', 'Цветовой круг — карта на случай, когда цвета ссорятся.', 'Krāsu aplis — karte gadījumam, kad krāsas strīdas.']]],
    ['board', 238, 88, 264, 152, null, [
      ['The inspiration board: postcards, notes and colour ideas.', 'Доска вдохновения: открытки, заметки и идеи цветов.', 'Iedvesmas dēlis: pastkartes, piezīmes un krāsu idejas.']]],
    ['bakery', 518, 48, 110, 118, null, [
      ['“Bakery”. Just looking at it makes you want a cinnamon bun.', '«Пекарня». Посмотришь — и хочется булочку с корицей.', '“Maiznīca”. Paskaties — un gribas kanēļmaizīti.']]],
    ['truck', 646, 48, 174, 128, null, [
      ['A tiny autumn picture: a truck full of pumpkins.', 'Маленькая осенняя картинка: грузовичок с тыквами.', 'Mazs rudens attēls: kravas auto ar ķirbjiem.']]],
    ['house', 438, 228, 96, 108, null, [
      ['A little house in autumn. Someone in there is surely drinking cocoa.', 'Домик осенью. Там наверняка кто-то пьёт какао.', 'Mājiņa rudenī. Tur noteikti kāds dzer kakao.']]],
    ['field', 560, 196, 112, 112, null, [
      ['A pumpkin field. You can never have too many pumpkins.', 'Тыквенное поле. Тыкв много не бывает.', 'Ķirbju lauks. Ķirbju nekad nav par daudz.']]],
    ['dolls', 533, 294, 102, 52, null, [
      ['Three tiny friends keeping an eye on the work.', 'Три маленьких друга присматривают за работой.', 'Trīs mazi draugi pieskata darbu.']]],
    ['mug', 676, 292, 68, 58, null, [
      ['The mug with a little red car. The tea is still warm.', 'Кружка с красной машинкой. Чай ещё тёплый.', 'Krūze ar sarkanu mašīnīti. Tēja vēl silta.']]],
    ['lamp', 224, 238, 84, 98, null, [
      ['A tiny room with the lamp on. Cosiness is contagious.', 'Крошечная комната с включённой лампой. Уют заразителен.', 'Sīka istabiņa ar ieslēgtu lampu. Mājīgums ir lipīgs.']]],
    ['drawers', 4, 134, 228, 202, null, [
      ['Little drawers: buttons, washi tape and the occasional secret.', 'Ящички: пуговки, васи-скотч и иногда секреты.', 'Atvilknītes: pogas, vašī lente un reizēm noslēpumi.']]],
    ['books', 0, 368, 56, 132, null, [
      ['Books with bookmarks in all the best places.', 'Книги с закладками на самых интересных местах.', 'Grāmatas ar grāmatzīmēm interesantākajās vietās.']]],
    ['photos', 794, 206, 124, 104, null, [
      ['Little framed pictures, waiting for their spot on the wall.', 'Картинки в рамках ждут своего места на стене.', 'Bildītes rāmīšos gaida savu vietu pie sienas.']]],
    ['window', 960, 0, 64, 470, null, [
      ['Sunlight: the best lamp for painting.', 'Солнце — лучшая лампа для рисования.', 'Saule — labākā lampa zīmēšanai.'],
      ['Outside it’s autumn. Inside it’s cosy.', 'Снаружи осень. Внутри уют.', 'Ārā rudens. Iekšā mājīgi.']]],
  ];

  // ── слои сцены ──
  const cv = document.createElement('canvas');
  cv.className = 'ad-fx';
  cv.width = LW; cv.height = LH;
  scene.appendChild(cv);
  const ctx = cv.getContext('2d');
  piece('ad-breath', 722, 468, 150, 140, 722, 468); // Милка дышит
  piece('ad-lid', 877, 495, 18, 13, 877, 481); // веки — мех над глазом
  piece('ad-lid', 909, 496, 20, 13, 909, 482);

  const screen = document.createElement('button');
  screen.type = 'button';
  screen.className = 'ad-screen';
  screen.style.cssText = box(167, 431, 143, 90);
  screen.innerHTML = `<span class="ad-scr-bar">${tr(T.title)}<i>×</i></span><span class="ad-scr-body"><span class="ad-scr-av"><img src="/images/home/alina.jpg" alt=""><img src="/images/about/polly-ava.png" alt=""></span><b>${esc(tr(T.screen))}</b><span class="ad-scr-cur">▌</span></span>`;
  screen.setAttribute('aria-label', tr(T.screen));
  scene.appendChild(screen);
  const kbd = document.createElement('button');
  kbd.type = 'button';
  kbd.className = 'ad-hot';
  kbd.style.cssText = box(160, 410, 210, 190);
  kbd.setAttribute('aria-label', tr(T.screen));
  scene.insertBefore(kbd, screen);

  const bubble = document.createElement('div');
  bubble.className = 'ad-bubble';
  bubble.setAttribute('role', 'status');
  scene.appendChild(bubble);
  let bubT = 0, lastSay = {};
  const say = (h, el) => {
    const [k, x, y, w, hh, , lines] = h;
    let i = Math.floor(Math.random() * lines.length);
    if (lines.length > 1 && i === lastSay[k]) i = (i + 1) % lines.length;
    lastSay[k] = i;
    bubble.textContent = tr(lines[i]);
    const cx = (x + w / 2) / IW * 100, top = y / IH * 100, below = top < 22;
    bubble.className = 'ad-bubble on' + (below ? ' below' : '');
    bubble.style.left = Math.max(14, Math.min(86, cx)) + '%';
    bubble.style.setProperty('--tail', (cx - Math.max(14, Math.min(86, cx))) + '%');
    bubble.style.top = below ? (y + hh) / IH * 100 + '%' : '';
    bubble.style.bottom = below ? '' : (100 - top) + '%';
    clearTimeout(bubT);
    bubT = setTimeout(() => bubble.classList.remove('on'), 4200);
    el.classList.add('hit');
    setTimeout(() => el.classList.remove('hit'), 400);
  };
  HOT.forEach(h => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ad-hot';
    b.style.cssText = box(h[1], h[2], h[3], h[4]);
    b.setAttribute('aria-label', tr(h[6][0]));
    b.addEventListener('click', () => { say(h, b); if (h[5]) want(h[5]); });
    scene.insertBefore(b, kbd);
  });
  document.addEventListener('click', e => { if (!e.target.closest('.ad-hot, .ad-bubble')) bubble.classList.remove('on'); });

  // ── Милка моргает; во время поглаживания жмурится ──
  const blink = () => {
    if (!root.classList.contains('ad-purr')) { root.classList.add('ad-blink'); setTimeout(() => root.classList.remove('ad-blink'), 170); }
    setTimeout(blink, rnd(2600, 6500));
  };
  setTimeout(blink, 2000);

  // ── рука: пиксели считаются по форме (ладонь, пальцы, рукав), поворот любой ──
  const C = { skin: [242, 194, 160], shade: [211, 149, 115], line: [74, 42, 30], sleeve: [108, 79, 158], rib: [91, 65, 137], cuff: [138, 108, 192], wood: [160, 82, 45], ferr: [200, 200, 212] };
  const SKIN = 1, SHADE = 2, SLEEVE = 3, RIB = 4, CUFF = 5, WOOD = 6, FERR = 7, TIP = 8;
  const HS = 2; // масштаб кисти руки
  const capd = (u, v, au, av, bu, bv) => {
    const du = bu - au, dv = bv - av, l = du * du + dv * dv;
    let t = ((u - au) * du + (v - av) * dv) / l;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const x = au + du * t - u, y = av + dv * t - v;
    return x * x + y * y;
  };
  const FING = { open: [11.5, 12.6, 12.1, 10.4], point: [14.2, 8.6, 8.3, 7.8], hold: [9.2, 9.5, 9.2, 8.4] };
  const THUMB = { open: [-3.6, 2, -6.7, 6.3], point: [-3.6, 2.5, -5, 6.6], hold: [-3.4, 2, -1.6, 7.6] };
  function handMat(u, v, pose, brush) {
    const pu = u / 4.4, pv = (v - 4) / 4.2;
    let m = 0;
    if (pu * pu * pu * pu + pv * pv * pv * pv <= 1) m = SKIN;
    else {
      const L = FING[pose];
      for (let k = 0; k < 4 && !m; k++) { const fu = -2.95 + k * 1.97; if (v > 5 && capd(u, v, fu, 6, fu, L[k]) < 1.1) m = SKIN; }
      const th = THUMB[pose];
      if (!m && capd(u, v, th[0], th[1], th[2], th[3]) < 1.8) m = SKIN;
    }
    if (m) {
      if (v > 8.6 && (Math.abs(u + 1.97) < .45 || Math.abs(u) < .45 || Math.abs(u - 1.97) < .45)) m = SHADE; // щели между пальцами
      return m;
    }
    if (brush && capd(u, v, .9, -1, -2.3, 17.6) < .3) {
      const t = (v + 1) / 18.6;
      return t > .88 ? TIP : t > .74 ? FERR : WOOD;
    }
    return 0;
  }
  const hcv = document.createElement('canvas'), hctx = hcv.getContext('2d');
  function drawHand(H, tip) {
    if (H.y > LH + 30) return;
    const a = H.ang, fx = Math.sin(a), fy = -Math.cos(a), rx = Math.cos(a), ry = Math.sin(a);
    const sh = H.sh, ex = H.x - fx * 4, ey = H.y - fy * 4, R = 9.5;
    const x0 = Math.max(0, Math.floor(Math.min(sh.x, H.x) - 40)), x1 = Math.min(LW, Math.ceil(Math.max(sh.x, H.x) + 40));
    const y0 = Math.max(0, Math.floor(Math.min(sh.y, H.y) - 40)), y1 = Math.min(LH, Math.ceil(Math.max(sh.y, H.y) + 40));
    const bw = x1 - x0, bh = y1 - y0;
    if (bw <= 0 || bh <= 0) return;
    const m = new Uint8Array(bw * bh);
    const sdx = ex - sh.x, sdy = ey - sh.y, sl2 = sdx * sdx + sdy * sdy, sl = Math.sqrt(sl2);
    for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
      const px = x0 + i + .5, py = y0 + j + .5, dx = px - H.x, dy = py - H.y;
      let u = (dx * rx + dy * ry) / HS;
      const v = (dx * fx + dy * fy) / HS;
      if (H.mir) u = -u;
      let mat = handMat(u, v, H.pose, H.brush);
      if (!mat) {
        let t = ((px - sh.x) * sdx + (py - sh.y) * sdy) / sl2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const qx = sh.x + sdx * t - px, qy = sh.y + sdy * t - py;
        if (qx * qx + qy * qy < R * R) { const al = (1 - t) * sl; mat = al < 4.5 ? CUFF : (Math.floor(al / 3) % 2 ? RIB : SLEEVE); }
      }
      m[j * bw + i] = mat;
    }
    hcv.width = bw; hcv.height = bh;
    const img = hctx.createImageData(bw, bh), d = img.data;
    const at = (i, j) => (i < 0 || j < 0 || i >= bw || j >= bh) ? 0 : m[j * bw + i];
    const isSkin = k => k === SKIN || k === SHADE;
    for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
      const k = m[j * bw + i];
      let c = null;
      if (!k) {
        if (at(i - 1, j) || at(i + 1, j) || at(i, j - 1) || at(i, j + 1)) c = C.line;
      } else if (isSkin(k)) {
        const n = [at(i - 1, j), at(i + 1, j), at(i, j - 1), at(i, j + 1)];
        if (n.some(x => x >= SLEEVE && x <= CUFF)) c = C.line;
        else c = (k === SHADE || !isSkin(at(H.mir ? i + 1 : i - 1, j + 1))) ? C.shade : C.skin;
      } else c = k === SLEEVE ? C.sleeve : k === RIB ? C.rib : k === CUFF ? C.cuff : k === WOOD ? C.wood : k === FERR ? C.ferr : tip;
      if (c) { const o = (j * bw + i) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255; }
    }
    hctx.putImageData(img, 0, 0);
    ctx.drawImage(hcv, x0, y0);
  }

  // ── действия руки: кадры {t: [x, y] — куда кончиком, r — длина от запястья до кончика, p — поза, d — мс, on — по приходу} ──
  const SH_L = { x: 70, y: 262 }, SH_R = { x: 190, y: 262 };
  const mkHand = (sh, mir) => ({ sh, mir, x: sh.x, y: LH + 50, ang: 0, pose: 'open', brush: false });
  const HL = mkHand(SH_L, true), HR = mkHand(SH_R, false);
  const RO = 7 * HS, RP = 14 * HS, RB = 17.6 * HS, RT = 11 * HS; // ладонь, указательный, кончик кисти, кончики пальцев
  const PAINT = [[200, 62, 44], [224, 134, 47], [233, 194, 74], [110, 157, 74], [63, 127, 174], [122, 79, 160], [214, 96, 140]];
  const WATER = [150, 190, 210];
  let tipC = PAINT[0];
  const PAGE = { x0: 35, x1: 80, y0: 152, y1: 171 };
  const scribble = () => {
    const f = [], cx = rnd(PAGE.x0 + 8, PAGE.x1 - 8), cy = rnd(PAGE.y0 + 5, PAGE.y1 - 5), kind = Math.floor(Math.random() * 3);
    for (let i = 0; i < 7; i++) {
      const p = kind === 0 ? [cx - 9 + i * 3, cy + (i % 2 ? -2 : 2)] // волна
        : kind === 1 ? [cx + Math.cos(i * 1.05) * 5, cy + Math.sin(i * 1.05) * 3.5] // круг
          : [cx + rnd(-8, 8), cy + rnd(-4, 4)]; // мазки
      f.push({ t: p, r: RB, d: 320, paint: true });
    }
    return f;
  };
  const ACTS = {
    paint: () => {
      const pal = rnd(100, 132);
      return { h: HR, f: [
        { t: [206, 162], r: RT, p: 'open', d: 1000 },
        { d: 250, p: 'hold', brush: true, on: () => { tipC = PAINT[3]; } },
        { t: [160, 128], r: RB, d: 900, on: () => { tipC = WATER; } },
        { t: [163, 131], r: RB, d: 220 }, { t: [158, 129], r: RB, d: 220 },
        { t: [pal, 121], r: RB, d: 800, on: () => { tipC = pick(PAINT); } },
        { t: [pal + 2, 123], r: RB, d: 200 }, { t: [pal - 1, 120], r: RB, d: 200 },
        ...scribble(),
        ...(Math.random() < .5 ? scribble() : []),
        { t: [206, 160], r: RB, d: 1000 },
        { d: 220, p: 'open', brush: false },
        { off: true, d: 800 },
      ] };
    },
    type: () => {
      const f = [{ t: [62, 141], r: RP, p: 'point', d: 900 }];
      for (let i = 0; i < 6; i++) {
        const x = rnd(50, 80), y = rnd(137, 146);
        f.push({ t: [x, y - 2], r: RP, d: 180 }, { t: [x, y], r: RP, d: 120, on: tap });
      }
      f.push({ d: 300, on: () => screen.classList.add('ad-msg') }, { off: true, d: 800 });
      return { h: HL, f };
    },
    mouse: () => ({ h: HR, f: [
      { t: [176, 158], r: RO, p: 'open', d: 900 },
      { t: [178, 156], r: RO, d: 350 }, { t: [175, 160], r: RO, d: 350 },
      { d: 150, on: tap }, { d: 250, on: tap },
      { off: true, d: 800 },
    ] }),
    pet: () => {
      const f = [{ t: [193, 137], r: RO, p: 'open', d: 1000, on: () => root.classList.add('ad-purr') }];
      for (let i = 0; i < 3; i++) f.push({ t: [211, 133], r: RO, d: 700, on: heart }, { t: [193, 137], r: RO, d: 700 });
      f.push({ d: 200, on: () => setTimeout(() => root.classList.remove('ad-purr'), 900) }, { off: true, d: 900 });
      return { h: HR, f };
    },
  };
  const tap = () => { screen.classList.remove('ad-blip'); void screen.offsetWidth; screen.classList.add('ad-blip'); };

  let act = null, wanted = null, nextAt = performance.now() + (calm ? Infinity : 1800), lastAct = '';
  // клик по предмету: рука заканчивает своё быстро (кладёт кисть, уходит) и делает то, что попросили
  const want = k => {
    if (!act) return start(k);
    if (act.k === k) return;
    wanted = k;
    if (!act.quit) { act.quit = true; act.f.splice(act.i + 1, act.f.length, { d: 150, p: 'open', brush: false, on: () => root.classList.remove('ad-purr') }, { off: true, d: 500 }); }
  };
  function start(k) {
    lastAct = k;
    root.classList.remove('ad-purr');
    const a = ACTS[k]();
    act = { k, h: a.h, f: a.f, i: -1, t0: 0, from: null, to: null };
    next(performance.now());
  }
  function next(now) {
    act.i++;
    const f = act.f[act.i], H = act.h;
    if (!f) {
      act = null;
      if (wanted) { const k = wanted; wanted = null; start(k); }
      else nextAt = calm ? Infinity : now + rnd(2500, 6500);
      return;
    }
    act.t0 = now;
    act.from = { x: H.x, y: H.y };
    if (f.p) H.pose = f.p;
    if (f.brush != null) H.brush = f.brush;
    if (f.off) act.to = { x: H.x + (H.sh.x - H.x) * .35, y: LH + 50 };
    else if (f.t) {
      const dx = f.t[0] - H.sh.x, dy = f.t[1] - H.sh.y, l = Math.hypot(dx, dy);
      act.to = { x: f.t[0] - dx / l * f.r, y: f.t[1] - dy / l * f.r };
      if (act.from.y > LH + 30) act.from = { x: act.to.x + (H.sh.x - act.to.x) * .4, y: LH + 50 }; // из-за края — по направлению руки
    } else act.to = act.from;
  }
  const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const tipOf = H => { const r = RB; return [H.x + Math.sin(H.ang) * r, H.y - Math.cos(H.ang) * r]; };
  const aim = H => { H.ang = Math.atan2(H.x - H.sh.x, -(H.y - H.sh.y)); };

  // ── мелочи: краска на странице, пар, пылинки, свет лампы, сердечки ──
  const dabs = [], steam = [], hearts = [], motes = [];
  for (let i = 0; i < 16; i++) motes.push({ x: rnd(205, 256), y: rnd(0, 150), vx: rnd(-.6, .6), vy: rnd(-.5, .3), ph: rnd(0, 6) });
  const heart = () => hearts.push({ x: rnd(218, 230), y: 112, t: 0 });
  const HEART = ['.x.x.', 'xxxxx', '.xxx.', '..x..'];
  let steamAt = 0, lastTip = null;
  const px = (x, y, c, a) => { ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); };

  let last = 0, run = false, seen = false;
  function frame(now) {
    if (!run) return;
    requestAnimationFrame(frame);
    if (now - last < 40) return;
    const dt = Math.min(200, now - last) / 1000;
    last = now;
    if (!act && now > nextAt) {
      const ks = ['paint', 'paint', 'pet', 'pet', 'type', 'mouse'].filter(k => k !== lastAct);
      start(pick(ks));
    }
    if (act) {
      const f = act.f[act.i], H = act.h, k = Math.min(1, (now - act.t0) / f.d), e = ease(k);
      H.x = act.from.x + (act.to.x - act.from.x) * e;
      H.y = act.from.y + (act.to.y - act.from.y) * e;
      aim(H);
      if (f.paint && H.brush) {
        const [tx, ty] = tipOf(H), p = [Math.round(tx), Math.round(ty)];
        if (lastTip) {
          const n = Math.max(Math.abs(p[0] - lastTip[0]), Math.abs(p[1] - lastTip[1]));
          for (let s = 1; s <= n; s++) {
            const x = Math.round(lastTip[0] + (p[0] - lastTip[0]) * s / n), y = Math.round(lastTip[1] + (p[1] - lastTip[1]) * s / n);
            if (x >= PAGE.x0 && x < PAGE.x1 && y >= PAGE.y0 && y <= PAGE.y1) dabs.push({ x, y, c: tipC, t: now }, { x: x + 1, y, c: tipC, t: now });
          }
        }
        lastTip = p;
        if (dabs.length > 1200) dabs.splice(0, dabs.length - 1200);
      } else lastTip = null;
      if (k >= 1) { f.on && f.on(); next(now); }
    }
    ctx.clearRect(0, 0, LW, LH);
    // краска сохнет и бледнеет за ~40 с
    for (let i = dabs.length - 1; i >= 0; i--) {
      const age = (now - dabs[i].t) / 1000;
      if (age > 45) { dabs.splice(i, 1); continue; }
      px(dabs[i].x, dabs[i].y, dabs[i].c, age < 25 ? .9 : .9 * (45 - age) / 20);
    }
    // свет лампы в маленькой картинке
    const g = .18 + .1 * Math.sin(now / 700) + (Math.random() < .03 ? .12 : 0);
    for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (Math.abs(x) + Math.abs(y) <= 3) px(66 + x, 67 + y, [255, 214, 120], g * (1 - (Math.abs(x) + Math.abs(y)) / 4));
    // пар над кружкой
    if (now > steamAt) { steam.push({ x: rnd(175, 180), y: 73, t: 0, s: rnd(0, 6) }); steamAt = now + rnd(350, 650); }
    for (let i = steam.length - 1; i >= 0; i--) {
      const p = steam[i];
      p.t += dt; p.y -= dt * 4;
      if (p.t > 2.6) { steam.splice(i, 1); continue; }
      px(p.x + Math.sin(p.t * 2.2 + p.s) * 1.2, p.y, [255, 255, 255], .45 * (1 - p.t / 2.6));
    }
    // пылинки в солнечном луче
    if (!calm) motes.forEach(m => {
      m.x += m.vx * dt * 2; m.y += m.vy * dt * 2; m.ph += dt;
      if (m.x < 200 || m.x > 256 || m.y < 0 || m.y > 150) { m.x = rnd(205, 256); m.y = rnd(10, 150); }
      px(m.x, m.y, [255, 242, 196], .25 + .25 * Math.sin(m.ph * 1.7));
    });
    // сердечки над Милкой
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.t += dt;
      if (h.t > 1.8) { hearts.splice(i, 1); continue; }
      HEART.forEach((r, y) => [...r].forEach((c, x) => { if (c === 'x') px(h.x + x, h.y - h.t * 9 + y, [232, 84, 107], 1 - h.t / 1.8); }));
    }
    drawHand(HL, tipC);
    drawHand(HR, tipC);
  }
  const setRun = on => { if (on && !run) { run = true; last = performance.now(); requestAnimationFrame(frame); } else if (!on) run = false; };
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { seen = es[0].isIntersecting; setRun(seen && !document.hidden); }).observe(scene);
  else { seen = true; setRun(true); }
  document.addEventListener('visibilitychange', () => setRun(seen && !document.hidden));

  // ══════════════ чат ══════════════
  let Q = null, qLoad = null;
  // база (site/assets/about-chat.json) + вопросы посетителей, на которые ответила Алина (/api/about-chat/extra, с ником автора)
  const loadQ = () => qLoad || (qLoad = Promise.all([
    fetch('/assets/about-chat.json').then(r => r.json()),
    fetch('/api/about-chat/extra').then(r => r.ok ? r.json() : { questions: [] }).catch(() => ({ questions: [] })),
  ]).then(([d, x]) => { Q = d.questions.concat((x.questions || []).filter(q => q.q && (q.a || q.p))); return Q; }).catch(() => { qLoad = null; return []; }));
  const SK = 'pp-achat';
  const guestGet = () => { try { return JSON.parse(sessionStorage.getItem(SK)) || []; } catch (e) { return []; } };
  const guestSet = a => { try { sessionStorage.setItem(SK, JSON.stringify(a)); } catch (e) { /* без хранилища — только в памяти */ } };
  let opened = new Set(guestGet()), user = false, nick = '', asks = [], srvLoad = null, full = 100, cnt = null;
  // награды с сервера (worker/about-chat.js chatRewards): строка в чате и тост
  const rewards = got => (got || []).forEach(g => {
    const text = g.t === 'btn' ? tr(T.rwBtn).replace('{n}', g.s).replace('{who}', name(g.w)).replace('{b}', g.n)
      : g.t === 'badge' ? tr(T.rwBadge).replace('{t}', tr(T.rwT[g.k] || T.rwT.chatAP)).replace('{b}', g.n ? ' · +' + g.n + ' 🔘' : '') : tr(T.rwItem);
    if (win) { logs[who].push({ me: false, sys: true, text, t: clock() }); if (win.classList.contains('on')) render(); }
    if (window.PPToast) window.PPToast(text, { ms: 5000 });
  });
  const score = d => { if (d && d.cnt) { cnt = d.cnt; full = d.full || 100; } };
  const syncSrv = () => srvLoad || (srvLoad = fetch('/api/about-chat', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(async d => {
    if (!d || !d.user) return;
    user = true;
    nick = d.nick || '';
    asks = d.asks || [];
    d.opened.forEach(k => opened.add(k));
    score(d); rewards(d.got);
    const g = guestGet().filter(k => !d.opened.includes(k));
    if (g.length) {
      const r = await fetch('/api/about-chat', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ add: g }) }).catch(() => null);
      if (r && r.ok) guestSet([]);
    } else guestSet([]);
  }).catch(() => null));
  const markOpen = key => {
    if (opened.has(key)) return;
    opened.add(key);
    if (user) {
      fetch('/api/about-chat', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ add: [key] }) })
        .then(r => { if (!r.ok) throw 0; return r.json(); }).then(d => { score(d); rewards(d.got); if (win) counter(); }).catch(() => guestSet([...new Set([...guestGet(), key])]));
    } else guestSet([...opened]);
  };
  const guestCount = () => user ? 0 : [...opened].length;

  const norm = s => s.toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  const qText = q => q.q[LG] || q.q.en || q.q.ru;
  const ansOf = (q, who) => { const a = q[who === 'a' ? 'a' : 'p'] || {}; return a[LG] || a.en || a.ru || ''; };
  const hasAns = (q, who) => !!ansOf(q, who);
  // всего в базе у собеседника — вопросы с его ответом (пока ответов нет — все вопросы)
  const total = w => !Q ? 0 : (Q.filter(q => hasAns(q, w)).length || Q.length);
  function match(text) {
    const toks = norm(text).split(' ').filter(t => t.length > 1);
    if (!toks.length) return [];
    return Q.map(q => {
      const n = norm(qText(q)), ws = n.split(' ');
      let s = 0, all = true;
      toks.forEach(t => { if (ws.some(w => w.startsWith(t))) s += 2; else if (n.includes(t)) s += 1; else all = false; });
      return { q, s, all };
    }).filter(x => x.s > 0).sort((a, b) => (b.all - a.all) || (b.s - a.s)).slice(0, 6);
  }

  let win = null, who = 'a', logs = { a: [], p: [] }, busy = false;
  const name = w => tr(w === 'a' ? T.alina : T.polly);
  const ava = w => w === 'a' ? '/images/home/alina.jpg' : '/images/about/polly-ava.png';
  const clock = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  function build() {
    win = document.createElement('div');
    win.className = 'ad-chat';
    win.innerHTML = `<div class="ad-win" role="dialog" aria-modal="true" aria-label="${esc(tr(T.screen))}">
      <div class="ad-tbar"><span>💬 ${tr(T.title)}</span><span class="ad-tbtn"><i>_</i><i>□</i><button type="button" class="ad-x" aria-label="×">×</button></span></div>
      <div class="ad-menu">${tr(T.menu).map(m => `<span><u>${esc(m[0])}</u>${esc(m.slice(1))}</span>`).join('')}</div>
      <div class="ad-body">
        <aside class="ad-side">
          <div class="ad-grp">▾ ${tr(T.online)} (2)</div>
          <button type="button" class="ad-who" data-w="a"><img src="${ava('a')}" alt=""><span><b>${tr(T.alina)}</b><i>${tr(T.stA)}</i></span></button>
          <button type="button" class="ad-who" data-w="p"><img src="${ava('p')}" alt=""><span><b>${tr(T.polly)}</b><i>${tr(T.stP)}</i></span></button>
          <button type="button" class="ad-cnt"></button>
        </aside>
        <div class="ad-talk">
          <div class="ad-head"></div>
          <div class="ad-log" aria-live="polite"></div>
          <div class="ad-list" hidden></div>
          <div class="ad-sug" role="listbox"></div>
          <form class="ad-form" autocomplete="off"><input type="text" maxlength="160" placeholder="${esc(tr(T.ph))}" aria-label="${esc(tr(T.ph))}"><button type="button" class="ad-dice" title="${esc(tr(T.dice))}" aria-label="${esc(tr(T.dice))}">🎲</button><button type="submit" class="ad-send">${tr(T.send)}</button></form>
        </div>
      </div>
      <div class="ad-stat"><span class="ad-typing"></span><span class="ad-save"></span></div>
      <div class="ad-warn" hidden><div class="ad-wbox"><div class="ad-tbar"><span>⚠ ${tr(T.warnT)}</span></div><p></p><div class="ad-wbtn"><button type="button" class="ad-b ad-in">${tr(T.signin)}</button><button type="button" class="ad-b ad-anyway">${tr(T.close)}</button></div></div></div>
    </div>`;
    document.body.appendChild(win);
    const $ = s => win.querySelector(s);
    win.addEventListener('click', e => { if (e.target === win) tryClose(); });
    $('.ad-x').onclick = tryClose;
    win.querySelectorAll('.ad-who').forEach(b => b.onclick = () => setWho(b.dataset.w));
    $('.ad-cnt').onclick = () => showList(!$('.ad-list').hidden ? false : true);
    $('.ad-dice').onclick = dice;
    $('.ad-in').onclick = () => { if (window.PPAccount) window.PPAccount.openSignIn(); else location.href = '/bird/'; };
    $('.ad-anyway').onclick = () => close(true);
    const inp = $('.ad-form input');
    inp.addEventListener('input', () => suggest(inp.value));
    inp.addEventListener('focus', () => suggest(inp.value));
    inp.addEventListener('keydown', e => {
      const items = [...win.querySelectorAll('.ad-sug button')];
      let i = items.findIndex(b => b.classList.contains('on'));
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) return;
        i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
        items.forEach((b, j) => b.classList.toggle('on', j === i));
      } else if (e.key === 'Enter' && i >= 0) { e.preventDefault(); items[i].click(); }
    });
    $('.ad-form').onsubmit = e => {
      e.preventDefault();
      const t = inp.value.trim();
      if (!t || busy) return;
      const m = match(t);
      if (m.length && m[0].all) ask(m[0].q);
      else free(t);
    };
    win.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); if (!$('.ad-warn').hidden) $('.ad-warn').hidden = true; else tryClose(); } });
  }
  const $w = s => win.querySelector(s);

  let openedAt = Date.now();
  function open() {
    if (!win) { build(); openedAt = Date.now(); }
    win.classList.add('on');
    document.documentElement.classList.add('ad-lock');
    Promise.all([loadQ(), syncSrv()]).then(() => { setWho(who); });
    setWho(who);
    setTimeout(() => { const i = $w('.ad-form input'); if (i && matchMedia('(min-width: 700px)').matches) i.focus(); }, 60);
  }
  function close(force) {
    if (!win) return;
    win.classList.remove('on');
    $w('.ad-warn').hidden = true;
    document.documentElement.classList.remove('ad-lock');
    if (force !== 'keep') screen.focus({ preventScroll: true });
  }
  function tryClose() {
    const n = guestCount();
    if (!user && n > 0) {
      $w('.ad-warn p').textContent = tr(T.warn).replace('{n}', plural(n));
      $w('.ad-warn').hidden = false;
      $w('.ad-in').focus();
      return;
    }
    close();
  }

  function setWho(w) {
    who = w;
    win.querySelectorAll('.ad-who').forEach(b => b.classList.toggle('on', b.dataset.w === w));
    $w('.ad-head').innerHTML = `<img src="${ava(w)}" alt=""> ${tr(T.with)} <b>${name(w)}</b> <span class="ad-dot"></span>`;
    if (!logs[w].length) logs[w].push({ me: false, text: tr(w === 'a' ? T.hiA : T.hiP), t: clock() });
    showList(false);
    render();
    counter();
  }
  function render() {
    const log = $w('.ad-log');
    log.innerHTML = logs[who].map(m => m.sys ? `<div class="ad-m ad-sys">${esc(m.text)}</div>` : `<div class="ad-m${m.me ? ' me' : ''}"><b>${esc(m.me ? tr(T.you) : name(who))}</b> <time>(${m.t})</time>:${m.by ? `<div class="ad-by">${m.by === '-' ? tr(T.fromAnon) : `${tr(T.from)} <b>@${esc(m.by)}</b>`}</div>` : ''}<div class="ad-mt">${esc(m.text).replace(/\n/g, '<br>')}</div>${m.own ? `<div class="ad-msug">${user && nick ? `<button type="button" class="ad-own" data-own="${esc(m.own)}">${tr(T.own)} @${esc(nick)}</button>` : ''}<button type="button" class="ad-own" data-own="${esc(m.own)}" data-anon="1">${tr(T.anon)}</button>${user && nick ? '' : `<small class="ad-hintin">${tr(T.anonHint)} <button type="button" class="ad-link" data-in="1">${tr(T.signin)}</button></small>`}</div>` : ''}${m.sug ? `<div class="ad-msug">${m.sug.map(id => { const q = Q.find(x => x.id === id); return q ? `<button type="button" data-q="${id}">${esc(qText(q))}</button>` : ''; }).join('')}</div>` : ''}</div>`).join('');
    log.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { const q = Q.find(x => x.id === b.dataset.q); if (q && !busy) ask(q); });
    log.querySelectorAll('[data-own]').forEach(b => b.onclick = () => { if (!busy) { b.parentNode.querySelectorAll('[data-own]').forEach(x => x.disabled = true); sendOwn(b.dataset.own, !!b.dataset.anon); } });
    log.querySelectorAll('[data-in]').forEach(b => b.onclick = () => window.PPAccount && window.PPAccount.openSignIn());
    log.scrollTop = log.scrollHeight;
  }
  function counter() {
    const c = w => Q ? Q.filter(q => opened.has(w + ':' + q.id)).length : 0;
    const nx = w => { const n = cnt ? cnt[w] : c(w), st = [.25, .5, .75, 1].map(f => Math.round(full * f)).find(x => n < x); return st ? st - n : 0; };
    const nxt = !user ? `<small class="ad-rw">${tr(T.rwGuest)}</small>` : `<small class="ad-rw">${nx('a') || nx('p') ? `${tr(T.rwNext)} ${tr(T.alina)} ${nx('a') ? '+' + nx('a') : '✓'} · ${tr(T.polly)} ${nx('p') ? '+' + nx('p') : '✓'}` : tr(T.rwDone)}</small>`;
    $w('.ad-cnt').innerHTML = `<b>${tr(T.list)}</b><span>${tr(T.alina)}: ${c('a')} / ${total('a')}</span><span>${tr(T.polly)}: ${c('p')} / ${total('p')}</span>${nxt}`;
    $w('.ad-save').innerHTML = user ? tr(T.saved) : `⚠ ${tr(T.guest)} <button type="button" class="ad-link">${tr(T.signin)}</button>`;
    const l = $w('.ad-save .ad-link');
    if (l) l.onclick = () => window.PPAccount && window.PPAccount.openSignIn();
  }
  function showList(on) {
    const L = $w('.ad-list');
    L.hidden = !on;
    $w('.ad-log').hidden = on;
    if (!on || !Q) return;
    const got = Q.filter(q => opened.has('a:' + q.id) || opened.has('p:' + q.id));
    const left = Math.max(0, total(who) - Q.filter(q => opened.has(who + ':' + q.id)).length);
    L.innerHTML = `<div class="ad-lhead"><b>${tr(T.listT)}</b><button type="button" class="ad-b ad-back">${tr(T.back)}</button></div>
      ${got.length ? `<ol>${got.map(q => `<li><button type="button" data-q="${q.id}">${esc(qText(q))}</button>${opened.has('a:' + q.id) ? `<img src="${ava('a')}" alt="${esc(tr(T.alina))}" title="${esc(tr(T.alina))}">` : ''}${opened.has('p:' + q.id) ? `<img src="${ava('p')}" alt="${esc(tr(T.polly))}" title="${esc(tr(T.polly))}">` : ''}</li>`).join('')}</ol>` : `<p>${tr(T.none)}</p>`}
      <p class="ad-left">${tr(T.left)} <b>${plural(left)}</b> (${name(who)})</p>
      ${asks.length ? `<b>${tr(T.mine)}</b><ul class="ad-mine">${asks.map(a => `<li>${esc(a.text)} <small>${a.status === 'ok' ? tr(T.mineOk) : a.status === 'new' ? tr(T.mineW) : ''}${a.anon ? ' · ' + tr(T.mineA) : ''}</small></li>`).join('')}</ul>` : ''}`;
    L.querySelector('.ad-back').onclick = () => showList(false);
    L.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { const q = Q.find(x => x.id === b.dataset.q); showList(false); if (q && !busy) ask(q); });
  }
  function suggest(text) {
    const box = $w('.ad-sug');
    if (!Q) { box.innerHTML = ''; return; }
    let list, head = '';
    if (text.trim()) list = match(text).map(x => x.q);
    else {
      list = Q.filter(q => !opened.has(who + ':' + q.id)).sort(() => Math.random() - .5).slice(0, 4);
      head = `<span>${tr(T.try)}</span>`;
    }
    const own = text.trim().length >= 5 ? `<button type="button" role="option" class="ad-own" data-own="1">${tr(T.ownS)}: «${esc(text.trim().slice(0, 60))}»</button>` : '';
    box.innerHTML = list.length || own ? head + own + list.map(q => `<button type="button" role="option" data-q="${q.id}"${opened.has(who + ':' + q.id) ? ' class="seen"' : ''}>${esc(qText(q))}</button>`).join('') : '';
    box.querySelectorAll('button').forEach(b => b.onmousedown = e => e.preventDefault());
    const ob = box.querySelector('[data-own]');
    if (ob) ob.onclick = () => { if (!busy) free(text.trim()); };
    box.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { const q = Q.find(x => x.id === b.dataset.q); if (q && !busy) ask(q); });
  }
  function reply(text, sug, then, extra) {
    busy = true;
    const w = who;
    const ty = $w('.ad-typing');
    ty.innerHTML = `✎ ${esc(name(w))} ${tr(T.typing)}<span class="ad-dots"><i>.</i><i>.</i><i>.</i></span>`;
    setTimeout(() => {
      busy = false;
      ty.textContent = '';
      logs[w].push({ me: false, text, sug, t: clock(), ...extra });
      if (then) then();
      if (who === w) { render(); counter(); }
    }, Math.min(2200, 600 + text.length * 12));
  }
  function sent(text) {
    const inp = $w('.ad-form input');
    inp.value = '';
    $w('.ad-sug').innerHTML = '';
    logs[who].push({ me: true, text, t: clock() });
    showList(false);
    render();
  }
  function ask(q) {
    sent(qText(q));
    const w = who, a = ansOf(q, w);
    if (!a) reply(tr(w === 'a' ? T.noA : T.noP));
    else reply(a, null, () => markOpen(w + ':' + q.id), /^u/.test(q.id) ? { by: q.nick || '-' } : null);
  }
  function free(text) {
    sent(text);
    const m = match(text).map(x => x.q.id);
    const pool = Q.filter(q => !opened.has(who + ':' + q.id) && !m.includes(q.id)).sort(() => Math.random() - .5);
    reply(tr(T.miss), [...m, ...pool.map(q => q.id)].slice(0, 3), null, { own: text });
  }
  // свой вопрос → кабинет Алины (worker/about-chat.js); гостю или птичке без ника — войти
  // anon — без ника (гостю — всегда анонимно); ms — сколько открыт чат (защита от ботов)
  async function sendOwn(text, anon) {
    await syncSrv();
    const named = user && nick && !anon;
    let r = null, d = {};
    try { r = await fetch('/api/about-chat/ask', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text, lang: LG, anon: !named, ms: Date.now() - openedAt }) }); d = await r.json().catch(() => ({})); } catch (e) { r = null; }
    if (r && r.ok) {
      if (user && !d.dup) asks.unshift({ id: d.id, text, status: 'new', anon: !named });
      reply(tr(named ? T.ownOk : user && nick ? T.ownAnonIn : T.ownAnon));
    } else reply(tr(T.ownErr[d.error] || T.ownErr.x));
  }
  function dice() {
    if (!Q || busy) return;
    const b = $w('.ad-dice');
    b.classList.remove('roll'); void b.offsetWidth; b.classList.add('roll');
    const fresh = Q.filter(q => !opened.has(who + ':' + q.id) && hasAns(q, who));
    const pool = fresh.length ? fresh : Q.filter(q => !opened.has(who + ':' + q.id));
    ask(pick(pool.length ? pool : Q));
  }

  screen.addEventListener('click', open);
  kbd.addEventListener('click', open);
  const btn = root.querySelector('.ad-open');
  if (btn) btn.addEventListener('click', open);
  if (location.hash === '#chat') open();
  addEventListener('hashchange', () => { if (location.hash === '#chat') open(); }); // ссылка из письма, когда страница уже открыта
})();
