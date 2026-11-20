// Пины №945–1084 «Топ-форматы 2.0» (Алина 20.11.2026: аналитика Pinterest 21.10–20.11 — палитры 2,4k, темы для рисования 2k, акварель 386).
// Движок: node tools/pins/pins16.js [номер…]; заготовки картинок — python3 tools/pins/pins16_prep.py (tools/pins/p16/).
// 945–984 темы на месяц/30 дней (prompts), 985–1024 палитры-эстетики по детали арта (pal), 1025–1054 «акварель за 4 шага» (steps),
// 1055–1084 пять новых форматов по 6: palch (палитра-челлендж), bingo, ispy (найди детали), diff (найди отличия), dtiys (нарисуй в своём стиле).
// Тема — v2 сайта (кремовый #F4F0EA / тёмный #2E2521 / ночной #1C2430, акцент #22405F/#93AFCC, зимой #9E1B22), значок v3 по фону.
const SITE = 'https://www.pigeonpolly.com';
const L = (_, n) => `${SITE}/draw/?f=p${n}&utm_source=pinterest&utm_campaign=top26&utm_content=pin-${n}`;  // всё целиком — на /draw/ (Алина: пин не даёт всё сразу)
const A = k => /\//.test(k) ? k : /^\d{4}-(pigeon|polly)/.test(k) ? `bird/${k}.jpg` : /^\d{4}-/.test(k) ? `snail/${k}.jpg` : /^sketchbook-/.test(k) ? `sketchbook/${k}.jpg` : /^halloween-/.test(k) ? `halloween/${k}.jpg` : /^anxiety-/.test(k) ? `anxiety/${k}.jpg` : `photos2/${k}.jpg`;

