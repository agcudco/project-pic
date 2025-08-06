import React, { useState } from 'react';
import LoginDataTable from './LoginDataTable';
import LoginForm from './LoginForm';
import type { Role, Login } from '../../types/login';

const LoginComponent: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Login | null>(null);

  const handleEdit = (role: Role) => {
    const fakeUser: Login = {
      id: 1,
      email: 'usuario@example.com',
      contrasenia: '',
      roles: [role],
    };
    setSelectedUser(fakeUser);
  };

  return (
    <div className="p-grid p-dir-col">
      <div className="p-col">
        <LoginDataTable onEdit={handleEdit} />
      </div>
      <div className="p-col mt-4">
        {selectedUser && <LoginForm user={selectedUser} />}
      </div>
    </div>
  );
};

export default LoginComponent;
