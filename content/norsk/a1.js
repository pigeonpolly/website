// Уровень A1 — с нуля: звуки, «быть», presens, род, порядок слов, отрицание. Формат — docs/site.md «Учебник английского» (тот же движок).

U({
  id: 'a1-1', lvl: 'A1', t: 'Алфавит, звуки и «Hei!»', en: 'Alfabetet og uttale',
  goals: ['читать норвежские буквы æ, ø, å и сочетания kj, sj, skj', 'здороваться, прощаться и благодарить', 'представиться: *Jeg heter …*'],
  th: `<p>Норвежский — германский язык, близкий родственник английского, немецкого, шведского и датского. Есть две письменные нормы: <b>bokmål</b> («книжный язык», им пишет около 85–90 % норвежцев) и <b>nynorsk</b> («новонорвежский»). Мы учим букмол.</p>
  <h4>Алфавит: 26 латинских букв + три свои</h4>
  <div class="tbl"><table><thead><tr><th>Буква</th><th>Как звучит</th><th>Пример</th></tr></thead><tbody>
  <tr><td><b>æ</b></td><td>широкое «э», как в «этот»</td><td><i>været</i> — погода, <i>lære</i> — учить</td></tr>
  <tr><td><b>ø</b></td><td>как немецкое ö: губы для «о», язык для «э»</td><td><i>søt</i> — милый, <i>brød</i> — хлеб</td></tr>
  <tr><td><b>å</b></td><td>долгое «о»</td><td><i>gå</i> — идти, <i>på</i> — на</td></tr>
  <tr><td><b>o</b></td><td>часто как «у»!</td><td><i>bok</i> [бу:к] — книга, <i>god</i> [гу:] — хороший</td></tr>
  <tr><td><b>u</b></td><td>между «у» и «ю»</td><td><i>du</i> — ты, <i>hus</i> — дом</td></tr>
  <tr><td><b>y</b></td><td>как «ю» с вытянутыми губами</td><td><i>by</i> — город, <i>ny</i> — новый</td></tr></tbody></table></div>
  <h4>Сочетания, которые читаются не по буквам</h4>
  <ul><li><b>kj, tj</b> и <b>k</b> перед <i>i, y</i> — мягкое «хь»: <i>kjøpe</i> (покупать), <i>kino</i> (кино), <i>tjue</i> (двадцать).</li>
  <li><b>sj, skj, rs</b> и <b>sk</b> перед <i>i, y, ei, øy</i> — «ш»: <i>sjokolade</i>, <i>skje</i> (ложка), <i>ski</i> [ши:], <i>norsk</i> [ношк].</li>
  <li><b>hv, hj</b> — <i>h</i> не читается: <i>hva</i> [ва] — что, <i>hjem</i> [йем] — домой.</li>
  <li><b>g</b> перед <i>i, y, ei</i> — «й»: <i>gi</i> [йи:] — давать, <i>geit</i> [йейт] — коза.</li>
  <li><b>d</b> в конце слова после гласной часто немая: <i>god</i> [гу:], <i>med</i> [ме:], <i>ned</i>.</li></ul>
  <h4>Долгий и короткий звук</h4>
  <p>Двойная согласная — значит, гласная перед ней <b>короткая</b>: <i>takk</i> (спасибо) — коротко, <i>tak</i> (крыша) — долго. В остальном гласная под ударением обычно долгая. Ударение чаще всего на первом слоге.</p>
  <h4>Мелодия</h4>
  <p>Норвежский «поёт»: у слов есть тон. Не пугайтесь — вас поймут и без идеального тона. Просто слушайте 🔊 и повторяйте мелодию целиком.</p>
  <h4>Первые фразы</h4>
  <p><i>Hei!</i> — привет. <i>God morgen!</i> — доброе утро. <i>Ha det!</i> — пока. <i>Takk!</i> / <i>Tusen takk!</i> — спасибо / огромное спасибо («тысяча спасибо»). <i>Jeg heter …</i> — меня зовут … <i>Hva heter du?</i> — как тебя зовут?</p>
  <p>В Норвегии почти все на «ты» (<i>du</i>) — с коллегами, начальником, врачом и даже премьер-министром. Вежливое <i>De</i> почти не используется.</p>`,
  simple: 'æ — «э», ø — «ё» по-немецки, å — «о», o — часто «у». kj — «хь», sj и skj — «ш». Двойная согласная — короткий звук.',
  exm: [['Hei! Jeg heter Alina.', 'Привет! Меня зовут Алина.'], ['Hva heter du?', 'Как тебя зовут?'], ['Tusen takk!', 'Большое спасибо!'], ['God morgen! Ha en fin dag!', 'Доброе утро! Хорошего дня!']],
  conf: [['*takk* / *tak*', 'Двойная согласная — короткий гласный: <i>takk</i> [так] — спасибо; <i>tak</i> [та:к] — крыша.', '«Спасибо» по-норвежски:|takk|tak|tack # Две k — короткий звук.'],
    ['*hva* / *hvem*', '<i>Hva</i> — что, <i>hvem</i> — кто. В обоих <i>h</i> не читается: [ва], [вем].', '«Как тебя зовут?» дословно «Что ты называешься?»:|Hva heter du?|Hvem heter du?|Hvor heter du? # Имя спрашивают через hva.']],
  words: [['hei', 'привет', 'Hei! Hvordan går det?'], ['ha det', 'пока', 'Ha det, vi ses i morgen!'], ['takk', 'спасибо', 'Takk for kaffen!'], ['ja', 'да', 'Ja, jeg heter Pelle.'], ['nei', 'нет', 'Nei, jeg heter ikke Per.'], ['unnskyld', 'извините', 'Unnskyld, hva heter du?'], ['god morgen', 'доброе утро', 'God morgen, mamma!'], ['god natt', 'спокойной ночи', 'God natt og sov godt!'], ['hyggelig', 'приятно, мило', 'Hyggelig å hilse på deg!'], ['å hete', 'называться, зваться', 'Jeg heter Alina.']],
  ex: [
    { t: 'choice', h: 'Как это читается?', q: ['*kjøpe* (покупать) начинается со звука…|«хь»|«к»|«дж» # kj — мягкое «хь».', '*ski* читается…|[ши:]|[ски:]|[скай] # sk перед i — «ш».', '*hva* (что) читается…|[ва]|[хва]|[шва] # В hv буква h немая.', '*god* (хороший) читается…|[гу:]|[год]|[гуд] # o — «у», d в конце немая.', '*gi* (давать) читается…|[йи:]|[ги:]|[джи:] # g перед i — «й».', '*norsk* читается…|[ношк]|[норск]|[норш] # rs — «ш».'] },
    { t: 'gap', h: 'Вставьте слово.', q: ['Hei! Jeg ___ Pelle.|heter # Jeg heter — меня зовут.', 'Hva heter ___?|du # du — ты.', 'Tusen ___!|takk # «тысяча спасибо».', 'God ___! (утро)|morgen', 'Ha ___! (пока)|det', '___, hva heter du? (извините)|Unnskyld'] },
    { t: 'order', q: ['Jeg heter Alina.', 'Hva heter du?', 'Tusen takk for kaffen.', 'Hyggelig å hilse på deg.', 'Ha en fin dag.', 'God morgen og takk.'] },
    { t: 'tr', q: ['Привет!|Hei!|Hallo!|Hei hei!', 'Спасибо!|Takk!|Tusen takk!', 'Меня зовут Пелле.|Jeg heter Pelle.', 'Как тебя зовут?|Hva heter du?', 'Пока!|Ha det!|Ha det bra!'] },
  ],
  read: {
    title: 'Hei, jeg heter Pelle!', intro: 'Первый текст. Слушайте 🔊 и читайте вслух — особенно слова с æ, ø, å.',
    txt: ['Hei! Jeg heter Pelle. Jeg er en lundefugl. Jeg bor på Røst i Lofoten.', 'Jeg liker fisk og kaffe. Jeg liker ikke regn, men det regner ofte på Røst.', 'Hva heter du? Hyggelig å hilse på deg! Ha en fin dag!'],
    gl: { 'lundefugl': 'тупик (птица)', 'bor': 'живу', 'liker': 'люблю, нравится', 'fisk': 'рыба', 'regn': 'дождь', 'men': 'но', 'det regner': 'идёт дождь', 'ofte': 'часто' },
    q: [{ t: 'tf', q: ['Pelle er en lundefugl.|T', 'Pelle bor i Oslo.|F # Han bor på Røst i Lofoten.', 'Pelle liker kaffe.|T', 'Pelle liker regn.|F # Jeg liker ikke regn.'] },
      { t: 'choice', q: ['Hvor bor Pelle?|på Røst|i Bergen|i Riga', 'Hva liker Pelle?|fisk og kaffe|regn og snø|te og kake'] }],
  },
  series: [{ show: 'kultur', who: 'типично норвежское', q: 'Hei hei!', mean: 'Двойное «привет» — и при встрече, и на прощание. Звучит дружелюбно и легко.', fun: 'Норвежцы говорят <i>hei hei</i> даже уходя из магазина. Кассир скажет <i>hei hei</i> — вы тоже скажите <i>hei hei</i>. Это не «привет-привет», а «ну, пока!».', use: 'Hei hei! Ha det bra!', qz: 'Вы уходите из магазина, кассир говорит «Hei hei!». Что это значит?|«Пока!» (дружелюбное прощание)|«Привет, вы кто?»|«Подождите!» # Hei hei — и привет, и пока.' }],
  write: { h: 'Представьтесь в 3–4 предложениях: как вас зовут, где вы живёте, что вы любите.', min: 15, use: ['hei', 'jeg heter', 'jeg bor', 'jeg liker'],
    plan: ['Поздоровайтесь.', 'Jeg heter …', 'Jeg bor i …', 'Jeg liker … (кофе, рыба, книги)'],
    model: 'Hei! Jeg heter Anna.\nJeg bor i Riga.\nJeg liker kaffe og bøker.\nHyggelig å hilse på deg!' },
  vid: [['NorwegianClass101', 'Norwegian alphabet pronunciation'], ['Learn Norwegian Naturally', 'Norwegian pronunciation for beginners'], ['NorwegianClass101', 'basic Norwegian greetings']],
  fact: 'Буквы æ, ø, å стоят в самом конце алфавита — после z. В словаре слово «øl» (пиво) ищите почти на последней странице.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Ordbøkene', 'https://ordbokene.no/'], ['Wikibooks — Norwegian', 'https://en.wikibooks.org/wiki/Norwegian']],
});
NOTE('a1-1', {
  crow: 'Hei! Я Пелле, тупик. По-норвежски — *lundefugl*. Сегодня учим звуки: æ, ø, å. Не бойтесь их — они милые, как я.',
  mk: ['Представьтесь: напишите, как вас зовут и что вы любите.|heter;liker|Hei! Jeg heter Alina og jeg liker kaffe.', 'Напишите, где вы живёте и что вы *не* любите (можно смешное).|bor|Jeg bor i Riga og jeg liker ikke regn.', 'Поблагодарите друга за кофе и пожелайте хорошего дня.|takk|Tusen takk for kaffen! Ha en fin dag!'],
  etym: [['takk', 'родня английского *thanks* и немецкого *Dank*. Все они от древнего слова «мысль»: благодарить — значит «помнить о ком-то».'], ['hei', 'пришло в норвежский совсем недавно — в XX веке, через английское *hey* и шведское *hej*. Раньше здоровались *god dag*.']],
  ru: 'Знакомимся с героем повести. Тупик Пелле живёт на острове Рёст на Лофотенах. Он любит рыбу и кофе, а дождь — нет. Но на Рёсте дождь идёт часто.',
  gl: { 'lundefugl': 'тупик', 'øy': 'остров', 'liten': 'маленький', 'stor': 'большой', 'familie': 'семья', 'fisk': 'рыба', 'kaffe': 'кофе', 'regn': 'дождь', 'havet': 'море' },
  tf: ['Pelle bor på en liten øy.|T # Røst er en liten øy.', 'Pelle har en liten familie.|F # Pelle har en stor familie.', 'Pelle liker regn.|F # Pelle liker ikke regn.'],
  ch: ['Hva ser Pelle hver dag?|havet|fjellet|byen # Han ser havet.'],
  bmk: ['Что вы видите каждый день из окна? Одно предложение: *Jeg ser …*|ser|Jeg ser en stor park og mange trær.'],
  etb: '*Lundefugl* — от старого слова *lundi*. Английское *puffin* значит «пухлый», а русское «тупик» — из-за тупого, высокого клюва. У норвежцев он ещё и «клоун моря».',
});
ST('a1-1', { t: 'Привет и «Hvordan går det?»', tip: '*Hvordan går det?* — «как идёт?» — это просто «как дела?». Норвежцы отвечают коротко: *Bra, takk! Og med deg?* Длинный рассказ о жизни — только для близких друзей.',
  sit: 'Сосед на лестнице утром.', ph: [['Hei! Hvordan går det?', 'Привет! Как дела?'], ['Bra, takk! Og med deg?', 'Хорошо, спасибо! А у тебя?'], ['Det går fint.', 'Всё хорошо.'], ['Ha en fin dag!', 'Хорошего дня!']],
  dlg: ['Сосед: «Hei! Hvordan går det?» Как ответить естественно?|Bra, takk! Og med deg?|Jeg har hodepine og katten min er syk.|Ja. # Короткий ответ и встречный вопрос.', 'Сосед: «Ha en fin dag!»|Takk, i like måte!|Hvorfor?|Nei takk. # *I like måte* — «и вам того же».'],
  mk: 'Напишите мини-диалог: вас спросили *Hvordan går det?* — ответьте и спросите в ответ.|bra;takk|Bra, takk! Det går fint. Og med deg?' });
