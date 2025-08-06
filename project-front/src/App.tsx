import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LoginComponent from './components/login/LoginComponent';
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Portal de Autenticación</h1>
      <LoginComponent />
    </div>
  );
}


export default App
