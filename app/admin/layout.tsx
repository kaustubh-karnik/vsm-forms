import Link from "next/link";

import { AdminSidebar } from "@/app/components/admin-sidebar";
import { VsmLogo } from "@/app/components/vsm-ui";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--color-cream)] text-[color:var(--color-dark)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="shrink-0 border-b border-[color:var(--color-border)] bg-[color:rgba(255,250,243,0.95)] lg:w-[260px] lg:border-b-0 lg:border-r">
          <div className="sticky top-0 flex h-full flex-col p-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <VsmLogo size={44} tone="warm" />
              <div>
                <p className="font-serif text-[17px] leading-tight text-[color:var(--color-saffron)]">
                  <span className="inline-flex items-center gap-2">
                    <VsmLogo size={18} tone="warm" shadow={false} />
                    <span>Admin</span>
                  </span>
                </p>
                <p className="text-[11px] text-[color:var(--color-muted)]">Vivekanand Seva Mandal</p>
              </div>
            </Link>

            <AdminSidebar />

            {/* Bottom divider + back link */}
            <div className="mt-auto pt-6">
              <div className="h-px bg-[color:var(--color-border)]" />
              <Link
                href="/"
                className="mt-4 flex items-center gap-2 text-xs font-medium text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-saffron)]"
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
