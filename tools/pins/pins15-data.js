// Пины №826–945 «Artist lifestyle / Behind the artist camera» (движок pins13.js: SET=15 node tools/pins/pins13.js).
// Фото Алины (Google Диск 16.11, селфи, жизнь, свои фото-референсы) — tools/pins/life/, палитры фото — tools/pins/life/palettes.json (tools/pins/life_pal.py).
// Каждое фото — минимум в 2 пинах (проверка внизу). Ссылка у всех — просто на сайт (Алина 16.11).
const LINK = 'https://www.pigeonpolly.com';
const F = k => `life/${k}.jpg`, P = k => `photos2/${k}.jpg`, B = k => `bird/${k}.jpg`, S = k => `snail/${k}.jpg`, H = k => `halloween/${k}.jpg`;
const PAL = require('./life/palettes.json');
const TL = 'Topics: Artist lifestyle, Behind the scenes, Artist aesthetic, Creative life, Day in the life of an artist';
const TA = 'Topics: Artist and artwork, Art inspiration, Illustration, Watercolor art, Artist aesthetic';
const TP = 'Topics: Color palettes, Color inspiration, Photo color palette, Art references, Color combinations';
const TR = 'Topics: Photo references, Art references, Drawing inspiration, Artist tips, Sketchbook ideas';
const TM = 'Topics: Artist memes, Artist humor, Relatable artist, Creative life, Artist lifestyle';

// что на фото (для alt)
const PH = {
  'selfie-mask': 'the artist in a red bandana and burgundy coat on a winter street', 'selfie-gingham': 'the artist in a gingham top against a grey-blue wall',
  'selfie-door': 'the artist in a magenta jacket next to an amber wooden door', 'selfie-sofa': 'the artist in a white sweatshirt with a hand in her hair',
  'selfie-curls': 'the artist with curly red hair in warm light', 'selfie-hand': 'the artist peeking from behind her hand with red lips',
  'selfie-terracotta': 'the artist smiling softly in a terracotta tee', 'selfie-golden': 'the artist with copper waves in golden-hour light',
  'selfie-sakura': 'the artist under a blooming cherry tree at golden hour', 'selfie-pendant': 'the artist in a black v-neck with a round pendant',
  'selfie-chair': 'the artist relaxing in a chair with a knitted throw', 'selfie-lilac-headphones': 'the artist with copper finger waves and lilac headphones in a park',
  'selfie-waves': 'the artist with copper finger waves on a city street', 'selfie-orange': 'the artist with orange eyeshadow and a red-orange jacket',
  'selfie-bored': 'the artist resting her chin on her hand in warm lamp light', 'selfie-glitter': 'the artist with glitter freckles in a mustard jacket',
  'selfie-bluelines': 'the artist with blue eyeliner and red lipstick', 'selfie-white-headphones': 'the artist in white headphones with an arm over her head',
  'selfie-eyepatches': 'the artist with orange under-eye patches', 'selfie-purple-glasses': 'the artist in round purple sunglasses',
  'selfie-curly-mustard': 'the artist with curly red hair, headphones and a mustard jacket', 'selfie-amiartist': 'a close-up of the artist twirling her red hair',
  'selfie-olive': 'the artist against an olive wall', 'selfie-bw': 'a black-and-white winter selfie of the artist in a chunky knit scarf',
  'selfie-earphones': 'the artist with wired earphones in a magenta jacket in an autumn park', 'selfie-armface': 'the artist covering her face with her arm, red lips and a patterned blouse',
  'selfie-azalea': 'the artist next to an orange azalea bush', 'life-coffee-park': 'the artist sipping coffee in a park in a tropical dress',
  'life-snail': 'the artist posing with a giant rainbow snail sculpture', 'life-plush': 'the artist hugging a giant green plush dinosaur in a shop',
  'life-ferry': 'the artist in a hood on a ferry deck with the sea behind', 'life-helm': 'the artist at a ship wheel shading her eyes',
  'life-cat': 'a ginger cat sitting on the artist’s shoulder', 'life-firsttrip': 'a younger artist holding a plush fish on her first trip',
  'life-leopard-hat': 'the artist in a fluffy leopard hat in front of a watercolor painting of Christmas baubles', 'life-sketchbook-tram': 'the artist on a tram showing her open sketchbook',
  'life-medal': 'the artist proudly showing a race medal', 'life-towel-latte': 'the artist in a towel turban with face cream holding a cappuccino',
  'life-drums': 'the artist sitting at a drum kit with a shrug', 'life-wand': 'the artist holding a wand with a smirk',
  'life-mushroom': 'the artist amazed by a glittery mushroom decoration in a shop', 'life-purple-wig': 'the artist in a purple wig at a purple door with a yellow frame',
  'life-curlers': 'the artist in pink hair curlers making a peace sign', 'life-pumpkin-head': 'the artist balancing a ceramic pumpkin on her head',
  'life-cat-desk': 'the artist in glasses with a ginger cat loafing on her desk', 'life-autumn-leaves': 'the artist throwing autumn leaves in a park',
  'life-bubbles': 'the artist blowing soap bubbles under pine trees', 'life-sphynx': 'half of the artist’s face with a sphynx cat on her shoulder',
  'life-childhood': 'the artist as a little girl holding a cactus', 'ref-dahlias': 'a reference photo of a graffiti box next to orange dahlias',
  'ref-heels-snow': 'a reference photo of black heels left in the snow', 'ref-fence': 'a reference photo of a green fence and bare branches at blue hour',
  'ref-peppers': 'a reference photo of red chili peppers in a café window', 'ref-lamp': 'a reference photo of an old caged lamp on a coral box',
  'ref-rowan': 'a reference photo of orange rowan berries',
};
const altDuo = (me, art, what) => `Side by side: ${PH[me]} and ${what} by Pigeon Polly.`;
const base = (n, o) => Object.assign({ n, th: 'night', link: LINK, foot: 'pigeonpolly.com', type: 'Арт', topics: TL }, o);
const desc = s => `${s} Behind the artist camera at Pigeon Polly Art Lab — everyday life, references and the art that grows out of them. More art on pigeonpolly.com.`;

