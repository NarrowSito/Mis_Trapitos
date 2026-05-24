import React, { useState, useEffect } from 'react';

export default function VentasView({ sesionUsuario = { id: 1, rol: 'Ventas', nombre: 'Cajero Default' } }) {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [carrito, setCarrito] = useState([]);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');

  // 1. CARGAR CATÁLOGO Y CLIENTES AL INICIAR
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/productos/').then(res => res.json()),
      fetch('http://localhost:8080/clientes/1').then(res => res.json())
    ])
    .then(([dataProductos, dataClientes]) => {
      setProductos(dataProductos);
      setClientes(dataClientes);
      // Seleccionamos al primer cliente por defecto si existen
      if (dataClientes.length > 0) {
        setClienteSeleccionado(dataClientes[0].id);
      }
      setCargando(false);
    })
    .catch(err => {
      console.error("Error conectando a la API", err);
      setCargando(false);
    });
  }, []);

  const agregarAlCarrito = (prod) => {
    if (prod.stock === 0) return;
    const itemExistente = carrito.find(item => item.id === prod.id);
    if (itemExistente) {
      setCarrito(carrito.map(item => 
        item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...prod, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // 3. ENVÍO UNIFICADO AL BACKEND
  const procesarVenta = async () => {
    try {
      const payload = {
        usuarioId: sesionUsuario.id,
        clienteId: parseInt(clienteSeleccionado), // MANDA EL CLIENTE REAL
        metodoDePago: metodoPago,
        total: parseFloat(total.toFixed(2)),
        productos: carrito.map(item => ({
          id: item.id,
          stock: item.cantidad
        }))
      };

      const response = await fetch('http://localhost:8080/ventas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('¡Venta cobrada exitosamente en el sistema!');
        setCarrito([]);
        setMostrarModalPago(false);
        setMetodoPago('');
        
        // Recargar productos para ver stock actualizado
        setCargando(true);
        const resProd = await fetch('http://localhost:8080/productos/');
        if (resProd.ok) {
          const dataProd = await resProd.json();
          setProductos(dataProd);
        }
        setCargando(false);
      } else {
        alert('El servidor rechazó la venta. Revisa la consola de Java.');
      }
    } catch (error) {
      alert('Error de red al intentar cobrar la venta.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%', alignItems: 'flex-start', position: 'relative' }}>
      
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div style={{ flex: '7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#212529' }}>Punto de Venta</h1>
          <span style={{ color: '#6c757d', fontSize: '14px' }}>Cajero: {sesionUsuario.nombre}</span>
        </div>
        
        {cargando ? (
          <p style={{ color: '#6c757d' }}>Sincronizando sistema...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
            {productos.map((prod) => (
              <div 
                key={prod.id} 
                onClick={() => agregarAlCarrito(prod)}
                style={{ 
                  backgroundColor: prod.stock === 0 ? '#f8f9fa' : '#fff', 
                  color: prod.stock === 0 ? '#495057' : '#212529',
                  opacity: prod.stock === 0 ? 0.5 : 1,
                  padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6', 
                  cursor: prod.stock === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {prod.categoria || 'General'}
                </span>
                
                <h3 style={{ margin: '10px 0 4px 0', fontSize: '15px' }}>{prod.nombre}</h3>
                
                {/* LÍNEA DE TALLA Y COLOR RECUPERADA */}
                <p style={{ fontSize: '12px', color: '#6c757d', margin: '0 0 6px 0' }}>
                  Talla: {prod.talla} | Color: {prod.color}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>${parseFloat(prod.precio || 0).toFixed(2)}</p>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: prod.stock > 0 ? '#10b981' : '#dc2626' }}>Stock: {prod.stock}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      {/* SECCIÓN DERECHA: TICKET Y COBRO */}
      <div style={{ flex: '3', backgroundColor: '#fff', color: '#212529', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Ticket Actual</h2>
        
        {/* SELECTOR DE CLIENTES REAL */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', color: '#495057', fontWeight: 'bold' }}>Asignar Venta a Cliente:</label>
          <select 
            value={clienteSeleccionado} 
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #dee2e6' }}
          >
            <option value={-1}>Cliente General / Mostrador</option>
            {clientes.length === 0 ? <option value="">Sin clientes registrados</option> : null}
            {clientes.map(cli => (
              <option key={cli.id} value={cli.id}>{cli.nombre} - {cli.email}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', marginBottom: '20px' }}>
          {carrito.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px dashed #eee', paddingBottom: '10px' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.nombre}</div>
                {/* ESTA ES LA LÍNEA QUE REGRESA LA TALLA Y EL COLOR */}
                <div style={{ color: '#6c757d', fontSize: '12px' }}>Talla: {item.talla} | Color: {item.color}</div>
                <div style={{ color: '#6c757d', fontSize: '12px' }}>{item.cantidad} x ${parseFloat(item.precio).toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>${(item.precio * item.cantidad).toFixed(2)}</span>
                <button onClick={() => eliminarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 'bold', margin: '20px 0' }}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={() => setMostrarModalPago(true)}
          disabled={carrito.length === 0 || !clienteSeleccionado}
          style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer' }}>
          Cobrar Venta
        </button>
      </div>

      {/* MODAL DE PAGO */}
      {mostrarModalPago && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', zIndex: 20 }}>
          <div style={{ backgroundColor: '#fff', color: '#212529', padding: '30px', borderRadius: '8px', width: '350px' }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#212529' }}>Método de Pago</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
              {['efectivo', 'tarjeta', 'transferencia'].map(metodo => (
                <button
                  key={metodo} onClick={() => setMetodoPago(metodo)}
                  style={{
                    padding: '12px',
                    border: '1px solid',
                    borderColor: metodoPago === metodo ? '#3b82f6' : '#dee2e6',
                    borderRadius: '6px',
                    background: metodoPago === metodo ? '#eff6ff' : '#f8f9fa',
                    color: metodoPago === metodo ? '#0b1220' : '#212529',
                    fontWeight: metodoPago === metodo ? 'bold' : 'normal',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    outline: metodoPago === metodo ? '2px solid rgba(59,130,246,0.12)' : 'none'
                  }}
                >
                  {metodo}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setMostrarModalPago(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', color: '#212529', border: '1px solid #dee2e6', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={procesarVenta} disabled={!metodoPago} style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: !metodoPago ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}