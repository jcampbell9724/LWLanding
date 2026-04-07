const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const revealNodes = document.querySelectorAll(".reveal");
const yearNode = document.getElementById("year");
const currentPage = document.body.dataset.page;
const GOOGLE_SHEETS_ENDPOINT =
  window.LEDGEWAVE_FORM_ENDPOINT || "PASTE_DEPLOYED_GOOGLE_APPS_SCRIPT_URL_HERE";

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
  const formType = form.dataset.formType || form.dataset.captureKey || "capture";
  const successMessage =
    form.dataset.success ||
    "Thanks. Your request has been received.";
  const errorMessage =
    form.dataset.error ||
    "We could not submit the form right now. Please try again in a moment.";
  const isConfiguredEndpoint =
    GOOGLE_SHEETS_ENDPOINT &&
    !GOOGLE_SHEETS_ENDPOINT.includes("PASTE_DEPLOYED_GOOGLE_APPS_SCRIPT_URL_HERE");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isConfiguredEndpoint) {
      if (feedback) {
        feedback.textContent =
          "Form endpoint is not configured yet. Paste the deployed Google Apps Script URL into script.js.";
        feedback.classList.remove("is-success");
      }
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (String(payload.website || "").trim()) {
      form.reset();
      return;
    }

    const submission = {
      form_type: formType,
      submitted_at: new Date().toISOString(),
      ...payload,
      page: currentPage || "unknown",
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("is-success");
    }

    try {
      await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams(submission).toString(),
      });

      if (feedback) {
        feedback.textContent = successMessage;
        feedback.classList.add("is-success");
      }

      if (submitButton) {
        submitButton.textContent = "Sent";
      }

      form.reset();
    } catch (error) {
      if (feedback) {
        feedback.textContent = errorMessage;
        feedback.classList.remove("is-success");
      }
    } finally {
      if (submitButton) {
        window.setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = initialButtonLabel;
        }, 2200);
      }
    }
  });
});
