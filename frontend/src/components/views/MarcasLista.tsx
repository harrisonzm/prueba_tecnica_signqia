"use client";

import { useMemo, useState } from "react";
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
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";

import { useMarcas, useDeleteMarca } from "@/components/hooks/marcas";
import { useToast } from "@/components/hooks/use-toast";
import type { Marca } from "@/types/marca-api"; // ← API: id:number, nombre, titulo, estado

export default function MarcasLista() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: marcas = [], isLoading, error } = useMarcas();
  const del = useDeleteMarca();
  const { toast } = useToast();

  const filteredMarcas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (marcas ?? []).filter((m) => {
      const matchesSearch =
        m.nombre.toLowerCase().includes(term) || m.titulo.toLowerCase().includes(term);
      const matchesFilter =
        filterStatus === "all" || m.estado.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [marcas, searchTerm, filterStatus]);

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
      await del.mutateAsync(id);
      toast({ title: "Marca eliminada", description: `Se eliminó "${nombre}".` });
    } catch {
      toast({ title: "Error al eliminar", description: "Inténtalo de nuevo más tarde.", variant: "destructive" });
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

      {/* Filtros */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[160px]">
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
            {isLoading ? "Cargando marcas…" : `Marcas Registradas (${filteredMarcas.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-8 text-center text-destructive">Error cargando marcas.</div>
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
                  {!isLoading && filteredMarcas.map((m, index) => (
                    <TableRow key={m.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">{m.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{m.titulo}</TableCell>
                      <TableCell>{getStatusBadge(m.estado)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
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

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="cursor-pointer text-destructive">
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
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDelete(m.id, m.nombre)}
                                    >
                                      Confirmar
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

                  {!isLoading && filteredMarcas.length === 0 && (
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
        </CardContent>
      </Card>
    </div>
  );
}
