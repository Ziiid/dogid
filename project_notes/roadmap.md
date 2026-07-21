# Roadmap

## Nästa steg

**"Dog Card Generator" — säsongs-/helgmallar (annonserat 2026-07-21, inte påbörjat)**
Ny riktning för kortmallarna, utöver/istället för de tre nuvarande (ID-kort, Körkort, Mugshot). Innehåll vid lansering enligt användaren:
- Christmas
- New Year
- Easter
- Halloween
- Birthday eller Summer
- Mugshot

Öppna frågor att stämma av innan implementation: ersätter detta ID-kort/Körkort-mallarna helt, eller läggs de till som fler valbara mallar? CLAUDE.md:s befintliga princip ("håll det till 2-3 mallar för v1, annars blir designarbetet flaskhalsen") kan behöva omprövas eller uttryckligen uppdateras om mallantalet växer betydligt.

**Städa bort diagnostik-loggning innan release**
`BackgroundRemovalPlugin.swift` (NSLog) och `DogForm.jsx` (`console.log`/`console.error` runt `BackgroundRemoval`-anropet) har kvar loggning som lades till för felsökningen 2026-07-21 (se bugs.md). Bör tas bort eller tystas innan appen skickas till App Store.

## Klart

- Grundscaffold: Vite + React + Capacitor, iOS-plattform (2026-07-21)
- Formulär för hunddata, alla fält enligt CLAUDE.md-konceptet (2026-07-21)
- Fotoval via kamera/bibliotek (2026-07-21)
- Tre kortmallar (ID-kort, Körkort, Mugshot), omdesignade utifrån verkliga referensbilder (2026-07-21)
- Bakgrundsborttagning av hundfoto via Apples Vision-ramverk, native plugin (2026-07-21)
