import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
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
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const NAV: NavItem[] = [
  { href: "/", label: "Leaderboard", icon: <IconBoard /> },
  { href: "/scorecard/latest", label: "Scorecard", icon: <IconChart /> },
  { href: "/daily/latest/AC", label: "Daily", icon: <IconUser /> },
];

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--surface-page)" }}>
      {/* Top app bar */}
      <header
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[var(--color-y400)]">
          <Image
            src="/logo.jpg"
            alt="Olympic Paints"
            width={40}
            height={40}
            sizes="40px"
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-[family-name:var(--font-display)] font-black text-base uppercase tracking-wide truncate"
            style={{ color: "var(--text-primary)" }}
          >
            PULSE
          </div>
          <div
            className="text-[11px] truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            Olympic Paints — live sales
          </div>
        </div>
      </header>

      {/* Page content — stacked, full-width, bottom padding clears nav */}
      <main className="flex-1 w-full px-3 py-4 pb-24">{children}</main>

      {/* Bottom navigation — 44px+ tap targets, safe-area aware */}
      <nav
        className="fixed bottom-0 inset-x-0 z-30 grid border-t pb-[env(safe-area-inset-bottom)]"
        style={{
          gridTemplateColumns: `repeat(${NAV.length}, minmax(0, 1fr))`,
          background: "var(--surface-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-[11px] font-medium transition-colors active:bg-black/20"
            style={{ color: "var(--text-secondary)" }}
          >
            <span style={{ color: "var(--text-primary)" }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
