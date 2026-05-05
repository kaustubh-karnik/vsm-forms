"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="relative inline-flex w-full items-center justify-center gap-3 rounded-[12px] bg-[color:var(--color-saffron)] px-4 py-3.5 text-sm font-semibold text-white shadow-warm transition-all duration-200 hover:-translate-y-[1px] hover:bg-[color:var(--color-saffron-dark)] hover:shadow-[0_6px_24px_rgba(232,100,10,0.35)] disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
    >
      {pending ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
            <path className="opacity-80" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Submitting…
        </>
      ) : (
        "Submit Registration →"
      )}
    </button>
  );
}