// 1) художник и работа (49)
const DUO = [
  ['selfie-hand', B('2026-pigeon-polly-is-hiding-something'), 'the painting “Pigeon Polly is hiding something”', 'artist & artwork', 'Both of us are <em>hiding something</em>', 'same energy, different species', 'Artist and Artwork: Both Hiding Something', 'A selfie peeking from behind my hand next to my painting “Pigeon Polly is hiding something”. Sometimes the artist and the art share a mood.'],
  ['life-towel-latte', S('2025-mr-chew-opened-pumpkin-spice-latte-season'), 'the painting of Mr. Chew the snail opening pumpkin spice latte season', 'latte mornings', 'Latte mornings: <em>me vs my snail</em>', 'same cup energy, different shell', 'Latte Mornings: The Artist vs Her Snail Character', 'Towel turban, face cream and a cappuccino — and Mr. Chew the snail opening pumpkin spice latte season in my painting.'],
  ['life-snail', S('2024-mr-chew-rainbow-candy-edition'), 'the painting of Mr. Chew the snail, rainbow candy edition', 'artist & character', 'Met a giant snail. <em>Felt seen.</em>', 'I paint a snail called Mr. Chew — the city noticed', 'Artist Meets a Giant Snail (She Paints One Too)', 'Posing with a giant rainbow snail on the street, next to my rainbow candy edition of Mr. Chew the snail.'],
  ['life-mushroom', P('mushroom_house'), 'a watercolor mushroom house', 'reference spotted', 'When a shop mushroom <em>matches your painting</em>', 'artists see references everywhere', 'When the Shop Decor Matches Your Painting', 'A glittery mushroom in a Christmas shop and my watercolor mushroom house. Once you paint mushrooms, you see them everywhere.'],
  ['life-pumpkin-head', H('halloween-lady'), 'the painting of a pumpkin-headed lady', 'pumpkin season', 'Pumpkin heads: <em>the artist and the painting</em>', 'October brings out the portrait painter in me', 'Pumpkin Heads: The Artist and Her Halloween Painting', 'A ceramic pumpkin on my head and a pumpkin-headed lady in my Halloween painting. October is a mood.'],
  ['life-bubbles', B('2022-pigeon-polly-summer-lover'), 'the painting “Pigeon Polly summer lover”', 'be like a child', 'Be like a child — <em>in life and in art</em>', 'play first, judge later', 'Be Like a Child: In Life and in Art', 'Blowing soap bubbles under the pines, next to my painting of Pigeon Polly enjoying summer. Play is where the ideas come from.'],
  ['life-coffee-park', S('2023-mr-chew-take-away-coffee'), 'the painting of Mr. Chew with take-away coffee', 'coffee walks', 'Coffee walk: <em>the artist vs the snail</em>', 'everyone needs their take-away coffee', 'Coffee Walk: The Artist vs Her Snail', 'Coffee in the park on a blue-sky day, and Mr. Chew the snail with his own take-away coffee in my painting.'],
  ['life-sketchbook-tram', P('tram_man'), 'an ink and watercolor tram sketch', 'urban sketching', 'Sketching strangers <em>on the tram</em>', 'my commute is my studio', 'Sketching Strangers on the Tram', 'Headphones on, sketchbook open on the tram — and one of the passengers drawn in ink and watercolor.'],
  ['life-cat', P('cats_sketch'), 'pencil sketches of cat faces', 'the model', 'The model <em>and the sketches</em>', 'cats make the best (and worst) models', 'The Cat Model and the Cat Sketches', 'A ginger cat on my shoulder and a page of pencil cat faces. Cats never hold a pose, so you learn to draw fast.'],
  ['life-cat-desk', P('train_inking_cat'), 'an ink sketch with a sleeping cat', 'studio supervisor', 'Every artist’s desk <em>has a supervisor</em>', 'the cat approves of the warm laptop', 'Every Artist’s Desk Has a Cat Supervisor', 'A ginger cat loafing on my desk, and an ink sketch with a sleeping cat. Studio life, honestly.'],
  ['life-sphynx', B('2026-pigeon-polly-sam-milka-cat-and-horse-of-the-year-celebrates-new-year'), 'the painting with Milka the cat celebrating New Year', 'cats in my art', 'Cats in my life, <em>cats in my art</em>', 'they always end up in the painting', 'Cats in My Life, Cats in My Art', 'A sphynx cat on my shoulder and Milka the cat celebrating New Year with Pigeon Polly in my painting.'],
  ['selfie-bored', B('2026-pigeon-polly-fired-changing-remote-work-to-office-job-after-6-years'), 'the painting of Pigeon Polly changing remote work to an office job', 'monday mood', 'Monday face <em>vs Monday Polly</em>', 'my pigeon gets my moods first', 'Monday Face vs Monday Pigeon', 'Chin on hand in the lamp light, next to my painting of Pigeon Polly changing remote work for an office job. Art is a diary.'],
  ['selfie-sakura', P('impasto_flowers'), 'an impasto painting of pink flowers', 'blossom season', 'Blossom season: <em>above me and on my canvas</em>', 'spring is when artists run out of pink', 'Blossom Season: Above Me and on My Canvas', 'A golden-hour selfie under the cherry blossoms and my thick impasto flowers in pink. Spring always ends up in paint.'],
  ['life-autumn-leaves', B('2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes'), 'the painting of Pigeon Polly romanticizing coffee and trains in autumn', 'autumn vibes', 'Autumn vibes, <em>lived and painted</em>', 'throw the leaves first, paint them later', 'Autumn Vibes: Lived and Painted', 'Throwing golden leaves in the park, and Pigeon Polly romanticizing coffee and trains in my autumn painting.'],
  ['life-ferry', P('beach'), 'a sketchbook on a beach table', 'sea days', 'Sea days: <em>the view and the sketchbook</em>', 'salt air, open pages', 'Sea Days: The View and the Sketchbook', 'Wind and sea on a ferry deck, and my sketchbook waiting on a table by the beach. Sea days are drawing days.'],
  ['life-helm', B('2023-pigeon-polly-thinking-about-relocation-to-mars'), 'the painting of Pigeon Polly thinking about relocation to Mars', 'new horizons', 'Looking for new horizons <em>like my pigeon</em>', 'she looks at Mars, I look at the sea', 'Looking for New Horizons, Like My Pigeon', 'At a ship wheel looking far away, next to my painting of Pigeon Polly thinking about moving to Mars.'],
  ['life-firsttrip', S('2025-mr-chew-travel-edition-can-you-find-polly'), 'the painting of Mr. Chew, travel edition', 'travel', 'My first trip <em>vs my snail’s travel edition</em>', 'we both pack too much', 'My First Trip vs My Snail’s Travel Edition', 'A throwback to my first trip with a plush fish, and Mr. Chew the snail on his own travel adventure in my painting.'],
  ['life-drums', B('2026-pigeon-polly-keeps-busy-living'), 'the painting “Pigeon Polly keeps busy living”', 'keep busy living', 'Keeping busy living <em>(and drumming)</em>', 'life first, then the painting', 'Keeping Busy Living: The Artist and Her Pigeon', 'Shrugging at a drum kit, next to my painting “Pigeon Polly keeps busy living”. Artists need a life to paint.'],
  ['life-plush', P('apple_creature'), 'a watercolor of a strange apple creature', 'strange creatures', 'I paint strange creatures. <em>I also hug them.</em>', 'weird is my favorite color', 'I Paint Strange Creatures (and Hug Them)', 'Hugging a giant plush dinosaur in a shop, next to my watercolor apple creature. Odd little characters are my thing.'],
  ['life-purple-wig', P('central_perk'), 'a watercolor sketch of a cozy café', 'cozy café vibes', 'Purple door, <em>cozy café sketch</em>', 'sitcom nostalgia in paint', 'Purple Door, Cozy Café Sketch', 'A purple wig at a purple door with a yellow frame, and my watercolor sketch of a cozy café with sofas.'],
  ['life-curlers', B('2024-pigeon-polly-bath-relax'), 'the painting of Pigeon Polly relaxing in the bath', 'self-care day', 'Self-care day: <em>me vs my pigeon</em>', 'curlers in, bubbles on', 'Self-Care Day: The Artist vs Her Pigeon', 'Pink curlers and a peace sign, next to my painting of Pigeon Polly relaxing in a bubble bath.'],
  ['selfie-eyepatches', P('nailpolish'), 'a watercolor of red nail polish', 'self-care still life', 'Self-care is <em>a still life too</em>', 'paint what’s on your shelf', 'Self-Care Is a Still Life Too', 'Orange under-eye patches on a slow evening, and my watercolor of red nail polish. Everyday things make the best subjects.'],
  ['life-wand', S('2024-mr-chew-dnd-edition'), 'the painting of Mr. Chew as a wizard', 'wizard mode', 'Wizard mode: <em>on and off paper</em>', 'one wave and the sketch is done (I wish)', 'Wizard Mode: The Artist and Her Wizard Snail', 'Holding a wand with a smirk, and Mr. Chew the snail as a wizard in my fantasy painting.'],
  ['life-leopard-hat', S('2024-mr-chew-celebrates-new-year'), 'the painting of Mr. Chew celebrating New Year', 'festive season', 'Festive hat, <em>festive snail</em>', 'and my bauble painting behind me', 'Festive Season: The Artist and Her Snail', 'A fluffy leopard hat in front of my watercolor baubles, and Mr. Chew the snail celebrating New Year in my painting.'],
  ['selfie-golden', P('lake_inhand'), 'a small painting of a lake held in hand', 'golden hour', 'Golden hour, <em>painted hour</em>', 'chasing the light, then painting it', 'Golden Hour, Painted Hour', 'A golden-hour selfie and a small lake painting held up against the real view.'],
  ['selfie-glitter', P('lanterns'), 'a sketchbook page with lanterns', 'little sparkle', 'Glitter on my face, <em>lanterns in my sketchbook</em>', 'add a little sparkle everywhere', 'Glitter Freckles and Lantern Sketches', 'Glitter freckles on a grey autumn day, and lanterns glowing in my sketchbook.'],
  ['selfie-curly-mustard', P('pumpkin_lines'), 'an ink line drawing of pumpkins', 'mustard season', 'Mustard jacket, <em>pumpkin lines</em>', 'autumn is my whole personality', 'Mustard Jacket and Pumpkin Line Art', 'Curly hair, headphones and a mustard jacket, next to my ink line drawing of pumpkins.'],
  ['life-childhood', 'challenge/challenge-pigeonpolly-cactus-4-10-2026.jpg', 'a sketchbook drawing of a red cactus', 'then & now', 'Little me with a cactus. <em>Grown-up me draws one.</em>', 'some loves never change', 'Then and Now: Little Me With a Cactus, Me Drawing One', 'My childhood photo holding a cactus, and the red cactus I drew in my sketchbook years later.'],
  ['selfie-amiartist', P('selfie_easel'), 'a plein-air painting on a small easel', 'am I artist or not', '“Am I an artist or not?” <em>The evidence:</em>', 'if you make art, you’re an artist', 'Am I an Artist or Not? The Evidence', 'The question every artist asks, a close-up selfie — and the answer: painting outdoors on a little easel.'],
  ['selfie-earphones', P('riga_sketchbook'), 'a pen sketch of a street in an open sketchbook', 'music for sketching', 'Music on, <em>sketchbook open</em>', 'one playlist, one street, one page', 'Music On, Sketchbook Open', 'Earphones in on an autumn walk, and a quick pen sketch of the street in my pocket sketchbook.'],
  ['selfie-white-headphones', P('desk_night'), 'a painting of a desk at night with a glowing screen', 'night studio', 'Headphones on. <em>Night studio mode.</em>', 'the best ideas show up after dark', 'Headphones On: Night Studio Mode', 'White headphones and blue eyeliner, next to my painting of a desk at night lit by a screen.'],
  ['selfie-bluelines', P('rembrandt'), 'an ink and watercolor character with blue paint', 'blue mood', 'Blue eyeliner, <em>blue paint</em>', 'my makeup is palette practice', 'Blue Eyeliner, Blue Paint', 'Blue eyeliner and red lips, next to my ink character splashed with blue watercolor.'],
  ['selfie-door', P('doors_framed'), 'a framed painting of colorful doors', 'door collector', 'I collect doors: <em>in photos and in paint</em>', 'every door is a story', 'I Collect Doors: In Photos and in Paint', 'A selfie next to a warm wooden door, and my framed painting of colorful doors.'],
  ['selfie-pendant', P('pencil_portrait'), 'a pencil portrait', 'face to face', 'Face to face: <em>me and a pencil portrait</em>', 'drawing faces starts with looking at yours', 'Face to Face: The Artist and a Pencil Portrait', 'A calm selfie in a black v-neck next to one of my pencil portraits.'],
  ['life-medal', P('yoga'), 'a painting of a pigeon doing yoga', 'sporty side', 'Sporty me, <em>sporty pigeon</em>', 'both of us showed up', 'Sporty Me, Sporty Pigeon', 'Showing a race medal with a big smile, and my pigeon doing yoga on a mat. Moving makes room for ideas.'],
  ['selfie-bw', P('ink_farm'), 'a black ink sketch of a farm', 'black & white', 'Black and white <em>is a mood</em>', 'no color, all feeling', 'Black and White Is a Mood', 'An old black-and-white winter selfie and my black ink sketch of a farm.'],
  ['selfie-armface', P('plague'), 'a black ink drawing of a plague doctor with a lantern', 'drama', 'A little drama: <em>the artist and the ink</em>', 'red lips, black ink', 'A Little Drama: The Artist and the Ink', 'A dramatic arm-over-face pose in a patterned blouse, and my black ink plague doctor with red splashes.'],
  ['selfie-purple-glasses', P('pumpkin_color'), 'a purple watercolor with pumpkins', 'purple days', 'Seeing the world <em>in purple</em>', 'rose-tinted is overrated', 'Seeing the World in Purple', 'Round purple sunglasses and a purple watercolor with pumpkins. Some days everything is lilac.'],
  ['selfie-terracotta', P('moka_rust'), 'a watercolor of a rusty moka pot', 'warm tones', 'Terracotta tee, <em>rusty moka pot</em>', 'I just like warm colors, okay', 'Terracotta Tee, Rusty Moka Pot', 'A soft smile in a terracotta tee next to my watercolor of a rusty moka pot.'],
  ['selfie-olive', P('plants_tin'), 'a watercolor of small plants in a tin', 'olive & green', 'Olive walls, <em>little green plants</em>', 'green is the calmest color to paint', 'Olive Walls, Little Green Plants', 'A quiet selfie against an olive wall and my watercolor of little plants in a tin.'],
  ['selfie-chair', P('sofa'), 'a painting of a pigeon on a sofa', 'cozy mode', 'Cozy chair, <em>cozy pigeon</em>', 'we both know what we did last night', 'Cozy Chair, Cozy Pigeon', 'Curled up in a chair with a knitted throw, next to my pigeon on the sofa saying “I know what you did last night”.'],
  ['selfie-gingham', P('checker_coffee'), 'an ink sketch of a checkered coffee table', 'pattern lover', 'Gingham top, <em>checkered coffee sketch</em>', 'checks are a lifestyle', 'Gingham Top, Checkered Coffee Sketch', 'A gingham top and my sketch of coffee on a checkered tablecloth. Patterns follow me around.'],
  ['selfie-sofa', P('breakfast_kitchen'), 'a sketch of breakfast in the kitchen', 'slow mornings', 'Morning me, <em>morning sketch</em>', 'coffee first, then a quick breakfast drawing', 'Morning Me, Morning Sketch', 'A sleepy morning selfie and my sketch of breakfast in the kitchen.'],
  ['selfie-waves', P('riga_construction'), 'a sketchbook held up in front of a street', 'city walks', 'City walks <em>with a sketchbook</em>', 'every street corner is a drawing', 'City Walks With a Sketchbook', 'Copper finger waves on a city street, and my sketchbook held up in front of the view.'],
  ['selfie-azalea', P('bee_rider'), 'a watercolor of a bee riding a beetle', 'spring bloom', 'Spring in bloom, <em>bee in a hurry</em>', 'flowers for me, a beetle ride for the bee', 'Spring Bloom and a Bee in a Hurry', 'A spring selfie with orange azaleas and my watercolor of a bee riding a beetle.'],
  ['selfie-orange', P('rock_orange'), 'an orange ink and color drawing', 'wear your palette', 'I dress like <em>my palette</em>', 'orange jacket, orange eyeshadow, orange art', 'I Dress Like My Palette', 'Orange eyeshadow and a red-orange jacket, next to my drawing on bright orange. Yes, it’s intentional.'],
  ['selfie-lilac-headphones', P('yawn_woman'), 'a watercolor of a yawning woman on purple', 'lilac everything', 'Lilac headphones, <em>lilac paintings</em>', 'my favorite color keeps sneaking in', 'Lilac Headphones, Lilac Paintings', 'Lilac headphones in the park and my watercolor of a yawning woman on a purple background.'],
  ['selfie-mask', B('2026-pigeon-polly-and-rat-tuna-are-scared-of-last-news-about-drones-and-hantavirus'), 'the comic of Pigeon Polly and rat Tuna wearing masks', 'masked up', 'Masked up, <em>like my comic</em>', 'Polly and Tuna wear masks too', 'Masked Up, Like My Comic Characters', 'A winter selfie in a red bandana, and my comic where Pigeon Polly and rat Tuna wear masks after scary news.'],
  ['selfie-curls', P('redhair'), 'a watercolor figure with red hair', 'red hair club', 'Red hair, <em>painted red hair</em>', 'I paint what I know', 'Red Hair, Painted Red Hair', 'A curly red-haired selfie and my watercolor of a figure with red hair.'],
];
const THS = ['paper', 'blush', 'sage', 'clay', 'white', 'night'];
const duo = DUO.map(([me, art, what, kick, t, hand, title, d], i) => base(826 + i, {
  tpl: i % 5 === 4 ? 'inset' : 'duo', th: THS[i % 6], me: F(me), art, kick, t, fs: 62, h: i % 5 === 4 ? 860 : 700, hand, title, desc: desc(d), alt: altDuo(me, art, what), topics: TA, _ph: [me],
}));

