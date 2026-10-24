# База D1 и ключи meta

_Собрано скриптом `python3 tools/docs/build_db.py` из CREATE TABLE / ALTER TABLE и обращений к meta в worker/*.js. Руками не править._

## Таблицы (45)

Обозначения: PK — первичный ключ, nn — NOT NULL, =x — DEFAULT x; «+» — столбцы, добавленные ALTER TABLE.

- **garden** (worker/garden.js): `user_id` int PK, `beds` text ='[]' (JSON грядок {p, t, g, w} | null), `seeds` text ='{}', `crop` text ='{}' (урожай в корзинке), `bug_day` text ='', `bug_got` text ='[]' (пойманные сегодня жуки), `harvests` int =0, `bugs` int =0, `created_at` int; этап 23 (GARDEN_ALTER): `found` text ='[]' (найденные семена для новости), `drop_day` text, `drop_n` int (семена из игр за сутки), `rare_day` / `magic_day` text (день прошлой награды), `water_days` text ='[]' (дни полива, 40), `hide` text ='[]' (спрятанные вещи огорода). В `button_log` — штамп `stamp` ref `день:five` (карточка дня набрала бонус)
- **login_fail** (worker/auth.js): `k` text PK, `n` int nn, `at` int nn
- **pw_reset** (worker/auth.js): `hash` text PK, `user_id` int nn, `expires` int nn, `created_at` int
- **funnel** (worker/auth.js): `day` text nn, `name` text nn, `step` text nn, `vid` text nn; PRIMARY KEY (day, name, step, vid)
- **blog_posts** (worker/blog.js): `id` int PK auto, `slug` text UNIQUE nn, `status` text ='draft', `cover` text ='', `t_ru` text ='', `t_en` text ='', `t_lv` text ='', `d_ru` text ='', `d_en` text ='', `d_lv` text ='', `b_ru` text ='', `b_en` text ='', `b_lv` text ='', `tags_ru` text ='', `tags_en` text ='', `tags_lv` text ='', `views` int =0, `likes` int =0, `created_at` int, `updated_at` int, `published_at` int; + `featured` int =0').run(), `pinned` int =0').run(), `src_lang` text, `client_key` text, `section` text =''
- **blog_likes** (worker/blog.js): `post_id` int nn, `who` text nn; PRIMARY KEY (post_id, who)
- **blog_comments** (worker/blog.js): `id` int PK auto, `post_id` int nn, `user_id` int, `anon` text, `body` text nn, `ip` text, `status` text ='ok', `created_at` int
- **blog_tags** (worker/blog.js): `en` text PK, `ru` text ='', `lv` text =''; + `checked` int =0, `src` text ='', `created_at` int
- **blog_sections** (worker/blog.js): `slug` text PK, `en` text ='', `ru` text ='', `lv` text ='', `sort` int =0
- **cards** (worker/cards.js): `id` int PK auto, `n` int UNIQUE nn, `collection` text nn ='', `rarity` text nn ='common', `price` int =0, `img` text, `hidden` int =0, `src_lang` text ='ru', `t_en` text ='', `t_ru` text ='', `t_lv` text ='', `d_en` text ='', `d_ru` text ='', `d_lv` text ='', `stats` text ='[]', `game` text, `created_at` int, `updated_at` int
- **card_sets** (worker/cards.js): `slug` text PK, `en` text ='', `ru` text ='', `lv` text ='', `src_lang` text ='ru', `created_at` int
- **card_owner** (worker/cards.js): `card_id` int PK, `user_id` int nn, `price` int =0, `bought_at` int, `ref` text, `gift` text, `seen` int =1
- **card_trades** (worker/cards.js): `id` int PK auto, `from_id` int nn, `to_id` int nn, `give` text nn, `take` text nn, `status` text nn ='open', `created_at` int, `done_at` int, `seen` int =0, `ref` text
- **challenge_days** (worker/challenge-days.js): `day` text PK, `item` int, `subject_en` text, `subject_ru` text, `subject_lv` text, `tip_en` text, `tip_ru` text, `tip_lv` text, `colors` text, `time` int, `twist_en` text, `twist_ru` text, `twist_lv` text, `extra_en` text, `extra_ru` text, `extra_lv` text, `edited` int =0, `orig` text, `updated_at` int, `pal` text (палитра дня ЭКСТРА, выбранная в кабинете)
- **challenge_months** (worker/challenge-days.js): `ym` text PK, `en` text, `ru` text, `lv` text, `updated_at` int, `badge` text (JSON пиксельного дизайна, pixel-badge.js), `start_day` text, `end_day` text (нет — целый месяц ym) — тематика с датами (бейдж mt<ym>; ym — 'ГГГГ-ММ' или 'ГГГГ-ММ-ДД_ГГГГ-ММ-ДД')
- **challenge_bank** (worker/challenge-days.js): `id` int PK, `k` text UNIQUE (тема без регистра: RU, нет — EN, LV), `en` text, `ru` text, `lv` text, `days` text (дни через запятую), `created_at` int, `updated_at` int, `manual` int =0 (добавлена прямо в банк), `hidden` int =0 (удалена из банка, но стоит в днях), `tags` text (через запятую: winter…, extra, bday, halloween, xmas) — банк тем Алины (зеркало правленных дней + добавленные)
- **flock_events** (worker/flock-news.js): `id` int PK auto, `ts` int nn, `user_id` int nn =0, `kind` text nn, `ref` text nn ='', `data` text ='{}'; UNIQUE (user_id, kind, ref)
- **room_guests** (worker/flock.js): `owner_id` int nn, `guest_id` int nn, `first_at` int, `last_at` int; PRIMARY KEY (owner_id, guest_id)
- **feathers** (worker/flock.js): `owner_id` int nn, `from_id` int nn, `day` text nn, `created_at` int, `seen` int =0; PRIMARY KEY (owner_id, from_id, day)
- **users** (worker/index.js): `id` int PK auto, `sub` text UNIQUE nn, `email` text, `nick` text UNIQUE COLLATE NOCASE, `consent` int =0, `banned` int =0, `created_at` int; + `pw` text, `pw_temp` int =0, `email_ok` int =0, `privacy_at` int, `advent_mail` text ='', `advent_sent` int =0'], `news_off` int =0'], `feathers` int =0, `feather_day` text ='', `avatar` text ='', `best` int =0, `badges` text ='', `months` text ='', `room` text ='', `picks` int =0, `mcount` text ='', `last_seen` int, `game_best` int =0, `game_best_at` int, `maze_level` int =1, `inv` text ='', `pot_fails` int =0, `pot_days` int =0, `pot_last` text, `cats_alive` int =0, `eyes` int =0, `eye_next` int =0, `room_at` int, `req_n` int =0, `req_mid` int =0, `buttons` int =0, `referrer` int, `box0` text ='', `box_mail` int =0, `pan_best` int =0, `pan_best_at` int, `pan_washes` int =0', `office_task` int =0 (этап 20: пройденная задача Оффис Полли), `lang` text ='' (язык писем), `wl_mail_off` int =0, `wl_sent` text ='' (праздничные письма Воббленда, worker/wl-holidays.js), `mail_games`/`mail_feat`/`mail_news` int =0, `mail_asked` int =0, `mail_later` int =0, `mail_lang` text ='', `mail_day` text ='' (день последнего письма — не больше одного в день), `mail_g_at` int =0, `mail_g_garden` int =0, `mail_g_titos` int =0, `mail_g_streak` text ='' (письма по согласию и уведомления из игр, worker/mail.js)]
- **mail_out** (worker/mail.js): `id` int PK auto, `cat` text nn, `L` text nn (JSON {en,ru,lv: {s,t}}), `status` text nn (send/done/stop), `total` int =0, `sent` int =0, `created_at` int
- **mail_sent** (worker/mail.js): `out_id` int nn, `user_id` int nn, `at` int; PK (out_id, user_id)
- **sessions** (worker/index.js): `token` text PK, `user_id` int nn, `expires` int nn; + `pin_ok` int =0
- **posts** (worker/index.js): `id` text PK, `user_id` int nn, `day` text nn, `theme` text, `bw` int =0, `created_at` int, `hidden` int =0; + `tod` int, `picked` int =0, `bytes` int, `store` text, `ai` int =0, `kv` int =1; UNIQUE(user_id, day)
- **meta** (worker/index.js): `key` text PK, `value` text
- **subscribers** (worker/index.js): `id` int PK auto, `email` text nn, `topic` text nn ='books', `lang` text, `consent` text, `created_at` int; UNIQUE(email, topic)
- **gifts** (worker/index.js): `id` int PK auto, `user_id` int nn, `kind` text nn, `item` text nn, `note` text, `status` text ='new', `created_at` int, `opened_at` int
- **site_blocks** (worker/index.js): `id` text nn, `lang` text nn, `html` text, `hidden` int =0, `page` text, `updated_at` int; PRIMARY KEY (id, lang)
- **button_log** (worker/index.js): `id` int PK auto, `user_id` int nn, `kind` text nn, `ref` text nn, `amount` int nn, `day` text, `created_at` int; + `seen` int =1; UNIQUE (user_id, kind, ref)
- **visits** (worker/index.js): `id` int PK auto, `day` text nn, `ts` int, `vid` text, `entry` int =0, `path` text, `lang` text, `src` text, `ref` text, `campaign` text, `device` text, `os` text, `browser` text, `country` text
- **utm_links** (worker/index.js): `id` int PK auto, `path` text nn, `source` text nn, `campaign` text nn, `note` text, `created_at` int; UNIQUE (path, source, campaign)
- **art_added** (worker/index.js): `id` int PK auto, `key` text UNIQUE nn, `gallery` text nn, `title` text, `colors` text, `w` int, `h` int, `palette` int =1, `pos` int, `hidden` int =0, `created_at` int, `removed_at` int
- **art_hidden** (worker/index.js): `src` text PK, `thumb` text, `gallery` text, `created_at` int
- **advent_plan** (worker/index.js): `day` int nn, `kind` text nn, `item` text nn; PRIMARY KEY (day, kind, item)
- **advent_open** (worker/index.js): `user_id` int nn, `year` int nn, `day` int nn, `kind` text, `item` text, `buttons` int =0, `created_at` int; + `got` text; PRIMARY KEY (user_id, year, day)
- **shop** (worker/index.js): `kind` text nn, `item` text nn, `price` int =0, `stock` int =0; + `added_at` int; PRIMARY KEY (kind, item)
- **game_runs** (worker/index.js): `id` text PK, `user_id` int nn, `started` int nn, `level` int =0
- **maze_runs** (worker/index.js): `id` text PK, `user_id` int nn, `level` int nn, `seed` int nn, `items` text, `started` int nn, `done` int =0; + `eye` int =0, `safe` int =0, `hint` int =0
- **potion_book** (worker/index.js): `user_id` int nn, `combo` text nn, `tier` int nn, `n` int =1, `created_at` int; PRIMARY KEY (user_id, combo)
- **draw_requests** (worker/index.js): `id` int PK auto, `user_id` int, `anon` text, `text` text nn, `lang` text, `who` text, `status` text ='open', `img` text, `gift` text, `created_at` int, `answered_at` int; + `text_en` text, `ip` text, `text_ru` text, `text_lv` text
- **draw_likes** (worker/index.js): `rid` int nn, `kind` text nn, `who` text nn, `created_at` int; PRIMARY KEY (rid, kind, who)
- **potion_gifts** (worker/index.js): `id` int PK auto, `to_id` int nn, `from_nick` text, `ing` text nn, `n` int nn, `created_at` int, `seen` int =0
- **anon_names** (worker/index.js): `vid` text PK, `code` text UNIQUE nn, `created_at` int
- **pan_runs** (worker/pancakes.js): `id` text PK, `user_id` int nn, `started` int nn, `level` int =0, `washed` int =0, `stars` int =0, `base` int =0 (старт с рубежа), `spare` int =0 (запасные сковородки); users.pan_up text — улучшения блинной JSON
- **shift_runs** (worker/shift.js): `id` text PK, `user_id` int nn, `started` int nn, `min` int nn, `done` int =0 (1 — засчитана, 2 — отменена новым стартом); `users.shift_min` — сумма минут доигранных смен
- **my_games** (worker/my-games.js): `user_id` int PK, `pins` text (JSON: до 3 путей игр), `visits` text (JSON: путь → заходов), `updated_at` int — «★ Мои игры» на главной
- **school_works** (worker/school.js, «Школа Полли»): `id` int PK auto, `user_id` int nn, `lesson` int nn (1–12), `img` text nn (id картинки, /api/img/), `note` — записка ученика, `status` 'wait' / 'ok' / 'redo', `comment` — Алины (ученику «от Полли»), `comment_tr` — JSON {en, ru, lv} перевод комментария при проверке (translateTo; нет перевода — оригинал), `created_at`, `checked_at`, `seen` int =1 (0 — вердикт ещё не видел → новость school); пересдача после redo — новая строка; не последние попытки старше года удаляет schoolCron
- **titos** (worker/titos.js): `user_id` int PK, `level` int =0, `coffee` int =10, `coffee_at` int =0, `drink_at` int =0, `sleep` int =0, `run` int =0, `found` text ='[]', `started` int =0, `bugs` text ='[]', `sell_day` text ='', `sell_n` int =0, `legacy` int =0; + `sort_lv` int =0, `sort_run` text ='', `bugs_run` int =0']
- **titos_cases** (worker/titos.js): `n` int PK, `data` text nn, `tr` text ='{}', `hash` text, `updated_at` int
- **top_week** (worker/top.js): `game` text nn, `week` text nn, `user_id` int nn, `score` int nn, `at` int; PRIMARY KEY (game, week, user_id)

## Ключи meta (40)

Таблица `meta (key, value)`. Ключ → где используется.

- `admin_email_off` — worker/index.js
- `admin_ids` — worker/index.js
- `admin_pin` — worker/blog.js, worker/index.js
- `advent_mail_n:` — worker/auth.js
- `anon_names_v1` — worker/index.js
- `backup_token` — worker/blog.js, worker/index.js
- `blog_salt` — worker/blog.js, worker/index.js
- `blog_strict` — worker/blog.js
- `blog_tags_v1` — worker/blog.js
- `blog_ideas` — worker/ideas.js: последний список «💡 Темы для блога» {at, note, ideas, sources}
- `buttons_backfill` — worker/index.js
- `chplan_oct` — worker/challenge-days.js
- `chplan_v4` — worker/challenge-days.js
- `cron_at` — worker/index.js
- `dev_last_mail` — worker/auth.js
- `wl_gift:<день>`, `wl_mail_n:<день>`, `mail_salt` — worker/wl-holidays.js
- `mail_n:<день>`, `mail_secret` — worker/mail.js
- `gemini_key` — worker/blog.js, worker/translate.js
- `inbox_subs_seen` — worker/index.js
- `index_base` — worker/index.js
- `new_seen` — worker/flock-news.js, worker/index.js
- `pick_post` — worker/index.js
- `pick_price_11` — worker/index.js
- `pick_user` — worker/index.js
- `pin_fail` — worker/blog.js, worker/index.js
- `potfail_v2` — worker/index.js
- `price_level` — worker/index.js
- `prices_v1` — worker/index.js
- `rc_fail:*` — worker/index.js
- `recovery_at` — worker/index.js
- `recovery_hash` — worker/blog.js, worker/index.js
- `req_closed` — worker/index.js
- `restock_day` — worker/index.js
- `restock_last` — worker/index.js
- `rules` — worker/index.js
- `sections_news` — worker/blog.js
- `sections_v2` — worker/blog.js
- `starter_box_v1` — worker/index.js
- `titos_pot_n` — worker/titos.js
- `unit` — worker/index.js
- `users_total` — worker/auth.js, worker/blog.js, worker/index.js
- `visit_salt` — worker/auth.js, worker/blog.js, worker/index.js
- `works_total` — worker/blog.js, worker/index.js
