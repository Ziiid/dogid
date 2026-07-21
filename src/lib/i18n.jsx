import { createContext, useContext, useEffect, useState } from 'react'
import { loadLang, saveLang } from './dogStorage.js'

const LanguageContext = createContext(null)

const STRINGS = {
  appTabForm: { sv: 'Formulär', en: 'Form' },
  appTabCard: { sv: 'Kort', en: 'Card' },
  appSaved: { sv: 'Sparat!', en: 'Saved!' },

  tplId: { sv: 'ID-kort', en: 'ID Card' },
  tplLicense: { sv: 'Körkort', en: 'License' },
  tplMugshot: { sv: 'Mugshot', en: 'Mugshot' },
  tplDating: { sv: 'Barkinder', en: 'Barkinder' },
  tplReport: { sv: 'Betyg', en: 'Report Card' },
  tplGuard: { sv: 'Guard', en: 'Guard' },
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

  idDocType: { sv: 'ID-KORT', en: 'ID CARD' },
  idBreed: { sv: 'RAS', en: 'BREED' },
  idBorn: { sv: 'FÖDD', en: 'BORN' },
  idColorCoat: { sv: 'FÄRG / PÄLS', en: 'COLOR / COAT' },
  idKennel: { sv: 'KENNEL', en: 'KENNEL' },
  idYearsSuffix: { sv: 'år', en: 'yrs' },
  idAllergyLabel: { sv: '⚠ ALLERGI / MEDICINSKT', en: '⚠ ALLERGY / MEDICAL' },
  idGenderLabel: { sv: 'KÖN', en: 'GENDER' },
  idChipLabel: { sv: 'CHIPNR', en: 'CHIP NO.' },
  idVetLabel: { sv: 'VETERINÄR', en: 'VETERINARIAN' },
  idEmergencyLabel: { sv: 'NÖDKONTAKT', en: 'EMERGENCY CONTACT' },
  idSignText: { sv: 'Tassavtryck bekräftat', en: 'Paw print verified' },
  idSerialPrefix: { sv: 'NR.', en: 'NO.' },

  licenseTitle: { sv: 'KÖRKORT', en: 'DRIVING LICENCE' },
  licenseTitleSub: { sv: 'DRIVING LICENCE', en: '' },
  licenseAlways: { sv: 'Alltid', en: 'Always' },
  licenseForLife: { sv: 'Hela livet', en: 'For life' },
  licenseKennelRegister: { sv: 'Dogish Kennelregister', en: 'Dogish Kennel Register' },

  mugshotBreedLabel: { sv: 'RAS:', en: 'BREED:' },
  mugshotUnknown: { sv: 'OKÄND', en: 'UNKNOWN' },
  mugshotChargePlaceholder: { sv: 'Skriv en rolig text…', en: 'Write something funny…' },

  datingActiveNow: { sv: 'Aktiv nu', en: 'Active now' },
  datingAway: { sv: 'm bort', en: 'm away' },
  datingUnknownBreed: { sv: 'Okänd ras', en: 'Unknown breed' },
  datingBioPlaceholder: {
    sv: 'Skriv något om hunden…',
    en: 'Write something about the dog…',
  },
  datingMatch: { sv: 'match', en: 'match' },
  datingNopeAria: { sv: 'Nej tack', en: 'No thanks' },
  datingLikeAria: { sv: 'Gilla', en: 'Like' },

  reportDocType: { sv: 'Betygsblankett · Läsår', en: 'Report Card · School Year' },
  reportStudent: { sv: 'Elev', en: 'Student' },
  reportBreed: { sv: 'Ras', en: 'Breed' },
  reportClass: { sv: 'Klass', en: 'Class' },
  reportClassValuePrefix: { sv: 'Hund', en: 'Dog' },
  reportCommentLabel: { sv: 'Lärarens kommentar', en: "Teacher's comment" },
  reportCommentPlaceholder: { sv: 'Skriv en kommentar…', en: 'Write a comment…' },
  reportSignatureCaption: { sv: 'Elevens underskrift', en: "Student's signature" },
  reportApproved: { sv: 'Godkänt', en: 'Approved' },

  guardDocType: { sv: 'Vaktrapport · Tjänstenr', en: 'Guard Report · Badge No.' },
  guardClearance: {
    sv: 'Behörighet: Hela huset + trädgården',
    en: 'Clearance: Whole house + yard',
  },
  guardLogTitle: { sv: 'Incidentlogg', en: 'Incident Log' },
  guardNoteLabel: { sv: 'Senaste rapporterade hot', en: 'Latest reported threat' },
  guardNotePlaceholder: {
    sv: 'Skriv vad hunden vaktade mot senast…',
    en: 'Write what the dog last guarded against…',
  },
  guardSignatureCaption: { sv: 'Godkänd vakthund', en: 'Certified guard dog' },
  guardStamp: { sv: 'På vakt', en: 'On duty' },
}

export function getReportCategories(lang) {
  const labels = {
    theft: { sv: 'Matstöld', en: 'Food theft' },
    obedience: { sv: 'Lydnad', en: 'Obedience' },
    barking: { sv: 'Skällande på brevbäraren', en: 'Barking at the mailman' },
    furniture: { sv: 'Möbelvård', en: 'Furniture care' },
    social: { sv: 'Socialt beteende', en: 'Social behavior' },
  }
  return ['theft', 'obedience', 'barking', 'furniture', 'social'].map((key) => ({
    key,
    label: labels[key][lang],
  }))
}

export function getDefaultReportComment(lang) {
  return lang === 'en'
    ? 'Shows real potential, but only listens when treats are involved. Recommend more discipline and fewer shoes to chew on.'
    : 'Har absolut potential, men lyssnar bara när det finns godis inblandat. Rekommenderar mer disciplin och färre skor att tugga på.'
}

export function getIncidents(lang) {
  const rows = [
    { key: 'bag', threat: { sv: 'Plastpåse i vinden', en: 'Plastic bag in the wind' }, status: { sv: 'NEUTRALISERAD', en: 'NEUTRALIZED' }, level: 'low' },
    { key: 'mirror', threat: { sv: 'Egen spegelbild', en: 'Own reflection' }, status: { sv: 'UNDER UPPSIKT', en: 'UNDER WATCH' }, level: 'mid' },
    { key: 'vacuum', threat: { sv: 'Dammsugaren', en: 'The vacuum cleaner' }, status: { sv: 'KOD RÖD', en: 'CODE RED' }, level: 'high' },
    { key: 'mailman', threat: { sv: 'Brevbäraren', en: 'The mailman' }, status: { sv: 'IHÄRDIGT BEVAKAD', en: 'PERSISTENTLY WATCHED' }, level: 'mid' },
    { key: 'thunder', threat: { sv: 'Åska på avstånd', en: 'Distant thunder' }, status: { sv: 'KRITISKT LÄGE', en: 'CRITICAL SITUATION' }, level: 'high' },
  ]
  return rows.map((row) => ({
    key: row.key,
    threat: row.threat[lang],
    status: row.status[lang],
    level: row.level,
  }))
}

export function getDefaultGuardNote(lang) {
  return lang === 'en'
    ? 'Barked furiously at a chip bag blowing past. Situation contained.'
    : 'Skällde argt på ett chipspåse som blåste förbi. Situationen avvärjd.'
}

export function getDefaultDatingBio(lang) {
  return lang === 'en'
    ? 'Long walks, stolen socks and naps on your clothes 🐾'
    : 'Långa promenader, stulna strumpor och tupplurar på dina kläder 🐾'
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
