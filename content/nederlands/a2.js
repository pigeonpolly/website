// Уровень A2 — прошедшее (perfectum с hebben и zijn, imperfectum), прилагательные с -e, модальные глаголы, разделяемые глаголы и er. Формат — docs/site.md «Учебник английского» (тот же движок).

U({
  id: 'a2-1', lvl: 'A2', t: 'Perfectum с hebben: ik heb gewerkt', en: 'De voltooide tijd met hebben',
  goals: ['рассказать, что вы сделали: *Ik heb gewerkt*', 'выбрать -t или -d по правилу *’t kofschip*', 'знать 10 неправильных причастий: *gegeten, gezien, gedaan…*'],
  th: `<p>Perfectum — главное прошедшее время в разговоре. «Я работал», «мы поели», «ты видел?» — почти всегда perfectum.</p>
  <h4>Формула</h4>
  <p><b>hebben</b> (на втором месте) + … + <b>причастие</b> (в самом конце): <i>Ik <b>heb</b> gisteren lang <b>gewerkt</b>.</i> Всё, что между ними, — «начинка рамки».</p>
  <h4>Как сделать причастие</h4>
  <p>Правильные глаголы: <b>ge + основа + t/d</b>. <i>werken → werk → <b>ge</b>werk<b>t</b></i>, <i>wonen → woon → <b>ge</b>woon<b>d</b></i>.</p>
  <p>-t или -d? Посмотрите на последнюю букву основы. Если она есть в слове <b>’t kofschip</b> (t, k, f, s, ch, p) — <b>-t</b>. Иначе — <b>-d</b>. <i>maken → gemaak<b>t</b></i> (k), <i>fietsen → gefiets<b>t</b></i> (s), <i>bellen → gebel<b>d</b></i> (l), <i>leren → geleer<b>d</b></i> (r).</p>
  <p>Если основа уже кончается на t или d — второе не добавляем: <i>praten → gepraat</i>, <i>antwoorden → geantwoord</i>.</p>
  <p>Ловушка: смотрите на основу <i>до</i> оглушения. <i>leven</i> (жить) — основа <i>leef</i>, но в инфинитиве <i>v</i>, а v нет в kofschip → <i>geleef<b>d</b></i>. Так же <i>reizen → gereisd</i>.</p>
  <p>Без <b>ge-</b>: глаголы на <b>be-, ge-, her-, ver-, ont-, er-</b>. <i>betalen → betaald</i>, <i>vertellen → verteld</i>, <i>herhalen → herhaald</i>.</p>
  <h4>Неправильные — выучить</h4>
  <div class="tbl"><table><thead><tr><th>Глагол</th><th>Причастие</th></tr></thead><tbody>
  <tr><td>eten — есть</td><td>gegeten</td></tr><tr><td>drinken — пить</td><td>gedronken</td></tr>
  <tr><td>zien — видеть</td><td>gezien</td></tr><tr><td>doen — делать</td><td>gedaan</td></tr>
  <tr><td>hebben — иметь</td><td>gehad</td></tr><tr><td>lezen — читать</td><td>gelezen</td></tr>
  <tr><td>schrijven — писать</td><td>geschreven</td></tr><tr><td>slapen — спать</td><td>geslapen</td></tr>
  <tr><td>zeggen — сказать</td><td>gezegd</td></tr><tr><td>kopen — покупать</td><td>gekocht</td></tr></tbody></table></div>
  <p>Вопрос: глагол вперёд — <i><b>Heb</b> je de film <b>gezien</b>?</i> Отрицание — перед причастием: <i>Ik heb het <b>niet</b> gedaan.</i></p>`,
  simple: 'hebben на втором месте, причастие в конце. ge + основа + t (если последняя буква в ’t kofschip) или d. Неправильные — учить.',
  exm: [['Ik heb gisteren gewerkt.', 'Вчера я работал(а).'], ['Heb je al gegeten?', 'Ты уже ел(а)?'], ['We hebben een film gezien.', 'Мы посмотрели фильм.'], ['Ik heb het niet gedaan!', 'Это не я!']],
  conf: [['*gemaakt* / *gemaakd*', 'Основа <i>maak</i> кончается на <i>k</i> — она есть в ’t kofschip → <i>gemaakt</i>.', 'Как правильно?|gemaakt|gemaakd|gemaken # k из kofschip → -t.'],
    ['*betaald* / *gebetaald*', 'Приставка <i>be-</i> съедает <i>ge-</i>: <i>Ik heb betaald.</i>', 'Rik ___ de patat.|heeft betaald|heeft gebetaald|is betaald # be- → без ge-.']],
  words: [['gisteren', 'вчера', 'Gisteren heb ik lang geslapen.'], ['vorige week', 'на прошлой неделе', 'Vorige week heb ik veel gewerkt.'], ['al', 'уже', 'Heb je al gegeten?'], ['nog niet', 'ещё не', 'Ik heb het nog niet gelezen.'], ['net', 'только что', 'Ik heb net koffie gezet.'], ['maken', 'делать, готовить', 'Wie heeft deze taart gemaakt?'], ['betalen', 'платить', 'Ik heb al betaald.'], ['vertellen', 'рассказывать', 'Hij heeft een grap verteld.'], ['kopen', 'покупать', 'Ik heb een fiets gekocht.'], ['het weekend', 'выходные', 'Wat heb je in het weekend gedaan?']],
  ex: [
    { t: 'choice', h: 'Выберите причастие.', q: ['werken →|gewerkt|gewerkd|gewerken # k → -t.', 'bellen →|gebeld|gebelt|gebellen # l нет в kofschip → -d.', 'fietsen →|gefietst|gefietsd|gefiets # s → -t.', 'leven →|geleefd|geleeft|geleven # Основа leef, но в инфинитиве v → -d.', 'praten →|gepraat|gepraatt|gepraatd # Основа на t — второе t не нужно.', 'vertellen →|verteld|geverteld|vertelt # ver- → без ge-.'] },
    { t: 'gap', h: 'Вставьте причастие неправильного глагола.', q: ['Ik heb een stroopwafel ___. (eten)|gegeten', 'Heb je die film ___? (zien)|gezien', 'Wat heb je ___? (doen)|gedaan', 'We hebben veel koffie ___. (drinken)|gedronken', 'Ze heeft een brief ___. (schrijven)|geschreven', 'Ik heb een nieuwe fiets ___. (kopen)|gekocht'] },
    { t: 'fix', q: ['Ik heb gewerkt gisteren.|Ik heb gisteren gewerkt. # Причастие — в самый конец.', 'Hij heeft gebetaald.|Hij heeft betaald. # be- → без ge-.', 'We hebben gemaakd een taart.|We hebben een taart gemaakt. # k → -t, и причастие в конец.', 'Ik heb het gedaan niet.|Ik heb het niet gedaan. # niet — перед причастием.'] },
    { t: 'order', q: ['Ik heb gisteren lang geslapen.', 'Heb je al gegeten?', 'We hebben een film gezien.', 'Wat heb je in het weekend gedaan?', 'Rik heeft de patat betaald.', 'Ik heb het nog niet gelezen.'] },
    { t: 'tr', q: ['Я работал(а) вчера.|Ik heb gisteren gewerkt.|Gisteren heb ik gewerkt.', 'Ты уже ел(а)?|Heb je al gegeten?|Heb jij al gegeten?', 'Мы купили велосипед.|We hebben een fiets gekocht.|Wij hebben een fiets gekocht.', 'Что ты делал(а) в выходные?|Wat heb je in het weekend gedaan?|Wat heb jij in het weekend gedaan?|Wat heb je dit weekend gedaan?', 'Я уже заплатил(а).|Ik heb al betaald.'] },
  ],
  read: {
    title: 'Een druk weekend', intro: 'Сообщение подруге в понедельник утром. Найдите все причастия — их восемь.',
    txt: ['Hoi Femke! Ik heb een druk weekend gehad. Zaterdag heb ik de hele dag gewerkt in de bakkerij. Ik heb honderd broodjes gemaakt!', 'Zondag heb ik lang geslapen. Daarna heb ik met mijn broer gefietst en we hebben poffertjes gegeten. Hij heeft betaald, gelukkig.', '’s Avonds heb ik een boek gelezen, maar ik heb het nog niet uit. En jij? Wat heb jij gedaan?'],
    gl: { 'druk': 'занятой, насыщенный', 'de hele dag': 'весь день', 'bakkerij': 'пекарня', 'broodjes': 'булочки', 'daarna': 'потом', 'poffertjes': 'мини-оладьи', 'gelukkig': 'к счастью', '’s avonds': 'вечером', 'uit hebben': 'дочитать до конца' },
    q: [{ t: 'tf', q: ['Zaterdag heeft ze gewerkt.|T', 'Zondag is ze vroeg opgestaan.|F # Zondag heeft ze lang geslapen.', 'Haar broer heeft betaald.|T', 'Ze heeft het boek uitgelezen.|F # Ze heeft het nog niet uit.'] },
      { t: 'choice', q: ['Wat heeft ze in de bakkerij gemaakt?|broodjes|taarten|poffertjes', 'Wat hebben ze zondag gegeten?|poffertjes|patat|haring'] }],
  },
  series: [{ show: 'uitdrukking', who: 'нидерландское выражение', q: 'Ik heb het druk.', mean: '«У меня дел по горло», буквально «у меня это занято».', fun: 'Самый частый ответ на «Hoe gaat het?» у взрослых голландцев — <i>Druk, druk, druk!</i> Говорят почти с гордостью: занят — значит, нужен. А вот встречу с другом назначают за три недели, в ежедневнике: <i>Even in mijn agenda kijken…</i>', use: 'Sorry, ik heb het deze week heel druk.', qz: 'Коллега говорит «Ik heb het druk». Что это значит?|у него много дел|у него в доме тесно|ему жарко # druk — занятой.' }],
  write: { h: 'Что вы делали в выходные? 4–5 предложений в perfectum.', min: 20, use: ['heb', 'gegeten', 'gewerkt', 'gisteren'],
    plan: ['Zaterdag heb ik …', 'Daarna heb ik …', 'Zondag heb ik …', 'Одна вещь, которую вы ещё не сделали: nog niet …'],
    model: 'Zaterdag heb ik lang geslapen. Daarna heb ik met mijn zus koffie gedronken.\nZondag heb ik gewerkt en ’s avonds heb ik een film gezien.\nIk heb mijn boek nog niet uitgelezen.' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch perfect tense hebben kofschip'], ['DutchPod101', 'Dutch past tense perfectum'], ['Dutchies to be', 'voltooide tijd uitleg']],
  fact: 'Правило *’t kofschip* («торговый корабль») знает каждый голландский школьник. Есть и вариант для любителей кофе: *soft ketchup* — те же буквы. Йоп предпочитает свой: *patat* — «t тоже там есть, значит, правило про еду».',
  src: [['DutchGrammar.com — perfect tense', 'https://www.dutchgrammar.com/en/?n=Verbs.Re13'], ['Taalunie — Taaladvies', 'https://taaladvies.net/'], ['Woordenlijst', 'https://woordenlijst.org/']],
});
NOTE('a2-1', {
  crow: 'Прошедшее время. Наконец можно рассказать, что вы *gedaan*. Я, например, *heb patat gestolen*. Это не признание. Это пример. Причастие уходит в конец фразы — как я с пляжа, когда начинается дождь.',
  mk: ['Напишите, что вы ели сегодня утром.|heb;gegeten|Vanochtend heb ik brood met kaas gegeten.', 'Напишите, что вы купили на этой неделе.|heb;gekocht|Ik heb deze week een nieuw boek gekocht.', 'Спросите друга, видел ли он новый фильм.|gezien|Heb je de nieuwe film al gezien?'],
  etym: [['gisteren', 'родня английского *yesterday* и немецкого *gestern*. Древний корень «другой день» — тот, что уже не сегодня.'], ['kopen', 'родня немецкого *kaufen* и… русского «купить»! Слово пришло в славянские языки из германских ещё в древности, от латинского *caupo* — торговец.']],
  ru: 'Йоп и Рик доехали до Гааги. Там правительство и парламент. Йоп, конечно, нашёл картошку фри — у министра.',
  gl: { 'gefietst': 'проехали на велосипеде', 'gehad': 'имели', 'gezien': 'увидели', 'gepakt': 'схватил', 'gezegd': 'сказал', 'gekeken': 'смотрел', 'geproefd': 'попробовал', 'te zout': 'слишком солёная' },
  tf: ['Joop en Rik hebben lang gefietst.|T # Ze hebben twee uur gefietst.', 'Rik heeft veel gezegd.|F # Rik heeft niets gezegd.', 'Joop vindt de patat te zout.|T'],
  ch: ['Van wie heeft Joop een frietje gepakt?|van een minister|van een toerist|van Rik # Joop heeft een frietje van een minister gepakt.'],
  bmk: ['Что вы видели сегодня по дороге? Одно предложение: *Ik heb … gezien.*|gezien|Ik heb vandaag een grote hond gezien.'],
  etb: '*Den Haag* — буквально «графская изгородь»: *’s-Gravenhage*, «живая изгородь графа». Здесь был охотничий домик графов Голландии. Деревня выросла в город, но городских прав так и не получила — Гаага долго официально считалась «самой большой деревней Европы».',
});
ST('a2-1', { t: 'Как прошли выходные?', tip: 'В понедельник у кофемашины спросят *Hoe was je weekend?* или *Wat heb je gedaan?* Хватит двух фраз в perfectum. Если ничего не делали — так и скажите: *Niks bijzonders, lekker thuis.* Голландцы это уважают.',
  sit: 'Коллега у велопарковки в понедельник утром.', ph: [['Hoe was je weekend?', 'Как выходные?'], ['Lekker rustig.', 'Приятно спокойно.'], ['Wat heb je gedaan?', 'Что делал(а)?'], ['Niks bijzonders.', 'Ничего особенного.']],
  dlg: ['Коллега: «Hoe was je weekend?» Естественный ответ:|Leuk! Ik heb gefietst en veel geslapen.|Ik fiets morgen.|Ja, het weekend. # Коротко, в perfectum.', 'Коллега: «Heb je de wedstrijd gezien?»|Nee, ik heb hem niet gezien.|Nee, ik zie niet hem.|Nee, ik heb gezien niet. # niet — перед причастием.'],
  mk: 'Ответьте на *Wat heb je in het weekend gedaan?* одной-двумя фразами.|heb|Ik heb mijn oma bezocht en we hebben taart gegeten.' });
BK('a2-1', 'Hoofdstuk 7. In Den Haag', ['Joop en Rik hebben twee uur gefietst. Ze hebben veel wind gehad. Natuurlijk.', 'In Den Haag hebben ze het Binnenhof gezien. Daar werkt de regering. Er stonden veel mannen en vrouwen in pakken, met patat.', 'Joop heeft een frietje van een minister gepakt. De minister heeft niets gezegd. Hij heeft alleen boos gekeken.', '«Wat heb je gedaan?» vraagt Rik. «Ik heb geproefd,» zegt Joop. «Politieke patat. Te zout.»']);

U({
  id: 'a2-2', lvl: 'A2', t: 'Perfectum с zijn: ik ben gegaan', en: 'De voltooide tijd met zijn',
  goals: ['знать, когда нужен *zijn*: движение куда-то и изменение', 'различать *Ik heb gefietst* и *Ik ben naar Delft gefietst*', 'причастия *gegaan, gekomen, gebleven, geweest, geworden*'],
  th: `<p>Большинство глаголов в perfectum берут <b>hebben</b>. Но есть группа с <b>zijn</b> — её надо знать.</p>
  <h4>С zijn</h4>
  <p>1) <b>Перемена места</b> — движение откуда-то куда-то: <i>gaan → Ik <b>ben</b> naar huis <b>gegaan</b>.</i> <i>komen → Ze <b>is</b> laat <b>gekomen</b>.</i> <i>vertrekken → De trein <b>is</b> vertrokken.</i></p>
  <p>2) <b>Перемена состояния</b>: <i>worden</i> (становиться) → <i>geworden</i>, <i>beginnen</i> → <i>begonnen</i>, <i>sterven</i> → <i>gestorven</i>, <i>vallen</i> → <i>gevallen</i>, <i>groeien</i> → <i>gegroeid</i>.</p>
  <p>3) Два особых: <b>zijn</b> → <i>Ik <b>ben</b> in Delft <b>geweest</b></i> (я был в Делфте) и <b>blijven</b> → <i>Ik <b>ben</b> thuis <b>gebleven</b></i>.</p>
  <h4>Велосипед: hebben или zijn?</h4>
  <p>У глаголов способа движения — <i>fietsen, lopen, rijden, zwemmen, vliegen</i> — оба варианта:</p>
  <p>• просто занятие, без цели → <b>hebben</b>: <i>Ik <b>heb</b> een uur <b>gefietst</b>.</i> (я покатался час)<br>• есть цель «куда» → <b>zijn</b>: <i>Ik <b>ben</b> naar Delft <b>gefietst</b>.</i> (я доехал до Делфта)</p>
  <h4>Неправильные</h4>
  <div class="tbl"><table><thead><tr><th>Глагол</th><th>Perfectum</th></tr></thead><tbody>
  <tr><td>gaan</td><td>ik ben gegaan</td></tr><tr><td>komen</td><td>ik ben gekomen</td></tr>
  <tr><td>blijven</td><td>ik ben gebleven</td></tr><tr><td>zijn</td><td>ik ben geweest</td></tr>
  <tr><td>worden</td><td>ik ben geworden</td></tr><tr><td>lopen</td><td>ik ben/heb gelopen</td></tr>
  <tr><td>vliegen</td><td>ik ben/heb gevlogen</td></tr><tr><td>vertrekken</td><td>ik ben vertrokken</td></tr></tbody></table></div>
  <p>🇧🇪 Во Фландрии всё то же самое — тут голландцы и фламандцы, к счастью, не спорят.</p>`,
  simple: 'zijn — куда-то пошли или во что-то превратились, плюс geweest и gebleven. Покатались без цели — hebben, доехали куда-то — zijn.',
  exm: [['Ik ben naar Amsterdam gegaan.', 'Я поехал(а) в Амстердам.'], ['Ben je in Delft geweest?', 'Ты был(а) в Делфте?'], ['Ze is thuis gebleven.', 'Она осталась дома.'], ['Het is koud geworden.', 'Стало холодно.']],
  conf: [['*Ik heb gefietst* / *Ik ben gefietst*', 'Без цели — <i>heb</i>: <i>Ik heb een uur gefietst.</i> С целью — <i>ben</i>: <i>Ik ben naar Leiden gefietst.</i>', 'Ik ___ naar het strand gefietst.|ben|heb|word # Есть цель «куда» → zijn.'],
    ['*geweest* / *gewest*', 'Причастие от <i>zijn</i> — <i>geweest</i>, с двумя e. <i>gewest</i> — это «область», совсем другое слово.', 'Ben je ooit in Gent ___?|geweest|gewest|gezijnd # zijn → geweest.']],
  words: [['vertrekken', 'отправляться, уезжать', 'De trein is om acht uur vertrokken.'], ['aankomen', 'прибывать', 'We zijn laat aangekomen.'], ['blijven', 'оставаться', 'Ik ben thuis gebleven.'], ['worden', 'становиться', 'Het is donker geworden.'], ['vallen', 'падать', 'Hij is van zijn fiets gevallen.'], ['ooit', 'когда-нибудь', 'Ben je ooit in Gent geweest?'], ['nooit', 'никогда', 'Ik ben nog nooit in Groningen geweest.'], ['de vakantie', 'отпуск, каникулы', 'In de vakantie zijn we naar Texel gegaan.'], ['het vliegtuig', 'самолёт', 'We zijn met het vliegtuig gegaan.'], ['onderweg', 'по дороге', 'Onderweg hebben we patat gegeten.']],
  ex: [
    { t: 'choice', h: 'hebben или zijn?', q: ['Ik ___ naar huis gegaan.|ben|heb|word # Движение куда-то.', 'We ___ een film gezien.|hebben|zijn|worden # zien → hebben.', 'Ze ___ thuis gebleven.|is|heeft|wordt # blijven → zijn.', 'Ik ___ een uur gefietst.|heb|ben|word # Без цели — hebben.', 'Het ___ koud geworden.|is|heeft|wordt # worden → zijn.', '___ je ooit in Brussel geweest?|Ben|Heb|Word # zijn → geweest с zijn.'] },
    { t: 'gap', h: 'Вставьте вспомогательный глагол и причастие.', q: ['Ik ___ gisteren naar Delft ___. (gaan)|ben;gegaan', 'Ze ___ om tien uur ___. (komen)|is;gekomen', '___ jullie in Rotterdam ___? (zijn)|Zijn;geweest', 'Hij ___ van de trap ___. (vallen)|is;gevallen'] },
    { t: 'fix', q: ['Ik heb naar Leiden gegaan.|Ik ben naar Leiden gegaan. # gaan → zijn.', 'We zijn een film gezien.|We hebben een film gezien. # zien → hebben.', 'Ze is thuis geblijven.|Ze is thuis gebleven. # blijven → gebleven.', 'Ben je in Gent gewest?|Ben je in Gent geweest? # zijn → geweest.'] },
    { t: 'order', q: ['Ik ben naar Amsterdam gegaan.', 'Ben je ooit in Delft geweest?', 'Ze is thuis gebleven.', 'We zijn met de trein gekomen.', 'Het is donker geworden.', 'Ik heb een uur gefietst.'] },
    { t: 'tr', q: ['Я был(а) в Гааге.|Ik ben in Den Haag geweest.', 'Мы остались дома.|We zijn thuis gebleven.|Wij zijn thuis gebleven.', 'Поезд ушёл.|De trein is vertrokken.|De trein is weg.', 'Ты когда-нибудь был(а) в Утрехте?|Ben je ooit in Utrecht geweest?|Ben jij ooit in Utrecht geweest?', 'Стало холодно.|Het is koud geworden.'] },
  ],
  read: {
    title: 'Vakantie op Texel', intro: 'Открытка с острова. Где zijn, а где hebben — и почему?',
    txt: ['Lieve oma, we zijn zaterdag met de boot naar Texel gegaan. De reis is snel gegaan: twintig minuten!', 'Zondag hebben we de hele dag gefietst. Maandag zijn we naar de vuurtoren gefietst. Daar hebben we zeehonden gezien!', 'Gisteren is het slecht weer geworden, dus we zijn binnen gebleven. Papa is in slaap gevallen op de bank. Tot snel! Kusjes, Noor'],
    gl: { 'lieve': 'дорогая', 'de boot': 'паром, лодка', 'de reis': 'поездка', 'de vuurtoren': 'маяк', 'zeehonden': 'тюлени', 'slecht weer': 'плохая погода', 'binnen': 'внутри, дома', 'in slaap gevallen': 'заснул', 'kusjes': 'целую' },
    q: [{ t: 'tf', q: ['Ze zijn met de boot gegaan.|T', 'De reis heeft twee uur geduurd.|F # Twintig minuten.', 'Bij de vuurtoren hebben ze zeehonden gezien.|T', 'Gisteren hebben ze de hele dag gefietst.|F # Ze zijn binnen gebleven.'] },
      { t: 'choice', q: ['Waarom zijn ze binnen gebleven?|slecht weer|papa was ziek|de fiets was kapot', 'Wat heeft papa gedaan?|hij is in slaap gevallen|hij heeft gezwommen|hij is naar huis gegaan'] }],
  },
  series: [{ show: 'typisch', who: 'типично голландское', q: 'Naar de camping.', mean: '«На кемпинг» — главный голландский отпуск.', fun: 'Каждое лето полстраны едет на юг Европы с прицепом-караваном — <i>caravan</i>. С собой — свой кофе, свой сыр и даже свой арахисовый соус, потому что «там такого нет». На французских дорогах жёлтые номера голландцев узнают издалека: это сразу видно по скорости 80 км/ч и улыбкам.', use: 'In de zomer zijn we met de caravan naar Frankrijk gegaan.', qz: 'Что голландцы берут с собой в отпуск на кемпинг?|свой кофе и сыр|ничего, всё покупают на месте|только велосипед # Всё своё — так надёжнее.' }],
  write: { h: 'Расскажите о поездке: куда поехали, что видели, где остались. 4–6 предложений, zijn и hebben.', min: 25, use: ['ben', 'gegaan', 'geweest', 'hebben'],
    plan: ['Waar ben je naartoe gegaan?', 'Hoe ben je gegaan? (met de trein, de auto…)', 'Wat heb je gezien of gedaan?', 'Een probleem onderweg?'],
    model: 'Vorig jaar ben ik naar Amsterdam gegaan. Ik ben met de trein gegaan.\nIk heb veel musea gezien en ik heb op een boot gevaren.\nOp de laatste dag is het gaan regenen, dus ik ben in het hotel gebleven.' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch perfect tense zijn or hebben'], ['DutchPod101', 'Dutch perfectum zijn hebben'], ['NT2 TaalMenu', 'voltooide tijd zijn hebben']],
  fact: 'Тексел — самый большой остров Ваддензе, и на нём овец почти столько же, сколько людей. Местный сыр делают из овечьего молока, а маяк *De Vuurtoren van Texel* пережил войну с пробоинами — их видно до сих пор. Йоп считает тамошних чаек «провинциалами».',
  src: [['DutchGrammar.com — zijn or hebben', 'https://www.dutchgrammar.com/en/?n=Verbs.Re14'], ['Taalunie — Taaladvies', 'https://taaladvies.net/'], ['VVV Texel', 'https://www.texel.net/']],
});
NOTE('a2-2', {
  crow: '*Ik ben naar Den Haag gevlogen.* Не *heb* — потому что куда-то. Если бы просто кружил над пляжем ради удовольствия — *heb gevlogen*. Видите: даже у полёта чайки есть грамматика.',
  mk: ['Напишите, где вы были в прошлом году.|ben;geweest|Vorig jaar ben ik in Italië geweest.', 'Напишите, во сколько вы пришли домой вчера.|ben;thuis|Gisteren ben ik om zes uur thuisgekomen.', 'Напишите, что что-то стало другим (погода, город, вы сами).|geworden|Mijn stad is heel mooi geworden.'],
  etym: [['blijven', 'родня немецкого *bleiben* и английского *leave* (в старом смысле «оставлять»). Остаться — это когда тебя «оставили».'], ['worden', 'родня немецкого *werden* и древнеанглийского *weorþan* — «вертеться, поворачиваться». Становиться — значит «повернуться» в новое состояние.']],
  ru: 'В Гааге пошёл дождь. Йоп и Рик спрятались в музее Маурицхёйс — там висит знаменитая «Девушка с жемчужной серёжкой». Дальше всё пошло не по плану.',
  gl: { 'gevlogen': 'прилетел', 'gelopen': 'пришёл пешком', 'schilderij': 'картина', 'gebleven': 'остался', 'in slaap gevallen': 'заснул', 'suppoost': 'смотритель музея', 'boos geworden': 'рассердился', 'vertrokken': 'ушли' },
  tf: ['Joop is naar het museum gevlogen.|T', 'Rik is snel gelopen.|F # Rik is heel langzaam gelopen.', 'De suppoost is boos geworden.|T'],
  ch: ['Wat denkt Joop over het meisje op het schilderij?|ze wil zijn patat|ze is verdrietig|ze kent Rik # «Ze wil mijn patat.»'],
  bmk: ['Где вы были, когда последний раз шёл сильный дождь? *Ik ben … gebleven / gegaan.*|ben|Ik ben thuis gebleven en ik heb thee gedronken.'],
  etb: '*Het Meisje met de parel* написал Ян Вермеер из Делфта около 1665 года. Кто эта девушка — неизвестно; возможно, вообще не портрет, а *tronie* — «лицо» для упражнения. Кстати, жемчужина там почти точно не жемчужина: слишком большая и блестит, как олово.',
});
ST('a2-2', { t: 'Где вы были в отпуске?', tip: 'После лета все спрашивают *Waar ben je geweest?* и *Was het leuk?* Голландцы любят обсуждать кемпинги, пробки и цены. Ответ в perfectum + одно впечатление — идеально.',
  sit: 'Сосед у велопарковки в конце августа.', ph: [['Ben je op vakantie geweest?', 'Ты был(а) в отпуске?'], ['Waar ben je geweest?', 'Где был(а)?'], ['Was het leuk?', 'Было классно?'], ['Heerlijk, maar te kort.', 'Чудесно, но слишком мало.']],
  dlg: ['Сосед: «Waar ben je geweest?»|Ik ben naar Portugal geweest.|Ik heb naar Portugal geweest.|Ik ga naar Portugal geweest. # zijn → ben geweest.', 'Сосед: «En, hoe was het?»|Heerlijk! We hebben veel gezwommen.|We zijn veel gezwommen.|Ja, ik ben. # Просто плавали, без цели → hebben.'],
  mk: 'Ответьте соседу: где вы были летом и что делали.|ben;geweest|Ik ben in Spanje geweest en ik heb veel gezwommen.' });
BK('a2-2', 'Hoofdstuk 8. Regen in het museum', ['Om twaalf uur begint het te regenen. Joop is snel naar een museum gevlogen. Rik is gelopen. Heel langzaam.', 'Het museum heet het Mauritshuis. Daar hangt een beroemd schilderij: het Meisje met de parel.', 'Joop is lang voor het schilderij gebleven. «Ze kijkt naar mij,» zegt hij. «Ze wil mijn patat.»', 'Rik is op een bank in slaap gevallen. Hij snurkt. De suppoost is boos geworden. Joop en Rik zijn snel vertrokken.']);

U({
  id: 'a2-3', lvl: 'A2', t: 'Imperfectum: werkte, ging', en: 'De onvoltooid verleden tijd',
  goals: ['образовать прошедшее *-te / -de*: *werkte, woonde*', 'знать неправильные: *was, had, ging, kwam, zag, zei*', 'понимать, когда perfectum, а когда imperfectum'],
  th: `<p>Imperfectum (<i>de onvoltooid verleden tijd</i>) — второе прошедшее. Оно для <b>рассказа</b>: истории, сказки, воспоминания «раньше было так». В разговоре о единичном факте — чаще perfectum.</p>
  <p><i>Ik <b>heb</b> gisteren pizza <b>gegeten</b>.</i> — факт. <i>Vroeger <b>at</b> ik elke dag pizza.</i> — так было раньше, история.</p>
  <h4>Правильные: основа + te/de</h4>
  <p>Снова <b>’t kofschip</b>: последняя буква основы в нём → <b>-te / -ten</b>, иначе → <b>-de / -den</b>.</p>
  <div class="tbl"><table><thead><tr><th></th><th>werken (k)</th><th>wonen (n)</th></tr></thead><tbody>
  <tr><td>ik, jij, hij</td><td>werk<b>te</b></td><td>woon<b>de</b></td></tr>
  <tr><td>wij, jullie, zij</td><td>werk<b>ten</b></td><td>woon<b>den</b></td></tr></tbody></table></div>
  <p>Всего две формы: одно число и множественное. Никаких -t для jij! Основа на t/d — буква удваивается: <i>praten → praat<b>te</b></i>, <i>antwoorden → antwoord<b>de</b></i>.</p>
  <h4>Неправильные — самые частые</h4>
  <div class="tbl"><table><thead><tr><th>Глагол</th><th>ед.</th><th>мн.</th></tr></thead><tbody>
  <tr><td>zijn</td><td>was</td><td>waren</td></tr><tr><td>hebben</td><td>had</td><td>hadden</td></tr>
  <tr><td>gaan</td><td>ging</td><td>gingen</td></tr><tr><td>komen</td><td>kwam</td><td>kwamen</td></tr>
  <tr><td>zien</td><td>zag</td><td>zagen</td></tr><tr><td>zeggen</td><td>zei</td><td>zeiden</td></tr>
  <tr><td>eten</td><td>at</td><td>aten</td></tr><tr><td>doen</td><td>deed</td><td>deden</td></tr>
  <tr><td>vragen</td><td>vroeg</td><td>vroegen</td></tr><tr><td>zitten</td><td>zat</td><td>zaten</td></tr></tbody></table></div>
  <p><b>was / waren</b> и <b>had / hadden</b> используют и в разговоре — даже чаще, чем <i>ben geweest</i>: <i>Het <b>was</b> leuk!</i></p>`,
  simple: 'Imperfectum — для историй и «раньше». основа + te (kofschip) или de; мн. ч. + n. was, had, ging, kwam — выучить.',
  exm: [['Vroeger woonde ik in Riga.', 'Раньше я жил(а) в Риге.'], ['Het was een mooie dag.', 'Был прекрасный день.'], ['Toen ging hij naar huis.', 'Потом он пошёл домой.'], ['We hadden geen tijd.', 'У нас не было времени.']],
  conf: [['*werkte* / *werkde*', '<i>k</i> — в kofschip → <i>werkte</i>.', 'Ik ___ vroeger in een winkel.|werkte|werkde|werkt # k → -te.'],
    ['*vroeger* / *vroeg*', '<i>vroeger</i> — «раньше, в прежние времена». <i>vroeg</i> — «рано» или прошедшее от <i>vragen</i> (спросил).', '___ woonde ik op het platteland.|Vroeger|Vroeg|Vroegen # «раньше» — vroeger.']],
  words: [['vroeger', 'раньше', 'Vroeger woonde ik in een klein dorp.'], ['toen', 'тогда; потом', 'Toen was ik tien jaar.'], ['daarna', 'после этого', 'Daarna gingen we naar huis.'], ['plotseling', 'вдруг', 'Plotseling begon het te regenen.'], ['het verhaal', 'история, рассказ', 'Opa vertelde een mooi verhaal.'], ['de jeugd', 'детство, юность', 'In mijn jeugd speelde ik veel buiten.'], ['spelen', 'играть', 'De kinderen speelden op straat.'], ['wonen', 'жить (где)', 'We woonden naast een molen.'], ['er was eens', 'жил-был, однажды', 'Er was eens een kleine meeuw.'], ['elke zomer', 'каждое лето', 'Elke zomer gingen we naar zee.']],
  ex: [
    { t: 'choice', h: 'Выберите форму imperfectum.', q: ['Ik ___ vroeger in Utrecht. (wonen)|woonde|woonte|woont # n → -de.', 'Hij ___ elke dag. (fietsen)|fietste|fietsde|fietsten # s → -te.', 'We ___ geen geld. (hebben)|hadden|had|hebden # мн. ч. → hadden.', 'Het ___ koud. (zijn)|was|waren|is # ед. ч. → was.', 'Zij (они) ___ naar het strand. (gaan)|gingen|ging|gaanden # gaan — неправильный.', 'Jij ___ te veel. (praten)|praatte|praatet|praatde # Основа на t → praatte.'] },
    { t: 'gap', h: 'Вставьте неправильный глагол в imperfectum.', q: ['Gisteren ___ ik mijn oude leraar. (zien)|zag', 'Ze ___ om acht uur thuis. (komen)|kwam', '«Hallo!» ___ hij. (zeggen)|zei', 'We ___ pannenkoeken. (eten)|aten', 'Wat ___ je? (vragen)|vroeg', 'De kinderen ___ op de bank. (zitten)|zaten'] },
    { t: 'fix', q: ['Jij werktet in Delft.|Jij werkte in Delft. # В imperfectum у jij нет лишнего -t.', 'Vroeger woonte ik hier.|Vroeger woonde ik hier. # n → -de.', 'We was erg moe.|We waren erg moe. # мн. ч. → waren.', 'Vroeger ik speelde buiten.|Vroeger speelde ik buiten. # После vroeger глагол второй.'] },
    { t: 'order', q: ['Vroeger woonde ik in Riga.', 'Het was een mooie dag.', 'Toen ging hij naar huis.', 'We hadden geen tijd.', 'Plotseling begon het te regenen.', 'Elke zomer gingen we naar zee.'] },
    { t: 'tr', q: ['Раньше я жил(а) в деревне.|Vroeger woonde ik in een dorp.|Vroeger woonde ik op het platteland.', 'Было холодно.|Het was koud.', 'Потом мы пошли домой.|Toen gingen we naar huis.|Daarna gingen we naar huis.', 'У меня не было времени.|Ik had geen tijd.', 'Он сказал «привет».|Hij zei hallo.|Hij zei: hallo.'] },
  ],
  read: {
    title: 'Opa vertelt', intro: 'Дедушка рассказывает о детстве. Это история — поэтому imperfectum.',
    txt: ['Toen ik klein was, woonden we in een dorp bij Gouda. We hadden geen auto, maar wel vier fietsen en een hond.', 'Elke ochtend fietste ik naar school. In de winter was het water bevroren en dan schaatsten we over de sloot naar school. Dat was het mooiste!', 'Mijn moeder werkte op de kaasmarkt. Ze kwam altijd laat thuis, maar ze nam elke vrijdag een stuk kaas mee.'],
    gl: { 'toen ik klein was': 'когда я был маленьким', 'dorp': 'деревня', 'wel': 'зато', 'bevroren': 'замёрзший', 'schaatsten': 'катались на коньках', 'de sloot': 'канава', 'het mooiste': 'самое прекрасное', 'de kaasmarkt': 'сырный рынок', 'nam … mee': 'приносила' },
    q: [{ t: 'tf', q: ['De familie had een auto.|F # Ze hadden geen auto.', 'In de winter schaatste opa naar school.|T', 'Zijn moeder werkte op de kaasmarkt.|T', 'Zijn moeder kwam vroeg thuis.|F # Ze kwam altijd laat thuis.'] },
      { t: 'choice', q: ['Hoeveel fietsen hadden ze?|vier|twee|geen', 'Wat nam moeder op vrijdag mee?|een stuk kaas|een taart|een vis'] }],
  },
  series: [{ show: 'spreekwoord', who: 'нидерландская пословица', q: 'Vroeger was alles beter.', mean: '«Раньше всё было лучше».', fun: 'Это скорее не мудрость, а шутка над ворчунами: голландцы говорят её с усмешкой — особенно когда дедушка вспоминает, как в 1963-м катался на коньках по каналам всю зиму. Ответ на неё часто такой: <i>Ja, ja, en vroeger was het ook kouder.</i>', use: 'Ach, vroeger was alles beter!', qz: 'Как голландцы обычно говорят «Vroeger was alles beter»?|с иронией|с полной серьёзностью|только на похоронах # Это добрая насмешка над ностальгией.' }],
  write: { h: 'Расскажите о своём детстве: где жили, что делали, что любили. 5–6 предложений в imperfectum.', min: 25, use: ['vroeger', 'woonde', 'was', 'had'],
    plan: ['Toen ik klein was, woonde ik …', 'We hadden …', 'Elke zomer …', 'Het mooiste was …'],
    model: 'Toen ik klein was, woonde ik in een klein huis bij de zee.\nWe hadden een kat en een grote tuin.\nElke zomer gingen we naar mijn oma. Zij bakte altijd taart.\nHet mooiste was de zee in de avond.' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch simple past imperfectum'], ['DutchPod101', 'Dutch past tense irregular verbs'], ['Het Klokhuis', 'Elfstedentocht']],
  fact: '*Elfstedentocht* — 200 км на коньках через 11 городов Фрисландии. Её проводят только когда лёд везде толщиной не меньше 15 см. Последний раз — в 1997 году. С тех пор каждую холодную зиму вся страна спрашивает: *Gaat hij door?* — «Состоится?» Йоп на коньках не стоит. У него лапы.',
  src: [['DutchGrammar.com — simple past', 'https://www.dutchgrammar.com/en/?n=Verbs.Re11'], ['Woordenlijst', 'https://woordenlijst.org/'], ['Vereniging De Friesche Elf Steden', 'https://www.elfstedentocht.frl/']],
});
NOTE('a2-3', {
  crow: 'Imperfectum — время для историй. «Раньше на пляже было больше туристов и меньше чаек». Ну, так все говорят. *Vroeger was alles beter.* Кроме погоды. Погода и раньше была ужасной.',
  mk: ['Напишите, где вы жили в детстве.|woonde|Vroeger woonde ik in een groot huis in Riga.', 'Напишите, что вы делали каждое лето.|elke zomer|Elke zomer gingen we naar het strand.', 'Начните сказку: *Er was eens …*|er was eens|Er was eens een kleine kat in Amsterdam.'],
  etym: [['verhaal', 'от *ver-* + *halen* («доставать, тащить»). Рассказ — то, что «вытащили» из памяти и принесли слушателю.'], ['sloot', 'канава. Их в Нидерландах сотни тысяч километров: это вода между полями, которую «закрыли» (*sluiten*) в берегах. Зимой по ним катаются, летом в них падают велосипедисты.']],
  ru: 'Вечером Йоп и Рик сидят под мостом. Идёт дождь. Рик впервые рассказывает о себе: раньше он жил в польдере. Почему он оттуда ушёл?',
  gl: { 'zaten': 'сидели', 'brug': 'мост', 'regende': 'шёл дождь', 'vertelde': 'рассказывал', 'woonde': 'жил', 'polder': 'польдер (осушенная земля)', 'ving': 'ловил', 'vroeg': 'спросил', 'kwam': 'пришла, появилась', 'snelweg': 'шоссе', 'gebeurde': 'случалось' },
  tf: ['Het regende ’s avonds niet meer.|F # Het regende nog steeds.', 'Rik woonde vroeger in een polder.|T', 'Joop zei veel.|F # Joop zei niets. Dat gebeurde niet vaak.'],
  ch: ['Waarom ging Rik weg uit de polder?|er kwam een snelweg|hij had honger|hij zocht Joop # Er kwam een snelweg.'],
  bmk: ['Где вы жили раньше и почему переехали? Одно-два предложения.|woonde|Vroeger woonde ik in een dorp, maar er was geen werk.'],
  etb: '*Polder* — земля, отвоёванная у воды: её окружают дамбой и откачивают воду — раньше мельницами, теперь насосами. Около четверти Нидерландов лежит ниже уровня моря. А «польдер-модель» — это голландская манера договариваться, пока все не согласятся: в польдере иначе нельзя, вода общая.',
});
ST('a2-3', { t: 'Раньше и сейчас', tip: 'Голландцы обожают сравнивать: *Vroeger was het hier …* — «раньше тут было…». Поддержите разговор: *O ja? Wat was hier vroeger?* Это хороший способ узнать историю района от соседа.',
  sit: 'Пожилой сосед у старой велопарковки рассказывает о районе.', ph: [['Vroeger was hier een bakker.', 'Раньше тут была пекарня.'], ['O ja? Echt?', 'Да? Правда?'], ['Wat was hier vroeger?', 'Что тут было раньше?'], ['Wat jammer!', 'Как жаль!']],
  dlg: ['Сосед: «Vroeger was hier een molen.» Как поддержать?|O ja? Wanneer was dat?|Ik was molen.|Nee, dat is niet zo. # Интерес и вопрос.', 'Сосед: «Toen ik jong was, fietste ik hier elke dag.»|Leuk! Waar ging u naartoe?|Ik fiets morgen.|Waarom fietst u? # Пожилому — на u.'],
  mk: 'Расскажите соседу, что было в вашем районе или городе раньше.|vroeger;was|Vroeger was hier een grote markt.' });
BK('a2-3', 'Hoofdstuk 9. Onder de brug', ['’s Avonds zaten Joop en Rik onder een brug. Het regende nog steeds. Natuurlijk.', 'Rik vertelde over vroeger. «Ik woonde in een polder. Elke dag ving ik vis. Het was stil en mooi.»', '«Waarom ging je weg?» vroeg Joop. «Er kwam een snelweg,» zei Rik. «Veel auto’s. Veel lawaai.»', 'Joop zei niets. Dat gebeurde niet vaak. Hij gaf Rik zijn laatste frietje.']);

U({
  id: 'a2-4', lvl: 'A2', t: 'Прилагательные: groot и grote', en: 'Bijvoeglijke naamwoorden',
  goals: ['знать, когда у прилагательного *-e*, а когда нет', 'писать *groot → grote*, *dik → dikke*, *lief → lieve*', 'сравнивать: *groter dan*, *het grootst*, *beter, best*'],
  th: `<p>Прилагательное после существительного или после <i>zijn</i> не меняется: <i>De fiets is <b>oud</b>.</i> А перед существительным почти всегда получает <b>-e</b>: <i>de <b>oude</b> fiets</i>.</p>
  <h4>Единственное исключение</h4>
  <p>Без <b>-e</b> — только если одновременно: <b>het-слово</b> + <b>единственное число</b> + перед ним <b>een, geen</b> или ничего (нет de/het/dit/dat).</p>
  <div class="tbl"><table><thead><tr><th></th><th>de-слово</th><th>het-слово</th></tr></thead><tbody>
  <tr><td>de / het, dit / dat</td><td>de grot<b>e</b> fiets</td><td>het grot<b>e</b> huis</td></tr>
  <tr><td>een, geen</td><td>een grot<b>e</b> fiets</td><td>een <b>groot</b> huis ⚠️</td></tr>
  <tr><td>мн. ч.</td><td>grot<b>e</b> fietsen</td><td>grot<b>e</b> huizen</td></tr></tbody></table></div>
  <p>Одна клетка из шести — без -e. Её и надо запомнить. Йоп называет её «клеткой для het».</p>
  <h4>Правописание</h4>
  <p>Те же правила долгих и коротких звуков, что в A1: <i>gr<b>oo</b>t → gr<b>o</b>te</i> (слог открылся — одна буква), <i>d<b>i</b>k → di<b>kk</b>e</i> (короткий звук — согласная удваивается), <i>lie<b>f</b> → lie<b>v</b>e</i>, <i>grij<b>s</b> → grij<b>z</b>e</i>. Не меняются: <i>gouden</i>, <i>houten</i> (из золота, из дерева) и <i>oranje, roze</i>.</p>
  <h4>Сравнение</h4>
  <p><b>-er</b> и <b>(het) -st</b>: <i>klein — kleiner — het kleinst</i>. После -r вставляется -d-: <i>duur — duurder</i>. «Чем» — <b>dan</b>: <i>Rik is groter dan Joop.</i> Неправильные: <i>goed — beter — best</i>, <i>veel — meer — meest</i>, <i>graag — liever — liefst</i>.</p>`,
  simple: 'Перед существительным — -e. Без -e только: een/geen/ничего + het-слово + ед. ч. (een groot huis). groot→grote, dik→dikke. Сравнение: -er dan, het -st.',
  exm: [['Ik heb een nieuwe fiets.', 'У меня новый велосипед.'], ['Het is een groot huis.', 'Это большой дом.'], ['Amsterdam is groter dan Delft.', 'Амстердам больше Делфта.'], ['Dit is de beste patat van Nederland.', 'Это лучшая картошка фри в Нидерландах.']],
  conf: [['*een groot huis* / *het grote huis*', 'С <i>een</i> het-слово в ед. ч. — без -e. С <i>het</i> — уже с -e.', 'Dat is ___ huis.|een groot|een grote|groot een # een + het-слово → без -e.'],
    ['*dan* / *als*', 'В сравнении «больше чем» — <b>dan</b>: <i>groter dan</i>. «Такой же, как» — <b>als</b>: <i>even groot als</i>. Многие голландцы говорят <i>groter als</i>, но это считается ошибкой.', 'Rik is langer ___ Joop.|dan|als|of # Сравнительная степень → dan.']],
  words: [['nieuw', 'новый', 'Ik heb een nieuwe jas.'], ['oud', 'старый', 'Dat is een oud huis.'], ['mooi', 'красивый', 'Wat een mooie fiets!'], ['lelijk', 'некрасивый, уродливый', 'Die lamp is echt lelijk.'], ['duur', 'дорогой', 'Amsterdam is duurder dan Delft.'], ['goedkoop', 'дешёвый', 'Die tweedehands fiets was goedkoop.'], ['lekker', 'вкусный; приятный', 'Dit is lekkere kaas.'], ['makkelijk', 'лёгкий, простой', 'Nederlands is een makkelijke taal. Bijna.'], ['moeilijk', 'трудный', 'De en het is moeilijk.'], ['beter', 'лучше', 'Thuis is het beter.']],
  ex: [
    { t: 'choice', h: 'С -e или без?', q: ['een ___ boek (dik)|dik|dikke|dike # het boek, een, ед. ч. → без -e.', 'de ___ fiets (oud)|oude|oud|ouwe # С de — -e.', 'een ___ jas (warm)|warme|warm|warmme # de jas → -e.', 'het ___ huis (groot)|grote|groot|groote # С het — -e; oo → o.', '___ kinderen (lief)|lieve|lief|liefe # мн. ч. → -e; f → v.', 'geen ___ weer (mooi)|mooi|mooie|moois # het weer, geen → без -e.'] },
    { t: 'gap', h: 'Вставьте сравнение.', q: ['Rotterdam is ___ dan Delft. (groot)|groter', 'Een fiets is ___ dan een auto. (goedkoop)|goedkoper', 'Amsterdam is ___ dan Den Haag. (duur)|duurder', 'Deze patat is ___ dan die. (goed)|beter', 'Dit is de ___ stroopwafel. (lekker)|lekkerste', 'Ik drink ___ thee dan koffie. (graag)|liever'] },
    { t: 'fix', q: ['Een grote huis.|Een groot huis. # een + het-слово → без -e.', 'De oud fiets.|De oude fiets. # С de — всегда -e.', 'Het is een dike boek.|Het is een dik boek. # het boek + een → без -e.', 'Joop is kleiner als Rik.|Joop is kleiner dan Rik. # После -er → dan.'] },
    { t: 'order', q: ['Ik heb een nieuwe fiets.', 'Het is een groot huis.', 'Amsterdam is groter dan Delft.', 'Wat een mooie fiets!', 'Dit is lekkere kaas.', 'Thuis is het beter.'] },
    { t: 'tr', q: ['У меня старый велосипед.|Ik heb een oude fiets.', 'Это большой дом.|Het is een groot huis.|Dat is een groot huis.|Dit is een groot huis.', 'Какой красивый велосипед!|Wat een mooie fiets!', 'Делфт меньше Амстердама.|Delft is kleiner dan Amsterdam.', 'Это лучший кофе.|Dit is de beste koffie.|Dat is de beste koffie.|Het is de beste koffie.'] },
  ],
  read: {
    title: 'Te koop: fiets', intro: 'Объявление на сайте Marktplaats. Найдите прилагательные — где с -e, где без?',
    txt: ['Te koop: een mooie, oude damesfiets. Kleur: donkerblauw. De fiets heeft een groot rieten mandje en een nieuwe bel.', 'Het zadel is een beetje kapot, maar de remmen zijn goed. Hij is zwaarder dan een moderne fiets, maar ook steviger.', 'Prijs: 80 euro. Dat is goedkoper dan in de winkel! Alleen ophalen in Delft. Geen rare vragen, alstublieft.'],
    gl: { 'te koop': 'продаётся', 'damesfiets': 'женский велосипед', 'rieten mandje': 'плетёная корзинка', 'het zadel': 'седло', 'de remmen': 'тормоза', 'zwaarder': 'тяжелее', 'steviger': 'крепче', 'ophalen': 'забрать самому', 'rare vragen': 'странные вопросы' },
    q: [{ t: 'tf', q: ['De fiets is nieuw.|F # Het is een oude fiets.', 'De bel is nieuw.|T', 'De fiets is lichter dan een moderne fiets.|F # Hij is zwaarder.', 'Je moet de fiets in Delft ophalen.|T'] },
      { t: 'choice', q: ['Welke kleur heeft de fiets?|donkerblauw|oranje|zwart', 'Wat is een beetje kapot?|het zadel|de remmen|de bel'] }],
  },
  series: [{ show: 'uitdrukking', who: 'нидерландское выражение', q: 'Doe maar gewoon, dan doe je al gek genoeg.', mean: '«Веди себя нормально — этого уже достаточно безумно».', fun: 'Главный голландский девиз скромности. Не выделяйся, не хвастайся, не покупай слишком <i>dure</i> машину. Даже премьер-министр ездит на работу на велосипеде. Если вы скажете «у меня самый красивый дом на улице», голландец ответит: <i>Doe normaal.</i>', use: 'Doe maar gewoon!', qz: 'О чём выражение «Doe maar gewoon»?|не выделяйся, будь скромнее|делай что хочешь|работай быстрее # Скромность — почти национальная черта.' }],
  write: { h: 'Опишите свою вещь (велосипед, комнату, город) — 4–5 предложений, 3 прилагательных и одно сравнение.', min: 25, use: ['een', 'de', 'dan'],
    plan: ['Ik heb een … (вещь с прилагательным)', 'Hij/Het is … (цвет, размер)', 'Het mooiste is …', 'Сравнение: … is … dan …'],
    model: 'Ik heb een oude, groene fiets. Hij is zwaar, maar heel sterk.\nHij heeft een groot mandje en een nieuwe bel.\nMijn fiets is langzamer dan een elektrische fiets, maar hij is mooier.' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch adjectives e ending'], ['DutchPod101', 'Dutch adjectives comparatives'], ['Dutchies to be', 'bijvoeglijk naamwoord e of geen e']],
  fact: 'В Нидерландах велосипедов больше, чем людей: около 23 миллионов на 18 миллионов жителей. Самый популярный — *omafiets* («бабушкин велосипед»): тяжёлый, с прямой спиной, одной передачей и корзинкой. Каждый год из амстердамских каналов достают тысячи велосипедов. Йоп уверен, что часть из них — его.',
  src: [['DutchGrammar.com — adjectives', 'https://www.dutchgrammar.com/en/?n=Adjectives.01'], ['Taalunie — Taaladvies', 'https://taaladvies.net/'], ['Marktplaats', 'https://www.marktplaats.nl/']],
});
NOTE('a2-4', {
  crow: 'Прилагательные. Почти всегда *-e*. Кроме одной клетки: *een* + het-слово. *Een groot huis*, но *een grote meeuw*. Это не я придумал. Я бы вообще всё отменил, кроме *lekker*.',
  mk: ['Опишите свой дом или квартиру: *Ik heb een …*|een|Ik heb een klein huis met een mooie tuin.', 'Сравните два города.|dan|Riga is kleiner dan Amsterdam, maar mooier.', 'Напишите, что для вас лучшее блюдо.|beste/lekkerste|De lekkerste soep is de soep van mijn oma.'],
  etym: [['lekker', 'родня немецкого *lecker* и английского *lick* (лизать). Вкусно — то, что хочется облизать. Голландцы говорят *lekker* обо всём приятном: *lekker weer, lekker slapen*.'], ['duur', 'родня английского *dear* («дорогой» — и о цене, и о человеке). В английском остались оба смысла, в нидерландском — только цена. Очень по-голландски.']],
  ru: 'Утром старый велосипед совсем плох: звонок сломан, фонаря нет. Друзья идут к веломастеру. Йоп хочет золотой звонок. Платит, конечно, Рик.',
  gl: { 'vies': 'грязный', 'achterlicht': 'задний фонарь', 'fietsenwinkel': 'веломагазин', 'fietsenmaker': 'веломастер', 'baard': 'борода', 'gouden': 'золотой', 'glimmende': 'блестящий', 'het mooiste': 'самый красивый' },
  tf: ['De oude fiets was erg vies.|T', 'De fietsenmaker was een kleine man.|F # Hij was een lange man.', 'Joop wilde de gouden bel.|T'],
  ch: ['Hoeveel kost de gouden bel?|twintig euro|vijf euro|tien euro # «Een gouden bel kost twintig.»'],
  bmk: ['Опишите свой велосипед или любую вещь, которую любите, двумя прилагательными.|een|Ik heb een oude, rode fiets.'],
  etb: '*Fietsenmaker* — веломастер, профессия, которая в Нидерландах есть в каждом квартале. Слово *fiets* до сих пор загадка: возможно, от *vietse* — «быстро двигаться», возможно, звукоподражание. Сами голландцы спорят о нём уже больше ста лет.',
});
ST('a2-4', { t: 'Комплимент велосипеду', tip: 'Лучший способ начать разговор у велопарковки — похвалить чужой велосипед: *Wat een mooie fiets!* Голландец тут же расскажет, где купил и за сколько — обычно с гордостью, что дёшево: *Tweedehands, maar hij rijdt prima!*',
  sit: 'Человек пристёгивает красивый старый велосипед рядом с вашим.', ph: [['Wat een mooie fiets!', 'Какой красивый велосипед!'], ['Is hij nieuw?', 'Он новый?'], ['Nee, tweedehands.', 'Нет, подержанный.'], ['Hij rijdt prima.', 'Он отлично едет.']],
  dlg: ['Вы: «Wat een mooie fiets!» Ответ: «Dank je! Hij is al dertig jaar oud.» Что сказать?|Echt? Hij ziet er nieuw uit!|Dat is een oud fiets.|Nee. # Похвала и удивление.', 'Сосед: «Is jouw fiets nieuw?»|Nee, hij is tweedehands, maar heel goed.|Nee, het is een nieuw fiets.|Ja, oud. # de fiets → hij.'],
  mk: 'Похвалите чужой велосипед или вещь одной фразой с прилагательным.|wat een|Wat een mooie, groene fiets!' });
BK('a2-4', 'Hoofdstuk 10. Een gouden bel', ['De volgende ochtend was de oude fiets erg vies. De bel was kapot en het achterlicht ook.', 'Ze gingen naar een kleine fietsenwinkel. De fietsenmaker was een lange man met een grijze baard.', '«Een nieuwe bel kost vijf euro,» zei hij. «Een gouden bel kost twintig.» Joop wilde natuurlijk de gouden bel.', 'Rik betaalde weer. Joop keek naar zijn glimmende bel. Tring! «Het mooiste geluid van Nederland,» zei hij.']);

U({
  id: 'a2-5', lvl: 'A2', t: 'Модальные и будущее: kunnen, willen, moeten, gaan', en: 'Modale werkwoorden en de toekomst',
  goals: ['спрягать *kunnen, willen, moeten, mogen*', 'ставить второй глагол в конец: *Ik wil patat eten*', 'говорить о будущем: *Ik ga morgen fietsen*, *Zullen we…?*'],
  th: `<p>Модальный глагол — на втором месте, второй глагол (инфинитив) — <b>в конце</b>. Та же «рамка», что в perfectum: <i>Ik <b>wil</b> vandaag patat <b>eten</b>.</i></p>
  <h4>Формы</h4>
  <div class="tbl"><table><thead><tr><th></th><th>kunnen — мочь</th><th>willen — хотеть</th><th>moeten — должен</th><th>mogen — можно</th><th>zullen</th></tr></thead><tbody>
  <tr><td>ik</td><td>kan</td><td>wil</td><td>moet</td><td>mag</td><td>zal</td></tr>
  <tr><td>jij</td><td>kunt / kan</td><td>wilt / wil</td><td>moet</td><td>mag</td><td>zult / zal</td></tr>
  <tr><td>u</td><td>kunt</td><td>wilt</td><td>moet</td><td>mag</td><td>zult</td></tr>
  <tr><td>hij, zij</td><td>kan</td><td>wil</td><td>moet</td><td>mag</td><td>zal</td></tr>
  <tr><td>мн. ч.</td><td>kunnen</td><td>willen</td><td>moeten</td><td>mogen</td><td>zullen</td></tr></tbody></table></div>
  <p>В вопросе с <i>jij</i> — короткая форма: <i><b>Kun</b> je…? <b>Wil</b> je…? <b>Zal</b> ik…?</i></p>
  <h4>«Не нужно» — niet hoeven te</h4>
  <p><i>Ik <b>moet</b> werken</i> (я должен работать) → отрицание обычно не <i>moet niet</i>, а <b>hoef niet te</b>: <i>Ik <b>hoef</b> vandaag niet <b>te</b> werken.</i> (мне не нужно). <i>Je moet niet…</i> — это уже «не смей».</p>
  <h4>Будущее</h4>
  <p>1) Просто presens + время: <i>Morgen <b>fiets</b> ik naar Delft.</i> — самое частое.<br>2) <b>gaan</b> + инфинитив — планы: <i>Ik <b>ga</b> morgen <b>fietsen</b>.</i><br>3) <b>zullen</b> — обещания и официальное: <i>Ik <b>zal</b> het doen.</i> — «Сделаю, обещаю».<br><b>Zullen we…?</b> — «Давай…?»: <i>Zullen we koffie drinken?</i></p>`,
  simple: 'Модальный — второй, инфинитив — в конце. kan, wil, moet, mag, zal. «Не нужно» — hoef niet te. Будущее: presens, gaan + инф., zullen = обещаю. Zullen we…? — давай…?',
  exm: [['Ik wil patat eten.', 'Я хочу съесть картошку фри.'], ['Kun je me helpen?', 'Можешь мне помочь?'], ['Je hoeft niet te betalen.', 'Платить не нужно.'], ['Zullen we morgen fietsen?', 'Давай завтра покатаемся?']],
  conf: [['*moet niet* / *hoeft niet te*', '<i>Je hoeft niet te komen</i> — «можешь не приходить». <i>Je moet niet komen</i> — «не приходи!».', 'Друг: «Moet ik betalen?» Вы угощаете. Ответ:|Nee, je hoeft niet te betalen.|Nee, je moet niet betalen.|Nee, je kan niet betalen. # «Не нужно» — hoeven niet te.'],
    ['*kunnen* / *mogen*', '<i>kunnen</i> — мочь, уметь. <i>mogen</i> — разрешено. <i>Mag ik hier fietsen?</i> — тут можно ездить?', 'В парке: «___ ik hier fietsen?»|Mag|Wil|Moet # Разрешение — mogen.']],
  words: [['kunnen', 'мочь, уметь', 'Kun je zwemmen?'], ['willen', 'хотеть', 'Ik wil graag een stroopwafel.'], ['moeten', 'быть должным', 'We moeten om acht uur vertrekken.'], ['mogen', 'иметь разрешение', 'Mag ik hier zitten?'], ['hoeven', 'нужно (с niet)', 'Je hoeft niet te wachten.'], ['zullen', 'будущее, обещание', 'Ik zal je morgen bellen.'], ['morgen', 'завтра', 'Morgen ga ik naar Delft.'], ['volgend jaar', 'в следующем году', 'Volgend jaar wil ik naar Gent.'], ['het plan', 'план', 'Wat is het plan voor vandaag?'], ['misschien', 'может быть', 'Misschien gaan we naar zee.']],
  ex: [
    { t: 'choice', h: 'Выберите форму.', q: ['___ je me helpen?|Kun|Kunt|Kunnen # В вопросе с je — короткая форма.', 'Hij ___ naar huis.|moet|moeten|moett', 'Wij ___ graag patat.|willen|wil|wilt', '___ ik hier fietsen?|Mag|Mogen|Magt # ik → mag.', 'Je ___ niet te betalen.|hoeft|moet|mag # hoeven niet te — не нужно.', '___ we koffie drinken?|Zullen|Zal|Zult # «Давай…?» — Zullen we.'] },
    { t: 'gap', h: 'Вставьте инфинитив в конец.', q: ['Ik wil vandaag patat ___. (есть)|eten', 'Kun je Nederlands ___? (говорить)|spreken', 'We moeten om acht uur ___. (выезжать)|vertrekken', 'Ik ga morgen ___. (кататься на велосипеде)|fietsen', 'Je hoeft niet te ___. (ждать)|wachten', 'Zullen we naar het strand ___? (идти)|gaan'] },
    { t: 'fix', q: ['Ik wil eten patat.|Ik wil patat eten. # Инфинитив — в конец.', 'Kunt je me helpen?|Kun je me helpen? # После kun вопрос с je — без -t.', 'Je moet niet betalen, het is gratis.|Je hoeft niet te betalen, het is gratis. # «Не нужно» — hoeven niet te.', 'Morgen ik ga fietsen.|Morgen ga ik fietsen. # После morgen глагол второй.'] },
    { t: 'order', q: ['Ik wil patat eten.', 'Kun je me helpen?', 'Je hoeft niet te betalen.', 'Zullen we morgen fietsen?', 'Mag ik hier zitten?', 'Morgen ga ik naar Delft.'] },
    { t: 'tr', q: ['Я хочу кофе.|Ik wil koffie.|Ik wil graag koffie.|Ik wil een koffie.', 'Можно здесь сесть?|Mag ik hier zitten?', 'Нам нужно идти.|We moeten gaan.|Wij moeten gaan.|We moeten weg.', 'Давай выпьем кофе?|Zullen we koffie drinken?', 'Тебе не нужно ждать.|Je hoeft niet te wachten.|Jij hoeft niet te wachten.'] },
  ],
  read: {
    title: 'Plannen voor zaterdag', intro: 'Переписка двух друзей. Найдите все модальные глаголы и инфинитивы в конце.',
    txt: ['Sanne: Zullen we zaterdag naar Leiden fietsen? Het moet mooi weer worden!', 'Daan: Leuk! Maar ik kan pas om twaalf uur. ’s Ochtends moet ik werken. Mag mijn zus ook mee?', 'Sanne: Natuurlijk! Ze hoeft niet te fietsen, ze kan ook met de trein komen. We gaan in Leiden lunchen en daarna willen we naar de molen. Ik zal de route sturen!'],
    gl: { 'het moet mooi weer worden': 'обещают хорошую погоду', 'pas om twaalf uur': 'только в двенадцать', 'mee': 'с нами', 'lunchen': 'обедать', 'de molen': 'мельница', 'de route sturen': 'прислать маршрут' },
    q: [{ t: 'tf', q: ['Daan moet zaterdagochtend werken.|T', 'De zus moet fietsen.|F # Ze hoeft niet te fietsen.', 'Ze willen in Leiden lunchen.|T', 'Daan zal de route sturen.|F # Sanne zal de route sturen.'] },
      { t: 'choice', q: ['Hoe laat kan Daan?|om twaalf uur|om acht uur|om vier uur', 'Waar willen ze na de lunch naartoe?|naar de molen|naar het strand|naar huis'] }],
  },
  series: [{ show: 'typisch', who: 'типично голландское', q: 'Even in de agenda kijken.', mean: '«Сейчас посмотрю в ежедневник».', fun: 'Голландцы планируют всё — даже ужин с другом, даже на день рождения бабушки. Спонтанное «зайду вечером?» может вызвать лёгкую панику. Правильно: <i>Zullen we een afspraak maken?</i> — и через три недели во вторник, с 19:30 до 21:00. Зато точно придут.', use: 'Wanneer kun je? Even in mijn agenda kijken…', qz: 'Друг-голландец предлагает встретиться. Что он скорее скажет?|«Дай посмотрю в ежедневник»|«Приходи прямо сейчас!»|«Когда-нибудь увидимся» # agenda — святое.' }],
  write: { h: 'Ваши планы на выходные: что хотите, должны, можете и не обязаны делать. 4–6 предложений.', min: 25, use: ['wil', 'moet', 'kan', 'ga'],
    plan: ['Zaterdag wil ik …', 'Maar eerst moet ik …', 'Ik hoef niet te …', 'Zondag ga ik …'],
    model: 'Zaterdag wil ik lang slapen.\nMaar eerst moet ik boodschappen doen.\nIk hoef niet te werken, gelukkig!\nZondag ga ik met mijn vriendin naar zee. Misschien kunnen we daar vis eten.' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch modal verbs kunnen willen moeten'], ['DutchPod101', 'Dutch future tense gaan zullen'], ['NT2 TaalMenu', 'modale werkwoorden']],
  fact: 'День рождения в Нидерландах — тоже план: гости садятся в круг (*de kring*), всех поздравляют с днём рождения именинника — и маму, и соседа: *Gefeliciteerd met je moeder!* Подают кофе с тортом — ровно по одному куску. Йоп однажды попробовал взять второй. Его до сих пор вспоминают.',
  src: [['DutchGrammar.com — modal verbs', 'https://www.dutchgrammar.com/en/?n=Verbs.au01'], ['Taalunie — Taaladvies', 'https://taaladvies.net/'], ['Woordenlijst', 'https://woordenlijst.org/']],
});
NOTE('a2-5', {
  crow: '*Ik wil patat.* *Ik moet patat.* *Ik mag geen patat* — это врачи говорят. Модальные глаголы — про желания и обязанности. Желания у меня простые. Обязанностей нет. Удобно.',
  mk: ['Напишите, что вы хотите сделать в этом году.|wil|Dit jaar wil ik Nederlands leren.', 'Напишите, что вам не нужно делать завтра.|hoef;te|Morgen hoef ik niet te werken.', 'Предложите другу что-то сделать вместе.|zullen we|Zullen we zaterdag naar het museum gaan?'],
  etym: [['mogen', 'родня английского *may* и немецкого *mögen*. Сначала это значило «иметь силу» — от того же корня, что русское «мочь»!'], ['misschien', 'буквально *mag schien* — «может случиться». Две старые глагольные формы, склеенные в одно слово.']],
  ru: 'Друзья решают, куда ехать дальше. Рик хочет в Делфт — посмотреть на знаменитый синий фаянс. Йоп хочет понять, можно ли его съесть. Карту доверили Йопу. Зря.',
  gl: { 'vandaag': 'сегодня', 'ver': 'далеко', 'aardewerk': 'фаянс, керамика', 'delfts blauw': 'делфтский синий фаянс', 'hoef': 'нужно (с niet)', 'mocht': 'разрешили', 'de kaart': 'карту', 'verkeerde kant': 'не в ту сторону' },
  tf: ['Delft is ver.|F # «Het is niet ver.»', 'Rik wil het blauwe aardewerk zien.|T', 'Rik mocht de kaart lezen.|F # Joop mocht de kaart lezen.'],
  ch: ['Wat vraagt Joop over het aardewerk?|Kun je dat eten?|Is het duur?|Is het blauw? # «Aardewerk? Kun je dat eten?»'],
  bmk: ['Что вы хотите увидеть в Нидерландах? *Ik wil … zien.*|wil;zien|Ik wil de molens bij Kinderdijk zien.'],
  etb: '*Delfts blauw* появился в XVII веке: голландские торговцы привозили из Китая фарфор, и делфтские мастера стали его подражать — дешевле, из глины, но с тем же синим узором. Сегодня в Делфте работает одна старая мануфактура из тех времён — *Royal Delft*.',
});
ST('a2-5', { t: 'Договориться о встрече', tip: '*Zullen we …?* — вежливое «давайте…». На вопрос *Wanneer kun je?* голландцы называют точный день и время. Расплывчатое «на днях» звучит как «никогда».',
  sit: 'Коллега у велопарковки после работы.', ph: [['Zullen we een keer koffie drinken?', 'Давай как-нибудь выпьем кофе?'], ['Leuk! Wanneer kun je?', 'Классно! Когда тебе удобно?'], ['Kan je donderdag?', 'Можешь в четверг?'], ['Prima, om vier uur?', 'Отлично, в четыре?']],
  dlg: ['Коллега: «Zullen we een keer koffie drinken?»|Ja, leuk! Kun je dinsdag?|Ja, koffie drink.|Nee, ik moet koffie. # Согласие + конкретный день.', 'Коллега: «Kan je donderdag om vier uur?»|Nee, dan moet ik werken. Vrijdag?|Nee, ik hoef.|Ja, ik wil donderdag. Misschien. Nee. # Отказ с причиной и новое предложение.'],
  mk: 'Предложите встречу: день, время и что делать.|zullen we|Zullen we zaterdag om twee uur fietsen?' });
BK('a2-5', 'Hoofdstuk 11. Een plan', ['«Waar gaan we vandaag naartoe?» vroeg Joop. «We kunnen naar Delft fietsen,» zei Rik. «Het is niet ver.»', '«Wil je daar patat eten?» «Nee,» zei Rik. «Ik wil het blauwe aardewerk zien. Delfts blauw.»', '«Aardewerk? Kun je dat eten?» vroeg Joop. «Nee.» «Dan hoef ik het niet te zien.»', 'Maar Joop mocht de kaart lezen. Dat vond hij leuk. Ze fietsten een uur. De verkeerde kant op.']);

U({
  id: 'a2-6', lvl: 'A2', t: 'Разделяемые глаголы и er: ik bel je op', en: 'Scheidbare werkwoorden en «er»',
  goals: ['разделять глаголы: *opbellen → Ik bel je op*', 'ставить их в perfectum: *opgebeld*, и с модальным: *Ik wil je opbellen*', 'говорить *er is / er zijn* и *Ik heb er twee*'],
  th: `<h4>Разделяемые глаголы</h4>
  <p>У многих глаголов есть ударная приставка: <i><b>op</b>bellen</i> (позвонить), <i><b>aan</b>komen</i> (прибыть), <i><b>mee</b>nemen</i> (взять с собой), <i><b>uit</b>gaan</i> (пойти развлекаться), <i><b>op</b>staan</i> (вставать), <i><b>af</b>spreken</i> (договориться).</p>
  <p>Когда глагол стоит на втором месте, приставка <b>уходит в конец</b>: <i>Ik <b>bel</b> je morgen <b>op</b>.</i> <i>De trein <b>komt</b> om acht uur <b>aan</b>.</i></p>
  <p>Когда глагол в конце (инфинитив, придаточное) — снова вместе: <i>Ik wil je morgen <b>opbellen</b>.</i></p>
  <p>Perfectum: <b>ge</b> встаёт внутрь: <i>op<b>ge</b>beld</i>, <i>aan<b>ge</b>komen</i>, <i>mee<b>ge</b>nomen</i>. <i>Ik heb je <b>opgebeld</b>.</i> <i>We zijn laat <b>aangekomen</b>.</i></p>
  <p>Как узнать? Ударение на приставке: <i>ÓPbellen</i> — разделяется. <i>verTÉLlen, beTAlen</i> — нет (приставки be-, ver- никогда не отделяются).</p>
  <h4>er — маленькое слово с большой работой</h4>
  <p>1) <b>er is / er zijn</b> — «есть, имеется»: <i><b>Er is</b> een patatzaak.</i> <i><b>Er zijn</b> veel fietsen.</i> С неопределённым подлежащим голландцы почти всегда начинают с <i>er</i>.</p>
  <p>2) <b>er</b> + число — «из них, их»: <i>Hoeveel fietsen heb je? Ik heb <b>er</b> twee.</i> Без <i>er</i> звучит неполно.</p>
  <p>3) <b>er</b> = «там»: <i>Ben je in Delft geweest? Ja, ik ben <b>er</b> vorig jaar geweest.</i></p>`,
  simple: 'opbellen: Ik bel je op — приставка в конец. С модальным — вместе: Ik wil je opbellen. Perfectum: opgebeld. Er is / er zijn — есть. Ik heb er twee — у меня их два.',
  exm: [['Ik bel je morgen op.', 'Я позвоню тебе завтра.'], ['De trein komt om acht uur aan.', 'Поезд прибывает в восемь.'], ['Er is een patatzaak op de hoek.', 'На углу есть закусочная.'], ['Hoeveel heb je er?', 'Сколько их у тебя?']],
  conf: [['*opgebeld* / *geopbeld*', 'В разделяемом глаголе <i>ge-</i> — между приставкой и глаголом: <i>op-ge-beld</i>.', 'Ik heb je gisteren ___.|opgebeld|geopbeld|opbelt # op + ge + beld.'],
    ['*Ik heb twee* / *Ik heb er twee*', 'Если слово уже прозвучало, а теперь — только число, нужно <i>er</i>: <i>Ik heb er twee.</i>', 'Heb je katten? — Ja, ik heb ___ drie.|er|het|ze # Число без существительного → er.']],
  words: [['opbellen', 'звонить (по телефону)', 'Ik bel mijn moeder elke zondag op.'], ['aankomen', 'прибывать', 'Hoe laat kom je aan?'], ['meenemen', 'брать с собой', 'Neem je een jas mee?'], ['opstaan', 'вставать', 'Ik sta om zeven uur op.'], ['uitgaan', 'выходить (развлекаться)', 'Op vrijdag gaan we uit.'], ['afspreken', 'договариваться', 'We hebben om drie uur afgesproken.'], ['meedoen', 'участвовать', 'Doe je mee met het spel?'], ['terugkomen', 'возвращаться', 'Wanneer kom je terug?'], ['er is', 'есть, имеется', 'Er is geen melk meer.'], ['de hoek', 'угол', 'De bakker is op de hoek.']],
  ex: [
    { t: 'choice', h: 'Где приставка?', q: ['Ik ___ je morgen ___. (opbellen)|bel … op|opbel …|bel … opbellen # Глагол второй — приставка в конец.', 'De trein ___ om tien uur ___. (aankomen)|komt … aan|aankomt …|komt … aankomen', 'Ik wil je morgen ___. (opbellen)|opbellen|bel op|op bellen # После модального — вместе.', 'We zijn laat ___. (aankomen)|aangekomen|geaankomen|aankomen # aan + ge + komen.', 'Heb je een jas ___? (meenemen)|meegenomen|genomenmee|meenemen', 'Hij heeft het ___. (vertellen)|verteld|vergeteld|geverteld # ver- не отделяется.'] },
    { t: 'gap', h: 'er или ничего? Вставьте er, если нужно.', q: ['___ is een bakker op de hoek.|Er', '___ zijn veel fietsen in Delft.|Er', 'Hoeveel broers heb je? Ik heb ___ twee.|er', 'Ben je in Gent geweest? Ja, ik ben ___ vorig jaar geweest.|er', 'Ik sta om zeven uur ___. (opstaan)|op', 'Neem je een paraplu ___? (meenemen)|mee'] },
    { t: 'fix', q: ['Ik opbel je morgen.|Ik bel je morgen op. # Приставка — в конец.', 'Ik heb je geopbeld.|Ik heb je opgebeld. # ge — между op и beld.', 'Is een patatzaak op de hoek.|Er is een patatzaak op de hoek. # «Есть» — er is.', 'Hoeveel katten heb je? Ik heb drie.|Hoeveel katten heb je? Ik heb er drie. # С числом без существительного — er.'] },
    { t: 'order', q: ['Ik bel je morgen op.', 'De trein komt om acht uur aan.', 'Er is een patatzaak op de hoek.', 'Ik sta om zeven uur op.', 'Neem je een jas mee?', 'We zijn laat aangekomen.'] },
    { t: 'tr', q: ['Я позвоню тебе завтра.|Ik bel je morgen op.|Morgen bel ik je op.', 'Здесь много велосипедов.|Er zijn hier veel fietsen.|Hier zijn veel fietsen.', 'Во сколько ты встаёшь?|Hoe laat sta je op?|Hoe laat sta jij op?|Hoe laat sta je op', 'У меня их два.|Ik heb er twee.', 'Мы приехали поздно.|We zijn laat aangekomen.|Wij zijn laat aangekomen.'] },
  ],
  read: {
    title: 'Een bericht van mama', intro: 'Голосовое сообщение от мамы студента. Найдите разделяемые глаголы и er.',
    txt: ['Hoi lieverd! Met mama. Ik heb je drie keer opgebeld, maar je neemt niet op! Sta je nu pas op?', 'Oma komt zaterdag om twee uur aan op het station. Kun je haar ophalen? Er is een bus, maar die gaat maar één keer per uur.', 'En neem je wasgoed mee als je zondag komt! Er zijn ook nog drie stroopwafels. Ik heb er al twee opgegeten. Sorry! Bel me terug. Doei!'],
    gl: { 'lieverd': 'милый, дорогой', 'met mama': 'это мама (по телефону)', 'neemt niet op': 'не берёшь трубку', 'nu pas': 'только сейчас', 'ophalen': 'встретить, забрать', 'per uur': 'в час', 'het wasgoed': 'бельё для стирки', 'opgegeten': 'съела', 'bel me terug': 'перезвони мне' },
    q: [{ t: 'tf', q: ['Mama heeft drie keer gebeld.|T', 'Oma komt zondag aan.|F # Oma komt zaterdag aan.', 'Er gaat elke tien minuten een bus.|F # Maar één keer per uur.', 'Mama heeft twee stroopwafels opgegeten.|T'] },
      { t: 'choice', q: ['Wat moet hij zondag meenemen?|zijn wasgoed|oma|de bus', 'Hoeveel stroopwafels zijn er nog?|drie|twee|vijf'] }],
  },
  series: [{ show: 'spreekwoord', who: 'нидерландская пословица', q: 'Afspraak is afspraak.', mean: '«Договор есть договор».', fun: 'Если голландец <i>heeft afgesproken</i> — он придёт, даже под ливнем на велосипеде. Отменить встречу за час — почти скандал. Зато и вы можете смело сказать: <i>We hadden toch afgesproken?</i> — «Мы же договорились?»', use: 'Afspraak is afspraak, ik kom om acht uur.', qz: 'Что значит «Afspraak is afspraak»?|договорились — значит, держим слово|встречу можно перенести|договориться невозможно # Пунктуальность и честность.' }],
  write: { h: 'Опишите свой обычный день с разделяемыми глаголами: встаёте, звоните, выходите, возвращаетесь. 5–6 предложений.', min: 30, use: ['sta', 'op', 'er', 'mee'],
    plan: ['Hoe laat sta je op?', 'Wat neem je mee naar je werk?', 'Wie bel je op?', 'Wanneer kom je thuis aan?', 'Er is / er zijn … in je straat.'],
    model: 'Ik sta om half zeven op. Ik neem altijd een appel en een boek mee.\nIn de pauze bel ik mijn zus op.\nOm zes uur kom ik thuis aan.\nIn mijn straat is er een bakker en er zijn veel bomen.' },
  vid: [['Learn Dutch with Bart de Pau', 'Dutch separable verbs'], ['DutchPod101', 'Dutch er is er zijn'], ['Dutchies to be', 'scheidbare werkwoorden']],
  fact: 'Нидерландские велопарковки — отдельный вид искусства. У вокзала Утрехта самая большая в мире: около 12 500 мест под землёй, с указателями свободных мест и бесплатными первыми сутками. Йоп там был. Он оставил одно перо и считает, что «зарезервировал место».',
  src: [['DutchGrammar.com — separable verbs', 'https://www.dutchgrammar.com/en/?n=Verbs.SP01'], ['DutchGrammar.com — er', 'https://www.dutchgrammar.com/en/?n=Er.01'], ['Woordenlijst', 'https://woordenlijst.org/']],
});
NOTE('a2-6', {
  crow: 'Разделяемые глаголы: *Ik bel je op*. Глагол — тут, приставка — где-то в конце. Как туристы на пляже: семья приехала вместе, но мама с зонтиком всегда отдельно. А *er* — это просто «есть». *Er is patat.* Лучшее предложение в языке.',
  mk: ['Напишите, во сколько вы встаёте.|sta;op|Ik sta om zeven uur op.', 'Напишите, кому вы звоните чаще всего.|bel;op|Ik bel mijn moeder elke dag op.', 'Напишите, что есть в вашей улице или городе.|er is/er zijn|In mijn straat is er een kleine bakker.'],
  etym: [['afspreken', '*af* + *spreken* («говорить»): договориться — значит «выговорить до конца», чтобы не осталось вопросов. Очень по-голландски.'], ['opbellen', '*op* + *bellen* — «позвонить в звонок». Слово старше телефона: так когда-то вызывали человека звонком у двери.']],
  ru: 'Карта завела друзей обратно в Схевенинген. Йоп звонит маме. Мама смеётся и советует посмотреть в телефон. Наконец они едут правильной дорогой — и к вечеру добираются до Делфта.',
  gl: { 'er is': 'есть', 'belde': 'позвонил', 'lachte': 'засмеялась', 'zette': 'включил', 'wegen': 'дороги', 'kwamen': 'приехали', 'stonden': 'стояли', 'vannacht': 'этой ночью', 'keek rond': 'огляделся', 'patatzaak': 'закусочная с картошкой фри' },
  tf: ['Joop en Rik waren weer in Scheveningen.|T', 'Joop belde zijn papa op.|F # Hij belde zijn mama op.', 'Er was een patatzaak in Delft.|T'],
  ch: ['Wat zei mama Greet?|Kijk op je telefoon!|Kom naar huis!|Waar is Rik? # «Kijk op je telefoon, Joop!»'],
  bmk: ['Что есть рядом с вашим домом? *Er is … / Er zijn …*|er is;er zijn|Er is een park en er zijn veel winkels.'],
  etb: '*Delft* — от *delven*, «копать»: город вырос у выкопанного канала, *de Delf*. Здесь похоронены почти все члены королевской семьи, а Вермеер прожил тут всю жизнь. Йопа больше интересует, что на рыночной площади продают селёдку.',
});
ST('a2-6', { t: 'Перенести встречу', tip: 'Если не успеваете — напишите заранее: *Het lukt me niet, kunnen we het verzetten?* — «не получается, перенесём?». Короткое *sorry* и новое время — и голландец спокоен. Молчание — вот что плохо.',
  sit: 'Вы у велопарковки, опаздываете на встречу, звоните подруге.', ph: [['Het lukt me niet.', 'У меня не получается.'], ['Kunnen we het verzetten?', 'Можем перенести?'], ['Ik bel je straks terug.', 'Я тебе скоро перезвоню.'], ['Geen probleem!', 'Без проблем!']],
  dlg: ['Вы опаздываете. Что сказать подруге?|Sorry, het lukt me niet. Kunnen we het verzetten?|Ik kom niet. Doei.|Afspraak is geen afspraak. # Извинение + предложение.', 'Подруга: «Wanneer kom je aan?»|Ik kom om acht uur aan.|Ik aankom om acht uur.|Ik kom aan om acht uur aankomen. # Приставка aan — в конец.'],
  mk: 'Напишите, что перезвоните позже.|bel;terug|Sorry, ik bel je straks terug!' });
BK('a2-6', 'Hoofdstuk 12. Er is een probleem', ['Na een uur stopte Rik. «Er is een probleem,» zei hij. «We zijn weer in Scheveningen.»', 'Joop belde zijn mama op. «Mama, waar ligt Delft?» Mama Greet lachte. «Kijk op je telefoon, Joop!»', 'Joop zette de telefoon aan. Er waren twee wegen naar Delft. Ze namen de korte weg.', 'Om vier uur kwamen ze in Delft aan. Er stonden veel fietsen bij het station. «Hier blijven we vannacht,» zei Rik. Joop keek rond. Er was een patatzaak. Natuurlijk was er een patatzaak.']);
