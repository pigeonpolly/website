# Генерирует макеты shop / lab / wobbleland / admin / journey (не часть сайта)
I = '../../site/images/'
HEAD = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>%s — mockup</title><link rel="stylesheet" href="m.css"><style>%s</style></head><body>'''
HD = '''<header class="hd"><div class="wrap">
  <a class="logo" href="home.html"><img src="img/logo-wc.png" alt=""><span>Pigeon Polly<small>Art Lab · Riga</small></span></a>
  <nav class="nav"><a href="shop.html" %s>Shop</a><a href="#">Learn</a><a href="wobbleland.html" %s>Wobbleland</a><a href="#">Journal</a><a href="#">About</a></nav>
  <div class="hd-r"><span class="lang">EN · LV · RU</span><span>🛒 2</span><a class="door-btn" href="lab.html"><img src="%swobbleland/ch-polly.png" alt=""><span>The Lab</span></a><span class="burger">☰</span></div>
</div></header>'''
FT = '''<footer class="ft"><div class="wrap"><div><h4>One letter a month</h4><p>New prints, a free mini-lesson and what’s cooking in the Lab.</p><input placeholder="Your email"><span class="btn pri">Subscribe</span></div>
<div><h4>Shop</h4><ul><li>Prints</li><li>Originals</li><li>Guides</li><li>Card sets</li></ul></div><div><h4>Explore</h4><ul><li>Wobbleland</li><li>Journal</li><li>Palettes</li><li>The Lab 🚪</li></ul></div>
<div><h4>Alina</h4><ul><li>About</li><li>Work with me</li><li>LinkedIn</li><li>Patreon</li></ul></div><div class="bot"><span>© 2026 Pigeon Polly Art Lab · Riga</span><span>EN · LV · RU</span></div></div></footer></body></html>'''

def hd(on=''):
    return HD % ('class="on"' if on == 'shop' else '', 'class="on"' if on == 'wl' else '', I)

def page(name, title, css, body):
    open(name + '.html', 'w').write(HEAD % (title, css) + body)

# ---------- SHOP ----------
shop_css = '''
.ph{padding:56px 0 30px}.ph h1{font-size:60px}.ph p{color:var(--ink2);font-size:18px;margin-top:10px;max-width:34em}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:26px 0 30px}
.tabs span{border:1.5px solid var(--ink);border-radius:999px;padding:8px 16px;font:500 14px Karla}.tabs span.on{background:var(--ink);color:var(--paper)}
.g{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;padding-bottom:40px}
.perks{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:26px 0;margin:10px 0 40px}
.perks b{font:600 18px Fraunces;display:block}.perks span{font-size:14px;color:var(--ink2)}
.bm{display:flex;align-items:center;gap:18px;background:#2C1F2B;color:#F6E7B4;padding:18px 24px;border-radius:6px;margin-bottom:60px}
.bm img{width:48px;height:48px}.bm b{font:700 17px Fraunces}.bm span{font-size:14px;color:#E6D6C8}.bm .btn{margin-left:auto;background:var(--mustard);color:#2C1F2B;border:0}
.pc .sub{font-size:13px;color:var(--ink2)}
@media(max-width:700px){.ph{padding:28px 0 10px}.ph h1{font-size:40px}.g{grid-template-columns:1fr 1fr;gap:12px}.g .pc h3{font-size:15px}.g .pc .btn{display:none}
.perks{grid-template-columns:1fr;gap:12px}.bm{flex-wrap:wrap}.bm .btn{margin-left:0}.tabs{flex-wrap:nowrap;overflow:auto;margin:16px -16px 20px;padding:0 16px}}
'''
items = [('sketchbook/sketchbook-15-800.jpg', 'Night Garden', 'Giclée print · A4 / A3', '€28', 'Bestseller'),
         ('sketchbook/sketchbook-14-800.jpg', 'Red Wall, Riga', 'Giclée print · A4 / A3', '€28', ''),
         ('sketchbook/sketchbook-21-800.jpg', 'Cup of Brushes', 'Giclée print · A4', '€24', ''),
         ('sketchbook/sketchbook-16-800.jpg', 'Strawberry Leaves', 'Original watercolour · one of one', '€140', 'Original'),
         ('e-books/watercolor-sketches.jpg', 'Watercolor Sketches', 'Creative guide · Amazon', '$', 'Guide'),
         ('e-books/ink-sketching.jpg', 'Ink Sketching', 'Creative guide · Amazon', '$', 'Guide'),
         ('cards/classic/16.jpg', 'Wobbleland cards', 'Hand-painted card set · print at home', '€6', 'New'),
         ('sketchbook/sketchbook-7-800.jpg', 'Rooftops', 'Giclée print · A3', '€32', '')]
cards = ''.join('<div class="pc">%s<div class="im"><img src="%s%s" alt=""></div><h3>%s</h3><div class="sub">%s</div><div class="row"><span class="price">%s</span><span class="btn sm">%s</span></div></div>' % (
    ('<span class="tag">%s</span>' % t if t else ''), I, im, n, s, p if p != '$' else 'from $9', 'Amazon ↗' if p == '$' else 'Add') for im, n, s, p, t in items)
page('shop', 'Shop', shop_css, hd('shop') + '''<div class="wrap"><div class="ph"><div class="eyebrow">Shop</div><h1>Prints, originals &amp; guides</h1><p>Everything here is painted by hand in Riga. Prints ship from Latvia; guides open on Amazon.</p></div>
<div class="tabs"><span class="on">All</span><span>Prints</span><span>Originals</span><span>Guides</span><span>Card sets</span><span>Printables</span></div>
<div class="g">%s</div>
<div class="perks"><div><b>Printed on cotton paper</b><span>Archival inks, signed on the back</span></div><div><b>Ships from Riga</b><span>EU 3–7 days, worldwide 7–14</span></div><div><b>Paint it yourself</b><span>Every print has a free mini-lesson</span></div></div>
<div class="bm"><img src="img/logo-wc.png" alt="" style="border-radius:50%%"><div><b>Looking for the bird market?</b><br><span>Items for your bird are bought with 🔘 buttons inside the Lab, not here.</span></div><a class="btn sm" href="lab.html">To the bird market →</a></div></div>''' % (cards,) + FT)

# ---------- LAB ----------
lab_css = '''
body{background:#2C1F2B;color:#F6E7B4;background-image:radial-gradient(rgba(246,231,180,.07) 1px,transparent 1px);background-size:22px 22px}
.lh{border-bottom:2px solid #4E3A4A}.lh .wrap{display:flex;align-items:center;gap:20px;height:70px;font:700 15px Fraunces}
.lh img{width:34px;height:34px}.lh .back{margin-left:auto;color:#E6D6C8;font:500 14px Karla;border:1.5px solid #6E5466;border-radius:999px;padding:8px 14px}
.lh .me{display:flex;align-items:center;gap:8px;font:500 14px Karla;color:#E6D6C8}
.top{padding:50px 0 34px;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:end}
.top h1{font-size:60px;font-style:italic;font-weight:400}.top p{color:#E6D6C8;font-size:18px;margin-top:10px;max-width:32em}
.hatch{background:var(--mustard);color:#2C1F2B;font:600 16px Fraunces;padding:14px 22px;border-radius:6px;box-shadow:0 4px 0 #9C7A2E}
.ftabs{display:flex;gap:6px;margin-bottom:-2px;position:relative;z-index:1}
.ftabs span{background:#3A2A38;padding:12px 22px;border-radius:12px 12px 0 0;font:italic 17px Fraunces;color:#E6D6C8;border:2px solid #4E3A4A;border-bottom:0}
.ftabs span.on{background:#45323F;color:#F6E7B4;border-color:#6E5466}
.ftabs span i{font-style:normal;font:500 12px Karla;opacity:.7;margin-left:6px}
.folder{background:#45323F;border:2px solid #6E5466;border-radius:0 12px 12px 12px;padding:28px;margin-bottom:40px}
.gg{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.gt{background:#FBF6EC;border-radius:3px;padding:10px 10px 4px;position:relative;box-shadow:0 10px 20px rgba(0,0,0,.3)}.gt:nth-child(odd){transform:rotate(-1.2deg)}.gt:nth-child(even){transform:rotate(1deg)}
.gt img{width:100%;aspect-ratio:1;object-fit:cover}
.gt div{padding:10px 4px}.gt b{font:600 18px Fraunces;display:block;color:var(--ink)}.gt span{font-size:13px;color:var(--ink2)}
.st{position:absolute;top:18px;left:18px;font:700 11px Karla;letter-spacing:.08em;text-transform:uppercase;padding:4px 8px;border-radius:3px;background:#8FB3A0;color:#2C1F2B}
.st.beta{background:var(--mustard)}.st.new{background:var(--apricot)}
.leg{display:flex;gap:18px;margin-top:20px;font-size:13px;color:#E6D6C8;flex-wrap:wrap}.leg i{font-style:normal;padding:2px 8px;border-radius:3px;color:#2C1F2B;font-weight:700;margin-right:6px}
.exits{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:60px}
.ex{border:2px dashed #6E5466;border-radius:10px;padding:22px;display:flex;gap:16px;align-items:center}
.ex img{width:70px;height:70px;object-fit:cover;border-radius:6px}.ex b{font:600 19px Fraunces;color:#F6E7B4}.ex span{font-size:14px;color:#E6D6C8;display:block}
.lft{border-top:2px solid #4E3A4A;padding:26px 0;font-size:13px;color:#B59FA8}
@media(max-width:700px){.top{grid-template-columns:1fr;padding:26px 0 20px}.top h1{font-size:36px}.lh .me{display:none}
.ftabs{overflow:auto;margin:0 -16px -2px;padding:0 16px}.ftabs span{padding:10px 14px;font-size:14px;white-space:nowrap}.ftabs span i{display:none}
.folder{padding:14px;border-radius:0 0 12px 12px;margin:0 -4px 30px}.gg{grid-template-columns:1fr 1fr;gap:10px}.exits{grid-template-columns:1fr}}
'''
games = [('games/rain.png', 'Rain', 'Catch drops for buttons', ''), ('games/pancakes.png', 'Pancake Café', 'Cook for Wobbleland', ''),
         ('games/potions.png', 'Potion Lab', 'Mazes &amp; recipes', ''), ('games/titos.png', 'Detective Titos', 'Solve a case', ''),
         ('games/shift.png', 'Shift with Polly', 'Focus timer', ''), ('games/polly-office.png', 'Polly’s Office', 'Help Polly at work', ''),
         ('games/advent.png', 'Advent', 'A window a day', 'new'), ('games/wobbleland.png', 'Wobbleland walk', 'Explore the towns', 'beta')]
gt = ''.join('<div class="gt"><span class="st %s">%s</span><img src="%s%s" alt=""><div><b>%s</b><span>%s</span></div></div>' % (
    s, {'': 'ready', 'beta': 'brewing', 'new': 'season'}[s], I, im, n, d) for im, n, d, s in games)
page('lab', 'The Lab', lab_css, '''<header class="lh"><div class="wrap"><img src="img/logo-wc.png" alt="" style="border-radius:50%%"> <i style="font:italic 600 20px Fraunces">The Lab</i> <span class="me"><img src="%scards/classic/11.jpg" style="width:28px;height:28px;border-radius:50%%;object-fit:cover">my bird · 🔘 240</span><a class="back" href="home.html">← Back to the studio</a></div></header>
<div class="wrap"><div class="top"><div><h1>Welcome to the Lab</h1><p>The playful side of Pigeon Polly: hatch a bird, join the Flock, play for buttons. Everything is free.</p></div><span class="hatch">🥚 Hatch your bird</span></div>
<div class="ftabs"><span class="on">🎮 Play<i>8</i></span><span>🐦 My bird<i>room · garden · flock</i></span><span>🛍 Bird market<i>🔘</i></span><span>🧪 Experiments<i>3</i></span><span>🗄 Archive</span></div>
<div class="folder"><div class="gg">%s</div>
<div class="leg"><span><i style="background:#8FB3A0">ready</i>finished, here to stay</span><span><i style="background:var(--mustard)">brewing</i>new experiment, may change</span><span><i style="background:var(--apricot)">season</i>only for a while</span></div></div>
<div class="exits"><div class="ex"><img src="%scards/classic/16.jpg"><div><b>Like the characters?</b><span>Wobbleland card sets &amp; prints are in the shop →</span></div></div><div class="ex"><img src="%ssketchbook/sketchbook-21-800.jpg"><div><b>Want to paint for real?</b><span>Join the paint-along waitlist →</span></div></div></div></div>
<div class="lft"><div class="wrap">Pigeon Polly Art Lab · the playful side · <a href="home.html" style="text-decoration:underline">back to the studio</a></div></div></body></html>''' % (I, gt, I, I))

# ---------- WOBBLELAND ----------
wl_css = '''
body{background:#EDE3CC}
.wh{text-align:center;padding:54px 0 24px}.wh h1{font-size:72px;font-weight:800}.wh h1 em{font-weight:400;color:var(--burgundy)}
.wh p{color:var(--ink2);font-size:19px;margin:10px auto 0;max-width:34em}
.wt{display:flex;justify-content:center;gap:28px;font:600 17px Fraunces;border-bottom:1px solid var(--line);margin:24px 0 34px}
.wt span{padding:10px 2px}.wt span.on{border-bottom:3px solid var(--burgundy)}
.mapw{position:relative;background:#F7EEDB;padding:22px;border:1px solid #CDBB98;box-shadow:0 20px 40px rgba(80,50,20,.18);margin-bottom:50px}
.mapw:before{content:"";position:absolute;inset:10px;border:2px solid #8A6A3A;pointer-events:none;z-index:2}
.mapw img.m{width:100%;filter:blur(1.6px) sepia(.55) saturate(.7) hue-rotate(-14deg) contrast(.92) brightness(1.08)}
.mapw:after{content:"";position:absolute;inset:22px;background:radial-gradient(transparent 55%,rgba(120,80,30,.35));mix-blend-mode:multiply;pointer-events:none}
.pin{position:absolute;z-index:3;display:flex;align-items:center;gap:6px;background:#FBF6EC;border:1px solid #8A6A3A;border-radius:999px;padding:4px 10px 4px 4px;font:600 13px Fraunces;box-shadow:0 3px 8px rgba(0,0,0,.15)}
.pin img{width:24px;height:28px}
.compass{position:absolute;right:46px;bottom:40px;z-index:3;font:italic 600 18px Fraunces;color:#6A4A20;background:#FBF6EC;border:1px solid #8A6A3A;padding:8px 14px}
.res h2{font-size:40px;margin-bottom:20px}
.rg{display:grid;grid-template-columns:repeat(6,1fr);gap:16px;margin-bottom:60px}
.rc{background:var(--card);border:1px solid var(--line);padding:14px;text-align:center}
.rc img{width:100%;border-radius:6px;margin:0 auto 10px;box-shadow:0 6px 14px rgba(60,40,20,.2)}.rc b{font:600 15px Fraunces;display:block}.rc span{font-size:12px;color:var(--ink2)}
.sets{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:70px}
.set{background:var(--burgundy);color:var(--paper);padding:26px;display:flex;gap:20px;align-items:center}
.set.o{background:#8A5A2B}.set img{width:110px;box-shadow:6px 8px 0 rgba(0,0,0,.25)}.set h3{font-size:24px}.set p{font-size:14px;opacity:.85;margin:6px 0 14px}.set .btn{border-color:var(--paper)}
@media(max-width:700px){.wh{padding:28px 0 10px}.wh h1{font-size:44px}.wt{gap:16px;font-size:15px;overflow:auto;justify-content:flex-start;margin:16px -16px 20px;padding:0 16px}.wt span{white-space:nowrap}
.mapw{padding:10px;margin:0 -6px 30px}.mapw:before{inset:5px}.mapw:after{inset:10px}.pin{font-size:10px;padding:2px 6px 2px 2px}.pin img{width:14px;height:16px}.compass{display:none}
.rg{grid-template-columns:repeat(3,1fr);gap:8px}.rc span{display:none}.sets{grid-template-columns:1fr}.res h2{font-size:30px}}
'''
pins = [('newwobbleton', 'New Wobbleton', 30, 40), ('jamshire', 'Jamshire', 14, 22), ('maplewink', 'Maplewink', 52, 18),
        ('snailhollow', 'Snail Hollow', 70, 56), ('cheddarford', 'Cheddarford', 22, 66), ('kettleford', 'Kettleford', 80, 26)]
pz = ''.join('<span class="pin" style="left:%d%%;top:%d%%"><img src="%swobbleland/crest-%s.png">%s</span>' % (x, y, I, c, n) for c, n, x, y in pins)
res = [('11', 'Pigeon Polly', 'New Wobbleton'), ('13', 'Miss Peony', 'Bakery seller'), ('14', 'Mr. Crisper', 'Lost-and-found keeper'),
       ('15', 'Milka', 'Lives in a box'), ('17', 'Mr. Dr. Fisher III', 'Doctor of… something'), ('22', 'Lady Puddle-Dip', 'Gourmet, LemonVale')]
rz = ''.join('<div class="rc"><img src="%scards/classic/%s.jpg"><b>%s</b><span>%s</span></div>' % (I, c, n, d) for c, n, d in res)
page('wobbleland', 'Wobbleland', wl_css, hd('wl') + '''<div class="wrap"><div class="wh"><div class="eyebrow" style="color:var(--burgundy)">A world by Alina Otkinska</div><h1>Wobble<em>land</em></h1><p>Eleven wobbly towns, their residents, holidays and a collectible card for each of them.</p></div>
<div class="wt"><span class="on">Map</span><span>Residents</span><span>Card sets</span><span>Comics</span><span>Holidays</span></div>
<div class="mapw"><img class="m" src="%swobbleland/map-pixel.png" alt="">%s<span class="compass">✦ Map of Wobbleland</span></div>
<div class="res"><h2>Meet the residents</h2><div class="rg">%s</div></div>
<div class="sets"><div class="set"><img src="%scards/classic/21.jpg"><div><h3>Classic set</h3><p>19 hand-painted cards · collect in the Lab, or buy the printable set</p><span class="btn sm">Get the set · €6</span></div></div>
<div class="set o"><img src="%scards/classic/12.jpg"><div><h3>Wobbleland comics</h3><p>Short stories from the towns. First issue soon.</p><span class="btn sm">Notify me</span></div></div></div></div>''' % (I, pz, rz, I, I) + FT)

# ---------- ADMIN ----------
ad_css = '''
body{background:#F3EEE4}
.ah{background:var(--moss);color:var(--paper)}.ah .wrap{display:flex;align-items:center;height:60px;gap:16px;font:600 18px Fraunces,Lora}.ah span{margin-left:auto;font:500 14px Karla;opacity:.8}
.hi{padding:36px 0 20px}.hi h1{font-size:40px}.hi p{color:var(--ink2)}
.nums{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:30px}
.num{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px}.num b{font:600 30px Fraunces;display:block}.num span{font-size:13px;color:var(--ink2)}.num i{font-style:normal;font-size:12px;color:var(--olive);font-weight:700}
.acts{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:30px}
.act{background:#fff;border:1px solid var(--line);border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:6px}
.act .e{font-size:30px}.act span.btn{flex:none}.act b{font:600 19px Fraunces,Lora}.act span{font-size:13px;color:var(--ink2);flex:1}.act .btn{align-self:flex-start;margin-top:10px}
.act.hot{border:2px solid var(--orange)}.badge{background:var(--orange);color:#fff;border-radius:999px;font:700 12px Karla;padding:2px 8px;margin-left:6px}
.more{background:#fff;border:1px solid var(--line);border-radius:10px;padding:18px 20px;margin-bottom:50px}
.more summary{font:600 17px Fraunces,Lora;list-style:none}.more .cols{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:16px;font-size:14px;color:var(--ink2);line-height:1.9}
.more .cols b{color:var(--ink);font-size:13px;letter-spacing:.1em;text-transform:uppercase}
.arch{text-decoration:line-through;opacity:.5}
@media(max-width:700px){.nums{grid-template-columns:1fr 1fr}.acts{grid-template-columns:1fr}.act{flex-direction:row;flex-wrap:wrap;align-items:center}.act span{flex-basis:100%;order:3}.act .btn{margin:0 0 0 auto;order:2}.more .cols{grid-template-columns:1fr 1fr}.hi h1{font-size:30px}}
'''
page('admin', 'Admin', ad_css, '''<div class="ah"><div class="wrap">Pigeon Polly · Кабинет <span>← на сайт</span></div></div><div class="wrap">
<div class="hi"><h1>Доброе утро, Алина</h1><p>Неделя 46 · всё, что нужно на неделе, — на одном экране</p></div>
<div class="nums"><div class="num"><b>1 240</b><span>посетителей за 7 дней</span> <i>+12%%</i></div><div class="num"><b>38</b><span>переходов в магазин и на Amazon</span></div><div class="num"><b>4</b><span>заказа</span></div><div class="num"><b>27</b><span>в списке «Paint with me»</span></div><div class="num"><b>15</b><span>новых птичек</span></div></div>
<div class="acts">
<div class="act hot"><span class="e">📥</span><b>Входящие<span class="badge">3</span></b><span>Заказы, комментарии, вопросы из чата — всё, что ждёт ответа</span><span class="btn sm dark">Открыть</span></div>
<div class="act"><span class="e">✍️</span><b>Написать статью</b><span>Редактор с переводчиком · кнопка «Копировать для Patreon»</span><span class="btn sm dark">Новая статья</span></div>
<div class="act"><span class="e">🛍</span><b>Магазин</b><span>Принты и наборы карточек · лавка птичек пополняется одной кнопкой</span><span class="btn sm">🔄 Пополнить лавку</span></div>
<div class="act"><span class="e">🔘</span><b>Зарплата птичкам</b><span>Последняя выдача — 3 ноября</span><span class="btn sm">Выдать</span></div>
<div class="act"><span class="e">🎨</span><b>Челлендж сезона</b><span>«Ноябрь: 30 уютных вещей» · темы готовы до 30.11</span><span class="btn sm">Темы</span></div>
</div>
<details class="more" open><summary>⚙ Ещё инструменты ▾ <span class="note">(свёрнуто по умолчанию)</span></summary><div class="cols">
<div><b>Птицы</b><br>Все птички<br>Подарки<br>Школа Полли<br>Объявления стаи<br>Письма</div>
<div><b>Игры</b><br>Дела Титоса<br>Награды игр<br>Адвент<br>Карточки<br>📜 Правила</div>
<div><b>Контент</b><br>Комментарии<br>Картины и палитры<br>Посты для соцсетей<br>Темы для блога<br>Правки страниц</div>
<div><b>Система</b><br>Статистика подробно<br>Копии<br>Защита · Ключ Gemini<br><span class="arch">Нарисуй мне</span> → архив</div>
</div></details></div></body></html>''')

# ---------- JOURNEY ----------
jr_css = '''
.jw{padding:40px 0 60px}.jw h1{font-size:44px;margin-bottom:6px}.jw>p{color:var(--ink2);margin-bottom:30px}
.lane{display:grid;grid-template-columns:170px 1fr;gap:20px;align-items:center;margin-bottom:26px}
.lane .who{font:600 20px Fraunces,Lora}.lane .who span{display:block;font:500 13px Karla;color:var(--ink2)}
.flow{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.st{background:var(--card);border:1.5px solid var(--ink);border-radius:8px;padding:10px 14px;font:600 14px Karla;max-width:190px}
.st small{display:block;font-weight:400;color:var(--ink2);font-size:12px}
.st.goal{background:var(--orange);color:#fff;border-color:var(--orange)}.st.goal small{color:#FBE0D2}
.st.lab{background:#2C1F2B;color:#F6E7B4;border-color:#2C1F2B;font-family:Fraunces;font-style:italic}.st.lab small{color:#E6D6C8;font-family:Karla}
.ar{font-size:20px;color:var(--olive)}
.src{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:34px}.src span{background:var(--paper2);border-radius:999px;padding:6px 14px;font-size:13px}
.loop{margin-top:16px;padding:16px 20px;border:1.5px dashed var(--olive);border-radius:8px;font-size:14px;color:var(--ink2)}
'''
def flow(*steps):
    out = []
    for s in steps:
        cls, t, sm = s
        out.append('<div class="st %s">%s<small>%s</small></div>' % (cls, t, sm))
    return '<div class="flow">' + '<span class="ar">→</span>'.join(out) + '</div>'
lanes = [
    ('Покупатель', 'хочет красивую вещь', flow(('', 'Главная', 'герой: принты + гайды'), ('', 'Shop', 'вкладка Prints'), ('', 'Карточка товара', 'фото на стене, размеры'), ('', 'Корзина', 'уже есть на сайте'), ('goal', 'Оплата', 'Stripe / ссылка оплаты'), ('', 'Письмо', 'спасибо + мини-урок'))),
    ('Учится рисовать', 'новичок, Pinterest, Amazon', flow(('', 'Главная / статья', 'про акварель'), ('', 'Learn', 'гайды, палитры, мини-урок'), ('goal', 'Гайд на Amazon', 'покупка'), ('goal', 'Waitlist', 'email + голос за тему'), ('', 'Paint-along', 'первый урок бесплатно'), ('goal', 'Patreon / курс', 'когда 100+ в списке'))),
    ('Фанат мира', 'любит персонажей', flow(('', 'Wobbleland', 'карта, жители'), ('', 'Карточки', 'собрать в Лаборатории'), ('goal', 'Набор карточек', 'печатный / принт'), ('', 'Комиксы', 'позже'))),
    ('Любопытный', 'пришёл поиграть', flow(('lab', '🚪 The Lab', 'кнопка в шапке и блок внизу'), ('lab', 'Вылупи птичку', 'ник = подписка'), ('lab', 'Игры, стая, комната', 'пуговки'), ('lab', 'Выход-мостик', '«нравятся герои? → магазин»'), ('goal', 'Карточки / принты', 'или waitlist'))),
    ('Профессионал', 'LinkedIn, работодатель', flow(('', 'Journal', 'статьи: образование, AI'), ('', 'About', 'история, проекты'), ('goal', 'Work with me', 'заявка'))),
]
lz = ''.join('<div class="lane"><div class="who">%s<span>%s</span></div>%s</div>' % l for l in lanes)
page('journey', 'Journey', jr_css, '''<div class="wrap jw"><div class="eyebrow">Схема</div><h1>Путь посетителя: 5 дорожек</h1><p>Оранжевое — цель (деньги или контакт). Тёмно-сливовое — «вторая сторона», Лаборатория.</p>
<div class="src"><b style="font-size:13px;padding:6px 0">Откуда приходят:</b><span>Pinterest → пин с артом → Shop</span><span>Amazon → гайд → сайт из книги</span><span>LinkedIn → Journal</span><span>друзья, стая → The Lab</span><span>Google → статья / палитры</span></div>
%s<div class="loop">Правило главной: каждый блок ведёт к одной из 5 целей. Игры не показываются наверху главной, но вход в Лабораторию виден всегда — в шапке.</div></div></body></html>''' % lz)
print('ok')
