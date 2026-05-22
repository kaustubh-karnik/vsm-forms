"use client";

import { useState } from "react";

import { AdminCard, DashboardHeader } from "@/app/components/vsm-ui";
import { Breadcrumb } from "@/components/retroui/Breadcrumb";
import { Switch } from "@/components/retroui/Switch";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    onSubmission: true,
    dailyDigest: true,
    closingReminders: false,
  });

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
                <Breadcrumb.Page>Settings</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <DashboardHeader
            eyebrow=""
            title="Settings"
            description="Manage your profile, team preferences, and notification settings."
          />
        </header>

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
            <button className="rounded-[10px] border-2 border-black bg-[color:var(--color-saffron)] px-5 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[4px_4px_0_0_#000] active:translate-y-0 active:shadow-none">
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
              {
                key: "onSubmission" as const,
                label: "Email me on new submission",
                sublabel: "Receive an email for every new response",
              },
              {
                key: "dailyDigest" as const,
                label: "Daily digest summary",
                sublabel: "One summary email each morning with yesterday's count",
              },
              {
                key: "closingReminders" as const,
                label: "Form closing reminders",
                sublabel: "Notify me 3 days before a form closes",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-[12px] border-2 border-black bg-[color:var(--color-card)] px-4 py-3.5 shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000]"
              >
                <div>
                  <p className="text-sm font-medium text-[color:var(--color-dark)]">{item.label}</p>
                  <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">{item.sublabel}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                  }
                  aria-label={item.label}
                />
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </main>
  );
}
