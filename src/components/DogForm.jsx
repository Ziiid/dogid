import { useState } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import {
  savePhoto,
  savePhotoOriginal,
  savePhotoNoBg,
  loadPhotoOriginalBase64Raw,
  loadPhotoNoBgBase64Raw,
} from '../lib/dogStorage.js'
import BackgroundRemoval from '../lib/backgroundRemoval.js'
import { useLanguage } from '../lib/i18n.jsx'
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
  const { t } = useLanguage()
  const [dog, setDog] = useState(initialDog ?? EMPTY_DOG)
  const [photoUri, setPhotoUri] = useState(initialPhotoUri ?? null)
  const [saving, setSaving] = useState(false)
  const [processingPhoto, setProcessingPhoto] = useState(false)
  const [bgRemoved, setBgRemoved] = useState(initialDog?.backgroundRemoved ?? true)

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

      const originalBase64 = photo.base64String
      await savePhotoOriginal(originalBase64)

      let activeBase64 = originalBase64
      let removed = false

      if (Capacitor.isNativePlatform()) {
        setProcessingPhoto(true)
        try {
          const result = await BackgroundRemoval.removeBackground({ base64: originalBase64 })
          await savePhotoNoBg(result.base64)
          activeBase64 = result.base64
          removed = true
        } catch {
          // Fortsätt med originalbilden om bakgrundsborttagningen misslyckas
        } finally {
          setProcessingPhoto(false)
        }
      }

      const uri = await savePhoto(activeBase64)
      setPhotoUri(uri)
      setBgRemoved(removed)
      update('backgroundRemoved', removed)
      onPhotoChange?.(uri)
    } catch {
      // Användaren avbröt val av bild
    }
  }

  async function toggleBackground() {
    if (!photoUri || processingPhoto || !Capacitor.isNativePlatform()) return
    setProcessingPhoto(true)
    try {
      if (bgRemoved) {
        const originalBase64 = await loadPhotoOriginalBase64Raw()
        if (!originalBase64) return
        const uri = await savePhoto(originalBase64)
        setPhotoUri(uri)
        setBgRemoved(false)
        update('backgroundRemoved', false)
        onPhotoChange?.(uri)
      } else {
        let nobgBase64 = await loadPhotoNoBgBase64Raw()
        if (!nobgBase64) {
          const originalBase64 = await loadPhotoOriginalBase64Raw()
          if (!originalBase64) return
          const result = await BackgroundRemoval.removeBackground({ base64: originalBase64 })
          nobgBase64 = result.base64
          await savePhotoNoBg(nobgBase64)
        }
        const uri = await savePhoto(nobgBase64)
        setPhotoUri(uri)
        setBgRemoved(true)
        update('backgroundRemoved', true)
        onPhotoChange?.(uri)
      }
    } catch {
      // Bakgrundsbytet misslyckades - lämna fotot som det var
    } finally {
      setProcessingPhoto(false)
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
          <span className="photo-placeholder">{t('photoProcessing')}</span>
        ) : photoUri ? (
          <img src={photoUri} alt="" />
        ) : (
          <span className="photo-placeholder">{t('photoAdd')}</span>
        )}
      </button>
      <p className="photo-hint">{t('photoHint')}</p>

      {photoUri && Capacitor.isNativePlatform() && (
        <button
          type="button"
          className="bg-toggle-button"
          onClick={toggleBackground}
          disabled={processingPhoto}
        >
          {bgRemoved ? t('restoreBgButton') : t('removeBgButton')}
        </button>
      )}

      <label>
        {t('labelName')} *
        <input
          type="text"
          required
          value={dog.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </label>

      <label>
        {t('labelBreed')}
        <input
          type="text"
          value={dog.breed}
          onChange={(e) => update('breed', e.target.value)}
        />
      </label>

      {/* <div className="row">
        <label>
          {t('labelBirthDate')}
          <input
            type="date"
            value={dog.birthDate}
            onChange={(e) => update('birthDate', e.target.value)}
          />
        </label>

        <label>
          {t('labelGender')}
          <select
            value={dog.gender}
            onChange={(e) => update('gender', e.target.value)}
          >
            <option value="">{t('genderChoose')}</option>
            <option value="hane">{t('genderMale')}</option>
            <option value="tik">{t('genderFemale')}</option>
          </select>
        </label>
      </div>

      <div className="row">
        <label>
          {t('labelColor')}
          <input
            type="text"
            value={dog.color}
            onChange={(e) => update('color', e.target.value)}
          />
        </label>

        <label>
          {t('labelCoat')}
          <input
            type="text"
            value={dog.coat}
            onChange={(e) => update('coat', e.target.value)}
          />
        </label>
      </div>

      <label>
        {t('labelKennel')}
        <input
          type="text"
          value={dog.kennel}
          onChange={(e) => update('kennel', e.target.value)}
        />
      </label>

      <label>
        {t('labelChip')}
        <input
          type="text"
          inputMode="numeric"
          value={dog.chipNumber}
          onChange={(e) => update('chipNumber', e.target.value)}
        />
      </label>

      <label>
        {t('labelInsurance')}
        <input
          type="text"
          value={dog.insurance}
          onChange={(e) => update('insurance', e.target.value)}
        />
      </label>

      <label>
        {t('labelVet')}
        <input
          type="text"
          value={dog.vet}
          onChange={(e) => update('vet', e.target.value)}
        />
      </label>

      <label>
        {t('labelMedical')}
        <textarea
          rows={3}
          value={dog.medical}
          onChange={(e) => update('medical', e.target.value)}
        />
      </label>

      <label>
        {t('labelEmergency')}
        <input
          type="text"
          placeholder={t('emergencyPlaceholder')}
          value={dog.emergencyContact}
          onChange={(e) => update('emergencyContact', e.target.value)}
        />
      </label> */}

      <button type="submit" className="save-button" disabled={saving}>
        {saving ? t('savingButton') : t('saveButton')}
      </button>
    </form>
  )
}

export default DogForm
