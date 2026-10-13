/* ============================================================================
   Eliava site.js: shared by Home and Services. Load with defer.
     1. Header: sticky shadow (Services), phone menu
     2. The branched application (build plan Task 6, Step 2)
   No dependencies. The ScrollCraft engine and home.js are separate files.
   ========================================================================== */

document.documentElement.classList.add('js');

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
  var MAIL = "kady@eliavatravel.com";
  var dlg = document.getElementById('apply'); if (!dlg || typeof dlg.showModal !== 'function') return;
  var form = document.getElementById('apply-form'), yes = document.getElementById('apply-yes'),
      no = document.getElementById('apply-no'), err = document.getElementById('apply-err');
  var inner = dlg.querySelector('.apply-inner') || dlg;
  var doorSel = form.elements['door'], locFs = document.getElementById('a-location');
  var REQUIRED = { common: ['name','email','role','door','tools','slipping','tech','when'],
    keep: ['hours'], setup: ['build'], fix: ['fix','platform'], train: ['trainee'], unsure: [] };
  var LABELS = { door:'Needs', role:'Role', business:'Business', tools:'Tools', trips:'Active trips',
    triptypes:'Trip types', slipping:'What keeps slipping', tech:'Tech comfort (1-4)', when:'Start',
    hours:'Hours wanted', priorities:'Help first with', level:'Plan', build:'Wants set up', deadline:'Deadline',
    audit:'Wants audit', fix:'Fix', platform:'Tool to fix', due:'Due', trainee:'Who needs training',
    location:'Where they are', traintool:'Tool/trip type', notes:'Notes' };

  function show(step) {
    [form, yes, no].forEach(function (s) { s.hidden = (s !== step); });
    inner.scrollTop = 0; dlg.classList.remove('is-scrolled');
    var h = step.querySelector('h2'); if (step !== form && h) h.focus();
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

  // Any link or button with data-apply opens the application. data-apply="keep|setup|fix|train|unsure"
  // picks that door first. The value is read on click, so a page can change it on the fly.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-apply]'); if (!a) return;
    e.preventDefault(); show(form); err.classList.remove('show'); clearMarks();
    var pre = a.getAttribute('data-apply'); if (pre) { doorSel.value = pre; } syncDoor(); dlg.showModal();
    setTimeout(function () { var f = document.getElementById('a-name'); if (f) f.focus(); }, 30);
  });
  dlg.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
  // Backdrop clicks close it. A click on the dialog box itself (its own padding or
  // the strip behind the X) does not.
  dlg.addEventListener('click', function (e) {
    if (e.target !== dlg) return;
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
      return;
    }
    if (d.get('role') === 'Not in travel') { show(no); return; }
    var lines = ['Application from eliavatravel.com'];
    Object.keys(LABELS).forEach(function (k) {
      var v = d.getAll(k).join(', ').trim();
      if (k === 'door' && doorSel.selectedIndex > 0) v = doorSel.options[doorSel.selectedIndex].text;
      if (v && (k !== 'priorities' || door === 'keep')) lines.push(LABELS[k] + ': ' + v);
    });
    var name = d.get('name').toString().trim(), email = d.get('email').toString().trim(), body = lines.join('\n');
    document.getElementById('apply-go').href = CAL + '?name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&notes=' + encodeURIComponent(body);
    document.getElementById('apply-mail').href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Application: ' + name) + '&body=' + encodeURIComponent(body + '\n\nEmail: ' + email);
    yes.querySelector('[data-first]').textContent = name.split(/\s+/)[0];
    show(yes);
  });
})();