// ——— 1) темы для рисования: [заголовок с <em>, плашка, арт, позиция, тема, сезон, темы Pinterest, ...пункты] ———
const PR = [
  ['31 cozy <em>January</em> things to draw', 'january 2027 drawing challenge', '2025-pigeon-polly-celebrates-new-year', '50% 40%', 'night', 'Зима', 'January drawing prompts, Winter sketchbook ideas, Drawing challenge 2027',
    'a fresh planner', 'frosty window', 'hot cocoa mug', 'leftover cookies', 'wool mittens', 'snow boots', 'a sleepy cat', 'tangerine peel', 'a candle', 'your slippers', 'icicles', 'a bird feeder', 'sledge', 'thick socks', 'soup pot', 'a winter hat', 'a library book', 'tea bag', 'snowy roof', 'a radiator', 'steamy bath', 'a snow shovel', 'old Christmas card', 'frozen puddle', 'a scarf', 'pinecone', 'bowl of porridge', 'warm blanket', 'a lamp at night', 'a teapot', 'your view today'],
  ['28 days of <em>tiny love</em> to draw', 'february 2027 drawing challenge', '2024-mr-chew-celebrates-valentines-day', '50% 50%', 'paper', 'Зима', 'February drawing prompts, Valentine drawing ideas, Cute doodles',
    'a love letter', 'two mugs', 'a heart cookie', 'a red sock', 'a rose in a jar', 'holding hands', 'a little gift box', 'a cat hug', 'pink macarons', 'a mixtape', 'a postcard', 'a lipstick', 'a heart balloon', 'two snails', 'a cozy bed', 'a love song', 'cherry pie', 'a friendship bracelet', 'a ring box', 'chocolate box', 'a teddy bear', 'a doodle of you', 'a kind note', 'two toothbrushes', 'a bouquet', 'pillow fort', 'a heart cloud', 'your favourite person'],
  ['31 days of <em>spring thaw</em> to draw', 'march 2027 drawing challenge', 'sketchbook-7', '50% 50%', 'sage', 'Весна', 'March drawing prompts, Spring sketchbook ideas, Drawing challenge',
    'a melting snowman', 'first snowdrop', 'rubber boots', 'a puddle', 'a seed packet', 'a robin', 'muddy path', 'a kite', 'a pussy willow', 'a raincoat', 'an egg carton', 'garden gloves', 'a tulip bulb', 'a wet umbrella', 'a birdhouse', 'a watering can', 'a bicycle', 'spring cleaning', 'a daffodil', 'a nest', 'a lamb', 'a sprouting onion', 'a windy day', 'sunny window', 'a frog', 'a cherry branch', 'a picnic blanket', 'clothes line', 'a straw hat', 'a pot of herbs', 'the first sunset'],
  ['30 rainy <em>April</em> drawing prompts', 'april 2027 drawing challenge', '2024-mr-chew-gardening-edition', '50% 50%', 'paper', 'Весна', 'April drawing prompts, Rainy day drawing ideas, Spring drawing challenge',
    'a yellow raincoat', 'a snail on a leaf', 'drops on glass', 'a paper boat', 'a rain cloud', 'a soggy shoe', 'an umbrella', 'a worm', 'a mushroom', 'a rainbow', 'a teacup', 'a cozy window', 'muddy boots', 'a pond', 'a duck', 'a wet dog', 'a seedling', 'a rain gauge', 'a bus stop', 'a book & blanket', 'a toad', 'a garden shed', 'lilac', 'an Easter egg', 'a hot water bottle', 'a bee', 'a basket', 'wellies', 'a dripping roof', 'puddle reflection'],
  ['31 <em>blooming</em> May drawing prompts', 'may 2027 drawing challenge', 'impasto_flowers', '50% 50%', 'blush', 'Весна', 'May drawing prompts, Flower drawing ideas, Spring drawing challenge',
    'a peony', 'lily of the valley', 'a flower crown', 'a bee', 'a garden chair', 'a strawberry', 'a ladybug', 'a vase', 'a dandelion', 'a lemonade', 'a butterfly', 'a flower shop', 'a sun hat', 'a picnic basket', 'a bird bath', 'pressed flowers', 'a bike basket', 'a garden gnome', 'a lilac branch', 'an open window', 'a fountain', 'a hammock', 'a teapot of flowers', 'sunglasses', 'a dragonfly', 'a rhubarb', 'a postcard', 'a flowerpot', 'a cherry tree', 'a sunset', 'your balcony'],
  ['30 <em>summer evening</em> things to draw', 'june 2027 drawing challenge', '2022-pigeon-polly-summer-lover', '50% 45%', 'wash', 'Лето', 'June drawing prompts, Summer drawing ideas, Drawing challenge',
    'a fan', 'an ice pop', 'fireflies', 'a garden party', 'a watermelon', 'a lantern', 'a deck chair', 'a cold drink', 'a moth', 'a barbecue', 'a radio', 'a mosquito net', 'string lights', 'a sunburn', 'a cherry bowl', 'a beach bag', 'sandals', 'a campfire', 'a swing', 'a balcony plant', 'a bicycle', 'an ice cream van', 'a sunset sky', 'a hose', 'a tent', 'a cat in shade', 'a paper fan', 'a straw', 'a star', 'midsummer wreath'],
  ['31 <em>summer holiday</em> drawing prompts', 'july 2027 drawing challenge', '2022-pigeon-polly-started-own-small-business', '50% 50%', 'wash', 'Лето', 'July drawing prompts, Summer sketchbook ideas, Vacation drawing',
    'a suitcase', 'a passport', 'a train ticket', 'a seashell', 'a beach towel', 'a postcard', 'sunscreen', 'a camper van', 'an ice cream', 'a lighthouse', 'a sandcastle', 'a straw hat', 'flip-flops', 'a map', 'a souvenir', 'a lemon tree', 'a crab', 'a sailboat', 'a hotel key', 'a snorkel', 'a pool float', 'a sun lounger', 'a picnic', 'a gelato cone', 'a market stall', 'a bus window', 'a seagull', 'a fishing boat', 'sunglasses', 'a souvenir mug', 'your holiday'],
  ['31 <em>late summer</em> garden prompts', 'august 2027 drawing challenge', '2024-mr-chew-gardening-edition', '50% 45%', 'sage', 'Лето', 'August drawing prompts, Garden drawing ideas, Drawing challenge',
    'a tomato', 'a sunflower', 'a zucchini', 'a jar of jam', 'a plum', 'a garden hose', 'a scarecrow', 'a basket of apples', 'a beehive', 'a cucumber', 'a pumpkin sprout', 'garden boots', 'a wheelbarrow', 'a pea pod', 'a cabbage', 'a rake', 'a snail', 'a blackberry', 'a gate', 'a compost bin', 'a bird', 'an onion', 'a pear', 'a dahlia', 'a seed packet', 'a garden table', 'a carrot', 'a straw hat', 'a jar of honey', 'a cat in grass', 'the last sunflower'],
  ['30 <em>back to the sketchbook</em> prompts', 'september 2027 drawing challenge', 'sketchbook-14', '50% 45%', 'clay', 'Осень', 'September drawing prompts, Back to school drawing, Sketchbook ideas',
    'a pencil case', 'a new sketchbook', 'a backpack', 'an apple', 'a lunchbox', 'a ruler', 'a school bus', 'a globe', 'a library', 'a desk lamp', 'a calculator', 'an eraser', 'a chalkboard', 'a bookworm', 'a teacher’s mug', 'a notebook', 'a paint box', 'a sharpener', 'a timetable', 'a raincoat', 'a bike', 'an acorn', 'a scarf', 'a cardigan', 'a coffee', 'a bookshelf', 'a sticker', 'a paper clip', 'a pen', 'your bag'],
  ['31 <em>cozy-spooky</em> October prompts', 'october 2027 drawing challenge', 'halloween-in-blue', '50% 35%', 'dark', 'Осень', 'October drawing prompts, Inktober ideas, Halloween drawing challenge',
    'a pumpkin', 'a black cat', 'a candle', 'a ghost', 'a potion', 'a broom', 'a spider', 'a bat', 'a cauldron', 'a skull', 'a lantern', 'a crow', 'a witch hat', 'a moon', 'a haunted house', 'a mushroom', 'an owl', 'a spellbook', 'a scarecrow', 'a candy bowl', 'a mask', 'a coffin', 'a creepy doll', 'fog', 'a key', 'a mirror', 'a costume', 'a graveyard', 'a cobweb', 'a trick or treat bag', 'your monster'],
  ['24-day <em>advent</em> drawing calendar', 'december drawing challenge', '2025-pigeon-polly-celebrates-new-year', '50% 35%', 'night', 'Зима', 'Advent calendar drawing, Christmas drawing ideas, December sketchbook',
    'a paper star', 'a gingerbread', 'a stocking', 'a wreath', 'a candy cane', 'a snow globe', 'a sled', 'a bauble', 'mulled wine', 'a gift tag', 'a nutcracker', 'a reindeer', 'a mitten', 'a Christmas tree', 'a bell', 'an angel', 'a candle', 'a cookie jar', 'a parcel', 'a pine branch', 'a sleigh', 'a snowflake', 'a fireplace', 'a wish'],
  ['24 <em>ornaments</em> to draw this Christmas', 'christmas drawing ideas', '2023-pigeon-polly-celebrates-new-year', '50% 40%', 'dark', 'Зима', 'Christmas ornament drawing, Christmas drawing ideas, Holiday sketchbook',
    'a glass bird', 'a pickle', 'a pinecone', 'an icicle', 'a tiny house', 'a mushroom', 'a star', 'a felt heart', 'a nutcracker', 'a teapot', 'a moon', 'a squirrel', 'a bell', 'a candy', 'a gingerbread', 'a snowman', 'an angel', 'a fox', 'a bauble', 'a snail', 'a lantern', 'a mitten', 'a pigeon', 'a tiny cake'],
  ['30 <em>potions</em> & witchy things to draw', '30-day drawing challenge', '2024-mr-chew-dnd-edition', '50% 40%', 'dark', 'Осень', 'Witchy drawing ideas, Potion bottle drawing, Fantasy drawing prompts',
    'a love potion', 'a sleep tonic', 'a cauldron', 'a mandrake', 'a spell jar', 'a crystal ball', 'a tarot card', 'a broom', 'a moon phase', 'a herb bundle', 'a spellbook', 'a familiar', 'a wand', 'a candle', 'a toadstool', 'a frog prince', 'a mortar', 'a feather quill', 'a raven', 'a key', 'a teacup reading', 'a wizard hat', 'a magic map', 'a potion shop', 'a dragon egg', 'a poison apple', 'a star jar', 'an old clock', 'a witch’s cat', 'your own potion'],
  ['30 <em>fantasy tavern</em> things to draw', 'd&d drawing challenge', '2024-mr-chew-dnd-edition', '30% 50%', 'night', 'Круглый год', 'D&D drawing ideas, Fantasy drawing prompts, Tavern aesthetic',
    'a dice set', 'a tankard', 'a bard’s lute', 'a quest board', 'a treasure chest', 'a map', 'a dragon scale', 'a sword', 'a cloak', 'an elf ear', 'a stew pot', 'a wanted poster', 'a lantern', 'a bread loaf', 'a coin pouch', 'a goblin', 'a shield', 'a magic ring', 'a scroll', 'a tavern sign', 'a candle', 'a rogue’s dagger', 'a healing potion', 'a fireplace', 'a mimic', 'a horse', 'a cheese wheel', 'a wizard', 'a dungeon door', 'your character'],
  ['30 <em>mushroom & forest</em> drawing prompts', '30-day drawing challenge', 'mushroom_house', '50% 40%', 'sage', 'Осень', 'Mushroom drawing ideas, Cottagecore drawing prompts, Forest sketchbook',
    'a fly agaric', 'a moss stone', 'a fern', 'a hedgehog', 'an acorn', 'a fox', 'a tree stump', 'a snail', 'a pinecone', 'a mushroom house', 'a berry bush', 'a beetle', 'a feather', 'a toadstool ring', 'a forest path', 'a birch', 'an owl', 'a basket', 'a lichen', 'a frog', 'a fairy door', 'a chanterelle', 'a deer', 'a woodpile', 'a raindrop', 'a puffball', 'a firefly', 'a log cabin', 'a mouse', 'a moonlit forest'],
  ['30 things from <em>grandma’s house</em>', '30-day drawing challenge', 'old_house', '50% 50%', 'clay', 'Круглый год', 'Nostalgia drawing ideas, Vintage drawing prompts, Sketchbook ideas',
    'a lace doily', 'a sewing tin', 'a cuckoo clock', 'a rotary phone', 'a jam jar', 'a teapot', 'a rug', 'an armchair', 'a radio', 'a photo album', 'a knitting basket', 'a sugar bowl', 'a vase', 'glasses', 'a cake tin', 'a houseplant', 'slippers', 'a button jar', 'a crystal bowl', 'a cookbook', 'a pickle jar', 'a wall carpet', 'an old TV', 'a pin cushion', 'a candy dish', 'a garden', 'a hand mirror', 'a kettle', 'a postcard', 'her hands'],
  ['30 <em>bookish</em> things to draw', '30-day drawing challenge', 'bookshop', '50% 50%', 'night', 'Круглый год', 'Dark academia drawing, Book drawing ideas, Bookish aesthetic',
    'a book stack', 'a reading lamp', 'a bookmark', 'a library card', 'a tea & book', 'an old globe', 'a quill', 'a typewriter', 'a reading nook', 'glasses', 'a bookshop window', 'a pressed flower', 'an inkwell', 'a candle', 'a cat on books', 'a map', 'a letter', 'a ladder', 'a magnifier', 'a book cart', 'a tote bag', 'a dusty shelf', 'a diary', 'a poem', 'a bookend', 'a rainy window', 'a library stamp', 'a book plant', 'a secret door', 'your favourite book'],
  ['30 <em>cozy gaming</em> drawing prompts', '30-day drawing challenge', 'desk_night', '50% 45%', 'night', 'Зима', 'Cozy gaming drawing, Gamer aesthetic, Drawing prompts',
    'a controller', 'a headset', 'a glowing screen', 'snack bowl', 'a cat on keyboard', 'an energy drink', 'a game cartridge', 'a cozy chair', 'a pixel heart', 'a farm game', 'a fishing game', 'a potion icon', 'a save point', 'a boss', 'a joystick', 'a desk plant', 'a blanket', 'a LED strip', 'a handheld', 'a mushroom power-up', 'a game box', 'a tea', 'a keyboard', 'a quest log', 'a sword', 'a coin', 'a dice', 'a cozy room', 'game over', 'your avatar'],
  ['30 <em>tea party</em> things to draw', '30-day drawing challenge', 'cookies', '50% 50%', 'blush', 'Круглый год', 'Tea party drawing, Cute food drawing, Drawing prompts',
    'a teapot', 'a teacup', 'a sugar cube', 'a scone', 'a jam jar', 'a cake stand', 'a lace napkin', 'a lemon slice', 'a tea tin', 'a macaron', 'a spoon', 'a milk jug', 'a cupcake', 'a flower vase', 'a tea bag', 'a biscuit', 'a cream puff', 'a tray', 'a tea cozy', 'a sandwich', 'a strawberry', 'a honey pot', 'a tablecloth', 'a cat guest', 'a saucer', 'a candle', 'a tart', 'a bird guest', 'a garden table', 'a toast'],
  ['30 <em>foods</em> to paint in watercolor', '30-day painting challenge', 'pbj', '50% 50%', 'wash', 'Круглый год', 'Watercolor food ideas, Food painting, Watercolor practice',
    'a lemon', 'a fried egg', 'a croissant', 'a cherry', 'a sushi roll', 'a toast', 'a pear', 'a tomato', 'a pretzel', 'a donut', 'a garlic', 'a sandwich', 'a pancake', 'a fig', 'a pasta bowl', 'a peach', 'a cheese', 'a pepper', 'a radish', 'a bun', 'an avocado', 'a pie slice', 'a mushroom', 'a lime', 'a bagel', 'a dumpling', 'an orange', 'a cookie', 'a waffle', 'your lunch'],
  ['30 <em>desserts</em> to draw', '30-day drawing challenge', 'cupcake', '50% 45%', 'blush', 'Круглый год', 'Dessert drawing ideas, Cute food drawing, Sketchbook prompts',
    'a cupcake', 'a cherry pie', 'an eclair', 'a tiramisu', 'a pudding', 'a cinnamon roll', 'a macaron', 'a pavlova', 'a sundae', 'a jelly', 'a cheesecake', 'a brownie', 'a mochi', 'a crepe', 'a waffle cone', 'a tart', 'a cookie stack', 'a cake slice', 'a churro', 'a meringue', 'a fruit tart', 'a profiterole', 'a gingerbread', 'a candy apple', 'a donut', 'a trifle', 'a popsicle', 'a creme brulee', 'a birthday cake', 'your favourite'],
  ['30 <em>bugs & tiny critters</em> to draw', '30-day drawing challenge', 'bee_rider', '50% 45%', 'paper', 'Лето', 'Bug drawing ideas, Insect art, Cute drawing prompts',
    'a ladybug', 'a beetle', 'a bumblebee', 'a moth', 'a snail', 'a dragonfly', 'a grasshopper', 'an ant', 'a firefly', 'a spider', 'a caterpillar', 'a butterfly', 'a stag beetle', 'a cricket', 'a worm', 'a water strider', 'a cicada', 'a centipede', 'a mantis', 'a woodlouse', 'a slug', 'a weevil', 'a hornet', 'a cocoon', 'a bee on a flower', 'a bug hotel', 'a gnat', 'a shield bug', 'an ant hill', 'a bug in a hat'],
  ['30 <em>pigeons</em> doing human things', '30-day drawing challenge', '2026-pigeon-polly-keeps-busy-living', '50% 50%', 'wash', 'Круглый год', 'Funny bird drawing, Character drawing ideas, Pigeon art',
    'reading news', 'drinking coffee', 'on a laptop', 'doing yoga', 'baking bread', 'taking a selfie', 'on a tram', 'in a bubble bath', 'painting', 'knitting', 'in a job interview', 'shopping', 'on holiday', 'gardening', 'texting', 'in pajamas', 'at a concert', 'on a bike', 'writing a letter', 'cooking soup', 'sleeping in', 'dancing', 'at the dentist', 'paying bills', 'on a date', 'at the gym', 'in a museum', 'moving house', 'on a picnic', 'being you'],
  ['30 <em>outfits</em> for a snail', '30-day drawing challenge', '2024-mr-chew-steamphunk-edition', '50% 50%', 'paper', 'Круглый год', 'Snail drawing, Cute character ideas, Drawing prompts',
    'a raincoat', 'a top hat', 'a tutu', 'a pirate hat', 'a spacesuit', 'a wizard robe', 'a chef hat', 'a scarf', 'a crown', 'a cowboy hat', 'a superhero cape', 'a knight helmet', 'a beret', 'a sailor suit', 'a ski goggle', 'a flower crown', 'a detective coat', 'a party hat', 'a kimono', 'a backpack', 'a bow tie', 'a swimsuit', 'a lab coat', 'a sweater', 'a tiara', 'a gnome hat', 'a viking helmet', 'a scuba mask', 'pajamas', 'a pumpkin shell'],
  ['30 gentle prompts for <em>hard days</em>', 'drawing for calm', 'anxiety-4', '50% 50%', 'sage', 'Круглый год', 'Art for anxiety, Mindful drawing prompts, Self care sketchbook',
    'your cup of tea', 'a soft blanket', 'one leaf', 'your breath as lines', 'a window', 'your hands', 'a pillow', 'a cloud', 'a plant', 'a warm light', 'a slow snail', 'your shoes', 'a stone', 'the sky now', 'a spoon', 'a candle', 'one flower', 'a cat', 'a calm color', 'a circle', 'your bed', 'a sock', 'a raindrop', 'a safe place', 'a friend', 'a sound', 'a smell', 'a small win', 'a good memory', 'tomorrow'],
  ['30 things on your <em>bathroom shelf</em>', '30-day drawing challenge', '2024-pigeon-polly-bath-relax', '50% 50%', 'wash', 'Круглый год', 'Still life drawing ideas, Everyday objects, Sketchbook prompts',
    'a toothbrush', 'a soap bar', 'a rubber duck', 'a perfume', 'a comb', 'a towel', 'a sponge', 'a shampoo', 'a cotton jar', 'a nail polish', 'a mirror', 'a bath bomb', 'a razor', 'a shower cap', 'a lipstick', 'a hair clip', 'a plant', 'a candle', 'a seashell', 'cream jar', 'a loofah', 'a hairdryer', 'slippers', 'a robe', 'a tile', 'a bathtub', 'a plaster', 'a face mask', 'tweezers', 'a hair tie'],
  ['30 <em>windowsill</em> things to draw', '30-day drawing challenge', 'plants_tin', '50% 50%', 'sage', 'Весна', 'Plant drawing ideas, Houseplant art, Drawing prompts',
    'a cactus', 'a pothos', 'a basil pot', 'a sleeping cat', 'a jar of water', 'a geranium', 'a monstera leaf', 'a seedling tray', 'a teacup', 'a glass bottle', 'a succulent', 'a watering can', 'a curtain', 'a fly', 'a postcard', 'a candle', 'an avocado pit', 'an orchid', 'a stone', 'a mint pot', 'a sun-catcher', 'a pinecone', 'a snake plant', 'a radio', 'a tomato plant', 'a vase', 'a book', 'frost', 'a bird outside', 'your view'],
  ['30 <em>old town</em> sketching spots', 'urban sketching challenge', 'sketchbook-20', '50% 50%', 'clay', 'Круглый год', 'Urban sketching ideas, Old town drawing, Sketchbook challenge',
    'a church spire', 'a cobbled street', 'a street lamp', 'a bakery sign', 'a balcony', 'a red roof', 'an arch', 'a door knocker', 'a clock tower', 'a market', 'a fountain', 'a tram', 'a chimney', 'a shop window', 'a bridge', 'a pigeon', 'a bench', 'a weathervane', 'a café umbrella', 'a flower box', 'a stairway', 'a mailbox', 'a corner house', 'a bike', 'a gate', 'a statue', 'a narrow street', 'an old car', 'a rooftop', 'your street'],
  ['30 <em>seaside</em> things to draw', '30-day drawing challenge', '2022-pigeon-polly-summer-lover', '60% 50%', 'wash', 'Лето', 'Beach drawing ideas, Coastal art, Summer drawing prompts',
    'a seashell', 'a lighthouse', 'a crab', 'a beach hut', 'a sandcastle', 'a sun hat', 'a starfish', 'a sailboat', 'an anchor', 'a seagull', 'a beach ball', 'flip-flops', 'a pier', 'a jellyfish', 'a pebble', 'a fishing net', 'an ice cream', 'a towel', 'a buoy', 'a wave', 'a whale', 'a bucket', 'a surfboard', 'a dune', 'a message bottle', 'a deck chair', 'driftwood', 'a fish', 'a sunset', 'your footprints'],
  ['30 <em>retro 90s</em> things to draw', '30-day drawing challenge', 'retro_tv', '50% 45%', 'clay', 'Круглый год', '90s nostalgia drawing, Retro aesthetic, Drawing prompts',
    'a cassette', 'a walkman', 'a game boy', 'a tamagotchi', 'a floppy disk', 'a VHS tape', 'a flip phone', 'a scrunchie', 'roller skates', 'a lava lamp', 'a disposable camera', 'a pager', 'a CD player', 'a jelly sandal', 'a slap bracelet', 'a beanie baby', 'a boombox', 'a big TV', 'a cereal box', 'a butterfly clip', 'a yo-yo', 'a diary with lock', 'a mixtape', 'a polaroid', 'a phone booth', 'gel pens', 'a sticker book', 'a rubik’s cube', 'a dial-up modem', 'your childhood toy'],
  ['30 things from the <em>grocery store</em>', '30-day drawing challenge', 'sardines', '50% 50%', 'paper', 'Круглый год', 'Grocery drawing ideas, Packaging art, Food sketchbook',
    'a sardine tin', 'a milk carton', 'an egg box', 'a baguette', 'a jam jar', 'a cereal box', 'a soda can', 'a lemon net', 'a cheese', 'a tomato can', 'a pasta bag', 'a cookie pack', 'a banana bunch', 'a tea box', 'a ketchup', 'a yogurt', 'olive oil', 'a candy bar', 'a basket', 'a receipt', 'a potato bag', 'a coffee bag', 'a pickles jar', 'a cart', 'a bread loaf', 'mustard', 'a melon', 'a flower bunch', 'a tote bag', 'your snack'],
  ['30 <em>cat</em> drawing prompts', '30-day drawing challenge', 'cat_lights', '50% 40%', 'night', 'Круглый год', 'Cat drawing ideas, Cute cat art, Drawing prompts',
    'a cat loaf', 'a cat in a box', 'a stretching cat', 'a cat on a laptop', 'cat paws', 'a cat in a sink', 'a cat bed', 'a yawning cat', 'a cat tail', 'a cat & yarn', 'a cat in a window', 'a sleepy cat', 'a cat face', 'a cat in a bag', 'a cat bowl', 'a cat toy', 'a cat on a shelf', 'a grumpy cat', 'a cat in a hat', 'a cat & fish', 'a cat nap', 'a cat in rain', 'a cat with plant', 'a cat butt', 'a cat at night', 'a kitten', 'a cat in sun', 'a cat hug', 'a cat portrait', 'your cat'],
  ['30 <em>tiny houses & doors</em> to draw', '30-day drawing challenge', 'birdhouse', '50% 45%', 'paper', 'Круглый год', 'House drawing ideas, Door drawing, Sketchbook prompts',
    'a birdhouse', 'a red door', 'a tree house', 'a mushroom house', 'a lighthouse', 'a cottage', 'a round door', 'a tiny shop', 'a doghouse', 'a castle gate', 'a boat house', 'a garden shed', 'a gingerbread house', 'a barn', 'a teapot house', 'a houseboat', 'a door wreath', 'a windmill', 'a fairy door', 'a caravan', 'a log cabin', 'a tent', 'a snail shell', 'a stone arch', 'a mailbox', 'a shop door', 'a greenhouse', 'a tiny church', 'a blue door', 'your front door'],
  ['30 <em>cozy clothes</em> to draw', '30-day drawing challenge', 'redhair', '50% 30%', 'clay', 'Осень', 'Clothes drawing ideas, Fashion sketchbook, Drawing prompts',
    'a knit sweater', 'a beret', 'a wool scarf', 'thick socks', 'a raincoat', 'mittens', 'a cardigan', 'a bobble hat', 'boots', 'a robe', 'a corduroy jacket', 'a plaid skirt', 'a hoodie', 'pajamas', 'a trench coat', 'earmuffs', 'a turtleneck', 'slippers', 'a tote bag', 'a vest', 'a puffer coat', 'a cap', 'leg warmers', 'a shawl', 'a dungaree', 'a cozy outfit', 'a button', 'a zipper', 'a pocket', 'your favourite'],
  ['30 <em>lights & lanterns</em> to draw', '30-day drawing challenge', 'lanterns', '50% 50%', 'night', 'Зима', 'Lantern drawing ideas, Cozy lights, Drawing prompts',
    'a paper lantern', 'a candle', 'a fairy light jar', 'a street lamp', 'a desk lamp', 'a lighthouse', 'a firefly', 'a campfire', 'a torch', 'an oil lamp', 'a neon sign', 'a moon', 'a sparkler', 'a lit window', 'a star', 'a chandelier', 'a nightlight', 'a match', 'a tea light', 'a bike light', 'a disco ball', 'a lantern festival', 'a glow stick', 'a fireplace', 'sunrise', 'a candle shop', 'a lamp shade', 'a glowing mushroom', 'a cozy cafe', 'the city at night'],
  ['30 <em>dreamy night sky</em> prompts', '30-day drawing challenge', '2023-pigeon-polly-thinking-about-relocation-to-mars', '50% 50%', 'night', 'Круглый год', 'Night sky drawing, Space drawing ideas, Dreamy art prompts',
    'a crescent moon', 'a rocket', 'a shooting star', 'a telescope', 'Saturn', 'a comet', 'an astronaut', 'a constellation', 'a UFO', 'a moon rabbit', 'a star jar', 'a night owl', 'a galaxy', 'a planet cat', 'aurora', 'a satellite', 'a moth & moon', 'a sleeping town', 'a star map', 'a moon cake', 'a meteor', 'a dream cloud', 'a lighthouse', 'a sky lantern', 'a moon garden', 'Mars', 'an alien snail', 'a star pillow', 'a night train', 'your wish'],
  ['30 <em>veggies</em> with personality', '30-day drawing challenge', 'apple_creature', '50% 45%', 'sage', 'Круглый год', 'Cute food characters, Funny vegetable drawing, Drawing prompts',
    'a grumpy onion', 'a shy radish', 'a brave carrot', 'a sleepy potato', 'a fancy eggplant', 'a cool cucumber', 'a crying onion', 'a pea family', 'a tomato chef', 'a broccoli tree', 'a garlic ghost', 'a corn dancer', 'a beet in love', 'a pumpkin king', 'a lazy lettuce', 'a pepper rockstar', 'a leek wizard', 'a cabbage baby', 'a zucchini cop', 'a mushroom granny', 'a ginger yogi', 'a turnip hero', 'a chili devil', 'a celery queen', 'an avocado couple', 'a bean twins', 'a sprout kid', 'a kale influencer', 'an artichoke knight', 'a lemon'],
  ['30 things that are <em>blue</em>', 'one-color drawing challenge', 'snail_adam', '50% 50%', 'wash', 'Круглый год', 'Color challenge, Blue art ideas, Drawing prompts',
    'a blueberry', 'a whale', 'jeans', 'a bluebird', 'a teapot', 'a raindrop', 'a blue door', 'a forget-me-not', 'a sailor hat', 'a jellyfish', 'an ink bottle', 'a blue cheese', 'a planet', 'a mailbox', 'a vase', 'a butterfly', 'a swimming pool', 'a blue jay', 'a sweater', 'a car', 'a postage stamp', 'a hydrangea', 'a mug', 'a wave', 'a peacock', 'a bike', 'a glass bottle', 'a sky', 'a blue tile', 'your blue thing'],
  ['24 <em>red</em> things to paint this Christmas', 'one-color drawing challenge', 'lanterns', '30% 50%', 'paper', 'Зима', 'Christmas color challenge, Red art ideas, Holiday drawing prompts',
    'a bauble', 'a robin', 'a mitten', 'a poinsettia', 'a ribbon', 'a candy cane', 'a cherry', 'a sleigh', 'a stocking', 'a holly berry', 'a fire truck', 'a Santa hat', 'a gift box', 'a red mug', 'a lantern', 'a fox', 'a cranberry', 'a scarf', 'a postbox', 'a toadstool', 'an apple', 'a candle', 'a heart', 'a red door'],
  ['30 things to draw in <em>5 minutes</em>', 'quick sketch challenge', 'sketchbook-12', '50% 50%', 'paper', 'Круглый год', 'Quick sketch ideas, Easy drawing prompts, Sketchbook warm-up',
    'a spoon', 'a key', 'your shoe', 'a cup', 'a lemon', 'a clip', 'a leaf', 'your hand', 'a bottle', 'a sock', 'a lamp', 'a phone', 'a plant', 'a fork', 'a chair', 'glasses', 'a pen', 'a box', 'a fruit', 'a towel', 'a tap', 'a cloud', 'a pillow', 'a book', 'a fence', 'a shadow', 'an egg', 'a rock', 'a tree', 'the view'],
];

