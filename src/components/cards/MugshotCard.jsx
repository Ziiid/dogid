import { useEffect, useState } from 'react'
import { formatShortDate } from '../../lib/format.js'
import { stableId } from '../../lib/hash.js'
import { useLanguage } from '../../lib/i18n.jsx'
import { useDraggablePhoto } from '../../lib/useDraggablePhoto.js'
import PawIcon from './PawIcon.jsx'
import CardSticker from './CardSticker.jsx'
import './MugshotCard.css'

export const DEFAULT_MUGSHOT_CAPTION = 'Guilty as charged – for being cute'

const SCALE_CM = [90, 80, 70, 60, 50, 40, 30, 20, 10]

function formatStampDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${m}-${d}-${date.getFullYear()}`
}

function MugshotCard({ dog, photoUri, onCaptionChange, onPhotoTransformChange, onStickersChange }) {
  const { t } = useLanguage()
  const [caption, setCaption] = useState(dog.mugshotCaption ?? DEFAULT_MUGSHOT_CAPTION)
  const photoTransform = dog.mugshotPhotoTransform
  const drag = useDraggablePhoto({
    x: photoTransform?.x ?? 0,
    y: photoTransform?.y ?? 0,
    scale: photoTransform?.scale ?? 1,
    rotation: photoTransform?.rotation ?? 0,
    onChange: onPhotoTransformChange,
  })
  const stickers = dog.mugshotStickers ?? {}

  function handleStickerTransformChange(id, transform) {
    onStickersChange({ ...stickers, [id]: transform })
  }

  useEffect(() => {
    setCaption(dog.mugshotCaption ?? DEFAULT_MUGSHOT_CAPTION)
  }, [dog.mugshotCaption])

  function handleBlur() {
    if (caption !== (dog.mugshotCaption ?? DEFAULT_MUGSHOT_CAPTION)) {
      onCaptionChange(caption)
    }
  }

  const bookingNr = stableId(`${dog.name}-${dog.breed}`, 4)
  const caseId = dog.chipNumber ? dog.chipNumber.slice(-4) : stableId(dog.name, 4)

  return (
    <div className="mugshot-card">
      <div className="mugshot-backdrop">
        <div className="mugshot-ruler-lines" />
        <div className="mugshot-scale mugshot-scale--left">
          {SCALE_CM.map((cm) => (
            <span key={cm}>{cm}</span>
          ))}
        </div>
        <div className="mugshot-scale mugshot-scale--right">
          {SCALE_CM.map((cm) => (
            <span key={cm}>{cm}</span>
          ))}
        </div>

        <div className="mugshot-vignette" />
        <div className="mugshot-flash" />

        <div className="mugshot-photo-wrap" {...drag.handlers}>
          {photoUri ? (
            <img
              className="mugshot-photo"
              src={photoUri}
              alt={dog.name}
              style={drag.style}
            />
          ) : (
            <div className="mugshot-photo-placeholder">
              <PawIcon className="mugshot-photo-placeholder-icon" />
            </div>
          )}
        </div>

        <div className="mugshot-stamp">Booked</div>
        <div className="mugshot-timestamp">{formatStampDate()}</div>

        {Object.entries(stickers).map(([id, transform]) => (
          <CardSticker
            key={id}
            id={id}
            transform={transform}
            onChange={handleStickerTransformChange}
          />
        ))}

        <div className="mugshot-grain" />
      </div>

      <div className="mugshot-placard">
        <div className="mugshot-row mugshot-row--head">
          <span>#N {bookingNr}</span>
          <span>{formatShortDate()}</span>
        </div>
        <div className="mugshot-row mugshot-row--id">
          <span className="mugshot-row-label">ID:</span>
          <span className="mugshot-row-value">{dog.name.toUpperCase()}.</span>
        </div>
        <div className="mugshot-row mugshot-row--split">
          <span>
            <span className="mugshot-row-label">{t('mugshotBreedLabel')}</span>{' '}
            {(dog.breed || t('mugshotUnknown')).toUpperCase()}
          </span>
          <span>
            <span className="mugshot-row-label">CID:</span> {caseId}
          </span>
        </div>
        <div className="mugshot-row mugshot-row--charge">
          <span className="mugshot-row-label">CHARGE:</span>
          <textarea
            className="mugshot-charge-input"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={handleBlur}
            placeholder={t('mugshotChargePlaceholder')}
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}

export default MugshotCard
