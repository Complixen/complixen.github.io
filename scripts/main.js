// Complixen — main JS (2026 refresh)
// Theme toggle, header scroll, mobile nav, scroll reveal, forms.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initHeader();
    initNav();
    initScrollReveal();
    initForms();
    initSmoothAnchors();
  });

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Header scroll state ---------- */
  function initHeader() {
    var header = document.getElementById("header");
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle("scrolled", window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var menu = document.getElementById("nav-menu");
    var toggle = document.getElementById("nav-toggle");
    var close = document.getElementById("nav-close");
    if (!menu) return;

    function show() {
      menu.classList.add("show");
      document.body.style.overflow = "hidden";
    }
    function hide() {
      menu.classList.remove("show");
      document.body.style.overflow = "";
    }
    if (toggle) toggle.addEventListener("click", show);
    if (close) close.addEventListener("click", hide);
    menu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) hide();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hide();
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    var els = document.querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("revealed"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Smooth anchor scroll (offset for fixed header) ---------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = this.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var header = document.getElementById("header");
        var offset = (header ? header.offsetHeight : 0) + 16;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
      });
    });
  }

  /* ---------- Forms ---------- */
  function initForms() {
    var newsletter = document.getElementById("newsletter-form");
    if (newsletter) {
      newsletter.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = newsletter.querySelector('input[type="email"]');
        var btn = newsletter.querySelector('button[type="submit"]');
        if (!input || !isEmail(input.value)) {
          notify("Please enter a valid email address.", "error");
          return;
        }
        var original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = "Subscribing…";
        setTimeout(function () {
          newsletter.reset();
          btn.innerHTML = "Subscribed ✓";
          notify("Thanks — you're on the list.", "success");
          setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 2400);
        }, 800);
      });
    }

    document.querySelectorAll(".contact-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var original = btn ? btn.innerHTML : "";
        if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
        setTimeout(function () {
          form.reset();
          if (btn) { btn.innerHTML = "Sent ✓"; }
          notify("Message sent. We'll be in touch shortly.", "success");
          setTimeout(function () { if (btn) { btn.innerHTML = original; btn.disabled = false; } }, 2400);
        }, 900);
      });
    });
  }

  function isEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  /* ---------- Toast ---------- */
  function notify(message, type) {
    document.querySelectorAll(".toast").forEach(function (n) { n.remove(); });
    var t = document.createElement("div");
    t.className = "toast toast--" + (type || "info");
    t.textContent = message;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 300);
    }, 3500);
  }

  // Inject minimal toast styles once
  var s = document.createElement("style");
  s.textContent = ""
    + ".toast{position:fixed;right:1.25rem;bottom:1.25rem;z-index:1000;"
    + "padding:.75rem 1rem;border-radius:10px;border:1px solid var(--border-strong);"
    + "background:var(--surface);color:var(--text);box-shadow:var(--shadow-md);"
    + "font:500 .9rem/1.4 var(--font-sans);max-width:360px;"
    + "transform:translateY(8px);opacity:0;transition:opacity .25s ease,transform .25s ease}"
    + ".toast.show{opacity:1;transform:translateY(0)}"
    + ".toast--success{border-color:color-mix(in oklab,var(--success) 40%,var(--border))}"
    + ".toast--error{border-color:color-mix(in oklab,var(--danger) 50%,var(--border))}";
  document.head.appendChild(s);

  // Public utility
  window.ComplixenUtils = { notify: notify };
})();
