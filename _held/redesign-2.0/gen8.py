# Вариант G «Свеча на болоте»: одна сцена — ночной стол мастерской (не часть сайта)
import math, random
from urllib.parse import quote
I = '../../site/images/'
random.seed(5)

def blob(n=14, r=0.42, j=0.07, w=200, h=200):
    pts = []
    for k in range(n):
        a = 2 * math.pi * k / n
        rr = r + random.uniform(-j, j)
        pts.append((w / 2 + math.cos(a) * rr * w, h / 2 + math.sin(a) * rr * h))
    d = 'M%.1f,%.1f ' % pts[0]
    for k in range(n):
        p0 = pts[k]; p1 = pts[(k + 1) % n]
        mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
        d += 'Q%.1f,%.1f %.1f,%.1f ' % (p0[0], p0[1], mx, my)
    svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 %d %d' preserveAspectRatio='none'><path d='%sZ' fill='black'/></svg>" % (w, h, d)
    return "url('data:image/svg+xml;utf8,%s')" % quote(svg)

NOISE = 'url("data:image/svg+xml;utf8,%s")' % quote("<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>")
FOG = 'url("data:image/svg+xml;utf8,%s")' % quote("<svg xmlns='http://www.w3.org/2000/svg' width='900' height='500'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.004 .012' numOctaves='4' seed='3'/><feColorMatrix values='0 0 0 0 .62  0 0 0 0 .68  0 0 0 0 .62  0 0 0 .5 -.12'/></filter><rect width='100%' height='100%' filter='url(#f)'/></svg>")

def stain(col, seed, op=.5):
    s = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='.035' numOctaves='3' seed='%d'/><feDisplacementMap in='SourceGraphic' scale='46'/><feGaussianBlur stdDeviation='1.2'/></filter>"
         "<g filter='url(#s)' fill='%s' fill-opacity='%s'><circle cx='100' cy='100' r='58'/><circle cx='150' cy='70' r='14'/><circle cx='48' cy='150' r='9'/></g></svg>") % (seed, col, op)
    return 'url("data:image/svg+xml;utf8,%s")' % quote(s)

def rag():
    pts=[]
    n=40
    for i in range(n+1): pts.append((i*100/n, random.uniform(0,3.5)))
    for i in range(1,n): pts.append((100-random.uniform(0,2.2), i*100/n))
    for i in range(n+1): pts.append((100-i*100/n, 100-random.uniform(0,3.5)))
    for i in range(1,n): pts.append((random.uniform(0,2.2), 100-i*100/n))
    return 'polygon(' + ', '.join('%.1f%% %.1f%%' % p for p in pts) + ')'
RAG = rag()
B1, B2, B3, B4, B5 = blob(), blob(16, .44, .05), blob(12, .43, .08), blob(24, .5, .025), blob(15, .44, .06)

