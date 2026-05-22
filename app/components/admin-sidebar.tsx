"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
        <path d="M2 4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4zm0 7a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5zM2 13a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2z" />
      </svg>
    ),
  },
  {
    href: "/admin/forms",
    label: "Forms",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
        <path d="M9 4.804A7.968 7.968 0 0 0 5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0 1 5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0 1 15 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0 0 15 4a7.968 7.968 0 0 0-4.5 1.385V8.25a.75.75 0 0 1-1.5 0V4.804z" />
      </svg>
    ),
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
        <path d="M2 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5zm6-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7zm6-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4z" />
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1 2.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 0 1 2.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 0 1 .947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 0 1-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 0 1-2.287-.947zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  return (
    <nav className="mt-8 grid gap-1.5">
      {NAV_ITEMS.map((item) => (
        <AdminNavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
      ))}
    </nav>
  );
}

function AdminNavItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-[12px] border-2 px-4 py-2.5 text-sm font-bold transition-all duration-150 hover:-translate-y-[1px] active:translate-y-0 ${
        active
          ? "border-black bg-[color:var(--color-saffron)] text-white shadow-[2px_2px_0_0_#000]"
          : "border-transparent text-muted-foreground hover:border-black hover:bg-[color:var(--color-cream)] hover:text-[color:var(--color-dark)] hover:shadow-[2px_2px_0_0_#000]"
      }`}
    >
      <span className={active ? "text-white" : "text-muted-foreground group-hover:text-[color:var(--color-dark)]"}>{icon}</span>
      {label}
    </Link>
  );
}
