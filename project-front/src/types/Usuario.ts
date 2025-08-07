export interface Usuario {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  contrasenia: string;
  id_rol: number;
  tipo_cliente: string;
  razon_social: string;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}