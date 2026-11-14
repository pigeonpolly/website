// Данные 50 видео-пинов №379–428 (14.11.2026) для tools/pins/videos.js. Темы разные (по просьбе Алины — не всё про Новый год).
// tour: камера ездит по арту. stops: [cx, cy, h, подпись] — центр кадра (доли картинки) и видимая высота (доля высоты картинки);
//   intro / outro — крупные подписи на общем плане; reveal: true — начинаем с первой детали и в конце отъезжаем на общий план.
// pal: палитра арта из content/palettes.json (key) — арт, потом цвета по одному с названием и HEX.
// Подписи — шутки про героев и то, что видно на картинке; фактов об Алине не выдумывать.
const B = 'bird/', S = 'snail/', K = 'sketchbook/';
const bird = f => B + f + '.jpg', snail = f => S + f + '.jpg';
const G = { bird: '/art-portfolio/bird/', snail: '/art-portfolio/snail/', sk: '/art-portfolio/sketchbook/', hal: '/art-portfolio/halloween/', anx: '/art-portfolio/anxiety/', titos: '/titos/' };
const V = [];
const tour = (art, link, o) => V.push(Object.assign({ tpl: 'tour', art, link }, o));
const pal = (key, o) => V.push(Object.assign({ tpl: 'pal', key, link: '/palettes/#' + key }, o));

// --- Полли
tour(bird('2026-pigeon-polly-is-hiding-something'), G.bird, { intro: 'POV: your roommate’s bedtime routine', outro: 'Pigeon Polly is hiding something',
  stops: [[.47, .32, .5, 'the mirror: empty'], [.6, .45, .4, 'brushing fangs, not teeth'], [.1, .3, .5, 'lights: one candle, obviously']],
  title: 'POV: Your Roommate’s Bedtime Routine — Spooky Watercolor Pigeon', topics: 'spooky cute art, vampire aesthetic, watercolor illustration',
  desc: 'An empty mirror, a toothbrush and a single candle. Pigeon Polly’s very normal bedtime routine, in watercolor.',
  alt: 'Video moving over a watercolor of a pigeon in a pink robe brushing teeth in front of a mirror with no reflection, lit by a wall candle.' });
tour(bird('2026-pigeon-polly-fancy-life'), G.bird, { intro: 'the fancy life', outro: 'Pigeon Polly’s fancy life',
  stops: [[.62, .42, .5, 'headphones on, coffee in hand'], [.33, .85, .45, 'shopping bag: Fancy Life ✓'], [.27, .6, .5, 'neighbours: questionable'], [.8, .55, .45, 'today’s paper: Fancy News']],
  title: 'The Fancy Life vs Public Transport — Funny Watercolor Pigeon on a Tram', topics: 'funny illustration, public transport, watercolor and ink',
  desc: 'Headphones, coffee and a Fancy Life bag — on a crowded tram with a boar, a goat and a dog reading the news.',
  alt: 'Video panning across a watercolor of a pigeon with headphones and coffee sitting on a tram among animal passengers.' });
tour(bird('2026-pigeon-polly-fired-changing-remote-work-to-office-job-after-6-years'), G.bird, { intro: 'the last day at the office', outro: 'Pigeon Polly, after 6 years',
  stops: [[.22, .5, .55, 'packed: cactus, cards, mug'], [.55, .9, .35, 'the coffee didn’t make it'], [.65, .38, .4, 'colleague: pretending not to see']],
  title: 'Me Leaving the Office with a Box — Funny Watercolor Pigeon', topics: 'office humor, work memes, watercolor illustration',
  desc: 'A box with a cactus and a mug, a spilled coffee and a colleague who sees nothing. Pigeon Polly leaves the office.',
  alt: 'Video moving over a watercolor of a pigeon walking out of an office with a cardboard box, past a spilled coffee and a colleague at a desk.' });
tour(bird('2026-pigeon-polly-accidentaly-drinked-brush-watercolor-water'), G.bird, { intro: 'every watercolor artist, at least once', outro: 'it happens to the best of us',
  stops: [[.35, .6, .5, 'sipped the wrong glass'], [.65, .62, .4, 'the coffee was right there'], [.86, .6, .4, 'snack: worm chips']],
  title: 'Every Watercolor Artist at Least Once — Drinking the Brush Water', topics: 'artist humor, watercolor memes, sketchbook art',
  desc: 'The coffee was right there. The brush water was closer. A watercolor confession from Pigeon Polly.',
  alt: 'Video moving over a watercolor of a teary pigeon holding a glass of green brush water, next to a coffee mug and a bag of worm chips.' });
