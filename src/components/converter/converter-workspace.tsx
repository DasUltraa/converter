"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { CheckCircle2, Download, FileUp, Loader2, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

type Target = {
  extension: string;
  label: string;
  category: string;
  implemented: boolean;
};

type UploadMeta = {
  name: string;
  size: number;
  format: string;
  mime: string;
};

type Status = "idle" | "preparing" | "checked" | "converting" | "ready" | "error";

const statusText: Record<Status, string> = {
  idle: "Datei auswählen",
  preparing: "Datei wird vorbereitet",
  checked: "Format wird geprüft",
  converting: "Konvertierung läuft",
  ready: "Download bereit",
  error: "Konvertierung nicht möglich"
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function ConverterWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<UploadMeta | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [targetFormat, setTargetFormat] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");

  const selectedTarget = useMemo(
    () => targets.find((target) => target.extension === targetFormat),
    [targetFormat, targets]
  );

  async function prepareFile(nextFile: File) {
    setFile(nextFile);
    setMeta(null);
    setTargets([]);
    setTargetFormat("");
    setDownloadUrl("");
    setDownloadName("");
    setError("");
    setStatus("preparing");
    setProgress(25);

    const formData = new FormData();
    formData.append("file", nextFile);

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      setStatus("error");
      setProgress(0);
      setError(payload.error ?? "Datei konnte nicht geprüft werden.");
      return;
    }

    setMeta(payload.file);
    setTargets(payload.targets);
    setTargetFormat(payload.targets.find((target: Target) => target.implemented)?.extension ?? payload.targets[0]?.extension ?? "");
    setStatus("checked");
    setProgress(45);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (nextFile) {
      void prepareFile(nextFile);
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const nextFile = event.dataTransfer.files?.[0];
    if (nextFile) {
      void prepareFile(nextFile);
    }
  }

  async function convert() {
    if (!file || !targetFormat) return;

    if (selectedTarget && !selectedTarget.implemented) {
      setStatus("error");
      setError("Dieses Zielformat ist fuer diese Datei nicht verfuegbar.");
      return;
    }

    setStatus("converting");
    setProgress(70);
    setError("");
    setDownloadUrl("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetFormat", targetFormat);

    const response = await fetch("/api/convert", { method: "POST", body: formData });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setStatus("error");
      setProgress(45);
      setError(payload?.error ?? "Konvertierung fehlgeschlagen.");
      return;
    }

    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") ?? "";
    const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? `converted.${targetFormat}`;
    const url = URL.createObjectURL(blob);

    setDownloadUrl(url);
    setDownloadName(filename);
    setStatus("ready");
    setProgress(100);
  }

  function reset() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setMeta(null);
    setTargets([]);
    setTargetFormat("");
    setStatus("idle");
    setProgress(0);
    setError("");
    setDownloadUrl("");
    setDownloadName("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Datei konvertieren</CardTitle>
        <CardDescription>Upload, Formatprüfung und Ausgabe laufen im Converter-Container.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-secondary/45 p-6 text-center transition hover:bg-secondary",
            status === "error" && "border-destructive/60"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" className="hidden" onChange={onInputChange} />
          <FileUp className="mb-4 h-10 w-10 text-primary" />
          <p className="text-base font-semibold">Datei hier ablegen oder auswählen</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Dateigröße, Endung und MIME-Type werden serverseitig geprüft.</p>
        </div>

        {meta && (
          <div className="grid gap-3 rounded-lg border bg-background p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Dateiname</p>
              <p className="break-words text-sm font-medium">{meta.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dateigröße</p>
              <p className="text-sm font-medium">{formatBytes(meta.size)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Erkanntes Format</p>
              <p className="text-sm font-medium">{meta.format.toUpperCase()}</p>
            </div>
          </div>
        )}

        {targets.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="target-format" className="text-sm font-medium">Zielformat</label>
            </div>
            <select
              id="target-format"
              value={targetFormat}
              onChange={(event) => setTargetFormat(event.target.value)}
              className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            >
              {targets.map((target) => (
                <option key={target.extension} value={target.extension}>
                  {target.label} .{target.extension}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{statusText[status]}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {error && (
          <div className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={convert} disabled={!file || !targetFormat || status === "converting"}>
            {status === "converting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Datei konvertieren
          </Button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={downloadName}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          )}
          <Button type="button" variant="ghost" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Zurücksetzen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
