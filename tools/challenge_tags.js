// Разметка предметов челленджа: семья, категория, сложность → content/challenge-tags.json (по индексу предмета в challenge-data.js).
// Сначала правила (ниже), потом ручные исправления из content/challenge-tags-fixes.txt — строки «индекс=значение»:
//   1 / 2 / 3 — сложность; имя категории — категория; f:слово или любое другое слово — семья.
// node tools/challenge_tags.js                 — пересобрать json
// node tools/challenge_tags.js groups N        — пачка N (с 1) семей, где больше одного предмета: «индекс | en | семья | категория | сложность»
// node tools/challenge_tags.js uncat N         — пачка N предметов, которым словарь не нашёл категорию
// node tools/challenge_tags.js apply < правки  — дописать правки в fixes и пересобрать
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = {};
new Function(fs.readFileSync(path.join(root, 'site/assets/challenge-data.js'), 'utf8'))();
const S = window.CHALLENGE_DATA.subjects;
const FIXES = path.join(root, 'content/challenge-tags-fixes.txt'), OUT = path.join(root, 'content/challenge-tags.json');
const BATCH = 200;

const CATS = ['food', 'drink', 'animal', 'bird', 'plant', 'home', 'clothes', 'transport', 'place', 'nature', 'weather', 'tool', 'toy', 'music', 'fantasy', 'person', 'holiday', 'idea', 'life'];
const CONTAINERS = new Set(['basket', 'bowl', 'cup', 'jar', 'box', 'bag', 'plate', 'slice', 'piece', 'bunch', 'pile', 'stack', 'pair', 'bottle', 'glass', 'set']);
const DISHES = new Set(['pie', 'jam', 'juice', 'tart', 'soup', 'salad', 'jelly', 'sauce', 'cake', 'muffin', 'pancake', 'crumble', 'compote', 'smoothie', 'milkshake', 'lemonade', 'ice', 'cream', 'bread', 'sandwich', 'chip', 'crisp', 'stew', 'puree', 'syrup', 'tea', 'oil', 'butter', 'seed', 'peel', 'core', 'leaf', 'blossom', 'flower', 'tree', 'bush', 'branch', 'slice', 'half']);
const STOP = new Set(['a', 'an', 'the', 'your', 'some', 'my', 'two', 'three', 'one', 'few', 'little', 'tiny', 'big', 'old', 'small', 'new']);
const PREPS = new Set(['in', 'on', 'with', 'at', 'under', 'from', 'for', 'by', 'near', 'over', 'into', 'through', 'behind', 'after', 'before', 'during', 'without', 'against', 'around', 'across', 'that', 'you', 'and', 'to', 'like', 'full', 'made', 'left', 'hanging', 'drying']);
const KEEP = new Set(['scissors', 'jeans', 'trousers', 'shorts', 'pyjamas', 'binoculars', 'glasses', 'sunglasses', 'goggles', 'tweezers', 'pliers', 'headphones', 'earmuffs', 'mittens', 'gloves', 'leggings', 'tights', 'overalls', 'dungarees', 'clothes', 'stairs', 'news', 'chess', 'cactus', 'thermos', 'octopus', 'bus', 'hippopotamus', 'asparagus', 'hummus', 'couscous', 'citrus', 'crocus', 'hibiscus', 'walrus', 'iris', 'compass', 'glass', 'grass', 'moss', 'dress', 'cress', 'class', 'chaos', 'canvas', 'lotus', 'platypus', 'hummus', 'christmas', 'jāņi', 'clothes', 'series', 'species', 'mars', 'swiss', 'lens', 'bass', 'brass', 'harness', 'mattress', 'abacus', 'circus', 'campus', 'atlas', 'gas', 'iris', 'tennis', 'mess', 'chess', 'ss']);
const IRREG = { leaves: 'leaf', knives: 'knife', loaves: 'loaf', wolves: 'wolf', shelves: 'shelf', scarves: 'scarf', halves: 'half', calves: 'calf', mice: 'mouse', geese: 'goose', teeth: 'tooth', feet: 'foot', children: 'child', people: 'person', men: 'man', women: 'woman', dice: 'die', sheep: 'sheep', fish: 'fish', deer: 'deer', berries: 'berry', cookies: 'cookie', movies: 'movie', pies: 'pie', ties: 'tie', shoes: 'shoe', toes: 'toe', canoes: 'canoe', potatoes: 'potato', tomatoes: 'tomato', heroes: 'hero', echoes: 'echo', mangoes: 'mango', volcanoes: 'volcano', dominoes: 'domino', boxes: 'box', foxes: 'fox', buses: 'bus', glasses: 'glasses', quizzes: 'quiz', lives: 'life', wives: 'wife', hooves: 'hoof', oxen: 'ox', cacti: 'cactus', fungi: 'fungus', octopi: 'octopus', clothes: 'clothes', candies: 'candy', cherries: 'cherry', puppies: 'puppy', butterflies: 'butterfly', dragonflies: 'dragonfly', fireflies: 'firefly', strawberries: 'strawberry', raspberries: 'raspberry', blueberries: 'blueberry', blackberries: 'blackberry', cranberries: 'cranberry', lingonberries: 'lingonberry', bunnies: 'bunny', daisies: 'daisy', lilies: 'lily', pansies: 'pansy', ladies: 'lady', fairies: 'fairy', pastries: 'pastry', groceries: 'grocery', batteries: 'battery', libraries: 'library', jellies: 'jelly', poppies: 'poppy' };
function singular(w) {
  if (IRREG[w]) return IRREG[w];
  if (KEEP.has(w) || w.length < 4) return w;
  if (/(ss|us|is|ous)$/.test(w)) return w;
  if (/ies$/.test(w)) return w.slice(0, -3) + 'y';
  if (/(ches|shes|xes|zes|sses)$/.test(w)) return w.slice(0, -2);
  if (/s$/.test(w)) return w.slice(0, -1);
  return w;
}
const words = en => en.toLowerCase().replace(/[’']s\b/g, "'s").replace(/[^\p{L}'\- ]/gu, ' ').split(/\s+/).filter(Boolean);
// главное существительное: после «of» — то, что после него; иначе фраза до первого предлога, последнее слово; ёмкость отбрасывается
function family(en, foods) {
  let w = words(en);
  const of = w.indexOf('of');
  if (of > 0 && of < w.length - 1) w = w.slice(of + 1);
  w = w.filter(x => !STOP.has(x));
  const cut = w.findIndex((x, i) => i > 0 && (PREPS.has(x) || x === 'of'));
  if (cut > 0) w = w.slice(0, cut);
  w = w.map(x => x.replace(/'s$/, '')).map(singular);
  if (!w.length) return 'thing';
  let last = w[w.length - 1];
  if (CONTAINERS.has(last) && w.length > 1) { w = w.slice(0, -1); last = w[w.length - 1]; }
  // блюдо из одного продукта → продукт (apple pie → apple)
  if (foods && DISHES.has(last) && w.length > 1 && foods.has(w[w.length - 2])) last = w[w.length - 2];
  else if (foods && w.length > 2 && DISHES.has(w[w.length - 2]) && foods.has(w[w.length - 3])) last = w[w.length - 3]; // apple pie slice
  return last;
}

// словарь ключевых слов → категория (сначала по семье, потом по любому слову названия)
const KW = {
  food: 'apple pear banana orange lemon lime grape cherry plum peach apricot strawberry raspberry blueberry blackberry cranberry lingonberry gooseberry currant berry melon watermelon pineapple mango kiwi avocado coconut fig date pomegranate tomato potato carrot onion garlic cucumber pepper courgette zucchini pumpkin squash cabbage broccoli cauliflower lettuce pea bean corn mushroom radish beetroot leek celery aubergine eggplant olive nut walnut hazelnut almond peanut chestnut acorn bread loaf baguette croissant bun bagel pretzel toast sandwich burger hamburger pizza pasta spaghetti noodle rice sushi taco burrito dumpling pie cake cupcake muffin cookie biscuit pancake waffle doughnut donut croissant pastry tart cheese butter egg omelette sausage bacon ham chicken fish salmon soup salad cereal porridge yoghurt yogurt honey jam jelly chocolate candy sweet lollipop marshmallow popcorn chip crisp fries ice-cream icecream sundae dessert pudding cream sugar salt spice cinnamon vanilla gingerbread macaron meringue brioche pickle ketchup mustard sauce hot-dog dog-food snack lunch breakfast dinner picnic',
  drink: 'tea coffee juice milk lemonade smoothie milkshake cocoa water soda wine kefir kvass latte espresso cappuccino drink cocktail kompot compote',
  animal: 'cat kitten dog puppy horse pony cow calf pig piglet sheep lamb goat donkey rabbit bunny hare mouse rat hamster guinea squirrel hedgehog fox wolf bear deer elk moose reindeer boar badger otter beaver raccoon skunk bat monkey gorilla chimp lion tiger leopard cheetah elephant giraffe zebra hippo rhino camel llama alpaca kangaroo koala panda sloth seal walrus whale dolphin shark octopus squid jellyfish crab lobster shrimp starfish snail slug frog toad turtle tortoise lizard snake crocodile chameleon fish goldfish butterfly moth bee bumblebee ladybird ladybug ant spider beetle caterpillar dragonfly grasshopper cricket worm firefly fly mosquito mole lynx bison yak platypus axolotl seahorse ferret chipmunk',
  bird: 'bird pigeon dove sparrow robin crow raven magpie owl eagle hawk falcon parrot budgie canary swan duck duckling goose chick chicken hen rooster peacock flamingo penguin pelican stork heron crane seagull gull woodpecker hummingbird swallow tit bullfinch kingfisher ostrich puffin toucan nest feather egg-shell blackbird starling jay',
  plant: 'flower rose tulip daisy sunflower lily orchid poppy lavender dandelion daffodil snowdrop crocus iris violet pansy peony lilac cornflower chamomile clover thistle fern moss cactus succulent houseplant plant tree oak birch pine spruce fir maple willow palm bamboo bush hedge leaf branch twig seed bud blossom bouquet wreath vine ivy grass reed weed herb basil mint rosemary pinecone cone bonsai seedling sprout mistletoe holly heather wildflower',
  home: 'mug cup teapot kettle lamp chair table sofa couch armchair bed pillow cushion blanket duvet curtain window door key keys clock mirror shelf bookshelf book wardrobe drawer rug carpet vase candle frame picture plate bowl spoon fork knife teaspoon pan pot saucepan oven stove fridge toaster microwave kettle sink tap bath bathtub shower towel toothbrush toothpaste soap sponge comb hairbrush brush broom mop bucket basket jar bottle box bag umbrella radiator fireplace staircase stairs hook hanger iron washing-machine dish rack grater whisk ladle sieve rolling-pin colander cutting-board apron oven-glove napkin tablecloth tray thermos lunchbox remote television tv phone telephone laptop computer keyboard mouse-pad charger cable plug socket switch bulb light lightbulb doorbell letterbox mailbox stool cupboard cabinet desk bin dustpan tissue cotton perfume lipstick makeup razor shampoo plaster bandage pill medicine thermometer glasses spectacles wallet purse coin notebook diary pen pencil eraser rubber ruler crayon marker paintbrush paint sketchbook envelope letter stamp postcard calendar newspaper magazine sticker tape scissors stapler paperclip clip glue folder backpack schoolbag pencil-case globe map candlestick ornament jewellery jewelry ring necklace bracelet earring watch',
  clothes: 'slipper sock shoe boot sneaker trainer sandal heel hat cap beanie beret scarf glove mitten coat jacket raincoat jumper sweater cardigan hoodie shirt t-shirt blouse dress skirt trousers jeans shorts pyjamas pajamas tie bow-tie belt suspenders apron uniform costume vest tights leggings overalls dungarees swimsuit bikini wellies wellington gumboot earmuffs headband brooch button zip pocket collar sleeve handbag',
  transport: 'car bus tram train trolleybus bicycle bike scooter motorbike motorcycle truck lorry van taxi tractor boat ship sailboat yacht canoe kayak ferry submarine airplane aeroplane plane helicopter rocket balloon hot-air zeppelin skateboard carriage wagon cart sledge sled sleigh ambulance fire-engine police-car digger excavator crane-truck caravan camper wheel tyre tire',
  place: 'street road bridge house building tower castle church cathedral museum library school shop store market cafe café restaurant bakery station airport harbour harbor port park playground garden square fountain statue lighthouse windmill barn farm cottage hut cabin tent village city town alley courtyard balcony roof chimney attic cellar basement kitchen bathroom bedroom room hallway corridor porch gate fence wall doorway staircase stall kiosk bus-stop crossroads cemetery theatre cinema stadium pier beach-hut greenhouse shed garage factory hotel hospital office classroom zoo aquarium circus',
  nature: 'sea ocean lake river pond stream waterfall mountain hill valley forest wood meadow field beach sand shore island cliff cave rock stone pebble shell driftwood volcano desert canyon glacier iceberg sunset sunrise sky star moon sun planet comet galaxy horizon landscape puddle wave tide dune swamp marsh path trail stump log mud',
  weather: 'rain cloud storm thunderstorm lightning snow snowflake snowfall fog mist frost hail wind rainbow sunshine drizzle blizzard icicle dew dewdrop raindrop heatwave tornado hurricane weather',
  tool: 'hammer saw screwdriver wrench spanner drill pliers nail screw bolt nut-and-bolt shovel spade rake hoe trowel axe hatchet ladder toolbox tape-measure level chisel file sandpaper paint-roller wheelbarrow watering-can hose bucket rope chain padlock lock torch flashlight battery magnet magnifying microscope telescope compass calculator sewing needle thread thimble knitting yarn pin tool clamp vice vise crowbar pickaxe sickle scythe pitchfork lantern',
  toy: 'teddy doll toy puzzle kite yo-yo yoyo marble ball balloon block lego robot top spinning-top rocking-horse puppet dice die card cards chess domino game board-game jigsaw rubik slinky water-pistol bubble bubbles sandcastle bucket-and-spade skipping-rope hula-hoop frisbee boomerang paper-plane origami pinwheel whistle rattle tamagotchi console joystick controller football basketball tennis racket bat skate skates rollerblade ski skis snowboard surfboard dumbbell trophy medal swing slide seesaw trampoline',
  music: 'guitar violin cello piano keyboard-instrument drum drums flute trumpet saxophone clarinet harp ukulele accordion harmonica tambourine xylophone triangle bell microphone headphones speaker record vinyl cassette radio gramophone music note metronome banjo bagpipe kokle kokles',
  fantasy: 'dragon unicorn fairy wizard witch mermaid elf gnome troll giant ghost monster vampire zombie goblin knight princess prince king queen castle-in-the-clouds wand potion spell crystal-ball cauldron broomstick treasure magic magical enchanted phoenix griffin pegasus yeti alien ufo robot-friend genie lamp-genie tooth-fairy dwarf ogre sphinx centaur kraken',
  person: 'person friend portrait self-portrait selfie face hand hands foot eye eyes nose mouth ear hair beard grandmother grandma grandfather grandpa mother mum father dad baby child kid girl boy woman man lady gentleman neighbour neighbor teacher doctor nurse chef baker farmer firefighter policeman police officer postman pilot sailor fisherman painter artist musician dancer singer clown juggler acrobat astronaut gardener waiter barista cyclist runner skier swimmer passer-by passerby crowd family couple people',
  holiday: 'birthday christmas easter halloween jāņi new-year gift present ornament bauble garland tinsel stocking snowman advent party confetti firework fireworks sparkler jack-o-lantern jack-o\'-lantern pumpkin-lantern carnival valentine piñata pinata cracker candy-cane gingerbread-house menorah dreidel lantern-festival egg-hunt',
};
const KWMAP = {};
for (const [c, s] of Object.entries(KW)) for (const w of s.split(/\s+/)) if (!KWMAP[w]) KWMAP[w] = c;
function category(en, fam) {
  if (KWMAP[fam]) return KWMAP[fam];
  const w = words(en).map(singular);
  for (let i = w.length - 1; i >= 0; i--) if (KWMAP[w[i]]) return KWMAP[w[i]];
  return null;
}
function difficulty(en, cat) {
  const w = words(en);
  if (cat === 'place' || cat === 'nature' || w.includes('scene') || w.includes('with')) return 3;
  if (w.includes('of') || w.includes('and')) return 2;
  return 1;
}

function readFixes() {
  const fx = {};
  if (!fs.existsSync(FIXES)) return fx;
  for (const line of fs.readFileSync(FIXES, 'utf8').split('\n')) {
    const m = line.trim().match(/^(\d+)\s*=\s*(.+)$/); if (!m) continue;
    const i = +m[1], v = m[2].trim().toLowerCase(), o = fx[i] = fx[i] || {};
    if (/^[123]$/.test(v)) o.d = +v;
    else if (/^f:/.test(v)) o.f = v.slice(2).trim();
    else if (CATS.includes(v)) o.c = v;
    else o.f = v;
  }
  return fx;
}
function build() {
  const fx = readFixes();
  // продукты для «блюдо → продукт»: семьи однословных предметов-еды
  const fam0 = S.map(r => family(r[0]));
  const foods = new Set(fam0.filter((f, i) => ['food', 'plant'].includes(KWMAP[f]) && words(S[i][0]).filter(x => !STOP.has(x)).length === 1));
  for (const w of KW.food.split(/\s+/)) if (!DISHES.has(w)) foods.add(w);
  return S.map((r, i) => {
    const auto = family(r[0], foods), f = (fx[i] && fx[i].f) || auto;
    const kc = category(r[0], f), c = (fx[i] && fx[i].c) || kc;
    const d = (fx[i] && fx[i].d) || difficulty(r[0], c);
    return { i, en: r[0], f, c, d, kc };
  });
}
function save(T) {
  const bad = T.filter(t => !t.c);
  fs.writeFileSync(OUT, '[\n' + T.map(t => JSON.stringify({ i: t.i, en: t.en, f: t.f, c: t.c, d: t.d })).join(',\n') + '\n]\n');
  const cnt = k => T.reduce((o, t) => (o[t[k]] = (o[t[k]] || 0) + 1, o), {});
  console.log('предметов', T.length, '· без категории', bad.length, '· семей', Object.keys(cnt('f')).length);
  console.log('сложность', JSON.stringify(cnt('d')));
  console.log('категории', JSON.stringify(cnt('c')));
}
const line = t => `${t.i} | ${t.en} | ${t.f} | ${t.c || '?'} | ${t.d}`;
const [cmd, arg] = process.argv.slice(2);
if (cmd === 'apply') {
  const add = fs.readFileSync(0, 'utf8').split('\n').map(s => s.trim()).filter(s => /^\d+\s*=/.test(s));
  fs.appendFileSync(FIXES, add.join('\n') + (add.length ? '\n' : ''));
  console.log('правок +', add.length);
  save(build());
} else if (cmd === 'groups' || cmd === 'uncat') {
  const T = build();
  let rows;
  if (cmd === 'groups') {
    const by = {}; for (const t of T) (by[t.f] = by[t.f] || []).push(t);
    rows = Object.keys(by).filter(f => by[f].length > 1).sort().flatMap(f => by[f]);
  } else rows = T.filter(t => !t.kc);
  const n = +arg || 1, page = rows.slice((n - 1) * BATCH, n * BATCH);
  console.log(`пачка ${n} из ${Math.ceil(rows.length / BATCH)} (${rows.length} строк)`);
  console.log(page.map(line).join('\n'));
} else save(build());
