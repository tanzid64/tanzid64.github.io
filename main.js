/* ══════════════════════════════════════════
   Tanzid Haque Portfolio — main.js
   ══════════════════════════════════════════ */

/* ── Theme toggle ─────────────────────────── */
(function () {
  const STORAGE_KEY = "tz-theme";
  const root = document.documentElement;

  // Persist preference across page loads
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // On load: check localStorage, else respect OS preference
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    applyTheme(stored);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  // Wire up button after DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const current = root.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  });
})();

/* ── Scroll reveal ────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.07, rootMargin: "0px 0px -36px 0px" },
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });

  // Immediately reveal elements already in viewport on load
  setTimeout(function () {
    document.querySelectorAll(".reveal").forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("visible");
      }
    });
  }, 50);
});
