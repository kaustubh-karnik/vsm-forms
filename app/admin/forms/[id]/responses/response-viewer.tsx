"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { getFieldValue, keysAreSimilar } from "@/lib/response-data";
import type { FormField, VSMForm, FormResponse } from "@/lib/supabase";
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

function dataKeyMatchesField(key: string, field: FormField): boolean {
  return key === field.label || key === field.id || keysAreSimilar(key, field.label);
}

function getDetailItems(data: Record<string, unknown>, fields: FormField[]) {
  const items = fields.map((field) => ({
    label: field.label,
    value: getFieldValue(data, field),
  }));

  for (const [key, value] of Object.entries(data)) {
    if (!fields.some((field) => dataKeyMatchesField(key, field))) {
      items.push({ label: key, value });
    }
  }

  return items;
}

function DetailValue({ label, value }: { label: string; value: unknown }) {
  if (isUrl(value)) {
    return (
      <div className="space-y-2">
        {isImageUrl(value) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className="h-auto max-h-40 w-full rounded-[8px] border border-[color:var(--color-border)] object-cover md:max-h-48"
          />
        )}
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[color:var(--color-saffron)] underline-offset-2 hover:underline"
        >
          Open file
        </a>
      </div>
    );
  }

  return (
    <span className="break-words text-sm leading-6 text-[color:var(--color-dark)] md:text-sm">
      {renderValue(value)}
    </span>
  );
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
  const detailItems = useMemo(
    () => (selected ? getDetailItems(selected.data, form.fields) : []),
    [selected, form.fields]
  );

  function selectRow(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("r", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const columns = form.fields;
  const extraColumnKeys = useMemo(() => {
    const keys = new Set<string>();
    responses.forEach((response) => {
      Object.keys(response.data).forEach((key) => {
        if (!form.fields.some((field) => dataKeyMatchesField(key, field))) {
          keys.add(key);
        }
      });
    });
    return [...keys].sort((a, b) => a.localeCompare(b));
  }, [responses, form.fields]);
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
      <div className="flex flex-col items-center justify-center gap-4 rounded-[16px] border-2 border-dashed border-black bg-[color:var(--color-card)] py-16 text-center shadow-[3px_3px_0_0_#000]">
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
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border-2 border-black bg-[color:var(--color-card)] px-4 py-3 shadow-[3px_3px_0_0_#000]">
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
              className="rounded-[8px] border-2 border-black bg-red-100 px-3 py-2 text-xs font-bold text-[#B91C1C] shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="w-full min-w-0 overflow-hidden rounded-[16px] border-2 border-black bg-[color:var(--color-card)] shadow-[4px_4px_0_0_#000]">
          <div className="flex items-center justify-between gap-3 border-b-2 border-black bg-[color:var(--color-cream)] px-4 py-3 md:hidden">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                Spreadsheet view
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[color:var(--color-dark)]">
                Swipe sideways to see all columns →
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-black bg-white px-2.5 py-0.5 text-[11px] font-bold text-[color:var(--color-dark)]">
              {responses.length}
            </span>
          </div>

          <div className="w-full min-w-0 max-w-full max-h-[min(72dvh,720px)] overflow-x-auto overflow-y-auto overscroll-contain [touch-action:pan-x_pan-y] [-webkit-overflow-scrolling:touch] md:max-h-none">
            <table className="w-max min-w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black bg-[color:var(--color-cream)] text-left">
                  <th className="min-w-[52px] bg-[color:var(--color-cream)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)] md:px-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => {
                          setSelectedIds(allSelected ? [] : responseIds);
                        }}
                        className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-saffron)]"
                      />
                      <span className="hidden sm:inline">Select</span>
                    </label>
                  </th>
                  <th className="min-w-[108px] bg-[color:var(--color-cream)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)] md:px-4">
                    Submitted
                  </th>
                  {columns.map((field) => (
                    <th
                      key={field.id}
                      className="min-w-[140px] max-w-[220px] bg-[color:var(--color-cream)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)] md:min-w-0 md:max-w-none md:px-4"
                    >
                      {field.label}
                    </th>
                  ))}
                  {extraColumnKeys.map((key) => (
                    <th
                      key={key}
                      className="min-w-[140px] max-w-[220px] bg-[color:var(--color-cream)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)] md:min-w-0 md:max-w-none md:px-4"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => {
                  const isRowSelected = response.id === selectedId;
                  const rowBg = isRowSelected
                    ? "bg-[color:var(--color-accent)]"
                    : "bg-[color:var(--color-card)]";

                  return (
                    <tr
                      key={response.id}
                      onClick={() => selectRow(response.id)}
                      aria-selected={isRowSelected}
                      className={`cursor-pointer border-t-2 border-black align-top transition-colors hover:bg-[color:var(--color-cream)]/50 ${rowBg}`}
                    >
                      <td className={`min-w-[52px] px-3 py-3 md:px-4 ${rowBg}`}>
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
                          className="h-4.5 w-4.5 accent-[color:var(--color-saffron)] rounded-none border-2 border-black shadow-[1px_1px_0_0_#000] cursor-pointer"
                        />
                      </td>
                      <td
                        className={`min-w-[108px] px-3 py-3 text-xs leading-5 md:px-4 md:text-sm ${
                          isRowSelected
                            ? "font-semibold text-[color:var(--color-saffron)]"
                            : "text-[color:var(--color-dark)]"
                        } ${rowBg}`}
                      >
                        {formatShortDate(response.submittedAt)}
                      </td>
                      {columns.map((field) => {
                        const value = getFieldValue(response.data, field);
                        const textValue = typeof value === "string" ? value : undefined;

                        return (
                          <td
                            key={`${response.id}-${field.id}`}
                            title={textValue}
                            className="min-w-[140px] max-w-[220px] px-3 py-3 text-xs leading-5 break-words text-[color:var(--color-dark)] md:max-w-[200px] md:truncate md:px-4 md:text-sm md:text-[color:var(--color-muted)]"
                          >
                            {renderValue(value)}
                          </td>
                        );
                      })}
                      {extraColumnKeys.map((key) => {
                        const value = response.data[key];
                        const textValue = typeof value === "string" ? value : undefined;

                        return (
                          <td
                            key={`${response.id}-${key}`}
                            title={textValue}
                            className="min-w-[140px] max-w-[220px] px-3 py-3 text-xs leading-5 break-words text-[color:var(--color-dark)] md:max-w-[200px] md:truncate md:px-4 md:text-sm md:text-[color:var(--color-muted)]"
                          >
                            {renderValue(value)}
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
      </section>

      {selected && (
        <aside className="order-2 hidden rounded-[20px] border-2 border-black bg-[color:var(--color-card)] p-5 shadow-[4px_4px_0_0_#000] md:block xl:sticky xl:top-6 xl:self-start">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-serif text-xl text-[color:var(--color-dark)]">
                Submission detail
              </h2>
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                {formatDate(selected.submittedAt)}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[color:rgba(21,128,61,0.1)] px-3 py-1 text-xs font-semibold text-[#166534]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />
              Received
            </span>
          </div>

          <div className="space-y-3">
            {detailItems.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="rounded-[10px] border-2 border-black bg-[color:var(--color-card)] p-3.5 shadow-[2px_2px_0_0_#000]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
                  {item.label}
                </p>
                <div className="mt-1.5">
                  <DetailValue label={item.label} value={item.value} />
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
          <div className="relative w-[92vw] max-w-[460px] overflow-hidden rounded-[20px] border-2 border-black bg-[color:var(--color-card)] shadow-[6px_6px_0_0_#000]">
            <div className="flex items-start gap-4 border-b-2 border-black bg-[color:var(--color-card)] px-6 py-5">
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
                className="inline-flex items-center justify-center rounded-[10px] border-2 border-black bg-[color:var(--color-cream)] px-4 py-2.5 text-sm font-bold text-[color:var(--color-dark)] shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000] active:translate-y-0 active:shadow-none hover:text-[color:var(--color-saffron)]"
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
                className="inline-flex items-center justify-center rounded-[10px] border-2 border-black bg-[#DC2626] px-4 py-2.5 text-sm font-bold text-white shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000] active:translate-y-0 active:shadow-none hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-70"
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
