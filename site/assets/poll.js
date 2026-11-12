// Опрос на главной (worker/polls.js, docs/site.md «Опрос на главной»): бюллетень на бумаге — выбрать тему следующего
// видеоурока / «рисуем вместе» (или предложить свою), после голоса — итоги полосками. Один голос с IP, изменить нельзя.
// Блок <section id="poll" hidden> в src/pages/preview.html; нет опроса или Алина скрыла блок — секция остаётся скрытой.
(function () {
  const box = document.getElementById('poll'); if (!box) return;
  const lang = document.documentElement.lang || 'en', L = { en: 0, ru: 1, lv: 2 }[lang] ?? 0;
  const T = (en, ru, lv) => [en, ru, lv][L];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ERR = {
    voted: T('You have already voted in this poll.', 'Голос в этом опросе уже есть.', 'Šajā aptaujā jau ir balss.'),
    closed: T('This poll is already closed.', 'Опрос уже завершён.', 'Aptauja jau ir slēgta.'),
    idea: T('Write your topic in a few words.', 'Напиши свою тему в паре слов.', 'Uzraksti savu tēmu dažos vārdos.'),
    link: T('No links, please, just the topic.', 'Без ссылок, только тема.', 'Bez saitēm, tikai tēma.'),
  };
  const fmtDate = t => new Date(t * 1000).toLocaleDateString(['en-GB', 'ru-RU', 'lv-LV'][L], { day: 'numeric', month: 'long' });
  let poll = null, t0 = Date.now();

  function render(msg) {
    const p = poll, done = !!p.my || p.status === 'closed', total = p.total || 0;
    const opts = p.opts.slice();
    const own = (p.total || 0) - p.opts.reduce((a, o) => a + (o.n || 0), 0); // голоса «своя тема»
    if (done && p.ideas && (own > 0 || p.my === 'idea')) opts.push({ id: 'idea', t: T('Own topics', 'Свои темы', 'Savas tēmas'), n: own });
    const max = Math.max(0, ...opts.map(o => o.n || 0));
    const head = p.status === 'closed'
      ? `<span class="k">${T('Poll closed', 'Опрос завершён', 'Aptauja slēgta')}</span><h2>${T('You chose, <em>I paint</em>', 'Выбрали — <em>рисую</em>', 'Jūs izvēlējāties, <em>es zīmēju</em>')}</h2>
         <p>${T('Thank you for voting! The winning topic goes into the next video.', 'Спасибо за голоса! Тема-победитель — в следующем видео.', 'Paldies par balsīm! Uzvarētāja tēma būs nākamajā video.')}</p>`
      : `<span class="hand">${T('your vote decides ✿', 'решает твой голос ✿', 'izšķir tava balss ✿')}</span>
         <h2>${T('What shall we paint <em>next?</em>', 'Что рисуем <em>дальше?</em>', 'Ko zīmēsim <em>tālāk?</em>')}</h2>
         <p>${T('Pick the topic for my next video lesson or paint-along. Everyone can vote, once.', 'Выбери тему следующего видеоурока или «рисуем вместе». Голосовать могут все, один раз.', 'Izvēlies tēmu nākamajai video nodarbībai vai kopīgai zīmēšanai. Balsot var visi, vienu reizi.')}</p>`;
    const rows = done
      ? opts.map(o => {
        const pc = total ? Math.round((o.n || 0) * 100 / total) : 0, win = p.status === 'closed' && o.n === max && max > 0;
        return `<li class="pr${o.id === p.my ? ' me' : ''}${win ? ' win' : ''}"><span class="pb" style="--w:${pc}%"></span>
          <span class="pt">${esc(o.t)}${o.id === p.my ? ` <small>✓ ${T('your vote', 'твой голос', 'tava balss')}</small>` : ''}${win ? ` <small>★ ${T('winner', 'победила', 'uzvarēja')}</small>` : ''}</span><b>${pc}%</b></li>`;
      }).join('')
      : p.opts.map(o => `<li><label class="po"><input type="radio" name="pq" value="${esc(o.id)}"><span class="bx" aria-hidden="true"></span><span class="pt">${esc(o.t)}</span></label></li>`).join('')
        + (p.ideas ? `<li><label class="po"><input type="radio" name="pq" value="idea"><span class="bx" aria-hidden="true"></span><span class="pt">${T('My own topic…', 'Своя тема…', 'Sava tēma…')}</span></label>
          <input class="pi" maxlength="120" placeholder="${T('e.g. autumn mushrooms in ink', 'например, осенние грибы тушью', 'piem., rudens sēnes ar tušu')}" aria-label="${T('Your topic', 'Твоя тема', 'Tava tēma')}" hidden></li>` : '');
    const foot = done
      ? `<p class="pf">${T('Votes', 'Голосов', 'Balsis')}: <b>${total}</b>${p.status === 'open' && p.ends ? ` · ${T('open until', 'до', 'līdz')} ${fmtDate(p.ends)}` : ''}</p>`
      : `<input class="hp" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="button" class="btn pri pv" disabled>${T('Vote', 'Голосовать', 'Balsot')}</button>
         <p class="pf">${T('One vote per person: it can’t be changed later.', 'Один голос, изменить потом нельзя.', 'Viena balss, vēlāk to mainīt nevar.')}${p.ends ? ` ${T('Open until', 'Открыт до', 'Atvērta līdz')} ${fmtDate(p.ends)}.` : ''}</p>`;
    box.innerHTML = `<div class="w"><div class="pl-l">${head}</div>
      <div class="ballot${done ? ' done' : ''}"><span class="tp" aria-hidden="true"></span>
        <div class="bh"><span>${T('Ballot', 'Бюллетень', 'Biļetens')} · Pigeon Polly Art Lab</span>${p.my ? `<span class="stamp2" aria-hidden="true">${T('I voted', 'Голос', 'Balsoju')}<br>✿</span>` : ''}</div>
        <h3>${esc(p.q)}</h3><ul class="pls">${rows}</ul>${foot}<p class="pm" aria-live="polite">${esc(msg || '')}</p></div></div>`;
    box.hidden = false;
    if (done) { requestAnimationFrame(() => box.querySelectorAll('.pb').forEach(b => b.classList.add('on'))); return; }
    const btn = box.querySelector('.pv'), idea = box.querySelector('.pi');
    box.querySelectorAll('input[name=pq]').forEach(r => r.addEventListener('change', () => {
      btn.disabled = false; if (idea) { idea.hidden = r.value !== 'idea'; if (!idea.hidden) idea.focus(); }
    }));
    btn.addEventListener('click', async () => {
      const opt = (box.querySelector('input[name=pq]:checked') || {}).value; if (!opt) return;
      const m = box.querySelector('.pm');
      if (opt === 'idea' && (idea.value.trim().length < 3)) { m.textContent = ERR.idea; idea.focus(); return; }
      btn.disabled = true; m.textContent = '…';
      try {
        const r = await fetch('/api/poll/vote', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: poll.id, opt, idea: opt === 'idea' ? idea.value : '', lang, hp: box.querySelector('.hp').value, ms: Date.now() - t0 }) });
        const d = await r.json().catch(() => ({}));
        if (d.error === 'voted' || d.error === 'closed') { await load(ERR[d.error]); return; }
        if (!r.ok) throw Object.assign(new Error(d.error || r.status), { code: d.error });
        poll = d.poll; render(T('Thank you! Your vote is in ✿', 'Спасибо! Голос учтён ✿', 'Paldies! Balss ieskaitīta ✿'));
      } catch (e) { btn.disabled = false; m.textContent = ERR[e.code] || T('Something went wrong, try again.', 'Что-то пошло не так, попробуй ещё раз.', 'Kaut kas nogāja greizi, mēģini vēlreiz.'); }
    });
  }
  async function load(msg) {
    try {
      const d = await (await fetch('/api/poll?lang=' + lang, { credentials: 'same-origin' })).json();
      if (!d.poll) { box.hidden = true; return; }
      poll = d.poll; render(msg);
    } catch (e) { box.hidden = true; }
  }
  load();
})();
