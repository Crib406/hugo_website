# creimann.cc

Persönliche Website von Christoph B. Reimann. Hugo, dunkle Waldgrün-Palette,
Deployment über GitHub Pages.

Diese Datei ist der Einstieg. Ausführliches steht in `docs/` — das wird **nicht
gebaut** und ist nur für Menschen und Werkzeuge gedacht.

| Thema | Datei |
|---|---|
| Aufbau, SCSS-Pipeline, Deployment | `docs/architektur.md` |
| Farben, Schriften, Größen, Lesebreite | `docs/design-system.md` |
| Fallstricke des Templates | `docs/template-fallen.md` |

## Lokal bauen

Es braucht **zwei** Programme, nicht nur Hugo:

```bash
hugo version      # muss "+extended" enthalten
dart-sass --version
```

Ohne Dart Sass bricht der Build ab mit `no Dart Sass binary found in $PATH`.
Warum das so ist, steht in `docs/architektur.md`.

```bash
hugo server -D          # Entwicklung
hugo --minify           # Produktionsbau nach public/
```

## Die wichtigsten Regeln

**Nie `{{ "/" | relURL }}` benutzen.** Hugo hängt bei einem nackten
Schrägstrich den Basispfad nicht an, wodurch der Link in den Branch-Vorschauen
auf die Hauptseite zeigt. Für die Startseite `{{ site.Home.RelPermalink }}`.

**Buttons niemals in ein Element mit `inv-title-animation-wrap` schachteln.**
Die Split-Text-Animation zerlegt jeden Text darin in Buchstaben mit
`opacity: 0` — der Button erscheint dann leer. Das ist in diesem Projekt schon
dreimal passiert.

**In Content-Dateien werden keine Hugo-Ausdrücke ausgewertet.** `{{ }}` steht
dort als Text. Interne Links deshalb relativ setzen (`../kontakt/`), nie
absolut (`/kontakt/`), sonst führen sie aus der Vorschau heraus.

**CSS und JS gehen als je ein gebündeltes, fingerabdruckbenanntes Paket raus.**
Neue Skripte gehören in die Liste in `layouts/partials/scripts.html`, nicht als
eigenes `<script>` ins Template — und nach `assets/`, nicht nach `static/`.
Die Reihenfolge in der Liste ist bedeutsam: jQuery zuerst, `main.js` zuletzt.
Kein `?v=`-Anhängsel von Hand, das erledigt `fingerprint`.

**Font Awesome liegt nur als Teilmenge vor.** Ein neues Icon erscheint sonst
als leeres Kästchen. Nach jedem neuen Icon:
`python3 tools/build-fontawesome-subset.py && python3 tools/check-icons.py`.
Details in `docs/architektur.md`.

**Textmaße erst nach `document.fonts.ready` messen.** Umbruch, Höhe und
Zeilenzahl vorher zu messen liefert die Werte der Ersatzschrift. `SplitText`
friert den Umbruch dauerhaft ein, siehe `docs/template-fallen.md`, Punkt 12.

**Eigene Anpassungen gehören nach `assets/scss/elements/_modern-refresh.scss`.**
Diese Datei wird als letzte geladen. Beim Überschreiben von Template-Regeln auf
die Spezifität achten, siehe `docs/template-fallen.md`.

**Hervorhebungen werden gegen den Fließtext gemessen, nicht gegen den
Hintergrund.** Eine Farbe kann auf dunklem Grund gut lesbar sein und trotzdem
neben dem cremefarbenen Text zurückfallen.

**Die Lesebreite wird an der Spalte begrenzt, nicht am einzelnen Element, und
in Pixeln statt in `ch`.** Elementweise gedeckelt entstehen unterschiedliche
Kanten auf einer Seite. Und `ch` an einem Container misst dessen eigene
Schriftgröße, nicht die seiner Kinder — beides ist schon passiert, siehe
`docs/template-fallen.md`, Punkt 9.

**Es gibt zwei Fließtextgrößen, nicht mehr.** Lesetext und Nebentext, Werte in
`docs/design-system.md`. Wer eine neue Stelle anlegt, ordnet sie einer der
beiden zu, statt eine dritte Größe zu erfinden.

## Struktur

Standard-Hugo, keine Abweichungen:

```
archetypes/  assets/  content/  layouts/  static/  tools/
```

`assets/` enthält SCSS, CSS und JS — alles, was Hugo verarbeitet. In `static/`
liegen nur noch Bilder und Schriften. `tools/` sind Hilfsskripte samt ihrer
Quelldateien und wird nicht gebaut.

Das Template ist direkt ins Projekt kopiert, nicht als Hugo-Modul oder unter
`themes/` eingebunden. Es gibt also kein Update, das eigene Änderungen
überschreiben könnte.

**Bekannte Altlast:** In `content/about/_index.md` und
`content/mein-weg/_index.md` stehen vollständige HTML-Blöcke samt
`<style>`-Bereichen, weshalb in `hugo.toml` `unsafe = true` gesetzt ist. Inhalt
und Gestaltung sind dort vermischt. Bewusst so belassen.

## Vorschauen

Jeder Push auf `feature/**` oder `claude/**` erzeugt eine Vorschau unter
`creimann.cc/preview/<branch>/`. Übersicht: `creimann.cc/preview/`.
Aufräumen läuft automatisch, Details in `docs/architektur.md`.