BK('a1-1', 'Kapittel 1. Pelle på Røst', ['Dette er Pelle. Pelle er en lundefugl. Han bor på Røst. Røst er en liten øy i Lofoten.', 'Pelle har en stor familie. Han har en mamma, en pappa og sju søsken. De bor sammen ved havet.', 'Pelle liker fisk. Han liker kaffe også. Men han liker ikke regn. Og på Røst regner det mye!', 'Hver dag ser Pelle havet. Havet er stort og blått. «Hva er bak havet?» tenker Pelle.']);

U({
  id: 'a1-2', lvl: 'A1', t: 'Местоимения и «быть»: jeg er', en: 'Pronomen og verbet «å være»',
  goals: ['говорить, кто вы и откуда: *Jeg er fra Latvia*', 'знать все личные местоимения', 'не путать *er* (есть) и *har* (имеет)'],
  th: `<p>Хорошая новость: норвежский глагол <b>не меняется по лицам</b>. «Я есть, ты есть, они есть» — всегда <b>er</b>. Никаких am/is/are!</p>
  <div class="tbl"><table><thead><tr><th>Местоимение</th><th>Перевод</th><th>å være (быть)</th><th>å ha (иметь)</th></tr></thead><tbody>
  <tr><td><i>jeg</i> [яй]</td><td>я</td><td><i>jeg er</i></td><td><i>jeg har</i></td></tr>
  <tr><td><i>du</i></td><td>ты</td><td><i>du er</i></td><td><i>du har</i></td></tr>
  <tr><td><i>han / hun</i></td><td>он / она</td><td><i>han er, hun er</i></td><td><i>han har</i></td></tr>
  <tr><td><i>den / det</i></td><td>он/она/оно (о предметах)</td><td><i>den er, det er</i></td><td><i>det har</i></td></tr>
  <tr><td><i>vi</i></td><td>мы</td><td><i>vi er</i></td><td><i>vi har</i></td></tr>
  <tr><td><i>dere</i></td><td>вы (много людей)</td><td><i>dere er</i></td><td><i>dere har</i></td></tr>
  <tr><td><i>de</i> [ди]</td><td>они</td><td><i>de er</i></td><td><i>de har</i></td></tr></tbody></table></div>
  <p><i>jeg</i> пишется с маленькой буквы (в отличие от английского <i>I</i>), а читается [яй]. <i>De</i> (они) читается [ди].</p>
  <h4>Когда нужен <i>er</i></h4>
  <p>Как и в английском, «быть» в норвежском обязательно — даже там, где по-русски пусто:</p>
  <ul><li>кто: <i>Jeg er kunstner.</i> — Я художник. (без артикля перед профессией!)</li><li>откуда: <i>Jeg er fra Latvia.</i></li><li>какой: <i>Pelle er søt.</i> — Пелле милый.</li><li>где: <i>Vi er hjemme.</i> — Мы дома.</li><li>возраст: <i>Jeg er tretti år.</i> — Мне тридцать лет. (не «har»!)</li></ul>
  <h4>Вопрос: просто меняем местами</h4>
  <p><i>Du er trøtt.</i> → <i><b>Er</b> du trøtt?</i> — Ты устал? С вопросительным словом: <i>Hvor <b>er</b> du fra?</i> — Откуда ты? <i>Hvor gammel <b>er</b> du?</i> — Сколько тебе лет?</p>
  <p>Ответы: <i>Ja</i> — да. <i>Nei</i> — нет. А на отрицательный вопрос «да» звучит как <b>jo</b>: <i>Er du ikke trøtt? — Jo!</i> (Ты не устал? — Ещё как устал!)</p>`,
  simple: 'er — для всех: jeg er, du er, de er. har — тоже для всех. Возраст — через er: Jeg er 30 år.',
  exm: [['Jeg er fra Latvia.', 'Я из Латвии.'], ['Hun er kunstner.', 'Она художница.'], ['Hvor er du fra?', 'Откуда ты?'], ['Vi er hjemme i dag.', 'Мы сегодня дома.']],
  conf: [['*Jeg er 30 år* / *Jeg har 30 år*', 'Возраст — через <i>er</i>: <i>Jeg er 30 år (gammel)</i>. «Har 30 år» — русская ловушка.', '«Мне 25 лет»:|Jeg er 25 år.|Jeg har 25 år.|Meg er 25 år. # Возраст — через er.'],
    ['*Jeg er lærer* / *Jeg er en lærer*', 'Перед профессией артикль не ставят: <i>Hun er lege</i> — она врач. Если есть прилагательное — ставят: <i>Hun er en god lege</i>.', '«Я художник»:|Jeg er kunstner.|Jeg er en kunstner.|Jeg kunstner. # Профессия — без en.']],
  words: [['jeg', 'я', 'Jeg er fra Riga.'], ['du', 'ты', 'Er du trøtt?'], ['han', 'он', 'Han er lærer.'], ['hun', 'она', 'Hun er fra Bergen.'], ['vi', 'мы', 'Vi er venner.'], ['de', 'они', 'De er hjemme.'], ['fra', 'из, от', 'Jeg er fra Latvia.'], ['hjemme', 'дома', 'Pelle er hjemme.'], ['trøtt', 'уставший', 'Jeg er trøtt i dag.'], ['glad', 'радостный', 'Hun er glad.']],
  ex: [
    { t: 'gap', h: 'Вставьте er или har.', q: ['Jeg ___ fra Latvia.|er', 'Hun ___ en katt.|har', 'Vi ___ hjemme.|er', 'Pelle ___ en stor familie.|har', 'Hvor gammel ___ du?|er', 'De ___ glade i dag.|er # glad → glade (много людей), A2.'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['«Мне 30 лет»:|Jeg er tretti år.|Jeg har tretti år.|Jeg tretti år. # Возраст — через er.', '«Он врач»:|Han er lege.|Han er en lege.|Han lege. # Профессия — без en.', '«Ты дома?»:|Er du hjemme?|Du hjemme?|Har du hjemme? # Вопрос: er — вперёд.', '«Ты не устал? — Ещё как!»:|Jo!|Ja!|Nei! # На отрицательный вопрос «да» — jo.', '«Они из Бергена»:|De er fra Bergen.|Dem er fra Bergen.|De har fra Bergen. # de — они (подлежащее).'] },
    { t: 'order', q: ['Jeg er fra Latvia.', 'Hvor er du fra?', 'Hun er kunstner i Riga.', 'Er du trøtt i dag?', 'Vi er hjemme nå.', 'Pelle har en stor familie.'] },
    { t: 'fix', q: ['Jeg har 30 år.|Jeg er 30 år. # Возраст — через er.', 'Hun en kunstner.|Hun er kunstner. # Нужен глагол er, а перед профессией — без en.', 'Du er trøtt? (вопрос)|Er du trøtt? # В вопросе глагол — вперёд.', 'Jeg er en lærer.|Jeg er lærer. # Профессия — без артикля.'] },
    { t: 'tr', q: ['Я из Латвии.|Jeg er fra Latvia.', 'Мы дома.|Vi er hjemme.', 'Сколько тебе лет?|Hvor gammel er du?', 'Она художница.|Hun er kunstner.', 'Откуда ты?|Hvor er du fra?|Hvor kommer du fra?'] },
  ],
  read: {
    title: 'Alina og Pelle', intro: 'Обратите внимание: везде одно и то же *er*.',
    txt: ['Alina er kunstner. Hun er fra Latvia, og hun bor i Riga. Hun er tretti år.', 'Alina har en katt. Katten heter Pepper. Pepper er svart og veldig lat.', 'Pelle er en lundefugl. Han er fra Lofoten. Pelle og Alina er venner. Er de glade? Ja, de er veldig glade!'],
    gl: { 'kunstner': 'художник, художница', 'katt': 'кошка, кот', 'svart': 'чёрный', 'veldig': 'очень', 'lat': 'ленивый', 'venner': 'друзья' },
    q: [{ t: 'tf', q: ['Alina er fra Norge.|F # Hun er fra Latvia.', 'Alina er tretti år.|T', 'Katten er hvit.|F # Pepper er svart.', 'Pelle og Alina er venner.|T'] },
      { t: 'choice', q: ['Hva er Alina?|kunstner|lærer|lege', 'Hvordan er Pepper?|svart og lat|hvit og rask|liten og sint'] }],
  },
  series: [{ show: 'kultur', who: 'типично норвежское', q: 'Du, altså…', mean: '«Ты» — со всеми: с коллегой, начальником, королём (ну, почти). Вежливое <i>De</i> осталось в старых книгах и у очень пожилых людей.', fun: 'Иностранцы иногда пугаются, когда врач говорит им «du». Это не грубость — это норвежское равенство.', use: 'Unnskyld, kan du hjelpe meg?', qz: 'Как обратиться к незнакомому продавцу в Осло?|на «du»|только на «De»|по фамилии и на «De» # В Норвегии почти всегда du.' }],
  write: { h: 'Расскажите о себе и о друге: кто вы, откуда, сколько лет, какие вы.', min: 20, use: ['jeg er', 'fra', 'han', 'hun'],
    plan: ['Jeg er … (кто вы)', 'Jeg er fra …', 'Мой друг / подруга: Han/Hun er …', 'Какие вы сегодня: glad, trøtt'],
    model: 'Jeg heter Anna. Jeg er lærer, og jeg er fra Latvia.\nJeg er tjueåtte år.\nVennen min heter Lars. Han er fra Bergen.\nI dag er vi glade.' },
  vid: [['NorwegianClass101', 'personal pronouns Norwegian'], ['Learn Norwegian Naturally', 'å være å ha Norwegian'], ['NorwegianClass101', 'introduce yourself in Norwegian']],
  fact: 'В норвежском глаголы перестали меняться по лицам примерно 500 лет назад. Шведы и датчане тоже говорят «jag är / jeg er» для всех — скандинавские языки тут одинаково ленивы (и это прекрасно).',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian pronouns', 'https://en.wikibooks.org/wiki/Norwegian'], ['Ordbøkene — være', 'https://ordbokene.no/']],
});
NOTE('a1-2', {
  crow: 'Сегодня — *er*. Одно слово на всех: я, ты, мы, они. Норвежцы — экономный народ. Даже глаголы у них общие.',
  mk: ['Напишите, откуда вы и сколько вам лет.|er;fra|Jeg er fra Latvia og jeg er tretti år.', 'Опишите друга или кота: какой он?|han/hun|Katten min heter Pepper og han er veldig lat.', 'Спросите собеседника, откуда он (вопрос!).|hvor|Hvor er du fra, og hvor bor du nå?'],
  etym: [['glad', 'по-норвежски значит «радостный», как английское *glad*. А вот русское «гладкий» — дальний родственник: «гладкий, сияющий» → «радостный».'], ['venn', 'друг; родня английского *win* и немецкого *Wonne* (блаженство). Друг — тот, с кем хорошо.']],
  ru: 'Пелле узнаёт, что в его семье все разные: мама весёлая, папа серьёзный, а бабушка — мудрая. А дедушки нет. «Где дедушка?» — спрашивает Пелле.',
  gl: { 'mamma': 'мама', 'pappa': 'папа', 'blid': 'весёлая, приветливая', 'alvorlig': 'серьёзный', 'bestemor': 'бабушка', 'klok': 'мудрая', 'bestefar': 'дедушка', 'borte': 'нет, далеко, пропал', 'sjømann': 'моряк' },
  tf: ['Mamma er blid.|T', 'Bestefar er hjemme.|F # Bestefar er borte.', 'Bestefar er sjømann.|T # «Han er sjømann».'],
  ch: ['Hvem er klok?|bestemor|pappa|Pelle # Bestemor er gammel og klok.'],
  bmk: ['Опишите кого-то из своей семьи одним-двумя предложениями: *Mamma er …*|er|Mamma er blid og pappa er alvorlig.'],
  etb: '*Bestefar* — «лучший отец» (*beste* + *far*). А бабушка — *bestemor*, «лучшая мать». В шведском, впрочем, бабушки скромнее: *mormor* — «мамина мама».',
});
ST('a1-2', { t: 'Откуда ты?', tip: 'Вопрос *Hvor er du fra?* — самый частый вопрос иностранцу. Ответьте и добавьте одну деталь: *Jeg er fra Latvia, fra Riga.* А потом — встречный вопрос. Норвежцы любят, когда интересуются их родным городом.',
  sit: 'Знакомство на курсах рисования в Осло.', ph: [['Hvor er du fra?', 'Откуда ты?'], ['Jeg er fra Latvia.', 'Я из Латвии.'], ['Og du?', 'А ты?'], ['Hyggelig å møte deg!', 'Приятно познакомиться!']],
  dlg: ['Новая знакомая: «Hvor er du fra?»|Jeg er fra Latvia. Og du?|Fra.|Jeg har Latvia. # Ответ + встречный вопрос.', 'Новый знакомый: «Hyggelig å møte deg!»|I like måte!|Takk, jeg vet.|Ja. # *I like måte* — «взаимно».'],
  mk: 'Напишите, откуда вы, и спросите собеседника о том же.|fra|Jeg er fra Riga i Latvia. Hvor er du fra?' });
BK('a1-2', 'Kapittel 2. Hvor er bestefar?', ['Pelle har en mamma. Mamma er blid. Pelle har en pappa. Pappa er alvorlig, men snill.', 'Pelle har en bestemor også. Bestemor er gammel og klok. Hun er nitti år!', '«Hvor er bestefar?» spør Pelle. Bestemor er stille. «Bestefar er borte,» sier hun. «Han er sjømann. Han er langt borte.»', 'Pelle er trist. «Er han i Norge?» spør han. «Jeg vet ikke,» sier bestemor.']);

U({
  id: 'a1-3', lvl: 'A1', t: 'Presens: глагол + r', en: 'Presens — nåtid',
  goals: ['ставить глагол в настоящее время: *snakke → snakker*', 'говорить, что вы делаете обычно и сейчас', 'использовать *å* перед инфинитивом'],
  th: `<p>Ещё одна приятная новость: настоящее время (<b>presens</b>) образуется почти всегда одинаково — <b>к инфинитиву добавляется -r</b>. И форма одна для всех лиц.</p>
  <div class="tbl"><table><thead><tr><th>Инфинитив</th><th>Presens</th><th>Пример</th></tr></thead><tbody>
  <tr><td><i>å snakke</i> — говорить</td><td><i>snakker</i></td><td><i>Jeg snakker norsk.</i></td></tr>
  <tr><td><i>å bo</i> — жить</td><td><i>bor</i></td><td><i>Hun bor i Oslo.</i></td></tr>
  <tr><td><i>å tegne</i> — рисовать</td><td><i>tegner</i></td><td><i>Alina tegner fugler.</i></td></tr>
  <tr><td><i>å drikke</i> — пить</td><td><i>drikker</i></td><td><i>Vi drikker kaffe.</i></td></tr></tbody></table></div>
  <h4>Исключения (их мало, но они частые)</h4>
  <p><i>å være → er</i>, <i>å gjøre → gjør</i> (делать), <i>å si → sier</i> (говорить, сказать), <i>å spørre → spør</i> (спрашивать), <i>å vite → vet</i> (знать), <i>å ville → vil</i>, <i>å kunne → kan</i>, <i>å skulle → skal</i>, <i>å måtte → må</i>.</p>
  <h4>Presens = «обычно» и «сейчас»</h4>
  <p>В норвежском нет отдельного «длительного» времени, как английское <i>I am drinking</i>. <i>Jeg drikker kaffe</i> — это и «я пью кофе (обычно)», и «я пью кофе (сейчас)». Хотите подчеркнуть «прямо сейчас» — скажите <i>Jeg holder på å drikke kaffe</i> или просто добавьте <i>nå</i>: <i>Jeg drikker kaffe nå.</i></p>
  <h4>Частица <i>å</i></h4>
  <p><i>å</i> перед глаголом — как английское <i>to</i>: <i>å spise</i> — есть, <i>Jeg liker å tegne</i> — я люблю рисовать. Но после модальных глаголов (<i>kan, vil, skal, må, bør</i>) <i>å</i> <b>не ставится</b>: <i>Jeg kan tegne. Vi må gå.</i></p>`,
  simple: 'инфинитив + r = настоящее время, для всех. snakke → snakker. Исключения: er, gjør, sier, vet, vil, kan, skal, må.',
  exm: [['Jeg snakker litt norsk.', 'Я немного говорю по-норвежски.'], ['Alina tegner fugler hver dag.', 'Алина рисует птиц каждый день.'], ['Vi drikker kaffe nå.', 'Мы сейчас пьём кофе.'], ['Hva gjør du?', 'Что ты делаешь?']],
  conf: [['*Jeg kan snakke* / *Jeg kan å snakke*', 'После <i>kan, vil, skal, må</i> — без <i>å</i>: <i>Jeg kan snakke norsk</i>. После <i>liker</i> — с <i>å</i>: <i>Jeg liker å snakke</i>.', '«Я умею рисовать»:|Jeg kan tegne.|Jeg kan å tegne.|Jeg kan tegner. # После kan — голый инфинитив.'],
    ['*Jeg drikker* / *Jeg er drikker*', 'Никакого «er» перед глаголом: <i>Jeg drikker kaffe</i> = «я пью / я сейчас пью кофе».', '«Я сейчас читаю»:|Jeg leser nå.|Jeg er leser nå.|Jeg er lese nå. # Presens — и «сейчас» тоже.']],
  words: [['å snakke', 'говорить', 'Jeg snakker norsk.'], ['å bo', 'жить', 'Vi bor i Riga.'], ['å tegne', 'рисовать', 'Hun tegner fugler.'], ['å drikke', 'пить', 'Jeg drikker te.'], ['å spise', 'есть', 'Pelle spiser fisk.'], ['å lese', 'читать', 'Han leser en bok.'], ['å jobbe', 'работать', 'Jeg jobber hjemme.'], ['å like', 'нравиться, любить', 'Jeg liker å lese.'], ['litt', 'немного', 'Jeg snakker litt norsk.'], ['hver dag', 'каждый день', 'Jeg tegner hver dag.']],
  ex: [
    { t: 'gap', h: 'Поставьте глагол в presens.', q: ['Jeg ___ norsk. (snakke)|snakker', 'Hun ___ i Oslo. (bo)|bor', 'Vi ___ kaffe. (drikke)|drikker', 'Hva ___ du? (gjøre)|gjør', 'Pelle ___ fisk. (spise)|spiser', 'Jeg ___ ikke. (vite)|vet'] },
    { t: 'choice', h: 'Выберите правильный вариант.', q: ['«Я умею рисовать»:|Jeg kan tegne.|Jeg kan å tegne.|Jeg kan tegner. # После kan — без å.', '«Я люблю читать»:|Jeg liker å lese.|Jeg liker lese.|Jeg liker leser. # После liker — с å.', '«Она сейчас работает»:|Hun jobber nå.|Hun er jobber nå.|Hun jobbe nå. # Presens = и «сейчас».', '«Что ты говоришь?»:|Hva sier du?|Hva si du?|Hva siker du? # å si → sier.', '«Мы должны идти»:|Vi må gå.|Vi må å gå.|Vi må går. # После må — инфинитив без å.'] },
    { t: 'order', q: ['Jeg snakker litt norsk.', 'Alina tegner fugler hver dag.', 'Vi drikker kaffe nå.', 'Hva gjør du i dag?', 'Jeg liker å lese bøker.', 'Han kan ikke svømme.|Han kan ikke svømme'] },
    { t: 'fix', q: ['Jeg kan å snakke norsk.|Jeg kan snakke norsk. # После kan — без å.', 'Hun er tegner nå.|Hun tegner nå. # er не нужен.', 'Vi drikke kaffe.|Vi drikker kaffe. # В presens — с -r.', 'Jeg liker lese.|Jeg liker å lese. # После liker нужно å.'] },
    { t: 'tr', q: ['Я говорю по-норвежски.|Jeg snakker norsk.', 'Она живёт в Риге.|Hun bor i Riga.', 'Мы пьём чай.|Vi drikker te.', 'Я люблю рисовать.|Jeg liker å tegne.', 'Что ты делаешь?|Hva gjør du?|Hva holder du på med?'] },
  ],
  read: {
    title: 'En dag med Alina', intro: 'Найдите в тексте все глаголы на -r.',
    txt: ['Alina står opp klokka sju. Hun drikker kaffe og spiser brød med ost.', 'Hun jobber hjemme. Hun tegner fugler, katter og fjell. Katten Pepper sover på bordet.', 'Om kvelden leser Alina en bok, eller hun lærer norsk. Hun snakker litt norsk nå!'],
    gl: { 'står opp': 'встаёт', 'klokka sju': 'в семь часов', 'brød': 'хлеб', 'ost': 'сыр', 'fjell': 'горы', 'sover': 'спит', 'bordet': 'на столе (стол)', 'om kvelden': 'вечером', 'eller': 'или', 'lærer': 'учит' },
    q: [{ t: 'tf', q: ['Alina står opp klokka ni.|F # Klokka sju.', 'Alina jobber hjemme.|T', 'Pepper sover på bordet.|T', 'Alina snakker ikke norsk.|F # Hun snakker litt norsk nå.'] },
      { t: 'choice', q: ['Hva spiser Alina?|brød med ost|fisk|kake', 'Hva gjør Alina om kvelden?|leser eller lærer norsk|tegner fjell|sover'] }],
  },
  series: [{ show: 'ordtak', who: 'норвежская пословица', q: 'Øvelse gjør mester.', mean: '«Упражнение делает мастера» — повторение мать учения.', fun: 'Обратите внимание: <i>gjør</i> — это presens от <i>gjøre</i>, одно из немногих исключений.', use: 'Jeg øver hver dag. Øvelse gjør mester!', qz: '«Øvelse gjør mester» значит…|повторение — мать учения|мастер делает упражнения|упражнения — для мастеров # øvelse — упражнение, mester — мастер.' }],
  write: { h: 'Опишите свой обычный день: 5–6 предложений в presens.', min: 30, use: ['drikker', 'jobber', 'liker å', 'hver dag'],
    plan: ['Когда вы встаёте (klokka …).', 'Что пьёте и едите утром.', 'Где работаете и что делаете.', 'Что вы любите делать вечером (liker å …).'],
    model: 'Jeg står opp klokka åtte.\nJeg drikker te og spiser brød.\nJeg jobber på et kontor i Riga.\nOm kvelden liker jeg å lese og tegne.\nJeg lærer norsk hver dag.' },
  vid: [['NorwegianClass101', 'Norwegian present tense'], ['Learn Norwegian Naturally', 'presens Norwegian verbs'], ['NorwegianClass101', 'daily routine in Norwegian']],
  fact: 'Норвежцы встают и ужинают рано: обычный ужин (<i>middag</i>) — в 16–17 часов, сразу после работы. А в 21 час можно съесть ещё и <i>kveldsmat</i> — «вечернюю еду», бутерброд.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian verbs', 'https://en.wikibooks.org/wiki/Norwegian'], ['Ordbøkene', 'https://ordbokene.no/']],
});
NOTE('a1-3', {
  crow: 'Presens — моя любимая тема. Добавил *r* — и готово. Если бы рыбалка была такой же простой!',
  mk: ['Напишите, что вы делаете *каждый день*.|hver dag|Jeg tegner og drikker kaffe hver dag.', 'Напишите, что вы *любите делать* (liker å …).|liker å|Jeg liker å lese bøker om kvelden.', 'Напишите, что вы *умеете* делать (kan …).|kan|Jeg kan tegne katter og fugler.'],
  etym: [['å tegne', '«рисовать» — от *tegn*, «знак». Рисовать — значит ставить знаки. Родня английского *token* и немецкого *Zeichen*.'], ['å snakke', 'родственно английскому *snack* через старое «щёлкать, болтать». Болтовня и перекус — оба «щёлкают» челюстями.']],
  ru: 'Пелле не может забыть дедушку. Каждый день он рыбачит, ест рыбу, пьёт кофе — и думает: где же дедушка? Бабушка рассказывает, что дедушка любил петь и рисовать карты.',
  gl: { 'fisker': 'ловит рыбу', 'tenker': 'думает', 'forteller': 'рассказывает', 'synger': 'поёт', 'kart': 'карты (карта)', 'savner': 'скучает', 'hver morgen': 'каждое утро' },
  tf: ['Pelle fisker hver morgen.|T', 'Bestefar tegner kart.|T # Han tegner kart.', 'Bestemor savner ikke bestefar.|F # Hun savner ham.'],
  ch: ['Hva gjør bestefar også?|synger|danser|maler hus # Han synger.'],
  bmk: ['Что вы делаете каждое утро? Одно-два предложения.|hver morgen|Hver morgen drikker jeg kaffe og tegner litt.'],
  etb: '*Kart* — карта; родня латинского *charta*, «лист бумаги». Отсюда же русские «карта», «картон» и даже «хартия».',
});
ST('a1-3', { t: 'Что ты делаешь?', tip: 'Вопрос *Hva gjør du?* значит и «что делаешь сейчас?», и «чем занимаешься?» (работа). Отвечайте одним предложением — и спросите в ответ: *Og du?*',
  sit: 'Сообщение от подруги в мессенджере.', ph: [['Hva gjør du?', 'Что делаешь?'], ['Jeg tegner litt.', 'Немного рисую.'], ['Ikke noe spesielt.', 'Ничего особенного.'], ['Og du?', 'А ты?']],
  dlg: ['Подруга пишет: «Hva gjør du?»|Jeg drikker kaffe og tegner. Og du?|Jeg er drikker kaffe.|Gjør. # Presens + встречный вопрос.', 'Новый знакомый: «Hva jobber du med?»|Jeg er kunstner.|Jeg jobber med.|Kunst er fint. # Профессия — без артикля.'],
  mk: 'Ответьте на *Hva gjør du?* и спросите в ответ.|og du|Jeg leser en bok nå. Og du?' });
