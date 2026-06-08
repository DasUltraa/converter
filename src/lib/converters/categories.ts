import {
  Archive,
  Code2,
  Database,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Table2,
  type LucideIcon
} from "lucide-react";

export type ConverterCategoryId =
  | "images"
  | "documents"
  | "tables"
  | "audio"
  | "video"
  | "archives"
  | "text"
  | "developer";

export type ConverterCategory = {
  id: ConverterCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
};

export const converterCategories: ConverterCategory[] = [
  {
    id: "images",
    label: "Bilder",
    shortLabel: "Bild",
    description: "JPG, PNG, WebP, AVIF, SVG und weitere Bildformate.",
    icon: FileImage
  },
  {
    id: "documents",
    label: "Dokumente",
    shortLabel: "Dokument",
    description: "PDF, DOCX, ODT, Markdown, HTML, EPUB und Textformate.",
    icon: FileText
  },
  {
    id: "tables",
    label: "Tabellen",
    shortLabel: "Tabelle",
    description: "XLSX, CSV, ODS, JSON und XML für strukturierte Daten.",
    icon: Table2
  },
  {
    id: "audio",
    label: "Audio",
    shortLabel: "Audio",
    description: "MP3, WAV, FLAC, AAC, OGG und M4A über ffmpeg.",
    icon: FileAudio
  },
  {
    id: "video",
    label: "Video",
    shortLabel: "Video",
    description: "MP4, MOV, AVI, MKV, WebM und MPEG über ffmpeg.",
    icon: FileVideo
  },
  {
    id: "archives",
    label: "Archive",
    shortLabel: "Archiv",
    description: "ZIP, TAR, GZ und 7Z über den Archiv-Adapter.",
    icon: Archive
  },
  {
    id: "text",
    label: "Text",
    shortLabel: "Text",
    description: "TXT, Markdown, HTML und einfache strukturierte Texte.",
    icon: FileText
  },
  {
    id: "developer",
    label: "Entwicklerformate",
    shortLabel: "Dev",
    description: "JSON, YAML, XML, CSV, TOML, ENV und Base64.",
    icon: Code2
  }
];

export const categoryMap = new Map(converterCategories.map((category) => [category.id, category]));

export function getCategory(id: string) {
  return categoryMap.get(id as ConverterCategoryId);
}

export function getCategoryIcon(id: ConverterCategoryId) {
  return categoryMap.get(id)?.icon ?? Database;
}
