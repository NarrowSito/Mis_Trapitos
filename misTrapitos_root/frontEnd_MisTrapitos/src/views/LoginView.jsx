import React, { useState } from 'react';

export default function LoginView({ onLoginExitoso }) {
  const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  // POST: Envio de credenciales al backend (Caso Ideal)
  const iniciarSesion = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      /* NOTA PARA EL EQUIPO: 
        Este es el contrato de Login. El frontend envia { usuario, password }
        y espera recibir un objeto de sesion con { id, nombre, rol }
      */
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });

      if (response.ok) {
        const datosUsuario = await response.json();
        onLoginExitoso(datosUsuario); // Le pasamos los datos a App.jsx
      } else {
        // Simulacion temporal para que puedas probar el front sin backend
        if (credenciales.usuario === 'ricardo' && credenciales.password === 'admin') {
          onLoginExitoso({ id: 1, nombre: 'Ricardo', rol: 'Administrador' });
        } else if (credenciales.usuario === 'ventas' && credenciales.password === '123') {
          onLoginExitoso({ id: 2, nombre: 'Vendedor 1', rol: 'Ventas' });
        } else if (credenciales.usuario === 'conta' && credenciales.password === '123') {
          onLoginExitoso({ id: 3, nombre: 'Contador 1', rol: 'Contabilidad' });
        } else {
          setError('Credenciales invalidas. Intente de nuevo.');
        }
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
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
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>Usuario de Empleado</label>
            <input required type="text" name="usuario" value={credenciales.usuario} onChange={manejarCambio} style={{ width: '100%', padding: '12px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>Contraseña</label>
            <input required type="password" name="password" value={credenciales.password} onChange={manejarCambio} style={{ width: '100%', padding: '12px', border: '1px solid #dee2e6', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={cargando} style={{ width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: cargando ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
            {cargando ? 'Validando...' : 'Iniciar Sesion'}
          </button>
        </form>
      </div>
    </div>
  );
}