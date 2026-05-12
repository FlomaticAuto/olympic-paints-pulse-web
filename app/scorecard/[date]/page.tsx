import { getScorecard, formatMoney, formatPct } from "@/lib/data";

type Params = { date: string };

export default async function ScorecardPage({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const { period_label, summary, rep_rows } = await getScorecard(date);
  const sorted = [...rep_rows].sort((a, b) => b.pct_target - a.pct_target);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl uppercase tracking-wide"
            style={{ color: "var(--text-primary)" }}>
          PULSE Scorecard
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{period_label}</p>
      </header>

      {/* Executive summary — auto-fit grid */}
      <section
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}
      >
        {[
          { big: formatMoney(summary.team_mtd), label: "Team MTD" },
          { big: formatPct(summary.team_pct_target), label: "vs Target" },
          { big: `${summary.team_visits_actual}/${summary.team_visits_planned}`, label: "Visits" },
          { big: `${summary.team_acks}/${summary.team_acks_required}`, label: "Acks" },
          { big: formatPct(summary.team_plan_adherence), label: "Plan Adh." },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{ background: "var(--surface-elevated)" }}
          >
            <div className="font-[family-name:var(--font-display)] font-black text-2xl"
                 style={{ color: "var(--text-primary)" }}>
              {card.big}
            </div>
            <div className="text-[10px] uppercase tracking-widest mt-1"
                 style={{ color: "var(--text-tertiary)" }}>
              {card.label}
            </div>
          </div>
        ))}
      </section>

      {/* Rep ranking — stacked cards on mobile, table-like on desktop */}
      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-[11px] uppercase tracking-widest"
            style={{ color: "var(--text-tertiary)" }}>
          Rep ranking — last 14 days
        </h2>
        <ul className="space-y-2">
          {sorted.map((r, i) => {
            const warn = r.pct_target < 0.75;
            return (
              <li
                key={r.rep}
                className="rounded-xl p-4"
                style={{ background: "var(--surface-elevated)" }}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-[family-name:var(--font-display)] font-black text-xl"
                          style={{ color: "var(--text-primary)" }}>
                      #{i + 1}
                    </span>
                    <span className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {r.name}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>({r.rep})</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-[family-name:var(--font-display)] font-bold whitespace-nowrap"
                         style={{ color: "var(--text-primary)" }}>
                      {formatMoney(r.sales)}
                    </div>
                    <div className={`text-sm font-semibold ${warn ? "" : ""}`}
                         style={{ color: warn ? "var(--danger-fg)" : "var(--text-secondary)" }}>
                      {formatPct(r.pct_target)}{warn ? " ⚠" : ""}
                    </div>
                  </div>
                </div>
                <dl className="grid gap-2 text-xs" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))" }}>
                  {[
                    { k: "Visits", v: `${r.visits_actual}/${r.visits_planned}` },
                    { k: "Plan %", v: formatPct(r.plan_adherence) },
                    { k: "Leads", v: String(r.leads) },
                    { k: "New stores", v: String(r.new_stores) },
                    { k: "Ack %", v: formatPct(r.ack_pct) },
                  ].map((stat) => (
                    <div key={stat.k}>
                      <dt className="uppercase tracking-wider text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        {stat.k}
                      </dt>
                      <dd className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {stat.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
