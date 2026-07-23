# Buggar & kända problem

## Lösta (2026-07-21)

**Kortmallsflikar utan `flex-wrap` gjorde att hela sidan (inklusive korten) zoomades ut**

Symptom: efter att en femte/sjätte kortmall lades till (Barkinder, Betyg, Guard) upplevde användaren att alla kort blev mindre, trots att inget i själva kortkomponenterna ändrats.

Orsak: `.template-tabs` i `CardView.css` hade `display: flex` utan `flex-wrap`, så flikraden blev bredare än viewporten när for många flikar radades upp i en enda rad. Bredare-än-viewport-innehåll tvingar iOS WKWebView att effektivt zooma ut hela sidan för att få plats, vilket krymper allt — inte bara flikarna.

Fix: `flex-wrap: wrap` + `justify-content: center` + `max-width: 340px` på `.template-tabs`, så flikarna radbryter (max ~3-4 per rad) istället för att tvinga fram överbredd.

**Lärdom:** om en till synes orelaterad ändring (fler flikar, mer text i en rad) verkar krympa hela layouten på en fysisk iPhone, misstänk overflow som tvingar fram viewport-omskalning — inte att varje enskild komponent plötsligt "blivit mindre".

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

---

**Hundfotot saknades i den delade bilden (2026-07-22)**

Symptom: dela-knappen fungerade och öppnade native delningsmenyn, men den exporterade bilden visade allt utom hundfotot — tomt där fotot skulle vara.

Orsak: `html-to-image` försöker bädda in `<img>`-taggar genom att `fetch()`:a deras `src` under exporten. Hundfotots URL kommer från `Capacitor.convertFileSrc()` (ett `capacitor://.../_capacitor_file_/...`-specialschema för filer i `Directory.Data`/`Cache`) — den typen av URL verkar inte gå att `fetch()`:a på samma sätt som webviewen internt renderar `<img src>` med.

Fix: `loadPhotoBase64()` (`dogStorage.js`) läser fotot direkt som base64 via `Filesystem.readFile`, och `CardView.jsx`s delningsfunktion byter tillfälligt ut alla matchande `<img>`-elements `src`-attribut till en `data:`-URL bara under `toPng()`-anropet, återställer sedan originalvärdet i en `finally`-blockering.

**Lärdom:** bundlade statiska assets (CSS `background-image: url(...)` från `dist/assets/`) funkar fint med `html-to-image` eftersom de har vanliga same-origin-URL:er — det är specifikt Capacitors fil-URL-brygga (`_capacitor_file_`) som inte går att `fetch()`:a från JS, även om `<img>`-taggen visar bilden perfekt på skärmen.

---

**Vit skärm-krasch vid drag av stickers ovanpå fotot (2026-07-22)**

Symptom: appen kraschade till en helt vit skärm när man släppte fingret efter att ha dragit solglasögon-stickern över hundfotot i Mugshot-kortet. Konsolen visade `VisualLookUp.EligibilityError` + `[MADService] Client XPC connection invalidated` (iOS eget "Visual Look Up"-system), följt av en JS-stacktrace: `TypeError: null is not an object (evaluating 's.current.posX')`.

Två separata problem hittades och åtgärdades (se decisions.md för full teknisk bakgrund):
1. iOS native bildanalys (Visual Look Up) triggades av long-press-liknande gester på overlappande dragbara lager, oberoende av CSS `-webkit-touch-callout`/`pointer-events` — löst med en `WKUIDelegate`-proxy (`ContextMenuDisablingUIDelegate` i `MainViewController.swift`) som stänger av webviewens inbyggda kontextmeny helt.
2. Den faktiska kraschen var en race condition i `useDraggablePhoto.js`: en ref (`dragStart.current`) lästes lat inifrån en `setPos`-updater-callback som React kan köra fördröjt, och hann bli `null` (satt av en `pointerup`) innan callbacken exekverade.

**Lärdom:** appen saknade en React error boundary, så ett ohanterat JS-fel innebar en helt vit skärm utan någon indikation till användaren om vad som hänt. `src/components/ErrorBoundary.jsx` lades till runt hela appträdet som skyddsnät — visar ett "Något gick fel"-meddelande med en återställ-knapp istället.

---

**Nyp-skalning på en sticker påverkade fotot istället för stickern (2026-07-23)**

Symptom: när användaren nöp med två fingrar på en sticker för att ändra dess storlek hände inget med stickern — istället flyttades/skalades hundfotot bakom.

Två separata orsaker, hittade i två omgångar:

1. **Touch-target för liten.** `.mugshot-sticker`/`.card-sticker` hade ingen padding — träffytan var exakt lika stor som den synliga ikonen (t.ex. ~90×36px för solglasögonen). Det ena fingret i en nyp-gest hamnar ofta utanför den ytan, faller igenom `pointer-events: none`-wrappen och landar direkt på fotolagret därunder, som har sin egen oberoende drag-hook. Fix: `padding: 46px` (i linje med Apples HIG-minimum för tap-mål) på sticker-elementet, ren osynlig träffyta utan att ändra hur ikonen ser ut.

2. **Strukturell bugg, bara i Studio-kortet.** Fotots drag-lyssnare (`useDraggablePhoto`s `handlers`) sattes av misstag på samma yttre `<div>` som omslöt både fotot och sticker-overlayen, istället för på ett eget syskon-element. Pekar-events på en sticker bubblar (via normal DOM-event-bubbling) upp till den gemensamma föräldern, så fotots egen drag/pinch-hook triggades parallellt med stickerns. Fix: flyttade fotot till ett eget `.blank-photo-wrap`-element, syskon till sticker-overlayen — exakt samma mönster som redan fanns i `MugshotCard.jsx` (`.mugshot-photo-wrap` och `.mugshot-sticker-wrap` som syskon under `.mugshot-backdrop`, aldrig förälder/barn).

**Lärdom:** när flera dragbara lager (foto + stickers) delar samma scen måste varje lagers drag-lyssnare sitta på sitt eget element, aldrig på ett gemensamt förälder-element till de andra lagren — annars bubblar pointer-events upp och triggar flera `useDraggablePhoto`-instanser samtidigt för samma fysiska touch.
