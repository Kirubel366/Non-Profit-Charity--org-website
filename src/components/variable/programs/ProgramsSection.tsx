import { useVariants } from "@/context/VariantContext";
import { orgContent } from "@/data/orgContent";
import { ProgramCardGrid } from "./ProgramCardGrid";
import { ProgramFeatureBlocks } from "./ProgramFeatureBlocks";
import { ProgramTabbedView } from "./ProgramTabbedView";

export function ProgramsSection() {
  const { variants } = useVariants();
  const data = orgContent.programs;

  return (
    <section id="programs" className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-badge bg-trust-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-trust-600">
            Operational pillars
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {data.sectionTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {data.sectionSubtitle}
          </p>
        </header>

        <div className="mt-12 sm:mt-16">
          {variants.programs === "card-grid" && <ProgramCardGrid data={data} />}
          {variants.programs === "feature-blocks" && <ProgramFeatureBlocks data={data} />}
          {variants.programs === "tabbed-view" && <ProgramTabbedView data={data} />}
        </div>
      </div>
    </section>
  );
}
