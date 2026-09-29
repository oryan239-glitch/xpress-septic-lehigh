// Builds the static HTML pages from src/pages/*.html.
// Shared header, footer, icons, meta tags, JSON-LD and the optional trust components
// (reviews, gallery, credentials) come from this file. Business facts live in
// ../site.config.mjs so name, phone and Google Business Profile links stay identical everywhere.
//
// Run from the repo root:  node tools/build-pages.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (await import(pathToFileURL(join(root, "site.config.mjs")).href)).default;
const YEAR = new Date().getFullYear();

/* ================= Icons (paths adapted from Lucide, ISC licence) ================= */
const ICONS = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  rain: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2M16 14v6M8 14v6M12 16v6"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
};

const sprite =
  '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
  Object.entries(ICONS)
    .map(([k, p]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</symbol>`)
    .join("") +
  "</svg>";

const icon = (name) => `<svg aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ================= Pages ================= */
const SERVICES = {
  pumping: { path: "/septic-tank-pumping-lehigh-acres/", label: "Septic Tank Pumping", serviceType: "Septic tank pumping" },
  emergency: { path: "/emergency-septic-service-lehigh-acres/", label: "Emergency Septic Service", serviceType: "Emergency septic service" },
  locating: { path: "/septic-tank-locating-lehigh-acres/", label: "Septic Tank Locating", serviceType: "Septic tank locating" },
};

const PAGES = [
  {
    src: "index.html",
    out: "index.html",
    path: "/",
    title: "Septic Tank Pumping Lehigh Acres FL | Open 24 Hours | Xpress Septic Pumping",
    description:
      "Septic tank pumping, cleaning and 24-hour emergency septic service in Lehigh Acres, FL. Xpress Septic Pumping is open 24 hours. Call (239) 506-1163.",
    nav: "home",
    home: true,
  },
  {
    src: "septic-tank-pumping.html",
    out: "septic-tank-pumping-lehigh-acres/index.html",
    path: SERVICES.pumping.path,
    title: "Septic Tank Pumping & Cleaning in Lehigh Acres, FL | Cost & FAQ",
    description:
      "Septic tank pumping and cleaning in Lehigh Acres, FL: what affects the cost, how often to pump in Florida and what happens on the day. Open 24 hours: (239) 506-1163.",
    nav: "pumping",
    service: SERVICES.pumping,
    crumb: "Septic Tank Pumping",
  },
  {
    src: "emergency-septic-service.html",
    out: "emergency-septic-service-lehigh-acres/index.html",
    path: SERVICES.emergency.path,
    title: "24-Hour Emergency Septic Pumping in Lehigh Acres, FL | Xpress Septic Pumping",
    description:
      "Septic backing up in Lehigh Acres? Xpress Septic Pumping is open 24 hours. What to do right now, common causes and how we respond. Call (239) 506-1163.",
    nav: "emergency",
    service: SERVICES.emergency,
    crumb: "Emergency Septic Service",
  },
  {
    src: "septic-tank-locating.html",
    out: "septic-tank-locating-lehigh-acres/index.html",
    path: SERVICES.locating.path,
    title: "Septic Tank Locating in Lehigh Acres, FL | Records & Buried Lids",
    description:
      "Can't find your septic tank? Where to find septic tank location records in Lee County, clues to look for, and how Xpress Septic Pumping locates buried lids.",
    nav: "locating",
    service: SERVICES.locating,
    crumb: "Septic Tank Locating",
  },
  {
    src: "privacy.html",
    out: "privacy/index.html",
    path: "/privacy/",
    title: "Privacy Policy | Xpress Septic Pumping",
    description: "How Xpress Septic Pumping handles information sent through this website's quote form or by phone.",
    nav: "",
    crumb: "Privacy Policy",
  },
  {
    src: "404.html",
    out: "404.html",
    path: "/404.html",
    title: "Page Not Found | Xpress Septic Pumping",
    description: "This page doesn't exist. Call Xpress Septic Pumping at (239) 506-1163 or go back to the homepage.",
    nav: "",
    noindex: true,
  },
];

/* ================= Components ================= */
const brandMark = (lazy) =>
  `<img class="brand-mark" src="/assets/logo-mark.svg" alt="" width="36" height="36"${lazy ? ' loading="lazy"' : ""}>`;
const brand = (current, lazy) => `<a class="brand" href="/"${current ? ' aria-current="page"' : ""}>
      ${brandMark(lazy)}
      <span class="brand-name"><strong>Xpress Septic Pumping</strong><span>Lehigh Acres, FL</span></span>
    </a>`;

const callBtn = (loc, label = `Call ${SITE.phoneDisplay}`, cls = "btn btn-call") =>
  `<a class="${cls}" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="${loc}">${icon("phone")} ${label}</a>`;
const quoteBtn = (loc, cls = "btn btn-ghost", label = "Get a Quote") =>
  `<a class="${cls}" href="/#quote" data-track="quote_click" data-loc="${loc}">${label}</a>`;

function header(nav) {
  const cur = (k) => (nav === k ? ' aria-current="page"' : "");
  const links = [
    ["pumping", SERVICES.pumping.path, "Septic Pumping"],
    ["emergency", SERVICES.emergency.path, "24/7 Emergency"],
    ["locating", SERVICES.locating.path, "Tank Locating"],
    ["faq", "/#faq", "FAQ"],
  ];
  const li = links.map(([k, href, t]) => `<li><a href="${href}"${cur(k)}>${t}</a></li>`).join("");
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="container header-inner">
    ${brand(nav === "home")}
    <nav class="primary-nav" aria-label="Main"><ul>${li}</ul></nav>
    <a class="header-phone" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="header"><small>${SITE.open24h ? "Open 24 hours" : "Call"}</small><strong>${SITE.phoneDisplay}</strong></a>
    ${quoteBtn("header", "btn btn-call btn-sm header-quote")}
    <a class="header-call-icon" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="header_mobile">${icon("phone")}<span class="visually-hidden">Call ${SITE.name} at ${SITE.phoneDisplay}</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
      <svg class="icon-open" aria-hidden="true" focusable="false"><use href="#i-menu"/></svg>
      <svg class="icon-close" aria-hidden="true" focusable="false"><use href="#i-close"/></svg>
    </button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile" hidden>
    <ul><li><a href="/">Home</a></li>${li}<li><a href="/#quote">Get a Quote</a></li></ul>
    ${callBtn("mobile_menu")}
  </nav>
</header>`;
}

function googleLinkItems(loc) {
  if (!SITE.gbpUrl) return "";
  const review = SITE.gbpReviewUrl
    ? `<li><a href="${SITE.gbpReviewUrl}" target="_blank" rel="noopener" data-track="review_click" data-loc="${loc}">Leave a Google review</a></li>`
    : "";
  return `<li><a href="${SITE.gbpUrl}" target="_blank" rel="noopener" data-track="gbp_click" data-loc="${loc}">View us on Google</a></li>${review}`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        ${brand(false, true)}
        <p>Septic tank pumping, septic tank cleaning, emergency septic service and septic tank locating for homes in Lehigh Acres and nearby Lee County, Florida.</p>
        <a class="footer-phone" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="footer">${SITE.phoneDisplay}</a>
        <p class="footer-meta">${SITE.hours}<br><a href="mailto:${SITE.email}">${SITE.email}</a></p>
      </div>
      <div>
        <h2>Services</h2>
        <ul>
          <li><a href="${SERVICES.pumping.path}">Septic tank pumping</a></li>
          <li><a href="${SERVICES.pumping.path}">Septic tank cleaning</a></li>
          <li><a href="${SERVICES.emergency.path}">Emergency septic service</a></li>
          <li><a href="${SERVICES.locating.path}">Septic tank locating</a></li>
        </ul>
      </div>
      <div>
        <h2>Company</h2>
        <ul>
          <li><a href="/#quote">Get a quote</a></li>
          <li><a href="/#service-area">Service area</a></li>
          <li><a href="/#faq">Septic FAQ</a></li>
          ${googleLinkItems("footer")}
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${YEAR} ${SITE.name}. Serving Lehigh Acres and Lee County, Florida.</p>
      <p><a href="/privacy/">Privacy Policy</a></p>
    </div>
  </div>
</footer>
<div class="action-bar">
  ${callBtn("sticky_bar", "Call Now")}
  ${quoteBtn("sticky_bar", "btn btn-ghost", "Get Quote")}
</div>`;
}

function picture(p, { lazy = true, sizes = "(min-width: 1000px) 380px, (min-width: 700px) 50vw, 100vw", priority = false } = {}) {
  const set = (ext) => p.widths.map((w) => `/assets/img/${p.name}-${w}.${ext} ${w}w`).join(", ");
  const big = p.widths.at(-1);
  const load = priority ? ' fetchpriority="high"' : lazy ? ' loading="lazy"' : "";
  return `<picture>
      <source type="image/avif" srcset="${set("avif")}" sizes="${sizes}">
      <source type="image/webp" srcset="${set("webp")}" sizes="${sizes}">
      <img src="/assets/img/${p.name}-${big}.jpg" srcset="${set("jpg")}" sizes="${sizes}" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}" decoding="async"${load}>
    </picture>`;
}

const HERO_SIZES = "(min-width: 900px) 520px, calc(100vw - 40px)";

function heroMedia() {
  if (SITE.heroPhoto) {
    return `<figure class="hero-media is-photo">
      ${picture(SITE.heroPhoto, { lazy: false, priority: true, sizes: HERO_SIZES })}
      ${SITE.heroPhoto.caption ? `<figcaption>${esc(SITE.heroPhoto.caption)}</figcaption>` : ""}
    </figure>`;
  }
  return `<figure class="hero-media">
      <img src="/assets/truck-illustration.svg" width="640" height="340" alt="Illustration of a septic vacuum pump truck" fetchpriority="high">
      <figcaption><span>Septic pumping</span><span>Emergency service</span><span>Tank locating</span></figcaption>
    </figure>`;
}

function heroPreload() {
  if (!SITE.heroPhoto) return "";
  const p = SITE.heroPhoto;
  const set = p.widths.map((w) => `/assets/img/${p.name}-${w}.avif ${w}w`).join(", ");
  return `<link rel="preload" as="image" type="image/avif" imagesrcset="${set}" imagesizes="${HERO_SIZES}" fetchpriority="high">`;
}

function trustStats() {
  const t = SITE.trust || {};
  const items = [];
  if (SITE.gbpRating && SITE.gbpReviewCount)
    items.push([`${SITE.gbpRating}★`, `${SITE.gbpReviewCount} Google reviews`]);
  if (t.yearsInBusiness) items.push([`${t.yearsInBusiness}+`, "years in business"]);
  if (t.jobsCompleted) items.push([t.jobsCompleted, "jobs completed"]);
  if (t.license) items.push(["Licensed", esc(t.license)]);
  if (!items.length) return "";
  return `<section class="stats" aria-label="${SITE.name} at a glance">
  <div class="container"><dl class="stats-list">${items
    .map(([v, l]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`)
    .join("")}</dl></div>
</section>`;
}

function gallerySection() {
  if (!SITE.gallery || !SITE.gallery.length) return "";
  const items = SITE.gallery
    .map((p) => `<figure class="gallery-item">
      ${picture(p)}
      ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}
    </figure>`)
    .join("\n    ");
  return `<section class="section" id="our-work" aria-labelledby="work-heading">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Our equipment &amp; work</p>
      <h2 id="work-heading">Real trucks. Real jobs in Lehigh Acres.</h2>
      <p class="section-lead">Photos from our own equipment and septic jobs around Lee County.</p>
    </div>
    <div class="gallery">
    ${items}
    </div>
  </div>
