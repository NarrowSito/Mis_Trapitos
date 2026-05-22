import React, { useState, useEffect } from 'react';

export default function InventarioView() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState('');

  // Estados para el Modal (Ahora solo es para sumar stock)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [stockForm, setStockForm] = useState({ id: '', stock: '' });

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
    setStockForm({ ...stockForm, [name]: value });
  };

  // Función para disparar el POST (que en realidad hace un UPDATE en el back)
  const actualizarStock = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: parseInt(stockForm.id, 10),
        stock: parseInt(stockForm.stock, 10)
      };

      const response = await fetch('http://localhost:8080/productos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('¡Stock sumado con éxito en la Base de Datos!');
        setMostrarModal(false);
        setStockForm({ id: '', stock: '' });
        cargarInventario(); // Recargamos la tabla para ver el nuevo numerito
      } else {
        alert('El servidor rechazó la operación. Revisa si el backend está corriendo bien.');
      }
    } catch (error) {
      alert('Error de red al intentar actualizar el stock.');
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#212529' }}>Catálogo de Productos</h2>
        <button onClick={() => setMostrarModal(true)} style={{ padding: '10px 15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Agregar Stock
        </button>
      </div>

      {cargando ? (
        <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>Cargando inventario...</p>
      ) : errorApi ? (
        <p style={{ color: '#dc2626', textAlign: 'center', padding: '20px' }}>{errorApi}</p>
      ) : productos.length === 0 ? (
        <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>No hay productos registrados (esperando el LEFT JOIN del back).</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Producto</th>
              <th style={{ padding: '12px' }}>Categoría</th>
              <th style={{ padding: '12px' }}>Variación</th>
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
                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{prod.categoria}</span>
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
          MODAL PARA SUMAR STOCK
          ========================================= */}
      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#212529' }}>Agregar Existencias</h2>
            
            <form onSubmit={actualizarStock} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* Desplegable mágico que lee los productos cargados */}
              <select required name="id" value={stockForm.id} onChange={manejarCambio} style={{ padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px', backgroundColor: '#7a87a2' }}>
                <option value="">-- Selecciona el producto --</option>
                {productos.map(prod => (
                  <option key={prod.id} value={prod.id}>
                    #{prod.id} - {prod.nombre} ({prod.talla} {prod.color})
                  </option>
                ))}
              </select>

              <input required type="number" min="1" name="stock" value={stockForm.stock} onChange={manejarCambio} placeholder="¿Cuántas unidades llegaron?" style={{ padding: '10px', border: '1px solid #dee2e6', borderRadius: '6px' }} />

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid #dee2e6', borderRadius: '6px', background: '#b7d1e6', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sumar Stock</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}