// Уровень A2 — определённая форма, прилагательные, прошлое и будущее, предлоги, притяжательные.

U({
  id: 'a2-1', lvl: 'A2', t: 'Определённая форма: bilen, huset', en: 'Bestemt form',
  goals: ['говорить «эта машина / та книга»: *bilen, boka, huset*', 'ставить определённую форму во множественном: *bilene, husa*', 'понимать, когда норвежец говорит «вообще», а когда «конкретно»'],
  th: `<p>В норвежском артикль «тот самый» (<i>the</i> в английском) — <b>не отдельное слово, а окончание</b>. Его приклеивают к концу существительного.</p>
  <div class="tbl"><table><thead><tr><th>Род</th><th>какой-то</th><th>тот самый</th><th>какие-то (мн.)</th><th>те самые (мн.)</th></tr></thead><tbody>
  <tr><td>en</td><td><i>en bil</i></td><td><i>bil<b>en</b></i></td><td><i>biler</i></td><td><i>bil<b>ene</b></i></td></tr>
  <tr><td>ei</td><td><i>ei bok</i></td><td><i>bok<b>a</b></i> (или <i>boken</i>)</td><td><i>bøker</i></td><td><i>bøk<b>ene</b></i></td></tr>
  <tr><td>et</td><td><i>et hus</i></td><td><i>hus<b>et</b></i></td><td><i>hus</i></td><td><i>hus<b>ene</b> / hus<b>a</b></i></td></tr></tbody></table></div>
  <p>Если слово кончается на <i>-e</i>, его не удваивают: <i>ei jente → jenta</i>, <i>et eple → eplet</i>, <i>en hytte → hytta</i>. Особые формы: <i>barn → barna</i> (дети), <i>mann → mannen → menn → mennene</i>.</p>
  <h4>Когда «тот самый»</h4>
  <ul><li>о чём уже говорили: <i>Jeg har en katt. <b>Katten</b> heter Pepper.</i></li>
  <li>что и так понятно: <i>Hvor er <b>toalettet</b>?</i> — Где туалет? <i>Sola skinner.</i> — Солнце светит.</li>
  <li>«вообще» про явление: <i>Livet er kort.</i> — Жизнь коротка.</li></ul>
  <h4>Ei-слова: -a или -en?</h4>
  <p>Можно и так и так: <i>boka</i> и <i>boken</i>, <i>jenta</i> и <i>jenten</i>. Окончание <i>-a</i> звучит более разговорно и «по-норвежски», <i>-en</i> — более книжно. Выберите одно и держитесь его.</p>`,
  simple: 'тот самый = окончание: bilen, boka, huset. Мн.: bilene, bøkene, husene. Слова на -e не удваивают: jenta, eplet.',
  exm: [['Jeg har en katt. Katten heter Pepper.', 'У меня есть кот. Кота зовут Пеппер.'], ['Hvor er toalettet?', 'Где туалет?'], ['Barna leker i hagen.', 'Дети играют в саду.'], ['Boka er på bordet.', 'Книга на столе.']],
  conf: [['*en bil* / *bilen*', '<i>en bil</i> — какая-то машина; <i>bilen</i> — та самая, о которой речь. Отдельного «the» нет.', '«Машина красная» (наша, о которой говорим):|Bilen er rød.|En bil er rød.|Den bil er rød. # Конкретная — bilen.'],
    ['*barna* / *barnene*', 'У <i>barn</i> особая форма: <i>barna</i> — эти дети. <i>Barnene</i> не говорят.', '«Дети спят»:|Barna sover.|Barnene sover.|Barner sover. # barn → barna.']],
  words: [['bordet', 'стол (тот)', 'Kaffen står på bordet.'], ['hagen', 'сад (тот)', 'Barna leker i hagen.'], ['sola', 'солнце', 'Sola skinner i dag.'], ['toalettet', 'туалет', 'Unnskyld, hvor er toalettet?'], ['vinduet', 'окно', 'Katten sitter i vinduet.'], ['døra', 'дверь', 'Døra er åpen.'], ['kjøkkenet', 'кухня', 'Mamma er på kjøkkenet.'], ['byen', 'город', 'Byen er stor.'], ['å leke', 'играть (о детях)', 'Barna leker ute.'], ['åpen', 'открытый', 'Butikken er åpen.']],
  ex: [
    { t: 'gap', h: 'Поставьте в определённую форму.', q: ['Jeg har en bil. ___ er rød.|Bilen', 'Vi har et hus. ___ er gammelt.|Huset', 'Hun leser ei bok. ___ er spennende.|Boka/Boken', 'Jeg spiser et eple. ___ er søtt.|Eplet', 'De har to barn. ___ heter Ola og Kari.|Barna', 'Hvor er ___? (туалет)|toalettet'] },
    { t: 'gap', h: 'Множественное определённое.', q: ['bil → ___ (те машины)|bilene', 'bok → ___ (те книги)|bøkene', 'hus → ___ (те дома)|husene/husa', 'jente → ___ (те девочки)|jentene', 'venn → ___ (те друзья)|vennene', 'katt → ___ (те кошки)|kattene'] },
    { t: 'choice', h: 'Неопределённая или определённая?', q: ['Jeg har ___ hund. Hunden heter Fido.|en hund|hunden|hundene # Впервые — en hund.', '___ skinner i dag.|Sola|Ei sol|Sol # Солнце одно — понятно какое.', 'Unnskyld, hvor er ___?|stasjonen|en stasjon|stasjoner # Конкретный вокзал.', 'Vi har to katter. ___ sover nå.|Kattene|Katter|Katten # Те самые две кошки.'] },
    { t: 'order', q: ['Katten sitter i vinduet.', 'Barna leker i hagen.', 'Boka er på bordet.', 'Mamma lager mat på kjøkkenet.', 'Døra er åpen nå.'] },
    { t: 'tr', q: ['Книга на столе.|Boka er på bordet.|Boken er på bordet.|Boka ligger på bordet.|Boken ligger på bordet.', 'Где туалет?|Hvor er toalettet?', 'Дети играют в саду.|Barna leker i hagen.', 'Солнце светит.|Sola skinner.|Solen skinner.'] },
  ],
  read: {
    title: 'På båten', intro: 'Найдите все слова с окончаниями -en, -a, -et, -ene.',
    txt: ['Båten er stor. På båten er det en kafé, en butikk og mange lugarer. Lugaren til Pelle og Mari er liten, men vinduet er stort.', 'Kokken heter Ole. Kjøkkenet er varmt, og maten lukter godt. Ole gir fuglene fisk.', 'Om kvelden står passasjerene på dekket. De ser på fjellene og på havet. Sola går ikke ned. Det er midnattssol!'],
    gl: { 'butikk': 'магазин', 'lugarer': 'каюты', 'lugaren': 'каюта', 'kokken': 'кок, повар', 'lukter': 'пахнет', 'passasjerene': 'пассажиры', 'går ikke ned': 'не садится', 'midnattssol': 'полуночное солнце' },
    q: [{ t: 'tf', q: ['Lugaren er stor.|F # Lugaren er liten.', 'Kokken heter Ole.|T', 'Ole gir fuglene fisk.|T', 'Om kvelden går sola ned.|F # Det er midnattssol.'] },
      { t: 'choice', q: ['Hva er stort i lugaren?|vinduet|senga|bordet', 'Hvor står passasjerene om kvelden?|på dekket|i kafeen|i butikken'] }],
  },
  series: [{ show: 'kultur', who: 'типично норвежское', q: 'Midnattssol og mørketid', mean: '«Полуночное солнце» летом и «тёмное время» зимой: за Полярным кругом солнце летом не садится, а зимой не встаёт.', fun: 'В Тромсё в декабре солнца нет почти два месяца — и норвежцы зажигают свечи в каждом окне. Это время называют <i>mørketid</i> и… любят: уют!', use: 'I Tromsø er det mørketid i desember.', qz: 'Что такое «mørketid»?|время, когда солнце не встаёт|время полуночного солнца|ночная смена # mørk — тёмный, tid — время.' },
    { show: 'uttrykk', who: 'норвежское выражение', q: 'Livet er herlig!', mean: '«Жизнь прекрасна!» — обратите внимание: <i>livet</i> в определённой форме, хотя речь о жизни вообще.', fun: 'Так же: <i>Kjærligheten er blind</i> — любовь слепа. Абстрактное «вообще» по-норвежски — часто с окончанием.', use: 'Sola skinner og kaffen er varm. Livet er herlig!', qz: '«Жизнь коротка» по-норвежски:|Livet er kort.|Et liv er kort.|Liv er kort. # Об абстрактном — определённая форма.' }],
  write: { h: 'Опишите комнату, в которой сидите: что там есть и где (впервые — en/et, потом — -en/-et).', min: 20, use: ['bordet', 'vinduet', 'det er', 'på'],
    plan: ['I rommet er det …', 'Потом опишите те же предметы: Bordet er …', 'Где сидит кот / лежит книга.', 'Что видно в окно.'],
    model: 'Jeg sitter i stua. I stua er det et bord, en sofa og et stort vindu.\nBordet er gammelt og brunt. På bordet står det en kopp kaffe.\nKatten sover på sofaen.\nFra vinduet ser jeg parken og byen.' },
  vid: [['NorwegianClass101', 'Norwegian definite form nouns'], ['Learn Norwegian Naturally', 'bestemt form Norwegian'], ['NorwegianClass101', 'Hurtigruten midnight sun']],
  fact: 'Определённый артикль в конце слова — скандинавская особенность. Так же в шведском, датском и… румынском, болгарском и албанском. А в древнескандинавском это было отдельное слово «тот», которое «приросло» к существительному.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian nouns', 'https://en.wikibooks.org/wiki/Norwegian'], ['Ordbøkene', 'https://ordbokene.no/']],
});
NOTE('a2-1', {
  crow: 'Сегодня — окончание «тот самый». *En fisk* — какая-то рыба. *Fisken* — моя рыба, и не трогайте её.',
  mk: ['Напишите о своей вещи два предложения: сначала с *en/et*, потом с окончанием.|har|Jeg har en sykkel. Sykkelen er gammel og blå.', 'Напишите, где сейчас ваш кот, телефон или книга (на столе, у окна…).|bordet/vinduet|Telefonen min ligger på bordet ved vinduet.', 'Спросите, где находится что-то в доме (туалет, кухня).|hvor|Unnskyld, hvor er kjøkkenet og toalettet?'],
  etym: [['vindu', '«глаз ветра» — древнее *vindauga*: *vindr* (ветер) + *auga* (глаз). Раньше окно было просто дырой в крыше. Англичане взяли слово у викингов: *window*.'], ['butikk', 'из французского *boutique*. Норвежцы взяли много французских слов в XVIII веке, когда всё французское было модным.']],
  ru: 'На корабле Пелле и Мари знакомятся с поваром Уле. Он кормит их рыбой и рассказывает: много лет назад на корабле плавал старый тупик в моряцкой шапке — он рисовал карты.',
  gl: { 'kokken': 'кок', 'kjøkkenet': 'кухня', 'sjømannslue': 'моряцкая шапка', 'skipet': 'корабль', 'for mange år siden': 'много лет назад', 'tegnet': 'рисовал' },
  tf: ['Kokken heter Ole.|T', 'Ole gir fuglene kake.|F # Han gir dem fisk.', 'Ole husker en gammel lundefugl.|T'],
  ch: ['Hva hadde den gamle lundefuglen på hodet?|ei sjømannslue|en hatt|ingenting # ei rød sjømannslue.'],
  bmk: ['Напишите, что вы помните о каком-то старом друге или родственнике (одно-два предложения).|husker|Jeg husker bestemor og kakene hennes.'],
  etb: '*Skip* и *båt*: оба — «корабль», но *skip* — большое судно, а *båt* — любая лодка. От *skip* — английское *ship* и слово «шкипер» (*skipper*).',
});
ST('a2-1', { t: 'В гостях: где что?', tip: 'В Норвегии в доме разуваются — всегда. А ещё принято спросить хозяина, прежде чем брать что-то с кухни: *Kan jeg ta et glass vann?* Норвежцы ценят, когда гость «не наглеет».',
  sit: 'Вы в гостях у норвежской подруги.', ph: [['Skal jeg ta av meg skoene?', 'Мне снять обувь?'], ['Hvor er toalettet?', 'Где туалет?'], ['Kan jeg ta et glass vann?', 'Можно стакан воды?'], ['For et koselig hus!', 'Какой уютный дом!']],
  dlg: ['Вы входите в дом.|Skal jeg ta av meg skoene?|Jeg går inn med skoene.|Hvor er sofaen? # В Норвегии в доме разуваются.', 'Хозяйка показывает гостиную.|For et koselig hus!|Huset er et hus.|Det er lite. # Похвалить уют — лучший комплимент.'],
  mk: 'Похвалите дом друга и спросите, где что-нибудь находится.|hvor|For et koselig hus! Hvor er kjøkkenet?' });
