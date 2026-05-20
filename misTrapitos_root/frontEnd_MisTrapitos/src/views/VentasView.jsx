import React, { useState } from 'react';

export default function VentasView() {
  // Simulamos los datos combinados que enviará el backend (con sus variaciones)
  const [productos] = useState([
    { id: 1, nombre: 'Camiseta Negra', categoria: 'Camisetas', precio: 240.00, variaciones: [
      { idVariacion: 1, talla: 'S', color: 'Negro', stock: 18 },
      { idVariacion: 2, talla: 'M', color: 'Negro', stock: 14 }
    ]},
    { id: 3, nombre: 'Sudadera Gris', categoria: 'Ropa de Invierno', precio: 552.50, variaciones: [
      { idVariacion: 5, talla: 'M', color: 'Gris', stock: 7 },
      { idVariacion: 6, talla: 'L', color: 'Gris', stock: 6 }
    ]}
  ]);

  const [carrito, setCarrito] = useState([]);
  
  // Estados para manejar la ventanita de Tallas/Colores
  const [productoActivo, setProductoActivo] = useState(null);

  const abrirSelector = (producto) => {
    setProductoActivo(producto);
  };

  const agregarVariacionAlCarrito = (variacion) => {
    // Buscamos si ESA variación exacta ya está en el carrito
    const itemExistente = carrito.find(item => item.idVariacion === variacion.idVariacion);
    
    if (itemExistente) {
      setCarrito(carrito.map(item => 
        item.idVariacion === variacion.idVariacion ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { 
        nombre: productoActivo.nombre, 
        precio: productoActivo.precio,
        talla: variacion.talla,
        color: variacion.color,
        idVariacion: variacion.idVariacion,
        cantidad: 1 
      }]);
    }
    setProductoActivo(null); // Cerramos el modal
  };

  const eliminarDelCarrito = (idVariacion) => {
    setCarrito(carrito.filter(item => item.idVariacion !== idVariacion));
  };

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%', alignItems: 'flex-start', position: 'relative' }}>
      
      {/* --- CATÁLOGO IZQUIERDO --- */}
      <div style={{ flex: '7' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#212529', marginBottom: '10px' }}>Punto de Venta</h1>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>Selecciona los productos para el ticket.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
          {productos.map((prod) => (
            <div 
              key={prod.id} 
              onClick={() => abrirSelector(prod)}
              style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6', cursor: 'pointer', transition: '0.2s' }}
            >
              <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{prod.categoria}</span>
              <h3 style={{ margin: '10px 0 5px 0', fontSize: '16px' }}>{prod.nombre}</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#212529', margin: 0 }}>${prod.precio.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- CARRITO DERECHO --- */}
      <div style={{ flex: '3', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Ticket Actual</h2>
        
        {carrito.length === 0 ? (
          <p style={{ color: '#adb5bd', textAlign: 'center', margin: '40px 0' }}>Ticket vacío</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {carrito.map((item) => (
              <div key={item.idVariacion} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px dashed #eee', paddingBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.nombre}</div>
                  <div style={{ color: '#6c757d', fontSize: '12px' }}>{item.talla} - {item.color}</div>
                  <div style={{ color: '#6c757d', fontSize: '12px' }}>{item.cantidad} x ${item.precio.toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>${(item.precio * item.cantidad).toFixed(2)}</span>
                  <button onClick={() => eliminarDelCarrito(item.idVariacion)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>✖</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 'bold', margin: '20px 0' }}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer', opacity: carrito.length === 0 ? 0.5 : 1 }}>
          Cobrar Venta
        </button>
      </div>

      {/* --- VENTANA EMERGENTE (MODAL) DE TALLAS --- */}
      {productoActivo && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h2 style={{ margin: '0 0 15px 0' }}>{productoActivo.nombre}</h2>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>Selecciona la variación a vender:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {productoActivo.variaciones.map(v => (
                <button 
                  key={v.idVariacion} 
                  onClick={() => agregarVariacionAlCarrito(v)}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid #dee2e6', borderRadius: '6px', background: '#f8f9fa', cursor: 'pointer', fontSize: '15px' }}
                >
                  <span>Talla: <strong>{v.talla}</strong> | {v.color}</span>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>Stock: {v.stock}</span>
                </button>
              ))}
            </div>

            <button onClick={() => setProductoActivo(null)} style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}