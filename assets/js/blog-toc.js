/* Inhaltsverzeichnis eines Blogbeitrags (layouts/partials/blog/toc.html).

   Drei Dinge, alle nur als Ergänzung - ohne dieses Skript ist das
   Inhaltsverzeichnis trotzdem vollständig und benutzbar:
   1. ab 1200px aufklappen (darunter bleibt es eingeklappt)
   2. den Abschnitt markieren, in dem man gerade liest
   3. den Lesefortschritt als Balken zeigen

   Auf allen anderen Seiten endet es in der ersten Zeile. */
(function () {
  'use strict';

  var box = document.querySelector('.blog-toc__box');
  if (!box) return;

  // 1. Aufklappen. Der Umschaltpunkt muss zu $blog-wide in
  //    _modern-refresh.scss passen.
  var wide = window.matchMedia('(min-width: 1200px)');
  function syncOpen() { box.open = wide.matches; }
  syncOpen();
  if (wide.addEventListener) wide.addEventListener('change', syncOpen);

  // 2. Aktueller Abschnitt: die letzte Überschrift, die schon das obere
  //    Drittel des Bildschirms erreicht hat. Bewusst beim Scrollen gemessen
  //    statt per IntersectionObserver: der verpasst Überschriften, über die
  //    ein schneller Sprung (Pos1/Ende, Klick im Verzeichnis) hinweggeht.
  var items = [];
  box.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var heading = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    if (heading) items.push({ link: a, heading: heading });
  });
  var current = null;
  function markCurrent() {
    var line = window.innerHeight / 3;
    var found = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].heading.getBoundingClientRect().top > line) break;
      found = items[i].link;
    }
    // Ganz unten angekommen: der letzte Abschnitt, auch wenn seine
    // Überschrift die Linie nie erreicht.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2 && items.length) {
      found = items[items.length - 1].link;
    }
    if (found === current) return;
    if (current) current.classList.remove('is-active');
    if (found) found.classList.add('is-active');
    current = found;
  }

  // 3. Lesefortschritt, gemessen am Beitragstext.
  var bar = box.querySelector('.blog-toc__progress span');
  var body = document.querySelector('.blog-post__body');
  function progress() {
    if (!bar || !body) return;
    var rect = body.getBoundingClientRect();
    var total = rect.height - window.innerHeight * 0.5;
    var done = (window.innerHeight * 0.3 - rect.top) / total;
    bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, done)) + ')';
  }

  // Beides in einem Frame pro Scrollen
  var pending = false;
  function update() {
    pending = false;
    markCurrent();
    progress();
  }
  window.addEventListener('scroll', function () {
    if (!pending) { pending = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