BK('a2-1', 'Kapittel 7. Kokken Ole', ['Båten er stor og fin. Pelle og Mari finner kjøkkenet. Der står kokken. Han heter Ole, og han har et stort, rødt skjegg.', '«Er dere sultne?» spør Ole. Han gir fuglene fisk. Fisken er fersk og god. Mari er ikke sjøsyk lenger.', 'Pelle viser Ole kartet. Ole ser lenge på det. «Dette kartet kjenner jeg,» sier han stille.', '«For mange år siden var det en gammel lundefugl på skipet. Han hadde ei rød sjømannslue, og han tegnet kart. Han tegnet hele dagen!»', '«Det er bestefar!» roper Pelle.']);

U({
  id: 'a2-2', lvl: 'A2', t: 'Прилагательные: stor, stort, store', en: 'Adjektiv',
  goals: ['согласовывать прилагательное: *en stor bil, et stort hus, store biler*', 'говорить «тот большой дом»: *det store huset*', 'знать особые слова *liten, gammel, ny, god*'],
  th: `<p>Прилагательное в норвежском меняется — но всего на две буквы: <b>-t</b> для среднего рода и <b>-e</b> для множественного числа и определённой формы.</p>
  <div class="tbl"><table><thead><tr><th></th><th>en</th><th>et</th><th>мн. ч. / тот самый</th></tr></thead><tbody>
  <tr><td>большой</td><td><i>en stor bil</i></td><td><i>et stor<b>t</b> hus</i></td><td><i>stor<b>e</b> biler</i></td></tr>
  <tr><td>красивый</td><td><i>en fin dag</i></td><td><i>et fin<b>t</b> bilde</i></td><td><i>fin<b>e</b> dager</i></td></tr>
  <tr><td>новый</td><td><i>en ny jakke</i></td><td><i>et ny<b>tt</b> år</i></td><td><i>ny<b>e</b> sko</i></td></tr></tbody></table></div>
  <p>То же после <i>er</i>: <i>Bilen er stor. Huset er stort. Bilene er store.</i></p>
  <h4>«Тот большой дом» — двойная определённость</h4>
  <p>Если перед существительным стоит прилагательное и речь о конкретном предмете, нужны <b>три</b> вещи: отдельный артикль <b>den / det / de</b>, прилагательное на <b>-e</b> и окончание у существительного:</p>
  <p><i><b>den</b> stor<b>e</b> bil<b>en</b></i> — та большая машина, <i><b>det</b> stor<b>e</b> hus<b>et</b></i> — тот большой дом, <i><b>de</b> stor<b>e</b> bil<b>ene</b></i> — те большие машины.</p>
  <h4>Без -t</h4>
  <p>Прилагательные на <i>-ig, -isk</i> и некоторые другие не берут -t: <i>et koselig hus, et norsk ord, et billig eple</i>. А <i>god</i> → <i>godt</i>, <i>gammel</i> → <i>gammelt / gamle</i>.</p>
  <h4>Особое: liten (маленький)</h4>
  <p><i>en liten bil, ei lita hytte, et lite hus, små hus, den lille bilen, de små barna</i>. Не пугайтесь: <i>små</i> — просто «маленькие».</p>`,
  simple: 'en stor — et stort — store. «Тот большой дом» = det store huset (артикль + -e + окончание). На -ig — без -t.',
  exm: [['Vi har et stort hus.', 'У нас большой дом.'], ['Det er en fin dag i dag.', 'Сегодня хороший день.'], ['Den røde bilen er min.', 'Та красная машина — моя.'], ['De små barna sover.', 'Маленькие дети спят.']],
  conf: [['*et stor hus* / *et stort hus*', 'Со словом на <i>et</i> прилагательное получает <b>-t</b>.', '«Красивый дом»:|et fint hus|et fin hus|et fine hus # et → -t.'],
    ['*den store bilen* / *den store bil*', 'С прилагательным «тот самый» — и <i>den</i>, и окончание <i>-en</i>.', '«Та старая книга»:|den gamle boka|den gammel boka|gamle boka # den + -e + окончание.']],
  words: [['stor', 'большой', 'Oslo er en stor by.'], ['liten', 'маленький', 'Røst er en liten øy.'], ['gammel', 'старый', 'Huset er gammelt.'], ['ny', 'новый', 'Jeg har en ny jakke.'], ['fin', 'красивый, хороший', 'For en fin dag!'], ['pen', 'красивый (на вид)', 'Byen er pen.'], ['kald', 'холодный', 'Vannet er kaldt.'], ['varm', 'тёплый', 'Kaffen er varm.'], ['billig', 'дешёвый', 'Boka er billig.'], ['dyr', 'дорогой', 'Norge er et dyrt land.']],
  ex: [
    { t: 'gap', h: 'Поставьте прилагательное в нужную форму.', q: ['et ___ hus (stor)|stort', 'en ___ dag (fin)|fin', '___ biler (ny)|nye', 'et ___ år (ny)|nytt', 'Kaffen er ___. (varm)|varm', 'Vannet er ___. (kald)|kaldt', 'et ___ ord (norsk)|norsk # -isk → без t.', 'et ___ hus (liten)|lite'] },
    { t: 'gap', h: 'Двойная определённость: «тот самый …».', q: ['___ ___ bilen (den, stor)|den;store', 'det ___ huset (gammel)|gamle', 'de ___ barna (liten)|små', 'den ___ ___ (fin, dag)|fine;dagen'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['«Норвегия — дорогая страна»:|Norge er et dyrt land.|Norge er et dyr land.|Norge er en dyr land. # land — et-слово.', '«Тот маленький дом»:|det lille huset|det lite huset|det liten hus # Определённая форма от liten — lille.', '«Уютный дом»:|et koselig hus|et koseligt hus|et koselige hus # -ig без t.', '«Маленькие дети»:|små barn|litene barn|liten barn # liten → små во мн. ч.'] },
    { t: 'fix', q: ['Vi har et stor hus.|Vi har et stort hus. # et → -t.', 'Den røde bil er min.|Den røde bilen er min. # Нужно окончание -en.', 'Bilene er stor.|Bilene er store. # Мн. ч. → -e.', 'Det er et koseligt rom.|Det er et koselig rom. # -ig без t.'] },
    { t: 'tr', q: ['У нас большой дом.|Vi har et stort hus.', 'Кофе тёплый.|Kaffen er varm.', 'Та красная машина — моя.|Den røde bilen er min.', 'Норвегия — красивая страна.|Norge er et vakkert land.|Norge er et pent land.|Norge er et fint land.'] },
  ],
  read: {
    title: 'Trondheim', intro: 'Подчеркните про себя все прилагательные и посмотрите на их окончания.',
    txt: ['Trondheim er en gammel by midt i Norge. Byen er ikke stor, men den er veldig pen.', 'Midt i byen står Nidarosdomen. Det er en stor, gammel kirke. Den er nesten tusen år gammel!', 'Ved elva står det mange små, fargerike hus. De gule, røde og blå husene er gamle lagerbygninger. Turistene elsker dem.'],
    gl: { 'midt i': 'посреди', 'kirke': 'церковь, собор', 'nesten': 'почти', 'tusen': 'тысяча', 'elva': 'река', 'fargerike': 'разноцветные', 'lagerbygninger': 'склады', 'turistene': 'туристы' },
    q: [{ t: 'tf', q: ['Trondheim er en ny by.|F # En gammel by.', 'Nidarosdomen er nesten tusen år gammel.|T', 'Husene ved elva er grå.|F # Gule, røde og blå.', 'Turistene liker husene.|T # Turistene elsker dem.'] },
      { t: 'choice', q: ['Hva er Nidarosdomen?|en kirke|et museum|en bro', 'Hvor står de fargerike husene?|ved elva|på fjellet|på torget'] }],
  },
  series: [{ show: 'uttrykk', who: 'норвежское выражение', q: 'Helt rått!', mean: '«Совсем сыро!» — молодёжное «круто, потрясающе».', fun: '<i>Rå</i> — сырой. Почему «сырой» стало «крутым» — не знают даже лингвисты. Но если норвежский подросток говорит <i>Det var rått!</i> — он в восторге.', use: 'Konserten i går var helt rå!', qz: 'Друг говорит про концерт: «Det var helt rått!» Ему…|очень понравилось|было холодно|не понравилось # rå — сырой, но в сленге — «круто».' },
    { show: 'ordtak', who: 'норвежская пословица', q: 'Liten tue kan velte stort lass.', mean: '«Маленькая кочка может опрокинуть большой воз». Мелочь может привести к большим последствиям.', fun: 'Обратите внимание на прилагательные: <i>liten</i> (en tue), <i>stort</i> (et lass).', use: 'Sjekk detaljene. Liten tue kan velte stort lass!', qz: '«Liten tue kan velte stort lass» значит…|мелочь может иметь большие последствия|маленькие люди сильные|не грузи слишком много # tue — кочка, lass — воз.' }],
  write: { h: 'Опишите свой город: какой он, что там есть (с прилагательными в правильной форме).', min: 20, use: ['gammel', 'stor', 'fin', 'det er'],
    plan: ['Какой город: stor/liten, gammel/ny.', 'Что есть в центре: Det er en … og et …', 'Тот самый любимый … (двойная определённость).', 'Что вам нравится и не нравится.'],
    model: 'Riga er en gammel og pen by i Latvia.\nDet er en stor elv, mange parker og et fint operahus.\nDen gamle bydelen er veldig koselig.\nJeg liker de små kafeene, men jeg liker ikke den kalde vinden om vinteren.' },
  vid: [['NorwegianClass101', 'Norwegian adjectives agreement'], ['Learn Norwegian Naturally', 'double definiteness Norwegian'], ['NorwegianClass101', 'Trondheim travel guide Norwegian']],
  fact: 'Нидаросский собор в Тронхейме построен над могилой святого Олава — короля, крестившего Норвегию. В Средние века это было главное место паломничества Северной Европы. Сюда до сих пор идут пешком по «Пути святого Олава» — 640 км из Осло.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian adjectives', 'https://en.wikibooks.org/wiki/Norwegian'], ['Ordbøkene', 'https://ordbokene.no/']],
});
NOTE('a2-2', {
  crow: 'Прилагательные! Я, например, *liten, søt og veldig flink* — маленький, милый и очень способный. А вы — *flink* тоже, проверим.',
  mk: ['Опишите свою комнату или дом двумя прилагательными (не забудьте -t у et-слов).|er|Huset mitt er gammelt, men rommet er stort og lyst.', 'Напишите про «того самого» человека или предмет: *den/det/de + -e + окончание*.|den/det/de|Den gamle katten sover på det nye teppet.', 'Опишите погоду сегодня.|i dag|I dag er det kaldt, men sola er fin.'],
  etym: [['fin', 'из латинского *finis* — «конец, предел» через французское *fin*: «доведённый до конца» = изящный. Так же английское *fine*.'], ['gammel', 'родня английского *gammer* (бабуся) и, возможно, русского... нет, тут сходство случайное. Зато *gammeldags* — «старомодный», буквально «старо-дневной».']],
  ru: 'Корабль заходит в Тронхейм. Пелле и Мари видят старый собор и разноцветные домики. Рыбак на причале говорит, что видел старого тупика в красной шапке — в прошлом году, в Бергене.',
  gl: { 'kirken': 'собор', 'fargerike': 'разноцветные', 'fiskeren': 'рыбак', 'skjegg': 'борода', 'i fjor': 'в прошлом году', 'regnfull': 'дождливый', 'rare': 'странные' },
  tf: ['Kirken i Trondheim er ny.|F # Den er gammel.', 'Fiskeren har et langt skjegg.|T # et langt, hvitt skjegg.', 'Fiskeren så bestefar i Bergen.|T # i fjor, i Bergen.'],
  ch: ['Hvordan er Bergen, sier fiskeren?|regnfull|varm|stor og tørr # «en vakker, regnfull by».'],
  bmk: ['Опишите какого-нибудь странного человека, которого вы видели (прилагательные!).|var|Mannen på bussen var gammel og hadde en stor, gul hatt.'],
  etb: '*Rar* — странный. Норвежцы скажут *Det var rart* — «Это было странно». А слово *raring* — «чудак» — звучит почти ласково.',
});
ST('a2-2', { t: 'Комплименты по-норвежски', tip: 'Норвежцы смущаются от громких комплиментов. Лучше коротко и конкретно: *Så fin genser!* («Какой красивый свитер!»). В ответ обычно говорят просто *Takk!* — или скромно преуменьшают: *Den er gammel.*',
  sit: 'Коллега пришла в новом свитере.', ph: [['Så fin genser!', 'Какой красивый свитер!'], ['Den kler deg.', 'Тебе идёт.'], ['Takk, den er gammel.', 'Спасибо, он старый (скромно).'], ['Hvor kjøpte du den?', 'Где ты его купила?']],
  dlg: ['Вам говорят: «Så fin jakke!»|Takk! Den er fra en bruktbutikk.|Ja, jeg vet. Jeg er fin.|Nei. # Спасибо + скромная деталь.', 'Коллега в новом свитере.|Så fin genser! Den kler deg.|Genseren er en genser.|Er den dyr? # Короткий конкретный комплимент.'],
  mk: 'Сделайте комплимент другу (одежда, рисунок, дом) — коротко и с прилагательным.|fin/pen|Så fin tegning! Fargene er veldig pene.' });
