export const loginApi = async (email: string, contrasenia: string) => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasenia }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  return res.json();
};

export const fetchRoles = async (userId: string) => {
  const res = await fetch(`/api/roles/${userId}`);
  if (!res.ok) throw new Error("Error al obtener roles");
  return res.json() as Promise<string[]>;
};
