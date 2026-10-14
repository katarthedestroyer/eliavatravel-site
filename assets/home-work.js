/* ============================================================================
   Eliava home-work.js: Home only. The "See the work" tabs.
     - Tabs: click or arrow keys switch the sample (WAI-ARIA tabs pattern).
     - The email types itself the first time it's on screen.
     - The checklist ticks itself off, one row at a time.
   Reduced motion, or no IntersectionObserver: everything shows finished.
   ========================================================================== */
(function () {
  'use strict';
  var root = document.getElementById('work');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var played = {};

  /* -------------------------------------------------------------- tabs -- */
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    play(tab.getAttribute('aria-controls'));
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      else if (n) { e.preventDefault(); select(tabs[(i + n + tabs.length) % tabs.length], true); }
    });
  });

  /* ----------------------------------------------------- the animations -- */
  var body = root.querySelector('[data-type]');
  var full = body ? body.textContent : '';
  var checks = Array.prototype.slice.call(root.querySelectorAll('#wp-check .check-list li'));

  function finish(id) {
    if (id === 'wp-email' && body) { body.textContent = full; body.classList.remove('is-typing'); }
    if (id === 'wp-check') checks.forEach(function (li) { li.classList.add('is-done'); });
  }

  function play(id) {
    if (played[id]) return;
    played[id] = true;
    if (reduce) { finish(id); return; }
    if (id === 'wp-email' && body) {
      var i = 0;
      body.textContent = '';
      body.classList.add('is-typing');
      (function type() {
        i += 1 + (Math.random() < 0.3 ? 1 : 0);
        body.textContent = full.slice(0, i);
        if (i < full.length) setTimeout(type, 22 + Math.random() * 30);
        else setTimeout(function () { body.classList.remove('is-typing'); }, 1200);
      })();
    }
    if (id === 'wp-check') {
      checks.forEach(function (li, k) { setTimeout(function () { li.classList.add('is-done'); }, 300 + k * 420); });
    }
  }

  // The first sample plays when the section scrolls into view.
  if (!('IntersectionObserver' in window)) { ['wp-email', 'wp-check'].forEach(finish); played['wp-email'] = played['wp-check'] = true; return; }
  if (body && !reduce) body.textContent = '';
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var on = root.querySelector('[role="tab"][aria-selected="true"]');
      if (on) play(on.getAttribute('aria-controls'));
      io.disconnect();
    });
  }, { threshold: 0.35 });
  io.observe(root.querySelector('.work-stage'));
})();
