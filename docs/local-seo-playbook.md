# Xpress Septic Tank Pumping — Local SEO Playbook (Lehigh Acres, FL)

Xpress Septic Tank Pumping is its own business. Never reuse listings, reviews, photos, phone numbers or citations from any similarly named septic company.

**Source of truth:** the Google Business Profile (GBP). The website, the GBP and every directory listing should show exactly the same:

- Name: **Xpress Septic Tank Pumping** (no keywords added)
- Phone: **(239) 506-1163**
- Website: **https://xpressseptictankpumpinglehighacres.com/**

---

## 1. Google Search Console

1. **Create a Domain property.** At search.google.com/search-console, click *Add property*, then *Domain*, and enter `xpressseptictankpumpinglehighacres.com`. Add the TXT record Google gives you at the domain registrar's DNS settings, then click *Verify*. DNS changes can take up to a few hours.
2. **Submit the sitemap.** Go to *Sitemaps* and enter `https://xpressseptictankpumpinglehighacres.com/sitemap.xml`. The status should show *Success* with 4 discovered pages.
3. **Inspect the homepage.** Paste `https://xpressseptictankpumpinglehighacres.com/` into the top bar and click *Test live URL*. Confirm the page can be indexed and the user-declared canonical matches the URL.
4. **Request indexing** for the homepage.
5. **Inspect each service page** and request indexing:
   - `/septic-tank-pumping-lehigh-acres/`
   - `/emergency-septic-service-lehigh-acres/`
   - `/septic-tank-locating-lehigh-acres/`
6. **Monitor queries.** In *Performance → Search results*, filter the query to contain "lehigh" or "septic". Check weekly for the first two months, then monthly. Watch impressions for "septic tank pumping lehigh acres", "septic pumping near me" and "septic tank cleaning lehigh acres".
7. **Monitor indexing.** Check *Pages* for anything under "Not indexed" other than `/quote/` and the 404 page.
8. **Monitor Core Web Vitals.** *Core Web Vitals* needs real Chrome traffic before it shows data, which takes weeks. Until then, use PageSpeed Insights.

Also worth doing: set up **Bing Webmaster Tools** by importing from Search Console. It takes one click and covers Bing plus the search tools built on its index.

---

## 2. Google Business Profile optimization

**Categories**
- Primary: **Septic system service**. This is the closest match to "septic tank pumping" and the single most important local ranking choice.
- Secondary: only add categories that match real work. Don't add "Plumber" unless the company actually does plumbing.

**Business name:** exactly "Xpress Septic Tank Pumping". Adding "Lehigh Acres" or keywords to the name breaks Google's guidelines and can get the profile suspended.

**Address and service area:** if customers don't come to a shop, hide the address and set service areas: Lehigh Acres first, then the nearby places you actually drive to. Never use a virtual office or mailbox address.

**Phone and website:** (239) 506-1163, and `https://xpressseptictankpumpinglehighacres.com/`. Consider adding the homepage URL with UTM tags (`?utm_source=google&utm_medium=organic&utm_campaign=gbp`) so GBP traffic shows up separately in analytics.

**Hours:** **Open 24 hours**, all 7 days. This matches the website and its structured data. Keep holiday hours updated if anything changes.

**Services:** add each one with a short description:
- Septic tank pumping
- Septic tank cleaning
- Emergency septic service
- Septic tank locating
- Septic repairs, only if you do them yourself

**Description** (750 characters max, plain and factual): use the ready-to-paste version in [keyword-map.md](keyword-map.md). It matches the site's wording and the 24-hour hours.

**Photos** have the biggest effect on conversions. Upload real photos only; never AI-generated ones.
- Logo: `assets/apple-touch-icon.png`, or a larger export of `assets/logo-mark.svg`
- Cover photo: the truck, side-on, logo visible, clean, in good light
- Truck photos from several angles and in real Lehigh Acres neighborhoods (no house numbers or license plates of customers)
- Work photos: hose run to a tank, an opened lid, the cleaned-up yard afterward, the crew in branded shirts
- Add 3–5 new photos a month. Profiles that stay active tend to perform better.

**Posts:** one a week. Rotate between a job photo with a line about the work, seasonal tips (rainy season, how often to pump), and a link to a service page.

**Q&A:** Google has been phasing out profile Q&A. If it's still on the profile, add the top 3 questions from the website FAQ yourself and answer them.

