# Nyckelinfo

## Status (uppdaterad 2026-07-23)

- **Repo:** [github.com/Ziiid/dogid](https://github.com/Ziiid/dogid) — privat/eget repo, ingen delad kod med dogish
- **App-id:** fortfarande `com.doxtail.dogid` (bundle-ID orört), men appnamnet är bytt till **"Dogsona"** (visningsnamn i `capacitor.config.json`, `package.json`, `Info.plist`, header i appen). Ingen "by X"-tagline.
- **Plattform:** iOS-only just nu (ingen Android-plattform tillagd). Testas uteslutande via Xcode på fysisk iPhone, inte simulator eller webbläsare.
- **Produktramning:** appen är en generator för att skapa roliga hundbilder på egen hand — tre kort (Studio/Mugshot/Wanted), ingen bred "digitalt ID-kort"-idé längre. Se decisions.md ("Stort scope-skifte" 2026-07-22 och "Tredje kortet..." 2026-07-23) för hela resonemanget.
- **Formulär:** kraftigt förenklat — bara foto, namn och ras är aktiva (övriga fält kommenterade bort i `DogForm.jsx`, inte borttagna). Fotot kan dras/positioneras i en rund ring i formuläret.
- **Aktiva kortmallar:** tre — **Studio** (tomt vitt kort, bara foto + fri sticker-lek), **Mugshot** och **Wanted** (`CardView.jsx`). ID-kort, Körkort, Barkinder, Betyg, Guard och Behind Bars är **helt borttagna** ur koden 2026-07-23 (var bara kommenterade bort sedan 22:e) — se decisions.md om de ska återupplivas.
- **Lagring:** `@capacitor/preferences` för formulärdata (JSON-blob), `@capacitor/filesystem` för hundfotot (`dogid_photo.png`, `Directory.Data`)
- **Bakgrundsborttagning:** klar sedan tidigare — Apples Vision-ramverk tar automatiskt bort bakgrunden från hundfoton vid uppladdning, med graceful fallback om det misslyckas.
- **Språk:** svenska/engelska växlingsbart via en EN/SV-knapp (flyttad ut ur headern så den inte överlappar loggan), sparas i Preferences. Genre-korrekt engelska (CHARGE, BOOKED, WANTED FOR osv.) hålls medvetet oöversatt oavsett språkläge.
- **Drag/nyp-skala/rotation på hunden och stickers i korten:** `src/lib/useDraggablePhoto.js` — en delad hook, en-fingers-drag flyttar, tvåfingers-nyp skalar (0.5x–2.5x) OCH roterar samtidigt (samma gest, `Math.atan2` på pekar-vinkeln). Används på fotot i alla tre kort samt på alla stickers. Position/skala/rotation sparas per kort (`blankPhotoTransform`, `mugshotPhotoTransform`, `wantedPhotoTransform`).
- **Sticker-system:** 26 stickers totalt (6 handritade SVG + 20 PNG från ChatGPT), grupperade i fyra kategorier (Huvudbonader, Emojis, Polis, Rekvisita — `mugshotStickers.js`). Sticker-trayn visar själva bilden i en 54×54px-ruta (`StickerGraphic` i `CardSticker.jsx`), inte längre bara textetikett. Delad mellan Studio (`dog.blankStickers`) och Mugshot (`dog.mugshotStickers`) — separat state per kort.
- **PNG-sticker-import:** ChatGPT genererar ett helt "sticker-sheet" (flera stickers på en transparent bild), beskärs med ett eget connected-component-Python-skript (inte ett fast rutnät — se decisions.md). AI-genererad inbränd text i stickers måste kollas manuellt för stavfel/förvrängning innan de tas in, går inte att rätta i efterhand.
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
- Formulärets bortkommenterade fält (födelsedatum, kön, färg, päls, kennel, chip, försäkring, vet, medicinskt, nödkontakt) används inte av något aktivt kort just nu — bara foto/namn/ras behövs för Studio/Mugshot/Wanted
- Appnamnet "Dogsona" kan bytas igen — "Pawlice" diskuterat som ett möjligt namn givet brotts-temat, inget beslutat
