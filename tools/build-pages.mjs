// Builds the static HTML pages from src/pages/*.html.
// Shared header, footer, icons, meta tags and JSON-LD come from this file so the business
// name, phone number and Google Business Profile links stay identical on every page.
//
// Run from the repo root:  node tools/build-pages.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ================= Business facts (single source of truth) =================
   Keep these identical to the Google Business Profile. */
export const SITE = {
  name: "Xpress Septic Tank Pumping",
  url: "https://xpressseptictankpumpinglehighacres.com",
  phoneDisplay: "(239) 506-1163",
  phoneTel: "+12395061163",
  phoneSchema: "+1-239-506-1163",
  email: "xpressseptictankpumping@gmail.com",
  city: "Lehigh Acres",
  region: "FL",
  // Paste the exact Google Maps / Business Profile share URL here, then rebuild.
  // While empty, no Google links, review section or sameAs are output.
  gbpUrl: "",
  // "Ask for reviews" link from the Business Profile (g.page/r/.../review). Optional.
  gbpReviewUrl: "",
  // Only fill these in from the live Business Profile. Leave null to hide the rating.
  gbpRating: null,       // e.g. 4.9
  gbpReviewCount: null,  // e.g. 37
  bookingUrl: "/quote/",
  year: new Date().getFullYear(),
};

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
  sparkle: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  rain: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2M16 14v6M8 14v6M12 16v6"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
};

