# Вариант D: холодная глубокая гамма, 1 акцент, просторная шапка и центрованный первый экран. Основа — вариант C.
# Вариант C: спокойная основа первого макета + папки, один акцент, без продажи картин (не часть сайта)
from gen import page, I

ACC = '#D2643A'
css = '''
:root{--acc:%s;--orange:%s;--burgundy:%s;--mustard:%s;--paper:#EDF0F1;--paper2:#DFE5E8;--card:#F7F9F9;--ink:#16202E;--ink2:#566273;--line:#CED6DB;--moss:#16202E;--olive:#566273;--deep:#1C2A3D}
body{background:var(--paper);background-image:none}
h1,h2,h3{color:var(--ink)}
.hd .nav a.on{border-color:var(--acc)}
.hd{background:rgba(237,240,241,.85);border-bottom:1px solid var(--line)}.hd .wrap{height:104px;max-width:1320px}
.hd .nav{gap:44px;font:700 12px Karla;letter-spacing:.2em;text-transform:uppercase}.hd .nav a.on{border:0;color:var(--acc)}
.logo{font-size:23px}.logo img{width:50px;height:50px;box-shadow:0 0 0 2px var(--deep)}
.signin{border:1.5px solid var(--ink);border-radius:999px;padding:14px 26px;font:600 15px Karla;margin-left:18px}
.door-btn{background:transparent;color:var(--ink);border:1.5px solid var(--ink);box-shadow:none;border-radius:999px;font:500 14px Karla;padding:8px 14px}
.hero{position:relative;text-align:center;padding:84px 0 0;overflow:hidden}
.pill{display:inline-flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:10px 20px;font:700 12px Karla;letter-spacing:.18em;text-transform:uppercase;color:var(--ink2)}
.pill:before{content:"";width:7px;height:7px;border-radius:50%%;background:var(--acc)}
.hero h1{font:600 92px/1 Fraunces;letter-spacing:-.025em;margin:30px auto 18px;max-width:14em}.hero h1 em{font-style:italic;font-weight:400;color:var(--acc)}
.hero p.lead{font-size:20px;color:var(--ink2);max-width:34em;margin:0 auto 36px}
.ctas{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.ctas .btn{padding:17px 30px;font-size:16px}.ctas .btn.pri{box-shadow:0 12px 26px rgba(210,100,58,.35)}
.pano{position:relative;margin-top:-10px;height:560px}
.pano img{position:absolute;inset:0;width:100%%;height:100%%;object-fit:cover;object-position:center 30%%;-webkit-mask-image:linear-gradient(to bottom,transparent 0,rgba(0,0,0,.35) 18%%,#000 45%%);mask-image:linear-gradient(to bottom,transparent 0,rgba(0,0,0,.35) 18%%,#000 45%%)}
.pano:after{content:"";position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(transparent,var(--paper))}
.tagp{position:absolute;z-index:2;display:flex;flex-direction:column;align-items:center}
.tagp span{background:var(--card);border-radius:999px;padding:9px 16px;font:700 12px Karla;letter-spacing:.14em;text-transform:uppercase;box-shadow:0 6px 16px rgba(22,32,46,.15);display:flex;gap:8px;align-items:center}
.tagp span:before{content:"";width:7px;height:7px;border-radius:50%%;background:var(--acc)}
.tagp i{width:1px;height:44px;background:var(--ink)}
.facts{display:flex;justify-content:center;gap:0;background:var(--deep);color:#E7ECEF;position:relative;z-index:3;margin-top:-1px}
.facts div{padding:26px 48px;border-right:1px solid rgba(255,255,255,.12);font-size:13px;color:#A9B4C0;text-align:left}.facts div:last-child{border:0}
.facts b{display:block;font:600 22px Fraunces;color:#fff}
section.blk{padding:80px 0;border-top:1px solid var(--line)}
.bh{display:flex;justify-content:space-between;align-items:end;margin-bottom:30px;gap:20px}.bh h2{font-size:44px}.bh p{color:var(--ink2);max-width:28em}
.tabs{display:flex;gap:4px;position:relative;z-index:2;margin-bottom:-1px}
.tabs span{padding:13px 22px 11px;border-radius:12px 12px 0 0;font:700 12px Karla;letter-spacing:.12em;text-transform:uppercase;color:var(--ink2);background:var(--paper2);border:1px solid var(--line);border-bottom:0}
.tabs span i{font:italic 400 20px Fraunces;letter-spacing:0;text-transform:none;margin-right:6px;color:var(--ink2)}
.tabs span.on{background:#F7F9F9;color:var(--ink)}.tabs span.on i{color:var(--acc)}
.folder{background:#F7F9F9;border:1px solid var(--line);border-radius:0 14px 14px 14px;padding:30px;box-shadow:0 10px 0 -4px var(--paper2),0 20px 0 -8px #CBD4DA}
.fhd{display:flex;justify-content:space-between;align-items:end;margin-bottom:22px;gap:20px}.fhd h3{font-size:30px}.fhd p{color:var(--ink2);max-width:30em;font-size:15px}
.fg{display:grid;grid-template-columns:1.35fr 1fr 1fr;gap:20px}
.fc .th{position:relative;aspect-ratio:16/11;overflow:hidden;border-radius:3px}.fc .th img{width:100%%;height:100%%;object-fit:cover}
.fc.big .th{aspect-ratio:16/12.2}
.fc .pl{position:absolute;left:14px;bottom:14px;width:44px;height:44px;border-radius:50%%;background:#fff;display:grid;place-items:center;color:var(--acc);font-size:15px}
.fc b{font:600 19px Fraunces;display:block;margin:12px 0 2px}.fc span{font-size:13px;color:var(--ink2)}
.tg{position:absolute;top:12px;left:12px;font:700 10px Karla;letter-spacing:.14em;text-transform:uppercase;padding:4px 8px;background:#fff;border-radius:3px;color:var(--ink)}
.tg.m{background:var(--acc);color:#fff}
.flink{margin-top:22px;font:600 14px Karla;color:var(--acc)}
.shelf .wrap{display:grid;grid-template-columns:1fr 1.35fr;gap:60px;align-items:center}
.shelf h2{font-size:44px}.shelf p{color:var(--ink2);margin:14px 0 24px;font-size:17px}
.covers{display:flex;gap:20px;justify-content:center;align-items:flex-end;border-bottom:2px solid var(--ink);padding-bottom:0}
.covers img{width:170px;box-shadow:8px 10px 0 rgba(22,32,46,.14)}.covers .c2{width:185px}
.capt{display:flex;gap:20px;justify-content:center;margin-top:10px;font:italic 14px Fraunces;color:var(--ink2)}.capt span{width:170px;text-align:center}
.mat .mg{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.mi{border-top:2px solid var(--ink);padding-top:14px}
.mi img{width:100%%;aspect-ratio:1;object-fit:cover;margin-bottom:12px}
.mi img.bw{filter:grayscale(1) contrast(1.5) brightness(1.15)}
.mi b{font:600 18px Fraunces;display:block}.mi span{font-size:13px;color:var(--ink2)}.mi .pr{display:block;margin-bottom:4px;font:700 12px Karla;letter-spacing:.1em;color:var(--acc);text-transform:uppercase}
.club{background:var(--deep);color:#fff;border:0}.club h2{color:#fff}
.club .wrap{display:grid;grid-template-columns:1.2fr 1fr;gap:56px;align-items:center}
.club h2{font-size:48px}.club p{opacity:.9;margin:14px 0 24px;font-size:17px}
.club .btn{background:var(--acc);color:#fff;border-color:var(--acc)}
.tier{display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.35);padding:14px 0;font:400 20px Fraunces}.tier small{font:14px Karla;opacity:.85}
.wait .wrap{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.wait h2{font-size:42px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.chips span{border:1.5px solid var(--ink);border-radius:999px;padding:7px 14px;font:500 14px Karla}.chips span.on{background:var(--ink);color:var(--paper)}
.f{display:flex;gap:8px}.f input{flex:1;padding:13px 18px;border-radius:999px;border:1.5px solid var(--ink);font:15px Karla;background:#fff}
.me .wrap{display:grid;grid-template-columns:300px 1fr 1fr;gap:50px;align-items:center}
.me img.ph{width:100%%;aspect-ratio:4/5;object-fit:cover;border-radius:150px 150px 4px 4px}
.me h2{font-size:36px}.me p{color:var(--ink2);margin:12px 0 18px}
.side{border-left:1px solid var(--line);padding-left:40px;display:grid;gap:26px}
.side .it{display:grid;grid-template-columns:86px 1fr;gap:16px;align-items:center}
.side img{width:86px;height:86px;object-fit:cover;border-radius:6px}.side b{font:600 19px Fraunces;display:block}.side span{font-size:14px;color:var(--ink2)}.side a{font:600 14px Karla;color:var(--acc)}
.ft{background:#0F1722}.ft .btn.pri{background:var(--acc);border-color:var(--acc)}
@media(max-width:700px){
 .hd .wrap{height:72px}.signin{display:none}.hero{padding:40px 0 0}.hero h1{font-size:46px}.pano{height:300px}.tagp{display:none}.facts{flex-wrap:wrap}.facts div{padding:16px 18px;flex:1 1 45%%}
 .shelf .wrap,.club .wrap,.wait .wrap,.me .wrap{grid-template-columns:1fr;gap:28px}
 .hero p.lead{font-size:17px;padding:0 6px}.ctas{padding:0 16px}.ctas .btn{flex:1;justify-content:center}
 section.blk{padding:48px 0}.bh{flex-direction:column;align-items:start}.bh h2,.shelf h2,.wait h2,.club h2{font-size:32px}
 .tabs{overflow:auto;margin:0 -16px -1px;padding:0 16px}.tabs span{white-space:nowrap;padding:11px 14px 9px;font-size:11px}
 .folder{padding:16px;border-radius:0 0 14px 14px}.fg{grid-template-columns:1fr}.fhd{flex-direction:column;align-items:start;gap:8px}
 .covers{gap:8px}.covers img,.covers .c2{width:31%%}.capt{gap:8px}.capt span{width:31%%;font-size:12px}
 .mat .mg{grid-template-columns:1fr 1fr;gap:14px}.mi b{font-size:15px}
 .side{border-left:0;padding-left:0;border-top:1px solid var(--line);padding-top:24px}.me img.ph{width:70%%}
 .f{flex-direction:column}
}
''' % (ACC, ACC, ACC, ACC)

