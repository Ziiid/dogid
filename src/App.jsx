import { useEffect, useState } from 'react'
import DogForm from './components/DogForm.jsx'
import CardView from './components/CardView.jsx'
import { loadDogProfile, loadPhotoUri, saveDogProfile } from './lib/dogStorage.js'
import { useLanguage } from './lib/i18n.jsx'
import logo from './assets/dogsona-logo.png'
import './App.css'

function App() {
  const { lang, setLang, t } = useLanguage()
  const [dog, setDog] = useState(null)
  const [photoUri, setPhotoUri] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savedMessage, setSavedMessage] = useState(false)
  const [tab, setTab] = useState('form')

  useEffect(() => {
    async function load() {
      const [profile, photo] = await Promise.all([loadDogProfile(), loadPhotoUri()])
      setDog(profile)
      setPhotoUri(photo)
      setLoading(false)
      if (profile?.name) setTab('card')
    }
    load()
  }, [])

  async function handleSave(updatedDog) {
    await saveDogProfile(updatedDog)
    setDog(updatedDog)
    setSavedMessage(true)
    setTab('card')
    setTimeout(() => setSavedMessage(false), 2000)
  }

  function handlePhotoChange(uri) {
    setPhotoUri(uri)
  }

  async function handleFieldChange(field, value) {
    const updated = { ...dog, [field]: value }
    await saveDogProfile(updated)
    setDog(updated)
  }

  if (loading) {
    return <div className="app" />
  }

  return (
    <div className="app">
      <div className="lang-row">
        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
        >
          {lang === 'sv' ? 'EN' : 'SV'}
        </button>
      </div>

      <header className="app-header">
        <div className="brand">
          <img src={logo} alt="" className="brand-logo" />
          <h1>
            <span className="brand-dog">Dog</span>
            <span className="brand-sona">sona</span>
          </h1>
        </div>
      </header>

      <nav className="main-tabs">
        <button
          type="button"
          className={tab === 'form' ? 'active' : ''}
          onClick={() => setTab('form')}
        >
          {t('appTabForm')}
        </button>
        <button
          type="button"
          className={tab === 'card' ? 'active' : ''}
          onClick={() => setTab('card')}
          disabled={!dog?.name}
        >
          {t('appTabCard')}
        </button>
      </nav>

      {tab === 'form' ? (
        <DogForm
          initialDog={dog}
          initialPhotoUri={photoUri}
          onSave={handleSave}
          onPhotoChange={handlePhotoChange}
        />
      ) : (
        <CardView dog={dog} photoUri={photoUri} onFieldChange={handleFieldChange} />
      )}

      {savedMessage && <div className="saved-toast">{t('appSaved')}</div>}
    </div>
  )
}

export default App
