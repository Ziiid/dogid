import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import BlankCard from './cards/BlankCard.jsx'
import MugshotCard from './cards/MugshotCard.jsx'
import WantedCard from './cards/WantedCard.jsx'
import ShareIcon from './cards/ShareIcon.jsx'
import { MUGSHOT_STICKERS, STICKER_CATEGORIES } from './cards/mugshotStickers.js'
import { StickerGraphic } from './cards/CardSticker.jsx'
import { useLanguage } from '../lib/i18n.jsx'
import { loadPhotoBase64 } from '../lib/dogStorage.js'
import './CardView.css'

const SHARE_FILENAME = 'dogsona-share.png'

const STICKER_FIELD_BY_TEMPLATE = { blank: 'blankStickers', mugshot: 'mugshotStickers' }

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
  { id: 'blank', labelKey: 'tplBlank' },
  { id: 'mugshot', labelKey: 'tplMugshot' },
  { id: 'wanted', labelKey: 'tplWanted' },
]

function CardView({ dog, photoUri, onFieldChange }) {
  const { t } = useLanguage()
  const [template, setTemplate] = useState('blank')
  const [format, setFormat] = useState('original')
  const [sharing, setSharing] = useState(false)
  const stageRef = useRef(null)

  if (!dog?.name) {
    return <p className="card-empty">{t('cardEmpty')}</p>
  }

  const stickerField = STICKER_FIELD_BY_TEMPLATE[template]

  function handleStickerToggle(stickerId, defaultTransform) {
    const current = dog[stickerField] ?? {}
    if (current[stickerId]) {
      const { [stickerId]: _removed, ...rest } = current
      onFieldChange(stickerField, rest)
    } else {
      onFieldChange(stickerField, { ...current, [stickerId]: defaultTransform })
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
        {template === 'blank' && (
          <BlankCard
            dog={dog}
            photoUri={photoUri}
            onPhotoTransformChange={(value) => onFieldChange('blankPhotoTransform', value)}
            onStickersChange={(value) => onFieldChange('blankStickers', value)}
          />
        )}
        {template === 'mugshot' && (
          <MugshotCard
            dog={dog}
            photoUri={photoUri}
            onCaptionChange={(value) => onFieldChange('mugshotCaption', value)}
            onPhotoTransformChange={(value) => onFieldChange('mugshotPhotoTransform', value)}
            onStickersChange={(value) => onFieldChange('mugshotStickers', value)}
          />
        )}
        {template === 'wanted' && (
          <WantedCard
            dog={dog}
            photoUri={photoUri}
            onChargeChange={(value) => onFieldChange('wantedCharge', value)}
            onRewardChange={(value) => onFieldChange('wantedReward', value)}
            onPhotoTransformChange={(value) => onFieldChange('wantedPhotoTransform', value)}
          />
        )}
      </div>

      {stickerField && (
        <div className="sticker-categories">
          {STICKER_CATEGORIES.map((category) => (
            <div key={category.id} className="sticker-category">
              <h3 className="sticker-category-label">{t(category.labelKey)}</h3>
              <div className="sticker-tray">
                {MUGSHOT_STICKERS.filter((sticker) => sticker.category === category.id).map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    className={dog[stickerField]?.[sticker.id] ? 'active' : ''}
                    onClick={() => handleStickerToggle(sticker.id, sticker.default)}
                    title={t(sticker.labelKey)}
                    aria-label={t(sticker.labelKey)}
                  >
                    <StickerGraphic id={sticker.id} className="sticker-tray-icon" />
                  </button>
                ))}
              </div>
            </div>
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

      <hr className="section-divider" />

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
