import React, { useState, useEffect } from 'react';

export default function AuditoriaView() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState('');
  const [pagina, setPagina] = useState(1); // EL ESTADO QUE CONTROLA LA PÁGINA

  useEffect(() => {
    let mounted = true;
    const fetchData = () => {
      setCargando(true);
      fetch(`http://localhost:8080/historicos/${pagina}`)
        .then(response => {
          if (!response.ok) throw new Error('Error al conectar');
          return response.json();
        })
        .then(data => {
          if (!mounted) return;
          setHistorial(data);
          setCargando(false);
        })
        .catch(err => {
          if (!mounted) return;
          setErrorApi(err.message);
          setCargando(false);
        });
    };

    // fetch inicial
    fetchData();

    // refrescar periódicamente para captar nuevas ventas
    const intervalo = setInterval(fetchData, 5000);

    return () => {
      mounted = false;
      clearInterval(intervalo);
    };
  }, [pagina]); // se reejecuta al cambiar de página

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h1 style={{ margin: 0, fontSize: '28px', color: '#212529', marginBottom: '10px' }}>Auditoría de Sistema</h1>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>Registro de movimientos de inventario y modificaciones de stock.</p>
      
      {cargando ? (
        <p style={{ color: '#6c757d' }}>Cargando registros...</p>
      ) : errorApi ? (
        <p style={{ color: '#dc2626' }}>Error: No se pudo conectar con el servidor.</p>
      ) : historial.length === 0 && pagina === 1 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', padding: '30px', textAlign: 'center' }}>
          <p style={{ color: '#adb5bd', margin: 0 }}>No hay movimientos registrados.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden', paddingBottom: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', marginBottom: '15px' }}>
            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <tr>
                <th style={{ padding: '15px', color: '#495057' }}>Fecha</th>
                <th style={{ padding: '15px', color: '#495057' }}>Usuario</th>
                <th style={{ padding: '15px', color: '#495057' }}>Movimiento</th>
                <th style={{ padding: '15px', color: '#495057' }}>Prenda</th>
                <th style={{ padding: '15px', color: '#495057' }}>Cant.</th>
                <th style={{ padding: '15px', color: '#495057' }}>Stock (Ant {"->"} Nvo)</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((mov, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', color: '#6c757d' }}>
                    {mov.fecha ? new Date(mov.fecha).toLocaleString() : 'N/A'}
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#212529' }}>{mov.usuario}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {mov.tipoMovimiento || mov.motivo}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#6c757d' }}>Talla {mov.talla} - {mov.color}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{mov.cantidad}</td>
                  <td style={{ padding: '15px', color: '#6c757d' }}>{mov.stockAnterior} ➔ {mov.stockNuevo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* BOTONES DE PAGINACIÓN */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => setPagina(pagina - 1)} 
              disabled={pagina === 1}
              style={{ padding: '8px 16px', backgroundColor: pagina === 1 ? '#f8f9fa' : '#3b82f6', color: pagina === 1 ? '#adb5bd' : 'white', border: '1px solid #dee2e6', borderRadius: '4px', cursor: pagina === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              ← Anterior
            </button>
            <span style={{ color: '#495057', fontSize: '14px', fontWeight: 'bold' }}>
              Página {pagina}
            </span>
            <button 
              onClick={() => setPagina(pagina + 1)} 
              disabled={historial.length < 10} // Si trae menos de 10, ya es la última página
              style={{ padding: '8px 16px', backgroundColor: historial.length < 10 ? '#f8f9fa' : '#3b82f6', color: historial.length < 10 ? '#adb5bd' : 'white', border: '1px solid #dee2e6', borderRadius: '4px', cursor: historial.length < 10 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}