"""Слова A1–A2 en/ei/et в картинках (docs/site.md «Учебник норвежского»): python3 tools/norsk_gender/make.py && node tools/norsk_gender/pdf.js
→ site/members/norsk/norsk-a1-a2-en-ei-et.pdf. Слова — words.py, транскрипция — tr.py (правила + исключения OVR)."""
import html, math, itertools, sys
sys.path.insert(0,str(__import__('pathlib').Path(__file__).resolve().parent))
from words import TOPICS
from tr import tr
SL=7
import pathlib
H=pathlib.Path(__file__).resolve().parent
svg=(H/'marks.svg').read_text(encoding='utf-8')
def pic(art,e,y=''):
    yy={'f':66,'b':50}.get(y,56)
    if art=='en': return f'<span class="emo">{e}</span><svg class="stache" style="top:{yy}%" viewBox="0 0 100 36"><use href="#stache"/></svg>'
    if art=='ei': return f'<span class="emo">{e}</span><svg class="bow" viewBox="0 0 100 70"><use href="#bow"/></svg>'
    return f'<span class="half l"><span class="emo">{e}</span></span><span class="half r"><span class="emo">{e}</span></span>'
def card(art,w,ru,e,y=''):
    return f'<div class="card"><div class="pic">{pic(art,e,y)}</div><div class="w"><b>{art}</b> {html.escape(w)}</div><div class="t">[{tr(w)}]</div><div class="ru">{html.escape(ru)}</div></div>'
body=[];tot={'en':0,'ei':0,'et':0};toc=[]
for no,ru,data in TOPICS:
    g={'en':[],'ei':[],'et':[]}
    for line in data.strip().splitlines():
        p=line.split('|');art,w=p[0].split(' ',1)
        g[art].append((art,w,p[1],p[2],p[3] if len(p)>3 else ''));tot[art]+=1
    n=[len(g[a]) for a in ('en','ei','et')]
    best=min(((a,b,SL-a-b) for a in range(1,SL) for b in range(1,SL-a) if SL-a-b>=1),
             key=lambda w:(max(math.ceil(n[i]/w[i]) for i in range(3)), -min(w)))
    cols=''.join(f'<div class="col {a}" style="flex:{best[i]}"><div class="grid" style="grid-template-columns:repeat({best[i]},1fr)">'
                 +(''.join(card(*c) for c in g[a]) or '<div class="none">—</div>')+'</div></div>' for i,a in enumerate(('en','ei','et')))
    toc.append(f'<li><b>{no}</b> — {ru} <span>{sum(n)}</span></li>')
    body.append(f'<section><h2>{no} <small>/ {ru}</small></h2><div class="heads">'+''.join(f'<div class="hd {a}" style="flex:{best[i]}">{a}</div>' for i,a in enumerate(('en','ei','et')))+f'</div><div class="cols">{cols}</div></section>')
