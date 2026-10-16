---
# Neuer Beitrag:  hugo new blog/<slug>/index.md
# Bilder in denselben Ordner legen. Erklärung der Felder: docs/blog.md
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
description: ""
summary: ""
kategorien: []
tags: []
image: "titel.jpg"
image_alt: ""
---

Einleitung in einem Absatz.

## Erster Abschnitt

## Kurz gesagt

{{ "{{< checklist >}}" }}
Erster Punkt
Zweiter Punkt
{{ "{{< /checklist >}}" }}
