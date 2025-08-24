/**
 * Utilidades genéricas para UI y helpers comunes.
 * Server/Client-safe (salvo funciones que usen window).
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge de clases con soporte Tailwind (tu base) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea fechas (usa Intl; configurable) */
export function formatDate(
  date: string | number | Date,
  locale = "es-ES",
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "2-digit" }
): string {
  try {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, opts).format(d);
  } catch {
    return "";
  }
}

/** Convierte a Title Case simple */
export function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
}

/** Debounce de funciones (para inputs/búsquedas) */
export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/** Sleep/espera (útil en mocks/testing) */
export function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/** Parseo seguro de JSON */
export function safeJSON<T = unknown>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
