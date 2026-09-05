import { useState } from "react";
import { Layers, RotateCcw, X } from "lucide-react";
import {
  useVariants,
  variantCategories,
  variantOptions,
  type VariantState,
} from "@/context/VariantContext";
import { cn } from "@/lib/utils";

const categoryLabels: Record<keyof VariantState, string> = {
  navbar: "Navbar",
  hero: "Hero",
  programs: "Programs",
  impact: "Impact",
  gallery: "Gallery",
  events: "Events",
  footer: "Footer",
  aboutOverview: "About overview",
  programsOverview: "Programs overview",
  impactOverview: "Impact overview",
  galleryOverview: "Gallery overview",
  donationOverview: "Donation overview",
};

/**
 * Floating, unobtrusive control bar for switching layout variants live.
 * Mount once in the app shell.
 */
export function VariantSwitcher() {
  const { variants, setVariant, resetToDefaults } = useVariants();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open layout variant switcher"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-badge bg-primary text-primary-foreground shadow-elevation transition-transform hover:scale-105"
      >
        <Layers className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[min(20rem,calc(100vw-2.5rem))] rounded-card border border-border bg-card/95 p-4 shadow-elevation backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-heading text-sm font-semibold text-foreground">Layout Variants</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetToDefaults}
            aria-label="Reset variants to defaults"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close variant switcher"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
        {variantCategories.map((category) => (
          <div key={category}>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {categoryLabels[category]}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {variantOptions[category].map((option) => {
                const active = variants[category] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setVariant(category, option.value as VariantState[typeof category])
                    }
                    className={cn(
                      "rounded-badge border px-2.5 py-1 text-xs transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