CSS = '''
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Special+Elite&family=Caveat:wght@500;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--bog:#0F1614;--bog2:#17211D;--peat:#2A2018;--paper:#E6D8BB;--paper2:#D4C09A;--ink:#2A2118;--ink2:#5C4E3D;--txt:#D9CDB3;--fog:#8E998F;--candle:242,184,103;--berry:#E0612F}
html,body{overflow-x:hidden}
body{background:var(--bog);color:var(--txt);font:19px/1.55 'EB Garamond',serif;position:relative}
body:before{content:"";position:fixed;inset:0;background:NOISE;opacity:.16;mix-blend-mode:overlay;pointer-events:none;z-index:50}
.scene{position:relative;overflow:hidden;background:
 radial-gradient(1100px 700px at 72% 6%,rgba(var(--candle),.20),transparent 60%),
 radial-gradient(900px 600px at 12% 30%,rgba(60,90,80,.25),transparent 70%),
 radial-gradient(1000px 800px at 85% 52%,rgba(var(--candle),.12),transparent 65%),
 radial-gradient(900px 700px at 20% 78%,rgba(var(--candle),.10),transparent 65%),
 linear-gradient(180deg,#0F1614 0%,#141E1A 30%,#1A1813 60%,#120F0C 100%)}
.fog{position:absolute;left:0;right:0;height:620px;background:FOG;background-size:100% 100%;opacity:.5;pointer-events:none;mix-blend-mode:screen;-webkit-mask-image:radial-gradient(60% 50% at 50% 50%,#000 30%,transparent 75%);mask-image:radial-gradient(60% 50% at 50% 50%,#000 30%,transparent 75%)}
.glow{position:fixed;width:700px;height:700px;border-radius:50%;background:radial-gradient(rgba(var(--candle),.16),transparent 65%);pointer-events:none;transform:translate(-50%,-50%);z-index:40;mix-blend-mode:screen;left:70%;top:20%}
.st{position:absolute;pointer-events:none;background-size:contain;background-repeat:no-repeat}
.w{max-width:1320px;margin:0 auto;padding:0 50px;position:relative}
.tw{font:13px 'Special Elite',monospace;letter-spacing:.06em}
.hand{font:700 28px Caveat;color:var(--paper2)}
h1,h2,h3{font-family:'IM Fell English',serif;font-weight:400;line-height:.95}
em{font-style:italic}
.berry{color:var(--berry)}
/* header */
.hd{display:flex;align-items:center;gap:40px;padding:34px 0;position:relative;z-index:5}
.wm{font:30px 'IM Fell English';letter-spacing:.01em;color:var(--paper)}.wm i{color:var(--berry)}
.wm small{display:block;font:11px 'Special Elite';letter-spacing:.3em;color:var(--fog);margin-top:4px}
.nv{margin-left:auto;display:flex;gap:40px}.nv span{font:13px 'Special Elite';letter-spacing:.14em;color:var(--txt);text-transform:lowercase}
.nv span:before{content:"№ ";color:var(--fog)}
.sg{font:13px 'Special Elite';border-bottom:1px dashed var(--txt);padding-bottom:2px}
/* hero */
.hero{position:relative;height:880px}
.hero h1{position:absolute;left:0;top:120px;font-size:132px;color:var(--paper);z-index:3;letter-spacing:-.02em;text-shadow:0 0 60px rgba(var(--candle),.25)}
.hero h1 .l2{display:block;padding-left:150px;font-style:italic}
.hero h1 .l3{display:block;font-size:96px;padding-left:40px;color:var(--berry);font-style:italic}
.win{position:absolute;right:0;top:0;width:470px;height:720px}
.win .fr{position:absolute;inset:0;border-radius:235px 235px 0 0;border:1px solid rgba(var(--candle),.35);transform:translate(16px,16px)}
.win .im{position:absolute;inset:0;border-radius:235px 235px 0 0;overflow:hidden;box-shadow:0 0 120px rgba(var(--candle),.22),0 40px 80px rgba(0,0,0,.6)}
.win .im img{width:100%;height:100%;object-fit:cover;filter:saturate(1.1) contrast(1.05)}
.win .im:after{content:"";position:absolute;inset:0;background:radial-gradient(70% 60% at 50% 40%,transparent 40%,rgba(15,22,20,.65))}
.hero .lead{position:absolute;left:40px;top:560px;max-width:430px;font-size:21px;color:var(--txt)}
.seal{position:absolute;left:40px;top:700px;display:flex;align-items:center;gap:20px;z-index:4}
.wax{width:118px;height:118px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F07A45,#C2421E 55%,#7E2410);display:grid;place-items:center;color:#FBE3C8;font:15px/1.1 'IM Fell English SC';text-align:center;box-shadow:0 10px 26px rgba(0,0,0,.55),inset 0 -6px 12px rgba(0,0,0,.3),0 0 40px rgba(224,97,47,.35);
 -webkit-mask:BLOBW;mask:BLOBW;-webkit-mask-size:100% 100%;mask-size:100% 100%}
.wax b{display:block;font-size:26px}
.seal .hand{transform:rotate(-6deg)}
.candle{position:absolute;right:530px;top:470px;width:16px;height:120px;background:linear-gradient(90deg,#CDBB97,#EFE3C8 40%,#BFAA82);border-radius:3px;z-index:2}
.candle:before{content:"";position:absolute;left:3px;top:-34px;width:10px;height:30px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:radial-gradient(circle at 50% 70%,#FFF6D8,#FFC861 45%,rgba(255,140,40,0) 72%);filter:blur(.4px)}
.candle:after{content:"";position:absolute;left:-150px;top:-190px;width:316px;height:316px;border-radius:50%;background:radial-gradient(rgba(var(--candle),.35),transparent 65%)}
/* dossier */
.case{position:relative;padding:60px 0 160px}
.ttl{display:flex;align-items:flex-end;gap:30px;margin-bottom:60px}
.ttl h2{font-size:96px;color:var(--paper)}.ttl h2 em{color:var(--berry)}
.ttl p{max-width:340px;color:var(--fog);font-size:18px;padding-bottom:14px}
.folder{position:relative;width:1080px;margin-left:60px;height:640px;transform:rotate(-1.5deg)}
.folder .back{position:absolute;inset:0;background:#B99A66;border-radius:6px 22px 6px 6px;box-shadow:0 40px 80px rgba(0,0,0,.55)}
.folder .tabs{position:absolute;top:-38px;left:30px;display:flex;gap:6px}
.folder .tabs span{font:12px 'Special Elite';letter-spacing:.1em;padding:11px 18px 14px;border-radius:10px 10px 0 0;background:#A88957;color:#3A2C1C}
.folder .tabs span.on{background:var(--paper);color:var(--ink)}
.folder .sheet{position:absolute;left:24px;top:22px;right:24px;bottom:22px;background:#EADFC6;background-image:radial-gradient(circle at 80% 90%,rgba(120,80,30,.18),transparent 40%),radial-gradient(circle at 10% 10%,rgba(120,80,30,.15),transparent 35%);padding:40px 50px;color:var(--ink)}
.sheet .hdr{display:flex;justify-content:space-between;border-bottom:1px solid rgba(42,33,24,.3);padding-bottom:12px;margin-bottom:26px}
.sheet .hdr b{font:36px 'IM Fell English'}.sheet .hdr span{font:13px 'Special Elite';color:var(--ink2)}
.ev{position:absolute;background:#F4ECDC;padding:10px 10px 40px;box-shadow:0 12px 24px rgba(42,33,24,.35)}
.ev img{width:100%;height:100%;object-fit:cover;display:block}
.ev .cp{position:absolute;left:12px;bottom:10px;font:13px 'Special Elite';color:var(--ink)}
.ev .clip{position:absolute;top:-18px;left:30px;width:22px;height:56px;border:3px solid #8C8C88;border-radius:12px;border-bottom-color:transparent}
.ev .pl{position:absolute;right:16px;bottom:52px;width:52px;height:52px;border-radius:50%;background:rgba(244,236,220,.92);display:grid;place-items:center;color:var(--berry);font-size:18px}
.e1{left:50px;top:110px;width:400px;height:330px;transform:rotate(-3deg)}
.e2{left:500px;top:120px;width:270px;height:230px;transform:rotate(2.5deg)}
.e3{left:800px;top:150px;width:230px;height:250px;transform:rotate(-2deg)}
.stamp{position:absolute;z-index:4;font:22px 'IM Fell English SC';color:#A3311B;border:3px double #A3311B;padding:6px 14px;transform:rotate(-14deg);opacity:.85;letter-spacing:.08em}
.note2{position:absolute;font:700 25px Caveat;color:#7A2E18}
.typed{position:absolute;left:520px;top:400px;width:470px;font:15px/1.7 'Special Elite';color:var(--ink)}
.typed b{font-weight:400;background:rgba(224,97,47,.18);padding:0 4px}
.string{position:absolute;pointer-events:none;z-index:3}
/* shelf */
.shelf{position:relative;padding:40px 0 180px}
.shelf .w{display:grid;grid-template-columns:420px 1fr;gap:60px;align-items:end}
.shelf h2{font-size:84px;color:var(--paper)}.shelf h2 em{color:var(--berry);display:block}
.shelf p{color:var(--txt);margin:20px 0 30px}
.lnk{font:14px 'Special Elite';letter-spacing:.08em;color:var(--paper);border-bottom:1px solid var(--berry);padding-bottom:3px;margin-right:26px}
.books{position:relative;height:520px}
.books .board{position:absolute;left:-40px;right:-60px;bottom:0;height:26px;background:linear-gradient(#4A3624,#2A1E14);box-shadow:0 20px 40px rgba(0,0,0,.6)}
.books img{position:absolute;bottom:26px;width:250px;box-shadow:-12px 0 30px rgba(0,0,0,.5),inset 0 0 0 1px rgba(0,0,0,.2);filter:sepia(.18) brightness(.92)}
.books .b1{left:20px;transform:rotate(-4deg);transform-origin:bottom left}.books .b2{left:280px}.books .b3{left:545px;transform:rotate(5deg);transform-origin:bottom right}
.books .rib{position:absolute;bottom:-40px;width:12px;height:120px;background:var(--berry);clip-path:polygon(0 0,100% 0,100% 100%,50% 88%,0 100%)}
.books .lbl{position:absolute;font:12px 'Special Elite';color:var(--paper);letter-spacing:.1em}
/* rag: materials */
.rag{position:relative;padding:60px 0 170px}
.cloth{position:relative;margin:0 auto;width:1180px;height:600px;background:#DCD0B6;background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.035) 0 2px,transparent 2px 5px),repeating-linear-gradient(0deg,rgba(0,0,0,.03) 0 2px,transparent 2px 6px);
 clip-path:RAGP;transform:rotate(1deg);box-shadow:0 0 0 1px transparent}
.cloth h2{position:absolute;left:110px;top:80px;font-size:70px;color:var(--ink)}
.cloth .sub{position:absolute;left:114px;top:166px;font:14px 'Special Elite';color:var(--ink2)}
.mt{position:absolute;width:210px;text-align:center;color:var(--ink)}
.mt .bl{width:210px;height:200px;-webkit-mask-size:100% 100%;mask-size:100% 100%}
.mt .bl img{width:100%;height:100%;object-fit:cover}
.mt b{display:block;font:22px 'IM Fell English';margin-top:8px}.mt span{font:12px 'Special Elite';color:var(--ink2)}
/* letters */
.letters{position:relative;padding:40px 0 170px}
.letters h2{font-size:90px;color:var(--paper);margin-bottom:70px}.letters h2 em{color:var(--berry)}
.lt{position:relative;display:flex;gap:0;justify-content:center;height:430px}
.env{position:absolute;width:420px;background:#EADFC6;color:var(--ink);padding:34px 36px 40px;box-shadow:0 30px 60px rgba(0,0,0,.55);background-image:linear-gradient(160deg,rgba(255,255,255,.12),transparent 50%,rgba(120,80,30,.12))}
.env .pm{position:absolute;right:26px;top:22px;width:86px;height:86px;border-radius:50%;border:2px solid rgba(90,40,20,.6);display:grid;place-items:center;text-align:center;font:10px/1.3 'Special Elite';color:rgba(90,40,20,.8);transform:rotate(14deg)}
.env .tg{font:12px 'Special Elite';letter-spacing:.14em;color:#A3311B;text-transform:uppercase}
.env h3{font-size:36px;margin:14px 90px 14px 0}.env p{font-size:17px;color:var(--ink2)}
.env .rd{display:inline-block;margin-top:18px;font:13px 'Special Elite';border-bottom:1px solid var(--ink)}
.v1{left:30px;top:40px;transform:rotate(-5deg)}.v2{left:440px;top:0;transform:rotate(1.5deg);z-index:2}.v3{left:860px;top:50px;transform:rotate(6deg)}
/* cameo + cards + lab */
.end{position:relative;padding:40px 0 140px}
.end .w{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;grid-auto-flow:dense}.end .deck{grid-column:2}.end .wlt{grid-column:1;padding-left:60px}
.cameo{position:relative;width:360px;height:460px;margin-left:60px}
.cameo .ov{position:absolute;inset:0;border-radius:50%;overflow:hidden;box-shadow:0 0 0 10px #3A2A1C,0 0 0 13px #8C6A3E,0 0 0 15px #3A2A1C,0 40px 80px rgba(0,0,0,.6)}
.cameo img{width:100%;height:100%;object-fit:cover;filter:sepia(.25) contrast(1.05)}
.cameo .hand{position:absolute;right:-120px;bottom:30px;transform:rotate(-8deg);color:var(--paper)}
.me h2{font-size:70px;color:var(--paper)}.me h2 em{color:var(--berry)}
.me p{margin:20px 0 26px;max-width:30em}
.deck{position:relative;height:420px}
.deck img{position:absolute;width:200px;border-radius:10px;box-shadow:0 26px 50px rgba(0,0,0,.6)}
.d1{left:0;top:60px;transform:rotate(-14deg)}.d2{left:150px;top:20px;transform:rotate(-3deg);z-index:2}.d3{left:300px;top:60px;transform:rotate(10deg)}
.lab{position:relative;height:380px}
.pol{position:absolute;left:80px;top:0;width:430px;background:#F2EADB;padding:16px 16px 60px;transform:rotate(3deg);box-shadow:0 30px 60px rgba(0,0,0,.6)}
.pol img{width:100%;display:block;filter:sepia(.15)}
.pol span{position:absolute;left:20px;bottom:16px;font:700 26px Caveat;color:var(--ink)}
.labt h2{font-size:64px;color:var(--paper)}.labt p{margin:16px 0 22px;color:var(--txt)}
/* footer */
.ft{position:relative;padding:80px 0 50px;border-top:1px solid rgba(217,205,179,.12)}
.ft .w{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px}
.ft h4{font:28px 'IM Fell English';color:var(--paper);margin-bottom:10px}
.ft li{list-style:none;font:13px/2.2 'Special Elite';color:var(--fog)}
.ft .in{display:flex;gap:16px;align-items:center;margin-top:16px}.ft input{flex:1;background:transparent;border:0;border-bottom:1px dashed var(--txt);padding:10px 0;font:16px 'Special Elite';color:var(--paper)}
.ft .wax{width:90px;height:90px;font-size:12px}
.ft .cp{grid-column:1/-1;font:12px 'Special Elite';color:var(--fog);border-top:1px solid rgba(217,205,179,.12);padding-top:20px;display:flex;justify-content:space-between}
@media(max-width:700px){
 body{font-size:17px}.w{padding:0 18px}
 .hd{padding:20px 0}.nv{display:none}.wm{font-size:24px}
 .hero{height:auto;padding-bottom:40px}.win{position:relative;right:auto;width:100%;height:440px;margin-top:10px}.win .fr{transform:translate(8px,8px)}
 .hero h1{position:relative;top:0;font-size:60px;margin-top:-100px}.hero h1 .l2{padding-left:40px}.hero h1 .l3{font-size:40px;padding-left:10px}
 .hero .lead{position:relative;left:0;top:0;margin-top:20px}.seal{position:relative;left:0;top:0;margin-top:24px}.candle{display:none}
 .case{padding:30px 0 80px}.ttl{flex-direction:column;align-items:start;gap:10px;margin-bottom:56px}.ttl h2{font-size:54px}
 .folder{width:auto;margin:0;height:auto;transform:none}.folder .tabs{left:10px;top:-34px}.folder .tabs span{padding:9px 10px 12px;font-size:10px}.folder .tabs span:nth-child(n+3){display:none}
 .folder .sheet{position:relative;inset:auto;margin:14px;padding:24px 18px 30px}
 .ev{position:relative;left:auto;top:auto;width:auto;height:240px;margin:0 0 30px}.e2,.e3{height:200px}.typed{position:relative;left:0;top:0;width:auto}.stamp{display:none}.note2{display:none}.string{display:none}
 .shelf{padding:20px 0 90px}.shelf .w{grid-template-columns:1fr;gap:30px}.shelf h2{font-size:54px}.books{height:300px}.books img{width:140px}.books .b2{left:150px}.books .b3{left:290px;display:none}.books .lbl{display:none}
 .rag{padding:20px 0 90px}.cloth{width:auto;height:auto;padding:60px 26px 80px;transform:none}
 .cloth h2{position:relative;left:0;top:0;font-size:44px}.cloth .sub{position:relative;left:0;top:0;display:block;margin:8px 0 20px}
 .mt{position:relative !important;left:auto !important;top:auto !important;width:46%;display:inline-block;margin:0 1% 20px;vertical-align:top}.mt .bl{width:100%;height:150px}
 .letters{padding:20px 0 90px}.letters h2{font-size:54px;margin-bottom:30px}.lt{height:auto;flex-direction:column;gap:24px}.env{position:relative;left:auto;top:auto;width:auto}.env h3{font-size:28px}
 .end .w{grid-template-columns:1fr;gap:50px}.cameo{width:260px;height:330px;margin:0 auto}.cameo .hand{display:none}.me h2,.labt h2{font-size:46px}
 .end .deck,.end .wlt{grid-column:auto;padding-left:0}.deck{height:300px}.deck img{width:140px}.d2{left:100px}.d3{left:200px}.lab{height:300px}.pol{left:0;width:90%}
 .ft .w{grid-template-columns:1fr 1fr}.ft .w>div:first-child{grid-column:1/-1}
}
'''
CSS = CSS.replace('NOISE', NOISE).replace('FOG', FOG).replace('BLOBW', B1).replace('BLOBC', B4).replace('RAGP', RAG)

