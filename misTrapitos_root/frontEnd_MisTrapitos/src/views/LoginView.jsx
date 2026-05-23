import React, { useState } from 'react';

export default function LoginView({ onLoginExitoso }) {
  // CAMBIO 1: Usamos 'nombre' en lugar de 'usuario' para que haga match con Java
  const [credenciales, setCredenciales] = useState({ nombre: '', password: '' });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      // CAMBIO 2: Ruta limpia apuntando al POST del LoginController
      const response = await fetch('http://localhost:8080/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });

      if (response.ok) {
        const datosUsuario = await response.json();
        // Java nos regresa el objeto completo de PostgreSQL con el rol real
        onLoginExitoso(datosUsuario); 
      } else {
        setError('Credenciales inválidas en la Base de Datos. Intenta de nuevo.');
        setCargando(false);
      }
    } catch (err) {
      setError('Error al conectar con el servidor. ¿Está prendido Spring Boot?');
      setCargando(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f9' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#212529', fontSize: '24px' }}>Mis Trapitos</h1>
          <p style={{ margin: 0, color: '#6c757d' }}>Acceso al Sistema Interno</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={iniciarSesion} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>Nombre de Empleado</label>
            {/* CAMBIO 3: Actualizamos el input para que alimente 'nombre' */}
            <input required type="text" name="nombre" value={credenciales.nombre} onChange={manejarCambio} style={{ width: '100%', padding: '12px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>Contraseña</label>
            <input required type="password" name="password" value={credenciales.password} onChange={manejarCambio} style={{ width: '100%', padding: '12px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={cargando} style={{ width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: cargando ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
            {cargando ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}