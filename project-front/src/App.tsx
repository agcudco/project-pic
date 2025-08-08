import React, { useContext, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { AuthContext } from './context/AuthContext';

import Login from './components/login/Login';
import Roles from './components/Roles/Roles';
import Admin from './components/Admin/Admin';
import User from './components/User/User';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <>{children}</> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  // El ref es Toast | null
  const toast = useRef<Toast | null>(null);

  return (
    <>
      <Toast ref={toast} />
      <Routes>
        <Route path="/" element={<Login toast={toast} />} />
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <Roles />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
