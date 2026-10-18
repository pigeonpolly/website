// Доски топа игр (docs/games.md § Доски топа): одна на каждую игру, вкладки «За всё время» и «Эта неделя».
// За всё время — из того, что игра и так хранит (рекорд, уровень, книга рецептов); неделя (пн–вс по Риге) — таблица top_week:
// mode 'max' — лучший результат недели (рекорд забега), 'add' — сколько набрано за неделю (уровни, рецепты, дела).
// Игры зовут topScore(env, игра, uid, n); API: GET /api/top?g=rain|pan|maze|recipes|titos&p=all|week.

export const TOP_TABLES = [
  'CREATE TABLE IF NOT EXISTS top_week (game TEXT NOT NULL, week TEXT NOT NULL, user_id INTEGER NOT NULL, score INTEGER NOT NULL, at INTEGER, PRIMARY KEY (game, week, user_id))',
];

const OK = "u.banned = 0 AND u.nick IS NOT NULL AND u.nick != ''";
// all: from — откуда, score — число, at — кто раньше набрал (при равенстве выше)
const GAMES = {
  rain: { mode: 'max', from: 'users u', score: 'u.game_best', at: 'COALESCE(u.game_best_at, 0)' },
  pan: { mode: 'max', from: 'users u', score: 'u.pan_best', at: 'COALESCE(u.pan_best_at, 0)' },
  maze: { mode: 'add', from: 'users u', score: '(COALESCE(u.maze_level, 1) - 1)', at: 'u.id' },
  recipes: { mode: 'add', from: '(SELECT user_id, COUNT(*) AS n, MAX(created_at) AS at FROM potion_book WHERE tier > 0 GROUP BY user_id) b JOIN users u ON u.id = b.user_id', score: 'b.n', at: 'b.at' },
  titos: { mode: 'add', from: 'titos t JOIN users u ON u.id = t.user_id', score: 't.level', at: 'u.id' },
};

// понедельник недели по Риге, 'YYYY-MM-DD'
export function topWeek(day) {
  const d = new Date((day || new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' })) + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0, 10);
}
const prevWeek = w => { const d = new Date(w + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - 7); return d.toISOString().slice(0, 10); };

export async function topScore(env, game, uid, n) {
  const g = GAMES[game]; if (!g || !uid || !(n > 0)) return;
  const sql = g.mode === 'max'
    ? 'INSERT INTO top_week (game, week, user_id, score, at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(game, week, user_id) DO UPDATE SET score = excluded.score, at = excluded.at WHERE excluded.score > top_week.score'
    : 'INSERT INTO top_week (game, week, user_id, score, at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(game, week, user_id) DO UPDATE SET score = top_week.score + excluded.score, at = excluded.at';
  await env.DB.prepare(sql).bind(game, topWeek(), uid, n, Date.now()).run().catch(e => console.error('top', e));
}

// старые недели не нужны: держим 8
export const topCron = env => env.DB.prepare('DELETE FROM top_week WHERE week < ?').bind(topWeek(new Date(Date.now() - 56 * 86400000).toISOString().slice(0, 10))).run();

// h: json, fail, currentUser, avatarOf
export async function topApi(req, env, url, h) {
  if (req.method !== 'GET' || url.pathname !== '/api/top') return null;
  const game = url.searchParams.get('g'), g = GAMES[game]; if (!g) h.fail(400, 'game');
  const week = url.searchParams.get('p') === 'week', w = topWeek(), u = await h.currentUser(req, env);
  const src = week ? { from: 'top_week b JOIN users u ON u.id = b.user_id', score: 'b.score', at: 'b.at', where: 'b.game = ? AND b.week = ?', args: [game, w] }
    : { ...g, where: '1', args: [] };
  const base = `FROM ${src.from} WHERE ${src.where} AND ${src.score} > 0 AND ${OK}`;
  const top = (await env.DB.prepare(`SELECT u.id, u.nick, u.avatar, ${src.score} AS score ${base} ORDER BY score DESC, ${src.at}, u.id LIMIT 10`).bind(...src.args).all()).results
    .map((r, i) => ({ place: i + 1, id: r.id, nick: r.nick, avatar: h.avatarOf(r), score: r.score }));
  let me = null;
  if (u && u.nick && !u.banned) {
    const mine = await env.DB.prepare(`SELECT ${src.score} AS score, ${src.at} AS at ${base} AND u.id = ?`).bind(...src.args, u.id).first();
    if (mine && mine.score > 0) {
      const ahead = top.find(r => r.id === u.id);
      const place = ahead ? ahead.place : 1 + (await env.DB.prepare(`SELECT COUNT(*) AS n ${base} AND (${src.score} > ? OR (${src.score} = ? AND (${src.at} < ? OR (${src.at} = ? AND u.id < ?))))`)
        .bind(...src.args, mine.score, mine.score, mine.at, mine.at, u.id).first()).n;
      me = { place, id: u.id, nick: u.nick, avatar: h.avatarOf(u), score: mine.score };
    } else me = { place: 0, id: u.id, nick: u.nick, avatar: h.avatarOf(u), score: 0 };
  }
  // кто победил на прошлой неделе
  let last = null;
  if (week) {
    const r = await env.DB.prepare(`SELECT u.id, u.nick, u.avatar, b.score FROM top_week b JOIN users u ON u.id = b.user_id WHERE b.game = ? AND b.week = ? AND ${OK} ORDER BY b.score DESC, b.at, u.id LIMIT 1`).bind(game, prevWeek(w)).first();
    if (r) last = { id: r.id, nick: r.nick, avatar: h.avatarOf(r), score: r.score };
  }
  return h.json({ g: game, p: week ? 'week' : 'all', mode: g.mode, week: w, top, me, last });
}