BK('a1-3', 'Kapittel 3. Bestefar synger', ['Hver morgen fisker Pelle. Han spiser fisk, og han drikker kaffe. Og han tenker på bestefar.', 'Bestemor forteller om bestefar. «Bestefar synger hele dagen,» sier hun. «Han tegner kart også. Han tegner fine kart over hele Norge.»', 'Bestemor smiler, men hun er trist. Hun savner bestefar. Pelle savner ham også, men han kjenner ham ikke.', '«Jeg vil finne bestefar,» sier Pelle.']);

U({
  id: 'a1-4', lvl: 'A1', t: 'Существительные: en, ei, et', en: 'Substantiv og kjønn',
  goals: ['различать три рода: *en bil, ei bok, et hus*', 'ставить множественное число: *biler, bøker, hus*', 'учить слова сразу с артиклем'],
  th: `<p>В норвежском три рода, как в русском: мужской, женский и средний. Род показывает <b>неопределённый артикль</b> перед словом — как английское <i>a/an</i>, но их три.</p>
  <div class="tbl"><table><thead><tr><th>Род</th><th>Артикль</th><th>Примеры</th></tr></thead><tbody>
  <tr><td>мужской</td><td><b>en</b></td><td><i>en bil</i> (машина), <i>en katt</i>, <i>en venn</i></td></tr>
  <tr><td>женский</td><td><b>ei</b> (или en)</td><td><i>ei bok</i> (книга), <i>ei jente</i> (девочка), <i>ei hytte</i> (домик)</td></tr>
  <tr><td>средний</td><td><b>et</b></td><td><i>et hus</i> (дом), <i>et eple</i> (яблоко), <i>et kart</i></td></tr></tbody></table></div>
  <p><b>Важно:</b> в букмоле женский род можно заменить мужским: <i>en bok</i> тоже правильно. Поэтому на практике чаще всего выбираете между <b>en</b> и <b>et</b>. Примерно 75 % слов — <i>en</i>.</p>
  <p>Род в норвежском <b>не совпадает</b> с русским: <i>et hus</i> — средний, хотя «дом» мужской; <i>en bil</i> — мужской, хотя «машина» женская. Учите слово сразу с артиклем: не «bil», а «en bil».</p>
  <h4>Множественное число: обычно -er</h4>
  <ul><li><i>en bil → biler</i>, <i>ei jente → jenter</i>, <i>en venn → venner</i> (на -e: только -r).</li>
  <li>Короткие слова среднего рода — <b>без окончания</b>: <i>et hus → hus</i>, <i>et barn → barn</i> (дети), <i>et år → år</i>.</li>
  <li>Исключения: <i>en mann → menn</i>, <i>ei bok → bøker</i>, <i>et øye → øyne</i> (глаза), <i>en sko → sko</i>.</li></ul>
  <h4>Когда артикль не нужен</h4>
  <p>Перед профессией и национальностью (<i>Hun er lege</i>), перед «неисчисляемым» (<i>Jeg drikker kaffe</i>), и с <i>har</i> в устойчивых выражениях: <i>Jeg har bil</i> — у меня есть машина (вообще).</p>`,
  simple: 'en — мужской (и большинство слов), ei — женский (можно en), et — средний. Мн. ч.: + er; короткие et-слова — без окончания.',
  exm: [['Jeg har en katt og et hus.', 'У меня есть кот и дом.'], ['Hun leser ei bok.', 'Она читает книгу.'], ['Vi har to barn.', 'У нас двое детей.'], ['Pelle har mange venner.', 'У Пелле много друзей.']],
  conf: [['*et hus* / *en hus*', 'Род не по-русски: «дом» — <i>et hus</i>, «машина» — <i>en bil</i>. Учите с артиклем.', '«Дом» по-норвежски:|et hus|en hus|ei hus # hus — средний род.'],
    ['*to hus* / *to huser*', 'Короткие слова среднего рода во множественном — без окончания: <i>et hus — to hus, et barn — tre barn</i>.', '«Три ребёнка»:|tre barn|tre barner|tre barna # barn — без окончания.']],
  words: [['en bil', 'машина', 'Vi har en rød bil.'], ['ei bok', 'книга', 'Jeg leser ei bok.'], ['et hus', 'дом', 'De bor i et stort hus.'], ['en katt', 'кошка, кот', 'Hun har en katt.'], ['et barn', 'ребёнок', 'De har to barn.'], ['ei jente', 'девочка', 'Jenta heter Mari.'], ['en gutt', 'мальчик', 'Gutten er fem år.'], ['et eple', 'яблоко', 'Jeg spiser et eple.'], ['en kopp', 'чашка', 'En kopp kaffe, takk!'], ['mange', 'много (штук)', 'Vi har mange bøker.']],
  ex: [
    { t: 'gap', h: 'en, ei или et?', q: ['Jeg har ___ hus. (дом)|et', 'Hun har ___ katt.|en', 'Vi leser ___ bok.|ei/en # ei bok, но можно и en bok.', 'Han spiser ___ eple.|et', '___ kopp kaffe, takk!|En', 'De har ___ barn.|et'] },
    { t: 'gap', h: 'Поставьте во множественное число.', q: ['to ___ (en bil)|biler', 'tre ___ (en venn)|venner', 'fire ___ (et hus)|hus # Короткое et-слово.', 'mange ___ (ei bok)|bøker # Исключение.', 'to ___ (ei jente)|jenter', 'fem ___ (et barn)|barn'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['«У меня двое детей»:|Jeg har to barn.|Jeg har to barner.|Jeg har to barna. # barn — без окончания.', '«Я пью кофе»:|Jeg drikker kaffe.|Jeg drikker en kaffe.|Jeg drikker et kaffe. # Неисчисляемое — без артикля (а «чашку кофе» — en kopp kaffe).', '«две книги»:|to bøker|to boker|to bok # Исключение: bok → bøker.', '«много мужчин»:|mange menn|mange manner|mange mann # mann → menn.'] },
    { t: 'order', q: ['Jeg har en katt og et hus.', 'Hun leser ei bok nå.', 'Vi har to barn.', 'Pelle har mange venner.', 'En kopp kaffe takk.|En kopp kaffe, takk'] },
    { t: 'tr', q: ['У меня есть кот.|Jeg har en katt.|Jeg har katt.', 'Она читает книгу.|Hun leser ei bok.|Hun leser en bok.', 'У нас три ребёнка.|Vi har tre barn.', 'Чашку кофе, пожалуйста.|En kopp kaffe, takk.|En kopp kaffe, er du snill.'] },
  ],
  read: {
    title: 'Hytta', intro: 'Найдите в тексте все en, ei и et.',
    txt: ['Familien til Lars har ei hytte på fjellet. Hytta er liten og gammel, men koselig.', 'I hytta er det et kjøkken, to soverom og en stor peis. Det er ikke strøm, men de har mange lys.', 'Lars har to barn, ei jente og en gutt. Barna elsker hytta. De går på ski og spiser vafler.'],
    gl: { 'hytte': 'домик, дача', 'fjellet': 'в горах (гора)', 'gammel': 'старый', 'koselig': 'уютный', 'kjøkken': 'кухня', 'soverom': 'спальни', 'peis': 'камин', 'strøm': 'электричество', 'lys': 'свечи (свет)', 'går på ski': 'катаются на лыжах', 'vafler': 'вафли' },
    q: [{ t: 'tf', q: ['Hytta er stor og ny.|F # Hytta er liten og gammel.', 'Det er en peis i hytta.|T', 'Det er strøm i hytta.|F # Det er ikke strøm.', 'Lars har to barn.|T'] },
      { t: 'choice', q: ['Hva gjør barna på hytta?|går på ski og spiser vafler|ser på TV|jobber', 'Hvor mange soverom er det?|to|ett|fire'] }],
  },
  series: [{ show: 'kultur', who: 'типично норвежское', q: 'Vi drar på hytta!', mean: '«Едем на хитту!» — в дом в горах или у моря. Около полумиллиона норвежских семей имеют хитту.', fun: 'Настоящая хитта — чем проще, тем лучше: без электричества, с дровами и туалетом на улице. Норвежцы едут за 300 км, чтобы колоть дрова — и счастливы.', use: 'I helgen drar vi på hytta.', qz: 'Что такое «hytte» для норвежца?|домик на природе для отдыха|гостиница в городе|рыболовная лодка # Hytte — дача, домик в горах или у моря.' }],
  write: { h: 'Опишите свою квартиру или дом: что там есть (det er …).', min: 25, use: ['det er', 'en', 'et', 'mange'],
    plan: ['Где вы живёте: Jeg bor i en leilighet / et hus.', 'Что есть в доме: Det er et kjøkken, …', 'Кто живёт с вами (кот?).', 'Какой ваш дом: koselig, liten, stor.'],
    model: 'Jeg bor i en leilighet i Riga.\nDet er et kjøkken, et bad og to rom.\nJeg har en katt og mange bøker.\nLeiligheten er liten, men koselig.' },
  vid: [['NorwegianClass101', 'Norwegian noun gender en ei et'], ['Learn Norwegian Naturally', 'Norwegian plural nouns'], ['NorwegianClass101', 'Norwegian cabin culture hytte']],
  fact: 'В Норвегии больше 400 000 хитт — примерно одна на каждые 13 жителей. Многие построены дедушками и передаются по наследству.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Ordbøkene — род слова', 'https://ordbokene.no/'], ['Wikibooks — Norwegian nouns', 'https://en.wikibooks.org/wiki/Norwegian']],
});
NOTE('a1-4', {
  crow: 'Три рода: en, ei, et. Если сомневаетесь — говорите *en*: три раза из четырёх угадаете. Я так с рыбой делаю — ныряю наугад.',
  mk: ['Напишите, что у вас есть (dyr, ting): два предмета с артиклем.|har|Jeg har en katt og et stort kart.', 'Напишите, что у вас много (mange + мн. ч.).|mange|Jeg har mange bøker og mange venner.', 'Закажите в кафе: чашку кофе и что-нибудь ещё.|kopp|En kopp kaffe og en vaffel, takk!'],
  etym: [['hytte', 'родня немецкого *Hütte* и английского *hut* — «хижина». Норвежская хитта — та же хижина, только с видом на фьорд.'], ['eple', 'как английское *apple*. В древности так называли любой круглый плод. Отсюда и «яблоко» в русском — общий индоевропейский предок.']],
  ru: 'Пелле решает искать дедушку и собирает вещи: книгу, карту, чашку для кофе. Бабушка даёт ему старую карту дедушки — на ней красный крестик.',
  gl: { 'pakker': 'пакует, собирает', 'sekk': 'рюкзак', 'kopp': 'чашка', 'gammelt': 'старое', 'kryss': 'крестик', 'rødt': 'красный', 'tar med': 'берёт с собой' },
  tf: ['Pelle har en sekk.|T', 'Kartet er nytt.|F # Det er et gammelt kart.', 'Det er et rødt kryss på kartet.|T'],
  ch: ['Hva gir bestemor til Pelle?|et gammelt kart|en ny sekk|ei bok # «Ta kartet,» sier bestemor.'],
  bmk: ['Что вы взяли бы в путешествие? Три вещи с артиклем.|en;et|Jeg tar med en bok, et kart og en kopp.'],
  etb: '*Sekk* — рюкзак (и мешок); от латинского *saccus*. Русское «саквояж» и английское *sack* — того же рода. А «рюкзак» по-норвежски ещё и *ryggsekk* — «спинной мешок».',
});
ST('a1-4', { t: 'В кафе: заказать', tip: 'В норвежском кафе обычно заказывают у стойки и платят сразу. Достаточно *En kopp kaffe, takk!* «Пожалуйста» как отдельного слова почти нет — вежливость делает *takk* в конце.',
  sit: 'Кафе в Бергене, вы у стойки.', ph: [['Hva vil du ha?', 'Что желаете?'], ['En kopp kaffe, takk.', 'Чашку кофе, спасибо.'], ['Og en skolebolle.', 'И булочку «школьную».'], ['Det blir femti kroner.', 'С вас пятьдесят крон.']],
  dlg: ['Бариста: «Hva vil du ha?»|En kopp kaffe, takk.|Kaffe er.|Jeg vil har kaffe. # Коротко + takk.', 'Бариста: «Det blir femti kroner.» Вы платите картой.|Vær så god. Takk!|Hvorfor?|Nei. # *Vær så god* — «пожалуйста» (протягивая).'],
  mk: 'Закажите что-нибудь в кафе одной-двумя фразами.|takk|En kopp te og et eple, takk.' });
