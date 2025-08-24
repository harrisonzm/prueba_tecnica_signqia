// lib/marcas.keys.ts
// export const marcasKeys = {
//   all: ["marcas"] as const,
//   list: () => [...marcasKeys.all, "list"] as const,
//   detail: (id: number) => [...marcasKeys.all, "detail", id] as const,
// };

export const marcasKeys = {
  all: ["marcas"] as const,
  list: () => [...marcasKeys.all, "list"] as const,
  detail: (id: number) => [...marcasKeys.all, "detail", id] as const,
  detalles: () => [...marcasKeys.all, "detalles"] as const, // ← nueva
};
