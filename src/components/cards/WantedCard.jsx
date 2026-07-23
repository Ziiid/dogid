import { useEffect, useState } from 'react'
import { useLanguage, getDefaultWantedCharge } from '../../lib/i18n.jsx'
import { useDraggablePhoto } from '../../lib/useDraggablePhoto.js'
import PawIcon from './PawIcon.jsx'
import CardSticker from './CardSticker.jsx'
import './WantedCard.css'

export const DEFAULT_WANTED_REWARD = '$ 50 000 IN GOLD COINS'

function WantedCard({ dog, photoUri, onChargeChange, onRewardChange, onPhotoTransformChange, onStickersChange }) {
  const { lang, t } = useLanguage()
  const defaultCharge = getDefaultWantedCharge(lang)
  const [charge, setCharge] = useState(dog.wantedCharge ?? defaultCharge)
  const [reward, setReward] = useState(dog.wantedReward ?? DEFAULT_WANTED_REWARD)
  const photoTransform = dog.wantedPhotoTransform
  const drag = useDraggablePhoto({
    x: photoTransform?.x ?? 0,
    y: photoTransform?.y ?? 0,
    scale: photoTransform?.scale ?? 1,
    rotation: photoTransform?.rotation ?? 0,
    onChange: onPhotoTransformChange,
  })
  const stickers = dog.wantedStickers ?? {}

  function handleStickerTransformChange(id, transform) {
    onStickersChange({ ...stickers, [id]: transform })
  }

  useEffect(() => {
    setCharge(dog.wantedCharge ?? defaultCharge)
  }, [dog.wantedCharge, defaultCharge])

  useEffect(() => {
    setReward(dog.wantedReward ?? DEFAULT_WANTED_REWARD)
  }, [dog.wantedReward])

  function handleChargeBlur() {
    if (charge !== (dog.wantedCharge ?? defaultCharge)) {
      onChargeChange(charge)
    }
  }

  function handleRewardBlur() {
    if (reward !== (dog.wantedReward ?? DEFAULT_WANTED_REWARD)) {
      onRewardChange(reward)
    }
  }

  return (
    <div className="wanted-card">
      <div className="wanted-paper">
        <h2 className="wanted-headline">{t('wantedReward')}</h2>
        <input
          type="text"
          className="wanted-amount"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          onBlur={handleRewardBlur}
        />
        <p className="wanted-apprehension">{t('wantedApprehension')}</p>

        <div className="wanted-photo-frame">
          <div className="wanted-photo-wrap" {...drag.handlers}>
            {photoUri ? (
              <img src={photoUri} alt={dog.name} style={drag.style} />
            ) : (
              <div className="wanted-photo-placeholder">
                <PawIcon className="wanted-photo-placeholder-icon" />
              </div>
            )}
          </div>

          {Object.entries(stickers).map(([id, transform]) => (
            <CardSticker
              key={id}
              id={id}
              transform={transform}
              onChange={handleStickerTransformChange}
            />
          ))}
        </div>

        <h1 className="wanted-name">{dog.name}</h1>

        <div className="wanted-charge-block">
          <span className="wanted-charge-label">{t('wantedChargeLabel')}</span>
          <textarea
            className="wanted-charge-input"
            value={charge}
            onChange={(e) => setCharge(e.target.value)}
            onBlur={handleChargeBlur}
            placeholder={t('wantedChargePlaceholder')}
            rows={2}
          />
        </div>

        <div className="wanted-stamp">{t('wantedStamp')}</div>
        <div className="wanted-grain" />
      </div>
    </div>
  )
}

export default WantedCard
