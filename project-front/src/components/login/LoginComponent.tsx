import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import UserMenu from './UserMenu';
import type { Login, Role } from '../../types/login';
import { getRolesByUserId } from '../../services/servicesLogin';

interface LoginComponentProps {
  setUser: (user: Login) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ setUser }) => {
  const [user, setUserLocal] = useState<Login | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (loggedUser: Login) => {
    try {
      let roles: Role[] = [];
      try {
        roles = await getRolesByUserId(loggedUser.id);
        if (!Array.isArray(roles)) roles = [];
      } catch (e) {
        roles = [];
      }
      const userWithRoles = { ...loggedUser, roles };
      setUserLocal(userWithRoles);
      setUser(userWithRoles);
      navigate('/index');
    } catch (err) {
      console.error('Error al obtener roles:', err);
    }
  };

  const handleLogout = () => {
    setUserLocal(null);
    setUser(null as any);
    navigate('/');
  };

  return (
    <div className="p-m-4">
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <UserMenu user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default LoginComponent;
