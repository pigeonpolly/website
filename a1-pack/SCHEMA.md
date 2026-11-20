# A1 English Lab — satura shēma (2 faili)

Tēma = `a1-pack/topics/<slug>/topic.json` (+ `parts/*.json` no aģentiem: `deck` saraksti saliek kopā failu secībā, `workbook.sections` — arī).
Būvē: `python3 a1-pack/tools/build_lab.py a1-pack/topics/<slug>` → `<slug>-prezentacija.html` un `<slug>-tema.html` (viss iekšā).

Teksta iezīmes: `**treknais**`, `*serif-akcents*` (slīpraksts tēmas krāsā — virsrakstos 1 vārds), `==izcelts==`, `___` — atstarpe.
Valoda: instrukcijas un skaidrojumi — latviski, uz **tu**; piemēri — britu angļu A1. Pieaugušie. Oskars — `OSKARS.md`.
Pozas: `hello confused oops tangled spill idea teacher sleep celebrate peek` + situācijas `tea umbrella map suitcase phone laptop guide bigben book`.

## meta
`slug, title_en, title_lv, course, level, lesson, minutes, accent (#RRGGBB), sources[{name,url}]` (British Council, Cambridge, BBC obligāti).

## deck — slaidi (≥ minutes/3; ≥ 40 % interaktīvi). Katram: `notes` (skolotājam), `pose?`, `tag?`
| type | lauki | interaktīvs |
|---|---|---|
| cover | title, subtitle, text | |
| agenda | title, items[] | |
| section | num, title, text | |
| story | title, messages[{who: oscar/note/vārds, name, text}], lesson | → atklāj pa replikai |
| vocab | title, items[{en, lv, ipa?}] ≤ 8, cols | apgriež, izruna |
| rule | title, head[], rows[[]], note | |
| switcher | title, modes[], rows{persona: [teikumi pa režīmiem]}, lv{…} | pārslēdz + − ? |
| examples | title, items[{en, lv}] ≤ 6 | → atklāj tulkojumu, izruna |
| quiz | question ar ___, options[], answer (indekss), why | klikšķis / A |
| build | title, words "a / b / c", answer, lv | saliek teikumu |
| picker | title, items[] (jautājumi), lv, hint | nejaušs jautājums |
| mistakes | title, items[{wrong, right, why}] ≤ 6, pose | **obligāts** ≥ 1; apgriežamas kartītes, A — visas |
| facts | kicker, title, items[{tag «Dzīve»/«Valoda», big, title, text, en}] 3–4, pose | **obligāti** ≥ 2 (britu dzīve + valodas interesantumi A1); kartīte apgriežas |
| oscar | kind (story/tip/fact/joke/lesson/news) vai kicker, text, en (+ izruna), lv?, pose, side «right»? | liels Oskars + runas burbulis; ≥ 1 uz 6 slaidiem, dažādas pozas |
| task | title, steps[], minutes (taimeris), mode «Individuāli», box | taimeris; tikai individuāls darbs |
| compare | title, left{title,items}, right{…}, note | |
| text | title, body, bullets, note | |
| big | kicker, text, lv | izruna |
| thanks | title, text | |
Vadība: ←/→/atstarpe, F pilnekrāns, N piezīmes, O pārskats, A atbilde.

## workbook — tēmas fails
`{title, lead, chips[], hello (Oskara sveiciens), pose, sections[…]}`; sadaļai: `type, title, nav (īss vārds izvēlnē), lead, kicker?`
| type | lauki |
|---|---|
| story | messages[{who, name, text, say?}], lesson |
| rule | text[], table{head, rows}, note, switcher{title, modes, rows, lv} |
| vocab | items[{en, ipa, lv, ex}] |
| practice | exercises[] — ar «Pārbaudīt», XP, Oskara reakcijām (≥ 5 dažādi tipi) |
| facts | items[{tag «Dzīve»/«Valoda», big, title, text, pose}] ≥ 6 — britu dzīve un valodas interesantumi A1; tikai pārbaudāmi fakti |
| video | items[{title, lv, youtube?, verified?, search, url, source}] |
| mistakes | items[{wrong, right, why}] — apgriežamas kartītes |
| quiz | items[{q, options[], answer (teksts), why}] — pa vienam, rezultāts |
| text | text[] |
| oscar | kā slaidā (kind, text, en, pose, side) — liels Oskars starp sadaļām, izvēlnē neparādās; 2–4 uz tēmu |
| homework | exercises[] 4–5 (viens `write`), bez pārbaudes; «Lejupielādēt izpildīto (PDF)» ar vārdu, datumu, auto-rezultātu |

## Uzdevumu tipi (practice / homework)
Visiem: `type, title, instruction?, points?`
| type | items |
|---|---|
| gap | {text ar ___, answer (str vai [] variantu), hint?} |
| choice | {text ar ___, options[], answer} |
| truefalse | text? (lasāmteksts), items {text, answer: true/false} |
| sort | buckets[{title, items[]}] |
| build | {words "a / b / c", answer, lv?} — vārdi = atbildes vārdi |
| match | {left, right} |
| detective | {wrong, bad (kļūdainā vārda indekss, no 0), right, why} |
| listen | {text} — izruna en-GB, students raksta |
| write | prompt, checklist[], minWords, model[] |
