const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const revealNodes = document.querySelectorAll(".reveal");
const yearNode = document.getElementById("year");
const currentPage = document.body.dataset.page;

const closeMenu = () => {
  if (!header || !navToggle) {
    return;
  }
  header.dataset.open = "false";
  navToggle.setAttribute("aria-expanded", "false");
};

const syncHeaderScroll = () => {
  if (!header) {
    return;
  }
  header.dataset.scrolled = String(window.scrollY > 8);
};

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (currentPage) {
  document.querySelectorAll(".site-nav [data-nav]").forEach((link) => {
    if (link.dataset.nav !== currentPage) {
      return;
    }
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  });
}

if (header && navToggle) {
  header.dataset.open = "false";
  syncHeaderScroll();

  navToggle.addEventListener("click", () => {
    const isOpen = header.dataset.open === "true";
    header.dataset.open = String(!isOpen);
    navToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (header.dataset.open !== "true") {
      return;
    }

    if (header.contains(event.target)) {
      return;
    }

    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("scroll", syncHeaderScroll, { passive: true });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealNodes.forEach((node) => {
    if (!node.classList.contains("is-visible")) {
      observer.observe(node);
    }
  });
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

document.querySelectorAll("[data-capture-form]").forEach((form) => {
  const feedback = form.querySelector("[data-form-feedback]");
  const submitButton = form.querySelector('[type="submit"]');
  const initialButtonLabel = submitButton ? submitButton.textContent : "";
  const storageKey = form.dataset.captureKey || "ledgewaveCaptures";
  const successMessage =
    form.dataset.success ||
    "Thanks. Your request has been saved in this browser for this demo build.";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");

    existing.push({
      ...payload,
      capturedAt: new Date().toISOString(),
      page: currentPage || "unknown",
    });

    localStorage.setItem(storageKey, JSON.stringify(existing));

    if (feedback) {
      feedback.textContent = successMessage;
      feedback.classList.add("is-success");
    }

    if (submitButton) {
      submitButton.textContent = "Saved";
      window.setTimeout(() => {
        submitButton.textContent = initialButtonLabel;
      }, 2200);
    }

    form.reset();
  });
});
