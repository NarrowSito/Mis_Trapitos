import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ rol, nombre, onCerrarSesion }) {
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
        <span style={{ fontSize: '12px', color: '#adb5bd' }}>Control Interno</span>
      </div>

      <nav style={{ flexGrow: 1, marginTop: '20px' }}>
        
        {/* Modulos para Ventas y Administrador */}
        {(rol === 'Ventas' || rol === 'Administrador') && (
          <>
            <div style={{ padding: '10px 20px', fontSize: '11px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '1px' }}>Operacion</div>
            <Link to="/ventas" style={linkStyle('/ventas')}>Registrar Venta (POS)</Link>
            <Link to="/clientes" style={linkStyle('/clientes')}>Directorio Clientes</Link>
          </>
        )}

        {/* Modulos para Contabilidad y Administrador */}
        {(rol === 'Contabilidad' || rol === 'Administrador') && (
          <>
            <div style={{ padding: '10px 20px', fontSize: '11px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Almacen y Finanzas</div>
            <Link to="/inventario" style={linkStyle('/inventario')}>Inventario Activo</Link>
            <Link to="/reportes" style={linkStyle('/reportes')}>Consultas y Reportes</Link>
          </>
        )}

        {/* Modulos exclusivos del Administrador */}
        {rol === 'Administrador' && (
          <>
            <div style={{ padding: '10px 20px', fontSize: '11px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Administracion</div>
            <Link to="/empleados" style={linkStyle('/empleados')}>Gestionar Personal</Link>
            <Link to="/proveedores" style={linkStyle('/proveedores')}>Proveedores</Link>
            <Link to="/auditoria" style={linkStyle('/auditoria')}>Auditoria de Sistema</Link>
          </>
        )}
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid #343a40', fontSize: '13px', color: '#adb5bd' }}>
        <div style={{ marginBottom: '5px' }}>Sesion: <span style={{ color: '#fff' }}>{nombre}</span></div>
        <div style={{ marginBottom: '15px' }}>Perfil: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{rol}</span></div>
        <button 
          onClick={onCerrarSesion}
          style={{ width: '100%', padding: '8px', backgroundColor: 'transparent', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}>
          Cerrar Sesion
        </button>
      </div>
      
    </aside>
  );
}