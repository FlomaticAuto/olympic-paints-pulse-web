import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/", label: "Leaderboard" },
  { href: "/scorecard/latest", label: "Bi-weekly Scorecard" },
  { href: "/daily/latest/AC", label: "Daily — Aboo Cassim" },
  { href: "/daily/latest/AP", label: "Daily — Amit Patel" },
  { href: "/daily/latest/BV", label: "Daily — Bhadresh Vallabh" },
  { href: "/daily/latest/NP", label: "Daily — Nikhil Panchal" },
  { href: "/daily/latest/BM", label: "Daily — Byron Minnie" },
];

export default function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid" style={{ gridTemplateColumns: "260px 1fr" }}>
      {/* Sidebar */}
      <aside
        className="sticky top-0 self-start h-dvh flex flex-col border-r"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[var(--color-y400)]">
            <Image
              src="/logo.jpg"
              alt="Olympic Paints"
              width={48}
              height={48}
              sizes="48px"
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="min-w-0">
            <div
              className="font-[family-name:var(--font-display)] font-black text-xl uppercase tracking-wide leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              PULSE
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              Olympic Paints
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-3 border-t text-[11px]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-tertiary)" }}>
          Reply to your PULSE email with questions
        </div>
      </aside>

      {/* Main content — multi-column grid friendly */}
      <main className="px-8 py-8 max-w-[1280px] w-full">{children}</main>
    </div>
  );
}
