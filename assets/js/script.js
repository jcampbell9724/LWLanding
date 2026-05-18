const currentPage = document.body.dataset.page || "index";
const GOOGLE_SHEETS_ENDPOINT =
    window.LEDGEWAVE_FORM_ENDPOINT || "https://script.google.com/macros/s/AKfycbzoNHNpZUjf8F6gyuYp10z3_Q_7h3wpaeJ5pAQPSY2OUGIJKzwR6g46rnxxRFHlFBaP/exec";
const APP_LOGIN_URL = "https://app.ledgewave.com";

const PRIMARY_NAV = [
  {
    type: "dropdown",
    key: "products",
    label: "Products",
    items: [
      {
        href: "ar-management.html",
        key: "ar-management",
        label: "AR Management",
        icon: "assets/images/icons/accounts.png",
        description: "Prioritize invoices, accounts, owners, and next actions.",
      },
      {
        href: "cash-forecasting.html",
        key: "cash-forecasting",
        label: "Cash Forecasting",
        icon: "assets/images/icons/calendar.png",
        description: "Review expected cash from receivables and planned billing.",
      },
      {
        href: "analytics.html",
        key: "analytics",
        label: "Analytics",
        icon: "assets/images/icons/analytics.png",
        description: "Explain aging, exposure, payment behavior, and team progress.",
      },
      {
        href: "dunning.html",
        key: "dunning",
        label: "Dunning Automation",
        icon: "assets/images/icons/tasks.png",
        description: "Coordinate follow-up, reminders, promises, and account history.",
      },
    ],
  },
  {
    type: "dropdown",
    key: "solutions",
    label: "Solutions",
    items: [
      {
        href: "for-ar-teams.html",
        key: "for-ar-teams",
        label: "For AR Teams",
        icon: "assets/images/icons/accounts.png",
        description: "Daily queues, account ownership, follow-up, and team consistency.",
      },
      {
        href: "solutions.html#for-finance-leaders",
        key: "for-finance-leaders",
        label: "For Finance Leaders",
        icon: "assets/images/icons/reports.png",
        description: "Cash visibility, forecast confidence, and leadership reporting.",
      },
      {
        href: "for-multi-entity-operations.html",
        key: "for-multi-entity-ops",
        label: "For Multi-Entity Ops",
        icon: "assets/images/icons/dashboard.png",
        description: "Normalize receivables work across entities, ERPs, and shared services.",
      },
    ],
  },
  { href: "pricing.html", key: "pricing", label: "Pricing" },
  {
    type: "dropdown",
    key: "integrations",
    label: "Integrations",
    items: [
      {
        type: "heading",
        label: "ERP Pages",
      },
      {
        href: "integrations/netsuite/",
        key: "integration-netsuite",
        label: "NetSuite",
        icon: "assets/images/icons/uploads.png",
        description: "Collections workflows and cash visibility for NetSuite teams.",
      },
      {
        href: "integrations/sap/",
        key: "integration-sap",
        label: "SAP",
        icon: "assets/images/icons/dashboard.png",
        description: "Operational receivables visibility for SAP environments.",
      },
      {
        href: "integrations/oracle/",
        key: "integration-oracle",
        label: "Oracle",
        icon: "assets/images/icons/reports.png",
        description: "Receivables workflow visibility for Oracle finance operations.",
      },
      {
        href: "integrations/dynamics/",
        key: "integration-dynamics",
        label: "Microsoft Dynamics",
        icon: "assets/images/icons/calendar.png",
        description: "Collections execution and forecast visibility for Dynamics teams.",
      },
      {
        href: "integrations/intacct/",
        key: "integration-intacct",
        label: "Sage Intacct",
        icon: "assets/images/icons/analytics.png",
        description: "Operational receivables workflows for Intacct teams.",
      },
      {
        href: "integrations/quickbooks/",
        key: "integration-quickbooks",
        label: "QuickBooks",
        icon: "assets/images/icons/accounts.png",
        description: "Collections automation for growing finance teams.",
      },
      {
        href: "integrations/xero/",
        key: "integration-xero",
        label: "Xero",
        icon: "assets/images/icons/contacts.png",
        description: "Receivables visibility for growing finance teams.",
      },
      {
        type: "heading",
        label: "Workflow",
      },
      {
        href: "integrations/communications/",
        key: "integration-communications",
        label: "Communications",
        icon: "assets/images/icons/contacts.png",
        description: "Customer outreach, reminder workflows, and follow-up history.",
      },
      {
        type: "heading",
        label: "Data Paths",
      },
      {
        href: "integrations/technical/",
        key: "integration-technical",
        label: "Technical",
        icon: "assets/images/icons/dashboard.png",
        description: "APIs, webhooks, exports, warehouses, and secure transfers.",
      },
      {
        href: "integrations.html",
        key: "integrations",
        label: "All Integrations",
        icon: "assets/images/icons/uploads.png",
        description: "Review supported systems and integration planning paths.",
      },
    ],
  },
  { href: "enterprise.html", key: "enterprise", label: "Enterprise" },
  { href: "blog/index.html", key: "resources", label: "Resources" },
];

