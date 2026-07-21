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

## Bygg-/synk-flöde (Capacitor)

**`npx vite build` uppdaterar bara `dist/`, inte det Xcode faktiskt bygger**
`ios/App/App/public/` (det Xcode paketerar) är en kopia som bara uppdateras av `npx cap copy ios` (eller `cap sync`). Lätt att glömma efter en `vite build` — orsakade förvirring en gång under sessionen (användaren såg inga av de nya CSS-ändringarna i appen). Rutin: kör alltid `vite build` + `cap copy ios` ihop, aldrig bara det förra, innan man ber användaren testa i Xcode.