// 2) палитры из фото (16)
const PALS = [
  ['ref-dahlias', 'Dahlias & concrete', 'Orange Dahlias and Grey Concrete Color Palette', ['#CAC8C7', '#A19D8D', '#E07A2E', '#B8473C', '#667730', '#404730'], 'Осень'],
  ['ref-heels-snow', 'Heels in the snow', 'Heels in the Snow: Winter Neutral Color Palette', PAL['ref-heels-snow'], 'Зима'],
  ['ref-fence', 'Blue hour fence', 'Blue Hour Color Palette From a City Fence', PAL['ref-fence'], 'Зима'],
  ['ref-peppers', 'Chili window', 'Chili Peppers and Lavender Color Palette', PAL['ref-peppers'], 'Лето'],
  ['ref-lamp', 'Old lamp, coral box', 'Coral and Stone Color Palette From an Old Lamp', PAL['ref-lamp'], 'Круглый год'],
  ['ref-rowan', 'Rowan berries', 'Rowan Berries: Orange and Green Color Palette', PAL['ref-rowan'], 'Осень'],
  ['life-autumn-leaves', 'Autumn vibes', 'Autumn Vibes Color Palette From a Park Walk', PAL['life-autumn-leaves'], 'Осень'],
  ['life-pumpkin-head', 'Pumpkin head', 'Pumpkin Orange and Plum Color Palette', PAL['life-pumpkin-head'], 'Осень'],
  ['life-purple-wig', 'Purple door', 'Purple and Gold Color Palette From a Purple Door', PAL['life-purple-wig'], 'Круглый год'],
  ['selfie-armface', 'Red pattern', 'Red Pattern Color Palette From an Artist Selfie', PAL['selfie-armface'], 'Круглый год'],
  ['selfie-door', 'Amber door', 'Amber and Magenta Color Palette', PAL['selfie-door'], 'Осень'],
  ['selfie-earphones', 'Magenta autumn', 'Magenta Autumn Color Palette', PAL['selfie-earphones'], 'Осень'],
  ['selfie-orange', 'Wear your palette', 'Orange and Navy Outfit Color Palette', PAL['selfie-orange'], 'Круглый год'],
  ['selfie-mask', 'Winter red', 'Winter Red and Burgundy Color Palette', PAL['selfie-mask'], 'Зима'],
  ['life-childhood', 'Childhood green', 'Childhood Lime and Terracotta Color Palette', PAL['life-childhood'], 'Круглый год'],
  ['life-coffee-park', 'Coffee in the park', 'Summer Park Color Palette: Sky Blue and Sand', PAL['life-coffee-park'], 'Лето'],
];
const pals = PALS.map(([k, name, title, cols, season], i) => base(875 + i, {
  tpl: i % 2 ? 'palside' : 'pal', th: ['paper', 'night', 'clay', 'white'][i % 4], art: F(k), kick: k.startsWith('ref') ? 'behind the artist camera' : 'color palette from my photo', t: `${name}`, fs: 72, h: 780, top: 320, cols, season,
  hand: k.startsWith('ref') ? 'a reference I shot myself' : 'colors from my everyday life', type: 'Палитра', topics: TP, title,
  desc: `A ${cols.length}-color palette with HEX codes taken from my own photo${k.startsWith('ref') ? ' reference' : ''}: ${name.toLowerCase()}. Save it for your next painting, illustration or design. Color inspiration from Pigeon Polly Art Lab — more on pigeonpolly.com.`,
  alt: `A color palette with HEX codes ${cols.join(', ')} taken from ${PH[k]}.`, _ph: [k],
}));

