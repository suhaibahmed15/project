export default function PharmacyLogo({ width = 72, height = 64, className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pharmacy Stock And Expiry Monitor Logo"
    >
      {/* Tilted Capsule */}
      <g transform="translate(42, 38) rotate(-35)">
        {/* Navy Half */}
        <path
          d="M -15 -13 L -1.5 -13 L -1.5 13 L -15 13 A 13 13 0 0 1 -15 -13 Z"
          fill="#0f2e59"
        />
        {/* Specular White Highlight on Navy */}
        <path
          d="M -21 -6 A 8 8 0 0 1 -10 -8"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Orange Half */}
        <path
          d="M 1.5 -13 L 15 -13 A 13 13 0 0 1 15 13 L 1.5 13 Z"
          fill="#f59e0b"
        />
      </g>

      {/* Shield with Medical Cross */}
      <g>
        {/* Shield Body */}
        <path
          d="M 58 32 C 65 32 72 28.5 72 28.5 C 72 28.5 79 32 86 32 C 86 48 79 60 72 66 C 65 60 58 48 58 32 Z"
          fill="#0f2e59"
        />
        {/* White Medical Cross */}
        <rect x="70" y="38" width="4" height="18" rx="1.5" fill="#ffffff" />
        <rect x="63" y="45" width="18" height="4" rx="1.5" fill="#ffffff" />
      </g>
    </svg>
  );
}