// ——— 2) палитры-эстетики по детали арта: [название с <em>, арт, кадр [x,y,w,h] в долях, позиция, описание, темы, сезон] ———
const PA = [
  ['Witch’s <em>cauldron</em>', '2024-mr-chew-dnd-edition', [0, .05, .55, .8], 'Bubbling potion green and smoky violet: a palette for witchy, magical art.', 'Witchy color palette, Potion green, Fantasy palette', 'Осень'],
  ['Dungeon <em>map</em>', '2024-mr-chew-dnd-edition', [.45, .3, .55, .7], 'Torch amber, parchment and stone: a D&D adventure palette.', 'D&D color palette, Fantasy colors, Adventure palette', 'Круглый год'],
  ['Hygge <em>evening</em>', '2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes', [0, .1, .6, .9], 'Candle glow, cocoa and wool: a warm hygge palette for cozy nights in.', 'Hygge color palette, Cozy aesthetic, Warm palette', 'Зима'],
  ['Christmas <em>table</em>', '2025-pigeon-polly-celebrates-new-year', [.3, .3, .7, .7], 'Pine green, cranberry and candlelight gold: a festive dinner palette.', 'Christmas color palette, Holiday table, Festive colors', 'Зима'],
  ['Midnight <em>tree</em>', '2025-pigeon-polly-celebrates-new-year', [0, 0, .45, .8], 'Deep fir, garland gold and midnight blue: a magical Christmas-night palette.', 'Christmas tree colors, Dark festive palette, Winter night', 'Зима'],
  ['Champagne <em>countdown</em>', '2023-pigeon-polly-celebrates-new-year', [.2, 0, .8, .7], 'Party gold, berry and soft lilac: a New Year’s Eve palette.', 'New Year color palette, Party colors, Festive palette', 'Зима'],
  ['Warm <em>blanket</em> morning', '2022-pigeon-polly-celebrates-new-year-first-time-in-the-bed', [.1, .3, .8, .7], 'Plum, quilt rose and pillow cream: a sleepy, cozy-bed palette.', 'Cozy bedroom palette, Plum colors, Soft palette', 'Зима'],
  ['Dark <em>academia</em> desk', '2019-pigeon-polly-writing-diploma', [.3, .2, .7, .8], 'Mahogany, ink and old paper: a scholarly dark academia palette.', 'Dark academia palette, Moody colors, Study aesthetic', 'Осень'],
  ['Bubble <em>bath</em> blues', '2024-pigeon-polly-bath-relax', [.1, .2, .8, .8], 'Tile blue, foam white and towel pink: a calm self-care palette.', 'Blue color palette, Bathroom aesthetic, Self care colors', 'Круглый год'],
  ['Mars <em>sunflowers</em>', '2023-pigeon-polly-thinking-about-relocation-to-mars', [0, .5, .6, .5], 'Sunflower yellow on deep-space navy: a dreamy cosmic palette.', 'Space color palette, Navy and yellow, Dreamy palette', 'Круглый год'],
  ['Ice cream <em>van</em>', '2022-pigeon-polly-started-own-small-business', [.1, .1, .8, .7], 'Sunshine yellow, sky and grass: a happy summer-business palette.', 'Summer color palette, Bright colors, Retro van', 'Лето'],
  ['Beach <em>read</em>', '2022-pigeon-polly-summer-lover', [.2, .1, .7, .8], 'Sand, lifebuoy red and sea blue: a breezy beach-day palette.', 'Beach color palette, Summer colors, Coastal palette', 'Лето'],
  ['Graphic <em>designer</em>', '2022-pigeon-polly-graphic-designer', [0, .2, .55, .8], 'Pantone chips, pencil yellow and teal: a creative-studio palette.', 'Designer color palette, Creative colors, Studio palette', 'Круглый год'],
  ['Office <em>chaos</em>', '2026-pigeon-polly-fired-changing-remote-work-to-office-job-after-6-years', [0, .1, .6, .9], 'Alarm red, folder blue and coffee: a loud, funny office palette.', 'Red and blue palette, Office aesthetic, Bold colors', 'Круглый год'],
  ['Fancy <em>life</em>', '2026-pigeon-polly-fancy-life', [.2, 0, .8, .8], 'Velvet plum, gold and powder pink: a glamorous, extra palette.', 'Glam color palette, Plum and gold, Luxury colors', 'Круглый год'],
  ['Pumpkin spice <em>latte</em>', '2025-mr-chew-opened-pumpkin-spice-latte-season', [.2, .1, .7, .8], 'Pumpkin, foam and cinnamon: the coziest autumn drink palette.', 'Pumpkin spice palette, Autumn colors, Coffee palette', 'Осень'],
  ['Steampunk <em>workshop</em>', '2024-mr-chew-steamphunk-edition', [.2, .1, .7, .8], 'Brass, copper rust and slime green: a quirky steampunk palette.', 'Steampunk color palette, Brass and copper, Vintage palette', 'Круглый год'],
  ['Potting <em>shed</em>', '2024-mr-chew-gardening-edition', [0, .2, .55, .8], 'Clay pots, moss and brick: an earthy gardening palette.', 'Garden color palette, Earthy tones, Cottagecore colors', 'Весна'],
  ['Rainbow <em>candy</em>', '2024-mr-chew-rainbow-candy-edition', [.1, .1, .8, .8], 'Unicorn pink, lemon and sky: a sweet pastel candy palette.', 'Pastel color palette, Candy colors, Rainbow palette', 'Весна'],
  ['Postal <em>parcel</em>', '2023-mr-chew-australian-postal-snail-introduction', [.2, .1, .6, .8], 'Kraft paper, stamp red and string: a snail-mail palette.', 'Snail mail palette, Kraft paper colors, Vintage palette', 'Круглый год'],
  ['Valentine <em>shell</em>', '2024-mr-chew-celebrates-valentines-day', [.2, .2, .6, .7], 'Rose, blush and cocoa: a sweet Valentine’s palette.', 'Valentine color palette, Pink palette, Romantic colors', 'Зима'],
  ['Travel <em>suitcase</em>', '2025-mr-chew-travel-edition-can-you-find-polly', [.3, .1, .6, .8], 'Map paper, leather and sea teal: a wanderlust palette.', 'Travel color palette, Vintage map colors, Adventure palette', 'Лето'],
  ['Persimmon <em>season</em>', 'sketchbook-17', [.1, .1, .8, .8], 'Persimmon orange on turquoise paper: a juicy complementary palette.', 'Orange and teal palette, Fruit painting, Complementary colors', 'Осень'],
  ['Old town <em>roofs</em>', 'sketchbook-7', [0, .3, 1, .7], 'Roof rust, spire grey and cloud blue: a European old-town palette.', 'Old town palette, Urban sketching colors, European city', 'Круглый год'],
  ['Brick <em>house</em> evening', 'sketchbook-8', [.2, .2, .6, .7], 'Brick, slate and lamplight: a sketchbook street palette.', 'Brick color palette, Urban sketch, Moody palette', 'Осень'],
  ['Frosted <em>field</em>', 'winter_field', [0, 0, 1, 1], 'Snow, birch grey and dry grass: a quiet winter-landscape palette.', 'Winter color palette, Neutral palette, Snow landscape', 'Зима'],
  ['Lamp-lit <em>bookshop</em>', 'bookshop', [.1, .1, .8, .8], 'Ink navy, window gold and book spines: a cozy night bookshop palette.', 'Bookish aesthetic, Cozy night palette, Navy and gold', 'Зима'],
  ['Fairy light <em>cat</em>', 'cat_lights', [0, 0, 1, .6], 'Bulb yellow on velvet black: a twinkly cozy-night palette.', 'Fairy lights palette, Dark cozy colors, Cat art', 'Зима'],
  ['Cereal <em>splash</em>', 'cereal', [.1, .1, .8, .8], 'Tomato red, milk and loop pastels: a pop-art breakfast palette.', 'Pop art palette, Red color palette, Breakfast art', 'Круглый год'],
  ['Moka <em>morning</em>', 'moka_rust', [.2, .1, .6, .8], 'Steel, rust and espresso: an industrial coffee palette.', 'Coffee color palette, Rust tones, Industrial palette', 'Осень'],
  ['Toadstool <em>cottage</em>', 'mushroom_house', [.1, 0, .8, .7], 'Toadstool red, moss and rain teal: a storybook cottagecore palette.', 'Cottagecore palette, Mushroom colors, Fairytale palette', 'Осень'],
  ['Retro <em>living room</em>', 'retro_tv', [.1, .1, .8, .8], 'Lamp orange, TV blue and carpet red: a nostalgic 90s palette.', '90s color palette, Retro room, Nostalgic colors', 'Круглый год'],
  ['Plague <em>doctor</em>', 'plague', [.2, .1, .6, .8], 'Ink black, lantern and blood-red drops: a dark gothic palette.', 'Gothic color palette, Dark aesthetic, Black and red', 'Осень'],
  ['Folk <em>beads</em>', 'karums_girl', [.2, .1, .6, .8], 'Coral beads, plum scarf and rosy cheeks: a folk-art palette.', 'Folk art palette, Coral and plum, Warm palette', 'Круглый год'],
  ['Night <em>shift</em> desk', 'desk_night', [.1, .2, .8, .7], 'Screen glow and midnight teal: a late-night creative palette.', 'Night aesthetic, Teal palette, Gamer room colors', 'Зима'],
  ['Garden <em>lanterns</em>', 'lanterns', [.2, .1, .7, .8], 'Lantern red and leaf green on biscuit paper: a festive-garden palette.', 'Red and green palette, Lantern art, Festive palette', 'Зима'],
  ['Cherry on <em>top</em>', 'cupcake', [.2, 0, .6, .5], 'Cherry red, cream and teal: a bold dessert palette.', 'Dessert color palette, Red and teal, Cupcake art', 'Круглый год'],
  ['Kraft <em>postcards</em>', 'postcard_world', [.1, .1, .8, .8], 'Kraft brown, sepia ink and stamp gold: a vintage postcard palette.', 'Vintage color palette, Kraft paper, Sepia tones', 'Круглый год'],
  ['Calm <em>mat</em>', 'yoga', [.1, .3, .8, .7], 'Sea cobalt, terracotta and denim: a calm morning-stretch palette.', 'Calm color palette, Blue and terracotta, Self care', 'Круглый год'],
  ['Pumpkin <em>portrait</em>', 'halloween-lady', [.1, 0, .8, .6], 'Pumpkin orange, teal frame and violet: a whimsical Halloween palette.', 'Halloween palette, Orange and teal, Whimsical colors', 'Осень'],
];

