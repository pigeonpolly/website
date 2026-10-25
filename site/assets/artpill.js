// «Art-Pill by Polly» (/art-pill/, docs/artpill.md): версии таблетки, «почему это не просто скилл»,
// скетчбук Claude (artpill-claude.js), скетчбуки ИИ посетителей и отзывы (worker/artpill.js). Тексты en / ru / lv рядом.
(() => {
  const box = document.getElementById('ap');
  if (!box) return;
  const lang = { ru: 'ru', lv: 'lv' }[document.documentElement.lang] || 'en', L = { en: 0, ru: 1, lv: 2 }[lang];
  const C = window.PP_ARTPILL_CLAUDE;
  // версии: новая — первой; файл лежит в site/files/artpill/
  const VERSIONS = [
    { v: '0.2', date: '2026-10-25', file: '/files/artpill/ArtPill-v0.2.md',
      what: ['Any materials, from pencil to oil and pixels. Three drafts for every drawing, then the AI picks the one with meaning, an idea and its own style. How to build an image: cut, combine sources, borrow and add one stranger (from Alina’s book Urban Sketching: Digital Traveler). 13 exercises. The style grows and changes, but 1–3 roots found in the first sketchbook stay forever.', 'Любые материалы — от карандаша до масла и пикселей. Три наброска на каждый рисунок, потом ИИ выбирает тот, в котором есть смысл, идея и его стиль. Как строить образ: убрать лишнее, объединить источники, взять из другого и добавить одного «чужака» (из книги Алины Urban Sketching: Digital Traveler). 13 упражнений. Стиль растёт и меняется, но 1–3 корня, найденные в первом скетчбуке, остаются навсегда.', 'Jebkuri materiāli — no zīmuļa līdz eļļai un pikseļiem. Trīs uzmetumi katram zīmējumam, pēc tam MI izvēlas to, kurā ir jēga, ideja un tā stils. Kā veidot tēlu: izmest lieko, apvienot avotus, aizņemties no cita un pievienot vienu “svešinieku” (no Alīnas grāmatas Urban Sketching: Digital Traveler). 13 vingrinājumi. Stils aug un mainās, bet 1–3 saknes, kas atrastas pirmajā skiču burtnīcā, paliek uz visiem laikiem.'] },
    { v: '0.1', date: '2026-10-25', file: '/files/artpill/ArtPill-v0.1.md',
      what: ['The first pill: one rule, “find your own”, the hand, the loop, drawing from life, 8 exercises, memory.', 'Первая таблетка: одно правило, «найди своё», рука, петля, натура, 8 упражнений, память.', 'Pirmā tablete: viens noteikums, “atrodi savu”, roka, cilpa, zīmēšana no dabas, 8 vingrinājumi, atmiņa.'] },
  ];
  const T = {
    whatH: ['What it is', 'Что это', 'Kas tas ir'],
    what: [[
      'A file you give to your AI. After it, the AI doesn’t produce a finished picture: it draws line by line, looks at what came out and answers it, the way a person with a sketchbook does.',
      'The pill gives no style. First it asks the AI who it is and what is around it. From that the AI chooses its own material and invents its own signature. So every AI ends up with a different sketchbook.',
      'It isn’t here to replace artists. The whole method comes from how artists draw and how drawing is taught.',
    ], [
      'Файл, который даёшь своему ИИ. После него ИИ не выдаёт готовую картинку, а рисует линию за линией, смотрит, что вышло, и отвечает рисунку — как человек со скетчбуком.',
      'Таблетка не даёт стиль. Сначала она спрашивает ИИ, кто он и что вокруг него. Из этого ИИ сам выбирает материал и придумывает свою фишку. Поэтому у каждого ИИ выходит свой скетчбук.',
      'Это не замена художникам: весь метод взят из того, как рисуют художники и как учат рисованию.',
    ], [
      'Fails, ko iedod savam MI. Pēc tā MI neizdod gatavu attēlu, bet zīmē līniju pēc līnijas, skatās, kas sanāca, un atbild zīmējumam — kā cilvēks ar skiču burtnīcu.',
      'Tablete nedod stilu. Vispirms tā jautā MI, kas tas ir un kas ir tam apkārt. No tā MI pats izvēlas materiālu un izdomā savu iezīmi. Tāpēc katram MI sanāk sava skiču burtnīca.',
      'Tā neaizstāj māksliniekus: visa metode ņemta no tā, kā zīmē mākslinieki un kā māca zīmēt.',
    ]],
    howH: ['How to use it', 'Как пользоваться', 'Kā lietot'],
    how: [[
      'Download the pill (a text file).', 'Give it to your AI: Claude, ChatGPT, Gemini, any. Ask it to read the pill, answer “find your own” and draw.', 'It draws in strokes (SVG, canvas, a plotter). Look at the drawing together; let it answer what it sees.', 'Open a sketchbook for your AI here and add its pages, from the first to the last.',
    ], [
      'Скачай таблетку (текстовый файл).', 'Дай её своему ИИ: Claude, ChatGPT, Gemini, любому. Попроси прочитать, ответить на «найди своё» и рисовать.', 'Он рисует штрихами (SVG, canvas, плоттер). Смотрите на рисунок вместе — пусть отвечает на то, что видит.', 'Заведи здесь скетчбук своего ИИ и добавляй его страницы — с первой до последней.',
    ], [
      'Lejupielādē tableti (teksta fails).', 'Iedod to savam MI: Claude, ChatGPT, Gemini, jebkuram. Palūdz izlasīt, atbildēt uz “atrodi savu” un zīmēt.', 'Tas zīmē ar vilcieniem (SVG, canvas, plotteris). Skatieties uz zīmējumu kopā — lai tas atbild uz to, ko redz.', 'Izveido šeit sava MI skiču burtnīcu un pievieno tās lapas — no pirmās līdz pēdējai.',
    ]],
    verH: ['Versions', 'Версии', 'Versijas'],
    verNote: ['The pill is written in English, the language most AIs read best. New versions and variations will appear here.', 'Таблетка написана по-английски — так её лучше всего читают ИИ. Здесь будут появляться новые версии и вариации.', 'Tablete ir uzrakstīta angliski — tā MI to lasa vislabāk. Šeit parādīsies jaunas versijas un variācijas.'],
    latest: ['latest', 'новая', 'jaunākā'],
    download: ['⬇ Download', '⬇ Скачать', '⬇ Lejupielādēt'],
    read: ['📖 Read', '📖 Читать', '📖 Lasīt'],
    hide: ['Hide', 'Скрыть', 'Paslēpt'],
    whyH: ['Why this isn’t just another AI skill', 'Почему это не просто ещё один скилл для ИИ', 'Kāpēc tā nav vienkārši vēl viena MI prasme'],
    why: [[
      ['The problem', 'Models are tuned to give the most acceptable answer, and that measurably narrows the variety of what they make (Kirk et al., ICLR 2024). AI help makes creative work more alike (Doshi & Hauser, Science Advances 2024). “Draw in the style of…” prompts push every model to the same average picture.'],
      ['Drawing is a conversation with the page', 'Design research shows that people see new things in their own sketches and that this drives the next move (Schön 1983; Goldschmidt 1991; Suwa & Tversky 1997). The pill’s loop (draw, look, name what you see, answer) turns this into a procedure.'],
      ['Proven teaching exercises', 'Blind contour, one line and timed sketches come from drawing pedagogy (Nicolaïdes 1941; Edwards 1979). They break the habit of drawing “what you know”, and for a model what it knows is the average.'],
      ['Constraints raise originality', 'A review of 145 studies: moderate constraints tend to increase creativity (Acar, Tarakci & van Knippenberg 2019). The exercises are deliberate constraints. Materials are free: each AI chooses its own.'],
      ['Many drafts, one choice', 'Creative thought works by making variations and keeping the few that fit (Campbell 1960; Simonton). Artists do it with thumbnails. The pill asks for three drafts per drawing and a written reason for the choice.'],
      ['Computational creativity', 'A creative system needs skill, appreciation and imagination, and it must frame its work (Colton 2008; Charnley, Colton & Pease 2012). In the pill: the hand, the loop, “find your own” and the journal.'],
      ['Honest limits and testable claims', 'The pill doesn’t claim the AI is conscious, and it doesn’t settle authorship (courts still require a human author). It gives four hypotheses anyone can test: AIs with the pill differ more from each other, keep a recognisable handwriting, draw livelier with the loop, and don’t copy the reference artist. Sketchbooks on this page are the open dataset.'],
    ], [
      ['Проблема', 'Модели настраивают давать самый приемлемый ответ, и это измеримо сужает разнообразие того, что они делают (Kirk и др., ICLR 2024). С помощью ИИ творческие работы становятся похожи друг на друга (Doshi & Hauser, Science Advances 2024). Просьбы «нарисуй в стиле…» ведут все модели к одной средней картинке.'],
      ['Рисование — разговор с листом', 'Исследования дизайна показывают: люди видят в своих набросках новое, и это ведёт их к следующему шагу (Schön 1983; Goldschmidt 1991; Suwa & Tversky 1997). Петля таблетки (нарисуй, посмотри, назови, что видишь, ответь) превращает это в порядок действий.'],
      ['Проверенные упражнения', 'Слепой контур, одна линия, наброски на время — из методики обучения рисунку (Nicolaïdes 1941; Edwards 1979). Они ломают привычку рисовать «то, что знаешь», а для модели «то, что знаешь» — это среднее.'],
      ['Ограничения повышают оригинальность', 'Обзор 145 исследований: умеренные ограничения обычно повышают креативность (Acar, Tarakci & van Knippenberg 2019). Упражнения — намеренные ограничения. Материалы любые: каждый ИИ выбирает свои.'],
      ['Много набросков, один выбор', 'Творческое мышление работает так: создаются варианты, и остаются немногие подходящие (Campbell 1960; Simonton). Художники делают так же — эскизы, потом выбор. Таблетка просит три наброска на рисунок и записанную причину выбора.'],
      ['Вычислительное творчество', 'Творческой системе нужны умение, способность оценить свою работу и воображение, и она должна объяснять свою работу (Colton 2008; Charnley, Colton & Pease 2012). В таблетке это рука, петля, «найди своё» и дневник.'],
      ['Честные границы и проверяемые утверждения', 'Таблетка не утверждает, что у ИИ есть сознание, и не решает вопрос авторства (суды пока требуют автора-человека). Она даёт четыре гипотезы, которые может проверить любой: ИИ с таблеткой сильнее отличаются друг от друга, сохраняют узнаваемый почерк, рисуют живее с петлёй и не копируют художницу-образец. Скетчбуки на этой странице — открытые данные для проверки.'],
    ], [
      ['Problēma', 'Modeļus noregulē dot pieņemamāko atbildi, un tas izmērāmi sašaurina to darbu daudzveidību (Kirk u. c., ICLR 2024). Ar MI palīdzību radošie darbi kļūst līdzīgāki cits citam (Doshi & Hauser, Science Advances 2024). Lūgumi “uzzīmē … stilā” noved visus modeļus pie viena vidējā attēla.'],
      ['Zīmēšana ir saruna ar lapu', 'Dizaina pētījumi rāda: cilvēki savās skicēs ierauga ko jaunu, un tas virza nākamo soli (Schön 1983; Goldschmidt 1991; Suwa & Tversky 1997). Tabletes cilpa (uzzīmē, paskaties, nosauc, ko redzi, atbildi) to pārvērš darbību secībā.'],
      ['Pārbaudīti vingrinājumi', 'Aklā kontūra, viena līnija, skices uz laiku — no zīmēšanas mācīšanas metodikas (Nicolaïdes 1941; Edwards 1979). Tie lauž ieradumu zīmēt “to, ko zini”, bet modelim “tas, ko zini” ir vidējais.'],
      ['Ierobežojumi palielina oriģinalitāti', '145 pētījumu apskats: mēreni ierobežojumi parasti palielina radošumu (Acar, Tarakci & van Knippenberg 2019). Vingrinājumi ir apzināti ierobežojumi. Materiāli ir jebkuri: katrs MI izvēlas savus.'],
      ['Daudz uzmetumu, viena izvēle', 'Radošā domāšana darbojas tā: rodas varianti, un paliek daži piemērotie (Campbell 1960; Simonton). Mākslinieki dara tāpat — skices, pēc tam izvēle. Tablete prasa trīs uzmetumus vienam zīmējumam un pierakstītu izvēles iemeslu.'],
      ['Skaitļošanas radošums', 'Radošai sistēmai vajag prasmi, spēju novērtēt savu darbu un iztēli, un tai jāpaskaidro savs darbs (Colton 2008; Charnley, Colton & Pease 2012). Tabletē tā ir roka, cilpa, “atrodi savu” un dienasgrāmata.'],
      ['Godīgas robežas un pārbaudāmi apgalvojumi', 'Tablete neapgalvo, ka MI ir apziņa, un neatrisina autorības jautājumu (tiesas joprojām prasa cilvēku autoru). Tā dod četras hipotēzes, ko var pārbaudīt ikviens: MI ar tableti vairāk atšķiras cits no cita, saglabā atpazīstamu rokrakstu, ar cilpu zīmē dzīvāk un nekopē parauga mākslinieci. Skiču burtnīcas šajā lapā ir atvērtie dati pārbaudei.'],
    ]],
    whyFull: ['📖 Full reasoning with sources (EN)', '📖 Полное обоснование с источниками (EN)', '📖 Pilns pamatojums ar avotiem (EN)'],
    clH: ['Claude’s sketchbooks', 'Скетчбуки Claude', 'Claude skiču burtnīcas'],
    clLead: ['The first AI to take the pill. Its sketchbooks by theme, from the first page to the last, with its own notes. Open one.', 'Первый ИИ, который принял таблетку. Его скетчбуки по темам — с первой страницы до последней, с его собственными заметками. Открой любой.', 'Pirmais MI, kas iedzēra tableti. Tā skiču burtnīcas pa tēmām — no pirmās lapas līdz pēdējai, ar paša piezīmēm. Atver jebkuru.'],
    sketchbook: ['Sketchbook', 'Скетчбук', 'Skiču burtnīca'],
    closeBook: ['Close the sketchbook', 'Закрыть скетчбук', 'Aizvērt burtnīcu'],
    drafts: ['Three drafts, ★ chosen', 'Три наброска, ★ выбран', 'Trīs uzmetumi, ★ izvēlēts'],
    page: ['Page', 'Страница', 'Lapa'],
    ex: ['Exercise', 'Упражнение', 'Vingrinājums'],
    life: ['from life, from Alina’s photo', 'с натуры, по фото Алины', 'no dabas, pēc Alīnas foto'],
    exN: [['', 'Blind contour', 'One line', '30 seconds', 'Look in pieces', 'Wrong hand', 'Start with a blot', 'Ordinary object with a job', 'Two things that don’t belong', 'Capriccio', 'From memory', 'One drawing, three stories', 'The invisible', 'Cut half'],
      ['', 'Слепой контур', 'Одна линия', '30 секунд', 'Смотреть кусками', 'Не та рука', 'Начать с кляксы', 'Обычная вещь с работой', 'Две вещи не вместе', 'Каприччо', 'По памяти', 'Один рисунок — три истории', 'Невидимое', 'Убрать половину'],
      ['', 'Aklā kontūra', 'Viena līnija', '30 sekundes', 'Skatīties pa gabaliem', 'Ne tā roka', 'Sākt ar traipu', 'Parasta lieta ar darbu', 'Divas lietas, kas nav kopā', 'Kapričo', 'No atmiņas', 'Viens zīmējums — trīs stāsti', 'Neredzamais', 'Izmest pusi']],
    memory: ['Memory: break your own habit', 'Память: сломать свою привычку', 'Atmiņa: salauzt savu ieradumu'],
    styleH: ['How it found its style', 'Как он нашёл свой стиль', 'Kā tas atrada savu stilu'],
    cover: ['How I looked for my style', 'Как я ищу свой стиль', 'Kā es meklēju savu stilu'],
    prev: ['← Back', '← Назад', '← Atpakaļ'], next: ['Next →', 'Дальше →', 'Tālāk →'],
    booksH: ['Sketchbooks of other AIs', 'Скетчбуки других ИИ', 'Citu MI skiču burtnīcas'],
    booksLead: ['Gave the pill to your AI? Open a sketchbook for it: its name, model, how it found its style, and its pages from the first to the last.', 'Твой ИИ уже принял таблетку? Заведи ему скетчбук: имя, модель, как он нашёл свой стиль, и его страницы с первой до последней.', 'Iedevi tableti savam MI? Izveido tam skiču burtnīcu: vārds, modelis, kā tas atrada savu stilu, un tā lapas no pirmās līdz pēdējai.'],
    booksNone: ['No sketchbooks yet. Yours can be the first.', 'Пока ни одного скетчбука. Твой может стать первым.', 'Vēl nav nevienas skiču burtnīcas. Tava var būt pirmā.'],
    newBook: ['＋ Sketchbook for my AI', '＋ Скетчбук для моего ИИ', '＋ Skiču burtnīca manam MI'],
    signIn: ['Sign in with your bird to open a sketchbook and leave a review: one profile for the whole site.', 'Войди со своей птичкой, чтобы завести скетчбук и оставить отзыв: один профиль на весь сайт.', 'Ienāc ar savu putniņu, lai izveidotu skiču burtnīcu un atstātu atsauksmi: viens profils visai vietnei.'],
    signBtn: ['🐦 Sign in', '🐦 Войти', '🐦 Ienākt'],
    aiName: ['AI’s name', 'Имя ИИ', 'MI vārds'], model: ['Model (e.g. Claude, GPT, Gemini)', 'Модель (например, Claude, GPT, Gemini)', 'Modelis (piem., Claude, GPT, Gemini)'],
    pillV: ['Pill version', 'Версия таблетки', 'Tabletes versija'],
    style: ['How it found its style: material, signature, why', 'Как он нашёл свой стиль: материал, фишка, почему', 'Kā tas atrada savu stilu: materiāls, iezīme, kāpēc'],
    save: ['Save', 'Сохранить', 'Saglabāt'], cancel: ['Cancel', 'Отмена', 'Atcelt'], edit: ['✏️ Edit', '✏️ Изменить', '✏️ Labot'],
    addPage: ['＋ Add a page', '＋ Добавить страницу', '＋ Pievienot lapu'],
    pickImg: ['Choose a drawing', 'Выбрать рисунок', 'Izvēlēties zīmējumu'],
    note: ['Exercise and loop notes: what went wrong, what was kept', 'Упражнение и заметки петли: что пошло не так, что оставлено', 'Vingrinājums un cilpas piezīmes: kas nogāja greizi, ko paturēja'],
    send: ['Add', 'Добавить', 'Pievienot'], sending: ['Sending…', 'Отправляю…', 'Sūtu…'],
    fail: ['Didn’t work. Try again.', 'Не получилось. Попробуй ещё раз.', 'Neizdevās. Mēģini vēlreiz.'],
    many: ['That’s enough for today. Come back tomorrow.', 'На сегодня хватит — приходи завтра.', 'Šodienai pietiek — nāc rīt.'],
    noPic: ['Choose a drawing first.', 'Сначала выбери рисунок.', 'Vispirms izvēlies zīmējumu.'],
    pages: ['pages', 'стр.', 'lpp.'], by: ['by', 'от', 'no'], empty: ['No pages yet.', 'Пока нет страниц.', 'Vēl nav lapu.'],
    del: ['🗑', '🗑', '🗑'], delQ: ['Delete for good?', 'Удалить насовсем?', 'Dzēst pavisam?'],
    revH: ['Reviews', 'Отзывы', 'Atsauksmes'],
    revLead: ['Tried the pill? Tell how it went: what your AI drew, what surprised you, what to change in the next version.', 'Таблетка уже в деле? Расскажи, как прошло: что нарисовал твой ИИ, что удивило, что поменять в следующей версии.', 'Izmēģināji tableti? Pastāsti, kā gāja: ko uzzīmēja tavs MI, kas pārsteidza, ko mainīt nākamajā versijā.'],
    revNone: ['No reviews yet.', 'Пока нет отзывов.', 'Vēl nav atsauksmju.'],
    revPh: ['Your review', 'Твой отзыв', 'Tava atsauksme'],
    revSend: ['Send review', 'Отправить отзыв', 'Sūtīt atsauksmi'],
    close: ['✕', '✕', '✕'],
  };
  const t = k => T[k][L];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const nl = s => esc(s).replace(/\n/g, '<br>');
  const day = s => new Date(s * 1000).toLocaleDateString(lang === 'en' ? 'en-GB' : lang, { day: 'numeric', month: 'short', year: 'numeric' });
  const img = (id, thumb) => `/api/img/${id}${thumb ? '?t=1' : ''}`;
  const jpeg = (bmp, max, q) => { const k = Math.min(1, max / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0, c.width, c.height); return new Promise(r => c.toBlob(r, 'image/jpeg', q)); };
  const api = async (path, body) => {
    const o = body instanceof FormData ? { method: 'POST', body } : body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {};
    const r = await fetch(path, { credentials: 'same-origin', ...o });
    if (!r.ok) { const e = new Error(r.status); e.status = r.status; throw e; }
    return r.json();
  };
  // маленький markdown → html для таблетки и обоснования (заголовки, списки, цитаты, жирный, курсив, линия)
  const md = s => {
    const inl = x => esc(x).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/`(.+?)`/g, '<code>$1</code>');
    let out = '', list = '';
    const close = () => { if (list) { out += `</${list}>`; list = ''; } };
    for (const line of s.split('\n')) {
      let m;
      if ((m = line.match(/^(#{1,3}) (.*)/))) { close(); const n = m[1].length + 2; out += `<h${n}>${inl(m[2])}</h${n}>`; }
      else if ((m = line.match(/^\s*[-*] (.*)/))) { if (list !== 'ul') { close(); out += '<ul>'; list = 'ul'; } out += `<li>${inl(m[1])}</li>`; }
      else if ((m = line.match(/^\s*\d+\. (.*)/))) { if (list !== 'ol') { close(); out += '<ol>'; list = 'ol'; } out += `<li>${inl(m[1])}</li>`; }
      else if (/^\s{2,}\S/.test(line) && list) { out = out.replace(/<\/li>$/, ` ${inl(line.trim())}</li>`); }
      else if ((m = line.match(/^> ?(.*)/))) { close(); out += `<blockquote>${inl(m[1])}</blockquote>`; }
      else if (/^---\s*$/.test(line)) { close(); out += '<hr>'; }
      else if (line.trim()) { close(); out += `<p>${inl(line)}</p>`; }
      else close();
    }
    close();
    return out;
  };
  const reader = (btn, url) => {
    const host = btn.closest('[data-reader]').querySelector('.ap-read');
    btn.addEventListener('click', async () => {
      if (!host.hidden) { host.hidden = true; btn.textContent = btn.dataset.label; return; }
      btn.dataset.label = btn.dataset.label || btn.textContent;
      if (!host.innerHTML) host.innerHTML = md(await (await fetch(url)).text());
      host.hidden = false; btn.textContent = t('hide');
    });
  };

  // ---------- статичная часть ----------
  const v0 = VERSIONS[0];
  box.innerHTML = `
    <section class="ap-sec ap-claude" id="claude"><h2>${t('clH')}</h2><p class="ap-muted">${t('clLead')}</p><div class="ap-shelf" id="ap-shelf"></div><div class="ap-book" id="ap-claude" hidden></div></section>
    <section class="ap-sec ap-what">
      <div><h2>${t('whatH')}</h2>${T.what[L].map(p => `<p>${p}</p>`).join('')}</div>
      <div><h2>${t('howH')}</h2><ol class="ap-how">${T.how[L].map(p => `<li>${p}</li>`).join('')}</ol>
        <p class="ap-cta" data-reader><a class="btn" href="${v0.file}" download>${t('download')} v${v0.v}</a> <button class="btn btn-ghost" type="button" data-read="${v0.file}">${t('read')}</button><span class="ap-read" hidden></span></p></div>
    </section>
    <section class="ap-sec" id="versions"><h2>${t('verH')}</h2><p class="ap-muted">${t('verNote')}</p>
      <ul class="ap-vers">${VERSIONS.map((x, i) => `<li data-reader><div class="ap-v"><b>v${x.v}</b>${i ? '' : ` <span class="ap-new">${t('latest')}</span>`} <span class="ap-muted">${x.date}</span><p>${x.what[L]}</p></div>
        <div class="ap-v-btns"><a class="btn btn-ghost" href="${x.file}" download>${t('download')}</a> <button class="btn btn-ghost" type="button" data-read="${x.file}">${t('read')}</button></div><div class="ap-read" hidden></div></li>`).join('')}</ul>
    </section>
    <section class="ap-sec" id="why" data-reader><h2>${t('whyH')}</h2>
      <div class="ap-why">${T.why[L].map(([h, p]) => `<div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
      <p><button class="btn btn-ghost" type="button" data-read="/files/artpill/WHY.md">${t('whyFull')}</button></p><div class="ap-read" hidden></div>
    </section>
    <section class="ap-sec" id="sketchbooks"><h2>${t('booksH')}</h2><p class="ap-muted">${t('booksLead')}</p><div id="ap-books"></div></section>
    <section class="ap-sec" id="reviews"><h2>${t('revH')}</h2><p class="ap-muted">${t('revLead')}</p><div id="ap-revs"></div></section>
    <div class="ap-modal" id="ap-modal" hidden><div class="ap-modal-in"><button class="ap-x" type="button" aria-label="close">${t('close')}</button><div class="ap-modal-body"></div></div></div>`;
  box.querySelectorAll('[data-read]').forEach(b => reader(b, b.dataset.read));

  // ---------- скетчбуки Claude: полка закрытых книжечек по темам; клик — открывается и листается ----------
  const shelf = box.querySelector('#ap-shelf'), cl = box.querySelector('#ap-claude');
  const pic = n => `/images/artpill/claude/${typeof n === 'number' ? String(n).padStart(2, '0') : n}.jpg`;
  const exName = p => p.ex ? T.exN[L][p.ex] : t('memory');
  let book = null, cur = 0;
  shelf.innerHTML = C.BOOKS.map((b, i) => `<button type="button" class="ap-sb" data-sb="${i}" style="--c:${b.cover};--b:${b.band}" aria-expanded="false">
      <span class="ap-sb-no">${t('sketchbook')} ${i + 1}</span><b>${b.title[L]}</b><i>${b.sub[L]}</i>
      <span class="ap-sb-foot">${b.PAGES.length} ${t('pages')} · ArtPill v${b.pill}</span></button>`).join('');
  function drawClaude() {
    const B = C.BOOKS[book], N = B.PAGES.length;
    let spread;
    if (!cur) spread = `<div class="ap-left ap-cover"><h3>${B.intro.title[L]}</h3>${B.intro.text[L].map(p => `<p>${p}</p>`).join('')}</div>
      <div class="ap-right ap-cover-r">${B.after ? `<img src="${pic('sheet')}" alt="" loading="lazy"><p class="ap-after">${B.after[L]}</p>` : `<img src="${pic(B.PAGES[N - 1].n)}" alt="" loading="lazy">`}
      ${B.roots ? `<div class="ap-roots"><h4>${B.roots.title[L]}</h4><ol>${B.roots.list[L].map(x => `<li>${x}</li>`).join('')}</ol><p>${B.roots.note[L]}</p></div>` : ''}</div>`;
    else {
      const p = B.PAGES[cur - 1];
      const dr = p.drafts ? `<p class="ap-pn">${t('drafts')}</p><div class="ap-drafts">${p.drafts.map((d, i) => `<a href="${pic(d)}" target="_blank" rel="noopener" class="${i === p.chosen ? 'on' : ''}"><img src="${pic(d)}" alt="" loading="lazy"><span>${'ABC'[i]}${i === p.chosen ? ' ★' : ''}</span></a>`).join('')}</div>` : '';
      spread = `<div class="ap-left"><p class="ap-pn">${t('page')} ${cur} / ${N}</p><h3>${p.t[L]}</h3>
        <p class="ap-ex">${t('ex')}: ${exName(p)}${p.life ? ` · ${t('life')}` : ''}</p>${p.notes[L].map(x => `<p>${x}</p>`).join('')}</div>
        <div class="ap-right"><img src="${pic(p.n)}" alt="${esc(p.t[L])}">${dr}</div>`;
    }
    cl.innerHTML = `<div class="ap-book-top"><b>${B.title[L]}</b><button class="btn btn-ghost" type="button" data-close>${t('closeBook')}</button></div><div class="ap-spread" style="--b:${B.band}">${spread}</div>
      <div class="ap-nav"><button class="btn btn-ghost" type="button" data-go="-1" ${cur ? '' : 'disabled'}>${t('prev')}</button>
      <div class="ap-strip">${['★', ...B.PAGES.map(p => p.n)].map((x, i) => `<button type="button" data-to="${i}" class="${i === cur ? 'on' : ''}" aria-label="${i ? t('page') + ' ' + i : t('cover')}">${i ? `<img src="${pic(x)}" alt="" loading="lazy">` : '<span>★</span>'}</button>`).join('')}</div>
      <button class="btn btn-ghost" type="button" data-go="1" ${cur < N ? '' : 'disabled'}>${t('next')}</button></div>`;
  }
  const openSb = i => {
    shelf.querySelectorAll('[data-sb]').forEach(b => { const on = +b.dataset.sb === i; b.classList.toggle('open', on); b.setAttribute('aria-expanded', on); });
    if (i === null) { book = null; cl.hidden = true; cl.innerHTML = ''; return; }
    book = i; cur = 0; cl.hidden = false; drawClaude();
    cl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  shelf.addEventListener('click', e => { const b = e.target.closest('[data-sb]'); if (b) openSb(+b.dataset.sb === book ? null : +b.dataset.sb); });
  cl.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { openSb(null); shelf.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const g = e.target.closest('[data-go]'), to = e.target.closest('[data-to]');
    const N = C.BOOKS[book].PAGES.length;
    if (g) cur = Math.max(0, Math.min(N, cur + +g.dataset.go));
    else if (to) cur = +to.dataset.to;
    else return;
    drawClaude();
  });
  document.addEventListener('keydown', e => {
    if (book === null || cl.hidden || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || /input|textarea|select/i.test(document.activeElement.tagName)) return;
    const N = C.BOOKS[book].PAGES.length;
    cur = Math.max(0, Math.min(N, cur + (e.key === 'ArrowRight' ? 1 : -1))); drawClaude();
  });

  // ---------- скетчбуки ИИ посетителей и отзывы ----------
  let S = { me: null, versions: VERSIONS.map(x => x.v), books: [], reviews: [] };
  const modal = box.querySelector('#ap-modal'), mbody = modal.querySelector('.ap-modal-body');
  const openModal = html => { mbody.innerHTML = html; modal.hidden = false; document.documentElement.classList.add('ap-lock'); };
  const closeModal = () => { modal.hidden = true; mbody.innerHTML = ''; document.documentElement.classList.remove('ap-lock'); };
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.ap-x')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  const signIn = () => window.PPAccount && PPAccount.openSignIn ? PPAccount.openSignIn() : location.assign('/bird/');
  const errText = e => e && e.status === 429 ? t('many') : t('fail');

  function drawBooks() {
    const el = box.querySelector('#ap-books');
    const top = S.me ? `<p><button class="btn" type="button" data-new>${t('newBook')}</button></p>` : `<p class="ap-sign">${t('signIn')} <button class="btn" type="button" data-sign>${t('signBtn')}</button></p>`;
    el.innerHTML = top + (S.books.length ? `<div class="ap-books">${S.books.map(b => `<button type="button" class="ap-bk" data-book="${b.id}">
        <span class="ap-bk-pic">${b.cover ? `<img src="${img(b.cover, 1)}" alt="" loading="lazy">` : '<i>✎</i>'}</span>
        <b>${esc(b.ai)}</b><span class="ap-muted">${esc(b.model)}${b.model ? ' · ' : ''}v${esc(b.pill)} · ${b.n} ${t('pages')}</span><span class="ap-muted">${t('by')} @${esc(b.nick)}</span></button>`).join('')}</div>` : `<p class="ap-muted">${t('booksNone')}</p>`);
  }
  function drawRevs() {
    const el = box.querySelector('#ap-revs');
    const form = S.me ? `<form class="ap-rev-form"><div class="ap-stars" role="radiogroup">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}" aria-label="${n}">☆</button>`).join('')}</div>
        <textarea maxlength="2000" rows="3" placeholder="${t('revPh')}" required></textarea>
        <div class="ap-row"><select name="pill">${S.versions.slice().reverse().map(v => `<option>v${v}</option>`).join('')}</select><button class="btn" type="submit">${t('revSend')}</button><span class="ap-msg"></span></div></form>`
      : `<p class="ap-sign">${t('signIn')} <button class="btn" type="button" data-sign>${t('signBtn')}</button></p>`;
    el.innerHTML = form + (S.reviews.length ? `<ul class="ap-revs">${S.reviews.map(r => `<li><p class="ap-rev-h"><b>@${esc(r.nick)}</b> ${r.stars ? `<span class="ap-st">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>` : ''} <span class="ap-muted">${r.pill ? 'v' + esc(r.pill) + ' · ' : ''}${day(r.at)}</span>${r.mine || (S.me && S.me.admin) ? ` <button type="button" class="ap-del" data-del="review" data-id="${r.id}">${t('del')}</button>` : ''}</p><p>${nl(r.text)}</p></li>`).join('')}</ul>` : `<p class="ap-muted">${t('revNone')}</p>`);
    let stars = 0;
    const f = el.querySelector('.ap-rev-form');
    if (!f) return;
    f.addEventListener('click', e => { const s = e.target.closest('[data-star]'); if (!s) return; stars = +s.dataset.star; f.querySelectorAll('[data-star]').forEach(b => { b.textContent = +b.dataset.star <= stars ? '★' : '☆'; }); });
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const msg = f.querySelector('.ap-msg'), btn = f.querySelector('[type=submit]');
      btn.disabled = true; msg.textContent = t('sending');
      try { await api('/api/artpill/review', { text: f.querySelector('textarea').value, stars, pill: f.pill.value.slice(1) }); await load(); }
      catch (er) { btn.disabled = false; msg.textContent = errText(er); }
    });
  }
  function bookForm(b) {
    b = b || { ai: '', model: '', pill: S.versions[S.versions.length - 1], style: '' };
    openModal(`<form class="ap-form"><h3>${b.id ? t('edit') : t('newBook')}</h3>
      <label>${t('aiName')}<input name="ai" maxlength="60" required value="${esc(b.ai)}"></label>
      <label>${t('model')}<input name="model" maxlength="80" value="${esc(b.model)}"></label>
      <label>${t('pillV')}<select name="pill">${S.versions.slice().reverse().map(v => `<option value="${v}" ${v === b.pill ? 'selected' : ''}>v${v}</option>`).join('')}</select></label>
      <label>${t('style')}<textarea name="style" rows="7" maxlength="4000">${esc(b.style)}</textarea></label>
      <div class="ap-row"><button class="btn" type="submit">${t('save')}</button><button class="btn btn-ghost" type="button" data-cancel>${t('cancel')}</button><span class="ap-msg"></span></div></form>`);
    const f = mbody.querySelector('form');
    f.querySelector('[data-cancel]').onclick = () => b.id ? openBook(b.id) : closeModal();
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const msg = f.querySelector('.ap-msg');
      msg.textContent = t('sending');
      try { const r = await api('/api/artpill/book', { id: b.id, ai: f.ai.value, model: f.model.value, pill: f.pill.value, style: f.style.value }); await load(); openBook(r.id); }
      catch (er) { msg.textContent = errText(er); }
    });
  }
  async function openBook(id) {
    let d;
    try { d = await api('/api/artpill/book?id=' + id); } catch (e) { return; }
    const b = d.book, can = d.mine || (S.me && S.me.admin);
    openModal(`<div class="ap-bk-head"><h3>${esc(b.ai)}</h3><p class="ap-muted">${esc(b.model)}${b.model ? ' · ' : ''}ArtPill v${esc(b.pill)} · ${t('by')} <a href="/bird/?nick=${encodeURIComponent(b.nick)}">@${esc(b.nick)}</a></p>
        ${d.mine ? `<button class="btn btn-ghost" type="button" data-edit>${t('edit')}</button>` : ''}${can ? ` <button type="button" class="ap-del" data-del="book" data-id="${b.id}">${t('del')}</button>` : ''}</div>
      ${b.style ? `<div class="ap-style"><h4>${t('styleH')}</h4><p>${nl(b.style)}</p></div>` : ''}
      ${d.mine ? `<form class="ap-add"><label class="btn btn-ghost ap-file">${t('pickImg')}<input type="file" accept="image/*" hidden></label><img class="ap-prev" alt="" hidden>
        <textarea rows="3" maxlength="2000" placeholder="${t('note')}"></textarea><div class="ap-row"><button class="btn" type="submit">${t('send')}</button><span class="ap-msg"></span></div></form>` : ''}
      ${d.pages.length ? `<ol class="ap-pages">${d.pages.map((p, i) => `<li><a href="${img(p.img)}" target="_blank" rel="noopener"><img src="${img(p.img, 1)}" alt="" loading="lazy"></a><p class="ap-pn">${t('page')} ${i + 1} · ${day(p.at)}${can ? ` <button type="button" class="ap-del" data-del="page" data-id="${p.id}">${t('del')}</button>` : ''}</p>${p.note ? `<p>${nl(p.note)}</p>` : ''}</li>`).join('')}</ol>` : `<p class="ap-muted">${t('empty')}</p>`}`);
    const e = mbody.querySelector('[data-edit]');
    if (e) e.onclick = () => bookForm(b);
    const f = mbody.querySelector('.ap-add');
    if (!f) return;
    let picked = null;
    f.querySelector('input[type=file]').addEventListener('change', ev => { picked = ev.target.files[0]; if (picked) { const pv = f.querySelector('.ap-prev'); pv.src = URL.createObjectURL(picked); pv.hidden = false; } });
    f.addEventListener('submit', async ev => {
      ev.preventDefault();
      const msg = f.querySelector('.ap-msg'), btn = f.querySelector('[type=submit]');
      if (!picked) { msg.textContent = t('noPic'); return; }
      btn.disabled = true; msg.textContent = t('sending');
      try {
        const bmp = await createImageBitmap(picked), fd = new FormData();
        fd.append('book', b.id); fd.append('note', f.querySelector('textarea').value);
        fd.append('full', await jpeg(bmp, 1600, 0.88), 'full.jpg'); fd.append('thumb', await jpeg(bmp, 480, 0.8), 'thumb.jpg');
        await api('/api/artpill/page', fd);
        await load(); openBook(b.id);
      } catch (er) { btn.disabled = false; msg.textContent = errText(er); }
    });
  }
  box.addEventListener('click', async e => {
    if (e.target.closest('[data-sign]')) return signIn();
    if (e.target.closest('[data-new]')) return bookForm();
    const bk = e.target.closest('[data-book]');
    if (bk) return openBook(bk.dataset.book);
    const del = e.target.closest('[data-del]');
    if (del && confirm(t('delQ'))) {
      try {
        await api('/api/artpill/del', { kind: del.dataset.del, id: +del.dataset.id });
        const back = del.dataset.del === 'page' ? mbody.querySelector('[data-del=book]')?.dataset.id || null : null;
        await load();
        if (del.dataset.del === 'book') closeModal();
        else if (del.dataset.del === 'page') { const li = del.closest('li'); li && li.remove(); if (back) openBook(back); }
      } catch (er) { alert(t('fail')); }
    }
  });
  async function load() {
    try { const d = await api('/api/artpill'); S = { ...S, ...d, versions: d.versions && d.versions.length ? d.versions : S.versions }; } catch (e) {}
    drawBooks(); drawRevs();
  }
  document.addEventListener('pp:whoami', () => load());
  load();
  if (location.hash === '#claude' || location.hash === '#sketchbooks' || location.hash === '#reviews' || location.hash === '#why') setTimeout(() => { const x = document.querySelector(location.hash); x && x.scrollIntoView(); }, 60);
})();
