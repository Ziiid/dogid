import { Preferences } from '@capacitor/preferences'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'

const PROFILE_KEY = 'dogid_dog_profile'
const PHOTO_FILENAME = 'dogid_photo.png'

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