const sprite =
  '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
  Object.entries(ICONS)
    .map(([k, p]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</symbol>`)
    .join("") +
  "</svg>";

const icon = (name) => `<svg aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

/* ================= Pages ================= */
const SERVICES = {
  pumping: {
    path: "/septic-tank-pumping-lehigh-acres/",
    label: "Septic Tank Pumping",
    serviceType: "Septic tank pumping",
  },
  emergency: {
    path: "/emergency-septic-service-lehigh-acres/",
    label: "Emergency Septic Service",
    serviceType: "Emergency septic service",
  },
  locating: {
    path: "/septic-tank-locating-lehigh-acres/",
    label: "Septic Tank Locating",
    serviceType: "Septic tank locating",
  },
};

const PAGES = [
  {
    src: "index.html",
    out: "index.html",
    path: "/",
    title: "Septic Tank Pumping Lehigh Acres, FL | Xpress Septic Tank Pumping",
    description:
      "Septic tank pumping in Lehigh Acres, FL. Xpress Septic Tank Pumping handles routine pump-outs, septic backups and buried-lid locating. Call (239) 506-1163.",
    nav: "home",
  },
  {
    src: "septic-tank-pumping.html",
    out: "septic-tank-pumping-lehigh-acres/index.html",
    path: SERVICES.pumping.path,
    title: "Septic Tank Pumping & Cleaning in Lehigh Acres, FL | Xpress",
    description:
      "Routine septic tank pumping and cleaning for Lehigh Acres homes: how often to pump, what happens on the day, warning signs and what it costs. Call (239) 506-1163.",
    nav: "pumping",
    service: SERVICES.pumping,
    crumb: "Septic Tank Pumping",
  },
  {
    src: "emergency-septic-service.html",
    out: "emergency-septic-service-lehigh-acres/index.html",
    path: SERVICES.emergency.path,
    title: "Emergency Septic Service & Backups in Lehigh Acres, FL | Xpress",
    description:
      "Sewage backing up in Lehigh Acres? What to do right now, what causes septic backups and how Xpress Septic Tank Pumping responds. Call (239) 506-1163.",
    nav: "emergency",
    service: SERVICES.emergency,
    crumb: "Emergency Septic Service",
  },
  {
    src: "septic-tank-locating.html",
    out: "septic-tank-locating-lehigh-acres/index.html",
    path: SERVICES.locating.path,
    title: "Septic Tank Locating in Lehigh Acres, FL | Find Buried Lids | Xpress",
    description:
      "Can't find your septic tank lid? How Xpress Septic Tank Pumping locates buried septic tanks in Lehigh Acres, what records to check first and how to mark it for next time.",
    nav: "locating",
    service: SERVICES.locating,
    crumb: "Septic Tank Locating",
  },
  {
    src: "404.html",
    out: "404.html",
    path: "/404.html",
    title: "Page Not Found | Xpress Septic Tank Pumping",
    description: "This page doesn't exist. Call Xpress Septic Tank Pumping at (239) 506-1163 or go back to the homepage.",
    nav: "",
    noindex: true,
  },
];

/* ================= Partials ================= */
function header(nav) {
  const cur = (k) => (nav === k ? ' aria-current="page"' : "");
  const links = [
    ["pumping", SERVICES.pumping.path, "Septic Pumping"],
    ["emergency", SERVICES.emergency.path, "Emergency"],
    ["locating", SERVICES.locating.path, "Tank Locating"],
    ["faq", "/#faq", "FAQ"],
    ["contact", "/#request", "Request Service"],
  ];
  const li = links.map(([k, href, t]) => `<li><a href="${href}"${cur(k)}>${t}</a></li>`).join("");
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/"${nav === "home" ? ' aria-current="page"' : ""}>
      <img class="brand-mark" src="/assets/logo-mark.svg" alt="" width="38" height="38">
      <span class="brand-name"><strong>Xpress Septic</strong><span>Tank Pumping</span></span>
    </a>
    <nav class="primary-nav" aria-label="Main">
      <ul>${li}</ul>
    </nav>
    <a class="header-phone" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="header"><small>Call now</small><strong>${SITE.phoneDisplay}</strong></a>
    <a class="header-call-icon" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="header_mobile">${icon("phone")}<span class="visually-hidden">Call ${SITE.phoneDisplay}</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
      <svg class="icon-open" aria-hidden="true" focusable="false"><use href="#i-menu"/></svg>
      <svg class="icon-close" aria-hidden="true" focusable="false"><use href="#i-close"/></svg>
    </button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile" hidden>
    <ul><li><a href="/">Home</a></li>${li}</ul>
    <a class="btn btn-call" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="mobile_menu">${icon("phone")} Call ${SITE.phoneDisplay}</a>
  </nav>
</header>`;
}

function googleLinks(loc) {
  if (!SITE.gbpUrl) return "";
  const review = SITE.gbpReviewUrl
    ? `<li><a href="${SITE.gbpReviewUrl}" target="_blank" rel="noopener" data-track="review_click" data-loc="${loc}">Leave us a Google review</a></li>`
    : "";
  return `<li><a href="${SITE.gbpUrl}" target="_blank" rel="noopener" data-track="gbp_click" data-loc="${loc}">View us on Google</a></li>${review}`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/">
          <img class="brand-mark" src="/assets/logo-mark.svg" alt="" width="38" height="38" loading="lazy">
          <span class="brand-name"><strong>Xpress Septic</strong><span>Tank Pumping</span></span>
        </a>
        <p>${SITE.name} provides septic tank pumping for homes in Lehigh Acres, Florida, and nearby Lee County communities.</p>
        <a class="footer-phone" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="footer">${SITE.phoneDisplay}</a>
        <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
      </div>
      <div>
        <h2>Services</h2>
        <ul>
          <li><a href="${SERVICES.pumping.path}">Septic tank pumping</a></li>
          <li><a href="${SERVICES.emergency.path}">Emergency septic service</a></li>
          <li><a href="${SERVICES.locating.path}">Septic tank locating</a></li>
          <li><a href="/#services">Repairs &amp; replacements</a></li>
        </ul>
      </div>
      <div>
        <h2>Company</h2>
        <ul>
          <li><a href="/#request">Request service</a></li>
          <li><a href="/#lehigh-acres">Septic in Lehigh Acres</a></li>
          <li><a href="/#faq">FAQ</a></li>
          ${googleLinks("footer")}
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${SITE.year} ${SITE.name}. Serving Lehigh Acres, FL.</p>
      <p>Septic tank pumping · Lee County, Florida</p>
    </div>
  </div>
</footer>
<div class="action-bar">
  <a class="btn btn-call" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="sticky_bar">${icon("phone")} Call Now</a>
  <a class="btn btn-ghost" href="/#request" data-track="request_click" data-loc="sticky_bar">Request Service</a>
</div>`;
}

function requestSection() {
  return `<section class="section section-dark" id="request" aria-labelledby="request-heading">
  <div class="container contact-grid">
    <div>
      <p class="eyebrow">Request service</p>
      <h2 id="request-heading">Need septic service in Lehigh Acres?</h2>
      <p class="section-lead">Calling is the fastest way to get on the schedule. If you can't talk right now, send the form and we'll call you back.</p>
      <a class="big-call" href="tel:${SITE.phoneTel}" data-track="call_click" data-loc="request_section">
        ${icon("phone")}
        <span><small>Call ${SITE.name}</small><strong>${SITE.phoneDisplay}</strong></span>
      </a>
      <ul class="checks">
        <li>${icon("check")}<span>Routine pump-outs and septic backups</span></li>
        <li>${icon("check")}<span>Help finding buried tank lids</span></li>
        <li>${icon("check")}<span>Lehigh Acres and nearby Lee County</span></li>
      </ul>
    </div>
    <div class="form-card">
      <form id="service-form" novalidate>
        <h3>Send a service request</h3>
        <p class="form-intro">Takes about a minute. Fields marked optional can be skipped.</p>
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
          <div class="field full">
            <label for="location">Service address or ZIP code</label>
            <input id="location" name="location" type="text" autocomplete="street-address" required aria-describedby="location-error">
            <p class="field-error" id="location-error" hidden></p>
          </div>
          <div class="field">
            <label for="service">Service needed</label>
            <select id="service" name="service" required aria-describedby="service-error">
              <option value="">Choose one…</option>
              <option>Septic tank pumping</option>
              <option>Septic backup / emergency</option>
              <option>Find my septic tank</option>
              <option>Septic repair</option>
              <option>Not sure — need advice</option>
            </select>
            <p class="field-error" id="service-error" hidden></p>
          </div>
          <div class="field">
            <label for="email">Email <span class="opt">(optional)</span></label>
            <input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error">
            <p class="field-error" id="email-error" hidden></p>
          </div>
          <fieldset class="field full">
            <legend>How soon do you need us?</legend>
            <div class="radio-row">
              <label><input type="radio" name="urgency" value="Urgent — backing up now"><span>Urgent / backing up</span></label>
              <label><input type="radio" name="urgency" value="This week" checked><span>This week</span></label>
              <label><input type="radio" name="urgency" value="Flexible / routine"><span>Flexible</span></label>
            </div>
          </fieldset>
          <div class="field full">
            <label for="message">Anything we should know? <span class="opt">(optional)</span></label>
            <textarea id="message" name="message" rows="3" placeholder="Last time it was pumped, where the lid is, gate codes, what's happening…"></textarea>
          </div>
        </div>
        <button class="btn btn-dark btn-block" type="submit" style="margin-top:20px">Send Request</button>
        <p class="form-note">For backups happening now, please call ${SITE.phoneDisplay} instead of waiting on the form. We only use your details to respond to this request.</p>
        <p class="form-banner error" id="form-error" role="alert" hidden>Your request didn't go through. Please call <a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a> or try again.</p>
      </form>
      <div class="form-success" id="form-success" tabindex="-1" role="status" hidden>
        ${icon("check")}
        <h3>Request received</h3>
        <p>Thanks — we'll call you back. If it's urgent, call <a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a>.</p>
      </div>
    </div>
  </div>
</section>`;
}

function reviewsSection() {
  if (!SITE.gbpUrl) return "";
  const rating =
    SITE.gbpRating && SITE.gbpReviewCount
      ? `<p class="section-lead"><strong>${SITE.gbpRating} out of 5</strong> from ${SITE.gbpReviewCount} Google reviews</p>`
      : "";
  const leave = SITE.gbpReviewUrl
    ? `<a class="btn btn-line" href="${SITE.gbpReviewUrl}" target="_blank" rel="noopener" data-track="review_click" data-loc="reviews_section">${icon("star")} Leave a review</a>`
    : "";
  return `<section class="section" id="reviews" aria-labelledby="reviews-heading">
  <div class="container">
    <div class="section-head center">
      <p class="eyebrow">Google reviews</p>
      <h2 id="reviews-heading">See what customers say on Google</h2>
      ${rating}
    </div>
    <div class="hero-ctas" style="justify-content:center">
      <a class="btn btn-dark" href="${SITE.gbpUrl}" target="_blank" rel="noopener" data-track="gbp_click" data-loc="reviews_section">${icon("external")} Read our Google reviews</a>
      ${leave}
    </div>
  </div>
</section>`;
}

/* ================= Structured data ================= */
function businessNode() {
  const node = {
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: `${SITE.url}/`,
    telephone: SITE.phoneSchema,
    email: SITE.email,
    logo: `${SITE.url}/assets/apple-touch-icon.png`,
    image: `${SITE.url}/assets/og-xpress-septic-lehigh-acres.jpg`,
    description:
      "Septic tank pumping, septic backup response and septic tank locating for homes in Lehigh Acres, Florida.",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Lehigh Acres, Florida", sameAs: "https://en.wikipedia.org/wiki/Lehigh_Acres,_Florida" },
      { "@type": "AdministrativeArea", name: "Lee County, Florida", sameAs: "https://en.wikipedia.org/wiki/Lee_County,_Florida" },
    ],
    knowsAbout: ["Septic tank pumping", "Septic tank cleaning", "Septic system backups", "Septic tank locating"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Septic services",
      itemListElement: Object.values(SERVICES).map((s) => ({
        "@type": "Offer",
        itemOffered: { "@id": `${SITE.url}${s.path}#service` },
      })),
    },
  };
  if (SITE.gbpUrl) {
    node.sameAs = [SITE.gbpUrl];
    node.hasMap = SITE.gbpUrl;
  }
  if (SITE.gbpRating && SITE.gbpReviewCount) {
    // Only set from the live Business Profile — never estimate.
    node.aggregateRating = { "@type": "AggregateRating", ratingValue: SITE.gbpRating, reviewCount: SITE.gbpReviewCount };
  }
  return node;
}

function extractFaq(html) {
  const out = [];
  const re = /<details class="faq-item"[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>\s*<\/details>/g;
  let m;
  const text = (s) =>
    s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").replace(/&amp;/g, "&").replace(/&rsquo;|&#8217;/g, "’").trim();
  while ((m = re.exec(html))) out.push({ q: text(m[1]), a: text(m[2]) });
  return out;
}

function jsonLd(page, body) {
  const pageUrl = `${SITE.url}${page.path}`;
  const graph = [];
  if (page.path === "/") {
    graph.push(businessNode());
    graph.push({
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      publisher: { "@id": `${SITE.url}/#business` },
      inLanguage: "en-US",
    });
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
    graph.push({
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: `${page.service.label} in Lehigh Acres, FL`,
      serviceType: page.service.serviceType,
      url: pageUrl,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: { "@type": "City", name: "Lehigh Acres, Florida" },
    });
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
    .replaceAll("{{REQUEST_SECTION}}", requestSection())
    .replaceAll("{{REVIEWS_SECTION}}", reviewsSection())
    .replaceAll("{{GOOGLE_LINKS}}", googleLinks("page"))
    .replace(/\{\{i:([a-z]+)\}\}/g, (_, n) => {
      if (!ICONS[n]) throw new Error(`Unknown icon ${n}`);
      return icon(n);
    });
}

function render(page) {
  const body = fill(readFileSync(join(root, "src/pages", page.src), "utf8"));
  const canonical = `${SITE.url}${page.path}`;
  const ogImage = `${SITE.url}/assets/og-xpress-septic-lehigh-acres.jpg`;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const indexing = page.noindex
    ? '<meta name="robots" content="noindex">'
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
<meta name="theme-color" content="#0a1a31">
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
<meta property="og:image:alt" content="${SITE.name} — septic tank pumping in Lehigh Acres, FL — ${SITE.phoneDisplay}">
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
`;
}

for (const page of PAGES) {
  const outPath = join(root, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, render(page));
  console.log("built", page.out);
}

// sitemap.xml — indexable pages only
const today = new Date().toISOString().slice(0, 10);
const urls = PAGES.filter((p) => !p.noindex)
  .map((p) => `  <url>\n    <loc>${SITE.url}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join("\n");
writeFileSync(
  join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log("built sitemap.xml");
