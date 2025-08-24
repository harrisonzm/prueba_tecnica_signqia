"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { Marca } from "@/types/marca";

const dateFmt = new Intl.DateTimeFormat("es-ES");

export default function MarcasLista() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const marcas: Marca[] = [
    { id: "1", nombre: "TechCorp Solutions", titular: "Corporación Tecnológica S.A.", estado: "Activa", fechaRegistro: "2024-01-15", fechaVencimiento: "2034-01-15", categoria: "Tecnología" },
    { id: "2", nombre: "Digital Wave", titular: "Juan Carlos Mendez", estado: "Pendiente", fechaRegistro: "2024-02-01", categoria: "Marketing Digital" },
    { id: "3", nombre: "Green Energy Plus", titular: "Energías Renovables Inc.", estado: "Activa", fechaRegistro: "2023-12-10", fechaVencimiento: "2033-12-10", categoria: "Energía" },
    { id: "4", nombre: "Creative Studio Pro", titular: "María Elena Rodríguez", estado: "Vencida", fechaRegistro: "2020-05-20", fechaVencimiento: "2024-05-20", categoria: "Diseño" },
    { id: "5", nombre: "FoodDelight Express", titular: "Restaurantes del Valle S.L.", estado: "Activa", fechaRegistro: "2023-08-12", fechaVencimiento: "2033-08-12", categoria: "Alimentación" }
  ];

  const getStatusBadge = (estado: Marca["estado"]) => {
    const variants: Record<Marca["estado"], string> = {
      Activa: "bg-success text-success-foreground",
      Pendiente: "bg-warning text-warning-foreground",
      Vencida: "bg-destructive text-destructive-foreground",
      Rechazada: "bg-muted text-muted-foreground"
    };
    return <Badge className={variants[estado]}>{estado}</Badge>;
  };

  const filteredMarcas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return marcas.filter((m) => {
      const matchesSearch = m.nombre.toLowerCase().includes(term) || m.titular.toLowerCase().includes(term);
      const matchesFilter = filterStatus === "all" || m.estado.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [marcas, searchTerm, filterStatus]);

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

      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre de marca o titular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterStatus === "all" ? "Todos los estados" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["all", "activa", "pendiente", "vencida", "rechazada"].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)}>
                    {s === "all" ? "Todos los estados" : s[0].toUpperCase() + s.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Marcas Registradas ({filteredMarcas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Marca</TableHead>
                  <TableHead className="font-semibold">Titular</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Fecha Registro</TableHead>
                  <TableHead className="font-semibold">Categoría</TableHead>
                  <TableHead className="font-semibold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMarcas.map((m, index) => (
                  <TableRow key={m.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell><div className="font-medium text-foreground">{m.nombre}</div></TableCell>
                    <TableCell><div className="text-muted-foreground">{m.titular}</div></TableCell>
                    <TableCell>{getStatusBadge(m.estado)}</TableCell>
                    <TableCell><div className="text-sm text-muted-foreground">{dateFmt.format(new Date(m.fechaRegistro))}</div></TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{m.categoria || "Sin categoría"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer"><Eye className="w-4 h-4 mr-2" />Ver Detalles</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer"><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMarcas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
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
        </CardContent>
      </Card>
    </div>
  );
}
