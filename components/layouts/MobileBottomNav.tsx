"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
  icon: ReactNode;
  external?: boolean;
};

function IconBoard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 3h7v7H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 14h7v7H3z" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-7" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Leaderboard",
    match: (p) => p === "/",
    icon: <IconBoard />,
  },
  {
    href: "/scorecard/latest",
    label: "Scorecard",
    match: (p) => p.startsWith("/scorecard"),
    icon: <IconChart />,
  },
  {
    href: "/reps",
    label: "Reps",
    match: (p) => p === "/reps" || p.startsWith("/daily"),
    icon: <IconUsers />,
  },
  {
    href: "https://op-merch-calendar.vercel.app/",
    label: "Merch",
    match: () => false,
    icon: <IconCalendar />,
    external: true,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname() || "/";
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 grid border-t pb-[env(safe-area-inset-bottom)]"
      style={{
        gridTemplateColumns: `repeat(${NAV.length}, minmax(0, 1fr))`,
        background: "var(--surface-elevated)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {NAV.map((item) => {
        const active = item.match(pathname);
        const sharedProps = {
          key: item.href,
          "aria-current": active ? ("page" as const) : undefined,
          className: "flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-[11px] font-medium transition-colors active:bg-black/20",
          style: { color: active ? "var(--brand-primary)" : "var(--text-secondary)" },
        };
        const inner = (
          <>
            <span style={{ color: active ? "var(--brand-primary)" : "var(--text-primary)" }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </>
        );
        return item.external ? (
          <a {...sharedProps} href={item.href} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : (
          <Link {...sharedProps} href={item.href}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
