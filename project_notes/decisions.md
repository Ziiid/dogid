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

**Ny inriktning under uppbyggnad: "Dog Card Generator"**
Konceptet breddas mot säsongs-/helgmallar (jul, nyår, påsk, halloween, födelsedag eller sommar, mugshot) istället för enbart ID-dokument-pastischer. Se roadmap.md — inte påbörjat i kod ännu.
