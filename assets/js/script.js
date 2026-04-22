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

// Keep this in sync with docs/IMAGE_PLACEHOLDER_MAP.md.
const IMAGE_PLACEHOLDER_ASSET_MAP = {
  "about-hero-workspace-photo": "assets/images/about-workspace-photo.jpg",
  "blog-card-2026-03-30-5-signs-your-collections-workflow-has-outgrown-spreadsheets":
    "assets/images/blog-cover-spreadsheet-exit.png",
  "blog-card-2026-03-30-why-planned-billing-belongs-in-the-collections-forecast":
    "assets/images/blog-cover-planned-billing.png",
  "blog-card-2026-04-01-what-payment-behavior-reveals-about-collections-risk":
    "assets/images/blog-cover-payment-behavior.png",
  "blog-card-how-teams-move-from-spreadsheet-follow-up-to-a-structured-dunning-workflow":
    "assets/images/blog-cover-dunning-workflow.png",
  "blog-card-why-follow-up-history-matters-in-dunning":
    "assets/images/blog-cover-follow-up-history.png",
  "blog-featured-cover": "assets/images/blog-cover-spreadsheet-exit.png",
  "blog-post-hero-2026-03-30-5-signs-your-collections-workflow-has-outgrown-spreadsheets":
    "assets/images/blog-cover-spreadsheet-exit.png",
  "blog-post-hero-2026-03-30-why-planned-billing-belongs-in-the-collections-forecast":
    "assets/images/blog-cover-planned-billing.png",
  "blog-post-hero-2026-04-01-what-payment-behavior-reveals-about-collections-risk":
    "assets/images/blog-cover-payment-behavior.png",
  "blog-post-hero-how-teams-move-from-spreadsheet-follow-up-to-a-structured-dunning-workflow":
    "assets/images/blog-cover-dunning-workflow.png",
  "blog-post-hero-why-follow-up-history-matters-in-dunning":
    "assets/images/blog-cover-follow-up-history.png",
  "demo-hero-account-history": "assets/images/product-account-detail-timeline.png",
  "demo-request-form-logos": "assets/images/logos-integrations.svg",
  "home-enterprise-fit-logos": "assets/images/logos-integrations.svg",
  "home-hero-command-center": "assets/images/product-command-center.png",
  "home-why-teams-buy-forecast": "assets/images/product-forecast-intelligence.png",
  "home-why-teams-buy-history": "assets/images/product-account-detail-timeline.png",
  "home-why-teams-buy-queue": "assets/images/product-collector-queue.png",
  "integrations-supported-environments-logos": "assets/images/logos-integrations.svg",
  "platform-forecast": "assets/images/product-forecast-intelligence.png",
  "platform-hero-command-center": "assets/images/product-command-center.png",
  "platform-import-validation": "assets/images/product-import-validation.png",
  "platform-outreach-dunning": "assets/images/product-dunning-workflow.png",
  "platform-portfolio-queue": "assets/images/product-collector-queue.png",
  "platform-team-consistency-history": "assets/images/product-account-detail-timeline.png",
  "resources-blog-dunning-workflow": "assets/images/blog-cover-dunning-workflow.png",
  "resources-blog-payment-behavior": "assets/images/blog-cover-payment-behavior.png",
  "resources-blog-planned-billing": "assets/images/blog-cover-planned-billing.png",
  "resources-guide-exit-plan": "assets/images/resource-guide-exit-plan.png",
  "resources-guide-follow-up-history": "assets/images/resource-guide-follow-up-history.png",
  "resources-guide-payment-behavior": "assets/images/resource-guide-payment-behavior.png",
  "resources-guide-planned-billing": "assets/images/resource-guide-planned-billing.png",
  "why-hero-command-center": "assets/images/product-command-center.png",
};

const IMAGE_ASSET_ID_BY_PATH = {
  "assets/images/product-command-center.png": "A01",
  "assets/images/product-collector-queue.png": "A02",
  "assets/images/product-account-detail-timeline.png": "A03",
  "assets/images/product-dunning-workflow.png": "A04",
  "assets/images/product-forecast-intelligence.png": "A05",
  "assets/images/product-import-validation.png": "A06",
  "assets/images/logos-integrations.svg": "A08",
  "assets/images/about-workspace-photo.jpg": "A10",
  "assets/images/resource-guide-exit-plan.png": "A11-1",
  "assets/images/resource-guide-planned-billing.png": "A11-2",
  "assets/images/resource-guide-payment-behavior.png": "A11-3",
  "assets/images/resource-guide-follow-up-history.png": "A11-4",
  "assets/images/blog-cover-spreadsheet-exit.png": "A12-1",
  "assets/images/blog-cover-planned-billing.png": "A12-2",
  "assets/images/blog-cover-payment-behavior.png": "A12-3",
  "assets/images/blog-cover-dunning-workflow.png": "A12-4",
  "assets/images/blog-cover-follow-up-history.png": "A12-5",
};

