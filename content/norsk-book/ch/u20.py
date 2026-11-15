CH = dict(n=20, lvl='A2', place='Nordkapp', title='Nordkapp!', lv='Ceļojuma beigas')

PAGES = [
 [opener(CH), scene('scenes/u20.svg'),
  goals(['runāt par atmiņām un piedzīvoto;', 'atgriezeniskos darbības vārdus: <span class="nw">å glede seg, å føle seg</span>;',
         'vietniekvārdus <span class="nw">meg, deg, seg, oss</span>;', 'uzrakstīt vēstuli: <span class="nw">Kjære … / Hilsen …</span>;', 'atkārtot visu A2 gramatiku.'], 'maps/route-20.svg'),
  say('<span class="nw">Hei fra Nordkapp!</span> Esmu sasniedzis Eiropas ziemeļu malu. Pusnaktī, bet saule spīd! Ceļojums ir galā… Un tad pēkšņi kāds man uzsauc no aizmugures. Vai jūs uzminēsiet, kas?')],

 [sec('20A', 'Ordforråd', 'Vārdu krājums: ceļojums un atmiņas', first=True),
  vocab([('et minne', 'et ˈmine', 'atmiņa'), ('å huske', 'o ˈhuske', 'atcerēties'), ('å glemme', 'o ˈgleme', 'aizmirst'), ('ei/en opplevelse', 'æi ˈople:velse', 'piedzīvojums'),
         ('å oppleve', 'o ˈople:ve', 'piedzīvot'), ('et eventyr', 'et ˈe:ventü:r', 'piedzīvojums; pasaka'), ('å savne', 'o ˈsavne', 'ilgoties pēc'), ('å takke', 'o ˈtake', 'pateikties'),
         ('et brev', 'et bre:v', 'vēstule'), ('et postkort', 'et ˈpostkot', 'pastkarte'), ('å møtes', 'o ˈmø:tes', 'satikties'), ('for alltid', 'for ˈalti', 'uz visiem laikiem'),
         ('å glede seg til', 'o ˈgle:de sæi til', 'priecāties par (gaidāmo)'), ('å føle seg', 'o ˈfø:le sæi', 'justies'), ('å sette seg', 'o ˈsete sæi', 'apsēsties'),
         ('å kose seg', 'o ˈku:se sæi', 'labi pavadīt laiku')]),
  ex('Ar kādu vārdu sākt un beigt vēstuli? Sakārto: <i>Kjære mamma! · Hilsen Polly · Klem fra … · Hei Ina!</i>', write(['Sākums: ___', 'Beigas: ___']),
     'Sākums: Kjære mamma! / Hei Ina! · Beigas: Hilsen Polly / Klem fra Polly', 'Atbilde'),
  ex('Kur Pollijs to piedzīvoja? Ieraksti vietu.', items(['Han smakte brunost. ___', 'Han så moskus. ___', 'Han så nordlyset. ___', 'Han var forkjølet. ___', 'Han kjøpte en lusekofte. ___', 'Han møtte et troll. ___']),
     numans(['Gudbrandsdalen', 'Dovrefjell', 'Tromsø', 'Lofoten / Røst', 'Ålesund', 'Geiranger']))],

 [sec('20B', 'Les! Overraskelse!', 'Lasām: pārsteigums!', first=True),
  dialog([('Mia', 'Overraskelse!'), ('Polly', 'Mia! Hva gjør du her? Du bor jo i Oslo!'),
          ('Mia', 'Jeg ville se deg på det siste stedet på reisen. Jeg har fløyet i tre dager!'), ('Polly', 'Du må være sliten. Sett deg her!'),
          ('Mia', 'Takk. Så … hvordan føler du deg nå?'), ('Polly', 'Jeg føler meg glad og litt trist. Jeg har opplevd så mye: fjorder, fjell, troll, moskus og nordlys.'),
          ('Mia', 'Og du har lært norsk! Husker du første gang vi møttes?'), ('Polly', 'Ja! Jeg sa bare «hei» og «takk», og du ga meg en vaffel.'),
          ('Mia', 'Og nå snakker du som en ekte nordmann. Se — klokka er tolv, og sola skinner fortsatt!'),
          ('Polly', 'Midnattssol … Dette skal jeg huske for alltid. Nå gleder jeg meg til å fly hjem og fortelle alt.')]),
  gloss([('en overraskelse', 'en ˈo:verraskelse', 'pārsteigums'), ('jo', 'ju:', 'taču'), ('det siste stedet', 'de: ˈsiste ˈste:de', 'pēdējā vieta'),
         ('har fløyet', 'ha:r ˈfløiet', 'ir lidojusi'), ('første gang', 'ˈføšte gaŋ', 'pirmo reizi'), ('ga', 'ga:', 'iedeva'), ('fortsatt', 'ˈfotsat', 'joprojām')]),
  ex('Riktig eller galt? Pareizi (R) vai nepareizi (G)?',
     tf(['Mia dzīvo Nordkapā.', 'Mia lidoja trīs dienas.', 'Pollijs jūtas tikai priecīgs.', 'Pirmajā tikšanās reizē Mia iedeva Pollijam vafeli.', 'Pusnaktī Nordkapā ir tumšs.']),
     numans(['G (Oslo)', 'R', 'G (priecīgs un mazliet skumjš)', 'R', 'G (spīd saule)'])),
  ex('Atrodi dialogā visus atgriezeniskos darbības vārdus (ar meg, deg, seg).', write(['___']),
     'sett deg · føler du deg · føler meg · (vi) møttes · gleder jeg meg', 'Atbilde')],

 [sec('20C', 'Grammatikk', 'Gramatika: atgriezeniskie darbības vārdi', first=True),
  p('Daži norvēģu darbības vārdi lietojami ar atgriezenisko vietniekvārdu — kā latviešu <i>mazgā<b>ties</b>, priecā<b>ties</b>, apsēs<b>ties</b></i>. Latviešu valodā tā ir galotne <b>-ties</b>, norvēģu valodā — atsevišķs vārds.'),
  gtable([('jeg', 'gleder <b>meg</b>', 'es priecājos'), ('du', 'gleder <b>deg</b>', 'tu priecājies'), ('han / hun', 'gleder <b>seg</b>', 'viņš / viņa priecājas'),
          ('vi', 'gleder <b>oss</b>', 'mēs priecājamies'), ('dere', 'gleder <b>dere</b>', 'jūs priecājaties'), ('de', 'gleder <b>seg</b>', 'viņi priecājas')],
         head=['Persona', 'å glede seg', 'Latviešu valodā']),
  cols(cmp('Biežākie', '<span class="nw">å vaske seg</span> — mazgāties · <span class="nw">å kle på seg</span> — apģērbties · <span class="nw">å legge seg</span> — iet gulēt · <span class="nw">å sette seg</span> — apsēsties · <span class="nw">å føle seg</span> — justies · <span class="nw">å glede seg til</span> — priecāties par gaidāmo · <span class="nw">å kose seg</span> — labi pavadīt laiku · <span class="nw">å skynde seg</span> — steigties · <span class="nw">å gifte seg</span> — precēties'),
       warn('Vārdu kārtība', 'Inversijā vietniekvārds stāv aiz personas: <i>I dag <b>gleder jeg meg</b>.</i><br>Ar <i>ikke</i>: <i>Jeg føler <b>meg ikke</b> bra.</i><br>Pavēles izteiksmē: <span class="nw">Sett deg!</span> <span class="nw">Skynd deg!</span><br>Savstarpēji: <span class="nw">vi møtes</span> — mēs satiekamies.')),
  ex('Ieraksti <span class="nw">meg, deg, seg, oss, dere</span>.', items(['Jeg gleder __ til sommeren.', 'Sett __ , Mia!', 'Polly føler __ glad.', 'Vi koser __ på hytta.', 'Har dere vasket __ ?', 'Barna legger __ klokka åtte.']),
     numans(['meg', 'deg', 'seg', 'oss', 'dere', 'seg']))],

 [ex('Atkārtojums: ieraksti pareizo formu.', items(['(å være, preteritum) I går __ jeg i Tromsø.', '(stor, vispārākā) Det er det __ fjellet i Norge.', '(å se, perfektum) __ du nordlys?', '(jeg, piederība) Huset __ er rødt.', '(fordi + ikke) Jeg er trist fordi jeg __ (ikke, har) tid.']),
     numans(['var', 'største', 'Har … sett', 'mitt', 'ikke har'])),
  sec('20D', 'Les! Et brev hjem', 'Lasām: vēstule mājās'),
  story(['Kjære mamma! Nå sitter jeg på Nordkapp under midnattssola. Jeg har reist fra Oslo helt hit — over to tusen kilometer.',
         'Jeg har sett fjorder, fosser og nordlys. Jeg har smakt brunost, kjørt med hunder og vært syk på Røst. Jeg har fått mange venner: Mia, Ina, Ben, Pelle, Trulte og mange flere. Og jeg har lært norsk! Først kunne jeg bare si «hei», nå kan jeg skrive dette brevet.',
         'Neste uke kommer jeg hjem til Riga. Jeg gleder meg til å se dere, men jeg kommer til å savne Norge. Kanskje kommer jeg tilbake neste år — til B1-nivå! Klem fra Polly']),
  gloss([('helt hit', 'he:lt hi:t', 'līdz pat šejienei'), ('over', 'ˈo:ver', 'vairāk nekā'), ('mange flere', 'ˈmaŋe ˈfle:re', 'vēl daudzi citi'), ('kunne', 'ˈkune', 'varēja'), ('nivå', 'niˈvo:', 'līmenis')]),
  ex('Atbildi uz jautājumiem norvēģu valodā.',
     items(['Hvor sitter Polly? ___', 'Hvor langt har han reist? ___', 'Hvem har han fått som venner? ___', 'Hva gleder han seg til? ___'], wide=True),
     numans(['Han sitter på Nordkapp under midnattssola.', 'Over to tusen kilometer.', 'Mia, Ina, Ben, Pelle, Trulte og mange flere.', 'Han gleder seg til å se familien i Riga.']))],

 [daily('vasara un fellesferie',
        ['Jūlijā Norvēģija „aizveras”: tas ir <span class="nw">fellesferie</span> — kopīgais atvaļinājums, kad daudzi uzņēmumi slēgti trīs nedēļas. Norvēģi brauc uz mājiņām, peldas aukstā jūrā, grilē un makšķerē.',
         'Vasara sākas ar <span class="nw">sankthans</span> 23. jūnija vakarā — ar lieliem ugunskuriem pie jūras, gluži kā Jāņos Latvijā! Bet saldējums un grilētas desiņas — vienmēr un visur.'],
        [('fellesferie', 'ˈfelesfe:rie', 'kopīgais atvaļinājums'), ('sankthans', 'ˈsankthans', 'Jāņi'), ('et bål', 'et bo:l', 'ugunskurs'), ('å bade', 'o ˈba:de', 'peldēties')],
        ex('Kā tu pavadīsi nākamo vasaru? Uzraksti 3 teikumus ar <span class="nw">skal</span> un vienu atgriezenisko darbības vārdu.', write(['Neste sommer ___']),
           'Neste sommer skal jeg reise til Norge. Jeg skal bade i fjorden og gå på tur. Jeg gleder meg veldig!', 'Piemērs')),
  fact('🌍', 'Nordkapa klints ir 307 metrus augsta, un šeit no maija vidus līdz jūlija beigām saule nenoriet. Nordkapu bieži sauc par Eiropas ziemeļu galu, bet īstenībā kaimiņu zemesrags <span class="nw">Knivskjellodden</span> ir par 1,5 km tālāk uz ziemeļiem — līdz tam jāiet 9 km kājām.'),
  sec('20E', 'Skriv!', 'Rakstām'),
  ex('Uzraksti vēstuli Pollijam (6–8 teikumi): ko tu iemācījies šajā grāmatā, kas patika visvairāk, ko tu gribētu redzēt Norvēģijā. Sāc ar <span class="nw">Kjære Polly!</span>', write(tall=True),
     'Kjære Polly! Takk for reisen! Jeg har lært mye norsk. Jeg likte best kapittelet om Tromsø, fordi jeg aldri har sett nordlys. Neste år skal jeg reise til Norge. Jeg gleder meg! Hilsen …', 'Piemērs'),
  sec('✓', 'Sjekk deg selv', 'Pārbaudi sevi'),
  check(['Es protu runāt par atmiņām.', 'Es protu lietot meg, deg, seg, oss, dere.', 'Es zinu 8 atgriezeniskos darbības vārdus.',
         'Es protu uzrakstīt vēstuli.', 'Es atkārtoju visu A2 gramatiku.', 'Es esmu gatavs B1 līmenim!'])],
]

