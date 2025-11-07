export function NovaLogo() {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "hsl(var(--primary))"}} />
                <stop offset="100%" style={{stopColor: "hsl(var(--accent))"}} />
            </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM13.8284 10.1716C14.7869 9.21305 16.294 9.21305 17.2525 10.1716L21.8284 14.7475C22.7869 15.706 22.7869 17.2131 21.8284 18.1716L17.2525 22.7475C16.294 23.706 14.7869 23.706 13.8284 22.7475L9.25253 18.1716C8.29399 17.2131 8.29399 15.706 9.25253 14.7475L13.8284 10.1716Z"
          fill="url(#logo-gradient)"
        />
      </svg>
    )
  }
