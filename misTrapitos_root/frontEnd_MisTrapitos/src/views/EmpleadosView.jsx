import React, { useEffect, useState } from 'react';

export default function EmpleadosView() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: '', email: '', rol: '', password: '' });

  const cargar = () => {
    setCargando(true);
    fetch('http://localhost:8080/usuarios/').then(r => r.json()).then(data => { setUsuarios(data); setCargando(false); }).catch(e => { setError('No se pudo cargar usuarios'); setCargando(false); });
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => { setForm({ id: null, nombre: '', email: '', rol: 'Ventas', password: '' }); setMostrarModal(true); };

  const abrirEditar = (u) => { setForm({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, password: '' }); setMostrarModal(true); };

  const eliminar = async (id) => {
    if (!confirm('Eliminar usuario?')) return;
    await fetch(`http://localhost:8080/usuarios/${id}`, { method: 'DELETE' });
    cargar();
  };

  const guardar = async (e) => {
    e.preventDefault();
    const payload = { nombre: form.nombre, email: form.email, rol: form.rol, password: form.password };
    if (form.id) {
      await fetch(`http://localhost:8080/usuarios/${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      await fetch('http://localhost:8080/usuarios/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    setMostrarModal(false);
    cargar();
  };

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '28px', color: '#212529', marginBottom: '10px' }}>Gestión de Personal</h1>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>Altas, bajas y asignación de roles para el acceso al sistema.</p>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <strong>Usuarios</strong>
          <button onClick={abrirNuevo} style={{ padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px' }}>+ Nuevo</button>
        </div>

        {cargando ? <p style={{ color: '#6c757d' }}>Cargando...</p> : error ? <p style={{ color: '#dc2626' }}>{error}</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Rol</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>#{u.id}</td>
                  <td style={{ padding: '10px' }}>{u.nombre}</td>
                  <td style={{ padding: '10px' }}>{u.email}</td>
                  <td style={{ padding: '10px' }}>{u.rol}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => abrirEditar(u)} style={{ marginRight: '8px', padding: '6px 10px' }}>Editar</button>
                    <button onClick={() => eliminar(u.id)} style={{ padding: '6px 10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mostrarModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={guardar} style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '380px' }}>
            <h3 style={{ marginTop: 0 }}>{form.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
            <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px' }}>
              <option value="admin">admin</option>
              <option value="Ventas">Ventas</option>
              <option value="Almacen">Almacen</option>
            </select>
            {!form.id && <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setMostrarModal(false)} style={{ padding: '8px 12px' }}>Cancelar</button>
              <button type="submit" style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px' }}>Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}