</section>`;
}

function reviewsSection() {
  const reviews = SITE.reviews || [];
  if (!SITE.gbpUrl && !reviews.length) return "";
  const rating =
    SITE.gbpRating && SITE.gbpReviewCount
      ? `<p class="rating-summary"><span class="stars" aria-hidden="true">★★★★★</span> <strong>${SITE.gbpRating} out of 5</strong> from ${SITE.gbpReviewCount} Google reviews</p>`
      : "";
  const cards = reviews
    .map((r) => `<figure class="review-card">
        ${icon("quote")}
        <blockquote><p>${esc(r.text)}</p></blockquote>
        <figcaption>${r.rating ? `<span class="stars" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}</span>` : ""}<strong>${esc(r.author)}</strong><span class="review-src">Google review${r.date ? ` · ${esc(r.date)}` : ""}</span></figcaption>
      </figure>`)
    .join("\n      ");
  const ctas = [
    SITE.gbpUrl
      ? `<a class="btn btn-dark" href="${SITE.gbpUrl}" target="_blank" rel="noopener" data-track="gbp_click" data-loc="reviews">${icon("external")} Read Our Google Reviews</a>`
      : "",
    SITE.gbpReviewUrl
      ? `<a class="btn btn-line" href="${SITE.gbpReviewUrl}" target="_blank" rel="noopener" data-track="review_click" data-loc="reviews">${icon("star")} Leave a Review</a>`
      : "",
  ].join("");
  return `<section class="section section-alt" id="reviews" aria-labelledby="reviews-heading">
  <div class="container">
    <div class="section-head center">
      <p class="eyebrow">Google reviews</p>
      <h2 id="reviews-heading">What customers say about ${SITE.name}</h2>
      ${rating}
    </div>
    ${cards ? `<div class="review-grid">\n      ${cards}\n    </div>` : ""}
    ${ctas ? `<div class="center-ctas">${ctas}</div>` : ""}
  </div>
