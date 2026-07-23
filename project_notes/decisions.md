# Beslut

Produktbesluten (pris, "Dog" vs "Pet", QR-kod, GDPR, färgpalett) finns redan i [../CLAUDE.md](../CLAUDE.md). Den här filen samlar tekniska/implementationsbeslut som fattats under byggarbetet.

## Stack

**Vite + React 19 (ren JS/JSX, ingen TypeScript) + Capacitor 8**
Speglar dogish-frontendens konventioner för igenkänning och delad muskelminne mellan projekten, trots att repona är helt separata.

**Capacitor-plugins: preferences, filesystem, camera, share — inga backend-relaterade paket**
Ingen Supabase, ingen RevenueCat, ingen push. Håller "ingen backend"-principen strikt.

**Foto lagras som PNG, inte JPEG**
Krävs för transparens efter bakgrundsborttagning (JPEG saknar alfakanal). Filnamn `dogid_photo.png`, sparas via `@capacitor/filesystem` i `Directory.Data`.

## Bakgrundsborttagning (2026-07-21)

**Apples Vision-ramverk on-device (`VNGenerateForegroundInstanceMaskRequest`) istället för en bunt:ad JS-ML-modell**
Samma teknik som "Lyft ur motiv" i Bilder-appen — fungerar bra på djur, kräver iOS 17+, ingen extra modellvikt i appen, körs helt lokalt. Alternativet (t.ex. U²-Net i webviewen) hade dragit med sig flera MB och gett sämre resultat på djur.

**Native plugin måste registreras via `MainViewController` + `registerPluginInstance`, inte `CAP_PLUGIN`-makro eller `registerPluginType`**
Efter lång felsökning (se bugs.md) visade det sig att Capacitor 8 kräver explicit registrering av lokala (icke-SPM) plugins. Rätt mönster, bekräftat genom att jämföra med dogish's redan fungerande `SpeechRecognitionPlugin`:
```swift
// ios/App/App/MainViewController.swift
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(BackgroundRemovalPlugin())
    }
}
```
Storyboarden (`Main.storyboard`) måste peka på `MainViewController` (customModule="App"), inte Capacitors egen `CAPBridgeViewController` direkt.

**`DEAD_CODE_STRIPPING = NO` krävs för App-targetet**
Både `MainViewController` (bara refererad via klassnamnssträng i storyboarden) och lokala plugin-klasser (bara hittade via Capacitors runtime-reflektion) saknar en "vanlig" kodreferens som linkern kan se. Utan detta stryker linkern bort dem tyst — inget kompileringsfel, bara att plugin-anrop ger `UNIMPLEMENTED` i produktion. Satt i `ios/App/App.xcodeproj/project.pbxproj` för både Debug och Release.

**Nya Swift/Obj-C-filer måste läggas till manuellt i Xcode-projektet**
`project.pbxproj` är inte filsystembaserat — nya källfiler syns inte för Xcode förrän de är explicit registrerade (gjordes via `xcodeproj`-gemet från kommandoraden i det här fallet). Samma varning som redan noterad i dogish/decisions.md för `SpeechRecognitionPlugin.swift`.

## Kortmallar

**Tre mallar omdesignade utifrån verkliga referensbilder (2026-07-21)**
Användaren skickade foton av ett kalifornienskt körkort, ett svenskt EU-körkort och ett mugshot-studiofoto. Mallarna byggdes om för att matcha dessa layoutkonventioner (säkerhetsmönster, numrerade fält, ljusgrå mugshot-bakgrund med höjdlinjer) istället för generiska platta kort — se `src/components/cards/`.

**Humor-spår valt istället för säsongs-/helgmallar (2026-07-21)**
Den tidigare "Dog Card Generator"-idén (jul, nyår, påsk, halloween, födelsedag/sommar) övervägdes men valdes bort till förmån för ett humor-/igenkänningsspår: kort byggs kring saker hundägare känner igen sig i (dejting-profil-parodi, skolbetyg, vaktrapport), inte säsongsteman. Användarens fru är skeptisk till att skämt-vinkeln alls kommer landa — beslutet togs ändå eftersom appen är prissatt lågt (~19–29 kr) som ett medvetet lågrisk-experiment, och ID-kortet/Körkortet bär det seriösa säljargumentet oavsett. Säsongsmallar kan återupptas senare om humor-spåret inte biter.

