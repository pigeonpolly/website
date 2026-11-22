// Чтение по шагам (docs/site.md «Учебник норвежского»): NOTE(id, {sm, smru}) — пересказ главы повести (Sammendrag; smru — по-русски, только A1–A2);
// FT(id, {...}) — «📚 Fortelling»: свой короткий рассказ к уроку, серия «Solgata» (одна улица в Олесунне: пекарь Нора, таксист Юнас, пенсионерка Кари и кот Пус, школьница Софие, новичок Ахмед).
// Вопросы рассказа — блок `<урок>-f`, вне процента урока и замков (как 🎯 Бонус). gl — подсказки к словам текста.
window.NO_STORIES = window.NO_STORIES || {};
function FT(id, o) { window.NO_STORIES[id] = o; }

// ---------- A1 ----------
NOTE('a1-1', { sm: 'Pelle er en lundefugl fra Røst. Han har en stor familie og liker fisk og kaffe. Han lurer på hva som er bak havet.', smru: 'Пелле — тупик с острова Рёст. У него большая семья, он любит рыбу и кофе и думает: что там, за морем?' });
NOTE('a1-2', { sm: 'Pelle spør hvor bestefar er. Bestemor sier at han er sjømann og langt borte. Hun viser Pelle et gammelt bilde av ham.', smru: 'Пелле спрашивает, где дедушка. Бабушка говорит, что он моряк и сейчас далеко, и показывает старое фото.' });
NOTE('a1-3', { sm: 'Bestemor forteller at bestefar synger og tegner kart. Pelle savner ham og vil finne ham.', smru: 'Бабушка рассказывает, что дедушка поёт и рисует карты. Пелле скучает и решает его найти.' });
NOTE('a1-4', { sm: 'Pelle pakker en sekk. Bestemor gir ham kartet til bestefar. På kartet er det et rødt kryss i Oslo.', smru: 'Пелле собирает рюкзак. Бабушка даёт ему дедушкину карту, а на ней в Осло — красный крестик.' });
NOTE('a1-5', { sm: 'Pelle flyr til Bodø og møter måka Mari. Hun er nysgjerrig og vil være med. Nå reiser de sammen.', smru: 'Пелле летит в Будё и встречает чайку Мари. Она любопытная и хочет с ним. Теперь они путешествуют вместе.' });
NOTE('a1-6', { sm: 'Pelle og Mari tar Hurtigruten. Det er gratis for fugler. Mari er sjøsyk, men Pelle er glad: eventyret begynner.', smru: 'Пелле и Мари плывут на «Хуртигрутен» — птицам бесплатно. Мари укачивает, а Пелле счастлив: приключение начинается.' });

FT('a1-1', { title: 'Ny i Solgata',
  txt: ['Ahmed er ny i Solgata. Han kommer fra Syria, og nå bor han i Ålesund.', 'Han går ut. En dame står ved døra. «Hei!» sier hun. «Jeg heter Kari. Hva heter du?»', '«Hei! Jeg heter Ahmed,» sier han. «Hyggelig å hilse på deg!» Kari smiler. «Velkommen til Solgata!»', 'En katt kommer også. «Og hvem er det?» spør Ahmed. «Det er Pus,» sier Kari. «Han bor ikke her. Men han spiser her hver dag.»'],
  sm: 'Ahmed er ny i Solgata. Han møter naboen Kari og katten Pus. Pus spiser hos Kari hver dag.', smru: 'Ахмед — новенький на улице Сульгата. Он знакомится с соседкой Кари и котом Пусом, который каждый день приходит к ней поесть.',
  gl: { 'ny': 'новый', 'dame': 'дама, женщина', 'ved døra': 'у двери', 'Hyggelig å hilse på deg': 'приятно познакомиться', 'Velkommen': 'добро пожаловать' },
  q: [{ t: 'tf', q: ['Ahmed er ny i Solgata.|T', 'Kari er en katt.|F # Kari er en dame; katten heter Pus.', 'Pus bor hos Kari.|F # Han bor ikke der, men han spiser der.'] },
    { t: 'choice', q: ['Hvor bor Ahmed nå?|i Ålesund|i Syria|i Oslo', 'Hva sier Kari til Ahmed?|Velkommen til Solgata!|Ha det!|God natt!'] }] });

FT('a1-2', { title: 'Kari er ikke alene',
  txt: ['Kari er sytti år. Hun er pensjonist, og hun er alltid glad.', 'Hun har to barn, Lise og Per. Lise er lege i Bergen. Per er kokk i Tromsø. De er ikke hjemme ofte.', '«Er du alene?» spør Ahmed. «Nei,» sier Kari. «Jeg har Pus, jeg har naboer, og nå har jeg deg også!»', 'Ahmed ler. Han har en ny venn.'],
  sm: 'Kari er sytti år og har to barn. Barna bor langt borte, men Kari er ikke alene. Hun har Pus, naboene og Ahmed.', smru: 'Кари семьдесят лет, у неё двое детей, которые живут далеко. Но она не одна: у неё есть Пус, соседи и теперь Ахмед.',
  gl: { 'pensjonist': 'пенсионерка', 'alltid': 'всегда', 'lege': 'врач', 'kokk': 'повар', 'ofte': 'часто', 'alene': 'одна, один', 'naboer': 'соседи' },
  q: [{ t: 'tf', q: ['Kari er sytti år.|T', 'Per er lege.|F # Per er kokk; Lise er lege.', 'Kari er alene.|F # Hun har Pus, naboer og Ahmed.'] },
    { t: 'choice', q: ['Hvor bor Lise?|i Bergen|i Tromsø|i Solgata', 'Hva har Ahmed nå?|en ny venn|en ny katt|et nytt hus'] }] });

FT('a1-3', { title: 'Morgen i bakeriet',
  txt: ['Nora har et lite bakeri i Solgata. Hun står opp klokka fire hver dag.', 'Hun baker brød, boller og kanelsnurrer. Klokka sju åpner hun døra. Bakeriet lukter godt.', 'Jonas kjører taxi. Han kjøper kaffe og en bolle hver morgen. Kari kjøper brød. Ahmed kjøper ingenting — han bare snakker. Han øver på norsk.', '«Du snakker godt norsk!» sier Nora. «Takk,» sier Ahmed. «Jeg øver hver dag. Her!»'],
  sm: 'Nora har et bakeri. Hun står opp tidlig og baker. Naboene kjøper brød og kaffe, og Ahmed øver på norsk i bakeriet.', smru: 'У Норы пекарня. Она рано встаёт и печёт. Соседи покупают хлеб и кофе, а Ахмед в пекарне тренирует норвежский.',
  gl: { 'står opp': 'встаёт', 'baker': 'печёт', 'boller': 'булочки', 'kanelsnurrer': 'булочки с корицей', 'kjører taxi': 'водит такси', 'øver på': 'тренирует, упражняется в' },
  q: [{ t: 'tf', q: ['Nora står opp klokka fire.|T', 'Bakeriet åpner klokka ni.|F # Klokka sju.', 'Jonas kjøper brød.|F # Han kjøper kaffe og en bolle.'] },
    { t: 'choice', q: ['Hva gjør Ahmed i bakeriet?|Han øver på norsk.|Han baker brød.|Han kjører taxi.', 'Hva er jobben til Jonas?|Han kjører taxi.|Han er kokk.|Han er lege.'] }] });

FT('a1-4', { title: 'Hva er i sekken?',
  txt: ['Sofie er fjorten år. Hun går på skolen. I dag har hun en stor sekk.', '«Hva har du i sekken?» spør Jonas. Sofie åpner den. Det er ei bok, en penn, et eple, to brød og en matpakke.', '«To brød og en matpakke? Er du veldig sulten?» spør Jonas.', '«Nei,» sier Sofie og smiler. «Matpakka er til meg. Brødene er til endene i parken.»'],
  sm: 'Sofie har en stor sekk. Der er det mat til henne og brød til endene i parken.', smru: 'У Софие большой рюкзак: в нём еда для неё и хлеб для уток в парке.',
  gl: { 'sekk': 'рюкзак', 'penn': 'ручка', 'matpakke': 'бутерброды с собой', 'sulten': 'голодный', 'endene': 'утки (те самые)', 'parken': 'парк' },
  q: [{ t: 'tf', q: ['Sofie er fjorten år.|T', 'Sofie har tre epler.|F # Hun har et eple.', 'Brødene er til Jonas.|F # De er til endene i parken.'] },
    { t: 'choice', q: ['Hva er i sekken?|ei bok, en penn og mat|en katt|ingenting', 'Hvem er matpakka til?|til Sofie|til Jonas|til endene'] }] });