BK('a2-2', 'Kapittel 8. Den gamle byen', ['Båten kommer til Trondheim. Det er en gammel, vakker by. Midt i byen står en stor kirke. Kirken er nesten tusen år gammel.', 'Ved elva står det små, fargerike hus: gule, røde og grønne. Mari elsker de fargerike husene. «Her vil jeg bo!» sier hun.', 'På kaia sitter en gammel fisker med et langt, hvitt skjegg. Pelle viser ham kartet. «En lundefugl med ei rød lue?» spør fiskeren. «Ja, jeg så ham i fjor. I Bergen.»', '«Bergen er en vakker, regnfull by,» sier fiskeren. «Og den er full av rare fugler.»']);

U({
  id: 'a2-3', lvl: 'A2', t: 'Прошлое: spiste, har spist', en: 'Preteritum og perfektum',
  goals: ['рассказывать о прошлом: *I går spiste jeg vafler*', 'выбирать окончание слабого глагола: -et, -te, -de, -dde', 'различать *spiste* (вчера) и *har spist* (уже, в жизни)'],
  th: `<p>У норвежских глаголов два главных прошедших: <b>preteritum</b> («сделал тогда-то») и <b>perfektum</b> (<i>har</i> + форма — «уже сделал, есть результат»).</p>
  <h4>Слабые глаголы: четыре группы</h4>
  <div class="tbl"><table><thead><tr><th>Группа</th><th>Инфинитив</th><th>Preteritum</th><th>Perfektum</th></tr></thead><tbody>
  <tr><td>1: -et (самая большая; двойная согласная или группа согласных)</td><td><i>å snakke, å jobbe</i></td><td><i>snakk<b>et</b>, jobb<b>et</b></i></td><td><i>har snakket</i></td></tr>
  <tr><td>2: -te (одна согласная перед -e)</td><td><i>å spise, å lese, å kjøpe</i></td><td><i>spis<b>te</b>, les<b>te</b>, kjøp<b>te</b></i></td><td><i>har spist, har lest</i></td></tr>
  <tr><td>3: -de (основа на -v, -g, -ei)</td><td><i>å leve, å prøve</i></td><td><i>lev<b>de</b>, prøv<b>de</b></i></td><td><i>har levd</i></td></tr>
  <tr><td>4: -dde (короткие, на ударную гласную)</td><td><i>å bo, å tro</i></td><td><i>bo<b>dde</b>, tro<b>dde</b></i></td><td><i>har bodd</i></td></tr></tbody></table></div>
  <p>Частые сильные глаголы меняют гласную, их учат наизусть: <i>være — var — har vært</i>, <i>ha — hadde — har hatt</i>, <i>gå — gikk — har gått</i>, <i>se — så — har sett</i>, <i>drikke — drakk — har drukket</i>, <i>komme — kom — har kommet</i>. Таблица — в «Сильных глаголах».</p>
  <h4>Preteritum или perfektum?</h4>
  <ul><li><b>Preteritum</b> — есть «когда»: <i>I går spiste jeg vafler. I 2020 bodde vi i Bergen.</i></li>
  <li><b>Perfektum</b> — время не важно, важен результат или опыт: <i>Jeg har spist.</i> (я сыт). <i>Har du vært i Norge?</i> (бывал когда-нибудь?) <i>Vi har bodd her i fem år</i> (и живём до сих пор).</li></ul>
  <p>Как английские Past Simple и Present Perfect — и правило почти то же.</p>`,
  simple: 'snakket / spiste / levde / bodde. Есть «когда» (i går) — preteritum. Нет «когда», важен результат или опыт — har + форма.',
  exm: [['I går spiste jeg vafler.', 'Вчера я ела вафли.'], ['Har du vært i Norge?', 'Ты бывал в Норвегии?'], ['Vi bodde i Bergen i to år.', 'Мы два года жили в Бергене.'], ['Jeg har lest boka.', 'Я прочитала книгу.']],
  conf: [['*I går har jeg spist* / *I går spiste jeg*', 'Если есть точное «когда» в прошлом (<i>i går, i fjor, for to år siden</i>) — preteritum.', '«Вчера я работал»:|I går jobbet jeg.|I går har jeg jobbet.|I går jeg jobbet. # Есть «вчера» — preteritum (и инверсия!).'],
    ['*Har du vært…?* / *Var du…?*', 'Опыт «когда-нибудь» — perfektum: <i>Har du vært i Bergen?</i> Конкретный случай — preteritum: <i>Var du i Bergen i fjor?</i>', '«Ты когда-нибудь ел брюност?»:|Har du spist brunost?|Spiste du brunost?|Du spiste brunost? # Опыт — perfektum.']],
  words: [['i går', 'вчера', 'I går var det kaldt.'], ['i fjor', 'в прошлом году', 'I fjor reiste vi til Norge.'], ['for … siden', '… назад', 'For to år siden bodde jeg i Oslo.'], ['allerede', 'уже', 'Jeg har allerede spist.'], ['aldri', 'никогда', 'Jeg har aldri vært i Tromsø.'], ['å reise', 'путешествовать, ехать', 'Vi reiste med tog.'], ['å kjøpe', 'покупать', 'Hun kjøpte en ny jakke.'], ['å prøve', 'пробовать', 'Jeg prøvde brunost.'], ['å huske', 'помнить', 'Jeg husker det godt.'], ['å glemme', 'забывать', 'Jeg glemte nøklene.']],
  ex: [
    { t: 'gap', h: 'Поставьте в preteritum.', q: ['I går ___ jeg med mamma. (snakke)|snakket', 'Hun ___ en ny bok. (kjøpe)|kjøpte', 'Vi ___ i Bergen i to år. (bo)|bodde', 'I fjor ___ de til Lofoten. (reise)|reiste', 'Jeg ___ nøklene. (glemme)|glemte', 'I går ___ det kaldt. (være)|var'] },
    { t: 'gap', h: 'Поставьте в perfektum (har + …).', q: ['Jeg har ___ boka. (lese)|lest', 'Har du ___ i Norge? (være)|vært', 'Vi har ___ her i fem år. (bo)|bodd', 'Hun har allerede ___. (spise)|spist', 'Jeg har aldri ___ brunost. (prøve)|prøvd', 'De har ___ hele dagen. (jobbe)|jobbet'] },
    { t: 'choice', h: 'Preteritum или perfektum?', q: ['___ i Tromsø? (когда-нибудь)|Har du vært|Var du|Du var # Опыт — perfektum.', 'I går ___ vafler.|spiste jeg|har jeg spist|jeg spiste # Вчера + инверсия.', 'Jeg er ikke sulten. Jeg ___.|har spist|spiste|spiser # Результат: я сыт.', 'For to år siden ___ jeg i Oslo.|bodde|har bodd|bor # Точное время.'] },
    { t: 'order', q: ['I går spiste jeg vafler med brunost.', 'Har du vært i Norge?', 'Vi bodde i Bergen i to år.', 'Jeg har aldri prøvd brunost.', 'For tre år siden reiste hun til Tromsø.'] },
    { t: 'tr', q: ['Вчера было холодно.|I går var det kaldt.|Det var kaldt i går.', 'Ты бывал в Норвегии?|Har du vært i Norge?', 'Я забыла ключи.|Jeg glemte nøklene.|Jeg har glemt nøklene.', 'Мы жили в Риге.|Vi bodde i Riga.', 'Я уже поела.|Jeg har allerede spist.|Jeg har spist allerede.'] },
  ],
  read: {
    title: 'Et postkort fra Trondheim', intro: 'Это открытка Пелле бабушке. Найдите preteritum и perfektum.',
    txt: ['Kjære bestemor! I går kom vi til Trondheim. Vi reiste med Hurtigruten i tre dager. Mari var sjøsyk den første dagen, men nå har hun det bra.', 'Kokken på båten husket bestefar! Og i dag snakket vi med en gammel fisker. Han så bestefar i Bergen i fjor.', 'Vi har ikke funnet bestefar ennå, men vi har lært mye. Jeg har spist mange fisker. Hilsen Pelle.'],
    gl: { 'kjære': 'дорогая', 'den første dagen': 'в первый день', 'har det bra': 'всё хорошо', 'husket': 'помнил', 'funnet': 'нашли', 'ennå': 'ещё', 'lært': 'выучили, узнали', 'hilsen': 'привет (в конце письма)' },
    q: [{ t: 'tf', q: ['Pelle og Mari reiste med fly.|F # Med Hurtigruten.', 'Mari var sjøsyk den første dagen.|T', 'Fiskeren så bestefar i Bergen.|T', 'De har funnet bestefar.|F # Vi har ikke funnet bestefar ennå.'] },
      { t: 'choice', q: ['Hvor lenge reiste de med båten?|tre dager|en uke|to timer', 'Hvem skrev postkortet?|Pelle|Mari|bestemor'] }],
  },
  series: [{ show: 'kultur', who: 'типично норвежское', q: 'Brunost', mean: '«Коричневый сыр» — сладковатый карамельный сыр из сыворотки. Его режут специальным ножом-лопаткой <i>ostehøvel</i> (норвежское изобретение!).', fun: 'Иностранцы сначала пугаются («сыр со вкусом карамели?!»), а потом не могут остановиться. Особенно на вафлях.', use: 'Har du prøvd brunost? Den er god på vafler!', qz: 'Что такое «ostehøvel»?|нож-рубанок для сыра|сорт сыра|сырная фабрика # høvel — рубанок.' },
    { show: 'ordtak', who: 'норвежская пословица', q: 'Den som venter på noe godt, venter ikke forgjeves.', mean: '«Кто ждёт хорошего, ждёт не напрасно» — хорошее стоит ожидания.', fun: 'Норвежские родители говорят это нетерпеливым детям. А дети — родителям, когда долго собираются.', use: 'Bussen er sen, men den som venter på noe godt, venter ikke forgjeves.', qz: 'Смысл пословицы:|хорошее стоит того, чтобы подождать|не жди — действуй|ждать — плохо # forgjeves — напрасно.' }],
  write: { h: 'Напишите открытку другу: где вы были вчера, что делали, и что вы уже успели (perfektum).', min: 25, use: ['i går', 'har', 'var', 'aldri'],
    plan: ['Kjære …!', 'I går … (2–3 действия в preteritum).', 'Опыт: Jeg har aldri … / Jeg har allerede …', 'Hilsen + имя.'],
    model: 'Kjære Lars!\nI går var jeg i Oslo. Jeg gikk på Munchmuseet og spiste is ved fjorden.\nOm kvelden møtte jeg en venn, og vi snakket i tre timer.\nJeg har aldri sett så mange båter!\nHilsen Anna' },
  vid: [['NorwegianClass101', 'Norwegian past tense preteritum'], ['Learn Norwegian Naturally', 'preteritum vs perfektum'], ['NorwegianClass101', 'Norwegian brown cheese brunost']],
  fact: 'Сырорезку <i>ostehøvel</i> изобрёл столяр Тор Бьёрклунд из Лиллехаммера в 1925 году — ему надоело, что сыр режут слишком толсто. Норвежская бережливость в одном предмете.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian verbs', 'https://en.wikibooks.org/wiki/Norwegian'], ['Ordbøkene — bøying av verb', 'https://ordbokene.no/']],
});
NOTE('a2-3', {
  crow: 'Прошлое! *I går fanget jeg tre fisker.* Вчера я поймал трёх рыб. Ладно, двух. Ладно, одну. Но красивую.',
  mk: ['Напишите, что вы делали *вчера* (не забудьте инверсию).|i går|I går tegnet jeg en lundefugl og drakk kaffe.', 'Напишите, чего вы *никогда* не делали (har aldri …).|aldri|Jeg har aldri vært i Tromsø eller sett nordlys.', 'Напишите, где вы жили раньше (for … siden).|siden|For fem år siden bodde jeg i en liten by.'],
  etym: [['å reise', '«подниматься» — родня английского *rise* и *raise*. Путешествие начиналось с того, что ты встаёшь и уходишь. В шведском *resa* — тоже и «ехать», и «поднимать».'], ['vaffel', 'из голландского *wafel* — «соты». Узор вафли похож на пчелиные соты. Норвежские вафли — сердечками!']],
  ru: 'Пелле пишет бабушке открытку из Тронхейма. Они решают лететь в Берген. Ночью Пелле долго не спит и вспоминает, что бабушка рассказывала: дедушка ушёл в море двадцать лет назад.',
  gl: { 'skrev': 'написал', 'postkort': 'открытка', 'bestemte': 'решили', 'fløy': 'полетели', 'sov': 'спал', 'husket': 'вспомнил', 'for tjue år siden': 'двадцать лет назад', 'dro': 'уехал, ушёл' },
  tf: ['Pelle skrev et postkort.|T', 'De reiste med tog til Bergen.|F # De fløy.', 'Bestefar dro for tjue år siden.|T'],
  ch: ['Hvorfor sov ikke Pelle om natten?|han tenkte på bestefar|han var sulten|det var for kaldt # Han tenkte på bestefar.'],
  bmk: ['Напишите, что вы сделали в последний раз, когда не могли уснуть.|sov|Jeg sov ikke, så jeg leste en bok og drakk te.'],
  etb: '*Postkort* — составное слово: *post* (почта) + *kort* (карточка). *Kort* значит и «короткий», и «карточка» — короткий кусочек бумаги.',
});
ST('a2-3', { t: 'Понедельник: как прошли выходные?', tip: 'В понедельник норвежцы спрашивают *Hvordan var helgen?* Ответ — одна-две детали в прошлом: *Den var fin! Jeg var på tur.* Не забудьте спросить в ответ: *Og din?*',
  sit: 'Понедельник, офис, коллега.', ph: [['Hvordan var helgen?', 'Как прошли выходные?'], ['Den var kjempefin!', 'Отлично!'], ['Jeg var på tur i skogen.', 'Я ходила гулять в лес.'], ['Og din?', 'А твои?']],
  dlg: ['Коллега: «Hvordan var helgen?»|Fin, takk! Jeg var på tur. Og din?|Den er fin.|Jeg har vært helg. # Прошлое + деталь + вопрос.', 'Коллега: «Hva gjorde du i helgen?»|Jeg tegnet og så en film.|Jeg tegner og ser en film.|Ingenting, hvorfor? # Прошлое: tegnet, så.'],
  mk: 'Расскажите в 1–2 предложениях о своих выходных и спросите коллегу.|var|Helgen var fin. Jeg var hos mamma og spiste vafler. Og din?' });
