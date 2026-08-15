# Architektur

Wie eine Änderung von der Quelldatei auf die Live-Seite kommt.

## Was gehört wohin

| Ordner | Inhalt |
|---|---|
| `content/` | Texte und Seiten. **Wird gebaut.** |
| `layouts/` | Templates, Partials, Shortcodes |
| `assets/` | SCSS **sowie CSS und JS**. Wird von Hugo verarbeitet, landet nicht 1:1 im Ergebnis. |
| `static/` | Bilder und Schriften. **Wird 1:1 kopiert.** |
| `tools/` | Hilfsskripte und deren Quelldateien. Wird **nicht** gebaut. |
| `docs/` | Diese Doku. Wird **nicht** gebaut. |
| `public/` | Bauergebnis. Nicht eingecheckt. |

Der Unterschied zwischen `assets/` und `static/` ist der wichtigste:
Alles unter `static/` landet unverändert auf dem Server. Alles unter `assets/`
geht durch Hugos Pipeline und wird dabei verarbeitet.

`docs/` ist sicher, weil Hugo ausschließlich `content/` und `static/`
verarbeitet und nur `public/` ausgeliefert wird. Wer es nachprüfen will:

```bash
hugo --minify && find public -ipath "*docs*"   # bleibt leer
```

> Nur falls jemand in den GitHub-Pages-Einstellungen auf „main /docs"
> umstellen würde, wäre der Ordner öffentlich. Aktuell wird über den
> `gh-pages`-Branch ausgeliefert.

## SCSS-Pipeline

Einstiegspunkt ist `assets/scss/style.scss`, das alle Partials importiert.
Kompiliert und mit Bootstrap zu **einer** Datei zusammengelegt wird in
`layouts/partials/head.html`:

```go-html-template
{{ $sassOpts := dict "transpiler" "dartsass" "targetPath" "assets/css/style.css" "outputStyle" "compressed" }}
{{ $styles := slice
     (resources.Get "css/vendor/bootstrap.min.css")
     (resources.Get "scss/style.scss" | css.Sass $sassOpts)
}}
{{ with $styles | resources.Concat "assets/css/bundle.css" | minify | fingerprint "sha256" }}
  <link rel="stylesheet" href="{{ .RelPermalink }}">
{{ end }}
```

Früher lag das SCSS unter `static/assets/scss/`, wurde von Hand kompiliert und
das Ergebnis als `static/assets/css/style.css` eingecheckt. Diese Datei gibt es
nicht mehr — sie entsteht jetzt bei jedem Build.

**Das Ziel muss unter `assets/css/` bleiben.** Das SCSS adressiert die
Schriften relativ als `../fonts/…`; landet das Buendel woanders, zeigt der
Pfad ins Leere.

## Buendelung und Fingerabdruck

CSS und JS gehen je als **eine** Datei raus, minimiert und mit einem
Fingerabdruck aus dem Dateiinhalt im Namen
(`bundle.min.<hash>.css`). Vorher waren es 28 einzelne Dateien mit
`?v=<Bauzeit>` dahinter — dieser Anhang aenderte sich bei **jedem** Bau und
zwang jeden Besucher, alles neu zu laden. Jetzt aendert sich die Adresse nur,
wenn sich die Datei wirklich aendert.

Die Reihenfolge in `layouts/partials/scripts.html` ist die alte und muss sie
bleiben: jQuery zuerst, `main.js` zuletzt. `resources.Concat` haengt in genau
dieser Reihenfolge aneinander, `defer` fuehrt in Dokumentreihenfolge aus.

## Ungenutztes CSS wird ausgesiebt

Das Template bringt Stile für Dutzende Bausteine mit, die es hier nie gab —
Portfolio, Preistabellen, Team, Testimonials und so weiter. Gemessen wurden
**687 KB ausgeliefert und 126 KB benutzt, also 18 %**. Der Rest verzögerte nur
den ersten Anblick, denn CSS blockiert das Zeichnen: der Browser zeigt gar
nichts an, bevor er es vollständig geladen und geparst hat.

PurgeCSS läuft über PostCSS mitten in der Hugo-Pipeline, konfiguriert in
`postcss.config.js`:

```go-html-template
{{ $bundle := $styles | resources.Concat "assets/css/bundle.css" }}
{{ if hugo.IsProduction }}
  {{ $bundle = $bundle | css.PostCSS }}
{{ end }}
{{ with $bundle | minify | fingerprint "sha256" }}
```

Zwei Dinge daran sind Absicht:

**Nur beim Produktionsbau.** `hugo server` lässt das CSS unangetastet, damit
beim Entwickeln garantiert nichts fehlt und der Bau schnell bleibt.

**Vor dem Fingerabdruck.** Sonst stünde im Dateinamen der Hash des
ungekürzten Inhalts, und eine Änderung am Markup — die das Ergebnis des
Aussiebens verändert — käme bei niemandem an, der die Datei schon im
Zwischenspeicher hat.

PurgeCSS entscheidet anhand der Namen im Markup, **nicht** anhand dessen, was
in einem bestimmten Browserfenster sichtbar ist. Regeln für große Bildschirme
bleiben deshalb erhalten. Klassen, die erst JavaScript setzt, stehen in keiner
Datei und müssen in die Freiliste in `postcss.config.js` — dort steht auch,
welche das sind.

> **Neue zustandsabhängige Klasse eingebaut?** Dann gehört sie in die
> Freiliste. Sonst fehlt der Stil nur im Produktionsbau, während lokal alles
> richtig aussieht — der unangenehmste Fehler, den dieses Setup kennt.

Der Bau braucht dadurch zusätzlich Node:

```bash
npm ci            # einmalig, danach nur bei Änderungen an package.json
hugo --minify
```

