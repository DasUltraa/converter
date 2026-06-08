import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import TOML from "@iarna/toml";
import { parse as parseCsvSync } from "csv-parse/sync";
import { stringify as stringifyCsvSync } from "csv-stringify/sync";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import sharp from "sharp";
import YAML from "yaml";
import { converterFormats, getFormat, type ConverterFormat } from "./formats";

const execFileAsync = promisify(execFile);

export type ConversionRequest = {
  inputBuffer: Buffer;
  source: ConverterFormat;
  target: ConverterFormat;
};

export type ConversionResult = {
  outputBuffer: Buffer;
  outputMime: string;
};

export type ConverterAdapter = {
  id: string;
  label: string;
  supports: (source: ConverterFormat, target: ConverterFormat) => boolean;
  convert: (request: ConversionRequest) => Promise<ConversionResult>;
};

async function withWorkDir<T>(prefix: string, task: (dir: string) => Promise<T>) {
  const dir = await mkdtemp(join(tmpdir(), `${prefix}-`));
  try {
    return await task(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function runTool(command: string, args: string[], timeout = 120_000) {
  try {
    await execFileAsync(command, args, {
      timeout,
      maxBuffer: 10 * 1024 * 1024,
      env: {
        ...process.env,
        HOME: tmpdir()
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    throw new Error(`Konvertierungswerkzeug fehlgeschlagen: ${command} (${message})`);
  }
}

async function convertWithTempFile(
  prefix: string,
  request: ConversionRequest,
  convert: (paths: { dir: string; input: string; output: string }) => Promise<void>
) {
  return withWorkDir(prefix, async (dir) => {
    const input = join(dir, `input.${request.source.extension}`);
    const output = join(dir, `output.${request.target.extension}`);
    await writeFile(input, request.inputBuffer, { mode: 0o600 });
    await convert({ dir, input, output });
    return {
      outputBuffer: await readFile(output),
      outputMime: request.target.safeOutputMime
    };
  });
}

const sharpImageTargets = new Set(["jpg", "jpeg", "png", "webp", "avif", "tiff"]);

async function createIco(inputBuffer: Buffer) {
  const sizes = [16, 32, 48, 64, 128, 256];
  const images = await Promise.all(
    sizes.map(async (size) => ({
      size,
      buffer: await sharp(inputBuffer).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
    }))
  );
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + images.length * entrySize;
  const totalSize = directorySize + images.reduce((sum, image) => sum + image.buffer.length, 0);
  const ico = Buffer.alloc(totalSize);

  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(images.length, 4);

  let imageOffset = directorySize;
  images.forEach((image, index) => {
    const entryOffset = headerSize + index * entrySize;
    ico.writeUInt8(image.size === 256 ? 0 : image.size, entryOffset);
    ico.writeUInt8(image.size === 256 ? 0 : image.size, entryOffset + 1);
    ico.writeUInt8(0, entryOffset + 2);
    ico.writeUInt8(0, entryOffset + 3);
    ico.writeUInt16LE(1, entryOffset + 4);
    ico.writeUInt16LE(32, entryOffset + 6);
    ico.writeUInt32LE(image.buffer.length, entryOffset + 8);
    ico.writeUInt32LE(imageOffset, entryOffset + 12);
    image.buffer.copy(ico, imageOffset);
    imageOffset += image.buffer.length;
  });

  return ico;
}

const imageAdapter: ConverterAdapter = {
  id: "images",
  label: "Bildkonvertierung mit Sharp und ImageMagick",
  supports(source, target) {
    return source.category === "images" && target.category === "images";
  },
  async convert({ inputBuffer, source, target }) {
    if (target.extension === "ico") {
      return {
        outputBuffer: await createIco(inputBuffer),
        outputMime: target.safeOutputMime
      };
    }

    if (target.extension === "svg") {
      const png = await sharp(inputBuffer).png().toBuffer();
      const metadata = await sharp(png).metadata();
      const width = metadata.width ?? 1024;
      const height = metadata.height ?? 1024;
      const encoded = png.toString("base64");
      return {
        outputBuffer: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image width="${width}" height="${height}" href="data:image/png;base64,${encoded}"/></svg>\n`,
          "utf8"
        ),
        outputMime: target.safeOutputMime
      };
    }

    if (sharpImageTargets.has(target.extension)) {
      let pipeline = sharp(inputBuffer, { animated: source.extension === "gif" });

      switch (target.extension) {
        case "jpg":
        case "jpeg":
          pipeline = pipeline.jpeg({ quality: 88, mozjpeg: true });
          break;
        case "png":
          pipeline = pipeline.png({ compressionLevel: 9 });
          break;
        case "webp":
          pipeline = pipeline.webp({ quality: 86 });
          break;
        case "avif":
          pipeline = pipeline.avif({ quality: 70 });
          break;
        case "tiff":
          pipeline = pipeline.tiff({ quality: 86 });
          break;
      }

      return {
        outputBuffer: await pipeline.toBuffer(),
        outputMime: target.safeOutputMime
      };
    }

    return convertWithTempFile("kuglers-image", { inputBuffer, source, target }, async ({ input, output }) => {
      const outputPath = target.extension === "ico" ? `ico:${output}` : output;
      await runTool("convert", [input, "-auto-orient", outputPath]);
    });
  }
};

const documentTargets = new Set(["pdf", "docx", "odt", "txt", "rtf", "html", "md", "epub"]);
const libreOfficeTargets = new Set(["pdf", "docx", "odt", "txt", "rtf", "html"]);
const pandocTargets = new Set(["pdf", "docx", "odt", "txt", "rtf", "html", "md", "epub"]);
const pandocSources = new Set(["txt", "md", "html", "rtf", "docx", "odt", "epub"]);

async function findConvertedFile(dir: string, targetExtension: string) {
  const files = await import("node:fs/promises").then((fs) => fs.readdir(dir));
  const found = files.find((file) => file.toLowerCase().endsWith(`.${targetExtension}`));
  if (!found) {
    throw new Error(`Ausgabedatei .${targetExtension} wurde nicht erstellt.`);
  }
  return join(dir, found);
}

async function libreOfficeConvert(request: ConversionRequest, sourceFilter?: string) {
  return withWorkDir("kuglers-office", async (dir) => {
    const input = join(dir, `input.${request.source.extension}`);
    await writeFile(input, request.inputBuffer, { mode: 0o600 });
    const filter = sourceFilter ? `${request.target.extension}:${sourceFilter}` : request.target.extension;
    await runTool("libreoffice", ["--headless", "--nologo", "--nofirststartwizard", "--convert-to", filter, "--outdir", dir, input], 180_000);
    const output = await findConvertedFile(dir, request.target.extension);
    return {
      outputBuffer: await readFile(output),
      outputMime: request.target.safeOutputMime
    };
  });
}

async function pandocConvert(request: ConversionRequest) {
  return convertWithTempFile("kuglers-pandoc", request, async ({ input, output }) => {
    await runTool("pandoc", [input, "-o", output], 180_000);
  });
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function textToHtml(value: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Kuglers Converter</title><style>body{font-family:Arial,sans-serif;line-height:1.5;margin:40px;white-space:pre-wrap}</style></head><body>${escapeHtml(value)}</body></html>`;
}

function textToRtf(value: string) {
  const escaped = value.replace(/[\\{}]/g, "\\$&").replace(/\r?\n/g, "\\par\n");
  return `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\f0\\fs22 ${escaped}}`;
}

async function htmlToPdf(sourceExtension: string, inputBuffer: Buffer, target: ConverterFormat) {
  return withWorkDir("kuglers-pdf", async (dir) => {
    const sourcePath = join(dir, `source.${sourceExtension}`);
    const htmlPath = join(dir, "source.html");
    await writeFile(sourcePath, inputBuffer, { mode: 0o600 });

    if (sourceExtension === "html") {
      await writeFile(htmlPath, inputBuffer, { mode: 0o600 });
    } else if (sourceExtension === "txt") {
      await writeFile(htmlPath, textToHtml(inputBuffer.toString("utf8")), { mode: 0o600 });
    } else {
      await runTool("pandoc", [sourcePath, "-o", htmlPath], 180_000);
    }

    await runTool("libreoffice", ["--headless", "--nologo", "--nofirststartwizard", "--convert-to", "pdf", "--outdir", dir, htmlPath], 180_000);
    const output = await findConvertedFile(dir, "pdf");
    return {
      outputBuffer: await readFile(output),
      outputMime: target.safeOutputMime
    };
  });
}

async function pdfToText(inputBuffer: Buffer) {
  return withWorkDir("kuglers-pdf-text", async (dir) => {
    const input = join(dir, "input.pdf");
    const output = join(dir, "output.txt");
    await writeFile(input, inputBuffer, { mode: 0o600 });
    await runTool("pdftotext", ["-layout", "-enc", "UTF-8", input, output], 180_000);
    return readFile(output);
  });
}

async function convertPdfSource(request: ConversionRequest) {
  const text = await pdfToText(request.inputBuffer);

  if (request.target.extension === "txt" || request.target.extension === "md") {
    return {
      outputBuffer: text,
      outputMime: request.target.safeOutputMime
    };
  }

  if (request.target.extension === "html") {
    return {
      outputBuffer: Buffer.from(textToHtml(text.toString("utf8")), "utf8"),
      outputMime: request.target.safeOutputMime
    };
  }

  if (request.target.extension === "rtf") {
    return {
      outputBuffer: Buffer.from(textToRtf(text.toString("utf8")), "utf8"),
      outputMime: request.target.safeOutputMime
    };
  }

  return pandocConvert({
    inputBuffer: text,
    source: { ...request.source, extension: "txt" },
    target: request.target
  });
}

const documentAdapter: ConverterAdapter = {
  id: "documents",
  label: "Dokumentkonvertierung mit LibreOffice und Pandoc",
  supports(source, target) {
    return source.category === "documents" && target.category === "documents" && documentTargets.has(target.extension);
  },
  async convert(request) {
    if (request.source.extension === "pdf") {
      return convertPdfSource(request);
    }

    if (request.target.extension === "pdf" && pandocSources.has(request.source.extension)) {
      return htmlToPdf(request.source.extension, request.inputBuffer, request.target);
    }

    if (request.source.extension === "md" && request.target.extension === "txt") {
      return {
        outputBuffer: request.inputBuffer,
        outputMime: request.target.safeOutputMime
      };
    }

    if (request.source.extension === "txt" && request.target.extension === "md") {
      return {
        outputBuffer: request.inputBuffer,
        outputMime: request.target.safeOutputMime
      };
    }

    if (pandocSources.has(request.source.extension) && pandocTargets.has(request.target.extension)) {
      return pandocConvert(request);
    }

    if (libreOfficeTargets.has(request.target.extension)) {
      return libreOfficeConvert(request);
    }

    return pandocConvert(request);
  }
};

const tableAdapter: ConverterAdapter = {
  id: "tables",
  label: "Tabellenkonvertierung mit LibreOffice",
  supports(source, target) {
    return source.category === "tables" && target.category === "tables";
  },
  async convert(request) {
    return libreOfficeConvert(request, request.target.extension === "csv" ? "Text - txt - csv (StarCalc)" : undefined);
  }
};

const audioAdapter: ConverterAdapter = {
  id: "audio",
  label: "Audiokonvertierung mit ffmpeg",
  supports(source, target) {
    return source.category === "audio" && target.category === "audio";
  },
  async convert(request) {
    return convertWithTempFile("kuglers-audio", request, async ({ input, output }) => {
      await runTool("ffmpeg", ["-y", "-i", input, "-vn", output], 180_000);
    });
  }
};

const videoAdapter: ConverterAdapter = {
  id: "video",
  label: "Videokonvertierung mit ffmpeg",
  supports(source, target) {
    return source.category === "video" && target.category === "video";
  },
  async convert(request) {
    return convertWithTempFile("kuglers-video", request, async ({ input, output }) => {
      await runTool("ffmpeg", ["-y", "-i", input, output], 300_000);
    });
  }
};

async function archiveConvert(request: ConversionRequest) {
  return withWorkDir("kuglers-archive", async (dir) => {
    const input = join(dir, `input.${request.source.extension}`);
    const extractDir = join(dir, "extract");
    const output = join(dir, `output.${request.target.extension}`);
    await mkdir(extractDir, { recursive: true });
    await writeFile(input, request.inputBuffer, { mode: 0o600 });

    await runTool("7z", ["x", "-y", `-o${extractDir}`, input], 180_000);

    if (request.target.extension === "tar") {
      await runTool("tar", ["-cf", output, "-C", extractDir, "."], 180_000);
    } else if (request.target.extension === "gz") {
      await runTool("tar", ["-czf", output, "-C", extractDir, "."], 180_000);
    } else if (request.target.extension === "zip") {
      await runTool("7z", ["a", "-tzip", output, `${extractDir}/.`], 180_000);
    } else if (request.target.extension === "7z") {
      await runTool("7z", ["a", "-t7z", output, `${extractDir}/.`], 180_000);
    } else {
      throw new Error("Nicht unterstütztes Archiv-Zielformat.");
    }

    return {
      outputBuffer: await readFile(output),
      outputMime: request.target.safeOutputMime
    };
  });
}

const archiveAdapter: ConverterAdapter = {
  id: "archives",
  label: "Archivkonvertierung mit 7z und tar",
  supports(source, target) {
    return source.category === "archives" && target.category === "archives";
  },
  convert: archiveConvert
};

type StructuredData = string | Record<string, unknown> | unknown[];

function parseEnv(text: string) {
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        if (index === -1) return [line, ""];
        return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^["']|["']$/g, "")];
      })
  );
}

function stringifyEnv(data: StructuredData) {
  const object = typeof data === "object" && data !== null && !Array.isArray(data) ? data : { VALUE: data };
  return `${Object.entries(object)
    .map(([key, value]) => `${key.toUpperCase().replace(/[^\w]/g, "_")}=${String(value)}`)
    .join("\n")}\n`;
}

function parseStructured(text: string, extension: string): StructuredData {
  if (extension === "base64") {
    return Buffer.from(text.trim(), "base64").toString("utf8");
  }
  if (extension === "json") return JSON.parse(text);
  if (extension === "yaml") return YAML.parse(text);
  if (extension === "xml") return new XMLParser({ ignoreAttributes: false }).parse(text);
  if (extension === "csv") return parseCsvSync(text, { columns: true, skip_empty_lines: true });
  if (extension === "toml") return TOML.parse(text) as Record<string, unknown>;
  if (extension === "env") return parseEnv(text);
  return text;
}

function stringifyStructured(data: StructuredData, extension: string) {
  if (extension === "base64") {
    const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    return `${Buffer.from(text, "utf8").toString("base64")}\n`;
  }
  if (extension === "json") return `${JSON.stringify(typeof data === "string" ? { value: data } : data, null, 2)}\n`;
  if (extension === "yaml") return YAML.stringify(typeof data === "string" ? { value: data } : data);
  if (extension === "xml") return new XMLBuilder({ ignoreAttributes: false, format: true }).build(typeof data === "string" ? { value: data } : data);
  if (extension === "csv") {
    const records = Array.isArray(data) ? data : [typeof data === "object" && data !== null ? data : { value: data }];
    return stringifyCsvSync(records, { header: true });
  }
  if (extension === "toml") return TOML.stringify((typeof data === "object" && data !== null && !Array.isArray(data) ? data : { value: data }) as TOML.JsonMap);
  if (extension === "env") return stringifyEnv(data);
  return typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

const developerAdapter: ConverterAdapter = {
  id: "developer-data",
  label: "Strukturierte Entwicklerformate",
  supports(source, target) {
    return source.category === "developer" && target.category === "developer";
  },
  async convert({ inputBuffer, source, target }) {
    const data = parseStructured(inputBuffer.toString("utf8"), source.extension);
    return {
      outputBuffer: Buffer.from(stringifyStructured(data, target.extension), "utf8"),
      outputMime: target.safeOutputMime
    };
  }
};

export const converterAdapters: ConverterAdapter[] = [
  imageAdapter,
  documentAdapter,
  tableAdapter,
  audioAdapter,
  videoAdapter,
  archiveAdapter,
  developerAdapter
];

export function getAdapter(sourceExtension: string, targetExtension: string) {
  const source = getFormat(sourceExtension);
  const target = getFormat(targetExtension);

  if (!source || !target) {
    return null;
  }

  const adapter = converterAdapters.find((candidate) => candidate.supports(source, target));
  return adapter ? { adapter, source, target } : null;
}

export function getSupportedTargets(sourceExtension: string) {
  const source = getFormat(sourceExtension);
  if (!source) {
    return [];
  }

  return converterFormats
    .filter((target) => target.extension !== source.extension && target.category === source.category)
    .map((target) => ({
      ...target,
      implemented: isImplementedConversion(source, target)
    }));
}

export function isImplementedConversion(source: ConverterFormat, target: ConverterFormat) {
  return converterAdapters.some((adapter) => adapter.supports(source, target));
}