const NAV_PAGE_ALIASES = {
  "ar-management": "products",
  "cash-forecasting": "products",
  analytics: "products",
  dunning: "products",
  payment: "pricing",
  "for-ar-teams": "solutions",
  "for-multi-entity-ops": "solutions",
  blog: "resources",
  "api-webhooks": "integrations",
  "enterprise-erp": "integrations",
  "accounting-systems": "integrations",
  "email-integrations": "integrations",
  "erp-integrations": "integrations",
  "integration-netsuite": "integrations",
  "integration-sap": "integrations",
  "integration-oracle": "integrations",
  "integration-dynamics": "integrations",
  "integration-intacct": "integrations",
  "integration-quickbooks": "integrations",
  "integration-xero": "integrations",
  "integration-communications": "integrations",
  "integration-technical": "integrations",
  "self-service-integrations": "integrations",
  platform: "products",
};

// Keep this in sync with docs/IMAGE_PLACEHOLDER_MAP.md.
const IMAGE_ASSET_MAP = {
  "blog-card-2026-03-30-5-signs-your-collections-workflow-has-outgrown-spreadsheets":
    "assets/images/blog-cover-spreadsheet-exit.svg",
  "blog-card-2026-03-30-why-planned-billing-belongs-in-the-collections-forecast":
    "assets/images/blog-cover-planned-billing.svg",
  "blog-card-2026-04-01-what-payment-behavior-reveals-about-collections-risk":
    "assets/images/blog-cover-payment-behavior.svg",
  "blog-card-how-teams-move-from-spreadsheet-follow-up-to-a-structured-dunning-workflow":
    "assets/images/blog-cover-dunning-workflow.svg",
  "blog-card-why-follow-up-history-matters-in-dunning":
    "assets/images/blog-cover-follow-up-history.svg",
  "blog-featured-cover": "assets/images/blog-cover-spreadsheet-exit.svg",
  "blog-post-hero-2026-03-30-5-signs-your-collections-workflow-has-outgrown-spreadsheets":
    "assets/images/blog-cover-spreadsheet-exit.svg",
  "blog-post-hero-2026-03-30-why-planned-billing-belongs-in-the-collections-forecast":
    "assets/images/blog-cover-planned-billing.svg",
  "blog-post-hero-2026-04-01-what-payment-behavior-reveals-about-collections-risk":
    "assets/images/blog-cover-payment-behavior.svg",
  "blog-post-hero-how-teams-move-from-spreadsheet-follow-up-to-automated-dunning":
    "assets/images/blog-cover-dunning-workflow.svg",
  "blog-post-hero-how-teams-move-from-spreadsheet-follow-up-to-a-structured-dunning-workflow":
    "assets/images/blog-cover-dunning-workflow.svg",
  "blog-post-hero-why-follow-up-history-matters-in-dunning":
    "assets/images/blog-cover-follow-up-history.svg",
  "demo-hero-account-history": "assets/images/product-account-detail-timeline-framed.png",
  "demo-request-form-logos": "assets/images/logos-integrations.svg",
  "home-enterprise-fit-logos": "assets/images/logos-integrations.svg",
  "home-hero-command-center": "assets/images/product-command-center-framed.png",
  "home-why-teams-buy-forecast": "assets/images/product-forecast-intelligence-framed.png",
  "home-why-teams-buy-history": "assets/images/product-account-detail-timeline-framed.png",
  "home-why-teams-buy-queue": "assets/images/product-collector-queue-framed.png",
  "integrations-supported-environments-logos": "assets/images/logos-integrations.svg",
  "platform-forecast": "assets/images/product-forecast-intelligence-framed.png",
  "platform-hero-command-center": "assets/images/product-command-center-framed.png",
  "platform-import-validation": "assets/images/product-import-validation.svg",
  "platform-outreach-dunning": "assets/images/product-dunning-workflow-framed.png",
  "platform-portfolio-queue": "assets/images/product-collector-queue-framed.png",
  "platform-team-consistency-history": "assets/images/product-account-detail-timeline-framed.png",
  "resources-blog-dunning-workflow": "assets/images/blog-cover-dunning-workflow.svg",
  "resources-blog-payment-behavior": "assets/images/blog-cover-payment-behavior.svg",
  "resources-blog-planned-billing": "assets/images/blog-cover-planned-billing.svg",
  "resources-guide-exit-plan": "assets/images/resource-guide-exit-plan.svg",
  "resources-guide-follow-up-history": "assets/images/resource-guide-follow-up-history.svg",
  "resources-guide-payment-behavior": "assets/images/resource-guide-payment-behavior.svg",
  "resources-guide-planned-billing": "assets/images/resource-guide-planned-billing.svg",
  "why-hero-command-center": "assets/images/product-command-center-framed.png",
};

