import React, { useState } from 'react';

export default function InventarioView() {
  const [cargando, setCargando] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#212529' }}>Gestion de Inventario</h1>
          <p style={{ color: '#6c757d', margin: '5px 0 0 0' }}>Control de existencias y variaciones por prendas.</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', padding: '30px', textAlign: 'center' }}>
        <p style={{ color: '#6c757d', margin: 0, fontSize: '15px' }}>
          {cargando ? 'Cargando existencias desde el servidor local...' : 'Conectando con el inventario de PostgreSQL...'}
        </p>
      </div>
    </div>
  );
}