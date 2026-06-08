import { NextResponse } from "next/server";
import { converterAdapters } from "@/lib/converters/registry";
import { env } from "@/lib/server/env";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "Kuglers Converter",
    environment: env.NODE_ENV,
    adapters: converterAdapters.map((adapter) => adapter.id),
    time: new Date().toISOString()
  });
}
