import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Images, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { GALLERY_BUCKET } from "@/lib/storageBuckets";
import { GALLERY_CATEGORIES } from "@/lib/adminConstants";
import { EmptyState, LoadingRows, PanelHeader, formatDate } from "./primitives";
import { cn } from "@/lib/utils";

type GalleryRow = Tables<"gallery_items">;


function GalleryThumb({ row }: { row: GalleryRow }) {
  const [src, setSrc] = useState<string | null>(
    row.image_url && /^https?:\/\//i.test(row.image_url) ? row.image_url : null,
  );

  useEffect(() => {
    let active = true;
    if (row.image_url && !/^https?:\/\//i.test(row.image_url)) {
      void supabase.storage
        .from(GALLERY_BUCKET)
        .createSignedUrl(row.image_url, 3600)
        .then(({ data }) => {
          if (active) setSrc(data?.signedUrl ?? null);
        });
    }
    return () => {
      active = false;
    };
  }, [row.image_url]);

  return src ? (
    <img
      src={src}
      alt={row.category ?? row.id}
      loading="lazy"
      className="h-36 w-full object-cover"
    />
  ) : (
    <div className="h-36 w-full animate-pulse bg-muted" />
  );
}

export function GalleryManager() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<string>("General");
  const [filter, setFilter] = useState<string>("All");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const items = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "counts"] });
  };

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (list.length === 0) {
        toast.error("Only image files can be uploaded here.");
        return;
      }
      setUploading(true);
      let uploaded = 0;
      for (const file of list) {
        const path = `${category.toLowerCase()}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error: uploadError } = await supabase.storage
          .from(GALLERY_BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadError) {
          toast.error(`Upload failed: ${file.name}`, {
            description: uploadError.message,
          });
          continue;
        }
        const { error: insertError } = await supabase.from("gallery_items").insert({
          image_url: path,
          category: category,
        });
        if (insertError) {
          toast.error(`Could not index ${file.name}`, {
            description: insertError.message,
          });
          continue;
        }
        uploaded += 1;
      }
      setUploading(false);
      if (uploaded > 0) {
        toast.success(`${uploaded} file${uploaded > 1 ? "s" : ""} added to the gallery`);
        invalidate();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category],
  );

  const remove = useMutation({
    mutationFn: async (row: GalleryRow) => {
      // Attempt to determine the storage path for the stored image. The
      // `image_url` column may contain either a raw storage path (preferred)
      // or a publicly-resolvable URL. Supabase Storage's `remove` expects the
      // relative path inside the bucket.
      const extractStoragePath = (imageUrl: string | null | undefined): string | null => {
        if (!imageUrl) return null;
        if (!/^https?:\/\//i.test(imageUrl)) return imageUrl;
        const marker = '/object/public/';
        const i = imageUrl.indexOf(marker);
        if (i === -1) return null;
        const tail = imageUrl.substring(i + marker.length);
        const parts = tail.split('/');
        if (parts.length < 2) return null;
        const bucket = parts.shift();
        const path = parts.join('/');
        return bucket === GALLERY_BUCKET ? path : null;
      };

      const storagePath = extractStoragePath(row.image_url);
      if (storagePath) {
        const { error: removeError } = await supabase.storage.from(GALLERY_BUCKET).remove([storagePath]);
        if (removeError) throw removeError;
      }

      const { error } = await supabase.from("gallery_items").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Media removed");
      invalidate();
    },
    onError: (error: Error) => toast.error("Delete failed", { description: error.message }),
  });

  const retag = useMutation({
    mutationFn: async ({ row, tag }: { row: GalleryRow; tag: string }) => {
      const { error } = await supabase
        .from("gallery_items")
        .update({ category: tag })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category updated");
      invalidate();
    },
  });

  const visible = (items.data ?? []).filter(
    (row) => filter === "All" || row.category === filter,
  );

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Gallery uploader"
        description="Drag photos straight into the media library and tag them by program."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void uploadFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center rounded-card border-2 border-dashed p-8 text-center transition-colors",
            dragging ? "border-brand bg-brand-muted/40" : "border-border bg-muted/30",
          )}
        >
          <UploadCloud className="size-8 text-brand" aria-hidden />
          <p className="mt-3 text-sm font-semibold">
            Drag & drop images here
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG or WebP · uploaded to the secure media library
          </p>
          <Label htmlFor="gallery-file" className="sr-only">
            Choose gallery images
          </Label>
          <Input
            id="gallery-file"
            type="file"
            accept="image/*"
            multiple
            className="mt-4 max-w-xs cursor-pointer"
            disabled={uploading}
            onChange={(event) => {
              if (event.target.files?.length) void uploadFiles(event.target.files);
              event.target.value = "";
            }}
          />
          {uploading ? (
            <p className="mt-3 text-xs font-medium text-brand" role="status">
              Uploading…
            </p>
          ) : null}
        </div>

        <div className="space-y-4 rounded-card border border-border bg-card p-4">
          <div className="space-y-1.5">
            <Label htmlFor="gallery-category">Tag new uploads as</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="gallery-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GALLERY_CATEGORIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gallery-filter">Filter library</Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger id="gallery-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All categories</SelectItem>
                {GALLERY_CATEGORIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            {items.data?.length ?? 0} items in the library
          </p>
        </div>
      </div>

      {items.isLoading ? (
        <LoadingRows rows={2} />
      ) : visible.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((row) => (
            <li
              key={row.id}
              className="overflow-hidden rounded-card border border-border bg-card"
            >
              <GalleryThumb row={row} />
              <div className="space-y-3 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {row.title}
                  </p>
                  <Badge variant="outline">{row.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Added {formatDate(row.created_at)}
                </p>
                <div className="flex items-center gap-2">
                  <Select
                    value={row.category}
                    onValueChange={(tag) => retag.mutate({ row, tag })}
                  >
                    <SelectTrigger
                      className="h-8 flex-1 text-xs"
                      aria-label={`Change category for ${row.title}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GALLERY_CATEGORIES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive hover:text-destructive"
                    aria-label={`Delete ${row.title}`}
                    onClick={() => remove.mutate(row)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<Images className="size-5" aria-hidden />}
          title="Nothing in this category"
          description="Upload photos above, or switch the filter to see the rest of the library."
        />
      )}
    </div>
  );
}

export default GalleryManager;
