# Buggar & kända problem

## Lösta (2026-07-21)

**Bakgrundsborttagning gav alltid `{"code":"UNIMPLEMENTED"}` — lång felsökningssaga**

Symptom: JS-anropet till det native `BackgroundRemoval`-pluginet misslyckades alltid, trots att koden kompilerade rent (`xcodebuild` grönt) och plugin-klassen syntes i de kompilerade objektfilerna.

Felsökningskedjan (i tur och ordning, allt blindgångar tills sista steget):
1. Trodde plugin-registrering via gammal `CAP_PLUGIN`-makro (`.m`-fil) räckte → bytte till `CAPBridgedPlugin`-protokollet i Swift. Löste inte problemet.
2. Trodde koden var "dead-stripped" av linkern eftersom den bara nås via runtime-reflektion → verifierade med `nm`/`strings` på den kompilerade binären. **Detta var delvis rätt** — men jag kollade fel fil (`App` istället för `App.debug.dylib`, en separat "debug executor"-dylib som moderna Xcode-versioner använder). Riktig binär visade att symbolerna faktiskt fanns med.
3. Testade `_ = BackgroundRemovalPlugin.self` i AppDelegate för att tvinga en referens — kompilatorn optimerade bort den (ingen "riktig" undefined-symbol-referens skapades).
4. Satte `DEAD_CODE_STRIPPING = NO` på App-targetet — nödvändigt men inte tillräckligt ensamt, eftersom `MainViewController` (bara refererad via klassnamn i storyboarden) också behöver den inställningen.
5. Skapade `MainViewController.swift` (subklass av `CAPBridgeViewController`) som anropade `bridge?.registerPluginType(BackgroundRemovalPlugin.self)` i `capacitorDidLoad()`. Verifierade med `NSLog` att metoden faktiskt kördes (`bridge is nil: false`) — ändå `UNIMPLEMENTED`.
6. **Root cause hittad genom att jämföra med dogish**, som redan löst exakt samma typ av problem för sin `SpeechRecognitionPlugin`: rätt metod är `bridge?.registerPluginInstance(BackgroundRemovalPlugin())` — en **instans**, inte `registerPluginType` med bara typen. `registerPluginType` verkar inte uppdatera den lista över tillgängliga plugins som JS-bryggan redan skickat till webviewen.

**Lärdom:** när man bygger en ny lokal Capacitor-plugin i ett syskonprojekt, kolla alltid hur det redan lösts i dogish (`frontend/ios/App/App/MainViewController.swift` + motsvarande plugin-fil) innan man felsöker från grunden — hade sparat en hel debug-session.

**Verifieringsmetod som faktiskt fungerade:** installerade och körde appen direkt på användarens fysiska iPhone via `xcrun devicectl device install app` + `xcrun devicectl device process launch --console`, vilket strömmade native-konsolen direkt till mig istället för att gå via användarens Xcode-fönster och copy-paste. Snabbare loop när felsökningen drar ut på tiden.

---

**Fotot sparades inte mellan flikbyten (Formulär → Kort → Formulär)**

Symptom: efter att ha valt ett nytt foto och sparat visade kortvyn fortfarande det gamla fotot, och gick man tillbaka till formuläret var det gamla fotot där också.

Orsak: `App.jsx` villkorsrenderade `<DogForm>` vs `<CardView>` baserat på aktiv flik — `DogForm` avmonterades helt vid flikbyte, vilket kastade dess lokala `photoUri`-state. `App.jsx` uppdaterade dessutom aldrig sin egen `photoUri`-state efter första sidladdningen, så `CardView` fick alltid den gamla filsökvägen.

Fix: lyfte fotouppdateringen upp till `App.jsx` via en ny `onPhotoChange`-callback som anropas direkt när `savePhoto()` slutförs i `DogForm`, inte bara vid formulärets "Spara"-knapp.
