// types/marca-api.ts
import { z } from "zod";

export const EstadoEnum = z.enum(["ACTIVA", "INACTIVA", "SUSPENDIDA"]);

export const MarcaSchema = z.object({
  id: z.number().int().nonnegative(),
  nombre: z.string().min(1),
  titulo: z.string().min(1),
  estado: EstadoEnum,
});

export const MarcaCreateSchema = z.object({
  nombre: z.string().min(1),
  titulo: z.string().min(1),
  estado: EstadoEnum,
});

export const MarcaUpdateSchema = MarcaCreateSchema.partial(); // PATCH parcial

export type Marca = z.infer<typeof MarcaSchema>;
export type MarcaCreate = z.infer<typeof MarcaCreateSchema>;
export type MarcaUpdate = z.infer<typeof MarcaUpdateSchema>;

export const ActividadRecienteSchema = z.object({
  id: z.number().int().nonnegative(),
  action: z.string(),
  marca: z.string(),
  titular: z.string(),
  fecha: z.string(), // ISO o texto legible (ej. "Hace 2 horas")
  estado: EstadoEnum.or(z.string()), // por si el backend manda otro casing
});

export const MarcasDetallesSchema = z.object({
  total: z.number().int().nonnegative(),
  pendientes: z.number().int().nonnegative(),
  vencimientos: z.number().int().nonnegative(),
  aprobadasMes: z.number().int().nonnegative(),
  actividadReciente: z.array(ActividadRecienteSchema),
});

export type MarcasDetalles = z.infer<typeof MarcasDetallesSchema>;
export type ActividadReciente = z.infer<typeof ActividadRecienteSchema>;