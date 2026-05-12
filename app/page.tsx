import { getLeaderboard, formatMoney, formatPct, type LeaderboardRow } from "@/lib/data";

function rankTone(rank: number, total: number): { row: string; rank: string; accent: string } {
  if (rank <= 2) {
    return {
      row: "bg-[color-mix(in_srgb,var(--color-teal)_18%,transparent)]",
      rank: "text-[#7AC97A]",
      accent: "border-l-[var(--color-teal)]",
    };
  }
  if (rank >= Math.max(3, total - 1)) {
    return {
      row: "bg-[color-mix(in_srgb,var(--color-coral)_18%,transparent)]",
      rank: "text-[#FF8585]",
      accent: "border-l-[var(--color-coral)]",
    };
  }
  return { row: "", rank: "", accent: "border-l-transparent" };
}

function RepCard({ row, rank, total }: { row: LeaderboardRow; rank: number; total: number }) {
  const tone = rankTone(rank, total);
  return (
    <li
      className={`rounded-xl border-l-4 ${tone.accent} ${tone.row}`}
      style={{ background: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className={`font-[family-name:var(--font-display)] font-black text-2xl ${tone.rank}`}
                style={{ color: tone.rank ? undefined : "var(--text-primary)" }}>
            #{rank}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-base truncate" style={{ color: "var(--text-primary)" }}>
              {row.name}
            </div>
            <div className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
              {row.rep} · streak {row.ack_streak}d · plan {formatPct(row.plan_adherence)}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-[family-name:var(--font-display)] font-bold text-base whitespace-nowrap"
               style={{ color: "var(--text-primary)" }}>
            {formatMoney(row.mtd_sales)}
          </div>
          <div className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            {formatPct(row.pct_target)} of target
          </div>
        </div>
      </div>
    </li>
  );
}

export default function LeaderboardPage() {
  const { rows, last_updated_iso } = getLeaderboard();
  const sorted = [...rows].sort((a, b) => b.pct_target - a.pct_target);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl uppercase tracking-wide"
            style={{ color: "var(--text-primary)" }}>
          PULSE Leaderboard
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Olympic Paints sales team · live performance
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          Last updated {new Date(last_updated_iso).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </header>

      <section
        className="rounded-xl border-l-4 px-4 py-3"
        style={{ background: "var(--surface-elevated)", borderColor: "var(--brand-primary)" }}
      >
        <h2 className="font-[family-name:var(--font-display)] font-bold text-[11px] uppercase tracking-widest"
            style={{ color: "var(--text-tertiary)" }}>
          How to read this
        </h2>
        <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--text-secondary)" }}>
          Reps are ranked by <strong style={{ color: "var(--text-primary)" }}>% of monthly target</strong>, not raw
          sales — so a rep with a smaller book is judged on the same scale as one with a bigger book. Top 2 in green,
          bottom 2 in red.
        </p>
      </section>

      <ul className="space-y-2">
        {sorted.map((r, i) => (
          <RepCard key={r.rep} row={r} rank={i + 1} total={sorted.length} />
        ))}
      </ul>

      <footer className="text-center text-xs pt-4 pb-2" style={{ color: "var(--text-tertiary)" }}>
        Olympic Paints PULSE · Reply to your daily PULSE email with questions.
      </footer>
    </div>
  );
}
