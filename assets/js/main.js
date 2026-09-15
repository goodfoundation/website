(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Scroll reveal ---------------------------------------------------- */

  var revealables = document.querySelectorAll("[data-reveal]");

  revealables.forEach(function (el) {
    var delay = el.getAttribute("data-reveal-delay");
    if (delay) {
      el.style.setProperty("--reveal-delay", delay);
    }
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---- Header shadow on scroll ------------------------------------------ */

  var header = document.querySelector("[data-header]");

  if (header) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;";
    document.body.prepend(sentinel);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        header.classList.toggle("is-stuck", !entries[0].isIntersecting);
      }).observe(sentinel);
    }
  }

  /* ---- Mobile navigation ------------------------------------------------ */

  var toggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      mobileNav.hidden = !open;
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
  }

  /* ---- Active page highlighting ------------------------------------------ */

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll("[data-nav] a, [data-mobile-nav] a")
  );

  var path = window.location.pathname.replace(/\/index\.html$/, "/");
  if (path !== "/") path = path.replace(/\/$/, "");

  navLinks.forEach(function (link) {
    var linkPath = new URL(link.href, window.location.origin).pathname;
    linkPath = linkPath.replace(/\/index\.html$/, "/");
    if (linkPath !== "/") linkPath = linkPath.replace(/\/$/, "");
    link.classList.toggle("is-active", linkPath === path);
  });
})();
