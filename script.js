/* Xpress Septic Pumping — site script (no dependencies) */
(function () {
  "use strict";

  var FORM_ENDPOINT = "https://formsubmit.co/ajax/xpressseptictankpumping@gmail.com";

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

  /* ---------- Quote request form ---------- */
  var form = document.getElementById("quote-form");
  if (!form) return;

  var submitBtn = form.querySelector("[type=submit]");
  var banner = document.getElementById("form-error");
  var success = document.getElementById("form-success");
  var required = ["name", "phone", "zip", "service"];

  function fieldError(id, message) {
    var input = form.querySelector("#" + id);
    var err = document.getElementById(id + "-error");
    if (input) {
      input.classList.toggle("is-invalid", !!message);
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
    if (err) {
      err.textContent = message || "";
      err.hidden = !message;
    }
  }

  function validate() {
    var ok = true;
    var v = function (id) { return (form.elements[id].value || "").trim(); };
    required.forEach(function (id) { fieldError(id, ""); });
    fieldError("email", "");

    if (!v("name")) { fieldError("name", "Please enter your name."); ok = false; }
    var digits = v("phone").replace(/\D/g, "");
    if (digits.length < 10) { fieldError("phone", "Please enter a 10-digit phone number."); ok = false; }
    if (!/^\d{5}(-\d{4})?$/.test(v("zip"))) { fieldError("zip", "Please enter a 5-digit ZIP code."); ok = false; }
    if (!v("service")) { fieldError("service", "Please choose a service."); ok = false; }
    if (v("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) {
      fieldError("email", "Please check the email address.");
      ok = false;
    }
    return ok;
  }

  required.concat("email").forEach(function (id) {
    var el = form.elements[id];
    if (el) el.addEventListener("input", function () { fieldError(id, ""); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    banner.hidden = true;
    if (!validate()) {
      var first = form.querySelector(".is-invalid");
      if (first) first.focus();
      return;
    }
    if (form.elements._gotcha && form.elements._gotcha.value) return;

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });
    data._subject = "Quote request — " + data.service + " (" + data.zip + ")";
    data._template = "table";
    data.page = location.href;
    if (data.email) data._replyto = data.email;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(function (json) {
        if (json && json.success === "false") throw new Error(json.message || "Rejected");
        form.hidden = true;
        success.hidden = false;
        success.focus();
        track("form_submit", { service: data.service });
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Quote Request";
        banner.hidden = false;
        track("form_error");
      });
  });
})();
