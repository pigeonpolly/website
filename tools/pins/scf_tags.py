# Разметка базы «🐸 ENG Media…» (28.11.2026): Тип/Сезон/Праздник/📅 по содержанию пина.
# python3 tools/pins/scf_tags.py db.json out.json — db.json: строки базы (view ALL, ключ = ID), out: {ID: {tp,s,h,spec}}.
import json,re,collections,sys
rows=json.load(open(sys.argv[1]))
def txt(r,full=False):
    a=' '.join([r.get('Номер пина и его содержимое') or '', r.get('Pin Title') or ''])
    if full: a+=' '+(r.get('Pin Description') or '')+' '+(r.get('Facebook Post Text') or '')[:400]
    return a
def has(p,s): return re.search(p,s,re.I)
HOL=[ # (name, regex on title-ish, season)
 ('Хеллоуин', r'hallowe|spooky|ghost|witch|хеллоуин|trick.or.treat|\bOctober 31', 'Осень'),
 ('День благодарения', r'thanksgiving|friendsgiving|день благодарения', 'Осень'),
 ('День всех влюбленных', r'valentin|влюбл|galentine', 'Зима'),
 ('Китайский Новый год', r'lunar new year|chinese new year|year of the (goat|horse|snake)|китайск', 'Зима'),
 ('Зимнее солнцестояние', r'solstice|солнцесто|yule', 'Зима'),
 ('Новый год и Рождество', r'christmas|xmas|new year|santa|advent|holiday card|ornament|gingerbread|рожд|новый год|адвент|nye|ugly sweater|three kings|jo-ho-ho|festive|stocking|snowman|winter holiday|holiday latte', 'Зима'),
 ('8 Марта', r"women.s day|march 8|8 марта", 'Весна'),
 ('Пасха', r'easter|пасх', 'Весна'),
 ('Черная пятница и 11.11', r'black friday|11\.11|singles.? day|cyber monday', 'Осень'),
 ('Мой день рождения', r'my birthday|мой день рожд', None),
]
DAYS=r"world [a-z ]+ day|international [a-z ]+ day|earth hour|april 1|april fool|may the 4th|star wars day|labou?r day|may day|bird day|art day|emoji day|cat day|friend(s|ship) day|lazy day|book giving|cancer day|teacher.?s day|mother.?s day|father.?s day|pi day|day of the dead|back to school|tax day|leap day|national [a-z ]+ day|pancake day|world kindness"
SPECIFIC=r"(prompt for|for) (january|february|march|april|may|june|july|august|september|october|november|december) \d|window \d+|\bwindow \d|december \d{1,2}\b(?!\d)|on (january|february|march|april|may|june|july|august|september|october|november|december) \d|11\.11|april 1st|may the 4th|earth hour|"+DAYS
SEAS=[('Зима',r'winter|snow|frost|december|january|february|sled|mitten|cocoa|hot chocolate|северн|зим|north(ern)? lights|hygge|blizzard|ski\b|январ|декабр|феврал'),
 ('Осень',r'autumn|\bfall\b|october|november|september|pumpkin|harvest|autumn leaves|persimmon|rowan|mushroom season|осен|октябр|ноябр|сентябр|back to school|rain season|cozy autumn'),
 ('Весна',r'spring|\bmarch\b|\bapril\b|blossom|tulip|easter|весн|март|апрел|cherry blossom'),
 ('Лето',r'summer|june|july|august|beach|ice cream|cloudberr|picnic|лет[оа]|июн|июл|август|sunflower|swim')]
