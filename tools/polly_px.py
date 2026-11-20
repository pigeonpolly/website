from PIL import Image
import math
class G:
    def __init__(s,w,h): s.w,s.h=w,h; s.a=[[None]*w for _ in range(h)]
    def p(s,x,y,c):
        if 0<=x<s.w and 0<=y<s.h: s.a[y][x]=c
    def ell(s,cx,cy,rx,ry,c,only=None):
        for y in range(s.h):
            for x in range(s.w):
                if ((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1:
                    if only is None or s.a[y][x] in only: s.a[y][x]=c
    def rect(s,x0,y0,x1,y1,c):
        for y in range(y0,y1+1):
            for x in range(x0,x1+1): s.p(x,y,c)
    def poly(s,pts,c,only=None):
        for y in range(s.h):
            for x in range(s.w):
                px,py=x+.5,y+.5; ins=False; j=len(pts)-1
                for i in range(len(pts)):
                    xi,yi=pts[i];xj,yj=pts[j]
                    if (yi>py)!=(yj>py) and px<(xj-xi)*(py-yi)/(yj-yi)+xi: ins=not ins
                    j=i
                if ins and (only is None or s.a[y][x] in only): s.a[y][x]=c
    def outline(s,c,diag=False):
        n=[(1,0),(-1,0),(0,1),(0,-1)]+([(1,1),(-1,-1),(1,-1),(-1,1)] if diag else [])
        add=[]
        for y in range(s.h):
            for x in range(s.w):
                if s.a[y][x] is None and any(0<=x+dx<s.w and 0<=y+dy<s.h and s.a[y+dy][x+dx] not in (None,c) for dx,dy in n): add.append((x,y))
        for x,y in add: s.a[y][x]=c
    def img(s,k):
        im=Image.new('RGBA',(s.w,s.h),(0,0,0,0))
        for y in range(s.h):
            for x in range(s.w):
                if s.a[y][x]: im.putpixel((x,y),Image.new('RGB',(1,1),s.a[y][x]).getpixel((0,0))+(255,))
        return im.resize((s.w*k,s.h*k),Image.NEAREST)
