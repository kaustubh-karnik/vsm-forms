"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/retroui/Button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="relative w-full min-h-14 gap-3 rounded-[14px] border-2 border-black bg-saffron px-6 py-4 text-base font-bold text-white shadow-[4px_4px_0_0_#000] transition-all duration-200 hover:-translate-y-px hover:bg-saffron-dark hover:shadow-[5px_5px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:min-h-16 sm:text-lg"
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
    </Button>
  );
}
