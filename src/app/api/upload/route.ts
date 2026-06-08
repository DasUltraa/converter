import { NextResponse } from "next/server";
import { getSupportedTargets } from "@/lib/converters/registry";
import { getClientKey, checkRateLimit } from "@/lib/server/rate-limit";
import { validateUpload } from "@/lib/server/files";
import { env } from "@/lib/server/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rate = checkRateLimit(`upload:${getClientKey(request)}`, 30);
  if (!rate.ok) {
    return NextResponse.json({ ok: false, error: "Zu viele Uploads. Bitte kurz warten." }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Keine Datei erhalten." }, { status: 400 });
    }

    const upload = await validateUpload(file);

    return NextResponse.json({
      ok: true,
      file: {
        name: upload.originalName,
        size: upload.size,
        format: upload.extension,
        mime: upload.detectedMime
      },
      maxUploadSizeMb: env.MAX_UPLOAD_SIZE_MB,
      targets: getSupportedTargets(upload.extension)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload konnte nicht geprueft werden.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