## Font Awesome liegt als Teilmenge vor

Das Original brachte 545 KB CSS und rund 1,2 MB Icon-Schriften mit, um
22 Icons zu zeichnen. Ausgeliefert wird stattdessen eine Teilmenge:
`assets/scss/vendor/_fontawesome-subset.scss` (2,6 KB) und vier
`static/assets/fonts/fa-subset-*.woff2` (zusammen 7,3 KB).

Beides ist erzeugt, nicht von Hand geschrieben. Wer ein **neues Icon**
einbaut, traegt es in die Liste `ICONS` in
`tools/build-fontawesome-subset.py` ein und laesst laufen:

```bash
python3 tools/build-fontawesome-subset.py   # braucht: pip install fonttools brotli
python3 tools/check-icons.py                # prueft jede Verwendung im Markup
```

`check-icons.py` vergleicht jedes `fa-…` im Markup mit dem Schnitt, in dem es
benutzt wird, und meldet fehlende Zeichen. Ohne diesen Lauf faellt ein
fehlendes Icon erst im Browser auf — als leeres Kaestchen.

Die vollstaendigen Originale liegen in `tools/fontawesome-src/`. Der Ordner
liegt bewusst **nicht** unter `static/`, damit Hugo ihn nicht mit ausliefert.

**Die Reihenfolge der Imports ist bedeutsam.** `elements/modern-refresh` steht
als letztes in `style.scss`, damit eigene Anpassungen die Template-Regeln
überschreiben können.

## Warum Dart Sass zwingend ist

Hugo Extended bringt LibSass mit. Das reicht hier **nicht**, weil das Template
an 11 Stellen in 6 Dateien moderne CSS-Farbsyntax verwendet:

```scss
box-shadow: -3px 0px 20px 4px rgb(100 95 95 / 8%);   // assets/scss/header/_nav.scss:101
```

LibSass ist seit Jahren eingestellt und liest `rgb(...)` als Sass-Funktion. Es
erwartet Kommas und bricht ab:

```
Function rgb is missing argument $green.
```

Betroffen sind `_banner.scss`, `_nav.scss`, `_chatbox.scss`, `_demo.scss`,
`demo-sticky-banner-sticky.scss` und `_color-theme.scss`.

Deshalb `transpiler: dartsass`. Fehlt die Binary, lautet die Meldung:

```
no Dart Sass binary found in $PATH
```

Lokal also **beides** installieren: `hugo` mit `+extended` **und** `dart-sass`.
In der CI erledigt das der Schritt „Install Dart Sass".

*Die Alternative — die 11 Stellen auf `rgba(100, 95, 95, 0.08)` umschreiben und
bei LibSass bleiben — wurde bewusst verworfen: Sie müsste bei jeder
Template-Änderung wiederholt werden, und LibSass wird nicht weiterentwickelt.*

## Deployment

`.github/workflows/build_and_deploy.yml`, ausgelöst bei Push auf `main`,
`feature/**` und `claude/**`.

| Branch | baseURL | Ziel auf `gh-pages` |
|---|---|---|
| `main` | `https://creimann.cc/` | Wurzel |
| alle anderen | `https://creimann.cc/preview/<branch>/` | `preview/<branch>/` |

Die `baseURL` wird zur Bauzeit gesetzt, nicht aus `hugo.toml` gelesen. Deshalb
funktionieren relative Links in den Vorschauen überhaupt — und deshalb ist
`{{ "/" | relURL }}` ein Problem, siehe `template-fallen.md`.

**`keep_files: true`** sorgt dafür, dass ein Branch-Deploy nicht die Hauptseite
löscht. Die Kehrseite: Es wird auch nie etwas entfernt. Genau dafür gibt es das
Aufräumen.

## Vorschauen verwalten

`.github/scripts/preview-tools.sh` (läuft aus einem `gh-pages`-Checkout):

| Befehl | Wirkung |
|---|---|
| `list` | Vorhandene Vorschauen ausgeben |
| `index` | `preview/index.html` neu erzeugen |
| `remove <branch>` | Eine Vorschau löschen |
| `prune` | Alle löschen, deren Branch es nicht mehr gibt |

**Eine Vorschau wird an ihrer `sitemap.xml` erkannt, nicht an der
`index.html`.** Sonst würde jede Unterseite (`preview/<branch>/about/`) als
eigene Vorschau zählen. Hugo legt die Sitemap nur im Wurzelverzeichnis einer
Seite an.

Zwei Workflows nutzen das Skript:

- **`build_and_deploy.yml`**, Job `preview-index`: erzeugt nach jedem Deploy die
  Übersicht unter `creimann.cc/preview/` neu.
- **`preview_cleanup.yml`**: entfernt beim Löschen eines Branches dessen
  Vorschau (`on: delete`), räumt zusätzlich am 1. jeden Monats auf und ist von
  Hand auslösbar.

Zwei Punkte, die man wissen muss:

**Der `delete`-Trigger läuft nur, wenn die Workflow-Datei auf dem
Standard-Branch liegt.** Das ist eine GitHub-Regel. Vor dem Merge greift also
nur der monatliche Lauf oder der manuelle Start.

**Beide Jobs teilen sich die `concurrency`-Gruppe `gh-pages-write`.** Ohne das
könnten Deploy und Aufräumen gleichzeitig auf `gh-pages` schreiben und sich
gegenseitig überschreiben.

## Hinweisleiste in Vorschauen

`layouts/partials/preview-banner.html` zeigt oben eine Leiste mit Branchnamen
und Link zur Übersicht. Sie erkennt am `/preview/` in der `baseURL`, ob sie
erscheinen soll — dadurch braucht es keine Konfiguration und keine
Umgebungsvariable, und auf der Hauptseite bleibt sie automatisch aus.
