import { useState } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { savePhoto } from '../lib/dogStorage.js'
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
      if (Capacitor.isNativePlatform()) {
        setProcessingPhoto(true)
        try {
          const result = await BackgroundRemoval.removeBackground({ base64 })
          base64 = result.base64
        } catch {
          // Fortsätt med originalbilden om bakgrundsborttagningen misslyckas
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
          <span className="photo-placeholder">{t('photoProcessing')}</span>
        ) : photoUri ? (
          <img src={photoUri} alt="" />
        ) : (
          <span className="photo-placeholder">{t('photoAdd')}</span>
        )}
      </button>
      <p className="photo-hint">{t('photoHint')}</p>

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

      <div className="row">
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
      </label>

      <button type="submit" className="save-button" disabled={saving}>
        {saving ? t('savingButton') : t('saveButton')}
      </button>
    </form>
  )
}

export default DogForm
