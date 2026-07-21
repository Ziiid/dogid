# CLAUDE.md

Detta är "Dog ID" — ett fristående syskonprojekt till [dogish](../dogish/), men **eget repo utan delad kod, databas eller backend**. Skälet: dogish-repot triggar automatisk deploy till Vercel/Railway vid push till main, och att blanda in ett obesläktat experiment där ökar bara risken att råka störa den pipelinen.

Bakgrund och lärdomar från dogish-projektet (RevenueCat-fallgropar, App Store-granskningsprocess, prissättningsbeslut) finns i [../dogish/project_notes/](../dogish/project_notes/) — läs där vid behov av kontext, men inget i dogish-repot ska ändras härifrån.

## Konceptet

En extremt enkel engångsköpsapp: användaren fyller i ett formulär om sin hund (namn, ras, födelsedatum, kön, färg, päls, kennel/uppfödare, chipnummer, försäkring, veterinär, allergier/medicinskt, nödkontakt, foto) och appen genererar ett snyggt digitalt "ID-kort" att visa hos veterinären, dela med kompisar eller posta på Instagram.

## Grundbeslut (från resonemang 2026-07-21)

- **Ingen backend, ingen databas.** Allt lagras lokalt på enheten (Capacitor `@capacitor/preferences` för formulärdata, `@capacitor/filesystem` för hundbilden). Ingen SQLite behövs för v1 — bara ett kort per hund.
- **Betala upp front, ingen In-App Purchase.** Priset sätts som appens engångspris i App Store Connect / Play Console (~19 kr / $1.99), inte via IAP eller RevenueCat. Anledning: målet är extrema spontanitetsköp — om användaren får se resultatet gratis först (med vattenstämpel) hinner den emotionella kicken mättas innan betalningen, och konverteringen dör i tanken "vad ska jag egentligen med detta till". App Store-skärmdumpen (t.ex. Charlie-kortet) måste bära hela säljargumentet.
- **"Dog", inte "Pet".** Håller v1 smalt för att bevara den enkla kopplingen till Dogish-varumärket ("Dog ID by Dogish") och undvika generiska fält som passar sämre för olika djurslag. Bredda till katt/andra djur senare bara om konceptet visar sig fungera.
- **QR-koden (om den finns kvar i designen) ska inte länka till en dynamisk webbsida** — det skulle kräva hosting/backend, vilket bryter mot "ingen backend"-principen. Om QR behålls: koda in kontaktinfo direkt som text/vCard, inte en URL.
- **GDPR är i praktiken inte tillämpligt** eftersom ingen data lämnar enheten — men Apple kräver ändå en Privacy Policy-URL och ifylld "nutrition label" (sannolikt "Data Not Collected" på allt) även för appar utan datainsamling.
- Möjlig PDF/kort-överlappning med dogish finns (dogish har en Premium-låst PDF-export med foderlogg/viktkurva/vaccinationsstatus), men den delen bygger på pågående loggad data som Dog ID aldrig kommer ha utan backend — bedömd risk för kannibalisering av Premium-uppgraderingar är låg.
- **Flera visuella mallar ("framing") av samma kort**, valbara av användaren: t.ex. "seriöst ID", "körkort" och en skämtsam "Mugshot" (med redigerbar rolig text, t.ex. "Guilty as charged - for being cute"). Detta är ren reskin av samma datamodell/fält — inga nya funktioner eller card-typer — så det bryter inte mot "bygg bara ett kort"-principen. Håll det till 2-3 mallar för v1, annars blir designarbetet (varje mall är ett eget layoutjobb) den nya flaskhalsen. Mugshot-varianten bedöms som den mest virala/delningsbenägna, medan ID-kortet bär det seriösa säljargumentet i App Store.
- **Använd samma färgpalett som dogish** för visuell varumärkeskoppling ("Dog ID by Dogish"). Dogish hex-koder (hårdkodade i `App.css`, inga CSS-variabler):
  - Primär (salvia-grön): `#6aab8a`
  - Sekundär/mörkare grön (rubriker/text): `#2d5a3d`
  - Ljusgröna bakgrunder/borders: `#c8dfd4`, `#edf7f1`, `#d8ede4`, `#f2faf5`
  - App-bakgrund (varmvit): `#faf9f7`
  - Textfärger: `#2d2d2d` / `#1a1a1a` (mörk), `#8a7f74` / `#b0a89f` (dämpad)
  - Fel/varning (röd): `#d9534f`, `#c0392b`, `#e05a5a`

## Vanor att ta med från dogish-arbetet

- Svara alltid på svenska.
- Användaren testar appar enbart på iPhone via Xcode, inte i webbläsaren.
- Fråga alltid innan viktiga beslut/fakta loggas i project_notes/ (skapa motsvarande struktur här när det blir relevant).
- "Säg till när klar" betyder paus — vänta med commit/push tills användaren uttryckligen bekräftar.
- Kontrollera alltid `git status` fullt ut (inklusive untracked mappar) innan commit.
