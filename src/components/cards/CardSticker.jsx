import { useDraggablePhoto } from '../../lib/useDraggablePhoto.js'
import SunglassesIcon from './SunglassesIcon.jsx'
import CapIcon from './CapIcon.jsx'
import SombreroIcon from './SombreroIcon.jsx'
import SpeechBubbleIcon from './SpeechBubbleIcon.jsx'
import HeartIcon from './HeartIcon.jsx'
import LaughingEmojiIcon from './LaughingEmojiIcon.jsx'
import guiltyStampRect from './stickerAssets/guiltyStampRect.png'
import handcuffs from './stickerAssets/handcuffs.png'
import siren from './stickerAssets/siren.png'
import wantedRect from './stickerAssets/wantedRect.png'
import goodBoyBadge from './stickerAssets/goodBoyBadge.png'
import evidenceBag from './stickerAssets/evidenceBag.png'
import policeLineTape from './stickerAssets/policeLineTape.png'
import pawMedal from './stickerAssets/pawMedal.png'
import mamasHeart from './stickerAssets/mamasHeart.png'
import pawPrints from './stickerAssets/pawPrints.png'
import tennisBall from './stickerAssets/tennisBall.png'
import banditMask from './stickerAssets/banditMask.png'
import bone from './stickerAssets/bone.png'
import poop from './stickerAssets/poop.png'
import trashCan from './stickerAssets/trashCan.png'
import megaphone from './stickerAssets/megaphone.png'
import caseClosedBoard from './stickerAssets/caseClosedBoard.png'
import innocentNote from './stickerAssets/innocentNote.png'
import guiltyStampRound from './stickerAssets/guiltyStampRound.png'
import pawNote from './stickerAssets/pawNote.png'
import './CardSticker.css'

// Värdet är antingen en SVG-komponent (handritade ikoner) eller en bildsökväg
// (string, för foton/PNG-stickers) - StickerGraphic renderar rätt sak för båda.
export const STICKER_ICONS = {
  sunglasses: SunglassesIcon,
  cap: CapIcon,
  sombrero: SombreroIcon,
  speechBubble: SpeechBubbleIcon,
  heart: HeartIcon,
  laughingEmoji: LaughingEmojiIcon,
  banditMask,
  guiltyStampRect,
  handcuffs,
  siren,
  wantedRect,
  goodBoyBadge,
  evidenceBag,
  policeLineTape,
  pawMedal,
  mamasHeart,
  pawPrints,
  tennisBall,
  bone,
  poop,
  trashCan,
  megaphone,
  caseClosedBoard,
  innocentNote,
  guiltyStampRound,
  pawNote,
}

export function StickerGraphic({ id, className }) {
  const icon = STICKER_ICONS[id]
  if (!icon) return null

  if (typeof icon === 'string') {
    return <img src={icon} alt="" draggable={false} className={className} />
  }

  const Icon = icon
  return <Icon className={className} />
}

function CardSticker({ id, transform, onChange }) {
  const drag = useDraggablePhoto({
    x: transform.x,
    y: transform.y,
    scale: transform.scale,
    rotation: transform.rotation ?? 0,
    onChange: (next) => onChange(id, next),
  })

  if (!STICKER_ICONS[id]) return null

  return (
    <div className="card-sticker-wrap">
      <div className="card-sticker" style={drag.style} {...drag.handlers}>
        <StickerGraphic id={id} className="card-sticker-icon" />
      </div>
    </div>
  )
}

export default CardSticker
