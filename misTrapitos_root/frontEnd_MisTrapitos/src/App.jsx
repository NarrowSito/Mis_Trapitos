import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import VentasView from './views/VentasView';
import ClientesView from './views/ClientesView';
import InventarioView from './views/InventarioView';
import ReportesView from './views/ReportesView';

export default function App() {
  // Simulacion del JSON que el backend mandaria tras el Login.
  // Para probar la vista del cajero, cambia 'Administrador' por 'Ventas'
  const [sesionUsuario] = useState({
    id: 1,
    nombre: 'Ricardo Admin',
    rol: 'Administrador' 
  });

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', margin: 0, backgroundColor: '#f4f6f9' }}>
        
        {/* Pasamos los datos del usuario al Sidebar para condicionar el menu */}
        <Sidebar rol={sesionUsuario.rol} nombre={sesionUsuario.nombre} />

        <main style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/ventas" replace />} />
            
            {/* VentasView recibe la sesion para inyectar el usuario_id en el POST */}
            <Route path="/ventas" element={<VentasView sesionUsuario={sesionUsuario} />} />
            
            {/* Proteccion de Rutas: Si no es Administrador, lo regresamos a ventas */}
            <Route 
              path="/clientes" 
              element={sesionUsuario.rol === 'Administrador' ? <ClientesView /> : <Navigate to="/ventas" replace />} 
            />
            <Route 
              path="/inventario" 
              element={sesionUsuario.rol === 'Administrador' ? <InventarioView /> : <Navigate to="/ventas" replace />} 
            />
            <Route 
              path="/reportes" 
              element={sesionUsuario.rol === 'Administrador' ? <ReportesView /> : <Navigate to="/ventas" replace />} 
            />
          </Routes>
        </main>

      </div>
    </Router>
  );
}
