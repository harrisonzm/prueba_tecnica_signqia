"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useMarcasDetalles } from "@/components/hooks/marcas";
import type { ActividadReciente } from "@/types/marca-api";

function StatusBadge({ estado }: { estado: string }) {
  // Normaliza estados típicos
  const s = estado.toUpperCase();
  if (s === "ACTIVA") return <Badge className="bg-success text-success-foreground">Activa</Badge>;
  if (s === "PENDIENTE") return <Badge className="bg-warning text-warning-foreground">Pendiente</Badge>;
  if (s === "VENCIMIENTO" || s === "VENCE" || s === "VENCIDA") {
    return <Badge className="bg-destructive text-destructive-foreground">Próximo Vencimiento</Badge>;
  }
  if (s === "SUSPENDIDA") return <Badge className="bg-muted text-muted-foreground">Suspendida</Badge>;
  return <Badge variant="secondary">{estado}</Badge>;
}

export default function Dashboard() {
  const { data, isLoading, error } = useMarcasDetalles();

  // tarjetas/estadísticas
  const stats = useMemo(() => {
    const totals = {
      total: data?.total ?? 0,
      pendientes: data?.pendientes ?? 0,
      vencimientos: data?.vencimientos ?? 0,
      aprobadasMes: data?.aprobadasMes ?? 0,
    };

    return [
      { title: "Marcas Registradas", value: String(totals.total), description: "Total de marcas", icon: FileText, color: "text-primary", trend: "+0%" },
      { title: "Pendientes", value: String(totals.pendientes), description: "Esperando aprobación", icon: Clock, color: "text-warning", trend: "-0%" },
      { title: "Vencimientos", value: String(totals.vencimientos), description: "Próximos 30 días", icon: AlertCircle, color: "text-destructive", trend: "+0" },
      { title: "Aprobadas este mes", value: String(totals.aprobadasMes), description: "Nuevas aprobaciones", icon: CheckCircle, color: "text-success", trend: "+0%" },
    ];
  }, [data]);

  const recentActivity = (data?.actividadReciente ?? []) as ActividadReciente[];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general del sistema de registro de marcas</p>
        </div>
        <div className="flex gap-3">
          <Link href="/marcas/nuevo">
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Marca
            </Button>
          </Link>
          <Link href="/marcas">
            <Button variant="outline" className="btn-ghost-primary">
              Ver Todas las Marcas
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading &&
          [0, 1, 2, 3].map((i) => (
            <Card key={i} className="card-elevated animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-5 w-5 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-6 w-24 bg-muted rounded" />
                <div className="flex items-center justify-between mt-2">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-3 w-12 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}

        {!isLoading &&
          stats.map((stat, index) => (
            <Card key={stat.title} className="card-elevated card-interactive animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className={`text-xs font-medium flex items-center gap-1 ${stat.trend.startsWith("+") ? "text-success" : "text-destructive"}`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        {!isLoading && error && (
          <Card className="md:col-span-2 lg:col-span-4 border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Error cargando estadísticas</CardTitle>
              <CardDescription>Reintenta más tarde.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg border border-border/50 animate-pulse">
                  <div className="h-4 w-48 bg-muted rounded mb-2" />
                  <div className="h-3 w-64 bg-muted rounded mb-1" />
                  <div className="h-3 w-40 bg-muted rounded" />
                </div>
              ))}

            {!isLoading &&
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-foreground">{activity.marca}</p>
                      <StatusBadge estado={activity.estado} />
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">Titular: {activity.titular}</p>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">{activity.fecha}</div>
                </div>
              ))}

            {!isLoading && !error && recentActivity.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">Sin actividad reciente.</div>
            )}

            <Link href="/marcas" className="block">
              <Button variant="ghost" className="w-full mt-4">
                Ver todas las actividades
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Operaciones frecuentes del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/marcas/nuevo" className="block">
              <Button className="w-full justify-start btn-gradient" size="lg">
                <Plus className="w-5 h-5 mr-3" />
                Registrar Nueva Marca
              </Button>
            </Link>
            <Link href="/marcas" className="block">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <FileText className="w-5 h-5 mr-3" />
                Gestionar Marcas Existentes
              </Button>
            </Link>
            <Link href="/reportes" className="block">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <TrendingUp className="w-5 h-5 mr-3" />
                Ver Reportes y Estadísticas
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <AlertCircle className="w-5 h-5 mr-3" />
              Revisar Vencimientos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
