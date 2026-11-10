// Уровень B1 — придаточные, сильные глаголы, возвратные и sin, пассив, сравнение, связки.

U({
  id: 'b1-1', lvl: 'B1', t: 'Придаточные: at, fordi, som, hvis — и где тогда ikke', en: 'Leddsetninger og BRA-ord',
  goals: ['строить сложные предложения с *at, fordi, som, hvis, når, om*', 'ставить *ikke* и *alltid* перед глаголом в придаточном', 'делать инверсию после придаточного: *Når det regner, leser jeg*'],
  th: `<p>Придаточное предложение начинается со связующего слова (<i>at</i> — что, <i>fordi</i> — потому что, <i>som</i> — который, <i>hvis</i> — если, <i>når</i> — когда, <i>om</i> — ли, <i>selv om</i> — хотя, <i>mens</i> — пока). В нём <b>свой порядок слов</b>.</p>
  <h4>Правило BRA: наречия — перед глаголом</h4>
  <p>В главном предложении <i>ikke</i> стоит после глагола. В придаточном — <b>перед</b> ним. Это касается и других коротких наречий: <i>ikke, aldri, alltid, ofte, også, bare, gjerne</i>. Норвежские учителя называют их «BRA-ord» (по первым буквам: <b>b</b>isetning — <b>r</b>ekkefølge — <b>a</b>dverb).</p>
  <div class="tbl"><table><thead><tr><th>Главное</th><th>Придаточное</th></tr></thead><tbody>
  <tr><td><i>Han kommer <b>ikke</b>.</i></td><td><i>Jeg vet at han <b>ikke</b> kommer.</i></td></tr>
  <tr><td><i>Hun drikker <b>alltid</b> kaffe.</i></td><td><i>…fordi hun <b>alltid</b> drikker kaffe.</i></td></tr>
  <tr><td><i>Jeg har <b>aldri</b> vært der.</i></td><td><i>…selv om jeg <b>aldri</b> har vært der.</i></td></tr></tbody></table></div>
  <p>И ещё: в придаточном <b>нет инверсии</b>: <i>…fordi i dag <s>er jeg</s> jeg er trøtt</i> — обычно просто <i>fordi jeg er trøtt i dag</i>.</p>
  <h4>Придаточное первым — инверсия в главном</h4>
  <p>Всё придаточное занимает <b>первое место</b>, значит, дальше — глагол: <i><u>Når det regner</u>, <b>leser</b> jeg.</i> <i><u>Hvis du vil</u>, <b>kan</b> vi gå.</i></p>
  <h4>som, at и om</h4>
  <ul><li><i>som</i> — который: <i>Jenta som tegner, heter Alina.</i></li><li><i>at</i> — что: <i>Jeg tror at det blir fint.</i> (часто опускается: <i>Jeg tror det blir fint</i>)</li><li><i>om</i> — ли: <i>Jeg vet ikke om han kommer.</i> (не путать с <i>hvis</i> — «если»)</li></ul>`,
  simple: 'в придаточном (at, fordi, som, hvis…) ikke — ПЕРЕД глаголом: …at han ikke kommer. Придаточное первым — потом глагол: Når det regner, leser jeg.',
  exm: [['Jeg vet at han ikke kommer.', 'Я знаю, что он не придёт.'], ['Når det regner, leser jeg.', 'Когда идёт дождь, я читаю.'], ['Jenta som tegner, heter Alina.', 'Девушку, которая рисует, зовут Алина.'], ['Jeg vet ikke om bussen går.', 'Не знаю, ходит ли автобус.']],
  conf: [['*at han kommer ikke* / *at han ikke kommer*', 'В придаточном <i>ikke</i> — перед глаголом.', '«Она говорит, что не устала»:|Hun sier at hun ikke er trøtt.|Hun sier at hun er ikke trøtt.|Hun sier ikke at hun er trøtt. # BRA: ikke перед глаголом.'],
    ['*om* / *hvis*', '<i>om</i> — «ли» (после «знать, спрашивать»); <i>hvis</i> — «если» (условие).', '«Не знаю, придёт ли он»:|Jeg vet ikke om han kommer.|Jeg vet ikke hvis han kommer.|Jeg vet ikke at han kommer. # «ли» — om.']],
  words: [['fordi', 'потому что', 'Jeg er glad fordi sola skinner.'], ['hvis', 'если', 'Hvis det regner, blir vi hjemme.'], ['selv om', 'хотя', 'Vi går ut selv om det er kaldt.'], ['mens', 'пока, в то время как', 'Hun tegner mens han leser.'], ['som', 'который', 'Mannen som bor her, er sjømann.'], ['om', 'ли', 'Jeg lurer på om hun kommer.'], ['å tro', 'думать, верить', 'Jeg tror at du har rett.'], ['å lure på', 'интересоваться, задаваться вопросом', 'Jeg lurer på hvor han er.'], ['sikker', 'уверенный', 'Er du sikker på det?'], ['å håpe', 'надеяться', 'Jeg håper at det blir sol.']],
  ex: [
    { t: 'order', hint: 'Придаточное: ikke / alltid — перед глаголом.', q: ['Jeg vet at han ikke kommer.', 'Hun sier at hun alltid drikker te.', 'Vi blir hjemme fordi det ikke slutter å regne.', 'Når det regner, leser jeg.', 'Hvis du vil, kan vi gå på kino.', 'Jeg lurer på om hun kommer i dag.'] },
    { t: 'choice', h: 'Выберите правильный порядок.', q: ['Выберите верное:|Jeg tror at han ikke liker fisk.|Jeg tror at han liker ikke fisk.|Jeg tror ikke at han liker ikke fisk. # Придаточное: ikke перед глаголом.', 'Выберите верное:|Når jeg er trøtt, drikker jeg kaffe.|Når jeg er trøtt, jeg drikker kaffe.|Når er jeg trøtt, drikker jeg kaffe. # После придаточного — инверсия.', 'Выберите верное:|Hun er glad fordi hun alltid får sove lenge.|Hun er glad fordi hun får alltid sove lenge.|Hun er glad fordi alltid hun får sove lenge. # BRA.', 'Выберите верное:|Jeg vet ikke om han er hjemme.|Jeg vet ikke hvis han er hjemme.|Jeg vet ikke er han hjemme. # «ли» — om.'] },
    { t: 'fix', q: ['Jeg vet at hun kommer ikke.|Jeg vet at hun ikke kommer. # В придаточном ikke — перед глаголом.', 'Hvis det regner, vi blir hjemme.|Hvis det regner, blir vi hjemme. # Инверсия после придаточного.', 'Jeg lurer på hvis han kommer.|Jeg lurer på om han kommer. # «ли» — om.', 'Han sier at han har aldri vært i Bergen.|Han sier at han aldri har vært i Bergen. # aldri — перед глаголом.'] },
    { t: 'gap', h: 'Вставьте at, fordi, som, hvis, når или om.', q: ['Jeg tror ___ det blir fint vær.|at', 'Vi blir hjemme ___ det er storm.|fordi/når/hvis', 'Mannen ___ står der, er kapteinen.|som', '___ du vil, kan du komme.|Hvis', 'Jeg vet ikke ___ butikken er åpen.|om', 'Jeg er glad ___ du er her.|fordi/når'] },
    { t: 'tr', q: ['Я знаю, что он не придёт.|Jeg vet at han ikke kommer.|Jeg vet han ikke kommer.', 'Когда идёт дождь, я читаю.|Når det regner, leser jeg.', 'Если хочешь, можем пойти.|Hvis du vil, kan vi gå.', 'Не знаю, дома ли она.|Jeg vet ikke om hun er hjemme.'] },
  ],
  read: {
    title: 'Hvorfor lærer jeg norsk?', intro: 'Текст Алины. Найдите придаточные предложения и посмотрите, где стоит *ikke*.',
    txt: ['Mange spør meg hvorfor jeg lærer norsk. Jeg svarer at jeg ikke vet helt. Kanskje er det fordi jeg elsker fjell og hav, eller fordi norske bøker er så stille og vakre.', 'Når jeg tegner, hører jeg ofte på norske podkaster. Jeg forstår ikke alt, men jeg merker at jeg forstår mer hver uke.', 'Hvis jeg en dag bor i Norge, vil jeg ha et lite hus som ligger ved sjøen. Selv om det regner mye der, tror jeg at jeg kommer til å være lykkelig.'],
    gl: { 'svarer': 'отвечаю', 'helt': 'полностью, точно', 'stille': 'тихие', 'merker': 'замечаю', 'forstår': 'понимаю', 'sjøen': 'море', 'lykkelig': 'счастливая' },
    q: [{ t: 'tf', q: ['Alina vet nøyaktig hvorfor hun lærer norsk.|F # Hun vet ikke helt.', 'Alina hører på podkaster når hun tegner.|T', 'Hun forstår alt på podkastene.|F # Jeg forstår ikke alt.', 'Alina vil ha et hus ved sjøen.|T'] },
      { t: 'choice', q: ['Hva merker Alina?|at hun forstår mer hver uke|at hun ikke liker podkaster|at norsk er lett', 'Hva tror Alina om livet ved sjøen?|at hun blir lykkelig|at det blir kjedelig|at det er for kaldt'] }],
  },
  series: [{ show: 'uttrykk', who: 'норвежское выражение', q: 'Jeg lurer på…', mean: '«Мне интересно…», «Я задаюсь вопросом…». Буквально — «я подглядываю на…».', fun: 'Норвежцы начинают так вежливые вопросы: <i>Jeg lurte på om du har tid?</i> — «Я тут подумал(а), нет ли у тебя времени?» Звучит мягче, чем прямой вопрос.', use: 'Jeg lurte på om du vil ta en kaffe?', qz: '«Jeg lurte på om du har tid» звучит…|вежливо и мягко|грубо|как обман # lure på — интересоваться; прошедшее делает просьбу мягче.' },
    { show: 'ordtak', who: 'норвежская пословица', q: 'Man skal ikke skue hunden på hårene.', mean: '«Не суди собаку по шерсти» — не суди по внешности.', fun: '<i>Skue</i> — старое слово «смотреть, судить». В обычной речи его не встретить, только в этой пословице.', use: 'Hytta ser gammel ut, men man skal ikke skue hunden på hårene.', qz: 'Смысл пословицы:|не суди по внешности|не гладь чужих собак|собаки линяют # skue — судить по виду.' }],
  write: { h: 'Почему вы учите норвежский (или другой язык)? Напишите 6–8 предложений с придаточными: fordi, når, hvis, selv om, at.', min: 60, use: ['fordi', 'hvis', 'selv om', 'at', 'ikke'],
    plan: ['Jeg lærer norsk fordi …', 'Когда вы занимаетесь: Når jeg …, …', 'Что вы надеетесь: Jeg håper at …', 'Что мешает: Selv om …, …', 'Хотя бы одно ikke в придаточном.'],
    model: 'Jeg lærer norsk fordi jeg vil reise til Lofoten.\nNår jeg drikker kaffe om morgenen, lærer jeg ti nye ord.\nJeg håper at jeg snart kan lese norske bøker.\nSelv om grammatikken ikke alltid er lett, synes jeg at norsk er et vakkert språk.\nHvis jeg øver hver dag, kommer jeg til å snakke godt om et år.' },
  vid: [['NorwegianClass101', 'Norwegian subordinate clauses word order'], ['Learn Norwegian Naturally', 'BRA-ord leddsetning ikke'], ['NorwegianClass101', 'Norwegian conjunctions fordi at som']],
  fact: 'Правило «ikke перед глаголом в придаточном» есть во всех скандинавских языках. Иногда только оно и показывает, что предложение придаточное: <i>Jeg sa at jeg <b>ikke</b> kunne komme</i>.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian subordinate clauses', 'https://en.wikibooks.org/wiki/Norwegian'], ['Språkrådet', 'https://www.sprakradet.no/']],
});
NOTE('b1-1', {
  crow: 'B1! Теперь мы строим длинные предложения. И запомните: в придаточном *ikke* прыгает перед глаголом — как я перед рыбой.',
  mk: ['Напишите, что вы *не* любите и почему (fordi + ikke в придаточном).|fordi;ikke|Jeg liker ikke vinteren fordi jeg ikke liker å fryse.', 'Начните с *Når …* и не забудьте инверсию в главном.|når|Når jeg er trøtt, drikker jeg en stor kopp kaffe.', 'Напишите, что вы думаете о чём-то (Jeg tror at …).|tror;at|Jeg tror at norsk er lettere enn mange tror.'],
  etym: [['fordi', '«для того» — *for* + *di* (старое «то»). Как английское *for that*. Норвежцы просто склеили два слова.'], ['å lure', 'изначально «подкарауливать, хитрить» (отсюда английское *lure* — приманка). *Å lure noen* — обмануть кого-то, а *å lure på* — «караулить вопрос», задаваться им.']],
  ru: 'Алина объясняет, где может быть хижина: на карте нарисованы горы Йотунхеймен. Друзья решают ехать поездом Берген — Осло до станции Финсе, а оттуда идти пешком.',
  gl: { 'mener': 'считает', 'fjellkjede': 'горная цепь', 'jotunheimen': 'Йотунхеймен («дом великанов»)', 'toget': 'поезд', 'stasjon': 'станция', 'derfra': 'оттуда', 'til fots': 'пешком', 'hvis': 'если' },
  tf: ['Alina tror at hytta ligger i Jotunheimen.|T', 'De vil fly til hytta.|F # De tar toget og går til fots.', 'Mari er glad fordi hun liker å gå.|F # Hun liker ikke å gå.'],
  ch: ['Hvorfor vil Alina ta toget?|fordi hun vil tegne fjellene fra vinduet|fordi det er billig|fordi hun er redd for å fly # «Jeg vil tegne fjellene fra vinduet.»'],
  bmk: ['Напишите, что вы сделаете, если пойдёт дождь в поход (hvis …, …).|hvis|Hvis det regner på turen, tar jeg på meg regntøy og synger.'],
  etb: '*Jotunheimen* — «дом великанов» (*jotun* — великан из скандинавской мифологии). Здесь самые высокие горы Северной Европы.',
});
ST('b1-1', { t: 'Вежливо попросить', tip: 'Прямое «Дай!» норвежцы не любят — даже среди друзей. Просьбу смягчают: прошедшим временем (*Jeg lurte på om…*), словом *gjerne* или вопросом *Har du mulighet til…?* Это не официоз — это просто тепло.',
  sit: 'Вам нужна помощь соседа с тяжёлой коробкой.', ph: [['Jeg lurte på om du kunne hjelpe meg?', 'Я хотела спросить, не мог бы ты помочь?'], ['Hvis det ikke er til bry…', 'Если не трудно…'], ['Selvfølgelig!', 'Конечно!'], ['Det setter jeg pris på.', 'Я это очень ценю.']],
  dlg: ['Вам нужна помощь.|Jeg lurte på om du kunne hjelpe meg litt?|Hjelp meg nå!|Du må hjelpe. # Мягкая норвежская просьба.', 'Сосед помог. Как поблагодарить?|Tusen takk, det setter jeg pris på!|Ok.|Endelig. # sette pris på — ценить.'],
  mk: 'Вежливо попросите о помощи — с придаточным (om / hvis).|om/hvis|Jeg lurte på om du kan låne meg sykkelen din i morgen?' });
