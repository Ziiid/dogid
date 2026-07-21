import { useState } from 'react'
import IdCard from './cards/IdCard.jsx'
import DriversLicenseCard from './cards/DriversLicenseCard.jsx'
import MugshotCard from './cards/MugshotCard.jsx'
import './CardView.css'

const TEMPLATES = [
  { id: 'id', label: 'ID-kort' },
  { id: 'license', label: 'Körkort' },
  { id: 'mugshot', label: 'Mugshot' },
]

function CardView({ dog, photoUri, onCaptionChange }) {
  const [template, setTemplate] = useState('id')

  if (!dog?.name) {
    return <p className="card-empty">Fyll i formuläret för att se ditt kort.</p>
  }

  return (
    <div className="card-view">
      <div className="template-tabs">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={template === t.id ? 'active' : ''}
            onClick={() => setTemplate(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="template-stage">
        {template === 'id' && <IdCard dog={dog} photoUri={photoUri} />}
        {template === 'license' && <DriversLicenseCard dog={dog} photoUri={photoUri} />}
        {template === 'mugshot' && (
          <MugshotCard dog={dog} photoUri={photoUri} onCaptionChange={onCaptionChange} />
        )}
      </div>
    </div>
  )
}

export default CardView