// ——— 3) «за 4 шага»: [предмет (для заголовка), арт, что это (alt), темы, сезон, совет к шагу 4] ———
const ST = [
  ['a cherry cupcake', 'cupcake', 'a cupcake with whipped cream and a cherry', 'Cupcake painting, Dessert art, Step by step painting', 'Круглый год', 'Save the brightest red for the cherry'],
  ['a cozy birdhouse', 'birdhouse', 'a wooden birdhouse with cherry blossoms', 'Birdhouse drawing, Spring painting, Step by step watercolor', 'Весна', 'Dark inside the hole makes it pop'],
  ['a beetle', 'beetle', 'a shiny brown rhinoceros beetle', 'Beetle drawing, Insect painting, Step by step watercolor', 'Круглый год', 'Leave white paper for the shine'],
  ['an apple', 'apple', 'a cut apple in watercolor', 'Apple painting, Fruit watercolor, Easy watercolor steps', 'Осень', 'Keep the cut side almost white'],
  ['a moka pot', 'moka_rust', 'a steel moka coffee pot with splashes', 'Coffee pot drawing, Ink and watercolor, Step by step painting', 'Круглый год', 'Splash a few drops at the very end'],
  ['a juicy burger', 'burger', 'a big burger with cheese and lettuce', 'Burger painting, Food art, Step by step painting', 'Лето', 'Darken under each layer'],
  ['milk & cookies', 'cookies', 'a glass of milk and cookies', 'Cookie painting, Food still life, Step by step painting', 'Зима', 'Paint the milk with the shadows only'],
  ['a jar of caviar', 'ikra', 'a jar of red caviar', 'Food watercolor, Jar drawing, Step by step watercolor', 'Круглый год', 'Tiny white dots = glossy eggs'],
  ['a mushroom house', 'mushroom_house', 'a red toadstool cottage in the rain', 'Mushroom house drawing, Fairytale art, Step by step watercolor', 'Осень', 'Spots last, with thick white gouache'],
  ['toast with jam', 'pbj', 'toast with peanut butter and jam on a teal plate', 'Toast painting, Food art, Step by step painting', 'Круглый год', 'Wet-in-wet for the jam'],
  ['a cereal splash', 'cereal', 'a bowl of cereal with a milk splash', 'Cereal painting, Pop art food, Step by step painting', 'Круглый год', 'The splash is just negative space'],
  ['an old country house', 'old_house', 'an old wooden house in a field', 'House painting, Landscape watercolor, Step by step painting', 'Осень', 'Dry brush for the weathered boards'],
  ['a winter field', 'winter_field', 'a snowy field with bare trees', 'Winter landscape, Snow painting, Easy watercolor steps', 'Зима', 'Snow is the paper you didn’t paint'],
  ['a cup of holiday coffee', 'caffeine_cup', 'a takeaway coffee cup with cream and a cinnamon stick', 'Coffee cup drawing, Holiday drinks, Step by step watercolor', 'Зима', 'Soft grey shadows make the cream'],
  ['a bee rider', 'bee_rider', 'a little bee riding a beetle', 'Cute bug art, Whimsical drawing, Step by step watercolor', 'Лето', 'Tiny details last: wings and eyes'],
  ['a pumpkin portrait', 'halloween-in-blue', 'a pumpkin-headed portrait in a blue oval frame', 'Pumpkin drawing, Halloween art, Step by step watercolor', 'Осень', 'Frame last, it pulls it together'],
  ['a pumpkin lady', 'halloween-lady', 'a pumpkin-headed lady in a teal frame', 'Halloween portrait, Pumpkin art, Step by step painting', 'Осень', 'Orange next to teal glows'],
  ['a sardine tin', 'sardines', 'an open pink sardine tin', 'Food packaging art, Sardine painting, Step by step watercolor', 'Круглый год', 'Metal = sharp light next to dark'],
  ['persimmons', 'sketchbook-17', 'persimmons on a turquoise sketchbook page', 'Persimmon painting, Fruit watercolor, Sketchbook steps', 'Осень', 'Complementary background makes fruit glow'],
  ['an old-town skyline', 'sketchbook-7', 'an old-town skyline with a church spire', 'Urban sketching, City watercolor, Step by step painting', 'Круглый год', 'Ink the spire, leave the sky loose'],
  ['a brick house', 'sketchbook-8', 'a red brick house in a sketchbook', 'Urban sketch, Brick house drawing, Step by step watercolor', 'Осень', 'Suggest bricks, don’t draw every one'],
  ['a pumpkin with a hat', 'halloween-poirot', 'a pumpkin with a bowler hat and moustache', 'Pumpkin drawing, Funny Halloween art, Step by step watercolor', 'Осень', 'Moustache in one confident stroke'],
  ['a fairy-light cat', 'cat_lights', 'a cat under fairy lights on black paper', 'Cat drawing, Fairy lights, Step by step painting', 'Зима', 'Glow = light color with no outline'],
  ['a retro TV corner', 'retro_tv', 'a retro TV room in watercolor', 'Retro room drawing, Interior sketch, Step by step watercolor', 'Круглый год', 'Darkest dark under the furniture'],
  ['a flower bouquet', 'impasto_flowers', 'a thick-paint bouquet of pink flowers', 'Flower painting, Impasto, Step by step painting', 'Весна', 'Thick paint for the petals last'],
  ['a snail on a ride', 'snail_adam', 'a snail and a pigeon in a dreamy scene', 'Snail drawing, Whimsical art, Step by step painting', 'Весна', 'Soft edges for the dream'],
  ['a pigeon in Finland', 'finland', 'a pigeon with beer in a Finland poster', 'Pigeon drawing, Poster art, Step by step drawing', 'Круглый год', 'Flat colors, bold outline'],
  ['a pigeon doing yoga', 'yoga', 'a pigeon stretching on a yoga mat by the sea', 'Pigeon art, Funny drawing, Step by step painting', 'Круглый год', 'Keep the sea one calm wash'],
  ['a plague doctor', 'plague', 'an ink plague doctor with a lantern', 'Ink drawing, Gothic art, Step by step drawing', 'Осень', 'Black ink first, a splash of red last'],
  ['a snail with a coffee', '2023-mr-chew-take-away-coffee', 'a snail with a takeaway coffee', 'Snail drawing, Coffee art, Step by step watercolor', 'Круглый год', 'Shell spiral starts from the center'],
];

