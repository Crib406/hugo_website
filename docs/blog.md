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
- Zitate mit normalem Markdown. Der letzte Absatz ist die Quelle:

  ```
  > Das Zitat.
  >
  > Quelle
  ```

- Interne Links relativ, zum Beispiel `../` für die Übersicht oder
  `../anderer-beitrag/`. Siehe CLAUDE.md.
- Zusammenfassung am Ende als Haken-Liste, ein Punkt pro Zeile:

  ```
  {{</* checklist */>}}
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

Gebaut aus den Bausteinen des Templates, nicht neu erfunden. Der Beitrag sieht
damit aus wie „Mein Weg“, die Leiste wie die Blog-Seiten des Templates.

| Teil | Template-Baustein |
|---|---|
| Textspalte | `.blog-details-left-area` mit `.disc` (740px, wie „Mein Weg“) |
| Kopfzeile | `.blog-classic-tag` |
| Titelbild, Bilder im Text | `.thumbnail-top` |
| Zwischenüberschrift `##` | `.title` (wie die Abschnitte auf „Mein Weg“) |
| Zitat | `.quote-area-blog-details` |
| Haken-Liste | `.check-box-wrap` |
| Kontakt am Ende | `.service-card-v1` |
| Leiste | `.tmp-sidebar` mit `.signle-side-bar`: „Über mich“ (`.about-me-details`), „Weitere Beiträge“ (`.recent-post-area`), „Inhalt“ |
| Übersicht | `.blog-classic-card` |

Damit Markdown dieses Markup ergibt, gibt es drei Render-Hooks unter
`layouts/blog/_markup/` (Überschrift, Zitat, Bild) und den Shortcode
`checklist`. Sie gelten nur für den Blog.

```
layouts/blog/
  single.html, list.html
  _markup/render-heading.html     ## -> h2.title
  _markup/render-blockquote.html  > -> .quote-area-blog-details
  _markup/render-image.html       ![]() -> .thumbnail-top, verkleinert
layouts/partials/blog/
  meta.html      Kopfzeile
  picture.html   Bild als WebP in passenden Breiten
  author.html    Kasten "Über mich" (partialCached)
  related.html   Kasten "Weitere Beiträge"
  toc.html       Kasten "Inhalt"
  contact.html   Kontakt-Kacheln
  jsonld.html    BlogPosting, BreadcrumbList, Blog
layouts/shortcodes/checklist.html
assets/js/blog-toc.js
assets/scss/elements/_modern-refresh.scss   Abschnitt "Blog"
archetypes/blog.md
```

Eigenes CSS steht nur dort, wo das Template von der Schriftskala abweicht
(14/16px statt Neben- und Lesetext) oder bei diesem Markup etwas falsch macht
(Aufzählungszeichen, `capitalize` in Titeln, 462px Mindesthöhe der
Listenbilder). Jede Regel hat ihren Grund als Kommentar.

### Die mitlaufende Leiste

Das Template lässt den **letzten** Kasten der Leiste mitlaufen
(`.signle-side-bar:last-child` ist `sticky`, `top: 120px`, in `_blog.scss`).
Deshalb steht „Inhalt“ als letzter Kasten.

Damit das wirkt, muss `.tmp-sidebar` so hoch sein wie die Spalte: `sticky`
wirkt nur innerhalb des Elternelements. Das setzt der Abschnitt „Blog“ ab lg
mit `height: 100%`. Fehlt das, bleibt der Kasten stehen, ohne Fehlermeldung.

Dass `body` `overflow-x: hidden` trägt, stört nicht: `html` hat keinen
Overflow, deshalb geht der Wert an den Viewport. Wer `html` oder einem
Elternelement der Leiste `overflow` gibt, macht sie starr.

„Inhalt“ erscheint erst ab drei Zwischenüberschriften und erst ab 992px.
Darunter steht die Leiste unter dem Text, ein Inhaltsverzeichnis wäre dort
nutzlos. `blog-toc.js` markiert den Abschnitt, in dem man gerade liest.

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
