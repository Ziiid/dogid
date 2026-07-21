# Nyckelinfo

## Status (uppdaterad 2026-07-21)

- **Repo:** [github.com/Ziiid/dogid](https://github.com/Ziiid/dogid) — privat/eget repo, ingen delad kod med dogish
- **App-id:** `com.doxtail.dogid`, appnamn "Dog ID"
- **Plattform:** iOS-only just nu (ingen Android-plattform tillagd). Testas uteslutande via Xcode på fysisk iPhone, inte simulator eller webbläsare.
- **Formulär:** klart — alla fält från CLAUDE.md-konceptet (namn, ras, födelsedatum, kön, färg, päls, kennel/uppfödare, chipnummer, försäkring, veterinär, allergier/medicinskt, nödkontakt, foto)
- **Lagring:** `@capacitor/preferences` för formulärdata (JSON-blob), `@capacitor/filesystem` för hundfotot (`dogid_photo.png`, `Directory.Data`)
- **Kortmallar:** tre klara — ID-kort (seriöst, kalifornien-DL-inspirerat), Körkort (svensk EU-körkort-stil), Mugshot (ljusgrå studiobakgrund + redigerbar "CHARGE:"-text). Väljs via flikar i `CardView.jsx`.
- **Bakgrundsborttagning:** klar och verifierad på fysisk enhet 2026-07-21 — Apples Vision-ramverk tar automatiskt bort bakgrunden från hundfoton vid uppladdning, med graceful fallback om det misslyckas.

## Tech stack

| Del | Val |
|-----|-----|
| Frontend | Vite + React 19, ren JS/JSX |
| Native wrapper | Capacitor 8 (Swift Package Manager-baserat) |
| Lagring | Capacitor Preferences + Filesystem, ingen SQLite |
| Bakgrundsborttagning | Native Swift-plugin via Apples Vision-ramverk (`VNGenerateForegroundInstanceMaskRequest`), iOS 17+ |
| Betalning | Engångspris i App Store Connect, ingen IAP/RevenueCat |
| Backend | Ingen — allt lagras lokalt på enheten |

## Kända begränsningar

- Bakgrundsborttagning kräver iOS 17+ — faller tillbaka till originalfoto (ingen transparens) på äldre enheter, ingen krasch
- Endast en hundprofil åt gången (v1-principen "bygg bara ett kort")
- Ingen Android-plattform ännu — CLAUDE.md nämner ingen sådan plan för v1
