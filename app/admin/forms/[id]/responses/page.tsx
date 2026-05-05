import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AdminCard, DashboardHeader, TeamBadge } from "@/app/components/vsm-ui";
import { ResponseViewer } from "@/app/admin/forms/[id]/responses/response-viewer";
import { getFormById, getFormResponses } from "@/lib/supabase";

export default async function ResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getFormById(id);

  if (!form) {
    notFound();
  }

  const responses = await getFormResponses(form.id);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <DashboardHeader
          eyebrow="Admin / Responses"
          title={`${form.title}`}
          description="Review submissions in a spreadsheet-style table. Click any row to inspect the full submission."
        />

        <AdminCard>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <TeamBadge team={form.team} />
              <span className="text-sm text-[color:var(--color-muted)]">
                {responses.length} {responses.length === 1 ? "response" : "responses"}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <input className="vsm-input max-w-[220px] py-2" placeholder="Search by name…" />
              <input className="vsm-input w-[160px] py-2" type="date" />
              <input className="vsm-input w-[160px] py-2" type="date" />
              <button className="rounded-[12px] border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-muted)] transition-colors hover:border-[color:rgba(232,100,10,0.22)] hover:text-[color:var(--color-saffron)]">
                Export Excel
              </button>
              <button className="rounded-[12px] border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-muted)] transition-colors hover:border-[color:rgba(232,100,10,0.22)] hover:text-[color:var(--color-saffron)]">
                Export PDF
              </button>
            </div>
          </div>

          <Suspense fallback={<div className="h-48 animate-pulse rounded-[20px] bg-[color:var(--color-border)]" />}>
            <ResponseViewer form={form} responses={responses} />
          </Suspense>
        </AdminCard>
      </div>
    </main>
  );
}
