# Design-System

Farben, Schriften und Größen. Alles in
`assets/scss/default/_variables.scss` unter `:root`.

## Farben

Die eigene Palette steht ganz oben in der Datei:

| Variable | Wert | Wofür |
|---|---|---|
| `--color-paper` | `#161A12` | Seitenhintergrund |
| `--color-surface` | `#1E2418` | Karten, abgesetzte Flächen |
| `--color-surface-2` | `#262D1E` | eine Stufe heller |
| `--color-ink` | `#ECEAE0` | Überschriften, heller Text |
| `--color-ink-soft` | `#A8AD9A` | Fließtext |
| `--color-line` | `#333A29` | Linien, Ränder |
| `--color-accent` | `#8FB89A` | Buttons, Icon-Kacheln |
| `--color-accent-strong` | `#2BFF8A` | hervorgehobene Wörter |
| `--color-accent-tint` | `#26332A` | Fläche hinter Icons |
| `--color-brass` | `#D6AA62` | Eyebrow, Ortschip, Vorschau-Leiste |
| `--color-brass-tint` | `#3A331E` | Fläche dazu |

## Zuordnung auf die Template-Variablen

Das Template arbeitet mit eigenen Namen. Diese zeigen jetzt auf die Palette —
**deshalb wirkt eine Änderung an einer einzigen Stelle überall**:

```scss
--color-primary:     var(--color-accent);
--color-primary-alt: var(--color-accent-strong);
--color-secondary:   var(--color-paper);      // body-Hintergrund
--color-heading:     var(--color-ink);
--color-body:        var(--color-ink-soft);
--color-gray:        var(--color-ink-soft);
--color-gray-2:      var(--color-surface);
--color-card:        var(--color-surface);
--color-border:      var(--color-line);
--color-subtitle:    var(--color-brass);
```

Wer eine Farbe ändern will, ändert die Palette oben — nicht diese Zuordnungen.

> `--color-primary-2nd`, `-3rd` und `-4th` stammen noch aus dem Template und
> gehören zu Farbvarianten, die diese Seite nicht nutzt.

## Die Kontrastregel

**Hervorhebungen werden gegen den Fließtext gemessen, nicht gegen den
Hintergrund.** Das klingt selbstverständlich, ist aber der Fehler, der hier
zweimal gemacht wurde.

Der Fließtext ist cremefarben (`#ECEAE0`), der Grund fast schwarz. Eine
Hervorhebung kann also bequem gut lesbar auf dem Grund sein und trotzdem im Satz
untergehen, weil sie dem Creme zu ähnlich ist.

Gemessen wurde der Farbabstand (ΔE) zum Fließtext und der Kontrast zum Grund:

| Farbe | Abstand zum Fließtext | Kontrast zum Grund | Ergebnis |
|---|---|---|---|
| `#6BE6A0` | 53 | 11,3:1 | zu **dunkel**, fällt zurück |
| `#8CFFC0` | 48 | 14,4:1 | Helligkeit passt, aber zu **blass** |
| `#2BFF8A` | **81** | 13,2:1 | richtig |

Die Lehre: Nicht an der Helligkeit drehen, sondern an der **Sättigung**. Zu viel
Weißanteil nähert die Farbe dem Creme an, egal wie hell sie ist.

Wer die Farbe ändert, sollte nachrechnen. Ein kurzes Python-Skript mit ΔE in
CIE-Lab genügt; die Werte oben stammen daraus.

## Schriften

```scss
--font-primary:   'Fraunces', ui-serif, Georgia, serif;        // Überschriften
--font-secondary: 'Source Sans 3', ui-sans-serif, system-ui;   // Fließtext
```

Beide liegen selbst gehostet unter `static/assets/fonts/` als variable
`.woff2`. Kein Google-Fonts-Aufruf — passend zum privacy-first-Anspruch im
`head.html`.

**Achtung:** Das Template setzt global `body { font-family: var(--font-primary) }`
und `h1–h6 { font-family: var(--font-secondary) }` — also Display-Schrift für
Fließtext und umgekehrt. Das ist in
`assets/scss/elements/_modern-refresh.scss` geradegezogen. Nicht wieder
umdrehen.

## Größen

Gemessen im Browser, nicht aus dem Quelltext abgeleitet:

| Element | Desktop | Handy |
|---|---|---|
| Name im Hero (`h1.title`) | 54px | 28px |
| Aussagen-Absatz (`.text-para-documents`) | 38px | 24px |
| Abschnitts-Titel (`.home-section-title`) | 30px | 22px |
| Karten-Titel (`.focus-card h3`) | 20px | 20px |
| Fließtext (`.hero-lead`) | 18px | 18px |

Die Staffelung ist bewusst: Der Aussagen-Absatz lag ursprünglich bei 48px und
konkurrierte damit optisch mit dem Namen. Auf dem Handy war die Reihenfolge
sogar verkehrt — der Abschnitts-Titel war größer als die Aussage.

## Formen

`--radius: 10px` als Grundwert. Karten und Buttons nutzen 12px.

Buttons gibt es in zwei Ausprägungen:

- **primär** — gefüllt in `--color-accent`, Text in `--color-paper`
- **sekundär** — `.btn-border`, nur Umriss

Beide sind in `_modern-refresh.scss` angepasst. Warum das nötig war, steht in
`template-fallen.md`.
