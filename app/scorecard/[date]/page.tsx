import { getScorecard, formatMoney, formatPct } from "@/lib/data";

type Params = { date: string };

function pctColour(pct: number): string {
  if (pct >= 0.9) return "var(--color-teal)";
  if (pct >= 0.7) return "var(--color-y400)";
  return "var(--color-coral)";
}

function pctBg(pct: number): string {
  if (pct >= 0.9) return "var(--success-bg)";
  if (pct >= 0.7) return "var(--warning-bg)";
  return "var(--danger-bg)";
}

function pctFg(pct: number): string {
  if (pct >= 0.9) return "var(--success-fg)";
  if (pct >= 0.7) return "var(--warning-fg)";
  return "var(--danger-fg)";
}

function RankBadge({ rank }: { rank: number }) {
  const colours: Record<number, { bg: string; fg: string }> = {
    1: { bg: "var(--color-y400)", fg: "var(--color-g950)" },
    2: { bg: "var(--color-n300)", fg: "var(--color-n950)" },
    3: { bg: "var(--color-terra)", fg: "#fff" },
  };
  const c = colours[rank] ?? { bg: "var(--surface-elevated)", fg: "var(--text-tertiary)" };
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-[family-name:var(--font-display)] font-black text-base"
      style={{ background: c.bg, color: c.fg }}
    >
      {rank}
    </div>
  );
}

function ProgressBar({ value, colour }: { value: number; colour: string }) {
  const w = Math.min(100, Math.round(value * 100));
  return (
    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${w}%`, background: colour }}
      />
    </div>
  );
}

export default async function ScorecardPage({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const { period_label, summary, rep_rows } = await getScorecard(date);
  const sorted = [...rep_rows].sort((a, b) => b.pct_target - a.pct_target);

  const summaryCards = [
    { big: formatMoney(summary.team_mtd), label: "Team Revenue", accent: "var(--brand-primary)" },
    { big: formatPct(summary.team_pct_target), label: "vs Target", accent: pctColour(summary.team_pct_target) },
    { big: `${summary.team_visits_actual}/${summary.team_visits_planned}`, label: "Visits", accent: "var(--text-secondary)" },
    { big: formatPct(summary.team_plan_adherence), label: "Plan Adherence", accent: pctColour(summary.team_plan_adherence) },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h1
          className="font-[family-name:var(--font-display)] font-black text-3xl md:text-4xl uppercase tracking-wide leading-none"
          style={{ color: "var(--text-primary)" }}
        >
          PULSE Scorecard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          {period_label}
        </p>
      </div>

      {/* ── Team summary strip ── */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))" }}
      >
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4 border"
            style={{
              background: "var(--surface-elevated)",
              borderColor: "var(--border-subtle)",
              borderTopColor: card.accent,
              borderTopWidth: 3,
            }}
          >
            <div
              className="font-[family-name:var(--font-display)] font-black text-2xl leading-none"
              style={{ color: card.accent }}
            >
              {card.big}
            </div>
            <div className="text-[10px] uppercase tracking-widest mt-2" style={{ color: "var(--text-tertiary)" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Rep cards ── */}
      <div>
        <h2
          className="font-[family-name:var(--font-display)] font-bold text-[11px] uppercase tracking-widest mb-3"
          style={{ color: "var(--text-tertiary)" }}
        >
          Rep ranking — last 14 days
        </h2>

        <ul className="space-y-3">
          {sorted.map((r, i) => {
            const rank = i + 1;
            const targetColour = pctColour(r.pct_target);
            const visitColour = pctColour(r.plan_adherence);

            return (
              <li
                key={r.rep}
                className="rounded-xl border overflow-hidden"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                {/* Top row — rank, name, revenue */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                  <RankBadge rank={rank} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                      {r.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {r.rep}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className="font-[family-name:var(--font-display)] font-black text-xl leading-none whitespace-nowrap"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatMoney(r.sales)}
                    </div>
                    <div
                      className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ background: pctBg(r.pct_target), color: pctFg(r.pct_target) }}
                    >
                      {formatPct(r.pct_target)} of target
                    </div>
                  </div>
                </div>

                {/* Target progress bar */}
                <div className="px-4 pb-3">
                  <ProgressBar value={r.pct_target} colour={targetColour} />
                </div>

                {/* Stats row */}
                <div
                  className="grid border-t px-4 py-3 gap-x-3 gap-y-2 text-xs"
                  style={{
                    borderColor: "var(--border-subtle)",
                    gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))",
                  }}
                >
                  {/* Visits with its own mini progress bar */}
                  <div>
                    <div className="uppercase tracking-wider text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>
                      Visits
                    </div>
                    <div className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      {r.visits_actual}/{r.visits_planned}
                    </div>
                    <ProgressBar value={r.plan_adherence} colour={visitColour} />
                  </div>

                  <div>
                    <div className="uppercase tracking-wider text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>
                      Plan %
                    </div>
                    <div className="font-semibold" style={{ color: visitColour }}>
                      {formatPct(r.plan_adherence)}
                    </div>
                  </div>

                  <div>
                    <div className="uppercase tracking-wider text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>
                      Leads
                    </div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {r.leads}
                    </div>
                  </div>

                  <div>
                    <div className="uppercase tracking-wider text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>
                      New stores
                    </div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {r.new_stores}
                    </div>
                  </div>

                  <div>
                    <div className="uppercase tracking-wider text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>
                      Ack %
                    </div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {formatPct(r.ack_pct)}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
