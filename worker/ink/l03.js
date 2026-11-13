// Курс туши, урок 3 — «Бумага, тушь, перья» (книга «Ink Sketching», с. 21–33). Формат — worker/ink/index.js.
const F = (img, cap) => `<figure><img src="/images/ink/${img}" alt="" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
export default {
  icon: '✒', card: 'autumn-cozy/79.png', cover: 'p23-18.jpg',
  en: {
    name: 'Paper, ink and pens',
    intro: 'Tools time! No need to buy a whole shop — but it helps to know why one ink smudges under watercolour and another doesn’t, and which paper won’t turn into a wave.',
    goals: ['choose paper by weight, surface and sizing', 'tell the main types of ink apart', 'know the pens, their filling systems and how to care for them'],
    th: `<p>Ink is a liquid that soaks into cellulose or cotton fibres. Your choice of materials decides how obedient the line is and how deep the pigment goes.</p>
${F('p23-18.jpg', 'Bottled inks, a dip pen and a sketchbook')}
<h4>Paper</h4>
<ul><li><b>Weight.</b> For washes — from 200 g/m². Thin office paper waves when wet, and a sharp nib can scratch through it. For liners 120–150 g/m² is enough; for juicy pens and brushes — 180–220 g/m².</li>
<li><b>Smooth (Hot Pressed).</b> The nib glides, the line is sharp and predictable — for detail and liners. Ink dries a bit longer: you can soften an edge if you are quick.</li>
<li><b>Textured (Cold Pressed / Rough).</b> Ink settles only on the bumps of the grain — shimmer and air, great for expressive sketches and dry brush. Forgives mistakes.</li>
<li><b>Sizing.</b> Well-sized paper holds a drop on the surface. Loose paper drinks ink like a sponge and the line “feathers” along the fibres. Always test in a corner first.</li>
<li><b>Colour.</b> Bright white — maximum contrast, graphic and modern. Ivory softens the black — a vintage, archive look.</li></ul>
<h4>The sketchbook</h4>
<ul><li>It should <b>lie flat at 180°</b> — otherwise you can’t draw a long line and ink pools in the fold.</li>
<li><b>No bleed-through</b> — paper marked “for markers” has a barrier layer: clean lines, but soft washes are harder.</li>
<li><b>Format:</b> A6 and smaller — short notes, easy to fill (good against blank page fear); A5 — the gold standard for urban sketching; A4+ — the studio, working from the shoulder.</li>
<li>A <b>hard cover</b> works as a clipboard; an <b>elastic band</b> saves a fresh drawing in your bag.</li></ul>
<h4>Ink</h4>
<div class="tbl"><table><thead><tr><th>Type</th><th>What it is</th><th>Keep in mind</th></tr></thead><tbody>
<tr><td>India ink (Encre de Chine)</td><td>carbon black + shellac; waterproof when dry, slight gloss</td><td>dip pens and brushes only — clogs fountain pens forever</td></tr>
<tr><td>Acrylic ink</td><td>a plastic film, waterproof and very opaque; works on wood and plastic too</td><td>wash tools at once — dried on a brush it won’t come off</td></tr>
<tr><td>Soluble (drawing) ink</td><td>gum arabic; a wet brush brings a dry line back to life</td><td>soft shadows and haze, but no layering</td></tr>
<tr><td>Fountain pen ink</td><td>fluid, no solid particles</td><td>usually not waterproof and fades faster</td></tr>
<tr><td>Ink sticks</td><td>soot + glue, ground with water on an inkstone</td><td>you control the density; endless greys</td></tr>
<tr><td>Coloured ink</td><td>pigment (thicker, lightfast) or dye (brighter, fades)</td><td>can be mixed on paper or in a palette</td></tr></tbody></table></div>
<p>Planning watercolour over the drawing? Look for <b>Waterproof</b> or <b>Permanent</b>. Non-waterproof ink under watercolour is not a mistake but a technique: take colours a few tones brighter (ink makes them muddier), lay colour in one layer, use a semi-dry brush to keep the contour, and pull a line into a soft shadow with a wet brush.</p>
${F('p24-19.jpg', 'Classic India ink')}
<h4>Pens</h4>
<ul><li><b>Ballpoint</b> — the most accessible; soft tone through pressure, good for rough sketches.</li>
<li><b>Liners / technical pens</b> — the standard of modern sketching: fixed line, usually archival waterproof pigment. Ideal for travel.</li>
<li><b>Fountain pens</b> — refillable, no need to dip; use only fountain pen ink.</li>
<li><b>Dip pens</b> — holder + nib; the most alive line, thickness changes with pressure, any ink works. Affordable but demanding.</li>
<li><b>Brush pens</b> — big black areas and thin lines from one tip.</li>
<li><b>Glass pens</b> — fluted tip holds ink in grooves; one dip writes a paragraph. Don’t press, slowly rotate the pen. Perfect for testing colours: rinse and wipe.</li></ul>
${F('p27-29.jpg', 'A dip pen and the blot it leaves when you forget to wipe the nib')}
<p><b>Filling systems:</b> cartridges (clean, limited choice) · converters (any bottled ink) · piston (big tank, harder to clean) · eyedropper (the whole body is the tank — body heat can push out a drop). Never mix inks of different brands — sediment can ruin the pen.</p>
<p><b>Care:</b> wipe the dip nib after every session and dry it; dried ink — an old toothbrush. Flush a fountain pen with lukewarm water once a month, for clogs — special pen flush; never soap or solvents.</p>
<h4>Helpers</h4>
<ul><li><b>Water brush</b> — water in the handle: draw a line and pull it into a shadow, no jar needed.</li>
<li><b>Paper towel</b> — controls the brush and blots an extra drop.</li>
<li><b>Masking fluid</b> — keeps highlights white; never with your good brushes.</li>
<li><b>White ink or gouache</b> — there is no eraser, but there are whites: bring light back, fix small slips.</li>
<li><b>Non-photo blue pencil</b> (or H–2H) — a light preliminary sketch that hides under black ink.</li></ul>`,
    simple: 'Paper: 200 g/m² and more for water, smooth for detail, textured for expression, test in the corner first. Ink: waterproof (India, acrylic) for watercolour on top, soluble for soft shadows, special ink for fountain pens. Clean your pens after every session.',
    mist: [['Pouring India ink into a fountain pen.', 'Fountain pens take only fountain pen ink — shellac and acrylic clog them forever.'],
      ['Doing washes on thin office paper.', 'For water — 200 g/m² and more, or the sheet turns into waves.'],
      ['Starting a big work on unknown paper.', 'Test in the corner: the line must stay sharp, not feather.'],
      ['Leaving a dip nib with dried ink until next time.', 'Wipe and dry the nib after every session.']],
    terms: [['g/m² (gsm)', 'paper weight: the bigger, the thicker'], ['Hot Pressed', 'smooth paper for precise lines'], ['Cold Pressed', 'paper with a grain for expressive sketches'], ['Sizing', 'what keeps ink on the surface instead of soaking in'], ['Feathering', 'a line spreading like a spiderweb along the fibres'], ['Waterproof / Permanent', 'ink that won’t smudge under water once dry'], ['Converter', 'a removable mechanism to fill a fountain pen from a bottle'], ['Non-photo blue', 'a pencil invisible under ink and on scans']],
    fact: 'Ink sticks for sumi-e are made of soot and glue — and grinding them on an inkstone was considered part of the art: it calms the mind before the first stroke.',
    test: [['Which paper weight is recommended for ink washes?', '200 g/m² and more', '80 g/m², like office paper', 'Weight does not matter', 'Thin paper waves when wet and ruins the composition.'],
      ['Which ink must never go into a fountain pen?', 'India ink with shellac or acrylic ink', 'Fountain pen ink', 'Any blue ink', 'They dry inside and clog the channels forever.'],
      ['You want to paint watercolour over the drawing without smudging. Which ink?', 'Marked Waterproof or Permanent', 'Soluble drawing ink', 'Any — it doesn’t matter', 'Waterproof ink stays put when the wet brush touches it.'],
      ['What happens on textured (Cold Pressed) paper with a quick stroke?', 'Ink settles only on the bumps — shimmer and air', 'The line becomes perfectly smooth', 'Ink does not stick at all', 'This is the effect used for expressive sketches and dry brush.'],
      ['Why should a sketchbook lie flat at 180°?', 'To draw long lines and avoid ink pooling in the fold', 'So it looks more expensive', 'So pages don’t stick', 'A steep curve at the spine breaks the line and collects ink.'],
      ['How do you work with a glass pen?', 'Don’t press, slowly rotate the pen as you draw', 'Press hard to open the tip', 'Dip after every letter', 'The tip is rigid; rotating uses ink from all the grooves.']],
    task: { h: 'Material test card', need: 'every pen and ink you have (even one ballpoint is enough), your sketchbook paper, water or a water brush', time: '20 min',
      steps: ['Divide a page into rows — one row for each tool you have.', 'In each row: a confident line, a line from thin to thick (pressure), a little hatching and a small filled black square.', 'If you have water: when the ink is dry, touch half of the black square with a wet brush. Did it stay or did it come alive? Write “waterproof” or “soluble”.', 'Turn the page over and check: did anything bleed through? Note it.', 'Sign each row with the name of the tool and one word about its character: “nervous”, “velvet”, “obedient”…'] },
    client: { name: 'Professor Owlistair Tweed', job: 'lover of letters, reads by the fire', say: 'Hm-hm. Young bird, I insist that letters were better than phones. But before I write my next 40-page letter, I must know: which of your pens is worthy? Prepare me a proper test card.',
      ask: ['A row for every tool: line, pressure, hatching, black square', 'A note: waterproof or soluble', 'A word about each tool’s character'] },
  },
  ru: {
    name: 'Бумага, тушь, перья',
    intro: 'Время инструментов! Скупать весь магазин не нужно — но полезно знать, почему одна тушь плывёт под акварелью, а другая нет, и какая бумага не превратится в волну.',
    goals: ['выбирать бумагу по плотности, поверхности и проклейке', 'различать основные виды туши', 'знать перья, системы заправки и как за ними ухаживать'],
    th: `<p>Тушь — это жидкость, которая впитывается в волокна целлюлозы или хлопка. От выбора материалов зависит, насколько послушной будет линия и как глубоко уйдёт пигмент.</p>