BK('b1-1', 'Kapittel 13. Hytta i fjellet', ['Om kvelden satt de tre vennene på en kafé på Bryggen. Alina hadde lagt kartet på bordet, og hun studerte det nøye.', '«Jeg mener at hytta ligger her,» sa hun og pekte. «Se, bestefaren din har tegnet en fjellkjede. Jeg er nesten sikker på at det er Jotunheimen.»', '«Men hvordan kommer vi dit?» spurte Mari. «Jeg liker ikke å gå langt, fordi vingene mine blir trøtte.»', '«Vi tar toget mot Oslo,» sa Alina. «Det stopper på en stasjon som heter Finse, høyt oppe i fjellet. Derfra kan vi gå til fots. Hvis vi er heldige, finner vi hytta på tre dager.»', 'Pelle så på kartet. Han visste ikke om bestefar var der, men han håpet det. «Når vi finner hytta, finner vi kanskje svaret,» sa han.']);

U({
  id: 'b1-2', lvl: 'B1', t: 'Сильные глаголы: gikk, så, drakk', en: 'Sterke verb',
  goals: ['знать прошедшее 30 частых сильных глаголов', 'рассказывать историю в прошлом без «snakkede»', 'узнавать ряды гласных: *drikke — drakk — drukket*'],
  th: `<p>Сильные глаголы не берут окончание в прошедшем — они <b>меняют гласную</b>, как английские <i>sing — sang — sung</i>. Их меньше сотни, но это самые частые глаголы языка.</p>
  <h4>Ряды гласных — помогают запомнить</h4>
  <div class="tbl"><table><thead><tr><th>Ряд</th><th>Примеры</th></tr></thead><tbody>
  <tr><td>i — a — u</td><td><i>drikke — drakk — drukket</i> (пить), <i>synge — sang — sunget</i>, <i>finne — fant — funnet</i>, <i>springe — sprang — sprunget</i></td></tr>
  <tr><td>i — e — i</td><td><i>skrive — skrev — skrevet</i>, <i>bite — bet — bitt</i>, <i>bli — ble — blitt</i></td></tr>
  <tr><td>y — ø — o/y</td><td><i>fly — fløy — fløyet</i>, <i>fryse — frøs — frosset</i>, <i>flyte — fløt — fløtt</i></td></tr>
  <tr><td>a — o — a</td><td><i>ta — tok — tatt</i>, <i>dra — dro — dratt</i>, <i>slå — slo — slått</i>, <i>stå — sto — stått</i></td></tr>
  <tr><td>особые</td><td><i>gå — gikk — gått</i>, <i>se — så — sett</i>, <i>få — fikk — fått</i>, <i>komme — kom — kommet</i>, <i>sove — sov — sovet</i>, <i>gi — ga — gitt</i>, <i>si — sa — sagt</i>, <i>ligge — lå — ligget</i>, <i>sitte — satt — sittet</i></td></tr></tbody></table></div>
  <h4>Полусильные</h4>
  <p>Есть глаголы, которые и меняют гласную, и берут окончание: <i>selge — solgte — solgt</i> (продавать), <i>fortelle — fortalte — fortalt</i>, <i>spørre — spurte — spurt</i>, <i>vite — visste — visst</i>, <i>gjøre — gjorde — gjort</i>.</p>
  <h4>Perfektum: har или er?</h4>
  <p>Обычно <i>har</i>: <i>Jeg har gått.</i> Но с глаголами движения и изменения можно и <i>er</i> — тогда подчёркивается результат: <i>Han er reist</i> (он уехал — и его нет). <i>Sola er gått ned.</i> Оба варианта правильные; <i>har</i> — всегда безопасно.</p>`,
  simple: 'сильные глаголы меняют гласную: drikke — drakk — drukket, gå — gikk — gått, se — så — sett. Учите тройками вслух.',
  exm: [['I går gikk vi en lang tur.', 'Вчера мы долго гуляли.'], ['Hun drakk tre kopper kaffe.', 'Она выпила три чашки кофе.'], ['Har du sett filmen?', 'Ты смотрел фильм?'], ['Vi fant en gammel nøkkel.', 'Мы нашли старый ключ.']],
  conf: [['*gikk* / *gådde*', '<i>gå</i> — сильный глагол: <i>gikk</i>, <i>har gått</i>. «Gådde» не бывает.', '«Вчера я ходила в магазин»:|I går gikk jeg i butikken.|I går gådde jeg i butikken.|I går gått jeg i butikken. # gå — gikk — gått.'],
    ['*så* (видел) / *så* (так, поэтому)', 'Одинаково пишутся: <i>Jeg så ham</i> — я его видела; <i>Så gikk vi</i> — потом мы пошли. Смысл — по контексту.', '«Jeg så en elg» значит…|я увидела лося|так, лось|поэтому лось # så — прошедшее от se.']],
  words: [['gikk', 'пошёл (gå)', 'Vi gikk hjem.'], ['så', 'увидел (se)', 'Jeg så en elg.'], ['drakk', 'выпил (drikke)', 'Han drakk kaffe.'], ['fant', 'нашёл (finne)', 'Vi fant nøkkelen.'], ['ble', 'стал (bli)', 'Det ble kaldt.'], ['skrev', 'написал (skrive)', 'Hun skrev et brev.'], ['sov', 'спал (sove)', 'Jeg sov godt.'], ['tok', 'взял (ta)', 'Hun tok toget.'], ['fikk', 'получил (få)', 'Jeg fikk en gave.'], ['satt', 'сидел (sitte)', 'Vi satt på toget.']],
  ex: [
    { t: 'gap', h: 'Поставьте в preteritum.', q: ['I går ___ vi på kino. (gå)|gikk', 'Hun ___ et langt brev. (skrive)|skrev', 'Vi ___ en elg i skogen. (se)|så', 'Han ___ tre kopper kaffe. (drikke)|drakk', 'Det ___ kaldt om kvelden. (bli)|ble', 'Jeg ___ en gave av mamma. (få)|fikk', 'De ___ toget til Oslo. (ta)|tok', 'Barna ___ lenge. (sove)|sov'] },
    { t: 'gap', h: 'Perfektum (har + …).', q: ['Har du ___ filmen? (se)|sett', 'Jeg har ___ boka. (skrive)|skrevet', 'Vi har ___ nøkkelen! (finne)|funnet', 'Hun har ___ til Bergen. (dra)|dratt', 'Har du ___ brunost? (spise)|spist', 'Jeg har ___ for mye kaffe. (drikke)|drukket'] },
    { t: 'choice', h: 'Выберите правильную форму.', q: ['Jeg ___ ham i går.|så|sett|seet', 'Vi har ___ hele dagen.|sittet|satt|sitt', 'Hun ___ en stor fisk.|fikk|fått|fådde', 'De ___ meg hva klokka var.|spurte|spurt|spørte', 'Han har ___ huset sitt.|solgt|selgt|solgte'] },
    { t: 'order', q: ['I går gikk vi en lang tur i fjellet.', 'Hun drakk tre kopper kaffe.', 'Vi fant en gammel nøkkel under steinen.', 'Har du sett den nye filmen?', 'Det ble mørkt og kaldt.'] },
    { t: 'tr', q: ['Вчера мы ходили в горы.|I går gikk vi i fjellet.|I går gikk vi på fjellet.|I går gikk vi tur i fjellet.|Vi gikk i fjellet i går.', 'Я увидела лося.|Jeg så en elg.', 'Мы нашли ключ.|Vi fant nøkkelen.|Vi har funnet nøkkelen.', 'Она написала письмо.|Hun skrev et brev.|Hun har skrevet et brev.'] },
  ],
  read: {
    title: 'Bergensbanen', intro: 'Текст в прошлом — найдите все сильные глаголы.',
    txt: ['Toget gikk fra Bergen klokka åtte om morgenen. Alina satt ved vinduet og tegnet, Pelle sov, og Mari spiste en bolle hun fant i sekken.', 'Etter to timer ble landskapet hvitt. Det lå snø på fjellene, selv om det var juni. Alina tok mange bilder, og hun skrev i dagboka si.', 'I Finse var det kaldt og stille. De gikk av toget og så seg rundt. Bare fjell, is og himmel. «Her begynner turen,» sa Alina.'],
    gl: { 'bolle': 'булочка', 'etter to timer': 'через два часа', 'landskapet': 'пейзаж', 'selv om': 'хотя', 'bilder': 'фотографии, картинки', 'dagboka': 'дневник', 'gikk av': 'вышли (из поезда)', 'så seg rundt': 'огляделись' },
    q: [{ t: 'tf', q: ['Toget gikk klokka åtte.|T', 'Pelle tegnet ved vinduet.|F # Alina tegnet, Pelle sov.', 'Det var snø på fjellene i juni.|T', 'I Finse var det varmt.|F # Det var kaldt og stille.'] },
      { t: 'choice', q: ['Hva gjorde Mari på toget?|spiste en bolle|sov|tegnet', 'Hva skrev Alina i?|dagboka si|et brev|et postkort'] }],
  },
  series: [{ show: 'kultur', who: 'типично норвежское', q: 'Sakte-TV', mean: '«Медленное телевидение»: NRK показывал 7 часов поездки Bergensbanen в реальном времени — просто вид из окна поезда.', fun: 'В 2009 году это смотрел каждый пятый норвежец. Потом были 134 часа Хуртигрутена, ночь вязания и 12 часов горящего камина. Норвежцам понравилось.', use: 'Har du sett «Bergensbanen minutt for minutt»?', qz: 'Что показывали в передаче «Bergensbanen minutt for minutt»?|7 часов поездки на поезде в реальном времени|документальный фильм о строительстве дороги|гонку поездов # Sakte-TV — «медленное ТВ».' },
    { show: 'uttrykk', who: 'норвежское выражение', q: 'Å gå på tur', mean: '«Пойти на прогулку, в поход». <i>Tur</i> — от лёгкой прогулки в парке до недели в горах.', fun: 'Норвежец спрашивает «Skal vi gå en tur?» — может иметь в виду и полчаса, и восемь часов. Уточняйте!', use: 'I går gikk vi en lang tur rundt vannet.', qz: '«Vi gikk en tur i skogen» значит…|мы погуляли в лесу|мы купили тур в лес|мы потерялись в лесу # gå (en) tur — гулять, ходить в поход.' }],
  write: { h: 'Расскажите о самой интересной поездке или прогулке в прошлом. Используйте не меньше 6 сильных глаголов.', min: 70, use: ['gikk', 'så', 'fikk', 'ble', 'tok'],
    plan: ['Куда и когда вы поехали (dro / reiste).', 'Как ехали (tok toget / bussen).', 'Что увидели (så), нашли (fant).', 'Что случилось (det ble …).', 'Чем закончилось.'],
    model: 'For tre år siden dro jeg til Lofoten med en venninne.\nVi tok fly til Bodø og så båten til Moskenes.\nDen første dagen gikk vi en lang tur opp på et fjell. Vi så havet, strendene og mange små røde hus.\nPlutselig ble det tåke, og vi fant ikke stien. Vi satt på en stein og spiste sjokolade.\nEtter en time forsvant tåka, og vi fikk se den vakreste utsikten i livet mitt.' },
  vid: [['NorwegianClass101', 'Norwegian strong verbs past tense'], ['Learn Norwegian Naturally', 'sterke verb list'], ['NRK', 'Bergensbanen minutt for minutt']],
  fact: 'Bergensbanen (железная дорога Осло — Берген) открыта в 1909 году. Станция Финсе — самая высокая на линии, 1222 м. Здесь снимали ледяную планету Хот в «Звёздных войнах: Империя наносит ответный удар».',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Ordbøkene — bøying', 'https://ordbokene.no/'], ['Wikibooks — Norwegian verbs', 'https://en.wikibooks.org/wiki/Norwegian']],
});
NOTE('b1-2', {
  crow: '*Jeg fløy, jeg så, jeg spiste.* Это мой личный девиз — как у Цезаря, только про рыбу.',
  mk: ['Напишите, что вы делали в прошлые выходные (минимум два сильных глагола).|gikk/så/drakk/fikk/tok|I helgen gikk jeg på tur og så et gammelt slott.', 'Напишите о подарке, который вы получили (fikk).|fikk|Til bursdagen min fikk jeg en stor skissebok av søstera mi.', 'Напишите, кого или что вы недавно видели (så).|så|I går så jeg en rev i parken ved huset mitt.'],
  etym: [['å fly', 'и «летать», и «бежать» (в старом языке). Отсюда английское *fly* и *flee*. *Fly* в норвежском — ещё и «самолёт»: *et fly*.'], ['tog', 'поезд; от *å dra* (тянуть), старое прошедшее *drog*. Поезд — «то, что тянут». Немецкое *Zug* — от *ziehen*, тоже «тянуть».']],
  ru: 'Друзья едут поездом через горы. Алина рисует, Пелле спит, Мари ест булочку. На станции Финсе снег — хотя июнь. Начинается пеший поход. Пелле находит в снегу старую красную пуговицу.',
  gl: { 'toget': 'поезд', 'snøen': 'снег', 'juni': 'июнь', 'knapp': 'пуговица', 'av toget': 'из поезда', 'sov': 'спал', 'tegnet': 'рисовала' },
  tf: ['Pelle sov på toget.|T', 'Det var ikke snø i Finse.|F # Det lå snø, selv om det var juni.', 'Pelle fant en rød knapp.|T'],
  ch: ['Hva sto det på knappen?|et anker|et navn|ingenting # Det var et lite anker på den.'],
  bmk: ['Что самое странное вы когда-нибудь находили? (fant)|fant|En gang fant jeg et gammelt brev i ei bok fra biblioteket.'],
  etb: '*Knapp* — пуговица, а ещё «едва, чуть-чуть»: *knapt* — «еле-еле». Пуговица — маленькая вещь, и «чуть-чуть» тоже маленькое.',
});
ST('b1-2', { t: 'Рассказать историю', tip: 'Норвежцы рассказывают истории сдержанно — без восклицаний и драмы. Самое смешное говорят ровным голосом. Чтобы показать интерес, слушатель вставляет *Å ja?*, *Nei, seriøst?*, *Og så?* («И что дальше?»).',
  sit: 'Обед с коллегами. Вы рассказываете, что случилось в выходные.', ph: [['Du vil ikke tro hva som skjedde!', 'Ты не поверишь, что случилось!'], ['Og så?', 'И что дальше?'], ['Nei, seriøst?', 'Серьёзно?'], ['Til slutt…', 'В конце концов…']],
  dlg: ['Коллега рассказывает: «…og så fant jeg en lommebok på gata.»|Nei, seriøst? Og så?|Jeg fant ikke.|Gata er stor. # Показать интерес.', 'Вы начинаете историю.|Du vil ikke tro hva som skjedde i helgen!|Jeg vil tro.|Helg skjedde. # Классическое начало.'],
  mk: 'Начните короткую историю о прошлом: «Ты не поверишь…» и одно событие.|skjedde|Du vil ikke tro hva som skjedde! Jeg så en elg i hagen min.' });
