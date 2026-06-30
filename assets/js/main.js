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
     app with everything pre-filled to jeff@pulse-training.com, plus a visible
     backup with the phone number, so no lead is ever lost.
  ------------------------------------------------------------------------- */
  var FORM_ENDPOINT = '';                       // <-- paste Formspree (or similar) URL here
  var CONTACT_EMAIL = 'jeff@pulse-training.com';
  var CONTACT_PHONE = '618-792-8250';

  var header = document.getElementById('header');
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('navDrawer');
  var closeBtn = document.getElementById('navClose');
  var inertEls = [header, document.getElementById('top'), document.querySelector('.site-footer')];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progress = document.getElementById('progress');
  var heroImg = document.querySelector('.hero-media .frame img');
  var ticking = false;

  /* ---- Header state + scroll progress + hero parallax ---- */
  function onScroll() {
    var y = window.scrollY;
    if (y > 30) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }
    if (heroImg && !reduceMotion && y < 900) {
      heroImg.style.transform = 'translateY(' + (y * 0.12) + 'px) scale(1.09)';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Seamless marquee (duplicate track so it loops) ---- */
  var mq = document.getElementById('marqueeTrack');
  if (mq && !reduceMotion) { mq.innerHTML += mq.innerHTML; }

  /* ---- Count-up stats (elements with data-count) ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- Mobile drawer (accessible dialog) ---- */
  function focusables() {
    return drawer.querySelectorAll('a[href], button:not([disabled])');
  }
  function setInert(state) {
    inertEls.forEach(function (el) {
      if (!el) return;
      if (state) { el.setAttribute('aria-hidden', 'true'); el.setAttribute('inert', ''); }
      else { el.removeAttribute('aria-hidden'); el.removeAttribute('inert'); }
    });
  }
  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setInert(true);
    if (closeBtn) closeBtn.focus();
  }
  function closeDrawer() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setInert(false);
    toggle.focus();
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
    // Focus trap
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---- Scroll reveal + count-up triggers ---- */
  var reveals = document.querySelectorAll('.reveal, .reveal-mask');
  var counted = new WeakSet();
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted.has(entry.target)) {
          counted.add(entry.target); countUp(entry.target); cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''); });
  }

  /* ---- Footer year ---- */
  var yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---- Lead form ---- */
  var form = document.getElementById('leadForm');
  var statusEl = document.getElementById('formStatus');
  var $ = function (id) { return document.getElementById(id); };

  function setStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.innerHTML = msg;
    statusEl.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  function readForm() {
    return {
      name: $('name').value.trim(),
      phone: $('phone').value.trim(),
      email: $('email').value.trim(),
      goal: $('goal').value,
      message: $('message').value.trim()
    };
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

  var backupMsg = "If your email app didn't open, just call or text us at " +
    '<a href="tel:+16187928250">' + CONTACT_PHONE + '</a>' +
    ' or email <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // clear prior field errors
      form.querySelectorAll('[aria-invalid="true"]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) { firstInvalid.setAttribute('aria-invalid', 'true'); firstInvalid.focus(); }
        setStatus('Please fill in the highlighted fields so we can reach you.', false);
        return;
      }
      var data = readForm();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;

      if (!FORM_ENDPOINT) {
        // No backend configured yet — open email app pre-filled, then show a backup.
        setStatus('Opening your email app so you can hit send… <br>' + backupMsg, true);
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
          setStatus('Something went wrong. ' + backupMsg, false);
          mailtoFallback(data);
        }
      }).catch(function () {
        setStatus('Network issue. ' + backupMsg, false);
        mailtoFallback(data);
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = original;
      });
    });
  }
})();
