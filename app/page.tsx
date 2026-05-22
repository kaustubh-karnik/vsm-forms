import Link from "next/link";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
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
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--color-cream)] px-4 py-12 sm:py-16">
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-8">
        
        {/* Logo & Branding Section */}
        <div className="flex flex-col items-center gap-3 text-center">
          <VsmLogo size={72} tone="warm" />
          <Text as="h1" className="text-2xl font-semibold leading-tight text-[color:var(--color-dark)]">
            Vivekanand Seva Mandal
          </Text>
          <Text as="p" className="text-sm text-[color:var(--color-dark)]">
            Dombivli · Since 1991
          </Text>
        </div>

        {/* Social Links */}
        <SocialLinks />

        {/* Active Initiatives Section */}
        <div className="w-full space-y-6">
          <SectionDivider label="Active Initiatives" className="justify-center" />
          
          <div className="space-y-4">
            {activeForms.length > 0 ? (
              activeForms.map((form) => (
                <Link key={form.id} href={`/forms/${form.id}`} className="block">
                  <Card className="block overflow-hidden rounded-[20px] border-2 border-[color:var(--color-border)] bg-white p-0 shadow-[4px_4px_0_0_var(--border)] transition-all duration-200 hover:shadow-[6px_6px_0_0_var(--border)] hover:translate-y-[-2px] active:shadow-none active:translate-y-[2px]">
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(140px,38%)_1fr] md:items-stretch">
                      {/* Left: poster fills column height on desktop, fixed aspect on mobile */}
                      <div className="relative aspect-[4/5] w-full max-h-[280px] md:aspect-auto md:h-full md:max-h-none md:min-h-[160px]">
                        <FormCover
                          form={form}
                          poster={true}
                          roundedClass="rounded-t-[18px] md:rounded-l-[18px] md:rounded-tr-none md:rounded-br-none"
                          className="absolute inset-0 h-full w-full"
                          showOverlay={false}
                        />
                      </div>

                      {/* Right: Details */}
                      <div className="flex flex-col gap-3 p-4 md:p-5 justify-between">
                        <div className="space-y-1">
                          <Text as="h2" className="text-lg font-semibold leading-tight text-[color:var(--color-dark)]">
                            {form.title}
                          </Text>
                          <Text as="p" className="line-clamp-3 text-sm text-[color:var(--color-dark)]">
                            {form.description}
                          </Text>
                        </div>

                        {/* Team Badge & Deadline */}
                        <div className="flex items-center justify-between gap-2">
                          <TeamBadge team={form.team} />
                          {form.closingDate && getDeadlineState(form.closingDate) && (
                            <DeadlinePill deadline={getDeadlineState(form.closingDate)!} />
                          )}
                        </div>

                        {/* CTA Button */}
                        <div className="mt-3 md:mt-2">
                          <Button
                            variant="default"
                            size="md"
                            className="w-full justify-between"
                            asChild
                          >
                            <span>
                              Register Now
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="block rounded-[20px] border-2 border-[color:var(--color-border)] bg-white p-6 text-center shadow-[4px_4px_0_0_var(--border)]">
                <Text as="p" className="text-[color:var(--color-muted)]">
                  No active forms at the moment. Check back soon!
                </Text>
              </Card>
            )}
          </div>
        </div>

        {/* Closed Forms Section - Collapsible */}
        {closedForms.length > 0 && (
          <div className="w-full space-y-4">
            <SectionDivider label="Past Forms" className="justify-center" />
            <details className="group">
              <summary className="flex cursor-pointer select-none items-center justify-center gap-2 rounded-[16px] border-2 border-[color:var(--color-border)] bg-white px-6 py-3 shadow-[3px_3px_0_0_var(--border)] transition-all hover:shadow-[4px_4px_0_0_var(--border)]">
                <Text as="span" className="font-semibold text-[color:var(--color-dark)]">
                  Show {closedForms.length} closed form{closedForms.length !== 1 ? "s" : ""}
                </Text>
                <svg 
                  className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              
              <div className="mt-4 space-y-3">
                {closedForms.map((form) => (
                  <Link key={form.id} href={`/forms/${form.id}`} className="block">
                    <Card className="block rounded-[16px] border-2 border-[color:var(--color-border)] bg-white p-4 shadow-[3px_3px_0_0_var(--border)] transition-all duration-200 hover:shadow-[4px_4px_0_0_var(--border)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <Text as="h3" className="font-semibold text-[color:var(--color-dark)]">
                            {form.title}
                          </Text>
                          <Text as="p" className="text-xs text-[color:var(--color-muted)]">
                            {form.team}
                          </Text>
                        </div>
                        <span className="text-xs font-semibold text-[color:var(--color-muted)]">
                          Closed
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[color:var(--color-border)] pt-6 text-center">
          <Text as="p" className="text-xs text-[color:var(--color-dark)]">
            Made with ♥ for VSM
          </Text>
        </div>
      </div>
    </main>
  );
}
