// The Google Apps Script web app URL (ends in /exec). Empty = answers are not saved anywhere.
var APPLY_ENDPOINT = "https://script.google.com/macros/s/AKfycbxsy0quKPu7pNr78Y1DU9whTruGuCNx-Hqa8Uau9qE_9Mwqx5WjtgkOX6Kc0HsLqoVZDQ/exec";

/* ============================================================================
   Eliava site.js: shared by every page. Load with defer.
     0. Saving answers (APPLY_ENDPOINT)
     1. Header: sticky shadow (Services), phone menu
     2. The branched application (build plan Task 6, Step 2)
     3. Landing on an anchor from another page
     4. Single Fix next steps: the Loom form on /fix/next/ (kept until the
        Stripe link is off; Single Fix is no longer offered on the site)
   No dependencies. The ScrollCraft engine and home.js are separate files.
   ========================================================================== */

document.documentElement.classList.add('js');

/* ----------------------------------------------------- 0. saving answers -- */
// Sends [key, value] pairs to APPLY_ENDPOINT as a form post and does not wait
// for an answer, so it never holds up the page, and failures stay silent.
// Returns false only when nothing could be sent (no endpoint, or no way to send).
function eliavaSend(pairs) {
  if (!APPLY_ENDPOINT) return false;
  var body = new URLSearchParams();
  pairs.forEach(function (p) { if (p[1] != null && String(p[1]) !== '') body.append(p[0], String(p[1])); });
  try {
    var blob = new Blob([body.toString()], { type: 'application/x-www-form-urlencoded' });
    if (navigator.sendBeacon && navigator.sendBeacon(APPLY_ENDPOINT, blob)) return true;
  } catch (e) {}
  try {
    fetch(APPLY_ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true, body: body }).catch(function () {});
    return true;
  } catch (e) {}
  return false;
}

