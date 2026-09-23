(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#primary-nav");
  var form = document.querySelector("#service-form");
  var success = document.querySelector("#form-success");
  var formError = document.querySelector("#form-error");
  var submitBtn = document.querySelector("#submit-btn");
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/xpressseptictankpumping@gmail.com";

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        nav.classList.remove("is-open");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.pushState) {
        history.pushState(null, "", id);
      }
    });
  });

  if (header) {
    var onScroll = function () {
      header.style.boxShadow =
        window.scrollY > 8 ? "0 8px 24px rgba(0,0,0,0.25)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (!form) return;

  function showError(field, message) {
    var input = form.querySelector("#" + field);
    var err = form.querySelector("#" + field + "-error");
    if (input) input.classList.add("is-invalid");
    if (err) {
      err.hidden = false;
      err.textContent = message;
    }
  }

  function clearError(field) {
    var input = form.querySelector("#" + field);
    var err = form.querySelector("#" + field + "-error");
    if (input) input.classList.remove("is-invalid");
    if (err) {
      err.hidden = true;
      err.textContent = "";
    }
  }

  function clearAllErrors() {
    ["name", "email", "address", "service"].forEach(clearError);
    if (formError) {
      formError.hidden = true;
      formError.textContent = "";
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Sending…" : "Submit Request";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors();

    var name = (form.name.value || "").trim();
    var email = (form.email.value || "").trim();
    var address = (form.address.value || "").trim();
    var service = form.service.value || "";
    var message = (form.message.value || "").trim();
    var valid = true;

    if (!name) {
      showError("name", "Please enter your name.");
      valid = false;
    }
    if (!email) {
      showError("email", "Please enter your email.");
      valid = false;
    } else if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email address.");
      valid = false;
    }
    if (!address) {
      showError("address", "Please enter your address or city.");
      valid = false;
    }
    if (!service) {
      showError("service", "Please select a service.");
      valid = false;
    }

    if (!valid) {
      var firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    setSubmitting(true);

    var payload = {
      name: name,
      email: email,
      address: address,
      service: service,
      message: message,
      _subject: "Xpress Lehigh — Service Request",
      _template: "table",
      _replyto: email
    };

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error((result.data && result.data.message) || "Send failed");
        }
        form.classList.add("is-submitted");
        if (success) {
          success.hidden = false;
          success.setAttribute("tabindex", "-1");
          success.focus();
        }
        form.querySelectorAll("input, select, textarea, button").forEach(function (el) {
          if (el.type !== "submit") el.setAttribute("disabled", "disabled");
        });
        if (submitBtn) submitBtn.disabled = true;
      })
      .catch(function () {
        setSubmitting(false);
        if (formError) {
          formError.hidden = false;
          formError.textContent =
            "We couldn’t send your request just now. Please try again in a minute, or email xpressseptictankpumping@gmail.com directly.";
        }
      });
  });

  ["name", "email", "address", "service"].forEach(function (field) {
    var el = form.querySelector("#" + field);
    if (!el) return;
    el.addEventListener("input", function () {
      clearError(field);
    });
    el.addEventListener("change", function () {
      clearError(field);
    });
  });
})();
