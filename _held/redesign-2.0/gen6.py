# Вариант E: тёмный архив — глубокая гамма, 1 акцент, блоки слоями (не часть сайта)
import random
from gen import page, I
random.seed(11)

def edge(n=46, d=3.0, side='top'):
    pts = []
    for i in range(n + 1):
        x = i * 100 / n
        pts.append('%.1f%% %.2f%%' % (x, random.uniform(0, d)))
    if side == 'top':
        return 'polygon(%s, 100%% 100%%, 0%% 100%%)' % ', '.join(pts)
    pts2 = ['%.1f%% %.2f%%' % (100 - i * 100 / 46, 100 - random.uniform(0, d)) for i in range(47)]
    return 'polygon(0%% 0%%, 100%% 0%%, %s)' % ', '.join(pts2)

CSS = '''
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&family=Karla:wght@400;500;700&family=Lora:wght@500;600&family=Caveat:wght@500;700&display=swap');
:root{--dk:#1B1E21;--dk2:#24292D;--dk3:#2F353A;--pp:#EAE1CF;--pp2:#DCD1BB;--sl:#7D8990;--sl2:#A9B2B6;--ink:#1B1E21;--ink2:#4F555A;--acc:#B0573A;--line:rgba(234,225,207,.16)}
html,body{background:var(--dk);color:var(--pp);overflow-x:hidden}
body{background-image:radial-gradient(rgba(234,225,207,.035) 1px,transparent 1px);background-size:4px 4px}
h1,h2,h3{font-family:Fraunces,Lora,serif;font-weight:400;color:inherit}
.wrap{max-width:1280px}
.k{font:700 11px Karla;letter-spacing:.24em;text-transform:uppercase;color:var(--sl2)}
.k.a{color:var(--acc)}
.btn{border-color:var(--pp);color:var(--pp)}.btn.pri{background:var(--acc);border-color:var(--acc);color:#fff}
.btn.ink{border-color:var(--ink);color:var(--ink)}
.hand{font:700 26px Caveat;color:var(--acc)}
/* header */
.top{position:relative;z-index:5}.top .wrap{display:flex;align-items:center;height:110px;gap:30px}
.lg{display:flex;align-items:center;gap:12px;font:400 24px Fraunces}.lg img{width:46px;height:46px;border-radius:50%;box-shadow:0 0 0 1px var(--pp)}
.lg small{display:block;font:700 10px Karla;letter-spacing:.24em;text-transform:uppercase;color:var(--sl2)}
.nv{display:flex;gap:44px;margin:0 auto;font:700 12px Karla;letter-spacing:.22em;text-transform:uppercase;color:var(--pp2)}.nv .on{color:var(--pp);border-bottom:1px solid var(--acc);padding-bottom:4px}
.tr{display:flex;gap:14px;align-items:center;font-size:13px;color:var(--sl2)}.tr .btn{padding:12px 24px}
/* hero */
.hero{position:relative;padding:30px 0 0}
.hero .wrap{display:grid;grid-template-columns:1fr 470px 1fr;gap:0;align-items:end;min-height:690px;position:relative}
.vt{position:absolute;left:0;top:40px;writing-mode:vertical-rl;transform:rotate(180deg);font:700 11px Karla;letter-spacing:.3em;text-transform:uppercase;color:var(--sl)}
.arch{grid-column:2;height:660px;border-radius:235px 235px 0 0;overflow:hidden;position:relative;box-shadow:0 0 0 1px var(--line),0 0 0 14px var(--dk),0 0 0 15px var(--line)}
.arch img{width:100%;height:100%;object-fit:cover;filter:saturate(.85) contrast(1.05)}
.arch:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 55%,rgba(27,30,33,.75))}
.hero h1{text-shadow:0 2px 40px rgba(0,0,0,.55);position:absolute;left:0;right:0;top:150px;text-align:center;font:300 128px/.9 Fraunces;letter-spacing:-.035em;z-index:3;pointer-events:none;mix-blend-mode:normal}
.hero h1 em{font-style:italic;color:var(--pp)}
.hero h1 .s{display:block;padding-left:380px}
.hl{grid-column:1;align-self:center;padding-right:40px;padding-top:280px}
.hl p{color:var(--sl2);font-size:17px;max-width:22em;margin-bottom:24px}
.hr{grid-column:3;align-self:end;padding-left:40px;padding-bottom:40px;position:relative}
.note{background:var(--pp);color:var(--ink);padding:22px 24px 26px;transform:rotate(3deg);box-shadow:0 20px 40px rgba(0,0,0,.45);clip-path:CLIP_TOP;max-width:280px}
.note b{font:400 24px/1.1 Fraunces;display:block;margin:8px 0 10px}.note span{font-size:13px;color:var(--ink2)}
.note .pl{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--acc);color:#fff;margin-top:14px;font-size:14px}
.tape{position:absolute;width:100px;height:26px;background:rgba(234,225,207,.35);transform:rotate(-8deg);top:-12px;left:110px;z-index:2}
.stat{display:flex;gap:30px;margin-top:40px;color:var(--sl2);font-size:12px}.stat b{display:block;font:300 34px Fraunces;color:var(--pp)}
/* archive folders */
.arc{padding:150px 0 120px;position:relative}
.arc .hd2{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:end;margin-bottom:46px}
.arc h2{font-size:64px;line-height:1}.arc h2 em{color:var(--acc)}
.arc .hd2 p{color:var(--sl2);max-width:26em;justify-self:end}
.fold{display:flex;gap:10px;height:560px}
.fo{flex:0 0 96px;border-radius:14px 14px 4px 4px;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:22px 0}
.fo .n{font:italic 300 26px Fraunces}
.fo .lb{writing-mode:vertical-rl;transform:rotate(180deg);font:700 12px Karla;letter-spacing:.3em;text-transform:uppercase;margin-top:auto}
.fo.c1{background:var(--dk3);color:var(--pp)}.fo.c2{background:var(--sl);color:var(--dk)}.fo.c3{background:var(--pp2);color:var(--dk)}.fo.c4{background:var(--acc);color:#fff}
.fo.open{flex:1;background:var(--pp);color:var(--ink);align-items:stretch;padding:34px 36px;border-radius:14px 14px 4px 4px}
.fo.open:before{content:"";position:absolute;top:0;left:0;width:200px;height:10px;background:var(--acc)}
.oh{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:24px}.oh h3{font-size:40px}.oh .n{color:var(--acc)}
.og{display:grid;grid-template-columns:1.25fr 1fr;grid-template-rows:1fr 1fr;gap:18px;flex:1;min-height:0}
.lv{position:relative;overflow:hidden;border-radius:3px}.lv img{width:100%;height:100%;object-fit:cover}
.lv.big{grid-row:1/3}
.lv .cap{position:absolute;left:0;right:0;bottom:0;padding:40px 18px 16px;background:linear-gradient(transparent,rgba(27,30,33,.85));color:var(--pp)}
.lv .cap b{font:400 22px Fraunces;display:block}.lv .cap span{font-size:12px;color:var(--sl2)}
.lv .pl{position:absolute;top:16px;right:16px;width:46px;height:46px;border-radius:50%;background:var(--pp);color:var(--acc);display:grid;place-items:center}
.lv .tg{position:absolute;top:16px;left:16px;font:700 10px Karla;letter-spacing:.16em;text-transform:uppercase;background:var(--pp);color:var(--ink);padding:5px 9px}
.lv .tg.m{background:var(--acc);color:#fff}
/* desk: guides on paper */
.desk{position:relative;background:var(--pp);color:var(--ink);clip-path:CLIP_TOP;padding:130px 0 130px;margin-top:-40px}
.desk:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:60px;background:var(--dk);clip-path:CLIP_TOP}
.desk .wrap{display:grid;grid-template-columns:.9fr 1.3fr;gap:70px;align-items:center}
.desk h2{font-size:60px;line-height:1}.desk h2 em{color:var(--acc)}
.desk p{color:var(--ink2);font-size:17px;margin:18px 0 26px;max-width:26em}
.dc{font:400 88px/.8 Fraunces;float:left;margin:6px 10px 0 0;color:var(--acc)}
.books{position:relative;height:470px}
.books img{position:absolute;width:230px;box-shadow:14px 20px 30px rgba(27,30,33,.3)}
.books .b1{left:0;top:60px;transform:rotate(-7deg)}.books .b2{left:200px;top:0;transform:rotate(2deg);z-index:2}.books .b3{left:410px;top:70px;transform:rotate(8deg)}
.books .lbl{position:absolute;z-index:3;background:var(--dk);color:var(--pp);font:700 10px Karla;letter-spacing:.2em;text-transform:uppercase;padding:7px 12px}
.books .hand{position:absolute;left:250px;bottom:0;transform:rotate(-4deg)}
/* materials: pinned on dark */
.mat{padding:120px 0}
.mat .hd2{display:flex;justify-content:space-between;align-items:end;margin-bottom:50px}.mat h2{font-size:56px;line-height:1}
.pins{display:grid;grid-template-columns:repeat(4,1fr);gap:34px}
.pin{background:var(--pp);color:var(--ink);padding:12px 12px 18px;position:relative;box-shadow:0 18px 30px rgba(0,0,0,.4)}
.pin:nth-child(1){transform:rotate(-2.5deg)}.pin:nth-child(2){transform:rotate(1.5deg) translateY(30px)}.pin:nth-child(3){transform:rotate(-1deg)}.pin:nth-child(4){transform:rotate(2.5deg) translateY(24px)}
.pin img{width:100%;aspect-ratio:1;object-fit:cover}.pin img.bw{filter:grayscale(1) contrast(1.4) brightness(1.1)}
.pin .t{position:absolute;top:-12px;left:50%;width:84px;height:24px;margin-left:-42px;background:rgba(234,225,207,.55)}
.pin b{font:400 19px Fraunces;display:block;margin-top:12px}.pin span{font-size:12px;color:var(--ink2)}
.pin .pr{position:absolute;right:12px;bottom:16px;font:700 10px Karla;letter-spacing:.16em;text-transform:uppercase;color:var(--acc)}
/* club ticket over photo */
.club{position:relative;padding:60px 0 140px}
.club .wrap{position:relative;height:520px}
.club .ph{position:absolute;left:0;top:0;width:62%;height:100%;overflow:hidden;border-radius:4px}
.club .ph img{width:100%;height:100%;object-fit:cover;filter:brightness(.55) saturate(.8)}
.club .ph .k{position:absolute;left:30px;top:30px}
.club .ph h2{position:absolute;left:30px;bottom:30px;font:300 72px/.95 Fraunces;color:var(--pp);max-width:7em}.club .ph h2 em{color:var(--pp2)}
.tk{position:absolute;right:0;top:60px;width:44%;background:var(--pp);color:var(--ink);padding:36px 40px;box-shadow:0 30px 60px rgba(0,0,0,.5);
 -webkit-mask:radial-gradient(circle 14px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 14px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat;
 mask:radial-gradient(circle 14px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 14px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat}
.tk .row{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px dashed rgba(27,30,33,.3);padding:16px 0;font:400 22px Fraunces}.tk .row small{font:500 14px Karla;color:var(--ink2)}
.tk .row.off{opacity:.5}
.tk p{color:var(--ink2);font-size:15px;margin:6px 90px 10px 0}
.tk .btn{margin-top:22px}
.stamp{position:absolute;right:24px;top:18px;width:110px;height:110px;border-radius:50%;border:2px solid var(--acc);color:var(--acc);display:grid;place-items:center;text-align:center;font:700 10px/1.4 Karla;letter-spacing:.16em;transform:rotate(12deg);background:var(--pp)}
/* about: arch + column */
.ab{padding:40px 0 140px}
.ab .wrap{display:grid;grid-template-columns:380px 1fr 300px;gap:60px;align-items:center}
.ab .ar{height:480px;border-radius:190px 190px 0 0;overflow:hidden}.ab .ar img{width:100%;height:100%;object-fit:cover}
.ab h2{font-size:54px;line-height:1}.ab h2 em{color:var(--acc)}
.ab p{color:var(--sl2);font-size:17px;margin:18px 0 24px}
.vote{background:var(--dk2);border:1px solid var(--line);padding:28px;border-radius:4px}
.vote h3{font-size:26px;margin:8px 0 14px}
.ch{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.ch span{border:1px solid var(--sl);border-radius:999px;padding:6px 12px;font-size:13px;color:var(--pp2)}.ch span.on{background:var(--pp);color:var(--ink);border-color:var(--pp)}
.vote input{width:100%;padding:12px 16px;border-radius:999px;border:1px solid var(--sl);background:transparent;color:var(--pp);font:14px Karla;margin-bottom:10px}
.vote .btn{width:100%;justify-content:center}
.side2{display:flex;gap:30px;margin-top:30px}.side2 a{display:flex;gap:12px;align-items:center;font:400 18px Fraunces}.side2 img{width:56px;height:56px;border-radius:50%;object-fit:cover}.side2 small{display:block;font:500 12px Karla;color:var(--sl2)}
/* footer */
.fz{border-top:1px solid var(--line);padding:70px 0 30px}
.fz .big{font:300 150px/.85 Fraunces;letter-spacing:-.04em;color:var(--dk3);margin-bottom:40px}.fz .big em{color:var(--acc)}
.fz .cols{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:30px;font-size:14px;color:var(--sl2);line-height:2}
.fz h4{font:400 18px Fraunces;color:var(--pp);margin-bottom:8px}
.fz input{width:100%;padding:13px 18px;border-radius:999px;border:1px solid var(--sl);background:transparent;color:var(--pp);margin:8px 0 12px}
.fz .bt{display:flex;justify-content:space-between;border-top:1px solid var(--line);margin-top:40px;padding-top:18px;font-size:12px;color:var(--sl)}
@media(max-width:700px){
 .top .wrap{height:74px}.nv,.tr .lang,.tr .btn{display:none}.tr:after{content:"☰";font-size:26px;color:var(--pp)}
 .hero .wrap{grid-template-columns:1fr;min-height:0}.vt{display:none}
 .hero h1{position:relative;top:0;font-size:56px;text-align:left;margin-bottom:24px}.hero h1 .s{padding-left:40px}
 .arch{grid-column:1;height:420px;border-radius:180px 180px 0 0;margin:0 10px}
 .hl{grid-column:1;padding:30px 0 0;order:3}.hr{grid-column:1;padding:0;margin-top:-90px;order:2;justify-self:end;margin-right:6px}.note{max-width:230px}
 .stat{gap:18px}.stat b{font-size:26px}
 .arc{padding:80px 0 70px}.arc .hd2{grid-template-columns:1fr}.arc .hd2 p{justify-self:start}.arc h2,.desk h2,.mat h2,.ab h2{font-size:40px}
 .fold{flex-direction:column;height:auto;gap:6px}.fo{flex:0 0 auto;flex-direction:row;padding:16px 20px;border-radius:12px 12px 4px 4px;gap:14px}.fo .lb{writing-mode:horizontal-tb;transform:none;margin:0}
 .fo.open{padding:22px 18px;flex-direction:column}.oh h3{font-size:30px}.og{grid-template-columns:1fr;grid-template-rows:none}.lv{height:200px}.lv.big{grid-row:auto;height:260px}
 .desk{padding:80px 0}.desk .wrap{grid-template-columns:1fr;gap:20px}.books{height:300px}.books img{width:140px}.books .b2{left:110px}.books .b3{left:220px}.books .hand{left:120px}.books .lbl{display:none}
 .mat{padding:70px 0}.mat .hd2{flex-direction:column;align-items:start;gap:16px}.pins{grid-template-columns:1fr 1fr;gap:20px}
 .club{padding:20px 0 80px}.club .wrap{height:auto}.club .ph{position:relative;width:100%;height:340px}.club .ph h2{font-size:44px}
 .tk{position:relative;width:auto;top:-40px;margin:0 10px;padding:28px 24px}.stamp{width:80px;height:80px;font-size:8px;right:14px;top:-26px}
 .ab{padding:0 0 70px}.ab .wrap{grid-template-columns:1fr;gap:28px}.ab .ar{height:360px;width:80%}.side2{flex-direction:column;gap:14px}
 .fz .big{font-size:64px}.fz .cols{grid-template-columns:1fr 1fr}.fz .cols>div:first-child{grid-column:1/-1}
}
'''.replace('CLIP_TOP', edge())