BK('a2-3', 'Kapittel 9. Et postkort', ['Om kvelden skrev Pelle et postkort til bestemor. «Vi har kommet til Trondheim. Kokken husket bestefar, og en fisker så ham i Bergen i fjor!»', 'Pelle og Mari bestemte seg: de skulle til Bergen. Neste morgen fløy de av gårde.', 'Natten før sov ikke Pelle. Han tenkte på bestefar. Han husket hva bestemor fortalte: «Bestefar dro for tjue år siden. Han sa: Jeg kommer tilbake. Men han kom aldri.»', 'Pelle så på stjernene. «Jeg finner deg, bestefar,» hvisket han.']);

U({
  id: 'a2-4', lvl: 'A2', t: 'Будущее и модальные: skal, vil, kan, må', en: 'Framtid og modalverb',
  goals: ['говорить о планах: *Jeg skal reise til Bergen*', 'выражать желание, умение и необходимость: *vil, kan, må, bør*', 'не ставить *å* и *-r* после модального глагола'],
  th: `<p>Отдельного будущего времени в норвежском нет. Будущее выражают так:</p>
  <ul><li><b>skal</b> + инфинитив — план, договорённость: <i>Jeg <b>skal</b> reise til Bergen i morgen.</i> (так решено)</li>
  <li><b>kommer til å</b> + инфинитив — прогноз: <i>Det <b>kommer til å</b> regne.</i> (будет дождь)</li>
  <li><b>vil</b> + инфинитив — желание (и иногда прогноз): <i>Jeg <b>vil</b> lære norsk.</i> — хочу выучить.</li>
  <li>просто <b>presens</b> + время: <i>I morgen reiser jeg.</i> — Завтра я уезжаю.</li></ul>
  <h4>Модальные глаголы</h4>
  <div class="tbl"><table><thead><tr><th>Глагол</th><th>Значение</th><th>Пример</th></tr></thead><tbody>
  <tr><td><i>kan</i></td><td>мочь, уметь, можно</td><td><i>Kan du hjelpe meg? Jeg kan svømme.</i></td></tr>
  <tr><td><i>vil</i></td><td>хотеть</td><td><i>Vil du ha kaffe?</i></td></tr>
  <tr><td><i>skal</i></td><td>собираться, планировать</td><td><i>Hva skal du gjøre i helgen?</i></td></tr>
  <tr><td><i>må</i></td><td>должен, надо</td><td><i>Jeg må jobbe.</i></td></tr>
  <tr><td><i>bør</i></td><td>следует (совет)</td><td><i>Du bør sove mer.</i></td></tr>
  <tr><td><i>får</i></td><td>разрешено</td><td><i>Får jeg sitte her?</i></td></tr></tbody></table></div>
  <p>Правило: после модального — <b>голый инфинитив</b>, без <i>å</i> и без <i>-r</i>: <i>Jeg kan snakke</i> (не «kan å snakke», не «kan snakker»).</p>
  <h4>Осторожно: må ikke</h4>
  <p><i>Du må ikke røyke her</i> — здесь <b>нельзя</b> курить (запрет!). «Не обязательно» — <i>Du trenger ikke (å) komme</i>.</p>`,
  simple: 'skal — план, kommer til å — прогноз, vil — хочу. После kan/vil/skal/må/bør — инфинитив без å. må ikke = нельзя.',
  exm: [['Jeg skal reise til Bergen i morgen.', 'Завтра я еду в Берген.'], ['Det kommer til å regne.', 'Будет дождь.'], ['Kan du hjelpe meg?', 'Можешь мне помочь?'], ['Du må ikke røyke her.', 'Здесь нельзя курить.']],
  conf: [['*må ikke* / *trenger ikke*', '<i>Du må ikke</i> — нельзя. <i>Du trenger ikke</i> — не обязательно.', '«Тебе не обязательно приходить»:|Du trenger ikke å komme.|Du må ikke komme.|Du skal ikke komme. # må ikke = запрет.'],
    ['*skal* / *vil*', '<i>skal</i> — план или договорённость. <i>vil</i> — желание. <i>Jeg vil reise</i> — хочу поехать; <i>Jeg skal reise</i> — поеду (решено).', '«Мы едем в Норвегию летом» (билеты куплены):|Vi skal reise til Norge i sommer.|Vi vil reise til Norge i sommer.|Vi reise til Norge i sommer. # План — skal.']],
  words: [['å hjelpe', 'помогать', 'Kan du hjelpe meg?'], ['å trenge', 'нуждаться', 'Jeg trenger hjelp.'], ['kanskje', 'может быть', 'Kanskje kommer jeg i morgen.'], ['i kveld', 'сегодня вечером', 'Hva skal du gjøre i kveld?'], ['neste uke', 'на следующей неделе', 'Neste uke skal vi til Oslo.'], ['i sommer', 'этим летом', 'I sommer skal jeg reise.'], ['planer', 'планы', 'Har du noen planer?'], ['å røyke', 'курить', 'Det er ikke lov å røyke her.'], ['lov', 'разрешено', 'Er det lov å fotografere?'], ['sikkert', 'наверняка', 'Det blir sikkert fint.']],
  ex: [
    { t: 'gap', h: 'Вставьте модальный глагол: kan, vil, skal, må, bør.', q: ['___ du hjelpe meg? (можешь)|Kan', 'Jeg ___ ha kaffe, takk. (хочу)|vil', 'I morgen ___ vi reise til Bergen. (план)|skal', 'Jeg ___ jobbe i dag. (должна)|må', 'Du ___ sove mer. (совет)|bør', 'Du ___ ikke røyke her. (нельзя)|må'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['«Я умею плавать»:|Jeg kan svømme.|Jeg kan å svømme.|Jeg kan svømmer. # Голый инфинитив.', '«Будет дождь» (прогноз):|Det kommer til å regne.|Det skal regne.|Det vil regner. # Прогноз — kommer til å.', '«Тебе не обязательно приходить»:|Du trenger ikke å komme.|Du må ikke komme.|Du kan ikke komme. # må ikke — запрет.', '«Можно здесь сесть?»:|Får jeg sitte her?|Må jeg sitte her?|Skal jeg sitter her? # får — разрешение.'] },
    { t: 'order', q: ['Jeg skal reise til Bergen i morgen.', 'Kan du hjelpe meg?', 'Det kommer til å regne i dag.', 'Hva skal du gjøre i kveld?', 'Du bør drikke mer vann.'] },
    { t: 'fix', q: ['Jeg kan snakker norsk.|Jeg kan snakke norsk. # После kan — инфинитив.', 'Vi skal å reise i morgen.|Vi skal reise i morgen. # После skal — без å.', 'Hun vil drikker kaffe.|Hun vil drikke kaffe. # Инфинитив.', 'Neste uke vi skal til Oslo.|Neste uke skal vi til Oslo. # Инверсия.'] },
    { t: 'tr', q: ['Можешь мне помочь?|Kan du hjelpe meg?', 'Я хочу выучить норвежский.|Jeg vil lære norsk.', 'Что ты будешь делать вечером?|Hva skal du gjøre i kveld?', 'Мне надо работать.|Jeg må jobbe.', 'Здесь нельзя курить.|Du må ikke røyke her.|Det er ikke lov å røyke her.'] },
  ],
  read: {
    title: 'Planer', intro: 'Найдите все модальные глаголы и что после них стоит.',
    txt: ['Pelle og Mari må reise til Bergen. Men hvordan? «Vi kan fly,» sier Mari. «Det tar bare tre timer.»', '«Vi bør hvile først,» sier Pelle. «Det kommer til å blåse mye i morgen.» Mari er enig. Hun vil sove lenge.', '«Hva skal vi gjøre i Bergen?» spør Mari. «Vi skal spørre alle måkene på fisketorget. Måker vet alt,» sier Pelle. Mari ler. Det er sant.'],
    gl: { 'tar': 'занимает (время)', 'timer': 'часы (время)', 'hvile': 'отдохнуть', 'først': 'сначала', 'blåse': 'дуть (ветер)', 'enig': 'согласна', 'fisketorget': 'рыбный рынок', 'sant': 'правда' },
    q: [{ t: 'tf', q: ['De vil reise med båt.|F # De kan fly.', 'Det kommer til å blåse i morgen.|T', 'Mari vil sove lenge.|T', 'De skal spørre fiskerne i Bergen.|F # Måkene på fisketorget.'] },
      { t: 'choice', q: ['Hvor lang tid tar det å fly?|tre timer|tre dager|en time', 'Hvem vet alt, sier Pelle?|måkene|fiskerne|turistene'] }],
  },
  series: [{ show: 'uttrykk', who: 'норвежское выражение', q: 'Det ordner seg.', mean: '«Всё устроится», «всё наладится».', fun: 'Любимое норвежское успокоение. Опоздал поезд, потерялся ключ, дождь на свадьбе — <i>det ordner seg</i>.', use: 'Ikke vær redd, det ordner seg!', qz: 'Друг нервничает перед экзаменом. Вы говорите «Det ordner seg». Это…|всё будет хорошо|сделай заказ|выучи порядок # ordne — упорядочить; «всё само упорядочится».' },
    { show: 'kultur', who: 'типично норвежское', q: 'Fellesferie', mean: '«Общий отпуск» — три недели в июле, когда вся Норвегия разом уходит в отпуск.', fun: 'В июле в Осло закрыты даже некоторые офисы и кафе: все на хитте или в лодке. Звонить по работе в fellesferie — почти неприлично.', use: 'Vi skal på hytta i fellesferien.', qz: 'Когда обычно fellesferie?|в июле|в декабре|в марте # Июль — «общий отпуск».' }],
  write: { h: 'Напишите о планах на лето или следующую неделю: что вы будете делать, что хотите, что должны.', min: 25, use: ['skal', 'vil', 'må', 'kanskje'],
    plan: ['Neste uke / I sommer skal jeg …', 'Jeg vil …, men jeg må …', 'Прогноз: Det kommer til å …', 'Kanskje …'],
    model: 'I sommer skal jeg reise til Norge.\nJeg vil se fjordene og gå på tur i fjellet.\nMen først må jeg jobbe mye og spare penger.\nDet kommer sikkert til å regne, men det ordner seg.\nKanskje skal jeg tegne en lundefugl på Lofoten!' },
  vid: [['NorwegianClass101', 'Norwegian modal verbs'], ['Learn Norwegian Naturally', 'future tense Norwegian skal vil'], ['NorwegianClass101', 'Norwegian summer holidays fellesferie']],
  fact: 'В Норвегии по закону минимум 25 рабочих дней отпуска в году, и три недели из них работник имеет право взять подряд летом. Отсюда и fellesferie.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian modal verbs', 'https://en.wikibooks.org/wiki/Norwegian'], ['Språkrådet', 'https://www.sprakradet.no/']],
});
NOTE('a2-4', {
  crow: 'Будущее! *Jeg skal fiske i morgen. Jeg vil fange en laks. Jeg kommer til å fange en sild.* Видите разницу: план, мечта и прогноз.',
  mk: ['Напишите, что вы *будете* делать на выходных (план).|skal|I helgen skal jeg besøke en venn i Oslo.', 'Напишите, что вы *хотите* делать, но *должны* делать другое.|vil;må|Jeg vil sove lenge, men jeg må jobbe i dag.', 'Дайте совет другу (bør).|bør|Du bør drikke mer vann og sove mer.'],
  etym: [['å ville', 'родня английского *will* и русского «воля», «велеть». Изначально — «хотеть», и только в английском стало будущим временем.'], ['laks', 'лосось; родня немецкого *Lachs* и русского… «лосось»! Одно из немногих общих слов германских и славянских языков.']],
  ru: 'Пелле и Мари решают лететь в Берген. Пелле планирует спросить всех чаек на рыбном рынке. Мари хочет сначала выспаться. Будет сильный ветер.',
  gl: { 'hvile': 'отдохнуть', 'blåste': 'дул', 'storm': 'шторм', 'fisketorget': 'рыбный рынок', 'enig': 'согласна', 'vente': 'ждать' },
  tf: ['Det kom en storm.|T', 'De fløy til Bergen samme dag.|F # De måtte vente til neste dag.', 'Pelle vil spørre måkene på fisketorget.|T'],
  ch: ['Hva sa Mari om stormen?|Det ordner seg.|Vi må reise hjem.|Jeg er redd. # «Det ordner seg,» sa Mari.'],
  bmk: ['Напишите, что вы будете делать, если завтра будет шторм.|skal/kommer til å|Hvis det kommer storm, skal jeg lese og drikke te.'],
  etb: '*Storm* — общее германское слово, родня немецкого *Sturm* и английского *storm*. А русское «шторм» пришло из голландского при Петре I — вместе с другими морскими словами.',
});
ST('a2-4', { t: 'Договориться о встрече', tip: 'Норвежцы планируют заранее — иногда за недели. Спонтанное «пойдём сегодня?» может удивить. Скажите: *Skal vi ta en kaffe en dag?* — и договоритесь о дне.',
  sit: 'Вы хотите встретиться с новой знакомой.', ph: [['Skal vi ta en kaffe en dag?', 'Выпьем как-нибудь кофе?'], ['Passer det på torsdag?', 'В четверг удобно?'], ['Ja, det passer fint!', 'Да, отлично подходит!'], ['Vi snakkes!', 'Созвонимся!']],
  dlg: ['Знакомая: «Skal vi ta en kaffe en dag?»|Ja, gjerne! Passer det på torsdag?|Ja, jeg skal kaffe.|Nå? # Согласиться и предложить день.', 'Вас спрашивают: «Passer det klokka fem?» Вам неудобно.|Dessverre ikke. Kan vi si seks?|Nei.|Klokka fem er dum. # dessverre — к сожалению.'],
  mk: 'Пригласите кого-нибудь на кофе и предложите день и время.|skal|Skal vi ta en kaffe på fredag klokka tre?' });
