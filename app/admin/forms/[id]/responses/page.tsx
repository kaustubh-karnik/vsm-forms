import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AdminCard, DashboardHeader, TeamBadge } from "@/app/components/vsm-ui";
import { ResponsesPanel } from "@/app/admin/forms/[id]/responses/responses-panel";
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

        <AdminCard className="min-w-0 space-y-6 overflow-hidden">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <TeamBadge team={form.team} />
              <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-1 text-xs font-semibold text-[color:var(--color-muted)]">
                {responses.length} {responses.length === 1 ? "response" : "responses"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted)]">
              <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--color-saffron)]" aria-hidden />
              Live submissions feed
            </div>
          </div>

          <Suspense fallback={<div className="h-48 animate-pulse rounded-[20px] bg-[color:var(--color-border)]" />}>
            <ResponsesPanel form={form} responses={responses} />
          </Suspense>
        </AdminCard>
      </div>
    </main>
  );
}
