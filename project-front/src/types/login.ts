export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Login {
  id: number;
  email: string;
  contrasenia: string;
  roles: Role[];
}