/* ---------------------------------------------------------- 1. header -- */
(function () {
  var mast = document.querySelector('.mast');
  if (!mast) return;

  // Sticky header (every page but Home) gets a hairline once the page moves.
  if (!document.body.classList.contains('page-home')) {
    var onScroll = function () { mast.classList.toggle('is-scrolled', window.scrollY > 4); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Phone menu.
  var toggle = mast.querySelector('.mast-toggle');
  var links = document.getElementById('mast-links');
  if (!toggle || !links) return;
  function setOpen(open) {
    mast.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
  mast.addEventListener('click', function (e) {
    if (e.target.closest('#mast-links a, [data-apply]')) setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (mast.classList.contains('is-open') && !mast.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mast.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
  var wide = window.matchMedia('(min-width: 768px)');
  var onWide = function (m) { if (m.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);
})();

/* --------------------------------------------------- 2. the application -- */
(function () {
  var CAL = "https://cal.com/kady-dennis/discovery-call";
  var START = '/get-started/';
  var dlg = document.getElementById('apply');
  // Every page without the form: a data-apply link goes to the Get started page,
  // carrying its door (data-apply="setup" -> /get-started/?door=setup).
  if (!dlg) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-apply]'); if (!a) return;
      var pre = a.getAttribute('data-apply');
      e.preventDefault(); location.href = START + (pre ? '?door=' + encodeURIComponent(pre) : '');
    });
    return;
  }
  // On /get-started/ the form sits on the page (a <section id="apply">), not in a dialog.
  var onPage = dlg.tagName !== 'DIALOG';
  if (!onPage && typeof dlg.showModal !== 'function') return;
  var form = document.getElementById('apply-form'), yes = document.getElementById('apply-yes'),
      no = document.getElementById('apply-no'), err = document.getElementById('apply-err');
  var inner = dlg.querySelector('.apply-inner') || dlg;
  var doorSel = form.elements['door'], locFs = document.getElementById('a-location');
  var REQUIRED = { common: ['name','email','role','door','tools','slipping'],
    setup: ['build'] };
  var LABELS = { door:'Needs', role:'Role', business:'Business', tools:'Tools', trips:'Active trips',
    triptypes:'Trip types', slipping:'What keeps slipping', tech:'Tech comfort (1-4)', when:'Start',
    hours:'Help wanted', priorities:'Help first with', level:'Plan', build:'Wants set up', deadline:'Deadline',
    audit:'Wants audit', trainee:'Who needs training',
    location:'Where they are', trainwhat:'Training topic', traintool:'Tool/trip type',
    library:'Wants in library', libnow:'Where it lives now', notes:'Notes' };

  function show(step) {
    [form, yes, no].forEach(function (s) { s.hidden = (s !== step); });
    if (onPage) { if (step !== form) dlg.scrollIntoView({ block: 'start' }); }
    else { inner.scrollTop = 0; dlg.classList.remove('is-scrolled'); }
    if (step !== yes) dlg.classList.remove('has-cal');
    var h = step.querySelector('h2'); if (step !== form && h) h.focus();
  }

  // The Scoping Call calendar (cal.com) opens right inside the application, so
  // nobody leaves the page to book. Its script loads only at this step. If it
  // never loads, "Open it in a new tab" still works.
  var calCount = 0, calData = null;
  function showCal() {
    var box = document.getElementById('apply-cal'); if (!box || !calData) return;
    dlg.classList.add('has-cal');
    yes.querySelectorAll('[data-cal-hide]').forEach(function (el) { el.hidden = false; });
    // A fresh spot and namespace each time, so a second application gets its own answers filled in.
    var ns = 'scoping' + (++calCount), spot = document.createElement('div');
    box.replaceChildren(spot);
    // cal.com's own loader: queues calls until embed.js arrives.
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');
    Cal('init', ns, { origin: 'https://cal.com' });
    Cal.ns[ns]('inline', { elementOrSelector: spot, calLink: 'kady-dennis/discovery-call',
      config: { name: calData.name, email: calData.email, notes: calData.notes, layout: 'month_view', theme: 'light' } });
    Cal.ns[ns]('ui', { theme: 'light', hideEventTypeDetails: true, layout: 'month_view',
      cssVarsPerTheme: { light: { 'cal-brand': '#0B5F70' } } });
    // Once they book, the "not ready" lines under the calendar have done their job.
    Cal.ns[ns]('on', { action: 'bookingSuccessfulV2', callback: function () {
      yes.querySelectorAll('[data-cal-hide]').forEach(function (el) { el.hidden = true; });
    } });
  }
  // Only the chosen door's questions show. The others are hidden AND disabled,
  // so they are never required and never sent. In Train your team, "Where are
  // they based?" shows only when someone other than "Me" needs training.
  function syncDoor() {
    var d = doorSel.value;
    form.querySelectorAll('fieldset[data-door]').forEach(function (fs) {
      var off = fs.getAttribute('data-door') !== d;
      fs.hidden = off; fs.disabled = off;
    });
    if (locFs) { var me = form.elements['trainee'] && form.elements['trainee'].value === 'Me'; locFs.hidden = me; locFs.disabled = me; }
  }
  // The .fld wrapper for a field name (radio and checkbox groups included).
  function wrapOf(name) {
    var el = form.elements[name]; if (!el) return null;
    var node = el.tagName ? el : el[0];
    return node ? node.closest('.fld') : null;
  }
  function clearMarks() {
    form.querySelectorAll('.fld.is-missing').forEach(function (f) { f.classList.remove('is-missing'); });
    form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
  }

  // Any link or button with data-apply opens the application. data-apply="keep|setup|library|train|unsure"
  // picks that door first. The value is read on click, so a page can change it on the fly.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-apply]'); if (!a) return;
    e.preventDefault(); show(form); err.classList.remove('show'); clearMarks();
    var pre = a.getAttribute('data-apply'); if (pre) { doorSel.value = pre; } syncDoor();
    if (onPage) dlg.scrollIntoView({ block: 'start' }); else dlg.showModal();
    setTimeout(function () { var f = document.getElementById('a-name'); if (f) f.focus({ preventScroll: onPage }); }, 30);
  });
  if (onPage) {
    // Arriving from another page: pick the door it named, and carry over a
    // 1-minute check result (quiz.js keeps it for this visit only).
    var q = new URLSearchParams(location.search).get('door');
    if (q && doorSel.querySelector('option[value="' + q.replace(/[^a-z]/g, '') + '"]')) doorSel.value = q;
    var notes = form.elements['notes'], kept = '';
    try { kept = sessionStorage.getItem('eliava-check') || ''; } catch (x) {}
    if (notes && kept && !notes.value) notes.value = kept;
  }
  dlg.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
  // Backdrop clicks close it. A click on the dialog box itself (its own padding or
  // the strip behind the X) does not.
  dlg.addEventListener('click', function (e) {
    if (onPage || e.target !== dlg) return;
    var r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
  });
  inner.addEventListener('scroll', function () { dlg.classList.toggle('is-scrolled', inner.scrollTop > 8); }, { passive: true });
  doorSel.addEventListener('change', syncDoor);
  form.addEventListener('change', function (e) { if (e.target.name === 'trainee') syncDoor(); });
  syncDoor();
  function unmark(e) {
    err.classList.remove('show');
    var f = e.target.closest && e.target.closest('.fld'); if (f) f.classList.remove('is-missing');
    if (e.target.removeAttribute) e.target.removeAttribute('aria-invalid');
  }
  form.addEventListener('change', unmark);
  form.addEventListener('input', unmark);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMarks();
    var d = new FormData(form), door = (d.get('door') || '').toString();
    var need = REQUIRED.common.concat(REQUIRED[door] || []);
    var missing = need.filter(function (k) { return !(d.get(k) || '').toString().trim(); });
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((d.get('email') || '').toString().trim());
    if (missing.length || !emailOk) {
      var onlyEmail = !emailOk && !missing.length;
      if (!emailOk && missing.indexOf('email') < 0) missing.push('email');
      missing.forEach(function (k) {
        var w = wrapOf(k); if (w) w.classList.add('is-missing');
        var el = form.elements[k]; if (el && el.tagName) el.setAttribute('aria-invalid', 'true');
      });
      err.textContent = onlyEmail ? err.dataset.email : err.dataset.missing;
      err.classList.add('show');
      // Bring the first missing answer into view, just under the strip behind
      // the X, and put focus on it, so nobody has to hunt for the red question.
      var first = form.querySelector('.fld.is-missing');
      if (first && onPage) {
        first.scrollIntoView({ block: 'center' });
        var f1 = first.querySelector('input, select, textarea'); if (f1) f1.focus({ preventScroll: true });
      } else if (first) {
        inner.scrollTop += first.getBoundingClientRect().top - inner.getBoundingClientRect().top - 84;
        var field = first.querySelector('input, select, textarea');
        if (field) field.focus({ preventScroll: true });
      }
      return;
    }
    // Valid. Save the answers first, for every door and role (even "Not in
    // travel"), then show the next step. Saving never holds up the page.
    var name = d.get('name').toString().trim(), email = d.get('email').toString().trim();
    var doorText = doorSel.selectedIndex > 0 ? doorSel.options[doorSel.selectedIndex].text : door;
    var lines = ['Application from eliavatravel.com'];
    var pairs = [['type', 'application'], ['door', doorText], ['name', name], ['email', email],
      ['business', (d.get('business') || '').toString().trim()], ['page', location.pathname],
      ['website', (d.get('website') || '').toString()]];
    Object.keys(LABELS).forEach(function (k) {
      var v = d.getAll(k).join(', ').trim();
      if (k === 'door' && doorSel.selectedIndex > 0) v = doorText;
      if (v && (k !== 'priorities' || door === 'keep')) {
        lines.push(LABELS[k] + ': ' + v);
        if (k !== 'door' && k !== 'business') pairs.push([LABELS[k], v]);
      }
    });
    eliavaSend(pairs);

    if (d.get('role') === 'Not in travel') { show(no); return; }
    var body = lines.join('\n');
    var calHref = CAL + '?name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&notes=' + encodeURIComponent(body);
    document.getElementById('apply-go').href = calHref;
    calData = { name: name, email: email, notes: body };
    yes.querySelector('[data-first]').textContent = name.split(/\s+/)[0];

    show(yes);
    showCal();
  });
})();

