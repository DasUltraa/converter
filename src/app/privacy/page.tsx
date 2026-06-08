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

const rights = [
  "Auskunft ueber verarbeitete personenbezogene Daten",
  "Berichtigung unrichtiger Daten",
  "Loeschung oder Einschraenkung der Verarbeitung",
  "Widerspruch gegen eine Verarbeitung auf Grundlage berechtigter Interessen",
  "Datenuebertragbarkeit, soweit anwendbar",
  "Beschwerde bei der Oesterreichischen Datenschutzbehoerde"
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm text-muted-foreground">Stand: 03.06.2026</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-normal">Datenschutzerklaerung</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
        Diese Datenschutzerklaerung beschreibt, welche Daten beim Besuch und bei der Nutzung von
        {` ${value("website") ?? "http://localhost:3000"} `} verarbeitet werden. Der Converter ist als selbst gehostete Anwendung ohne
        Benutzerkonten und ohne verpflichtende externe Converter-API aufgebaut.
      </p>

      <div className="mt-8 space-y-5">
        <Section title="1. Verantwortlicher">
          {value("ownerName") ? <p>{value("ownerName")}</p> : null}
          {address() ? <p>{address()}</p> : null}
          {value("email") ? <p>E-Mail: {value("email")}</p> : null}
          {value("dataProtectionContact") ? <p>Datenschutz-Kontakt: {value("dataProtectionContact")}</p> : null}
        </Section>

        <Section title="2. Verarbeitung beim Aufruf der Website">
          <p>
            Beim Aufruf der Website werden technisch notwendige Zugriffsdaten verarbeitet. Dazu koennen IP-Adresse,
            Datum und Uhrzeit des Zugriffs, angeforderte URL, HTTP-Status, uebertragene Datenmenge, User-Agent und
            Referrer gehoeren. Diese Daten sind notwendig, um die Website auszuliefern, Fehler zu analysieren und
            Angriffe oder Missbrauch abzuwehren.
          </p>
          <p>
            Rechtsgrundlage ist das berechtigte Interesse am sicheren und stabilen Betrieb der Website gemaess
            Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </Section>

        <Section title="3. Datei-Uploads und Konvertierungen">
          <p>
            Wenn eine Datei hochgeladen wird, verarbeitet der Converter Dateiname, Dateigroesse, Dateiendung,
            MIME-Type und den Dateiinhalt fuer die technische Pruefung und Konvertierung. Die Verarbeitung erfolgt,
            um die vom Nutzer angeforderte Konvertierung bereitzustellen.
          </p>
          <p>
            Dateien werden temporaer im Container verarbeitet. Originaldateien und Ausgabedateien werden nicht als
            dauerhafte Nutzerdatenbank gespeichert. Temporaere Dateien werden nach der Verarbeitung beziehungsweise
            nach Fehlerfaellen geloescht. Serverlogs sollen keine Dateiinhalte enthalten.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Bereitstellung der
            angeforderten Funktion erforderlich ist, sowie Art. 6 Abs. 1 lit. f DSGVO fuer Sicherheitspruefungen.
          </p>
        </Section>

        <Section title="4. Lokaler Speicher im Browser">
          <p>
            Fuer die Darstellung kann die Auswahl zwischen heller und dunkler Ansicht im Local Storage des Browsers
            gespeichert werden. Diese Speicherung dient ausschliesslich der Anzeigeeinstellung und wird nicht fuer
            Tracking verwendet.
          </p>
        </Section>

        <Section title="5. Empfaenger und technische Dienstleister">
          <p>
            Die Anwendung wird im eigenen Docker-Setup betrieben. Soweit Cloudflare fuer DNS, TLS, Proxying oder
            Schutzfunktionen der Domain genutzt wird, koennen technische Zugriffsdaten auch durch Cloudflare
            verarbeitet werden. Daneben koennen Zugriffsdaten in Caddy-, Docker- oder Serverlogs anfallen.
          </p>
          <p>
            Eine Weitergabe von hochgeladenen Dateien an externe Cloud-Converter-Dienste ist nicht vorgesehen.
          </p>
        </Section>

        <Section title="6. Speicherdauer">
          <p>
            Hochgeladene Dateien werden nur temporaer fuer die Konvertierung verarbeitet und anschliessend geloescht.
            Technische Logdaten werden nur so lange aufbewahrt, wie es fuer Betrieb, Fehleranalyse und Sicherheit
            erforderlich ist oder gesetzliche Pflichten dies verlangen.
          </p>
        </Section>

        <Section title="7. Keine Benutzerkonten">
          <p>
            Der Converter bietet keine Registrierung, keine Benutzerprofile und keinen Admin-Login fuer Besucher an.
            Es werden daher keine Accountdaten verarbeitet.
          </p>
        </Section>

        <Section title="8. Betroffenenrechte">
          <p>Betroffene Personen haben nach Massgabe der DSGVO insbesondere folgende Rechte:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {rights.map((right) => (
              <li key={right}>{right}</li>
            ))}
          </ul>
          <p className="mt-3">
            Anfragen koennen an die im Impressum beziehungsweise oben angegebene Kontaktadresse gerichtet werden.
            Die zustaendige Aufsichtsbehoerde in Oesterreich ist die Datenschutzbehoerde, Barichgasse 40-42,
            1030 Wien, <a className="text-primary hover:underline" href="https://www.dsb.gv.at">www.dsb.gv.at</a>.
          </p>
        </Section>

        <Section title="9. Aenderungen">
          <p>
            Diese Datenschutzerklaerung kann angepasst werden, wenn sich technische Funktionen, eingesetzte
            Dienstleister oder rechtliche Anforderungen aendern.
          </p>
        </Section>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}