FT('a1-5', { title: 'Hvor er Pus?',
  txt: ['I dag er Kari bekymret. Pus kommer ikke. Han kommer alltid klokka åtte.', '«Hvor er Pus?» spør hun Nora. «Jeg vet ikke,» sier Nora. «Hvorfor spør du ikke Jonas? Han kjører rundt hele dagen.»', 'Om kvelden kommer Jonas. I bilen sitter Pus! «Han sover i taxien min hver dag,» sier Jonas. «I dag sover han lenge.»', 'Kari ler. «Så Pus har en jobb også!»'],
  sm: 'Pus kommer ikke klokka åtte, og Kari er bekymret. Om kvelden kommer Jonas med Pus: katten sover i taxien hans.', smru: 'Пус не пришёл в восемь, и Кари волнуется. Вечером Юнас привозит Пуса: кот спит у него в такси.',
  gl: { 'bekymret': 'обеспокоена', 'alltid': 'всегда', 'Hvorfor': 'почему', 'kjører rundt': 'ездит туда-сюда', 'I bilen': 'в машине', 'lenge': 'долго' },
  q: [{ t: 'tf', q: ['Pus kommer alltid klokka åtte.|T', 'Nora vet hvor Pus er.|F # Hun vet ikke.', 'Pus sover i taxien til Jonas.|T'] },
    { t: 'choice', q: ['Når kommer Jonas?|om kvelden|om morgenen|klokka åtte', 'Hva sier Kari til slutt?|Pus har en jobb også!|Pus er borte!|Jonas er sulten!'] }] });

FT('a1-6', { title: 'Bussen kommer ikke',
  txt: ['Ahmed har et jobbintervju klokka ti. Han står på bussholdeplassen klokka halv ni.', 'Bussen kommer ikke. Klokka er kvart på ni. Bussen kommer ikke. Klokka er ni! Ahmed er nervøs.', 'Da stopper en taxi. Det er Jonas. «Hopp inn! Jeg kjører gratis i dag,» sier han.', 'Klokka er fem på halv ti når Ahmed kommer fram. Han er ikke sen. Han er tidlig!'],
  sm: 'Bussen kommer ikke, og Ahmed er nervøs før jobbintervjuet. Jonas kjører ham gratis, og Ahmed kommer tidlig.', smru: 'Автобус не приходит, и Ахмед нервничает перед собеседованием. Юнас бесплатно подвозит его, и Ахмед приезжает заранее.',
  gl: { 'jobbintervju': 'собеседование', 'bussholdeplassen': 'автобусная остановка', 'nervøs': 'нервничает', 'Hopp inn': 'запрыгивай', 'gratis': 'бесплатно', 'kommer fram': 'добирается до места', 'sen': 'опоздавший' },
  q: [{ t: 'tf', q: ['Intervjuet er klokka ti.|T', 'Bussen kommer klokka ni.|F # Bussen kommer ikke.', 'Ahmed betaler Jonas.|F # Jonas kjører gratis.'] },
    { t: 'choice', q: ['Når kommer Ahmed fram?|klokka 9:25|klokka 10:30|klokka 9:35 # fem på halv ti = 9:25.', 'Hvem kjører Ahmed?|Jonas|Kari|Nora'] }] });

// ---------- A2 ----------
NOTE('a2-1', { sm: 'På båten møter de kokken Ole. Han kjenner kartet og husker en gammel lundefugl med rød lue. Bestefar gikk av i Trondheim.', smru: 'На корабле они встречают кока Уле. Он узнаёт карту и вспоминает старого тупика в красной шапке — тот сошёл в Тронхейме.' });
NOTE('a2-2', { sm: 'I Trondheim møter de en gammel fisker. Han så bestefar i Bergen i fjor. Mari spiser den beste vaffelen i Norge.', smru: 'В Тронхейме старый рыбак рассказывает, что видел дедушку в Бергене в прошлом году. А Мари ест лучшую вафлю в Норвегии.' });
NOTE('a2-3', { sm: 'Pelle skrev et postkort til bestemor. De bestemte seg for å fly til Bergen. Om natten tenkte Pelle på bestefar.', smru: 'Пелле написал открытку бабушке. Друзья решили лететь в Берген, а ночью Пелле думал о дедушке.' });
NOTE('a2-4', { sm: 'En storm kom, og de måtte vente. De planla å spørre måkene på fisketorget. Neste morgen fløy de mot sør.', smru: 'Пришёл шторм, и пришлось ждать. Друзья решили расспросить чаек на рыбном рынке, а утром полетели на юг.' });
NOTE('a2-5', { sm: 'I Bergen regnet det. På Bryggen møtte de en kunstner fra Riga. I skisseboka hennes var det en lundefugl med rød lue!', smru: 'В Бергене шёл дождь. На Брюггене они встретили художницу из Риги, и в её скетчбуке был тупик в красной шапке!' });
NOTE('a2-6', { sm: 'Kunstneren så bestefar i Riga i fjor. På baksiden av kartet sto det: «Hytta i fjellet. Vent på meg der.» Nå reiser de tre sammen.', smru: 'Художница видела дедушку в Риге. На обороте карты написано: «Домик в горах. Жди меня там». Теперь они путешествуют втроём.' });

FT('a2-1', { title: 'Nøkkelen',
  txt: ['Kari mistet nøkkelen sin i går. Hun lette i veska, i jakka og i hagen. Nøkkelen var borte.', 'Hun ringte på hos Ahmed. Ahmed lette også: under bilen, ved døra og i postkassa. Ingenting.', 'Da kom Sofie fra skolen. «Hva leter dere etter?» «Nøkkelen til Kari,» sa Ahmed.', 'Sofie pekte på katten. Pus satt på trappa, og rundt halsen hadde han … nøkkelen! Kari lo. Om morgenen hang hun nøkkelen på Pus, «så den ikke blir borte». Og så glemte hun det.'],
  sm: 'Kari mistet nøkkelen, og alle lette. Til slutt så Sofie nøkkelen rundt halsen til Pus. Kari hang den der selv og glemte det.', smru: 'Кари потеряла ключ, и все искали. Наконец Софие увидела ключ на шее у Пуса: Кари сама повесила его туда утром и забыла.',
  gl: { 'mistet': 'потеряла', 'lette': 'искала, искал', 'veska': 'сумка', 'borte': 'пропал', 'postkassa': 'почтовый ящик', 'trappa': 'крыльцо', 'halsen': 'шея' },
  q: [{ t: 'tf', q: ['Kari mistet nøkkelen.|T', 'Ahmed fant nøkkelen i postkassa.|F # Han fant ingenting.', 'Nøkkelen var rundt halsen til Pus.|T'] },
    { t: 'choice', q: ['Hvem så nøkkelen først?|Sofie|Ahmed|Kari', 'Hvorfor var nøkkelen på katten?|Kari hang den der selv.|Pus stjal den.|Sofie gjemte den.'] }] });

FT('a2-2', { title: 'Den gule jakka',
  txt: ['Jonas kjøpte en ny jakke. Den var stor, gul og veldig dyr. «Nå ser jeg ut som en ekte fisker,» sa han.', 'Nora syntes at jakka var fin. Kari syntes at den var litt for gul. Sofie syntes at den var helt fantastisk.', 'Neste dag regnet det. Alle hadde mørke, våte jakker — bare ikke Jonas. Den gule jakka var tørr og varm.', '«Den store, gule jakka er den beste jakka i hele gata,» sa Kari. Hun kjøpte en selv dagen etter. I rødt.'],
  sm: 'Jonas kjøpte en stor, gul jakke. Ikke alle likte fargen, men i regnet var den best. Til slutt kjøpte Kari en også — i rødt.', smru: 'Юнас купил большую жёлтую куртку. Не всем понравился цвет, но в дождь она оказалась лучшей. В итоге Кари купила такую же — красную.',
  gl: { 'ekte': 'настоящий', 'syntes': 'считала, считал', 'litt for': 'слишком', 'mørke': 'тёмные', 'våte': 'мокрые', 'tørr': 'сухая', 'dagen etter': 'на следующий день' },
  q: [{ t: 'tf', q: ['Jakka var billig.|F # Den var veldig dyr.', 'Kari syntes at jakka var litt for gul.|T', 'Kari kjøpte en gul jakke.|F # Hun kjøpte en i rødt.'] },
    { t: 'choice', q: ['Hvordan var jakka til Jonas i regnet?|tørr og varm|våt og kald|liten og mørk', 'Hva sa Jonas om jakka?|Nå ser jeg ut som en ekte fisker.|Den er for gul.|Den er for liten.'] }] });

