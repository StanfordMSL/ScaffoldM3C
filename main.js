const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Sticky nav: appears after the hero, highlights the current section. */
const nav = document.querySelector(".topnav");
const hero = document.querySelector(".hero");
if (nav && hero) {
  new IntersectionObserver(([entry]) => {
    nav.classList.toggle("is-visible", !entry.isIntersecting);
  }, { threshold: 0.05 }).observe(hero);

  const links = new Map(
    [...nav.querySelectorAll(".topnav__links a")].map((a) => [a.getAttribute("href").slice(1), a]),
  );
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.remove("is-active"));
      links.get(entry.target.id)?.classList.add("is-active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

/* Videos marked data-autoplay play only while on screen. */
const autoVideos = document.querySelectorAll("video[data-autoplay]");
if (reduceMotion) {
  autoVideos.forEach((video) => video.setAttribute("controls", ""));
  document.querySelector(".hero__video")?.pause();
} else {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !target.closest("[hidden]")) {
        target.play().catch(() => {});
      } else {
        target.pause();
      }
    });
  }, { threshold: 0.35 });
  autoVideos.forEach((video) => videoObserver.observe(video));
}

/* Stability clips: replay from the start. */
document.querySelectorAll("[data-clip]").forEach((card) => {
  const video = card.querySelector("video");
  card.querySelector(".clip-card__replay")?.addEventListener("click", () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });
});

/* Hardware tabs. */
document.querySelectorAll("[data-tabs]").forEach((root) => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.querySelectorAll("video").forEach((v) => {
        if (!on) v.pause();
        else if (!reduceMotion) v.play().catch(() => {});
      });
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });
});

/* Lightbox for dense figures. */
const lightbox = document.querySelector(".lightbox");
if (lightbox) {
  const img = lightbox.querySelector("img");
  let opener = null;
  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    opener?.focus();
  };
  document.querySelectorAll("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      opener = button;
      img.src = button.dataset.zoom;
      img.alt = button.querySelector("img")?.alt ?? "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox__close").focus();
    });
  });
  lightbox.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });
}

/* BibTeX copy. */
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = document.querySelector(button.dataset.copy)?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select & copy";
    }
    setTimeout(() => (button.textContent = "Copy"), 1800);
  });
});
