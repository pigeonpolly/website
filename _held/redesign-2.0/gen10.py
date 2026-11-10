# Вариант I: H + правки Алины + 4 сезона (гамма и главная картинка меняются), немного живости (не часть сайта)
import random
import gen9
from gen9 import CSS as C0, B as B0
random.seed(3)

SEASONS = {
 'winter': dict(name='Winter', ru='Зима', bg='#EEF1F3', sheet='#F8FAFB', ink='#1C2430', mut='#5D6670', line='#D3DAE0', gr='#26303A', gr2='#313C47', acc='#9E1B22', acc2='#E2544A', inner='#1B2632', hero='img/hero-winter.jpg', pos='center 32%', note='frosty rooftops, Riga ❄', tag='winter edition'),
 'autumn': dict(name='Autumn', ru='Осень', bg='#F4F0EA', sheet='#FBF9F5', ink='#2A211C', mut='#6C6058', line='#DED5CA', gr='#2E2521', gr2='#3A302B', acc='#C04A1C', acc2='#EE7A45', inner='#2A1D16', hero='img/hero-autumn.jpg', pos='center 45%', note='night garden, physalis ✿', tag='autumn edition'),
 'spring': dict(name='Spring', ru='Весна', bg='#F1F4F0', sheet='#FAFBF9', ink='#1F2A25', mut='#5E6A63', line='#D4DDD6', gr='#26302B', gr2='#313C36', acc='#BE2F3A', acc2='#E85C64', inner='#1C2A23', hero='img/hero-spring.jpg', pos='center 55%', note='wild strawberries ❀', tag='spring edition'),
 'summer': dict(name='Summer', ru='Лето', bg='#F7F4EE', sheet='#FFFDFA', ink='#2A2420', mut='#6D635B', line='#E3DACE', gr='#2F2622', gr2='#3B312C', acc='#D2452B', acc2='#F07A55', inner='#3A1A1C', hero='img/hero-summer.jpg', pos='center 45%', note='Polly’s ice cream van ☀', tag='summer edition'),
}

def stain(col, seed, op):
    from urllib.parse import quote
    s = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='.03' numOctaves='3' seed='%d'/><feDisplacementMap in='SourceGraphic' scale='34'/><feGaussianBlur stdDeviation='2.2'/></filter>"
         "<g filter='url(#s)' fill='%s' fill-opacity='%s'><circle cx='100' cy='100' r='56'/><circle cx='158' cy='64' r='12'/><circle cx='44' cy='152' r='8'/><circle cx='150' cy='150' r='5'/></g></svg>") % (seed, col, op)
    return "url('data:image/svg+xml;utf8,%s')" % quote(s)