FT('a2-3', { title: 'Første dag på jobb',
  txt: ['Ahmed fikk jobben! I går var den første dagen hans på et lager i Ålesund.', 'Han sto opp klokka fem, spiste frokost og laget matpakke. Han tok bussen klokka seks. Den kom presis.', 'På jobben møtte han sjefen, Turid. Hun viste ham lageret og forklarte alt. Ahmed forsto nesten alt. Det har han aldri gjort før!', 'Om kvelden fortalte han alt til Kari. «Har du spist?» spurte hun. «Nei,» sa Ahmed. «Jeg har vært for glad til å spise.»'],
  sm: 'Ahmed fikk jobb på et lager. Den første dagen gikk bra, og han forsto nesten alt. Han var så glad at han glemte å spise.', smru: 'Ахмед получил работу на складе. Первый день прошёл хорошо, он понял почти всё — и от радости забыл поесть.',
  gl: { 'lager': 'склад', 'frokost': 'завтрак', 'presis': 'точно вовремя', 'sjefen': 'начальница', 'forklarte': 'объяснила', 'forsto': 'понял', 'for glad til å': 'слишком рад, чтобы' },
  q: [{ t: 'tf', q: ['Ahmed fikk jobb på et lager.|T', 'Bussen kom for sent.|F # Den kom presis.', 'Ahmed har spist middag.|F # Han har vært for glad til å spise.'] },
    { t: 'choice', q: ['Hvem er Turid?|sjefen til Ahmed|naboen til Kari|en lege', 'Når tok Ahmed bussen?|klokka seks|klokka fem|klokka sju'] }] });

FT('a2-4', { title: 'Snart 17. mai',
  txt: ['Snart er det 17. mai. Alle i Solgata skal feire. Nora skal bake hundre boller. Jonas skal pynte taxien med flagg.', 'Sofie skal gå i barnetoget med skolen. «Du må ha bunad!» sier Kari. «Jeg har ikke bunad,» sier Sofie. «Da kan du låne min. Den er gammel, men fin.»', 'Ahmed vet ikke hva han skal gjøre. «Hva gjør man på 17. mai?» spør han. «Man spiser is, roper hurra og vifter med flagg,» sier Nora. «Det kan du!»', '«Det kommer til å bli den beste dagen i år,» sier Kari.'],
  sm: 'Alle i Solgata planlegger 17. mai. Sofie skal låne bunaden til Kari, og Ahmed lærer hva man gjør på nasjonaldagen.', smru: 'Вся улица готовится к 17 мая. Софие наденет бунад Кари, а Ахмед узнаёт, что делают в национальный праздник.',
  gl: { 'feire': 'праздновать', 'pynte': 'украсить', 'barnetoget': 'детское шествие', 'bunad': 'народный костюм', 'låne': 'одолжить', 'roper hurra': 'кричат ура', 'vifter med flagg': 'машут флажками' },
  q: [{ t: 'tf', q: ['Nora skal bake hundre boller.|T', 'Sofie har en bunad.|F # Hun skal låne bunaden til Kari.', 'På 17. mai spiser man is og roper hurra.|T'] },
    { t: 'choice', q: ['Hva skal Jonas gjøre?|pynte taxien med flagg|bake boller|gå i barnetoget', 'Hva sier Kari om dagen?|Det kommer til å bli den beste dagen i år.|Det kommer til å regne.|Vi må jobbe.'] }] });

FT('a2-5', { title: 'Hos legen',
  txt: ['Kari var syk i forrige uke. Hun hadde vondt i halsen og i hodet. Ahmed ringte legekontoret for henne og bestilte time hos fastlegen.', 'På onsdag tok de bussen til legekontoret. Det ligger i sentrum, ved siden av biblioteket, mellom en kafé og en butikk.', 'De satt på venterommet i en halv time. Kari leste et blad, og Ahmed lærte nye ord på mobilen.', 'Legen sa at det var en forkjølelse. «Gå hjem og hvil. Drikk mye te,» sa hun. Kari smilte: «Te? Hjemme har jeg bare kaffe.»'],
  sm: 'Kari var syk, og Ahmed bestilte time hos fastlegen. Legen sa at det var en forkjølelse, og at Kari må drikke te.', smru: 'Кари заболела, и Ахмед записал её к семейному врачу. Врач сказала, что это простуда и надо пить чай.',
  gl: { 'vondt i halsen': 'болит горло', 'legekontoret': 'кабинет врача', 'bestilte time': 'записал на приём', 'fastlegen': 'семейный врач', 'venterommet': 'приёмная', 'et blad': 'журнал', 'forkjølelse': 'простуда', 'hvil': 'отдыхай' },
  q: [{ t: 'tf', q: ['Kari hadde vondt i halsen.|T', 'Legekontoret ligger ved siden av biblioteket.|T', 'Legen sa at Kari måtte på sykehus.|F # Det var en forkjølelse.'] },
    { t: 'choice', q: ['Hvor lenge satt de på venterommet?|en halv time|to timer|fem minutter', 'Hva har Kari hjemme?|bare kaffe|bare te|ingenting'] }] });

FT('a2-6', { title: 'Hvem sin sykkel?',
  txt: ['En morgen sto det en rød sykkel foran bakeriet til Nora. Ingen visste hvem sin sykkel det var.', '«Er det sykkelen din?» spurte Nora Jonas. «Nei, min er svart,» sa han. «Kanskje den er Sofies?» Men Sofies sykkel var blå.', 'Kari sa at hennes sykkel sto i kjelleren, og Ahmed hadde ingen sykkel. Mysteriet var stort.', 'Om ettermiddagen kom postmannen. «Takk for at dere passet på sykkelen min!» sa han. «Jeg tok bussen hjem i går, fordi det regnet så mye.»'],
  sm: 'En rød sykkel sto foran bakeriet, og ingen i gata eide den. Til slutt kom postmannen og hentet sykkelen sin.', smru: 'У пекарни стоял красный велосипед, и никто из соседей его не узнал. В конце концов почтальон пришёл за своим велосипедом.',
  gl: { 'sykkel': 'велосипед', 'hvem sin': 'чей', 'kjelleren': 'подвал', 'Mysteriet': 'загадка', 'ettermiddagen': 'после обеда', 'postmannen': 'почтальон', 'passet på': 'присмотрели за' },
  q: [{ t: 'tf', q: ['Sykkelen var rød.|T', 'Sykkelen til Sofie er rød.|F # Den er blå.', 'Ahmed har ingen sykkel.|T'] },
    { t: 'choice', q: ['Hvem sin sykkel var det?|postmannen sin|Jonas sin|Kari sin', 'Hvorfor tok postmannen bussen?|Det regnet så mye.|Sykkelen var ødelagt.|Han var syk.'] }] });

// ---------- B1 ----------
NOTE('b1-1', { sm: 'På en kafé i Bergen studerte vennene kartet. De mente at hytta lå i Jotunheimen, og bestemte seg for å ta toget til Finse og gå derfra.' });
NOTE('b1-2', { sm: 'De tok toget over fjellet til Finse. I snøen fant Pelle en rød knapp med et anker — bestefar hadde gått der! Mari så spor i snøen.' });
NOTE('b1-3', { sm: 'Etter en lang dag møtte de elgen Erik. Han kjente både hytta og bestefar. De sov under stjernene ved siden av ham.' });
NOTE('b1-4', { sm: 'De fant den gamle hytta. På bordet lå et brev til Pelle: bestefar skrev at han ventet i Oslo, der det røde krysset var tegnet.' });
NOTE('b1-5', { sm: 'De gikk ned fra fjellet, og Erik fulgte dem til stasjonen. Pelle lovet å komme tilbake, men nå måtte de til Oslo.' });
NOTE('b1-6', { sm: 'Toget var forsinket på grunn av snø. Mens de ventet, lurte de på hva det røde krysset betydde. Sent om kvelden kom de til Oslo.' });

FT('b1-1', { title: 'En hund på deling',
  txt: ['Sofie vil ha en hund. Hun har spurt mamma hundre ganger, men mamma sier alltid nei, fordi leiligheten er liten.', 'En dag kommer Sofie hjem med en plan. «Hvis jeg går tur med hunden hver dag, og hvis jeg betaler maten selv, kan jeg få en hund da?» Mamma sukker. «Selv om du lover det, vet jeg at det er jeg som kommer til å gjøre alt.»', 'Da ringer det på døra. Det er Kari. «Jeg lurer på om noen kan hjelpe meg,» sier hun. «Legen sier at jeg må gå mer tur, men jeg liker ikke å gå alene. Og naboen min har en hund som heter Bamse. Han trenger noen som går tur med ham mens hun er på jobb.»', 'Sofie ser på mamma. Mamma ser på Sofie. «Greit,» sier mamma til slutt. «Det er en hund jeg kan leve med: en hund som bor hos noen andre.»'],
  sm: 'Sofie vil ha hund, men mamma sier nei fordi leiligheten er liten. Så trenger naboens hund Bamse noen som går tur med ham, og Sofie og Kari kan gå sammen.',
  gl: { 'leiligheten': 'квартира', 'sukker': 'вздыхает', 'Selv om': 'даже если', 'lurer på om': 'хочет узнать, не…', 'går tur': 'гуляет, выгуливает', 'mens': 'пока', 'Greit': 'ладно' },
  q: [{ t: 'tf', q: ['Mamma sier nei fordi leiligheten er liten.|T', 'Kari vil ha en hund selv.|F # Hun vil gå tur, men ikke alene.', 'Bamse bor hos Sofie.|F # Han bor hos naboen til Kari.'] },
    { t: 'choice', q: ['Hvorfor må Kari gå mer tur?|Legen sier det.|Hun er lei av Pus.|Hun vil se byen.', 'Hva slags hund kan mamma leve med?|en hund som bor hos noen andre|en liten hund|en hund som ikke bjeffer'] }] });

