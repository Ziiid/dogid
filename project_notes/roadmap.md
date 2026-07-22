# Roadmap

## Nästa steg (fortsätter 2026-07-23)

Se decisions.md ("Stort scope-skifte") för varför bara Mugshot + Wanted är aktiva nu. Byggordning för utbyggnaden, i tre faser — Fas 1 klar, Fas 2 påbörjad:

**Fas 2 — Mugshot (huvudfunktionen), återstår:**
- Flera bakgrunder (polisvägg, mörk station, 70-tal, modern booking)
- Valbar BOOKED-stämpel (flera stämpeltexter/stilar, eget dragbart/skalbart lager likt solglasögon-stickern)
- Fler stickers/skyltar hunden "håller" utöver solglasögon
- Fält: namn, brott, datum, arrestnummer, straff + färdiga torra brottsförslag att välja ur (inte bara fritext)

**Fas 3 — Wanted (den estetiska/dramatiska generatorn):**
- Poster-varianter (Reward/Wanted/Dead or Alive/Still at Large/Sheriff's Notice)
- Fler papper/ramar/stämplar/typsnitt (samma PIL-texturteknik som redan finns)
- Valbar belöningsvaluta (dollar/guldmynt/treats/tennisbollar)
- Åldrings-slider (styr hur hårt sepia/nötning/vinjett appliceras)

**Öppna frågor:**
- Namnbyte "Dogsona" → "Pawlice"? Diskuterat, inte beslutat.
- Behind Bars-kortet (kommenterat bort) — återupptas bara om hunden kan integreras med riktigt ljus/skugga/djup i cellmiljön, inte förrän dess.

**Städa bort diagnostik-loggning innan release**
`BackgroundRemovalPlugin.swift` (NSLog) och `DogForm.jsx` (`console.log`/`console.error` runt `BackgroundRemoval`-anropet) har kvar loggning som lades till för felsökningen 2026-07-21 (se bugs.md). Bör tas bort eller tystas innan appen skickas till App Store.

## Klart

- Grundscaffold: Vite + React + Capacitor, iOS-plattform (2026-07-21)
- Formulär för hunddata, alla fält enligt CLAUDE.md-konceptet (2026-07-21) — **förenklat 2026-07-22** till bara foto/namn/ras, resten kommenterat bort
- Fotoval via kamera/bibliotek (2026-07-21), med drag-för-att-positionera i formulärets ring (2026-07-22)
- Bakgrundsborttagning av hundfoto via Apples Vision-ramverk, native plugin (2026-07-21)
- Sv/en-språktoggle för hela appen (2026-07-21)
- Fix: kortmallsflikar radbryter nu istället för att tvinga hela sidan att zooma ut (2026-07-21, se bugs.md)
- Sex kortmallar byggda (ID-kort, Körkort, Mugshot, Barkinder, Betyg, Guard) — **fem av dem kommenterades bort 2026-07-22** vid scope-skiftet till två djupa generatorer (se decisions.md)
- Wanted-kortet: western wanted-poster med procedurellt genererade texturer (sliten trädörr, åldrat pergament), redigerbar belöning/anklagelse (2026-07-22)
- Behind Bars-kortet byggt, sedan skjutet på framtiden i samma scope-skifte (2026-07-22)
- Dela-flöde: `html-to-image` + native delningsmeny, med exportformat (Kort/Inlägg/Story/Bakgrund) (2026-07-22)
- Fas 1 av Mugshot/Wanted-utbyggnaden: drag+nyp-skala på hunden i korten, delad `useDraggablePhoto`-hook (2026-07-22)
- Fas 2 påbörjad: Toca Boca-inspirerat sticker-system, första stickern (solglasögon) klar med av/på-hylla (2026-07-22)
- Error boundary runt hela appen efter en vit-skärm-krasch (2026-07-22, se bugs.md)
