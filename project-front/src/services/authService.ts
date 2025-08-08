// src/api.ts
const API_BASE = "http://localhost:3000";

/**
 * Realiza el login del usuario.
 * @param email Email del usuario
 * @param contrasenia Contraseña del usuario
 * @throws Error si las credenciales son inválidas (HTTP 401)
 * @returns Promise con los datos del usuario ({ id, name, ... })
 */
export const loginApi = async (email: string, contrasenia: string) => {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasenia }),
  });

  if (!res.ok) {
    // Lanzamos un error para que el caller lo capture y muestre un toast
    throw new Error("Credenciales inválidas");
  }

  return (await res.json()) as {
    id: string;
    name: string;
    // cualquier otro campo que devuelva tu API
  };
};

/**
 * Obtiene los roles asignados a un usuario.
 * @param userId ID del usuario
 * @throws Error si la petición falla
 * @returns Promise<string[]> con el listado de roles
 */
export const fetchRoles = async (userId: string): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/api/roled/${userId}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Error al obtener roles");
  }

  return (await res.json()) as string[];
};
