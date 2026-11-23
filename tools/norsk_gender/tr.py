V='aeiouyæøå'
FRONT=('i','y','ei','øy')
OVR={'baby':'бэйби','TV':'те:ве','juice':'ю:с','pizza':'питса','taco':'та:ку','bacon':'бэйкон','cocktail':'коктэйл',
'hamburger':'хамбюргер','kiwi':'хьи:ви','giraff':'шираф','gitar':'гитар','sjokolade':'шукула:де','restaurant':'рестауранг',
'kafé':'кафе:','museum':'мусе:ум','hotell':'хутэл','telefon':'телефу:н','ost':'уст','brunost':'брю:нуст','bad':'ба:д',
'sushi':'су:ши','croissant':'круасанг','baguett':'багет','zombie':'сомби','app':'эпп','video':'ви:деу','e-post':'е:-пост',
'T-bane':'те:-ба:не','T-skjorte':'те:-шуте','taxi':'такси','internett':'интернет','bikini':'бики:ни','chili':'шили',
'pasta':'паста','popkorn':'попкон','bowling':'боулинг','golf':'голф','sport':'спот','brus':'брю:с','jobb':'йобб',
'lunsj':'лёнш','dessert':'десе:р','idé':'иде:','moské':'муске:','ski':'ши:','kino':'хьи:ну','by':'бю:','sko':'ску:',
'skole':'ску:ле','stol':'сту:л','bok':'бу:к','ordbok':'у:рбук','notatbok':'нута:тбук','lommebok':'луммебук','mor':'му:р',
'bror':'бру:р','sønn':'сён','ungdom':'унгдом','onkel':'унгкель','konge':'конге','dronning':'дроннинг','venn':'венн',
'menneske':'меннеске','kjæreste':'хьэресте','gjest':'йест','kvinne':'квинне','jente':'йенте','datter':'даттер','tante':'танте',
'fot':'фу:т','tog':'то:г','fly':'флю:','sol':'су:л','skog':'ску:г','ord':'у:р','fjord':'фью:р','mål':'мо:л','hjul':'юл',
'is':'и:с','sau':'сэу','ku':'кю:','hjem':'йем','hjerte':'йерте','hjerne':'йэне','gjest':'йест','kafé':'кафе:','tre':'тре:',
'te':'те:','salat':'сала:т','tomat':'тума:т','potet':'путе:т','banan':'бана:н','sitron':'ситру:н','appelsin':'аппельси:н',
'melon':'мелу:н','ananas':'ананас','avokado':'авука:ду','paprika':'паприка','kakao':'кака:у','pingvin':'пингви:н',
'papegøye':'папегёйе','elefant':'элефант','giraff':'шираф','sebra':'се:бра','kenguru':'кенгуру','koala':'куа:ла',
'krokodille':'крукудилле','dinosaur':'динусэур','flamingo':'фламингу','kamel':'каме:л','leopard':'леупа:р','gorilla':'гурилла',
'panda':'панда','lama':'ла:ма','delfin':'делфи:н','student':'стюдент','eksamen':'эксамен','kalkulator':'калькюла:тур',
'mikroskop':'микруско:п','teleskop':'телеско:п','universitet':'юнивэшите:т','bibliotek':'библиуте:к','apotek':'апуте:к',
'teater':'теа:тер','stadion':'ста:диун','statue':'ста:тюе','stasjon':'сташу:н','invitasjon':'инвиташу:н','familie':'фами:лие',
'adresse':'адресе','melding':'меллинг','passord':'пассу:р','nummer':'нуммер','medisin':'медиси:н','termometer':'тэрмуме:тер',
'ambulanse':'амбюлансе','helikopter':'хеликоптер','rakett':'ракетт','satellitt':'сателлитт','traktor':'трактур',
'politimann':'полити:манн','politibil':'полити:би:л','politistasjon':'полити:сташу:н','programmerer':'пруграме:рер',
'mekaniker':'мека:никер','astronaut':'аструнэут','journalist':'шюрналист','fotograf':'фотугра:ф','servitør':'сервитё:р',
'sjåfør':'шуфё:р','frisør':'фрисё:р','pensjonist':'паншунист','turist':'тюрист','kollega':'кулле:га','detektiv':'детекти:в',
'soldat':'сулда:т','pirat':'пира:т','vampyr':'вампю:р','robot':'ро:бот','orangutang':'урангутанг','skorpion':'скурпиу:н',
'kakerlakk':'какерлакк','mammut':'маммют','synagoge':'синагу:ге','tempel':'темпель','karusell':'карюселль','akvarium':'аква:риум',
'konsert':'кунсэт','mikrofon':'микруфу:н','fiolin':'фиули:н','trompet':'трумпе:т','basseng':'бассенг','pokal':'пука:л',
'sirkus':'сиркус','robot':'ру:бут','hobby':'хобби','planet':'плане:т','vulkan':'вюлка:н','kaktus':'кактус','tulipan':'тюлипа:н',
'magnet':'магне:т','kompass':'кумпасс','batteri':'баттери:','radio':'ра:диу','kamera':'ка:мера','datamaskin':'да:тамаши:н',
'tastatur':'тастатю:р','paraply':'параплю:','ballong':'баллонг','sandal':'санда:л','genser':'генсер','koffert':'куффэт',
'billett':'билетт','kano':'ка:ну','ferje':'ферье','sjakk':'шакк','dukke':'дукке','bamse':'бамсе','klovn':'клоун','troll':'тролл',
'hilsen':'хилсен','samtale':'са:мта:ле','problem':'пруббле:м','overraskelse':'о:верраскелсе','hemmelighet':'хеммелихет',
'kjærlighet':'хьэлихет','leilighet':'лейлихет','fremtid':'фремти:д','midnatt':'ми:днатт','ettermiddag':'эттермидда',
'kveld':'квелль','dag':'да:г','middag':'мидда','frokost':'фру:кост','morgen':'му:рн','døgn':'дёйн','dato':'да:ту','måned':'мо:нед',
'høst':'хёст','vinter':'винтер','sommer':'соммер','vår':'во:р','vær':'вэ:р','regn':'рэйн','snø':'снё:','sky':'шю:','tåke':'то:ке',
'storm':'сторм','regnbue':'рэйнбю:е','lyn':'лю:н','nordlys':'ну:рлю:с','himmel':'химмель','stjerne':'стьэне','måne':'мо:не',
'jord':'ю:р','verden':'вэрден','land':'ланн','kart':'кат','by':'бю:','gate':'га:те','bygd':'бюгд','vei':'вэй','bygning':'бюгнинг',
'hage':'ха:ге','hytte':'хютте','rom':'румм','soverom':'со:верумм','stue':'стю:е','dør':'дё:р','vindu':'винду','vegg':'вегг',
'trapp':'трапп','heis':'хэйс','seng':'сенг','skap':'ска:п','speil':'спэйл','lampe':'лампе','peis':'пэйс','vase':'ва:се',
'klokke':'клокке','dusj':'дюш','såpe':'со:пе','kost':'куст','bøtte':'бётте','nøkkel':'нёккель','lås':'ло:с','pose':'пу:се',
'pris':'при:с','krone':'кру:не','seddel':'седдель','kort':'кот','kvittering':'квитте:ринг','lønn':'лённ','hund':'хюнн',
'katt':'катт','hest':'хест','gris':'гри:с','geit':'йэйт','høne':'хё:не','and':'анн','mus':'мю:с','rotte':'ротте','ekorn':'э:кун',
'bjørn':'бьённ','isbjørn':'и:сбьённ','elg':'элг','reinsdyr':'рэйнсдю:р','ulv':'юлв','rev':'ре:в','løve':'лё:ве','tiger':'ти:гер',
'ape':'а:пе','slange':'сланге','øgle':'ёйле','frosk':'фрошк','skilpadde':'шилпадде','drage':'дра:ге','enhjørning':'э:нйённинг',
'fugl':'фю:л','hane':'ха:не','svane':'сва:не','due':'дю:е','ugle':'ю:гле','ørn':'ённ','påfugl':'по:фю:л','kalkun':'калкю:н',
'sommerfugl':'соммерфю:л','bie':'би:е','maur':'мэур','edderkopp':'эддеркопп','mygg':'мюгг','flue':'флю:е','marihøne':'ма:рихё:не',
'snegl':'снэйл','larve':'ларве','orm':'орм','flaggermus':'флаггермю:с','fisk':'фиск','hval':'ва:л','hai':'хай','sel':'се:л',
'kusine':'кюси:не','kanin':'кани:н','papir':'папи:р','avis':'ави:с','pilot':'пилу:т','musikk':'мюсик','piano':'пиа:ну','bukett':'бюкет','minutt':'минют','sekund':'секюн','butikk':'бютик','supermarked':'сю:пермаркед','bakeri':'бакери:','kontor':'кунту:р','postkontor':'постконту:р','negl':'нэйл','tegning':'тэйнинг','tegnestift':'тэйнестифт','godteri':'готери:','fyrverkeri':'фюрверкери:','berg-og-dal-bane':'бэрг-о-да:л-ба:не','solhatt':'су:лхат','solsikke':'су:лсике','postbud':'постбю:д','bursdag':'бюшда','bukse':'буксе','herre':'хэре','skjelett':'шелет','elev':'эле:в','agurk':'агюрк','hockeykølle':'хокикёле','volleyball':'волибал','surfebrett':'сёрфебрет','romskip':'румшип','romvesen':'румве:сен','fotgjengerfelt':'фу:тйенгерфельт','pariserhjul':'пари:серю:л','toalett':'туалет','stearinlys':'стеари:нлю:с','flodhest':'флу:дхест','ferie':'фе:рие','historie':'хисту:рие','vannmelon':'ванмелу:н','jordbær':'ю:рбэр','fersken':'фэшкен','sverd':'свэ:р','kirkegård':'хьиркего:р','eventyr':'э:вентю:р','kebab':'кеба:б','smultring':'смюлтринг','lunsj':'лёнш','dorull':'ду:рюл','grønnsak':'грёнса:к','ingefær':'ингефэ:р','bestefar':'бестефа:р','bestemor':'бестему:р','ektepar':'эктепа:р','barnebarn':'ба:небан','matpakke':'ма:тпаке','pannekake':'панека:ке','pepperkake':'пеперка:ке','frokost':'фру:кост','sykehus':'сю:кехю:с','kjøleskap':'хьё:леска:п','tekanne':'те:кане','spisepinne':'спи:сепине','flyplass':'флю:плас','lastebil':'ластеби:л','brannbil':'бранби:л','motorsykkel':'му:туршюкель','dyrehage':'дю:реха:ге','barnehage':'ба:неха:ге','snømann':'снё:ман','timeglass':'ти:меглас','kokosnøtt':'ку:куснёт','blåbær':'бло:бэр','kirsebær':'хьишебэр','tordenvær':'тордэнвэ:р','snøbrett':'снё:брет','rullestol':'рюлесту:л','hodepine':'ху:депи:не','tannlege':'танле:ге','skrutrekker':'скрю:трекер','postkasse':'посткасе','parkeringsplass':'парке:рингсплас','bensinstasjon':'бенси:нсташу:н','lyskryss':'лю:скрюс','sjøstjerne':'шё:стьэне',
'jernbane':'йэ:нба:не','hjelm':'йельм','hjelp':'йельп','jente':'йенте',
'blekksprut':'блекспрю:т','krabbe':'краббе','hummer':'хуммер','østers':'ёстеш','sjøstjerne':'шё:стьэне',
}
import re
def tr(w):
    return re.sub(r'([бвгджзклмнпрстфхцчшщ])\1',r'\1',tr0(w))
