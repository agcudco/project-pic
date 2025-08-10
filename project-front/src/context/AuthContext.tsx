// src/context/AuthContext.tsx
import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  // cualquier otro campo que devuelva tu API
}

interface AuthContextProps {
  user: User | null;
  roles: string[];
  login: (email: string, contrasenia: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  roles: [],
  login: async () => {},
  logout: () => {}
});

const API_BASE = "http://localhost:3000";
const buildUrl = (path: string) => `${API_BASE}${path}`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  const login = async (email: string, contrasenia: string) => {
    // 1) Llamada al endpoint de login
    const res = await fetch(buildUrl('/api/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        contrasenia
      })
    });

    if (!res.ok) {
      throw new Error('Credenciales inválidas');
    }

    // Nuevo formato: { usuario, roles }
    const { usuario, roles } = await res.json();
    setUser(usuario);
    setRoles(roles);
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
