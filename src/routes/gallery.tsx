import { createFileRoute } from "@tanstack/react-router";
import { NavbarRenderer } from "@/components/variable/navbar/NavbarRenderer";
import { GallerySection } from "@/components/variable/gallery/GallerySection";
import { LegalFooter } from "@/components/fixed/LegalFooter";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Gallery — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `View stories from our programs, partner communities, and support network through the ${orgContent.navbar.orgName} gallery.`,
      },
      { property: "og:title", content: `${orgContent.navbar.orgName} Gallery` },
      {
        property: "og:description",
        content: "Photos and moments that show the people and communities behind our work.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarRenderer data={orgContent.navbar} />
      <main className="pb-10 pt-4">
        <GallerySection />
      </main>
      <LegalFooter data={orgContent.footer} />
    </div>
  );
}
