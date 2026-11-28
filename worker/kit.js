// «Новости от Полли» → Kit (kit.com, бывший ConvertKit; решение Алины 28.11.2026): адрес из почтового ящика на главной
// сначала сохраняется у нас (таблица subscribers, topic = 'news'), потом уходит в Kit — оттуда Алина пишет письма раз в неделю.
// Два пути: есть секрет KIT_KEY (Cloudflare → Settings → Variables) — API v4; нет — открытая форма Kit по её номеру
// (meta kit_form, кабинет → 📬 Подписчики). Ошибка — пишем в subscribers.kit_err, «Отправить ещё раз» в кабинете.
// форма Алины «Charlotte form» (28.11.2026) — по умолчанию, пока в кабинете не вставлена другая
export const KIT_FORM = '10254877';
export const KIT_ALTER = ['ALTER TABLE subscribers ADD COLUMN kit_at INTEGER DEFAULT 0', "ALTER TABLE subscribers ADD COLUMN kit_err TEXT DEFAULT ''"];

// номер формы из чего угодно: «1234567», ссылка …/forms/1234567/subscriptions, код встраивания
export const kitFormOf = s => { const t = String(s || ''); const m = t.match(/forms\/(\d{4,})/) || t.match(/^\s*(\d{4,})\s*$/) || t.match(/data-sv-form="(\d{4,})"/); return m ? m[1] : ''; };

// '' — получилось, иначе короткая причина
export async function kitAdd(env, form, email) {
  try {
    if (env.KIT_KEY) {
      const H = { 'content-type': 'application/json', accept: 'application/json', 'X-Kit-Api-Key': env.KIT_KEY };
      let r = await fetch('https://api.kit.com/v4/subscribers', { method: 'POST', headers: H, body: JSON.stringify({ email_address: email }) });
      if (!r.ok) return 'api ' + r.status;
      if (form) { r = await fetch(`https://api.kit.com/v4/forms/${form}/subscribers`, { method: 'POST', headers: H, body: JSON.stringify({ email_address: email }) }); if (!r.ok) return 'form ' + r.status; }
      return '';
    }
    if (!form) return 'no_form';
    const r = await fetch(`https://app.kit.com/forms/${form}/subscriptions`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' }, body: 'email_address=' + encodeURIComponent(email) });
    return r.ok ? '' : 'form ' + r.status;
  } catch (e) { return 'net ' + String(e && e.message || e).slice(0, 60); }
}

// отправить в Kit и записать итог; healthErr — сбой придёт Алине в письме о сбоях
export async function kitSync(env, row, form, healthErr) {
  const err = await kitAdd(env, form, row.email);
  await env.DB.prepare('UPDATE subscribers SET kit_at = ?, kit_err = ? WHERE id = ?').bind(err ? 0 : Math.floor(Date.now() / 1000), err, row.id).run();
  if (err && err !== 'no_form' && healthErr) await healthErr('kit', new Error(err));
  return err;
}
