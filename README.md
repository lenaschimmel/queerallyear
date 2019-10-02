[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)

# Queer all year
<img width="50%" src="https://github.com/lenaschimmel/queerallyear/blob/master/web/img/navi.png?raw=true" alt="Animated logo on the home page"/>

## Description
This is the website [queerallyear.de](http://queerallyear.de), which was launchend in the summer of 2019 to offer a critical comment to the motto of the Brunswick pride parade, which was "Gay for one day".

The website is completely German, and so the development notes are as well.

## Technical details
The site runs on NodeJS and comes with a custom HTTP server. It has a very simple templating system.

The most complex part is the handling of SVG graphics for the logo, which serves several purposes:

* Randomized animation on the home page
* Life preview in the image configurator
* Generate SVG, PNG, PDF and JPG downloads from the confiurator
* Create modified SVGs via command line interface
* Create variants for embedding in several sub-pages at startup

To make those features possible without code duplication, several chungs of JavaScript have to be executable both server-side on NodeJS and client-side within the browser. We use [browserify](https://www.npmjs.com/package/browserify) to execute node-style code in the browser, and [jsdom](https://www.npmjs.com/package/jsdom) to let code run on NodeJS which needs to access a DOM (with much less overhead than [phantomjs](https://www.npmjs.com/package/phantom) or [puppeteer](https://github.com/GoogleChrome/puppeteer))

## Screenshots
<img width="50%" src="https://github.com/lenaschimmel/queerallyear/blob/master/doc/logo_animation.gif?raw=true" alt="Animated logo on the home page"/>
<img width="50%" src="https://github.com/lenaschimmel/queerallyear/blob/master/doc/designer.png?raw=true" alt="Screenshot of the logo configurator"/>

## Development notes (German, partly outdated)

Dies ist eine Kampagne für mehr Vielfalt und weniger Regenbogenkapitalismus beim Braunschweiger CSD 2019.

Weder technisch noch inhaltlich ist so richtig klar, was das letztlich mal werden wird. Bisherige Ideen:

 * [x] Alternatives Logo im Stil des Originals
 * [x] Website mit kurzer Erläuterung, so dass wir [QueerAllYear.de](http://queerallyear.de) auf unseren Merch drucken können
 * [x] Umfangreichere Website mit Navigation
 * [x] Ausführliches Manifest / Erklärung unserer Position
 * [x] Generator für Motive mit verschiedenen Farbkombinationen
 * [ ] ~Generator für Motive mit verschiedenen Texten~ entfällt, zu viel Risiko für Missbrauch

 * [x] Interne Kommunikationsgruppe
 * [x] Statement aktualisieren
 * [x] Lizenz CC0 auf alles incl. Code
 * [x] Kürzere Intervalle probieren
 * [x] Bessere Navigationsleiste (Logo)
 * [x] Github öffentlich schalten
 * [x] Designanpassungen für Handys 
 * [x] Druckvorlagen auf Startseite erwähnen
 * [ ] Evtl. auf Uberspace umziehen (Siehe https://wiki.uberspace.de/development:nodejs )
 * [x] Mailadresse: kontakt@queerallyear.de
 * [ ] Geld-Sammel-Plattform (Paypal)
 * [x] Liste von Unterzeichner_innen
 * [x] Bekanntmachen - Tweets, Unterstützer_orgs etc.
 * [x] Noch bessere Navigationsleiste (Burger Menu, siehe https://media.kulturbanause.de/2014/04/navigation/slider/responsive-navigation-slider-target.html#nav-closed )
 * [ ] Spreadshirt, node  module sprd-design-upload
 * [x] Fertiger Merch (z.B. Sticker) die wir designen, in Druck geben und verbreiten
 * [ ] Zielsetzung schärfen
 * [x] ~Flyer designen~ Postkarte
 * [x] Übersicht über Druckkosten
 * [ ] Identitäten erklären?
 * [ ] Performance auf alten Handys (evtl. Mobilbrowser whitelisten)
  
# Motto
Da sowohl der Reduktion auf "gay" als auch dem Konzept "for one day" etwas entgegen gesetzt werden sollte, standen "queer" und "year" schnell fest. In einer Abstimmung zwischen den folgenden Mottos setzte sich _Queer all year_ mit 8 von 8 Stimmen durch:

 * **Queer all year**
 * Queer throughout the year
 * Queer the entire year
 * Queer the whole year

# Logo
Das Logo des CSD basiert auf der Schriftart _Stone Sans ITC TT Bold_. Wir haben für unser Logo letztlich die Schrift _Nunito Sans_ gewählt, da diese freie Schriftart ausreichend ähnlich aussieht, und den Schriftzug darin gesetzt. Dann haben wir die Glyphen von Hand in mehrere Teile geschnitten, die jeweils mit linearen Farbverläufen gefüllt sind. Dies geschah zunächst in Adobe Illustrator, wurde aber letztlich in Inkscape fortgesetzt.

Das Ergebnis ist eine SVG-Grafik, die wir mit selbstgebauten Tools weiter modifizieren können…

## Logo-Modifikation
Die Farbverläufe sind im SVG so definiert:

    <linearGradient
       gradientUnits="userSpaceOnUse"
       y2="292.53"
       x2="505.12"
       y1="200.71"
       x1="452.11"
       id="E13">
      <stop
         id="stop1144"
         stop-color="#2198d5"
         offset="0.08" />
      <stop
         id="stop1146"
         stop-color="#0067ab"
         offset="0.34" />
      <stop
         id="stop1148"
         stop-color="#0c478b"
         offset="0.66" />
    </linearGradient>

Die IDs der Verläufe sind dreistellig, in diesem Fall `E13`. Dabei Steht `E` für den Buchstaben, zu dem es gehört, die `1` definiert den Index des Buchstabens _(ab 0 gezählt!)_ und die `3` den Index des Verlaufs im Buchstaben _(ab 1 gezählt!)_. Somit ist `E13` der dritte Verlauf im zweiten E des Schriftzugs.

Ablauf der Grafikverarbeitung im `server`:

 * `readSvg` 
    * lädt eine Datei vom Datenträger,
    * optimiert sie mit svgo
    * entfernt die XML-Präambel (heitß das so?) `<?xml ... >`
    * ersetzt die ID des Top-Level-Elements `<svg... >` mit dem jeweiligen Namen (orig, vert)
    * fügt den svg-Code als String in die map `graphics` ein
 *  `getPageOutput`
    * ist furchtbar ineffizient, aber läuft ja nur einmal beim Start
    * inlined gewisse svg-Grafiken
    * ersetzt dabei die id (vert, orig) durch eine andere (mainlogo, shadow, previewlogo) 
 * `initSvg`
    * holt svg-source aus `graphics`
    * parsed zu einem `JSDOM`-Objekt
    * erstellt daraus `GradientSvg` Instanz
    * returned Future, die in `gradientsFuture` abgelegt wird
 *  `app.get('/img/shadow', ...)`
    * arbeitet mit `gradientsFuture`
 *  `app.get('/design/download' ...)`
    * arbeitet mit `gradientsFuture`

* `GradientSvg`
   * speichert Referenzen auf das svg-Element das document und den dom (werden alle hinein gegeben)
   * `svgString` nutzt den `dom` zum Serialisieren, entfernt überflüssiges html-Markup   
  
Ablauf der Grafikverarbeitung im `browser`:
 * `initFlagAnimation` und `initPreviewLogo`
   * Holt svg-root aus dem document
   * Erzeugt `GradientSvg`-Instanz
   * Schaltet Schatten ein/aus (beim mainlogo immer aus, wird nämlich extra dahiner gelegt)
   * setzt Farben


# Website
Die aktuelle Website basiert ist eine einzelne html-Seite (`index.html`), die (quasi als Fallback) das Logo einbindet:

    <img id="mainlogo" src="img/logo.svg" alt="Queer all year">

Es gibt einen NodeJS-Server, der beim Ausliefern die obige Zeile durch den Inhalt der SVG-Datei ersetzt. Nur bei dieser Art der Einbettung kann später clientseitig im JavaScript auf den Bildinhalt zugriffen werden, denn das SVG wird einfach teil des (HTML-)DOM.

# Tool
Es existiert ein Tool, das eine SVG mit der Struktur von `logo.svg` modifizieren kann. Es analysiert die vorhandenen Farbverläufe und färbt diese um.

Das Modul `recolor` arbeitet auf dem DOM des SVG. Es kann im Browser oder in NodeJS eingesetzt werden. Damit es im Browser läuft, muss es durch [Browserify](https://www.npmjs.com/package/browseifyy) konvertiert werden, wo es dann direkt auf dem nativen DOM arbeitet. Innerhalb von NodeJS nutzt es [jsdom](https://www.npmjs.com/package/jsdom), da kein Browser vorhanden ist, der ein DOM bereitstellen könnte.

# Inhalte
In erster Linie geht es darum, das Motto zu kritisieren. Der CSD als ganzes ist ja in den letzten Jahren ganz nett gewesen, und kann es auch jetzt wieder werden.

Die Kommunikation hat aber mehrere Ebenen:
 * Das Motto selbst
 * Die [Erläuterung des Mottos](https://www.csd-braunschweig.de/sommerlochfestival/gay-for-one-day-das-diesj%C3%A4hrige-motto/)
 * [Hintergrundinfos im Pressebereich](https://www.csd-braunschweig.de/presse-1/hintergrund-info/)
 * [Programm](https://www.csd-braunschweig.de/programm-2019/rahmenprogramm-details/)
 * Sonstige Kommunikation (z.B. [T-Shirt-Aktion](https://www.csd-braunschweig.de/unterst%C3%BCtze-uns/t-shirt-aktion/))
 * [Forderungen](https://www.csd-braunschweig.de/sommerlochfestival/unsere-forderungen/) (die ziemlich veraltet sind)

 * Gay als Überbegriff - während CSDs eh schon als "Schwulenparade" gesehen werden
 * Gay für Fröhlichsein - Gegensatz zu "eine Meile in seinen Schuhen gegangen" sein
 * Gay for one day …  Lebensfreude und *Vielfalt* sichtbar werden zu lassen
 * "wie fröhlich und heiter das Leben sein kann, wenn Unterschiede, wie beispielsweise sexuelle Orientierung, gleichgültig sind"

# Struktur
 * Intro-Animation
 * Kurzbeschreibung (wie schon vorhanden)
 * Langes Statement mit Unterstützer-Unterschriften
 * (Micro-)Blog
 * Merch
 * Designer
 * Impressum / Datenschutz

# Ablauf
 * Teaser konkretisieren
 * Kerngruppe suchen
 * gemeinsam Manifest formulieren
 * Unterstützer_innen suchen