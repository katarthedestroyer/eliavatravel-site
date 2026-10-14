/* ============================================================================
   finder.js: the package finder on /services/ (modeled on
   conversionfactory.co/pricing). Three questions, then the three packages
   that fit best, each with "Book a free call". Answers stay in this browser
   tab; the result rides along to the form notes (same key as the 1-minute
   check), so nobody explains it twice. Nothing is sent from this page.
   ========================================================================= */
(function () {
  var root = document.getElementById('finder');
  if (!root) return;
  root.hidden = false;

  // Same names and prices as the package pages and the Services catalog.
  var P = {
    setup:    { name: 'Set up your Tern, TravelJoy or Travefy', price: 'From $1,175', door: 'setup', href: '/services/setup/',
                line: 'One kind of trip, set up in your tool and running in about three weeks.' },
    map:      { name: 'Automation plan', price: '$295', door: 'map', href: '/services/automation-plan/',
                line: 'One kind of trip, mapped in full, with videos. About two weeks.' },
    catchup:  { name: 'Backlog catch-up', price: 'From $495', door: 'catchup', href: '/services/backlog-catch-up/',
                line: 'A fixed list of overdue work, agreed up front, then done in about two weeks.' },
    keep:     { name: 'Weekly back-office help', price: '$990 a month', door: 'keep', href: '/services/weekly-help/',
                line: 'Weekly help on every step of your trips. Month 1 has no commitment.' },
    handoff:  { name: 'Assistant hand-off kit', price: 'From $495', door: 'handoff', href: '/services/hand-off-kit/',
                line: 'Written steps for one kind of trip, then two live sessions with the person you hire.' },
    embedded: { name: 'Embedded weekly help', price: '$1,980 a month', door: 'keep', href: '/services/weekly-help/',
                line: 'For a busier business or a team. Weekly help, a weekly video recap and one new build each quarter.' },
    crm:      { name: 'CRM setup and training', price: 'Priced after your free call', door: 'setup', href: '/services/setup/',
                line: 'Moving to Tern or another tool, then live training and short videos.' },
    library:  { name: 'Your private library', price: 'From $1,495', door: 'library', href: '',
                line: 'Your templates, contacts, trip steps and hotel notes in one private place.' },
    ai:       { name: 'AI setup and training', price: 'Priced after your free call', door: 'train', href: '',
                line: 'Claude set up with your voice and steps, then taught to you and your assistant.' },
    untangle: { name: 'Untangle one thing, together', price: '$95', door: 'train', href: '',
                line: 'Bring one thing that is stuck. We fix it live on Zoom, and you learn how.' }
  };
  // Ties go to the earlier package in this list.
  var ORDER = ['setup', 'map', 'keep', 'catchup', 'handoff', 'embedded', 'crm', 'library', 'ai', 'untangle'];

  var form = root.querySelector('form'), steps = [].slice.call(root.querySelectorAll('.fd-step'));
  var back = root.querySelector('.fd-back'), next = root.querySelector('.fd-next');
  var count = root.querySelector('.fd-count'), result = root.querySelector('.fd-result');
  var cur = 0, summary = '';

  function answered(i) { return !!steps[i].querySelector('input:checked'); }
  function show(i, focus) {
    cur = i;
    steps.forEach(function (s, n) { s.hidden = n !== i; });
    back.hidden = i === 0;
    next.disabled = !answered(i);
    next.textContent = i === steps.length - 1 ? 'See my top 3' : 'Next';
    count.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
    if (focus) { var f = steps[i].querySelector('input'); if (f) f.focus({ preventScroll: true }); }
  }

  function finish() {
    var score = {}; ORDER.forEach(function (k) { score[k] = 0; });
    var picked = [];
    form.querySelectorAll('input:checked').forEach(function (inp) {
      picked.push(inp.getAttribute('data-say'));
      (inp.getAttribute('data-pts') || '').split(' ').forEach(function (t) {
        if (!t) return; var kv = t.split(':'); score[kv[0]] += +kv[1];
      });
    });
    var top = ORDER.slice().sort(function (a, b) {
      return (score[b] - score[a]) || (ORDER.indexOf(a) - ORDER.indexOf(b));
    }).slice(0, 3);

    var list = result.querySelector('.fd-picks'); list.replaceChildren();
    top.forEach(function (k, n) {
      var p = P[k], li = document.createElement('li');
      li.className = 'fd-pick' + (n === 0 ? ' fd-pick--best' : '');
      li.innerHTML = '<p class="fd-pick-tag"></p><h3 class="fd-pick-name"></h3><p class="fd-pick-line"></p>' +
        '<p class="fd-pick-price"></p><div class="fd-pick-acts"><a class="btn" href="/get-started/">Book a free call</a></div>';
      li.querySelector('.fd-pick-tag').textContent = n === 0 ? 'Best fit' : 'Also a fit';
      li.querySelector('.fd-pick-name').textContent = p.name;
      li.querySelector('.fd-pick-line').textContent = p.line;
      li.querySelector('.fd-pick-price').textContent = p.price;
      var btn = li.querySelector('.btn');
      btn.setAttribute('data-apply', p.door);
      btn.setAttribute('aria-label', 'Book a free call about ' + p.name);
      if (p.href) {
        var more = document.createElement('a');
        more.className = 'el-link'; more.href = p.href; more.textContent = 'See details';
        more.setAttribute('aria-label', 'See details: ' + p.name);
        li.querySelector('.fd-pick-acts').appendChild(more);
      }
      list.appendChild(li);
    });

    summary = 'Package finder: ' + picked.join('; ') + '. Top 3: ' + top.map(function (k) { return P[k].name; }).join(', ') + '.';
    // The form on /get-started/ reads this key (site.js), this visit only.
    try { sessionStorage.setItem('eliava-check', summary); } catch (x) {}
    form.hidden = true; result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'nearest' });
  }

  form.addEventListener('change', function () { next.disabled = !answered(cur); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  next.addEventListener('click', function () {
    if (!answered(cur)) return;
    if (cur < steps.length - 1) show(cur + 1, true); else finish();
  });
  back.addEventListener('click', function () { if (cur > 0) show(cur - 1, true); });
  root.querySelector('.fd-again').addEventListener('click', function () {
    form.reset(); summary = ''; result.hidden = true; form.hidden = false;
    try { if ((sessionStorage.getItem('eliava-check') || '').indexOf('Package finder:') === 0) sessionStorage.removeItem('eliava-check'); } catch (x) {}
    show(0, true);
  });
  show(0);
})();
