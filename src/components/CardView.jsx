import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
// import IdCard from './cards/IdCard.jsx'
// import DriversLicenseCard from './cards/DriversLicenseCard.jsx'
import MugshotCard from './cards/MugshotCard.jsx'
// import DatingCard from './cards/DatingCard.jsx'
// import ReportCard from './cards/ReportCard.jsx'
// import GuardCard from './cards/GuardCard.jsx'
import WantedCard from './cards/WantedCard.jsx'
// import BehindBarsCard from './cards/BehindBarsCard.jsx'
import ShareIcon from './cards/ShareIcon.jsx'
import { MUGSHOT_STICKERS } from './cards/mugshotStickers.js'
import { useLanguage } from '../lib/i18n.jsx'
import { loadPhotoBase64 } from '../lib/dogStorage.js'
import './CardView.css'

const SHARE_FILENAME = 'dogsona-share.png'

const FORMATS = [
  { id: 'original', labelKey: 'formatOriginal' },
  { id: 'post', labelKey: 'formatPost', width: 1080, height: 1080 },
  { id: 'story', labelKey: 'formatStory', width: 1080, height: 1920 },
  { id: 'wallpaper', labelKey: 'formatWallpaper', width: 1170, height: 2532 },
]

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function composeForFormat(dataUrl, targetW, targetH) {
  const img = await loadImage(dataUrl)
  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')

  // Blurad, uppskalad bakgrund (cover-fit) sa canvasen aldrig far tomma kanter
  const coverScale = Math.max(targetW / img.width, targetH / img.height)
  const coverW = img.width * coverScale
  const coverH = img.height * coverScale
  ctx.filter = 'blur(60px)'
  ctx.drawImage(img, (targetW - coverW) / 2, (targetH - coverH) / 2, coverW, coverH)
  ctx.filter = 'none'

  // Skarpt kort ovanpa (contain-fit)
  const containScale = Math.min(targetW / img.width, targetH / img.height) * 0.92
  const containW = img.width * containScale
  const containH = img.height * containScale
  ctx.drawImage(img, (targetW - containW) / 2, (targetH - containH) / 2, containW, containH)

  return canvas.toDataURL('image/png')
}

const TEMPLATES = [
  // { id: 'id', labelKey: 'tplId' },
  // { id: 'license', labelKey: 'tplLicense' },
  { id: 'mugshot', labelKey: 'tplMugshot' },
  // { id: 'dating', labelKey: 'tplDating' },
  // { id: 'report', labelKey: 'tplReport' },
  // { id: 'guard', labelKey: 'tplGuard' },
  { id: 'wanted', labelKey: 'tplWanted' },
  // { id: 'bars', labelKey: 'tplBars' },
]

