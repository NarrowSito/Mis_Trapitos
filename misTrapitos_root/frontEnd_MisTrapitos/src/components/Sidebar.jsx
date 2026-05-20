import React from 'react';

export default function Sidebar({ vistaActual, setVistaActual }) {
  return (
    <aside style={{ width: '260px', backgroundColor: '#1e2229', color: '#fff', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h2 style={{ fontSize: '22px', textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #343a40', paddingBottom: '15px', color: '#e9ecef' }}>
        Mis Trapitos
      </h2>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
        <button 
          onClick={() => setVistaActual('ventas')}
          style={{ padding: '12px', textAlign: 'left', background: vistaActual === 'ventas' ? '#3b82f6' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', transition: '0.2s' }}>
          Registrar Venta (POS)
        </button>
        <button 
          onClick={() => setVistaActual('inventario')}
          style={{ padding: '12px', textAlign: 'left', background: vistaActual === 'inventario' ? '#3b82f6' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', transition: '0.2s' }}>
          Inventario y Productos
        </button>
        <button 
          onClick={() => setVistaActual('clientes')}
          style={{ padding: '12px', textAlign: 'left', background: vistaActual === 'clientes' ? '#3b82f6' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', transition: '0.2s' }}>
          Gestión de Clientes
        </button>
        <button 
          onClick={() => setVistaActual('reportes')}
          style={{ padding: '12px', textAlign: 'left', background: vistaActual === 'reportes' ? '#3b82f6' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', transition: '0.2s' }}>
          Consultas y Reportes
        </button>
      </nav>

      <div style={{ fontSize: '12px', color: '#6c757d', textAlign: 'center', borderTop: '1px solid #343a40', paddingTop: '15px' }}>
        Sesión: Administrador local
      </div>
    </aside>
  );
}