BK('a1-4', 'Kapittel 4. En sekk og et kart', ['Pelle pakker en sekk. Han tar med ei bok, en kopp og et lite brød.', 'Bestemor kommer med et gammelt kart. «Dette er kartet til bestefar,» sier hun. «Ta det med.»', 'Pelle ser på kartet. Det er mange fjell, mange øyer og mange byer på kartet. Og i Oslo er det et lite, rødt kryss.', '«Hva er det?» spør Pelle. «Jeg vet ikke,» sier bestemor. «Men kanskje bestefar er der.»']);

U({
  id: 'a1-5', lvl: 'A1', t: 'Порядок слов: глагол на втором месте', en: 'Ordstilling: V2 og spørsmål',
  goals: ['ставить глагол на второе место: *I dag drikker jeg kaffe*', 'задавать вопросы: *Drikker du kaffe? Hva drikker du?*', 'знать вопросительные слова *hva, hvor, når, hvem, hvorfor, hvordan*'],
  th: `<p>Главное правило норвежского: <b>в обычном предложении глагол стоит на втором месте</b>. Не «второе слово», а <b>второе место</b>: первое место может занимать целая группа слов.</p>
  <div class="tbl"><table><thead><tr><th>1 место</th><th>2 место (глагол)</th><th>подлежащее</th><th>остальное</th></tr></thead><tbody>
  <tr><td><i>Jeg</i></td><td><i>drikker</i></td><td></td><td><i>kaffe i dag.</i></td></tr>
  <tr><td><i>I dag</i></td><td><i>drikker</i></td><td><i>jeg</i></td><td><i>kaffe.</i></td></tr>
  <tr><td><i>Om morgenen</i></td><td><i>tegner</i></td><td><i>Alina</i></td><td><i>fugler.</i></td></tr>
  <tr><td><i>Kaffe</i></td><td><i>liker</i></td><td><i>jeg</i></td><td><i>ikke.</i></td></tr></tbody></table></div>
  <p>Если предложение начинается не с подлежащего (с «сегодня», «вечером», «в Осло»), подлежащее <b>перескакивает за глагол</b>. Это называется <b>инверсия</b>. Говорящие по-русски и по-английски чаще всего ошибаются именно тут: «I dag jeg drikker» — неправильно!</p>
  <h4>Вопрос «да/нет»: глагол — первым</h4>
  <p><i>Du drikker kaffe.</i> → <i><b>Drikker</b> du kaffe?</i> Никаких вспомогательных «do» — просто переставили.</p>
  <h4>Вопрос со словом: слово + глагол + подлежащее</h4>
  <ul><li><i>hva</i> — что: <i>Hva drikker du?</i></li><li><i>hvor</i> — где, куда: <i>Hvor bor du?</i></li><li><i>når</i> — когда: <i>Når kommer du?</i></li><li><i>hvem</i> — кто: <i>Hvem er det?</i></li><li><i>hvorfor</i> — почему: <i>Hvorfor er du trøtt?</i></li><li><i>hvordan</i> — как: <i>Hvordan går det?</i></li><li><i>hvor mye / hvor mange</i> — сколько: <i>Hvor mye koster det?</i></li></ul>`,
  simple: 'глагол — всегда на втором месте. Начали с «I dag» — дальше глагол, потом «jeg». Вопрос — глагол первым.',
  exm: [['I dag drikker jeg te.', 'Сегодня я пью чай.'], ['Bor du i Oslo?', 'Ты живёшь в Осло?'], ['Hvor bor du?', 'Где ты живёшь?'], ['Om kvelden leser vi.', 'Вечером мы читаем.']],
  conf: [['*I dag jeg drikker* / *I dag drikker jeg*', 'После «I dag», «Nå», «Om kvelden» глагол — сразу, подлежащее — за ним.', '«Сегодня я работаю»:|I dag jobber jeg.|I dag jeg jobber.|Jeg i dag jobber. # Глагол на втором месте.'],
    ['*Hvor du bor?* / *Hvor bor du?*', 'В вопросе после вопросительного слова — глагол, потом подлежащее.', '«Где ты живёшь?»:|Hvor bor du?|Hvor du bor?|Du bor hvor? # Вопрос: слово + глагол + подлежащее.']],
  words: [['hva', 'что', 'Hva gjør du?'], ['hvor', 'где, куда', 'Hvor bor du?'], ['når', 'когда', 'Når kommer du?'], ['hvem', 'кто', 'Hvem er det?'], ['hvorfor', 'почему', 'Hvorfor er du glad?'], ['hvordan', 'как', 'Hvordan går det?'], ['i dag', 'сегодня', 'I dag er jeg trøtt.'], ['i morgen', 'завтра', 'I morgen jobber jeg.'], ['nå', 'сейчас', 'Nå spiser vi.'], ['om kvelden', 'вечером', 'Om kvelden leser jeg.']],
  ex: [
    { t: 'order', hint: 'Начните со слова времени — и не забудьте инверсию.', q: ['I dag drikker jeg kaffe.', 'Om kvelden leser Alina.', 'I morgen jobber vi hjemme.', 'Nå spiser Pelle fisk.', 'Hvor bor du nå?', 'Drikker du kaffe om morgenen?'] },
    { t: 'choice', h: 'Где глагол на своём месте?', q: ['Выберите верное:|I dag er jeg trøtt.|I dag jeg er trøtt.|Jeg i dag er trøtt. # Глагол на втором месте.', 'Выберите верное:|Hvor bor du?|Hvor du bor?|Bor hvor du? # Вопрос: слово + глагол + подлежащее.', 'Выберите верное:|Snakker du norsk?|Du snakker norsk?|Gjør du snakker norsk? # Вопрос да/нет — глагол первым.', 'Выберите верное:|Om morgenen tegner hun.|Om morgenen hun tegner.|Hun om morgenen tegner. # Инверсия.', 'Выберите верное:|Hva heter du?|Hva du heter?|Du heter hva? # hva + глагол + du.'] },
    { t: 'fix', q: ['I dag jeg jobber.|I dag jobber jeg. # Инверсия.', 'Hvor du er fra?|Hvor er du fra? # Глагол после вопросительного слова.', 'Om kvelden vi leser.|Om kvelden leser vi. # Глагол на втором месте.', 'Du liker fisk? (вопрос)|Liker du fisk? # Вопрос — глагол первым.', 'Nå Pelle spiser.|Nå spiser Pelle. # После nå — глагол.'] },
    { t: 'tr', q: ['Сегодня я пью чай.|I dag drikker jeg te.|Jeg drikker te i dag.', 'Где ты живёшь?|Hvor bor du?', 'Ты говоришь по-норвежски?|Snakker du norsk?', 'Завтра мы работаем.|I morgen jobber vi.|Vi jobber i morgen.', 'Почему ты устал?|Hvorfor er du trøtt?'] },
  ],
  read: {
    title: 'Mange spørsmål', intro: 'Посмотрите, где стоит глагол в каждом предложении.',
    txt: ['Mari er ei måke. Hun bor i Bodø. Mari liker å spørre om alt.', '«Hvem er du? Hvor kommer du fra? Hvorfor er du her?» spør hun. Pelle smiler.', '«Jeg heter Pelle. Jeg kommer fra Røst. I dag reiser jeg til Oslo.» «Til Oslo? Hvordan?» spør Mari. «Det vet jeg ikke ennå,» sier Pelle.'],
    gl: { 'måke': 'чайка', 'spørre': 'спрашивать', 'alt': 'всё', 'smiler': 'улыбается', 'kommer fra': 'родом из', 'reiser': 'еду, путешествую', 'ennå': 'ещё (пока)' },
    q: [{ t: 'tf', q: ['Mari er en lundefugl.|F # Mari er ei måke.', 'Mari bor i Bodø.|T', 'Pelle reiser til Bergen.|F # Til Oslo.', 'Pelle vet ikke hvordan han skal reise.|T # «Det vet jeg ikke ennå.»'] },
      { t: 'choice', q: ['Hva liker Mari?|å spørre om alt|å sove|å fiske', 'Hvor kommer Pelle fra?|Røst|Bodø|Oslo'] }],
  },
  series: [{ show: 'uttrykk', who: 'норвежское выражение', q: 'Det er ikke så farlig.', mean: '«Это не так опасно» = ничего страшного, не беда.', fun: 'Норвежцы говорят это, когда вы пролили кофе, опоздали или разбили чашку. Слово <i>farlig</i> (опасный) тут не про опасность.', use: 'Unnskyld! — Det er ikke så farlig!', qz: 'Вы извинились, что опоздали. Вам говорят: «Det er ikke så farlig». Это значит…|ничего страшного|это опасно|вы плохой человек # farlig — опасный, но выражение значит «не беда».' }],
  write: { h: 'Напишите 5 вопросов новому знакомому и ответьте на них сами.', min: 25, use: ['hva', 'hvor', 'når', 'hvorfor'],
    plan: ['Hva heter du?', 'Hvor bor du?', 'Hva gjør du i dag?', 'Hvorfor lærer du norsk?'],
    model: 'Hva heter du? Jeg heter Anna.\nHvor bor du? Jeg bor i Riga.\nHva gjør du i dag? I dag jobber jeg hjemme.\nHvorfor lærer du norsk? Jeg vil reise til Norge.' },
  vid: [['NorwegianClass101', 'Norwegian word order V2 rule'], ['Learn Norwegian Naturally', 'inversion in Norwegian'], ['NorwegianClass101', 'Norwegian question words']],
  fact: 'Правило «глагол на втором месте» есть почти во всех германских языках — в немецком, голландском, шведском. В английском от него остался только след: <i>Never have I seen…</i>, <i>Here comes the sun</i>.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian word order', 'https://en.wikibooks.org/wiki/Norwegian'], ['Språkrådet', 'https://www.sprakradet.no/']],
});
NOTE('a1-5', {
  crow: 'Глагол — на втором месте. Всегда. Это как моё место на скале: занято, и точка.',
  mk: ['Начните предложение с *I dag* — и не забудьте инверсию.|i dag|I dag drikker jeg kaffe og tegner.', 'Начните с *Om kvelden* и расскажите, что вы делаете.|om kvelden|Om kvelden leser jeg en bok.', 'Задайте вопрос со словом *hvorfor*.|hvorfor|Hvorfor liker du regn og kald vind, Pelle?'],
  etym: [['hva', 'родня английского *what* и латинского *quod*. Буква h в начале — след древнего «кв»: старое *hvat*.'], ['når', 'когда; из старого *nær* — «близко». «Когда?» = «насколько близко (во времени)?».']],
  ru: 'Пелле летит в Бодо — первый большой город на пути. Там он встречает чайку Мари, которая задаёт тысячу вопросов. Мари решает лететь вместе с Пелле.',
  gl: { 'flyr': 'летит', 'by': 'город', 'møter': 'встречает', 'måke': 'чайка', 'nysgjerrig': 'любопытная', 'sammen': 'вместе', 'eventyr': 'приключение' },
  tf: ['I Bodø møter Pelle ei måke.|T', 'Mari er ikke nysgjerrig.|F # Hun er veldig nysgjerrig.', 'Mari vil reise sammen med Pelle.|T'],
  ch: ['Hvorfor vil Mari reise?|hun liker eventyr|hun har jobb i Oslo|hun er trøtt # «Jeg elsker eventyr!»'],
  bmk: ['Задайте Пелле два вопроса о его путешествии.|hvor|Hvor er bestefar? Hvordan reiser du til Oslo?'],
  etb: '*Eventyr* — приключение и сказка одновременно. От латинского *adventura* — «то, что придёт». Отсюда и английское *adventure*. Норвежские народные сказки — *folkeeventyr*.',
});
ST('a1-5', { t: 'Спросить дорогу', tip: 'Начните с *Unnskyld* — «извините». Норвежцы на улице немного стеснительные, но помогают охотно. Если не поняли — *Kan du si det en gang til?* («Можешь сказать ещё раз?»).',
  sit: 'Вы в Осло и ищете вокзал.', ph: [['Unnskyld, hvor er stasjonen?', 'Извините, где вокзал?'], ['Den er der borte.', 'Он вон там.'], ['Kan du si det en gang til?', 'Можешь повторить?'], ['Tusen takk!', 'Большое спасибо!']],
  dlg: ['Вы ищете вокзал.|Unnskyld, hvor er stasjonen?|Hvor stasjonen er?|Stasjon! # Unnskyld + вопрос с правильным порядком.', 'Прохожий объяснил очень быстро.|Kan du si det en gang til?|Hva?!|Jeg forstår ikke norsk, ha det. # Вежливо попросить повторить.'],
  mk: 'Спросите прохожего, где находится что-нибудь (музей, кафе, остановка).|unnskyld;hvor|Unnskyld, hvor er det nærmeste museet?' });
