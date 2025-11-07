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
                <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
        </defs>
        <path
          d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0ZM19.5355 21.5355C18.9527 22.1184 18.003 22.1184 17.4201 21.5355L12.4645 16.58L10.4645 18.58C9.88155 19.1628 8.93185 19.1628 8.34899 18.58L6.93481 17.1658C6.35195 16.583 6.35195 15.6333 6.93481 15.0504L15.0504 6.93481C15.6333 6.35195 16.583 6.35195 17.1658 6.93481L25.0652 14.8342C25.648 15.4171 25.648 16.3668 25.0652 16.9496L19.5355 22.4793L19.5355 21.5355Z"
          fill="url(#logo-gradient)"
        />
      </svg>
    )
  }
