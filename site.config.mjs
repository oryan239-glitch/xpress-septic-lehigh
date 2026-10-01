// ============================================================================
//  Xpress Septic Tank Pumping — business facts and trust assets
//  This is the ONE place to update the business identity, Google Business
//  Profile links, reviews, photos and credentials. Then run:
//      node tools/build-pages.mjs
//
//  Rules: only enter real, verifiable information. Anything left empty
//  ("" / null / []) simply does not appear on the site.
// ============================================================================

export default {
  // ---- Identity (must match the Google Business Profile exactly) ----------
  name: "Xpress Septic Tank Pumping",
  // Optional schema alternateName. Leave "" so only one business name exists.
  alternateName: "",
  url: "https://xpressseptictankpumpinglehighacres.com",
  phoneDisplay: "(239) 506-1163",
  phoneTel: "+12395061163",
  phoneSchema: "+1-239-506-1163",
  email: "xpressseptictankpumping@gmail.com",
  city: "Lehigh Acres",
  region: "FL",
  hours: "Open 24 hours, 7 days a week",
  open24h: true,

  // ---- Google Business Profile -------------------------------------------
  // Paste the profile's share link (Google Maps → your listing → Share → Copy link).
  gbpUrl: "https://share.google/f8W3xBO4rIHRu5H44",
  // Permanent Google Maps URL for the same listing (CID). Used in schema sameAs/hasMap.
  gbpMapsUrl: "https://maps.google.com/?cid=9164737309997358183",
  // "Ask for reviews" link from the Business Profile dashboard (g.page/r/…/review).
  gbpReviewUrl: "",
  // Copy from the live profile only. Both must be set for the rating to show.
  // Last checked on the live profile: 2026-10-01 (7 reviews). Update when it changes.
  gbpRating: "5.0",
  gbpReviewCount: 7,

  // Genuine Google review excerpts, copied word for word from the profile.
  // { author: "First name + initial", text: "…", date: "2026-10", rating: 5 }
  reviews: [],

  // ---- Credentials / proof (leave null until verified) --------------------
  trust: {
    yearsInBusiness: null,  // e.g. 8
    license: null,          // e.g. "Florida septic contractor SR0000000"
    jobsCompleted: null,    // e.g. "2,000+"
  },

  // ---- Real photos --------------------------------------------------------
  // Generate files with: node tools/build-photos.mjs  (originals go in photos/)
  // Each entry: { name: "xpress-truck-side", width: 1600, height: 1066,
  //               widths: [480, 800, 1200, 1600], alt: "…", caption: "…" }
  heroPhoto: {
    name: "xpress-truck-crew",
    width: 800,
    height: 516,
    widths: [480, 800],
    alt: "Xpress Septic Tank Pumping vacuum truck and crew at a residential job",
    caption: "Our pump truck on a residential job",
  },
  gallery: [],
};
