import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { GalleryData } from "@/types/schema";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Healthcare", "Education", "Shelter", "Events"] as const;
type Filter = (typeof FILTERS)[number];

export function GalleryFilterGrid({ data }: { data: GalleryData }) {
  const [filter, setFilter] = useState<Filter>("All");

  const items = useMemo(
    () => (filter === "All" ? data.items : data.items.filter((i) => i.categoryTag === filter)),
    [data.items, filter],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div
          role="tablist"
          aria-label="Filter gallery by category"
          className="flex w-max min-w-full gap-2 sm:justify-center"
        >
          {FILTERS.map((option) => (
            <button
              key={option}
              role="tab"
              aria-selected={filter === option}
              onClick={() => setFilter(option)}
              className={cn(
                "shrink-0 rounded-badge border px-4 py-2 text-sm font-semibold transition-colors",
                filter === option
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.figure
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="group overflow-hidden rounded-card border border-border bg-card shadow-sm"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={item.mediaUri}
                  alt={item.title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="flex items-center justify-center gap-2 p-4">
                <span className="text-xl font-semibold text-foreground">{item.categoryTag}</span>
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>

      {items.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No media in this category yet — check back after the next field visit.
        </p>
      )}
    </div>
  );
}
