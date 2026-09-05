import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file straight from the browser to a private Supabase Storage
 * bucket, converting HEIC/HEIF images (common from iOS Safari screenshots)
 * to WebP first, since no mainstream browser can render HEIC in an <img>.
 *
 * Uploading directly to Storage — instead of proxying the file's bytes
 * through a server function — avoids inflating a 5MB file into ~6.7MB of
 * base64 text in a JSON request body, and lets Supabase's own storage RLS
 * policies (insert-only for anon on these buckets) do the access control.
 * The database record that references the resulting path is still written
 * through a validated server function — see `src/lib/public.functions.ts`.
 */

const MAX_BYTES = 5 * 1024 * 1024;

export class FileUploadError extends Error {}

function isHeic(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

async function convertHeicToWebp(file: File): Promise<File> {
  try {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({
      blob: file,
      toType: "image/webp",
      quality: 0.85,
    });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    const newName = file.name.replace(/\.(heic|heif)$/i, "") + ".webp";
    return new File([blob], newName, { type: "image/webp" });
  } catch (err) {
    console.error("HEIC conversion failed", err);
    throw new FileUploadError(
      "This iPhone photo format (HEIC) couldn't be converted in your browser. Please attach a JPG, PNG, or PDF instead.",
    );
  }
}

export interface UploadResult {
  path: string;
  bucket: string;
}

/**
 * Uploads `file` to `bucket` under a collision-resistant path. Converts
 * HEIC/HEIF to WebP first when `allowHeicConversion` is true (only relevant
 * for image buckets like receipts — CVs are PDF/DOC, not photos).
 */
export async function uploadPrivateFile(
  file: File,
  bucket: string,
  options: { allowHeicConversion?: boolean } = {},
): Promise<UploadResult> {
  if (file.size > MAX_BYTES) {
    throw new FileUploadError("Please attach a file under 5 MB.");
  }

  let toUpload = file;
  if (options.allowHeicConversion && isHeic(file)) {
    toUpload = await convertHeicToWebp(file);
  }

  const extension = toUpload.name.split(".").pop()?.toLowerCase() ?? "bin";
  const baseName = toUpload.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .slice(0, 60);
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.${extension}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, toUpload, { contentType: toUpload.type, upsert: false });

  if (error) {
    console.error(`Upload to bucket "${bucket}" failed`, error);
    throw new FileUploadError(
      "We couldn't upload your file. Please check your connection and try again.",
    );
  }

  return { path: data.path, bucket };
}
