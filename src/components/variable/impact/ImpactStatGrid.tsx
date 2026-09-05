import { ArrowUpRight, BadgeCheck, TrendingUp } from "lucide-react";
import { useState } from "react";

import type { ImpactData, ImpactStat } from "@/types/schema";
import { cn } from "@/lib/utils";
import { formatMetric, parseMetric, useCountUp } from "./useCountUp";

function StatCard({ stat, active, onSelect }: { stat: ImpactStat; active: boolean; onSelect: () => void }) {
  const target = parseMetric(stat.metricNumber);
  const { ref, value } = useCountUp(target);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "group relative overflow-hidden rounded-card border p-5 text-left transition-all duration-200",
        active
          ? "border-trust-500 bg-trust-500/5 shadow-elevation"
          : "border-border bg-card hover:-translate-y-0.5 hover:border-trust-500/40 hover:shadow-elevation",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-trust-500 via-emerald-400 to-primary" />
      <div className="flex items-start justify-between gap-3">
        <span
          ref={ref}
          className="block text-3xl font-black tabular-nums tracking-tight text-foreground sm:text-4xl"
        >
          {formatMetric(value)}
          <span className="ml-1 text-trust-600">+</span>
        </span>
        <span className="inline-flex rounded-full border border-trust-500/20 bg-trust-500/5 p-1.5 text-trust-600">
          <TrendingUp className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <span className="mt-3 block text-sm font-semibold text-foreground">{stat.metricLabel}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{stat.metricContext}</span>
    </button>
  );
}

export function ImpactStatGrid({ data }: { data: ImpactData }) {
  const [activeId, setActiveId] = useState(data.stats[0]?.id ?? "");
  const activeStat = data.stats.find((s) => s.id === activeId) ?? data.stats[0];

  if (!activeStat) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            active={stat.id === activeStat.id}
            onSelect={() => setActiveId(stat.id)}
          />
        ))}
      </div>

      <div className="rounded-card border border-border bg-card p-5 shadow-elevation sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-trust-600" aria-hidden />
              Verified outcome
            </div>

            <h3 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{activeStat.metricLabel}</h3>

            <div className="mt-4 flex items-end gap-3">
              <span className="font-heading text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                {activeStat.metricNumber}
              </span>
              <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-trust-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-trust-700">
                <ArrowUpRight className="h-3 w-3" aria-hidden />
                Verified
              </span>
            </div>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {activeStat.metricContext ??
                "Our teams track outcomes in real time so support reaches the people and communities it is designed to serve."}
            </p>
          </div>

          <div className="rounded-card border border-border bg-gradient-to-br from-trust-500/8 via-background to-secondary/30 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Why it matters
            </p>
            {activeStat.contextNote ? (
              <p className="mt-4 text-base leading-relaxed text-foreground">{activeStat.contextNote}</p>
            ) : (
              <p className="mt-4 text-base leading-relaxed text-foreground">
                Every result reflects direct, field-level support delivered with transparency, accountability, and long-term community trust.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
