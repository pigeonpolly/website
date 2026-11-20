/* A1 English Lab — dzinējs: burtnīca (workbook) un prezentācija (deck). Bez bibliotēkām.
   Dati: window.LAB = {meta, deck?, workbook?, poses:{name: svg}} */
(function () {
  "use strict";
  var L = window.LAB, M = L.meta, P = L.poses || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function h(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "on") for (var ev in attrs.on) e.addEventListener(ev, attrs.on[ev]);
      else if (attrs[k] !== undefined && attrs[k] !== null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  /* **b**, *serif*, ==mark==, ___ → līnija */
  function md(s) {
    s = esc(s);
    s = s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/==(.+?)==/g, '<span class="mark">$1</span>')
      .replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em class="s">$2</em>');
    return s;
  }
  function arr(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
  function oscar(p, cls) { return P[p] ? '<div class="oscar ' + (cls || "") + '" aria-hidden="true">' + P[p] + "</div>" : ""; }
  function norm(s) {
    return String(s || "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, " ").replace(/[.!?,;:]+$/g, "").replace(/\s+([.!?,])/g, "$1").trim();
  }
  function same(v, ans) { return arr(ans).some(function (a) { return norm(a) === norm(v); }); }
  function shuffle(a, seed) {
    a = a.slice(); var s = seed || 7;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var KEY = "a1lab:" + M.slug + ":" + (document.body.classList.contains("deck") ? "d" : "w");
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { store = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

  /* ---------- izruna (en-GB) ---------- */
  var SAY = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 6h2.5L9 3v10L5.5 10H3z"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.7a6 6 0 0 1 0 8.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var voice = null;
  function pickVoice() {
    if (!window.speechSynthesis) return;
    var vs = speechSynthesis.getVoices();
    voice = vs.filter(function (v) { return /en[-_]GB/i.test(v.lang); })[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, btn, rate) {
    if (!window.speechSynthesis) { coach("Šajā pārlūkā izruna nav pieejama."); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text).replace(/\*|=|_/g, ""));
    u.lang = "en-GB"; if (voice) u.voice = voice; u.rate = rate || 0.9;
    if (btn) { btn.classList.add("on"); u.onend = u.onerror = function () { btn.classList.remove("on"); }; }
    speechSynthesis.speak(u);
  }
  function sayBtn(text, label) {
    return h("button", { class: "say", type: "button", "aria-label": label || "Klausīties", on: { click: function (e) { e.stopPropagation(); speak(text, this); } } }, SAY);
  }

  /* ---------- Oskars-treneris, XP, konfeti ---------- */
  var coachEl, coachT;
  function coach(msg, pose) {
    if (!coachEl) return;
    $(".bub", coachEl).innerHTML = md(msg);
    if (pose && P[pose]) $(".oscar", coachEl).innerHTML = P[pose];
    coachEl.classList.add("talk");
    clearTimeout(coachT);
    coachT = setTimeout(function () { coachEl.classList.remove("talk"); }, 3600);
  }
  var PRAISE = ["Lieliski!", "Tieši tā!", "Precīzi kā Big Ben.", "Super — tējas pauze nopelnīta!", "Brīnišķīgi!", "Pareizi. Pat es neko neapgāzu!"];
  var SOFT = ["Gandrīz! Paskaties uz atbildēm.", "Nekas — es šorīt apmaldījos metro.", "Mēģini vēlreiz, tev sanāks.", "Kļūda — tas ir tikai solis uz priekšu."];
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  var XP = store.xp || 0, done = store.done || {};
  function addXP(n) {
    XP += n; store.xp = XP; save();
    var x = $(".xp b"); if (x) { x.textContent = XP; var p = x.parentNode; p.classList.remove("bump"); void p.offsetWidth; p.classList.add("bump"); }
  }
  function confetti() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = h("canvas", { class: "conf" }); document.body.appendChild(c);
    var ctx = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight;
    var cols = [M.accent, "#F2C94C", "#4E8068", "#2F7DD1"], ps = [];
    for (var i = 0; i < 90; i++) ps.push({ x: W / 2, y: H * 0.35, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: cols[i % 4], a: Math.random() * 6 });
    var t = 0;
    (function f() {
      ctx.clearRect(0, 0, W, H); t++;
      ps.forEach(function (p) { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.a += 0.2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (t < 110) requestAnimationFrame(f); else c.remove();
    })();
  }

  /* =================================================================
     UZDEVUMI — katrs atgriež {el, check(), reveal(), answers()}
     ================================================================= */
  var EX = {};
  function line(i, inner) { return h("li", {}, '<span class="i">' + (i + 1) + '</span><span class="t">' + inner + "</span>"); }

  EX.gap = function (e, id) {
    var ul = h("ul", { class: "items" }), ins = [];
    e.items.forEach(function (it, i) {
      var w = Math.max.apply(null, arr(it.answer).map(function (a) { return a.length; })) > 7 ? " w" : "";
      var inp = '<input class="gap' + w + '" data-k="' + id + "-" + i + '" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="atbilde">';
      var t = md(it.text); t = t.indexOf("___") > -1 ? t.replace("___", inp) : t + " " + inp;
      if (it.hint) t += ' <span class="tiny">(' + md(it.hint) + ")</span>";
      var li = line(i, t); ul.appendChild(li); ins.push(li);
    });
    return {
      el: ul,
      check: function () { var ok = 0; ins.forEach(function (li, i) { var v = $("input", li).value; var g = same(v, e.items[i].answer); li.className = v ? (g ? "ok" : "no") : "no"; if (g) ok++; }); return [ok, ins.length]; },
      reveal: function () { ins.forEach(function (li, i) { if (li.className === "no" && !$(".fix", li)) $(".t", li).appendChild(h("span", { class: "fix" }, "✓ " + md(arr(e.items[i].answer)[0]))); }); },
      answers: function () { return ins.map(function (li, i) { return [e.items[i].text.replace("___", "[" + ($("input", li).value || "—") + "]"), $("input", li).value, e.items[i].answer]; }); }
    };
  };

  EX.choice = function (e, id) {
    var ul = h("ul", { class: "items" }), lis = [];
    e.items.forEach(function (it, i) {
      var box = '<span class="opts">' + it.options.map(function (o) { return '<button type="button" class="opt">' + esc(o) + "</button>"; }).join("") + "</span>";
      var t = md(it.text); t = t.indexOf("___") > -1 ? t.replace("___", box) : t + " " + box;
      var li = line(i, t); ul.appendChild(li); lis.push(li);
      $$(".opt", li).forEach(function (b) { b.addEventListener("click", function () { $$(".opt", li).forEach(function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); li.className = ""; store[id + "-" + i] = b.textContent; save(); }); });
    });
    return {
      el: ul,
      check: function () { var ok = 0; lis.forEach(function (li, i) { var s = $(".opt.sel", li); var g = s && same(s.textContent, e.items[i].answer); li.className = g ? "ok" : "no"; if (g) ok++; }); return [ok, lis.length]; },
      reveal: function () { lis.forEach(function (li, i) { $$(".opt", li).forEach(function (b) { if (same(b.textContent, e.items[i].answer)) b.classList.add("right"); }); }); },
      answers: function () { return lis.map(function (li, i) { var s = $(".opt.sel", li); return [e.items[i].text.replace("___", "[" + (s ? s.textContent : "—") + "]"), s ? s.textContent : "", e.items[i].answer]; }); }
    };
  };

  EX.truefalse = function (e, id) {
    e = JSON.parse(JSON.stringify(e));
    e.items.forEach(function (it) { it.options = ["True", "False"]; it.answer = it.answer ? "True" : "False"; it.text = it.text + " ___"; });
    var r = EX.choice(e, id);
    if (e.text) { var w = h("div"); w.appendChild(h("div", { class: "card", style: "box-shadow:none;background:var(--bg);border:0;margin-bottom:8px" }, arr(e.text).map(function (p) { return "<p>" + md(p) + "</p>"; }).join(""))); w.appendChild(r.el); r.el = w; }
    return r;
  };

  EX.sort = function (e, id) {
    var wrap = h("div"), pool = h("div", { class: "pool" }), bk = h("div", { class: "buckets" }), pick = null, toks = [];
    var all = []; e.buckets.forEach(function (b, bi) { b.items.forEach(function (w) { all.push({ w: w, b: bi }); }); });
    shuffle(all, e.items ? 3 : all.length).forEach(function (o) {
      var t = h("button", { class: "tok", type: "button" }, md(o.w)); t._b = o.b; toks.push(t); pool.appendChild(t);
      t.addEventListener("click", function () { if (pick === t) { t.classList.remove("pick"); pick = null; return; } if (pick) pick.classList.remove("pick"); pick = t; t.classList.add("pick"); t.classList.remove("ok", "no"); $$(".bucket", bk).forEach(function (x) { x.classList.add("hot"); }); });
    });
    e.buckets.forEach(function (b, bi) {
      var d = h("div", { class: "bucket", role: "button", tabindex: "0", "aria-label": b.title }, "<h4>" + md(b.title) + "</h4>");
      d._i = bi;
      function drop() { if (!pick) { coach("Vispirms izvēlies vārdu augšā."); return; } d.appendChild(pick); pick.classList.remove("pick"); pick = null; $$(".bucket", bk).forEach(function (x) { x.classList.remove("hot"); }); }
      d.addEventListener("click", function (ev) { if (ev.target.closest(".tok") && !pick) return; drop(); });
      d.addEventListener("keydown", function (ev) { if (ev.key === "Enter") drop(); });
      bk.appendChild(d);
    });
    pool.addEventListener("click", function (ev) { if (pick && !ev.target.closest(".tok")) { pool.appendChild(pick); pick.classList.remove("pick"); pick = null; } });
    wrap.appendChild(pool); wrap.appendChild(bk);
    return {
      el: wrap,
      check: function () { var ok = 0; toks.forEach(function (t) { var p = t.parentNode; if (p.classList.contains("bucket")) { var g = p._i === t._b; t.classList.toggle("ok", g); t.classList.toggle("no", !g); if (g) ok++; } else t.classList.add("no"); }); return [ok, toks.length]; },
      reveal: function () { toks.forEach(function (t) { if (!t.classList.contains("ok")) { $$(".bucket", bk)[t._b].appendChild(t); t.classList.remove("no"); t.classList.add("ok"); } }); },
      answers: function () { return e.buckets.map(function (b, bi) { return [b.title, toks.filter(function (t) { return t.parentNode._i === bi; }).map(function (t) { return t.textContent; }).join(", "), b.items.join(", ")]; }); }
    };
  };

  EX.build = function (e, id) {
    var ul = h("ul", { class: "items" }), rows = [];
    e.items.forEach(function (it, i) {
      var li = line(i, ""), t = $(".t", li), b = h("div", { class: "build" }), ln = h("div", { class: "line", "data-ph": "Pieskaries vārdiem secībā…" }), ws = h("div", { class: "words" });
      var words = it.words ? it.words.split(/\s*\/\s*/) : it.answer.replace(/[.?!]$/, "").split(" ");
      shuffle(words, i + 5).forEach(function (w) {
        var tk = h("button", { class: "tok", type: "button" }, esc(w));
        tk.addEventListener("click", function () {
          var c = h("button", { class: "tok", type: "button" }, esc(w));
          c.addEventListener("click", function () { c.remove(); tk.classList.remove("used"); li.className = ""; });
          ln.appendChild(c); tk.classList.add("used"); li.className = "";
        });
        ws.appendChild(tk);
      });
      if (it.lv) t.appendChild(h("div", { class: "tiny", style: "margin-bottom:6px" }, md(it.lv)));
      b.appendChild(ln); b.appendChild(ws); t.appendChild(b); ul.appendChild(li); rows.push({ li: li, ln: ln });
    });
    function val(r) { return $$(".tok", r.ln).map(function (x) { return x.textContent; }).join(" "); }
    return {
      el: ul,
      check: function () { var ok = 0; rows.forEach(function (r, i) { var a = e.items[i].answer; var g = norm(val(r)) === norm(String(a).replace(/[.?!]$/, "")) || same(val(r), a); r.li.className = g ? "ok" : "no"; if (g) ok++; }); return [ok, rows.length]; },
      reveal: function () { rows.forEach(function (r, i) { if (r.li.className === "no" && !$(".fix", r.li)) $(".t", r.li).appendChild(h("span", { class: "fix" }, "✓ " + md(e.items[i].answer))); }); },
      answers: function () { return rows.map(function (r, i) { return [e.items[i].words || "", val(r), e.items[i].answer]; }); }
    };
  };

  EX.match = function (e, id) {
    var w = h("div", { class: "pairs" }), L1 = h("div", { class: "col" }), R1 = h("div", { class: "col" }), sel = null, pairs = {}, hue = 0;
    var cols = [M.accent, "#2F7DD1", "#6E9B76", "#B07CC6", "#C9A227", "#E07A5F", "#3D405B"];
    var lefts = e.items.map(function (it, i) { var b = h("button", { class: "tok", type: "button" }, md(it.left)); b._i = i; L1.appendChild(b); return b; });
    var rights = shuffle(e.items.map(function (it, i) { return { t: it.right || it.answer, i: i }; }), e.items.length + 2).map(function (o) { var b = h("button", { class: "tok", type: "button" }, md(o.t)); b._i = o.i; R1.appendChild(b); return b; });
    function clear(i) { var p = pairs[i]; if (!p) return; [lefts[i], p].forEach(function (b) { b.classList.remove("m", "ok", "no"); b.style.background = ""; }); delete pairs[i]; }
    lefts.forEach(function (b) { b.addEventListener("click", function () { clear(b._i); if (sel) sel.classList.remove("pick"); sel = b; b.classList.add("pick"); }); });
    rights.forEach(function (b) {
      b.addEventListener("click", function () {
        if (!sel) { coach("Vispirms izvēlies vārdu kreisajā pusē."); return; }
        for (var k in pairs) if (pairs[k] === b) clear(k);
        var c = cols[hue++ % cols.length]; pairs[sel._i] = b;
        [sel, b].forEach(function (x) { x.classList.add("m"); x.classList.remove("pick"); x.style.background = c; });
        sel = null;
      });
    });
    w.appendChild(L1); w.appendChild(R1);
    return {
      el: w,
      check: function () { var ok = 0; lefts.forEach(function (b, i) { var p = pairs[i]; var g = p && p._i === i; b.classList.toggle("ok", !!g); b.classList.toggle("no", !g); if (p) { p.classList.toggle("ok", !!g); p.classList.toggle("no", !g); } if (g) { b.style.background = p.style.background = ""; ok++; } }); return [ok, lefts.length]; },
      reveal: function () { lefts.forEach(function (b, i) { if (!b.classList.contains("ok")) b.innerHTML = md(e.items[i].left) + ' <span class="tiny">→ ' + md(e.items[i].right || e.items[i].answer) + "</span>"; }); },
      answers: function () { return lefts.map(function (b, i) { return [e.items[i].left, pairs[i] ? pairs[i].textContent : "", e.items[i].right || e.items[i].answer]; }); }
    };
  };

  EX.detective = function (e, id) {
    var ul = h("ul", { class: "items" }), rows = [];
    e.items.forEach(function (it, i) {
      var li = line(i, ""), d = h("div", { class: "det" }), picked = null;
      it.wrong.split(" ").forEach(function (w, wi) {
        var b = h("button", { class: "w", type: "button" }, esc(w));
        b.addEventListener("click", function () { $$(".w", d).forEach(function (x) { x.classList.remove("pick"); }); b.classList.add("pick"); picked = wi; li.className = ""; });
        d.appendChild(b); d.appendChild(document.createTextNode(" "));
      });
      var inp = h("input", { class: "line", placeholder: "Pareizi: …", autocomplete: "off", spellcheck: "false", "aria-label": "labojums" });
      $(".t", li).appendChild(d); $(".t", li).appendChild(inp); ul.appendChild(li);
      rows.push({ li: li, d: d, inp: inp, get: function () { return picked; } });
    });
    return {
      el: ul,
      check: function () { var ok = 0; rows.forEach(function (r, i) { var it = e.items[i]; var hit = r.get() === it.bad; var fixed = r.inp.value ? same(r.inp.value, it.right) : true; var g = hit && fixed; r.li.className = g ? "ok" : "no"; if (hit) $$(".w", r.d)[it.bad].classList.add("hit"); if (g) ok++; }); return [ok, rows.length]; },
      reveal: function () { rows.forEach(function (r, i) { $$(".w", r.d)[e.items[i].bad].classList.add("hit"); if (!$(".fix", r.li)) $(".t", r.li).appendChild(h("span", { class: "fix" }, "✓ " + md(e.items[i].right) + (e.items[i].why ? ' <span class="muted">— ' + md(e.items[i].why) + "</span>" : ""))); }); },
      answers: function () { return rows.map(function (r, i) { return [e.items[i].wrong, r.inp.value, e.items[i].right]; }); }
    };
  };

  EX.listen = function (e, id) {
    var ul = h("ul", { class: "items" }), rows = [];
    e.items.forEach(function (it, i) {
      var li = line(i, ""), w = h("div", { class: "lis" }), inp = h("input", { class: "line", placeholder: "Ieraksti, ko dzirdi…", autocomplete: "off", spellcheck: "false", "aria-label": "diktāts" });
      w.appendChild(sayBtn(it.text, "Klausīties teikumu")); w.appendChild(inp);
      var slow = h("button", { class: "btn ghost sm", type: "button" }, "lēnāk"); slow.addEventListener("click", function () { speak(it.text, null, 0.65); }); w.appendChild(slow);
      $(".t", li).appendChild(w); ul.appendChild(li); rows.push({ li: li, inp: inp });
    });
    return {
      el: ul,
      check: function () { var ok = 0; rows.forEach(function (r, i) { var g = same(r.inp.value, e.items[i].text); r.li.className = g ? "ok" : "no"; if (g) ok++; }); return [ok, rows.length]; },
      reveal: function () { rows.forEach(function (r, i) { if (r.li.className === "no" && !$(".fix", r.li)) $(".t", r.li).appendChild(h("span", { class: "fix" }, "✓ " + md(e.items[i].text))); }); },
      answers: function () { return rows.map(function (r, i) { return ["(diktāts)", r.inp.value, e.items[i].text]; }); }
    };
  };

  EX.write = function (e, id) {
    var w = h("div");
    if (e.prompt) w.appendChild(h("p", {}, md(e.prompt)));
    if (e.checklist) w.appendChild(h("div", { class: "opts", style: "margin-bottom:12px" }, arr(e.checklist).map(function (c) { return '<span class="chip">' + md(c) + "</span>"; }).join("")));
    var ta = h("textarea", { class: "txt", "aria-label": "teksts", placeholder: "Raksti šeit…" });
    var cnt = h("div", { class: "tiny", style: "margin-top:6px" }, "0 vārdi");
    ta.addEventListener("input", function () { var n = (ta.value.match(/[A-Za-z']+/g) || []).length; cnt.textContent = n + " vārdi" + (e.minWords ? " · vajag ≥ " + e.minWords : ""); });
    w.appendChild(ta); w.appendChild(cnt);
    return {
      el: w, ta: ta,
      check: function () { return [0, 0]; },
      reveal: function () { if (e.model && !$(".model", w)) w.appendChild(h("div", { class: "card model", style: "box-shadow:none;background:var(--acc-soft);border:0;margin-top:12px" }, '<div class="kicker">Paraugs</div><p style="margin:6px 0 0">' + arr(e.model).map(md).join(" ") + "</p>")); },
      answers: function () { return [["(teksts)", ta.value, ""]]; }
    };
  };

  var ICON = { gap: "✏️", choice: "👆", truefalse: "⚖️", sort: "🗂️", build: "🧩", match: "🔗", detective: "🔍", listen: "🎧", write: "📝" };
  var NEED = { gap: "Ieraksti trūkstošo vārdu.", choice: "Izvēlies pareizo variantu.", truefalse: "True vai False?", sort: "Pieskaries vārdam, tad grupai.", build: "Saliec teikumu, pieskaroties vārdiem.", match: "Savieno pārus: kreisā puse → labā.", detective: "Pieskaries kļūdainajam vārdam un ieraksti pareizo teikumu.", listen: "Noklausies un ieraksti teikumu.", write: "Uzraksti savu tekstu." };

  function exercise(e, id, hw) {
    var api = EX[e.type](e, id);
    var box = h("article", { class: "ex", id: id });
    box.appendChild(h("div", { class: "ex-h" }, '<span class="ico" aria-hidden="true">' + (ICON[e.type] || "•") + '</span><div><h3>' + md(e.title) + '</h3><div class="ins">' + md(e.instruction || NEED[e.type]) + "</div></div>" + (e.points ? '<span class="sc score">' + e.points + " p.</span>" : "")));
    var body = h("div", { class: "ex-b" }); body.appendChild(api.el); box.appendChild(body);
    // saglabā ievadi
    $$("input,textarea", body).forEach(function (inp, k) {
      var key = id + "#" + k; if (store[key]) inp.value = store[key];
      inp.addEventListener("input", function () { store[key] = inp.value; save(); });
    });
    if (!hw && e.type !== "write") {
      var f = h("div", { class: "ex-f" }), res = h("span", { class: "res" }, "Atbildi un pārbaudi sevi."),
        chk = h("button", { class: "btn", type: "button" }, "Pārbaudīt"), rev = h("button", { class: "btn ghost", type: "button", disabled: "" }, "Rādīt atbildes");
      chk.addEventListener("click", function () {
        var r = api.check(), all = r[0] === r[1];
        res.innerHTML = "<b>" + r[0] + " / " + r[1] + "</b> pareizi";
        rev.removeAttribute("disabled");
        if (all) { box.classList.add("done"); if (!done[id]) { done[id] = 1; store.done = done; addXP(r[1] * 10); confetti(); } coach(rnd(PRAISE), "celebrate"); }
        else { box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); coach(r[0] ? rnd(SOFT) : "Neuztraucies. Paskaties paskaidrojumu un mēģini vēlreiz.", r[0] ? "confused" : "oops"); }
        markNav();
      });
      rev.addEventListener("click", function () { api.reveal(); });
      f.appendChild(res); f.appendChild(rev); f.appendChild(chk); box.appendChild(f);
    }
    if (e.type === "write" && !hw) { var f2 = h("div", { class: "ex-f" }), m = h("button", { class: "btn ghost", type: "button" }, "Parādīt paraugu"); m.addEventListener("click", function () { api.reveal(); }); f2.appendChild(h("span", { class: "res" }, "Brīvs teksts — salīdzini ar paraugu.")); f2.appendChild(m); box.appendChild(f2); }
    box._api = api; box._e = e;
    return box;
  }

  /* =================================================================
     BURTNĪCA
     ================================================================= */
  function flipCard(front, back, opts) {
    opts = opts || {};
    var b = h("button", { class: "flip" + (opts.cls ? " " + opts.cls : ""), type: "button", "aria-label": "Apgriezt kartīti" });
    var fi = h("div", { class: "fi" });
    var fa = h("div", { class: "fa" }, front), fb = h("div", { class: "fb" }, back);
    if (opts.say) { var row = $(".row", fa); (row || fa).appendChild(sayBtn(opts.say)); }
    fi.appendChild(fa); fi.appendChild(fb); b.appendChild(fi);
    b.addEventListener("click", function () { b.classList.toggle("on"); });
    return b;
  }

  function chat(msgs, slide) {
    var c = h("div", { class: "chat" });
    msgs.forEach(function (m, i) {
      var who = m.who || "oscar", me = who !== "oscar" && who !== "note" && who !== "narrator";
      var av = who === "oscar" ? (P.peek ? P.peek : "O") : esc((m.name || who).slice(0, 1).toUpperCase());
      var el = h("div", { class: "msg" + (who === "note" || who === "narrator" ? " note" : me ? " me" : ""), "data-step": slide ? i : null },
        (who === "note" || who === "narrator" ? "" : '<div class="av">' + av + "</div>") + '<div class="bb">' + (who === "note" || who === "narrator" ? "" : '<div class="who">' + esc(m.name || (who === "oscar" ? "Oscar" : who)) + "</div>") + md(m.text) + "</div>");
      if (m.say) $(".bb", el).appendChild(sayBtn(m.text.replace(/\*\*/g, "")));
      c.appendChild(el);
    });
    return c;
  }

  function switcher(sw) {
    var w = h("div", { class: "sw" }), subj = Object.keys(sw.rows), si = 0, mi = 0;
    var modes = sw.modes || ["+", "−", "?"];
    var s1 = h("div", { class: "seg", role: "tablist" }), s2 = h("div", { class: "seg", role: "tablist" });
    var out = h("div", { class: "sw-out", "aria-live": "polite" });
    function draw() {
      var row = sw.rows[subj[si]], s = row[mi], lv = (sw.lv && sw.lv[subj[si]] || [])[mi] || "";
      out.innerHTML = '<div style="flex:1"><div class="s swap">' + md(s) + '</div><div class="lv">' + md(lv) + "</div></div>";
      out.appendChild(sayBtn(s));
      $$("button", s1).forEach(function (b, i) { b.classList.toggle("on", i === si); });
      $$("button", s2).forEach(function (b, i) { b.classList.toggle("on", i === mi); });
    }
    subj.forEach(function (k, i) { var b = h("button", { type: "button" }, esc(k)); b.addEventListener("click", function () { si = i; draw(); }); s1.appendChild(b); });
    modes.forEach(function (k, i) { var b = h("button", { type: "button" }, esc(k)); b.addEventListener("click", function () { mi = i; draw(); }); s2.appendChild(b); });
    var top = h("div", { style: "display:flex;flex-wrap:wrap;gap:10px" }); top.appendChild(s1); top.appendChild(s2);
    w.appendChild(top); w.appendChild(out); draw();
    return w;
  }

  function ruleTable(r) {
    return '<table class="rule-t"><thead><tr>' + arr(r.head).map(function (x) { return "<th>" + md(x) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      arr(r.rows).map(function (row) { return "<tr>" + row.map(function (c) { return "<td>" + md(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
  }

  function quiz(qs) {
    var w = h("div", { class: "card qz" }), i = 0, ok = 0;
    function draw() {
      if (i >= qs.length) {
        var pct = Math.round(ok / qs.length * 100), pose = pct >= 80 ? "celebrate" : pct >= 50 ? "idea" : "confused";
        w.innerHTML = '<div class="end">' + oscar(pose) + '<div class="big">' + ok + "/" + qs.length + '</div><p class="muted">' + (pct >= 80 ? "Izcili! Tēma apgūta — vari ķerties pie mājasdarba." : pct >= 50 ? "Labi! Atkārto kļūdu kartītes un mēģini vēlreiz." : "Nekas. Izlasi likumu vēlreiz — un uz priekšu!") + "</p></div>";
        var again = h("button", { class: "btn ghost", type: "button" }, "Vēlreiz"); again.addEventListener("click", function () { i = 0; ok = 0; draw(); });
        $(".end", w).appendChild(again);
        if (pct >= 80 && !done.quiz) { done.quiz = 1; store.done = done; addXP(50); confetti(); }
        markNav(); return;
      }
      var q = qs[i];
      w.innerHTML = '<div class="bar"><i style="width:' + (i / qs.length * 100) + '%"></i></div><div class="tiny" style="margin-bottom:8px">Jautājums ' + (i + 1) + " no " + qs.length + '</div><div class="q">' + md(q.q) + '</div><div class="ans"></div><div class="why" aria-live="polite"></div>';
      var A = $(".ans", w), locked = false;
      q.options.forEach(function (o, k) {
        var b = h("button", { class: "a", type: "button" }, '<span class="k">' + "ABCD"[k] + "</span>" + md(o));
        b.addEventListener("click", function () {
          if (locked) return; locked = true;
          var g = same(o, q.answer); if (g) ok++;
          b.classList.add(g ? "ok" : "no");
          if (!g) $$(".a", A).forEach(function (x, kk) { if (same(q.options[kk], q.answer)) x.classList.add("ok"); });
          $(".why", w).innerHTML = (g ? "✓ " : "✗ ") + md(q.why || "");
          var n = h("button", { class: "btn", type: "button", style: "margin-top:16px" }, i + 1 < qs.length ? "Tālāk →" : "Rezultāts");
          n.addEventListener("click", function () { i++; draw(); }); w.appendChild(n);
        });
        A.appendChild(b);
      });
    }
    draw(); return w;
  }

  function video(v) {
    var fr = v.youtube && v.verified
      ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.youtube) + '" title="' + esc(v.title) + '" loading="lazy" allow="encrypted-media;picture-in-picture" allowfullscreen></iframe>'
      : '<div class="ph"><div><div class="play">▶</div><a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(v.search || v.title) + '" target="_blank" rel="noopener">Atvērt YouTube: ' + esc(v.search || v.title) + "</a></div></div>";
    return '<div class="vid"><div class="fr">' + fr + '</div><div class="cap"><h3>' + md(v.title) + "</h3><p>" + md(v.lv || "") + "</p>" + (v.url ? '<p style="margin-top:6px"><a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.source || "Avots") + " ↗</a></p>" : "") + "</div></div>";
  }

  var KIND = { fact: "Oskara fakts", tip: "Oskara padoms", story: "Oskars stāsta", joke: "Oskara joks", lesson: "Atceries", news: "Jaunumi no Londonas" };
  function osSay(s) {
    var b = h("div", { class: "say-b" }, '<div class="k">' + esc(s.kicker || KIND[s.kind] || "Oskars saka") + '</div><div class="tx">' + arr(s.text).map(md).join("<br>") + "</div>");
    if (s.en) { var en = h("div", { class: "en" }, "<span>" + md(s.en) + "</span>"); en.insertBefore(sayBtn(s.en), en.firstChild); b.appendChild(en); }
    if (s.lv) b.appendChild(h("div", { class: "lv tiny" }, md(s.lv)));
    return b;
  }
  function osBlock(s, cls) {
    var w = h("div", { class: cls + (s.side === "right" ? " flip-side" : "") });
    w.appendChild(h("div", { class: "big-os" }, oscar(s.pose || "hello")));
    w.appendChild(osSay(s));
    return w;
  }

  var navEl, secs = [];
  function markNav() {
    if (!navEl) return;
    secs.forEach(function (s) {
      var exs = $$(".ex", s.el).filter(function (x) { return !x.closest("#hw") && x._e && x._e.type !== "write"; });
      var ok = exs.length && exs.every(function (x) { return done[x.id]; });
      if (s.type === "quiz") ok = !!done.quiz;
      var a = $('a[href="#' + s.id + '"]', navEl); if (a) a.classList.toggle("done", !!ok);
    });
    var total = $$(".ex").filter(function (x) { return !x.closest("#hw") && x._e.type !== "write"; }).length + 1;
    var dn = Object.keys(done).length;
    var pr = $(".prog i"); if (pr) pr.style.width = Math.min(100, dn / total * 100) + "%";
  }

  function workbook() {
    var W = L.workbook, root = $("#app");
    // augšējā josla
    var top = h("header", { class: "top" });
    top.innerHTML = '<div class="top-in"><div class="logo"><span class="dot">' + esc(M.level) + "</span><span>" + md(M.title_en) + '</span></div><span class="sp"></span><span class="xp" title="Punkti par pareizi izpildītiem uzdevumiem"><i>★</i><b>' + XP + '</b> XP</span><a class="btn sm acc" href="#hw">Mājasdarbs</a></div><div class="prog"><i></i></div>';
    navEl = h("nav", { class: "nav", "aria-label": "Nodaļas" }); top.appendChild(navEl);
    document.body.insertBefore(top, root);
    var wrap = h("main", { class: "wrap" }); root.appendChild(wrap);
    // hero
    var hero = h("section", { class: "hero" });
    hero.innerHTML = '<div><div class="kicker" style="margin-bottom:18px">' + esc(M.course) + " · " + esc(M.level) + (M.lesson ? " · Tēma " + esc(M.lesson) : "") + "</div><h1>" + md(W.title || M.title_en) + '</h1><p class="lead">' + md(W.lead || M.title_lv) + '</p><div class="meta">' +
      arr(W.chips).map(function (c) { return '<span class="chip">' + md(c) + "</span>"; }).join("") + '</div><a class="btn acc" href="#' + "s1" + '">Sākt →</a></div><div class="art">' + oscar(W.pose || "hello") + (W.hello ? '<div class="bub">' + md(W.hello) + "</div>" : "") + "</div>";
    wrap.appendChild(hero);
    var n = 0;
    W.sections.forEach(function (s, si) {
      if (s.type === "oscar") { var ob = h("section", { class: "sec reveal-up" }); ob.appendChild(osBlock(s, "os-block")); wrap.appendChild(ob); return; }
      var id = s.type === "homework" ? "hw" : "s" + (++n);
      var sec = h("section", { class: "sec reveal-up" + (s.type === "homework" ? " hw" : ""), id: id });
      sec.innerHTML = '<div class="sec-h"><div><span class="n">' + (s.type === "homework" ? "MĀJASDARBS" : String(n).padStart(2, "0") + " · " + esc((s.kicker || TYPEN[s.type] || "").toUpperCase())) + "</span><h2>" + md(s.title) + "</h2>" + (s.lead ? "<p>" + md(s.lead) + "</p>" : "") + "</div></div>";
      var body = h("div");
      if (s.type === "story") {
        var c = chat(s.messages); body.appendChild(c);
        if (s.lesson) body.appendChild(h("div", { class: "lesson" }, '<span class="ic">!</span><div>' + md(s.lesson) + "</div>"));
        var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); $$(".msg", c).forEach(function (m, k) { setTimeout(function () { m.classList.add("in"); }, 350 + k * 650); }); } }, { threshold: 0.3 });
        io.observe(c);
      } else if (s.type === "rule") {
        var g = h("div", { class: "grid g2" });
        var left = h("div", { class: "card" }, (s.text ? arr(s.text).map(function (p) { return "<p>" + md(p) + "</p>"; }).join("") : "") + (s.table ? ruleTable(s.table) : "") + (s.note ? '<div class="lesson" style="margin-top:18px"><span class="ic">✦</span><div>' + md(s.note) + "</div></div>" : ""));
        g.appendChild(left);
        if (s.switcher) { var r = h("div", { class: "card" }, '<div class="kicker" style="margin-bottom:14px">' + md(s.switcher.title || "Pamēģini: izvēlies personu un formu") + "</div>"); r.appendChild(switcher(s.switcher)); g.appendChild(r); }
        else g.style.gridTemplateColumns = "1fr";
        body.appendChild(g);
      } else if (s.type === "vocab") {
        var vg = h("div", { class: "grid g4" });
        s.items.forEach(function (v) { vg.appendChild(flipCard('<div class="row"><span class="w">' + md(v.en) + "</span></div>" + '<div class="row"><span class="ipa">' + esc(v.ipa || "") + '</span><span class="tiny">apgriez ↻</span></div>', '<span class="w">' + md(v.lv) + "</span>" + (v.ex ? '<span style="font-size:14px;opacity:.8">' + md(v.ex) + "</span>" : ""), { say: v.en })); });
        body.appendChild(vg);
      } else if (s.type === "practice" || s.type === "homework") {
        var hw = s.type === "homework";
        if (hw) body.appendChild(h("div", { class: "stu" }, '<label>Vārds, uzvārds<input id="hw-name" autocomplete="name"></label><label>Datums<input id="hw-date" type="date"></label>'));
        s.exercises.forEach(function (e, k) { body.appendChild(exercise(e, id + "-" + k, hw)); });
        if (hw) {
          var dl = h("div", { class: "dl" }), b = h("button", { class: "btn acc", type: "button" }, "⤓ Lejupielādēt izpildīto (PDF)");
          b.addEventListener("click", downloadHW); dl.appendChild(b);
          dl.appendChild(h("span", { class: "tiny" }, "Atbildes saglabājas šajā pārlūkā. PDF nosūti skolotājam."));
          body.appendChild(dl);
        }
      } else if (s.type === "facts") {
        var fs = h("div", { class: "facts" });
        s.items.forEach(function (f) { fs.appendChild(h("article", { class: "fact" }, (f.tag ? '<span class="chip acc" style="align-self:flex-start">' + md(f.tag) + "</span>" : "") + (f.big ? '<div class="k">' + md(f.big) + "</div>" : "") + "<h3>" + md(f.title) + "</h3><p>" + md(f.text) + "</p>" + oscar(f.pose || "idea"))); });
        body.appendChild(fs);
      } else if (s.type === "video") {
        body.appendChild(h("div", { class: "grid g2" }, s.items.map(video).join("")));
      } else if (s.type === "mistakes") {
        var mg = h("div", { class: "grid g3" });
        s.items.forEach(function (m) { mg.appendChild(flipCard('<span class="tiny">✗ Kļūda</span><span class="w">' + md(m.wrong) + '</span><span class="tiny">apgriez ↻</span>', '<span class="tiny">✓ Pareizi</span><span class="w">' + md(m.right) + '</span><span class="why">' + md(m.why || "") + "</span>", { cls: "mflip" })); });
        body.appendChild(mg);
      } else if (s.type === "quiz") {
        body.appendChild(quiz(s.items));
      } else if (s.type === "oscar") {
        body.appendChild(osBlock(s, "os-block"));
      } else if (s.type === "text") {
        body.appendChild(h("div", { class: "card" }, arr(s.text).map(function (p) { return "<p>" + md(p) + "</p>"; }).join("")));
      }
      sec.appendChild(body); wrap.appendChild(sec);
      secs.push({ id: id, el: sec, type: s.type });
      var a = h("a", { href: "#" + id }, s.type === "homework" ? "Mājasdarbs" : md(s.nav || s.title)); navEl.appendChild(a);
    });
    // kājene
    wrap.appendChild(h("footer", { class: "foot" }, "<span>" + esc(M.course) + " · " + md(M.title_en) + "</span><span>Avoti: " + arr(M.sources).map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + "</a>"; }).join(" · ") + "</span>"));
    wrap.appendChild(h("div", { id: "rep", class: "rep", "aria-hidden": "true" }));
    // treneris
    coachEl = h("div", { class: "coach", "aria-live": "polite" }, '<div class="bub"></div>' + oscar("peek"));
    document.body.appendChild(coachEl);
    if (innerWidth <= 760) setTimeout(function () { coach(W.hello || "Sveiks! Es esmu Oskars. Sāksim?", "peek"); }, 900);
    // parādīšanās, aktīvā nodaļa
    var ro = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) x.target.classList.add("in"); }); }, { threshold: 0.08 });
    $$(".reveal-up").forEach(function (x) { ro.observe(x); });
    var no = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { $$("a", navEl).forEach(function (a) { a.classList.toggle("cur", a.getAttribute("href") === "#" + x.target.id); }); var c = $("a.cur", navEl); if (c && c.scrollIntoView) navEl.scrollTo({ left: c.offsetLeft - 20, behavior: "smooth" }); } }); }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { no.observe(s.el); });
    // saglabā vārdu/datumu
    ["hw-name", "hw-date"].forEach(function (k) { var e = document.getElementById(k); if (!e) return; if (store[k]) e.value = store[k]; e.addEventListener("input", function () { store[k] = e.value; save(); }); });
    markNav();
  }
  var TYPEN = { story: "Oskara stāsts", rule: "Likums", vocab: "Vārdi", practice: "Prakse", facts: "Fakti par Britāniju", video: "Video", mistakes: "Biežākās kļūdas", quiz: "Pārbaudi sevi", text: "" };

  /* ---------- mājasdarbs → PDF ---------- */
  function downloadHW() {
    var name = ($("#hw-name") || {}).value || "", date = ($("#hw-date") || {}).value || "";
    if (!name.trim()) { coach("Ieraksti savu vārdu — skolotājam jāzina, kurš ir varonis.", "confused"); $("#hw-name").focus(); return; }
    var rep = $("#rep"), tot = 0, ok = 0, html = "";
    $$("#hw .ex").forEach(function (box, k) {
      var e = box._e, api = box._api, rows = api.answers();
      html += '<h3 style="margin:22px 0 8px;font-size:16px">' + (k + 1) + ". " + md(e.title) + "</h3>";
      if (e.type === "write") { html += '<div style="white-space:pre-wrap;border:1px solid #ddd;border-radius:10px;padding:10px 12px;min-height:60px">' + esc(api.ta.value) + "</div>"; return; }
      html += '<table style="width:100%;border-collapse:collapse;font-size:13px">';
      rows.forEach(function (r) {
        var g = r[2] !== "" && same(r[1], r[2]); tot++; if (g) ok++;
        html += '<tr><td style="padding:6px 8px 6px 0;border-top:1px solid #eee">' + md(r[0]) + '</td><td style="padding:6px 0;border-top:1px solid #eee;font-weight:600;color:' + (g ? "#4E8068" : "#D6453D") + '">' + esc(r[1] || "—") + "</td></tr>";
      });
      html += "</table>";
    });
    rep.innerHTML = '<div style="font:13px/1.5 Inter,Arial,sans-serif;color:#16161A;padding:8px"><div style="display:flex;justify-content:space-between;border-bottom:1px solid #ddd;padding-bottom:8px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888"><span>' + esc(M.course) + " · " + esc(M.level) + "</span><span>Mājasdarbs</span></div>" +
      '<h1 style="font-size:28px;margin:16px 0 4px;letter-spacing:-.03em">' + md(M.title_en) + "</h1><p style=\"color:#555;margin:0 0 12px\">" + esc(name) + " · " + esc(date || new Date().toISOString().slice(0, 10)) + '</p><p style="display:inline-block;background:#F2F1EC;border-radius:99px;padding:4px 12px;font-weight:600">Automātiski pārbaudīts: ' + ok + " / " + tot + "</p>" + html + "</div>";
    var file = "majasdarbs-" + M.slug + "-" + name.trim().replace(/\s+/g, "-") + ".pdf";
    function print() { document.body.classList.add("print-rep"); setTimeout(function () { window.print(); document.body.classList.remove("print-rep"); }, 50); }
    var lz = document.getElementById("h2p");
    if (!lz) return print();
    // atsevišķs mazs dokuments (iframe), lai PDF veidojas ātri
    var fr = h("iframe", { "aria-hidden": "true", style: "position:fixed;left:-10000px;top:0;width:820px;height:1200px;border:0" });
    document.body.appendChild(fr);
    var fontCss = (document.querySelector("style") || {}).textContent || "";
    fontCss = fontCss.slice(0, fontCss.indexOf(":root"));
    var d = fr.contentDocument;
    d.open();
    d.write('<!doctype html><html><head><meta charset="utf-8"><style>' + fontCss + "body{margin:0;background:#fff}</style></head><body>" + rep.innerHTML + "</body></html>");
    d.close();
    var timer = setTimeout(function () { fr.remove(); print(); }, 20000);
    try {
      var sc = d.createElement("script"); sc.textContent = lz.textContent; d.head.appendChild(sc);
      fr.contentWindow.html2pdf().set({ margin: 12, filename: file, image: { type: "jpeg", quality: 0.95 }, html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4" }, pagebreak: { mode: ["css", "legacy"] } })
        .from(d.body.firstChild).save()
        .then(function () { clearTimeout(timer); setTimeout(function () { fr.remove(); }, 1000); coach("PDF lejupielādēts! Nosūti to skolotājam.", "celebrate"); confetti(); })
        .catch(function () { clearTimeout(timer); fr.remove(); print(); });
    } catch (er) { clearTimeout(timer); fr.remove(); print(); }
  }

  /* =================================================================
     PREZENTĀCIJA
     ================================================================= */
  function deck() {
    var D = L.deck, stage = h("div", { class: "stage" }), total = D.length, cur = 0;
    document.body.appendChild(stage);
    var notes = h("aside", { class: "notes", "aria-live": "polite" });
    document.body.appendChild(notes);
    var slides = D.map(function (s, i) { var el = slide(s, i + 1, total); stage.appendChild(el); return el; });
    var ui = h("nav", { class: "dui" });
    ui.innerHTML = '<button data-a="prev" aria-label="Atpakaļ">←</button><span class="ct"></span><button data-a="next" aria-label="Uz priekšu">→</button><button data-a="notes">Piezīmes (N)</button><button data-a="ov">Pārskats (O)</button><button data-a="fs">Pilnekrāns (F)</button>';
    document.body.appendChild(ui);
    function fit() { var s = Math.min(innerWidth / 1600, innerHeight / 900) * 0.96; slides.forEach(function (x) { x.style.transform = x.classList.contains("cur") ? "scale(" + s + ")" : "scale(" + s * 0.99 + ") translateX(" + (x._dir || 30) + "px)"; }); stage._s = s; }
    function go(n, back) {
      n = Math.max(0, Math.min(total - 1, n));
      slides.forEach(function (x, i) { x.classList.toggle("cur", i === n); x._dir = i < n ? -30 : 30; });
      cur = n; fit();
      $(".ct", ui).textContent = (n + 1) + " / " + total;
      notes.innerHTML = "<b>Slaids " + (n + 1) + ".</b> " + md(D[n].notes || "—");
      try { history.replaceState(null, "", "#" + (n + 1)); } catch (e) {}
      if (back) $$("[data-step]", slides[n]).forEach(function (x) { x.classList.add("in", "show"); });
      var t = slides[n]._enter; if (t) t();
    }
    function step(dir) {
      var s = slides[cur];
      if (dir > 0) { var nx = $$("[data-step]:not(.in)", s)[0]; if (nx) { nx.classList.add("in", "show"); return; } go(cur + 1); }
      else { var sh = $$("[data-step].in", s); if (sh.length && sh.length < $$("[data-step]", s).length) { sh[sh.length - 1].classList.remove("in", "show"); return; } go(cur - 1, true); }
    }
    ui.addEventListener("click", function (e) {
      var a = e.target.closest("[data-a]"); if (!a) return; a = a.dataset.a;
      if (a === "next") step(1); if (a === "prev") step(-1);
      if (a === "notes") document.body.classList.toggle("shownotes");
      if (a === "ov") overview();
      if (a === "fs") fs();
    });
    function fs() { if (!document.fullscreenElement) { (document.documentElement.requestFullscreen || function () {}).call(document.documentElement); } else document.exitFullscreen(); }
    function overview() {
      document.body.classList.toggle("ov");
      if (document.body.classList.contains("ov")) slides.forEach(function (x) { x.style.transform = ""; });
      else fit();
    }
    slides.forEach(function (x, i) { x.addEventListener("click", function () { if (document.body.classList.contains("ov")) { document.body.classList.remove("ov"); go(i); } }); });
    document.addEventListener("keydown", function (e) {
      if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
      var k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); step(1); }
      else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); step(-1); }
      else if (k === "Home") go(0); else if (k === "End") go(total - 1);
      else if (k === "n" || k === "N") document.body.classList.toggle("shownotes");
      else if (k === "o" || k === "O" || k === "Escape" && document.body.classList.contains("ov")) overview();
      else if (k === "f" || k === "F") fs();
      else if (k === "a" || k === "A") { var r = slides[cur]._answer; if (r) r(); }
    });
    var idle; document.addEventListener("mousemove", function () { document.body.classList.remove("idle"); clearTimeout(idle); idle = setTimeout(function () { document.body.classList.add("idle"); }, 2500); });
    addEventListener("resize", fit);
    var st = 0; addEventListener("touchstart", function (e) { st = e.touches[0].clientX; }, { passive: true });
    addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - st; if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1); });
    addEventListener("hashchange", function () { var n = (parseInt(location.hash.slice(1), 10) || 1) - 1; if (n !== cur) go(n); });
    go((parseInt((location.hash || "").slice(1), 10) || 1) - 1);
  }

  function slide(s, i, total) {
    var t = s.type || "text", el = h("section", { class: "slide s-" + t, "aria-label": "Slaids " + i });
    var hd = (t === "cover" || t === "thanks") ? "" : '<div class="hd"><span>' + esc(M.course) + " · " + md(M.title_en) + "</span><span>" + esc(s.tag || "") + "</span></div>";
    var pad = h("div", { class: "pad" }), os = "";
    function place(pose, css) { return pose && P[pose] ? '<div class="os" style="' + css + '">' + oscar(pose) + "</div>" : ""; }
    if (t === "cover") {
      pad.innerHTML = '<div class="kicker" style="font-size:18px;margin-bottom:28px">' + esc(M.course) + " · " + esc(M.level) + (M.lesson ? " · Tēma " + esc(M.lesson) : "") + "</div><h1>" + md(s.title || M.title_en) + '</h1><div class="sub">' + md(s.subtitle || "") + '</div><p class="lv" style="margin-top:36px">' + md(s.text || "") + "</p>";
      os = '<div class="bg"></div>' + place(s.pose || "hello", "right:120px;bottom:120px;width:360px");
    } else if (t === "agenda") {
      pad.innerHTML = "<h2>" + md(s.title || "Today") + '</h2><ol class="agd">' + arr(s.items).map(function (x, k) { return "<li><i>" + String(k + 1).padStart(2, "0") + "</i>" + md(x) + "</li>"; }).join("") + "</ol>";
      os = place(s.pose || "teacher", "right:90px;bottom:70px;width:170px");
    } else if (t === "section") {
      pad.innerHTML = '<div class="num">' + esc(s.num || "") + "</div><h2>" + md(s.title) + '</h2><div class="sub">' + md(s.text || "") + "</div>";
      os = place(s.pose || "peek", "right:140px;bottom:0;width:260px");
    } else if (t === "big") {
      pad.innerHTML = '<div class="kicker" style="font-size:18px;margin-bottom:24px">' + md(s.kicker || "") + '</div><div class="t">' + md(s.text) + '</div><p class="lv" style="margin-top:28px">' + md(s.lv || "") + "</p>";
      os = place(s.pose, "right:110px;bottom:90px;width:220px");
      if (s.say !== false) { var sb = sayBtn(s.text); sb.style.marginTop = "28px"; pad.appendChild(sb); }
    } else if (t === "text") {
      pad.innerHTML = "<h2>" + md(s.title) + '</h2><div style="max-width:' + (s.pose ? "880px" : "none") + '">' + arr(s.body).map(function (p) { return "<p>" + md(p) + "</p>"; }).join("") + (s.bullets ? "<ul>" + arr(s.bullets).map(function (b) { return "<li>" + md(b) + "</li>"; }).join("") + "</ul>" : "") + "</div>" + (s.note ? '<div class="note-h">✦ ' + md(s.note) + "</div>" : "");
      os = place(s.pose, "right:110px;bottom:100px;width:300px");
    } else if (t === "rule") {
      pad.innerHTML = "<h2>" + md(s.title) + '</h2><div style="max-width:' + (s.pose ? "980px" : "none") + '">' + ruleTable(s) + "</div>" + (s.note ? '<div class="note-h">✦ ' + md(s.note) + "</div>" : "");
      os = place(s.pose, "right:100px;bottom:110px;width:260px");
    } else if (t === "examples") {
      pad.innerHTML = "<h2>" + md(s.title) + '</h2><ul class="exs"></ul><p class="tiny" style="font-size:18px;margin-top:16px">Klikšķis vai → — rāda tulkojumu</p>';
      var ul = $(".exs", pad);
      arr(s.items).forEach(function (x, k) {
        var li = h("li", { "data-step": k }, '<span class="en">' + md(x.en) + '</span><span class="lv">' + md(x.lv || "") + "</span>");
        $(".en", li).appendChild(sayBtn(x.en));
        li.addEventListener("click", function () { li.classList.toggle("show"); li.classList.toggle("in"); });
        ul.appendChild(li);
      });
      os = place(s.pose, "right:90px;top:70px;width:130px");
    } else if (t === "vocab") {
      pad.innerHTML = "<h2>" + md(s.title) + "</h2>";
      var vg = h("div", { class: "vg", style: "--c:" + (s.cols || (arr(s.items).length <= 6 ? 3 : 4)) });
      arr(s.items).forEach(function (v) { vg.appendChild(flipCard('<div class="row"><span class="w">' + md(v.en) + '</span></div><div class="row"><span class="ipa">' + esc(v.ipa || "") + "</span></div>", '<span class="w">' + md(v.lv) + "</span>", { say: v.en })); });
      pad.appendChild(vg);
    } else if (t === "quiz") {
      var q = md(s.question).replace("___", "<u>&nbsp;</u>");
      pad.innerHTML = '<div class="kicker" style="font-size:18px">' + md(s.kicker || "Ātrais tests") + '</div><div class="q">' + q + '</div><div class="qa" style="--c:' + Math.min(arr(s.options).length, 4) + '"></div><p class="lv" style="margin-top:28px;min-height:40px"></p>';
      var qa = $(".qa", pad), lv = $(".lv", pad), u = $("u", pad);
      function ans(k) {
        $$("button", qa).forEach(function (b, kk) { if (kk === s.answer) b.classList.add("ok"); });
        if (k !== undefined && k !== s.answer) $$("button", qa)[k].classList.add("no");
        if (u) u.textContent = s.options[s.answer];
        lv.innerHTML = md(s.why || s.lv || "");
      }
      arr(s.options).forEach(function (o, k) { var b = h("button", { type: "button" }, "<i>" + "ABCD"[k] + "</i>" + md(o)); b.addEventListener("click", function () { ans(k); }); qa.appendChild(b); });
      el._answer = function () { ans(); };
      os = place(s.pose || "confused", "right:100px;top:60px;width:150px");
    } else if (t === "task") {
      pad.innerHTML = '<div style="display:flex;gap:10px;margin-bottom:22px">' + (s.mode ? '<span class="chip acc">' + md(s.mode) + "</span>" : "") + '</div><h2 style="margin-bottom:30px">' + md(s.title) + '</h2><div class="tk"><div><ol class="steps">' + arr(s.steps).map(function (x) { return "<li><span>" + md(x) + "</span></li>"; }).join("") + "</ol>" + (s.box ? '<div class="boxq">' + md(s.box) + "</div>" : "") + "</div></div>";
      if (s.minutes) {
        var tot = s.minutes * 60, left = tot, iv = null;
        var tm = h("div", { class: "timer" }, '<div class="kicker" style="font-size:16px;margin-bottom:12px">Taimeris</div><div class="tm"></div><div class="ring"><i></i></div><div class="row"></div>');
        var bs = h("button", { class: "btn acc", type: "button" }, "▶ Sākt"), br = h("button", { class: "btn ghost", type: "button" }, "↺");
        function draw() { $(".tm", tm).textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); $(".ring i", tm).style.width = (left / tot * 100) + "%"; tm.classList.toggle("done", left <= 0); }
        bs.addEventListener("click", function () { if (iv) { clearInterval(iv); iv = null; bs.textContent = "▶ Turpināt"; return; } bs.textContent = "❚❚ Pauze"; iv = setInterval(function () { left = Math.max(0, left - 1); draw(); if (!left) { clearInterval(iv); iv = null; bs.textContent = "▶ Sākt"; } }, 1000); });
        br.addEventListener("click", function () { clearInterval(iv); iv = null; left = tot; bs.textContent = "▶ Sākt"; draw(); });
        $(".row", tm).appendChild(bs); $(".row", tm).appendChild(br); draw();
        $(".tk", pad).appendChild(tm);
      } else os = place(s.pose || "idea", "right:120px;bottom:100px;width:260px");
    } else if (t === "story") {
      pad.innerHTML = '<div class="kicker" style="font-size:18px;margin-bottom:12px">Oskara stāsts</div><h2 style="margin-bottom:30px">' + md(s.title) + "</h2>";
      var c = chat(s.messages, true); pad.appendChild(c);
      if (s.lesson) { var le = h("div", { class: "lesson", "data-step": arr(s.messages).length }, '<span class="ic">!</span><div>' + md(s.lesson) + "</div>"); le.style.opacity = 0; pad.appendChild(le); var mo = new MutationObserver(function () { le.style.opacity = le.classList.contains("in") ? 1 : 0; }); mo.observe(le, { attributes: true }); le.style.transition = "opacity .4s"; }
      os = place(s.pose, "right:100px;top:60px;width:160px");
    } else if (t === "compare") {
      pad.innerHTML = "<h2>" + md(s.title) + '</h2><div class="cmp">' + [s.left, s.right].map(function (c) { return '<div class="card"><h3>' + md(c.title) + "</h3><ul>" + arr(c.items).map(function (x) { return "<li>" + md(x) + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div>" + (s.note ? '<div class="note-h">✦ ' + md(s.note) + "</div>" : "");
    } else if (t === "switcher") {
      pad.innerHTML = "<h2>" + md(s.title) + "</h2>"; pad.appendChild(switcher(s));
      os = place(s.pose, "right:100px;top:60px;width:150px");
    } else if (t === "build") {
      pad.innerHTML = "<h2>" + md(s.title) + '</h2><p class="lv" style="margin-bottom:28px">' + md(s.lv || "Pieskaries vārdiem pareizā secībā.") + "</p>";
      var e = EX.build({ items: [{ words: s.words, answer: s.answer }] }, "sb" + i), li = $("li", e.el);
      $(".i", li).remove(); pad.appendChild(e.el);
      var row = h("div", { style: "display:flex;gap:12px;margin-top:28px" }), cb = h("button", { class: "btn", type: "button" }, "Pārbaudīt"), rb = h("button", { class: "btn ghost", type: "button" }, "Atbilde (A)");
      cb.style.fontSize = rb.style.fontSize = "22px";
      cb.addEventListener("click", function () { var r = e.check(); if (r[0]) confetti(); });
      rb.addEventListener("click", function () { e.reveal(); }); el._answer = function () { e.reveal(); };
      row.appendChild(cb); row.appendChild(rb); pad.appendChild(row);
      os = place(s.pose || "tangled", "right:100px;bottom:100px;width:200px");
    } else if (t === "picker") {
      pad.innerHTML = "<h2>" + md(s.title) + '</h2><div class="pick"><div class="card"><div class="pq">' + md(s.hint || "Nospied «Griezt»") + '</div></div><div style="display:flex;flex-direction:column;gap:12px"></div></div>';
      var pq = $(".pq", pad), col = $(".pick>div:last-child", pad), used = [];
      var spin = h("button", { class: "btn acc", type: "button", style: "font-size:24px;padding:18px 30px" }, "🎲 Griezt");
      spin.addEventListener("click", function () {
        var pool = arr(s.items).filter(function (x, k) { return used.indexOf(k) < 0; }); if (!pool.length) { used = []; pool = arr(s.items); }
        var n = 0, card = $(".pick .card", pad); card.classList.add("roll");
        var iv = setInterval(function () { pq.innerHTML = md(pool[Math.floor(Math.random() * pool.length)]); if (++n > 14) { clearInterval(iv); card.classList.remove("roll"); var pickd = pool[Math.floor(Math.random() * pool.length)]; used.push(arr(s.items).indexOf(pickd)); pq.innerHTML = md(pickd); pq.appendChild(sayBtn(pickd)); } }, 70);
      });
      col.appendChild(spin); col.appendChild(h("div", { class: "tiny", style: "font-size:16px;max-width:220px" }, md(s.lv || "")));
      os = place(s.pose || "idea", "right:120px;bottom:90px;width:180px");
    } else if (t === "mistakes") {
      pad.innerHTML = "<h2>" + md(s.title || "Typical *mistakes*") + "</h2>";
      var mg = h("div", { class: "vg mg", style: "--c:" + (s.cols || Math.min(3, arr(s.items).length)) });
      arr(s.items).forEach(function (m) { mg.appendChild(flipCard('<span class="tiny">✗ Kļūda</span><span class="w">' + md(m.wrong) + '</span><span class="tiny">klikšķis ↻</span>', '<span class="tiny">✓ Pareizi</span><span class="w">' + md(m.right) + '</span><span class="why">' + md(m.why || "") + "</span>", { cls: "mflip" })); });
      pad.appendChild(mg);
      el._answer = function () { $$(".flip", mg).forEach(function (x) { x.classList.add("on"); }); };
      os = place(s.pose || "oops", "right:90px;top:50px;width:150px");
    } else if (t === "facts") {
      pad.innerHTML = '<div class="kicker" style="font-size:18px;margin-bottom:12px">' + md(s.kicker || "Oscar's Britain") + "</div><h2>" + md(s.title) + "</h2>";
      var fg = h("div", { class: "vg fg", style: "--c:" + Math.min(4, arr(s.items).length) });
      arr(s.items).forEach(function (f) { fg.appendChild(flipCard('<span class="tag">' + md(f.tag || "") + '</span><span class="big">' + md(f.big || "") + '</span><span class="w">' + md(f.title) + "</span>", '<span class="txt">' + md(f.text) + "</span>" + (f.en ? '<span class="en">' + md(f.en) + "</span>" : ""), { cls: "fflip" })); });
      pad.appendChild(fg);
      el._answer = function () { $$(".flip", fg).forEach(function (x) { x.classList.add("on"); }); };
      os = place(s.pose, "right:90px;top:50px;width:140px");
    } else if (t === "oscar") {
      if (s.side === "right") el.classList.add("flip-side");
      var bo = osBlock(s, "x"); pad.appendChild(bo.firstChild); pad.appendChild(bo.firstChild);
    } else if (t === "thanks") {
      pad.innerHTML = "<h1>" + md(s.title || "Thank you!") + '</h1><div class="sub" style="font-family:var(--serif);font-style:italic;font-size:56px;color:var(--acc-ink);margin-top:16px">' + md(s.text || "") + "</div>";
      os = place(s.pose || "celebrate", "right:150px;bottom:120px;width:320px");
    }
    el.innerHTML = hd + os + '<div class="pn">' + String(i).padStart(2, "0") + " / " + String(total).padStart(2, "0") + '</div><div class="pb" style="width:' + (i / total * 100) + '%"></div>';
    el.appendChild(pad);
    return el;
  }

  if (document.body.classList.contains("deck")) deck(); else workbook();
})();
