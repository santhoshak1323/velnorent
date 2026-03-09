const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const preloader = document.getElementById("preloader");
const scrollProgress = document.getElementById("scrollProgress");
const navToggler = document.getElementById("navToggler");
const navCollapse = document.getElementById("mainNav");

function updateNavHeight() {
  const navbar = document.querySelector(".custom-navbar");
  if (!navbar) {
    return;
  }
  root.style.setProperty("--nav-height", `${navbar.offsetHeight}px`);
}

// Persist and apply the selected light/dark theme.
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }
}

(function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    setTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
})();

themeToggle?.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme") || "light";
  setTheme(currentTheme === "light" ? "dark" : "light");
});

window.addEventListener("load", () => {
  preloader?.classList.add("fade-out");
  updateNavHeight();
});

window.addEventListener("resize", updateNavHeight, { passive: true });
updateNavHeight();

const counters = document.querySelectorAll(".count-up");

function animateCounter(el) {
  const target = Number.parseInt(el.dataset.target || "0", 10);
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = `${Math.round(progress * target)}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

// Update top progress bar width based on current document scroll.
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgressBar, { passive: true });
updateProgressBar();

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (counters.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const heroVisual = document.getElementById("heroVisual");

if (heroVisual && window.matchMedia("(min-width: 992px)").matches) {
  heroVisual.addEventListener("mousemove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const moveX = (x / rect.width) * 10;
    const moveY = (y / rect.height) * 10;
    heroVisual.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  heroVisual.addEventListener("mouseleave", () => {
    heroVisual.style.transform = "translate(0, 0)";
  });
}

if (navCollapse && navToggler) {
  const bsCollapse = new bootstrap.Collapse(navCollapse, { toggle: false });

  navCollapse.addEventListener("show.bs.collapse", () => {
    navToggler.classList.add("is-open");
  });

  navCollapse.addEventListener("hide.bs.collapse", () => {
    navToggler.classList.remove("is-open");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const isMobileNavOpen = window.getComputedStyle(navToggler).display !== "none" && navCollapse.classList.contains("show");
      if (isMobileNavOpen) {
        bsCollapse.hide();
      }
    });
  });
}