BK('a1-5', 'Kapittel 5. Mari i Bodø', ['Pelle flyr til Bodø. Bodø er en stor by. Det er mange hus, mange biler og mange måker.', 'Der møter han ei måke. Hun heter Mari. Mari er veldig nysgjerrig. «Hvem er du? Hvor kommer du fra? Hvor skal du?» spør hun.', '«Jeg heter Pelle. I dag reiser jeg til Oslo. Jeg leter etter bestefar,» sier Pelle.', '«Oslo! Jeg elsker eventyr!» roper Mari. «Kan jeg komme med?» Pelle smiler. Nå reiser de sammen.']);

U({
  id: 'a1-6', lvl: 'A1', t: 'ikke, числа и время', en: 'Nektelse, tall og klokka',
  goals: ['отрицать: *Jeg liker ikke regn*', 'считать до 100 и называть цену', 'говорить время и дни недели'],
  th: `<p><b>ikke</b> — «не». В простом предложении оно стоит <b>после глагола</b>: <i>Jeg liker <b>ikke</b> regn.</i> (дословно «я люблю не дождь»). Если есть модальный глагол — после него: <i>Jeg kan <b>ikke</b> svømme.</i></p>
  <p>С инверсией — после подлежащего: <i>I dag jobber jeg <b>ikke</b>.</i> А в придаточных предложениях <i>ikke</i> встаёт перед глаголом — это тема B1.</p>
  <h4>Числа</h4>
  <p>0 null, 1 en/ett, 2 to, 3 tre, 4 fire, 5 fem, 6 seks, 7 sju, 8 åtte, 9 ni, 10 ti, 11 elleve, 12 tolv, 13 tretten, 14 fjorten, 15 femten, 16 seksten, 17 sytten, 18 atten, 19 nitten, 20 tjue, 21 tjueen, 30 tretti, 40 førti, 50 femti, 60 seksti, 70 sytti, 80 åtti, 90 nitti, 100 hundre.</p>
  <p>«Двадцать один» — <i>tjueen</i>: десятки, потом единицы, как в русском. (Старый счёт «en og tjue», как в немецком, ещё услышите у бабушек.)</p>
  <h4>Сколько времени?</h4>
  <p><i>Hva er klokka?</i> — Который час? <i>Klokka er tre.</i> — Три часа. <i>halv fire</i> — <b>половина четвёртого</b> (3:30)! Как в русском «половина»: смотрим на следующий час. <i>kvart over tre</i> — 3:15, <i>kvart på fire</i> — 3:45, <i>ti over tre</i> — 3:10.</p>
  <h4>Дни недели — с маленькой буквы</h4>
  <p><i>mandag, tirsdag, onsdag, torsdag, fredag, lørdag, søndag</i>. «В понедельник» — <i>på mandag</i>; «по понедельникам» — <i>på mandager</i> или <i>hver mandag</i>.</p>`,
  simple: 'ikke — после глагола: Jeg liker ikke … halv fire = 3:30 (половина четвёртого). Дни недели — с маленькой буквы.',
  exm: [['Jeg liker ikke regn.', 'Я не люблю дождь.'], ['Klokka er halv fire.', 'Сейчас половина четвёртого.'], ['Det koster femti kroner.', 'Это стоит пятьдесят крон.'], ['På lørdag jobber jeg ikke.', 'В субботу я не работаю.']],
  conf: [['*halv fire* / *3:30*', '<i>halv fire</i> — «половина четвёртого», то есть 3:30, а не 4:30. Как по-русски.', '«halv åtte» — это…|7:30|8:30|8:00 # Смотрим на следующий час.'],
    ['*Jeg ikke liker* / *Jeg liker ikke*', 'В главном предложении <i>ikke</i> — после глагола.', '«Я не пью кофе»:|Jeg drikker ikke kaffe.|Jeg ikke drikker kaffe.|Ikke jeg drikker kaffe. # ikke — после глагола.']],
  words: [['ikke', 'не', 'Jeg vet ikke.'], ['klokka', 'часы, время', 'Hva er klokka?'], ['halv', 'половина', 'Klokka er halv ni.'], ['kvart', 'четверть', 'Kvart over to.'], ['å koste', 'стоить', 'Hva koster det?'], ['en krone', 'крона', 'Det koster ti kroner.'], ['mandag', 'понедельник', 'På mandag jobber jeg.'], ['lørdag', 'суббота', 'På lørdag sover jeg lenge.'], ['søndag', 'воскресенье', 'På søndag går vi tur.'], ['tidlig', 'рано', 'Jeg står opp tidlig.']],
  ex: [
    { t: 'order', hint: 'Поставьте ikke на место.', q: ['Jeg liker ikke regn.', 'Pelle kan ikke svømme.|Pelle kan ikke svømme', 'I dag jobber jeg ikke.', 'Vi drikker ikke kaffe om kvelden.', 'Hun snakker ikke norsk ennå.'] },
    { t: 'choice', h: 'Сколько времени?', q: ['halv fire|3:30|4:30|3:00 # Половина четвёртого.', 'kvart over seks|6:15|5:45|6:45 # over — после.', 'kvart på ti|9:45|10:15|10:45 # på — без (до).', 'ti over to|2:10|1:50|10:02', 'halv tolv|11:30|12:30|12:00'] },
    { t: 'gap', h: 'Напишите число словом.', q: ['3 + 4 = ___|sju/syv', '10 + 10 = ___|tjue', '50 − 10 = ___|førti', '6 × 5 = ___|tretti', '11 + 1 = ___|tolv', '100 − 1 = ___|nittini'] },
    { t: 'fix', q: ['Jeg ikke liker fisk.|Jeg liker ikke fisk. # ikke — после глагола.', 'I dag jeg jobber ikke.|I dag jobber jeg ikke. # Инверсия.', 'På Mandag sover jeg.|På mandag sover jeg. # Дни недели — с маленькой буквы.', 'Det koster femti krone.|Det koster femti kroner. # Мн. ч.: kroner.'] },
    { t: 'tr', q: ['Я не знаю.|Jeg vet ikke.', 'Сколько это стоит?|Hva koster det?|Hvor mye koster det?', 'Который час?|Hva er klokka?', 'В воскресенье я не работаю.|På søndag jobber jeg ikke.|Jeg jobber ikke på søndag.', 'Сейчас половина девятого.|Klokka er halv ni.'] },
  ],
  read: {
    title: 'Hurtigruten', intro: 'Найдите время, цену и все ikke.',
    txt: ['Pelle og Mari står på kaia i Bodø. Båten heter Hurtigruten. Den går klokka tre.', '«Hvor mye koster billetten?» spør Pelle. «Fugler betaler ikke,» sier kapteinen og ler.', 'Klokka er kvart på tre. Mari er nervøs. Hun liker ikke båter. Men Pelle er ikke redd. Han elsker havet.'],
    gl: { 'kaia': 'причал', 'båten': 'корабль (лодка)', 'billetten': 'билет', 'betaler': 'платят', 'kapteinen': 'капитан', 'ler': 'смеётся', 'nervøs': 'нервничает', 'redd': 'испуганный, боится' },
    q: [{ t: 'tf', q: ['Båten går klokka tre.|T', 'Fugler betaler mye.|F # Fugler betaler ikke.', 'Mari liker båter.|F # Hun liker ikke båter.', 'Pelle er ikke redd.|T'] },
      { t: 'choice', q: ['Hva er klokka når Mari er nervøs?|kvart på tre|halv tre|klokka fire', 'Hva heter båten?|Hurtigruten|Fjordline|Color Line'] }],
  },
  series: [{ show: 'ordtak', who: 'норвежская пословица', q: 'Ut på tur, aldri sur.', mean: '«Вышел в поход — никогда не кисни». На прогулке плохого настроения не бывает.', fun: 'Это почти национальный девиз. Норвежцы идут на природу в любую погоду: <i>Det finnes ikke dårlig vær, bare dårlige klær</i> — «нет плохой погоды, есть плохая одежда».', use: 'Det regner, men ut på tur, aldri sur!', qz: 'Что значит «Ut på tur, aldri sur»?|на прогулке не бывает плохого настроения|не ходи в поход, если грустно|в походе всегда кисло # sur — кислый, сердитый.' }],
  write: { h: 'Опишите свою неделю: что вы делаете и чего не делаете в разные дни (с временем).', min: 30, use: ['ikke', 'klokka', 'på mandag', 'på lørdag'],
    plan: ['På mandag … klokka …', 'På onsdag …', 'På lørdag … ikke …', 'На воскресенье — что вы никогда не делаете.'],
    model: 'På mandag står jeg opp klokka sju.\nJeg jobber fra ni til fem.\nPå onsdag tegner jeg om kvelden.\nPå lørdag jobber jeg ikke. Jeg sover lenge.\nPå søndag går jeg tur.' },
  vid: [['NorwegianClass101', 'Norwegian numbers 1-100'], ['Learn Norwegian Naturally', 'telling time in Norwegian'], ['NorwegianClass101', 'Norwegian negation ikke']],
  fact: 'Хуртигрутен («быстрый маршрут») ходит вдоль побережья Норвегии с 1893 года — от Бергена до Киркенеса и обратно за 11–12 дней, заходя в 34 порта. Норвежцы называют его «самым красивым морским путешествием в мире».',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Ordbøkene', 'https://ordbokene.no/'], ['Wikibooks — Norwegian numbers', 'https://en.wikibooks.org/wiki/Norwegian']],
});
NOTE('a1-6', {
  crow: '*ikke* — после глагола. *Jeg liker ikke regn.* Это я, кстати, говорю каждое утро. На Лофотенах.',
  mk: ['Напишите, чего вы *не* любите.|ikke|Jeg liker ikke regn og kald kaffe.', 'Напишите, во сколько вы встаёте (klokka …).|klokka|Jeg står opp klokka halv åtte.', 'Напишите, что вы делаете в субботу.|lørdag|På lørdag går jeg tur med en venn.'],
  etym: [['krone', '«корона». Норвежская крона — с 1875 года, когда Скандинавия ввела общую валюту. Шведская и датская кроны — её сёстры.'], ['lørdag', '«день мытья» — от старого *laugardagr*, «банный день». Викинги мылись по субботам, и англичане удивлялись их чистоплотности.']],
  ru: 'Пелле и Мари садятся на корабль Хуртигрутен. Капитан пускает птиц бесплатно. Мари боится моря, а Пелле — нет.',
  gl: { 'båten': 'корабль', 'kapteinen': 'капитан', 'gratis': 'бесплатно', 'redd': 'боится', 'dekket': 'палуба', 'vinden': 'ветер', 'sjøsyk': 'укачало' },
  tf: ['Båten går klokka seks.|F # Klokka tre.', 'Fugler betaler ikke.|T # Det er gratis.', 'Mari er sjøsyk.|T'],
  ch: ['Hvor sitter Pelle og Mari?|på dekket|i kafeen|på kaia # De sitter på dekket.'],
  bmk: ['Напишите, чего вы боитесь или не боитесь (redd).|redd|Jeg er ikke redd for havet, men jeg er redd for edderkopper.'],
  etb: '*Sjøsyk* — «морем-больной», то есть укачало. По той же модели: *hjemlengsel* — тоска по дому, буквально «домо-тоска». Норвежцы любят склеивать слова.',
});
ST('a1-6', { t: 'Купить билет', tip: 'Цены в Норвегии высокие, и норвежцы сами шутят об этом. Если цена удивила — можно сказать *Oi, det var dyrt!* («Ой, дорого!») с улыбкой: это нормальная реакция, а не грубость.',
  sit: 'Касса на вокзале в Осло.', ph: [['En billett til Bergen, takk.', 'Один билет до Бергена, пожалуйста.'], ['Hvor mye koster det?', 'Сколько стоит?'], ['Når går toget?', 'Когда отходит поезд?'], ['Oi, det var dyrt!', 'Ой, дорого!']],
  dlg: ['Кассир: «Det blir ni hundre kroner.»|Oi, det var dyrt! Men ok.|Jeg ikke betaler.|Nei, du er dyrt. # С улыбкой удивиться — нормально.', 'Вы хотите знать, когда поезд.|Når går toget?|Når toget går?|Tog når? # Вопрос: når + глагол + подлежащее.'],
  mk: 'Купите билет: скажите куда и спросите цену или время.|billett|En billett til Trondheim, takk. Når går toget?' });
BK('a1-6', 'Kapittel 6. Båten går klokka tre', ['Pelle og Mari står på kaia. Båten er stor og hvit. Den går klokka tre.', '«Hvor mye koster det?» spør Pelle. Kapteinen ler. «For fugler er det gratis!»', 'Pelle og Mari sitter på dekket. Vinden er kald. Mari er ikke glad. Hun liker ikke båter, og hun er litt sjøsyk.', 'Men Pelle er ikke redd. Han ser på havet og på fjellene. «Nå begynner eventyret,» sier han.']);
