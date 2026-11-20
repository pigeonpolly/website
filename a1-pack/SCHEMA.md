# A1 Pack — satura shēma

Viena tēma = mape `a1-pack/topics/<slug>/`:
- `topic.json` — `meta` (+ var būt viss saturs);
- `parts/*.json` — daļas no aģentiem; apvieno alfabēta secībā (`slides` saraksti saliek kopā, pārējās atslēgas pārraksta/papildina).

Teksta iezīmes visur: `**treknais**`, `*slīpais*`, `==izcelts==` (tēmas krāsā), `___` — atstarpe uzdevumā.
Valoda: instrukcijas un skaidrojumi — **latviski**; mācību piemēri — angliski (British English).
Oskara pozas (`pose`): `hello confused oops tangled spill idea teacher sleep celebrate peek`.

## meta
```json
{"slug":"to-be","title_en":"Verb to be: am / is / are","title_lv":"…","course":"English A1","level":"A1",
 "lesson":1,"minutes":45,"accent":"#FF5A36","teacher":"",
 "materials":["slides","homework","selfcheck","answers","guide","reserve","mistakes"],
 "sources":[{"name":"British Council LearnEnglish","url":"https://learnenglish.britishcouncil.org/","note":"…"}]}
```
`sources` obligāti: British Council, Cambridge, BBC (+ CEFR, English Vocabulary Profile pēc vajadzības).
Slaidu skaits ≥ `minutes / 3` (45 → 15, 90 → 30, 180 → 60).

## slides — saraksts; katram var būt `notes` (skolotājam, LV), `pose`, `tag`
| type | lauki |
|---|---|
| cover | title, subtitle, text |
| agenda | title, items[] |
| section | num ("02"), title, text |
| text | title, body (str/[]), bullets[], note (rokraksts) |
| big | kicker, text (viena doma lieliem burtiem), lv |
| rule | title, head[], rows[[]], note |
| examples | title, items[{en, lv}] (≤ 6) |
| vocab | title, items[{en, lv, ipa?}] (≤ 8), cols |
| quiz | question, options[2–4], answer (indekss), lv, kicker |
| task | title, steps[], minutes, mode (Pāros / Grupās / Individuāli / Visa grupa), box |
| story | title, text[], lesson — Oskara neveiklā situācija, kas palīdz atcerēties likumu |
| compare | title, left{title, items[]}, right{title, items[]}, note |
| thanks | title, text |

## homework
```json
{"intro":"…","reminder":["…"],   // reminder nav obligāts — citādi pirmās 3 no mistakes
 "exercises":[ … 4–5 gab. … ]}
```
| type | items | HTML |
|---|---|---|
| gap | {text ar ___, answer, hint?} | input |
| choice | {text ar ___, options[], answer} | select |
| truefalse | text (lasāmteksts), items {text, answer: true/false} | select |
| match | {left, answer}, extra[] | select |
| order | {words "a / b / c", answer} | input |
| transform | {text, answer} | input |
| write | prompt, lines, checklist[], model[] | textarea |
Kopā ar `title`, `instruction`, `example?`, `points`.

## selfcheck
`intro`, `quiz[{q, options[], answer (teksts), why}]`, `detective[{wrong, right, why}]` (≥ 4),
`facts[{title, text, pose}]` (tikai pārbaudāmi fakti), `videos[{title, lv, youtube?, verified?, search, url, source}]`.
YouTube ID — tikai pārbaudīts (`verified: true`); citādi `search` (meklēšanas saite) + `url` uz avota lapu.

## reserve — 3–4
`{title, kind: roleplay|letter|errors|game, minutes, mode, instruction, roles[{role, card}]?, items[]?, useful[]?, answers (str/[])}`

## mistakes — ≥ 5
`{wrong, right, why (LV, kāpēc latviešu runātājs tā kļūdās), tip? (atgādne)}`

## guide
`aims[]`, `outcomes[]` (CEFR A1 can-do), `grammar[]`, `vocabulary[]`,
`timeline[{min "0–5", stage, what, slides "1–3"}]` (beidzas ar `minutes`), `tips[]`,
`differentiation{weaker[], stronger[]}`, `assessment` (str/[]).

`answers` neraksta — to saliek automātiski no slaidu testiem, mājasdarba, pašpārbaudes un rezervēm.
