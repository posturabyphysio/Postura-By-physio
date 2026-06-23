import type { VideoUploadPresignDto } from "@repo/types";

/**
 * PUT a video file to a Supabase signed upload URL (from
 * `POST /api/uploads/video/presign`). Matches the FormData shape that
 * `@supabase/storage-js` uses for `uploadToSignedUrl`.
 */
export async function putVideoToSignedUrl(
  file: File,
  signedUrl: string
): Promise<void> {
  const formData = new FormData();
  formData.append("cacheControl", "31536000");
  formData.append("", file);

  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: { "x-upsert": "false" },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Storage upload failed (${res.status})`);
  }
}

/**
 * Request a presign token from our API, upload directly to Supabase, and
 * return the public CDN URL to store on the testimonial.
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

  if (!res.ok || json.success === false || !json.data?.signedUrl) {
    throw new Error(json.error ?? `Upload failed (${res.status})`);
  }

  await putVideoToSignedUrl(file, json.data.signedUrl);
  return json.data.url;
}
