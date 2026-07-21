import { useState } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { savePhoto } from '../lib/dogStorage.js'
import BackgroundRemoval from '../lib/backgroundRemoval.js'
import './DogForm.css'

const EMPTY_DOG = {
  name: '',
  breed: '',
  birthDate: '',
  gender: '',
  color: '',
  coat: '',
  kennel: '',
  chipNumber: '',
  insurance: '',
  vet: '',
  medical: '',
  emergencyContact: '',
}

function DogForm({ initialDog, initialPhotoUri, onSave, onPhotoChange }) {
  const [dog, setDog] = useState(initialDog ?? EMPTY_DOG)
  const [photoUri, setPhotoUri] = useState(initialPhotoUri ?? null)
  const [saving, setSaving] = useState(false)
  const [processingPhoto, setProcessingPhoto] = useState(false)

  function update(field, value) {
    setDog((prev) => ({ ...prev, [field]: value }))
  }

  async function pickPhoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        quality: 85,
        width: 1000,
      })

      let base64 = photo.base64String
      console.log('[DogID] isNativePlatform:', Capacitor.isNativePlatform())
      if (Capacitor.isNativePlatform()) {
        setProcessingPhoto(true)
        try {
          console.log('[DogID] calling BackgroundRemoval.removeBackground')
          const result = await BackgroundRemoval.removeBackground({ base64 })
          console.log('[DogID] removeBackground resolved, removed:', result.removed)
          base64 = result.base64
        } catch (err) {
          console.error('[DogID] removeBackground failed:', err)
        } finally {
          setProcessingPhoto(false)
        }
      }

      const uri = await savePhoto(base64)
      setPhotoUri(uri)
      onPhotoChange?.(uri)
    } catch {
      // Användaren avbröt val av bild
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(dog)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="dog-form" onSubmit={handleSubmit}>
      <button
        type="button"
        className="photo-picker"
        onClick={pickPhoto}
        disabled={processingPhoto}
      >
        {processingPhoto ? (
          <span className="photo-placeholder">Tar bort bakgrund…</span>
        ) : photoUri ? (
          <img src={photoUri} alt="Hundens foto" />
        ) : (
          <span className="photo-placeholder">Lägg till foto</span>
        )}
      </button>

      <label>
        Namn *
        <input
          type="text"
          required
          value={dog.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </label>

      <label>
        Ras
        <input
          type="text"
          value={dog.breed}
          onChange={(e) => update('breed', e.target.value)}
        />
      </label>

      <div className="row">
        <label>
          Födelsedatum
          <input
            type="date"
            value={dog.birthDate}
            onChange={(e) => update('birthDate', e.target.value)}
          />
        </label>

        <label>
          Kön
          <select
            value={dog.gender}
            onChange={(e) => update('gender', e.target.value)}
          >
            <option value="">Välj</option>
            <option value="hane">Hane</option>
            <option value="tik">Tik</option>
          </select>
        </label>
      </div>

      <div className="row">
        <label>
          Färg
          <input
            type="text"
            value={dog.color}
            onChange={(e) => update('color', e.target.value)}
          />
        </label>

        <label>
          Päls
          <input
            type="text"
            value={dog.coat}
            onChange={(e) => update('coat', e.target.value)}
          />
        </label>
      </div>

      <label>
        Kennel / uppfödare
        <input
          type="text"
          value={dog.kennel}
          onChange={(e) => update('kennel', e.target.value)}
        />
      </label>

      <label>
        Chipnummer
        <input
          type="text"
          inputMode="numeric"
          value={dog.chipNumber}
          onChange={(e) => update('chipNumber', e.target.value)}
        />
      </label>

      <label>
        Försäkring
        <input
          type="text"
          value={dog.insurance}
          onChange={(e) => update('insurance', e.target.value)}
        />
      </label>

      <label>
        Veterinär
        <input
          type="text"
          value={dog.vet}
          onChange={(e) => update('vet', e.target.value)}
        />
      </label>

      <label>
        Allergier / medicinskt
        <textarea
          rows={3}
          value={dog.medical}
          onChange={(e) => update('medical', e.target.value)}
        />
      </label>

      <label>
        Nödkontakt
        <input
          type="text"
          placeholder="Namn och telefonnummer"
          value={dog.emergencyContact}
          onChange={(e) => update('emergencyContact', e.target.value)}
        />
      </label>

      <button type="submit" className="save-button" disabled={saving}>
        {saving ? 'Sparar…' : 'Spara'}
      </button>
    </form>
  )
}

export default DogForm
