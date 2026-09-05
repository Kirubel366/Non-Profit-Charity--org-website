import { Quote } from "lucide-react";

import type { ImpactData } from "@/types/schema";
import { formatMetric, parseMetric, useCountUp } from "./useCountUp";
import { orgContent } from "@/data/orgContent";

function StatBadge({ metric, label }: { metric: string; label: string }) {
  const { ref, value } = useCountUp(parseMetric(metric));
  return (
    <div className="rounded-card border border-border bg-card p-4">
      <span ref={ref} className="block text-2xl font-bold tabular-nums text-trust-600">
        {formatMetric(value)}
      </span>
      <span className="mt-1 block text-xs font-medium leading-snug text-muted-foreground">{label}</span>
    </div>
  );
}

export function ImpactStoryCards({ data }: { data: ImpactData }) {
  const stories = data.stories ?? [];

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <StatBadge key={stat.id} metric={stat.metricNumber} label={stat.metricLabel} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stories.map((story) => (
          <article
            key={story.id}
            className="group flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-sm transition-shadow hover:shadow-elevation"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src={story.imageUri}
                alt={`${story.beneficiaryName}, supported by ${orgContent.navbar.orgName}`}
                loading="lazy"
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2">
                <Quote className="h-4 w-4 shrink-0 text-trust-500" />
                <span className="text-xs font-semibold uppercase tracking-wide text-trust-600">
                  Verified story
                </span>
              </div>
              <blockquote className="mt-3 flex-1 text-base leading-relaxed text-foreground">
                “{story.quote}”
              </blockquote>
              <footer className="mt-4 border-t border-border pt-3">
                <p className="text-sm font-bold text-foreground">{story.beneficiaryName}</p>
                <p className="text-xs text-muted-foreground">{story.authorTitle}</p>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
