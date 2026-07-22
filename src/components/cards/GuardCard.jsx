import { useEffect, useState } from 'react'
import { stableId } from '../../lib/hash.js'
import { useLanguage, getIncidents, getDefaultGuardNote } from '../../lib/i18n.jsx'
import PawIcon from './PawIcon.jsx'
import HandcuffsIcon from './HandcuffsIcon.jsx'
import BinocularsIcon from './BinocularsIcon.jsx'
import './GuardCard.css'

function GuardCard({ dog, photoUri, onNoteChange }) {
  const { lang, t } = useLanguage()
  const incidents = getIncidents(lang)
  const defaultNote = getDefaultGuardNote(lang)
  const [note, setNote] = useState(dog.guardNote ?? defaultNote)

  useEffect(() => {
    setNote(dog.guardNote ?? defaultNote)
  }, [dog.guardNote, defaultNote])

  function handleBlur() {
    if (note !== (dog.guardNote ?? defaultNote)) {
      onNoteChange(note)
    }
  }

  const badgeNr = stableId(`${dog.name}-guard`, 5)

  return (
    <div className="guard-card">
      <div className="guard-header">
        <div className="guard-badge">
          <div className="guard-badge-inner">
            <PawIcon className="guard-badge-icon" />
          </div>
        </div>
        <div className="guard-header-text">
          <span className="guard-doctype">
            {t('guardDocType')} {badgeNr}
          </span>
        </div>
        <HandcuffsIcon className="guard-header-cuffs" />
      </div>

      <div className="guard-id-row">
        <div className="guard-photo">
          {photoUri ? (
            <img
              src={photoUri}
              alt={dog.name}
              style={{
                objectPosition: `${dog.photoPositionX ?? 50}% ${dog.photoPositionY ?? 50}%`,
              }}
            />
          ) : (
            <div className="guard-photo-placeholder">
              <PawIcon className="guard-photo-placeholder-icon" />
            </div>
          )}
        </div>
        <div className="guard-id-info">
          <span className="guard-name">{dog.name}</span>
          <span className="guard-title">Chief of Security</span>
          <span className="guard-clearance">{t('guardClearance')}</span>
        </div>
      </div>

      <div className="guard-log">
        <span className="guard-log-title">
          <BinocularsIcon className="guard-log-icon" />
          {t('guardLogTitle')}
        </span>
        {incidents.map((inc) => (
          <div className="guard-row" key={inc.key}>
            <span className="guard-row-label">{inc.threat}</span>
            <span className={`guard-status guard-status--${inc.level}`}>{inc.status}</span>
          </div>
        ))}
      </div>

      <div className="guard-note-block">
        <span className="guard-label">{t('guardNoteLabel')}</span>
        <textarea
          className="guard-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleBlur}
          placeholder={t('guardNotePlaceholder')}
          rows={2}
        />
      </div>

      <div className="guard-footer">
        <div className="guard-signature">
          <span className="guard-signature-script">{dog.name}</span>
          <span className="guard-signature-caption">{t('guardSignatureCaption')}</span>
        </div>
        <div className="guard-stamp">
          <PawIcon className="guard-stamp-icon" />
          <span>{t('guardStamp')}</span>
        </div>
      </div>
    </div>
  )
}

export default GuardCard
