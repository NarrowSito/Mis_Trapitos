import { useState, useEffect } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aquí hacemos la petición GET al endpoint que documentó tu equipo
    fetch('http://localhost:8080/productos/')
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('El servidor respondió con un error (Posible CORS)');
        return respuesta.json(); 
      })
      .then((datos) => {
        console.log("¡Datos recibidos!", datos);
        setProductos(datos);
      })
      .catch((err) => {
        console.error('Hubo un problema:', err);
        setError('No se pudo conectar al backend (¿Está encendido el servidor de Java?).');
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Sistema de Gestión "Mis Trapitos"</h1>
      <h2>Prueba de conexión Frontend - Backend</h2>
      
      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px' }}>
          <strong>Aviso esperado:</strong> {error}
        </div>
      )}

      <ul>
        {productos.length === 0 && !error ? (
          <p>Cargando productos...</p>
        ) : (
          productos.map((prod, index) => (
            <li key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <strong>{prod.nombre}</strong> - ${prod.precio} <br />
              <small>{prod.descripcion} | Stock: {prod.stock} | Categoría: {prod.categoria}</small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;