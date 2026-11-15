CH = dict(n=10, lvl='A1', place='Flåm', title='Hva kan du?', lv='Ko tu proti?')

PAGES = [
 [opener(CH), scene('scenes/u10.svg'),
  goals(['ceļošanas vārdus: vilciens, biļete, ūdenskritums;', 'modālos darbības vārdus: <span class="nw">kan, vil, må, skal</span>;',
         'pieklājīgi palūgt: <span class="nw">Jeg vil gjerne ha …</span>;', 'pastāstīt, ko proti un ko gribi darīt;',
         'kas ir <span class="nw">allemannsretten</span>.'], 'maps/route-10.svg'),
  say('<span class="nw">Hei!</span> Braucu ar Flåmas dzelzceļu — vienu no stāvākajiem pasaulē. Vilciens lēnām slīd lejup gar kalniem, tuneļiem un ūdenskritumiem. Man blakus sēž aita Solveiga — viņa brauc mājās uz savu saimniecību.')],

 [sec('10A', 'Ordforråd', 'Vārdu krājums: ceļošana', first=True),
  vocab([('å reise', 'o ˈræise', 'ceļot'), ('ei/en reise', 'æi ˈræise', 'ceļojums'), ('et tog', 'et to:g', 'vilciens'),
         ('en konduktør', 'en kundukˈtø:r', 'konduktors'), ('en billett', 'en biˈlet', 'biļete'), ('en koffert', 'en ˈkufæt', 'čemodāns'),
         ('å kjøre', 'o ˈçø:re', 'braukt (ar mašīnu)'), ('å fly', 'o flü:', 'lidot'), ('en foss', 'en fos', 'ūdenskritums'),
         ('en fjord', 'en fju:r', 'fjords'), ('en dal', 'en da:l', 'ieleja'), ('en tunnel', 'en ˈtunel', 'tunelis'),
         ('å ta bilder', 'o ta: ˈbilder', 'fotografēt'), ('vakker', 'ˈvaker', 'skaists'), ('bratt', 'brat', 'stāvs'),
         ('å gå ut', 'o go: u:t', 'izkāpt, iziet'), ('å se etter', 'o se: ˈeter', 'meklēt (ar acīm)'), ('gjerne', 'ˈjæ:rne', 'labprāt')]),
  ex('Kā tu ceļo? Savieno.', cols(items(['et tog', 'et fly', 'en båt', 'en bil', 'en sykkel']), opts('a å fly · b å kjøre · c å sykle · d å ta toget · e å seile')),
     numans(['d', 'a', 'e', 'b', 'c'])),
  ex('Ieraksti vārdu no saraksta: <span class="nw">billett, foss, koffert, tunnel</span>.',
     items(['Toget kjører gjennom en lang __ .', 'Polly har klær i en __ .', 'Vann faller ned fra fjellet i en __ .', 'Du må kjøpe en __ før du tar toget.']),
     numans(['tunnel', 'koffert', 'foss', 'billett']))],

 [sec('10B', 'Les! På Flåmsbana', 'Lasām: Flåmas vilcienā', first=True),
  dialog([('Konduktør', 'Billetter, takk!'), ('Polly', 'Her er billetten min. Kan jeg sitte ved vinduet?'),
          ('Konduktør', 'Ja, selvfølgelig. Du må se på høyre side om ti minutter.'), ('Polly', 'Hvorfor det?'),
          ('Konduktør', 'Toget skal stoppe ved Kjosfossen. Der kan du gå ut og ta bilder.'),
          ('Solveig', 'Og du må se etter huldra!'), ('Polly', 'Huldra? Hvem er det?'),
          ('Solveig', 'En skogsjente fra eventyrene. Hun danser ved fossen.'),
          ('Polly', 'Jeg vil gjerne se henne! Men først vil jeg ha en kopp kaffe.'), ('Konduktør', 'Du kan kjøpe kaffe i kafévogna.')]),
  gloss([('selvfølgelig', 'selˈfølgeli', 'protams'), ('om ti minutter', 'om ti: miˈnuter', 'pēc desmit minūtēm'), ('å stoppe', 'o ˈstope', 'apstāties'),
         ('der', 'dæ:r', 'tur'), ('huldra', 'ˈhuldra', 'huldra — meža feja'), ('ei/en skogsjente', 'æi ˈsku:gšente', 'meža meitene'),
         ('eventyrene', 'ˈe:ventü:rene', 'pasakas'), ('henne', 'ˈhene', 'viņu (sievieti)'), ('kafévogna', 'kaˈfe:vogna', 'kafejnīcas vagons')]),
  ex('Riktig eller galt? Pareizi (R) vai nepareizi (G)?',
     tf(['Pollijs grib sēdēt pie loga.', 'Vilciens apstāsies pie Kjosfosena.', 'Pie ūdenskrituma nedrīkst izkāpt.', 'Huldra ir aita.', 'Kafiju var nopirkt vilcienā.']),
     numans(['R', 'R', 'G', 'G (meža feja no pasakām)', 'R'])),
  ex('Ko tu gribētu darīt Norvēģijā? Uzraksti 3 teikumus ar <span class="nw">Jeg vil …</span>', write(['___', '___', '___']),
     'Jeg vil se fjordene. Jeg vil gå på ski. Jeg vil smake brunost.', 'Piemērs')],

 [sec('10C', 'Grammatikk', 'Gramatika: modālie darbības vārdi', first=True),
  p('Modālie darbības vārdi izsaka iespēju, vēlēšanos, nepieciešamību vai plānu. Pēc tiem otrs darbības vārds ir nenoteiksmē <b>bez å</b>!'),
  gtable([('<b>kan</b>', 'varēt; prast', 'Jeg <b>kan</b> svømme.', 'Es protu peldēt.'), ('<b>vil</b>', 'gribēt', 'Hun <b>vil</b> se fossen.', 'Viņa grib redzēt ūdenskritumu.'),
          ('<b>må</b>', 'vajag, jā-', 'Du <b>må</b> kjøpe billett.', 'Tev jānopērk biļete.'), ('<b>skal</b>', 'grasīties; būs (plāns)', 'Toget <b>skal</b> stoppe.', 'Vilciens apstāsies.'),
          ('<b>bør</b>', 'vajadzētu', 'Du <b>bør</b> ta bilder.', 'Tev vajadzētu fotografēt.')], head=['Vārds', 'Nozīme', 'Piemērs', 'Latviešu valodā']),
  formula('Jeg kan svømme.', 'Kan du svømme?', 'Jeg kan ikke svømme.'),
  cols(cmp('Latviešu valoda ↔ norvēģu valoda', 'Latviešu valodā „vajag” izsaka ar dažādām konstrukcijām: <i>man jāiet, tev vajag iet</i>. Norvēģu valodā vienkārši: <span class="nw">Jeg må gå. Du må gå.</span> — forma visiem viena.'),
       warn('Uzmanību: må ikke', '<span class="nw">Du må ikke</span> nozīmē „tu <b>nedrīksti</b>”, nevis „tev nav jā-”!<br><i>Du må ikke røyke her.</i> — Te nedrīkst smēķēt.<br>„Nav jā-” ir <span class="nw">trenger ikke</span>: <i>Du trenger ikke betale.</i>')),
  ex('Ieraksti <span class="nw">kan, vil, må</span> vai <span class="nw">skal</span>.',
     items(['Polly __ se fossen. Han elsker fosser!', 'Du __ kjøpe billett før du går på toget.', '__ du snakke norsk? — Ja, litt.', 'I morgen __ vi ta båten til Gudvangen.', 'Jeg er sulten. Jeg __ ha mat nå!', 'Solveig __ ikke fly. Hun er en sau!']),
     numans(['vil', 'må', 'Kan', 'skal', 'må / vil', 'kan']))],

 [ex('Uzraksti teikumu ar iekavās doto modālo darbības vārdu.',
     items(['Jeg svømmer. (kan) ___', 'Vi tar toget. (skal) ___', 'Hun kjøper billett. (må) ___', 'De ser fjorden. (vil) ___', 'Du sover. (bør) ___'], wide=True),
     numans(['Jeg kan svømme.', 'Vi skal ta toget.', 'Hun må kjøpe billett.', 'De vil se fjorden.', 'Du bør sove.'])),
  sec('10D', 'Les! Norge på en dag', 'Lasām: Norvēģija vienā dienā'),
  story(['Mange turister vil se fjordene, men har ikke mye tid. Da kan de ta turen «Norge i et nøtteskall». Den tar én dag.',
         'Først tar du toget fra Bergen til Myrdal. Der må du bytte tog og ta Flåmsbana ned til Flåm. Toget er gammelt og grønt, og det kjører veldig bratt.',
         'Fra Flåm kan du ta båten på Nærøyfjorden. Fjorden er smal, og fjellene er høye. Til slutt tar du bussen tilbake. Du blir trøtt, men glad!']),
  gloss([('ikke mye tid', 'ˈike ˈmü:e ti:d', 'maz laika'), ('et nøtteskall', 'et ˈnøteskal', 'rieksta čaumala'), ('å bytte', 'o ˈbüte', 'pārsēsties, mainīt'),
         ('ned', 'ne:', 'lejā'), ('smal', 'sma:l', 'šaurs'), ('til slutt', 'til šlut', 'beigās'), ('tilbake', 'tilˈba:ke', 'atpakaļ'), ('du blir', 'du: bli:r', 'tu būsi, kļūsi')]),
  ex('Atbildi uz jautājumiem norvēģu valodā.',
     items(['Hvor lenge tar turen? ___', 'Hvor må du bytte tog? ___', 'Hvordan er toget til Flåm? ___', 'Hva kan du gjøre i Flåm? ___'], wide=True),
     numans(['Den tar én dag.', 'I Myrdal.', 'Det er gammelt og grønt, og det kjører bratt.', 'Du kan ta båten på Nærøyfjorden.']))],

 [daily('allemannsretten — tiesības visiem',
        ['Norvēģijā ir likums <span class="nw">allemannsretten</span> — „katra cilvēka tiesības”. Tu drīksti staigāt pa mežiem un kalniem, pat ja zeme pieder kādam citam.',
         'Teltī drīkst nakšņot divas naktis vienā vietā, ja tā ir vismaz 150 metrus no mājām. Ogas un sēnes drīkst lasīt visi. Bet jāievēro arī pienākumi: neatstāj atkritumus un nebojā dabu!'],
        [('et telt', 'et telt', 'telts'), ('bær', 'bæ:r', 'ogas'), ('sopp', 'sop', 'sēnes'), ('å plukke', 'o ˈpluke', 'lasīt, plūkt'), ('naturen', 'naˈtu:ren', 'daba')],
        ex('Ko drīkst un ko nedrīkst? Uzraksti ar <span class="nw">kan</span> vai <span class="nw">må ikke</span>.',
           items(['plukke bær i skogen ___', 'kaste søppel i naturen ___', 'sove i telt to netter ___'], wide=True),
           numans(['Du kan plukke bær i skogen.', 'Du må ikke kaste søppel i naturen.', 'Du kan sove i telt to netter.']))),
  fact('🚂', 'Flåmas dzelzceļš ir tikai 20 km garš, bet nobrauc gandrīz <b>900 metrus</b> lejup — no kalniem līdz fjordam. Tam ir 20 tuneļi, un to būvēja gandrīz 20 gadus (1923–1940). Vasarā pie Kjosfosena ūdenskrituma dejo <span class="nw">huldra</span> sarkanā kleitā — viss vilciens izkāpj skatīties!'),
  sec('10E', 'Skriv!', 'Rakstām'),
  ex('Ko tu proti un ko neproti? Ko tev jādara šonedēļ? Uzraksti 4 teikumus ar <span class="nw">kan, kan ikke, må, skal</span>.', write(['___', '___', '___']),
     'Jeg kan sykle, men jeg kan ikke gå på ski. Jeg må jobbe på fredag. På lørdag skal jeg reise til Riga.', 'Piemērs'),
  sec('✓', 'Sjekk deg selv', 'Pārbaudi sevi'),
  check(['Es zinu 12 ceļošanas vārdus.', 'Es protu lietot kan, vil, må, skal.', 'Es zinu, ka pēc tiem nav å.',
         'Es zinu atšķirību: må ikke / trenger ikke.', 'Es protu pieklājīgi palūgt.', 'Es zinu, kas ir allemannsretten.'])],
]

