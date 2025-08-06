import axios from 'axios';
import { Login, Role } from '../types/loginType';

const API_URL = 'http://localhost:3000/api';

export const login = async (email: string, contrasenia: string): Promise<Login> => {
  const { data } = await axios.post(`${API_URL}/login`, { email, contrasenia });
  return data;
};

export const getAllRoles = async (): Promise<Role[]> => {
  const { data } = await axios.get(`${API_URL}/roles`);
  return data;
};

export const getRolesByUserId = async (id: number): Promise<Role[]> => {
  const { data } = await axios.get(`${API_URL}/roles/${id}`);
  return data;
};

export const updatePassword = async (id: number, nuevaContrasenia: string): Promise<void> => {
  await axios.put(`${API_URL}/password/${id}`, { nuevaContrasenia });
};
