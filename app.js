// theme
(function () {
  const saved = localStorage.getItem("theme");
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle(
    "dark",
    saved ? saved === "dark" : sysDark,
  );
})();
document.getElementById("theme-toggle").addEventListener("click", () => {
  const r = document.documentElement;
  r.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    r.classList.contains("dark") ? "dark" : "light",
  );
});

document.querySelector("[data-footer-year]").textContent =
  new Date().getFullYear();

const escapeHTML = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const deepGet = (o, p) =>
  p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);

function renderBindings(d) {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const v = deepGet(d, el.getAttribute("data-bind"));
    if (v != null) el.textContent = v;
  });
}

function renderHeroMeta(p) {
  const rows = [
    ["role", p.title],
    ["location", p.location],
    ["email", p.email],
    ["github", "@tanzid64"],
  ];
  document.getElementById("hero-meta").innerHTML = rows
    .map(
      ([k, v]) => `
    <li class="border-t rule pt-2">
      <p class="text-[12px] text-mute dark:text-nightMute"><span class="bk">[~]</span> ${k}</p>
      <p class="text-[14px] text-ink dark:text-nightInk truncate">${escapeHTML(v)}</p>
    </li>
  `,
    )
    .join("");
}

function renderStats(stats) {
  document.getElementById("stats").innerHTML = stats
    .map(
      (s) => `
    <div class="bg-canvas dark:bg-nightBg p-5 themed">
      <div class="text-[36px] md:text-[44px] font-bold leading-none text-primary">${escapeHTML(s.value)}</div>
      <div class="mt-3 text-[13px] text-mute dark:text-nightMute leading-snug">${escapeHTML(s.label)}</div>
    </div>
  `,
    )
    .join("");
}

function renderMarquee(skills) {
  const all = skills.flatMap((g) => g.items);
  const block = all
    .map((s) => `<span><span class="bk">[+]</span> ${escapeHTML(s)}</span>`)
    .join('<span class="text-ash dark:text-nightMute">·</span>');
  document.getElementById("marquee-track").innerHTML =
    block + '<span class="text-ash dark:text-nightMute">·</span>' + block;
}

function renderExperience(jobs) {
  const el = document.getElementById("experience");
  el.innerHTML = jobs
    .map(
      (j, i) => `
    <li class="border-b rule py-7 grid grid-cols-12 gap-4 md:gap-8">
      <div class="col-span-12 md:col-span-3">
        <p class="text-[12px] text-mute dark:text-nightMute">[${String(i + 1).padStart(2, "0")}] ${escapeHTML(j.period)}</p>
        ${
          j.current
            ? `<span class="inline-flex items-center gap-1.5 mt-1 text-[12px] text-primary">
          <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>current
        </span>`
            : ""
        }
      </div>
      <div class="col-span-12 md:col-span-9">
        <h3 class="text-[18px] font-bold text-ink dark:text-nightInk">
          ${escapeHTML(j.role)} <span class="text-mute dark:text-nightMute font-normal">@</span> ${j.href ? `<a href="${escapeHTML(j.href)}" target="_blank" rel="noopener noreferrer" class="text-primary ulink">${escapeHTML(j.company)}</a>` : `<span class="text-primary">${escapeHTML(j.company)}</span>`}
        </h3>
        <p class="mt-1 text-[13px] text-mute dark:text-nightMute">${escapeHTML(j.location)}</p>
        <ul class="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-1.5 text-[14px] text-body dark:text-nightBody">
          ${j.highlights.map((h) => `<li><span class="bk">[+]</span> ${escapeHTML(h)}</li>`).join("")}
        </ul>
      </div>
    </li>
  `,
    )
    .join("");
}

function renderProjectTabs(projects) {
  const cats = [
    "ALL",
    ...new Set(projects.map((p) => p.category.toUpperCase())),
  ];
  const el = document.getElementById("proj-tabs");
  el.innerHTML = cats
    .map(
      (c, i) => `
    <button data-cat="${escapeHTML(c)}" class="proj-tab px-4 py-2 ${i === 0 ? "tab-active" : "text-mute dark:text-nightMute"}">${escapeHTML(c)}</button>
  `,
    )
    .join("");
  el.querySelectorAll(".proj-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      el.querySelectorAll(".proj-tab").forEach((b) =>
        b.classList.remove("tab-active"),
      );
      el.querySelectorAll(".proj-tab").forEach((b) =>
        b.classList.add("text-mute", "dark:text-nightMute"),
      );
      btn.classList.add("tab-active");
      btn.classList.remove("text-mute", "dark:text-nightMute");
      const c = btn.dataset.cat;
      document.querySelectorAll("#projects-list > article").forEach((art) => {
        art.style.display = c === "ALL" || art.dataset.cat === c ? "" : "none";
      });
    });
  });
}