${F('p23-18.jpg', 'Флаконы туши, перо и скетчбук')}
<h4>Бумага</h4>
<ul><li><b>Плотность.</b> Для заливок — от 200 г/м². Тонкая офисная бумага от воды идёт волной, а острое перо может её процарапать. Для линеров хватит 120–150 г/м², для «сочных» ручек и кистей — 180–220 г/м².</li>
<li><b>Гладкая (Hot Pressed).</b> Перо скользит, линия острая и предсказуемая — для деталей и линеров. Тушь сохнет чуть дольше: если действовать быстро, край можно смягчить.</li>
<li><b>Фактурная (Cold Pressed / Rough).</b> Тушь ложится только на выступы зерна — мерцание и воздух, отлично для экспрессивных скетчей и сухой кисти. Прощает ошибки.</li>
<li><b>Проклейка.</b> Хорошо проклеенная бумага держит каплю на поверхности. Рыхлая пьёт тушь как губка, и линия «расползается» паутинкой по волокнам. Всегда сначала пробуй в уголке.</li>
<li><b>Цвет.</b> Ярко-белая — максимальный контраст, графично и современно. Слоновая кость смягчает чёрное — винтажный, архивный вид.</li></ul>
<h4>Скетчбук</h4>
<ul><li>Должен <b>раскрываться плоско на 180°</b> — иначе длинную линию не провести, а тушь собирается в сгибе.</li>
<li><b>Не просвечивать</b> — бумага с пометкой «для маркеров» имеет барьерный слой: линии чистые, но мягкие заливки сложнее.</li>
<li><b>Формат:</b> A6 и меньше — короткие заметки, легко заполнить (хорошо против страха листа); A5 — золотой стандарт для городского скетчинга; A4+ — мастерская, работа от плеча.</li>
<li><b>Твёрдая обложка</b> служит планшетом; <b>резинка</b> спасает свежий рисунок в сумке.</li></ul>
<h4>Тушь</h4>
<div class="tbl"><table><thead><tr><th>Вид</th><th>Что это</th><th>Важно</th></tr></thead><tbody>
<tr><td>Классическая тушь (Encre de Chine)</td><td>сажа + шеллак; после высыхания водостойкая, лёгкий блеск</td><td>только перо и кисть — авторучку забивает навсегда</td></tr>
<tr><td>Акриловая тушь</td><td>пластиковая плёнка, водостойкая и очень плотная; ложится и на дерево, и на пластик</td><td>мыть инструменты сразу — засохшую на кисти не отмыть</td></tr>
<tr><td>Растворимая тушь</td><td>гуммиарабик; мокрая кисть оживляет сухую линию</td><td>мягкие тени и дымка, но без многослойности</td></tr>
<tr><td>Чернила для авторучек</td><td>текучие, без твёрдых частиц</td><td>обычно не водостойкие и быстрее выцветают</td></tr>
<tr><td>Твёрдая тушь (палочки)</td><td>сажа + клей, растирается с водой на тушечнице</td><td>плотность регулируешь сам; бесконечные серые</td></tr>
<tr><td>Цветная тушь</td><td>пигментная (гуще, светостойкая) или на красителях (ярче, выцветает)</td><td>можно смешивать на бумаге или в палитре</td></tr></tbody></table></div>
<p>Планируешь акварель поверх рисунка? Ищи пометку <b>Waterproof</b> или <b>Permanent</b>. Растворимая тушь под акварелью — не ошибка, а приём: бери цвета на пару тонов ярче (тушь их «загрязнит»), клади цвет в один слой, полусухой кистью сохраняй контур, а мокрой кистью вытягивай линию в мягкую тень.</p>
${F('p24-19.jpg', 'Классическая тушь')}
<h4>Перья и ручки</h4>
<ul><li><b>Шариковая ручка</b> — самая доступная; мягкий тон нажимом, хороша для черновых набросков.</li>
<li><b>Линеры</b> — стандарт современного скетчинга: линия постоянной толщины, обычно архивный водостойкий пигмент. Идеальны в дорогу.</li>
<li><b>Перьевые авторучки</b> — заправляются, макать не нужно; только чернила для авторучек.</li>
<li><b>Перо с держателем</b> — самая живая линия, толщина меняется нажимом, подходит любая тушь. Доступно, но требует навыка.</li>
<li><b>Брашпены</b> — и большие чёрные заливки, и тонкие линии одним кончиком.</li>
<li><b>Стеклянное перо</b> — желобки на кончике держат тушь; одного обмакивания хватает на абзац. Не дави, медленно поворачивай перо. Идеально для проб цвета: сполоснуть — и готово.</li></ul>
${F('p27-29.jpg', 'Перо и клякса, которая остаётся, если забыть снять лишнее')}
<p><b>Системы заправки:</b> картриджи (чисто, выбор ограничен) · конвертер (любая тушь из флакона) · поршень (большой запас, сложнее мыть) · пипеточная (весь корпус — резервуар; тепло руки может выдавить каплю). Никогда не смешивай чернила разных марок — осадок может погубить ручку.</p>
<p><b>Уход:</b> перо протирать и сушить после каждого сеанса; засохшую тушь — старой зубной щёткой. Авторучку раз в месяц промывать тёплой водой, при засоре — специальной жидкостью; никакого мыла и растворителей.</p>
<h4>Помощники</h4>
<ul><li><b>Кисть с резервуаром</b> — вода в ручке: провести линию и растянуть в тень, банка не нужна.</li>
<li><b>Бумажное полотенце</b> — регулирует влагу на кисти и снимает лишнюю каплю.</li>
<li><b>Маскирующая жидкость</b> — сохраняет блики белыми; хорошими кистями ею не работать.</li>
<li><b>Белая тушь или гуашь</b> — ластика нет, но есть белила: вернуть свет, поправить мелочь.</li>
<li><b>Голубой «non-photo» карандаш</b> (или H–2H) — лёгкий предварительный набросок, который прячется под тушью.</li></ul>`,
    simple: 'Бумага: для воды — от 200 г/м², гладкая — для деталей, фактурная — для экспрессии, сначала проба в уголке. Тушь: водостойкая (классическая, акриловая) — под акварель сверху, растворимая — для мягких теней, в авторучку — только специальные чернила. Инструменты чистить после каждого сеанса.',
    mist: [['Заправлять классическую тушь в перьевую авторучку.', 'В авторучку — только чернила для авторучек: шеллак и акрил забивают её навсегда.'],
      ['Делать заливки на тонкой офисной бумаге.', 'Для воды — от 200 г/м², иначе лист пойдёт волнами.'],
      ['Начинать большую работу на незнакомой бумаге.', 'Проба в уголке: линия должна оставаться чёткой и не расплываться.'],
      ['Оставлять перо с засохшей тушью до следующего раза.', 'Протирать и сушить перо после каждого сеанса.']],
    terms: [['г/м²', 'плотность бумаги: чем больше, тем толще'], ['Hot Pressed', 'гладкая бумага для точных линий'], ['Cold Pressed', 'бумага с зерном для экспрессивных скетчей'], ['Проклейка', 'то, что держит тушь на поверхности, а не даёт впитаться'], ['Растекание', 'линия расползается паутинкой по волокнам'], ['Waterproof / Permanent', 'тушь, которая после высыхания не плывёт от воды'], ['Конвертер', 'съёмный механизм, чтобы заправлять авторучку из флакона'], ['Non-photo blue', 'карандаш, невидимый под тушью и на сканах']],
    fact: 'Палочки туши для суми-э делают из сажи и клея — и растирание на тушечнице считалось частью искусства: оно успокаивает ум перед первым мазком.',
    test: [['Какая плотность бумаги рекомендуется для заливок тушью?', 'От 200 г/м²', '80 г/м², как офисная', 'Плотность не важна', 'Тонкая бумага от воды идёт волной и портит композицию.'],
      ['Какую тушь нельзя заправлять в перьевую авторучку?', 'Классическую с шеллаком и акриловую', 'Чернила для авторучек', 'Любые синие чернила', 'Они засыхают внутри и навсегда забивают каналы.'],
      ['Нужно писать акварелью поверх рисунка, чтобы ничего не поплыло. Какая тушь?', 'С пометкой Waterproof или Permanent', 'Растворимая', 'Любая — без разницы', 'Водостойкая тушь остаётся на месте, когда касается мокрая кисть.'],
      ['Что происходит на фактурной (Cold Pressed) бумаге при быстром штрихе?', 'Тушь ложится только на выступы — мерцание и воздух', 'Линия становится идеально гладкой', 'Тушь вообще не держится', 'Этот эффект используют в экспрессивных скетчах и сухой кистью.'],
      ['Зачем скетчбуку раскрываться плоско на 180°?', 'Чтобы проводить длинные линии и тушь не собиралась в сгибе', 'Чтобы выглядел дороже', 'Чтобы страницы не слипались', 'Крутой изгиб у корешка ломает линию и копит тушь.'],
      ['Как работать стеклянным пером?', 'Не давить, медленно поворачивать перо', 'Сильно давить, чтобы кончик раскрылся', 'Макать после каждой буквы', 'Кончик жёсткий; поворот расходует тушь из всех желобков.']],
    task: { h: 'Карта проб материалов', need: 'все ручки и тушь, что есть (хватит и одной шариковой), бумага скетчбука, вода или кисть с резервуаром', time: '20 мин',
      steps: ['Раздели страницу на строки — по строке на каждый инструмент.', 'В каждой строке: уверенная линия, линия от тонкой к толстой (нажим), немного штриховки и маленький залитый чёрный квадрат.', 'Если есть вода: когда тушь высохнет, коснись половины чёрного квадрата мокрой кистью. Осталась или ожила? Подпиши «водостойкая» или «растворимая».', 'Переверни лист: что-то проступило? Отметь.', 'Подпиши каждую строку названием инструмента и одним словом о характере: «нервный», «бархатный», «послушный»…'] },
    client: { name: 'Профессор Филин Твид', job: 'любитель писем, читает у камина', say: 'Кхм-кхм. Юная птица, я настаиваю: письма были лучше телефонов. Но прежде чем писать следующее письмо на 40 страниц, я должен знать, какое из твоих перьев его достойно. Подготовь мне как следует карту проб.',
      ask: ['Строка на каждый инструмент: линия, нажим, штриховка, чёрный квадрат', 'Пометка: водостойкая или растворимая', 'Слово о характере каждого инструмента'] },
  },
  lv: {
    name: 'Papīrs, tuša, spalvas',
    intro: 'Rīku laiks! Pirkt visu veikalu nevajag — bet noder zināt, kāpēc viena tuša izplūst zem akvareļa, bet otra ne, un kurš papīrs nepārvērtīsies vilnī.',
    goals: ['izvēlēties papīru pēc blīvuma, virsmas un līmējuma', 'atšķirt galvenos tušas veidus', 'pazīt spalvas, uzpildes sistēmas un zināt, kā tās kopt'],
    th: `<p>Tuša ir šķidrums, kas iesūcas celulozes vai kokvilnas šķiedrās. No materiālu izvēles atkarīgs, cik paklausīga būs līnija un cik dziļi ies pigments.</p>
