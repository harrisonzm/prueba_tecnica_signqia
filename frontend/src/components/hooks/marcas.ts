// hooks/marcas.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marcasKeys } from "@/lib/marcas.key";
import {
  fetchMarcas,
  fetchMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,
  fetchMarcasDetalles
} from "@/lib/marcas.api";
import type { Marca, MarcaCreate, MarcaUpdate, MarcasDetalles } from "@/types/marca-api";

/** Lista de marcas */
export function useMarcas() {
  return useQuery({
    queryKey: marcasKeys.list(),
    queryFn: fetchMarcas,
    staleTime: 60_000,
  });
}

/** Detalle por id */
export function useMarca(id?: number, opts?: { enabled?: boolean }) {
  console.log( `-------------------------------------habilitado ? ${opts.enabled}`, id)
  const enabled = !!opts?.enabled && typeof id === "number" && Number.isFinite(id);
  return useQuery({
    queryKey: ["marcas", "detail", enabled ? id : "new"],
    queryFn: () => fetchMarcaById(id as number),
    enabled,
    staleTime: 60_000,
  });
}
/** Crear con optimismo */
export function useCreateMarca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MarcaCreate) => createMarca(input),
    onMutate: async (newItem) => {
      await qc.cancelQueries({ queryKey: marcasKeys.list() });
      const prev = qc.getQueryData<Marca[]>(marcasKeys.list());
      const tempId = Math.floor(Math.random() * 1e9);
      if (prev) {
        qc.setQueryData<Marca[]>(marcasKeys.list(), [
          ...prev,
          { id: tempId, ...newItem }, // placeholder hasta que el server responda
        ] as Marca[]);
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(marcasKeys.list(), ctx.prev);
    },
    onSuccess: (saved) => {
      // Reconciliar lista y detalle
      qc.setQueryData<Marca[]>(marcasKeys.list(), (old) =>
        (old ?? []).map((m) => (m.nombre === saved.nombre && "titulo" in m && m.titulo === saved.titulo ? saved : m))
      );
      qc.setQueryData(marcasKeys.detail(saved.id), saved);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: marcasKeys.list() });
    },
  });
}

/** Actualizar con optimismo */
export function useUpdateMarca(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: MarcaUpdate) => updateMarca(id, patch),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: marcasKeys.detail(id) });
      const prevDetail = qc.getQueryData<Marca>(marcasKeys.detail(id));
      if (prevDetail) {
        qc.setQueryData<Marca>(marcasKeys.detail(id), { ...prevDetail, ...patch });
      }
      // también optimiza en la lista
      const prevList = qc.getQueryData<Marca[]>(marcasKeys.list());
      if (prevList) {
        qc.setQueryData<Marca[]>(marcasKeys.list(), prevList.map((m) => (m.id === id ? { ...m, ...patch } : m)));
      }
      return { prevDetail, prevList };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevDetail) qc.setQueryData(marcasKeys.detail(id), ctx.prevDetail);
      if (ctx?.prevList) qc.setQueryData(marcasKeys.list(), ctx.prevList);
    },
    onSuccess: (saved) => {
      qc.setQueryData(marcasKeys.detail(saved.id), saved);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: marcasKeys.list() });
      qc.invalidateQueries({ queryKey: marcasKeys.detail(id) });
    },
  });
}

/** Eliminar con optimismo */
export function useDeleteMarca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMarca(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: marcasKeys.list() });
      const prev = qc.getQueryData<Marca[]>(marcasKeys.list());
      if (prev) {
        qc.setQueryData<Marca[]>(marcasKeys.list(), prev.filter((m) => m.id !== id));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(marcasKeys.list(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: marcasKeys.list() });
    },
  });
}

export function useMarcasDetalles() {
  return useQuery<MarcasDetalles>({
    queryKey: marcasKeys.detalles(),
    queryFn: fetchMarcasDetalles,
    staleTime: 60_000,
  });
}