tour(bird('2026-pigeon-polly-keeps-busy-living'), G.bird, { intro: 'my quick five-minute break', outro: 'Pigeon Polly keeps busy living',
  stops: [[.32, .62, .4, 'phone ✓ snack ✓'], [.88, .55, .45, 'laundry: still waiting'], [.45, .32, .4, 'shelf: everything I bought to feel better']],
  title: 'My Quick Five-Minute Break — Relatable Watercolor Pigeon', topics: 'relatable humor, cozy bathroom, watercolor illustration',
  desc: 'Phone, snack, a pile of laundry and a shelf of bottles. A very short break that is definitely not 40 minutes long.',
  alt: 'Video moving over a watercolor of a pigeon sitting in a bathroom with a phone and a snack, a washing machine and a laundry pile beside her.' });
tour(bird('2026-pigeon-polly-seven-years-later'), G.bird, { intro: 'seven years later', outro: 'still studying',
  stops: [[.4, .2, .45, 'diplomas: on the wall'], [.6, .56, .4, 'University application, again'], [.28, .8, .4, 'fuel: worm chips and coffee']],
  title: 'Seven Years Later: Still Studying — Watercolor Pigeon Comic', topics: 'lifelong learning, student humor, watercolor illustration',
  desc: 'Diplomas on the wall, a new university application on the laptop. Pigeon Polly, seven years later.',
  alt: 'Video moving over a watercolor of a pigeon in a red hat at a laptop with a university application, diplomas framed on the wall.' });
tour(bird('2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year'), G.bird, { intro: 'the party guest list', outro: 'Pigeon Polly, Sam, Milka and the Horse',
  stops: [[.1, .4, .5, 'the Horse of the year ✓'], [.45, .35, .45, 'champagne, in bed'], [.75, .62, .45, 'Milka the cat: busy'], [.58, .86, .4, 'dinner: on the blanket']],
  title: 'A Party in Bed: Pigeon Polly, Sam, Milka the Cat and the Horse', topics: 'cozy party, funny illustration, cat art',
  desc: 'A horse by the tree, champagne in bed, a cat on the blanket and dinner right there. The coziest guest list.',
  alt: 'Video moving over a digital illustration of two birds in bed with champagne and a cat, a laughing horse by a decorated tree.' });
tour(bird('2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes'), G.bird, { intro: 'romanticizing autumn', outro: 'coffee, trains and autumn vibes',
  stops: [[.6, .45, .4, 'pumpkin mug ✓'], [.75, .27, .45, 'the view: golden fields'], [.25, .72, .45, 'packed: worm chips'], [.62, .63, .35, 'dessert: wobbly']],
  title: 'Romanticizing Autumn: Coffee and a Train Window — Cozy Watercolor', topics: 'autumn aesthetic, cozy train, watercolor illustration',
  desc: 'A pumpkin mug, golden fields outside the train window and snacks for the road. Autumn, romanticized.',
  alt: 'Video moving over a watercolor of a pigeon in a puffy jacket with a pumpkin mug at a train window, golden fields outside.' });
tour(bird('2024-pigeon-polly-bath-relax'), G.bird, { intro: 'self-care, a realistic version', outro: 'Pigeon Polly’s bath relax',
  stops: [[.76, .45, .4, 'face mask ✓'], [.42, .6, .35, 'duck supervisor ✓'], [.3, .55, .4, 'laptop on the bath tray'], [.12, .92, .35, 'slippers: waiting']],
  title: 'Self-Care, a Realistic Version — Bath Time Pigeon Illustration', topics: 'self care, bath aesthetic, cozy illustration',
  desc: 'A face mask, a rubber duck and a laptop on the bath tray. Relaxing, almost.',
  alt: 'Video moving over a digital illustration of a pigeon in a bubble bath with a face mask, a rubber duck and a laptop on a bath tray.' });
tour(bird('2023-pigeon-polly-thinking-about-relocation-to-mars'), G.bird, { intro: 'plan B', outro: 'Pigeon Polly thinking about Mars',
  stops: [[.62, .6, .5, 'move to Mars'], [.2, .66, .45, 'plant sunflowers'], [.9, .6, .45, 'build a tiny house'], [.85, .15, .4, 'no emails up here']],
  title: 'Plan B: Move to Mars and Grow Sunflowers — Pigeon Astronaut Art', topics: 'space art, funny illustration, sunflowers',
  desc: 'A space suit, a row of sunflowers and a little dome. Pigeon Polly’s very reasonable plan B.',
  alt: 'Video moving over an illustration of a pigeon in a space suit on Mars next to sunflowers and a small dome house.' });
