import type { VideoUploadPresignDto } from "@repo/types";
import { uploadFileToSupabaseBucket } from "@/lib/supabase-storage-client";

/**
 * Request an upload slot from our API, push the file directly to Supabase
 * Storage, and return the public CDN URL to store on the testimonial.
 */
export async function uploadVideoDirect(
  file: File,
  presignEndpoint = "/api/uploads/video/presign"
): Promise<string> {
  const res = await fetch(presignEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mime: file.type,
      size: file.size,
      originalName: file.name,
    }),
  });

  const json = (await res.json().catch(() => ({}))) as {
    data?: VideoUploadPresignDto;
    error?: string;
    success?: boolean;
  };

  if (!res.ok || json.success === false || !json.data?.path) {
    throw new Error(json.error ?? `Upload failed (${res.status})`);
  }

  const config = {
    url: json.data.supabaseUrl,
    key: json.data.supabaseKey,
  };
  await uploadFileToSupabaseBucket(
    json.data.bucket,
    json.data.path,
    file,
    config
  );

  return json.data.url;
}
