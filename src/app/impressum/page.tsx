import { imprintData } from "@/lib/legal/imprint-data";

const data: Record<string, string | undefined> = imprintData;

function value(key: string) {
  const current = data[key]?.trim();
  if (!current || current.startsWith("TODO:")) return null;
  return current;
}

function address() {
  const parts = [value("streetAddress"), [value("postalCode"), value("city")].filter(Boolean).join(" "), value("country")].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

const details = [
  ["Betreiber", value("ownerName")],
  ["Rechtsform", value("legalForm")],
  ["Adresse", address()],
  ["E-Mail", value("email")],
  ["Telefon", value("phone")],
  ["Website", value("website")],
  ["UID-Nummer", value("vatId")],
  ["Firmenbuch", value("companyRegister")],
  ["Gewerbebehoerde", value("businessAuthority")],
  ["Kammer / Berufsverband", value("chamber")],
  ["Berufsrechtliche Vorschriften", value("tradeRegulations")],
  ["Unternehmensgegenstand", value("businessPurpose")],
  ["Medieninhaber", value("mediaOwner")],
  ["Blattlinie", value("editorialPolicy")],
  ["Verantwortlich fuer den Inhalt", value("responsibleForContent")]
].filter((detail): detail is [string, string] => Boolean(detail[1]));

export default function ImpressumPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm text-muted-foreground">Rechtliche Angaben</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-normal">Impressum</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Die Werte dieser Seite kommen aus <code>src/lib/legal/imprint-data.ts</code>.
        Leere oder entfernte Felder werden nicht ausgegeben.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border bg-card">
        {details.map(([label, value]) => (
          <div key={label} className="grid gap-1 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[220px_1fr]">
            <dt className="text-sm font-medium">{label}</dt>
            <dd className="break-words text-sm leading-6 text-muted-foreground">{value}</dd>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border bg-card p-5">
        <h2 className="text-sm font-semibold">Hinweis zur Haftung</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Inhalte dieser Website werden sorgfaeltig gepflegt. Fuer externe Inhalte, auf die gegebenenfalls verlinkt wird,
          ist der jeweilige Anbieter verantwortlich.
        </p>
      </div>
    </section>
  );
}
