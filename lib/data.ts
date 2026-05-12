// PULSE data layer.
// Reads JSON snapshots from data/ written by the Python pipeline
// (generate_web_snapshots.py). Falls back to mock fixtures when JSON
// is missing so local dev works without running Python.

import { promises as fs } from "node:fs";
import path from "node:path";

export type RepCode = "AC" | "AP" | "BV" | "NP" | "BM";

export const REP_NAMES: Record<RepCode, string> = {
  AC: "Aboo Cassim",
  AP: "Amit Patel",
  BV: "Bhadresh Vallabh",
  NP: "Nikhil Panchal",
  BM: "Byron Minnie",
};

export type LeaderboardRow = {
  rep: RepCode;
  name: string;
  mtd_sales: number;
  mtd_target: number;
  pct_target: number;
  plan_adherence: number;
  ack_streak: number;
};

export type LeaderboardFile = {
  last_updated_iso: string;
  rows: LeaderboardRow[];
};

export type ScorecardSummary = {
  team_mtd: number;
  team_pct_target: number;
  team_visits_actual: number;
  team_visits_planned: number;
  team_acks: number;
  team_acks_required: number;
  team_plan_adherence: number;
};

export type ScorecardRepRow = {
  rep: RepCode;
  name: string;
  sales: number;
  pct_target: number;
  visits_actual: number;
  visits_planned: number;
  plan_adherence: number;
  leads: number;
  new_stores: number;
  ack_pct: number;
};

export type ScorecardFile = {
  period_label: string;
  summary: ScorecardSummary;
  rep_rows: ScorecardRepRow[];
};

export type DailyMailerData = {
  rep: RepCode;
  rep_name: string;
  date_label: string;
  cycle_label: string;
  mtd_sales: number;
  mtd_target: number;
  rank: number;
  plan_adherence_mtd: number;
  yesterday_sales: number;
  yesterday_leads: number;
  yesterday_visited_stores: string[];
  yesterday_visits_total: number;
};

const DATA_ROOT = path.join(process.cwd(), "data");

async function readJsonOrNull<T>(rel: string): Promise<T | null> {
  try {
    const buf = await fs.readFile(path.join(DATA_ROOT, rel), "utf-8");
    return JSON.parse(buf) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

// ── Mock fixtures used when JSON is missing (e.g. fresh clone, dev) ──────────
const MOCK_LEADERBOARD: LeaderboardFile = {
  last_updated_iso: "2026-05-12T06:30:00+02:00",
  rows: [
    { rep: "AC", name: "Aboo Cassim",       mtd_sales: 980_000, mtd_target: 1_000_000, pct_target: 0.98, plan_adherence: 0.87, ack_streak: 7 },
    { rep: "AP", name: "Amit Patel",        mtd_sales: 720_000, mtd_target: 800_000,   pct_target: 0.90, plan_adherence: 0.82, ack_streak: 5 },
    { rep: "BV", name: "Bhadresh Vallabh",  mtd_sales: 610_000, mtd_target: 750_000,   pct_target: 0.81, plan_adherence: 0.74, ack_streak: 6 },
    { rep: "NP", name: "Nikhil Panchal",    mtd_sales: 480_000, mtd_target: 700_000,   pct_target: 0.69, plan_adherence: 0.61, ack_streak: 3 },
    { rep: "BM", name: "Byron Minnie",      mtd_sales: 320_000, mtd_target: 600_000,   pct_target: 0.53, plan_adherence: 0.55, ack_streak: 2 },
  ],
};

const MOCK_SCORECARD: ScorecardFile = {
  period_label: "Mon 25 Apr → Fri 08 May 2026",
  summary: {
    team_mtd: 3_110_000,
    team_pct_target: 0.78,
    team_visits_actual: 142,
    team_visits_planned: 175,
    team_acks: 41,
    team_acks_required: 50,
    team_plan_adherence: 0.81,
  },
  rep_rows: [
    { rep: "AC", name: "Aboo Cassim",      sales: 980_000, pct_target: 0.98, visits_actual: 34, visits_planned: 35, plan_adherence: 0.97, leads: 4, new_stores: 2, ack_pct: 1.0  },
    { rep: "AP", name: "Amit Patel",       sales: 720_000, pct_target: 0.90, visits_actual: 30, visits_planned: 35, plan_adherence: 0.86, leads: 3, new_stores: 1, ack_pct: 0.90 },
    { rep: "BV", name: "Bhadresh Vallabh", sales: 610_000, pct_target: 0.81, visits_actual: 28, visits_planned: 35, plan_adherence: 0.80, leads: 2, new_stores: 0, ack_pct: 0.85 },
    { rep: "NP", name: "Nikhil Panchal",   sales: 480_000, pct_target: 0.69, visits_actual: 26, visits_planned: 35, plan_adherence: 0.74, leads: 1, new_stores: 0, ack_pct: 0.70 },
    { rep: "BM", name: "Byron Minnie",     sales: 320_000, pct_target: 0.53, visits_actual: 24, visits_planned: 35, plan_adherence: 0.69, leads: 0, new_stores: 0, ack_pct: 0.65 },
  ],
};

function mockDaily(rep: RepCode): DailyMailerData {
  const board = MOCK_LEADERBOARD;
  const sorted = [...board.rows].sort((a, b) => b.pct_target - a.pct_target);
  const row = sorted.find((r) => r.rep === rep)!;
  return {
    rep,
    rep_name: REP_NAMES[rep],
    date_label: "Tue 12 May 2026",
    cycle_label: `${rep}1, Day 2/5`,
    mtd_sales: row.mtd_sales,
    mtd_target: row.mtd_target,
    rank: sorted.findIndex((r) => r.rep === rep) + 1,
    plan_adherence_mtd: row.plan_adherence,
    yesterday_sales: Math.round(row.mtd_sales * 0.045),
    yesterday_leads: 1,
    yesterday_visited_stores: ["Polokwane Hardware", "Tzaneen Builders", "Mokopane Trade"],
    yesterday_visits_total: 3,
  };
}

// ── Public loaders (async — Server Components await these) ───────────────────

export async function getLeaderboard(): Promise<LeaderboardFile> {
  const data = await readJsonOrNull<LeaderboardFile>("leaderboard.json");
  return data ?? MOCK_LEADERBOARD;
}

export async function getScorecard(date: string): Promise<ScorecardFile> {
  // Try the requested date first, fall back to "latest" alias, then mock
  const dated = await readJsonOrNull<ScorecardFile>(`scorecard/${date}.json`);
  if (dated) return dated;
  const latest = await readJsonOrNull<ScorecardFile>(`scorecard/latest.json`);
  return latest ?? MOCK_SCORECARD;
}

export async function getDaily(date: string, rep: RepCode): Promise<DailyMailerData | null> {
  const dated = await readJsonOrNull<DailyMailerData>(`daily/${date}/${rep}.json`);
  if (dated) return dated;
  const latest = await readJsonOrNull<DailyMailerData>(`daily/latest/${rep}.json`);
  if (latest) return latest;
  return mockDaily(rep);
}

// ── Formatters ───────────────────────────────────────────────────────────────

export function formatMoney(v: number): string {
  return `R ${v.toLocaleString("en-ZA").replace(/,/g, " ")}`;
}

export function formatPct(v: number): string {
  return `${Math.round(v * 100)}%`;
}
