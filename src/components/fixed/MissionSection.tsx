import {
  BookOpen,
  Compass,
  HeartPulse,
  Home,
  Sparkles,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { MissionData } from "@/types/schema";

const iconMap: Record<string, LucideIcon> = {
  shelter: Home,
  education: BookOpen,
  healthcare: HeartPulse,
  nutrition: Utensils,
  vision: Compass,
};

/** Fixed 4-column operational pillars section. */
export function MissionSection({ data }: { data: MissionData }) {
  return (
    <section id="mission" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-badge bg-hope-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            What drives us
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {data.sectionTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {data.missionStatement}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon ?? ""] ?? Sparkles;
            return (
              <article
                key={pillar.id}
                className="group rounded-card border border-border bg-card p-6 shadow-glass transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevation"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-card bg-brand-soft text-brand transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>

        {data.visionStatement && (
          <div className="mt-14 rounded-card bg-surface-dark px-6 py-10 text-center sm:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              Our vision
            </p>
            <p className="mx-auto mt-4 max-w-3xl font-heading text-xl font-semibold leading-relaxed text-primary-foreground sm:text-2xl">
              {data.visionStatement}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
