document.getElementById("theme-toggle").addEventListener("click", () => {
  const dark = document.documentElement.classList.toggle("dark");
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
});
document.getElementById("year").textContent = new Date().getFullYear();

// mobile menu
const nav = document.querySelector(".nav");
const menuBtn = document.getElementById("menu-btn");
const setMenu = (open) => {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
document.getElementById("nav-links").addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// highlight the nav link of the section in view
const heroBand = document.querySelector(".hero-band");
if (heroBand) {
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.setAttribute("aria-current", a.hash === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach((a) => { const s = a.hash && document.querySelector(a.hash); if (s) spy.observe(s); });
  spy.observe(heroBand); // no id, so it clears the highlight at the top
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const deepGet = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
const pad = (i) => String(i + 1).padStart(2, "0");
const host = (url) => new URL(url).hostname.replace(/^www\./, "");
const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
const pastel = (i) => `var(--p${(i % 5) + 1})`;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const HOME_PROJECTS = 4;
const gallery = (p) => (p.gallery && p.gallery.length ? p.gallery : [p.image]);
// projects without a public site (private client work) get no outbound link
const linkWrap = (p, cls, inner) => p.link
  ? `<a class="${cls}" href="${esc(p.link)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">${inner}</a>`
  : `<div class="${cls}">${inner}</div>`;
const LOCK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const visit = (p) => p.link
  ? `<a class="visit" href="${esc(p.link)}" target="_blank" rel="noopener">Visit ${esc(host(p.link))} <i aria-hidden="true">↗</i></a>`
  : `<span class="visit private"><i>${LOCK}</i>Private client project</span>`;

const svg = (d) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const SERVICE_ICONS = [
  '<path d="M12 3 3 7.5l9 4.5 9-4.5L12 3z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>', // layers: ERP
  '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01M8 13h8M8 16h5"/>', // app window: SaaS
  '<path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/>', // cart
  '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-5"/><path d="M8 18h.01M16 18h.01"/>', // gauge: performance
];
const STEP_ICONS = [
  '<path d="M4 7h16M4 12h10M4 17h7"/><path d="m16 15 2 2 3-4"/>',
  '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  '<path d="M5 12h12M13 6l6 6-6 6"/>',
  '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/><circle cx="12" cy="12" r="3"/>',
];

// first `n` points visible, the rest folded into a <details>
const points = (items, n = 3) => {
  const li = (h) => `<li>${esc(h)}</li>`;
  const rest = items.slice(n);
  return `<ul class="points">${items.slice(0, n).map(li).join("")}</ul>` +
    (rest.length ? `<details class="more"><summary>${rest.length} more</summary><ul class="points">${rest.map(li).join("")}</ul></details>` : "");
};

function render(d) {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const v = deepGet(d, el.dataset.bind);
    if (v != null) el.textContent = v;
  });

  const mail = `mailto:${d.profile.email}`;
  document.querySelectorAll("#mail-btn, #mail-link, #foot-mail").forEach((el) => (el.href = mail));
  document.querySelectorAll("#mail-link, #foot-mail").forEach((el) => (el.textContent = d.profile.email));

  set("services-list", d.services.map((s, i) => `
    <div class="service" style="background:${pastel(i)}">
      <span class="ico">${svg(SERVICE_ICONS[i % SERVICE_ICONS.length])}</span>
      <div><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>
    </div>`).join(""));

  // "Data Limited (Savoy Icecream Factory Ltd)" -> ["Data Limited", "Savoy Icecream Factory Ltd"]
  const coParts = (c) => { const m = c.match(/^(.*?)\s*\((.*)\)$/); return m ? [m[1], m[2]] : [c, ""]; };
  const period = (p) => p.replace(" — ", " – ");

  set("job-tabs", d.experience.map((j, i) => `
    <button class="job-tab" role="tab" type="button" id="job-tab-${i}" aria-controls="job-panel" aria-selected="false" data-i="${i}">
      <span class="n">${pad(i)}</span>
      <b>${esc(coParts(j.company)[0])}</b>
      <small>${esc(j.role)} · ${esc(period(j.period).replace(/ \d{4}/g, (y) => " '" + y.slice(-2)))}</small>
    </button>`).join(""));

  const showJob = (i) => {
    const j = d.experience[i];
    const [co, parent] = coParts(j.company);
    document.querySelectorAll(".job-tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.i == i));
    const panel = document.getElementById("job-panel");
    panel.setAttribute("aria-labelledby", `job-tab-${i}`);
    panel.innerHTML = `
      <article class="job-card" style="background:${pastel(i + 1)}">
        <div class="job-top">
          <span class="chip-date">${esc(period(j.period))}</span>
          ${j.current ? `<span class="chip-now"><span class="dot"></span>Current role</span>` : ""}
        </div>
        <h3>${esc(j.role)}</h3>
        <p class="job-co">${j.href ? `<a href="${esc(j.href)}" target="_blank" rel="noopener">${esc(co)} ↗</a>` : esc(co)}
          ${parent ? `<small>(${esc(parent)})</small>` : ""} · <small>${esc(j.location)}</small></p>
        <ul class="points">${j.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
      </article>`;
  };
  const jobTabs = document.getElementById("job-tabs");
  if (jobTabs) {
    jobTabs.addEventListener("click", (e) => {
      const t = e.target.closest(".job-tab");
      if (t) showJob(+t.dataset.i);
    });
    showJob(0);
  }

  set("edu", `<p class="label">Education</p><b>${esc(d.education.degree)}</b>${esc(d.education.school)} · GPA ${esc(d.education.gpa)}<br>${d.languages.map((l) => `${esc(l.name)} (${esc(l.level)})`).join(" · ")}`);

  set("stats", d.stats.map((s) => `<div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join(""));

  set("projects-list", d.projects.slice(0, HOME_PROJECTS).map((p, i) => `
    <article class="project">
      ${linkWrap(p, "shot", `<img src="${esc(p.image)}" alt="" width="1200" height="625" loading="lazy" />`)}
      <p class="meta">${pad(i)} · ${esc(p.year)}</p>
      <h3>${esc(p.name)}</h3>
      <p class="sub">${esc(p.subtitle)}</p>
      <div class="tags">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
      <div class="links">
        ${visit(p)}
        <details class="more"><summary>What I built</summary>${points(p.highlights, 99)}</details>
      </div>
    </article>`).join(""));

  const allRows = document.getElementById("all-projects");
  if (allRows) allRows.addEventListener("click", (e) => {
    const t = e.target.closest(".thumb");
    if (!t) return;
    const media = t.closest(".media"), main = media.querySelector(".shot-main img");
    main.src = t.dataset.src;
    main.alt = t.dataset.alt;
    media.querySelectorAll(".thumb").forEach((b) => b.setAttribute("aria-pressed", b === t));
  });
  set("project-count", `${d.projects.length} projects · ${[...new Set(d.projects.map((p) => p.year))].join(", ")}`);
  set("all-projects", d.projects.map((p, i) => `
    <article class="row" id="${esc(slug(p.name))}">
      <div class="media" style="background:${pastel(i)}">
        ${linkWrap(p, "shot-main", `<img src="${esc(gallery(p)[0])}" alt="${esc(p.name)} ${p.link ? "screenshot" : "illustration"} 1" width="1200" height="625" loading="${i < 2 ? "eager" : "lazy"}" />`)}
        ${gallery(p).length > 1 ? `<div class="thumbs" aria-label="${esc(p.name)} screenshots">
          ${gallery(p).map((src, k) => `<button type="button" class="thumb" aria-pressed="${k === 0}" aria-label="Show screenshot ${k + 1}" data-src="${esc(src)}" data-alt="${esc(p.name)} screenshot ${k + 1}">
            <img src="${esc(src)}" alt="" width="1200" height="625" loading="lazy" />
          </button>`).join("")}
        </div>` : ""}
      </div>
      <div class="row-body">
        <p class="meta">${pad(i)} · ${esc(p.year)} · ${esc(p.category)}</p>
        <h2>${esc(p.name)}</h2>
        <p class="sub">${esc(p.subtitle)}</p>
        ${visit(p)}
        <h3 class="row-label">What I built</h3>
        <ul class="points">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
        <h3 class="row-label">Tech stack</h3>
        <div class="tags">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
      </div>
    </article>`).join(""));

  set("principles-list", d.principles.map((p, i) => `
    <li style="background:${pastel(i + 1)}">
      <span class="n">${pad(i)}.</span>
      <span class="ico">${svg(STEP_ICONS[i % STEP_ICONS.length])}</span>
      <h3>${esc(p.title)}</h3><p>${esc(p.body)}</p>
    </li>`).join(""));

  const tools = d.skills.flatMap((g) => g.items)
    .map((t) => `<span>${esc(t)}<svg><use href="#ast"/></svg></span>`).join("");
  set("marquee-track", tools + tools); // doubled so the loop is seamless

  set("writing-list", d.writing.map((w) => `
    <a class="post" href="${esc(w.link)}" target="_blank" rel="noopener">
      <span class="topic">${esc(w.topic)}</span>
      <h3>${esc(w.title)}</h3>
      <p>${esc(w.summary)}</p>
      <span class="visit">Read on Medium <i aria-hidden="true">↗</i></span>
    </a>`).join(""));
}

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

// fade-up on scroll, staggered among siblings
function initReveal() {
  if (calm) return;
  const targets = document.querySelectorAll(
    ".head, .page-head > :not(.doodle), .row, .service, .job-side, #job-panel, .project, .steps li, .tools-title, .post, .contact > :not(.doodle), .foot-top > *"
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("in");
      // drop the reveal classes afterwards so hover transforms work normally
      const done = (ev) => {
        if (ev.target !== el || ev.propertyName !== "opacity") return; // ignore child and underline transitions
        el.classList.remove("reveal", "in");
        el.removeEventListener("transitionend", done);
      };
      el.addEventListener("transitionend", done);
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  targets.forEach((el) => {
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", `${(i % 4) * 90}ms`);
    el.classList.add("reveal");
    io.observe(el);
  });
}

// count stats up from 0 when the card scrolls into view ("100k+" -> 0k+ ... 100k+)
function initCountUp() {
  const items = [...document.querySelectorAll("#stats dt")];
  if (calm || !items.length) return;
  const parsed = items.map((el) => { const m = el.textContent.match(/^(\d+)(.*)$/); return m && { el, n: +m[1], rest: m[2] }; }).filter(Boolean);
  parsed.forEach((p) => (p.el.textContent = "0" + p.rest));
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - k, 3);
      parsed.forEach((p) => (p.el.textContent = Math.round(p.n * ease) + p.rest));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.4 });
  io.observe(document.getElementById("stats"));
}

fetch("data.json")
  .then((r) => r.json())
  .then((d) => { render(d); initReveal(); initCountUp(); })
  .catch((err) => {
    console.error(err);
    document.body.insertAdjacentHTML("afterbegin", `<p style="padding:12px;text-align:center">Failed to load data.json: ${esc(err.message)}</p>`);
  });
