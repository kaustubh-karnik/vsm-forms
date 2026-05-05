import Link from "next/link";

import { AdminCard, DashboardHeader, FormListRow, TeamBadge } from "@/app/components/vsm-ui";
import { getAllForms } from "@/lib/supabase";

export default async function AdminFormsPage() {
  const forms = await getAllForms();
  const active = forms.filter((f) => f.status === "active");
  const drafts = forms.filter((f) => f.status === "draft");
  const closed = forms.filter((f) => f.status === "closed");

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <DashboardHeader
          eyebrow="Admin / My Forms"
          title="All Forms"
          description="Manage active, draft, and closed initiatives. Click Edit to modify fields or Publish to make a form live."
        />

        <AdminCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">Active Forms</h2>
            <Link
              href="/admin/forms/new"
              className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[color:var(--color-saffron)] px-4 py-3 text-sm font-semibold text-white shadow-warm transition-all hover:-translate-y-[1px] hover:bg-[color:var(--color-saffron-dark)]"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path fillRule="evenodd" d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z" clipRule="evenodd" />
              </svg>
              New Form
            </Link>
          </div>

          {active.length === 0 ? (
            <EmptyState message="No active forms yet." />
          ) : (
            <div className="mt-5 space-y-4">
              {active.map((form) => <FormListRow key={form.id} form={form} />)}
            </div>
          )}
        </AdminCard>

        {drafts.length > 0 && (
          <AdminCard>
            <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">Drafts</h2>
            <div className="mt-5 space-y-4">
              {drafts.map((form) => <FormListRow key={form.id} form={form} />)}
            </div>
          </AdminCard>
        )}

        {closed.length > 0 && (
          <AdminCard>
            <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">Closed</h2>
            <div className="mt-5 space-y-4">
              {closed.map((form) => <FormListRow key={form.id} form={form} />)}
            </div>
          </AdminCard>
        )}
      </div>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-5 flex flex-col items-center gap-4 rounded-[20px] border border-dashed border-[color:var(--color-border)] py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:rgba(232,100,10,0.07)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-[color:var(--color-saffron)]" aria-hidden>
          <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-sm text-[color:var(--color-muted)]">{message}</p>
    </div>
  );
}
