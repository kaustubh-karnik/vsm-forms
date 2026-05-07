import Link from "next/link";

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

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6">
      <div className="pattern-orb pattern-orb-top" aria-hidden />
      <div className="pattern-orb pattern-orb-bottom" aria-hidden />

      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6">

        {/* Header card */}
        <section className="fade-up fade-up-1 mx-auto w-full max-w-[540px] rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-6 py-8 text-center shadow-warm">
          <div className="relative mx-auto">
            <VsmLogo size={80} tone="warm" />
          </div>
          <h1 className="mt-4 font-serif text-[26px] leading-tight text-[color:var(--color-saffron)]">
            Vivekanand Seva Mandal
          </h1>
          <p className="mt-1.5 text-sm text-[color:var(--color-muted)]">
            Dombivli · Since 1991
          </p>
          <div className="mt-5">
            <SocialLinks />
          </div>
        </section>

        {/* Active initiatives */}
        <section className="fade-up fade-up-2 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 shadow-warm sm:p-5">
          <SectionDivider label="Active Initiatives" />

          {activeForms.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:rgba(232,100,10,0.07)]">
                <svg viewBox="0 0 64 64" fill="none" className="h-8 w-8" aria-hidden>
                  <ellipse cx="32" cy="32" rx="10" ry="16" stroke="#E8640A" strokeWidth="1.5" opacity="0.5" />
                  <ellipse cx="32" cy="32" rx="10" ry="16" stroke="#E8640A" strokeWidth="1.5" opacity="0.5" transform="rotate(60 32 32)" />
                  <ellipse cx="32" cy="32" rx="10" ry="16" stroke="#E8640A" strokeWidth="1.5" opacity="0.5" transform="rotate(-60 32 32)" />
                  <circle cx="32" cy="32" r="4" fill="#E8640A" opacity="0.4" />
                </svg>
              </div>
              <p className="font-serif text-lg text-[color:var(--color-dark)]">No active forms right now</p>
              <p className="text-sm text-[color:var(--color-muted)]">Check back soon for new initiatives.</p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {activeForms.map((form, index) => {
                const deadline = getDeadlineState(form.closingDate);
                const delayClass = index === 0 ? "fade-up-3" : index === 1 ? "fade-up-4" : "fade-up-5";

                return (
                  <article
                    key={form.id}
                    className={`fade-up ${delayClass} card-hover overflow-hidden rounded-[22px] border border-[color:var(--color-border)] bg-white`}
                  >
                    <div className="flex flex-col md:grid md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
                      <div className="border-b border-[color:var(--color-border)] md:border-b-0 md:border-r">
                        <div className="p-3 sm:p-4">
                          <FormCover
                            form={form}
                            poster
                            roundedClass="rounded-[16px]"
                            className="min-h-0 aspect-[4/5] max-h-[220px] shadow-warm ring-1 ring-[color:var(--color-border)] sm:max-h-[240px] md:max-h-[260px]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-4 p-4 md:p-5">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="font-serif text-[18px] leading-snug text-[color:var(--color-dark)]">
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

                        <Link
                          href={`/forms/${form.id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-[color:var(--color-saffron)] px-4 py-3 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(232,100,10,0.25)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[color:var(--color-saffron-dark)] hover:shadow-[0_4px_16px_rgba(232,100,10,0.35)]"
                        >
                          Register Now
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
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
          <section className="fade-up fade-up-3 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 shadow-warm sm:p-5">
            <details>
              <summary className="group cursor-pointer list-none">
                <div className="flex items-center justify-between gap-4">
                  <SectionDivider label="Closed Forms" className="m-0 flex-1" />
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-muted)] transition-colors group-hover:text-[color:var(--color-dark)]">
                    Show {closedForms.length} past
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden>
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </summary>

              <div className="mt-4 flex flex-col gap-3">
                {closedForms.map((form) => (
                  <article
                    key={form.id}
                    className="overflow-hidden rounded-[18px] border border-[color:var(--color-border)] bg-white opacity-80"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="border-b border-[color:var(--color-border)] sm:w-[30%] sm:border-b-0 sm:border-r">
                        <FormCover form={form} poster roundedClass="rounded-none" />
                      </div>
                      <div className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="font-serif text-base text-[color:var(--color-dark)]">
                              {form.title}
                            </h2>
                            <div className="mt-1">
                              <TeamBadge team={form.team} />
                            </div>
                          </div>
                          {getDeadlineState(form.closingDate) && (
                            <DeadlinePill deadline={getDeadlineState(form.closingDate)!} />
                          )}
                        </div>
                        <p className="text-sm text-[color:var(--color-muted)]">
                          {form.responseCount} responses received
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
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
