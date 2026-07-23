# Roadmap

## Nästa steg (fortsätter 2026-07-24)

Se decisions.md ("Tredje kortet, sticker-utbyggnad och kodstädning" 2026-07-23, "Fler sticker-omgångar, bakgrunds-toggle och kortstorlekar" 2026-07-24) för produktramningen: appen är en generator för att skapa roliga hundbilder på egen hand, tre kort — Studio/Mugshot/Wanted.

**Öppen fråga, inget beslutat: bort med den bluradade bakgrunden i delningsformaten?**
Post/Story/Bakgrund lägger idag en blurad uppskalad kopia av kortet bakom det skarpa originalet (`composeForFormat`, `CardView.jsx`). Användaren tyckte det blev fult ("samma bild inuti bilden") men valde inte ersättning innan sessionen gick vidare. Två alternativ diskuterade: solid bakgrundsfärg (kortet centrerat, syns helt men får kant) eller beskär-för-att-fylla (kortet skalas upp för att fylla hela ytan kant till kant, inga kanter men delar av kortet kan klippas bort). Fråga användaren igen innan implementation.

**Stickers, återstår:**
- Fler stickers från ChatGPT — be uttryckligen om rena bilder utan vit "die-cut"-kant/skugga (se decisions.md 2026-07-24)
- Ev. fler kategorier när stickerantalet växer

**Fas 2 — Mugshot, återstår:**
- Flera bakgrunder (polisvägg, mörk station, 70-tal, modern booking)
- Valbar BOOKED-stämpel (flera stämpeltexter/stilar)
- Fält: namn, brott, datum, arrestnummer, straff + färdiga torra brottsförslag att välja ur (inte bara fritext)

**Fas 3 — Wanted (den estetiska/dramatiska generatorn):**
- Poster-varianter (Reward/Wanted/Dead or Alive/Still at Large/Sheriff's Notice)
- Fler papper/ramar/stämplar/typsnitt (samma PIL-texturteknik som redan finns)
- Valbar belöningsvaluta (dollar/guldmynt/treats/tennisbollar)
- Åldrings-slider (styr hur hårt sepia/nötning/vinjett appliceras)

**Öppna frågor:**
- Namnbyte "Dogsona" → "Pawlice"? Diskuterat, inte beslutat.

**Städa bort diagnostik-loggning innan release**
`BackgroundRemovalPlugin.swift` (NSLog) och `DogForm.jsx` (`console.log`/`console.error` runt `BackgroundRemoval`-anropet) har kvar loggning som lades till för felsökningen 2026-07-21 (se bugs.md). Bör tas bort eller tystas innan appen skickas till App Store.

## Klart

- Grundscaffold: Vite + React + Capacitor, iOS-plattform (2026-07-21)
- Formulär för hunddata, alla fält enligt CLAUDE.md-konceptet (2026-07-21) — **förenklat 2026-07-22** till bara foto/namn/ras, resten kommenterat bort
- Fotoval via kamera/bibliotek (2026-07-21), med drag-för-att-positionera i formulärets ring (2026-07-22)
- Bakgrundsborttagning av hundfoto via Apples Vision-ramverk, native plugin (2026-07-21)
- Sv/en-språktoggle för hela appen (2026-07-21)
- Fix: kortmallsflikar radbryter nu istället för att tvinga hela sidan att zooma ut (2026-07-21, se bugs.md)
- Sex kortmallar byggda (ID-kort, Körkort, Mugshot, Barkinder, Betyg, Guard) — fem kommenterades bort 2026-07-22 vid scope-skiftet, **borttagna på riktigt 2026-07-23** tillsammans med deras exklusiva ikoner/i18n-strängar/helpers (se decisions.md)
- Wanted-kortet: western wanted-poster med procedurellt genererade texturer (sliten trädörr, åldrat pergament), redigerbar belöning/anklagelse (2026-07-22)
- Behind Bars-kortet byggt, sedan skjutet på framtiden och till slut borttaget helt 2026-07-23
- Dela-flöde: `html-to-image` + native delningsmeny, med exportformat (Kort/Inlägg/Story/Bakgrund) (2026-07-22)
- Drag+nyp-skala på hunden i korten, delad `useDraggablePhoto`-hook (2026-07-22)
- Error boundary runt hela appen efter en vit-skärm-krasch (2026-07-22, se bugs.md)
- **Tredje kortet "Studio" tillagt** — tomt vitt kort, bara fritt drag-/pinch-/rotationsbart foto + stickers, ingen text (2026-07-23)
- **Sticker-rotation** — samma tvåfingersgest som redan skalade vrider nu också stickern/fotot (2026-07-23)
- **Sticker-kategorier** (Huvudbonader, Emojis, Polis, Rekvisita) och delad `CardSticker.jsx`-komponent (2026-07-23)
- **Tray visar sticker-bilden istället för textetikett** (2026-07-23)
- **20 nya PNG-stickers importerade från ett ChatGPT-genererat sticker-sheet**, beskurna med eget connected-component-Python-skript (2026-07-23, se decisions.md + bugs.md)
- Fixade två nyp-skalningsbuggar på stickers (för liten touch-yta, strukturell drag-bubbling-bugg i Studio-kortet) (2026-07-23, se bugs.md)
- **46 fler stickers importerade** från fem sticker-sheets (hatts1/hatts2/emoji1/coffee/stickers3) — 86 stickers totalt, inklusive lösning för bilder utan äkta alfakanal (2026-07-24, se decisions.md)
- **Alla handritade SVG-stickers borttagna**, ersatta av riktiga bildstickers (sombrero/heart/speechBubble återanvänder samma sticker-id) (2026-07-24)
- **Bakgrundsborttagning: riktig fram-och-tillbaka-växel** (original + bakgrundsborttagen version cachas separat, ingen omprocessering vid växling) (2026-07-24, se decisions.md)
- **Formulärets meningslösa drag-i-cirkel-positionering borttagen**, fotoförhandsvisning bytt till rundad fyrkant med `object-fit: contain` (2026-07-24)
- **Wanted fick sticker-stöd** (saknades helt tidigare) och mycket större fotoyta (68%→92% bredd, kvadrat→4:5) (2026-07-24)
- **Studio-kortets totalhöjd matchar nu Mugshot/Wanted korrekt** via en osynlig footer som återanvänder Mugshot-placardens exakta CSS-mått, istället för ett gissat aspect-ratio-tal (2026-07-24, se decisions.md för lärdomen)
