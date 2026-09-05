import { useVariants } from "@/context/VariantContext";
import type { HeroData } from "@/types/schema";
import { HeroSplitAction } from "./HeroSplitAction";
import { HeroMediaSlider } from "./HeroMediaSlider";
import { HeroCampaignSpotlight } from "./HeroCampaignSpotlight";

/** Renders the hero variant currently selected in VariantContext. */
export function HeroRenderer({ data }: { data: HeroData }) {
  const { variants } = useVariants();

  switch (variants.hero) {
    case "media-slider":
      return <HeroMediaSlider data={data} />;
    case "campaign-spotlight":
      return <HeroCampaignSpotlight data={data} />;
    case "split-action":
    default:
      return <HeroSplitAction data={data} />;
  }
}
