# Nyckelinfo

## Status (uppdaterad 2026-07-22)

- **Repo:** [github.com/Ziiid/dogid](https://github.com/Ziiid/dogid) — privat/eget repo, ingen delad kod med dogish
- **App-id:** fortfarande `com.doxtail.dogid` (bundle-ID orört), men appnamnet är bytt till **"Dogsona"** (visningsnamn i `capacitor.config.json`, `package.json`, `Info.plist`, header i appen). Ingen "by X"-tagline.
- **Plattform:** iOS-only just nu (ingen Android-plattform tillagd). Testas uteslutande via Xcode på fysisk iPhone, inte simulator eller webbläsare.
- **Stort scope-skifte 2026-07-22:** appen har gått från en bred "digitalt ID-kort med flera roliga kort-skepnader"-idé till att fokusera på två djupa "brotts-tema"-generatorer. Se decisions.md för hela resonemanget.
- **Formulär:** kraftigt förenklat — bara foto, namn och ras är aktiva (övriga fält kommenterade bort i `DogForm.jsx`, inte borttagna). Fotot kan dras/positioneras i en rund ring i formuläret.
- **Aktiva kortmallar just nu:** bara **Mugshot** och **Wanted** (`CardView.jsx`). ID-kort, Körkort, Barkinder, Betyg, Guard och Behind Bars är kommenterade bort men finns kvar i koden — Behind Bars ska tillbaka senare men bara om hunden kan integreras på riktigt i cellmiljön (ljus/skugga/djup), inte bara ett gallerlager ovanpå.
- **Lagring:** `@capacitor/preferences` för formulärdata (JSON-blob), `@capacitor/filesystem` för hundfotot (`dogid_photo.png`, `Directory.Data`)
- **Bakgrundsborttagning:** klar sedan tidigare — Apples Vision-ramverk tar automatiskt bort bakgrunden från hundfoton vid uppladdning, med graceful fallback om det misslyckas.
- **Språk:** svenska/engelska växlingsbart via en EN/SV-knapp (flyttad ut ur headern så den inte överlappar loggan), sparas i Preferences. Genre-korrekt engelska (CHARGE, BOOKED, WANTED FOR osv.) hålls medvetet oöversatt oavsett språkläge.
- **Drag/nyp-skala på hunden i korten:** `src/lib/useDraggablePhoto.js` — en delad hook, en-fingers-drag flyttar, tvåfingers-nyp skalar (0.5x–2.5x). Används på fotot i både Mugshot och Wanted, samt på stickers (se nedan). Position/skala sparas per kort (`mugshotPhotoTransform`, `wantedPhotoTransform`).
- **Sticker-system (påbörjat, Toca Boca-inspirerat):** en "sticker-hylla" med av/på-knappar under Mugshot-kortet. Första stickern: solglasögon (`SunglassesIcon.jsx`, ren SVG). Varje aktiv sticker är sitt eget dragbara/skalbara lager (`dog.mugshotStickers`), konfig i `mugshotStickers.js`.
- **Delningsflöde:** `html-to-image` renderar det synliga kortet till en PNG, `@capacitor/filesystem` + `@capacitor/share` skickar den vidare till native delningsmenyn. Exportformat väljs innan delning: Kort (original), Inlägg (1080×1080), Story (1080×1920), Bakgrund (1170×2532) — de tre senare komponeras via `<canvas>` med en blurad uppskalad bakgrund + skarpt kort ovanpå.
- **Procedurellt genererade texturer** (Python/PIL, inga köpta/hämtade assets): sliten trädörr (`door-wood.jpg`), åldrat pergament (`aged-paper.jpg`), filmkorn (`film-grain.jpg`) — ligger i `src/components/cards/textures/`, genereringsskriptet ligger bara i scratchpad (inte i repot).
- **Error boundary** runt hela appen (`src/components/ErrorBoundary.jsx`) sedan en vit-skärm-krasch 2026-07-22 — se bugs.md.

## Tech stack

| Del | Val |
|-----|-----|
| Frontend | Vite + React 19, ren JS/JSX |
| Native wrapper | Capacitor 8 (Swift Package Manager-baserat) |
| Bildexport/delning | `html-to-image` (DOM→PNG) + `@capacitor/filesystem` + `@capacitor/share` |
| Lagring | Capacitor Preferences + Filesystem, ingen SQLite |
| Bakgrundsborttagning | Native Swift-plugin via Apples Vision-ramverk (`VNGenerateForegroundInstanceMaskRequest`), iOS 17+ |
| Texturer | Procedurellt genererade offline med Python/PIL, bundlade som statiska JPG/PNG |
| Betalning | Engångspris i App Store Connect, ingen IAP/RevenueCat |
| Backend | Ingen — allt lagras lokalt på enheten |

## Kända begränsningar

- Bakgrundsborttagning kräver iOS 17+ — faller tillbaka till originalfoto (ingen transparens) på äldre enheter, ingen krasch
- Endast en hundprofil åt gången (v1-principen "bygg bara ett kort")
- Ingen Android-plattform ännu — CLAUDE.md nämner ingen sådan plan för v1
- Formulärets bortkommenterade fält (födelsedatum, kön, färg, päls, kennel, chip, försäkring, vet, medicinskt, nödkontakt) betyder att ID-kort/Guard/Betyg m.fl. skulle visa tomma fält om de återaktiverades utan att formuläret först fylls på igen
- Appnamnet "Dogsona" kan bytas igen — "Pawlice" diskuterat som ett möjligt namn givet brotts-temat, inget beslutat
