import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    // cualquier otro campo
}

interface AuthContextProps {
    user: User | null;
    roles: string[];
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    roles: [],
    login: async () => { },
    logout: () => { }
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);

    const login = async (username: string, password: string) => {
        // 1) Login
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            throw new Error('Credenciales inválidas');
        }
        const userData: User = await res.json();
        setUser(userData);

        // 2) Obtener roles
        const rolesRes = await fetch(`/api/users/${userData.id}/roles`);
        if (!rolesRes.ok) {
            throw new Error('No se pudieron obtener los roles');
        }
        const rolesData: string[] = await rolesRes.json();
        setRoles(rolesData);
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
