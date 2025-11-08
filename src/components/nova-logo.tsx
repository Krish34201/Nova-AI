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
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsl(var(--primary))" />
          <stop offset="1" stopColor="hsl(var(--secondary))" />
        </linearGradient>
      </defs>
      <path
        d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
        fill="black"
        fillOpacity="0.2"
      />
      <path
        d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
      />
      <path
        d="M16 4C16 4 24 8 28 16"
        stroke="url(#logo-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 16C8 8 16 4 16 4"
        stroke="url(#logo-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 28C16 28 8 24 4 16"
        stroke="url(#logo-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M28 16C24 24 16 28 16 28"
        stroke="url(#logo-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.87868 9.87868C12.2218 7.53553 15.7782 7.53553 18.1213 9.87868L22.1213 13.8787C24.4645 16.2218 24.4645 19.7782 22.1213 22.1213C19.7782 24.4645 16.2218 24.4645 13.8787 22.1213L9.87868 18.1213C7.53553 15.7782 7.53553 12.2218 9.87868 9.87868Z"
        stroke="url(#logo-gradient)"
        strokeOpacity="0.7"
        strokeWidth="1"
      />
    </svg>
  );
}