tour(bird('2022-pigeon-polly-graphic-designer'), G.bird, { intro: 'graphic designer starter pack', outro: 'Pigeon Polly, graphic designer',
  stops: [[.6, .62, .4, 'palette + three brushes'], [.27, .27, .4, 'logo: framed'], [.92, .3, .45, 'pen tool, but real'], [.12, .76, .4, 'swatches for “make it pop”']],
  title: 'Graphic Designer Starter Pack — Funny Pigeon Illustration', topics: 'graphic design humor, designer life, digital illustration',
  desc: 'Palette, brushes, a framed logo, a giant pen tool and swatches for when the client says “make it pop”.',
  alt: 'Video moving over an illustration of a pigeon in a beret holding a palette and brushes, a framed PP logo and a pen nib around her.' });
tour(bird('2022-pigeon-polly-started-own-small-business'), G.bird, { intro: 'starting a small business', outro: 'Pigeon Polly’s small business',
  stops: [[.58, .45, .4, 'staff: me'], [.4, .18, .5, 'branding: one giant ice cream'], [.62, .82, .4, 'menu: coffee, latte, espresso']],
  title: 'Starting a Small Business: an Ice Cream Van — Cute Pigeon Art', topics: 'small business humor, ice cream truck, summer illustration',
  desc: 'One van, one giant ice cream on the roof and one employee who is also the owner.',
  alt: 'Video moving over an illustration of a pigeon in the window of a yellow ice cream van with a giant cone on the roof and a coffee sign.' });
tour(bird('2022-pigeon-polly-summer-lover'), G.bird, { intro: 'summer plans', outro: 'Pigeon Polly, summer lover',
  stops: [[.42, .16, .4, 'hat bigger than me ✓'], [.6, .4, .4, 'one good book ✓'], [.25, .5, .35, 'iced drink ✓'], [.78, .35, .4, 'swimming: maybe tomorrow']],
  title: 'Summer Plans: Big Hat, Good Book, Iced Drink — Beach Pigeon Art', topics: 'summer aesthetic, beach reading, cute illustration',
  desc: 'A huge hat, a book, an iced drink and a swim ring for later. The only summer plan you need.',
  alt: 'Video moving over an illustration of a pigeon in a big sun hat reading on a beach chair with an iced drink and a swim ring.' });
tour(bird('2019-pigeon-polly-writing-diploma'), G.bird, { intro: 'writing the diploma', outro: 'Pigeon Polly writing her diploma',
  stops: [[.45, .6, .45, 'file name: Diploma1'], [.62, .8, .4, 'face: the whole thesis'], [.75, .38, .4, 'fuel: worm chips + coffee']],
  title: 'Writing the Diploma: Thesis Season Mood — Watercolor Pigeon', topics: 'student life, thesis humor, watercolor illustration',
  desc: 'A laptop with Diploma1, fairy lights, worm chips and coffee. Thesis season in one face.',
  alt: 'Video moving over a watercolor of a tired pigeon at a laptop with a document called Diploma, fairy lights and snacks on the desk.' });

// --- Мистер Чу
tour(snail('2025-mr-chew-opened-pumpkin-spice-latte-season'), G.snail, { intro: 'pumpkin spice season is open', outro: 'Mr.Chew opened the season',
  stops: [[.27, .65, .5, 'shell: pumpkin ✓'], [.73, .72, .4, 'latte with extra cream ✓'], [.82, .35, .4, 'caramel apple ✓']],
  title: 'Pumpkin Spice Season Is Open — Cute Snail with a Latte', topics: 'pumpkin spice, autumn aesthetic, cute snail art',
  desc: 'A jack-o’-lantern shell, a scarf, a latte with cream and a caramel apple. Mr.Chew is ready for autumn.',
  alt: 'Video moving over a watercolor of a snail with a pumpkin shell and a scarf, a whipped cream latte and a caramel apple.' });
tour(snail('2025-mr-chew-travel-edition-can-you-find-polly'), G.snail, { intro: 'can you find Polly?', outro: 'found her?',
  stops: [[.3, .55, .45, 'camera ✓ sticker ✓'], [.72, .45, .45, 'souvenirs: a traffic cone?'], [.56, .49, .3, 'there she is!']],
  title: 'Can You Find Polly? A Travel Snail Puzzle Illustration', topics: 'hidden picture, travel art, cute snail',
  desc: 'Mr.Chew packed for a trip: a camera, stickers, a traffic cone — and someone else. Can you find Pigeon Polly?',
  alt: 'Video moving over a watercolor of a snail with a camera and a packed suitcase shell, ending on a pigeon eye peeking out of the suitcase.' });
