---
name: a1-pack
description: Angļu valodas A1 tēma pieaugušajiem (instrukcijas latviski, uz tu) Alinas dizainā ar kaķi Oskaru — 2 interaktīvi HTML faili - prezentācija nodarbībai un tēmas fails (stāsts, likums, prakse ar pašpārbaudi, fakti par Britāniju, tests, mājasdarbs ar PDF lejupielādi). Использовать, когда Алина просит «лекцию / урок / тему / материалы по английскому A1», «новую тему для курса английского» или «как to be, только про …».
---

# A1 English Lab — jauna tēma

Dizains un dzinējs gatavi (`a1-pack/lab/`). Tava daļa — **saturs JSON** pēc `a1-pack/SCHEMA.md`. Tēli un tonis — `a1-pack/OSKARS.md`.
Paraugs: `a1-pack/topics/to-be/topic.json` — skaties fragmentos (`python3 -c` ar json), nelasi visu.

## 0. Jautājumi Alinai (viens AskUserQuestion)
1. **Tēma** — ja nav skaidra.
2. **Krāsa** — 3 varianti tēmas noskaņā (vārds + HEX), pirmais ieteiktais; kontrasts pret baltu ≥ 3:1.
3. **Ilgums** — 45 / 90 / 180 min. Slaidi ≥ minūtes / 3 (3 h → ≥ 60).
4. **Kas vajag** (multiSelect): «Prezentācija», «Tēmas fails ar mājasdarbu». Pēc noklusējuma — abi.

## 1. Plāns (pats) → `topics/<slug>/plan.md` + `topic.json` ar `meta`
- **CEFR A1** robežas; orientieri: British Council LearnEnglish (A1–A2 grammar), Cambridge English A1/A2, BBC Learning English, English Vocabulary Profile A1. **Neizdomā** gramatikas likumus vai izņēmumus; ja šaubies — neraksti. Britu angļu.
- **Pieaugušie**: ceļojumi, darbs, pilsēta, pakalpojumi. Oskars — britu gids Londonā; kļūdas pieļauj tūristi Jānis/Līga; fakti par Britāniju — tikai pārbaudāmi.
- **Prezentācija**: ievads → Oskara stāsts → forma (vocab, rule, switcher, examples) → quiz → build → section → … → picker/task (runāšana) → personalizācija (big) → thanks. Interaktīvi ≥ 40 % slaidu, ik ~10 slaidiem quiz, ik ~15 min task ar taimeri. 3 h — 3–4 daļas, pauze, atkārtojums.
- **Tēmas fails**: story → rule (+switcher) → vocab → practice (6–8 uzdevumi, ≥ 5 tipi: sort, gap, choice, build, listen, detective, match, truefalse) → facts → video → mistakes → quiz (8–10) → homework (4–5, viens write).
- `plan.md`: can-do, gramatika, 20–40 vārdi, slaidu saraksts (rinda = slaids: tips + saturs), 5–7 latviešu runātāju kļūdas, faktu idejas. **Līgums aģentiem.**

## 2. Saturs — aģentiem paralēli
Vienā ziņā vairāki `Agent` (general-purpose), katrs raksta **tikai savu failu** `topics/<slug>/parts/`:
- `10-deck-a.json`, `11-deck-b.json`, … — `{"deck":[…]}` pa ≤ 20 slaidiem;
- `20-wb-a.json` — `{"workbook":{"title","lead","chips","hello","sections":[story, rule, vocab]}}`;
- `21-wb-b.json` — `{"workbook":{"sections":[practice, facts, video, mistakes]}}`;
- `22-wb-c.json` — `{"workbook":{"sections":[quiz, homework]}}`.
Uzdevumā ielīmē: ceļus uz SCHEMA.md, OSKARS.md, plan.md, savu daļu; noteikumus zemāk; «atgriez tikai: gatavs + kas apšaubāms».

Noteikumi aģentiem (kopēt):
- Latviski pareizi, ar garumzīmēm, uz **tu**; angliski — dabiski, britu A1. Tikai plan.md saturs, nekādu jaunu likumu.
- Pieaugušie; Oskars — britu gids; humors maigs, par situāciju. Fakti — tikai pārbaudāmi; ja nav pārliecības — neraksti.
- Katram slaidam `notes`. Teksts slaidā ≤ 35 vārdi. vocab ≤ 8, examples ≤ 6.
- build: `words` = tieši atbildes vārdi (kārtība cita). detective: `bad` = kļūdainā vārda indekss no 0 pēc `wrong.split(" ")`.
- Video: YouTube ID tikai ar `verified: true` (pārbaudīts web-fetch); citādi `search` + `url`.
- Derīgs JSON (`python3 -c "import json;json.load(open('…'))"`).

## 3. Pārbaude
`python3 a1-pack/tools/check_lab.py a1-pack/topics/<slug>` — ✗ labo. Pats izlasi 5–6 slaidus un 2 uzdevumus: valoda, A1, latviešu gramatika.

## 4. Būvēšana un skats
```
python3 a1-pack/tools/build_lab.py a1-pack/topics/<slug>
```
Ekrānuzņēmumi (Playwright, `require('playwright')`): prezentācija — 8 slaidi (`…-prezentacija.html#N`), tēmas fails — 1440 un 390 (pirms tam `.reveal-up,.msg` → klase `in`). Pārbaudi: nav JS kļūdu, nav horizontālā skrola uz 390, «Pārbaudīt» strādā, mājasdarba PDF lejupielādējas. Pats apskati, izlabo, Alinai ≤ 2 lapas + abi HTML (SendUserFile).

## 5. Beigas
Rinda `docs/plan-status.md`; `git add a1-pack/topics/<slug>`; commit; push (CLAUDE.md).

## Dizainu negroziet
`a1-pack/lab/lab.css`, `lab.js` (dzinējs), `tools/build_lab.py`, `design/oscar/` (`tools/draw_oscar.py`). Jauns tips — tikai pēc Alinas lūguma: lab.js + lab.css + check_lab.py + SCHEMA.md.
