import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ⚠️ React Query necesita cliente, así que marcamos como Client Component
"use client";

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "Gestión de Marcas",
  description: "Panel de administración con Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppLayout>{children}</AppLayout>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
