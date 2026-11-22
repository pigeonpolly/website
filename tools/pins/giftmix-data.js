// Данные пинов №1611–1670 для tools/pins/giftmix.js. Факты об открытках — только с сайта (docs/postcards.md):
// бесплатно, нужно войти с ником, 20 живых открыток, своё послание и надпись, письмо на почту, можно анонимно («тайный друг»),
// получатель нажимает на конверт, может ответить открыткой. Смешивание — /color-mixing/ (docs/palettes.md): 3 материала, 16 пигментов,
// рецепты в горошинах/кистях, пипетка по фото, «Пигменты: свойства и истории». Рецепты считает mixing.js — числа на пине = на сайте.
const TH = {
  cream: { bg: '#FBF3E6', fg: '#2E2320', acc: '#B3262E', mut: '#7A6A5E', card: '#FFFBF4', logo: 'color-autumn' },
  night: { bg: '#16213A', fg: '#F4EEDF', acc: '#F2C14E', mut: '#B3B9CC', card: '#243256', logo: 'white-only', btn: '#F2C14E', btnFg: '#16213A', env1: '#E9D5B5', env2: '#D8BE94' },
  pink: { bg: '#FBEAEE', fg: '#3A1F27', acc: '#C2335A', mut: '#8A5E68', card: '#FFF5F7', logo: 'color-purple', env1: '#F6D3DC', env2: '#EDB9C6' },
  kraft: { bg: '#E8D8BE', fg: '#33261C', acc: '#8A3B1E', mut: '#6E5B48', card: '#F4EAD8', logo: 'brown-only', env1: '#F7F0E2', env2: '#EADFCB' },
  sky: { bg: '#E6F0F5', fg: '#1F3442', acc: '#1F6F8B', mut: '#5D7482', card: '#F6FAFC', logo: 'blue-only' },
  sun: { bg: '#FFF2D2', fg: '#2E2418', acc: '#C26A0A', mut: '#7A6750', card: '#FFFAEC', logo: 'color-summer' },
  paper: { bg: '#F7F3EA', fg: '#2A2420', acc: '#3B5BA9', mut: '#6F665C', card: '#ECE5D6', logo: 'color-spring' },
  studio: { bg: '#1E1B19', fg: '#F2EBDD', acc: '#E9A23B', mut: '#B5AA98', card: '#35302B', logo: 'white-only', btn: '#E9A23B', btnFg: '#1E1B19' },
  sage: { bg: '#E9EEE4', fg: '#24302A', acc: '#4E7A4A', mut: '#5F6B62', card: '#F8FAF4', logo: 'color-summer' },
  rose: { bg: '#F6ECEA', fg: '#33221F', acc: '#A23B4E', mut: '#7E6460', card: '#FFF8F6', logo: 'color-purple' },
};
const W = 'Зима', Y = 'Круглый год';
const GT = 'Free ecards, Animated greeting cards, Send a card online, Thoughtful gift ideas';