FT('b1-2', { title: 'Fisketuren',
  txt: ['I helgen dro Jonas og Ahmed på fisketur. De sto opp klokka fem, tok båten til Jonas og kjørte ut fjorden.', 'Ahmed hadde aldri fisket før. Han satt stille i en time, men ingenting skjedde. Jonas fikk tre fisker. Ahmed fikk ingen.', 'Så plutselig bøyde stanga seg. Ahmed dro og dro. Han trodde at det var en stor torsk. Men det var en gammel sko!', 'Jonas lo så han nesten falt i vannet. Men Ahmed tok skoen med hjem og satte blomster i den. Nå står den i vinduet hans, og alle i gata kjenner historien.'],
  sm: 'Jonas og Ahmed dro på fisketur. Jonas fikk tre fisker, men Ahmed fikk bare en gammel sko. Nå står skoen med blomster i vinduet hans.',
  gl: { 'fisketur': 'рыбалка', 'fjorden': 'фьорд', 'skjedde': 'случилось', 'stanga': 'удочка', 'dro og dro': 'тянул и тянул', 'torsk': 'треска', 'falt': 'упал' },
  q: [{ t: 'tf', q: ['Ahmed hadde fisket mange ganger før.|F # Han hadde aldri fisket.', 'Jonas fikk tre fisker.|T', 'Ahmed kastet skoen.|F # Han satte blomster i den.'] },
    { t: 'choice', q: ['Hva fikk Ahmed?|en gammel sko|en stor torsk|tre fisker', 'Hvor står skoen nå?|i vinduet til Ahmed|i båten|i bakeriet'] }] });

FT('b1-3', { title: 'Nora har forelsket seg',
  txt: ['Det går et rykte i Solgata: Nora skal gifte seg! Kari hørte det fra frisøren, og frisøren hørte det fra postmannen.', 'Alle gledet seg. Sofie bestemte seg for å lage et kort. Jonas kledde seg i dress. Kari satte seg ved vinduet for å se brudgommen.', 'Men da de spurte Nora, ble hun helt rød. «Gifte meg? Nei! Jeg har forelsket meg — i en ny ovn! Den kommer i morgen.»', 'Neste dag kom ovnen. Den var stor, blank og italiensk. Og alle i gata var enige: det var et vakkert par.'],
  sm: 'Hele gata trodde at Nora skulle gifte seg. Men Nora hadde bare forelsket seg i en ny ovn til bakeriet.',
  gl: { 'rykte': 'слух', 'gifte seg': 'выйти замуж, жениться', 'frisøren': 'парикмахер', 'kledde seg': 'оделся', 'brudgommen': 'жених', 'blank': 'блестящая', 'et vakkert par': 'красивая пара' },
  q: [{ t: 'tf', q: ['Kari hørte ryktet fra frisøren.|T', 'Nora skal gifte seg.|F # Hun har forelsket seg i en ny ovn.', 'Ovnen var italiensk.|T'] },
    { t: 'choice', q: ['Hva gjorde Jonas?|kledde seg i dress|laget et kort|bakte en kake', 'Hvorfor ble Nora rød?|Alle trodde at hun skulle gifte seg.|Ovnen var for varm.|Hun var syk.'] }] });

FT('b1-4', { title: 'Kaketyven',
  txt: ['Hver natt forsvant det kaker fra bakeriet. Døra ble låst, og vinduene ble lukket, men om morgenen var kakene borte.', 'Politiet ble ringt. Det ble tatt bilder, og det ble skrevet en rapport. Men ingen tyv ble funnet.', 'Til slutt ble et lite kamera satt opp. Neste morgen så de på filmen sammen. Klokka tre om natten ble et lite vindu skjøvet opp … og inn kom Pus!', 'Saken var løst. Vinduet ble reparert, og Pus fikk en kanelsnurr hver morgen — «så han lar resten være i fred,» sa Nora.'],
  sm: 'Kaker forsvant fra bakeriet hver natt. Et kamera ble satt opp, og tyven var Pus. Nå får han en kanelsnurr hver morgen.',
  gl: { 'forsvant': 'исчезали', 'låst': 'заперта', 'tyv': 'вор', 'funnet': 'найден', 'satt opp': 'установлена', 'skjøvet opp': 'приоткрыто', 'Saken': 'дело', 'løst': 'раскрыто' },
  q: [{ t: 'tf', q: ['Døra ble ikke låst.|F # Den ble låst.', 'Politiet fant tyven.|F # Ingen tyv ble funnet.', 'Pus kom inn gjennom et lite vindu.|T'] },
    { t: 'choice', q: ['Hvordan ble saken løst?|med et kamera|med en hund|av politiet', 'Hva får Pus nå?|en kanelsnurr hver morgen|ingenting|fisk'] }] });

FT('b1-5', { title: 'Den beste bollen',
  txt: ['En ny kafé åpnet i gata ved siden av. Den var større enn bakeriet til Nora, den var mer moderne, og kaffen var billigere.', 'De første dagene var bakeriet tomt. Nora ble mer og mer stille. «Kanskje de er bedre enn meg,» sa hun.', 'Da bestemte Solgata seg for å teste. Sofie, Kari, Jonas og Ahmed spiste kanelsnurrer begge steder. Jo flere de spiste, desto sikrere ble de.', '«Den nye kaféen har de fineste koppene,» sa Kari. «Men Nora har de beste bollene i hele Ålesund.» Etter en uke var køen foran bakeriet lengre enn noen gang.'],
  sm: 'En ny, moderne kafé åpnet, og Nora mistet kunder. Naboene testet begge steder og bestemte at Nora har de beste bollene.',
  gl: { 'tomt': 'пустой', 'mer og mer': 'всё более', 'begge steder': 'в обоих местах', 'Jo flere': 'чем больше', 'desto sikrere': 'тем увереннее', 'køen': 'очередь', 'enn noen gang': 'чем когда-либо' },
  q: [{ t: 'tf', q: ['Den nye kaféen var mindre enn bakeriet.|F # Den var større.', 'Kaffen i den nye kaféen var billigere.|T', 'Til slutt var køen foran bakeriet lengre enn før.|T'] },
    { t: 'choice', q: ['Hva har den nye kaféen best?|koppene|bollene|kaffen', 'Hva sa Nora de første dagene?|Kanskje de er bedre enn meg.|Jeg er best!|Jeg stenger.'] }] });

FT('b1-6', { title: 'Strømbrudd',
  txt: ['Det var storm i Ålesund. Derfor gikk strømmen i hele Solgata klokka sju om kvelden.', 'Kari hadde ingen lommelykt. Dessuten var telefonen hennes tom. Likevel var hun ikke redd, for hun hadde både stearinlys og fyrstikker.', 'Først kom Ahmed med en lykt. Etterpå kom Sofie med kakao, og til slutt kom Nora med boller. Enten kunne de sitte alene i mørket, eller så kunne de sitte sammen.', 'De valgte det siste. Da strømmen kom tilbake klokka elleve, var det ingen som ville gå hjem.'],
  sm: 'En storm tok strømmen i Solgata. Naboene samlet seg hos Kari med lys, kakao og boller, og ingen ville gå hjem da strømmen kom tilbake.',
  gl: { 'strømmen': 'электричество', 'lommelykt': 'фонарик', 'tom': 'разряжен', 'stearinlys': 'свечи', 'fyrstikker': 'спички', 'en lykt': 'фонарь', 'valgte': 'выбрали' },
  q: [{ t: 'tf', q: ['Strømmen gikk på grunn av storm.|T', 'Kari var redd.|F # Likevel var hun ikke redd.', 'Strømmen kom tilbake klokka ni.|F # Klokka elleve.'] },
    { t: 'choice', q: ['Hva hadde Kari?|stearinlys og fyrstikker|en lommelykt|en full telefon', 'Hvem kom med kakao?|Sofie|Ahmed|Nora'] }] });

// ---------- B2 ----------
NOTE('b2-1', { sm: 'Det røde krysset var på Bygdøy, ved museet med den gamle polarskuta. Pelle var nervøs. Museet var stengt, så de måtte vente.' });
NOTE('b2-2', { sm: 'Vakten på museet husket bestefar. Han hadde sittet på masten av Fram i mange år, men skadet vingen i en storm. Vakten ga Pelle en adresse.' });
NOTE('b2-3', { sm: 'På adressen bodde en eldre dame. Hun fortalte at bestefar hadde bodd der hele vinteren, og at han satt på taket av Operaen hver kveld.' });
NOTE('b2-4', { sm: 'Ved solnedgang fant Pelle bestefar på operataket. Bestefar kjente ham igjen med en gang, og de gråt av glede.' });
NOTE('b2-5', { sm: 'Bestefar kunne ikke fly hjem. Det ble skrevet en høflig e-post til Hurtigruten, og kapteinen svarte at fugler reiser gratis.' });
NOTE('b2-6', { sm: 'Pelle og bestefar kom hjem til Røst. Bestemor ventet på klippen, og det ble fest. Nå visste Pelle hva som var bak havet.' });

