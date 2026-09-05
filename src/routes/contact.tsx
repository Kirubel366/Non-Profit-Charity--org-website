import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { ContactSection } from "@/components/fixed/ContactSection";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `Reach the ${orgContent.navbar.orgName} team for partnerships, donations, support requests, and community questions.`,
      },
      { property: "og:title", content: `Contact ${orgContent.navbar.orgName}` },
      {
        property: "og:description",
        content: `Connect with the ${orgContent.navbar.orgName} team through phone, email, or a direct message.`,
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main className="pb-10 pt-4">
        <ContactSection data={orgContent.contact} />
      </main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