// ——— 1611–1640: «Отправить подарок» ———
const gifts = [
  { type: 'pc', id: 'ny-tree', th: 'night', h: 'Send a <em>New Year card</em> that actually moves', cap: 'the lights on the tree really twinkle', season: W,
    title: 'Animated New Year Card with a Pigeon, a Cat and a Horse — Send It Free by Email',
    desc: 'A New Year postcard with my painting of Polly the pigeon, Milka the cat and the horse of the year — and the lights on the tree really twinkle. Pick it on pigeonpolly.com, write a few warm words and send it to anyone by email. Free, you just sign in.',
    alt: 'Animated New Year postcard: a painting by Pigeon Polly of a pigeon, a cat and a horse celebrating at home by a glowing tree.' },
  { type: 'pc', id: 'chew-xmas', th: 'cream', h: 'A <em>snail</em> is bringing your gifts', cap: 'jo-ho-ho! gifts are on the way', season: W, kick: 'christmas postcard · free',
    title: 'Funny Christmas Card: a Snail Santa With a Sack of Gifts — Free Animated Ecard',
    desc: 'Mr. Chew the snail dressed as Santa, dragging a sack of gifts very, very slowly — with falling snow. It is one of the animated postcards on pigeonpolly.com: write your message, add their email, send. Free, you just sign in.',
    alt: 'Animated Christmas postcard: watercolor illustration by Pigeon Polly of a snail in a Santa hat pulling a red sack of gifts, snow falling.' },
  { type: 'pc', id: 'cozy-santa', th: 'pink', h: 'For the friend who <em>hibernates</em> in December', cap: 'warm and cozy holidays', season: W, kick: 'cozy holiday postcard',
    title: 'Cozy Holiday Card for an Introvert Friend — Pigeon in Bed, Animated and Free',
    desc: 'Some people celebrate in a crowd, some in bed with a plate of something good. This animated postcard is for the second kind: my painting of Polly in a Santa hat, wrapped in blankets. Send it free by email from pigeonpolly.com, with your own words.',
    alt: 'Animated holiday postcard: painting by Pigeon Polly of a pigeon in a Santa hat under a blanket in bed with snacks, snow falling.' },
  { type: 'pc', id: 'ny-kitchen', th: 'kraft', h: 'May the new year be <em>delicious</em>', cap: 'a postcard for the one who feeds everyone', season: W, kick: 'new year postcard',
    title: 'New Year Card for the Family Cook — Animated Kitchen Painting, Free Ecard',
    desc: 'For the person who is already chopping salads on December 31st: a New Year postcard with my painting of a pigeon in a very busy kitchen, with a little sparkle. Free on pigeonpolly.com — choose it, change the words if you like, send by email.',
    alt: 'Animated New Year postcard: painting by Pigeon Polly of a pigeon cooking in a cozy cluttered kitchen at night.' },
  { type: 'pc', id: 'bday-candy', th: 'pink', h: 'A birthday card with a <em>unicorn snail</em>', cap: 'confetti included, no glitter to vacuum', season: Y, kick: 'birthday postcard · free',
    title: 'Funny Animated Birthday Card: a Rainbow Unicorn Snail — Send It Free',
    desc: 'Mr. Chew in his rainbow candy edition — a unicorn snail with star-studded shell — with confetti falling over him. A free animated birthday postcard on pigeonpolly.com: add your wish, their name and email, and it goes straight to their inbox.',
    alt: 'Animated birthday postcard: colourful illustration by Pigeon Polly of a rainbow unicorn snail with stars on its shell and confetti.' },
  { type: 'pc', id: 'love-chew', th: 'rose', h: 'I <em>snail</em> you', cap: 'you are so loved', season: W, kick: 'love postcard',
    title: '“I Snail You” Valentine Card — Cute Animated Ecard With Two Snails, Free',
    desc: 'Two snails, one heart, “I snail you” written in the sky — and hearts floating up. A free animated love postcard from pigeonpolly.com for Valentine’s Day or any ordinary Tuesday. Write your message and send it by email.',
    alt: 'Animated Valentine postcard: watercolor illustration by Pigeon Polly of two snails cuddling with hearts and the words “I snail you”.' },
  { type: 'pc', id: 'thanks', th: 'sky', h: 'A <em>thank-you</em> delivered by balloons', cap: 'for teachers, neighbours, the friend who helped you move', season: Y, kick: 'thank-you postcard',
    title: 'Animated Thank You Card: a Snail Delivered by Balloons — Free Ecard to Send',
    desc: 'Mr. Chew floating to his delivery under a bunch of balloons. Use this free animated postcard from pigeonpolly.com to say thank you — to a teacher, a colleague, a neighbour, the friend who helped you move. A few words, an email address, done.',
    alt: 'Animated thank-you postcard: painting by Pigeon Polly of a snail carried through a blue sky by purple balloons.' },
  { type: 'pc', id: 'sunshine', th: 'sun', h: 'Sending you some <em>sunshine</em>', cap: 'for the friend who is having a grey week', season: Y, kick: 'just because',
    title: '“Sending You Sunshine” Card for a Friend Having a Hard Week — Free Animated Ecard',
    desc: 'Polly on the beach with a book and a sun hat, and real sun rays turning on the card. For the friend who is having a grey week — no occasion needed. Send it free from pigeonpolly.com with your own message.',
    alt: 'Animated postcard: painting by Pigeon Polly of a pigeon reading on a sun lounger at the beach under a big hat, sun rays moving.' },
  { type: 'pc', id: 'coffee', th: 'kraft', h: 'A cup of <em>coziness</em> for you', cap: 'for your coffee-and-trains person', season: 'Осень', kick: 'cozy postcard',
    title: 'Cozy Autumn Card for a Coffee Lover — Night Train Painting, Free Animated Ecard',
    desc: 'My painting of Polly on a night train in October, with a coffee and a donut, and leaves drifting across the card. A free animated postcard on pigeonpolly.com for your coffee-and-trains person. Write a note, add an email, send.',
    alt: 'Animated autumn postcard: painting by Pigeon Polly of a pigeon in a puffer jacket drinking coffee on a night train, leaves falling.' },
  { type: 'pc', id: 'bath', th: 'sky', h: 'Permission to <em>rest</em>, in postcard form', cap: 'time to rest and bubble', season: Y, kick: 'self-care postcard',
    title: 'Self-Care Card for an Overworked Friend — Pigeon in a Bubble Bath, Free Ecard',
    desc: 'Polly in a bubble bath, and the bubbles actually rise. Send this free animated postcard from pigeonpolly.com to the friend who forgot what a day off is. Your message goes inside.',
    alt: 'Animated postcard: painting by Pigeon Polly of a pigeon relaxing in a blue-tiled bathroom in a bath full of bubbles.' },
  { type: 'pc', id: 'polly-sack', th: 'night', h: 'Ho-ho-<em>coo!</em> A gift from Polly', cap: 'a tiny pixel Polly with a sack of presents', season: W, kick: 'pixel postcard',
    title: 'Pixel Art Christmas Card: a Pigeon With a Sack of Gifts in the Snow — Free',
    desc: 'A little pixel Polly in a Santa hat with a sack of presents, a cabin, and snow falling. One of the free animated postcards on pigeonpolly.com — sweet for a gamer friend. Write your wish and send it by email.',
    alt: 'Animated pixel art Christmas postcard: a small purple pigeon in a Santa hat next to a sack of gifts outside a snowy cabin at night.' },
  { type: 'pc', id: 'xmas-room', th: 'cream', h: 'A Christmas card in <em>cozy pixels</em>', cap: 'fireplace, tree, presents and a pigeon', season: W, kick: 'pixel postcard',
    title: 'Cozy Pixel Art Christmas Card: Fireplace, Tree and a Pigeon — Free Animated Ecard',
    desc: 'A pixel living room: fireplace, a decorated tree, presents and Polly in a Santa hat, with sparkles. Send it free from pigeonpolly.com — choose the postcard, change the words if you like, add a message.',
    alt: 'Animated pixel art postcard: a cozy red room with a fireplace, a Christmas tree, presents and a small pigeon in a Santa hat.' },
  { type: 'pc', id: 'fireworks', th: 'night', h: 'Fireworks you can send <em>by email</em>', cap: 'happy new year!', season: W, kick: 'new year postcard',
    title: 'Animated New Year Fireworks Card — Pixel City at Midnight, Free to Send',
    desc: 'A pixel city at midnight, a clock tower, and fireworks going off over the roofs — with Polly on top. A free animated New Year postcard from pigeonpolly.com. Send it to everyone you can’t hug on the 31st.',
    alt: 'Animated pixel art New Year postcard: fireworks over a night city with a clock tower and a small pigeon on a roof.' },
  { type: 'grid', ids: ['ny-tree', 'chew-xmas', 'cozy-santa', 'ny-kitchen', 'polly-sack', 'xmas-room'], th: 'night', h: '6 <em>winter</em> postcards you can send tonight', season: W,
    title: '6 Animated Christmas and New Year Cards You Can Send Free Tonight',
    desc: 'Twinkling tree lights, a snail Santa, a pigeon in bed with snacks, a busy kitchen, pixel snow — six animated winter postcards with my art on pigeonpolly.com. Pick one, write your message and send it to their email. Free, you just sign in.',
    alt: 'Six animated winter postcards by Pigeon Polly arranged on a dark blue background: paintings and pixel scenes of Christmas and New Year.' },
  { type: 'grid', ids: ['sunshine', 'coffee', 'bath', 'thanks', 'busy', 'love-chew'], th: 'cream', h: 'Postcards for <em>no reason at all</em>', season: Y,
    title: 'Just Because Cards: 6 Animated Ecards to Send a Friend for No Reason',
    desc: 'The best postcards arrive for no reason. Sunshine, a cup of coziness, a bubble bath, a thank-you, “you are doing great”, a little love — six animated postcards with my paintings, free to send from pigeonpolly.com.',
    alt: 'Six animated “just because” postcards with paintings by Pigeon Polly: a beach, a night train, a bubble bath, balloons, a pigeon at home and snails in love.' },
  { type: 'grid', ids: ['bday-candy', 'bday-cake', 'love-polly', 'march8', 'easter', 'ligo', 'halloween', 'fireworks', 'thanks'], th: 'pink', h: 'A <em>postcard</em> for every day of the year', season: Y, top: 360,
    title: 'Free Animated Ecards for Every Occasion: Birthday, Love, Easter, Halloween and More',
    desc: 'Birthday, Valentine’s Day, 8 March, Easter, Midsummer, Halloween, New Year, a simple thank-you: the animated postcards on pigeonpolly.com cover the whole year. Free to send by email — choose, write, send.',
    alt: 'Nine animated postcards by Pigeon Polly for birthday, love, women’s day, Easter, Midsummer, Halloween, New Year and thanks.' },
  { type: 'steps', th: 'cream', h: 'Send a gift in <em>one minute</em>', season: Y,
    steps: [{ id: 'cozy-santa', h: 'Pick a postcard', p: 'Twenty animated cards: paintings and pixel scenes.' }, { id: 'bday-candy', h: 'Write a few words', p: 'Your message — and even the words on the card.' }, { h: 'Send it by email', p: 'Their name, their email. Or stay a secret friend.' }],
    title: 'How to Send an Animated Postcard by Email in One Minute — Free, 3 Steps',
    desc: 'Step 1: pick one of twenty animated postcards with my paintings or pixel scenes. Step 2: write your message — you can even change the words on the card. Step 3: add their name and email and send. Free on pigeonpolly.com, you just sign in.',
    alt: 'Three steps with illustrations by Pigeon Polly: pick a postcard, write a few words, send it by email in an envelope.' },
  { type: 'steps', th: 'kraft', h: 'What they get <em>in their inbox</em>', season: Y, kick: 'the receiving end',
    steps: [{ h: 'A letter with your postcard', p: 'The animated card right in the email.' }, { id: 'ny-tree', h: 'They tap the envelope', p: 'And the postcard opens with your words.' }, { id: 'thanks', h: 'They can send one back', p: 'A postcard in reply is one click away.' }],
    title: 'What Happens When You Send an Animated Postcard: Inbox, Envelope, Reply',
    desc: 'They get a letter with your animated postcard inside. They tap the envelope on the site and it opens with your message. And if they like it, they can send a postcard back. All free on pigeonpolly.com.',
    alt: 'Three steps illustrated with postcards by Pigeon Polly: an envelope, an opened New Year card, a thank-you card sent in reply.' },
  { type: 'list', id: 'thanks', th: 'cream', kick: 'who to surprise', h: '12 people who deserve a <em>postcard</em> this week', season: Y,
    items: ['your old teacher', 'the neighbour who waters your plants', 'a friend who moved away', 'your grandma (she will show everyone)', 'a colleague who covered for you', 'your therapist’s favourite patient (you)', 'the friend who always texts first', 'your sibling, just because', 'someone who just started a new job', 'a friend after a breakup', 'the person you forgot to thank', 'someone you haven’t spoken to in a year'],
    title: '12 People Who Deserve a Postcard This Week — and a Free Animated One to Send',
    desc: 'Your old teacher, the neighbour who waters your plants, a friend who moved away, your sibling just because… Twelve people who would love a postcard this week. Send them an animated one with my art from pigeonpolly.com — free, by email.',
    alt: 'A list of 12 people to send a postcard to, next to an animated thank-you postcard by Pigeon Polly with a snail and balloons.' },
  { type: 'list', id: 'sunshine', th: 'sun', kick: 'what to write', h: '15 short messages for a <em>just-because</em> card', season: Y,
    items: ['Saw this and thought of you.', 'No reason. Just you.', 'Proud of you, quietly and loudly.', 'You make Mondays lighter.', 'Coffee soon? I miss you.', 'This pigeon is me waving at you.', 'You are doing better than you think.', 'Thank you for being you.', 'Rest is productive too.', 'Here is a little sunshine.', 'I still laugh about that day.', 'Sending a hug in postcard form.', 'You are my favourite notification.', 'Tea is on me next time.', 'Nothing to say. Just hello.'],
    title: '15 Short Messages for a Just-Because Card — What to Write to a Friend',
    desc: 'Don’t know what to write? “Saw this and thought of you.” “You are doing better than you think.” “Sending a hug in postcard form.” Fifteen short messages for a card with no occasion — and a free animated postcard to put them in on pigeonpolly.com.',
    alt: 'A list of 15 short card messages next to an animated postcard by Pigeon Polly of a pigeon reading on the beach.' },
  { type: 'list', id: 'cozy-santa', th: 'pink', kick: 'holiday card ideas', h: 'What to write in a <em>holiday card</em>: 14 warm lines', season: W,
    items: ['Warm and cozy holidays to you.', 'May your tea stay hot and your socks dry.', 'Wishing you a slow, soft December.', 'Thank you for this year.', 'Here’s to more tiny joys in 2027.', 'May the new year be delicious.', 'Rest a lot. Eat the last cookie.', 'You made my year kinder.', 'See you on the other side of the fireworks.', 'Hugs, from far away.', 'Happy everything!', 'Snow outside, love inside.', 'Light a candle for good things.', 'Let’s plan that trip next year.'],
    title: 'What to Write in a Holiday Card: 14 Warm, Short Christmas and New Year Messages',
    desc: '“May your tea stay hot and your socks dry.” “Rest a lot. Eat the last cookie.” “You made my year kinder.” Fourteen warm lines for Christmas and New Year cards — and free animated postcards with my art to send them in on pigeonpolly.com.',
    alt: 'A list of 14 short holiday card messages next to an animated postcard by Pigeon Polly of a pigeon in a Santa hat in bed.' },
  { type: 'list', id: 'love-chew', th: 'rose', kick: 'gifts that cost nothing', h: '10 last-minute gifts that cost <em>nothing</em>', season: Y, bullets: false,
    items: ['an animated postcard with a real message', 'a voice note with a memory', 'a playlist named after them', 'a drawing of their pet', 'a promise to cook dinner', 'an old photo, sent with a story', 'a list of 10 things you love about them', 'a walk together, phones away', 'a handwritten recipe', 'your full attention for an hour'],
    title: '10 Last-Minute Gifts That Cost Nothing (Number 1 Takes One Minute)',
    desc: 'An animated postcard with a real message, a voice note with a memory, a drawing of their pet, a walk with phones away… Ten thoughtful last-minute gifts that cost nothing. The first one takes a minute on pigeonpolly.com.',
    alt: 'A list of 10 free last-minute gift ideas next to an animated love postcard by Pigeon Polly with two snails and hearts.' },
  { type: 'pov', id: 'bday-cake', th: 'pink', h: 'POV: you remembered their birthday at 23:58', cap: 'an animated card, sent in one minute', season: Y,
    title: 'POV: You Remembered Their Birthday at 23:58 — Free Animated Birthday Card',
    desc: 'POV: you remembered their birthday at 23:58. Don’t panic: an animated birthday postcard with a cake and confetti goes out by email in one minute from pigeonpolly.com. Free, with your own message.',
    alt: 'Meme: “POV: you remembered their birthday at 23:58” over a pixel art birthday postcard by Pigeon Polly with a cake, balloons and confetti.' },
  { type: 'pov', id: 'busy', th: 'kraft', h: 'Them: “How are you?” Me, honestly:', cap: 'just because: you are doing great', season: Y, kick: 'just because',
    title: 'Funny Just Because Card: “You Are Doing Great” — Pigeon Living Its Best Life',
    desc: 'For the friend whose answer to “how are you?” is this painting. Polly multitasking in the bathroom, with the words “Just because: you are doing great”. A free animated postcard on pigeonpolly.com — send it with your own message.',
    alt: 'Meme postcard by Pigeon Polly: a pigeon sitting in a cluttered bathroom reading on its phone, captioned “just because: you are doing great”.' },
  { type: 'pov', id: 'love-polly', th: 'rose', h: 'When you are too shy to say it out loud', cap: 'send it as a secret friend', season: W, kick: 'secret admirer',
    title: 'Send an Anonymous Valentine Card From a “Secret Friend” — Free Animated Ecard',
    desc: 'Too shy to sign it? On pigeonpolly.com you can send an animated postcard anonymously — it arrives “from a secret friend”. This one is a pixel Polly with a heart and a love letter. Free, by email.',
    alt: 'Meme: “When you are too shy to say it out loud” over a pixel postcard by Pigeon Polly of a pigeon holding a heart next to an envelope.' },
  { type: 'pov', id: 'halloween', th: 'night', h: 'Sending a Halloween card instead of candy', cap: 'zero calories, 100% spooky', season: 'Осень', kick: 'halloween postcard',
    title: 'Cute Animated Halloween Card With Pumpkins and a Pigeon Witch — Free Ecard',
    desc: 'A pixel Polly in a witch hat, a full moon and glowing pumpkins. Zero calories, 100% spooky: send this free animated Halloween postcard from pigeonpolly.com instead of candy.',
    alt: 'Meme: “Sending a Halloween card instead of candy” over a pixel postcard by Pigeon Polly of a pigeon in a witch hat with pumpkins under a full moon.' },
  { type: 'envelope', id: 'ny-tree', th: 'night', h: 'They tap the <em>envelope</em>…', cap: '…and your postcard opens', season: W,
    title: 'An Animated Card That Arrives in an Envelope — Tap to Open. Free to Send',
    desc: 'Your postcard arrives in their inbox, and on the site it waits in an envelope: they tap it and the card opens with your message. Free animated postcards with my art on pigeonpolly.com.',
    alt: 'An animated New Year postcard by Pigeon Polly sliding out of a cream envelope with a red wax seal on a dark blue background.' },
  { type: 'envelope', id: 'love-chew', th: 'pink', h: 'Real mail is slow. <em>This</em> isn’t.', cap: 'a postcard in their inbox in a minute', season: Y, kick: 'faster than a snail',
    title: 'Faster Than Snail Mail: Animated Postcards Delivered by Email — Free',
    desc: 'Snail mail, but the snail is only on the picture. Pick an animated postcard on pigeonpolly.com, write your message and it lands in their inbox in a minute. Free, you just sign in.',
    alt: 'A love postcard by Pigeon Polly with two snails and hearts sliding out of a pink envelope with a red wax seal.' },
  { type: 'art', key: '2023-mr-chew-australian-postal-snail-introduction', th: 'kraft', kick: 'meet the postman', h: 'Your postcard is delivered by <em>Mr. Chew</em>', cap: 'don’t worry, email is faster than he is', season: Y, ih: 680,
    title: 'Meet the Postal Snail: Funny Illustration + Free Animated Postcards to Send',
    desc: 'Mr. Chew, the postal snail, takes his job very seriously. Luckily the postcards on pigeonpolly.com travel by email: pick an animated card, write a few words, and it arrives in a minute. Free.',
    alt: 'Ink and watercolor illustration by Pigeon Polly of Mr. Chew the snail in round glasses holding a stamp, a letter tied to his shell, next to a sign “Australian postal snail”.' },
  { type: 'art', key: '2023-mr-chew-delivery', th: 'sky', kick: 'special delivery', h: 'Some gifts arrive <em>by balloon</em>', cap: 'yours arrives by email — free', season: Y, ih: 680, pos: '50% 40%',
    title: 'Special Delivery by Balloon: Whimsical Snail Painting and Free Ecards to Send',
    desc: 'My painting of Mr. Chew floating to a delivery under a bunch of purple balloons. This exact picture is also an animated thank-you postcard on pigeonpolly.com — free to send by email, with your words.',
    alt: 'Painting by Pigeon Polly of a snail with a parcel floating through a blue sky on purple balloons.' },
];

