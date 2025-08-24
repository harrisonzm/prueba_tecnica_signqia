/**
 * Tipos y helpers para el dominio "Marca".
 * Server/Client-safe.
 */

export type EstadoMarca = "Activa" | "Pendiente" | "Vencida" | "Rechazada";

export interface Marca {
  id: string;
  nombre: string;
  titular: string;
  estado: EstadoMarca;
  fechaRegistro: string;       // ISO string (YYYY-MM-DD)
  fechaVencimiento?: string;   // ISO string (YYYY-MM-DD)
  categoria?: string;
  descripcion?: string;
}

export interface NuevaMarca {
  nombre: string;
  titular: string;
  categoria?: string;
  descripcion?: string;
}

/** Lista fija de estados (útil para selects/validaciones) */
export const ESTADOS_MARCA: readonly EstadoMarca[] = [
  "Activa",
  "Pendiente",
  "Vencida",
  "Rechazada",
] as const;

/** Type guard para validar estados */
export function isEstadoMarca(v: unknown): v is EstadoMarca {
  return typeof v === "string" && (ESTADOS_MARCA as readonly string[]).includes(v);
}

/** Normaliza un estado arbitrario hacia un EstadoMarca si es posible */
export function normalizeEstado(raw: string): EstadoMarca | null {
  const s = raw?.trim().toLowerCase();
  switch (s) {
    case "activa":
      return "Activa";
    case "pendiente":
      return "Pendiente";
    case "vencida":
      return "Vencida";
    case "rechazada":
      return "Rechazada";
    default:
      return null;
  }
}

/** Calcula si una marca está por vencer en N días (default 30) */
export function isPorVencer(m: Pick<Marca, "fechaVencimiento">, days = 30): boolean {
  if (!m.fechaVencimiento) return false;
  const hoy = new Date();
  const fv = new Date(m.fechaVencimiento);
  const diff = fv.getTime() - hoy.getTime();
  return diff > 0 && diff <= days * 24 * 60 * 60 * 1000;
}

/** Calcula si la marca está vencida con base en fechaVencimiento */
export function isVencida(m: Pick<Marca, "fechaVencimiento">): boolean {
  if (!m.fechaVencimiento) return false;
  return new Date(m.fechaVencimiento).getTime() < Date.now();
}
