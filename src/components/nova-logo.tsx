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
        fill="url(#logo-gradient)"
        fillOpacity="0.1"
      />
      <path
        d="M22 13C22 16.79 19.3137 20.4426 16.2825 22.2513M10 19C10 15.21 12.6863 11.5574 15.7175 9.74866M15.7175 22.2513C12.6863 20.4426 10 16.79 10 13M22 19C19.3137 15.21 16.2825 11.5574 15.7175 9.74866"
        stroke="url(#logo-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
      />
    </svg>
  );
}