**Tre nya kort byggda på samma mönster som Mugshot (2026-07-21): Barkinder, Betyg, Guard**
- **Barkinder** (`DatingCard.jsx`) — dejting-profil-parodi (undvek namnet "Tinder" pga varumärkesrisk i en betald app). Fasta "dating app"-signaler (aktiv nu, gillande-räknare, match%) för genre-igenkänning, plus ett redigerbart bio-fält.
- **Betyg** (`ReportCard.jsx`) — skolbetygsformulär med riktig svensk betygsskala (A–F, inte amerikansk plus/minus, för bättre igenkänning). Betyg per kategori växlas genom att trycka (cyklar A→F), plus ett fritt kommentarsfält i handstilsliknande font.
- **Guard** (`GuardCard.jsx`) — vaktrapport/"säkerhetsbadge"-tema, marinblått med sköldformad emblem (`clip-path`) och egna ikoner (`HandcuffsIcon.jsx`, `BinocularsIcon.jsx`) för polis-känsla, plus en incidentlogg med (medvetet triviala) "hot" hunden vaktat mot.

Alla tre delar samma mönster som Mugshot: en generisk `onFieldChange(field, value)`-callback i `App.jsx` sparar valfritt kort-specifikt fält (`datingBio`, `reportGrades`, `reportComment`, `guardNote`) på hundprofilen, ingen ny lagringsmekanism krävdes.

**Undvek påhittade "Central Bark X"-institutionsnamn (2026-07-21)**
Första utkasten av Mugshot/Guard/Betyg hade skämtinstitutioner ("Central Bark Department", "Bark Security", "Central Bark Academy"). Användaren tyckte det blev för corny — togs bort helt. Där ett kort behövde en "underskrift" (Betyg, Guard) visas istället hundens eget namn i signaturstil, inte ett påhittat företagsnamn.

## Språkstöd (sv/en, 2026-07-21)

**React Context istället för prop-drilling genom CardView → varje kort**
`src/lib/i18n.jsx` exporterar en `LanguageProvider` (wrappar `<App>` i `main.jsx`) + `useLanguage()`-hook (`{ lang, setLang, t }`). Varje kortkomponent anropar `useLanguage()` direkt istället för att få `lang` som prop nerskickat genom `CardView` — enklare att lägga till fler kort senare utan att ändra prop-kedjan. Språkvalet sparas via `@capacitor/preferences` (`dogid_lang`) så det finns kvar mellan sessioner. Toggle-knapp (EN/SV) ligger uppe till höger i `app-header`.

Genre-korrekt engelska (Mugshots "CHARGE"/"BOOKED", Guards "Chief of Security") hålls medvetet oöversatt oavsett språkläge — det är redan på engelska i originalet av genre-skäl, inte svensk text som råkat vara kvar.

## Namnbyte till Dogsona (2026-07-21)

**"Dog ID" → "Dogsona"**, ingen "by Dogish"-tagline. Anledning: användarens Instagram har redan "Dogish" som kontonamn med "by Doxtail" som undertext — att sätta "by Dogish" på en annan app hade krockat med det etablerade mönstret (Doxtail = avsändare/studio, Dogish = eget produktvarumärke). "Dogsona" (dog + persona) valdes istället, med risk noterad att ordet redan används i vissa community-kretsar för påhittade hund-avatarer (typ "fursona" för hundar) — bedömd som hanterbar med tydlig undertitel i App Store-listningen.

Ändringar: `capacitor.config.json` (`appName`), `package.json` (`name`), `Info.plist` (`CFBundleDisplayName`), `index.html` (`<title>`), samt app-header i `App.jsx` (logga + tvåtons-wordmark "Dog" grönt / "sona" svart, ingen tagline). `appId` (`com.doxtail.dogid`) lämnades **oförändrad** — bundle-ID-byten är svåra att ångra (påverkar App Store Connect-registrering/provisioning) och inget uttryckligt beslut om det har tagits.

App-ikon och splashscreen bygger på `dogsona.png` (ligger i repo-root) — kopierad till `AppIcon.appiconset` (1024×1024, ingen alfakanal) och till `Splash.imageset` (centrerad, rundade hörn, på appens varmvita bakgrund `#faf9f7`).

## Stort scope-skifte: från sex kort till två djupa generatorer (2026-07-22)

**Bakgrund:** Efter att ha byggt Wanted (western wanted-poster) och Behind Bars (fängelsegaller) som ytterligare två kortmallar, bollade användaren produktriktningen (både med ChatGPT och på egen hand). Slutsats: "Hellre två riktigt bra generatorer än tre där en ser halvfärdig ut."