function renderProjects(projects) {
  document.getElementById("projects-list").innerHTML = projects
    .map(
      (p, i) => `
    <article data-cat="${escapeHTML(p.category.toUpperCase())}" class="bg-canvas dark:bg-nightBg p-6 md:p-8 grid grid-cols-12 gap-6 themed">
      <div class="col-span-12 md:col-span-4">
        <p class="text-[12px] text-mute dark:text-nightMute">[${String(i + 1).padStart(2, "0")}] ${escapeHTML(p.category)} · ${escapeHTML(p.year)}</p>
        <h3 class="mt-2 text-[24px] font-bold text-ink dark:text-nightInk leading-tight">${escapeHTML(p.name)}</h3>
        <p class="mt-1 text-[14px] text-mute dark:text-nightMute">${escapeHTML(p.subtitle)}</p>
        <div class="mt-5 flex flex-wrap gap-1.5">
          ${p.stack.map((s) => `<span class="text-[11px] px-2 py-0.5 rounded-sm border rule">${escapeHTML(s)}</span>`).join("")}
        </div>
        <a href="${escapeHTML(p.link)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-6 text-[13px] ulink">
          <span class="bk">$</span> open ${escapeHTML(p.link)} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div class="col-span-12 md:col-span-8 md:border-l rule md:pl-8">
        <p class="text-[12px] text-mute dark:text-nightMute mb-3">README.md</p>
        <ul class="space-y-1.5 text-[14px] text-body dark:text-nightBody">
          ${p.highlights.map((h) => `<li><span class="bk">[+]</span> ${escapeHTML(h)}</li>`).join("")}
        </ul>
      </div>
    </article>
  `,
    )
    .join("");
}

function renderSkills(skills) {
  document.getElementById("skills-grid").innerHTML = skills
    .map(
      (g) => `
    <div class="bg-canvas dark:bg-nightBg p-6 themed">
      <p class="text-[12px] text-primary font-medium mb-3">[~] ${escapeHTML(g.category.toLowerCase())}</p>
      <p class="text-[14px] text-body dark:text-nightBody leading-[1.85]">
        ${g.items.map((it) => escapeHTML(it)).join(' <span class="text-ash dark:text-nightMute">·</span> ')}
      </p>
    </div>
  `,
    )
    .join("");
}

function renderWriting(items) {
  document.getElementById("writing-list").innerHTML = items
    .map(
      (w, i) => `
    <li class="border-b rule py-5 grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-2 text-[12px] text-mute dark:text-nightMute">
        [${String(i + 1).padStart(2, "0")}] ${escapeHTML(w.topic)}
      </div>
      <div class="col-span-12 md:col-span-8">
        <h3 class="text-[16px] font-bold text-ink dark:text-nightInk">${escapeHTML(w.title)}</h3>
        <p class="mt-1.5 text-[14px] text-body dark:text-nightBody">${escapeHTML(w.summary)}</p>
      </div>
      <div class="col-span-12 md:col-span-2 md:text-right">
        <a href="${escapeHTML(w.link)}" target="_blank" rel="noopener" class="text-[13px] ulink">
          read.md <span aria-hidden="true">↗</span>
        </a>
      </div>
    </li>
  `,
    )
    .join("");
}

function renderPrinciples(items) {
  document.getElementById("principles-list").innerHTML = items
    .map(
      (p, i) => `
    <li class="border-b rule py-4">
      <details class="group">
        <summary class="flex items-baseline gap-3 cursor-pointer list-none">
          <span class="bk text-[14px] group-open:hidden">[+]</span>
          <span class="bk text-[14px] hidden group-open:inline">[−]</span>
          <span class="text-[15px] font-medium text-ink dark:text-nightInk">${escapeHTML(p.title)}</span>
          <span class="ml-auto text-[12px] text-mute dark:text-nightMute">[${String(i + 1).padStart(2, "0")}]</span>
        </summary>
        <p class="mt-3 ml-7 text-[14px] text-body dark:text-nightBody max-w-2xl">${escapeHTML(p.body)}</p>
      </details>
    </li>
  `,
    )
    .join("");
}

function renderEducation(d) {
  document.getElementById("education-block").innerHTML = `
    <p class="text-[15px] font-bold text-ink dark:text-nightInk">${escapeHTML(d.education.degree)}</p>
    <p class="text-[13px] text-mute dark:text-nightMute mt-1">${escapeHTML(d.education.school)}</p>
    <p class="text-[13px] text-mute dark:text-nightMute">GPA <span class="text-primary">${escapeHTML(d.education.gpa)}</span></p>
  `;
  document.getElementById("languages-block").innerHTML = d.languages
    .map(
      (l) => `
    <li class="flex items-baseline gap-2"><span class="bk">[+]</span> <span class="text-ink dark:text-nightInk font-medium">${escapeHTML(l.name)}</span> <span class="text-mute dark:text-nightMute">— ${escapeHTML(l.level)}</span></li>
  `,
    )
    .join("");
}

function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );
  document.querySelectorAll("section").forEach((s) => {
    s.classList.add("reveal");

    // Ensure sections already in or near the viewport are visible on first paint.
    const rect = s.getBoundingClientRect();
    const vh =
      window.innerHeight || document.documentElement.clientHeight || 0;
    if (rect.top < vh * 0.92) {
      s.classList.add("in");
      return;
    }

    io.observe(s);
  });
}

function initScrollTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;

  const threshold = 320;
  const toggleVisibility = () => {
    btn.classList.toggle("is-visible", window.scrollY > threshold);
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

initScrollTop();

fetch("data.json")
  .then((r) => r.json())
  .then((data) => {
    renderBindings(data);
    renderHeroMeta(data.profile);
    renderStats(data.stats);
    renderMarquee(data.skills);
    renderExperience(data.experience);
    renderProjectTabs(data.projects);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderWriting(data.writing);
    renderPrinciples(data.principles);
    renderEducation(data);
    initReveal();
  })
  .catch((err) => {
    console.error(err);
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="bg-primary text-canvas p-3 text-center text-sm">Failed to load data.json: ${err.message}</div>`,
    );
  });
