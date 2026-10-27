/* =========================================================
   ACTIVE — site interactions
   - smooth fade transitions between pages
   - header that hides on scroll down, shows on scroll up
   - mobile menu
   - scroll reveal animations
   - photo placeholders until real photos are added
   - number counters, FAQ accordion, "open now" status,
     today's opening hours, contact form (SK / EN messages)
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Page load / page transitions ---------- */
  function revealPage() {
    document.body.classList.remove("is-leaving");
    requestAnimationFrame(function () {
      document.body.classList.add("is-loaded");
    });
  }
  window.addEventListener("pageshow", revealPage); // also fires when using the browser Back button
  if (document.readyState !== "loading") revealPage();

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href");
    if (
      !href ||
      href.charAt(0) === "#" ||
      link.target === "_blank" ||
      link.hasAttribute("download") ||
      /^(mailto:|tel:|https?:)/i.test(href) ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) return;

    e.preventDefault();
    document.body.classList.remove("menu-open");
    document.body.classList.add("is-leaving");
    setTimeout(function () { window.location.href = href; }, reduceMotion ? 0 : 450);
  });

  /* ---------- Photo slots ---------- */
  document.querySelectorAll(".media img").forEach(function (img) {
    function missing() { img.classList.add("is-missing"); }
    if (img.complete && img.naturalWidth === 0) missing();
    img.addEventListener("error", missing);
  });

  /* ---------- Header behaviour ---------- */
  var header = document.querySelector(".site-header");
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (!header) return;
    header.classList.toggle("is-scrolled", y > 40);
    var goingDown = y > lastY && y > 300;
    header.classList.toggle("is-hidden", goingDown && !document.body.classList.contains("menu-open"));
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") document.body.classList.remove("menu-open");
  });

  /* ---------- Scroll reveal ---------- */
  // Legal pages: text blocks stay hidden until the first scroll, then fade in one by one
  var legalEls = document.querySelectorAll(".legal-wrap > p, .legal-section > *");
  legalEls.forEach(function (el) { el.classList.add("reveal", "reveal-legal"); });

  var revealEls = document.querySelectorAll(".reveal, .reveal-img");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      var step = 0;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("reveal-legal")) {
            entry.target.style.setProperty("--delay", (step++ * 150) + "ms");
          }
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) {
      if (!el.classList.contains("reveal-legal")) io.observe(el);
    });

    var observeLegal = function () {
      window.removeEventListener("scroll", observeLegal);
      legalEls.forEach(function (el) { io.observe(el); });
    };
    if (window.scrollY > 0) observeLegal();
    else window.addEventListener("scroll", observeLegal, { passive: true });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Number counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var duration = 1800;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased).toLocaleString("sk-SK");
      if (p < 1) requestAnimationFrame(frame);
    }
    if (reduceMotion) el.textContent = target.toLocaleString("sk-SK");
    else requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var isOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item.is-open").forEach(function (o) {
        o.classList.remove("is-open");
        o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Language ----------
     Slovak pages are in the main folder, English pages in /en/.
     The SK / EN links in the header point to the same page in the
     other language. */
  var lang = document.documentElement.lang || "sk";
  var T = {
    sk: { open: "Teraz otvorené", closed: "Teraz zatvorené", sent: "Ďakujeme! Ozveme sa vám do 24 hodín." },
    en: { open: "Open now", closed: "Closed now", sent: "Thank you! We will get back to you within 24 hours." }
  }[lang] || {};

  /* ---------- Opening hours: daily 5:00 – 20:30 ----------
     Change OPEN_FROM / OPEN_TO (minutes after midnight) if hours change. */
  var OPEN_FROM = 5 * 60;        // 5:00
  var OPEN_TO = 20 * 60 + 30;    // 20:30
  function updateOpenStatus() {
    // Use Slovak time, wherever the visitor is
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Bratislava", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var h = 0, m = 0;
    parts.forEach(function (p) {
      if (p.type === "hour") h = parseInt(p.value, 10) % 24;
      if (p.type === "minute") m = parseInt(p.value, 10);
    });
    var now = h * 60 + m;
    var isOpen = now >= OPEN_FROM && now < OPEN_TO;
    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      el.textContent = isOpen ? T.open : T.closed;
      el.classList.toggle("is-open", isOpen);
      el.classList.toggle("is-closed", !isOpen);
    });
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  /* ---------- Highlight today's opening hours ---------- */
  var todayRow = document.querySelector('.hours tr[data-day="' + (new Date().getDay() || 7) + '"]');
  if (todayRow) todayRow.classList.add("is-today");

  /* ---------- Contact form (demo) ----------
     To receive real emails, sign up at formspree.io (free),
     put your form URL in the form's action="" attribute,
     and delete the data-demo attribute from the <form>. */
  var form = document.querySelector("form[data-demo]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      status.textContent = T.sent;
      status.classList.add("is-shown");
      form.reset();
    });
  }

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
