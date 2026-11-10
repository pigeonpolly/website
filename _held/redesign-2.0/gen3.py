# Два альтернативных варианта главной: уроки + гайды + материалы (не часть сайта)
import random
from gen import page, FT as FT0, I
FT = FT0.replace('<h4>Shop</h4><ul><li>Prints</li><li>Originals</li><li>Guides</li><li>Card sets</li></ul>','<h4>Learn</h4><ul><li>Free lessons</li><li>Paint-alongs</li><li>Guides &amp; books</li><li>Materials</li></ul>').replace('New prints, a free mini-lesson','A free lesson every Monday')
random.seed(7)

def torn(n=40, d=2.2):
    top = ' '.join('%.1f%% %.1f%%' % (i * 100 / n, random.uniform(0, d)) for i in range(n + 1))
    bot = ' '.join('%.1f%% %.1f%%' % (100 - i * 100 / n, 100 - random.uniform(0, d)) for i in range(n + 1))
    return 'polygon(%s, %s)' % (top, bot)
TORN = torn()

FONTS = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,300;1,9..144,400&family=Karla:wght@400;500;700&family=Lora:wght@500;600&family=Caveat:wght@500;700&display=swap');"

# ====================== VARIANT A — ALMANAC ======================
a_css = FONTS + '''
body{background:#F3EADB}
.mast{text-align:center;padding:18px 0 0}
.mast .top{display:flex;justify-content:space-between;font:700 11px Karla;letter-spacing:.2em;text-transform:uppercase;color:var(--ink2);border-bottom:1px solid var(--ink);padding-bottom:10px}
.mast h1{font:300 112px/0.95 Fraunces;letter-spacing:-.03em;margin:22px 0 4px}.mast h1 em{font-weight:300;color:var(--burgundy)}
.mast .sub{font:italic 18px Fraunces;color:var(--ink2)}
.mnav{display:flex;justify-content:center;gap:34px;border-top:3px double var(--ink);border-bottom:3px double var(--ink);margin-top:20px;padding:12px 0;font:600 13px Karla;letter-spacing:.16em;text-transform:uppercase}
.mnav .door{color:var(--burgundy)}
.hero{display:grid;grid-template-columns:1.55fr 1fr;gap:44px;padding:44px 0 56px;border-bottom:1px solid var(--ink)}
.kick{font:700 11px Karla;letter-spacing:.2em;text-transform:uppercase;color:var(--orange);display:flex;gap:10px;align-items:center}.kick:after{content:"";flex:1;height:1px;background:var(--line)}
.vid{position:relative;margin:14px 0 18px;aspect-ratio:16/10;overflow:hidden}
.vid img{width:100%;height:100%;object-fit:cover}
.vid .pl{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:92px;height:92px;border-radius:50%;background:rgba(243,234,219,.94);display:grid;place-items:center;font-size:30px;color:var(--burgundy);box-shadow:0 0 0 10px rgba(243,234,219,.35)}
.vid .dur{position:absolute;right:14px;bottom:14px;background:var(--ink);color:#fff;font:700 12px Karla;padding:4px 8px}
.hero h2{font:400 46px/1.02 Fraunces}.hero h2 em{color:var(--burgundy)}
.hero p{color:var(--ink2);font-size:17px;margin:12px 0 18px;max-width:36em}
.alm h3{font:italic 400 30px Fraunces;border-bottom:2px solid var(--ink);padding-bottom:8px;margin-bottom:4px}
.alm .r{display:grid;grid-template-columns:62px 1fr auto;gap:14px;align-items:center;padding:14px 0;border-bottom:1px dotted var(--ink2)}
.alm .d{font:300 40px/1 Fraunces;text-align:center}.alm .d small{display:block;font:700 10px Karla;letter-spacing:.2em}
.alm b{font:600 18px Fraunces;display:block}.alm span.m{font-size:13px;color:var(--ink2)}
.tg{font:700 10px Karla;letter-spacing:.14em;text-transform:uppercase;padding:4px 8px;border:1.5px solid var(--ink)}
.tg.p{background:var(--burgundy);border-color:var(--burgundy);color:#fff}
.alm .ill{margin-top:20px;display:flex;gap:14px;align-items:center;font:italic 15px Fraunces;color:var(--ink2)}.alm .ill img{width:90px;height:110px;object-fit:cover;filter:sepia(.2)}
.sw{display:grid;grid-template-columns:repeat(6,1fr);margin:50px 0 0}
.sw div{height:150px;padding:14px;color:#fff;display:flex;flex-direction:column;justify-content:space-between}
.sw b{font:400 22px Fraunces;letter-spacing:.04em;text-transform:uppercase}.sw span{font:500 11px Karla;letter-spacing:.1em;opacity:.85}
.swcap{display:flex;justify-content:space-between;align-items:center;padding:16px 0 54px;border-bottom:1px solid var(--ink)}
.swcap p{font:italic 18px Fraunces}
.ways{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--ink)}
.way{padding:44px 34px;border-right:1px solid var(--ink)}.way:last-child{border-right:0}.way:first-child{padding-left:0}
.way .n{font:300 72px/1 Fraunces;color:var(--apricot)}
.way h3{font:400 32px Fraunces;margin:10px 0}.way p{color:var(--ink2);margin-bottom:18px}
.way img{width:100%;aspect-ratio:4/3;object-fit:cover;margin-bottom:18px}
.shelf{padding:60px 0;border-bottom:1px solid var(--ink);display:grid;grid-template-columns:1fr 2fr;gap:50px;align-items:end}
.shelf h2{font:400 52px/1 Fraunces}.shelf h2 em{color:var(--burgundy)}.shelf p{color:var(--ink2);margin:14px 0 20px}
.plates{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;border-bottom:10px solid #8A5A2B;padding-bottom:0}
.plate{text-align:center}.plate img{width:100%;box-shadow:6px -4px 0 rgba(0,0,0,.12)}
.plate small{display:block;font:700 10px Karla;letter-spacing:.18em;text-transform:uppercase;margin-top:10px;color:var(--ink2)}
.plate b{font:italic 16px Fraunces}
.platecap{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;text-align:center;padding-top:12px}
.mat{padding:60px 0;border-bottom:1px solid var(--ink)}
.mat .hd2{display:flex;justify-content:space-between;align-items:end;margin-bottom:26px}.mat h2{font:400 44px Fraunces}
.mg{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.mi{background:#FBF6EC;border:1px solid var(--line);padding:16px;position:relative}
.mi img{width:100%;aspect-ratio:1;object-fit:cover;filter:grayscale(1) contrast(1.6) brightness(1.15);mix-blend-mode:multiply}
.mi img.col{filter:none;mix-blend-mode:normal}
.mi b{font:600 18px Fraunces;display:block;margin-top:12px}.mi span{font-size:13px;color:var(--ink2)}
.mi .tg{position:absolute;top:24px;left:24px;background:#FBF6EC}.mi .tg.p{background:var(--burgundy)}
.club{margin:60px 0;display:grid;grid-template-columns:1.3fr 1fr;background:var(--burgundy);color:var(--paper)}
.club .l{padding:44px}.club h2{font:300 56px/1 Fraunces}.club h2 em{color:var(--apricot)}
.club p{opacity:.85;margin:14px 0 22px;font-size:17px}
.club .r{border-left:2px dashed rgba(243,234,219,.5);padding:44px;display:flex;flex-direction:column;justify-content:center;gap:14px}
.club .tier{display:flex;justify-content:space-between;border-bottom:1px solid rgba(243,234,219,.3);padding-bottom:12px;font:400 20px Fraunces}
.club .btn{background:var(--apricot);color:var(--ink);border-color:var(--apricot);align-self:flex-start}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);margin-bottom:60px}
.duo>div{padding:40px 34px 40px 0;display:grid;grid-template-columns:150px 1fr;gap:24px;align-items:center}
.duo>div+div{border-left:1px solid var(--ink);padding-left:34px}
.duo img{width:150px;height:180px;object-fit:cover}
.arch{border-radius:80px 80px 0 0}
.duo h3{font:400 30px Fraunces}.duo p{color:var(--ink2);margin:8px 0 14px}
.ft{background:var(--ink)}
@media(max-width:700px){
 .mast .top span:nth-child(2){display:none}.mast h1{font-size:58px}.mnav{gap:16px;font-size:11px;overflow:auto;justify-content:flex-start;padding:10px 4px}
 .hero,.shelf,.club,.duo,.ways{grid-template-columns:1fr}.hero{gap:30px;padding:24px 0 36px}.hero h2{font-size:32px}
 .sw{grid-template-columns:repeat(3,1fr)}.sw div{height:96px;padding:10px}.sw b{font-size:15px}.swcap{flex-direction:column;align-items:start;gap:12px}
 .way{border-right:0;border-bottom:1px solid var(--line);padding:32px 0}.way .n{font-size:52px}
 .shelf h2,.mat h2{font-size:34px}.plates,.platecap{grid-template-columns:repeat(2,1fr)}.mg{grid-template-columns:1fr 1fr;gap:10px}.mi b{font-size:15px}
 .club .l,.club .r{padding:28px}.club .r{border-left:0;border-top:2px dashed rgba(243,234,219,.5)}.club h2{font-size:40px}
 .duo>div{padding:28px 0;grid-template-columns:100px 1fr}.duo>div+div{border-left:0;border-top:1px solid var(--ink);padding-left:0}.duo img{width:100px;height:120px}
}
'''
sw = [('#E8A87C', 'Apricot'), ('#E3A19A', 'Blush'), ('#C4552D', 'Blood orange'), ('#A8452E', 'Copper tulip'), ('#D6A640', 'Sunshine'), ('#6A2432', 'Burgundy')]
swh = ''.join('<div style="background:%s"><span>%s</span><b>%s</b></div>' % (c, c, n) for c, n in sw)
alm = [('03', 'NOV', 'Persimmons on a blue plate', '10 min · beginner', ''), ('10', 'NOV', 'Rooftops of Riga', '40 min · full paint-along', 'p'),
       ('17', 'NOV', 'A cup of brushes in ink', '12 min · ink + wash', ''), ('24', 'NOV', 'Cosy café breakfast', '35 min · reference + sketch', 'p')]