EXTRA = '''
/* liveliness */
.hero h1 em{position:relative;display:inline-block}
.hero h1 em svg{position:absolute;left:-4%;bottom:-18px;width:108%;height:30px;overflow:visible}
.hero h1 em path{stroke:var(--wine);stroke-width:5;fill:none;stroke-linecap:round;stroke-dasharray:420;stroke-dashoffset:420;animation:draw 1.4s .4s ease-out forwards;opacity:.85}
@keyframes draw{to{stroke-dashoffset:0}}
.sea{position:absolute;right:44px;top:72px;font:700 24px Caveat;color:var(--wine);transform:rotate(6deg)}
.sea:before{content:"";position:absolute;left:-46px;top:12px;width:40px;height:20px;border-top:2px solid var(--wine);border-radius:50% 50% 0 0;transform:rotate(-20deg)}
.splash{position:absolute;pointer-events:none;background-size:contain;background-repeat:no-repeat;z-index:0}
.pano .cap2{position:absolute;right:44px;bottom:18px;z-index:2;font:700 22px Caveat;color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.5)}
.switch{display:flex;gap:6px;margin-left:10px}.switch a{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--ink);display:block}.switch a.on{box-shadow:0 0 0 3px var(--bg),0 0 0 4.5px var(--wine)}
section{position:relative}
.doodle{position:absolute;font:700 22px Caveat;color:var(--mut)}
/* about simple */
.ab2{padding:110px 0}
.ab2 .w{display:grid;grid-template-columns:400px 1fr;gap:80px;align-items:center}
.ab2 .ph{position:relative;background:#fff;padding:14px 14px 50px;transform:rotate(-2deg);box-shadow:0 20px 40px rgba(31,35,38,.15)}
.ab2 .ph img{width:100%;aspect-ratio:4/5;object-fit:cover}
.ab2 .ph span{position:absolute;left:18px;bottom:12px;font:700 24px Caveat;color:var(--ink)}
.ab2 h2{font-size:62px}.ab2 p{color:var(--mut);font-size:19px;margin:22px 0 30px;max-width:28em}
/* club section alone */
.dark{padding:110px 0}.club{margin-bottom:0}
/* lab folder */
.lab3{padding:100px 0 140px}
.lab3 .hd3{text-align:center;margin-bottom:60px}.lab3 .hd3 h2{font-size:52px;margin-top:12px}.lab3 .hd3 .hand{display:block;margin-top:8px}
.fold{position:relative;width:960px;height:540px;margin:0 auto;perspective:2200px}
.fold .bk{position:absolute;inset:0;background:#B48D57;border-radius:6px 18px 8px 8px;box-shadow:0 34px 60px rgba(40,30,20,.25)}
.fold .tb{position:absolute;top:-36px;left:24px;width:230px;height:44px;background:#B48D57;border-radius:14px 14px 0 0;font:15px 'Special Elite',monospace;color:#4A3520;padding:11px 20px;letter-spacing:.08em}
.fold .ins{position:absolute;inset:30px 34px;display:grid;grid-template-columns:1.05fr 1fr;gap:40px;align-items:center}
.nt{position:relative;background:#FFFEFA;padding:34px 34px 30px;transform:rotate(-2deg);box-shadow:0 14px 30px rgba(40,30,20,.25);background-image:repeating-linear-gradient(transparent 0 29px,rgba(70,110,160,.16) 29px 30px);background-position:0 70px}
.nt:before{content:"";position:absolute;left:44px;top:0;bottom:0;width:1.5px;background:rgba(190,60,60,.35)}
.nt .pin{position:absolute;top:-12px;left:50%;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff6,transparent 40%),var(--wine);box-shadow:0 4px 8px rgba(0,0,0,.3)}
.nt .k{padding-left:24px}.nt h3{font:italic 300 40px/1.05 Fraunces;margin:10px 0 12px;padding-left:24px}.nt p{font-size:15px;color:var(--mut);padding-left:24px;margin-bottom:16px;line-height:1.95}
.nt .ltabs{padding-left:24px;margin-bottom:18px}.nt .ltabs span{border-color:var(--line);color:var(--ink)}.nt .btn{margin-left:24px}
.ph2{position:relative;background:#fff;padding:14px 14px 46px;transform:rotate(3deg);box-shadow:0 18px 34px rgba(40,30,20,.3)}
.ph2 img{width:100%;display:block}.ph2 span{position:absolute;left:16px;bottom:12px;font:700 22px Caveat;color:var(--ink)}
.ph2 .clip{position:absolute;top:-22px;left:40px;width:24px;height:62px;border:3px solid #9A9C9E;border-radius:12px;border-bottom-color:transparent;transform:rotate(-6deg)}
.cv{position:absolute;inset:0;transform-origin:left center;transition:transform 1.1s cubic-bezier(.3,.7,.2,1);transform-style:preserve-3d;z-index:5}
.cv .f,.cv .b{position:absolute;inset:0;border-radius:6px 18px 8px 8px;backface-visibility:hidden}
.cv .f{background:#CBA56C;background-image:linear-gradient(135deg,rgba(255,255,255,.12),transparent 40%,rgba(0,0,0,.08));box-shadow:inset 0 0 0 1px rgba(0,0,0,.06);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#3E2C18}
.cv .b{background:#B9935C;transform:rotateY(180deg)}
.cv .clbl{position:relative;z-index:2;color:#3E2C18;background:#FBF6EA;padding:18px 36px;font:22px 'Special Elite',monospace;letter-spacing:.14em;box-shadow:0 2px 6px rgba(0,0,0,.15);transform:rotate(-1.5deg)}
.cv .stp{margin-top:34px;font:700 13px Karla;letter-spacing:.2em;color:var(--wine);border:2px solid var(--wine);padding:8px 14px;transform:rotate(-6deg);opacity:.85}
.cv .hand{position:absolute;right:60px;bottom:50px;color:#5A4026;transform:rotate(-4deg)}
.cv .tie{position:absolute;right:28px;top:50%;width:34px;height:34px;border-radius:50%;border:2px solid #6B4E2E;transform:translateY(-50%)}
.cv .tie:after{content:"";position:absolute;left:14px;top:30px;width:2px;height:70px;background:#6B4E2E;transform:rotate(14deg);transform-origin:top}
.fold:hover .cv,.lab3.open .cv{transform:rotateY(-158deg)}
.lab3.half .cv{transform:rotateY(-62deg)}
/* lab reveal */
@property --r{syntax:'<percentage>';inherits:false;initial-value:0%}
.lab2{position:relative;background:var(--inner);color:#F2E6C9;overflow:hidden}
.lab2 .in{padding:100px 0}
.lab2 .in .w{display:grid;grid-template-columns:1fr 1.1fr;gap:60px;align-items:center}
.lab2 h2{font:italic 300 54px Fraunces;color:#F2E6C9}.lab2 p{color:#DCD2C4;margin:16px 0 24px;font-size:17px}
.lab2 .k{color:var(--acc2)}
.lab2 .btn{background:var(--acc2);border-color:var(--acc2);color:#fff}
.lab2 .pol{background:#fff;padding:14px 14px 44px;transform:rotate(2deg);box-shadow:0 24px 44px rgba(0,0,0,.45);position:relative}.lab2 .pol img{width:100%}.lab2 .pol span{position:absolute;left:16px;bottom:12px;font:italic 15px Fraunces;color:#555}
.lab2 .ltabs span{border-color:rgba(242,230,201,.35)}
.paint{position:absolute;inset:34px 30px;background:var(--sheet);box-shadow:inset 0 0 60px rgba(0,0,0,.05);background-image:STAINS;background-repeat:no-repeat;filter:url(#rough);z-index:3;
 -webkit-mask:radial-gradient(circle at var(--x,50%) var(--y,50%),transparent var(--r),#000 calc(var(--r) + 1%));mask:radial-gradient(circle at var(--x,50%) var(--y,50%),transparent var(--r),#000 calc(var(--r) + 1%));transition:--r 1.3s cubic-bezier(.3,.7,.2,1)}
.lab2:hover .paint,.lab2.open .paint{--r:150%}
.cover{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--ink);transition:opacity .5s;pointer-events:none}
.lab2:hover .cover,.lab2.open .cover{opacity:0}
.cover h3{font:italic 300 48px Fraunces;margin:10px 0}.cover .hand{font-size:30px}
.cover .k{color:var(--wine)}
.cover .brush{width:70px;height:70px;border-radius:50%;border:1.5px dashed var(--wine);display:grid;place-items:center;font-size:26px;margin-top:16px}
'''

