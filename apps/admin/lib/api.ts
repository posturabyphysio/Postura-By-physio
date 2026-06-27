import type {
  ApiResponse,
  AvailabilitySlotDto,
  BlockedDateDto,
  BlogDto,
  BookingDto,
  CertificationDto,
  CreateAvailabilitySlotDto,
  CreateBlockedDateDto,
  CreateBlogDto,
  CreateBookingDto,
  CreateCertificationDto,
  CreateGalleryImageDto,
  CreateTestimonialDto,
  GalleryImageDto,
  ListBlogsQuery,
  ListBookingsQuery,
  ListCertificationsQuery,
  ListGalleryQuery,
  ListTestimonialsQuery,
  TestimonialDto,
  UpdateBlogDto,
  UpdateBookingDto,
  UpdateCertificationDto,
  UpdateGalleryImageDto,
  UpdateTestimonialDto,
  UploadResultDto,
  VideoUploadPresignDto,
} from "@repo/types";

/**
 * Base URL of the web app that hosts the APIs. Comes from the shared
 * root-level .env (NEXT_PUBLIC_API_BASE_URL). Defaults to localhost:3000.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

// ---------- Shared ----------
export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  public readonly status: number;
  public readonly fieldErrors?: FieldErrors;

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Mirrors `apps/web/lib/storage.ts` — keep in sync when limits change. */
export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024;

function isNetworkFetchError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg === "failed to fetch" ||
    msg.includes("networkerror") ||
    msg.includes("load failed") ||
    msg.includes("network request failed")
  );
}

function httpStatusMessage(status: number, kind: "image" | "video"): string | null {
  const maxMb =
    kind === "video"
      ? MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024)
      : MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024);

  switch (status) {
    case 413:
      return kind === "video"
        ? `Video too large. Max size is ${maxMb}MB. Trim the clip and try again.`
        : `Image too large. Max size is ${maxMb}MB.`;
    case 415:
      return kind === "video"
        ? "Unsupported video type. Use MP4, MOV, or WebM."
        : "Unsupported image type.";
    default:
      return null;
  }
}

/**
 * Turns opaque browser/network upload failures into actionable copy.
 * Cross-origin uploads that hit Vercel's body-size limit often surface as
 * "Failed to fetch" because the 413 response lacks CORS headers.
 */
export function uploadErrorMessage(
  err: unknown,
  kind: "image" | "video"
): string {
  const maxMb =
    kind === "video"
      ? MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024)
      : MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024);

  if (err instanceof ApiError) {
    const fromStatus = httpStatusMessage(err.status, kind);
    if (fromStatus) return fromStatus;

    if (
      err.message &&
      !err.message.startsWith("Request failed (") &&
      !err.message.startsWith("Unreadable response (")
    ) {
      return err.message;
    }
  }

  if (isNetworkFetchError(err)) {
    return kind === "video"
      ? `Upload could not complete — the video may be too large (max ${maxMb}MB) or the connection was interrupted. Try a smaller or shorter clip.`
      : `Upload could not complete — the file may be too large (max ${maxMb}MB) or the connection was interrupted.`;
  }

  if (err instanceof Error && err.message.toLowerCase() !== "failed to fetch") {
    return err.message;
  }

  return "Upload failed. Please try again.";
}

/** Browser-safe Supabase config — required on the admin app for video uploads. */
function getSupabasePublicConfig(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new ApiError(
      "Supabase is not configured for video uploads. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY on the admin app.",
      500
    );
  }

  return { url, key };
}

