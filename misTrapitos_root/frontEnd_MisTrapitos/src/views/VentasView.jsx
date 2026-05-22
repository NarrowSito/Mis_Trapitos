import React, { useState, useEffect } from 'react';

export default function VentasView({ sesionUsuario = { id: 1, rol: 'Ventas', nombre: 'Cajero Default' } }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [carrito, setCarrito] = useState([]);
  
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('');

  const [ventaActualId, setVentaActualId] = useState(null);

  // 1. INICIALIZACION
  useEffect(() => {
    fetch('http://localhost:8080/productos/')
      .then(response => response.json())
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Esperando despliegue de API de productos", err);
        setCargando(false);
      });

    abrirNuevaVenta();
  }, []);

  const abrirNuevaVenta = async () => {
    try {
      const response = await fetch('http://localhost:8080/ventas/nueva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: sesionUsuario.id })
      });
      if (response.ok) {
        const data = await response.json();
        setVentaActualId(data.id); 
      }
    } catch (error) {
      console.error("No se pudo inicializar la venta vacia en el servidor.");
    }
  };

  // 2. ACTUALIZACION OPTIMISTA Y BACKGROUND PUT (Refactorizado para JSON plano)
  const agregarAlCarrito = async (prod) => {
    if (prod.stock === 0) return; // Proteccion: No agregar si no hay stock

    // Actualizacion visual inmediata (Optimista)
    let nuevoCarrito;
    const itemExistente = carrito.find(item => item.id === prod.id);
    
    if (itemExistente) {
      nuevoCarrito = carrito.map(item => 
        item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      // Como el JSON ya es plano, pasamos todo el producto directo con cantidad 1
      nuevoCarrito = [...carrito, { ...prod, cantidad: 1 }];
    }
    
    setCarrito(nuevoCarrito);

    // Peticion PUT en segundo plano 
    if (ventaActualId) {
      try {
        await fetch(`http://localhost:8080/ventas/${ventaActualId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            accion: 'agregar',
            variacion_id: prod.id, // El ID ahora viene directo en la raiz del producto
            cantidad: 1 
          })
        });
      } catch (error) {
        console.error("Fallo la sincronizacion PUT en segundo plano.");
      }
    }
  };

  const eliminarDelCarrito = async (id) => {
    // Actualizacion visual inmediata
    setCarrito(carrito.filter(item => item.id !== id));

    // Peticion PUT en segundo plano
    if (ventaActualId) {
      try {
        await fetch(`http://localhost:8080/ventas/${ventaActualId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            accion: 'eliminar',
            variacion_id: id 
          })
        });
      } catch (error) {
        console.error("Fallo la sincronizacion PUT en segundo plano al eliminar.");
      }
    }
  };

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // 3. CIERRE DE VENTA
  const procesarVenta = async () => {
    try {
      const response = await fetch(`http://localhost:8080/ventas/${ventaActualId}/cerrar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metodo_pago: metodoPago, total_final: total })
      });

      if (response.ok) {
        alert('Transaccion cerrada y finalizada.');
        setCarrito([]);
        setMostrarModalPago(false);
        setMetodoPago('');
        abrirNuevaVenta(); 
      } else {
        alert('El servidor rechazo el cierre de la transaccion.');
      }
    } catch (error) {
      alert('Error de red al intentar cerrar la venta.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%', alignItems: 'flex-start', position: 'relative' }}>
      
      {/* SECCION IZQUIERDA: CATALOGO */}
      <div style={{ flex: '7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#212529' }}>Punto de Venta</h1>
          <span style={{ color: '#6c757d', fontSize: '14px' }}>Cajero: {sesionUsuario.nombre} | Ticket #{ventaActualId || '...'}</span>
        </div>
        
        {cargando ? (
          <p style={{ color: '#6c757d' }}>Sincronizando catalogo...</p>
        ) : productos.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dee2e6', color: '#6c757d' }}>
            No hay productos cargados en el catalogo actualmente. (Esperando API)
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
            {productos.map((prod) => (
              <div 
                key={prod.id} 
                onClick={() => agregarAlCarrito(prod)}
                style={{ 
                  backgroundColor: prod.stock === 0 ? '#f8f9fa' : '#fff', 
                  opacity: prod.stock === 0 ? 0.5 : 1,
                  padding: '15px', 
                  borderRadius: '8px', 
                  border: '1px solid #dee2e6', 
                  cursor: prod.stock === 0 ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.1s'
                }}
              >
                <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {prod.categoria || 'General'}
                </span>
                <h3 style={{ margin: '10px 0 4px 0', fontSize: '15px' }}>{prod.nombre}</h3>
                <p style={{ fontSize: '12px', color: '#6c757d', margin: '0 0 6px 0' }}>
                  Talla: {prod.talla} | {prod.color}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#212529' }}>
                    ${parseFloat(prod.precio || 0).toFixed(2)}
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: prod.stock > 0 ? '#10b981' : '#dc2626' }}>
                    Stock: {prod.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCION DERECHA: TICKET Y COBRO */}
      <div style={{ flex: '3', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Ticket Actual</h2>
        
        {carrito.length === 0 ? (
          <p style={{ color: '#adb5bd', textAlign: 'center', margin: '40px 0' }}>Ticket vacio</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {carrito.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px dashed #eee', paddingBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.nombre}</div>
                  <div style={{ color: '#6c757d', fontSize: '12px' }}>{item.talla} - {item.color}</div>
                  <div style={{ color: '#6c757d', fontSize: '12px' }}>{item.cantidad} x ${parseFloat(item.precio).toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>${(item.precio * item.cantidad).toFixed(2)}</span>
                  <button onClick={() => eliminarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 'bold', margin: '20px 0' }}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={() => setMostrarModalPago(true)}
          disabled={carrito.length === 0 || !ventaActualId}
          style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer', opacity: carrito.length === 0 ? 0.5 : 1 }}>
          Cobrar Venta
        </button>
      </div>

      {/* MODAL DE PAGO (El modal de variaciones se elimino por completo) */}
      {mostrarModalPago && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', zIndex: 20 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h2 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>Metodo de Pago</h2>
            <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '20px', fontSize: '16px' }}>Total a cobrar: <strong style={{ color: '#212529', fontSize: '20px' }}>${total.toFixed(2)}</strong></p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
              {['efectivo', 'tarjeta', 'transferencia'].map(metodo => (
                <button
                  key={metodo}
                  onClick={() => setMetodoPago(metodo)}
                  style={{
                    padding: '12px', border: '1px solid',
                    borderColor: metodoPago === metodo ? '#3b82f6' : '#dee2e6',
                    borderRadius: '6px',
                    background: metodoPago === metodo ? '#eff6ff' : '#f8f9fa',
                    color: metodoPago === metodo ? '#1e3a8a' : '#495057',
                    fontWeight: metodoPago === metodo ? 'bold' : 'normal',
                    cursor: 'pointer', fontSize: '15px', textTransform: 'capitalize'
                  }}
                >
                  {metodo}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setMostrarModalPago(false); setMetodoPago(''); }} style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar
              </button>
              <button onClick={procesarVenta} disabled={!metodoPago} style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: !metodoPago ? 'not-allowed' : 'pointer', opacity: !metodoPago ? 0.5 : 1, fontWeight: 'bold' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}