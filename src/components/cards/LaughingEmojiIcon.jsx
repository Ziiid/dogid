function LaughingEmojiIcon({ className, style }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#ffd93b" stroke="#e0a800" strokeWidth="3" />
      <circle cx="30" cy="55" r="8" fill="#ffb3c1" opacity="0.7" />
      <circle cx="70" cy="55" r="8" fill="#ffb3c1" opacity="0.7" />
      <path d="M22 38 Q30 28 38 38" stroke="#161616" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M62 38 Q70 28 78 38" stroke="#161616" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M28 62 Q50 90 72 62 Q50 78 28 62 Z" fill="#161616" />
      <path d="M38 68 Q50 78 62 68 Q50 74 38 68 Z" fill="#ff8a8a" />
    </svg>
  )
}

export default LaughingEmojiIcon
