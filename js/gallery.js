/* =========================================================
   ACTIVE GYM — photo gallery
   Works for every <div class="gallery" data-gallery> on the page.
   Arrows, dots, counter, keyboard arrows and swipe on phones.
   ========================================================= */
(function () {
  "use strict";
  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var slides = gallery.querySelectorAll(".gallery-slide");
    var dots = gallery.querySelectorAll(".gallery-dot");
    var current = gallery.querySelector("[data-gallery-current]");
    var total = gallery.querySelector("[data-gallery-total]");
    var index = 0;
    if (!slides.length) return;

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    if (total) total.textContent = pad(slides.length);

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle("is-active", n === index);
        s.setAttribute("aria-hidden", n === index ? "false" : "true");
      });
      dots.forEach(function (d, n) {
        d.classList.toggle("is-active", n === index);
        d.setAttribute("aria-current", n === index ? "true" : "false");
      });
      if (current) current.textContent = pad(index + 1);
    }

    gallery.querySelector("[data-gallery-prev]").addEventListener("click", function () { show(index - 1); });
    gallery.querySelector("[data-gallery-next]").addEventListener("click", function () { show(index + 1); });
    dots.forEach(function (d, n) { d.addEventListener("click", function () { show(n); }); });

    // keyboard: left / right arrows when the gallery is focused
    gallery.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
    });

    // swipe on touch screens
    var startX = null;
    gallery.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    gallery.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    show(0);
  });
})();
