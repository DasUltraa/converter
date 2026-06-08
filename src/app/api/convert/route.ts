import { NextResponse } from "next/server";
import { getAdapter } from "@/lib/converters/registry";
import { getFormat, normalizeExtension } from "@/lib/converters/formats";
import { cleanupFiles, makeDownloadName, validateUpload, writeTempFile } from "@/lib/server/files";
import { getClientKey, checkRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rate = checkRateLimit(`convert:${getClientKey(request)}`, 12);
  if (!rate.ok) {
    return NextResponse.json({ ok: false, error: "Zu viele Konvertierungen. Bitte kurz warten." }, { status: 429 });
  }

  const tempFiles: string[] = [];

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const targetValue = formData.get("targetFormat");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Keine Datei erhalten." }, { status: 400 });
    }

    if (typeof targetValue !== "string") {
      return NextResponse.json({ ok: false, error: "Kein Zielformat ausgewaehlt." }, { status: 400 });
    }

    const targetExtension = normalizeExtension(targetValue);
    const targetFormat = getFormat(targetExtension);

    if (!targetFormat) {
      return NextResponse.json({ ok: false, error: "Dieses Zielformat ist nicht erlaubt." }, { status: 400 });
    }

    const upload = await validateUpload(file);
    const sourcePath = await writeTempFile(upload);
    tempFiles.push(sourcePath);

    const match = getAdapter(upload.extension, targetExtension);
    if (!match) {
      return NextResponse.json(
        { ok: false, error: "Dieses Zielformat ist fuer diese Datei nicht verfuegbar." },
        { status: 422 }
      );
    }

    const result = await match.adapter.convert({
      inputBuffer: upload.buffer,
      source: match.source,
      target: match.target
    });

    const downloadName = makeDownloadName(upload.safeBaseName, targetFormat.extension);

    return new NextResponse(new Uint8Array(result.outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": result.outputMime,
        "Content-Length": String(result.outputBuffer.byteLength),
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        "Cache-Control": "no-store",
        "X-Converter-Adapter": match.adapter.id
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Konvertierung fehlgeschlagen.";
    console.error("Conversion failed", { message });
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  } finally {
    await cleanupFiles(tempFiles);
  }
}
