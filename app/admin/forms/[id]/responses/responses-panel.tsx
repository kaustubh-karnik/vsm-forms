"use client";

import { useMemo, useState, useTransition } from "react";

import { ResponseViewer } from "@/app/admin/forms/[id]/responses/response-viewer";
import {
  exportResponsesToExcel,
  exportResponsesToPdf,
} from "@/lib/export-responses";
import type { FormResponse, VSMForm } from "@/lib/supabase";

export function ResponsesPanel({
  form,
  responses,
}: {
  form: VSMForm;
  responses: FormResponse[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, startExport] = useTransition();

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
    <div className="min-w-0 space-y-6">
      <div className="grid gap-4 rounded-[16px] border-2 border-black bg-[color:var(--color-card)] p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end shadow-[4px_4px_0_0_#000]">
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:justify-end lg:gap-3">
          <button
            type="button"
            disabled={filteredResponses.length === 0 || isExporting}
            onClick={() => {
              startExport(async () => {
                await exportResponsesToExcel(form, filteredResponses);
              });
            }}
            className="w-full rounded-[10px] border-2 border-black bg-[color:var(--color-cream)] px-4 py-2.5 text-sm font-bold text-[color:var(--color-dark)] shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000] active:translate-y-0 active:shadow-none hover:text-[color:var(--color-saffron)] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            Export Excel
          </button>
          <button
            type="button"
            disabled={filteredResponses.length === 0 || isExporting}
            onClick={() => {
              startExport(async () => {
                await exportResponsesToPdf(form, filteredResponses);
              });
            }}
            className="w-full rounded-[10px] border-2 border-black bg-[color:var(--color-cream)] px-4 py-2.5 text-sm font-bold text-[color:var(--color-dark)] shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000] active:translate-y-0 active:shadow-none hover:text-[color:var(--color-saffron)] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            Export PDF
          </button>
        </div>
      </div>

      <ResponseViewer form={form} responses={filteredResponses} />
    </div>
  );
}
