import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Supabase Storage helpers for image uploads.
 *
 * Bucket name defaults to `blog-images` and is created on demand as a
 * PUBLIC bucket the first time a file is uploaded. Setting the env var
 * `SUPABASE_STORAGE_BUCKET` lets you override this.
 *
 * Only the web app (server-side) uses these helpers — the service-role
 * key never leaves the backend.
 */

export const BUCKET_NAME =
  process.env.SUPABASE_STORAGE_BUCKET ?? "blog-images";

/** Allowed image MIME types. Matches browser `<input accept>` below. */
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

/** 5 MB cap. Bump later if you need larger assets. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Derive a safe extension from either the MIME type or the original name. */
export function extensionFor(mime: string, fallbackName?: string): string {
  const fromMime: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };
  if (fromMime[mime]) return fromMime[mime];
  if (fallbackName) {
    const match = /\.([a-zA-Z0-9]{2,5})$/.exec(fallbackName);
    if (match) return match[1].toLowerCase();
  }
  return "bin";
}

let bucketReady = false;

/**
 * Make sure the target bucket exists, creating it as PUBLIC on first run.
 * Result is cached per-process so we only hit the Storage admin API once.
 */
async function ensureBucket(): Promise<void> {
  if (bucketReady) return;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);
  if (!error && data) {
    bucketReady = true;
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(
    BUCKET_NAME,
    {
      public: true,
      fileSizeLimit: MAX_UPLOAD_BYTES,
    }
  );
  // Treat "already exists" as success in case of a race.
  if (createError && !/already exists/i.test(createError.message)) {
    throw new Error(`Failed to create bucket: ${createError.message}`);
  }
  bucketReady = true;
}

export type UploadResult = {
  url: string;
  path: string;
  size: number;
  mime: string;
};

/**
 * Upload a single image buffer to the `blog-images` bucket and return its
 * public URL. Generates a year/month scoped path with a random filename so
 * collisions are effectively impossible.
 */
export async function uploadImage({
  bytes,
  mime,
  originalName,
}: {
  bytes: ArrayBuffer | Uint8Array;
  mime: string;
  originalName?: string;
}): Promise<UploadResult> {
  await ensureBucket();
  const supabase = getSupabaseAdmin();

  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const ext = extensionFor(mime, originalName);
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const path = `${yyyy}/${mm}/${id}.${ext}`;

  const buffer = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const size = buffer.byteLength;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: mime,
      upsert: false,
      cacheControl: "31536000",
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return { url: data.publicUrl, path, size, mime };
}
