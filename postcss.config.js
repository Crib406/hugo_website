// Wirft aus dem fertigen CSS alles heraus, wofuer es auf dieser Seite kein
// Markup gibt. Das Template bringt Stile fuer Dutzende Bausteine mit, die hier
// nie vorkommen — Portfolio, Preistabellen, Team, Testimonials und so weiter.
//
// Gemessen: von 687 KB wurden ueber alle Seiten zusammen 126 KB benutzt, also
// 18 %. Der Rest verzoegerte nur den ersten Anblick, weil CSS das Zeichnen
// blockiert: der Browser muss es vollstaendig geladen und geparst haben, bevor
// er irgendetwas anzeigt.
//
// PurgeCSS entscheidet anhand der Namen im Markup, nicht anhand dessen, was in
// einem bestimmten Browserfenster sichtbar ist. Deshalb bleiben Regeln fuer
// grosse Bildschirme erhalten, auch wenn hier nur ein Handy gemessen wurde.
//
// Laeuft nur beim Produktionsbau (hugo --minify). `hugo server` laesst das CSS
// unangetastet, damit beim Entwickeln nichts fehlt.

// In Fassung 8 ist das Modul selbst die Funktion; ein .default gibt es nicht.
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    purgecss({
      content: [
        './layouts/**/*.html',
        './content/**/*.md',
        './assets/js/**/*.js',
      ],

      // Klassennamen so zerlegen, dass auch a:b und a/b als Ganzes erkannt
      // werden. Die Vorgabe zerschneidet an Sonderzeichen und liefert dann
      // Treffer, die es gar nicht gibt.
      defaultExtractor: (content) => content.match(/[\w-/:%.]+(?<!:)/g) || [],

      safelist: {
        standard: [
          // Vom Zustand abhaengige Klassen, die JS zur Laufzeit setzt und die
          // deshalb in keiner Datei als Text stehen.
          'active', 'active-light', 'active-progress', 'block', 'chat-visible',
          'collapse', 'collapsed', 'collapsing', 'current', 'dark-version',
          'error', 'fade', 'hide', 'in', 'is-hidden', 'is-loading',
          'is-visible', 'letter', 'menu-item-open', 'mleave', 'modal-open',
          'odometer-triggered', 'opacity-0', 'open', 'out', 'play',
          'pointer-event', 'preloader-active', 'selected', 'show', 'showing',
          'sidemenu-active', 'sticky', 'success', 'tmp_side_bar_open',
          // Von SplitText und ScrollTrigger erzeugte Huellen
          'split-line', 'pin-spacer',
          // Grundgeruest
          'html', 'body',
        ],
        deep: [
          // Alles, was mit diesen Praefixen anfaengt, samt Nachfahren
          /^tmp-scroll-trigger/, /^animation-order-/, /^bs-tooltip/,
          /^bs-popover/, /^pin-spacer/, /^swiper/, /^fa-/, /^modal/,
        ],
        greedy: [
          // Zustandsklassen am Koerper, die ganze Regelbloecke aufsperren
          /open$/, /active$/, /show$/,
        ],
        keyframes: true,
        variables: true,
      },

      // Schriftdefinitionen und Keyframes nicht anfassen: @font-face wird ueber
      // font-family angesprochen, nicht ueber eine Klasse, und Keyframes werden
      // teils aus CSS-Variablen heraus benannt — beides erkennt PurgeCSS nicht
      // zuverlaessig.
      fontFace: false,
      keyframes: false,
      variables: false,
    }),
  ],
};
