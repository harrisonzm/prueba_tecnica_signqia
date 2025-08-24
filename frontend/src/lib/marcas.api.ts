// lib/marcas.api.ts
import { getBaseUrl } from "@/lib/env";
import { http } from "@/lib/api";
import {
    Marca, MarcaCreate, MarcaUpdate,
    MarcaSchema,
    MarcaCreateSchema,
    MarcaUpdateSchema,
    MarcasDetallesSchema, type MarcasDetalles
} from "@/types/marca-api";
import { z } from "zod";

const MarcasListSchema = z.array(MarcaSchema);
const base = () => `${getBaseUrl()}`;

export async function fetchMarcas(): Promise<Marca[]> {
    const data = await http<unknown>(`${base()}/marcas`, { method: "GET", cache: "no-store" });
    const parsed = MarcasListSchema.parse(data);
    return parsed;
}

export async function fetchMarcaById(id: number): Promise<Marca> {
    const data = await http<unknown>(`${base()}/marcas/${id}`, { method: "GET", cache: "no-store" });
    const parsed = MarcaSchema.parse(data);
    return parsed;
}

export async function createMarca(input: MarcaCreate): Promise<Marca> {
    const payload = MarcaCreateSchema.parse(input);
    const data = await http<unknown>(`${base()}/marcas`, {
        method: "POST",
        body: payload,
    });
    return MarcaSchema.parse(data);
}

export async function updateMarca(id: number, input: MarcaUpdate): Promise<Marca> {
    const payload = MarcaUpdateSchema.parse(input);
    const data = await http<unknown>(`${base()}/marcas/${id}`, {
        method: "PATCH",
        body: payload,
    });
    return MarcaSchema.parse(data);
}

export async function deleteMarca(id: number): Promise<{ ok: true } | Marca | unknown> {
    // Algunos backends devuelven 204, otros el recurso borrado; soportamos ambos
    const data = await http<unknown>(`${base()}/marcas/${id}`, { method: "DELETE" });
    return data ?? { ok: true };
}

export async function fetchMarcasDetalles(): Promise<MarcasDetalles> {
    const data = await http<unknown>(`${base()}/marcas/detalles`, {
        method: "GET",
        cache: "no-store",
    });
    return MarcasDetallesSchema.parse(data);
}