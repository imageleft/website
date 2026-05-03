import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
}

interface Props {
  nav: NavItem[];
}

export default function MobileNav({ nav }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(!open)}
        className="text-ink hover:bg-surface-soft inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border)] transition-colors"
      >
        {open ? <CloseIcon /> : <BurgerIcon />}
      </button>

      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          className="bg-surface fixed inset-x-0 top-16 z-40 border-b border-[var(--color-border)] p-6 shadow-lg"
        >
          <ul className="space-y-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ink hover:text-accent block text-lg"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function BurgerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
