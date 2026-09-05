import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, TrendingUp, HeartHandshake, HandCoins } from "lucide-react";

import type { ProgramsData } from "@/types/schema";
import { Button } from "@/components/ui/button";

export function ProgramTabbedView({ data }: { data: ProgramsData }) {
  const [activeId, setActiveId] = useState(data.programs[0]?.id ?? "");
  const active = data.programs.find((p) => p.id === activeId) ?? data.programs[0];

  if (!active) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-10">
      {/* Tab selector: horizontal scroll on mobile, vertical rail on desktop */}
      <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
        <div
          role="tablist"
          aria-label="Programs"
          className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col"
        >
          {data.programs.map((program) => {
            const selected = program.id === active.id;
            return (
              <button
                key={program.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(program.id)}
                className={`min-w-0 rounded-card border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-surface-muted"
                }`}
              >
                <span className="block whitespace-nowrap lg:whitespace-normal">
                  {program.title}
                </span>
                <span className="mt-0.5 block text-xs font-medium opacity-70">
                  {program.categoryTag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div className="min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="tabpanel"
            className="overflow-hidden rounded-card border border-border bg-card shadow-glass"
          >
            <div className="aspect-[16/8] w-full overflow-hidden bg-muted">
              <img
                src={active.imageUri}
                alt={active.title}
                loading="lazy"
                width={1280}
                height={854}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 p-5 sm:p-7">
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">{active.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {active.fullDescription}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Stat
                  icon={<Users className="h-4 w-4" />}
                  label="Target group"
                  value={active.targetGroup}
                />
                <Stat
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={active.location}
                />
                <Stat
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Metrics achieved"
                  value={active.metricsAchieved ?? "Reporting in progress"}
                />
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button className="rounded-badge bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-primary/40">
                  <HandCoins className="mr-2 h-4 w-4" />
                  Donate to this program
                </Button>
                <Button
                  variant="outline"
                  className="rounded-badge border-primary bg-background px-6 font-semibold text-primary hover:bg-primary/5 focus-visible:ring-primary/40"
                >
                  <HeartHandshake className="mr-2 h-4 w-4" />
                  Volunteer here
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({
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
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="shrink-0 text-brand-600">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-snug text-foreground">{value}</p>
    </div>
  );
}
