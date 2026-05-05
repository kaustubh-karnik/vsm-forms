"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import type { VSMForm, FormResponse } from "@/lib/supabase";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function isUrl(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function isImageUrl(value: string) {
  return /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(value);
}

function renderValue(value: unknown) {
  if (!value) return "—";
  if (isUrl(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-[color:var(--color-saffron)] underline-offset-2 hover:underline"
      >
        View file
      </a>
    );
  }
  return String(value);
}

export function ResponseViewer({
  form,
  responses,
}: {
  form: VSMForm;
  responses: FormResponse[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("r") ?? responses[0]?.id;
  const selected = responses.find((r) => r.id === selectedId) ?? responses[0];

  function selectRow(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("r", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const columns = form.fields.map((f) => f.label);

  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-[color:var(--color-border)] bg-white py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:rgba(232,100,10,0.07)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-[color:var(--color-saffron)]" aria-hidden>
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="font-serif text-lg text-[color:var(--color-dark)]">No submissions yet</p>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">Responses will appear here once volunteers register.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="overflow-hidden rounded-[20px] border border-[color:var(--color-border)] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[color:rgba(253,246,236,0.85)] text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                  Submitted
                </th>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => {
                const isSelected = response.id === selectedId;
                return (
                  <tr
                    key={response.id}
                    onClick={() => selectRow(response.id)}
                    className={`cursor-pointer border-t border-[color:var(--color-border)] align-top transition-colors ${
                      isSelected
                        ? "bg-[color:rgba(232,100,10,0.05)]"
                        : "hover:bg-[color:rgba(253,246,236,0.6)]"
                    }`}
                  >
                    <td className={`px-4 py-3 text-sm ${isSelected ? "font-semibold text-[color:var(--color-saffron)]" : "text-[color:var(--color-dark)]"}`}>
                      {formatShortDate(response.submittedAt)}
                    </td>
                    {columns.map((col) => (
                      <td key={`${response.id}-${col}`} className="max-w-[180px] truncate px-4 py-3 text-sm text-[color:var(--color-muted)]">
                        {renderValue(response.data[col])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <aside className="rounded-[24px] border border-[color:var(--color-border)] bg-white p-5 shadow-warm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl text-[color:var(--color-dark)]">
                Submission detail
              </h2>
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                {formatDate(selected.submittedAt)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:rgba(21,128,61,0.1)] px-3 py-1 text-xs font-semibold text-[#166534]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />
              Received
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(selected.data).map(([key, value]) => (
              <div
                key={key}
                className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3.5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
                  {key}
                </p>
                <div className="mt-1.5 text-sm leading-6 text-[color:var(--color-dark)]">
                  {isUrl(value) ? (
                    <div className="space-y-2">
                      {isImageUrl(value) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={value}
                          alt={key}
                          className="h-auto max-h-48 w-full rounded-[10px] border border-[color:var(--color-border)] object-cover"
                        />
                      )}
                      <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[color:var(--color-saffron)] underline-offset-2 hover:underline"
                      >
                        Open file
                      </a>
                    </div>
                  ) : (
                    String(value) || "—"
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