BK('b1-2', 'Kapittel 14. Toget over fjellet', ['Toget gikk fra Bergen tidlig om morgenen. Alina satt ved vinduet og tegnet alt hun så: elver, fosser, små gårder og høye fjell. Pelle sov med hodet på sekken, og Mari spiste en bolle hun hadde funnet på stasjonen.', 'Etter tre timer ble det hvitt utenfor. «Snø!» ropte Mari. «Men det er jo juni!» Alina lo. «På fjellet kan det snø hele året.»', 'På Finse gikk de av toget. Luften var kald og ren, og det var helt stille. De tok på seg varme klær og begynte å gå.', 'Plutselig stoppet Pelle. I snøen lå det noe rødt. Han tok det opp. Det var en gammel, rød knapp, og det var et lite anker på den. «Denne er fra en sjømannsjakke,» sa Alina. «Bestefar har gått her!» hvisket Pelle.']);

U({
  id: 'b1-3', lvl: 'B1', t: 'Возвратные глаголы и sin', en: 'Refleksive verb og «sin»',
  goals: ['использовать возвратные глаголы: *glede seg, sette seg, føle seg*', 'склонять *seg*: *meg, deg, seg, oss, dere, seg*', 'различать *sin* (свой) и *hans* (чужой)'],
  th: `<p>Возвратный глагол — это когда действие направлено на самого себя: <i>å vaske seg</i> — мыться. Как русское «-ся», но <i>seg</i> меняется по лицам:</p>
  <div class="tbl"><table><thead><tr><th>Лицо</th><th>å glede seg (радоваться, ждать с нетерпением)</th></tr></thead><tbody>
  <tr><td>jeg</td><td><i>Jeg gleder <b>meg</b>.</i></td></tr><tr><td>du</td><td><i>Du gleder <b>deg</b>.</i></td></tr><tr><td>han / hun</td><td><i>Han gleder <b>seg</b>.</i></td></tr>
  <tr><td>vi</td><td><i>Vi gleder <b>oss</b>.</i></td></tr><tr><td>dere</td><td><i>Dere gleder <b>dere</b>.</i></td></tr><tr><td>de</td><td><i>De gleder <b>seg</b>.</i></td></tr></tbody></table></div>
  <h4>Частые возвратные глаголы</h4>
  <p><i>glede seg til</i> — ждать с радостью: <i>Jeg gleder meg til ferien!</i> · <i>sette seg</i> — сесть · <i>legge seg</i> — лечь (спать) · <i>føle seg</i> — чувствовать себя · <i>kle på seg</i> — одеться · <i>skynde seg</i> — спешить · <i>gifte seg</i> — жениться/выйти замуж · <i>bestemme seg</i> — решить · <i>forelske seg</i> — влюбиться · <i>interessere seg for</i> — интересоваться.</p>
  <p>Иногда русское «-ся» не возвратное в норвежском и наоборот: <i>Jeg liker</i> (мне нравится), но <i>Jeg setter meg</i> (сажусь = «сажаю себя»).</p>
  <h4>sin, si, sitt, sine — «свой»</h4>
  <p>Если владелец — подлежащее в 3-м лице (<i>han, hun, de, Pelle</i>), «свой» — это <b>sin</b> (<i>si, sitt, sine</i>). <i>hans/hennes</i> — значит, чужой:</p>
  <ul><li><i>Pelle tar kartet <b>sitt</b>.</i> — Пелле берёт свою карту.</li><li><i>Pelle tar kartet <b>hans</b>.</i> — Пелле берёт его карту (чью-то другую, например дедушки).</li></ul>
  <p>С <i>jeg, du, vi</i> — обычные <i>min, din, vår</i>: <i>Jeg tar kartet mitt.</i> И <i>sin</i> не бывает в подлежащем: <i>Kona hans er lege</i>, а не «kona sin».</p>`,
  simple: 'glede seg, sette seg: seg → meg/deg/oss/dere. sin = свой (у он/она/они): Han tar boka si. hans = его (чужая).',
  exm: [['Jeg gleder meg til ferien!', 'Жду не дождусь отпуска!'], ['Sett deg, er du snill.', 'Садись, пожалуйста.'], ['Hun føler seg trøtt i dag.', 'Она сегодня чувствует себя уставшей.'], ['Pelle tar kartet sitt.', 'Пелле берёт свою карту.']],
  conf: [['*sin* / *hans*', '<i>Han vasker bilen sin</i> — свою машину; <i>Han vasker bilen hans</i> — чужую (другого мужчины).', '«Мари читает свою книгу»:|Mari leser boka si.|Mari leser boka hennes.|Mari leser boka sin. # Своя — si (ei bok).'],
    ['*Jeg gleder meg* / *Jeg gleder seg*', '<i>seg</i> — только для он/она/они. Для «я» — <i>meg</i>, для «мы» — <i>oss</i>.', '«Мы с нетерпением ждём лета»:|Vi gleder oss til sommeren.|Vi gleder seg til sommeren.|Vi gleder til sommeren. # vi → oss.']],
  words: [['å glede seg til', 'ждать с радостью', 'Vi gleder oss til jul.'], ['å sette seg', 'сесть', 'Hun satte seg på benken.'], ['å legge seg', 'лечь спать', 'Jeg legger meg klokka elleve.'], ['å føle seg', 'чувствовать себя', 'Jeg føler meg bra.'], ['å skynde seg', 'спешить', 'Skynd deg, toget går!'], ['å bestemme seg', 'решить', 'Han bestemte seg for å reise.'], ['å kle på seg', 'одеться', 'Kle på deg, det er kaldt!'], ['å interessere seg for', 'интересоваться', 'Hun interesserer seg for kunst.'], ['å hvile seg', 'отдохнуть', 'Vi må hvile oss litt.'], ['å gifte seg', 'пожениться', 'De giftet seg i fjor.']],
  ex: [
    { t: 'gap', h: 'Вставьте meg, deg, seg, oss или dere.', q: ['Jeg gleder ___ til ferien.|meg', 'Sett ___, er du snill!|deg', 'Hun føler ___ syk.|seg', 'Vi må skynde ___.|oss', 'Har dere bestemt ___?|dere', 'De la ___ tidlig.|seg'] },
    { t: 'gap', h: 'sin/si/sitt/sine или hans/hennes?', q: ['Pelle tar sekken ___. (свой)|sin', 'Alina tegner i skisseboka ___. (своём)|si', 'Mari elsker huset ___. (своё)|sitt', 'Bestefar er borte. Pelle har kartet ___. (его — дедушки)|hans', 'Barna leker med vennene ___. (своими)|sine'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['«Я ложусь спать в одиннадцать»:|Jeg legger meg klokka elleve.|Jeg legger klokka elleve.|Jeg legger seg klokka elleve. # jeg → meg.', '«Он моет свою машину»:|Han vasker bilen sin.|Han vasker bilen hans.|Han vasker sin bil hans. # своя — sin.', '«Мы ждём лета»:|Vi gleder oss til sommeren.|Vi gleder oss på sommeren.|Vi gleder til sommeren. # glede seg til.', '«Его жена — врач»:|Kona hans er lege.|Kona sin er lege.|Sin kone er lege. # В подлежащем sin нельзя.'] },
    { t: 'fix', q: ['Jeg gleder seg til jul.|Jeg gleder meg til jul. # jeg → meg.', 'Vi må hvile seg.|Vi må hvile oss. # vi → oss.', 'Mari leser boka hennes. (свою)|Mari leser boka si. # Своя — si.', 'Kona sin er lege.|Kona hans er lege. # В подлежащем — hans.'] },
    { t: 'tr', q: ['Жду не дождусь отпуска!|Jeg gleder meg til ferien!', 'Садись!|Sett deg!|Sett deg ned!', 'Она чувствует себя уставшей.|Hun føler seg trøtt.|Hun føler seg sliten.', 'Пелле берёт свой рюкзак.|Pelle tar sekken sin.'] },
  ],
  read: {
    title: 'Elgen Erik', intro: 'Найдите возвратные глаголы и все sin/si/sitt.',
    txt: ['Etter seks timer i fjellet satte vennene seg på en stor stein. Mari følte seg helt utslitt, og Alina tok av seg skoene sine.', 'Plutselig kom en stor elg ut av skogen. «God dag,» sa elgen og satte seg ved siden av dem. «Jeg heter Erik. Dere ser trøtte ut.»', '«Vi leter etter ei hytte,» sa Pelle og viste ham kartet sitt. Erik så lenge på det. «Den hytta kjenner jeg. Følg meg, men skynd dere. Det blir snart mørkt.»'],
    gl: { 'utslitt': 'выбившаяся из сил', 'tok av seg': 'сняла', 'elg': 'лось', 'skogen': 'лес', 'ved siden av': 'рядом с', 'ser trøtte ut': 'выглядите уставшими', 'følg meg': 'идите за мной', 'snart': 'скоро' },
    q: [{ t: 'tf', q: ['Vennene satte seg på en stein.|T', 'Mari følte seg uthvilt.|F # Hun følte seg utslitt.', 'Elgen heter Erik.|T', 'Erik kjenner ikke hytta.|F # «Den hytta kjenner jeg.»'] },
      { t: 'choice', q: ['Hva tok Alina av seg?|skoene sine|jakka si|lua si', 'Hvorfor må de skynde seg?|det blir snart mørkt|det kommer en storm|toget går'] }],
  },
  series: [{ show: 'uttrykk', who: 'норвежское выражение', q: 'Jeg gleder meg!', mean: '«Я радуюсь (заранее)!» — главное норвежское выражение предвкушения. По-русски — «жду не дождусь».', fun: 'Норвежцы говорят это обо всём: о пятнице, об отпуске, о вафлях. Ответ: <i>Jeg også!</i> или <i>Det blir så koselig!</i>', use: 'Jeg gleder meg sånn til helgen!', qz: '«Jeg gleder meg til fredag» значит…|я жду пятницу с нетерпением|я радуюсь, что пятница прошла|я радую пятницу # glede seg til — предвкушать.' },
    { show: 'kultur', who: 'типично норвежское', q: 'Allemannsretten', mean: '«Право каждого человека» — закон: можно гулять, ставить палатку и собирать ягоды почти на любой земле, даже частной.', fun: 'Палатку можно поставить на ночь в 150 м от жилого дома, не спрашивая хозяина. Главное — оставить место таким же чистым.', use: 'Takket være allemannsretten kan vi telte her.', qz: 'Что разрешает «allemannsretten»?|гулять и ставить палатку на природе почти везде|охотиться где угодно|строить хитту без разрешения # allemann — каждый.' }],
  write: { h: 'Опишите обычный вечер: как вы готовитесь ко сну и чего ждёте завтра. Используйте 5 возвратных глаголов.', min: 60, use: ['meg', 'glede', 'legge', 'føle', 'sin/si/sitt'],
    plan: ['Когда вы приходите домой и что делаете (setter meg, hviler meg).', 'Как вы себя чувствуете (føler meg …).', 'Когда ложитесь (legger meg).', 'Чего ждёте (gleder meg til …).', 'Кто-то из семьи и его/её вещь (sin vs hans).'],
    model: 'Når jeg kommer hjem, setter jeg meg i sofaen og hviler meg litt.\nOfte føler jeg meg trøtt, men glad.\nKatten min legger seg på fanget mitt og sover.\nKlokka elleve legger jeg meg.\nJeg gleder meg alltid til morgenen, fordi jeg elsker den første kaffen.\nSøstera mi ringer ofte og forteller om dagen sin.' },
  vid: [['NorwegianClass101', 'Norwegian reflexive verbs'], ['Learn Norwegian Naturally', 'sin si sitt sine'], ['NorwegianClass101', 'allemannsretten right to roam']],
  fact: 'Лось — король норвежского леса. Их около 120 000, и каждую осень на дорогах ставят знаки «Осторожно, лось». А туристы воруют эти знаки как сувениры так часто, что их продают в магазинах.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian reflexives', 'https://en.wikibooks.org/wiki/Norwegian'], ['Språkrådet — sin eller hans', 'https://www.sprakradet.no/']],
});
NOTE('b1-3', {
  crow: '*Jeg gleder meg!* Это я про ужин. Я всегда *gleder meg* до ужина. И до завтрака. И до кофе.',
  mk: ['Напишите, чего вы ждёте с нетерпением (glede seg til).|gleder;til|Jeg gleder meg til sommerferien og til lange kvelder.', 'Напишите, как вы себя чувствуете сегодня и почему.|føler|I dag føler jeg meg sliten fordi jeg sov dårlig.', 'Напишите о ком-то и *его/её собственной* вещи (sin/si/sitt).|sin/si/sitt/sine|Broren min elsker bilen sin, men den er veldig gammel.'],
  etym: [['elg', 'лось; родня английского *elk* и латинского *alces*. А русское «лось» — дальний родственник через древнее *olkis*.'], ['å glede', 'радовать; родня *glad*. Буквально — «делать гладким, сияющим». Радость — это когда душа становится гладкой.']],
  ru: 'Друзья устали в горах. Из леса выходит лось Эрик — он знает хижину и ведёт их туда. Пелле радуется: скоро он, может быть, найдёт дедушку.',
  gl: { 'utslitt': 'выбилась из сил', 'elgen': 'лось', 'satte seg': 'сел', 'gledet seg': 'радовался', 'skynd dere': 'поторопитесь', 'la de seg': 'они легли', 'stjernene': 'звёзды' },
  tf: ['Mari følte seg utslitt.|T', 'Erik er en bjørn.|F # Erik er en elg.', 'De la seg under stjernene.|T'],
  ch: ['Hvorfor gledet Pelle seg?|han kunne kanskje finne bestefar|han fikk vafler|det var varmt # «I morgen finner jeg kanskje bestefar.»'],
  bmk: ['Чего вы ждали с нетерпением в детстве? (gledet meg til)|gledet meg|Som barn gledet jeg meg alltid til jul og snø.'],
  etb: '*Utslitt* — «изношенный» (от *slite* — изнашивать). Так говорят о старых брюках — и об уставших людях. Норвежцы после похода всегда *utslitte, men lykkelige*.',
});
ST('b1-3', { t: 'Как ты себя чувствуешь?', tip: 'О здоровье норвежцы говорят спокойно. *Jeg føler meg ikke helt i form* — «я не совсем в форме» — уже достаточно, чтобы коллега сказал *God bedring!* («Выздоравливай!»). Болеть дома — нормально и правильно.',
  sit: 'Коллега выглядит неважно.', ph: [['Føler du deg bra?', 'Ты хорошо себя чувствуешь?'], ['Jeg føler meg ikke helt i form.', 'Я не совсем в форме.'], ['Du bør legge deg tidlig.', 'Тебе стоит пораньше лечь.'], ['God bedring!', 'Выздоравливай!']],
  dlg: ['Коллега: «Jeg føler meg ikke helt i form i dag.»|Å nei! Du bør dra hjem og hvile deg. God bedring!|Jeg føler meg bra.|Du er syk, gå. # Сочувствие + совет + пожелание.', 'Вас спрашивают: «Føler du deg bedre nå?»|Ja, takk, mye bedre!|Ja, jeg føler seg bedre.|Bedre er jeg. # jeg → meg.'],
  mk: 'Пожелайте больному коллеге выздоровления и дайте совет (возвратный глагол).|deg|Du bør hvile deg og legge deg tidlig. God bedring!' });
