# Транскрипция слов второй подборки (служебные и частые — по словарю, остальное по правилам tr.py)
from tr import tr as tr1
X = dict(x.split('=') for x in """jeg=яй du=дю: han=хан hun=хюн den=ден det=де: vi=ви: dere=де:ре de=ди: meg=мэй deg=дэй ham=хам henne=хене oss=ос dem=дем seg=сэй
min=мин din=дин hans=ханс hennes=хенес vår=во:р deres=де:рес sin=син denne=дене der=дэр alle=але noen=ну:ен ingen=инген alt=алт ingenting=ингентинг
noe=ну:е hver=вэр annen=а:ен selv=сэл hva=ва hvem=вем hvor=вур fra=фра: når=нор hvorfor=вурфор hvordan=вурдан hvilken=вилкен mye=мю:е mange=манге
gammel=гамель slags=слакс hei=хэй hallo=халу: god=гу: morgen=мо:рн dag=да:г kveld=квель natt=нат ha=ха: bra=бра: ses=се:с velkommen=велкомен
takk=так tusen=тю:сен for=фор maten=ма:тен vær=вэ så=со snill=снил unnskyld=юншюл beklager=бекла:гер årsak=о:шак ja=я: nei=нэй kanskje=каншье
ok=оке:й selvfølgelig=сельфёлгели gratulerer=гратюле:рер med=ме: dagen=да:ген jul=ю:л godt=гот nytt=нют år=о:р tur=тю:р bedring=бедринг lykke=люке
til=тиль skål=ско:л kos=ку:с går=го:р bare=ба:ре heter=хе:тер forstår=фошто:р ikke=ике kan=кан gjenta=йента snakker=снакер engelsk=энгельск
koster=костер hjelp=йельп null=нюл en=е:н to=ту: tre=тре: fire=фи:ре fem=фем seks=сэкс sju=шю: åtte=оте ni=ни: ti=ти: elleve=эльве tolv=тол
tretten=третен fjorten=фьютен femten=фемтен seksten=сэйстен sytten=сютен atten=атен nitten=нитен tjue=хьюе tjueen=хьюе-е:н tretti=трети førti=фёти
femti=фемти seksti=сэксти sytti=сюти åtti=оти nitti=нити hundre=хюндре million=милиу:н halv=хал kvart=кват første=фёште andre=андре tredje=тре:дье
fjerde=фьере femte=фемте sjette=шете sjuende=шю:ене åttende=отене niende=ни:ене tiende=ти:ене tjuende=хьюене siste=систе klokka=клока er=эр
over=о:вер på=по: presis=преси:с mandag=манда tirsdag=ти:шда onsdag=унсда torsdag=то:шда fredag=фре:да lørdag=лёрда søndag=сёнда januar=януа:р
februar=фебрюа:р mars=маш april=април mai=май juni=ю:ни juli=ю:ли august=эугюст september=септембер oktober=октобер november=новембер desember=десембер
nå=но: i=и overmorgen=о:вермо:рн forgårs=форгош morges=мо:рес snart=снат senere=се:нере tidlig=ти:ли sent=се:нт før=фёр etterpå=этерпо først=фёшт
slutt=слют allerede=алере:де ennå=эно fortsatt=фотсат igjen=ийен alltid=алти ofte=офте vanligvis=ва:нливис ganger=гангер sjelden=шелен aldri=алдри
lenge=ленге plutselig=плютсели endelig=эндели gang=ганг rød=рё: oransje=оранше gul=гю:л grønn=грён blå=бло: lilla=лила rosa=ру:са brun=брю:н
svart=сват hvit=ви:т grå=гро: lys=лю:с mørk=мёрк fargerik=фаргери:к gull=гюл sølv=сёл under=юнер ved=ве: siden=си:ден av=а: bak=ба:к foran=форан
mellom=мелом rundt=рюнт utenfor=ю:тенфор hos=хус blant=блант langs=лангс gjennom=йеном (broen)=(бру:ен) mot=му:т uten=ю:тен om=ом etter=этер fram=фрам
per=пер hit=хит dit=дит her=хэр inn=ин ut=ю:т inne=ине ute=ю:те opp=оп ned=не: oppe=опе nede=не:де hjem=йем hjemme=йеме borte=боте overalt=о:вералт
langt=лангт nær=нэ:р venstre=венстре høyre=хёйре rett=рет og=о: eller=элер men=мен fordi=форди: at=ат som=сом hvis=вис da=да: mens=менс enten=энтен
både=бо:де også=осо nesten=нестен ganske=ганске veldig=вели litt=лит få=фо: mer=ме:р mest=мест mindre=миндре nok=нок altså=алтсо jo=ю: vel=вель
sikkert=сикерт heldigvis=хелдивис dessverre=десвере gjerne=йэне sammen=самен alene=але:не dårlig=до:ли riktig=рикти feil=фэйл høyt=хёйт lavt=ла:вт
stille=стиле forsiktig=форсикти nøye=нёйе lett=лет vanskelig=ванскели annerledes=а:нерле:дес slik=слик helt=хе:лт akkurat=акюра:т egentlig=э:гентли
faktisk=фактиск sannsynligvis=сансю:нливис særlig=сэ:рли spesielt=спесиэлт omtrent=омтрент ellers=элеш derfor=дэрфор være=вэ:ре gjøre=йёре si=си:
vite=ви:те spørre=спёре skulle=скюле kunne=кюне ville=виле måtte=моте burde=бюрде bli=бли: gå=го: se=се: le=ле: ta=та: gi=йи: dø=дё: bo=бу: sy=сю:
snu=сню: tro=тру: sove=со:ве lyve=лю:ве legge=леге selge=селье velge=велье synes=сю:нес høre=хё:ре fortelle=фортеле glede=гле:де kjenne=хьене
kjøre=хьё:ре kjøpe=хьё:пе kjede=хье:де synge=сюнге skje=ше: hete=хе:те eie=эйе skjære=шэ:ре bestille=бестиле betale=бета:ле bordet=бу:ре
lyst=люст stå=сто: lage=ла:ге mat=ма:т tennene=тенене kle=кле: frokost=фру:кост jobb=йоб komme=коме støvsuge=стёвсю:ге hvile=ви:ле slå=сло:
bruke=брю:ке tid=ти: gjest=йест bekymre=бекюмре trøste=трёсте klemme=клеме kysse=хьюсе stole=сту:ле ønske=ёнске elske=элске savne=савне gråte=гро:те
håpe=хо:пе smile=сми:ле hate=ха:те like=ли:ке ringe=ринге vise=ви:се holde=холе hente=хенте bringe=бринге sende=сене prøve=прё:ве begynne=бейине
slutte=слюте fortsette=фотсете vente=венте bety=бетю: finne=фине lete=ле:те miste=мисте trenge=тренге sette=сете tenke=тенке mene=ме:не huske=хюске
glemme=глеме lære=лэ:ре studere=стюде:ре øve=ё:ве undervise=юнервисе bestemme=бестеме planlegge=пла:нлеге lure=лю:ре takke=таке hilse=хилсе
invitere=инвите:ре be=бе: love=ло:ве krangle=крангле forklare=форкла:ре oversette=о:версете uttale=ю:тта:ле stave=ста:ве rope=ру:пе hviske=виске
lytte=люте lese=ле:се skrive=скри:ве svare=сва:ре prate=пра:те snakke=снаке fiske=фиске strikke=стрике plukke=плюке feire=фэйре kose=ку:се
gøy=гёй bilder=бильдер musikk=мюсик film=фильм campe=кемпе bade=ба:де sole=су:ле danse=дансе spille=спиле leke=ле:ке regne=рэйне snø=снё:
blåse=бло:се skinne=шине fryse=фрю:се smelte=смелте tordne=то:дне jobbe=йобе arbeide=арбэйде tjene=хье:не spare=спа:ре låne=ло:не penger=пенгер
søke=сё:ке ansette=а:нсете bygge=бюге reparere=репаре:ре male=ма:ле tegne=тэйне hjelpe=йельпе samarbeide=самарбэйде lede=ле:де vinne=вине tape=та:пе
lukte=люкте føle=фё:ле puste=пюсте hoste=хусте nyse=ню:се vondt=вунт skade=ска:де frisk=фриск trene=тре:не vokse=вoксе våkne=вокне dusje=дюше
vaske=васке pusse=пюсе spise=спи:се drikke=дрике smake=сма:ке koke=ку:ке steke=сте:ке bake=ба:ке blande=бланне helle=хеле dekke=деке
løpe=лё:пе springe=спринге hoppe=хопе kjøre=хьё:ре sykle=сюкле fly=флю: svømme=свёме reise=рэйсе dra=дра: ankomme=анкоме bytte=бюте rekke=реке
møte=мё:те besøke=бесё:ке følge=фёлье stoppe=стопе parkere=парке:ре krysse=крюсе klatre=клатре falle=фале sitte=сите ligge=лиге
god=гу: glad=гла: lei=лэй trøtt=трёт sjalu=шалю: nysgjerrig=нюшери ærlig=э:ли heldig=хелди vennlig=венли hyggelig=хюгели tålmodig=то:лму:ди
fornøyd=форнёйд deilig=дэйли vanlig=ва:нли mulig=мю:ли umulig=ю:мю:ли hemmelig=хемели farlig=фа:ли viktig=викти kjedelig=хье:дели lykkelig=люкели
nyttig=нюти enkel=энкель rar=ра:р klok=клу:к smart=смат dum=дюм stor=сту:р liten=ли:тен høy=хёй lav=ла:в lang=ланг kort=кот tykk=тюк tynn=тюн
bred=бре: smal=сма:л tung=тюнг pen=пе:н vakker=вакер søt=сё:т stygg=стюг sterk=стэрк svak=сва:к rund=рюн flat=флат spiss=спис skarp=скарп
myk=мю:к hard=ха:р glatt=глат våt=во:т tørr=тёр full=фюл tom=том åpen=о:пен stengt=стенгт ødelagt=ё:делагт hel=хе:л bråkete=бро:кете rik=ри:к
fattig=фати dyr=дю:р billig=били gratis=гра:тис samme=саме lik=ли:к ekte=экте trygg=трюг berømt=берёмт spesiell=спесиэл perfekt=перфект
travel=тра:вель ledig=ле:ди opptatt=оптат ferdig=фэрди klar=кла:р ren=ре:н skitten=шитен ryddig=рюди rotete=ру:тете koselig=ку:сели
hjemmekoselig=йемеку:сели sulten=сюлтен tørst=тёшт mett=мет sur=сю:р salt=салт bitter=битер fersk=фэшк kokt=кукт stekt=стект rå=ро: varm=варм
kald=кал lunken=люнкен vegetarisk=вегета:риск sunn=сюн usunn=ю:сюн rask=раск langsom=лангсом fjern=фьэн direkte=директе forsinket=форсинкет
fort=фут sakte=сакте fots=фу:тс buss=бюс enig=е:ни uenig=ю:е:ни sikker=сикер usikker=ю:сикер interessant=интересант morsom=му:шом trist=трист
sint=синт redd=ред nervøs=нэрвё:с rolig=ру:ли sliten=сли:тен overrasket=о:верраскет stolt=столт forelsket=форэлскет flau=флэу sjenert=шене:т
modig=му:ди slem=слем flink=флинк lat=ла:т flittig=флити skuffet=скюфет ensom=е:нсом syk=сю:к skadet=ска:дет svimmel=свимель blind=блинн døv=дё:в
gravid=грави:д naken=на:кен fysisk=фю:сиск ansatt=ансат arbeidsledig=арбэйдсле:ди profesjonell=профешунэл effektiv=эфекти:в spennende=спенене
avslappende=а:вслапене populær=попюлэ:р kreativ=креати:в kjølig=хьё:ли mild=милл solrik=су:лри:к overskyet=о:вершю:ет tåkete=то:кете
vindfull=винфюл regnfull=рэйнфюл pent=пе:нт stygt=стюкт firkantet=фиркантет praktisk=практиск dømme=дёме e-post=е:-пост gjenta=йента
smart=смат enkel=энкель annerledes=а:нерле:дес brøk=брёк lyse=лю:се tennene=тенене frisk=фриск bilder=бильдер engelsk=энгельск
""".split())
def tr(phrase):
    out=[]
    for w in phrase.split():
        if w in ('…','…?'): out.append(w); continue
        lw=w.lower()
        out.append(X.get(lw) or tr1(lw))
    return ' '.join(out)
# настоящее время глагола
PRES={'være':'er','gjøre':'gjør','spørre':'spør','vite':'vet','si':'sier','skulle':'skal','kunne':'kan','ville':'vil','måtte':'må','burde':'bør','synes':'synes'}
def pres(v):
    w=v.split(' ',1); h=w[0]
    p=PRES.get(h) or (h if h.endswith('s') else h+'r')
    return ' '.join([p]+w[1:])
