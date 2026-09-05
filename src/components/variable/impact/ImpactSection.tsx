import { useVariants } from "@/context/VariantContext";
import { orgContent } from "@/data/orgContent";
import { ImpactStatGrid } from "./ImpactStatGrid";
import { ImpactStoryCards } from "./ImpactStoryCards";

export function ImpactSection() {
  const { variants } = useVariants();
  const data = orgContent.impact;

  return (
    <section id="impact" className="bg-secondary/40 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-badge bg-trust-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-trust-600">
            Measured results
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {data.sectionTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{data.sectionSubtitle}</p>
        </header>

        <div className="mt-12 sm:mt-16">
          {variants.impact === "stat-grid-recharts" && <ImpactStatGrid data={data} />}
          {variants.impact === "story-cards" && <ImpactStoryCards data={data} />}
        </div>
      </div>
    </section>
  );
}