BK('b1-3', 'Kapittel 15. Elgen Erik', ['Etter seks timer i fjellet satte de seg på en stein. Mari følte seg helt utslitt. «Jeg kan ikke fly en meter til,» sukket hun.', 'Da kom det en stor elg ut av skogen. Han hadde enorme horn og vennlige øyne. «God kveld,» sa elgen og satte seg ved siden av dem. «Jeg heter Erik. Hvor skal dere?»', 'Pelle viste ham kartet sitt. Erik smilte. «Den hytta kjenner jeg godt. En gammel lundefugl bodde der. Han tegnet kartene sine ved peisen hver kveld. Følg meg, men skynd dere — det blir mørkt.»', 'Den natten la de seg under stjernene, rett ved den store elgen. Pelle gledet seg så mye at han nesten ikke fikk sove. «I morgen finner jeg kanskje bestefar,» tenkte han.']);

U({
  id: 'b1-4', lvl: 'B1', t: 'Пассив: selges, ble bygget', en: 'Passiv',
  goals: ['понимать объявления и тексты в пассиве: *Leilighet selges*', 'строить пассив двумя способами: *-s* и *bli + partisipp*', 'знать, когда какой выбрать'],
  th: `<p>Пассив — «действие делается с кем-то/чем-то»: <i>Дом построен. Вафли продаются.</i> В норвежском два способа.</p>
  <h4>1. s-пассив: глагол + s</h4>
  <p>К инфинитиву добавляем <b>-s</b>: <i>selge → selges</i>, <i>gjøre → gjøres</i>. Используется в настоящем времени, особенно после модальных, и в объявлениях, правилах, инструкциях:</p>
  <ul><li><i>Leilighet <b>selges</b>.</i> — Продаётся квартира.</li><li><i>Døra <b>må lukkes</b>.</i> — Дверь нужно закрывать.</li><li><i>Norsk <b>snakkes</b> her.</i> — Здесь говорят по-норвежски.</li><li><i>Billetter <b>kan kjøpes</b> på nett.</i> — Билеты можно купить онлайн.</li></ul>
  <h4>2. bli + причастие</h4>
  <p><i>bli</i> (становиться) + форма как после <i>har</i>: <i>Huset <b>ble bygget</b> i 1950.</i> — Дом был построен в 1950-м. Этот способ — для прошлого, будущего и конкретных событий:</p>
  <ul><li><i>Brevet <b>ble skrevet</b> av bestefar.</i> — Письмо было написано дедушкой.</li><li><i>Han <b>blir</b> ofte <b>spurt</b> om det.</i> — Его часто об этом спрашивают.</li><li><i>Hytta <b>har blitt</b> solgt.</i> — Хитту продали.</li></ul>
  <p><b>av</b> — «кем»: <i>Bildet ble malt <b>av</b> Munch.</i></p>
  <h4>Осторожно: глаголы на -s, которые не пассив</h4>
  <p>Некоторые глаголы всегда с <i>-s</i>: <i>å synes</i> — считать, казаться, <i>å trives</i> — хорошо себя чувствовать (где-то), <i>å møtes</i> — встречаться, <i>å finnes</i> — существовать. <i>Jeg trives i Norge</i> — мне хорошо в Норвегии.</p>`,
  simple: 'selges, må gjøres — правила и объявления. ble bygget, ble skrevet — конкретное событие в прошлом. av — кем.',
  exm: [['Huset ble bygget i 1950.', 'Дом был построен в 1950 году.'], ['Leilighet selges.', 'Продаётся квартира.'], ['Døra må lukkes.', 'Дверь нужно закрывать.'], ['Bildet ble malt av Munch.', 'Картина была написана Мунком.']],
  conf: [['*selges* / *blir solgt*', 'В объявлениях и правилах — <i>-s</i>: <i>Bil selges</i>. О конкретном случае — <i>bli</i>: <i>Bilen ble solgt i går</i>.', 'Объявление «Продаётся велосипед»:|Sykkel selges.|Sykkel blir solgt i går.|Sykkel selger. # Объявление — s-пассив.'],
    ['*synes* — не пассив', '<i>Jeg synes at…</i> — «я считаю». Это обычный глагол, который просто кончается на <i>-s</i>.', '«Я считаю, что это красиво»:|Jeg synes at det er fint.|Jeg syner at det er fint.|Det synes av meg fint. # synes — «считать».']],
  words: [['å bygge', 'строить', 'Huset ble bygget i 1950.'], ['å selge', 'продавать', 'Leilighet selges.'], ['å male', 'писать (картину), красить', 'Bildet ble malt av Munch.'], ['av', 'кем (в пассиве)', 'Boka ble skrevet av Ibsen.'], ['å lukke', 'закрывать', 'Døra må lukkes.'], ['å synes', 'считать, полагать', 'Jeg synes det er fint.'], ['å trives', 'хорошо себя чувствовать', 'Jeg trives i Bergen.'], ['å finnes', 'существовать', 'Det finnes mange fjorder.'], ['forbudt', 'запрещено', 'Røyking forbudt.'], ['å oppdage', 'обнаружить', 'Hytta ble oppdaget av Erik.']],
  ex: [
    { t: 'gap', h: 'Пассив с -s.', q: ['Leilighet ___. (selge)|selges', 'Døra må ___. (lukke)|lukkes', 'Norsk ___ her. (snakke)|snakkes', 'Billetter kan ___ på nett. (kjøpe)|kjøpes', 'Dette må ___ i dag. (gjøre)|gjøres'] },
    { t: 'gap', h: 'Пассив с bli: ble + причастие.', q: ['Huset ble ___ i 1950. (bygge)|bygget/bygd', 'Brevet ble ___ av bestefar. (skrive)|skrevet', 'Bildet ble ___ av Munch. (male)|malt', 'Bilen ble ___ i går. (selge)|solgt', 'Hytta ble ___ av Erik. (oppdage)|oppdaget'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['Табличка в музее: «Фотографировать запрещено».|Fotografering forbudt.|Fotografering forbudte.|Fotograferes ikke av.', 'Объявление: «Сдаётся комната».|Rom leies ut.|Rom ble leid ut i går.|Rom leier ut. # Объявление — s-пассив.', '«Книга была написана Ибсеном»:|Boka ble skrevet av Ibsen.|Boka skrives av Ibsen i fjor.|Boka ble skrevet fra Ibsen. # кем — av.', '«Мне нравится жить в Бергене»:|Jeg trives i Bergen.|Jeg trivers i Bergen.|Jeg blir trivd i Bergen. # trives — всегда с s.'] },
    { t: 'order', q: ['Huset ble bygget i 1950.', 'Døra må lukkes om natten.', 'Bildet ble malt av Edvard Munch.', 'Billetter kan kjøpes på nett.', 'Jeg trives veldig godt i Norge.'] },
    { t: 'tr', q: ['Дом был построен в 1950 году.|Huset ble bygget i 1950.|Huset ble bygd i 1950.', 'Продаётся квартира.|Leilighet selges.', 'Дверь нужно закрывать.|Døra må lukkes.|Døren må lukkes.', 'Мне хорошо в Норвегии.|Jeg trives i Norge.'] },
  ],
  read: {
    title: 'Den gamle hytta', intro: 'Найдите все формы пассива.',
    txt: ['Hytta ble bygget for over hundre år siden. Den ble laget av tre og stein, og taket ble dekket med torv. På taket vokser det gress og blomster.', 'Over døra henger et skilt: «Døra må lukkes — ellers kommer sauene inn.» Inne finnes det en peis, et bord og to senger.', 'På bordet ligger et brev. Konvolutten har aldri blitt åpnet. Pelle ser på den. Navnet hans er skrevet på konvolutten med store, skjeve bokstaver.'],
    gl: { 'laget av': 'сделана из', 'tre': 'дерево', 'dekket med': 'покрыта', 'torv': 'дёрн', 'vokser': 'растёт', 'gress': 'трава', 'skilt': 'табличка', 'ellers': 'иначе', 'sauene': 'овцы', 'konvolutten': 'конверт', 'skjeve': 'кривые' },
    q: [{ t: 'tf', q: ['Hytta ble bygget i fjor.|F # For over hundre år siden.', 'Det vokser gress på taket.|T', 'Brevet har blitt åpnet.|F # Konvolutten har aldri blitt åpnet.', 'Navnet til Pelle står på konvolutten.|T'] },
      { t: 'choice', q: ['Hvorfor må døra lukkes?|ellers kommer sauene inn|det er kaldt|det er forbudt å åpne den', 'Hva finnes inne i hytta?|en peis, et bord og to senger|en TV og en sofa|ingenting'] }],
  },
  series: [{ show: 'kultur', who: 'типично норвежское', q: 'Torvtak', mean: '«Крыша из дёрна»: старинные норвежские дома покрыты землёй с травой — тепло зимой и прохладно летом.', fun: 'На некоторых крышах пасутся козы. В городке Сельбу даже был конкурс «самая красивая травяная крыша».', use: 'Den gamle stabburet har torvtak med blomster.', qz: 'Зачем на старых норвежских домах трава на крыше?|для тепла и защиты от непогоды|чтобы кормить кур|для красоты на фото # Дёрн — отличный утеплитель.' },
    { show: 'ordtak', who: 'норвежская пословица', q: 'Rom ble ikke bygget på én dag.', mean: '«Рим не за один день строился» — большие дела требуют времени. Пословица общеевропейская, а пассив — норвежский.', fun: 'Норвежцы говорят это о своём языке: никто не выучил норвежский за один день. Даже норвежцы.', use: 'Norsk er vanskelig? Rom ble ikke bygget på én dag!', qz: 'В пословице «Rom ble ikke bygget på én dag» глагол стоит…|в пассиве с bli|в активе|в s-пассиве # ble bygget — пассив.' }],
  write: { h: 'Напишите объявление (продаётся, сдаётся, ищется) и короткую историю какого-нибудь здания в пассиве.', min: 60, use: ['selges', 'ble bygget', 'av', 'må'],
    plan: ['Объявление: … selges / leies ut. (2–3 строки)', 'История здания: Huset ble bygget i …', 'Кем: … av …', 'Правило: … må …'],
    model: 'Sykkel selges! Den er blå og nesten ny. Den kan hentes i Riga sentrum.\nKirken i min by ble bygget i 1209. Den ble ødelagt i en brann, men senere ble den bygget opp igjen.\nTårnet ble malt av en kjent kunstner.\nInne må man være stille, og det er forbudt å fotografere.' },
  vid: [['NorwegianClass101', 'Norwegian passive voice'], ['Learn Norwegian Naturally', 's-passiv bli-passiv'], ['NorwegianClass101', 'Norwegian turf roof houses']],
  fact: 'В 1997 году историк обнаружил, что знаменитый «Крик» Мунка существует в четырёх версиях — две картины и две пастели. Одна из них была украдена (ble stjålet) в 2004 году и найдена два года спустя.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian passive', 'https://en.wikibooks.org/wiki/Norwegian'], ['Språkrådet', 'https://www.sprakradet.no/']],
});
NOTE('b1-4', {
  crow: 'Пассив! *Fisken ble spist.* Рыба была съедена. Кем — не скажу. Но у меня очень довольный вид.',
  mk: ['Напишите объявление: что-то продаётся или сдаётся (s-пассив).|selges/leies|Gammel sofa selges billig. Den kan hentes i helgen.', 'Напишите, когда и кем был построен или нарисован известный объект.|ble;av|Operahuset i Oslo ble bygget i 2008 av et norsk firma.', 'Напишите правило для вашего дома или офиса (må + s-пассив).|må|Kaffemaskinen må vaskes hver fredag av alle.'],
  etym: [['torv', 'дёрн; родня английского *turf*. Из той же семьи — *torg* (площадь)? Нет! *Torg* пришло от славян — от русского «торг». Викинги торговали в Новгороде и принесли слово домой.'], ['å synes', 'изначально «показываться, казаться» (пассив от *syne* — показывать). «Мне кажется» → «я считаю». Отсюда и *synlig* — видимый.']],
  ru: 'Лось приводит друзей к старой хижине с травяной крышей. Внутри — никого, но на столе письмо, на конверте — имя Пелле. Письмо написано дедушкой много лет назад.',
  gl: { 'hytta': 'хижина', 'torv': 'дёрн', 'skilt': 'табличка', 'lukkes': 'закрываться', 'brevet': 'письмо', 'konvolutten': 'конверт', 'skrevet': 'написано', 'åpnet': 'открыто' },
  tf: ['Hytta har torv på taket.|T', 'Bestefar var i hytta.|F # Hytta var tom.', 'Navnet til Pelle var skrevet på konvolutten.|T'],
  ch: ['Hva sto det på skiltet?|Døra må lukkes|Velkommen|Forbudt å komme inn # «Døra må lukkes!»'],
  bmk: ['Представьте, что вы нашли письмо в старом доме. Что там написано? (пассив)|ble|Brevet ble skrevet for femti år siden og ble aldri sendt.'],
  etb: '*Brev* — письмо; от латинского *breve* — «краткое». Письма раньше были короткими: пергамент стоил дорого. Отсюда же «бревиарий» и английское *brief*.',
});
ST('b1-4', { t: 'Поиск жилья', tip: 'Объявления о квартирах в Норвегии — на сайте Finn.no. Формулы такие: *Leilighet leies ut*, *Hybel ledig* (свободна комната). На просмотр (*visning*) приходят толпой и задают вопросы — это нормально.',
  sit: 'Вы пришли на просмотр квартиры в Осло.', ph: [['Er strøm inkludert?', 'Электричество включено?'], ['Når kan jeg flytte inn?', 'Когда можно въехать?'], ['Er det lov å ha katt?', 'Можно держать кота?'], ['Leiligheten ble pusset opp i fjor.', 'Квартиру отремонтировали в прошлом году.']],
  dlg: ['Хозяин: «Leiligheten ble pusset opp i fjor.» Вы хотите узнать про кота.|Så fint! Er det lov å ha katt?|Katten min blir pusset.|Hvor er katten? # Вопрос про разрешение — er det lov.', 'Вы хотите знать, включено ли электричество.|Er strøm inkludert i leia?|Strøm er?|Hvor er strøm? # inkludert — включено.'],
  mk: 'Задайте хозяину квартиры два вопроса (одно с пассивом или «er det lov»).|lov/inkludert|Er det lov å ha katt? Og er internett inkludert i prisen?' });
