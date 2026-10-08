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
    tags: 'Tags', popular: 'Popular', all: 'All posts', empty: 'No posts here yet. The first one is on its way!',
    comments: 'Comments', noComments: 'No comments yet. Be the first!', back: '← All posts', tagged: 'Posts tagged',
    min: 'min read', draft: 'Draft', read: 'Read →', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    descr: 'Notes on drawing, learning and creativity by Alina Otkinska and Pigeon Polly.',
    featured: '★ Favourites', archive: 'Archive', inMonth: 'Posts from', onlyFav: 'My favourite posts',
    monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
  ru: {
    blog: 'Блог', head: 'Заметки из лаборатории', lead: 'Статьи о рисовании, обучении и творчестве: что я пробую, что работает и что об этом думает Полли.',
    tags: 'Теги', popular: 'Популярное', all: 'Все статьи', empty: 'Здесь пока нет статей. Первая уже в пути!',
    comments: 'Комментарии', noComments: 'Комментариев пока нет. Будьте первым!', back: '← Все статьи', tagged: 'Статьи с тегом',
    min: 'мин чтения', draft: 'Черновик', read: 'Читать →', months: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    descr: 'Заметки о рисовании, обучении и творчестве от Алины Откинской и голубя Полли.',
    featured: '★ Избранное', archive: 'Архив', inMonth: 'Статьи за', onlyFav: 'Мои избранные статьи',
    monthsFull: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  },
  lv: {
    blog: 'Blogs', head: 'Piezīmes no laboratorijas', lead: 'Raksti par zīmēšanu, mācīšanos un radošumu: ko es izmēģinu, kas strādā un ko par to domā Pollija.',
    tags: 'Birkas', popular: 'Populārākie', all: 'Visi raksti', empty: 'Šeit vēl nav rakstu. Pirmais jau ceļā!',
    comments: 'Komentāri', noComments: 'Komentāru vēl nav. Esi pirmais!', back: '← Visi raksti', tagged: 'Raksti ar birku',
    min: 'min lasīšanas', draft: 'Melnraksts', read: 'Lasīt →', months: ['janv.', 'febr.', 'marts', 'apr.', 'maijs', 'jūn.', 'jūl.', 'aug.', 'sept.', 'okt.', 'nov.', 'dec.'],
    descr: 'Piezīmes par zīmēšanu, mācīšanos un radošumu no Alīnas Otkinskas un baloža Pollijas.',
    featured: '★ Izlase', archive: 'Arhīvs', inMonth: 'Raksti par', onlyFav: 'Mani izlases raksti',
    monthsFull: ['janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs', 'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris'],
  },
};

// анонимные комментаторы: «птица + 2 цифры», имя на языке читателя
const BIRDS = {
  en: ['Robin', 'Sparrow', 'Finch', 'Wren', 'Starling', 'Swallow', 'Magpie', 'Owl', 'Puffin', 'Heron', 'Kingfisher', 'Blackbird', 'Thrush', 'Lark', 'Dove', 'Pigeon', 'Jay', 'Nightingale', 'Goldfinch', 'Tit'],
  ru: ['Малиновка', 'Воробей', 'Зяблик', 'Крапивник', 'Скворец', 'Ласточка', 'Сорока', 'Сова', 'Тупик', 'Цапля', 'Зимородок', 'Чёрный дрозд', 'Дрозд', 'Жаворонок', 'Горлица', 'Голубь', 'Сойка', 'Соловей', 'Щегол', 'Синица'],
  lv: ['Sarkanrīklīte', 'Zvirbulis', 'Žubīte', 'Sētas karaliņš', 'Mājas strazds', 'Bezdelīga', 'Žagata', 'Pūce', 'Tupelis', 'Gārnis', 'Zivju dzenītis', 'Melnais strazds', 'Strazds', 'Cīrulis', 'Ūbele', 'Balodis', 'Sīlis', 'Lakstīgala', 'Dadzītis', 'Zīlīte'],
};
const birdName = (code, lang) => { const [i, n] = String(code || '0:10').split(':'); return `${BIRDS[lang][+i % 20]} ${n}`; };

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// текст на языке читателя, а если перевода нет — на любом заполненном
const field = (p, k, lang) => p[`${k}_${lang}`] || p[`${k}_ru`] || p[`${k}_en`] || p[`${k}_lv`] || '';
const langOf = (p, lang) => p['t_' + lang] ? lang : ['ru', 'en', 'lv'].find(l => p['t_' + l]) || lang;
const tagsOf = (p, lang) => String(field(p, 'tags', lang)).split(',').map(s => s.trim()).filter(Boolean);
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
  ready = true;
}

