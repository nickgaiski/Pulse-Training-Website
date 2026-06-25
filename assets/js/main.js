/* =========================================================================
   PULSE PERSONAL TRAINING — interactions
   ========================================================================= */
(function () {
  'use strict';

  /* ---- Config -------------------------------------------------------------
     To send form submissions straight to your inbox, create a free form at
     https://formspree.io (or similar), then paste your endpoint URL below,
     e.g. "https://formspree.io/f/abcdwxyz".
     Until then, the form gracefully falls back to opening the visitor's email
     app with everything pre-filled to jeff@pulse-training.com, so no lead is
     ever lost.
  ------------------------------------------------------------------------- */
  var FORM_ENDPOINT = '';                       // <-- paste Formspree (or similar) URL here
  var CONTACT_EMAIL = 'jeff@pulse-training.com';

  var header = document.getElementById('header');
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('navDrawer');
  var close = document.getElementById('navClose');

  /* ---- Header solid-on-scroll ---- */
  function onScroll() {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile drawer ---- */
  function openDrawer() {
    drawer.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (close) close.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Footer year ---- */
  var yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---- Lead form ---- */
  var form = document.getElementById('leadForm');
  var statusEl = document.getElementById('formStatus');

  function setStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  function mailtoFallback(data) {
    var subject = 'Discovery Call Request — ' + (data.name || 'New lead');
    var body =
      'Name: ' + (data.name || '') + '\n' +
      'Phone: ' + (data.phone || '') + '\n' +
      'Email: ' + (data.email || '') + '\n' +
      'Goal: ' + (data.goal || '') + '\n\n' +
      'Message:\n' + (data.message || '');
    window.location.href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        goal: form.goal.value,
        message: form.message.value.trim()
      };
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;

      if (!FORM_ENDPOINT) {
        // No backend configured yet — open email app pre-filled.
        setStatus('Opening your email app so you can hit send…', true);
        mailtoFallback(data);
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          setStatus("Thank you! We'll reach out within one business day. 🎉", true);
        } else {
          setStatus('Something went wrong. Please call or text us at 618-792-8250.', false);
          mailtoFallback(data);
        }
      }).catch(function () {
        setStatus('Network issue — opening your email app instead.', false);
        mailtoFallback(data);
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = original;
      });
    });
  }
})();
