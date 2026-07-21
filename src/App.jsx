import { useEffect, useState } from 'react'
import DogForm from './components/DogForm.jsx'
import CardView from './components/CardView.jsx'
import { loadDogProfile, loadPhotoUri, saveDogProfile } from './lib/dogStorage.js'
import './App.css'

function App() {
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

  async function handleCaptionChange(caption) {
    const updated = { ...dog, mugshotCaption: caption }
    await saveDogProfile(updated)
    setDog(updated)
  }

  if (loading) {
    return <div className="app" />
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dog ID</h1>
        <p className="tagline">by Dogish</p>
      </header>

      <nav className="main-tabs">
        <button
          type="button"
          className={tab === 'form' ? 'active' : ''}
          onClick={() => setTab('form')}
        >
          Formulär
        </button>
        <button
          type="button"
          className={tab === 'card' ? 'active' : ''}
          onClick={() => setTab('card')}
          disabled={!dog?.name}
        >
          Kort
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
        <CardView dog={dog} photoUri={photoUri} onCaptionChange={handleCaptionChange} />
      )}

      {savedMessage && <div className="saved-toast">Sparat!</div>}
    </div>
  )
}

export default App
