import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { converterCategories, getCategory } from "@/lib/converters/categories";
import { getFormatsByCategory } from "@/lib/converters/formats";

export function generateStaticParams() {
  return converterCategories.map((category) => ({ category: category.id }));
}

export default async function ConverterCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) notFound();
  const formats = getFormatsByCategory(category.id);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/converters" className="text-sm font-medium text-primary hover:underline">Zur Übersicht</Link>
      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <category.icon className="mb-4 h-6 w-6 text-primary" />
          <h1 className="text-3xl font-semibold tracking-normal">{category.label}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{category.description}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((format) => (
          <Card key={format.extension}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span>{format.label}</span>
                <Badge>.{format.extension}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">MIME: {format.mimeTypes.join(", ")}</p>
              {format.aliases && <p className="mt-2 text-sm text-muted-foreground">Alias: {format.aliases.map((alias) => `.${alias}`).join(", ")}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