HDR = '''<header class="hd"><div class="wrap">
  <a class="logo" href="#"><img src="img/logo-wc.png" alt=""><span>Pigeon Polly<small style="color:var(--ink2)">Art Lab · Riga</small></span></a>
  <nav class="nav"><a class="on">Lessons</a><a>Guides</a><a>Materials</a><a>Club</a><a>About</a></nav>
  <div class="hd-r"><span class="lang">EN · LV · RU</span><a class="door-btn">The Lab</a><a class="signin">Sign in</a><span class="burger">☰</span></div></div></header>'''

def fc(img, tag, m, t, s, big=False):
    return '<div class="fc%s"><div class="th"><img src="@%s"><span class="tg%s">%s</span><span class="pl">%s</span></div><b>%s</b><span>%s</span></div>' % (
        ' big' if big else '', img, ' m' if m else '', tag, '🔒' if m else '▶', t, s)

body = HDR + '''
<section class="hero"><div class="wrap"><span class="pill">Watercolour &amp; ink · free and full lessons</span>
<h1>Paint small, <em>joyful</em> things</h1>
<p class="lead">Short free lessons, full paint-alongs and creative guides by illustrator Alina Otkinska. In English with Latvian subtitles.</p>
<div class="ctas"><span class="btn pri">▶ Watch a free lesson</span><span class="btn">Browse the guides</span></div></div>
<div class="pano"><img src="img/hero-rooftops.jpg" alt="">
<div class="tagp" style="left:31%;top:70px"><span>Free lesson · this painting</span><i></i></div>
<div class="tagp" style="left:56%;top:120px"><span>Guides &amp; books</span><i></i></div></div>
<div class="facts"><div><b>Every Monday</b>a new free lesson</div><div><b>2 guides</b>on Amazon</div><div><b>EN · LV</b>subtitles</div><div><b>Studio Club</b>all paint-alongs</div></div></section>

<section class="blk"><div class="wrap">
<div class="bh"><div><div class="eyebrow">The studio archive</div><h2>Everything to learn, in four folders</h2></div><p>Start with a free lesson. Open the other folders when you’re ready.</p></div>
<div class="tabs"><span class="on"><i>01</i>Free lessons</span><span><i>02</i>Paint-alongs</span><span><i>03</i>Guides &amp; books</span><span><i>04</i>Materials</span></div>
<div class="folder"><div class="fhd"><h3>Free lessons</h3><p>Short lessons from YouTube that play right here. Three colours, one brush, ten minutes.</p></div>
<div class="fg">@FG</div><div class="flink">All free lessons →</div></div></div></section>

<section class="blk shelf"><div class="wrap">
<div><div class="eyebrow">Guides &amp; books</div><h2>Guides to keep on your desk</h2><p>Written, illustrated and designed by Alina. Clear steps and real sketchbook pages, no talent required.</p><span class="btn dark">Buy on Amazon</span> <span class="btn" style="border:0">Free colouring book →</span></div>
<div><div class="covers"><img src="@e-books/watercolor-sketches.jpg"><img class="c2" src="@e-books/ink-sketching.jpg"><img src="@e-books/urban-sketching-digital-traveler.jpg"></div>
<div class="capt"><span>Watercolor Sketches</span><span>Ink Sketching</span><span>Digital Traveler · soon</span></div></div></div></section>

<section class="blk mat"><div class="wrap">
<div class="bh"><div><div class="eyebrow">Materials</div><h2>Things to print &amp; paint</h2></div><span class="btn">All materials</span></div>
<div class="mg"><div class="mi"><img class="bw" src="@sketchbook/sketchbook-17-800.jpg"><span class="pr">Free</span><b>Line sketch: Persimmons</b><span>PDF to trace</span></div>
<div class="mi"><img src="@sketchbook/sketchbook-7-800.jpg"><span class="pr">Club</span><b>Reference pack: Riga</b><span>24 photos to paint from</span></div>
<div class="mi"><img class="bw" src="@cards/classic/13.jpg"><span class="pr">Free</span><b>Colouring page: Miss Peony</b><span>from Wobbleland</span></div>
<div class="mi"><img src="@sketchbook/sketchbook-21-800.jpg"><span class="pr">€4</span><b>Palette cards</b><span>print, cut, swatch</span></div></div></div></section>

<section class="blk club"><div class="wrap">
<div><div class="eyebrow" style="color:#fff;opacity:.8">Studio Club · on Patreon</div><h2>Paint along with me every week</h2><p>Every full paint-along, reference packs and line sketches, plus a vote on what we paint next.</p><span class="btn">Join the club</span></div>
<div><div class="tier"><span>Sketchbook friend</span><small>€5 / month</small></div><div class="tier"><span>Studio · all lessons</span><small>€12 / month</small></div><div class="tier" style="border:0;opacity:.7"><span>Feedback · soon</span><small>€30 / month</small></div></div></div></section>

<section class="blk wait"><div class="wrap">
<div><div class="eyebrow">Next lesson</div><h2>What should we paint next?</h2><p style="color:var(--ink2);margin-top:12px;font-size:17px">Vote for a topic and get the full lesson free when it comes out.</p></div>
<div><div class="chips"><span class="on">Cosy cafés</span><span>Botanicals</span><span>City sketching</span><span>Wobbly characters</span><span>Winter cards</span></div>
<div class="f"><input placeholder="Your email"><span class="btn pri">Vote &amp; get it free</span></div></div></div></section>

<section class="blk me"><div class="wrap"><img class="ph" src="@home/alina.jpg">
<div><div class="eyebrow">Hi, I’m Alina</div><h2>I teach the way I sketch: small and step by step</h2><p>Illustrator and learning experience designer. I once drew a pigeon called Polly, and she grew into a whole world.</p><span class="btn">My story</span></div>
<div class="side"><div class="it"><img src="@cards/classic/16.jpg"><div><b>Wobbleland</b><span>The world of my hand-painted characters.</span><br><a>Visit →</a></div></div>
<div class="it"><img src="@home/first-pigeon-polly.jpg"><div><b>The Lab</b><span>Hatch a bird, play games. The playful side.</span><br><a>Open the door →</a></div></div></div></div></section>

<footer class="ft"><div class="wrap"><div><h4>A free lesson every Monday</h4><p>One letter a week, nothing else.</p><input placeholder="Your email"><span class="btn pri">Subscribe</span></div>
<div><h4>Learn</h4><ul><li>Free lessons</li><li>Paint-alongs</li><li>Guides &amp; books</li><li>Materials</li></ul></div><div><h4>Explore</h4><ul><li>Wobbleland</li><li>Journal</li><li>Palettes</li><li>The Lab</li></ul></div>
<div><h4>Alina</h4><ul><li>About</li><li>Work with me</li><li>LinkedIn</li><li>Patreon</li></ul></div><div class="bot"><span>© 2026 Pigeon Polly Art Lab · Riga</span><span>EN · LV · RU</span></div></div></footer></body></html>'''

fg = fc('sketchbook/sketchbook-17-800.jpg', 'Free', 0, 'Persimmons in 10 minutes', '10 min · beginner', True) + \
     fc('sketchbook/sketchbook-21-800.jpg', 'Free', 0, 'My 5-colour palette', '4 min · tip') + \
     fc('sketchbook/sketchbook-14-800.jpg', 'Club', 1, 'Red wall, full version', '38 min · paint-along')
body = body.replace('@FG', fg).replace('src="@', 'src="' + I)
page('var-d', 'Variant D', css, body)
print('ok6')
