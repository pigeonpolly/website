// A1 Pack: Oskara SVG → PNG (Word/PowerPoint) un HTML → PDF (Chromium).
//   node render.js png <out> <#accent>
//   node render.js pdf <out> <fails.html> ...
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");

(async () => {
  const [mode, out, ...rest] = process.argv.slice(2);
  const b = await chromium.launch();
  if (mode === "png") {
    const accent = rest[0] || "#FF5A36";
    const src = path.join(__dirname, "..", "design", "oscar");
    const dst = path.join(out, "assets", "png");
    fs.mkdirSync(dst, { recursive: true });
    const p = await b.newPage({ deviceScaleFactor: 3 });
    for (const f of fs.readdirSync(src).filter(f => f.endsWith(".svg"))) {
      const svg = fs.readFileSync(path.join(src, f), "utf8").replace(/var\(--accent,[^)]*\)/g, accent);
      const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
      const w = +vb[1], h = +vb[2];
      await p.setViewportSize({ width: w * 2, height: h * 2 });
      await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${w * 2}" height="${h * 2}" `)}</body></html>`);
      await p.locator("svg").screenshot({ path: path.join(dst, f.replace(".svg", ".png")), omitBackground: true });
    }
  } else if (mode === "pdf") {
    const dst = path.join(out, "pdf");
    fs.mkdirSync(dst, { recursive: true });
    for (const f of rest) {
      const p = await b.newPage();
      await p.goto("file://" + path.resolve(f), { waitUntil: "load" });
      await p.evaluate(() => document.fonts.ready);
      const deck = await p.$(".deck-body");
      await p.pdf({
        path: path.join(dst, path.basename(f).replace(".html", ".pdf")),
        printBackground: true, preferCSSPageSize: true,
        ...(deck ? {} : { displayHeaderFooter: true, headerTemplate: "<span></span>",
          footerTemplate: '<div style="font:8px Inter,Arial;color:#888;width:100%;text-align:right;padding-right:16mm"><span class="pageNumber"></span> / <span class="totalPages"></span></div>' }),
      });
      await p.close();
      console.log("pdf:", path.basename(f));
    }
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
