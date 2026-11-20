// A1 Lab — automātiska pārbaude un ekrānuzņēmumi.
//   node a1-pack/tools/lab_test.js a1-pack/topics/<slug> <izvades mape>
// Pārbauda: JS kļūdas, visus slaidus (→ un A), visus uzdevumus (Pārbaudīt + Rādīt atbildes),
// horizontālo skrolu uz 390, mājasdarba PDF lejupielādi. Saglabā PNG: d-NN (slaidi), w-NN (1440), m-NN (390).
const path = require("path"), fs = require("fs");
const { chromium } = require("playwright");
(async () => {
  const topic = path.resolve(process.argv[2]), out = path.resolve(process.argv[3] || ".");
  fs.mkdirSync(out, { recursive: true });
  const slug = path.basename(topic), D = "file://" + topic + "/" + slug + "-prezentacija.html", W = "file://" + topic + "/" + slug + "-tema.html";
  const b = await chromium.launch(), errs = [], res = {};
  const watch = (p, tag) => { p.on("pageerror", e => errs.push(tag + ": " + e.message)); p.on("console", m => { if (m.type() === "error") errs.push(tag + ": " + m.text()); }); };
  const inst = (p, y) => p.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), y);

  if (fs.existsSync(topic + "/" + slug + "-prezentacija.html")) {
    const p = await b.newPage({ viewport: { width: 1440, height: 810 } }); watch(p, "deck");
    await p.goto(D); await p.waitForTimeout(500);
    const n = await p.evaluate(() => LAB.deck.length); res.slides = n;
    for (let i = 1; i <= n; i++) {
      await p.evaluate(i => { location.hash = "#" + i; }, i); await p.waitForTimeout(450);
      await p.screenshot({ path: `${out}/d-${String(i).padStart(2, "0")}.png` });
      await p.keyboard.press("a");
    }
    for (let i = 0; i < n * 3; i++) { await p.keyboard.press("ArrowRight"); await p.waitForTimeout(30); }
    await p.close();
  }
  if (fs.existsSync(topic + "/" + slug + "-tema.html")) {
    const c = await b.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 900 } });
    const p = await c.newPage(); watch(p, "tema");
    await p.goto(W); await p.waitForTimeout(700);
    await p.evaluate(() => document.querySelectorAll(".reveal-up,.msg").forEach(e => e.classList.add("in")));
    await p.screenshot({ path: `${out}/w-00.png` });
    const tops = await p.evaluate(() => [...document.querySelectorAll(".sec")].map(s => s.getBoundingClientRect().top + scrollY - 110));
    for (let i = 0; i < tops.length; i++) { await inst(p, tops[i]); await p.waitForTimeout(250); await p.screenshot({ path: `${out}/w-${String(i + 1).padStart(2, "0")}.png` }); }
    res.exercises = await p.evaluate(() => { let n = 0; document.querySelectorAll(".ex").forEach(ex => { if (ex.closest("#hw")) return; const bs = ex.querySelectorAll(".ex-f .btn"); bs.forEach(x => x.click()); bs.forEach(x => x.click()); n++; }); return n; });
    await p.fill("#hw-name", "Test Tester");
    const dl = p.waitForEvent("download", { timeout: 30000 }).catch(() => null);
    await p.click("#hw .dl .btn"); const d = await dl;
    res.homeworkPdf = d ? d.suggestedFilename() : "NAV (tikai drukas režīms)";
    const m = await b.newPage({ viewport: { width: 390, height: 844 } }); watch(m, "tema-390");
    await m.goto(W); await m.waitForTimeout(600);
    await m.evaluate(() => document.querySelectorAll(".reveal-up,.msg").forEach(e => e.classList.add("in")));
    res.scroll390 = await m.evaluate(() => document.documentElement.scrollWidth);
    const mt = await m.evaluate(() => [0, ...[...document.querySelectorAll(".sec")].map(s => s.getBoundingClientRect().top + scrollY - 110)]);
    for (let i = 0; i < mt.length; i++) { await inst(m, mt[i]); await m.waitForTimeout(200); await m.screenshot({ path: `${out}/m-${String(i).padStart(2, "0")}.png` }); }
  }
  console.log(JSON.stringify({ ...res, errors: errs }, null, 1));
  await b.close();
  process.exit(errs.length || (res.scroll390 && res.scroll390 > 390) ? 1 : 0);
})();
