import Link from "next/link";
import { REP_NAMES, type RepCode, getLeaderboard, formatMoney, formatPct } from "@/lib/data";

const REP_ORDER: RepCode[] = ["AC", "AP", "BV", "NP", "BM"];

export default async function RepsIndexPage() {
  const { rows } = await getLeaderboard();
  const byRep = new Map(rows.map((r) => [r.rep, r]));

  return (
    <div className="space-y-6">
      <header>
        <h1
          className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl uppercase tracking-wide"
          style={{ color: "var(--text-primary)" }}
        >
          Daily — Pick a Rep
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Tap a rep to open their daily PULSE.
        </p>
      </header>

      <ul className="space-y-2">
        {REP_ORDER.map((rep) => {
          const row = byRep.get(rep);
          return (
            <li key={rep}>
              <Link
                href={`/daily/latest/${rep}`}
                className="block rounded-xl border-l-4 transition-colors active:bg-black/20"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border-subtle)",
                  borderLeftColor: "var(--brand-primary)",
                }}
              >
                <div className="flex items-center justify-between gap-3 px-4 py-4">
                  <div className="min-w-0">
                    <div
                      className="font-[family-name:var(--font-display)] font-black text-xl uppercase tracking-wide leading-none"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {rep}
                    </div>
                    <div className="text-sm truncate mt-1" style={{ color: "var(--text-secondary)" }}>
                      {REP_NAMES[rep]}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {row ? (
                      <>
                        <div
                          className="font-[family-name:var(--font-display)] font-bold text-base whitespace-nowrap"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatMoney(row.mtd_sales)}
                        </div>
                        <div className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                          {formatPct(row.pct_target)} of target
                        </div>
                      </>
                    ) : (
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        No data
                      </div>
                    )}
                  </div>
                  <span
                    aria-hidden
                    className="text-2xl shrink-0"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    ›
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <footer className="text-center text-xs pt-4 pb-2" style={{ color: "var(--text-tertiary)" }}>
        Olympic Paints PULSE · Reply to your daily PULSE email with questions.
      </footer>
    </div>
  );
}
