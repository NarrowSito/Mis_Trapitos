import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ rol, nombre }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: 'block',
    padding: '15px 20px',
    color: isActive(path) ? '#ffffff' : '#adb5bd',
    textDecoration: 'none',
    backgroundColor: isActive(path) ? '#3b82f6' : 'transparent',
    borderLeft: isActive(path) ? '4px solid #60a5fa' : '4px solid transparent',
    marginBottom: '5px',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    transition: 'all 0.2s'
  });

  return (
    <aside style={{ width: '250px', backgroundColor: '#212529', color: 'white', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '30px 20px', borderBottom: '1px solid #343a40' }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: '#f8f9fa' }}>Mis Trapitos</h2>
      </div>

      <nav style={{ flexGrow: 1, marginTop: '20px' }}>
        {/* La caja registradora siempre es visible para cualquier usuario */}
        <Link to="/ventas" style={linkStyle('/ventas')}>Registrar Venta (POS)</Link>

        {/* Estas opciones se renderizan unicamente si el rol lo permite */}
        {rol === 'Administrador' && (
          <>
            <Link to="/inventario" style={linkStyle('/inventario')}>Inventario y Productos</Link>
            <Link to="/clientes" style={linkStyle('/clientes')}>Gestion de Clientes</Link>
            <Link to="/reportes" style={linkStyle('/reportes')}>Consultas y Reportes</Link>
          </>
        )}
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid #343a40', fontSize: '13px', color: '#adb5bd' }}>
        <div style={{ marginBottom: '5px' }}>Usuario: <span style={{ color: '#fff' }}>{nombre}</span></div>
        <div>Rol: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{rol}</span></div>
      </div>
      
    </aside>
  );
}