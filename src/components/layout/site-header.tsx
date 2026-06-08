import Link from "next/link";
import { ArrowRightLeft, FileStack } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/converters", label: "Converter" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Datenschutz" },
  { href: "/impressum", label: "Impressum" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/92 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
            <FileStack className="h-4 w-4" />
          </span>
          <span>Kuglers Converter</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/converters" className="hidden h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition hover:bg-secondary sm:inline-flex">
            <ArrowRightLeft className="h-4 w-4" />
            Formate
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
