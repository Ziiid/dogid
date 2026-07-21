import { formatDate, calcAge, formatGender } from '../../lib/format.js'
import { stableId } from '../../lib/hash.js'
import PawIcon from './PawIcon.jsx'
import './IdCard.css'

function IdCard({ dog, photoUri }) {
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
        <span className="id-card-doctype">ID-KORT</span>
      </div>

      <div className="id-card-rule" />

      <div className="id-card-seal">
        <PawIcon className="id-card-seal-icon" />
      </div>

      <div className="id-card-body">
        <div className="id-card-photo">
          {photoUri ? (
            <img src={photoUri} alt={dog.name} />
          ) : (
            <div className="id-card-photo-placeholder" />
          )}
        </div>

        <div className="id-card-fields">
          <span className="id-card-name">{dog.name}</span>

          <div className="id-card-row">
            <span className="id-card-label">RAS</span>
            <span className="id-card-value">{dog.breed || '—'}</span>
          </div>
          <div className="id-card-row">
            <span className="id-card-label">FÖDD</span>
            <span className="id-card-value id-card-value--accent">
              {formatDate(dog.birthDate) || '—'}
              {age !== '' ? ` (${age} år)` : ''}
            </span>
          </div>
          <div className="id-card-row">
            <span className="id-card-label">FÄRG / PÄLS</span>
            <span className="id-card-value">
              {dog.color || '—'} / {dog.coat || '—'}
            </span>
          </div>
          <div className="id-card-row">
            <span className="id-card-label">KENNEL</span>
            <span className="id-card-value">{dog.kennel || '—'}</span>
          </div>
        </div>
      </div>

      {dog.medical && (
        <div className="id-card-alert-box">
          <span className="id-card-alert-label">⚠ ALLERGI / MEDICINSKT</span>
          <span className="id-card-alert-text">{dog.medical}</span>
        </div>
      )}

      <div className="id-card-footer">
        <div>
          <span className="label">KÖN</span>
          <span>{formatGender(dog.gender)}</span>
        </div>
        <div>
          <span className="label">CHIPNR</span>
          <span>{dog.chipNumber || '—'}</span>
        </div>
        <div>
          <span className="label">VETERINÄR</span>
          <span>{dog.vet || '—'}</span>
        </div>
        <div>
          <span className="label">NÖDKONTAKT</span>
          <span>{dog.emergencyContact || '—'}</span>
        </div>
      </div>

      <div className="id-card-sign">
        <PawIcon className="id-card-sign-icon" />
        <span className="id-card-sign-text">Tassavtryck bekräftat</span>
        <span className="id-card-serial">NR. {serial}</span>
      </div>
    </div>
  )
}

export default IdCard
