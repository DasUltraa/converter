const items = [
  ["Werden Dateien dauerhaft gespeichert?", "Nein. Dateien werden für die Konvertierung temporär verarbeitet und anschließend gelöscht."],
  ["Welche Konvertierungen laufen über den Server?", "Bilder, Dokumente, Tabellen, Audio, Video, Archive und Entwicklerformate werden über die hinterlegten Adapter verarbeitet."],
  ["Brauche ich ein Konto?", "Nein. Es gibt keine Benutzerkonten und keinen Admin-Login fuer Besucher."],
  ["Werden externe Converter-Dienste verwendet?", "Nein. Die App ist so aufgebaut, dass Konvertierungen im eigenen System laufen und keine Cloud-Converter-API voraussetzen."]
];

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-muted-foreground">Betrieb</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-normal">FAQ</h1>
      <div className="mt-8 space-y-4">
        {items.map(([question, answer]) => (
          <div key={question} className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">{question}</h2>
            <p className="mt-2 leading-7 text-muted-foreground">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
