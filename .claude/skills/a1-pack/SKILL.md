---
name: a1-pack
description: Materiālu pakete angļu valodas nodarbībai A1 (pieaugušajiem, instrukcijas latviski) Alinas dizainā ar kaķi Oskaru — prezentācija, mājasdarbs, pašpārbaude, atbildes (master-PDF), metodika, rezerves uzdevumi, biežākās kļūdas; HTML + PDF + Word + PowerPoint. Использовать, когда Алина просит «лекцию / урок / пак / материалы по английскому A1», «новую тему для курса английского» или «как to be, только про …».
---

# A1 English Pack — jauna tēma

Viss dizains un būvēšana jau gatavi (`a1-pack/`). Tava daļa — **saturs JSON formātā**. Skripti paši izveido HTML, PDF, DOCX, PPTX un zip.
Pirms darba izlasi: `a1-pack/SCHEMA.md` (formāts), `a1-pack/OSKARS.md` (maskots, tēli, noteikumi). Paraugs: `a1-pack/topics/to-be/topic.json` — skaties `grep`/fragmentos, nelasi visu.

## 0. Jautājumi Alinai (viens AskUserQuestion, līdz 4 jautājumiem)
1. **Tēma** — ja nav skaidra no ziņas (piem., «Present Simple», «Numbers & prices», «Food & drinks»).
2. **Tēmas krāsa** — piedāvā 3 krāsas, kas atbilst tēmas noskaņai (ar HEX un vārdu, piem., «Tomāts #FF5A36», «Jūra #2F7DD1», «Salvija #6E9B76»), pirmā — ieteiktā. Krāsai jābūt ar kontrastu ≥ 3:1 pret baltu (pārbaudi; tumšākā versija tekstam tiek veidota automātiski).
3. **Ilgums** — 45 min / 90 min / 3 h (180 min) / cits. Slaidu minimums = minūtes / 3 (3 h → **≥ 60 slaidi**).
4. **Materiāli** (multiSelect): «Prezentācija + metodika», «Mājasdarbs + atbildes», «Pašpārbaude», «Rezerves uzdevumi + Biežākās kļūdas». Pēc noklusējuma — viss.

Tēmu, ko nevar pamatot ar A1 (piem., Past Perfect), — saki un piedāvā A1 alternatīvu.

## 1. Plāns (pats, īsi) → `a1-pack/topics/<slug>/plan.md` + `topic.json` ar `meta`
- **CEFR A1 robežas.** Gramatika un vārdi tikai no A1 (orientieri: British Council LearnEnglish A1–A2 grammar, Cambridge English A1/A2 materiāli, BBC Learning English iesācējiem, English Vocabulary Profile A1). **Neizdomā** gramatikas izņēmumus un «likumus», kuru nav šajos avotos; ja šaubies — neraksti. Britu angļu valoda (colour, flat, holiday).
- **Pieaugušie.** Situācijas: ceļojumi, darbs, pilsēta, pakalpojumi, sadzīve. Nekādu skolas/bērnu sižetu.
- **Oskars** — britu kaķis, gids Londonā (`OSKARS.md`): stāsta pārbaudītus faktus par Britāniju; kļūdas pieļauj tūristi (Jānis, Līga), Oskars izlabo; pats ir neveikls. Uz **tu**.
- **Struktūra** (PPP + uzdevumi): ievads/Oskara stāsts → forma (rule, examples, vocab) → kontrolēta prakse (quiz) → brīvāka prakse (task) → personalizācija → kopsavilkums. Ik ~10 slaidiem `quiz`, ik ~15 min `task` (pāros/grupās), ik daļai `section`. 3 h nodarbībā — 3–4 daļas, pauze, atkārtojums.
- `plan.md`: can-do (CEFR A1), gramatikas punkti, 20–40 vārdi, slaidu saraksts ar tipiem (viena rinda = viens slaids), 5–7 tipiskās latviešu runātāju kļūdas, faktu idejas, ko teiks Oskars. **Tas ir līgums aģentiem** — pēc tam saturu neizdomā no jauna.
- Avoti `meta.sources`: British Council, Cambridge, BBC (+ CEFR). Saites — tikai sakņu lapas vai pārbaudītas ar web-fetch.

## 2. Saturs — aģentiem paralēli (ietaupa tokenus)
Palaid vienā ziņā vairākus `Agent` (general-purpose), katrs raksta **tikai savu failu** `a1-pack/topics/<slug>/parts/NN-<daļa>.json`:
- `10-slides-a.json`, `11-slides-b.json`, … — **pa ≤ 20 slaidiem** (3 h → 3–4 aģenti; secība pēc faila nosaukuma);
- `20-homework-selfcheck.json` — `homework` + `selfcheck`;
- `30-reserve-mistakes-guide.json` — `reserve` + `mistakes` + `guide` (timeline pēc plan.md slaidu numuriem).

Aģenta uzdevumā ielīmē: ceļus uz `SCHEMA.md`, `OSKARS.md`, `plan.md`; savu slaidu numuru diapazonu; noteikumus zemāk; «atgriez tikai: fails gatavs + kas apšaubāms». Neprasi atgriezt saturu čatā.

Noteikumi aģentiem (kopēt):
- Instrukcijas, skaidrojumi, piezīmes — **latviski**, pareizā latviešu valodā ar garumzīmēm, uz **tu**; angļu piemēri — dabiska britu angļu valoda A1.
- Tikai tas, kas ir plan.md; nekādu jaunu likumu vai izņēmumu. Fakti — tikai tādi, kurus var pārbaudīt (oficiālas vietnes, BBC, British Council); ja nav pārliecības — neraksti.
- Pieaugušie; Oskars — britu gids (OSKARS.md); pozas tikai no saraksta SCHEMA.md.
- Katram slaidam `notes` skolotājam (ko darīt, ko jautāt, cik minūšu). `vocab` ≤ 8, `examples` ≤ 6, teksts slaidā ≤ 40 vārdiem.
- Mājasdarbs: 4–5 dažādi uzdevumi (vismaz viens `write`, viens ar izvēli), `points`, atbildes visām vietām. Pašpārbaude: tests ar `why`, Kļūdu detektīvs ≥ 4, 2–4 fakti par Britāniju vai valodu, 1–2 video.
- Video: YouTube ID tikai, ja pārbaudīts (`verified: true`); citādi `search` + `url` uz BBC/British Council lapu.
- Rezerves: 3–4 aktīvi uzdevumi (lomu spēle, mini-vēstule, kļūdu meklēšana, spēle pieaugušajiem) ar atbildēm/paraugu.
- Derīgs JSON (pārbaudi ar `python3 -c "import json;json.load(open('…'))"`).

## 3. Pārbaude (pats)
```
python3 a1-pack/tools/check_pack.py a1-pack/topics/<slug>
```
✗ — izlabo (vai aģentam ar SendMessage). Pēc tam izlases kārtā pārlasi 5–6 slaidus un mājasdarbu: valoda, A1, nav izdomātu likumu, latviešu valoda bez kļūdām.

## 4. Būvēšana
```
python3 a1-pack/tools/build_pack.py a1-pack/topics/<slug>
```
Rezultāts: `topics/<slug>/<slug>-pack.zip` (HTML + assets, pdf/, office/). `out/` git neiekļauj.

## 5. Parādīt Alinai (≤ 2 lapas)
```
python3 a1-pack/tools/sheet.py a1-pack/topics/<slug>/out/pdf/prezentacija.pdf <scratchpad>/slides.png --cols 4 --dpi 30
python3 a1-pack/tools/sheet.py a1-pack/topics/<slug>/out/pdf/majasdarbs.pdf <scratchpad>/hw.png --cols 3 --dpi 45
```
Pats apskati (Read), izlabo redzamo, tad SendUserFile: abas lapas + zip. Alinai — krieviski, ≤ 5 rindas.

## 6. Beigas
Rinda `docs/plan-status.md`, `git add a1-pack/topics/<slug>/topic.json a1-pack/topics/<slug>/parts a1-pack/topics/<slug>/plan.md a1-pack/topics/<slug>/*.zip`, commit, push.

## Dizainu negroziet
Kods: `a1-pack/design/` (pack.css, pack.js, oscar/), `a1-pack/tools/` (build_pack.py — HTML, make_office.py — DOCX/PPTX, render.js — PNG/PDF). Jauns slaida vai uzdevuma tips — tikai, ja Alina prasa; tad pievieno visos trijos (build_pack, make_office, check_pack) un SCHEMA.md.
