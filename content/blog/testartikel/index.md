---
title: "Testartikel: So sieht ein Beitrag hier aus"
date: 2026-10-16T10:00:00+02:00
draft: true
description: "Dieser Beitrag zeigt jedes Element einmal: Zwischenüberschriften, Listen, ein Zitat, ein Bild und die Zusammenfassung am Ende. An ihm wird die Darstellung geprüft, bevor echte Texte kommen."
summary: "Jedes Element eines Beitrags an einer Stelle, damit die Darstellung geprüft werden kann, bevor echte Texte kommen."
category: "Zugehörigkeit"
image: "titel.jpg"
image_alt: "Platzhalter: Hügelkette im Abendlicht"
---

## Worum es geht

Ein Testartikel hat eine einzige Aufgabe: Er zeigt, wie Text auf dieser Seite
wirkt, bevor ein echter Beitrag erscheint. Deshalb kommt hier jedes Element
vor, das ein Beitrag später nutzen kann, und keines doppelt.

Die Textspalte ist 740 Pixel breit, genau wie auf „Über mich“ und „Mein Weg“.
Bei 20 Pixeln Schriftgröße sind das rund 70 Zeichen pro Zeile. Das Auge findet
beim Zeilensprung zuverlässig den Anfang der nächsten Zeile.

Rechts läuft das Inhaltsverzeichnis mit. Es zeigt, wo Sie gerade sind und wie
viel noch kommt. Auf dem Handy steht es eingeklappt unter dem Titelbild.

## Wie ein Abschnitt aussieht

Ein Abschnitt beginnt mit einer Zwischenüberschrift der zweiten Ebene.
Unterabschnitte bekommen die dritte Ebene und rücken im Inhaltsverzeichnis
eine Stufe ein.

### Absätze und Hervorhebungen

Fließtext steht in Source Sans, Überschriften in Fraunces. **Fett gesetzte
Wörter** heben sich durch das helle Creme vom grauen Fließtext ab, nicht durch
eine eigene Farbe. So bleibt Grün den Links und Haken vorbehalten, etwa diesem
[Link zur Übersicht](../).

Ein Absatz trägt einen Gedanken. Wird er länger als fünf oder sechs Zeilen,
lohnt es sich meist, ihn zu teilen. Das gilt hier genauso wie in jedem Brief.

### Listen

Aufzählungen kommen aus normalem Markdown, es braucht dafür keinen Shortcode:

- Ein Punkt pro Gedanke
- Kurze Punkte ohne Satzzeichen am Ende
- Längere Punkte, die aus ganzen Sätzen bestehen, enden mit einem Punkt.

Für Reihenfolgen gibt es die nummerierte Liste:

1. Text in Markdown schreiben
2. Bild in denselben Ordner legen
3. Pushen und in der Vorschau ansehen

## Zitat und Bild

Ein Zitat steht eingerückt mit grüner Kante und in der Überschriftenschrift.
Die Quelle darunter ist Nebentext.

> Gut lesbar sind 45 bis 75 Zeichen pro Zeile.
>
> Typografische Faustregel

Bilder im Text setzt man mit normalem Markdown. Hugo verkleinert sie, schreibt
Breite und Höhe dazu und lädt sie erst, wenn sie ins Bild scrollen.

![Platzhalter: Waldrand in der Dämmerung](waldrand.jpg "Bildunterschrift als Nebentext, 17 Pixel.")

## Kurz gesagt

Jeder Beitrag endet mit einer kurzen Zusammenfassung. Sie ist für alle
gedacht, die nur bis hierher scrollen.

{{< checklist title="Das Wichtigste" >}}
Eine Textspalte, eine linke Kante
Zwei Schriftgrößen für Text, nicht mehr
Das Inhaltsverzeichnis begleitet beim Lesen
Wer bis zum Ende liest, findet den Autor
{{< /checklist >}}
