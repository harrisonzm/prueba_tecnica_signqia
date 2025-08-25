"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import Link from "next/link";

import { useMarcasInfinite, useDeleteMarca } from "@/components/hooks/marcas";
import { useToast } from "@/components/hooks/use-toast";
import type { Marca } from "@/types/marca-api";
import type { Estado } from "@/lib/marcas.key";

/** Debounce simple */
function useDebouncedValue<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function MarcasLista() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const debouncedSearch = useDebouncedValue(searchTerm, 350);

  // Para deshabilitar solo el botón de la fila que se está eliminando
  const [pendingId, setPendingId] = useState<number | null>(null);

  // Límite por batch (ajústalo a gusto)
  const limit = 20;

  const estadoParam: Estado | undefined =
    filterStatus === "all" ? undefined : (filterStatus as Estado);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useMarcasInfinite({
    estado: estadoParam,
    search: debouncedSearch || undefined,
    limit,
  });

  const del = useDeleteMarca();
  const { toast } = useToast();

  // Aplanar páginas
  const marcas: Marca[] = useMemo(() => (data?.pages ?? []).flat(), [data]);

  const getStatusBadge = (estado: Marca["estado"]) => {
    const map: Record<string, string> = {
      ACTIVA: "bg-success text-success-foreground",
      INACTIVA: "bg-muted text-muted-foreground",
      SUSPENDIDA: "bg-warning text-warning-foreground",
    };
    const cls = map[estado] ?? "bg-secondary text-secondary-foreground";
    return <Badge className={cls}>{estado}</Badge>;
  };

  const handleDelete = async (id: number, nombre: string) => {
    try {
      setPendingId(id);
      await del.mutateAsync(id);
      toast({ title: "Marca eliminada", description: `Se eliminó "${nombre}".` });
      // El hook invalida y actualiza listas/infinite queries
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Inténtalo de nuevo más tarde.";
      toast({ title: "Error al eliminar", description: msg, variant: "destructive" });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Registro de Marcas</h1>
          <p className="text-muted-foreground">Gestiona todas las marcas registradas en el sistema</p>
        </div>
        <Link href="/marcas/nuevo">
          <Button className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Registro
          </Button>
        </Link>
      </div>

      {/* Filtros (van al servidor) */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o título…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterStatus === "all" ? "Todos los estados" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["all", "ACTIVA", "INACTIVA", "SUSPENDIDA"].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)}>
                    {s === "all" ? "Todos los estados" : s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {isLoading ? "Cargando marcas…" : `Marcas cargadas (${marcas.length})`}
            {isFetching && !isLoading && (
              <span className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Actualizando…
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="p-8 text-center text-destructive">
              Error cargando marcas: {(error as Error)?.message ?? "Desconocido"}
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">#</TableHead>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Título</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!isLoading && marcas.map((m, i) => (
                    <TableRow key={m.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">#{i + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">{m.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{m.titulo}</TableCell>
                      <TableCell>{getStatusBadge(m.estado)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Ver acciones">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href={`/marcas/${m.id}/editar`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>

                              {/* Imp: prevenir el default para que el Dialog abra bien desde un DropdownItem */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="cursor-pointer text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar “{m.nombre}”?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Se eliminará la marca y sus datos asociados.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={pendingId === m.id || del.isPending}>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDelete(m.id, m.nombre)}
                                      disabled={pendingId === m.id || del.isPending}
                                    >
                                      {pendingId === m.id || del.isPending ? (
                                        <span className="inline-flex items-center gap-2">
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Eliminando…
                                        </span>
                                      ) : (
                                        "Confirmar"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                        Cargando…
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading && marcas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <FileText className="w-8 h-8" />
                          <p>No se encontraron marcas</p>
                          <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginación infinita */}
          <div className="flex justify-center mt-4">
            {hasNextPage && (
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando…
                  </span>
                ) : (
                  "Cargar más"
                )}
              </Button>
            )}
            {!hasNextPage && marcas.length > 0 && (
              <p className="text-sm text-muted-foreground">No hay más resultados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