def tr0(w):
    if w in OVR: return OVR[w]
    s=w.lower(); out=''; i=0; first=True
    def nxt(k): return s[i+k:i+k+1]
    # длина первого гласного
    m=[j for j,ch in enumerate(s) if ch in V]
    longpos=None
    if m:
        j=m[0]
        if s[j:j+2] not in ('ei','øy','au','ai'):
            k=j+1;c=0
            while k<len(s) and s[k] not in V and s[k]!='-': c+=1;k+=1
            if c<=1 and len(s)>1: longpos=j
    while i<len(s):
        ch=s[i]; two=s[i:i+2]; three=s[i:i+3]
        start=(i==0 or s[i-1]=='-')
        prev=s[i-1] if i>0 else ''
        if three=='skj': out+='ш';i+=3;continue
        if two in('sj',): out+='ш';i+=2;continue
        if two=='sk' and any(s[i+2:].startswith(f) for f in FRONT): out+='ш';i+=2;continue
        if two in('kj','tj'): out+='хь';i+=2;continue
        if two=='gj': out+='й';i+=2;continue
        if two in('hj','hv') and start: i+=1;continue
        if ch=='k' and start and any(s[i+1:].startswith(f) for f in FRONT): out+='хь';i+=1;continue
        if ch=='g' and start and any(s[i+1:].startswith(f) for f in FRONT): out+='й';i+=1;continue
        if two=='rs': out+='ш';i+=2;continue
        if two in('rt','rn','rl'): out+={'rt':'т','rn':'н','rl':'л'}[two];i+=2;continue
        if two=='rd': out+='р';i+=2;continue
        if two=='ld' and (i+2==len(s)): out+='ль';i+=2;continue
        if two=='nd': out+='нн';i+=2;continue
        if two=='ig' and i+2==len(s): out+='и';i+=2;continue
        if ch=='d' and i==len(s)-1 and prev in V: i+=1;continue
        if two=='ei': out+=('эй' if start or prev in V else 'эй');i+=2;continue
        if two=='øy': out+='ёй';i+=2;continue
        if two=='au': out+='эу';i+=2;continue
        if two=='ai': out+='ай';i+=2;continue
        if ch=='j' and nxt(1) in V:
            v=nxt(1); out+=('ь' if out and out[-1] not in 'аеёиоуыэюяй:-' else '')+{'a':'я','e':'е','o':'ю','u':'ю','ø':'ё','å':'йо','i':'йи','æ':'э','y':'ю'}[v]
            if i+1==longpos: out+=':'
            i+=2;continue
        if ch in V:
            if ch=='o':
                k=i+1;c=0
                while k<len(s) and s[k] not in V: c+=1;k+=1
                r='о' if c>=2 else 'у'
            elif ch=='e': r='э' if start else ('э' if (nxt(1)=='r' and (i+2>=len(s) or s[i+2] not in V)) else 'е')
            else: r={'a':'а','i':'и','u':'ю','y':'ю','æ':'э','ø':'ё','å':'о'}[ch]
            out+=r+(':' if i==longpos else ''); i+=1;continue
        if ch==nxt(1) and ch not in V: i+=1;continue   # двойные — одной буквой
        if ch=='l' and prev in 'eiyøæ' and (i==len(s)-1 or nxt(1) not in V): out+='ль';i+=1;continue
        if two=='ng': out+='нг';i+=2;continue
        out+={'b':'б','c':'к','d':'д','f':'ф','g':'г','h':'х','j':'й','k':'к','l':'л','m':'м','n':'н','p':'п','q':'к','r':'р','s':'с','t':'т','v':'в','w':'в','x':'кс','z':'с','-':'-'}.get(ch,ch); i+=1
    return out