tour(snail('2025-sometimes-mr-chew-wants-to-be-retired'), G.snail, { intro: 'sometimes I want to be retired', outro: 'Mr.Chew, retired (for a day)',
  stops: [[.47, .27, .4, 'glasses on'], [.52, .8, .4, 'knitting something long'], [.68, .65, .4, 'apples from the garden'], [.45, .94, .3, 'tea, always']],
  title: 'Sometimes I Just Want to Be Retired — Cozy Snail Illustration', topics: 'cozy aesthetic, knitting, cute snail art',
  desc: 'Glasses, knitting, a basket of apples, a newspaper and tea. Mr.Chew tries retirement for a day.',
  alt: 'Video moving over a watercolor of a snail in glasses with knitting, a basket of apples, a newspaper and a cup of tea.' });
tour(snail('2024-halloween-edition'), G.snail, { intro: 'Halloween mood', outro: 'Mr.Chew, Halloween edition',
  stops: [[.35, .58, .45, 'shell: carved ✓'], [.4, .45, .35, 'apple bobbing, inside'], [.75, .88, .35, 'caramel apple on a stick']],
  title: 'Halloween Mood: Carved Pumpkin Shell — Cute Snail Watercolor', topics: 'cute halloween, pumpkin art, watercolor',
  desc: 'A carved pumpkin shell full of apples, a witch hat and a caramel apple. Mr.Chew does Halloween.',
  alt: 'Video moving over a watercolor of a snail in a witch hat whose shell is a carved pumpkin with apples floating inside.' });
tour(snail('2024-mr-chew-dnd-edition'), G.snail, { intro: 'roll for initiative', outro: 'Mr.Chew, D&D edition',
  stops: [[.26, .58, .45, 'cauldron: bubbling'], [.62, .75, .35, 'd20: natural 20'], [.82, .68, .35, 'potion of questionable origin'], [.45, .4, .4, 'wizard hat ✓']],
  title: 'Roll for Initiative: Wizard Snail with a d20 — Fantasy Illustration', topics: 'dnd art, fantasy illustration, cute wizard',
  desc: 'A bubbling cauldron, a natural 20 and a potion nobody should drink. Mr.Chew is ready for the session.',
  alt: 'Video moving over an illustration of a snail in a wizard hat with a green cauldron, an orange d20 die and a potion bottle.' });
tour(snail('2024-mr-chew-steamphunk-edition'), G.snail, { intro: 'steampunk upgrade', outro: 'Mr.Chew, steampunk edition',
  stops: [[.55, .6, .35, 'speedometer installed'], [.86, .3, .4, 'periscope antennae'], [.25, .3, .45, 'exhaust: green steam'], [.27, .45, .3, 'idea lamp included']],
  title: 'Steampunk Snail Upgrade — Watercolor and Ink Illustration', topics: 'steampunk art, watercolor and ink, creative illustration',
  desc: 'A copper shell with a speedometer, periscope antennae and green steam. Mr.Chew got an upgrade.',
  alt: 'Video moving over a watercolor of a snail with a copper steampunk shell, pipes, a gauge and green steam.' });
tour(snail('2024-mr-chew-celebrates-valentines-day'), G.snail, { intro: 'Valentine’s Day mood', outro: 'snail u',
  stops: [[.6, .2, .4, 'antennae: heart-shaped'], [.45, .6, .4, 'shell: covered in kisses'], [.3, .45, .45, 'message: snail u']],
  title: 'Snail U: a Cute Valentine’s Day Snail Illustration', topics: 'valentines day art, cute card idea, snail pun',
  desc: 'Heart antennae, a shell covered in kisses and a garland of hearts. A Valentine pun from Mr.Chew.',
  alt: 'Video moving over a watercolor of a snail with heart-shaped antennae and a shell covered in lipstick kisses, with the words snail u.' });
