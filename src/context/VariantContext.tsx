import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type NavbarVariant = "action-topbar" | "overlay-floating" | "centered-classic";
export type HeroVariant = "split-action" | "media-slider" | "campaign-spotlight";
export type ProgramsVariant = "card-grid" | "feature-blocks" | "tabbed-view";
export type ImpactVariant = "stat-grid-recharts" | "story-cards";
export type GalleryVariant = "masonry-grid" | "filter-grid";
export type EventsVariant = "calendar-cards" | "timeline-list";
export type FooterVariant = "multi-column-detailed" | "compact-single-row";
export type AboutPageVariant = "story-led" | "portrait-split" | "impact-led";
export type AboutOverviewVariant = "story-panel" | "spotlight-grid" | "community-portrait" | "trust-matrix";
export type ProgramsOverviewVariant = "pillar-cards" | "feature-showcase";
export type ImpactOverviewVariant = "metric-band" | "proof-panel";
export type GalleryOverviewVariant = "feature-collage" | "mosaic-showcase";
export type DonationOverviewVariant = "support-banner" | "impact-panel";

export interface VariantState {
  navbar: NavbarVariant;
  hero: HeroVariant;
  programs: ProgramsVariant;
  impact: ImpactVariant;
  gallery: GalleryVariant;
  events: EventsVariant;
  footer: FooterVariant;
  aboutPage: AboutPageVariant;
  aboutOverview: AboutOverviewVariant;
  programsOverview: ProgramsOverviewVariant;
  impactOverview: ImpactOverviewVariant;
  galleryOverview: GalleryOverviewVariant;
  donationOverview: DonationOverviewVariant;
}

export const defaultVariants: VariantState = {
  navbar: "action-topbar",
  hero: "split-action",
  programs: "card-grid",
  impact: "stat-grid-recharts",
  gallery: "masonry-grid",
  events: "calendar-cards",
  footer: "multi-column-detailed",
  aboutPage: "story-led",
  aboutOverview: "story-panel",
  programsOverview: "pillar-cards",
  impactOverview: "metric-band",
  galleryOverview: "feature-collage",
  donationOverview: "support-banner",
};

export const variantFileRegistry: {
  [K in keyof VariantState]: Record<VariantState[K], string[]>;
} = {
  navbar: {
    "action-topbar": ["src/components/variable/navbar/NavbarActionTopBar.tsx"],
    "overlay-floating": ["src/components/variable/navbar/NavbarOverlayFloating.tsx"],
    "centered-classic": ["src/components/variable/navbar/NavbarCenteredClassic.tsx"],
  },
  hero: {
    "split-action": ["src/components/variable/hero/HeroSplitAction.tsx"],
    "media-slider": ["src/components/variable/hero/HeroMediaSlider.tsx"],
    "campaign-spotlight": ["src/components/variable/hero/HeroCampaignSpotlight.tsx"],
  },
  programs: {
    "card-grid": ["src/components/variable/programs/ProgramCardGrid.tsx"],
    "feature-blocks": ["src/components/variable/programs/ProgramFeatureBlocks.tsx"],
    "tabbed-view": ["src/components/variable/programs/ProgramTabbedView.tsx"],
  },
  impact: {
    "stat-grid-recharts": ["src/components/variable/impact/ImpactStatGrid.tsx"],
    "story-cards": ["src/components/variable/impact/ImpactStoryCards.tsx"],
  },
  gallery: {
    "masonry-grid": ["src/components/variable/gallery/GalleryMasonryGrid.tsx"],
    "filter-grid": ["src/components/variable/gallery/GalleryFilterGrid.tsx"],
  },
  events: {
    "calendar-cards": ["src/components/variable/events/EventCalendarCards.tsx"],
    "timeline-list": ["src/components/variable/events/EventTimelineList.tsx"],
  },
  footer: {
    "multi-column-detailed": ["src/components/fixed/LegalFooter.tsx"],
    "compact-single-row": ["src/components/fixed/LegalFooter.tsx"],
  },
  aboutPage: {
    "story-led": ["src/routes/about.tsx"],
    "portrait-split": ["src/routes/about.tsx"],
    "impact-led": ["src/routes/about.tsx"],
  },
  aboutOverview: {
    "story-panel": ["src/components/variable/home/HomeOverviewSections.tsx"],
    "spotlight-grid": ["src/components/variable/home/HomeOverviewSections.tsx"],
    "community-portrait": ["src/components/variable/home/HomeOverviewSections.tsx"],
    "trust-matrix": ["src/components/variable/home/HomeOverviewSections.tsx"],
  },
  programsOverview: {
    "pillar-cards": ["src/components/variable/home/HomeOverviewSections.tsx"],
    "feature-showcase": ["src/components/variable/home/HomeOverviewSections.tsx"],
  },
  impactOverview: {
    "metric-band": ["src/components/variable/home/HomeOverviewSections.tsx"],
    "proof-panel": ["src/components/variable/home/HomeOverviewSections.tsx"],
  },
  galleryOverview: {
    "feature-collage": ["src/components/variable/home/HomeOverviewSections.tsx"],
    "mosaic-showcase": ["src/components/variable/home/HomeOverviewSections.tsx"],
  },
  donationOverview: {
    "support-banner": ["src/components/variable/home/HomeOverviewSections.tsx"],
    "impact-panel": ["src/components/variable/home/HomeOverviewSections.tsx"],
  },
};