CTRL = ctrl(CH,
  words=[('et minne', 'et ˈmine', 'atmiņa'), ('å huske', 'o ˈhuske', 'atcerēties'), ('å glemme', 'o ˈgleme', 'aizmirst'), ('å savne', 'o ˈsavne', 'ilgoties'),
         ('et brev', 'et bre:v', 'vēstule'), ('ei opplevelse', 'æi ˈople:velse', 'piedzīvojums'), ('å oppleve', 'o ˈople:ve', 'piedzīvot'),
         ('å skynde seg', 'o ˈšüne sæi', 'steigties'), ('for alltid', 'for ˈalti', 'uz visiem laikiem'), ('en overraskelse', 'en ˈo:verraskelse', 'pārsteigums')],
  sents=[('Es priecājos par vasaru.', 'Jeg gleder meg til sommeren.'), ('Apsēdies!', 'Sett deg!'), ('Kā tu jūties?', 'Hvordan føler du deg?'),
         ('Mēs labi pavadījām laiku mājiņā.', 'Vi koste oss på hytta.'), ('Es ilgošos pēc Norvēģijas.', 'Jeg kommer til å savne Norge.'),
         ('Es to atcerēšos uz visiem laikiem.', 'Dette skal jeg huske for alltid.')],
  text_title='Hjem til Riga',
  text=['En uke senere landet Polly på flyplassen i Riga. Familien hans sto og ventet med blomster. Mamma klemte ham, og søsteren gråt litt.',
        'Om kvelden satte alle seg ved bordet. Polly laget vafler med brunost — han hadde tatt med seg tre kilo fra Norge! Han fortalte om reisen til langt på natt. «Neste år blir dere med meg», sa han.'],
  gl=[('landet', 'ˈlane', 'nosēdās'), ('blomster', 'ˈblomster', 'ziedi'), ('klemte ham', 'ˈklemte ham', 'apskāva viņu'), ('gråt', 'gro:t', 'raudāja'), ('til langt på natt', 'til laŋt po nat', 'līdz vēlai naktij')],
  qs=['Hvem ventet på Polly på flyplassen?', 'Hva gjorde søsteren?', 'Hva laget Polly om kvelden?', 'Hva sa Polly til familien?'],
  qa=['Familien hans ventet med blomster.', 'Hun gråt litt.', 'Han laget vafler med brunost.', '«Neste år blir dere med meg.»'],
  gram_q='Ieraksti atgriezenisko vietniekvārdu.',
  gram_items=['Alle satte __ ved bordet.', 'Vi gleder __ til neste reise.', 'Polly, hvordan føler du __ ?', 'Jeg skynder __ hjem.'],
  gram_a=['seg', 'oss', 'deg', 'meg'])

