import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { AboutSection } from "@/components/fixed/AboutSection";
import { MissionSection } from "@/components/fixed/MissionSection";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { orgContent } from "@/data/orgContent";
import { useVariants } from "@/context/VariantContext";

const aboutData = orgContent.about;
const missionData = orgContent.mission;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Us — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `${orgContent.navbar.orgName} is a community-driven charity providing shelter, education and healthcare.`,
      },
      { property: "og:title", content: `About ${orgContent.navbar.orgName}` },
    ],
  }),
  component: About,
});

function About() {
  const { variants } = useVariants();

  const renderAboutVariant = () => {
    switch (variants.aboutPage) {
      case "portrait-split":
        return (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="overflow-hidden rounded-card border border-border bg-card shadow-elevation">
                <img
                  src={aboutData.imageUri}
                  alt={`${orgContent.navbar.orgName} team and community`}
                  className="h-full min-h-[420px] w-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <span className="inline-flex rounded-badge bg-brand-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                  Our story
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
                  {aboutData.sectionTitle}
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">{aboutData.foundingNarrative}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {missionData.pillars.slice(0, 4).map((pillar) => (
                    <div key={pillar.id} className="rounded-card border border-border bg-secondary/30 p-4">
                      <p className="text-sm font-semibold text-foreground">{pillar.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "impact-led":
        return (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-card border border-border bg-card p-6 shadow-elevation sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Why we exist
                  </p>
                  <h2 className="mt-2 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
                    {aboutData.sectionTitle}
                  </h2>
                </div>
                <div className="rounded-badge border border-border bg-secondary/40 px-4 py-2 text-sm font-semibold text-foreground">
                  Mission-led action
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {missionData.pillars.map((pillar) => (
                  <div key={pillar.id} className="rounded-card border border-border bg-secondary/30 p-5">
                    <p className="text-lg font-bold text-foreground">{pillar.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">{aboutData.foundingNarrative}</p>
            </div>
          </div>
        );
      case "story-led":
      default:
        return (
          <>
            <AboutSection data={aboutData} />
            <MissionSection data={missionData} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main className="pb-10 pt-6">{renderAboutVariant()}</main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
