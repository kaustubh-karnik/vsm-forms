"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import type { VSMForm, FormResponse } from "@/lib/supabase";
import { deleteResponses } from "@/app/actions/response-actions";

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
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const filtered = value.filter(Boolean).map(String);
    return filtered.length > 0 ? filtered.join(", ") : "—";
  }
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const selectedId = searchParams.get("r") ?? responses[0]?.id;
  const selected = responses.find((r) => r.id === selectedId) ?? responses[0];

  function selectRow(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("r", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const columns = form.fields.map((f) => f.label);
  const responseIds = useMemo(() => responses.map((response) => response.id), [responses]);
  const allSelected = responseIds.length > 0 && selectedIds.length === responseIds.length;
  const selectedCount = selectedIds.length;

  useEffect(() => {
    if (selectedIds.length === 0) return;
    const allowed = new Set(responseIds);
    setSelectedIds((prev) => prev.filter((id) => allowed.has(id)));
  }, [responseIds]);

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[color:var(--color-border)] bg-white px-4 py-3">
          <div className="text-sm text-[color:var(--color-muted)]">
            {selectedCount > 0 ? (
              <span>
                <span className="font-semibold text-[color:var(--color-dark)]">
                  {selectedCount}
                </span>{" "}
                selected
              </span>
            ) : (
              "Select rows to delete"
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={selectedCount === 0 || isPending}
              onClick={() => {
                if (selectedCount === 0) return;
                setShowDeleteDialog(true);
              }}
              className="rounded-[10px] border border-[color:rgba(220,38,38,0.2)] px-3 py-2 text-xs font-semibold text-[#B91C1C] transition-colors hover:border-[color:rgba(220,38,38,0.4)] hover:bg-[color:rgba(220,38,38,0.06)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="rounded-[20px] border border-[color:var(--color-border)] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <div className="border-b border-[color:var(--color-border)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)] md:hidden">
            Responses
          </div>
          <div className="space-y-3 p-4 md:hidden">
            {responses.map((response) => {
              const isSelected = response.id === selectedId;
              return (
                <button
                  key={response.id}
                  type="button"
                  onClick={() => selectRow(response.id)}
                  className={`w-full rounded-[16px] border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "border-[color:rgba(232,100,10,0.35)] bg-[color:rgba(232,100,10,0.08)]"
                      : "border-[color:var(--color-border)] bg-white hover:bg-[color:rgba(253,246,236,0.6)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--color-dark)]">
                        {renderValue(response.data[columns[0]])}
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                        {formatShortDate(response.submittedAt)}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(response.id)}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setSelectedIds((prev) =>
                          checked
                            ? [...prev, response.id]
                            : prev.filter((id) => id !== response.id)
                        );
                      }}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-1 h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-saffron)]"
                    />
                  </div>
                  <div className="mt-3 grid gap-1 text-xs text-[color:var(--color-muted)]">
                    {columns.slice(1, 3).map((col) => (
                      <div key={col} className="flex items-center justify-between gap-2">
                        <span className="font-semibold uppercase tracking-[0.16em] text-[10px] text-[color:var(--color-muted)]">
                          {col}
                        </span>
                        <span className="max-w-[60%] truncate text-right">
                          {renderValue(response.data[col])}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] border-collapse">
                <thead>
                  <tr className="bg-[color:rgba(253,246,236,0.92)] text-left">
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => {
                            setSelectedIds(allSelected ? [] : responseIds);
                          }}
                          className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-saffron)]"
                        />
                        Select
                      </label>
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                      Submitted
                    </th>
                    {columns.map((col) => (
                      <th key={col} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
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
                        aria-selected={isSelected}
                        className={`cursor-pointer border-t border-[color:var(--color-border)] align-top transition-colors ${
                          isSelected
                            ? "bg-[color:rgba(232,100,10,0.05)]"
                            : "hover:bg-[color:rgba(253,246,236,0.6)]"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(response.id)}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSelectedIds((prev) =>
                                checked
                                  ? [...prev, response.id]
                                  : prev.filter((id) => id !== response.id)
                              );
                            }}
                            onClick={(event) => event.stopPropagation()}
                            className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-saffron)]"
                          />
                        </td>
                        <td className={`px-4 py-3 text-sm ${isSelected ? "font-semibold text-[color:var(--color-saffron)]" : "text-[color:var(--color-dark)]"}`}>
                          {formatShortDate(response.submittedAt)}
                        </td>
                        {columns.map((col) => {
                          const rendered = renderValue(response.data[col]);
                          const textValue = typeof response.data[col] === "string" ? response.data[col] : undefined;

                          return (
                            <td
                              key={`${response.id}-${col}`}
                              title={textValue}
                              className="max-w-[200px] truncate px-4 py-3 text-sm text-[color:var(--color-muted)]"
                            >
                              {rendered}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {selected && (
        <aside className="order-2 rounded-[24px] border border-[color:var(--color-border)] bg-white p-5 shadow-warm xl:sticky xl:top-6 xl:self-start">
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
                    renderValue(value)
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[color:rgba(15,23,42,0.35)]"
            onClick={() => setShowDeleteDialog(false)}
          />
          <div className="relative w-[92vw] max-w-[460px] overflow-hidden rounded-[24px] border border-[color:var(--color-border)] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.3)]">
            <div className="flex items-start gap-4 border-b border-[color:var(--color-border)] bg-[color:var(--color-card)] px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:rgba(220,38,38,0.12)] text-[#B91C1C]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden>
                  <path d="M12 9v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-muted)]">
                  Confirm deletion
                </p>
                <h3 className="mt-2 font-serif text-[22px] leading-snug text-[color:var(--color-dark)]">
                  Delete {selectedCount} selected
                  {selectedCount === 1 ? " response" : " responses"}?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                  This will permanently remove the selected submissions and any uploaded files. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteDialog(false)}
                className="inline-flex items-center justify-center rounded-[12px] border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-muted)] transition-colors hover:border-[color:rgba(232,100,10,0.22)] hover:text-[color:var(--color-saffron)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await deleteResponses(form.id, selectedIds);
                    setSelectedIds([]);
                    setShowDeleteDialog(false);
                    router.refresh();
                  });
                }}
                className="inline-flex items-center justify-center rounded-[12px] bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
