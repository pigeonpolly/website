# База D1 и ключи meta

_Собрано скриптом `python3 tools/docs/build_db.py` из CREATE TABLE / ALTER TABLE и обращений к meta в worker/*.js. Руками не править._

## Таблицы (33)

Обозначения: PK — первичный ключ, nn — NOT NULL, =x — DEFAULT x; «+» — столбцы, добавленные ALTER TABLE.

- **blog_posts** (worker/blog.js): `id` int PK auto, `slug` text UNIQUE nn, `status` text ='draft', `cover` text ='', `t_ru` text ='', `t_en` text ='', `t_lv` text ='', `d_ru` text ='', `d_en` text ='', `d_lv` text ='', `b_ru` text ='', `b_en` text ='', `b_lv` text ='', `tags_ru` text ='', `tags_en` text ='', `tags_lv` text ='', `views` int =0, `likes` int =0, `created_at` int, `updated_at` int, `published_at` int; + `featured` int =0').run(), `pinned` int =0').run(), `src_lang` text, `client_key` text, `section` text =''
- **blog_likes** (worker/blog.js): `post_id` int nn, `who` text nn; PRIMARY KEY (post_id, who)
- **blog_comments** (worker/blog.js): `id` int PK auto, `post_id` int nn, `user_id` int, `anon` text, `body` text nn, `ip` text, `status` text ='ok', `created_at` int
- **blog_tags** (worker/blog.js): `en` text PK, `ru` text ='', `lv` text =''; + `checked` int =0, `src` text ='', `created_at` int
- **blog_sections** (worker/blog.js): `slug` text PK, `en` text ='', `ru` text ='', `lv` text ='', `sort` int =0
- **cards** (worker/cards.js): `id` int PK auto, `n` int UNIQUE nn, `collection` text nn ='', `rarity` text nn ='common', `price` int =0, `img` text, `hidden` int =0, `src_lang` text ='ru', `t_en` text ='', `t_ru` text ='', `t_lv` text ='', `d_en` text ='', `d_ru` text ='', `d_lv` text ='', `stats` text ='[]', `created_at` int, `updated_at` int
- **card_sets** (worker/cards.js): `slug` text PK, `en` text ='', `ru` text ='', `lv` text ='', `src_lang` text ='ru', `created_at` int
- **card_owner** (worker/cards.js): `card_id` int PK, `user_id` int nn, `price` int =0, `bought_at` int, `ref` text
- **card_trades** (worker/cards.js): `id` int PK auto, `from_id` int nn, `to_id` int nn, `give` text nn, `take` text nn, `status` text nn ='open', `created_at` int, `done_at` int, `seen` int =0, `ref` text
- **challenge_days** (worker/challenge-days.js): `day` text PK, `item` int, `subject_en` text, `subject_ru` text, `subject_lv` text, `tip_en` text, `tip_ru` text, `tip_lv` text, `colors` text, `time` int, `twist_en` text, `twist_ru` text, `twist_lv` text, `extra_en` text, `extra_ru` text, `extra_lv` text, `edited` int =0, `orig` text, `updated_at` int
- **users** (worker/index.js): `id` int PK auto, `sub` text UNIQUE nn, `email` text, `nick` text UNIQUE COLLATE NOCASE, `consent` int =0, `banned` int =0, `created_at` int; + `avatar` text ='', `best` int =0, `badges` text ='', `months` text ='', `room` text ='', `picks` int =0, `mcount` text ='', `last_seen` int, `game_best` int =0, `game_best_at` int, `maze_level` int =1, `inv` text ='', `pot_fails` int =0, `eyes` int =0, `eye_next` int =0, `room_at` int, `req_n` int =0, `req_mid` int =0, `buttons` int =0, `referrer` int
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
- **titos** (worker/titos.js): `user_id` int PK, `level` int =0, `coffee` int =10, `coffee_at` int =0, `drink_at` int =0, `sleep` int =0, `run` int =0, `found` text ='[]', `started` int =0, `bugs` text ='[]', `sell_day` text ='', `sell_n` int =0, `legacy` int =0
- **titos_cases** (worker/titos.js): `n` int PK, `data` text nn, `tr` text ='{}', `hash` text, `updated_at` int

## Ключи meta (34)

Таблица `meta (key, value)`. Ключ → где используется.

- `admin_email_off` — worker/index.js
- `admin_ids` — worker/index.js
- `admin_pin` — worker/blog.js, worker/index.js
- `backup_token` — worker/blog.js, worker/index.js
- `blog_salt` — worker/blog.js, worker/index.js
- `blog_strict` — worker/blog.js
- `blog_tags_v1` — worker/blog.js
- `buttons_backfill` — worker/index.js
- `chplan_oct` — worker/challenge-days.js
- `cron_at` — worker/index.js
- `gemini_key` — worker/blog.js, worker/translate.js
- `inbox_subs_seen` — worker/index.js
- `index_base` — worker/index.js
- `new_seen` — worker/index.js
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
- `unit` — worker/index.js
- `users_total` — worker/blog.js, worker/index.js
- `visit_salt` — worker/blog.js, worker/index.js
- `works_total` — worker/blog.js, worker/index.js
