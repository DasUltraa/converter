import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().max(1024).default(100),
  TEMP_DIR: z.string().min(1).default("/tmp/converter-demo"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production")
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  MAX_UPLOAD_SIZE_MB: process.env.MAX_UPLOAD_SIZE_MB,
  TEMP_DIR: process.env.TEMP_DIR,
  NODE_ENV: process.env.NODE_ENV
});

export const maxUploadBytes = env.MAX_UPLOAD_SIZE_MB * 1024 * 1024;