almh = ''.join('<div class="r"><div class="d">%s<small>%s</small></div><div><b>%s</b><span class="m">%s</span></div><span class="tg %s">%s</span></div>' % (d, m, t, s, c, 'Member' if c else 'Free') for d, m, t, s, c in alm)
page('var-a', 'Variant A', a_css, '''<div class="wrap"><div class="mast"><div class="top"><span>Riga · Est. 2019</span><span>Watercolour · Ink · Sketching</span><span>No. 11 · November</span></div>
<h1>Pigeon Polly <em>Art Lab</em></h1><div class="sub">a small almanac of watercolour lessons, guides &amp; things to paint</div>
<nav class="mnav"><span>Lessons</span><span>Guides &amp; books</span><span>Materials</span><span>Studio Club</span><span>Wobbleland</span><span>About</span><span class="door">🚪 The Lab</span></nav></div>
<section class="hero"><div><div class="kick">Free lesson of the week</div>
<div class="vid"><img src="%ssketchbook/sketchbook-17.jpg"><span class="pl">▶</span><span class="dur">10:24</span></div>
<h2>Persimmons on a blue plate, <em>in ten minutes</em></h2><p>Three colours, one brush, no drawing first. A free paint-along for complete beginners, in English with Latvian subtitles.</p>
<span class="btn pri">▶ Watch free</span> <span class="btn">All lessons</span></div>
<div class="alm"><h3>The November almanac</h3>@ALMH<div class="ill"><img src="%ssketchbook/sketchbook-16-800.jpg"><span>“A new small painting every Monday. Members get the long version, everyone gets the short one.”</span></div></div></section>
<div class="sw">@SWH</div><div class="swcap"><p>The palette of the month. Mix these six and paint along with every November lesson.</p><span class="btn">Download palette card · free</span></div>
<section class="ways">
<div class="way"><div class="n">I.</div><img src="%ssketchbook/sketchbook-21-800.jpg"><h3>Free lessons</h3><p>Short paint-alongs and tips on YouTube, playing right here on the site.</p><span class="btn sm">Start watching</span></div>
<div class="way"><div class="n">II.</div><img src="%ssketchbook/sketchbook-5-800.jpg"><h3>Paint-alongs</h3><p>Full 30–40 minute lessons with reference photo and line sketch. Buy one or get them all as a member.</p><span class="btn sm dark">From €9</span></div>
<div class="way"><div class="n">III.</div><img src="%ssketchbook/sketchbook-2-800.jpg"><h3>Guides &amp; books</h3><p>Step-by-step creative guides, on Amazon, to keep on your desk.</p><span class="btn sm">See the shelf</span></div></section>
<section class="shelf"><div><div class="kick">The bookshelf</div><h2>Guides you can <em>hold</em></h2><p>Written, illustrated and designed by Alina. Each guide comes with a free video for the first chapter.</p><span class="btn dark">Buy on Amazon</span></div>
<div><div class="plates"><div class="plate"><img src="%se-books/watercolor-sketches.jpg"></div><div class="plate"><img src="%se-books/ink-sketching.jpg"></div><div class="plate"><img src="%se-books/urban-sketching-digital-traveler.jpg"></div><div class="plate"><img src="%se-books/coloring-book-world-breakfasts.jpg"></div></div>
<div class="platecap"><div class="plate"><small>Plate I</small><b>Watercolor Sketches</b></div><div class="plate"><small>Plate II</small><b>Ink Sketching</b></div><div class="plate"><small>Plate III · soon</small><b>Digital Traveler</b></div><div class="plate"><small>Plate IV · free</small><b>World Breakfasts</b></div></div></div></section>
<section class="mat"><div class="hd2"><div><div class="kick">Materials</div><h2>Things to print &amp; paint</h2></div><span class="btn">All materials</span></div>
<div class="mg"><div class="mi"><span class="tg">Free</span><img src="%ssketchbook/sketchbook-17-800.jpg"><b>Line sketch: Persimmons</b><span>PDF to trace or print</span></div>
<div class="mi"><span class="tg p">Member</span><img class="col" src="%ssketchbook/sketchbook-7-800.jpg"><b>Reference pack: Riga</b><span>24 photos for painting</span></div>
<div class="mi"><span class="tg">Free</span><img src="%scards/classic/13.jpg"><b>Colouring page: Miss Peony</b><span>from Wobbleland</span></div>
<div class="mi"><span class="tg">€4</span><img class="col" src="%ssketchbook/sketchbook-21-800.jpg"><b>Palette cards · set of 12</b><span>print, cut, swatch</span></div></div></section>
<section class="club"><div class="l"><div class="kick" style="color:var(--apricot)">Studio Club · on Patreon</div><h2>Paint with me <em>every week</em></h2><p>Every paint-along, reference packs, line sketches and a vote on what we paint next.</p><span class="btn">Join the club</span></div>
<div class="r"><div class="tier"><span>Sketchbook friend</span><span>€5 / mo</span></div><div class="tier"><span>Studio · all lessons</span><span>€12 / mo</span></div><div class="tier" style="border:0;opacity:.7"><span>Feedback · soon</span><span>€30 / mo</span></div></div></section>
<section class="duo"><div><img class="arch" src="%shome/alina.jpg"><div><h3>Hi, I’m Alina</h3><p>Illustrator and learning experience designer. I teach the way I sketch: small, kind and step by step.</p><span class="btn sm">My story</span></div></div>
<div><img class="arch" src="%shome/first-pigeon-polly.jpg"><div><h3>Behind the door</h3><p>Hatch a bird, play games and wander around Wobbleland. The playful side of the lab.</p><span class="btn sm">🚪 Open the Lab</span></div></div></section></div>''' .replace('%s', I).replace('@ALMH', almh).replace('@SWH', swh) + FT)

