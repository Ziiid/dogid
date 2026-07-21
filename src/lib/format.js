export function formatDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

export function calcAge(isoDate) {
  if (!isoDate) return ''
  const birth = new Date(isoDate)
  if (Number.isNaN(birth.getTime())) return ''
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())
  if (!hasHadBirthdayThisYear) age -= 1
  return age
}

export function formatGender(gender, lang = 'sv') {
  if (gender === 'hane') return lang === 'en' ? 'Male' : 'Hane'
  if (gender === 'tik') return lang === 'en' ? 'Female' : 'Tik'
  return '—'
}

export function genderCode(gender, lang = 'sv') {
  if (gender === 'hane') return lang === 'en' ? 'M' : 'H'
  if (gender === 'tik') return lang === 'en' ? 'F' : 'T'
  return '—'
}

export function formatShortDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = String(date.getFullYear()).slice(-2)
  return `${d}/${m}/${y}`
}