FT('b2-1', { title: 'Du kommer vel?',
  txt: ['— Du kommer vel på dugnaden i morgen, Jonas?', '— Dugnad? Det er jo søndag! Søndag er hviledag, vet du.', '— Nå skal du ikke klage, da. Det er bare to timer. Og Nora har visst bakt vafler.', '— Vafler? Ja vel. Da kommer jeg jo, selvfølgelig. Jeg er ikke umulig heller, altså.', '— Nei da. Du er bare litt treg til å si ja. Klokka ti, da!'],
  sm: 'Kari spør om Jonas kommer på dugnaden. Først klager han fordi det er søndag, men da han hører om vaflene, sier han ja.',
  gl: { 'dugnaden': 'общая уборка с соседями', 'hviledag': 'день отдыха', 'klage': 'жаловаться', 'visst': 'говорят, вроде бы', 'umulig': 'невозможный', 'treg': 'медленный' },
  q: [{ t: 'tf', q: ['Dugnaden er på søndag.|T', 'Jonas vil gjerne komme med en gang.|F # Først klager han.', 'Nora har visst bakt vafler.|T'] },
    { t: 'choice', q: ['Что значит «Du kommer vel?»|Ты ведь придёшь?|Ты придёшь хорошо?|Ты не придёшь.', 'Hvorfor sier Jonas ja?|på grunn av vaflene|fordi han liker å jobbe|fordi det regner'] }] });

FT('b2-2', { title: 'Brevet på loftet',
  txt: ['Da Kari ryddet på loftet, fant hun en gammel, gulnet konvolutt. Den hadde aldri blitt åpnet.', 'Brevet var fra Leif, en gutt hun hadde møtt på en sommerleir i 1972. Han hadde skrevet at han ville se henne igjen. Men brevet hadde havnet i en eske, og Kari hadde aldri lest det.', 'Sofie, som var en ivrig detektiv, fant ut hvem Leif var. Han bodde fortsatt i Ålesund — tre gater unna.', 'En uke senere satt to smilende pensjonister i bakeriet til Nora. «Du er femti år for sen,» sa Leif. «Bedre sent enn aldri,» svarte Kari.'],
  sm: 'Kari fant et uåpnet brev fra 1972. Sofie fant brevskriveren, Leif, som bodde tre gater unna. Nå drikker de kaffe sammen.',
  gl: { 'ryddet': 'разбирала', 'loftet': 'чердак', 'gulnet': 'пожелтевший', 'sommerleir': 'летний лагерь', 'havnet': 'оказалось', 'eske': 'коробка', 'ivrig': 'увлечённый', 'unna': 'отсюда (на расстоянии)' },
  q: [{ t: 'tf', q: ['Brevet hadde aldri blitt åpnet.|T', 'Leif bodde i Bergen.|F # Tre gater unna, i Ålesund.', 'Sofie fant ut hvem Leif var.|T'] },
    { t: 'choice', q: ['Når hadde Kari møtt Leif?|i 1972|i fjor|i 2002', 'Hva svarte Kari?|Bedre sent enn aldri.|Du er for sen.|Hvem er du?'] }] });

FT('b2-3', { title: 'Elgen i parken',
  txt: ['Det hele begynte da Jonas sa til Nora at han hadde sett en elg i parken.', 'Nora fortalte Kari at Jonas hadde sett en elg. Kari sa til postmannen at det visst var en elg i byen. Postmannen spurte Sofie om hun hadde hørt om elgen som gikk rundt i sentrum.', 'Sofie skrev på nettet at en elg hadde stjålet en sykkel. Om ettermiddagen ringte avisen og spurte hvor elgen var nå.', 'Jonas måtte forklare at han hadde sett en stor, brun hund. Uten briller. Avisen lurte på om han ville betale for en annonse i stedet.'],
  sm: 'Jonas sa at han hadde sett en elg. Historien ble større for hver person, og til slutt ringte avisen. Men det var bare en stor hund.',
  gl: { 'Det hele': 'всё это', 'elg': 'лось', 'visst': 'якобы', 'på nettet': 'в интернете', 'stjålet': 'украл', 'avisen': 'газета', 'annonse': 'объявление' },
  q: [{ t: 'tf', q: ['Jonas så en elg.|F # Han så en stor, brun hund.', 'Sofie skrev at elgen hadde stjålet en sykkel.|T', 'Avisen ringte.|T'] },
    { t: 'choice', q: ['Hvorfor tok Jonas feil?|Han hadde ikke briller.|Det var mørkt.|Han var trøtt.', 'Hva spurte postmannen Sofie om?|om hun hadde hørt om elgen|om hun hadde en sykkel|hvor parken var'] }] });

FT('b2-4', { title: 'Ord som tog',
  txt: ['Ahmed elsker norske ord, spesielt de lange. Hver dag skriver han et nytt ord i notatboka si.', 'I dag fant han «sommerfuglsamling» på biblioteket, «kanelsnurrbakeri» i Solgata og «fiskeboller» i butikken. «Ord som tog,» sier han. «Man kobler bare vogn etter vogn.»', 'Men en dag skrev han på en lapp til Nora: «Takk for de gode ananas biter.» Nora lo høyt. «Bitende ananas? Det høres farlig ut!»', 'Siden da skriver Ahmed alltid sammen. Sofie har gitt ham et nytt kallenavn: «Særskrivingspolitiet».'],
  sm: 'Ahmed samler lange norske ord. En gang skrev han et ord i to deler ved en feil, og det ble morsomt. Nå skriver han alltid sammensatte ord i ett.',
  gl: { 'notatboka': 'блокнот', 'sommerfuglsamling': 'коллекция бабочек', 'kobler': 'сцепляет', 'vogn': 'вагон', 'lapp': 'записка', 'Bitende': 'кусающийся', 'kallenavn': 'прозвище' },
  q: [{ t: 'tf', q: ['Ahmed liker lange ord.|T', '«Ananas biter» betyr små biter av ananas.|F # Раздельно — «ананас кусается».', 'Sofie kaller Ahmed «Særskrivingspolitiet».|T'] },
    { t: 'choice', q: ['Hvordan beskriver Ahmed lange ord?|ord som tog|ord som fjell|ord som slanger', 'Hvordan skriver Ahmed nå?|sammensatte ord i ett|bare korte ord|på engelsk'] }] });

FT('b2-5', { title: 'Klagen',
  txt: ['Gatelyset utenfor huset til Kari hadde vært mørkt i tre uker. Kari var sint. «Jeg skriver til kommunen,» sa hun. «Og jeg skal si hva jeg mener!»', 'Det første utkastet var kort: «Fiks lyset NÅ!!!» Ahmed foreslo forsiktig at hun kanskje kunne skrive litt høfligere.', 'Det andre utkastet lød slik: «Hei! Gatelyset i Solgata 12 har dessverre ikke virket på tre uker. Det er mørkt og litt utrygt, særlig for eldre. Jeg vil gjerne vite når det kan bli reparert. På forhånd takk. Med vennlig hilsen, Kari Vik»', 'Svaret kom dagen etter: «Takk for beskjed! Vi reparerer lyset på torsdag.» Kari var nesten skuffet. Hun hadde gledet seg til å være sint.'],
  sm: 'Gatelyset var ødelagt, og Kari ville skrive en sint melding. Med hjelp fra Ahmed skrev hun en høflig e-post, og kommunen svarte raskt.',
  gl: { 'Gatelyset': 'уличный фонарь', 'kommunen': 'муниципалитет', 'utkastet': 'черновик', 'foreslo': 'предложил', 'høfligere': 'вежливее', 'utrygt': 'небезопасно', 'beskjed': 'сообщение', 'skuffet': 'разочарована' },
  q: [{ t: 'tf', q: ['Gatelyset hadde vært mørkt i tre uker.|T', 'Kari sendte det første utkastet.|F # Ahmed foreslo å skrive høfligere.', 'Kommunen svarte etter en måned.|F # Dagen etter.'] },
    { t: 'choice', q: ['Hvorfor var Kari nesten skuffet?|Hun hadde gledet seg til å være sint.|Lyset ble ikke reparert.|Svaret var uhøflig.', 'Hvordan begynner den høflige e-posten?|Hei!|Fiks lyset!|Kjære herr kommune!'] }] });

