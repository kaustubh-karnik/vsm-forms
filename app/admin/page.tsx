import Link from "next/link";

import { AdminCard, FormListRow, StatsCard } from "@/app/components/vsm-ui";
import { Breadcrumb } from "@/components/retroui/Breadcrumb";
import { getAllForms } from "@/lib/supabase";

function getGreeting() {
  const hour = new Date().getUTCHours() + 5.5; // IST offset
  const h = Math.floor(hour) % 24;
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  const forms = await getAllForms();

  const totalForms = forms.length;
  const totalResponses = forms.reduce((sum, form) => sum + form.responseCount, 0);
  const activeForms = forms.filter((form) => form.status === "active").length;
  const closedForms = forms.filter((form) => form.status === "closed").length;

  const greeting = getGreeting();

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">

        {/* Greeting header */}
        <header className="fade-up fade-up-1 space-y-3">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/">Public site</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Dashboard</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <h1 className="font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight text-[color:var(--color-dark)]">
            {greeting} 🙏
          </h1>
          <p className="text-sm leading-6 text-[color:var(--color-muted)]">
            Here's a live snapshot of your forms, responses, and team activity.
          </p>
        </header>

        {/* Stats row */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="Total Forms" value={totalForms} />
          <StatsCard label="Responses" value={totalResponses} />
          <StatsCard label="Active" value={activeForms} />
          <StatsCard label="Closed" value={closedForms} />
        </section>

        {/* Forms list */}
        <AdminCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">My Forms</h2>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                Active, draft, and closed initiatives across all teams.
              </p>
            </div>
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

          <div className="mt-5 space-y-4">
            {forms.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-[color:var(--color-border)] py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:rgba(232,100,10,0.07)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-[color:var(--color-saffron)]" aria-hidden>
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="font-serif text-lg text-[color:var(--color-dark)]">No forms yet</p>
                <p className="text-sm text-[color:var(--color-muted)]">Create your first initiative to get started.</p>
              </div>
            ) : (
              forms.map((form) => <FormListRow key={form.id} form={form} />)
            )}
          </div>
        </AdminCard>
      </div>
    </main>
  );
}
