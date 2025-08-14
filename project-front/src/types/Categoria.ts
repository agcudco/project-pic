export interface Categoria {
  id?: number;
  nombre: string;
}

export type CategoriaFormData = Omit<Categoria, "id">;
