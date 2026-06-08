import { mkdir, rm, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { customAlphabet } from "nanoid";
import { getAllowedExtensions, getFormat, normalizeExtension } from "@/lib/converters/formats";
import { env, maxUploadBytes } from "./env";

const safeId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 18);
const allowedExtensions = new Set(getAllowedExtensions());
const textLikeExtensions = new Set(["txt", "md", "html", "csv", "json", "xml", "yaml", "toml", "env", "base64", "svg"]);
const zipContainerExtensions = new Set(["docx", "xlsx", "odt", "ods", "epub"]);

function detectMimeFromMagic(buffer: Buffer, fallback: string) {
  const header = buffer.subarray(0, 16);
  const textStart = buffer.subarray(0, 256).toString("utf8").trimStart();

  if (header.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return "image/jpeg";
  if (header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (header.subarray(0, 4).toString("ascii") === "GIF8") return "image/gif";
  if (header.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (header.subarray(0, 2).toString("ascii") === "BM") return "image/bmp";
  if (header.subarray(0, 4).toString("ascii") === "II*\0" || header.subarray(0, 4).toString("ascii") === "MM\0*") return "image/tiff";
  if (buffer.subarray(4, 12).toString("ascii") === "ftypavif") return "image/avif";
  if (textStart.startsWith("<svg")) return "image/svg+xml";
  if (header.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0x00]))) return "image/vnd.microsoft.icon";
  if (header.subarray(0, 4).toString("ascii") === "%PDF") return "application/pdf";
  if (header.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) return "application/zip";
  if (header.subarray(0, 2).equals(Buffer.from([0x1f, 0x8b]))) return "application/gzip";
  if (header.subarray(0, 6).equals(Buffer.from([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]))) return "application/x-7z-compressed";
  if (header.subarray(0, 3).toString("ascii") === "ID3" || header.subarray(0, 2).equals(Buffer.from([0xff, 0xfb]))) return "audio/mpeg";
  if (header.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WAVE") return "audio/wav";
  if (header.subarray(0, 4).toString("ascii") === "fLaC") return "audio/flac";
  if (header.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return "video/x-matroska";
  if (buffer.subarray(4, 8).toString("ascii") === "ftyp") return fallback.startsWith("audio/") || fallback.startsWith("video/") ? fallback : "video/mp4";
  return fallback || "application/octet-stream";
}

export type ValidatedUpload = {
  originalName: string;
  safeBaseName: string;
  extension: string;
  detectedMime: string;
  size: number;
  buffer: Buffer;
};

export function sanitizeFilename(name: string) {
  const cleaned = basename(name)
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);

  return cleaned || "upload";
}

export async function validateUpload(file: File): Promise<ValidatedUpload> {
  if (!file.name || file.size <= 0) {
    throw new Error("Keine gueltige Datei erhalten.");
  }

  if (file.size > maxUploadBytes) {
    throw new Error(`Die Datei ist groesser als ${env.MAX_UPLOAD_SIZE_MB} MB.`);
  }

  const originalName = sanitizeFilename(file.name);
  const extension = normalizeExtension(extname(originalName));
  const format = getFormat(extension);

  if (!extension || !allowedExtensions.has(extension) || !format) {
    throw new Error("Dieses Dateiformat ist nicht erlaubt.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const browserMime = file.type || "application/octet-stream";
  const detectedMime = detectMimeFromMagic(buffer, browserMime);

  const mimeAllowed =
    format.mimeTypes.includes(detectedMime) ||
    (zipContainerExtensions.has(extension) && detectedMime === "application/zip") ||
    (extension === "m4a" && detectedMime === "video/mp4") ||
    (textLikeExtensions.has(extension) && (detectedMime.startsWith("text/") || detectedMime === "application/octet-stream"));

  if (!mimeAllowed) {
    throw new Error("MIME-Type und Dateiendung passen nicht zu einem erlaubten Format.");
  }

  return {
    originalName,
    safeBaseName: originalName.replace(/\.[^.]+$/, ""),
    extension: format.extension,
    detectedMime,
    size: file.size,
    buffer
  };
}

export async function writeTempFile(upload: ValidatedUpload) {
  await mkdir(env.TEMP_DIR, { recursive: true });
  const path = join(env.TEMP_DIR, `${safeId()}.${upload.extension}`);
  await writeFile(path, upload.buffer, { mode: 0o600 });
  return path;
}

export async function cleanupFiles(paths: string[]) {
  await Promise.all(
    paths.map((path) =>
      rm(path, { force: true }).catch((error) => {
        console.error("Temporary cleanup failed", { path, message: error instanceof Error ? error.message : "unknown" });
      })
    )
  );
}

export function makeDownloadName(baseName: string, extension: string) {
  return `${sanitizeFilename(baseName).replace(/\.[^.]+$/, "")}.${normalizeExtension(extension)}`;
}
