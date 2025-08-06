import { Login, Role } from '../types/login';

const API_URL = 'http://localhost:3000/api';

export const login = async (email: string, contrasenia: string): Promise<Login> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contrasenia }),
  });

  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }

  const data: Login = await response.json();
  return data;
};

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await fetch(`${API_URL}/roles`);

  if (!response.ok) {
    throw new Error('Error al obtener los roles');
  }

  const data: Role[] = await response.json();
  return data;
};

export const getRolesByUserId = async (id: number): Promise<Role[]> => {
  const response = await fetch(`${API_URL}/roles/${id}`);

  if (!response.ok) {
    throw new Error('Error al obtener roles por ID');
  }

  const data: Role[] = await response.json();
  return data;
};

export const updatePassword = async (id: number, nuevaContrasenia: string): Promise<void> => {
  const response = await fetch(`${API_URL}/password/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nuevaContrasenia }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la contraseña');
  }
};
