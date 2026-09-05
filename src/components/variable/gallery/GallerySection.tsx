import { useVariants } from "@/context/VariantContext";
import { usePublicGalleryItems } from "@/hooks/usePublicGalleryItems";
import { orgContent } from "@/data/orgContent";
import type { GalleryData } from "@/types/schema";
import { GalleryMasonryGrid } from "./GalleryMasonryGrid";
import { GalleryFilterGrid } from "./GalleryFilterGrid";

export function GallerySection() {
  const { variants } = useVariants();
  const { items, isLoading, isError } = usePublicGalleryItems();
  const data: GalleryData = { sectionTitle: orgContent.gallery.sectionTitle, items };

  return (
    <section id="gallery" className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-badge bg-trust-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-trust-600">
            Media gallery
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {data.sectionTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Unstaged photographs from clinics, classrooms, kitchens and community events.
          </p>
        </header>

        <div className="mt-12 sm:mt-16">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-card bg-muted" />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {isError
                ? "We couldn't load the gallery right now. Please refresh the page."
                : "No photos have been published yet — check back soon."}
            </p>
          ) : (
            <>
              {variants.gallery === "masonry-grid" && <GalleryMasonryGrid data={data} />}
              {variants.gallery === "filter-grid" && <GalleryFilterGrid data={data} />}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
