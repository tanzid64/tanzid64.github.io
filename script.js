const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.07, rootMargin: "0px 0px -36px 0px" },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
setTimeout(() => {
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight)
      el.classList.add("visible");
  });
}, 50);