FT('b2-6', { title: 'Æ e glad',
  txt: ['Jonas fikk besøk av fetteren sin, Tor-Arne, fra Tromsø. Tor-Arne snakket nordnorsk, høyt og fort.', '«Æ e så glad for å vær her!» sa han i bakeriet. Ahmed forsto ingenting. «Er han dansk?» hvisket han til Nora.', 'Nora lo. «Nei, han er like norsk som meg. Æ betyr jeg, og e betyr er. Hør på melodien — den går opp og ned som bølger.»', 'Etter en uke kunne Ahmed si «Æ e glad» uten å le. Tor-Arne var stolt. «Du snakke jo nordnorsk no!» sa han. Ahmed var ikke sikker på om det var et kompliment.'],
  sm: 'Jonas fikk besøk av fetteren fra Tromsø, som snakket nordnorsk. Ahmed trodde først at han var dansk, men lærte litt av dialekten.',
  gl: { 'fetteren': 'двоюродный брат', 'fort': 'быстро', 'hvisket': 'прошептал', 'like norsk som': 'такой же норвежец, как', 'melodien': 'мелодия', 'bølger': 'волны', 'stolt': 'гордый' },
  q: [{ t: 'tf', q: ['Tor-Arne kommer fra Tromsø.|T', 'Ahmed trodde at Tor-Arne var svensk.|F # Han trodde at han var dansk.', '«Æ» betyr «jeg».|T'] },
    { t: 'choice', q: ['Hvordan er melodien i nordnorsk, ifølge Nora?|opp og ned som bølger|helt flat|som en engelsk sang', 'Hva kunne Ahmed etter en uke?|si «Æ e glad»|snakke dansk|synge på samisk'] }] });

// ---------- C1 ----------
NOTE('c1-1', { sm: 'Høsten kom til Røst. Et tungt, byråkratisk brev fra Polarinstituttet ba bestefar om hjelp med de gamle kartene. Han viste Pelle et kart over Svalbard med en øy uten navn.' });
NOTE('c1-2', { sm: 'Bestefar fortalte om forliset i 1998. En ukjent øy full av lundefugler reddet ham, men ingen trodde ham. Pelle bestemte seg for å finne øya.' });
NOTE('c1-3', { sm: 'Bestefar var for gammel til å reise. Vennene fikk bli med på forskningsskipet Polarlys, og bestefar ga Pelle den røde lua si.' });
NOTE('c1-4', { sm: 'Polarlys la ut fra Tromsø. Pelle lovet å ta vare på kartet og fant ut at bestefar hadde skrevet posisjonen langs kanten — men det siste tallet manglet.' });
NOTE('c1-5', { sm: 'Mannskapet diskuterte om øya burde bli kjent. Forskning sto mot fuglenes fred, og de ble enige om et kompromiss: publisere funnet, men holde posisjonen hemmelig.' });
NOTE('c1-6', { sm: 'En storm ved iskanten truet skipet. Mari fløy ut i mørket og fant en åpning i isen. Hun reddet skipet og ble kalt «Admiral Mari».' });

FT('c1-1', { title: 'Brevet fra NAV',
  txt: ['En dag lå det et brev fra NAV i postkassa til Ahmed. Han leste det tre ganger og forsto stadig mindre.', '«Det vises til Deres søknad av 3. mars. Etter en helhetlig vurdering er det fattet vedtak om innvilgelse av stønad til norskopplæring. Vedkommende anmodes om å foreta registrering innen fjorten dager.»', 'Han gikk til Sofie, som nettopp hadde fått toppkarakter i norsk. Hun leste, rynket pannen og oversatte: «Vi har sagt ja til søknaden din. Du får penger til norskkurs. Registrer deg innen to uker.»', 'Ahmed stirret på henne. «Står det virkelig så lite?» «Ja,» sa Sofie. «Resten er bare innpakning.» Samme kveld meldte han seg på kurset — og skrev et kort, høflig takkebrev. På klarspråk.'],
  sm: 'Ahmed fikk et tungt brev fra NAV. Sofie oversatte det til klarspråk: søknaden om penger til norskkurs var innvilget.',
  gl: { 'stadig mindre': 'всё меньше', 'helhetlig vurdering': 'всесторонняя оценка', 'fattet vedtak': 'принято решение', 'innvilgelse': 'удовлетворение (заявления)', 'stønad': 'пособие', 'anmodes': 'просят', 'toppkarakter': 'высшая оценка', 'rynket pannen': 'нахмурилась', 'innpakning': 'обёртка', 'meldte han seg på': 'он записался' },
  q: [{ t: 'tf', q: ['Ahmed forsto brevet med en gang.|F # Han forsto stadig mindre.', 'Søknaden ble innvilget.|T', 'Ahmed må registrere seg innen fjorten dager.|T'] },
    { t: 'choice', q: ['Hva er «resten» av brevet, ifølge Sofie?|bare innpakning|viktige regler|en feil', 'Hvordan skrev Ahmed takkebrevet?|kort, høflig og på klarspråk|langt og formelt|på engelsk'] }] });

FT('c1-2', { title: 'Det fargerike gjerdet',
  txt: ['En morgen var det gamle, grå gjerdet i Solgata malt i alle regnbuens farger. Ingen hadde sett noe.', '«Det var ikke jeg som gjorde det,» sa Jonas med en gang. «Og det var i hvert fall ikke Pus,» la Kari til. «Han har ikke tomler.»', 'Det var Sofie som fant det første sporet: en liten, gul flekk på dørhåndtaket til bakeriet. Og det var Ahmed som fant det andre: en tom malingsboks bak søppelkassen — med «Nora» skrevet på lokket.', 'Nora innrømmet alt. «Det var gråheten jeg ikke orket mer,» sa hun. «Aldri har jeg malt noe så stort. Og aldri har jeg sovet så godt etterpå.» Kommunen lot gjerdet være. Nå er det gatas mest fotograferte attraksjon.'],
  sm: 'En natt ble gjerdet i Solgata malt i alle farger. Sofie og Ahmed fant sporene, og det viste seg at det var Nora som hadde gjort det.',
  gl: { 'gjerdet': 'забор', 'regnbuens farger': 'цвета радуги', 'i hvert fall': 'во всяком случае', 'tomler': 'большие пальцы', 'sporet': 'улика', 'flekk': 'пятно', 'dørhåndtaket': 'дверная ручка', 'lokket': 'крышка', 'innrømmet': 'призналась', 'gråheten': 'серость', 'orket': 'могла выносить' },
  q: [{ t: 'tf', q: ['Jonas malte gjerdet.|F # Det var Nora.', 'Det var Sofie som fant det første sporet.|T', 'Kommunen malte gjerdet grått igjen.|F # Kommunen lot det være.'] },
    { t: 'choice', q: ['Hva sto det på lokket?|Nora|Kari|Solgata', 'Hvorfor malte Nora gjerdet?|Hun orket ikke gråheten mer.|Kommunen ba henne om det.|For å selge maling.'] }] });

FT('c1-3', { title: 'Lottotallene',
  txt: ['Hver lørdag i førti år hadde Kari spilt Lotto med de samme tallene: bursdagene til barna og nummeret på det første huset hennes.', 'En lørdag glemte hun det. Hun satt hos Leif og drakk kaffe, og hun tenkte ikke på Lotto i det hele tatt.', 'Om kvelden kom tallene på TV. Det var hennes tall. Alle sju. «Hadde jeg bare husket det!» ropte hun. «Om jeg bare hadde levert kupongen!» Hun regnet: hadde hun spilt, ville hun vært millionær.', 'Leif tok hånden hennes. «Hvis du hadde spilt, hadde du sittet hjemme i kveld og ventet på tallene,» sa han. «Og ikke her.» Kari tenkte seg om lenge. Så skrudde hun av TV-en. «Jeg skulle ønske jeg kunne si at det ikke betyr noe,» sa hun. «Men det betyr litt mindre enn jeg trodde.»'],
  sm: 'En lørdag glemte Kari å spille Lotto for første gang på førti år — og tallene hennes kom opp. Leif minnet henne om at hun da var sammen med ham.',
  gl: { 'spilt Lotto': 'играла в лото', 'i det hele tatt': 'вообще', 'levert kupongen': 'сдала купон', 'regnet': 'посчитала', 'millionær': 'миллионерша', 'tenkte seg om': 'задумалась', 'skrudde hun av': 'выключила' },
  q: [{ t: 'tf', q: ['Kari brukte de samme tallene i førti år.|T', 'Kari vant en million.|F # Hun glemte å spille.', 'Kari var hos Leif den lørdagen.|T'] },
    { t: 'choice', q: ['Hvilket uttrykk viser at Kari angrer?|Hadde jeg bare husket det!|Jeg er glad.|Det var flaks.', 'Hva gjorde Kari til slutt?|skrudde av TV-en|ringte Norsk Tipping|gråt hele natten'] }] });

