const currentPage = document.body.dataset.page || "index";
const GOOGLE_SHEETS_ENDPOINT =
    window.LEDGEWAVE_FORM_ENDPOINT || "https://script.google.com/macros/s/AKfycbzoNHNpZUjf8F6gyuYp10z3_Q_7h3wpaeJ5pAQPSY2OUGIJKzwR6g46rnxxRFHlFBaP/exec";

const PRIMARY_NAV = [
  { href: "platform.html", key: "platform", label: "Platform" },
  { href: "solutions.html", key: "solutions", label: "Solutions" },
  { href: "integrations.html", key: "integrations", label: "Integrations" },
  { href: "operations.html", key: "operations", label: "Operations" },
  { href: "pricing.html", key: "pricing", label: "Pricing" },
  { href: "resources.html", key: "resources", label: "Resources" },
];

const getSitePrefix = () => {
  const stylesheet = document.querySelector('link[rel="stylesheet"][href$="styles.css"]');
  const stylesheetHref = stylesheet?.getAttribute("href") || "";
  return stylesheetHref.startsWith("../") ? "../" : "";
};

const sitePrefix = getSitePrefix();
const buildHref = (path) => `${sitePrefix}${path}`;

const renderIntoHost = ({ hostSelector, fallbackSelector, markup }) => {
  const host = document.querySelector(hostSelector);
  if (host) {
    host.innerHTML = markup;
    return host.firstElementChild;
  }

  const existingNode = document.querySelector(fallbackSelector);
  if (existingNode) {
    existingNode.outerHTML = markup;
    return document.querySelector(fallbackSelector);
  }

  return null;
};

const renderNavLinks = () =>
  PRIMARY_NAV.map(({ href, key, label }) => {
    const state = key === currentPage ? ' class="is-active" aria-current="page"' : "";
    return `<a href="${buildHref(href)}" data-nav="${key}"${state}>${label}</a>`;
  }).join("");

const renderSharedChrome = () => {
  const demoState = currentPage === "demo" ? ' aria-current="page"' : "";

  renderIntoHost({
    hostSelector: "[data-site-header]",
    fallbackSelector: ".site-header",
    markup: `
      <header class="site-header" id="top">
        <div class="site-header-inner">
          <a class="brand" href="${buildHref("index.html")}" aria-label="Ledgewave home">
            <img src="${buildHref("assets/images/ledgewave-mark.svg")}" alt="" width="44" height="44">
            <span class="brand-copy">
              <strong>Ledgewave</strong>
              <span>Receivables OS</span>
            </span>
          </a>

          <button
            class="nav-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="site-nav"
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
          </button>

          <nav class="site-nav" id="site-nav" aria-label="Primary">
            ${renderNavLinks()}
          </nav>

          <a class="btn btn-primary nav-cta" href="${buildHref("demo.html")}"${demoState}>Request a Demo</a>
        </div>
      </header>
    `.trim(),
  });

  renderIntoHost({
    hostSelector: "[data-site-footer]",
    fallbackSelector: ".site-footer",
    markup: `
      <footer class="site-footer">
        <div class="site-footer-inner">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-brand-top">
                <img src="${buildHref("assets/images/ledgewave-mark.svg")}" alt="" width="40" height="40">
                <span class="footer-brand-copy">
                  <strong>Ledgewave</strong>
                  <span>Collections automation and forecast visibility for modern finance teams.</span>
                </span>
              </div>
              <p class="footer-note">
                Built for finance organizations replacing exported receivables files, spreadsheet trackers, and disconnected
                follow-up work with a more disciplined operating system.
              </p>
            </div>

            <div class="footer-links">
              <strong>Product</strong>
              <a href="${buildHref("platform.html")}">Platform</a>
              <a href="${buildHref("solutions.html")}">Solutions</a>
              <a href="${buildHref("integrations.html")}">Integrations</a>
              <a href="${buildHref("operations.html")}">Operations</a>
              <a href="${buildHref("pricing.html")}">Pricing</a>
            </div>

            <div class="footer-links">
              <strong>Learn</strong>
              <a href="${buildHref("resources.html")}">Resources</a>
              <a href="${buildHref("customers.html")}">Customers</a>
              <a href="${buildHref("blog/index.html")}">Blog</a>
              <a href="${buildHref("why-ledgewave.html")}">Why Ledgewave</a>
              <a href="${buildHref("demo.html")}">Request a Demo</a>
            </div>

            <div class="footer-links">
              <strong>Company</strong>
              <a href="${buildHref("index.html")}">Home</a>
              <a href="${buildHref("about.html")}">About</a>
              <a href="${buildHref("contact.html")}">Contact</a>
              <a href="${buildHref("security.html")}">Security</a>
            </div>

            <div class="footer-links">
              <strong>Legal</strong>
              <a href="${buildHref("privacy.html")}">Privacy Policy</a>
              <a href="${buildHref("terms.html")}">Website Terms</a>
              <a href="${buildHref("terms-of-service.html")}">Terms of Service</a>
              <a href="#top">Back to top</a>
            </div>
          </div>

          <div class="footer-meta">
            <span>&copy; <span id="year"></span> Ledgewave. Collections automation and cash forecasting software.</span>
            <span>Designed for operators, controllers, and finance teams who need one receivables command layer.</span>
          </div>
        </div>
      </footer>
    `.trim(),
  });

  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
};

const initializeNavigation = () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".site-nav a");

  if (!header || !navToggle) {
    return;
  }

  const closeMenu = () => {
    header.dataset.open = "false";
    navToggle.setAttribute("aria-expanded", "false");
  };

  const syncHeaderScroll = () => {
    header.dataset.scrolled = String(window.scrollY > 8);
  };

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
    if (header.dataset.open !== "true" || header.contains(event.target)) {
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
};

const initializeCaptureForms = () => {
  const isConfiguredEndpoint =
    GOOGLE_SHEETS_ENDPOINT &&
    !GOOGLE_SHEETS_ENDPOINT.includes("PASTE_DEPLOYED_GOOGLE_APPS_SCRIPT_URL_HERE");

  document.querySelectorAll("[data-capture-form]").forEach((form) => {
    const feedback = form.querySelector("[data-form-feedback]");
    const submitButton = form.querySelector('[type="submit"]');
    const initialButtonLabel = submitButton ? submitButton.textContent : "";
    const formType = form.dataset.formType || form.dataset.captureKey || "capture";
    const successMessage =
      form.dataset.success || "Thanks. Your request has been received.";
    const errorMessage =
      form.dataset.error ||
      "We could not submit the form right now. Please try again in a moment.";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!isConfiguredEndpoint) {
        if (feedback) {
          feedback.textContent =
            "Form endpoint is not configured yet. Paste the deployed Google Apps Script URL into assets/js/script.js.";
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
};

const initializeRevealTransitions = () => {
  const revealNodes = Array.from(document.querySelectorAll(".reveal"));

  if (!revealNodes.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

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
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealNodes.forEach((node, index) => {
    node.style.setProperty("--reveal-delay", `${Math.min(index * 45, 220)}ms`);

    if (node.classList.contains("is-visible")) {
      return;
    }

    observer.observe(node);
  });
};

renderSharedChrome();
initializeNavigation();
initializeCaptureForms();
initializeRevealTransitions();
