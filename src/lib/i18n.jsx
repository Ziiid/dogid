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
  stickerSunglasses: { sv: 'Solglasögon', en: 'Sunglasses' },
  stickerCap: { sv: 'Keps', en: 'Cap' },
  stickerSombrero: { sv: 'Sombrero', en: 'Sombrero' },
  stickerBanditMask: { sv: 'Bandit-mask', en: 'Bandit mask' },
  stickerSpeechBubble: { sv: 'Pratbubbla', en: 'Speech bubble' },
  stickerHeart: { sv: 'Hjärta', en: 'Heart' },
  stickerLaughingEmoji: { sv: 'Skrattande emoji', en: 'Laughing emoji' },
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