// ---------- очистка HTML статьи (пишет только админ, но всё равно оставляем только безопасные теги) ----------
const ALLOWED = { p: [], h2: [], h3: [], b: [], strong: [], i: [], em: [], u: [], s: [], br: [], hr: [], ul: [], ol: [], li: [],
  blockquote: [], figure: [], figcaption: [], a: ['href'], img: ['src', 'alt'] };
const DROP = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'meta', 'link', 'svg', 'math', 'template', 'noscript']);
const safeUrl = u => /^(https?:\/\/|\/(?!\/)|mailto:)/i.test(String(u).trim());
async function cleanHtml(html) {
  const out = await new HTMLRewriter().on('*', {
    element(e) {
      let tag = e.tagName.toLowerCase();
      if (DROP.has(tag)) { e.remove(); return; }
      if (tag === 'div') { e.tagName = 'p'; tag = 'p'; }
      if (!ALLOWED[tag]) { e.removeAndKeepContent(); return; }
      for (const [name, value] of [...e.attributes]) {
        if (!ALLOWED[tag].includes(name) || ((name === 'href' || name === 'src') && !safeUrl(value))) e.removeAttribute(name);
      }
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
    const post = await env.DB.prepare("SELECT id FROM blog_posts WHERE id = ? AND status = 'published'").bind(Number(id)).first();
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
    const post = await env.DB.prepare("SELECT id FROM blog_posts WHERE id = ? AND status = 'published'").bind(Number(b.id)).first();
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
  if (m === 'GET' && p === '/api/blog/home') {
    const lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'en';
    const rows = (await env.DB.prepare(`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`).all()).results;
    const pack = x => ({ url: blogUrl(lang, x.slug), title: field(x, 't', lang), excerpt: field(x, 'd', lang) || stripTags(field(x, 'b', lang)).slice(0, 200),
      cover: x.cover, date: fmtDate(x.published_at, lang), tags: tagsOf(x, lang).slice(0, 3), likes: x.likes });
    const latest = rows[0] || null;
    const featured = rows.filter(x => x.featured && x !== latest).slice(0, 4);
    if (featured.length < 2) featured.push(...rows.filter(x => !x.featured && x !== latest).slice(0, 3 - featured.length)); // пока звёздочек мало — добираем свежими
    return json({ latest: latest && pack(latest), featured: featured.map(x => ({ ...pack(x), star: !!x.featured })) }, 200, { 'cache-control': 'public, max-age=60' });
  }

  // ---------- редактор (только админ) ----------
  if (p.startsWith('/api/blog/admin/')) {
    await admin();
    const a = p.slice('/api/blog/admin/'.length);
    if (m === 'GET' && a === 'posts') {
      const rows = (await env.DB.prepare(`SELECT p.id, p.slug, p.status, p.featured, p.t_ru, p.t_en, p.t_lv, p.tags_ru, p.tags_en, p.tags_lv, p.cover, p.views, p.likes, p.updated_at, p.published_at,
        (SELECT COUNT(*) FROM blog_comments c WHERE c.post_id = p.id) AS comments FROM blog_posts p ORDER BY COALESCE(p.published_at, p.updated_at) DESC`).all()).results;
      const pending = (await env.DB.prepare(`SELECT c.id, c.body, c.anon, c.created_at, c.post_id, p.slug, p.t_ru, u.nick FROM blog_comments c
        JOIN blog_posts p ON p.id = c.post_id LEFT JOIN users u ON u.id = c.user_id WHERE c.status = 'pending' ORDER BY c.created_at DESC LIMIT 100`).all()).results
        .map(c => ({ ...c, name: c.nick ? '@' + c.nick : birdName(c.anon, 'ru') }));
      return json({ posts: rows, pending, strict: (await h.getMeta('blog_strict')) === '1', ai: !!env.AI || env.DEV_FAKE_LOGIN === '1', media: !!env.MEDIA });
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
        f['t_' + l] = String(b['t_' + l] || '').trim().slice(0, 200);
        f['d_' + l] = String(b['d_' + l] || '').trim().slice(0, 400);
        f['tags_' + l] = String(b['tags_' + l] || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean).slice(0, 12).join(', ');
        f['b_' + l] = await cleanHtml(String(b['b_' + l] || '').slice(0, 400_000));
      }
      if (!f.t_ru && !f.t_en && !f.t_lv) fail(400, 'title');
      let cover = safeUrl(b.cover || '') ? String(b.cover).trim() : '';
      // картинки, вставленные из Google Docs, живут там временно — копируем их в своё хранилище
      const moved = {};
      for (const l of LANGS) f['b_' + l] = await rehost(env, f['b_' + l], moved);
      if (TEMP_IMG.test(cover)) cover = (await rehostOne(env, cover, moved)) || cover;
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
      const published = status === 'published' ? (old?.published_at || t) : old?.published_at || null;
      const cols = Object.keys(f);
      if (old) {
        await env.DB.prepare(`UPDATE blog_posts SET ${cols.map(c => c + ' = ?').join(', ')}, slug = ?, cover = ?, status = ?, featured = ?, updated_at = ?, published_at = ? WHERE id = ?`)
          .bind(...cols.map(c => f[c]), slug, cover, status, featured, t, published, id).run();
      } else {
        const r = await env.DB.prepare(`INSERT INTO blog_posts (${cols.join(', ')}, slug, cover, status, featured, created_at, updated_at, published_at) VALUES (${cols.map(() => '?').join(', ')}, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(...cols.map(c => f[c]), slug, cover, status, featured, t, t, published).run();
        id = r.meta.last_row_id;
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
    if (m === 'POST' && a === 'feature') {
      const { id, featured } = await body();
      await env.DB.prepare('UPDATE blog_posts SET featured = ? WHERE id = ?').bind(featured ? 1 : 0, Number(id)).run();
      return json({ ok: true });
    }
    // тег во всех статьях сразу: переименовать (to) или удалить (to пустой)
    if (m === 'POST' && a === 'tag') {
      const b = await body();
      if (!LANGS.includes(b.lang)) fail(400, 'bad');
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
      const { texts, to, from } = await body();
      if (!LANGS.includes(to) || !LANGS.includes(from) || to === from || !Array.isArray(texts)) fail(400, 'bad');
      try { return json({ texts: await translateAll(env, texts.slice(0, 300).map(s => String(s).slice(0, 4000)), from, to) }); }
      catch (e) { fail(e.status || 502, e.code || 'ai'); }
    }
  }
  fail(404, 'not_found');
}

const TEMP_IMG = /^https:\/\/[a-z0-9.-]*(googleusercontent\.com|docs\.google\.com)\//i;
async function rehostOne(env, src, moved) {
  if (moved[src] !== undefined) return moved[src];
  moved[src] = null;
  if (!env.MEDIA) return null;
  try {
    const r = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36', Referer: 'https://docs.google.com/', Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8' } });
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
async function rehost(env, html, moved) {
  const srcs = [...new Set([...html.matchAll(/<img [^>]*src="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&')).filter(u => TEMP_IMG.test(u)))];
  for (const u of srcs) {
    const local = await rehostOne(env, u, moved);
    if (local) html = html.split(u.replace(/&/g, '&amp;')).join(local).split(u).join(local);
  }
  return html;
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
  const tags = [];
  const masked = text.replace(/<[^>]+>/g, t => { tags.push(t); return `⟦${tags.length}⟧`; });
  if (!tags.length) return run(text);
  const out = await run(masked);
  if (tags.every((_, i) => out.includes(`⟦${i + 1}⟧`))) return out.replace(/⟦(\d+)⟧/g, (_, n) => tags[n - 1]);
  return run(stripTags(text));
}
async function translateAll(env, texts, from, to) {
  const out = [];
  try {
    for (let i = 0; i < texts.length; i += 4) out.push(...await Promise.all(texts.slice(i, i + 4).map(s => translateOne(env, s, from, to))));
  } catch (e) {
    const err = new Error(e.code || 'ai'); err.status = e.code === 'ai_limit' ? 429 : 502; err.code = e.code || 'ai'; throw err;
  }
  return out;
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
  const t = T[lang], tags = tagsOf(p, lang);
  const words = stripTags(field(p, 'b', lang)).split(' ').length;
  const excerpt = field(p, 'd', lang) || stripTags(field(p, 'b', lang)).slice(0, 180) + '…';
  return `<article class="bl-card">
    <a class="bl-cover" href="${blogUrl(lang, p.slug)}" tabindex="-1" aria-hidden="true">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : '<span class="bl-nocover">🕊</span>'}</a>
    <div class="bl-text">
      <p class="bl-meta">${p.status === 'draft' ? `<span class="bl-draft">${t.draft}</span> · ` : ''}${fmtDate(p.published_at || p.updated_at, lang)} · ${Math.max(1, Math.round(words / 200))} ${t.min}</p>
      <h2><a href="${blogUrl(lang, p.slug)}">${esc(field(p, 't', lang))}</a></h2>
      <p class="bl-excerpt">${esc(excerpt)}</p>
      <p class="bl-foot">${tags.map(g => `<a class="bl-tag" href="${blogUrl(lang, '', '?tag=' + encodeURIComponent(g))}">#${esc(g)}</a>`).join(' ')}
        <span class="bl-stats">♥ ${p.likes || 0} · 💬 ${p.comments || 0}</span></p>
    </div></article>`;
}

const ym = p => new Date((p.published_at || p.updated_at) * 1000).toISOString().slice(0, 7);
function sidebar(posts, lang, activeTag, activeMonth = '', post = false) {
  const t = T[lang], count = {};
  const fav = posts.filter(p => p.featured).slice(0, 6);
  const months = {};
  for (const p of posts) { const k = ym(p); months[k] = (months[k] || 0) + 1; }
  const years = [...new Set(Object.keys(months).map(k => k.slice(0, 4)))].sort().reverse();
  for (const p of posts) for (const g of tagsOf(p, lang)) count[g] = (count[g] || 0) + 1;
  const tags = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 30).sort((a, b) => a[0].localeCompare(b[0]));
  const max = Math.max(1, ...tags.map(x => x[1]));
  const popular = [...posts].sort((a, b) => (b.likes * 5 + b.views + b.comments * 3) - (a.likes * 5 + a.views + a.comments * 3)).slice(0, 5);
  return `<aside class="bl-side">
    ${fav.length ? `<section><h2>${t.featured}</h2><ol class="bl-pop bl-fav">${fav.map(p => `<li><a href="${blogUrl(lang, p.slug)}">${esc(field(p, 't', lang))}</a></li>`).join('')}</ol>
      ${!post && fav.length > 1 ? `<p class="bl-more"><a href="${blogUrl(lang, '', '?fav=1')}">${t.onlyFav} →</a></p>` : ''}</section>` : ''}
    ${tags.length ? `<section><h2>${t.tags}</h2><p class="bl-cloud">${tags.map(([g, n]) =>
      `<a href="${blogUrl(lang, '', '?tag=' + encodeURIComponent(g))}" style="--s:${(0.9 + (max > 1 ? 0.45 * (n - 1) / (max - 1) : 0)).toFixed(2)}"${g === activeTag ? ' aria-current="true"' : ''}>${esc(g)}</a>`).join(' ')}</p></section>` : ''}
    ${years.length ? `<section><h2>${t.archive}</h2><ul class="bl-arch">${years.map(y => `<li><b>${y}</b><ul>${Object.keys(months).filter(k => k.startsWith(y)).sort().reverse().map(k =>
      `<li><a href="${blogUrl(lang, '', '?month=' + k)}"${k === activeMonth ? ' aria-current="true"' : ''}>${t.monthsFull[+k.slice(5) - 1]}</a> <span>${months[k]}</span></li>`).join('')}</ul></li>`).join('')}</ul></section>` : ''}
    ${popular.length ? `<section><h2>${t.popular}</h2><ol class="bl-pop">${popular.map(p => `<li><a href="${blogUrl(lang, p.slug)}">${esc(field(p, 't', lang))}</a><span>♥ ${p.likes || 0}</span></li>`).join('')}</ol></section>` : ''}
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
  if (p === '/sitemap-blog.xml') {
    const rows = (await env.DB.prepare("SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC").all()).results;
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
  const visible = isAdm ? '' : "WHERE p.status = 'published'";
  const posts = (await env.DB.prepare(`SELECT p.*, (SELECT COUNT(*) FROM blog_comments c WHERE c.post_id = p.id AND c.status = 'ok') AS comments
    FROM blog_posts p ${visible} ORDER BY COALESCE(p.published_at, p.updated_at) DESC`).all()).results;
  const published = posts.filter(x => x.status === 'published');

  if (!slug) {
    const tag = (url.searchParams.get('tag') || '').trim().toLowerCase();
    const month = /^\d{4}-\d{2}$/.test(url.searchParams.get('month') || '') ? url.searchParams.get('month') : '';
    const favOnly = url.searchParams.get('fav') === '1';
    let list = posts;
    if (tag) list = list.filter(x => tagsOf(x, lang).includes(tag));
    if (month) list = list.filter(x => ym(x) === month);
    if (favOnly) list = list.filter(x => x.featured);
    const filtered = tag || month || favOnly;
    const label = tag ? `${t.tagged} <b>#${esc(tag)}</b>` : month ? `${t.inMonth} <b>${t.monthsFull[+month.slice(5) - 1]} ${month.slice(0, 4)}</b>` : favOnly ? `<b>${t.featured}</b>` : '';
    const content = `<section class="page-head bl-head"><p class="topics">${t.blog.toLowerCase()}</p><h1>${t.head}</h1><p class="lead">${t.lead}</p>
      <div class="bl-admin" data-blog-admin hidden><a class="pill-btn" href="/blog-editor/">＋ ${lang === 'ru' ? 'Новая статья' : lang === 'lv' ? 'Jauns raksts' : 'New post'}</a></div></section>
      <div class="bl-grid"><div class="bl-list">
        ${filtered ? `<p class="bl-filter">${label} · <a href="${blogUrl(lang, '')}">${t.all}</a></p>` : ''}
        ${list.map(x => card(x, lang)).join('') || `<p class="bl-empty">${t.empty}</p>`}
      </div>${sidebar(published, lang, tag, month)}</div>
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
  const title = field(post, 't', lang), tags = tagsOf(post, lang);
  const textLang = langOf(post, lang);
  const words = stripTags(field(post, 'b', lang)).split(' ').length;
  const description = field(post, 'd', lang) || stripTags(field(post, 'b', lang)).slice(0, 160);
  const content = `<div class="bp-wrap"><article class="bp" data-post-id="${post.id}" data-status="${post.status}">
    <p class="bp-back"><a href="${blogUrl(lang, '')}">${t.back}</a></p>
    <header class="bp-head"${textLang !== lang ? ` lang="${textLang}"` : ''}>
      ${post.status === 'draft' ? `<p class="bl-draft">${t.draft}</p>` : ''}
      <h1>${esc(title)}</h1>
      <p class="bl-meta">${fmtDate(post.published_at || post.updated_at, lang)} · ${Math.max(1, Math.round(words / 200))} ${t.min}
        ${tags.length ? ' · ' + tags.map(g => `<a class="bl-tag" href="${blogUrl(lang, '', '?tag=' + encodeURIComponent(g))}">#${esc(g)}</a>`).join(' ') : ''}</p>
    </header>
    ${post.cover ? `<figure class="bp-cover"><img src="${esc(post.cover)}" alt=""></figure>` : ''}
    <div class="bp-body"${textLang !== lang ? ` lang="${textLang}"` : ''}>${field(post, 'b', lang)}</div>
    <div class="bp-actions"><button type="button" class="bp-like" aria-pressed="false"><span class="bp-heart">♥</span> <span class="bp-likes">${post.likes || 0}</span></button>
      <a class="bp-edit pill-btn" href="/blog-editor/#${post.id}" hidden data-blog-admin>✎ Edit</a></div>
    <section class="bp-comments" id="comments"><h2>${t.comments} <span class="bp-ccount">${comments.length}</span></h2>
      <ol class="bc-list">${comments.map(c => commentHtml(c, lang)).join('')}</ol>
      ${comments.length ? '' : `<p class="bc-empty">${t.noComments}</p>`}
      <div class="bc-form-wrap" data-comment-form></div>
    </section>
  </article>
  <div class="bp-more">${sidebar(published, lang, '', '', true)}</div></div>
  <script src="/assets/blog.js" defer></script>`;
  const jsonld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title, description, inLanguage: textLang,
    datePublished: new Date((post.published_at || post.updated_at) * 1000).toISOString(), dateModified: new Date(post.updated_at * 1000).toISOString(),
    author: { '@type': 'Person', name: 'Alina Otkinska', url: SITE + '/about-me/' }, mainEntityOfPage: SITE + blogUrl(lang, post.slug),
    ...(post.cover ? { image: post.cover.startsWith('/') ? SITE + post.cover : post.cover } : {}), keywords: tags.join(', ') };
  return html(fill(tpl, { title: `${title} · Pigeon Polly Art Lab`, description, canonical: SITE + blogUrl(lang, post.slug), content, image: post.cover,
    type: 'article', slug: post.slug, jsonld, noindex: post.status !== 'published' }));
}