async function uploadFileToSupabaseBucket(
  bucket: string,
  path: string,
  file: File,
  config?: { url: string; key: string }
): Promise<void> {
  const { url, key } = config ?? getSupabasePublicConfig();
  const objectPath = path.split("/").map(encodeURIComponent).join("/");

  const res = await fetch(
    `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
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
      const json = JSON.parse(text) as { message?: string; error?: string };
      message = json.message ?? json.error ?? message;
    } catch {
      if (text) message = text;
    }
    throw new ApiError(message, res.status);
  }
}

type ListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<{ data: T; meta?: ListMeta }> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers = new Headers(init?.headers);
  if (init?.json !== undefined) headers.set("Content-Type", "application/json");

  const res = await fetch(url, {
    ...init,
    headers,
    body:
      init?.json !== undefined
        ? JSON.stringify(init.json)
        : (init?.body as BodyInit | null | undefined),
    cache: "no-store",
  });

  const text = await res.text();
  let body: ApiResponse<T> & { meta?: ListMeta } & {
    issues?: { fieldErrors?: FieldErrors };
  };
  try {
    body = text ? JSON.parse(text) : ({} as never);
  } catch {
    const generic =
      res.status === 413
        ? "File too large. The server rejected the upload."
        : `Unreadable response (${res.status})`;
    throw new ApiError(generic, res.status);
  }

  if (!res.ok || body.success === false) {
    const errMsg =
      body && body.success === false ? body.error : `Request failed (${res.status})`;
    const fieldErrors =
      body && body.success === false && body.issues
        ? (body.issues as { fieldErrors?: FieldErrors }).fieldErrors
        : undefined;
    throw new ApiError(errMsg, res.status, fieldErrors);
  }

  return { data: body.data as T, meta: body.meta };
}

// ---------- Blogs ----------
function qs(params: Record<string, unknown> = {}): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    searchParams.set(key, String(value));
  }
  const s = searchParams.toString();
  return s ? `?${s}` : "";
}

export const blogsApi = {
  list: (query: ListBlogsQuery = {}) =>
    request<BlogDto[]>(
      `/api/blogs${qs(query as Record<string, unknown>)}`
    ),

  get: (idOrSlug: string) =>
    request<BlogDto>(`/api/blogs/${encodeURIComponent(idOrSlug)}`),

  create: (data: CreateBlogDto) =>
    request<BlogDto>("/api/blogs", { method: "POST", json: data }),

  update: (idOrSlug: string, data: UpdateBlogDto) =>
    request<BlogDto>(`/api/blogs/${encodeURIComponent(idOrSlug)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (idOrSlug: string) =>
    request<{ id: string; deleted: true }>(
      `/api/blogs/${encodeURIComponent(idOrSlug)}`,
      { method: "DELETE" }
    ),
};

// ---------- Bookings ----------
export const bookingsApi = {
  list: (query: ListBookingsQuery = {}) =>
    request<BookingDto[]>(
      `/api/bookings${qs(query as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<BookingDto>(`/api/bookings/${encodeURIComponent(id)}`),

  create: (data: CreateBookingDto) =>
    request<BookingDto>("/api/bookings", { method: "POST", json: data }),

  update: (id: string, data: UpdateBookingDto) =>
    request<BookingDto>(`/api/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/bookings/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Testimonials ----------
export const testimonialsApi = {
  list: (query: ListTestimonialsQuery = {}) =>
    request<TestimonialDto[]>(
      `/api/testimonials${qs(query as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<TestimonialDto>(`/api/testimonials/${encodeURIComponent(id)}`),

  create: (data: CreateTestimonialDto) =>
    request<TestimonialDto>("/api/testimonials", {
      method: "POST",
      json: data,
    }),

  update: (id: string, data: UpdateTestimonialDto) =>
    request<TestimonialDto>(`/api/testimonials/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/testimonials/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Gallery ----------
export const galleryApi = {
  list: (query: ListGalleryQuery = {}) =>
    request<GalleryImageDto[]>(
      `/api/gallery${qs(query as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<GalleryImageDto>(`/api/gallery/${encodeURIComponent(id)}`),

  create: (data: CreateGalleryImageDto) =>
    request<GalleryImageDto>("/api/gallery", {
      method: "POST",
      json: data,
    }),

  update: (id: string, data: UpdateGalleryImageDto) =>
    request<GalleryImageDto>(`/api/gallery/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/gallery/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Certifications ----------
export const certificationsApi = {
  list: (query: ListCertificationsQuery = {}) =>
    request<CertificationDto[]>(
      `/api/certifications${qs(query as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<CertificationDto>(`/api/certifications/${encodeURIComponent(id)}`),

  create: (data: CreateCertificationDto) =>
    request<CertificationDto>("/api/certifications", {
      method: "POST",
      json: data,
    }),

  update: (id: string, data: UpdateCertificationDto) =>
    request<CertificationDto>(`/api/certifications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/certifications/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Availability ----------
export const availabilityApi = {
  listSlots: () => request<AvailabilitySlotDto[]>("/api/availability/slots"),

  createSlot: (data: CreateAvailabilitySlotDto) =>
    request<AvailabilitySlotDto>("/api/availability/slots", {
      method: "POST",
      json: data,
    }),

  removeSlot: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/availability/slots/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),

  listBlockedDates: () => request<BlockedDateDto[]>("/api/availability/blocked-dates"),

  createBlockedDate: (data: CreateBlockedDateDto) =>
    request<BlockedDateDto>("/api/availability/blocked-dates", {
      method: "POST",
      json: data,
    }),

  removeBlockedDate: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/availability/blocked-dates/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Uploads ----------
export const uploadsApi = {
  /**
   * Uploads a single image file and returns the public URL. Pass the result
   * of an `<input type="file">` change event's `files[0]`.
   */
  image: async (file: File): Promise<UploadResultDto> => {
    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      throw new ApiError(
        `Image too large. Max size is ${MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024)}MB.`,
        413
      );
    }

    const form = new FormData();
    form.append("file", file);
    try {
      const { data } = await request<UploadResultDto>("/api/uploads", {
        method: "POST",
        body: form,
      });
      return data;
    } catch (err) {
      throw new ApiError(
        uploadErrorMessage(err, "image"),
        err instanceof ApiError ? err.status : 0
      );
    }
  },

  /**
   * Uploads a single video file and returns the public URL. Reserves an
   * object path via `/api/uploads/video/presign`, then POSTs the file
   * directly to Supabase Storage so large clips bypass Vercel's body limit.
   */
  video: async (file: File): Promise<UploadResultDto> => {
    if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
      throw new ApiError(
        `Video too large. Max size is ${MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024)}MB. Trim the clip and try again.`,
        413
      );
    }

    try {
      const { data: presign } = await request<VideoUploadPresignDto>(
        "/api/uploads/video/presign",
        {
          method: "POST",
          json: {
            mime: file.type,
            size: file.size,
            originalName: file.name,
          },
        }
      );

      await uploadFileToSupabaseBucket(
        presign.bucket,
        presign.path,
        file,
        presign.supabaseUrl && presign.supabaseKey
          ? { url: presign.supabaseUrl, key: presign.supabaseKey }
          : undefined
      );

      return {
        url: presign.url,
        path: presign.path,
        size: file.size,
        mime: file.type || presign.mime,
      };
    } catch (err) {
      throw new ApiError(
        uploadErrorMessage(err, "video"),
        err instanceof ApiError ? err.status : 0
      );
    }
  },
};
