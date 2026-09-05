import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { ImpactSection } from "@/components/variable/impact/ImpactSection";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: `Impact — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `Measured results and verified impact from ${orgContent.navbar.orgName}'s programs.`,
      },
      { property: "og:title", content: `${orgContent.navbar.orgName} Impact` },
    ],
  }),
  component: ImpactPage,
});

function ImpactPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main className="pb-10 pt-6">
        <ImpactSection />
      </main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