BK('b1-4', 'Kapittel 16. Brevet på bordet', ['Hytta lå ved et lite vann, høyt oppe i fjellet. Den var bygget av gamle tømmerstokker, og taket var dekket med torv. Det vokste blåklokker mellom gresset.', 'Over døra hang et skilt: «Døra må lukkes! Sauene er nysgjerrige.» Mari lo. «Akkurat som jeg.»', 'Inne var det kaldt og stille. Peisen hadde ikke blitt brukt på lenge. Men på bordet lå det et brev. Konvolutten var aldri blitt åpnet, og på den var det skrevet med skjeve bokstaver: «Til Pelle.»', 'Pelle skalv da han åpnet brevet. «Kjære barnebarn,» sto det. «Hvis du leser dette, har du fulgt kartet mitt. Jeg er ikke her lenger. Jeg venter på deg i Oslo — der det røde krysset er tegnet. Bestefar Per.»']);

U({
  id: 'b1-5', lvl: 'B1', t: 'Сравнение: større, størst, mer', en: 'Gradbøying av adjektiv',
  goals: ['сравнивать: *høyere enn, den høyeste*', 'знать неправильные формы: *god — bedre — best, stor — større — størst*', 'говорить «такой же … как»: *like … som*'],
  th: `<h4>Обычно: -ere и -est</h4>
  <p><i>høy — høy<b>ere</b> — høy<b>est</b></i> (высокий), <i>kald — kald<b>ere</b> — kald<b>est</b></i>, <i>billig — billig<b>ere</b> — billig<b>st</b></i> (на -ig — просто <i>-st</i>). «Чем» — <b>enn</b>: <i>Galdhøpiggen er høyere enn Glittertind.</i></p>
  <h4>Неправильные — учить наизусть</h4>
  <div class="tbl"><table><thead><tr><th></th><th>сравн.</th><th>превосх.</th></tr></thead><tbody>
  <tr><td><i>god / bra</i> — хороший</td><td><i>bedre</i></td><td><i>best</i></td></tr>
  <tr><td><i>dårlig / vond</i> — плохой</td><td><i>verre</i></td><td><i>verst</i></td></tr>
  <tr><td><i>stor</i> — большой</td><td><i>større</i></td><td><i>størst</i></td></tr>
  <tr><td><i>liten</i> — маленький</td><td><i>mindre</i></td><td><i>minst</i></td></tr>
  <tr><td><i>gammel</i> — старый</td><td><i>eldre</i></td><td><i>eldst</i></td></tr>
  <tr><td><i>ung</i> — молодой</td><td><i>yngre</i></td><td><i>yngst</i></td></tr>
  <tr><td><i>lang</i> — длинный</td><td><i>lengre</i></td><td><i>lengst</i></td></tr>
  <tr><td><i>mye / mange</i> — много</td><td><i>mer / flere</i></td><td><i>mest / flest</i></td></tr></tbody></table></div>
  <h4>Длинные слова: mer и mest</h4>
  <p>С длинными и иностранными прилагательными (особенно на <i>-sk</i>, <i>-ende</i>) — <i>mer / mest</i>: <i>interessant → mer interessant → mest interessant</i>, <i>praktisk → mer praktisk</i>.</p>
  <h4>«Самый …» перед словом</h4>
  <p>Как с обычными прилагательными: <i>den høy<b>este</b> toppen</i> (самая высокая вершина) — артикль + <i>-e</i> + окончание. После <i>er</i>: <i>Denne toppen er høyest.</i></p>
  <h4>Такой же … как</h4>
  <p><i><b>like</b> stor <b>som</b></i> — такой же большой, как. <i>ikke så … som</i> — не такой … как: <i>Oslo er ikke så regnfull som Bergen.</i></p>`,
  simple: 'høyere enn, den høyeste. god — bedre — best, stor — større — størst, gammel — eldre — eldst. Длинные — mer/mest. like … som — такой же … как.',
  exm: [['Galdhøpiggen er det høyeste fjellet i Norge.', 'Гальхёпигген — самая высокая гора Норвегии.'], ['Bergen er mer regnfull enn Oslo.', 'В Бергене дождливее, чем в Осло.'], ['Broren min er eldre enn meg.', 'Мой брат старше меня.'], ['Kaffen her er like god som i Italia.', 'Кофе здесь такой же хороший, как в Италии.']],
  conf: [['*godere* / *bedre*', '<i>god — bedre — best</i>. «Godere» не бывает.', '«Сегодня погода лучше»:|Været er bedre i dag.|Været er godere i dag.|Været er mer god i dag. # god → bedre.'],
    ['*enn* / *som*', 'Сравнение «чем» — <i>enn</i>: <i>større enn</i>. «Такой же, как» — <i>like … som</i>.', '«Она выше, чем я»:|Hun er høyere enn meg.|Hun er høyere som meg.|Hun er like høy enn meg. # чем — enn.']],
  words: [['høy', 'высокий', 'Fjellet er høyt.'], ['bedre', 'лучше', 'Det går bedre nå.'], ['best', 'лучший', 'Mamma lager de beste vaflene.'], ['verre', 'хуже', 'Været ble verre.'], ['større', 'больше', 'Oslo er større enn Bergen.'], ['eldre', 'старше', 'Han er eldre enn meg.'], ['enn', 'чем', 'Hun er raskere enn meg.'], ['like … som', 'такой же … как', 'Han er like høy som faren.'], ['rask', 'быстрый', 'Mari er raskere enn Pelle.'], ['tung', 'тяжёлый', 'Sekken er tyngre nå.']],
  ex: [
    { t: 'gap', h: 'Сравнительная степень (+ enn).', q: ['Oslo er ___ enn Bergen. (stor)|større', 'Været er ___ i dag. (god)|bedre', 'Mari er ___ enn Pelle. (rask)|raskere', 'Broren min er ___ enn meg. (gammel)|eldre', 'Denne boka er ___ enn den. (interessant)|mer interessant', 'Det ble ___ og ___. (kald; dårlig)|kaldere;verre'] },
    { t: 'gap', h: 'Превосходная степень.', q: ['Galdhøpiggen er det ___ fjellet i Norge. (høy)|høyeste', 'Mamma lager de ___ vaflene. (god)|beste', 'Hvem er ___ i familien? (ung)|yngst', 'Dette er den ___ dagen i mitt liv! (lang)|lengste', 'Røst er en av de ___ øyene. (liten)|minste'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['«Он старше меня»:|Han er eldre enn meg.|Han er gamlere enn meg.|Han er mer gammel som meg. # gammel → eldre.', '«Осло не такой дождливый, как Берген»:|Oslo er ikke så regnfull som Bergen.|Oslo er ikke så regnfull enn Bergen.|Oslo er mindre regnfull som Bergen. # ikke så … som.', '«самая красивая гора»:|det vakreste fjellet|den vakreste fjell|det mest vakker fjellet # det + -este + -et.', '«больше людей»:|flere folk|merere folk|mange folk mer # mange → flere.'] },
    { t: 'fix', q: ['Været er godere i dag.|Været er bedre i dag. # god → bedre.', 'Hun er høyere som meg.|Hun er høyere enn meg. # чем — enn.', 'Det er det høyest fjellet.|Det er det høyeste fjellet. # Перед словом — -este.', 'Han er like høy enn faren.|Han er like høy som faren. # like … som.'] },
    { t: 'tr', q: ['Осло больше Бергена.|Oslo er større enn Bergen.', 'Сегодня погода лучше.|Været er bedre i dag.|I dag er været bedre.', 'Это самая высокая гора в Норвегии.|Det er det høyeste fjellet i Norge.|Dette er det høyeste fjellet i Norge.', 'Мой брат старше меня.|Broren min er eldre enn meg.|Min bror er eldre enn meg.'] },
  ],
  read: {
    title: 'Norge i tall', intro: 'Факты о Норвегии — найдите все сравнения.',
    txt: ['Norge er litt større enn Italia, men det bor mye færre folk her: bare fem og en halv million. Den største byen er Oslo, og den nest største er Bergen.', 'Det høyeste fjellet heter Galdhøpiggen. Det er 2469 meter høyt. Den lengste fjorden er Sognefjorden — den er over 200 kilometer lang og mer enn 1300 meter dyp.', 'Den kaldeste byen er Karasjok i Finnmark. Der kan det bli minus femti grader. Men Bergen er kjent for noe annet: det er den mest regnfulle byen i Europa.'],
    gl: { 'færre': 'меньше (людей)', 'nest største': 'второй по величине', 'dyp': 'глубокий', 'grader': 'градусы', 'kjent for': 'известен', 'noe annet': 'другое' },
    q: [{ t: 'tf', q: ['Norge er mindre enn Italia.|F # Litt større enn Italia.', 'Det bor flere folk i Norge enn i Italia.|F # Mye færre folk.', 'Sognefjorden er den lengste fjorden.|T', 'Karasjok er den kaldeste byen.|T'] },
      { t: 'choice', q: ['Hvor høyt er Galdhøpiggen?|2469 meter|1300 meter|200 meter', 'Hva er Bergen kjent for?|regn|kulde|sol'] }],
  },
  series: [{ show: 'ordtak', who: 'норвежская пословица', q: 'Bedre føre var enn etter snar.', mean: '«Лучше осторожным заранее, чем умным потом» — береженого бог бережёт.', fun: 'Старая форма: <i>var</i> — осторожный (как английское <i>wary</i>), <i>snar</i> — быстрый, сообразительный. В горах эту пословицу понимают буквально: возьми лишний свитер.', use: 'Ta med ekstra genser. Bedre føre var enn etter snar!', qz: 'Смысл пословицы:|лучше подготовиться заранее|лучше быть быстрым|осторожность мешает # føre — до, etter — после.' },
    { show: 'uttrykk', who: 'норвежское выражение', q: 'Jo før, jo bedre.', mean: '«Чем раньше, тем лучше». Конструкция <i>jo … jo …</i> = «чем …, тем …».', fun: 'Так же: <i>Jo mer, jo bedre</i> — чем больше, тем лучше; <i>Jo eldre, jo klokere</i> — чем старше, тем мудрее.', use: 'Når skal vi dra? Jo før, jo bedre!', qz: '«Jo mer jeg øver, jo bedre blir jeg» значит…|чем больше я тренируюсь, тем лучше становлюсь|я много тренируюсь и хорошо|больше не нужно # jo … jo — чем … тем.' }],
  write: { h: 'Сравните свой город (или страну) с норвежским: что больше, холоднее, дороже, красивее? Самое-самое?', min: 70, use: ['enn', 'større/mindre', 'bedre', 'den/det … -este', 'like … som'],
    plan: ['Размер и жители: … er større/mindre enn …', 'Погода: … er kaldere/varmere …', 'Цены: … er dyrere/billigere …', 'Самое-самое: Den vakreste … / Det beste …', 'like … som или ikke så … som.'],
    model: 'Riga er mindre enn Oslo, men den er eldre — byen ble grunnlagt i 1201.\nOm vinteren er det kaldere i Riga enn i Bergen, men det regner ikke like mye.\nNorge er mye dyrere enn Latvia: en kopp kaffe koster dobbelt så mye.\nDen vakreste plassen i Riga er gamlebyen, og det beste er de små kafeene.\nRiga er ikke så fjellrik som Norge, men havet er like vakkert.' },
  vid: [['NorwegianClass101', 'Norwegian comparatives superlatives'], ['Learn Norwegian Naturally', 'bedre best større størst'], ['NorwegianClass101', 'Norway facts geography']],
  fact: 'Если «распрямить» всю береговую линию Норвегии со всеми фьордами и островами, получится больше 100 000 км — два с половиной раза вокруг Земли.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian adjectives', 'https://en.wikibooks.org/wiki/Norwegian'], ['Ordbøkene', 'https://ordbokene.no/']],
});
NOTE('b1-5', {
  crow: 'Сравниваем! Я — *den søteste lundefuglen på Røst*. Это объективный факт. Мама так сказала.',
  mk: ['Сравните двух людей или животных (enn).|enn|Katten min er latere enn hunden til naboen.', 'Напишите о самом-самом: лучшее место, самый вкусный обед.|beste/vakreste/største|Det beste stedet i byen er en liten kafé ved elva.', 'Сравните «такой же … как» (like … som).|like;som|Norsk er ikke like vanskelig som jeg trodde.'],
  etym: [['bedre', 'родня английского *better* и немецкого *besser*. Корень — «польза, улучшение». Своего *godere* у норвежцев так и не появилось.'], ['eldre', 'старше; от *gammel* не образуется! Это остаток древнего *ald* — «возраст» (как английское *old — elder*). Отсюда же *alder* — возраст.']],
  ru: 'Друзья спускаются с гор. Мари летит быстрее всех, Алина идёт медленнее всех, а Пелле — посередине. Лось Эрик провожает их до станции. Самое трудное позади, но впереди — самое важное.',
  gl: { 'raskere': 'быстрее', 'saktere': 'медленнее', 'tyngre': 'тяжелее', 'verste': 'худшее', 'viktigste': 'самое важное', 'stasjonen': 'станция', 'enn': 'чем' },
  tf: ['Mari var raskere enn Alina.|T', 'Sekken til Alina ble lettere.|F # Den ble tyngre.', 'Det viktigste lå foran dem.|T'],
  ch: ['Hvem fulgte dem til stasjonen?|Erik|bestefar|kapteinen # Elgen Erik fulgte dem.'],
  bmk: ['Что для вас было самым трудным в этом году, а что — лучшим? (превосходная степень)|verste/beste|Det verste i år var vinteren, men det beste var ferien på Lofoten.'],
  etb: '*Saktere* — медленнее; от *sakte* — медленно. Норвежский способ сказать «не спеши»: *Ta det med ro* — «прими это со спокойствием».',
});
ST('b1-5', { t: 'Что лучше? Выбрать вместе', tip: 'Когда норвежцы выбирают ресторан или фильм, никто не хочет навязывать своё мнение. Отсюда бесконечное *Jeg er enig i alt!* («мне всё подходит»). Чтобы помочь, предложите сравнение: *Den er billigere, men den andre er koseligere.*',
  sit: 'Вы с другом выбираете кафе в Осло.', ph: [['Hva synes du er best?', 'Что, по-твоему, лучше?'], ['Den er billigere, men den andre er koseligere.', 'Это дешевле, но то уютнее.'], ['Jeg er enig.', 'Согласна.'], ['Det spiller ingen rolle for meg.', 'Мне без разницы.']],
  dlg: ['Друг: «Skal vi gå til kafeen ved elva eller den på torget?»|Kafeen ved elva er koseligere, men den på torget er billigere. Hva synes du?|Begge er kafeer.|Jeg er ikke sulten. # Сравнение + вопрос.', 'Друг: «Hva synes du er best?» Вам правда всё равно.|Det spiller ingen rolle for meg — du velger!|Jeg synes ingenting.|Best er best. # spille ingen rolle — не играть роли.'],
  mk: 'Сравните два варианта (кафе, фильма, маршрута) и спросите мнение друга.|enn|Denne filmen er morsommere enn den andre. Hva synes du?' });