CTRL = ctrl(CH,
  words=[('å reise', 'o ˈræise', 'ceļot'), ('et tog', 'et to:g', 'vilciens'), ('en billett', 'en biˈlet', 'biļete'), ('en foss', 'en fos', 'ūdenskritums'),
         ('vakker', 'ˈvaker', 'skaists'), ('å bytte', 'o ˈbüte', 'pārsēsties, mainīt'), ('gjerne', 'ˈjæ:rne', 'labprāt'), ('selvfølgelig', 'selˈfølgeli', 'protams'),
         ('smal', 'sma:l', 'šaurs'), ('tilbake', 'tilˈba:ke', 'atpakaļ')],
  sents=[('Es protu peldēt.', 'Jeg kan svømme.'), ('Vai tu gribi kafiju?', 'Vil du ha kaffe?'), ('Mums jānopērk biļetes.', 'Vi må kjøpe billetter.'),
         ('Rīt mēs brauksim uz Flåmu.', 'I morgen skal vi (reise) til Flåm.'), ('Te nedrīkst smēķēt.', 'Du må ikke røyke her.'),
         ('Es labprāt gribētu tasi tējas.', 'Jeg vil gjerne ha en kopp te.')],
  text_title='Solveig drar hjem',
  text=['Solveig er en sau. Hun bor på en gård i Flåmsdalen. I dag skal hun hjem med toget.',
        'Solveig kan ikke kjøre bil, og hun vil ikke gå — det er for langt. Hun må kjøpe billett, men hun har ikke penger. Konduktøren sier: «Sauer kan reise gratis i dag!» Solveig er glad.'],
  gl=[('en gård', 'en go:r', 'lauku saimniecība'), ('å dra hjem', 'o dra: jem', 'doties mājās'), ('for langt', 'for laŋt', 'pārāk tālu'), ('penger', 'ˈpeŋer', 'nauda'), ('gratis', 'ˈgra:tis', 'bez maksas')],
  qs=['Hvor bor Solveig?', 'Kan Solveig kjøre bil?', 'Hvorfor vil hun ikke gå?', 'Hva sier konduktøren?'],
  qa=['Hun bor på en gård i Flåmsdalen.', 'Nei, hun kan ikke kjøre bil.', 'Det er for langt.', '«Sauer kan reise gratis i dag!»'],
  gram_q='Ieraksti kan, vil, må vai skal.',
  gram_items=['I dag __ Solveig reise hjem.', 'Hun __ ikke kjøre bil.', 'Alle __ ha billett på toget.', '__ du ha en kopp kaffe?'],
  gram_a=['skal', 'kan', 'må', 'Vil'])

