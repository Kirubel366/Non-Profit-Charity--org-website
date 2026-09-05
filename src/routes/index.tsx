import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { HeroRenderer } from "@/components/variable/hero/HeroRenderer";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { HomeOverviewSections } from "@/components/variable/home/HomeOverviewSections";
import { useVariants } from "@/context/VariantContext";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: orgContent.seo.defaultTitle },
      { name: "description", content: orgContent.seo.defaultDescription },
      { property: "og:title", content: orgContent.seo.defaultTitle },
      { property: "og:description", content: orgContent.seo.defaultDescription },
    ],
  }),
  component: Index,
});

function Index() {
  const { variants } = useVariants();
  const floating = variants.navbar === "overlay-floating";

  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main id="home" className={floating ? "pt-24" : undefined}>
        <HeroRenderer data={orgContent.hero} />
        <HomeOverviewSections />
      </main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
