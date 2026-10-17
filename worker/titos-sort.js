// «Разбери дела» (этап 9 А, docs/titos.md): у Титоса упали коробки. Раунд собирает сервер: 6 коробок (дела из titos_cases + архив ниже),
// стопка документов; чужие документы — в шредер. Кофе — только addCoffee(…, 'sort') в worker/titos.js.
// Повороты (открываются каждые 5 уровней): twin — папка-двойник, wind — документ сдуло в окно, cat — кот в коробке,
// urgent — срочная улика с таймером, wet — подмоченный документ, hint — «Титос выпил кофе — подсказка».

// старые дела из архива Титоса (их нет среди уровней): название и документы [значок, en, ru, lv]
const ARCHIVE = [
  { t: ['The Mayor’s Missing Button', 'Пропавшая пуговица мэра', 'Mēra pazudusī poga'], d: [['🧵', 'Thread with a knot', 'Нитка с узелком', 'Diegs ar mezglu'], ['📋', 'Button inventory', 'Опись пуговиц', 'Pogu saraksts'], ['🗣️', 'Tailor’s statement', 'Показания портнихи', 'Šuvējas liecība']] },
  { t: ['The Kettle That Whistled Twice', 'Чайник, который свистел дважды', 'Tējkanna, kas svilpa divreiz'], d: [['🫖', 'Kettle lid', 'Крышка чайника', 'Tējkannas vāks'], ['🕰️', 'Stopped clock', 'Остановившиеся часы', 'Apstājies pulkstenis'], ['📝', 'Neighbour’s note', 'Записка соседа', 'Kaimiņa zīmīte']] },
  { t: ['The Puddle Thief', 'Похититель луж', 'Peļķu zaglis'], d: [['👢', 'Rubber boot print', 'След резинового сапога', 'Gumijas zābaka nospiedums'], ['🪣', 'Empty bucket', 'Пустое ведро', 'Tukšs spainis'], ['☔', 'Forgotten umbrella', 'Забытый зонтик', 'Aizmirsts lietussargs']] },
  { t: ['The Pie That Vanished', 'Исчезнувший пирог', 'Pazudušais pīrāgs'], d: [['🥧', 'Pie crumbs', 'Крошки пирога', 'Pīrāga drupatas'], ['🍽️', 'Clean plate', 'Чистая тарелка', 'Tīrs šķīvis'], ['📜', 'Recipe with a stain', 'Рецепт с пятном', 'Recepte ar traipu']] },
  { t: ['The Silent Bell of Buttonspire', 'Немой колокол Баттонспайра', 'Buttonspire mēmais zvans'], d: [['🔔', 'Bell clapper', 'Язычок колокола', 'Zvana mēlīte'], ['🧶', 'Ball of wool', 'Клубок шерсти', 'Dzijas kamols'], ['🪜', 'Ladder rung', 'Ступенька лестницы', 'Kāpņu pakāpiens']] },
  { t: ['The Case of the Sleepy Owl', 'Дело сонной совы', 'Miegainās pūces lieta'], d: [['🪶', 'Grey feather', 'Серое перо', 'Pelēka spalva'], ['🌙', 'Night-shift timetable', 'График ночных смен', 'Nakts maiņu grafiks'], ['☕', 'Cold cup of cocoa', 'Холодное какао', 'Atdzisis kakao']] },
  { t: ['Stolen Moonlight', 'Украденный лунный свет', 'Nozagtā mēnessgaisma'], d: [['🫙', 'Empty jar', 'Пустая банка', 'Tukša burka'], ['🔭', 'Telescope cap', 'Крышка телескопа', 'Teleskopa vāciņš'], ['🗺️', 'Star map', 'Карта звёзд', 'Zvaigžņu karte']] },
  { t: ['The Runaway Scarf', 'Сбежавший шарф', 'Aizbēgušais šalle'], d: [['🧣', 'Fringe of a scarf', 'Бахрома шарфа', 'Šalles bārkstis'], ['🌬️', 'Weather report', 'Сводка погоды', 'Laika ziņas'], ['📮', 'Returned letter', 'Вернувшееся письмо', 'Atgriezta vēstule']] },
  { t: ['The Jam Jar Mystery', 'Тайна банки с вареньем', 'Ievārījuma burkas noslēpums'], d: [['🍓', 'Strawberry stem', 'Хвостик клубники', 'Zemenes kātiņš'], ['🥄', 'Sticky spoon', 'Липкая ложка', 'Lipīga karote'], ['🏷️', 'Torn label', 'Порванная этикетка', 'Saplēsta etiķete']] },
  { t: ['The Lost Chess Knight', 'Пропавший шахматный конь', 'Pazudušais šaha zirdziņš'], d: [['♟️', 'Pawn as a witness', 'Пешка-свидетель', 'Bandinieks-liecinieks'], ['📒', 'Game score sheet', 'Запись партии', 'Partijas pieraksts'], ['🧸', 'Toy horse', 'Игрушечная лошадка', 'Rotaļu zirdziņš']] },
  { t: ['The Kettleford Tea Leak', 'Утечка чая в Кеттлфорде', 'Tējas noplūde Kettlfordā'], d: [['🍵', 'Tea leaves', 'Чаинки', 'Tējas lapiņas'], ['🔧', 'Bent spanner', 'Гнутый ключ', 'Saliekta atslēga'], ['🧾', 'Plumber’s bill', 'Счёт водопроводчика', 'Santehniķa rēķins']] },
  { t: ['The Pinecrust Flour Cloud', 'Мучное облако Пайнкраста', 'Pinecrust miltu mākonis'], d: [['🌾', 'Sack of flour', 'Мешок муки', 'Miltu maiss'], ['🧤', 'Floury mitten', 'Варежка в муке', 'Miltaina dūrainis'], ['📰', 'Morning paper', 'Утренняя газета', 'Rīta avīze']] },
  { t: ['The Upside-Down Garden', 'Перевёрнутый огород', 'Apgrieztais dārzs'], d: [['🥕', 'Carrot top', 'Ботва морковки', 'Burkāna laksti'], ['🪴', 'Flower pot', 'Цветочный горшок', 'Puķu pods'], ['🐾', 'Paw prints', 'Следы лап', 'Ķepu pēdas']] },
  { t: ['The Ghost in the Bakery', 'Привидение в пекарне', 'Spoks maiznīcā'], d: [['🥖', 'Half a baguette', 'Полбагета', 'Puse bagetes'], ['🕯️', 'Melted candle', 'Оплывшая свеча', 'Izkususi svece'], ['🛏️', 'Bedsheet', 'Простыня', 'Palags']] },
  { t: ['The Borrowed Rainbow', 'Одолженная радуга', 'Aizņemtā varavīksne'], d: [['🎨', 'Paint palette', 'Палитра', 'Palete'], ['🖌️', 'Wet brush', 'Мокрая кисть', 'Slapja ota'], ['🌈', 'Sketch of an arch', 'Набросок арки', 'Arkas skice']] },
  { t: ['The Hat on the Weathervane', 'Шляпа на флюгере', 'Cepure uz vējrādītāja'], d: [['🎩', 'Hat band', 'Лента от шляпы', 'Cepures lente'], ['🐓', 'Rooster’s complaint', 'Жалоба петуха', 'Gaiļa sūdzība'], ['🎈', 'Burst balloon', 'Лопнувший шарик', 'Pārsprādzis balons']] },
  { t: ['The Missing Bridge Toll', 'Пропавшая плата за мост', 'Pazudusī tilta nodeva'], d: [['🪙', 'Bent coin', 'Гнутая монетка', 'Saliekta monēta'], ['🗝️', 'Toll box key', 'Ключ от копилки', 'Krājkasītes atslēga'], ['📏', 'Bridge plan', 'План моста', 'Tilta plāns']] },
  { t: ['The Snoring Lighthouse', 'Храпящий маяк', 'Krācošā bāka'], d: [['💡', 'Spare bulb', 'Запасная лампочка', 'Rezerves spuldze'], ['🐚', 'Seashell', 'Ракушка', 'Gliemežvāks'], ['📓', 'Keeper’s logbook', 'Журнал смотрителя', 'Uzrauga žurnāls']] },
  { t: ['The Mixed-Up Mail', 'Перепутанная почта', 'Sajauktais pasts'], d: [['✉️', 'Wrong envelope', 'Чужой конверт', 'Svešā aploksne'], ['📦', 'Parcel with holes', 'Посылка с дырочками', 'Paka ar caurumiem'], ['🖋️', 'Smudged address', 'Размытый адрес', 'Izsmērēta adrese']] },
  { t: ['The Clock Tower Cheese', 'Сыр в часовой башне', 'Siers pulksteņtornī'], d: [['🧀', 'Cheese rind', 'Корочка сыра', 'Siera miza'], ['⚙️', 'Little gear', 'Шестерёнка', 'Zobratiņš'], ['🐭', 'Mouse-sized ticket', 'Мышиный билетик', 'Peļu biļetīte']] },
  { t: ['The Painted Fence Affair', 'Дело о крашеном заборе', 'Krāsotā žoga lieta'], d: [['🪣', 'Tin of blue paint', 'Банка синей краски', 'Zilas krāsas bundža'], ['👣', 'Blue footprints', 'Синие следы', 'Zilas pēdas'], ['📸', 'Photo of the fence', 'Фото забора', 'Žoga foto']] },
  { t: ['The Wobbly Wedding Cake', 'Шаткий свадебный торт', 'Ļodzīgā kāzu torte'], d: [['🎂', 'Cake topper', 'Фигурка с торта', 'Tortes figūriņa'], ['💐', 'Bouquet ribbon', 'Лента от букета', 'Pušķa lente'], ['📃', 'Guest list', 'Список гостей', 'Viesu saraksts']] },
  { t: ['The Splash Street Splash', 'Всплеск на Сплэш-стрит', 'Šļakatas Splash ielā'], d: [['🐟', 'Fish scale', 'Рыбья чешуйка', 'Zivs zvīņa'], ['🛶', 'Oar', 'Весло', 'Airis'], ['🌊', 'Tide table', 'Таблица приливов', 'Paisumu tabula']] },
  { t: ['The Secret of the Teapot Hat', 'Секрет шляпы-чайника', 'Tējkannas cepures noslēpums'], d: [['🧢', 'Lining of a hat', 'Подкладка шляпы', 'Cepures odere'], ['🍪', 'Biscuit crumbs', 'Крошки печенья', 'Cepumu drupatas'], ['🔍', 'Magnifier report', 'Отчёт с лупой', 'Ziņojums ar lupu']] },
];
const LI = { en: 0, ru: 1, lv: 2 };
const NO = { en: 'A-', ru: 'А-', lv: 'A-' };
// повороты по порядку: открываются на уровнях 5, 10, 15…
export const SORT_TWISTS = ['twin', 'wind', 'cat', 'urgent', 'wet', 'hint'];