// 3) мемы и POV (24)
const MEM = [
  ['pov', 'selfie-bored', 'you said “just one more sketch” and it’s 1 a.m.', 'my face, every single time', 'POV: You Said “Just One More Sketch”'],
  ['meme', 'life-towel-latte', 'Artists at 8 a.m.: “Today I’ll paint all day.”', 'also artists: still on the first coffee at noon', 'Artists at 8 a.m. vs Artists at Noon'],
  ['meme', 'life-drums', 'When someone asks if I have hobbies besides drawing', 'yes. loud ones.', 'When Someone Asks About Your Other Hobbies'],
  ['pov', 'life-plush', 'you went to buy groceries and came back with a dinosaur', 'artist logic: it’s for references', 'POV: You Went Shopping and Came Back With a Dinosaur'],
  ['meme', 'life-mushroom', 'Me finding a new reference in a Christmas shop', '“I NEED to paint this”', 'Me Finding a New Reference in a Shop'],
  ['pov', 'life-pumpkin-head', 'it’s October and the artist has become the still life', 'hold still, the pumpkin is drying', 'POV: The Artist Became the Still Life'],
  ['meme', 'life-cat-desk', 'Me: okay, time to draw. The cat:', 'the warm laptop is his now', 'Me: Time to Draw. The Cat:'],
  ['pov', 'life-cat', 'you sit down to sketch and the cat demands to be the model', 'he will not hold the pose', 'POV: The Cat Wants to Be Your Model'],
  ['meme', 'life-sphynx', 'My art critic, reviewing my latest sketch', 'harsh, but fair', 'My Art Critic Reviewing My Sketch'],
  ['pov', 'selfie-hand', 'someone asks to see your sketchbook', 'it’s… private… (it’s full of weird faces)', 'POV: Someone Asks to See Your Sketchbook'],
  ['meme', 'selfie-amiartist', 'Every artist at 2 a.m.: “am I an artist or not?”', 'you are. go to sleep.', 'Every Artist at 2 a.m.'],
  ['pov', 'life-wand', 'you’re about to fix the whole drawing with one magic stroke', 'narrator: it was not one stroke', 'POV: One Magic Stroke Will Fix It'],
  ['meme', 'life-curlers', 'Artist self-care Sunday', 'curlers in, brushes washed, peace out', 'Artist Self-Care Sunday'],
  ['pov', 'life-purple-wig', 'you matched your hair to the door on purpose', 'color theory, but make it a lifestyle', 'POV: You Matched Your Hair to the Door'],
  ['meme', 'selfie-eyepatches', 'Artists the morning after a deadline night', 'eye patches: on. coffee: loading.', 'Artists the Morning After a Deadline'],
  ['pov', 'selfie-white-headphones', 'you put your headphones on and the drawing finally starts', 'do not disturb the creative process', 'POV: Headphones On, Drawing Starts'],
  ['meme', 'life-helm', 'Me steering my art career with zero map', 'it’s going great, probably', 'Steering My Art Career With Zero Map'],
  ['pov', 'life-coffee-park', 'you take your coffee to the park and call it “gathering references”', 'technically not a lie', 'POV: Coffee in the Park Is “Gathering References”'],
  ['meme', 'life-snail', 'Me meeting my snail character in real life', 'Mr. Chew, is that you?', 'Meeting My Snail Character in Real Life'],
  ['pov', 'life-leopard-hat', 'it’s December and your outfit is louder than your paintings', 'the baubles behind me agree', 'POV: Your December Outfit Is Louder Than Your Art'],
  ['meme', 'selfie-purple-glasses', 'Me looking at my old sketches', 'through very forgiving glasses', 'Me Looking at My Old Sketches'],
  ['pov', 'selfie-chair', 'you planned to paint but the chair was too cozy', 'rest is part of the process', 'POV: The Chair Was Too Cozy to Paint'],
  ['meme', 'life-drums', 'Me when the painting finally comes together', 'ba dum tss', 'When the Painting Finally Comes Together'],
  ['pov', 'selfie-glitter', 'you got glitter on your face and decided it’s a look now', 'artists don’t make mistakes, only happy accidents', 'POV: Glitter Everywhere Is Now a Look'],
];
const mems = MEM.map(([tpl, k, top, sub, title], i) => base(891 + i, {
  tpl, th: ['blush', 'paper', 'sage', 'clay', 'white'][i % 5], art: F(k), t: top, ...(tpl === 'meme' ? { top } : { top: 320 }), sub, h: 900, at: 320, fs: tpl === 'pov' ? 58 : 50, pos: '50% 30%', type: 'Мем', topics: TM, title,
  desc: desc(`A relatable artist moment: ${top.replace(/^Me:?\s*/, '').replace(/[“”]/g, '"')} — ${sub}.`), alt: `A meme photo of ${PH[k]} with the caption “${top}”.`, _ph: [k],
}));