</section>`;
}

function quoteSection() {
  return `<section class="section section-dark" id="quote" aria-labelledby="quote-heading">
  <div class="container contact-grid">
    <div>
      <p class="eyebrow">Get a quote</p>
      <h2 id="quote-heading">Need septic service in Lehigh Acres?</h2>
      <p class="section-lead">We're open 24 hours, and calling is the fastest way to get on the schedule. Prefer to write? Send the short form and we'll call you back.</p>
      <a class="big-call" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="quote_section">
        ${icon("phone")}
        <span><small>Call ${SITE.name}</small><strong>${SITE.phoneDisplay}</strong></span>
      </a>
      <ul class="checks">
        <li>${icon("check")}<span>Pump-outs, tank cleaning and septic backups</span></li>
        <li>${icon("check")}<span>Help finding buried tank lids</span></li>
        <li>${icon("check")}<span>Lehigh Acres and nearby Lee County</span></li>
        <li>${icon("check")}<span>${SITE.hours}</span></li>
      </ul>
    </div>
    <div class="form-card">
      <form id="quote-form" novalidate>
        <h3>Request a quote</h3>
        <p class="form-intro">Takes about a minute. We'll call you back.</p>
        <input class="hp-field" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="form-grid">
          <div class="field">
            <label for="name">Name</label>
            <input id="name" name="name" type="text" autocomplete="name" required aria-describedby="name-error">
            <p class="field-error" id="name-error" hidden></p>
          </div>
          <div class="field">
            <label for="phone">Phone</label>
            <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="phone-error">
            <p class="field-error" id="phone-error" hidden></p>
          </div>
          <div class="field">
            <label for="service">Service needed</label>
            <select id="service" name="service" required aria-describedby="service-error">
              <option value="">Choose one…</option>
              <option>Septic tank pumping / cleaning</option>
              <option>Septic backup / emergency</option>
              <option>Find my septic tank</option>
              <option>Septic repair</option>
              <option>Not sure — need advice</option>
            </select>
            <p class="field-error" id="service-error" hidden></p>
          </div>
          <div class="field">
            <label for="zip">Property ZIP code</label>
            <input id="zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="10" required aria-describedby="zip-error">
            <p class="field-error" id="zip-error" hidden></p>
          </div>
          <div class="field full">
            <label for="email">Email <span class="opt">(optional)</span></label>
            <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error">
            <p class="field-error" id="email-error" hidden></p>
          </div>
          <div class="field full">
            <label for="message">Message <span class="opt">(optional)</span></label>
            <textarea id="message" name="message" rows="3" placeholder="What's happening, when it was last pumped, where the lid is…"></textarea>
          </div>
        </div>
        <button class="btn btn-dark btn-block form-submit" type="submit">Send Quote Request</button>
        <p class="form-note">Septic backing up right now? Please call ${SITE.phoneDisplay} instead. See our <a href="/privacy/">privacy policy</a>.</p>
        <p class="form-banner error" id="form-error" role="alert" hidden>Your request didn't go through. Please call <a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a> or try again.</p>
      </form>
      <div class="form-success" id="form-success" tabindex="-1" role="status" hidden>
        ${icon("check")}
        <h3>Request received</h3>
        <p>Thanks. We'll call you back shortly. If it's urgent, call <a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a>.</p>
      </div>
    </div>
  </div>
