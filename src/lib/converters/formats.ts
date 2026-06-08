import type { ConverterCategoryId } from "./categories";

export type ConverterFormat = {
  extension: string;
  label: string;
  category: ConverterCategoryId;
  mimeTypes: string[];
  aliases?: string[];
  safeOutputMime: string;
};

export const converterFormats: ConverterFormat[] = [
  { extension: "jpg", label: "JPEG Image", category: "images", mimeTypes: ["image/jpeg"], aliases: ["jpeg"], safeOutputMime: "image/jpeg" },
  { extension: "jpeg", label: "JPEG Image", category: "images", mimeTypes: ["image/jpeg"], aliases: ["jpg"], safeOutputMime: "image/jpeg" },
  { extension: "png", label: "PNG Image", category: "images", mimeTypes: ["image/png"], safeOutputMime: "image/png" },
  { extension: "webp", label: "WebP Image", category: "images", mimeTypes: ["image/webp"], safeOutputMime: "image/webp" },
  { extension: "gif", label: "GIF Image", category: "images", mimeTypes: ["image/gif"], safeOutputMime: "image/gif" },
  { extension: "bmp", label: "Bitmap Image", category: "images", mimeTypes: ["image/bmp", "image/x-ms-bmp"], safeOutputMime: "image/bmp" },
  { extension: "tiff", label: "TIFF Image", category: "images", mimeTypes: ["image/tiff"], aliases: ["tif"], safeOutputMime: "image/tiff" },
  { extension: "svg", label: "SVG Image", category: "images", mimeTypes: ["image/svg+xml"], safeOutputMime: "image/svg+xml" },
  { extension: "ico", label: "Icon", category: "images", mimeTypes: ["image/vnd.microsoft.icon", "image/x-icon"], safeOutputMime: "image/vnd.microsoft.icon" },
  { extension: "avif", label: "AVIF Image", category: "images", mimeTypes: ["image/avif"], safeOutputMime: "image/avif" },

  { extension: "pdf", label: "PDF Document", category: "documents", mimeTypes: ["application/pdf"], safeOutputMime: "application/pdf" },
  { extension: "docx", label: "Word Document", category: "documents", mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], safeOutputMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { extension: "odt", label: "OpenDocument Text", category: "documents", mimeTypes: ["application/vnd.oasis.opendocument.text"], safeOutputMime: "application/vnd.oasis.opendocument.text" },
  { extension: "txt", label: "Plain Text", category: "documents", mimeTypes: ["text/plain"], safeOutputMime: "text/plain" },
  { extension: "rtf", label: "Rich Text", category: "documents", mimeTypes: ["application/rtf", "text/rtf"], safeOutputMime: "application/rtf" },
  { extension: "html", label: "HTML", category: "documents", mimeTypes: ["text/html"], safeOutputMime: "text/html" },
  { extension: "md", label: "Markdown", category: "documents", mimeTypes: ["text/markdown", "text/plain"], aliases: ["markdown"], safeOutputMime: "text/markdown" },
  { extension: "epub", label: "EPUB", category: "documents", mimeTypes: ["application/epub+zip"], safeOutputMime: "application/epub+zip" },

  { extension: "xlsx", label: "Excel Workbook", category: "tables", mimeTypes: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], safeOutputMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { extension: "csv", label: "CSV", category: "tables", mimeTypes: ["text/csv", "text/plain"], safeOutputMime: "text/csv" },
  { extension: "ods", label: "OpenDocument Spreadsheet", category: "tables", mimeTypes: ["application/vnd.oasis.opendocument.spreadsheet"], safeOutputMime: "application/vnd.oasis.opendocument.spreadsheet" },
  { extension: "json", label: "JSON", category: "developer", mimeTypes: ["application/json", "text/plain"], safeOutputMime: "application/json" },
  { extension: "xml", label: "XML", category: "developer", mimeTypes: ["application/xml", "text/xml", "text/plain"], safeOutputMime: "application/xml" },

  { extension: "mp3", label: "MP3 Audio", category: "audio", mimeTypes: ["audio/mpeg"], safeOutputMime: "audio/mpeg" },
  { extension: "wav", label: "WAV Audio", category: "audio", mimeTypes: ["audio/wav", "audio/x-wav"], safeOutputMime: "audio/wav" },
  { extension: "flac", label: "FLAC Audio", category: "audio", mimeTypes: ["audio/flac"], safeOutputMime: "audio/flac" },
  { extension: "aac", label: "AAC Audio", category: "audio", mimeTypes: ["audio/aac"], safeOutputMime: "audio/aac" },
  { extension: "ogg", label: "OGG Audio", category: "audio", mimeTypes: ["audio/ogg", "application/ogg"], safeOutputMime: "audio/ogg" },
  { extension: "m4a", label: "M4A Audio", category: "audio", mimeTypes: ["audio/mp4", "audio/x-m4a"], safeOutputMime: "audio/mp4" },

  { extension: "mp4", label: "MP4 Video", category: "video", mimeTypes: ["video/mp4"], safeOutputMime: "video/mp4" },
  { extension: "mov", label: "QuickTime Video", category: "video", mimeTypes: ["video/quicktime"], safeOutputMime: "video/quicktime" },
  { extension: "avi", label: "AVI Video", category: "video", mimeTypes: ["video/x-msvideo"], safeOutputMime: "video/x-msvideo" },
  { extension: "mkv", label: "Matroska Video", category: "video", mimeTypes: ["video/x-matroska"], safeOutputMime: "video/x-matroska" },
  { extension: "webm", label: "WebM Video", category: "video", mimeTypes: ["video/webm"], safeOutputMime: "video/webm" },
  { extension: "mpeg", label: "MPEG Video", category: "video", mimeTypes: ["video/mpeg"], aliases: ["mpg"], safeOutputMime: "video/mpeg" },

  { extension: "zip", label: "ZIP Archive", category: "archives", mimeTypes: ["application/zip"], safeOutputMime: "application/zip" },
  { extension: "tar", label: "TAR Archive", category: "archives", mimeTypes: ["application/x-tar"], safeOutputMime: "application/x-tar" },
  { extension: "gz", label: "GZip Archive", category: "archives", mimeTypes: ["application/gzip", "application/x-gzip"], safeOutputMime: "application/gzip" },
  { extension: "7z", label: "7-Zip Archive", category: "archives", mimeTypes: ["application/x-7z-compressed"], safeOutputMime: "application/x-7z-compressed" },

  { extension: "yaml", label: "YAML", category: "developer", mimeTypes: ["application/yaml", "text/yaml", "text/plain"], aliases: ["yml"], safeOutputMime: "application/yaml" },
  { extension: "toml", label: "TOML", category: "developer", mimeTypes: ["application/toml", "text/plain"], safeOutputMime: "application/toml" },
  { extension: "env", label: "Environment File", category: "developer", mimeTypes: ["text/plain"], safeOutputMime: "text/plain" },
  { extension: "base64", label: "Base64 Text", category: "developer", mimeTypes: ["text/plain"], safeOutputMime: "text/plain" }
] as const;

export type FormatExtension = string;

export const formatByExtension = new Map<string, ConverterFormat>();

for (const format of converterFormats) {
  formatByExtension.set(format.extension, format);
  for (const alias of format.aliases ?? []) {
    formatByExtension.set(alias, format);
  }
}

export function normalizeExtension(value: string) {
  return value.toLowerCase().replace(/^\./, "").trim();
}

export function getFormat(extension: string) {
  return formatByExtension.get(normalizeExtension(extension));
}

export function getFormatsByCategory(category: ConverterCategoryId) {
  return converterFormats.filter((format) => format.category === category);
}

export function getAllowedExtensions() {
  return Array.from(new Set(converterFormats.flatMap((format) => [format.extension, ...(format.aliases ?? [])])));
}