def mt(img, x, y, b, s, m, bw=False):
    return '<div class="mt" style="left:%dpx;top:%dpx"><div class="bl" style="-webkit-mask-image:%s;mask-image:%s"><img src="%s%s" style="%s"></div><b>%s</b><span>%s</span></div>' % (x, y, m, m, I, img, 'filter:grayscale(1) contrast(1.5) brightness(1.1)' if bw else '', b, s)

ST = lambda c, s, x, y, w, op=.5: '<span class="st" style="left:%s;top:%s;width:%dpx;height:%dpx;background-image:%s"></span>' % (x, y, w, w, stain(c, s, op))

body = '''<div class="glow" id="glow"></div><div class="scene">
<div class="fog" style="top:300px"></div><div class="fog" style="top:2300px;opacity:.35"></div><div class="fog" style="top:4300px;opacity:.3"></div>
''' + ST('#E0612F', 2, '58%', '640px', 220, .22) + ST('#3F6E78', 7, '3%', '1500px', 300, .25) + ST('#C9963A', 4, '86%', '2500px', 260, .2) + ST('#E0612F', 9, '8%', '3900px', 240, .18) + '''
<div class="w"><header class="hd"><div class="wm">Pigeon Polly <i>Art Lab</i><small>RIGA · WATERCOLOUR &amp; INK</small></div>
<nav class="nv"><span>lessons</span><span>guides</span><span>journal</span><span>wobbleland</span><span>about</span></nav><span class="sg">sign in</span></header>

<section class="hero"><div class="win"><div class="fr"></div><div class="im"><img src="@sketchbook/sketchbook-15.jpg"></div></div><span class="candle"></span>
<h1>Small paintings<span class="l2">for long northern</span><span class="l3">evenings</span></h1>
<p class="lead">Watercolour and ink lessons, creative guides and things to print, from a small art lab in Riga. Free to start, in English with Latvian subtitles.</p>
<div class="seal"><span class="wax"><span><b>▶</b>free<br>lesson</span></span><span class="hand">start here, it’s ten minutes →</span></div></section>

<section class="case"><div class="ttl"><h2>The lessons <em>dossier</em></h2><p>Everything to learn, filed like old case notes. Free lessons on top, full paint-alongs for the club underneath.</p></div>
<div class="folder"><div class="tabs"><span class="on">case 01 · free lessons</span><span>case 02 · paint-alongs</span><span>case 03 · guides</span><span>case 04 · materials</span></div><div class="back"></div>
<div class="sheet"><div class="hdr"><b>Case 01 · Free lessons</b><span>FILED: NOV 2026 · STATUS: OPEN TO ALL</span></div>
<div class="ev e1"><span class="clip"></span><img src="@sketchbook/sketchbook-17.jpg"><span class="pl">▶</span><span class="cp">exhibit A · persimmons, 10 min</span></div>
<div class="ev e2"><span class="clip"></span><img src="@sketchbook/sketchbook-21-800.jpg"><span class="pl">▶</span><span class="cp">exhibit B · five colours</span></div>
<div class="ev e3"><span class="clip"></span><img src="@sketchbook/sketchbook-14-800.jpg" style="filter:brightness(.8) sepia(.3)"><span class="cp">exhibit C · red wall</span></div>
<span class="stamp" style="left:850px;top:330px">CLUB ONLY</span>
<div class="typed">SUBJECT: complete beginner.<br>EVIDENCE: three colours, one brush, no drawing first.<br>VERDICT: <b>you can paint this tonight.</b><br><br>Full 40-minute versions → case 02, for club members.</div>
<span class="note2" style="left:60px;top:470px;transform:rotate(-4deg)">← start with the persimmons</span></div></div>
<svg class="string" style="left:0;top:0;width:100%;height:100%" viewBox="0 0 1320 900"><path d="M380 330 C 600 260, 700 420, 990 380" stroke="#B8362B" stroke-width="2.2" fill="none"/><circle cx="380" cy="330" r="6" fill="#B8362B"/><circle cx="990" cy="380" r="6" fill="#B8362B"/></svg>
</section>

<section class="shelf"><div class="w" style="padding:0"><div><span class="tw" style="color:var(--fog)">— guides &amp; books —</span><h2>Guides to keep <em>on your desk</em></h2>
<p>Written, illustrated and designed by Alina. Real sketchbook pages and clear steps, from the first line to a finished little painting.</p><span class="lnk">buy on amazon</span><span class="lnk">free colouring book</span></div>
<div class="books"><img class="b1" src="@e-books/watercolor-sketches.jpg"><img class="b2" src="@e-books/ink-sketching.jpg"><img class="b3" src="@e-books/urban-sketching-digital-traveler.jpg"><span class="board"></span>
<span class="rib" style="left:220px"></span><span class="rib" style="left:470px;background:#7A2E18"></span><span class="lbl" style="left:60px;bottom:-40px">vol. I</span><span class="lbl" style="left:330px;bottom:-40px">vol. II</span><span class="lbl" style="left:600px;bottom:-40px">vol. III · soon</span></div></div></section>

<section class="rag"><div class="cloth"><h2>Things to print <em class="berry">&amp; paint</em></h2><span class="sub">line sketches · reference photos · colouring pages · palette cards</span>
''' + mt('sketchbook/sketchbook-17-800.jpg', 130, 250, 'Persimmons', 'line sketch · free', B2, True) + mt('sketchbook/sketchbook-7-800.jpg', 390, 280, 'Riga rooftops', 'reference pack · club', B3) + mt('cards/classic/13.jpg', 650, 240, 'Miss Peony', 'colouring page · free', B5, True) + mt('sketchbook/sketchbook-21-800.jpg', 900, 270, 'Palette cards', 'print &amp; swatch · €4', B1) + '''
''' + ST('#3F6E78', 3, '940px', '40px', 160, .45) + ST('#E0612F', 5, '500px', '30px', 120, .45) + ST('#C9963A', 8, '40px', '400px', 140, .5) + '''</div></section>

<section class="letters"><h2>Letters from <em>the studio</em></h2><div class="lt">
<div class="env v1"><span class="pm">RIGA<br>✦<br>NOV 26</span><span class="tg">watercolour</span><h3>Five colours are enough</h3><p>The small kit I carry everywhere, and why fewer paints make braver sketches.</p><span class="rd">read the letter</span></div>
<div class="env v2"><span class="pm">RIGA<br>✦<br>OCT 26</span><span class="tg">learning &amp; ai</span><h3>What AI can’t learn for you</h3><p>On creativity, education and keeping the hand in the process.</p><span class="rd">read the letter</span></div>
<div class="env v3"><span class="pm">RIGA<br>✦<br>SEP 26</span><span class="tg">behind the scenes</span><h3>How a guide gets made</h3><p>From the first sketch to the Amazon page, done solo.</p><span class="rd">read the letter</span></div></div>
<p class="tw" style="text-align:center;margin-top:30px;color:var(--fog)">all letters → · club members read them a week early</p></section>

<section class="end"><div class="w" style="padding:0"><div class="cameo"><div class="ov"><img src="@home/alina.jpg"></div><span class="hand">— Alina &amp; Polly</span></div>
<div class="me"><span class="tw" style="color:var(--fog)">— hi, I’m Alina —</span><h2>I teach the way I sketch: <em>small, kind, step by step</em></h2><p>Illustrator and learning experience designer from Riga. I once drew a pigeon called Polly, and she grew into a whole world.</p><span class="lnk">my story</span><span class="lnk">work with me</span></div>
<div class="deck"><img class="d1" src="@cards/classic/13.jpg"><img class="d2" src="@cards/classic/16.jpg"><img class="d3" src="@cards/classic/14.jpg"></div>
<div class="wlt"><span class="tw" style="color:var(--fog)">— a world of my own —</span><h2 style="font-size:64px;color:var(--paper)">Wobbleland</h2><p style="margin:16px 0 22px">Eleven wobbly towns and their residents, each one a hand-painted collectible card.</p><span class="lnk">explore the map</span></div>
<div class="lab"><div class="pol"><img src="@home/first-pigeon-polly.jpg"><span>the very first Polly</span></div></div>
<div class="labt"><span class="tw" style="color:var(--fog)">— psst, there’s another side —</span><h2>Behind this door is <em class="berry">the Lab</em></h2><p>Hatch your own bird, join the Flock, play games for buttons, solve cases with detective Titos.</p><span class="lnk">open the door</span></div></div></section>

<footer class="ft"><div class="w"><div><h4>A letter every Monday</h4><span class="tw" style="color:var(--fog)">one free lesson, sealed with wax. nothing else.</span><div class="in"><input placeholder="your email"><span class="wax"><span>send</span></span></div></div>
<div><h4>Learn</h4><ul><li>free lessons</li><li>paint-alongs</li><li>guides &amp; books</li><li>materials</li></ul></div><div><h4>Explore</h4><ul><li>wobbleland</li><li>journal</li><li>palettes</li><li>the lab</li></ul></div><div><h4>Alina</h4><ul><li>about</li><li>work with me</li><li>linkedin</li><li>patreon</li></ul></div>
<div class="cp"><span>© 2026 Pigeon Polly Art Lab · Riga</span><span>EN · LV · RU</span></div></div></footer></div></div>
<script>addEventListener('mousemove',e=>{const g=document.getElementById('glow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'})</script>'''
body = body.replace('src="@', 'src="' + I)
html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Variant G</title><style>' + CSS + '</style></head><body>' + body + '</body></html>'
open('var-g.html', 'w').write(html)
print('ok9')