tour(snail('2024-mr-chew-gardening-edition'), G.snail, { intro: 'gardening plans', outro: 'Mr.Chew, gardening edition',
  stops: [[.35, .25, .45, 'tools: all of them'], [.78, .5, .35, 'this plant has a face'], [.5, .86, .35, 'this one bites'], [.92, .55, .4, 'cactus: low maintenance']],
  title: 'Gardening Plans: Tools, Pots and One Plant That Bites — Snail Art', topics: 'gardening aesthetic, plant humor, watercolor',
  desc: 'A wall of tools, a watering can, a plant with a face and a Venus flytrap. Mr.Chew’s garden shed.',
  alt: 'Video moving over a watercolor of a snail in a garden shed with tools on the wall, potted plants, a cactus and a Venus flytrap.' });
tour(snail('2023-mr-chew-australian-postal-snail-introduction'), G.snail, { intro: 'meet your new postman', outro: 'delivery time: eventually',
  stops: [[.65, .47, .35, 'official sign ✓'], [.5, .55, .3, 'stamp, held with care'], [.35, .45, .35, 'parcel strapped on']],
  title: 'Meet Your New Postman: the Postal Snail — Snail Mail Art', topics: 'snail mail, cute illustration, watercolor and ink',
  desc: 'An official sign, a stamp held with care and a parcel strapped to the shell. Your letter is on its way. Slowly.',
  alt: 'Video moving over a watercolor of a snail in glasses holding a stamp, with a parcel on its shell and a sign reading Australian postal snail.' });
tour(snail('2023-mr-chew-be-careful-on-the-road-ii'), G.snail, { intro: 'be careful on the road', outro: 'Mr.Chew on the road',
  stops: [[.55, .62, .35, 'carrying a traffic cone'], [.62, .3, .35, 'safety glasses ✓'], [.85, .9, .35, 'speed: careful']],
  title: 'Be Careful on the Road: a Snail with a Traffic Cone', topics: 'cute illustration, road safety, funny art',
  desc: 'Glasses on, a traffic cone in hand, crossing the road at a very safe speed.',
  alt: 'Video moving over an illustration of a snail in round glasses carrying a traffic cone across a road.' });
tour(snail('2023-mr-chew-booklyne-nine-nine-edition'), G.snail, { intro: 'detective mode: on', outro: 'Mr.Chew, Brooklyn Nine-Nine edition',
  stops: [[.66, .45, .4, 'sunglasses ✓ case file ✓'], [.52, .45, .35, 'hat: 99'], [.66, .88, .35, 'evidence: one donut'], [.33, .2, .45, 'explosion: very cool']],
  title: 'Detective Mode On: a Cop Snail with a Donut — Fan Art Watercolor', topics: 'detective art, fan art, funny illustration',
  desc: 'Sunglasses, a case file, a 99 cap, a donut and a big KABOOM behind. Detective snail at work.',
  alt: 'Video moving over a watercolor of a snail in sunglasses with a police cap and a donut, crime scene tape and a cartoon explosion behind.' });
tour(snail('2023-mr-chew-delivery'), G.snail, { intro: 'express delivery', outro: 'Mr.Chew delivery',
  stops: [[.45, .15, .5, 'engine: five butterflies'], [.42, .55, .35, 'parcel: the whole shell'], [.62, .7, .4, 'arrival: someday']],
  title: 'Express Delivery by Butterfly — Cute Flying Snail Illustration', topics: 'cute illustration, delivery humor, whimsical art',
  desc: 'Five purple butterflies lift a snail with a parcel shell into the sky. Express delivery, snail style.',
  alt: 'Video moving over an illustration of a snail carried through the sky by five purple butterflies, with a delivery label on its shell.' });
tour(snail('2023-mr-chew-take-away-coffee'), G.snail, { intro: 'coffee to go', outro: 'Mr.Chew, take away coffee',
  stops: [[.6, .3, .35, 'reading glasses on'], [.88, .82, .35, 'cup: thimble-sized'], [.4, .96, .3, 'reading: Poirot'], [.35, .55, .45, 'fairy lights, for mood']],
  title: 'Coffee to Go, Snail Size — Cozy Watercolor Snail', topics: 'coffee lover, cozy aesthetic, watercolor and ink',
  desc: 'A thimble cup of coffee, a Poirot book and fairy lights around the shell. A tiny cozy coffee break.',
  alt: 'Video moving over a watercolor of a snail in glasses with fairy lights on its shell, a thimble cup and a Poirot book.' });
