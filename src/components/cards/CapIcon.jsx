function CapIcon({ className, style }) {
  return (
    <svg viewBox="0 0 100 70" className={className} style={style} aria-hidden="true">
      <path
        d="M14 58 C10 26 34 6 58 6 C82 6 94 24 96 46 C96 52 92 56 86 56 L20 56 C16 56 14 58 14 58 Z"
        fill="#d9534f"
      />
      <ellipse cx="24" cy="58" rx="30" ry="9" fill="#c0392b" />
      <circle cx="58" cy="14" r="4" fill="#a83232" />
    </svg>
  )
}

export default CapIcon
