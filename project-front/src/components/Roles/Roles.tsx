import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { AuthContext } from '../../context/AuthContext';

const Roles: React.FC = () => {
  const { roles, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="p-d-flex p-flex-column p-ai-center p-mt-6">
      <h2>Selecciona tu rol</h2>
      <div className="p-d-flex p-flex-wrap p-jc-center p-mt-4" style={{ gap: '1rem' }}>
        {roles.map(role => (
          <Button
            key={role}
            label={role}
            icon={`pi pi-user-${role.toLowerCase()}`}
            onClick={() => navigate(`/${role.toLowerCase()}`)}
          />
        ))}
      </div>
      <Button
        label="Cerrar sesión"
        icon="pi pi-sign-out"
        className="p-button-text p-mt-5"
        onClick={() => {
          logout();
          navigate('/');
        }}
      />
    </div>
  );
};

export default Roles;