BK('a2-4', 'Kapittel 10. Stormen', ['Pelle og Mari ville fly til Bergen med en gang. Men så kom det en storm. Vinden blåste, og havet var grått og vilt.', '«Vi må vente,» sa Pelle. «Vi kan ikke fly nå.» Mari var enig. «Vi bør hvile. Det ordner seg.»', 'De satt i en liten båt på kaia og hørte på regnet. «Hva skal vi gjøre i Bergen?» spurte Mari.', '«Vi skal gå til fisketorget,» sa Pelle. «Der er det hundre måker. Vi skal spørre alle sammen.» Neste morgen var stormen borte, og de fløy mot sør.']);

U({
  id: 'a2-5', lvl: 'A2', t: 'Предлоги: i, på, til, om', en: 'Preposisjoner',
  goals: ['различать *i* и *på*: *i Norge, på Lofoten, på jobb*', 'говорить о времени: *i går, om morgenen, på mandag, i fem år*', 'не путать *til* (куда) и *i* (где)'],
  th: `<p>Предлоги — самое «нелогичное» в норвежском. Учите их вместе со словом, как сочетание.</p>
  <h4>Где: i или på?</h4>
  <ul><li><b>i</b> — внутри, в стране, в городе: <i>i Norge, i Oslo, i huset, i bilen, i stua</i>.</li>
  <li><b>på</b> — на поверхности, на острове, во многих учреждениях: <i>på bordet, på Lofoten, på jobb, på skolen, på kino, på butikken, på kjøkkenet, på badet</i>.</li></ul>
  <p>Острова и маленькие места — обычно <i>på</i>: <i>på Røst, på Hamar</i>. Страны и большие города — <i>i</i>.</p>
  <h4>Куда: til</h4>
  <p><i>Jeg reiser <b>til</b> Bergen. Vi går <b>til</b> butikken.</i> «Домой» — <i>hjem</i>, «дома» — <i>hjemme</i>.</p>
  <h4>Время</h4>
  <div class="tbl"><table><thead><tr><th>Предлог</th><th>Когда</th><th>Пример</th></tr></thead><tbody>
  <tr><td><i>i</i></td><td>сегодня/вчера, длительность, этот сезон</td><td><i>i dag, i går, i morgen, i fem år, i sommer</i></td></tr>
  <tr><td><i>om</i></td><td>регулярно (части дня, сезоны); «через»</td><td><i>om morgenen, om vinteren, om en time</i> (через час)</td></tr>
  <tr><td><i>på</i></td><td>дни недели, праздники</td><td><i>på mandag, på søndager, på julaften</i></td></tr>
  <tr><td><i>for … siden</i></td><td>назад</td><td><i>for to år siden</i></td></tr></tbody></table></div>
  <p>Ловушка: <i>i fem år</i> — в течение пяти лет; <i>om fem år</i> — через пять лет; <i>for fem år siden</i> — пять лет назад.</p>`,
  simple: 'i — внутри, страна, город; på — поверхность, остров, работа/школа. til — куда. om morgenen — по утрам; om en time — через час.',
  exm: [['Jeg bor i Riga, men jeg jobber på Lofoten i sommer.', 'Я живу в Риге, но этим летом работаю на Лофотенах.'], ['Vi går på kino på fredag.', 'В пятницу мы идём в кино.'], ['Toget går om en time.', 'Поезд через час.'], ['Om vinteren går vi på ski.', 'Зимой мы катаемся на лыжах.']],
  conf: [['*i fem år* / *om fem år*', '<i>i fem år</i> — пять лет (длительность); <i>om fem år</i> — через пять лет.', '«Через час»:|om en time|i en time|for en time siden # om = через.'],
    ['*i Lofoten* / *på Lofoten*', 'Об островах — <i>på</i>: <i>på Lofoten, på Røst, på Svalbard</i>.', '«На Шпицбергене»:|på Svalbard|i Svalbard|til Svalbard # Острова — på.']],
  words: [['på jobb', 'на работе', 'Hun er på jobb nå.'], ['på skolen', 'в школе', 'Barna er på skolen.'], ['på kino', 'в кино', 'Vi går på kino i kveld.'], ['hjem', 'домой', 'Jeg går hjem nå.'], ['om morgenen', 'по утрам', 'Om morgenen drikker jeg kaffe.'], ['om vinteren', 'зимой', 'Om vinteren er det mørkt.'], ['om en time', 'через час', 'Vi spiser om en time.'], ['ved', 'у, возле', 'Huset ligger ved sjøen.'], ['mellom', 'между', 'Bergen ligger mellom fjellene.'], ['bryggen', 'пристань, набережная', 'Vi møtes på Bryggen.']],
  ex: [
    { t: 'gap', h: 'i или på?', q: ['Jeg bor ___ Riga.|i', 'Hun er ___ jobb.|på', 'Pelle bor ___ Røst.|på', 'Kaffen står ___ bordet.|på', 'Vi er ___ Norge.|i', 'Barna er ___ skolen.|på', 'Katten sover ___ huset.|i', 'Mamma er ___ kjøkkenet.|på'] },
    { t: 'gap', h: 'Время: i, om, på.', q: ['___ morgenen drikker jeg kaffe. (по утрам)|Om', 'Vi bodde i Bergen ___ to år. (два года)|i', 'Toget går ___ ti minutter. (через)|om', '___ fredag går vi på kino.|På', '___ går var det kaldt.|I', '___ vinteren går vi på ski.|Om'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['«Я еду в Берген»:|Jeg reiser til Bergen.|Jeg reiser i Bergen.|Jeg reiser på Bergen. # Куда — til.', '«Я иду домой»:|Jeg går hjem.|Jeg går hjemme.|Jeg går til hjem. # Куда — hjem, где — hjemme.', '«Через пять лет»:|om fem år|i fem år|på fem år # om = через.', '«Мы в кино»:|Vi er på kino.|Vi er i kino.|Vi er til kino. # på kino.'] },
    { t: 'order', q: ['Jeg bor i Riga.', 'Vi går på kino på fredag.', 'Toget går om en time.', 'Om vinteren går vi på ski.', 'Pelle sitter på taket.'] },
    { t: 'tr', q: ['Я на работе.|Jeg er på jobb.|Jeg er på jobben.', 'Мы живём в Норвегии.|Vi bor i Norge.', 'Поезд через час.|Toget går om en time.', 'Я иду домой.|Jeg går hjem.', 'По утрам я пью кофе.|Om morgenen drikker jeg kaffe.|Jeg drikker kaffe om morgenen.'] },
  ],
  read: {
    title: 'Bergen', intro: 'Найдите все предлоги места и времени.',
    txt: ['Bergen ligger på vestkysten av Norge, mellom sju fjell. Det regner i Bergen nesten hver dag — om vinteren og om sommeren.', 'Midt i byen ligger Bryggen. Der står det gamle trehus ved vannet. På fisketorget kan du kjøpe fisk, reker og krabber.', 'Om kvelden går mange folk på kafé eller på konsert. Bergen er en liten by, men den har mange kunstnere.'],
    gl: { 'ligger': 'расположен', 'vestkysten': 'западное побережье', 'mellom': 'между', 'nesten': 'почти', 'trehus': 'деревянные дома', 'reker': 'креветки', 'krabber': 'крабы', 'kunstnere': 'художники' },
    q: [{ t: 'tf', q: ['Bergen ligger på østkysten.|F # På vestkysten.', 'Det regner sjelden i Bergen.|F # Nesten hver dag.', 'Bryggen ligger midt i byen.|T', 'Bergen har mange kunstnere.|T'] },
      { t: 'choice', q: ['Mellom hvor mange fjell ligger Bergen?|sju|tre|ti', 'Hva kan du kjøpe på fisketorget?|fisk, reker og krabber|klær|bøker'] }],
  },
  series: [{ show: 'ordtak', who: 'норвежская пословица', q: 'Det finnes ikke dårlig vær, bare dårlige klær.', mean: '«Нет плохой погоды, есть только плохая одежда».', fun: 'Норвежские дети гуляют в садике в любую погоду — в дождь, в снег, в −15. Главное — правильный комбинезон. В Бергене эту фразу говорят особенно часто.', use: 'Det regner? Ta på deg regntøy! Det finnes ikke dårlig vær, bare dårlige klær.', qz: 'Смысл пословицы:|гулять можно в любую погоду, если правильно одеться|в плохую погоду сиди дома|одежда важнее погоды для моды # vær — погода, klær — одежда.' },
    { show: 'kultur', who: 'типично норвежское', q: 'Paraplyen er bergensernes beste venn.', mean: '«Зонтик — лучший друг бергенца». В Бергене дождь идёт около 230 дней в году.', fun: 'В Бергене когда-то даже стоял автомат по продаже зонтиков. А местные шутят: «Ребёнок в Бергене думает, что солнце — это ошибка».', use: 'Husk paraplyen, vi skal til Bergen!', qz: 'Сколько дней в году примерно идёт дождь в Бергене?|около 230|около 30|около 100 # Самый дождливый город Норвегии.' }],
  write: { h: 'Опишите, где вы бываете в течение недели: где живёте, работаете, что делаете по утрам/вечерам и куда идёте в выходные.', min: 25, use: ['i', 'på', 'til', 'om'],
    plan: ['Jeg bor i …', 'Jeg jobber på / i …', 'Om morgenen … Om kvelden …', 'På lørdag går jeg til / på …'],
    model: 'Jeg bor i en leilighet i Riga.\nJeg jobber hjemme, men på tirsdager er jeg på kontoret.\nOm morgenen drikker jeg kaffe på balkongen.\nPå lørdag går jeg på kino eller til parken.\nOm en måned skal jeg reise til Bergen.' },
  vid: [['NorwegianClass101', 'Norwegian prepositions i på'], ['Learn Norwegian Naturally', 'prepositions of time Norwegian'], ['NorwegianClass101', 'Bergen travel Bryggen']],
  fact: 'Брюгген (Bryggen) — ганзейская пристань в Бергене, внесена в список ЮНЕСКО. Её деревянные дома много раз горели и каждый раз отстраивались по старым образцам — последний раз в 1702 году.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Språkrådet — i eller på', 'https://www.sprakradet.no/'], ['Wikibooks — Norwegian prepositions', 'https://en.wikibooks.org/wiki/Norwegian']],
});
NOTE('a2-5', {
  crow: 'Предлоги! Я живу *på* Røst, сижу *på* скале, ныряю *i* море и лечу *til* Бергену. Всё логично. Ну, почти.',
  mk: ['Напишите, где вы живёте и где работаете (i / på).|i;på|Jeg bor i Riga og jobber på et kontor i sentrum.', 'Напишите, что вы делаете *om kvelden* или *om vinteren*.|om|Om vinteren drikker jeg mye te og tegner hjemme.', 'Напишите, куда вы поедете (til) и когда (om …).|til;om|Om to uker reiser jeg til Bergen med tog.'],
  etym: [['Bergen', 'от древнего *Bjørgvin* — «луг между горами». Город и правда лежит между семью горами.'], ['brygge', 'пристань; от того же корня, что английское *bridge* (мост). Пристань — «мостик» с берега к кораблю.']],
  ru: 'Берген встречает дождём. На пристани Брюгген Пелле и Мари видят девушку с альбомом — она рисует старые дома. Это Алина, художница из Риги. Она рисует… тупика в красной шапке!',
  gl: { 'regnet': 'шёл дождь', 'bryggen': 'пристань Брюгген', 'trehusene': 'деревянные дома', 'skissebok': 'альбом для набросков', 'tegnet': 'рисовала', 'lue': 'шапка', 'overrasket': 'удивлённый' },
  tf: ['Det regnet i Bergen.|T', 'Alina tegnet fjellene.|F # Hun tegnet de gamle trehusene.', 'I skisseboka var det en lundefugl med rød lue.|T'],
  ch: ['Hvor kommer Alina fra?|Riga|Bergen|Oslo # «Jeg kommer fra Riga.»'],
  bmk: ['Где вы любите рисовать или читать? Напишите с предлогом места.|på/i|Jeg liker å tegne på en benk i parken.'],
  etb: '*Skissebok* — «книга эскизов». *Skisse* — из итальянского *schizzo*, «брызги». Эскиз — это брызги идеи на бумаге.',
});
ST('a2-5', { t: 'Где мы встретимся?', tip: 'Норвежцы пунктуальны: «в три» значит «в три», а не «в три с чем-то». Если опаздываете хоть на пять минут — напишите: *Jeg er fem minutter forsinket, beklager!*',
  sit: 'Вы договариваетесь о встрече в Бергене.', ph: [['Hvor skal vi møtes?', 'Где встретимся?'], ['Vi møtes på Bryggen klokka tre.', 'Встречаемся на Брюггене в три.'], ['Jeg er litt forsinket, beklager!', 'Немного опаздываю, извини!'], ['Jeg står ved fontenen.', 'Я стою у фонтана.']],
  dlg: ['Друг спрашивает: «Hvor skal vi møtes?»|På Bryggen, ved kafeen. Klokka tre?|I Bryggen klokka.|Til Bryggen. # Место + время.', 'Вы опаздываете на 10 минут.|Jeg er ti minutter forsinket, beklager!|Jeg kommer når jeg kommer.|… (ничего не писать) # Предупредить — обязательно.'],
  mk: 'Предложите место и время встречи.|klokka|Vi møtes på torget ved fontenen klokka fire.' });
