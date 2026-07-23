function SpeechBubbleIcon({ className, style }) {
  return (
    <svg viewBox="0 0 110 80" className={className} style={style} aria-hidden="true">
      <path
        d="M8 10 h94 a8 8 0 0 1 8 8 v34 a8 8 0 0 1 -8 8 h-56 l-18 18 v-18 h-20 a8 8 0 0 1 -8 -8 v-34 a8 8 0 0 1 8 -8 Z"
        fill="#ffffff"
        stroke="#161616"
        strokeWidth="4"
      />
      <circle cx="35" cy="45" r="5" fill="#161616" />
      <circle cx="55" cy="45" r="5" fill="#161616" />
      <circle cx="75" cy="45" r="5" fill="#161616" />
    </svg>
  )
}

export default SpeechBubbleIcon