# ====================== VARIANT B — ARCHIVE / COLLAGE ======================
b_css = FONTS + '''
body{background:#EFD9C3;background-image:radial-gradient(rgba(110,60,30,.07) 1px,transparent 1px);background-size:4px 4px}
.bh{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.bh .lg{font:italic 400 28px Fraunces}.bh .lg b{font-style:normal;font-weight:800}
.bh nav{display:flex;gap:8px}.bh nav span{background:#FBF3E6;border-radius:999px;padding:9px 16px;font:600 14px Karla;box-shadow:0 2px 0 rgba(60,30,10,.15)}
.bh nav span.d{background:var(--burgundy);color:var(--paper)}
.hero{display:grid;grid-template-columns:1fr 1.1fr;gap:30px;padding:30px 0 70px;align-items:center}
.hero h1{margin-bottom:22px;font:800 92px/.95 Fraunces;letter-spacing:-.03em;color:var(--burgundy)}
.hero h1 i{font-weight:300;color:var(--ink)}
.hand{font:700 30px Caveat;color:var(--orange);transform:rotate(-4deg);display:inline-block;margin:16px 0 4px}
.hero p{font-size:18px;color:var(--ink2);max-width:28em;margin:8px 0 26px}
.cl{position:relative;height:560px}
.cl .t{position:absolute;background:#FBF3E6;padding:12px;clip-path:%s;box-shadow:0 10px 20px rgba(60,30,10,.18)}
.cl .t img{width:100%%;height:100%%;object-fit:cover}
.cl .a{width:360px;height:250px;left:10px;top:30px;transform:rotate(-3deg)}
.cl .b{width:250px;height:320px;right:0;top:0;transform:rotate(4deg)}
.cl .c{width:290px;height:210px;left:120px;bottom:10px;transform:rotate(2deg)}
.cl .tp{position:absolute;width:110px;height:28px;background:rgba(214,166,64,.6);z-index:3}
.cl .ticket{position:absolute;right:40px;bottom:60px;z-index:4;background:var(--mustard);padding:14px 22px;transform:rotate(-7deg);font:700 12px Karla;letter-spacing:.18em;text-align:center;border:2px dashed #fff;outline:6px solid var(--mustard)}
.cl .ticket b{display:block;font:800 26px Fraunces;letter-spacing:0}
.cl .stamp{position:absolute;left:0;bottom:120px;z-index:4;width:110px;height:110px;border-radius:50%%;border:3px solid var(--burgundy);color:var(--burgundy);display:grid;place-items:center;text-align:center;font:700 11px/1.3 Karla;letter-spacing:.12em;transform:rotate(-14deg);background:rgba(239,217,195,.7)}
.cl .note{position:absolute;left:10px;top:300px;z-index:4;font:700 26px Caveat;color:var(--ink);transform:rotate(-6deg)}
.pick{background:#FBF3E6;border-radius:16px;padding:26px 30px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:60px;box-shadow:0 6px 0 rgba(60,30,10,.1)}
.pick b{font:400 26px Fraunces}.pick span.c{border:1.5px solid var(--ink);border-radius:999px;padding:9px 16px;font:600 14px Karla}.pick span.c.on{background:var(--ink);color:var(--paper)}
.cab h2{font:800 60px/1 Fraunces;color:var(--ink);margin-bottom:6px}.cab>p{font:italic 19px Fraunces;color:var(--ink2);margin-bottom:30px}
.tabs{display:flex;gap:4px;position:relative;z-index:2;margin-bottom:-1px}
.tabs span{padding:14px 22px 12px;border-radius:14px 14px 0 0;font:700 13px Karla;letter-spacing:.12em;text-transform:uppercase;color:#fff}
.tabs span i{font:300 italic 22px Fraunces;letter-spacing:0;text-transform:none;margin-right:6px}
.folder{border-radius:0 16px 16px 16px;padding:34px;margin-bottom:0;position:relative}
.f1{background:#E8A87C}.f2{background:#C4552D}.f3{background:#6A2432}.f4{background:#D6A640}.f5{background:#8A5A2B}
.tabs .f1,.tabs .f4{color:var(--ink)}
.peek{height:46px;border-radius:0 0 16px 16px;margin:0 14px;opacity:.95}
.peek.p2{margin:0 28px;height:30px}.peek.p3{margin:0 42px;height:18px}
.fg{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:20px}
.fc{background:#FBF3E6;border-radius:6px;padding:12px;position:relative;box-shadow:0 8px 16px rgba(60,30,10,.18)}
.fc .th{position:relative;aspect-ratio:16/11;overflow:hidden;border-radius:3px}.fc .th img{width:100%%;height:100%%;object-fit:cover}
.fc .pl{position:absolute;left:14px;bottom:14px;width:46px;height:46px;border-radius:50%%;background:#fff;display:grid;place-items:center;color:var(--burgundy)}
.fc b{font:600 20px Fraunces;display:block;margin:12px 0 2px}.fc span{font-size:13px;color:var(--ink2)}
.fc .tg{position:absolute;top:22px;right:22px;font:700 10px Karla;letter-spacing:.14em;text-transform:uppercase;padding:4px 8px;background:#fff;border-radius:3px}
.fc .tg.p{background:var(--burgundy);color:#fff}
.fc.big .th{aspect-ratio:16/12}
.fhd{display:flex;justify-content:space-between;align-items:end;margin-bottom:22px;color:var(--ink)}
.fhd h3{font:400 38px Fraunces}.fhd p{max-width:26em}
.rows{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:70px 0}
.idx{background:#FBF3E6;padding:28px;border-radius:4px;position:relative;background-image:repeating-linear-gradient(transparent 0 31px,rgba(196,85,45,.25) 31px 32px);box-shadow:0 8px 16px rgba(60,30,10,.12)}
.idx:before{content:"";position:absolute;left:52px;top:0;bottom:0;width:1.5px;background:rgba(196,85,45,.5)}
.idx h3{font:800 32px Fraunces;padding-left:44px;margin-bottom:12px}
.idx .bk{display:grid;grid-template-columns:70px 1fr auto;gap:16px;align-items:center;padding:8px 0 8px 44px}
.idx .bk img{width:70px;box-shadow:3px 4px 0 rgba(0,0,0,.15)}.idx .bk b{font:600 18px Fraunces;display:block}.idx .bk span{font-size:13px;color:var(--ink2)}
.club{background:var(--burgundy);color:var(--paper);border-radius:16px;padding:36px;position:relative;overflow:hidden}
.club h3{font:300 50px/1 Fraunces}.club h3 b{font-weight:800;color:var(--apricot)}
.club p{opacity:.85;margin:14px 0 20px}.club .btn{background:var(--apricot);border-color:var(--apricot);color:var(--ink)}
.club .tk{display:flex;gap:10px;margin-top:22px}.club .tk div{flex:1;border:1.5px dashed rgba(243,234,219,.5);border-radius:10px;padding:12px;font-size:13px}.club .tk b{display:block;font:400 22px Fraunces}
.club h3,.club p{padding-right:120px}.club img{position:absolute;right:-24px;top:-40px;width:140px;transform:rotate(14deg);border-radius:10px;opacity:.95}
.lab{display:grid;grid-template-columns:auto 1fr auto;gap:30px;align-items:center;background:#FBF3E6;border-radius:16px;padding:22px 30px;margin-bottom:60px}
.lab img{width:120px;height:90px;object-fit:cover;border-radius:60px 60px 4px 4px}
.lab b{font:400 28px Fraunces}.lab p{color:var(--ink2)}
.ft{background:var(--burgundy)}
@media(max-width:700px){
 .bh nav span:not(.d){display:none}.bh .lg{font-size:22px}
 .hero{grid-template-columns:1fr;padding:6px 0 40px}.hero h1{font-size:54px}
 .cl{height:360px}.cl .a{width:220px;height:160px;left:0;top:10px}.cl .b{width:150px;height:200px}.cl .c{width:190px;height:140px;left:70px}
 .cl .ticket{right:0;bottom:20px;padding:8px 12px;font-size:10px}.cl .ticket b{font-size:18px}.cl .stamp{width:76px;height:76px;font-size:8px;bottom:60px}.cl .note{left:0;top:190px;font-size:20px}
 .pick{padding:20px}.pick b{font-size:22px;width:100%%}
 .cab h2{font-size:40px}.tabs{overflow:auto;margin:0 -16px -1px;padding:0 16px}.tabs span{white-space:nowrap;padding:12px 14px 10px;font-size:11px}
 .folder{padding:18px;border-radius:0 0 16px 16px}.fg{grid-template-columns:1fr}.fhd{flex-direction:column;align-items:start;gap:10px}.fhd h3{font-size:30px}
 .rows{grid-template-columns:1fr;margin:40px 0}.idx{padding:20px 14px}.idx:before{left:30px}.idx h3,.idx .bk{padding-left:26px}.idx .bk{grid-template-columns:54px 1fr}.idx .bk img{width:54px}.idx .bk .btn{display:none}
 .club h3{font-size:36px}.club h3,.club p{padding-right:70px}.club img{width:90px;top:-20px}.club .tk{flex-direction:column}
 .lab{grid-template-columns:1fr;text-align:left}
}
''' % TORN
def fc(img, tg, p, t, s, big=False):
    return '<div class="fc%s"><span class="tg %s">%s</span><div class="th"><img src="%s%s"><span class="pl">%s</span></div><b>%s</b><span>%s</span></div>' % (' big' if big else '', 'p' if p else '', tg, I, img, '🔒' if p else '▶', t, s)