// ——— 4) новые форматы ———
// palch: палитра (из PA/палитр сайта по детали) + «нарисуй только этими цветами»
const PCH = [
  ['cupcake', [.2, 0, .6, .5], 'Cherry pop', ['a strawberry', 'a red umbrella', 'a teapot', 'lipstick', 'a fox']],
  ['winter_field', [0, 0, 1, 1], 'Quiet snow', ['a birch tree', 'a sleeping cat', 'a mug', 'a snowy roof', 'a crow']],
  ['2024-mr-chew-dnd-edition', [0, .05, .55, .8], 'Potion night', ['a frog', 'a lantern', 'a spell book', 'a mushroom', 'a dragon']],
  ['bookshop', [.1, .1, .8, .8], 'Bookshop glow', ['a stack of books', 'a street lamp', 'a cat', 'a coat', 'a teacup']],
  ['sketchbook-17', [.1, .1, .8, .8], 'Persimmon & teal', ['an orange', 'a goldfish', 'a sea', 'a koi', 'a vase']],
  ['2025-pigeon-polly-celebrates-new-year', [.3, .3, .7, .7], 'Holiday dinner', ['a wreath', 'a candle', 'a gift', 'a robin', 'a pine cone']],
];
// bingo: 5×5, в центре «draw Polly»
const BG = [
  ['Winter sketchbook <em>bingo</em>', 'night', '2023-pigeon-polly-celebrates-new-year', ['a mitten', 'a candle', 'a snowman', 'your mug', 'a pine cone', 'a sled', 'icicles', 'a scarf', 'a robin', 'a lamp', 'cocoa', 'a gift', 'a cookie', 'a star', 'a window', 'snow boots', 'a tree', 'a bauble', 'a cat', 'a blanket', 'a book', 'a sock', 'a fire', 'a moon']],
  ['Cozy home drawing <em>bingo</em>', 'paper', '2026-pigeon-polly-keeps-busy-living', ['a teapot', 'a plant', 'slippers', 'a chair', 'a lamp', 'a clock', 'a rug', 'a cup', 'a spoon', 'a pillow', 'a cat', 'a book', 'a vase', 'a candle', 'a key', 'a towel', 'a radio', 'a mirror', 'glasses', 'a jar', 'a window', 'a hat', 'a fruit', 'a photo']],
  ['Urban sketching <em>bingo</em>', 'clay', 'sketchbook-20', ['a door', 'a lamp post', 'a bike', 'a pigeon', 'a tram', 'a sign', 'a roof', 'a bench', 'a tree', 'a window', 'a car', 'a café', 'a dog', 'a bin', 'a fence', 'a person', 'a tower', 'a bridge', 'a balcony', 'a shop', 'a flower box', 'a bus stop', 'a chimney', 'a clock']],
  ['Food doodle <em>bingo</em>', 'blush', 'breakfast_us', ['a donut', 'a lemon', 'an egg', 'a toast', 'a cherry', 'a pear', 'a cheese', 'a sushi', 'a taco', 'a waffle', 'a cookie', 'a pizza', 'a bun', 'a fig', 'a tomato', 'a noodle', 'a pie', 'a carrot', 'a banana', 'a jam jar', 'a coffee', 'a croissant', 'a peach', 'a muffin']],
  ['Spooky-cute <em>bingo</em>', 'dark', 'halloween-cup', ['a ghost', 'a bat', 'a pumpkin', 'a candle', 'a cat', 'a spider', 'a potion', 'a moon', 'a skull', 'a broom', 'a hat', 'a crow', 'a key', 'a web', 'a candy', 'a mask', 'an owl', 'a cauldron', 'a book', 'a lantern', 'a bone', 'a toad', 'a coffin', 'a star']],
  ['Garden sketch <em>bingo</em>', 'sage', '2024-mr-chew-gardening-edition', ['a snail', 'a bee', 'a pot', 'a tulip', 'a rake', 'a worm', 'a bird', 'a carrot', 'a gnome', 'a leaf', 'a seed', 'a boot', 'a fence', 'a frog', 'a can', 'a daisy', 'a bench', 'a shed', 'a ladybug', 'a pear', 'a hose', 'a mushroom', 'a basket', 'a hat']],
];
// ispy: 5 деталей (центр [x,y] в долях, размер доли)
const ISPY = [
  ['2026-pigeon-polly-keeps-busy-living', [[.18, .35], [.5, .2], [.75, .6], [.35, .75], [.88, .25]]],
  ['2025-pigeon-polly-celebrates-new-year', [[.15, .25], [.5, .55], [.82, .3], [.65, .8], [.3, .7]]],
  ['2024-pigeon-polly-bath-relax', [[.2, .3], [.5, .15], [.8, .45], [.4, .7], [.7, .85]]],
  ['2024-mr-chew-gardening-edition', [[.15, .3], [.4, .2], [.75, .3], [.3, .75], [.85, .75]]],
  ['2025-mr-chew-travel-edition-can-you-find-polly', [[.2, .25], [.55, .15], [.8, .5], [.4, .65], [.65, .85]]],
  ['2019-pigeon-polly-writing-diploma', [[.15, .3], [.45, .2], [.8, .25], [.3, .8], [.7, .7]]],
];
// diff: найди 5 отличий (отличия делает pins16_prep.py, места — случайно с сидом)
const DF = ['2022-pigeon-polly-started-own-small-business', '2026-pigeon-polly-keeps-busy-living', '2024-pigeon-polly-bath-relax', '2025-pigeon-polly-celebrates-new-year', '2024-mr-chew-gardening-edition', '2023-mr-chew-coffee-passion'];
// dtiys: контур персонажа + оригинал
const DT = [
  ['Pigeon Polly at the beach', '2022-pigeon-polly-summer-lover', 'myth_beach'],
  ['Pigeon Polly reading', 'myth_read', null],
  ['Pigeon Polly in Finland', 'finland', null],
  ['Pigeon Polly doing yoga', 'yoga', null],
  ['Mr. Chew the snail', '2023-mr-chew-coffee-passion', null],
  ['Pigeon Polly, graphic designer', '2022-pigeon-polly-graphic-designer', null],
];

