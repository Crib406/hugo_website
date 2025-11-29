---
# Basis-Metadaten
title: "Vorlage & Testpost – alle wichtigen Hugo-Felder im Einsatz"
date: 2025-11-14T10:00:00+01:00
draft: false        # true = nur im Draft-Modus sichtbar, false = live

# Autor & Anzeige
author: "Max Mustermann"

# SEO / Social
description: "Diese Datei zeigt dir in einem einzigen Hugo-Blogpost die wichtigsten Frontmatter-Felder, Shortcodes und Markdown-Elemente."
seo_title: "Hugo Blogpost Vorlage – alle wichtigen Felder"
seo_description: "Nutze diesen Post als Vorlage, um neue Blogartikel in Hugo zu schreiben."
canonicalURL: "https://example.com/blog/hugo-vorlage-testpost/"

# URL / Routing
slug: "hugo-vorlage-testpost"   # URL-Slug, falls du den Standard nicht willst
aliases:                         # alte URLs, die auf diesen Post weiterleiten
  - "/alt/hugo-test/"
  - "/blog/hugo-template/"

# Kategorien & Tags (Taxonomien)
categories:
  - "Hugo"
  - "Webentwicklung"
tags:
  - "hugo"
  - "static site"
  - "blog"
  - "vorlage"
  - "markdown"

# Spezielle Blog-Parameter für dein Theme
#featured_image: "/assets/images/blog/details/01.png"  # Hero / Teaser Bild
featured_image_alt: "Laptop mit Code-Editor"
category: "Web design"          # falls dein Theme genau dieses Feld nutzt
comments_count: 3               # Dummy-Wert, wenn dein Layout ihn anzeigt

# Steuerung für Layout (Custom-Flags, die du im Theme abfragst)
show_breadcrumb: true
show_sidebar: true
show_toc: true                  # Table of Contents
show_author_box: true
show_related_posts: true

# Layout / Typ (optional, wenn du verschiedene Layouts hast)
type: "blog"                    # kann helfen, wenn du spezielle Typen hast
layout: "single"                # erzwingt ein bestimmtes Layout

# Sonstiges (Beispiele für eigene Flags)
reading_time: 7                 # z. B. "7 min read" im Template
highlight: true                 # könntest du nutzen, um Post hervorzuheben
---

> 💡 **Hinweis:**  
> Diese Datei ist als **Vorlage** gedacht. Kopiere sie, passe Frontmatter an und lösche die Erklär-Textblöcke, sobald du den Mechanismus verstanden hast.

---

# 1. Überschrift (H1) – kommt aus `title`, aber du kannst hier trotzdem starten

Normalerweise renderst du den Titel im Template über `{{ .Title }}`.  
Im Content selbst startest du meist mit einer H2.

---

## 2. Kurz-Zusammenfassung & `<!--more-->` Marker

Der Text **über** dem `<!--more-->`-Marker wird oft als **Teaser / Summary** genutzt:

Dieser erste Absatz beschreibt kurz, worum es im Artikel geht:  
Du lernst hier:

- wie du das Frontmatter aufbauen kannst,
- wie du Markdown-Elemente nutzt,
- wie du Hugo-Shortcodes einsetzt.

<!--more-->

Alles **unterhalb** dieses Markers erscheint üblicherweise nur auf der **Detailseite**, nicht im Teaser auf der Blogübersicht (je nach Theme).

---

## 3. Standard-Markdown: Überschriften, Text, Listen

### 3.1 Normaler Text

Dies ist ein normaler Fließtextabschnitt mit **fett**, *kursiv* und `inline-code`.

### 3.2 Ungeordnete Liste

- Punkt 1
- Punkt 2 mit **Highlight**
- Punkt 3 mit [externer Link](https://gohugo.io/)

### 3.3 Geordnete Liste

1. Schritt eins
2. Schritt zwei
3. Schritt drei

### Liste mit chevron (CR- EDIT)
<ul style="padding-left:14px; margin-left:0;">
  <li style="list-style:none; margin:12px 0;">
    <i class="fa-solid fa-chevron-right" style="color:var(--color-green); margin-right:6px;"></i>
    Erster Punkt
  </li>
  <li style="list-style:none; margin:12px 0;">
    <i class="fa-solid fa-chevron-right" style="color:var(--color-green); margin-right:6px;"></i>
    Zweiter Punkt
  </li>
  <li style="list-style:none; margin:12px 0;">
    <i class="fa-solid fa-chevron-right" style="color:var(--color-green); margin-right:6px;"></i>
    Dritter Punkt
  </li>
</ul>



---

## 4. Zitat / Blockquote

> „Hugo ist ein extrem schneller Static Site Generator.“  
> – Irgendjemand im Internet

---

## 5. Bilder

### 5.1 Einfaches Markdown-Bild

![Beispielbild](/assets/images/blog/details/01.png)

### 5.2 Bild mit `figure`-Shortcode (falls im Theme vorhanden)

```text
{{</* figure src="/assets/images/blog/details/01.png" title="Figure Titel" alt="Alternativtext" */>}}


