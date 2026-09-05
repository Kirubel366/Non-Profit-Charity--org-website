import useSiteProfile from "@/hooks/useSiteProfile";
import { useVariants } from "@/context/VariantContext";
import type { NavbarData } from "@/types/schema";
import { NavbarActionTopBar } from "./NavbarActionTopBar";
import { NavbarOverlayFloating } from "./NavbarOverlayFloating";
import { NavbarCenteredClassic } from "./NavbarCenteredClassic";

/** Renders the navbar variant currently selected in VariantContext. */
export function NavbarRenderer({ data }: { data: NavbarData }) {
  const { variants } = useVariants();

  const { phones, email } = useSiteProfile();

  const mergedData: NavbarData = {
    ...data,
    emergencyPhone: phones[0] ?? data.emergencyPhone,
  };

  switch (variants.navbar) {
    case "overlay-floating":
      return <NavbarOverlayFloating data={mergedData} />;
    case "centered-classic":
      return <NavbarCenteredClassic data={mergedData} />;
    case "action-topbar":
    default:
      return <NavbarActionTopBar data={mergedData} />;
  }
}