const getSitePrefix = () => {
  const assetEntrypoints = [
    document.querySelector('script[src*="assets/js/script.js"]')?.getAttribute("src") || "",
    document.querySelector('link[rel="stylesheet"][href*="assets/css/styles.css"]')?.getAttribute("href") || "",
  ];

  for (const entrypoint of assetEntrypoints) {
    const match = entrypoint.match(
      /^(.*?)(?:assets\/(?:js\/script\.js|css\/styles\.css))(?:[?#].*)?$/
    );
    if (match) {
      return match[1];
    }
  }

  return "";
};

const sitePrefix = getSitePrefix();
const buildHref = (path) => `${sitePrefix}${path}`;
const scheduleMicrotask =
  window.queueMicrotask?.bind(window) || ((callback) => Promise.resolve().then(callback));

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

const resolvePlaceholderAssetPath = (figure) => {
  const placeholderId = figure.dataset.placeholderId || "";

  return (
    figure.dataset.assetPath ||
    IMAGE_PLACEHOLDER_ASSET_MAP[placeholderId] ||
    figure.querySelector(".image-placeholder-target code")?.textContent ||
    ""
  );
};

const buildAssetCandidatePaths = (assetPath = "") => {
  const normalizedPath = normalizeAssetPath(assetPath);

  if (!normalizedPath) {
    return [];
  }

  if (
    /^(?:https?:)?\/\//i.test(normalizedPath) ||
    normalizedPath.startsWith("data:") ||
    normalizedPath.startsWith("../")
  ) {
    return [normalizedPath];
  }

  const candidates = [normalizedPath];
  const extensionMatch = normalizedPath.match(/^(.*?)(\.[^.]+)$/);

  if (extensionMatch) {
    const [, basePath, extension] = extensionMatch;
    const currentExtension = extension.toLowerCase();
    const extensionCandidates =
      currentExtension === ".svg"
        ? [".png", ".webp"]
        : [".png", ".jpg", ".jpeg", ".webp"];

    extensionCandidates.forEach((candidateExtension) => {
      if (candidateExtension !== currentExtension) {
        candidates.push(`${basePath}${candidateExtension}`);
      }
    });
  }

  const assetId = IMAGE_ASSET_ID_BY_PATH[normalizedPath];
  if (assetId && extensionMatch) {
    const [, , extension] = extensionMatch;
    const currentExtension = extension.toLowerCase();
    const extensionCandidates =
      currentExtension === ".svg"
        ? [".svg", ".png", ".webp"]
        : [currentExtension, ".png", ".jpg", ".jpeg", ".webp"];
    const directory = normalizedPath.slice(0, normalizedPath.lastIndexOf("/"));
    const compactAssetId = assetId.replace(/^A0+/, "A");
    const assetIdVariants = [
      assetId,
      compactAssetId,
      assetId.replace(/-/g, "_"),
      compactAssetId.replace(/-/g, "_"),
      assetId.toLowerCase(),
      compactAssetId.toLowerCase(),
      assetId.toLowerCase().replace(/-/g, "_"),
      compactAssetId.toLowerCase().replace(/-/g, "_"),
    ];

    assetIdVariants.forEach((assetIdVariant) => {
      extensionCandidates.forEach((candidateExtension) => {
        candidates.push(`${directory}/${assetIdVariant}${candidateExtension}`);
      });
    });
  }

  return [...new Set(candidates)];
};

const cleanPlaceholderCopy = (value = "") =>
  value
    .replace(/^placeholder for\s+/i, "")
    .replace(/\s+placeholder$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const hasExplicitPlaceholderAlt = (figure) =>
  Object.prototype.hasOwnProperty.call(figure.dataset, "imageAlt");

const isPlaceholderDecorative = (figure) =>
  hasExplicitPlaceholderAlt(figure) && cleanPlaceholderCopy(figure.dataset.imageAlt || "") === "";

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
  if (hasExplicitPlaceholderAlt(figure)) {
    return cleanPlaceholderCopy(figure.dataset.imageAlt || "");
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

const getPlaceholderDimensions = (figure) => {
  if (figure.classList.contains("image-placeholder--logo")) {
    return { width: 2000, height: 400 };
  }

  if (figure.classList.contains("image-placeholder--square")) {
    return { width: 1600, height: 1200 };
  }

  if (figure.classList.contains("image-placeholder--hero")) {
    return { width: 1600, height: 1000 };
  }

  return { width: 1600, height: 900 };
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

const syncPlaceholderFrameAccessibility = (frame, figure, label = "") => {
  if (isPlaceholderDecorative(figure)) {
    frame.setAttribute("aria-hidden", "true");
    frame.removeAttribute("role");
    frame.removeAttribute("aria-label");
    return;
  }

  frame.removeAttribute("aria-hidden");

  if (label) {
    frame.setAttribute("role", "img");
    frame.setAttribute("aria-label", label);
    return;
  }

  frame.removeAttribute("role");
  frame.removeAttribute("aria-label");
};

const createPlaceholderImage = (figure, eager = false) => {
  const image = document.createElement("img");
  const { width, height } = getPlaceholderDimensions(figure);

  image.className = "image-placeholder-media";
  image.alt = derivePlaceholderAlt(figure);
  image.decoding = "async";
  image.loading = eager ? "eager" : "lazy";
  image.width = width;
  image.height = height;

  if (eager) {
    image.fetchPriority = "high";
  } else if (figure.classList.contains("image-placeholder--card")) {
    image.fetchPriority = "low";
  }

  return image;
};

const loadImageElement = (image, src) =>
  new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };

    const settle = (callback) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      callback();
    };

    const handleLoad = () => settle(() => resolve(image));
    const handleError = () =>
      settle(() => reject(new Error(`Failed to load image: ${src}`)));

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });
    image.src = src;

    if (image.complete) {
      scheduleMicrotask(() => {
        if (image.naturalWidth > 0) {
          handleLoad();
          return;
        }

        handleError();
      });
    }
  });

