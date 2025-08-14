export interface Accion {
  id: number;
  nombre: string;
  id_menu:number;
  url: string;
  icono: string;
  descripcion: string;
  activo: boolean;
  fecha_creacion: string | Date; // Puede ser string o Date dependiendo de la fuente de datos
}