def typ(r):
    t=txt(r); l=(r.get('Pin Link (куда ведет)') or '').lower(); old=r.get('Тип')
    if 'ko-fi.com' in l: return 'Ko-Fi платные материалы'
    if 'a.co/' in l or 'amazon.' in l or '/books' in l or '/e-books' in l or has(r'creative guide|e-?book',t): return 'Книги'
    if has(r'\bquote|цитат',t): return 'Мемы'
    if has(r'website|сайт',t) and not has(r'palette',t): return 'Новости сайта' if not has(r'pixel|game',t) else 'Игры'
    if has(r'things to draw|drawing prompts?|prompts? (list|for)|\bbingo\b|drawing challenge|\d+[- ]day .*challenge|темы|how to paint|how to draw|in \d+ (easy )?steps|\d+ (easy )?steps',t): return 'Лайфхаки'
    if has(r'\bmeme\b|\bPOV\b|^\w*\d*\. (Me[: ]|When )|мем|relatable|\bfunny\b|\bvs\.? ',t): return 'Мемы'
    if has(r'colou?r palette|palette (with|for|from|challenge)|\d-colou?r|HEX|colou?r scheme|colou?r combination|swatches|pigment|how to mix|\bP[BGRY]\d|палитр|colou?r mixing|colors? of|palette:|palette —|moody palette|cozy palette|warm palette|balanced palette',t): return 'Палитры'
    if has(r'calendar|coloring|colouring|printable|wallpaper|advent|e-?card|postcard|card for|\bcard\b|freebie|раскраск|календар|открытк|заставк|goal pages|send (a|an|it)\b',t) or '/freebies' in l or '/postcards' in l or '/advent' in l: return 'Бесплатные материалы'
    if has(r'\bgames?\b|spot the|differences|wobbleland|pixel|titos|игр|potion|find polly|maze|cozy fantasy town|fantasy prison',t) or '/games' in l or '/wobbleland' in l or '/titos' in l: return 'Игры'
    if has(r'prompts?|\bchallenge\b|\bideas\b|\btips\b|how to|\blessons?\b|technique|\bguide\b|what to draw|\brules\b|explained|basics|идея|draw your|sketch plan|\blist\b|beginner',t) or '/prompts' in l or '/learn' in l: return 'Лайфхаки'
    if '/palettes' in l or '/color-mixing' in l: return 'Палитры'
    if old in ('Новости сайта',): return old
    if old in ('Игры','Ko-Fi платные материалы','Книги','Праздники',None,'Палитры'): return 'Лайфстайл художника'
    return old
def hol(r):
    t=txt(r)
    for name,p,s in HOL:
        if has(p,t): return name,s
    if has(DAYS,t): return 'Памятные дни (World … Day)',None
    return 'Без привязки к празднику',None
def season(r,hs):
    if hs: return hs
    t=txt(r)
    hits=[s for s,p in SEAS if has(p,t)]
    if len(hits)==1: return hits[0]
    if len(hits)>1:
        # choose the one hit in title first
        th=[s for s,p in SEAS if has(p,txt(r))]
        if len(th)==1: return th[0]
        return r.get('Сезон') if r.get('Сезон') in hits else hits[0]
    o=r.get('Сезон')
    return o if o and o!='Не смог определить' else 'Круглый год'
out={}
for k,r in rows.items():
    h,hs=hol(r); tp=typ(r); s=season(r,hs)
    spec=bool(has(SPECIFIC,txt(r)))
    out[k]=dict(tp=tp,s=s,h=h,spec=spec)
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False)

# ---- overrides ----
H27=json.load(open('/home/user/website/tools/pins/holidays27.json'))
h27={x['n']:x for x in H27}
MAPH={'Women':'8 Марта','Halloween':'Хеллоуин','Valentine':'День всех влюбленных','11.11':'Черная пятница и 11.11','Black Friday':'Черная пятница и 11.11'}
NICHE='Международные дни'
def pnum(r):
    m=re.match(r'P(\d+)\.',r['Номер пина и его содержимое']); return int(m.group(1)) if m else None
ROUND=set(map(str,[20,76,53,31,280,1644,311,784,1492,1349,407,1311,209,297,1376,433,910,1519,1428,1283,1040,1547,671,222,
 497,1124,202,1222,419,330,190,1643,409,966,1559,1440,968,1522,1350,1539,1264,1541,983,1463,810,1220,1595,580,1006,548,702,1297,628,933,904,1652,
 1403,1133,1219,253,536,1196,858,666,820,834,1065,360,1329,875,
 1392,583,683,606,863,1616,1130,177,1503,1099,651,408,1528,873,689,
 22,49,39,25,1337,1184,1388,12,1422,1046,1320]))
SEASON_FIX={'229':'Весна','89':'Зима','1642':'Осень','993':'Осень','486':'Весна','986':'Осень'}
for k,r in rows.items():
    o=out[k]
    if o['h']=='Памятные дни (World … Day)': o['h']=NICHE
    n=pnum(r)
    if n in h27:
        hol=h27[n]['holiday']; o['s']=h27[n]['season']
        o['h']=next((v for kk,v in MAPH.items() if kk in hol),NICHE)
        o['spec']= o['h'] in (NICHE,) or '11.11' in hol
    if k in ROUND and o['h']=='Без привязки к празднику': o['s']='Круглый год'
    if k in SEASON_FIX: o['s']=SEASON_FIX[k]
    if o['h']=='Без привязки к празднику' and r.get('Праздник') not in (None,'Без привязки к празднику'): o['h']=r['Праздник']; o['s']=r.get('Сезон') or o['s']
    if k in ('89',): o['h']='Без привязки к празднику'; o['s']='Зима'
    if k in ('1337',): o['h']='Без привязки к празднику'; o['s']='Круглый год'
    if o['h']=='Без привязки к празднику' and o['spec'] and not has(r'window \d|prompt for|december \d|11\.11',txt(r)): pass
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False)
