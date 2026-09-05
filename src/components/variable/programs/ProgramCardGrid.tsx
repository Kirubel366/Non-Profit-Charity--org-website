import { useState } from "react";
import { MapPin, Users, TrendingUp, ArrowRight } from "lucide-react";

import type { ProgramItem, ProgramsData } from "@/types/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ProgramCardGrid({ data }: { data: ProgramsData }) {
  const [active, setActive] = useState<ProgramItem | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.programs.map((program) => (
          <article
            key={program.id}
            className="group flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
              <img
                src={program.imageUri}
                alt={program.title}
                loading="lazy"
                width={1280}
                height={854}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute left-3 top-3 rounded-badge bg-surface-glass px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
                {program.categoryTag}
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
              <h3 className="text-lg font-bold leading-snug text-foreground">
                {program.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {program.shortDescription}
              </p>

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <Badge icon={<Users className="h-3.5 w-3.5" />} text={program.targetGroup} />
                <Badge icon={<MapPin className="h-3.5 w-3.5" />} text={program.location} />
              </div>

              <Button
                variant="ghost"
                className="mt-2 h-auto justify-start gap-2 px-0 text-sm font-semibold text-brand-600 hover:bg-transparent hover:text-brand-700"
                onClick={() => setActive(program)}
              >
                View Full Program Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto max-w-[calc(100%-2rem)] p-0 sm:max-w-2xl">
          {active && (
            <div className="flex flex-col">
              <div className="aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted sm:aspect-[16/7]">
                <img
                  src={active.imageUri}
                  alt={active.title}
                  loading="lazy"
                  width={1280}
                  height={854}
                  className="h-full w-full object-cover"
                />
              </div>
              <DialogHeader className="px-6 pt-6 text-left">
                <span className="w-fit rounded-badge bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {active.categoryTag}
                </span>
                <DialogTitle className="text-2xl">{active.title}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed">
                  {active.fullDescription}
                </DialogDescription>
              </DialogHeader>

              <dl className="grid grid-cols-1 gap-3 px-6 pb-6 sm:grid-cols-3">
                <DetailTile
                  icon={<Users className="h-4 w-4" />}
                  label="Target group"
                  value={active.targetGroup}
                />
                <DetailTile
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={active.location}
                />
                <DetailTile
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Metrics achieved"
                  value={active.metricsAchieved ?? "Reporting in progress"}
                />
              </dl>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 rounded-badge bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
      <span className="shrink-0 text-brand-600">{icon}</span>
      <span className="truncate">{text}</span>
    </span>
  );
}

function DetailTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-surface-muted p-3">
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="shrink-0 text-brand-600">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
