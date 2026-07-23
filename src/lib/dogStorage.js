import { Preferences } from '@capacitor/preferences'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'

const PROFILE_KEY = 'dogid_dog_profile'
const PHOTO_FILENAME = 'dogid_photo.png'
const PHOTO_ORIGINAL_FILENAME = 'dogid_photo_original.png'
const PHOTO_NOBG_FILENAME = 'dogid_photo_nobg.png'
const LANG_KEY = 'dogid_lang'

export async function saveDogProfile(data) {
  await Preferences.set({ key: PROFILE_KEY, value: JSON.stringify(data) })
}

export async function loadDogProfile() {
  const { value } = await Preferences.get({ key: PROFILE_KEY })
  return value ? JSON.parse(value) : null
}

export async function savePhoto(base64Data) {
  await Filesystem.writeFile({
    path: PHOTO_FILENAME,
    data: base64Data,
    directory: Directory.Data,
  })
  return loadPhotoUri()
}

export async function loadPhotoUri() {
  try {
    const { uri } = await Filesystem.getUri({
      path: PHOTO_FILENAME,
      directory: Directory.Data,
    })
    // Cache-busta så en ny bild med samma filnamn syns direkt i <img>
    return `${Capacitor.convertFileSrc(uri)}?t=${Date.now()}`
  } catch {
    return null
  }
}

// html-to-image kan inte hämta capacitor://-URL:er via fetch() vid bildexport,
// så delningsflödet behöver fotot inbäddat som data-URL istället.
export async function loadPhotoBase64() {
  try {
    const { data } = await Filesystem.readFile({
      path: PHOTO_FILENAME,
      directory: Directory.Data,
    })
    return `data:image/png;base64,${data}`
  } catch {
    return null
  }
}

// Originalfotot (utan bakgrundsborttagning) och den bakgrundsborttagna
// versionen sparas separat så användaren kan växla fram och tillbaka
// i formuläret utan att behöva köra Vision-ramverket om varje gång.
export async function savePhotoOriginal(base64Data) {
  await Filesystem.writeFile({
    path: PHOTO_ORIGINAL_FILENAME,
    data: base64Data,
    directory: Directory.Data,
  })
}

export async function savePhotoNoBg(base64Data) {
  await Filesystem.writeFile({
    path: PHOTO_NOBG_FILENAME,
    data: base64Data,
    directory: Directory.Data,
  })
}

async function readRawBase64(path) {
  try {
    const { data } = await Filesystem.readFile({ path, directory: Directory.Data })
    return data
  } catch {
    return null
  }
}

export function loadPhotoOriginalBase64Raw() {
  return readRawBase64(PHOTO_ORIGINAL_FILENAME)
}

export function loadPhotoNoBgBase64Raw() {
  return readRawBase64(PHOTO_NOBG_FILENAME)
}

export async function saveLang(lang) {
  await Preferences.set({ key: LANG_KEY, value: lang })
}

export async function loadLang() {
  const { value } = await Preferences.get({ key: LANG_KEY })
  return value
}
