"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function Dashboard() {
  const stats = useMemo(
    () => [
      { title: "Marcas Registradas", value: "156", description: "Total de marcas activas", icon: FileText, trend: "+12%", color: "text-primary" },
      { title: "Pendientes", value: "23", description: "Esperando aprobación", icon: Clock, trend: "-5%", color: "text-warning" },
      { title: "Vencimientos", value: "8", description: "Próximos 30 días", icon: AlertCircle, trend: "+2", color: "text-destructive" },
      { title: "Aprobadas este mes", value: "12", description: "Nuevas aprobaciones", icon: CheckCircle, trend: "+8%", color: "text-success" }
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      { id: 1, action: "Nueva marca registrada", marca: "TechCorp Solutions", titular: "Corporación Tecnológica S.A.", fecha: "Hace 2 horas", estado: "activa" },
      { id: 2, action: "Marca actualizada", marca: "Digital Wave", titular: "Juan Carlos Mendez", fecha: "Hace 5 horas", estado: "pendiente" },
      { id: 3, action: "Próximo vencimiento", marca: "Green Energy Plus", titular: "Energías Renovables Inc.", fecha: "En 15 días", estado: "vencimiento" }
    ],
    []
  );

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "activa":
        return <Badge className="bg-success text-success-foreground">Activa</Badge>;
      case "pendiente":
        return <Badge className="bg-warning text-warning-foreground">Pendiente</Badge>;
      case "vencimiento":
        return <Badge className="bg-destructive text-destructive-foreground">Próximo Vencimiento</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
      </div>

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
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-foreground">{activity.marca}</p>
                    {getStatusBadge(activity.estado)}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">Titular: {activity.titular}</p>
                </div>
                <div className="text-xs text-muted-foreground text-right">{activity.fecha}</div>
              </div>
            ))}
            <Link href="/marcas" className="block">
              <Button variant="ghost" className="w-full mt-4">Ver todas las actividades</Button>
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
