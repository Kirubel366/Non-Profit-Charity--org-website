import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GALLERY_BUCKET } from "@/lib/storageBuckets";
import type { GalleryCategory, GalleryItem } from "@/types/schema";

const KNOWN_CATEGORIES: readonly GalleryCategory[] = [
  "General",
  "Education",
  "Shelter",
  "Healthcare",
  "Events",
];

function toCategory(raw: string): GalleryCategory {
  return (KNOWN_CATEGORIES as readonly string[]).includes(raw)
    ? (raw as GalleryCategory)
    : "General";
}

/**
 * `gallery_items.image_url` is written by GalleryManager.tsx as a raw
 * Storage path (e.g. "general/uuid-photo.jpg"), not a resolvable URL —
 * rendering it directly as an <img src> gives a broken image. Resolve it
 * against the (public) gallery bucket. If a row's image_url is already a
 * full URL (e.g. a legacy/external item), use it as-is.
 */
function resolveMediaUrl(imageUrl: string): string {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return supabase.storage.from(GALLERY_BUCKET).getPublicUrl(imageUrl).data.publicUrl;
}

/**
 * Live gallery items from the `gallery_items` table (the same table
 * GalleryManager.tsx in the admin panel writes to). Shared by the public
 * gallery page and the homepage gallery teaser so both reflect whatever
 * admins have actually published, instead of static placeholder content.
 */
export function usePublicGalleryItems(limit = 24) {
  const query = useQuery({
    queryKey: ["public", "gallery", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });

  const items: GalleryItem[] = (query.data ?? []).map((row) => ({
    id: row.id,
    title: (row.image_url ?? row.id).split("/").pop()?.replace(/\.[^.]+$/, "") ?? row.id,
    categoryTag: toCategory(row.category),
    mediaUri: resolveMediaUrl(row.image_url),
    thumbnailUri: undefined,
    isVideo: false,
  }));

  return { items, isLoading: query.isPending, isError: query.isError };
}