tour(snail('2023-mr-chew-coffee-passion'), G.snail, { intro: 'Monday morning upgrade', outro: 'more passion, more energy',
  stops: [[.35, .6, .45, 'shell: a full coffee pot'], [.62, .72, .35, 'secured with a belt'], [.25, .25, .4, 'motto of the day']],
  title: 'Monday Morning Upgrade: a Coffee Pot Shell — Snail Watercolor', topics: 'coffee art, monday mood, watercolor illustration',
  desc: 'A snail whose shell is a full coffee pot, buckled on with a belt. More passion, more energy.',
  alt: 'Video moving over a watercolor of a snail carrying a glass coffee pot as a shell, held by a leather belt, with the words more passion more energy.' });

// --- Титос и Хеллоуин
tour('detective/2024-detective-mr-titos-in-the-office-late-night.jpg', G.titos, { intro: 'a detective’s night', outro: 'Detective Mr.Titos',
  stops: [[.55, .18, .5, 'evidence board: strings everywhere'], [.15, .35, .45, 'archives, by year'], [.75, .75, .4, 'coffee: cold again'], [.8, .92, .3, 'name on the desk']],
  title: 'A Detective’s Night: Files, Strings and Coffee — Cozy Mystery Art', topics: 'cozy mystery, detective aesthetic, watercolor',
  desc: 'An evidence board full of strings, archive boxes, cold coffee and a name plate. Mr.Titos works late. Play his cases on the site.',
  alt: 'Video moving over a watercolor of a detective at a desk lit by a lamp, an evidence board with strings and archive boxes behind.' });
tour('halloween/halloween-poirot.jpg', G.hal, { intro: 'a very famous detective', outro: 'the little grey pumpkin cells',
  stops: [[.32, .3, .4, 'bowler hat ✓'], [.55, .62, .35, 'moustache: perfect'], [.6, .85, .35, 'walking cane ✓'], [.82, .7, .3, 'one tiny vase of lavender']],
  title: 'A Very Famous Detective, Pumpkin Edition — Watercolor Halloween', topics: 'detective fan art, pumpkin art, watercolor',
  desc: 'A bowler hat, a perfect moustache, a walking cane and a tiny vase. A pumpkin with excellent little grey cells.',
  alt: 'Video moving over a watercolor of a pumpkin with a bowler hat, a curled moustache and a walking cane, next to a small vase of lavender.' });

// --- Скетчбук (общие советы по рисованию, без выдуманных фактов)
const SK = n => K + 'sketchbook-' + n + '.jpg';
tour(SK(9), G.sk, { intro: 'a cozy evening, in my sketchbook', outro: 'draw your own evening',
  stops: [[.3, .25, .4, 'bookshelf + fairy lights'], [.4, .6, .4, 'one is reading'], [.72, .5, .45, 'one is bringing snacks']],
  title: 'A Cozy Evening in My Sketchbook — Watercolor Sketchbook Page', topics: 'sketchbook ideas, cozy home, watercolor sketch',
  desc: 'A bookshelf with fairy lights, someone reading in a big blanket and someone bringing snacks. Draw your own evening.',
  alt: 'Video moving over a watercolor sketchbook spread of a cozy room with a bookshelf, one person reading and another carrying snacks.' });
tour(SK(6), G.sk, { intro: 'draw what’s in front of you', outro: 'even a concrete mixer',
  stops: [[.45, .55, .45, 'a concrete mixer'], [.6, .2, .4, 'numbers on the wall: free composition'], [.15, .72, .35, 'date it, always']],
  title: 'Draw What’s in Front of You: a Concrete Mixer in My Sketchbook', topics: 'sketchbook ideas, urban sketching, watercolor',
  desc: 'Garage numbers, a concrete mixer and a date in the corner. Anything can be a sketchbook page.',
  alt: 'Video moving over a watercolor sketchbook page of a yellow concrete mixer truck in front of numbered garages.' });
tour(SK(7), G.sk, { intro: 'how to draw rooftops', outro: 'rooftops in my sketchbook',
  stops: [[.38, .25, .4, '1. start with the tallest tower'], [.5, .75, .4, '2. tiles: just wavy lines'], [.85, .62, .4, '3. warm windows last']],
  title: 'How to Draw Rooftops: 3 Easy Steps — Watercolor and Ink', topics: 'urban sketching tips, rooftops, watercolor and ink',
  desc: 'Start with the tallest tower, draw tiles as wavy lines and add warm windows last. Rooftops made simple.',
  alt: 'Video moving over a watercolor and ink sketch of old rooftops with towers and a dome under a blue sky.' });
