// «Поезд Полли» (/train/, site/assets/train.js, docs/games.md): слова станций на 4 языках игры.
// Станция: b — буквы (плитки), w — слова, которые надо найти: [слово, значок, en, ru, lv], x — бонусные слова (только очки).
// Испанский: плитки без ударений (estación → ESTACION), ñ — своя плитка. Проверка: node tools/train_check.js
window.PPTrainWords = {
  // очки за букву (как в настольных играх со словами); нет в списке — 1
  pts: {
    en: { d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4, k: 5, j: 8, x: 8, q: 10, z: 10 },
    lv: { d: 2, m: 2, p: 2, k: 2, ā: 2, ē: 3, ī: 3, ū: 3, b: 3, v: 3, z: 3, c: 4, g: 4, j: 4, š: 5, ļ: 6, ņ: 6, ž: 7, č: 8, ģ: 8, ķ: 8, h: 10, f: 10 },
    es: { d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, y: 4, q: 5, j: 8, ñ: 8, x: 8, z: 10 },
    no: { o: 2, k: 2, m: 2, g: 2, u: 3, h: 3, v: 4, f: 4, j: 4, p: 4, å: 4, b: 4, ø: 5, æ: 6, y: 6, w: 8, c: 10 },
  },
  en: [
    { b: 'trains', w: [['train', '🚆', 'train', 'поезд', 'vilciens'], ['rain', '🌧', 'rain', 'дождь', 'lietus'], ['star', '⭐', 'star', 'звезда', 'zvaigzne'], ['art', '🎨', 'art', 'искусство', 'māksla']],
      x: 'rat rats arts sit tin tan ant ants sir air tar strain stain satin saint stir rains trains airs rant stair its ran sat tins' },
    { b: 'tickets', w: [['ticket', '🎫', 'ticket', 'билет', 'biļete'], ['kite', '🪁', 'kite', 'воздушный змей', 'pūķis'], ['ice', '🧊', 'ice', 'лёд', 'ledus'], ['test', '📝', 'test', 'тест', 'tests']],
      x: 'tickets tick ticks stick sick kit kits set site sect tie ties cite cites kites skit ski its sit' },
    { b: 'station', w: [['station', '🚉', 'station', 'вокзал', 'stacija'], ['toast', '🍞', 'toast', 'тост', 'grauzdiņš'], ['ant', '🐜', 'ant', 'муравей', 'skudra'], ['tin', '🥫', 'tin', 'жестяная банка', 'skārdene'], ['son', '👦', 'son', 'сын', 'dēls']],
      x: 'not into sit sat tons saint sin ton tan stain satin oats ants stint titan iota tins ion ions' },
    { b: 'window', w: [['window', '🪟', 'window', 'окно', 'logs'], ['wind', '🌬', 'wind', 'ветер', 'vējš'], ['down', '⬇️', 'down', 'вниз', 'lejā'], ['now', '⏰', 'now', 'сейчас', 'tagad'], ['win', '🏆', 'win', 'победить', 'uzvarēt']],
      x: 'won own wow nod din widow' },
    { b: 'suitcase', w: [['suitcase', '🧳', 'suitcase', 'чемодан', 'koferis'], ['cat', '🐱', 'cat', 'кошка', 'kaķis'], ['sea', '🌊', 'sea', 'море', 'jūra'], ['tea', '🍵', 'tea', 'чай', 'tēja'], ['suit', '👔', 'suit', 'костюм', 'uzvalks']],
      x: 'case cause act cut east eat ice seat cast sit use set site cats cuts ties tie ate sauce suite ace acute aces issue cute acts seas suits sauces tissue' },
    { b: 'sunshine', w: [['sunshine', '☀️', 'sunshine', 'солнечный свет', 'saulīte'], ['sun', '🌞', 'sun', 'солнце', 'saule'], ['shine', '✨', 'shine', 'сиять', 'spīdēt'], ['nine', '9️⃣', 'nine', 'девять', 'deviņi'], ['sushi', '🍣', 'sushi', 'суши', 'suši'], ['hen', '🐔', 'hen', 'курица', 'vista']],
      x: 'his she use issue sin sue inn shin nun sins suns hens hue hues shines shun inns sinus nines' },
    { b: 'passport', w: [['passport', '🛂', 'passport', 'паспорт', 'pase'], ['sport', '⚽', 'sport', 'спорт', 'sports'], ['soap', '🧼', 'soap', 'мыло', 'ziepes'], ['post', '📮', 'post', 'почта', 'pasts'], ['star', '⭐', 'star', 'звезда', 'zvaigzne'], ['pot', '🍲', 'pot', 'кастрюля', 'katls']],
      x: 'stop past art parts pass sort spot pop port arts sat pots trap tap pat rap pastor ports tops rats spa pops toss opt pros roast strap prop traps props rot apt atop tar sap taps stops posts spots sports stars oar oats' },
    { b: 'travels', w: [['travel', '🗺', 'travel', 'путешествовать', 'ceļot'], ['salt', '🧂', 'salt', 'соль', 'sāls'], ['seal', '🦭', 'seal', 'тюлень', 'ronis'], ['vest', '🦺', 'vest', 'жилет', 'veste'], ['eat', '🍽', 'eat', 'есть (кушать)', 'ēst'], ['late', '🕒', 'late', 'поздно', 'vēlu']],
      x: 'are last let real set later least rest star east rate save sea sale rates seat tea arts era sat lets vast tears ear steal ears tear ate alert slave tale laser rat tales alter rats travels eats stare slate vale vet rave ravel starve vase salve' },
  ],
  lv: [
    { b: 'vilciens', w: [['vilciens', '🚆', 'train', 'поезд', 'vilciens'], ['viens', '1️⃣', 'one', 'один', 'viens'], ['vilnis', '🌊', 'wave', 'волна', 'vilnis'], ['vecis', '👴', 'old man', 'старик', 'vecis']],
      x: 'visi esi vien sevi nevis sev sen veic vecs nes vis vieni viesi liec lec lien velns svin licis seni sveic iesi sveci cieni celis veci veicis velc vilni civils' },
    { b: 'kartes', w: [['karte', '🗺', 'map', 'карта', 'karte'], ['kaste', '📦', 'box', 'коробка', 'kaste'], ['kase', '💰', 'ticket office', 'касса', 'kase'], ['trase', '🛣', 'route', 'трасса', 'trase'], ['aste', '🦊', 'tail', 'хвост', 'aste']],
      x: 'kas tas esat katrs kartes tak skat traks skar akts rets reta rakt rase retas sekta ekstra' },
    { b: 'stacija', w: [['stacija', '🚉', 'station', 'вокзал', 'stacija'], ['acis', '👀', 'eyes', 'глаза', 'acis'], ['aita', '🐑', 'sheep', 'овца', 'aita'], ['cits', '🔁', 'other', 'другой', 'cits']],
      x: 'tas tai citas cita sit taisa asi asti aitas sita tic aci' },
    { b: 'vagons', w: [['vagons', '🚃', 'carriage', 'вагон', 'vagons'], ['govs', '🐄', 'cow', 'корова', 'govs'], ['ogas', '🫐', 'berries', 'ягоды', 'ogas'], ['nags', '💅', 'nail', 'ноготь', 'nags'], ['gans', '🧑‍🌾', 'shepherd', 'пастух', 'gans']],
      x: 'nav gan nagos' },
    { b: 'spilvens', w: [['spilvens', '🛏', 'pillow', 'подушка', 'spilvens'], ['pils', '🏰', 'castle', 'замок', 'pils'], ['piens', '🥛', 'milk', 'молоко', 'piens'], ['lepns', '🦚', 'proud', 'гордый', 'lepns'], ['velns', '😈', 'devil', 'чёрт', 'velns']],
      x: 'viss viens esi vien sevi nevis sev sen sevis pilns nes vis ies vel sens lien svin lepni peli seni pelni nesis' },
    { b: 'kalnos', w: [['kalns', '⛰', 'mountain', 'гора', 'kalns'], ['skola', '🏫', 'school', 'школа', 'skola'], ['olas', '🥚', 'eggs', 'яйца', 'olas'], ['loks', '🏹', 'bow', 'лук (оружие)', 'loks'], ['kola', '🥤', 'cola', 'кола', 'kola']],
      x: 'kas skan sola kalnos loka ola sloka kolas akls aklo klans' },
    { b: 'pasaule', w: [['pasaule', '🌍', 'world', 'мир', 'pasaule'], ['lapsa', '🦊', 'fox', 'лиса', 'lapsa'], ['lapa', '🍃', 'leaf', 'лист', 'lapa'], ['sala', '🏝', 'island', 'остров', 'sala'], ['upe', '🏞', 'river', 'река', 'upe'], ['pase', '🛂', 'passport', 'паспорт', 'pase']],
      x: 'puse lapu lapas saule upes salu plus elpu pus lasa lasu alas elpa sula lapsu pulsa elpas apse pasu' },
    { b: 'saulīte', w: [['saulīte', '☀️', 'sunshine', 'солнышко', 'saulīte'], ['saule', '🌞', 'sun', 'солнце', 'saule'], ['sula', '🧃', 'juice', 'сок', 'sula'], ['lasīt', '📖', 'to read', 'читать', 'lasīt'], ['līst', '🌧', 'it rains', 'идёт дождь', 'līst']],
      x: 'tas esat īsta īstu īsu lasu salu leta aste ausīt' },
  ],
  es: [
    { b: 'trenes', w: [['tren', '🚆', 'train', 'поезд', 'vilciens'], ['tres', '3️⃣', 'three', 'три', 'trīs'], ['entre', '↔️', 'between', 'между', 'starp'], ['este', '🧭', 'east', 'восток', 'austrumi']],
      x: 'ser ese tener eres ten trenes' },
    { b: 'playas', w: [['playa', '🏖', 'beach', 'пляж', 'pludmale'], ['pala', '🪏', 'shovel', 'лопата', 'lāpsta'], ['sala', '🛋', 'living room', 'гостиная', 'viesistaba'], ['alas', '🪽', 'wings', 'крылья', 'spārni']],
      x: 'las pasa sal ala playas palas aspa' },
    { b: 'estacion', w: [['estación', '🚉', 'station', 'вокзал', 'stacija'], ['cine', '🎬', 'cinema', 'кино', 'kino'], ['cena', '🍽', 'dinner', 'ужин', 'vakariņas'], ['nota', '🎵', 'note', 'нота', 'nots'], ['costa', '🏖', 'coast', 'побережье', 'krasts']],
      x: 'con esta son sin eso nos asi esto tan esa antes sea caso sino casi cosa tenia ante sean acto santo ciento cita actos toca notas nacio tio cientos cien sentia cinta nace saco once senti ten asco nieto canto asiento tia sienta consta caos censo seco eco citas sano tenis cesta cesto' },
    { b: 'ventana', w: [['ventana', '🪟', 'window', 'окно', 'logs'], ['nave', '🚀', 'ship', 'корабль', 'kuģis'], ['ave', '🐦', 'bird', 'птица', 'putns'], ['antena', '📡', 'antenna', 'антенна', 'antena'], ['avena', '🌾', 'oats', 'овёс', 'auzas']],
      x: 'tan van ante ven venta vea ten nena vena nata enana atan vean nana' },
    { b: 'maletas', w: [['maleta', '🧳', 'suitcase', 'чемодан', 'koferis'], ['mesa', '🪑', 'table', 'стол', 'galds'], ['sal', '🧂', 'salt', 'соль', 'sāls'], ['tela', '🧵', 'fabric', 'ткань', 'audums'], ['alma', '💖', 'soul', 'душа', 'dvēsele'], ['metal', '🔩', 'metal', 'металл', 'metāls']],
      x: 'las mas esta esa les sea tal mal tema mes alta temas mala sale sala tales malas masa tasa altas ama mata meta mate metas salta ala almas alas amas lema males atlas mates matas latas telas asta asma lata maletas' },
    { b: 'viajero', w: [['viajero', '🧳', 'traveller', 'путешественник', 'ceļotājs'], ['viaje', '🗺', 'trip', 'поездка', 'ceļojums'], ['oreja', '👂', 'ear', 'ухо', 'auss'], ['oveja', '🐑', 'sheep', 'овца', 'aita'], ['río', '🏞', 'river', 'река', 'upe'], ['aire', '💨', 'air', 'воздух', 'gaiss']],
      x: 'era ver veo vieja viejo via vio roja vea veia ira oir vera ave aro reja viera ajo' },
    { b: 'españa', w: [['España', '🇪🇸', 'Spain', 'Испания', 'Spānija'], ['peña', '🪨', 'rock', 'скала', 'klints'], ['pesa', '🏋', 'weight', 'гиря', 'svars'], ['pasa', '🍇', 'raisin', 'изюм', 'rozīne']],
      x: 'esa sea pase sepa seña pasea aspa peñas' },
    { b: 'tortilla', w: [['tortilla', '🍳', 'omelette', 'тортилья (омлет)', 'omlete'], ['torta', '🎂', 'cake', 'торт', 'torte'], ['olla', '🍲', 'pot', 'кастрюля', 'katls'], ['orilla', '🏝', 'shore', 'берег', 'krasts'], ['litro', '🧃', 'litre', 'литр', 'litrs'], ['tío', '👨', 'uncle', 'дядя', 'tēvocis']],
      x: 'otra tal alto total alli rio rato trato tiro tia tira ola oral rota llora lio trio lira ratito tallo litoral' },
  ],
  no: [
    { b: 'billett', w: [['billett', '🎫', 'ticket', 'билет', 'biļete'], ['bil', '🚗', 'car', 'машина', 'mašīna'], ['telt', '⛺', 'tent', 'палатка', 'telts'], ['ett', '1️⃣', 'one', 'один', 'viens']],
      x: 'til ble litt bli blitt lite lett lei ille teit bit bite belt tilt' },
    { b: 'stasjon', w: [['stasjon', '🚉', 'station', 'вокзал', 'stacija'], ['ost', '🧀', 'cheese', 'сыр', 'siers'], ['sant', '✅', 'true', 'правда', 'patiesi'], ['ansjos', '🐟', 'anchovy', 'анчоус', 'anšovs']],
      x: 'oss sto not sats sans' },
    { b: 'vinduer', w: [['vinduer', '🪟', 'windows', 'окна', 'logi'], ['vindu', '🖼', 'window', 'окно', 'logs'], ['vind', '🌬', 'wind', 'ветер', 'vējš'], ['vei', '🛣', 'road', 'дорога', 'ceļš'], ['ved', '🪵', 'firewood', 'дрова', 'malka']],
      x: 'den der din under nei ned dine drive ren runde verdi indre vin red drev rune ide rive rev verd vern edru rund rein vid viner vide riv driv duer dun ride uren' },
    { b: 'koffert', w: [['koffert', '🧳', 'suitcase', 'чемодан', 'koferis'], ['kort', '🃏', 'card', 'карта', 'kārts'], ['fort', '⚡', 'fast', 'быстро', 'ātri'], ['tre', '3️⃣', 'three', 'три', 'trīs'], ['fot', '🦶', 'foot', 'нога (ступня)', 'pēda']],
      x: 'for tok ofte tro korte tore offer ofre rot treff fet orket ofret roet rote koret kro kofte' },
    { b: 'solskinn', w: [['solskinn', '☀️', 'sunshine', 'солнечный свет', 'saulīte'], ['sol', '🌞', 'sun', 'солнце', 'saule'], ['ski', '⛷', 'ski', 'лыжа', 'slēpe'], ['sko', '👟', 'shoe', 'ботинок', 'kurpe'], ['kino', '🎬', 'cinema', 'кино', 'kino']],
      x: 'inn oss sin nok slik slo lik kilo kos sinn skinn kinn kloss' },
    { b: 'reisen', w: [['reisen', '🧳', 'the trip', 'поездка', 'ceļojums'], ['reise', '🗺', 'trip', 'путешествие', 'ceļot'], ['seier', '🏆', 'victory', 'победа', 'uzvara'], ['ris', '🍚', 'rice', 'рис', 'rīsi'], ['nese', '👃', 'nose', 'нос', 'deguns'], ['serie', '📺', 'series', 'сериал', 'seriāls']],
      x: 'ser sin sier nei sine ene eier ren rene isen eie sen ens seire sene rein rense' },
    { b: 'strand', w: [['strand', '🏖', 'beach', 'пляж', 'pludmale'], ['sand', '🏜', 'sand', 'песок', 'smiltis'], ['dans', '💃', 'dance', 'танец', 'deja'], ['and', '🦆', 'duck', 'утка', 'pīle'], ['snart', '⏳', 'soon', 'скоро', 'drīz']],
      x: 'tar dra sant stand art rad ran rast' },
    { b: 'tomater', w: [['tomater', '🍅', 'tomatoes', 'помидоры', 'tomāti'], ['tomat', '🍅', 'tomato', 'помидор', 'tomāts'], ['mat', '🍽', 'food', 'еда', 'ēdiens'], ['metro', '🚇', 'metro', 'метро', 'metro'], ['mor', '👩', 'mother', 'мама', 'mamma'], ['atom', '⚛', 'atom', 'атом', 'atoms']],
      x: 'mer mot tar rett tre ett tro rom tema art tore mottar more matt matte tomt motta rot arm mora rema mote rotet mate roet rote ram mett rate etat tomter motet orm' },
  ],
};
// Словарь для бесконечных станций (после первых 8): одно понятие — одна строка «значок|en|ru|lv|es|no».
// Станция N > 8 собирается сама (train.js `gen`): из слов языка, которые складываются из одного набора плиток.
window.PPTrainWords.dict = `
🐱|cat|кошка|kaķis|gato|katt
🐶|dog|собака|suns|perro|hund
☀️|sun|солнце|saule|sol|sol
🌙|moon|луна|mēness|luna|måne
⭐|star|звезда|zvaigzne|estrella|stjerne
🌳|tree|дерево|koks|árbol|tre
🌊|sea|море|jūra|mar|hav
🌧|rain|дождь|lietus|lluvia|regn
❄️|snow|снег|sniegs|nieve|snø
🌬|wind|ветер|vējš|viento|vind
🐟|fish|рыба|zivs|pez|fisk
🐦|bird|птица|putns|pájaro|fugl
🥚|egg|яйцо|ola|huevo|egg
🥛|milk|молоко|piens|leche|melk
🍵|tea|чай|tēja|té|te
🍞|bread|хлеб|maize|pan|brød
🍰|cake|торт|kūka|pastel|kake
🍎|apple|яблоко|ābols|manzana|eple
🍐|pear|груша|bumbieris|pera|pære
🍋|lemon|лимон|citrons|limón|sitron
🍇|grape|виноград|vīnoga|uva|drue
🍚|rice|рис|rīsi|arroz|ris
🍲|soup|суп|zupa|sopa|suppe
🧂|salt|соль|sāls|sal|salt
🗺|map|карта|karte|mapa|kart
👜|bag|сумка|soma|bolso|veske
🎩|hat|шляпа|cepure|sombrero|hatt
🧥|jacket|куртка|jaka|chaqueta|jakke
👞|shoe|ботинок|kurpe|zapato|sko
🧦|sock|носок|zeķe|calcetín|sokk
🛏|bed|кровать|gulta|cama|seng
💡|lamp|лампа|lampa|lámpara|lampe
🚪|door|дверь|durvis|puerta|dør
🔑|key|ключ|atslēga|llave|nøkkel
📖|book|книга|grāmata|libro|bok
☕|cup|чашка|krūze|taza|kopp
🥄|spoon|ложка|karote|cuchara|skje
🍴|fork|вилка|dakša|tenedor|gaffel
🍽|plate|тарелка|šķīvis|plato|tallerken
🪑|chair|стул|krēsls|silla|stol
🚆|train|поезд|vilciens|tren|tog
🚌|bus|автобус|autobuss|autobús|buss
🚗|car|машина|mašīna|coche|bil
⛵|boat|лодка|laiva|barco|båt
✈️|plane|самолёт|lidmašīna|avión|fly
🛣|road|дорога|ceļš|camino|vei
🌉|bridge|мост|tilts|puente|bro
🏞|river|река|upe|río|elv
🛶|lake|озеро|ezers|lago|innsjø
⛰|mountain|гора|kalns|montaña|fjell
🌹|rose|роза|roze|rosa|rose
🍃|leaf|лист|lapa|hoja|blad
🌱|seed|семечко|sēkla|semilla|frø
🪺|nest|гнездо|ligzda|nido|rede
🦉|owl|сова|pūce|búho|ugle
🦊|fox|лиса|lapsa|zorro|rev
🐻|bear|медведь|lācis|oso|bjørn
🐺|wolf|волк|vilks|lobo|ulv
🐴|horse|лошадь|zirgs|caballo|hest
🐑|sheep|овца|aita|oveja|sau
🐐|goat|коза|kaza|cabra|geit
🦆|duck|утка|pīle|pato|and
🐸|frog|лягушка|varde|rana|frosk
🐭|mouse|мышь|pele|ratón|mus
🦁|lion|лев|lauva|león|løve
🐜|ant|муравей|skudra|hormiga|maur
🐝|bee|пчела|bite|abeja|bie
🔔|bell|колокольчик|zvans|campana|bjelle
💍|ring|кольцо|gredzens|anillo|ring
🎁|gift|подарок|dāvana|regalo|gave
✉️|letter|письмо|vēstule|carta|brev
🏙|city|город|pilsēta|ciudad|by
⛲|park|парк|parks|parque|park
🏪|shop|магазин|veikals|tienda|butikk
🎫|ticket|билет|biļete|billete|billett
🪟|window|окно|logs|ventana|vindu
🎵|song|песня|dziesma|canción|sang
❤️|heart|сердце|sirds|corazón|hjerte
✋|hand|рука|roka|mano|hånd
👃|nose|нос|deguns|nariz|nese
👂|ear|ухо|auss|oreja|øre
👁|eye|глаз|acs|ojo|øye
🦷|tooth|зуб|zobs|diente|tann
🌃|night|ночь|nakts|noche|natt
🌞|day|день|diena|día|dag
🧀|cheese|сыр|siers|queso|ost
🧃|juice|сок|sula|zumo|saft
🌲|forest|лес|mežs|bosque|skog
🍄|mushroom|гриб|sēne|seta|sopp
⛄|winter|зима|ziema|invierno|vinter
🏖|summer|лето|vasara|verano|sommer
🏠|house|дом|māja|casa|hus
🤝|friend|друг|draugs|amigo|venn
💧|water|вода|ūdens|agua|vann
🔥|fire|огонь|uguns|fuego|ild
🌸|flower|цветок|zieds|flor|blomst
🌍|world|мир|pasaule|mundo|verden
🧳|suitcase|чемодан|koferis|maleta|koffert
🚉|station|вокзал|stacija|estación|stasjon
⏰|time|время|laiks|tiempo|tid
📮|post|почта|pasts|correo|post
🐄|cow|корова|govs|vaca|ku
🐷|pig|свинья|cūka|cerdo|gris
🐔|hen|курица|vista|gallina|høne
🥕|carrot|морковь|burkāns|zanahoria|gulrot
🍅|tomato|помидор|tomāts|tomate|tomat
🥔|potato|картошка|kartupelis|patata|potet
🧈|butter|сливочное масло|sviests|mantequilla|smør
🍯|honey|мёд|medus|miel|honning
🌈|rainbow|радуга|varavīksne|arcoíris|regnbue
☁️|cloud|облако|mākonis|nube|sky
🏝|island|остров|sala|isla|øy
⛱|beach|пляж|pludmale|playa|strand
🎨|paint|краска|krāsa|pintura|maling
✏️|pencil|карандаш|zīmulis|lápiz|blyant
🖊|pen|ручка|pildspalva|bolígrafo|penn
👑|king|король|karalis|rey|konge
🐢|turtle|черепаха|bruņurupucis|tortuga|skilpadde
🐰|rabbit|кролик|trusis|conejo|kanin
🧊|ice|лёд|ledus|hielo|is
🍪|cookie|печенье|cepums|galleta|kjeks
🥗|salad|салат|salāti|ensalada|salat
🍝|pasta|макароны|makaroni|pasta|pasta
🍫|chocolate|шоколад|šokolāde|chocolate|sjokolade
🐌|snail|улитка|gliemezis|caracol|snegle
🦀|crab|краб|krabis|cangrejo|krabbe
🐙|octopus|осьминог|astoņkājis|pulpo|blekksprut
🐳|whale|кит|valis|ballena|hval
🦌|deer|олень|briedis|ciervo|hjort
🐿|squirrel|белка|vāvere|ardilla|ekorn
🌵|cactus|кактус|kaktuss|cactus|kaktus
🎈|balloon|воздушный шар|balons|globo|ballong
🕯|candle|свеча|svece|vela|lys
🧸|toy|игрушка|rotaļlieta|juguete|leke
⚽|ball|мяч|bumba|pelota|ball
🎲|game|игра|spēle|juego|spill
🏫|school|школа|skola|escuela|skole
👩‍🏫|teacher|учитель|skolotājs|profesor|lærer
📝|word|слово|vārds|palabra|ord
🗣|language|язык|valoda|idioma|språk
😊|smile|улыбка|smaids|sonrisa|smil
💤|sleep|сон|miegs|sueño|søvn
🍳|kitchen|кухня|virtuve|cocina|kjøkken
🧺|basket|корзина|grozs|cesta|kurv
🪞|mirror|зеркало|spogulis|espejo|speil
⌚|clock|часы|pulkstenis|reloj|klokke
📷|photo|фото|foto|foto|bilde
🎂|birthday|день рождения|dzimšanas diena|cumpleaños|bursdag
🧭|north|север|ziemeļi|norte|nord
🌅|morning|утро|rīts|mañana|morgen
🌆|evening|вечер|vakars|tarde|kveld
🏰|castle|замок|pils|castillo|slott
🎪|circus|цирк|cirks|circo|sirkus
🐎|pony|пони|ponijs|poni|ponni
🍉|melon|арбуз|arbūzs|sandía|melon
🥜|nut|орех|rieksts|nuez|nøtt
🍒|cherry|вишня|ķirsis|cereza|kirsebær
🌽|corn|кукуруза|kukurūza|maíz|mais
🧅|onion|лук|sīpols|cebolla|løk
🍊|orange|апельсин|apelsīns|naranja|appelsin
🫒|olive|оливка|olīva|aceituna|oliven
🐋|ocean|океан|okeāns|océano|hav
🚲|bike|велосипед|ritenis|bici|sykkel
🛤|rails|рельсы|sliedes|vías|skinner
💺|seat|место|sēdeklis|asiento|sete
🎒|trip|поездка|brauciens|viaje|tur
🏨|hotel|гостиница|viesnīca|hotel|hotell
🗼|tower|башня|tornis|torre|tårn
⛪|church|церковь|baznīca|iglesia|kirke
🎭|theatre|театр|teātris|teatro|teater
🖼|museum|музей|muzejs|museo|museum
🧑‍🍳|cook|повар|pavārs|cocinero|kokk
🧒|child|ребёнок|bērns|niño|barn
👵|grandma|бабушка|vecmāmiņa|abuela|bestemor
🐈|kitten|котёнок|kaķēns|gatito|kattunge
`;
