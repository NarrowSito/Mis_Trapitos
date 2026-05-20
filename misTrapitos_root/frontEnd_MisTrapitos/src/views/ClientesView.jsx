import React, { useState, useEffect } from 'react';

export default function ClientesView() {
  const [clientes, setClientes] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '', telefono: '', email: '', direccion: '', ciudad: '', region: ''
  });

  // GET: Esperamos que el backend nos devuelva la lista completa con ubicación
  const cargarClientes = () => {
    setCargando(true);
    fetch('http://localhost:8080/api/clientes')
      .then((response) => {
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        return response.json();
      })
      .then((data) => {
        setClientes(data);
        setCargando(false);
      })
      .catch((err) => {
        setErrorApi(err.message);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const manejarCambio = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  // POST: Le mostramos al backend exactamente cómo luce nuestro JSON de envío
  const guardarCliente = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });

      if (response.ok) {
        alert('Cliente registrado correctamente.');
        setMostrarModal(false);
        setNuevoCliente({ nombre: '', telefono: '', email: '', direccion: '', ciudad: '', region: '' });
        cargarClientes(); 
      } else {
        alert('Error en la validacion del servidor al guardar.');
      }
    } catch (error) {
      alert('Error de red al intentar comunicarse con la API.');
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#212529' }}>Directorio de Clientes</h1>
          <p style={{ color: '#6c757d', margin: '5px 0 0 0' }}>Sincronizado con la API ideal (incluye ubicacion completa).</p>
        </div>
        <button onClick={() => setMostrarModal(true)} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          + Nuevo Cliente
        </button>
      </div>

      {cargando && <p style={{ color: '#6c757d' }}>Cargando datos del servidor...</p>}
      {errorApi && <p style={{ color: '#dc2626' }}>Error de conexion. Esperando despliegue del backend.</p>}

      {!cargando && !errorApi && (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <tr>
                <th style={{ padding: '15px', color: '#495057' }}>ID</th>
                <th style={{ padding: '15px', color: '#495057' }}>Nombre</th>
                <th style={{ padding: '15px', color: '#495057' }}>Contacto</th>
                <th style={{ padding: '15px', color: '#495057' }}>Ubicacion Fisica</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '25px', textAlign: 'center', color: '#6c757d' }}>Sin registros.</td></tr>
              ) : (
                clientes.map(cliente => (
                  <tr key={cliente.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', color: '#6c757d' }}>#{cliente.id}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#212529' }}>{cliente.nombre}</td>
                    <td style={{ padding: '15px', color: '#6c757d' }}>
                      <div>Tel: {cliente.telefono}</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>Email: {cliente.email}</div>
                    </td>
                    <td style={{ padding: '15px', color: '#6c757d' }}>
                      <div>{cliente.direccion}</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>{cliente.ciudad}, {cliente.region}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#212529' }}>Registrar Cliente</h2>
            <form onSubmit={guardarCliente} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required type="text" name="nombre" value={nuevoCliente.nombre} onChange={manejarCambio} placeholder="Nombre Completo" style={{ padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <input required type="tel" name="telefono" value={nuevoCliente.telefono} onChange={manejarCambio} placeholder="Telefono" style={{ flex: 1, padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
                <input type="email" name="email" value={nuevoCliente.email} onChange={manejarCambio} placeholder="Email" style={{ flex: 1, padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
              </div>

              <input type="text" name="direccion" value={nuevoCliente.direccion} onChange={manejarCambio} placeholder="Direccion" style={{ padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" name="ciudad" value={nuevoCliente.ciudad} onChange={manejarCambio} placeholder="Ciudad (Ej. Guadalajara)" style={{ flex: 1, padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
                <input type="text" name="region" value={nuevoCliente.region} onChange={manejarCambio} placeholder="Region/Estado (Ej. Jalisco)" style={{ flex: 1, padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ flex: 1, padding: '12px' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}