// ——— 1641–1670: смешивание цветов и пигменты ———
const MT = 'Color mixing, Color mixing guide, Paint mixing recipes, Color theory for artists';
const mix = [
  { type: 'recipe', key: '2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes', color: 'Donut Glaze Teal', m: 'watercolor', th: 'paper', season: 'Осень', pos: '50% 55%' },
  { type: 'recipe', key: '2026-pigeon-polly-seven-years-later', color: 'Pigeon Grey', m: 'gouache', k: 1, th: 'paper', season: Y, h: 'How to mix <em>pigeon grey</em>', pos: '50% 40%' },
  { type: 'recipe', key: 'sketchbook-17', color: 'Persimmon', m: 'watercolor', th: 'sage', season: 'Осень' },
  { type: 'recipe', key: '2024-pigeon-polly-bath-relax', color: 'Bathroom Tile', m: 'gouache', th: 'sky', season: Y },
  { type: 'recipe', key: '2024-mr-chew-dnd-edition', color: 'Goblin Moss', m: 'acrylic', th: 'studio', season: Y },
  { type: 'recipe', key: 'studio-mushroom_house', color: 'Duck Egg', m: 'gouache', th: 'paper', season: 'Весна' },
  { type: 'recipe', key: '2022-pigeon-polly-celebrates-dia-de-muertos', color: 'Terracotta', m: 'watercolor', th: 'paper', season: 'Осень' },
  { type: 'recipe', key: 'sketchbook-15', color: 'Rainy Forest', m: 'watercolor', th: 'sage', season: 'Осень', h: 'A forest dark <em>without black</em>' },
  { type: 'recipe', key: 'studio-impasto_flowers', color: 'Dusty Rose', m: 'acrylic', th: 'rose', season: 'Весна' },
  { type: 'recipe', key: 'sketchbook-3', color: 'Sky', m: 'watercolor', th: 'sky', season: Y, h: 'How to mix a <em>soft sky blue</em>' },
  { type: 'recipe', key: 'studio-field_acrylic', color: 'Potion Green', m: 'acrylic', th: 'sage', season: 'Лето', h: 'How to mix a <em>juicy grass green</em>' },
  { type: 'recipe', key: '2024-mr-chew-celebrates-valentines-day', color: 'Raspberry', m: 'watercolor', th: 'rose', season: W },
  { type: 'recipe', key: 'halloween-in-blue', color: 'Sea Glass', m: 'gouache', th: 'studio', season: 'Осень' },
  { type: 'recipe', key: '2026-pigeon-polly-fancy-life', color: 'Berry', m: 'watercolor', th: 'paper', season: Y },
  { type: 'pigment', id: 'ultra', key: '2025-mr-chew-travel-edition-can-you-find-polly', th: 'paper', season: Y, h: 'Ultramarine: once <em>pricier than gold</em>' },
  { type: 'pigment', id: 'bsienna', key: 'sketchbook-4', th: 'kraft', season: Y, h: 'Burnt sienna, the <em>best friend</em> of blue' },
  { type: 'pigment', id: 'phthalo', key: 'studio-blocks', th: 'sky', season: Y, h: 'Phthalo blue: one drop <em>takes over</em>' },
  { type: 'pigment', id: 'qrose', key: 'studio-impasto_flowers', th: 'rose', season: 'Весна', h: 'Quinacridone rose, the <em>violet maker</em>' },
  { type: 'pigment', id: 'ochre', key: 'anxiety-4', th: 'sun', season: Y, h: 'Yellow ochre: as old as <em>cave paintings</em>' },
  { type: 'pigment', id: 'pgreen', key: 'sketchbook-16', th: 'sage', season: 'Лето', h: 'Phthalo green is <em>never</em> used alone' },
  { type: 'pigment', id: 'black', key: 'studio-cat_lights', th: 'studio', season: Y, h: 'Why painters <em>avoid black</em>' },
  { type: 'chart', m: 'watercolor', rows: ['lemon', 'hansa', 'ochre'], cols: ['ultra', 'phthalo', 'cerul'], th: 'sage', season: 'Весна', h: '3 yellows × 3 blues = <em>9 greens</em>', cap: 'cool yellow + green-blue = the brightest green' },
  { type: 'chart', m: 'watercolor', rows: ['scarlet', 'qrose', 'qmag'], cols: ['ultra', 'phthalo', 'cerul'], th: 'rose', season: Y, h: 'Why your <em>purple</em> turns brown', cap: 'scarlet + blue = mud, rose + blue = violet' },
  { type: 'chart', m: 'gouache', rows: ['ochre', 'scarlet', 'bsienna', 'qrose'], cols: ['ochre', 'hansa', 'bumber'], th: 'paper', season: Y, h: 'Warm <em>earth mixes</em> in gouache', cap: 'with white 1 : 1 : 1 — skin, wood, autumn' },
  { type: 'ladder', m: 'watercolor', pair: ['ultra', 'bsienna'], key: 'sketchbook-7', th: 'paper', season: Y, h: 'Five <em>greys</em> from two paints', cap: 'more blue — cool grey, more sienna — warm brown' },
  { type: 'ladder', m: 'gouache', pair: ['scarlet', 'phthalo'], key: '2024-halloween-edition', white: 2, th: 'studio', season: 'Осень', h: 'Opposites make <em>soft neutrals</em>', cap: 'orange-red + blue: from rust to slate' },
  { type: 'five', key: 'sketchbook-21', m: 'gouache', th: 'paper', season: Y, h: 'Every colour of this painting, <em>mixed</em>', pos: '50% 50%' },
  { type: 'five', key: '2022-pigeon-polly-summer-lover', m: 'watercolor', th: 'sky', season: 'Лето', h: 'A beach day in <em>watercolor recipes</em>', pos: '50% 45%' },
  { type: 'rule', key: 'sketchbook-19', th: 'paper', season: Y, h: 'Darker, but <em>not with black</em>', top: 400,
    cmp: [{ label: 'red + black: dull and grey', items: [['pyrrol', 3], ['black', 1]] }, { label: 'red + alizarin + umber: deep and alive', items: [['pyrrol', 2], ['aliz', 2], ['bumber', 0.5]] }] },
  { type: 'rule', key: 'studio-plants_tin', th: 'sage', season: Y, h: 'Fewer paints, <em>cleaner</em> colour', top: 400,
    cmp: [{ label: '5 paints: muddy green', items: [['lemon', 1], ['ultra', 1], ['scarlet', 0.5], ['ochre', 1], ['bumber', 0.5]] }, { label: '2 paints: clean green', items: [['lemon', 2], ['phthalo', 0.5]] }] },
];

