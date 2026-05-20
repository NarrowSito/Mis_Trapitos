import React, { useState } from 'react';

export default function ClientesView() {
  // Datos iniciales basados en la captura de tu compañero
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Ana Torres', telefono: '3311111111', email: 'ana@gmail.com', direccion: 'Centro', ciudad: 'Guadalajara', region: 'Jalisco' },
    { id: 2, nombre: 'Luis Pérez', telefono: '3322222222', email: 'luis@gmail.com', direccion: 'Zapopan', ciudad: 'Zapopan', region: 'Jalisco' }
  ]);

  // Estados para el formulario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '', telefono: '', email: '', direccion: '', ciudad: '', region: ''
  });

  const manejarCambio = (e) => {
    setNuevoCliente({
      ...nuevoCliente,
      [e.target.name]: e.target.value
    });
  };

  const guardarCliente = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // Simulamos la creación agregándole un ID ficticio
    const clienteConId = { 
      ...nuevoCliente, 
      id: clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1 
    };
    
    // Actualizamos la tabla al instante (Actualización Optimista)
    setClientes([...clientes, clienteConId]);
    
    // Limpiamos y cerramos
    setNuevoCliente({ nombre: '', telefono: '', email: '', direccion: '', ciudad: '', region: '' });
    setMostrarModal(false);
    
    alert('Cliente guardado exitosamente (Simulado)');
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      
      {/* --- ENCABEZADO --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#212529' }}>Directorio de Clientes</h1>
          <p style={{ color: '#6c757d', margin: '5px 0 0 0' }}>Registro para historial de compras y fidelización.</p>
        </div>
        <button 
          onClick={() => setMostrarModal(true)}
          style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
          + Nuevo Cliente
        </button>
      </div>

      {/* --- TABLA DE CLIENTES --- */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '15px', color: '#495057' }}>ID</th>
              <th style={{ padding: '15px', color: '#495057' }}>Nombre Completo</th>
              <th style={{ padding: '15px', color: '#495057' }}>Contacto</th>
              <th style={{ padding: '15px', color: '#495057' }}>Ubicación</th>
              <th style={{ padding: '15px', color: '#495057', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>No hay clientes registrados.</td></tr>
            ) : (
              clientes.map(cliente => (
                <tr key={cliente.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', color: '#6c757d' }}>#{cliente.id}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#212529' }}>{cliente.nombre}</td>
                  <td style={{ padding: '15px', color: '#6c757d' }}>
                    <div>📞 {cliente.telefono}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>✉️ {cliente.email}</div>
                  </td>
                  <td style={{ padding: '15px', color: '#6c757d' }}>
                    <div>{cliente.direccion}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>{cliente.ciudad}, {cliente.region}</div>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button style={{ padding: '6px 12px', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                      Ver Historial
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL FORMULARIO DE NUEVO CLIENTE --- */}
      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#212529' }}>Registrar Cliente</h2>
              <button onClick={() => setMostrarModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6c757d' }}>✖</button>
            </div>

            <form onSubmit={guardarCliente} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '5px', fontWeight: 'bold' }}>Nombre Completo *</label>
                <input required type="text" name="nombre" value={nuevoCliente.nombre} onChange={manejarCambio} style={{ width: '100%', padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="Ej. Juan Pérez" />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '5px', fontWeight: 'bold' }}>Teléfono *</label>
                  <input required type="tel" name="telefono" value={nuevoCliente.telefono} onChange={manejarCambio} style={{ width: '100%', padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="10 dígitos" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                  <input type="email" name="email" value={nuevoCliente.email} onChange={manejarCambio} style={{ width: '100%', padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="correo@ejemplo.com" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '5px', fontWeight: 'bold' }}>Dirección Física</label>
                <input type="text" name="direccion" value={nuevoCliente.direccion} onChange={manejarCambio} style={{ width: '100%', padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="Calle y número" />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '5px', fontWeight: 'bold' }}>Ciudad</label>
                  <input type="text" name="ciudad" value={nuevoCliente.ciudad} onChange={manejarCambio} style={{ width: '100%', padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="Ej. Guadalajara" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '5px', fontWeight: 'bold' }}>Región/Estado</label>
                  <input type="text" name="region" value={nuevoCliente.region} onChange={manejarCambio} style={{ width: '100%', padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="Ej. Jalisco" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  💾 Guardar Cliente
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}