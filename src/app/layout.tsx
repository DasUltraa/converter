import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Converter Demo",
  description: "Datei- und Formatkonvertierung als bereinigte Self-hosted Demo.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
