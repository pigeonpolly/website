/* A1 English Pack — prezentācijas vadība, saglabāšana, testi, druka. Bez bibliotēkām. */
(function () {
  "use strict";
  var KEY = "a1pack:" + location.pathname;
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { store = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

  /* --- ievadīto lauku saglabāšana --- */
  document.querySelectorAll("[data-save]").forEach(function (el) {
    if (el.id in store && !el.value) el.value = store[el.id];
    el.addEventListener("input", function () { store[el.id] = el.value; save(); });
    el.addEventListener("change", function () { store[el.id] = el.value; save(); });
  });

  /* --- textarea → drukas kopija (lai PDF rāda visu tekstu) --- */
  function syncPrint() {
    document.querySelectorAll(".printval").forEach(function (p) {
      var t = document.getElementById(p.dataset.for);
      p.textContent = t ? t.value : "";
    });
  }
  window.addEventListener("beforeprint", syncPrint);

  /* --- testi ar klikšķi --- */
  document.querySelectorAll(".q").forEach(function (q) {
    var fb = q.querySelector(".fb");
    q.querySelectorAll(".opts button").forEach(function (b) {
      b.addEventListener("click", function () {
        var ok = b.dataset.ok === "1";
        b.classList.add(ok ? "ok" : "no");
        if (fb) fb.textContent = ok ? "✓ Pareizi!" : "✗ Gandrīz. Pamēģini vēlreiz.";
        if (ok) { var d = q.querySelector("details"); if (d) d.open = true; }
      });
    });
  });

  /* --- pogas --- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var a = b.dataset.act;
    if (a === "print") { syncPrint(); window.print(); }
    if (a === "clear" && confirm("Notīrīt visas atbildes?")) {
      store = {}; save();
      document.querySelectorAll("[data-save]").forEach(function (el) { el.value = ""; });
    }
    if (deck) {
      if (a === "next") go(cur + 1);
      if (a === "prev") go(cur - 1);
      if (a === "present") present();
      if (a === "reveal") slides[cur].classList.toggle("revealed");
    }
  });

  /* --- prezentācija --- */
  var deck = document.querySelector(".deck");
  if (!deck) return;
  var slides = Array.prototype.slice.call(deck.querySelectorAll(".slide"));
  var cur = Math.max(0, Math.min(slides.length - 1, (parseInt((location.hash || "").replace(/\D/g, ""), 10) || 1) - 1));
  function go(n) {
    cur = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, i) { s.classList.toggle("cur", i === cur); });
    if (document.body.classList.contains("present")) {
      try { history.replaceState(null, "", "#" + (cur + 1)); } catch (e) {}
    } else {
      slides[cur].scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }
  function present() {
    document.body.classList.toggle("present");
    var on = document.body.classList.contains("present");
    if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    if (!on && document.fullscreenElement) document.exitFullscreen();
    go(cur);
  }
  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) document.body.classList.remove("present");
  });
  document.addEventListener("keydown", function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    var k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); go(cur + 1); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); go(cur - 1); }
    else if (k === "Home") go(0);
    else if (k === "End") go(slides.length - 1);
    else if (k === "f" || k === "F") present();
    else if (k === "a" || k === "A") slides[cur].classList.toggle("revealed");
  });
  deck.addEventListener("click", function (e) {
    if (!document.body.classList.contains("present")) {
      var s = e.target.closest(".slide");
      if (s) cur = slides.indexOf(s);
      return;
    }
    var x = e.clientX / window.innerWidth;
    go(x < 0.3 ? cur - 1 : cur + 1);
  });
  if (location.hash) go(cur);
})();
