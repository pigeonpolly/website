# Новая Полли (20.11.2026): слои спрайта для site/assets/polly.js (PCOL, PL). Запуск: python3 tools/polly_sprite.py → layers.js рядом; вставить вместо PCOL/PL в polly.js.
import math, copy
from polly_px import G
OUT='#1a1528'
B,S,L,Hh,F='#544a8e','#3e3673','#7d75b8','#6a61a3','#2e2860'
OR,ORD='#f08a3c','#c8642a'
DY=5; WID,HEI=30,35
def base():
    g=G(WID,HEI)
    def poly(pts,c,only=None): g.poly([(x,y+DY) for x,y in pts],c,only)
    def ell(cx,cy,rx,ry,c,only=None): g.ell(cx,cy+DY,rx,ry,c,only)
    def rect(x0,y0,x1,y1,c): g.rect(x0,y0+DY,x1,y1+DY,c)
    poly([(13,1),(18,1),(21,4),(21.5,13),(21,19),(18,22),(7,23),(3,21),(0,19),(1,16),(5,13),(9,10.5),(9,4)],B)
    ell(16,17,4.5,4.6,L,only=[B])
    poly([(1,18),(6,13.5),(10,13),(11,17),(8,20),(3,20.5)],S)
    poly([(3,18),(7,14.5),(9,14.5),(6,17.5)],Hh)
    rect(4,19,6,19,F); rect(7,18,8,18,F); rect(9,16,9,17,F)
    poly([(21,7),(27,8),(21,10.5)],OR); rect(21,10,23,10,ORD)
    rect(15,5,19,8,'#ffffff'); rect(17,6,19,8,OUT); g.p(17,6+DY,'#ffffff')
    rect(15,10,17,10,'#f2a7b8')
    return g
def rell(g,cx,cy,rx,ry,a,c,only=None):
    g.poly([(cx+rx*math.cos(t)*math.cos(a)-ry*math.sin(t)*math.sin(a), cy+rx*math.cos(t)*math.sin(a)+ry*math.sin(t)*math.cos(a)) for t in [i*math.pi/24 for i in range(48)]],c,only)
# ---- слои: функции рисуют поверх base (до обводки)
def legs_a(g):
    for lx in (10,15): g.rect(lx,24+DY,lx,27+DY,OR); g.rect(lx-2,28+DY,lx,28+DY,OR)
def legs_b(g):
    g.rect(11,24+DY,11,27+DY,OR); g.rect(9,28+DY,11,28+DY,OR)
    g.rect(15,24+DY,15,26+DY,OR); g.rect(16,27+DY,16,27+DY,OR); g.rect(15,27+DY,15,27+DY,OR); g.rect(14,28+DY,16,28+DY,'#00000000') if False else None
def legs_fly(g): pass
def eye_closed(g): g.rect(15,5+DY,19,8+DY,B); g.rect(15,8+DY,19,8+DY,OUT)
def beret(g):
    rell(g,14.5,4.6,7.6,3.0,0.2,'#c8335f'); rell(g,15.5,6.6,6.2,1.1,0.2,'#a82a50'); rell(g,11.5,3.0,3.2,1.0,0.2,'#e0517a'); g.rect(14,0,15,1,'#c8335f')
def party(g):  # колпак
    g.poly([(10,7.5),(20,7.5),(15.5,-0.5)],'#5ba3d9'); g.rect(11,5,19,5,'#f6c445'); g.rect(13,2,17,2,'#f6c445'); g.p(13,6,'#e5484d'); g.p(17,6,'#e5484d'); g.p(15,4,'#e5484d')
    g.rect(15,0,16,0,'#ffffff')
def wreath(g):  # венок Лиго: дубовые листья и цветы
    for i,x in enumerate(range(8,23,2)):
        y=6.2-0.9*math.sin((x-8)/14*math.pi)
        g.ell(x+1,y,1.6,1.4,'#4e7a2e' if i%2 else '#6a9a3a')
    for x,c in ((10,'#f6d04d'),(14,'#f28ab2'),(18,'#ffffff'),(21,'#f6d04d')): g.p(x,5,c); g.p(x+1,5,c)
