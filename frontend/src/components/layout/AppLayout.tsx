"use client"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ReactNode } from "react";
import { FileText } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (

    <SidebarProvider>
      <AppSidebar /> {/* fixed */}
      <SidebarInset className="min-h-svh bg-gradient-subtle">
        <header className="h-16 bg-card border-b border-border flex items-center px-6 shadow-soft">
          <SidebarTrigger className="md:hidden" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Sistema de Registro de Marcas
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Gestión integral de marcas comerciales
                  </p>
                </div>
              </div>
          </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