N=sum(tot.values())
out=f'''<!doctype html><html lang="ru"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Caveat:wght@500;700&display=swap">
<style>
@page{{size:A4;margin:10mm 9mm 11mm}}
:root{{--ink:#3b2f27;--soft:#8a7766;--line:#e8dcc6;--en:#5a7fb0;--ei:#d46a78;--et:#5f9a63}}
html{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
body{{margin:0;background:#fff;color:var(--ink);font-family:"Caveat",cursive}}
.cover{{height:270mm;display:flex;flex-direction:column;justify-content:center;break-after:page;padding:0 6mm}}
h1{{font-family:"Amatic SC",cursive;font-size:64pt;line-height:.9;margin:0 0 4mm;letter-spacing:.03em}}
h1 .a{{color:var(--en)}} h1 .b{{color:#c9a227}} h1 .c{{color:var(--ei)}} h1 .d{{color:var(--et)}}
.sub{{font-size:21pt;color:var(--soft);margin:0 0 9mm}}
.rules{{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;margin-bottom:8mm}}
.rule{{border:1.5px solid var(--line);border-radius:18px 14px 20px 12px;padding:4mm;text-align:center;font-size:17pt}}
.rule .pic{{margin:0 auto}} .rule b{{font-size:26pt}}
.en b,.hd.en{{color:var(--en)}} .ei b,.hd.ei{{color:var(--ei)}} .et b,.hd.et{{color:var(--et)}}
.note{{font-size:15pt;color:var(--soft);max-width:160mm;margin:0 0 8mm}}
.toc{{columns:2;font-size:14.5pt;padding:0;margin:0;list-style:none}} .toc li{{break-inside:avoid}} .toc span{{color:var(--soft)}}
h2{{font-size:23pt;margin:4mm 0 1mm;break-after:avoid}} h2 small{{color:var(--soft);font-weight:500;font-size:.8em}}
.heads,.cols{{display:flex;gap:4mm}}
.heads{{break-after:avoid;margin-bottom:1.5mm}}
.hd{{font-size:20pt;font-weight:700;border-bottom:2px solid currentColor;line-height:1.1;padding-left:1mm}}
.cols{{margin-bottom:3mm}}
.col{{min-width:0}}
.grid{{display:grid;gap:2mm}}
.none{{color:var(--soft);font-size:16pt;text-align:center;padding-top:6mm}}
.card{{border:1.1px solid var(--line);border-radius:12px 10px 14px 9px;padding:1.5mm .6mm 1.4mm;display:flex;flex-direction:column;align-items:center;break-inside:avoid}}
.pic{{position:relative;width:19mm;height:17mm;display:grid;place-items:center}}
.emo{{font-family:"Noto Color Emoji";font-size:36pt;line-height:1}}
.stache{{position:absolute;left:50%;width:12.5mm;transform:translate(-50%,-50%) rotate(-3deg)}}
.bow{{position:absolute;width:9mm;top:-1mm;right:.5mm;transform:rotate(14deg)}}
.half{{position:absolute;inset:0;display:grid;place-items:center}}
.half.l{{clip-path:inset(0 50% 0 0);transform:translateX(-1.4mm) rotate(-6deg)}}
.half.r{{clip-path:inset(0 0 0 50%);transform:translateX(1.4mm) rotate(6deg)}}
.w{{font-size:13.5pt;font-weight:700;line-height:1.05;text-align:center;overflow-wrap:anywhere}}
.en .w b{{color:var(--en)}} .ei .w b{{color:var(--ei)}} .et .w b{{color:var(--et)}}
.t{{font-family:Georgia,serif;font-size:7.5pt;color:#6a5a4c;line-height:1.2;text-align:center;overflow-wrap:anywhere}}
.ru{{font-size:10.5pt;color:var(--soft);line-height:1.05;text-align:center}}
</style></head><body>{svg}
<div class="cover">
<h1><span class="a">Norsk</span> <span class="b">A1–A2:</span><br><span class="c">the gender</span> <span class="d">game</span></h1>
<p class="sub">{N} существительных в картинках: {tot["en"]} en · {tot["ei"]} ei · {tot["et"]} et</p>
<div class="rules">
<div class="rule en"><div class="pic">{pic("en","🚗")}</div><b>en</b><br>мужской род<br>«с усами»</div>
<div class="rule ei"><div class="pic">{pic("ei","📖")}</div><b>ei</b><br>женский род<br>«с бантиком»</div>
<div class="rule et"><div class="pic">{pic("et","🍎")}</div><b>et</b><br>средний род<br>«разрезаны пополам»</div>
</div>
<p class="note">В каждой теме три колонки: en, ei, et. Транскрипция — русскими буквами, двоеточие значит долгий звук: bok [бу:к]. В букмоле слова женского рода можно говорить и с en (ei jente = en jente), но с ei род легче запомнить.</p>
<ul class="toc">{"".join(toc)}</ul>
</div>
{"".join(body)}
</body></html>'''
open(H/'out.html','w',encoding='utf8').write(out);print(N,tot)