def witch(g):
    g.poly([(11.5,6),(20,6),(17,1),(13,-0.5),(15,2.5)],'#2b2440'); g.ell(15.5,6.6,9,1.5,'#2b2440'); g.rect(12,4,19,4,'#8a63b8')
def santa(g):
    g.poly([(10,7),(20,7),(15,0.5),(10,1.5)],'#d63a3a'); g.ell(16,7,6.5,1.4,'#ffffff'); g.ell(9.5,2,1.5,1.5,'#ffffff')
def scarf(g):
    for x in range(9,23):
        c='#e5484d' if (x//2)%2 else '#f4f1ea'; g.p(x,11+DY,c); g.p(x,12+DY,c)
    g.rect(18,13+DY,19,17+DY,'#e5484d'); g.rect(18,15+DY,19,15+DY,'#f4f1ea'); g.rect(18,18+DY,19,18+DY,'#f6c445')
def shades(g):
    g.rect(14,5+DY,20,8+DY,'#1f1b2e'); g.rect(13,6+DY,14,6+DY,'#1f1b2e'); g.p(15,6+DY,'#8fb3d9'); g.p(19,6+DY,'#8fb3d9')
def groucho(g):  # очки с носом и усами, 1 апреля
    g.rect(14,5+DY,20,8+DY,'#1f1b2e'); g.rect(15,6+DY,19,7+DY,'#ffffff'); g.rect(17,6+DY,18,7+DY,OUT)
    g.ell(22,9+DY,2,1.6,'#e8a07a'); g.rect(19,11+DY,24,11+DY,'#3a2a1e')
def ribbon(g):  # латвийская ленточка 18 ноября
    g.rect(15,13+DY,17,13+DY,'#9e3039'); g.rect(15,14+DY,17,14+DY,'#ffffff'); g.rect(15,15+DY,17,15+DY,'#9e3039')
    g.rect(15,16+DY,15,17+DY,'#9e3039'); g.rect(17,16+DY,17,17+DY,'#9e3039')
def full(*fs):
    g=base()
    for f in fs: f(g)
    g.outline(OUT); return g
ref=full()
cols={}
def ch(c):
    if c not in cols: cols[c]='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[len(cols)]
    return cols[c]
def enc(g,refg=None):
    rows=[]
    for y in range(HEI):
        r=''
        for x in range(WID):
            c=g.a[y][x]
            r+= '.' if c is None or (refg and refg.a[y][x]==c) else ch(c)
        rows.append(r)
    ys=[i for i,r in enumerate(rows) if r.strip('.')]
    if not ys: return '[0,[]]'
    y0,y1=ys[0],ys[-1]
    return '[%d,%s]'%(y0,'['+','.join("'%s'"%r.rstrip('.') for r in rows[y0:y1+1])+']')
LY={'body':enc(ref)}
for n,f in [('legA',legs_a),('legB',legs_b),('closed',eye_closed),('beret',beret),('party',party),('wreath',wreath),('witch',witch),('santa',santa),('scarf',scarf),('shades',shades),('groucho',groucho),('ribbon',ribbon)]:
    LY[n]=enc(full(f),ref)
js='  const PCOL = {%s};\n  const PL = {\n%s\n  };\n'%(', '.join("%s: '%s'"%(v,k) for k,v in cols.items()), ',\n'.join('    %s: %s'%(k,v) for k,v in LY.items()))
open('layers.js','w').write(js); print(len(js))
# превью всех слоёв
from PIL import Image
ims=[full(legs_a,f).img(4) for f in (beret,party,wreath,witch,santa)]+[full(legs_a,beret,f).img(4) for f in (scarf,shades,groucho,ribbon)]+[full(legs_b,beret,eye_closed).img(4)]
s=Image.new('RGB',(sum(i.width+10 for i in ims),160),'#f3eee6'); x=5
for i in ims: s.paste(i,(x,5),i); x+=i.width+10
s.save('layers.png')
