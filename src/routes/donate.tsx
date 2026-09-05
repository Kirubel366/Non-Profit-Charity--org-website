import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { DonationSection } from "@/components/fixed/DonationSection";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: `Donate — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `Support ${orgContent.navbar.orgName} through secure donations, material giving, and verified impact programs.`,
      },
      { property: "og:title", content: `Donate to ${orgContent.navbar.orgName}` },
      {
        property: "og:description",
        content: "Help us fund shelter, education and family support with transparent, traceable giving.",
      },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main className="pb-10 pt-4">
        <DonationSection
          accounts={orgContent.footer.bankAccounts}
          campaignTitle={orgContent.hero.activeCampaign?.title ?? "our programs"}
          currencySymbol={orgContent.hero.activeCampaign?.currencySymbol ?? "ETB"}
          targetAmount={orgContent.hero.activeCampaign?.targetAmount}
          raisedAmount={orgContent.hero.activeCampaign?.raisedAmount}
          donorCount={orgContent.hero.activeCampaign?.donorCount}
        />
      </main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
