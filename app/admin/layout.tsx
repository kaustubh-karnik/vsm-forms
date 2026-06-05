import Link from "next/link";

import { AdminSidebar } from "@/app/components/admin-sidebar";

// Always fetch fresh form/response counts — never serve a stale static snapshot.
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { AdminMobileNav } from "@/app/components/admin-mobile-nav";
import { VsmLogo } from "@/app/components/vsm-ui";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent text-[color:var(--color-dark)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        {/* Mobile top nav (hamburger + drawer) */}
        <AdminMobileNav />

        {/* Desktop sidebar */}
        <aside className="hidden shrink-0 border-r-2 border-black bg-[color:var(--color-card)]/90 backdrop-blur-md lg:flex lg:w-[260px]">
          <div className="sticky top-0 flex h-screen w-full flex-col p-5">
            <Link href="/" className="group flex items-center gap-3">
              <VsmLogo size={44} tone="warm" />
              <div>
                <p className="font-serif text-[17px] leading-tight text-[color:var(--color-saffron)]">
                  VSM Admin
                </p>
                <p className="text-[11px] font-semibold text-muted-foreground">Vivekanand Seva Mandal</p>
              </div>
            </Link>

            <AdminSidebar />

            <div className="mt-auto pt-6">
              <div className="h-[2px] bg-black" />
              <Link
                href="/"
                className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-[color:var(--color-saffron)]"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View public site
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