**Messaging and bookings:** only turn on messaging if someone will reply within a few hours.

---

## 3. Reviews: the biggest map-pack lever

Ask every customer, the same day, while the job is fresh.

1. From the GBP dashboard, click *Ask for reviews* and copy the short link. Put it in `gbpReviewUrl` in `tools/build-pages.mjs`.
2. Send a text within 2 hours of finishing:
   > Thanks for choosing Xpress Septic Tank Pumping today. If you have a minute, an honest Google review really helps a small local business: [link]
3. Add the same link to ServiceM8 invoices and receipts, and to the email follow-up.
4. Print a QR code of the link on a leave-behind card or door hanger for the tank lid area.
5. **Reply to every review** within 48 hours. Mention the service and area naturally, e.g. "Glad we could get your tank pumped before the weekend." Reply to negative reviews calmly and offer to fix the problem offline.

**Never:** buy reviews, offer discounts or gifts for reviews, only ask happy customers (review gating), post reviews for yourself or have staff or family post them, or copy reviews from another company. Any of these can get reviews removed or the profile suspended.

---

## 4. Citations (directory listings)

Use exactly the same name, phone and website on each. Start with:

1. Apple Business Connect (Apple Maps)
2. Bing Places for Business
3. Facebook business page
4. Yelp
5. Nextdoor business page. Lehigh Acres neighborhoods are active there
6. Better Business Bureau, if you choose to join
7. Angi, HomeAdvisor or Thumbtack, only if you'll actually answer leads
8. Your local Lehigh Acres chamber of commerce directory, if you join

Search for "Xpress Septic" and "(239) 506-1163" every few months to find and fix wrong listings. If a directory mixes you up with a similarly named company, request a correction instead of creating a duplicate listing.

---

## 5. Local links and mentions

Earn these through real relationships. Never buy link packages or use "SEO directories".

- **Real estate agents and home inspectors:** septic questions come up at every sale. Offer them a short one-page "septic basics for buyers" handout. Agents who refer you will often link to you from their resources page.
- **Property managers and landlords:** Lehigh Acres has many rental homes. Offer a scheduled pump-out reminder service.
- **Plumbers and drain companies without a pump truck:** refer work back and forth, and list each other as partners.
- **HOAs and community groups:** offer a short talk or newsletter article on septic care before rainy season.
- **Local sponsorships:** youth sports, school events or community cleanups. The sponsor page usually links to your site.
- **Local news and community blogs:** a useful seasonal tip, like what to do with a septic system after flooding, can earn a mention after big storms.
- **Chamber of commerce membership:** a directory listing plus networking.

---

## 6. Tracking

The site pushes these events to `dataLayer` / `gtag` (see `script.js`):

| Event | When |
|---|---|
| `call_click` | Any tap on the phone number, with `link_location` = header, hero, sticky_bar, etc. |
| `request_click` | "Request Service" buttons |
| `form_submit` / `form_error` | Service request form |
| `gbp_click` / `review_click` | Google profile and review links, once `gbpUrl` is set |

**To add GA4** without hurting speed:
1. Create a GA4 property and copy the Measurement ID (`G-XXXXXXX`).
2. In `tools/build-pages.mjs`, add the standard gtag snippet with `async` just before `</head>`. It costs about 100 KB of JavaScript, but loads async and doesn't block rendering.
3. In GA4, mark `call_click` and `form_submit` as **key events**.
4. Link GA4 to Search Console under *Admin → Product links*.

**Also track:** GBP Insights (calls, website clicks, direction requests) monthly; ServiceM8 job sources ("How did you hear about us?"); and map rankings for "septic tank pumping" from a few points around Lehigh Acres, using a grid rank tracker once a month.

---

## 7. What to do next, in priority order

0. Fix the branded search problem: Google Maps currently shows a different company when people search "Xpress Septic Tank Pumping". See [keyword-map.md](keyword-map.md).
1. Connect the GBP URL and review link on the website.
2. Replace the illustration with real truck photos (see README).
3. Get 10+ genuine reviews in the first 60 days.
4. Complete the top 5 citations.
5. Post weekly on GBP for 3 months.
6. Build the first 3 local partnerships: an agent, an inspector and a property manager.
7. Once repairs or other services are confirmed, add a dedicated page for each **only if** there's enough real detail to make it useful.
