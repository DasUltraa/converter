import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Converter Demo · localhost</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-foreground">Datenschutz</Link>
          <Link href="/impressum" className="hover:text-foreground">Impressum</Link>
          <Link href="/api/health" className="hover:text-foreground">Healthcheck</Link>
        </div>
      </div>
    </footer>
  );
}