const out = [];
let n = 945;
const cap = s => s.replace(/<\/?em>/g, '');
for (const [t, kick, art, pos, th, season, topics, ...items] of PR) {
  const tt = cap(t);
  out.push({ n, tpl: 'prompts', th, t, kick, art: A(art), pos, items, season,
    title: `${tt.replace(/^\w/, c => c.toUpperCase())} — ${items.length}-Day Drawing Challenge`,
    desc: `${items.length} small, cozy things to draw — one a day. The first week is here (${items.slice(0, 4).join(', ')}…); the full printable list of all ${items.length} prompts is free on pigeonpolly.com. Save it, grab any sketchbook and draw ten minutes a day.`,
    alt: `A ${items.length}-day drawing prompt list “${tt}” in a grid of numbered cards under an illustration by Pigeon Polly.`,
    link: L('/challenge/', n), topics: topics + ', Drawing challenge, Sketchbook prompts' });
  n++;
}
for (const [t, art, crop, mood, topics, season] of PA) {
  out.push({ n, tpl: 'pal', th: 'dark', t, art: A(art), crop, season, mood,
    title: `${cap(t)} Color Palette with HEX Codes | Pigeon Polly`,
    desc: `${mood} Six colors from a detail of my painting. Tap through for the HEX codes (one click to copy) and five things to paint with this palette.`,
    alt: `A color palette “${cap(t)}”: six named color swatches under a detail of a painting by Pigeon Polly.`,
    link: L('/palettes/', n), topics: topics + ', HEX codes, Color palette from painting' });
  n++;
}
for (const [what, art, alt, topics, season, tip] of ST) {
  out.push({ n, tpl: 'steps', th: 'paper', what, art: A(art), name: art.replace(/[^a-z0-9]+/gi, '_').slice(0, 40), tip, season,
    title: `How to Paint ${what.replace(/(^|\s)[a-z]/g, s => s.toUpperCase())} in 4 Steps — Watercolor & Ink`,
    desc: `My painting of ${alt}, broken into 4 steps: light pencil shapes, ink lines, a first pale wash… and the last step — darks, details and my tips — is on pigeonpolly.com.`,
    alt: `Steps of painting ${alt}: pencil sketch, ink outline and first pale wash, the finished painting by Pigeon Polly hidden until you visit the site.`,
    link: L('/learn/', n), topics: topics + ', Watercolor for beginners, Painting tutorial' });
  n++;
}
for (const [art, crop, name, items] of PCH) {
  out.push({ n, tpl: 'palch', th: 'cream', t: `${name}: <em>palette challenge</em>`, art: A(art), crop, items, season: 'Круглый год',
    title: `Palette Challenge: Paint 5 Things with Only These 6 Colors (${name})`,
    desc: `A color challenge: take this six-color palette from my painting and paint five things with it — the first is ${items[0]}. No other colors allowed. The full list and HEX codes are on pigeonpolly.com.`,
    alt: `A palette challenge pin: six color swatches from a painting by Pigeon Polly and the start of a list of things to paint with them.`,
    link: L('/palettes/', n), topics: 'Color palette challenge, Limited palette, Watercolor practice, Art challenge, HEX codes' });
  n++;
}
for (const [t, th, art, items] of BG) {
  out.push({ n, tpl: 'bingo', th, t, art: A(art), items, season: /Winter/.test(t) ? 'Зима' : /Spooky/.test(t) ? 'Осень' : 'Круглый год',
    title: `${cap(t)}: 24 Things to Draw (Printable Sketchbook Game)`,
    desc: `Drawing bingo: cross off a square every time you draw it — ${items.slice(0, 3).join(', ')}… Get a full line, then go for the whole card. The full printable card is free on pigeonpolly.com.`,
    alt: `A partly hidden 5×5 drawing bingo card “${cap(t)}” with small drawing prompts and a free center square, illustration by Pigeon Polly.`,
    link: L('/challenge/', n), topics: 'Drawing bingo, Sketchbook game, Drawing prompts, Art challenge, Fun drawing ideas' });
  n++;
}
for (const [art, pts] of ISPY) {
  out.push({ n, tpl: 'ispy', th: 'cream', art: A(art), pts, name: art.slice(0, 40), season: 'Круглый год',
    title: 'Can You Find These 5 Details? Look Closer at This Illustration',
    desc: 'A look-closer puzzle: find all five little details in my illustration. Stuck? The answers (and the full picture) are on pigeonpolly.com.',
    alt: 'A busy cozy illustration by Pigeon Polly with five round close-ups of details to find.',
    link: L('/art-portfolio/', n), topics: 'Seek and find, Look and find puzzle, Cozy illustration, Detailed art, Fun puzzles' });
  n++;
}
for (const art of DF) {
  out.push({ n, tpl: 'diff', th: 'cream', art: A(art), name: art.slice(0, 40), season: 'Круглый год',
    title: 'Spot the 5 Differences — Cozy Illustration Puzzle',
    desc: 'Two copies of my illustration, five sneaky differences. Can you find them all? Check your answers on pigeonpolly.com.',
    alt: 'Two copies of an illustration by Pigeon Polly, one above the other, with five differences to find.',
    link: L('/games/', n), topics: 'Spot the difference, Picture puzzle, Brain teaser, Cozy illustration, Fun puzzles' });
  n++;
}
for (const [who, art, extra] of DT) {
  out.push({ n, tpl: 'dtiys', th: 'paper', who, art: A(art), name: art.slice(0, 40), extra: extra && A(extra), season: 'Круглый год',
    title: `Draw This in Your Style: ${who} (Line Art to Redraw)`,
    desc: `A draw-this-in-your-style challenge: redraw ${who} your way — change the style, the colors, the season. The printable line art is free on pigeonpolly.com.`,
    alt: `Line art of ${who} next to the original colored illustration by Pigeon Polly, with a “draw this in your style” challenge.`,
    link: L('/', n), topics: 'Draw this in your style, DTIYS challenge, Character art, Drawing challenge, Line art' });
  n++;
}
module.exports = out;
