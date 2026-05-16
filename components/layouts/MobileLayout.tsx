import Image from "next/image";
import type { ReactNode } from "react";
import MobileBottomNav from "@/components/layouts/MobileBottomNav";

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--surface-page)" }}>
      {/* Top app bar — safe-area-top so the notch doesn't crash the logo */}
      <header
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border-subtle)",
          paddingTop: "calc(0.75rem + env(safe-area-inset-top))",
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

      {/* Bottom navigation (client component for active-route highlight) */}
      <MobileBottomNav />
    </div>
  );
}
