import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, RotateCcw, X } from "lucide-react";
import {
  useVariants,
  variantCatalog,
  type VariantState,
} from "@/context/VariantContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = Object.keys(variantCatalog) as Array<keyof VariantState>;

export function VariantSwitcherBar() {
  const [open, setOpen] = useState(false);
  const { variants, setVariant, resetToDefaults } = useVariants();

  return (
    <div className="fixed bottom-4 right-4 z-[100] print:hidden">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-[19rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-card border border-border bg-card/95 shadow-elevation backdrop-blur-xl"
            role="region"
            aria-label="Layout variant switcher"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-brand" aria-hidden />
                <span className="text-sm font-semibold">Layout variants</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={resetToDefaults}
                  aria-label="Reset variants to defaults"
                >
                  <RotateCcw className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setOpen(false)}
                  aria-label="Close variant switcher"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="max-h-[60vh] space-y-3 overflow-y-auto px-4 py-3">
              {categories.map((category) => {
                const config = variantCatalog[category];
                return (
                  <div key={category} className="space-y-1.5">
                    <label
                      htmlFor={`variant-${category}`}
                      className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {config.label}
                    </label>
                    <select
                      id={`variant-${category}`}
                      value={variants[category]}
                      onChange={(event) =>
                        setVariant(
                          category,
                          event.target.value as VariantState[typeof category],
                        )
                      }
                      className={cn(
                        "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm",
                        "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                    >
                      {config.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setOpen(true)}
            aria-label="Open layout variant switcher"
            className="flex items-center gap-2 rounded-badge bg-surface-dark px-4 py-3 text-sm font-medium text-primary-foreground shadow-elevation transition-transform hover:scale-[1.03]"
          >
            <Layers className="size-4" aria-hidden />
            Variants
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VariantSwitcherBar;
