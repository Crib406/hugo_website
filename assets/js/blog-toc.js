/* Inhaltsverzeichnis eines Blogbeitrags (layouts/partials/blog/toc.html):
   markiert den Abschnitt, in dem man gerade liest. Nur eine Ergaenzung,
   ohne das Skript ist das Verzeichnis trotzdem vollstaendig.

   Aktuell ist die letzte Ueberschrift, die schon das obere Drittel des
   Bildschirms erreicht hat. Bewusst beim Scrollen gemessen statt per
   IntersectionObserver: der verpasst Ueberschriften, ueber die ein schneller
   Sprung (Pos1/Ende, Klick im Verzeichnis) hinweggeht.

   Auf allen anderen Seiten endet es in der ersten Zeile. */
(function () {
  'use strict';

  var toc = document.querySelector('.blog-toc');
  if (!toc) return;

  var items = [];
  toc.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var heading = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    if (heading) items.push({ link: a, heading: heading });
  });
  if (!items.length) return;

  var current = null;
  function update() {
    pending = false;
    var line = window.innerHeight / 3;
    var found = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].heading.getBoundingClientRect().top > line) break;
      found = items[i].link;
    }
    if (found === current) return;
    if (current) current.classList.remove('is-active');
    if (found) found.classList.add('is-active');
    current = found;
  }

  var pending = false;
  window.addEventListener('scroll', function () {
    if (!pending) { pending = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
