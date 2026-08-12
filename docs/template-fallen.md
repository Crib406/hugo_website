# Fallstricke des Templates

Das Template ist ein gekauftes Agentur-Paket, direkt ins Projekt kopiert. Es
bringt Eigenheiten mit, die beim Anpassen wiederholt Zeit gekostet haben. Jeder
Eintrag: **Symptom → Ursache → Lösung.**

---

## 1. Die Split-Text-Animation

Elemente mit der Klasse `inv-title-animation-wrap` werden von GSAP `SplitText`
in Zeilen, Wörter und **einzelne Buchstaben** zerlegt. Jeder Buchstabe bekommt
`opacity: 0` und wird beim Scrollen gestaffelt eingeblendet
(`static/assets/js/main.js`, ab Zeile 757).

Das erklärt drei verschiedene Fehlerbilder.

### 1a. Leere Buttons

**Symptom:** Ein Button erscheint als farbige Fläche ohne Text.

**Ursache:** Der Button steckt in einem Element mit
`inv-title-animation-wrap`. Sein Text wird mitzerlegt und bleibt auf
`opacity: 0`.

**Lösung:** Den Button aus dem Element herausziehen. Zusätzlich gibt es in
`_modern-refresh.scss` ein Sicherheitsnetz:

```scss
.tmp-btn .btn-text div { opacity: 1 !important; transform: none !important; }
```

**Das ist in diesem Projekt dreimal passiert** — Startseite, Über mich und
404-Seite. Beim Einfügen eines Buttons also immer prüfen, worin er liegt.

### 1b. Verschluckte Leerzeichen

**Symptom:** Im gerenderten Text steht `aufLinkedIn.Ich` statt
`auf LinkedIn. Ich`.

**Ursache:** Die Animation macht aus jedem verschachtelten Element ein eigenes
Wort. Leerzeichen an Element-Grenzen gehen dabei verloren.

### 1c. Satzzeichen auf eigener Zeile

**Symptom:** Der Punkt hinter einem Link rutscht allein in die nächste Zeile.

**Ursache:** Steht das Satzzeichen außerhalb des Links, wird es zu einem
eigenständigen „Wort" und kann umbrechen.

**Lösung für 1b und 1c:** Das Satzzeichen **in** den Link ziehen:

```html
<a href="..."><span>LinkedIn.</span></a> Ich spreche ...
```

Geschützte Leerzeichen (`&nbsp;`) lösen nur 1b und verursachen dabei 1c. Nicht
der richtige Weg.

---

## 2. Spezifitätsfallen

Eigene Regeln stehen in `_modern-refresh.scss`, das als letztes geladen wird.
Bei gleicher Spezifität gewinnt es dadurch. Bei **höherer** Spezifität im
Template gewinnt das Template — auch wenn die eigene Regel später kommt.

Konkret aufgetreten:

| Template-Regel | Klassen | schlägt |
|---|---|---|
| `.text-para-doc-wrap .text-para-documents span` | 2 | `.text-para-documents span` |
| `.tmp-btn.btn-border` | 2 | `.tmp-btn` |
| `.banner-two-main-wrapper .inner .sub-title` | 3 | `.sub-title` |

**Symptom war jeweils:** Die eigene Farbe wurde ignoriert, ohne Fehlermeldung.

**Lösung:** Selektor auf dieselbe Länge bringen. Nicht `!important` benutzen —
außer beim Sicherheitsnetz oben, wo es gegen Inline-Styles aus JavaScript geht.

Sonderfall: `.radius-round` nutzt selbst `!important` (500px Pille). Deshalb
wurde die Klasse aus den Buttons entfernt, statt dagegen anzuschreiben.

---

## 3. Fest verdrahtete Altfarben

Das Template kam mit Neon-Pink. An mehreren Stellen stehen Farben direkt im
Code statt als Variable — die überleben einen Palettenwechsel.

| Stelle | Was | Symptom |
|---|---|---|
| `.rpp-banner-two-area::before/::after` | zwei `#FF014F`-Blurflächen | roter Schimmer hinter dem Hero |
| `.main-img::after` | Verlauf nach `#060606` | Überlagerung über dem Portrait |

Beide sind in `_modern-refresh.scss` überschrieben. **Wenn irgendwo eine Farbe
auftaucht, die nicht zur Palette gehört: nach fest verdrahteten Werten suchen.**

```bash
grep -rn "#FF014F\|#060606" assets/scss
```

---

## 4. Regeln ohne feste Maße

**`.service-card-icon`** hat nur `min-width` und `min-height`, ist aber ein
Block-Element. Gibt man ihm einen Hintergrund, läuft der über die **ganze
Kartenbreite** statt eine Kachel zu bilden. Lösung: feste `width`/`height` und
`margin: auto`.

**`.tmp-btn.btn-border`** setzt `line-height: 57px`. Zusammen mit Padding wird
der Button fast doppelt so hoch. In einem Flex-Container zieht er dann den
Nachbar-Button mit auf seine Höhe.

---

## 5. `tmp-white-version` war nie aktiv

**Symptom:** Anpassungen an der hellen Variante hatten keine Wirkung.

**Ursache:** Im `<body>` stand die Klasse nur als HTML-Kommentar:

```html
<body> <!-- class="tmp-white-version" -->
```

Die Seite lief also immer im dunklen Standard des Templates. Heute ist das die
bewusste Entscheidung — die dunkle Palette ist gesetzt, die Klasse entfernt.

---

## 6. `{{ "/" | relURL }}` liefert nur `/`

**Symptom:** In einer Branch-Vorschau führen „Start", Logo und Breadcrumb auf
die Hauptseite statt in die Vorschau.

**Ursache:** Hugo behandelt einen nackten Schrägstrich als bereits absolut und
hängt den Basispfad nicht an:

| Ausdruck | Ergebnis in der Vorschau |
|---|---|
| `{{ "/" \| relURL }}` | `/` ❌ |
| `{{ "" \| relURL }}` | `/preview/<branch>/` ✓ |
| `{{ "about/" \| relURL }}` | `/preview/<branch>/about/` ✓ |
| `{{ site.Home.RelPermalink }}` | `/preview/<branch>/` ✓ |

Deshalb funktionierten alle anderen Links und ausgerechnet die zur Startseite
nicht.

**Lösung:** Für den Startseiten-Link immer `{{ site.Home.RelPermalink }}`.

---

## 7. Content-Dateien sind keine Templates

In `content/**/*.md` wertet Hugo **keine** `{{ }}`-Ausdrücke aus — sie
erscheinen als Text. Interne Links dort deshalb relativ setzen:

```html
<a href="../kontakt/">…</a>   <!-- richtig -->
<a href="/kontakt/">…</a>     <!-- führt aus der Vorschau heraus -->
```

Wer dort Hugo-Logik braucht, muss einen Shortcode benutzen
(`layouts/shortcodes/`).

---

## 8. HTML und CSS in den Content-Dateien

`content/about/_index.md` und `content/mein-weg/_index.md` enthalten
vollständige HTML-Blöcke samt eigener `<style>`-Bereiche. Deshalb steht in
`hugo.toml` `unsafe = true`.

Das ist die größte Abweichung vom üblichen Hugo-Aufbau: Inhalt und Gestaltung
sind vermischt, und Seiten-CSS steht außerhalb der SCSS-Pipeline. **Bewusst so
belassen.** Wer dort Typografie ändert, muss in die Content-Datei — nicht ins
SCSS.