// 4) мудборды 2×2 (14)
const GR = [
  ['artist hair diaries', 'One artist, <em>many hair moods</em>', [['selfie-curls', 'curly'], ['selfie-waves', 'waves'], ['selfie-lilac-headphones', 'copper'], ['life-purple-wig', 'purple']], 'the hair changes, the sketchbook stays', 'Artist Hair Diaries: One Artist, Many Hair Moods'],
  ['warm tones', 'Artist aesthetic: <em>warm tones</em>', [['selfie-terracotta', 'terracotta'], ['selfie-golden', 'golden'], ['selfie-sakura', 'blossom'], ['selfie-glitter', 'mustard']], 'I am basically a warm palette', 'Artist Aesthetic: Warm Tones Moodboard'],
  ['faces of an artist', 'The many faces <em>of an artist</em>', [['selfie-pendant', 'focused'], ['selfie-chair', 'cozy'], ['selfie-olive', 'thinking'], ['selfie-gingham', 'serious']], 'all of them draw', 'The Many Faces of an Artist'],
  ['four seasons', 'An artist’s <em>four seasons</em>', [['selfie-sakura', 'spring'], ['life-coffee-park', 'summer'], ['life-autumn-leaves', 'autumn'], ['selfie-mask', 'winter']], 'every season has its own palette', 'An Artist’s Four Seasons'],
  ['makeup = palette practice', 'My makeup is <em>palette practice</em>', [['selfie-bluelines', 'blue'], ['selfie-orange', 'orange'], ['selfie-glitter', 'glitter'], ['selfie-eyepatches', 'gold']], 'faces are just smaller canvases', 'Makeup Is Palette Practice for Artists'],
  ['behind the artist camera', 'References <em>I shot myself</em>', [['ref-peppers', 'peppers'], ['ref-lamp', 'old lamp'], ['ref-fence', 'blue hour'], ['ref-rowan', 'rowan']], 'my camera roll is 80% references', 'Behind the Artist Camera: References I Shot Myself'],
  ['street references', 'Things only artists <em>stop to photograph</em>', [['ref-dahlias', 'a painted box'], ['ref-heels-snow', 'lost heels'], ['ref-lamp', 'a lamp'], ['ref-fence', 'a fence']], 'yes, I stop in the middle of the street', 'Things Only Artists Stop to Photograph'],
  ['weekend energy', 'Artist <em>weekend energy</em>', [['selfie-purple-glasses', 'shades on'], ['selfie-curly-mustard', 'music on'], ['selfie-sofa', 'lazy'], ['selfie-azalea', 'outside']], 'sketchbook optional (but packed)', 'Artist Weekend Energy Moodboard'],
  ['studio staff', 'Meet my <em>studio staff</em>', [['life-cat', 'the model'], ['life-cat-desk', 'the supervisor'], ['life-sphynx', 'the critic'], ['life-plush', 'emotional support']], 'nobody here is paid', 'Meet My Studio Staff (Cats and a Dinosaur)'],
  ['on the go', 'An artist <em>on the go</em>', [['life-ferry', 'sea'], ['life-sketchbook-tram', 'tram'], ['life-helm', 'ship'], ['life-firsttrip', 'first trip']], 'a sketchbook fits in every bag', 'An Artist on the Go'],
  ['then', 'Before I called myself <em>an artist</em>', [['life-childhood', 'little me'], ['life-bubbles', 'be like a child'], ['selfie-bw', 'black & white'], ['life-firsttrip', 'first trip']], 'the curious kid is still in charge', 'Before I Called Myself an Artist'],
  ['cozy days', 'Cozy artist days <em>at home</em>', [['life-towel-latte', 'latte'], ['life-curlers', 'curlers'], ['selfie-eyepatches', 'patches'], ['selfie-bored', 'thinking']], 'slow days make good ideas', 'Cozy Artist Days at Home'],
  ['silly side', 'The silly side <em>of an artist</em>', [['life-pumpkin-head', 'pumpkin'], ['life-mushroom', 'mushroom'], ['life-wand', 'wand'], ['life-drums', 'drums']], 'seriousness is not required for art', 'The Silly Side of an Artist'],
  ['online artist life', 'Behind the scenes <em>of an online artist</em>', [['selfie-hand', 'camera shy'], ['selfie-white-headphones', 'focus'], ['selfie-earphones', 'walk break'], ['selfie-amiartist', 'self-doubt']], 'and then the art gets posted', 'Behind the Scenes of an Online Artist'],
];
const grids = GR.map(([kick, t, items, hand, title], i) => base(915 + i, {
  tpl: 'grid', th: ['paper', 'clay', 'sage', 'blush', 'white', 'night', 'paper'][i % 7], kick, t, fs: 64, items: items.map(([k, say]) => ({ art: F(k), say, pos: '50% 30%' })), ch: 400, top: 340, hand, title,
  desc: desc(`A little moodboard: ${items.map(x => x[1]).join(', ')}.`), alt: `A moodboard of four photos: ${items.map(x => PH[x[0]]).join('; ')}.`, topics: i === 5 || i === 6 ? TR : TL, _ph: items.map(x => x[0]),
}));

