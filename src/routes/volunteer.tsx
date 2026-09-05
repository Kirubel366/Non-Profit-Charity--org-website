import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { VolunteerPortal } from "@/components/fixed/VolunteerPortal";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: `Volunteer — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `Join ${orgContent.navbar.orgName} as a volunteer and help drive humanitarian support, care, and community impact.`,
      },
      { property: "og:title", content: `Volunteer with ${orgContent.navbar.orgName}` },
      {
        property: "og:description",
        content: "Support our programs through service, skills, and local community action.",
      },
    ],
  }),
  component: VolunteerPage,
});

function VolunteerPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main className="pb-10 pt-4">
        <VolunteerPortal data={orgContent.volunteer} />
      </main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
