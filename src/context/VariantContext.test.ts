import assert from "node:assert/strict";
import test from "node:test";

import { getVariantCleanupPrompt, type VariantState } from "./VariantContext.tsx";

const customVariants: VariantState = {
  navbar: "overlay-floating",
  hero: "campaign-spotlight",
  programs: "feature-blocks",
  impact: "story-cards",
  gallery: "filter-grid",
  events: "timeline-list",
  footer: "compact-single-row",
  aboutPage: "portrait-split",
  aboutOverview: "community-portrait",
  programsOverview: "feature-showcase",
  impactOverview: "proof-panel",
  galleryOverview: "mosaic-showcase",
  donationOverview: "impact-panel",
};

test("cleanup prompt keeps selected variant files and marks unselected ones for deletion", () => {
  const prompt = getVariantCleanupPrompt(customVariants);

  assert.match(prompt, /^Delete these files:/);
  assert.match(prompt, /NavbarActionTopBar\.tsx/);
  assert.match(prompt, /NavbarCenteredClassic\.tsx/);
  assert.match(prompt, /HeroSplitAction\.tsx/);
  assert.match(prompt, /HeroMediaSlider\.tsx/);
  assert.match(prompt, /ProgramCardGrid\.tsx/);
  assert.match(prompt, /ProgramTabbedView\.tsx/);
  assert.match(prompt, /ImpactStatGrid\.tsx/);
  assert.match(prompt, /GalleryMasonryGrid\.tsx/);
  assert.match(prompt, /EventCalendarCards\.tsx/);
  assert.match(prompt, /FooterRenderer\.tsx|LegalFooter\.tsx/);

  assert.match(prompt, /Replace each section's variant switcher with a direct import of the selected variant: .*NavbarOverlayFloating\.tsx.*HeroCampaignSpotlight\.tsx/);
  assert.match(prompt, /Make it a normal website using only the remaining variants/);
  assert.match(prompt, /make sure the project still builds\./);
});
