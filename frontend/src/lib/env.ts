// lib/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  API_BASE_URL: z.string().url().default("http://localhost:8000/api/v1"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:8000/api/v1"),
});

export const env = EnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

/** Helper: elige base URL según server/client */
export function getBaseUrl() {
  const isServer = typeof window === "undefined";
  return isServer ? env.API_BASE_URL : env.NEXT_PUBLIC_API_BASE_URL;
}
