function BinocularsIcon({ className, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="9" width="7" height="9" rx="2" />
      <rect x="14" y="9" width="7" height="9" rx="2" />
      <rect x="9" y="10.2" width="6" height="2.6" rx="1" />
      <circle cx="6.5" cy="7.4" r="1.3" />
      <circle cx="17.5" cy="7.4" r="1.3" />
    </svg>
  )
}

export default BinocularsIcon
