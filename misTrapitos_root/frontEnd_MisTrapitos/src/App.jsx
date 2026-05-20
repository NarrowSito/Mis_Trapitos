import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import VentasView from './views/VentasView';
import ClientesView from './views/ClientesView';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', margin: 0, backgroundColor: '#f4f6f9' }}>
        
        <Sidebar />

        <main style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/ventas" replace />} />
            <Route path="/ventas" element={<VentasView />} />
            <Route path="/clientes" element={<ClientesView />} />
            
            <Route path="/inventario" element={<h2>Módulo de Inventario en construcción 🚧</h2>} />
            <Route path="/reportes" element={<h2>Módulo de Reportes en construcción 🚧</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}