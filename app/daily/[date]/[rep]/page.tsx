import { notFound } from "next/navigation";
import { getDaily, formatMoney, formatPct, type RepCode } from "@/lib/data";

type Params = { date: string; rep: string };

const VALID_REPS: RepCode[] = ["AC", "AP", "BV", "NP", "BM"];

function isRepCode(value: string): value is RepCode {
  return (VALID_REPS as string[]).includes(value);
}

export default async function DailyPage({ params }: { params: Promise<Params> }) {
  const { date, rep } = await params;
  if (!isRepCode(rep)) notFound();
  const data = getDaily(date, rep);
  if (!data) notFound();

  const pctTarget = data.mtd_target ? data.mtd_sales / data.mtd_target : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl uppercase tracking-wide"
            style={{ color: "var(--text-primary)" }}>
          PULSE Daily — {data.rep}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {data.date_label} · Cycle {data.cycle_label}
        </p>
      </header>

      {/* KPI strip — auto-fit so it reflows on narrow screens */}
      <section
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))" }}
      >
        {[
          { big: formatMoney(data.mtd_sales), label: `MTD · ${formatPct(pctTarget)}` },
          { big: `#${data.rank}/5`, label: "Team rank" },
          { big: formatPct(data.plan_adherence_mtd), label: "Plan adh." },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-4" style={{ background: "var(--surface-elevated)" }}>
            <div className="font-[family-name:var(--font-display)] font-black text-2xl whitespace-nowrap overflow-hidden text-ellipsis"
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

      {/* Yesterday */}
      <section className="space-y-2">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-[11px] uppercase tracking-widest"
            style={{ color: "var(--text-tertiary)" }}>
          Yesterday — {data.yesterday_visits_total} {data.yesterday_visits_total === 1 ? "visit" : "visits"} logged
        </h2>
        <ul className="rounded-xl overflow-hidden" style={{ background: "var(--surface-elevated)" }}>
          {data.yesterday_visited_stores.length === 0 ? (
            <li className="px-4 py-3 text-sm italic" style={{ color: "var(--text-tertiary)" }}>
              No visits logged yesterday
            </li>
          ) : (
            data.yesterday_visited_stores.map((store, i) => (
              <li
                key={store + i}
                className="px-4 py-3 text-sm border-b last:border-b-0"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <span style={{ color: "#7AC97A" }} className="font-bold mr-2">✓</span>
                {store}
              </li>
            ))
          )}
        </ul>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Sales: <strong style={{ color: "var(--text-primary)" }}>{formatMoney(data.yesterday_sales)}</strong>
          {" · "}Leads: <strong style={{ color: "var(--text-primary)" }}>{data.yesterday_leads}</strong>
        </p>
      </section>

      {/* Ack CTA — full-width on mobile, comfortable tap target */}
      <a
        href="#ack"
        className="block w-full text-center rounded-xl font-[family-name:var(--font-display)] font-black uppercase tracking-wider"
        style={{
          background: "var(--brand-primary)",
          color: "var(--text-on-brand)",
          padding: "16px 24px",
          fontSize: 16,
          minHeight: 56,
        }}
      >
        Acknowledge by 17:00 →
      </a>
    </div>
  );
}
