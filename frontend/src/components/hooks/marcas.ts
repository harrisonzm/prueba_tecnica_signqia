// hooks/marcas.ts
"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { Estado, marcasKeys } from "@/lib/marcas.key";
import {
  fetchMarcas,
  fetchMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,
  fetchMarcasDetalles,
  fetchMarcasPage,
} from "@/lib/marcas.api";
import type { Marca, MarcaCreate, MarcaUpdate, MarcasDetalles } from "@/types/marca-api";


export function useMarcasInfinite(params: {
  estado?: Estado;
  search?: string;
  limit?: number;   // default 50
}) {
  const { estado, search, limit = 50 } = params ?? {};
  return useInfiniteQuery<Marca[], Error>({
    queryKey: marcasKeys.infinite({ estado, search, limit }),
    initialPageParam: 0, // offset inicial
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === "number" ? pageParam : 0;
      return fetchMarcasPage({ estado, search, limit, offset });
    },
    getNextPageParam: (lastPage, _allPages, lastOffset) => {
      const prevOffset = typeof lastOffset === "number" ? lastOffset : 0;
      // Si la última página llegó completa, hay chance de más:
      return lastPage.length === limit ? prevOffset + lastPage.length : undefined;
    },
    staleTime: 60_000,
  });
}

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

// export function useMarcasDetalles() {
//   return useQuery<MarcasDetalles>({
//     queryKey: marcasKeys.detalles(),
//     queryFn: fetchMarcasDetalles,
//     staleTime: 60_000,
//   });
// }
/** Paginado clásico (page/pageSize) */
export function useMarcasPage(params: { page: number; pageSize?: number; estado?: Estado; search?: string }) {
  const { page, pageSize = 50, estado, search } = params;
  const offset = Math.max(0, (page - 1) * pageSize);
  const limit = pageSize;

  return useQuery<Marca[], Error>({
    queryKey: marcasKeys.page({ estado, search, limit, offset }),
    queryFn: () => fetchMarcasPage({ estado, search, limit, offset }),
    // v5: en vez de keepPreviousData
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  });
}