**Beslut:**
- **Mugshot blir huvudfunktionen** — modern, ren, personlig, rolig. Ska bli en riktig konfigurerbar generator (flera bakgrunder, valbar BOOKED-stämpel, skyltar, drag/skala, stickers), inte bara ett statiskt kort.
- **Wanted blir den estetiska/dramatiska generatorn** — sliten westernstil, med planerade varianter (Reward/Wanted/Dead or Alive/Sheriff's Notice), flera pappers-/ramvarianter, valbar belöningsvaluta, åldrings-slider.
- **Behind Bars skjuts på framtiden.** Det såg för "tecknat"/klippt-och-klistrat ut (gallren kändes som en Snapchat-filter ovanpå fotot snarare än att hunden faktiskt satt i en cell). Ska bara återupptas om hunden kan integreras med riktigt ljus/skugga/djup i cellmiljön.
- ID-kort, Körkort, Barkinder, Betyg, Guard kommenterades bort (inte borttagna) i `CardView.jsx` i samma veva — de tävlade om uppmärksamhet utan att bära någon av de två teman.

**Motivering för själva principen** (två djupa > tre grunda): varje tema ska ha nog många val att en användare kan göra fem olika bilder utan att det känns likadant — det är vad som gör 29 kr motiverat istället för pinsamt. Se roadmap.md för konkret byggordning (Fas 1–3).

**Namnbyte diskuterat men inte beslutat:** "Pawlice" (paw + police) föreslogs som bättre namn än "Dogsona" nu när brotts-temat är kärnan — ingen ändring gjord än.

## Wanted-kortet: iterativ realism (2026-07-22)

**Från CSS-gradienter till procedurellt genererade texturer.** Första versionen av både Wanted och Behind Bars byggde papper/trä/galler med rena CSS-gradienter (`repeating-linear-gradient`, `radial-gradient`). Användaren tyckte det blev för "tecknat" ("som att sätta på ett Snapchat-filter"). Löst genom att generera riktiga texturer offline med Python/PIL (brus, directional-squash-teknik för ådring, foxing-fläckar, oregelbundna brända hörn) och bunta dem som statiska JPG/PNG (`src/components/cards/textures/`) — CSS `background-image: url(...)` istället för gradienter. Genereringsskriptet i sig checkades **inte** in i repot (bara outputen), ligger i scratchpad.

**Fotot ska smälta in i pappret, inte se ut som ett inklistrat foto.** Hundfotot är redan bakgrundsborttaget (transparent), så ett extra CSS-mask/vinjett-lager ovanpå skapade bara en ny konstgjord "ram". Löst genom att ta bort masken helt och istället använda staplade `drop-shadow()`-lager (0 offset, ökande blur, papprets egen färg) för att smälta konturens kant mjukt in i bakgrunden, plus `mix-blend-mode: multiply` + gråskala/sepia-filter för färgmatchning.

**Filmkorn som enande lager.** Samma `film-grain.jpg`-textur läggs som ett topplager (`mix-blend-mode: overlay`, låg opacitet) över både Wanted och Mugshot, så foto + bakgrund + rekvisita känns som samma fotografi istället för tre olika lager.

## Dela kortet (2026-07-22)

**`html-to-image` + `@capacitor/filesystem` + `@capacitor/share`.** Kortet (`.template-stage`) renderas till en PNG (`toPng`, `pixelRatio: 2`), skrivs till `Directory.Cache`, delas via native delningsmeny (`Share.share({ files: [uri] })`) — öppnar automatiskt SMS/Instagram/TikTok/etc. utan appspecifik integration.

**Bugg: hundfotot saknades i den delade bilden.** `html-to-image` kunde inte hämta fotots `capacitor://.../​_capacitor_file_/...`-URL via `fetch()` under exporten (troligen för att den specialschema-URL:en kräver Capacitors bridge-hantering som fetch inte går igenom på samma sätt som `<img src>`). Fix: läs fotot som base64 (`loadPhotoBase64()` i `dogStorage.js`) och byt tillfälligt ut `<img>`-elementens `src` till en `data:`-URL bara under exportmomentet, återställ efteråt.

**Exportformat komponeras med `<canvas>`.** Post (1080×1080), Story (1080×1920), Bakgrund (1170×2532): en blurad uppskalad (cover-fit) kopia av kortet som bakgrund + det skarpa kortet centrerat (contain-fit) ovanpå, så det aldrig blir tomma kanter i ett annat sidoförhållande än kortets eget.

## Drag/nyp-skala + sticker-arkitektur (2026-07-22)

**`useDraggablePhoto`-hook** (`src/lib/useDraggablePhoto.js`), delad mellan fotot och alla stickers. En-fingers-pointer flyttar, två samtidiga pointers skalar (nypa). Committar (`onChange`) bara när sista fingret lyfts — inte varje `pointermove` — annars hade varje pixel av rörelse triggat en disk-skrivning via `onFieldChange`/Preferences.

**Sticker-modell inspirerad av Toca Boca:** en "sticker-hylla" (av/på-knappar) under kortet lägger till/tar bort rekvisita (första: solglasögon, `SunglassesIcon.jsx`, ren SVG). Ingen explicit "välj lager"-state behövdes — varje sticker har sin egen `useDraggablePhoto`-instans och eget DOM-element, så webbläsarens vanliga hit-testing (vilket element ligger överst där du trycker) räcker för att routa pekhändelser rätt, ingen risk för att gester krockar mellan lager.

**Data:** `dog.mugshotPhotoTransform` / `dog.wantedPhotoTransform` för fotot, `dog.mugshotStickers` (objekt keyat på sticker-id) för rekvisita. Config för vilka stickers som finns i `mugshotStickers.js`.

## Två allvarliga buggar: vit skärm vid drag (2026-07-22)

**Bugg 1 — iOS "Visual Look Up" kraschade appen vid long-press på overlays.** Symptom: konsolen visade `VisualLookUp.EligibilityError` + `[MADService] Client XPC connection invalidated`, följt av vit skärm — men bara när man drog i en sticker som låg *ovanpå* hundfotot, inte när man drog fotot ensamt. Sannolik orsak: iOS egen native bildanalys (Visual Look Up) hit-testar den komponerade skärmytan oberoende av DOM/CSS `pointer-events`, hittar hundfotot *under* SVG-overlayet, och krockar med vår egen pointer capture på det översta elementet.

Fix krävde nativ kod, inte CSS: `CAPBridgeViewController.loadView()` är `final` och sätter sin egen interna `WebViewDelegationHandler` som webviewens `uiDelegate` — en override av `WKUIDelegate`-metoder direkt i `MainViewController` anropas alltså aldrig. Lösning: en proxy-delegate (`ContextMenuDisablingUIDelegate` i `MainViewController.swift`) som tar över `webView.uiDelegate` i `capacitorDidLoad()` (efter att Capacitor satt upp sitt eget), implementerar bara `contextMenuConfigurationForElement` själv (`completionHandler(nil)` → ingen kontextmeny/bildanalys alls), och vidarebefordrar allt annat oförändrat via Objective-C message forwarding (`forwardingTarget(for:)`) till Capacitors egen handler.

**Bugg 2 — den faktiska kraschen var en race condition, inte Visual Look Up.** Efter fix ovan kvarstod vit skärm, nu med tydlig JS-stacktrace: `TypeError: null is not an object (evaluating 's.current.posX')` i `useDraggablePhoto.js`. Orsak: `dragStart.current.posX` lästes *inne i* en `setPos((prev) => ...)`-callback, som React kan köra fördröjt (batching) — en `pointerup` hann sätta `dragStart.current = null` innan callbacken faktiskt exekverade. Fix: fånga `dragStart.current` i en vanlig variabel *innan* `setPos` anropas, så inget läses lat inifrån updater-callbacken.

**Lärdom:** appen hade ingen React error boundary, så det enda symptomet på ett ohanterat JS-fel var en helt vit skärm — svårt att skilja "appen kraschade" från "native problem" utan konsolloggen. La till `src/components/ErrorBoundary.jsx` runt hela appen (i `main.jsx`) som skyddsnät.

## Tredje kortet, sticker-utbyggnad och kodstädning (2026-07-23)

**Produktramning skärpt: "en generator för att skapa roliga hundbilder på egen hand".** Bekräftar och förenklar scope-skiftet från 2026-07-22 (två djupa generatorer) till en enda mening — appens värde är att låta användaren själv komponera en rolig bild (kort + rekvisita), inte att fylla i formulär för statiska mallar.

**Övervägde och avfärdade: ett enda kort + "Background"-väljare istället för tre separata mallar.** Idén var att slå ihop Studio/Mugshot/Wanted till ett kort med en bakgrundsväljare under (likt sticker-trayn). Avfärdades eftersom Mugshot och Wanted inte bara är visuella bakgrunder — de har egna redigerbara textfält och layouter (Mugshots "placard" med charge-text, Wanteds reward-rubrik + stämpel). En sådan sammanslagning hade krävt villkorad UI för fälten per bakgrund, mer komplext än nuvarande tre-flikars-lösning. Bibehölls som det är.

**Tredje kortet "Studio" tillagt** (`BlankCard.jsx`) — tomt vitt kort, bara hundfoto (fritt drag-/pinch-/rotationsbart) + fri sticker-lek, ingen text alls. Först i template-tabs och default vald flik. Fick UI-namnet "Studio" (inte det interna arbetsnamnet "Card 1"). Samma bredd/aspect-ratio (4:5) som Mugshot-kortets fotoyta.

**Sticker-rotation lagd ovanpå befintlig nyp-skala, ingen ny gest.** `useDraggablePhoto.js` beräknar nu även vinkeln mellan de två pekarna (`Math.atan2`) i samma tvåfingersgest som redan skalade, och lägger till `rotate()` i samma CSS-transform. Gäller både fotot och alla stickers i alla kort.

**Sticker-kategorier och delad `CardSticker.jsx`.** Stickers grupperas nu under rubriker i trayn: Huvudbonader, Emojis, Polis, Rekvisita (`STICKER_CATEGORIES` i `mugshotStickers.js`). Sticker-rendering (ikon-mappning + drag/pinch/rotation-wrapper) extraherades ur `MugshotCard.jsx` till en delad `CardSticker.jsx` eftersom både Mugshot och Studio nu behöver exakt samma logik — duplicering hade annars krävt 6 dubblerade ikonimporter.

**Tray visar nu själva stickerbilden, inte en textetikett.** Knapparna i sticker-trayn renderade tidigare bara `t(sticker.labelKey)` som text — användaren efterfrågade att se vad man faktiskt väljer. Löst med en `StickerGraphic`-hjälpkomponent (i `CardSticker.jsx`) som renderar rätt sak oavsett om stickern är en handritad SVG-komponent eller en PNG-bild. Textnamnet finns kvar som `title`/`aria-label` för tillgänglighet.

**PNG-stickers från ChatGPT importeras som ett helt "sticker-sheet", inte separata filer — beskärs med connected-component-analys, inte ett fast rutnät.** ChatGPT levererar flera transparenta stickers på en och samma bild. Ett första försök att beskära utifrån ett fast 4×6-rutnät klippte av kanten på stickers som svämmade över sin nominella cell (ChatGPTs layout är inte pixelperfekt). Löst med ett eget flood-fill/connected-components-skript i ren Python (ingen numpy/scipy tillgänglig i miljön) som hittar varje stickers faktiska gränser oavsett rutnätsavvikelse. Skriptet och originalbilden ligger i `stickers/` (utanför `src/`, inte del av byggflödet), de färdigbeskurna PNG:erna i `src/components/cards/stickerAssets/`.

**Kvalitetsgranskning: AI-genererad inbränd text i rastergrafik måste kollas manuellt, går inte att rätta i efterhand.** Av 24 beskurna stickers hade 4 förvrängd/felstavad text bakad in i själva bildkonsten (t.ex. "WAINTY!" istället för "WANTED!", "PET FOДCE" istället för "PET FORCE") — omöjligt att fixa utan att generera om bilden, eftersom det är pixlar, inte redigerbar text. Dessa fyra kasserades; bara de 20 godkända togs in i appen. Vänta nya bilder från ChatGPT för resten.

**Dödkod faktiskt borttagen, inte längre bara kommenterad.** ID-kort, Körkort, Barkinder, Betyg, Guard och Bakom galler (`IdCard`, `DriversLicenseCard`, `DatingCard`, `ReportCard`, `GuardCard`, `BehindBarsCard`) kommenterades bort 2026-07-22 vid scope-skiftet men låg kvar i repot. Nu borttagna på riktigt (komponenter + CSS + deras exklusiva ikoner `BinocularsIcon.jsx`/`HandcuffsIcon.jsx` + oanvända i18n-strängar och `format.js`-hjälpfunktioner `formatDate`/`calcAge`/`formatGender`/`genderCode`), eftersom tre-korts-scopet (Studio/Mugshot/Wanted) nu bedöms stabilt nog att sluta bära på dem "i fall vi ångrar oss".

## Bygg-/synk-flöde (Capacitor)

**`npx vite build` uppdaterar bara `dist/`, inte det Xcode faktiskt bygger**
`ios/App/App/public/` (det Xcode paketerar) är en kopia som bara uppdateras av `npx cap copy ios` (eller `cap sync`). Lätt att glömma efter en `vite build` — orsakade förvirring en gång under sessionen (användaren såg inga av de nya CSS-ändringarna i appen). Rutin: kör alltid `vite build` + `cap copy ios` ihop, aldrig bara det förra, innan man ber användaren testa i Xcode.
