import { createContext, useContext, useEffect, useState } from 'react'
import { loadLang, saveLang } from './dogStorage.js'

const LanguageContext = createContext(null)

const STRINGS = {
  appTabForm: { sv: 'Formulär', en: 'Form' },
  appTabCard: { sv: 'Kort', en: 'Card' },
  appSaved: { sv: 'Sparat!', en: 'Saved!' },

  tplBlank: { sv: 'Studio', en: 'Studio' },
  tplMugshot: { sv: 'Mugshot', en: 'Mugshot' },
  tplWanted: { sv: 'Efterlyst', en: 'Wanted' },
  cardEmpty: {
    sv: 'Fyll i formuläret för att se ditt kort.',
    en: 'Fill in the form to see your card.',
  },

  photoHint: {
    sv: 'Bäst kvalitet på kortet: ta bilden rakt framifrån av hundens ansikte.',
    en: 'Best card quality: take the photo straight-on of the dog’s face.',
  },
  photoProcessing: { sv: 'Tar bort bakgrund…', en: 'Removing background…' },
  photoAdd: { sv: 'Lägg till foto', en: 'Add photo' },
  photoDragHint: {
    sv: 'Dra bilden för att flytta den i ringen',
    en: 'Drag the photo to reposition it in the ring',
  },
  labelName: { sv: 'Namn', en: 'Name' },
  labelBreed: { sv: 'Ras', en: 'Breed' },
  labelBirthDate: { sv: 'Födelsedatum', en: 'Date of birth' },
  labelGender: { sv: 'Kön', en: 'Gender' },
  genderChoose: { sv: 'Välj', en: 'Choose' },
  genderMale: { sv: 'Hane', en: 'Male' },
  genderFemale: { sv: 'Tik', en: 'Female' },
  labelColor: { sv: 'Färg', en: 'Color' },
  labelCoat: { sv: 'Päls', en: 'Coat' },
  labelKennel: { sv: 'Kennel / uppfödare', en: 'Kennel / breeder' },
  labelChip: { sv: 'Chipnummer', en: 'Chip number' },
  labelInsurance: { sv: 'Försäkring', en: 'Insurance' },
  labelVet: { sv: 'Veterinär', en: 'Veterinarian' },
  labelMedical: { sv: 'Allergier / medicinskt', en: 'Allergies / medical' },
  labelEmergency: { sv: 'Nödkontakt', en: 'Emergency contact' },
  emergencyPlaceholder: { sv: 'Namn och telefonnummer', en: 'Name and phone number' },
  saveButton: { sv: 'Spara', en: 'Save' },
  savingButton: { sv: 'Sparar…', en: 'Saving…' },

  mugshotBreedLabel: { sv: 'RAS:', en: 'BREED:' },
  mugshotUnknown: { sv: 'OKÄND', en: 'UNKNOWN' },
  mugshotChargePlaceholder: { sv: 'Skriv en rolig text…', en: 'Write something funny…' },

  wantedReward: { sv: 'BELÖNING', en: 'REWARD' },
  wantedApprehension: {
    sv: 'Utfästes för gripande av',
    en: 'Will be paid for the apprehension of',
  },
  wantedChargeLabel: { sv: 'EFTERLYST FÖR:', en: 'WANTED FOR:' },
  wantedChargePlaceholder: {
    sv: 'Skriv vad hunden är efterlyst för…',
    en: 'Write what the dog is wanted for…',
  },
  wantedStamp: { sv: 'PÅ FRI FOT', en: 'STILL LOOSE' },

  editableFieldsTitle: { sv: 'Editerbara fält', en: 'Editable fields' },
  wantedEditableReward: { sv: 'Belöningsbelopp', en: 'Reward amount' },
  wantedEditableCharge: {
    sv: 'Anklagelse (vad hunden är efterlyst för)',
    en: 'Charge (what the dog is wanted for)',
  },

  shareButton: { sv: 'Dela', en: 'Share' },
  shareDialogTitle: { sv: 'Dela kortet', en: 'Share card' },
  shareError: {
    sv: 'Kunde inte dela kortet just nu.',
    en: 'Could not share the card right now.',
  },

  stickerCategoryHeadwear: { sv: 'Huvudbonader', en: 'Head wear' },
  stickerCategoryEmojis: { sv: 'Emojis', en: 'Emojis' },
  stickerCategoryPolice: { sv: 'Polis', en: 'Police' },
  stickerCategoryProps: { sv: 'Rekvisita', en: 'Props' },
  stickerSombrero: { sv: 'Sombrero', en: 'Sombrero' },
  stickerBanditMask: { sv: 'Bandit-mask', en: 'Bandit mask' },
  stickerPoliceHat: { sv: 'Poliskeps', en: 'Police cap' },
  stickerSheriffHat: { sv: 'Sheriffhatt', en: 'Sheriff hat' },
  stickerMilitaryBeret: { sv: 'Militärbasker', en: 'Military beret' },
  stickerFirefighterHelmet: { sv: 'Brandmanshjälm', en: 'Firefighter helmet' },
  stickerHardHat: { sv: 'Bygghjälm', en: 'Hard hat' },
  stickerChefHat: { sv: 'Kockmössa', en: 'Chef hat' },
  stickerPirateHat: { sv: 'Pirathatt', en: 'Pirate hat' },
  stickerCaptainHat: { sv: 'Kaptenmössa', en: 'Captain hat' },
  stickerVikingHelmet: { sv: 'Vikingahjälm', en: 'Viking helmet' },
  stickerDetectiveHat: { sv: 'Detektivhatt', en: 'Detective hat' },
  stickerGuiltyStampRect: { sv: 'Guilty-stämpel', en: 'Guilty stamp' },
  stickerGuiltyStampRound: { sv: 'Guilty-sigill', en: 'Guilty seal' },
  stickerWantedRect: { sv: 'Wanted-stämpel', en: 'Wanted stamp' },
  stickerHandcuffs: { sv: 'Handbojor', en: 'Handcuffs' },
  stickerSiren: { sv: 'Sirén', en: 'Siren' },
  stickerEvidenceBag: { sv: 'Bevispåse', en: 'Evidence bag' },
  stickerPoliceLineTape: { sv: 'Avspärrningstejp', en: 'Police tape' },
  stickerCaseClosedBoard: { sv: 'Fallet löst', en: 'Case closed' },
  stickerInnocentNote: { sv: 'Oskyldig?', en: 'Innocent?' },
  stickerGoodBoyBadge: { sv: 'Good Boy-märke', en: 'Good Boy badge' },
  stickerPawMedal: { sv: 'Tass-medalj', en: 'Paw medal' },
  stickerMamasHeart: { sv: 'Mammas hjärta', en: "Mama's heart" },
  stickerPawPrints: { sv: 'Tassavtryck', en: 'Paw prints' },
  stickerPawNote: { sv: 'Tass-lapp', en: 'Paw note' },
  stickerTennisBall: { sv: 'Tennisboll', en: 'Tennis ball' },
  stickerBone: { sv: 'Ben', en: 'Bone' },
  stickerPoop: { sv: 'Bajshög', en: 'Poop' },
  stickerTrashCan: { sv: 'Soptunna', en: 'Trash can' },
  stickerMegaphone: { sv: 'Megafon', en: 'Megaphone' },
  stickerUnderArrest: { sv: 'Anhållen', en: 'Under arrest' },
  stickerTinyTerror: { sv: 'Liten terror', en: 'Tiny Terror' },
  stickerSparkles: { sv: 'Glitter', en: 'Sparkles' },
  stickerNapChampion: { sv: 'Tupplursmästare', en: 'Nap Champion' },
  stickerBestSniffer: { sv: 'Bästa nosen', en: 'Best Sniffer' },
  stickerRewardCoins: { sv: 'Belöningsmynt', en: 'Reward coins' },
  stickerDramaQueen: { sv: 'Drama Queen', en: 'Drama Queen' },
  stickerCouchNap: { sv: 'Soffvila', en: 'Couch nap' },
  stickerPartyHat: { sv: 'Partyhatt', en: 'Party hat' },
  stickerSantaHat: { sv: 'Tomteluva', en: 'Santa hat' },
  stickerReindeerAntlers: { sv: 'Renhorn', en: 'Reindeer antlers' },
  stickerWitchHat: { sv: 'Häxhatt', en: 'Witch hat' },
  stickerWizardHat: { sv: 'Trollkarlshatt', en: 'Wizard hat' },
  stickerBirthdayHat: { sv: 'Födelsedagshatt', en: 'Birthday hat' },
  stickerOktoberfestHat: { sv: 'Oktoberfest-hatt', en: 'Oktoberfest hat' },
  stickerSmiling: { sv: 'Leende', en: 'Smiling' },
  stickerLaughingTears: { sv: 'Skrattgråt', en: 'Laughing tears' },
  stickerHeartEyes: { sv: 'Hjärtögon', en: 'Heart eyes' },
  stickerTongueOut: { sv: 'Tunga ute', en: 'Tongue out' },
  stickerBlowingKiss: { sv: 'Slänger en puss', en: 'Blowing kiss' },
  stickerRollingEyes: { sv: 'Rullar med ögonen', en: 'Rolling eyes' },
  stickerBulgingEyes: { sv: 'Utstående ögon', en: 'Bulging eyes' },
  stickerSunglassesEmoji: { sv: 'Solglasögon-emoji', en: 'Sunglasses emoji' },
  stickerSmirking: { sv: 'Flinande', en: 'Smirking' },
  stickerTongueSweat: { sv: 'Tunga & svettdroppe', en: 'Tongue sweat' },
  stickerSleepy: { sv: 'Sömnig', en: 'Sleepy' },
  stickerUnamused: { sv: 'Omotiverad', en: 'Unamused' },
  stickerBlushingFlustered: { sv: 'Blyg/förvirrad', en: 'Blushing/flustered' },
  stickerScreamingInFear: { sv: 'Skriker av skräck', en: 'Screaming in fear' },
  stickerCrying: { sv: 'Gråtande', en: 'Crying' },
  stickerLaughingDead: { sv: 'Dör av skratt', en: 'Dying of laughter' },
  stickerAngrySwearing: { sv: 'Arg svordom', en: 'Angry swearing' },
  stickerMindBlown: { sv: 'Mind blown', en: 'Mind blown' },
  stickerHeart: { sv: 'Hjärta', en: 'Heart' },
  stickerPoopEmoji: { sv: 'Bajs-emoji', en: 'Poop emoji' },
  stickerCoffeeMug: { sv: 'Kaffekopp', en: 'Coffee mug' },
  stickerMatchaCup: { sv: 'Matcha-kopp', en: 'Matcha cup' },
  stickerSunglassesBlack: { sv: 'Solglasögon (svarta)', en: 'Sunglasses (black)' },
  stickerSunglassesAviator: { sv: 'Solglasögon (aviator)', en: 'Sunglasses (aviator)' },
  stickerSpeechBubble: { sv: 'Pratbubbla', en: 'Speech bubble' },
  stickerZzzSleep: { sv: 'Sover (Zzz)', en: 'Sleeping (Zzz)' },
  stickerMagicWand: { sv: 'Trollstav', en: 'Magic wand' },
  stickerCashMoney: { sv: 'Kontanter', en: 'Cash' },
  stickerPeePuddle: { sv: 'Kissfläck', en: 'Pee puddle' },
  stickerDogBowl: { sv: 'Hundskål', en: 'Dog bowl' },
  stickerBeerMug: { sv: 'Ölsejdel', en: 'Beer mug' },
  stickerSodaCan: { sv: 'Läskburk', en: 'Soda can' },
  stickerCocktail: { sv: 'Cocktail', en: 'Cocktail' },
  stickerWineGlass: { sv: 'Vinglas', en: 'Wine glass' },
  stickerBeachUmbrella: { sv: 'Strandparasoll', en: 'Beach umbrella' },
  stickerSunSticker: { sv: 'Sol', en: 'Sun' },
  stickerPalmTreeIsland: { sv: 'Palmö', en: 'Palm island' },
  stickerVacationSign: { sv: 'Vacation-skylt', en: 'Vacation sign' },
  stickerHolidaySign: { sv: 'Holiday-skylt', en: 'Holiday sign' },
  stickerKeepOutSign: { sv: 'Keep Out-skylt', en: 'Keep Out sign' },

  formatOriginal: { sv: 'Kort', en: 'Card' },
  formatPost: { sv: 'Inlägg', en: 'Post' },
  formatStory: { sv: 'Story', en: 'Story' },
  formatWallpaper: { sv: 'Bakgrund', en: 'Wallpaper' },
}

export function getDefaultWantedCharge(lang) {
  return lang === 'en'
    ? 'Theft of twelve socks and disturbing the peace of the living room.'
    : 'Stöld av tolv strumpor och störande av den allmänna ordningen i vardagsrummet.'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('sv')

  useEffect(() => {
    loadLang().then((saved) => {
      if (saved) setLangState(saved)
    })
  }, [])

  function setLang(next) {
    setLangState(next)
    saveLang(next)
  }

  function t(key) {
    return STRINGS[key]?.[lang] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
