import { NextRequest } from "next/server";
import { fail, handleError, ok } from "@/lib/api/response";
import {
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_UPLOAD_BYTES,
  prepareVideoUpload,
} from "@/lib/storage";

export const runtime = "nodejs";

/**
 * POST /api/uploads/video/presign
 *
 * JSON body: `{ mime, size, originalName? }`. Ensures the video bucket
 * exists and returns `{ bucket, path, url }` so the browser can POST the
 * file directly to Supabase Storage (bypassing Vercel's body-size limit).
 */
export async function POST(req: NextRequest) {
  try {
    let body: { mime?: unknown; size?: unknown; originalName?: unknown };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return fail("Expected JSON body with `mime` and `size`.", 400);
    }

    const mime = typeof body.mime === "string" ? body.mime : "";
    const size = typeof body.size === "number" ? body.size : NaN;
    const originalName =
      typeof body.originalName === "string" ? body.originalName : undefined;

    if (!mime || Number.isNaN(size)) {
      return fail("`mime` (string) and `size` (number) are required.", 400);
    }

    if (!ALLOWED_VIDEO_TYPES.has(mime)) {
      return fail(
        `Unsupported video type: ${mime || "unknown"}. Allowed: mp4, mov, webm, ogg.`,
        415
      );
    }

    if (size > MAX_VIDEO_UPLOAD_BYTES) {
      return fail(
        `Video too large. Max size is ${Math.round(
          MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024)
        )}MB. Trim the clip and try again.`,
        413
      );
    }

    if (size === 0) {
      return fail("File is empty.", 400);
    }

    const presign = await prepareVideoUpload({ mime, originalName });
    return ok(presign, { status: 201 });
  } catch (err) {
    if (err instanceof Error) {
      console.error("[API] Video presign error:", err.message);
      if (
        /supabase|storage|bucket|upload/i.test(err.message) ||
        err.message.includes("SUPABASE_SECRET_KEY")
      ) {
        return fail(err.message, 500);
      }
    }
    return handleError(err);
  }
}