// ——— тексты пинов ———
function text(p, n, c) {
  if (p.title) return { title: p.title, desc: p.desc, alt: p.alt, topics: p.topics || GT, season: p.season };
  const where = 'Free colour mixing tool on pigeonpolly.com: choose watercolor, gouache or acrylic, pick any colour (even from your own photo) and get recipes from real pigments.';
  if (p.type === 'recipe') {
    const R = p._r, C = p._c, m = p.m, a = c.art(p.key);
    return { season: p.season,
      title: `How to Mix ${C.en} ${C.hex} in ${m[0].toUpperCase() + m.slice(1)} — Real Pigment Recipe`.slice(0, 100),
      desc: `${C.en} (${C.hex}) from my painting “${a}”, mixed in ${m}: ${R.short}. Ready recipe in ${m === 'watercolor' ? 'brushfuls' : 'pea-sized parts'}, with a “you want / you get” comparison. ${where}`,
      alt: `${m[0].toUpperCase() + m.slice(1)} mixing recipe for ${C.en} ${C.hex}: paint swatches with amounts under a painting by Pigeon Polly, “${a}”.`,
      topics: `${MT}, How to mix ${C.en.toLowerCase()}, ${m[0].toUpperCase() + m.slice(1)} mixing` };
  }
  if (p.type === 'pigment') {
    const P = c.M.PIG.find(x => x.id === p.id), f = c.PINFO[p.id];
    return { season: p.season,
      title: `${c.PN[p.id]} (${P.ci}): Properties, History and How to Mix With It`.slice(0, 100),
      desc: `${f.d[0]} On the colour mixing page of pigeonpolly.com you can see all 16 pigments: transparency, strength, staining, granulation, lightfastness and a short story for each.`,
      alt: `A swatch of ${c.PN[p.id]} pigment, from the tube and mixed with white, with its properties, next to a painting by Pigeon Polly.`,
      topics: `${MT}, Art pigments, ${c.PN[p.id]}, Paint pigment guide` };
  }
  if (p.type === 'chart') {
    const names = a => a.map(x => c.PN[x].toLowerCase()).join(', ');
    return { season: p.season,
      title: { 0: '9 Greens From 3 Yellows and 3 Blues — Watercolor Mixing Chart', 1: 'Why Your Purple Turns Brown: Red × Blue Watercolor Mixing Chart', 2: 'Warm Earth Tones Mixing Chart for Gouache: Skin, Wood, Autumn' }[mix.filter(x => x.type === 'chart').indexOf(p)],
      desc: `A ${p.m} mixing chart: ${names(p.rows)} mixed 1 : 1 with ${names(p.cols)}. ${p.cap[0].toUpperCase() + p.cap.slice(1)}. Save it and paint your own chart. ${where}`,
      alt: `${p.m[0].toUpperCase() + p.m.slice(1)} mixing chart grid: ${names(p.rows)} in rows, ${names(p.cols)} in columns, each square showing the mix.`,
      topics: `${MT}, Color mixing chart, ${p.m[0].toUpperCase() + p.m.slice(1)} mixing chart` };
  }
  if (p.type === 'ladder') {
    const [a, b] = p.pair.map(x => c.PN[x].toLowerCase());
    return { season: p.season,
      title: p.pair[0] === 'ultra' ? 'Mix 5 Greys From Ultramarine and Burnt Sienna — Watercolor Grey Ladder' : 'Mix Soft Neutrals From Opposite Colours: Red and Phthalo Blue in Gouache',
      desc: `Two paints, five steps: ${a} and ${b} from 4 : 0 to 0 : 4. ${p.cap[0].toUpperCase() + p.cap.slice(1)}. Opposite colours calm each other down — that is how you get greys, browns and muted colours. ${where}`,
      alt: `Five swatches mixing ${a} and ${b} in different proportions, next to a painting by Pigeon Polly.`,
      topics: `${MT}, How to mix grey, Neutral colors, ${p.m[0].toUpperCase() + p.m.slice(1)} tips` };
  }
  if (p.type === 'five') {
    const a = c.art(p.key);
    return { season: p.season,
      title: `How to Mix Every Colour of “${a}” in ${p.m[0].toUpperCase() + p.m.slice(1)} — 6 Recipes`,
      desc: `Six colours from my painting “${a}”, each with a ${p.m} recipe from real pigments: ${p._cs.map(x => `${x.c.en} — ${x.R.short}`).join('; ')}. The palette with HEX codes is free on pigeonpolly.com, and the colour mixer works for any colour.`,
      alt: `A painting by Pigeon Polly, “${a}”, with six colour swatches and a ${p.m} mixing recipe under each.`,
      topics: `${MT}, Color palette with HEX codes, ${p.m[0].toUpperCase() + p.m.slice(1)} palette` };
  }
  if (p.type === 'rule') {
    return { season: p.season,
      title: p.cmp[0].items.some(i => i[0] === 'black') ? 'How to Darken a Colour Without Black — Painting Tip With Swatches' : 'Why Mixing Too Many Paints Makes Mud — Use 2 or 3 (Painting Tip)',
      desc: `${plain(p.h)}: ${p.cmp[0].label} vs ${p.cmp[1].label}. ${p.cmp[0].items.some(i => i[0] === 'black') ? 'Darken with a dark neighbour or the opposite colour — ultramarine, burnt umber, alizarin — instead of black.' : 'The fewer paints, the cleaner the colour: two or three at most.'} More mixing rules and recipes on pigeonpolly.com.`,
      alt: `Two paint swatches compared — ${p.cmp[0].label} and ${p.cmp[1].label} — under a painting by Pigeon Polly.`,
      topics: `${MT}, Painting tips for beginners, How to avoid muddy colors` };
  }
}
const plain = s => s.replace(/<\/?em>/g, '');

