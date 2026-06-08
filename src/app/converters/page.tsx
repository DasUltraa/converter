import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { converterCategories } from "@/lib/converters/categories";
import { getFormatsByCategory } from "@/lib/converters/formats";

export default function ConvertersPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Registry</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-normal">Converter-Übersicht</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Formate und Kategorien werden zentral verwaltet und den passenden Server-Adaptern zugeordnet.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {converterCategories.map((category) => {
          const formats = getFormatsByCategory(category.id);
          return (
            <Card key={category.id}>
              <CardHeader>
                <category.icon className="h-5 w-5 text-primary" />
                <CardTitle>
                  <Link href={`/converters/${category.id}`} className="hover:text-primary">{category.label}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm leading-6 text-muted-foreground">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {formats.map((format) => (
                    <Badge key={format.extension}>.{format.extension}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
