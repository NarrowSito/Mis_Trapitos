import React, { useEffect, useState } from 'react';

export default function ReportesView() {
  const [resumen, setResumen] = useState(null);
  const [ventasSemana, setVentasSemana] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    Promise.all([
      fetch('http://localhost:8080/reportes/resumen').then(r => r.json()),
      fetch('http://localhost:8080/reportes/ventas-semana').then(r => r.json()),
      fetch('http://localhost:8080/reportes/top-productos?limit=3').then(r => r.json())
    ]).then(([resumenData, semanaData, topData]) => {
      setResumen(resumenData);

      // map semana data to last 7 days (fill missing days)
      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().slice(0,10);
        const found = semanaData.find(s => s.dia === iso);
        last7.push({ dia: iso, valor: found ? Number(found.valor) : 0 });
      }
      const max = Math.max(...last7.map(x => x.valor), 1);
      const semanaWithAlto = last7.map(x => ({ ...x, alto: `${Math.round((x.valor / max) * 100)}%`, label: formatDay(x.dia) }));
      setVentasSemana(semanaWithAlto);

      const top = topData.map(p => ({
        id: p.id,
        nombre: p.nombre,
        ventas: p.vendidos,
        ingreso: Number(p.ingreso || 0),
        stock: p.stock
      }));
      setTopProductos(top);

      setCargando(false);
    }).catch(err => {
      console.error('Error cargando reportes', err);
      setCargando(false);
    });
  }, []);

  function formatCurrency(n) {
    try {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);
    } catch (e) {
      return `$${n.toFixed(2)}`;
    }
  }

  function formatDay(isoDate) {
    const d = new Date(isoDate + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '').slice(0,3);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#212529' }}>Dashboard Analítico</h1>
        <p style={{ color: '#6c757d', marginTop: '5px' }}>Resumen de rendimiento comercial e inteligencia de ventas</p>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', borderLeft: '4px solid #10b981' }}>
          <p style={{ margin: '0 0 5px 0', color: '#6c757d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Ingresos Brutos (Mes)</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '26px', color: '#212529' }}>{resumen ? formatCurrency(Number(resumen.ingresosMes || 0)) : '—'}</h2>
            <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}>{resumen ? `${resumen.crecimiento}%` : '—'}</span>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ margin: '0 0 5px 0', color: '#6c757d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Tickets Generados</p>
          <h2 style={{ margin: 0, fontSize: '26px', color: '#212529' }}>{resumen ? resumen.ticketsTotales : '—'}</h2>
        </div>

        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ margin: '0 0 5px 0', color: '#6c757d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Ticket Promedio</p>
          <h2 style={{ margin: 0, fontSize: '26px', color: '#212529' }}>{resumen ? formatCurrency(Number(resumen.ticketPromedio || 0)) : '—'}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        <div style={{ flex: '6', backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#495057' }}>Ingresos por Día (Última Semana)</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #e9ecef' }}>
            {ventasSemana.map((item, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '10px', color: '#adb5bd', marginBottom: '5px' }}>{formatCurrency(item.valor)}</span>
                <div style={{ width: '100%', maxWidth: '40px', height: `calc(200px * ${parseInt(item.alto) / 100})`, backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 10px' }}>
            {ventasSemana.map((item, index) => (
              <span key={index} style={{ fontSize: '12px', color: '#6c757d', width: '100%', textAlign: 'center' }}>{item.label}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: '4', backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#495057' }}>Top 3 Variaciones Más Vendidas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {topProductos.map((prod, index) => (
              <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: index !== topProductos.length - 1 ? '1px solid #f8f9fa' : 'none' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#212529' }}>{prod.nombre}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Variación ID: #{prod.id} | Vendidos: {prod.ventas}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#10b981' }}>{formatCurrency(prod.ingreso)}</p>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: prod.stock < 5 ? '#fee2e2' : '#f3f4f6', color: prod.stock < 5 ? '#dc2626' : '#6b7280' }}>
                    Stock {prod.stock < 5 ? 'Bajo' : 'Normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}