FT('c1-4', { title: 'Taxisjåfør-metoden',
  txt: ['Ahmed hadde strøket på oppkjøringen to ganger. Første gang glemte han å slå på blinklyset. Andre gang kjørte han inn i rundkjøringen uten å se seg for.', 'Jonas fant ut at nok var nok. «Jeg setter i gang med deg i morgen,» sa han. «Taxisjåfør-metoden. Den går ut på én ting: ro.»', 'I tre uker kjørte de rundt i Ålesund hver kveld. Jonas pekte ut farer, la merke til alt og holdt ut med alle spørsmålene. «Slå av radioen,» sa han. «Og se deg for. Igjen.»', 'Tredje gang besto Ahmed. Sensoren sa at han kjørte «rolig som en taxisjåfør». Ahmed så fram til å fortelle det til Jonas. Jonas tok det med ro — men han tutet med hornet hele veien hjem.'],
  sm: 'Ahmed strøk på oppkjøringen to ganger. Jonas øvde med ham hver kveld i tre uker, og tredje gang besto Ahmed.',
  gl: { 'strøket på': 'провалил', 'oppkjøringen': 'экзамен по вождению', 'blinklyset': 'поворотник', 'rundkjøringen': 'круговое движение', 'se seg for': 'смотреть по сторонам', 'nok var nok': 'хватит', 'farer': 'опасности', 'holdt ut med': 'терпел', 'besto': 'сдал', 'Sensoren': 'экзаменатор', 'hornet': 'гудок' },
  q: [{ t: 'tf', q: ['Ahmed besto første gang.|F # Han strøk to ganger.', 'Taxisjåfør-metoden går ut på ro.|T', 'Jonas tutet hele veien hjem.|T'] },
    { t: 'choice', q: ['Hva glemte Ahmed første gang?|å slå på blinklyset|å ta med førerkortet|å stoppe på rødt', 'Hva betyr «holdt ut med» her?|терпел|выключил|выяснил'] }] });

FT('c1-5', { title: 'Bilfri gate?',
  txt: ['Kommunen foreslo å gjøre Solgata bilfri. Det ble et allmøte i bakeriet, og stemningen var høy.', 'Jonas var imot. «For det første lever jeg av å kjøre. For det andre: hvordan skal Kari komme seg til legen?» Sofie var for. «Riktignok blir det tungvint i starten. Men på den annen side blir det tryggere for barna, og luften blir renere.»', 'Kari overrasket alle. «Jeg er sytti år, og jeg går tur hver dag nå. Følgelig trenger jeg ikke bil til legen. Derimot trenger jeg benker å hvile på.»', 'Til slutt foreslo Nora et kompromiss: bilfritt om dagen, taxi og varelevering tillatt om morgenen, og benker langs hele gata. Alt i alt var alle fornøyde. Bortsett fra Pus, som hadde likt å sove på de varme panserne.'],
  sm: 'Naboene diskuterte om Solgata skulle bli bilfri. Alle hadde gode argumenter, og Nora foreslo et kompromiss som alle var fornøyde med.',
  gl: { 'bilfri': 'без машин', 'allmøte': 'общее собрание', 'stemningen var høy': 'страсти кипели', 'imot': 'против', 'tungvint': 'неудобно', 'tryggere': 'безопаснее', 'Følgelig': 'следовательно', 'Derimot': 'зато', 'varelevering': 'доставка товаров', 'Bortsett fra': 'кроме', 'panserne': 'капоты' },
  q: [{ t: 'tf', q: ['Jonas var imot forslaget.|T', 'Kari trenger bil til legen.|F # Hun går tur hver dag nå.', 'Pus var fornøyd med kompromisset.|F # Han likte å sove på varme pansere.'] },
    { t: 'choice', q: ['Hva var et argument for, ifølge Sofie?|tryggere for barna|billigere taxi|flere parkeringsplasser', 'Hva ønsket Kari seg?|benker å hvile på|en ny bil|mer taxi'] }] });

FT('c1-6', { title: 'Kakekrisen',
  txt: ['Nora hadde tatt seg vann over hodet. Hun hadde lovet å bake tre bryllupskaker, to hundre boller til et konfirmasjonsselskap og kransekake til ordføreren — samme lørdag.', 'Fredag kveld snakket hun rett fra levra: «Jeg henger ikke med i svingene lenger. Det står om livet — om bakeriets liv!»', 'Da viste Solgata at de hadde bein i nesa. Kari pisket krem, Ahmed rullet boller, Sofie pyntet kaker, og Jonas kjørte alt ut. De slo to fluer i én smekk: kundene fikk kakene sine, og naboene fikk en uforglemmelig natt.', 'Ordføreren sa at kransekaka var midt i blinken. Nora var i den sjuende himmel. Men neste gang, sa hun, skal hun ikke skjære alle bestillinger over én kam. Hun skal si nei. Ingen i gata tror på det.'],
  sm: 'Nora hadde lovet å bake altfor mye til én lørdag. Naboene hjalp henne hele natten, og alt ble levert i tide.',
  gl: { 'tatt seg vann over hodet': 'взялась за непосильное', 'konfirmasjonsselskap': 'праздник конфирмации', 'kransekake': 'торт-башня из колец', 'ordføreren': 'мэр', 'rett fra levra': 'начистоту', 'henger ikke med i svingene': 'не успеваю', 'bein i nesa': 'характер', 'pisket krem': 'взбивала сливки', 'to fluer i én smekk': 'двух зайцев одним выстрелом', 'midt i blinken': 'в яблочко', 'over én kam': 'под одну гребёнку' },
  q: [{ t: 'tf', q: ['Nora hadde lovet å bake for mye.|T', 'Naboene sa nei til å hjelpe.|F # De hjalp hele natten.', 'Ordføreren likte kransekaka.|T'] },
    { t: 'choice', q: ['Hva gjorde Kari?|pisket krem|kjørte kaker|pyntet kaker', 'Hva tror naboene om løftet til Nora?|De tror ikke på det.|De er sikre.|De bryr seg ikke.'] }] });

// ---------- C2 ----------
NOTE('c2-1', { sm: 'I Longyearbyen ble Pelle overveldet av lyset og stillheten. Kunstneren tegnet nesten ingenting, mens Mari skrek for å bryte stillheten.' });
NOTE('c2-2', { sm: 'Fangstmannen Odd, som underdriver alt, ga dem ei gammel loggbok som bestefar hadde glemt hos ham.' });
NOTE('c2-3', { sm: 'Loggboka fra 1924 var skrevet med gammel rettskrivning. Den beskrev Lundeøen, og bestefar hadde lagt til en gåte: «Der tre møtes, og tanken står stille».' });
NOTE('c2-4', { sm: 'Mari løste gåten: ikke «tanke», men «tank». Ved en gammel oljetank under tre isbreer fant de det siste tallet i posisjonen.' });
NOTE('c2-5', { sm: 'De fant Lundeøen. Pelle holdt en tale for å la øya være i fred, og øya ble vernet.' });
NOTE('c2-6', { sm: 'En utstilling i Oslo fortalte om reisen. Øya ble vernet uten navn på noe kart. På operataket tenkte Pelle at det finnes flere kart.' });

FT('c2-1', { title: 'Å se, eller å glo',
  txt: ['Ahmed var stolt av ordforrådet sitt. Men en dag sa han til Nora: «Jeg har glodd på kakene dine hele dagen. De er så vakre!» Nora løftet et øyenbryn.', '«Glo?» sa hun. «Det er det fulle folk gjør på bussen. Du mener vel at du beundret dem. Eller at du tittet på dem gjennom vinduet. Eller at du skuet dem, hvis du vil være poetisk.»', 'Ahmed skrev en ny side i notatboka: se — titte — kikke — glo — stirre — skue. Han øvde hele uka. Han tittet på Pus, stirret på regnskyene, skuet utover fjorden og passet seg vel for å glo på noen.', 'Fredag sa han til Nora: «Jeg skimtet deg i tåka i morges.» Nora smilte. «Nå,» sa hun, «snakker du bedre norsk enn halve Ålesund.»'],
  sm: 'Ahmed brukte ordet «glo» feil om kakene til Nora. Hun forklarte forskjellen på mange ord for å se, og etter en uke brukte han dem perfekt.',
  gl: { 'ordforrådet': 'словарный запас', 'glodd': 'пялился', 'øyenbryn': 'бровь', 'beundret': 'любовался', 'skuet': 'созерцал', 'passet seg vel for': 'остерегался', 'skimtet': 'едва различил', 'tåka': 'туман', 'i morges': 'сегодня утром' },
  q: [{ t: 'tf', q: ['«Glo» er et nøytralt ord.|F # Det er det fulle folk gjør på bussen.', 'Ahmed øvde på synonymene hele uka.|T', 'Til slutt brukte Ahmed «skimte» riktig.|T'] },
    { t: 'choice', q: ['Hva mente Ahmed egentlig om kakene?|at han beundret dem|at han var sint på dem|at han var sulten', 'Hva skuet Ahmed utover?|fjorden|Pus|regnskyene'] }] });