const IMAGE_ASSET_ID_BY_PATH = {
  "assets/images/product-command-center.png": "A01",
  "assets/images/product-command-center-framed.png": "A01",
  "assets/images/product-collector-queue.png": "A02",
  "assets/images/product-collector-queue-framed.png": "A02",
  "assets/images/product-account-detail-timeline.png": "A03",
  "assets/images/product-account-detail-timeline-framed.png": "A03",
  "assets/images/product-dunning-workflow.png": "A04",
  "assets/images/product-dunning-workflow-framed.png": "A04",
  "assets/images/product-forecast-intelligence.png": "A05",
  "assets/images/product-forecast-intelligence-framed.png": "A05",
  "assets/images/product-import-validation.svg": "A06",
  "assets/images/logos-integrations.svg": "A08",
  "assets/images/resource-guide-exit-plan.svg": "A11-1",
  "assets/images/resource-guide-planned-billing.svg": "A11-2",
  "assets/images/resource-guide-payment-behavior.svg": "A11-3",
  "assets/images/resource-guide-follow-up-history.svg": "A11-4",
  "assets/images/blog-cover-spreadsheet-exit.svg": "A12-1",
  "assets/images/blog-cover-planned-billing.svg": "A12-2",
  "assets/images/blog-cover-payment-behavior.svg": "A12-3",
  "assets/images/blog-cover-dunning-workflow.svg": "A12-4",
  "assets/images/blog-cover-follow-up-history.svg": "A12-5",
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
const activeNavKey = NAV_PAGE_ALIASES[currentPage] || currentPage;
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

const renderNavLink = ({ href, key, label }) => {
  const state = key === activeNavKey ? ' class="is-active" aria-current="page"' : "";
  return `<a href="${buildHref(href)}" data-nav="${key}"${state}>${label}</a>`;
};

const renderNavDropdown = ({ key, label, items }) => {
  const isGroupActive = key === activeNavKey;
  const triggerState = isGroupActive ? " is-active" : "";

  const dropdownLinks = items
    .map((item) => {
      if (item.type === "heading") {
        return `<span class="nav-dropdown-heading">${item.label}</span>`;
      }

      const state = item.key === currentPage ? ' class="is-active" aria-current="page"' : "";
      return `
        <a href="${buildHref(item.href)}" data-nav="${item.key}"${state}>
          <span class="nav-dropdown-icon" aria-hidden="true">
            <img src="${buildHref(item.icon)}" alt="" width="22" height="22">
          </span>
          <span class="nav-dropdown-copy">
            <span class="nav-dropdown-title">${item.label}</span>
            <span class="nav-dropdown-description">${item.description}</span>
          </span>
        </a>
      `.trim();
    })
    .join("");

  return `
    <div class="nav-dropdown" data-nav-group="${key}" data-open="false">
      <button
        class="nav-dropdown-trigger${triggerState}"
        type="button"
        aria-expanded="false"
        aria-controls="nav-menu-${key}"
      >
        <span>${label}</span>
        <span class="nav-caret" aria-hidden="true"></span>
      </button>
      <div class="nav-dropdown-menu" id="nav-menu-${key}">
        ${dropdownLinks}
      </div>
    </div>
  `.trim();
};

const renderNavLinks = () =>
  PRIMARY_NAV.map((item) =>
    item.type === "dropdown" ? renderNavDropdown(item) : renderNavLink(item)
  ).join("");

const ensureMainContentTarget = () => {
  const main = document.querySelector(".page-main");
  if (main && !main.id) {
    main.id = "main-content";
  }
};

const renderSharedChrome = () => {
  const demoState = currentPage === "demo" ? ' aria-current="page"' : "";
  const startState = currentPage === "payment" ? ' aria-current="page"' : "";
  const showBrandPromise = currentPage !== "index";

  renderIntoHost({
    hostSelector: "[data-site-header]",
    fallbackSelector: ".site-header",
    markup: `
      <header class="site-header" id="top">
        <a class="skip-link" href="#main-content">Skip to content</a>
        <div class="site-header-inner">
          <a class="brand" href="${buildHref("index.html")}" aria-label="Ledgewave home">
            <img
              class="brand-logo"
              src="${buildHref("assets/images/brand/primary-logo.png")}"
              alt="Ledgewave"
              width="220"
              height="45"
            >
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

          <div class="nav-actions">
            <a class="btn btn-primary nav-cta" href="${buildHref("payment.html")}"${startState}>Start Now</a>
            <a class="btn btn-secondary nav-cta" href="${buildHref("demo.html")}"${demoState}>Book a Demo</a>
            <a class="nav-login" href="${APP_LOGIN_URL}">Login</a>
          </div>
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
              <img
                class="footer-brand-card"
                src="${buildHref("assets/images/brand/logo-card-light.png")}"
                alt="Ledgewave"
                width="260"
                height="104"
              >
              <span class="footer-brand-copy">
                ${showBrandPromise ? "<strong>Clarity. Empathy. Results.</strong>" : ""}
                <span>Receivables workflow that keeps cash moving.</span>
              </span>
              <p class="footer-note">
                Ledgewave helps finance teams run AR follow-up, dunning, cash visibility, and rollout-ready receivables operations from the data path they have today.
              </p>
              <div class="footer-actions">
                <a class="btn btn-primary" href="${buildHref("payment.html")}">Start Now</a>
                <a class="btn btn-secondary" href="${buildHref("demo.html")}">Book a Demo</a>
              </div>
            </div>

            <div class="footer-links">
              <strong>Product</strong>
              <a href="${buildHref("ar-management.html")}">AR Management</a>
              <a href="${buildHref("cash-forecasting.html")}">Cash Forecasting</a>
              <a href="${buildHref("analytics.html")}">Analytics</a>
              <a href="${buildHref("dunning.html")}">Dunning Automation</a>
              <a href="${buildHref("platform.html")}">Platform Overview</a>
            </div>

            <div class="footer-links">
              <strong>Integrations</strong>
              <a href="${buildHref("integrations/netsuite/")}">NetSuite</a>
              <a href="${buildHref("integrations/sap/")}">SAP</a>
              <a href="${buildHref("integrations/oracle/")}">Oracle</a>
              <a href="${buildHref("integrations/dynamics/")}">Dynamics</a>
              <a href="${buildHref("integrations/quickbooks/")}">QuickBooks</a>
              <a href="${buildHref("integrations/technical/")}">Technical</a>
              <a href="${buildHref("integrations.html")}">Integration Overview</a>
            </div>

            <div class="footer-links">
              <strong>Learn</strong>
              <a href="${buildHref("blog/index.html")}">Blog</a>
              <a href="${buildHref("resources.html")}">Resources Library</a>
              <a href="${buildHref("customers.html")}">Customers</a>
              <a href="${buildHref("why-ledgewave.html")}">Why Ledgewave</a>
              <a href="${buildHref("demo.html")}">Talk to Sales</a>
            </div>

            <div class="footer-links">
              <strong>Company</strong>
              <a href="${buildHref("index.html")}">Home</a>
              <a href="${buildHref("solutions.html")}">Solutions</a>
              <a href="${buildHref("pricing.html")}">Pricing</a>
              <a href="${buildHref("enterprise.html")}">Enterprise</a>
              <a href="${buildHref("payment.html")}">Start Now</a>
              <a href="${buildHref("about.html")}">About</a>
              <a href="${buildHref("contact.html")}">Contact</a>
              <a href="${buildHref("security.html")}">Security</a>
              <a href="${APP_LOGIN_URL}">Login</a>
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
            <span>Built for finance teams that need a cleaner receivables operating system.</span>
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

const hasStructuredDataType = (typeName) =>
  Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some((script) =>
    script.textContent.includes(`"${typeName}"`)
  );

const getCanonicalUrl = () =>
  document.querySelector('link[rel="canonical"]')?.href || window.location.href.split("#")[0];

const getPageBreadcrumbLabel = () => {
  const pageTitle = cleanImageAssetCopy(document.querySelector("h1")?.textContent || "");

  if (pageTitle) {
    return pageTitle.replace(/\.$/, "");
  }

  return cleanImageAssetCopy(document.title.replace(/\s*\|\s*Ledgewave\s*$/, "")) || "Page";
};

const injectBreadcrumbStructuredData = () => {
  if (hasStructuredDataType("BreadcrumbList")) {
    return;
  }

  const canonicalUrl = getCanonicalUrl();
  const canonicalPath = new URL(canonicalUrl, window.location.origin).pathname;

  if (canonicalPath === "/" || canonicalPath.endsWith("/index.html")) {
    return;
  }

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://ledgewave.com/",
    },
  ];

  if (canonicalPath.startsWith("/blog/")) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://ledgewave.com/blog/",
    });

    if (canonicalPath !== "/blog/" && !canonicalPath.endsWith("/blog/index.html")) {
      items.push({
        "@type": "ListItem",
        position: 3,
        name: getPageBreadcrumbLabel(),
        item: canonicalUrl,
      });
    }
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: getPageBreadcrumbLabel(),
      item: canonicalUrl,
    });
  }

  const script = document.createElement("script");
  script.id = "breadcrumb-structured-data";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  });
  document.head.append(script);
};

const initializeNavigation = () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".site-nav a");
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  const dropdownTriggers = document.querySelectorAll(".nav-dropdown-trigger");
  const dropdownCloseTimers = new Map();

  if (!header || !navToggle) {
    return;
  }

  const clearDropdownCloseTimer = (dropdown) => {
    const timer = dropdownCloseTimers.get(dropdown);

    if (timer) {
      window.clearTimeout(timer);
      dropdownCloseTimers.delete(dropdown);
    }
  };

  const setDropdownOpen = (dropdown, isOpen) => {
    dropdown.dataset.open = String(isOpen);
    dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      dropdown.dataset.pinned = "false";
    }
  };

  const closeDropdowns = (exceptDropdown = null) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown === exceptDropdown) {
        return;
      }

      clearDropdownCloseTimer(dropdown);
      setDropdownOpen(dropdown, false);
    });
  };

  const closeMenu = () => {
    header.dataset.open = "false";
    navToggle.setAttribute("aria-expanded", "false");
    closeDropdowns();
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

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-dropdown-trigger");

    dropdown.addEventListener("pointerenter", () => {
      if (!window.matchMedia("(hover: hover)").matches) {
        return;
      }

      clearDropdownCloseTimer(dropdown);
      closeDropdowns(dropdown);
      setDropdownOpen(dropdown, true);
    });

    dropdown.addEventListener("pointerleave", () => {
      if (!window.matchMedia("(hover: hover)").matches) {
        return;
      }

      if (dropdown.dataset.pinned === "true") {
        return;
      }

      clearDropdownCloseTimer(dropdown);
      dropdownCloseTimers.set(
        dropdown,
        window.setTimeout(() => {
          setDropdownOpen(dropdown, false);
          dropdownCloseTimers.delete(dropdown);
        }, 360)
      );
    });

    trigger?.addEventListener("focus", () => {
      clearDropdownCloseTimer(dropdown);
      closeDropdowns(dropdown);
      setDropdownOpen(dropdown, true);
    });
  });

  dropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const dropdown = trigger.closest(".nav-dropdown");

      if (!dropdown) {
        return;
      }

      closeDropdowns(dropdown);
      clearDropdownCloseTimer(dropdown);

      if (dropdown.dataset.pinned === "true") {
        setDropdownOpen(dropdown, false);
        return;
      }

      dropdown.dataset.pinned = "true";
      setDropdownOpen(dropdown, true);
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (header.contains(event.target)) {
      return;
    }

    closeMenu();
    closeDropdowns();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeDropdowns();
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

const resolveImageAssetHref = (assetPath) => {
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

const resolveImageAssetPath = (figure) => {
  const placeholderId = figure.dataset.placeholderId || "";

  return (
    figure.dataset.assetPath ||
    IMAGE_ASSET_MAP[placeholderId] ||
    figure.querySelector(".image-asset-target code")?.textContent ||
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
        : [".png", ".svg", ".jpg", ".jpeg", ".webp"];

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
        : [currentExtension, ".png", ".svg", ".jpg", ".jpeg", ".webp"];
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

const cleanImageAssetCopy = (value = "") =>
  value
    .replace(/^placeholder for\s+/i, "")
    .replace(/\s+placeholder$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const hasExplicitImageAssetAlt = (figure) =>
  Object.prototype.hasOwnProperty.call(figure.dataset, "imageAlt");

const isImageAssetDecorative = (figure) =>
  hasExplicitImageAssetAlt(figure) && cleanImageAssetCopy(figure.dataset.imageAlt || "") === "";

const deriveImageAssetTitle = (figure) => {
  const title =
    figure.dataset.imageTitle ||
    figure.querySelector(".image-asset-title")?.textContent ||
    "";

  return cleanImageAssetCopy(title)
    .replace(/^[A-Z]\d+(?:-\d+)?\s+/, "")
    .trim();
};

const deriveImageAssetAlt = (figure) => {
  if (hasExplicitImageAssetAlt(figure)) {
    return cleanImageAssetCopy(figure.dataset.imageAlt || "");
  }

  const frameLabel = cleanImageAssetCopy(
    figure.querySelector(".image-asset-frame")?.getAttribute("aria-label") || ""
  );
  if (frameLabel) {
    return frameLabel.charAt(0).toUpperCase() + frameLabel.slice(1);
  }

  const cleanedTitle = deriveImageAssetTitle(figure);

  return cleanedTitle || "Ledgewave product image";
};

const getImageAssetDimensions = (figure) => {
  if (figure.classList.contains("image-asset--logo")) {
    return { width: 2000, height: 400 };
  }

  if (figure.classList.contains("image-asset--square")) {
    return { width: 1600, height: 1200 };
  }

  if (figure.classList.contains("image-asset--hero")) {
    return { width: 1600, height: 1000 };
  }

  return { width: 1600, height: 900 };
};

const deriveFallbackTitle = (figure) => {
  const title = deriveImageAssetTitle(figure);
  const normalizedTitle = title.toLowerCase();
  const isGenericTitle = normalizedTitle === "cover image" || normalizedTitle === "article cover" || normalizedTitle === "featured article cover";

  if (title && !isGenericTitle) {
    return title;
  }

  const nearbyHeading = cleanImageAssetCopy(
    figure.closest("article, aside, section, main")?.querySelector("h1, h2, h3")?.textContent || ""
  );
  if (nearbyHeading) {
    return nearbyHeading;
  }

  if (figure.classList.contains("image-asset--logo")) {
    return "Connected finance systems";
  }

  if (figure.classList.contains("image-asset--hero")) {
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
    figure.classList.contains("image-asset--logo") ||
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
    figure.classList.contains("image-asset--logo") ||
    normalizedAssetPath.includes("logos-")
  ) {
    return "ERP, accounting, CRM, billing, payment, API, and secure file paths reviewed through managed onboarding.";
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

const buildImageAssetFallback = (figure, assetPath = "") => {
  const fallback = document.createElement("div");
  fallback.className = "image-fallback";

  const header = document.createElement("div");
  header.className = "image-fallback-header";

  const badge = document.createElement("span");
  badge.className = "image-fallback-badge";
  badge.textContent = deriveFallbackEyebrow(figure, assetPath);

  const logo = document.createElement("img");
  logo.className = "image-fallback-logo";
  logo.src = buildHref("assets/images/brand/logo-mark.png");
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

  const barCount = figure.classList.contains("image-asset--logo") ? 5 : 3;
  fallback.append(header, copy, createFallbackBarGroup(barCount));
  return fallback;
};

const syncImageAssetFrameAccessibility = (frame, figure, label = "") => {
  if (isImageAssetDecorative(figure)) {
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

const createImageAssetElement = (figure, eager = false) => {
  const image = document.createElement("img");
  const { width, height } = getImageAssetDimensions(figure);

  image.className = "image-asset-media";
  image.alt = deriveImageAssetAlt(figure);
  image.decoding = "async";
  image.loading = eager ? "eager" : "lazy";
  image.width = width;
  image.height = height;

  if (eager) {
    image.fetchPriority = "high";
  } else if (figure.classList.contains("image-asset--card")) {
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

const upgradeImageAsset = (figure, image) => {
  if (figure.classList.contains("is-loaded")) {
    return;
  }

  const frame = figure.querySelector(".image-asset-frame");
  if (!frame) {
    return;
  }

  figure.classList.remove("is-fallback");
  frame.replaceChildren(image);
  syncImageAssetFrameAccessibility(frame, figure);
  figure.classList.add("is-loaded");
};

const renderImageAssetFallback = (figure, assetPath = "") => {
  if (figure.classList.contains("is-loaded")) {
    return;
  }

  const frame = figure.querySelector(".image-asset-frame");
  if (!frame) {
    return;
  }

  frame.replaceChildren(buildImageAssetFallback(figure, assetPath));
  syncImageAssetFrameAccessibility(frame, figure, deriveFallbackTitle(figure));
  figure.classList.add("is-fallback");
};

const hydrateImageAsset = async (figure, assetHrefs, assetPath = "", eager = false) => {
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
      const image = createImageAssetElement(figure, eager);
      await loadImageElement(image, assetHref);

      if (typeof image.decode === "function") {
        await image.decode().catch(() => {});
      }

      if (!figure.isConnected) {
        return;
      }

      upgradeImageAsset(figure, image);
      figure.dataset.imageState = "loaded";
      return;
    } catch (error) {
      continue;
    }
  }

  renderImageAssetFallback(figure, assetPath);
  figure.dataset.imageState = "fallback";
};

const initializeStaticImageAsset = (figure, assetPath = "") => {
  const image = figure.querySelector("img.image-asset-media");

  if (!image) {
    return false;
  }

  const renderImageFallback = () => {
    figure.classList.remove("is-loaded");
    renderImageAssetFallback(figure, assetPath || image.getAttribute("src") || "");
    figure.dataset.imageState = "fallback";
  };

  if (image.complete && image.naturalWidth === 0) {
    renderImageFallback();
    return true;
  }

  image.addEventListener("error", renderImageFallback, { once: true });
  figure.classList.add("is-loaded");
  figure.dataset.imageState = "loaded";
  return true;
};

const initializeImageAssets = () => {
  const assetFigures = Array.from(document.querySelectorAll(".image-asset"));

  if (!assetFigures.length) {
    return;
  }

  assetFigures.forEach((figure) => {
    const assetPath = resolveImageAssetPath(figure);

    if (initializeStaticImageAsset(figure, assetPath)) {
      return;
    }

    const assetHrefs = buildAssetCandidatePaths(assetPath).map(resolveImageAssetHref);

    if (!assetHrefs.length) {
      renderImageAssetFallback(figure, assetPath);
      return;
    }

    if (figure.classList.contains("image-asset--hero")) {
      hydrateImageAsset(figure, assetHrefs, assetPath, true);
      return;
    }
    hydrateImageAsset(figure, assetHrefs, assetPath, false);
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
            "We could not submit the form right now. Please email sales@ledgewave.com and we will follow up.";
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

ensureMainContentTarget();
renderSharedChrome();
injectBreadcrumbStructuredData();
initializeNavigation();
initializeImageAssets();
initializeCaptureForms();
initializeRevealTransitions();
