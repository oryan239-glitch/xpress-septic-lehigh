/* Rapid Septic Tank Pumping — site script (no dependencies) */
(function () {
  "use strict";

  /* ---------- Event tracking ----------
     Any element with data-track="event_name" is reported on click.
     Events go to window.dataLayer (Google Tag Manager) and gtag (GA4) when either is installed;
     with neither installed this is a no-op. */
  function track(name, params) {
    params = params || {};
    params.page_path = location.pathname;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params));
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-track]") : null;
    if (!el) return;
    track(el.getAttribute("data-track"), { link_location: el.getAttribute("data-loc") || "" });
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-nav");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        setMenu(false);
        toggle.focus();
      }
    });
  }
})();
