// Резервные копии сайта (кабинет админа): скачать всё одним архивом, автокопия в Google Drive, восстановить из копии.
// window.PPBackup = { download(button), autoPanel(), restore(file, labelEl) }
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = async (path, body, raw) => {
    const opt = { credentials: 'same-origin' };
    if (raw) Object.assign(opt, { method: 'POST', body: raw });
    else if (body) Object.assign(opt, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const r = await fetch('/api/' + path, opt);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || r.status); e.code = d.error || String(r.status); throw e; }
    return d;
  };
  const errText = e => 'Что-то пошло не так (' + esc(e.code || e.message) + ').';
  const README = d => `Резервная копия сайта pigeonpolly.com от ${d.exported_at}

data.json — всё содержимое базы:
  • блог: статьи (RU/EN/LV), теги, разделы, комментарии, лайки;
  • челлендж: аккаунты (ник, e-mail, серии, бейджи) и список работ.
media/ — картинки статей блога.
challenge/works/ — рисунки участников челленджа.
posts/ — статьи как обычные HTML-файлы (открываются в браузере без сайта).

Восстановить блог: Редактор блога → «♻ Восстановить из копии» → выбрать этот ZIP.
Код и страницы сайта — во втором архиве (website-main.zip с GitHub, скачивается вместе с этим).
`;
  // автокопия раз в неделю: готовый скрипт для Google Apps Script с личным ключом
  async function autoPanel(rotate) {
    let t;
    try { t = rotate ? await api('blog/admin/backup-token', {}) : await api('blog/admin/backup-token'); } catch (e) { alert(errText(e)); return; }
    const code = `// Автокопия ВСЕГО сайта pigeonpolly.com в Google Drive — раз в неделю (понедельник, ~6 утра)
// Каждую неделю — папка с датой: «данные» (блог, челлендж, все картинки) и «код» (весь сайт с GitHub)
const SITE = 'https://www.pigeonpolly.com';
const TOKEN = '${t.token}';            // личный ключ — никому не показывайте
const CODE = 'https://codeload.github.com/pigeonpolly/website/zip/refs/heads/main';
const FOLDER = 'pigeonpolly — резервные копии';
const KEEP = 12;                      // сколько последних недель хранить

// Запустите ОДИН раз: включает еженедельную копию и сразу делает первую
function setup() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('backup').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(6).create();
  backup();
}

function backup() {
  const date = Utilities.formatDate(new Date(), 'Europe/Riga', 'yyyy-MM-dd');
  const it = DriveApp.getFoldersByName(FOLDER);
  const root = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER);
  const week = root.createFolder(date);

  // 1) данные сайта: статьи, теги, комментарии, аккаунты и рисунки челленджа, все картинки
  const res = UrlFetchApp.fetch(SITE + '/api/blog/backup?token=' + TOKEN, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new Error('Сайт не отдал копию данных: ' + res.getResponseCode());
  const text = res.getContentText(), data = JSON.parse(text);
  const blobs = [Utilities.newBlob(text, 'application/json', 'data.json')];
  for (let i = 0; i < data.files.length; i += 40) {
    const part = data.files.slice(i, i + 40);
    UrlFetchApp.fetchAll(part.map(f => ({ url: SITE + f.url, muteHttpExceptions: true })))
      .forEach((r, k) => { if (r.getResponseCode() === 200) blobs.push(r.getBlob().setName(part[k].path)); });
  }
  week.createFile(Utilities.zip(blobs, 'pigeonpolly-данные-' + date + '.zip'));

  // 2) код и страницы сайта с GitHub
  const code = UrlFetchApp.fetch(CODE, { muteHttpExceptions: true });
  if (code.getResponseCode() !== 200) throw new Error('GitHub не отдал код: ' + code.getResponseCode());
  week.createFile(code.getBlob().setName('pigeonpolly-код-' + date + '.zip'));

  // старые недели — в корзину
  const weeks = []; const fi = root.getFolders(); while (fi.hasNext()) weeks.push(fi.next());
  weeks.sort((a, b) => b.getDateCreated() - a.getDateCreated()).slice(KEEP).forEach(f => f.setTrashed(true));
}
`;
    const d = document.createElement('dialog');
    d.className = 'be-dialog';
    d.innerHTML = `<h2>🔁 Автокопия всего сайта в Google Drive — раз в неделю</h2>
      <p>Каждый понедельник в вашем Google Drive будет появляться папка с датой и двумя архивами: <b>данные</b> (статьи на 3 языках, теги, разделы, комментарии, аккаунты и рисунки челленджа, все картинки) и <b>код</b> (весь сайт с GitHub: страницы, игры, Wobbleland, иллюстрации).</p>
      <ol>
        <li>Нажмите <b>«Скопировать скрипт»</b> ниже.</li>
        <li>Откройте <a href="https://script.google.com/home/projects/create" target="_blank" rel="noopener">script.google.com → Новый проект ↗</a> (тем же Google-аккаунтом, где ваш Google Drive).</li>
        <li>Удалите всё, что там написано, и вставьте скрипт (Ctrl+V). Нажмите 💾 «Сохранить».</li>
        <li>Вверху в списке функций выберите <b>setup</b> и нажмите <b>▶ Выполнить</b>.</li>
        <li>Google попросит разрешения: <i>Проверить разрешения → ваш аккаунт → Дополнительно → Перейти к проекту → Разрешить</i>. Это нормально: скрипт ваш, он только скачивает копию с сайта и кладёт её в ваш Drive.</li>
        <li>Готово. В Google Drive появится папка <b>«pigeonpolly — резервные копии»</b>, в ней папка с сегодняшней датой и двумя архивами. Дальше — новая каждый понедельник утром (хранятся последние 12 недель). Если копия когда-нибудь не получится, Google сам пришлёт письмо.</li>
      </ol>
      <textarea readonly rows="10">${esc(code)}</textarea>
      <p class="be-dialog-acts"><button type="button" class="pill-btn pill-fill" data-copy>📋 Скопировать скрипт</button>
        <button type="button" class="pill-btn" data-rotate title="Если ключ попал к кому-то чужому: старый перестанет работать, скрипт нужно будет вставить заново">Сменить ключ</button>
        <button type="button" class="pill-btn" data-close>Закрыть</button></p>`;
    document.body.appendChild(d); d.showModal();
    d.querySelector('[data-close]').onclick = () => { d.close(); d.remove(); };
    d.querySelector('[data-copy]').onclick = async e => { try { await navigator.clipboard.writeText(code); } catch (err) { d.querySelector('textarea').select(); document.execCommand('copy'); } e.target.textContent = '✓ Скопировано'; };
    d.querySelector('[data-rotate]').onclick = () => { if (confirm('Сменить ключ? Старый скрипт перестанет работать — его нужно будет вставить заново.')) { d.close(); d.remove(); autoPanel(true); } };
  }
  // JSZip для резервных копий — подгружаем только когда нужен
  let zipLib = null;
  const loadZip = () => zipLib || (zipLib = new Promise((res, rej) => {
    if (window.JSZip) return res(window.JSZip);
    const sc = document.createElement('script'); sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    sc.onload = () => res(window.JSZip); sc.onerror = () => { zipLib = null; rej(new Error('zip')); }; document.head.appendChild(sc);
  }));
  // скачать всё: data.json + картинки + читаемые HTML-файлы статей, одним ZIP, и код сайта с GitHub
  async function download(btn) {
      btn.disabled = true;
      const say = t => { btn.textContent = t; };
      try {
        say('Готовлю…');
        const [JSZip, data] = await Promise.all([loadZip(), api('blog/backup')]);
        const zip = new JSZip();
        zip.file('data.json', JSON.stringify(data, null, 1));
        zip.file('README.txt', README(data));
        for (const p of data.posts) for (const l of ['ru', 'en', 'lv']) {
          if (!p['t_' + l] && !p['b_' + l]) continue;
          zip.file(`posts/${p.slug}/${l}.html`, `<!doctype html><meta charset="utf-8"><title>${esc(p['t_' + l])}</title><body style="max-width:760px;margin:40px auto;font:18px/1.6 Georgia,serif">` +
            `<h1>${esc(p['t_' + l])}</h1><p><i>${esc(p['d_' + l] || '')}</i></p>` + String(p['b_' + l] || '').replace(/src="\/media\//g, 'src="../../media/') + '</body>');
        }
        let n = 0;
        for (const f of data.files) {
          say(`Файлы: ${++n} из ${data.files.length}…`);
          try { const r = await fetch(f.url); if (r.ok) zip.file(f.path, await r.blob()); } catch (err) { /* пропускаем */ }
        }
        say('Упаковываю…');
        const blob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = `pigeonpolly-${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(a); a.click(); a.remove();
        // и код сайта с GitHub — вторым файлом
        const c = document.createElement('a'); c.href = 'https://codeload.github.com/pigeonpolly/website/zip/refs/heads/main'; c.download = '';
        document.body.appendChild(c); setTimeout(() => { c.click(); c.remove(); }, 800);
        say('✓ Скачано: данные + код');
      } catch (err) { alert('Не получилось сделать копию: ' + errText(err)); say('💾 Скачать полную копию сайта'); }
      btn.disabled = false;
  }
  // восстановить статьи и картинки из ранее скачанной копии
  async function restore(f, lbl) {
      if (!f || !confirm('Восстановить блог из этой копии? Статьи с теми же адресами будут заменены версиями из копии, остальные останутся как есть.')) return;
      try {
        const JSZip = await loadZip(), zip = await JSZip.loadAsync(f);
        const data = JSON.parse(await zip.file('data.json').async('string'));
        const media = zip.file(/^media\/blog\//);
        let n = 0;
        for (const m of media) {
          lbl.firstChild.textContent = `Картинки: ${++n} из ${media.length}…`;
          const fd = new FormData(); fd.append('key', m.name.slice(6)); fd.append('file', await m.async('blob'), 'img');
          await api('blog/admin/restore-media', null, fd);
        }
        lbl.firstChild.textContent = 'Статьи…';
        const r = await api('blog/admin/import', data);
        alert(`✓ Восстановлено: статей ${r.posts}, комментариев ${r.comments}, картинок ${media.length}.`);
        lbl.firstChild.textContent = '♻ Восстановить из копии';
      } catch (err) { alert('Не получилось восстановить: ' + errText(err)); lbl.firstChild.textContent = '♻ Восстановить из копии'; }
  }
  window.PPBackup = { download, autoPanel, restore };
})();