BK('b1-5', 'Kapittel 17. Ned fra fjellet', ['Neste morgen begynte de å gå ned fra fjellet. Det var lettere enn å gå opp, men det var fortsatt langt.', 'Mari fløy raskere enn alle de andre. Alina gikk saktere og saktere, fordi sekken hennes ble tyngre for hver time. Hun hadde jo tegnet nesten hundre skisser!', 'Erik fulgte dem hele veien til stasjonen. «Dette var den beste turen i mitt liv,» sa han. «Det verste er å si ha det.»', '«Vi kommer tilbake,» lovet Pelle. «Men nå må vi til Oslo. Det viktigste ligger foran oss.» Erik nikket alvorlig. «Hils bestefaren din. Han er den klokeste fuglen jeg har møtt.»']);

U({
  id: 'b1-6', lvl: 'B1', t: 'Связки: derfor, likevel, dessuten', en: 'Bindeord og konnektorer',
  goals: ['связывать мысли: *derfor, likevel, dessuten, til slutt*', 'делать инверсию после наречий-связок', 'использовать пары *både … og, enten … eller, verken … eller* и различать *når* и *da*'],
  th: `<h4>Три вида связок — три порядка слов</h4>
  <div class="tbl"><table><thead><tr><th>Вид</th><th>Слова</th><th>Порядок</th></tr></thead><tbody>
  <tr><td>сочинительные</td><td><i>og, men, eller, for, så</i></td><td>обычный: <i>…, men jeg <b>er</b> trøtt.</i></td></tr>
  <tr><td>подчинительные (B1.1)</td><td><i>fordi, at, når, hvis, selv om</i></td><td>придаточный (ikke перед глаголом)</td></tr>
  <tr><td>наречия-связки</td><td><i>derfor</i> (поэтому), <i>likevel</i> (тем не менее), <i>dessuten</i> (кроме того), <i>altså</i> (значит), <i>da</i> (тогда), <i>etterpå</i> (потом), <i>til slutt</i> (в конце концов)</td><td><b>инверсия</b>: <i>Derfor <b>er</b> jeg trøtt.</i></td></tr></tbody></table></div>
  <p>Ловушка: <i>fordi</i> и <i>derfor</i> — оба про причину, но порядок разный: <i>Jeg er trøtt <b>fordi jeg</b> sov dårlig.</i> ↔ <i>Jeg sov dårlig. <b>Derfor er jeg</b> trøtt.</i></p>
  <p>И <i>så</i> «поэтому, так что» (сочинительное) — без инверсии: <i>Det regnet, <b>så vi</b> ble hjemme.</i> А <i>så</i> «потом» в начале — с инверсией: <i><b>Så gikk</b> vi hjem.</i></p>
  <h4>Пары</h4>
  <ul><li><i>både … og</i> — и … и: <i>Hun snakker både norsk og engelsk.</i></li><li><i>enten … eller</i> — или … или: <i>Vi tar enten tog eller buss.</i></li><li><i>verken … eller</i> — ни … ни: <i>Jeg liker verken fisk eller kjøtt.</i></li></ul>
  <h4>når или da?</h4>
  <p>Оба — «когда». <b>da</b> — один раз в прошлом: <i>Da jeg var barn, bodde jeg i Riga.</i> <b>når</b> — настоящее, будущее и «каждый раз» в прошлом: <i>Når jeg er trøtt, drikker jeg kaffe. Når vi kom hjem, var mamma alltid glad.</i></p>`,
  simple: 'derfor, likevel, dessuten в начале — инверсия: Derfor er jeg trøtt. fordi — без неё. da — один раз в прошлом, når — всегда/будущее.',
  exm: [['Det regnet. Derfor ble vi hjemme.', 'Шёл дождь. Поэтому мы остались дома.'], ['Det var kaldt. Likevel gikk vi på tur.', 'Было холодно. Тем не менее мы пошли гулять.'], ['Da jeg var barn, bodde jeg i Riga.', 'Когда я была ребёнком, я жила в Риге.'], ['Hun snakker både norsk og latvisk.', 'Она говорит и по-норвежски, и по-латышски.']],
  conf: [['*fordi* / *derfor*', '<i>fordi</i> — «потому что» (придаточное, без инверсии); <i>derfor</i> — «поэтому» (с инверсией).', '«Я устала, поэтому ложусь»:|Jeg er trøtt. Derfor legger jeg meg.|Jeg er trøtt. Derfor jeg legger meg.|Jeg er trøtt fordi legger jeg meg. # derfor + инверсия.'],
    ['*da* / *når*', '<i>da</i> — один раз в прошлом. <i>når</i> — повторялось или в будущем.', '«Когда я приехала в Осло (в 2020-м), шёл снег»:|Da jeg kom til Oslo, snødde det.|Når jeg kom til Oslo, snødde det.|Hvis jeg kom til Oslo, snødde det. # Один раз в прошлом — da.']],
  words: [['derfor', 'поэтому', 'Derfor er jeg her.'], ['likevel', 'тем не менее', 'Likevel gikk vi ut.'], ['dessuten', 'кроме того', 'Dessuten er det billig.'], ['til slutt', 'в конце концов', 'Til slutt fant vi veien.'], ['etterpå', 'потом', 'Etterpå drakk vi kaffe.'], ['altså', 'значит, то есть', 'Du kommer altså ikke?'], ['både … og', 'и … и', 'Både Mari og Pelle var glade.'], ['enten … eller', 'или … или', 'Vi tar enten tog eller fly.'], ['verken … eller', 'ни … ни', 'Jeg liker verken te eller kaffe.'], ['da', 'когда (один раз в прошлом)', 'Da jeg var liten, hadde vi hund.']],
  ex: [
    { t: 'order', hint: 'После derfor, likevel, dessuten — инверсия.', q: ['Derfor ble vi hjemme i går.', 'Likevel gikk vi på tur.', 'Dessuten er det veldig billig.', 'Til slutt fant vi veien hjem.', 'Da jeg var barn, bodde jeg i Riga.'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['Выберите верное:|Jeg var syk. Derfor var jeg hjemme.|Jeg var syk. Derfor jeg var hjemme.|Jeg var syk derfor jeg hjemme var. # derfor + инверсия.', 'Выберите верное:|Jeg var hjemme fordi jeg var syk.|Jeg var hjemme fordi var jeg syk.|Jeg var hjemme derfor jeg var syk. # fordi — без инверсии.', '«Ни … ни»:|Jeg liker verken fisk eller kjøtt.|Jeg liker ikke enten fisk eller kjøtt.|Jeg liker både ikke fisk og kjøtt. # verken … eller.', '«Когда я была маленькой» (один период):|Da jeg var liten|Når jeg var liten|Hvis jeg var liten # da — прошлое.', '«Каждый раз, когда идёт дождь, я читаю»:|Når det regner, leser jeg.|Da det regner, leser jeg.|Derfor det regner, leser jeg. # Повторение — når.'] },
    { t: 'fix', q: ['Det var kaldt. Likevel vi gikk ut.|Det var kaldt. Likevel gikk vi ut. # likevel + инверсия.', 'Når jeg var fem år, flyttet vi.|Da jeg var fem år, flyttet vi. # Один раз в прошлом — da.', 'Jeg liker ikke verken te eller kaffe.|Jeg liker verken te eller kaffe. # verken уже содержит «не».', 'Dessuten den er billig.|Dessuten er den billig. # dessuten + инверсия.'] },
    { t: 'gap', h: 'Вставьте связку: derfor, likevel, dessuten, fordi, både, enten.', q: ['Det var storm. ___ ble flyet forsinket.|Derfor', 'Det var kaldt. ___ badet vi i sjøen.|Likevel', 'Leiligheten er stor. ___ er den billig.|Dessuten', 'Vi ble hjemme ___ det regnet.|fordi', 'Hun er ___ kunstner og lærer.|både', 'Vi tar ___ tog eller buss.|enten'] },
    { t: 'tr', q: ['Шёл дождь. Поэтому мы остались дома.|Det regnet. Derfor ble vi hjemme.', 'Было холодно. Тем не менее мы пошли гулять.|Det var kaldt. Likevel gikk vi på tur.|Det var kaldt. Likevel gikk vi tur.', 'Когда я была ребёнком, у нас была собака.|Da jeg var barn, hadde vi en hund.|Da jeg var liten, hadde vi en hund.|Da jeg var barn, hadde vi hund.', 'Я не люблю ни чай, ни кофе.|Jeg liker verken te eller kaffe.'] },
  ],
  read: {
    title: 'Toget til Oslo', intro: 'Найдите все связки и посмотрите на порядок слов после них.',
    txt: ['Toget til Oslo var forsinket på grunn av snø. Derfor måtte vennene vente på stasjonen i to timer. Likevel var ingen sure. Dessuten hadde kiosken både vafler og varm sjokolade.', 'Da toget endelig kom, satte de seg ved vinduet. Alina tegnet, Mari sov, og Pelle leste brevet til bestefar enda en gang.', '«Enten er bestefar fortsatt i Oslo, eller så har han reist videre,» sa han stille. «Vi finner ham uansett,» sa Alina. Til slutt sovnet Pelle også.'],
    gl: { 'forsinket': 'опаздывал', 'på grunn av': 'из-за', 'sure': 'кислые, недовольные', 'kiosken': 'киоск', 'endelig': 'наконец', 'enda en gang': 'ещё раз', 'reist videre': 'уехал дальше', 'uansett': 'в любом случае', 'sovnet': 'уснул' },
    q: [{ t: 'tf', q: ['Toget var forsinket på grunn av regn.|F # På grunn av snø.', 'Vennene var sure.|F # Likevel var ingen sure.', 'Kiosken hadde vafler.|T', 'Pelle sovnet til slutt.|T'] },
      { t: 'choice', q: ['Hvor lenge ventet de?|i to timer|i ti minutter|hele dagen', 'Hva sa Alina?|Vi finner ham uansett.|Vi må reise hjem.|Bestefar er borte.'] }],
  },
  series: [{ show: 'kultur', who: 'типично норвежское', q: 'Janteloven', mean: '«Закон Янте» — неписаное правило: не считай себя лучше других, не хвастайся.', fun: 'Придумал его писатель Аксель Сандемусе в романе 1933 года — как сатиру. А норвежцы узнали себя. Поэтому миллионер в Норвегии ездит на старой «Вольво» и говорит, что у него всё «greit».', use: 'Han vant gull, men sa bare «det gikk greit». Typisk Janteloven!', qz: 'Что запрещает «Janteloven»?|хвастаться и ставить себя выше других|работать по выходным|громко петь # Неписаное правило скромности.' },
    { show: 'uttrykk', who: 'норвежское выражение', q: 'Det er ikke noe å skryte av.', mean: '«Тут нечем хвастаться» — так скромно отвечают на комплимент.', fun: 'Норвежец пробежал марафон: <i>Det er ikke noe å skryte av.</i> Испёк торт на 50 человек: <i>Det er ikke noe å skryte av.</i> Это Janteloven в действии.', use: 'Takk, men det er ikke noe å skryte av.', qz: 'Вас похвалили за отличный рисунок. Самый «норвежский» ответ:|Takk, det er ikke noe å skryte av.|Ja, jeg er best.|Selvfølgelig, jeg er kunstner! # Скромность — норма.' }],
  write: { h: 'Напишите связный рассказ (8–10 предложений) о трудном дне, который хорошо закончился. Используйте минимум 5 связок.', min: 80, use: ['derfor', 'likevel', 'dessuten', 'til slutt', 'da'],
    plan: ['Da …, (начало истории в прошлом).', 'Проблема: … Derfor …', 'Но: Likevel …', 'Дополнительная деталь: Dessuten …', 'Til slutt … — хороший конец.'],
    model: 'Da jeg kom til Oslo i fjor vinter, var alt nytt og vanskelig.\nFlyet var forsinket, og bagasjen min ble borte. Derfor hadde jeg verken varme klær eller tannbørste.\nDet var minus femten grader. Likevel smilte jeg, fordi byen var så vakker med all snøen.\nDessuten var hotellet varmt og koselig.\nNeste dag kjøpte jeg både lue og votter på et marked.\nTil slutt kom bagasjen min, og jeg feiret med en stor kopp kakao.' },
  vid: [['NorwegianClass101', 'Norwegian connectors derfor likevel'], ['Learn Norwegian Naturally', 'når eller da'], ['NorwegianClass101', 'Janteloven Norwegian culture']],
  fact: 'Вымышленный город Янте из романа Сандемусе списан с датского городка Нюкёбинг, где писатель вырос. Но слово «Janteloven» стало по-настоящему норвежским — им объясняют норвежскую скромность.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Språkrådet — når eller da', 'https://www.sprakradet.no/'], ['Wikibooks — Norwegian conjunctions', 'https://en.wikibooks.org/wiki/Norwegian']],
});
NOTE('b1-6', {
  crow: 'Связки — это клей для мыслей. Без них вы говорите как я после трёх часов полёта: «Рыба. Устал. Спать.» С ними — как поэт.',
  mk: ['Напишите два предложения со связкой *derfor* (и инверсией).|derfor|Jeg sov dårlig i natt. Derfor drikker jeg mye kaffe nå.', 'Напишите с *likevel*: что-то мешало, но вы всё равно сделали.|likevel|Det regnet hele dagen. Likevel gikk vi en lang tur.', 'Расскажите, что было *da* вы были ребёнком.|da|Da jeg var barn, tegnet jeg katter på alle bøkene mine.'],
  etym: [['likevel', '«одинаково хорошо» — *like* + *vel*. «Всё равно, тем не менее» = «одинаково хорошо, как бы ни было».'], ['dessuten', '«снаружи этого» — *dess* + *uten*. «Кроме того» = «вне того, что уже сказано».']],
  ru: 'Поезд в Осло опаздывает из-за снега. Друзья ждут, пьют какао и едят вафли. Пелле перечитывает письмо дедушки: «там, где нарисован красный крестик». Поздно вечером поезд прибывает в Осло.',
  gl: { 'forsinket': 'опаздывал', 'derfor': 'поэтому', 'likevel': 'тем не менее', 'dessuten': 'кроме того', 'til slutt': 'в конце концов', 'kakao': 'какао', 'lysene': 'огни' },
  tf: ['Toget var forsinket.|T', 'Derfor var vennene sure.|F # Likevel var ingen sure.', 'De kom til Oslo sent om kvelden.|T'],
  ch: ['Hva kjøpte de i kiosken?|både vafler og kakao|verken mat eller drikke|bare kaffe # både vafler og kakao.'],
  bmk: ['Что вы делаете, когда транспорт опаздывает? Используйте связку (derfor/likevel).|derfor/likevel|Når bussen er forsinket, leser jeg. Derfor har jeg alltid ei bok i veska.'],
  etb: '*Kakao* — норвежцы пьют горячее какао после лыж и походов, часто с «солдатиками» — булочками. *Kakao og boller* — классика зимних выходных.',
});
ST('b1-6', { t: 'Пожаловаться (вежливо)', tip: 'Норвежцы редко жалуются громко. Если что-то не так в магазине или ресторане, говорят спокойно и конкретно, со связками: *Jeg kjøpte den i går. Likevel virker den ikke. Derfor lurer jeg på…* — и почти всегда получают помощь.',
  sit: 'Вы вернулись в магазин со сломанным чайником.', ph: [['Jeg kjøpte denne i går.', 'Я купила это вчера.'], ['Likevel virker den ikke.', 'Тем не менее он не работает.'], ['Kan jeg bytte den?', 'Можно его обменять?'], ['Jeg har kvitteringen.', 'У меня есть чек.']],
  dlg: ['Продавец: «Hva kan jeg hjelpe deg med?»|Jeg kjøpte denne vannkokeren i går. Likevel virker den ikke. Kan jeg bytte den?|Den er dårlig. Gi meg penger!|Vannkoker. # Спокойно, со связками и просьбой.', 'Продавец: «Har du kvitteringen?»|Ja, her er den.|Kvittering er hjemme, men du må bytte!|Hva er kvittering? # Чек — kvittering.'],
  mk: 'Вежливо пожалуйтесь на покупку — используйте likevel или derfor.|likevel/derfor|Jeg kjøpte denne genseren i går. Likevel har den et hull. Kan jeg bytte den?' });
BK('b1-6', 'Kapittel 18. Forsinket', ['Toget til Oslo var forsinket på grunn av snø. Derfor måtte vennene vente på stasjonen i nesten tre timer. Likevel var ingen sure. Dessuten hadde den lille kiosken både vafler og kakao.', 'Mens de ventet, leste Pelle brevet til bestefar enda en gang. «Der det røde krysset er tegnet,» leste han høyt. «Men hva er det der? Et hus? En kafé? Et museum?»', '«Enten er det et sted han elsker,» sa Alina, «eller et sted der han kan se havet.» Mari tenkte. «Kanskje begge deler.»', 'Til slutt kom toget. Da de kjørte inn i Oslo sent om kvelden, så de lysene fra byen og fjorden. Pelle trykket nebbet mot vinduet. «Vi er nesten der, bestefar,» hvisket han.']);