const dedupe = (items: string[]) => [...new Set(items)];

export const getVariantSelectedFiles = (variants: VariantState): string[] => {
  return dedupe(
    (Object.keys(variantCatalog) as Array<keyof VariantState>).flatMap((category) => {
      const selected = variants[category];
      return variantFileRegistry[category][selected] ?? [];
    }),
  );
};

export const getVariantUnusedFiles = (variants: VariantState): string[] => {
  const unused: string[] = [];

  for (const category of Object.keys(variantCatalog) as Array<keyof VariantState>) {
    const selectedFiles = variantFileRegistry[category][variants[category]] ?? [];
    const allFiles = dedupe(
      (Object.values(variantFileRegistry[category]) as string[][]).flat(),
    );

    for (const file of allFiles) {
      if (!selectedFiles.includes(file)) {
        unused.push(file);
      }
    }
  }

  return dedupe(unused);
};

export const getVariantCleanupPrompt = (variants: VariantState): string => {
  const selectedFiles = getVariantSelectedFiles(variants);
  const unusedFiles = getVariantUnusedFiles(variants);

  return [
    `Delete these files: ${unusedFiles.length > 0 ? unusedFiles.join(", ") : "none"}.`,
    "Remove the variant bar and all variant-switching logic (state, context, props, imports, localStorage, etc.).",
    `Replace each section's variant switcher with a direct import of the selected variant: ${selectedFiles.join(", ")}.`,
    "Make it a normal website using only the remaining variants, with no unused imports or dead code, and make sure the project still builds.",
  ].join(" ");
};

