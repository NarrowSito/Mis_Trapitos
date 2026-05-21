import React from 'react';

export default function ProveedoresView() {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '28px', color: '#212529', marginBottom: '10px' }}>Directorio de Proveedores</h1>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>Control de contactos y empresas que surten la mercancia.</p>
      
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', padding: '30px', textAlign: 'center' }}>
        <p style={{ color: '#adb5bd', margin: 0 }}>Esperando conexion con GET /api/proveedores</p>
      </div>
    </div>
  );
}