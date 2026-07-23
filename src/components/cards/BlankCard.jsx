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
      <div className="blank-frame">
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
