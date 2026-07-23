import { useDraggablePhoto } from '../../lib/useDraggablePhoto.js'
import PawIcon from './PawIcon.jsx'
import CardSticker from './CardSticker.jsx'
import './BlankCard.css'

function BlankCard({ dog, photoUri, onPhotoTransformChange, onStickersChange }) {
  const photoTransform = dog.blankPhotoTransform
  const drag = useDraggablePhoto({
    x: photoTransform?.x ?? 0,
    y: photoTransform?.y ?? 0,
    scale: photoTransform?.scale ?? 1,
    rotation: photoTransform?.rotation ?? 0,
    onChange: onPhotoTransformChange,
  })
  const stickers = dog.blankStickers ?? {}

  function handleStickerTransformChange(id, transform) {
    onStickersChange({ ...stickers, [id]: transform })
  }

  return (
    <div className="blank-card">
      <div className="blank-canvas">
        {/* Osynliga "mätstolpar" - samma mått som Mugshots backdrop+placard
            (aspect-ratio + kopierade padding/radhöjder), staplade i normalt
            flöde bara för att ge canvasen rätt totalhöjd. Webbläsaren
            summerar höjden åt oss, ingen gissad siffra. Det interaktiva
            lagret (foto + stickers) ligger absolut positionerat ovanpå och
            täcker HELA den summerade ytan - det är den faktiska lekytan. */}
        <div className="blank-size-backdrop" aria-hidden="true" />
        <div className="blank-size-footer" aria-hidden="true">
          <div className="blank-size-row blank-size-row--head">
            <span>#</span>
            <span>#</span>
          </div>
          <div className="blank-size-row blank-size-row--id">
            <span className="blank-size-value">#</span>
          </div>
          <div className="blank-size-row blank-size-row--split">
            <span>#</span>
            <span>#</span>
          </div>
          <div className="blank-size-row blank-size-row--charge">
            <span>#</span>
            <textarea className="blank-size-charge" value="" readOnly rows={2} tabIndex={-1} />
          </div>
        </div>

        <div className="blank-photo-wrap" {...drag.handlers}>
          {photoUri ? (
            <img className="blank-photo" src={photoUri} alt={dog.name} style={drag.style} />
          ) : (
            <div className="blank-photo-placeholder">
              <PawIcon className="blank-photo-placeholder-icon" />
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
    </div>
  )
}

export default BlankCard
