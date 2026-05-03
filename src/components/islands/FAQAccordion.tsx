import { useState } from 'react';

export interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  items: FAQ[];
  /** Index of the item to expand on first render. Pass null/omit for all-collapsed. */
  defaultOpenIndex?: number | null;
}

export default function FAQAccordion({ items, defaultOpenIndex = null }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const isOpen = i === openIndex;
        const id = `faq-${i}`;
        return (
          <li key={i} className="flex items-start gap-3">
            <ArrowReturn className="text-muted mt-4 shrink-0" />
            <div className="border-border bg-surface-soft flex-1 rounded-[var(--radius-md)] border">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="text-ink flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="border-border bg-surface text-muted inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-lg leading-none"
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div
                  id={id}
                  className="text-muted border-t border-dashed border-[var(--color-border)] px-5 pt-3 pb-4 text-sm"
                >
                  {item.answer}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ArrowReturn({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="15 10 20 15 15 20" />
      <path d="M4 4v7a4 4 0 0 0 4 4h12" />
    </svg>
  );
}