def build(key, s, mode=''):
    css = C0 + EXTRA
    for a, b in [('--bg:#EEF0F1', '--bg:' + s['bg']), ('--sheet:#F8F9F9', '--sheet:' + s['sheet']), ('--ink:#1F2326', '--ink:' + s['ink']),
                 ('--mut:#5E656A', '--mut:' + s['mut']), ('--line:#D5DADD', '--line:' + s['line']), ('--gr:#2A2C2E', '--gr:' + s['gr']),
                 ('--gr2:#35383B', '--gr2:' + s['gr2']), ('--wine:#9E1B22', '--wine:' + s['acc'] + ';--acc2:' + s['acc2'] + ';--inner:' + s['inner']),
                 ('#E2544A', 'var(--acc2)')]:
        assert a in css, a; css = css.replace(a, b)
    css = css.replace('object-position:center 32%', 'object-position:' + s['pos'])
    if key == 'summer':
        css += '.pano{height:620px}.pano img{-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 26%);mask-image:linear-gradient(to bottom,transparent 0,#000 26%)}'
    css = css.replace('.post img{width:110px;height:110px;object-fit:cover;border-radius:55px 55px 3px 3px}', '.post img{width:130px;height:96px;object-fit:cover;border-radius:3px}')
    css = css.replace('STAINS', ', '.join([stain(s['acc'], 4, .22), stain(s['mut'], 9, .2), stain(s['acc'], 12, .16)]) + ';background-size:420px 420px,300px 300px,200px 200px;background-position:8% 20%,88% 70%,60% 10%')
    b = B0
    # header: season switcher
    sw = ''.join('<a class="%s" style="background:%s" title="%s"></a>' % ('on' if k == key else '', v['acc'], v['name']) for k, v in SEASONS.items())
    b = b.replace('<span>EN · LV · RU</span>', '<span>EN · LV · RU</span><span class="switch">%s</span>' % sw, 1)
    # hero: remove pins, add underline + season note + caption
    a = b.index('<div class="pano">'); z = b.index('</section>', a)
    b = b[:a] + '<div class="pano"><img src="%s"><span class="cap2">%s</span></div>' % (s['hero'], s['note']) + b[z:]
    b = b.replace('<h1>Paint small, <em>joyful</em> things</h1>', '<span class="sea">%s</span><h1>Paint small, <em>joyful<svg viewBox="0 0 300 30" preserveAspectRatio="none"><path d="M5 20 C 60 6, 120 28, 180 14 S 270 10, 295 18"/></svg></em> things</h1>' % s['tag'])
    b = b.replace('<section class="hero"><div class="w">', '<section class="hero"><span class="splash" style="left:6%;top:40px;width:220px;height:220px;background-image:' + stain(s['acc'], 2, .12) + '"></span><span class="splash" style="right:9%;top:260px;width:140px;height:140px;background-image:' + stain(s['mut'], 6, .14) + '"></span><div class="w">')
    # remove facts strip
    a = b.index('<div class="facts">'); z = b.index('</div></div>', a) + len('</div></div>')
    b = b[:a] + b[z:]
    # splashes in sections
    b = b.replace('<section class="fl">', '<section class="fl"><span class="splash" style="left:-40px;top:60px;width:260px;height:260px;background-image:' + stain(s['acc'], 8, .12) + '"></span>')
    b = b.replace('<section class="jr">', '<section class="jr"><span class="splash" style="right:4%;top:40px;width:180px;height:180px;background-image:' + stain(s['acc'], 14, .14) + '"></span><span class="doodle" style="left:46%;top:96px;transform:rotate(-4deg)">fresh from the sketchbook ↓</span>')
    # split dark: keep club only, then simple about, then lab reveal
    a = b.index('<div class="ab">'); z = b.index('</div></section>', a)
    b = b[:a] + b[z:]
    about = '''<section class="ab2"><span class="splash" style="left:30%;top:50px;width:240px;height:240px;background-image:''' + stain(s['acc'], 17, .12) + ''''"></span><div class="w"><div class="ph"><img src="@home/alina.jpg"><span>— Alina &amp; Polly</span></div>
<div><span class="k">Hi, I’m Alina</span><h2 style="margin-top:14px">I teach the way I sketch: <em>small, kind, step by step</em></h2><p>Illustrator and learning experience designer from Riga. I once drew a pigeon called Polly, and she grew into a whole world.</p><span class="btn">More about me →</span></div></div></section>'''.replace("''", "'")
    a = b.index('<section class="lab">'); z = b.index('</section>', a) + len('</section>')
    lab = ('<section class="lab3%s" id="lab"><div class="w"><div class="hd3"><span class="k">Psst… there’s another side</span><h2>Top secret: <em>the Lab</em></h2><span class="hand">hover the folder to peek inside</span></div>'
           '<div class="fold"><div class="bk"></div><span class="tb">case file · the lab</span>'
           '<div class="ins"><div class="nt"><span class="pin"></span><span class="k">Behind this door</span><h3>Birds, games &amp; silly experiments</h3><p>Hatch your own bird, join the Flock, play games for buttons, solve cases with detective Titos. Cosy and free.</p>'
           '<div class="ltabs"><span>Play</span><span>My bird</span><span>Bird market</span><span>Experiments</span></div><span class="btn pri">🚪 Open the Lab</span></div>'
           '<div class="ph2"><span class="clip"></span><img src="@home/first-pigeon-polly.jpg"><span>the very first Polly</span></div></div>'
           '<div class="cv"><div class="f"><span class="clbl">THE LAB</span><span class="stp">FOR CURIOUS BIRDS ONLY</span><span class="hand">psst… open me →</span><span class="tie"></span></div><div class="b"></div></div></div></div></section>') % mode
    b = b[:a] + about + lab + b[z:]
    import re
    b = re.sub(r'<span class="splash"[^>]*></span>', '', b)
    b = b.replace('src="@', 'src="' + gen9.I)
    svg = '<svg width="0" height="0" style="position:absolute"><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="60"/></filter></svg>'
    js = ''
    name = 'var-i-%s%s.html' % (key, ('-' + mode.strip()) if mode else '')
    open(name, 'w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pigeon Polly · %s</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap"><style>%s</style></head><body>%s%s%s</body></html>' % (s['name'], css, svg, b, js))

for k, v in SEASONS.items():
    build(k, v)
build('autumn', SEASONS['autumn'], ' open')
build('autumn', SEASONS['autumn'], ' half')
print('ok11')
