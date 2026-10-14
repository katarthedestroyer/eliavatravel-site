/* Working agreement: the contents list marks the section you're reading,
   and on phones keeps that chip in view. No dependencies. */
(function () {
  var toc = document.querySelector('.wa-toc'); if (!toc || !('IntersectionObserver' in window)) return;
  var list = toc.querySelector('ol'), links = {}, on = null;
  toc.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var a = links[e.target.id]; if (!a || a === on) return;
      if (on) on.removeAttribute('aria-current');
      on = a; a.setAttribute('aria-current', 'true');
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
})();
