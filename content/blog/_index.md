---
title: "Blog"
description: "Über Werte, Haltung und Zugehörigkeit."

# Der Blog ist weder im Menü noch im Footer verlinkt. Ohne diesen Ausschluss
# meldet die Sitemap Google Seiten, die kein Besucher über die Navigation
# erreichen kann. cascade gilt für alle Beiträge im Ordner, auch für künftige.
# Sobald der Blog verlinkt ist: beide sitemap_exclude entfernen.
sitemap_exclude: true
cascade:
  sitemap_exclude: true
  # Bilder im Ordner eines Beitrags nur veröffentlichen, wenn sie benutzt
  # werden. Sonst landet jedes Original (oft mehrere MB) zusätzlich zu den
  # verkleinerten WebP-Fassungen auf dem Server.
  build:
    publishResources: false
---
