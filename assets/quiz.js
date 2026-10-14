/* ============================================================================
   Eliava quiz.js: the homepage "What would slip if you took a week off?" check.
   8 questions in 3 areas. Yes = 2, Sort of = 1, No = 0. The weakest area picks
   the package; the score is never adjusted to steer the result. Nothing is
   saved or sent. The result goes into the application notes only if the
   reader opens the form from the result. No dependencies.
   ========================================================================== */
(function () {
  var form = document.getElementById('quiz-form'); if (!form) return;
  var qs = Array.prototype.slice.call(form.querySelectorAll('.quiz-q'));
  var back = document.getElementById('quiz-back'), fill = document.getElementById('quiz-fill');
  var result = document.getElementById('quiz-result');
  var AREAS = {
    steps: { label: 'Trip steps and deadlines', max: 6 },
    tool:  { label: 'Your trip tool', max: 6 },
    head:  { label: 'What only you know', max: 4 }
  };
  var PICKS = {
    steps: { name: 'Workflow build', door: 'setup', href: '/services/#setup',
      why: "Your trip steps live in your head and your inbox. A workflow build puts them in your tool, so emails and reminders go out on time without you starting each one." },
    tool: { name: 'CRM setup and training', door: 'setup', href: '/services/#setup',
      why: "Your tool could be doing more of the work. I set it up the right way, then teach you and your assistant to use it." },
    head: { name: 'Keep what you know', door: 'library', href: '/services/#library',
      why: "What you know lives in your inbox and your head. I pull it into one private place, with step-by-step guides, so you and anyone you hire can find it." },
    keep: { name: 'Keep it running', door: 'keep', href: '/services/#keep',
      why: "Your systems are in good shape. If you want a steady second pair of hands for the day-to-day, start here. Have just one thing that's stuck? \"Untangle one thing, together\" covers it for $95." }
  };
  var next = document.getElementById('quiz-next');
  var cur = 0, summary = '', timer = 0, lastPointer = 0;

  function go(i, focus) {
    cur = i;
    qs.forEach(function (q, n) { q.hidden = n !== i; });
    back.hidden = i === 0;
    next.hidden = !qs[i].querySelector('input:checked');
    fill.style.width = Math.round(i / qs.length * 100) + '%';
    var first = qs[i].querySelector('input:checked') || qs[i].querySelector('input');
    if (focus && first) first.focus({ preventScroll: true });
  }

  function status(pct) { return pct >= 0.8 ? 'Holding up' : pct >= 0.4 ? 'Some gaps' : 'Would slip'; }

  function finish() {
    var got = { steps: 0, tool: 0, head: 0 }, total = 0;
    qs.forEach(function (q) {
      var v = q.querySelector('input:checked'); var n = v ? +v.value : 0;
      got[q.getAttribute('data-cat')] += n; total += n;
    });
    // Ties go to the first area in AREAS order (steps, then tool, then head).
    var weakest = null, low = 2, lines = [];
    var list = document.getElementById('quiz-cats'); list.replaceChildren();
    Object.keys(AREAS).forEach(function (k) {
      var pct = got[k] / AREAS[k].max;
      if (pct < low) { low = pct; weakest = k; }
      var li = document.createElement('li');
      li.innerHTML = '<span class="quiz-cat-name"></span><span class="quiz-cat-state"></span><span class="quiz-cat-bar" aria-hidden="true"><i></i></span>';
      li.querySelector('.quiz-cat-name').textContent = AREAS[k].label;
      li.querySelector('.quiz-cat-state').textContent = status(pct);
      li.querySelector('i').style.width = Math.round(pct * 100) + '%';
      li.className = 'is-' + status(pct).toLowerCase().replace(/\s+/g, '-');
      list.appendChild(li);
      lines.push(AREAS[k].label + ': ' + status(pct).toLowerCase());
    });
    var pick = PICKS[low >= 0.8 ? 'keep' : weakest];
    document.getElementById('quiz-total').textContent = total;
    document.getElementById('quiz-tier').textContent =
      total >= 13 && low >= 0.4 ? 'Most of it would hold.' : total >= 7 ? 'Some things would slip.' : 'A lot would slip.';
    document.getElementById('quiz-pick-name').textContent = pick.name;
    document.getElementById('quiz-pick-why').textContent = pick.why;
    var btn = document.getElementById('quiz-go'), more = document.getElementById('quiz-more');
    btn.setAttribute('data-apply', pick.door);
    more.href = pick.href;
    more.querySelector('.el-sr') || more.insertAdjacentHTML('beforeend', '<span class="el-sr"></span>');
    more.querySelector('.el-sr').textContent = ': ' + pick.name;
    summary = '1-minute check: ' + total + ' out of 16. ' + lines.join('. ') + '. Suggested start: ' + pick.name + '.';
    fill.style.width = '100%';
    form.hidden = true; result.hidden = false; result.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'nearest' });
  }

  function advance() {
    clearTimeout(timer);
    if (cur < qs.length - 1) go(cur + 1, true); else finish();
  }
  // A mouse or touch answer moves on by itself (even re-picking the same answer
  // after Back). Keyboard answers wait for Next, so arrow keys can reach every option.
  form.addEventListener('pointerdown', function () { lastPointer = Date.now(); });
  form.addEventListener('click', function (e) {
    if (e.target.type !== 'radio' || Date.now() - lastPointer > 1000) return;
    clearTimeout(timer); timer = setTimeout(advance, 220);
  });
  form.addEventListener('change', function (e) { if (e.target.type === 'radio') next.hidden = false; });
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.type === 'radio') { e.preventDefault(); advance(); }
  });
  next.addEventListener('click', advance);
  back.addEventListener('click', function () { clearTimeout(timer); if (cur > 0) go(cur - 1, true); });
  document.getElementById('quiz-again').addEventListener('click', function () {
    clearTimeout(timer); form.reset(); summary = ''; result.hidden = true; form.hidden = false;
    var notes = document.getElementById('a-notes');
    if (notes && notes.value.indexOf('1-minute check:') === 0) notes.value = '';
    go(0, true);
  });
  // Opening the application from the result: carry the result into the notes,
  // unless the reader has already typed their own.
  document.getElementById('quiz-go').addEventListener('click', function () {
    var notes = document.getElementById('a-notes');
    if (notes && summary && (!notes.value || notes.value.indexOf('1-minute check:') === 0)) notes.value = summary;
  });
  go(0);
})();
