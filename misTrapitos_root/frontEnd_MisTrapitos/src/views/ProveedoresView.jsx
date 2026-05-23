import React, { useState, useEffect } from 'react';

export default function ProveedoresView() {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/proveedores/1')
      .then(response => {
        if (!response.ok) throw new Error('Error al conectar');
        return response.json();
      })
      .then(data => {
        setProveedores(data);
        setCargando(false);
      })
      .catch(err => {
        setErrorApi(err.message);
        setCargando(false);
      });
  }, []);

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '28px', color: '#212529', marginBottom: '10px' }}>Directorio de Proveedores</h1>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>Empresas y contactos que surten la mercancía.</p>
      
      {cargando ? (
        <p style={{ color: '#6c757d' }}>Cargando directorio...</p>
      ) : errorApi ? (
        <p style={{ color: '#dc2626' }}>Error: No se pudo conectar con el servidor.</p>
      ) : proveedores.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', padding: '30px', textAlign: 'center' }}>
          <p style={{ color: '#adb5bd', margin: 0 }}>No hay proveedores registrados en la base de datos.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <tr>
                <th style={{ padding: '15px', color: '#495057' }}>ID</th>
                <th style={{ padding: '15px', color: '#495057' }}>Empresa / Nombre</th>
                <th style={{ padding: '15px', color: '#495057' }}>Contacto</th>
                <th style={{ padding: '15px', color: '#495057' }}>Dirección</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map(prov => (
                <tr key={prov.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', color: '#6c757d' }}>#{prov.id}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#212529' }}>{prov.nombre}</td>
                  <td style={{ padding: '15px', color: '#6c757d' }}>
                    <div>Tel: {prov.telefono}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>{prov.email}</div>
                  </td>
                  <td style={{ padding: '15px', color: '#6c757d' }}>{prov.direccion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}