</section>`;
}

/* ================= Structured data ================= */
const ALL_DAY = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "00:00",
  closes: "23:59",
};

function businessNode() {
  const node = {
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: `${SITE.url}/`,
    telephone: SITE.phoneSchema,
    email: SITE.email,
    logo: `${SITE.url}/assets/apple-touch-icon.png`,
    image: `${SITE.url}/assets/og-xpress-septic-pumping.jpg`,
    description:
      "Septic tank pumping, septic tank cleaning, 24-hour emergency septic service and septic tank locating for homes in Lehigh Acres, Florida.",
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: "US" },
    areaServed: [
      { "@type": "City", name: "Lehigh Acres, Florida", sameAs: "https://en.wikipedia.org/wiki/Lehigh_Acres,_Florida" },
      { "@type": "AdministrativeArea", name: "Lee County, Florida", sameAs: "https://en.wikipedia.org/wiki/Lee_County,_Florida" },
    ],
    knowsAbout: ["Septic tank pumping", "Septic tank cleaning", "Septic pump-outs", "Emergency septic service", "Septic system backups", "Septic tank locating"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Septic services",
      itemListElement: Object.values(SERVICES).map((s) => ({ "@type": "Offer", itemOffered: { "@id": `${SITE.url}${s.path}#service` } })),
    },
  };
  if (SITE.alternateName) node.alternateName = SITE.alternateName;
  if (SITE.open24h) node.openingHoursSpecification = [ALL_DAY];
  if (SITE.gbpUrl) {
    node.sameAs = [SITE.gbpUrl];
    node.hasMap = SITE.gbpUrl;
  }
  // No aggregateRating: Google treats ratings a business marks up about itself as
  // self-serving and ignores them. The rating is shown visibly on the page instead.
  return node;
}

