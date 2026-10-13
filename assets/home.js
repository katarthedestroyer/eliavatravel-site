/* ============================================================================
   Eliava home.js: Home only. Load with defer, AFTER scrollcraft.js.
     1. Trip countdown setup (before the engine mounts)
     2. Mount the ScrollCraft engine
     3. Trip countdown playhead (reads the engine's --sc-p, writes its own state)
     4. Hero depth: scroll layers + fine-pointer lean
     5. Folio: running chapter title
     6. "Which one are you?": the pick carries into the application
   The engine is never edited; everything bespoke lives here.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var smooth = function (x) { x = clamp01(x); return x * x * (3 - 2 * x); };

  /* ------------------------------------------- 1. trip countdown setup -- */
  // The markup's default is the static, fully checked timeline. Reduced motion
  // keeps it that way and takes the pin (and its extra scroll) away entirely.
  var trip = document.querySelector('[data-sc-trip]');
  if (trip) {
    if (reduce) {
      trip.setAttribute('data-sc-act', 'flow');
      trip.removeAttribute('data-sc-span');
      trip.classList.add('is-static');
    } else {
      if (window.innerWidth < 700) trip.setAttribute('data-sc-span', '3.4');
      trip.classList.add('is-live');
    }
  }

  /* ------------------------------------------------------- 2. mount -- */
  if (window.ScrollCraft) window.ScrollCraft.mount(document.body);

  /* ------------------------------------------ 3. trip countdown playhead -- */
  if (trip) (function () {
    var stage = trip.querySelector('[data-sc-stage]');
    var list = trip.querySelector('.trip-list');
    var numEl = trip.querySelector('[data-sc-trip-days-out]');
    var unitEl = trip.querySelector('.trip-unit');
    var stops = Array.prototype.map.call(trip.querySelectorAll('[data-sc-trip-stop]'), function (li) {
      return {
        el: li, dot: li.querySelector('.trip-dot'),
        at: parseFloat(li.getAttribute('data-sc-trip-stop')) || 0,
        days: parseFloat(li.getAttribute('data-sc-trip-days')) || 0
      };
    });
    if (!stage || !list || !numEl || !stops.length) return;
    var N = stops.length;
    var HOLD = 0.55;            // each stop rests for the first 55% of the gap
    var frac = stops.map(function (s, i) { return i / Math.max(N - 1, 1); });

    // Where each dot sits along the line (0 to 1), so the fill reaches a dot
    // exactly when its row checks. Measured, not assumed: rows wrap differently
    // at every width.
    function measure() {
      var lr = list.getBoundingClientRect();
      var c = stops.map(function (s) { var r = s.dot.getBoundingClientRect(); return r.top + r.height / 2 - lr.top; });
      var len = Math.max(c[N - 1] - c[0], 1);
      list.style.setProperty('--line-top', c[0].toFixed(1) + 'px');
      list.style.setProperty('--line-h', len.toFixed(1) + 'px');
      frac = c.map(function (y) { return (y - c[0]) / len; });
      last.p = -1;
    }

    function stateAt(p) {
      var idx = -1;
      for (var i = 0; i < N; i++) if (p >= stops[i].at) idx = i;
      if (idx < 0) return { idx: -1, days: stops[0].days, x: 0 };
      if (idx >= N - 1) return { idx: N - 1, days: 0, x: 1 };
      var a = stops[idx], b = stops[idx + 1], gap = b.at - a.at;
      var t = smooth((p - (a.at + gap * HOLD)) / (gap * (1 - HOLD)));
      var days = Math.ceil(a.days + (b.days - a.days) * t - 1e-6);
      if (days < 1) days = 1;   // never "0 days out"; the next stop is wheels up
      return { idx: idx, days: days, x: frac[idx] + (frac[idx + 1] - frac[idx]) * t };
    }

    var last = { p: -1, idx: -2, days: -1, x: -1, sig: '' };
    function render(p) {
      if (p === last.p) return;
      last.p = p;
      var s = stateAt(p);
      if (s.idx !== last.idx) {
        for (var i = 0; i < N; i++) {
          stops[i].el.classList.toggle('is-done', i <= s.idx);
          stops[i].el.classList.toggle('is-now', i === s.idx);
        }
        trip.classList.toggle('is-wheels', s.idx >= N - 1);
        last.idx = s.idx;
      }
      if (s.idx >= N - 1) {
        if (last.days !== 0) { numEl.textContent = 'Wheels up'; last.days = 0; }
      } else if (s.days !== last.days) {
        numEl.textContent = String(s.days);
        unitEl.textContent = s.days === 1 ? 'day out' : 'days out';
        last.days = s.days;
      }
      var x = Math.round(s.x * 1000) / 1000;
      if (x !== last.x) { trip.style.setProperty('--trip-x', String(x)); last.x = x; }
      // For the verification harness: the rendered state, not raw progress.
      var sig = s.idx + '|' + last.days + '|' + Math.round(x * 100);
      if (sig !== last.sig) { stage.setAttribute('data-sc-verify-state', sig); last.sig = sig; }
      stage.setAttribute('data-sc-verify-hold', p >= stops[N - 1].at ? 'true' : 'false');
    }

    function readP() { return parseFloat(trip.style.getPropertyValue('--sc-p')) || 0; }

    // Its own rAF loop, running only while the act is near the screen.
    var running = false, raf = 0;
    function loop() { raf = requestAnimationFrame(loop); render(readP()); }
    if (reduce) { /* no playhead */ }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
          else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); render(readP()); }
        });
      }, { rootMargin: '25% 0px 25% 0px' }).observe(trip);
    } else {
      window.addEventListener('scroll', function () { requestAnimationFrame(function () { render(readP()); }); }, { passive: true });
    }

    measure();
    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth; measure(); if (!reduce) render(readP());
    }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); if (!reduce) render(readP()); });
    // Reduced motion: the static timeline only needs its line measured.
    if (reduce) return;
    render(readP());
  })();

  /* --------------------------------------------------------- 4. hero depth -- */
  // --k runs 0 to 1 exactly while the hero leaves the screen. --lx/--ly are the
  // pointer lean (fine pointer only). CSS turns both into per-plane transforms.
  var hero = document.getElementById('top');
  var fig = hero && hero.querySelector('.hero-fig');
  if (fig && !reduce) (function () {
    var k = -1, lx = 0, ly = 0, tx = 0, ty = 0, raf = 0, inView = true;
    function frame() {
      raf = 0;
      var end = hero.offsetTop + hero.offsetHeight;
      var nk = Math.round(clamp01(window.scrollY / Math.max(end, 1)) * 1000) / 1000;
      if (nk !== k) { k = nk; fig.style.setProperty('--k', String(k)); }
      var lean = finePointer.matches && window.innerWidth >= 1100;
      if (!lean) { tx = 0; ty = 0; }
      lx += (tx - lx) * 0.08; ly += (ty - ly) * 0.08;
      if (Math.abs(tx - lx) < 0.001) lx = tx;
      if (Math.abs(ty - ly) < 0.001) ly = ty;
      fig.style.setProperty('--lx', lx.toFixed(3));
      fig.style.setProperty('--ly', ly.toFixed(3));
      if (inView && (lx !== tx || ly !== ty)) schedule();
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(frame); }
    window.addEventListener('scroll', function () { if (inView) schedule(); }, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('pointermove', function (e) {
      if (!inView || e.pointerType !== 'mouse') return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      schedule();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { tx = 0; ty = 0; schedule(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) schedule(); else { tx = 0; ty = 0; }
      }).observe(hero);
    }
    schedule();
  })();

  /* ------------------------------------------------------------- 5. folio -- */
  // Shows the chapter under the middle of the screen. Hidden on the title page
  // and in the close (sections with no data-sc-folio) and over the footer.
  var folio = document.querySelector('.folio');
  if (folio && 'IntersectionObserver' in window) (function () {
    var title = folio.querySelector('.folio-title');
    var sections = Array.prototype.slice.call(document.querySelectorAll('#main > section'));
    var hit = new Map();
    function update() {
      var cur = null;
      sections.forEach(function (s) { if (hit.get(s)) cur = s; });
      var label = cur && cur.getAttribute('data-sc-folio');
      if (label) {
        if (title.textContent !== label) title.textContent = label;
        folio.classList.toggle('is-deep', cur.getAttribute('data-folio-tone') === 'deep');
        folio.classList.add('is-on');
      } else {
        folio.classList.remove('is-on');
      }
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { hit.set(e.target, e.isIntersecting); });
      update();
    }, { rootMargin: '-48% 0px -51% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* -------------------------------------- keyboard focus on an entrance -- */
  // The engine reveals [data-sc-in] blocks once they are 12% inside the
  // viewport, but the browser parks a focused link right at the bottom edge,
  // where that has not happened yet. Reveal on focus so a keyboard user never
  // lands on a control at opacity 0.
  document.addEventListener('focusin', function (e) {
    var box = e.target && e.target.closest && e.target.closest('[data-sc-in]:not(.sc-in)');
    if (!box) return;
    box.classList.add('sc-in');
    if (box.hasAttribute('data-sc-stagger')) {
      Array.prototype.forEach.call(box.children, function (kid) { kid.style.transitionDelay = '0ms'; kid.classList.add('sc-in'); });
    }
  });

  /* ------------------------------------------ 6. which one are you? -- */
  var group = document.querySelector('.which-list');
  var cta = document.querySelector('#apply-now [data-apply]');
  var echo = document.querySelector('.apply-now-for');
  if (group && cta && echo) (function () {
    function sync() {
      var on = group.querySelector('input:checked');
      if (!on) return;
      cta.setAttribute('data-apply', on.value);
      echo.textContent = 'For: ' + (on.getAttribute('data-echo') || '');
    }
    group.addEventListener('change', sync);
    sync();   // a pick the browser restored on back/forward
  })();
})();