def lv(img, tag, m, t, s, big=False):
    return '<div class="lv%s"><img src="@%s"><span class="tg%s">%s</span><span class="pl">%s</span><div class="cap"><b>%s</b><span>%s</span></div></div>' % (
        ' big' if big else '', img, ' m' if m else '', tag, '🔒' if m else '▶', t, s)

B = '''<header class="top"><div class="wrap"><span class="lg"><img src="img/logo-wc.png"><span>Pigeon Polly<small>Art Lab · Riga</small></span></span>
<nav class="nv"><span class="on">Lessons</span><span>Guides</span><span>Materials</span><span>Club</span><span>About</span></nav>
<div class="tr"><span class="lang">EN · LV · RU</span><span>🚪 The Lab</span><span class="btn">Sign in</span></div></div></header>

<section class="hero"><div class="wrap"><span class="vt">Pigeon Polly Art Lab — Riga — watercolour &amp; ink</span>
<h1>Paint small,<span class="s"><em>joyful</em> things</span></h1>
<div class="hl"><span class="k a">Watercolour &amp; ink lessons</span><p style="margin-top:14px">Free short lessons, full paint-alongs and creative guides by illustrator Alina Otkinska. In English with Latvian subtitles.</p>
<span class="btn pri">▶ Watch a free lesson</span>
<div class="stat"><div><b>Mon</b>new free lesson</div><div><b>2</b>guides on Amazon</div><div><b>EN·LV</b>subtitles</div></div></div>
<div class="arch"><img src="@sketchbook/sketchbook-15.jpg"></div>
<div class="hr"><span class="tape"></span><div class="note"><span class="k a">This week · free</span><b>Persimmons on a blue plate</b><span>10 min · three colours, one brush</span><br><span class="pl">▶</span></div></div></div></section>

<section class="arc"><div class="wrap"><div class="hd2"><div><span class="k a">The studio archive</span><h2 style="margin-top:14px">Everything to learn, <em>filed in folders</em></h2></div><p>Start with the open folder. The others hold full paint-alongs, guides and things to print.</p></div>
<div class="fold"><div class="fo open"><div class="oh"><h3>Free lessons</h3><span class="n">№ 01</span></div><div class="og">@LV</div></div>
<div class="fo c1"><span class="n">02</span><span class="lb">Paint-alongs</span></div><div class="fo c2"><span class="n">03</span><span class="lb">Guides &amp; books</span></div><div class="fo c3"><span class="n">04</span><span class="lb">Materials</span></div><div class="fo c4"><span class="n">05</span><span class="lb">Studio Club</span></div></div></div></section>

<section class="desk"><div class="wrap"><div><span class="k a">Guides &amp; books</span><h2 style="margin-top:14px">Guides to keep <em>on your desk</em></h2>
<p><span class="dc">W</span>ritten, illustrated and designed by Alina. Clear steps and real sketchbook pages, from the first line to a finished little painting. No talent required, just a brush.</p>
<span class="btn ink">Buy on Amazon</span> <span class="btn ink" style="border:0">Free colouring book →</span></div>
<div class="books"><img class="b1" src="@e-books/watercolor-sketches.jpg"><img class="b2" src="@e-books/ink-sketching.jpg"><img class="b3" src="@e-books/urban-sketching-digital-traveler.jpg">
<span class="lbl" style="left:30px;top:30px;transform:rotate(-7deg)">Plate I</span><span class="lbl" style="left:240px;top:-12px">Plate II</span><span class="lbl" style="left:470px;top:50px;transform:rotate(8deg)">Soon</span><span class="hand">start with this one ↑</span></div></div></section>

<section class="mat"><div class="wrap"><div class="hd2"><div><span class="k a">Materials</span><h2 style="margin-top:14px">Things to print &amp; paint</h2></div><span class="btn">All materials</span></div>
<div class="pins"><div class="pin"><span class="t"></span><img class="bw" src="@sketchbook/sketchbook-17-800.jpg"><b>Line sketch: Persimmons</b><span>PDF to trace</span><span class="pr">Free</span></div>
<div class="pin"><span class="t"></span><img src="@sketchbook/sketchbook-7-800.jpg"><b>Reference pack: Riga</b><span>24 photos</span><span class="pr">Club</span></div>
<div class="pin"><span class="t"></span><img class="bw" src="@cards/classic/13.jpg"><b>Colouring: Miss Peony</b><span>from Wobbleland</span><span class="pr">Free</span></div>
<div class="pin"><span class="t"></span><img src="@sketchbook/sketchbook-21-800.jpg"><b>Palette cards</b><span>print, cut, swatch</span><span class="pr">€4</span></div></div></div></section>

<section class="club"><div class="wrap"><div class="ph"><img src="@sketchbook/sketchbook-5.jpg"><span class="k">Studio Club · on Patreon</span><h2>Paint along <em>every week</em></h2></div>
<div class="tk"><div class="stamp">ADMIT<br>ONE<br>✦ CLUB ✦</div><span class="k a">Membership</span><p>All full paint-alongs, reference packs and line sketches, plus a vote on what we paint next.</p>
<div class="row"><span>Sketchbook friend</span><small>€5 / month</small></div><div class="row"><span>Studio · all lessons</span><small>€12 / month</small></div><div class="row off"><span>Feedback · soon</span><small>€30 / month</small></div>
<span class="btn pri">Join the club</span></div></div></section>

<section class="ab"><div class="wrap"><div class="ar"><img src="@home/alina.jpg"></div>
<div><span class="k a">Hi, I’m Alina</span><h2 style="margin-top:14px">I teach the way I sketch: <em>small, kind, step by step</em></h2><p>Illustrator and learning experience designer from Riga. I once drew a pigeon called Polly, and she grew into a whole world.</p><span class="btn">My story</span>
<div class="side2"><a><img src="@cards/classic/16.jpg"><span>Wobbleland<small>my painted characters</small></span></a><a><img src="@home/first-pigeon-polly.jpg"><span>The Lab<small>birds &amp; games</small></span></a></div></div>
<div class="vote"><span class="k a">Next lesson</span><h3>What should we paint next?</h3><div class="ch"><span class="on">Cosy cafés</span><span>Botanicals</span><span>City</span><span>Characters</span><span>Winter cards</span></div><input placeholder="Your email"><span class="btn pri">Vote &amp; get it free</span></div></div></section>

<footer class="fz"><div class="wrap"><div class="big">Pigeon Polly <em>Art Lab</em></div><div class="cols">
<div><h4>A free lesson every Monday</h4>One letter a week, nothing else.<input placeholder="Your email"><span class="btn pri">Subscribe</span></div>
<div><h4>Learn</h4>Free lessons<br>Paint-alongs<br>Guides &amp; books<br>Materials</div><div><h4>Explore</h4>Wobbleland<br>Journal<br>Palettes<br>The Lab</div><div><h4>Alina</h4>About<br>Work with me<br>LinkedIn<br>Patreon</div></div>
<div class="bt"><span>© 2026 Pigeon Polly Art Lab · Riga</span><span>EN · LV · RU</span></div></div></footer></body></html>'''

lvs = lv('sketchbook/sketchbook-17-800.jpg', 'Free', 0, 'Persimmons in 10 minutes', '10 min · beginner', True) + \
      lv('sketchbook/sketchbook-21-800.jpg', 'Free', 0, 'My 5-colour palette', '4 min · tip') + \
      lv('sketchbook/sketchbook-14-800.jpg', 'Club', 1, 'Red wall, full version', '38 min · paint-along')
B = B.replace('@LV', lvs).replace('src="@', 'src="' + I)
page('var-e', 'Variant E', CSS, B)
print('ok7')
