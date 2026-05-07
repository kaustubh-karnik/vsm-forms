"use client";

import Link from "next/link";
import { useState } from "react";

import { Drawer } from "@/components/retroui/Drawer";
import { AdminSidebar } from "@/app/components/admin-sidebar";
import { VsmLogo } from "@/app/components/vsm-ui";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] bg-[color:rgba(255,250,243,0.95)] px-4 py-3 lg:hidden">
      <Drawer direction="left" open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <button
            className="rounded-[10px] border border-[color:var(--color-border)] p-2 text-[color:var(--color-muted)] transition-colors hover:border-[color:rgba(232,100,10,0.3)] hover:text-[color:var(--color-saffron)]"
            aria-label="Open navigation"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </Drawer.Trigger>

        <Drawer.Content className="bg-[color:var(--color-card)]">
          <div className="flex h-full flex-col p-5">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <VsmLogo size={40} tone="warm" />
                <div>
                  <p className="font-serif text-base leading-tight text-[color:var(--color-saffron)]">VSM Admin</p>
                  <p className="text-[11px] text-[color:var(--color-muted)]">Vivekanand Seva Mandal</p>
                </div>
              </Link>
              <Drawer.Close asChild>
                <button
                  className="rounded-[10px] border border-[color:var(--color-border)] p-2 text-[color:var(--color-muted)]"
                  aria-label="Close navigation"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </Drawer.Close>
            </div>

            <div onClick={() => setOpen(false)}>
              <AdminSidebar />
            </div>

            <div className="mt-auto pt-6">
              <div className="h-px bg-[color:var(--color-border)]" />
              <Link
                href="/"
                className="mt-4 flex items-center gap-2 text-xs font-medium text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-saffron)]"
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View public site
              </Link>
            </div>
          </div>
        </Drawer.Content>
      </Drawer>

      <Link href="/admin" className="flex items-center gap-2">
        <VsmLogo size={32} tone="warm" />
        <span className="font-serif text-base text-[color:var(--color-saffron)]">Admin</span>
      </Link>
    </div>
  );
}