FT('c2-2', { title: 'Litt friskt',
  txt: ['Jonas hadde trukket en turist opp av havnen en kald januarkveld. Lokalavisa ville intervjue ham.', '«Hvordan var det å hoppe i iskaldt vann?» spurte journalisten. Jonas tenkte seg om. «Litt friskt,» sa han. «Var du redd?» «Ikke akkurat avslappet.»', '«Folk kaller deg en helt,» fortsatte journalisten. Jonas ristet på hodet. «Jeg er ikke akkurat noen svømmer. Det gikk greit, det var det.» Kari, som sto bak ham, himlet med øynene.', 'Artikkelen fikk tittelen «Ikke verst, Jonas!». Han hengte den opp i taxien, rett ved siden av en lapp fra turisten: «Takk for turen. Det kunne vært verre.»'],
  sm: 'Jonas reddet en turist fra iskaldt vann. I intervjuet med avisa underdrev han alt, slik norske helter gjør.',
  gl: { 'trukket': 'вытащил', 'havnen': 'гавань', 'Litt friskt': 'свежо (бодрит)', 'avslappet': 'расслаблен', 'en helt': 'герой', 'himlet med øynene': 'закатила глаза', 'tittelen': 'заголовок' },
  q: [{ t: 'tf', q: ['Jonas reddet en turist.|T', 'Jonas sa at han var veldig redd.|F # «Ikke akkurat avslappet».', 'Artikkelen het «Ikke verst, Jonas!».|T'] },
    { t: 'choice', q: ['Что на самом деле значит «Litt friskt» здесь?|ужасно холодно|немного прохладно|очень весело # Преуменьшение.', 'Hvor hengte Jonas artikkelen?|i taxien|i bakeriet|på kjøleskapet'] }] });

FT('c2-3', { title: 'Brevet fra 1893',
  txt: ['Leif fant en eske med brev etter bestefaren sin. Det eldste var fra 1893, skrevet med sirlig, skrå håndskrift.', '«Kjære Marie! Idag gik jeg langs Havnen og tænkte paa Dig. Vi har faaet godt Veir, og Baadene er komne hjem med megen Fisk.»', 'Kari hjalp ham å tyde det. «Gik er gikk, tænkte er tenkte, Baadene er båtene,» forklarte hun. «Og alle substantiver hadde stor forbokstav — akkurat som på tysk.» Sofie fant ut at Ibsen og Hamsun skrev på nesten samme måte.', 'Brevet sluttet slik: «Jeg venter paa Dig, om det saa skal tage hele mit Liv.» Leif ble stille. Så så han på Kari. «Familien vår er visst god på å vente,» sa han.'],
  sm: 'Leif fant et brev fra 1893 skrevet med gammel rettskrivning. Kari og Sofie hjalp ham å tyde det. Brevet handlet om å vente på den man elsker.',
  gl: { 'sirlig': 'аккуратный (о почерке)', 'skrå': 'наклонный', 'tyde': 'расшифровать', 'forbokstav': 'первая буква', 'om det saa skal tage hele mit Liv': 'даже если это займёт всю мою жизнь', 'visst': 'похоже' },
  q: [{ t: 'tf', q: ['Det eldste brevet var fra 1893.|T', 'I gammel rettskrivning hadde substantiver liten forbokstav.|F # Stor, som på tysk.', '«Baadene» er «båtene» i dag.|T'] },
    { t: 'choice', q: ['Hva betyr «gik»?|gikk|gikt|gi', 'Hva sa Leif til slutt?|Familien vår er visst god på å vente.|Jeg forstår ingenting.|Brevet er falskt.'] }] });

FT('c2-4', { title: 'De beste brødrene',
  txt: ['Nora skulle ha en ny plakat i vinduet. Hun ville ha noe morsomt, noe som fikk folk til å stoppe.', 'Sofie skrev: «Hos oss får du de beste brødene i byen!» Men hun skrev fort, og det ble én r for mye: «de beste brødrene i byen».', 'Dagen etter kom tre damer inn og spurte høflig hvor brødrene var. Jonas og fetteren hans, som tilfeldigvis var på besøk, stilte seg straks opp ved disken. «Vi er brødrene,» sa Jonas. «Eller i hvert fall fettere.»', 'Nora lot feilen stå. Salget doblet seg. Ahmed skrev i notatboka: brød — brødet — brødene; bror — broren — brødrene. Én bokstav, og et bakeri blir et sjekkested.'],
  sm: 'Sofie skrev «brødrene» i stedet for «brødene» på plakaten til bakeriet. Feilen ble en suksess, og Jonas og fetteren spilte «brødrene».',
  gl: { 'plakat': 'плакат', 'én r for mye': 'на одну «r» больше', 'tilfeldigvis': 'случайно', 'disken': 'прилавок', 'i hvert fall': 'во всяком случае', 'Salget doblet seg': 'продажи удвоились', 'sjekkested': 'место для знакомств' },
  q: [{ t: 'tf', q: ['Sofie skrev feil på plakaten.|T', '«Brødrene» betyr «хлеба».|F # brødrene — братья; brødene — хлеба.', 'Salget ble dårligere.|F # Det doblet seg.'] },
    { t: 'choice', q: ['Hvem sa «Vi er brødrene»?|Jonas|Ahmed|Kari', 'Как по-норвежски «те самые хлеба»?|brødene|brødrene|brødet'] }] });

FT('c2-5', { title: 'Talen for biblioteket',
  txt: ['Kommunen ville legge ned det lille biblioteket i bydelen. Sofie, nå seksten år, ble valgt til å holde tale på folkemøtet.', 'Hun begynte stille: «Kjære alle sammen. Her lærte jeg å lese. Her fant Ahmed sine første norske ord. Her har Kari lånt krim hver fredag i femti år.»', '«Vi er ikke her for bøkene. Vi er her for menneskene. Ikke for det som var, men for det som kommer. Hvem skal gi barna et sted å drømme, hvis ikke biblioteket? Hyllene tier. Men i dag taler vi for dem.»', 'Det ble helt stille. Så reiste Kari seg og klappet. Hele salen fulgte. Tre uker senere kom vedtaket: biblioteket fikk fortsette. Sofie sa bare: «Takk for meg.» Men hun smilte hele veien hjem.'],
  sm: 'Kommunen ville legge ned biblioteket. Sofie holdt en rørende tale med anafor, antitese og retoriske spørsmål, og biblioteket fikk fortsette.',
  gl: { 'legge ned': 'закрыть', 'bydelen': 'район', 'folkemøtet': 'собрание жителей', 'krim': 'детективы', 'Hyllene tier': 'полки молчат', 'taler vi for dem': 'мы говорим за них', 'salen': 'зал', 'vedtaket': 'решение' },
  q: [{ t: 'tf', q: ['Sofie var seksten år.|T', 'Kari lånte krim hver fredag.|T', 'Biblioteket ble lagt ned.|F # Det fikk fortsette.'] },
    { t: 'choice', q: ['Hvilken antitese brukte Sofie?|Ikke for det som var, men for det som kommer.|Kjære alle sammen.|Takk for meg.', 'Hvem reiste seg først og klappet?|Kari|Jonas|Nora'] }] });

FT('c2-6', { title: 'Gruppechatten',
  txt: ['Sofie lagde en gruppechat for Solgata. Det var en dårlig idé.', 'Sofie: «Dugnad lørdag! Ta med snacks, det blir chill 😎» Jonas: «Jalla, jeg booker henger til søpla.» Tor-Arne fra Tromsø: «Æ kjem òg!» Kari: «Undertegnede vil med dette bekrefte deltakelse. Med vennlig hilsen, Kari Vik.»', 'Ahmed leste alt tre ganger. Det var engelsk, slang, nordnorsk, nynorsk og kanselli — i fire meldinger. «Er dette norsk?» skrev han. Sofie svarte: «Wolla, dette ER norsk 😂»', 'På lørdag kom alle. Ingen hadde forstått hverandre helt, men alle hadde forstått det viktigste: vafler klokka tolv. Ahmed skrev i notatboka: «Norsk er ikke ett språk. Det er en gate full av folk.»'],
  sm: 'Sofie lagde en gruppechat for gata. Meldingene var fulle av anglisismer, slang, dialekt og kanselli, men alle forsto det viktigste og kom på dugnaden.',
  gl: { 'gruppechat': 'групповой чат', 'henger': 'прицеп', 'søpla': 'мусор', 'Undertegnede': 'нижеподписавшаяся', 'bekrefte deltakelse': 'подтвердить участие', 'kanselli': 'канцелярит', 'det viktigste': 'самое главное' },
  q: [{ t: 'tf', q: ['Gruppechatten var en dårlig idé.|T', 'Kari skrev veldig uformelt.|F # Hun skrev kanselli.', 'Alle kom på dugnaden.|T'] },
    { t: 'choice', q: ['Hva skrev Ahmed i notatboka?|Norsk er en gate full av folk.|Norsk er umulig.|Norsk er engelsk.', 'Hva var det viktigste alle forsto?|vafler klokka tolv|at Kari er sint|at det regner'] }] });
