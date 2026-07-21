import { useEffect, useState } from 'react'
import { calcAge } from '../../lib/format.js'
import { stableId } from '../../lib/hash.js'
import { useLanguage, getDefaultDatingBio } from '../../lib/i18n.jsx'
import PawIcon from './PawIcon.jsx'
import './DatingCard.css'

function DatingCard({ dog, photoUri, onBioChange }) {
  const { lang, t } = useLanguage()
  const defaultBio = getDefaultDatingBio(lang)
  const [bio, setBio] = useState(dog.datingBio ?? defaultBio)

  useEffect(() => {
    setBio(dog.datingBio ?? defaultBio)
  }, [dog.datingBio, defaultBio])

  function handleBlur() {
    if (bio !== (dog.datingBio ?? defaultBio)) {
      onBioChange(bio)
    }
  }

  const age = calcAge(dog.birthDate)
  const likes = 1000 + (Number(stableId(`${dog.name}-likes`, 5)) % 9000)
  const matchPct = 90 + (Number(stableId(`${dog.name}-match`, 2)) % 10)

  return (
    <div className="dating-card">
      <div className="dating-photo-wrap">
        {photoUri ? (
          <img className="dating-photo" src={photoUri} alt={dog.name} />
        ) : (
          <div className="dating-photo-placeholder">
            <PawIcon className="dating-photo-placeholder-icon" />
          </div>
        )}

        <div className="dating-gradient" />

        <div className="dating-hearts" aria-hidden="true">
          <span className="dating-heart dating-heart--1">♥</span>
          <span className="dating-heart dating-heart--2">♥</span>
          <span className="dating-heart dating-heart--3">♥</span>
        </div>

        <div className="dating-top-row">
          <span className="dating-status">
            <span className="dating-status-dot" />
            {t('datingActiveNow')}
          </span>
          <span className="dating-likes">
            <span className="dating-likes-heart">♥</span>
            {likes.toLocaleString(lang === 'en' ? 'en-US' : 'sv-SE')}
          </span>
        </div>

        <div className="dating-info">
          <div className="dating-name-row">
            <span className="dating-name">
              {dog.name}
              {age !== '' ? `, ${age}` : ''}
            </span>
            <span className="dating-verified">✓</span>
            <span className="dating-match">
              {matchPct}% {t('datingMatch')}
            </span>
          </div>
          <div className="dating-meta">
            <span>{dog.breed || t('datingUnknownBreed')}</span>
            <span className="dating-meta-dot">·</span>
            <span>0 {t('datingAway')}</span>
          </div>
          <textarea
            className="dating-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onBlur={handleBlur}
            placeholder={t('datingBioPlaceholder')}
            rows={2}
          />
        </div>
      </div>

      <div className="dating-actions">
        <button
          type="button"
          className="dating-action dating-action--nope"
          aria-label={t('datingNopeAria')}
        >
          ✕
        </button>
        <button
          type="button"
          className="dating-action dating-action--like"
          aria-label={t('datingLikeAria')}
        >
          ♥
        </button>
      </div>
    </div>
  )
}

export default DatingCard
