// Complixen — home page JS (2026 refresh)
// The new hero uses CSS-only animation. This file intentionally minimal.
// Kept as a stable entry point in case page-specific behavior is added later.

(function () {
  "use strict";
  // Disable orb animation entirely if user prefers reduced motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".orb__rings, .orb__dot").forEach(function (el) {
      el.style.animation = "none";
    });
  }
})();
