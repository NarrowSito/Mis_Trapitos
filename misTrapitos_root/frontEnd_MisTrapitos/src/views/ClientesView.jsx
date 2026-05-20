import React, { useState } from 'react';

export default function ClientesView() {
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Ana Torres', telefono: '3311111111', email: 'ana@gmail.com', direccion: 'Centro' },
    { id: 2, nombre: 'Luis Pérez', telefono: '3322222222', email: 'luis@gmail.com', direccion: 'Colonia Americana' }
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#212529' }}>Directorio de Clientes</h1>
          <p style={{ color: '#6c757d', margin: '5px 0 0 0' }}>Registro para historial de compras.</p>
        </div>
        <button style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          + Nuevo Cliente
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '15px', color: '#495057' }}>ID</th>
              <th style={{ padding: '15px', color: '#495057' }}>Nombre</th>
              <th style={{ padding: '15px', color: '#495057' }}>Teléfono</th>
              <th style={{ padding: '15px', color: '#495057' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', color: '#6c757d' }}>#{cliente.id}</td>
                <td style={{ padding: '15px', fontWeight: 'bold', color: '#212529' }}>{cliente.nombre}</td>
                <td style={{ padding: '15px', color: '#6c757d' }}>{cliente.telefono}</td>
                <td style={{ padding: '15px', color: '#6c757d' }}>{cliente.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}