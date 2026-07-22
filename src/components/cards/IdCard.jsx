import { formatDate, calcAge, formatGender } from '../../lib/format.js'
import { stableId } from '../../lib/hash.js'
import { useLanguage } from '../../lib/i18n.jsx'
import PawIcon from './PawIcon.jsx'
import './IdCard.css'

function IdCard({ dog, photoUri }) {
  const { lang, t } = useLanguage()
  const age = calcAge(dog.birthDate)
  const serial = stableId(`${dog.name}-${dog.chipNumber}`, 8)

  return (
    <div className="id-card">
      <div className="id-card-security" />

      <div className="id-card-header">
        <div className="id-card-wordmark">
          <span className="id-card-title">DOG ID</span>
          <span className="id-card-badge">DOGISH</span>
        </div>
        <span className="id-card-doctype">{t('idDocType')}</span>
      </div>

      <div className="id-card-rule" />

      <div className="id-card-seal">
        <PawIcon className="id-card-seal-icon" />
      </div>

      <div className="id-card-body">
        <div className="id-card-photo">
          {photoUri ? (
            <img
              src={photoUri}
              alt={dog.name}
              style={{
                objectPosition: `${dog.photoPositionX ?? 50}% ${dog.photoPositionY ?? 50}%`,
              }}
            />
          ) : (
            <div className="id-card-photo-placeholder" />
          )}
        </div>

        <div className="id-card-fields">
          <span className="id-card-name">{dog.name}</span>

          <div className="id-card-row">
            <span className="id-card-label">{t('idBreed')}</span>
            <span className="id-card-value">{dog.breed || '—'}</span>
          </div>
          <div className="id-card-row">
            <span className="id-card-label">{t('idBorn')}</span>
            <span className="id-card-value id-card-value--accent">
              {formatDate(dog.birthDate) || '—'}
              {age !== '' ? ` (${age} ${t('idYearsSuffix')})` : ''}
            </span>
          </div>
          <div className="id-card-row">
            <span className="id-card-label">{t('idColorCoat')}</span>
            <span className="id-card-value">
              {dog.color || '—'} / {dog.coat || '—'}
            </span>
          </div>
          <div className="id-card-row">
            <span className="id-card-label">{t('idKennel')}</span>
            <span className="id-card-value">{dog.kennel || '—'}</span>
          </div>
        </div>
      </div>

      {dog.medical && (
        <div className="id-card-alert-box">
          <span className="id-card-alert-label">{t('idAllergyLabel')}</span>
          <span className="id-card-alert-text">{dog.medical}</span>
        </div>
      )}

      <div className="id-card-footer">
        <div>
          <span className="label">{t('idGenderLabel')}</span>
          <span>{formatGender(dog.gender, lang)}</span>
        </div>
        <div>
          <span className="label">{t('idChipLabel')}</span>
          <span>{dog.chipNumber || '—'}</span>
        </div>
        <div>
          <span className="label">{t('idVetLabel')}</span>
          <span>{dog.vet || '—'}</span>
        </div>
        <div>
          <span className="label">{t('idEmergencyLabel')}</span>
          <span>{dog.emergencyContact || '—'}</span>
        </div>
      </div>

      <div className="id-card-sign">
        <PawIcon className="id-card-sign-icon" />
        <span className="id-card-sign-text">{t('idSignText')}</span>
        <span className="id-card-serial">{t('idSerialPrefix')} {serial}</span>
      </div>
    </div>
  )
}

export default IdCard