/** Human-readable options per category, used by the floating switcher bar. */
export const variantCatalog: {
  [K in keyof VariantState]: {
    label: string;
    options: Array<{ value: VariantState[K]; label: string }>;
  };
} = {
  navbar: {
    label: "Navbar",
    options: [
      { value: "action-topbar", label: "Action Topbar" },
      { value: "overlay-floating", label: "Overlay Floating" },
      { value: "centered-classic", label: "Centered Classic" },
    ],
  },
  hero: {
    label: "Hero",
    options: [
      { value: "split-action", label: "Split Action" },
      { value: "media-slider", label: "Media Slider" },
      { value: "campaign-spotlight", label: "Campaign Spotlight" },
    ],
  },
  programs: {
    label: "Programs",
    options: [
      { value: "card-grid", label: "Card Grid" },
      { value: "feature-blocks", label: "Feature Blocks" },
      { value: "tabbed-view", label: "Tabbed View" },
    ],
  },
  impact: {
    label: "Impact",
    options: [
      { value: "stat-grid-recharts", label: "Stat Grid + Charts" },
      { value: "story-cards", label: "Story Cards" },
    ],
  },
  gallery: {
    label: "Gallery",
    options: [
      { value: "masonry-grid", label: "Masonry Grid" },
      { value: "filter-grid", label: "Filter Grid" },
    ],
  },
  events: {
    label: "Events",
    options: [
      { value: "calendar-cards", label: "Calendar Cards" },
      { value: "timeline-list", label: "Timeline List" },
    ],
  },
  footer: {
    label: "Footer",
    options: [
      { value: "multi-column-detailed", label: "Detailed" },
      { value: "compact-single-row", label: "Compact" },
    ],
  },
  aboutPage: {
    label: "About Variants",
    options: [
      { value: "story-led", label: "Variant 1" },
      { value: "portrait-split", label: "Variant 2" },
      { value: "impact-led", label: "Variant 3" },
    ],
  },
  aboutOverview: {
    label: "About Overview",
    options: [
      { value: "story-panel", label: "Variant 1" },
      { value: "spotlight-grid", label: "Variant 2" },
      { value: "community-portrait", label: "Variant 3" },
      { value: "trust-matrix", label: "Variant 4" },
    ],
  },
  programsOverview: {
    label: "Programs Overview",
    options: [
      { value: "pillar-cards", label: "Variant 1" },
      { value: "feature-showcase", label: "Variant 2" },
    ],
  },
  impactOverview: {
    label: "Impact Overview",
    options: [
      { value: "metric-band", label: "Variant 1" },
      { value: "proof-panel", label: "Variant 2" },
    ],
  },
  galleryOverview: {
    label: "Gallery Overview",
    options: [
      { value: "feature-collage", label: "Variant 1" },
      { value: "mosaic-showcase", label: "Variant 2" },
    ],
  },
  donationOverview: {
    label: "Donation / CTA",
    options: [
      { value: "support-banner", label: "Variant 1" },
      { value: "impact-panel", label: "Variant 2" },
    ],
  },
};

export const variantOptions: {
  [K in keyof VariantState]: Array<{ value: VariantState[K]; label: string }>;
} = {
  navbar: variantCatalog.navbar.options,
  hero: variantCatalog.hero.options,
  programs: variantCatalog.programs.options,
  impact: variantCatalog.impact.options,
  gallery: variantCatalog.gallery.options,
  events: variantCatalog.events.options,
  footer: variantCatalog.footer.options,
  aboutPage: variantCatalog.aboutPage.options,
  aboutOverview: variantCatalog.aboutOverview.options,
  programsOverview: variantCatalog.programsOverview.options,
  impactOverview: variantCatalog.impactOverview.options,
  galleryOverview: variantCatalog.galleryOverview.options,
  donationOverview: variantCatalog.donationOverview.options,
};

export const variantCategories = Object.keys(defaultVariants) as Array<keyof VariantState>;

interface VariantContextType {
  variants: VariantState;
  setVariant: <K extends keyof VariantState>(category: K, variant: VariantState[K]) => void;
  resetToDefaults: () => void;
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

const STORAGE_KEY = "ocms.variants";

export function VariantProvider({ children }: { children: ReactNode }) {
  // Always start from defaults so SSR and first client render match.
  const [variants, setVariants] = useState<VariantState>(defaultVariants);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<VariantState>;
      setVariants((prev) => ({ ...prev, ...parsed }));
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const setVariant = useCallback(
    <K extends keyof VariantState>(category: K, variant: VariantState[K]) => {
      setVariants((prev) => {
        const next = { ...prev, [category]: variant };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* storage unavailable */
        }
        return next;
      });
    },
    [],
  );

  const resetToDefaults = useCallback(() => {
    setVariants(defaultVariants);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(
    () => ({ variants, setVariant, resetToDefaults }),
    [variants, setVariant, resetToDefaults],
  );

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
}

export const useVariants = () => {
  const context = useContext(VariantContext);
  if (!context) throw new Error("useVariants must be used within a VariantProvider");
  return context;
};