tour(SK(8), G.sk, { intro: 'plein air in 20 minutes?', outro: 'just go outside',
  stops: [[.45, .6, .45, 'pick one house'], [.42, .48, .3, 'ink the windows'], [.4, .35, .45, 'a pen is enough']],
  title: 'Plein Air Sketching: Pick One House — Watercolor Sketchbook', topics: 'plein air, urban sketching, sketchbook ideas',
  desc: 'One house, a pen and a little watercolor. You don’t need the whole street.',
  alt: 'Video moving over a hand holding a sketchbook with a watercolor sketch of an old brick house, with the real street blurred behind.' });
tour(SK(10), G.sk, { intro: 'portrait practice', outro: 'a detective in watercolor',
  stops: [[.45, .2, .4, 'the hat: big shapes first'], [.42, .5, .35, 'the eyes tell everything'], [.48, .62, .3, 'moustache: the hero'], [.75, .85, .35, 'a little detail on the lapel']],
  title: 'Watercolor Portrait Practice: a Famous Detective', topics: 'portrait drawing, watercolor portrait, fan art',
  desc: 'Big shapes first, then the eyes, then the famous moustache. Watercolor portrait practice.',
  alt: 'Video moving over a watercolor portrait of a man in a bowler hat with a curled moustache and a bow tie.' });
tour(SK(11), G.sk, { intro: 'draw your coffee maker', outro: 'still life, every morning',
  stops: [[.55, .35, .4, 'shiny metal: leave white paper'], [.5, .78, .35, 'polka dot cup ✓'], [.1, .12, .35, 'the palette, mid-mess']],
  title: 'Draw Your Coffee Maker: Morning Still Life in Watercolor', topics: 'still life ideas, coffee art, watercolor tips',
  desc: 'For shiny metal, leave white paper. A coffee maker and a polka dot cup on a sketchbook page.',
  alt: 'Video moving over a watercolor sketch of a lever espresso maker above a red polka dot cup, a paint palette in the corner.' });
tour(SK(14), G.sk, { intro: 'a street in Mérida, Mexico', outro: 'travel sketchbook',
  stops: [[.25, .55, .45, 'patterned gate'], [.45, .2, .4, 'tree: loose green washes'], [.75, .75, .35, 'the address, written by hand']],
  title: 'Travel Sketchbook: a Street in Mérida, Mexico — Watercolor', topics: 'travel sketching, mexico, urban sketching',
  desc: 'A patterned gate, a tree in loose green washes and the address written by hand. A travel sketchbook page.',
  alt: 'Video moving over a watercolor sketch of a pink wall with a patterned gate, a tree and plants, with a handwritten address.' });
tour(SK(12), G.sk, { intro: 'sketching in a café', outro: 'order a coffee, open your sketchbook',
  stops: [[.45, .45, .55, 'the counter, in one wash'], [.68, .45, .5, 'the menu board'], [.5, .88, .45, 'and my own cup']],
  title: 'Sketching in a Café: Draw the Counter and Your Cup', topics: 'cafe sketching, urban sketching, watercolor sketchbook',
  desc: 'The counter in one wash, the menu board and your own cup. The easiest place to start urban sketching.',
  alt: 'Video moving over a watercolor sketchbook spread of a café counter with a coffee machine and a cup on the table.' });
tour(SK(13), G.sk, { intro: 'draw your breakfast', outro: 'kitchen sketchbook',
  stops: [[.3, .7, .55, 'something in the pan'], [.78, .62, .55, 'a big bowl'], [.5, .3, .55, 'jars on the shelf']],
  title: 'Draw Your Breakfast: a Kitchen Sketchbook Spread', topics: 'food sketching, kitchen art, sketchbook ideas',
  desc: 'A pan, a bowl and jars on the shelf. Breakfast is the easiest still life of the day.',
  alt: 'Video moving over a watercolor sketchbook spread of a kitchen counter with a frying pan, a bowl and jars.' });
tour(SK(20), G.sk, { intro: 'a quick street sketch', outro: 'loose and fast',
  stops: [[.25, .48, .45, 'the bus: a simple box'], [.55, .32, .45, 'stripes of the tower'], [.5, .7, .45, 'let the colors run']],
  title: 'A Quick Street Sketch: Loose Watercolor in Minutes', topics: 'loose watercolor, urban sketching, sketchbook',
  desc: 'Draw the bus as a simple box, add the striped tower and let the colors run.',
  alt: 'Video moving over a loose watercolor sketch of a street with a bus and a red and white striped tower.' });
