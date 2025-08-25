// lib/marcas.keys.ts
// export const marcasKeys = {
//   all: ["marcas"] as const,
//   list: () => [...marcasKeys.all, "list"] as const,
//   detail: (id: number) => [...marcasKeys.all, "detail", id] as const,
// };
export type Estado = "ACTIVA" | "INACTIVA" | "SUSPENDIDA";

export const marcasKeys = {
  all: ["marcas"] as const,
  list: (filters?: { estado?: Estado; search?: string }) =>
    [...marcasKeys.all, "list", filters] as const,
  page: (filters: { estado?: Estado; search?: string; limit: number; offset: number }) =>
    [...marcasKeys.all, "page", filters] as const,
  infinite: (filters: { estado?: Estado; search?: string; limit: number }) =>
    [...marcasKeys.all, "infinite", filters] as const,
  detail: (id: number) => [...marcasKeys.all, "detail", id] as const,
};