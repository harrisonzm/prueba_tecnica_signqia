"use client";

import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "@/components/ui/stepper";
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NuevaMarca } from "@/types/marca";
import { useToast } from "@/components/hooks/use-toast";

export default function NuevoRegistro() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<NuevaMarca>({ nombre: "", titular: "", categoria: "", descripcion: "" });

  const steps = useMemo(() => ["Información de la Marca", "Información del Titular", "Resumen"], []);

  const handleInputChange = useCallback((field: keyof NuevaMarca, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const canContinue = useMemo(() => {
    if (currentStep === 0) return formData.nombre.trim() !== "";
    if (currentStep === 1) return formData.titular.trim() !== "";
    return true;
  }, [currentStep, formData.nombre, formData.titular]);

  const handleNext = useCallback(() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1)), [steps.length]);
  const handleBack = useCallback(() => setCurrentStep((s) => Math.max(s - 1, 0)), []);

  const handleSubmit = useCallback(async () => {
    try {
      console.log("Registrando nueva marca:", formData);
      toast({ title: "Marca registrada exitosamente", description: `La marca "${formData.nombre}" ha sido registrada correctamente.` });
      router.push("/marcas");
    } catch (error) {
      toast({ title: "Error al registrar la marca", description: "Ha ocurrido un error. Por favor, inténtalo de nuevo.", variant: "destructive" });
    }
  }, [formData, router, toast]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Información de la Marca</h2>
              <p className="text-muted-foreground">Ingresa los datos básicos de la marca a registrar</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium">Marca a Registrar *</Label>
                <Input id="nombre" placeholder="Ej: MiMarca Innovadora" value={formData.nombre} onChange={(e) => handleInputChange("nombre", e.target.value)} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-sm font-medium">Categoría (Opcional)</Label>
                <Input id="categoria" placeholder="Ej: Tecnología, Alimentación, Servicios" value={formData.categoria} onChange={(e) => handleInputChange("categoria", e.target.value)} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-sm font-medium">Descripción (Opcional)</Label>
                <Textarea id="descripcion" placeholder="Describe brevemente la marca y su propósito..." value={formData.descripcion} onChange={(e) => handleInputChange("descripcion", e.target.value)} className="w-full" rows={3} />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Información del Titular</h2>
              <p className="text-muted-foreground">Proporciona los datos del propietario de la marca</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="titular" className="text-sm font-medium">Titular de la marca *</Label>
                <Input id="titular" placeholder="Ej: Juan Pérez / Empresa S.A." value={formData.titular} onChange={(e) => handleInputChange("titular", e.target.value)} className="w-full" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Resumen</h2>
              <p className="text-muted-foreground">Revisa la información antes de registrar la marca</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Marca a Registrar</Label>
                      <p className="text-lg font-semibold text-foreground">{formData.nombre}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Titular de la marca</Label>
                      <p className="text-lg font-semibold text-foreground">{formData.titular}</p>
                    </div>
                    {formData.categoria && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Categoría</Label>
                        <p className="text-foreground">{formData.categoria}</p>
                      </div>
                    )}
                    {formData.descripcion && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Descripción</Label>
                        <p className="text-foreground text-sm">{formData.descripcion}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link href="/marcas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crear Registro</h1>
          <p className="text-muted-foreground">Registra una nueva marca en el sistema</p>
        </div>
      </div>

      <div className="py-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <Card className="card-elevated">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Servicios/Registro de Marca</CardTitle>
          <CardDescription>Paso {currentStep + 1} de {steps.length}</CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-8">
          {renderStepContent()}

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handleBack} className="btn-ghost-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={!canContinue} className="btn-gradient">
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canContinue} className="btn-gradient">
                <Check className="w-4 h-4 mr-2" />
                Crear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