/* -------------------------------------- 3. landing on an anchor -- */
// A link from another page (/services/#faq) lands before the web fonts swap in,
// and the swap changes the page height. So smooth scrolling stays off until the
// page has loaded (site.css), and once the fonts and the page are in, the target
// is put back in place. Not if the reader has already started scrolling, and
// not on reload or back/forward, where the browser restores its own position.
(function () {
  if (!location.hash) return;
  var nav = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (nav && (nav.type === 'reload' || nav.type === 'back_forward')) return;
  var id = location.hash.slice(1);
  try { id = decodeURIComponent(id); } catch (e) {}
  var target = document.getElementById(id);
  if (!target) return;
  var moved = false;
  var mark = function () { moved = true; };
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, mark, { passive: true, once: true }); });
  function settle() {
    // two frames: let the layout work that also waits on fonts and load run first
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if (!moved) target.scrollIntoView({ block: 'start', behavior: 'instant' });
    }); });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
  if (document.readyState === 'complete') settle(); else window.addEventListener('load', settle);
})();

// Smooth scrolling for in-page links switches on once the page has loaded.
(function () {
  function ready() { requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.add('is-ready'); }); }); }
  if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready);
})();

/* --------------------------- 4. Single Fix next steps: the Loom form -- */
// Only on /fix/next/ (where Stripe sends people after they pay). The form posts
// type=fix-loom to APPLY_ENDPOINT. With no endpoint it opens a prefilled email
// to Kady instead, so the Loom link is never lost.
(function () {
  var form = document.getElementById('loom-form'); if (!form) return;
  var MAIL = "kady@eliavatravel.com";
  var err = document.getElementById('loom-err'), done = document.getElementById('loom-done'),
      mail = document.getElementById('loom-mail'), intro = document.getElementById('loom-intro');
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('eliava-fix') || '{}') || {}; } catch (e) {}
  ['name', 'email'].forEach(function (k) { if (saved[k] && !form.elements[k].value) form.elements[k].value = saved[k]; });

  function val(k) { return (form.elements[k] ? form.elements[k].value : '').trim(); }
  function clearMarks() {
    form.querySelectorAll('.fld.is-missing').forEach(function (f) { f.classList.remove('is-missing'); });
    form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
  }
  function unmark(e) {
    err.classList.remove('show');
    var f = e.target.closest && e.target.closest('.fld'); if (f) f.classList.remove('is-missing');
    if (e.target.removeAttribute) e.target.removeAttribute('aria-invalid');
  }
  form.addEventListener('input', unmark);
  form.addEventListener('change', unmark);

  function finish(step) {
    form.hidden = true; if (intro) intro.hidden = true; step.hidden = false;
    var t = step.querySelector('[tabindex="-1"]'); if (t) t.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMarks();
    var name = val('name'), email = val('email'), loom = val('loom'), look = val('look');
    var bad = ['name', 'email', 'loom'].filter(function (k) { return !val(k); });
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), linkOk = /^https?:\/\/\S+\.\S+$/i.test(loom);
    var msg = bad.length ? err.dataset.missing : !emailOk ? err.dataset.email : !linkOk ? err.dataset.link : '';
    if (email && !emailOk) bad.push('email');
    if (loom && !linkOk) bad.push('loom');
    if (msg) {
      bad.forEach(function (k) {
        var el = form.elements[k]; el.setAttribute('aria-invalid', 'true');
        var w = el.closest('.fld'); if (w) w.classList.add('is-missing');
      });
      err.textContent = msg; err.classList.add('show');
      var first = form.querySelector('.fld.is-missing .in'); if (first) first.focus();
      return;
    }
    var pairs = [['type', 'fix-loom'], ['door', 'Single Fix'], ['name', name], ['email', email],
      ['page', location.pathname], ['website', val('website')],
      ['Loom link', loom], ['What to look at', look], ['Payment ref', saved.ref || '']];
    if (eliavaSend(pairs)) { finish(done); return; }
    var lines = ['Single Fix Loom from eliavatravel.com'];
    pairs.slice(2).forEach(function (p) {
      if (p[1] && p[0] !== 'page' && p[0] !== 'website') lines.push(p[0].charAt(0).toUpperCase() + p[0].slice(1) + ': ' + p[1]);
    });
    document.getElementById('loom-mail-go').href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Single Fix Loom: ' + name) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    finish(mail);
  });
})();
