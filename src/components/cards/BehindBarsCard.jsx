import { useEffect, useState } from 'react'
import { stableId } from '../../lib/hash.js'
import { useLanguage, getDefaultBehindBarsReason } from '../../lib/i18n.jsx'
import PawIcon from './PawIcon.jsx'
import './BehindBarsCard.css'

function BehindBarsCard({ dog, photoUri, onReasonChange }) {
  const { lang, t } = useLanguage()
  const defaultReason = getDefaultBehindBarsReason(lang)
  const [reason, setReason] = useState(dog.barsReason ?? defaultReason)

  useEffect(() => {
    setReason(dog.barsReason ?? defaultReason)
  }, [dog.barsReason, defaultReason])

  function handleBlur() {
    if (reason !== (dog.barsReason ?? defaultReason)) {
      onReasonChange(reason)
    }
  }

  const inmateNr = stableId(`${dog.name}-bars`, 4)

  return (
    <div className="bars-card">
      <div className="bars-window">
        {photoUri ? (
          <img className="bars-photo" src={photoUri} alt={dog.name} />
        ) : (
          <div className="bars-photo-placeholder">
            <PawIcon className="bars-photo-placeholder-icon" />
          </div>
        )}
        <div className="bars-vignette" />
        <div className="bars-vertical" />
        <div className="bars-grain" />
      </div>

      <div className="bars-plate">
        <div className="bars-plate-row">
          <span className="bars-doctype">{t('barsDocType')}</span>
          <span className="bars-inmate">
            {t('barsInmateLabel')} {inmateNr}
          </span>
        </div>

        <h1 className="bars-name">{dog.name}</h1>

        <div className="bars-reason-block">
          <span className="bars-reason-label">{t('barsReasonLabel')}</span>
          <textarea
            className="bars-reason-input"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={handleBlur}
            placeholder={t('barsReasonPlaceholder')}
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}

export default BehindBarsCard