# ---------- Tests A1 → A2 (pēc 10. nodaļas) ----------
def _part(t, pts):
    return f'<div class="part">{t}<small>{pts} punkti</small></div>'

EXTRA = f'''<section class="page"><div class="testhead"><h1>Test A1 → A2</h1><p>Starpposma tests: vai esi gatavs A2 līmenim? Strādā bez grāmatas un vārdnīcas. Par katru pareizu atbildi — 1 punkts, kopā 40.</p></div>
{_part('1. Ordforråd — vārdu krājums', 10)}
{ex('Iztulko vārdus latviešu valodā. <i>(Atkārto: 3.–10. nodaļa)</i>', '<div class="ordbank">' + ''.join(f'<div><b>{w}</b><span></span></div>' for w in ['en familie', 'et kjøkken', 'onsdag', 'en foss', 'en billett', 'sulten', 'en bror', 'til høyre', 'kjøtt', 'vinter']) + '</div>',
    'ģimene · virtuve · trešdiena · ūdenskritums · biļete · izsalcis · brālis · pa labi · gaļa · ziema')}
{_part('2. Grammatikk — gramatika', 15)}
{ex('Ieraksti en, ei vai et. <i>(3. nod.)</i>', grid(['__ hus', '__ stol', '__ eple'], 3), numans(['et', 'en', 'et']))}
{ex('Ieraksti darbības vārdu tagadnē. <i>(4. nod.)</i>', items(['(å være) Jeg __ trøtt.', '(å gjøre) Hva __ du?', '(å bo) Vi __ i Riga.']), numans(['er', 'gjør', 'bor']))}
{ex('Sāc teikumu ar iekavās doto vārdu. <i>(5. nod.)</i>', items(['Jeg spiser frokost. (Klokka sju) ___', 'Hun går på tur. (I helgen) ___', 'Vi drikker kaffe. (Om morgenen) ___'], wide=True),
    numans(['Klokka sju spiser jeg frokost.', 'I helgen går hun på tur.', 'Om morgenen drikker vi kaffe.']))}
{ex('Pārvērt noliegumā. <i>(7. nod.)</i>', items(['Jeg liker fisk. ___', 'I dag regner det. ___', 'Polly drikker melk. ___'], wide=True),
    numans(['Jeg liker ikke fisk.', 'I dag regner det ikke.', 'Polly drikker ikke melk.']))}
{FILL}<div class="folio"></div></section>
<section class="page"><div class="run">Test A1 → A2</div>
{ex('Ieraksti kan, må vai vil. <i>(10. nod.)</i>', items(['Du __ kjøpe billett før du tar toget.', '__ du svømme? — Ja, jeg svømmer godt.', 'Jeg er tørst. Jeg __ ha vann.']), numans(['må', 'Kan', 'vil']))}
{_part('3. Les — lasīšana', 5)}
<div class="story"><h3 class="stitle">Et postkort fra Flåm</h3><p>Kjære Ina! Nå er jeg i Flåm. Det er en liten bygd ved en lang fjord. Jeg bor på et hotell ved vannet. Rommet mitt er lite, men det har en fin utsikt.</p><p>I dag tar jeg båten på fjorden. I morgen skal jeg gå på tur i fjellet. Om kvelden spiser jeg fisk på en restaurant. Jeg liker ikke fisk så mye, men her er den veldig god! Klem fra Polly</p></div>
{gloss([('ei/en bygd', 'æi büg', 'ciems'), ('rommet mitt', 'ˈrume mit', 'mana istaba')])}
{ex('Atbildi norvēģu valodā.', items(['Hvor er Polly? ___', 'Hvor bor han? ___', 'Hva gjør han i dag? ___', 'Hva skal han gjøre i morgen? ___', 'Liker Polly fisk? ___'], wide=True),
    numans(['Han er i Flåm.', 'Han bor på et hotell ved vannet.', 'Han tar båten på fjorden.', 'Han skal gå på tur i fjellet.', 'Ikke så mye, men her er den god.']))}
{_part('4. Skriv — rakstīšana', 10)}
{ex('Uzraksti Pollijam atbildes kartīti (6–8 teikumi): kas tu esi, kur dzīvo, tava ģimene, tava diena, vaļasprieki, ko gribi redzēt Norvēģijā.', write(tall=True),
    'Novērtē sevi: 2 p. — sveiciens un atvadas; 2 p. — par sevi un ģimeni; 2 p. — par dienu vai vaļaspriekiem; 2 p. — darbības vārds otrajā vietā; 2 p. — vismaz viens modālais darbības vārds.', 'Vērtēšana')}
<div class="testscore"><div><b>30–40</b> Lieliski! Tu esi gatavs A2 līmenim. Videre!</div><div><b>20–29</b> Labi! Atkārto nodaļas, kurās bija kļūdas, un tad dodies tālāk.</div><div><b>0–19</b> Neuztraucies — izlasi vēlreiz 3.–10. nodaļu un pamēģini testu vēlreiz.</div></div>
<div class="score">Mans rezultāts: <span></span> / 40</div>
<div class="folio"></div></section>
'''
