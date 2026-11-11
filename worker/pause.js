// ⏸ Пауза сайта (docs/admin.md «Пауза»): meta site_pause = '1' — посетители на любой странице видят «Ведутся работы» (site/(ru|lv/)pause.html, 503),
// админ ходит по сайту как обычно (внизу плашка «Сайт на паузе»). /admin/, /api/*, картинки и файлы работают всегда — чтобы войти и снять паузу.
// API: POST /api/admin/pause {on}; состояние — в GET /api/admin/week (pause).

let cache = { at: 0, on: false };
const TTL = 15000; // флаг читается из D1 не чаще раза в 15 с на экземпляр worker'а

export async function pauseOn(env) {
  if (Date.now() - cache.at < TTL) return cache.on;
  let on = false;
  try { on = ((await env.DB.prepare("SELECT value FROM meta WHERE key = 'site_pause'").first()) || {}).value === '1'; } catch (e) { /* нет базы — не пауза */ }
  cache = { at: Date.now(), on };
  return on;
}

// для страниц: null — пускать как обычно; иначе ответ (страница паузы или та же страница с плашкой для админа)
// h: currentUser, isAdmin, errorPage; next() — обычный ответ страницы
export async function pauseGate(req, env, url, h, next) {
  if (!env.DB || /^\/(?:(?:ru|lv)\/)?admin\//.test(url.pathname) || url.pathname.startsWith('/media/')) return null;
  if (!(await pauseOn(env))) return null;
  let adm = false;
  try { adm = await h.isAdmin(await h.currentUser(req, env), env); } catch (e) { adm = false; }
  if (!adm) return h.errorPage(env, url, 'pause'); // 503 + Retry-After: поисковики подождут, а не выкинут страницы
  const res = await next();
  if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
  return new HTMLRewriter().on('body', { element(el) {
    el.append('<a href="/admin/#week" class="pp-pausebar" style="position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;padding:10px 18px;border-radius:999px;background:#D9643A;color:#fff;font:700 14px/1.2 Karla,system-ui,sans-serif;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,.25);width:max-content;max-width:calc(100vw - 24px);box-sizing:border-box;text-align:center">⏸ Сайт на паузе — посетители видят «Ведутся работы» · снять паузу</a>', { html: true });
  } }).transform(res);
}

export async function pauseApi(req, env, h) {
  const u = await h.needUser(req, env);
  if (!(await h.isAdmin(u, env))) h.fail(403, 'admin');
  const b = await req.json().catch(() => ({}));
  const on = !!b.on;
  await env.DB.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('site_pause', ?)").bind(on ? '1' : '0').run();
  await env.DB.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('site_pause_at', ?)").bind(String(h.now())).run();
  cache = { at: Date.now(), on };
  return h.json({ ok: true, on, at: h.now() });
}
