import { AdminCard, DashboardHeader } from "@/app/components/vsm-ui";

export default function SettingsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <DashboardHeader
          eyebrow="Admin / Settings"
          title="Settings"
          description="Manage your profile, team preferences, and notification settings."
        />

        <AdminCard>
          <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">Profile</h2>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">Your account details and preferences.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                Display Name
              </span>
              <input className="vsm-input" defaultValue="Admin" />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                Email
              </span>
              <input className="vsm-input" type="email" defaultValue="admin@vsmdombivli.org" />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="rounded-[12px] bg-[color:var(--color-saffron)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-[1px] hover:bg-[color:var(--color-saffron-dark)]">
              Save changes
            </button>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">Notifications</h2>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            Control when and how you receive form submission alerts.
          </p>
          <div className="mt-5 space-y-3">
            {[
              { label: "Email me on new submission", sublabel: "Receive an email for every new response" },
              { label: "Daily digest summary", sublabel: "One summary email each morning with yesterday's count" },
              { label: "Form closing reminders", sublabel: "Notify me 3 days before a form closes" },
            ].map((item) => (
              <label
                key={item.label}
                className="flex cursor-pointer items-start justify-between gap-4 rounded-[16px] border border-[color:var(--color-border)] bg-white px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-[color:var(--color-dark)]">{item.label}</p>
                  <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">{item.sublabel}</p>
                </div>
                <div className="relative mt-0.5 shrink-0">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="h-5 w-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-border)] transition-colors peer-checked:border-[color:var(--color-saffron)] peer-checked:bg-[color:var(--color-saffron)]" />
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            ))}
          </div>
        </AdminCard>
      </div>
    </main>
  );
}
