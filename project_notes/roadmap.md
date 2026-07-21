# Roadmap

## Nästa steg

**Alla kort lika stora — öppen fråga (2026-07-21)**
Användaren vill att alla sex kortmallar ska ha samma yttermått. Bredden är redan identisk (`min(92vw, 380px)` på alla), men höjden varierar mycket mellan foto-först-kort (Mugshot, Barkinder, fast bildformat) och textlista-kort (Betyg, Guard, höjd beror på innehållsmängd). Diskuterat men inte löst: antingen skala varje kort proportionerligt till en gemensam höjd (risk: kort med mer innehåll får mindre/tightare text) eller ge korten en gemensam content-yta med vertikal centrering (enklare, ingen textförvrängning, men kort med mindre innehåll "flyter" med tomrum). Inget beslutat än.

**Fler kortmallar möjliga**
Sex mallar klara (ID-kort, Körkort, Mugshot, Barkinder, Betyg, Guard) — se decisions.md för varför säsongsmallar (jul/påsk/etc.) valdes bort till förmån för humor-/igenkänningsspåret. Fler mallar i samma anda kan tillkomma; CLAUDE.md:s ursprungliga "2-3 mallar för v1"-princip är redan passerad och bör ses som överspelad snarare än ett hårt tak.

**Städa bort diagnostik-loggning innan release**
`BackgroundRemovalPlugin.swift` (NSLog) och `DogForm.jsx` (`console.log`/`console.error` runt `BackgroundRemoval`-anropet) har kvar loggning som lades till för felsökningen 2026-07-21 (se bugs.md). Bör tas bort eller tystas innan appen skickas till App Store.

## Klart

- Grundscaffold: Vite + React + Capacitor, iOS-plattform (2026-07-21)
- Formulär för hunddata, alla fält enligt CLAUDE.md-konceptet (2026-07-21)
- Fotoval via kamera/bibliotek (2026-07-21)
- Tre kortmallar (ID-kort, Körkort, Mugshot), omdesignade utifrån verkliga referensbilder (2026-07-21)
- Bakgrundsborttagning av hundfoto via Apples Vision-ramverk, native plugin (2026-07-21)
- Tre till kortmallar: Barkinder (dejting-parodi), Betyg (skolbetyg), Guard (vaktrapport) (2026-07-21)
- Sv/en-språktoggle för hela appen (2026-07-21)
- Fix: kortmallsflikar radbryter nu istället för att tvinga hela sidan att zooma ut (2026-07-21, se bugs.md)