function CardView({ dog, photoUri, onFieldChange }) {
  const { t } = useLanguage()
  const [template, setTemplate] = useState('mugshot')
  const [format, setFormat] = useState('original')
  const [sharing, setSharing] = useState(false)
  const stageRef = useRef(null)

  if (!dog?.name) {
    return <p className="card-empty">{t('cardEmpty')}</p>
  }

  function handleStickerToggle(stickerId, defaultTransform) {
    const current = dog.mugshotStickers ?? {}
    if (current[stickerId]) {
      const { [stickerId]: _removed, ...rest } = current
      onFieldChange('mugshotStickers', rest)
    } else {
      onFieldChange('mugshotStickers', { ...current, [stickerId]: defaultTransform })
    }
  }

  async function handleShare() {
    if (!stageRef.current || sharing) return
    setSharing(true)
    const node = stageRef.current
    const originalZoom = node.style.zoom
    const photoImgs = photoUri
      ? Array.from(node.querySelectorAll('img')).filter(
          (img) => img.getAttribute('src') === photoUri
        )
      : []
    try {
      node.style.zoom = '1'

      if (photoImgs.length > 0) {
        const photoBase64 = await loadPhotoBase64()
        if (photoBase64) {
          photoImgs.forEach((img) => img.setAttribute('src', photoBase64))
        }
      }

      let dataUrl = await toPng(node, { pixelRatio: 2 })

      const selectedFormat = FORMATS.find((f) => f.id === format)
      if (selectedFormat?.width) {
        dataUrl = await composeForFormat(dataUrl, selectedFormat.width, selectedFormat.height)
      }

      const base64 = dataUrl.split(',')[1]
      await Filesystem.writeFile({
        path: SHARE_FILENAME,
        data: base64,
        directory: Directory.Cache,
      })
      const { uri } = await Filesystem.getUri({
        path: SHARE_FILENAME,
        directory: Directory.Cache,
      })
      await Share.share({ files: [uri], dialogTitle: t('shareDialogTitle') })
    } catch (err) {
      console.error(err)
      window.alert(t('shareError'))
    } finally {
      node.style.zoom = originalZoom
      photoImgs.forEach((img) => img.setAttribute('src', photoUri))
      setSharing(false)
    }
  }

  return (
    <div className="card-view">
      <div className="template-tabs">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            className={template === tpl.id ? 'active' : ''}
            onClick={() => setTemplate(tpl.id)}
          >
            {t(tpl.labelKey)}
          </button>
        ))}
      </div>

      <div className="template-stage" ref={stageRef}>
        {/* {template === 'id' && <IdCard dog={dog} photoUri={photoUri} />} */}
        {/* {template === 'license' && <DriversLicenseCard dog={dog} photoUri={photoUri} />} */}
        {template === 'mugshot' && (
          <MugshotCard
            dog={dog}
            photoUri={photoUri}
            onCaptionChange={(value) => onFieldChange('mugshotCaption', value)}
            onPhotoTransformChange={(value) => onFieldChange('mugshotPhotoTransform', value)}
            onStickersChange={(value) => onFieldChange('mugshotStickers', value)}
          />
        )}
        {/* {template === 'dating' && (
          <DatingCard
            dog={dog}
            photoUri={photoUri}
            onBioChange={(value) => onFieldChange('datingBio', value)}
          />
        )} */}
        {/* {template === 'report' && (
          <ReportCard
            dog={dog}
            photoUri={photoUri}
            onGradesChange={(value) => onFieldChange('reportGrades', value)}
            onCommentChange={(value) => onFieldChange('reportComment', value)}
          />
        )} */}
        {/* {template === 'guard' && (
          <GuardCard
            dog={dog}
            photoUri={photoUri}
            onNoteChange={(value) => onFieldChange('guardNote', value)}
          />
        )} */}
        {template === 'wanted' && (
          <WantedCard
            dog={dog}
            photoUri={photoUri}
            onChargeChange={(value) => onFieldChange('wantedCharge', value)}
            onRewardChange={(value) => onFieldChange('wantedReward', value)}
            onPhotoTransformChange={(value) => onFieldChange('wantedPhotoTransform', value)}
          />
        )}
        {/* {template === 'bars' && (
          <BehindBarsCard
            dog={dog}
            photoUri={photoUri}
            onReasonChange={(value) => onFieldChange('barsReason', value)}
          />
        )} */}
      </div>

      {template === 'mugshot' && (
        <div className="sticker-tray">
          {MUGSHOT_STICKERS.map((sticker) => (
            <button
              key={sticker.id}
              type="button"
              className={dog.mugshotStickers?.[sticker.id] ? 'active' : ''}
              onClick={() => handleStickerToggle(sticker.id, sticker.default)}
            >
              {t(sticker.labelKey)}
            </button>
          ))}
        </div>
      )}

      {template === 'wanted' && (
        <div className="editable-fields-info">
          <h3>{t('editableFieldsTitle')}</h3>
          <ul>
            <li>{t('wantedEditableReward')}</li>
            <li>{t('wantedEditableCharge')}</li>
          </ul>
        </div>
      )}

      {/* {template === 'bars' && (
        <div className="editable-fields-info">
          <h3>{t('editableFieldsTitle')}</h3>
          <ul>
            <li>{t('barsEditableReason')}</li>
          </ul>
        </div>
      )} */}

      <div className="format-tabs">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={format === f.id ? 'active' : ''}
            onClick={() => setFormat(f.id)}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      <button type="button" className="share-button" onClick={handleShare} disabled={sharing}>
        <ShareIcon className="share-button-icon" />
        {t('shareButton')}
      </button>
    </div>
  )
}

export default CardView