function rng(seed) { // mulberry32
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const shuffle = (a, r) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// раунд уровня lv. main — уровень основной игры (сложность мягко растёт и от него); real — дела из базы [{n, title, docs: [{emo|icon, name}]}] на языке страницы.
// → { boxes: [{no, title}], docs: [{i, emo, icon, name, label, box (−1 — шредер), blot, wind, urgent, wet, hint}], cat, twists }; label у кляксы — только в secret
export function sortRound(lv, main, lang, real, seed) {
  const r = rng(seed), L = LI[lang] ?? 0;
  const mine = shuffle(real.filter(c => c.docs.length).map(c => ({ no: '№' + c.n, title: c.title, docs: c.docs })), r);
  const arch = ARCHIVE.map((a, i) => ({ no: NO[lang] + (i + 1), title: a.t[L], docs: a.d.map(d => ({ emo: d[0], name: d[L + 1] })) }));
  const pool = [...mine.slice(0, 2), ...shuffle([...mine.slice(2), ...arch], r)]; // 2 коробки — дела из базы, остальное — архив вперемешку
  pool.splice(0, 6, ...shuffle(pool.slice(0, 6), r));
  const on = SORT_TWISTS.filter((_, i) => lv >= (i + 1) * 5);
  const fresh = lv % 5 === 0 && lv <= 30 ? SORT_TWISTS[lv / 5 - 1] : null; // новый поворот — обязательно на своём уровне
  const extra = lv > 30 ? 1 + (r() < .4 ? 1 : 0) : fresh ? 0 : r() < .6 ? 1 : 0; // сколько уже открытых поворотов добавить
  const twists = shuffle(on.filter(x => x !== fresh), r).slice(0, extra);
  if (fresh) twists.unshift(fresh);
  const boxes = pool.slice(0, 6), shred = pool.slice(6);
  let twin = -1;
  if (twists.includes('twin')) { // двойник: другая папка с тем же названием, но другим номером
    twin = 1 + Math.floor(r() * 5);
    boxes[twin] = { ...shred.shift(), title: boxes[0].title };
  }
  const n = Math.min(18, 6 + Math.floor(lv / 2) + Math.floor(main / 25));
  const nShred = Math.max(1, Math.round(n * Math.min(.3, .12 + lv * .01)));
  const blotP = lv < 3 ? 0 : Math.min(.2, .05 + lv * .005);
  const docs = [], secret = {};
  for (let i = 0; i < n; i++) {
    const toShred = i < nShred, bi = toShred ? -1 : (i < nShred + 6 ? i - nShred : Math.floor(r() * 6)); // каждая коробка получает хоть один документ
    const c = toShred ? shred[Math.floor(r() * shred.length)] : boxes[bi];
    const d = c.docs[Math.floor(r() * c.docs.length)];
    const label = (twin >= 0 && (bi === 0 || bi === twin)) ? `${c.no} · ${c.title}` : c.title;
    docs.push({ emo: d.emo || '', icon: d.icon || '', name: d.name, label, box: bi });
  }
  if (twin >= 0) { // и в шредер — третий «двойник» с тем же названием
    const c = shred.shift(); if (c) docs[0] = { emo: c.docs[0].emo || '', icon: c.docs[0].icon || '', name: c.docs[0].name, label: `${c.no} · ${boxes[0].title}`, box: -1 };
  }
  shuffle(docs, r);
  docs.forEach((d, i) => { d.i = i; if (r() < blotP) { d.blot = true; secret[i] = d.label; d.label = ''; } });
  const pick = (k, f) => { if (!twists.includes(k)) return; const free = docs.filter(d => !d.blot && !d.wind && !d.urgent && !d.wet && !d.hint && d.i > 0); if (free.length) f(free[Math.floor(r() * free.length)]); };
  pick('wind', d => { d.wind = true; });
  pick('urgent', d => { d.urgent = Math.max(6, 12 - Math.floor(lv / 10)); });
  pick('wet', d => { d.wet = true; });
  pick('wet', d => { if (lv > 30) d.wet = true; });
  pick('hint', d => { d.hint = true; });
  const cat = twists.includes('cat') ? { box: Math.floor(r() * 6), at: 1 + Math.floor(r() * Math.max(1, n - 3)) } : null;
  return { boxes: boxes.map(b => ({ no: b.no, title: b.title })), docs, cat, twists, secret };
}
