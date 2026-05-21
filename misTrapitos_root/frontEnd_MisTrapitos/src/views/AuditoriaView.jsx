import React from 'react';

export default function AuditoriaView() {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '28px', color: '#212529', marginBottom: '10px' }}>Auditoria y Seguridad</h1>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>Registro inmutable de movimientos operativos y financieros en el sistema.</p>
      
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', padding: '30px', textAlign: 'center' }}>
        <p style={{ color: '#adb5bd', margin: 0 }}>Esperando conexion con GET /api/auditoria</p>
      </div>
    </div>
  );
}