// 5) референсы, цитаты, списки (16)
const MORE = [
  { tpl: 'tips', th: 'paper', art: F('ref-lamp'), h: 520, kick: 'behind the artist camera', t: '7 things I photograph <em>for references</em>', fs: 64, items: [['Old lamps and street details', ''], ['Flowers next to concrete', ''], ['Food in café windows', ''], ['Blue hour light', ''], ['Berries and leaves up close', ''], ['Lost objects in the snow', ''], ['Doors, always doors', '']], type: 'Темы', topics: TR,
    title: '7 Things I Photograph for Art References', desc: 'Old lamps, flowers next to concrete, café windows, blue hour, berries, lost objects and doors — what I photograph on walks to draw later. More art on pigeonpolly.com.', alt: 'A reference photo of an old caged lamp above a list of things an artist photographs for references.', _ph: ['ref-lamp'] },
  { tpl: 'essay', th: 'clay', art: F('ref-heels-snow'), h: 430, kick: 'behind the artist camera', t: 'Why I photograph <em>random things</em>', paras: ['A pair of heels in the snow. A painted electrical box. A lamp nobody looks at.', 'These photos are not for my feed — they are notes. Shapes, colors and little stories I want to draw one day.', 'Your camera roll can be a sketchbook too. Start saving the things that make you stop.'], type: 'Статья', topics: TR,
    title: 'Why Artists Photograph Random Things', desc: 'Heels in the snow, painted boxes, old lamps — an artist’s camera roll is a sketchbook of shapes, colors and little stories to draw later. More on pigeonpolly.com.', alt: 'A reference photo of black heels in the snow above a short essay about photographing references.', _ph: ['ref-heels-snow'] },
  { tpl: 'pov', th: 'white', art: F('ref-heels-snow'), h: 760, top: 330, t: 'you stopped in the cold to photograph abandoned heels', sub: 'there’s a story here and I will paint it', fs: 58, type: 'Мем', topics: TM,
    title: 'POV: You Stopped to Photograph Abandoned Heels', desc: 'Artists stop in the cold for the strangest references — like a pair of heels left in the snow. Behind the artist camera at Pigeon Polly Art Lab.', alt: 'A reference photo of black heels left in the snow by a window, with a POV caption.', _ph: ['ref-heels-snow'] },
  { tpl: 'frame', th: 'sage', art: F('ref-dahlias'), ah: 800, q: 'Even a grey box can bloom.', qs: 64, kick: 'behind the artist camera', topics: TR,
    title: 'Even a Grey Box Can Bloom — Artist Reference Photo', desc: 'Orange dahlias next to a graffiti electrical box: a reference I photographed for color and contrast. Little beauty in ordinary streets. More art on pigeonpolly.com.', alt: 'A reference photo of orange dahlias next to a graffiti box in a white frame with a short quote.', _ph: ['ref-dahlias'] },
  { tpl: 'full', art: F('ref-fence'), pos: '50% 50%', kick: 'saved for later', q: 'Blue hour, black lace fence — a painting waiting to happen.', qs: 70, topics: TR,
    title: 'Blue Hour Reference Photo: A Painting Waiting to Happen', desc: 'A green fleur-de-lis fence and bare branches at blue hour, photographed as a reference. Save it for a winter painting. Behind the artist camera on pigeonpolly.com.', alt: 'A full reference photo of a fence and bare branches against a blue evening sky with a quote.', _ph: ['ref-fence'] },
  { tpl: 'tips', th: 'blush', art: F('ref-peppers'), h: 720, pos: '50% 40%', kick: 'draw this', t: 'Draw this: <em>chili window</em>', fs: 76, items: [['Start with the big red shapes', ''], ['Leave the lavender loose and light', ''], ['Add the window glow last', '']], type: 'Темы', topics: TR,
    title: 'Draw This: Chili Peppers in a Café Window', desc: 'A free photo reference I took: red chili peppers and lavender in a café window. Three steps to sketch it in watercolor or markers. More drawing ideas on pigeonpolly.com.', alt: 'A reference photo of red chili peppers and lavender in a café window with three drawing tips.', _ph: ['ref-peppers'] },
  { tpl: 'tips', th: 'sage', art: F('ref-rowan'), h: 720, pos: '50% 30%', kick: 'draw this', t: 'Draw this: <em>rowan berries</em>', fs: 76, items: [['Paint the berries as orange circles', ''], ['Leave a white dot for the shine', ''], ['Let the green leaves stay blurry', '']], type: 'Темы', topics: TR,
    title: 'Draw This: Rowan Berries Photo Reference', desc: 'A free photo reference I took of orange rowan berries — with three quick tips to paint them in watercolor. More drawing ideas on pigeonpolly.com.', alt: 'A reference photo of orange rowan berries with three watercolor tips.', _ph: ['ref-rowan'] },
  { tpl: 'polaroid', art: F('ref-peppers'), ah: 760, q: 'summer, but make it spicy', kick: 'behind the artist camera', blob: 'peach', bx: 500, by: 980, topics: TR,
    title: 'Summer, But Make It Spicy — Artist Reference', desc: 'A polaroid-style photo reference of chili peppers in a café window, from my summer walks. Behind the artist camera at Pigeon Polly Art Lab.', alt: 'A polaroid of chili peppers in a café window with a handwritten caption.', _ph: ['ref-peppers'] },
  { tpl: 'frame', th: 'sage', art: F('life-bubbles'), ah: 800, aw: 760, kick: 'be like a child', q: 'Play first. Judge later.', qs: 64,
    title: 'Be Like a Child: Play First, Judge Later', desc: 'Blowing soap bubbles is the best reminder for artists: play first, judge later. A little motivation from Pigeon Polly Art Lab.', alt: 'A framed photo of the artist blowing soap bubbles under pine trees with a quote.', _ph: ['life-bubbles'] },
  { tpl: 'polaroid', art: F('life-childhood'), ah: 560, q: 'the curious kid is still in charge', kick: 'my childhood', blob: 'greenwash', bx: 480, by: 960,
    title: 'My Childhood: The Curious Kid Is Still in Charge', desc: 'A childhood photo with my little cactus. The curious kid is still the one choosing what I draw. Behind the artist camera at Pigeon Polly Art Lab.', alt: 'A polaroid of the artist as a little girl holding a cactus.', _ph: ['life-childhood'] },
  { tpl: 'polaroid', art: F('life-firsttrip'), ah: 520, q: 'my first trip (I bought a fish)', kick: 'artist throwback', blob: 'bluewash', bx: 480, by: 960,
    title: 'Artist Throwback: My First Trip', desc: 'A throwback to my first trip — holding a plush fish in a ferry shop. Every trip since has filled a sketchbook. Behind the scenes at Pigeon Polly Art Lab.', alt: 'A polaroid of the young artist holding a plush fish in a shop.', _ph: ['life-firsttrip'] },
  { tpl: 'frame', th: 'night', art: F('selfie-bw'), ah: 820, aw: 600, q: 'Some moods don’t need color.', qs: 58, kick: 'black and white',
    title: 'Some Moods Don’t Need Color', desc: 'A black-and-white winter selfie and a reminder: not every mood needs color. Behind the artist camera at Pigeon Polly Art Lab.', alt: 'A black-and-white selfie of the artist in a knit scarf in a white frame.', _ph: ['selfie-bw'] },
  { tpl: 'full', art: F('life-ferry'), pos: '50% 50%', kick: 'sea days', q: 'Salt air, cold hands, open sketchbook.', qs: 74,
    title: 'Sea Days: Salt Air and an Open Sketchbook', desc: 'Wind, sea and a hood on a ferry deck — the kind of day that ends up in a sketchbook. Artist lifestyle at Pigeon Polly Art Lab.', alt: 'A full photo of the artist on a ferry deck with the sea behind and a quote.', _ph: ['life-ferry'] },
  { tpl: 'full', art: F('life-medal'), pos: '50% 40%', kick: 'artists move too', q: 'Finish lines and finished sketches start the same way: one step.', qs: 64, top: 1,
    title: 'Finish Lines and Finished Sketches Start With One Step', desc: 'A race medal and a reminder for artists: big things start with one small step. Artist lifestyle at Pigeon Polly Art Lab.', alt: 'A full photo of the artist smiling with a race medal and a motivational quote.', _ph: ['life-medal'] },
  { tpl: 'tips', th: 'clay', art: F('life-sketchbook-tram'), h: 540, pos: '50% 35%', kick: 'urban sketching', t: 'How to sketch <em>on public transport</em>', fs: 66, items: [['Use a small sketchbook and one pen', ''], ['Draw people who are sitting still', ''], ['Give each face one minute', ''], ['Headphones help you focus', ''], ['Write the date and the route', ''], ['Unfinished is fine — it’s a moving tram', '']], type: 'Темы',
    title: 'How to Sketch on Public Transport: 6 Tips', desc: 'Small sketchbook, one pen, one minute per face — six easy tips for sketching people on the tram or bus. From an artist who does it on her commute. More on pigeonpolly.com.', alt: 'The artist on a tram showing her sketchbook above six tips for sketching on public transport.', _ph: ['life-sketchbook-tram'] },
  { tpl: 'tips', th: 'blush', art: F('selfie-earphones'), h: 560, pos: '50% 35%', kick: 'music for sketching', t: 'What to listen to <em>while you sketch</em>', fs: 66, items: [['Lo-fi or soft jazz for slow drawing', ''], ['Film soundtracks for big paintings', ''], ['Old favorites for quick sketches', ''], ['Podcasts for coloring and inking', ''], ['Silence for the hard parts', '']], type: 'Темы',
    title: 'Music for Sketching: What to Listen to While You Draw', desc: 'Lo-fi for slow drawing, soundtracks for big paintings, podcasts for inking and silence for the hard parts — a little guide to music for sketching. More on pigeonpolly.com.', alt: 'The artist wearing earphones in an autumn park above a list of music for sketching.', _ph: ['selfie-earphones'] },
];
const more = MORE.map((o, i) => base(929 + i, Object.assign({ desc: '', topics: TL }, o)));

const ALL = [...duo, ...pals, ...mems, ...grids, ...more];
// проверки: номера подряд, каждое фото ≥ 2 раз
const use = {}; ALL.forEach(p => p._ph.forEach(k => use[k] = (use[k] || 0) + 1));
const few = Object.keys(PH).filter(k => (use[k] || 0) < 2); if (few.length) throw new Error('меньше 2 пинов: ' + few.join(', '));
ALL.forEach((p, i) => { if (p.n !== 826 + i) throw new Error('номер ' + p.n); });
if (process.env.USE) console.log(JSON.stringify(use));
module.exports = ALL;
