import { CheckCircle2, MapPin, Users, TrendingUp } from "lucide-react";

import type { ProgramsData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { toBulletPoints } from "./programUtils";

export function ProgramFeatureBlocks({ data }: { data: ProgramsData }) {
  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      {data.programs.map((program, index) => {
        const reversed = index % 2 === 1;
        return (
          <article
            key={program.id}
            className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
          >
            <div
              className={`overflow-hidden rounded-card bg-muted shadow-elevation ${
                reversed ? "lg:order-2" : ""
              }`}
            >
              <img
                src={program.imageUri}
                alt={program.title}
                loading="lazy"
                width={1280}
                height={854}
                className="aspect-[3/2] h-full w-full object-cover"
              />
            </div>

            <div className={`min-w-0 ${reversed ? "lg:order-1" : ""}`}>
              <span className="inline-flex rounded-badge bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
                Pillar {String(index + 1).padStart(2, "0")} · {program.categoryTag}
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {program.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {program.shortDescription}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {toBulletPoints(program.fullDescription).map((point) => (
                  <li key={point} className="flex min-w-0 gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-trust-500" />
                    <span className="text-sm leading-relaxed text-foreground">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Fact icon={<Users className="h-4 w-4" />} value={program.targetGroup} />
                <Fact icon={<MapPin className="h-4 w-4" />} value={program.location} />
                {program.metricsAchieved && (
                  <Fact
                    icon={<TrendingUp className="h-4 w-4" />}
                    value={program.metricsAchieved}
                  />
                )}
              </div>

              <Button className="mt-7 rounded-badge bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-primary/40">
                Support this pillar
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Fact({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2 rounded-lg border border-border bg-surface-muted p-3">
      <span className="mt-0.5 shrink-0 text-brand-600">{icon}</span>
      <span className="min-w-0 text-xs font-medium leading-snug text-foreground">{value}</span>
    </div>
  );
}
