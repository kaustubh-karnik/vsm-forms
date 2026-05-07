import {
  AdminCard,
  BarChartCard,
  DashboardHeader,
  DonutChartCard,
  TeamAnalyticsTable,
} from "@/app/components/vsm-ui";
import { Breadcrumb } from "@/components/retroui/Breadcrumb";
import { getAnalytics } from "@/lib/supabase";

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

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
                <Breadcrumb.Page>Analytics</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <DashboardHeader
            eyebrow=""
            title="Team response analytics"
            description="High-level response trends stay visible without exposing another team's row-level data."
          />
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <BarChartCard data={analytics.monthlyResponses} />
          <DonutChartCard data={analytics.teamDistribution} />
        </div>

        <AdminCard>
          <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">
            Team overview
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            Team leads can inspect their own detailed rows. Super-admins can compare aggregate counts across all teams.
          </p>
          <div className="mt-5">
            <TeamAnalyticsTable rows={analytics.teamTable} />
          </div>
        </AdminCard>
      </div>
    </main>
  );
}