${F('p23-18.jpg', 'Tušas pudelītes, spalva un skiču burtnīca')}
<h4>Papīrs</h4>
<ul><li><b>Blīvums.</b> Laukumiem — no 200 g/m². Plāns biroja papīrs no ūdens iet viļņos, un asa spalva to var pārskrāpēt. Laineriem pietiek ar 120–150 g/m², “sulīgām” pildspalvām un otām — 180–220 g/m².</li>
<li><b>Gluds (Hot Pressed).</b> Spalva slīd, līnija asa un paredzama — detaļām un laineriem. Tuša žūst nedaudz ilgāk: ja rīkojies ātri, malu var mīkstināt.</li>
<li><b>Faktūras (Cold Pressed / Rough).</b> Tuša nosēžas tikai uz graudu izciļņiem — mirgošana un gaiss, lieliski ekspresīvām skicēm un sausai otai. Piedod kļūdas.</li>
<li><b>Līmējums.</b> Labi līmēts papīrs notur pilienu uz virsmas. Irdens dzer tušu kā sūklis, un līnija “izplūst” zirnekļtīklā pa šķiedrām. Vienmēr vispirms izmēģini stūrītī.</li>
<li><b>Krāsa.</b> Spilgti balts — maksimāls kontrasts, grafiski un mūsdienīgi. Ziloņkaula tonis mīkstina melno — vintāžas, arhīva izskats.</li></ul>
<h4>Skiču burtnīca</h4>
<ul><li>Tai jā<b>atveras plakaniski 180°</b> — citādi garu līniju nenovilksi, un tuša krājas locījumā.</li>
<li><b>Nedrīkst caursisties</b> — papīram ar atzīmi “marķieriem” ir barjeras slānis: līnijas tīras, bet mīksti laukumi grūtāki.</li>
<li><b>Formāts:</b> A6 un mazāk — īsas piezīmes, viegli piepildīt (labi pret tukšas lapas bailēm); A5 — zelta standarts pilsētas skicēšanai; A4+ — darbnīca, darbs no pleca.</li>
<li><b>Cieti vāki</b> kalpo kā planšete; <b>gumija</b> izglābj svaigu zīmējumu somā.</li></ul>
<h4>Tuša</h4>
<div class="tbl"><table><thead><tr><th>Veids</th><th>Kas tas ir</th><th>Svarīgi</th></tr></thead><tbody>
<tr><td>Klasiskā tuša (Encre de Chine)</td><td>kvēpi + šellaka; pēc nožūšanas ūdensizturīga, viegls spīdums</td><td>tikai spalva un ota — pildspalvu aizsprosto uz visiem laikiem</td></tr>
<tr><td>Akrila tuša</td><td>plastmasas plēvīte, ūdensizturīga un ļoti blīva; der arī kokam un plastmasai</td><td>rīkus mazgāt uzreiz — uz otas nožuvušu nenomazgāsi</td></tr>
<tr><td>Šķīstoša tuša</td><td>gumiarābiks; mitra ota atdzīvina sausu līniju</td><td>mīkstas ēnas un dūmaka, bet bez daudzslāņu tehnikas</td></tr>
<tr><td>Tinte pildspalvām</td><td>šķidra, bez cietām daļiņām</td><td>parasti nav ūdensizturīga un ātrāk balē</td></tr>
<tr><td>Cietā tuša (stienīši)</td><td>kvēpi + līme, berž ar ūdeni uz tušas akmens</td><td>blīvumu regulē pats; bezgalīgi pelēkie</td></tr>
<tr><td>Krāsainā tuša</td><td>pigmenta (biezāka, gaismizturīga) vai krāsvielu (spilgtāka, balē)</td><td>var jaukt uz papīra vai paletē</td></tr></tbody></table></div>
<p>Plāno akvareli virs zīmējuma? Meklē atzīmi <b>Waterproof</b> vai <b>Permanent</b>. Šķīstoša tuša zem akvareļa nav kļūda, bet paņēmiens: ņem krāsas par pāris toņiem spilgtākas (tuša tās “nosmērēs”), liec krāsu vienā slānī, ar pussausu otu saglabā kontūru, bet ar mitru otu izvelc līniju mīkstā ēnā.</p>
${F('p24-19.jpg', 'Klasiskā tuša')}
<h4>Spalvas un pildspalvas</h4>
<ul><li><b>Lodīšu pildspalva</b> — vispieejamākā; mīksts tonis ar spiedienu, laba melnrakstu skicēm.</li>
<li><b>Laineri</b> — mūsdienu skicēšanas standarts: nemainīga biezuma līnija, parasti arhīva ūdensizturīgs pigments. Ideāli ceļā.</li>
<li><b>Spalvaspildspalvas</b> — uzpildāmas, mērcēt nevajag; tikai tinte pildspalvām.</li>
<li><b>Spalva ar turētāju</b> — visdzīvākā līnija, biezums mainās ar spiedienu, der jebkura tuša. Pieejama, bet prasa iemaņas.</li>
<li><b>Otas pildspalvas</b> — gan lieli melni laukumi, gan tievas līnijas ar vienu galiņu.</li>
<li><b>Stikla spalva</b> — rievas galiņā notur tušu; viena iemērkšana pietiek rindkopai. Nespied, lēni grozi spalvu. Ideāli krāsu izmēģinājumiem: noskaloji — un gatavs.</li></ul>
${F('p27-29.jpg', 'Spalva un traips, kas paliek, ja aizmirst noņemt lieko')}
<p><b>Uzpildes sistēmas:</b> kārtridži (tīri, izvēle ierobežota) · konverteris (jebkura tuša no pudelītes) · virzulis (liels krājums, grūtāk mazgāt) · pipetes (viss korpuss ir rezervuārs; rokas siltums var izspiest pilienu). Nekad nejauc dažādu zīmolu tintes — nogulsnes var sabojāt pildspalvu.</p>
<p><b>Kopšana:</b> spalvu noslaucīt un izžāvēt pēc katras reizes; nožuvušu tušu — ar vecu zobu birsti. Pildspalvu reizi mēnesī skalot ar siltu ūdeni, aizsprostojuma gadījumā — ar speciālu šķidrumu; nekādu ziepju un šķīdinātāju.</p>
<h4>Palīgi</h4>
<ul><li><b>Ota ar rezervuāru</b> — ūdens rokturī: novilki līniju un izstiepi ēnā, burka nav vajadzīga.</li>
<li><b>Papīra dvielis</b> — regulē mitrumu otā un noņem lieku pilienu.</li>
<li><b>Maskēšanas šķidrums</b> — saglabā atspīdumus baltus; ar labām otām to neizmanto.</li>
<li><b>Balta tuša vai guaša</b> — dzēšgumijas nav, bet ir balinātājs: atgriezt gaismu, izlabot sīkumu.</li>
<li><b>Zils “non-photo” zīmulis</b> (vai H–2H) — viegla iepriekšēja skice, kas paslēpjas zem tušas.</li></ul>`,
    simple: 'Papīrs: ūdenim — no 200 g/m², gluds — detaļām, faktūras — ekspresijai, vispirms izmēģinājums stūrītī. Tuša: ūdensizturīga (klasiskā, akrila) — akvarelim virsū, šķīstoša — mīkstām ēnām, pildspalvā — tikai speciāla tinte. Rīkus tīrīt pēc katras reizes.',
    mist: [['Iepildīt klasisko tušu spalvaspildspalvā.', 'Pildspalvā — tikai tinte pildspalvām: šellaka un akrils to aizsprosto uz visiem laikiem.'],
      ['Taisīt laukumus uz plāna biroja papīra.', 'Ūdenim — no 200 g/m², citādi lapa ies viļņos.'],
      ['Sākt lielu darbu uz nepazīstama papīra.', 'Izmēģinājums stūrītī: līnijai jāpaliek asai un neizplūst.'],
      ['Atstāt spalvu ar nožuvušu tušu līdz nākamajai reizei.', 'Noslaucīt un izžāvēt spalvu pēc katras reizes.']],
    terms: [['g/m²', 'papīra blīvums: jo lielāks, jo biezāks'], ['Hot Pressed', 'gluds papīrs precīzām līnijām'], ['Cold Pressed', 'papīrs ar graudu ekspresīvām skicēm'], ['Līmējums', 'tas, kas notur tušu uz virsmas un neļauj iesūkties'], ['Izplūšana', 'līnija izplešas zirnekļtīklā pa šķiedrām'], ['Waterproof / Permanent', 'tuša, kas pēc nožūšanas neizplūst no ūdens'], ['Konverteris', 'noņemams mehānisms pildspalvas uzpildei no pudelītes'], ['Non-photo blue', 'zīmulis, kas nav redzams zem tušas un skenējot']],
    fact: 'Sumi-e tušas stienīšus taisa no kvēpiem un līmes — un berzēšana uz tušas akmens tika uzskatīta par mākslas daļu: tā nomierina prātu pirms pirmā vilciena.',
    test: [['Kāds papīra blīvums ieteicams tušas laukumiem?', 'No 200 g/m²', '80 g/m², kā biroja papīrs', 'Blīvums nav svarīgs', 'Plāns papīrs no ūdens iet viļņos un sabojā kompozīciju.'],
      ['Kādu tušu nedrīkst iepildīt spalvaspildspalvā?', 'Klasisko ar šellaku un akrila tušu', 'Tinti pildspalvām', 'Jebkuru zilu tinti', 'Tās nožūst iekšā un uz visiem laikiem aizsprosto kanālus.'],
      ['Gribi gleznot akvareli virs zīmējuma, lai nekas neizplūst. Kāda tuša?', 'Ar atzīmi Waterproof vai Permanent', 'Šķīstoša', 'Jebkura — nav atšķirības', 'Ūdensizturīga tuša paliek vietā, kad pieskaras mitra ota.'],
      ['Kas notiek uz faktūras (Cold Pressed) papīra ar ātru vilcienu?', 'Tuša nosēžas tikai uz izciļņiem — mirgošana un gaiss', 'Līnija kļūst ideāli gluda', 'Tuša nemaz neturas', 'Šo efektu izmanto ekspresīvās skicēs un ar sausu otu.'],
      ['Kāpēc skiču burtnīcai jāatveras plakaniski 180°?', 'Lai vilktu garas līnijas un tuša nekrātos locījumā', 'Lai izskatītos dārgāka', 'Lai lapas nesaliptu', 'Straujš izliekums pie muguriņas lauž līniju un krāj tušu.'],
      ['Kā strādāt ar stikla spalvu?', 'Nespiest, lēni grozīt spalvu', 'Stipri spiest, lai galiņš atvērtos', 'Mērcēt pēc katra burta', 'Galiņš ir ciets; grozīšana izmanto tušu no visām rievām.']],
    task: { h: 'Materiālu izmēģinājumu karte', need: 'visas pildspalvas un tuša, kas ir (pietiek ar vienu lodīšu pildspalvu), skiču burtnīcas papīrs, ūdens vai ota ar rezervuāru', time: '20 min',
      steps: ['Sadali lapu rindās — pa rindai katram rīkam.', 'Katrā rindā: pārliecināta līnija, līnija no tievas uz biezu (spiediens), nedaudz svītrojuma un mazs aizpildīts melns kvadrāts.', 'Ja ir ūdens: kad tuša nožuvusi, pieskaries pusei melnā kvadrāta ar mitru otu. Palika vai atdzīvojās? Uzraksti “ūdensizturīga” vai “šķīstoša”.', 'Apgriez lapu: vai kaut kas izspiedās cauri? Atzīmē.', 'Paraksti katru rindu ar rīka nosaukumu un vienu vārdu par raksturu: “nervozs”, “samtains”, “paklausīgs”…'] },
    client: { name: 'Profesors Pūcis Tvīds', job: 'vēstuļu cienītājs, lasa pie kamīna', say: 'Hm-hm. Jaunais putniņ, es uzstāju: vēstules bija labākas par telefoniem. Bet pirms rakstu nākamo vēstuli uz 40 lapām, man jāzina, kura no tavām spalvām ir tās cienīga. Sagatavo man kārtīgu izmēģinājumu karti.',
      ask: ['Rinda katram rīkam: līnija, spiediens, svītrojums, melns kvadrāts', 'Atzīme: ūdensizturīga vai šķīstoša', 'Vārds par katra rīka raksturu'] },
  },
};