const upgradeImagePlaceholder = (figure, image) => {
  if (figure.classList.contains("is-loaded")) {
    return;
  }

  const frame = figure.querySelector(".image-placeholder-frame");
  if (!frame) {
    return;
  }

  figure.classList.remove("is-fallback");
  frame.replaceChildren(image);
  syncPlaceholderFrameAccessibility(frame, figure);
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

  frame.replaceChildren(buildPlaceholderFallback(figure, assetPath));
  syncPlaceholderFrameAccessibility(frame, figure, deriveFallbackTitle(figure));
  figure.classList.add("is-fallback");
};

const hydrateImagePlaceholder = async (figure, assetHrefs, assetPath = "", eager = false) => {
  if (
    !assetHrefs.length ||
    figure.classList.contains("is-loaded") ||
    figure.dataset.imageState === "loading"
  ) {
    return;
  }

  figure.dataset.imageState = "loading";

  for (const assetHref of assetHrefs) {
    try {
      const image = createPlaceholderImage(figure, eager);
      await loadImageElement(image, assetHref);

      if (typeof image.decode === "function") {
        await image.decode().catch(() => {});
      }

      if (!figure.isConnected) {
        return;
      }

      upgradeImagePlaceholder(figure, image);
      figure.dataset.imageState = "loaded";
      return;
    } catch (error) {
      continue;
    }
  }

  renderPlaceholderFallback(figure, assetPath);
  figure.dataset.imageState = "fallback";
};

const initializeImagePlaceholders = () => {
  const placeholders = Array.from(document.querySelectorAll(".image-placeholder"));

  if (!placeholders.length) {
    return;
  }

  const lazyPlaceholderMap = new Map();

  placeholders.forEach((figure) => {
    const assetPath = resolvePlaceholderAssetPath(figure);
    const assetHrefs = buildAssetCandidatePaths(assetPath).map(resolvePlaceholderAssetHref);

    if (!assetHrefs.length) {
      renderPlaceholderFallback(figure, assetPath);
      return;
    }

    if (figure.classList.contains("image-placeholder--hero")) {
      hydrateImagePlaceholder(figure, assetHrefs, assetPath, true);
      return;
    }

    lazyPlaceholderMap.set(figure, { assetHrefs, assetPath });
  });

  if (!lazyPlaceholderMap.size) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    lazyPlaceholderMap.forEach(({ assetHrefs, assetPath }, figure) => {
      hydrateImagePlaceholder(figure, assetHrefs, assetPath, false);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const assetDetails = lazyPlaceholderMap.get(entry.target);
        observer.unobserve(entry.target);

        if (!assetDetails) {
          return;
        }

        hydrateImagePlaceholder(entry.target, assetDetails.assetHrefs, assetDetails.assetPath, false);
      });
    },
    {
      threshold: 0.01,
      rootMargin: "320px 0px",
    }
  );

  lazyPlaceholderMap.forEach((_, figure) => {
    observer.observe(figure);
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