function extractFaq(html) {
  const out = [];
  const re = /<details class="faq-item"[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>\s*<\/details>/g;
  const text = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").replace(/&amp;/g, "&").trim();
  let m;
  while ((m = re.exec(html))) out.push({ q: text(m[1]), a: text(m[2]) });
  return out;
}

function jsonLd(page, body) {
  const pageUrl = `${SITE.url}${page.path}`;
  const graph = [];
  if (page.home) {
    graph.push(businessNode());
    graph.push({ "@type": "WebSite", "@id": `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, publisher: { "@id": `${SITE.url}/#business` }, inLanguage: "en-US" });
  }
  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#business` },
    inLanguage: "en-US",
  };
  if (page.crumb) {
    webPage.breadcrumb = { "@id": `${pageUrl}#breadcrumb` };
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: page.crumb, item: pageUrl },
      ],
    });
  }
  graph.push(webPage);
  if (page.service) {
    const svc = {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: `${page.service.label} in Lehigh Acres, FL`,
      serviceType: page.service.serviceType,
      url: pageUrl,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: { "@type": "City", name: "Lehigh Acres, Florida" },
    };
    if (SITE.open24h) svc.hoursAvailable = ALL_DAY;
    graph.push(svc);
  }
  const faqs = extractFaq(body);
  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

/* ================= Template ================= */
function fill(html) {
  return html
    .replaceAll("{{PHONE}}", SITE.phoneDisplay)
    .replaceAll("{{TEL}}", SITE.phoneTel)
    .replaceAll("{{NAME}}", SITE.name)
    .replaceAll("{{HOURS}}", SITE.hours)
    .replaceAll("{{HERO_MEDIA}}", heroMedia())
    .replaceAll("{{TRUST_STATS}}", trustStats())
    .replaceAll("{{GALLERY_SECTION}}", gallerySection())
    .replaceAll("{{REVIEWS_SECTION}}", reviewsSection())
    .replaceAll("{{QUOTE_SECTION}}", quoteSection())
    .replace(/\{\{call:([a-z_]+)\}\}/g, (_, loc) => callBtn(loc))
    .replace(/\{\{quote:([a-z_]+)\}\}/g, (_, loc) => quoteBtn(loc))
    .replace(/\{\{i:([a-z]+)\}\}/g, (_, n) => {
      if (!ICONS[n]) throw new Error(`Unknown icon ${n}`);
      return icon(n);
    });
}

function render(page) {
  const body = fill(readFileSync(join(root, "src/pages", page.src), "utf8"));
  if (/\{\{[^}]+\}\}/.test(body)) throw new Error(`Unfilled placeholder in ${page.src}: ${body.match(/\{\{[^}]+\}\}/)[0]}`);
  const canonical = `${SITE.url}${page.path}`;
  const ogImage = `${SITE.url}/assets/og-xpress-septic-pumping.jpg`;
  const indexing = page.noindex
    ? '<meta name="robots" content="noindex, follow">'
    : `<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canonical}">`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${indexing}
<meta name="theme-color" content="#0b1a2f">
${page.home ? heroPreload() : ""}
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/styles.css">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${SITE.name}: septic tank pumping in Lehigh Acres, FL. ${SITE.phoneDisplay}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${ogImage}">
${page.noindex ? "" : `<script type="application/ld+json">\n${jsonLd(page, body)}\n</script>`}
</head>
<body>
${sprite}
${header(page.nav)}
<main id="main">
${body.trim()}
</main>
${footer()}
<script src="/script.js" defer></script>
</body>
</html>
`.replace(/\n{3,}/g, "\n\n");
}

for (const page of PAGES) {
  const outPath = join(root, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, render(page));
  console.log("built", page.out);
}

const today = new Date().toISOString().slice(0, 10);
const urls = PAGES.filter((p) => !p.noindex)
  .map((p) => `  <url>\n    <loc>${SITE.url}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join("\n");
writeFileSync(join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log("built sitemap.xml");