# ---------- Noslēguma tests A2 ----------
def _part(t, pts):
    return f'<div class="part">{t}<small>{pts} punkti</small></div>'

EXTRA = f'''<section class="page"><div class="testhead"><h1>Test A2</h1><p>Noslēguma tests: vai esi apguvis A2 līmeni? Strādā bez grāmatas un vārdnīcas. Par katru pareizu atbildi — 1 punkts, kopā 40.</p></div>
{_part('1. Ordforråd — vārdu krājums', 10)}
{ex('Iztulko vārdus latviešu valodā. <i>(11.–20. nodaļa)</i>', '<div class="ordbank">' + ''.join(f'<div><b>{w}</b><span></span></div>' for w in ['en lege', 'ei skjorte', 'været', 'et dyr', 'en eksamen', 'billig', 'en mage', 'nordlys', 'stolt', 'å huske']) + '</div>',
    'ārsts · krekls · laiks · dzīvnieks · eksāmens · lēts · vēders · ziemeļblāzma · lepns · atcerēties')}
{_part('2. Grammatikk — gramatika', 15)}
{ex('Uzraksti noteikto formu. <i>(11. nod.)</i>', grid(['en båt → __', 'ei jente → __', 'et hus (dsk.) → __'], 3), numans(['båten', 'jenta', 'husene']))}
{ex('Ieraksti īpašības vārdu pareizajā formā. <i>(12.–13. nod.)</i>', items(['(rød) et __ hus', '(stor) den __ fjorden', '(god, pārākā) Brunost er __ enn ost.']), numans(['rødt', 'store', 'bedre']))}
{ex('Ieraksti preteritum vai perfektum. <i>(14.–15. nod.)</i>', items(['(å gå) I går __ vi på tur.', '(å se) __ du noen gang en elg?', '(å bo) For to år siden __ jeg i Oslo.']), numans(['gikk', 'Har … sett', 'bodde']))}
{ex('Ieraksti piederības vai atgriezenisko vietniekvārdu. <i>(17., 20. nod.)</i>', items(['(jeg) Hodet __ gjør vondt.', 'Pelle snakker med bestemoren __ . (savu)', 'Vi gleder __ til sommeren.']), numans(['mitt', 'sin', 'oss']))}
{FILL}<div class="folio"></div></section>
<section class="page"><div class="run">Test A2</div>
{ex('Savieno ar fordi. Uzmanies ar ikke! <i>(19. nod.)</i>', items(['Jeg er trist. Jeg har ikke tid. ___', 'Hun er glad. Det er sol. ___', 'Vi blir hjemme. Vi vil ikke gå ut. ___'], wide=True),
    numans(['Jeg er trist fordi jeg ikke har tid.', 'Hun er glad fordi det er sol.', 'Vi blir hjemme fordi vi ikke vil gå ut.']))}
{_part('3. Les — lasīšana', 5)}
<div class="story"><h3 class="stitle">Mias nye liv</h3><p>Etter turen til Nordkapp har Mia bestemt seg: hun skal flytte fra Oslo til Tromsø. Hun synes at Oslo har blitt for stor og bråkete. I Tromsø er det mer natur, og hun kan se nordlyset om vinteren.</p><p>Neste måned skal hun begynne i en ny jobb på Polaria, et akvarium for arktiske dyr. Hun gleder seg, men hun er litt nervøs fordi hun ikke kjenner noen i byen. Heldigvis bor Kira der!</p></div>
{gloss([('har bestemt seg', 'ha:r beˈstemt sæi', 'ir izlēmusi'), ('å flytte', 'o ˈflüte', 'pārcelties'), ('bråkete', 'ˈbro:kete', 'trokšņains'), ('heldigvis', 'ˈheldivi:s', 'par laimi')])}
{ex('Atbildi norvēģu valodā.', items(['Hvor skal Mia flytte? ___', 'Hva synes hun om Oslo? ___', 'Hva er Polaria? ___', 'Hvorfor er hun nervøs? ___', 'Hvem kjenner hun i Tromsø? ___'], wide=True),
    numans(['Til Tromsø.', 'At byen har blitt for stor og bråkete.', 'Et akvarium for arktiske dyr.', 'Fordi hun ikke kjenner noen i byen.', 'Kira.']))}
{_part('4. Skriv — rakstīšana', 10)}
{ex('Uzraksti par savu labāko ceļojumu (8–10 teikumi): kur, kad, ar ko, ko redzēji, kā jutās, ko darīsi nākamreiz.', write(tall=True),
    'Novērtē sevi: 2 p. — pagātne (preteritum); 2 p. — perfektum; 2 p. — īpašības vārdi pareizā formā; 2 p. — palīgteikums ar fordi/at/når; 2 p. — nākotne ar skal vai kommer til å.', 'Vērtēšana')}
<div class="testscore"><div><b>30–40</b> Gratulerer! Tu esi apguvis A2 līmeni. Tagad — B1!</div><div><b>20–29</b> Labi! Atkārto nodaļas, kurās bija kļūdas.</div><div><b>0–19</b> Vēlreiz izlasi 11.–20. nodaļu un pamēģini vēlreiz.</div></div>
<div class="score">Mans rezultāts: <span></span> / 40</div>
<div class="folio"></div></section>
'''
