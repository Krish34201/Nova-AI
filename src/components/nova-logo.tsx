export function NovaLogo() {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM16 25L22.5 22.5L25 16L22.5 9.5L16 7L9.5 9.5L7 16L9.5 22.5L16 25ZM16 20.85L19.25 19.35L20.75 16L19.25 12.65L16 11.15L12.75 12.65L11.25 16L12.75 19.35L16 20.85Z"
          fill="url(#logo-gradient)"
        />
      </svg>
    )
  }