// ——— картинки для Facebook (смешивание): site/images/fb/<file>.jpg ———
const fbImages = [
  ...[
    ['2025-pigeon-polly-romantizing-coffee-and-trains-in-autumn-vibes', 'Donut Glaze Teal', 'watercolor', '50% 55%'], ['2026-pigeon-polly-seven-years-later', 'Pigeon Grey', 'gouache', '50% 40%', 1],
    ['sketchbook-17', 'Persimmon', 'watercolor'], ['2024-pigeon-polly-bath-relax', 'Bathroom Tile', 'gouache'], ['2024-mr-chew-dnd-edition', 'Goblin Moss', 'acrylic'],
    ['studio-mushroom_house', 'Duck Egg', 'gouache'], ['2022-pigeon-polly-celebrates-dia-de-muertos', 'Terracotta', 'watercolor'], ['sketchbook-15', 'Rainy Forest', 'watercolor'],
    ['studio-impasto_flowers', 'Dusty Rose', 'acrylic'], ['studio-field_acrylic', 'Potion Green', 'acrylic'], ['2024-mr-chew-celebrates-valentines-day', 'Raspberry', 'watercolor'],
    ['halloween-in-blue', 'Sea Glass', 'gouache'], ['2026-pigeon-polly-fancy-life', 'Berry', 'watercolor'], ['2024-mr-chew-rainbow-candy-edition', 'Fuchsia', 'gouache'],
    ['studio-fuji', 'Summer Sky', 'watercolor'], ['2023-pigeon-polly-thinking-about-relocation-to-mars', 'Marigold', 'acrylic'],
  ].map(([key, color, m, pos, k], i) => ({ type: 'recipe', file: `mix-r${i + 1}`, key, color, m, k: k || 0, pos: pos || '50% 50%', th: 'paper' })),
  ...[['ultra', '2025-mr-chew-travel-edition-can-you-find-polly'], ['bsienna', 'sketchbook-4'], ['phthalo', 'studio-blocks'], ['qrose', 'studio-impasto_flowers'], ['ochre', 'anxiety-4'], ['pgreen', 'sketchbook-16'], ['black', 'studio-cat_lights'], ['cerul', 'studio-snail_adam']]
    .map(([id, key]) => ({ type: 'pigment', file: `mix-p-${id}`, id, key, pos: '50% 50%', th: 'paper' })),
  { type: 'chart', file: 'mix-c-greens', m: 'watercolor', rows: ['lemon', 'hansa', 'ochre'], cols: ['ultra', 'phthalo', 'cerul'], fbh: '3 yellows × 3 blues', th: 'sage' },
  { type: 'chart', file: 'mix-c-violets', m: 'watercolor', rows: ['scarlet', 'qrose', 'qmag'], cols: ['ultra', 'phthalo', 'cerul'], fbh: 'Reds × blues: where violet hides', th: 'rose' },
  { type: 'five', file: 'mix-f-brushes', key: 'sketchbook-21', m: 'gouache', pos: '50% 50%', th: 'paper' },
  { type: 'five', file: 'mix-f-beach', key: '2022-pigeon-polly-summer-lover', m: 'watercolor', pos: '50% 45%', th: 'sky' },
];

module.exports = { TH, gifts, mix, text, fbImages };
