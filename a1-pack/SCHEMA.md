# A1 English Lab — satura shēma (2 faili)

Tēma = `a1-pack/topics/<slug>/topic.json` (+ `parts/*.json` no aģentiem: `deck` saraksti saliek kopā failu secībā, `workbook.sections` — arī).
Būvē: `python3 a1-pack/tools/build_lab.py a1-pack/topics/<slug>` → `<slug>-prezentacija.html` un `<slug>-tema.html` (viss iekšā).

Teksta iezīmes: `**treknais**`, `*serif-akcents*` (slīpraksts tēmas krāsā — virsrakstos 1 vārds), `==izcelts==`, `___` — atstarpe.
Valoda: instrukcijas un skaidrojumi — latviski, uz **tu**; piemēri — britu angļu A1. Pieaugušie. Oskars — `OSKARS.md`.
Pozas: `hello confused oops tangled spill idea teacher sleep celebrate peek`.

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
| task | title, steps[], minutes (taimeris), mode, box | taimeris |
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
| facts | items[{big, title, text, pose}] — tikai pārbaudāmi fakti par Britāniju/valodu |
| video | items[{title, lv, youtube?, verified?, search, url, source}] |
| mistakes | items[{wrong, right, why}] — apgriežamas kartītes |
| quiz | items[{q, options[], answer (teksts), why}] — pa vienam, rezultāts |
| text | text[] |
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