page('var-b', 'Variant B', b_css, '''<div class="wrap"><header class="bh"><span class="lg"><b>Pigeon Polly</b> art lab</span><nav><span>Lessons</span><span>Guides</span><span>Materials</span><span>Club</span><span>About</span><span class="d">🚪 The Lab</span></nav></header>
<section class="hero"><div><span class="hand">hi! let’s paint something small ✿</span><h1>Small paintings, <i>big joy</i></h1><p>Free and full-length watercolour lessons, creative guides and printable materials by illustrator Alina Otkinska.</p><span class="btn pri">▶ Start with a free lesson</span> <span class="btn">Browse guides</span></div>
<div class="cl"><div class="t a"><img src="%ssketchbook/sketchbook-5-800.jpg"></div><div class="t b"><img src="%ssketchbook/sketchbook-15-800.jpg"></div><div class="t c"><img src="%ssketchbook/sketchbook-7-800.jpg"></div>
<span class="tp" style="left:150px;top:18px;transform:rotate(-8deg)"></span><span class="tp" style="right:80px;top:-8px;transform:rotate(10deg)"></span><span class="tp" style="left:220px;bottom:200px;transform:rotate(-3deg)"></span>
<div class="ticket">ADMIT ONE<b>Free lesson</b>EVERY MONDAY</div><div class="stamp">PAINTED<br>IN RIGA<br>✦ 2019 ✦</div><div class="note">you can paint this! →</div></div></section>
<div class="pick"><b>I am…</b><span class="c on">a total beginner</span><span class="c">sketching already</span><span class="c">here for ink</span><span class="c">looking for a gift</span><span class="note" style="margin-left:auto">→ we show the right folder first</span></div>
<section class="cab"><h2>The studio archive</h2><p>Everything to learn, sorted into folders.</p>
<div class="tabs"><span class="f1"><i>01</i>Free lessons</span><span class="f2"><i>02</i>Paint-alongs</span><span class="f3"><i>03</i>Guides &amp; books</span><span class="f4"><i>04</i>Materials</span><span class="f5"><i>05</i>Studio Club</span></div>
<div class="folder f1"><div class="fhd"><h3>Free lessons</h3><p>On YouTube, playing right here. A new short one every Monday, in English with Latvian subtitles.</p></div>
<div class="fg">@FG</div></div>
<div class="peek f2"></div><div class="peek p2 f3"></div><div class="peek p3 f4"></div></section>
<section class="rows"><div class="idx"><h3>Guides &amp; books</h3>
<div class="bk"><img src="%se-books/watercolor-sketches.jpg"><div><b>Watercolor Sketches</b><span>Creative guide · Amazon</span></div><span class="btn sm">Buy</span></div>
<div class="bk"><img src="%se-books/ink-sketching.jpg"><div><b>Ink Sketching</b><span>Creative guide · Amazon</span></div><span class="btn sm">Buy</span></div>
<div class="bk"><img src="%se-books/coloring-book-world-breakfasts.jpg"><div><b>World Breakfasts</b><span>Colouring book · free</span></div><span class="btn sm">Get</span></div></div>
<div class="club"><img src="%scards/classic/16.jpg"><h3>Join the <b>Studio Club</b></h3><p>All paint-alongs, reference packs and line sketches. On Patreon, cancel any time.</p><span class="btn">Become a member</span>
<div class="tk"><div><b>€5</b>Sketchbook friend</div><div><b>€12</b>Studio · all lessons</div><div style="opacity:.6"><b>€30</b>Feedback · soon</div></div></div></section>
<section class="lab"><img src="%shome/first-pigeon-polly.jpg"><div><b>Psst… there’s a door at the back</b><p>Hatch a bird, play games and wander around Wobbleland.</p></div><span class="btn dark">🚪 Open the Lab</span></section></div>'''.replace('%s', I).replace('@FG', fc('sketchbook/sketchbook-17-800.jpg', 'Free', 0, 'Persimmons in 10 minutes', '10 min · beginner', True) + fc('sketchbook/sketchbook-21-800.jpg', 'Free', 0, 'My 5-colour palette', '4 min · tip') + fc('sketchbook/sketchbook-14-800.jpg', 'Member', 1, 'Red wall, long version', '38 min · paint-along')) + FT)
print('ok4')
