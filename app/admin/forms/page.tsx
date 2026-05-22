import Link from "next/link";

import { AdminCard, DashboardHeader, FormListRow } from "@/app/components/vsm-ui";
import { Alert } from "@/components/retroui/Alert";
import { Breadcrumb } from "@/components/retroui/Breadcrumb";
import { getAllForms } from "@/lib/supabase";

export default async function AdminFormsPage() {
  const forms = await getAllForms();
  const active = forms.filter((f) => f.status === "active");
  const drafts = forms.filter((f) => f.status === "draft");
  const closed = forms.filter((f) => f.status === "closed");

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <header className="fade-up fade-up-1 space-y-3">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/admin">Dashboard</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Forms</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <DashboardHeader
            eyebrow=""
            title="All Forms"
            description="Manage active, draft, and closed initiatives. Click Edit to modify fields or Publish to make a form live."
          />
        </header>

        <AdminCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">Active Forms</h2>
            <Link
              href="/admin/forms/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-black bg-[color:var(--color-saffron)] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[4px_4px_0_0_#000] active:translate-y-px active:shadow-none"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path fillRule="evenodd" d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z" clipRule="evenodd" />
              </svg>
              New Form
            </Link>
          </div>

          {active.length === 0 ? (
            <div className="mt-5">
              <Alert className="rounded-[16px]">
                <Alert.Title>No active forms</Alert.Title>
                <Alert.Description>
                  Create a new form and publish it to see it here.
                </Alert.Description>
              </Alert>
            </div>
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
