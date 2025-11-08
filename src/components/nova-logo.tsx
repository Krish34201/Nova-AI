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
        d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0ZM21.5 18.5C19.429 20.571 16.571 22.071 13.5 22.5C11.5 22.786 9.5 22.5 7.785 21.785L10.5 13.5C11 11.5 12 9.785 13.5 8.5C15.571 6.429 18.429 4.929 21.5 4.5C23.5 4.214 25.5 4.5 27.215 5.215L24.5 13.5C24 15.5 23 17.215 21.5 18.5Z"
        fill="url(#logo-gradient)"
      />
    </svg>
  );
}
