# Nyckelinfo

## Status (uppdaterad 2026-07-24)

- **Repo:** [github.com/Ziiid/dogid](https://github.com/Ziiid/dogid) — privat/eget repo, ingen delad kod med dogish
- **App-id:** fortfarande `com.doxtail.dogid` (bundle-ID orört), men appnamnet är bytt till **"Dogsona"** (visningsnamn i `capacitor.config.json`, `package.json`, `Info.plist`, header i appen). Ingen "by X"-tagline.
- **Plattform:** iOS-only just nu (ingen Android-plattform tillagd). Testas uteslutande via Xcode på fysisk iPhone, inte simulator eller webbläsare.
- **Produktramning:** appen är en generator för att skapa roliga hundbilder på egen hand — tre kort (Studio/Mugshot/Wanted), samma storlek (bredd + total höjd), ingen bred "digitalt ID-kort"-idé längre. Se decisions.md ("Stort scope-skifte" 2026-07-22, "Tredje kortet..." 2026-07-23, "Fler sticker-omgångar..." 2026-07-24).
- **Formulär:** kraftigt förenklat — bara foto, namn och ras är aktiva (övriga fält kommenterade bort i `DogForm.jsx`, inte borttagna). Fotoförhandsvisningen är en statisk rundad fyrkant (`object-fit: contain`) — ingen positionering i formuläret längre, det gjorde ändå ingen skillnad för korten (se decisions.md 2026-07-24).
- **Aktiva kortmallar:** tre, alla med sticker-stöd och samma totalstorlek — **Studio** (tomt vitt kort, bara foto + fri sticker-lek), **Mugshot** och **Wanted** (fick sticker-stöd + mycket större fotoyta 2026-07-24) (`CardView.jsx`). ID-kort, Körkort, Barkinder, Betyg, Guard och Behind Bars är helt borttagna ur koden sedan 2026-07-23.
- **Lagring:** `@capacitor/preferences` för formulärdata (JSON-blob). Foto i tre filer via `@capacitor/filesystem` (`Directory.Data`): `dogid_photo_original.png` (rå kamerabild), `dogid_photo_nobg.png` (bakgrundsborttagen, cachad), `dogid_photo.png` (den just nu aktiva/visade — det alla andra komponenter läser).
- **Bakgrundsborttagning:** Apples Vision-ramverk, on-device. Går nu att växla fram och tillbaka i formuläret ("Ta bort bakgrund"/"Återställ bakgrund") utan att köra om Vision varje gång — se decisions.md 2026-07-24.
- **Språk:** svenska/engelska växlingsbart via en EN/SV-knapp (flyttad ut ur headern så den inte överlappar loggan), sparas i Preferences. Genre-korrekt engelska (CHARGE, BOOKED, WANTED FOR osv.) hålls medvetet oöversatt oavsett språkläge.
- **Drag/nyp-skala/rotation på hunden och stickers i korten:** `src/lib/useDraggablePhoto.js` — en delad hook, en-fingers-drag flyttar, tvåfingers-nyp skalar (0.5x–2.5x) OCH roterar samtidigt (samma gest, `Math.atan2` på pekar-vinkeln). Används på fotot i alla tre kort samt på alla stickers. Position/skala/rotation sparas per kort (`blankPhotoTransform`, `mugshotPhotoTransform`, `wantedPhotoTransform`).
- **Sticker-system:** 86 stickers totalt (alla PNG, inga handritade SVG längre), grupperade i fyra kategorier (Huvudbonader, Emojis, Polis, Rekvisita — `mugshotStickers.js`). Sticker-trayn visar själva bilden i en 54×54px-ruta (`StickerGraphic` i `CardSticker.jsx`). Separat state per kort: `dog.blankStickers`, `dog.mugshotStickers`, `dog.wantedStickers`.
- **PNG-sticker-import:** ChatGPT genererar ett helt "sticker-sheet" (flera stickers på en bild), beskärs med ett eget connected-component-Python-skript (inte ett fast rutnät). Bilder kan sakna äkta alfakanal (schackmönster eller solid färg inbränt i pixlarna istället) — hanteras med en syntetisk mask. AI-genererad inbränd text måste kollas manuellt för stavfel, går inte att rätta i efterhand. Se decisions.md för fulla lärdomar.
- **Delningsflöde:** `html-to-image` renderar det synliga kortet till en PNG, `@capacitor/filesystem` + `@capacitor/share` skickar den vidare till native delningsmenyn. Exportformat: Kort (original), Inlägg (1080×1080), Story (1080×1920), Bakgrund (1170×2532) — de tre senare komponeras via `<canvas>` med en blurad uppskalad bakgrund + skarpt kort ovanpå. **Öppen fråga:** användaren vill eventuellt ta bort den bluradade bakgrunden — inget beslutat, se roadmap.md.
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
