"use client";

import { useState } from "react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const target = `${origin}${path}`;

    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-muted)] transition-colors hover:border-[color:rgba(232,100,10,0.25)] hover:text-[color:var(--color-saffron)]"
      aria-label="Copy public form link"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
