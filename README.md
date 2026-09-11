# Tonfolgen-Generator

Deutschsprachige Browser-App für alle Reihenfolgen von 1 bis 12 frei gewählten Tönen, mit Notation im Violinschlüssel.

## Starten

Node.js ab Version 20 installieren, dann im Projektordner:

```sh
npm start
```

Im Browser `http://localhost:4173` öffnen. Keine Paketinstallation erforderlich. Die Anwendung benötigt weder Konto noch Server-Datenbank; die Berechnung läuft vollständig im Browser. Der kleine lokale Server liefert nur die Dateien aus.

## Bedienung

- Vorlage wählen: E-Moll-Pentatonik, C-Dur oder alle zwölf chromatischen Töne.
- Alternativ Töne durch Leerzeichen trennen, z. B. `E G A H D` oder `C Cis D Es`.
- Deutsche Benennung: **H = B natural**, **B = B flat**. `#`, `♯`, `b`, `♭` und Namen wie Cis, Des, Es, Fis, As werden unterstützt.
- Keine Oktavzahlen in der Toneingabe. Die Ausgangsoktave ist separat einstellbar (3, 4 oder 5). Sie bezieht sich auf den ersten eingegebenen Ton. Die übrigen Tonklassen werden innerhalb der folgenden Oktave platziert. Diese Lage ändert sich beim Umordnen nicht.
- Enharmonisch identische Töne werden als Dubletten abgelehnt.
- Alle oder einen festen Anfangston wählen. Danach **Tonfolgen erzeugen**.
- Ab einer beliebigen Folgennummer 12, 24, 48 oder 120 Ergebnisse ansehen; mit den Pfeilen blättern.
- **Drucken / PDF** druckt die aktuelle Ansicht. Im Druckdialog kann als PDF gespeichert werden.
- **MusicXML / CSV** exportiert ab der aktuellen Startnummer die gewünschte Anzahl (bis 10.000). Am Ende des Ergebnisraums wird die Anzahl begrenzt. MusicXML kann in einem Notensatzprogramm geöffnet werden.

Jeder Ton kommt genau einmal pro Folge vor. Alle Noten sind Viertelnoten; MusicXML verwendet n/4. Keine Tonartvorzeichnung; nötige Versetzungs- und Auflösungszeichen erscheinen direkt an den Noten. Spiegelungen zählen als verschieden.

## Mathematik

Mit allen Anfangstönen entstehen n! Folgen, mit einem festen Anfangston (n−1)!. Für zwölf Töne: 479.001.600 bzw. 39.916.800.

Die Direktadressierung über das faktoradische Zahlensystem erzeugt eine Folge in O(n²) Zeit und O(n) zusätzlichem Speicher, ohne vorhergehende Folgen zu berechnen. Reihenfolge: lexikografisch relativ zur **Eingabereihenfolge** der Töne. Es werden höchstens 120 Folgen auf einmal dargestellt und 10.000 exportiert.

## Tests

```sh
npm test
```

Tests prüfen unter anderem vollständige Enumeration und Eindeutigkeit, feste Anfangstöne, die letzte Zwölftonfolge, deutsche Notennamen, Vorzeichen, Grenzen und MusicXML.

## Hosting

Der Ordner `dist/` kann unverändert auf einem statischen Webhost bereitgestellt werden. Alle Ressourcen einschließlich Notenschrift liegen lokal im Projekt. Keine CDN-Abhängigkeiten und kein Build-Schritt.

GitHub Pages: Falls für das private Repository im verwendeten GitHub-Tarif verfügbar, `dist/` mit einem Pages-Workflow veröffentlichen. Das Repository wurde nicht automatisch öffentlich gemacht. Ein lokaler Start funktioniert unabhängig von Pages.

## Dateien

- `dist/core.mjs`: Eingabeprüfung, Permutationen und Exporte
- `dist/score.mjs`: SVG-Notensatz mit Vorzeichen und Hilfslinien
- `dist/app.mjs`: Bedienung und Darstellung
- `tests/core.test.mjs`: automatisierte Kernprüfungen

## Notenschrift

Bravura von Steinberg, SIL Open Font License 1.1. Lizenz: `dist/fonts/OFL.txt`. Quelle: https://github.com/steinbergmedia/bravura. Die Schrift ist unverändert mitgeliefert.
