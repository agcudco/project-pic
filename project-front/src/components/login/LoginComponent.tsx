import React, { useState } from 'react';
import LoginForm from './LoginForm';
import UserMenu from './UserMenu';
import type { Login } from '../../types/login';

const LoginComponent: React.FC = () => {
  const [user, setUser] = useState<Login | null>(null);

  const handleLogin = (loggedUser: Login) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <UserMenu user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default LoginComponent;
