/* ==========================================================================
   GETIIT — main.js (HTML variant)
   Small, dependency-free enhancements: theme toggle, mobile nav,
   reveal-on-scroll, contact-form validation, footer year.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Theme toggle (persisted) ---- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var stored = null;
  try { stored = localStorage.getItem("getiit-theme"); } catch (e) {}
  if (stored) root.setAttribute("data-theme", stored);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      // If unset, infer from current system preference so the first click flips visibly.
      if (!current) {
        current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("getiit-theme", next); } catch (e) {}
    });
  }

  /* ---- Mobile navigation ---- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Contact form (front-end only) ---- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      ["name", "email", "message"].forEach(function (id) {
        var input = document.getElementById(id);
        var field = input.closest(".field");
        var ok = input.value.trim() !== "" && (id !== "email" || /.+@.+\..+/.test(input.value));
        field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        status.textContent = "Please complete the required fields.";
        status.style.color = "#d64545";
        return;
      }
      status.style.color = "";
      status.textContent = "Thanks — we'll be in touch shortly.";
      form.reset();
    });
  }

  /* ---- Header scroll state ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
