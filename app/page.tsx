import Link from "next/link";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { CopyLinkButton } from "@/app/components/copy-link-button";
import {
  DeadlinePill,
  FormCover,
  SectionDivider,
  SocialLinks,
  TeamBadge,
  VsmLogo,
  getDeadlineState,
} from "@/app/components/vsm-ui";
import { getAllForms } from "@/lib/supabase";

export default async function Home() {
  const forms = await getAllForms();
  const activeForms = forms.filter((form) => form.status === "active");
  const closedForms = forms.filter((form) => form.status === "closed");
  const totalResponses = forms.reduce((sum, form) => sum + form.responseCount, 0);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="pattern-orb pattern-orb-top" aria-hidden />
      <div className="pattern-orb pattern-orb-bottom" aria-hidden />

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <Card className="block rounded-[28px] border-2 border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 shadow-[6px_6px_0_0_var(--border)] sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 rounded-full border-2 border-[color:var(--color-border)] bg-white px-3 py-2 shadow-[3px_3px_0_0_var(--border)]">
                  <VsmLogo size={48} tone="warm" />
                  <div>
                    <Text as="p" className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                      Vivekanand Seva Mandal
                    </Text>
                    <Text as="p" className="text-sm text-[color:var(--color-dark)]">
                      Dombivli · Since 1991
                    </Text>
                  </div>
                </div>

                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin dashboard</Link>
                </Button>
              </div>

              <div className="space-y-3">
                <Text as="h1" className="max-w-2xl text-[clamp(2.3rem,6vw,4.5rem)] leading-[0.96] text-[color:var(--color-dark)]">
                  Forms for community action, built with a bold retro edge.
                </Text>
                <Text as="p" className="max-w-2xl text-base leading-7 text-[color:var(--color-muted)] sm:text-lg">
                  Discover active initiatives, share details with a single click, and register from any device with a clean, high-contrast experience.
                </Text>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#active-initiatives">Browse active forms</a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="#closed-forms">View past forms</a>
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { label: "Active forms", value: activeForms.length },
              { label: "Closed forms", value: closedForms.length },
              { label: "Total responses", value: totalResponses },
              { label: "Teams represented", value: new Set(forms.map((form) => form.team)).size },
            ].map((item) => (
              <Card
                key={item.label}
                className="block rounded-[24px] border-2 border-[color:var(--color-border)] bg-white p-5 shadow-[4px_4px_0_0_var(--border)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                  {item.label}
                </p>
                <p className="mt-3 text-4xl leading-none text-[color:var(--color-dark)]">
                  {item.value}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Active initiatives */}
        <section id="active-initiatives" className="fade-up fade-up-2 rounded-[28px] border-2 border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 shadow-[6px_6px_0_0_var(--border)] sm:p-5">
          <SectionDivider label="Active Initiatives" />

          {activeForms.length === 0 ? (
            <Card className="mt-6 block rounded-[24px] border-2 border-dashed border-[color:var(--color-border)] bg-white p-8 text-center shadow-[4px_4px_0_0_var(--border)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[color:var(--color-border)] bg-[color:rgba(232,100,10,0.07)]">
                <svg viewBox="0 0 64 64" fill="none" className="h-8 w-8" aria-hidden>
                  <ellipse cx="32" cy="32" rx="10" ry="16" stroke="#E8640A" strokeWidth="1.5" opacity="0.5" />
                  <ellipse cx="32" cy="32" rx="10" ry="16" stroke="#E8640A" strokeWidth="1.5" opacity="0.5" transform="rotate(60 32 32)" />
                  <ellipse cx="32" cy="32" rx="10" ry="16" stroke="#E8640A" strokeWidth="1.5" opacity="0.5" transform="rotate(-60 32 32)" />
                  <circle cx="32" cy="32" r="4" fill="#E8640A" opacity="0.4" />
                </svg>
              </div>
              <p className="mt-4 text-lg text-[color:var(--color-dark)]">No active forms right now</p>
              <p className="text-sm text-[color:var(--color-muted)]">Check back soon for new initiatives.</p>
            </Card>
          ) : (
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {activeForms.map((form) => {
                const deadline = getDeadlineState(form.closingDate);

                return (
                  <article
                    key={form.id}
                    className="fade-up card-hover overflow-hidden rounded-[22px] border-2 border-[color:var(--color-border)] bg-white shadow-[4px_4px_0_0_var(--border)]"
                  >
                    <div className="flex flex-col md:grid md:grid-cols-[minmax(0,230px)_minmax(0,1fr)]">
                      <div className="border-b-2 border-[color:var(--color-border)] md:border-b-0 md:border-r-2">
                        <div className="p-3 sm:p-4">
                          <FormCover
                            form={form}
                            poster
                            roundedClass="rounded-[16px]"
                            className="min-h-0 aspect-[4/5] max-h-[220px] border-2 border-[color:var(--color-border)] shadow-[4px_4px_0_0_var(--border)] sm:max-h-[240px] md:max-h-[260px]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-4 p-4 md:p-5 lg:p-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="text-[18px] leading-snug text-[color:var(--color-dark)]">
                                {form.title}
                              </h2>
                              <div className="mt-2">
                                <TeamBadge team={form.team} />
                              </div>
                            </div>
                            <CopyLinkButton path={`/forms/${form.id}`} />
                          </div>

                          <p className="line-clamp-3 text-sm leading-6 text-[color:var(--color-muted)]">
                            {form.description}
                          </p>

                          {deadline ? <DeadlinePill deadline={deadline} /> : null}
                        </div>

                        <Button asChild size="lg" className="w-full">
                          <Link href={`/forms/${form.id}`}>
                            Register now
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Closed forms */}
        {closedForms.length > 0 && (
          <section id="closed-forms" className="fade-up fade-up-3 rounded-[28px] border-2 border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 shadow-[6px_6px_0_0_var(--border)] sm:p-5">
            <details open>
              <summary className="list-none cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <SectionDivider label="Closed Forms" className="m-0 flex-1" />
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-muted)]">
                    {closedForms.length} past forms
                  </span>
                </div>
              </summary>

              <div className="mt-4 grid gap-3">
                {closedForms.map((form) => {
                  const deadline = getDeadlineState(form.closingDate);

                  return (
                    <article
                      key={form.id}
                      className="overflow-hidden rounded-[18px] border-2 border-[color:var(--color-border)] bg-white opacity-90 shadow-[3px_3px_0_0_var(--border)]"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="border-b-2 border-[color:var(--color-border)] sm:w-[32%] sm:border-b-0 sm:border-r-2">
                          <FormCover form={form} poster roundedClass="rounded-none" />
                        </div>
                        <div className="space-y-2 p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h2 className="text-base text-[color:var(--color-dark)]">
                                {form.title}
                              </h2>
                              <div className="mt-1">
                                <TeamBadge team={form.team} />
                              </div>
                            </div>
                            {deadline ? <DeadlinePill deadline={deadline} /> : null}
                          </div>
                          <p className="text-sm text-[color:var(--color-muted)]">
                            {form.responseCount} responses received
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </details>
          </section>
        )}

        <footer className="fade-up fade-up-4 pb-4 text-center">
          <p className="text-xs text-[color:var(--color-muted)]">
            Made with ♥ for{" "}
            <span className="inline-flex items-center gap-1.5 align-middle">
              <VsmLogo size={18} tone="neutral" shadow={false} />
              <span className="sr-only">VSM</span>
            </span>
            {" "}· Dombivli
          </p>
          <Link
            href="/admin"
            className="mt-2 inline-block text-[11px] text-[color:rgba(107,91,69,0.45)] transition-colors hover:text-[color:var(--color-muted)]"
          >
            Admin →
          </Link>
        </footer>
      </div>
    </main>
  );
}
