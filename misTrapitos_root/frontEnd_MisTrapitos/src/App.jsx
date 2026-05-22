import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginView from './views/LoginView';
import VentasView from './views/VentasView';
import ClientesView from './views/ClientesView';
import InventarioView from './views/InventarioView';
import ReportesView from './views/ReportesView';
// Importamos las 3 vistas nuevas
import EmpleadosView from './views/EmpleadosView';
import ProveedoresView from './views/ProveedoresView';
import AuditoriaView from './views/AuditoriaView';

export default function App() {
  const [sesionUsuario, setSesionUsuario] = useState(null);

  if (!sesionUsuario) {
    return <LoginView onLoginExitoso={(datos) => setSesionUsuario(datos)} />;
  }

  const rol = sesionUsuario.rol;

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', margin: 0, backgroundColor: '#f4f6f9' }}>
        
        <Sidebar rol={rol} nombre={sesionUsuario.nombre} onCerrarSesion={() => setSesionUsuario(null)} />

        <main style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/ventas" replace />} />
            
            {/* Accesible para todos */}
            <Route path="/ventas" element={
              (rol === 'empleado' || rol === 'admin') ? <VentasView sesionUsuario={sesionUsuario} /> : <Navigate to="/" replace />
            } />
            <Route path="/clientes" element={
              (rol === 'empleado' || rol === 'admin') ? <ClientesView /> : <Navigate to="/" replace />
            } />

            {/* Exclusivo del Admin (Lo demás queda oculto) */}
            <Route path="/inventario" element={rol === 'admin' ? <InventarioView /> : <Navigate to="/" replace />} />
            <Route path="/reportes" element={rol === 'admin' ? <ReportesView /> : <Navigate to="/" replace />} />
            <Route path="/proveedores" element={rol === 'admin' ? <ProveedoresView /> : <Navigate to="/" replace />} />
            <Route path="/empleados" element={rol === 'admin' ? <EmpleadosView /> : <Navigate to="/" replace />} />
            <Route path="/auditoria" element={rol === 'admin' ? <AuditoriaView /> : <Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}