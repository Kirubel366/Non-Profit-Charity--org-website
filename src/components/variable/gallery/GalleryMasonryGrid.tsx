import { useState } from "react";
import { Expand } from "lucide-react";

import type { GalleryData, GalleryItem } from "@/types/schema";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { orgContent } from "@/data/orgContent";

export function GalleryMasonryGrid({ data }: { data: GalleryData }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
        {data.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-card border border-border bg-card text-left shadow-sm transition-shadow hover:shadow-elevation"
          >
            <div className="relative overflow-hidden bg-muted">
              <img
                src={item.mediaUri}
                alt={item.title}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                <Expand className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 p-4">
              <span className="min-w-0 text-lg font-semibold leading-snug text-foreground">{item.categoryTag}</span>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] overflow-hidden p-0 sm:max-w-4xl">
          {active && (
            <div className="flex flex-col">
              <div className="max-h-[70vh] w-full overflow-hidden bg-black">
                <img
                  src={active.mediaUri}
                  alt={active.title}
                  className="mx-auto max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>
              <div className="p-5">
                <span className="rounded-badge bg-trust-500/10 px-2.5 py-1 text-xs font-semibold text-trust-600">
                  {active.categoryTag}
                </span>
                <DialogTitle className="mt-3 text-lg">{active.title}</DialogTitle>
                <DialogDescription className="mt-1 text-sm">
                  Photographed on location by the {orgContent.navbar.orgName} field team.
                </DialogDescription>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
