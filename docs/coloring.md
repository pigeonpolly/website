# Раскраски (Уроки → Раскраски)

- Раздел на /learn/ (#free): фильтр «Вид → Раскраски». Список — `site/assets/coloring.json` (правится руками): `{id, vip, t:{en,ru,lv}, cover, pdf}`. v2.js рисует карточки `.vc.col` (data-c="coloring"); `vip: 1` — гостю размыто с 🔒 и вход. Стили — конец v2.css.
- Сейчас одна раскраска: «Полли в гирлянде» (PDF `site/images/coloring/pigeon-polly-christmas-lights.pdf`, обложка 800×550 `polly-christmas-lights.jpg` — лист + цветной оригинал в углу; с полки /books/ перенесена 14.11). Пин №377 ведёт на `/learn/?c=polly-christmas-lights` — фильтр «Раскраски», подсветка карточки и окно «Скачать PDF».
- Файлы «для своих» класть в `site/members/coloring/<id>.pdf`: worker `membersFile` пускает только вошедших, гостя уводит на /learn/?c=<id>#signin.
- 14.11.2026 отменено: 50 авто-раскрасок по работам (контуры из цветного арта программой) — Алина: «некачественно, буду делать иначе». Серию «Тревога» для раскрасок не брать.
- 20.11.2026 **Ёлочные украшения с Полли** — НЕ на сайте (Алина: класть не просила), только файлы: tools/ornaments/pdf/ (polly-ornament-balls — 3 плоских шара, колпак Санты; polly-garland — флажки JOY/NOEL, шапка с помпоном; polly-3d-ornament — объёмный шар из 2 кругов, оленьи рожки). Всё на английском. Генератор: `python3 tools/ornaments/make.py` → `node tools/ornaments/render.js` (out/ в .gitignore). На сайт — только если Алина попросит.