BK('a2-5', 'Kapittel 11. Jenta på Bryggen', ['I Bergen regnet det. Det regnet på husene, på båtene og på Pelle. «Selvfølgelig regner det,» sa Mari. «Vi er i Bergen.»', 'De fløy til Bryggen. Der står det gamle trehus ved vannet. Foran trehusene satt ei ung jente med en paraply og ei stor skissebok. Hun tegnet de gamle trehusene.', 'Pelle så på tegningene. Plutselig stoppet han. På en side i skisseboka var det en gammel lundefugl med ei rød lue!', '«Hvem er det?» spurte Pelle. Jenta ble overrasket. «Snakker du?» «Selvfølgelig. Jeg er Pelle. Hvem er du?» «Jeg heter Alina,» sa hun. «Jeg er kunstner, og jeg kommer fra Riga.»']);

U({
  id: 'a2-6', lvl: 'A2', t: 'Притяжательные: min, din, hans', en: 'Eiendomspronomen',
  goals: ['говорить «мой, твой, его, её»: *bilen min, boka mi, huset mitt*', 'ставить притяжательное после слова — как норвежцы', 'различать *hans* (его) и *hennes* (её)'],
  th: `<p>«Мой» в норвежском согласуется с родом и числом существительного:</p>
  <div class="tbl"><table><thead><tr><th></th><th>en</th><th>ei</th><th>et</th><th>мн. ч.</th></tr></thead><tbody>
  <tr><td>мой</td><td><i>min</i></td><td><i>mi</i></td><td><i>mitt</i></td><td><i>mine</i></td></tr>
  <tr><td>твой</td><td><i>din</i></td><td><i>di</i></td><td><i>ditt</i></td><td><i>dine</i></td></tr>
  <tr><td>наш</td><td><i>vår</i></td><td><i>vår</i></td><td><i>vårt</i></td><td><i>våre</i></td></tr>
  <tr><td>его / её / их / ваш</td><td colspan="4"><i>hans / hennes / deres / deres</i> — не меняются</td></tr></tbody></table></div>
  <h4>Где ставить: после слова!</h4>
  <p>Самый естественный порядок — <b>существительное в определённой форме + притяжательное</b>: <i>bil<b>en min</b></i> (моя машина), <i>bok<b>a mi</b></i>, <i>hus<b>et mitt</b></i>, <i>barn<b>a mine</b></i>.</p>
  <p>Перед словом (<i>min bil</i>) — тоже правильно, но звучит с ударением: «<b>моя</b> машина, а не твоя».</p>
  <p>Ei-слова: <i>boka mi</i> или <i>boken min</i> — оба верно (как вы выбрали в уроке A2.1).</p>
  <h4>Семья — особый случай</h4>
  <p>С короткими семейными словами — без окончания: <i>mora mi</i> или <i>min mor</i>, <i>faren min</i>, <i>søstera mi</i>. А с <i>mamma</i> и <i>pappa</i>: <i>mamma</i> — просто «мама», без притяжательного.</p>
  <h4>Его и её: hans, hennes</h4>
  <p><i>Lars har en bil. Bilen hans er rød.</i> <i>Mari har ei bok. Boka hennes er spennende.</i> (А про «свой» — <i>sin</i> — поговорим на B1.)</p>`,
  simple: 'bilen min, boka mi, huset mitt, barna mine. hans — его, hennes — её, deres — их. Притяжательное — после слова.',
  exm: [['Bilen min er gammel.', 'Моя машина старая.'], ['Hvor er nøklene mine?', 'Где мои ключи?'], ['Huset vårt ligger ved sjøen.', 'Наш дом стоит у моря.'], ['Katten hennes heter Pepper.', 'Её кота зовут Пеппер.']],
  conf: [['*huset min* / *huset mitt*', 'С et-словом — <i>mitt</i>: <i>huset mitt, kartet mitt</i>.', '«Моя карта» (et kart):|kartet mitt|kartet min|kartet mi # et → mitt.'],
    ['*hans* / *hennes*', '<i>hans</i> — его, <i>hennes</i> — её. Как английские <i>his / her</i>.', '«Её книга»:|boka hennes|boka hans|boka henne # hennes — её.']],
  words: [['min', 'мой', 'Bilen min er rød.'], ['din', 'твой', 'Er dette telefonen din?'], ['hans', 'его', 'Hunden hans er stor.'], ['hennes', 'её', 'Jakka hennes er ny.'], ['vår', 'наш', 'Huset vårt er lite.'], ['deres', 'ваш, их', 'Barna deres er søte.'], ['nøkkel', 'ключ', 'Hvor er nøkkelen min?'], ['å låne', 'одалживать, брать на время', 'Kan jeg låne pennen din?'], ['søster', 'сестра', 'Søstera mi bor i Oslo.'], ['bror', 'брат', 'Broren min er lærer.']],
  ex: [
    { t: 'gap', h: 'min, mi, mitt или mine?', q: ['bilen ___ (моя машина)|min', 'huset ___ (мой дом)|mitt', 'boka ___ (моя книга)|mi', 'barna ___ (мои дети)|mine', 'kartet ___ (моя карта)|mitt', 'nøklene ___ (мои ключи)|mine'] },
    { t: 'gap', h: 'Вставьте hans, hennes, vår/vårt или deres.', q: ['Lars har en hund. Hunden ___ heter Fido.|hans', 'Mari har ei jakke. Jakka ___ er gul.|hennes', 'Vi har et hus. Huset ___ er gammelt.|vårt', 'De har en bil. Bilen ___ er ny.|deres'] },
    { t: 'choice', h: 'Выберите правильное.', q: ['«Где мои ключи?»:|Hvor er nøklene mine?|Hvor er nøklene min?|Hvor er mine nøkkel? # Мн. ч. — mine.', '«Её кот»:|katten hennes|katten hans|katten henne # hennes — её.', '«Твой дом» (et hus):|huset ditt|huset din|huset di # et → ditt.', '«Наша дочь» (ei datter):|dattera vår|dattera våre|dattera vårt # ei → vår.'] },
    { t: 'fix', q: ['Huset min er gammelt.|Huset mitt er gammelt. # et → mitt.', 'Hvor er nøklene min?|Hvor er nøklene mine? # Мн. ч. — mine.', 'Mari har en katt. Katten hans er svart.|Mari har en katt. Katten hennes er svart. # Мари — она: hennes.', 'Bil min er rød.|Bilen min er rød. # Перед min — определённая форма.'] },
    { t: 'tr', q: ['Моя машина старая.|Bilen min er gammel.|Min bil er gammel.', 'Где мои ключи?|Hvor er nøklene mine?', 'Наш дом маленький.|Huset vårt er lite.|Vårt hus er lite.', 'Можно взять твою ручку?|Kan jeg låne pennen din?'] },
  ],
  read: {
    title: 'Skisseboka til Alina', intro: 'Найдите все притяжательные местоимения.',
    txt: ['Alina viser Pelle skisseboka si. «Dette er tegningene mine fra Norge,» sier hun. «Her er Bryggen, her er fisketorget, og her er katten min hjemme i Riga.»', '«Og denne lundefuglen?» spør Pelle. «Han satt på taket mitt i fjor sommer,» sier Alina. «Han hadde ei rød lue, og han sang.»', 'Pelle tar fram kartet sitt. «Dette er kartet til bestefaren min,» sier han. «Og lua hans var rød.» Alina og Pelle ser på hverandre.'],
    gl: { 'viser': 'показывает', 'tegningene': 'рисунки', 'taket': 'крыша', 'i fjor sommer': 'прошлым летом', 'sang': 'пел', 'tar fram': 'достаёт', 'hverandre': 'друг на друга' },
    q: [{ t: 'tf', q: ['Alina har en katt i Riga.|T', 'Lundefuglen satt på taket til Alina.|T', 'Lundefuglen hadde ei blå lue.|F # Ei rød lue.', 'Kartet er til bestemoren til Pelle.|F # Til bestefaren.'] },
      { t: 'choice', q: ['Når så Alina lundefuglen?|i fjor sommer|i går|for ti år siden', 'Hva gjorde lundefuglen på taket?|han sang|han sov|han spiste'] }],
  },
  series: [{ show: 'ordtak', who: 'норвежская пословица', q: 'Borte bra, men hjemme best.', mean: '«В гостях хорошо, а дома лучше».', fun: 'Почти слово в слово как русская пословица. Норвежцы обожают путешествовать — и обожают возвращаться домой.', use: 'Ferien var fin, men borte bra, men hjemme best!', qz: '«Borte bra, men hjemme best» — это…|в гостях хорошо, а дома лучше|дома скучно, лучше уехать|хорошо быть далеко # borte — вдали.' },
    { show: 'uttrykk', who: 'норвежское выражение', q: 'Det er ikke mitt bord.', mean: '«Это не мой стол» = не моё дело, не моя ответственность.', fun: 'Обратите внимание: <i>mitt</i> — потому что <i>et bord</i>. В офисе так вежливо отказываются от чужих задач.', use: 'Budsjettet? Beklager, det er ikke mitt bord.', qz: '«Det er ikke mitt bord» значит…|это не моё дело|это не мой стол, а твой|я не голоден # bord — стол; выражение — про ответственность.' }],
  write: { h: 'Расскажите о своей семье или друзьях: как их зовут, где живут, что у них есть (с притяжательными).', min: 30, use: ['min', 'hans', 'hennes', 'vår'],
    plan: ['Familien min: …', 'Søstera / broren min …', 'Он/она + его/её вещь, дом, питомец.', 'Наш дом / наша традиция: … vår / vårt.'],
    model: 'Familien min er liten. Mora mi er lærer, og faren min er ingeniør.\nSøstera mi bor i Oslo. Leiligheten hennes er liten, men koselig.\nBroren min har en stor hund. Hunden hans heter Bamse.\nHver jul spiser vi middag hos besteforeldrene våre.' },
  vid: [['NorwegianClass101', 'Norwegian possessive pronouns'], ['Learn Norwegian Naturally', 'min mi mitt mine'], ['NorwegianClass101', 'talking about family in Norwegian']],
  fact: 'В норвежском «мой» обычно ставится после слова (<i>huset mitt</i>), а в шведском и датском — перед (<i>mitt hus</i>). Так скандинавы на слух отличают норвежца от шведа даже в письменном тексте.',
  src: [['NTNU — Norwegian on the Web', 'https://www.ntnu.edu/now'], ['Wikibooks — Norwegian possessives', 'https://en.wikibooks.org/wiki/Norwegian'], ['Ordbøkene', 'https://ordbokene.no/']],
});
NOTE('a2-6', {
  crow: '*Fisken min. Kaffen min. Steinen min.* Это я рассказываю о своём имуществе. Мне не жалко — но лучше не трогайте.',
  mk: ['Опишите свою вещь (притяжательное после слова!).|min/mi/mitt/mine|Telefonen min er gammel, men kameraet mitt er nytt.', 'Расскажите о друге и его/её вещи или питомце.|hans/hennes|Venninna mi har en katt, og katten hennes er veldig lat.', 'Спросите, можно ли одолжить что-то (låne).|låne|Kan jeg låne paraplyen din i dag?'],
  etym: [['nøkkel', 'ключ; древнее *lykill* превратилось в *nøkkel* через «перебор» звуков. Шведы до сих пор говорят *nyckel*.'], ['søster', 'родня русского «сестра», английского *sister*, латинского *soror* — одно из самых древних общих слов.']],
  ru: 'Алина рассказывает, что прошлым летом на её крыше в Риге сидел старый тупик в красной шапке и пел. Пелле показывает дедушкину карту. Алина решает поехать с ними.',
  gl: { 'taket': 'крыша', 'i fjor sommer': 'прошлым летом', 'sang': 'пел; песня', 'sekken sin': 'свой рюкзак', 'lua hans': 'его шапка', 'baksiden': 'обратная сторона', 'reiser med': 'поеду с вами' },
  tf: ['Lundefuglen satt på taket til Alina.|T', 'Lundefuglen sang en sang om Lofoten.|T # «en sang om Lofoten».', 'Alina vil ikke reise med Pelle.|F # «Jeg reiser med dere!»'],
  ch: ['Hva hadde lundefuglen på hodet?|ei rød lue|en hjelm|ingenting # lua hans var rød.'],
  bmk: ['Что вы взяли бы с собой в путешествие с Пелле? Притяжательные!|min/mi/mitt/mine|Jeg tar med skisseboka mi og kameraet mitt.'],
  etb: '*Lue* — шапка (вязаная). Норвежская зимняя *lue* — важная часть национального костюма. Знаменитая *nisselue* — красный колпак домового *nisse*.',
});
ST('a2-6', { t: 'Потерялась вещь', tip: 'Если что-то потеряли — спросите прямо: *Har noen sett …?* В Норвегии найденные вещи часто кладут на видное место — на скамейку или забор. Варежка на заборе ждёт хозяина.',
  sit: 'Вы потеряли ключи в кафе.', ph: [['Har noen sett nøklene mine?', 'Никто не видел мои ключи?'], ['Er dette din?', 'Это ваше?'], ['Ja, den er min! Takk!', 'Да, мой! Спасибо!'], ['Jeg mistet lua mi.', 'Я потерял(а) шапку.']],
  dlg: ['Вы потеряли ключи.|Unnskyld, har noen sett nøklene mine?|Hvor er nøkkel min?|Nøkler! # Вежливо и с притяжательным.', 'Официант протягивает шарф: «Er dette ditt skjerf?»|Ja, det er mitt! Tusen takk!|Ja, min.|Nei, ditt. # et skjerf → mitt.'],
  mk: 'Спросите, не видел ли кто-то вашу вещь.|mine/min/mi/mitt|Unnskyld, har noen sett telefonen min?' });
BK('a2-6', 'Kapittel 12. Sangen på taket', ['Alina viste fram skisseboka si. «Denne lundefuglen satt på taket mitt i Riga i fjor sommer,» sa hun. «Han sang hver kveld. Det var en sang om Lofoten.»', 'Pelle åpnet sekken sin og tok fram kartet. «Dette er kartet til bestefaren min,» sa han. «Og lua hans var rød.»', 'Alina så på kartet. «Se,» sa hun. «Det står noe her, på baksiden.» Med små bokstaver sto det: «Hytta i fjellet. Vent på meg der.»', '«Jeg reiser med dere!» sa Alina. «Jeg vil tegne hele reisen deres.» Mari klappet med vingene. Nå var de tre.']);
