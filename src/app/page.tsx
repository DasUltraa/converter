import Link from "next/link";
import { ArrowRight, CheckCircle2, FileType2, HardDrive, Server, ShieldCheck } from "lucide-react";
import { ConverterWorkspace } from "@/components/converter/converter-workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { converterCategories } from "@/lib/converters/categories";

const benefits = [
  { icon: ShieldCheck, title: "Lokale Verarbeitung", text: "Dateien werden im eigenen Container verarbeitet und nach der Ausgabe wieder entfernt." },
  { icon: CheckCircle2, title: "Ohne Konto", text: "Keine Registrierung und keine Benutzerverwaltung." },
  { icon: FileType2, title: "Klare Formate", text: "Die verfügbaren Zielformate kommen aus der zentralen Converter-Registry." },
  { icon: Server, title: "Kuglers System", text: "Betrieb hinter Caddy im bestehenden Docker-Netzwerk." }
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:py-10">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm text-muted-foreground">Kuglers System / Converter</p>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-normal sm:text-4xl">Kuglers Converter</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
              Schnelle Datei- und Formatkonvertierung direkt auf meinem eigenen System.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#converter"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Datei konvertieren
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/converters"
                className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium transition hover:bg-secondary"
              >
                Formate ansehen
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Max. Upload</p>
                <p className="mt-1 text-2xl font-semibold">100 MB</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Betrieb</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                  <HardDrive className="h-5 w-5 text-primary" />
                  Docker
                </p>
              </div>
            </div>
          </div>
          <div id="converter">
            <ConverterWorkspace />
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardHeader>
                <benefit.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{benefit.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Registry</p>
            <h2 className="mt-1 text-2xl font-semibold">Converter-Kategorien</h2>
          </div>
          <Link href="/converters" className="hidden text-sm font-medium text-primary hover:underline sm:inline">Alle Formate</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {converterCategories.map((category) => (
            <Link
              key={category.id}
              href={`/converters/${category.id}`}
              className="rounded-lg border bg-card p-4 transition hover:bg-secondary/60"
            >
              <category.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">{category.label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
