export interface Marca {
  id: string;
  nombre: string;
  titular: string;
  estado: 'Activa' | 'Pendiente' | 'Vencida' | 'Rechazada';
  fechaRegistro: string;
  fechaVencimiento?: string;
  categoria?: string;
  descripcion?: string;
}

export interface NuevaMarca {
  nombre: string;
  titular: string;
  categoria?: string;
  descripcion?: string;
}