tour('photos/camera.jpg', G.sk, { intro: 'an old camera in watercolor', outro: 'painted on splashes',
  stops: [[.5, .55, .5, 'the lens took the longest'], [.62, .25, .45, 'the strap: two lines'], [.3, .75, .5, 'background: let it splash']],
  title: 'An Old Camera in Watercolor and Ink: Splashy Background', topics: 'vintage camera art, watercolor and ink, still life',
  desc: 'A vintage twin-lens camera inked over loose orange and teal splashes.',
  alt: 'Video moving over a watercolor of a vintage twin-lens camera with a strap, painted over orange and teal splashes.' });
tour('photos/geranium.jpg', G.sk, { intro: 'red geraniums', outro: 'flowers in watercolor',
  stops: [[.55, .3, .5, 'flowers: dots of red'], [.5, .65, .5, 'leaves: round and wet'], [.25, .4, .5, 'background: bold violet']],
  title: 'Red Geraniums on Violet: Loose Watercolor Flowers', topics: 'watercolor flowers, loose painting, botanical',
  desc: 'Red flowers as dots, round wet leaves and a bold violet background.',
  alt: 'Video moving over a watercolor of red geraniums in a pot on a deep violet background.' });
tour('anxiety/anxiety-2.jpg', G.anx, { intro: 'It arrives unnoticed.', outro: 'Sprouts of Anxiety',
  stops: [[.35, .3, .45, 'a faint tremor at the edge of perception'], [.4, .7, .45, 'not yet panic, not yet chaos'], [.6, .45, .5, 'but already taking root']],
  title: 'Sprouts of Anxiety: Abstract Ink and Watercolor', topics: 'abstract art, mental health art, ink painting',
  desc: 'Red and orange ink spreading like roots. From the series Sprouts of Anxiety by Alina Otkinska.',
  alt: 'Video moving over an abstract painting of red, orange and yellow ink spreading like roots.' });

// --- Палитры
pal('2022-pigeon-polly-celebrates-dia-de-muertos', { name: 'Día de Muertos', title: 'Día de Muertos Color Palette with HEX Codes — Pigeon Polly', topics: 'color palette, dia de muertos, hex codes',
  desc: 'Marigold, purple and bone white from a Día de Muertos pigeon illustration. Every color with its HEX code.',
  alt: 'Video of a Día de Muertos pigeon illustration followed by its color swatches with names and HEX codes.' });
pal('2024-mr-chew-rainbow-candy-edition', { title: 'Rainbow Candy Color Palette with HEX Codes — Cute Snail', topics: 'color palette, pastel rainbow, hex codes',
  desc: 'Candy pinks, blues and a sunny yellow from a unicorn snail watercolor. Every color with its HEX code.',
  alt: 'Video of a rainbow unicorn snail watercolor followed by its color swatches with names and HEX codes.' });
pal('sketchbook-17', { title: 'Persimmon Season Color Palette with HEX Codes', topics: 'color palette, autumn colors, hex codes',
  desc: 'Persimmon orange on a bright blue page. A fresh autumn palette with HEX codes.',
  alt: 'Video of a sketchbook page with persimmons on blue followed by its color swatches with names and HEX codes.' });
pal('2023-mr-chew-lgbtq-edition', { title: 'Spotlight Rainbow Color Palette with HEX Codes', topics: 'color palette, rainbow colors, hex codes',
  desc: 'A rainbow shell in a warm spotlight on a dark stage. Bold colors with HEX codes.',
  alt: 'Video of a rainbow-shelled snail on a spotlit stage followed by its color swatches with names and HEX codes.' });
pal('halloween-in-blue', { title: 'Halloween in Blue Color Palette with HEX Codes', topics: 'color palette, moody blue, hex codes',
  desc: 'A moody blue palette from a watercolor illustration. Every color with its HEX code.',
  alt: 'Video of a blue watercolor illustration followed by its color swatches with names and HEX codes.' });
pal('challenge-pigeonpolly-cactus-4-10-2026', { name: 'Cactus', title: 'Cactus Green Color Palette with HEX Codes', topics: 'color palette, plant colors, hex codes',
  desc: 'Greens and warm pot colors from a cactus drawing. Every color with its HEX code.',
  alt: 'Video of a cactus drawing followed by its color swatches with names and HEX codes.' });
pal('anxiety-4', { title: 'Abstract Ink Color Palette with HEX Codes', topics: 'color palette, abstract art, hex codes',
  desc: 'Electric purple, orange and red from an abstract ink painting. Every color with its HEX code.',
  alt: 'Video of an abstract yellow and black ink painting followed by its color swatches with names and HEX codes.' });

module.exports = { V, FIRST: 379 };
