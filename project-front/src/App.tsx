import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import LoginComponent from './components/login/LoginComponent';
import IndexPage from './IndexPage';
import type { Login } from './types/login';
import './App.css';

function App() {
  const [user, setUser] = useState<Login | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent setUser={setUser} />} />
        <Route path="/index" element={<IndexPage user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App
