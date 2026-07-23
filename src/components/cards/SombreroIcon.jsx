function SombreroIcon({ className, style }) {
  return (
    <svg viewBox="0 0 120 70" className={className} style={style} aria-hidden="true">
      <ellipse cx="60" cy="52" rx="58" ry="14" fill="#d9b26a" stroke="#8a6a2f" strokeWidth="3" />
      <path d="M32 52 C32 20 46 6 60 6 C74 6 88 20 88 52 Z" fill="#e6c688" />
      <rect x="32" y="42" width="56" height="10" fill="#c0392b" />
      <circle cx="60" cy="47" r="3" fill="#8a2f1f" />
    </svg>
  )
}

export default SombreroIcon
