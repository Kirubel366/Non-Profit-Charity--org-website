import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { EventsSection } from "@/components/variable/events/EventsSection";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: `Events — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `See upcoming campaigns, volunteer days, and community events hosted by ${orgContent.navbar.orgName}.`,
      },
      { property: "og:title", content: `${orgContent.navbar.orgName} Events` },
      {
        property: "og:description",
        content: "Discover the community events, outreach programs, and initiatives we are running together.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main className="pb-10 pt-4">
        <EventsSection
          copy={{
            sectionTitle: orgContent.events.sectionTitle,
            sectionSubtitle: orgContent.events.sectionSubtitle,
          }}
        />
      </main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
