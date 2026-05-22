import React, { useState, useEffect } from 'react';

export default function InventarioView() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState('');

  // Estados para el Modal de Agregar Producto
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: ''
  });

  const cargarInventario = () => {
    fetch('http://localhost:8080/productos/')
      .then((response) => {
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        setErrorApi(err.message);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  // ESTA ES LA FUNCIÓN QUE LE VA A DISPARAR EL POST A TU COMPAÑERO
  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      // Nota: Aquí le mandamos todo como números donde corresponde para que Java no se enoje
      const productoAEnviar = {
        ...nuevoProducto,
        precio: parseFloat(nuevoProducto.precio),
        stock: parseInt(nuevoProducto.stock, 10)
      };

      const response = await fetch('http://localhost:8080/productos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoAEnviar)
      });

      if (response.ok) {
        alert('¡Producto enviado al backend con éxito!');
        setMostrarModal(false);
        setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '' });
        cargarInventario(); // Recargamos la tabla para ver el nuevo producto
      } else {
        alert('El servidor rechazó el producto. Dile al del back que revise su consola jaja.');
      }
    } catch (error) {
      alert('Error de red al intentar guardar.');
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#212529' }}>Catálogo de Productos</h2>
        {/* Aquí encendemos el modal */}
        <button onClick={() => setMostrarModal(true)} style={{ padding: '10px 15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Nuevo Producto
        </button>
      </div>

      {cargando ? (
        <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>Cargando inventario...</p>
      ) : errorApi ? (
        <p style={{ color: '#dc2626', textAlign: 'center', padding: '20px' }}>{errorApi}</p>
      ) : productos.length === 0 ? (
        <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>No hay productos registrados (o el JOIN de Promociones los está filtrando).</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Producto</th>
              <th style={{ padding: '12px' }}>Categoría</th>
              <th style={{ padding: '12px' }}>Variación (Talla/Color)</th>
              <th style={{ padding: '12px' }}>Precio</th>
              <th style={{ padding: '12px' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px', color: '#6c757d' }}>#{prod.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#212529' }}>{prod.nombre}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {prod.categoria}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{prod.talla} - {prod.color}</td>
                <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>${prod.precio ? prod.precio.toFixed(2) : '0.00'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: prod.stock > 0 ? '#212529' : '#dc2626', fontWeight: prod.stock > 0 ? 'normal' : 'bold' }}>
                    {prod.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =========================================
          MODAL DE REGISTRO (Flota encima de todo)
          ========================================= */}
      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#212529' }}>Registrar Nuevo Producto</h2>
            
            <form onSubmit={guardarProducto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <input required type="text" name="nombre" value={nuevoProducto.nombre} onChange={manejarCambio} placeholder="Nombre del Producto (Ej. Pantalón de Mezclilla)" style={{ padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
              <input required type="text" name="descripcion" value={nuevoProducto.descripcion} onChange={manejarCambio} placeholder="Descripción breve" style={{ padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
              <input required type="text" name="categoria" value={nuevoProducto.categoria} onChange={manejarCambio} placeholder="Categoría (Ej. Ropa de Invierno)" style={{ padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <input required type="number" step="0.01" name="precio" value={nuevoProducto.precio} onChange={manejarCambio} placeholder="Precio ($)" style={{ flex: 1, padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
                <input required type="number" name="stock" value={nuevoProducto.stock} onChange={manejarCambio} placeholder="Unidades en Stock" style={{ flex: 1, padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid #dee2e6', borderRadius: '6px', background: '#f8f9fa', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar en BD</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}