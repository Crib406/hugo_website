# Blog

Neu aufgesetzt im Oktober 2026. Die alten Beiträge und Templates sind
bewusst nicht übernommen worden.

Der Blog ist **noch nicht verlinkt**: nicht im Menü, nicht im Footer, nicht in
der Sitemap. Erreichbar ist er nur über die Adresse `/blog/`.

## Einen Beitrag schreiben

```bash
hugo new blog/mein-thema/index.md
```

Das legt einen Ordner an, kein einzelnes Markdown. Bilder gehören **in
denselben Ordner**:

```
content/blog/mein-thema/
  index.md
  titel.jpg        Titelbild, am besten 16:9 und mindestens 1480px breit
  skizze.jpg       Bild im Text
```

### Frontmatter

| Feld | Pflicht | Wofür |
|---|---|---|
| `title` | ja | Überschrift, Seitentitel, JSON-LD |
| `date` | ja | Veröffentlichung, Sortierung |
| `draft` | ja | `true` = nur in Vorschauen sichtbar |
| `description` | ja | Einleitung unter dem Titel, Meta-Description, Vorschau beim Teilen |
| `summary` | nein | Text in der Übersicht. Fehlt er, nimmt Hugo den Textanfang. |
| `category` | nein | Eine Kategorie, steht in der Meta-Zeile |
| `image` | nein | Dateiname des Titelbilds im Ordner |
| `image_alt` | nein | Alternativtext des Titelbilds |

Mehr braucht es nicht. **Kein JSON-LD im Frontmatter, keine Lesezeit, kein
`type` oder `layout`.** Die strukturierten Daten baut
`layouts/partials/blog/jsonld.html` aus den Feldern oben. Die Lesezeit
berechnet Hugo. Früher stand das JSON-LD in jedem Beitrag von Hand und lief
beim Kopieren auseinander.

### Im Text

- Zwischenüberschriften ab `##`. Die `#` ist der Titel.
- Bilder mit normalem Markdown, die Bildunterschrift in Anführungszeichen:
  `![Alternativtext](skizze.jpg "Bildunterschrift")`
- Interne Links relativ, zum Beispiel `../` für die Übersicht oder
  `../anderer-beitrag/`. Siehe CLAUDE.md.
- Zusammenfassung am Ende:

  ```
  {{</* checklist title="Das Wichtigste" */>}}
  Erster Punkt
  Zweiter Punkt
  {{</* /checklist */>}}
  ```

### Entwürfe ansehen

Ein Beitrag mit `draft: true` erscheint in **jeder Vorschau**
(`creimann.cc/preview/<branch>/blog/`), aber nie auf der Hauptseite. Das
regelt `HUGO_BUILDDRAFTS` im Workflow. Lokal: `hugo server -D`.

Zum Veröffentlichen `draft: false` setzen und nach `main` bringen.

## Aufbau

```
layouts/blog/
  single.html              Beitragsseite, nur das Gerüst
  list.html                Übersicht
  _markup/render-image.html  Bilder im Beitragstext
layouts/partials/blog/
  meta.html                Kategorie · Datum · Lesezeit
  toc.html                 Inhaltsverzeichnis
  picture.html             Bild als WebP in passenden Breiten
  author.html              Autorenbox (partialCached)
  related.html             Zwei weitere Beiträge
  jsonld.html              BlogPosting, BreadcrumbList, Blog
layouts/shortcodes/checklist.html
assets/js/blog-toc.js
assets/scss/elements/_modern-refresh.scss   Abschnitt "Blog"
archetypes/blog.md
```

### Eigene Klassen statt Template-Klassen

Alles Markup trägt Klassen mit `blog-`, die im Template nicht vorkommen. Der
alte Blog benutzte `blog-details-left-area`, `signle-side-bar`, `check-box`
und musste deshalb gegen die Template-Regeln anschreiben: längere Selektoren,
am Ende ein 132-zeiliger `<style>`-Block fast nur aus `!important`. Mit
eigenen Klassen trifft keine Template-Regel, eine Klasse plus Element reicht.

Was trotzdem vom Template durchschlägt, sind die Element-Regeln
(`li`, `ul`, `blockquote`, `p`). Die setzt der Abschnitt „Blog“ im SCSS
zurück, jeweils mit Kommentar.

### Raster und Leiste

Die Beitragsseite ist ein CSS-Grid:

| Breite | Spalten | Bereiche |
|---|---|---|
| ab 1200px | 740px Text, 64px Abstand, 220px Leiste | `head toc` / `body toc` / `end .` |
| darunter | eine Spalte, 740px höchstens | `head` / `toc` / `body` / `end` |

Das Inhaltsverzeichnis steht im HTML **vor** dem Text. So kommt es auf dem
Handy an der richtigen Stelle (eingeklappt unter dem Titelbild) und
Screenreader treffen es vor dem Text. Auf breiten Bildschirmen schiebt es
das Raster nach rechts. Es gibt also nur ein HTML für beide Fälle.

Die Leiste läuft per `position: sticky` mit. Das funktioniert, obwohl `body`
`overflow-x: hidden` trägt: `html` hat keinen Overflow, deshalb geht der Wert
an den Viewport über, und `body` wird kein eigener Scroll-Container. Wer
`html` oder einem Elternelement von `.blog-post` einmal `overflow` gibt,
macht die Leiste starr.

Das Inhaltsverzeichnis erscheint erst ab **drei** Zwischenüberschriften.
Bei weniger bleibt die rechte Spalte leer, der Text steht aber an derselben
Stelle wie in jedem anderen Beitrag.

`blog-toc.js` klappt das Verzeichnis ab 1200px auf, markiert den aktuellen
Abschnitt und füllt den Fortschrittsbalken. Ohne JS bleibt das Verzeichnis in
der Leiste trotzdem sichtbar (CSS zeigt den Inhalt des `<details>` dort
immer). Der Umschaltpunkt 1200px steht zweimal, als `$blog-wide` im SCSS
und im Skript. Wer ihn ändert, ändert beide.

### Bilder

Bilder im Ordner eines Beitrags laufen durch Hugos Bildverarbeitung:
WebP in 740 und 1480px Breite, `width` und `height` im HTML, `lazy` außer beim
Titelbild. Für das Teilen auf LinkedIn und WhatsApp wird das Titelbild
zusätzlich auf 1200×630 zugeschnitten.

Die Originale werden **nicht** veröffentlicht (`publishResources: false` in
`content/blog/_index.md`). Man kann also ruhig große Fotos ablegen.

Das Autorenfoto liegt fertig verkleinert als
`static/assets/images/blog/autor-176.webp` (176px für 88px Anzeige bei
doppelter Pixeldichte). Das Original `cr_autor.webp` daneben braucht „Über
mich“.

## Freischalten

Wenn die ersten echten Beiträge stehen:

1. Den Blog-Eintrag in `layouts/partials/header.html` (zweimal) und
   `footer.html` wieder einkommentieren.
2. In `content/blog/_index.md` beide `sitemap_exclude` entfernen.
3. Die beiden Testartikel löschen.
