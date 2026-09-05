import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { ProgramsSection } from "@/components/variable/programs/ProgramsSection";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: `Programs — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `Explore ${orgContent.navbar.orgName}'s core program pillars in shelter, education, healthcare, livelihoods and community support.`,
      },
      { property: "og:title", content: `${orgContent.navbar.orgName} Programs` },
      {
        property: "og:description",
        content: "See how our operational pillars turn support into measurable community impact.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main className="pb-10 pt-4">
        <ProgramsSection />
      </main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
