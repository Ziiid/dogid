import { formatDate, genderCode } from '../../lib/format.js'
import { useLanguage } from '../../lib/i18n.jsx'
import PawIcon from './PawIcon.jsx'
import './DriversLicenseCard.css'

function DriversLicenseCard({ dog, photoUri }) {
  const { lang, t } = useLanguage()
  const microtext = `${dog.chipNumber || dog.name}  `.repeat(6)
  const titleSub = t('licenseTitleSub')

  return (
    <div className="license-card">
      <div className="license-security" />

      <div className="license-top">
        <div className="license-emblem">
          <div className="license-emblem-ring">
            {Array.from({ length: 10 }).map((_, i) => (
              <PawIcon
                key={i}
                className="license-emblem-paw"
                style={{ transform: `rotate(${i * 36}deg) translateY(-9px)` }}
              />
            ))}
          </div>
          <span className="license-emblem-letter">D</span>
        </div>

        <div className="license-title-block">
          <span className="license-title">
            {t('licenseTitle')}
            {titleSub && <span className="license-title-sub">{titleSub}</span>}
          </span>
        </div>

        <span className="license-country">DOGISH</span>
      </div>

      <div className="license-fields">
        <div className="license-field">
          <span className="num">1.</span>
          <span className="value name">{dog.name.toUpperCase()}</span>
        </div>
        <div className="license-field">
          <span className="num">2.</span>
          <span className="value">{(dog.breed || '—').toUpperCase()}</span>
        </div>
        <div className="license-field">
          <span className="num">3.</span>
          <span className="value">{formatDate(dog.birthDate) || '—'} -</span>
        </div>
        <div className="license-field">
          <span className="num">4a.</span>
          <span className="value">{t('licenseAlways')}</span>
          <span className="num">4b.</span>
          <span className="value">{t('licenseForLife')}</span>
        </div>
        <div className="license-field">
          <span className="num">4c.</span>
          <span className="value">{t('licenseKennelRegister')}</span>
        </div>
        <div className="license-field">
          <span className="num">5.</span>
          <span className="value">{dog.chipNumber || '—'}</span>
        </div>
        <div className="license-field">
          <span className="num">6.</span>
          <span className="value">{dog.kennel || '—'}</span>
        </div>
      </div>

      <div className="license-bottom">
        <div className="license-photo-block">
          <div className="license-photo">
            {photoUri ? (
              <img src={photoUri} alt={dog.name} />
            ) : (
              <div className="license-photo-placeholder" />
            )}
          </div>
          <div className="license-sign">
            <PawIcon className="license-sign-icon" />
          </div>
        </div>

        <div className="license-ghost">
          {photoUri && <img src={photoUri} alt="" aria-hidden="true" />}
          <span className="license-ghost-text">{microtext}</span>
        </div>

        <div className="license-class">
          <span className="num">9.</span>
          <span className="value">{genderCode(dog.gender, lang)}</span>
        </div>
      </div>

      <div className="license-footer">
        <div className="license-logo">
          <span className="license-logo-triangle" />
          <span className="license-logo-text">
            DOGISH
            <br />
            REGISTER
          </span>
        </div>
        <PawIcon className="license-footer-paw" />
      </div>
    </div>
  )
}

export default DriversLicenseCard
