/**
 * Browser-side Supabase Storage upload helpers. Uses the publishable key so
 * large files go straight to Storage without passing through Vercel.
 */

export type SupabasePublicConfig = {
  url: string;
  key: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured for browser uploads. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return { url, key };
}

/**
 * POST a file to a public Supabase Storage bucket using the REST API.
 * Requires an INSERT policy on `storage.objects` for the target bucket.
 */
export async function uploadFileToSupabaseBucket(
  bucket: string,
  path: string,
  file: File,
  config: SupabasePublicConfig = getSupabasePublicConfig()
): Promise<void> {
  const objectPath = path.split("/").map(encodeURIComponent).join("/");

  const res = await fetch(
    `${config.url}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
        "cache-control": "max-age=31536000",
      },
      body: file,
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `Storage upload failed (${res.status})`;
    try {
      const json = JSON.parse(text) as {
        message?: string;
        error?: string;
        statusCode?: string;
      };
      message = json.message ?? json.error ?? message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
}
