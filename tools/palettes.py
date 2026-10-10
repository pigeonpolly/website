# Палитры из артов сайта: 6 цветов из каждой картинки галерей (кроме AI-арта) + «художественные» названия на 3 языках.
# Запуск: python3 tools/palettes.py → content/palettes.json. Новая картинка — добавить её название в tools/palette_titles.py.
import json, sys, colorsys, random
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent)); from palette_names import NAMES; from palette_titles import T; from palette_overrides import O
from PIL import Image
W = str(__import__('pathlib').Path(__file__).resolve().parent.parent) + '/'
def lab(h):
  r,g,b=[int(h[i:i+2],16)/255 for i in (1,3,5)]
  f=lambda c: c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
  r,g,b=f(r),f(g),f(b)
  X=(r*.4124+g*.3576+b*.1805)/.95047; Y=r*.2126+g*.7152+b*.0722; Z=(r*.0193+g*.1192+b*.9505)/1.08883
  t=lambda v: v**(1/3) if v>.008856 else 7.787*v+16/116
  return (116*t(Y)-16, 500*(t(X)-t(Y)), 200*(t(Y)-t(Z)))
NL=[(n,lab(h)) for n in NAMES for h in [n[3]]]
def dist(a,b): return sum((x-y)**2 for x,y in zip(a,b))
def km(px,k):
  random.seed(7); c=random.sample(px,k)
  for _ in range(14):
    g=[[] for _ in c]
    for p in px: g[min(range(k),key=lambda j:dist(p,c[j]))].append(p)
    c=[tuple(sum(q[t] for q in gg)/len(gg) for t in range(3)) if gg else c[i] for i,gg in enumerate(g)]
  return [(c[i],len(g[i])) for i in range(k)]
out=[]
order=['bird','snail','sketchbook','halloween','detective','anxiety','challenge']
for gal in order:
  for it in json.load(open(W+f'content/galleries/{gal}.json')):
    key=it['full'].split('/')[-1][:-4]
    if key not in T or key=='anxiety-7': continue
    im=Image.open(W+'site/'+it['thumb']).convert('RGB'); im.thumbnail((120,120)); px=list(im.get_flattened_data() if hasattr(im,'get_flattened_data') else im.getdata())
    ink=[p for p in px if min(p)<225]  # белый фон бумаги не считаем
    if len(ink)>len(px)*.08: px=ink
    cl=km(px,14); cl.sort(key=lambda x:-x[1]**.7*(0.15+1.8*colorsys.rgb_to_hsv(*[v/255 for v in x[0]])[1]))
    pick=[]
    # не больше одного светлого, одного очень тёмного и двух бесцветных (фон бумаги не должен съесть палитру); чистый белый не берём
    def kind(col):
      Lc=lab('#%02X%02X%02X'%tuple(int(v) for v in col))[0]; sat=colorsys.rgb_to_hsv(*[v/255 for v in col])[1]
      return Lc, sat
    for gap in (48, 32, 22):
      lt=sum(kind(p)[0]>82 for p in pick); dk=sum(kind(p)[0]<16 for p in pick); gr=sum(kind(p)[1]<.12 for p in pick)
      for col,n in cl:
        if len(pick)==6: break
        Lc,sat=kind(col)
        if col in pick or Lc>95 or (Lc>82 and lt) or (Lc<16 and dk) or (sat<.12 and gr>=2): continue
        if all(dist(col,p)>gap**2 for p in pick): pick.append(col); lt+=Lc>82; dk+=Lc<16; gr+=sat<.12
    for col,n in cl:  # если всё равно мало — любой отличающийся
      if len(pick)==6: break
      if kind(col)[0]<=92 and all(dist(col,p)>18**2 for p in pick): pick.append(col)
    hexes=['#%02X%02X%02X'%tuple(int(round(v)) for v in p) for p in pick]
    used=set(); cols=[]
    for h in hexes:
      L=lab(h); n=min((x for x in NL if x[0][0] not in used), key=lambda x: dist(L,x[1]))[0]; used.add(n[0])
      cols.append({'hex':h,'en':n[0],'ru':n[1],'lv':n[2]})
    if key in O: cols=[{'hex':h,'en':e,'ru':r,'lv':l} for e,r,l,h in O[key]]
    out.append({'key':key,'gallery':gal,'img':it['full'],'thumb':it['thumb'],'w':it['w'],'h':it['h'],'title':dict(zip(['en','ru','lv'],T[key])),'colors':cols})
json.dump(out,open(W+'content/palettes.json','w'),ensure_ascii=False,indent=0)
print(len(out))
for o in out[:6]: print(o['key'][:30], [(c['en'],c['hex']) for c in o['colors']])
