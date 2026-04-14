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
const imageProbeCache = new Map();

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
                  <span>Receivables workflow and forecast visibility for modern finance teams.</span>
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
            <span>&copy; <span id="year"></span> Ledgewave. Receivables workflow and cash forecasting software.</span>
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

const normalizeAssetPath = (assetPath = "") => {
  const trimmed = assetPath.trim();

  if (!trimmed) {
    return "";
  }

  if (/^(?:https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  return trimmed
    .replace(/^\.\/+/, "")
    .replace(/^\/+/, "");
};

const resolvePlaceholderAssetHref = (assetPath) => {
  const normalizedPath = normalizeAssetPath(assetPath);

  if (!normalizedPath) {
    return "";
  }

  if (
    /^(?:https?:)?\/\//i.test(normalizedPath) ||
    normalizedPath.startsWith("data:") ||
    normalizedPath.startsWith("../")
  ) {
    return normalizedPath;
  }

  return buildHref(normalizedPath);
};

const probeImageAvailability = (src) => {
  if (!src) {
    return Promise.resolve(false);
  }

  if (imageProbeCache.has(src)) {
    return imageProbeCache.get(src);
  }

  const probe = new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });

  imageProbeCache.set(src, probe);
  return probe;
};

const cleanPlaceholderCopy = (value = "") =>
  value
    .replace(/^placeholder for\s+/i, "")
    .replace(/\s+placeholder$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const derivePlaceholderTitle = (figure) => {
  const title =
    figure.dataset.imageTitle ||
    figure.querySelector(".image-placeholder-title")?.textContent ||
    "";

  return cleanPlaceholderCopy(title)
    .replace(/^[A-Z]\d+(?:-\d+)?\s+/, "")
    .trim();
};

const derivePlaceholderAlt = (figure) => {
  const explicitAlt = cleanPlaceholderCopy(figure.dataset.imageAlt || "");
  if (explicitAlt) {
    return explicitAlt;
  }

  const frameLabel = cleanPlaceholderCopy(
    figure.querySelector(".image-placeholder-frame")?.getAttribute("aria-label") || ""
  );
  if (frameLabel) {
    return frameLabel.charAt(0).toUpperCase() + frameLabel.slice(1);
  }

  const cleanedTitle = derivePlaceholderTitle(figure);

  return cleanedTitle || "Ledgewave product image";
};

const deriveFallbackTitle = (figure) => {
  const title = derivePlaceholderTitle(figure);
  const normalizedTitle = title.toLowerCase();
  const isGenericTitle = normalizedTitle === "cover image" || normalizedTitle === "article cover" || normalizedTitle === "featured article cover";

  if (title && !isGenericTitle) {
    return title;
  }

  const nearbyHeading = cleanPlaceholderCopy(
    figure.closest("article, aside, section, main")?.querySelector("h1, h2, h3")?.textContent || ""
  );
  if (nearbyHeading) {
    return nearbyHeading;
  }

  if (figure.classList.contains("image-placeholder--logo")) {
    return "Connected finance systems";
  }

  if (figure.classList.contains("image-placeholder--hero")) {
    return "Ledgewave platform";
  }

  if (sitePrefix === "../") {
    return "Ledgewave Insights";
  }

  return "Collections intelligence";
};

const deriveFallbackEyebrow = (figure, assetPath = "") => {
  const normalizedAssetPath = assetPath.toLowerCase();

  if (
    figure.classList.contains("image-placeholder--logo") ||
    normalizedAssetPath.includes("logos-")
  ) {
    return "Integrations";
  }

  if (normalizedAssetPath.includes("blog-cover") || sitePrefix === "../") {
    return "Insights";
  }

  if (normalizedAssetPath.includes("workspace") || normalizedAssetPath.includes("photo")) {
    return "About";
  }

  return "Ledgewave";
};

const deriveFallbackSubtitle = (figure, assetPath = "") => {
  const normalizedAssetPath = assetPath.toLowerCase();

  if (
    figure.classList.contains("image-placeholder--logo") ||
    normalizedAssetPath.includes("logos-")
  ) {
    return "Receivables CSVs, planned billing files, and customer-specific ingest paths reviewed through managed onboarding.";
  }

  if (normalizedAssetPath.includes("blog-cover") || sitePrefix === "../") {
    return "Ideas for finance teams improving collections operations, forecasting discipline, and customer follow-up.";
  }

  if (normalizedAssetPath.includes("workspace") || normalizedAssetPath.includes("photo")) {
    return "Built for modern finance teams replacing fragmented spreadsheets and disconnected follow-up work.";
  }

  if (normalizedAssetPath.includes("product-")) {
    return "Draft follow-up, invoice history, and cash visibility held together inside one operating surface.";
  }

  return "A receivables operating system for teams replacing exports, trackers, and disconnected workflows.";
};

const createFallbackBarGroup = (count) => {
  const bars = document.createElement("div");
  bars.className = "image-fallback-bars";
  bars.setAttribute("aria-hidden", "true");

  for (let index = 0; index < count; index += 1) {
    bars.append(document.createElement("span"));
  }

  return bars;
};

const buildPlaceholderFallback = (figure, assetPath = "") => {
  const fallback = document.createElement("div");
  fallback.className = "image-fallback";

  const header = document.createElement("div");
  header.className = "image-fallback-header";

  const badge = document.createElement("span");
  badge.className = "image-fallback-badge";
  badge.textContent = deriveFallbackEyebrow(figure, assetPath);

  const logo = document.createElement("img");
  logo.className = "image-fallback-logo";
  logo.src = buildHref("assets/images/ledgewave-mark.svg");
  logo.alt = "";
  logo.width = 38;
  logo.height = 38;

  header.append(badge, logo);

  const copy = document.createElement("div");
  copy.className = "image-fallback-copy";

  const title = document.createElement("strong");
  title.className = "image-fallback-title";
  title.textContent = deriveFallbackTitle(figure);

  const subtitle = document.createElement("p");
  subtitle.className = "image-fallback-subtitle";
  subtitle.textContent = deriveFallbackSubtitle(figure, assetPath);

  copy.append(title, subtitle);

  const barCount = figure.classList.contains("image-placeholder--logo") ? 5 : 3;
  fallback.append(header, copy, createFallbackBarGroup(barCount));
  return fallback;
};

const getPlaceholderPresentation = (figure, assetPath = "") => {
  const normalizedAssetPath = assetPath.toLowerCase();
  const isLogoAsset =
    figure.classList.contains("image-placeholder--logo") ||
    normalizedAssetPath.includes("logos-");

  if (isLogoAsset) {
    return {
      fit: "contain",
      position: "center center",
      padding: "clamp(18px, 2vw, 24px)"
    };
  }

  const isProductUiAsset = normalizedAssetPath.includes("product-");
  if (isProductUiAsset) {
    return {
      fit: "contain",
      position: "center center",
      padding: "clamp(16px, 1.8vw, 24px)"
    };
  }

  return {
    fit: "cover",
    position: "center center",
    padding: "0px"
  };
};

const applyPlaceholderPresentation = (figure, frame, assetPath) => {
  const defaults = getPlaceholderPresentation(figure, assetPath);
  const fit = (figure.dataset.imageFit || defaults.fit || "").trim().toLowerCase();
  const position = (figure.dataset.imagePosition || defaults.position || "").trim();
  const padding = (
    figure.dataset.imagePadding ||
    figure.dataset.imagePad ||
    defaults.padding ||
    ""
  ).trim();
  const ratio = (figure.dataset.imageRatio || "").trim();

  if (fit) {
    figure.dataset.imageFit = fit;
    figure.style.setProperty("--image-fit", fit);
  }

  if (position) {
    figure.style.setProperty("--image-position", position);
  }

  if (padding) {
    figure.style.setProperty("--loaded-frame-padding", padding);
  }

  if (ratio) {
    frame.style.setProperty("--placeholder-ratio", ratio);
  }
};

const upgradeImagePlaceholder = (figure, src, assetPath = "") => {
  if (figure.classList.contains("is-loaded")) {
    return;
  }

  const frame = figure.querySelector(".image-placeholder-frame");
  if (!frame) {
    return;
  }

  applyPlaceholderPresentation(figure, frame, assetPath);
  figure.classList.remove("is-fallback");

  const image = document.createElement("img");
  image.className = "image-placeholder-media";
  image.src = src;
  image.alt = derivePlaceholderAlt(figure);
  image.decoding = "async";
  image.loading = figure.classList.contains("image-placeholder--hero") ? "eager" : "lazy";

  if (figure.classList.contains("image-placeholder--hero")) {
    image.fetchPriority = "high";
  }

  frame.replaceChildren(image);
  frame.removeAttribute("role");
  frame.removeAttribute("aria-label");
  figure.classList.add("is-loaded");
};

const renderPlaceholderFallback = (figure, assetPath = "") => {
  if (figure.classList.contains("is-loaded")) {
    return;
  }

  const frame = figure.querySelector(".image-placeholder-frame");
  if (!frame) {
    return;
  }

  applyPlaceholderPresentation(figure, frame, assetPath);
  frame.replaceChildren(buildPlaceholderFallback(figure, assetPath));
  frame.setAttribute("role", "img");
  frame.setAttribute("aria-label", deriveFallbackTitle(figure));
  figure.classList.add("is-fallback");
};

const initializeImagePlaceholders = () => {
  const placeholders = Array.from(document.querySelectorAll(".image-placeholder"));

  if (!placeholders.length) {
    return;
  }

  placeholders.forEach((figure) => {
    const assetPath =
      figure.dataset.assetPath ||
      figure.querySelector(".image-placeholder-target code")?.textContent ||
      "";
    const assetHref = resolvePlaceholderAssetHref(assetPath);

    if (!assetHref) {
      renderPlaceholderFallback(figure, assetPath);
      return;
    }

    probeImageAvailability(assetHref).then((isAvailable) => {
      if (!isAvailable) {
        renderPlaceholderFallback(figure, assetPath);
        return;
      }

      upgradeImagePlaceholder(figure, assetHref, assetPath);
    });
  });
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
initializeImagePlaceholders();
initializeCaptureForms();
initializeRevealTransitions();
