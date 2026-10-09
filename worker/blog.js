// Блог: страницы /blog/ и /blog/<slug>/ собираются на сервере из шаблона site/blog/index.html (между <!--BLOG--> и <!--/BLOG-->),
// API /api/blog/* — лайки, комментарии, редактор (только админ), перевод через Workers AI, картинки в R2 (/media/*).
// Данные — таблицы blog_* в той же D1.

const SITE = 'https://www.pigeonpolly.com';
const LANGS = ['en', 'ru', 'lv'];
const PREFIX = { en: '', ru: '/ru', lv: '/lv' };
const MAX_IMG = 8_000_000;
const MAX_COMMENT = 1500;

const T = {
  en: {
    blog: 'Blog', head: 'Notes from the lab', lead: 'Articles about drawing, learning and creativity: what I try, what works, and what Polly thinks about it.',
    tags: 'Tags', moreTags: 'Show all tags', lessTags: 'Show less', popular: 'Popular', all: 'All posts', empty: 'No posts here yet. The first one is on its way!',
    comments: 'Comments', noComments: 'No comments yet. Be the first!', back: '← All posts', tagged: 'Posts tagged',
    min: 'min read', share: 'Share', copy: 'Copy link', copied: 'Link copied ✓', email: 'E-mail', draft: 'Draft', read: 'Read →', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    descr: 'Notes on drawing, learning and creativity by Alina Otkinska and Pigeon Polly.',
    featured: '★ Favourites', archive: 'Archive', inMonth: 'Posts from', onlyFav: 'My favourite posts', allSections: 'All', search: 'Search the blog…', searchBtn: 'Search', found: 'Search results for', nothing: 'Nothing found. Try another word.', prev: '← Newer', next: 'Older →', section: 'Section', sections: 'Sections', scheduled: '⏰ Scheduled', browse: 'Sections, tags & archive', count: n => `${n} ${n === 1 ? 'post' : 'posts'} in the blog`,
    monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
  ru: {
    blog: 'Блог', head: 'Заметки из лаборатории', lead: 'Статьи о рисовании, обучении и творчестве: что я пробую, что работает и что об этом думает Полли.',
    tags: 'Теги', moreTags: 'Показать все теги', lessTags: 'Свернуть', popular: 'Популярное', all: 'Все статьи', empty: 'Здесь пока нет статей. Первая уже в пути!',
    comments: 'Комментарии', noComments: 'Комментариев пока нет. Будьте первым!', back: '← Все статьи', tagged: 'Статьи с тегом',
    min: 'мин чтения', share: 'Поделиться', copy: 'Скопировать ссылку', copied: 'Ссылка скопирована ✓', email: 'Почта', draft: 'Черновик', read: 'Читать →', months: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    descr: 'Заметки о рисовании, обучении и творчестве от Алины Откинской и голубя Полли.',
    featured: '★ Избранное', archive: 'Архив', inMonth: 'Статьи за', onlyFav: 'Мои избранные статьи', allSections: 'Все', search: 'Поиск по блогу…', searchBtn: 'Найти', found: 'Результаты поиска', nothing: 'Ничего не нашлось. Попробуйте другое слово.', prev: '← Новее', next: 'Старше →', section: 'Раздел', sections: 'Разделы', scheduled: '⏰ Запланирована', browse: 'Разделы, теги и архив', count: n => `В блоге ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'статья' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'статьи' : 'статей'}`,
    monthsFull: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  },
  lv: {
    blog: 'Blogs', head: 'Piezīmes no laboratorijas', lead: 'Raksti par zīmēšanu, mācīšanos un radošumu: ko es izmēģinu, kas strādā un ko par to domā Pollija.',
    tags: 'Birkas', moreTags: 'Rādīt visas birkas', lessTags: 'Sakļaut', popular: 'Populārākie', all: 'Visi raksti', empty: 'Šeit vēl nav rakstu. Pirmais jau ceļā!',
    comments: 'Komentāri', noComments: 'Komentāru vēl nav. Esi pirmais!', back: '← Visi raksti', tagged: 'Raksti ar birku',
    min: 'min lasīšanas', share: 'Dalīties', copy: 'Kopēt saiti', copied: 'Saite nokopēta ✓', email: 'E-pasts', draft: 'Melnraksts', read: 'Lasīt →', months: ['janv.', 'febr.', 'marts', 'apr.', 'maijs', 'jūn.', 'jūl.', 'aug.', 'sept.', 'okt.', 'nov.', 'dec.'],
    descr: 'Piezīmes par zīmēšanu, mācīšanos un radošumu no Alīnas Otkinskas un baloža Pollijas.',
    featured: '★ Izlase', archive: 'Arhīvs', inMonth: 'Raksti par', onlyFav: 'Mani izlases raksti', allSections: 'Visi', search: 'Meklēt blogā…', searchBtn: 'Meklēt', found: 'Meklēšanas rezultāti', nothing: 'Nekas netika atrasts. Pamēģiniet citu vārdu.', prev: '← Jaunāki', next: 'Vecāki →', section: 'Sadaļa', sections: 'Sadaļas', scheduled: '⏰ Ieplānots', browse: 'Sadaļas, birkas un arhīvs', count: n => `Blogā ir ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'raksts' : 'raksti'}`,
    monthsFull: ['janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs', 'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris'],
  },
};

// анонимные комментаторы: «птица + 2 цифры», имя на языке читателя
const BIRDS = {
  en: ['Robin', 'Sparrow', 'Finch', 'Wren', 'Starling', 'Swallow', 'Magpie', 'Owl', 'Puffin', 'Heron', 'Kingfisher', 'Blackbird', 'Thrush', 'Lark', 'Dove', 'Pigeon', 'Jay', 'Nightingale', 'Goldfinch', 'Tit'],
  ru: ['Малиновка', 'Воробей', 'Зяблик', 'Крапивник', 'Скворец', 'Ласточка', 'Сорока', 'Сова', 'Тупик', 'Цапля', 'Зимородок', 'Чёрный дрозд', 'Дрозд', 'Жаворонок', 'Горлица', 'Голубь', 'Сойка', 'Соловей', 'Щегол', 'Синица'],
  lv: ['Sarkanrīklīte', 'Zvirbulis', 'Žubīte', 'Sētas karaliņš', 'Mājas strazds', 'Bezdelīga', 'Žagata', 'Pūce', 'Tupelis', 'Gārnis', 'Zivju dzenītis', 'Melnais strazds', 'Strazds', 'Cīrulis', 'Ūbele', 'Balodis', 'Sīlis', 'Lakstīgala', 'Dadzītis', 'Zīlīte'],
};
// пометка под переведённой статьёй: «переведено онлайн-инструментами, возможны неточности» + ссылка на оригинал
const TR_NOTE = {
  en: (src, url) => `Translated from ${{ ru: 'Russian', lv: 'Latvian', en: 'English' }[src]} with online tools, so small inaccuracies are possible. <a href="${url}">Read the original</a>.`,
  ru: (src, url) => `Перевод с ${{ en: 'английского', lv: 'латышского', ru: 'русского' }[src]} сделан с помощью онлайн-инструментов и может быть немного неточным. <a href="${url}">Оригинал</a>.`,
  lv: (src, url) => `Tulkots no ${{ en: 'angļu', ru: 'krievu', lv: 'latviešu' }[src]} valodas ar tiešsaistes rīkiem, tāpēc iespējamas nelielas neprecizitātes. <a href="${url}">Oriģināls</a>.`,
};
const birdName = (code, lang) => { const [i, n] = String(code || '0:10').split(':'); return `${BIRDS[lang][+i % 20]} ${n}`; };

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// текст на языке читателя, а если перевода нет — на любом заполненном
// в названиях и описаниях — обычный текст; старые автопереводы могли сохранить «&quot;» и т.п. — показываем как символы
const unent = v => String(v || '').replace(/&(quot|#34|#39|apos|amp|lt|gt|nbsp);/g, (m, k) => ({ quot: '"', '#34': '"', '#39': "'", apos: "'", amp: '&', lt: '<', gt: '>', nbsp: ' ' }[k]));
// у статьи может быть несколько разделов (как коллекции на Patreon): в колонке section — слаги через запятую, первый — основной
const secsOf = p => String(p && p.section || '').split(',').map(x => x.trim()).filter(Boolean);
const field = (p, k, lang) => { const v = p[`${k}_${lang}`] || p[`${k}_ru`] || p[`${k}_en`] || p[`${k}_lv`] || ''; return k === 't' || k === 'd' ? unent(v) : v; };
const langOf = (p, lang) => p['t_' + lang] ? lang : ['ru', 'en', 'lv'].find(l => p['t_' + l]) || lang;
// теги: в статье хранится английский тег (tags_en), перевод — общий словарь blog_tags (en → ru, lv), правится во вкладке «Теги»
const splitTags = s => String(s || '').split(',').map(x => x.trim().toLowerCase().replace(/^#/, '')).filter(Boolean);
const tagsOf = p => splitTags(p.tags_en || p.tags_ru || p.tags_lv);
let TAGMAP = {}, SECTIONS = [];
const sectionName = (slug, lang) => { const r = SECTIONS.find(x => x.slug === slug); return r ? (r[lang] || r.en || slug) : ''; };
const tagLabel = (g, lang) => (lang !== 'en' && TAGMAP[g] && TAGMAP[g][lang]) || g;
async function loadTags(env) {
  TAGMAP = {};
  for (const r of (await env.DB.prepare('SELECT en, ru, lv, checked, src, created_at FROM blog_tags').all()).results) TAGMAP[r.en] = r;
  SECTIONS = (await env.DB.prepare('SELECT * FROM blog_sections ORDER BY sort, en').all()).results;
}
const stripTags = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const fmtDate = (ts, lang) => { const d = new Date(ts * 1000); return `${d.getUTCDate()} ${T[lang].months[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const blogUrl = (lang, slug, q = '') => `${PREFIX[lang]}/blog/${slug ? slug + '/' : ''}${q}`;

let ready = false;
async function ensureBlogSchema(env) {
  if (ready) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, status TEXT DEFAULT 'draft', cover TEXT DEFAULT '',
      t_ru TEXT DEFAULT '', t_en TEXT DEFAULT '', t_lv TEXT DEFAULT '', d_ru TEXT DEFAULT '', d_en TEXT DEFAULT '', d_lv TEXT DEFAULT '',
      b_ru TEXT DEFAULT '', b_en TEXT DEFAULT '', b_lv TEXT DEFAULT '', tags_ru TEXT DEFAULT '', tags_en TEXT DEFAULT '', tags_lv TEXT DEFAULT '',
      views INTEGER DEFAULT 0, likes INTEGER DEFAULT 0, created_at INTEGER, updated_at INTEGER, published_at INTEGER)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS blog_likes (post_id INTEGER NOT NULL, who TEXT NOT NULL, PRIMARY KEY (post_id, who))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS blog_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER NOT NULL, user_id INTEGER, anon TEXT, body TEXT NOT NULL,
      ip TEXT, status TEXT DEFAULT 'ok', created_at INTEGER)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS blog_comments_post ON blog_comments(post_id, created_at)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS blog_comments_ip ON blog_comments(ip, created_at)`),
  ]);
  try { await env.DB.prepare('ALTER TABLE blog_posts ADD COLUMN featured INTEGER DEFAULT 0').run(); } catch (e) { /* уже есть */ }
  try { await env.DB.prepare('ALTER TABLE blog_posts ADD COLUMN pinned INTEGER DEFAULT 0').run(); } catch (e) { /* уже есть */ }
  try { await env.DB.prepare('ALTER TABLE blog_posts ADD COLUMN src_lang TEXT').run(); } catch (e) { /* уже есть */ }
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS blog_tags (en TEXT PRIMARY KEY, ru TEXT DEFAULT '', lv TEXT DEFAULT '')`).run();
  // разделы блога (как коллекции на Patreon): у статьи один раздел, названия на трёх языках
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS blog_sections (slug TEXT PRIMARY KEY, en TEXT DEFAULT '', ru TEXT DEFAULT '', lv TEXT DEFAULT '', sort INTEGER DEFAULT 0)`).run();
  try { await env.DB.prepare("ALTER TABLE blog_posts ADD COLUMN section TEXT DEFAULT ''").run(); } catch (e) { /* уже есть */ }
  // один раз (октябрь 2026): новые темы блога вместо коллекций Patreon; разделы со всех статей сняты — Алина назначит заново
  if (!(await env.DB.prepare("SELECT value FROM meta WHERE key = 'sections_v2'").first().catch(() => null))) {
    const NEW = [['traditional-art', 'Traditional Art', 'Традиционное искусство', 'Tradicionālā māksla'], ['technologies', 'Technologies', 'Технологии', 'Tehnoloģijas'],
      ['education', 'Education', 'Обучение', 'Izglītība'], ['pollys-life', "Polly's Life", 'Жизнь Полли', 'Pollijas dzīve'], ['tips-guides', 'Tips & Guides', 'Советы и полезное', 'Padomi un noderīgais']];
    await env.DB.batch([env.DB.prepare('DELETE FROM blog_sections'), env.DB.prepare("UPDATE blog_posts SET section = ''"),
      ...NEW.map((r, i) => env.DB.prepare('INSERT INTO blog_sections (slug, en, ru, lv, sort) VALUES (?, ?, ?, ?, ?)').bind(...r, i + 1)),
      env.DB.prepare("INSERT INTO meta (key, value) VALUES ('sections_v2', '1') ON CONFLICT(key) DO UPDATE SET value = '1'")]);
  }
  // раздел «Истории» (рассказы и короткие истории, про Полли и не только) — добавляется один раз, если его ещё нет
  await env.DB.prepare("INSERT INTO blog_sections (slug, en, ru, lv, sort) VALUES ('stories', 'Stories', 'Истории', 'Stāsti', 6) ON CONFLICT(slug) DO NOTHING").run().catch(() => {});
  for (const sql of ['ALTER TABLE blog_tags ADD COLUMN checked INTEGER DEFAULT 0', "ALTER TABLE blog_tags ADD COLUMN src TEXT DEFAULT ''", 'ALTER TABLE blog_tags ADD COLUMN created_at INTEGER']) {
    try { await env.DB.prepare(sql).run(); } catch (e) { /* уже есть */ }
  }
  // один раз: переносим уже существующие теги статей в словарь (перевод берём из тегов RU/LV той же статьи по порядку)
  const done = await env.DB.prepare("SELECT value FROM meta WHERE key = 'blog_tags_v1'").first().catch(() => null);
  if (!done) {
    for (const p of (await env.DB.prepare('SELECT tags_en, tags_ru, tags_lv FROM blog_posts').all()).results) {
      const en = splitTags(p.tags_en), ru = splitTags(p.tags_ru), lv = splitTags(p.tags_lv);
      for (const [i, g] of en.entries()) {
        await env.DB.prepare("INSERT INTO blog_tags (en, ru, lv) VALUES (?, ?, ?) ON CONFLICT(en) DO UPDATE SET ru = CASE WHEN blog_tags.ru = '' THEN excluded.ru ELSE blog_tags.ru END, lv = CASE WHEN blog_tags.lv = '' THEN excluded.lv ELSE blog_tags.lv END")
          .bind(g, en.length === ru.length ? ru[i] : '', en.length === lv.length ? lv[i] : '').run();
      }
    }
    await env.DB.prepare("INSERT INTO meta (key, value) VALUES ('blog_tags_v1', '1') ON CONFLICT(key) DO UPDATE SET value = '1'").run().catch(() => {});
  }
  ready = true;
}

// ---------- очистка HTML статьи (пишет только админ, но всё равно оставляем только безопасные теги) ----------
const ALLOWED = { p: ['style'], h2: ['style'], h3: ['style'], b: [], strong: [], i: [], em: [], u: [], s: [], strike: [], del: [], br: [], hr: [], ul: [], ol: [], li: ['style'],
  blockquote: ['style'], figure: [], figcaption: [], a: ['href'], img: ['src', 'alt'], span: ['style'], mark: ['style'], font: ['color'] };
// из style оставляем только цвет текста, цвет маркера и выравнивание
const safeStyle = v => String(v || '').split(';').map(x => x.trim()).filter(x => /^(color|background-color)\s*:\s*(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|transparent)$/i.test(x) || /^text-align\s*:\s*(left|center|right)$/i.test(x)).join('; ');
const DROP = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'meta', 'link', 'svg', 'math', 'template', 'noscript']);
const safeUrl = u => /^(https?:\/\/|\/(?!\/)|mailto:)/i.test(String(u).trim());
async function cleanHtml(html) {
  const out = await new HTMLRewriter().on('*', {
    element(e) {
      let tag = e.tagName.toLowerCase();
      // видео: только YouTube (в режиме без cookie), остальные iframe выбрасываем
      if (tag === 'iframe') {
        const src = e.getAttribute('src') || '';
        if (!/^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{6,20}(\?[\w=&;-]*)?$/.test(src)) { e.remove(); return; }
        for (const [name] of [...e.attributes]) if (name !== 'src') e.removeAttribute(name);
        e.setAttribute('loading', 'lazy'); e.setAttribute('allowfullscreen', ''); e.setAttribute('title', 'YouTube video');
        e.setAttribute('allow', 'accelerometer; encrypted-media; gyroscope; picture-in-picture');
        return;
      }
      if (DROP.has(tag)) { e.remove(); return; }
      if (tag === 'div') { e.tagName = 'p'; tag = 'p'; }
      if (!ALLOWED[tag]) { e.removeAndKeepContent(); return; }
      for (const [name, value] of [...e.attributes]) {
        if (!ALLOWED[tag].includes(name) || ((name === 'href' || name === 'src') && !safeUrl(value))) e.removeAttribute(name);
        else if (name === 'style') { const st = safeStyle(value); if (st) e.setAttribute('style', st); else e.removeAttribute('style'); }
        else if (name === 'color' && !/^#[0-9a-f]{3,8}$/i.test(value)) e.removeAttribute('color');
      }
      if (tag === 'font') { const c = e.getAttribute('color'); e.tagName = 'span'; e.removeAttribute('color'); if (c) e.setAttribute('style', 'color: ' + c); }
      if (tag === 'span' && !e.getAttribute('style')) { e.removeAndKeepContent(); return; }
      if (tag === 'a') {
        const href = e.getAttribute('href') || '';
        if (/^https?:\/\//i.test(href) && !href.startsWith(SITE)) { e.setAttribute('target', '_blank'); e.setAttribute('rel', 'noopener'); }
      }
      if (tag === 'img') e.setAttribute('loading', 'lazy');
    },
  }).transform(new Response(`<body>${html}</body>`, { headers: { 'content-type': 'text/html' } })).text();
  return out.replace(/^<body>|<\/body>$/g, '').replace(/<p>(\s|<br>|&nbsp;)*<\/p>/g, '').replace(/<figcaption>(\s|<br>|&nbsp;)*<\/figcaption>/g, '').trim();
}

const slugify = s => String(s || '').toLowerCase()
  .replace(/[а-яё]/g, c => ({ а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' }[c]))
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);

// ---------- анонимный посетитель: cookie pp_a (случайный id браузера) ----------
const randomHex = n => [...crypto.getRandomValues(new Uint8Array(n))].map(b => b.toString(16).padStart(2, '0')).join('');
async function sha(s) { const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join(''); }
function visitor(req, cookie) {
  const v = cookie(req, 'pp_a');
  if (v && /^[0-9a-f]{32}$/.test(v)) return { id: v, set: null };
  const id = randomHex(16);
  return { id, set: `pp_a=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${400 * 86400}` };
}
async function anonCode(id) { const h = await sha('bird:' + id); return `${parseInt(h.slice(0, 6), 16) % 20}:${10 + parseInt(h.slice(6, 12), 16) % 90}`; }
// IP храним только как хеш с секретной солью (сам адрес не сохраняется)
async function ipHash(req, h) {
  let salt = await h.getMeta('blog_salt');
  if (!salt) { salt = randomHex(16); await h.setMeta('blog_salt', salt); }
  return (await sha(salt + (req.headers.get('cf-connecting-ip') || '0'))).slice(0, 32);
}

// ---------- API ----------
export async function blogApi(req, env, url, h) {
  await ensureBlogSchema(env);
  const p = url.pathname, m = req.method;
  const { json, fail } = h;
  const admin = async () => { const u = await h.needUser(req, env); if (!(await h.isAdmin(u, env))) fail(403, 'admin'); return u; };
  const body = () => req.json().catch(() => ({}));

  // состояние страницы статьи для посетителя: лайк, кто комментирует, админ ли
  if (m === 'GET' && p === '/api/blog/state') {
    const id = Number(url.searchParams.get('id')), lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
    const v = visitor(req, h.cookie);
    const u = await h.currentUser(req, env);
    const isAdm = await h.isAdmin(u, env);
    const liked = !!(await env.DB.prepare('SELECT 1 FROM blog_likes WHERE post_id = ? AND who = ?').bind(id, v.id).first());
    const post = await env.DB.prepare('SELECT likes FROM blog_posts WHERE id = ?').bind(id).first();
    const pending = isAdm ? (await env.DB.prepare(`SELECT c.id, c.body, c.anon, c.created_at, u.nick FROM blog_comments c LEFT JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ? AND c.status = 'pending' ORDER BY c.created_at`).bind(id).all()).results.map(c => ({ ...c, name: c.nick ? '@' + c.nick : birdName(c.anon, lang) })) : [];
    return json({ liked, likes: post?.likes || 0, user: u && !u.banned ? { nick: u.nick || null } : null, anon: birdName(await anonCode(v.id), lang),
      admin: isAdm, pending, clientId: env.GOOGLE_CLIENT_ID, dev: env.DEV_FAKE_LOGIN === '1' }, 200, v.set ? { 'set-cookie': v.set } : {});
  }

  if (m === 'POST' && p === '/api/blog/like') {
    const { id } = await body();
    const v = visitor(req, h.cookie);
    const post = await env.DB.prepare("SELECT id FROM blog_posts WHERE id = ? AND status = 'published' AND COALESCE(published_at, 0) <= CAST(strftime('%s', 'now') AS INTEGER)").bind(Number(id)).first();
    if (!post) fail(404, 'post');
    const had = await env.DB.prepare('SELECT 1 FROM blog_likes WHERE post_id = ? AND who = ?').bind(post.id, v.id).first();
    await env.DB.batch(had ? [
      env.DB.prepare('DELETE FROM blog_likes WHERE post_id = ? AND who = ?').bind(post.id, v.id),
      env.DB.prepare('UPDATE blog_posts SET likes = MAX(0, likes - 1) WHERE id = ?').bind(post.id),
    ] : [
      env.DB.prepare('INSERT INTO blog_likes (post_id, who) VALUES (?, ?)').bind(post.id, v.id),
      env.DB.prepare('UPDATE blog_posts SET likes = likes + 1 WHERE id = ?').bind(post.id),
    ]);
    const n = (await env.DB.prepare('SELECT likes FROM blog_posts WHERE id = ?').bind(post.id).first()).likes;
    return json({ liked: !had, likes: n }, 200, v.set ? { 'set-cookie': v.set } : {});
  }

  if (m === 'POST' && p === '/api/blog/comment') {
    const b = await body();
    if (b.website) return json({ status: 'ok' }); // ловушка для ботов
    const lang = LANGS.includes(b.lang) ? b.lang : 'en';
    const text = String(b.body || '').replace(/\r/g, '').trim().slice(0, MAX_COMMENT);
    if (text.length < 2) fail(400, 'empty');
    const post = await env.DB.prepare("SELECT id FROM blog_posts WHERE id = ? AND status = 'published' AND COALESCE(published_at, 0) <= CAST(strftime('%s', 'now') AS INTEGER)").bind(Number(b.id)).first();
    if (!post) fail(404, 'post');
    const u = await h.currentUser(req, env);
    if (u?.banned) fail(403, 'banned');
    const isAdm = await h.isAdmin(u, env);
    const ip = await ipHash(req, h);
    if (!isAdm) {
      const strict = (await h.getMeta('blog_strict')) === '1';
      const since = h.now() - (strict ? 3600 : 600);
      const n = (await env.DB.prepare('SELECT COUNT(*) AS n FROM blog_comments WHERE ip = ? AND created_at > ?').bind(ip, since).first()).n;
      if (n >= (strict ? 1 : 3)) fail(429, strict ? 'strict' : 'rate');
    }
    const v = visitor(req, h.cookie);
    const named = u && u.nick;
    const anon = named ? null : await anonCode(v.id);
    const hasLink = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|ru|lv|net|org|io|info|xyz|top|site|online|shop|me|co)\b)/i.test(text);
    const status = hasLink && !isAdm ? 'pending' : 'ok';
    const r = await env.DB.prepare('INSERT INTO blog_comments (post_id, user_id, anon, body, ip, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(post.id, named ? u.id : null, anon, text, ip, status, h.now()).run();
    return json({ status, comment: { id: r.meta.last_row_id, html: commentHtml({ id: r.meta.last_row_id, body: text, nick: named ? u.nick : null, anon, created_at: h.now() }, lang) } },
      200, v.set ? { 'set-cookie': v.set } : {});
  }

  // блок блога на главной: самая новая статья + избранные (★)
  // поиск по статьям (для 🔍 в шапке): заголовок, описание, текст и теги на любом языке
  if (m === 'GET' && p === '/api/blog/search') {
    const lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
    const q = String(url.searchParams.get('q') || '').trim().toLowerCase().slice(0, 80);
    if (q.length < 2) return json({ posts: [] });
    await loadTags(env);
    const words = q.split(/\s+/).filter(Boolean);
    const rows = (await env.DB.prepare("SELECT * FROM blog_posts WHERE status = 'published' AND COALESCE(published_at, 0) <= CAST(strftime('%s', 'now') AS INTEGER) ORDER BY published_at DESC").all()).results;
    const hits = [];
    for (const x of rows) {
      const hay = [...LANGS.flatMap(l => [x['t_' + l], x['d_' + l], stripTags(x['b_' + l])]), ...tagsOf(x).map(g => g + ' ' + tagLabel(g, lang))].join(' ').toLowerCase();
      if (!words.every(w => hay.includes(w))) continue;
      const t = field(x, 't', lang), inTitle = words.every(w => LANGS.some(l => String(x['t_' + l] || '').toLowerCase().includes(w)));
      hits.push({ t, d: field(x, 'd', lang), u: blogUrl(lang, x.slug), cover: x.cover || '', score: inTitle ? 2 : 1 });
      if (hits.length >= 30) break;
    }
    hits.sort((a, b) => b.score - a.score);
    return json({ posts: hits.slice(0, 12) }, 200, { 'cache-control': 'public, max-age=60' });
  }
  if (m === 'GET' && p === '/api/blog/home') {
    const lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
    await loadTags(env);
    const rows = (await env.DB.prepare(`SELECT * FROM blog_posts WHERE status = 'published' AND COALESCE(published_at, 0) <= CAST(strftime('%s', 'now') AS INTEGER) ORDER BY published_at DESC`).all()).results;
    const pack = x => ({ url: blogUrl(lang, x.slug), title: field(x, 't', lang), excerpt: field(x, 'd', lang) || stripTags(field(x, 'b', lang)).slice(0, 200),
      cover: x.cover, date: fmtDate(x.published_at, lang), tags: tagsOf(x).slice(0, 3).map(g => tagLabel(g, lang)), likes: x.likes });
    const latest = rows[0] || null; // крупно — самая новая статья
    const featured = rows.filter(x => x.featured && x !== latest).slice(0, 3); // справа — три последние со ★ (кроме той, что уже крупно)
    return json({ latest: latest && pack(latest), featured: featured.map(x => ({ ...pack(x), star: true })) });
  }

  // полная копия сайта: блог + челлендж (аккаунты, работы) + список файлов картинок. Доступ — админ или личный ключ автокопии (?token=)
  if (m === 'GET' && p === '/api/blog/backup') {
    const tok = await h.getMeta('backup_token');
    const byToken = tok && url.searchParams.get('token') === tok;
    if (!byToken) await admin();
    return json(await fullBackup(env));
  }

  // ---------- редактор (только админ) ----------
  if (p.startsWith('/api/blog/admin/')) {
    await admin();
    const a = p.slice('/api/blog/admin/'.length);
    if (m === 'GET' && a === 'posts') {
      const rows = (await env.DB.prepare(`SELECT p.id, p.slug, p.status, p.featured, p.pinned, p.section, p.t_ru, p.t_en, p.t_lv, p.tags_ru, p.tags_en, p.tags_lv, p.cover, p.views, p.likes, p.updated_at, p.published_at,
        (SELECT COUNT(*) FROM blog_comments c WHERE c.post_id = p.id) AS comments FROM blog_posts p ORDER BY COALESCE(p.published_at, p.updated_at) DESC`).all()).results;
      const pending = (await env.DB.prepare(`SELECT c.id, c.body, c.anon, c.created_at, c.post_id, p.slug, p.t_ru, u.nick FROM blog_comments c
        JOIN blog_posts p ON p.id = c.post_id LEFT JOIN users u ON u.id = c.user_id WHERE c.status = 'pending' ORDER BY c.created_at DESC LIMIT 100`).all()).results
        .map(c => ({ ...c, name: c.nick ? '@' + c.nick : birdName(c.anon, 'ru') }));
      return json({ posts: rows, pending, strict: (await h.getMeta('blog_strict')) === '1', ai: !!env.AI || env.DEV_FAKE_LOGIN === '1', gemini: !!(await geminiKey(env)), media: !!env.MEDIA });
    }
    if (m === 'GET' && a === 'post') {
      const post = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(Number(url.searchParams.get('id'))).first();
      if (!post) fail(404, 'post');
      return json({ post });
    }
    if (m === 'POST' && a === 'save') {
      const b = await body();
      const t = h.now();
      const f = {};
      for (const l of LANGS) {
        f['t_' + l] = unent(b['t_' + l]).trim().slice(0, 200);
        f['d_' + l] = unent(b['d_' + l]).trim().slice(0, 400);
        f['b_' + l] = await cleanHtml(String(b['b_' + l] || '').replace(/<img[^>]+src="data:[^"]*"[^>]*>/gi, '')); // картинки-«data:» в базу не кладём
        if (f['b_' + l].length > 900_000) fail(413, 'too_big');
      }
      if (!f.t_ru && !f.t_en && !f.t_lv) fail(400, 'title');
      // теги — на английском; новые сразу добавляем в словарь и стараемся перевести (потом можно поправить во вкладке «Теги»)
      const tagList = [...new Set(splitTags(b.tags_en))].slice(0, 12);
      await loadTags(env);
      const untranslated = g => !TAGMAP[g] || (!TAGMAP[g].checked && (!TAGMAP[g].ru || !TAGMAP[g].lv || TAGMAP[g].ru === g || TAGMAP[g].lv === g));
      const fresh = tagList.filter(untranslated);
      if (fresh.length) await translateTags(env, fresh);
      f.section = [...new Set((Array.isArray(b.section) ? b.section : String(b.section || '').split(',')).map(x => slugify(x)).filter(Boolean))].join(',');
      f.tags_en = tagList.join(', ');
      f.tags_ru = tagList.map(g => tagLabel(g, 'ru')).join(', ');
      f.tags_lv = tagList.map(g => tagLabel(g, 'lv')).join(', ');
      let cover = safeUrl(b.cover || '') ? String(b.cover).trim() : '';
      // картинки, вставленные из Google Docs, живут там временно — копируем их в своё хранилище
      // картинки из Google Docs копируются в редакторе сразу при вставке (fetch-image), здесь сохраняем быстро
      const status = b.status === 'published' ? 'published' : 'draft';
      const featured = b.featured ? 1 : 0;
      let slug = slugify(b.slug || f.t_en || f.t_ru) || 'post';
      for (let i = 2; ; i++) {
        const other = await env.DB.prepare('SELECT id FROM blog_posts WHERE slug = ?').bind(slug).first();
        if (!other || other.id === Number(b.id)) break;
        slug = slug.replace(/-\d+$/, '') + '-' + i;
      }
      let id = Number(b.id) || 0;
      const old = id ? await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first() : null;
      if (id && !old) fail(404, 'post');
      // дату можно поменять в редакторе (b.published_at — секунды); иначе первая публикация
      const custom = Number(b.published_at) > 0 && Number(b.published_at) < t + 366 * 86400 ? Math.floor(Number(b.published_at)) : null;
      const published = custom || (status === 'published' ? (old?.published_at || t) : old?.published_at || null);
      const cols = Object.keys(f);
      if (old) {
        await env.DB.prepare(`UPDATE blog_posts SET ${cols.map(c => c + ' = ?').join(', ')}, slug = ?, cover = ?, status = ?, featured = ?, updated_at = ?, published_at = ? WHERE id = ?`)
          .bind(...cols.map(c => f[c]), slug, cover, status, featured, t, published, id).run();
      } else {
        const r = await env.DB.prepare(`INSERT INTO blog_posts (${cols.join(', ')}, slug, cover, status, featured, created_at, updated_at, published_at) VALUES (${cols.map(() => '?').join(', ')}, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(...cols.map(c => f[c]), slug, cover, status, featured, t, t, published).run();
        id = r.meta.last_row_id;
      }
      await env.DB.prepare('UPDATE blog_posts SET src_lang = ? WHERE id = ?').bind(LANGS.includes(b.src_lang) ? b.src_lang : null, id).run();
      if (typeof b.pinned === 'boolean') {
        if (b.pinned) await env.DB.batch([env.DB.prepare('UPDATE blog_posts SET pinned = 0'), env.DB.prepare('UPDATE blog_posts SET pinned = 1 WHERE id = ?').bind(id)]);
        else await env.DB.prepare('UPDATE blog_posts SET pinned = 0 WHERE id = ?').bind(id).run();
      }
      return json({ ok: true, id, slug, status });
    }
    if (m === 'POST' && a === 'delete') {
      const { id } = await body();
      await env.DB.batch([
        env.DB.prepare('DELETE FROM blog_comments WHERE post_id = ?').bind(Number(id)),
        env.DB.prepare('DELETE FROM blog_likes WHERE post_id = ?').bind(Number(id)),
        env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(Number(id)),
      ]);
      return json({ ok: true });
    }
    // 📌 какая статья стоит крупно на главной (только одна)
    if (m === 'POST' && a === 'pin') {
      const { id, pinned } = await body();
      await env.DB.batch([
        env.DB.prepare('UPDATE blog_posts SET pinned = 0'),
        ...(pinned ? [env.DB.prepare('UPDATE blog_posts SET pinned = 1 WHERE id = ?').bind(Number(id))] : []),
      ]);
      return json({ ok: true });
    }
    // действия сразу с несколькими статьями: раздел, избранное, опубликовать/в черновики, удалить
    if (m === 'POST' && a === 'bulk') {
      const b = await body();
      const ids = [...new Set((b.ids || []).map(Number).filter(Boolean))].slice(0, 500);
      if (!ids.length) fail(400, 'bad');
      const q = (sql, ...args) => ids.map(id => env.DB.prepare(sql).bind(...args, id));
      let st;
      if (b.action === 'section') st = q('UPDATE blog_posts SET section = ? WHERE id = ?', [...new Set((Array.isArray(b.value) ? b.value : String(b.value || '').split(',')).map(x => slugify(x)).filter(Boolean))].join(','));
      else if (b.action === 'addsection' || b.action === 'rmsection') { // добавить / убрать один раздел, остальные разделы статьи остаются
        const v = slugify(b.value || ''), rows = (await env.DB.prepare(`SELECT id, section FROM blog_posts WHERE id IN (${ids.map(() => '?').join(',')})`).bind(...ids).all()).results;
        st = rows.map(r => { const l = secsOf(r).filter(x => x !== v); if (b.action === 'addsection' && v) l.push(v); return env.DB.prepare('UPDATE blog_posts SET section = ? WHERE id = ?').bind(l.join(','), r.id); });
      }
      else if (b.action === 'date') { const ts = Math.floor(Number(b.value)); if (!(ts > 0)) fail(400, 'bad'); st = q('UPDATE blog_posts SET published_at = ? WHERE id = ?', ts); }
      else if (b.action === 'feature' || b.action === 'unfeature') st = q('UPDATE blog_posts SET featured = ? WHERE id = ?', b.action === 'feature' ? 1 : 0);
      else if (b.action === 'publish') st = q("UPDATE blog_posts SET status = 'published', published_at = COALESCE(published_at, ?) WHERE id = ?", h.now());
      else if (b.action === 'draft') st = q("UPDATE blog_posts SET status = 'draft' WHERE id = ?");
      else if (b.action === 'delete') st = ids.flatMap(id => [
        env.DB.prepare('DELETE FROM blog_comments WHERE post_id = ?').bind(id),
        env.DB.prepare('DELETE FROM blog_likes WHERE post_id = ?').bind(id),
        env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id)]);
      else fail(400, 'bad');
      await env.DB.batch(st);
      return json({ ok: true, count: ids.length });
    }
    if (m === 'POST' && a === 'feature') {
      const { id, featured } = await body();
      await env.DB.prepare('UPDATE blog_posts SET featured = ? WHERE id = ?').bind(featured ? 1 : 0, Number(id)).run();
      return json({ ok: true });
    }
    // ключ Gemini из редактора: сохранить / проверить (сам ключ наружу не отдаём)
    // ---------- кабинет админа ----------
    // сводка: статьи, комментарии, птицы, работы челленджа
    if (m === 'GET' && a === 'overview') {
      const one = async (sql, ...v) => (await env.DB.prepare(sql).bind(...v).first()) || {};
      const all = async (sql, ...v) => (await env.DB.prepare(sql).bind(...v).all()).results;
      const t = h.now(), week = t - 7 * 86400;
      const posts = await one("SELECT SUM(status = 'published') AS pub, SUM(status != 'published') AS draft, COALESCE(SUM(views), 0) AS views, COALESCE(SUM(likes), 0) AS likes FROM blog_posts");
      const com = await one("SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending, SUM(created_at > ?) AS week FROM blog_comments", week);
      let users = {}, works = {}, newUsers = [], newWorks = [];
      try {
        users = await one('SELECT COUNT(*) AS total, SUM(created_at > ?) AS week, SUM(COALESCE(last_seen, 0) > ?) AS active FROM users WHERE banned = 0', week, week);
        works = await one('SELECT COUNT(*) AS total, SUM(created_at > ?) AS week FROM posts', week);
        newUsers = await all('SELECT id, nick, created_at FROM users WHERE banned = 0 ORDER BY created_at DESC LIMIT 8');
        newWorks = await all('SELECT p.id, p.day, p.theme, u.nick FROM posts p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 8');
      } catch (e) { /* таблиц челленджа может не быть */ }
      const top = await all("SELECT id, slug, t_ru, t_en, t_lv, views, likes, (SELECT COUNT(*) FROM blog_comments c WHERE c.post_id = p.id) AS comments FROM blog_posts p WHERE status = 'published' ORDER BY views DESC LIMIT 6");
      const meta = async k => (await one('SELECT value FROM meta WHERE key = ?', k)).value;
      return json({ posts, comments: com, users, works, top, newUsers, newWorks,
        totals: { works: Number(await meta('works_total')) || works.total || 0, users: Number(await meta('users_total')) || users.total || 0 } });
    }
    // все комментарии блога (новые сверху), с фильтром
    if (m === 'GET' && a === 'comments') {
      const f = url.searchParams.get('filter') || 'all';
      const where = f === 'pending' ? "WHERE c.status = 'pending'" : '';
      const rows = (await env.DB.prepare(`SELECT c.id, c.body, c.anon, c.status, c.created_at, c.post_id, p.slug, p.t_ru, p.t_en, p.t_lv, u.nick
        FROM blog_comments c JOIN blog_posts p ON p.id = c.post_id LEFT JOIN users u ON u.id = c.user_id ${where} ORDER BY c.created_at DESC LIMIT 300`).all()).results
        .map(c => ({ ...c, name: c.nick ? '@' + c.nick : birdName(c.anon, 'ru') }));
      return json({ comments: rows, strict: (await h.getMeta('blog_strict')) === '1' });
    }
    if (a === 'gemini-key') {
      if (m === 'POST') {
        const { key } = await body();
        const k = String(key || '').trim();
        if (k) await h.setMeta('gemini_key', k); else await env.DB.prepare("DELETE FROM meta WHERE key = 'gemini_key'").run();
      }
      const k = await geminiKey(env);
      let test = null;
      if (k && url.searchParams.get('test')) {
        try { test = (await gemini(env, ['Привет! Это проверка перевода.'], 'ru', 'en', k))[0]; } catch (e) { test = 'ERROR:' + (e.code || 'ai'); }
      }
      return json({ connected: !!k, from: env.GEMINI_KEY ? 'cloudflare' : k ? 'site' : '', test });
    }
    // личный ключ для автокопии в Google Drive (создать / сменить)
    if (a === 'backup-token') {
      let tok = await h.getMeta('backup_token');
      if (m === 'POST' || !tok) { tok = randomHex(24); await h.setMeta('backup_token', tok); }
      return json({ token: tok, url: SITE + '/api/blog/backup?token=' + tok });
    }
    // резервная копия блога: все статьи, теги, разделы, комментарии и список картинок (сами картинки браузер скачивает по /media/...)
    if (m === 'GET' && a === 'export') {
      const all = q => env.DB.prepare(q).all().then(r => r.results);
      const media = [];
      if (env.MEDIA) { let cursor; do { const r = await env.MEDIA.list({ prefix: 'blog/', cursor }); media.push(...r.objects.map(o => o.key)); cursor = r.truncated ? r.cursor : null; } while (cursor); }
      return json({ version: 1, site: SITE, exported_at: new Date().toISOString(), posts: await all('SELECT * FROM blog_posts'), tags: await all('SELECT * FROM blog_tags'),
        sections: await all('SELECT * FROM blog_sections'), comments: await all('SELECT c.*, p.slug FROM blog_comments c JOIN blog_posts p ON p.id = c.post_id'), media });
    }
    // восстановление: картинка с прежним адресом (если её уже нет) и данные блога (статьи по адресу slug — обновляются, новых добавляются)
    if (m === 'POST' && a === 'restore-media') {
      if (!env.MEDIA) fail(503, 'media');
      const form = await req.formData(), file = form.get('file'), key = String(form.get('key') || '');
      if (!(file instanceof File) || !/^blog\/[\w\/.-]+$/.test(key)) fail(400, 'bad');
      if (!(await env.MEDIA.head(key))) await env.MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type || 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' } });
      return json({ ok: true });
    }
    if (m === 'POST' && a === 'import') {
      const b = await body();
      if (!b || ![1, 2].includes(b.version) || !Array.isArray(b.posts)) fail(400, 'bad');
      const COLS = ['slug', 'status', 'cover', 't_ru', 't_en', 't_lv', 'd_ru', 'd_en', 'd_lv', 'b_ru', 'b_en', 'b_lv', 'tags_ru', 'tags_en', 'tags_lv', 'views', 'likes', 'created_at', 'updated_at', 'published_at', 'featured', 'pinned', 'src_lang', 'section'];
      let posts = 0, comments = 0;
      for (const p of b.posts) {
        if (!p.slug) continue;
        const vals = COLS.map(c => p[c] ?? (['views', 'likes', 'featured', 'pinned'].includes(c) ? 0 : c.endsWith('_at') ? null : ''));
        await env.DB.prepare(`INSERT INTO blog_posts (${COLS.join(', ')}) VALUES (${COLS.map(() => '?').join(', ')}) ON CONFLICT(slug) DO UPDATE SET ${COLS.filter(c => c !== 'slug').map(c => `${c} = excluded.${c}`).join(', ')}`).bind(...vals).run();
        posts++;
      }
      for (const t of b.tags || []) await env.DB.prepare('INSERT INTO blog_tags (en, ru, lv, checked, src, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(en) DO UPDATE SET ru = excluded.ru, lv = excluded.lv, checked = excluded.checked, src = excluded.src')
        .bind(t.en, t.ru || '', t.lv || '', t.checked || 0, t.src || '', t.created_at || null).run();
      for (const x of b.sections || []) await env.DB.prepare('INSERT INTO blog_sections (slug, en, ru, lv, sort) VALUES (?, ?, ?, ?, ?) ON CONFLICT(slug) DO UPDATE SET en = excluded.en, ru = excluded.ru, lv = excluded.lv, sort = excluded.sort')
        .bind(x.slug, x.en || '', x.ru || '', x.lv || '', x.sort || 0).run();
      for (const c of b.comments || []) {
        const post = await env.DB.prepare('SELECT id FROM blog_posts WHERE slug = ?').bind(c.slug).first();
        if (!post) continue;
        const dup = await env.DB.prepare('SELECT 1 FROM blog_comments WHERE post_id = ? AND created_at = ? AND body = ?').bind(post.id, c.created_at, c.body).first();
        if (dup) continue;
        await env.DB.prepare('INSERT INTO blog_comments (post_id, user_id, anon, body, ip, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(post.id, c.user_id || null, c.anon || null, c.body, c.ip || '', c.status || 'ok', c.created_at).run();
        comments++;
      }
      return json({ ok: true, posts, comments });
    }
    // разделы: список, создать/изменить (названия на трёх языках, порядок), удалить
    if (m === 'GET' && a === 'sections') {
      await loadTags(env);
      const cnt = {};
      for (const r of (await env.DB.prepare('SELECT section FROM blog_posts').all()).results) for (const x of secsOf(r)) cnt[x] = (cnt[x] || 0) + 1;
      return json({ sections: SECTIONS.map(x => ({ ...x, count: cnt[x.slug] || 0 })) });
    }
    if (m === 'POST' && a === 'section-set') {
      const b = await body();
      const en = String(b.en || '').trim().slice(0, 60);
      if (!en) fail(400, 'bad');
      const slug = b.slug ? slugify(b.slug) : slugify(en);
      let ru = String(b.ru || '').trim().slice(0, 60), lv = String(b.lv || '').trim().slice(0, 60);
      if (!b.slug && (!ru || !lv)) { // новый раздел — пробуем перевести название
        // переводим сразу на оба языка, но не дольше 12 секунд — иначе оставляем пустым, можно вписать руками
        const tr = l => Promise.race([translateAll(env, [en], 'en', l).then(r => String(r.texts[0] || '').trim()), new Promise(r => setTimeout(() => r(''), 12000))]).catch(() => '');
        const [r1, r2] = await Promise.all([ru ? ru : tr('ru'), lv ? lv : tr('lv')]); ru = r1; lv = r2;
      }
      const max = (await env.DB.prepare('SELECT COALESCE(MAX(sort), 0) AS m FROM blog_sections').first()).m;
      await env.DB.prepare('INSERT INTO blog_sections (slug, en, ru, lv, sort) VALUES (?, ?, ?, ?, ?) ON CONFLICT(slug) DO UPDATE SET en = excluded.en, ru = excluded.ru, lv = excluded.lv' + (b.sort != null ? ', sort = excluded.sort' : ''))
        .bind(slug, en, ru, lv, b.sort != null ? Number(b.sort) : max + 1).run();
      return json({ ok: true, slug });
    }
    if (m === 'POST' && a === 'section-delete') {
      const { slug } = await body();
      const hit = (await env.DB.prepare("SELECT id, section FROM blog_posts WHERE ',' || section || ',' LIKE ?").bind('%,' + String(slug) + ',%').all()).results;
      await env.DB.batch([...hit.map(r => env.DB.prepare('UPDATE blog_posts SET section = ? WHERE id = ?').bind(secsOf(r).filter(x => x !== String(slug)).join(','), r.id)), env.DB.prepare('DELETE FROM blog_sections WHERE slug = ?').bind(String(slug))]);
      return json({ ok: true });
    }
    // словарь тегов: список со счётчиками, правка перевода, перевод пустых
    if (m === 'GET' && a === 'tags') {
      await loadTags(env);
      const count = {};
      for (const p of (await env.DB.prepare('SELECT tags_en, tags_ru, tags_lv FROM blog_posts').all()).results) for (const g of tagsOf(p)) count[g] = (count[g] || 0) + 1;
      const keys = Object.keys(count).sort();
      return json({ tags: keys.map(g => ({ en: g, ru: TAGMAP[g]?.ru || '', lv: TAGMAP[g]?.lv || '', count: count[g], checked: !!TAGMAP[g]?.checked, src: TAGMAP[g]?.src || '', created: TAGMAP[g]?.created_at || 0 })) });
    }
    if (m === 'POST' && a === 'tag-set') {
      const b = await body();
      const en = String(b.en || '').trim().toLowerCase();
      if (!en) fail(400, 'bad');
      const clean = v => String(v || '').trim().toLowerCase().replace(/^#/, '').replace(/,/g, ' ').slice(0, 60);
      const checked = b.checked === false ? 0 : 1; // правка руками = проверено
      await env.DB.prepare("INSERT INTO blog_tags (en, ru, lv, checked, src, created_at) VALUES (?, ?, ?, ?, 'manual', ?) ON CONFLICT(en) DO UPDATE SET ru = excluded.ru, lv = excluded.lv, checked = excluded.checked, src = CASE WHEN excluded.checked = 1 THEN 'manual' ELSE blog_tags.src END")
        .bind(en, clean(b.ru), clean(b.lv), checked, Math.floor(Date.now() / 1000)).run();
      await syncTagColumns(env);
      return json({ ok: true });
    }
    if (m === 'POST' && a === 'tags-translate') {
      await loadTags(env);
      const count = {};
      for (const p of (await env.DB.prepare('SELECT tags_en, tags_ru, tags_lv FROM blog_posts').all()).results) for (const g of tagsOf(p)) count[g] = 1;
      const todo = Object.keys(count).filter(g => !TAGMAP[g] || (!TAGMAP[g].checked && (!TAGMAP[g].ru || !TAGMAP[g].lv || TAGMAP[g].ru === g || TAGMAP[g].lv === g)));
      if (todo.length) await translateTags(env, todo);
      await syncTagColumns(env);
      return json({ ok: true, translated: todo.length });
    }
    // тег во всех статьях сразу: переименовать (to) или удалить (to пустой); теги статей — английские
    if (m === 'POST' && a === 'tag') {
      const b = await body();
      b.lang = 'en';
      const col = 'tags_' + b.lang, from = String(b.from || '').trim().toLowerCase(), to = String(b.to || '').trim().toLowerCase().replace(/^#/, '').replace(/,/g, ' ');
      if (!from) fail(400, 'bad');
      const rows = (await env.DB.prepare(`SELECT id, ${col} AS t FROM blog_posts`).all()).results;
      let n = 0;
      for (const r of rows) {
        const list = String(r.t || '').split(',').map(x => x.trim()).filter(Boolean);
        if (!list.includes(from)) continue;
        const next = [...new Set(list.map(x => x === from ? to : x).filter(Boolean))].join(', ');
        await env.DB.prepare(`UPDATE blog_posts SET ${col} = ? WHERE id = ?`).bind(next, r.id).run();
        n++;
      }
      // словарь: при переименовании переносим перевод на новое имя, при удалении — убираем
      const old = await env.DB.prepare('SELECT ru, lv FROM blog_tags WHERE en = ?').bind(from).first();
      if (to && old) await env.DB.prepare('INSERT INTO blog_tags (en, ru, lv) VALUES (?, ?, ?) ON CONFLICT(en) DO NOTHING').bind(to, old.ru, old.lv).run();
      await env.DB.prepare('DELETE FROM blog_tags WHERE en = ?').bind(from).run();
      await syncTagColumns(env);
      return json({ ok: true, posts: n });
    }
    if (m === 'POST' && a === 'settings') {
      const { strict } = await body();
      await h.setMeta('blog_strict', strict ? '1' : '0');
      return json({ ok: true, strict: !!strict });
    }
    if (m === 'POST' && a === 'comment') {
      const { id, action } = await body();
      if (action === 'approve') await env.DB.prepare("UPDATE blog_comments SET status = 'ok' WHERE id = ?").bind(Number(id)).run();
      else await env.DB.prepare('DELETE FROM blog_comments WHERE id = ?').bind(Number(id)).run();
      return json({ ok: true });
    }
    if (m === 'POST' && a === 'upload') {
      if (!env.MEDIA) fail(503, 'media');
      const form = await req.formData();
      const file = form.get('file');
      if (!(file instanceof File)) fail(400, 'file');
      if (file.size > MAX_IMG) fail(413, 'big');
      const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[file.type];
      if (!ext) fail(400, 'type');
      const d = new Date();
      const key = `blog/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${randomHex(8)}.${ext}`;
      await env.MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' } });
      return json({ url: '/media/' + key });
    }
    // картинка по ссылке (из Google Docs) → сразу в наше хранилище, пока ссылка ещё работает
    if (m === 'POST' && a === 'fetch-image') {
      const { url: src } = await body();
      if (!/^https:\/\//i.test(String(src || ''))) fail(400, 'bad');
      const local = await rehostOne(env, String(src), {});
      if (!local) fail(502, 'fetch');
      return json({ url: local });
    }
    if (m === 'POST' && a === 'translate') {
      const { texts, to, from, strict } = await body();
      if (!LANGS.includes(to) || !LANGS.includes(from) || to === from || !Array.isArray(texts)) fail(400, 'bad');
      try { return json(await translateAll(env, texts.slice(0, 300).map(s => String(s).slice(0, 4000)), from, to, !!strict)); }
      catch (e) { fail(e.status || 502, e.code || 'ai'); }
    }
  }
  fail(404, 'not_found');
}

async function rehostOne(env, src, moved) {
  if (moved[src] !== undefined) return moved[src];
  moved[src] = null;
  if (!env.MEDIA) return null;
  try {
    const r = await fetch(src, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36', Referer: 'https://docs.google.com/', Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8' } });
    let type = (r.headers.get('content-type') || '').split(';')[0];
    if (type === 'application/octet-stream' || type === 'binary/octet-stream') type = 'image/png';
    const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[type];
    if (!r.ok || !ext) return null;
    const buf = await r.arrayBuffer();
    if (buf.byteLength > MAX_IMG) return null;
    const d = new Date();
    const key = `blog/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${randomHex(8)}.${ext}`;
    await env.MEDIA.put(key, buf, { httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' } });
    return (moved[src] = '/media/' + key);
  } catch (e) { return null; }
}

// перевод: Workers AI (m2m100). Теги внутри абзаца прячем за метками ⟦1⟧; если метки потерялись — переводим чистый текст.
async function translateOne(env, text, from, to) {
  if (!text.trim()) return text;
  const run = async s => {
    if (!env.AI) {
      if (env.DEV_FAKE_LOGIN === '1') return `[${to}] ${s}`;
      throw Object.assign(new Error('ai'), { code: 'ai' });
    }
    try {
      const r = await env.AI.run('@cf/meta/m2m100-1.2b', { text: s, source_lang: from, target_lang: to });
      return r.translated_text || '';
    } catch (e) {
      const msg = String(e && e.message || e);
      throw Object.assign(new Error(msg), { code: /limit|quota|429|4006|neuron/i.test(msg) ? 'ai_limit' : 'ai' });
    }
  };
  // m2m100 обрезает длинные куски — длинный абзац переводим по предложениям (оформление внутри него теряется, но текст целый)
  if (text.length > 380) {
    const plain = stripTags(text), parts = [];
    let cur = '';
    for (const sent of plain.match(/[^.!?…]+[.!?…]+["»”')]*\s*|[^.!?…]+$/g) || [plain]) {
      if ((cur + sent).length > 350 && cur) { parts.push(cur); cur = ''; }
      cur += sent;
    }
    if (cur) parts.push(cur);
    const out = [];
    for (const part of parts) out.push(await run(part.trim()));
    return out.join(' ');
  }
  const tags = [];
  const masked = text.replace(/<[^>]+>/g, t => { tags.push(t); return `⟦${tags.length}⟧`; });
  if (!tags.length) return run(text);
  const out = await run(masked);
  if (tags.every((_, i) => out.includes(`⟦${i + 1}⟧`))) return out.replace(/⟦(\d+)⟧/g, (_, n) => tags[n - 1]);
  return run(stripTags(text));
}
// Gemini (ключ GEMINI_KEY в Cloudflare): переводит по смыслу и держит HTML. Модели по очереди — если одна перегружена, берём следующую.
const LANG_NAME = { ru: 'Russian', en: 'English', lv: 'Latvian' };
// Flash-Lite — быстрые (30 абзацев ≈ 8 с) и реже перегружены; полная Flash — запасная
const GEMINI_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.5-flash'];
// ключ Gemini: из Cloudflare (GEMINI_KEY) или из настроек редактора (meta.gemini_key)
async function geminiKey(env) {
  if (env.GEMINI_KEY) return env.GEMINI_KEY;
  const r = await env.DB.prepare("SELECT value FROM meta WHERE key = 'gemini_key'").first().catch(() => null);
  return r && r.value || '';
}
async function gemini(env, texts, from, to, key) {
  const prompt = `You are a careful professional translator. Translate every string in the JSON array below from ${LANG_NAME[from]} to ${LANG_NAME[to]}.
The strings are consecutive parts of one blog post written by an illustrator about drawing.
Rules:
- Translate faithfully and accurately. Do not add, remove, soften or change any facts, opinions, numbers or details. Do not add your own jokes, idioms or explanations.
- Make it read naturally and fluently in ${LANG_NAME[to]}, keeping the author's tone (personal, friendly), but stay close to the original meaning sentence by sentence.
- Keep every HTML tag and attribute exactly as it is, in the same places; translate only the human-readable text between tags.
- Keep brand, product and personal names (e.g. Moleskine, Talens, SM*LT, Pigeon Polly), numbers and units unchanged.
- If a string is a comma-separated list of short tags, return a comma-separated list of lowercase tags. Empty strings stay empty.
Return only a JSON array of exactly ${texts.length} strings in the same order.

${JSON.stringify(texts)}`;
  const models = env.GEMINI_MODEL ? [env.GEMINI_MODEL, ...GEMINI_MODELS] : GEMINI_MODELS;
  let lastErr = 'ai';
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt) await new Promise(res => setTimeout(res, 8000)); // все заняты — ждём и пробуем ещё раз
  for (const model of models) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, responseMimeType: 'application/json', responseSchema: { type: 'ARRAY', items: { type: 'STRING' } } } }),
    });
    if (r.status === 400 || r.status === 401 || r.status === 403) { const t = await r.text(); if (/API key|PERMISSION|UNAUTHENTICATED|API_KEY/i.test(t)) throw Object.assign(new Error('bad_key'), { code: 'bad_key' }); }
    if (!r.ok) { lastErr = r.status === 429 ? 'ai_limit' : 'ai'; continue; } // 404 (модель закрыли), 503 (перегружена), 429 (лимит) — пробуем следующую
    try {
      const d = await r.json();
      const out = JSON.parse(d.candidates[0].content.parts.map(p => p.text || '').join(''));
      if (Array.isArray(out) && out.length === texts.length) return out.map(x => String(x ?? ''));
    } catch (e) { /* ответ не разобрался — следующая модель */ }
  }
  }
  throw Object.assign(new Error(lastErr), { code: lastErr });
}

// strict: только Gemini (для статей) — если не вышло, ошибка, а не слабый перевод
async function translateAll(env, texts, from, to, strict = false) {
  const out = [];
  const key = await geminiKey(env);
  const err = code => Object.assign(new Error(code), { code, status: code === 'ai_limit' ? 429 : code === 'no_key' || code === 'bad_key' ? 400 : 502 });
  if (strict && !key) throw err('no_key');
  if (key) {
    try {
      const res = await gemini(env, texts, from, to, key);
      // пустой ответ на непустой абзац — этот абзац переводим запасным переводчиком
      for (let i = 0; i < res.length; i++) {
        if (texts[i].trim() && !res[i].trim()) {
          try { res[i] = await translateOne(env, texts[i], from, to); } catch (e) { res[i] = texts[i]; }
        }
      }
      return { texts: res, engine: 'gemini' };
    } catch (e) { if (strict) throw err(e.code || 'ai'); /* иначе — запасной вариант ниже */ }
  }
  try {
    for (let i = 0; i < texts.length; i += 4) out.push(...await Promise.all(texts.slice(i, i + 4).map(s => translateOne(env, s, from, to))));
  } catch (e) {
    const err = new Error(e.code || 'ai'); err.status = e.code === 'ai_limit' ? 429 : 502; err.code = e.code || 'ai'; throw err;
  }
  return { texts: out, engine: 'cloudflare' };
}

// частые теги про рисование — готовый перевод без машинного переводчика (RU/LV)
const GLOSSARY = {
  'watercolor': ['акварель', 'akvarelis'],
  'watercolour': ['акварель', 'akvarelis'],
  'sketchbook': ['скетчбук', 'skiču bloks'],
  'sketchbooks': ['скетчбуки', 'skiču bloki'],
  'review': ['обзор', 'apskats'],
  'reviews': ['обзоры', 'apskati'],
  'paper': ['бумага', 'papīrs'],
  'ink': ['тушь', 'tuša'],
  'gouache': ['гуашь', 'guaša'],
  'acrylic': ['акрил', 'akrils'],
  'pencil': ['карандаш', 'zīmulis'],
  'drawing': ['рисование', 'zīmēšana'],
  'illustration': ['иллюстрация', 'ilustrācija'],
  'painting': ['живопись', 'glezniecība'],
  'art': ['искусство', 'māksla'],
  'ai': ['ии', 'mi'],
  'ai art': ['ии-арт', 'mi māksla'],
  'tutorial': ['урок', 'pamācība'],
  'tips': ['советы', 'padomi'],
  'guide': ['гайд', 'ceļvedis'],
  'inspiration': ['вдохновение', 'iedvesma'],
  'style': ['стиль', 'stils'],
  'color': ['цвет', 'krāsa'],
  'colour': ['цвет', 'krāsa'],
  'palette': ['палитра', 'palete'],
  'composition': ['композиция', 'kompozīcija'],
  'character design': ['дизайн персонажей', 'tēlu dizains'],
  'characters': ['персонажи', 'tēli'],
  'process': ['процесс', 'process'],
  'behind the scenes': ['за кадром', 'aizkulises'],
  'materials': ['материалы', 'materiāli'],
  'art supplies': ['художественные материалы', 'mākslas piederumi'],
  'brushes': ['кисти', 'otas'],
  'markers': ['маркеры', 'marķieri'],
  'sketching': ['скетчинг', 'skicēšana'],
  'urban sketching': ['урбан-скетчинг', 'pilsētas skicēšana'],
  'creativity': ['творчество', 'radošums'],
  'learning': ['обучение', 'mācīšanās'],
  'experiment': ['эксперимент', 'eksperiments'],
  'challenge': ['челлендж', 'izaicinājums'],
  'diary': ['дневник', 'dienasgrāmata'],
  'motivation': ['мотивация', 'motivācija'],
  'artist': ['художник', 'mākslinieks'],
  'artists': ['художники', 'mākslinieki'],
  'landscape': ['пейзаж', 'ainava'],
  'portrait': ['портрет', 'portrets'],
  'nature': ['природа', 'daba'],
  'animals': ['животные', 'dzīvnieki'],
  'birds': ['птицы', 'putni'],
  'cats': ['коты', 'kaķi'],
  'books': ['книги', 'grāmatas'],
  'education': ['образование', 'izglītība'],
  'copyright': ['авторское право', 'autortiesības'],
  'abstract': ['абстракция', 'abstrakcija'],
  'texture': ['текстура', 'tekstūra'],
  'granulation': ['грануляция', 'granulācija'],
  'signature style': ['авторский стиль', 'autora stils'],
  'art history': ['история искусства', 'mākslas vēsture'],
  'music': ['музыка', 'mūzika'],
  'football': ['футбол', 'futbols'],
};
// перевод тегов словаря на RU и LV (Gemini или запасной переводчик); не получилось — тег останется английским, его можно перевести вручную
async function translateTags(env, list) {
  const now = Math.floor(Date.now() / 1000);
  const known = list.filter(g => GLOSSARY[g]), rest = list.filter(g => !GLOSSARY[g]);
  for (const g of known) {
    await env.DB.prepare(`INSERT INTO blog_tags (en, ru, lv, src, checked, created_at) VALUES (?, ?, ?, 'glossary', 1, ?) ON CONFLICT(en) DO UPDATE SET
      ru = CASE WHEN blog_tags.ru = '' OR blog_tags.ru = blog_tags.en THEN excluded.ru ELSE blog_tags.ru END,
      lv = CASE WHEN blog_tags.lv = '' OR blog_tags.lv = blog_tags.en THEN excluded.lv ELSE blog_tags.lv END,
      src = CASE WHEN blog_tags.checked = 1 THEN blog_tags.src ELSE 'glossary' END, checked = 1`).bind(g, GLOSSARY[g][0], GLOSSARY[g][1], now).run();
  }
  for (const l of rest.length ? ['ru', 'lv'] : []) {
    let out = [];
    try { out = (await translateAll(env, rest, 'en', l)).texts; } catch (e) { out = []; }
    for (const [i, g] of rest.entries()) {
      const v = String(out[i] || '').trim().toLowerCase().replace(/^#/, '').replace(/[,.]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
      await env.DB.prepare(`INSERT INTO blog_tags (en, ${l}, src, checked, created_at) VALUES (?, ?, 'auto', 0, ?) ON CONFLICT(en) DO UPDATE SET ${l} = CASE WHEN blog_tags.checked = 0 AND (blog_tags.${l} = '' OR blog_tags.${l} = blog_tags.en) THEN excluded.${l} ELSE blog_tags.${l} END`).bind(g, v, now).run();
    }
  }
  await loadTags(env);
}
// переводы тегов, сохранённые в самих статьях (tags_ru/tags_lv), держим в согласии со словарём
async function syncTagColumns(env) {
  await loadTags(env);
  for (const p of (await env.DB.prepare('SELECT id, tags_en, tags_ru, tags_lv FROM blog_posts').all()).results) {
    const list = tagsOf(p);
    await env.DB.prepare('UPDATE blog_posts SET tags_ru = ?, tags_lv = ? WHERE id = ?').bind(list.map(g => tagLabel(g, 'ru')).join(', '), list.map(g => tagLabel(g, 'lv')).join(', '), p.id).run();
  }
}

async function fullBackup(env) {
  const all = q => env.DB.prepare(q).all().then(r => r.results);
  const media = [];
  if (env.MEDIA) { let cursor; do { const r = await env.MEDIA.list({ prefix: 'blog/', cursor }); media.push(...r.objects.map(o => o.key)); cursor = r.truncated ? r.cursor : null; } while (cursor); }
  const works = await all('SELECT * FROM posts');
  return {
    version: 2, site: SITE, exported_at: new Date().toISOString(),
    // блог (тот же формат, что понимает «Восстановить из копии»)
    posts: await all('SELECT * FROM blog_posts'), tags: await all('SELECT * FROM blog_tags'), sections: await all('SELECT * FROM blog_sections'),
    comments: await all('SELECT c.*, p.slug FROM blog_comments c JOIN blog_posts p ON p.id = c.post_id'), likes: await all('SELECT * FROM blog_likes'), media,
    subscribers: await all('SELECT * FROM subscribers').catch(() => []), // «сообщите, когда выйдет книга»
    site_blocks: await all('SELECT * FROM site_blocks').catch(() => []), // правки блоков сайта из режима «Править страницу»
    // челлендж: аккаунты (ник, e-mail, бейджи, серии) и работы на стене
    challenge: { users: await all('SELECT id, sub, email, nick, consent, banned, created_at, best, badges, months, mcount, picks, last_seen, avatar FROM users'), gifts: await all('SELECT * FROM gifts').catch(() => []), works, meta: await all('SELECT * FROM meta WHERE key NOT IN (\'backup_token\', \'blog_salt\', \'gemini_key\')') },
    // все файлы, которые надо скачать вместе с копией
    files: [...media.map(k => ({ path: 'media/' + k, url: '/media/' + k })), ...works.map(w => ({ path: `challenge/works/${w.day}-${w.id}.jpg`, url: '/api/img/' + w.id }))],
  };
}

// ---------- страницы ----------
function commentHtml(c, lang) {
  const name = c.nick
    ? `<a class="bc-nick" href="${PREFIX[lang]}/challenge/#@${encodeURIComponent(c.nick)}">@${esc(c.nick)}</a>`
    : `<span class="bc-bird">🐦 ${esc(birdName(c.anon, lang))}</span>`;
  const body = esc(c.body).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
  return `<li class="bc" id="c${c.id}" data-cid="${c.id}"><p class="bc-head">${name} <time>${fmtDate(c.created_at, lang)}</time></p><div class="bc-body"><p>${body}</p></div></li>`;
}

function card(p, lang) {
  const t = T[lang], tags = tagsOf(p);
  const words = stripTags(field(p, 'b', lang)).split(' ').length;
  const excerpt = field(p, 'd', lang) || stripTags(field(p, 'b', lang)).slice(0, 180) + '…';
  return `<article class="bl-card">
    <a class="bl-cover" href="${blogUrl(lang, p.slug)}" tabindex="-1" aria-hidden="true">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : '<span class="bl-nocover">🕊</span>'}</a>
    <div class="bl-text">
      <p class="bl-meta">${p.status === 'draft' ? `<span class="bl-draft">${t.draft}</span> · ` : (p.published_at || 0) > Date.now() / 1000 ? `<span class="bl-draft">${t.scheduled}</span> · ` : ''}${secsOf(p).filter(x => sectionName(x, lang)).map(x => `<a class="bl-sec" href="${blogUrl(lang, '', '?section=' + encodeURIComponent(x))}">${esc(sectionName(x, lang))}</a> · `).join('')}${fmtDate(p.published_at || p.updated_at, lang)} · ${Math.max(1, Math.round(words / 200))} ${t.min}</p>
      <h2><a href="${blogUrl(lang, p.slug)}">${esc(field(p, 't', lang))}</a></h2>
      <p class="bl-excerpt">${esc(excerpt)}</p>
      <p class="bl-foot">${tags.map(g => `<a class="bl-tag" href="${blogUrl(lang, '', '?tag=' + encodeURIComponent(g))}">#${esc(tagLabel(g, lang))}</a>`).join(' ')}
        <span class="bl-stats">♥ ${p.likes || 0} · 💬 ${p.comments || 0}</span></p>
    </div></article>`;
}

const ym = p => new Date((p.published_at || p.updated_at) * 1000).toISOString().slice(0, 7);
function sidebar(posts, lang, activeTag, activeMonth = '', post = false, activeSection = '', isAdm = false) {
  const t = T[lang], count = {};
  // разделы (как коллекции на Patreon): посетителям — только с опубликованными статьями, админу — все (пустые бледные)
  const secCount = {};
  for (const p of posts) for (const x of secsOf(p)) secCount[x] = (secCount[x] || 0) + 1;
  const secs = SECTIONS.filter(x => secCount[x.slug] || isAdm);
  const fav = posts.filter(p => p.featured).slice(0, 5);
  const months = {};
  for (const p of posts) { const k = ym(p); months[k] = (months[k] || 0) + 1; }
  const years = [...new Set(Object.keys(months).map(k => k.slice(0, 4)))].sort().reverse();
  for (const p of posts) for (const g of tagsOf(p)) count[g] = (count[g] || 0) + 1;
  // теги — по убыванию частоты: самый частый золотой, следующие три фиолетовые, остальные белые
  const tags = Object.entries(count).sort((a, b) => b[1] - a[1] || tagLabel(a[0], lang).localeCompare(tagLabel(b[0], lang)));
  // первые 12 видны сразу, остальные — под кнопкой «Показать все теги» (раскрыта, если выбран тег из хвоста)
  const TOP = 12, tagHtml = ([g, n], i) =>
    `<a class="bs-tag${i === 0 ? ' gold' : i < 4 ? ' violet' : ''}" href="${blogUrl(lang, '', '?tag=' + encodeURIComponent(g))}"${g === activeTag ? ' aria-current="true"' : ''}>${esc(tagLabel(g, lang))}<span>${n}</span></a>`;
  const restOpen = tags.slice(TOP).some(([g]) => g === activeTag);
  const popular = [...posts].sort((a, b) => (b.likes * 5 + b.views + b.comments * 3) - (a.likes * 5 + a.views + a.comments * 3)).slice(0, 5);
  const list = arr => `<ul class="bs-list">${arr.map(p => `<li><a href="${blogUrl(lang, p.slug)}" title="${esc(field(p, 't', lang))}">${esc(field(p, 't', lang))}</a></li>`).join('')}</ul>`;
  return `<aside class="bl-side">
    ${fav.length ? `<section><h2>★ ${t.featured.replace(/^★\s*/, '')}</h2>${list(fav)}
      ${!post && fav.length > 1 ? `<p class="bl-more"><a href="${blogUrl(lang, '', '?fav=1')}">${t.onlyFav} →</a></p>` : ''}</section>` : ''}
    ${secs.length ? `<section><h2>${t.sections}</h2><ul class="bs-secs">${secs.map(x =>
      `<li${secCount[x.slug] ? '' : ' class="bs-empty" title="Пока пусто — видите только вы"'}><a href="${blogUrl(lang, '', '?section=' + encodeURIComponent(x.slug))}"${x.slug === activeSection ? ' aria-current="true"' : ''}>${esc(x[lang] || x.en)}</a> <span>${secCount[x.slug] || 0}</span></li>`).join('')}</ul></section>` : ''}
    ${tags.length ? `<section><h2>${t.tags}</h2><p class="bs-tags">${tags.slice(0, TOP).map(tagHtml).join('')}</p>${tags.length > TOP ? `<details class="bs-moretags"${restOpen ? ' open' : ''}><summary><span class="m">${t.moreTags} (${tags.length})</span><span class="l">${t.lessTags}</span></summary><p class="bs-tags">${tags.slice(TOP).map((x, i) => tagHtml(x, i + TOP)).join('')}</p></details>` : ''}</section>` : ''}
    ${years.length ? `<section><h2>${t.archive}</h2><ul class="bl-arch">${years.map(y => `<li><b>${y}</b><ul>${Object.keys(months).filter(k => k.startsWith(y)).sort().reverse().map(k =>
      `<li><a href="${blogUrl(lang, '', '?month=' + k)}"${k === activeMonth ? ' aria-current="true"' : ''}>${t.monthsFull[+k.slice(5) - 1]}</a> <span>${months[k]}</span></li>`).join('')}</ul></li>`).join('')}</ul></section>` : ''}
    ${popular.length ? `<section><h2>${t.popular}</h2>${list(popular)}</section>` : ''}
  </aside>`;
}

async function template(env, url, lang) {
  const r = await env.ASSETS.fetch(new Request(url.origin + PREFIX[lang] + '/blog/'));
  return r.ok ? r.text() : null;
}
function fill(tpl, { title, description, canonical, content, image, type, slug, jsonld, noindex }) {
  let s = tpl.replace(/<!--BLOG-->[\s\S]*?<!--\/BLOG-->/, content)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${canonical}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${canonical}`);
  if (type) s = s.replace('<meta property="og:type" content="website">', `<meta property="og:type" content="${type}">`);
  if (image) {
    const abs = image.startsWith('/') ? SITE + image : image;
    s = s.replace(/(<meta property="og:image" content=")[^"]*/, `$1${esc(abs)}`).replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${esc(abs)}`)
      .replace(/<meta property="og:image:(width|height|alt)"[^>]*>\n?/g, '');
  }
  if (slug) {
    s = s.replace(/(<link rel="alternate" hreflang="[a-z-]+" href="https:\/\/www\.pigeonpolly\.com(?:\/ru|\/lv)?\/blog\/)"/g, `$1${slug}/"`)
      .replace(/href="((?:\/ru|\/lv)?\/blog\/)"( hreflang=)/g, `href="$1${slug}/"$2`);
  }
  if (jsonld) s = s.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>\n</head>`);
  if (noindex) s = s.replace('</head>', '<meta name="robots" content="noindex">\n</head>');
  return s;
}
const html = (s, status = 200) => new Response(s, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });

export async function blogPage(req, env, url, h) {
  const p = url.pathname;
  // картинки блога из R2
  if (p.startsWith('/media/')) {
    if (!env.MEDIA) return new Response('Not found', { status: 404 });
    const obj = await env.MEDIA.get(decodeURIComponent(p.slice(7)));
    if (!obj) return new Response('Not found', { status: 404 });
    return new Response(obj.body, { headers: { 'content-type': obj.httpMetadata?.contentType || 'application/octet-stream', 'cache-control': 'public, max-age=31536000, immutable', etag: obj.httpEtag } });
  }
  await ensureBlogSchema(env);
  await loadTags(env);
  if (p === '/sitemap-blog.xml') {
    const rows = (await env.DB.prepare("SELECT slug, updated_at FROM blog_posts WHERE status = 'published' AND COALESCE(published_at, 0) <= CAST(strftime('%s', 'now') AS INTEGER) ORDER BY published_at DESC").all()).results;
    const urls = rows.flatMap(r => LANGS.map(l => `<url><loc>${SITE}${blogUrl(l, r.slug)}</loc><lastmod>${new Date(r.updated_at * 1000).toISOString().slice(0, 10)}</lastmod></url>`)).join('');
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
  }
  const mm = p.match(/^\/(?:(ru|lv)\/)?blog\/(?:([a-z0-9-]+)\/)?$/);
  if (!mm) return env.ASSETS.fetch(req);
  const lang = mm[1] || 'en', slug = mm[2], t = T[lang];
  const tpl = await template(env, url, lang);
  if (!tpl) return env.ASSETS.fetch(req);
  const u = await h.currentUser(req, env);
  const isAdm = await h.isAdmin(u, env);
  const visible = isAdm ? '' : "WHERE p.status = 'published' AND COALESCE(p.published_at, 0) <= CAST(strftime('%s', 'now') AS INTEGER)";
  const posts = (await env.DB.prepare(`SELECT p.*, (SELECT COUNT(*) FROM blog_comments c WHERE c.post_id = p.id AND c.status = 'ok') AS comments
    FROM blog_posts p ${visible} ORDER BY COALESCE(p.published_at, p.updated_at) DESC`).all()).results;
  const nowS = h.now(), live = x => x.status === 'published' && (x.published_at || 0) <= nowS;
  const published = posts.filter(live);

  if (!slug) {
    const P = url.searchParams;
    const tag = (P.get('tag') || '').trim().toLowerCase();
    const month = /^\d{4}-\d{2}$/.test(P.get('month') || '') ? P.get('month') : '';
    const favOnly = P.get('fav') === '1';
    const section = (P.get('section') || '').trim().toLowerCase();
    const q = (P.get('q') || '').trim().slice(0, 80);
    let list = posts;
    if (section) list = list.filter(x => secsOf(x).includes(section));
    if (tag) list = list.filter(x => tagsOf(x).includes(tag) || splitTags(x['tags_' + lang]).includes(tag)); // старые ссылки с переводом тега тоже работают
    if (month) list = list.filter(x => ym(x) === month);
    if (favOnly) list = list.filter(x => x.featured);
    if (q) { // поиск: заголовок, описание, текст и теги на любом языке
      const words = q.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter(x => { const hay = [...LANGS.flatMap(l => [x['t_' + l], x['d_' + l], stripTags(x['b_' + l])]), ...tagsOf(x).map(g => g + ' ' + tagLabel(g, lang))].join(' ').toLowerCase(); return words.every(w => hay.includes(w)); });
    }
    // по 8 статей на странице
    const PER = 8, pages = Math.max(1, Math.ceil(list.length / PER)), page = Math.min(pages, Math.max(1, parseInt(P.get('page')) || 1));
    const shown = list.slice((page - 1) * PER, page * PER);
    const link = (over) => { const u = new URLSearchParams(P); for (const [k, v] of Object.entries(over)) { if (v === '' || v == null) u.delete(k); else u.set(k, v); } const qs = u.toString(); return blogUrl(lang, '', qs ? '?' + qs : ''); };
    const filtered = tag || month || favOnly || section || q || page > 1;
    const label = q ? `${t.found}: <b>«${esc(q)}»</b> (${list.length})` : tag ? `${t.tagged} <b>#${esc(tagLabel(tag, lang))}</b>` : month ? `${t.inMonth} <b>${t.monthsFull[+month.slice(5) - 1]} ${month.slice(0, 4)}</b>` : favOnly ? `<b>${t.featured}</b>` : section ? `${t.section}: <b>${esc(sectionName(section, lang))}</b>` : '';
    const pager = pages > 1 ? `<nav class="bl-pager" aria-label="Pages">${page > 1 ? `<a href="${link({ page: page - 1 > 1 ? page - 1 : '' })}">${t.prev}</a>` : '<span></span>'}
      <span class="bl-pages">${Array.from({ length: pages }, (_, k) => k + 1).map(n => n === page ? `<b aria-current="page">${n}</b>` : `<a href="${link({ page: n > 1 ? n : '' })}">${n}</a>`).join('')}</span>
      ${page < pages ? `<a href="${link({ page: page + 1 })}">${t.next}</a>` : '<span></span>'}</nav>` : '';
    const content = `<section class="page-head bl-head"><p class="topics">${t.blog.toLowerCase()}</p><h1>${t.head}</h1><p class="lead">${t.lead}</p><p class="bl-count">📝 ${t.count(published.length)}</p>
      <div class="bl-admin" data-blog-admin hidden><a class="pill-btn" href="/blog-editor/">＋ ${lang === 'ru' ? 'Новая статья' : lang === 'lv' ? 'Jauns raksts' : 'New post'}</a></div></section>
      <div class="bl-tools">
        <span></span>
        <form class="bl-search" action="${blogUrl(lang, '')}" method="get" role="search">${section ? `<input type="hidden" name="section" value="${esc(section)}">` : ''}
          <input type="search" name="q" value="${esc(q)}" placeholder="${t.search}" aria-label="${t.search}"><button type="submit" aria-label="${t.searchBtn}">🔍</button></form>
      </div>
      <div class="bl-grid"><div class="bl-list">
        ${filtered && (label || section) ? `<p class="bl-filter">${label || `<b>${esc(sectionName(section, lang))}</b>`} · <a href="${blogUrl(lang, '')}">${t.all}</a></p>` : ''}
        ${shown.map(x => card(x, lang)).join('') || `<p class="bl-empty">${q ? t.nothing : t.empty}</p>`}
        ${pager}
      </div><details class="bl-sidewrap" open><summary class="bl-sidesum">☰ ${t.browse}</summary>${sidebar(published, lang, tag, month, false, section, isAdm)}</details></div>
      <script src="/assets/blog.js" defer></script>`;
    return html(fill(tpl, { title: `${t.blog} · Pigeon Polly Art Lab`, description: t.descr, canonical: SITE + blogUrl(lang, ''), content, noindex: !!filtered }));
  }

  const post = posts.find(x => x.slug === slug);
  if (!post) {
    const nf = await env.ASSETS.fetch(new Request(url.origin + '/404.html'));
    return html(await nf.text(), 404);
  }
  if (!isAdm && !/bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i.test(req.headers.get('user-agent') || '')) {
    await env.DB.prepare('UPDATE blog_posts SET views = views + 1 WHERE id = ?').bind(post.id).run();
  }
  const comments = (await env.DB.prepare(`SELECT c.id, c.body, c.anon, c.created_at, u.nick FROM blog_comments c LEFT JOIN users u ON u.id = c.user_id
    WHERE c.post_id = ? AND c.status = 'ok' ORDER BY c.created_at`).bind(post.id).all()).results;
  const title = field(post, 't', lang), tags = tagsOf(post);
  const textLang = langOf(post, lang);
  const words = stripTags(field(post, 'b', lang)).split(' ').length;
  const description = field(post, 'd', lang) || stripTags(field(post, 'b', lang)).slice(0, 160);
  const content = `<div class="bp-wrap"><article class="bp" data-post-id="${post.id}" data-status="${post.status}">
    <p class="bp-back"><a href="${blogUrl(lang, '')}">${t.back}</a><a class="bp-pencil" href="/blog-editor/#${post.id}" hidden data-blog-admin title="Редактировать статью">✎ Редактировать</a></p>
    <header class="bp-head"${textLang !== lang ? ` lang="${textLang}"` : ''}>
      ${post.status === 'draft' ? `<p class="bl-draft">${t.draft}</p>` : (post.published_at || 0) > Date.now() / 1000 ? `<p class="bl-draft">${t.scheduled}</p>` : ''}
      ${secsOf(post).some(x => sectionName(x, lang)) ? `<p class="bp-sec">${secsOf(post).filter(x => sectionName(x, lang)).map(x => `<a href="${blogUrl(lang, '', '?section=' + encodeURIComponent(x))}">${esc(sectionName(x, lang))}</a>`).join(' · ')}</p>` : ''}
      <h1>${esc(title)}</h1>
      <p class="bl-meta">${fmtDate(post.published_at || post.updated_at, lang)} · ${Math.max(1, Math.round(words / 200))} ${t.min}
        ${tags.length ? ' · ' + tags.map(g => `<a class="bl-tag" href="${blogUrl(lang, '', '?tag=' + encodeURIComponent(g))}">#${esc(tagLabel(g, lang))}</a>`).join(' ') : ''}</p>
    </header>
    ${post.cover ? `<figure class="bp-cover"><img src="${esc(post.cover)}" alt=""></figure>` : ''}
    <div class="bp-body"${textLang !== lang ? ` lang="${textLang}"` : ''}>${field(post, 'b', lang)}${post.src_lang && post.src_lang !== textLang && post['t_' + post.src_lang]
      ? `<p class="bp-tr-note">${TR_NOTE[lang](post.src_lang, blogUrl(post.src_lang, post.slug))}</p>` : ''}</div>
    <div class="bp-actions"><button type="button" class="bp-like" aria-pressed="false"><span class="bp-heart">♥</span> <span class="bp-likes">${post.likes || 0}</span></button>
      <div class="bp-share-wrap"><button type="button" class="bp-share" aria-expanded="false" data-url="${SITE + blogUrl(lang, post.slug)}" data-title="${esc(title)}" data-img="${esc(post.cover ? (post.cover.startsWith('/') ? SITE + post.cover : post.cover) : '')}"
        data-l-copy="${t.copy}" data-l-copied="${t.copied}" data-l-email="${t.email}"><span aria-hidden="true">↗</span> ${t.share}</button></div>
      <a class="bp-edit pill-btn" href="/blog-editor/#${post.id}" hidden data-blog-admin>✎ Edit</a></div>
    <section class="bp-comments" id="comments"><h2>${t.comments} <span class="bp-ccount">${comments.length}</span></h2>
      <ol class="bc-list">${comments.map(c => commentHtml(c, lang)).join('')}</ol>
      ${comments.length ? '' : `<p class="bc-empty">${t.noComments}</p>`}
      <div class="bc-form-wrap" data-comment-form></div>
    </section>
  </article>
  <div class="bp-more">${sidebar(published, lang, '', '', true, secsOf(post)[0] || '', isAdm)}</div></div>
  <script src="/assets/blog.js" defer></script><script src="/assets/scroll-nav.js" defer></script>`;
  const jsonld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title, description, inLanguage: textLang,
    datePublished: new Date((post.published_at || post.updated_at) * 1000).toISOString(), dateModified: new Date(post.updated_at * 1000).toISOString(),
    author: { '@type': 'Person', name: 'Alina Otkinska', url: SITE + '/about-me/' }, mainEntityOfPage: SITE + blogUrl(lang, post.slug),
    ...(post.cover ? { image: post.cover.startsWith('/') ? SITE + post.cover : post.cover } : {}), keywords: tags.join(', ') };
  return html(fill(tpl, { title: `${title} · Pigeon Polly Art Lab`, description, canonical: SITE + blogUrl(lang, post.slug), content, image: post.cover,
    type: 'article', slug: post.slug, jsonld, noindex: post.status !== 'published' || (post.published_at || 0) > Date.now() / 1000 }));
}
