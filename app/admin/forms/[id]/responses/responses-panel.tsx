"use client";

import { useMemo, useState } from "react";

import { ResponseViewer } from "@/app/admin/forms/[id]/responses/response-viewer";
import type { FormResponse, VSMForm } from "@/lib/supabase";

export function ResponsesPanel({
  form,
  responses,
}: {
  form: VSMForm;
  responses: FormResponse[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResponses = useMemo(() => {
    if (!searchQuery.trim()) return responses;
    const needle = searchQuery.trim().toLowerCase();

    return responses.filter((response) => {
      const rowValues = [response.submittedAt, ...Object.values(response.data)];
      return rowValues.some((value) => {
        if (typeof value === "string") return value.toLowerCase().includes(needle);
        if (typeof value === "number") return String(value).includes(needle);
        if (typeof value === "boolean") return String(value).toLowerCase().includes(needle);
        if (Array.isArray(value)) {
          return value.some((entry) =>
            String(entry).toLowerCase().includes(needle)
          );
        }
        return false;
      });
    });
  }, [responses, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="space-y-1 text-sm">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
              Search
            </span>
            <input
              className="vsm-input py-2"
              placeholder="Search any field or value"
              aria-label="Search responses"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
          <button className="rounded-[12px] border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-muted)] transition-colors hover:border-[color:rgba(232,100,10,0.22)] hover:text-[color:var(--color-saffron)]">
            Export Excel
          </button>
          <button className="rounded-[12px] border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-muted)] transition-colors hover:border-[color:rgba(232,100,10,0.22)] hover:text-[color:var(--color-saffron)]">
            Export PDF
          </button>
        </div>
      </div>

      <ResponseViewer form={form} responses={filteredResponses} />
    </div>
  );
}
