import { useState } from 'react'
import IdCard from './cards/IdCard.jsx'
import DriversLicenseCard from './cards/DriversLicenseCard.jsx'
import MugshotCard from './cards/MugshotCard.jsx'
import DatingCard from './cards/DatingCard.jsx'
import ReportCard from './cards/ReportCard.jsx'
import GuardCard from './cards/GuardCard.jsx'
import { useLanguage } from '../lib/i18n.jsx'
import './CardView.css'

const TEMPLATES = [
  { id: 'id', labelKey: 'tplId' },
  { id: 'license', labelKey: 'tplLicense' },
  { id: 'mugshot', labelKey: 'tplMugshot' },
  { id: 'dating', labelKey: 'tplDating' },
  { id: 'report', labelKey: 'tplReport' },
  { id: 'guard', labelKey: 'tplGuard' },
]

function CardView({ dog, photoUri, onFieldChange }) {
  const { t } = useLanguage()
  const [template, setTemplate] = useState('id')

  if (!dog?.name) {
    return <p className="card-empty">{t('cardEmpty')}</p>
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

      <div className="template-stage">
        {template === 'id' && <IdCard dog={dog} photoUri={photoUri} />}
        {template === 'license' && <DriversLicenseCard dog={dog} photoUri={photoUri} />}
        {template === 'mugshot' && (
          <MugshotCard
            dog={dog}
            photoUri={photoUri}
            onCaptionChange={(value) => onFieldChange('mugshotCaption', value)}
          />
        )}
        {template === 'dating' && (
          <DatingCard
            dog={dog}
            photoUri={photoUri}
            onBioChange={(value) => onFieldChange('datingBio', value)}
          />
        )}
        {template === 'report' && (
          <ReportCard
            dog={dog}
            photoUri={photoUri}
            onGradesChange={(value) => onFieldChange('reportGrades', value)}
            onCommentChange={(value) => onFieldChange('reportComment', value)}
          />
        )}
        {template === 'guard' && (
          <GuardCard
            dog={dog}
            photoUri={photoUri}
            onNoteChange={(value) => onFieldChange('guardNote', value)}
          />
        )}
      </div>
    </div>
  )
}

export default CardView
