export default function PharmacyLogo({ width = 72, height = 64, className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pharmacy Stock And Expiry Monitor Brand Icon"
    >
      <rect width="80" height="80" rx="20" fill="url(#logoGrad)" />
      {/* Modern Medical / Health Shield Emblem - No Medicine Pill */}
      <path
        d="M40 16 C52 16 62 19 62 19 V42 C62 55 51 64 40 67 C29 64 18 55 18 42 V19 C18 19 28 16 40 16 Z"
        fill="#ffffff"
        fillOpacity="0.18"
      />
      {/* Health / Plus Cross */}
      <rect x="37" y="27" width="6" height="26" rx="3" fill="#ffffff" />
      <rect x="27" y="37" width="26" height="6" rx="3" fill="#ffffff" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#152614" />
          <stop offset="1" stopColor="#223d20" />
        </linearGradient>
      </defs>
    </svg>
  );
}
